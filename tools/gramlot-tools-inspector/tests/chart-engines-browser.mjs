import {chromium,webkit} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const url=process.argv[2] ?? 'http://127.0.0.1:8898/';
const output='/tmp/gramlot-chart-engines';await mkdir(output,{recursive:true});
for(const [name,engine] of Object.entries({chromium,webkit})) {
 const browser=await engine.launch(name==='chromium'?{args:['--enable-unsafe-swiftshader']}:{});
 try {
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[],requests=[];
  page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.goto(url);
  const pane=page.locator('#metrics-pane'),chart=page.locator('#metrics-pane-view');
  await chart.locator('svg').waitFor();
  assert.equal(requests.some(url=>url.includes('plotly-basic')),false,'Plotly remains lazy before selection');
  const original=await chart.elementHandle();
  const before=await page.evaluate(()=>window.qualification.data.getItem('metrics.config.seriesOptions').toTytx());
  await pane.getByRole('button',{name:'Chart settings'}).click();
  await page.locator('#metrics-pane-engine').selectOption('plotly');
  await chart.locator('.js-plotly-plot .main-svg').first().waitFor();
  const figure=()=>chart.locator('.js-plotly-plot').evaluate(node=>({data:node.data,layout:node.layout}));
  assert.deepEqual((await figure()).data.map(t=>t.y),[[24,18],[8,6]]);
  assert.equal(await page.evaluate(()=>window.qualification.data.getItem('metrics.config.seriesOptions').toTytx()),before);
  assert.equal(await original.evaluate(node=>node===document.querySelector('#metrics-pane-view')),true);
  assert.equal(await page.locator('#metrics-pane-chartType option[value="surface"]').isDisabled(),false);
  assert.equal(await page.locator('#metrics-pane-chartType option[value="surface"]').evaluate(node=>node.hidden),false);
  for(const type of ['line','pie','bar']) {
   await page.locator('#metrics-pane-chartType').selectOption(type);
   await page.waitForFunction(type=>{
    const node=document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.js-plotly-plot');
    return node?.data?.[0]?.type===(type==='line'?'scatter':type);
   },type);
  }
  await page.evaluate(()=>window.qualification.data.setItem('metrics.config.seriesOptions.tickets.axis','right'));
  await page.waitForFunction(()=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.js-plotly-plot').data[1].yaxis==='y2');
  await page.evaluate(()=>window.qualification.data.setItem('metrics.config.seriesOptions.hours.color','#cc3377'));
  await page.waitForFunction(()=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.js-plotly-plot').data[0].marker.color==='#cc3377');
  const width=(await figure()).layout.width;
  await page.setViewportSize({width:1000,height:850});
  await page.waitForFunction(width=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.js-plotly-plot').layout.width<width,width);
  const layers=await chart.locator('.main-svg').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y};}));
  assert.ok(layers.every(layer=>layer.x===layers[0].x&&layer.y===layers[0].y),'Plotly SVG layers overlap inside the shadow root');
  await chart.locator('.legend').waitFor({state:'visible'});
  await chart.screenshot({path:`${output}/${name}-plotly.png`});
  // Supported types still reject incompatible parameters without rewriting configuration.
  await page.evaluate(()=>window.qualification.data.setItem('metrics.config.chartType','scatter'));
  await chart.getByRole('alert').waitFor();assert.match(await chart.getByRole('alert').textContent(),/numeric or date/);
  assert.equal(await page.evaluate(()=>window.qualification.data.getItem('metrics.config.chartType')),'scatter');
  assert.deepEqual(await page.locator('#metrics-pane-engine option').evaluateAll(nodes=>nodes.filter(node=>!node.hidden).map(node=>node.value)),['echarts','plotly']);
  await page.locator('#metrics-pane-chartType').selectOption('pie');
  assert.deepEqual(await page.locator('#metrics-pane-engine option').evaluateAll(nodes=>nodes.filter(node=>!node.hidden).map(node=>node.value)),['echarts','plotly','vega']);
  await page.waitForFunction(()=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.js-plotly-plot').data[0].type==='pie');
  await page.evaluate(()=>{
   const rows=window.qualification.data.getItem('metrics.rows'),Bag=rows.constructor;
   rows.setItem('duplicate',new Bag({team:'Engineering',hours:5,tickets:1}));
  });
  await chart.getByRole('alert').waitFor();assert.match(await chart.getByRole('alert').textContent(),/distinct category labels/);
  assert.equal(await page.evaluate(()=>window.qualification.data.getItem('metrics.rows').getNodes().length),3);
  await page.evaluate(()=>window.qualification.data.getItem('metrics.rows').popNode('duplicate'));
  await chart.getByRole('alert').waitFor({state:'hidden'});
  // Same configuration back to ECharts; no selection, axis or color is rewritten.
  await page.locator('#metrics-pane-engine').selectOption('echarts');
  await page.waitForFunction(()=>!document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.js-plotly-plot'));
  assert.equal(await page.locator('#metrics-pane-chartType option[value="surface"]').isDisabled(),false);
  assert.equal(await page.evaluate(()=>window.qualification.data.getItem('metrics.config.seriesOptions.hours.color')),'#cc3377');
  // Rapid switches and a replaced store must settle on the last requested engine/result.
  await page.evaluate(()=>{
   const data=window.qualification.data,Bag=data.getItem('metrics.rows').constructor;
   data.setItem('metrics.config.engine','plotly');data.setItem('metrics.config.engine','echarts');data.setItem('metrics.config.engine','plotly');
   data.setItem('metrics.config.chartType','line');data.setItem('metrics.rows',new Bag({x:new Bag({team:'Replacement',hours:50,tickets:7})}));
  });
  await page.waitForFunction(()=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.js-plotly-plot')?.data?.[0]?.y?.[0]===50);
  assert.equal(await chart.locator('.js-plotly-plot').count(),1);
  // Vega uses the same retained configuration and updates its View for data-only changes.
  await page.evaluate(()=>{
   const data=window.qualification.data,Bag=data.getItem('metrics.rows').constructor;
   data.setItem('metrics.rows',new Bag({a:new Bag({team:'Engineering',hours:24,tickets:8}),b:new Bag({team:'Design',hours:18,tickets:6})}));
   data.setItem('metrics.config.chartType','bar');
  });
  const retained=await page.evaluate(()=>window.qualification.data.getItem('metrics.config.seriesOptions').toTytx());
  await page.locator('#metrics-pane-engine').selectOption('vega');
  await chart.locator('svg .measure0').waitFor();
  assert.equal(await chart.locator('.measure0 path').count(),2);
  assert.match(await chart.locator('svg').textContent(),/Engineering/);
  assert.match(await chart.locator('svg').textContent(),/tickets/);
  assert.equal(await page.evaluate(()=>window.qualification.data.getItem('metrics.config.seriesOptions').toTytx()),retained);
  assert.equal(await page.locator('#metrics-pane-chartType option[value="surface"]').isDisabled(),true);
  assert.equal(await page.locator('#metrics-pane-chartType option[value="surface"]').evaluate(node=>node.hidden),true);
  const vegaSvg=await chart.locator('svg').elementHandle();
  const barsBefore=await chart.locator('.measure0').innerHTML();
  await page.evaluate(()=>window.qualification.data.setItem('metrics.rows.a.hours',30));
  await page.waitForFunction(previous=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('.measure0').innerHTML!==previous,barsBefore);
  assert.equal(await vegaSvg.evaluate(node=>node===document.querySelector('#metrics-pane-view').shadowRoot.querySelector('svg')),true);
  for(const [type,mark] of [['line','.measure0'],['pie','.pieSlices'],['bar','.measure0']]) {
   await page.locator('#metrics-pane-chartType').selectOption(type);await chart.locator(mark).waitFor();
   if(type==='pie')await chart.screenshot({path:`${output}/${name}-vega-pie.png`});
  }
  const vegaWidth=(await chart.locator('svg').boundingBox()).width;
  await page.setViewportSize({width:1200,height:950});
  await page.waitForFunction(previous=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('svg').getBoundingClientRect().width>previous,vegaWidth);
  await chart.screenshot({path:`${output}/${name}-vega.png`});
  await page.evaluate(()=>window.qualification.data.setItem('metrics.config.chartType','surface'));
  await chart.getByRole('alert').waitFor();assert.match(await chart.getByRole('alert').textContent(),/Vega does not support surface/);
  assert.equal(await page.evaluate(()=>window.qualification.data.getItem('metrics.config.chartType')),'surface');
  assert.deepEqual(await page.locator('#metrics-pane-engine option').evaluateAll(nodes=>nodes.filter(node=>!node.hidden).map(node=>node.value)),['echarts','plotly']);
  await page.locator('#metrics-pane-chartType').selectOption('pie');
  assert.deepEqual(await page.locator('#metrics-pane-engine option').evaluateAll(nodes=>nodes.filter(node=>!node.hidden).map(node=>node.value)),['echarts','plotly','vega']);
  await page.evaluate(()=>window.qualification.data.setItem('metrics.rows.a.hours',-5));
  await chart.getByRole('alert').waitFor();assert.match(await chart.getByRole('alert').textContent(),/nonnegative/);
  await page.evaluate(()=>window.qualification.data.setItem('metrics.rows.a.hours',30));
  await chart.getByRole('alert').waitFor({state:'hidden'});
  await page.locator('#metrics-pane-engine').selectOption('plotly');
  await chart.locator('.js-plotly-plot .main-svg').first().waitFor();
  await page.locator('#metrics-pane-engine').selectOption('vega');await chart.locator('.pieSlices').waitFor();
  // uPlot shares the same line configuration, with explicit numeric/date X requirements.
  await page.locator('#metrics-pane-chartType').selectOption('line');
  await page.locator('#metrics-pane-engine').selectOption('uplot');
  await chart.getByRole('alert').waitFor();
  assert.match(await chart.getByRole('alert').textContent(),/numeric or date/);
  assert.equal(await page.evaluate(()=>window.qualification.data.getItem('metrics.config.captionField')),'team');
  await page.evaluate(()=>{
   const data=window.qualification.data,Bag=data.getItem('metrics.rows').constructor,rows=new Bag();
   for(let i=0;i<600;i++)rows.setItem(`r${i}`,new Bag({team:i/60,hours:Math.sin(i/30),tickets:100*Math.cos(i/30)}));
   data.setItem('metrics.rows',rows);
  });
  await chart.locator('.uplot canvas').waitFor();
  assert.deepEqual(await page.locator('#metrics-pane-chartType option').evaluateAll(nodes=>nodes.filter(n=>!n.hidden).map(n=>n.value)),['line']);
  assert.match(await chart.locator('.u-legend').textContent(),/hours/);
  const canvas=await chart.locator('canvas').elementHandle();
  const pixels=await canvas.evaluate(node=>node.toDataURL());
  await page.evaluate(()=>window.qualification.data.setItem('metrics.rows.r100.hours',5));
  await page.waitForFunction(before=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('canvas').toDataURL()!==before,pixels);
  assert.equal(await canvas.evaluate(node=>node===document.querySelector('#metrics-pane-view').shadowRoot.querySelector('canvas')),true);
  const canvasWidth=await canvas.evaluate(node=>node.width);
  await page.setViewportSize({width:1050,height:850});
  await page.waitForFunction(width=>document.querySelector('#metrics-pane-view').shadowRoot.querySelector('canvas').width<width,canvasWidth);
  await chart.screenshot({path:`${output}/${name}-uplot.png`});
  await page.evaluate(()=>window.qualification.data.setItem('metrics.config.seriesOptions.hours.color','#007755'));
  await page.waitForFunction(()=>[...document.querySelector('#metrics-pane-view').shadowRoot.querySelectorAll('.u-marker')].some(node=>node.style.borderColor==='rgb(0, 119, 85)'));
  await page.evaluate(()=>{
   for(const option of window.qualification.data.getItem('metrics.config.seriesOptions').getNodes())option.getValue().setItem('selected',false);
  });
  await page.waitForFunction(()=>window.qualification.data.getItem('metrics.config.valueFields')==='');
  await chart.locator('.uplot canvas').waitFor();
  assert.equal(await chart.getByRole('alert').isVisible(),false);
  await page.evaluate(()=>window.qualification.data.setItem('metrics.config.seriesOptions.hours.selected',true));
  await page.locator('#metrics-pane-engine').selectOption('vega');await chart.locator('.measure0').waitFor();
  assert.equal(await chart.locator('.uplot').count(),0);
  await page.locator('#metrics-pane-engine').selectOption('uplot');await chart.locator('canvas').waitFor();
  // Grid filtering remains engine independent.
  await page.getByRole('menuitem',{name:'Chart',exact:true}).click();
  const sales=page.locator('#sales-pane');await sales.getByRole('button',{name:'Chart settings'}).click();
  assert.deepEqual(await page.locator('#sales-pane-engine option').evaluateAll(nodes=>nodes.filter(node=>!node.hidden).map(node=>node.value)),['echarts']);
  assert.equal(await page.evaluate(()=>window.qualification.data.getItem('demo.config.chartType')),'bar3D');
  await page.locator('#sales-pane-chartType').selectOption('bar');
  await page.locator('#sales-pane-engine').selectOption('plotly');
  await page.locator('#sales-pane-view .js-plotly-plot').waitFor();
  await page.locator('#sales-frame gramlot-search-box input').fill('Notebook');
  await page.waitForFunction(()=>document.querySelector('#sales-pane-view').shadowRoot.querySelector('.js-plotly-plot')?.data?.[0]?.y?.length===5);
  await page.locator('#sales-frame gramlot-search-box input').fill('');
  await page.locator('#sales-pane-captionField').selectOption('date');
  await page.locator('#sales-pane-chartType').selectOption('line');
  for (const engine of ['echarts','plotly','vega','uplot']) {
   console.log(`${name}: filtering ${engine}`);
   await page.locator('#sales-pane-engine').selectOption(engine);
   const view=page.locator('#sales-pane-view');
   await view.locator(engine==='uplot'?'.uplot canvas':engine==='plotly'?'.js-plotly-plot':'svg').first().waitFor();
   const drawing=()=>view.evaluate(el=>[...el.shadowRoot.querySelectorAll('svg,canvas')].map(n=>n.tagName.toLowerCase()==='canvas'?n.toDataURL():n.innerHTML).join(''));
   await page.waitForTimeout(250); // Allow the asynchronous engine switch and initial layout to settle.
   const before=await drawing();
   await page.locator('#sales-frame gramlot-search-box input').fill('Notebook');
   await page.waitForFunction(()=>window.qualification.src.binding.nodeIds.get('salesGrid')._internal.gridCollectionView.getRows().length===5);
   await page.waitForFunction(before=>{
    const root=document.querySelector('#sales-pane-view').shadowRoot;
    return [...root.querySelectorAll('svg,canvas')].map(n=>n.tagName.toLowerCase()==='canvas'?n.toDataURL():n.innerHTML).join('')!==before;
   },before);
   assert.equal(await view.getByRole('alert').isVisible(),false,engine);
   const filteredDrawing=await drawing();
   await page.locator('#sales-frame gramlot-search-box input').fill('');
   await page.waitForFunction(()=>window.qualification.src.binding.nodeIds.get('salesGrid')._internal.gridCollectionView.getRows().length===12);
   await page.waitForFunction(previous=>{const root=document.querySelector('#sales-pane-view').shadowRoot;return [...root.querySelectorAll('svg,canvas')].map(n=>n.tagName.toLowerCase()==='canvas'?n.toDataURL():n.innerHTML).join('')!==previous;},filteredDrawing);
  }
  assert.deepEqual(errors,[]);
  console.log(`${name}: four engines, shared configuration, capabilities, incompatibilities, resize, reload and filter passed`);
 } finally {await browser.close();}
}
