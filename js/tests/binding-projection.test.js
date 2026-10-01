// Phase S04: registration from pointers(), rebinding, projection of Data on the built DOM,
// variable and symbolic datapaths, the null path (Q7), `visible`, `mask`, the `node_id` map (R06)
// and the Source node / DOM node lookups (source plan §2, §3.3, §4.4, §4.5, §4.11bis).
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {GramlotBuilderBag} from '../src/builder/source.js';

const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';
const XLINK = 'http://www.w3.org/1999/xlink';

function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    return {app, document, builder: app.builder, data: app.data, router: app.binding.router,
        byId: id => document.getElementById(id)};
}

/** Paths registered by the NodeBinding of `node`. */
function registered(app, node) {
    return app.binding.bindingFor(sourceTarget(node)).registrations
        .map(registration => registration.attr ? `${registration.path}?${registration.attr}` : registration.path);
}

/** Capture console.warn while `run` executes. */
function warnings(run) {
    const original = console.warn;
    const messages = [];
    console.warn = message => messages.push(message);
    try { run(); } finally { console.warn = original; }
    return messages;
}

test('an external Data write updates the page without remounting it, with one subscription', () => {
    const {app, builder, data, byId} = page();
    data.setItem('user', 'Ada');
    builder.root.p('^user', {id: 'text', title: '^tip', class: '^kind'});
    const element = byId('text');
    data.setItem('user', 'Bea');
    data.setItem('tip', 'hint');
    data.setItem('kind', 'k1');
    assert.strictEqual(byId('text'), element);
    assert.equal(element.textContent, 'Bea');
    assert.equal(element.title, 'hint');
    assert.equal(element.className, 'k1');
    assert.equal(Object.keys(app.binding.root._updSubscribers).length, 1);
    assert.deepEqual(Object.keys(app.data._updSubscribers), []);
});

test('pointers are registered from pointers(); = is not registered; a dataSetter registers nothing', () => {
    const {app, builder} = page();
    const node = builder.root.div('^a', {id: 'd', title: '^b?caption', lang: '=c'});
    builder.root.dataSetter({destination_path: 'x', value: 1});
    builder.root.dataController({func: 'go', a: '^trigger'});
    assert.deepEqual(registered(app, node).sort(), ['a', 'b?caption']);
    const [setter, controller] = builder.source.getNodes().slice(1);
    assert.deepEqual(app.binding.bindingFor(setter).registrations, []);
    // S08: a provider registers its `^` pointers through its Provider, not on the NodeBinding.
    assert.deepEqual(app.binding.bindingFor(controller).registrations, []);
    assert.equal(app.binding.bindingFor(controller).providers.length, 1);
    assert.equal(app.binding.router.size, 3);
});

test('title and class update also with reason = node (P1 concerns only `value`)', () => {
    const {builder, data, byId} = page();
    const node = sourceTarget(builder.root.div({id: 'd', title: '^t', class: '^c'}));
    data.setItem('t', 'x', null, '>', false, true, node);
    data.setItem('c', 'y', null, '>', false, true, node);
    assert.equal(byId('d').title, 'x');
    assert.equal(byId('d').className, 'y');
});

test('D1: canvas(width=^.w) stays a native attribute through changes and null, on the same element', () => {
    const {builder, data, byId} = page();
    data.setItem('box.w', 300);
    builder.root.div({datapath: 'box'}).canvas({id: 'c', width: '^.w'});
    const canvas = byId('c');
    assert.equal(canvas.getAttribute('width'), '300');
    data.setItem('box.w', 120);
    assert.strictEqual(byId('c'), canvas);
    assert.equal(canvas.getAttribute('width'), '120');
    assert.equal(canvas.hasAttribute('style'), false);
    data.setItem('box.w', null);
    assert.strictEqual(byId('c'), canvas);
    assert.equal(canvas.hasAttribute('width'), false);
    assert.equal(canvas.hasAttribute('style'), false);
});

