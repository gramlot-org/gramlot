/** Native range quantization must converge through real Source/Data bindings. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';
const [python, entry, ...engines] = process.argv.slice(2);
const playwright = await import(pathToFileURL(entry));
const root = fileURLToPath(new URL('../', import.meta.url));
const wire = execFileSync(python, ['tests/fixtures/components/slider_quantization.py'], {cwd:root, encoding:'utf8'}).trim();
const bundle = await build({stdin:{resolveDir:root, contents:`
import {Gramlot} from './js/src/index.js';
import inputs from './js/src/components/inputs.js';
import layout from './js/src/components/layout.js';
window.gramlot=new Gramlot({document,transport:false,collections:[inputs,layout]});
window.writes=[];gramlot.data.subscribe('probe',{any:e=>{writes.push(e.pathlist.join('.'));if(writes.length>200)throw new Error('Non-converging slider writes');}});
gramlot.src.startSource(${JSON.stringify(wire)});
`}, bundle:true,write:false,format:'esm',platform:'browser',target:'es2022'});
const server=createServer((req,res)=>{
    res.setHeader('Content-Type',req.url==='/app.js'?'text/javascript':'text/html');
    res.end(req.url==='/app.js'?bundle.outputFiles[0].text:'<!doctype html><main id="gramlot-root"></main><script type="module" src="/app.js"></script>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
 for(const engine of engines.length?engines:['chromium','webkit']) {
  const browser=await playwright[engine].launch({headless:true, executablePath:process.env[engine.toUpperCase()]});
  try {
   const page=await browser.newPage({viewport:{width:1000,height:800}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`http://127.0.0.1:${server.address().port}`);
   await page.waitForFunction(()=>gramlot.state==='started');
   const state=()=>page.evaluate(()=>({value:gramlot.data.getItem('size'),h:document.querySelector('#horizontalSlider').control.valueAsNumber,v:document.querySelector('#verticalSlider').control.valueAsNumber,region:document.querySelector('#border').control.style.getPropertyValue('--left'),label:document.querySelector('#size-label').textContent}));
   const expectSize=async value=>assert.deepEqual(await state(),{value,h:value,v:value,region:value+'px',label:String(value)});
   await expectSize(177);
   assert.equal(await page.evaluate(()=>gramlot.data.getItem('fraction')),-0.2);
   assert.equal(await page.evaluate(()=>gramlot.data.getItem('readonly')),176.73);
   await page.evaluate(()=>{writes.length=0;gramlot.data.setItem('size',176.73);});
   await expectSize(177);
   assert.equal(await page.evaluate(()=>writes.filter(p=>p==='size').length),2,'one external write and one correction');
   await page.evaluate(()=>{writes.length=0;gramlot.data.setItem('size',177);});
   assert.equal(await page.evaluate(()=>writes.filter(p=>p==='size').length),0,'no correction of aligned Data');
   await page.evaluate(()=>{writes.length=0;gramlot.data.setItem('step',5);});
   await expectSize(175);
   assert.equal(await page.evaluate(()=>writes.filter(p=>p==='size').length),1,'one correction for a reactive step change');
   await page.evaluate(()=>gramlot.data.setItem('maximum',172));await expectSize(170);
   await page.evaluate(()=>{gramlot.data.setItem('maximum',300);gramlot.data.setItem('step',1);});
   await page.locator('#customer input').fill('Retained draft');
   const separator=page.locator('#border .separator[data-side=left]').first(),box=await separator.boundingBox();
   await page.evaluate(()=>{writes.length=0;});
   await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
   await page.mouse.move(box.x+box.width/2+20.73,box.y+box.height/2,{steps:4});
   const current=(await state()).value;assert(Number.isInteger(current));assert(current>170);await expectSize(current);
   assert((await page.evaluate(()=>writes.length))<20,'drag corrections settle without a notification loop');
   await page.mouse.up();assert.equal(await page.locator('#customer input').inputValue(),'Retained draft');
   await page.locator('#horizontalSlider input').focus();await page.keyboard.press('ArrowRight');await expectSize(current+1);
   await page.evaluate(()=>gramlot.dispose());assert.deepEqual(errors,[]);
   console.log(`${engine}: PASS initial/external values, fractional steps, reactive constraints, equal-write suppression, shared sliders, live splitter and cleanup`);
  } finally {await browser.close();}
 }
} finally {await new Promise(resolve=>server.close(resolve));}
