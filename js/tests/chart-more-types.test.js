import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import * as echarts from 'echarts/dist/echarts.js';
import {EChartsAdapter} from '../src/components/chart-engines/echarts.js';
import {chartCapabilities,requireChartCapability} from '../src/components/chart-engines/index.js';
import {chartContext} from '../src/components/chart-renderer.js';
import {chartTypes} from '../src/components/chart-types/index.js';
import {ChartTimeView} from '../src/components/chart-time.js';
import {sankeyCycle} from '../src/components/chart-sankey-options.js';

const view=rows=>({getRows:()=>rows,value:(row,key)=>row[key]});
const settings=fields=>fields.map(()=>({axis:'left',color:'#336699'}));
const options=(...entries)=>new Bag(Object.fromEntries(entries.map(([field,caption])=>[field,new Bag({caption,axis:'left',color:'#336699'})])));
const context=(rows,fields,extra={})=>({view:view(rows),category:'name',fields,settings:settings(fields),
    structure:new Bag({secondCaptionField:extra.second??null}),seriesOptions:extra.options??options(...fields.map(f=>[f,f.toUpperCase()]))});
const build=(type,ctx)=>EChartsAdapter.prototype[`render_${type}`](ctx);
/** The option must be accepted by ECharts and draw. */
function draw(option) {
    const chart=echarts.init(null,null,{renderer:'svg',ssr:true,width:640,height:400});
    try {chart.setOption(option,{notMerge:true});return chart.renderToSVGString();}
    finally {chart.dispose();}
}

test('the five types are ECharts-only, retained for other engines as unsupported',()=>{
    for(const id of ['funnel','radar','parallel','heatmap','sankey']) {
        assert.ok(chartTypes.some(type=>type.id===id));
        assert.ok(chartCapabilities(EChartsAdapter).includes(id));
        for(const engine of ['plotly','vega','uplot'])assert.throws(()=>requireChartCapability(engine,id),/does not support/);
    }
});

test('funnel: stages in store order, null stage skipped, series caption honoured',()=>{
    const rows=[{name:'Leads',n:100},{name:'Offers',n:null},{name:'Won',n:0}];
    const option=build('funnel',context(rows,['n'],{options:options(['n','Deals'])}));
    assert.deepEqual(option.series[0].data.map(({name,value})=>[name,value]),[['Leads',100],['Won',0]]);
    assert.equal(option.series[0].name,'Deals');
    assert.equal(option.series[0].sort,'none');
    assert.match(draw(option),/<svg/);
    assert.throws(()=>build('funnel',context([{name:'a',n:-1}],['n'])),/nonnegative/);
    assert.throws(()=>chartContext(view(rows),new Bag({chartType:'funnel',captionField:'name',valueFields:null}),options()),/Funnel needs one measure; received 0/);
    assert.throws(()=>build('funnel',context([{name:'a',n:'x'}],['n'])),/finite numeric/);
});

test('radar: measures are axes with data maximum, rows are polygons, rows with an empty measure are left out, series max overrides',()=>{
    const rows=[{name:'A',p:5,q:8},{name:'B',p:7,q:null},{name:'C',p:null,q:null},{name:'D',p:3,q:4}];
    const option=build('radar',context(rows,['p','q'],{options:options(['p','Price'],['q','Quality'])}));
    assert.deepEqual(option.radar.indicator,[{name:'Price',min:0,max:5},{name:'Quality',min:0,max:8}]);
    assert.deepEqual(option.series[0].data.map(item=>[item.name,item.value]),[['A',[5,8]],['D',[3,4]]]);
    const fixed=options(['p','Price'],['q','Quality']);fixed.getItem('p').setItem('max',10);
    assert.equal(build('radar',context(rows,['p','q'],{options:fixed})).radar.indicator[0].max,10);
    assert.match(draw(option),/<svg/);
    assert.throws(()=>chartContext(view(rows),new Bag({chartType:'radar',captionField:'name',valueFields:null}),options()),/Radar needs at least one measure/);
});

