/**
 * The API of GramlotServer and GramlotFileServer shared by every adapter (review plan p4, d-adapter-api): body
 * decoding, close message, index.html, companion and theme files, identity per call, name syntax, server adapter
 * and base theme; and the browser side: the ServerAdapter of the page and the transport contract. The Python
 * counterpart is tests/test_adapter_api.py, with the same inputs and outcomes.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, rm, symlink, writeFile} from 'node:fs/promises';
import {realpathSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder, HttpTransport, PageBootstrap, ServerAdapter} from '../src/index.js';
import {NAME_SYNTAX, NameSyntax, GramlotFileServer, GramlotServer, InvalidRequest, InvalidResourceName, Page,
    Exposed} from '../src/server/index.js';

const PAGE_MODULE = new URL('../src/server/page.js', import.meta.url).href;
const ADAPTER_MODULE = new URL('../src/server-adapter.js', import.meta.url).href;

const jsPage = ({css = [], theme = null} = {}) => `import {Page as Base} from ${JSON.stringify(PAGE_MODULE)};
export class Page extends Base {
    static css = ${JSON.stringify(css)};
    static css_theme = ${JSON.stringify(theme)};
    main(root) { root.div('ok'); }
    echo({value}) { return value; }
}
Page.registerEndpoint('echo');
`;

async function folder(run) {
    const root = await mkdtemp(join(tmpdir(), 'gramlot-adapter-'));
    try {
        await writeFile(join(root, 'package.json'), '{"type":"module"}');
        await run(root);
    } finally { await rm(root, {recursive: true, force: true}); }
}

async function write(root, relative, text = '') {
    const filename = join(root, ...relative.split('/'));
    await mkdir(dirname(filename), {recursive: true});
    await writeFile(filename, text);
    return filename;
}

/** The argument the server writes into `new PageBootstrap(…)`. */
const bootstrap = html => JSON.parse(html.match(/await new PageBootstrap\((.*)\)\.run\(\);<\/script>/s)[1]);

const call = async (server, pageId, contentType, name, params = {}, options = {}) =>
    fromTytx(await server.call(toTytx({id: 'r1', pageId, contentType, name, params}), options));

/** A GramlotServer of `PageClass` with no resources and the core name syntax. */
function memoryServer(PageClass) {
    return new (class extends GramlotServer {
        async resolvePage() { return PageClass; }
        async resolveResources() { return {css: [], js: []}; }
    })();
}

const bytes = text => new TextEncoder().encode(text);

test('decodeBody removes a leading byte order mark and refuses bytes that are not UTF-8', () => {
    const server = new GramlotServer();
    assert.equal(server.decodeBody(bytes('{"a":"è"}')), '{"a":"è"}');
    assert.equal(server.decodeBody(new Uint8Array([0xef, 0xbb, 0xbf, 0x7b, 0x7d])), '{}');
    // Only one leading mark is removed, as the decoder of the browser does.
    assert.equal(server.decodeBody(new Uint8Array([0xef, 0xbb, 0xbf, 0xef, 0xbb, 0xbf, 0x7b, 0x7d])), '﻿{}');
    for (const data of [[0xff], [0x7b, 0x22, 0x61, 0x22, 0x3a, 0x22, 0xff, 0x22, 0x7d], [0xef, 0xbb]]) {
        assert.throws(() => server.decodeBody(new Uint8Array(data)), error => error instanceof InvalidRequest
            && /not UTF-8/.test(error.message), String(data));
    }
});

test('close closes the owned page of the close message', () => folder(async root => {
    await write(root, 'index.js', jsPage());
    const server = new GramlotFileServer(root);
    const {pageId} = await server.openPage('/', {owner: 'one'});
    server.close(JSON.stringify({pageId}), {owner: 'two'});
    assert.equal((await call(server, pageId, 'data', 'echo', {value: 1}, {owner: 'one'})).value, 1);
    server.close(JSON.stringify({pageId: '0'.repeat(32)}), {owner: 'one'});
    server.close(JSON.stringify({pageId, other: 1}), {owner: 'one'});
    assert.equal((await call(server, pageId, 'data', 'echo', {value: 1}, {owner: 'one'})).error.code, 'page_expired');
}));

test('a close message that is not a page id object is invalid', () => {
    const server = new GramlotServer();
    for (const text of ['{', '[]', 'null', '{"pageId": 3}', '{}', '﻿{}']) {
        assert.throws(() => server.close(text), InvalidRequest, text);
    }
});

