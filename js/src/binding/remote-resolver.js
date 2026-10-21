import {BagResolver} from '@genrojs/bag';

/** Shared asynchronous endpoint cache; subclasses own request scheduling and lifetime. */
export class RemoteResolver extends BagResolver {
    static classKwargs = {...BagResolver.classKwargs, asBag: false};
    constructor({cacheTime, onError}) {
        super({cacheTime: cacheTime ?? -1});
        this.onError = onError;
        this.loading = null;
        this.loaded = false;
        this.writing = false;
    }
    resolve({static: isStatic = false} = {}) {
        if (!isStatic && !this.closed && !this.loading && !this.writing && this.expired) this.refresh();
        return this.cachedValue;
    }
    refresh() {
        if (this.closed) return null;
        const loading = this.startLoad(request => this.#load(request));
        if (loading === null) return null;
        const settle = () => { if (this.loading === loading) this.loading = null; };
        loading.then(settle, settle);
        this.loading = loading;
        loading.catch(error => { if (error?.name !== 'AbortError') this.onError(error); });
        return loading;
    }
    resolveSync(options) { return super.resolve(options); }
    prepareValue(value) { return value; }
    #fingerprint() {
        const kwargs = {...this._kw};
        for (const [name, value] of Object.entries(this.node?.attr ?? {})) {
            if (!this.constructor.internalParams.has(name)) kwargs[name] = value;
        }
        return this._computeEffectiveFingerprint(kwargs);
    }
    async #load(request) {
        if (this.closed) return undefined;
        const fingerprint = this.#fingerprint();
        const received = await this.loadAsync(request);
        if (this.closed || request.ignored) return undefined;
        const value = this.prepareValue(received);
        this._lastUpdate = Date.now();
        this._lastEffectiveFingerprint = fingerprint;
        this.loaded = true;
        this.writing = true;
        try {
            if (this.node) this.node.setValue(value, this.cacheTime !== 0);
            else this.cachedValue = value;
        } finally { this.writing = false; }
        return value;
    }
}
