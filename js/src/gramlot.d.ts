/**
 * One Gramlot page in the browser.
 *
 * @module
 */
import type {DomElement, DomDocument, DomEvent, DomWindow} from './dom.d.ts';
import type {Bag} from '@genrojs/bag';
import type {createDecimal} from '@genrojs/tytx';
import type {SourceBagNode} from '@genrojs/builders';
import type {RpcTransport} from './handlers/rpc-handler.js';
import type {SourceHandler} from './handlers/source-handler.js';
import type {RpcHandler} from './handlers/rpc-handler.js';
import type {DomHandler} from './handlers/dom-handler.js';
import type {UtilitiesHandler} from './handlers/utilities-handler.js';

/** The options of a `Gramlot` instance. */
export interface GramlotOptions {
    /** Formatting locale of this page; null/omitted uses the browser locale. */
    locale?: string | null;
    /** Declared device suitability; empty means unspecified. */
    devices?: Array<'desktop' | 'tablet' | 'phone'>;
    /** Timezone for instants; null/omitted uses the browser timezone. */
    timeZone?: string | null;
    /** The id of the server page, as registered by the server. */
    pageId?: string;
    /** The URL of the rpc endpoint that receives the envelopes. */
    rpcUrl?: string;
    /** The URL of the page close endpoint. */
    closeUrl?: string;
    /** The id of the root element that receives the page. */
    rootId?: string;
    /** The capabilities announced by the server in the bootstrap. */
    capabilities?: string[];
    /** The root element; when null it is looked up by `rootId`. */
    element?: DomElement | null;
    /** The document of the page. */
    document?: DomDocument;
    /** A transport, or `false` for an instance with no server transport. */
    transport?: RpcTransport | false | null;
    /** Grammar collections loaded into the builder. */
    collections?: unknown[];
}

/** The lifecycle state of a `Gramlot` instance. */
export type GramlotState = 'ready' | 'loading' | 'started' | 'failed' | 'disposed';

/** Opaque registration returned by subscribe; meaningful only to its owning page. */
export interface SubscriptionHandle { readonly __subscriptionHandle: unique symbol; }

/** Bounded formatting subset. Call options override the page context. */
export interface FormatOptions {
    /** Numeric pattern or temporal short (default), medium, long, full. */
    pattern?: string;
    locale?: string;
    /** Overrides value inference; does not coerce strings or other incompatible values. */
    dtype?: 'L' | 'R' | 'N' | 'D' | 'H' | 'DHZ';
    /** Overrides the page timezone for DHZ; D/H do not shift. */
    timeZone?: string;
    /** Wrap formatted text using {}. Null and an empty zero section bypass the mask. */
    mask?: string;
}

/** Legacy-shaped publication. Frame forwarding follows synchronous local delivery. */
export type Publication = string | {topic: string; nodeId: string} |
    {topic: string; parent?: boolean; iframe?: string | SourceBagNode};

/** One Gramlot page: lifecycle, Data and the four proxies `src`, `rpc`, `dom`, `utl`. */
export class Gramlot {
    readonly devices: readonly ('desktop' | 'tablet' | 'phone')[];
    locale: string;
    timeZone: string;
    /** The id of the server page. */
    pageId: string | undefined;
    /** The capabilities announced by the server in the bootstrap, frozen. */
    capabilities: readonly string[];
    /** The root group of the named logic of the page. */
    logic: unknown;
    /** The Source and every change of it. */
    src: SourceHandler;
    /** The Data Bag of the page. */
    data: Bag;
    /** The exchange with the server. */
    rpc: RpcHandler;
    /** The DOM and its correspondence with the Source. */
    dom: DomHandler;
    /** Page utilities grouped by theme. */
    utl: UtilitiesHandler;
    /** The lifecycle state. */
    state: GramlotState;
    /** The controller aborted on dispose; its abort aborts every call of `rpc` in flight. */
    abort: AbortController;
    /** The pending `start` promise, while loading. */
    loading?: Promise<Gramlot> | null;
    /** The window whose `pagehide` disposes the page; set only with the default `HttpTransport`. */
    window?: DomWindow;
    /** The `pagehide` listener that disposes the page with a beacon; set only with the default `HttpTransport`. */
    pagehide?: (event: DomEvent) => void;
    /** Create the page instance; the construction order is the one of the source plan. */
    constructor(options?: GramlotOptions);
    /** Publish one named payload; forwarding uses postMessage and requires a ready page. */
    publish(topic: Publication, payload?: Record<string, unknown>): void;
    /** Subscribe to a local page topic, synchronously in registration order. */
    subscribe(topic: string, callback: (payload: Record<string, unknown>) => unknown): SubscriptionHandle;
    /** Remove a registration; repeating removal of an owned handle is harmless. */
    unsubscribe(registration: SubscriptionHandle): void;
    /** Format a number, Date or null. Explicit dtype overrides TYTX-style Date inference. */
    format(value: number | Date | ReturnType<typeof createDecimal> | null, options?: string | FormatOptions): string;
    /** Load `main` from the server and mount it; resolves with the instance. */
    start(): Promise<Gramlot>;
    /** Request `main` from the transport and mount it. */
    loadMain(): Promise<Gramlot>;
    /** Dispose the page: abort requests, close bindings and the renderer, and close the server page. */
    dispose(options?: {beacon?: boolean}): void;
}
