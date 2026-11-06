import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import * as echarts from 'echarts/dist/echarts.js';
import {chartMapBar3DOptions} from '../src/components/chart-map-bar3d-options.js';
import {chartMapAnchors} from '../src/components/chart-map-anchors.js';
import {chartMapLabel} from '../src/components/chart-map-labels.js';
import {chartMapOptions} from '../src/components/chart-map-options.js';
const geo={type:'FeatureCollection',features:['A','B','Missing'].map((name,i)=>({type:'Feature',properties:{name},geometry:{type:'Polygon',coordinates:[[[i,0],[i+.8,0],[i+.8,1],[i,1],[i,0]]]}}))};
const rows=[{name:'A',revenue:10,cost:4},{name:'B',revenue:30,cost:8},{name:'unmatched',revenue:999,cost:888}];
const view={getRows:()=>rows,value:(row,key)=>row[key]};
const config=()=>{const b=new Bag({mapBarScale:'zero'});b.setItem('geoJSON',geo);return b;};
test('geographic bars preserve values, group measures and expose zero/extent with hidden reference',()=>{
 const context={view,category:'name',fields:['revenue','cost'],settings:[{color:'#112233'},{color:'#445566'}],structure:config(),seriesOptions:new Bag({revenue:new Bag({caption:'Revenue'}),cost:new Bag({caption:'Costs'})})};
 const before=JSON.stringify(rows),option=chartMapBar3DOptions(context,'sample');
 assert.deepEqual(option.series.slice(0,2).map(s=>s.data.map(d=>d.value[2])),[[10,30],[4,8]]);
 assert.deepEqual(option.series.slice(0,2).map(s=>s.itemStyle.color),['#112233','#445566']);
 assert.ok(option.series[0].data[0].value[0]<option.series[1].data[0].value[0]);
 assert.deepEqual(option.series[2].data.map(d=>d[2]),[0,30]);assert.equal(option.series[2].silent,true);
 assert.deepEqual(option.legend.data,['Revenue','Costs']);assert.equal(JSON.stringify(rows),before);
 context.structure.setItem('mapBarScale','extent');assert.deepEqual(chartMapBar3DOptions(context,'sample').series[2].data.map(d=>d[2]),[4,30]);
 context.domains={z:[2,100]};assert.deepEqual(chartMapBar3DOptions(context,'sample').series[2].data.map(d=>d[2]),[2,100]);
 context.structure.setItem('mapBarScale','invalid');assert.throws(()=>chartMapBar3DOptions(context,'sample'),/zero or extent/);
});
test('map interior anchors avoid holes and compact labels retain zero',()=>{
 const holes={type:'FeatureCollection',features:[{type:'Feature',properties:{name:'hole'},geometry:{type:'Polygon',coordinates:[[[0,0],[4,0],[4,4],[0,4],[0,0]],[[1,1],[3,1],[3,3],[1,3],[1,1]]]}}]};
 const [x,y]=chartMapAnchors(holes).get('hole');assert.ok(x>0&&x<4&&y>0&&y<4);assert.ok(!(x>1&&x<3&&y>1&&y<3));
 assert.equal(chartMapLabel('A',0),'0');assert.equal(chartMapLabel('A',1200000),new Intl.NumberFormat('en-GB',{notation:'compact',maximumFractionDigits:1}).format(1200000));assert.equal(chartMapLabel('A',NaN),'');assert.throws(()=>chartMapLabel('A',1,'invalid'),/label mode/);
});
test('rendered map colors distinguish low, high values and missing territories',()=>{
 echarts.registerMap('colors',geo);const chart=echarts.init(null,null,{renderer:'svg',ssr:true,width:600,height:400});
 try{
  chart.setOption(chartMapOptions(view,'name','revenue','name','colors',geo,'Revenue'));
  const data=chart.getModel().getSeriesByIndex(0).getData();
  const a=data.getItemVisual(data.indexOfName('A'),'style').fill,b=data.getItemVisual(data.indexOfName('B'),'style').fill;
  assert.ok(a&&b);assert.notEqual(a,b);assert.notEqual(a,'#e2e5e9');assert.ok(Number.isNaN(data.get('value',data.indexOfName('Missing'))));
 }finally{chart.dispose();}
});
