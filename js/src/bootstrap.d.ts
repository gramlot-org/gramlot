/**
 * The browser start of one page.
 *
 * @module
 */
import type {DomDocument} from './dom.d.ts';
import type {Gramlot, GramlotOptions} from './gramlot.js';
import type {ServerAdapter} from './server-adapter.js';

/** The JavaScript modules and CSS links of a page, in load order and with the mount prefix. */
export interface PageResources {
    /** CSS stylesheet URLs. */
    css: string[];
    /** Application collection modules, each exporting its ComponentCollection as default. */
    collections?: string[];
    /** JavaScript module URLs, each with its Logic group (null for the page logic). */
    js: {url: string; group: string | null}[];
    /** The module whose default export is the ServerAdapter class of the page, when the server names one. */
    serverAdapter?: string;
}

/** The configuration written by the server into the bootstrap HTML. */
export interface PageBootstrapOptions {
    /** The options of the `Gramlot` instance, with the page id. */
    config: GramlotOptions;
    /** The resources of the page. */
    resources: PageResources;
    /** The document of the page. */
    document?: DomDocument;
}

/**
 * The browser start of one page. The server writes
 * `await new PageBootstrap({config, resources}).run()` into the bootstrap HTML.
 */
export class PageBootstrap {
    /** The configuration of the page. */
    config: GramlotOptions;
    /** The resources of the page. */
    resources: PageResources;
    /** The document of the page. */
    document: DomDocument;
    /** The server adapter of the page: the HTTP `ServerAdapter` of the core, replaced by `run` when the server names another. */
    serverAdapter: ServerAdapter;
    /** Create the bootstrap of one page. */
    constructor(options: PageBootstrapOptions);
    /**
     * Add the CSS links, import all JS modules, check the Logic classes, create the `Gramlot`
     * instance, register the logic and start it. Resolves with the instance, or with null when the
     * page closed during the imports.
     */
    run(): Promise<Gramlot | null>;
    /** An instance of the default export of the module `url`, the ServerAdapter the server names in `resources.serverAdapter`. */
    loadServerAdapter(url: string): Promise<ServerAdapter>;
    /** Send the close request of a page that never got its `Gramlot` instance, through the server adapter. */
    closePage(): void;
}
