/** Tree integration on real DOM engines, including offline execution from file. */
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';

const playwright = await import(pathToFileURL(process.argv[2]));
const root = fileURLToPath(new URL('../', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'gramlot-tree-check-'));
const output = await build({stdin: {resolveDir: root, contents: `
import {Gramlot, GramlotBuilder, TreeStoreLogic, TreeStoreResolver} from './js/src/index.js';
import {Bag} from './js/node_modules/@genrojs/bag/src/index.js';
import tree from './js/src/components/tree.js';
window.app = new Gramlot({document, transport:false, collections:[tree]});
app.src.logicRegistry.register(TreeStoreLogic,{resource:'test:tree'});
window.requests=[];
app.rpc.call=async (_kind,_method,{path})=>{
 requests.push(path); await new Promise(resolve=>setTimeout(resolve,10));
 const bag=new Bag();
 if(!path) bag.setItem('folder',new TreeStoreResolver(),{caption:'Folder',badge:'R'});
 else bag.setItem('leaf',null,{caption:'Name',fieldpath:'name',diagnostic:'^secret'});
 return bag;
};
app.data.setItem('model',new Bag({store:new Bag(),selection:null,checked:null}));
app.data.setItem('secret','private data');
const b=new GramlotBuilder(null,{collections:[tree]});
const pane=b.root.div({datapath:'model',node_label:'pane'});
pane.dataController({func:'treeStoreMount',storeMethod:'children',storeParams:{},_onBuilt:true});
const t=pane.tree({id:'tree',storepath:'.store',hideValues:true,labelAttribute:'caption',
 selectedPath:'^.selection',checkedPaths:'^.checked'});
t.rowActions({position:'end'}).button({id:'inspect',title:'Inspect','aria-label':'Inspect',icon:'i'}).dataController({func:'treeInspect'});
app.src.startSource(b.toTytx());
`}, bundle:true,write:false,format:'iife',platform:'browser'});
await writeFile(join(directory,'index.html'), '<!doctype html><title>Tree integration</title><main id="gramlot-root"></main><script>'+output.outputFiles[0].text.replaceAll('</script','<\\/script')+'</script>');
try {
 for(const engine of ['chromium','webkit']) {
  const browser=await playwright[engine].launch({headless:true});
  try {
   const page=await browser.newPage(); const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   const requests=[];page.on('request',request=>requests.push(request.url()));
   await page.goto(pathToFileURL(join(directory,'index.html')).href);
   await page.locator('#tree [data-path="folder"]').waitFor();
   await page.evaluate(()=>app.data.setItem('model.selection','folder.leaf'));
   const leaf=page.locator('#tree [data-path="folder.leaf"]');
   await leaf.waitFor();
   await leaf.focus();await page.keyboard.press(' ');
   await page.waitForFunction(()=>app.data.getItem('model.checked')==='folder.leaf');
   await leaf.hover();
   await page.getByRole('button',{name:'Inspect',exact:true}).click();
   const dialog=page.getByRole('dialog');await dialog.waitFor();
   assert.match(await dialog.textContent(),/\^secret/);
   assert.doesNotMatch(await dialog.textContent(),/private data/);
   await dialog.getByRole('button',{name:'Close',exact:true}).click();
   await dialog.waitFor({state:'detached'});
   assert.deepEqual(await page.evaluate(()=>window.requests),['','folder']);
   await page.evaluate(()=>app.src.source.popNode('main'));
   assert.equal(await page.locator('#tree').count(),0);
   assert.deepEqual(errors,[]);
   assert(requests.every(url=>url.startsWith('file:')));
   console.log(engine+': lazy selection, checks, row actions, literal inspector, cleanup and file execution passed');
  } finally {await browser.close();}
 }
} finally {await rm(directory,{recursive:true,force:true});}
