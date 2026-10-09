/* @ts-self-types="./gramlot-server.d.ts" */
/**
 * The neutral server: registers pages and builds their Sources, with no HTTP engine.
 *
 * @module
 */
import {fromTytx, toTytx} from '@genrojs/tytx';
import {GramlotBuilder} from '../builder/gramlot-builder.js';
import {gramlotDev} from './assets.js';
import {ENDPOINT_METHOD, Page, SOURCE_METHOD, endpointMethod, sourceMethod} from './page.js';
import {loadOrder} from './resources.js';

export class PageExpired extends Error { name = 'PageExpired'; }
export class PageNotFound extends Error { name = 'PageNotFound'; }
/** An unknown remote Source method, as the Python `SourceNotFound`. */
export class SourceNotFound extends Error { name = 'SourceNotFound'; }
export class EndpointNotFound extends Error { name = 'EndpointNotFound'; }
export class NotAuthenticated extends Error { name = 'NotAuthenticated'; }
export class NotAuthorized extends Error { name = 'NotAuthorized'; }
/** A request envelope that is not `{id, pageId, contentType, name, params}`, as the Python `InvalidRequest`. */
export class InvalidRequest extends Error { name = 'InvalidRequest'; }
export class ServerCapacity extends Error { name = 'ServerCapacity'; }

/** The single place the outcome codes are spelled; any other error is application_error. */
const OUTCOME_CODES = new Map([[PageExpired, 'page_expired'], [SourceNotFound, 'not_found'],
    [EndpointNotFound, 'not_found'], [NotAuthenticated, 'not_authenticated'], [NotAuthorized, 'not_authorized']]);

const isMapping = value => value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;

/** Decode and check the request envelope {id, pageId, contentType, name, params}. */
function parseRequest(text) {
    let request;
    try {
        request = fromTytx(text);
    } catch (error) {
        throw new InvalidRequest('Request is not TYTX text', {cause: error});
    }
    if (!isMapping(request)) throw new InvalidRequest('Request must be a mapping');
    for (const field of ['id', 'pageId', 'contentType', 'name']) {
        if (typeof request[field] !== 'string') throw new InvalidRequest(`Request ${field} must be a string`);
    }
    if (!['source', 'data'].includes(request.contentType)) {
        throw new InvalidRequest('Request contentType must be source or data');
    }
    if (!isMapping(request.params)) throw new InvalidRequest('Request params must be a mapping');
    return request;
}

const scriptJson = value => JSON.stringify(value).replaceAll('<', '\\u003c');

/** 16 random bytes in URL-safe base64 without padding, as Python secrets.token_urlsafe(16). */
function createNonce() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

/** Add the mount prefix once to a root-relative URL (/…, not //…); relative and
 * absolute URLs stay as written. */
const prefixed = (prefix, url) => url.startsWith('/') && !url.startsWith('//') ? prefix + url : url;

/** Neutral server: no Node/Bun imports or server startup side effects. The core never
 * searches files: override resolvePage and resolveResources in concrete integrations;
 * GramlotFileServer implements them on one pages folder. Adapters supply request ownership.
 */
export class GramlotServer {
    constructor({runtimeUrl = '/assets/gramlot.js', rpcUrl = '/gramlot/rpc', closeUrl = '/gramlot/close',
                 rootId = 'gramlot-root', pageTtl = 1800, maxPages = 1000} = {}) {
        if (typeof pageTtl !== 'number' || pageTtl <= 0 ||
            !Number.isFinite(performance.now() + pageTtl * 1000) ||
            !Number.isSafeInteger(maxPages) || maxPages < 1) {
            throw new TypeError('Page TTL must be finite and positive; capacity must be a positive safe integer');
        }
        Object.assign(this, {runtimeUrl, rpcUrl, closeUrl, rootId, pageTtl, maxPages});
        this.pages = new Map();
    }

    /** The Page class of path, or PageNotFound. */
    async resolvePage(path) { throw new PageNotFound(`Page not found: ${path}`); }

