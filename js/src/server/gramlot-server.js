/* @ts-self-types="./gramlot-server.d.ts" */
/**
 * The neutral server: registers pages and builds their Sources, with no HTTP engine.
 *
 * @module
 */
import {fromTytx, toTytx} from '@genrojs/tytx';
import {GramlotBuilder} from '../builder/gramlot-builder.js';
import {NAME_SYNTAX} from '../builder/name-syntax.js';
import {gramlotDev} from './assets.js';
import {ENDPOINT_METHOD, Page, SOURCE_METHOD, resolveDeclared} from './page.js';
import {InvalidResourceName, SEGMENT, loadOrder} from './resources.js';

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

/** Whether `value` is JSON written unchanged by `JSON.stringify`: null, a boolean, a string, a finite number,
 * or an array or plain object of such values, without cycles. The check of Python `json.dumps(allow_nan=False)`. */
function isJson(value, ancestors = new Set()) {
    if (value === null || typeof value === 'boolean' || typeof value === 'string') return true;
    if (typeof value === 'number') return Number.isFinite(value);
    if ((!Array.isArray(value) && !isMapping(value)) || ancestors.has(value)) return false;
    ancestors.add(value);
    const result = Object.values(value).every(item => isJson(item, ancestors));
    ancestors.delete(value);
    return result;
}

/** Whether `value` names a theme: one segment of letters, digits, `_` or `-` (a folder of `themes/`). */
const isThemeName = value => typeof value === 'string' && SEGMENT.test(value);

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
 * `cssTheme` is the base theme of every page, the name of a folder of the core themes
 * (`/themes/<name>/theme.css`), or false for no base theme; a page replaces it with
 * `Page.css_theme`. The methods shared by every adapter, whatever its transport, are
 * decodeBody (the request body), call (the request envelope), close (the close message),
 * openPage or registerPage, and closeAll.
 *
 * A page expires `pageTtl` seconds after its last use: opening it and every call that names it for its
 * owner move the expiry to now plus `pageTtl` (GC-230 §010).
 */
export class GramlotServer {
    constructor({runtimeUrl = '/assets/gramlot.js', rpcUrl = '/gramlot/rpc', closeUrl = '/gramlot/close',
                 rootId = 'gramlot-root', pageTtl = 1800, maxPages = 1000, collections = [],
                 cssTheme = 'gramlot-base'} = {}) {
        if (cssTheme !== false && !isThemeName(cssTheme)) {
            throw new TypeError(`The base theme must be a theme name or false, not ${JSON.stringify(cssTheme)}`);
        }
        if (typeof pageTtl !== 'number' || pageTtl <= 0 ||
            !Number.isFinite(performance.now() + pageTtl * 1000) ||
            !Number.isSafeInteger(maxPages) || maxPages < 1) {
            throw new TypeError('Page TTL must be finite and positive; capacity must be a positive safe integer');
        }
        Object.assign(this, {runtimeUrl, rpcUrl, closeUrl, rootId, pageTtl, maxPages, cssTheme});
        this.pages = new Map();
        this.collections = [...collections];
    }

    /** The Page class of path, or PageNotFound. */
    async resolvePage(path) { throw new PageNotFound(`Page not found: ${path}`); }

    /** {css: [url], js: [{url, group}]} in load order and without mount prefix, or PageNotFound. */
    async resolveResources(path, PageClass) { throw new PageNotFound(`Page resources not found: ${path}`); }

    /** The capabilities announced in the bootstrap; none in the base server. */
    get capabilities() {
        return [];
    }

    /** The NameSyntax of the method names a request may carry, announced in the bootstrap
     * (`nameSyntax`) and given to the builders of the pages. The core resolves dotted paths from the
     * page (`NAME_SYNTAX`); a subclass may narrow it, and a subclass with another syntax resolves its
     * names itself. */
    get nameSyntax() {
        return NAME_SYNTAX;
    }

    /** The URL of the module whose default export is the ServerAdapter class of the browser (GC-230
     * §010), or null for the HTTP ServerAdapter of the core runtime. The module imports the core from
     * `@gramlot/gramlot/page`, which the import map points at the runtime. */
    get serverAdapter() {
        return null;
    }

    /** null when a target with `rule` may run for `owner` with `identity` (the identity the adapter
     * passed with the call, null when it passed none), else 'not_authenticated' or 'not_authorized'.
     * The base server knows no identity: any rule is closed. */
    evaluateAuth(rule, {owner = null, identity = null} = {}) {
        return rule === null ? null : 'not_authenticated';
    }

