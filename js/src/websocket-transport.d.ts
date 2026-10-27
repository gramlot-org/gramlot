import type {RpcTransport} from './handlers/rpc-handler.js';

/** Asynchronous RPC on an existing page channel; never opens another socket. */
export class WebSocketTransport {
    constructor(channel: Pick<RpcTransport, 'call'>, closeTransport: Pick<RpcTransport, 'close' | 'dispose'>);
    readonly supportsCallSync: false;
    call(text: string, signal?: AbortSignal): Promise<string>;
    close(pageId: string, options?: {beacon?: boolean}): void;
    dispose(): void;
}
