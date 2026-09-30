// Phase S08: writes into Data from the node methods (source plan §4.7; decisions R13, Q8, D4, Q9,
// P12, R10). The recipients are named-logic controllers, so every count is an invocation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@jsr/genro__builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';

function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport: false});
    return {app, data: app.data};
}

/** Register `methods` as the page companion (the root logic group). */
function companion(app, methods) {
    const Logic = class {};
    for (const [name, method] of Object.entries(methods)) {
        Object.defineProperty(Logic.prototype, name, {value: method, writable: true, configurable: true});
    }
    app.logicRegistry.register(Logic, {group: null, resource: '/test_aux.js'});
}

/** A controller node on the page Source, returned as the Source node. */
function controller(app, attrs) {
    return sourceTarget(app.builder.root.dataController(attrs));
}

/** A recorder method: every call pushes `[path, fired, value]` of its Data trigger. */
function recorder(calls) {
    return (node, kwargs) => {
        const change = kwargs._triggerpars.kw;
        calls.push([change.path, change.fired, change.node.value]);
    };
}

test('R13: PUT writes with no Gramlot reaction, on an existing path, through missing branches and on ?attr', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {seen: recorder(calls)});
    data.setItem('x', 1);
    data.setItem('y', 1, {cap: 'old'});
    controller(app, {func: 'seen', x: '^x'});
    controller(app, {func: 'seen', a: '^a'});
    controller(app, {func: 'seen', d: '^a.b.c'});
    controller(app, {func: 'seen', cap: '^y?cap'});
    const writer = controller(app, {});
    writer.PUT('x', 2);
    writer.PUT('a.b.c', 3);
    writer.PUT('y?cap', 'new');
    assert.deepEqual(calls, []);
    assert.equal(data.getItem('x'), 2);
    assert.equal(data.getItem('a.b.c'), 3);
    assert.equal(data.getNode('y').getAttr('cap'), 'new');
    writer.SET('x', 4);
    assert.deepEqual(calls, [['x', false, 4]]);
    app.dispose();
});

test('Q8: FIRE with the current value fires once and leaves null; SET of an equal value emits nothing', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {seen: recorder(calls)});
    controller(app, {func: 'seen', x: '^x'});
    const writer = controller(app, {});
    writer.SET('x', 3);
    writer.SET('x', 3);
    assert.deepEqual(calls, [['x', false, 3]]);
    calls.length = 0;
    writer.FIRE('x', 3);
    assert.deepEqual(calls, [['x', true, 3]]);
    assert.equal(data.getItem('x'), null);
    app.dispose();
});

test('D4: FIRE with null writes true; FIRE with false and with 0 fire once each; every FIRE fires once', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {seen: recorder(calls)});
    controller(app, {func: 'seen', x: '^x'});
    const writer = controller(app, {});
    writer.FIRE('x', null);
    writer.FIRE('x', false);
    writer.FIRE('x', 0);
    writer.FIRE('x');
    writer.FIRE('x');
    assert.deepEqual(calls, [['x', true, true], ['x', true, false], ['x', true, 0], ['x', true, true], ['x', true, true]]);
    assert.equal(data.getItem('x'), null);
    app.dispose();
});

test('P12, R10: a recipient raising during FIRE: the value is reset to null, the error propagates, a later write works', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {
        fail() { throw new Error('recipient failure'); },
        seen: recorder(calls),
    });
    const failing = controller(app, {func: 'fail', x: '^x'});
    controller(app, {func: 'seen', x: '^x'});
    const writer = controller(app, {});
    assert.throws(() => writer.FIRE('x', 7), /recipient failure/);
    assert.equal(data.getItem('x'), null);
    assert.deepEqual(calls, []);
    failing.setAttr({func: null, x: null});
    writer.SET('x', 8);
    assert.deepEqual(calls, [['x', false, 8]]);
    assert.equal(data.getItem('x'), 8);
    app.dispose();
});

