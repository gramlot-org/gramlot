/** CSS cascade and tool lifecycle checks need a real browser, not jsdom. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {chromium, webkit} from 'playwright';
const require = createRequire(import.meta.url);
const core = await build({entryPoints: [require.resolve('@gramlot/gramlot')], bundle: true, format: 'esm', platform: 'browser', target: 'es2022', write: false});
const fixture = `import {Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import '/inspector.js';
import {InspectorStyles} from '/inspector-styles.js';
window.InspectorStyles = InspectorStyles;
const app = new Gramlot({element: document.querySelector('main'), transport: false});
const builder = new GramlotBuilder();
const pane = builder.root.section({class: 'example-page stack', style: 'margin-left: 520px; width: min(560px, calc(100% - 540px))'});
pane.h1('CSS variable playground');
pane.p('Try the Styles tab: change a color, spacing or the corner radius.');
const card = pane.section({class: 'card stack'});
card.h2('A shared theme'); card.p('These controls use the real Gramlot Base stylesheet.');
card.html_label('Project name'); card.input({value: '^name', placeholder: 'Your project'});
card.html_button('Primary action', {type: 'button'}); card.a('A themed link', {href: '#preview'});
pane.pre('Change --gramlot-action or --gramlot-radius-lg, then reset.');
app.data.setItem('name', 'Gramlot'); app.src.startSource(builder.source);
const inspector = document.createElement('gramlot-tools-inspector');
inspector.gramlot = app; document.body.append(inspector);
window.app = app; window.inspector = inspector; window.sourceBefore = app.src.source.toTytx('json');
window.ready = true;`;
const html = `<!doctype html><meta charset="utf-8"><title>Inspector CSS variable trial</title>
<link rel="stylesheet" href="/theme.css"><style>:root {--unrelated-token: 5px}</style>
<script type="importmap" nonce="fixture">{"imports":{"@gramlot/gramlot":"/core.js"}}</script>
<main></main><script type="module" src="/fixture.js"></script>`;
const files = new Map([
    ['/', ['text/html', html]], ['/fixture.js', ['text/javascript', fixture]],
    ['/core.js', ['text/javascript', core.outputFiles[0].text]],
    ['/inspector.js', ['text/javascript', await readFile(new URL('../dist/gramlot-tools-inspector.js', import.meta.url))]],
    ['/inspector-styles.js', ['text/javascript', await readFile(new URL('../src/inspector-styles.js', import.meta.url))]],
    ['/theme.css', ['text/css', await readFile(new URL('../../../themes/gramlot-base/theme.css', import.meta.url))]],
    ['/compact.css', ['text/css', await readFile(new URL('../../../themes/gramlot-compact/theme.css', import.meta.url))]]
]);
const server = createServer((request, response) => {
    const entry = files.get(request.url);
    if (!entry) {response.writeHead(404).end(); return;}
    response.writeHead(200, {'Content-Type': entry[0], 'Content-Security-Policy': "default-src 'none'; script-src 'self' 'nonce-fixture'; style-src 'self' 'unsafe-inline'"});
    response.end(entry[1]);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/`;
if (process.argv.includes('--serve')) {
    console.log(url);
} else {
    try {
        for (const engine of [chromium, webkit]) {
            const browser = await engine.launch({headless: true});
            try {
                const page = await browser.newPage({viewport: {width: 1200, height: 900}, colorScheme: 'light'});
                const errors = []; page.on('pageerror', error => errors.push(error.message));
                await page.goto(url); await page.waitForFunction(() => window.ready).catch(error => { throw new Error(errors.join('\n') || error.message); });
                const tool = page.locator('gramlot-tools-inspector');
                await tool.getByRole('tab', {name: 'Styles', exact: true}).click();
                const field = name => tool.getByLabel(`${name} value`, {exact: true});
                const exportLink = tool.getByText('Download CSS', {exact: true});
                await field('--gramlot-action').waitFor();
                assert.equal(await exportLink.getAttribute('href'), null);
                assert.equal(await tool.locator('.style-row').count(), 41); // Current Base theme root tokens.
                assert.equal(await tool.locator('.styles-empty').isVisible(), false);
                assert.equal(await tool.locator('gramlot-poc-splitter').isVisible(), false);
                assert.equal(await tool.getByRole('heading', {name: 'Spacing', exact: true}).count(), 1);
                await field('--gramlot-action').fill('#cc2244'); await field('--gramlot-action').press('Enter');
                await page.waitForFunction(() => getComputedStyle(document.querySelector('main button')).backgroundColor === 'rgb(204, 34, 68)');
                assert.equal(await field('--gramlot-action').inputValue(), '#cc2244');
                await page.screenshot({path: `/private/tmp/gramlot-inspector-styles-${engine.name()}.png`});
                await tool.getByLabel('--gramlot-action color', {exact: true}).fill('#228866');
                await page.waitForFunction(() => getComputedStyle(document.querySelector('main button')).backgroundColor === 'rgb(34, 136, 102)');
                await field('--gramlot-space-4').fill('2rem'); await field('--gramlot-space-4').press('Enter');
                await page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--gramlot-space-4').trim() === '2rem');
                await tool.getByLabel('Reset --gramlot-action', {exact: true}).click();
                await page.waitForFunction(() => getComputedStyle(document.querySelector('main button')).backgroundColor === 'rgb(69, 107, 196)');
                assert.equal(await field('--gramlot-space-4').inputValue(), '2rem');
                await field('--gramlot-action').fill('red; color: red'); await field('--gramlot-action').press('Enter');
                await tool.locator('.styles-status').getByText('Enter a valid CSS variable value').waitFor();
                assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('main button')).backgroundColor), 'rgb(69, 107, 196)');
                await field('--gramlot-action').press('Escape');
                assert.equal(await field('--gramlot-action').inputValue(), '#456bc4');
                await field('--gramlot-action').fill('var(--missing-color)'); await field('--gramlot-action').press('Enter');
                await tool.getByLabel('Reset --gramlot-action', {exact: true}).click();
                await field('--gramlot-action').fill('var(--gramlot-brand-yellow)'); await field('--gramlot-action').press('Enter');
                await page.waitForFunction(() => getComputedStyle(document.querySelector('main button')).backgroundColor === 'rgb(255, 196, 0)');
                assert.equal(await field('--gramlot-action').inputValue(), 'var(--gramlot-brand-yellow)');
                const downloaded = page.waitForEvent('download');
                await exportLink.click();
                const download = await downloaded;
                assert.equal(download.suggestedFilename(), 'theme-overrides.css');
                const exportedCss = await readFile(await download.path(), 'utf8');
                assert.equal(exportedCss, '/* Gramlot overrides. Load after the theme stylesheet. */\n:root {\n  --gramlot-action: var(--gramlot-brand-yellow) !important;\n  --gramlot-space-4: 2rem !important;\n}\n');
                const restored = await browser.newPage({colorScheme: 'light'});
                await restored.goto(url); await restored.waitForFunction(() => window.ready);
                await restored.addStyleTag({content: exportedCss});
                await restored.waitForFunction(() => getComputedStyle(document.querySelector('main button')).backgroundColor === 'rgb(255, 196, 0)');
                assert.equal(await restored.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--gramlot-space-4').trim()), '2rem');
                await restored.close();
                await tool.getByRole('button', {name: 'Reset all', exact: true}).click();
                assert.equal(await exportLink.getAttribute('href'), null);
                await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
                await tool.getByRole('button', {name: 'Refresh', exact: true}).click();
                assert.equal(await field('--gramlot-action').inputValue(), '#91adf4');
                await field('--gramlot-action').fill('#112233'); await field('--gramlot-action').press('Enter');
                await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
                await tool.getByLabel('Reset --gramlot-action', {exact: true}).click();
                assert.equal(await field('--gramlot-action').inputValue(), '#456bc4');
                await page.evaluate(() => new Promise(resolve => {
                    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = '/compact.css'; link.onload = resolve; document.head.append(link);
                }));
                await tool.getByRole('button', {name: 'Refresh', exact: true}).click();
                assert.equal(await field('--gramlot-space-4').inputValue(), '.6rem');
                await field('--gramlot-space-4').fill('3rem'); await field('--gramlot-space-4').press('Enter');
                await tool.getByRole('tab', {name: 'Data', exact: true}).click();
                await tool.locator('gramlot-poc-tree[data-root=data] [data-node-path=name]').click();
                assert.equal(await tool.getByLabel('Value', {exact: true}).inputValue(), 'Gramlot');
                await tool.getByRole('tab', {name: 'Styles', exact: true}).click();
                assert.equal(await field('--gramlot-space-4').inputValue(), '3rem');
                assert.equal(await page.evaluate(() => app.src.source.toTytx('json') === sourceBefore), true);
                // Independent sheets remain correct regardless of session-close order.
                await page.evaluate(() => {
                    const first = new InspectorStyles(document), second = new InspectorStyles(document);
                    first.set('--gramlot-action', '#111111'); second.set('--gramlot-action', '#222222'); first.dispose(); second.dispose();
                });
                assert.equal(await field('--gramlot-action').inputValue(), '#456bc4');
                await tool.getByRole('button', {name: 'Close inspector', exact: true}).click();
                assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--gramlot-space-4').trim()), '.6rem');
                await page.evaluate(() => document.body.append(inspector));
                await tool.getByRole('tab', {name: 'Styles', exact: true}).click();
                assert.equal(await field('--gramlot-space-4').inputValue(), '.6rem');
                await page.evaluate(() => {document.querySelectorAll('head link').forEach(link => link.remove());});
                await tool.getByRole('button', {name: 'Refresh', exact: true}).click();
                assert.equal(await tool.locator('.styles-empty').isVisible(), true);
                assert.equal(await tool.locator('.style-row').count(), 0);
                assert.deepEqual(errors, []);
                console.log(`${engine.name()}: PASS — Base/Compact, color/text previews, invalid CSS, variable references, CSS download and reapplication, reset/current cascade, Source preservation, independent sheets, close/reconnect, empty state`);
            } finally {await browser.close();}
        }
    } finally {await new Promise(resolve => server.close(resolve));}
}
