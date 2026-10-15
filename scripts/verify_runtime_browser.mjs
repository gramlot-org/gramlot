/** Verify the shipped runtimes on localhost and an ordinary HTTP origin in Chromium. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

const [playwrightPath, executablePath] = process.argv.slice(2);
if (!playwrightPath) throw new Error('Usage: node scripts/verify_runtime_browser.mjs PLAYWRIGHT_ENTRY [EXECUTABLE]');
const {chromium} = await import(pathToFileURL(playwrightPath));
const artifacts = new Map();
for (const folder of ['js/dist', 'src/gramlot/resources']) {
    for (const name of ['gramlot.js', 'gramlot.min.js']) {
        const path = `${folder}/${name}`;
        artifacts.set(`/${path}`, await readFile(new URL(`../${path}`, import.meta.url)));
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
        for (const artifact of artifacts.keys()) {
            const page = await browser.newPage();
            try {
                await page.goto(`http://${host}:${server.address().port}/`);
                const context = await page.evaluate(() => ({secure: isSecureContext, uuid: typeof crypto.randomUUID}));
                assert.equal(context.secure, host === '127.0.0.1');
                assert.equal(context.uuid, host === '127.0.0.1' ? 'function' : 'undefined');
                const result = await page.evaluate(async artifact => {
                    const {Gramlot, GramlotBuilder} = await import(artifact);
                    const apps = [];
                    const references = [];
                    try {
                        for (const id of ['one', 'two']) {
                            const app = new Gramlot({rootId: id, transport: false});
                            apps.push(app);
                            const builder = new GramlotBuilder();
                            const pane = builder.root.div('ready', {id: `${id}-pane`});
                            const node = builder.reference(pane);
                            const dom = builder.reference(pane, 'dom');
                            builder.root.input({id: `${id}-input`, value: '^text'});
                            builder.root.input({id: `${id}-radio`, type: 'radio', group: 'choice', value: '^chosen'});
                            builder.root.button('Confirm', {id: `${id}-ask`, action: "this.SET('confirmed', true);", ask: 'Continue?'});
                            app.data.setItem('text', 'initial');
                            app.src.startSource(builder.toTytx());
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
                console.log(`PASS ${host} ${artifact}: mount, Data, references, page isolation`);
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
