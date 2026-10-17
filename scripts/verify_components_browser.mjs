/** Python Source + selected JS collection, tested with actual native controls in browser engines. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';

const [python, playwrightEntry, ...engines] = process.argv.slice(2);
if (!playwrightEntry) throw new Error('Usage: node scripts/verify_components_browser.mjs PYTHON PLAYWRIGHT_ENTRY [ENGINE ...]');
const root = fileURLToPath(new URL('../', import.meta.url));
const playwright = await import(pathToFileURL(playwrightEntry));
const wire = execFileSync(python, ['tests/fixtures/components/inputs.py'], {cwd:root, encoding:'utf8'}).trim();
const bundle = await build({stdin:{contents:`
import {Gramlot} from './js/src/index.js';
import inputs from './js/src/components/inputs.js';
window.gramlot = new Gramlot({document, transport:false, collections:[inputs]});
window.gramlot.src.startSource(${JSON.stringify(wire)});
`, resolveDir:root}, bundle:true, write:false, format:'esm', platform:'browser', target:'es2022'});
const server = createServer((request,response) => {
    if (request.url === '/fixture.js') {
        response.writeHead(200, {'Content-Type':'text/javascript'});
        response.end(bundle.outputFiles[0].text);
    } else {
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end('<!doctype html><title>Component qualification</title><main id="gramlot-root"></main><script type="module" src="/fixture.js"></script>');
    }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
    for (const engine of engines.length ? engines : ['chromium','webkit']) {
        browser = await playwright[engine].launch({headless:true});
        const page = await browser.newPage({viewport:{width:1000,height:760}});
        const errors=[]; page.on('pageerror', error=>errors.push(String(error)));
        await page.goto(`http://127.0.0.1:${server.address().port}`);
        await page.waitForFunction(()=>window.gramlot?.state === 'started');
        const customer=page.locator('#customer input');
        assert.equal(await customer.inputValue(),'Ada');
        await page.locator('#customer #field-label').click();
        assert.equal(await customer.evaluate(el=>el.getRootNode().activeElement === el),true);
        await customer.fill('Grace');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.customer')),'Grace');
        await customer.evaluate(el=>el.setSelectionRange(1,3));
        await page.evaluate(()=>gramlot.data.setItem('position','R'));
        assert.deepEqual(await customer.evaluate(el=>({focus:el.getRootNode().activeElement===el,start:el.selectionStart,end:el.selectionEnd})),
            {focus:true,start:1,end:3});
        await page.locator('#newsletter input').check();
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.newsletter')),true);
        await page.locator('#shipping input[value="standard"]').focus();
        await page.keyboard.press('ArrowRight');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.shipping')),'express');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.alternative')),'pickup');
        assert.equal(await page.locator('#shipping input:checked').count(),1);
        await page.locator('#alternative input[value="standard"]').check();
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.shipping')),'express');
        await page.evaluate(()=>gramlot.data.setItem('readonly',true));
        assert.equal(await customer.evaluate(el=>el.readOnly),true);
        await page.screenshot({path:`/tmp/gramlot-components-${engine}.png`});
        await page.evaluate(()=>gramlot.dispose());
        assert.equal(await page.locator('#gramlot-root > *').count(),0);
        assert.deepEqual(errors,[]);
        await browser.close(); browser=null;
        console.log(`${engine}: PASS — Python Source, typing, labels/focus/caret, checkbox, native radio keyboard/group isolation, readonly, cleanup.`);
    }
} finally {await browser?.close(); await new Promise(resolve=>server.close(resolve));}
