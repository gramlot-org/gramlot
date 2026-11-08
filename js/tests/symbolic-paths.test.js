import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {stringHash} from '../src/builder/source.js';

// The cases shared with tests/test_symbolic_paths.py.
const FIXTURE = JSON.parse(readFileSync(new URL('../../tests/fixtures/symbolic_paths.json', import.meta.url), 'utf8'));

function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    return {app, document, builder: app.src.builder, data: app.data, byId: id => document.getElementById(id)};
}

function build(parent, items) {
    for (const item of items) build(parent.div({node_label: item.label, ...(item.attrs ?? {})}), item.children ?? []);
}

/** Paths registered by the NodeBinding of `node`. */
function registered(app, node) {
    return app.src.binding.bindingFor(sourceTarget(node)).registrations
        .map(registration => registration.attr ? `${registration.path}?${registration.attr}` : registration.path);
}

for (const [kind, make] of [['page runtime', () => page().builder], ['builder without runtime', () => new GramlotBuilder()]]) {
    test(`symbolic resolution, shared cases, ${kind}`, () => {
        const builder = make();
        build(builder.root, FIXTURE.tree);
        for (const item of FIXTURE.cases) {
            const node = builder.source.getNode(item.node);
            const resolve = () => node.absDatapath(item.path, {row: item.row ?? null});
            if (item.error) assert.throws(resolve, error => error.message.includes(item.error), `${item.node}: ${item.path}`);
            else assert.equal(resolve(), item.expect, `${item.node}: ${item.path}`);
        }
    });
}

test('stringHash is the legacy hash', () => {
    assert.equal(stringHash('page.ws3'), 858339576);
    assert.equal(stringHash('é€😀abc'.repeat(50)), 2111466368);
});

test('the attributes of the symbolic resolution do not reach the DOM', () => {
    const {builder, document} = page();
    build(builder.root, FIXTURE.tree);
    const html = document.querySelector('main').innerHTML;
    for (const name of ['_workspace', 'childname', '_aliasDatapaths', '_workspace_path']) assert.equal(html.toLowerCase().includes(name.toLowerCase()), false, name);
});

for (const [aliases, message] of [[{ROW: 'x'}, "'ROW' is not an alias name"], [{'a.b': 'x'}, "'a.b' is not an alias name"], [{A: ''}, "alias 'A' requires a path"]]) {
    test(`alias declarations are checked: ${message}`, () => {
        const builder = new GramlotBuilder();
        const node = builder.root.div({_aliasDatapaths: aliases});
        assert.throws(() => node.absDatapath('#A.x'), {message: new RegExp(message.replace('.', '\\.'))});
        assert.throws(() => page().builder.root.div({_aliasDatapaths: aliases}), {message: new RegExp(message.replace('.', '\\.'))});
    });
}

test('two declarations of an alias are an error', () => {
    const builder = new GramlotBuilder();
    builder.root.div({_aliasDatapaths: {A: 'one'}});
    const node = builder.root.div({_aliasDatapaths: {A: 'two'}});
    assert.throws(() => node.absDatapath('#A.x'), {message: "Duplicate alias 'A'"});
    const live = page().builder;
    live.root.div({_aliasDatapaths: {A: 'one'}});
    assert.throws(() => live.root.div({_aliasDatapaths: {A: 'two'}}), {message: "Duplicate alias 'A'"});
});

test('_workspace requires true or a name', () => {
    const leaf = new GramlotBuilder().root.div({_workspace: false}).div();
    assert.throws(() => leaf.absDatapath('#WORKSPACE.a'), /_workspace must be true or a name/);
});

test('getChild returns null for a missing step', () => {
    const builder = new GramlotBuilder();
    build(builder.root, FIXTURE.tree);
    const box = builder.source.getNode('box');
    assert.equal(box.getChild('top/inner').label, 'named');
    assert.equal(box.getChild('top/missing'), null);
    assert.equal(box.getChild('hidden'), null);
});

// Registrations whose start can move: no delivery on the old path after the start changed.

test('#<nodeId>: a change of the target context moves the pointers that start from it', () => {
    const {app, builder, data, byId} = page();
    data.setItem('t1.x', 'one');
    data.setItem('t2.x', 'two');
    const target = sourceTarget(builder.root.div({datapath: 't1', nodeId: 'target'}));
    const sibling = builder.root.p('^#target.x', {id: 'p'});
    target.setAttr({datapath: 't2'});
    assert.deepEqual(registered(app, sibling), ['t2.x']);
    assert.equal(byId('p').textContent, 'two');
    data.setItem('t1.x', 'stale');
    assert.equal(byId('p').textContent, 'two');
    data.setItem('t2.x', 'two again');
    assert.equal(byId('p').textContent, 'two again');
});

test('#<nodeId>: a target with a variable datapath moves the pointers when the Data path changes', () => {
    const {app, builder, data, byId} = page();
    data.setItem('a.x', 'A');
    data.setItem('b.x', 'B');
    data.setItem('sel', 'a');
    builder.root.div({datapath: '^sel', nodeId: 'target'});
    const sibling = builder.root.p('^#target.x', {id: 'p'});
    assert.equal(byId('p').textContent, 'A');
    data.setItem('sel', 'b');
    assert.deepEqual(registered(app, sibling), ['b.x']);
    assert.equal(byId('p').textContent, 'B');
    data.setItem('a.x', 'stale');
    assert.equal(byId('p').textContent, 'B');
});

