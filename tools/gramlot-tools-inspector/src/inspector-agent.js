/** Shared page-side inspector; the supplied page owns its Bag and runtime. */
import {scalarType, readParameterEnums} from './editor-values.js';
import {InspectorStyles} from './inspector-styles.js';

const roots = ['data', 'source'];
const forbidden = new Set(['_meta', '__proto__', 'prototype', 'constructor']);

/** Bind one known instance to one explicitly transferred MessagePort. */
export function attachInspectorAgent(gramlot, port) {
    if (!gramlot || gramlot.state === 'disposed') throw new TypeError('Expected a live Gramlot instance');
    const Bag = gramlot.data.constructor;
    const encodeScalar = value => {
        const wrapper = new Bag();
        wrapper.setItem('value', value);
        return wrapper.toTytx('json');
    };
    const decodeScalar = text => {
        const value = Bag.fromTytx(text, 'json').getItem('value');
        if (!scalarType(value)) throw new TypeError('The inspector edits scalar values only');
        return value;
    };
    function cell(value) {
        if (scalarType(value)) return {encoded: encodeScalar(value)};
        // These values are explicitly read-only descriptors, never substitute edit values.
        const display = value instanceof Bag ? `Bag (${value.getNodes().length} nodes)`
            : value === undefined ? 'undefined' : typeof value === 'function' ? '[Function]'
            : typeof value === 'bigint' || typeof value === 'symbol' ? String(value) : JSON.stringify(value);
        return {display, readonly: true};
    }
    const document = gramlot.src.renderer.destination.ownerDocument;
    const window = document.defaultView;
    const styles = new InspectorStyles(document);
    const subscriber = `inspector-bridge-${window.crypto.getRandomValues(new Uint32Array(4)).join("-")}`;
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
    const describe = (store, root, ancestors = new Set()) => {
        if (ancestors.has(store)) throw new Error('Inspector snapshots require an acyclic Bag');
        const next = new Set([...ancestors, store]);
        return store.getNodes().map(node => {
            const value = node.getValue(true);
            const branch = !node.resolver && value instanceof Bag;
            return {id: identity(node), label: node.label, revision: versions.get(node) ?? 0,
                value: branch ? null : cell(value), children: branch ? describe(value, root, next) : null,
                readonly: !!node.resolver, parameterEnums: root === 'source' ? readParameterEnums(node) : {},
                attrs: Object.entries(node.getAttr()).filter(([name]) => name !== '_meta').map(([name, value]) => [name, cell(value)])};
        });
    };
    const snapshot = () => ({data: describe(bag('data'), 'data'), source: describe(bag('source'), 'source'),
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
            if (['styles', 'setStyle', 'resetStyle', 'resetStyles'].includes(message.type)) {
                if (gramlot.state === 'disposed') throw new Error('Inspected page disconnected');
                if (message.type === 'setStyle') styles.set(message.command.name, message.command.value);
                if (message.type === 'resetStyle') styles.reset(message.command.name);
                if (message.type === 'resetStyles') styles.dispose();
                send({type: 'result', id: message.id, ok: true, styles: styles.snapshot()});
                return;
            }
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
        styles.dispose();
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

