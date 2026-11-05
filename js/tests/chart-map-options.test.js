import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {chartMapOptions} from '../src/components/chart-map-options.js';
import {ChartRenderer} from '../src/components/chart-renderer.js';
const geo={type:'FeatureCollection',features:['Alpha','Beta','Missing'].map((name,i)=>({type:'Feature',properties:{name},geometry:{type:'Polygon',coordinates:[[[i,0],[i+.8,0],[i+.8,1],[i,0]]]}}))};
for(const mode of ['attributes','values'])test(`2D choropleth scale, labels, unique territories and SVG rendering: ${mode}`,()=>{
 const rows=new Bag(),data=new Bag();data.setItem('rows',rows);data.setBackref();
 const put=(id,r)=>rows.setItem(id,mode==='values'?new Bag(r):null,mode==='attributes'?r:{});
 put('a',{territory:'Alpha',label:'A',amount:0,change:-10});
 put('b',{territory:'Beta',label:'B',amount:20,change:5});
 const view=new BagCollectionView(new BagCollectionStore(rows,mode));view.connect();
 const make=field=>chartMapOptions(view,'territory',field,'label','test-map',geo,'Selected measure');
 try{
  const options=make('amount');assert.equal(options.series[0].type,'map');assert.equal(options.visualMap.min,0);assert.equal(options.visualMap.max,20);
  assert.equal(options.series[0].data[0].value,0);assert.equal(options.series[0].data.some(row=>row.name==='Missing'),false);
  assert.equal(options.series[0].label.formatter({name:'Beta',value:20}),'20');
  assert.equal(options.series[0].label.formatter({name:'Alpha',value:0}),'0');assert.match(options.tooltip.formatter({name:'Missing',value:NaN}),/No data/);
  const signed=make('change');assert.equal(signed.visualMap.min,-10);assert.equal(signed.visualMap.max,10);
  const structure=new Bag({chartType:'map',captionField:'territory',mapLabelField:'label',mapValueField:'change',valueFields:'amount'});
  structure.setItem('geoJSON',geo);
  const chart=new ChartRenderer(null,view,{renderer:'svg',ssr:true,width:640,height:400});
  try{chart.update(structure,new Bag({amount:new Bag({axis:'left',color:'#123456'}),change:new Bag({caption:'Annual change (%)'})}));assert.match(chart.svg(),/Annual change/);}finally{chart.dispose();}
  put('c',{territory:'Alpha',label:'A',amount:2,change:2});
  assert.throws(()=>make('amount'),/upstream/);
  view.applyFilter({value:'^Beta',columns:['territory'],dtype:'T',locale:'en-GB'});
  const constant=make('amount');assert.ok(constant.visualMap.max>constant.visualMap.min);
 }finally{view.disconnect();}
});
