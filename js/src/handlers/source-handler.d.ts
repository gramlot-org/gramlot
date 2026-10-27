/**
 * The Source of one Gramlot page and every change of it (`gramlot.src`).
 *
 * @module
 */
import type {Bag} from '@genrojs/bag';
import type {SourceBag, SourceBagNode} from '@genrojs/builders';
import type {DomElement} from '../dom.d.ts';
import type {Gramlot} from '../gramlot.js';
import type {GramlotBuilder} from '../builder/gramlot-builder.js';
import type {NameSyntax} from '../builder/name-syntax.js';
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
    /**
     * Create the builder, the binding runtime and the renderer of `gramlot`, in the order of the source plan;
     * `subscriptions` is the private topic service of `gramlot`, given to the binding runtime.
     */
    constructor(gramlot: Gramlot, options: {collections: unknown[]; destination: DomElement | null; subscriptions: unknown;
        nameSyntax: NameSyntax});
    /** Start from an embedded typed Source, with the same observed insertion as `main`. */
    startSource(wire: SourceBag | string): Gramlot;
    /** Validate and insert `main` in the Source. */
    mountMainSource(wire: SourceBag | string, initialData?: Bag | null): Gramlot;
    /**
     * A Source from a SourceBag or a TYTX wire; only Gramlot Source Bags are accepted, before any
     * effect. The received Source activates its inline code.
     */
    prepareSource(wire: SourceBag | string, builder?: GramlotBuilder): SourceBag;
    /**
     * Replace the children of one Source node with a remote Source, only after the incoming Source
     * validates. Resolves with true when mounted, false otherwise: the target left the Source, the page
     * closed, the answer was ignored by `cancel()`, or the call was dropped because another call waits.
     *
     * One request is in flight for the target, its fragment always mounted; a call made during the flight
     * waits with `method` and `params` of that moment and is sent at the answer (`target.requests`).
     * `method` is a method of the page or a path `a.b.c.method` from the page; another name rejects.
     *
     * A declared fragment is requested from code with `gramlot.src.remoteSource` (GC-230 §035); the
     * `remote` attribute requests it declaratively (GC-095 §105).
     */
    remoteSource(target: SourceBagNode, method: string, params?: Record<string, unknown>): Promise<boolean>;
}
