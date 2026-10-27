import test from 'node:test';
import assert from 'node:assert/strict';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {FrameMessages} from '../src/frame-messages.js';
import {PageStoreConnection} from '../src/page-store-connection.js';
import {RpcHandler} from '../src/handlers/rpc-handler.js';
import {WebSocketTransport} from '../src/websocket-transport.js';

function fixture(t, parent = null) {
    const windows = [];
    const frames = [];
    const disposers = [];
    const window = new EventTarget();
    Object.assign(window, {parent: parent ?? window, opener: null,
        location: {origin: 'http://test'}, console: {error() {}},
        setInterval(fn) { this.watch = fn; return 1; }, clearInterval() { this.watch = null; },
        messages: [], postMessage(message, origin) { this.messages.push({message, origin}); }});
    window.WebSocket = class extends EventTarget {
        messages = [];
        constructor() { super(); windows.push(this); }
        send(wire) { this.messages.push(fromTytx(wire)); }
        close() { this.closed = true; }
    };
    const document = Object.assign(new EventTarget(), {defaultView: window, baseURI: 'http://test/py/',
        referrer: 'http://test/py/', getElementsByTagName: () => frames});
    const app = {pageId: 'primary', state: 'started', dom: {getBaseSourceNode: frame => frame.node, getDomNode: node => node.frame},
        src: {binding: {bindingFor: () => ({track(fn) { disposers.push(fn); return () => {}; }})}}};
    const family = app._frames = new FrameMessages(app, document);
    const connection = new PageStoreConnection(app, '/py/gramlot/store', document);
    app.dispose = () => { app.state = 'disposed'; connection.close(); family.dispose(); };
    family.connect();
    function child() {
        const peer = {messages: [], postMessage(message, origin) { this.messages.push({message, origin}); }};
        const frame = {contentWindow: peer, isConnected: true, localName: 'iframe',
            getAttribute: name => name === 'src' ? './' : null, hasAttribute: () => false};
        frame.node = {frame};
        frames.push(frame);
        return peer;
    }
    function receive(source, message, origin = 'http://test') {
        const known = source === parent ? parent.messages[0] : source.messages[0]?.message;
        const event = new Event('message');
        Object.assign(event, {source, origin, data: {type: 'gramlot:message', session: 'child-session',
            recipient: known?.session, ready: true,
            channels: {server: {endpoint: connection.endpoint, ready: true}}, ...message}});
        window.dispatchEvent(event);
    }
    function hello(peer, channels = {server: {endpoint: connection.endpoint, ready: true}}) {
        receive(peer, {kind: 'hello', channels});
    }
    function up(peer, payload, extra = {}) {
        receive(peer, {kind: 'message', channel: 'server', wire: toTytx(payload), ...extra});
    }
    t.after(() => app.dispose());
    return {connection, family, window, windows, child, receive, hello, up, disposers};
}

test('children wait for primary readiness and forward page identities and typed responses', t => {
    const f = fixture(t);
    const child = f.child();
    f.hello(child);
    assert.equal(child.messages[0].message.channels.server.ready, false);
    f.windows[0].dispatchEvent(new Event('open'));
    assert.equal(child.messages.at(-1).message.channels.server.ready, true);
    f.up(child, {op: 'attach', pageId: 'nested'});
    f.up(child, {op: 'subscribe', pageId: 'nested', binderId: 'b', path: 'order'});
    assert.deepEqual(f.windows[0].messages.map(m => [m.op, m.pageId]), [['attach', 'nested'], ['subscribe', 'nested']]);
    const wire = toTytx({op: 'snapshot', pageId: 'nested', binderId: 'b', value: 42});
    f.connection.deliver(wire);
    assert.equal(child.messages.at(-1).message.wire, wire);
    assert.equal(child.messages.at(-1).origin, 'http://test');
});