test('index.html opens the page of its folder', () => folder(async root => {
    await write(root, 'index.js', jsPage());
    await write(root, 'area/area.js', jsPage());
    const server = new GramlotFileServer(root);
    for (const path of ['/index.html', '/area/index.html']) {
        const {pageId} = await server.openPage(path);
        const main = (await call(server, pageId, 'source', 'main')).value;
        assert.equal(main.getNodes()[0].value, 'ok', path);
    }
    await assert.rejects(server.openPage('/area/index.htm'));
}));

test('companionFile is a .css or .js file below the pages folder', () => folder(async root => {
    await write(root, 'index.js', jsPage());
    for (const name of ['index.css', 'area/a.css', 'index.md', 'index.py']) await write(root, name);
    const outside = await mkdtemp(join(tmpdir(), 'gramlot-outside-'));
    try {
        await writeFile(join(outside, 'secret.css'), '');
        await symlink(join(outside, 'secret.css'), join(root, 'link.css'));
        const server = new GramlotFileServer(root);
        const real = realpathSync(root);
        assert.equal(await server.companionFile('/index.css'), join(real, 'index.css'));
        assert.equal(await server.companionFile('/area/a.css'), join(real, 'area/a.css'));
        assert.equal(await server.companionFile('/index.js'), join(real, 'index.js'));
        for (const path of ['/index.py', '/index.md', '/missing.css', '/../index.css', '/area/../../x.css', '/link.css',
            '/a\0.css', '/area']) {
            assert.equal(await server.companionFile(path), null, path);
        }
    } finally { await rm(outside, {recursive: true, force: true}); }
}));

class Home extends Page {
    main(root) { root.div('ok'); }
}

test('themeFile is a file of the core themes of every server', () => folder(async root => {
    assert.equal(GramlotFileServer.prototype.themeFile, GramlotServer.prototype.themeFile);
    for (const [name, server] of [['GramlotServer', new GramlotServer()], ['custom', memoryServer(Home)],
        ['GramlotFileServer', new GramlotFileServer(root)]]) {
        const theme = await server.themeFile('/themes/gramlot-base/theme.css');
        assert.deepEqual(theme.split('/').slice(-3), ['themes', 'gramlot-base', 'theme.css'], name);
        for (const path of ['/themes/missing.css', '/themes/../gramlot.js', '/themes/gramlot-base', '/theme/x.css',
            '/themes/a\0.css']) {
            assert.equal(await server.themeFile(path), null, `${name} ${path}`);
        }
    }
}));

