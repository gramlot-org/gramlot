// Phase S04: the DataRouter of source plan §4.5 (trie by segment, levels, `?attr`, R14, R15,
// `fired`, `autocreate`), fed by the one subscription on Builder's Data wrapper.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@jsr/genro__bag';
import {Gramlot} from '../src/index.js';
import {DataChange, DataRegistration, DataRouter} from '../src/binding/router.js';

function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    return {app, data: app.data, router: app.binding.router};
}

/** A recipient that records `[name, evt, path, level]` for every change it receives. */
function recorder(log, name, onReceive = null) {
    return {receive(change) {
        log.push([name, change.evt, change.path, change.level]);
        onReceive?.(change);
    }};
}

/** Register `recipient` on each `path` (`a.b` or `a.b?attr`) and return the registrations by path. */
function registerAll(router, log, paths) {
    return Object.fromEntries(paths.map(spec => {
        const [path, attr = null] = spec.split('?');
        return [spec, router.register({path, attr, recipient: recorder(log, spec)})];
    }));
}

/** Names of the recipients reached, in delivery order. */
const names = log => log.map(([name]) => name);

test('the runtime owns one DataRouter; register returns an active DataRegistration counted by size', () => {
    const {app, router} = page();
    assert.ok(router instanceof DataRouter);
    assert.equal(router.runtime, app.binding);
    const registration = router.register({path: 'a.b', recipient: recorder([], 'x')});
    assert.ok(registration instanceof DataRegistration);
    assert.equal(registration.path, 'a.b');
    assert.equal(registration.attr, null);
    assert.equal(registration.active, true);
    assert.equal(router.size, 1);
    registration.close();
    registration.close();
    assert.equal(registration.active, false);
    assert.equal(router.size, 0);
    assert.throws(() => router.register({path: '', recipient: recorder([], 'x')}), /requires a path/);
});

test('levels: node, container and child reach the exact recipients; a.b and a.bc are different paths', () => {
    const {data, router} = page();
    const log = [];
    registerAll(router, log, ['a', 'a.b', 'a.b.c', 'a.bc', 'other', 'other.b']);
    data.setItem('a.b.c', 1);
    // ins a (autocreate) and ins a.b (autocreate) are ignored; ins c reaches a.b.c at node level
    // and its ancestors a and a.b at level child.
    assert.deepEqual(log, [['a', 'ins', 'a.b.c', 'child'], ['a.b', 'ins', 'a.b.c', 'child'],
        ['a.b.c', 'ins', 'a.b.c', 'node']]);
    log.length = 0;
    data.setItem('a.b.c', 2);
    assert.deepEqual(log, [['a', 'upd_value', 'a.b.c', 'child'], ['a.b', 'upd_value', 'a.b.c', 'child'],
        ['a.b.c', 'upd_value', 'a.b.c', 'node']]);
    log.length = 0;
    data.setItem('a.b', new Bag());
    assert.deepEqual(log, [['a', 'upd_value', 'a.b', 'child'], ['a.b', 'upd_value', 'a.b', 'node'],
        ['a.b.c', 'upd_value', 'a.b', 'container']]);
    log.length = 0;
    data.setItem('a.bc', 3);
    assert.deepEqual(log, [['a', 'ins', 'a.bc', 'child'], ['a.bc', 'ins', 'a.bc', 'node']]);
    log.length = 0;
    data.setItem('unconnected.x', 1);
    data.setItem('unconnected.x', 2);
    assert.deepEqual(log, []);
});

test('the DataChange carries the event fields, the level and the registration', () => {
    const {data, router} = page();
    const changes = [];
    const registration = router.register({path: 'x', recipient: {receive: change => changes.push(change)}});
    data.setItem('x', 1);
    data.setItem('x', 2);
    const [inserted, updated] = changes;
    assert.ok(updated instanceof DataChange);
    assert.equal(inserted.evt, 'ins');
    assert.equal(updated.evt, 'upd_value');
    assert.equal(updated.node, data.getNode('x'));
    assert.equal(updated.path, 'x');
    assert.equal(updated.oldvalue, 1);
    assert.equal(updated.attrsDiff, null);
    assert.equal(updated.fired, false);
    assert.equal(updated.level, 'node');
    assert.equal(updated.registration, registration);
});

