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
     * Send the close message `{pageId}` without waiting for the answer: a beacon on page hide, else a
     * `keepalive` POST. A failed delivery leaves the page to the server TTL; local disposal does not wait.
     */
    close(pageId, {beacon = false} = {}) {
        const body = JSON.stringify({pageId});
        try {
            if (beacon) {
                this.navigator.sendBeacon(this.closeUrl, new Blob([body], {type: 'application/json'}));
            } else {
                this.fetcher(this.closeUrl, {
                    method: 'POST', credentials: 'same-origin', keepalive: true,
                    headers: {'Content-Type': 'application/json'}, body,
                }).catch(() => { /* Best-effort delivery: the server TTL owns failed cleanup. */ });
            }
        } catch { /* Local disposal must also complete when delivery throws synchronously. */ }
    }
    /** Release the transport at the dispose of the page: HTTP holds no connection, so nothing is released. The
     * calls in flight are aborted by the page (`RpcHandler.call`). */
    dispose() {}
}
