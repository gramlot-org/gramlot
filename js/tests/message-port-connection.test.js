import test from 'node:test';
import assert from 'node:assert/strict';
import {MessageChannel} from 'node:worker_threads';
import {JSDOM} from 'jsdom';
import {Bag, BagResolver} from '@genrojs/bag';
import {Gramlot} from '../src/index.js';
import {MessagePortStore} from '../src/message-port-store.js';
import {mount} from './fixtures/mount.js';

const wait = async (predicate, message = 'MessagePort delivery timeout') => {
    const end = Date.now() + 3000;
    while (!predicate()) {
        if (Date.now() > end) throw new Error(message);
        await new Promise(resolve => setTimeout(resolve, 5));
    }
};
const settle = () => new Promise(resolve => setTimeout(resolve, 30));

function page(t, build) {
    const window = new JSDOM('<main></main>').window;
    const app = new Gramlot({document: window.document, element: window.document.querySelector('main'), transport: false});
    mount(app, build);
    t.after(() => { app.dispose(); window.close(); });
    return app;
}

/** A store side on one end of a new channel; `posted` records the decoded messages it sends. */
function store(t, bag) {
    const channel = new MessageChannel();
    const posted = [];
    const send = channel.port1.postMessage.bind(channel.port1);
    channel.port1.postMessage = text => { posted.push(Bag.fromTytx(text, 'json').asDict()); send(text); };
    const side = new MessagePortStore(bag, channel.port1);
    t.after(() => { side.close(); channel.port1.close(); channel.port2.close(); });
    return {side, port: channel.port2, posted};
}

test('a named connection receives the snapshot and carries changes both ways', async t => {
    const served = new Bag();
    served.setItem('shared', new Bag({price: 10}), {currency: 'EUR'});
    const app = page(t, root => root.dataBinder({destination_path: 'copy', server_path: 'shared', connection: 'peer'}));
    assert.equal(app.rpc.connection('peer').state, 'waiting');
    const {port} = store(t, served);
    app.rpc.registerConnection('peer', port);
    await wait(() => app.data.getItem('copy.price') === 10);
    assert.equal(app.data.getNode('copy').getAttr('currency'), 'EUR');
    app.data.setItem('copy.price', 15);
    await wait(() => served.getItem('shared.price') === 15);
    served.setItem('shared.name', 'Ada', {caption: 'Name'});
    await wait(() => app.data.getItem('copy.name') === 'Ada');
    assert.equal(app.data.getNode('copy.name').getAttr('caption'), 'Name');
    served.popNode('shared.name');
    await wait(() => app.data.getNode('copy.name') === null);
});

test('the store skips the binder that originated a change and sends it to the others', async t => {
    const served = new Bag();
    served.setItem('shared', new Bag({price: 10}));
    const app = page(t, root => {
        root.dataBinder({destination_path: 'first', server_path: 'shared', connection: 'peer'});
        root.dataBinder({destination_path: 'second', server_path: 'shared', connection: 'peer'});
    });
    const {port, posted} = store(t, served);
    app.rpc.registerConnection('peer', port);
    await wait(() => app.data.getItem('first.price') === 10 && app.data.getItem('second.price') === 10);
    const [first] = posted.filter(message => message.op === 'snapshot').map(message => message.binderId);
    const binders = [...app.rpc.connection('peer').binders.values()];
    const origin = binders.find(binder => binder.clientPath === 'first').id;
    assert.ok([origin, binders.find(binder => binder.clientPath === 'second').id].includes(first));
    posted.length = 0;
    app.data.setItem('first.price', 20);
    await wait(() => app.data.getItem('second.price') === 20);
    await settle();
    assert.equal(served.getItem('shared.price'), 20);
    assert.deepEqual(posted.map(message => message.binderId), [binders.find(binder => binder.clientPath === 'second').id]);
});

test('a new port under the same name subscribes the binders again and leaves the previous store', async t => {
    const old = new Bag(), current = new Bag();
    old.setItem('shared', new Bag({name: 'Old'}));
    current.setItem('shared', new Bag({name: 'New'}));
    const app = page(t, root => root.dataBinder({destination_path: 'copy', server_path: 'shared', connection: 'peer'}));
    const before = store(t, old);
    app.rpc.registerConnection('peer', before.port);
    await wait(() => app.data.getItem('copy.name') === 'Old');
    const after = store(t, current);
    app.rpc.registerConnection('peer', after.port);
    await wait(() => app.data.getItem('copy.name') === 'New');
    await settle();
    before.posted.length = 0;
    old.setItem('shared.name', 'Stale');
    await settle();
    assert.deepEqual(before.posted, []);
    assert.equal(app.data.getItem('copy.name'), 'New');
    app.data.setItem('copy.name', 'Written');
    await wait(() => current.getItem('shared.name') === 'Written');
    assert.equal(old.getItem('shared.name'), 'Stale');
});

test('closed stops the binders, keeps the copy and a later port revives them', async t => {
    const served = new Bag();
    served.setItem('shared', new Bag({name: 'Ada'}));
    const app = page(t, root => root.dataBinder({destination_path: 'copy', server_path: 'shared', connection: 'peer'}));
    const first = store(t, served);
    app.rpc.registerConnection('peer', first.port);
    await wait(() => app.data.getItem('copy.name') === 'Ada');
    first.side.close();
    const connection = app.rpc.connection('peer');
    await wait(() => connection.state === 'closed');
    assert.match(connection.error.message, /closed/);
    assert.equal(connection.port, null);
    assert.doesNotThrow(() => app.data.setItem('copy.name', 'Local'));
    assert.equal(app.data.getItem('copy.name'), 'Local');
    const second = store(t, served);
    app.rpc.registerConnection('peer', second.port);
    await wait(() => app.data.getItem('copy.name') === 'Ada');
    assert.equal(connection.state, 'open');
});

test('the store never runs resolvers: a resolver node travels with its cached value', async t => {
    let calls = 0;
    // Not registered for TYTX: a copy that kept the resolver could not be encoded.
    class Deferred extends BagResolver { load() { calls++; return 7; } }
    const served = new Bag();
    served.setItem('shared', new Bag({name: 'Ada'}));
    served.setItem('shared.lazy', new Deferred());
    const app = page(t, root => root.dataBinder({destination_path: 'copy', server_path: 'shared', connection: 'peer'}));
    const {port} = store(t, served);
    app.rpc.registerConnection('peer', port);
    await wait(() => app.data.getItem('copy.name') === 'Ada');
    const copy = app.data.getNode('copy.lazy');
    assert.ok(copy);
    assert.equal(copy.resolver, null);
    assert.equal(copy.getValue(true), null);
    served.setItem('shared.other', 1);
    await wait(() => app.data.getItem('copy.other') === 1);
    assert.equal(calls, 0);
});

test('a connection name must be literal', t => {
    assert.throws(() => page(t, root => root.dataBinder({destination_path: 'copy', server_path: 'shared', connection: '^name'})),
        /literal name/);
});
