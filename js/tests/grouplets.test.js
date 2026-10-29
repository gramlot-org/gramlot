import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import grouplets from '../src/components/grouplets.js';

function wire(author) {
    const builder = new GramlotBuilder(null, {collections: [grouplets]});
    author(builder.root);
    return builder.toTytx();
}
async function settle() {
    for (let i = 0; i < 8; i++) await new Promise(resolve => setTimeout(resolve, 0));
}
async function fixture(t, author, source) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, pageId: 'grouplets', collections: [grouplets],
        transport: {close() {}, dispose() {}, async call(text, signal) {
            const {id, name, contentType, params} = fromTytx(text);
            const value = name === 'main' ? wire(author) : await source(name, params, signal);
            return toTytx({id, contentType, value});
        }}});
    t.after(() => { app.dispose(); window.close(); });
    await app.start(); await settle();
    return {app, window, element: id => window.document.getElementById(id)};
}

test('grouplets is opt-in, DOM-free at import and exports the Python grammar', () => {
    assert.equal(grouplets.name, 'grouplets');
    assert.deepEqual(grouplets.toDocument(), JSON.parse(readFileSync(
        new URL('../../src/gramlot/collections/grouplets.json', import.meta.url))));
    assert.throws(() => new GramlotBuilder().root.grouplet({remote: 'content'}));
    const {window} = new JSDOM('');
    assert.equal(window.customElements.get('gramlot-grouplet'), undefined);
    grouplets.register(window);
    assert.ok(window.customElements.get('gramlot-grouplet'));
    grouplets.register(window);
    window.close();
});

test('two instances share a definition but isolate relative Data and reactive loading', async t => {
    const calls = [];
    const {app, window, element} = await fixture(t, root => {
        for (const [scope, name] of [['left', 'Ada'], ['right', 'Grace']]) {
            root.dataSetter({destination_path: `${scope}.name`, value: name});
            root.grouplet({id: scope, nodeId: scope, datapath: scope, remote: 'content', remote_name: '^.name'});
        }
    }, (method, params) => {
        calls.push([method, params.name]);
        return wire(root => root.input({value: '^.name'}));
    });
    assert.deepEqual(calls, [['content', 'Ada'], ['content', 'Grace']]);
    const left = element('left'), right = element('right');
    const leftSource = app.src.binding.nodeIds.get('left');
    assert.equal(left.localName, 'gramlot-grouplet');
    assert.ok(left.shadowRoot.querySelector('slot'));
    assert.equal(left.querySelector('input').value, 'Ada');
    assert.equal(right.querySelector('input').value, 'Grace');
    const input = left.querySelector('input');
    input.value = 'Augusta'; input.dispatchEvent(new window.Event('change', {bubbles: true}));
    await settle();
    assert.equal(app.data.getItem('left.name'), 'Augusta');
    assert.equal(app.data.getItem('right.name'), 'Grace');
    assert.deepEqual(calls.at(-1), ['content', 'Augusta']);
    assert.equal(calls.length, 3);
    assert.equal(app.src.binding.nodeIds.get('left'), leftSource);
    assert.equal(element('left').querySelector('input').value, 'Augusta');
    assert.equal(element('right'), right);
});

test('nested fragments retain their local Data and dotted method targets', async t => {
    const calls = [];
    const {element} = await fixture(t, root => {
        for (const scope of ['left', 'right']) {
            root.dataSetter({destination_path: `${scope}.child.value`, value: scope});
            root.grouplet({id: scope, datapath: scope, remote: `${scope}.content`});
        }
    }, (method) => {
        calls.push(method);
        if (method.endsWith('.content')) return wire(root => root.grouplet({
            datapath: '.child', remote: method.replace('.content', '.child')}));
        return wire(root => root.span('^.value'));
    });
    assert.deepEqual(new Set(calls), new Set(['left.content', 'right.content', 'left.child', 'right.child']));
    assert.equal(element('left').textContent, 'left');
    assert.equal(element('right').textContent, 'right');
});

