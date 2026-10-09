import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {mkdtemp, writeFile, symlink, rm} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {GramlotServer, Page, GramlotBuilder, PageExpired, ServerCapacity, PageNotFound, SourceNotFound, EndpointNotFound,
    InvalidRequest, NotAuthenticated, NotAuthorized} from '../src/server/index.js';
import {GramlotFileServer} from '../src/server/gramlot-file-server.js';
import {InvalidResourceName} from '../src/server/resources.js';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {SourceBag, sourceBagFromTytx} from '@genrojs/builders';

const pages = fileURLToPath(new URL('./fixtures/pages/', import.meta.url));

/** The decoded response envelope of one call. */
const call = async (server, pageId, contentType, name, params = {}, options = {}) =>
    fromTytx(await server.call(toTytx({id: 'r1', pageId, contentType, name, params}), options));
const main = (server, pageId, options) => call(server, pageId, 'source', 'main', {}, options);
const code = async response => (await response).error?.code;

test('file server: bootstrap and async main, identity, fresh page state and cleanup', async () => {
    const server = new GramlotFileServer(pages);
    const opened = await server.openPage('/', {owner: 'alice'});
    assert.ok(opened.html.includes('id="gramlot-root"'));
    assert.ok(!opened.html.includes('homer'));
    assert.ok(opened.html.includes(opened.pageId));
    assert.ok(opened.html.includes('"closeUrl":"/gramlot/close"'));
    assert.ok(opened.html.includes(`<script type="module" nonce="${opened.nonce}">`));
    assert.notEqual(opened.nonce, opened.pageId);
    assert.ok(!opened.html.includes('<link'));
    assert.equal(await code(main(server, opened.pageId, {owner: 'bob'})), 'page_expired');
    // The value of a source response is the fragment text of 0.2.12, carried as a string in the envelope.
    const text = JSON.parse(await server.call(toTytx({id: 'r1', pageId: opened.pageId, contentType: 'source',
        name: 'main', params: {}}), {owner: 'alice'})).value;
    const bag = sourceBagFromTytx(text, new GramlotBuilder());
    assert.ok(bag instanceof SourceBag);
    assert.equal(bag.getNodes()[0].attr._text, 'homer');
    assert.equal(bag.getNodes()[0].value.getNodes()[0].value, 'bart');
    server.closePage(opened.pageId, {owner: 'bob'});
    assert.equal(server.pages.size, 1);
    server.closePage(opened.pageId, {owner: 'alice'});
    assert.equal(await code(main(server, opened.pageId, {owner: 'alice'})), 'page_expired');
    class StatefulPage extends Page {
        count = 0;
        main(root) { root.div(String(++this.count), {id: this.pageId}); }
    }
    class MemoryServer extends GramlotServer {
        async resolvePage() { return StatefulPage; }
        async resolveResources() { return {css: [], js: []}; }
    }
    const memory = new MemoryServer();
    const {pageId} = await memory.openPage('/');
    for (let i = 0; i < 2; i++) {
        const node = (await main(memory, pageId)).value.getNodes()[0];
        assert.equal(node.value, '1');
        assert.equal(node.attr.id, pageId);
    }
});

test('JS Source is readable by Python using the same Bag wire contract', () => {
    const builder = new GramlotBuilder();
    const source = builder.root;
    const panel = source.div('homer', {class_: 'family', data_name: 'simpson'});
    panel.span('bart');
    const ref = builder.reference(panel, 'dom');
    assert.equal(builder.reference(panel).$gramlotRef, ref.$gramlotRef);
    assert.throws(() => builder.reference(source), /requires an element/);
    assert.throws(() => builder.reference(panel, 'other'), /node\/dom/);
    const result = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c',
        'import sys,json; import gramlot; from genro_builders.builder import SourceBag; from genro_tytx import from_tytx; b=from_tytx(sys.stdin.read()); assert isinstance(b,SourceBag); ' +
        'n=b.nodes[0]; print(json.dumps([n.attr, n.value.nodes[0].value]))'],
        {input: builder.toTytx(), encoding: 'utf8'});
    const [attrs, child] = JSON.parse(result);
    assert.equal(attrs.__ref, ref.$gramlotRef);
    assert.equal(attrs.class_, 'family');
    assert.equal(attrs.data_name, 'simpson');
    assert.equal(child, 'bart');
    assert.equal(source.div('x', {color: 'red'}).attr.color, 'red');
    assert.throws(() => source.br().span('x'), /child|void|allowed/i);
});

