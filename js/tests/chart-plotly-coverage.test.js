import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {PlotlyAdapter} from '../src/components/chart-engines/plotly.js';

function context(rows,fields=['a','b'],config={}) {
    return {view:{getRows:()=>rows,value:(row,key)=>row[key]},category:'x',fields,
        settings:fields.map((_,i)=>({axis:'left',color:i?'#654321':'#123456'})),
        structure:new Bag({secondCaptionField:'y',...config}),seriesOptions:new Bag()};
}
const adapter=new PlotlyAdapter(null);
test('Plotly 2D variants preserve selected columns, orientation, colors and stack restrictions',()=>{
    const c=context([{x:1,a:5,b:9},{x:2,a:8,b:2}]);
    for(const type of ['bar','line','area','stackedBar','stackedArea','horizontalBar','scatter']) {
        const f=adapter[`render_${type}`](c),horizontal=type==='horizontalBar';
        assert.deepEqual(f.data[0][horizontal?'x':'y'],[5,8]);
        assert.deepEqual(f.data[1][horizontal?'x':'y'],[9,2]);
        assert.equal(f.data[0].marker.color,'#123456');
        if(type==='scatter')assert.equal(f.data[0].mode,'markers');
        if(type==='stackedBar')assert.equal(f.layout.barmode,'relative');
        if(type==='stackedArea')assert.equal(f.data[0].stackgroup,'measures');
        if(type==='area')assert.equal(f.data[0].fill,'tozeroy');
    }
    c.settings[1].axis='right';
    assert.equal(adapter.render_horizontalBar(c).data[1].xaxis,'x2');
    assert.throws(()=>adapter.render_stackedBar(c),/same scale/);
    c.settings[1].axis='left';c.view.getRows()[0].a=-3;
    assert.throws(()=>adapter.render_stackedArea(c),/positive\/negative/);
    assert.equal(adapter.render_stackedBar(c).data[0].y[0],-3);
});
test('Plotly donut is a first-measure radial chart with explicit repeated-label validation',()=>{
    const c=context([{x:'A',a:5},{x:'B',a:8}],['a']);
    assert.equal(adapter.render_donut(c).data[0].hole,0.5);
    assert.deepEqual(adapter.render_donut(c).data[0].values,[5,8]);
    c.view.getRows()[1].x='A';assert.throws(()=>adapter.render_donut(c),/distinct category/);
});
test('Plotly 3D lines, scatter and surfaces preserve measures and holes',()=>{
    const rows=[{x:10,y:20,a:5,b:9},{x:30,y:20,a:8,b:2},{x:10,y:40,a:6,b:3},{x:30,y:40,a:7,b:4}];
    const c=context(rows);
    const line=adapter.render_line3D(c);assert.equal(line.data.length,4);
    assert.deepEqual(line.data[0].x,[10,30]);assert.deepEqual(line.data[0].z,[5,8]);
    const scatter=adapter.render_scatter3D(c);assert.deepEqual(scatter.data[1].z,[9,2,3,4]);
    assert.deepEqual(adapter.render_surface(c).data[0].z,[[5,8],[6,7]]);
    rows.pop();assert.deepEqual(adapter.render_surface(c).data[0].z,[[5,8],[6,null]]);
    rows.push({...rows[0]});assert.throws(()=>adapter.render_surface(c),/repeated coordinates/);
});
test('Plotly GeoJSON map retains signed scale, unmatched areas and label field',()=>{
    const geo={type:'FeatureCollection',features:['A','B','Missing'].map((name,i)=>({type:'Feature',properties:{name},geometry:{type:'Polygon',coordinates:[[[i,0],[i+0.8,0],[i+0.8,1],[i,0]]]}}))};
    const c=context([{x:'A',label:'Alpha',a:-10},{x:'B',label:'Beta',a:5}],['a'],{geoJSON:geo,mapValueField:'a',mapLabelField:'label'});
    const original=JSON.stringify(geo);
    c.structure.setItem('geoJSON',geo);
    const f=adapter.render_map(c);
    assert.equal(JSON.stringify(geo),original);
    assert.deepEqual(f.data[1].geojson.features[0].geometry.coordinates[0],[...geo.features[0].geometry.coordinates[0]].reverse());
    assert.deepEqual(f.data[0].locations,['Missing']);assert.deepEqual(f.data[1].z,[-10,5]);
    assert.equal(f.data[1].zmin,-10);assert.equal(f.data[1].zmax,10);
    assert.deepEqual(f.data[2].text,['-10','5']);
    c.structure.setItem('mapLabelMode','name');assert.deepEqual(adapter.render_map(c).data[2].text,['Alpha','Beta']);assert.equal(f.layout.geo.visible,false);
    c.view.getRows()[1].x='A';assert.throws(()=>adapter.render_map(c),/one prepared row/);
});
