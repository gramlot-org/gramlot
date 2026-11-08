import {createServer} from 'node:http';
import {readFile,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {chromium, webkit} from 'playwright';
import './chart-trial-build.mjs';

const repo=fileURLToPath(new URL('../../../',import.meta.url));
const base='/private/tmp/gramlot-chart-visible';
const wire=execFileSync(`${repo}/.venv/bin/python`,['tests/fixtures/components/chart_trial.py'],
    {cwd:repo,encoding:'utf8'}).trim();
const bootstrap=`import {Gramlot} from '@gramlot/gramlot';
import inputs from '/collections/inputs/index.js'; import grid from '/collections/grid/index.js'; import layout from '/collections/layout/index.js'; import chart from '/collections/charts/index.js';
const app=new Gramlot({element:document.getElementById('app'),transport:false,collections:[layout,grid,inputs,chart],locale:'en-GB'});
app.src.startSource(${JSON.stringify(wire)}); window.qualification=app;`;
const assets=new Map([['/runtime.js',bootstrap],['/core.js',await readFile(`${base}/core.js`,'utf8')]]);
for(const name of ['grid','layout','inputs','tree','charts']) {
 const folder=`${repo}/src/gramlot/collections/${name}/assets`;
 for(const file of await readdir(folder,{recursive:true}))if(file.endsWith('.js'))assets.set(`/collections/${name}/${file}`,await readFile(`${folder}/${file}`,'utf8'));
}
assets.set('/collections/grid/collection.js',await readFile(`${base}/grid.js`,'utf8'));
const chartIcon=await readFile(`${repo}/assets/icons/chart.svg`,'utf8');
const css=await readFile(`${repo}/themes/gramlot-base/theme.css`,'utf8');
const server=createServer((req,res)=>{const path=new URL(req.url,'http://localhost').pathname;
 if(assets.has(path)){res.writeHead(200,{'Content-Type':'text/javascript'});res.end(assets.get(path));}
 else if(path==='/assets/icons/chart.svg'){res.writeHead(200,{'Content-Type':'image/svg+xml'});res.end(chartIcon);}
 else if(path==='/base.css'){res.writeHead(200,{'Content-Type':'text/css'});res.end(css);}
 else {res.writeHead(200,{'Content-Type':'text/html'});res.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><script type="importmap">{"imports":{"@gramlot/gramlot":"/core.js","@gramlot/gramlot/components":"/core.js","@gramlot/collections/inputs":"/collections/inputs/index.js","@gramlot/collections/tree":"/collections/tree/index.js"}}</script><link rel="stylesheet" href="/base.css"></head><body><div id="app"></div><script type="module" src="/runtime.js"></script></body></html>`);}});
const portIndex=process.argv.indexOf('--port');
await new Promise(resolve=>server.listen(portIndex < 0 ? 0 : Number(process.argv[portIndex+1]),'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}/`;
if(process.argv.includes('--serve')) { console.log(`Chart trial: ${url}`); await new Promise(()=>{}); }
try {
 for(const [name,engine] of Object.entries({chromium,webkit})) {
  const browser=await engine.launch(name==='chromium'?{args:['--enable-unsafe-swiftshader']}:{});
  try {
   const page=await browser.newPage({viewport:{width:1280,height:900}}), errors=[];
   page.setDefaultTimeout(7000);
   page.on('console',message=>{if(message.type()==='error')console.error(message.text());});
   page.on('pageerror',error=>{errors.push(error.message);console.error(error.stack);});
   await page.goto(url); await page.locator('#sales-grid').waitFor({timeout:5000}).catch(async error => { console.error({errors,body:await page.locator('body').innerText()}); throw error; });
   const gridToolbar=page.getByRole('toolbar',{name:'Grid toolbar'});
   assert.equal(await page.locator('#sales-frame').getByRole('toolbar').count(),1);
   const chartCommand=gridToolbar.getByRole('menuitem',{name:'Chart',exact:true});
   const searchControl=gridToolbar.locator('gramlot-search-box');
   await searchControl.waitFor();
   await gridToolbar.evaluate(menu=>menu.style.width='250px');
   await page.waitForFunction(()=>!document.querySelector('#sales-frame gramlot-menu').overflow.button.hidden);
   await gridToolbar.evaluate(menu=>menu.style.width='calc(100% - 0.75px)');
   for(const width of [1103,977,1280]) {
    await page.setViewportSize({width,height:900});
    const samples=await gridToolbar.evaluate(async menu=>{
     const result=[];
     for(let i=0;i<24;i++){
      await new Promise(requestAnimationFrame);
      result.push({more:!menu.overflow.button.hidden,width:menu.clientWidth,
       children:[...menu.children].map(n=>({slot:n.slot,width:n.getBoundingClientRect().width,margin:getComputedStyle(n).marginLeft}))});
     }
     return result;
    });
    assert.ok(samples.slice(4).every(s=>!s.more),JSON.stringify({width,samples}));
   }
   const commandBox=await chartCommand.boundingBox(), searchBox=await searchControl.boundingBox();
   assert.ok(commandBox.x >= searchBox.x+searchBox.width);
   assert.ok(Math.abs(commandBox.y+commandBox.height/2-searchBox.y-searchBox.height/2)<3);
   assert.ok(searchBox.height<=28,JSON.stringify(searchBox));
   await page.evaluate(()=>document.documentElement.style.setProperty('--gramlot-field-height','80px'));
   assert.equal((await searchControl.boundingBox()).height,searchBox.height);
   await page.evaluate(()=>document.documentElement.style.removeProperty('--gramlot-field-height'));
   assert.equal(await chartCommand.locator('img').count(),1);
   assert.equal(await searchControl.getByRole('button',{name:'Search instructions'}).isVisible(),false);
   assert.equal(await searchControl.locator('.control-box').evaluate(el=>getComputedStyle(el).borderRadius),'999px');
   await page.evaluate(()=>window.qualification.src.binding.renderer.getBaseSourceNode(document.querySelector('gramlot-search-box')).setAttr({searchHelp:true}));
   await searchControl.getByRole('button',{name:'Search instructions'}).click();
   await searchControl.getByRole('dialog',{name:'Search instructions'}).waitFor({state:'visible'});
   await page.evaluate(()=>window.qualification.src.binding.renderer.getBaseSourceNode(document.querySelector('gramlot-search-box')).setAttr({searchHelp:false}));
   await searchControl.getByRole('dialog',{name:'Search instructions'}).waitFor({state:'hidden'});
   assert.equal(await searchControl.getByRole('button',{name:'Search instructions'}).isVisible(),false);
   await chartCommand.click();
   const chart3d=page.locator('#sales-pane-view');
   await chart3d.locator('canvas').first().waitFor().catch(async error=>{console.error({errors,chart:await chart3d.innerText(),shadow:await chart3d.evaluate(n=>n.shadowRoot.innerHTML),config:await page.evaluate(()=>window.qualification.data.getItem('demo.config').asDict())});throw error;});
   await page.waitForTimeout(1500);
   assert.equal(await chart3d.getByRole('alert').isVisible(),false);
   await page.locator('#sales-pane').getByRole('button',{name:'Chart settings'}).click();
   assert.equal(await page.locator('#sales-pane-secondCaptionField').inputValue(),'region');
   assert.equal(await page.getByLabel('3D measure',{exact:true}).count(),0);
   const toggle3d=async name=>{
    await page.locator('#sales-pane').getByRole('menuitem',{name:'Choose measures',exact:true}).click();
    await page.getByRole('menuitemcheckbox',{name,exact:true}).click();
   };
   await toggle3d('Revenue');
   await page.waitForFunction(()=>window.qualification.data.getItem('demo.config.valueFields')==='units,margin');
   await toggle3d('Units');await toggle3d('Margin');
   await page.waitForFunction(()=>!window.qualification.data.getItem('demo.config.valueFields'));
   // A chart with no measures draws nothing, so it says why.
   await chart3d.getByRole('alert').waitFor();assert.match(await chart3d.getByRole('alert').textContent(),/3D bars needs at least one measure/);
   await toggle3d('Revenue');await toggle3d('Units');await toggle3d('Margin');
   await page.locator('#sales-pane-measures').locator('tr[data-row="margin"] td[data-field="color"]').dblclick();
   const color3d=page.locator('#sales-pane-measures').locator('gramlot-colorpicker input');
   await color3d.evaluate(input=>{input.value='#c044aa';input.dispatchEvent(new Event('change',{bubbles:true}));});
   await color3d.press('Enter');
   await page.waitForFunction(()=>window.qualification.data.getItem('demo.config.seriesOptions.margin.color')==='#c044aa');
   await page.locator('#sales-pane-secondCaptionField').selectOption('date');
   await page.locator('#sales-pane-secondCaptionField').selectOption('region');
   await page.waitForTimeout(700);
   const before3dResize=await chart3d.locator('canvas').first().boundingBox();
   const resize3d=page.locator('#chart-window').getByRole('button',{name:'Resize window'});
   await resize3d.focus();
   for(let i=0;i<6;i++)await resize3d.press('ArrowDown');
   await page.waitForFunction(height=>document.querySelector('#sales-pane-view').shadowRoot.querySelector('canvas').getBoundingClientRect().height>height+40,before3dResize.height);
   const box3d=await chart3d.boundingBox();
   await page.mouse.move(box3d.x+box3d.width/2,box3d.y+box3d.height/2);
   await page.mouse.down();await page.mouse.move(box3d.x+box3d.width/2+40,box3d.y+box3d.height/2+15,{steps:10});await page.mouse.up();
   await page.waitForTimeout(300);
   await page.screenshot({path:`${base}/${name}-bar3d.png`});
   for(let i=0;i<6;i++)await resize3d.press('ArrowUp');
   await page.locator('#sales-pane-chartType').selectOption('bar');
   await page.locator('#sales-pane').getByRole('button',{name:'Chart settings'}).click();

   await page.locator('#sales-pane-view').locator('svg').waitFor();
   const chart=page.locator('#sales-pane-view');
   await page.waitForFunction(()=>document.querySelector('#sales-pane-view')?.shadowRoot?.querySelector('svg')?.querySelector('path'),null,{timeout:7000}).catch(async error=>{console.error({errors,body:await page.locator('body').innerText()});throw error;});
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('demo.rows').getNode('r0').getAttr('date') instanceof Date),true);
   await page.evaluate(()=>document.documentElement.dataset.theme='dark');
   // The drawing area stays white in the dark theme; the box around it follows --gramlot-surface for the notices.
   assert.equal(await chart.evaluate(host=>getComputedStyle(host.shadowRoot.querySelector('#control').lastElementChild).backgroundColor),'rgb(255, 255, 255)');
   const beforeResize=await chart.locator('svg').boundingBox();
   const resizeHandle=page.locator('#chart-window').getByRole('button',{name:'Resize window'});
   await resizeHandle.focus();
   for(let i=0;i<8;i++) await resizeHandle.press('ArrowDown');
   for(let i=0;i<8;i++) await resizeHandle.press('ArrowRight');
   await page.waitForFunction(initial=>{
    const host=document.querySelector('#sales-pane-view'),svg=host.shadowRoot.querySelector('svg').getBoundingClientRect(),box=host.getBoundingClientRect();
    return svg.height>initial.height+50&&svg.width>initial.width+50&&Math.abs(svg.height-box.height)<2&&Math.abs(svg.width-box.width)<2;
   },beforeResize);
   for(let i=0;i<8;i++) await resizeHandle.press('ArrowUp');
   for(let i=0;i<8;i++) await resizeHandle.press('ArrowLeft');
   const bar=await chart.locator('svg').innerHTML();
   const drawer=page.locator('#chart-window').getByRole('button',{name:'Chart settings'});
   assert.equal(await drawer.getByText('⚙', {exact:true}).isVisible(),true);
   assert.equal(await page.locator('#sales-pane gramlot-button[title="Chart settings"]').getAttribute('title'),'Chart settings');
   assert.equal(await page.locator('#sales-pane-chartType').isVisible(),false);
   await page.mouse.move(0,0);
   await drawer.evaluate(button=>button.blur());
   const metrics=await drawer.evaluate(button=>{
    const icon=button.querySelector('.icon'), box=button.getBoundingClientRect(), style=getComputedStyle(button);
    return {width:box.width,height:box.height,icon:getComputedStyle(icon).fontSize,border:style.borderTopColor,background:style.backgroundColor};
   });
   assert.equal(metrics.icon,'24px');
   assert.equal(metrics.border,'rgba(0, 0, 0, 0)');
   assert.equal(metrics.background,'rgba(0, 0, 0, 0)');
   assert.ok(metrics.width>=36 && metrics.width<=40,JSON.stringify(metrics));
   assert.ok(metrics.height>=36 && metrics.height<=40,JSON.stringify(metrics));
   await page.evaluate(()=>document.documentElement.style.setProperty('--gramlot-button-icon-size','28px'));
   assert.equal(await drawer.evaluate(button=>getComputedStyle(button.querySelector('.icon')).fontSize),'28px');
   await page.evaluate(()=>document.documentElement.style.removeProperty('--gramlot-button-icon-size'));
   await page.evaluate(()=>document.documentElement.style.setProperty('--gramlot-touch-target','44px'));
   const touch=await drawer.boundingBox();
   assert.ok(touch.width>=44 && touch.height>=44);
   await page.evaluate(()=>document.documentElement.style.removeProperty('--gramlot-touch-target'));
   await drawer.focus();
   await drawer.press('Space');
   await page.locator('#sales-pane-chartType').waitFor({state:'visible'});
   await drawer.click();
   await page.locator('#sales-pane-chartType').waitFor({state:'hidden'});
   await drawer.click();
   await page.locator('#sales-pane-chartType').selectOption('line');
   await page.waitForFunction(()=>window.qualification.data.getItem('demo.config.chartType')==='line');
   await page.waitForFunction(previous=>document.querySelector('#sales-pane-view')?.shadowRoot?.querySelector('svg')?.innerHTML!==previous,bar);
   await page.locator('#sales-pane-captionField').selectOption('order');
   const measures=page.locator('#sales-pane-measures');
   const toggleMeasure=async name=>{
    await page.locator('#sales-pane').getByRole('menuitem',{name:'Choose measures',exact:true}).click();
    await page.getByRole('menuitemcheckbox',{name,exact:true}).click();
   };
   assert.deepEqual(await page.locator('#sales-pane-captionField option').evaluateAll(nodes=>nodes.map(n=>n.value)), ['order','date','region','product','units','revenue','margin']);
   await page.locator('#sales-pane-chartType').selectOption('map3D');
   await page.locator('#sales-pane-captionField').selectOption('region');
   const salesGeo={type:'FeatureCollection',features:['North','South','West','East'].map((name,i)=>({type:'Feature',properties:{name},geometry:{type:'Polygon',coordinates:[[[i,0],[i+0.8,0],[i+0.8,1],[i,0]]]}}))};
   await page.locator('#sales-pane').getByLabel('Load GeoJSON').setInputFiles({name:'regions.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify(salesGeo))});
   await page.waitForFunction(()=>window.qualification.data.getItem('demo.config.geoJSON')?.features.length===4);
   await page.waitForFunction(()=>document.querySelector('#sales-pane-view').shadowRoot.querySelector('[role=alert]').textContent.includes('upstream'));
   assert.equal(await page.getByLabel('Aggregation',{exact:true}).count(),0);
   await page.locator('#sales-pane-chartType').selectOption('bar');
   await page.locator('#sales-pane-captionField').selectOption('product');
   await page.waitForFunction(()=>document.querySelector('#sales-pane-view').shadowRoot.querySelector('svg').textContent.includes('Notebook'));
   for(const type of ['area','horizontalBar']) await page.locator('#sales-pane-chartType').selectOption(type);
   await page.locator('#sales-pane-chartType').selectOption('pie');
   await page.waitForFunction(()=>document.querySelector('#sales-pane-view').shadowRoot.querySelector('[role="alert"]').hidden);
   // Pie reads its one measure from the measure role, the first numeric column; the bar selection stays in seriesOptions.
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('demo.config.valueFields')),'units');
   assert.equal(await page.locator('#sales-pane-role-measure').inputValue(),'units');
   await page.locator('#sales-pane-captionField').selectOption('date');
   await page.waitForTimeout(1100);
   const checkLegendSpace=async()=>{
    const boxes=await chart.locator('svg').evaluate(svg=>{
     const frame=svg.getBoundingClientRect();
     return [...svg.querySelectorAll('text')].filter(t=>/^2026-/.test(t.textContent)).map(t=>{const r=t.getBoundingClientRect();return {top:r.top-frame.top,bottom:r.bottom-frame.top,height:frame.height};});
    });
    assert.ok(boxes.length>=12);
    assert.ok(boxes.every(r=>r.bottom<=r.height-50||r.top>=r.height-45),'slice labels stay above the reserved legend band');
   };
   await checkLegendSpace();
   await resizeHandle.focus();
   for(let i=0;i<8;i++) await resizeHandle.press('ArrowDown');
   await page.waitForTimeout(300);
   await checkLegendSpace();
   await page.screenshot({path:`${base}/${name}-pie-legend.png`});
   for(let i=0;i<8;i++) await resizeHandle.press('ArrowUp');
   await page.locator('#sales-pane-captionField').selectOption('product');
   // The measures menu belongs to the types with a list of measures; pie reads its measure role.
   await page.locator('#sales-pane-chartType').selectOption('bar');
   await toggleMeasure('Units'); await toggleMeasure('Margin');
   for(const type of ['pie','donut','stackedBar','stackedArea']) {
    await page.locator('#sales-pane-chartType').selectOption(type);
    await page.waitForFunction(()=>document.querySelector('#sales-pane-view').shadowRoot.querySelector('svg').textContent.includes('Notebook'));
   }
   await page.locator('#sales-pane-captionField').selectOption('units');
   await page.locator('#sales-pane-chartType').selectOption('scatter');
   await page.waitForFunction(()=>document.querySelector('#sales-pane-view').shadowRoot.querySelector('[role="alert"]').hidden);
   await toggleMeasure('Units'); await toggleMeasure('Margin');
   await page.locator('#sales-pane-chartType').selectOption('line');
   await page.locator('#sales-pane-captionField').selectOption('order');
   await toggleMeasure('Revenue');
   await page.waitForFunction(()=>window.qualification.data.getItem('demo.config.valueFields')==='units,margin');
   await page.waitForFunction(()=>document.querySelector('#sales-pane-measures').shadowRoot.querySelectorAll('tbody tr[data-row]').length===2);
   await page.waitForFunction(()=>{const text=document.querySelector('#sales-pane-view').shadowRoot.querySelector('svg').textContent;return text.includes('units')&&text.includes('margin')&&!text.includes('revenue');});
   await toggleMeasure('Margin'); await toggleMeasure('Units');
   await page.waitForFunction(()=>!window.qualification.data.getItem('demo.config.valueFields'));
   await page.waitForFunction(()=>document.querySelector('#sales-pane-measures').shadowRoot.querySelectorAll('tbody tr[data-row]').length===0);
   await toggleMeasure('Units'); await toggleMeasure('Margin');
   const axisCell=measures.locator('tr[data-row="units"] td[data-field="axis"]');
   await axisCell.dblclick();
   let axisEditor=measures.locator('gramlot-filtering-select input');
   await axisEditor.fill('Left');
   await page.getByRole('option',{name:'Left',exact:true}).click();
   await axisEditor.press('Tab');
   await page.waitForFunction(()=>document.querySelector('#sales-pane-view').shadowRoot.querySelector('svg').textContent.includes('units, margin'));
   await axisCell.dblclick();
   axisEditor=measures.locator('gramlot-filtering-select input');
   await axisEditor.fill('Right');
   await page.getByRole('option',{name:'Right',exact:true}).click();
   await axisEditor.press('Enter');
   await measures.locator('tr[data-row="units"] td[data-field="color"]').dblclick();
   const colorEditor=measures.locator('gramlot-colorpicker input');
   await colorEditor.evaluate(input=>{
    input.value='#b43cde'; input.dispatchEvent(new Event('change',{bubbles:true}));
   });
   await colorEditor.press('Enter');
   await page.waitForFunction(()=>window.qualification.data.getItem('demo.config.seriesOptions.units.color')==='#b43cde');
   await page.waitForFunction(()=>document.querySelector('#sales-pane-view').shadowRoot.querySelector('svg').innerHTML.includes('#b43cde'));
   const swatch=measures.locator('tr[data-row="units"] .cell-color-swatch');
   await page.waitForFunction(()=>document.querySelector('#sales-pane-measures').shadowRoot.querySelector('tr[data-row="units"] .cell-color-swatch')?.style.backgroundColor==='rgb(180, 60, 222)');
   assert.equal(await swatch.getAttribute('title'),'#b43cde');
   assert.equal(await measures.locator('tr[data-row="units"] td[data-field="color"]').innerText(),'');
   await toggleMeasure('Units'); await toggleMeasure('Units');
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('demo.config.seriesOptions.units.axis')),'right');
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('demo.config.seriesOptions.units.color')),'#b43cde');
   await page.waitForFunction(()=>document.querySelector('#sales-pane-view')?.shadowRoot?.querySelector('svg')?.textContent.includes('ORD-001'));
   await page.waitForFunction(()=>document.querySelector('#sales-pane-chartType')?.getBoundingClientRect().width>180);
   await page.waitForTimeout(1100); // Let ECharts finish its series entrance animation for visual QA.
   await page.screenshot({path:`${base}/${name}-overview.png`,fullPage:false});
   const originalControl=await page.locator('#sales-pane-chartType').elementHandle();
   await page.locator('#sales-pane').getByRole('button',{name:'Detach Chart configuration'}).click();
   const beforeConfigResize=await measures.boundingBox();
   const configResize=page.locator('#sales-pane-layout').getByRole('button',{name:'Resize window'});
   await configResize.focus();
   for(let i=0;i<12;i++)await configResize.press('ArrowRight');
   await page.waitForFunction(initial=>{
    const host=document.querySelector('#sales-pane-measures'),table=host.shadowRoot.querySelector('tbody').closest('table');
    const viewport=host.shadowRoot.querySelector('.body-viewport');
    return host.getBoundingClientRect().width>initial+80 && Math.abs(table.getBoundingClientRect().width-viewport.clientWidth)<3;
   },beforeConfigResize.width);
   await page.locator('#sales-pane-chartType').selectOption('bar');
   await page.waitForFunction(()=>window.qualification.data.getItem('demo.config.chartType')==='bar');
   await page.locator('#sales-pane-layout').getByRole('button',{name:'Close window'}).click();
   assert.equal(await page.locator('#sales-pane-chartType').inputValue(),'bar');
   assert.equal(await originalControl.evaluate(node=>node.isConnected),true);
   const search=page.getByRole('searchbox',{name:'Filter rows'});
   await page.locator('#sales-frame button.label-menu-trigger').first().click();await page.getByRole('menuitemcheckbox',{name:'Region',exact:true}).click();
   await search.fill('^North');await search.press('Enter');
   await page.waitForFunction(()=>{const s=document.querySelector('#sales-pane-view')?.shadowRoot?.querySelector('svg')?.textContent; return s?.includes('ORD-001')&&!s.includes('ORD-002');}).catch(async error=>{await page.screenshot({path:`${base}/${name}-failure.png`,fullPage:false});console.error({errors,svg:await chart.locator('svg').textContent(),filter:await search.inputValue(),box:await chart.boundingBox()});throw error;});
   const detached=await page.evaluate(()=>{const node=window.qualification.src.binding.nodeIds.get('salesGrid');node.parentBag.popNode('grid');return node.gridSearch.view===null;});
   assert.equal(detached,true,'removed grid releases its view');
   await page.evaluate(()=>window.qualification.data.getItem('demo.rows').setItem('r12',null,{order:'ORD-013',date:new Date('2027-01-15T00:00:00Z'),region:'North',product:'Monitor',units:21,revenue:5000,margin:800}));
   await page.waitForFunction(()=>document.querySelector('#sales-pane-view')?.shadowRoot?.querySelector('svg')?.textContent.includes('ORD-013')).catch(async error=>{console.error({errors,svg:await chart.locator('svg').textContent()});throw error;});
   await page.screenshot({path:`${base}/${name}.png`,fullPage:false});
   const independent=page.locator('#metrics-pane');
   await independent.getByRole('button',{name:'Chart settings'}).click();
   await page.locator('#metrics-pane-chartType').selectOption('line');
   await page.waitForFunction(()=>window.qualification.data.getItem('metrics.config.chartType')==='line');
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('demo.config.chartType')),'bar');
   await page.evaluate(()=>window.qualification.data.getItem('metrics.rows').setItem('c',new window.qualification.data.constructor({team:'Support',hours:12,tickets:4})));
   await page.waitForFunction(()=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('svg').textContent.includes('Support'));
   assert.deepEqual(await page.locator('#metrics-pane-captionField option').evaluateAll(nodes=>nodes.map(n=>n.value)),['team','hours','tickets']);
   const originalChart=await page.locator('#metrics-pane-view').elementHandle();
   await page.evaluate(()=>{
    const data=window.qualification.data;
    data.setItem('metrics.config.seriesOptions.hours.color','#123456');
    data.setItem('metrics.config.seriesOptions.hours.selected',false);
    for(const row of data.getItem('metrics.rows').getNodes())row.staticValue.setItem('cost',25);
   });
   await page.waitForFunction(()=>[...document.querySelector('#metrics-pane-captionField').options].some(o=>o.value==='cost'));
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('metrics.config.seriesOptions.hours.color')),'#123456');
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('metrics.config.seriesOptions.hours.selected')),false);
   await independent.getByRole('menuitem',{name:'Choose measures',exact:true}).click();
   await page.getByRole('menuitemcheckbox',{name:'Cost',exact:true}).click();
   await page.waitForFunction(()=>window.qualification.data.getItem('metrics.config.seriesOptions.cost.selected')===false);
   await page.evaluate(()=>{for(const row of window.qualification.data.getItem('metrics.rows').getNodes())row.staticValue.setItem('cost','text');});
   await page.waitForFunction(()=>!window.qualification.data.getItem('metrics.config.seriesOptions').getNode('cost'));
   assert.equal(await page.locator('#metrics-pane-captionField option[value="cost"]').count(),1);
   await page.locator('#metrics-pane-captionField').selectOption('hours');
   await page.evaluate(()=>{for(const row of window.qualification.data.getItem('metrics.rows').getNodes())row.staticValue.popNode('hours');});
   await page.waitForFunction(()=>window.qualification.data.getItem('metrics.config.captionField')==='team');
   assert.equal(await page.locator('#metrics-pane-captionField').inputValue(),'team');
   await page.evaluate(()=>{for(const row of window.qualification.data.getItem('demo.rows').getNodes())row.setAttr({profit:42});});
   await page.waitForFunction(()=>[...document.querySelector('#sales-pane-captionField').options].some(o=>o.value==='profit'));
   await page.evaluate(()=>{const rows=window.qualification.data.getItem('metrics.rows');for(const row of [...rows.getNodes()])rows.popNode(row.label);});
   await page.waitForFunction(()=>document.querySelector('#metrics-pane-view').shadowRoot.textContent.includes('No data to display'));
   assert.ok(await page.evaluate(()=>window.qualification.data.getItem('metrics.config.seriesOptions').getNodes().length>0));
   await page.evaluate(()=>window.qualification.data.getItem('metrics.rows').setItem('new',new window.qualification.data.constructor({label:'New schema',count:7})));
   await page.waitForFunction(()=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('svg').textContent.includes('New schema'));
   assert.deepEqual(await page.locator('#metrics-pane-captionField option').evaluateAll(nodes=>nodes.map(n=>n.value)),['label','count']);
   assert.equal(await originalChart.evaluate(node=>node===document.querySelector('#metrics-pane-view')),true);
   await page.evaluate(()=>{
    const data=window.qualification.data,old=data.getItem('metrics.rows'),Bag=old.constructor;
    data.setItem('metrics.rows',new Bag({fresh:new Bag({label:'Replacement result',count:21})}));
    old.setItem('detached',new Bag({label:'Detached old result',count:999}));
   });
   await page.waitForFunction(()=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('svg')?.textContent.includes('Replacement result'));
   assert.doesNotMatch(await page.locator('#metrics-pane-view svg').textContent(),/Detached old result/);
   assert.equal(await originalChart.evaluate(node=>node===document.querySelector('#metrics-pane-view')),true);
   await page.locator('#chart-window').getByRole('button',{name:'Close window'}).click();
   const fieldPane=page.locator('#field-pane');
   await fieldPane.getByRole('button',{name:'Chart settings'}).click();
   await page.locator('#field-pane-view canvas').first().waitFor();
   for(const type of ['surface','scatter3D','line3D']) {
    await page.locator('#field-pane-chartType').selectOption(type);
    await page.waitForTimeout(500);
    assert.equal(await page.locator('#field-pane-view').getByRole('alert').isVisible(),false);
    await page.locator('#field-pane-view').screenshot({path:`${base}/${name}-${type}.png`});
   }
   const geographicPane=page.locator('#geographic-pane');
   await geographicPane.getByRole('button',{name:'Chart settings'}).click();
   await page.locator('#geographic-pane-view canvas').first().waitFor();
   for(const [type,geometry] of [['map',null],['map3D',null],['lines3D','route'],['polygons3D','polygon']]) {
    await page.locator('#geographic-pane-chartType').selectOption(type);
    if(geometry)await page.locator('#geographic-pane-geometryField').selectOption(geometry);
    await page.waitForTimeout(700);
    assert.equal(await page.locator('#geographic-pane-view').getByRole('alert').isVisible(),false,await page.locator('#geographic-pane-view').locator('[role="alert"]').textContent());
    await page.locator('#geographic-pane-view').screenshot({path:`${base}/${name}-${type}.png`});
   }
   await page.locator('#geographic-pane-chartType').selectOption('map');
   await page.locator('#geographic-pane-mapValueField').selectOption('costs');
   assert.equal(await page.locator('#geographic-pane-mapValueField').inputValue(),'costs');
   const geoInput=geographicPane.getByLabel('Load GeoJSON');
   const uploaded={type:'FeatureCollection',features:[{type:'Feature',properties:{name:'West'},geometry:{type:'Polygon',coordinates:[[[0,0],[2,0],[2,2],[0,0]]]}}]};
   await geoInput.setInputFiles({name:'territories.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify(uploaded))});
   await page.waitForFunction(()=>window.qualification.data.getItem('geographic.config.geoJSON').features.length===1);
   assert.match(await geographicPane.locator('gramlot-chart-geo-json').locator('[role=status]').textContent(),/1 territories: West/);
   await geoInput.setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{bad')});
   await page.waitForFunction(()=>document.querySelector('#geographic-pane gramlot-chart-geo-json').shadowRoot.textContent.includes('GeoJSON not loaded'));
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('geographic.config.geoJSON').features.length),1);
   await geoInput.setInputFiles({name:'territories.geojson',mimeType:'application/geo+json',buffer:Buffer.from(JSON.stringify(uploaded))});
   await page.waitForFunction(()=>!document.querySelector('#geographic-pane gramlot-chart-geo-json').shadowRoot.textContent.includes('GeoJSON not loaded'));
   // A JavaScript caller authors the same component directly, with no Python composition.
   await page.evaluate(()=>{
    const app=window.qualification, Bag=app.data.getItem('geographic.config').constructor;
    app.data.setItem('direct.config',new Bag({chartType:'bar',captionField:'territory'}));
    app.src.builder.root.chartPane({node_label:'directChart',id:'direct-pane',storepath:'geographic.rows',configpath:'direct.config',rowMode:'attributes',height:'360px'});
   });
   await page.locator('#direct-pane-view svg').waitFor();
   await page.locator('#direct-pane').getByRole('button',{name:'Chart settings'}).click();
   await page.locator('#direct-pane-chartType').selectOption('line');
   await page.waitForFunction(()=>window.qualification.data.getItem('direct.config.chartType')==='line');
   assert.equal(await page.evaluate(()=>window.qualification.data.getItem('geographic.config.chartType')),'map');
   assert.equal(await page.locator('#direct-pane gramlot-chart-view').count(),1);
   await page.evaluate(()=>window.qualification.src.source.popNode('directChart'));
   await page.locator('#direct-pane').waitFor({state:'detached'});
   assert.equal(await page.evaluate(()=>[...window.qualification.src.binding.nodeIds.keys()].some(id=>id.startsWith('direct-pane_'))),false);
   assert.deepEqual(errors,[]);console.log(`${name}: toolbar, palette, chart, filter and grid removal passed`);
  } finally {await browser.close();}
 }
} finally {await new Promise(resolve=>server.close(resolve));}
