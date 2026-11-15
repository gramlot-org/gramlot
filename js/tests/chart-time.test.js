import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {ChartTimeView,timePeriod,timeDate,timeExtent,timeProfile,timeLabel} from '../src/components/chart-time.js';

test('calendar periods retain leap days and UTC boundaries without fixed month durations',()=>{
 for(const [input,step,expected] of [['2024-02-29T23:59:59Z','month','2024-02-01'],['2024-02-29T23:59:59Z','day','2024-02-29'],['2024-12-31T23:59:59Z','year','2024-01-01']])assert.equal(timeDate(timePeriod(new Date(input),step),step).toISOString().slice(0,10),expected);
 assert.equal(timeDate(timePeriod(new Date('2024-02-20'),'month')+1,'month').toISOString().slice(0,10),'2024-03-01');
 assert.throws(()=>timePeriod('2024-01-01','month'),/Date/);
 assert.throws(()=>timePeriod(new Date(),'quarter'),/step/);
});
for(const mode of ['attributes','values'])test(`temporal snapshots intersect grid filters without changing source rows: ${mode}`,()=>{
 const data=new Bag(),rows=new Bag();data.setItem('rows',rows);data.setBackref();
 for(const [i,record] of [{region:'North',date:new Date('2024-01-31T23:59:59Z'),amount:10},{region:'South',date:new Date('2024-02-01'),amount:20},{region:'North',date:new Date('2024-02-29'),amount:30},{region:'North',date:new Date('2024-04-01'),amount:40},{region:'North',date:null,amount:50}].entries())rows.setItem('r'+i,mode==='values'?new Bag(record):null,mode==='attributes'?record:{});
 const store=new BagCollectionStore(data,'rows',mode),grid=new BagCollectionView(store),view=new ChartTimeView(grid);
 grid.connect();try{
  const extent=timeExtent(store,'date','month');assert.equal(extent.max-extent.min,3,'March remains an empty period');
  view.setPeriod('date',new Date('2024-02-01'),'month');assert.deepEqual(view.getRows().map(r=>r.label),['r1','r2']);
  grid.applyFilter({value:'North',columns:['region'],dtype:'T'});assert.deepEqual(view.getRows().map(r=>r.label),['r2']);
  assert.equal(view.getRows()[0],rows.getNode('r2'));
  view.setPeriod('date',new Date('2024-03-01'),'month','empty');assert.deepEqual(view.getRows(),[]);
  view.setPeriod('',null,'month');assert.equal(view.getRows().length,4);
  assert.equal(rows.getNodes().length,5);assert.equal(store.value(rows.getNode('r2'),'amount'),30);
 }finally{grid.disconnect();}
});


test('UTC weeks begin on Monday across year and pre-epoch boundaries',()=>{
 for(const [input,expected] of [['2026-01-04T23:59:59Z','2025-12-29'],['2026-01-05T00:00:00Z','2026-01-05'],['1969-12-31T23:00:00Z','1969-12-29']]){
  const start=timeDate(timePeriod(new Date(input),'week'),'week');assert.equal(start.toISOString().slice(0,10),expected);
  assert.equal(start.getUTCDay(),1);
 }
 assert.equal(timeLabel(new Date('2025-12-29'),'week'),'2025-12-29 – 2026-01-04 UTC');
});
test('intraday periods retain UTC precision across offsets and midnight',()=>{
 const input=new Date('2026-03-29T03:24:59+02:00');
 assert.equal(timeDate(timePeriod(input,'hour'),'hour').toISOString(),'2026-03-29T01:00:00.000Z');
 assert.equal(timeDate(timePeriod(input,'minute'),'minute').toISOString(),'2026-03-29T01:24:00.000Z');
 assert.equal(timeLabel(timeDate(timePeriod(input,'hour'),'hour'),'hour'),'2026-03-29 01:00 UTC');
 assert.equal(timeDate(timePeriod(new Date('2026-12-31T23:59:00Z'),'minute')+1,'minute').toISOString(),'2027-01-01T00:00:00.000Z');
});
test('temporal profiles offer data-appropriate steps and a bounded automatic suggestion',()=>{
 let rows=[{t:new Date('2026-01-01')},{t:new Date('2026-12-31')}];
 const view={getRows:()=>rows,value:(row,field)=>row[field]};
 assert.equal(timeProfile({getRows:()=>rows,value:()=>{throw new Error('Off must not read values');}},'').first,null);
 assert.deepEqual(timeProfile(view,'t').steps,['day','week','month','year']);assert.equal(timeProfile(view,'t').suggested,'month');
 rows=[{t:new Date('2026-01-01T08:00Z')},{t:new Date('2026-01-01T08:30Z')}];
 assert.equal(timeProfile(view,'t').suggested,'minute');assert.equal(timeProfile(view,'t').hasClock,true);
 rows[1].t=new Date('2026-01-01T12:30Z');assert.equal(timeProfile(view,'t').suggested,'hour');
 rows=[];assert.equal(timeProfile(view,'t').first,null);assert.equal(timeProfile(view,'t').hasClock,false);
});


test('sparse snapshots retain the preceding occupied period, never future data or historical state',()=>{
 let rows=[{t:new Date('2026-01-01'),v:1},{t:new Date('2026-01-01'),v:2},{t:new Date('2026-03-01'),v:3}];
 const view=new ChartTimeView({getRows:()=>rows,value:(r,f)=>r[f]});
 for(const [cursor,values] of [['2026-04-01',[3]],['2026-02-01',[1,2]],['2025-12-01',[]],['2026-03-01',[3]]]){
  view.setPeriod('t',new Date(cursor),'month');assert.deepEqual(view.getRows().map(r=>r.v),values);
 }
 view.setPeriod('t',new Date('2026-02-01'),'month');view.getRows();assert.equal(view.snapshotDate.toISOString(),'2026-01-01T00:00:00.000Z');
 rows=rows.slice(2);assert.deepEqual(view.getRows(),[],'filtered-out earlier rows are not resurrected');
 rows.push({t:new Date('2026-02-01'),v:4});assert.deepEqual(view.getRows().map(r=>r.v),[4]);
 view.setPeriod('t',new Date('2026-04-01'),'month','empty');assert.deepEqual(view.getRows(),[]);assert.equal(view.snapshotDate,null);
});
