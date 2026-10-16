// Phase 2 of 0.2.16: the `remote` attribute requests the content of its element from a `@source`
// fragment at start and on every change of a `^` parameter (RemoteBinding).
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {RemoteBinding} from '../src/binding/remote.js';
import {Bag} from '@genrojs/bag';
import {fromTytx, toTytx} from '@genrojs/tytx';

/** A fake server: `main` and the remote Sources answered by the given functions, in the response envelope. */
function envelope({main, source}) {
    return {async call(text, signal) {
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

/** Let the pending requests and their mounts settle. */
async function settle() {
    for (let i = 0; i < 5; i++) await new Promise(resolve => setTimeout(resolve, 0));
}

function slot(document) {
    return document.getElementById('slot').textContent;
}

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

test('_cachedRemote: returning to mounted parameters cancels a different pending request', async t => {
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
            _onRemote: "this.setRelativeData('mounted', id)"});
    })});
    t.after(() => app.dispose());
    await app.start();
    await settle();
    assert.equal(slot(document), 'A');
    app.data.setItem('id', 'B');
    await settle();
    app.data.setItem('id', 'A');
    await settle();
    // The transport deliberately answers after cancellation: latest wins must hold at the mount.
    answer();
    await settle();
    assert.equal(slot(document), 'A');
    assert.equal(signal.aborted, true);
    assert.equal(app.data.getItem('mounted'), 'A');
    assert.deepEqual(calls, ['A', 'B']);
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

test('two quick changes: only the latest fragment is mounted', async () => {
    const pending = [];
    const source = (method, params) => new Promise(resolve => {
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
    assert.equal(pending.length, 3);
    pending[2]();
    await settle();
    pending[1]();
    pending[0]();
    await settle();
    assert.equal(slot(document), 'details:3');
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

test('_if false while a request is in flight cancels it: its fragment is not mounted after _else', async () => {
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
    assert.equal(signals[0].aborted, true);
    assert.equal(app.data.getItem('skipped'), 0);
    answers[0]();
    await settle();
    assert.equal(slot(document), 'old');
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
