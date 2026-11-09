/** Third-party libraries load on first use, from jsDelivr or from the local copy (GC-325 §160). */
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {generate} from '../../tools/gramlot-builder/src/generate.js';
import {libraries, loadLibrary} from '../src/libraries.js';
import {GramlotServer} from '../src/server/index.js';

const js = fileURLToPath(new URL('../', import.meta.url));
const repository = resolve(js, '..');
const require = createRequire(join(js, 'package.json'));
const packageOf = specifier => specifier.split('/').slice(0, specifier.startsWith('@') ? 2 : 1).join('/');

/** A string of each library, present in its local copy and absent from Gramlot code. */
const markers = {echarts: 'registerPreprocessor', echartsGl: 'Geo3D', uplot: 'pxRatio', plotly: 'newPlot',
    vega: 'Dataflow', writeExcelFile: 'xl/worksheets', jodit: 'jodit-wysiwyg', codemirror: 'EditorView',
    prosemirror: 'NodeSelection', typst: 'WebAssembly', xterm: 'registerCsiHandler', xtermFit: 'proposeDimensions'};

test('the manifest names the installed versions, the same file on jsDelivr and its SRI hash', async () => {
    for (const [name, library] of Object.entries(libraries)) {
        for (const [pkg, version] of Object.entries(library.packages)) {
            const manifest = JSON.parse(await readFile(join(js, 'node_modules', pkg, 'package.json'), 'utf8'));
            assert.equal(manifest.version, version, `${name}: ${pkg}`);
        }
        assert.ok(['module', 'style', 'script'].includes(library.format), name);
        assert.equal(library.format === 'script', typeof library.global === 'string', name);
        if (library.local.startsWith('./')) {
            assert.equal(library.url, null, `${name}: an engine module has no CDN copy`);
            await readFile(join(js, 'src', library.local));
            continue;
        }
        if (library.url === null) { assert.equal(library.integrity, null, name); continue; }
        const pkg = packageOf(library.local);
        const file = library.local.slice(pkg.length + 1);
        assert.equal(library.url, `https://cdn.jsdelivr.net/npm/${pkg}@${library.packages[pkg]}/${file}`, name);
        const bytes = await readFile(join(js, 'node_modules', library.local));
        assert.equal(library.integrity, 'sha384-' + createHash('sha384').update(bytes).digest('base64'), name);
    }
});