test('P12: an exception in a recipient of a plain write propagates, and the next write is delivered', () => {
    const {app, data} = page();
    const calls = [];
    let fail = true;
    companion(app, {
        maybe() { if (fail) throw new Error('once'); },
        seen: recorder(calls),
    });
    controller(app, {func: 'maybe', x: '^x'});
    controller(app, {func: 'seen', x: '^x'});
    const writer = controller(app, {});
    assert.throws(() => writer.SET('x', 1), /once/);
    assert.equal(data.getItem('x'), 1);
    fail = false;
    writer.SET('x', 2);
    assert.deepEqual(calls, [['x', false, 2]]);
    app.dispose();
});

test('nested FIRE with an exception: both fired values are reset and the error propagates', () => {
    const {app, data} = page();
    companion(app, {
        relay(node) { node.FIRE('y', 'inner'); },
        fail() { throw new Error('nested failure'); },
    });
    controller(app, {func: 'relay', x: '^x'});
    controller(app, {func: 'fail', y: '^y'});
    const writer = controller(app, {});
    assert.throws(() => writer.FIRE('x', 'outer'), /nested failure/);
    assert.equal(data.getItem('x'), null);
    assert.equal(data.getItem('y'), null);
    app.dispose();
});

test('FIRE then SET inside the delivery: the SETs are not fired, on the same path and on another one', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {
        write(node, kwargs) {
            if (!kwargs._triggerpars.kw.fired) return;
            node.SET('x', 'inner');
            node.SET('z', 1);
        },
        seen: recorder(calls),
    });
    controller(app, {func: 'write', x: '^x'});
    controller(app, {func: 'seen', x: '^x', z: '^z'});
    const writer = controller(app, {});
    writer.FIRE('x', 'outer');
    assert.deepEqual(calls, [['x', false, 'inner'], ['z', false, 1], ['x', true, 'inner']]);
    assert.equal(data.getItem('x'), null);
    assert.equal(data.getItem('z'), 1);
    app.dispose();
});

test('FIRE inside a FIRE delivery, and PUT inside a FIRE delivery', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {
        relay(node) {
            node.FIRE('y', 2);
            node.PUT('q', 3);
        },
        seen: recorder(calls),
    });
    controller(app, {func: 'relay', x: '^x'});
    controller(app, {func: 'seen', y: '^y', q: '^q'});
    const writer = controller(app, {});
    writer.FIRE('x', 1);
    assert.deepEqual(calls, [['y', true, 2]]);
    assert.equal(data.getItem('x'), null);
    assert.equal(data.getItem('y'), null);
    assert.equal(data.getItem('q'), 3);
    app.dispose();
});

test('fired writes below a registered path give no child reaction; a plain write does', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {seen: recorder(calls)});
    data.setItem('a.b', 0);
    controller(app, {func: 'seen', a: '^a'});
    const writer = controller(app, {});
    writer.FIRE('a.b', 1);
    assert.deepEqual(calls, []);
    writer.SET('a.b', 2);
    assert.deepEqual(calls, [['a.b', false, 2]]);
    app.dispose();
});

test('FIRE on ?attr fires the attribute as legacy fireEvent: the value stays, the attribute goes back to null', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {
        seen(node, kwargs) {
            const change = kwargs._triggerpars.kw;
            calls.push([change.evt, change.fired, kwargs.cap, change.node.value]);
        },
        fail() { throw new Error('attribute recipient failure'); },
    });
    data.setItem('y', 1, {cap: 'a', keep: 'k'});
    controller(app, {func: 'seen', cap: '^y?cap'});
    const writer = controller(app, {});
    writer.FIRE('y?cap', 'b');
    assert.deepEqual(calls, [['upd_attrs', true, 'b', 1]]);
    assert.equal(data.getItem('y'), 1);
    assert.equal(data.getNode('y').getAttr('cap') ?? null, null);
    assert.equal(data.getNode('y').getAttr('keep'), 'k');
    calls.length = 0;
    data.getNode('y').setAttr({cap: 'same'}, false);
    writer.FIRE('y?cap', 'same'); // Q8: an equal value fires
    writer.FIRE('y?cap', null); // D4: null writes true
    assert.deepEqual(calls, [['upd_attrs', true, 'same', 1], ['upd_attrs', true, true, 1]]);
    writer.FIRE('z?cap', 'new'); // a missing node is created with null
    assert.equal(data.getItem('z'), null);
    assert.equal(data.getNode('z').getAttr('cap') ?? null, null);
    controller(app, {func: 'fail', cap: '^y?cap'});
    assert.throws(() => writer.FIRE('y?cap', 'c'), /attribute recipient failure/);
    assert.equal(data.getNode('y').getAttr('cap') ?? null, null);
    assert.equal(data.getItem('y'), 1);
    app.dispose();
});

