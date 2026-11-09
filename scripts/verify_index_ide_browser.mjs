/** Python-authored IndexPage and IdePage; the coordinators observe their Data by path in a real browser. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';

const [python, entry, ...engines] = process.argv.slice(2);
const playwright = await import(pathToFileURL(entry));
const root = fileURLToPath(new URL('../', import.meta.url));
const wire = execFileSync(python, ['-c', `
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
print(b.to_tytx())
`], {cwd: root, encoding: 'utf8'}).trim();
const application = `
import {Gramlot, Bag, mountIndexPage} from './js/src/index.js';
import {IdeLogic} from './js/src/ide-runtime.js';
import inputs from './js/src/components/inputs.js';
import layout from './js/src/components/layout.js';
import tree from './js/src/components/tree.js';
import editors from './js/src/components/editors.js';
import uploads from './js/src/components/uploads.js';
class IndexMount {
    indexMount(node) {
        const renderer = this.page.src.renderer;
        mountIndexPage(renderer, node.parentNode, () => {}, () => {}, {async createEntry(entry) {
            renderer.binding.gramlot.src.builder.wrapSource(entry.pane).div('Page ' + entry.url, {id: 'content' + entry.url.slice(1)});
        }});
    }
}
window.Bag = Bag;
window.gramlot = new Gramlot({document, transport: false, collections: [inputs, layout, tree, editors, uploads]});
gramlot.rpc.call = async (type, method, args) => {
    if (method === 'workspace_open') {
        const entries = new Bag();
        entries.setItem('file', null, {path: 'a.txt', caption: 'a.txt', is_directory: false});
        return {root: '/w', entries, writable: true};
    }
    if (method === 'document_read') return {path: args.path, content: 'first', revision: 'r1', writable: true, language: 'text'};
    throw new Error('Unexpected RPC ' + method);
};
gramlot.src.logicRegistry.register(IdeLogic, {resource: 'verify:ide'});
gramlot.src.logicRegistry.register(IndexMount, {resource: 'verify:index'});
gramlot.src.startSource(${JSON.stringify(wire)});`;
const bundle = await build({stdin: {contents: application, resolveDir: root}, bundle: true, write: false,
    format: 'esm', platform: 'browser', target: 'es2022', loader: {'.css': 'text'}});
const server = createServer((req, res) => {
    if (req.url === '/app.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(bundle.outputFiles[0].text); }
    else { res.setHeader('Content-Type', 'text/html'); res.end('<!doctype html><meta charset="utf-8"><main id="gramlot-root"></main><script type="module" src="/app.js"></script>'); }
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
            await page.locator('#contentone').waitFor();
            await page.evaluate(() => gramlot.data.setItem('index.navigationSelection', 'two'));
            await page.locator('#contenttwo').waitFor();
            assert.equal(await data('index.active'), '/two');
            await page.evaluate(() => {
                const navigation = new Bag();
                for (const name of ['one', 'two', 'three']) navigation.setItem(name, null, {url: '/' + name, title: name});
                gramlot.data.setItem('index.navigation', navigation);
                gramlot.data.setItem('index.navigationSelection', 'three');
            });
            await page.locator('#contentthree').waitFor();
            const tabs = page.locator('#index gramlot-tab-container').first();
            await tabs.locator('[aria-label="Close three"]').click();
            await page.waitForFunction(() => gramlot.data.getItem('index.active') === '/two');
            assert.equal(await page.locator('#contentthree').count(), 0);
            assert.equal(await page.evaluate(() => gramlot.data.getItem('index.opened').length), 2);
            await page.evaluate(() => gramlot.data.setItem('index.active', '/one'));
            await page.waitForFunction(() => gramlot.data.getItem('index.navigationSelection') === 'one');

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
            console.log(`${engine}: PASS — index selection, navigation replacement and tab close; IDE workspace, document open and tab title after a documents replacement.`);
        } finally { await browser.close(); }
    }
} finally { server.close(); }
