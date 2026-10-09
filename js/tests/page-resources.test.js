/** Minimal GramlotServer contract, minimal GramlotFileServer and bootstrap resources (S06).
 * The Python counterpart is tests/test_page_resources.py; the last test compares
 * the descriptors of both languages on the same pages folder.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtemp, mkdir, rm, symlink, unlink, utimes, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {tmpdir} from 'node:os';
import {realpathSync} from 'node:fs';
import {
    GramlotFileServer, GramlotServer, ServerCapacity, InvalidResourceName, Page, PageNotFound, parseRequires,
} from '../src/server/index.js';
import {loadOrder} from '../src/server/resources.js';
import {toTytx} from '@genrojs/tytx';

/** The fragment text of a source call, the wire the client transport reads until it speaks the envelope. */
async function sourceText(server, pageId, name = 'main', params = {}) {
    const response = JSON.parse(await server.call(toTytx({id: 'r1', pageId, contentType: 'source', name, params})));
    if (response.error) throw new Error(response.error.message);
    return response.value;
}

const PAGE_MODULE = new URL('../src/server/page.js', import.meta.url).href;
const URL_FORMS = ['/themes/x.css', '//cdn.example.org/a.css', 'https://cdn.example.org/lib.css',
    './local.css', 'theme.css'];

const jsPage = ({css = [], cssRequires = '', jsRequires = '', logic = false} = {}) =>
    `import {Page as Base} from ${JSON.stringify(PAGE_MODULE)};
export class Page extends Base {
    static css = ${JSON.stringify(css)};
    static css_requires = ${JSON.stringify(cssRequires)};
    static js_requires = ${JSON.stringify(jsRequires)};
    main(root) { root.div('ok'); }
}
${logic ? 'export class Logic {}\n' : ''}`;
const pyPage = ({css = [], cssRequires = '', jsRequires = ''} = {}) =>
    `from gramlot import Page as Base
class Page(Base):
    css = tuple(${JSON.stringify(css)})
    css_requires = ${JSON.stringify(cssRequires)}
    js_requires = ${JSON.stringify(jsRequires)}
    def main(self, root): root.div("ok")
`;

async function write(root, relative, text = '') {
    const filename = join(root, ...relative.split('/'));
    await mkdir(dirname(filename), {recursive: true});
    await writeFile(filename, text);
    return filename;
}

async function folder(run) {
    const root = await mkdtemp(join(tmpdir(), 'gramlot-resources-'));
    try {
        await writeFile(join(root, 'package.json'), '{"type":"module"}');
        await run(root);
    } finally { await rm(root, {recursive: true, force: true}); }
}

/** The argument the server writes into `new PageBootstrap(…)` (S07). */
function bootstrapArguments(html) {
    const match = html.match(/import \{PageBootstrap\} from "[^"]*";await new PageBootstrap\((.*)\)\.run\(\);<\/script>/s);
    return JSON.parse(match[1]);
}
/** The CSS URLs PageBootstrap writes as links in the live page; the server HTML has none (D9). */
const links = html => {
    assert.ok(!html.includes('<link'));
    return bootstrapArguments(html).resources.css;
};
const resolved = async (server, path) => server.resolveResources(path, await server.resolvePage(path));

class TestPage extends Page {}

class MemoryServer extends GramlotServer {
    constructor(resources, options = {}) {
        super(options);
        this.resources = resources;
    }
    async resolvePage() { return TestPage; }
    async resolveResources() { return this.resources; }
}

