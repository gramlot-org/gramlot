// Phase S03: Builder's Data root, semantic and DOM lifetimes, Source event intake
// (decisions P4, P17, P24, R04, R07; source plan §4.3, §4.4, §5.2).
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {HtmlBuilder, SourceBag, sourceBagToTytx, sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {GramlotBuilderBag} from '../src/builder/source.js';
import {BindingRuntime, NodeBinding} from '../src/binding/runtime.js';
import {LogicGroup, LogicRegistry} from '../src/binding/logic.js';

function page(transport = false) {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport});
    return {document, app};
}

function wire(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.toTytx();
}

/** Every Source node of `bag`, depth first. */
function sourceNodes(bag) {
    return bag.getNodes().flatMap(node => [node, ...(node.value instanceof SourceBag ? sourceNodes(node.value) : [])]);
}

/** Subscriber ids of one Bag, per event kind. */
function subscribers(bag) {
    return {update: Object.keys(bag._updSubscribers), insert: Object.keys(bag._insSubscribers),
        delete: Object.keys(bag._delSubscribers)};
}

/** Record every event the runtime handles, in order, as `evt:label`. */
function traceEvents(app) {
    const trace = [];
    const handle = app.binding.handleSourceEvent.bind(app.binding);
    app.binding.handleSourceEvent = event => {
        const nodes = Array.isArray(event.node) ? event.node : [event.node];
        trace.push(`${event.evt}:${nodes.map(node => node.label).join(',')}`);
        return handle(event);
    };
    return trace;
}

test('the Data root is Builder\'s: identities, construction order and the inner document Bag', () => {
    const {app} = page();
    assert.ok(app.binding instanceof BindingRuntime);
    assert.equal(app.binding.gramlot, app);
    assert.equal(app.binding.builder, app.builder);
    assert.equal(app.binding.renderer, app.renderer);
    assert.equal(app.renderer.binding, app.binding);
    assert.equal(app.binding.logicRegistry, app.logicRegistry);
    assert.ok(app.logicRegistry instanceof LogicRegistry);
    assert.equal(app.logicRegistry.gramlot, app);
    assert.ok(app.logic instanceof LogicGroup);
    assert.equal(app.logic.page, app);
    assert.deepEqual(Object.keys(app.logic), []);
    assert.equal(app.data, app.builder.data);
    assert.equal(app.binding.data, app.builder.data);
    assert.equal(app.binding.root, app.builder._dataroot);
    assert.equal(app.binding.root.getItem('_root_'), app.builder.data);
    assert.equal(app.data.getItem('main'), null);
    assert.deepEqual(app.data.keys(), []);
    app.data.setItem('x', 7);
    assert.equal(app.binding.root.getItem('_root_.x'), 7);
    assert.equal(app.binding.root.getItem('_root_').getItem('x'), 7);
    app.dispose();
});

test('one Data subscription per app, on Builder\'s wrapper; the content Bag has none', () => {
    const {app} = page();
    const counts = subscribers(app.binding.root);
    assert.equal(counts.update.length, 1);
    assert.deepEqual(counts.insert, counts.update);
    assert.deepEqual(counts.delete, counts.update);
    assert.deepEqual(subscribers(app.data), {update: [], insert: [], delete: []});
    let received = 0;
    const receive = app.binding.receiveData.bind(app.binding);
    app.binding.receiveData = event => { received++; return receive(event); };
    app.data.setItem('a.b', 1);
    assert.ok(received > 0);
    app.dispose();
    assert.deepEqual(subscribers(app.binding.root), {update: [], insert: [], delete: []});
});

test('two instances are isolated: Data, subscriptions, NodeBindings and logic', () => {
    const one = page().app;
    const two = page().app;
    one.builder.root.div('one');
    one.data.setItem('x', 1);
    assert.equal(two.data.getItem('x'), null);
    assert.notEqual(one.binding.root, two.binding.root);
    assert.notEqual(one.logic, two.logic);
    assert.equal(one.binding.size, 1);
    assert.equal(two.binding.size, 0);
    assert.equal(subscribers(one.binding.root).update.length, 1);
    assert.equal(subscribers(two.binding.root).update.length, 1);
    one.dispose();
    assert.equal(subscribers(two.binding.root).update.length, 1);
    two.dispose();
});

