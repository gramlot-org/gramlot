import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';

function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    return {app, document};
}
function authored(app, author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    app.src.startSource(builder.toTytx());
}

test('public topics: synchronous order, equal messages twice, instance isolation and unsubscribe', () => {
    const {app} = page();
    const other = page().app;
    const calls = [];
    const first = app.subscribe('refresh', data => calls.push(['first', data]));
    app.subscribe('refresh', data => calls.push(['second', data]));
    other.subscribe('refresh', () => assert.fail('other instance'));
    const data = {id: 42};
    app.publish('refresh', data);
    app.publish('refresh', data);
    assert.deepEqual(calls.map(([name]) => name), ['first', 'second', 'first', 'second']);
    assert.ok(calls.every(([, value]) => value === data));
    app.unsubscribe(first);
    app.unsubscribe(first);
    app.publish({topic: 'refresh'}, data);
    assert.equal(calls.at(-1)[0], 'second');
    assert.throws(() => other.unsubscribe(first), /Unknown subscription/);
    assert.throws(() => app.publish('refresh', true), /object of named data/);
    assert.throws(() => app.publish({topic: 'refresh', extWin: 'x'}, data), /not implemented/);
    app.dispose(); other.dispose();
    assert.throws(() => app.publish('refresh', data), /disposed/);
});

test('dispatch snapshots callbacks, skips removed registrations, permits reentrancy and propagates errors', () => {
    const {app} = page();
    const seen = [];
    let added = false;
    app.subscribe('event', data => {
        seen.push(`first:${data.n}`);
        app.unsubscribe(second);
        if (!added) {
            added = true;
            app.subscribe('event', next => seen.push(`new:${next.n}`));
            app.publish('event', {n: 2});
        }
    });
    const second = app.subscribe('event', () => assert.fail('removed registration'));
    app.publish('event', {n: 1});
    assert.deepEqual(seen, ['first:1', 'first:2', 'new:2']);
    app.subscribe('bad', () => { throw new Error('body failure'); });
    app.subscribe('bad', () => assert.fail('after error'));
    assert.throws(() => app.publish('bad', {}), /body failure/);
    app.dispose();
});

test('subscribe activates the existing controller, preserves named argument precedence and supports Data too', () => {
    const {app} = page();
    const calls = [];
    class Logic { run(node, args) { calls.push(args); } }
    app.src.logicRegistry.register(Logic, {group: null, resource: '/logic.js'});
    authored(app, root => root.dataController({func: 'run', subscribe_saved: true, value: '^value', fixed: 'authored'}));
    const payload = {id: 42, fixed: 'message', _reason: 'spoof'};
    app.publish('saved', payload);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].id, 42);
    assert.equal(calls[0].fixed, 'authored');
    assert.equal(calls[0]._reason, 'saved');
    assert.equal(calls[0]._subscription_kwargs, payload);
    assert.equal(calls[0].subscribe_saved, undefined);
    assert.equal(payload._reason, 'spoof');
    app.data.setItem('value', 'changed');
    assert.equal(calls.length, 2);
    app.src.source.popNode('main');
    app.publish('saved', payload);
    assert.equal(calls.length, 2);
    app.dispose();
});

test('legacy false subscription declarations still register and formula messages write their result', () => {
    const {app} = page();
    authored(app, root => root.dataFormula({result_path: 'total', formula: 'quantity * 2', subscribe_recalculate: false}));
    app.publish('recalculate', {quantity: 3});
    assert.equal(app.data.getItem('total'), 6);
    app.dispose();
});

test('Source self topics isolate nodes and nodeId descriptors address the declared node_id', () => {
    const {app} = page();
    authored(app, root => {
        root.div({node_id: 'first', selfsubscribe_refresh: "this.SET('first', p_0.id);"});
        root.div({node_id: 'second', selfsubscribe_refresh: "this.SET('second', p_0.id);"});
        root.dataController({node_id: 'controller', selfsubscribe_run: true, script: "this.SET('result', id);"});
    });
    app.publish('refresh', {id: 1});
    assert.equal(app.data.getItem('first'), null);
    app.publish({topic: 'refresh', nodeId: 'first'}, {id: 2});
    assert.equal(app.data.getItem('first'), 2);
    assert.equal(app.data.getItem('second'), null);
    const node = sourceTarget(app.src.builder.nodeById('second'));
    node.publish('refresh', {id: 3});
    assert.equal(app.data.getItem('second'), 3);
    app.publish({topic: 'run', nodeId: 'controller'}, {id: 4});
    assert.equal(app.data.getItem('result'), 4);
    app.src.source.popNode('main');
    assert.throws(() => node.publish('refresh', {}), /not an active Source/);
    app.dispose();
});

