/**
 * The server-dependent behaviour of one page in the browser.
 *
 * @module
 */
import type {DomDocument} from './dom.d.ts';
import type {RpcTransport} from './handlers/rpc-handler.js';

/**
 * The server-dependent behaviour of one page, consulted by the core and readable as `gramlot.serverAdapter`; page
 * authors do not call it. This class selects HTTP or the configured shared WebSocket; a server chooses a subclass by naming its module in
 * the bootstrap (`resources.serverAdapter`).
 */
export class ServerAdapter {
    /** Use the configured shared channel, otherwise HTTP. */
    createTransport(options: {rpcUrl?: string; closeUrl?: string; document: DomDocument;
        channel?: Pick<RpcTransport, 'call'> | null}): RpcTransport;
}
