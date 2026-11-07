import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {chartTypes,chartType} from '../src/components/chart-types/index.js';
import {EChartsAdapter} from '../src/components/chart-engines/echarts.js';
import {chartControls} from '../src/components/chart-controls.js';
import {GramlotBuilder} from '../src/builder/gramlot-builder.js';
import charts from '../src/components/charts.js';
import layout from '../src/components/layout.js';
import inputs from '../src/components/inputs.js';
import grid from '../src/components/grid.js';
import * as echarts from 'echarts/dist/echarts.js';

test('catalogue retains every supported type and rejects unknown types',()=>{
    const expected=['bar','line','area','stackedBar','stackedArea','horizontalBar','pie','donut','scatter','bar3D','line3D','scatter3D','surface','map','mapBar3D','map3D','lines3D','polygons3D','funnel','radar','parallel','heatmap','sankey'];
    assert.deepEqual(chartTypes.map(type=>type.id),expected);
    for(const id of expected)assert.equal(typeof EChartsAdapter.prototype[`render_${id}`],'function');
    assert.throws(()=>chartType('unknown'),/supported/);
});

test('configuration sections are Source, driven by the same catalogue, without aggregation',()=>{
    const builder=new GramlotBuilder(null,{collections:[charts,layout,inputs,grid]});
    chartControls(builder.root,{configpath:'config',storepath:'rows',rowMode:'attributes',prefix:'test'});
    const text=builder.toTytx();
    assert.doesNotMatch(text,/aggregation|Aggregation/);
    assert.match(text,/chartFields/);
    assert.match(text,/seriesOptions/);
    assert.match(text,/secondCaptionField/);
});

for(const id of ['bar','line','area','horizontalBar','scatter'])test(`${id} projects values and repeated rows without aggregation`,()=>{
    const records=[{x:1,y:10},{x:1,y:20},{x:2,y:7}];
    const option=EChartsAdapter.prototype[`render_${id}`]({view:{getRows:()=>records,value:(row,key)=>row[key]},
        category:'x',fields:['y'],settings:[{axis:'left',color:'#123456'}],structure:new Bag()});
    assert.deepEqual(option.dataset.source,[[1,10],[1,20],[2,7]]);
    if(id==='line'||id==='area')assert.equal(option.series[0].showSymbol,false);
});

test('ECharts keeps an isolated line sample visible',()=>{
    const rows=[{x:46,y:0.5}];
    const option=EChartsAdapter.prototype.render_line({view:{getRows:()=>rows,value:(row,key)=>row[key]},category:'x',fields:['y'],settings:[{axis:'left',color:'#123456'}]});
    assert.equal(option.series[0].showSymbol,true);
});

test('ECharts numeric coordinate axes follow moving data without forcing zero',()=>{
    const chart=echarts.init(null,null,{renderer:'svg',ssr:true,width:800,height:400});
    const settings=[{axis:'left',color:'#123456'}];
    try {
        for(const type of ['line','area','stackedArea','scatter']) {
            for(const xs of [[46,64,82],[146,164,182],[-82,-64,-46],[-5,0,5]]) {
                const rows=xs.map(x=>({x,y:2}));
                const option=EChartsAdapter.prototype[`render_${type}`]({view:{getRows:()=>rows,value:(row,key)=>row[key]},category:'x',fields:['y'],settings});
                chart.setOption(option,{notMerge:true});
                const [min,max]=chart.getModel().getComponent('xAxis').axis.scale.getExtent();
                assert.ok(min<=xs[0]&&max>=xs.at(-1));
                if(xs[0]>0)assert.ok(min>0,`${type}: no forced zero before the window`);
                if(xs.at(-1)<0)assert.ok(max<0,`${type}: no forced zero after the window`);
                assert.equal(chart.getModel().getComponent('yAxis').axis.scale.getExtent()[0],0,'measure baseline remains zero');
            }
        }
    } finally {chart.dispose();}
});
