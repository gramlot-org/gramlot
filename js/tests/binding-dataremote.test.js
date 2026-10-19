// The `dataRemote` data-element (0.2.16): a RemoteProvider installs an RpcResolver on its Data node,
// which calls the endpoint when the node is read and its `cacheTime` has expired. A read never waits:
// the loaded value reaches the `^` consumers through the Data event, except with `cacheTime: 0`.
// Since constitution 11.85 the loads of the node follow `node.requests`: one in flight, its value always
// written, the first change during the flight waiting.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Gramlot, RpcError} from '../src/index.js';
import {RpcResolver} from '../src/binding/rpc-resolver.js';
import {mount} from './fixtures/mount.js';

/**
 * A page whose transport records every request envelope and answers it with `answer(request)`:
 * a value, or a promise of one. `{error}` answers an error outcome.
 */
function page(answer = request => request.params.table ?? null) {
    const window = new JSDOM('<main></main>', {virtualConsole: new VirtualConsole()}).window;
    const document = window.document;
    const requests = [];
    const transport = {
        close() {},
        dispose() {},
        async call(text, signal) {
            const request = fromTytx(text);
            requests.push({...request, signal});
            const outcome = await answer(request);
            const body = outcome?.error ? {error: outcome.error} : {value: outcome};
            return toTytx({id: request.id, contentType: request.contentType, ...body});
        },
    };
    const app = new Gramlot({document, pageId: 'p1', element: document.querySelector('main'), transport});
    return {app, data: app.data, requests, byId: id => document.getElementById(id)};
}