test('#<nodeId>: removal of the target leaves no registration; its return restores the pointer', () => {
    const {app, builder, data, byId} = page();
    data.setItem('t.x', 'T');
    data.setItem('u.x', 'U');
    const target = sourceTarget(builder.root.div({datapath: 't', nodeId: 'target'}));
    const sibling = builder.root.p('^#target.x', {id: 'p'});
    assert.throws(() => app.src.source.popNode(target.label), {message: '#<id>: cannot resolve ^#target.x'});
    assert.deepEqual(registered(app, sibling), []);
    data.setItem('t.x', 'stale');
    assert.equal(byId('p').textContent, 'T');
    builder.root.div({datapath: 'u', nodeId: 'target'});
    assert.deepEqual(registered(app, sibling), ['u.x']);
    assert.equal(byId('p').textContent, 'U');
});

test('a datapath that starts from a nodeId moves its whole branch with the target', () => {
    const {app, builder, data, byId} = page();
    data.setItem('t1.rec.x', 'one');
    data.setItem('t2.rec.x', 'two');
    const target = sourceTarget(builder.root.div({datapath: 't1', nodeId: 'target'}));
    const leaf = builder.root.div({datapath: '#target.rec'}).div().p('^.x', {id: 'p'});
    target.setAttr({datapath: 't2'});
    assert.deepEqual(registered(app, leaf), ['t2.rec.x']);
    assert.equal(byId('p').textContent, 'two');
});

test('#<nodeId>/<childname>: a change of the named child moves the pointer; a lost name is an error', () => {
    const {app, builder, data, byId} = page();
    data.setItem('box.a.x', 'A');
    data.setItem('box.b.x', 'B');
    const box = builder.root.div({datapath: 'box', nodeId: 'box'});
    const first = sourceTarget(box.div({datapath: '.a', childname: 'top'}));
    const second = sourceTarget(box.div({datapath: '.b'}));
    const reader = builder.root.p('^#box/top.x', {id: 'p'});
    assert.equal(byId('p').textContent, 'A');
    first.setAttr({datapath: '.b'});
    assert.deepEqual(registered(app, reader), ['box.b.x']);
    first.setAttr({datapath: '.a'});
    assert.throws(() => first.setAttr({childname: 'other'}), {message: "#<id>: no child 'top' for ^#box/top.x"});
    assert.deepEqual(registered(app, reader), []);
    second.setAttr({childname: 'top'});
    assert.deepEqual(registered(app, reader), ['box.b.x']);
    assert.equal(byId('p').textContent, 'B');
    data.setItem('box.a.x', 'stale');
    assert.equal(byId('p').textContent, 'B');
});

test('aliases: a change of the declaration or of its node context moves the pointers', () => {
    const {app, builder, data, byId} = page();
    data.setItem('c1.local.x', 'one');
    data.setItem('c2.local.x', 'two');
    data.setItem('g.x', 'global');
    const owner = sourceTarget(builder.root.div({datapath: 'c1', _aliasDatapaths: {CFG: '.local'}}));
    const reader = builder.root.p('^#CFG.x', {id: 'p'});
    assert.equal(byId('p').textContent, 'one');
    owner.setAttr({datapath: 'c2'});
    assert.deepEqual(registered(app, reader), ['c2.local.x']);
    assert.equal(byId('p').textContent, 'two');
    owner.setAttr({_aliasDatapaths: {CFG: 'g'}});
    assert.deepEqual(registered(app, reader), ['g.x']);
    assert.equal(byId('p').textContent, 'global');
    data.setItem('c2.local.x', 'stale');
    assert.equal(byId('p').textContent, 'global');
});

test('aliases: an alias that enters later hides a nodeId of the same name, as legacy', () => {
    const {app, builder, data, byId} = page();
    data.setItem('t.x', 'node');
    data.setItem('s.x', 'alias');
    builder.root.div({datapath: 't', nodeId: 'X'});
    const reader = builder.root.p('^#X.x', {id: 'p'});
    assert.equal(byId('p').textContent, 'node');
    const owner = sourceTarget(builder.root.div({_aliasDatapaths: {X: 's'}}));
    assert.deepEqual(registered(app, reader), ['s.x']);
    assert.equal(byId('p').textContent, 'alias');
    app.src.source.popNode(owner.label);
    assert.deepEqual(registered(app, reader), ['t.x']);
    assert.equal(byId('p').textContent, 'node');
});

test('#WORKSPACE: a change of the owner name or of _workspace_path moves the branch', () => {
    const {app, builder, data, byId} = page();
    data.setItem('_gramlot.workspace.one.x', 'one');
    data.setItem('_gramlot.workspace.two.x', 'two');
    data.setItem('own.private.x', 'private');
    const owner = sourceTarget(builder.root.div({datapath: 'own', _workspace: 'one'}));
    const leaf = builder.wrapSource(owner).div().p('^#WORKSPACE.x', {id: 'p'});
    assert.equal(byId('p').textContent, 'one');
    owner.setAttr({_workspace: 'two'});
    assert.deepEqual(registered(app, leaf), ['_gramlot.workspace.two.x']);
    owner.setAttr({_workspace_path: '.private'});
    assert.deepEqual(registered(app, leaf), ['own.private.x']);
    assert.equal(byId('p').textContent, 'private');
    data.setItem('_gramlot.workspace.two.x', 'stale');
    assert.equal(byId('p').textContent, 'private');
});

test('#ROW cannot be registered: a ^#ROW pointer on a Source node is an explicit error', () => {
    const {app, builder} = page();
    const grid = builder.root.div({storepath: 'rows', rowMode: 'values'});
    assert.throws(() => grid.p('^#ROW.price'), {message: '#ROW: no row context for ^#ROW.price'});
    assert.equal(app.src.binding.router.size, 0);
});
