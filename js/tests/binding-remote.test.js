// Phase 2 of 0.2.16: the `remote` attribute requests the content of its element from a `@source`
// fragment at start and on every change of a `^` parameter (RemoteBinding). Since constitution 11.85 the
// name may be variable and the requests follow `node.requests`: one in flight, its fragment always
// mounted, the first change during the flight waiting with its parameters.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {RemoteBinding} from '../src/binding/remote.js';
import {Bag} from '@genrojs/bag';
import {fromTytx, toTytx} from '@genrojs/tytx';

/** A fake server: `main` and the remote Sources answered by the given functions, in the response envelope. */
function envelope({main, source}) {
    return {close() {}, dispose() {}, async call(text, signal) {
        const {id, contentType, name, params} = fromTytx(text);
        const value = name === 'main' ? await main() : await source(name, params, signal);
        return toTytx({id, contentType, value});
    }};
}

function page(transport) {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'),
        transport: envelope(transport)});
    return {document, app};
}

function wire(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.toTytx();
}

/** A `source` fake that records `[method, params]` and answers a span with the text `<method>:<params.id>`. */
function recorder() {
    const calls = [];
    const source = async (method, params) => {
        calls.push([method, params]);
        return wire(root => root.span(`${method}:${params.id}`));
    };
    return {calls, source};
}

/** Let the pending requests and their mounts settle, after `ms` milliseconds. */
async function settle(ms = 0) {
    if (ms) await new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < 5; i++) await new Promise(resolve => setTimeout(resolve, 0));
}

function slot(document) {
    return document.getElementById('slot').textContent;
}

test('removing remote cancels timing and delayed calls; readding gets a fresh lifecycle', async t => {
    const {calls, source} = recorder();
    const {app} = page({source, main: async () => wire(root => {
        root.div({nodeId: 'slot', remote: 'details', remote_id: '^id', _timing: 0.02, _delay: 40});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    const node = app.src.binding.nodeIds.get('slot');
    const binding = app.src.binding.bindingFor(node);
    const old = binding.remote;
    app.data.setItem('id', 2);
    node.setAttr({remote: null});
    const count = calls.length;
    assert.equal(binding.remote, null);
    assert.equal(old.closed, true);
    await settle(75);
    assert.equal(calls.length, count);
    node.setAttr({remote: 'details', _timing: 0, _delay: 0});
    assert.notEqual(binding.remote, old);
    app.data.setItem('id', 3);
    await settle();
    assert.equal(calls.at(-1)[1].id, 3);
});

test('removing remote suppresses its completion hook but preserves the in-flight fragment contract', async t => {
    let resolve;
    const {app, document} = page({
        main: async () => wire(root => root.div({id:'slot', nodeId:'slot', remote:'details', _onRemote:'this.SET("hook", true);'})),
        source: () => new Promise(done => { resolve = done; }),
    });
    t.after(() => app.dispose());
    await app.start(); await settle();
    app.src.binding.nodeIds.get('slot').setAttr({remote:null});
    resolve(wire(root => root.span('received')));
    await settle();
    assert.equal(slot(document), 'received');
    assert.equal(app.data.getItem('hook'), null);
});

test('remote transforms parameters and refreshes when a referenced attribute changes', async t => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 3});
        root.dataSetter({destination_path: 'unit', value: 'px'});
        root.div({id: 'slot', remote: 'details', remote_id: '^id:{}{unit}', unit: '^unit'});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    assert.deepEqual(calls, [['details', {id: '3px'}]]);
    app.data.setItem('unit', 'em');
    await settle();
    assert.deepEqual(calls, [['details', {id: '3px'}], ['details', {id: '3em'}]]);
    assert.equal(slot(document), 'details:3em');
});

test('remote requests the fragment with its parameters at start and mounts it', async () => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 3});
        root.div('placeholder', {id: 'slot', remote: 'details', remote_id: '^id'});
    })});
    await app.start();
    const target = app.src.source.getItem('main').getNodes().find(node => node.getAttr('remote'));
    assert.ok(app.src.binding.bindingFor(target).remote instanceof RemoteBinding);
    await settle();
    assert.deepEqual(calls, [['details', {id: 3}]]);
    assert.equal(slot(document), 'details:3');
    app.dispose();
});