test('rebinding stops the old path at once: ^a → ^b, pointer → literal, literal → ^b, also for the node value (R05)', () => {
    const {app, builder, data, byId} = page();
    data.setItem('a', 'A');
    data.setItem('b', 'B');
    const node = sourceTarget(builder.root.p('^a', {id: 'p', title: '^a'}));
    const element = byId('p');
    node.setValue('^b');
    assert.deepEqual(registered(app, node).sort(), ['a', 'b']);
    node.setAttr({title: '^b'});
    assert.deepEqual(registered(app, node), ['b', 'b']);
    data.setItem('a', 'A2');
    assert.equal(element.textContent, 'B');
    assert.equal(element.title, 'B');
    data.setItem('b', 'B2');
    assert.equal(element.textContent, 'B2');
    assert.equal(element.title, 'B2');
    node.setValue('literal');
    node.setAttr({title: 'fixed'});
    assert.deepEqual(registered(app, node), []);
    data.setItem('b', 'B3');
    assert.equal(element.textContent, 'literal');
    assert.equal(element.title, 'fixed');
    node.setAttr({title: '^b'});
    assert.equal(element.title, 'B3');
    data.setItem('b', 'B4');
    assert.equal(element.title, 'B4');
    assert.strictEqual(byId('p'), element);
});

test('a change of datapath or of anchor rebinds the branch and projects it again', () => {
    const {app, builder, data, byId} = page();
    data.setItem('x.n', 'from x');
    data.setItem('y.n', 'from y');
    data.setItem('f1.n', 'form one');
    data.setItem('f2.n', 'form two');
    const box = sourceTarget(builder.root.div({datapath: 'x'}));
    const child = builder.wrapSource(box).p('^.n', {id: 'p'});
    const form = sourceTarget(builder.root.div({datapath: 'f1', formId: 'f'}));
    builder.wrapSource(form).div().span('^#FORM.n', {id: 's'});
    box.setAttr({datapath: 'y'});
    assert.equal(byId('p').textContent, 'from y');
    assert.deepEqual(registered(app, child), ['y.n']);
    data.setItem('x.n', 'ignored');
    assert.equal(byId('p').textContent, 'from y');
    assert.equal(byId('s').textContent, 'form one');
    form.setAttr({datapath: 'f2'});
    assert.equal(byId('s').textContent, 'form two');
    data.setItem('f1.n', 'ignored');
    assert.equal(byId('s').textContent, 'form two');
});

test('variable datapath: .foo changes, .foo empty gives a null path, nested second variable datapath', () => {
    const {app, builder, data, byId} = page();
    data.setItem('people.a.name', 'Ann');
    data.setItem('people.b.name', 'Bob');
    data.setItem('people.a.addr.city', 'Pisa');
    data.setItem('people.a.home', '.addr');
    data.setItem('ui.sel', 'people.a');
    const outer = builder.root.div({datapath: 'ui'}).div({datapath: '^.sel', id: 'outer'});
    const name = outer.p('^.name', {id: 'name'});
    const inner = outer.div({datapath: '^.home'});
    const city = inner.span('^.city', {id: 'city'});
    const element = byId('name');
    assert.equal(element.textContent, 'Ann');
    assert.equal(byId('city').textContent, 'Pisa');
    data.setItem('ui.sel', 'people.b');
    assert.strictEqual(byId('name'), element);
    assert.equal(element.textContent, 'Bob');
    assert.equal(byId('city').textContent, '');
    data.setItem('people.a.name', 'Ann2');
    assert.equal(element.textContent, 'Bob');
    data.setItem('people.b.home', '.addr');
    data.setItem('people.b.addr.city', 'Lucca');
    assert.equal(byId('city').textContent, 'Lucca');
    data.setItem('ui.sel', '');
    assert.equal(element.textContent, '');
    assert.equal(byId('city').textContent, '');
    assert.deepEqual(registered(app, name), []);
    assert.deepEqual(registered(app, city), []);
    data.setItem('people.b.name', 'ignored');
    assert.equal(element.textContent, '');
    data.setItem('ui.sel', 'people.a');
    assert.equal(element.textContent, 'Ann2');
    assert.equal(byId('city').textContent, 'Pisa');
});

