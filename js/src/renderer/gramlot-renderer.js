/* @ts-self-types="./gramlot-renderer.d.ts" */
/**
 * The live renderer of a Gramlot page.
 *
 * @module
 */
import {BuilderBase, SourceBag, sourceTarget} from '@genrojs/builders';
import {HtmlElement} from '../view/html.js';
import {ControlAdapter, RadioGroups, SelectControl} from '../view/controls.js';
import {ButtonBinding} from '../view/button.js';
import {NativeEventBinding} from '../view/events.js';
import {References} from '../references.js';
import {GramlotBuilderBag, GramlotBuilderBagNode} from '../builder/source.js';
import {BindingRuntime} from '../binding/runtime.js';
import {requireInstallable} from '../binding/installation.js';
import {GramlotHtmlRenderer} from './gramlot-html-renderer.js';
import {displayItem} from './attributes.js';

/**
 * Own the live DOM lifecycle driven by typed Source insert/update/delete events.
 * The attribute rules are GramlotHtmlRenderer's; this class replaces its output with DOM elements.
 */
export class GramlotRenderer extends GramlotHtmlRenderer {
    static renderType = 'object';
    // Nodes inside buildNode: events on them are ignored on arrival (P4, R04).
    #constructing = new Set();
    // The attributes of each node after runtimeValues and the `==` evaluation, binding attributes included.
    #resolvedAttributes = new WeakMap();
    // The resolved projection that `project` hands to the rebuild of a control whose shape changed.
    #rebuildAttributes = new WeakMap();

    /** The live renderer of one Gramlot page: `binding` is the page's BindingRuntime (§4.3). */
    constructor(builder, source, destination, {binding} = {}) {
        super(builder);
        if (!(builder instanceof BuilderBase) || !(source instanceof GramlotBuilderBag) || destination?.nodeType !== 1) {
            throw new TypeError('GramlotRenderer requires a BuilderBase, GramlotBuilderBag and HTML destination');
        }
        if (!(binding instanceof BindingRuntime)) throw new TypeError('GramlotRenderer requires a BindingRuntime');
        if (!(source._builder instanceof BuilderBase)) throw new TypeError('SourceBag requires builder ownership');
        this._binding = binding;
        this.source = source;
        this.destination = destination;
        this.html = new HtmlElement({metadataAttributes: ['__ref']});
        this.records = new Map();
        this.references = new References(source);
        this.pending = [];
        this.building = false;
        this.disposed = false;
        this.elements = new WeakMap();
        // The instance id scopes the generated radio names to this page (P11, S11).
        this.instanceId = crypto.randomUUID();
        this.radioGroups = new RadioGroups(this);
        this.subscription = `html-source-renderer-${this.instanceId}`;
        source.subscribe(this.subscription, {any: event => this.receive(event)});
    }

    get binding() { return this._binding; }
    /** The page's InlineCompiler: the live renderer evaluates the `==` expressions (S09). */
    get inlineCompiler() { return this.binding.inlineCompiler; }

    /**
     * The resolved projection of `node` (runtimeValues, then `==`, GC-210 C04.1), kept for the consumers
     * of binding attributes that never reach the element: `type`, `multiple`, `group`, `live`, `visible`.
     * The rebuild of a control whose shape changed receives the projection `project` just computed, so
     * its `==` are evaluated once.
     */
    evaluateExpressions(node, runtimeAttrs) {
        const attrs = this.#rebuildAttributes.get(node) ?? super.evaluateExpressions(node, runtimeAttrs);
        this.#rebuildAttributes.delete(node);
        this.#resolvedAttributes.set(node, attrs);
        return attrs;
    }