test('page isolation, expiration, capacity and bootstrap escaping', async () => {
    class CustomPage extends Page {
        static title = '</title><script>bad</script>';
        main(root) { root.div('ok'); }
    }
    class MemoryServer extends GramlotServer {
        async resolvePage() { return CustomPage; }
        async resolveResources() { return {css: ['/x" onload="bad'], js: []}; }
    }
    const server = new MemoryServer({maxPages: 1, runtimeUrl: '/x</script>.js'});
    const {pageId, html} = await server.openPage('/');
    assert.ok(!html.includes('<script>bad'));
    assert.ok(!html.includes('/x</script>'));
    assert.ok(html.includes('&lt;/title&gt;'));
    // The CSS URLs are JSON inside the module script (S07, D9): no attribute to break out of.
    assert.ok(!html.includes('<link'));
    assert.ok(html.includes('"css":["/x\\" onload=\\"bad"]'));
    await assert.rejects(server.openPage('/'), ServerCapacity);
    server.pages.get(pageId).expires = 0;
    assert.equal(await code(main(server, pageId)), 'page_expired');
    await server.openPage('/');
    const other = new MemoryServer();
    assert.equal(other.pages.size, 0);
});

test('server rejects non-expiring TTL and invalid registry capacity', () => {
    for (const pageTtl of [Infinity, NaN, 1e308, '30', 0]) {
        assert.throws(() => new GramlotServer({pageTtl}), TypeError);
    }
    for (const maxPages of [Infinity, 1.5, '2', 0]) {
        assert.throws(() => new GramlotServer({maxPages}), TypeError);
    }
});

test('file loader rejects traversal, missing pages, symlink escapes and invalid classes', async () => {
    const server = new GramlotFileServer(pages);
    for (const path of ['/../index', '/index.js', '/missing', '/a//b', '/index_aux']) {
        await assert.rejects(server.openPage(path), PageNotFound);
    }
    const directory = await mkdtemp(join(tmpdir(), 'gramlot-server-'));
    try {
        await writeFile(join(directory, 'package.json'), '{"type":"module"}');
        await writeFile(join(directory, 'index.js'), 'export class Page {}');
        await symlink(join(pages, 'index.js'), join(directory, 'escape.js'));
        const temporary = new GramlotFileServer(directory);
        await assert.rejects(temporary.openPage('/escape'), PageNotFound);
        await assert.rejects(temporary.openPage('/'), /subclass/);
    } finally { await rm(directory, {recursive: true, force: true}); }
});

test('call: main and fragments build their Source; unknown names are not_found', async () => {
    const server = new GramlotFileServer(pages);
    const {pageId} = await server.openPage('/');
    const response = await main(server, pageId);
    assert.deepEqual(Object.keys(response), ['id', 'contentType', 'value']);
    assert.equal(response.id, 'r1');
    assert.equal(response.contentType, 'source');
    assert.equal(response.value.getNodes()[0].attr._text, 'homer');
    for (const params of [{}, {text: 'other'}]) {
        const fragment = (await call(server, pageId, 'source', 'check_fragment', params)).value;
        assert.equal(fragment.getNodes()[0].value, params.text ?? 'check');
    }
    for (const [contentType, name, errorName] of [['source', 'nope', 'SourceNotFound'], ['source', 'check_endpoint', 'SourceNotFound'],
        ['data', 'nope', 'EndpointNotFound'], ['data', 'main', 'EndpointNotFound'], ['data', 'check_fragment', 'EndpointNotFound']]) {
        const {error} = await call(server, pageId, contentType, name);
        assert.equal(error.code, 'not_found');
        assert.equal(error.name, errorName);
    }
    assert.deepEqual((await call(server, pageId, 'data', 'nope')).error,
        {code: 'not_found', name: 'EndpointNotFound', message: 'Unknown endpoint: nope'});
});

