/* @ts-self-types="./server-adapter.d.ts" */
/**
 * The server-dependent behaviour of one page in the browser.
 *
 * @module
 */
import {HttpTransport} from './http-transport.js';
import {WebSocketTransport} from './websocket-transport.js';

/**
 * The server-dependent behaviour of one page, consulted by the core and readable as `gramlot.serverAdapter`; it
 * is not a proxy and page authors do not call it. This class selects HTTP or the configured shared WebSocket. A server
 * chooses another adapter, a subclass, by naming its module in the bootstrap (`resources.serverAdapter`, GC-230
 * §010); the module imports this class from `@gramlot/gramlot/page`, which the import map points at the runtime
 * already loaded.
 */
export class ServerAdapter {
    /** Use the shared WebSocket channel when configured; otherwise use HTTP. */
    createTransport({rpcUrl, closeUrl, document, channel = null}) {
        const window = document.defaultView;
        const http = new HttpTransport(rpcUrl, {closeUrl, navigator: window.navigator, XMLHttpRequest: window.XMLHttpRequest});
        return channel === null ? http : new WebSocketTransport(channel, http);
    }
}
