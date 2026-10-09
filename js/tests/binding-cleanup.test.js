// Phase S13: the error paths of the integrated lifecycle and the cleanup. An expired remoteSource;
// errors in validation, installation, first render, provider and cleanup; a failing disposer does not
// block the others; 100 mount and removal cycles with the counters back to their baseline.
// Source plan §5.1, §5.4, §7 S13.
import test from 'node:test';
import assert from 'node:assert/strict';
import {GramlotBuilder} from '../src/index.js';
import {authored, counters, delta, fullBranch, insertBranch, page, startHost} from './fixtures/lifecycle.js';
import {fromTytx, toTytx} from '@genrojs/tytx';

/** A fake server: `call` answers `main` and the remote Sources from the given functions, in the response envelope. */
function envelope({main, source, ...rest}) {
    return {...rest, async call(text, signal) {
        const {id, contentType, name, params} = fromTytx(text);
        const value = name === 'main' ? await main() : await source(name, params, signal);
        return toTytx({id, contentType, value});
    }};
}

/** A transport whose `source` answers when the test resolves it, in call order. */
function pendingTransport() {
    const answers = [];
    return {answers, transport: envelope({source: () => new Promise((resolve, reject) => answers.push({resolve, reject}))})};
}

function wire(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.toTytx();
}

/** The fragment `label` of `host` and its `pane<n>` div. */
function paneOf(host, label) {
    return host.value.getNode(label).value.getNodes()[0];
}

test('an expired remoteSource applies nothing: target removed, request superseded, page disposed', async t => {
    const {answers, transport} = pendingTransport();
    const ctx = page(t, {transport});
    const {app, trace} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    insertBranch(app, host, 'b1', fullBranch(1));
    // The target is removed while the request waits.
    const removed = app.src.remoteSource(paneOf(host, 'b1'), 'details');
    assert.equal(app.rpc.remoteRequests.size, 1);
    host.value.popNode('b1');
    trace.length = 0;
    answers[0].resolve(wire(fullBranch(9)));
    assert.equal(await removed, false);
    assert.deepEqual(trace, []);
    assert.deepEqual(delta(counters(ctx), base), {});
    // A newer request supersedes the older one: the older answer, arriving last, is dropped.
    insertBranch(app, host, 'b2', fullBranch(2));
    const target = paneOf(host, 'b2');
    const older = app.src.remoteSource(target, 'details');
    const newer = app.src.remoteSource(target, 'details');
    trace.length = 0;
    answers[2].resolve(wire(root => root.span('new', {id: 'new'})));
    assert.equal(await newer, true);
    answers[1].resolve(wire(root => root.dataSetter({destination_path: 'stale', value: 1})));
    assert.equal(await older, false);
    assert.equal(ctx.data.getItem('stale'), null);
    assert.ok(ctx.byId('new'));
    assert.equal(app.rpc.remoteRequests.size, 0);
    // Disposed while waiting.
    const late = app.src.remoteSource(target, 'details');
    app.dispose();
    answers[3].resolve(wire(root => root.dataSetter({destination_path: 'late', value: 1})));
    assert.equal(await late, false);
    assert.equal(ctx.data.getItem('late'), null);
    assert.equal(app.rpc.remoteRequests.size, 0);
});

test('a validation error has no effect: no Data write, no NodeBinding, no DOM; the page can start again', async t => {
    const {answers, transport} = pendingTransport();
    const ctx = page(t, {transport});
    const {app, trace} = ctx;
    const base = counters(ctx);
    const duplicate = authored(root => {
        root.dataSetter({destination_path: 'x', value: 1});
        root.div({__ref: 'same'});
        root.div({__ref: 'same'});
    });
    assert.throws(() => app.src.startSource(duplicate), /Duplicate Source reference/);
    assert.equal(app.state, 'failed');
    assert.deepEqual(trace, []);
    assert.deepEqual(delta(counters(ctx), base), {});
    const host = startHost(app);
    const started = counters(ctx);
    insertBranch(app, host, 'b1', fullBranch(1));
    const mounted = counters(ctx);
    trace.length = 0;
    const pending = app.src.remoteSource(paneOf(host, 'b1'), 'details');
    answers[0].resolve(wire(root => {
        root.dataSetter({destination_path: 'y', value: 1});
        root.span('x', {__ref: 'ref1'});
    }));
    // `ref1` is the pane itself, which the replacement keeps.
    await assert.rejects(pending, /Duplicate Source reference/);
    assert.deepEqual(trace, []);
    assert.deepEqual(delta(counters(ctx), mounted), {});
    host.value.popNode('b1');
    assert.deepEqual(delta(counters(ctx), started), {});
    app.dispose();
});