test('the renderer requires a BindingRuntime', async () => {
    const {app, document} = page();
    const {GramlotRenderer} = await import('../src/renderer/gramlot-renderer.js');
    assert.throws(() => new GramlotRenderer(app.builder, app.source, document.querySelector('main')), /BindingRuntime/);
    assert.throws(() => new GramlotRenderer(app.builder, app.source, document.querySelector('main'), {binding: {}}),
        /BindingRuntime/);
    assert.equal('mount' in app.renderer, false);
    app.dispose();
});

test('one NodeBinding per Source node, once per identity, counted', () => {
    const {app} = page();
    app.startSource(wire(root => {
        const section = root.section();
        section.span('a');
        section.span('b');
        root.p('c');
    }));
    const nodes = sourceNodes(app.source);
    assert.equal(nodes.length, 5); // main fragment, section, two spans, p
    assert.equal(app.binding.size, 5);
    for (const node of nodes) {
        const binding = app.binding.bindingFor(node);
        assert.ok(binding instanceof NodeBinding);
        assert.equal(binding.node, node);
        assert.equal(binding.runtime, app.binding);
        assert.equal(binding.closed, false);
        assert.equal(app.binding.openBinding(node), binding);
    }
    assert.equal(app.binding.size, 5);
    app.builder.wrapSource(nodes[1]).em('d');
    assert.equal(app.binding.size, 6);
    assert.equal(app.binding.bindingFor(app.builder.data.getNode('missing')), null);
    app.dispose();
});

test('roots stay stable after the replacement of a branch', () => {
    const {app} = page();
    const {data, source} = app;
    const root = app.binding.root;
    app.startSource(wire(root => root.section().span('old')));
    app.data.setItem('kept', 1);
    const section = source.getItem('main').getNodes()[0];
    const replacement = new GramlotBuilderBag(null, app.builder);
    app.builder.wrapSource(replacement).strong('new');
    section.setValue(replacement);
    assert.equal(app.data, data);
    assert.equal(app.source, source);
    assert.equal(app.binding.root, root);
    assert.equal(root.getItem('_root_'), data);
    assert.equal(app.data.getItem('kept'), 1);
    assert.equal(app.renderer.destination.textContent, 'new');
    app.dispose();
});

test('a DOM rebuild releases the DOM listeners and keeps the NodeBinding', () => {
    const {app} = page();
    const section = sourceTarget(app.builder.root.section(null, {id: 'panel'}));
    const child = sourceTarget(app.builder.wrapSource(section).span('text'));
    const binding = app.binding.bindingFor(child);
    let domCleanups = 0, semanticCleanups = 0;
    app.renderer.onDispose(child, () => domCleanups++);
    binding.track(() => semanticCleanups++);
    app.renderer.freeze(section);
    app.renderer.unfreeze(section); // rebuilds the branch
    assert.equal(domCleanups, 1);
    assert.equal(semanticCleanups, 0);
    assert.equal(app.binding.bindingFor(child), binding);
    assert.equal(binding.closed, false);
    assert.equal(app.renderer.records.get(child).cleanup.length, 0);
    app.dispose();
    assert.equal(semanticCleanups, 1);
    assert.equal(binding.closed, true);
});

test('a deletion under freeze closes the NodeBinding at once; the old DOM waits for thaw', () => {
    const {app, document} = page();
    const section = sourceTarget(app.builder.root.section(null, {id: 'panel'}));
    const child = sourceTarget(app.builder.wrapSource(section).span('text'));
    const binding = app.binding.bindingFor(child);
    let closed = 0;
    binding.track(() => closed++);
    app.renderer.freeze(section);
    section.value.popNode(child.label);
    assert.equal(binding.closed, true);
    assert.equal(closed, 1);
    assert.equal(app.binding.bindingFor(child), null);
    assert.equal(document.getElementById('panel').textContent, 'text');
    app.renderer.unfreeze(section);
    assert.equal(document.getElementById('panel').textContent, '');
    assert.equal(closed, 1);
    app.dispose();
});

