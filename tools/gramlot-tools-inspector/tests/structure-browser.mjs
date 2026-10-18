/** Source editing through the real inspector, including native branch dragging. */
import assert from 'node:assert/strict';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {chromium, webkit} from 'playwright';
const fixture = `
import {Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import inputs from '@gramlot/gramlot/components/inputs';
import layout from '@gramlot/gramlot/components/layout';
import {attachInspectorAgent, InspectorConnection} from '../src/gramlot-tools-inspector.js';
const app = new Gramlot({element:document.getElementById('app'),transport:false,collections:[inputs,layout]});
const b = new GramlotBuilder(null,{collections:[inputs,layout]});
const left=b.root.div({node_label:'left'});left.p('^name',{node_label:'text'});left.input({value:'^name',node_label:'input'});
b.root.div('Prefix',{node_label:'right'});app.data.setItem('name','Ada');app.src.startSource(b.source);
const inspector=document.createElement('gramlot-tools-inspector');
if(location.search==='?remote'){
 const channel=new MessageChannel();attachInspectorAgent(app,channel.port1);
 inspector.targets=[{id:'page',title:'Connected page',connection:new InspectorConnection(channel.port2)}];
}else inspector.gramlot=app;
document.body.append(inspector);window.app=app;window.inspector=inspector;`;
const output=await build({stdin:{contents:fixture,resolveDir:fileURLToPath(new URL('./',import.meta.url)),sourcefile:'structure-fixture.js'},
 bundle:true,format:'esm',platform:'browser',target:'es2022',write:false,loader:{'.css':'text'},alias:{'@gramlot/gramlot':fileURLToPath(new URL('../../../js/src/index.js',import.meta.url)), '@gramlot/gramlot/components/inputs':fileURLToPath(new URL('../../../js/src/components/inputs.js',import.meta.url)), '@gramlot/gramlot/components/layout':fileURLToPath(new URL('../../../js/src/components/layout.js',import.meta.url))}});