    /** evaluateAuth with its result checked: a value other than null, 'not_authenticated' and
     * 'not_authorized' is a TypeError. */
    #authOutcome(rule, owner, identity) {
        const refused = this.evaluateAuth(rule, {owner, identity});
        if (![null, 'not_authenticated', 'not_authorized'].includes(refused)) {
            throw new TypeError("evaluateAuth must return null, 'not_authenticated' or 'not_authorized'");
        }
        return refused;
    }

    /** The expiry of a page used now: `pageTtl` seconds from now, on the clock of `performance.now()`. */
    #expiry() {
        return performance.now() + this.pageTtl * 1000;
    }

    prune() {
        const now = performance.now();
        for (const [id, record] of this.pages) if (record.expires <= now) this.pages.delete(id);
    }

    /** Describe the root application without registering a page session. */
    async pageManifest({prefix = ''} = {}) {
        const PageClass = await this.resolvePage('/');
        if (PageClass.installable !== true) throw new PageNotFound('The root page is not installable');
        const result = await new PageClass().manifest({baseUrl: prefix + '/'});
        if (!isMapping(result) || !isJson(result)) throw new TypeError('Page.manifest must return a JSON object');
        return result;
    }

    /** The CSS URL of the theme of the page class, in an array, or an empty array: `Page.css_theme`
     * when it is a theme name, no theme when it is false, the base theme of the server (`cssTheme`)
     * when it is null. Another value is an InvalidResourceName. */
    themeCss(PageClass) {
        const theme = PageClass.css_theme ?? this.cssTheme;
        if (theme === false) return [];
        if (!isThemeName(theme)) {
            throw new InvalidResourceName(`Page.css_theme must be null, false or a theme name, not ${JSON.stringify(theme)}`);
        }
        return [`/themes/${theme}/theme.css`];
    }

    /** Register a page independently of its HTTP or Worker transport. As on a static host,
     * `<path>/index.html` registers the page `<path>/` and `/index.html` the index. The CSS of the
     * page is its theme (themeCss), then the CSS of resolveResources, each URL once in its last
     * position. */
    async registerPage(path, {owner = null} = {}) {
        if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length);
        const PageClass = await this.resolvePage(path);
        if (typeof PageClass !== 'function' || !(PageClass.prototype instanceof Page)) {
            throw new TypeError('Page modules must export a subclass of Page');
        }
        const resolved = await this.resolveResources(path, PageClass);
        const resources = loadOrder({...resolved, css: [...this.themeCss(PageClass), ...resolved.css]});
        if (this.collections.length) resources.collections = this.collections.map(item => item.module);
        if (this.serverAdapter !== null) resources.serverAdapter = this.serverAdapter;
        this.prune();
        if (this.pages.size >= this.maxPages) throw new ServerCapacity('Page registry capacity reached');
        const pageId = crypto.randomUUID().replaceAll('-', '');
        this.pages.set(pageId, {PageClass, owner, expires: this.#expiry()});
        return {pageId, title: PageClass.title, resources, nameSyntax: this.nameSyntax.toJSON(),
            ...(PageClass.devices.length ? {devices: [...PageClass.devices]} : {}),
            ...(PageClass.locale == null ? {} : {locale: PageClass.locale}),
            ...(PageClass.timeZone == null ? {} : {timeZone: PageClass.timeZone})};
    }

    /** Register the page (registerPage) and return its bootstrap. prefix is the mount prefix chosen
     * by the adapter, added once to the root-relative bootstrap URLs. */
    async openPage(path, {owner = null, prefix = ''} = {}) {
        if (typeof prefix !== 'string') throw new TypeError('Mount prefix must be a string');
        const {pageId, title, resources, nameSyntax, locale, timeZone, devices} = await this.registerPage(path, {owner});
        try {
            const nonce = createNonce();
            // The CSS links and the JS modules reach the page through PageBootstrap (§4.12, D9).
            const bootstrap = scriptJson({
                config: {pageId, rpcUrl: prefixed(prefix, this.rpcUrl), closeUrl: prefixed(prefix, this.closeUrl),
                    rootId: this.rootId, capabilities: this.capabilities, nameSyntax,
                    ...(devices === undefined ? {} : {devices}),
                    ...(locale === undefined ? {} : {locale}), ...(timeZone === undefined ? {} : {timeZone})},
                resources: {...(resources.collections ? {collections: resources.collections.map(url => prefixed(prefix, url))} : {}),
                    css: resources.css.map(url => prefixed(prefix, url)),
                    js: resources.js.map(({url, group}) => ({url: prefixed(prefix, url), group})),
                    ...(resources.serverAdapter ? {serverAdapter: prefixed(prefix, resources.serverAdapter)} : {})},
            });
            const document = new GramlotBuilder();
            const root = document.root.html();
            const head = root.head();
            head.meta({charset: 'utf-8'});
            head.meta({name: 'viewport', content: 'width=device-width,initial-scale=1'});
            head.title(title);
            if (['', 'index', 'index.html'].includes(path.replace(/^\/+|\/+$/g, '')) && this.pages.get(pageId).PageClass.installable === true) {
                head.link({rel: 'manifest', href: prefix + '/app.webmanifest'});
            }
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

    /** The text of a request body, `data` as bytes (an ArrayBuffer or a typed array): UTF-8, a leading
     * byte order mark removed (GC-230 §120). Bytes that are not UTF-8 are an InvalidRequest. */
    decodeBody(data) {
        try {
            return new TextDecoder('utf-8', {fatal: true}).decode(data);
        } catch (error) {
            throw new InvalidRequest('Request body is not UTF-8', {cause: error});
        }
    }

    /** Answer the request envelope `text` (TYTX) with the response envelope (TYTX).
     * Throws only InvalidRequest; every other failure is an outcome in the response,
     * a value that TYTX cannot serialise included. `identity` is the identity of this call (for
     * example the avatar of a login), read only by evaluateAuth; the server keeps nothing of it. */
    async call(text, {owner = null, identity = null} = {}) {
        const request = parseRequest(text);
        const response = {id: request.id, contentType: request.contentType};
        try {
            response.value = (await this.#run(request, owner, identity)) ?? null;
            return toTytx(response);
        } catch (error) {
            delete response.value;
            response.error = {code: OUTCOME_CODES.get(error?.constructor) ?? 'application_error',
                name: error?.name ?? 'Error', message: error?.message ?? String(error)};
            if (gramlotDev() === 'DEBUG') response.error.details = error?.stack;
        }
        return toTytx(response);
    }

    /**
     * Run the fragment or endpoint of a checked request: the value of the response. `name` is `main`, a
     * method of the page or a path `a.b.c.method` read from the page (`resolveDeclared`) that `nameSyntax`
     * matches; the `auth` of the method's marker is its only authorization. A call that names a page of its
     * owner that has not expired renews the page, whatever the outcome of the method; any other call renews
     * nothing (GC-230 §010).
     */
    async #run({pageId, contentType, name, params}, owner, identity) {
        this.prune();
        const record = this.pages.get(pageId);
        if (!record || record.owner !== owner) throw new PageExpired('Unknown, expired or unowned page');
        record.expires = this.#expiry();
        const page = new record.PageClass();
        page.pageId = pageId;
        const source = contentType === 'source';
        let instance = page;
        let callable = page.main;
        let rule = null;
        if (!source || name !== 'main') {
            const marker = source ? SOURCE_METHOD : ENDPOINT_METHOD;
            const declared = this.nameSyntax.matches(name) ? resolveDeclared(page, name, marker) : null;
            if (!declared) {
                throw source ? new SourceNotFound(`Unknown Source method: ${name}`)
                    : new EndpointNotFound(`Unknown endpoint: ${name}`);
            }
            ({instance, method: callable} = declared);
            rule = callable[marker].auth;
        }
        const refused = this.#authOutcome(rule, owner, identity);
        if (refused !== null) {
            const Refusal = [NotAuthenticated, NotAuthorized].find(ErrorClass => OUTCOME_CODES.get(ErrorClass) === refused);
            throw new Refusal(`Access refused: ${name}`);
        }
        if (!source) return callable.call(instance, params);
        const builder = new record.PageClass.sourceBuilder(name,
            {auth: elementRule => this.#authOutcome(elementRule, owner, identity), nameSyntax: this.nameSyntax});
        for (const collection of this.collections) builder.loadCollection(collection.grammar);
        const result = await callable.call(instance, builder.root, params);
        if (result !== undefined && result !== null) throw new TypeError('Source methods populate root and return no value');
        return builder.toTytx();
    }

    /** Close the page named by the close message `text`, `{"pageId": string}` as JSON, when `owner`
     * owns it (GC-230 §125); an unknown or unowned page is left as it is. A text that is not JSON, or
     * whose pageId is not a string, is an InvalidRequest. */
    close(text, {owner = null} = {}) {
        let message;
        try {
            message = JSON.parse(text);
        } catch (error) {
            throw new InvalidRequest('Close message is not JSON', {cause: error});
        }
        if (!isMapping(message) || typeof message.pageId !== 'string') {
            throw new InvalidRequest('Close message pageId must be a string');
        }
        this.closePage(message.pageId, {owner});
    }

    closePage(pageId, {owner = null} = {}) {
        if (this.pages.get(pageId)?.owner === owner) this.pages.delete(pageId);
    }

    /** Forget every registered page; adapters call it on shutdown. */
    closeAll() {
        this.pages = new Map();
    }

}
