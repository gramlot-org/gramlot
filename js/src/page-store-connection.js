import {fromTytx, toTytx} from '@genrojs/tytx';
import {assertTransportData} from './references.js';
import {randomId} from './random-id.js';
import {RpcError} from './handlers/rpc-handler.js';

/** A logical server channel using the common Gramlot family connection. */
export class PageStoreConnection {
    constructor(gramlot, url, document) {
        this.gramlot = gramlot;
        this.window = document.defaultView;
        this.frames = gramlot._frames;
        this.binders = new Map();
        this.calls = new Map();
        // Server page routes through registered direct children, not a window registry.
        this.routes = new Map();
        this.error = null;
        this.closed = false;
        this.ready = false;
        this.socket = null;
        const address = new URL(url, document.baseURI);
        address.protocol = address.protocol === 'https:' ? 'wss:' : 'ws:';
        this.endpoint = address.href;
        this.origin = this.window.location.origin;
        this.parent = this.frames.parent?.window ?? null;
        this.frames.registerChannel('server', {
            changed: peer => this.peerChanged(peer),
            disconnected: peer => {
                if (peer.parent) this.fail(new Error('PageStore parent disconnected'));
                else this.forget(peer.window);
            },
            receive: (peer, message) => {
                try { this.receive(peer, message); }
                catch (error) { this.fail(error); }
            },
        }, {endpoint: this.endpoint, ready: false});
        if (this.parent) return;
        address.searchParams.set('pageId', gramlot.pageId);
        this.socket = new this.window.WebSocket(address.href);
        this.socket.addEventListener('open', () => this.connected());
        this.socket.addEventListener('message', event => {
            try { this.deliver(event.data); }
            catch (error) { this.fail(error); }
        });
        this.socket.addEventListener('error', () => this.fail(new Error('PageStore WebSocket failed')));
        this.socket.addEventListener('close', event => {
            if (!this.closed) this.fail(new Error('PageStore disconnected (' + event.code + ')'));
        });
    }

    peerChanged(peer) {
        if (this.closed || !peer.parent) return;
        const state = peer.channels.server;
        if (peer.origin !== this.origin || state?.endpoint !== this.endpoint) {
            this.fail(new Error('Parent does not provide the same PageStore endpoint'));
        } else if (state.ready) this.connected();
        else if (this.ready) this.fail(new Error('PageStore parent channel closed'));
    }

    connected() {
        if (this.closed || this.ready) return;
        this.ready = true;
        if (this.parent) this.upstream({op: 'attach', pageId: this.gramlot.pageId});
        for (const binder of this.binders.values()) this.subscribe(binder);
        for (const call of this.calls.values()) this.sendCall(call);
        this.frames.setChannelState('server', {endpoint: this.endpoint, ready: true});
    }

    receive(peer, payload) {
        if (this.closed || peer.origin !== this.origin || peer.channels.server?.endpoint !== this.endpoint) return;
        if (peer.parent) {
            this.deliver(toTytx(payload));
            return;
        }
        if (!this.ready) return;
        const pageId = payload?.pageId;
        if (typeof pageId !== 'string' || !pageId || pageId === this.gramlot.pageId) return;
        if (payload.op === 'attach') {
            if (this.routes.has(pageId)) return;
            this.routes.set(pageId, peer.window);
        } else if (this.routes.get(pageId) !== peer.window) return;
        if (payload.op === 'detach') this.routes.delete(pageId);
        this.upstream(payload);
    }

    forget(window) {
        for (const [pageId, route] of this.routes) {
            if (route !== window) continue;
            this.routes.delete(pageId);
            if (this.ready && !this.closed) this.upstream({op: 'detach', pageId});
        }
    }

    upstream(message) {
        if (this.closed || !this.ready) throw new Error('PageStore is not connected');
        if (this.parent) this.frames.send(this.parent, 'server', message);
        else this.socket.send(toTytx(message));
    }

