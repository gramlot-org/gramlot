import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
import {JSDOM} from 'jsdom';
import {Bag} from '@jsr/genro__bag';
import {fromTytx} from '@jsr/genro__tytx';
import {RendererBase, SourceBag, SourceBagNode, sourceBagFromTytx, sourceTarget} from '@jsr/genro__builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {GramlotBuilderBag, GramlotBuilderBagNode} from '../src/builder/source.js';

const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';

/** A Gramlot branch mounted in a real builder document, with its Data events. */
function mountedBranch(attributes = null) {
    const builder = new GramlotBuilder();
    const branch = new GramlotBuilderBag(null, builder);
    builder.source.setItem('scope', branch, attributes);
    const events = [];
    builder.data.subscribe('probe', {any: event => events.push(event)});
    return {builder, branch, events};
}

test('GramlotBuilderBag creates GramlotBuilderBagNode and keeps identity through bindBuilder and insertion', () => {
    const builder = new GramlotBuilder();
    const branch = new GramlotBuilderBag(null, builder);
    const nested = new GramlotBuilderBag(null, builder);
    const leaf = nested.setItem('leaf', 'text');
    const holder = branch.setItem('holder', nested);
    assert.ok(holder instanceof GramlotBuilderBagNode);
    assert.ok(holder instanceof SourceBagNode);
    assert.ok(leaf instanceof GramlotBuilderBagNode);
    const identity = new Map([[holder, 'holder'], [leaf, 'leaf']]);
    assert.equal(branch.bindBuilder(builder), branch);
    builder.source.setItem('main', branch);
    const mounted = builder.source.getItem('main');
    assert.equal(mounted, branch);
    assert.equal(identity.get(mounted.getNode('holder')), 'holder');
    assert.equal(identity.get(mounted.getNode('holder').value.getNode('leaf')), 'leaf');
    assert.equal(mounted.getNode('holder').builder, builder);
});

test('PUT writes insert, update and attribute values without Data events', () => {
    const {builder, branch, events} = mountedBranch({datapath: 'form'});
    builder.data.setItem('form', new Bag());
    events.length = 0;
    const node = branch.setItem('writer', null);
    node.PUT('.x', 1);
    node.PUT('.x', 2);
    node.PUT('.x?caption', 'Caption');
    assert.equal(node.GET('.x'), 2);
    assert.equal(node.GET('.x?caption'), 'Caption');
    assert.deepEqual(events, []);
    node.SET('.x', 3);
    assert.deepEqual(events.map(event => event.evt), ['upd_value']);
});

test('PUT into a missing branch still reports the intermediate autocreate insertions', () => {
    const {branch, events} = mountedBranch();
    const node = branch.setItem('writer', null);
    node.PUT('deep.inner.x', 1);
    assert.equal(node.GET('deep.inner.x'), 1);
    assert.deepEqual(events.map(event => [event.evt, event.node.label, event.reason]),
        [['ins', 'deep', 'autocreate'], ['ins', 'inner', 'autocreate']]);
});

test('FIRE_AFTER fires after the default and explicit delays and returns its cancellation', async () => {
    const {branch, events} = mountedBranch();
    const node = branch.setItem('writer', null);
    const fired = () => events.filter(event => event.node.label === 'tick').map(event => event.node.label);
    const cancelDefault = node.FIRE_AFTER('tick');
    assert.equal(typeof cancelDefault, 'function');
    assert.deepEqual(fired(), []);
    await sleep(40);
    assert.deepEqual(fired(), ['tick']);
    assert.equal(node.GET('tick'), null);
    node.FIRE_AFTER('tick', 'late', 120);
    await sleep(40);
    assert.deepEqual(fired(), ['tick']);
    await sleep(160);
    assert.deepEqual(fired(), ['tick', 'tick']);
    const cancel = node.FIRE_AFTER('tick', true, 20);
    cancel();
    await sleep(60);
    assert.deepEqual(fired(), ['tick', 'tick']);
});

test('variable datapath reads the branch datapath from Data and follows its changes', () => {
    const {builder, branch} = mountedBranch();
    const record = new GramlotBuilderBag(null, builder);
    branch.setItem('record', record, {datapath: '^current.path'});
    const inner = new GramlotBuilderBag(null, builder);
    record.setItem('inner', inner, {datapath: '.address'});
    const field = inner.setItem('field', null);
    builder.data.setItem('current.path', 'customers.c1');
    assert.equal(field.absDatapath('^.city'), 'customers.c1.address.city');
    assert.equal(field.absDatapath('.city?label'), 'customers.c1.address.city?label');
    builder.data.setItem('current.path', 'customers.c2');
    assert.equal(field.absDatapath('.city'), 'customers.c2.address.city');
    builder.data.setItem('customers.c2.address.city', 'Pisa');
    assert.equal(field.GET('.city'), 'Pisa');
    builder.data.setItem('current.path', '');
    assert.equal(field.absDatapath('.city'), null);
    builder.data.setItem('current.path', null);
    assert.equal(field.absDatapath('.city'), null);
    assert.equal(field.absDatapath('absolute.x'), 'absolute.x');
});

