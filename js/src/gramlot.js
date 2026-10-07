/* @ts-self-types="./gramlot.d.ts" */
/**
 * One Gramlot page in the browser.
 *
 * @module
 */
import {MainTransport} from './transport.js';
import {SourceHandler} from './handlers/source-handler.js';
import {RpcHandler} from './handlers/rpc-handler.js';
import {DomHandler} from './handlers/dom-handler.js';
import {UtilitiesHandler} from './handlers/utilities-handler.js';

/**
 * One Gramlot page: lifecycle, Data and the four proxies `src`, `rpc`, `dom`, `utl`.
 * `SourceHandler` creates the builder, the binding runtime and the renderer in the order of source plan §4.3.
 */
export class Gramlot {
    constructor({pageId, mainUrl = '/gramlot/main', sourceUrl = '/gramlot/source', closeUrl = '/gramlot/close', rootId = 'gramlot-root',
                 element = null, document = globalThis.document, transport = null, collections = []} = {}) {
        this.pageId = pageId;
        this.src = new SourceHandler(this, {collections, destination: element ?? document.getElementById(rootId)});
        this.data = this.src.builder.data;
        this.rpc = new RpcHandler(this, {mainUrl, sourceUrl, closeUrl, document, transport});
        this.dom = new DomHandler(this);
        this.utl = new UtilitiesHandler(this, document);
        this.state = 'ready';
        this.abort = new AbortController();
        if (this.rpc.transport instanceof MainTransport) {
            this.pagehide = event => { if (!event.persisted) this.dispose({beacon: true}); };
            document.defaultView.addEventListener('pagehide', this.pagehide);
            this.window = document.defaultView;
        }
    }
    start() {
        if (this.state === 'disposed') return Promise.reject(new Error('Gramlot is disposed'));
        if (!this.rpc.transport) return Promise.reject(new Error('This Gramlot instance has no server transport'));
        if (this.loading) return this.loading;
        if (this.state === 'started') return Promise.resolve(this);
        this.state = 'loading';
        this.loading = this.loadMain().finally(() => { this.loading = null; });
        return this.loading;
    }
    async loadMain() {
        try {
            const wire = await this.rpc.transport.main(this.pageId, this.abort.signal);
            if (this.state === 'disposed') throw new Error('Gramlot was disposed during main');
            return this.src.mountMainSource(wire);
        } catch (error) {
            if (this.state !== 'disposed') this.state = 'failed';
            throw error;
        }
    }
    dispose({beacon = false} = {}) {
        if (this.state === 'disposed') return;
        this.state = 'disposed';
        if (this.pagehide) this.window.removeEventListener('pagehide', this.pagehide);
        this.abort.abort();
        for (const request of this.rpc.remoteRequests.values()) request.controller.abort();
        this.rpc.remoteRequests.clear();
        try {
            try { this.src.binding.dispose(); }
            finally { this.src.renderer.dispose(); }
        } finally {
            if (this.rpc.transport instanceof MainTransport) this.rpc.transport.close(this.pageId, {beacon});
            this.rpc.transport?.dispose?.();
        }
    }
}