    /** {css: [url], js: [{url, group}]} in load order and without mount prefix, or PageNotFound. */
    async resolveResources(path, PageClass) { throw new PageNotFound(`Page resources not found: ${path}`); }

    /** The capabilities announced in the bootstrap; none in the base server. */
    get capabilities() {
        return [];
    }

    /** null when a target with `rule` may run for `owner`, else 'not_authenticated' or
     * 'not_authorized'. The base server knows no identity: any rule is closed. */
    evaluateAuth(rule, {owner = null} = {}) {
        return rule === null ? null : 'not_authenticated';
    }

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
        if (this.pages.size >= this.maxPages) throw new ServerCapacity('Page registry capacity reached');
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
                config: {pageId, rpcUrl: prefixed(prefix, this.rpcUrl), closeUrl: prefixed(prefix, this.closeUrl),
                    rootId: this.rootId, capabilities: this.capabilities},
                resources: {css: resources.css.map(url => prefixed(prefix, url)),
                    js: resources.js.map(({url, group}) => ({url: prefixed(prefix, url), group}))},
            });
            const document = new GramlotBuilder();
            const root = document.root.html();
            const head = root.head();
            head.meta({charset: 'utf-8'});
            head.title(title);
            // A page module served for its Logic imports the core from the runtime already loaded.
            head.script(scriptJson({imports: {'@gramlot/gramlot/page': prefixed(prefix, this.runtimeUrl)}}),
                {type: 'importmap', nonce});
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

    /** Answer the request envelope `text` (TYTX) with the response envelope (TYTX).
     * Throws only InvalidRequest; every other failure is an outcome in the response,
     * a value that TYTX cannot serialise included. */
    async call(text, {owner = null} = {}) {
        const request = parseRequest(text);
        const response = {id: request.id, contentType: request.contentType};
        try {
            response.value = (await this.#run(request, owner)) ?? null;
            return toTytx(response);
        } catch (error) {
            delete response.value;
            response.error = {code: OUTCOME_CODES.get(error?.constructor) ?? 'application_error',
                name: error?.name ?? 'Error', message: error?.message ?? String(error)};
            if (gramlotDev() === 'DEBUG') response.error.details = error?.stack;
        }
        return toTytx(response);
    }

    /** Run the fragment or endpoint of a checked request: the value of the response. */
    async #run({pageId, contentType, name, params}, owner) {
        this.prune();
        const record = this.pages.get(pageId);
        if (!record || record.owner !== owner) throw new PageExpired('Unknown, expired or unowned page');
        const page = new record.PageClass();
        page.pageId = pageId;
        const source = contentType === 'source';
        let callable = page.main;
        let rule = null;
        if (!source || name !== 'main') {
            callable = (source ? sourceMethod : endpointMethod)(page, name);
            if (!callable) {
                throw source ? new SourceNotFound(`Unknown Source method: ${name}`)
                    : new EndpointNotFound(`Unknown endpoint: ${name}`);
            }
            rule = callable[source ? SOURCE_METHOD : ENDPOINT_METHOD].auth;
        }
        const refused = this.evaluateAuth(rule, {owner});
        if (![null, 'not_authenticated', 'not_authorized'].includes(refused)) {
            throw new TypeError("evaluateAuth must return null, 'not_authenticated' or 'not_authorized'");
        }
        if (refused !== null) {
            const Refusal = [NotAuthenticated, NotAuthorized].find(ErrorClass => OUTCOME_CODES.get(ErrorClass) === refused);
            throw new Refusal(`Access refused: ${name}`);
        }
        if (!source) return callable.call(page, params);
        const builder = new record.PageClass.sourceBuilder(name);
        const result = await callable.call(page, builder.root, params);
        if (result !== undefined && result !== null) throw new TypeError('Source methods populate root and return no value');
        return builder.toTytx();
    }

    closePage(pageId, {owner = null} = {}) {
        if (this.pages.get(pageId)?.owner === owner) this.pages.delete(pageId);
    }

    /** Forget every registered page; adapters call it on shutdown. */
    closeAll() {
        this.pages = new Map();
    }

}