// The neutral server runs in a Worker: a bundle for the browser holds no Node.js import, themeFile included.
test('the neutral GramlotServer bundles for the browser without Node.js imports', async () => {
    const entry = fileURLToPath(new URL('../src/server/gramlot-server.js', import.meta.url));
    const {outputFiles} = await build({entryPoints: [entry], bundle: true, platform: 'browser', format: 'esm',
        write: false, logLevel: 'silent'});
    assert.doesNotMatch(outputFiles[0].text, /realpath|from "node:/);
});

const links = async (server, path = '/') => bootstrap((await server.openPage(path)).html).resources.css;

test('the theme link of the bootstrap of a custom server is a file it serves', async () => {
    const server = memoryServer(Home);
    const css = await links(server);
    assert.deepEqual(css, ['/themes/gramlot-base/theme.css']);
    assert.ok(await server.themeFile(css[0]));
});

test('the base theme comes first and a listed base theme loads once', () => folder(async root => {
    await write(root, 'index.js', jsPage({css: ['/themes/gramlot-base/theme.css', '/local.css']}));
    await write(root, 'plain.js', jsPage({css: ['/local.css']}));
    const server = new GramlotFileServer(root);
    assert.deepEqual(await links(server), ['/themes/gramlot-base/theme.css', '/local.css']);
    assert.deepEqual(await links(server, '/plain'), ['/themes/gramlot-base/theme.css', '/local.css']);
}));

test('the page replaces the theme or loads none', () => folder(async root => {
    await write(root, 'mimi.js', jsPage({theme: 'mimi'}));
    await write(root, 'none.js', jsPage({css: ['/local.css'], theme: false}));
    const server = new GramlotFileServer(root);
    assert.deepEqual(await links(server, '/mimi'), ['/themes/mimi/theme.css']);
    assert.deepEqual(await links(server, '/none'), ['/local.css']);
    assert.deepEqual(await links(new GramlotFileServer(root, {cssTheme: 'joanna'}), '/none'), ['/local.css']);
}));

test('the server option chooses the base theme', () => folder(async root => {
    await write(root, 'index.js', jsPage());
    assert.deepEqual(await links(new GramlotFileServer(root, {cssTheme: 'gramlot-compact'})),
        ['/themes/gramlot-compact/theme.css']);
    assert.deepEqual(await links(new GramlotFileServer(root, {cssTheme: false})), []);
}));

test('a theme that is not a name is refused', () => folder(async root => {
    for (const cssTheme of [null, '', 'a/b', '../x', 'a.css', 3, true]) {
        assert.throws(() => new GramlotServer({cssTheme}), TypeError, String(cssTheme));
    }
    for (const [index, theme] of ['', 'a/b', 3, true].entries()) {
        await write(root, `bad${index}.js`, jsPage({theme}));
        await assert.rejects(new GramlotFileServer(root).openPage(`/bad${index}`),
            error => error instanceof InvalidResourceName && /css_theme/.test(error.message), String(theme));
    }
}));

test('the core syntax is dotted segments and its descriptor is portable', () => {
    assert.deepEqual(NAME_SYNTAX.toJSON(), {kind: 'regex',
        pattern: String.raw`[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)*`, flags: 0});
    assert.deepEqual(NameSyntax.fromJSON(NAME_SYNTAX.toJSON()).toJSON(), NAME_SYNTAX.toJSON());
    assert.equal(new GramlotServer().nameSyntax, NAME_SYNTAX);
    assert.deepEqual(['a', 'a.b', 'a/b', 'a\n', '', null, 3].map(name => NAME_SYNTAX.matches(name)),
        [true, true, false, false, false, false, false]);
    assert.ok(Object.isFrozen(NAME_SYNTAX));
});

test('a regex that Python and JavaScript read differently is refused', () => {
    for (const [pattern, flags] of [[String.raw`\w+`, 0], ['(?i)a', 0], ['a', 2], ['(?P<x>a)', 0]]) {
        assert.throws(() => new NameSyntax(pattern, flags), TypeError, pattern);
    }
    for (const descriptor of [{kind: 'range', pattern: 'a', flags: 0}, {pattern: 'a', flags: 0}, 'a']) {
        assert.throws(() => NameSyntax.fromJSON(descriptor), TypeError, JSON.stringify(descriptor));
    }
});

test('a server syntax reaches the bootstrap, the builder and the resolution', async () => {
    const refused = [];
    class Orders extends Exposed {
        total() { return 3; }
    }
    Orders.registerEndpoint('total');
    class Segments extends Page {
        get orders() { return new Orders(); }
        main(root) {
            root.div().remote('details');
            try { root.div().remote('orders.details'); } catch (error) { refused.push(error.message); }
        }
        details(root) { root.span('details'); }
        one() { return 1; }
    }
    Segments.registerSource('details');
    Segments.registerEndpoint('one');
    const server = new (class extends GramlotServer {
        get nameSyntax() { return new NameSyntax('[a-z]+'); }
        async resolvePage() { return Segments; }
        async resolveResources() { return {css: [], js: []}; }
    })();
    const {pageId, html} = await server.openPage('/');
    assert.deepEqual(bootstrap(html).config.nameSyntax, {kind: 'regex', pattern: '[a-z]+', flags: 0});
    // The builder of the page refuses a dotted name; the other element keeps its remote.
    assert.equal((await call(server, pageId, 'source', 'main')).value.getNodes().length, 2);
    assert.deepEqual(refused, ["div 'div_1': remote name must be a pointer or match [a-z]+, not \"orders.details\""]);
    assert.equal((await call(server, pageId, 'data', 'one')).value, 1);
    assert.equal((await call(server, pageId, 'data', 'orders.total')).error.code, 'not_found');
    const core = memoryServer(Segments);
    assert.equal((await call(core, (await core.openPage('/')).pageId, 'data', 'orders.total')).value, 3);
});

test('the server names the module of its adapter in the resources', async () => {
    class Empty extends Page { main() {} }
    const adapted = new (class extends GramlotServer {
        get serverAdapter() { return '/assets/adapter.js'; }
        async resolvePage() { return Empty; }
        async resolveResources() { return {css: [], js: []}; }
    })();
    assert.equal(new GramlotServer().serverAdapter, null);
    assert.ok(!('serverAdapter' in bootstrap((await memoryServer(Empty).openPage('/')).html).resources));
    assert.equal(bootstrap((await adapted.openPage('/', {prefix: '/app'})).html).resources.serverAdapter,
        '/app/assets/adapter.js');
});

// The browser side: the ServerAdapter of the page and the transport contract.

/** A transport that records its calls, `close` and `dispose`; `main` answers an empty Source. */
function recordingTransport(record) {
    return {
        async call(text) {
            const {id, contentType} = fromTytx(text);
            record.push('call');
            return toTytx({id, contentType, value: new GramlotBuilder().toTytx()});
        },
        close(pageId) { record.push(`close:${pageId}`); },
        dispose() { record.push('dispose'); },
    };
}

test('the default ServerAdapter creates the HttpTransport of the page', () => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({pageId: 'p', document: window.document, rpcUrl: '/r', closeUrl: '/c'});
    assert.ok(app.serverAdapter instanceof ServerAdapter);
    assert.ok(app.rpc.transport instanceof HttpTransport);
    assert.deepEqual([app.rpc.transport.rpcUrl, app.rpc.transport.closeUrl], ['/r', '/c']);
    assert.equal(typeof app.rpc.transport.dispose, 'function');
    const beacons = [];
    window.navigator.sendBeacon = url => { beacons.push(url); return true; };
    app.dispose();
    assert.deepEqual(beacons, ['/c']);
});

