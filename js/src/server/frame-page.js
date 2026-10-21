/* @ts-self-types="./frame-page.d.ts" */
/** A reusable five-region page, composed entirely through Source hooks. */
import {Page} from './page-base.js';

export class FramePage extends Page {
    static shellId = 'frame';
    static datapath = null;

    main(root) {
        const shell = root.div({id: this.constructor.shellId, datapath: this.constructor.datapath, class: 'frame-page',
            height: '100vh', display: 'flex', flex_direction: 'column', min_height: 0});
        const frame = shell.borderContainer({node_label: 'frame', height: '100%', flex: '1', min_height: 0});
        for (const region of ['top', 'bottom', 'left', 'right', 'center']) {
            if (this[region] !== undefined) {
                const pane = frame.contentPane({region, node_label: region});
                this[region](pane);
            }
        }
        this.behavior(shell);
    }
    center(pane) {}
    behavior(shell) {}
}
