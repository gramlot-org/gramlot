/** Real native events/layout over Python Source; the controlled service is a core fixture, not Kajenn. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';

const [python, playwrightEntry, ...engines] = process.argv.slice(2);
if (!playwrightEntry) throw Error('Usage: node scripts/verify_database_selectors_browser.mjs PYTHON PLAYWRIGHT_ENTRY [ENGINE ...]');
const root = fileURLToPath(new URL('../', import.meta.url));
const playwright = await import(pathToFileURL(playwrightEntry));
const theme = await readFile(root + '/themes/gramlot-base/theme.css', 'utf8');
const wire = execFileSync(python, ['tests/fixtures/components/database_selectors.py'], {cwd:root,encoding:'utf8'}).trim();
const bundle = await build({stdin:{contents:`
import {Gramlot} from './js/src/index.js';
import inputs from './js/src/components/inputs.js';
window.gramlot = new Gramlot({document,transport:false,collections:[inputs]});
const stress = new URL(location.href).searchParams.has('stress');
const rows=[{id:0,name:'Ada Rossi',city:'Torino'},
    {id:3,name:'Elena Bianchi',city:'Trento'},
    {id:2,name:'Grazia Conti',city:stress?'A long city name '.repeat(15):'Milano'},
    {id:6,name:'Luca Ferrari',city:'Bologna'},
    {id:4,name:'Mario Rossi',city:'Roma'},
    {id:5,name:'Mario Rossi',city:'Firenze'}];
window.requests=[];
gramlot.rpc.call=async(kind,method,parameters)=>{
    requests.push(parameters);
    const query=parameters._querystring?.toLowerCase();
    let selected;
    if('_id' in parameters) selected=rows.filter(row=>row.id===parameters._id);
    else {
        selected=rows.filter(row=>row.name.toLowerCase().startsWith(query));
        if(!selected.length) selected=rows.filter(row=>row.name.toLowerCase().includes(query));
        selected=selected.slice(0,parameters.limit);
    }
    const fields=new Set(['id','name',...(parameters.hiddenColumns??'').split(',').filter(Boolean)]);
    for(const field of fields)if(!['id','name','city'].includes(field))throw Error('Unexposed field');
    return {rows:selected.map(row=>Object.fromEntries([...fields].map(field=>[field,row[field]]))),identifier:'id',caption:'name'};
};
gramlot.src.startSource(${JSON.stringify(wire)});
`,resolveDir:root},bundle:true,write:false,format:'esm',platform:'browser',target:'es2022'});
const server=createServer((request,response)=>{
    if(request.url==='/theme.css'){
        response.setHeader('Content-Type','text/css'); response.end(theme); return;
    }
    response.setHeader('Content-Type',request.url==='/fixture.js'?'text/javascript':'text/html');
    response.end(request.url==='/fixture.js'?bundle.outputFiles[0].text:
        '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Customer selection · Gramlot</title><link rel="stylesheet" href="/theme.css"><main id="gramlot-root"></main><script type="module" src="/fixture.js"></script></html>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
    for(const engine of engines.length?engines:['chromium','webkit']){
        browser=await playwright[engine].launch({headless:true});
        const page=await browser.newPage({viewport:{width:390,height:740},hasTouch:true});
        const errors=[];page.on('pageerror',error=>errors.push(String(error)));
        await page.goto(`http://127.0.0.1:${server.address().port}`);
        await page.waitForFunction(()=>window.gramlot?.state==='started');
        const combo=page.locator('#suggestion input');
        await combo.fill('Ad');await page.locator('#suggestion [role=option]').waitFor();
        await combo.press('Enter');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.suggestion')),'Ad');
        await combo.fill('Ad');await page.locator('#suggestion [role=option]').waitFor();
        await combo.press('ArrowDown');await combo.press('Tab');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.suggestion')),'Ada Rossi');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.suggestion_city')),'Torino');
        await combo.fill('Ada Rossi');await page.locator('#suggestion [role=option]').waitFor();
        await combo.press('Tab');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.suggestion_city')),null);
        const select=page.locator('#customer input');
        await select.fill('b');
        await page.locator('#customer [role=option]').filter({hasText:'Elena Bianchi'}).waitFor();
        await select.press('Enter');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.customer')),3);
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.city')),'Trento');
        await select.fill('Ad');await page.locator('#customer [role=option]').filter({hasText:'Ada Rossi'}).waitFor();await select.press('Enter');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.customer')),0);
        await page.locator('#customer .toggle').click();
        await page.locator('#customer [role=option]').first().tap();
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.customer')),null);
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.city')),null);
        assert.equal(await select.getAttribute('placeholder'),'Search by name');
        await select.fill('Gr');await page.locator('#customer [role=option]').filter({hasText:'Grazia Conti'}).waitFor();
        await page.locator('#customer [role=option]').filter({hasText:'Grazia Conti'}).tap();
        await page.locator('#customer .toggle').click();
        assert.match(await page.locator('#customer [aria-selected=true]').textContent(),/Grazia Conti/);
        await select.press('Escape');
        await page.goto(`http://127.0.0.1:${server.address().port}?stress=1`);
        await page.waitForFunction(()=>window.gramlot?.state==='started');
        await select.fill('Gr');await page.locator('#customer [role=option]').filter({hasText:'Grazia Conti'}).waitFor();
        const geometry=await page.locator('#customer .choices').evaluate(el=>{
            const rect=el.getBoundingClientRect();return {left:rect.left,right:rect.right,bottom:rect.bottom,
                viewportWidth:innerWidth,viewportHeight:innerHeight,scroll:el.scrollWidth,width:el.clientWidth};
        });
        assert.ok(geometry.left>=0&&geometry.right<=geometry.viewportWidth);
        assert.ok(geometry.bottom<=geometry.viewportHeight&&geometry.scroll<=geometry.width+1);
        await page.locator('#customer [role=option]').filter({hasText:'Grazia Conti'}).tap();
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('form.customer')),2);
        await page.locator('#required .toggle').click();
        await page.locator('#required [role=option]').first().waitFor();
        assert.equal(await page.locator('#required [role=option]').count(),6);
        assert.equal(await page.locator('#required [role=option]').first().textContent(),'Ada RossiTorino');
        assert.ok(await page.evaluate(()=>requests.some(request=>(request.hiddenColumns??'').includes('city'))));
        assert.deepEqual(errors,[]);
        console.log(`${engine}: native Enter/blur, typed zero, text projection, null/required choice, touch and narrow popup passed.`);
        await browser.close();browser=null;
    }
} finally {
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
}
