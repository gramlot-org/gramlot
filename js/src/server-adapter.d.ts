/**
 * The server-dependent behaviour of one page in the browser.
 *
 * @module
 */
import type {DomDocument} from './dom.d.ts';
import type {RpcTransport} from './handlers/rpc-handler.js';

/**
 * The server-dependent behaviour of one page, consulted by the core and readable as `gramlot.serverAdapter`; page
 * authors do not call it. This class realises the HTTP server; a server chooses a subclass by naming its module in
 * the bootstrap (`resources.serverAdapter`).
 */
export class ServerAdapter {
    /** The transport of a page whose bootstrap config has `rpcUrl` and `closeUrl`: an `HttpTransport` on those URLs. */
    createTransport(options: {rpcUrl?: string; closeUrl?: string; document: DomDocument}): RpcTransport;
}
