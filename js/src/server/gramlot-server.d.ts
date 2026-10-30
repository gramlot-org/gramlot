/**
 * The neutral server: registers pages and builds their Sources, with no HTTP engine.
 *
 * @module
 */
import type {Bag} from '@genrojs/bag';
import type {GramlotBuilder} from '../builder/gramlot-builder.js';
import type {Page} from './page.js';
import type {Resources} from './resources.js';
import type {NameSyntax, NameSyntaxDescriptor} from '../builder/name-syntax.js';

export type {Resources};

/** The page is unknown, expired or owned by someone else. */
export class PageExpired extends Error {
    name: 'PageExpired';
}
/** No page exists for the requested path. */
export class PageNotFound extends Error {
    name: 'PageNotFound';
}
/** An unknown remote Source method, as the Python `SourceNotFound`. */
export class SourceNotFound extends Error {
    name: 'SourceNotFound';
}
/** No endpoint of that name, as the Python `EndpointNotFound`. */
export class EndpointNotFound extends Error {
    name: 'EndpointNotFound';
}
/** The `auth` evaluator answered `not_authenticated`. */
export class NotAuthenticated extends Error {
    name: 'NotAuthenticated';
}
/** The `auth` evaluator answered `not_authorized`. */
export class NotAuthorized extends Error {
    name: 'NotAuthorized';
}
/** A request envelope that is not `{id, pageId, contentType, name, params}`, as the Python `InvalidRequest`. */
export class InvalidRequest extends Error {
    name: 'InvalidRequest';
}
/** The page registry is full. */
export class ServerCapacity extends Error {
    name: 'ServerCapacity';
}

/** The outcome of a refused `auth` rule, or null when the call may proceed. */
export type AuthOutcome = 'not_authenticated' | 'not_authorized' | null;

/** Prepared artifact metadata, also accepted by Page.gramlots. */
export interface PreparedCollection {
    name: string;
    buildId: string;
    grammar: Record<string, unknown>;
    module: string;
    css: string[];
    dependencies: string[];
}

/** The options of a `GramlotServer`. */
export interface GramlotServerOptions {
    /** URL of the runtime bundle. */
    runtimeUrl?: string;
    /** URL of the request envelopes. */
    rpcUrl?: string;
    /** URL of the page close endpoint. */
    closeUrl?: string;
    /** Id of the root element of the page. */
    rootId?: string;
    /** Seconds a page lives after its last use: opening it and each call that names it for its owner renew it. */
    pageTtl?: number;
    /** Maximum number of registered pages. */
    maxPages?: number;
    /** Application collections: generated Builder grammar and root-relative browser module URL. */
    collections?: PreparedCollection[];
    /** The base theme of every page, a folder of the core themes, or false for none; default `gramlot-base`. */
    cssTheme?: string | false;
}

/** The result of `registerPage`. */
export interface RegisteredPage {
    devices?: Array<'desktop' | 'tablet' | 'phone'>;
    locale?: string;
    timeZone?: string;
    /** The id of the registered page. */
    pageId: string;
    /** The title of the page. */
    title: string;
    /** The resources of the page, in load order. */
    resources: Resources;
    /** The name syntax of the server, as the bootstrap carries it. */
    nameSyntax: NameSyntaxDescriptor;
}

/** The result of `openPage`. */
export interface OpenedPage {
    /** The id of the registered page. */
    pageId: string;
    /** The bootstrap HTML document. */
    html: string;
    /** The nonce of the inline scripts, for the Content Security Policy. */
    nonce: string;
}

/**
 * Neutral server: no Node or Bun imports and no server startup side effects. The core never
 * searches files: override `resolvePage` and `resolveResources` in concrete integrations.
 */
export class GramlotServer {
    /** URL of the runtime bundle. */
    runtimeUrl: string;
    /** URL of the request envelopes. */
    rpcUrl: string;
    /** URL of the page close endpoint. */
    closeUrl: string;
    /** Id of the root element of the page. */
    rootId: string;
    /** Seconds a page lives after its last use: opening it and each call that names it for its owner renew it. */
    pageTtl: number;
    /** Maximum number of registered pages. */
    maxPages: number;
    /** The base theme of every page, or false for none. */
    cssTheme: string | false;
    /** The registered pages by id. */
    pages: Map<string, {PageClass: typeof Page; path: string; owner: unknown; expires: number}>;
    /** Create a server. */
    /** Resolve class-local declarations and their named dependencies, base first. */
    pageCollections(PageClass: typeof Page): PreparedCollection[];
    /** Environment-local Page class; the imported class remains unchanged. */
    environmentPage(PageClass: typeof Page): typeof Page;
    collectionGraph(collections: PreparedCollection[]): PreparedCollection[];
    loadCollections(builder: GramlotBuilder, collections: PreparedCollection[]): void;
    constructor(options?: GramlotServerOptions);
    /** The Page class of `path`, or `PageNotFound`. */
    pageManifest(options?: {prefix?: string}): Promise<Record<string, unknown>>;
    /** Optional initial Data Bag; null when the page has no companion. */
    resolveData(path: string): Promise<Bag | null>;
    resolvePage(path: string): Promise<typeof Page>;
    /** The resources of the page at `path` in load order and without mount prefix, or `PageNotFound`. */
    resolveResources(path: string, PageClass: typeof Page): Promise<Resources>;
    /** The capabilities announced in the bootstrap; none in the base server. */
    get capabilities(): string[];
    /** The syntax of the method names a request may carry, announced in the bootstrap; the core default `NAME_SYNTAX`. */
    get nameSyntax(): NameSyntax;
    /** The URL of the module of the browser ServerAdapter class, or null for the HTTP ServerAdapter of the core. */
    get serverAdapter(): string | null;
    /** null when a target with `rule` may run for `owner` with the `identity` of the call; the base server refuses any rule. */
    evaluateAuth(rule: string | null, options?: {owner?: unknown; identity?: unknown}): AuthOutcome;
    /** Drop the expired pages. */
    prune(): void;
    /** The CSS URL of the theme of a page class, in an array, or an empty array. */
    themeCss(PageClass: typeof Page): string[];
    /** The file of a `/themes/<path>` URL path whose real path is a file of the core themes, or null. Node.js and Bun only. */
    themeFile(path: string): Promise<string | null>;
    /** Register a page independently of its HTTP or Worker transport; `<path>/index.html` registers `<path>/`. */
    registerPage(path: string, options?: {owner?: unknown}): Promise<RegisteredPage>;
    /** Register the page and return its bootstrap; `prefix` is the mount prefix added to root-relative URLs. */
    openPage(path: string, options?: {owner?: unknown; prefix?: string}): Promise<OpenedPage>;
    /** The text of a request body: UTF-8, a leading byte order mark removed; other bytes throw `InvalidRequest`. */
    decodeBody(data: ArrayBuffer | ArrayBufferView): string;
    /** Answer the request envelope `text` (TYTX) with the response envelope (TYTX); throws only `InvalidRequest`. `identity` is the identity of this call, read only by `evaluateAuth`. */
    call(text: string, options?: {owner?: unknown; identity?: unknown}): Promise<string>;
    /** Close the page named by the close message `text` (`{"pageId": string}` as JSON) when `owner` owns it; throws `InvalidRequest`. */
    close(text: string, options?: {owner?: unknown}): void;
    /** Forget a registered page when `owner` owns it. */
    closePage(pageId: string, options?: {owner?: unknown}): void;
    /** Forget every registered page; adapters call it on shutdown. */
    closeAll(): void;
}
