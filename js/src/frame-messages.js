import {toTytx, fromTytx} from '@genrojs/tytx';
import {SourceBagNode, sourceTarget} from '@genrojs/builders';
import {assertTransportData} from './references.js';
import {randomId} from './random-id.js';

const TYPE = 'gramlot:message';

/** One Gramlot family registry and protocol for publications and server traffic. */
export class FrameMessages {
    #app; #window; #document;
    #session = randomId();
    #peers = new Map();
    #channels = new Map();
    #closed = false;
    #listener; #load; #hide; #show; #watch;

    constructor(app, document) {
        this.#app = app;
        this.#document = document;
        this.#window = document.defaultView;
        this.#listener = event => this.#receive(event);
        this.#load = event => {
            if (event.target?.localName !== 'iframe') return;
            const peer = this.#child(event.target);
            if (peer) this.#hello(peer);
        };
        this.#hide = event => { if (!event.persisted) this.#app.dispose({beacon: true}); };
        this.#show = () => this.ready();
        this.#window.addEventListener('message', this.#listener);
        this.#window.addEventListener('pagehide', this.#hide);
        this.#window.addEventListener('pageshow', this.#show);
        document.addEventListener('load', this.#load, true);
    }

    #watchFamily() {
        if (this.#watch !== undefined) return;
        // Unload messages can be lost when a browser destroys a browsing context.
        this.#watch = this.#window.setInterval(() => {
            if (this.parent?.window.closed) { this.#shutdown(); return; }
            for (const peer of this.children) {
                if (peer.window.closed) this.#forget(peer.window);
                else if (peer.node && !this.#child(this.#app.dom.getDomNode(peer.node))) {
                    this.#forget(peer.window, true);
                }
            }
        }, 500);
    }

    get parent() {
        const iframe = this.#window.parent !== this.#window;
        const window = iframe ? this.#window.parent : this.#window.opener;
        return window ? {window, parent: true, kind: iframe ? 'iframe' : 'popup',
            origin: this.#origin(this.#document.referrer || this.#document.baseURI)} : null;
    }
    /** Internal snapshot of direct Gramlot children, excluding unrelated windows. */
    get children() { return [...this.#peers.values()].filter(peer => !peer.parent); }
    isConnected(window) { return !this.#closed && this.#peers.has(window); }

    connect() {
        if (this.parent) { this.#watchFamily(); this.#hello(this.parent); }
        for (const frame of this.#document.getElementsByTagName('iframe')) {
            const child = this.#child(frame);
            if (child) this.#hello(child);
        }
    }
    ready() {
        if (this.#closed) return;
        this.connect();
        for (const peer of this.#peers.values()) this.#announce(peer);
    }

    registerChannel(name, handler, state) {
        if (this.#closed || name === 'publish' || this.#channels.has(name)) throw new Error('Invalid family channel');
        this.#channels.set(name, {handler, state});
        for (const peer of this.#peers.values()) handler.changed(peer);
    }
    setChannelState(name, state) {
        this.#channels.get(name).state = state;
        for (const peer of this.#peers.values()) this.#announce(peer);
    }
    unregisterChannel(name) {
        this.#channels.delete(name);
        // Disposal sends a family close next; do not announce transient channel loss.
        if (this.#app.state === 'disposed') return;
        for (const peer of this.#peers.values()) this.#announce(peer);
    }
    /** Every consumer sends data through this typed envelope. */
    send(window, channel, payload) {
        const peer = this.#peers.get(window);
        if (this.#closed || !peer) throw new Error('Destination page is not connected');
        assertTransportData(payload);
        this.#send(peer, {kind: 'message', recipient: peer.session, channel, wire: toTytx(payload)});
    }

    /** Preflight before local dispatch; publications require a started destination. */
    prepare(descriptor, payload) {
        const peers = [];
        if (descriptor.parent) {
            if (!this.parent) throw new Error('This page has no parent frame or opener');
            peers.push(this.parent);
        }
        if (descriptor.iframe !== undefined) {
            const target = descriptor.iframe;
            const node = sourceTarget(target);
            const frame = typeof target === 'string'
                ? this.#document.getElementById(target)
                : node instanceof SourceBagNode ? this.#app.dom.getDomNode(node) : null;
            const child = this.#child(frame);
            if (!child) throw new Error('iframe destination must be an active Gramlot iframe ID or Source reference');
            peers.push(child);
        }
        if (descriptor.pageId !== undefined) {
            const child = this.children.find(peer => peer.pageId === descriptor.pageId);
            if (!child) throw new Error('pageId destination must be a registered direct Gramlot child');
            peers.push(child);
        }
        const destinations = peers.map(peer => {
            const connection = this.#peers.get(peer.window);
            if (!connection?.ready || connection.origin !== peer.origin) throw new Error('Destination page is not ready');
            return {...peer, session: connection.session};
        });
        assertTransportData(payload);
        const wire = toTytx({topic: descriptor.topic, payload});
        return () => {
            if (this.#closed) return;
            for (const peer of destinations) {
                const current = this.#peer(peer.window);
                if (!current || current.origin !== peer.origin || this.#peers.get(peer.window)?.session !== peer.session) {
                    throw new Error('Destination page disconnected before publication');
                }
                this.#send(peer, {kind: 'message', recipient: peer.session, channel: 'publish', wire});
            }
        };
    }

    dispose() {
        if (this.#closed) return;
        // Let consumers detach routes while the parent link still exists.
        for (const peer of this.children) this.#forget(peer.window, true);
        const parent = this.parent;
        if (parent && this.#peers.has(parent.window)) {
            this.#send(this.#peers.get(parent.window), {kind: 'close'});
            this.#forget(parent.window);
        }
        this.#closed = true;
        this.#channels.clear();
        this.#window.removeEventListener('message', this.#listener);
        this.#window.removeEventListener('pagehide', this.#hide);
        this.#window.removeEventListener('pageshow', this.#show);
        this.#window.clearInterval(this.#watch);
        this.#document.removeEventListener('load', this.#load, true);
    }
    #shutdown() {
        this.#app.dispose({beacon: true});
        if (this.#window.parent === this.#window && this.#window.opener) this.#window.close();
    }
    #forget(window, terminate = false) {
        const peer = this.#peers.get(window);
        if (!peer) return;
        if (terminate) this.#send(peer, {kind: 'close'});
        this.#peers.delete(window);
        peer.release?.();
        for (const {handler} of this.#channels.values()) handler.disconnected(peer);
        if (terminate && peer.kind === 'popup' && !peer.parent) window.close();
    }
    #remember(peer, message) {
        const old = this.#peers.get(peer.window);
        const fresh = old?.session !== message.session;
        if (fresh) this.#forget(peer.window);
        const connection = fresh ? {...peer, session: message.session} : old;
        Object.assign(connection, {ready: message.ready === true, pageId: message.pageId, channels: message.channels});
        this.#peers.set(peer.window, connection);
        this.#watchFamily();
        if (fresh && peer.node) connection.release = this.#app.src.binding.bindingFor(peer.node).track(() => {
            this.#forget(peer.window, true);
        });
        for (const {handler} of this.#channels.values()) handler.changed(connection);
        return fresh;
    }
    #receive(event) {
        if (this.#closed || event.data?.type !== TYPE) return;
        const peer = this.#peer(event.source);
        if (!peer || event.origin !== peer.origin) return;
        const message = event.data;
        if (typeof message.session !== 'string' || !message.session) return;
        if (message.kind === 'hello' || message.kind === 'ready') {
            if (message.kind === 'ready' && message.recipient !== this.#session) return;
            if (!message.channels || typeof message.channels !== 'object' || Array.isArray(message.channels)) return;
            const fresh = this.#remember(peer, message);
            if (message.kind === 'hello' || fresh) this.#announce(this.#peers.get(peer.window));
            return;
        }
        const connection = this.#peers.get(peer.window);
        if (!connection || connection.session !== message.session || message.recipient !== this.#session) return;
        if (message.kind === 'close') {
            if (peer.parent) this.#shutdown();
            else this.#forget(peer.window);
        } else if (message.kind === 'message' && typeof message.wire === 'string') {
            const payload = fromTytx(message.wire);
            if (message.channel === 'publish') {
                if (this.#app.state !== 'started' || !connection.ready) return;
                if (typeof payload.topic !== 'string' || !payload.topic) return;
                this.#app.publish(payload.topic, payload.payload);
            } else this.#channels.get(message.channel)?.handler.receive(connection, payload);
        }
    }
    #state() {
        return {pageId: this.#app.pageId, ready: this.#app.state === 'started',
            channels: Object.fromEntries([...this.#channels].map(([name, channel]) => [name, channel.state]))};
    }
    #hello(peer) { this.#send(peer, {kind: 'hello', ...this.#state()}); }
    #announce(peer) { this.#send(peer, {kind: 'ready', recipient: peer.session, ...this.#state()}); }
    #send(peer, message) {
        peer.window.postMessage({type: TYPE, session: this.#session, recipient: peer.session, ...message},
            peer.origin === 'null' ? '*' : peer.origin);
    }
    #child(frame) {
        if (frame?.localName !== 'iframe' || !frame.isConnected || !frame.contentWindow) return null;
        const node = this.#app.dom.getBaseSourceNode(frame);
        if (!node || !this.#app.src.binding.bindingFor(node) || this.#app.dom.getDomNode(node) !== frame) return null;
        const sandbox = frame.getAttribute('sandbox');
        const opaque = sandbox !== null && !sandbox.split(/\s+/).includes('allow-same-origin');
        const origin = opaque ? 'null' : this.#origin(frame.hasAttribute('srcdoc')
            ? this.#document.baseURI : frame.getAttribute('src') || this.#document.baseURI);
        return {window: frame.contentWindow, origin, node, parent: false, kind: 'iframe'};
    }
    #origin(address) {
        const url = new URL(address, this.#document.baseURI);
        return url.protocol === 'file:' ? 'null' : url.origin;
    }
    #peer(window) {
        const parent = this.parent;
        if (parent?.window === window) return parent;
        for (const frame of this.#document.getElementsByTagName('iframe')) {
            const child = this.#child(frame);
            if (child?.window === window) return child;
        }
        // Only an actual same-origin opener relationship can enroll a popup.
        try {
            if (window && window !== this.#window && window.opener === this.#window
                && window.location.origin === this.#window.location.origin) {
                return {window, origin: this.#origin(this.#document.baseURI), parent: false, kind: 'popup'};
            }
        } catch { /* Cross-origin windows cannot enroll as popups. */ }
        return null;
    }
}
