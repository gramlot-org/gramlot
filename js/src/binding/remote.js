import {toTytx} from '@genrojs/tytx';
import {TriggerTimers} from './providers.js';

/**
 * The `remote` attribute of a Source node (GC-095 §105): the content of the element is the fragment of a
 * `@source` method, requested through `gramlot.src.remoteSource` when the node starts and again when a
 * `^` pointer of `remote` or of a `remote_<k>` parameter changes. Owned by the node's NodeBinding. The
 * requests follow the rule of `node.requests` (NodeRequests): one in flight, its fragment always mounted, the
 * first change during the flight waiting with its parameters; the removal of the node cancels them (P24).
 *
 * The control attributes: `_cachedRemote` (no call when name and parameters equal those of the request in
 * flight, or of the fragment mounted last when none is in flight), `_if` (inline, false → no call, and `_else`
 * runs when present; a readiness condition that never cancels a request), `_onCalling` (inline, before the
 * call; `false` makes no call), `_onRemote` (inline, after the fragment is mounted), `_delay` (ms of debounce
 * of a Data change), `_timing` (seconds between two calls) and `_userChanges` (only the changes of level
 * `node` call). The inline code has the parameters as locals and `this` = the node.
 */
export class RemoteBinding {
    #binding;
    #timers;
    // The name and TYTX parameters of the fragment mounted last on the node, whoever requested it.
    #lastName = null;
    #lastParams = null;

    constructor(binding) {
        this.#binding = binding;
        this.#timers = new TriggerTimers(binding);
    }

    get binding() { return this.#binding; }
    get node() { return this.binding.node; }
    get closed() { return this.binding.closed; }

    /** Start `_timing` again from its current value: called at every registration of the node's pointers. */
    register() {
        this.#timers.startTiming(this.#control('_timing'), () => this.update());
    }

    /**
     * A Data change of `remote` or of a `remote_<k>` parameter: `_userChanges` lets only the level `node`
     * through; `_delay` debounces, the last change wins and the parameters are read when the call starts.
     */
    receive(change) {
        if (this.#control('_userChanges') && change.level !== 'node') return;
        const delay = this.#control('_delay');
        if (delay > 0) this.#timers.debounce(delay, () => this.update());
        else this.update();
    }

    /**
     * Request the fragment for the current parameters. Nothing happens before the node's `start` step,
     * on a closed node, or when `_if`, `_cachedRemote` or `_onCalling` stop the call. A call made while a
     * request is in flight waits, or does nothing when another call already waits (NodeRequests). A failure
     * of the request, a method name outside the syntax included, rejects with an error naming the node, its
     * cause attached.
     */
    async update() {
        if (this.closed || !this.binding.hasStamp('start')) return;
        const node = this.node;
        const [, attrs] = node.rootBuilder.runtimeValues(node);
        const name = attrs.remote;
        const params = {};
        for (const [key, value] of Object.entries(attrs)) {
            if (key.startsWith('remote_')) params[key.slice('remote_'.length)] = value;
        }
        const condition = node.getAttr('_if');
        if (condition && !this.#inline('_if', condition, `return (${condition})`, params)) {
            const otherwise = node.getAttr('_else');
            if (otherwise) this.#inline('_else', otherwise, otherwise, params);
            return;
        }
        let mounted;
        try {
            const text = toTytx(params);
            if (attrs._cachedRemote && this.#cached(name, text)) return;
            const onCalling = node.getAttr('_onCalling');
            if (!node.requests.calling(onCalling ? () => this.#inline('_onCalling', onCalling, onCalling, params) : null)) return;
            mounted = await this.binding.runtime.gramlot.src.remoteSource(node, name, params);
        } catch (error) {
            throw new Error(`${node.nodeTag} '${node.label}': remote '${name}' failed: ${error.message}`, {cause: error});
        }
        const onRemote = node.getAttr('_onRemote');
        if (mounted && onRemote) this.#inline('_onRemote', onRemote, onRemote, params);
    }

    /**
     * Record the fragment `remoteSource` mounted on the node, with its method and the TYTX of its parameters:
     * `_cachedRemote` compares with it. A fragment requested from code replaces the record too.
     */
    fragmentMounted(method, text) {
        this.#lastName = method;
        this.#lastParams = text;
    }

    /** Whether `name` and `text` equal the request in flight, or the fragment mounted last when none is in flight. */
    #cached(name, text) {
        const inflight = this.node.requests.inflight;
        if (inflight) return inflight.method === name && toTytx(inflight.params) === text;
        return name === this.#lastName && text === this.#lastParams;
    }

    /** The current value of a control attribute: a pointer is read from Data. */
    #control(name) {
        const [, attrs] = this.node.rootBuilder.runtimeValues(this.node);
        return attrs[name] ?? null;
    }

    #inline(attr, code, source, params) {
        return this.binding.runtime.inlineCompiler.compile(this.node, attr, code, Object.keys(params), source)(params);
    }
}
