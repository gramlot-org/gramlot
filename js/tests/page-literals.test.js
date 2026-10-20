// Review p4e: a page module authors typed literals (Decimal, date, time, Bag) while `main` builds its Source, in
// both contexts of the name `@gramlot/gramlot/page`: on the server it is src/server/page.js, in the browser the
// import map of the bootstrap HTML points it at the runtime (dist/gramlot.js), the only module a page module
// can import there. The two entry points export the same page surface, and one page module builds the same Source
// in both. The browser context needs the built runtime (npm run build).
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import * as server from '../src/server/page.js';
import * as runtime from '../src/index.js';

const FIXTURES = new URL('./fixtures/page-literals/', import.meta.url);
const RUNTIME = new URL('../dist/gramlot.js', import.meta.url).href;

// What a page module imports from `@gramlot/gramlot/page`, in both contexts (GC-090 §024).
const PAGE_SURFACE = ['Page', 'Exposed', 'IndexPage', 'IndexLogic', 'mountIndexPage', 'ServerAdapter',
    'Bag', 'BagNode', 'createDecimal'];

/** The value text of each `dataSetter` of a Source in TYTX text, by destination path. */
function literals(text) {
    return Object.fromEntries(JSON.parse(text.replace(/::JS::X$/, '')).rows
        .map(([, , , , attr]) => [attr.destination_path, attr.value]));
}

/** The Source that `main` of the fixture page builds with the builder of `Page`, as TYTX text. */
function sourceOf(Page) {
    const builder = new Page.sourceBuilder('main');
    new Page().main(builder.root);
    return builder.toTytx();
}

test('the page entry of the server and the runtime export the same page surface', () => {
    for (const name of PAGE_SURFACE) {
        assert.equal(typeof server[name], 'function', `server page entry: ${name}`);
        assert.equal(runtime[name], server[name], `runtime entry: ${name}`);
    }
});

test('the built runtime exports the page surface as the page entry of the server does', () => {
    const exported = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e',
        `const runtime = await import(${JSON.stringify(RUNTIME)});
         console.log(JSON.stringify(Object.fromEntries(Object.keys(runtime).map(name => [name, typeof runtime[name]]))));`],
    {encoding: 'utf8'}));
    for (const name of PAGE_SURFACE) assert.equal(exported[name], typeof server[name], `built runtime: ${name}`);
});

test('a page module builds a Decimal, dates, a time and a Bag in main on the server', async () => {
    const {Page} = await import(new URL('typed-literals.js', FIXTURES));
    assert.equal(Object.getPrototypeOf(Page), server.Page, 'the name resolves to the page entry of the server');
    assert.deepEqual(literals(sourceOf(Page)), {
        price: '12.75::N',
        day: '2026-10-17::D',
        moment: '2026-10-17T09:30:00.000Z::DHZ',
        time: '09:30:00.000::H',
        prices: '{"rows":[[[],"net",null,"12.75::N",{}]]}::JS::X',
    });
});

test('the same page module builds the same Source when the name is mapped to the built runtime', async () => {
    const {Page} = await import(new URL('typed-literals.js', FIXTURES));
    const output = execFileSync(process.execPath, [fileURLToPath(new URL('browser-context.mjs', FIXTURES)), RUNTIME],
        {encoding: 'utf8'});
    const inBrowser = JSON.parse(output);
    assert.equal(inBrowser.onRuntime, true, 'the name resolves to the built runtime, not to the server entry');
    assert.equal(inBrowser.text, sourceOf(Page));
});
