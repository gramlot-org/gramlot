// Phase S07: the browser bootstrap of a page (source plan §4.12; decisions D8, D9, C02, Q12.2)
// with real imports of logic files in jsdom. The §4.9 rules themselves are in named-logic.test.js.
//
// Root-relative URLs under a `file:` document resolve from the file system root, so the tests
// that go through a host use the fixture folder's absolute path as the mount prefix: the host
// adds it once to every `/…` URL (Q12.1) and the modules are imported from the fixture folder.
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {SourceBag} from '@jsr/genro__builders';
import {GramlotBuilder, PageBootstrap} from '../src/index.js';
import {FileHost, parseRequires} from '../src/adapters/index.js';

const LOGIC = fileURLToPath(new URL('./fixtures/logic/', import.meta.url)).replace(/\/$/, '');
const PAGE_MODULE = new URL('../src/adapters/page.js', import.meta.url).href;
const CONFIG = {pageId: 'page', mainUrl: '/gramlot/main', sourceUrl: '/gramlot/source', closeUrl: '/gramlot/close',
    rootId: 'gramlot-root'};
const EMPTY_PAGE = '<!doctype html><html><head></head><body><div id="gramlot-root"></div></body></html>';

async function folder(run) {
    const root = await mkdtemp(join(tmpdir(), 'gramlot-bootstrap-'));
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

/** A logic module; `delay` ms of top-level await make its import finish later. */
const logic = (body, delay = 0) => (delay ? `await new Promise(done => setTimeout(done, ${delay}));\n` : '') +
    `export class Logic {\n${body}\n}\n`;

/** A jsdom window on `html` at `url`, recording its beacons. */
function browser(html, url) {
    const {window} = new JSDOM(html, {url});
    const beacons = [];
    window.navigator.sendBeacon = (target, body) => { beacons.push({url: target, body}); return true; };
    return {window, beacons};
}

/** The argument the host writes into `new PageBootstrap(…)`. */
function bootstrapArguments(html) {
    const match = html.match(/import \{PageBootstrap\} from "[^"]*";await new PageBootstrap\((.*)\)\.run\(\);<\/script>/s);
    assert.ok(match, 'the bootstrap script calls PageBootstrap');
    return JSON.parse(match[1]);
}

/** Replace the global fetch the Gramlot transport binds at construction; `main` answers `wire`. */
async function withFetch(wire, run, onMain = () => {}) {
    const original = globalThis.fetch;
    const requests = [];
    globalThis.fetch = async (url, options) => {
        requests.push(url);
        onMain(url);
        return {ok: true, status: 200, text: async () => wire};
    };
    try { return await run(requests); } finally { globalThis.fetch = original; }
}

const emptyWire = () => new GramlotBuilder().toTytx();
const links = document => [...document.querySelectorAll('link[rel="stylesheet"]')].map(link => link.getAttribute('href'));

/** Every Source node of `bag`, depth first. */
function sourceNodes(bag) {
    return bag.getNodes().flatMap(node => [node, ...(node.value instanceof SourceBag ? sourceNodes(node.value) : [])]);
}

const jsPage = css => `import {Page as Base} from ${JSON.stringify(PAGE_MODULE)};
export class Page extends Base {
    static css = ${JSON.stringify(css)};
    main(root) { root.div('ok', {id: 'ok'}); }
}
`;

test('D9: PageBootstrap writes each CSS link once, in received order; the host HTML has none', () => folder(async root => {
    await write(root, 'index.js', jsPage(['/index.css', '/themes/a.css', '/themes/b.css', '/themes/a.css', 'theme.css']));
    await write(root, 'index.css');
    await write(root, 'index_aux.js', logic('ciao() { return this.page; }'));
    const host = new FileHost(root);
    const opened = await host.openPage('/', {prefix: root});
    assert.ok(!opened.html.includes('<link'));
    const {window} = browser(opened.html, pathToFileURL(`${root}/`).href);
    const app = await withFetch(await host.main(opened.pageId), () =>
        new PageBootstrap({...bootstrapArguments(opened.html), document: window.document}).run());
    assert.deepEqual(links(window.document), [`${root}/themes/b.css`, `${root}/themes/a.css`, 'theme.css', `${root}/index.css`]);
    assert.equal(window.document.head.querySelectorAll('link').length, 4);
    assert.equal(app.state, 'started');
    assert.equal(window.gramlot, app);
    assert.equal(window.document.getElementById('ok').textContent, 'ok');
    assert.equal(app.logic.ciao(), app);
    app.dispose();
}));

test('D8: JS URLs are resolved against the document, not against the runtime module', () => folder(async root => {
    await write(root, 'pages/logic/relative.js', logic('relative() { return "relative"; }'));
    await write(root, 'pages/dot.js', logic('dot() { return "dot"; }'));
    await write(root, 'rooted.js', logic('rooted() { return "rooted"; }'));
    await write(root, 'absolute.js', logic('absolute() { return "absolute"; }'));
    const {window} = browser(EMPTY_PAGE, pathToFileURL(`${root}/pages/calcolo`).href);
    const resources = {css: [], js: [
        {url: 'logic/relative.js', group: 'relative'}, {url: './dot.js', group: 'dot'},
        {url: `${root}/rooted.js`, group: 'rooted'}, {url: pathToFileURL(`${root}/absolute.js`).href, group: 'absolute'}]};
    const app = await withFetch(emptyWire(), () =>
        new PageBootstrap({config: CONFIG, resources, document: window.document}).run());
    assert.deepEqual(['relative', 'dot', 'rooted', 'absolute'].map(name => app.logic[name][name]()),
        ['relative', 'dot', 'rooted', 'absolute']);
    app.dispose();
}));

test('Q12.2: a Logic that breaks §4.9 fails check 2bis: no Gramlot, no mount, CSS kept, page closed', () => folder(async root => {
    await write(root, 'ok.js', logic('ok() {}'));
    await write(root, 'constructor.js', logic('constructor() { this.x = 1; }'));
    await write(root, 'page.js', logic('page() {}'));
    await write(root, 'group.js', logic('gui() {}'));
    await write(root, 'gui.js', logic('scroll() {}'));
    await write(root, 'nologic.js', 'export const value = 1;\n');
    await write(root, 'broken.js', 'export class Logic { oops( }\n');
    const cases = [
        [[{url: 'ok.js', group: null}, {url: 'constructor.js', group: 'calcoli'}], /constructor\.js: class Logic cannot declare a constructor/],
        [[{url: 'page.js', group: null}], /page\.js: a logic method cannot be named 'page'/],
        [[{url: 'group.js', group: null}, {url: 'gui.js', group: 'gui'}], /group\.js: the logic method 'gui' has the name of a child group/],
        [[{url: 'ok.js', group: 'page'}], /ok\.js: a logic group cannot be named 'page'/],
        [[{url: 'nologic.js', group: null}], /nologic\.js: the module exports no class Logic/],
        [[{url: 'ok.js', group: null}, {url: 'missing.js', group: 'gui'}], /Error: missing\.js: import failed/],
        [[{url: 'broken.js', group: null}], /Error: broken\.js: import failed/],
    ];
    for (const [js, message] of cases) {
        const {window, beacons} = browser(EMPTY_PAGE, pathToFileURL(`${root}/index`).href);
        await withFetch(emptyWire(), async requests => {
            await assert.rejects(new PageBootstrap({config: CONFIG, resources: {css: ['/a.css'], js},
                document: window.document}).run(), message);
            assert.deepEqual(requests, [], 'no main request');
        });
        assert.equal(window.gramlot, undefined, String(message));
        assert.equal(window.document.getElementById('gramlot-root').childNodes.length, 0);
        assert.deepEqual(links(window.document), ['/a.css']);
        assert.equal(beacons.length, 1);
        assert.equal(beacons[0].url, '/gramlot/close');
        assert.equal(await beacons[0].body.text(), '{"pageId":"page"}');
        window.dispatchEvent(new window.Event('pagehide'));
        assert.equal(beacons.length, 1, 'the bootstrap listener is removed');
    }
}));

test('the last received URL wins in the same group, whatever order the imports finish in', () => folder(async root => {
    await write(root, 'first.js', logic('calc() { return "first"; } keep() { return "kept"; }', 40));
    await write(root, 'second.js', logic('calc() { return "second"; }'));
    await write(root, 'common.js', logic('saluta() { return "common"; } base() { return "base"; }', 40));
    await write(root, 'index_aux.js', logic('saluta() { return "companion"; }'));
    const {window} = browser(EMPTY_PAGE, pathToFileURL(`${root}/index`).href);
    const resources = {css: [], js: [{url: 'first.js', group: 'calcoli'}, {url: 'second.js', group: 'calcoli'},
        {url: 'common.js', group: null}, {url: 'index_aux.js', group: null}]};
    const app = await withFetch(emptyWire(), () => new PageBootstrap({config: CONFIG, resources, document: window.document}).run());
    assert.equal(app.logic.calcoli.calc(), 'second');
    assert.equal(app.logic.calcoli.keep(), 'kept');
    // The companion (group null, loaded last) wins over a root-group file loaded before it.
    assert.equal(app.logic.saluta(), 'companion');
    assert.equal(app.logic.base(), 'base');
    app.dispose();
}));

test('the companion is registered before start(), and two pages are isolated', () => folder(async root => {
    await write(root, 'index_aux.js', logic('chi() { return this.page; } conta() { this.count = (this.count ?? 0) + 1; return this.count; }'));
    const resources = {css: [], js: [{url: 'index_aux.js', group: null}]};
    const seen = [];
    const run = async () => {
        const {window} = browser(EMPTY_PAGE, pathToFileURL(`${root}/index`).href);
        return withFetch(emptyWire(), () => new PageBootstrap({config: CONFIG, resources, document: window.document}).run(),
            () => seen.push({state: window.gramlot.state, companion: typeof window.gramlot.logic.chi}));
    };
    const one = await run();
    const two = await run();
    assert.deepEqual(seen, [{state: 'loading', companion: 'function'}, {state: 'loading', companion: 'function'}]);
    assert.notEqual(one.logic, two.logic);
    assert.equal(one.logic.chi(), one);
    assert.equal(two.logic.chi(), two);
    assert.equal(one.logic.conta(), 1);
    assert.equal(one.logic.conta(), 2);
    assert.equal(two.logic.conta(), 1);
    one.dispose();
    two.dispose();
}));

test('a page closed during the imports mounts nothing and sends the close beacon', () => folder(async root => {
    await write(root, 'slow.js', logic('lento() {}', 40));
    const {window, beacons} = browser(EMPTY_PAGE, pathToFileURL(`${root}/index`).href);
    await withFetch(emptyWire(), async requests => {
        const running = new PageBootstrap({config: CONFIG, resources: {css: [], js: [{url: 'slow.js', group: null}]},
            document: window.document}).run();
        const retained = new window.Event('pagehide');
        Object.defineProperty(retained, 'persisted', {value: true});
        window.dispatchEvent(retained);
        assert.equal(beacons.length, 0, 'a page kept in the back-forward cache is not closed');
        window.dispatchEvent(new window.Event('pagehide'));
        assert.equal(beacons.length, 1);
        assert.equal(await running, null);
        assert.deepEqual(requests, []);
    });
    assert.equal(window.gramlot, undefined);
    assert.equal(window.document.getElementById('gramlot-root').childNodes.length, 0);
    assert.equal(beacons.length, 1);
    assert.equal(beacons[0].url, '/gramlot/close');
}));

/** The Python host of the fixture: FileHost pages, js_requires served as `/<name>.js` (FileHost refuses requires, Q10). */
const PYTHON_HOST = `
import asyncio, json, sys
from gramlot.server import FileHost, parse_requires
class LogicHost(FileHost):
    def resolve_resources(self, path, cls):
        return {"css": [], "js": [*({"url": f"/{name}.js", "group": name} for name in parse_requires(cls.js_requires)),
                                  {"url": "/calcolo_aux.js", "group": None}]}
async def run():
    host = LogicHost(sys.argv[1])
    opened = await host.open_page("/calcolo", prefix=sys.argv[1])
    return {"html": opened.html, "wire": await host.main(opened.page_id)}
print(json.dumps(asyncio.run(run())))
`;

/** The JavaScript twin of PYTHON_HOST. */
class LogicHost extends FileHost {
    async resolveResources(path, PageClass) {
        return {css: [], js: [...parseRequires(PageClass.js_requires).map(name => ({url: `/${name}.js`, group: name})),
            {url: '/calcolo_aux.js', group: null}]};
    }
}

/** Mount the fixture page through the real bootstrap and resolve every `func` of its Source. */
async function resolveEveryFunc({html, wire}) {
    const {window} = browser(html, pathToFileURL(`${LOGIC}/calcolo`).href);
    const app = await withFetch(wire, () => new PageBootstrap({...bootstrapArguments(html), document: window.document}).run());
    assert.equal(app.state, 'started');
    const nodes = sourceNodes(app.source).filter(node => node.attr.func);
    assert.deepEqual(nodes.map(node => node.attr.func),
        ['business.calcolaSconto', 'gui.scroll', 'somma', 'gnrcomponents.settingmanager.load']);
    const resolved = nodes.map(node => app.logicRegistry.resolve(node.attr.func, node));
    assert.deepEqual(resolved.map(({group}) => group),
        [app.logic.business, app.logic.gui, app.logic, app.logic.gnrcomponents.settingmanager]);
    const [sconto, scroll, somma, load] = resolved;
    assert.equal(sconto.method.call(sconto.group, {prezzo: 10}), 9);
    const scrolled = scroll.method.call(scroll.group, nodes[1], {x: 1});
    assert.equal(scrolled.group, app.logic.gui);
    assert.equal(scrolled.page, app);
    assert.equal(somma.method.call(somma.group, {a: 1, b: 2}), 3);
    assert.equal(load.method.call(load.group, nodes[3], {prezzo: 20}), 18);
    assert.equal(app.logic.azzera(nodes[1], {}).group, app.logic.gui);
    app.dispose();
}

test('a Source written in Python: every func resolves through the real bootstrap', async () => {
    const opened = JSON.parse(execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', PYTHON_HOST, LOGIC],
        {encoding: 'utf8'}));
    assert.deepEqual(bootstrapArguments(opened.html).resources.js.map(({url, group}) => [url, group]), [
        [`${LOGIC}/business.js`, 'business'], [`${LOGIC}/gui.js`, 'gui'],
        [`${LOGIC}/gnrcomponents/settingmanager.js`, 'gnrcomponents/settingmanager'], [`${LOGIC}/calcolo_aux.js`, null]]);
    await resolveEveryFunc(opened);
});