test('a ServerAdapter subclass gives the transport; dispose closes the page and releases it once', async () => {
    const record = [];
    const seen = [];
    class Recording extends ServerAdapter {
        createTransport(options) { seen.push([options.rpcUrl, options.closeUrl]); return recordingTransport(record); }
    }
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({pageId: 'p', document: window.document, closeUrl: '/c', serverAdapter: new Recording()});
    assert.deepEqual(seen, [['/gramlot/rpc', '/c']]);
    await app.start();
    app.dispose();
    app.dispose();
    assert.deepEqual(record, ['call', 'close:p', 'dispose']);
});

test('pagehide disposes a page through its transport', async () => {
    const record = [];
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({pageId: 'p', document: window.document, transport: recordingTransport(record)});
    await app.start();
    window.dispatchEvent(new window.Event('pagehide'));
    assert.equal(app.state, 'disposed');
    assert.deepEqual(record, ['call', 'close:p', 'dispose']);
    const alone = new Gramlot({pageId: 'q', document: window.document, transport: false});
    assert.equal(alone.pagehide, undefined);
    alone.dispose();
});

test('the nameSyntax of the bootstrap reaches the builder of the page and checks the requests', async () => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false,
        nameSyntax: {kind: 'regex', pattern: '[a-z]+', flags: 0}});
    assert.deepEqual(app.src.builder.nameSyntax.toJSON(), {kind: 'regex', pattern: '[a-z]+', flags: 0});
    assert.equal(new Gramlot({document: window.document, transport: false}).src.builder.nameSyntax, NAME_SYNTAX);
    app.src.startSource(new GramlotBuilder().toTytx());
    assert.throws(() => app.src.builder.root.div().remote('a.b'), /match \[a-z\]\+/);
    const target = app.src.source.getNode('main');
    await assert.rejects(target.requests.submit('a.b', {}, () => null), /Method name must match \[a-z\]\+, not "a.b"/);
    assert.throws(() => new Gramlot({document: window.document, transport: false, nameSyntax: {pattern: 'a'}}), TypeError);
});

