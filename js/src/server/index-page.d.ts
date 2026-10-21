import {FramePage} from './frame-page.js';
import type {Bag, BagNode} from '@genrojs/bag';
/** Tree navigation on a Bag and URL-identified retained tab panels. */
export class IndexPage extends FramePage {
    static navigation: Bag;
    static datapath: string;
    left(pane: any): void;
    center(pane: any): void;
    panel(pane: any, node: BagNode): void;
    index_panel(pane: any, params: {selection: Bag}): void;
}
