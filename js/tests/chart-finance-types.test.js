import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import * as echarts from 'echarts/dist/echarts.js';
import {EChartsAdapter} from '../src/components/chart-engines/echarts.js';
import {chartCapabilities,requireChartCapability} from '../src/components/chart-engines/index.js';
import {chartContext} from '../src/components/chart-renderer.js';
import {chartTypes} from '../src/components/chart-types/index.js';

const view=rows=>({getRows:()=>rows,value:(row,key)=>row[key]});
const options=(fields,extra={})=>new Bag(Object.fromEntries(fields.map(field=>[field,new Bag({caption:field.toUpperCase(),axis:'left',color:'#336699',...(field===fields[0]?extra:{})})])));
const context=(rows,fields,extra={})=>({view:view(rows),category:'name',fields,settings:fields.map(()=>({axis:'left',color:'#336699'})),
    structure:new Bag({}),seriesOptions:options(fields,extra)});
const build=(type,ctx)=>EChartsAdapter.prototype[`render_${type}`](ctx);
function draw(option) {
    const chart=echarts.init(null,null,{renderer:'svg',ssr:true,width:640,height:400});
    try {chart.setOption(option,{notMerge:true});return chart.renderToSVGString();}
    finally {chart.dispose();}
}
const OHLC=['o','h','l','c'],BOX=['mn','q1','md','q3','mx'];

test('candlestick and boxplot are ECharts-only, retained for other engines as unsupported',()=>{
    for(const id of ['candlestick','boxplot']) {
        assert.ok(chartTypes.some(type=>type.id===id));
        assert.ok(chartCapabilities(EChartsAdapter).includes(id));
        for(const engine of ['plotly','vega','uplot'])assert.throws(()=>requireChartCapability(engine,id),/does not support/);
    }
});

test('candlestick: open, high, low, close become ECharts open, close, low, high; null rows are skipped',()=>{
    const rows=[{name:new Date('2026-01-02T00:00:00Z'),o:10,h:15,l:8,c:12},{name:'b',o:12,h:null,l:9,c:10},{name:'c',o:12,h:14,l:0,c:9}];
    const option=build('candlestick',context(rows,OHLC));
    assert.deepEqual(option.xAxis.data,['2026-01-02','c']);
    assert.deepEqual(option.series[0].data,[[10,12,8,15],[12,9,0,14]]);
    assert.deepEqual(option.series[0].itemStyle,{});
    assert.match(draw(option),/<svg/);
});

test('candlestick: upColor and downColor of the first measure set the candle colors',()=>{
    const option=build('candlestick',context([{name:'a',o:1,h:3,l:0,c:2}],OHLC,{upColor:'#00aa00',downColor:'#cc0000'}));
    assert.deepEqual(option.series[0].itemStyle,{color:'#00aa00',borderColor:'#00aa00',color0:'#cc0000',borderColor0:'#cc0000'});
});

test('candlestick: a wrong measure count is an error naming the order',()=>{
    for(const fields of [['o','h','l'],[...OHLC,'x'],[]])assert.throws(()=>build('candlestick',context([],fields)),/exactly four measures.*open, high, low, close/);
});

test('boxplot: five statistics per row in order, null rows skipped',()=>{
    const rows=[{name:'A',mn:1,q1:2,md:3,q3:4,mx:5},{name:'B',mn:1,q1:null,md:3,q3:4,mx:5},{name:'C',mn:2,q1:2,md:2,q3:2,mx:2}];
    const option=build('boxplot',context(rows,BOX));
    assert.deepEqual(option.xAxis.data,['A','C']);
    assert.deepEqual(option.series[0].data,[[1,2,3,4,5],[2,2,2,2,2]]);
    assert.match(draw(option),/<svg/);
});

test('boxplot: a wrong count and a decreasing row are errors',()=>{
    assert.throws(()=>build('boxplot',context([],BOX.slice(0,4))),/exactly five measures.*min, q1, median, q3, max/);
    assert.throws(()=>build('boxplot',context([{name:'Bad row',mn:1,q1:5,md:3,q3:4,mx:6}],BOX)),/row Bad row/);
});

test('chartContext limits candlestick to four measures and boxplot to five',()=>{
    const fields=['a','b','c','d','e','f'];
    const config=new Bag({chartType:'candlestick',captionField:'name',valueFields:fields.join(',')});
    const seriesOptions=options(fields);
    assert.deepEqual(chartContext(view([]),config,seriesOptions).fields,fields.slice(0,4));
    config.setItem('chartType','boxplot');
    assert.deepEqual(chartContext(view([]),config,seriesOptions).fields,fields.slice(0,5));
});
