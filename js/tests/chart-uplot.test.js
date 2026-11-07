import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {chartContext} from '../src/components/chart-renderer.js';
import {chartCapabilities,requireChartCapability} from '../src/components/chart-engines/index.js';
import {UPlotAdapter} from '../src/components/chart-engines/uplot.js';

test('uPlot advertises only implemented lines',()=>{
    assert.deepEqual(chartCapabilities(UPlotAdapter),['line']);
    assert.throws(()=>requireChartCapability('uplot','bar'),/uPlot does not support bar/);
});
for(const mode of ['attributes','values'])test(`uPlot preserves data and rejects unsupported X domains without rewriting: ${mode}`,()=>{
    const root=new Bag(),rows=new Bag();root.setItem('rows',rows);root.setBackref();
    const put=(key,values)=>rows.setItem(key,mode==='values'?new Bag(values):null,mode==='attributes'?values:{});
    put('a',{x:1,date:new Date('2026-01-01'),label:'Alpha',signal:-4,units:10});
    put('b',{x:2,date:new Date('2026-01-02'),label:'Beta',signal:6,units:20});
    const view=new BagCollectionView(new BagCollectionStore(rows,mode));view.connect();
    const config=new Bag({engine:'uplot',chartType:'line',captionField:'x',valueFields:'signal,units'});
    const options=new Bag({signal:new Bag({axis:'left',color:'#123456'}),units:new Bag({axis:'right',color:'#654321'})});
    const adapter=new UPlotAdapter(null),make=()=>adapter.validate(chartContext(view,config,options));
    try {
        const before=rows.toTytx(),settings=options.toTytx();
        assert.deepEqual(make().data,[[1,2],[-4,6],[10,20]]);
        assert.deepEqual(make().settings,[{axis:'left',color:'#123456'},{axis:'right',color:'#654321'}]);
        config.setItem('captionField','date');
        assert.equal(make().time,true);assert.deepEqual(make().data[0],[1767225600,1767312000]);
        assert.equal(rows.toTytx(),before);assert.equal(options.toTytx(),settings);
        config.setItem('captionField','label');assert.throws(make,/numeric or date/);
        assert.equal(config.getItem('captionField'),'label');
        config.setItem('captionField','x');
        view.sort('x:d');assert.throws(make,/ascending/);view.sort('');
        put('c',{x:2,signal:7,units:30});assert.throws(make,/distinct/);rows.popNode('c');
        view.applyFilter({value:'^Beta',columns:['label'],dtype:'T',locale:'en-GB'});
        assert.deepEqual(make().data,[[2],[6],[20]]);
        config.setItem('valueFields','');assert.throws(make,/needs at least one measure/);
    } finally {view.disconnect();}
});
