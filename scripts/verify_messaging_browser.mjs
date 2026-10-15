/** Real browser qualification of the core-owned messaging and native ask fixtures.
 * Includes HTTP and file URLs, opaque iframes and lifecycle. No examples/host package dependency. */
import {build} from '../js/node_modules/esbuild/lib/main.js';
import {fileURLToPath, pathToFileURL} from 'node:url';
const [playwrightEntry, ...engines] = process.argv.slice(2);
if (!playwrightEntry) throw new Error('Usage: node scripts/verify_messaging_browser.mjs PLAYWRIGHT_ENTRY [ENGINE …]');
const playwright = await import(pathToFileURL(playwrightEntry));
import {mkdtemp, writeFile, readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('..', import.meta.url));
const bundle=await build({entryPoints:[root+'/js/src/index.js'],bundle:true,format:'iife',globalName:'G',write:false,logLevel:'silent'});
const dir=await mkdtemp('/tmp/gramlot-publish-browser-');
const html=(code)=>'<!doctype html><html><head><meta charset="utf-8"></head><body><main id="root"></main><script>'+bundle.outputFiles[0].text.replaceAll('</script','<\\/script')+'\n'+code+'</script></body></html>';
const child=`window.events=[]; const b=new G.GramlotBuilder(); b.root.p('Child'); b.root.dataController({subscribe_ping:true,script:"this.SET('received', number);"}); window.app=new G.Gramlot({rootId:'root',transport:false}); app.subscribe('ping',p=>{events.push(p); app.publish({topic:'reply',parent:true},{number:p.number,typed:p.typed});}); app.src.startSource(b.toTytx());`;
await writeFile(dir+'/child.html',html(child));
const parent=`window.events=[]; window.local=[]; const b=new G.GramlotBuilder(); b.root.iframe({id:'child',node_id:'child',src:'child.html'}); b.root.iframe({id:'isolated',src:'child.html',sandbox:'allow-scripts'}); b.root.dataController({subscribe_ask:true,script:"this.SET('answer',name);",_ask:{title:'Enter name',fields:[{name:'name',lbl:'Name',required:true}]}}); window.app=new G.Gramlot({rootId:'root',transport:false}); app.subscribe('ping',p=>local.push(p.number)); app.subscribe('reply',p=>events.push(p)); app.src.startSource(b.toTytx());`;
await writeFile(dir+'/index.html',html(parent));
const server=createServer(async(req,res)=>{try {res.setHeader('Content-Type','text/html');res.end(await readFile(dir+(req.url==='/'?'/index.html':req.url)));} catch {res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
try {
for(const engine of (engines.length ? engines : ['chromium', 'webkit'])) {
const type = playwright[engine];
const browser=await type.launch({headless:true});
try {
for(const url of [origin+'/index.html','file://'+dir+'/index.html']) {
const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(url); await page.waitForFunction(()=>window.app?.state==='started');
for(const target of ['child','isolated']) {
await page.waitForFunction(target=>{try {app.publish({topic:'ping',iframe:target},{number:1,typed:new Date('2026-10-15T00:00:00Z')});return true;} catch(e){if(e.message.includes('not ready')) return false; throw e;}},target);
await page.waitForFunction(()=>events.length>0);
assert.equal(await page.evaluate(()=>events.at(-1).typed instanceof Date),true);
assert.equal(await page.evaluate(()=>local.at(-1)),1);
await page.evaluate(()=>{events.length=0;});
}
// A Source reference is a destination, not a remote live object in the payload.
await page.evaluate(()=>app.publish({topic:'ping',iframe:app.src.builder.nodeById('child')},{number:2}));
await page.waitForFunction(()=>events.some(p=>p.number===2));
assert.equal(await page.frames().find(f=>f.url().endsWith('child.html')).evaluate(()=>app.data.getItem('received')),2);
await page.evaluate(()=>app.publish('ask',{name:'Ada'}));
await page.getByRole('dialog').waitFor(); assert.equal(await page.locator('dialog').evaluate(d=>d.matches(':modal')),true);
await page.getByRole('textbox',{name:'Name',exact:true}).fill('Grace');await page.getByRole('button',{name:'Confirm',exact:true}).click();
await page.waitForFunction(()=>app.data.getItem('answer')==='Grace');assert.equal(await page.locator('dialog').count(),0);
await page.evaluate(()=>{app.publish('ask',{name:'New'});});await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog'));
assert.equal(await page.evaluate(()=>app.data.getItem('answer')),'Grace');
const childFrame=page.frames().find(f=>f.url().endsWith('child.html'));
await childFrame.evaluate(()=>app.dispose());
await page.waitForFunction(()=>{try{app.publish({topic:'ping',iframe:'child'},{});return false;}catch(e){return e.message.includes('not ready');}});
await childFrame.goto(url.startsWith('file:')?'file://'+dir+'/child.html':origin+'/child.html');
await page.waitForFunction(()=>{try{app.publish({topic:'ping',iframe:'child'},{number:3});return true;}catch(e){if(e.message.includes('not ready'))return false;throw e;}});
await page.waitForFunction(()=>events.some(p=>p.number===3));
assert.deepEqual(errors,[]);console.log('PASS',engine,url.startsWith('file:')?'file':'http','bidirectional/opaque/reference/typed/controller/ask/cancel/dispose/reload');await page.close();
}
}finally{await browser.close();}
}
}finally{server.close();}
console.log('fixtures',dir);
