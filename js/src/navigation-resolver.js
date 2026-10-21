/* @ts-self-types="./navigation-resolver.d.ts" */
import {RemoteResolver} from './binding/remote-resolver.js';
import {Bag} from '@genrojs/bag';

/** One directory per request/cache; children remain unresolved until read. */
export class NavigationResolver extends RemoteResolver {
    static internalParams = new Set([...RemoteResolver.internalParams, 'gramlot', 'method', 'params', 'onError']);
    #closed = false;
    #controller = null;
    constructor({gramlot, method, directory, onError}) {
        super({cacheTime: -1, onError});
        this.gramlot = gramlot;
        this.method = method;
        this.params = {directory};
        this.children = new Set();
    }
    get closed() { return this.#closed; }
    startLoad(perform) {
        if (this.loading) return this.loading;
        const controller = new AbortController();
        this.#controller = controller;
        return perform({controller, method: this.method, params: this.params, ignored: false});
    }
    async loadAsync({controller, method, params}) {
        const {signal} = controller;
        let abort;
        const cancelled = new Promise((_, reject) => {
            abort = () => reject(signal.reason);
            signal.addEventListener('abort', abort, {once: true});
        });
        try {
            const value = await Promise.race([this.gramlot.rpc.call('data', method, params, {signal}), cancelled]);
            if (signal.aborted) throw signal.reason;
            return value;
        } finally {
            signal.removeEventListener('abort', abort);
            if (this.#controller === controller) this.#controller = null;
        }
    }
    prepareValue(bag) {
        if (!(bag instanceof Bag)) throw new TypeError('Directory navigation must return a Bag');
        for (const child of this.children) child.abort();
        this.children.clear();
        for (const node of bag.getNodes()) {
            if (node.attr.directory !== undefined) {
                const resolver = new NavigationResolver({gramlot: this.gramlot, method: this.method,
                    directory: node.attr.directory, onError: this.onError});
                this.children.add(resolver);
                bag.setResolver(node.label, resolver);
            }
        }
        return bag;
    }
    abort() {
        this.#closed = true;
        this.#controller?.abort();
        for (const child of this.children) child.abort();
        this.children.clear();
    }
}
