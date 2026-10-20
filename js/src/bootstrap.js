/* @ts-self-types="./bootstrap.d.ts" */
/**
 * The browser start of one page.
 *
 * @module
 */
import {Gramlot} from './gramlot.js';
import {LogicRegistry} from './binding/logic.js';
import {ServerAdapter} from './server-adapter.js';

/**
 * The browser start of one page (source plan §4.12). The server writes
 * `await new PageBootstrap({config, resources}).run()` into the bootstrap HTML;
 * `resources` is `{css: [url], js: [{url, group}]}`, already in load order and
 * with the mount prefix, with `collections` and `serverAdapter` when the server has them.
 */
export class PageBootstrap {
    constructor({config, resources, document = globalThis.document}) {
        this.config = config;
        this.resources = resources;
        this.document = document;
        // The HTTP ServerAdapter of the core, replaced by run when the server names another (loadServerAdapter).
        this.serverAdapter = new ServerAdapter();
    }

    /**
     * The server adapter the server names (imported first), CSS links, all JS imports awaited, the Logic
     * check (2bis), `new Gramlot`, logic registration in received order, `start()`. Resolves with the app,
     * or with null when the page closed during the imports. A failed import or check rejects naming the
     * resource; the CSS links stay and the server page is closed. A failed import of the server adapter
     * rejects before any of this and leaves the server page to its TTL.
     */
    async run() {
        const {config, resources, document} = this;
        const window = document.defaultView;
        if (resources.serverAdapter !== undefined) this.serverAdapter = await this.loadServerAdapter(resources.serverAdapter);
        for (const url of resources.css) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.head.append(link);
        }
        let closed = false;
        const pagehide = event => {
            if (event.persisted || closed) return;
            closed = true;
            this.closePage();
        };
        window.addEventListener('pagehide', pagehide);
        let entries, collections;
        try {
            // A relative module URL is resolved against the document, as in HTML (D8).
            const settled = await Promise.allSettled(resources.js.map(({url}) => import(new URL(url, document.baseURI).href)));
            if (closed) return null;
            entries = resources.js.map(({url, group}, index) => {
                const outcome = settled[index];
                if (outcome.status === 'rejected') {
                    throw new Error(`${url}: import failed: ${outcome.reason?.message ?? outcome.reason}`, {cause: outcome.reason});
                }
                return {logicClass: outcome.value.Logic, group, resource: url};
            });
            LogicRegistry.check(entries);
            collections = await Promise.all((resources.collections ?? []).map(async url => {
                try { return (await import(new URL(url, document.baseURI).href)).default; }
                catch (error) { throw new Error(`${url}: collection import failed: ${error.message}`, {cause: error}); }
            }));
            if (closed) return null;
            for (const collection of collections) collection.register(window);
        } catch (error) {
            this.closePage();
            throw error;
        } finally {
            window.removeEventListener('pagehide', pagehide);
        }
        const app = new Gramlot({...config, document, serverAdapter: this.serverAdapter,
            collections: [...(config.collections ?? []), ...collections.map(collection => collection.toDocument())]});
        for (const {logicClass, group, resource} of entries) app.src.logicRegistry.register(logicClass, {group, resource});
        window.gramlot = app;
        await app.start();
        return app;
    }

    /**
     * The ServerAdapter the server names in `resources.serverAdapter`: an instance of the default export of the
     * module `url`, which imports the core through the import map and so shares the runtime already loaded. A
     * failed import rejects naming the module.
     */
    async loadServerAdapter(url) {
        let module;
        try { module = await import(new URL(url, this.document.baseURI).href); }
        catch (error) { throw new Error(`${url}: server adapter import failed: ${error.message}`, {cause: error}); }
        return new module.default();
    }

    /** The close request of a page that never got its Gramlot instance: through a transport of the server adapter,
     * with a beacon, as `Gramlot` sends on pagehide. */
    closePage() {
        const transport = this.serverAdapter.createTransport({...this.config, document: this.document});
        transport.close(this.config.pageId, {beacon: true});
        transport.dispose();
    }
}
