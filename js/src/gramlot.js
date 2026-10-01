import {SourceBag, sourceBagFromTytx} from '@genrojs/builders';
import {GramlotBuilder} from './builder/gramlot-builder.js';
import {GramlotBuilderBag} from './builder/source.js';
import {GramlotRenderer} from './renderer/gramlot-renderer.js';
import {BindingRuntime} from './binding/runtime.js';
import {LogicRegistry} from './binding/logic.js';
import {MainTransport} from './transport.js';

/**
 * One Gramlot page. The construction order is the one of source plan §4.3: the Data
 * root is Builder's (`_dataroot` → `_root_` → `builder.data`) and the BindingRuntime
 * subscribes to it before the renderer observes the Source.
 */
export class Gramlot {
    constructor({pageId, mainUrl = '/gramlot/main', sourceUrl = '/gramlot/source', closeUrl = '/gramlot/close', rootId = 'gramlot-root',
                 element = null, document = globalThis.document, transport = null, collections = []} = {}) {
        this.pageId = pageId;
        this.logicRegistry = new LogicRegistry(this);
        this.builder = new GramlotBuilder(null, {collections});
        this.binding = new BindingRuntime(this);
        this.builder.binding = this.binding;
        this.data = this.builder.data;
        this.binding.attach();
        this.source = this.builder.source;
        const destination = element ?? document.getElementById(rootId);
        this.renderer = new GramlotRenderer(this.builder, this.source, destination, {binding: this.binding});
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
    /**
     * Validate and insert `main` (§5.1). When its installation fails after the insertion (its
     * NodeBindings closed again), `main` leaves the Source, so `start` or `startSource` can mount a
     * new one; the Data is not rolled back. A later error (`_init`, DOM) keeps `main` and its
     * NodeBindings (P12, no rollback).
     */
    mountMainSource(wire) {
        const source = this.prepareSource(wire);
        this.renderer.validateCandidate(source);
        try {
            this.source.setItem('main', source);
        } catch (error) {
            if (!this.binding.bindingFor(this.source.getNode('main'))) this.source.popNode('main');
            throw error;
        }
        this.state = 'started';
        this.binding.pageStarted();
        return this;
    }
    /** A Source from a SourceBag or a TYTX wire; only GramlotBuilderBag is accepted, before any effect (R07). */
    prepareSource(wire, builder = this.builder) {
        if (wire instanceof SourceBag) {
            if (!(wire instanceof GramlotBuilderBag)) throw new TypeError('Source values must be GramlotBuilderBags');
            return wire.bindBuilder(builder);
        }
        const source = sourceBagFromTytx(wire, builder);
        if (!(source instanceof GramlotBuilderBag)) throw new TypeError('Source values must be GramlotBuilderBags');
        return source;
    }

    /**
     * Replace one Source node's children only after incoming Source validation.
     * The request lives as long as the target's NodeBinding (P24): a DOM rebuild
     * or a freeze keeps it, the removal of the target cancels it.
     */
    async remoteSource(target, method, params = {}) {
        if (!this.transport?.source) throw new Error('Remote Source is unavailable without a server transport');
        const binding = this.binding.bindingFor(target);
        if (this.state !== 'started' || !binding) throw new Error('Remote Source target is not mounted');
        this.remoteRequests.get(target)?.controller.abort();
        const request = {controller: new AbortController()};
        this.remoteRequests.set(target, request);
        const unregister = binding.track(() => request.controller.abort());
        let applying = false;
        const current = () => this.state !== 'disposed' && !request.controller.signal.aborted &&
            this.remoteRequests.get(target) === request && !binding.closed;
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
    /** The Source node of the nearest element generated by the renderer (§4.11bis). */
    getBaseSourceNode(domNode) { return this.renderer.getBaseSourceNode(domNode); }
    /** The element built from a Source node, or null (§4.11bis). */
    getDomNode(sourceNode) { return this.renderer.getDomNode(sourceNode); }
    dispose({beacon = false} = {}) {
        if (this.state === 'disposed') return;
        this.state = 'disposed';
        if (this.pagehide) this.window.removeEventListener('pagehide', this.pagehide);
        this.abort.abort();
        for (const request of this.remoteRequests.values()) request.controller.abort();
        this.remoteRequests.clear();
        try {
            try { this.binding.dispose(); }
            finally { this.renderer.dispose(); }
        } finally {
            if (this.transport instanceof MainTransport) this.transport.close(this.pageId, {beacon});
            this.transport?.dispose?.();
        }
    }
}
