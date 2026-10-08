/* @ts-self-types="./bootstrap.d.ts" */
/**
 * The browser start of one page.
 *
 * @module
 */
import {Gramlot} from './gramlot.js';
import {LogicRegistry} from './binding/logic.js';
import {MainTransport} from './transport.js';

/**
 * The browser start of one page (source plan §4.12). The server writes
 * `await new PageBootstrap({config, resources}).run()` into the bootstrap HTML;
 * `resources` is `{css: [url], js: [{url, group}]}`, already in load order and
 * with the mount prefix.
 */
export class PageBootstrap {
    constructor({config, resources, document = globalThis.document}) {
        this.config = config;
        this.resources = resources;
        this.document = document;
    }

    /**
     * CSS links, all JS imports awaited, the Logic check (2bis), `new Gramlot`,
     * logic registration in received order, `start()`. Resolves with the app, or
     * with null when the page closed during the imports. A failed import or check
     * rejects naming the resource; the CSS links stay and the server page is closed.
     */
    async run() {
        const {config, resources, document} = this;
        const window = document.defaultView;
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
        let entries;
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
        } catch (error) {
            this.closePage();
            throw error;
        } finally {
            window.removeEventListener('pagehide', pagehide);
        }
        const app = new Gramlot({...config, document});
        for (const {logicClass, group, resource} of entries) app.src.logicRegistry.register(logicClass, {group, resource});
        window.gramlot = app;
        await app.start();
        return app;
    }

    /** The close request of a page that never got its Gramlot instance: a beacon, as `Gramlot` sends on pagehide. */
    closePage() {
        const {mainUrl, sourceUrl, closeUrl, pageId} = this.config;
        new MainTransport(mainUrl, undefined, sourceUrl, closeUrl, this.document.defaultView.navigator)
            .close(pageId, {beacon: true});
    }
}
