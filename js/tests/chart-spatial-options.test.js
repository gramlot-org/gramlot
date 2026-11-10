import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {chartSpatialOptions} from '../src/components/chart-spatial-options.js';

test('3D lines, scatter and surfaces use numeric coordinates and all measures',()=>{
    const data=new Bag(),rows=new Bag();data.setItem('rows',rows);data.setBackref();
    [{x:10,y:20,a:5,b:9},{x:30,y:20,a:8,b:2},{x:10,y:40,a:6,b:3},{x:30,y:40,a:7,b:4}].forEach((r,i)=>rows.setItem(`r${i}`,null,r));
    const view=new BagCollectionView(new BagCollectionStore(data,'rows','attributes'));view.connect();
    const args=[view,null,'x','y',['a','b'],[{color:'#123456'},{color:'#654321'}]];
    try {
        args[1]='line3D';const lines=chartSpatialOptions(...args);
        assert.equal(lines.series.length,4);assert.deepEqual(lines.series[0].data,[[10,20,5],[30,20,8]]);
        args[1]='scatter3D';const scatter=chartSpatialOptions(...args);
        assert.equal(scatter.series.length,2);assert.deepEqual(scatter.series[1].data[3],[30,40,4]);
        args[1]='surface';const surface=chartSpatialOptions(...args);
        assert.deepEqual(surface.series[0].dataShape,[2,2]);assert.deepEqual(surface.series[0].data[3],[30,40,7]);
        rows.popNode('r3');
        assert.ok(Number.isNaN(chartSpatialOptions(...args).series[0].data[3][2]));
    } finally {view.disconnect();}
});
