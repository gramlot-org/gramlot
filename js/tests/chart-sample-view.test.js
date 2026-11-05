import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import charts from '../src/components/charts.js';
import {ChartSampleView} from '../src/components/chart-sample-view.js';
import {UPlotAdapter} from '../src/components/chart-engines/uplot.js';
import {ChartRenderer, chartContext} from '../src/components/chart-renderer.js';
import {chartData} from '../src/components/chart-data.js';

const options = () => new Bag({amplitude:new Bag({axis:'left',color:'#5470c6'})});
test('sample snapshots reuse the renderer and produce real SVG without sample Bag nodes', () => {
    const view = new ChartSampleView();
    const values = [0, 1, -1, 0];
    view.bind(values, .5, 2, 'time', 'amplitude');
    assert.equal(view.samples, values);
    assert.deepEqual(chartData(view,'time',['amplitude']).source, [[2,0],[2.5,1],[3,-1],[3.5,0]]);
    const renderer = new ChartRenderer(null,view,{renderer:'svg',ssr:true,width:640,height:320});
    const config = new Bag({engine:'echarts',chartType:'line',captionField:'time',valueFields:'amplitude'});
    try {
        const uplot = new UPlotAdapter(null);
        assert.deepEqual(uplot.validate(chartContext(view,config,options())).data, [[2,2.5,3,3.5],[0,1,-1,0]]);
        uplot.dispose();
        renderer.update(config,options()); const before=renderer.svg();
        assert.match(before, /<svg/);
        const handles=view.getRows();
        view.bind([1, 0, 0, -1], .5, 2, 'time', 'amplitude');
        assert.equal(view.getRows(),handles);
        renderer.update(config,options()); assert.notEqual(renderer.svg(),before);
        assert.throws(()=>view.bind([NaN],1,0,'time','amplitude'),/finite numbers/);
        assert.throws(()=>view.bind([1],0,0,'time','amplitude'),/positive step/);
        assert.throws(()=>view.bind([1],1,0,'time','a,b'),/one valueFields/);
    } finally { renderer.dispose(); }
});

test('chartView observes a single array Data node and retains its renderer across replacements', async t => {
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    window.ResizeObserver=class {observe() {} disconnect() {}};
    const updates=[];
    t.mock.method(ChartRenderer.prototype,'prepare',async()=>{});
    t.mock.method(ChartRenderer.prototype,'resize',()=>{});
    t.mock.method(ChartRenderer.prototype,'update',function(structure,settings) {
        updates.push({renderer:this, type:structure.getItem('chartType')});
    });
    const app=new Gramlot({document:window.document,transport:false,collections:[charts]});
    const builder=new GramlotBuilder(null,{collections:[charts]});
    app.data.setItem('options',options());
    builder.root.chartView({id:'wave',storepath:'samples',rowMode:'samples',engine:'echarts',
        chartType:'line',captionField:'time',valueFields:'amplitude',sampleStep:.5,seriesOptions:'^options'});
    try {
        app.src.startSource(builder.toTytx());
        await new Promise(resolve=>setTimeout(resolve,0));
        const host=window.document.getElementById('wave'), node=app.data.getNode('samples');
        assert.equal(updates.length,0);
        assert.equal(host.shadowRoot.querySelector('[role=status]').textContent, 'No data to display');
        assert.equal(node, null);
        for(let n=0;n<3;n++) {
            app.data.setItem('samples',Array.from({length:1024},(_,i)=>Math.sin(i+n)));
            await new Promise(resolve=>setTimeout(resolve,0));
        }
        assert.equal(updates.length,3);
        assert.ok(updates.every(update=>update.renderer===updates[0].renderer));
        assert.equal(window.document.getElementById('wave'),host);
        assert.ok(Array.isArray(app.data.getNode('samples').staticValue));
        app.data.setItem('samples', []);
        await new Promise(resolve=>setTimeout(resolve,0));
        assert.equal(host.shadowRoot.querySelector('[role=status]').textContent, 'No data to display');
        app.data.setItem('samples', [1, 2]);
        await new Promise(resolve=>setTimeout(resolve,0));
        assert.equal(updates.at(-1).renderer,updates[0].renderer);
        assert.equal(host.shadowRoot.querySelector('[role=alert]').hidden, true);
    } finally {app.dispose();window.close();}
});

test('configured sample axes stay identical across quiet/loud frames and adapt to FFT size', () => {
    const view=new ChartSampleView();
    const config=new Bag({engine:'uplot',chartType:'line',captionField:'time',valueFields:'amplitude'});
    const context=()=>chartContext(view,config,options());
    view.bind([0,.01,-.01,0],.5,0,'time','amplitude');
    const first=view.domains(context(),-1,1);
    assert.deepEqual(first.dimension.range,[0,1.5]);
    assert.deepEqual(first.axes.left,[-1,1]);
    view.bind([0,1,-1,0],.5,0,'time','amplitude');
    assert.deepEqual(view.domains(context(),-1,1),first);
    view.bind([-100,-30,-80,-100],20,0,'time','amplitude');
    const spectrum=view.domains(context(),-100,0);
    assert.deepEqual(spectrum.axes.left,[-100,0]);
    view.bind([-100,-60,-90,-100],20,0,'time','amplitude');
    assert.deepEqual(view.domains(context(),-100,0),spectrum);
    view.bind([0,1,0,1,0,1],.5,0,'time','amplitude');
    assert.deepEqual(view.domains(context(),-1,1).dimension.range,[0,2.5]);
    assert.throws(()=>view.domains(context(),1,-1),/sampleMin/);
    assert.throws(()=>view.domains(context(),null,1),/sampleMin/);
    assert.equal(view.domains(context(),null,null),null);
});
