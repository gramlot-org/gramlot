/* @ts-self-types="./index-page.d.ts" */
/** Bag navigation and retained page tabs on the reusable five-region frame. */
import {Bag} from '@genrojs/bag';
import {FramePage} from './frame-page.js';

export class IndexPage extends FramePage {
    static title = 'Application';
    static shellId = 'index';
    static datapath = 'index';
    static navigation = null;

    main(root) {
        const {navigation, datapath} = this.constructor;
        if (!(navigation instanceof Bag)) throw new TypeError('IndexPage.navigation must be a Bag');
        root.dataSetter({destination_path: `${datapath}.navigation`, value: navigation});
        root.dataSetter({destination_path: `${datapath}.navigationSelection`, value: null});
        root.dataSetter({destination_path: `${datapath}.active`, value: null});
        root.dataSetter({destination_path: `${datapath}.opened`, value: new Bag()});
        super.main(root);
    }
    left(pane) {
        pane.setAttr({width: '240px', splitter: true, drawer: true, drawer_label: 'Navigation'});
        pane.tree({node_label: 'tree', storepath: '.navigation',
            labelAttribute: 'title', hideValues: true, selectedPath: '^.navigationSelection'});
    }
    center(pane) {
        pane.tabContainer({node_label: 'tabs', height: '100%', selectedPage: '^.active'});
    }
    behavior(shell) {
        shell.dataController({func: 'indexMount', _onStart: true});
    }
    index_panel(pane, {selection}) { this.panel(pane, selection.getNode('#0')); }
    panel(pane, node) {
        pane.iframe({src: node.attr.url, title: node.attr.title ?? node.label,
            width: '100%', height: '100%', border: 0});
    }
}
IndexPage.registerSource('index_panel');
