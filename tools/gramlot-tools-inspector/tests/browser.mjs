/** Real-engine qualification; Playwright WebKit is not branded Safari. */
import assert from 'node:assert/strict';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {chromium, firefox, webkit} from 'playwright';
const require = createRequire(import.meta.url);
const root = new URL('../', import.meta.url);
const core = await build({entryPoints: [require.resolve('@gramlot/gramlot')], bundle: true,
    format: 'esm', platform: 'browser', target: 'es2022', write: false});
const fixture = `import {Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import layout from '@gramlot/collections/layout';
import tree from '@gramlot/collections/tree';
import '/gramlot-tools-inspector.js';
const app = new Gramlot({element: document.getElementById('app'), transport: false, collections: [layout, tree]});
const builder = new GramlotBuilder();
builder.root.p('^name', {node_label: 'greeting'});
app.data.setItem('name', 'Ada', {description: 'Name'});
app.src.startSource(builder.source);
window.app = app;
const inspector = document.createElement('gramlot-tools-inspector');
inspector.gramlot = app;
document.body.append(inspector);
window.inspector = inspector;
window.ready = true;`;
const files = new Map([
    ['/', ['text/html', `<!doctype html><html><head><meta charset="utf-8"><title>Inspector qualification</title>
<script type="importmap" nonce="fixture">{"imports":{"@gramlot/gramlot":"/core.js","@gramlot/gramlot/components":"/core.js","@gramlot/collections/layout":"/layout/index.js","@gramlot/collections/tree":"/tree/index.js"}}</script></head>
<body style="--gramlot-field-background:#222;--gramlot-ink:#eee;--gramlot-button-background:#222"><main id="app"></main><script type="module" src="/fixture.js"></script></body></html>`]],
    ['/fixture.js', ['text/javascript', fixture]],
    ['/core.js', ['text/javascript', core.outputFiles[0].text]],
    ['/gramlot-tools-inspector.js', ['text/javascript', await readFile(new URL('dist/gramlot-tools-inspector.js', root))]],
]);
const server = createServer(async (request, response) => {
    const requested = new URL(request.url, 'http://fixture');
    if (requested.pathname.startsWith('/layout/') || requested.pathname.startsWith('/tree/')) {
        const [, collection, ...parts] = requested.pathname.split('/');
        const relative = parts.join('/');
        const base = resolve(fileURLToPath(new URL(`../../../src/gramlot/collections/${collection}/assets/`, import.meta.url)));
        const target = resolve(base, relative);
        if (!target.startsWith(base + '/')) { response.writeHead(404).end(); return; }
        try { response.writeHead(200, {'Content-Type':'text/javascript'}).end(await readFile(target)); }
        catch { response.writeHead(404).end(); }
        return;
    }
    const entry = files.get(requested.pathname);
    if (!entry) { response.writeHead(404).end(); return; }
    response.writeHead(200, {'Content-Type': entry[0],
        'Content-Security-Policy': `default-src 'none'; script-src 'self' 'nonce-fixture' ${requested.searchParams.has('conditions') ? "'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; connect-src 'none'`});
    response.end(entry[1]);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/`;
try {
    const engines = {chromium, firefox, webkit};
    const requested = process.argv.slice(2);
    for (const name of requested.length ? requested : Object.keys(engines)) {
        if (!Object.hasOwn(engines, name)) throw new Error(`Unknown browser: ${name}`);
        const engine = engines[name];
        const browser = await engine.launch({headless: true});
        try {
            const page = await browser.newPage({viewport: {width: 1200, height: 900}});
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(url);
            await page.waitForFunction(() => window.ready);
            const palette = page.locator('gramlot-tools-inspector');
            // Inspector chrome stays legible over an application with dark button tokens.
            const add = palette.getByRole('button', {name: 'Add attribute', exact: true});
            assert.equal(await add.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 255, 255)');
            assert.equal(await palette.getByRole('tab', {name:'Data',exact:true}).getAttribute('aria-selected'), 'true');
            assert.equal(await palette.getByRole('tab', {name:'Data',exact:true}).evaluate(el => getComputedStyle(el.parentElement, '::after').content), '""');
            assert.equal(await palette.locator('.error').textContent(), '');
            await palette.locator('gramlot-tree[data-root=data] [data-path=name]').click();
            assert.equal(await palette.getByLabel('Value', {exact:true}).inputValue(), 'Ada');
            const remove = palette.getByRole('button', {name: 'Remove description', exact: true});
            await palette.getByLabel('description value', {exact: true}).focus();
            const geometry = await remove.evaluate(el => {
                const button = el.getBoundingClientRect();
                const icon = el.querySelector('svg').getBoundingClientRect();
                const row = el.closest('.property-row').getBoundingClientRect();
                const css = getComputedStyle(el);
                return {centerOffset: Math.abs(icon.y + icon.height / 2 - row.y - row.height / 2),
                    inside: icon.y >= button.y && icon.bottom <= button.bottom,
                    background: css.backgroundColor, color: css.color, opacity: css.opacity};
            });
            assert.ok(geometry.centerOffset <= 1, 'trash icon vertically centered in the property row');
            assert.ok(geometry.inside, 'trash icon remains inside its button');
            assert.equal(geometry.background, 'rgba(0, 0, 0, 0)');
            assert.equal(geometry.color, 'rgb(124, 135, 151)');
            assert.equal(geometry.opacity, '1');
            await page.evaluate(() => window.app.data.setItem('name', 'Grace'));
            await page.waitForFunction(() => window.inspector.shadowRoot.querySelector('[aria-label=Value]')?.value === 'Grace');
            assert.equal(await palette.getByLabel('Value', {exact:true}).inputValue(), 'Grace');
            await palette.getByRole('tab', {name: 'Source', exact: true}).click();
            assert.equal(await palette.getByRole('tab', {name:'Source',exact:true}).getAttribute('aria-selected'), 'true');
            await palette.locator('gramlot-tree[data-root=source] [data-path=main] > .row .expander').click();
            await palette.locator('gramlot-tree[data-root=source] [data-path="main.greeting"]').click();
            assert.equal(await palette.getByLabel('Value', {exact:true}).inputValue(), '^name');
            await page.evaluate(() => window.app.src.source.getNode('main.greeting').setAttr({title: 'Live Source'}));
            await page.waitForFunction(() => window.inspector.shadowRoot.querySelector('[aria-label="title value"]')?.value === 'Live Source');
            // Edit the actual Source node and its attributes through the palette.
            await palette.getByRole('textbox', {name: 'Value', exact: true}).fill('Edited Source');
            await palette.getByRole('textbox', {name: 'title value', exact: true}).fill('Inspector title');
            await palette.getByLabel('Value', {exact:true}).press('Enter');
            assert.equal(await page.locator('#app p').textContent(), 'Edited Source');
            assert.equal(await page.locator('#app p').getAttribute('title'), 'Inspector title');
            await palette.getByRole('textbox', {name: 'Value', exact: true}).fill('^name');
            await palette.getByLabel('Value', {exact:true}).press('Enter');
            await palette.getByRole('tab', {name: 'Data', exact: true}).click();
            await palette.locator('gramlot-tree[data-root=data] [data-path=name]').click();
            await palette.getByRole('textbox', {name: 'Value', exact: true}).fill('Edited Data');
            await palette.getByLabel('Value', {exact:true}).press('Enter');
            assert.equal(await page.evaluate(() => window.app.data.getItem('name')), 'Edited Data');
            assert.equal(await page.locator('#app p').textContent(), 'Edited Data');
            // New attribute names/types are editable; existing rows commit without losing focus.
            await palette.getByRole('button', {name:'Add attribute', exact:true}).click();
            await palette.getByLabel('New attribute name', {exact:true}).fill('count');
            await palette.getByLabel('New attribute type', {exact:true}).selectOption('integer');
            await palette.getByLabel('New attribute value', {exact:true}).fill('42');
            await palette.getByLabel('New attribute value', {exact:true}).press('Enter');
            assert.equal(await page.evaluate(() => window.app.data.getNode('name').getAttr('count')), 42);
            await palette.getByLabel('count value', {exact:true}).fill('43');
            await palette.getByLabel('description value', {exact:true}).focus();
            assert.equal(await page.evaluate(() => window.app.data.getNode('name').getAttr('count')), 43);
            await palette.getByLabel('Remove count', {exact:true}).click();
            assert.equal(await page.evaluate(() => window.app.data.getNode('name').getAttr('count')), null);
            // The shared action bar targets the hovered row.
            const dataTree = palette.locator('gramlot-tree[data-root=data]');
            const selectedRow = dataTree.locator('[data-path=name] > .row');
            await selectedRow.hover();
            const dot = dataTree.getByRole('button', {name:'Breakpoint', exact:true});
            await dot.click();
            await palette.getByRole('combobox', {name: 'Breakpoint mode', exact: true}).selectOption('console');
            await palette.getByRole('textbox', {name: 'Breakpoint condition', exact: true}).fill('value === "Grace"');
            await palette.getByRole('button', {name: 'Save', exact: true}).click();
            assert.match(await palette.locator('.breakpoint-dialog .breakpoint-status').textContent(), /Breakpoint not saved/);
            await palette.getByRole('textbox', {name: 'Breakpoint condition', exact: true}).fill('');
            await palette.getByRole('button', {name: 'Save', exact: true}).click();
            await page.mouse.move(900, 800);
            await selectedRow.locator('.caption').getByText(/●/).waitFor();
            const logged = page.waitForEvent('console', {predicate: message => message.text().includes('** Gramlot breakpoint **')});
            await page.evaluate(() => window.app.data.setItem('name', 'Grace'));
            await logged;
            await palette.locator('.breakpoint-line').getByText(/1 hits/).waitFor();
            if (name === 'chromium') {
                const session = await page.context().newCDPSession(page);
                await session.send('Debugger.enable');
                await selectedRow.hover();
            await dot.click();
                await palette.getByRole('combobox', {name: 'Breakpoint mode', exact: true}).selectOption('debugger');
                await palette.getByRole('button', {name: 'Save', exact: true}).click();
                let pausedFrames;
                const paused = new Promise(resolve => session.once('Debugger.paused', async event => {
                    pausedFrames = event.callFrames;
                    await session.send('Debugger.resume');
                    resolve();
                }));
                await page.evaluate(function inspectorWriter() { window.app.data.setItem('name', 'Paused'); });
                await paused;
                assert.ok(pausedFrames.some(frame => frame.functionName === 'inspectorWriter'), 'Bag writer remains on the paused stack');
                await session.send('Debugger.disable');
                await session.detach();
            }
            await selectedRow.hover();
            await dot.click();
            await palette.getByRole('combobox', {name: 'Breakpoint mode', exact: true}).selectOption('');
            await palette.getByRole('button', {name: 'Save', exact: true}).click();
            await page.evaluate(() => window.app.data.setItem('name', 'Grace'));
            const splitter = palette.getByRole('separator');
            await splitter.focus(); await page.keyboard.press('ArrowDown');
            const initialSize = Number(await splitter.getAttribute('aria-valuenow'));
            await page.keyboard.press('ArrowDown');
            assert.equal(Number(await splitter.getAttribute('aria-valuenow')), initialSize + 1);
            const splitBox = await splitter.boundingBox();
            await page.mouse.move(splitBox.x + 50, splitBox.y + 3); await page.mouse.down();
            await page.mouse.move(splitBox.x + 50, splitBox.y + 43, {steps:4}); await page.mouse.up();
            assert.ok(Number(await splitter.getAttribute('aria-valuenow')) > initialSize + 1);
            await splitter.focus(); await page.keyboard.press('Home');
            const topSize = await palette.locator('gramlot-border-container').evaluate(el => el.shadowRoot.querySelector('#region-top').getBoundingClientRect().height);
            assert.ok(topSize >= 60 && topSize <= 61, 'Home keeps the tree at its minimum size');
            await page.keyboard.press('End');
            const centerSize = await palette.locator('gramlot-border-container').evaluate(el => el.shadowRoot.querySelector('#region-center').getBoundingClientRect().height);
            assert.ok(centerSize >= 59, 'End keeps the properties area accessible');
            const handle = palette.locator('gramlot-floating-pane .titlebar');
            const dialog = palette.getByRole('dialog', {name:'Gramlot inspector',exact:true});
            const initial = await dialog.boundingBox();
            await handle.focus();
            await page.keyboard.press('ArrowRight');
            const moved = await dialog.boundingBox();
            assert.equal(Math.round(moved.x - initial.x), 10);
            const handleBox = await handle.boundingBox();
            await page.mouse.move(handleBox.x + 40, handleBox.y + 12);
            await page.mouse.down();
            await page.mouse.move(handleBox.x + 100, handleBox.y + 52, {steps: 4});
            await page.mouse.up();
            const dragged = await dialog.boundingBox();
            assert.equal(Math.round(dragged.x - moved.x), 60);
            assert.equal(Math.round(dragged.y - moved.y), 40);
            const grip = await palette.getByLabel('Resize window').boundingBox();
            await page.mouse.move(grip.x + 8, grip.y + 8);
            await page.mouse.down();
            await page.mouse.move(dragged.x + dragged.width + 47, dragged.y + dragged.height + 37, {steps: 4});
            await page.mouse.up();
            const resized = await dialog.boundingBox();
            assert.ok(resized.width > dragged.width + 30, `${name}: native width resize`);
            assert.ok(resized.height > dragged.height + 20, `${name}: native height resize`);
            const titleBox = await dialog.locator('.title').boundingBox();
            const collapseBox = await dialog.getByRole('button', {name:'Collapse window',exact:true}).boundingBox();
            const closeBox = await dialog.getByRole('button', {name:'Close window',exact:true}).boundingBox();
            assert.ok(['left','start'].includes(await dialog.locator('.title').evaluate(el=>getComputedStyle(el).textAlign)));
            assert.ok(titleBox.x < collapseBox.x && collapseBox.x < closeBox.x, 'title left, collapse and close on the right');
            assert.equal(await palette.getByRole('tab', {name:'Data',exact:true}).evaluate(el=>getComputedStyle(el).fontSize), '12px');
            await palette.getByRole('button', {name:'Collapse window',exact:true}).click();
            assert.equal(await dialog.evaluate(el=>el.hasAttribute('data-collapsed')), true);
            assert.equal(await palette.getByRole('button', {name:'Expand window',exact:true}).getAttribute('aria-expanded'), 'false');
            assert.ok((await dialog.boundingBox()).height < 40);
            assert.equal(await palette.getByLabel('Value',{exact:true}).isVisible(), false);
            assert.equal(await palette.getByLabel('Resize window').isVisible(), false);
            await page.evaluate(()=>window.app.data.setItem('name','Updated while collapsed'));
            await handle.focus();await page.keyboard.press('ArrowRight');
            await palette.getByRole('button', {name:'Expand window',exact:true}).focus();await page.keyboard.press('Enter');
            const restored = await dialog.boundingBox();
            assert.equal(Math.round(restored.height),Math.round(resized.height));
            assert.equal(Math.round(restored.width),Math.round(resized.width));
            assert.equal(Math.round(restored.x - resized.x),10);
            assert.equal(await palette.getByLabel('Value',{exact:true}).inputValue(),'Updated while collapsed');
            await handle.focus(); await page.keyboard.press('Home');
            const reset = await dialog.boundingBox();
            assert.equal(Math.round(reset.x), 16); assert.equal(Math.round(reset.y), 16);
            const beforeDock = await dialog.boundingBox();
            await page.evaluate(() => {window.draftElement = window.inspector.shadowRoot.querySelector('[aria-label=Value]'); window.draftElement.value = 'Uncommitted'; window.inspector.setAttribute('docked', '');});
            await page.waitForFunction(() => document.querySelector('gramlot-tools-inspector').shadowRoot.querySelector('gramlot-floating-pane').shell.hasAttribute('data-docked'));
            assert.equal(await page.evaluate(() => window.draftElement === window.inspector.shadowRoot.querySelector('[aria-label=Value]') && window.draftElement.value === 'Uncommitted'), true);
            await page.evaluate(() => window.inspector.removeAttribute('docked'));
            await page.waitForFunction(() => !document.querySelector('gramlot-tools-inspector').shadowRoot.querySelector('gramlot-floating-pane').shell.hasAttribute('data-docked'));
            const afterDock = await dialog.boundingBox();
            for (const key of ['x','y','width','height']) assert.ok(Math.abs(beforeDock[key] - afterDock[key]) < 1, `${name}: ${key} retained after docking`);
            await page.evaluate(()=>window.app.data.setItem('name','Grace'));
            await palette.getByRole('button', {name: 'Close window', exact: true}).click();
            assert.equal(await palette.count(), 0);
            await page.evaluate(() => document.body.append(window.inspector));
            await palette.locator('gramlot-tree[data-root=data] [data-path=name]').click();
            assert.equal(await palette.getByLabel('Value', {exact:true}).inputValue(), 'Grace');
            assert.deepEqual(errors, []);
            if (name === 'chromium') await page.screenshot({path: join(tmpdir(), 'gramlot-tools-inspector.png')});
            await page.goto(`${url}?conditions`);
            await page.waitForFunction(() => window.ready);
            const conditionalRow = palette.locator('gramlot-tree[data-root=data] [data-path=name] > .row');
            await conditionalRow.hover();
            const conditionalDot = palette.locator('gramlot-tree[data-root=data]').getByRole('button', {name:'Breakpoint', exact:true});
            await conditionalDot.click();
            await palette.getByLabel('Breakpoint mode').selectOption('console');
            await palette.getByLabel('Breakpoint condition').fill('value === "Grace"');
            await palette.getByRole('button', {name:'Save',exact:true}).click();
            await page.mouse.move(900,800);
            assert.match(await conditionalRow.locator('.caption').textContent(), /◉/);
            await conditionalRow.locator('.caption').getByText(/◉/).waitFor();
            await conditionalRow.hover();
            await conditionalDot.click();
            await palette.getByLabel('Breakpoint condition').fill('');
            await palette.getByRole('button', {name:'Save',exact:true}).click();
            await page.mouse.move(900,800);
            await conditionalRow.locator('.caption').getByText(/●/).waitFor();
            await conditionalRow.hover();
            await conditionalDot.click();
            await palette.getByLabel('Breakpoint mode').selectOption('');
            await palette.getByRole('button', {name:'Save',exact:true}).click();
            await page.mouse.move(900,800);
            assert.doesNotMatch(await conditionalRow.locator('.caption').textContent(), /[●◉]/);
            await conditionalRow.hover();
            assert.equal(await conditionalDot.getAttribute('aria-label'), 'Breakpoint');
            assert.deepEqual(errors, []);
            console.log(`${name}: PASS — Data/Source editing, console breakpoints, CSP rejection, keyboard/drag/resize, reconnect${name === 'chromium' ? ', debugger pause with writer stack' : ''}`);
        } finally { await browser.close(); }
    }
} finally { await new Promise(resolve => server.close(resolve)); }
