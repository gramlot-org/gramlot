/** Python-authored IndexPage and IdePage; the coordinators observe their Data by path in a real browser. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';

const [python, entry, ...engines] = process.argv.slice(2);
const playwright = await import(pathToFileURL(entry));
const root = fileURLToPath(new URL('../', import.meta.url));
const {wire, fragments} = JSON.parse(execFileSync(python, ['-c', `
import json
from pathlib import Path
from genro_bag import Bag
from gramlot import GramlotBuilder, IndexPage
from gramlot.page import IdePage
b = GramlotBuilder(collections=[json.loads(Path(f'src/gramlot/collections/{name}.json').read_text()) for name in ['inputs','layout','tree','editors','uploads']])
index = IndexPage()
index.navigation = Bag()
for name in ('one', 'two'):
    index.navigation.set_item(name, None, url=f'/{name}', title=name.title())
index.main(b.root.div(node_label='indexHost', height='300px'))
ide = IdePage()
ide.main(b.root.div(node_label='ideHost', height='400px'))
fragments = {}
for name in ('one', 'two', 'three'):
    selection = Bag()
    selection.set_item(name, None, url=f'/{name}', title=name.title())
    fragment = GramlotBuilder()
    index.index_panel(fragment.root, selection)
    fragments[f'/{name}'] = fragment.to_tytx()
print(json.dumps({'wire': b.to_tytx(), 'fragments': fragments}))
`], {cwd: root, encoding: 'utf8'}));
const application = `
import {Gramlot, Bag, IndexLogic, fromTytx, toTytx} from './js/src/index.js';
import {IdeLogic} from './js/src/ide-runtime.js';
import inputs from './js/src/components/inputs.js';
import layout from './js/src/components/layout.js';
import tree from './js/src/components/tree.js';
import editors from './js/src/components/editors.js';
import uploads from './js/src/components/uploads.js';
const fragments = ${JSON.stringify(fragments)};
window.Bag = Bag;
function fixtureResponse(type, method, args) {
    if (type === 'source' && method === 'index_panel') return fragments[args.selection.getNodes()[0].attr.url];
    if (method === 'workspace_open') {
        const entries = new Bag();
        entries.setItem('file', null, {path: 'a.txt', caption: 'a.txt', is_directory: false});
        return {root: '/w', entries, writable: true};
    }
    if (method === 'document_read') return {path: args.path, content: 'first', revision: 'r1', writable: true, language: 'text'};
    throw new Error('Unexpected RPC ' + method);
}
const transport = {
    async call(wire) {
        const {id, contentType, name, params} = fromTytx(wire);
        return toTytx({id, contentType, value:fixtureResponse(contentType, name, params)});
    },
    async close() {},
    dispose() {},
};
window.gramlot = new Gramlot({document, transport, collections: [inputs, layout, tree, editors, uploads]});
gramlot.src.logicRegistry.register(IdeLogic, {resource: 'verify:ide'});
gramlot.src.logicRegistry.register(IndexLogic, {resource: 'verify:index'});
gramlot.src.startSource(${JSON.stringify(wire)});`;
const bundle = await build({stdin: {contents: application, resolveDir: root}, bundle: true, write: false,
    format: 'esm', platform: 'browser', target: 'es2022', loader: {'.css': 'text'}});
const server = createServer((req, res) => {
    if (req.url === '/app.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(bundle.outputFiles[0].text); }
    else if (['/one','/two','/three'].includes(req.url)) {
        res.setHeader('Content-Type', 'text/html');
        res.end('<!doctype html><textarea aria-label="Draft"></textarea>');
    } else { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><meta charset="utf-8"><main id="gramlot-root"></main><script type="module" src="/app.js"></script>'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
try {
    for (const engine of engines.length ? engines : ['chromium', 'webkit']) {
        const browser = await playwright[engine].launch();
        try {
            const page = await browser.newPage({viewport: {width: 1200, height: 900}}), errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(`http://127.0.0.1:${server.address().port}`);
            await page.waitForFunction(() => window.gramlot?.src.source && document.getElementById('index') && document.getElementById('gramlot-ide'), null, {timeout: 10000})
                .catch(error => { throw new Error(`${error.message}; page errors: ${errors.join('; ')}`); });
            const data = path => page.evaluate(p => gramlot.data.getItem(p), path);

            // IndexPage: selections written at their paths open pages; a replaced navigation Bag is read at its path.
            await page.evaluate(() => gramlot.data.setItem('index.navigationSelection', 'one'));
            await page.locator('iframe[src="/one"]').waitFor();
            const tabs = page.locator('#index gramlot-tab-container').first();
            const bar = tabs.locator('gramlot-tab-bar');
            assert.equal(await bar.evaluate(el => el.inert && el.offsetHeight === 0), true);
            await page.evaluate(() => gramlot.data.setItem('index.navigationSelection', 'two'));
            await page.locator('iframe[src="/two"]').waitFor();
            assert.equal(await data('index.active'), '/two');
            await page.evaluate(() => {
                const navigation = new Bag();
                for (const name of ['one', 'two', 'three']) navigation.setItem(name, null, {url: '/' + name, title: name});
                gramlot.data.setItem('index.navigation', navigation);
                gramlot.data.setItem('index.navigationSelection', 'three');
            });
            await page.locator('iframe[src="/three"]').waitFor();
            await page.waitForFunction(el => el.offsetHeight === 32, await bar.elementHandle(), {timeout:3000});
            const frame = page.frameLocator('iframe[src="/three"]');
            const draft = frame.getByRole('textbox',{name:'Draft'});
            await draft.fill('Unsubmitted iframe draft');
            const originalDocument = await draft.evaluateHandle(el=>el.ownerDocument);
            const first = bar.getByRole('tab', {name:'One',exact:true});
            const last = bar.getByRole('tab', {name:'three',exact:true});
            await last.focus();
            await last.press('ArrowLeft');
            assert.equal(await data('index.active'), '/three');
            await page.keyboard.press('Enter');
            assert.equal(await data('index.active'), '/two');
            const start = await first.boundingBox(), end = await last.boundingBox();
            const x = end.x + end.width-2, y = end.y+10;
            const preview = bar.locator('.drag-preview:popover-open');
            await page.mouse.move(start.x+20,start.y+10);
            await page.mouse.down();
            await page.mouse.move(start.x+22,start.y+10);
            assert.equal(await preview.count(),0);
            await page.mouse.move(x,y,{steps:8});
            const lifted = await preview.boundingBox();
            assert.ok(lifted && Math.abs(lifted.x-(x-20))<2 && Math.abs(lifted.y-(y-10))<2);
            assert.equal(await preview.innerText(),'One');
            assert.equal(await last.evaluate(el => parseFloat(el.parentElement.style.translate) < 0),true);
            assert.deepEqual(await bar.getByRole('tab').allTextContents(), ['One','Two','three']);
            await page.mouse.up();
            assert.equal(await preview.count(),0);
            assert.deepEqual(await bar.getByRole('tab').allTextContents(), ['Two','three','One']);
            assert.equal(await data('index.active'), '/two');
            const bounds = await last.boundingBox();
            await page.mouse.move(bounds.x + bounds.width/2, bounds.y + bounds.height/2);
            await page.mouse.down();
            await page.mouse.move(bounds.x + bounds.width/2, bounds.y + 80, {steps:6});
            assert.equal(await preview.getAttribute('data-detach'),'');
            assert.equal(await tabs.getByRole('dialog').count(),0);
            await page.keyboard.press('Escape');
            await page.mouse.up();
            assert.equal(await preview.count(),0);
            assert.equal(await tabs.getByRole('dialog').count(),0);
            await page.mouse.move(bounds.x + bounds.width/2,bounds.y+10);
            await page.mouse.down();
            await page.mouse.move(bounds.x + bounds.width/2,bounds.y+80,{steps:6});
            await page.mouse.up();
            const floating = tabs.getByRole('dialog',{name:'three'});
            assert.equal(await draft.inputValue(),'Unsubmitted iframe draft');
            assert.equal(await draft.evaluate((el,doc)=>el.ownerDocument === doc, originalDocument),true);
            await floating.getByRole('button',{name:'Close window'}).click();
            assert.equal(await draft.inputValue(),'Unsubmitted iframe draft');
            assert.equal(await draft.evaluate((el,doc)=>el.ownerDocument === doc, originalDocument),true);
            await originalDocument.dispose();
            assert.equal(await data('index.active'), '/three');

            await first.click();
            await bar.evaluate(el=>el.style.width='165px');
            const more = bar.getByRole('button',{name:'More tabs'});
            await more.click();
            await page.evaluate(()=>gramlot.data.getNode('index.navigation.three').setAttr({badge:0}));
            const item = bar.getByRole('menuitem',{name:'three 0'});
            await item.waitFor();
            await page.evaluate(()=>gramlot.data.getNode('index.navigation.three').setAttr({badge:3}));
            await bar.getByRole('menuitem',{name:'three 3'}).click();
            assert.equal(await data('index.active'), '/three');
            assert.equal(await bar.getByRole('tab',{name:'three 3'}).getAttribute('aria-selected'),'true');
            await bar.evaluate(el=>el.style.width='');
            await more.waitFor({state:'hidden'});
            await tabs.locator('[aria-label="Close three"]').click();
            await page.waitForFunction(() => gramlot.data.getItem('index.active') === '/two');
            assert.equal(await page.locator('iframe[src="/three"]').count(), 0);
            assert.equal(await page.evaluate(() => gramlot.data.getItem('index.opened').length), 2);
            await page.evaluate(() => gramlot.data.setItem('index.active', '/one'));
            await page.waitForFunction(() => gramlot.data.getItem('index.navigationSelection') === 'one');

            await bar.getByRole('tab', {name:'Two',exact:true}).click({button:'middle'});
            await page.waitForFunction(el => el.inert && el.offsetHeight === 0, await bar.elementHandle(), {timeout:3000});
            assert.equal(await data('index.active'), '/one');
            assert.equal(await bar.getByRole('tab').count(), 0);

            // IdePage: a workspace and a document observed at their Data paths.
            await page.evaluate(() => gramlot.data.setItem('ide.browser.requestedRoot', '/w'));
            await page.waitForFunction(() => gramlot.data.getItem('ide.workspace') === '/w');
            assert.equal(await data('ide.status'), 'Workspace: /w');
            await page.evaluate(() => gramlot.data.setItem('ide.browser.selectedPath', 'file'));
            await page.waitForFunction(() => gramlot.data.getItem('ide.active')?.startsWith('d_'));
            const key = await data('ide.active');
            await page.evaluate(() => gramlot.data.setItem('ide.documents', Bag.fromTytx(gramlot.data.getItem('ide.documents').toTytx())));
            await page.evaluate(k => gramlot.data.setItem(`ide.documents.${k}.content`, 'second'), key);
            const title = () => page.evaluate(k => gramlot.src.source.getNode('main.ideHost').value.getNodes()[0]
                .value.getNode('frame.center.tabs').value.getNode(k).getAttr('title'), key);
            assert.equal(await title(), '● a.txt');
            await page.evaluate(k => gramlot.data.setItem(`ide.documents.${k}.content`, 'first'), key);
            assert.equal(await title(), 'a.txt');
            assert.deepEqual(errors, []);
            console.log(`${engine}: PASS — IndexPage tabBar collapse, keyboard selection, drag order, iframe draft retained across detachment and redocking, overflow badge updates and middle-click closure; IDE workspace, document open and tab title after a documents replacement.`);
        } finally { await browser.close(); }
    }
} finally { server.close(); }