test('a change of a remote parameter requests again and replaces the content', async () => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 3});
        root.div({id: 'slot', remote: 'details', remote_id: '^id'});
    })});
    await app.start();
    await settle();
    app.data.setItem('id', 4);
    await settle();
    assert.deepEqual(calls, [['details', {id: 3}], ['details', {id: 4}]]);
    assert.equal(slot(document), 'details:4');
    app.dispose();
});

test('a change of a ^ remote name requests the new fragment', async () => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'name', value: 'details'});
        root.div({id: 'slot', remote: '^name', remote_id: 1});
    })});
    await app.start();
    await settle();
    app.data.setItem('name', 'summary');
    await settle();
    assert.deepEqual(calls.map(([method]) => method), ['details', 'summary']);
    assert.equal(slot(document), 'summary:1');
    app.dispose();
});

test('_cachedRemote: equal parameters do not request again', async () => {
    const {calls, source} = recorder();
    const {app} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 3});
        root.dataSetter({destination_path: 'other', value: 'a'});
        root.div({id: 'slot', remote: 'details', remote_id: '^id', remote_other: '=other', _cachedRemote: true});
    })});
    await app.start();
    await settle();
    app.data.setItem('id', 4);
    await settle();
    app.data.setItem('id', 3);
    app.data.setItem('id', 3);
    await settle();
    app.data.setItem('id', 3, {flag: true});
    await settle();
    assert.deepEqual(calls.map(([, params]) => params.id), [3, 4, 3]);
    app.dispose();
});

test('_cachedRemote: returning to the mounted parameters during a flight waits and mounts them after it', async t => {
    const calls = [];
    let answer;
    let signal;
    const source = async (method, params, abort) => {
        calls.push(params.id);
        if (params.id === 'B') {
            signal = abort;
            return new Promise(resolve => { answer = () => resolve(wire(root => root.span('B'))); });
        }
        return wire(root => root.span(params.id));
    };
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 'A'});
        root.div({id: 'slot', remote: 'details', remote_id: '^id', _cachedRemote: true,
            _onRemote: "this.SET('mounted', [this.GET('mounted'), id].filter(Boolean).join())"});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    assert.equal(slot(document), 'A');
    app.data.setItem('id', 'B');
    await settle();
    // B is in flight: the cache compares with it, so A is not a hit and waits.
    app.data.setItem('id', 'A');
    await settle();
    const target = app.src.source.getItem('main').getNodes().find(node => node.getAttr('remote'));
    assert.deepEqual(target.requests.pending.params, {id: 'A'});
    answer();
    await settle();
    assert.equal(signal.aborted, false);
    assert.equal(slot(document), 'A');
    assert.equal(app.data.getItem('mounted'), 'A,B,A');
    assert.deepEqual(calls, ['A', 'B', 'A']);
    // Equal to the fragment mounted last, with nothing in flight: a cache hit.
    app.data.setItem('id', 'A', {flag: true});
    await settle();
    assert.deepEqual(calls, ['A', 'B', 'A']);
});

test('_cachedRemote: a changed reactive fragment name is not a cache hit', async t => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'name', value: 'details'});
        root.div({id: 'slot', remote: '^name', remote_id: 1, _cachedRemote: true});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    app.data.setItem('name', 'summary');
    await settle();
    assert.equal(slot(document), 'summary:1');
    assert.deepEqual(calls, [['details', {id: 1}], ['summary', {id: 1}]]);
    app.data.setItem('name', 'summary', {flag: true});
    await settle();
    assert.equal(calls.length, 2);
});