test('relative variable datapath: read in the parent context; relative, absolute and symbolic values', () => {
    const {builder, data, byId} = page();
    data.setItem('ordini.x1.n', 'relative');
    data.setItem('altro.n', 'absolute');
    data.setItem('scheda.n', 'symbolic');
    data.setItem('ordini.foo', '.x1');
    builder.root.div({datapath: 'scheda', node_id: 'box'});
    builder.root.div({datapath: 'ordini'}).div({datapath: '^.foo'}).p('^.n', {id: 'p'});
    assert.equal(byId('p').textContent, 'relative');
    data.setItem('ordini.foo', 'altro');
    assert.equal(byId('p').textContent, 'absolute');
    data.setItem('ordini.foo', '#box');
    assert.equal(byId('p').textContent, 'symbolic');
});

test('a static symbolic datapath resolves as a symbolic path', () => {
    const {builder, data, byId} = page();
    data.setItem('scheda.sub.n', 'value');
    builder.root.div({datapath: 'scheda', node_id: 'box'});
    builder.root.div({datapath: '#box.sub'}).p('^.n', {id: 'p'});
    assert.equal(byId('p').textContent, 'value');
    data.setItem('scheda.sub.n', 'changed');
    assert.equal(byId('p').textContent, 'changed');
});

test('Q7: first mount on an empty variable datapath, valid → empty → valid for text and attributes', () => {
    const {builder, data, byId} = page();
    const branch = builder.root.div({datapath: '^scelto'});
    branch.input({id: 'i', value: '^.v'});
    branch.p('^.t', {id: 'p', title: '^.t'});
    assert.equal(byId('i').value, '');
    assert.equal(byId('p').textContent, '');
    data.setItem('r.v', 'val');
    data.setItem('r.t', 'txt');
    data.setItem('scelto', 'r');
    assert.equal(byId('i').value, 'val');
    assert.equal(byId('p').textContent, 'txt');
    assert.equal(byId('p').title, 'txt');
    data.setItem('scelto', null);
    assert.equal(byId('i').value, '');
    assert.equal(byId('p').textContent, '');
    assert.equal(byId('p').hasAttribute('title'), false);
    data.setItem('scelto', 'r');
    assert.equal(byId('p').title, 'txt');
});

test('Q7: reads on a null path give null, writes raise naming node and path', () => {
    const {app, builder} = page();
    const node = sourceTarget(builder.root.div({datapath: '^scelto'}).p('^.v', {id: 'p'}));
    assert.equal(node.GET('.v'), null);
    assert.equal(node.getRelativeData('.v'), null);
    const message = {message: "p 'p_0': write on a null path: '.v'"};
    assert.throws(() => node.SET('.v', 1), message);
    assert.throws(() => node.PUT('.v', 1), message);
    assert.throws(() => node.FIRE('.v'), message);
    assert.throws(() => node.setRelativeData('.v', 1), message);
    assert.deepEqual(registered(app, node), []);
    assert.equal(app.data.getItem('v'), null);
});

test('Q7: no registration stays on the previous path after the path becomes null', () => {
    const {app, builder, data, byId} = page();
    data.setItem('a.v', 'first');
    data.setItem('sel', 'a');
    const node = builder.root.div({datapath: '^sel'}).p('^.v', {id: 'p'});
    assert.deepEqual(registered(app, node), ['a.v']);
    data.setItem('sel', '');
    assert.deepEqual(registered(app, node), []);
    data.setItem('a.v', 'changed');
    assert.equal(byId('p').textContent, '');
});

test('_path attributes hold a bare path: the pointer symbol is removed with one warning per declaration', () => {
    const {builder} = page();
    let formula;
    const messages = warnings(() => {
        // S08: the Provider reads pointers() when the formula enters the Source.
        formula = sourceTarget(builder.root.dataFormula({result_path: '^total', func: 'sum', a: '^a'}));
        assert.deepEqual(formula.pointers(), [['a', '^a']]);
        assert.deepEqual(formula.pointers(), [['a', '^a']]);
        const [, attrs] = builder.runtimeValues(formula);
        assert.equal(attrs.result_path, 'total');
    });
    assert.equal(messages.length, 1);
    assert.match(messages[0], /dataFormula '.*': 'result_path' holds a bare Data path/);
    const plain = sourceTarget(builder.root.div({foopath: '^x'}));
    assert.deepEqual(warnings(() => assert.deepEqual(plain.pointers(), [['foopath', '^x']])), []);
});

