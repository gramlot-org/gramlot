import {BagResolver} from '@genrojs/bag';

/**
 * The resolver a `dataRemote` installs on its Data node: the value is the answer of the endpoint
 * `method`, called through `gramlot.rpc.call('data', method, params)` when the node is read and its
 * cache has expired. `cacheTime` in seconds, as legacy: below 0 once, 0 at every read, above 0 again
 * after that many seconds.
 *
 * A read never waits: it returns the node's current value (null before the first load) and, when the
 * cache has expired, starts the load. A read made while a load is in flight or waiting starts no other load.
 * The loaded value is written on the node with its Data event, so every `^` consumer of the path is
 * projected again; with `cacheTime: 0` it is written without the event, as legacy: a value per
 * explicit read, never a source for `^` consumers, whose projection would read and load again.
 *
 * A load is a call of the `dataRemote` node and follows the rule of `node.requests` (NodeRequests): one
 * request in flight for the node, its answer always written, even when this resolver was replaced or removed
 * meanwhile; the first load asked during the flight waits and is sent at the answer. `onCalling` (the
 * `_onCalling` of the node) runs before each load and a result `false` makes no load. A failed load writes
 * nothing: `loading` rejects with its error and `onError` receives it. A load aborted by the removal of the
 * node writes nothing, even when its answer had already arrived; a load ignored by `cancel()` writes nothing.
 */
export class RpcResolver extends BagResolver {
    static classKwargs = {...BagResolver.classKwargs, asBag: false};
    static internalParams = new Set([...BagResolver.internalParams, 'binding', 'method', 'params', 'onCalling', 'onError']);

    constructor({binding, method, params, cacheTime, onCalling = null, onError}) {
        // null: resolve once, as a negative cacheTime.
        super({cacheTime: cacheTime ?? -1});
        // The NodeBinding of the `dataRemote` node.
        this.binding = binding;
        this.method = method;
        this.params = params;
        this.onCalling = onCalling;
        // Receives the error of a failed load, never an abort.
        this.onError = onError;
        // The promise of the load in flight or waiting, or null.
        this.loading = null;
        // A load has written its value; the loaded value is being written.
        this.loaded = false;
        this.writing = false;
    }

    /** The current value; a non-static read starts the load when the cache has expired. */
    resolve({static: isStatic = false} = {}) {
        if (!isStatic && !this.loading && !this.writing && this.expired) this.refresh();
        return this.cachedValue;
    }

    /**
     * Start a load and write its value on the node, with the Data event unless `cacheTime` is 0; returns
     * `loading`, which settles with the written value, or undefined when nothing was written. A false
     * `_onCalling` starts no load and returns null.
     */
    refresh() {
        const requests = this.binding.node.requests;
        if (!requests.calling(this.onCalling)) return null;
        const loading = requests.submit(this.method, this.params, request => this.#load(request));
        const settle = () => {
            if (this.loading === loading) this.loading = null;
        };
        loading.then(settle, settle);
        this.loading = loading;
        // A load nobody awaits: its failure reaches `onError`, an abort is not a failure.
        loading.catch(error => {
            if (error?.name !== 'AbortError') this.onError(error);
        });
        return loading;
    }

    /** The call of the endpoint with the params given at construction; the read kwargs are not sent. */
    async #load(request) {
        const binding = this.binding;
        // A waiting load of a node that left the Source sends nothing.
        if (binding.closed) return undefined;
        const value = await binding.call('data', request);
        if (binding.closed || request.ignored) return undefined;
        // The cache time of BagResolver: no public member records a load made outside `resolve`.
        this._lastUpdate = Date.now();
        this.loaded = true;
        this.writing = true;
        try {
            if (this.node) this.node.setValue(value, this.cacheTime !== 0);
            else this.cachedValue = value;
        } finally {
            this.writing = false;
        }
        return value;
    }
}