test('_cachedRemote: nested Bag parameter changes invalidate the mounted cache', async t => {
    const calls = [];
    const source = async (_method, params) => {
        const id = params.filter.getItem('record.id');
        calls.push(id);
        return wire(root => root.span(id));
    };
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'filter.record.id', value: 'A'});
        root.div({id: 'slot', remote: 'details', remote_filter: '^filter', _cachedRemote: true});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    const filter = app.data.getItem('filter');
    app.data.setItem('filter.record.id', 'B');
    await settle();
    assert.equal(app.data.getItem('filter'), filter);
    assert.equal(slot(document), 'B');
    assert.deepEqual(calls, ['A', 'B']);
    // An attribute event on the parameter's containing node leaves its value unchanged.
    app.data.setItem('filter', filter, {flag: true});
    await settle();
    assert.deepEqual(calls, ['A', 'B']);
});

for (const [kind, create, change] of [
    ['object', () => ({id: 'A'}), value => { value.id = 'B'; }],
    ['array', () => ['A'], value => { value[0] = 'B'; }],
    ['date', () => new Date('2026-10-01T00:00:00Z'), value => { value.setUTCDate(2); }],
    ['Bag attribute', () => {
        const value = new Bag();
        value.setItem('id', 'A', {labels: ['A']});
        return value;
    }, value => { value.getNode('id').attr.labels[0] = 'B'; }],
]) {
    test(`_cachedRemote: ${kind} parameters are captured before the pending response`, async t => {
        const calls = [];
        const answers = [];
        const source = (_method, params) => new Promise(resolve => {
            calls.push(params.filter);
            const text = String(calls.length);
            answers.push(() => resolve(wire(root => root.span(text))));
        });
        const {app, document} = page({source, main: async () => wire(root => {
            root.div({id: 'slot', remote: 'details', remote_filter: '=filter', _cachedRemote: true});
        })});
        t.after(() => app.dispose());
        const value = create();
        app.data.setItem('filter', value);
        await app.start();
        await settle();
        assert.equal(calls.length, 1);
        change(value);
        answers[0]();
        await settle();
        assert.equal(slot(document), '1');
        const target = app.src.source.getItem('main').getNodes().find(node => node.getAttr('remote'));
        const remote = app.src.binding.bindingFor(target).remote;
        const update = remote.update();
        await settle();
        assert.equal(calls.length, 2);
        assert.notDeepEqual(calls[0], calls[1]);
        answers[1]();
        await update;
        assert.equal(slot(document), '2');
        await remote.update();
        assert.equal(calls.length, 2);
    });
}

test('_cachedRemote: reordered object keys make another request under TYTX comparison', async t => {
    const calls = [];
    const source = async (_method, params) => {
        calls.push(params.filter);
        return wire(root => root.span(String(calls.length)));
    };
    const {app, document} = page({source, main: async () => wire(root => {
        root.div({id: 'slot', remote: 'details', remote_filter: '^filter', _cachedRemote: true});
    })});
    t.after(() => app.dispose());
    app.data.setItem('filter', {a: 1, b: 2});
    await app.start();
    await settle();
    app.data.setItem('filter', {b: 2, a: 1});
    await settle();
    assert.equal(calls.length, 2);
    assert.deepEqual(calls[0], calls[1]);
    assert.equal(slot(document), '2');
    const target = app.src.source.getItem('main').getNodes().find(node => node.getAttr('remote'));
    await app.src.binding.bindingFor(target).remote.update();
    assert.equal(calls.length, 2);
});

test('_if false: no request, and _else runs with the parameters', async () => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 0});
        root.div('none', {id: 'slot', remote: 'details', remote_id: '^id', _if: 'id > 0',
            _else: "this.setRelativeData('skipped', id)"});
    })});
    await app.start();
    await settle();
    assert.deepEqual(calls, []);
    assert.equal(app.data.getItem('skipped'), 0);
    assert.equal(slot(document), 'none');
    app.data.setItem('id', 5);
    await settle();
    assert.deepEqual(calls, [['details', {id: 5}]]);
    assert.equal(slot(document), 'details:5');
    app.dispose();
});

