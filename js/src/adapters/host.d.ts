/**
 * The neutral host: registers pages and builds their Sources, with no HTTP engine.
 *
 * @module
 */
import type {Page} from './page.js';
import type {Resources} from './resources.js';

export type {Resources};

/** The page is unknown, expired or owned by someone else. */
export class PageExpired extends Error {}
/** No page exists for the requested path. */
export class PageNotFound extends Error {}
/** An unknown remote Source method, as the Python `SourceNotFound`. */
export class SourceNotFound extends Error {}
/** The page registry is full. */
export class HostCapacity extends Error {}

/** The options of a `Host`. */
export interface HostOptions {
    /** URL of the runtime bundle. */
    runtimeUrl?: string;
    /** URL of the `main` Source endpoint. */
    mainUrl?: string;
    /** URL of the remote Source endpoint. */
    sourceUrl?: string;
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
 * Neutral host: no Node or Bun imports and no server startup side effects. The core never
 * searches files: override `resolvePage` and `resolveResources` in concrete integrations.
 */
export class Host {
    /** URL of the runtime bundle. */
    runtimeUrl: string;
    /** URL of the `main` Source endpoint. */
    mainUrl: string;
    /** URL of the remote Source endpoint. */
    sourceUrl: string;
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
    /** Create a host. */
    constructor(options?: HostOptions);
    /** The Page class of `path`, or `PageNotFound`. */
    resolvePage(path: string): Promise<typeof Page>;
    /** The resources of the page at `path` in load order and without mount prefix, or `PageNotFound`. */
    resolveResources(path: string, PageClass: typeof Page): Promise<Resources>;
    /** Drop the expired pages. */
    prune(): void;
    /** Register a page independently of its HTTP or Worker transport. */
    registerPage(path: string, options?: {owner?: unknown}): Promise<RegisteredPage>;
    /** Register the page and return its bootstrap; `prefix` is the mount prefix added to root-relative URLs. */
    openPage(path: string, options?: {owner?: unknown; prefix?: string}): Promise<OpenedPage>;
    /** The `main` Source of a registered page, as TYTX text. */
    main(pageId: string, options?: {owner?: unknown}): Promise<string>;
    /** A remote Source of a registered page, as TYTX text; `params` null or omitted is `{}`. */
    source(pageId: string, method: string, params?: Record<string, unknown> | null,
        options?: {owner?: unknown}): Promise<string>;
    /** Build the Source of a page by calling its `main` or a registered Source method. */
    buildSource(pageId: string, method: string | null, params: Record<string, unknown>,
        owner: unknown): Promise<string>;
    /** Forget a registered page when `owner` owns it. */
    closePage(pageId: string, options?: {owner?: unknown}): void;
}