test('auto JS Source references resolve at controller execution and in button action', () => {
    const {app, document} = page();
    authored(app, root => {
        const target = root.div({selfsubscribe_refresh: "this.SET('answer', p_0.id);"});
        root.dataController({subscribe_run: true, target, script: 'target.publish("refresh", {id});'});
        root.button('Go', {id: 'go', target, action: 'target.publish("refresh", {id: 7});'});
    });
    app.publish('run', {id: 5});
    assert.equal(app.data.getItem('answer'), 5);
    document.getElementById('go').click();
    assert.equal(app.data.getItem('answer'), 7);
    app.dispose();
});

test('Python authored reference survives TYTX and activates a self-subscriber from a controller', () => {
    const {app} = page();
    const wire = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', `
from gramlot import GramlotBuilder
b = GramlotBuilder()
target = b.root.div(selfsubscribe_refresh="this.SET('answer', p_0.id);")
b.root.dataController("target.publish('refresh', {id});", target=target, subscribe_run=True)
print(b.to_tytx())
`], {encoding: 'utf8'}).trim();
    app.src.startSource(wire);
    app.publish('run', {id: 9});
    assert.equal(app.data.getItem('answer'), 9);
    app.dispose();
});

test('subscription rebind does not duplicate callbacks and branch disposal cancels message delay', async () => {
    const {app} = page();
    authored(app, root => root.dataController({node_id: 'work', subscribe_run: true,
        script: "this.SET('answer', id);", _delay: 20}));
    const node = sourceTarget(app.src.builder.nodeById('work'));
    app.src.binding.bindingFor(node).rebind();
    app.publish('run', {id: 1});
    app.publish('run', {id: 2});
    await new Promise(resolve => setTimeout(resolve, 40));
    assert.equal(app.data.getItem('answer'), 2);
    app.publish('run', {id: 3});
    app.src.source.popNode('main');
    await new Promise(resolve => setTimeout(resolve, 40));
    assert.equal(app.data.getItem('answer'), 2);
    app.dispose();
});

test('topic-triggered RPC runs one call at a time, excludes trigger context and aborts on removal', async () => {
    const {fromTytx, toTytx} = await import('@genrojs/tytx');
    const {app} = page();
    const pending = [];
    app.rpc.transport = {call(wire, signal) {
        const request = fromTytx(wire);
        return new Promise(resolve => pending.push({request, signal, resolve: value => resolve(toTytx({id: request.id, value}))}));
    }};
    authored(app, root => root.dataRpc({method: 'echo', result_path: 'result', subscribe_run: true, fixed: 'declared'}));
    app.publish('run', {value: 1, fixed: 'payload'});
    app.publish('run', {value: 2});
    assert.equal(pending.length, 1);
    assert.deepEqual(pending[0].request.params, {value: 1, fixed: 'declared'});
    assert.equal(pending[0].signal.aborted, false);
    pending[0].resolve('first');
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(app.data.getItem('result'), 'first');
    assert.deepEqual(pending[1].request.params, {value: 2, fixed: 'declared'});
    pending[1].resolve('latest');
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(app.data.getItem('result'), 'latest');
    app.publish('run', {value: 3});
    app.src.source.popNode('main');
    assert.equal(pending[2].signal.aborted, true);
    pending[2].resolve('removed');
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(app.data.getItem('result'), 'latest');
    app.publish('run', {value: 4}); assert.equal(pending.length, 3);
    app.dispose();
});

test('legacy _userChanges filters ordinary topics and permits literal node', () => {
    const {app} = page();
    authored(app, root => root.dataController({subscribe_run: true, subscribe_node: true,
        _userChanges: true, script: "this.SET('value', value);"}));
    app.publish('run', {value: 1}); assert.equal(app.data.getItem('value'), null);
    app.publish('node', {value: 2}); assert.equal(app.data.getItem('value'), 2);
    app.dispose();
});

test('authored references address non-DOM controller self-topics and leave with their semantic owner', () => {
    const {app, document} = page();
    authored(app, root => {
        const target = root.dataController({selfsubscribe_run: true, script: "this.SET('result', value);"});
        root.button('Send', {id: 'send', target, action: "target.publish('run', {value: 42});"});
    });
    document.getElementById('send').click();
    assert.equal(app.data.getItem('result'), 42);
    const ref = app.src.source.getItem('main').getNode('button_0').getAttr('target');
    app.src.source.getItem('main').popNode('dataController_0');
    assert.throws(() => app.dom.reference(ref), /not mounted/);
    app.dispose();
});
