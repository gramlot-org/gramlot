/* @ts-self-types="./source-handler.d.ts" */
/**
 * The Source of one Gramlot page and every change of it (`gramlot.src`).
 *
 * @module
 */
import {SourceBag, sourceBagFromTytx} from '@genrojs/builders';
import {Handler} from './handler.js';
import {GramlotBuilder} from '../builder/gramlot-builder.js';
import {GramlotBuilderBag} from '../builder/source.js';
import {GramlotRenderer} from '../renderer/gramlot-renderer.js';
import {BindingRuntime} from '../binding/runtime.js';
import {LogicRegistry} from '../binding/logic.js';

/**
 * The Source and every change of it. The construction order is the one of source plan §4.3: the Data
 * root is Builder's (`_dataroot` → `_root_` → `builder.data`) and the BindingRuntime subscribes to it
 * before the renderer observes the Source.
 */
export class SourceHandler extends Handler {
    constructor(gramlot, {collections, destination}) {
        super(gramlot);
        // The BindingRuntime reaches the builder through gramlot.src while it attaches.
        gramlot.src = this;
        this.logicRegistry = new LogicRegistry(gramlot);
        this.builder = new GramlotBuilder(null, {collections});
        this.binding = new BindingRuntime(gramlot);
        this.builder.binding = this.binding;
        this.binding.attach();
        this.source = this.builder.source;
        this.renderer = new GramlotRenderer(this.builder, this.source, destination, {binding: this.binding});
    }
    /** Start from an embedded typed Source using the same observed insertion as main. */
    startSource(wire) {
        if (!['ready', 'failed'].includes(this.gramlot.state)) {
            throw new Error(`Cannot start embedded Source while Gramlot is ${this.gramlot.state}`);
        }
        try { return this.mountMainSource(wire); }
        catch (error) { this.gramlot.state = 'failed'; throw error; }
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
        this.gramlot.state = 'started';
        this.binding.pageStarted();
        return this.gramlot;
    }
    /**
     * A Source from a SourceBag or a TYTX wire; only GramlotBuilderBag is accepted, before any effect (R07).
     * The received Source activates its inline code: the only inline code the page runs. Activation is
     * here and not in the TYTX decoding, because a GramlotBuilderBag can also arrive inside Data.
     */
    prepareSource(wire, builder = this.builder) {
        if (wire instanceof SourceBag) {
            if (!(wire instanceof GramlotBuilderBag)) throw new TypeError('Source values must be GramlotBuilderBags');
            return wire.bindBuilder(builder).activateCode();
        }
        // A source envelope decodes its value: anything but a SourceBag or a TYTX text is not a Source.
        if (typeof wire !== 'string') throw new TypeError('Source value did not decode to SourceBag');
        const source = sourceBagFromTytx(wire, builder);
        if (!(source instanceof GramlotBuilderBag)) throw new TypeError('Source values must be GramlotBuilderBags');
        return source.activateCode();
    }

    /**
     * Replace one Source node's children only after incoming Source validation.
     * The request lives as long as the target's NodeBinding (P24): a DOM rebuild
     * or a freeze keeps it, the removal of the target cancels it.
     *
     * Source methods (`@source`, `registerSource`, `remoteSource`) are not yet part of the page-writing API:
     * they arrive together with the `remote` grammar attribute and `@endpoint`.
     */
    async remoteSource(target, method, params = {}) {
        const rpc = this.gramlot.rpc;
        if (!rpc.transport?.call) throw new Error('Remote Source is unavailable without a server transport');
        const binding = this.binding.bindingFor(target);
        if (this.gramlot.state !== 'started' || !binding) throw new Error('Remote Source target is not mounted');
        rpc.remoteRequests.get(target)?.controller.abort();
        const request = {controller: new AbortController()};
        rpc.remoteRequests.set(target, request);
        const unregister = binding.track(() => request.controller.abort());
        let applying = false;
        const current = () => this.gramlot.state !== 'disposed' && !request.controller.signal.aborted &&
            rpc.remoteRequests.get(target) === request && !binding.closed;
        try {
            const wire = await rpc.call('source', method, params, {signal: request.controller.signal});
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
            if (rpc.remoteRequests.get(target) === request) rpc.remoteRequests.delete(target);
        }
    }
}