test('call: endpoints return typed values through the envelope', async () => {
    const server = new GramlotFileServer(pages);
    const {pageId} = await server.openPage('/', {owner: 'one'});
    // The date crosses the envelope typed (::D) and comes back as the same typed value.
    for (const value of [3, 'x', new Date(Date.UTC(2020, 0, 1))]) {
        const response = await call(server, pageId, 'data', 'check_endpoint', {value}, {owner: 'one'});
        assert.deepEqual(response, {id: 'r1', contentType: 'data', value});
    }
    assert.equal(await code(call(server, pageId, 'data', 'check_endpoint', {value: 3}, {owner: 'two'})), 'page_expired');
    server.closePage(pageId, {owner: 'one'});
    assert.equal(await code(call(server, pageId, 'data', 'check_endpoint', {value: 3}, {owner: 'one'})), 'page_expired');
});

test('call: auth is closed by default and evaluateAuth decides', async () => {
    const server = new GramlotFileServer(pages);
    const {pageId} = await server.openPage('/');
    assert.deepEqual((await call(server, pageId, 'data', 'check_endpoint_auth')).error,
        {code: 'not_authenticated', name: 'NotAuthenticated', message: 'Access refused: check_endpoint_auth'});
    assert.equal((await call(server, pageId, 'data', 'check_endpoint', {value: 1})).value, 1);
    for (const [outcome, expected] of [[null, {value: 'allowed'}], ['not_authorized', 'not_authorized']]) {
        const rules = [];
        const custom = new (class extends GramlotFileServer {
            evaluateAuth(rule, {owner}) { rules.push([rule, owner]); return outcome; }
        })(pages);
        const opened = await custom.openPage('/', {owner: 'one'});
        const response = await call(custom, opened.pageId, 'data', 'check_endpoint_auth', {}, {owner: 'one'});
        if (outcome === null) assert.equal(response.value, 'allowed');
        else assert.equal(response.error.code, expected);
        assert.deepEqual(rules, [['admin', 'one']]);
    }
});

test('call: evaluateAuth outside its three outcomes is application_error', async () => {
    const server = new (class extends GramlotFileServer {
        evaluateAuth() { return 'maybe'; }
    })(pages);
    const {pageId} = await server.openPage('/');
    assert.deepEqual((await call(server, pageId, 'data', 'check_endpoint_auth')).error,
        {code: 'application_error', name: 'TypeError',
            message: "evaluateAuth must return null, 'not_authenticated' or 'not_authorized'"});
});

test('call: a value TYTX cannot serialise and a thrown null are application_error', async () => {
    class OddPage extends EmptyPage {
        big() { return 1n; }
        nothing() { throw null; }
    }
    OddPage.registerEndpoint('big');
    OddPage.registerEndpoint('nothing');
    const server = memoryServer(OddPage);
    const {pageId} = await server.openPage('/');
    const big = (await call(server, pageId, 'data', 'big')).error;
    assert.equal(big.code, 'application_error');
    assert.equal(big.name, 'TypeError');
    assert.deepEqual((await call(server, pageId, 'data', 'nothing')).error,
        {code: 'application_error', name: 'Error', message: 'null'});
});

test('call: a failing method is application_error, with details only under GRAMLOT_DEV=DEBUG', async () => {
    const server = new GramlotFileServer(pages);
    const {pageId} = await server.openPage('/');
    const saved = process.env.GRAMLOT_DEV;
    try {
        delete process.env.GRAMLOT_DEV;
        assert.deepEqual((await call(server, pageId, 'data', 'check_endpoint_raise')).error,
            {code: 'application_error', name: 'Error', message: 'check'});
        process.env.GRAMLOT_DEV = 'DEBUG';
        const {error} = await call(server, pageId, 'data', 'check_endpoint_raise');
        assert.equal(error.code, 'application_error');
        assert.match(error.details, /check/);
    } finally {
        if (saved === undefined) delete process.env.GRAMLOT_DEV;
        else process.env.GRAMLOT_DEV = saved;
    }
});

