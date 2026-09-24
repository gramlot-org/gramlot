import {HtmlBuilder} from '@jsr/genro__builders';
import {Page, sourceMethod} from './page.js';

export class PageExpired extends Error {}
export class PageNotFound extends Error {}
export class HostCapacity extends Error {}

const scriptJson = value => JSON.stringify(value).replaceAll('<', '\\u003c');

/** Neutral host: no Node/Bun imports or server startup side effects.
 * Override resolvePage in concrete integrations; adapters supply request ownership.
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

    async resolvePage(path) { throw new PageNotFound(`Page not found: ${path}`); }

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
        this.prune();
        if (this.pages.size >= this.maxPages) throw new HostCapacity('Page registry capacity reached');
        const pageId = crypto.randomUUID().replaceAll('-', '');
        this.pages.set(pageId, {PageClass, owner, expires: performance.now() + this.pageTtl * 1000});
        return {pageId, title: PageClass.title, css: PageClass.css};
    }

    async openPage(path, {owner = null} = {}) {
        const {pageId, title, css} = await this.registerPage(path, {owner});
        try {
            const config = scriptJson({pageId, mainUrl: this.mainUrl, sourceUrl: this.sourceUrl,
                closeUrl: this.closeUrl, rootId: this.rootId});
            const document = new HtmlBuilder();
            const root = document.root.html();
            const head = root.head();
            head.meta({charset: 'utf-8'});
            head.title(title);
            for (const url of css) head.link({rel: 'stylesheet', href: url});
            const body = root.body();
            body.div({id: this.rootId});
            body.script(`import {Gramlot} from ${scriptJson(this.runtimeUrl)};` +
                `const app = new Gramlot(${config});window.gramlot=app;await app.start();`,
                {type: 'module'});
            const html = '<!doctype html>' + document.render();
            return {pageId, html};
        } catch (error) {
            this.closePage(pageId, {owner});
            throw error;
        }
    }

    async main(pageId, {owner = null} = {}) {
        return this.buildSource(pageId, null, {}, owner);
    }

    async source(pageId, method, params = {}, {owner = null} = {}) {
        if (typeof method !== 'string' || method === 'main') throw new PageNotFound('Source method not found');
        if (!params || typeof params !== 'object' || Array.isArray(params)) throw new TypeError('Source params must be an object');
        return this.buildSource(pageId, method, params, owner);
    }

    async buildSource(pageId, method, params, owner) {
        this.prune();
        const record = this.pages.get(pageId);
        if (!record || record.owner !== owner) throw new PageExpired('Unknown, expired or unowned page');
        const page = new record.PageClass();
        page.pageId = pageId;
        const callable = method === null ? page.main : sourceMethod(page, method);
        if (!callable) throw new PageNotFound('Source method not found');
        const builder = new record.PageClass.sourceBuilder();
        const result = await callable.call(page, builder.root, params);
        if (result !== undefined && result !== null) throw new TypeError('Source methods populate root and return no value');
        return builder.toTytx();
    }

    closePage(pageId, {owner = null} = {}) {
        if (this.pages.get(pageId)?.owner === owner) this.pages.delete(pageId);
    }

}
