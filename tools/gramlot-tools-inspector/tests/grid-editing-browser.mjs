/** Real layout qualification of shared Source editing and virtualized rows. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import {chromium, webkit} from 'playwright';
const repo=fileURLToPath(new URL('../../../',import.meta.url));
const wire=execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? `${repo}/.venv/bin/python`,['tests/fixtures/components/grid_editing.py'],{cwd:repo,encoding:'utf8'}).trim();
const assets=new Map([['/core.js',await readFile(`${repo}/src/gramlot/resources/gramlot.js`)]]);
for (const name of ['inputs','grid']) for (const file of ['index.js','collection.js']) assets.set(`/collections/${name}/${file}`,await readFile(`${repo}/src/gramlot/collections/${name}/assets/${file}`));
assets.set('/runtime.js',`import {Gramlot} from '@gramlot/gramlot';import inputs from '/collections/inputs/index.js';import grid from '/collections/grid/index.js';window.app=new Gramlot({element:document.getElementById('app'),transport:false,collections:[inputs,grid],locale:'en-GB'});app.src.startSource(${JSON.stringify(wire)});`);
const css=await readFile(`${repo}/themes/gramlot-base/theme.css`,'utf8');
const server=createServer((req,res)=>{if(assets.has(req.url)){res.writeHead(200,{'Content-Type':'text/javascript'});res.end(assets.get(req.url));}else{res.writeHead(200,{'Content-Type':'text/html'});res.end(`<!doctype html><html><head><style>${css}</style><script type="importmap">{"imports":{"@gramlot/gramlot":"/core.js","@gramlot/gramlot/components":"/core.js","@gramlot/collections/inputs":"/collections/inputs/index.js"}}</script></head><body><div id="app"></div><script type="module" src="/runtime.js"></script></body></html>`);}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
 for(const [name,engine] of Object.entries({chromium,webkit})) {
  const browser=await engine.launch();
  try {
   const page=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(`http://127.0.0.1:${server.address().port}/`);
   await page.locator('#grid-values tbody tr').first().waitFor().catch(error=>{console.error(errors);throw error;});
   const settle=()=>page.evaluate(()=>new Promise(resolve=>setTimeout(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)),30)));
   for(const mode of ['values','attributes']) {
    const g=page.locator(`#grid-${mode}`),cell=g.locator('tr[data-row=r0] td[data-field=amount]');
    await cell.dblclick();
    const input=g.locator('gramlot-number-text-box input');
    await input.fill('-');
    await page.screenshot({path:`/private/tmp/grid-editing-${name}-${mode}.png`});
    const scroll=async top=>{await g.locator('.body-viewport').evaluate((e,top)=>{e.scrollTop=top;},top);await settle();};
    await scroll(18000);
    assert.equal(await g.locator('[slot=cell-editor]').count(),0);
    const state=()=>page.evaluate(mode=>{const s=app.src.source.getNode('main.page.'+mode).formState;return {drafts:s.registers.getItem('drafts').length,errors:s.registers.getItem('errors').length,valid:s.status.valid,dirty:s.status.dirty};},mode);
    assert.equal((await state()).drafts,1);
    await scroll(0);await cell.dblclick();await settle();
    assert.equal(await input.inputValue(),'-');
    await input.fill('-4');await input.press('Enter');await settle();
    assert.equal((await state()).errors,1);
    await scroll(18000);assert.equal((await state()).errors,1);
    await scroll(0);assert.equal(await cell.getAttribute('aria-invalid'),'true');
    await cell.dblclick();await input.fill('8');await input.press('Enter');await settle();
    assert.equal((await state()).valid,true);
    await page.locator(`#accept-${mode} button`).click();
    await page.waitForFunction(mode=>!app.src.source.getNode('main.page.'+mode).formState.status.dirty,mode);
    assert.equal((await state()).dirty,false);
    await cell.dblclick();await input.fill('11');await input.press('Enter');await settle();
    await page.locator(`#restore-${mode} button`).click();await settle();
    assert.equal(await cell.textContent(),'8');
    assert.ok(await g.locator('tbody tr').count()<40);
    await page.evaluate(mode=>{
      window.validationRequests=[];
      app.rpc.call=(_kind,_method,params,{signal})=>new Promise(resolve=>validationRequests.push({params,signal,resolve}));
      const node=app.src.source.getNode('main.page.'+mode+'.grid');
      node.getRelativeData(node.getAttr('structpath')).getNode('view_0.rows_0.cell_amount').setAttr({edit:{validate_remote:'check'}});
    },mode);
    await settle();await cell.dblclick();await input.fill('19');await input.press('Enter');await settle();
    const requests=await page.evaluate(()=>validationRequests.length);
    await scroll(18000);
    assert.equal(await g.locator('[slot=cell-editor]').count(),0);
    assert.equal(await page.evaluate(()=>validationRequests.at(-1).signal.aborted),false);
    await page.evaluate(()=>validationRequests.at(-1).resolve({value:23}));await settle();
    assert.equal(await page.evaluate(async mode=>{
      const session=app.src.source.getNode('main.page.'+mode).formState,remote=app.rpc.call;
      let count=0;app.rpc.call=async()=>{count++;return true;};
      try{return {accepted:await session.validate() && session.accept(),count};}
      finally{app.rpc.call=remote;}
    },mode).then(result=>result.accepted && result.count===1000),true);
    assert.equal(await page.evaluate(()=>validationRequests.length),requests);
    assert.equal(await g.locator('[slot=cell-editor]').count(),0);
    await scroll(0);assert.equal(await cell.textContent(),'23');
    await cell.dblclick();await input.fill('24');await input.press('Enter');await settle();await scroll(18000);
    await page.evaluate(()=>validationRequests.at(-1).resolve({errorcode:'blocked',message:'Remote validation rejected'}));await settle();
    assert.equal((await state()).errors,1);
    assert.equal(await page.evaluate(mode=>app.src.source.getNode('main.page.'+mode).formState.accept(),mode),false);
    const completedCount=await page.evaluate(()=>validationRequests.length);
    await scroll(0);assert.equal(await cell.getAttribute('aria-invalid'),'true');await cell.dblclick();await settle();
    assert.equal(await page.evaluate(()=>validationRequests.length),completedCount,'reopening an error does not repeat validation');
    assert.match(await g.locator('#field-message').textContent(),/Remote validation rejected/);

   }
   assert.deepEqual(errors,[]);
   console.log(`${name}: form/grid session, values and attributes, 1000 variable-height rows, draft/error recycling, accept/restore and async validation without mounted editors passed`);
  } finally {await browser.close();}
 }
} finally {await new Promise(resolve=>server.close(resolve));}
