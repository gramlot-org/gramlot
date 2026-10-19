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
        this.gramlot._subscriptions.ready();
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
     * Replace one Source node's children only after incoming Source validation. Resolves true when the
     * fragment was mounted, false otherwise.
     *
     * The request follows the rule of `target.requests` (NodeRequests), shared with the `remote` attribute:
     * one request in flight for the node, its fragment always mounted; a call made during the flight waits,
     * with `method` and `params` of that moment, and is sent at the answer; a further call does nothing while
     * one waits. No debounce: the caller chooses the moment. The request lives as long as the target's
     * NodeBinding (P24): a DOM rebuild or a freeze keeps it, the removal of the target cancels it. A method
     * name outside the syntax (`REMOTE_NAME`) rejects. The mounted fragment becomes the one the `remote` of
     * the target compares with `_cachedRemote`.
     *
     * `@source` / `registerSource` declare the fragments this method requests (GC-230 §035); the
     * `remote` attribute requests them declaratively (GC-095 §105).
     */
    async remoteSource(target, method, params = {}) {
        const rpc = this.gramlot.rpc;
        if (!rpc.transport?.call) throw new Error('Remote Source is unavailable without a server transport');
        const binding = this.binding.bindingFor(target);
        if (this.gramlot.state !== 'started' || !binding) throw new Error('Remote Source target is not mounted');
        return (await target.requests.submit(method, params, request => this.#mountRemote(target, binding, request))) ?? false;
    }

    /** Send the request of `remoteSource` and mount its fragment; a request of a closed target sends nothing. */
    async #mountRemote(target, binding, request) {
        if (binding.closed || this.gramlot.state === 'disposed') return false;
        const rpc = this.gramlot.rpc;
        const {controller} = request;
        rpc.remoteRequests.set(target, request);
        const unregister = binding.track(() => controller.abort());
        let applying = false;
        const current = () => this.gramlot.state !== 'disposed' && !controller.signal.aborted && !request.ignored
            && !binding.closed;
        try {
            const wire = await rpc.call('source', request.method, request.params, {signal: controller.signal});
            if (!current()) return false;
            const prepared = this.prepareSource(wire, target.builder);
            if (!current()) return false;
            this.renderer.validateCandidate(prepared, {replacingNode: target});
            applying = true;
            unregister();
            // The target's own prefix text belongs to the old body as well.
            target.setValue(prepared, true, {_text: null}, true);
            binding.remote?.fragmentMounted(request.method, request.text);
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
