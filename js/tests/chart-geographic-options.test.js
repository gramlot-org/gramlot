import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {chartGeographicOptions,chartPolygonGeoJSON} from '../src/components/chart-geographic-options.js';

test('geographic shapes and independent colored measure panels',()=>{
    const ring=[[0,0],[1,0],[1,1],[0,0]],geo={type:'FeatureCollection',features:[{type:'Feature',properties:{name:'A'},geometry:{type:'Polygon',coordinates:[ring]}}]};
    const data=new Bag(),rows=new Bag();data.setItem('rows',rows);data.setBackref();
    rows.setItem('a',null,{name:'A',sales:8,costs:3,path:[[0,0,2],[1,1,3]],polygon:[ring]});
    const view=new BagCollectionView(new BagCollectionStore(rows,'attributes'));view.connect();
    const make=(type,geometry)=>chartGeographicOptions(view,type,'name',geometry,['sales','costs'],[{color:'#123456'},{color:'#654321'}],'test',geo);
    try {
        const map=make('map3D','');assert.equal(map.series.length,2);assert.equal(map.series[0].data[0].height,8);assert.equal(map.series[1].left,'50%');
        const paths=make('lines3D','path');assert.equal(paths.geo3D.length,2);assert.deepEqual(paths.series[0].data[0].coords,[[0,0,2],[1,1,3]]);assert.equal(paths.series[1].lineStyle.color,'#654321');
        const polygons=make('polygons3D','polygon');assert.equal(polygons.series[0].type,'map3D');assert.equal(polygons.series[1].data[0].height,3);
        assert.deepEqual(chartPolygonGeoJSON(view,'name','polygon'),geo);
        assert.throws(()=>chartPolygonGeoJSON(view,'name','path'),/closed coordinate rings/);
        assert.throws(()=>chartGeographicOptions(view,'map3D','name','',[],[],'test',null),/FeatureCollection/);
    } finally {view.disconnect();}
});