test('_onRemote runs after the fragment is mounted, with the parameters', async () => {
    const {source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 7});
        root.div({id: 'slot', remote: 'details', remote_id: '^id',
            _onRemote: "this.setRelativeData('mounted', id + ':' + this.value.getNodes().length)"});
    })});
    await app.start();
    await settle();
    assert.equal(slot(document), 'details:7');
    assert.equal(app.data.getItem('mounted'), '7:1');
    app.dispose();
});

test('two quick changes: the answer in flight is mounted, then the first change; the second does nothing', async () => {
    const pending = [];
    const signals = [];
    const source = (method, params, signal) => new Promise(resolve => {
        signals.push(signal);
        pending.push(() => resolve(wire(root => root.span(`${method}:${params.id}`))));
    });
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '^id'});
    })});
    await app.start();
    await settle();
    app.data.setItem('id', 2);
    app.data.setItem('id', 3);
    await settle();
    assert.equal(pending.length, 1);
    pending[0]();
    await settle();
    assert.equal(slot(document), 'details:1');
    // The waiting call is sent with the parameters of the first change.
    assert.equal(pending.length, 2);
    pending[1]();
    await settle();
    assert.equal(slot(document), 'details:2');
    assert.deepEqual(signals.map(signal => signal.aborted), [false, false]);
    // Accepted: the content stays behind the Data until the next change.
    assert.equal(app.data.getItem('id'), 3);
    app.data.setItem('id', 4);
    await settle();
    pending[2]();
    await settle();
    assert.equal(slot(document), 'details:4');
    app.dispose();
});

test('removing the node cancels the pending request and closes its RemoteBinding', async () => {
    let signal = null;
    let resolve = null;
    let requested = 0;
    const source = (_method, _params, abort) => new Promise(done => { requested += 1; signal = abort; resolve = done; });
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '^id'});
    })});
    await app.start();
    await settle();
    const main = app.src.source.getItem('main');
    const target = main.getNodes().find(node => node.getAttr('remote'));
    const remote = app.src.binding.bindingFor(target).remote;
    main.popNode(target.label);
    assert.equal(signal.aborted, true);
    assert.equal(remote.closed, true);
    resolve(wire(root => root.span('late')));
    await settle();
    assert.equal(document.getElementById('slot'), null);
    app.data.setItem('id', 2);
    await remote.update();
    assert.equal(requested, 1);
    app.dispose();
});

test('remote on a node of a fragment mounted by another remote', async () => {
    const calls = [];
    const source = async (method, params) => {
        calls.push([method, params]);
        if (method === 'outer') {
            return wire(root => root.div('inner placeholder', {id: 'inner', remote: 'inner', remote_id: '^id'}));
        }
        return wire(root => root.span(`inner:${params.id}`));
    };
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 9});
        root.div({id: 'slot', remote: 'outer'});
    })});
    await app.start();
    await settle();
    assert.deepEqual(calls, [['outer', {}], ['inner', {id: 9}]]);
    assert.equal(document.getElementById('inner').textContent, 'inner:9');
    app.data.setItem('id', 10);
    await settle();
    assert.equal(document.getElementById('inner').textContent, 'inner:10');
    app.dispose();
});

test('a node without remote has no RemoteBinding; a remote node activates _if, _else and _onRemote', async () => {
    const {source} = recorder();
    const {app} = page({source, main: async () => wire(root => {
        root.div('plain', {id: 'plain'});
        root.div({id: 'slot', remote: 'details', _if: 'true', _else: 'null', _onRemote: 'null'});
    })});
    await app.start();
    await settle();
    const [plain, target] = app.src.source.getItem('main').getNodes();
    assert.equal(app.src.binding.bindingFor(plain).remote, null);
    assert.deepEqual(target.codeAttributes().map(([name]) => name), ['_if', '_else', '_onRemote']);
    app.dispose();
});

