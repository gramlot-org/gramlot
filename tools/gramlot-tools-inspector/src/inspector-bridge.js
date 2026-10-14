/** Explicit page/panel bridge. No frame discovery or extension API. */
import {Bag, Gramlot} from '@gramlot/gramlot';
import {scalarType} from './editor-values.js';

let sequence = 0;
const roots = ['data', 'source'];
const forbidden = new Set(['_meta', '__proto__', 'prototype', 'constructor']);

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
function cell(value) {
    if (scalarType(value)) return {encoded: encodeScalar(value)};
    // These values are explicitly read-only descriptors, never substitute edit values.
    const display = value instanceof Bag ? `Bag (${value.getNodes().length} nodes)`
        : value === undefined ? 'undefined' : typeof value === 'function' ? '[Function]'
        : typeof value === 'bigint' || typeof value === 'symbol' ? String(value) : JSON.stringify(value);
    return {display, readonly: true};
}

/** Bind one known instance to one explicitly transferred MessagePort. */
export function attachInspectorAgent(gramlot, port) {
    if (!(gramlot instanceof Gramlot) || gramlot.state === 'disposed') throw new TypeError('Expected a live Gramlot instance');
    const document = gramlot.src.renderer.destination.ownerDocument;
    const window = document.defaultView;
    const subscriber = `inspector-bridge-${++sequence}`;
    const identities = new WeakMap();
    const versions = new WeakMap();
    let nextNode = 0, stopped = false, scheduled = false;
    const breakpoints = new Map();
    const bag = root => {
        if (!roots.includes(root)) throw new Error(`Unknown root: ${root}`);
        return root === 'data' ? gramlot.data : gramlot.src.source;
    };
    const identity = node => {
        if (!identities.has(node)) identities.set(node, ++nextNode);
        return identities.get(node);
    };
    const describe = (store, ancestors = new Set()) => {
        if (ancestors.has(store)) throw new Error('Inspector snapshots require an acyclic Bag');
        const next = new Set([...ancestors, store]);
        return store.getNodes().map(node => {
            const value = node.getValue(true);
            const branch = !node.resolver && value instanceof Bag;
            return {id: identity(node), label: node.label, revision: versions.get(node) ?? 0,
                value: branch ? null : cell(value), children: branch ? describe(value, next) : null,
                readonly: !!node.resolver,
                attrs: Object.entries(node.getAttr()).filter(([name]) => name !== '_meta').map(([name, value]) => [name, cell(value)])};
        });
    };
    const snapshot = () => ({data: describe(bag('data')), source: describe(bag('source')),
        breakpoints: [...breakpoints.values()].map(({test, ...record}) => record)});
    const send = data => { if (!stopped) port.postMessage(data); };
    const flush = () => {
        if (scheduled || stopped) return;
        scheduled = true;
        queueMicrotask(() => {
            scheduled = false;
            if (stopped) return;
            try { send({type: 'snapshot', snapshot: snapshot()}); }
            catch (error) { send({type: 'error', error: error.message}); }
        });
    };
    const hit = (config, root, fields) => {
        config.hits++;
        if (config.mode === 'debugger') { debugger; } // Writer is still on this stack.
        else window.console.log('** Gramlot breakpoint **', root, fields);
    };
    const changed = (root, event) => {
        const structural = event.evt === 'ins' || event.evt === 'del';
        const labels = event.pathlist === null ? [] : event.pathlist;
        for (const node of Array.isArray(event.node) ? event.node : [event.node]) {
            versions.set(node, (versions.get(node) ?? 0) + 1);
            const path = (structural ? [...labels, node.label] : labels).join('.');
            const config = breakpoints.get(`${root}:${path}`);
            if (!config) continue;
            const fields = {evt: event.evt, node, value: node.getValue(true), oldvalue: event.oldvalue,
                attrs_diff: event.attrs_diff, reason: event.reason, path};
            if (config.test) {
                try {
                    if (!config.test(fields.evt, node, fields.value, fields.oldvalue, fields.attrs_diff, fields.reason, path)) continue;
                    config.error = '';
                } catch (error) { config.error = error.message; continue; }
            }
            hit(config, root, fields);
        }
        flush();
    };
    const edit = command => {
        const node = bag(command.root).getNode(command.path);
        if (!node || identity(node) !== command.nodeId || (versions.get(node) ?? 0) !== command.revision) {
            throw new Error('Node changed or was removed. Press Escape to reload before saving.');
        }
        const attrs = {...node.getAttr()};
        for (const name of command.remove) {
            if (forbidden.has(name) || !Object.hasOwn(attrs, name) || !scalarType(attrs[name])) throw new Error(`Cannot remove attribute: ${name}`);
            delete attrs[name];
        }
        for (const [name, encoded] of command.set) {
            if (!name.trim() || forbidden.has(name) || (Object.hasOwn(attrs, name) && !scalarType(attrs[name]))) throw new Error(`Cannot edit attribute: ${name}`);
            attrs[name] = decodeScalar(encoded);
        }
        let value;
        if (Object.hasOwn(command, 'value')) {
            if (node.resolver || !scalarType(node.getValue(true))) throw new Error('This value is read-only');
            value = decodeScalar(command.value);
        }
        // Decode and validate the entire command before the first real write.
        if (command.set.length || command.remove.length) node.setAttr(attrs, true, false, false);
        if (Object.hasOwn(command, 'value')) node.setValue(value);
    };
    const setBreakpoint = command => {
        bag(command.root);
        if (typeof command.path !== 'string' || !command.path || !['', 'console', 'debugger'].includes(command.mode)) throw new Error('Invalid breakpoint');
        const condition = command.condition.trim();
        const test = command.mode && condition ? new window.Function('evt', 'node', 'value', 'oldvalue', 'attrs_diff', 'reason', 'path', `"use strict"; return (${condition});`) : null;
        const key = `${command.root}:${command.path}`;
        if (command.mode) breakpoints.set(key, {root: command.root, path: command.path, mode: command.mode, condition, hits: 0, error: '', test});
        else breakpoints.delete(key);
    };
    const receive = event => {
        const message = event.data;
        if (message.type === 'disconnect') { dispose(); return; }
        try {
            if (message.type === 'edit') edit(message.command);
            else if (message.type === 'breakpoint') setBreakpoint(message.command);
            else if (message.type !== 'refresh') throw new Error(`Unknown inspector command: ${message.type}`);
            send({type: 'result', id: message.id, ok: true, snapshot: snapshot()});
        } catch (error) { send({type: 'result', id: message.id, ok: false, error: error.message}); }
    };
    function dispose() {
        if (stopped) return;
        send({type: 'closed'});
        stopped = true;
        for (const root of roots) bag(root).unsubscribe(subscriber, {any: true});
        breakpoints.clear();
        port.removeEventListener('message', receive);
        window.removeEventListener('pagehide', dispose);
        port.close();
    }
    for (const root of roots) bag(root).subscribe(subscriber, {any: event => changed(root, event)});
    port.addEventListener('message', receive);
    window.addEventListener('pagehide', dispose);
    port.start();
    flush();
    return {dispose};
}

/** Read-only panel copies; only agent acknowledgements update them. */
export class InspectorConnection {
    data = new Bag();
    source = new Bag();
    state = 'connecting';
    error = '';
    breakpoints = [];
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
        for (const row of rows) {
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