test('SVG and XLink attributes are projected with their namespace', () => {
    const {builder, data, byId} = page();
    data.setItem('ref', '#a');
    data.setItem('sw', 1);
    const svg = builder.root.svg({id: 's'});
    svg.use({id: 'u', 'xlink:href': '^ref'});
    svg.rect({id: 'r', stroke_width: '^sw'});
    svg.html({width: 5}).div('^ref', {id: 'foreign', title: '^ref'});
    const use = byId('u');
    data.setItem('ref', '#b');
    data.setItem('sw', 3);
    assert.strictEqual(byId('u'), use);
    assert.equal(use.namespaceURI, 'http://www.w3.org/2000/svg');
    assert.equal(use.getAttributeNS(XLINK, 'href'), '#b');
    assert.equal(byId('r').getAttribute('stroke-width'), '3');
    assert.equal(byId('foreign').namespaceURI, 'http://www.w3.org/1999/xhtml');
    assert.equal(byId('foreign').parentNode.localName, 'foreignObject');
    assert.equal(byId('foreign').textContent, '#b');
    assert.equal(byId('foreign').title, '#b');
    data.setItem('ref', null);
    assert.equal(use.hasAttributeNS(XLINK, 'href'), false);
});

test('render_attributes win in projection and the removal shows the current value', () => {
    const {builder, data, byId} = page();
    data.setItem('t', 'bound');
    const node = sourceTarget(builder.root.div({id: 'd', title: '^t', _meta: {render_attributes: {title: 'override'}}}));
    data.setItem('t', 'bound again');
    assert.equal(byId('d').title, 'override');
    node.setAttr({_meta: {render_attributes: {}}});
    assert.equal(byId('d').title, 'bound again');
    data.setItem('t', 'last');
    assert.equal(byId('d').title, 'last');
});

test('visible keeps the geometry, survives a style change and gives the current style back', () => {
    const {builder, data, byId} = page();
    data.setItem('style', 'color: red');
    data.setItem('show', true);
    const svg = builder.root.svg();
    svg.rect({id: 'r', visible: '^show'});
    builder.root.div('x', {id: 'd', style: '^style', visible: '^show'});
    const element = byId('d');
    assert.equal(element.style.visibility, '');
    data.setItem('show', false);
    assert.equal(element.style.visibility, 'hidden');
    assert.equal(element.style.display, '');
    assert.equal(byId('r').style.visibility, 'hidden');
    data.setItem('style', 'color: blue');
    assert.equal(element.style.color, 'blue');
    assert.equal(element.style.visibility, 'hidden');
    data.setItem('show', null);
    assert.equal(element.getAttribute('style'), 'color: blue');
    assert.equal(byId('r').hasAttribute('style'), false);
    assert.strictEqual(byId('d'), element);
    assert.equal(element.hasAttribute('visible'), false);
});

test('null removes style and class; hidden stays a native boolean', () => {
    const {builder, data, byId} = page();
    data.setItem('s', 'color: red');
    data.setItem('c', 'k');
    data.setItem('h', true);
    builder.root.div({id: 'd', style: '^s', class: '^c', hidden: '^h'});
    const element = byId('d');
    assert.equal(element.hidden, true);
    data.setItem('s', null);
    data.setItem('c', null);
    data.setItem('h', false);
    assert.equal(element.hasAttribute('style'), false);
    assert.equal(element.hasAttribute('class'), false);
    assert.equal(element.hidden, false);
});

test('mask: div(^.utente, mask=Ciao %s) is projected, empty value gives empty text, same string in Python', () => {
    const {builder, data, byId} = page();
    data.setItem('u.utente', 'Mario');
    builder.root.div({datapath: 'u'}).div('^.utente', {id: 'm', mask: 'Ciao %s'});
    const element = byId('m');
    assert.equal(element.textContent, 'Ciao Mario');
    assert.equal(element.hasAttribute('mask'), false);
    data.setItem('u.utente', 'Luigi');
    assert.equal(element.textContent, 'Ciao Luigi');
    data.setItem('u.utente', '');
    assert.equal(element.textContent, '');
    data.setItem('u.utente', null);
    assert.equal(element.textContent, '');
    const py = execFileSync(python, ['-c', `
from gramlot import GramlotBuilder
builder = GramlotBuilder()
builder.data.set_item("u.utente", "Mario")
builder.root.div(datapath="u").div("^.utente", mask="Ciao %s")
print(builder.render(), end="")
`], {encoding: 'utf8'});
    const js = new GramlotBuilder();
    js.data.setItem('u.utente', 'Mario');
    js.root.div({datapath: 'u'}).div('^.utente', {mask: 'Ciao %s'});
    assert.equal(js.render(), py);
    assert.equal(py, '<div><div>Ciao Mario</div></div>');
});

