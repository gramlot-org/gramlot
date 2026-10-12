import {BagResolver} from '@genrojs/bag';

/**
 * The resolver a `dataRemote` installs on its Data node: the value is the answer of the endpoint
 * `method`, called through `gramlot.rpc.call('data', method, params)` when the node is read and its
 * cache has expired. `cacheTime` in seconds, as legacy: below 0 once, 0 at every read, above 0 again
 * after that many seconds.
 *
 * A read never waits: it returns the node's current value (null before the first load) and, when the
 * cache has expired, starts the load. A read made while a load is in flight starts no other load. The
 * loaded value is written on the node with its Data event, so every `^` consumer of the path is
 * projected again; with `cacheTime: 0` it is written without the event, as legacy: a value per
 * explicit read, never a source for `^` consumers, whose projection would read and load again.
 * A failed load writes nothing: `loading` rejects with its error and `onError` receives it; an aborted
 * load writes nothing, even when its answer had already arrived. `abort()` cancels the pending load.
 */
export class RpcResolver extends BagResolver {
    static classKwargs = {...BagResolver.classKwargs, asBag: false};
    static internalParams = new Set([...BagResolver.internalParams, 'gramlot', 'method', 'params', 'onError']);

    constructor({gramlot, method, params, cacheTime, onError}) {
        // null: resolve once, as a negative cacheTime.
        super({cacheTime: cacheTime ?? -1});
        this.gramlot = gramlot;
        this.method = method;
        this.params = params;
        // Receives the error of a failed load, never an abort.
        this.onError = onError;
        // The AbortController and the promise of the pending load, or null.
        this.controller = null;
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

    /** Start a load and write its value on the node, with the Data event unless `cacheTime` is 0; returns `loading`. */
    refresh() {
        const settle = () => {
            if (this.loading !== loading) return;
            this.controller = null;
            this.loading = null;
        };
        const load = this.load();
        const {signal} = this.controller;
        const loading = load.then(value => {
            settle();
            // Aborted after the answer arrived: the answer belongs to a removed or replaced resolver.
            if (signal.aborted) throw signal.reason;
            this._lastUpdate = Date.now();
            this.loaded = true;
            this.writing = true;
            try {
                if (this._node) this._node.setValue(value, this.cacheTime !== 0);
                else this.cachedValue = value;
            } finally {
                this.writing = false;
            }
            return value;
        }, error => {
            settle();
            throw error;
        });
        this.loading = loading;
        // A load nobody awaits: its failure reaches `onError`, an abort is not a failure.
        loading.catch(error => {
            if (error?.name !== 'AbortError') this.onError(error);
        });
        return loading;
    }

    /** The call of the endpoint with the params given at construction; the read kwargs are not sent. */
    load() {
        const controller = new AbortController();
        const aborted = new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () => reject(controller.signal.reason), {once: true});
        });
        const call = this.gramlot.rpc.call('data', this.method, this.params, {signal: controller.signal});
        this.controller = controller;
        return Promise.race([call, aborted]);
    }

    /** Cancel the pending load, if any. */
    abort() {
        this.controller?.abort();
    }
}