test('server publications route only to the destination and subscriber errors preserve the channel', t => {
    const f = fixture(t);
    f.windows[0].dispatchEvent(new Event('open'));
    const child = f.child();
    f.hello(child);
    f.up(child, {op: 'attach', pageId: 'child'});
    const received = [];
    f.connection.gramlot._subscriptions = {publish: (topic, payload, metadata) => received.push({topic, payload, metadata})};
    const sent = f.windows[0].messages.length;
    const wire = toTytx({op: 'publish', pageId: 'child', topic: 'loaded', payload: {pkey: 42}, metadata: {pageId: 'store'}});
    f.connection.deliver(wire);
    assert.equal(child.messages.at(-1).message.wire, wire);
    assert.deepEqual(received, []);
    f.connection.deliver(toTytx({op: 'publish', pageId: 'primary', topic: 'loaded', payload: {pkey: 43}, metadata: {pageId: 'store'}}));
    assert.deepEqual(received, [{topic: 'loaded', payload: {pkey: 43}, metadata: {pageId: 'store'}}]);
    assert.equal(f.windows[0].messages.length, sent, 'server events are not echoed upstream');
    const errors = [];
    f.window.console.error = (...args) => errors.push(args);
    f.connection.gramlot._subscriptions.publish = () => { throw new Error('subscriber failure'); };
    f.connection.deliver(toTytx({op: 'publish', pageId: 'primary', topic: 'loaded', payload: {}}));
    assert.equal(errors.length, 1);
    assert.equal(f.connection.closed, false);
    const applied = [];
    f.connection.register({id: 'still-live', serverPath: 'record', apply: message => applied.push(message)});
    f.connection.deliver(toTytx({op: 'snapshot', pageId: 'primary', binderId: 'still-live', value: 44}));
    assert.equal(applied[0].value, 44);
});

test('foreign origins, unrelated windows, stale sessions and sibling route theft are ignored', t => {
    const f = fixture(t);
    f.windows[0].dispatchEvent(new Event('open'));
    const a = f.child(), b = f.child();
    f.receive(a, {kind: 'hello', endpoint: f.connection.endpoint}, 'http://foreign');
    f.hello({opener: null, messages: []});
    assert.equal(f.family.children.length, 0);
    f.hello(a); f.hello(b);
    f.up(a, {op: 'attach', pageId: 'a'});
    f.up(b, {op: 'change', pageId: 'a'});
    f.up(b, {op: 'attach', pageId: 'a'});
    f.up(a, {op: 'change', pageId: 'a'}, {session: 'old'});
    f.up(a, {op: 'attach', pageId: 'primary'});
    assert.equal(f.windows[0].messages.length, 1);
    assert.equal(f.connection.routes.get('a'), a);
});

test('Source removal detaches the entire child branch and preserves its sibling', t => {
    const f = fixture(t);
    f.windows[0].dispatchEvent(new Event('open'));
    const a = f.child(), b = f.child();
    f.hello(a); f.hello(b);
    for (const pageId of ['a', 'grandchild']) f.up(a, {op: 'attach', pageId});
    f.up(b, {op: 'attach', pageId: 'b'});
    f.disposers[0]();
    assert.deepEqual(f.windows[0].messages.slice(-2), [{op: 'detach', pageId: 'a'}, {op: 'detach', pageId: 'grandchild'}]);
    assert.deepEqual([...f.connection.routes.keys()], ['b']);
    assert.equal(f.connection.closed, false);
    assert.equal(a.messages.at(-1).message.kind, 'close');
});

