import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {toTytx, fromTytx} from '@genrojs/tytx';
import {TreeStore, TreeStoreLogic, TreeStoreResolver} from '../src/tree-store.js';

test('favorites persist per table, restore their attributes and toggle only leaves', async () => {
    const {JSDOM} = await import('jsdom');
    const {window} = new JSDOM('', {url: 'http://localhost/'});
    const logic = new TreeStoreLogic();
    logic.page = {src: {renderer: {destination: window.document.body}}};
    const state = new Bag();
    const node = {getRelativeData: () => state};
    const favoriteKey = 'gramlot.relationTree.favorites.v1:app.customer';
    const root = new Bag();
    root.setItem('name', null, {fieldpath: 'name', caption: 'Name', fullcaption: 'Customer.Name', dtype: 'T'});
    root.setItem('branch', new Bag());
    logic.treeFavoritesMount(node, {favoriteKey});
    logic.treeFavoriteToggle(node, {item: root.getNode('branch'), path: 'branch', favoriteKey});
    assert.equal(window.localStorage.getItem(favoriteKey), null);
    logic.treeFavoriteToggle(node, {item: root.getNode('name'), path: 'name', favoriteKey});
    assert.equal(state.getItem('favorites').length, 1);
    assert.equal(fromTytx(window.localStorage.getItem(favoriteKey))[0].fieldpath, 'name');
    const reloaded = new Bag();
    const reloadNode = {getRelativeData: () => reloaded};
    logic.treeFavoritesMount(reloadNode, {favoriteKey});
    const favorite = reloaded.getItem('favorites').getNode('favorite_0');
    assert.equal(favorite.getAttr('fullcaption'), 'Customer.Name');
    assert.equal(favorite.getAttr('originalPath'), 'name');
    const old = new Bag();
    logic.setTreeFavorites(old, [{fieldpath: 'name', path: 'name', caption: '!!Name',
        attrs: {fieldpath: 'name', caption: '!!Name', fullcaption: '!![it]Customer.!!Name', name_long: '!!Name'}}]);
    assert.equal(old.getNode('favorites.favorite_0').getAttr('fullcaption'), 'Customer.Name');
    assert.equal(old.getNode('favorites.favorite_0').getAttr('name_long'), '!!Name');
    const other = new Bag();
    logic.treeFavoritesMount({getRelativeData: () => other}, {favoriteKey: `${favoriteKey}.other`});
    assert.equal(other.getItem('favorites').length, 0);
    logic.treeFavoriteToggle(reloadNode, {item: favorite, path: 'favorite_0', favoriteKey});
    assert.equal(reloaded.getItem('favorites').length, 0);
    assert.deepEqual(fromTytx(window.localStorage.getItem(favoriteKey)), []);
    window.localStorage.setItem(favoriteKey, '{}');
    assert.throws(() => logic.treeFavoritesMount(reloadNode, {favoriteKey}), /must be an array/);
    window.close();
});

test('favorite action state hides branches and identifies a saved field', () => {
    const logic = new TreeStoreLogic();
    const nodes = new Bag();
    nodes.setItem('name', null, {fieldpath: 'name'});
    nodes.setItem('group', new Bag());
    nodes.setItem('relation', new TreeStoreResolver());
    const state = new Bag();
    assert.deepEqual(logic.treeFavoriteActionState(null, {item: nodes.getNode('name'), state}),
        {hidden: false, icon: '♡', title: 'Add favorite'});
    assert.equal(logic.treeFavoriteActionState(null, {item: nodes.getNode('group'), state}).hidden, true);
    assert.equal(logic.treeFavoriteActionState(null, {item: nodes.getNode('relation'), state}).hidden, true);
    state.setItem('saved', null, {fieldpath: 'name'});
    assert.deepEqual(logic.treeFavoriteActionState(null, {item: nodes.getNode('name'), state}),
        {hidden: false, icon: '♥', title: 'Remove favorite'});
});

