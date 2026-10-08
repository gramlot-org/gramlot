/**
 * Main and remote Source transport; application pages do not issue fetch calls.
 *
 * @module
 */
import type {BeaconNavigator} from './dom.d.ts';

/** The fetch function used by the transport. */
export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

/** The page-to-server transport: loads `main` and remote Sources and closes the server page. */
export class MainTransport {
    /** The URL of the `main` endpoint. */
    url: string;
    /** The function that sends the requests. */
    fetcher: Fetcher;
    /** The URL of the remote Source endpoint. */
    sourceUrl: string;
    /** The URL of the page close endpoint. */
    closeUrl: string;
    /** The navigator whose `sendBeacon` sends the close request on page hide. */
    navigator: BeaconNavigator;
    /** Create a transport with the endpoint URLs of the page. */
    constructor(url: string, fetcher?: Fetcher, sourceUrl?: string, closeUrl?: string,
        navigator?: BeaconNavigator);
    /** Request the `main` Source of `pageId`; resolves with the TYTX text. */
    main(pageId: string, signal?: AbortSignal): Promise<string>;
    /** Request the remote Source `method` of `pageId` with `params`; resolves with the TYTX text. */
    source(pageId: string, method: string, params: Record<string, unknown>, signal?: AbortSignal): Promise<string>;
    /** POST a JSON payload to `url`; resolves with the response text, rejects on a non-2xx status. */
    request(operation: string, url: string, payload: unknown, signal?: AbortSignal): Promise<string>;
    /** Ask the server to close the page, with a beacon or a best-effort fetch; delivery failure is ignored. */
    close(pageId: string, options?: {beacon?: boolean}): void;
}
