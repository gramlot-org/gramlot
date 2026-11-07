import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {chartContext} from '../src/components/chart-renderer.js';
import {chartCapabilities,requireChartCapability} from '../src/components/chart-engines/index.js';
import {EChartsAdapter} from '../src/components/chart-engines/echarts.js';
import {PlotlyAdapter} from '../src/components/chart-engines/plotly.js';
import {chartTypes} from '../src/components/chart-types/index.js';

test('render_ methods determine capabilities, not an independently maintained list',()=>{
    assert.deepEqual(chartCapabilities(EChartsAdapter),chartTypes.map(type=>type.id));
    assert.deepEqual(chartCapabilities(PlotlyAdapter),['bar','line','area','stackedBar','stackedArea','horizontalBar','pie','donut','scatter','line3D','scatter3D','surface','map']);
    assert.throws(()=>requireChartCapability('plotly','map3D'),/Plotly does not support map3D/);
    assert.throws(()=>requireChartCapability('missing','bar'),/Unknown/);
});

for(const mode of ['attributes','values'])test(`Plotly translates the same filtered store, colors and axes: ${mode}`,()=>{
    const root=new Bag(),rows=new Bag();root.setItem('rows',rows);root.setBackref();
    const put=(id,values)=>rows.setItem(id,mode==='values'?new Bag(values):null,mode==='attributes'?values:{});
    put('a',{name:'A',amount:10,units:2});put('b',{name:'B',amount:25,units:3});
    const view=new BagCollectionView(new BagCollectionStore(rows,mode));view.connect();
    const config=new Bag({engine:'plotly',chartType:'bar',captionField:'name',valueFields:'amount,units'});
    const options=new Bag({amount:new Bag({axis:'left',color:'#123456'}),units:new Bag({axis:'right',color:'#654321'})});
    const adapter=new PlotlyAdapter(null);
    try {
        const context=()=>chartContext(view,config,options);
        const before=options.toTytx();
        for(const type of ['bar','line']) {
            config.setItem('chartType',type);
            const figure=adapter.validate(context());
            assert.deepEqual(figure.data.map(trace=>trace.y),[[10,25],[2,3]]);
            assert.deepEqual(figure.data.map(trace=>trace.yaxis),['y','y2']);
            assert.equal(figure.data[0].marker.color,'#123456');
            assert.equal(figure.layout.yaxis2.overlaying,'y');
        }
        view.applyFilter({value:'^B',columns:['name'],dtype:'T',locale:'en-GB'});
        assert.deepEqual(adapter.validate(context()).data[0].y,[25]);
        config.setItem('chartType','pie');
        assert.throws(context,/Pie takes one measure; received 2/);
        assert.equal(config.getItem('valueFields'),'amount,units');
        assert.equal(options.toTytx(),before);
        config.setItem('valueFields','amount');
        assert.deepEqual(adapter.validate(context()).data[0].values,[25]);
        view.applyFilter({value:'',columns:['name'],dtype:'T',locale:'en-GB'});
        put('c',{name:'A',amount:8,units:4});
        assert.throws(()=>adapter.validate(context()),/distinct category labels/);
        assert.equal(config.getItem('chartType'),'pie');
        assert.equal(rows.getNodes().length,3);
        rows.popNode('c');put('c',{name:'C',amount:-8,units:4});
        assert.throws(()=>adapter.validate(context()),/nonnegative/);
        config.setItem('chartType','bar');
        assert.deepEqual(adapter.validate(context()).data[0].y,[10,25,-8]);
    } finally {view.disconnect();}
});
