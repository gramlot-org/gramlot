import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=process.cwd();
const require=createRequire(`${root}/js/package.json`);
const {build}=await import(require.resolve('esbuild'));
const {chromium}=await import(`${root}/tools/gramlot-tools-inspector/node_modules/playwright/index.mjs`);
const oldFormat=execFileSync('git',['show','3b6a0f49d4e1d4e2ec669464f672588bd4c9a930:js/src/format.js'],{cwd:root,encoding:'utf8'});
const assets=new Map();
for(const variant of ['before','after']) {
 const out=await build({absWorkingDir:`${root}/js`,stdin:{contents:`export {Bag} from '@genrojs/bag'; export {createDecimal} from '@genrojs/tytx'; export {BagCollectionStore} from './src/stores/bag-collection-store.js'; export {BagCollectionView} from './src/stores/bag-collection-view.js';`,resolveDir:`${root}/js`},bundle:true,format:'esm',write:false,
 plugins:variant==='before'?[{name:'baseline-formatter',setup(build){build.onLoad({filter:/\/src\/format\.js$/},()=>({contents:oldFormat,loader:'js',resolveDir:`${root}/js/src`}));}}]:[]});
 assets.set(`/${variant}.js`,out.outputFiles[0].text);
}
const server=createServer((req,res)=>{
 res.setHeader('Content-Type',assets.has(req.url)?'text/javascript':'text/html');
 res.end(assets.get(req.url)??'<!doctype html><title>Grid search benchmark</title>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch();
const results={rows:100000,source:'deterministic synthetic invoice-shaped rows',engine:'Chromium',variants:{}};
try {
 for(const variant of ['before','after']) {
  const page=await browser.newPage();await page.goto(`http://127.0.0.1:${server.address().port}/`);
  results.variants[variant]=await page.evaluate(async variant=>{
   const {Bag,createDecimal,BagCollectionStore,BagCollectionView}=await import(`/${variant}.js`);
   const data=new Bag(),rows=new Bag();
   for(let i=0;i<100000;i++) rows.setItem(`r${i}`,null,{customer:i%173===0?'Parks':`Customer ${i%3200}`,state:['NY','CA','TX'][i%3],invoice:i%60179,date:new Date(Date.UTC(2026,i%12,i%28+1)),product:`Product ${i%1695}`,quantity:i%50+1,price:createDecimal(`${i%400}.${String(i%100).padStart(2,'0')}`),total:(i%50+1)*12.5});
   data.setItem('rows',rows);data.setBackref();
   const view=new BagCollectionView(new BagCollectionStore(rows,'attributes'));
   const columns=['customer','state','invoice','date','product','quantity','price','total'];
   const samples=[];
   for(let i=0;i<3;i++) {
    const start=performance.now();view.applyFilter({value:'Parks',columns,dtype:'T',locale:'en-GB',timeZone:'Europe/Rome'});
    const ms=performance.now()-start;
    samples.push({ms,labels:view.getRows().map(node=>node.label)});view.applyFilter(null);
   }
   return samples;
  },variant);
  await page.close();
 }
 for(const variant of ['before','after'])for(const sample of results.variants[variant])assert.deepEqual(sample.labels,results.variants.before[0].labels);
 results.identicalRows=true;
 for(const samples of Object.values(results.variants)) for(const sample of samples){sample.matches=sample.labels.length;delete sample.labels;}
 await writeFile('/private/tmp/grid-search-browser-comparison.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
} finally {await browser.close();server.close();}