test('the same page written in JavaScript, with groups from js_requires given by a test host', async () => {
    const host = new LogicHost(LOGIC);
    const opened = await host.openPage('/calcolo', {prefix: LOGIC});
    await resolveEveryFunc({html: opened.html, wire: await host.main(opened.pageId)});
});

/** Relative module imports reachable from `entry`, inside js/src. */
async function sourceGraph(entry, seen = new Set()) {
    if (seen.has(entry)) return seen;
    seen.add(entry);
    const text = await readFile(entry, 'utf8');
    for (const [, specifier] of text.matchAll(/(?:import|export)\s[^'"]*?from\s+['"](\.[^'"]+)['"]/g)) {
        await sourceGraph(resolve(dirname(entry), specifier), seen);
    }
    return seen;
}

const EVALUATION = [/\beval\s*\(/, /(?<![\w$.])Function\s*\(/, /\bset(?:Timeout|Interval)\s*\(\s*['"`]/];

test('CSP without unsafe-eval: the bootstrap and logic graph and the runtime bundle evaluate no strings, inline.js excepted', async () => {
    const source = fileURLToPath(new URL('../src/', import.meta.url));
    const inline = join(source, 'binding', 'inline.js');
    const graph = await sourceGraph(join(source, 'bootstrap.js'));
    assert.ok(graph.has(join(source, 'binding', 'logic.js')));
    assert.ok(graph.has(join(source, 'gramlot.js')));
    assert.ok(graph.has(inline));
    for (const filename of graph) {
        if (filename === inline) continue;
        const text = await readFile(filename, 'utf8');
        for (const pattern of EVALUATION) assert.doesNotMatch(text, pattern, `${filename}: ${pattern}`);
    }
    // The bundle as js/scripts/build-runtime.mjs builds it, dependencies included; esbuild opens the
    // code of each module with a `// <path>` line, so the section of inline.js is left out.
    const bundle = await build({entryPoints: [join(source, 'index.js')], bundle: true, platform: 'browser', target: 'es2022',
        format: 'esm', write: false, legalComments: 'inline', logLevel: 'silent'});
    const sections = bundle.outputFiles[0].text.split(/^(?=\/\/ \S+\.m?js$)/m);
    assert.equal(sections.filter(section => section.startsWith('// src/binding/inline.js\n')).length, 1);
    const text = sections.filter(section => !section.startsWith('// src/binding/inline.js\n')).join('');
    assert.match(text, /PageBootstrap/);
    for (const pattern of EVALUATION) assert.doesNotMatch(text, pattern, `bundle: ${pattern}`);
});

test('CSP without unsafe-eval: a page with named logic only never calls the inline compiler', async () => {
    const opened = JSON.parse(execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', PYTHON_HOST, LOGIC],
        {encoding: 'utf8'}));
    const original = globalThis.Function;
    let calls = 0;
    globalThis.Function = new Proxy(original, {
        construct(target, args) { calls += 1; return Reflect.construct(target, args); },
        apply(target, self, args) { calls += 1; return Reflect.apply(target, self, args); },
    });
    try {
        const {window} = browser(opened.html, pathToFileURL(`${LOGIC}/calcolo`).href);
        const app = await withFetch(opened.wire, () => new PageBootstrap({...bootstrapArguments(opened.html), document: window.document}).run());
        app.data.setItem('ordine.prezzo', 10);
        app.data.setItem('ordine.a', 1);
        app.data.setItem('ordine.b', 2);
        assert.equal(app.data.getItem('ordine.sconto'), 9);
        assert.equal(app.data.getItem('ordine.totale'), 3);
        assert.equal(calls, 0);
        // The probe sees the compiler: one inline formula is one call.
        app.builder.root.dataFormula({result_path: 'inline', formula: 'a * 2', a: '^ordine.a'});
        app.data.setItem('ordine.a', 4);
        assert.equal(app.data.getItem('inline'), 8);
        assert.equal(calls, 1);
        app.dispose();
    } finally {
        globalThis.Function = original;
    }
});