test('dispose closes the binding before the renderer and can be repeated', () => {
    const {app} = page();
    const node = sourceTarget(app.builder.root.div('x'));
    const order = [];
    app.binding.bindingFor(node).track(() => order.push('binding'));
    app.renderer.onDispose(node, () => order.push('renderer'));
    app.dispose();
    app.dispose();
    app.binding.dispose();
    app.renderer.dispose();
    assert.deepEqual(order, ['binding', 'renderer']);
    assert.equal(app.binding.size, 0);
    assert.equal(app.binding.disposed, true);
    assert.throws(() => app.binding.openBinding(node), /disposed/);
});

test('NodeBinding: track returns a release, close runs disposers once in reverse order and collects errors', () => {
    const {app} = page();
    const node = sourceTarget(app.builder.root.div('x'));
    const binding = app.binding.bindingFor(node);
    const order = [];
    binding.track(() => order.push('first'));
    const release = binding.track(() => order.push('released'));
    binding.track(() => { order.push('failing'); throw new Error('boom'); });
    binding.track(() => order.push('last'));
    release();
    assert.throws(() => app.builder.source.popNode(node.label), AggregateError);
    assert.deepEqual(order, ['last', 'failing', 'first']);
    assert.equal(binding.closed, true);
    assert.throws(() => binding.track(() => {}), /closed/);
    app.dispose();
});

test('event matrix, closing part: del, del of several nodes, upd_value from a SourceBag, SourceBag to null, upd_value_attr', () => {
    const {app} = page();
    const trace = traceEvents(app);
    const {builder} = app;
    const section = sourceTarget(builder.root.section());
    const a = sourceTarget(builder.wrapSource(section).span('a'));
    const b = sourceTarget(builder.wrapSource(section).div());
    const b1 = sourceTarget(builder.wrapSource(b).em('b1'));
    const [bindingA, bindingB, bindingB1] = [a, b, b1].map(node => app.binding.bindingFor(node));

    // del: the node and its descendants.
    section.value.popNode(b.label);
    assert.equal(bindingB.closed, true);
    assert.equal(bindingB1.closed, true);
    assert.equal(bindingA.closed, false);

    // del of several nodes (Bag.clear emits one event with an array).
    const c = sourceTarget(builder.wrapSource(section).span('c'));
    const bindingC = app.binding.bindingFor(c);
    section.value.clear();
    assert.equal(bindingA.closed, true);
    assert.equal(bindingC.closed, true);

    // upd_value with an old SourceBag and a new SourceBag: old children closed, new ones opened.
    const d = sourceTarget(builder.wrapSource(section).span('d'));
    const bindingSection = app.binding.bindingFor(section);
    const bindingD = app.binding.bindingFor(d);
    const replacement = new GramlotBuilderBag(null, builder);
    const e = sourceTarget(builder.wrapSource(replacement).strong('e'));
    section.setValue(replacement);
    assert.equal(bindingD.closed, true);
    assert.equal(app.binding.bindingFor(section), bindingSection);
    assert.ok(app.binding.bindingFor(e));

    // upd_value SourceBag → null: old children closed, the node keeps its NodeBinding.
    const bindingE = app.binding.bindingFor(e);
    section.setValue(null);
    assert.equal(bindingE.closed, true);
    assert.equal(app.binding.bindingFor(section), bindingSection);
    assert.equal(bindingSection.closed, false);

    // upd_value_attr (the remoteSource form): old branch closed, new branch opened.
    const branch = new GramlotBuilderBag(null, builder);
    builder.wrapSource(branch).span('f');
    section.setValue(branch);
    const f = branch.getNodes()[0];
    const bindingF = app.binding.bindingFor(f);
    const next = new GramlotBuilderBag(null, builder);
    const g = sourceTarget(builder.wrapSource(next).span('g'));
    section.setValue(next, true, {title: 'changed'}, true);
    assert.equal(bindingF.closed, true);
    assert.ok(app.binding.bindingFor(g));
    assert.ok(trace.includes('del:span_0,span_1'));
    assert.ok(trace.includes(`upd_value_attr:${section.label}`));
    assert.equal(app.binding.size, sourceNodes(app.source).length);
    app.dispose();
});

