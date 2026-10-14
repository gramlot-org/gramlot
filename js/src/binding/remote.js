import {toTytx} from '@genrojs/tytx';

/**
 * The `remote` attribute of a Source node (GC-095 §105): the content of the element is the fragment of a
 * `@source` method, requested through `gramlot.src.remoteSource` when the node starts and again when a
 * `^` pointer of `remote` or of a `remote_<k>` parameter changes. Owned by the node's NodeBinding; the
 * request is cancelled with it by `remoteSource` itself (P24), and the answer of a superseded request is
 * dropped there (latest wins).
 *
 * The control attributes: `_cachedRemote` (no call when name and parameters equal the last mount's), `_if`
 * (inline, false → no call, and `_else` runs when present), `_onRemote` (inline, after the fragment is
 * mounted). The inline code has the parameters as locals and `this` = the node.
 */
export class RemoteBinding {
    #binding;
    // The name and TYTX parameters of the last mounted call, captured before sending it.
    #lastName = null;
    #lastParams = null;

    constructor(binding) {
        this.#binding = binding;
    }

    get binding() { return this.#binding; }
    get node() { return this.binding.node; }
    get closed() { return this.binding.closed; }

    /**
     * Request the fragment for the current parameters. Nothing happens before the node's `start` step,
     * on a closed node, without a name, or when `_if` or `_cachedRemote` stop the call; a false `_if`
     * also cancels the request in flight, so its fragment is not mounted after `_else`. A cache hit
     * cancels a pending request too, keeping the mounted fragment. A failure of the request rejects
     * with an error naming the node, its cause attached.
     */
    async update() {
        if (this.closed || !this.binding.hasStamp('start')) return;
        const node = this.node;
        const [, attrs] = node.builder.runtimeValues(node);
        const name = attrs.remote;
        if (!name) return;
        const params = {};
        for (const [key, value] of Object.entries(attrs)) {
            if (key.startsWith('remote_')) params[key.slice('remote_'.length)] = value;
        }
        const condition = node.getAttr('_if');
        if (condition && !this.#inline('_if', condition, `return (${condition})`, params)) {
            this.binding.runtime.gramlot.rpc.remoteRequests.get(node)?.controller.abort();
            const otherwise = node.getAttr('_else');
            if (otherwise) this.#inline('_else', otherwise, otherwise, params);
            return;
        }
        let mounted;
        let text;
        try {
            text = toTytx(params);
            if (attrs._cachedRemote && name === this.#lastName && text === this.#lastParams) {
                // Keeping the mounted fragment also supersedes any different request still in flight.
                this.binding.runtime.gramlot.rpc.remoteRequests.get(node)?.controller.abort();
                return;
            }
            mounted = await this.binding.runtime.gramlot.src.remoteSource(node, name, params);
        } catch (error) {
            throw new Error(`${node.nodeTag} '${node.label}': remote '${name}' failed: ${error.message}`, {cause: error});
        }
        // Only a mounted fragment is the last call `_cachedRemote` compares: a failed request is retried.
        if (mounted) {
            this.#lastName = name;
            this.#lastParams = text;
        }
        const onRemote = node.getAttr('_onRemote');
        if (mounted && onRemote) this.#inline('_onRemote', onRemote, onRemote, params);
    }

    #inline(attr, code, source, params) {
        return this.binding.runtime.inlineCompiler.compile(this.node, attr, code, Object.keys(params), source)(params);
    }
}
