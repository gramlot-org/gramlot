import test from 'node:test';
import assert from 'node:assert/strict';
import {validateChartGeoJSON} from '../src/components/chart-geojson.js';
test('GeoJSON import validates names, polygons, holes and coordinates without conversion',()=>{
    const ring=[[0,0],[2,0],[2,2],[0,0]];
    const feature={type:'Feature',properties:{name:'North'},geometry:{type:'Polygon',coordinates:[ring]}};
    const value={type:'FeatureCollection',features:[feature]};
    assert.equal(validateChartGeoJSON(value),value);
    assert.throws(()=>validateChartGeoJSON({...value,features:[feature,feature]}),/Duplicate/);
    assert.throws(()=>validateChartGeoJSON({...value,features:[]}),/containing territories/);
    assert.throws(()=>validateChartGeoJSON({...value,features:[{...feature,geometry:{type:'Polygon',coordinates:[ring.slice(0,3)]}}]}),/unclosed/);
    assert.throws(()=>validateChartGeoJSON({...value,features:[{...feature,properties:{name:''}}]}),/properties.name/);
    assert.equal(validateChartGeoJSON({...value,features:[{...feature,geometry:{type:'MultiPolygon',coordinates:[[ring,ring]]}}]}).features.length,1);
});
