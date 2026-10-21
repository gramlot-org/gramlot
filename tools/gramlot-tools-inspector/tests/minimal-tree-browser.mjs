/** Python-first tree qualification; --serve retains the local review page after checks. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {chromium, webkit} from 'playwright';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const wire = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['tests/fixtures/components/tree.py'],
    {cwd: repo, encoding: 'utf8'}).trim();
const output = await build({
    stdin: {contents: `
import {Gramlot} from '${repo}/js/src/index.js';
import tree from '${repo}/js/src/components/tree.js';
import buttons from '${repo}/js/src/components/buttons.js';
const app = new Gramlot({element: document.getElementById('app'), transport: false, collections: [tree, buttons]});
app.src.startSource(${JSON.stringify(wire)});
window.qualification = app;
`, resolveDir: repo, sourcefile: 'minimal-tree-qualification.js'},
    bundle: true, format: 'esm', platform: 'browser', target: 'es2022', write: false
});
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Gramlot — minimal Bag tree</title>
<style>body{margin:0;color:#263449;background:#f4f6f9}main{background:white;border:1px solid #dbe2ed;border-radius:12px}
h1{margin-top:0;font-size:24px}p{color:#526078}code{display:block;min-height:24px;color:#24559a}
gramlot-tree{border:1px solid #dbe2ed;border-radius:6px;padding:8px}</style>
</head><body><div id="app"></div><script type="module" src="/qualification.js"></script></body></html>`;
const server = createServer((request, response) => {
    if (request.url === '/qualification.js') {
        response.setHeader('content-type', 'text/javascript');
        response.end(output.outputFiles[0].text);
    } else if (request.url === '/') {
        response.setHeader('content-type', 'text/html'); response.end(html);
    } else { response.writeHead(404); response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/`;
let passed = false;
try {
    for (const engine of [chromium, webkit]) {
        const browser = await engine.launch({headless: true});
        try {
            const page = await browser.newPage({viewport: {width: 980, height: 760}});
            const errors = []; page.on('pageerror', error => errors.push(error.message));
            await page.goto(url);
            const tree = page.locator('gramlot-tree');
            const row = path => tree.locator(`[data-path="${path}"]`);
            await row('documents').waitFor();
            assert.equal(await row('documents').getAttribute('aria-expanded'), 'false');
            await row('documents').getByRole('button', {name: 'Expand documents', exact: true}).click();
            await row('documents.readme').locator('.row').click();
            assert.equal(await page.locator('#selected-path').textContent(), 'documents.readme');
            await page.locator('#select-notes').click();
            assert.equal(await row('documents.notes').getAttribute('aria-selected'), 'true');
            await page.locator('#add-document').click();
            await row('documents.new_document').waitFor();
            assert.equal(await row('documents.notes').getAttribute('aria-selected'), 'true');
            await page.locator('#rename-caption').click();
            await row('documents.notes').getByText('Meeting notes', {exact: true}).waitFor();
            await page.locator('#clear-selection').click();
            assert.equal(await tree.locator('[aria-selected=true]').count(), 0);
            await row('documents').focus(); await page.keyboard.press('End');
            await page.keyboard.press('Enter');
            assert.equal(await page.locator('#selected-path').textContent(), 'status');
            if (engine === chromium) {
                await page.screenshot({path: '/tmp/gramlot-minimal-tree.png'});
                await page.setViewportSize({width: 390, height: 800});
                await page.screenshot({path: '/tmp/gramlot-minimal-tree-mobile.png'});
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            }
            assert.deepEqual(errors, []);
            await page.evaluate(() => qualification.dispose());
            assert.equal(await tree.count(), 0);
            console.log(`${engine.name()}: Python Source, disclosure, two-way selection, live updates, keyboard and disposal passed`);
        } finally {await browser.close();}
    }
    passed = true;
} finally {
    if (!passed || !process.argv.includes('--serve')) await new Promise(resolve => server.close(resolve));
}
if (passed && process.argv.includes('--serve')) {
    console.log(`REVIEW_URL=${url}`);
    for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