test('FIRE on a null path is an error naming the node (Q7)', () => {
    const {app} = page();
    const box = app.builder.root.div({datapath: '^sel'});
    const node = sourceTarget(box.dataController({}));
    assert.throws(() => node.FIRE('.x'), /dataController '.*': write on a null path: '\.x'/);
    app.dispose();
});

// Phase 18 (Fable R3): the writable-path check of FIRE_AFTER runs at the call (Q7), no timer is started.
test('Fable R3: FIRE_AFTER on a null path is an error at the call; no timer starts', t => {
    t.mock.timers.enable({apis: ['setTimeout']});
    const {app} = page();
    const box = app.builder.root.div({datapath: '^sel'});
    const node = sourceTarget(box.dataController({}));
    const started = [];
    const original = globalThis.setTimeout;
    globalThis.setTimeout = (...args) => { started.push(args[1]); return original(...args); };
    try {
        assert.throws(() => node.FIRE_AFTER('.x', true, 5), /dataController '.*': write on a null path: '\.x'/);
    } finally {
        globalThis.setTimeout = original;
    }
    assert.deepEqual(started, []);
    assert.doesNotThrow(() => t.mock.timers.tick(10));
    app.dispose();
});

test('FIRE_AFTER: the default and an explicit delay, the returned cancellation, and the cancel at node close', t => {
    t.mock.timers.enable({apis: ['setTimeout']});
    const {app, data} = page();
    const calls = [];
    companion(app, {seen: recorder(calls)});
    controller(app, {func: 'seen', tick: '^tick'});
    const writer = controller(app, {});
    writer.FIRE_AFTER('tick');
    t.mock.timers.tick(9);
    assert.deepEqual(calls, []);
    t.mock.timers.tick(1);
    assert.deepEqual(calls, [['tick', true, true]]);
    writer.FIRE_AFTER('tick', 'late', 120);
    t.mock.timers.tick(119);
    assert.equal(calls.length, 1);
    t.mock.timers.tick(1);
    assert.deepEqual(calls[1], ['tick', true, 'late']);
    const cancel = writer.FIRE_AFTER('tick', true, 20);
    cancel();
    t.mock.timers.tick(40);
    assert.equal(calls.length, 2);
    writer.FIRE_AFTER('tick', 'closed', 20);
    writer.parentBag.popNode(writer.label);
    assert.equal(app.binding.bindingFor(writer), null);
    t.mock.timers.tick(40);
    assert.equal(calls.length, 2);
    assert.equal(data.getItem('tick'), null);
    app.dispose();
});

test('FIRE_AFTER on a node of another builder is not tracked and still fires', t => {
    t.mock.timers.enable({apis: ['setTimeout']});
    const builder = new GramlotBuilder();
    const node = sourceTarget(builder.root.div());
    const events = [];
    builder.data.subscribe('test', {any: event => events.push([event.evt, event.fired])});
    node.FIRE_AFTER('shot', 'v', 5);
    t.mock.timers.tick(5);
    assert.deepEqual(events, [['ins', true]]);
    assert.equal(builder.data.getItem('shot'), null);
});