test('parseRequires: names, spaces, empty tokens, duplicates and invalid names', () => {
    assert.deepEqual(parseRequires(''), []);
    assert.deepEqual(parseRequires(' , ,'), []);
    assert.deepEqual(parseRequires(' business ,gui,, business,\tgui_2 '), ['business', 'gui', 'gui_2']);
    assert.deepEqual(parseRequires('frameplugin_menu/frameplugin_menu,a-b'),
        ['frameplugin_menu/frameplugin_menu', 'a-b']);
    assert.deepEqual(parseRequires(' theme　, gui\u0085, x '), ['theme', 'gui', 'x']);
    for (const text of ['..', '.', 'a/../b', '/a', 'a/', 'a//b', 'a b', 'à', 'a\\b', '﻿theme']) {
        assert.throws(() => parseRequires(text), error => error instanceof InvalidResourceName &&
            /Invalid resource name/.test(error.message), text);
    }
    for (const text of ['a.css', 'lib/theme.min']) assert.throws(() => parseRequires(text), /names have no extension/);
    assert.throws(() => parseRequires('print:media'), /name:media/);
    for (const value of [null, ['a'], {}]) assert.throws(() => parseRequires(value), /comma-separated string/);
});

test('loadOrder: repeated URL once in its last position; one JS URL with two groups is an error', () => {
    assert.deepEqual(loadOrder({css: ['/a.css', '/b.css', '/a.css'],
        js: [{url: '/x.js', group: null}, {url: '/y.js', group: null}, {url: '/x.js', group: null}]}),
    {css: ['/b.css', '/a.css'], js: [{url: '/y.js', group: null}, {url: '/x.js', group: null}]});
    for (const groups of [['calcoli', 'utils'], ['calcoli', null], [null, 'utils']]) {
        assert.throws(() => loadOrder({css: [], js: groups.map(group => ({url: '/js/comune.js', group}))}),
            error => error instanceof InvalidResourceName && /two groups/.test(error.message));
    }
});

test('file server: file page wins, folder page, segments and the _aux suffix', () => folder(async root => {
    await write(root, 'orders/orders.js', jsPage());
    const server = new GramlotFileServer(root);
    const real = realpathSync(root);
    assert.equal(await server.locatePage('/orders'), join(real, 'orders/orders.js'));
    await write(root, 'orders.js', jsPage());
    assert.equal(await server.locatePage('/orders'), join(real, 'orders.js'));
    assert.equal(await server.locatePage('/orders/orders'), join(real, 'orders/orders.js'));
    for (const name of ['01_hello-world', '_private', 'index', 'foo_aux', 'sub/foo_aux']) {
        await write(root, `${name}.js`, jsPage());
    }
    await write(root, 'only_py.py');
    for (const path of ['/01_hello-world', '/_private', '/', '/index', '/orders']) {
        const {pageId} = await server.openPage(path);
        assert.ok((await sourceText(server, pageId)).includes('ok'), path);
    }
    for (const path of ['/foo_aux', '/sub/foo_aux', '/only_py', '/a.b', '/à', '/a b', '/../index', '/a//b',
        '/index.js', '/missing', '/%2e%2e/index']) {
        await assert.rejects(server.openPage(path), PageNotFound, path);
    }
    await assert.rejects(new GramlotFileServer(join(root, 'absent')).openPage('/'), PageNotFound);
}));

test('file server: without reload the page module is imported once, with reload again when it changes', () => folder(async root => {
    const titled = async (title, seconds) => {
        const filename = await write(root, 'index.js', `${jsPage()}Page.title = ${JSON.stringify(title)};\n`);
        await utimes(filename, seconds, seconds);
    };
    await titled('old', 1_000_000);
    const cached = new GramlotFileServer(root, {reload: false}), reloading = new GramlotFileServer(root, {reload: true});
    for (const server of [cached, reloading]) assert.equal((await server.resolvePage('/')).title, 'old');
    await titled('new', 2_000_000);
    assert.equal((await cached.resolvePage('/')).title, 'old');
    assert.equal((await reloading.resolvePage('/')).title, 'new');
    assert.deepEqual((await resolved(reloading, '/')).js, []);
}));