const server=createServer((request,response)=>{
 response.setHeader('Content-Type',request.url==='/fixture.js'?'text/javascript':'text/html');
 response.end(request.url==='/fixture.js'?output.outputFiles[0].text:'<!doctype html><meta charset="utf-8"><title>Inspector Source editing</title><main id="app" style="margin-left:530px"></main><script type="module" src="/fixture.js"></script>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
 for(const engine of [chromium,webkit]){
  const browser=await engine.launch({headless:true});
  try {for(const remote of [false,true]){
   const page=await browser.newPage({viewport:{width:1250,height:950}}),errors=[];
   page.setDefaultTimeout(7000);page.on('pageerror',e=>{errors.push(e.message);console.error(e.message)});
   await page.goto(`http://127.0.0.1:${server.address().port}/${remote?'?remote':''}`);
   const palette=page.locator('gramlot-tools-inspector'), tree=palette.locator('gramlot-poc-tree[data-root=source]');
   const row=path=>tree.locator(`[data-node-path="${path}"]`);
   const undo=palette.getByRole('button',{name:'↶ Undo',exact:true}),redo=palette.getByRole('button',{name:'↷ Redo',exact:true});
   await palette.getByRole('tab',{name:'Source',exact:true}).click();
   await row('main').click();await row('main.left').click();
   assert.equal(await row('main').getByRole('button',{name:'Remove branch',exact:true}).count(),0);
   assert.equal(await row('main').getAttribute('draggable'),'false');
   assert.equal(await row('main.left.text').getAttribute('draggable'),'true');
   // Source attribute + undo/redo retain the original Data pointer.
   await row('main.left.text').click();await palette.getByRole('button',{name:'Add attribute',exact:true}).click();
   await palette.getByLabel('New attribute name',{exact:true}).fill('style');
   await palette.getByLabel('New attribute value',{exact:true}).fill('color: crimson');
   await palette.getByLabel('New attribute value',{exact:true}).press('Enter');
   await page.waitForFunction(()=>app.src.renderer.destination.querySelector('p').style.color==='crimson');
   await undo.click();await page.waitForFunction(()=>!app.src.renderer.destination.querySelector('p').style.color);
   await redo.click();await page.waitForFunction(()=>app.src.renderer.destination.querySelector('p').style.color==='crimson');
   // Keyboard history outside text inputs uses the same journal.
   await row('main.left.text').focus();await page.keyboard.press('Control+z');
   await page.waitForFunction(()=>!app.src.renderer.destination.querySelector('p').style.color);
   await page.keyboard.press('Control+Shift+z');
   await page.waitForFunction(()=>app.src.renderer.destination.querySelector('p').style.color==='crimson');
   // Add actual HTML, installed widget and installed container through the same dialog.
   const add=async(kind,tag)=>{
    await row('main.right').hover();await row('main.right').getByRole('button',{name:'Add child element',exact:true}).click();
    const dialog=palette.getByRole('dialog',{name:'Add Source element',exact:true});
    if(kind==='component'){
     await dialog.getByLabel('Element kind',{exact:true}).selectOption('component');
     await dialog.getByLabel('Widget or container',{exact:true}).selectOption(tag);
    }else await dialog.getByLabel('HTML tag',{exact:true}).fill(tag);
    await dialog.getByRole('button',{name:'Add',exact:true}).click();await dialog.waitFor({state:'hidden'});
   };
   await row('main.right').hover();await row('main.right').getByRole('button',{name:'Add child element',exact:true}).click();
   const invalid=palette.getByRole('dialog',{name:'Add Source element',exact:true});
   await invalid.getByLabel('HTML tag',{exact:true}).fill('inventedWidget');
   await invalid.getByRole('button',{name:'Add',exact:true}).click();
   await invalid.getByRole('status').filter({hasText:'Choose an available'}).waitFor();
   await invalid.getByRole('button',{name:'Cancel',exact:true}).click();
   assert.equal(await page.evaluate(()=>app.src.source.getItem('main.right')),'Prefix');
   await add('html','span');await row('main.right.span_0').waitFor();
   assert.equal(await page.evaluate(()=>app.src.source.getNode('main.right').getAttr('_text')),'Prefix');
   await undo.click();await page.waitForFunction(()=>app.src.source.getItem('main.right')==='Prefix');
   await redo.click();await row('main.right.span_0').waitFor();
   await add('component','checkbox');await page.locator('#app gramlot-checkbox').waitFor();
   await add('component','formlet');await page.locator('#app gramlot-formlet').waitFor({state:'attached'});
   if(engine===chromium && !remote) {
    await row('main.right').hover();
    await page.screenshot({path:join(tmpdir(), 'gramlot-inspector-source-editing.png')});
   }
   // Container child constraints are collected before a Source mutation, locally and over MessagePort.
   await add('component', 'borderContainer');
   const borderPath = 'main.right.borderContainer_0';
   await row(borderPath).hover();
   await row(borderPath).getByRole('button', {name: 'Add child element', exact: true}).click();
   const regionDialog = palette.getByRole('dialog', {name: 'Add Source element', exact: true});
   await regionDialog.getByLabel('Element kind', {exact: true}).selectOption('component');
   await regionDialog.getByLabel('Widget or container', {exact: true}).selectOption('contentPane');
   await regionDialog.getByRole('button', {name: 'Add', exact: true}).click();
   await regionDialog.getByRole('status').filter({hasText: 'region'}).waitFor();
   assert.equal(await page.evaluate(path => app.src.source.getNode(path).value, borderPath), null);
   await regionDialog.getByLabel('region', {exact: true}).selectOption('center');
   await regionDialog.getByRole('button', {name: 'Add', exact: true}).click();
   await regionDialog.waitFor({state: 'hidden'});
   assert.equal(await page.evaluate(path => app.src.source.getNode(path).value.getNodes()[0].getAttr('region'), borderPath), 'center');
   await undo.click();
   await redo.click();
   // Actual native DnD: move a bound text into another parent and back, then reorder.
   await row('main.left.text').dragTo(row('main.right'));
   await page.waitForFunction(()=>!!app.src.source.getNode('main.right.text'));
   await undo.click();await page.waitForFunction(()=>!!app.src.source.getNode('main.left.text'));
   await redo.click();await page.waitForFunction(()=>!!app.src.source.getNode('main.right.text'));
   await undo.click();await page.waitForFunction(()=>!!app.src.source.getNode('main.left.text'));
   const box=await row('main.left.input').boundingBox();
   await row('main.left.text').dragTo(row('main.left.input'),{targetPosition:{x:box.width/2,y:box.height-2}});
   await page.waitForFunction(()=>app.src.source.getItem('main.left').getNodes()[0].label==='input');
   await undo.click();await page.waitForFunction(()=>app.src.source.getItem('main.left').getNodes()[0].label==='text');
   // Remove an entire branch; undo restores both nodes and two-way binding.
   await row('main.left').hover();await row('main.left').getByRole('button',{name:'Remove branch',exact:true}).click();
   await page.waitForFunction(()=>!app.src.source.getNode('main.left'));
   await undo.click();await page.waitForFunction(()=>!!app.src.source.getNode('main.left.input'));
   await page.locator('#app input').first().fill('Grace');await page.locator('#app input').first().press('Tab');
   await page.waitForFunction(()=>app.data.getItem('name')==='Grace');
   assert.equal(await page.locator('#app p').textContent(),'Grace');
   // New writes discard redo; external edits cannot be overwritten by history.
   await redo.click();await page.waitForFunction(()=>!app.src.source.getNode('main.left'));
   await page.evaluate(()=>app.src.source.getNode('main.right').setAttr({title:'External'}));
   await undo.click();await palette.locator('.history-toolbar [role=status]').filter({hasText:'outside the inspector'}).waitFor();
   assert.equal(await page.evaluate(()=>app.src.source.getNode('main.right').getAttr('title')),'External');
   assert.deepEqual(errors,[]);
   console.log(engine.name()+' / '+(remote?'bridge':'local')+': PASS — add HTML/widget/container, attributes, native drag/reorder, delete subtree, undo/redo, live binding and conflict guard');
   await page.close();
  }} finally {await browser.close();}
 }
} finally {await new Promise(resolve=>server.close(resolve));}
