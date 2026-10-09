/* @ts-self-types="./http-transport.d.ts" */
/**
 * The HTTP realisation of the Gramlot envelope; application pages do not issue fetch calls.
 *
 * @module
 */
/** The page-to-server transport over HTTP: sends the envelope to the rpc URL and closes the server page. */
export class HttpTransport {
    constructor(rpcUrl, {fetcher = globalThis.fetch?.bind(globalThis), closeUrl = '/gramlot/close',
                         navigator = globalThis.navigator} = {}) {
        this.rpcUrl = rpcUrl;
        this.fetcher = fetcher;
        this.closeUrl = closeUrl;
        this.navigator = navigator;
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
    close(pageId, {beacon = false} = {}) {
        const body = JSON.stringify({pageId});
        if (beacon) {
            try {
                this.navigator.sendBeacon(this.closeUrl, new Blob([body], {type: 'application/json'}));
            } catch { /* TTL handles delivery failure. */ }
        } else {
            // Server cleanup is best effort; local disposal must complete offline.
            try {
                Promise.resolve(this.fetcher(this.closeUrl, {
                    method: 'POST', credentials: 'same-origin', keepalive: true,
                    headers: {'Content-Type': 'application/json'}, body,
                })).catch(() => {});
            } catch { /* TTL handles delivery failure. */ }
        }
    }
}
