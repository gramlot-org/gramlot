import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {fromTytx, getSubtypeDict, toTytx} from '@genrojs/tytx';
import {RendererBase, SourceBag, SourceBagNode, sourceBagFromTytx, sourceTarget} from '@genrojs/builders';
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

test('a relative variable datapath is read in the parent context and counts as written in its place', () => {
    const {builder, branch} = mountedBranch({datapath: 'form'});
    const record = new GramlotBuilderBag(null, builder);
    branch.setItem('record', record, {datapath: '^.selected'});
    const field = record.setItem('field', null);
    builder.data.setItem('form.selected', '.x1');
    assert.equal(field.absDatapath('.x'), 'form.x1.x');
    builder.data.setItem('form.selected', 'absolute');
    assert.equal(field.absDatapath('.x'), 'absolute.x');
    builder.data.setItem('form.selected', '');
    assert.equal(field.absDatapath('.x'), null);
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
    const prepared = sourceBagFromTytx(wire, app.src.builder);
    const panel = prepared.getNodes()[0];
    const child = panel.value.getNodes()[0];
    const identity = new Map([[panel, 'panel'], [child, 'child']]);
    app.src.startSource(prepared);
    const mounted = app.src.source.getItem('main');
    assert.equal(identity.get(mounted.getNodes()[0]), 'panel');
    assert.equal(identity.get(mounted.getNodes()[0].value.getNodes()[0]), 'child');
    assert.equal(app.dom.reference(ref), child);
    assert.ok(app.src.renderer.records.has(child));
    assert.equal(app.dom.reference({...ref, kind: 'dom'}).textContent, 'after');
    app.dispose();
});

/** Author the four value kinds on Gramlot's dataSetter (binding.json) in Python or JavaScript. */
const VALUE_AUTHORING = `
import sys
from genro_bag import Bag
from genro_tytx import to_tytx, from_tytx
from gramlot import GramlotBuilder
if sys.argv[1] == 'encode':
    builder = GramlotBuilder()
    bag = Bag(); bag['a'] = 1; bag['b.c'] = 'x'
    for destination_path, value in (('.bag', bag), ('.n', 7), ('.arr', [1, 'a', None]), ('.nul', None)):
        builder.root.dataSetter(destination_path, value=value)
    print(to_tytx(builder.source))
else:
    source = from_tytx(sys.stdin.read())
    attrs = {node.attr['destination_path']: node.attr for node in source.nodes}
    assert isinstance(attrs['.bag']['value'], Bag) and attrs['.bag']['value']['b.c'] == 'x'
    assert attrs['.bag']['value']['a'] == 1
    assert attrs['.n']['value'] == 7
    assert attrs['.arr']['value'] == [1, 'a', None]
    assert 'value' not in attrs['.nul']
    print('ok')
`;

