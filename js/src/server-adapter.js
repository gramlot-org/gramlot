/* @ts-self-types="./server-adapter.d.ts" */
/**
 * The server-dependent behaviour of one page in the browser.
 *
 * @module
 */
import {HttpTransport} from './http-transport.js';

/**
 * The server-dependent behaviour of one page, consulted by the core and readable as `gramlot.serverAdapter`; it
 * is not a proxy and page authors do not call it. This class realises the HTTP server of GC-230 Part B. A server
 * chooses another adapter, a subclass, by naming its module in the bootstrap (`resources.serverAdapter`, GC-230
 * §010); the module imports this class from `@gramlot/gramlot/page`, which the import map points at the runtime
 * already loaded.
 */
export class ServerAdapter {
    /** The transport of a page whose bootstrap config has `rpcUrl` and `closeUrl`, in `document`: an
     * HttpTransport on those URLs. */
    createTransport({rpcUrl, closeUrl, document}) {
        const window = document.defaultView;
        return new HttpTransport(rpcUrl, {closeUrl, navigator: window.navigator, XMLHttpRequest: window.XMLHttpRequest});
    }
}