test('_if false while a request is in flight is a readiness condition: no abort, the fragment is mounted', async () => {
    const signals = [];
    const answers = [];
    const source = (method, params, signal) => new Promise(done => {
        signals.push(signal);
        answers.push(() => done(wire(root => root.span(`${method}:${params.id}`))));
    });
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '^id', _if: 'id > 0',
            _else: "this.setRelativeData('skipped', id)"});
    })});
    await app.start();
    await settle();
    app.data.setItem('id', 0);
    assert.equal(signals[0].aborted, false);
    assert.equal(app.data.getItem('skipped'), 0);
    answers[0]();
    await settle();
    assert.equal(slot(document), 'details:1');
    // No request while false; the content stays as it is.
    assert.equal(answers.length, 1);
    app.dispose();
});

test('a failed request rejects naming the node; with _cachedRemote the same parameters are requested again', async () => {
    let fail = false;
    const calls = [];
    const source = async (method, params) => {
        calls.push(params.id);
        if (fail) throw new Error('boom');
        return wire(root => root.span(`${method}:${params.id}`));
    };
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '=id', _cachedRemote: true});
    })});
    await app.start();
    await settle();
    const target = app.src.source.getItem('main').getNodes().find(node => node.getAttr('remote'));
    const remote = app.src.binding.bindingFor(target).remote;
    fail = true;
    app.data.setItem('id', 2);
    await assert.rejects(remote.update(), error => error.message.startsWith(`div '${target.label}': remote 'details' failed: `)
        && error.cause instanceof Error);
    fail = false;
    await remote.update();
    assert.deepEqual(calls, [1, 2, 2]);
    assert.equal(slot(document), 'details:2');
    await remote.update();
    assert.deepEqual(calls, [1, 2, 2]);
    app.dispose();
});

test('a change of the Data context of an ancestor requests the fragment for the new context', async () => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'a.id', value: 1});
        root.dataSetter({destination_path: 'b.id', value: 2});
        root.div({datapath: 'a', id: 'pane'}).div({id: 'slot', remote: 'details', remote_id: '^.id'});
    })});
    await app.start();
    await settle();
    const pane = app.src.source.getItem('main').getNodes().find(node => node.getAttr('datapath'));
    pane.setAttr({datapath: 'b'});
    await settle();
    assert.deepEqual(calls, [['details', {id: 1}], ['details', {id: 2}]]);
    assert.equal(slot(document), 'details:2');
    app.dispose();
});

/** The `remote` node of `app` and its RemoteBinding. */
function remoteOf(app) {
    const target = app.src.source.getItem('main').getNodes().find(node => node.getAttr('remote'));
    return {target, remote: app.src.binding.bindingFor(target).remote};
}

test('a variable name: ^ and = pointers, and a dotted path from the page, are sent as they are', async t => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'name', value: 'orders.details'});
        root.dataSetter({destination_path: 'read', value: 'summary'});
        root.div({id: 'slot', remote: '^name', remote_id: 1});
        root.div({id: 'other', remote: '=read', remote_id: 2});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    assert.deepEqual(calls.map(([method]) => method).sort(), ['orders.details', 'summary']);
    assert.equal(slot(document), 'orders.details:1');
    // A `=` name is read when a call starts and does not trigger one.
    app.data.setItem('read', 'other');
    await settle();
    assert.equal(calls.length, 2);
});

test('an empty, null or malformed name rejects the call naming the node, like a name outside the syntax', async t => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'name', value: 'details'});
        root.div('old', {id: 'slot', remote: '=name', remote_id: 1});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    const {target, remote} = remoteOf(app);
    for (const name of ['', null, 'a-b', 'a..b', '.a', 'a.', 'a._b', 'caffè', 'a.b\n']) {
        app.data.setItem('name', name);
        await assert.rejects(remote.update(), error => error.message.startsWith(`div '${target.label}': remote '${name}' failed: `)
            && error.cause instanceof TypeError && /Method name must match/.test(error.cause.message));
    }
    assert.equal(calls.length, 1);
    assert.equal(slot(document), 'details:1');
    assert.equal(target.requests.inflight, null);
});

