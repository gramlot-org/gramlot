import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Gramlot} from '../src/index.js';
import {mount} from './fixtures/mount.js';

function page(t, build, {open = true} = {}) {
    const window = new JSDOM('<main></main>', {url: 'http://localhost/py/'}).window;
    let socket;
    window.WebSocket = class extends window.EventTarget {
        readyState = 0;
        messages = [];
        constructor(url) { super(); this.url = url; socket = this; }
        send(text) { this.messages.push(fromTytx(text)); }
        close() { this.readyState = 3; }
        open() { this.readyState = 1; this.dispatchEvent(new window.Event('open')); }
        receive(message) { this.dispatchEvent(new window.MessageEvent('message', {data: toTytx({pageId: 'page-one', ...message})})); }
    };
    const app = new Gramlot({document: window.document, element: window.document.querySelector('main'),
        pageId: 'page-one', websocketUrl: '/py/gramlot/store',
        transport: {close() {}, dispose() {}, call() { throw new Error('Unexpected HTTP RPC'); }}});
    const result = mount(app, build);
    if (open) socket.open();
    t.after(() => { app.dispose(); window.close(); });
    return {app, socket, result};
}

function snapshot(socket, subscription, value) {
    socket.receive({op: 'snapshot', binderId: subscription.binderId, path: '', value, attr: {}, exists: true});
}

test('one socket registers two Source binders, initializes their relative client paths and sends local changes', t => {
    const {app, socket} = page(t, root => {
        const pane = root.div({datapath: 'view'});
        pane.dataBinder({destination_path: '.first', server_path: 'saas.dart'});
        pane.dataBinder({destination_path: '.second', server_path: 'saas.dart'});
    });
    assert.equal(socket.url, 'ws://localhost/py/gramlot/store?pageId=page-one');
    assert.equal(socket.messages.length, 2);
    const [a, b] = socket.messages;
    assert.notEqual(a.binderId, b.binderId);
    snapshot(socket, a, new Bag({price: 10}));
    snapshot(socket, b, new Bag({price: 10}));
    assert.equal(socket.messages.length, 2);
    assert.equal(app.data.getItem('view.first.price'), 10);
    app.data.setItem('view.first.price', 15, {currency: 'EUR'});
    const sent = socket.messages.at(-1);
    assert.equal(sent.binderId, a.binderId);
    assert.equal(sent.path, 'price');
    assert.equal(sent.pageId, 'page-one');
    socket.receive({...sent, binderId: b.binderId});
    assert.equal(app.data.getItem('view.second.price'), 15);
    assert.equal(socket.messages.length, 3);
});

test('server changes activate local controllers; their derived writes are new outgoing changes', t => {
    const {app, socket} = page(t, root => {
        root.dataBinder({destination_path: 'order', server_path: 'server.order'});
        root.dataController({script: 'this.SET("order.doubled", quantity * 2)', quantity: '^order.quantity'});
    });
    const a = socket.messages[0];
    snapshot(socket, a, new Bag({quantity: 2}));
    assert.equal(app.data.getItem('order.doubled'), 4);
    assert.equal(socket.messages.at(-1).path, 'doubled');
    const count = socket.messages.length;
    socket.receive({op: 'change', binderId: a.binderId, path: 'quantity', evt: 'upd_value', value: 3, attr: {}});
    assert.equal(app.data.getItem('order.doubled'), 6);
    assert.equal(socket.messages.length, count + 1);
    assert.equal(socket.messages.at(-1).path, 'doubled');
});

test('attributes and deletions propagate without echo and preserve the current value', t => {
    const {app, socket} = page(t, root => root.dataBinder({destination_path: 'copy', server_path: 'server'}));
    const a = socket.messages[0];
    snapshot(socket, a, new Bag({price: 10}));
    socket.receive({op: 'change', binderId: a.binderId, path: 'price',
        evt: 'upd_attrs', value: null, attr: {currency: 'EUR', optional: null}});
    assert.equal(app.data.getItem('copy.price'), 10);
    assert.deepEqual(app.data.getNode('copy.price').attr, {currency: 'EUR', optional: null});
    assert.equal(socket.messages.length, 1);
    app.data.getNode('copy.price').setAttr({currency: 'USD'});
    assert.equal(socket.messages.at(-1).evt, 'upd_attrs');
    socket.receive({op: 'change', binderId: a.binderId, path: 'price', evt: 'del'});
    assert.equal(app.data.getNode('copy.price'), null);
    assert.equal(socket.messages.length, 2);
});

