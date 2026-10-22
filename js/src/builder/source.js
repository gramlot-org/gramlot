import {BagCbResolver} from '@genrojs/bag';
import {SourceBag, SourceBagNode, sourceAttributeItems, wrapSource} from '@genrojs/builders';
import {fromTytx, getSubtypeDict, setSubtypeDict, toTytx} from '@genrojs/tytx';
import {pointerTransform, pointerDependencies} from '@genrojs/builders';
import {resolvePointerAttribute} from '../binding/pointer.js';

// The inline code attributes of each tag, besides `connect_on<event>` and the `==` expressions of any tag.
const CODE_ATTRIBUTES = {
    dataFormula: ['formula', '_if', '_else', '_ask_if', '_ask_onCancel'],
    dataController: ['script', '_if', '_else', '_ask_if', '_ask_onCancel'],
    dataRpc: ['_ask_if', '_ask_onCancel', '_if', '_else', '_onCalling', '_onResult', '_onError'],
    dataRemote: ['_if', '_else', '_onCalling'],
};

// The control attributes of `remote`, written on the node as they are; every other parameter becomes `remote_<k>`.
const REMOTE_CONTROLS = ['_cachedRemote', '_if', '_else', '_onRemote', '_onCalling', '_delay', '_timing', '_userChanges'];
// The inline code attributes of any node whose `remote` is a string.
const REMOTE_CODE_ATTRIBUTES = ['_if', '_else', '_onRemote', '_onCalling'];

/**
 * The requests of one Source node, read as `node.requests`: the one rule of `remote`, `dataRpc`, `dataRemote`
 * and `gramlot.src.remoteSource` (GC-095 §105).
 *
 * - One request is in flight. It always finishes and its answer is applied; only the removal of the node, the
 *   close of the page or the `timeout` of a `dataRpc` aborts it.
 * - The first call made while a request is in flight waits, with its method and its parameters of that moment
 *   (`pending`). The calls after it do nothing. When the answer arrives, the waiting call is sent.
 * - `inflight.cancel()` makes the node ignore the answer of the request in flight and frees it at once. The call
 *   whose `_onCalling` runs the cancel is then sent, in place of a waiting call; a cancel made elsewhere sends
 *   the waiting call.
 * - A method name that is null, empty or outside the name syntax of the page builder (`nameSyntax` of the
 *   `rootBuilder` of the node) rejects the call when it is sent.
 *
 * `inflight` is `{method, params, sentAt, cancel()}` and `pending` is `{method, params}`, each null when empty;
 * `params` is a copy of the parameters as sent or saved, `sentAt` the send time in ms (`Date.now()`).
 */
export class NodeRequests {
    #nameSyntax;
    #inflight = null;
    #pending = null;
    // True while the `_onCalling` of a new call runs: a cancel then frees the request for that call.
    #calling = false;

    /** The requests of a node whose method names follow `nameSyntax` (a NameSyntax). */
    constructor(nameSyntax) {
        this.#nameSyntax = nameSyntax;
    }

    /** The request in flight, `{method, params, sentAt, cancel()}`, or null. */
    get inflight() {
        return this.#inflight?.view ?? null;
    }

    /** The call waiting for the answer of the request in flight, `{method, params}`, or null. */
    get pending() {
        const pending = this.#pending;
        if (!pending) return null;
        return Object.freeze({method: pending.method, get params() { return fromTytx(pending.text); }});
    }

