import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {ChartDataView} from '../src/components/chart-data-view.js';
import {ChartRenderer} from '../src/components/chart-renderer.js';

const seriesOptions = new Bag({amount:new Bag({axis:'left',color:'#5470c6'}),revenue:new Bag({axis:'left',color:'#5470c6'}),margin:new Bag({axis:'right',color:'#ee6666'})});

for (const mode of ['values','attributes']) test(`ECharts uses filtered collection rows and structure: ${mode}`, () => {
    const data = new Bag(), rows = new Bag(); data.setItem('rows', rows); data.setBackref();
    for (const [i,r] of [{name:'Alpha',amount:15},{name:'Beta',amount:24}].entries()) {
        rows.setItem(`r${i}`, mode === 'values' ? new Bag(r) : null, mode === 'attributes' ? r : {});
    }
    const store = new BagCollectionStore(data,'rows',mode), grid = new BagCollectionView(store); grid.connect();
    const chartView = new ChartDataView(store,grid);
    const chart = new ChartRenderer(null,chartView.view,{renderer:'svg',ssr:true,width:640,height:320});
    const structure = new Bag({chartType:'bar',captionField:'name',valueFields:'amount'});
    try {
        chart.update(structure,seriesOptions); assert.match(chart.svg(),/Alpha/); assert.match(chart.svg(),/Beta/);
        grid.applyFilter({value:'^Al',columns:['name'],dtype:'T',locale:'en-GB'});
        chart.update(structure,seriesOptions); assert.match(chart.svg(),/Alpha/); assert.doesNotMatch(chart.svg(),/Beta/);
        const bars = chart.svg(); structure.setItem('chartType','line'); chart.update(structure,seriesOptions);
        assert.notEqual(chart.svg(),bars); assert.match(chart.svg(),/Alpha/);
        chartView.detach(); grid.disconnect(); store.receiveData({},null); chart.update(structure,seriesOptions);
        assert.doesNotMatch(chart.svg(),/Beta/);
    } finally { chart.dispose(); chartView.dispose(); grid.disconnect(); }
});

for (const mode of ['values','attributes']) test(`date axis and white background: ${mode}`, () => {
    const data=new Bag(), rows=new Bag(); data.setItem('rows',rows); data.setBackref();
    for(const [i,r] of [{date:new Date('2026-01-15T00:00:00Z'),amount:15},{date:new Date('2026-12-15T00:00:00Z'),amount:24}].entries()) {
        rows.setItem(`r${i}`,mode==='values'?new Bag(r):null,mode==='attributes'?r:{});
    }
    const store=new BagCollectionStore(data,'rows',mode), view=new BagCollectionView(store);view.connect();
    const chart=new ChartRenderer(null,view,{renderer:'svg',ssr:true,width:640,height:320});
    const config=new Bag({chartType:'line',captionField:'date',valueFields:'amount'});
    try {
        chart.update(config,seriesOptions); const svg=chart.svg(); assert.match(svg,/<svg/);assert.match(svg,/fill="#ffffff"/);
        rows.setItem('r2',mode==='values'?new Bag({date:'not a date',amount:8}):null,mode==='attributes'?{date:'not a date',amount:8}:{});
        store.receiveData({},null);
        assert.throws(()=>chart.update(config,seriesOptions),/consistent text, numeric/);
    } finally {chart.dispose();view.disconnect();}
});

for (const type of ['bar','line']) test(`multiple ${type} series, removal and empty selection is an error`, () => {
    const data=new Bag(), rows=new Bag(); data.setItem('rows',rows); data.setBackref(); rows.setItem('r0',null,{name:'January',revenue:120,margin:30});
    const store=new BagCollectionStore(data,'rows','attributes'), view=new BagCollectionView(store); view.connect();
    const renderer=new ChartRenderer(null,view,{renderer:'svg',ssr:true,width:640,height:320});
    const config=new Bag({chartType:type,captionField:'name',valueFields:'revenue,margin'});
    try {
        renderer.update(config,seriesOptions);
        const both=renderer.svg();
        assert.match(both,/revenue/); assert.match(both,/margin/);
        config.setItem('valueFields','margin'); renderer.update(config,seriesOptions);
        assert.doesNotMatch(renderer.svg(),/revenue/); assert.match(renderer.svg(),/margin/);
        config.setItem('valueFields',null);
        assert.throws(()=>renderer.update(config,seriesOptions),{name:'ChartSyntaxError',message:/needs at least one measure/});
        config.setItem('valueFields','revenue,missing');
        assert.throws(()=>renderer.update(config,seriesOptions),/Missing seriesOptions/);
        config.setItem('valueFields','revenue,revenue');
        assert.throws(()=>renderer.update(config,seriesOptions),/distinct/);
    } finally {renderer.dispose();view.disconnect();}
});

