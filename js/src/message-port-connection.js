/**
 * The client side of the dataBinder protocol over one MessagePort, registered by name on
 * `gramlot.rpc`. The other end is a store side (`MessagePortStore`) that answers as a `PageStore`.
 *
 * @module
 */
import {Bag} from '@genrojs/bag';
import {fromTytx, toTytx} from '@genrojs/tytx';

/** One message as the TYTX text of a Bag of its fields, as `MessagePortStore.post` sends it. */
export function messageText(message) {
    const wire = new Bag();
    for (const [name, value] of Object.entries(message)) {
        if (value !== undefined) wire.setItem(name, value);
    }
    return toTytx(wire);
}

/** The dataBinder connection of one name: its binders and the MessagePort that carries them now. */
export class MessagePortConnection {
    #port = null;

    constructor(gramlot, name) {
        this.gramlot = gramlot;
        this.name = name;
        this.binders = new Map();
        // `waiting` without a port, `open` with one, `closed` after the other end closed it.
        this.state = 'waiting';
        this.error = null;
    }

    get port() { return this.#port; }

    /**
     * Carry the binders on `port`, or on none for null. The binders leave the previous port and
     * subscribe again on the new one: each snapshot replaces the branch of its binder.
     */
    setPort(port) {
        if (port === this.#port) return;
        this.#release();
        this.#port = port;
        this.error = null;
        this.state = port ? 'open' : 'waiting';
        if (!port) return;
        port.addEventListener('message', this.#receive);
        port.start();
        for (const binder of this.binders.values()) this.#subscribe(binder);
    }

    #release() {
        const port = this.#port;
        if (!port) return;
        port.removeEventListener('message', this.#receive);
        for (const binder of this.binders.values()) {
            // Local writes wait for the snapshot of the next port.
            binder.ready = false;
            if (this.state === 'open') port.postMessage(messageText({op: 'unsubscribe', binderId: binder.id}));
        }
        this.#port = null;
    }

    register(binder) {
        this.binders.set(binder.id, binder);
        if (this.state === 'open') this.#subscribe(binder);
    }

    #subscribe(binder) {
        this.#port.postMessage(messageText({op: 'subscribe', binderId: binder.id, path: binder.serverPath}));
    }

    unregister(binder) {
        if (!this.binders.delete(binder.id)) return;
        if (this.state === 'open') this.#port.postMessage(messageText({op: 'unsubscribe', binderId: binder.id}));
    }

    send(message) {
        if (this.state !== 'open') throw new Error(`Connection '${this.name}' is not open`);
        this.#port.postMessage(messageText(message));
    }

    #receive = event => {
        const message = fromTytx(event.data).asDict();
        if (message.op === 'snapshot' || message.op === 'change') this.binders.get(message.binderId)?.apply(message);
        else if (message.op === 'closed') this.#closed();
        else if (message.op === 'error') {
            this.gramlot.src.binding.reportError(new Error(`Connection '${this.name}': ${message.error}`), 'dataBinder');
        }
    };

    /** The other end closed: the binders stop and their copies keep the last values. */
    #closed() {
        this.state = 'closed';
        this.#release();
        this.error = new Error(`Connection '${this.name}' was closed by the other end`);
    }
}