test('a waiting call with an empty name rejects when its turn comes; the request in flight is mounted', async t => {
    const answers = [];
    const source = (method, params) => new Promise(done => answers.push(() => done(wire(root => root.span(`${method}:${params.id}`)))));
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'name', value: 'details'});
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: '=name', remote_id: '=id'});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    const {target, remote} = remoteOf(app);
    app.data.setItem('name', '');
    const waiting = remote.update();
    assert.deepEqual([target.requests.pending.method, target.requests.inflight.method], ['', 'details']);
    answers[0]();
    await assert.rejects(waiting, error => /remote '' failed: Method name must match/.test(error.message));
    assert.equal(slot(document), 'details:1');
    assert.equal(answers.length, 1);
});

test('node.requests: both fields empty when idle; in flight the method, the parameters sent and the send time', async t => {
    const answers = [];
    const source = (method, params) => new Promise(done => answers.push(() => done(wire(root => root.span(String(params.id))))));
    const {app} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div({id: 'slot', remote: 'details', remote_id: '^id'});
    })});
    t.after(() => app.dispose());
    const before = Date.now();
    await app.start();
    await settle();
    const {target} = remoteOf(app);
    const {inflight} = target.requests;
    assert.deepEqual([inflight.method, inflight.params], ['details', {id: 1}]);
    assert.ok(inflight.sentAt >= before && inflight.sentAt <= Date.now());
    assert.ok(Object.isFrozen(inflight));
    assert.equal(target.requests.pending, null);
    app.data.setItem('id', 2);
    assert.deepEqual([target.requests.pending.method, target.requests.pending.params], ['details', {id: 2}]);
    // The saved parameters are a copy: a later change of the Data does not alter them.
    app.data.setItem('id', 3);
    assert.deepEqual(target.requests.pending.params, {id: 2});
    answers[0]();
    await settle();
    assert.deepEqual(target.requests.inflight.params, {id: 2});
    assert.equal(target.requests.pending, null);
    answers[1]();
    await settle();
    assert.deepEqual([target.requests.inflight, target.requests.pending], [null, null]);
});

test('_onCalling runs before each call with the parameters; false makes no call', async t => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '^id',
            _onCalling: "this.SET('calling', id); return id !== 2"});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    app.data.setItem('id', 2);
    await settle();
    assert.equal(app.data.getItem('calling'), 2);
    assert.deepEqual(calls.map(([, params]) => params.id), [1]);
    assert.equal(slot(document), 'details:1');
    app.data.setItem('id', 3);
    await settle();
    assert.deepEqual(calls.map(([, params]) => params.id), [1, 3]);
});

test('cancel() in _onCalling ignores the answer in flight and sends the new call at once, in place of the waiting one', async t => {
    const answers = [];
    const signals = [];
    const source = (method, params, signal) => new Promise(done => {
        signals.push(signal);
        answers.push(() => done(wire(root => root.span(`${method}:${params.id}`))));
    });
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '^id',
            _onCalling: 'if (id === 3 && this.requests.inflight) this.requests.inflight.cancel()'});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    const {target} = remoteOf(app);
    app.data.setItem('id', 2);
    assert.deepEqual(target.requests.pending.params, {id: 2});
    app.data.setItem('id', 3);
    await settle();
    assert.equal(answers.length, 2);
    assert.equal(target.requests.pending, null);
    assert.deepEqual(target.requests.inflight.params, {id: 3});
    // The cancelled request is not aborted: the server may finish it, the node ignores its answer.
    assert.equal(signals[0].aborted, false);
    answers[1]();
    await settle();
    assert.equal(slot(document), 'details:3');
    answers[0]();
    await settle();
    assert.equal(slot(document), 'details:3');
    assert.equal(answers.length, 2);
});

test('cancel() outside _onCalling ignores the answer in flight and sends the waiting call', async t => {
    const answers = [];
    const source = (method, params) => new Promise(done => answers.push(() => done(wire(root => root.span(`${method}:${params.id}`)))));
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '^id'});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    const {target} = remoteOf(app);
    app.data.setItem('id', 2);
    target.requests.inflight.cancel();
    assert.deepEqual(target.requests.inflight.params, {id: 2});
    assert.equal(target.requests.pending, null);
    answers[0]();
    answers[1]();
    await settle();
    assert.equal(slot(document), 'details:2');
});

