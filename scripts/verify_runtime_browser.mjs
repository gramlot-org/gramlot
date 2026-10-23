/** Verify the shipped runtimes on localhost and an ordinary HTTP origin in Chromium. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, readdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

const [playwrightPath, executablePath] = process.argv.slice(2);
if (!playwrightPath) throw new Error('Usage: node scripts/verify_runtime_browser.mjs PLAYWRIGHT_ENTRY [EXECUTABLE]');
const {chromium} = await import(pathToFileURL(playwrightPath));
const artifacts = new Map();
const runtimes = [];
for (const folder of ['js/dist', 'src/gramlot/resources']) {
    for (const name of ['gramlot.js', 'gramlot.min.js']) {
        const path = `${folder}/${name}`;
        artifacts.set(`/${path}`, await readFile(new URL(`../${path}`, import.meta.url)));
        runtimes.push(`/${path}`);
    }
    const collectionRoot = folder === 'js/dist' ? 'js/dist/components' : 'src/gramlot/collections';
    for (const name of ['inputs', 'layout']) {
        const assets = `${collectionRoot}/${name}/assets`;
        for (const file of await readdir(new URL(`../${assets}/`, import.meta.url), {recursive: true})) {
            if (!file.endsWith('.js')) continue;
            const path = `${assets}/${file}`;
            artifacts.set(`/${path}`, await readFile(new URL(`../${path}`, import.meta.url)));
        }
    }
}
const server = createServer((request, response) => {
    if (request.url === '/') {
        response.setHeader('Content-Type', 'text/html');
        response.end('<!doctype html><main id="one"></main><main id="two"></main>');
    } else if (artifacts.has(request.url)) {
        response.setHeader('Content-Type', 'text/javascript');
        response.end(artifacts.get(request.url));
    } else {
        response.writeHead(404).end();
    }
});
let browser;
try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({headless: true, ...(executablePath ? {executablePath} : {}),
        args: ['--host-resolver-rules=MAP gramlot-runtime.test 127.0.0.1', '--no-proxy-server']});
    const failures = [];
    for (const host of ['127.0.0.1', 'gramlot-runtime.test']) {
        for (const artifact of runtimes) {
            const page = await browser.newPage();
            try {
                await page.goto(`http://${host}:${server.address().port}/`);
                const context = await page.evaluate(() => ({secure: isSecureContext, uuid: typeof crypto.randomUUID}));
                assert.equal(context.secure, host === '127.0.0.1');
                assert.equal(context.uuid, host === '127.0.0.1' ? 'function' : 'undefined');
                const result = await page.evaluate(async artifact => {
                    const map = document.createElement('script');
                    map.type = 'importmap';
                    map.textContent = JSON.stringify({imports:{'@gramlot/gramlot':artifact}});
                    document.head.append(map);
                    const {Gramlot, GramlotBuilder, Bag} = await import(artifact);
                    const directory = artifact.startsWith('/js/') ? '/js/dist/components' : '/src/gramlot/collections';
                    const {default: inputs} = await import(`${directory}/inputs/assets/index.js`);
                    const {default: layout} = await import(`${directory}/layout/assets/index.js`);
                    inputs.register(window); layout.register(window);
                    const collections = [inputs.toDocument(), layout.toDocument()];
                    for (const author of [
                        root => root.script('^code'),
                        root => root.script({src:'^url'}),
                        root => root.form({html_action:'^action'}),
                    ]) {
                        const element = document.createElement('main'); document.body.append(element);
                        const candidate = new Gramlot({element, transport:false});
                        const source = new GramlotBuilder(); author(source.root);
                        candidate.data.setItem('code', 'window.scriptAttack=1');
                        candidate.data.setItem('url', 'data:text/javascript,window.scriptAttack=1');
                        candidate.data.setItem('action', 'javascript:window.scriptAttack=1');
                        try {
                            let refused = false;
                            try { candidate.src.startSource(source.toTytx()); }
                            catch (error) { refused = /inline code|literal Source|javascript: URL/.test(error.message); }
                            if (!refused || window.scriptAttack) throw new Error('Data reached executable browser content');
                        } finally { candidate.dispose(); element.remove(); }
                    }
                    const literalElement = document.createElement('main'); document.body.append(literalElement);
                    const literalApp = new Gramlot({element:literalElement, transport:false});
                    try {
                        const source = new GramlotBuilder(); source.root.script('window.literalScript=1');
                        literalApp.src.startSource(source.toTytx());
                        if (window.literalScript !== 1) throw new Error('Literal Source script did not execute');
                    } finally { literalApp.dispose(); literalElement.remove(); }
                    const apps = [];
                    const references = [];
                    try {
                        for (const id of ['one', 'two']) {
                            const app = new Gramlot({rootId: id, transport: false, collections});
                            apps.push(app);
                            const builder = new GramlotBuilder(null, {collections});
                            const store = new Bag(); store.setItem('italy', 'IT', {caption:'Italy'});
                            const rejection = new Bag(); rejection.setItem('errorcode', 'denied'); rejection.setItem('message', 'Denied');
                            app.src.logicRegistry.register(class Logic { rejectValue() { return rejection; } }, {resource:'test:runtime'});
                            app.data.setItem('choices', store); app.data.setItem('validated', 'accepted');
                            app.data.setItem('caption', '<b>Code</b><img src="data:,broken" onerror="window.drawerAttack=1">');
                            builder.root.comboBox({id:`${id}-choice`,store:'^choices'});
                            builder.root.textbox({id:`${id}-validated`,value:'^validated',validate_call:'rejectValue'});
                            const border = builder.root.borderContainer({id:`${id}-border`});
                            border.contentPane({region:'center'});
                            border.contentPane({region:'right',drawer:true,drawer_label:'^caption'});
                            const pane = builder.root.div('ready', {id: `${id}-pane`});
                            const node = builder.reference(pane);
                            const dom = builder.reference(pane, 'dom');
                            builder.root.input({id: `${id}-input`, value: '^text'});
                            builder.root.input({id: `${id}-radio`, type: 'radio', group: 'choice', value: '^chosen'});
                            builder.root.button('Confirm', {id: `${id}-ask`, action: "this.SET('confirmed', true);", ask: 'Continue?'});
                            app.data.setItem('text', 'initial');
                            app.src.startSource(builder.toTytx());
                            const choices = document.getElementById(`${id}-choice`).loadChoices({_querystring:'it'});
                            if (choices[0]?.caption !== 'Italy') throw new Error('Bundled store rejected runtime Bag');
                            const field = document.getElementById(`${id}-validated`);
                            field.control.value = 'rejected';
                            field.control.dispatchEvent(new Event('input', {bubbles:true}));
                            field.control.dispatchEvent(new Event('change', {bubbles:true}));
                            await new Promise(resolve => setTimeout(resolve, 0));
                            if (app.data.getItem('validated') !== 'accepted' || field.message.textContent !== 'Denied') throw new Error('Bundled validator ignored Bag error');
                            const drawer = document.getElementById(`${id}-border`).shadowRoot.querySelector('.separator[data-side=right] .drawer');
                            if (drawer.querySelector('b')?.textContent !== 'Code' || drawer.querySelector('[onerror]') || window.drawerAttack) throw new Error('Drawer HTML was not sanitized');
                            if (app.state !== 'started') throw new Error('Source did not start');
                            if (node.$gramlotRef !== dom.$gramlotRef) throw new Error('Reference is not stable');
                            if (app.dom.reference(dom) !== document.getElementById(`${id}-pane`)) throw new Error('DOM reference failed');
                            if (app.dom.reference(node) !== app.dom.getBaseSourceNode(app.dom.reference(dom))) throw new Error('Source reference failed');
                            references.push(node.$gramlotRef);
                            document.getElementById(`${id}-ask`).click();
                            const dialog = document.querySelector('dialog');
                            if (!dialog?.open) throw new Error('Ask dialog did not open');
                            dialog.querySelector('button[type=submit]').click();
                            await new Promise(resolve => setTimeout(resolve, 0));
                            if (app.data.getItem('confirmed') !== true || document.querySelector('dialog')) throw new Error('Ask did not confirm and clean up');
                        }
                        apps[0].data.setItem('text', 'changed');
                        return {
                            references,
                            values: ['one', 'two'].map(id => document.getElementById(`${id}-input`).value),
                            radioNames: ['one', 'two'].map(id => document.getElementById(`${id}-radio`).name),
                            instanceIds: apps.map(app => app.src.renderer.instanceId),
                        };
                    } finally {
                        for (const app of apps) app.dispose();
                    }
                }, artifact);
                assert.deepEqual(result.values, ['changed', 'initial']);
                assert.equal(new Set(result.references).size, 2);
                assert.equal(new Set(result.instanceIds).size, 2);
                assert.ok(result.radioNames.every(Boolean));
                assert.equal(new Set(result.radioNames).size, 2);
                console.log(`PASS ${host} ${artifact}: mount, Data, references, page isolation, bundled Bag stores/validation, sanitized drawers`);
            } catch (error) {
                failures.push(new Error(`${host} ${artifact}: ${error.message}`, {cause: error}));
            } finally {
                await page.close();
            }
        }
    }
    if (failures.length) throw new AggregateError(failures, `${failures.length} runtime-origin checks failed`);
    console.log(`Chromium ${browser.version()}: 8 runtime-origin checks passed; HTTPS not exercised.`);
} finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
}
