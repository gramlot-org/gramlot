/**
 * The exchange of one Gramlot page with the server (`gramlot.rpc`).
 *
 * @module
 */
import type {SourceBagNode} from '@genrojs/builders';
import type {DomDocument} from '../dom.d.ts';
import type {Gramlot} from '../gramlot.js';
import type {HttpTransport} from '../http-transport.js';
import {Handler} from './handler.js';

/** The transport contract of `RpcHandler`: one envelope text in, one envelope text out. */
export interface RpcTransport {
    /** Send the request envelope text; resolves with the response envelope text. */
    call(text: string, signal?: AbortSignal): Promise<string>;
    /** Ask the server to close the page. */
    close?(pageId: string, options?: {beacon?: boolean}): void;
    /** Release the transport on dispose. */
    dispose?(): void;
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
    /** The remote Source requests in progress, by target node. */
    remoteRequests: Map<SourceBagNode, {controller: AbortController}>;
    /** Create the transport of `gramlot`: the given one, none for `false`, else an `HttpTransport` on the URLs. */
    constructor(gramlot: Gramlot, options: {rpcUrl: string; closeUrl: string; document: DomDocument;
        transport?: RpcTransport | HttpTransport | false | null});
    /** Send one envelope of `contentType` to `name` with `params`; resolves with the value or rejects with an `RpcError`. */
    call(contentType: 'source' | 'data', name: string, params?: Record<string, unknown>,
        options?: {signal?: AbortSignal}): Promise<unknown>;
}
