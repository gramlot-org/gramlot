/** Main and remote Source transport; application pages do not issue fetch calls. */
export class MainTransport {
    constructor(url, fetcher = globalThis.fetch?.bind(globalThis), sourceUrl = '/gramlot/source',
                closeUrl = '/gramlot/close', navigator = globalThis.navigator) {
        this.url = url;
        this.fetcher = fetcher;
        this.sourceUrl = sourceUrl;
        this.closeUrl = closeUrl;
        this.navigator = navigator;
    }
    async main(pageId, signal) {
        return this.request('main', this.url, {pageId}, signal);
    }
    async source(pageId, method, params, signal) {
        return this.request('source', this.sourceUrl, {pageId, method, params}, signal);
    }
    async request(operation, url, payload, signal) {
        const response = await this.fetcher(url, {
            method: 'POST', credentials: 'same-origin', signal,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`${operation} failed: HTTP ${response.status}`);
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