/** Let the pending calls answer. */
function settle(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** A promise with its resolve function. */
function deferred() {
    let resolve;
    const promise = new Promise(done => { resolve = done; });
    return {promise, resolve};
}

test('a ^ consumer of the path is projected with the value after the load', async () => {
    const {app, data, requests, byId} = page();
    mount(app, root => {
        const pane = root.div({datapath: 'page'});
        pane.dataRemote({destination_path: '.menu', method: 'loadMenu', table: 'x'});
        pane.span('^.menu', {id: 'menu'});
    });
    assert.ok(data.getResolver('page.menu') instanceof RpcResolver);
    assert.equal(requests.length, 1);
    assert.deepEqual([requests[0].contentType, requests[0].name, requests[0].params], ['data', 'loadMenu', {table: 'x'}]);
    assert.equal(byId('menu').textContent, '');
    await settle();
    assert.equal(byId('menu').textContent, 'x');
    assert.equal(requests.length, 1);
    app.dispose();
});

test('a read returns the current value and starts the load; the node then holds the typed value', async () => {
    const day = new Date(Date.UTC(2026, 9, 12));
    const {app, data, requests} = page(() => day);
    app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu'});
    assert.equal(requests.length, 0);
    assert.equal(data.getItem('menu'), null);
    const resolver = data.getResolver('menu');
    assert.equal((await resolver.loading).getTime(), day.getTime());
    assert.equal(data.getItem('menu').getTime(), day.getTime());
    assert.equal(requests.length, 1);
    app.dispose();
});

test('cacheTime: null resolves once; a read during the load starts no second load', async () => {
    const {app, data, requests} = page();
    app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu', table: 'x'});
    assert.deepEqual([data.getItem('menu'), data.getItem('menu')], [null, null]);
    await data.getResolver('menu').loading;
    assert.equal(data.getItem('menu'), 'x');
    assert.equal(requests.length, 1);
    app.dispose();
});

test('cacheTime: 0 writes the loaded value without the Data event: a value per explicit read', async () => {
    const {app, data, requests, byId} = page();
    mount(app, root => {
        root.dataRemote({destination_path: 'menu', method: 'loadMenu', cacheTime: 0, table: 'x'});
        root.span('^menu', {id: 'menu'});
    });
    assert.equal(requests.length, 1);
    await settle();
    assert.equal(byId('menu').textContent, '');
    assert.equal(data.getItem('menu', null, true), 'x');
    assert.equal(requests.length, 1);
    assert.equal(data.getItem('menu'), 'x');
    assert.equal(requests.length, 2);
    await settle();
    assert.equal(requests.length, 2);
    app.dispose();
});

test('cacheTime: 0 with a deferred ^ consumer loads once: no load loop', async () => {
    const {app, requests} = page();
    mount(app, root => {
        root.dataRemote({destination_path: 'menu', method: 'loadMenu', cacheTime: 0, table: 'x'});
        root.dataController({script: 'this.SET("seen", v)', v: '^menu', _delay: 1});
        root.span('^menu');
    });
    await settle(100);
    assert.equal(requests.length, 1);
    app.dispose();
});

test('cacheTime: 1 serves the cache within one second and loads again after it', async t => {
    t.mock.timers.enable({apis: ['Date']});
    const {app, data, requests} = page();
    app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu', cacheTime: 1, table: 'x'});
    data.getItem('menu');
    await data.getResolver('menu').loading;
    t.mock.timers.tick(500);
    assert.equal(data.getItem('menu'), 'x');
    assert.equal(requests.length, 1);
    t.mock.timers.tick(600);
    assert.equal(data.getItem('menu'), 'x');
    assert.equal(requests.length, 2);
    await data.getResolver('menu').loading;
    app.dispose();
});

test('a ^ param changed installs a new resolver that loads at once; the consumer receives the new value', async () => {
    const {app, data, requests, byId} = page();
    data.setItem('table', 'a');
    mount(app, root => {
        root.dataRemote({destination_path: 'menu', method: 'loadMenu', table: '^table'});
        root.span('^menu', {id: 'menu'});
    });
    const first = data.getResolver('menu');
    await settle();
    assert.equal(byId('menu').textContent, 'a');
    data.setItem('table', 'b');
    assert.notEqual(data.getResolver('menu'), first);
    assert.equal(requests.length, 2);
    await settle();
    assert.equal(byId('menu').textContent, 'b');
    assert.deepEqual(requests.map(request => request.params), [{table: 'a'}, {table: 'b'}]);
    app.dispose();
});

test('a change during the load waits: the answer in flight is written, then the new load is sent', async () => {
    const answer = deferred();
    const {app, data, requests, byId} = page(request => request.params.table === 'a' ? answer.promise : 'b');
    data.setItem('table', 'a');
    mount(app, root => {
        root.dataRemote({destination_path: 'menu', method: 'loadMenu', table: '^table'});
        root.span('^menu', {id: 'menu'});
    });
    const first = data.getResolver('menu').loading;
    data.setItem('table', 'b');
    assert.equal(requests[0].signal.aborted, false);
    assert.equal(requests.length, 1);
    const second = data.getResolver('menu').loading;
    assert.notEqual(second, null);
    answer.resolve('a');
    assert.equal(await first, 'a');
    assert.equal(await second, 'b');
    await settle();
    assert.equal(byId('menu').textContent, 'b');
    assert.deepEqual(requests.map(request => request.params.table), ['a', 'b']);
    app.dispose();
});

test('_if false during the load does not abort it: its value is written and the resolver is removed', async () => {
    const answer = deferred();
    const {app, data, requests} = page(() => answer.promise);
    data.setItem('table', 'a');
    mount(app, root => root.dataRemote({destination_path: 'menu', method: 'loadMenu', table: '^table', _if: 'table'}));
    data.getItem('menu');
    const loading = data.getResolver('menu').loading;
    data.setItem('table', '');
    assert.equal(data.getResolver('menu'), null);
    assert.equal(requests[0].signal.aborted, false);
    answer.resolve('a');
    assert.equal(await loading, 'a');
    assert.equal(data.getItem('menu'), 'a');
    assert.equal(requests.length, 1);
    app.dispose();
});

test('_onCalling runs before each load with the arguments; false makes no load', async () => {
    const {app, data, requests} = page();
    data.setItem('allow', false);
    mount(app, root => root.dataRemote({destination_path: 'menu', method: 'loadMenu', cacheTime: 0, table: 'x',
        _onCalling: 'this.SET("calls", (this.GET("calls") || 0) + 1); return this.GET("allow")'}));
    assert.equal(data.getItem('menu'), null);
    assert.equal(data.getResolver('menu').loading, null);
    assert.deepEqual([data.getItem('calls'), requests.length], [1, 0]);
    data.setItem('allow', true);
    data.getItem('menu');
    assert.equal(await data.getResolver('menu').loading, 'x');
    data.getItem('menu');
    await data.getResolver('menu').loading;
    assert.deepEqual([data.getItem('calls'), requests.length], [3, 2]);
    app.dispose();
});

test('an empty method rejects the load; the provider names the node', async () => {
    const {app, data, requests} = page();
    data.setItem('m', '');
    mount(app, root => root.dataRemote({destination_path: 'menu', method: '=m'}));
    const resolver = data.getResolver('menu');
    const failures = [];
    resolver.onError = error => failures.push(error);
    data.getItem('menu');
    await assert.rejects(resolver.loading, error => error instanceof TypeError && /Method name must match/.test(error.message));
    await settle();
    assert.equal(failures.length, 1);
    assert.equal(requests.length, 0);
    app.dispose();
});

test('_if false removes the resolver and the node keeps its value; _else runs as inline code', async () => {
    const {app, data, requests} = page();
    data.setItem('table', 'a');
    mount(app, root => root.dataRemote({destination_path: 'menu', method: 'loadMenu', table: '^table',
        _if: 'table', _else: 'this.SET("else", table)'}));
    data.getItem('menu');
    await data.getResolver('menu').loading;
    data.setItem('table', '');
    assert.equal(data.getResolver('menu'), null);
    assert.equal(data.getItem('menu'), 'a');
    assert.equal(data.getItem('else'), '');
    data.setItem('table', 'b');
    const resolver = data.getResolver('menu');
    assert.ok(resolver instanceof RpcResolver);
    // The resolver removed by the false `_if` had loaded: the new one loads at once, without a read.
    assert.notEqual(resolver.loading, null);
    assert.equal(data.getItem('menu', null, true), 'a');
    await resolver.loading;
    assert.equal(data.getItem('menu'), 'b');
    assert.equal(requests.length, 2);
    app.dispose();
});

test('the removal of the node removes the resolver and aborts the pending load', async () => {
    const answer = deferred();
    const {app, data, requests} = page(() => answer.promise);
    const node = sourceTarget(app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu'}));
    data.getItem('menu');
    const pending = data.getResolver('menu').loading;
    node.parentBag.popNode(node.label);
    assert.equal(data.getResolver('menu'), null);
    assert.equal(requests[0].signal.aborted, true);
    await assert.rejects(pending, error => error.name === 'AbortError');
    answer.resolve('late');
    await settle();
    assert.equal(data.getItem('menu'), null);
    app.dispose();
});

test('an endpoint error rejects loading with an RpcError; the node value is unchanged and the next read loads again', async () => {
    let fail = true;
    const {app, data, requests} = page(() => (fail
        ? {error: {code: 'application_error', name: 'ValueError', message: 'no menu'}} : 'menu'));
    data.setItem('menu', 'old');
    app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu'});
    const resolver = data.getResolver('menu');
    // The provider's onError throws an unhandled rejection; here the failures are recorded instead.
    const failures = [];
    resolver.onError = error => failures.push(error);
    assert.equal(data.getItem('menu'), 'old');
    await assert.rejects(resolver.loading, error => error instanceof RpcError && error.message.includes('no menu'));
    await settle();
    assert.equal(failures.length, 1);
    assert.ok(failures[0] instanceof RpcError);
    assert.equal(data.getItem('menu', null, true), 'old');
    fail = false;
    assert.equal(data.getItem('menu'), 'old');
    assert.equal(await resolver.loading, 'menu');
    assert.equal(data.getItem('menu'), 'menu');
    assert.equal(requests.length, 2);
    app.dispose();
});

test('method through a pointer; control attributes are not sent as params', async () => {
    const {app, data, requests} = page(() => 'ok');
    data.setItem('m', 'loadMenu');
    app.src.builder.root.dataRemote({destination_path: 'menu', method: '=m', cacheTime: 5, _delay: 0, table: 'x'});
    data.getItem('menu');
    assert.equal(await data.getResolver('menu').loading, 'ok');
    assert.deepEqual([requests[0].name, requests[0].params], ['loadMenu', {table: 'x'}]);
    assert.equal(data.getResolver('menu').cacheTime, 5);
    app.dispose();
});

test('authoring: the lifecycle attributes are refused on dataRemote; _delay, _timing, _userChanges are accepted', () => {
    for (const name of ['_init', '_onStart', '_onBuilt']) {
        const {app} = page();
        assert.throws(() => mount(app, root => root.dataRemote({destination_path: 'menu', method: 'loadMenu', [name]: true})),
            new RegExp(`dataRemote 'dataRemote_0': '${name}' is not accepted on dataRemote`));
        app.dispose();
    }
    const {app} = page();
    mount(app, root => root.dataRemote({destination_path: 'menu', method: 'loadMenu', _delay: 10, _timing: 0, _userChanges: true}));
    app.dispose();
    const other = page();
    assert.doesNotThrow(() => mount(other.app, root => root.div({_delay: 10}))); // inherited button delay
    other.app.dispose();
});

test('the provider throws a failed load again naming the node; an abort is not a failure', async () => {
    const answer = deferred();
    const {app, data} = page(() => answer.promise);
    const node = sourceTarget(app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu'}));
    const resolver = data.getResolver('menu');
    assert.throws(() => resolver.onError(new Error('no menu')),
        error => error.message === `dataRemote '${node.label}': dataRemote 'loadMenu' failed: no menu` && error.cause.message === 'no menu');
    const failures = [];
    resolver.onError = error => failures.push(error);
    data.getItem('menu');
    const loading = resolver.loading;
    node.parentBag.popNode(node.label);
    await assert.rejects(loading, error => error.name === 'AbortError');
    await settle();
    assert.deepEqual(failures, []);
    app.dispose();
});

test('an aborted load writes nothing, even when its answer had already arrived', async () => {
    const {app, data} = page();
    app.rpc.call = () => Promise.resolve('late');
    const node = sourceTarget(app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu'}));
    const resolver = data.getResolver('menu');
    const failures = [];
    resolver.onError = error => failures.push(error);
    const loading = resolver.refresh();
    node.parentBag.popNode(node.label);
    await assert.rejects(loading, error => error.name === 'AbortError');
    assert.notEqual(data.getItem('menu', null, true), 'late');
    assert.equal(resolver.loaded, false);
    assert.deepEqual(failures, []);
    app.dispose();
});

test('a load ignored by cancel() writes nothing; the next read loads again', async () => {
    const answers = [deferred(), deferred()];
    let index = 0;
    const {app, data, requests} = page(() => answers[index++].promise);
    const node = sourceTarget(app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu'}));
    data.getItem('menu');
    const loading = data.getResolver('menu').loading;
    node.requests.inflight.cancel();
    answers[0].resolve('ignored');
    assert.equal(await loading, undefined);
    assert.equal(data.getItem('menu', null, true), null);
    data.getItem('menu');
    answers[1].resolve('fresh');
    assert.equal(await data.getResolver('menu').loading, 'fresh');
    assert.equal(requests.length, 2);
    app.dispose();
});

// `sync` (owner 2026-10-19, review p4): with a transport that supports synchronous calls, a `dataRemote` read
// waits for the answer, as in the legacy; `sync: false` keeps the asynchronous read.

/**
 * A page whose transport supports synchronous calls: `callSync` answers with `answer(request)` at once and
 * records the request in `sync`; `call` records it in `async`.
 */
function syncPage(answer = request => request.params.table ?? null) {
    const window = new JSDOM('<main></main>', {virtualConsole: new VirtualConsole()}).window;
    const document = window.document;
    const requests = {sync: [], async: []};
    const reply = (request, outcome) => toTytx({id: request.id, contentType: request.contentType,
        ...(outcome?.error ? {error: outcome.error} : {value: outcome})});
    const transport = {
        supportsCallSync: true,
        close() {},
        dispose() {},
        callSync(text) {
            const request = fromTytx(text);
            requests.sync.push(request);
            return reply(request, answer(request));
        },
        async call(text) {
            const request = fromTytx(text);
            requests.async.push(request);
            return reply(request, await answer(request));
        },
    };
    const app = new Gramlot({document, pageId: 'p1', element: document.querySelector('main'), transport});
    return {app, data: app.data, requests, byId: id => document.getElementById(id)};
}

test('sync: a read waits for the answer and returns it; the resolver records the cache time itself', () => {
    const {app, data, requests} = syncPage();
    app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu', table: 'x'});
    const resolver = data.getResolver('menu');
    assert.equal(resolver.sync, true);
    assert.equal(resolver.expired, true);
    assert.equal(data.getItem('menu'), 'x');
    assert.deepEqual(requests.sync.map(request => [request.contentType, request.name, request.params]),
        [['data', 'loadMenu', {table: 'x'}]]);
    assert.equal(resolver.expired, false);
    // cacheTime null: resolved once.
    assert.equal(data.getItem('menu'), 'x');
    assert.equal(requests.sync.length, 1);
    assert.equal(requests.async.length, 0);
    app.dispose();
});

test('sync: a ^ consumer reads the value at its first projection', () => {
    const {app, requests, byId} = syncPage();
    mount(app, root => {
        const pane = root.div({datapath: 'page'});
        pane.dataRemote({destination_path: '.menu', method: 'loadMenu', table: 'x'});
        pane.span('^.menu', {id: 'menu'});
    });
    assert.equal(byId('menu').textContent, 'x');
    assert.equal(requests.sync.length, 1);
    app.dispose();
});

test('sync: cacheTime 0 calls at every read; _onCalling false makes no call', () => {
    let count = 0;
    const {app, data, requests} = syncPage(() => ++count);
    data.setItem('allow', true);
    mount(app, root => {
        root.dataRemote({destination_path: 'counter', method: 'count', cacheTime: 0});
        root.dataRemote({destination_path: 'guarded', method: 'count', cacheTime: 0, _onCalling: 'return this.GET("allow")'});
    });
    assert.deepEqual([data.getItem('counter'), data.getItem('counter')], [1, 2]);
    assert.equal(data.getItem('guarded'), 3);
    data.setItem('allow', false);
    assert.equal(data.getItem('guarded'), 3);
    assert.equal(requests.sync.length, 3);
    app.dispose();
});

test('sync: a failed call throws to the reader naming the node; the next read calls again', () => {
    let fail = true;
    const {app, data, requests} = syncPage(() => fail ? {error: {code: 'application_error', name: 'ValueError',
        message: 'boom'}} : 'ok');
    app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu'});
    assert.throws(() => data.getItem('menu'), error => /dataRemote 'loadMenu' failed: boom/.test(error.message)
        && error.cause instanceof RpcError);
    fail = false;
    assert.equal(data.getItem('menu'), 'ok');
    assert.equal(requests.sync.length, 2);
    app.dispose();
});

test('sync: a method outside the name syntax throws to the reader and sends nothing', () => {
    const {app, data, requests} = syncPage();
    data.setItem('m', 'a/b');
    mount(app, root => root.dataRemote({destination_path: 'menu', method: '=m'}));
    assert.throws(() => data.getItem('menu'), /dataRemote 'a\/b' failed: Method name must match/);
    assert.equal(requests.sync.length, 0);
    app.dispose();
});

test('sync false, or a transport without synchronous calls, keeps the asynchronous read', async () => {
    const {app, data, requests} = syncPage();
    app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu', table: 'x', sync: false});
    assert.equal(data.getResolver('menu').sync, false);
    assert.equal(data.getItem('menu'), null);
    await settle();
    assert.equal(data.getItem('menu'), 'x');
    assert.deepEqual([requests.sync.length, requests.async.length], [0, 1]);
    app.dispose();
    // The transport of `page` declares no synchronous call: the default sync reads asynchronously.
    const other = page();
    other.app.src.builder.root.dataRemote({destination_path: 'menu', method: 'loadMenu'});
    assert.equal(other.data.getResolver('menu').sync, false);
    other.app.dispose();
});
