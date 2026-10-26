/* @ts-self-types="./http-transport.d.ts" */
/**
 * The HTTP realisation of the Gramlot envelope; application pages do not issue fetch calls.
 *
 * @module
 */
/** The page-to-server transport over HTTP: sends the envelope to the rpc URL and closes the server page. */
export class HttpTransport {
    constructor(rpcUrl, {fetcher = globalThis.fetch?.bind(globalThis), closeUrl = '/gramlot/close',
                         navigator = globalThis.navigator, XMLHttpRequest = globalThis.XMLHttpRequest} = {}) {
        this.rpcUrl = rpcUrl;
        this.fetcher = fetcher;
        this.closeUrl = closeUrl;
        this.navigator = navigator;
        this.XMLHttpRequest = XMLHttpRequest;
    }
    /** HTTP sends a synchronous call (`callSync`) with a synchronous XMLHttpRequest. */
    get supportsCallSync() {
        return true;
    }
    async call(text, signal) {
        const response = await this.fetcher(this.rpcUrl, {
            method: 'POST', credentials: 'same-origin', signal,
            headers: {'Content-Type': 'application/json'},
            body: text,
        });
        if (response.status !== 200) throw new Error(`rpc failed: HTTP ${response.status}`);
        return response.text();
    }
    /**
     * POST the request envelope text with a synchronous XMLHttpRequest and return the response envelope text;
     * a non-200 status throws. Browsers deprecate the synchronous request on the main thread: the page is
     * blocked until the answer arrives.
     */
    callSync(text) {
        const request = new this.XMLHttpRequest();
        request.open('POST', this.rpcUrl, false);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(text);
        if (request.status !== 200) throw new Error(`rpc failed: HTTP ${request.status}`);
        return request.responseText;
    }
    /**
     * Queue `{pageId}` as a JSON beacon for every close. A refused or undelivered
     * beacon leaves cleanup to the server TTL; configuration errors remain visible.
     */
    close(pageId) {
        if (typeof this.closeUrl !== 'string' || !this.closeUrl.trim()) {
            throw new TypeError('HttpTransport.closeUrl must be nonempty text');
        }
        if (typeof this.navigator?.sendBeacon !== 'function') {
            throw new TypeError('HttpTransport requires navigator.sendBeacon');
        }
        const body = new Blob([JSON.stringify({pageId})], {type: 'application/json'});
        try {
            this.navigator.sendBeacon(this.closeUrl, body);
        } catch (error) {
            // Native beacon rejects malformed/unsupported URLs with TypeError,
            // including errors originating in the page's separate browser realm.
            if (error.name === 'TypeError') throw error;
            // Delivery failure must not prevent local disposal; the server TTL remains.
        }
    }
    /** Release the transport at the dispose of the page: HTTP holds no connection, so nothing is released. The
     * calls in flight are aborted by the page (`RpcHandler.call`). */
    dispose() {}
}
