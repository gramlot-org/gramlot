/**
 * Opaque references to mounted Source nodes and their DOM elements.
 *
 * @module
 */
import type {DomElement} from './dom.d.ts';
import type {SourceBag, SourceBagNode} from '@genrojs/builders';

/** A transportable descriptor of one Source node, as made by `GramlotBuilder.reference`. */
export interface SourceReference {
    /** The unique id stored in the `__ref` attribute of the Source node. */
    $gramlotRef: string;
    /** Whether the descriptor resolves to the Source node (`'node'`) or to its DOM element (`'dom'`). */
    kind: 'node' | 'dom';
}

/** The table of the references of one mounted Source. */
export class References {
    /** The mounted entries by reference id. */
    entries: Map<string, {node: SourceBagNode; dom: DomElement}>;
    /** The Source root against which a candidate block is validated, or null. */
    sourceRoot: SourceBag | null;
    /** Create a table for the Source `sourceRoot`. */
    constructor(sourceRoot?: SourceBag | null);
    /** Reject a duplicate reference id in `block`, also against the mounted entries not in `excluded`. */
    validate(block: SourceBag, excluded?: Set<SourceBagNode>): void;
    /** Register the reference of `node`, if it has one, with its DOM `element`. */
    register(node: SourceBagNode, element: DomElement): void;
    /** Remove the reference of `node`. */
    remove(node: SourceBagNode): void;
    /** The Source node or the DOM element a descriptor points to; raises when it is not mounted. */
    resolve(reference: SourceReference): SourceBagNode | DomElement;
}
