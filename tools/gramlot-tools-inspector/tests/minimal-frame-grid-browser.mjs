/** FrameGrid authoring, command routing, shared toolbar overflow and theme qualification. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import {chromium, webkit} from 'playwright';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const wire = execFileSync(`${repo}/.venv/bin/python`, ['tests/fixtures/components/frame_grid.py'], {cwd: repo, encoding: 'utf8'}).trim();
const bootstrap = `
import {Gramlot} from '@gramlot/gramlot';
import grid from '/collections/grid/index.js';
import layout from '/collections/layout/index.js';
import {Logic} from '/logic.js';
const app = new Gramlot({element: document.getElementById('app'), transport: false, collections: [layout, grid], locale: 'it-IT'});
const commands = app.commands.registerGroup('gridDemo');
commands.register('update', {label:'Update first price', icon:'↻', publish:'update'});
commands.register('remove', {label:'Remove last row', icon:'−', publish:'remove'});
app.src.logicRegistry.register(Logic,{resource:'fixture:frame-grid'});
app.src.startSource(${JSON.stringify(wire)});
window.qualification = app;
`;
// Serve the prepared artifacts, so this test also verifies distribution identity.
const assets = new Map([['/runtime.js', bootstrap],
    ['/core.js', await readFile(`${repo}/src/gramlot/resources/gramlot.js`, 'utf8')],
    ['/logic.js', await readFile(`${repo}/tests/fixtures/components/frame_grid_logic.js`, 'utf8')]]);
for (const name of ['grid', 'layout']) for (const file of ['index.js', 'collection.js']) {
    assets.set(`/collections/${name}/${file}`, await readFile(`${repo}/src/gramlot/collections/${name}/assets/${file}`, 'utf8'));
}
const base = await readFile(`${repo}/themes/gramlot-base/theme.css`, 'utf8');
const compact = await readFile(`${repo}/themes/gramlot-compact/theme.css`, 'utf8');
const themes = {base:'', compact};
for (const name of ['mimi','joanna','mela']) themes[name] = compact + '\n' + await readFile(`${repo}/themes/${name}/theme.css`, 'utf8');
const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (assets.has(url.pathname)) {res.writeHead(200, {'Content-Type':'text/javascript'}); res.end(assets.get(url.pathname));}
    else if (url.pathname === '/base.css') {res.writeHead(200, {'Content-Type':'text/css'}); res.end(base);}
    else if (url.pathname === '/theme.css') {res.writeHead(200, {'Content-Type':'text/css'}); res.end(themes[url.searchParams.get('theme')] ?? '');}
    else {
        const theme = Object.hasOwn(themes,url.searchParams.get('theme')) ? url.searchParams.get('theme') : 'compact';
        const mode = url.searchParams.get('mode') === 'dark' ? 'dark' : 'light';
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(`<!doctype html><html data-theme="${mode}"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gramlot · FrameGrid</title><script type="importmap">{"imports":{"@gramlot/gramlot":"/core.js","@gramlot/gramlot/components":"/core.js"}}</script><link rel="stylesheet" href="/base.css"><link id="appearance" rel="stylesheet" href="/theme.css?theme=${theme}"></head><body><div id="app"></div><script type="module" src="/runtime.js"></script></body></html>`);
    }
});
const portIndex = process.argv.indexOf('--port');
await new Promise(resolve => server.listen(portIndex < 0 ? 0 : Number(process.argv[portIndex+1]),'127.0.0.1',resolve));
const url = `http://127.0.0.1:${server.address().port}/`;
try {
    for (const [name, engine] of Object.entries({chromium, webkit})) {
        const browser = await engine.launch();
        try {
            const page = await browser.newPage({viewport:{width:1200,height:1000}}), errors=[];
            page.on('pageerror', error=>errors.push(error.message));
            await page.goto(url);
            await page.locator('#grid-values tbody tr').first().waitFor().catch(async error => { console.error({errors, body:await page.locator('body').innerText()}); throw error; });
            await page.waitForFunction(()=>document.getElementById('count-values').textContent==='60');
            const settle=()=>page.evaluate(()=>new Promise(resolve=>setTimeout(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)),0)));
            await settle();
            const first=page.locator('#grid-values');
            const row=await first.locator('tbody tr').first().elementHandle();
            assert.equal(await page.getByRole('toolbar').count(),6);
            await page.locator('#update-values button').click();
            assert.equal(await first.locator('tbody td[data-field=price]').first().textContent(),'99,50');
            assert.equal(await page.locator('#grid-attributes tbody td[data-field=price]').first().textContent(),'12,50');
            await page.locator('#remove-values button').click();
            assert.equal(await page.locator('#count-values').textContent(),'59');
            assert.equal(await page.locator('#count-attributes').textContent(),'60');
            const geometry=()=>first.evaluate(host=>{
                const s=host.shadowRoot, body=s.querySelector('.body-viewport'), header=s.querySelector('.header-frame');
                const cols=[...s.querySelectorAll('th[scope=col]')].sort((a,b)=>+a.getAttribute('aria-colindex')-+b.getAttribute('aria-colindex'));
                return {headerBottom:header.getBoundingClientRect().bottom,bodyTop:body.getBoundingClientRect().top,
                    bodyHeight:body.clientHeight, scrollHeight:body.scrollHeight,
                    pairs:cols.map((th,i)=>({head:th.getBoundingClientRect().x,body:s.querySelector('tbody tr').cells[i].getBoundingClientRect().x}))};
            });
            const aligned=result=>{assert.ok(Math.abs(result.headerBottom-result.bodyTop)<1);assert.ok(result.bodyHeight>80);assert.ok(result.scrollHeight>result.bodyHeight);for(const pair of result.pairs)assert.ok(Math.abs(pair.head-pair.body)<1);};
            for (const theme of Object.keys(themes)) for (const mode of ['light','dark']) {
                await page.evaluate(async ({theme,mode})=>{
                    document.documentElement.dataset.theme=mode;
                    const link=document.getElementById('appearance'), href=`/theme.css?theme=${theme}`;
                    if(link.getAttribute('href')!==href)await new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=reject;link.href=href;});
                },{theme,mode});
                await settle(); aligned(await geometry()); assert.ok(await row.evaluate(node=>node.isConnected));
                if(theme==='compact'&&mode==='light'||theme==='joanna'&&mode==='dark')await page.screenshot({path:`/private/tmp/frame-grid-${theme}-${mode}-${name}.png`,fullPage:true});
            }
            for (const mode of ['values','attributes']) {
                const grid = page.locator(`#grid-${mode}`), rows = grid.locator('tbody tr');
                const target = rows.first(), handle = target.locator('.row-height-handle');
                const initial = (await target.boundingBox()).height;
                const neighbor = (await rows.nth(1).boundingBox()).height;
                const point = await handle.boundingBox();
                await page.mouse.move(point.x + point.width/2, point.y + point.height/2);
                await page.mouse.down(); await page.mouse.move(point.x + point.width/2, point.y + point.height/2 + 45, {steps:6});
                await page.mouse.up(); await settle();
                assert.ok(Math.abs((await target.boundingBox()).height - initial - 45) < 1);
                assert.equal((await rows.nth(1).boundingBox()).height, neighbor);
                await page.locator(`#update-${mode} button`).click(); await settle();
                assert.ok(Math.abs((await target.boundingBox()).height - initial - 45) < 1, 'Data update retains presentation');
                const cancelPoint = await handle.boundingBox();
                await page.mouse.move(cancelPoint.x + 15, cancelPoint.y + 3); await page.mouse.down();
                await page.mouse.move(cancelPoint.x + 15, cancelPoint.y + 30);
                await page.keyboard.press('Escape'); await page.mouse.up();
                assert.ok(Math.abs((await target.boundingBox()).height - initial - 45) < 1);
                await handle.focus(); await page.keyboard.press('ArrowDown');
                assert.ok(Math.abs((await target.boundingBox()).height - initial - 55) < 1);
                await page.keyboard.press('Home');
                assert.ok(Math.abs((await target.boundingBox()).height - initial) < 1);
                await page.keyboard.press('ArrowDown'); await handle.dblclick();
                assert.ok(Math.abs((await target.boundingBox()).height - initial) < 1);
            }
            const physicalLabels = await page.evaluate(() => window.qualification.data.getItem('values.rows').getNodes().map(node=>node.label));
            await first.locator('th[data-field=code]').click();
            await settle();
            await first.locator('th[data-field=price]').click({modifiers:['Shift']});
            await settle();
            assert.equal(await page.evaluate(() => window.qualification.src.binding.renderer.getBaseSourceNode(document.getElementById('grid-values')).gridCollectionView.sortedBy), 'code:a,price:a');
            assert.equal(await first.locator('th[data-field=price]').getAttribute('data-sort-priority'), '2');
            for (const field of ['code','price']) {
                const headerBox = await first.locator(`th[data-field=${field}]`).boundingBox();
                const arrowBox = await first.locator(`th[data-field=${field}] .sort-indicator`).boundingBox();
                assert.ok(arrowBox.width > 0 && arrowBox.x >= headerBox.x && arrowBox.x + arrowBox.width <= headerBox.x + headerBox.width, 'sort arrow remains inside even a narrow header');
            }

            await first.locator('th[data-field=price]').click();
            await settle();
            assert.equal(await first.locator('tbody tr').first().getAttribute('data-row'), 'r0', 'descending numeric sort uses raw price');
            await first.locator('th[data-field=code]').click();
            await settle();
            const movingRow = first.locator('tbody tr[data-row=r0]');
            await movingRow.locator('.row-height-handle').focus(); await page.keyboard.press('ArrowDown');
            const movingHeight = (await movingRow.boundingBox()).height;
            const thirdRow = first.locator('tbody tr[data-row=r2]'), thirdBox = await thirdRow.boundingBox();
            await movingRow.dragTo(thirdRow, {sourcePosition:{x:60,y:10},targetPosition:{x:60,y:thirdBox.height-3}});
            await settle();
            assert.deepEqual(await first.locator('tbody tr').evaluateAll(rows=>rows.slice(0,3).map(row=>row.dataset.row)), ['r1','r2','r0']);
            assert.deepEqual(await page.evaluate(() => window.qualification.data.getItem('values.rows').getNodes().map(node=>node.label)), physicalLabels);
            assert.deepEqual(await page.evaluate(() => window.qualification.data.getItem('values.rows').getNodes().slice(0,3).map(node=>node.getAttr('rowidx'))), [null,null,null]);
            assert.equal(await page.evaluate(() => window.qualification.src.binding.renderer.getBaseSourceNode(document.getElementById('grid-values')).gridCollectionView.sortedBy), '');
            assert.equal(await first.locator('[data-sort-priority]').count(), 0);

            assert.ok(Math.abs((await movingRow.boundingBox()).height-movingHeight)<1, 'height follows the moved presentation row');
            assert.ok(await row.evaluate(node=>node.isConnected), 'row reorder retains DOM identity');
            assert.deepEqual(await first.locator('.row-number').evaluateAll(nodes=>nodes.slice(0,3).map(n=>n.textContent)), ['1','2','3']);
            await movingRow.dragTo(first.locator('tbody tr[data-row=r1]'), {sourcePosition:{x:60,y:10},targetPosition:{x:60,y:2}});
            assert.deepEqual(await first.locator('tbody tr').evaluateAll(rows=>rows.slice(0,3).map(row=>row.dataset.row)), ['r0','r1','r2']);
            await movingRow.locator('.row-height-handle').focus(); await page.keyboard.press('Home');
            // WebKit's native-drag pointer lifecycle is independently reproduced in the port receipt.
            // Finish its missing first pointerdown cycle on a non-draggable label before pointer-only tests.
            if (name === 'webkit') await page.locator('#count-values').click();
            const quantity = first.locator('th[data-field=quantity]');
            const widthInData = () => page.evaluate(() => {
                const struct = window.qualification.data.getItem('gramlot.grid').getNodes()[0].staticValue.getItem('struct');
                return struct.getNode('view_0.rows_0.cell_quantity').getAttr('width');
            });
            await quantity.scrollIntoViewIfNeeded(); await settle();
            const box = await quantity.boundingBox();
            await page.mouse.move(box.x + box.width - 3, box.y + box.height / 2);
            await page.mouse.down(); await page.mouse.move(box.x + box.width + 67, box.y + box.height / 2, {steps:8});
            assert.equal(await widthInData(), '100px', 'resize preview must not write Data');
            await page.mouse.up(); await settle();
            assert.equal(await widthInData(), '170px');
            assert.ok(Math.abs((await quantity.boundingBox()).width - 170) < 1);
            assert.ok(await row.evaluate(node=>node.isConnected));
            const resized = await quantity.boundingBox();
            await page.mouse.move(resized.x + resized.width - 3, resized.y + resized.height / 2);
            await page.mouse.down(); await page.mouse.move(resized.x + resized.width + 32, resized.y + resized.height / 2);
            await page.keyboard.press('Escape'); await page.mouse.up();
            assert.equal(await widthInData(), '170px', 'Escape cancels resize');
            await quantity.locator('.column-resize').focus(); await page.keyboard.press('ArrowRight'); await settle();
            assert.equal(await widthInData(), '180px');
            // Insert an ungrouped column inside Amounts: group membership stays intact.
            const code = first.locator('th[data-field=code]');
            await code.dragTo(quantity, {targetPosition:{x:175,y:15}}); await settle();
            assert.deepEqual(await first.locator('th[data-field]').evaluateAll(nodes=>nodes.map(n=>n.dataset.field)),
                ['description','quantity','code','price','updated']);
            assert.equal(await first.locator('th[scope=colgroup]').count(), 2);
            assert.ok(await row.evaluate(node=>node.isConnected));
            await first.locator('th[data-field=code]').focus(); await page.keyboard.press('Alt+ArrowRight'); await settle();
            assert.equal(await first.locator('th[scope=colgroup]').count(), 1, 'adjacent runs join again');
            await page.setViewportSize({width:390,height:950}); await settle(); aligned(await geometry());
            assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
            // Original group and commands remain in Source; the shared bar projects them into overflow.
            const toolbar=page.getByRole('toolbar',{name:'Attributes commands'});
            const overflow=toolbar.getByRole('button',{name:'More commands'});
            await overflow.click();
            await page.locator('#update-attributes button').click();
            assert.equal(await page.locator('#grid-attributes tbody td[data-field=price]').first().textContent(),'99,50');
            assert.ok(await row.evaluate(node=>node.isConnected));
            await first.locator('.body-viewport').evaluate(node=>{node.scrollLeft=190;node.scrollTop=350;});
            await settle(); aligned(await geometry());
            await page.screenshot({path:`/private/tmp/frame-grid-mobile-${name}.png`,fullPage:true});
            await page.setViewportSize({width:1200,height:1000});await settle();
            await page.locator('#remove-attributes button').click();
            assert.equal(await page.locator('#count-attributes').textContent(),'59');
            const closing = await quantity.boundingBox();
            await page.mouse.move(closing.x + closing.width - 3, closing.y + closing.height / 2);
            await page.mouse.down(); await page.mouse.move(closing.x + closing.width + 20, closing.y + closing.height / 2);
            await page.evaluate(()=>window.qualification.dispose());
            await page.mouse.up();
            assert.equal(await page.locator('gramlot-grid,gramlot-menu').count(),0);
            // A separate mounted fixture isolates the rejected native drag's lifecycle.
            await page.goto(url); await page.locator('#grid-values tbody tr').first().waitFor();
            await page.locator('#grid-values tbody tr[data-row=r0]').dragTo(page.locator('#grid-attributes tbody tr[data-row=r2]'), {sourcePosition:{x:60,y:10}});
            await page.keyboard.press('Escape');
            assert.deepEqual(await page.locator('#grid-values tbody tr').evaluateAll(rows=>rows.slice(0,3).map(row=>row.dataset.row)), ['r0','r1','r2'], 'self drag rejects another grid');
            assert.equal(await page.locator('gramlot-grid [data-row-drop],gramlot-grid .row-dragging').count(), 0);
            await page.evaluate(()=>window.qualification.dispose());
            // Search exercises the compiled Python FrameGrid and the deferred store projection.
            await page.goto(url); await page.locator('#grid-values tbody tr').first().waitFor();
            for (const mode of ['values','attributes']) {
                const scope=page.locator(`#frame-${mode}`), search=scope.locator('gramlot-search-box');
                const field=search.getByRole('combobox'), input=search.getByRole('searchbox');
                const visible=scope.locator('tbody tr[data-row]');
                const clear=search.getByRole('button',{name:'Clear filter'});
                assert.equal(await clear.isVisible(),false,'empty search hides its internal clear control');
                assert.equal(await input.getAttribute('placeholder'),' ','query examples are not printed inside the input');
                const capsuleBefore=await search.boundingBox();
                await field.selectOption('quantity'); await input.fill('> 40');
                await page.waitForFunction(mode=>document.getElementById(`grid-${mode}`).shadowRoot.querySelectorAll('tbody tr[data-row]').length===20,mode);
                assert.equal(await visible.count(),20);
                assert.equal(await clear.isVisible(),true,'typing reveals the clear control');
                await search.getByRole('button',{name:'Search instructions',exact:true}).click();
                const help=search.getByRole('dialog',{name:'Search instructions',exact:true});
                assert.equal(await help.isVisible(),true);assert.match(await help.innerText(),/Compare numbers/);
                assert.equal(await search.getByRole('button',{name:'Search instructions',exact:true}).getAttribute('aria-expanded'),'true');
                await page.keyboard.press('Escape');await settle();assert.equal(await help.isVisible(),false);
                await input.focus();
                assert.equal(await search.locator('.control-box').evaluate(el=>getComputedStyle(el).boxShadow),'none','focus has no outer halo');
                const capsuleAfter=await search.boundingBox(), clearBox=await clear.boundingBox();
                assert.equal(capsuleAfter.width,capsuleBefore.width,'clear does not shift the field');
                assert.ok(clearBox.x>=capsuleAfter.x && clearBox.x+clearBox.width<=capsuleAfter.x+capsuleAfter.width,'clear stays inside the capsule');
                await scope.locator('th[data-field=quantity]').click(); await settle();
                await scope.locator('th[data-field=quantity]').click(); await settle();
                assert.equal(await visible.first().getAttribute('data-row'),'r59');
                await input.fill('>'); await page.waitForTimeout(150);
                assert.equal(await input.getAttribute('aria-invalid'),'true');assert.equal(await visible.count(),20);
                await search.getByRole('button',{name:'Clear filter'}).click();await settle();
                assert.equal(await visible.count(),60);
                assert.equal(await clear.isVisible(),false,'clearing hides the button');
                assert.equal(await input.evaluate(el=>el.getRootNode().activeElement===el),true,'clear returns keyboard focus to input');
                assert.equal(await visible.first().getAttribute('data-row'),'r59','clear retains descending sort');
                await field.selectOption('updated');await input.fill('= 28/10/2026');await page.waitForTimeout(150);await settle();
                assert.equal(await input.getAttribute('aria-invalid'),null);assert.equal(await visible.count(),60);
                await field.selectOption('code');await input.fill('^P00[1-3]$');
                await page.waitForFunction(mode=>document.getElementById(`grid-${mode}`).shadowRoot.querySelectorAll('tbody tr[data-row]').length===3,mode);
                assert.equal(await visible.count(),3);
                await search.getByRole('button',{name:'Clear filter'}).click();await settle();
            }
            await page.screenshot({path:`/private/tmp/frame-grid-search-${name}.png`,fullPage:true});
            await page.setViewportSize({width:390,height:900});await settle();
            const narrowSearch=page.locator('#frame-values gramlot-search-box');
            assert.equal(await narrowSearch.getByRole('searchbox').isVisible(),true,'search remains visible in a narrow toolbar');
            const narrowBox=await narrowSearch.boundingBox();assert.ok(narrowBox.x>=0 && narrowBox.x+narrowBox.width<=390);
            await page.screenshot({path:`/private/tmp/frame-grid-search-narrow-${name}.png`,fullPage:true});
            await page.setViewportSize({width:1200,height:1000});await settle();
            await page.evaluate(()=>window.qualification.dispose());
            if (process.argv.includes('--measure-ordering')) {
                await page.goto(url);
                await page.locator('#grid-attributes tbody tr').first().waitFor();
                for (const size of [100,1000,10000]) {
                    const measurement = await page.evaluate(async size => {
                        const app = window.qualification;
                        const Bag = app.data.constructor, rows = new Bag();
                        for (let i=0; i<size; i++) rows.setItem(`r${i}`, null,
                            {code:`R${i}`,description:'Ordering probe',quantity:size-i,price:i,updated:new Date(2026,9,28)});
                        app.data.setItem('attributes.rows',rows);
                        await new Promise(resolve => requestAnimationFrame(()=>requestAnimationFrame(resolve)));
                        const host = document.getElementById('grid-attributes');
                        const original = [...host.shadowRoot.querySelectorAll('tbody tr')];
                        const setStruct = host.setStructBag, project = host.projectAttributes;
                        let structures=0, projections=0, indexEvents=0;
                        host.setStructBag = function(...args) { structures++; return setStruct.apply(this,args); };
                        host.projectAttributes = function(...args) { projections++; return project.apply(this,args); };
                        rows.subscribe('ordering-probe',{any:event => { if (event.attrs_diff?.rowidx) indexEvents++; }});
                        const start = performance.now();
                        app.src.binding.renderer.getBaseSourceNode(host).gridCollectionView.sort('quantity:a,price:d');
                        const sortMs = performance.now()-start;
                        await new Promise(resolve => requestAnimationFrame(()=>requestAnimationFrame(resolve)));
                        const settledMs = performance.now()-start;
                        rows.unsubscribe('ordering-probe');
                        host.setStructBag=setStruct; host.projectAttributes=project;
                        const projected = [...host.shadowRoot.querySelectorAll('tbody tr')];
                        return {size,structures,projections,indexEvents,sortMs:Math.round(sortMs),settledMs:Math.round(settledMs),
                            identity:projected.every((row,i)=>row===original[size-i-1]),
                            physicalOrder:rows.getNodes().every((node,i)=>node.label===`r${i}`)};
                    },size);
                    assert.equal(measurement.structures,0);
                    assert.equal(measurement.projections,0);
                    assert.equal(measurement.indexEvents,0);
                    assert.equal(measurement.identity,true);
                    assert.equal(measurement.physicalOrder,true);
                    console.log(`${name} ordering: ${JSON.stringify(measurement)}`);
                }
                await page.evaluate(()=>window.qualification.dispose());
            }
            assert.deepEqual(errors,[]);
            console.log(`${name}: Python Source, two frame recipients, live counts, 10 theme/mode combinations, stable rows, header/body geometry, responsive overflow actions, scroll, individual row resize/reset/cancel/keyboard, indexed sort/multicolumn/physical-order preservation, self row drag/identity/cross-grid rejection, column resize Data/preview/cancel/keyboard, reorder/split/join, all/column search, regex/numeric/date filters, invalid drafts, clear retaining sort and disposal passed`);
        } finally {await browser.close();}
    }
    if (process.argv.includes('--serve')) {console.log(`REVIEW_URL=${url}`); await new Promise(()=>{});}
} finally {server.close();}