test('removing the Source node unregisters only its binder and ignores late messages', t => {
    const {app, socket, result: node} = page(t, root => root.dataBinder({destination_path: 'copy', server_path: 'server'}));
    const a = socket.messages[0];
    snapshot(socket, a, new Bag({price: 10}));
    node.parentBag.popNode(node.label);
    assert.equal(socket.messages.at(-1).op, 'unsubscribe');
    const count = socket.messages.length;
    app.data.setItem('copy.price', 30);
    snapshot(socket, a, new Bag({price: 99}));
    assert.equal(app.data.getItem('copy.price'), 30);
    assert.equal(socket.messages.length, count);
});

test('replacing a client ancestor sends the mapped subtree, not the ancestor', t => {
    const {app, socket} = page(t, root => root.dataBinder({destination_path: 'view.copy', server_path: 'server'}));
    snapshot(socket, socket.messages[0], new Bag({price: 10}));
    app.data.setItem('view', new Bag({copy: new Bag({price: 20}), unrelated: 'private'}));
    const sent = socket.messages.at(-1);
    assert.equal(sent.path, '');
    assert.equal(sent.value.getItem('price'), 20);
    assert.equal(sent.value.getItem('unrelated'), null);
});

test('reactive datapath closes the old subscription and ignores its late snapshot', t => {
    const {app, socket} = page(t, root => {
        root.dataSetter({destination_path: 'selected', value: 'first'});
        root.dataBinder({destination_path: '.copy', server_path: 'server', datapath: '^selected'});
    });
    const old = socket.messages[0];
    snapshot(socket, old, new Bag({price: 10}));
    app.data.setItem('selected', 'second');
    assert.equal(socket.messages.at(-2).op, 'unsubscribe');
    const current = socket.messages.at(-1);
    assert.equal(current.op, 'subscribe');
    assert.notEqual(current.binderId, old.binderId);
    snapshot(socket, old, new Bag({price: 99}));
    snapshot(socket, current, new Bag({price: 20}));
    assert.equal(app.data.getItem('first.copy.price'), 10);
    assert.equal(app.data.getItem('second.copy.price'), 20);
});

test('server publication keeps sender identity, snapshots and correlated ok/error outcomes', async t => {
    const {app, socket} = page(t, root => root.div());
    let local = 0;
    app.subscribe('load', payload => {
        assert.equal(socket.messages.length, local);
        local++;
        payload.record.setItem('name', 'changed locally');
    });
    const payload = () => ({record: new Bag({name: 'original', day: new Date('2026-10-27')})});
    const first = app.publish({topic: 'load', server: true}, payload());
    assert.equal(socket.messages[0].pageId, 'page-one');
    assert.equal('targetPageId' in socket.messages[0], false);
    assert.equal(typeof socket.messages[0].id, 'string');
    assert.equal(socket.messages[0].payload.record.getItem('name'), 'original');
    assert.ok(socket.messages[0].payload.record.getItem('day') instanceof Date);
    const second = app.publish({topic: 'load', server: true, pageId: 'another-page'}, payload());
    const denied = assert.rejects(second, {name: 'RpcError', code: 'page_expired', message: 'Access refused'});
    assert.equal(socket.messages[1].pageId, 'page-one');
    assert.equal(socket.messages[1].targetPageId, 'another-page');
    assert.equal(local, 2);
    assert.notEqual(socket.messages[0].id, socket.messages[1].id);
    socket.receive({id: socket.messages[1].id, contentType: 'data',
        error: {code: 'page_expired', name: 'PageExpired', message: 'Access refused'}});
    socket.receive({id: socket.messages[0].id, contentType: 'data', value: 'ok'});
    await denied;
    assert.equal(await first, 'ok');
    assert.equal(app._pageStore.calls.size, 0);
    assert.equal(app._pageStore.closed, false);
});

test('server publication preflights readiness and refuses invalid routes before local delivery', t => {
    const {app, socket} = page(t, root => root.div(), {open: false});
    let local = 0;
    app.subscribe('run', () => local++);
    assert.throws(() => app.publish({topic: 'run', server: true}), /not connected/);
    socket.open();
    for (const descriptor of [
        {topic: 'run', server: 'true'}, {topic: 'run', server: true, pageId: ''},
        {topic: 'run', server: true, iframe: 'child'}, {topic: 'run', server: true, parent: true},
        {topic: 'run', server: true, nodeId: 'node'},
    ]) assert.throws(() => app.publish(descriptor));
    assert.throws(() => app.publish({topic: 'run', server: true}, {node: app.src.source.getNode('main')}), /Live Source/);
    assert.equal(local, 0);
    assert.equal(socket.messages.length, 0);
    app._pageStore.close();
    assert.throws(() => app.publish({topic: 'run', server: true}), /not connected/);
    assert.equal(local, 0);
});

