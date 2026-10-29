/** Python-authored first Bag grid; --serve keeps the reviewed page available locally. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';
import {chromium, webkit} from 'playwright';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const wire = execFileSync(`${repo}/.venv/bin/python`, ['tests/fixtures/components/grid.py'], {cwd: repo, encoding: 'utf8'}).trim();
const bundle = await build({stdin: {contents: `
import {Gramlot} from '${repo}/js/src/index.js';
import grid from '${repo}/js/src/components/grid.js';
const app = new Gramlot({element: document.getElementById('app'), transport: false, collections: [grid], locale: 'it-IT', timeZone: 'Europe/Rome'});
app.src.startSource(${JSON.stringify(wire)});
window.qualification = app;
`, resolveDir: repo, sourcefile: 'minimal-grid-qualification.js'}, bundle: true, format: 'esm',
    platform: 'browser', target: 'es2022', write: false});
const baseStyle = await readFile(`${repo}/themes/gramlot-base/theme.css`, 'utf8');
const compactStyle = await readFile(`${repo}/themes/gramlot-compact/theme.css`, 'utf8');
const themeStyles = {base: '', compact: compactStyle};
for (const name of ['mimi', 'joanna']) themeStyles[name] = compactStyle + await readFile(`${repo}/themes/${name}/theme.css`, 'utf8');
const html = (theme, mode) => `<!doctype html><html lang="en" data-theme="${mode}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gramlot · Bag grid and themes</title><link rel="stylesheet" href="/base.css"><link id="appearance" rel="stylesheet" href="/appearance.css?theme=${theme}"><style>main{background:var(--gramlot-surface)}</style></head><body><div id="app"></div><script type="module" src="/qualification.js"></script></body></html>`;
const server = createServer((request, response) => {
    const address = new URL(request.url, 'http://localhost');
    const selected = address.searchParams.get('theme') ?? 'compact';
    if (!Object.hasOwn(themeStyles, selected)) {response.writeHead(400); response.end('Unknown theme'); return;}
    const mode = address.searchParams.get('mode') === 'dark' ? 'dark' : 'light';
    if (address.pathname === '/') {response.setHeader('content-type', 'text/html'); response.end(html(selected, mode));}
    else if (address.pathname === '/base.css') {response.setHeader('content-type', 'text/css'); response.end(baseStyle);}
    else if (address.pathname === '/appearance.css') {response.setHeader('content-type', 'text/css'); response.end(themeStyles[selected]);}
    else if (address.pathname === '/qualification.js') {response.setHeader('content-type', 'text/javascript'); response.end(bundle.outputFiles[0].text);}
    else {response.writeHead(404); response.end();}
});
const portOption = process.argv.indexOf('--port');
const port = portOption === -1 ? 0 : Number(process.argv[portOption + 1]);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new TypeError('--port requires a valid port');
await new Promise((resolve, reject) => {server.once('error', reject); server.listen(port, '127.0.0.1', resolve);});
const url = `http://127.0.0.1:${server.address().port}/`;
let passed = false;
try {
    for (const engine of [chromium, webkit]) {
        const browser = await engine.launch({headless: true});
        try {
            const page = await browser.newPage({viewport: {width: 1100, height: 1000}});
            const errors = []; page.on('pageerror', error => errors.push(error.message));
            await page.goto(url);
            const first = page.locator('#grid-values'), second = page.locator('#grid-attributes');
            await first.locator('tbody tr').first().waitFor();
            assert.equal(await first.locator('tbody tr').count(), 60);
            assert.deepEqual(await first.locator('tbody tr').first().locator('td').allTextContents(),
                await second.locator('tbody tr').first().locator('td').allTextContents());
            assert.equal(await first.locator('th[scope=colgroup]').textContent(), 'Amounts');
            assert.equal(await first.locator('input,[contenteditable]').count(), 0);
            await page.locator('#update-row').click();
            for (const host of [first, second]) assert.equal(await host.locator('tbody tr').first().locator('[data-field=price]').textContent(), '99,50');
            await page.locator('#remove-row').click();
            assert.equal(await first.locator('tbody tr').count(), 59);
            const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            const geometry = () => first.evaluate(host => {
                const root = host.shadowRoot, header = root.querySelector('.header-frame'), body = root.querySelector('.body-viewport');
                const headCols = [...root.querySelectorAll('th[scope=col]')].sort((a, b) => Number(a.getAttribute('aria-colindex')) - Number(b.getAttribute('aria-colindex')));
                const bodyCols = [...root.querySelector('tbody tr').cells];
                return {
                    headerBottom: header.getBoundingClientRect().bottom, bodyTop: body.getBoundingClientRect().top,
                    gutter: body.offsetWidth - body.clientWidth,
                    headerWidth: root.querySelector('.header-viewport').getBoundingClientRect().width,
                    bodyWidth: body.clientWidth, bodyHeight: body.clientHeight, scrollHeight: body.scrollHeight,
                    pairs: headCols.map((th, i) => ({head: th.getBoundingClientRect().x, body: bodyCols[i].getBoundingClientRect().x,
                        headWidth: th.getBoundingClientRect().width, bodyWidth: bodyCols[i].getBoundingClientRect().width})),
                    color: getComputedStyle(host).color,
                    background: getComputedStyle(root.querySelector('th')).backgroundColor,
                    rowHeight: root.querySelector('tbody tr').getBoundingClientRect().height,
                };
            });
            const aligned = result => {
                assert.ok(Math.abs(result.headerBottom - result.bodyTop) < 1, 'scrollable body starts below all header rows');
                assert.ok(Math.abs(result.headerWidth - result.bodyWidth) < 1, 'header excludes the native scrollbar gutter');
                for (const pair of result.pairs) {
                    assert.ok(Math.abs(pair.head - pair.body) < 1, `column position aligned: ${JSON.stringify(pair)}`);
                    assert.ok(Math.abs(pair.headWidth - pair.bodyWidth) < 1, `column width aligned: ${JSON.stringify(pair)}`);
                }
            };
            await settle(); aligned(await geometry());
            assert.equal(await first.getByRole('table').count(), 1);
            assert.equal(await first.getByRole('columnheader').count(), 7);
            const before = await first.locator('.header-frame').boundingBox();
            await first.locator('.body-viewport').evaluate(element => {element.scrollTop = 600;});
            await settle();
            assert.equal((await first.locator('.header-frame').boundingBox()).y, before.y);
            assert.ok((await geometry()).scrollHeight > (await geometry()).bodyHeight);
            const rowHandle = await first.locator('tbody tr').first().elementHandle();
            const colors = {}, heights = {};
            for (const theme of ['base', 'compact', 'mimi', 'joanna']) {
                for (const mode of ['light', 'dark']) {
                    await page.evaluate(async ({theme, mode}) => {
                        document.documentElement.dataset.theme = mode;
                        const link = document.getElementById('appearance');
                        const href = `/appearance.css?theme=${theme}`;
                        if (link.getAttribute('href') !== href) {
                            await new Promise((resolve, reject) => {link.onload = resolve; link.onerror = reject; link.href = href;});
                        }
                    }, {theme, mode});
                    await settle();
                    const metrics = await geometry(); aligned(metrics);
                    assert.equal(await rowHandle.evaluate(row => row.isConnected), true, 'theme changes preserve rendered rows');
                    colors[`${theme}-${mode}`] = metrics.color + metrics.background;
                    heights[theme] = metrics.rowHeight;
                    await first.locator('.body-viewport').evaluate(element => {element.scrollTop = 0; element.scrollLeft = 0;});
                    await page.setViewportSize({width: 1100, height: 1000}); await settle();
                    if (engine === chromium) await page.screenshot({path: `/private/tmp/gramlot-grid-${theme}-${mode}.png`});
                    await page.setViewportSize({width: 390, height: 900}); await settle();
                    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'page contains the grid on narrow viewports');
                    assert.ok(await first.locator('.body-viewport').evaluate(element => element.scrollWidth > element.clientWidth));
                    await first.locator('.body-viewport').evaluate(element => {element.scrollLeft = 240;});
                    await settle(); aligned(await geometry());
                    await page.setViewportSize({width: 1100, height: 1000}); await settle();
                }
                assert.notEqual(colors[`${theme}-light`], colors[`${theme}-dark`], `${theme} follows dark mode`);
            }
            assert.ok(heights.base > heights.compact && heights.compact > heights.mimi, 'theme density changes actual row geometry');
            assert.ok(heights.joanna > heights.mimi, 'Joanna retains its own density');
            // Force classic, space-occupying scrollbars as well as the platform default.
            await first.evaluate(host => {
                const style = document.createElement('style');
                style.textContent = '.body-viewport::-webkit-scrollbar{width:17px;height:13px}';
                host.shadowRoot.append(style);
            });
            await settle(); aligned(await geometry());
            if (engine === chromium) assert.ok((await geometry()).gutter > 0, 'Chromium classic scrollbar case exercises compensation');
            // macOS WebKit retains overlay scrollbars even with an explicit scrollbar width.
            console.log(`${engine.name()}: measured scrollbar gutter ${(await geometry()).gutter}px`);
            // Resize, hiding/revealing and RTL must use the same CSS sizing contract.
            await first.evaluate(host => {host.style.width = '473.5px'; host.style.direction = 'rtl';});
            await settle();
            await first.locator('.body-viewport').evaluate(element => {element.scrollLeft = -160;});
            await settle(); aligned(await geometry());
            await first.evaluate(host => {host.style.display = 'none';}); await settle();
            await first.evaluate(host => {host.style.display = '';}); await settle(); aligned(await geometry());
            assert.equal(await rowHandle.evaluate(row => row.isConnected), true);
            await first.evaluate(host => {host.style.width = ''; host.style.direction = '';}); await settle();
            // Mixed relative/fixed widths and live structure changes must align as well.
            await page.evaluate(() => {
                const source = qualification.src.source.getNode('main.pane.values');
                const struct = qualification.data.getItem(source.getAttr('structpath'));
                struct.getNodes()[0].setAttr({width: '15%'});
                struct.getNodes()[1].setAttr({width: '12.5em'});
            });
            await settle(); aligned(await geometry());
            // Theme overrides work in a component scope and need no Source/Data rebuild.
            await first.evaluate(host => host.style.setProperty('--gramlot-grid-header-background', 'rgb(60, 70, 80)'));
            assert.equal(await first.locator('th').first().evaluate(th => getComputedStyle(th).backgroundColor), 'rgb(60, 70, 80)');
            assert.deepEqual(errors, []);
            await page.evaluate(() => qualification.dispose());
            assert.equal(await page.locator('gramlot-grid').count(), 0);
            console.log(`${engine.name()}: Python Source, both row layouts, separate header/body, 8 theme/mode combinations, density, scroll alignment, classic gutter, stable rows and disposal passed`);
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