test('a logical child opens no socket, attaches before subscriptions and ignores a stale parent', t => {
    const parent = {messages: [], postMessage(message) { this.messages.push(message); }};
    const f = fixture(t, parent);
    const binder = {id: 'b', serverPath: 'order', apply() {}};
    f.connection.register(binder);
    assert.equal(f.windows.length, 0);
    assert.equal(parent.messages[0].kind, 'hello');
    f.receive(parent, {kind: 'ready', recipient: 'old'});
    assert.equal(f.connection.ready, false);
    f.receive(parent, {kind: 'ready'});
    assert.deepEqual(parent.messages.filter(m => m.kind === 'message').map(m => fromTytx(m.wire).op), ['attach', 'subscribe']);
    f.receive(parent, {kind: 'close', session: 'old'});
    assert.equal(f.connection.closed, false);
    f.receive(parent, {kind: 'close'});
    assert.equal(f.connection.closed, true);
    assert.equal(f.windows.length, 0);
});

test('a directly opened window is accepted and a different endpoint is rejected', t => {
    const f = fixture(t);
    f.windows[0].dispatchEvent(new Event('open'));
    const popup = {opener: f.window, location: {origin: 'http://test'}, messages: [],
        postMessage(message) { this.messages.push({message}); }, close() { this.closed = true; }};
    f.hello(popup, {server: {endpoint: 'ws://test/another/store', ready: true}});
    f.up(popup, {op: 'attach', pageId: 'popup'});
    assert.equal(f.connection.routes.size, 0);
    assert.equal(f.family.children.length, 1);
    f.hello(popup);
    f.up(popup, {op: 'attach', pageId: 'popup'});
    assert.equal(f.connection.routes.get('popup'), popup);
});

test('socket failure closes all descendant channels without creating replacement sockets', t => {
    const f = fixture(t);
    f.windows[0].dispatchEvent(new Event('open'));
    const a = f.child(); f.hello(a);
    f.up(a, {op: 'attach', pageId: 'a'});
    f.windows[0].dispatchEvent(new Event('error'));
    assert.equal(f.connection.closed, true);
    assert.equal(f.family.children.length, 1);
    assert.equal(f.connection.routes.size, 0);
    assert.equal(a.messages.at(-1).message.channels.server, undefined);
    assert.equal(f.windows.length, 1);
});

test('closed windows are detached even when no final message can be delivered', t => {
    const f = fixture(t);
    f.windows[0].dispatchEvent(new Event('open'));
    const popup = {opener: f.window, location: {origin: 'http://test'}, messages: [],
        postMessage(message) { this.messages.push({message}); }, close() { this.closed = true; }};
    f.hello(popup);
    f.up(popup, {op: 'attach', pageId: 'popup'});
    popup.closed = true;
    f.window.watch();
    assert.deepEqual(f.windows[0].messages.at(-1), {op: 'detach', pageId: 'popup'});
    assert.equal(f.family.children.length, 0);
    const parent = {postMessage() {}, closed: false};
    const child = fixture(t, parent);
    parent.closed = true;
    child.window.watch();
    assert.equal(child.connection.closed, true);
    assert.equal(child.window.watch, null);
});

function request(id, pageId = 'primary') {
    return toTytx({id, pageId, contentType: 'data', name: 'echo', params: {value: id}});
}

test('queued RPC calls preserve TYTX and pair responses in reverse order beside binder messages', async t => {
    const f = fixture(t);
    const a = f.connection.call(request('a'));
    const b = f.connection.call(request('b'));
    assert.equal(f.windows[0].messages.length, 0);
    f.windows[0].dispatchEvent(new Event('open'));
    assert.deepEqual(f.windows[0].messages.map(m => m.id), ['a', 'b']);
    f.connection.deliver(toTytx({op: 'change', pageId: 'primary', binderId: 'unrelated'}));
    f.connection.deliver(toTytx({id: 'b', pageId: 'primary', contentType: 'data', value: new Date('2026-10-27')}));
    f.connection.deliver(toTytx({id: 'a', pageId: 'primary', contentType: 'data', value: 'first'}));
    assert.equal(fromTytx(await a).value, 'first');
    assert.equal(fromTytx(await b).value.toISOString(), '2026-10-27T00:00:00.000Z');
    assert.equal(f.connection.calls.size, 0);
});

