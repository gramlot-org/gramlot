/**
 * The exchange of one Gramlot page with the server (`gramlot.rpc`).
 *
 * @module
 */
import type {DomDocument} from '../dom.d.ts';
import type {Gramlot} from '../gramlot.js';
import {Handler} from './handler.js';

/**
 * The transport contract of `RpcHandler`: one envelope text in, one envelope text out. Every member is required:
 * the page closes the server page with `close` and releases the transport with `dispose` when it is disposed.
 */
export interface RpcTransport {
    /** Send the request envelope text; resolves with the response envelope text. */
    call(text: string, signal?: AbortSignal): Promise<string>;
    /** Send the close message of the page `pageId` without waiting; HTTP always uses a beacon. */
    close(pageId: string): void;
    /** Release the transport; called once, after `close`, when the page is disposed. */
    dispose(): void;
    /** True when the transport sends a synchronous call with `callSync`; a transport without it has none. */
    readonly supportsCallSync?: boolean;
    /** Send the request envelope text and return the response envelope text synchronously; required when `supportsCallSync` is true. */
    callSync?(text: string): string;
}

/** The error outcome of a response envelope. */
export interface RpcErrorOutcome {
    /** The outcome code (`page_expired`, `not_found`, `not_authenticated`, `not_authorized`, `application_error`). */
    code: string;
    /** The class name of the server exception. */
    name: string;
    /** The message of the server exception. */
    message: string;
    /** The server traceback, with `GRAMLOT_DEV=DEBUG`. */
    details?: string;
}

/** An error outcome answered by the server inside the response envelope. */
export class RpcError extends Error {
    /** The outcome code. */
    code: string;
    /** The class name of the server exception. */
    remoteName: string;
    /** The server traceback, when the server sent it. */
    details?: string;
    /** Create the error from the `error` field of a response envelope. */
    constructor(outcome: RpcErrorOutcome);
}

/** The exchange with the server. */
export class RpcHandler extends Handler {
    /** The server transport, or null. */
    transport: RpcTransport | null;
    /** The calls in flight, by envelope id, with the AbortController of each; written only by `call`. */
    remoteRequests: Map<string, AbortController>;
    /** Create the transport of `gramlot`: the given one, none for `false`, else the one of `gramlot.serverAdapter`. */
    constructor(gramlot: Gramlot, options: {rpcUrl: string; closeUrl: string; document: DomDocument;
        transport?: RpcTransport | false | null});
    /**
     * Send one envelope of `contentType` to `name` with `params`; resolves with the value or rejects with an
     * `RpcError`. `signal` and the dispose of the page (`gramlot.abort`) abort the call, which then rejects at
     * once with the abort reason; a call aborted before it starts is not sent.
     */
    call(contentType: 'source' | 'data', name: string, params?: Record<string, unknown>,
        options?: {signal?: AbortSignal}): Promise<unknown>;
    /** Whether the transport sends a synchronous call (`supportsCallSync`). */
    readonly supportsCallSync: boolean;
    /** Return the checked response envelope, including optional initial-main Data. */
    callEnvelope(contentType: 'source' | 'data', name: string, params?: Record<string, unknown>,
        options?: {signal?: AbortSignal | null}): Promise<{
            id: string; contentType: string; value: unknown; data?: import('@genrojs/bag').Bag;
        }>;
    /** Send one envelope synchronously; only with a transport that supports it. */
    callSync(contentType: 'source' | 'data', name: string, params?: Record<string, unknown>): unknown;
}
