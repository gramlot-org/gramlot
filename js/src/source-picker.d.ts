import type {SourceBag, SourceBagNode} from '@genrojs/builders';
import type {GramlotRenderer} from './renderer/gramlot-renderer.js';

/** Reusable, lifecycle-bound selection of rendered Source nodes in an editor preview. */
export class SourcePicker {
    constructor(options: {renderer: GramlotRenderer; source: SourceBag; path: string; canvas?:Element; onSelect: (node: SourceBagNode) => void});
    select(node: SourceBagNode | null): void;
    dispose(): void;
}
