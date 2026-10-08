/**
 * One Gramlot page in the browser.
 *
 * @module
 */
import type {DomElement, DomDocument, DomEvent, DomWindow} from './dom.d.ts';
import type {Bag} from '@genrojs/bag';
import type {MainTransport} from './transport.js';
import type {SourceHandler} from './handlers/source-handler.js';
import type {RpcHandler} from './handlers/rpc-handler.js';
import type {DomHandler} from './handlers/dom-handler.js';
import type {UtilitiesHandler} from './handlers/utilities-handler.js';

/** The options of a `Gramlot` instance. */
export interface GramlotOptions {
    /** The id of the server page, as registered by the host. */
    pageId?: string;
    /** The URL of the `main` Source endpoint. */
    mainUrl?: string;
    /** The URL of the remote Source endpoint. */
    sourceUrl?: string;
    /** The URL of the page close endpoint. */
    closeUrl?: string;
    /** The id of the root element that receives the page. */
    rootId?: string;
    /** The root element; when null it is looked up by `rootId`. */
    element?: DomElement | null;
    /** The document of the page. */
    document?: DomDocument;
    /** A transport, or `false` for an instance with no server transport. */
    transport?: MainTransport | false | null;
    /** Grammar collections loaded into the builder. */
    collections?: unknown[];
}

/** The lifecycle state of a `Gramlot` instance. */
export type GramlotState = 'ready' | 'loading' | 'started' | 'failed' | 'disposed';

/** One Gramlot page: lifecycle, Data and the four proxies `src`, `rpc`, `dom`, `utl`. */
export class Gramlot {
    /** The id of the server page. */
    pageId: string | undefined;
    /** The root group of the named logic of the page. */
    logic: unknown;
    /** The Source and every change of it. */
    src: SourceHandler;
    /** The Data Bag of the page. */
    data: Bag;
    /** The exchange with the host. */
    rpc: RpcHandler;
    /** The DOM and its correspondence with the Source. */
    dom: DomHandler;
    /** Page utilities grouped by theme. */
    utl: UtilitiesHandler;
    /** The lifecycle state. */
    state: GramlotState;
    /** The controller aborted on dispose. */
    abort: AbortController;
    /** The pending `start` promise, while loading. */
    loading?: Promise<Gramlot> | null;
    /** The window whose `pagehide` disposes the page; set only with the default `MainTransport`. */
    window?: DomWindow;
    /** The `pagehide` listener that disposes the page with a beacon; set only with the default `MainTransport`. */
    pagehide?: (event: DomEvent) => void;
    /** Create the page instance; the construction order is the one of the source plan. */
    constructor(options?: GramlotOptions);
    /** Load `main` from the server and mount it; resolves with the instance. */
    start(): Promise<Gramlot>;
    /** Request `main` from the transport and mount it. */
    loadMain(): Promise<Gramlot>;
    /** Dispose the page: abort requests, close bindings and the renderer, and close the server page. */
    dispose(options?: {beacon?: boolean}): void;
}