test('aborting before ready sends nothing; aborting in flight cancels once and ignores late answers', async t => {
    const f = fixture(t);
    const before = new AbortController();
    const queued = f.connection.call(request('queued'), before.signal);
    before.abort(new Error('queued cancellation'));
    await assert.rejects(queued, /queued cancellation/);
    f.windows[0].dispatchEvent(new Event('open'));
    assert.equal(f.windows[0].messages.length, 0);
    const after = new AbortController();
    const active = f.connection.call(request('active'), after.signal);
    after.abort(new Error('active cancellation'));
    await assert.rejects(active, /active cancellation/);
    assert.deepEqual(f.windows[0].messages.at(-1), {op: 'cancel', pageId: 'primary', id: 'active'});
    f.connection.deliver(toTytx({pageId: 'primary', id: 'active', value: 'late'}));
    assert.equal(f.connection.calls.size, 0);
    await assert.rejects(f.connection.call(request('already-aborted'), after.signal), /active cancellation/);
    assert.equal(f.windows[0].messages.length, 2);
});

test('disconnect rejects every queued or active RPC without retries', async t => {
    for (const open of [false, true]) {
        const f = fixture(t);
        if (open) f.windows[0].dispatchEvent(new Event('open'));
        const a = f.connection.call(request('a'));
        const b = f.connection.call(request('b'));
        f.connection.fail(new Error('lost channel'));
        await assert.rejects(a, /lost channel/);
        await assert.rejects(b, /lost channel/);
        await assert.rejects(f.connection.call(request('new')), /lost channel/);
        assert.equal(f.connection.calls.size, 0);
        assert.equal(f.windows.length, 1);
    }
});

test('child queues RPC until attach and its response is local to its logical page', async t => {
    const parent = {messages: [], postMessage(message) { this.messages.push(message); }};
    const f = fixture(t, parent);
    const result = f.connection.call(request('child-rpc'));
    f.receive(parent, {kind: 'ready'});
    assert.deepEqual(parent.messages.filter(m => m.kind === 'message').map(m => fromTytx(m.wire).op ?? 'rpc'), ['attach', 'rpc']);
    f.receive(parent, {kind: 'message', channel: 'server', wire: toTytx({id: 'child-rpc', pageId: 'other', value: 99})});
    assert.equal(f.connection.calls.size, 1);
    f.receive(parent, {kind: 'message', channel: 'server', wire: toTytx({id: 'child-rpc', pageId: 'primary', value: 42})});
    assert.equal(fromTytx(await result).value, 42);
    assert.equal(f.windows.length, 0);
});

test('RPC uses the existing error contract and cannot impersonate another page or duplicate an id', async t => {
    const f = fixture(t);
    f.windows[0].dispatchEvent(new Event('open'));
    await assert.rejects(f.connection.call(request('x', 'other')), /identity/);
    const active = f.connection.call(request('same'));
    await assert.rejects(f.connection.call(request('same')), /duplicate/);
    f.connection.deliver(toTytx({id: 'same', pageId: 'primary', value: 1}));
    await active;
    const rpc = new RpcHandler({abort: new AbortController(), pageId: 'primary'}, {
        transport: new WebSocketTransport(f.connection, {close() {}, dispose() {}})});
    assert.equal(rpc.supportsCallSync, false);
    assert.throws(() => rpc.callSync('data', 'echo'), /no synchronous call/);
    const failed = rpc.call('data', 'echo');
    const id = f.windows[0].messages.at(-1).id;
    f.connection.deliver(toTytx({id, pageId: 'primary', contentType: 'data',
        error: {code: 'application_error', name: 'ValueError', message: 'bad record', details: {pkey: 42}}}));
    await assert.rejects(failed, error => error.code === 'application_error' && error.remoteName === 'ValueError'
        && error.message === 'bad record' && error.details.pkey === 42);
    assert.equal(rpc.remoteRequests.size, 0);
});