test('resolver inside a static group binds and loads using its visible path', async () => {
    const paths = [];
    const app = {rpc: {call: async (_kind, _method, args) => {
        paths.push(args.path);
        const result = new Bag();
        if (!args.path) {
            const group = new Bag();
            group.setItem('branch', new TreeStoreResolver());
            result.setItem('group', group);
        } else result.setItem('leaf', null);
        return result;
    }}};
    const store = new TreeStore({gramlot: app, method: 'children'});
    const root = await store.load();
    const value = await root.getNode('group.branch').getValue();
    assert.ok(value.getNode('leaf'));
    assert.deepEqual(paths, ['', 'group.branch']);
    store.dispose();
});

test('a resolved branch can contain a grouped lazy branch', async () => {
    const paths = [];
    const app = {rpc: {call: async (_kind, _method, args) => {
        paths.push(args.path);
        const result = new Bag();
        if (!args.path) result.setItem('branch', new TreeStoreResolver());
        else if (args.path === 'branch') {
            const group = new Bag();
            group.setItem('nested', new TreeStoreResolver());
            result.setItem('group', group);
        } else result.setItem('leaf', null);
        return result;
    }}};
    const store = new TreeStore({gramlot: app, method: 'children'});
    const root = await store.load();
    const branch = await root.getNode('branch').getValue();
    const nested = await branch.getNode('group.nested').getValue();
    assert.ok(nested.getNode('leaf'));
    assert.deepEqual(paths, ['', 'branch', 'branch.group.nested']);
    store.dispose();
});

test('one store method loads only opened branches with node context', async () => {
    const calls = [];
    const app = {rpc: {call: async (kind, method, params) => {
        calls.push({kind, method, params});
        const bag = new Bag();
        if (!params.path) bag.setItem('folder', new TreeStoreResolver(), {caption: 'Folder', checked: true});
        else bag.setItem('leaf', null, {caption: 'Leaf'});
        return fromTytx(toTytx(bag));
    }}};
    const store = new TreeStore({gramlot: app, method: 'children', params: {root: 'demo'}});
    const bag = await store.load();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].params.path, '');
    const node = bag.getNode('folder');
    const children = await node.getValue();
    assert.equal(children.getNode('leaf').attr.caption, 'Leaf');
    assert.deepEqual(calls[1].params, {root: 'demo', path: 'folder', label: 'folder',
        attributes: {caption: 'Folder', checked: true}});
    node.setAttr({checked: false});
    await node.getValue();
    assert.equal(calls.length, 2);
    store.dispose();
});

test('disposed store rejects calls and requires a Bag result', async () => {
    const store = new TreeStore({gramlot: {rpc: {call: async () => []}}, method: 'children'});
    await assert.rejects(store.load(), /must return a Bag/);
    store.dispose();
    await assert.rejects(store.load(), {name: 'AbortError'});
});

test('Python composition mounts a store and renders its root', async t => {
    const {JSDOM} = await import('jsdom');
    const {Gramlot} = await import('../src/index.js');
    const {TreeStoreLogic} = await import('../src/tree-store.js');
    const tree = (await import('../src/components/tree.js')).default;
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false, collections: [tree]});
    t.after(() => {app.dispose(); window.close();});
    app.src.logicRegistry.register(TreeStoreLogic, {resource: 'test:tree-store'});
    const paths = [];
    app.rpc.call = async (kind, method, params) => {
        paths.push(params.path);
        assert.equal(params.table, 'app.customer');
        const bag = new Bag();
        if (!params.path) bag.setItem('folder', new TreeStoreResolver());
        else bag.setItem('leaf', null);
        return bag;
    };
    const {execFileSync} = await import('node:child_process');
    const {fileURLToPath} = await import('node:url');
    const grammar = fileURLToPath(new URL('../../src/gramlot/collections/tree.json', import.meta.url));
    const source = execFileSync('python3', ['-c', `
import json, sys
from gramlot import GramlotBuilder
from gramlot.page import tree_store
with open(sys.argv[1]) as f: tree = json.load(f)
b = GramlotBuilder(collections=[tree])
tree_store(b.root, datapath='demo', method='children', params={'table': 'app.customer'})
print(b.to_tytx())
`, grammar], {encoding: 'utf8'}).trim();
    app.src.startSource(source);
    await new Promise(resolve => setTimeout(resolve, 20));
    const row = window.document.querySelector('gramlot-tree').shadowRoot.querySelector('[data-path="folder"]');
    assert.ok(row);
    assert.ok(row.querySelector('button'));
    assert.deepEqual(paths, ['']);
    assert.ok(app.data.getNode('demo.store').resolver instanceof TreeStoreResolver);
    row.querySelector('button').click();
    await new Promise(resolve => setTimeout(resolve, 20));
    assert.ok(window.document.querySelector('gramlot-tree').shadowRoot.querySelector('[data-path="folder.leaf"]'));
    assert.deepEqual(paths, ['', 'folder']);
});