function assertValueAttributes(source) {
    const attrs = Object.fromEntries(source.getNodes().map(node => [node.getAttr('destination_path'), node.getAttr()]));
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
    root.dataSetter({destination_path: '.bag', value: bag});
    root.dataSetter({destination_path: '.n', value: 7});
    root.dataSetter({destination_path: '.arr', value: [1, 'a', null]});
    root.dataSetter({destination_path: '.nul', value: null});
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

test('a value starting with == is not a pointer: runtimeValues keeps it and pointers() skips it', () => {
    const builder = new GramlotBuilder();
    builder.data.setItem('x', 'X');
    builder.data.setItem('y', 'Y');
    builder.root.div({title: '==1+1', alt: '^x', lang: '=y'});
    const node = builder.source.getNodes()[0];
    assert.equal(node.constructor, GramlotBuilderBagNode);
    assert.equal(node.pointerType('==1+1'), null);
    assert.equal(node.pointerType('^x'), '^');
    assert.equal(node.pointerType('=y'), '=');
    assert.deepEqual(node.pointers(), [['alt', '^x']]);
    assert.deepEqual(builder.runtimeValues(node), [null, {title: '==1+1', alt: 'X', lang: 'Y'}]);
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

test('RendererBase.render resolves data-element pointers, leaves ${...} literal and returns null', () => {
    const builder = new GramlotBuilder();
    const root = builder.wrapSource(builder.source);
    builder.data.setItem('ctx.a', 1);
    const box = root.div({datapath: 'ctx'});
    const bag = new Bag();
    bag.setItem('a', 1);
    box.dataSetter({destination_path: '.x', value: bag, colore: 'rosso'});
    box.dataFormula({result_path: '.t', formula: 'a + b', a: '^.a', b: '=.b'});
    box.dataController({script: 'this.SET(".z", `${a}`)', a: '^.a'});
    box.dataController({script: 'console.log(`${missing}`)'});
    const outside = root.dataFormula({result_path: 'out', func: 'f', a: '^.a'});
    const renderer = new RendererBase(builder);
    const [setter, formula, controller, template] = sourceTarget(box).value.getNodes();
    assert.equal(renderer.render(setter), null);
    assert.equal(renderer.render(formula), null);
    assert.equal(renderer.render(controller), null);
    assert.equal(renderer.render(template), null);
    assert.equal(builder.runtimeValues(controller)[1].script, 'this.SET(".z", `${a}`)');
    assert.equal(builder.runtimeValues(template)[1].script, 'console.log(`${missing}`)');
    assert.throws(() => renderer.render(sourceTarget(outside)), /unresolved relative datapath: \^\.a/);
});

/** Python authoring of the same Source on a GramlotBuilder root (also nested, or with a == expression), on a GramlotBuilderBag root, or decoding a wire. */
const SOURCE_AUTHORING = `
import sys
from genro_tytx import from_tytx, to_tytx
from gramlot import GramlotBuilder
from gramlot.page.source import GramlotBuilderBag
builder = GramlotBuilder()
if sys.argv[1] == 'builder':
    builder.root.div(id="panel").span("after")
    print(to_tytx(builder.source))
elif sys.argv[1] == 'nested':
    builder.root.div(id="panel").div("x").span("y")
    print(to_tytx(builder.source))
elif sys.argv[1] == 'expression':
    builder.root.div(title="==1+1", alt="^x", lang="=y")
    print(to_tytx(builder.source))
elif sys.argv[1] == 'gramlot':
    root = GramlotBuilderBag(builder=builder)
    root.div(id="panel").span("after")
    print(to_tytx(root))
else:
    source = from_tytx(sys.stdin.read())
    panel = source.nodes[0]
    print(" ".join(type(item).__name__ for item in (source, panel, panel.value, panel.value.nodes[0])))
`;

const pythonWire = kind => execFileSync(python, ['-c', SOURCE_AUTHORING, kind], {encoding: 'utf8'}).trim();
const pythonClasses = wire => execFileSync(python, ['-c', SOURCE_AUTHORING, 'decode'], {input: wire, encoding: 'utf8'}).trim();
/** The JSON payload of a Bag wire, without its "::X" suffix. */
function payload(wire) {
    assert.ok(wire.endsWith('::X'), wire);
    return JSON.parse(wire.slice(0, -'::X'.length));
}
/** The same Source as SOURCE_AUTHORING 'gramlot', with the branch built explicitly as a GramlotBuilderBag. */
function gramlotSource(builder) {
    const root = new GramlotBuilderBag(null, builder);
    const branch = new GramlotBuilderBag(null, builder);
    builder.wrapSource(branch).span('after');
    builder.wrapSource(root).div(branch, {id: 'panel'});
    return root;
}
function assertGramlotClasses(source) {
    const panel = source.getNodes()[0];
    assert.equal(source.constructor, GramlotBuilderBag);
    assert.equal(panel.constructor, GramlotBuilderBagNode);
    assert.equal(panel.value.constructor, GramlotBuilderBag);
    assert.equal(panel.value.getNodes()[0].constructor, GramlotBuilderBagNode);
}

test('Bag, SourceBag and GramlotBuilderBag share the TYTX subtype dictionary of X under their class names', () => {
    const subtypes = getSubtypeDict('X');
    assert.equal(GramlotBuilderBag.tytxSuffix, 'X');
    assert.equal(subtypes.Bag, Bag);
    assert.equal(subtypes.SourceBag, SourceBag);
    assert.equal(subtypes.GramlotBuilderBag, GramlotBuilderBag);
});

test('a Python GramlotBuilderBag Source reaches the browser as Gramlot classes through every path', async () => {
    const wire = pythonWire('gramlot');
    const rows = payload(wire);
    assert.equal(rows.__cls, 'GramlotBuilderBag');
    assert.equal(rows.rows.some(row => Object.hasOwn(row[4], '__cls')), false);
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    const app = new Gramlot({document, pageId: 'test', transport: {
        main: async () => wire,
        source: async () => wire,
    }});
    const decoded = sourceBagFromTytx(wire, app.src.builder);
    assertGramlotClasses(decoded);
    const bound = fromTytx(wire);
    assert.equal(app.src.prepareSource(bound), bound);
    assertGramlotClasses(bound);
    assert.equal(bound.getNodes()[0].builder, app.src.builder);
    await app.start();
    const mounted = app.src.source.getItem('main');
    assertGramlotClasses(mounted);
    const target = mounted.getNodes()[0];
    assert.ok(app.src.renderer.records.has(target.value.getNodes()[0]));
    await app.src.remoteSource(target, 'details', {});
    assert.equal(target.value.constructor, GramlotBuilderBag);
    assertGramlotClasses(target.value);
    assert.equal(app.src.renderer.destination.textContent, 'after');
    app.dispose();
});

test('a JavaScript GramlotBuilderBag Source decodes in Python as GramlotBuilderBag and GramlotBuilderBagNode', () => {
    const source = gramlotSource(new GramlotBuilder());
    assert.equal(pythonClasses(toTytx(source)),
        'GramlotBuilderBag GramlotBuilderBagNode GramlotBuilderBag GramlotBuilderBagNode');
    const holder = new SourceBag();
    holder.setItem('branch', new GramlotBuilderBag());
    const wire = toTytx(holder);
    assert.equal(payload(wire).rows[0][4].__cls, 'GramlotBuilderBag');
    assert.equal(fromTytx(wire).getItem('branch').constructor, GramlotBuilderBag);
});

test('Python and JavaScript write the same wire for the same Source', () => {
    const builder = new GramlotBuilder();
    builder.root.div({id: 'panel'}).span('after');
    assert.equal(payload(builder.toTytx()).__cls, 'GramlotBuilderBag');
    assert.deepEqual(payload(builder.toTytx()), payload(pythonWire('builder')));
    assert.deepEqual(payload(toTytx(gramlotSource(new GramlotBuilder()))), payload(pythonWire('gramlot')));
});

test('GramlotBuilder authoring produces Gramlot classes at the root, in nested branches and on promotion', () => {
    assert.equal(GramlotBuilder._sourceClass, GramlotBuilderBag);
    const builder = new GramlotBuilder();
    assert.equal(builder._sourceroot.constructor, GramlotBuilderBag);
    assert.equal(builder.source.constructor, GramlotBuilderBag);
    builder.root.div({id: 'panel'}).div('x').span('y');
    const panel = builder.source.getNodes()[0];
    assert.equal(panel.constructor, GramlotBuilderBagNode);
    assert.equal(panel.value.constructor, GramlotBuilderBag);
    const inner = panel.value.getNodes()[0];
    assert.equal(inner.constructor, GramlotBuilderBagNode);
    assert.equal(inner.getAttr('_text'), 'x');
    assert.equal(inner.value.constructor, GramlotBuilderBag);
    assert.equal(inner.value.getNodes()[0].constructor, GramlotBuilderBagNode);
    const wire = payload(builder.toTytx());
    assert.equal(wire.__cls, 'GramlotBuilderBag');
    assert.equal(wire.rows.some(row => Object.hasOwn(row[4], '__cls')), false);
    assert.deepEqual(wire, payload(pythonWire('nested')));
    assert.equal(pythonClasses(builder.toTytx()),
        'GramlotBuilderBag GramlotBuilderBagNode GramlotBuilderBag GramlotBuilderBagNode');
    const root = new GramlotBuilderBag(null, builder);
    builder.wrapSource(root).div({id: 'panel'}).span('after');
    assert.equal(root.getNodes()[0].value.constructor, GramlotBuilderBag);
    assert.deepEqual(payload(toTytx(root)), payload(pythonWire('gramlot')));
});

test('a Python Source reaches the browser as GramlotBuilderBagNode and classifies == as no pointer', () => {
    const builder = new GramlotBuilder();
    builder.data.setItem('x', 'X');
    builder.data.setItem('y', 'Y');
    const node = sourceBagFromTytx(pythonWire('expression'), builder).getNodes()[0];
    assert.equal(node.constructor, GramlotBuilderBagNode);
    assert.equal(node.pointerType(node.getAttr('title')), null);
    assert.deepEqual(node.pointers(), [['alt', '^x']]);
    assert.deepEqual(builder.runtimeValues(node), [null, {title: '==1+1', alt: 'X', lang: 'Y'}]);
});
