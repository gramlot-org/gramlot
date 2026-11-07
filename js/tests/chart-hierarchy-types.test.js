import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import * as echarts from 'echarts/dist/echarts.js';
import {EChartsAdapter} from '../src/components/chart-engines/echarts.js';
import {chartCapabilities,requireChartCapability} from '../src/components/chart-engines/index.js';
import {chartContext} from '../src/components/chart-renderer.js';
import {chartTypes} from '../src/components/chart-types/index.js';
import {chartPalette} from '../src/components/chart-domains.js';
import {ChartTimeView} from '../src/components/chart-time.js';

const IDS=['treemap','sunburst'];
const view=(bag,rowMode='attributes')=>({rowMode,getRows:()=>bag.getNodes(),value:(node,key)=>node.getAttr(key)});
const leaf=(name,amount)=>[name.toLowerCase(),null,{name,amount}];
const branch=(name,children,extra={})=>{
    const bag=new Bag();
    for(const [label,value,attrs] of children)bag.setItem(label,value,attrs);
    return [name.toLowerCase(),bag,{name,...extra}];
};
const tree=(...items)=>{const bag=new Bag();for(const [label,value,attrs] of items)bag.setItem(label,value,attrs);return bag;};
const seriesOptions=new Bag({amount:new Bag({caption:'Amount',axis:'left',color:'#336699'})});
const context=(bag,rowMode)=>({view:view(bag,rowMode),category:'name',fields:['amount'],settings:[{axis:'left',color:'#336699'}],structure:new Bag({}),seriesOptions});
const build=(type,ctx)=>EChartsAdapter.prototype[`render_${type}`](ctx);
function draw(option) {
    const chart=echarts.init(null,null,{renderer:'svg',ssr:true,width:640,height:400});
    try {chart.setOption(option,{notMerge:true});return chart.renderToSVGString();}
    finally {chart.dispose();}
}
const sample=()=>tree(
    branch('Eng',[branch('Platform',[leaf('Cloud',10),leaf('Tools',5)]),leaf('Hiring',3)]),
    branch('Sales',[leaf('Travel',7)]));

test('treemap and sunburst are ECharts-only, retained for other engines as unsupported',()=>{
    for(const id of IDS) {
        assert.ok(chartTypes.some(type=>type.id===id));
        assert.ok(chartCapabilities(EChartsAdapter).includes(id));
        for(const engine of ['plotly','vega','uplot'])assert.throws(()=>requireChartCapability(engine,id),/does not support/);
    }
});

test('both types read a nested Bag; a parent is the sum of its children, colors follow the top level',()=>{
    for(const id of IDS) {
        const option=build(id,context(sample()));
        const [eng,sales]=option.series[0].data;
        assert.equal(option.series[0].type,id);
        assert.deepEqual([eng.name,eng.value,sales.name,sales.value],['Eng',18,'Sales',7]);
        assert.deepEqual(eng.children.map(item=>[item.name,item.value]),[['Platform',15],['Hiring',3]]);
        assert.deepEqual(eng.children[0].children.map(item=>[item.name,item.value]),[['Cloud',10],['Tools',5]]);
        assert.equal(eng.children[0].children[1].itemStyle.color,chartPalette[0]);
        assert.equal(sales.children[0].itemStyle.color,chartPalette[1]);
        assert.match(draw(option),/<svg/);
    }
});

test('a leaf at the top level is a node without children',()=>{
    const option=build('treemap',context(tree(leaf('Solo',4))));
    assert.deepEqual(option.series[0].data.map(item=>[item.name,item.value,item.children]),[['Solo',4,undefined]]);
});

test('a null leaf is skipped and a parent whose leaves are all skipped is skipped',()=>{
    const bag=tree(branch('Eng',[leaf('Cloud',10),leaf('Idle',null)]),branch('Empty',[leaf('A',null),leaf('B',undefined)]),branch('Void',[]));
    for(const id of IDS) {
        const data=build(id,context(bag)).series[0].data;
        assert.deepEqual(data.map(item=>item.name),['Eng']);
        assert.deepEqual(data[0].children.map(item=>item.name),['Cloud']);
        assert.equal(data[0].value,10);
    }
});

test('a negative leaf and a parent carrying the measure are errors naming the node',()=>{
    for(const id of IDS) {
        assert.throws(()=>build(id,context(tree(branch('Eng',[leaf('Cloud',-1)])))),/Node Cloud has a negative amount: areas cannot be negative/);
        assert.throws(()=>build(id,context(tree(branch('Eng',[branch('Platform',[leaf('Cloud',1)],{amount:9})])))),/Node Platform has children and carries amount/);
        assert.throws(()=>build(id,context(tree(branch('Eng',[leaf('Cloud','x')])))),/finite numeric values/);
    }
});

test("rowMode='values' and a wrong measure count are errors",()=>{
    for(const id of IDS) {
        assert.throws(()=>build(id,context(sample(),'values')),/needs rowMode='attributes'/);
        const config=new Bag({chartType:id,captionField:'name',valueFields:'amount,other'});
        assert.throws(()=>chartContext(view(sample()),config,seriesOptions),/takes one measure; received 2/);
        config.setItem('valueFields',null);
        assert.throws(()=>chartContext(view(sample()),config,seriesOptions),/needs one measure; received 0/);
    }
});

test('ChartTimeView passes the rowMode of the collection view through',()=>{
    assert.equal(new ChartTimeView(view(sample())).rowMode,'attributes');
});

test('the builder reads the nested Bag again at every call, so a change at any depth is seen',()=>{
    const bag=sample();
    const cloud=bag.getNode('eng').staticValue.getNode('platform').staticValue.getNode('cloud');
    const before=build('treemap',context(bag)).series[0].data[0].value;
    cloud.setAttr({amount:100});
    assert.equal(build('treemap',context(bag)).series[0].data[0].value,before+90);
});

test('chartContext rejects a second measure for both types',()=>{
    const fields=['amount','b'];
    const options=new Bag(Object.fromEntries(fields.map(field=>[field,new Bag({axis:'left',color:'#336699'})])));
    for(const id of IDS) {
        const config=new Bag({chartType:id,captionField:'name',valueFields:fields.join(',')});
        assert.throws(()=>chartContext(view(new Bag()),config,options),{name:'ChartSyntaxError',message:/takes one measure; received 2/});
        config.setItem('valueFields','amount');
        assert.deepEqual(chartContext(view(new Bag()),config,options).fields,['amount']);
    }
});