test('Python Bag resolver descriptions decode inertly and bind to the owning store', async () => {
    const {execFileSync} = await import('node:child_process');
    const wire = execFileSync('python3', ['-c', `
from genro_bag import Bag
from genro_tytx import to_tytx
from gramlot.tree_store import TreeStoreResolver
bag = Bag()
bag.set_item('branch', TreeStoreResolver(), caption='From Python')
print(to_tytx(bag))
`], {encoding: 'utf8'}).trim();
    const root = fromTytx(wire);
    assert.ok(root.getNode('branch').resolver instanceof TreeStoreResolver);
    let calls = 0;
    const app = {rpc: {call: async (kind, method, args) => {
        calls++;
        if (!args.path) return root;
        const bag = new Bag(); bag.setItem('child', null); return bag;
    }}};
    const store = new TreeStore({gramlot: app, method: 'children'});
    await store.load();
    assert.equal(calls, 1);
    const child = await root.getNode('branch').getValue();
    assert.ok(child.getNode('child'));
    assert.equal(calls, 2);
    store.dispose();
});

test('concurrent reads of a branch share one request', async () => {
    let finish;
    let calls = 0;
    const app = {rpc: {call: async (kind, method, args) => {
        calls++;
        if (!args.path) { const bag = new Bag(); bag.setItem('branch', new TreeStoreResolver()); return bag; }
        return new Promise(resolve => { finish = resolve; });
    }}};
    const store = new TreeStore({gramlot: app, method: 'children'});
    const root = await store.load();
    const node = root.getNode('branch');
    const first = node.getValue(), second = node.getValue();
    assert.equal(calls, 2);
    finish(new Bag({leaf: 1}));
    await Promise.all([first, second]);
    assert.equal(calls, 2);
    store.dispose();
});

test('nested resolver uses its current store-relative path', async () => {
    const paths = [];
    const app = {rpc: {call: async (kind, method, args) => {
        paths.push(args.path);
        const bag = new Bag();
        if (!args.path) bag.setItem('first', new TreeStoreResolver());
        else if (args.path === 'first') bag.setItem('second', new TreeStoreResolver());
        else bag.setItem('leaf', null);
        return bag;
    }}};
    const store = new TreeStore({gramlot: app, method: 'children'});
    const root = await store.load();
    const first = await root.getNode('first').getValue();
    await first.getNode('second').getValue();
    assert.deepEqual(paths, ['', 'first', 'first.second']);
    store.dispose();
});

test('moving an unresolved branch changes the path sent to the loader', async () => {
    const paths = [];
    const app = {rpc: {call: async (kind, method, args) => {
        paths.push(args.path);
        const bag = new Bag();
        if (!args.path) {
            bag.setItem('branch', new TreeStoreResolver());
            bag.setItem('folder', new Bag());
        }
        return bag;
    }}};
    const store = new TreeStore({gramlot: app, method: 'children'});
    const root = await store.load();
    const old = root.popNode('branch');
    root.getItem('folder').setItem('moved', old.resolver, old.attr);
    await root.getNode('folder.moved').getValue();
    assert.deepEqual(paths, ['', 'folder.moved']);
    store.dispose();
});
