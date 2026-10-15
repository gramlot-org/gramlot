// The `dataRemote` data-element (0.2.16): a RemoteProvider installs an RpcResolver on its Data node,
// which calls the endpoint when the node is read and its `cacheTime` has expired. A read never waits:
// the loaded value reaches the `^` consumers through the Data event, except with `cacheTime: 0`.
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

test('a change during the load aborts it and loads with the new value; the late answer is dropped', async () => {
    const answer = deferred();
    const {app, data, requests, byId} = page(request => request.params.table === 'a' ? answer.promise : 'b');
    data.setItem('table', 'a');
    mount(app, root => {
        root.dataRemote({destination_path: 'menu', method: 'loadMenu', table: '^table'});
        root.span('^menu', {id: 'menu'});
    });
    const pending = data.getResolver('menu').loading;
    data.setItem('table', 'b');
    assert.equal(requests[0].signal.aborted, true);
    await assert.rejects(pending, error => error.name === 'AbortError');
    await settle();
    assert.equal(byId('menu').textContent, 'b');
    answer.resolve('a');
    await settle();
    assert.equal(byId('menu').textContent, 'b');
    assert.equal(requests.length, 2);
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
    mount(app, root => root.dataRemote({destination_path: 'menu', method: 'loadMenu'}));
    const resolver = data.getResolver('menu');
    assert.throws(() => resolver.onError(new Error('no menu')),
        error => error.message === "dataRemote 'dataRemote_0': dataRemote 'loadMenu' failed: no menu" && error.cause.message === 'no menu');
    const failures = [];
    resolver.onError = error => failures.push(error);
    data.getItem('menu');
    resolver.abort();
    await assert.rejects(resolver.loading, error => error.name === 'AbortError');
    await settle();
    assert.deepEqual(failures, []);
    app.dispose();
});

test('an aborted load writes nothing, even when its answer had already arrived', async () => {
    const {app, data} = page();
    const failures = [];
    const resolver = new RpcResolver({gramlot: {rpc: {call: () => Promise.resolve('late')}}, method: 'loadMenu', params: {},
        cacheTime: -1, onError: error => failures.push(error)});
    data.setResolver('menu', resolver);
    const loading = resolver.refresh();
    resolver.abort();
    await assert.rejects(loading, error => error.name === 'AbortError');
    assert.notEqual(data.getItem('menu', null, true), 'late');
    assert.equal(resolver.loaded, false);
    assert.deepEqual(failures, []);
    app.dispose();
});