test('markup in projected text stays text', () => {
    const {builder, data, byId} = page();
    builder.root.p('^html', {id: 'p'});
    data.setItem('html', '<b>bold</b>');
    assert.equal(byId('p').textContent, '<b>bold</b>');
    assert.equal(byId('p').children.length, 0);
});

test('under freeze the elements already built react to Data; a node inserted under freeze is not projected', () => {
    const {app, builder, data, byId} = page();
    const box = sourceTarget(builder.root.div({id: 'box'}));
    builder.wrapSource(box).p('^v', {id: 'p'});
    app.renderer.freeze(box);
    data.setItem('v', 'frozen but live');
    assert.equal(byId('p').textContent, 'frozen but live');
    const late = sourceTarget(builder.wrapSource(box).span('^v', {id: 'late'}));
    data.setItem('v', 'again');
    assert.equal(byId('late'), null);
    assert.equal(app.getDomNode(late), null);
    app.renderer.unfreeze(box);
    assert.equal(byId('late').textContent, 'again');
    assert.equal(byId('p').textContent, 'again');
});

test('getBaseSourceNode: from a text node, a nested foreign element, an element of a fragment; null outside', () => {
    const {app, builder, document, byId} = page();
    const outer = sourceTarget(builder.root.div({id: 'outer'}));
    const inner = sourceTarget(builder.wrapSource(outer).p('text', {id: 'inner'}));
    const fragment = new GramlotBuilderBag(null, builder);
    const wrapped = builder.wrapSource(fragment);
    wrapped.span('in fragment', {id: 'frag'});
    app.source.setItem('fragment', fragment);
    const spanNode = fragment.getNodes()[0];
    const foreign = document.createElement('em');
    byId('inner').append(foreign);
    assert.equal(app.getBaseSourceNode(byId('inner').firstChild), inner);
    assert.equal(app.getBaseSourceNode(foreign), inner);
    assert.equal(app.getBaseSourceNode(byId('outer')), outer);
    assert.equal(app.getBaseSourceNode(byId('frag').firstChild), spanNode);
    assert.equal(app.getBaseSourceNode(document.body), null);
});

test('getDomNode: the new element after a rebuild; null for fragment, data-element, removed node', () => {
    const {app, builder, byId} = page();
    const handle = builder.root.div({id: 'd'});
    const node = sourceTarget(handle);
    const before = app.getDomNode(handle);
    assert.strictEqual(before, byId('d'));
    node.setValue(new GramlotBuilderBag(null, builder));
    const after = app.getDomNode(node);
    assert.notStrictEqual(after, before);
    assert.strictEqual(after, byId('d'));
    assert.equal(app.getBaseSourceNode(before), null);
    const fragment = new GramlotBuilderBag(null, builder);
    const fragmentNode = app.source.setItem('fragment', fragment);
    assert.equal(app.getDomNode(fragmentNode), null);
    const setter = sourceTarget(builder.root.dataSetter({destination_path: 'x', value: 1}));
    assert.equal(app.getDomNode(setter), null);
    app.source.popNode(node.label);
    assert.equal(app.getDomNode(node), null);
    assert.equal(app.getBaseSourceNode(after), null);
});

test('getDomNode and getBaseSourceNode give null for a node removed under freeze', () => {
    const {app, builder, byId} = page();
    const box = sourceTarget(builder.root.div({id: 'box'}));
    const child = sourceTarget(builder.wrapSource(box).p('x', {id: 'p'}));
    const element = byId('p');
    app.renderer.freeze(box);
    box.value.popNode(child.label);
    assert.strictEqual(byId('p'), element);
    assert.equal(app.getDomNode(child), null);
    assert.equal(app.getBaseSourceNode(element), null);
});