test('a Source mutation made during semantic work is processed after the current event, in the FIFO', () => {
    const {app, document} = page();
    const trace = traceEvents(app);
    const section = sourceTarget(app.builder.root.section(null, {id: 'panel'}));
    const child = sourceTarget(app.builder.wrapSource(section).span('old'));
    app.binding.bindingFor(child).track(() => {
        app.builder.wrapSource(section).strong('added');
        // Still inside the del: the insertion is queued, not processed.
        assert.equal(trace.at(-1), `del:${child.label}`);
    });
    trace.length = 0;
    section.value.popNode(child.label);
    assert.deepEqual(trace, [`del:${child.label}`, 'ins:strong_0']);
    assert.equal(document.getElementById('panel').textContent, 'added');
    app.dispose();
});

/** Run `during(node)` once, while the renderer constructs the node returned by `target()`. */
function constructing(app, target, during) {
    const create = app.renderer.html.create.bind(app.renderer.html);
    let done = false;
    app.renderer.html.create = (node, ...rest) => {
        if (!done && node === target()) { done = true; during(node); }
        return create(node, ...rest);
    };
}

test('R04: a change of the node under construction is ignored on arrival; other nodes stay in the FIFO', () => {
    const {app, document} = page();
    const trace = traceEvents(app);
    const other = sourceTarget(app.builder.root.p('other', {id: 'other'}));
    let built = null;
    constructing(app, () => built, node => {
        node.setAttr({title: 'ignored'});
        other.setAttr({title: 'queued'});
        assert.equal(document.getElementById('other').title, '');
    });
    trace.length = 0;
    const wrapped = app.builder.root.div('x', {id: 'built', node_label: 'built'});
    built = sourceTarget(wrapped);
    // The first insertion happened before `built` was known: build it again through a value change.
    built.setValue(new GramlotBuilderBag(null, app.builder));
    assert.equal(document.getElementById('built').title, '');
    assert.ok(!trace.includes('upd_attrs:built'));
    assert.deepEqual(trace.slice(-1), [`upd_attrs:${other.label}`]);
    assert.equal(document.getElementById('other').title, 'queued');
    // After the construction a change is processed.
    built.setAttr({title: 'processed'});
    assert.equal(document.getElementById('built').title, 'processed');
    app.dispose();
});

test('R04 with several deletions: the node under construction is dropped from the event, the others are processed', () => {
    const {app} = page();
    const section = sourceTarget(app.builder.root.section());
    const a = sourceTarget(app.builder.wrapSource(section).span('a'));
    const b = sourceTarget(app.builder.wrapSource(section).span('b'));
    const bindingA = app.binding.bindingFor(a);
    const bindingB = app.binding.bindingFor(b);
    constructing(app, () => a, () => section.value.clear());
    a.setValue(new GramlotBuilderBag(null, app.builder)); // rebuilds `a`
    assert.equal(bindingA.closed, false);
    assert.equal(bindingB.closed, true);
    app.dispose();
});

test('R04 under freeze: a change of a frozen node during a construction is queued; semantic work runs, DOM waits for thaw', () => {
    const {app, document} = page();
    const trace = traceEvents(app);
    const frozen = sourceTarget(app.builder.root.section(null, {id: 'frozen'}));
    const inner = sourceTarget(app.builder.wrapSource(frozen).span('inner'));
    const innerBinding = app.binding.bindingFor(inner);
    app.renderer.freeze(frozen);
    let built = null;
    constructing(app, () => built, () => frozen.value.popNode(inner.label));
    built = sourceTarget(app.builder.root.div('x', {id: 'built'}));
    built.setValue(new GramlotBuilderBag(null, app.builder));
    assert.deepEqual(trace.slice(-1), [`del:${inner.label}`]);
    assert.equal(innerBinding.closed, true);
    assert.equal(document.getElementById('frozen').textContent, 'inner');
    app.renderer.unfreeze(frozen);
    assert.equal(document.getElementById('frozen').textContent, '');
    app.dispose();
});

