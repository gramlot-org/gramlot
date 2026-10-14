/** Actual cross-realm ports: the child has an opaque origin, like file previews. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {chromium, webkit} from 'playwright';
const require = createRequire(import.meta.url);
const core = await build({entryPoints:[require.resolve('@gramlot/gramlot')],bundle:true,format:'esm',platform:'browser',target:'es2022',write:false});
const bootstrap = `import {Gramlot,GramlotBuilder} from '/core.js';
import {InspectorConnection,attachInspectorAgent} from '/inspector.js';
const app=new Gramlot({element:document.querySelector('main'),transport:false});
const builder=new GramlotBuilder(); builder.root.p('^name',{node_label:'greeting'});
app.data.setItem('name',location.pathname==='/child.html'?'Child':'Shell',{description:'Name'});
app.src.startSource(builder.source);window.app=app;
if(location.pathname==='/child.html') {
 window.addEventListener('message',event=>{if(event.source===parent&&event.data==='connect')attachInspectorAgent(app,event.ports[0]);});
 parent.postMessage('ready','*');
} else {
 const channel=new MessageChannel();attachInspectorAgent(app,channel.port1);
 const top=new InspectorConnection(channel.port2);
 const inspector=document.createElement('gramlot-tools-inspector');
 inspector.targets=[{id:'top',title:'Shell (top)',connection:top}];document.body.append(inspector);
 window.inspector=inspector;window.connections=[top];
 const frame=document.querySelector('iframe');
 window.addEventListener('message',event=>{
  if(event.source!==frame.contentWindow||event.data!=='ready')return;
  const childChannel=new MessageChannel();const child=new InspectorConnection(childChannel.port1);
  frame.contentWindow.postMessage('connect','*',[childChannel.port2]);
  window.connections.push(child);inspector.targets=[{id:'top',title:'Shell (top)',connection:top},{id:'child',title:'Child',connection:child}];
  inspector.selectedTarget='child';window.ready=true;
 });
 frame.src='/child.html';
}`;
const html = child => `<!doctype html><meta charset="utf-8"><script type="importmap" nonce="fixture">{"imports":{"@gramlot/gramlot":"/core.js"}}</script><main></main>${child?'':'<iframe sandbox="allow-scripts"></iframe>'}<script type="module" src="/fixture.js"></script>`;
const files = new Map([['/',html(false)],['/child.html',html(true)],['/fixture.js',bootstrap],['/core.js',core.outputFiles[0].text],['/inspector.js',await readFile(new URL('../dist/gramlot-tools-inspector.js',import.meta.url),'utf8')]]);
const server=createServer((request,response)=>{
 response.writeHead(200,{'Content-Type':request.url.endsWith('.js')?'text/javascript':'text/html','Access-Control-Allow-Origin':'*',
 'Content-Security-Policy':"default-src 'none'; script-src 'self' 'nonce-fixture'; frame-src 'self'; style-src 'unsafe-inline'"});
 response.end(files.get(request.url)??'');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
 for(const engine of [chromium,webkit]) {
  const browser=await engine.launch({headless:true});
  try {
   const page=await browser.newPage({viewport:{width:1200,height:900}});const errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.ready);
   const child=page.frames().find(frame=>frame.url().endsWith('/child.html'));
   const tool=page.locator('gramlot-tools-inspector'), select=tool.getByLabel('Inspected page');
   const row=tool.locator('gramlot-poc-tree[data-root=data] [data-node-path=name]');
   await row.click();assert.equal(await tool.getByLabel('Value',{exact:true}).inputValue(),'Child');
   await tool.getByLabel('Value',{exact:true}).fill('Edited child');await tool.getByLabel('Value',{exact:true}).press('Enter');
   await child.waitForFunction(()=>app.data.getItem('name')==='Edited child');
   assert.equal(await page.evaluate(()=>app.data.getItem('name')),'Shell');
   await tool.getByLabel('Value',{exact:true}).fill('Left row');
   await tool.getByLabel('description value',{exact:true}).focus();
   await child.waitForFunction(()=>app.data.getItem('name')==='Left row');
   await page.waitForFunction(()=>document.querySelector('gramlot-tools-inspector').shadowRoot.activeElement?.getAttribute('aria-label')==='description value');
   await select.selectOption('top');await row.click();
   await tool.getByLabel('Value',{exact:true}).fill('Edited shell');await tool.getByLabel('Value',{exact:true}).press('Enter');
   await page.waitForFunction(()=>app.data.getItem('name')==='Edited shell');
   await select.selectOption('child');await row.click();await row.hover();await row.getByLabel('Breakpoint',{exact:true}).click();
   await tool.getByLabel('Breakpoint mode').selectOption('console');await tool.getByLabel('Breakpoint condition').fill('true');
   await tool.getByRole('button',{name:'Save',exact:true}).click();
   await tool.locator('.breakpoint-dialog .breakpoint-status').getByText(/Breakpoint not saved/).waitFor();
   await tool.getByLabel('Breakpoint condition').fill('');await tool.getByRole('button',{name:'Save',exact:true}).click();
   await tool.locator('dialog[aria-label=Breakpoint]').waitFor({state:'hidden'});
   const logged=page.waitForEvent('console',{predicate:msg=>msg.text().includes('** Gramlot breakpoint **')});
   await child.evaluate(function childWriter(){app.data.setItem('name','Hit');});await logged;
   await tool.locator('.breakpoint-line').getByText(/1 hits/).waitFor();
   if(engine===chromium) {
    const session=await page.context().newCDPSession(page);await session.send('Debugger.enable');
    await row.hover();await row.getByLabel('Breakpoint',{exact:true}).click();await tool.getByLabel('Breakpoint mode').selectOption('debugger');
    await tool.getByRole('button',{name:'Save',exact:true}).click();await tool.locator('dialog[aria-label=Breakpoint]').waitFor({state:'hidden'});
    const paused=new Promise(resolve=>session.once('Debugger.paused',async event=>{assert.ok(event.callFrames.some(frame=>frame.functionName==='childWriter'));await session.send('Debugger.resume');resolve();}));
    await child.evaluate(function childWriter(){app.data.setItem('name','Paused');});await paused;await session.send('Debugger.disable');await session.detach();
   }
   await tool.getByRole('tab',{name:'Source',exact:true}).click();
   await tool.locator('gramlot-poc-tree[data-root=source] summary[data-node-path=main]').click();
   await tool.locator('gramlot-poc-tree[data-root=source] [data-node-path="main.greeting"]').click();
   await tool.getByLabel('Value',{exact:true}).fill('Remote Source');await tool.getByLabel('Value',{exact:true}).press('Enter');
   await child.waitForFunction(()=>app.src.source.getItem('main.greeting')==='Remote Source');
   await page.evaluate(()=>{inspector.remove();for(const connection of connections)connection.close();});
   await child.waitForFunction(()=>Object.keys(app.data._updSubscribers).every(id=>!id.startsWith('inspector-bridge-')));
   assert.deepEqual(errors,[]);
   console.log(`${engine.name()}: PASS — opaque frame, shell/child selection, Data/Source edits, page CSP, target-local breakpoint${engine===chromium?', debugger writer stack':''}, cleanup`);
  } finally {await browser.close();}
 }
} finally {await new Promise(resolve=>server.close(resolve));}