test('first pending snapshot follows the applied in-flight answer', async t => {
    const pending = [];
    const {app, element} = await fixture(t, root => {
        root.dataSetter({destination_path: 'choice', value: 'first'});
        root.grouplet({id: 'body', remote: '^choice'});
    }, method => new Promise(resolve => pending.push({method, resolve})));
    app.data.setItem('choice', 'second');
    app.data.setItem('choice', 'third');
    assert.equal(pending.length, 1);
    pending[0].resolve(wire(root => root.span('first'))); await settle();
    assert.equal(element('body').textContent, 'first');
    assert.deepEqual(pending.map(p => p.method), ['first', 'second']);
    pending[1].resolve(wire(root => root.span('second'))); await settle();
    assert.equal(element('body').textContent, 'second');
    assert.equal(pending.length, 2);
});

test('removing a grouplet cancels its pending work and ignores the late answer', async t => {
    let finish, signal;
    const calls = [];
    const {app, element} = await fixture(t, root => {
        root.dataSetter({destination_path: 'value', value: 1});
        root.grouplet({id: 'body', nodeId: 'body', remote: 'content', remote_value: '^value'});
    }, (method, params, requestSignal) => {
        calls.push(params.value); signal = requestSignal;
        return new Promise(resolve => { finish = resolve; });
    });
    app.data.setItem('value', 2);
    const node = app.src.binding.nodeIds.get('body');
    node.parentBag.popNode(node.label);
    assert.equal(signal.aborted, true);
    finish(wire(root => root.span('late'))); await settle();
    app.data.setItem('value', 3); await settle();
    assert.equal(element('body'), null);
    assert.deepEqual(calls, [1]);
});

test('readiness and cachedRemote retain the shared remote contract', async t => {
    const calls = [];
    const {app, element} = await fixture(t, root => {
        root.dataSetter({destination_path: 'ready', value: false});
        root.grouplet({id: 'body', nodeId: 'body', remote: 'content', remote_ready: '^ready',
            _if: 'ready', _cachedRemote: true});
    }, method => { calls.push(method); return wire(root => root.span('loaded')); });
    assert.equal(calls.length, 0);
    app.data.setItem('ready', true); await settle();
    const binding = app.src.binding.bindingFor(app.src.binding.nodeIds.get('body'));
    await binding.remote.update();
    assert.equal(calls.length, 1);
    app.data.setItem('ready', false); await settle();
    assert.equal(element('body').textContent, 'loaded');
    assert.equal(calls.length, 1);
});


test('prepared collection renders real Python Page and remote Source responses', async t => {
    const {default: prepared} = await import('../dist/components/grouplets/assets/index.js');
    const replies = JSON.parse(execFileSync(
        process.env.GRAMLOT_TEST_PYTHON ?? 'python3',
        ['-c', `
import asyncio, json, sys
sys.path.insert(0, 'tests')
from test_grouplets import FixtureServer, ROOT
from genro_tytx import to_tytx
async def run():
    server = FixtureServer(ROOT / 'tests/fixtures/grouplets')
    try:
        page = await server.open_page('/')
        responses = {}
        for name, suffix in [('main', ''), ('left.content', '!'), ('right.content', '?')]:
            responses[name] = await server.call(to_tytx(dict(id='r', pageId=page.page_id,
                contentType='source', name=name, params={} if name == 'main' else {'suffix': suffix})))
        print(json.dumps(responses))
    finally:
        server.close_all()
asyncio.run(run())
`], {cwd: new URL('../../', import.meta.url), encoding: 'utf8',
            env: {...process.env, PYTHONPATH: 'src'}}));
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const calls = [];
    const app = new Gramlot({document: window.document, pageId: 'python', collections: [prepared],
        transport: {close() {}, dispose() {}, async call(text) {
            const request = fromTytx(text);
            calls.push(request.name);
            const reply = JSON.parse(replies[request.name]);
            reply.id = request.id;
            return JSON.stringify(reply);
        }}});
    t.after(() => { app.dispose(); window.close(); });
    await app.start(); await settle();
    assert.deepEqual(calls, ['main', 'left.content', 'right.content']);
    assert.equal(window.document.getElementById('left').textContent, 'Left!');
    assert.equal(window.document.getElementById('right').textContent, 'Right?');
    assert.equal(window.document.querySelector('#left input').value, 'Ada');
    assert.equal(window.document.querySelector('#right input').value, 'Grace');
});