test('P24: a remoteSource request survives a rebuild of its target', async () => {
    let resolve;
    const {app, document} = page({main: async () => wire(root => root.div('old', {id: 'slot'})),
        source: () => new Promise(done => { resolve = done; })});
    await app.start();
    const target = app.source.getItem('main').getNodes()[0];
    const pending = app.remoteSource(target, 'details');
    app.renderer.freeze(target);
    app.renderer.unfreeze(target); // DOM rebuild of the target
    resolve(wire(root => root.span('new')));
    assert.equal(await pending, true);
    assert.equal(document.getElementById('slot').textContent, 'new');
    app.dispose();
});

test('P24: a remoteSource request on a live target under freeze applies; the DOM waits for thaw', async () => {
    let resolve;
    const {app, document} = page({main: async () => wire(root => root.div('old', {id: 'slot'})),
        source: () => new Promise(done => { resolve = done; })});
    await app.start();
    const target = app.source.getItem('main').getNodes()[0];
    app.renderer.freeze(target);
    const pending = app.remoteSource(target, 'details');
    resolve(wire(root => root.span('new')));
    assert.equal(await pending, true);
    assert.equal(document.getElementById('slot').textContent, 'old');
    assert.ok(app.binding.bindingFor(target.value.getNodes()[0]));
    app.renderer.unfreeze(target);
    assert.equal(document.getElementById('slot').textContent, 'new');
    app.dispose();
});

test('P24: removing the target closes its NodeBinding and aborts the request; a late response is discarded', async () => {
    let resolve, signal;
    const {app, document} = page({main: async () => wire(root => root.div('old', {id: 'slot'})),
        source: (pageId, method, params, abort) => new Promise(done => { resolve = done; signal = abort; })});
    await app.start();
    const target = app.source.getItem('main').getNodes()[0];
    const pending = app.remoteSource(target, 'details');
    app.source.getItem('main').popNode(target.label);
    assert.equal(signal.aborted, true);
    resolve(wire(root => root.span('late')));
    assert.equal(await pending, false);
    assert.equal(document.querySelector('main').textContent, '');
    await assert.rejects(app.remoteSource(target, 'details'), /not mounted/);
    app.dispose();
});

test('R07: Gramlot classes are accepted; HtmlBuilder Sources, generic roots and inserted generic branches are rejected before any effect', () => {
    const {app, document} = page();
    const html = new HtmlBuilder();
    html.root.p('html');
    assert.throws(() => app.startSource(sourceBagToTytx(html.source)), /GramlotBuilderBags/);
    assert.throws(() => app.startSource(html.source), /GramlotBuilderBags/);
    const generic = new SourceBag(null, app.builder);
    assert.throws(() => app.startSource(generic), /GramlotBuilderBags/);
    assert.equal(app.source.getNode('main'), null);
    assert.equal(app.binding.size, 0);
    assert.equal(app.state, 'failed');

    app.startSource(wire(root => root.section(null, {id: 'panel'})));
    const section = app.source.getItem('main').getNodes()[0];
    assert.ok(section.value === null || section.value instanceof GramlotBuilderBag);
    const size = app.binding.size;
    const branch = new SourceBag(null, app.builder);
    branch.setItem('p', 'generic', {}, '>', false, true, null, false, true, null, 'p');
    assert.throws(() => section.setValue(branch), /GramlotBuilderBags/);
    assert.equal(app.binding.size, size);
    assert.equal(document.getElementById('panel').textContent, '');
    app.dispose();
});
