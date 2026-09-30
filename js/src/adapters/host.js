import {GramlotBuilder} from '../builder/gramlot-builder.js';
import {Page, sourceMethod} from './page.js';
import {loadOrder} from './resources.js';

export class PageExpired extends Error {}
export class PageNotFound extends Error {}
/** An unknown remote Source method, as the Python `SourceNotFound`. */
export class SourceNotFound extends Error {}
export class HostCapacity extends Error {}

const scriptJson = value => JSON.stringify(value).replaceAll('<', '\\u003c');

/** 16 random bytes in URL-safe base64 without padding, as Python secrets.token_urlsafe(16). */
function createNonce() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

/** Add the mount prefix once to a root-relative URL (/…, not //…); relative and
 * absolute URLs stay as written. */
const prefixed = (prefix, url) => url.startsWith('/') && !url.startsWith('//') ? prefix + url : url;

/** Neutral host: no Node/Bun imports or server startup side effects. The core never
 * searches files: override resolvePage and resolveResources in concrete integrations;
 * FileHost implements them on one pages folder. Adapters supply request ownership.
 */
export class Host {
    constructor({runtimeUrl = '/assets/gramlot.js', mainUrl = '/gramlot/main', sourceUrl = '/gramlot/source',
                 closeUrl = '/gramlot/close',
                 rootId = 'gramlot-root', pageTtl = 1800, maxPages = 1000} = {}) {
        if (typeof pageTtl !== 'number' || pageTtl <= 0 ||
            !Number.isFinite(performance.now() + pageTtl * 1000) ||
            !Number.isSafeInteger(maxPages) || maxPages < 1) {
            throw new TypeError('Page TTL must be finite and positive; capacity must be a positive safe integer');
        }
        Object.assign(this, {runtimeUrl, mainUrl, sourceUrl, closeUrl, rootId, pageTtl, maxPages});
        this.pages = new Map();
    }

    /** The Page class of path, or PageNotFound. */
    async resolvePage(path) { throw new PageNotFound(`Page not found: ${path}`); }

    /** {css: [url], js: [{url, group}]} in load order and without mount prefix, or PageNotFound. */
    async resolveResources(path, PageClass) { throw new PageNotFound(`Page resources not found: ${path}`); }

    prune() {
        const now = performance.now();
        for (const [id, record] of this.pages) if (record.expires <= now) this.pages.delete(id);
    }

    /** Register a page independently of its HTTP or Worker transport. */
    async registerPage(path, {owner = null} = {}) {
        const PageClass = await this.resolvePage(path);
        if (typeof PageClass !== 'function' || !(PageClass.prototype instanceof Page)) {
            throw new TypeError('Page modules must export a subclass of Page');
        }
        const resources = loadOrder(await this.resolveResources(path, PageClass));
        this.prune();
        if (this.pages.size >= this.maxPages) throw new HostCapacity('Page registry capacity reached');
        const pageId = crypto.randomUUID().replaceAll('-', '');
        this.pages.set(pageId, {PageClass, owner, expires: performance.now() + this.pageTtl * 1000});
        return {pageId, title: PageClass.title, resources};
    }

    /** Register the page and return its bootstrap. prefix is the mount prefix chosen
     * by the adapter, added once to the root-relative bootstrap URLs. */
    async openPage(path, {owner = null, prefix = ''} = {}) {
        if (typeof prefix !== 'string') throw new TypeError('Mount prefix must be a string');
        const {pageId, title, resources} = await this.registerPage(path, {owner});
        try {
            const nonce = createNonce();
            // The CSS links and the JS modules reach the page through PageBootstrap (§4.12, D9).
            const bootstrap = scriptJson({
                config: {pageId, mainUrl: prefixed(prefix, this.mainUrl), sourceUrl: prefixed(prefix, this.sourceUrl),
                    closeUrl: prefixed(prefix, this.closeUrl), rootId: this.rootId},
                resources: {css: resources.css.map(url => prefixed(prefix, url)),
                    js: resources.js.map(({url, group}) => ({url: prefixed(prefix, url), group}))},
            });
            const document = new GramlotBuilder();
            const root = document.root.html();
            const head = root.head();
            head.meta({charset: 'utf-8'});
            head.title(title);
            const body = root.body();
            body.div({id: this.rootId});
            body.script(`import {PageBootstrap} from ${scriptJson(prefixed(prefix, this.runtimeUrl))};` +
                `await new PageBootstrap(${bootstrap}).run();`,
                {type: 'module', nonce});
            const html = document.render({doctype: true});
            return {pageId, html, nonce};
        } catch (error) {
            this.closePage(pageId, {owner});
            throw error;
        }
    }

    async main(pageId, {owner = null} = {}) {
        return this.buildSource(pageId, null, {}, owner);
    }

    /** A remote Source; `params` null or omitted is `{}`, as in Python (an adapter passes null when a request has none). */
    async source(pageId, method, params = null, {owner = null} = {}) {
        if (typeof method !== 'string' || method === 'main') throw new SourceNotFound('Unknown Source method');
        if (params !== null && (typeof params !== 'object' || Array.isArray(params))) {
            throw new TypeError('Source params must be an object');
        }
        return this.buildSource(pageId, method, params ?? {}, owner);
    }

    async buildSource(pageId, method, params, owner) {
        this.prune();
        const record = this.pages.get(pageId);
        if (!record || record.owner !== owner) throw new PageExpired('Unknown, expired or unowned page');
        const page = new record.PageClass();
        page.pageId = pageId;
        const callable = method === null ? page.main : sourceMethod(page, method);
        if (!callable) throw new SourceNotFound(`Unknown Source method: ${method}`);
        const builder = new record.PageClass.sourceBuilder();
        const result = await callable.call(page, builder.root, params);
        if (result !== undefined && result !== null) throw new TypeError('Source methods populate root and return no value');
        return builder.toTytx();
    }

    closePage(pageId, {owner = null} = {}) {
        if (this.pages.get(pageId)?.owner === owner) this.pages.delete(pageId);
    }

}
