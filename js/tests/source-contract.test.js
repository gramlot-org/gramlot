import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder, HttpTransport, RpcError} from '../src/index.js';
import {GramlotBuilderBag} from '../src/builder/source.js';

/** A Gramlot page: its Source reaches the renderer as events while it is filled. */
function setup() {
    const document = new JSDOM('<div id="gramlot-root"><i id="host-owned"></i></div>').window.document;
    const destination = document.getElementById('gramlot-root');
    const app = new Gramlot({document, element: destination, transport: false});
    return {document, source: app.src.source, destination, author: app.src.builder, builder: app.src.renderer};
}
function block(builder) {
    return new GramlotBuilderBag(null, builder);
}
function add(builder, bag, label, tag, value = '', attrs = {}, position = '>') {
    return builder.setChild(bag, tag, value, {node_label: label, node_position: position, ...attrs});
}

test('Python authoring -> TYTX -> first subscriber insert; roots precede main', async () => {
    const root = fileURLToPath(new URL('../../', import.meta.url));
    const fixture = JSON.parse(execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3',
        ['tests/export_fixture.py'], {cwd: root, env: {...process.env, PYTHONPATH: `${root}/src`}}));
    const document = new JSDOM('<main id="custom"></main>').window.document;
    let calls = 0, app;
    app = new Gramlot({pageId: 'test', element: document.querySelector('main'), transport: {
        async call(text) {
            calls++;
            const request = fromTytx(text);
            assert.deepEqual({...request, id: null},
                {id: null, pageId: 'test', contentType: 'source', name: 'main', params: {}});
            assert.equal(app.src.binding.root.getItem('_root_'), app.data);
            assert.equal(app.data.getItem('main'), null);
            assert.equal(app.src.renderer.records.size, 0);
            return toTytx({id: request.id, contentType: 'source', value: fixture.wire});
        },
    }});
    let inserts = 0;
    app.src.source.subscribe('test', {insert: () => inserts++});
    await Promise.all([app.start(), app.start()]);
    assert.equal(calls, 1);
    assert.equal(inserts, 1);
    assert.equal(document.getElementById('panel').textContent, 'homerbart');
    assert.equal(document.getElementById('name').value, 'marge');
    assert.equal(app.dom.reference(fixture.reference), document.getElementById('panel'));
    app.dispose();
    assert.throws(() => app.dom.reference(fixture.reference), /not mounted/);
});

// A Python Source with every inline declaration: Python keeps the code as plain strings and runs none of it.
const PYTHON_INLINE = `
from genro_tytx import to_tytx
from gramlot import GramlotBuilder
builder = GramlotBuilder()
root = builder.root
root.dataFormula("f", "a * 2", a="^a", _if="a > 0", _else="-1")
root.dataController("this.SET('s', a + 1)", a="^a")
root.div("==a * 10", id="expr", title="==a + 100", a="^a")
root.button("go", id="go", action="this.SET('clicked', 'action')")
root.span("x", id="span", connect_onclick="this.SET('connected', event.type)")
print(to_tytx(builder.source))
`;

test('a Python Source with inline code runs it in the page, received through TYTX', () => {
    const root = fileURLToPath(new URL('../../', import.meta.url));
    const wire = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', PYTHON_INLINE],
        {cwd: root, env: {...process.env, PYTHONPATH: `${root}/src`}, encoding: 'utf8'}).trim();
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({pageId: 'python-inline', element: document.querySelector('main'), transport: false});
    app.src.startSource(wire);
    app.data.setItem('a', 3);
    document.getElementById('go').click();
    document.getElementById('span').click();
    const byId = id => document.getElementById(id);
    assert.deepEqual([app.data.getItem('f'), app.data.getItem('s'), byId('expr').textContent, byId('expr').getAttribute('title'),
        app.data.getItem('clicked'), app.data.getItem('connected')], [6, 4, '30', '103', 'action', 'click']);
    app.data.setItem('a', -1);
    assert.equal(app.data.getItem('f'), -1);
    app.dispose();
});

