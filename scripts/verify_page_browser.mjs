/** Optional real-browser contract check. Supply installed Playwright and Chromium. */
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {pathToFileURL, fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const [runtime, playwrightPath, executablePath, language = 'python'] = process.argv.slice(2);
if (!executablePath) throw new Error('Usage: node verify_page_browser.mjs RUNTIME PLAYWRIGHT_ENTRY CHROMIUM [python|js]');
const {chromium} = await import(pathToFileURL(playwrightPath));
const root = fileURLToPath(new URL('../', import.meta.url));
const externalUrl = process.env.GRAMLOT_TEST_URL;
if (language === 'js' && !externalUrl) throw new Error('JS verification requires GRAMLOT_TEST_URL from a running Node/Bun adapter');
const server = externalUrl ? null : spawn(runtime, ['tests/http_server.py'], {
    cwd: root, env: {...process.env, PYTHONPATH: `${root}/src`}, stdio: ['ignore', 'pipe', 'inherit'],
});
let browser;
try {
    const url = externalUrl ?? await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(Error('GramlotServer startup timed out')), 10000);
        createInterface({input: server.stdout}).once('line', line => { clearTimeout(timer); resolve(line); });
        server.once('exit', code => { clearTimeout(timer); reject(Error(`GramlotServer exited: ${code}`)); });
    });
    browser = await chromium.launch({headless: true, executablePath});
    const page = await browser.newPage();
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('request', request => requests.push([request.method(), new URL(request.url()).pathname]));
    await page.goto(url);
    await page.waitForFunction(() => window.gramlot?.state === 'started');
    assert.equal(await page.locator('#panel').textContent(), 'homerbart');
    assert.equal(await page.locator('#name').inputValue(), 'marge');
    assert.equal(await page.locator('#literal').textContent(), '<literal text>');
    const result = await page.evaluate(async () => {
        const {GramlotBuilder} = await import('/assets/gramlot.js');
        const app = window.gramlot;
        const contents = app.src.source.getItem('main');
        const panel = contents.getNodes()[0];
        if (contents.constructor !== app.src.source.constructor || panel.nodeTag !== 'div' ||
            panel.attr.tag !== undefined || panel.value.getNodes()[0].value !== 'bart') {
            throw new Error('Main lost its typed SourceBag structure');
        }
        let invalidSourceRejected = false;
        try { panel.setAttr({title: {invalid: true}}); }
        catch { invalidSourceRejected = true; }
        if (!invalidSourceRejected || panel.attr.title?.invalid !== true ||
            document.querySelector('#panel').textContent !== 'homerbart') {
            throw new Error('Rendering failure did not preserve the written Source or untouched DOM');
        }
        panel.setAttr({title: null, _text: 'updated'});
        app.src.builder.wrapSource(panel.value).strong(' lisa');
        const afterInsert = document.querySelector('#panel').textContent;
        panel.value.clear();
        const afterDelete = document.querySelector('#panel').textContent;
        const replacement = new GramlotBuilder();
        replacement.root.em(' maggie');
        panel.setValue(replacement.source);
        const afterReplace = document.querySelector('#panel').textContent;
        const remoteApplied = await app.src.remoteSource(panel, 'details', {name: 'remote homer'});
        const afterRemote = document.querySelector('#panel').textContent;
        const child = panel.value.getNodes()[0];
        app.src.renderer.freeze(panel);
        app.src.renderer.freeze(child);
        child.setValue('frozen final');
        app.src.builder.wrapSource(panel.value).span(' tail');
        app.src.renderer.unfreeze(child);
        const whileFrozen = document.querySelector('#panel').textContent;
        app.src.renderer.unfreeze(panel);
        const afterUnfreeze = document.querySelector('#panel').textContent;
        child.setValue('live again');
        const afterResume = document.querySelector('#panel').textContent;
        app.dispose();
        return {invalidSourceRejected, afterInsert, afterDelete, afterReplace, remoteApplied, afterRemote, whileFrozen, afterUnfreeze, afterResume, remaining: app.src.renderer.records.size,
                children: document.querySelector('#gramlot-root').childNodes.length};
    });
    assert.deepEqual(result, {invalidSourceRejected: true, afterInsert: 'updatedbart lisa', afterDelete: 'updated',
        afterReplace: 'updated maggie', remoteApplied: true, afterRemote: 'remote homer', whileFrozen: 'remote homer',
        afterUnfreeze: 'frozen final tail', afterResume: 'live again tail', remaining: 0, children: 0});
    assert.deepEqual(errors, []);
    // One envelope for `main`, one for the remote Source.
    assert.equal(requests.filter(([method, path]) => method === 'POST' && path === '/gramlot/rpc').length, 2);
    console.log('Browser PASS: bootstrap, main, reported rendering error, nested updates, remote Source, branch freeze/unfreeze, disposal; no JS errors.');
} finally {
    await browser?.close();
    server?.kill();
}