test('file server: without reload a symlinked page module is imported once, by its real path', () => folder(async root => {
    await write(root, 'index.js', jsPage());
    await symlink(join(root, 'index.js'), join(root, 'alias.js'));
    const server = new GramlotFileServer(root, {reload: false});
    assert.equal(await server.resolvePage('/alias'), await server.resolvePage('/'));
}));

test('file server: reload null follows GRAMLOT_DEV, an explicit boolean wins', () => folder(async root => {
    const saved = process.env.GRAMLOT_DEV;
    try {
        for (const [value, expected] of [[undefined, false], ['YES', true], ['DEBUG', true]]) {
            if (value === undefined) delete process.env.GRAMLOT_DEV;
            else process.env.GRAMLOT_DEV = value;
            assert.equal(new GramlotFileServer(root).reload, expected);
            assert.equal(new GramlotFileServer(root, {reload: !expected}).reload, !expected);
        }
    } finally {
        if (saved === undefined) delete process.env.GRAMLOT_DEV;
        else process.env.GRAMLOT_DEV = saved;
    }
}));

test('file server: paths leaving the pages folder are rejected', async () => {
    const outside = await mkdtemp(join(tmpdir(), 'gramlot-outside-'));
    try {
        await folder(async root => {
            await write(outside, 'package.json', '{"type":"module"}');
            await write(outside, 'evil.js', jsPage());
            await write(outside, 'evil.css');
            await write(root, 'index.js', jsPage());
            await symlink(join(outside, 'evil.js'), join(root, 'escape.js'));
            const server = new GramlotFileServer(root);
            await assert.rejects(server.openPage('/escape'), PageNotFound);
            await symlink(join(outside, 'evil.css'), join(root, 'index.css'));
            await assert.rejects(server.openPage('/'), /leaves the pages folder/);
            assert.equal(server.pages.size, 0);
            await write(root, 'inner.css');
            await unlink(join(root, 'index.css'));
            await symlink(join(root, 'inner.css'), join(root, 'index.css'));
            assert.deepEqual((await resolved(server, '/')).css, ['/index.css']);
        });
    } finally { await rm(outside, {recursive: true, force: true}); }
});

test('file server: Page.css then the companions, beside the file page and in the folder', () => folder(async root => {
    await write(root, 'area/invoices.js', jsPage({css: ['/themes/base.css']}));
    await write(root, 'area/invoices.css');
    await write(root, 'area/invoices_aux.js');
    await write(root, 'area/invoices.md');
    await write(root, 'orders/orders.js', jsPage({css: ['/themes/base.css', 'orders.css']}));
    await write(root, 'orders/orders.css');
    await write(root, 'orders/orders_aux.js');
    await write(root, 'plain.js', jsPage({css: ['/themes/base.css']}));
    const server = new GramlotFileServer(root);
    assert.deepEqual(await resolved(server, 'area/invoices'), {css: ['/themes/base.css', '/area/invoices.css'],
        js: [{url: '/area/invoices_aux.js', group: null}]});
    assert.deepEqual(await resolved(server, 'orders'), {css: ['/themes/base.css', 'orders.css', '/orders/orders.css'],
        js: [{url: '/orders/orders_aux.js', group: null}]});
    assert.deepEqual(await resolved(server, 'plain'), {css: ['/themes/base.css'], js: []});
}));

test('file server: the Logic export of the page module is the page logic, else the _aux companion, never both', () => folder(async root => {
    await write(root, 'single.js', jsPage({logic: true}));
    await write(root, 'nested/nested.js', jsPage({logic: true}));
    await write(root, 'twice.js', jsPage({logic: true}));
    await write(root, 'twice_aux.js', 'export class Logic {}\n');
    const server = new GramlotFileServer(root);
    assert.deepEqual(await resolved(server, 'single'), {css: [], js: [{url: '/single.js', group: null}]});
    assert.deepEqual(await resolved(server, 'nested'), {css: [], js: [{url: '/nested/nested.js', group: null}]});
    await assert.rejects(server.openPage('/twice'), error => error.constructor === Error &&
        error.message === 'Two logic modules for one page: /twice.js and /twice_aux.js');
    assert.equal(server.pages.size, 0);
    const opened = await server.openPage('/single', {prefix: '/app'});
    assert.deepEqual(bootstrapArguments(opened.html).resources.js, [{url: '/app/single.js', group: null}]);
}));