test('ins and del carry the parent path; the router adds the node label', () => {
    const {data, router} = page();
    const log = [];
    registerAll(router, log, ['box.item', 'top']);
    data.setItem('box', new Bag());
    data.setItem('box.item', 1);
    data.setItem('top', 1);
    data.getItem('box').popNode('item');
    data.popNode('top');
    assert.deepEqual(log, [
        ['box.item', 'ins', 'box', 'container'], ['box.item', 'ins', 'box.item', 'node'], ['top', 'ins', 'top', 'node'],
        ['box.item', 'del', 'box.item', 'node'], ['top', 'del', 'top', 'node'],
    ]);
});

test('attribute registrations: only their attribute, the node insert and delete, and ancestor replacement (R14)', () => {
    const {data, router} = page();
    const log = [];
    registerAll(router, log, ['cliente.nome?caption', 'cliente.nome?other', 'cliente.nome']);
    data.setItem('cliente.nome', 'Ada', {caption: 'Name'});
    assert.deepEqual(names(log), ['cliente.nome?caption', 'cliente.nome?other', 'cliente.nome']);
    log.length = 0;
    data.getNode('cliente.nome').setAttr({caption: 'Nome'});
    assert.deepEqual(log, [['cliente.nome?caption', 'upd_attrs', 'cliente.nome', 'node']]);
    log.length = 0;
    data.setItem('cliente.nome', 'Bea');
    assert.deepEqual(names(log), ['cliente.nome']);
    log.length = 0;
    data.setItem('cliente', new Bag());
    assert.deepEqual(log, [
        ['cliente.nome?caption', 'upd_value', 'cliente', 'container'],
        ['cliente.nome?other', 'upd_value', 'cliente', 'container'],
        ['cliente.nome', 'upd_value', 'cliente', 'container'],
    ]);
    log.length = 0;
    data.getNode('cliente').setAttr({flag: 1});
    assert.deepEqual(log, []);
    data.popNode('cliente');
    assert.deepEqual(names(log), ['cliente.nome?caption', 'cliente.nome?other', 'cliente.nome']);
    log.length = 0;
    const recreated = new Bag();
    recreated.setItem('nome', 'Cleo', {caption: 'N'});
    data.setItem('cliente', recreated);
    assert.deepEqual(log.map(([name, evt, path, level]) => [name, evt, path, level]), [
        ['cliente.nome?caption', 'ins', 'cliente', 'container'],
        ['cliente.nome?other', 'ins', 'cliente', 'container'],
        ['cliente.nome', 'ins', 'cliente', 'container'],
    ]);
});

test('R14: clear() of the document and of a branch delivers once per removed node', () => {
    const {data, router} = page();
    const log = [];
    data.setItem('s.a', 1);
    data.setItem('s.b', 2);
    data.setItem('t', 3);
    registerAll(router, log, ['s', 's.a', 's.b', 's.b?caption', 't', 'u']);
    data.getItem('s').clear();
    assert.deepEqual(log, [
        ['s', 'del', 's.a', 'child'], ['s.a', 'del', 's.a', 'node'],
        ['s', 'del', 's.b', 'child'], ['s.b', 'del', 's.b', 'node'], ['s.b?caption', 'del', 's.b', 'node'],
    ]);
    log.length = 0;
    data.setItem('s.a', 1);
    log.length = 0;
    data.clear();
    assert.deepEqual(log, [
        ['s', 'del', 's', 'node'], ['s.a', 'del', 's', 'container'], ['s.b', 'del', 's', 'container'],
        ['s.b?caption', 'del', 's', 'container'], ['t', 'del', 't', 'node'],
    ]);
});