test('a relative variable datapath is an explicit error, not a guessed context', () => {
    const {builder, branch} = mountedBranch({datapath: 'form'});
    const record = new GramlotBuilderBag(null, builder);
    branch.setItem('record', record, {datapath: '^.selected'});
    const field = record.setItem('field', null);
    assert.throws(() => field.absDatapath('.x'), /relative variable datapath has no defined resolution/);
});

for (const symbol of ['FORM', 'ANCHOR', 'target']) {
    test(`symbolic #${symbol} keeps ?attr through GramlotBuilderBagNode.absDatapath and GET`, () => {
        const {builder, branch} = mountedBranch({datapath: 'main.form', form: true, _anchor: true, node_id: 'target'});
        const node = branch.setItem('reader', null);
        builder.data.setItem('main.form.x', 'value', {caption: 'Caption'});
        assert.equal(node.absDatapath(`#${symbol}.x?caption`), 'main.form.x?caption');
        assert.equal(node.absDatapath(`^#${symbol}.x?caption`), 'main.form.x?caption');
        assert.equal(node.absDatapath(`#${symbol}.x`), 'main.form.x');
        assert.equal(node.GET(`#${symbol}.x?caption`), 'Caption');
        assert.equal(node.GET(`#${symbol}.x`), 'value');
    });
}

test('Python Source decoded in the browser keeps node identity as a Map key after insertion and references', () => {
    const code = `
from gramlot import GramlotBuilder
import json
builder = GramlotBuilder()
panel = builder.root.div("before", id="panel")
from genro_tytx import to_tytx
child = panel.span("after")
ref = builder.reference(child)
print(json.dumps({"wire": to_tytx(builder.source), "ref": ref}))
`;
    const {wire, ref} = JSON.parse(execFileSync(python, ['-c', code], {encoding: 'utf8'}).trim());
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    const app = new Gramlot({document, transport: false});
    const prepared = sourceBagFromTytx(wire, app.builder);
    const panel = prepared.getNodes()[0];
    const child = panel.value.getNodes()[0];
    const identity = new Map([[panel, 'panel'], [child, 'child']]);
    app.startSource(prepared);
    const mounted = app.source.getItem('main');
    assert.equal(identity.get(mounted.getNodes()[0]), 'panel');
    assert.equal(identity.get(mounted.getNodes()[0].value.getNodes()[0]), 'child');
    assert.equal(app.reference(ref), child);
    assert.ok(app.renderer.records.has(child));
    assert.equal(app.reference({...ref, kind: 'dom'}).textContent, 'after');
    app.dispose();
});

test('the legacy data(path, value) call silently builds the HTML5 data element in JavaScript', () => {
    const builder = new GramlotBuilder();
    const root = builder.wrapSource(builder.source);
    root.data('.nome', 'Ada');
    root.data('.nome', {value: 'Ada'});
    const [positional, named] = builder.source.getNodes();
    assert.equal(positional.nodeTag, 'data');
    assert.equal(positional.value, '.nome');
    assert.deepEqual(positional.getAttr(), {0: 'A', 1: 'd', 2: 'a'});
    assert.equal(named.nodeTag, 'data');
    assert.equal(named.value, '.nome');
    assert.deepEqual(named.getAttr(), {value: 'Ada'});
});

/** Author the four value kinds on Builder's dataSetter in Python or JavaScript. */
const VALUE_AUTHORING = `
import sys
from genro_bag import Bag
from genro_tytx import to_tytx, from_tytx
from gramlot import GramlotBuilder
if sys.argv[1] == 'encode':
    builder = GramlotBuilder()
    bag = Bag(); bag['a'] = 1; bag['b.c'] = 'x'
    for destination, value in (('.bag', bag), ('.n', 7), ('.arr', [1, 'a', None]), ('.nul', None)):
        builder.root.dataSetter(destination, value=value)
    print(to_tytx(builder.source))
else:
    source = from_tytx(sys.stdin.read())
    attrs = {node.attr['destination']: node.attr for node in source.nodes}
    assert isinstance(attrs['.bag']['value'], Bag) and attrs['.bag']['value']['b.c'] == 'x'
    assert attrs['.bag']['value']['a'] == 1
    assert attrs['.n']['value'] == 7
    assert attrs['.arr']['value'] == [1, 'a', None]
    assert 'value' not in attrs['.nul']
    print('ok')
`;

function assertValueAttributes(source) {
    const attrs = Object.fromEntries(source.getNodes().map(node => [node.getAttr('destination'), node.getAttr()]));
    assert.ok(attrs['.bag'].value instanceof Bag);
    assert.equal(attrs['.bag'].value.getItem('a'), 1);
    assert.equal(attrs['.bag'].value.getItem('b.c'), 'x');
    assert.equal(attrs['.n'].value, 7);
    assert.deepEqual(attrs['.arr'].value, [1, 'a', null]);
    assert.equal(Object.hasOwn(attrs['.nul'], 'value'), false);
}