test('bootstrap: the import map points @gramlot/gramlot/page to the runtime, with the mount prefix and the nonce', async () => {
    const server = new MemoryServer({css: [], js: []}, {runtimeUrl: '/static/gramlot.js'});
    for (const [prefix, runtime] of [['', '/static/gramlot.js'], ['/app', '/app/static/gramlot.js']]) {
        const opened = await server.openPage('/', {prefix});
        const map = `<script type="importmap" nonce="${opened.nonce}">` +
            `{"imports":{"@gramlot/gramlot/page":"${runtime}"}}</script></head>`;
        assert.ok(opened.html.includes(map), prefix);
        assert.ok(opened.html.indexOf('type="importmap"') < opened.html.indexOf('type="module"'));
    }
});

test('file server: requires names need a GramlotServer with a resource system', () => folder(async root => {
    await write(root, 'themed.js', jsPage({cssRequires: 'tema'}));
    await write(root, 'logic.js', jsPage({jsRequires: 'calcoli'}));
    await write(root, 'invalid.js', jsPage({cssRequires: '../tema'}));
    await write(root, 'blank.js', jsPage({cssRequires: ' , '}));
    const server = new GramlotFileServer(root);
    for (const path of ['/themed', '/logic']) {
        await assert.rejects(server.openPage(path), error => error instanceof InvalidResourceName &&
            error.message === 'requires need a GramlotServer with a resource system', path);
    }
    await assert.rejects(server.openPage('/invalid'), /Invalid resource name/);
    assert.equal(server.pages.size, 0);
    const {pageId} = await server.openPage('/blank');
    assert.ok((await sourceText(server, pageId)).includes('ok'));
}));

test('file server: a repeated URL loads once, in its last position', () => folder(async root => {
    await write(root, 'index.js', jsPage({css: ['/index.css', '/themes/a.css', '/themes/b.css', '/themes/a.css']}));
    await write(root, 'index.css');
    const {html} = await new GramlotFileServer(root).openPage('/');
    assert.deepEqual(links(html), ['/themes/b.css', '/themes/a.css', '/index.css']);
}));

test('bootstrap: the mount prefix is added once, only to root-relative URLs', () => folder(async root => {
    await write(root, 'index.js', jsPage({css: URL_FORMS}));
    await write(root, 'index.css');
    const server = new GramlotFileServer(root);
    const mounted = await server.openPage('/', {prefix: '/js'});
    assert.deepEqual(links(mounted.html), ['/js/themes/x.css', ...URL_FORMS.slice(1), '/js/index.css']);
    assert.ok(mounted.html.includes('import {PageBootstrap} from "/js/assets/gramlot.js"'));
    for (const [key, url] of [['rpcUrl', '/gramlot/rpc'], ['closeUrl', '/gramlot/close']]) {
        assert.ok(mounted.html.includes(`"${key}":"/js${url}"`), key);
    }
    assert.ok(!mounted.html.includes('/js/js'));
    const plain = await server.openPage('/');
    assert.deepEqual(links(plain.html), [...URL_FORMS, '/index.css']);
    assert.ok(plain.html.includes('import {PageBootstrap} from "/assets/gramlot.js"'));
    await assert.rejects(server.openPage('/', {prefix: null}), /Mount prefix must be a string/);
}));