test('R06: #<node_id> is translated by the map; insertion, removal and in-place node_id change', () => {
    const {app, builder, data, byId} = page();
    data.setItem('t.x', 'target x');
    const target = sourceTarget(builder.root.div({datapath: 't', node_id: 'target'}));
    const sibling = builder.root.p('^#target.x', {id: 'p'});
    assert.equal(app.binding.nodeIds.get('target'), target);
    assert.deepEqual(registered(app, sibling), ['t.x']);
    assert.equal(byId('p').textContent, 'target x');
    assert.equal(sourceTarget(builder.nodeById('target')), target);
    target.setAttr({node_id: 'renamed'});
    assert.equal(app.binding.nodeIds.has('target'), false);
    assert.equal(app.binding.nodeIds.get('renamed'), target);
    assert.deepEqual(registered(app, sibling), ['t.x']);
    assert.equal(app.binding.router.size, 1);
    // As legacy: the next projection of the sibling reads its Source pointer and the old id no longer resolves.
    assert.throws(() => data.setItem('t.x', 'after rename'), {message: '#<id>: cannot resolve ^#target.x'});
    assert.equal(byId('p').textContent, 'target x');
    assert.deepEqual(registered(app, sibling), ['t.x']);
    assert.throws(() => builder.root.span('^#target.x'), /#<id>: cannot resolve \^#target\.x/);
    assert.throws(() => builder.nodeById('target'), /node_id not found: target/);
    app.source.popNode(target.label);
    assert.equal(app.binding.nodeIds.has('renamed'), false);
});

test('R06: a duplicate node_id in a received Source is an explicit error when it enters the map', () => {
    const {app, builder} = page();
    builder.root.div({node_id: 'dup'});
    const other = new GramlotBuilder();
    other.root.div({node_id: 'dup'});
    const received = app.prepareSource(other.toTytx());
    assert.throws(() => app.source.setItem('received', received), /Duplicate node_id 'dup'/);
    const twice = new GramlotBuilderBag(null, builder);
    twice.setItem('a', null, {node_id: 'x'});
    twice.setItem('b', null, {node_id: 'x'});
    assert.throws(() => app.source.setItem('twice', twice), /Duplicate node_id 'x'/);
});

test('a data change reaches only its own registrations: an unrelated write does not project', () => {
    const {app, builder, data} = page();
    builder.root.p('^a', {id: 'p'});
    let projected = 0;
    const project = app.renderer.project.bind(app.renderer);
    app.renderer.project = (...args) => { projected += 1; return project(...args); };
    data.setItem('b', 1);
    data.setItem('b', 2);
    assert.equal(projected, 0);
    data.setItem('a', 1);
    assert.equal(projected, 1);
    const bag = new Bag();
    bag.setItem('a', 2);
    data.setItem('a', bag);
    assert.equal(projected, 2);
});

// Phase 18 (ASTRA-02): `visible` is read from the renderer's resolved projection (`==` included).
test('ASTRA-02: visible from ^, = and == hides the element, at mount and on update', () => {
    const {builder, data, byId} = page();
    data.setItem('show', false);
    const eq = sourceTarget(builder.root.div('x', {id: 'eq', visible: '==false'}));
    const flag = sourceTarget(builder.root.div('x', {id: 'flag', visible: '==shown', shown: '^show'}));
    const read = sourceTarget(builder.root.div('x', {id: 'read', visible: '=show'}));
    const pointer = sourceTarget(builder.root.div('x', {id: 'pointer', visible: '^show'}));
    for (const id of ['eq', 'flag', 'read', 'pointer']) assert.equal(byId(id).style.visibility, 'hidden', id);
    data.setItem('show', true);
    assert.equal(byId('flag').style.visibility, '');
    assert.equal(byId('pointer').style.visibility, '');
    assert.equal(byId('read').style.visibility, 'hidden');
    read.setAttr({title: 'projected again'});
    assert.equal(byId('read').style.visibility, '');
    eq.setAttr({visible: '==true'});
    assert.equal(byId('eq').style.visibility, '');
    flag.setAttr({visible: '==!shown'});
    assert.equal(byId('flag').style.visibility, 'hidden');
    assert.equal(pointer.getAttr('visible'), '^show');
});
