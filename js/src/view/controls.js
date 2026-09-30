/**
 * Native editing (source plan §4.11, S10, S11): one ControlAdapter per built form control consumes the
 * `value` attribute. Data → DOM goes through `project`, DOM → Data through `commit`; HtmlElement
 * writes neither the `value` property nor the `value` attribute of an element that has an adapter.
 * Checkbox and radio consume `value` as a boolean; RadioGroups gives the radios of a group their name.
 */

import {XHTML_NS} from '../renderer/attributes.js';

// The elements whose `type`, `multiple` and `group` have no setter: a change rebuilds (C04.1, D7).
const CONTROL_TAGS = new Set(['input', 'select', 'textarea']);
const REBUILD_ATTRIBUTES = ['type', 'multiple', 'group'];

/** The resolved value of the attribute `name` of `node`: a pointer reads the Data. */
function resolved(node, name) {
    const value = node.getAttr(name);
    return node.pointerType(value) ? node.getRelativeData(value) : value;
}

export class ControlAdapter {
    // Whether `live` moves the write from `change` to `input` (gate decision 3).
    static liveWrites = false;
    // Whether a literal `value` is also written as the default a native form Reset restores.
    static writesDefault = true;
    #binding;
    #record;
    #committing = false;
    #composing = false;
    #pending = false;

    /** The ControlAdapter of a built element, or null when the element is not a form control. */
    static for(binding, record) {
        const Control = ControlAdapter.classFor(record.element, record.attrs);
        return Control ? new Control(binding, record) : null;
    }

    /**
     * The ControlAdapter subclass of `element` with the applied `attrs`, or null. `hidden` and `file`
     * have no adapter, the button types belong to S12; a type the browser does not know is its text
     * state.
     */
    static classFor(element, attrs) {
        if (element.namespaceURI !== XHTML_NS) return null;
        if (element.localName === 'textarea') return TextControl;
        if (element.localName === 'select') return SelectControl;
        if (element.localName !== 'input') return null;
        const type = attrs.type == null ? 'text' : String(attrs.type).toLowerCase();
        return Object.hasOwn(INPUT_CONTROLS, type) ? INPUT_CONTROLS[type] : TextControl;
    }

    /**
     * The resolved `type`, `multiple` and `group` of a form control element, as one comparable
     * string, or null for any other element: a different shape rebuilds the element (C04.1, D7).
     * `attrs` are the attributes of the renderer's resolved projection (`^`, `=` and `==` resolved).
     */
    static shape(element, attrs) {
        if (element?.namespaceURI !== XHTML_NS || !CONTROL_TAGS.has(element.localName)) return null;
        return JSON.stringify(REBUILD_ATTRIBUTES.map(name => attrs[name] ?? null));
    }

    constructor(binding, record) {
        this.#binding = binding;
        this.#record = record;
    }

