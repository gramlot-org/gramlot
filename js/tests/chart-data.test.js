import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {chartData} from '../src/components/chart-data.js';

for (const mode of ['values','attributes']) test(`raw rows over filtered store: ${mode}`,()=>{
    const data=new Bag(),rows=new Bag(); data.setItem("rows",rows);data.setBackref();
    [{product:'Notebook',region:'North',amount:10},{product:'Monitor',region:'North',amount:7},{product:'Notebook',region:'South',amount:30}].forEach((r,i)=>rows.setItem(`r${i}`,mode==='values'?new Bag(r):null,mode==='attributes'?r:{}));
    const view=new BagCollectionView(new BagCollectionStore(rows,mode));view.connect();
    try {
        assert.deepEqual(chartData(view,'product',['amount']).source,[['Notebook',10],['Monitor',7],['Notebook',30]]);
        view.applyFilter({value:'^North',columns:['region'],dtype:'T',locale:'en-GB'});
        assert.deepEqual(chartData(view,'product',['amount']).source,[['Notebook',10],['Monitor',7]]);
        assert.equal(rows.getNodes().length,3);
    } finally {view.disconnect();}
});

import {chartData3D} from '../src/components/chart-data.js';
for(const mode of ['attributes','values'])test(`3D coordinates preserve individual measures: ${mode}`,()=>{
    const data=new Bag(),rows=new Bag();data.setItem('rows',rows);data.setBackref();
    [{product:'Notebook',region:'North',revenue:100},{product:'Notebook',region:'North',revenue:150},{product:'Monitor',region:'South',revenue:80}].forEach((r,i)=>rows.setItem(`r${i}`,mode==='values'?new Bag(r):null,mode==='attributes'?r:{}));
    const view=new BagCollectionView(new BagCollectionStore(rows,mode));view.connect();
    try {
        const result=chartData3D(view,'product','region','revenue');
        assert.deepEqual(result.dimensions,[['Notebook','Monitor'],['North','South']]);
        assert.deepEqual(result.source,[[0,0,100],[0,0,150],[1,1,80]]);
        view.applyFilter({value:'^North',columns:['region'],dtype:'T',locale:'en-GB'});
        assert.deepEqual(chartData3D(view,'product','region','revenue').source,[[0,0,100],[0,0,150]]);
        assert.throws(()=>chartData3D(view,'product','product','revenue'),/different dimensions/);
    } finally {view.disconnect();}
});