test('ordered nested insertion, setter update, structural replacement and detached events', () => {
    const {source, destination, author, builder} = setup();
    const panel = add(author, source, 'panel', 'div', block(author), {_text: 'parent'});
    add(author, panel.value, 'a', 'span', 'A');
    const element = builder.records.get(panel).element;
    add(author, panel.value, 'b', 'span', 'B', {}, '<a');
    assert.equal(element.textContent, 'parentBA');
    panel.setAttr({_text: 'changed', title: 'title'});
    assert.equal(builder.records.get(panel).element, element);
    assert.equal(element.textContent, 'changedBA');
    panel.setAttr({title: null});
    assert.equal(element.hasAttribute('title'), false);
    const old = panel.value;
    let cleaned = 0;
    builder.onDispose(old.getNode('a'), () => cleaned++);
    const replacement = block(author);
    add(author, replacement, 'c', 'strong', 'C');
    panel.setValue(replacement);
    assert.notEqual(builder.records.get(panel).element, element);
    assert.equal(cleaned, 1);
    add(author, old, 'orphan', 'span', 'NO');
    assert.equal(destination.textContent, 'changedC');
    const replacedElement = builder.records.get(panel).element;
    source.popNode('panel');
    const section = add(author, source, 'panel', 'section', 'changedC');
    assert.equal(builder.records.has(panel), false);
    assert.equal(replacedElement.isConnected, false);
    assert.equal(builder.records.get(section).element.tagName, 'SECTION');
    assert.equal(destination.textContent, 'changedC');
    source.clear();
    assert.equal(builder.records.size, 0);
    assert.equal(destination.children.length, 1); // host-owned element survives
    builder.dispose();
    add(author, source, 'ignored', 'div', 'ignored');
    assert.equal(destination.children.length, 1);
});

test('fragment ordering and deletion of a whole branch releases every owned resource', () => {
    const {source, destination, author, builder} = setup();
    const first = add(author, source, 'first', 'div', block(author));
    add(author, first.value, 'a', 'span', 'A', {__ref: 'a'});
    add(author, source, 'second', 'span', 'B');
    add(author, first.value, 'c', 'span', 'C');
    assert.equal(destination.textContent, 'ACB');
    let cleaned = 0;
    builder.onDispose(first.value.getNode('a'), () => { cleaned++; throw Error('cleanup'); });
    builder.onDispose(first.value.getNode('c'), () => cleaned++);
    assert.throws(() => source.popNode('first'), /cleanup/);
    assert.equal(cleaned, 2);
    assert.equal(destination.textContent, 'B');
    assert.equal(builder.references.entries.size, 0);
    builder.dispose();
});

test('native property setters, escaped text, combined updates, isolation and invalid declarations', () => {
    const a = setup(), b = setup();
    let node = add(a.author, a.source, 'input', 'input', null, {value: 'one', checked: true});
    const element = a.builder.records.get(node).element;
    node.setAttr({value: 'two', checked: false});
    assert.equal(element.value, 'two');
    assert.equal(element.checked, false);
    a.source.popNode('input');
    assert.equal(element.isConnected, false);
    node = add(a.author, a.source, 'input', 'div', '<b>literal</b>');
    assert.equal(a.destination.textContent, '<b>literal</b>');
    assert.equal(a.destination.querySelector('b'), null);
    assert.equal(b.builder.records.size, 0);
    // `color` is a style shortcut (P6, §3.3): it reaches `style`, never an attribute of its own.
    node.setAttr({color: 'red'});
    assert.equal(a.builder.records.get(node).element.getAttribute('color'), null);
    assert.equal(a.builder.records.get(node).element.style.color, 'red');
    node.setAttr({color: null});
    assert.equal(a.builder.records.get(node).element.style.color, '');

    a.builder.dispose(); b.builder.dispose();
});

