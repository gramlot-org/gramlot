/**
 * The Source of one Gramlot page and every change of it (`gramlot.src`).
 *
 * @module
 */
import type {SourceBag, SourceBagNode} from '@genrojs/builders';
import type {DomElement} from '../dom.d.ts';
import type {Gramlot} from '../gramlot.js';
import type {GramlotBuilder} from '../builder/gramlot-builder.js';
import type {GramlotRenderer} from '../renderer/gramlot-renderer.js';
import {Handler} from './handler.js';

/**
 * The Source and every change of it. The Data root is the builder's, the binding runtime subscribes
 * to it before the renderer observes the Source.
 */
export class SourceHandler extends Handler {
    /** The registry of the Logic classes of the page. */
    logicRegistry: unknown;
    /** The builder that owns the Source and the Data. */
    builder: GramlotBuilder;
    /** The binding runtime of the page. */
    binding: unknown;
    /** The Source Bag observed by the renderer. */
    source: SourceBag;
    /** The live renderer of the page. */
    renderer: GramlotRenderer;
    /** Create the builder, the binding runtime and the renderer of `gramlot`, in the order of the source plan. */
    constructor(gramlot: Gramlot, options: {collections: unknown[]; destination: DomElement | null});
    /** Start from an embedded typed Source, with the same observed insertion as `main`. */
    startSource(wire: SourceBag | string): Gramlot;
    /** Validate and insert `main` in the Source. */
    mountMainSource(wire: SourceBag | string): Gramlot;
    /**
     * A Source from a SourceBag or a TYTX wire; only Gramlot Source Bags are accepted, before any
     * effect. The received Source activates its inline code.
     */
    prepareSource(wire: SourceBag | string, builder?: GramlotBuilder): SourceBag;
    /**
     * Replace the children of one Source node with a remote Source, only after the incoming Source
     * validates. Resolves with true when applied, false when superseded or cancelled.
     *
     * Source methods (`@source`, `source(...)`, `remoteSource`) are not yet part of the page-writing API:
     * they arrive together with the `remote` grammar attribute and `@endpoint`.
     */
    remoteSource(target: SourceBagNode, method: string, params?: Record<string, unknown>): Promise<boolean>;
}
