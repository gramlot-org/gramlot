/**
 * The neutral server: registers pages and builds their Sources, with no HTTP engine.
 *
 * @module
 */
import type {Page} from './page.js';
import type {Resources} from './resources.js';

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
    /** Seconds a registered page lives. */
    pageTtl?: number;
    /** Maximum number of registered pages. */
    maxPages?: number;
}

/** The result of `registerPage`. */
export interface RegisteredPage {
    /** The id of the registered page. */
    pageId: string;
    /** The title of the page. */
    title: string;
    /** The resources of the page, in load order. */
    resources: Resources;
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
    /** Seconds a registered page lives. */
    pageTtl: number;
    /** Maximum number of registered pages. */
    maxPages: number;
    /** The registered pages by id. */
    pages: Map<string, {PageClass: typeof Page; owner: unknown; expires: number}>;
    /** Create a server. */
    constructor(options?: GramlotServerOptions);
    /** The Page class of `path`, or `PageNotFound`. */
    resolvePage(path: string): Promise<typeof Page>;
    /** The resources of the page at `path` in load order and without mount prefix, or `PageNotFound`. */
    resolveResources(path: string, PageClass: typeof Page): Promise<Resources>;
    /** The capabilities announced in the bootstrap; none in the base server. */
    get capabilities(): string[];
    /** null when a target with `rule` may run for `owner`; the base server refuses any rule. */
    evaluateAuth(rule: string | null, options?: {owner?: unknown}): AuthOutcome;
    /** Drop the expired pages. */
    prune(): void;
    /** Register a page independently of its HTTP or Worker transport. */
    registerPage(path: string, options?: {owner?: unknown}): Promise<RegisteredPage>;
    /** Register the page and return its bootstrap; `prefix` is the mount prefix added to root-relative URLs. */
    openPage(path: string, options?: {owner?: unknown; prefix?: string}): Promise<OpenedPage>;
    /** Answer the request envelope `text` (TYTX) with the response envelope (TYTX); throws only `InvalidRequest`. */
    call(text: string, options?: {owner?: unknown}): Promise<string>;
    /** Forget a registered page when `owner` owns it. */
    closePage(pageId: string, options?: {owner?: unknown}): void;
    /** Forget every registered page; adapters call it on shutdown. */
    closeAll(): void;
}
