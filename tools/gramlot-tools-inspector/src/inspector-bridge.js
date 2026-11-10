/** Explicit page/panel bridge. No frame discovery or extension API. */
import {Bag, fromTytx, toTytx} from '@gramlot/gramlot';
export {attachInspectorAgent} from './inspector-agent.js';

/** One message as the TYTX text of a Bag of its fields, as the agent's store side sends them. */
function messageText(message) {
    const wire = new Bag();
    for (const [name, value] of Object.entries(message)) wire.setItem(name, value);
    return toTytx(wire);
}

/**
 * The panel side of one inspected page: commands with their replies and the inspector state.
 * The Data and Source copies are not held here: the panel's dataBinders receive them on the same
 * port, through the connection registered on its `gramlot.rpc`.
 */
export class InspectorConnection {
    state = 'connecting';
    error = '';
    breakpoints = [];
    styles = null;
    history = {undo: '', redo: ''};
    #listeners = new Set();
    #pending = new Map();
    #next = 0;
    #port;
    constructor(port) {
        this.#port = port;
        port.addEventListener('message', this.#receive);
        port.start();
    }
    /** The port of the inspected page, shared with the panel's dataBinder connection. */
    get port() { return this.#port; }
    subscribe(callback) { this.#listeners.add(callback); return () => this.#listeners.delete(callback); }
    #notify() { for (const callback of this.#listeners) callback(); }
    #receive = event => {
        if (this.state === 'disposed') return;
        const message = fromTytx(event.data).asDict();
        if (message.op === 'closed') { this.close(); return; }
        // The other dataBinder operations belong to the panel's connection.
        if (message.op) return;
        if (message.styles) this.styles = message.styles;
        if (message.type === 'state') {
            this.breakpoints = message.breakpoints;
            this.history = message.history;
            this.state = 'started'; this.error = '';
        } else if (message.type === 'error') this.error = message.error;
        if (message.type === 'result') {
            const pending = this.#pending.get(message.id);
            if (pending) {
                this.#pending.delete(message.id);
                if (message.ok && !this.error) pending.resolve(message);
                else pending.reject(new Error(message.error || this.error));
            }
        }
        this.#notify();
    };
    request(type, command = {}) {
        if (this.state === 'disposed') return Promise.reject(new Error('Inspected page disconnected'));
        const id = ++this.#next;
        return new Promise((resolve, reject) => {
            this.#pending.set(id, {resolve, reject});
            this.#port.postMessage(messageText({type, command, id}));
        });
    }
    close() {
        if (this.state === 'disposed') return;
        this.#port.postMessage(messageText({type: 'disconnect'}));
        this.#port.removeEventListener('message', this.#receive);
        this.#port.close();
        this.state = 'disposed';
        for (const pending of this.#pending.values()) pending.reject(new Error('Inspected page disconnected'));
        this.#pending.clear();
        this.#notify();
    }
}