test('reference identity survives replacement and is invalidated on deletion', () => {
    const {source, author, builder} = setup();
    const node = add(author, source, 'one', 'div', 'one', {__ref: 'id'});
    const ref = {$gramlotRef: 'id', kind: 'dom'};
    const element = builder.references.resolve(ref);
    node.setValue(block(author));
    assert.notEqual(builder.references.resolve(ref), element);
    assert.equal(builder.references.resolve({...ref, kind: 'node'}), node);
    assert.throws(() => add(author, source, 'two', 'span', 'two', {__ref: 'id'}), /Duplicate/);
    source.popNode('two');
    source.popNode('one');
    assert.throws(() => builder.references.resolve(ref), /not mounted/);
    builder.dispose();
});

/** The response envelope of `text` answering `value`. */
function answer(text, value) {
    const {id, contentType} = fromTytx(text);
    return toTytx({id, contentType, value});
}

test('main failure is visible and retryable; disposal prevents late insertion', async () => {
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    let attempts = 0;
    const app = new Gramlot({document, transport: {async call(text) {
        if (!attempts++) throw new Error('offline');
        return answer(text, new GramlotBuilder().toTytx());
    }}});
    await assert.rejects(app.start(), /offline/);
    assert.equal(app.state, 'failed');
    await app.start();
    assert.equal(app.state, 'started');
    app.dispose();
    await assert.rejects(app.start(), /disposed/);
    let release;
    const late = new Gramlot({document, transport: {call: text => new Promise(r => { release = () => r(text); })}});
    const loading = late.start();
    late.dispose();
    release();
    await assert.rejects(loading, /disposed/);
    assert.equal(late.src.source.getNodes().length, 0);
});

test('transport passes the envelope text, cancellation and failures through the host contract', async () => {
    const signal = new AbortController().signal;
    const transport = new HttpTransport('/rpc', {fetcher: async (url, options) => {
        assert.equal(url, '/rpc');
        assert.equal(options.signal, signal);
        assert.equal(options.method, 'POST');
        assert.equal(options.credentials, 'same-origin');
        assert.equal(options.headers['Content-Type'], 'application/json');
        assert.equal(options.body, 'request');
        return {ok: true, status: 200, text: async () => 'response'};
    }});
    assert.equal(await transport.call('request', signal), 'response');
    const failing = new HttpTransport('/rpc', {fetcher: async () => ({ok: false, status: 400})});
    await assert.rejects(failing.call('request'), {message: 'rpc failed: HTTP 400'});
});

test('gramlot.rpc.call sends one envelope and answers its value or an RpcError', async () => {
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    const sent = [];
    let reply = (request) => ({id: request.id, contentType: request.contentType, value: request.params.value});
    const app = new Gramlot({document, pageId: 'page', transport: {async call(text) {
        const request = fromTytx(text);
        sent.push(request);
        return toTytx(reply(request));
    }}});
    assert.equal(await app.rpc.call('data', 'check_endpoint', {value: 3}), 3);
    assert.equal(await app.rpc.call('data', 'check_endpoint', {value: 'x'}), 'x');
    assert.equal(sent[0].pageId, 'page');
    assert.equal(sent[0].contentType, 'data');
    assert.equal(sent[0].name, 'check_endpoint');
    assert.notEqual(sent[0].id, sent[1].id);
    assert.match(sent[0].id, /^[0-9a-f]{32}$/);
    reply = request => ({id: request.id, contentType: 'data',
        error: {code: 'application_error', name: 'ValueError', message: 'check', details: 'trace'}});
    await assert.rejects(app.rpc.call('data', 'check_endpoint_raise'), error => {
        assert.ok(error instanceof RpcError);
        assert.equal(error.name, 'RpcError');
        assert.equal(error.code, 'application_error');
        assert.equal(error.remoteName, 'ValueError');
        assert.equal(error.message, 'check');
        assert.equal(error.details, 'trace');
        return true;
    });
    reply = () => ({id: 'other', contentType: 'data', value: 1});
    await assert.rejects(app.rpc.call('data', 'check_endpoint'), {message: 'rpc response id mismatch'});
    const offline = new Gramlot({document, transport: false});
    await assert.rejects(offline.rpc.call('data', 'check_endpoint'), /unavailable without a server transport/);
});
