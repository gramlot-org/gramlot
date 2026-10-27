/* @ts-self-types="./websocket-transport.d.ts" */
/** RPC over the page's existing logical channel; Gramlot owns its socket lifecycle. */
export class WebSocketTransport {
    constructor(channel, closeTransport) {
        this.channel = channel;
        this.closeTransport = closeTransport;
    }
    get supportsCallSync() { return false; }
    call(text, signal) { return this.channel.call(text, signal); }
    // Also release a bootstrapped page whose channel never attached.
    close(pageId, options) { this.closeTransport.close(pageId, options); }
    dispose() { this.closeTransport.dispose(); }
}
