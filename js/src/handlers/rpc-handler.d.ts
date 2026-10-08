/**
 * The exchange of one Gramlot page with the server (`gramlot.rpc`).
 *
 * @module
 */
import type {SourceBagNode} from '@genrojs/builders';
import type {DomDocument} from '../dom.d.ts';
import type {Gramlot} from '../gramlot.js';
import type {MainTransport} from '../transport.js';
import {Handler} from './handler.js';

/** The exchange with the server. */
export class RpcHandler extends Handler {
    /** The server transport, or null. */
    transport: MainTransport | null;
    /** The remote Source requests in progress, by target node. */
    remoteRequests: Map<SourceBagNode, {controller: AbortController}>;
    /** Create the transport of `gramlot`: the given one, none for `false`, else a `MainTransport` on the URLs. */
    constructor(gramlot: Gramlot, options: {mainUrl: string; sourceUrl: string; closeUrl: string; document: DomDocument;
        transport?: MainTransport | false | null});
}