test('every library has one loading site whose local import is the local copy of the manifest', async () => {
    const sources = (await readdir(join(js, 'src'), {recursive: true})).filter(file => file.endsWith('.js'));
    const sites = new Map();
    for (const file of sources) {
        const text = await readFile(join(js, 'src', file), 'utf8');
        for (const match of text.matchAll(/loadLibrary\(\s*'(\w+)'\s*,[^,]+,\s*\(\)\s*=>\s*import\('([^']+)'\)/g)) {
            const [, name, specifier] = match;
            const local = specifier.startsWith('.') ? './' + join(dirname(file), specifier).split('\\').join('/') : specifier;
            assert.ok(Object.hasOwn(libraries, name), `${file}: unknown library ${name}`);
            assert.equal(local, libraries[name].local, `${file}: ${name}`);
            sites.set(name, (sites.get(name) ?? 0) + 1);
        }
    }
    for (const name of Object.keys(libraries)) assert.ok(sites.has(name), `${name} has no loading site`);
});

test('loadLibrary takes the local copy without the cdn marker and the CDN with it', async () => {
    const local = new JSDOM('').window.document;
    const echarts = await loadLibrary('echarts', local, () => import('echarts/dist/echarts.esm.min.mjs'));
    assert.equal(typeof echarts.init, 'function');
    const chart = echarts.init(null, null, {renderer: 'svg', ssr: true, width: 200, height: 100});
    chart.setOption({xAxis: {data: ['a', 'b']}, yAxis: {}, series: [{type: 'bar', data: [1, 2]}]});
    assert.match(chart.renderToSVGString(), /<svg/);
    chart.dispose();
    const cdn = new JSDOM('<html data-gramlot-library-source="cdn"></html>').window.document;
    const requests = [];
    cdn.defaultView.fetch = async (url, options) => { requests.push([url, options]); return new Response('.u-legend{}'); };
    assert.equal(await loadLibrary('uplotStyle', cdn, () => assert.fail('local copy')), '.u-legend{}');
    assert.deepEqual(requests, [[libraries.uplotStyle.url, {integrity: libraries.uplotStyle.integrity}]]);
    // A library without a CDN copy always takes the local copy.
    let imported = false;
    await loadLibrary('plotly', cdn, async () => { imported = true; return {}; });
    assert.ok(imported);
    cdn.defaultView['echarts-gl'] = 'registered';
    assert.equal(await loadLibrary('echartsGl', cdn, async () => ({})), 'registered');
    await assert.rejects(loadLibrary('nothing', cdn, async () => ({})), /Unknown third-party library: nothing/);
});

test('the bootstrap carries the library source, the import map the integrity of the CDN modules', async () => {
    class Hello extends (await import('../src/server/page.js')).Page { main(root) { root.div('hi'); } }
    class Server extends GramlotServer {
        async resolvePage() { return Hello; }
        async resolveResources() { return {css: [], js: []}; }
    }
    const cdn = await new Server().openPage('/');
    assert.match(cdn.html, /<html data-gramlot-library-source="cdn">/);
    const map = JSON.parse(/<script type="importmap"[^>]*>(.*?)<\/script>/.exec(cdn.html)[1]);
    assert.deepEqual(map.integrity, {[libraries.echarts.url]: libraries.echarts.integrity,
        [libraries.uplot.url]: libraries.uplot.integrity, [libraries.xterm.url]: libraries.xterm.integrity,
        [libraries.xtermFit.url]: libraries.xtermFit.integrity});
    const local = await new Server({librarySource: 'local'}).openPage('/');
    assert.match(local.html, /<html data-gramlot-library-source="local">/);
    assert.ok(!local.html.includes('integrity') && !local.html.includes('jsdelivr'));
    assert.throws(() => new Server({librarySource: 'unpkg'}), /library source must be 'cdn' or 'local'/);
});

test('contentSecurityPolicy adds the CDN origin to the directives of scripts and connections', () => {
    const server = new GramlotServer();
    const origin = 'https://cdn.jsdelivr.net';
    assert.deepEqual(server.libraryOrigins, [origin]);
    assert.equal(server.contentSecurityPolicy("script-src 'nonce-{nonce}'; object-src 'none'; base-uri 'none'", 'n1'),
        `script-src 'nonce-n1' ${origin}; object-src 'none'; base-uri 'none'`);
    assert.equal(server.contentSecurityPolicy("default-src 'self'; script-src 'nonce-{nonce}'", 'n1'),
        `default-src 'self' ${origin}; script-src 'nonce-n1' ${origin}`);
    assert.equal(server.contentSecurityPolicy(`script-src 'nonce-{nonce}' ${origin}; connect-src 'self'`, 'n1'),
        `script-src 'nonce-n1' ${origin}; connect-src 'self' ${origin}`);
    const local = new GramlotServer({librarySource: 'local'});
    assert.deepEqual(local.libraryOrigins, []);
    assert.equal(local.contentSecurityPolicy("script-src 'nonce-{nonce}'", 'n1'), "script-src 'nonce-n1'");
});

test('shipped standard collections hold no third-party library in their start-up graph', async () => {
    const names = JSON.parse(await readFile(join(repository, 'src/gramlot/collections/standard.json'), 'utf8'));
    const deferred = new Set();
    for (const name of names) {
        const assets = join(repository, 'src/gramlot/collections', name, 'assets');
        const start = new Set();
        const visit = async file => {
            if (start.has(file)) return;
            start.add(file);
            const text = await readFile(file, 'utf8');
            for (const match of text.matchAll(/(?:\bfrom|\bimport)\s*["'](\.[^"']+)["']/g)) await visit(resolve(dirname(file), match[1]));
        };
        await visit(join(assets, 'index.js'));
        for (const file of start) {
            const text = await readFile(file, 'utf8');
            assert.doesNotMatch(text, /\bimport\(\s*["']https?:/, `${name}: CDN URL in ${file}`);
            for (const [library, marker] of Object.entries(markers)) assert.ok(!text.includes(marker), `${name}: ${library} at start`);
        }
        for (const file of await readdir(join(assets, 'modules')).catch(() => [])) {
            if (!start.has(join(assets, 'modules', file))) deferred.add(await readFile(join(assets, 'modules', file), 'utf8'));
        }
    }
    // The local copy of every library ships as a deferred module: the serverless and file exports need no network.
    for (const [library, marker] of Object.entries(markers)) assert.ok([...deferred].some(text => text.includes(marker)), library);
});

test('a file-origin bundle of the charts collection resolves every library locally', async () => {
    const assets = join(repository, 'src/gramlot/collections/charts/assets');
    const result = await build({entryPoints: [join(assets, 'index.js')], bundle: true, write: false, format: 'esm',
        platform: 'browser', target: 'es2022', logLevel: 'silent', metafile: true,
        external: ['@gramlot/gramlot', '@gramlot/gramlot/*', '@gramlot/collections/*']});
    const text = result.outputFiles[0].text;
    for (const library of ['echarts', 'echartsGl', 'uplot', 'plotly', 'vega']) assert.ok(text.includes(markers[library]), library);
    assert.doesNotMatch(text, /\bimport\(\s*["']https?:/);
});

test('the generator refuses a collection that imports a third-party package at start', async t => {
    const root = await mkdtemp(join(tmpdir(), 'gramlot-libraries-'));
    t.after(() => rm(root, {recursive: true, force: true}));
    await writeFile(join(root, 'package.json'), '{"type":"module"}');
    await mkdir(join(root, 'node_modules/@gramlot'), {recursive: true});
    await symlink(js, join(root, 'node_modules/@gramlot/gramlot'), 'dir');
    for (const library of ['@genrojs', 'uplot']) await symlink(join(js, 'node_modules', library), join(root, 'node_modules', library), 'dir');
    await mkdir(join(root, 'ui'));
    await writeFile(join(root, 'ui/index.js'), `import {defineCollection} from '@gramlot/gramlot/components';
import uPlot from 'uplot/dist/uPlot.esm.js';
export const engine = uPlot;
export default defineCollection({name:'staticprobe',components:[]});
`);
    await mkdir(join(root, 'staging'));
    const request = {protocolVersion: 1, operation: 'build', configPath: join(root, 'gramlot.build.json'),
        projectRoot: root, stagingDirectory: join(root, 'staging'), externals: [],
        config: {output: './src', collections: [{entry: './ui/index.js', pythonPackage: 'sample.widgets'}]}};
    await assert.rejects(generate(request), /Collection staticprobe loads third-party packages at start: uplot/);
});
