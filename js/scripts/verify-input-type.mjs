/** Real native-input regression; requires Playwright in the test environment. */
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {build} from 'esbuild';
const browsers=createRequire(import.meta.url)('playwright');
const engine=process.argv[2]??'chromium';
if(!['chromium','webkit'].includes(engine))throw Error('Expected chromium or webkit');
const bundle=await build({entryPoints:[new URL('../tests/fixtures/live/input-type.js',import.meta.url).pathname],bundle:true,write:false,format:'iife',loader:{'.css':'text'}});
const server=createServer((req,res)=>{
    res.setHeader('Content-Type',req.url==='/app.js'?'text/javascript':'text/html');
    res.end(req.url==='/app.js'?bundle.outputFiles[0].text:'<!doctype html><main id="gramlot-root"></main><script src="/app.js"></script>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
    browser=await browsers[engine].launch({headless:true});
    const page=await browser.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.stack));
    await page.exposeFunction('typeDraft',()=>page.locator('#field').fill('draft'));
    await page.exposeFunction('chooseFile',()=>page.locator('#files').setInputFiles({name:'sample.txt',mimeType:'text/plain',buffer:Buffer.from('sample')}));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    console.log(`${engine}: ${await page.evaluate(()=>window.exerciseInputType())}`);
    if(errors.length)throw Error(errors.join('\n'));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