test('the value attribute keeps Bag, scalar and array across TYTX in every direction; null is not authored', () => {
    const builder = new GramlotBuilder();
    const root = builder.wrapSource(builder.source);
    const bag = new Bag();
    bag.setItem('a', 1);
    bag.setItem('b.c', 'x');
    root.dataSetter({destination: '.bag', value: bag});
    root.dataSetter({destination: '.n', value: 7});
    root.dataSetter({destination: '.arr', value: [1, 'a', null]});
    root.dataSetter({destination: '.nul', value: null});
    assert.equal(Object.hasOwn(builder.source.getNodes()[3].getAttr(), 'value'), false);
    const jsWire = builder.toTytx();
    assertValueAttributes(fromTytx(jsWire));
    const pythonWire = execFileSync(python, ['-c', VALUE_AUTHORING, 'encode'], {encoding: 'utf8'}).trim();
    assertValueAttributes(fromTytx(pythonWire));
    assert.equal(execFileSync(python, ['-c', VALUE_AUTHORING, 'decode'], {input: jsWire, encoding: 'utf8'}).trim(), 'ok');
    assert.equal(execFileSync(python, ['-c', VALUE_AUTHORING, 'decode'], {input: pythonWire, encoding: 'utf8'}).trim(), 'ok');
});

test('runtimeValues resolves pointers; pointers() lists only reactive ones with an empty name for the value', () => {
    const builder = new GramlotBuilder();
    const root = builder.wrapSource(builder.source);
    builder.data.setItem('v', 'V');
    builder.data.setItem('x', 'X');
    builder.data.setItem('y', 'Y');
    root.div('^v', {title: '^x', alt: '=y', tabindex: 3});
    const node = builder.source.getNodes()[0];
    assert.deepEqual(node.pointers(), [['title', '^x'], ['', '^v']]);
    assert.deepEqual(builder.runtimeValues(node), ['V', {title: 'X', alt: 'Y', tabindex: 3}]);
});

test('Builder _resolveLogicFunc finds static functions only', () => {
    class LogicBuilder extends GramlotBuilder {
        static onStatic() { return 'static'; }
        onInstance() { return 'instance'; }
    }
    const builder = new LogicBuilder();
    assert.equal(builder._resolveLogicFunc('onStatic')(), 'static');
    assert.throws(() => builder._resolveLogicFunc('onInstance'), /not found on any data_logic source/);
});

test('RendererBase.render resolves data-element attributes before returning null', () => {
    const builder = new GramlotBuilder();
    const root = builder.wrapSource(builder.source);
    builder.data.setItem('ctx.a', 1);
    const box = root.div({datapath: 'ctx'});
    const bag = new Bag();
    bag.setItem('a', 1);
    box.dataSetter({destination: '.x', value: bag, colore: 'rosso'});
    box.dataFormula({destination: '.t', func: 'somma', formula: 'a + b', a: '^.a', b: '=.b'});
    box.dataController({func: 'f', script: 'this.SET(".z", `${a}`)', a: '^.a'});
    box.dataController({func: 'g', script: 'console.log(`${missing}`)'});
    const outside = root.dataFormula({destination: 'out', func: 'f', a: '^.a'});
    const renderer = new RendererBase(builder);
    const [setter, formula, controller, template] = sourceTarget(box).value.getNodes();
    assert.equal(renderer.render(setter), null);
    assert.equal(renderer.render(formula), null);
    assert.equal(renderer.render(controller), null);
    assert.throws(() => renderer.render(template), /Unknown template parameter 'missing'/);
    assert.throws(() => renderer.render(sourceTarget(outside)), /unresolved relative datapath: \^\.a/);
});

test('decoded Source and Builder-authored Source are Builder classes, not Gramlot classes', () => {
    const builder = new GramlotBuilder();
    builder.root.div('x').span('y');
    assert.equal(builder.source.constructor, SourceBag);
    assert.equal(builder.source.getNodes()[0].value.constructor, SourceBag);
    const decoded = sourceBagFromTytx(builder.toTytx(), new GramlotBuilder());
    assert.equal(decoded.constructor, SourceBag);
    assert.equal(decoded.getNodes()[0].value.constructor, SourceBag);
    const wire = builder.toTytx();
    const rooted = GramlotBuilderBag.fromTytx(wire.slice(0, wire.lastIndexOf('::')));
    assert.equal(rooted.constructor, GramlotBuilderBag);
    assert.equal(rooted.getNodes()[0].value.constructor, SourceBag);
    const mixed = new SourceBag();
    mixed.setItem('branch', new GramlotBuilderBag());
    assert.throws(() => mixed.toTytx(), /Unregistered Bag branch type: GramlotBuilderBag/);
});