test('per-measure colors and axes update without changing the data', () => {
    const data=new Bag(),rows=new Bag(); data.setItem('rows',rows);data.setBackref();
    rows.setItem('r0',null,{name:'January',revenue:3000,units:20});
    const view=new BagCollectionView(new BagCollectionStore(data,'rows','attributes'));view.connect();
    const renderer=new ChartRenderer(null,view,{renderer:'svg',ssr:true,width:640,height:320});
    const config=new Bag({chartType:'bar',captionField:'name',valueFields:'revenue,units'});
    const options=new Bag({revenue:new Bag({axis:'left',color:'#5470c6'}),units:new Bag({axis:'right',color:'#ee6666'})});
    try {
        renderer.update(config,options);
        assert.match(renderer.svg(),/#ee6666/);
        assert.match(renderer.svg(),/>20<\/text>/);
        options.setItem('units.color','#b43cde'); renderer.update(config,options);
        assert.match(renderer.svg(),/#b43cde/);assert.doesNotMatch(renderer.svg(),/#ee6666/);
        options.setItem('units.axis','left');renderer.update(config,options);
        assert.match(renderer.svg(),/revenue, units/);
        assert.equal(rows.getNode('r0').getAttr('units'),20);
        options.setItem('units.axis','invalid');assert.throws(()=>renderer.update(config,options),/left\/right/);
        options.setItem('units.axis','right');options.setItem('units.color','invalid');
        assert.throws(()=>renderer.update(config,options),/hex color/);
    } finally {renderer.dispose();view.disconnect();}
});

for (const type of ['area','stackedArea','stackedBar','horizontalBar','pie','donut','scatter']) test(`additional chart type ${type}`, () => {
    const data=new Bag(),rows=new Bag(); data.setItem("rows",rows);data.setBackref(); rows.setItem('a',null,{x:1,amount:12});rows.setItem('b',null,{x:2,amount:20});
    const view=new BagCollectionView(new BagCollectionStore(data,'rows','attributes'));view.connect();
    const renderer=new ChartRenderer(null,view,{renderer:'svg',ssr:true,width:640,height:320});
    try {
        renderer.update(new Bag({chartType:type,captionField:'x',valueFields:'amount'}),seriesOptions);
        assert.match(renderer.svg(),/<path/);
    } finally {renderer.dispose();view.disconnect();}
});

for(const type of ['pie','donut']) test(`${type} rejects a second measure without changing selection`,()=>{
    const data=new Bag(),rows=new Bag();data.setItem('rows',rows);data.setBackref();
    rows.setItem('a',null,{name:'A',revenue:100,margin:5});rows.setItem('b',null,{name:'B',revenue:20,margin:80});
    const view=new BagCollectionView(new BagCollectionStore(data,'rows','attributes'));view.connect();
    const chart=new ChartRenderer(null,view,{renderer:'svg',ssr:true,width:640,height:320});
    const config=new Bag({chartType:type,captionField:'name',valueFields:'revenue,margin'});
    try {
        assert.throws(()=>chart.update(config,seriesOptions),{name:'ChartSyntaxError',message:/takes one measure; received 2: revenue, margin/});
        assert.equal(config.getItem('valueFields'),'revenue,margin');
        const paths=svg=>[...svg.matchAll(/ d="([^"]+)"/g)].map(match=>match[1]).filter(path=>/A\d{2}/.test(path));
        config.setItem('valueFields','revenue');chart.update(config,seriesOptions);
        const revenue=paths(chart.svg());
        config.setItem('valueFields','margin');chart.update(config,seriesOptions);
        assert.notDeepEqual(paths(chart.svg()),revenue);
    } finally {chart.dispose();view.disconnect();}
});
