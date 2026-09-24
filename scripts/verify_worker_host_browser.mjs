/** Real browser integration: static HtmlBuilder shell and dedicated Worker host. */
import {build} from '../js/node_modules/esbuild/lib/main.js';
import {HtmlBuilder} from '../js/node_modules/@jsr/genro__builders/src/index.js';
import {mkdtemp, writeFile, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const [playwrightPath, engineName = 'chromium', executablePath] = process.argv.slice(2);
if (!playwrightPath) throw new Error('Usage: node scripts/verify_worker_host_browser.mjs PLAYWRIGHT_ENTRY [ENGINE] [EXECUTABLE]');
const engine = (await import(pathToFileURL(playwrightPath)))[engineName];
const js = fileURLToPath(new URL('../js/', import.meta.url));
const worker = (await build({stdin: {resolveDir: fileURLToPath(new URL('../examples/', import.meta.url)), contents: `import {WorkerHost} from '@gramlot/minimal/worker-host'; ${await readFile(join(js, 'tests/fixtures/worker/page.js'), 'utf8')}
new WorkerHost(Page);`},
    bundle: true, platform: 'browser', format: 'iife', write: false})).outputFiles[0].text;
const runtime = (await build({stdin: {resolveDir: fileURLToPath(new URL('../examples/', import.meta.url)), contents: `
    import {mount} from '@gramlot/minimal/standalone';
    const url = URL.createObjectURL(new Blob([${JSON.stringify(worker)}], {type:'text/javascript'}));
    mount({workerUrl:url}).then(app => { window.gramlot=app; }, error => { window.startupError=String(error); })
        .finally(() => URL.revokeObjectURL(url));
`}, bundle: true, platform: 'browser', format: 'iife', write: false})).outputFiles[0].text;
const folder = await mkdtemp(join(tmpdir(), 'gramlot-worker-check-'));
let browser;
try {
    const file = join(folder, 'index.html');
    const shell = new HtmlBuilder();
    const html = shell.root.html();
    html.head().meta({charset: 'utf-8'});
    const body = html.body();
    body.div({id: 'gramlot-root'});
    body.script(runtime.replaceAll('</script', '<\\/script'));
    await writeFile(file, '<!doctype html>' + shell.render());
    browser = await engine.launch({headless: true, ...(executablePath ? {executablePath} : {})});
    const page = await browser.newPage();
    const errors = [], network = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.goto(pathToFileURL(file).href);
    await page.waitForFunction(() => window.gramlot || window.startupError);
    assert.equal(await page.evaluate(() => window.startupError), undefined);
    assert.equal(await page.title(), 'Worker native HTML');
    assert.equal(await page.locator('h1').textContent(), 'Hello Worker');
    const result = await page.evaluate(async () => {
        const app = window.gramlot;
        const [heading, target] = app.source.getItem('main').getNodes();
        await app.remoteSource(target, 'details', {name: 'From Worker'});
        const remote = document.querySelector('#details').textContent;
        heading.setValue('Updated');
        heading.setAttr({title: 'Live attribute'});
        const updated = [document.querySelector('h1').textContent, document.querySelector('h1').title];
        app.builder.wrapSource(target.value).span(' inserted');
        const inserted = document.querySelector('#details').textContent;
        target.value.clear();
        const deleted = document.querySelector('#details').textContent;
        const transport = app.transport;
        app.dispose();
        let rejected = false;
        try { await transport.main(app.pageId); } catch { rejected = true; }
        return {remote, updated, inserted, deleted, disposed: app.state,
            pending: transport.pending.size, closed: transport.closed, rejected,
            children: document.querySelector('#gramlot-root').childNodes.length};
    });
    assert.deepEqual(result, {remote: 'From Worker', updated: ['Updated', 'Live attribute'],
        inserted: 'From Worker inserted', deleted: '', disposed: 'disposed', pending: 0,
        closed: true, rejected: true, children: 0});
    assert.deepEqual(errors, []);
    assert.deepEqual(network, []);
    console.log(`${engineName} ${browser.version()} PASS: file bootstrap, Worker main/remote Source, live text/attributes/insert/delete, dispose; no HTTP(S).`);
} finally {
    await browser?.close();
    await rm(folder, {recursive: true, force: true});
}
