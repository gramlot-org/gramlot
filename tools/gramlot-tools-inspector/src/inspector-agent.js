/** Shared page-side inspector; the supplied page owns its Bag and runtime. */
import {scalarType, readParameterEnums} from '../../../js/src/editor-values.js';
import {MessagePortStore} from '../../../js/src/message-port-store.js';
import {InspectorHistory} from './inspector-history.js';
import {InspectorStyles} from './inspector-styles.js';

const roots = ['data', 'source'];
// `_inspector` is the reserved attribute of the projection nodes: identity, revision and edit limits.
const forbidden = new Set(['_meta', '_inspector', '__proto__', 'prototype', 'constructor']);

/**
 * Bind one known instance to one explicitly transferred MessagePort. The page's Data and Source are
 * served as a projection Bag (`data` and `source`) to the dataBinders at the other end; commands
 * travel on the same port.
 */
export function attachInspectorAgent(gramlot, port) {
    if (!gramlot || gramlot.state === 'disposed') throw new TypeError('Expected a live Gramlot instance');
    const Bag = gramlot.data.constructor;
    const checkScalar = value => {
        if (!scalarType(value)) throw new TypeError('The inspector edits scalar values only');
        return value;
    };
    // These values are explicitly read-only descriptors, never substitute edit values.
    const display = value => value instanceof Bag ? `Bag (${value.getNodes().length} nodes)`
        : value === undefined ? 'undefined' : typeof value === 'function' ? '[Function]'
        : typeof value === 'bigint' || typeof value === 'symbol' ? String(value) : JSON.stringify(value);
    const document = gramlot.src.renderer.destination.ownerDocument;
    const window = document.defaultView;
    const styles = new InspectorStyles(document);
    const history = new InspectorHistory(gramlot);
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
    const projection = new Bag();
    for (const root of roots) projection.setItem(root, new Bag());
    const sameAttrs = (left, right) => {
        const names = Object.keys(right);
        return Object.keys(left).length === names.length && names.every(name => name === '_inspector'
            ? JSON.stringify(left[name]) === JSON.stringify(right[name]) : Object.hasOwn(left, name) && Object.is(left[name], right[name]));
    };
    /** Align one projection branch with its target Bag: same labels and order, only differences written. */
    const reconcile = (copy, target, root, ancestors = new Set()) => {
        if (ancestors.has(target)) throw new Error('Inspector snapshots require an acyclic Bag');
        const next = new Set([...ancestors, target]);
        const nodes = target.getNodes();
        const labels = new Set(nodes.map(node => node.label));
        for (const node of copy.getNodes()) if (!labels.has(node.label)) copy.popNode(node.label);
        for (const [index, node] of nodes.entries()) {
            const value = node.getValue(true);
            const branch = !node.resolver && value instanceof Bag;
            const attrs = {}, readonlyAttrs = [];
            for (const [name, item] of Object.entries(node.getAttr())) {
                if (name === '_meta' || name === '_inspector') continue;
                if (scalarType(item)) attrs[name] = item;
                else { attrs[name] = display(item); readonlyAttrs.push(name); }
            }
            const scalar = branch ? null : scalarType(value) ? value : display(value);
            attrs._inspector = {id: identity(node), revision: versions.get(node) ?? 0,
                readonly: !!node.resolver || (!branch && !scalarType(value)), readonlyAttrs,
                parameterEnums: root === 'source' ? readParameterEnums(node) : {}};
            let item = copy.getNode(node.label);
            if (item && item.getAttr('_inspector')?.id !== attrs._inspector.id) {
                copy.popNode(node.label);
                item = null;
            }
            if (!item) item = copy.setItem(node.label, branch ? new Bag() : scalar, attrs, index, false, false);
            else {
                // A node that becomes or stops being a branch keeps its copy, as the target keeps its node.
                const copied = item.getValue(true);
                if (branch ? !(copied instanceof Bag) : !Object.is(copied, scalar)) item.setValue(branch ? new Bag() : scalar);
                if (!sameAttrs(item.getAttr(), attrs)) item.setAttr(attrs, true, false, false);
                const position = copy.getNodes().indexOf(item);
                if (position !== index) copy.move(position, index);
            }
            if (branch) reconcile(item.getValue(true), value, root, next);
        }
    };
    const update = () => {
        for (const root of roots) reconcile(projection.getItem(root), bag(root), root);
        store.post({type: 'state', breakpoints: [...breakpoints.values()].map(({test, ...record}) => record), history: history.state});
    };
    const flush = () => {
        if (scheduled || stopped) return;
        scheduled = true;
        queueMicrotask(() => {
            scheduled = false;
            if (stopped) return;
            try { update(); }
            catch (error) { store.post({type: 'error', error: error.message}); }
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
        for (const [name, value] of command.set) {
            if (!name.trim() || forbidden.has(name) || (Object.hasOwn(attrs, name) && !scalarType(attrs[name]))) throw new Error(`Cannot edit attribute: ${name}`);
            attrs[name] = checkScalar(value);
        }
        let value;
        if (Object.hasOwn(command, 'value')) {
            if (node.resolver || !scalarType(node.getValue(true))) throw new Error('This value is read-only');
            value = checkScalar(command.value);
        }
        // Validate the entire command before the first real write.
        history.edit(node, attrs, value, !!(command.set.length || command.remove.length), Object.hasOwn(command, 'value'));
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
    const receive = message => {
        if (message.type === 'disconnect') { dispose(); return; }
        try {
            if (['styles', 'setStyle', 'resetStyle', 'resetStyles'].includes(message.type)) {
                if (gramlot.state === 'disposed') throw new Error('Inspected page disconnected');
                if (message.type === 'setStyle') styles.set(message.command.name, message.command.value);
                if (message.type === 'resetStyle') styles.reset(message.command.name);
                if (message.type === 'resetStyles') styles.dispose();
                store.post({type: 'result', id: message.id, ok: true, styles: styles.snapshot()});
                return;
            }
            let selection;
            if (message.type === 'catalog') {
                store.post({type: 'result', id: message.id, ok: true, catalog: history.catalog(message.command.path)});
                return;
            }
            if (['insert', 'remove', 'move'].includes(message.type)) {
                const command = message.command, node = bag('source').getNode(command.path);
                if (!node || identity(node) !== command.nodeId || (versions.get(node) ?? 0) !== command.revision) throw new Error('Source node changed. Select it again.');
                if (message.type === 'insert') selection = history.insert(command.path, command.tag, command.attrs);
                if (message.type === 'remove') selection = history.remove(command.path);
                if (message.type === 'move') {
                    const target = bag('source').getNode(command.destination);
                    if (!target || identity(target) !== command.targetId || (versions.get(target) ?? 0) !== command.targetRevision) throw new Error('Drop target changed. Try again.');
                    selection = history.move(command.path, command.destination, command.placement);
                }
            }
            else if (message.type === 'undo') history.undo();
            else if (message.type === 'redo') history.redo();
            else if (message.type === 'edit') edit(message.command);
            else if (message.type === 'breakpoint') setBreakpoint(message.command);
            else if (message.type !== 'refresh') throw new Error(`Unknown inspector command: ${message.type}`);
            // The projection changes travel before the acknowledgement, on the same port.
            update();
            store.post({type: 'result', id: message.id, ok: true, selection});
        } catch (error) { store.post({type: 'result', id: message.id, ok: false, error: error.message}); }
    };
    function dispose() {
        if (stopped) return;
        stopped = true;
        store.close();
        for (const root of roots) bag(root).unsubscribe(subscriber, {any: true});
        breakpoints.clear();
        history.clear();
        styles.dispose();
        window.removeEventListener('pagehide', dispose);
        port.close();
    }
    for (const root of roots) reconcile(projection.getItem(root), bag(root), root);
    const store = new MessagePortStore(projection, port, receive);
    for (const root of roots) bag(root).subscribe(subscriber, {any: event => changed(root, event)});
    window.addEventListener('pagehide', dispose);
    store.post({type: 'state', breakpoints: [], history: history.state});
    return {dispose};
}
