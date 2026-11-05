/** Optional-library qualification; dependencies are supplied outside the Gramlot package. */
import {createServer} from 'node:http';
import {readFile,readdir,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import './chart-trial-build.mjs';
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const dependencies=process.env.VIZABI_NODE_MODULES;
if(!dependencies)throw new Error('Set VIZABI_NODE_MODULES to the optional test installation');
const output='/tmp/gramlot-vizabi-visible';await mkdir(output,{recursive:true});
const vendorFiles={
 'd3.js':`${dependencies}/d3/dist/d3.min.js`,
 'mobx.js':`${dependencies}/mobx/lib/mobx.umd.min.js`,
 'deck.js':process.env.VIZABI_DECK_BUNDLE,
 'Vizabi.js':`${dependencies}/@vizabi/core/dist/Vizabi.js`,
 'shared.js':`${dependencies}/@vizabi/shared-components/build/VizabiSharedComponents.js`,
 'bubblechart.js':`${dependencies}/@vizabi/bubblechart/build/bubblechart.js`
};
if(!vendorFiles['deck.js'])throw new Error('Set VIZABI_DECK_BUNDLE to the official deck.gl browser bundle');
const sharedStyle=await readFile(`${dependencies}/@vizabi/shared-components/build/VizabiSharedComponents.css`,'utf8');
const style=sharedStyle+await readFile(`${dependencies}/@vizabi/bubblechart/build/bubblechart.css`,'utf8');
const locale=JSON.parse(await readFile(`${dependencies}/@vizabi/shared-components/build/assets/locale/en.json`,'utf8'));
const library=Object.keys(vendorFiles).map(name=>`await import('/optional/${name}');`).join('\n')+`\nconst {Vizabi,mobx}=globalThis;const BubbleChart=globalThis.BubbleChart.Base;const style=${JSON.stringify(style)},locale=${JSON.stringify(locale)};export {Vizabi,BubbleChart,mobx,style,locale};`;
const wire=execFileSync(`${repo}/.venv/bin/python`,['tests/fixtures/components/vizabi_trial.py'],{cwd:repo,encoding:'utf8'}).trim();
const bootstrap=`import {Gramlot} from '@gramlot/gramlot';import inputs from '/collections/inputs/index.js';import layout from '/collections/layout/index.js';import vizabi from '/collections/vizabi/index.js';const app=new Gramlot({element:document.getElementById('app'),transport:false,collections:[inputs,layout,vizabi]});app.src.startSource(${JSON.stringify(wire)});window.qualification=app;`;
const assets=new Map([['/runtime.js',bootstrap],['/core.js',await readFile('/private/tmp/gramlot-chart-visible/core.js')],['/optional/vizabi.js',library]]);
for(const [name,path] of Object.entries(vendorFiles))assets.set(`/optional/${name}`,await readFile(path));
for(const name of ['inputs','layout','tree','vizabi'])for(const file of await readdir(`${repo}/src/gramlot/collections/${name}/assets`,{recursive:true}))if(file.endsWith('.js'))assets.set(`/collections/${name}/${file}`,await readFile(`${repo}/src/gramlot/collections/${name}/assets/${file}`));
const css=await readFile(`${repo}/themes/gramlot-base/theme.css`);
const server=createServer((req,res)=>{
 const path=new URL(req.url,'http://localhost').pathname;
 if(assets.has(path)){res.setHeader('Content-Type','text/javascript');res.end(assets.get(path));}
 else if(path==='/base.css'){res.setHeader('Content-Type','text/css');res.end(css);}
 else if(path==='/'){res.setHeader('Content-Type','text/html');res.end(`<!doctype html><html><head><meta charset="utf-8"><script type="importmap">{"imports":{"@gramlot/gramlot":"/core.js","@gramlot/gramlot/components":"/core.js","@gramlot/collections/tree":"/collections/tree/index.js","@gramlot/collections/inputs":"/collections/inputs/index.js"}}</script><link rel="stylesheet" href="/base.css"></head><body><div id="app"></div><script type="module" src="/runtime.js"></script></body></html>`);}
 else{res.statusCode=404;res.end();}
});
await new Promise(resolve=>server.listen(process.argv.includes('--serve')?8897:0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}/`;
if(process.argv.includes('--serve')){console.log(url);await new Promise(()=>{});}
try {
 for(const [name,engine] of Object.entries({chromium,webkit})){
  const browser=await engine.launch();
  try{
   const page=await browser.newPage({viewport:{width:1250,height:900}}),errors=[];
   page.on('pageerror',e=>{errors.push(e.message);console.log(e.stack);});
   page.on('console',m=>{if(m.type()==='error'){errors.push(m.text());console.log(m.text());}});
   await page.goto(url);
   const bubble=page.locator('#bubble');
   await bubble.locator('.vzb-bubblechart-canvas-wrap canvas').first().waitFor({timeout:15000});
   await page.waitForTimeout(500);
   assert.equal(await bubble.getByRole('alert').count(),0);
   const points=async()=>(await bubble.screenshot()).toString('base64');
   const before=await points();
   await page.getByRole('button',{name:'Play / Pause',exact:true}).click();
   await page.waitForFunction(()=>window.qualification.data.getItem('demo.config.year')>2015);
   assert.notEqual(await points(),before);
   await page.getByRole('button',{name:'Play / Pause',exact:true}).click();
   const year=await page.evaluate(()=>window.qualification.data.getItem('demo.config.year'));
   await page.waitForTimeout(650);
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('demo.config.year')),year);
   await page.evaluate(()=>window.qualification.data.setItem('demo.config.xField','units'));
   await page.waitForTimeout(600);
   assert.equal(await bubble.getByRole('alert').count(),0);
   await page.setViewportSize({width:1000,height:850});
   await page.screenshot({path:`${output}/${name}.png`});
   assert.equal(await page.evaluate(()=>typeof window.qualification.data.getItem('demo.rows').getNodes()[0].getAttr('year')),'number');
   await page.evaluate(()=>window.qualification.data.setItem('demo.config.playing',true));
   await page.waitForTimeout(600);
   assert.deepEqual(errors,[]);
   console.log(`${name}: optional loading, rendering, playback, Bag synchronization, field changes and resize passed`);
   await page.evaluate(()=>{const node=window.qualification.src.binding.nodeIds.get('bubble');node.parentBag.popNode(node.label);});
   const stopped=await page.evaluate(()=>window.qualification.data.getItem('demo.config.year'));
   await page.waitForTimeout(650);
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('demo.config.year')),stopped);
   assert.equal(await page.evaluate(()=>globalThis.Vizabi.stores.markers.getAll().length),0);
   assert.equal(await page.evaluate(()=>globalThis.Vizabi.stores.dataSources.getAll().length),0);
   if(errors.length){console.error(`${name}: upstream disposal failure`,errors);process.exitCode=1;}
   else console.log(`${name}: no disposal errors observed`);
  }finally{await browser.close();}
 }
}finally{await new Promise(resolve=>server.close(resolve));}