    /**
     * Structural Source fragments are owned by the live renderer.
     * A data-element has no DOM: it is recognized before validation and runtimeValues (R08).
     * A node brought into the Source during the current construction, by a Source event still in
     * the queue (an `_init`, an observer), is built when that event is processed (P4).
     */
    render(node, opts = {}) {
        if (!(node instanceof GramlotBuilderBagNode)) throw new TypeError('Source children must be GramlotBuilderBagNodes');
        if (node._getMeta('data_element')) return null;
        if (!this.binding.bindingFor(node) && this.#queued(node)) return null;
        if (node.nodeTag) this.html.validate(node, node._getMeta('subbuilder') ? node.parentBag._builder : node.builder);
        else if (!(node.value instanceof SourceBag)) throw new TypeError('Source fragments must contain child SourceBags');
        return node.nodeTag ? super.render(node, opts) : this.renderFragment(node, opts);
    }

    renderFragment(node, {document = this.destination.ownerDocument, ...opts} = {}) {
        const fragment = document.createDocumentFragment();
        const record = {
            node, binding: this.#nodeBinding(node), container: null, parent: null, children: new Set(), cleanup: [],
            start: document.createComment('source-fragment'),
            end: document.createComment('/source-fragment'),
        };
        this.records.set(node, record);
        this.elements.set(fragment, record);
        fragment.append(record.start);
        for (const child of node.value.getNodes()) {
            const rendered = this.render(child, {document, ...opts});
            if (rendered === null) continue;
            fragment.append(rendered);
            const childRecord = this.elements.get(rendered);
            if (childRecord) {
                childRecord.parent = record;
                record.children.add(child);
            }
        }
        fragment.append(record.end);
        return fragment;
    }

    /**
     * RendererBase's dialect hook: create one detached element. The attributes arrive adapted by the
     * node's renderer (this one for HTML, GramlotSvgRenderer for SVG); an HTML node also gets its
     * noConvertStyle attributes back and its display directives consumed, as in the string output.
     * A form control gets its ControlAdapter after `compose`, so the first projection of a `select`
     * finds its options (S10); the adapter is detached through `record.cleanup`, which also takes a
     * radio out of its RadioGroups group (S11). A `<button>` gets its ButtonBinding, then each
     * `connect_on<event>` its NativeEventBinding, so the button mechanism runs first (S12); both are
     * detached through `record.cleanup`.
     */
    renderedItem(node, item, runtimeAttrs, {tag, document = this.destination.ownerDocument} = {}) {
        let attrs = runtimeAttrs;
        item = this.expressionValue(node, item);
        if (this.getRender(node.builder) === this) {
            [item, attrs] = displayItem(item, this.restoreNativeAttributes(node, runtimeAttrs));
        }
        const children = Array.isArray(item) ? item : [];
        const text = Array.isArray(item) ? attrs._text : item;
        const resolved = this.#resolvedAttributes.get(node);
        const record = {
            node,
            binding: this.#nodeBinding(node),
            container: null,
            parent: null,
            children: new Set(),
            cleanup: [],
            resolved,
            ...this.html.create(node, document, tag, attrs, resolved.visible ?? null),
        };
        this.html.compose(record, text, children);
        record.shape = ControlAdapter.shape(record.element, resolved);
        // Registered before any listener: a failed first projection leaves a record the failed-build
        // cleanup removes, listeners included (ASTRA-06).
        this.records.set(node, record);
        this.elements.set(record.element, record);
        const control = ControlAdapter.for(record.binding, record);
        if (control) {
            record.control = control;
            control.attach();
            record.cleanup.push(() => control.detach());
            this.#projectControl(record, node, attrs, null);
        }
        const button = ButtonBinding.for(record.binding, record);
        if (button) {
            record.button = button;
            button.attach();
            record.cleanup.push(() => button.detach());
        }
        this.#connectEvents(record);
        this.references?.register(node, record.element);
        for (const element of children) {
            const child = this.elements.get(element);
            if (!child) continue;
            child.parent = record;
            child.container = record.element;
            record.children.add(child.node);
        }
        return record.element;
    }

    /**
     * Validate a detached candidate without changing the observed Source (§5.1 step 1): grammar,
     * installation rules (`requireInstallable`) and references. Mounted references below
     * replacingNode are excluded when checking a replacement.
     */
    validateCandidate(block, {replacingNode = null} = {}) {
        if (!(block instanceof GramlotBuilderBag)) throw new TypeError('Source values must be GramlotBuilderBags');
        const excluded = new Set();
        const exclude = node => {
            excluded.add(node);
            for (const child of this.records.get(node)?.children ?? []) exclude(child);
        };
        // Replacing a node's VALUE retains that node and its reference. Only
        // the rendered descendants which the replacement removes leave the ref set.
        // During freeze these can differ from the current Source descendants.
        for (const child of this.records.get(replacingNode)?.children ?? []) exclude(child);
        this.#validateBlock(block, replacingNode ? replacingNode.nodeTag : null);
        requireInstallable(block);
        this.references?.validate(block, excluded);
        return block;
    }

    #validateBlock(block, parentTag = null) {
        const bags = new Set();
        const walk = (bag, parentTag = null) => {
            if (!(bag instanceof GramlotBuilderBag) || bags.has(bag)) {
                throw new TypeError('Source values must be unshared, acyclic GramlotBuilderBags');
            }
            if (!(bag._builder instanceof BuilderBase)) throw new TypeError('SourceBag requires builder ownership');
            bags.add(bag);
            for (const node of bag.getNodes()) {
                if (!(node instanceof GramlotBuilderBagNode)) throw new TypeError('Source children must be GramlotBuilderBagNodes');
                if (!(node.builder instanceof BuilderBase)) throw new TypeError('SourceBagNode requires builder ownership');
                if (node.resolver) throw new TypeError('Source resolvers are outside this port');
                if (node._getMeta('data_element')) {
                    // A data-element is not a visual child: its own declaration only.
                    node.builder.validateNode(node);
                } else if (node.nodeTag) {
                    // The enclosing Bag owns the boundary declaration; the node
                    // and its contents already belong to the entered dialect.
                    const owner = node._getMeta('subbuilder') ? bag._builder : node.builder;
                    this.html.validate(node, owner);
                    if (!node._getMeta('subbuilder')) {
                        node.builder.validateParent(node.nodeTag, parentTag);
                    }
                } else {
                    if (!(node.value instanceof SourceBag)) {
                        throw new TypeError('Source fragments must contain child SourceBags');
                    }
                    if (Object.keys(node.attr).some(key => key !== '_meta')) {
                        throw new TypeError('Fragment attributes are unsupported');
                    }
                }
                if (node.value instanceof SourceBag) {
                    walk(node.value, node._getMeta('subbuilder') ? null : (node.nodeTag ?? parentTag));
                }
            }
        };
        walk(block, parentTag);
    }