test('call: InvalidRequest is the only error it throws', async () => {
    const server = new GramlotFileServer(pages);
    const {pageId} = await server.openPage('/');
    const valid = {id: 'r1', pageId, contentType: 'data', name: 'check_endpoint', params: {value: 1}};
    const invalid = ['not json', '[1,2]', '"x"', 'null', ...[
        {id: undefined}, {pageId: 1}, {contentType: 'other'}, {name: null},
        {params: undefined}, {params: null}, {params: [1]}, {params: 'x'},
    ].map(change => toTytx({...valid, ...change}))];
    for (const text of invalid) {
        await assert.rejects(server.call(text), error => error instanceof InvalidRequest && error.name === 'InvalidRequest', text);
    }
});

test('main cannot be declared; a name is a Source method or an endpoint, not both', () => {
    class Declared extends EmptyPage {
        both(root) {}
    }
    assert.throws(() => Declared.registerSource('main'), {name: 'TypeError', message: 'registerSource cannot declare main'});
    assert.throws(() => Declared.registerEndpoint('main'), {name: 'TypeError', message: 'registerEndpoint cannot declare main'});
    Declared.registerSource('both');
    assert.throws(() => Declared.registerEndpoint('both'),
        {name: 'TypeError', message: 'both is declared both as Source method and endpoint'});
});

