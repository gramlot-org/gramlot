import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {mkdtemp, writeFile, symlink, rm} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {GramlotServer, Page, GramlotBuilder, PageExpired, ServerCapacity, PageNotFound, SourceNotFound} from '../src/server/index.js';
import {GramlotFileServer} from '../src/server/gramlot-file-server.js';
import {InvalidResourceName} from '../src/server/resources.js';
import {fromTytx} from '@genrojs/tytx';
import {SourceBag} from '@genrojs/builders';

const pages = fileURLToPath(new URL('./fixtures/pages/', import.meta.url));

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
    await assert.rejects(server.main(opened.pageId, {owner: 'bob'}), PageExpired);
    const wire = await server.main(opened.pageId, {owner: 'alice'});
    const bag = fromTytx(wire);
    assert.ok(bag instanceof SourceBag);
    assert.equal(bag.getNodes()[0].attr._text, 'homer');
    assert.equal(bag.getNodes()[0].value.getNodes()[0].value, 'bart');
    server.closePage(opened.pageId, {owner: 'bob'});
    assert.equal(server.pages.size, 1);
    server.closePage(opened.pageId, {owner: 'alice'});
    await assert.rejects(server.main(opened.pageId, {owner: 'alice'}), PageExpired);
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
        const node = fromTytx(await memory.main(pageId)).getNodes()[0];
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
    await assert.rejects(server.main(pageId), PageExpired);
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

test('remote Source requires an explicit method and cannot dispatch main', async () => {
    const server = new GramlotFileServer(pages);
    const {pageId} = await server.openPage('/');
    for (const method of [null, undefined, 'main']) {
        await assert.rejects(server.source(pageId, method), SourceNotFound);
    }
    const block = fromTytx(await server.source(pageId, 'details', {name: 'remote'}));
    assert.equal(block.getNodes()[0].value, 'remote');
});

// Phase 18 (Fable R4 a, b): the remote Source errors and the null params of the Python GramlotServer.
test('Fable R4: an unknown Source method is SourceNotFound, as in Python; null params are {}', async () => {
    const server = new GramlotFileServer(pages);
    const {pageId} = await server.openPage('/');
    await assert.rejects(server.source(pageId, 'main'), error => error instanceof SourceNotFound
        && !(error instanceof PageNotFound) && error.message === 'Unknown Source method');
    await assert.rejects(server.source(pageId, 'nope'), error => error instanceof SourceNotFound
        && error.message === 'Unknown Source method: nope');
    for (const params of [null, undefined]) {
        assert.equal(fromTytx(await server.source(pageId, 'details', params)).getNodes()[0].value, 'remote');
    }
    for (const params of [[], 'x', 1]) {
        await assert.rejects(server.source(pageId, 'details', params), {name: 'TypeError', message: 'Source params must be an object'});
    }
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
    await assert.rejects(server.main(pageId, {owner: 'one'}), PageExpired);
});

test('the base Page and non-Page classes are rejected', async () => {
    for (const PageClass of [Page, Object, 'index']) {
        const server = memoryServer(PageClass);
        await assert.rejects(server.openPage('/'), {name: 'TypeError', message: 'Page modules must export a subclass of Page'});
        assert.equal(server.pages.size, 0);
    }
});

test('a missing or unregistered Source method is SourceNotFound', async () => {
    class PlainPage extends EmptyPage {
        plain(root) { root.p('plain'); }
    }
    PlainPage.prototype.flag = 1;
    const server = memoryServer(PlainPage);
    const {pageId} = await server.openPage('/');
    for (const method of ['plain', 'flag', 'missing', '_x']) {
        await assert.rejects(server.source(pageId, method), {name: 'SourceNotFound', message: `Unknown Source method: ${method}`});
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
    await server.main(pageId);
    await server.source(pageId, 'details');
    assert.deepEqual(names, ['main', 'details']);
});

test('every error class carries its own name', () => {
    for (const ErrorClass of [PageExpired, PageNotFound, SourceNotFound, ServerCapacity, InvalidResourceName]) {
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
    await assert.rejects(server.source(pageId, 'hidden'), SourceNotFound);
    assert.equal(fromTytx(await server.source(pageId, 'shared')).getNodes()[0].value, 'shared');
});

test('a Source method that returns a value is a TypeError', async () => {
    class BadPage extends EmptyPage {
        bad(root) { return root.div('bad'); }
    }
    BadPage.registerSource('bad');
    const server = memoryServer(BadPage);
    const {pageId} = await server.openPage('/');
    await assert.rejects(server.source(pageId, 'bad'), {name: 'TypeError', message: 'Source methods populate root and return no value'});
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
    assert.equal(fromTytx(await server.main(registered.pageId, {owner: 'one'})).getNodes().length, 0);
});

test('no page is registered when the bootstrap fails', async () => {
    const server = memoryServer(EmptyPage, {runtimeUrl: {}});
    await assert.rejects(server.openPage('/'), TypeError);
    assert.equal(server.pages.size, 0);
});

test('configured URLs and root id reach the bootstrap', async () => {
    const server = memoryServer(EmptyPage, {mainUrl: '/m', sourceUrl: '/s', closeUrl: '/c', rootId: 'here'});
    const {html} = await server.openPage('/', {prefix: '/app'});
    for (const text of ['"mainUrl":"/app/m"', '"sourceUrl":"/app/s"', '"closeUrl":"/app/c"', '"rootId":"here"', '<div id="here">']) {
        assert.ok(html.includes(text), text);
    }
});

test('pagesDir is the absolute pages folder', () => {
    assert.equal(new GramlotFileServer('pages').pagesDir, resolve('pages'));
});
