/* @ts-self-types="./rpc-handler.d.ts" */
/**
 * The exchange of one Gramlot page with the host (`gramlot.rpc`).
 *
 * @module
 */
import {Handler} from './handler.js';
import {MainTransport} from '../transport.js';

/** The exchange with the host. */
export class RpcHandler extends Handler {
    constructor(gramlot, {mainUrl, sourceUrl, closeUrl, document, transport}) {
        super(gramlot);
        this.transport = transport === false ? null : transport ??
            new MainTransport(mainUrl, undefined, sourceUrl, closeUrl, document.defaultView.navigator);
        this.remoteRequests = new Map();
    }
}
