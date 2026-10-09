// The `dataRpc` data-element (GC-230, 0.2.14): an RpcProvider whose body is the call of a server
// endpoint through `gramlot.rpc`, on the Provider pipeline of `dataFormula`/`dataController`.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder, RpcError} from '../src/index.js';
import {mount} from './fixtures/mount.js';

/**
 * A page whose transport records every request envelope and answers it with `answer(request)`:
 * a value, or a promise of one. `{error}` answers an error outcome.
 */
function page(answer = request => request.params.value ?? null) {
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
    return {app, window, document, data: app.data, requests, byId: id => document.getElementById(id)};
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

test('a ^ trigger calls the endpoint: data envelope, author params, typed value at result_path', async () => {
    const day = new Date(Date.UTC(2026, 9, 9));
    const {app, data, requests} = page(request => request.params.value === 1 ? 42 : day);
    app.src.builder.root.dataRpc({method: 'echo', result_path: 'r', value: '^v', extra: 'x', timeout: 1000});
    data.setItem('v', 1);
    await settle();
    assert.equal(requests.length, 1);
    const [request] = requests;
    assert.deepEqual([request.pageId, request.contentType, request.name], ['p1', 'data', 'echo']);
    assert.deepEqual(request.params, {value: 1, extra: 'x'});
    assert.equal(data.getItem('r'), 42);
    data.setItem('v', 2);
    await settle();
    assert.ok(data.getItem('r') instanceof Date);
    assert.equal(data.getItem('r').getTime(), day.getTime());
    app.dispose();
});

test('without result_path the value is not written; method is read from Data through a pointer', async () => {
    const {app, data, requests} = page(() => 'done');
    data.setItem('m', 'first');
    app.src.builder.root.dataRpc({method: '=m', value: '^v'});
    data.setItem('v', 1);
    data.setItem('m', 'second');
    data.setItem('v', 2);
    await settle();
    assert.deepEqual(requests.map(request => request.name), ['first', 'second']);
    assert.deepEqual(requests.map(request => request.params), [{value: 1}, {value: 2}]);
    assert.equal(data.getItem('r'), null);
    app.dispose();
});

test('_if false calls nothing; with _else the _else runs as inline code and does not call', async () => {
    const {app, data, requests} = page();
    mount(app, root => {
        root.dataRpc({method: 'echo', result_path: 'a', value: '^v', _if: 'value > 1'});
        root.dataRpc({method: 'echo', result_path: 'b', value: '^v', _if: 'value > 1', _else: 'this.SET("else", value)'});
    });
    data.setItem('v', 1);
    await settle();
    assert.equal(requests.length, 0);
    assert.equal(data.getItem('else'), 1);
    data.setItem('v', 2);
    await settle();
    assert.equal(requests.length, 2);
    assert.deepEqual([data.getItem('a'), data.getItem('b')], [2, 2]);
    app.dispose();
});

test('_delay debounces: the last call wins, the arguments are read when the call starts', async () => {
    const {app, data, requests} = page();
    app.src.builder.root.dataRpc({method: 'echo', result_path: 'r', value: '^v', _delay: 20});
    data.setItem('v', 1);
    data.setItem('v', 2);
    data.setItem('v', 3);
    await settle(60);
    assert.deepEqual(requests.map(request => request.params.value), [3]);
    assert.equal(data.getItem('r'), 3);
    app.dispose();
});

test('_userChanges: only the node level calls', async () => {
    const {app, data, requests} = page();
    app.src.builder.root.dataRpc({method: 'echo', value: '^c.v', _userChanges: true});
    const writer = sourceTarget(app.src.builder.root.dataController({}));
    writer.SET('c.v', 1);
    writer.SET('c', new (data.constructor)({v: 2}));
    await settle();
    assert.deepEqual(requests.map(request => request.params.value), [1]);
    app.dispose();
});

test('latest wins: the first answer arriving after the second is dropped, and the first call is aborted', async () => {
    const answers = [deferred(), deferred()];
    let index = 0;
    const {app, data, requests} = page(() => answers[index++].promise);
    app.src.builder.root.dataRpc({method: 'echo', result_path: 'r', value: '^v'});
    data.setItem('v', 1);
    data.setItem('v', 2);
    await settle();
    assert.equal(requests.length, 2);
    assert.equal(requests[0].signal.aborted, true);
    answers[1].resolve('second');
    await settle();
    answers[0].resolve('first');
    await settle();
    assert.equal(data.getItem('r'), 'second');
    app.dispose();
});

test('timeout aborts the call and reports a TimeoutError to _onError', async () => {
    const {app, data, requests} = page(() => new Promise(() => {}));
    mount(app, root => root.dataRpc({method: 'slow', result_path: 'r', value: '^v', timeout: 20,
        _onError: 'this.SET("error", error.name)'}));
    data.setItem('v', 1);
    await settle(60);
    assert.equal(requests[0].signal.aborted, true);
    assert.equal(data.getItem('error'), 'TimeoutError');
    assert.equal(data.getItem('r'), null);
    app.dispose();
});

test('_onCalling, _onResult and _onError receive the kwargs, plus result and error', async () => {
    const {app, data} = page(request => request.params.value > 1
        ? {error: {code: 'application_error', name: 'ValueError', message: 'too big'}} : 'ok');
    mount(app, root => root.dataRpc({method: 'echo', result_path: 'r', value: '^v',
        _onCalling: 'this.SET("calling", value)',
        _onResult: 'this.SET("result", [value, result].join())',
        _onError: 'this.SET("error", [value, error.name, error.code, error.remoteName, error.message].join())'}));
    data.setItem('v', 1);
    await settle();
    assert.equal(data.getItem('calling'), 1);
    assert.equal(data.getItem('result'), '1,ok');
    data.setItem('v', 2);
    await settle();
    assert.equal(data.getItem('calling'), 2);
    assert.equal(data.getItem('error'), '2,RpcError,application_error,ValueError,too big');
    assert.equal(data.getItem('r'), 'ok');
    app.dispose();
});

test('an RpcError without _onError rejects the promise invoke returns; the other kinds return undefined', async () => {
    const {app} = page(() => ({error: {code: 'not_authenticated', name: 'NotAuthenticated', message: 'Access refused: guarded'}}));
    const node = sourceTarget(app.src.builder.root.dataRpc({method: 'guarded'}));
    const provider = app.src.binding.bindingFor(node).providers[0];
    assert.equal(provider.kind, 'rpc');
    await assert.rejects(provider.invoke({kind: 'init', change: null}),
        error => error instanceof RpcError && error.code === 'not_authenticated');
    const controller = sourceTarget(app.src.builder.root.dataController({script: null}));
    assert.equal(app.src.binding.bindingFor(controller).providers[0].invoke({kind: 'init', change: null}), undefined);
    app.dispose();
});

test('the close of the node aborts its call and drops the answer', async () => {
    const answer = deferred();
    const {app, data, requests} = page(() => answer.promise);
    const node = sourceTarget(app.src.builder.root.dataRpc({method: 'echo', result_path: 'r', value: '^v'}));
    data.setItem('v', 1);
    await settle();
    node.parentBag.popNode(node.label);
    assert.equal(requests[0].signal.aborted, true);
    answer.resolve('late');
    await settle();
    assert.equal(data.getItem('r'), null);
    app.dispose();
});

test('a dataRpc child of a button runs on click with the author params; with a dataController it is ambiguous', async () => {
    const {app, data, window, byId, requests} = page();
    mount(app, root => root.button('go', {id: 'b'}).dataRpc({method: 'echo', result_path: 'r', value: 'clicked'}));
    assert.equal(byId('b').getAttribute('type'), 'button');
    byId('b').dispatchEvent(new window.MouseEvent('click', {bubbles: true, cancelable: true}));
    await settle();
    assert.deepEqual(requests.map(request => [request.name, request.params]), [['echo', {value: 'clicked'}]]);
    assert.equal(data.getItem('r'), 'clicked');
    app.dispose();
    const other = page();
    assert.throws(() => mount(other.app, root => {
        const button = root.button('go');
        button.dataRpc({method: 'echo'});
        button.dataController({script: '1'});
    }), /several dataController or dataRpc children/);
});

test('authoring: dataRpc builds in JS, rpc callbacks are refused elsewhere, dataRemote stays excluded', () => {
    const builder = new GramlotBuilder();
    const node = sourceTarget(builder.root.dataRpc({method: 'm', result_path: 'x', timeout: 500}));
    assert.equal(node.nodeTag, 'dataRpc');
    assert.deepEqual([node.getAttr('method'), node.getAttr('result_path'), node.getAttr('timeout')], ['m', 'x', 500]);
    assert.throws(() => builder.root.dataRpc({method: 'm', result_path: 'x?a'}), /dataRpc: 'result_path' does not accept '\?attr'/);
    assert.throws(() => builder.root.dataRemote({method: 'm'}), /dataRemote: excluded from Gramlot 0\.2\.0/);
    for (const name of ['_onCalling', '_onResult', '_onError']) {
        const {app} = page();
        assert.throws(() => mount(app, root => root.dataController({[name]: 'x'})),
            new RegExp(`dataController '.*': '${name}' is allowed only on dataRpc`));
        app.dispose();
    }
});
