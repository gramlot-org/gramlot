/**
 * The HTTP realisation of the Gramlot envelope; application pages do not issue fetch calls.
 *
 * @module
 */
import type {BeaconNavigator, DomXMLHttpRequestClass} from './dom.d.ts';

/** The fetch function used by the transport. */
export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

/** The page-to-server transport over HTTP: sends the envelope to the rpc URL and closes the server page. */
export class HttpTransport {
    /** The URL of the rpc endpoint. */
    rpcUrl: string;
    /** The function that sends the requests. */
    fetcher: Fetcher;
    /** The URL of the page close endpoint. */
    closeUrl: string;
    /** The navigator whose `sendBeacon` sends the close request on page hide. */
    navigator: BeaconNavigator;
    /** The XMLHttpRequest class of the window, used by `callSync`. */
    XMLHttpRequest: DomXMLHttpRequestClass;
    /** Create a transport on the rpc URL of the page. */
    constructor(rpcUrl: string, options?: {fetcher?: Fetcher; closeUrl?: string; navigator?: BeaconNavigator;
        XMLHttpRequest?: DomXMLHttpRequestClass});
    /** True: HTTP sends a synchronous call with a synchronous XMLHttpRequest. */
    readonly supportsCallSync: true;
    /** POST the request envelope text; resolves with the response envelope text, rejects on a non-200 status. */
    call(text: string, signal?: AbortSignal): Promise<string>;
    /** POST the request envelope text with a synchronous XMLHttpRequest; the response envelope text, or a throw on a non-200 status. Blocks the page while it waits. */
    callSync(text: string): string;
    /** Ask the server to close the page, with a beacon or a best-effort fetch; delivery failure is ignored. */
    close(pageId: string, options?: {beacon?: boolean}): void;
    /** Release the transport at the dispose of the page; HTTP holds no connection, so nothing is released. */
    dispose(): void;
}