test('PageBootstrap imports the ServerAdapter the server names and gives it to the page', () => folder(async root => {
    await write(root, 'adapter.js', `import {ServerAdapter} from ${JSON.stringify(ADAPTER_MODULE)};
export default class Named extends ServerAdapter {
    createTransport(options) {
        const transport = super.createTransport(options);
        transport.named = true;
        return transport;
    }
}
`);
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {url: pathToFileURL(`${root}/index`).href});
    const beacons = [];
    window.navigator.sendBeacon = url => { beacons.push(url); return true; };
    const original = globalThis.fetch;
    globalThis.fetch = async (url, options) => {
        const {id, contentType} = fromTytx(options.body);
        return {ok: true, status: 200, text: async () => toTytx({id, contentType, value: new GramlotBuilder().toTytx()})};
    };
    try {
        const config = {pageId: 'p', rpcUrl: '/gramlot/rpc', closeUrl: '/gramlot/close', rootId: 'gramlot-root',
            capabilities: []};
        const app = await new PageBootstrap({config, resources: {css: [], js: [], serverAdapter: `${root}/adapter.js`},
            document: window.document}).run();
        assert.equal(app.serverAdapter.constructor.name, 'Named');
        assert.equal(app.rpc.transport.named, true);
        app.dispose();
        await assert.rejects(new PageBootstrap({config, resources: {css: [], js: [], serverAdapter: `${root}/missing.js`},
            document: window.document}).run(), /missing\.js: server adapter import failed/);
    } finally { globalThis.fetch = original; }
    // The page that never got its instance closes through the transport of its adapter.
    const bootstrapped = new PageBootstrap({config: {pageId: 'q', rpcUrl: '/r', closeUrl: '/c'}, resources: {css: [], js: []},
        document: window.document});
    bootstrapped.closePage();
    assert.deepEqual(beacons, ['/gramlot/close', '/c']);
}));

// The synchronous call (owner 2026-10-19, review p4): `gramlot.rpc.callSync`, sent only by a transport whose
// `supportsCallSync` is true; HTTP sends it with a synchronous XMLHttpRequest.

/** An XMLHttpRequest class that records each request and answers `answer(body)` with `status`. */
function fakeXMLHttpRequest(record, answer, status = 200) {
    return class {
        open(method, url, asynchronous) { record.push({method, url, asynchronous}); }
        setRequestHeader(name, value) { record.at(-1).headers = {...record.at(-1).headers, [name]: value}; }
        send(body) {
            record.at(-1).body = body;
            this.status = status;
            this.responseText = answer(body);
        }
    };
}

/** The response envelope of `body` with `value`. */
const answerWith = value => body => {
    const {id, contentType} = fromTytx(body);
    return toTytx({id, contentType, value});
};

test('HttpTransport.callSync posts the envelope with a synchronous XMLHttpRequest; a non-200 status throws', () => {
    const record = [];
    const transport = new HttpTransport('/r', {XMLHttpRequest: fakeXMLHttpRequest(record, () => 'answer')});
    assert.equal(transport.supportsCallSync, true);
    assert.equal(transport.callSync('text'), 'answer');
    assert.deepEqual(record, [{method: 'POST', url: '/r', asynchronous: false,
        headers: {'Content-Type': 'application/json'}, body: 'text'}]);
    const failing = new HttpTransport('/r', {XMLHttpRequest: fakeXMLHttpRequest([], () => '', 500)});
    assert.throws(() => failing.callSync('text'), /rpc failed: HTTP 500/);
});

test('gramlot.rpc.callSync answers the value through the XMLHttpRequest of the window', () => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const record = [];
    window.XMLHttpRequest = fakeXMLHttpRequest(record, answerWith(3));
    const app = new Gramlot({pageId: 'p', document: window.document, rpcUrl: '/r'});
    assert.equal(app.rpc.supportsCallSync, true);
    assert.equal(app.rpc.callSync('data', 'total', {price: 1}), 3);
    const sent = fromTytx(record[0].body);
    assert.deepEqual([sent.pageId, sent.contentType, sent.name, sent.params], ['p', 'data', 'total', {price: 1}]);
    window.XMLHttpRequest = fakeXMLHttpRequest(record, body => toTytx({id: fromTytx(body).id, contentType: 'data',
        error: {code: 'not_found', name: 'EndpointNotFound', message: 'Unknown endpoint: x'}}));
    const other = new Gramlot({pageId: 'p', document: window.document, rpcUrl: '/r'});
    assert.throws(() => other.rpc.callSync('data', 'x'), error => error.name === 'RpcError' && error.code === 'not_found');
    window.navigator.sendBeacon = () => true;
    other.dispose();
    assert.throws(() => other.rpc.callSync('data', 'x'), error => error.name === 'AbortError');
    app.dispose();
});

test('a transport without supportsCallSync has no synchronous call', () => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({pageId: 'p', document: window.document, transport: recordingTransport([])});
    assert.equal(app.rpc.supportsCallSync, false);
    assert.throws(() => app.rpc.callSync('data', 'total'), /the transport of this page has no synchronous call/);
    const alone = new Gramlot({pageId: 'q', document: window.document, transport: false});
    assert.equal(alone.rpc.supportsCallSync, false);
    assert.throws(() => alone.rpc.callSync('data', 'total'), /no synchronous call/);
    app.dispose();
});