test('_delay debounces the changes, never the request in flight; _userChanges calls only for the level node', async t => {
    const answers = [];
    const signals = [];
    const ids = [];
    const source = (method, params, signal) => new Promise(done => {
        ids.push(params.id);
        signals.push(signal);
        answers.push(() => done(wire(root => root.span(`${method}:${params.id}`))));
    });
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.dataSetter({destination_path: 'c.id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '^id', _delay: 20});
        root.div('old', {id: 'user', remote: 'user', remote_id: '^c.id', _userChanges: true});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    assert.deepEqual(ids, [1, 1]);
    app.data.setItem('id', 2);
    app.data.setItem('id', 3);
    await settle(40);
    assert.deepEqual(ids, [1, 1]);
    assert.deepEqual(signals.map(signal => signal.aborted), [false, false]);
    answers[0]();
    answers[1]();
    await settle();
    assert.deepEqual(ids, [1, 1, 3]);
    // A change of a branch above the parameter is not of level node.
    app.data.setItem('c', new Bag({id: 2}));
    await settle();
    assert.equal(ids.length, 3);
    app.data.setItem('c.id', 4);
    await settle();
    assert.deepEqual(ids, [1, 1, 3, 4]);
    answers[2]();
    await settle();
    assert.equal(slot(document), 'details:3');
});

test('_timing requests the fragment again every period; a pointer change restarts it, 0 stops it', async t => {
    const {calls, source} = recorder();
    const {app} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'period', value: 0.02});
        root.div({id: 'slot', remote: 'details', remote_id: 1, _timing: '^period'});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle(70);
    const counted = calls.length;
    assert.ok(counted >= 3, `${counted} calls`);
    app.data.setItem('period', 0);
    await settle();
    const stopped = calls.length;
    await settle(60);
    assert.equal(calls.length, stopped);
});

test('a fragment requested from code replaces the record of _cachedRemote: no false cache hit afterwards', async t => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div({id: 'slot', remote: 'details', remote_id: '^id', _cachedRemote: true});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    const {target, remote} = remoteOf(app);
    assert.equal(await app.src.remoteSource(target, 'other', {id: 9}), true);
    assert.equal(slot(document), 'other:9');
    await remote.update();
    assert.deepEqual(calls.map(([method, params]) => `${method}:${params.id}`), ['details:1', 'other:9', 'details:1']);
    assert.equal(slot(document), 'details:1');
    await remote.update();
    assert.equal(calls.length, 3);
});

test('removing the node aborts the request in flight and sends no waiting call', async t => {
    const signals = [];
    const source = (_method, _params, signal) => new Promise(() => { signals.push(signal); });
    const {app} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '^id'});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    const {target} = remoteOf(app);
    app.data.setItem('id', 2);
    assert.ok(target.requests.pending);
    app.src.source.getItem('main').popNode(target.label);
    await settle();
    assert.deepEqual(signals.map(signal => signal.aborted), [true]);
    assert.deepEqual([target.requests.inflight, target.requests.pending], [null, null]);
});

test('_else="this.setValue(null)" clears the content when _if turns false; true again mounts the fragment again', async t => {
    const {calls, source} = recorder();
    const {app, document} = page({source, main: async () => wire(root => {
        root.dataSetter({destination_path: 'id', value: 1});
        root.div('old', {id: 'slot', remote: 'details', remote_id: '^id', _if: 'id > 0', _else: 'this.setValue(null)'});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    assert.equal(slot(document), 'details:1');
    app.data.setItem('id', 0);
    await settle();
    assert.equal(slot(document), '');
    app.data.setItem('id', 2);
    await settle();
    assert.equal(slot(document), 'details:2');
    assert.deepEqual(calls.map(([, params]) => params.id), [1, 2]);
});
