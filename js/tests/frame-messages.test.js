import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder, Bag} from '../src/index.js';

function fixture() {
    const window = new JSDOM('<main></main>', {url: 'https://parent.test/'}).window;
    const app = new Gramlot({element: window.document.querySelector('main'), transport: false});
    const builder = new GramlotBuilder();
    builder.root.iframe({id: 'child', srcdoc: ''});
    builder.root.iframe({id: 'other', srcdoc: ''});
    app.src.startSource(builder.source);
    const frame = window.document.getElementById('child');
    const sent = [];
    frame.contentWindow.postMessage = (message, origin) => sent.push({message, origin});
    const receive = (message, origin = 'https://parent.test', source = frame.contentWindow) =>
        window.dispatchEvent(new window.MessageEvent('message', {source, origin,
            data: {type: 'gramlot:message', session: 'child-session', ready: true, channels: {}, pageId: 'child-page',
                recipient: sent[0]?.message.session, ...message}}));
    return {app, window, frame, sent, receive};
}

test('frame routes preflight readiness and forward typed data after local dispatch to exactly one child', () => {
    const {app, window, sent, receive} = fixture();
    const local = [];
    app.subscribe('refresh', payload => {local.push(payload); assert.equal(sent.filter(x => x.message.channel === 'publish').length, 0);});
    assert.throws(() => app.publish({topic: 'refresh', iframe: 'child'}, {}), /not ready/);
    assert.equal(local.length, 0);
    receive({kind: 'hello', ready: true});
    const data = {when: new Date('2026-10-15Z'), rows: new Bag({title: 'Hello'})};
    app.publish({topic: 'refresh', iframe: 'child'}, data);
    assert.equal(local.length, 1);
    const outgoing = sent.find(x => x.message.channel === 'publish');
    assert.equal(outgoing.origin, 'https://parent.test');
    assert.equal(outgoing.message.recipient, 'child-session');
    assert.equal(fromTytx(outgoing.message.wire).payload.rows.getItem('title'), 'Hello');
    assert.ok(fromTytx(outgoing.message.wire).payload.when instanceof Date);
    app.dispose(); window.close();
});

test('only the current connected source/origin/session can publish; hello reconnect and lifecycle are explicit', () => {
    const {app, window, frame, sent, receive} = fixture();
    const seen = [];
    app.subscribe('reply', payload => seen.push(payload));
    receive({kind: 'hello', ready: true});
    const session = sent[0].message.session;
    const message = {kind: 'message', channel: 'publish', recipient: session, wire: toTytx({topic: 'reply', payload: {value: 1}})};
    receive(message, 'https://wrong.test');
    receive(message, 'https://parent.test', window);
    receive({...message, session: 'stale'});
    receive({...message, recipient: 'stale'});
    assert.deepEqual(seen, []);
    receive(message); receive(message);
    assert.equal(seen.length, 2);
    // A ready hello does not leave a one-way connection after a later load/pageshow.
    receive({kind: 'hello', ready: true});
    app.publish({topic: 'command', iframe: 'child'}, {});
    receive({kind: 'close'});
    assert.throws(() => app.publish({topic: 'command', iframe: 'child'}, {}), /not ready/);
    receive({kind: 'hello', ready: true});
    window.dispatchEvent(new window.PageTransitionEvent('pagehide', {persisted: true}));
    assert.equal(app.state, 'started');
    window.dispatchEvent(new window.PageTransitionEvent('pageshow'));
    assert.equal(sent.at(-1).message.kind, 'ready');
    receive({kind: 'hello', ready: true});
    frame.remove();
    assert.throws(() => app.publish({topic: 'command', iframe: 'child'}, {}), /active Gramlot iframe/);
    app.dispose(); window.close();
});

test('live Source/DOM values are local only, including nested transport fields and Bag attributes', async () => {
    const {app, window, frame, receive} = fixture();
    receive({kind: 'hello', ready: true});
    const node = app.dom.getBaseSourceNode(frame);
    let local;
    app.subscribe('local', payload => {local = payload.target;});
    app.publish('local', {target: node}); assert.equal(local, node);
    for (const value of [node, frame, {nested: [frame]}]) {
        assert.throws(() => app.publish({topic: 'remote', iframe: 'child'}, {target: value}), /Live Source\/DOM/);
    }
    const bag = new Bag(); bag.setItem('one', 1, {target: node});
    assert.throws(() => app.publish({topic: 'remote', iframe: 'child'}, {bag}), /Live Source\/DOM/);
    let calls = 0;
    app.rpc.transport = {call() {calls++;}, close() {}, dispose() {}};
    await assert.rejects(app.rpc.call('data', 'save', {nested: [node]}), /Live Source\/DOM/);
    assert.equal(calls, 0);
    app.dispose(); window.close();
});