    /**
     * Run `onCalling`, the `_onCalling` of a call, before the call: a result `false` blocks it. Without
     * `onCalling` the call is allowed. A refused or failed `onCalling` that cancelled the request in flight
     * sends the waiting call.
     */
    calling(onCalling) {
        if (!onCalling) return true;
        let allowed = false;
        const outer = this.#calling;
        this.#calling = true;
        try {
            allowed = onCalling() !== false;
        } finally {
            this.#calling = outer;
            if (!allowed && !this.#inflight) this.#next();
        }
        return allowed;
    }

    /**
     * Send the call of `method` with `params` now, keep it waiting, or drop it, by the rule of the class.
     * `perform(request)` sends it and applies the answer; `request` has `method`, `params`, `text` (the TYTX of
     * the parameters), `controller` (its AbortController, aborted by the removal of the node, the close of the
     * page or a `timeout`) and `ignored` (true after `cancel()`). Returns the promise of `perform`, settled when the call has
     * run; a dropped call, or a waiting call never sent, gives undefined.
     */
    submit(method, params, perform) {
        try {
            const text = toTytx(params);
            if (this.#inflight) {
                if (this.#pending) return Promise.resolve(undefined);
                return new Promise((resolve, reject) => {
                    this.#pending = {method, text, perform, resolve, reject};
                });
            }
            // A call sent while another waits follows a cancel made by its `_onCalling`: it is newer, the waiting one is dropped.
            this.#pending?.resolve(undefined);
            this.#pending = null;
            return this.#start(method, params, text, perform);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Run the synchronous call of `method` now: `perform()` sends it and returns its value, which this method
     * returns. It is never in flight for another call: nothing else runs while it waits. A request of the node
     * in flight, or a method outside the name syntax, is an error.
     */
    submitSync(method, perform) {
        if (this.#inflight) throw new Error('A synchronous call cannot start while a request of the node is in flight');
        if (!this.#nameSyntax.matches(method)) {
            throw new TypeError(`Method name must match ${this.#nameSyntax.pattern}, not ${JSON.stringify(method)}`);
        }
        return perform();
    }

    /** Send the waiting call, if any, with its saved method and parameters. */
    #next() {
        const pending = this.#pending;
        if (!pending) return;
        this.#pending = null;
        let result;
        try {
            result = this.#start(pending.method, fromTytx(pending.text), pending.text, pending.perform);
        } catch (error) {
            result = Promise.reject(error);
        }
        result.then(pending.resolve, pending.reject);
    }

    #start(method, params, text, perform) {
        if (!this.#nameSyntax.matches(method)) {
            return Promise.reject(new TypeError(`Method name must match ${this.#nameSyntax.pattern}, not ${JSON.stringify(method)}`));
        }
        const controller = new AbortController();
        const record = {method, params, text, controller, ignored: false};
        record.view = Object.freeze({method, get params() { return fromTytx(text); }, sentAt: Date.now(),
            cancel: () => this.#cancel(record)});
        this.#inflight = record;
        // An abort ends the request at once: the waiting call does not wait for an answer that is not applied.
        controller.signal.addEventListener('abort', () => this.#finish(record), {once: true});
        let result;
        try {
            result = Promise.resolve(perform(record));
        } catch (error) {
            result = Promise.reject(error);
        }
        result.then(() => this.#finish(record), () => this.#finish(record));
        return result;
    }

    #finish(record) {
        if (this.#inflight !== record) return;
        this.#inflight = null;
        this.#next();
    }

    #cancel(record) {
        if (this.#inflight !== record) return;
        record.ignored = true;
        this.#inflight = null;
        if (!this.#calling) this.#next();
    }
}

/** Whether `value` is a `==` expression (Q11.2). */
function isExpression(value) {
    return typeof value === 'string' && value.startsWith('==');
}

/**
 * Gramlot Source node: Builder's SourceBagNode plus the Data behavior Builder lacks.
 *
 * SET and GET remain Builder's and go through setRelativeData and getRelativeData, which apply
 * the null path rule (Q7): a read gives null, a write is an error. FIRE writes through
 * setRelativeData too, with the Gramlot reset rules.
 */
export class GramlotBuilderBagNode extends SourceBagNode {
    // Attributes ending in `_path` whose pointer symbol was already reported.
    #reportedPathPointers = new Set();
    // The texts of the inline code received with the Source, by the name InlineCompiler uses; null before activation.
    #activatedCode = null;
    #requests = null;

    /** The requests of this node (NodeRequests): the request in flight and the waiting call of remote, dataRpc and dataRemote. */
    get requests() {
        return this.#requests ??= new NodeRequests(this.rootBuilder.nameSyntax);
    }

    /**
     * The inline code attributes of this node as `[name, text]`, under the names InlineCompiler uses:
     * `formula` of a dataFormula, `script` of a dataController, `_if`/`_else` of the four providers, the
     * `_onCalling`/`_onResult`/`_onError` of a dataRpc and the `_onCalling` of a dataRemote, `action` of a
     * button, `_if`/`_else`/`_onRemote`/`_onCalling` of a node whose `remote` is a string, every `connect_on<event>`,
     * every `==` attribute (canonical name) and a `==` node value (`''`). Script elements also retain
     * their literal executable text and URLs here for the live renderer's activation check.
     */
    codeAttributes() {
        const own = [...(CODE_ATTRIBUTES[this.nodeTag] ?? []),
            ...Object.entries(this.parentNode?._getMeta('gramlot_component')?.childParameters ?? {}).filter(([, spec]) => spec.inline).map(([name]) => name),
            ...(this._getMeta('gramlot_component')?.command ? ['action', '_ask_if'] : []),
            ...(typeof this.getAttr('remote') === 'string' ? REMOTE_CODE_ATTRIBUTES : [])];
        const items = [];
        for (const [name, value] of Object.entries(this.getAttr() ?? {})) {
            if (typeof value === 'string' && (own.includes(name) || name === 'validate_call' || name === 'validate__onResult' || name === 'validate_onAccept' || name === 'validate_onReject' || /^validate_\w+_if$/.test(name) || name.startsWith('connect_on') || name.startsWith('subscribe_') || name.startsWith('selfsubscribe_'))) items.push([name, value]);
        }
        for (const attribute of ['ask', '_ask']) {
            const spec = this.getAttr(attribute);
            if (spec && typeof spec === 'object') {
                for (const key of ['_if', 'askIf']) {
                    if (typeof spec[key] === 'string') items.push([`${attribute}.${key}`, spec[key]]);
                }
            }
        }
        for (const [name, value] of sourceAttributeItems(this.getAttr())) {
            if (isExpression(value)) items.push([name, value]);
            if (this.nodeTag === 'script' && typeof value === 'string') {
                const prefix = this.builder.constructor.dialectPrefixes.find(prefix => name.startsWith(prefix)) ?? '';
                if (['src', 'href', 'xlink:href', 'xlink_href', '_text'].includes(name.slice(prefix.length).toLowerCase())) items.push([name, value]);
            }
        }
        if (isExpression(this.staticValue) || this.nodeTag === 'script' && typeof this.staticValue === 'string') items.push(['', this.staticValue]);
        return items;
    }

    /**
     * Activate the inline code of this node: the current texts of its code attributes become the only
     * texts InlineCompiler runs for it. Called by GramlotBuilderBag.activateCode, from SourceHandler.prepareSource:
     * a text written later is not run. A code attribute holding a `^`/`=` pointer is an error, because
     * its text would come from Data.
     */
    activateCode() {
        const code = new Map();
        for (const [name, text] of this.codeAttributes()) {
            if (this.pointerType(text)) {
                throw new Error(`${this.nodeTag} '${this.label}': '${name}' is inline code and cannot be the pointer `
                    + `'${text}'; inline code is never read from Data`);
            }
            code.set(name, text);
        }
        for (const [name, text] of [...sourceAttributeItems(this.getAttr()), ['datapath', this.getAttr('datapath')]]) {
            if (pointerTransform(text)?.expression) code.set(name, text);
        }
        this.#activatedCode = code;
    }

    /** The text of the inline code `name` received with the Source, or null when it was not received. */
    activatedCode(name) {
        return this.#activatedCode?.get(name) ?? null;
    }

    /**
     * Declare the content of this element as the fragment `name` of a `@source` method: writes
     * `remote = name` and one `remote_<k> = v` per entry of `params` on this node; the control attributes
     * `_cachedRemote`, `_if`, `_else`, `_onRemote`, `_onCalling`, `_delay`, `_timing` and `_userChanges` are
     * written as they are. Returns this node. `name` is a method name, matched by the name syntax of the
     * page builder (`nameSyntax` of `rootBuilder`), or a `^`/`=` pointer to it; any other name, or another
     * `_` parameter, is a TypeError.
     */
    remote(name, params = {}) {
        const syntax = this.rootBuilder.nameSyntax;
        if (typeof name !== 'string' || !(this.pointerType(name) || syntax.matches(name))) {
            throw new TypeError(`${this.nodeTag} '${this.label}': remote name must be a pointer or match `
                + `${syntax.pattern}, not ${JSON.stringify(name)}`);
        }
        const invalid = Object.keys(params).find(key => key.startsWith('_') && !REMOTE_CONTROLS.includes(key));
        if (invalid) {
            throw new TypeError(`${this.nodeTag} '${this.label}': remote parameter '${invalid}' is not accepted; `
                + `the control attributes are ${REMOTE_CONTROLS.join(', ')}`);
        }
        const attributes = {remote: name};
        for (const [key, value] of Object.entries(params)) {
            attributes[REMOTE_CONTROLS.includes(key) ? key : `remote_${key}`] = value;
        }
        this.setAttr(attributes);
        return wrapSource(this);
    }

    /** Publish to this node's selfsubscribe topics, as in the legacy Source API. */
    publish(topic, payload = {}) {
        return this.rootBuilder.binding.subscriptions.publishNode(this, topic, payload);
    }

    /** Builder's `^` pointers, except the attributes ending in `_path`, which hold a bare path. */
    pointers() {
        const datapath = this.getAttr('datapath');
        const dependencies = pointerTransform(datapath) ? pointerDependencies(this, datapath) : new Set();
        const result = super.pointers().filter(([name, pointer]) => !dependencies.has(name) && !this.#isPathAttribute(name, pointer))
            .map(([name, pointer]) => [name, pointerTransform(pointer)?.pointer ?? pointer]);
        for (const name of dependencies) {
            const value = this.getAttr(name);
            if (this.pointerType(value) === '^') result.push(['datapath', pointerTransform(value)?.pointer ?? value]);
        }
        return result;
    }

    /**
     * Builder's items to resolve, with the Gramlot rules applied before Builder's runtimeValues:
     * an attribute ending in `_path` loses its pointer symbol; a pointer on a null path (Q7)
     * is resolved as null.
     */
    runtimeToEvaluate() {
        const items = super.runtimeToEvaluate();
        for (const [name, value] of items) {
            if (!this.pointerType(value)) continue;
            if (pointerTransform(value)) {
                if (typeof name !== 'string') throw new Error(`${this.nodeTag} '${this.label}': pointer suffixes belong to attributes; use format/mask for node text`);
                // Gramlot's empty variable context has no absolute Data path. Resolve
                // that structural state here; Builder receives an already typed value.
                if (this.absDatapath(value) === null) {
                    items.set(name, new BagCbResolver(() => resolvePointerAttribute(this, name)));
                }
                continue;
            }
            if (this.#isPathAttribute(name, value)) items.set(name, value.slice(1));
            else if (this.absDatapath(value) === null) items.set(name, null);
        }
        return items;
    }

    /**
     * The value of the attribute `name`; for an attribute ending in `_path` written as a pointer, the
     * bare path, with the one warning per declaration of the `_path` rule (the same check as
     * runtimeToEvaluate).
     */
    pathAttribute(name) {
        const value = this.getAttr(name);
        if (pointerTransform(value)) return resolvePointerAttribute(this, name);
        return this.pointerType(value) && this.#isPathAttribute(name, value) ? value.slice(1) : value;
    }

    /** Builder's read; null on a null path (Q7). */
    getRelativeData(path, defaultValue = null, options = {}) {
        if (this.absDatapath(path) === null) return null;
        return super.getRelativeData(path, defaultValue, options);
    }

    /** Builder's write; an error on a null path (Q7). */
    setRelativeData(path, value, options = {}) {
        this.#requireWritablePath(path);
        super.setRelativeData(path, value, options);
    }

    /** Write without any Data event (Bag doTrigger=false); an error on a null path (Q7). */
    PUT(path, value) {
        this.#requireWritablePath(path);
        this.data.setItem(this.absDatapath(path), value, null, '>', false, true, this, false, false);
    }

    /**
     * A fired write that always fires (Q8): the current value is reset to null silently, then written
     * with `fired`; a null value writes `true` (D4). The value is reset to null in a `finally`, also
     * when a recipient raises, and the error propagates (P12, R10). A `?attr` path fires the
     * attribute with the same rules and leaves the node value alone, as legacy `fireEvent`.
     * `attributes` are written on the Data node with the fired value, as legacy `setRelativeData`
     * with `fired` (a button's `fire` writes `modifier` and `_counter`, S12); they stay after the reset.
     */
    FIRE(path, value = true, attributes = null) {
        if (value === null) value = true;
        this.#requireWritablePath(path);
        const absolute = this.absDatapath(path);
        if (absolute.includes('?')) {
            this.#fireAttribute(absolute, value);
            return;
        }
        this.data.getNode(absolute)?.setValue(null, false);
        try {
            this.fireEvent(path, value, {attributes});
        } finally {
            this.data.getNode(absolute)?.setValue(null, false);
        }
    }

    /**
     * FIRE of the attribute `attr` of `target?attr`: silent reset of the attribute, the write of the
     * attribute alone with `fired` (the node value is kept; a missing node is created with null), then
     * the silent reset to null in a `finally`.
     */
    #fireAttribute(absolute, value) {
        const [target, attr] = absolute.split('?', 2);
        const data = this.data;
        data.getNode(target)?.setAttr({[attr]: null}, false);
        try {
            const existing = data.getNode(target);
            if (existing) existing.setValue(existing.staticValue, true, {[attr]: value}, true, true, true, true);
            else data.setItem(target, null, {[attr]: value}, '>', true, true, true, true);
        } finally {
            data.getNode(target)?.setAttr({[attr]: null}, false);
        }
    }

    /**
     * FIRE after `delay` ms. A null path (Q7) is an error at the call, not inside the timer. The timer
     * is tracked on the node's NodeBinding when the node has one, so the close of the node cancels it;
     * the returned function cancels it as well.
     */
    FIRE_AFTER(path, value = true, delay = 10) {
        this.#requireWritablePath(path);
        const binding = this.rootBuilder?.binding?.bindingFor(this) ?? null;
        let release = null;
        const timer = setTimeout(() => {
            release?.();
            this.FIRE(path, value);
        }, delay);
        release = binding?.track(() => clearTimeout(timer)) ?? null;
        return () => {
            clearTimeout(timer);
            release?.();
        };
    }

    /** Builder's absDatapath, keeping `?attr` on symbolic paths. */
    absDatapath(path) {
        path = pointerTransform(path)?.pointer ?? path;
        const bare = this.pointerType(path) ? path.slice(1) : path;
        if (bare.startsWith('#') && bare.includes('?')) {
            const [target, attr] = bare.split('?', 2);
            const resolved = super.absDatapath(target);
            return resolved === null ? null : `${resolved}?${attr}`;
        }
        return super.absDatapath(path);
    }

    /**
     * Builder's datapath climb, reading a pointer datapath from Data (variable datapath).
     * A datapath that makes the path symbolic (`#<id>`, `#FORM`, `#ANCHOR`), written or read
     * from Data, is resolved from the parent of the node that carries it.
     */
    _composeRelativeDatapath(path, raw) {
        let current = this;
        while (current !== null && path.startsWith('.')) {
            let datapath = current.getAttr('datapath');
            if (this.pointerType(datapath)) {
                datapath = this.#variableDatapath(current, datapath);
                if (datapath === null) return null;
            }
            if (datapath !== null && datapath !== undefined) {
                path = path === '.' ? datapath : datapath + path;
            }
            if (path.startsWith('#')) return current.parentNode._resolveSymbolicDatapath(path, raw);
            current = current.parentNode;
        }
        if (path.startsWith('.')) {
            throw new Error(`unresolved relative datapath: ${raw}`);
        }
        return path;
    }

    /** An empty variable datapath gives a null path. */
    _finalizeAbsPath(path, attr) {
        return path === null ? null : super._finalizeAbsPath(path, attr);
    }

    /** Builder's symbolic resolution; `#<nodeId>` reads the nodeId map of the page runtime when there is one (R06). */
    _resolveSymbolicDatapath(path, raw) {
        const symbol = path.slice(1).split('.', 1)[0];
        if (symbol === 'FORM' || symbol === 'ANCHOR') return super._resolveSymbolicDatapath(path, raw);
        const runtime = this.rootBuilder?.binding;
        if (!runtime) return super._resolveSymbolicDatapath(path, raw);
        const anchor = runtime.nodeIds.get(symbol);
        if (!anchor) throw new Error(`#<id>: cannot resolve ${raw}`);
        const relpath = path.slice(symbol.length + 2);
        return anchor.absDatapath(relpath ? `.${relpath}` : '.');
    }

    /**
     * The datapath read from Data for a pointer datapath, or null when empty. The pointer is read in
     * the context of the carrier's parent; the value counts as if written in place of the pointer.
     */
    #variableDatapath(carrier, pointer) {
        if (pointerTransform(pointer)) {
            const value = resolvePointerAttribute(carrier, 'datapath', carrier.parentNode);
            return value == null || value === '' ? null : value;
        }
        const path = carrier.parentNode.absDatapath(pointer);
        if (path === null) return null;
        const value = this.data.getItem(path);
        return value === null || value === undefined || value === '' ? null : value;
    }

    /** Whether `name` ends in `_path`; a pointer there loses its symbol, with one warning per attribute. */
    #isPathAttribute(name, value) {
        if (pointerTransform(value)) return false;
        if (typeof name !== 'string' || !name.endsWith('_path')) return false;
        if (!this.#reportedPathPointers.has(name)) {
            this.#reportedPathPointers.add(name);
            console.warn(`${this.nodeTag} '${this.label}': '${name}' holds a bare Data path; `
                + `the pointer symbol of '${value}' is removed`);
        }
        return true;
    }

    /** A write on a null path (Q7) is an error naming the node and the path. */
    #requireWritablePath(path) {
        if (this.absDatapath(path) === null) {
            throw new Error(`${this.nodeTag} '${this.label}': write on a null path: '${path}'`);
        }
    }
}

/** Gramlot Source Bag: every node it creates is a GramlotBuilderBagNode. */
export class GramlotBuilderBag extends SourceBag {
    get nodeClass() {
        return GramlotBuilderBagNode;
    }

    /**
     * A copy of this Source without the elements whose `auth` rule `auth` refuses, as the Python
     * `authorized_copy`. `auth` is a function `rule => null | 'not_authenticated' | 'not_authorized'`.
     * An element whose `auth` attribute `auth` answers with a code is left out with its subtree;
     * nested Source branches are copied the same way. This Bag is not changed. A non-string `auth`
     * attribute is a TypeError.
     */
    authorizedCopy(auth) {
        const result = new this.constructor();
        for (const node of this.getNodes()) {
            const rule = node.getAttr('auth') ?? null;
            if (rule !== null) {
                if (typeof rule !== 'string') {
                    throw new TypeError(`${node.nodeTag} '${node.label}': 'auth' must be a string rule, not ${typeof rule}`);
                }
                if (auth(rule) !== null) continue;
            }
            let value = node.staticValue;
            if (value instanceof GramlotBuilderBag) value = value.authorizedCopy(auth);
            const {auth: _rule, ...attributes} = node.getAttr();
            const copied = result.setItem(node.label, value, attributes, '>', false, false, null, false, true,
                null, node.nodeTag);
            copied.xmlTag = node.xmlTag;
        }
        return result;
    }

    /** Activate the inline code of every node, nested Source branches included (GramlotBuilderBagNode.activateCode); returns this. */
    activateCode() {
        for (const node of this.getNodes()) {
            node.activateCode();
            if (node.staticValue instanceof GramlotBuilderBag) node.staticValue.activateCode();
        }
        return this;
    }
}

// GramlotBuilderBag travels on the TYTX wire as "::X" with __cls "GramlotBuilderBag":
// its name joins the subtype dictionary of its type, as Builder does for SourceBag.
// The name already owned by another class is a collision.
if ((getSubtypeDict(GramlotBuilderBag.tytxSuffix).GramlotBuilderBag ?? GramlotBuilderBag) !== GramlotBuilderBag) {
    throw new Error("TYTX subtype name 'GramlotBuilderBag' is already registered for another class");
}
setSubtypeDict(GramlotBuilderBag.tytxSuffix, {...getSubtypeDict(GramlotBuilderBag.tytxSuffix), GramlotBuilderBag});
