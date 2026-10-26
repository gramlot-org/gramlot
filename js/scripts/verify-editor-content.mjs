/** Browser regression against real engines. Requires Playwright in the test environment.
 * Run: node scripts/verify-editor-content.mjs [chromium|webkit]
 * NODE_PATH may identify an existing Playwright installation; no gallery/host fixtures are used.
 */
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {build} from 'esbuild';
const require=createRequire(import.meta.url);
const browsers=require('playwright');
const engine=process.argv[2]??'chromium';
if(!['chromium','webkit'].includes(engine))throw new Error('Expected chromium or webkit');
const bundle=await build({entryPoints:[new URL('../tests/fixtures/live/editor-content.js',import.meta.url).pathname],bundle:true,write:false,format:'iife',loader:{'.css':'text'}});
const server=createServer((req,res)=>{
    res.setHeader('Content-Type',req.url==='/app.js'?'text/javascript':'text/html');
    res.end(req.url==='/app.js'?bundle.outputFiles[0].text:'<!doctype html><main id="gramlot-root"></main><script src="/app.js"></script>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
    browser=await browsers[engine].launch({headless:true});
    const page=await browser.newPage();const errors=[];
    page.on('pageerror',error=>errors.push(error.stack));
    page.on('console',message=>{if(message.type()==='error')console.error(message.text());});
    await page.exposeFunction('focusHtml',()=>page.locator('#html iframe').contentFrame().locator('body').click());
    await page.exposeFunction('typeIntoHtml',()=>page.keyboard.type('Typed',{delay:30}));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    console.log(`${engine}: ${await page.evaluate(()=>window.exerciseEditors())}`);
    if(errors.length)throw new Error(errors.join('\n'));
} finally {if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
