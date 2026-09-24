import {Bag} from '@jsr/genro__bag';
import {SourceBag, sourceBagFromTytx} from '@jsr/genro__builders';
import {GramlotBuilder} from './builder/gramlot-builder.js';
import {GramlotRenderer} from './renderer/gramlot-renderer.js';
import {MainTransport} from './transport.js';

/** Bootstrap prepares both roots and the Source observer before asking for main. */
export class Gramlot {
    constructor({pageId, mainUrl = '/gramlot/main', sourceUrl = '/gramlot/source', closeUrl = '/gramlot/close', rootId = 'gramlot-root',
                 element = null, document = globalThis.document, transport = null, collections = []} = {}) {
        this.pageId = pageId;
        this.builder = new GramlotBuilder(null, {collections});
        this.data = this.builder.data;
        this.data.setItem('main', new Bag());
        this.source = this.builder.source;
        const destination = element ?? document.getElementById(rootId);
        this.renderer = new GramlotRenderer(this.builder, this.source, destination);
        this.transport = transport === false ? null : transport ??
            new MainTransport(mainUrl, undefined, sourceUrl, closeUrl, document.defaultView.navigator);
        this.remoteRequests = new Map();
        this.state = 'ready';
        this.abort = new AbortController();
        if (this.transport instanceof MainTransport) {
            this.pagehide = event => { if (!event.persisted) this.dispose({beacon: true}); };
            document.defaultView.addEventListener('pagehide', this.pagehide);
            this.window = document.defaultView;
        }
    }
    start() {
        if (this.state === 'disposed') return Promise.reject(new Error('Gramlot is disposed'));
        if (!this.transport) return Promise.reject(new Error('This Gramlot instance has no server transport'));
        if (this.loading) return this.loading;
        if (this.state === 'started') return Promise.resolve(this);
        this.state = 'loading';
        this.loading = this.loadMain().finally(() => { this.loading = null; });
        return this.loading;
    }
    async loadMain() {
        try {
            const wire = await this.transport.main(this.pageId, this.abort.signal);
            if (this.state === 'disposed') throw new Error('Gramlot was disposed during main');
            return this.mountMainSource(wire);
        } catch (error) {
            if (this.state !== 'disposed') this.state = 'failed';
            throw error;
        }
    }
    /** Start from an embedded typed Source using the same observed insertion as main. */
    startSource(wire) {
        if (!['ready', 'failed'].includes(this.state)) {
            throw new Error(`Cannot start embedded Source while Gramlot is ${this.state}`);
        }
        try { return this.mountMainSource(wire); }
        catch (error) { this.state = 'failed'; throw error; }
    }
    mountMainSource(wire) {
        const source = this.prepareSource(wire);
        this.renderer.validateCandidate(source);
        this.source.setItem('main', source);
        this.state = 'started';
        return this;
    }
    prepareSource(wire, builder = this.builder) {
        return wire instanceof SourceBag ? wire.bindBuilder(builder) : sourceBagFromTytx(wire, builder);
    }

    /** Replace one mounted node's children only after incoming Source validation. */
    async remoteSource(target, method, params = {}) {
        if (!this.transport?.source) throw new Error('Remote Source is unavailable without a server transport');
        if (this.state !== 'started' || !this.renderer.records.has(target)) throw new Error('Remote Source target is not mounted');
        this.remoteRequests.get(target)?.controller.abort();
        const request = {controller: new AbortController()};
        this.remoteRequests.set(target, request);
        const unregister = this.renderer.onDispose(target, () => request.controller.abort());
        let applying = false;
        const current = () => this.state !== 'disposed' && !request.controller.signal.aborted &&
            this.remoteRequests.get(target) === request && this.renderer.records.has(target);
        try {
            const wire = await this.transport.source(this.pageId, method, params, request.controller.signal);
            if (!current()) return false;
            const prepared = this.prepareSource(wire, target.builder);
            if (!current()) return false;
            this.renderer.validateCandidate(prepared, {replacingNode: target});
            applying = true;
            unregister();
            // The target's own prefix text belongs to the old body as well.
            target.setValue(prepared, true, {_text: null}, true);
            return true;
        } catch (error) {
            if (!applying && !current()) return false;
            throw error;
        } finally {
            unregister();
            if (this.remoteRequests.get(target) === request) this.remoteRequests.delete(target);
        }
    }

    reference(descriptor) { return this.renderer.references.resolve(descriptor); }
    dispose({beacon = false} = {}) {
        if (this.state === 'disposed') return;
        this.state = 'disposed';
        if (this.pagehide) this.window.removeEventListener('pagehide', this.pagehide);
        this.abort.abort();
        for (const request of this.remoteRequests.values()) request.controller.abort();
        this.remoteRequests.clear();
        try { this.renderer.dispose(); }
        finally {
            if (this.transport instanceof MainTransport) this.transport.close(this.pageId, {beacon});
            this.transport?.dispose?.();
        }
    }
}