    /** Suspend rendering for a mounted branch; Source keeps changing normally. */
    freeze(node) {
        node = sourceTarget(node);
        const record = this.records.get(node);
        if (!record || this.disposed) throw new Error('Freeze requires a mounted Source node');
        record.frozen = true;
    }

    /** Resume the whole branch and build its current Source once. */
    unfreeze(node) {
        node = sourceTarget(node);
        const record = this.records.get(node);
        if (!record || this.disposed) throw new Error('Unfreeze requires a mounted Source node');
        const thaw = record => {
            delete record.frozen;
            for (const child of record.children) thaw(this.records.get(child));
        };
        thaw(record);
        if (this.#isFrozen(node)) return;
        if (this.attached(node)) this.#rebuild(node);
        else this.remove(node);
    }

    #isFrozen(node) {
        while (node) {
            const record = this.records.get(node);
            if (record?.frozen) return true;
            // Deleted nodes may have lost their Source parent. Their existing
            // mount record still belongs to the frozen, previously rendered branch.
            node = node.parentBag?.parentNode ?? record?.parent?.node;
        }
        return false;
    }

    /**
     * Source event intake (§5.2): an event on a node under construction is ignored
     * on arrival; every other event is queued and processed in arrival order.
     * Semantic work runs for every event, also under freeze; structural work only
     * outside frozen branches. A failing disposer does not block the rest: the
     * closing errors of the semantic work and the cleanup errors of the removals
     * are thrown after the structural work of the event.
     */
    receive(event) {
        if (this.disposed) return;
        if (Array.isArray(event.node)) {
            const nodes = event.node.filter(node => !this.#constructing.has(node));
            if (!nodes.length) return;
            event = {...event, node: nodes};
        } else if (this.#constructing.has(event.node)) return;
        this.pending.push(event);
        if (this.building) return;
        this.building = true;
        try {
            while (this.pending.length) {
                const next = this.pending.shift();
                if (next.evt !== 'del' && !this.attached(next.node)) continue;
                if (next.evt !== 'del' && next.evt !== 'upd_attrs') this.#requireGramlotClasses(next);
                const errors = this.binding.handleSourceEvent(next);
                try { this.#applyStructure(next, errors); }
                catch (error) {
                    if (!errors.length) throw error;
                    errors.push(error);
                }
                if (errors.length) throw errors.length === 1 ? errors[0] : new AggregateError(errors, 'Source cleanup failed');
            }
        } catch (error) {
            this.pending.length = 0;
            throw error;
        } finally {
            this.building = false;
        }
    }

    /**
     * The structural work of one Source event outside frozen branches: `insert`, `remove`, `update`.
     * The cleanup errors of the removals of a `del` go to `errors`, so every removed node leaves.
     */
    #applyStructure(event, errors) {
        if (event.evt === 'del') {
            for (const node of Array.isArray(event.node) ? event.node : [event.node]) {
                if (this.#isFrozen(node)) continue;
                const parent = this.records.get(node)?.parent ?? null;
                try { this.remove(node); } catch (error) { errors.push(error); }
                this.#optionsChanged(parent);
            }
            return;
        }
        if (this.#isFrozen(event.node)) return;
        if (event.evt === 'ins') this.insert(event.node);
        else if (event.evt.startsWith('upd_')) this.update(event.node, event.evt);
        else throw new Error(`Unsupported Source event: ${event.evt}`);
    }

    /** Whether `node` still belongs to the observed Source. */
    attached(node) {
        let bag = node.parentBag;
        while (bag && bag !== this.source) bag = bag.parentNode?.parentBag;
        return bag === this.source;
    }

    /** Whether `node` or one of its ancestors is the node of a Source event still in the queue. */
    #queued(node) {
        const pending = new Set(this.pending.flatMap(event => Array.isArray(event.node) ? event.node : [event.node]));
        for (let current = node; current; current = current.parentBag?.parentNode) {
            if (pending.has(current)) return true;
        }
        return false;
    }

    /** R07: an inserted node or a new value is made of Gramlot Source classes, checked before any effect. */
    #requireGramlotClasses(event) {
        const walk = node => {
            if (!(node instanceof GramlotBuilderBagNode)) throw new TypeError('Source children must be GramlotBuilderBagNodes');
            if (node.value instanceof SourceBag) {
                if (!(node.value instanceof GramlotBuilderBag)) throw new TypeError('Source values must be GramlotBuilderBags');
                for (const child of node.value.getNodes()) walk(child);
            }
        };
        walk(event.node);
    }

    /**
     * Build an inserted node, then report the build to the BindingRuntime (§5.1 step 7). A node that
     * left the Source meanwhile (an `_init` that removed its own branch, P4) is not built, nor a node
     * already built with its ancestor while its own event waited in the queue. A data-element has no
     * DOM: its build is the report alone.
     */
    insert(node) {
        if (!this.attached(node) || this.records.has(node)) return;
        if (node._getMeta('data_element')) {
            // A `dataController` or `dataRpc` inserted in a button may give it a mechanism, or an ambiguous one (S12).
            this.records.get(node.parentBag?.parentNode)?.button?.refresh();
            this.binding.branchBuilt(node);
            return;
        }
        const parent = this.records.get(node.parentBag?.parentNode);
        const container = parent?.element ?? parent?.container ?? this.destination;
        const siblings = node.parentBag.getNodes();
        let before = parent?.end ?? null;
        for (let i = siblings.indexOf(node) + 1; i < siblings.length; i++) {
            const record = this.records.get(siblings[i]);
            if (record) { before = record.element ?? record.start; break; }
        }
        this.buildNode(node, container, before, parent);
    }

    buildNode(node, container, before = null, parent = null) {
        this.#constructing.add(node);
        let output;
        try { output = this.render(node, {document: container.ownerDocument}); }
        catch (error) { this.#discardBuild(node, error); }
        finally { this.#constructing.delete(node); }
        const record = this.records.get(node);
        container.insertBefore(output, before);
        record.parent = parent;
        this.assignContainer(record, container);
        parent?.children.add(node);
        this.#optionsChanged(parent);
        this.binding.branchBuilt(node);
        return record;
    }

    /**
     * A failed build leaves no record: the children render before their parent, so the records made
     * for the branch before the error are removed with their cleanups (listeners, controls, radio
     * groups, references); then the error propagates. A node not built yet has no built descendant.
     */
    #discardBuild(node, error) {
        const errors = [error];
        const nodes = [];
        const walk = current => {
            nodes.push(current);
            if (current.value instanceof SourceBag) for (const child of current.value.getNodes()) walk(child);
        };
        walk(node);
        for (const each of nodes.reverse()) {
            try { this.remove(each); } catch (cleanupError) { errors.push(cleanupError); }
        }
        throw errors.length === 1 ? error : new AggregateError(errors, 'Source build and cleanup failed');
    }

    assignContainer(record, container) {
        record.container = container;
        const childContainer = record.element ?? container;
        for (const childNode of record.children) {
            const child = this.records.get(childNode);
            if (child) this.assignContainer(child, childContainer);
        }
    }

    update(node, event) {
        const record = this.records.get(node);
        if (!record) { this.insert(node); return; }
        const scalarValue = node.value == null || ['string', 'number', 'boolean'].includes(typeof node.value);
        const scalarValueUpdate = event === 'upd_value' && scalarValue
            && record.element && record.children.size === 0 && this.html.matches(record, node);
        if ((event === 'upd_attrs' || scalarValueUpdate) && record.element && this.html.matches(record, node)) {
            if (node.nodeTag) this.html.validate(node, node._getMeta('subbuilder') ? node.parentBag._builder : node.builder);
            this.project(node);
            // A change of `type`, `multiple` or `group` rebuilt the element inside project (C04.1).
            if (event === 'upd_attrs' && this.records.get(node) === record) {
                this.references?.remove(node);
                this.references?.register(node, record.element);
            }
        } else {
            this.#rebuild(node);
        }
    }

    /**
     * Project the current Source and Data of `node` on its element, keeping the element: the same
     * adaptation as the first render, by the node's own renderer (R16). A node without an element
     * (not built yet, frozen before its first build, a fragment) is left alone; under freeze the
     * elements already built are projected. `change` is the DataChange that asked for it, or null.
     * A form control whose resolved `type`, `multiple` or `group` changed is rebuilt instead, keeping
     * its NodeBinding; under freeze the rebuild waits for the thaw (C04.1, D7). The resolved projection
     * (runtimeValues, then `==`) is computed once and is what every consumer reads, the rebuild included.
     */
    project(node, change = null) {
        const record = this.records.get(node);
        if (!record?.element) return;
        const renderer = this.getRender(node.builder);
        const [value, runtimeAttrs] = node.builder.runtimeValues(node);
        const [, resolvedAttrs] = renderer._handleMeta(node, runtimeAttrs);
        const resolved = this.#resolvedAttributes.get(node);
        if (record.shape !== ControlAdapter.shape(record.element, resolved)) {
            if (this.#isFrozen(node)) return;
            this.#rebuildAttributes.set(node, resolved);
            try { this.#rebuild(node); }
            finally { this.#rebuildAttributes.delete(node); }
            return;
        }
        record.resolved = resolved;
        let attrs = node._getMeta('subbuilder') ? resolvedAttrs : renderer.adaptAttrs(resolvedAttrs);
        const branch = node.value instanceof SourceBag;
        let text = branch ? [] : this.expressionValue(node, value);
        if (renderer === this) [text, attrs] = displayItem(text, this.restoreNativeAttributes(node, attrs));
        this.html.update(record, node, attrs, branch ? attrs._text : text, resolved.visible ?? null);
        this.#projectControl(record, node, attrs, change);
        record.control?.refresh();
        record.button?.refresh();
        this.#connectEvents(record);
        if (record.element.localName === 'option' || record.element.localName === 'optgroup') {
            this.#optionsChanged(record.parent);
        }
    }

    /**
     * The resolved `value` to the ControlAdapter of `record` when the node declares a `value`, or declared
     * one at the previous projection: its removal shows the control empty once, as html.js did (S10).
     */
    #projectControl(record, node, attrs, change) {
        if (!record.control) return;
        const declared = node.getAttr('value') != null;
        if (declared || record.valueDeclared) record.control.project(attrs.value ?? null, change);
        record.valueDeclared = declared;
    }

    /**
     * Make the NativeEventBindings of `record` follow the `connect_on<event>` attributes of its node:
     * a removed or changed attribute loses its listener, a new or changed one gets a new listener,
     * an unchanged one keeps its own (S12). The first listener of the record brings one cleanup that
     * detaches them all.
     */
    #connectEvents(record) {
        const declared = new Map(NativeEventBinding.declared(record.node).map(item => [item[0], item]));
        if (!record.events) {
            if (!declared.size) return;
            record.events = new Map();
            record.cleanup.push(() => {
                for (const binding of record.events.values()) binding.detach();
                record.events.clear();
            });
        }
        for (const [attribute, binding] of [...record.events]) {
            if (declared.get(attribute)?.[2] === binding.handler) continue;
            binding.detach();
            record.events.delete(attribute);
        }
        for (const [attribute, [, eventName, handler]] of declared) {
            if (record.events.has(attribute)) continue;
            const binding = new NativeEventBinding(record.binding, record, eventName, handler, attribute);
            binding.attach();
            record.events.set(attribute, binding);
        }
    }

    /**
     * The children of `record` changed: the nearest `select` above it, through option groups and
     * fragments, is projected again, so its Data value meets the current options (gate decision 8).
     */
    #optionsChanged(record) {
        for (let current = record; current; current = current.parent) {
            if (current.control instanceof SelectControl) {
                this.project(current.node);
                return;
            }
            if (current.element && current.element.localName !== 'optgroup') return;
        }
    }

    /** The element built from `node`, or null (fragment, data-element, node not built or no longer in the Source). */
    getDomNode(sourceNode) {
        const node = sourceTarget(sourceNode);
        const record = this.records.get(node);
        return record && this.attached(node) ? record.element ?? null : null;
    }

    /** The Source node of the nearest element generated by this renderer, climbing from `domNode`, or null. */
    getBaseSourceNode(domNode) {
        for (let current = domNode; current; current = current.parentNode) {
            const record = current.nodeType === 1 ? this.elements.get(current) : null;
            if (record) return this.attached(record.node) ? record.node : null;
        }
        return null;
    }

    /** The NodeBinding of a node being rendered: it is opened before rendering (§5.1 step 4). */
    #nodeBinding(node) {
        const binding = this.binding.bindingFor(node);
        if (!binding) throw new Error(`${node.nodeTag ?? 'fragment'} '${node.label}': rendered without an open NodeBinding`);
        return binding;
    }

    #rebuild(node) {
        const record = this.records.get(node);
        const before = record.element?.nextSibling ?? record.end?.nextSibling ?? null;
        const container = record.container;
        const parent = record.parent;
        let removeError = null;
        try { this.remove(node); }
        catch (error) { removeError = error; }
        try {
            this.buildNode(node, container, before, parent);
        } catch (commitError) {
            if (removeError) {
                throw new AggregateError(
                    [removeError, commitError],
                    'Source replacement cleanup and commit failed',
                );
            }
            throw commitError;
        }
        if (removeError) throw removeError;
    }

    onDispose(node, callback) {
        const record = this.records.get(node);
        if (!record) throw new Error('Source node is not mounted');
        record.cleanup.push(callback);
        return () => {
            const index = record.cleanup.indexOf(callback);
            if (index !== -1) record.cleanup.splice(index, 1);
        };
    }

    remove(node) {
        const record = this.records.get(node);
        if (!record) return;
        const errors = [];
        for (const child of [...record.children]) {
            try { this.remove(child); } catch (error) { errors.push(error); }
        }
        for (const cleanup of record.cleanup.splice(0).reverse()) {
            try { cleanup(); } catch (error) { errors.push(error); }
        }
        this.references?.remove(node);
        if (record.element) this.elements.delete(record.element);
        record.element?.remove();
        record.start?.remove();
        record.end?.remove();
        record.parent?.children.delete(node);
        this.records.delete(node);
        if (errors.length) throw new AggregateError(errors, 'Source cleanup failed');
    }

    dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.source.unsubscribe(this.subscription, {any: true});
        this.pending.length = 0;
        const errors = [];
        const roots = [...this.records.entries()]
            .filter(([, record]) => !record.parent)
            .map(([node]) => node);
        for (const node of roots) {
            try { this.remove(node); } catch (error) { errors.push(error); }
        }
        if (errors.length) throw new AggregateError(errors, 'Renderer cleanup failed');
    }
}