test('R14: deleting siblings one by one delivers one del each; replacing a branch one upd_value', () => {
    const {data, router} = page();
    const log = [];
    for (const name of ['a', 'b', 'c']) data.setItem(`list.${name}`, name);
    registerAll(router, log, ['list', 'list.a', 'list.b', 'list.c']);
    data.getItem('list').popNode('a');
    data.getItem('list').popNode('b');
    assert.deepEqual(log, [['list', 'del', 'list.a', 'child'], ['list.a', 'del', 'list.a', 'node'],
        ['list', 'del', 'list.b', 'child'], ['list.b', 'del', 'list.b', 'node']]);
    log.length = 0;
    data.setItem('list', new Bag());
    assert.deepEqual(log, [['list', 'upd_value', 'list', 'node'], ['list.a', 'upd_value', 'list', 'container'],
        ['list.b', 'upd_value', 'list', 'container'], ['list.c', 'upd_value', 'list', 'container']]);
});

test('a fired event reaches node and container registrations and not the child level', () => {
    const {data, router} = page();
    const changes = [];
    for (const path of ['box', 'box.tick', 'box.tick.deep']) {
        router.register({path, recipient: {receive: change => changes.push([path, change.level, change.fired])}});
    }
    data.setItem('box.tick.deep', 0);
    changes.length = 0;
    data.setItem('box.tick', true, null, '>', false, true, true, true);
    assert.deepEqual(changes, [['box.tick', 'node', true], ['box.tick.deep', 'container', true]]);
});

test('one delivery per registration: two registrations of one recipient give two deliveries (R15)', () => {
    const {data, router} = page();
    const log = [];
    const recipient = recorder(log, 'node');
    router.register({path: 'c', recipient});
    router.register({path: 'c.name', recipient});
    data.setItem('c.name', 'x');
    data.setItem('c.name', 'y');
    assert.deepEqual(log, [['node', 'ins', 'c.name', 'child'], ['node', 'ins', 'c.name', 'node'],
        ['node', 'upd_value', 'c.name', 'child'], ['node', 'upd_value', 'c.name', 'node']]);
});

test('nested writes and a removal during a callback: candidates are copied, a closed registration receives nothing', () => {
    const {data, router} = page();
    const log = [];
    let late = null;
    router.register({path: 'x', recipient: recorder(log, 'first', change => {
        if (change.evt === 'upd_value' && change.node.value === 1) {
            late.close();
            data.setItem('y', 'nested');
        }
    })});
    late = router.register({path: 'x', recipient: recorder(log, 'late')});
    router.register({path: 'y', recipient: recorder(log, 'y')});
    data.setItem('x', 0);
    log.length = 0;
    data.setItem('x', 1);
    assert.deepEqual(log, [['first', 'upd_value', 'x', 'node'], ['y', 'ins', 'y', 'node']]);
    assert.equal(router.size, 2);
});

test('only the first segment _root_ is stripped: a user field named _root_ stays in the document Bag', () => {
    const {data, router} = page();
    const log = [];
    registerAll(router, log, ['_root_.x', 'x']);
    data.setItem('_root_.x', 1);
    assert.equal(data.getItem('_root_.x'), 1);
    assert.equal(data.getItem('x'), null);
    assert.deepEqual(log, [['_root_.x', 'ins', '_root_.x', 'node']]);
});

test('events outside _root_ are ignored', () => {
    const {app, router} = page();
    const log = [];
    registerAll(router, log, ['outside', 'x']);
    app.binding.root.setItem('outside', 1);
    app.binding.root.setItem('outside', 2);
    assert.deepEqual(log, []);
});

test('the work of one event does not depend on the unconnected branches', () => {
    const {data, router} = page();
    const log = [];
    for (let i = 0; i < 500; i++) router.register({path: `far.b${i}.x`, recipient: recorder(log, 'far')});
    router.register({path: 'near.x', recipient: recorder(log, 'near')});
    const descriptor = Object.getOwnPropertyDescriptor(DataRegistration.prototype, 'attr');
    let reads = 0;
    Object.defineProperty(DataRegistration.prototype, 'attr', {
        configurable: true, get() { reads += 1; return descriptor.get.call(this); },
    });
    try {
        data.setItem('near.x', 1);
        data.setItem('near.x', 2);
    } finally {
        Object.defineProperty(DataRegistration.prototype, 'attr', descriptor);
    }
    assert.deepEqual(names(log), ['near', 'near']);
    assert.equal(reads, 2);
});