    get binding() { return this.#binding; }
    get element() { return this.#record.element; }
    get node() { return this.binding.node; }
    /** The attributes of the last resolved projection of the node (`^`, `=` and `==` resolved). */
    get resolved() { return this.#record.resolved; }
    /**
     * The `live` of the last resolved projection, JS truthiness: `^` and `==` follow the Data, `=` is read
     * at every projection of the node (GC-210 §090); a change needs no rebuild.
     */
    get live() { return Boolean(this.resolved.live); }
    /** The DOM event that writes the Data: `input` with `live` on the controls that accept it, else `change`. */
    get writeEvent() { return this.constructor.liveWrites && this.live ? 'input' : 'change'; }

    /**
     * Data → DOM. During an IME composition the projection waits for its end. P1: while this adapter
     * is writing the Data, a value equal to what the DOM already holds (typed comparison) is not
     * written back; any other value is, so a correction made by a controller reaches the control.
     * A literal value (neither `^` nor `=`) is first written as the default, so a native form Reset
     * restores it; a pointer value is written as the property only (P1).
     */
    project(value, change) {
        if (this.#composing) {
            this.#pending = true;
            return;
        }
        if (this.#committing && this.same(this.read(), value)) return;
        if (this.constructor.writesDefault && !this.node.pointerType(this.node.getAttr('value'))) {
            this.writeDefault(value);
        }
        this.write(value);
    }

    /** DOM → typed value: the text of the control. */
    read() {
        return this.element.value;
    }

    /** Show `value`: null is empty. An equal value is not written again, so the caret stays. */
    write(value) {
        const target = value == null ? '' : String(value);
        if (this.element.value !== target) this.element.value = target;
    }

    /**
     * Write `value` as the default: the `value` attribute of an input, the text of a textarea (its
     * text node, which the renderer keeps). null is empty; an equal default is not written again.
     */
    writeDefault(value) {
        const target = value == null ? '' : String(value);
        if (this.element.localName === 'textarea') {
            if (this.#record.text.data !== target) this.#record.text.data = target;
        } else if (this.element.defaultValue !== target) {
            this.element.defaultValue = target;
        }
    }

    /** Whether the value read from the DOM and the value to project are the same typed value. */
    same(current, value) {
        return Object.is(current, value);
    }

    /**
     * Write `read()` at the `value` pointer (`^`, `?attr` included). A literal or `=` value accepts
     * input and writes nothing (gate decision 5); a null path raises from the listener (Q7). A closed
     * NodeBinding writes nothing (R12).
     */
    commit(event) {
        if (this.binding.closed) return;
        const pointer = this.node.getAttr('value');
        if (this.node.pointerType(pointer) !== '^') return;
        this.#committing = true;
        try {
            this.node.setRelativeData(pointer.slice(1), this.read());
        } finally {
            this.#committing = false;
        }
    }

    attach() {
        for (const type of ['input', 'change', 'compositionstart', 'compositionend']) {
            this.element.addEventListener(type, this);
        }
    }

    detach() {
        for (const type of ['input', 'change', 'compositionstart', 'compositionend']) {
            this.element.removeEventListener(type, this);
        }
        this.#pending = false;
    }

    /** Called after every projection of the node; a control whose membership depends on its context follows it. */
    refresh() {}

    /**
     * DOM listener: no write during a composition; at its end the write per `live`, then the waiting
     * projection. The control of a closed NodeBinding (a node removed under freeze) does nothing (R12).
     */
    handleEvent(event) {
        if (this.binding.closed) return;
        if (event.type === 'compositionstart') {
            this.#composing = true;
            return;
        }
        if (event.type === 'compositionend') {
            this.#composing = false;
            if (this.writeEvent === 'input') this.commit(event);
            if (this.#pending) {
                this.#pending = false;
                this.binding.runtime.renderer.project(this.node);
            }
            return;
        }
        if (this.#composing || event.isComposing) return;
        if (event.type === this.writeEvent) this.commit(event);
    }
}

/** text, password, email, url, tel, search, textarea: a string; the empty string stays. */
export class TextControl extends ControlAdapter {
    static liveWrites = true;
}

/** number: a finite number or null; empty → null; an invalid draft stays in the field (gate decision 2). */
export class NumberControl extends ControlAdapter {
    static liveWrites = true;

    read() {
        return this.element.value === '' ? null : Number(this.element.value);
    }

    commit(event) {
        if (this.element.validity.badInput) return;
        super.commit(event);
    }
}

/** range: a number; the browser may limit the shown value, the projection does not write the Data. */
export class RangeControl extends ControlAdapter {
    static liveWrites = true;

    read() {
        return Number(this.element.value);
    }
}

/**
 * select: a string or null; multiple: an array of strings, also []. A value without option selects
 * nothing. The default of a select is the `selected` attribute of its option nodes, not written here.
 */
export class SelectControl extends ControlAdapter {
    static writesDefault = false;

    read() {
        if (this.element.multiple) return [...this.element.selectedOptions].map(option => option.value);
        return this.element.selectedIndex === -1 ? null : this.element.value;
    }

    write(value) {
        const element = this.element;
        if (element.multiple) {
            if (value != null && !Array.isArray(value)) {
                throw new TypeError(`${this.node.nodeTag} '${this.node.label}': a multiple select requires an array`);
            }
            const selected = new Set((value ?? []).map(String));
            for (const option of element.options) {
                const on = selected.has(option.value);
                if (option.selected !== on) option.selected = on;
            }
        } else if (value == null) {
            if (element.selectedIndex !== -1) element.selectedIndex = -1;
        } else if (element.selectedIndex === -1 || element.value !== String(value)) {
            element.value = String(value);
        }
    }

    same(current, value) {
        if (!Array.isArray(current)) return super.same(current, value);
        return Array.isArray(value) && value.length === current.length
            && value.every((item, index) => Object.is(item, current[index]));
    }
}

/** date, time, month, week, datetime-local: the lexical string or null; no Date, no time zone. */
export class TemporalControl extends ControlAdapter {
    read() {
        return this.element.value === '' ? null : this.element.value;
    }
}

/** color: the serialized string; the browser's normalization does not write the Data. */
export class ColorControl extends ControlAdapter {}

/**
 * checkbox: `value` is the boolean of `checked` (D4). A non-boolean Data value is shown with JS
 * truthiness, null is off, only `true`/`false` are written, on `change`. A literal or `=` value sets
 * the initial state and writes nothing; an authored `checked` with a `^` value raises (two sources).
 * The default is the authored `checked` attribute, written by html.js, not by this adapter.
 */
export class CheckboxControl extends ControlAdapter {
    static writesDefault = false;

    read() {
        return this.element.checked;
    }

    write(value) {
        const on = Boolean(value);
        if (this.element.checked !== on) this.element.checked = on;
    }

    same(current, value) {
        return current === Boolean(value);
    }

    attach() {
        const node = this.node;
        if (node.getAttr('checked') != null && node.pointerType(node.getAttr('value')) === '^') {
            throw new TypeError(`${node.nodeTag} '${node.label}': checked and a ^ value are two sources`);
        }
        super.attach();
    }
}

/**
 * radio: one boolean per button (D4). With `group` the button joins RadioGroups, which generates its
 * DOM `name` (P11); without `group` it is a standalone boolean. Choosing a button writes `true` on
 * it, then `false` on the other bound buttons of the group that are on, in join order, synchronously (legacy
 * dijit RadioButton order); a `true` from the Data does the same through the same method (C04.2).
 */
export class RadioControl extends CheckboxControl {
    #name = null;
    #projected = false;

    /** The RadioGroups of the page's live renderer. */
    get groups() { return this.binding.runtime.renderer.radioGroups; }

    /**
     * Join the group and write the generated `name`. Raises before any effect when the node also
     * authors `name` (two names) or when it is on and another button of the group is on (P11); a
     * button whose node was removed under freeze is not counted (its NodeBinding is closed).
     */
    attach() {
        const node = this.node;
        const group = this.resolved.group ?? null;
        const form = formNode(node);
        if (group != null) {
            if (node.getAttr('name') != null) {
                throw new TypeError(`${node.nodeTag} '${node.label}': name and group are two names`);
            }
            this.#requireSingleTrue(group, form);
        }
        super.attach();
        if (group == null) return;
        this.#name = this.groups.join(this, group, form);
        this.element.setAttribute('name', this.#name);
    }

    detach() {
        if (this.#name !== null) {
            this.groups.leave(this);
            this.element.removeAttribute('name');
            this.#name = null;
        }
        super.detach();
    }

    /**
     * Follow the semantic form owner: when a `form` or `formId` above the node was added, removed or
     * moved, the button leaves its group and joins the group of the same name in its new scope, with a
     * new generated `name`; the NodeBinding and the element stay (ASTRA-04). A button that is on and
     * meets another button on in the new scope raises before any effect, as at the join (P11).
     */
    refresh() {
        if (this.#name === null) return;
        const group = this.resolved.group;
        const form = formNode(this.node);
        if (this.groups.nameOf(group, form) === this.#name) return;
        this.#requireSingleTrue(group, form);
        this.groups.leave(this);
        this.#name = this.groups.join(this, group, form);
        this.element.setAttribute('name', this.#name);
    }

    /**
     * The button is on and another button of `group` within `form` is on: an error. A button whose node
     * was removed under freeze is not counted (its NodeBinding is closed).
     */
    #requireSingleTrue(group, form) {
        const node = this.node;
        if (resolved(node, 'value') && this.groups.peersOf(group, form).some(peer => !peer.binding.closed && peer.read())) {
            throw new Error(`${node.nodeTag} '${node.label}': several true values in radio group '${group}'`);
        }
    }

    /** Data → DOM; a button turned on by the Data, after its first projection, turns its peers off (C04.2). */
    project(value, change) {
        const first = !this.#projected;
        this.#projected = true;
        const was = this.read();
        super.project(value, change);
        if (!first && !was && this.read()) this.turnOffPeers();
    }

    /**
     * DOM → Data: `true` on this button, then `false` on its bound peers. The peers follow the user's
     * choice even when a recipient of the first write turned this button off again; a recipient that
     * removed this button stops the choice there (R12).
     */
    commit(event) {
        const chosen = this.read();
        super.commit(event);
        if (chosen && !this.binding.closed) this.turnOffPeers();
    }

    /**
     * Turn the other buttons of the group off. A peer that is on in the Data and bound with `^` gets
     * `false` through its own guarded commit; a peer already off is not written (legacy dijit
     * RadioButton turns off only the checked peers). A peer whose node was removed under freeze is
     * left alone, and a write that removes this button stops the loop (R12).
     */
    turnOffPeers() {
        if (this.#name === null) return;
        for (const peer of this.groups.peers(this)) {
            if (this.binding.closed) return;
            if (peer.binding.closed) continue;
            if (peer.element.checked) peer.element.checked = false;
            if (resolved(peer.node, 'value')) peer.commit(null);
        }
    }
}

/**
 * The radio groups of one live renderer (P11). A group is the `group` value within its form: the
 * nearest Source ancestor with `formId` or `form=true`, or none. The generated `name` joins the
 * renderer's instance id, the form and the group, so two Gramlot pages never share a group.
 */
export class RadioGroups {
    #renderer;
    #groups = new Map();
    #names = new Map();
    // One index per form node, in order of first use; a removed form node is not retained.
    #forms = new WeakMap();
    #nextForm = 0;

    constructor(renderer) {
        this.#renderer = renderer;
    }

    /** Add `control` to `group` within `form` (a Source node or null) and return the generated name. */
    join(control, group, form) {
        const name = this.nameOf(group, form);
        if (!this.#groups.has(name)) this.#groups.set(name, new Set());
        this.#groups.get(name).add(control);
        this.#names.set(control, name);
        return name;
    }

    leave(control) {
        const name = this.#names.get(control);
        this.#names.delete(control);
        const members = this.#groups.get(name);
        members?.delete(control);
        if (members?.size === 0) this.#groups.delete(name);
    }

    /** The other buttons of the group of `control`, in join order. */
    peers(control) {
        const name = this.#names.get(control);
        return [...this.#groups.get(name) ?? []].filter(member => member !== control);
    }

    /** The buttons already in `group` within `form`, in join order. */
    peersOf(group, form) {
        return [...this.#groups.get(this.nameOf(group, form)) ?? []];
    }

    /** The generated DOM name of `group` within `form`. */
    nameOf(group, form) {
        if (form !== null && !this.#forms.has(form)) this.#forms.set(form, this.#nextForm++);
        const scope = form === null ? 'page' : `form${this.#forms.get(form)}`;
        return `gramlot-${this.#renderer.instanceId}-${scope}-${group}`;
    }
}

/** The nearest Source node, from `node` upwards, with `formId` or `form=true` (as `#FORM`), or null. */
function formNode(node) {
    for (let current = node; current; current = current.parentNode) {
        const attrs = current.getAttr() ?? {};
        if (attrs.formId != null || attrs.form === true) return current;
    }
    return null;
}

// The input types with an adapter, and those without one (S10 gate decision 1).
const INPUT_CONTROLS = {
    text: TextControl, password: TextControl, email: TextControl, url: TextControl,
    tel: TextControl, search: TextControl,
    number: NumberControl, range: RangeControl, color: ColorControl,
    date: TemporalControl, time: TemporalControl, month: TemporalControl, week: TemporalControl,
    'datetime-local': TemporalControl, checkbox: CheckboxControl, radio: RadioControl,
    hidden: null, file: null,
    button: null, submit: null, reset: null, image: null,
};