// Phase 18 (Fable M3): the namespace URIs and the name-segment rule are defined in one place in js/src.
test('Fable M3: HTML_NS/SVG_NS and SEGMENT are each defined once in js/src', async () => {
    const {readdir, readFile} = await import('node:fs/promises');
    const root = fileURLToPath(new URL('../src/', import.meta.url));
    const files = (await readdir(root, {recursive: true})).filter(name => name.endsWith('.js'));
    const count = async pattern => {
        let total = 0;
        for (const name of files) total += ((await readFile(join(root, name), 'utf8')).match(pattern) ?? []).length;
        return total;
    };
    assert.equal(await count(/['"]http:\/\/www\.w3\.org\/1999\/xhtml['"]/g), 1);
    assert.equal(await count(/['"]http:\/\/www\.w3\.org\/2000\/svg['"]/g), 1);
    assert.equal(await count(/\/\^\[A-Za-z0-9_-\]\+\$\//g), 1);
});

// 0.2.12: the GramlotServer functionality shared with Python (tests/test_source_server.py AlignmentTests).
class EmptyPage extends Page {
    main(root) {}
}

const memoryServer = (PageClass, options) => new (class extends GramlotServer {
    async resolvePage() { return PageClass; }
    async resolveResources() { return {css: [], js: []}; }
})(options);

test('closeAll empties the registry', async () => {
    const server = memoryServer(EmptyPage);
    const {pageId} = await server.openPage('/', {owner: 'one'});
    await server.openPage('/', {owner: 'two'});
    assert.equal(server.closeAll(), undefined);
    assert.equal(server.pages.size, 0);
    assert.equal(await code(main(server, pageId, {owner: 'one'})), 'page_expired');
});

test('the base Page and non-Page classes are rejected', async () => {
    for (const PageClass of [Page, Object, 'index']) {
        const server = memoryServer(PageClass);
        await assert.rejects(server.openPage('/'), {name: 'TypeError', message: 'Page modules must export a subclass of Page'});
        assert.equal(server.pages.size, 0);
    }
});

test('a missing or unregistered Source method is not_found', async () => {
    class PlainPage extends EmptyPage {
        plain(root) { root.p('plain'); }
    }
    PlainPage.prototype.flag = 1;
    const server = memoryServer(PlainPage);
    const {pageId} = await server.openPage('/');
    for (const method of ['plain', 'flag', 'missing', '_x']) {
        assert.deepEqual((await call(server, pageId, 'source', method)).error,
            {code: 'not_found', name: 'SourceNotFound', message: `Unknown Source method: ${method}`});
    }
});

test('the Source builder is named after the method', async () => {
    const names = [];
    class RecordingBuilder extends GramlotBuilder {
        constructor(name = null, options) {
            super(name, options);
            names.push(this.name);
        }
    }
    class RecordingPage extends EmptyPage {
        static sourceBuilder = RecordingBuilder;
        details(root) {}
    }
    RecordingPage.registerSource('details');
    const server = memoryServer(RecordingPage);
    const {pageId} = await server.openPage('/');
    await main(server, pageId);
    await call(server, pageId, 'source', 'details');
    assert.deepEqual(names, ['main', 'details']);
});

test('every error class carries its own name', () => {
    for (const ErrorClass of [PageExpired, PageNotFound, SourceNotFound, EndpointNotFound, NotAuthenticated, NotAuthorized,
        InvalidRequest, ServerCapacity, InvalidResourceName]) {
        const error = new ErrorClass('x');
        assert.ok(error instanceof Error);
        assert.equal(error.name, ErrorClass.name);
    }
});

test('registerSource marks an own method once; an unregistered override hides the parent one', async () => {
    class Parent extends EmptyPage {
        hidden(root) { root.p('base'); }
        shared(root) { root.p('shared'); }
    }
    Parent.registerSource('hidden');
    Parent.registerSource('shared');
    class Child extends Parent {
        hidden(root) { root.p('override'); }
        local(root) {}
        static staticMethod() {}
    }
    Child.prototype.flag = 1;
    for (const name of ['shared', 'missing', 'flag', 'staticMethod']) {
        assert.throws(() => Child.registerSource(name), {name: 'TypeError', message: `registerSource requires an own method of Child: ${name}`});
    }
    Child.registerSource('local');
    assert.throws(() => Child.registerSource('local'), {name: 'TypeError', message: 'Source method already registered: local'});
    const server = memoryServer(Child);
    const {pageId} = await server.openPage('/');
    assert.equal(await code(call(server, pageId, 'source', 'hidden')), 'not_found');
    assert.equal((await call(server, pageId, 'source', 'shared')).value.getNodes()[0].value, 'shared');
});

test('a Source method that returns a value is an application_error', async () => {
    class BadPage extends EmptyPage {
        bad(root) { return root.div('bad'); }
    }
    BadPage.registerSource('bad');
    const server = memoryServer(BadPage);
    const {pageId} = await server.openPage('/');
    assert.deepEqual((await call(server, pageId, 'source', 'bad')).error,
        {code: 'application_error', name: 'TypeError', message: 'Source methods populate root and return no value'});
});

test('registerPage registers a page without writing its HTML', async () => {
    class TitledPage extends EmptyPage {
        static title = 'Titled';
    }
    const server = memoryServer(TitledPage);
    const registered = await server.registerPage('/', {owner: 'one'});
    assert.deepEqual(Object.keys(registered).sort(), ['pageId', 'resources', 'title']);
    assert.match(registered.pageId, /^[0-9a-f]{32}$/);
    assert.equal(registered.title, 'Titled');
    assert.deepEqual(registered.resources, {css: [], js: []});
    assert.equal(server.pages.get(registered.pageId).owner, 'one');
    assert.equal((await main(server, registered.pageId, {owner: 'one'})).value.getNodes().length, 0);
});

test('no page is registered when the bootstrap fails', async () => {
    const server = memoryServer(EmptyPage, {runtimeUrl: {}});
    await assert.rejects(server.openPage('/'), TypeError);
    assert.equal(server.pages.size, 0);
});

test('configured URLs, root id and capabilities reach the bootstrap', async () => {
    const server = memoryServer(EmptyPage, {rpcUrl: '/r', closeUrl: '/c', rootId: 'here'});
    const {pageId, html} = await server.openPage('/', {prefix: '/app'});
    assert.ok(html.includes(`"config":{"pageId":"${pageId}","rpcUrl":"/app/r","closeUrl":"/app/c","rootId":"here","capabilities":[]}`));
    assert.ok(html.includes('<div id="here">'));
    assert.deepEqual(new GramlotServer().capabilities, []);
    assert.equal(new GramlotServer().rpcUrl, '/gramlot/rpc');
});

test('pagesDir is the absolute pages folder', () => {
    assert.equal(new GramlotFileServer('pages').pagesDir, resolve('pages'));
});