test('an installation error before any write closes the new NodeBindings and restores the node_id map', t => {
    const ctx = page(t);
    const {app, trace} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    trace.length = 0;
    assert.throws(() => insertBranch(app, host, 'b1', root => {
        root.div({node_id: 'kept', id: 'kept'}).dataSetter({destination_path: 'x', value: 1});
        root.div({_init: true});
    }), /'_init' is allowed only on dataFormula, dataController and dataRpc/);
    assert.deepEqual(trace, []);
    assert.deepEqual(delta(counters(ctx), base), {});
    // The node stays in the Source without NodeBinding or DOM; its removal leaves the baseline.
    host.value.popNode('b1');
    assert.deepEqual(delta(counters(ctx), base), {});
    insertBranch(app, host, 'b2', root => root.div({node_id: 'kept', id: 'kept'}));
    assert.ok(ctx.byId('kept'));
    app.dispose();
});

test('an installation error after a write: the NodeBindings close, the Data is not rolled back', t => {
    const ctx = page(t);
    const {app, trace, data} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    trace.length = 0;
    assert.throws(() => insertBranch(app, host, 'b1', root => {
        root.dataSetter({destination_path: 'written', value: 1});
        root.input({value: '^typed', default_value: 'd'});
        root.dataController({func: 'record', who: 'bad', _onStart: -1});
    }), /_onStart must be true or a delay/);
    assert.deepEqual(trace, ['data:ins:written', 'data:ins:typed']);
    assert.equal(data.getItem('written'), 1);
    assert.deepEqual(delta(counters(ctx), base), {});
    host.value.popNode('b1');
    assert.deepEqual(delta(counters(ctx), base), {});
    app.dispose();
});

test('a first render error leaves no record, listener or radio of the branch; the NodeBindings close with the node', t => {
    const ctx = page(t);
    const {app, trace} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    const create = app.src.renderer.html.create.bind(app.src.renderer.html);
    app.src.renderer.html.create = (node, ...args) => {
        if (node.value === 'bad') throw new Error('injected create failure');
        return create(node, ...args);
    };
    trace.length = 0;
    assert.throws(() => insertBranch(app, host, 'b1', root => {
        const pane = root.div({id: 'pane', datapath: 'f'});
        pane.input({id: 'text', value: '^.text', connect_onkeydown: 'void 0'});
        pane.input({id: 'ra', type: 'radio', group: 'g', value: '^.ra'});
        pane.button('go', {id: 'go', fire: '.go', __ref: 'go'});
        pane.span('bad');
        pane.dataController({func: 'record', who: 'ctl', _init: true, _onBuilt: true});
    }), /injected create failure/);
    // Installation and _init ran (§5.1 steps 1-5); no build, so no _onBuilt.
    assert.deepEqual(trace, ['ctl:init']);
    assert.equal(ctx.byId('text'), null);
    assert.deepEqual(delta(counters(ctx), base), {bindings: 7, registrations: 2});
    assert.deepEqual(app.src.renderer.radioGroups.peersOf('g', null), []);
    // Data still reaches the NodeBindings, which have no element to project.
    ctx.data.setItem('f.text', 'x');
    host.value.popNode('b1');
    assert.deepEqual(delta(counters(ctx), base), {});
    app.dispose();
});

test('a provider error propagates to the writer and leaves the page working', t => {
    const ctx = page(t);
    const {app, data} = ctx;
    const host = startHost(app);
    const Logic = class {};
    let fail = true;
    const calls = [];
    Object.defineProperty(Logic.prototype, 'check', {
        value(node, kwargs) {
            calls.push(kwargs.v);
            if (fail) throw new Error('injected provider failure');
        },
        writable: true, configurable: true,
    });
    app.src.logicRegistry.register(Logic, {group: 'p', resource: '/p.js'});
    insertBranch(app, host, 'b1', root => {
        root.span('^v', {id: 'shown'});
        root.dataController({func: 'p.check', v: '^v'});
    });
    const base = counters(ctx);
    assert.throws(() => data.setItem('v', 1), /injected provider failure/);
    assert.equal(ctx.byId('shown').textContent, '1');
    fail = false;
    data.setItem('v', 2);
    assert.deepEqual(calls, [1, 2]);
    assert.equal(ctx.byId('shown').textContent, '2');
    assert.deepEqual(delta(counters(ctx), base), {});
    // An `_init` error propagates after the installation; the NodeBindings stay open (P12, no rollback).
    fail = true;
    assert.throws(() => insertBranch(app, host, 'b2', root => {
        root.span('late', {id: 'late'});
        root.dataController({func: 'p.check', _init: true});
    }), /injected provider failure/);
    assert.equal(ctx.byId('late'), null);
    assert.deepEqual(delta(counters(ctx), base), {bindings: 3});
    host.value.popNode('b2');
    assert.deepEqual(delta(counters(ctx), base), {});
    app.dispose();
});

