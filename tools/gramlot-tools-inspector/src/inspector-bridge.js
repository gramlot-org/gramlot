/** Explicit page/panel bridge. No frame discovery or extension API. */
import {Bag} from '@gramlot/gramlot';
import {scalarType} from './editor-values.js';
export {attachInspectorAgent} from './inspector-agent.js';

const roots = ['data', 'source'];

export function encodeScalar(value) {
    if (!scalarType(value)) throw new TypeError('The inspector edits scalar values only');
    const wrapper = new Bag();
    wrapper.setItem('value', value);
    return wrapper.toTytx('json');
}
function decodeScalar(text) {
    const value = Bag.fromTytx(text, 'json').getItem('value');
    if (!scalarType(value)) throw new TypeError('The inspector edits scalar values only');
    return value;
}
/** Read-only panel copies; only agent acknowledgements update them. */
export class InspectorConnection {
    data = new Bag();
    source = new Bag();
    state = 'connecting';
    error = '';
    breakpoints = [];
    styles = null;
    #info = new WeakMap();
    #listeners = new Set();
    #pending = new Map();
    #next = 0;
    #port;
    constructor(port) {
        this.#port = port;
        port.addEventListener('message', this.#receive);
        port.start();
    }
    nodeInfo(node) { return this.#info.get(node); }
    subscribe(callback) { this.#listeners.add(callback); return () => this.#listeners.delete(callback); }
    #notify() { for (const callback of this.#listeners) callback(); }
    #receive = event => {
        const message = event.data;
        if (message.type === 'closed') { this.close(); return; }
        try {
            if (message.styles) this.styles = message.styles;
            if (message.snapshot) {
                for (const root of roots) this.#reconcile(this[root], message.snapshot[root]);
                this.breakpoints = message.snapshot.breakpoints;
                this.state = 'started'; this.error = '';
            } else if (message.type === 'error') this.error = message.error;
        } catch (error) { this.error = error.message; }
        if (message.type === 'result') {
            const pending = this.#pending.get(message.id);
            if (pending) {
                this.#pending.delete(message.id);
                if (message.ok && !this.error) pending.resolve();
                else pending.reject(new Error(message.error || this.error));
            }
        }
        this.#notify();
    };
    #reconcile(store, rows) {
        const labels = new Set(rows.map(row => row.label));
        for (const node of store.getNodes()) if (!labels.has(node.label)) store.popNode(node.label);
        for (const [index, row] of rows.entries()) {
            let node = store.getNode(row.label);
            let previous = node ? this.#info.get(node) : null;
            if (node && previous?.id !== row.id) { store.popNode(row.label); node = null; previous = null; }
            const branch = row.children !== null;
            const read = descriptor => descriptor.readonly ? descriptor.display : decodeScalar(descriptor.encoded);
            const value = branch ? (previous?.branch ? node.getValue(true) : new Bag())
                : previous?.valueWire === JSON.stringify(row.value) ? node.getValue(true) : read(row.value);
            const attrs = {};
            for (const [name, descriptor] of row.attrs) {
                attrs[name] = previous?.attrsWire.get(name) === JSON.stringify(descriptor) ? node.getAttr(name) : read(descriptor);
            }
            if (!node) node = store.setItem(row.label, value, null, '>', false, false);
            else if (!Object.is(node.getValue(true), value)) node.setValue(value);
            if (!previous || previous.attrsWire.size !== row.attrs.length || row.attrs.some(([name, descriptor]) => previous.attrsWire.get(name) !== JSON.stringify(descriptor))) {
                node.setAttr(attrs, true, false, false);
            }
            this.#info.set(node, {id: row.id, revision: row.revision, branch,
                readonly: row.readonly || !!row.value?.readonly,
                readonlyAttrs: new Set(row.attrs.filter(([, descriptor]) => descriptor.readonly).map(([name]) => name)),
                valueWire: JSON.stringify(row.value), attrsWire: new Map(row.attrs.map(([name, descriptor]) => [name, JSON.stringify(descriptor)]))});
            if (branch) this.#reconcile(value, row.children);
            const position = store.getNodes().indexOf(node);
            if (position !== index) store.move(position, index);
        }
    }
    request(type, command = {}) {
        if (this.state === 'disposed') return Promise.reject(new Error('Inspected page disconnected'));
        const id = ++this.#next;
        return new Promise((resolve, reject) => {
            this.#pending.set(id, {resolve, reject});
            this.#port.postMessage({type, command, id});
        });
    }
    close() {
        if (this.state === 'disposed') return;
        this.#port.postMessage({type: 'disconnect'});
        this.#port.removeEventListener('message', this.#receive);
        this.#port.close();
        this.state = 'disposed';
        for (const pending of this.#pending.values()) pending.reject(new Error('Inspected page disconnected'));
        this.#pending.clear();
        this.#notify();
    }
}
