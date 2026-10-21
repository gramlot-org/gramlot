import {RemoteResolver} from './remote-resolver.js';

/**
 * The resolver a `dataRemote` installs on its Data node: the value is the answer of the endpoint
 * `method` when the node is read and its cache has expired. `cacheTime` in seconds, as legacy: below 0
 * once, 0 at every read, above 0 again after that many seconds.
 *
 * With `sync` (the `sync` attribute, default true, when the transport supports it) a read waits, as in the
 * legacy: the expired read calls `gramlot.rpc.callSync('data', method, params)` and returns its value through
 * `BagResolver.resolve`, which stores it on the node, without the Data event, and records the cache time. The
 * page is blocked while it waits. `_onCalling` false makes no call and returns the current value. A failed
 * call throws to the reader through `onError`, naming the node.
 *
 * Without `sync`, or on a transport without synchronous calls (the serverless Worker), a read never waits:
 * it returns the node's current value (null before the first load) and, when the cache has expired, starts
 * the load through `gramlot.rpc.call`. A read made while a load is in flight or waiting starts no other load.
 * The loaded value is written on the node with its Data event, so every `^` consumer of the path is
 * projected again; with `cacheTime: 0` it is written without the event, as legacy: a value per
 * explicit read, never a source for `^` consumers, whose projection would read and load again.
 *
 * Both paths record what BagResolver `resolve` records: the cache time and the fingerprint of the parameters. A
 * `sync` read that follows a load, however it was made, finds the cache of that load while the parameters are the
 * same and the cache has not expired, and sends no call.
 *
 * A load is a call of the `dataRemote` node and follows the rule of `node.requests` (NodeRequests): one
 * request in flight for the node, its answer always written, even when this resolver was replaced or removed
 * meanwhile; the first load asked during the flight waits and is sent at the answer. `onCalling` (the
 * `_onCalling` of the node) runs before each load and a result `false` makes no load. A failed load writes
 * nothing: `loading` rejects with its error and `onError` receives it. A load aborted by the removal of the
 * node writes nothing, even when its answer had already arrived; a load ignored by `cancel()` writes nothing.
 */
export class RpcResolver extends RemoteResolver {
    static internalParams = new Set([...RemoteResolver.internalParams, 'binding', 'method', 'params', 'onCalling', 'onError', 'sync']);
    constructor({binding, method, params, cacheTime, onCalling = null, onError, sync = false}) {
        super({cacheTime, onError});
        this.binding = binding;
        this.sync = sync;
        this.method = method;
        this.params = params;
        this.onCalling = onCalling;
    }
    get closed() { return this.binding.closed; }
    resolve(options = {}) {
        if (!this.sync) return super.resolve(options);
        if (options.static || this.loading || this.writing) return this.cachedValue;
        if (this.expired && !this.binding.node.requests.calling(this.onCalling)) return this.cachedValue;
        // A synchronous read uses BagResolver's normal cache and load path.
        return super.resolveSync(options);
    }
    load() {
        let value;
        try { value = this.binding.callSync('data', this.method, this.params); }
        catch (error) { this.onError(error); }
        this.loaded = true;
        return value;
    }
    startLoad(perform) {
        const requests = this.binding.node.requests;
        if (!requests.calling(this.onCalling)) return null;
        return requests.submit(this.method, this.params, perform);
    }
    loadAsync(request) { return this.binding.call('data', request); }
}