    deliver(wire) {
        if (this.closed) return;
        const message = fromTytx(wire);
        if (message.pageId === this.gramlot.pageId) {
            if (message.op === 'closed') {
                this.fail(new Error('PageStore page closed on the server'));
                return;
            }
            if (!Object.hasOwn(message, 'op') && Object.hasOwn(message, 'id')) {
                this.calls.get(message.id)?.finish(null, wire);
                return;
            }
            if (message.op === 'publish') {
                try { this.gramlot._subscriptions.publish(message.topic, message.payload, message.metadata); }
                catch (error) { this.window.console.error('PageStore publication subscriber failed', error); }
                return;
            }
            const binder = this.binders.get(message.binderId);
            if (binder) binder.apply(message);
        } else {
            const window = this.routes.get(message.pageId);
            if (window) this.frames.send(window, 'server', message);
        }
    }

    register(binder) {
        if (this.closed) throw new Error('PageStore connection is closed');
        this.binders.set(binder.id, binder);
        if (this.ready) this.subscribe(binder);
    }

    subscribe(binder) {
        this.send({op: 'subscribe', binderId: binder.id, path: binder.serverPath});
    }

    unregister(binder) {
        if (!this.binders.delete(binder.id)) return;
        if (!this.closed && this.ready) this.send({op: 'unsubscribe', binderId: binder.id});
    }

    send(message) {
        this.upstream({...message, pageId: this.gramlot.pageId});
    }

    /** Capture before local subscribers run; events are never queued or replayed. */
    preparePublish(descriptor, payload) {
        if (this.closed || !this.ready) throw new Error('PageStore is not connected');
        assertTransportData(payload);
        const message = {op: 'publish', id: randomId(), pageId: this.gramlot.pageId, topic: descriptor.topic, payload};
        if (descriptor.pageId !== undefined) message.targetPageId = descriptor.pageId;
        const wire = toTytx(message);
        return async () => {
            const response = fromTytx(await this.call(wire));
            if (response.error) throw new RpcError(response.error);
            return response.value;
        };
    }

    /** Queue until attached, then pair responses by id independently of binder changes. */
    call(text, signal) {
        if (this.closed) return Promise.reject(this.error ?? new Error('PageStore connection is closed'));
        if (signal?.aborted) return Promise.reject(signal.reason);
        const message = fromTytx(text);
        if (message.pageId !== this.gramlot.pageId || typeof message.id !== 'string'
            || !message.id || (Object.hasOwn(message, 'op') && message.op !== 'publish') || this.calls.has(message.id)) {
            return Promise.reject(new Error('Invalid or duplicate RPC identity'));
        }
        return new Promise((resolve, reject) => {
            const call = {message, sent: false, finish: (error, wire) => {
                if (!this.calls.delete(message.id)) return;
                signal?.removeEventListener('abort', abort);
                if (wire === undefined) reject(error);
                else resolve(wire);
            }};
            const abort = () => {
                call.finish(signal.reason);
                if (call.sent && this.ready && !this.closed) {
                    try { this.send({op: 'cancel', id: message.id}); }
                    catch (error) { this.fail(error); }
                }
            };
            this.calls.set(message.id, call);
            signal?.addEventListener('abort', abort, {once: true});
            if (this.ready) this.sendCall(call);
        });
    }

    sendCall(call) {
        try {
            this.upstream(call.message);
            call.sent = true;
        } catch (error) {
            call.finish(error);
            this.fail(error);
        }
    }

    fail(error) {
        this.error = error;
        this.close();
        this.window.console.error('PageStore channel failed', error);
    }

    close() {
        if (this.closed) return;
        this.closed = true;
        if (this.parent && this.ready && this.frames.isConnected(this.parent)) {
            for (const pageId of [...this.routes.keys(), this.gramlot.pageId]) {
                this.frames.send(this.parent, 'server', {op: 'detach', pageId});
            }
        }
        this.ready = false;
        for (const call of this.calls.values()) {
            call.finish(this.error ?? new Error('PageStore connection is closed'));
        }
        this.binders.clear();
        this.routes.clear();
        this.frames.unregisterChannel('server');
        this.socket?.close();
    }
}