test('bootstrap: C02 and D8, the JS module URLs take the mount prefix only when root-relative', async () => {
    const js = [{url: '/a.js', group: 'a'}, {url: 'b.js', group: 'b'}, {url: './c.js', group: null},
        {url: 'https://cdn.example.org/d.js', group: 'd'}, {url: '//cdn.example.org/e.js', group: 'e'}];
    const server = new MemoryServer({css: [], js});
    const mounted = bootstrapArguments((await server.openPage('/', {prefix: '/js'})).html);
    assert.deepEqual(mounted.resources.js, [{...js[0], url: '/js/a.js'}, ...js.slice(1)]);
    assert.deepEqual(bootstrapArguments((await server.openPage('/')).html).resources.js, js);
    assert.deepEqual(Object.keys(mounted), ['config', 'resources']);
    assert.deepEqual(Object.keys(mounted.config), ['pageId', 'rpcUrl', 'closeUrl', 'rootId', 'capabilities']);
});

test('bootstrap: the nonce is new at each opening and distinct from the page ID', async () => {
    const server = new MemoryServer({css: [], js: []});
    const [first, second] = [await server.openPage('/'), await server.openPage('/')];
    assert.notEqual(first.nonce, second.nonce);
    assert.notEqual(first.nonce, first.pageId);
    assert.match(first.nonce, /^[A-Za-z0-9_-]{22}$/);
    assert.ok(first.html.includes(`<script type="module" nonce="${first.nonce}">`));
    assert.ok(!first.html.includes(second.nonce));
});

test('neutral server: the contract, C03 before registration, capacity, expiry and owner', async () => {
    await assert.rejects(new GramlotServer().openPage('/'), PageNotFound);
    await assert.rejects(new GramlotServer().resolveResources('/', TestPage), PageNotFound);
    await assert.rejects(new (class extends GramlotServer { async resolvePage() { return TestPage; } })().openPage('/'),
        PageNotFound);
    const conflicting = new MemoryServer({css: [], js: [{url: '/js/comune.js', group: 'calcoli'},
        {url: '/js/comune.js', group: 'utils'}]});
    await assert.rejects(conflicting.openPage('/'), /two groups/);
    assert.equal(conflicting.pages.size, 0);
    const server = new MemoryServer({css: [], js: []}, {maxPages: 1});
    const {pageId} = await server.openPage('/', {owner: 'one'});
    await assert.rejects(server.openPage('/', {owner: 'one'}), ServerCapacity);
    const mainCode = async owner => JSON.parse(await server.call(toTytx({id: 'r1', pageId, contentType: 'source', name: 'main',
        params: {}}), {owner})).error?.code;
    assert.equal(await mainCode('two'), 'page_expired');
    server.pages.get(pageId).expires = 0;
    assert.equal(await mainCode('one'), 'page_expired');
});

