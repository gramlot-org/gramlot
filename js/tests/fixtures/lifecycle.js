// Shared page for the integrated lifecycle tests of S13 (binding-integration, binding-cleanup): a Gramlot
// page on a virtual clock, with the live timers and DOM listeners counted, a trace of the Data writes
// and of the provider invocations, and the counters that must come back to their baseline.
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@jsr/genro__builders';
import {Gramlot, GramlotBuilder} from '../../src/index.js';

/**
 * A page, by default without server transport. `trace` receives, in order, `data:<evt>:<path>` for every write in
 * the document Data and `<who>:<reason>` for every invocation of the companion method `record`.
 */
export function page(t, {transport = false} = {}) {
    t.mock.timers.enable({apis: ['setTimeout', 'setInterval']});
    const timers = liveTimers(t);
    const {window} = new JSDOM('<main></main>');
    const listeners = liveListeners(window);
    const document = window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport});
    const trace = [];
    const Logic = class {};
    Object.defineProperty(Logic.prototype, 'record', {
        value(node, kwargs) { trace.push(`${kwargs.who}:${kwargs._reason}`); },
        writable: true, configurable: true,
    });
    app.logicRegistry.register(Logic, {group: null, resource: '/lifecycle_aux.js'});
    app.data.subscribe('lifecycle-trace', {any: event => {
        const base = event.pathlist ?? [];
        const path = event.evt === 'ins' || event.evt === 'del' ? [...base, event.node.label] : base;
        trace.push(`data:${event.evt}:${path.join('.')}`);
    }});
    return {app, window, document, data: app.data, clock: t.mock.timers, timers, listeners, trace,
        byId: id => document.getElementById(id)};
}

/** A detached Source authored by `author`, as a GramlotBuilderBag. */
export function authored(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.source;
}

/** Start `app` on a Source holding one `section#host` with a `p#base`, and return the host node. */
export function startHost(app) {
    app.startSource(authored(root => root.section({id: 'host'}).p('base', {id: 'base'})));
    return sourceTarget(app.source.getItem('main').getNodes()[0]);
}

/** Insert the branch authored by `author` under `host` as one Source event (a fragment node `label`). */
export function insertBranch(app, host, label, author) {
    host.value.setItem(label, app.prepareSource(authored(author)));
    return host.value.getNode(label);
}

/**
 * The branch used by the traces and by the cycles: a pane with a Data context, a `dataSetter`, a
 * text input with a default and `live`, two radios of one group, a button with a nested controller,
 * a `connect_onclick`, a `==` expression, a `node_id`, a `__ref`, and a controller with every
 * lifecycle trigger, a `_timing` of one second and a `_delay` of 50 ms.
 */
export function fullBranch(n) {
    return root => {
        const pane = root.div({id: `pane${n}`, datapath: `p${n}`, node_id: `pane${n}`, __ref: `ref${n}`});
        pane.dataSetter({destination_path: '.greeting', value: 'hello'});
        pane.input({id: `name${n}`, value: '^.name', default_value: 'anon', live: true});
        pane.input({id: `ra${n}`, type: 'radio', group: `g${n}`, value: '^.ra'});
        pane.input({id: `rb${n}`, type: 'radio', group: `g${n}`, value: '^.rb'});
        const button = pane.button('go', {id: `button${n}`});
        button.dataController({func: 'record', who: 'click'});
        pane.span('^.greeting', {id: `span${n}`, title: '=="t-" + greeting', greeting: '^.greeting',
            connect_onclick: 'this.SET(".clicked", event.type)'});
        pane.dataController({func: 'record', who: 'ctl', name: '^.name', _init: true, _onBuilt: true,
            _onStart: true, _timing: 1, _delay: 50});
    };
}

/**
 * The counters that must be back to their baseline after the removal of every mounted branch; `root` is the
 * element the page renders into (`main` for the pages of this fixture).
 */
export function counters({app, document, timers, listeners, root = document.querySelector('main')}) {
    const subscribers = bag => Object.keys(bag._updSubscribers).length + Object.keys(bag._insSubscribers).length
        + Object.keys(bag._delSubscribers).length;
    return {
        bindings: app.binding.size,
        registrations: app.binding.router.size,
        nodeIds: app.binding.nodeIds.size,
        inline: app.binding.inlineCompiler.size,
        records: app.renderer.records.size,
        references: app.renderer.references.entries.size,
        elements: root.getElementsByTagName('*').length,
        timers: timers.size,
        listeners: listeners.size,
        dataSubscribers: subscribers(app.binding.root),
        sourceSubscribers: subscribers(app.source),
        remoteRequests: app.remoteRequests.size,
    };
}

/** The counters of `after` that differ from `before`, as differences. */
export function delta(after, before) {
    return Object.fromEntries(Object.keys(after).filter(key => after[key] !== before[key])
        .map(key => [key, after[key] - before[key]]));
}

/** The pending timeouts and intervals, counted over the virtual clock; restored after the test. */
export function liveTimers(t) {
    const live = new Set();
    const saved = {
        setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout,
        setInterval: globalThis.setInterval, clearInterval: globalThis.clearInterval,
    };
    globalThis.setTimeout = (callback, ...rest) => {
        const id = saved.setTimeout((...args) => { live.delete(id); callback(...args); }, ...rest);
        live.add(id);
        return id;
    };
    globalThis.setInterval = (...args) => {
        const id = saved.setInterval(...args);
        live.add(id);
        return id;
    };
    globalThis.clearTimeout = id => { live.delete(id); saved.clearTimeout(id); };
    globalThis.clearInterval = id => { live.delete(id); saved.clearInterval(id); };
    t.after(() => Object.assign(globalThis, saved));
    return live;
}

/** The DOM listeners added and not removed on the nodes of `window`, as `target type listener` triples. */
export function liveListeners(window) {
    const live = new Set();
    const key = new Map();
    const identity = (target, type, listener) => {
        let byTarget = key.get(target);
        if (!byTarget) key.set(target, byTarget = new Map());
        let byType = byTarget.get(type);
        if (!byType) byTarget.set(type, byType = new Map());
        if (!byType.has(listener)) byType.set(listener, {target, type, listener});
        return byType.get(listener);
    };
    const prototype = window.EventTarget.prototype;
    const add = prototype.addEventListener;
    const remove = prototype.removeEventListener;
    prototype.addEventListener = function (type, listener, options) {
        if (this instanceof window.Node && listener) live.add(identity(this, type, listener));
        return add.call(this, type, listener, options);
    };
    prototype.removeEventListener = function (type, listener, options) {
        if (this instanceof window.Node && listener) live.delete(identity(this, type, listener));
        return remove.call(this, type, listener, options);
    };
    return live;
}
