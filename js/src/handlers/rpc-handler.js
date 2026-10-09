/* @ts-self-types="./rpc-handler.d.ts" */
/**
 * The exchange of one Gramlot page with the server (`gramlot.rpc`).
 *
 * @module
 */
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Handler} from './handler.js';
import {HttpTransport} from '../http-transport.js';

/** A request id: 16 random bytes as 32 hex characters; getRandomValues, unlike randomUUID,
 * exists outside secure contexts too. */
const requestId = () => Array.from(globalThis.crypto.getRandomValues(new Uint8Array(16)),
    byte => byte.toString(16).padStart(2, '0')).join('');

/** An error outcome answered by the server inside the response envelope. */
export class RpcError extends Error {
    name = 'RpcError';
    constructor({code, name, message, details}) {
        super(message);
        this.code = code;
        this.remoteName = name;
        if (details !== undefined) this.details = details;
    }
}

/** The exchange with the server. */
export class RpcHandler extends Handler {
    constructor(gramlot, {rpcUrl, closeUrl, document, transport}) {
        super(gramlot);
        this.transport = transport === false ? null : transport ??
            new HttpTransport(rpcUrl, {closeUrl, navigator: document.defaultView.navigator});
        this.remoteRequests = new Map();
    }
    /** Send one envelope of `contentType` to `name` with `params`; resolves with the value or rejects with an RpcError. */
    async call(contentType, name, params = {}, {signal} = {}) {
        if (!this.transport?.call) throw new Error(`rpc '${name}' is unavailable without a server transport`);
        const id = requestId();
        const text = toTytx({id, pageId: this.gramlot.pageId, contentType, name, params});
        const response = fromTytx(await this.transport.call(text, signal));
        if (response.id !== id) throw new Error('rpc response id mismatch');
        if (response.error) throw new RpcError(response.error);
        return response.value;
    }
}
