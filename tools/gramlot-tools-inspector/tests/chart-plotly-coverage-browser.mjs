import {chromium,webkit} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const url=process.argv[2] ?? 'http://127.0.0.1:8898/',output='/tmp/chart-plotly-coverage';await mkdir(output,{recursive:true});
for(const [name,engine] of Object.entries({chromium,webkit})) {
 const browser=await engine.launch(name==='chromium'?{args:['--enable-unsafe-swiftshader']}:{});
 try {
  const page=await browser.newPage({viewport:{width:1400,height:1000}}),errors=[],remote=[];
  page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(url))remote.push(r.url());});
  await page.goto(url);await page.locator('#metrics-pane-view svg').waitFor();
  await page.locator('#metrics-pane').getByRole('button',{name:'Chart settings'}).click();
  await page.locator('#metrics-pane-engine').selectOption('plotly');
  const plot=page.locator('#metrics-pane-view .js-plotly-plot');await plot.waitFor();
  for(const type of ['bar','line','area','stackedBar','stackedArea','horizontalBar','pie','donut']) {
   await page.locator('#metrics-pane-chartType').selectOption(type);
   await page.waitForFunction(type=>{
    const plot=document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.js-plotly-plot');
    const first=plot?.data?.[0];if(!first)return false;
    if(type==='donut')return first.type==='pie'&&first.hole===0.5;
    if(type==='pie')return first.type==='pie'&&first.hole===0;
    if(type==='horizontalBar')return first.type==='bar'&&first.orientation==='h';
    if(type==='stackedBar')return first.type==='bar'&&plot.layout.barmode==='relative';
    if(type==='stackedArea')return first.stackgroup==='measures';
    if(type==='area')return first.fill==='tozeroy';
    return first.type===(type==='line'?'scatter':'bar');
   },type);
   assert.equal(await page.locator('#metrics-pane-view').getByRole('alert').isVisible(),false);
  }
  await page.locator('#metrics-pane-captionField').selectOption('hours');
  await page.locator('#metrics-pane-chartType').selectOption('scatter');
  await page.waitForFunction(()=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.js-plotly-plot')?.data[0].mode==='markers');
  await page.locator('#field-pane').getByRole('button',{name:'Chart settings'}).click();
  await page.locator('#field-pane-engine').selectOption('plotly');
  for(const type of ['surface','scatter3D','line3D']) {
   await page.locator('#field-pane-chartType').selectOption(type);
   await page.waitForFunction(type=>{
    const el=document.querySelector('#field-pane-view').shadowRoot.querySelector('.js-plotly-plot');
    return el?._fullLayout?.scene?._scene?.glplot&&el.data?.[0]?.type===(type==='surface'?'surface':'scatter3d')&&
      (type!=='line3D'||el.data[0].mode.startsWith('lines'));
   },type);
   await page.locator('#field-pane-view canvas').first().waitFor();
   await page.locator('#field-pane-view').screenshot({path:`${output}/${name}-${type}.png`});
   assert.equal(await page.locator('#field-pane-view').getByRole('alert').isVisible(),false);
  }
  await page.locator('#geographic-pane').getByRole('button',{name:'Chart settings'}).click();
  await page.locator('#geographic-pane-chartType').selectOption('map');
  await page.locator('#geographic-pane-engine').selectOption('plotly');
  await page.locator('#geographic-pane-view .choroplethlayer path').first().waitFor();
  assert.equal(await page.locator('#geographic-pane-view').getByRole('alert').isVisible(),false);
  await page.locator('#geographic-pane-mapValueField').selectOption('costs');
  await page.waitForFunction(()=>document.querySelector('#geographic-pane-view').shadowRoot.querySelector('.js-plotly-plot')?.data?.[1]?.z?.[0]===3);
  await page.locator('#geographic-pane-view').screenshot({path:`${output}/${name}-map.png`});
  await page.setViewportSize({width:1100,height:850});await page.waitForTimeout(200);
  assert.deepEqual(remote,[],'GeoJSON maps do not fetch basemap assets');assert.deepEqual(errors,[]);
  console.log(`${name}: all 13 native Plotly types, map measure changes, WebGL scenes and local-only geometry passed`);
 }finally{await browser.close();}
}
