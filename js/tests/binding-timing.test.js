// Phase S08: provider timers on a virtual clock (node:test mock.timers): `_delay` debounce,
// `_timing` interval with stop and restart, `_onStart` and `_onBuilt` delays (P22), and no
// execution after the node leaves the Source (source plan §4.8).
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@jsr/genro__builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';

function page(t) {
    t.mock.timers.enable({apis: ['setTimeout', 'setInterval']});
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport: false});
    return {app, data: app.data, clock: t.mock.timers};
}

/** Register `methods` as the page companion (the root logic group). */
function companion(app, methods) {
    const Logic = class {};
    for (const [name, method] of Object.entries(methods)) {
        Object.defineProperty(Logic.prototype, name, {value: method, writable: true, configurable: true});
    }
    app.logicRegistry.register(Logic, {group: null, resource: '/test_aux.js'});
}

function authored(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.source;
}

const counting = calls => (...args) => { calls.push(args.at(-1)); };

test('_delay debounces: the last call wins and the arguments are read when the body runs', t => {
    const {app, data, clock} = page(t);
    const calls = [];
    companion(app, {go: counting(calls)});
    app.builder.root.dataController({func: 'go', a: '^a', b: '=b', _delay: 50});
    data.setItem('a', 1);
    clock.tick(30);
    data.setItem('a', 2);
    clock.tick(30);
    data.setItem('a', 3);
    data.setItem('b', 'late');
    assert.deepEqual(calls, []);
    clock.tick(49);
    assert.deepEqual(calls, []);
    clock.tick(1);
    assert.deepEqual(calls.map(kwargs => [kwargs.a, kwargs.b, kwargs._reason]), [[3, 'late', 'node']]);
    clock.tick(500);
    assert.equal(calls.length, 1);
    app.dispose();
});

test('_delay=1: several writes give one invocation, counted directly', t => {
    const {app, data, clock} = page(t);
    const calls = [];
    companion(app, {go: counting(calls)});
    app.builder.root.dataController({func: 'go', a: '^a', _delay: 1});
    for (let value = 0; value < 5; value++) data.setItem('a', value);
    clock.tick(1);
    assert.equal(calls.length, 1);
    app.dispose();
});

test('_userChanges is evaluated at trigger time, before the _delay', t => {
    const {app, data, clock} = page(t);
    const calls = [];
    companion(app, {go: counting(calls)});
    data.setItem('c.v', 0);
    app.builder.root.dataController({func: 'go', v: '^c.v', _delay: 10, _userChanges: true});
    data.setItem('c.v', 1);
    data.setItem('c.v.deep', 2);
    clock.tick(10);
    assert.deepEqual(calls.map(kwargs => kwargs._reason), ['node']);
    app.dispose();
});

test('_timing: an interval in seconds; null or 0 stops it; a new value restarts it', t => {
    const {app, data, clock} = page(t);
    const calls = [];
    companion(app, {tick: counting(calls)});
    data.setItem('every', 2);
    app.builder.root.dataController({func: 'tick', _timing: '^every'});
    clock.tick(1999);
    assert.equal(calls.length, 0);
    clock.tick(1);
    assert.deepEqual(calls.map(kwargs => [kwargs._reason, kwargs._node, kwargs._triggerpars]),
        [['timing', null, {kw: null, trigger_reason: 'timing'}]]);
    clock.tick(4000);
    assert.equal(calls.length, 3);
    data.setItem('every', 0);
    clock.tick(10000);
    assert.equal(calls.length, 3);
    data.setItem('every', 1);
    clock.tick(1000);
    assert.equal(calls.length, 4);
    data.setItem('every', null);
    clock.tick(5000);
    assert.equal(calls.length, 4);
    data.setItem('every', 3);
    clock.tick(1000);
    data.setItem('every', 3); // an equal value emits nothing: no restart
    clock.tick(2000);
    assert.equal(calls.length, 5);
    app.dispose();
});

test('_timing with a literal value, and a rebinding restarts it from the new context', t => {
    const {app, data, clock} = page(t);
    const calls = [];
    companion(app, {tick: counting(calls)});
    data.setItem('one.every', 1);
    data.setItem('two.every', 5);
    data.setItem('sel', 'one');
    app.builder.root.dataController({func: 'tick', _timing: 1});
    app.builder.root.div({datapath: '^sel'}).dataController({func: 'tick', _timing: '^.every', which: 'context'});
    clock.tick(1000);
    assert.equal(calls.filter(kwargs => kwargs.which).length, 1);
    data.setItem('sel', 'two');
    clock.tick(4999);
    assert.equal(calls.filter(kwargs => kwargs.which).length, 1);
    clock.tick(1);
    assert.equal(calls.filter(kwargs => kwargs.which).length, 2);
    assert.equal(calls.filter(kwargs => !kwargs.which).length, 6);
    data.setItem('sel', null);
    clock.tick(20000);
    assert.equal(calls.filter(kwargs => kwargs.which).length, 2);
    app.dispose();
});

