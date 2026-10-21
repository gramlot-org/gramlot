import type {SourceBag, SourceBagNode} from '@genrojs/builders';
/** Reusable Source composition; relative value pointers resolve within datapath. */
export function codeMirrorWithOptions(parent: SourceBag | SourceBagNode, options: {
    datapath: string;
    value: string;
    language?: string;
    height?: string;
    [attribute: string]: unknown;
}): SourceBagNode;
