/**
 * The Gramlot vocabulary and inert authoring on the shared builder grammar.
 *
 * @module
 */
import {HtmlBuilder} from '@genrojs/builders';
import type {SourceAttributes, SourceBag, SourceBagNode, ValidateNodeOptions} from '@genrojs/builders';
import type {GramlotHtmlRenderer} from '../renderer/gramlot-html-renderer.js';
import type {SourceReference} from '../references.js';

/** Gramlot vocabulary and inert authoring on the shared builder grammar. */
export class GramlotBuilder extends HtmlBuilder {
    /** The dialect name, `'gramlot'`. */
    static _name: string;
    /** Tag prefixes of the parent dialects, from the names of the classes above `GramlotBuilder`. */
    static get dialectPrefixes(): string[];
    /** Create a builder; `collections` are grammar documents loaded into it; `auth` evaluates the `auth` rules of the elements when the Source is serialised. */
    constructor(name?: string | null, options?: {collections?: unknown[];
        auth?: ((rule: string) => null | 'not_authenticated' | 'not_authorized') | null});
    /** The `auth` evaluator, or null: without it every element is serialised. */
    readonly auth: ((rule: string) => null | 'not_authenticated' | 'not_authorized') | null;
    /** The binding runtime of the Gramlot page that owns this builder, or null for authoring alone; set by `Gramlot` right after creating the builder. */
    binding: unknown;
    /** The node with `nodeId`; inside a Gramlot page it reads the node ids of the binding runtime. */
    nodeById(nodeId: string): SourceBagNode;
    /** Load a grammar document into the builder. */
    loadCollection(document: unknown): this;
    /** The schema tag of an authored name, or null; the `gramlot_` prefix and excluded declarations raise. */
    schemaTag(name: string): string | null;
    /** An element call from the proxy on a Source Bag. */
    bagCall(bag: SourceBag, tag: string, value?: unknown, attrs?: SourceAttributes): SourceBagNode;
    /** An element call from the proxy on a Source node. */
    commandOnNode(node: SourceBagNode, tag: string, value?: unknown, attrs?: SourceAttributes): SourceBagNode;
    /** Check the value of a node, rejecting the excluded attributes. */
    validateNodeValues(tag: string, value: unknown, attrs?: SourceAttributes): true;
    /** Check a Source node, rejecting the excluded attributes. */
    validateNode(node: SourceBagNode, options?: ValidateNodeOptions): true;
    /** Insert a child; a plain object value of `dataSetter` becomes a Bag. */
    setChild(bag: SourceBag, tag: string, value: unknown, attrs: SourceAttributes,
        parentOverride?: SourceBagNode | null): SourceBagNode;
    /** The string renderer of the Gramlot Source: static render, authoring stays inert. */
    readonly renderer_html: GramlotHtmlRenderer;
    /** Run `setup` on the Data and `main` on the Source root. */
    create(): void;
    /** Browser declarations are not executed by server authoring. */
    computeLogic(): void;
    /** Keep the mixed leading text when a scalar element gains children. */
    promoteNodeValue(node: SourceBagNode, oldValue: unknown, branch: SourceBag): void;
    /** Create a transportable reference descriptor for an authored node. */
    reference(node: SourceBagNode, kind?: 'node' | 'dom'): SourceReference;
    /** The Source encoded as TYTX text; with an `auth` evaluator, without the elements whose `auth` rule it refuses. */
    toTytx(): string;
}
