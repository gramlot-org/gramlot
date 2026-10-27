/* @ts-self-types="./rpc-handler.d.ts" */
/**
 * The exchange of one Gramlot page with the server (`gramlot.rpc`).
 *
 * @module
 */
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Handler} from './handler.js';
import {assertTransportData} from '../references.js';
import {randomId} from '../random-id.js';

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
        // The transport given in the options of the page, none for `false`, else the one of the server adapter.
        this.transport = transport === false ? null : transport ??
            gramlot.serverAdapter.createTransport({rpcUrl, closeUrl, document, channel: gramlot._pageStore});
        // The AbortController of each call in flight, by envelope id; written only by `call`.
        this.remoteRequests = new Map();
    }
    /**
     * Send one envelope of `contentType` to `name` with `params`; resolves with the value or rejects with an
     * RpcError. The one cancellation of every call of the page: `signal` and the dispose of the page
     * (`gramlot.abort`) abort the call, which then rejects at once with the abort reason, also when the
     * transport does not stop on the signal it receives; a call aborted before it starts is not sent.
     */
    /** Whether the transport sends a synchronous call: its `supportsCallSync` is true. A transport that does not
     * declare it, or a page without transport, has none. */
    get supportsCallSync() {
        return this.transport?.supportsCallSync === true;
    }

    /**
     * Send one envelope of `contentType` to `name` with `params` and wait for the answer, blocking the page, as
     * the legacy `genro.serverCall` without callback; returns the value or throws an RpcError. Only a transport
     * with `supportsCallSync` sends it (HTTP, with a synchronous XMLHttpRequest, deprecated by the browsers);
     * any other throws. A disposed page throws the abort reason.
     */
    callSync(contentType, name, params = {}) {
        if (!this.supportsCallSync) throw new Error(`rpc '${name}': the transport of this page has no synchronous call`);
        assertTransportData(params);
        if (this.gramlot.abort.signal.aborted) throw this.gramlot.abort.signal.reason;
        const id = randomId();
        const response = fromTytx(this.transport.callSync(toTytx({id, pageId: this.gramlot.pageId, contentType, name, params})));
        if (response.id !== id) throw new Error('rpc response id mismatch');
        if (response.error) throw new RpcError(response.error);
        return response.value;
    }

    async call(contentType, name, params = {}, {signal = null} = {}) {
        if (!this.transport?.call) throw new Error(`rpc '${name}' is unavailable without a server transport`);
        assertTransportData(params);
        const id = randomId();
        const text = toTytx({id, pageId: this.gramlot.pageId, contentType, name, params});
        const sources = signal ? [this.gramlot.abort.signal, signal] : [this.gramlot.abort.signal];
        const before = sources.find(source => source.aborted);
        if (before) throw before.reason;
        const controller = new AbortController();
        const forward = event => controller.abort(event.target.reason);
        for (const source of sources) source.addEventListener('abort', forward, {once: true});
        // An aborted call leaves remoteRequests at once and rejects without waiting for the transport.
        const aborted = new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () => {
                this.remoteRequests.delete(id);
                reject(controller.signal.reason);
            }, {once: true});
        });
        this.remoteRequests.set(id, controller);
        try {
            const response = fromTytx(await Promise.race([this.transport.call(text, controller.signal), aborted]));
            if (response.id !== id) throw new Error('rpc response id mismatch');
            if (response.error) throw new RpcError(response.error);
            return response.value;
        } finally {
            this.remoteRequests.delete(id);
            for (const source of sources) source.removeEventListener('abort', forward);
        }
    }
}
