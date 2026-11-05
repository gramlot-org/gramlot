import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {chartMapOptions} from '../src/components/chart-map-options.js';
import {ChartTimeView} from '../src/components/chart-time.js';
import {chartContext} from '../src/components/chart-renderer.js';
import {EChartsAdapter} from '../src/components/chart-engines/echarts.js';
import {PlotlyAdapter} from '../src/components/chart-engines/plotly.js';
import {VegaAdapter} from '../src/components/chart-engines/vega.js';
import {UPlotAdapter} from '../src/components/chart-engines/uplot.js';
const date=m=>new Date(`2026-${m}-15`);
function fixture(){
 const rows=[{date:date('01'),name:'B',x:2,y:4,amount:10,units:2},{date:date('02'),name:'A',x:8,y:9,amount:100,units:3},{date:date('02'),name:'B',x:9,y:12,amount:-20,units:5}];
 const raw={getRows:()=>rows,value:(r,f)=>r[f]},view=new ChartTimeView(raw);
 const structure=new Bag({chartType:'line',captionField:'x',valueFields:'amount,units'});
 const options=new Bag({amount:new Bag({axis:'left',color:'#123456'}),units:new Bag({axis:'right',color:'#654321'})});
 const context=()=>{const c=chartContext(view,structure,options);c.domains=view.domains(c);return c;};
 view.setPeriod('date',date('01'),'month');return {rows,raw,view,structure,options,context};
}
test('temporal domains are cached across frames and recalculated for data, filters and configuration',()=>{
 const f=fixture(),first=f.context().domains;
 assert.deepEqual(first.dimension.range,[2,9]);assert.deepEqual(first.axes.left,[-20,100]);assert.deepEqual(first.axes.right,[0,5]);
 f.view.setPeriod('date',date('02'),'month');assert.equal(f.context().domains,first);
 f.rows.push({date:date('03'),name:'C',x:12,y:3,amount:200,units:7});f.view.invalidateDomains();assert.deepEqual(f.context().domains.axes.left,[-20,200]);
 f.raw.getRows=()=>f.rows.slice(0,1);f.view.invalidateDomains();assert.deepEqual(f.context().domains.axes.left,[0,10]);
 f.structure.setItem('captionField','name');assert.deepEqual(f.context().domains.labels,['B']);
 f.view.setPeriod('',null,'month');assert.equal(f.context().domains,null);
});
test('all four adapters retain numeric domains while changing their actual data',()=>{
 const f=fixture();
 for(const month of ['01','02']){
  f.view.setPeriod('date',date(month),'month');const c=f.context();
  const bar=EChartsAdapter.prototype.render_bar(c);assert.deepEqual(bar.xAxis.data,['2','8','9']);assert.equal(typeof bar.dataset.source[0][0],'string');
  const e=EChartsAdapter.prototype.render_line(c);assert.equal(e.xAxis.min,2);assert.equal(e.xAxis.max,9);assert.equal(e.yAxis[0].max,100);assert.equal(e.yAxis[1].max,5);
  const p=new PlotlyAdapter(null).render_line(c);assert.deepEqual(p.layout.xaxis.range,[2,9]);assert.deepEqual(p.layout.yaxis.range,[-20,100]);assert.equal(p.layout.yaxis.autorange,false);
  const v=new VegaAdapter(null).render_line(c);assert.deepEqual(v.scales.find(s=>s.name==='left').domain,[-20,100]);assert.deepEqual(v.scales[0].domain,[2,9]);
  const u=new UPlotAdapter(null).render_line(c);assert.deepEqual(u.domains.dimension.range,[2,9]);assert.equal(u.data[0].length,month==='01'?1:2);
 }
});
test('missing categories retain order and pie colors across engines',()=>{
 const f=fixture();f.structure.setItem('captionField','name');f.structure.setItem('valueFields','units');
 const colors=[];
 for(const month of ['01','02']){
  f.view.setPeriod('date',date(month),'month');f.structure.setItem('chartType','bar');let c=f.context();
  assert.deepEqual(EChartsAdapter.prototype.render_bar(c).xAxis.data,['B','A']);
  assert.deepEqual(new PlotlyAdapter(null).render_bar(c).layout.xaxis.categoryarray,['B','A']);
  assert.deepEqual(new VegaAdapter(null).render_bar(c).scales[0].domain,['B','A']);
  f.structure.setItem('chartType','pie');c=f.context();
  const e=EChartsAdapter.prototype.render_pie(c).series[0].data.find(d=>d.name==='B').itemStyle.color;
  const p=new PlotlyAdapter(null).render_pie(c).data[0];assert.equal(p.marker.colors[p.labels.indexOf('B')],e);
  const v=new VegaAdapter(null).render_pie(c).scales[0];assert.equal(v.range[v.domain.indexOf('B')],e);colors.push(e);
 }
 assert.equal(colors[0],colors[1]);
});
test('stacked extents include complete positive and negative stacks, spatial coordinates retain indices',()=>{
 const f=fixture();f.structure.setItem('chartType','stackedBar');f.options.getItem('units').setItem('axis','left');
 assert.deepEqual(f.context().domains.axes.left,[-20,103]);
 f.structure.setItem('chartType','bar3D');f.structure.setItem('captionField','name');f.structure.setItem('secondCaptionField','y');
 const first=EChartsAdapter.prototype.render_bar3D(f.context());
 f.view.setPeriod('date',date('02'),'month');const second=EChartsAdapter.prototype.render_bar3D(f.context());
 assert.deepEqual(first.yAxis3D.data,second.yAxis3D.data);assert.equal(first.zAxis3D.max,second.zAxis3D.max);
 assert.equal(first.series[0].data[0][0],second.series[0].data[1][0]);
});

test('empty periods keep numeric domains and signed map colors use the complete interval',()=>{
 const f=fixture();f.view.setPeriod('date',date('03'),'month','empty');
 let c=f.context();assert.equal(EChartsAdapter.prototype.render_line(c).xAxis.type,'value');
 assert.deepEqual(new PlotlyAdapter(null).render_line(c).layout.xaxis.range,[2,9]);
 assert.deepEqual(new VegaAdapter(null).render_line(c).scales[0].domain,[2,9]);
 f.structure.setItem('chartType','map');f.structure.setItem('captionField','name');
 f.structure.setItem('mapValueField','amount');f.structure.setItem('mapLabelField','name');
 f.structure.setItem('geoJSON',{type:'FeatureCollection',features:['A','B'].map((name,i)=>({type:'Feature',properties:{name},geometry:{type:'Polygon',coordinates:[[[i,0],[i+.8,0],[i+.8,1],[i,0]]]}}))});
 for(const month of ['01','02','03']){
  f.view.setPeriod('date',date(month),'month','empty');c=f.context();
  const e=chartMapOptions(c.view,c.category,'amount','name','test',f.structure.getItem('geoJSON'),null,c.domains);
  assert.equal(e.visualMap.min,-100);assert.equal(e.visualMap.max,100);assert.equal(e.visualMap.inRange.color[0],'#b73548');
  const p=new PlotlyAdapter(null).render_map(c).data[1];assert.equal(p.zmin,-100);assert.equal(p.zmax,100);assert.equal(p.colorscale[0][1],'#b73548');
 }
});