test('parallel: one axis per measure, one named polyline per row, nulls kept as gaps',()=>{
    const rows=[{name:'Car 1',hp:90,kg:1200},{name:'Car 2',hp:null,kg:900}];
    const option=build('parallel',context(rows,['hp','kg'],{options:options(['hp','Power'],['kg','Weight'])}));
    assert.deepEqual(option.parallelAxis.map(axis=>[axis.dim,axis.name]),[[0,'Power'],[1,'Weight']]);
    assert.deepEqual(option.series[0].data.map(item=>[item.name,item.value]),[['Car 1',[90,1200]],['Car 2',[null,900]]]);
    assert.match(draw(option),/<svg/);
});

test('heatmap: category and second dimension index the cells, color range from the data',()=>{
    const rows=[{name:'Mon',day:'9h',n:2},{name:'Mon',day:'10h',n:null},{name:'Tue',day:'9h',n:8},{name:'Tue',day:'10h',n:0}];
    const option=build('heatmap',context(rows,['n'],{second:'day'}));
    assert.deepEqual(option.xAxis.data,['Mon','Tue']);
    assert.deepEqual(option.yAxis.data,['9h','10h']);
    assert.deepEqual(option.series[0].data,[[0,0,2],[1,0,8],[1,1,0]]);
    assert.deepEqual([option.visualMap.min,option.visualMap.max],[0,8]);
    assert.equal(option.visualMap.inRange.color[1],'#336699');
    assert.match(draw(option),/<svg/);
    assert.throws(()=>chartContext(view(rows),new Bag({chartType:'heatmap',captionField:'name',secondCaptionField:null,valueFields:'n'}),options(['n','N'])),/Heatmap needs Y category/);
    assert.throws(()=>chartContext(view(rows),new Bag({chartType:'heatmap',captionField:'name',secondCaptionField:'name',valueFields:'n'}),options(['n','N'])),/Y category different from X category/);
    assert.throws(()=>build('heatmap',context([...rows,{name:'Mon',day:'9h',n:1}],['n'],{second:'day'})),/two cells for Mon \/ 9h/);
});

test('sankey: nodes from distinct names, null links skipped, a cycle is a clear error',()=>{
    const rows=[{name:'Gas',to:'Heat',v:5},{name:'Gas',to:'Power',v:null},{name:'Sun',to:'Power',v:3},{name:'Power',to:'Heat',v:1}];
    const option=build('sankey',context(rows,['v'],{second:'to'}));
    assert.deepEqual(option.series[0].data.map(node=>node.name).sort(),['Gas','Heat','Power','Sun']);
    assert.deepEqual(option.series[0].links,[{source:'Gas',target:'Heat',value:5},{source:'Sun',target:'Power',value:3},{source:'Power',target:'Heat',value:1}]);
    assert.match(draw(option),/<svg/);
    const cyclic=[...rows,{name:'Heat',to:'Gas',v:2}];
    assert.throws(()=>build('sankey',context(cyclic,['v'],{second:'to'})),/cycle: Gas → Heat → Gas/);
    assert.throws(()=>build('sankey',context([{name:'A',to:'A',v:1}],['v'],{second:'to'})),/cycle: A → A/);
    assert.deepEqual(sankeyCycle([{source:'a',target:'b'},{source:'b',target:'c'}]),null);
    assert.deepEqual(sankeyCycle([{source:'a',target:'b'},{source:'b',target:'c'},{source:'c',target:'b'}]),['b','c','b']);
});

test('chartContext wants one measure for heatmap, sankey and funnel',()=>{
    const config=new Bag({chartType:'funnel',captionField:'name',secondCaptionField:'day',valueFields:'a,b'});
    const seriesOptions=options(['a','A'],['b','B']);
    for(const id of ['heatmap','sankey','funnel']) {
        config.setItem('chartType',id);config.setItem('valueFields','a,b');
        assert.throws(()=>chartContext(view([]),config,seriesOptions),{name:'ChartSyntaxError',message:/takes one measure; received 2/});
        config.setItem('valueFields','a');
        assert.deepEqual(chartContext(view([]),config,seriesOptions).fields,['a']);
    }
    config.setItem('chartType','radar');config.setItem('valueFields','a,b');
    assert.deepEqual(chartContext(view([]),config,seriesOptions).fields,['a','b']);
});

test('time playback does not compute domains for the new types',()=>{
    const time=new ChartTimeView(view([{name:'a',n:1}]));
    time.setPeriod('when',new Date(0),'day','previous');
    assert.equal(time.domains({type:{id:'funnel',domains:false}}),null);
});
