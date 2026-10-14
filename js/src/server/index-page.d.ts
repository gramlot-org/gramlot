import {Page} from './page.js';
export interface IndexItem { key: string; title: string; url: string; }
export interface IndexGroup { key: string; title: string; children: IndexItem[]; }
/** One index shell per document. Override footer to replace or extend standard controls. */
export class IndexPage extends Page {
    static logoUrl: string;
    static shellId: string;
    static navigation: IndexGroup[];
    introduction(pane: any): void;
    groupPanel(pane: any, group: IndexGroup): void;
    panel(pane: any, item: IndexItem): void;
    footer(pane: any): void;
    behavior(pane: any): void;
}