test('Python and JavaScript give the same parser outcomes, descriptors, links and load order', () => folder(async root => {
    const pages = {
        'area/invoices': {css: ['/themes/base.css', 'theme.css', '/themes/base.css']},
        orders: {css: ['//cdn.example.org/a.css', 'https://cdn.example.org/lib.css', './local.css']},
        themed: {cssRequires: 'tema'},
        index: {},
    };
    for (const [path, declaration] of Object.entries(pages)) {
        const name = path.split('/').at(-1);
        const base = path === 'orders' ? `orders/${name}` : path;
        // Beside a Python page, foo.js gives the logic (Python cannot read its exports): it exports Logic.
        await write(root, `${base}.js`, jsPage({...declaration, logic: true}));
        await write(root, `${base}.py`, pyPage(declaration));
    }
    for (const companion of ['area/invoices.css', 'orders/orders.css', 'index.css']) await write(root, companion);
    const inputs = ['', ' , ,', ' business ,gui,, business,\tgui_2 ', 'a/b,a-b', ' theme　, gui\u0085', '..',
        'a/../b', 'a b', 'à', '﻿theme', 'a.css', 'print:media', 'a//b'];
    const orders = [
        {css: ['/a.css', '/b.css', '/a.css'], js: [{url: '/x.js', group: null}, {url: '/x.js', group: null}]},
        {css: [], js: [{url: '/js/comune.js', group: 'calcoli'}, {url: '/js/comune.js', group: 'utils'}]},
        {css: [], js: [{url: '/js/comune.js', group: null}, {url: '/js/comune.js', group: 'utils'}]},
    ];
    const paths = Object.keys(pages);
    const python = JSON.parse(execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', `
import asyncio, json, re, sys
from gramlot.server import GramlotFileServer, parse_requires
from gramlot.server.resources import load_order
server = GramlotFileServer(sys.argv[1])
inputs, orders, paths = json.loads(sys.argv[2])
def outcome(function):
    try:
        return function()
    except (ValueError, LookupError) as error:
        return [type(error).__name__, str(error)]
def links(path):
    html = asyncio.run(server.open_page(path, prefix="/app")).html
    return json.loads(re.search(r'await new PageBootstrap\\((.*)\\)\\.run\\(\\);</script>', html, re.S).group(1))["resources"]["css"]
print(json.dumps({
    "parsed": [outcome(lambda: list(parse_requires(text))) for text in inputs],
    "descriptors": [outcome(lambda: server.resolve_resources(path, server.resolve_page(path))) for path in paths],
    "links": [outcome(lambda: links(path)) for path in paths],
    "orders": [outcome(lambda: load_order(resources)) for resources in orders]}))
`, root, JSON.stringify([inputs, orders, paths])], {encoding: 'utf8'}));
    const server = new GramlotFileServer(root);
    const outcome = async run => {
        try { return await run(); } catch (error) { return [error.constructor.name, error.message]; }
    };
    const javascript = {parsed: [], descriptors: [], links: [], orders: []};
    for (const text of inputs) javascript.parsed.push(await outcome(() => parseRequires(text)));
    for (const path of paths) {
        javascript.descriptors.push(await outcome(() => resolved(server, path)));
        javascript.links.push(await outcome(async () => links((await server.openPage(path, {prefix: '/app'})).html)));
    }
    for (const resources of orders) javascript.orders.push(await outcome(() => loadOrder(resources)));
    assert.deepEqual(javascript, python);
    assert.deepEqual(javascript.descriptors[0], {css: ['/themes/base.css', 'theme.css', '/themes/base.css',
        '/area/invoices.css'], js: [{url: '/area/invoices.js', group: null}]});
    assert.deepEqual(javascript.links[0], ['theme.css', '/app/themes/base.css', '/app/area/invoices.css']);
    assert.deepEqual(javascript.descriptors[2], ['InvalidResourceName', 'requires need a GramlotServer with a resource system']);
}));

test('Python and JavaScript write the same bootstrap HTML, page ID and nonce aside (S07, decision 1)', async () => {
    const resources = {css: ['/themes/x.css', 'tema-é.css', '/x" onload="bad&y=1'],
        js: [{url: '/logic/business.js', group: 'business'}, {url: 'gnrcomponents/settingmanager.js',
            group: 'gnrcomponents/settingmanager'}, {url: '/index_aux.js', group: null}]};
    const python = JSON.parse(execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', `
import asyncio, json, sys
from gramlot import Page
from gramlot.server import GramlotServer
class TestPage(Page): pass
class MemoryServer(GramlotServer):
    def resolve_page(self, path): return TestPage
    def resolve_resources(self, path, cls): return json.loads(sys.argv[1])
opened = asyncio.run(MemoryServer().open_page("/", prefix="/app"))
print(json.dumps([opened.html, opened.page_id, opened.nonce]))
`, JSON.stringify(resources)], {encoding: 'utf8'}));
    const opened = await new MemoryServer(resources).openPage('/', {prefix: '/app'});
    const neutral = ([html, pageId, nonce]) => html.replace(pageId, '<page>').replaceAll(nonce, '<nonce>');
    assert.equal(neutral([opened.html, opened.pageId, opened.nonce]), neutral(python));
    assert.ok(opened.html.includes('"tema-é.css"'));
});
