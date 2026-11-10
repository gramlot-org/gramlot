import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot} from '../src/index.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';

function page(t) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false, collections: [], locale: 'en-US'});
    t.after(() => { app.dispose(); window.close(); });
    const rows = new Bag();
    for (const [key, v, kind] of [['r1', 1, 'a'], ['r2', 2, 'b'], ['r3', 3, 'a']]) rows.setItem(key, null, {v, kind});
    app.data.setItem('model.rows', rows);
    return {app, rows, binding: app.src.binding};
}
const labels = view => view.getRows().map(node => node.label);

test('collection stores are keyed by absolute path and rowMode, not by Bag identity', t => {
    const {app, binding} = page(t);
    const store = binding.collectionStore('model.rows', 'attributes');
    assert.equal(binding.collectionStore('model.rows', 'attributes'), store);
    assert.notEqual(binding.collectionStore('model.rows', 'values'), store, 'rowMode is part of the key');
    assert.equal(store.path, 'model.rows');
    assert.equal(Object.hasOwn(store, 'bag'), false);
    assert.equal('bag' in store, false, 'the store keeps the address, not the collection Bag');
    const replacement = new Bag(); replacement.setItem('x', null, {v: 9});
    app.data.setItem('model.rows', replacement);
    assert.equal(binding.collectionStore('model.rows', 'attributes'), store, 'a replacement keeps the store');
    assert.deepEqual(store.getRows().map(node => node.label), ['x']);
    assert.throws(() => binding.collectionStore('', 'attributes'), /Data path/);
});

test('a replacement at the store path notifies the store before the router and keeps the view sort and filter', t => {
    const {app, binding} = page(t);
    const store = binding.collectionStore('model.rows', 'attributes');
    const view = new BagCollectionView(store); view.connect();
    t.after(() => view.disconnect());
    view.sort('v:d');
    view.applyColumnFilter('kind', ['a']);
    assert.deepEqual(labels(view), ['r3', 'r1']);
    const order = [];
    store.subscribe(change => order.push(['store', change.full]));
    const registration = binding.router.register({path: 'model.rows', subtree: true, recipient: {receive: () => order.push(['router'])}});
    t.after(() => registration.close());
    const replacement = new Bag();
    for (const [key, v, kind] of [['r1', 10, 'a'], ['r4', 40, 'a'], ['r2', 20, 'b']]) replacement.setItem(key, null, {v, kind});
    app.data.setItem('model.rows', replacement);
    assert.deepEqual(order, [['store', true], ['router']], 'the store reconciles before the router consumers');
    assert.deepEqual(labels(view), ['r4', 'r1'], 'sort and filter apply to the Bag now at the path');
    assert.equal(view.getRows()[0], replacement.getNode('r4'));
});

test('ancestor replacements, row events and non-Bag values reach the store by path', t => {
    const {app, binding} = page(t);
    const store = binding.collectionStore('model.rows', 'attributes');
    const notices = [];
    store.subscribe(change => notices.push(change));
    app.data.getNode('model.rows.r2').setAttr({v: 22});
    assert.equal(notices.length, 1);
    assert.equal(notices[0].full, false);
    assert.equal(notices[0].rows[0], app.data.getNode('model.rows.r2'));
    app.data.getItem('model.rows').setItem('r9', null, {v: 9});
    assert.equal(notices.at(-1).full, true, 'a row insertion changes the row list');
    const model = new Bag(); const rows = new Bag(); rows.setItem('n', null, {v: 1}); model.setItem('rows', rows);
    app.data.setItem('model', model);
    assert.equal(notices.at(-1).full, true, 'an ancestor replacement is a full change');
    assert.deepEqual(store.getRows().map(node => node.label), ['n']);
    app.data.getNode('model').setAttr({note: 'x'});
    const count = notices.length;
    app.data.setItem('other', 1);
    assert.equal(notices.length, count, 'unrelated paths do not reach the store');
    assert.doesNotThrow(() => app.data.setItem('model.rows', 'scalar'));
    assert.equal(notices.length, count, 'a path without a Bag notifies nothing');
    assert.throws(() => store.getRows(), /requires a Bag at model.rows/);
});