test('removing a Source-owned iframe closes its connection even before a browser unload event', () => {
    const {app, window, sent, receive} = fixture();
    receive({kind: 'hello', ready: true});
    app.src.source.getItem('main').popNode('iframe_0');
    assert.equal(sent.at(-1).message.kind, 'close');
    assert.throws(() => app.publish({topic: 'run', iframe: 'child'}, {}), /active Gramlot iframe/);
    app.dispose(); window.close();
});

test('one family session serves publications and server messages; only Gramlot popups join and close', () => {
    const {app, window, receive} = fixture();
    const messages = [], server = [], publications = [];
    const popup = {opener: window, location: {origin: 'https://parent.test'},
        postMessage(message) { messages.push(message); }, close() { this.closed = true; }};
    const unrelated = {opener: null, location: {origin: 'https://parent.test'}, postMessage() {}, close() { this.closed = true; }};
    app._frames.registerChannel('server', {changed() {}, disconnected() {}, receive(peer, data) { server.push([peer.pageId, data]); }},
        {ready: true});
    app.subscribe('reply', data => publications.push(data));
    receive({kind: 'hello', ready: false, pageId: 'popup'}, 'https://wrong.test', popup);
    receive({kind: 'hello', ready: true, pageId: 'stranger'}, 'https://parent.test', unrelated);
    assert.equal(app._frames.children.length, 0);
    receive({kind: 'hello', ready: false, pageId: 'popup'}, 'https://parent.test', popup);
    assert.equal(app._frames.children[0].kind, 'popup');
    const recipient = messages[0].session;
    receive({kind: 'message', recipient, channel: 'server', wire: toTytx({id: 'rpc', pageId: 'popup'})},
        'https://parent.test', popup);
    assert.deepEqual(server, [['popup', {id: 'rpc', pageId: 'popup'}]]);
    assert.throws(() => app.publish({topic: 'ping', pageId: 'popup'}, {}), /not ready/);
    receive({kind: 'hello', ready: true, pageId: 'popup'}, 'https://parent.test', popup);
    app.publish({topic: 'ping', pageId: 'popup'}, {value: 42});
    app._frames.send(popup, 'server', {id: 'rpc', value: 42});
    const sent = messages.filter(message => message.kind === 'message');
    assert.deepEqual(sent.map(message => message.channel), ['publish', 'server']);
    assert.equal(sent[0].session, sent[1].session);
    assert.ok(messages.every(message => message.type === 'gramlot:message'));
    receive({kind: 'message', recipient, channel: 'publish', wire: toTytx({topic: 'reply', payload: {value: 42}})},
        'https://parent.test', popup);
    assert.deepEqual(publications, [{value: 42}]);
    window.dispatchEvent(new window.PageTransitionEvent('pagehide'));
    assert.equal(app.state, 'disposed');
    assert.equal(popup.closed, true);
    assert.equal(unrelated.closed, undefined);
    assert.equal(app._frames.children.length, 0);
    window.close();
});

test('page disposal sends close without announcing a missing channel to its popups', () => {
    const {app, window, receive} = fixture();
    const messages = [];
    const popup = {opener: window, location: {origin: 'https://parent.test'},
        postMessage(message) { messages.push(message); }, close() { this.closed = true; }};
    const handler = {changed() {}, disconnected() {}, receive() {}};
    app._frames.registerChannel('server', handler, {endpoint: 'wss://parent.test/store', ready: true});
    receive({kind: 'hello', ready: true, pageId: 'popup'}, 'https://parent.test', popup);
    // A live page must still announce channel loss to its children.
    app._frames.unregisterChannel('server');
    assert.equal(messages.at(-1).kind, 'ready');
    assert.equal(messages.at(-1).channels.server, undefined);
    app._frames.registerChannel('server', handler, {endpoint: 'wss://parent.test/store', ready: true});
    app._pageStore = {close() { app._frames.unregisterChannel('server'); }};
    messages.length = 0;
    try {
        window.dispatchEvent(new window.PageTransitionEvent('pagehide'));
        assert.deepEqual(messages.map(message => message.kind), ['close']);
        assert.equal(popup.closed, true);
    } finally {
        app.dispose();
        window.close();
    }
});
