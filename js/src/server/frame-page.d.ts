import {Page} from './page.js';
/** Five optional region hooks; the center exists by default. */
export class FramePage extends Page {
    static shellId: string;
    static datapath: string | null;
    top?(pane: any): void;
    bottom?(pane: any): void;
    left?(pane: any): void;
    right?(pane: any): void;
    center(pane: any): void;
    behavior(shell: any): void;
}
