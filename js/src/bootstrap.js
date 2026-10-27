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
        let closed = false, resolveClosed, app;
        const styleCleanup = [];
        const closing = new Promise(resolve => { resolveClosed = resolve; });
        const pagehide = event => {
            if (event.persisted || closed) return;
            closed = true;
            try { this.closePage(); }
            finally { resolveClosed(null); }
        };
        window.addEventListener('pagehide', pagehide);
        try {
            const styles = resources.css.map(url => new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet'; link.href = url;
                const cleanup = () => { link.removeEventListener('load', loaded); link.removeEventListener('error', failed); };
                styleCleanup.push(cleanup);
                const loaded = () => { cleanup(); resolve(); };
                const failed = () => { cleanup(); reject(new Error(`${url}: stylesheet load failed`)); };
                link.addEventListener('load', loaded); link.addEventListener('error', failed);
                document.head.append(link);
            }));
            const logic = resources.js.map(async ({url, group}) => {
                try {
                    const module = await import(new URL(url, document.baseURI).href);
                    return {logicClass:module.Logic, group, resource:url};
                } catch(error) { throw new Error(`${url}: import failed: ${error.message}`, {cause:error}); }
            });
            const names = new Set();
            const collectionImports = (resources.collections ?? []).map(async record => {
                if (!record || typeof record !== 'object' || Object.keys(record).sort().join(',') !== 'buildId,name,url' ||
                        typeof record.name !== 'string' || typeof record.url !== 'string' ||
                        typeof record.buildId !== 'string' || !/^sha256:[0-9a-f]{64}$/.test(record.buildId) || names.has(record.name)) {
                    throw new TypeError('Invalid or duplicate collection bootstrap record');
                }
                names.add(record.name);
                const {name,url,buildId} = record;
                let module;
                try { module = await import(new URL(url, document.baseURI).href); }
                catch(error) { throw new Error(`${name}: collection import failed: ${error.message}`, {cause:error}); }
                if (module.default?.name !== name || module.buildId !== buildId) {
                    throw new Error(`${name}: collection identity mismatch; expected ${buildId}, received ${module.buildId}`);
                }
                return module.default;
            });
            const result = await Promise.race([Promise.all([
                Promise.all(styles), Promise.all(logic), Promise.all(collectionImports)]), closing]);
            if (closed) return null;
            const [,entries,collections] = result;
            LogicRegistry.check(entries);
            // Verify the complete graph before activating any component or command.
            for (const collection of collections) collection.register(window);
            app = new Gramlot({...config, document, serverAdapter:this.serverAdapter,
                collections:[...(config.collections ?? []), ...collections.map(c=>c.toDocument())]});
            window.removeEventListener('pagehide', pagehide);
            for (const collection of collections) collection.registerCommands(app);
            for (const {logicClass,group,resource} of entries) app.src.logicRegistry.register(logicClass,{group,resource});
            window.gramlot = app;
            await app.start();
            return app;
        } catch(error) {
            if (app) app.dispose();
            else if (!closed) this.closePage();
            throw error;
        } finally {
            for (const cleanup of styleCleanup) cleanup();
            window.removeEventListener('pagehide', pagehide);
        }
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
        try { transport.close(this.config.pageId); }
        finally { transport.dispose(); }
    }
}
