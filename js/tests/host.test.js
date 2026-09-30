import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {mkdtemp, writeFile, symlink, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {Host, Page, GramlotBuilder, PageExpired, HostCapacity, PageNotFound, SourceNotFound} from '../src/adapters/index.js';
import {FileHost} from '../src/adapters/file-host.js';
import {fromTytx} from '@jsr/genro__tytx';
import {SourceBag} from '@jsr/genro__builders';

const pages = fileURLToPath(new URL('./fixtures/pages/', import.meta.url));

test('file host: bootstrap and async main, identity, fresh page state and cleanup', async () => {
    const host = new FileHost(pages);
    const opened = await host.openPage('/', {owner: 'alice'});
    assert.ok(opened.html.includes('id="gramlot-root"'));
    assert.ok(!opened.html.includes('homer'));
    assert.ok(opened.html.includes(opened.pageId));
    assert.ok(opened.html.includes('"closeUrl":"/gramlot/close"'));
    assert.ok(opened.html.includes(`<script type="module" nonce="${opened.nonce}">`));
    assert.notEqual(opened.nonce, opened.pageId);
    assert.ok(!opened.html.includes('<link'));
    await assert.rejects(host.main(opened.pageId, {owner: 'bob'}), PageExpired);
    const wire = await host.main(opened.pageId, {owner: 'alice'});
    const bag = fromTytx(wire);
    assert.ok(bag instanceof SourceBag);
    assert.equal(bag.getNodes()[0].attr._text, 'homer');
    assert.equal(bag.getNodes()[0].value.getNodes()[0].value, 'bart');
    host.closePage(opened.pageId, {owner: 'bob'});
    assert.equal(host.pages.size, 1);
    host.closePage(opened.pageId, {owner: 'alice'});
    await assert.rejects(host.main(opened.pageId, {owner: 'alice'}), PageExpired);
    class StatefulPage extends Page {
        count = 0;
        main(root) { root.div(String(++this.count), {id: this.pageId}); }
    }
    class MemoryHost extends Host {
        async resolvePage() { return StatefulPage; }
        async resolveResources() { return {css: [], js: []}; }
    }
    const memory = new MemoryHost();
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
    class MemoryHost extends Host {
        async resolvePage() { return CustomPage; }
        async resolveResources() { return {css: ['/x" onload="bad'], js: []}; }
    }
    const host = new MemoryHost({maxPages: 1, runtimeUrl: '/x</script>.js'});
    const {pageId, html} = await host.openPage('/');
    assert.ok(!html.includes('<script>bad'));
    assert.ok(!html.includes('/x</script>'));
    assert.ok(html.includes('&lt;/title&gt;'));
    // The CSS URLs are JSON inside the module script (S07, D9): no attribute to break out of.
    assert.ok(!html.includes('<link'));
    assert.ok(html.includes('"css":["/x\\" onload=\\"bad"]'));
    await assert.rejects(host.openPage('/'), HostCapacity);
    host.pages.get(pageId).expires = 0;
    await assert.rejects(host.main(pageId), PageExpired);
    await host.openPage('/');
    const other = new MemoryHost();
    assert.equal(other.pages.size, 0);
});

test('host rejects non-expiring TTL and invalid registry capacity', () => {
    for (const pageTtl of [Infinity, NaN, 1e308, '30', 0]) {
        assert.throws(() => new Host({pageTtl}), TypeError);
    }
    for (const maxPages of [Infinity, 1.5, '2', 0]) {
        assert.throws(() => new Host({maxPages}), TypeError);
    }
});

test('file loader rejects traversal, missing pages, symlink escapes and invalid classes', async () => {
    const host = new FileHost(pages);
    for (const path of ['/../index', '/index.js', '/missing', '/a//b', '/index_aux']) {
        await assert.rejects(host.openPage(path), PageNotFound);
    }
    const directory = await mkdtemp(join(tmpdir(), 'gramlot-host-'));
    try {
        await writeFile(join(directory, 'package.json'), '{"type":"module"}');
        await writeFile(join(directory, 'index.js'), 'export class Page {}');
        await symlink(join(pages, 'index.js'), join(directory, 'escape.js'));
        const temporary = new FileHost(directory);
        await assert.rejects(temporary.openPage('/escape'), PageNotFound);
        await assert.rejects(temporary.openPage('/'), /subclass/);
    } finally { await rm(directory, {recursive: true, force: true}); }
});

test('remote Source requires an explicit method and cannot dispatch main', async () => {
    const host = new FileHost(pages);
    const {pageId} = await host.openPage('/');
    for (const method of [null, undefined, 'main']) {
        await assert.rejects(host.source(pageId, method), SourceNotFound);
    }
    const block = fromTytx(await host.source(pageId, 'details', {name: 'remote'}));
    assert.equal(block.getNodes()[0].value, 'remote');
});

// Phase 18 (Fable R4 a, b): the remote Source errors and the null params of the Python Host.
test('Fable R4: an unknown Source method is SourceNotFound, as in Python; null params are {}', async () => {
    const host = new FileHost(pages);
    const {pageId} = await host.openPage('/');
    await assert.rejects(host.source(pageId, 'main'), error => error instanceof SourceNotFound
        && !(error instanceof PageNotFound) && error.message === 'Unknown Source method');
    await assert.rejects(host.source(pageId, 'nope'), error => error instanceof SourceNotFound
        && error.message === 'Unknown Source method: nope');
    for (const params of [null, undefined]) {
        assert.equal(fromTytx(await host.source(pageId, 'details', params)).getNodes()[0].value, 'remote');
    }
    for (const params of [[], 'x', 1]) {
        await assert.rejects(host.source(pageId, 'details', params), {name: 'TypeError', message: 'Source params must be an object'});
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