test('no execution after removal: the pending _delay, the _timing and the delayed _onStart of a removed node', t => {
    const {app, data, clock} = page(t);
    const calls = [];
    companion(app, {go: counting(calls)});
    app.startSource(authored(root => {
        const box = root.section();
        box.dataController({func: 'go', a: '^a', _delay: 100});
        box.dataController({func: 'go', _timing: 1});
        box.dataController({func: 'go', _onStart: 500});
    }));
    data.setItem('a', 1);
    const box = app.source.getItem('main').getNodes()[0];
    box.parentBag.popNode(box.label);
    clock.tick(10000);
    assert.deepEqual(calls, []);
    app.dispose();
});

test('the same three timers run when the node stays', t => {
    const {app, data, clock} = page(t);
    const calls = [];
    companion(app, {go: counting(calls)});
    app.startSource(authored(root => {
        const box = root.section();
        box.dataController({func: 'go', a: '^a', _delay: 100});
        box.dataController({func: 'go', _timing: 1});
        box.dataController({func: 'go', _onStart: 500});
    }));
    data.setItem('a', 1);
    clock.tick(1000);
    assert.deepEqual(calls.map(kwargs => kwargs._reason).sort(), ['node', 'start', 'timing']);
    app.dispose();
});

test('dispose stops every timer of the page', t => {
    const {app, data, clock} = page(t);
    const calls = [];
    companion(app, {go: counting(calls)});
    app.builder.root.dataController({func: 'go', a: '^a', _delay: 100});
    app.builder.root.dataController({func: 'go', _timing: 1});
    data.setItem('a', 1);
    app.dispose();
    clock.tick(10000);
    assert.deepEqual(calls, []);
});

test('P22: _onStart true and 0 run at start with no delay; a number is a delay in ms that leaves _delay alone', t => {
    const {app, data, clock} = page(t);
    const calls = [];
    companion(app, {go: (node, kwargs) => { calls.push([node.getAttr('name'), kwargs._reason]); }});
    app.startSource(authored(root => {
        root.dataController({func: 'go', name: 'true', _onStart: true});
        root.dataController({func: 'go', name: 'zero', _onStart: 0});
        root.dataController({func: 'go', name: 'later', _onStart: 200, a: '^a'});
        root.dataController({func: 'go', name: 'off', _onStart: false});
    }));
    assert.deepEqual(calls, [['true', 'start'], ['zero', 'start']]);
    data.setItem('a', 1);
    assert.deepEqual(calls.at(-1), ['later', 'node']);
    clock.tick(199);
    assert.equal(calls.length, 3);
    clock.tick(1);
    assert.deepEqual(calls.at(-1), ['later', 'start']);
    app.dispose();
});

test('P22: a negative or non-finite _onStart is an error at registration', t => {
    for (const value of [-1, Infinity, NaN]) {
        const {app} = page(t);
        assert.throws(() => app.startSource(authored(root => root.dataController({func: 'go', _onStart: value}))),
            /dataController '.*': _onStart must be true or a delay in ms not below 0/);
        app.dispose();
        t.mock.timers.reset();
    }
});

test('_onBuilt with a number runs that many ms after the build', t => {
    const {app, clock} = page(t);
    const calls = [];
    companion(app, {go: counting(calls)});
    app.startSource(authored(root => root.div().dataController({func: 'go', _onBuilt: 30})));
    assert.deepEqual(calls, []);
    clock.tick(30);
    assert.deepEqual(calls.map(kwargs => kwargs._reason), ['built']);
    app.dispose();
});

test('FIRE_AFTER from a provider body is owned by the provider node and cancelled at its removal', t => {
    const {app, data, clock} = page(t);
    const seen = [];
    companion(app, {
        later(node) { node.FIRE_AFTER('shot', 'v', 50); },
        seen: (node, kwargs) => { seen.push(kwargs.shot); },
    });
    app.builder.root.dataController({func: 'seen', shot: '^shot'});
    const node = sourceTarget(app.builder.root.dataController({func: 'later', go: '^go'}));
    data.setItem('go', 1);
    clock.tick(50);
    assert.deepEqual(seen, ['v']);
    data.setItem('go', 2);
    node.parentBag.popNode(node.label);
    clock.tick(100);
    assert.deepEqual(seen, ['v']);
    app.dispose();
});
