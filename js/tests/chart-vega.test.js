import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {View,parse} from 'vega';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {chartContext} from '../src/components/chart-renderer.js';
import {chartCapabilities,requireChartCapability} from '../src/components/chart-engines/index.js';
import {VegaAdapter} from '../src/components/chart-engines/vega.js';

test('Vega declares only its three implemented render methods',()=>{
 assert.deepEqual(chartCapabilities(VegaAdapter),['bar','line','pie']);
 assert.throws(()=>requireChartCapability('vega','surface'),/Vega does not support surface/);
});
for(const mode of ['attributes','values'])test(`Vega preserves measures and supports dates, axes, filters and all three SVG types: ${mode}`,async()=>{
 const root=new Bag(),rows=new Bag();root.setItem('rows',rows);root.setBackref();
 const put=(key,value)=>rows.setItem(key,mode==='values'?new Bag(value):null,mode==='attributes'?value:{});
 put('a',{name:'Alpha',date:new Date('2026-01-15T00:00:00Z'),revenue:120,units:3});
 put('b',{name:'Beta',date:new Date('2026-02-15T00:00:00Z'),revenue:180,units:7});
 const dataView=new BagCollectionView(new BagCollectionStore(root,'rows',mode));dataView.connect();
 const config=new Bag({engine:'vega',chartType:'bar',captionField:'name',valueFields:'revenue,units'});
 const settings=new Bag({revenue:new Bag({axis:'left',color:'#123456'}),units:new Bag({axis:'right',color:'#654321'})});
 const adapter=new VegaAdapter(null),snapshot=rows.toTytx();
 const make=()=>adapter.validate(chartContext(dataView,config,settings));
 try {
  for(const type of ['bar','line','pie']) {
   config.setItem('chartType',type);
   if(type==='pie') {assert.throws(make,/Pie takes one measure/);config.setItem('valueFields','revenue');}
   const spec=make();
   const view=new View(parse(spec),{renderer:'none'}).width(640).height(400);
   try {
    await view.runAsync();const svg=await view.toSVG();
    if(type==='line') {
     const symbols=()=>view.scenegraph().root.items[0].items.filter(mark=>mark.marktype==='symbol').flatMap(mark=>mark.items);
     assert.ok(symbols().every(point=>point.size===0));
     view.data('series0',[{x:'Alpha',y:120,label:'Alpha'}]);await view.runAsync();
     assert.equal(symbols().filter(point=>point.size===36).length,1);
    }
    assert.match(svg,/Alpha/);assert.match(svg,/Beta/);
    if(type!=='pie') {
     assert.deepEqual(spec.data[1].values.map(r=>r.y),[120,180]);
     assert.deepEqual(spec.data[2].values.map(r=>r.y),[3,7]);
     assert.equal(spec.scales.some(scale=>scale.name==='right'),true);
     assert.match(svg,/#123456/);assert.match(svg,/#654321/);
    } else assert.deepEqual(view.data('slices').map(row=>row.value),[120,180]);
   } finally {view.finalize();}
  }
  assert.equal(rows.toTytx(),snapshot);assert.equal(config.getItem('valueFields'),'revenue');
  config.setItem('valueFields','revenue,units');
  config.setItem('chartType','line');config.setItem('captionField','date');
  assert.equal(make().scales[0].type,'utc');
  dataView.applyFilter({value:'^Beta',columns:['name'],dtype:'T',locale:'en-GB'});
  assert.deepEqual(make().data[1].values.map(row=>row.y),[180]);
  assert.equal(make().marks.filter(mark=>mark.type==='symbol').length,2);
  config.setItem('chartType','pie');config.setItem('valueFields','revenue');put('b',{name:'Beta',date:new Date(),revenue:-1,units:7});
  assert.throws(make,/nonnegative/);assert.equal(config.getItem('chartType'),'pie');
  config.setItem('chartType','bar');assert.deepEqual(make().data[1].values.map(row=>row.y),[-1]);
 }finally {dataView.disconnect();}
});