test('a failing disposer does not block the others: removal, replacement and clear complete, then the error surfaces', t => {
    const ctx = page(t);
    const {app} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    let ran = 0;
    const failing = node => {
        const binding = app.src.binding.bindingFor(node);
        binding.track(() => { ran++; });
        binding.track(() => { throw new Error('injected disposer failure'); });
        app.src.renderer.onDispose(node, () => { ran++; });
    };
    // Removal: the NodeBinding's other disposer, the renderer cleanups and the DOM removal still run.
    insertBranch(app, host, 'b1', fullBranch(1));
    failing(paneOf(host, 'b1'));
    assert.throws(() => host.value.popNode('b1'), /Source branch close failed/);
    assert.equal(ran, 2);
    assert.equal(ctx.byId('pane1'), null);
    assert.deepEqual(delta(counters(ctx), base), {});
    // Replacement: the old branch closes, the new one is installed and built.
    const branch = insertBranch(app, host, 'b2', fullBranch(2));
    failing(paneOf(host, 'b2'));
    assert.throws(() => branch.setValue(app.src.prepareSource(authored(fullBranch(3)))), /Source branch close failed/);
    assert.equal(ran, 4);
    assert.equal(ctx.byId('pane2'), null);
    assert.ok(ctx.byId('pane3'));
    assert.ok(app.src.binding.bindingFor(paneOf(host, 'b2')));
    // clear(): every removed node leaves, also after a failing one.
    insertBranch(app, host, 'b4', fullBranch(4));
    failing(paneOf(host, 'b2'));
    const renderedFailure = paneOf(host, 'b4');
    app.src.renderer.onDispose(renderedFailure, () => { throw new Error('injected cleanup failure'); });
    assert.throws(() => host.value.clear(), AggregateError);
    assert.equal(ctx.byId('pane3'), null);
    assert.equal(ctx.byId('pane4'), null);
    assert.equal(ctx.byId('base'), null);
    assert.deepEqual(delta(counters(ctx), base), {bindings: -1, records: -1, elements: -1});
    app.dispose();
});

test('dispose with a failing disposer still releases the renderer, the timers and the listeners', t => {
    const ctx = page(t);
    const {app} = ctx;
    const host = startHost(app);
    insertBranch(app, host, 'b1', fullBranch(1));
    app.src.binding.bindingFor(paneOf(host, 'b1')).track(() => { throw new Error('injected disposer failure'); });
    assert.throws(() => app.dispose(), /Binding cleanup failed/);
    assert.deepEqual(counters(ctx), {bindings: 0, registrations: 0, nodeIds: 0, inline: 0, records: 0, references: 0,
        elements: 0, timers: 0, listeners: 0, dataSubscribers: 0, sourceSubscribers: 0, remoteRequests: 0});
    assert.equal(app.state, 'disposed');
});

test('100 mount and removal cycles: every counter back to its baseline, nothing runs after', t => {
    const ctx = page(t);
    const {app, trace, clock, data} = ctx;
    const host = startHost(app);
    const base = counters(ctx);
    for (let cycle = 0; cycle < 100; cycle++) {
        const n = cycle % 2;
        const frozen = cycle % 3 === 0;
        insertBranch(app, host, `b${cycle}`, fullBranch(n));
        const pane = paneOf(host, `b${cycle}`);
        clock.tick(1000);
        const name = ctx.byId(`name${n}`);
        name.value = `v${cycle}`;
        name.dispatchEvent(new ctx.window.Event('input', {bubbles: true}));
        ctx.byId(`rb${n}`).click();
        ctx.byId(`button${n}`).click();
        ctx.byId(`span${n}`).click();
        // A rebuild of the pane, and a replacement of its children, on some cycles.
        if (cycle % 5 === 0) {
            app.src.renderer.freeze(pane);
            pane.setAttr({title: `t${cycle}`});
            app.src.renderer.unfreeze(pane);
        }
        if (cycle % 7 === 0) paneOf(host, `b${cycle}`).value.getNodes()[1].setAttr({type: 'search'});
        if (frozen) app.src.renderer.freeze(host);
        host.value.popNode(`b${cycle}`);
        if (frozen) app.src.renderer.unfreeze(host);
        assert.deepEqual(delta(counters(ctx), base), {}, `cycle ${cycle}`);
    }
    assert.ok(data.getItem('p1.clicked'));
    trace.length = 0;
    clock.tick(10000);
    assert.deepEqual(trace, []);
    assert.deepEqual(app.src.renderer.radioGroups.peersOf('g0', null), []);
    assert.deepEqual(app.src.renderer.radioGroups.peersOf('g1', null), []);
    app.dispose();
    assert.equal(ctx.timers.size, 0);
    assert.equal(ctx.listeners.size, 0);
});
