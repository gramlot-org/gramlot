import {toTytx, fromTytx} from '@genrojs/tytx';
import {SourceBagNode, sourceTarget} from '@genrojs/builders';
import {assertTransportData} from './references.js';
import {randomId} from './random-id.js';

const TYPE = 'gramlot:publish';

/** Direct parent/child transport. Every message crosses postMessage, even same-origin. */
export class FrameMessages {
    #app;
    #window;
    #document;
    #session = randomId();
    #peers = new Map();
    #closed = false;
    #listener;
    #load;
    #hide;
    #show;

    constructor(app, document) {
        this.#app = app;
        this.#document = document;
        this.#window = document.defaultView;
        this.#listener = event => this.#receive(event);
        this.#load = event => {
            if (event.target?.localName !== 'iframe') return;
            const peer = this.#child(event.target);
            if (!peer) return;
            this.#forget(peer.window);
            this.#send(peer, {kind: 'hello'});
        };
        this.#window.addEventListener('message', this.#listener);
        this.#hide = () => this.#disconnect();
        this.#show = () => this.ready();
        this.#window.addEventListener('pagehide', this.#hide);
        this.#window.addEventListener('pageshow', this.#show);
        document.addEventListener('load', this.#load, true);
        const parent = this.#parent();
        if (parent) this.#send(parent, {kind: 'hello'});
    }

    ready() {
        if (this.#closed || this.#app.state !== 'started') return;
        const parent = this.#parent();
        if (parent) this.#send(parent, {kind: 'ready'});
        for (const frame of this.#document.getElementsByTagName('iframe')) {
            const child = this.#child(frame);
            if (child) this.#send(child, {kind: 'hello'});
        }
    }

    /** Preflight before local dispatch: no queue or silent fallback for an unavailable page. */
    prepare(descriptor, payload) {
        const peers = [];
        if (descriptor.parent) {
            const parent = this.#parent();
            if (!parent) throw new Error('This page has no parent frame');
            peers.push(parent);
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
        const destinations = peers.map(peer => {
            const connection = this.#peers.get(peer.window);
            if (!connection || connection.origin !== peer.origin) throw new Error('Destination page is not ready');
            return {...peer, session: connection.session};
        });
        assertTransportData(payload);
        const wire = toTytx(payload);
        return () => {
            if (this.#closed) return;
            for (const peer of destinations) {
                const current = this.#peer(peer.window);
                if (!current || current.origin !== peer.origin || this.#peers.get(peer.window)?.session !== peer.session) {
                    throw new Error('Destination page disconnected before publication');
                }
                this.#send(peer, {kind: 'publish', recipient: peer.session, topic: descriptor.topic, wire});
            }
        };
    }

    dispose() {
        if (this.#closed) return;
        this.#disconnect();
        this.#closed = true;
        this.#window.removeEventListener('message', this.#listener);
        this.#window.removeEventListener('pagehide', this.#hide);
        this.#window.removeEventListener('pageshow', this.#show);
        this.#document.removeEventListener('load', this.#load, true);
    }

    #disconnect() {
        for (const [window, peer] of this.#peers) this.#send({window, origin: peer.origin}, {kind: 'close'});
        for (const window of this.#peers.keys()) this.#forget(window);
    }

    #forget(window) {
        this.#peers.get(window)?.release?.();
        this.#peers.delete(window);
    }

    #remember(peer, session) {
        this.#forget(peer.window);
        const connection = {session, origin: peer.origin};
        if (peer.node) connection.release = this.#app.src.binding.bindingFor(peer.node).track(() => {
            this.#send(peer, {kind: 'close'});
            this.#forget(peer.window);
        });
        this.#peers.set(peer.window, connection);
    }

    #receive(event) {
        if (this.#closed || event.data?.type !== TYPE) return;
        const peer = this.#peer(event.source);
        if (!peer || event.origin !== peer.origin) return;
        const message = event.data;
        if (typeof message.session !== 'string' || !message.session) return;
        if (message.kind === 'hello') {
            this.#forget(peer.window);
            if (message.ready === true) this.#remember(peer, message.session);
            if (this.#app.state === 'started') this.#send(peer, {kind: 'ready'});
        } else if (message.kind === 'ready') {
            const changed = this.#peers.get(peer.window)?.session !== message.session;
            this.#remember(peer, message.session);
            if (changed && this.#app.state === 'started') this.#send(peer, {kind: 'ready'});
        } else if (message.kind === 'close') {
            if (this.#peers.get(peer.window)?.session === message.session) this.#forget(peer.window);
        } else if (message.kind === 'publish') {
            if (this.#app.state !== 'started' || message.recipient !== this.#session
                || this.#peers.get(peer.window)?.session !== message.session) return;
            if (typeof message.topic !== 'string' || !message.topic || typeof message.wire !== 'string') return;
            // Dispatch only in this receiving page; never retransmit the routing descriptor.
            this.#app.publish(message.topic, fromTytx(message.wire));
        }
    }

    #send(peer, message) {
        peer.window.postMessage({type: TYPE, session: this.#session, ready: this.#app.state === 'started', ...message}, peer.origin === 'null' ? '*' : peer.origin);
    }
    #parent() {
        const parent = this.#window.parent;
        if (parent === this.#window) return null;
        return {window: parent, origin: this.#origin(this.#document.referrer || this.#document.baseURI)};
    }
    #child(frame) {
        if (frame?.localName !== 'iframe' || !frame.isConnected || !frame.contentWindow) return null;
        const node = this.#app.dom.getBaseSourceNode(frame);
        if (!node || !this.#app.src.binding.bindingFor(node)
            || this.#app.dom.getDomNode(node) !== frame) return null;
        const sandbox = frame.getAttribute('sandbox');
        const opaque = sandbox !== null && !sandbox.split(/\s+/).includes('allow-same-origin');
        const origin = opaque ? 'null' : this.#origin(frame.hasAttribute('srcdoc')
            ? this.#document.baseURI : frame.getAttribute('src') || this.#document.baseURI);
        return {window: frame.contentWindow, origin, node};
    }
    #origin(address) {
        const url = new URL(address, this.#document.baseURI);
        // Chromium's URL.origin can be file://, while MessageEvent.origin is null.
        return url.protocol === 'file:' ? 'null' : url.origin;
    }
    #peer(window) {
        const parent = this.#parent();
        if (parent?.window === window) return parent;
        for (const frame of this.#document.getElementsByTagName('iframe')) {
            const child = this.#child(frame);
            if (child?.window === window) return child;
        }
        return null;
    }
}
