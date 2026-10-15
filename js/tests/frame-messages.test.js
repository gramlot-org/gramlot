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
            data: {type: 'gramlot:publish', session: 'child-session', ...message}}));
    return {app, window, frame, sent, receive};
}

test('frame routes preflight readiness and forward typed data after local dispatch to exactly one child', () => {
    const {app, window, sent, receive} = fixture();
    const local = [];
    app.subscribe('refresh', payload => {local.push(payload); assert.equal(sent.filter(x => x.message.kind === 'publish').length, 0);});
    assert.throws(() => app.publish({topic: 'refresh', iframe: 'child'}, {}), /not ready/);
    assert.equal(local.length, 0);
    receive({kind: 'ready'});
    const data = {when: new Date('2026-10-15Z'), rows: new Bag({title: 'Hello'})};
    app.publish({topic: 'refresh', iframe: 'child'}, data);
    assert.equal(local.length, 1);
    const outgoing = sent.find(x => x.message.kind === 'publish');
    assert.equal(outgoing.origin, 'https://parent.test');
    assert.equal(outgoing.message.recipient, 'child-session');
    assert.equal(fromTytx(outgoing.message.wire).rows.getItem('title'), 'Hello');
    assert.ok(fromTytx(outgoing.message.wire).when instanceof Date);
    app.dispose(); window.close();
});

test('only the current connected source/origin/session can publish; hello reconnect and lifecycle are explicit', () => {
    const {app, window, frame, sent, receive} = fixture();
    const seen = [];
    app.subscribe('reply', payload => seen.push(payload));
    receive({kind: 'ready'});
    const session = sent[0].message.session;
    const message = {kind: 'publish', recipient: session, topic: 'reply', wire: toTytx({value: 1})};
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
    receive({kind: 'ready'});
    window.dispatchEvent(new window.PageTransitionEvent('pagehide'));
    assert.throws(() => app.publish({topic: 'command', iframe: 'child'}, {}), /not ready/);
    window.dispatchEvent(new window.PageTransitionEvent('pageshow'));
    assert.equal(sent.at(-1).message.kind, 'hello');
    receive({kind: 'ready'});
    frame.remove();
    assert.throws(() => app.publish({topic: 'command', iframe: 'child'}, {}), /active Gramlot iframe/);
    app.dispose(); window.close();
});

test('live Source/DOM values are local only, including nested transport fields and Bag attributes', async () => {
    const {app, window, frame, receive} = fixture();
    receive({kind: 'ready'});
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
    app.rpc.transport = {call() {calls++;}};
    await assert.rejects(app.rpc.call('data', 'save', {nested: [node]}), /Live Source\/DOM/);
    assert.equal(calls, 0);
    app.dispose(); window.close();
});

test('removing a Source-owned iframe closes its connection even before a browser unload event', () => {
    const {app, window, sent, receive} = fixture();
    receive({kind: 'ready'});
    app.src.source.getItem('main').popNode('iframe_0');
    assert.equal(sent.at(-1).message.kind, 'close');
    assert.throws(() => app.publish({topic: 'run', iframe: 'child'}, {}), /active Gramlot iframe/);
    app.dispose(); window.close();
});
