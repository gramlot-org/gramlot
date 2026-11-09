import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import grid from '../src/components/grid.js';
import {layoutWindow} from './helpers/layout-window.js';
import {ChartDataView} from '../src/components/chart-data-view.js';
import {ChartRenderer} from '../src/components/chart-renderer.js';
import {optionsAddress} from './helpers/chart-options.js';

const seriesOptions = new Bag({amount:new Bag({axis:'left',color:'#5470c6'}),revenue:new Bag({axis:'left',color:'#5470c6'}),margin:new Bag({axis:'right',color:'#ee6666'})});

for (const mode of ['values','attributes']) test(`chart experiment observes real grid filtering and store updates: ${mode}`, t => {
    t.mock.timers.enable({apis:['setTimeout']});
    const {window} = new JSDOM('<main id="gramlot-root"></main>'); layoutWindow(window);
    const app = new Gramlot({document:window.document, transport:false, collections:[grid], locale:'en-GB'});
    const rows = new Bag();
    for (const [i, row] of [{name:'Alpha', amount:15},{name:'Beta', amount:24}].entries()) {
        rows.setItem(`r${i}`,mode==='values'?new Bag(row):null,mode==='attributes'?row:{});
    }
    app.data.setItem('model.rows',rows);
    const builder = new GramlotBuilder(null,{collections:[grid]});
    const pane = builder.root.div({datapath:'model',node_label:'pane'});
    const gridNode = pane.grid({node_label:'grid',storepath:'.rows',rowMode:mode});
    const struct = gridNode.struct(); struct.column({field:'name',name:'Name'}); struct.column({field:'amount',name:'Amount'});
    app.src.startSource(builder.toTytx()); t.mock.timers.tick(0);
    const source = app.src.source.getNode('main.pane.grid');
    const view = source._internal.gridCollectionView;
    const chartView = new ChartDataView(app.src.binding.collectionStore('model.rows',mode),view);
    const chart = new ChartRenderer(null,chartView.view,{renderer:'svg',ssr:true,width:640,height:320});
    const config = new Bag({chartType:'bar',captionField:'name',valueFields:'amount'});
    const release = chartView.view.subscribe(() => chart.update(config,optionsAddress(seriesOptions))); chart.update(config,optionsAddress(seriesOptions));
    t.after(()=>{release();chart.dispose();chartView.dispose();app.dispose();window.close();});
    view.applyFilter({value:'^Al',columns:['name'],dtype:'T',locale:'en-GB'});
    assert.match(chart.svg(),/Alpha/);assert.doesNotMatch(chart.svg(),/Beta/);
    view.applyFilter({value:'> 10',columns:['amount'],dtype:'L',locale:'en-GB'},'base');
    view.applySetFilter([{field:'name',value:'Beta'}]);
    assert.equal(chartView.view.getRows().length,0);
    view.applyFilter(null);assert.deepEqual(chartView.view.getRows(),[rows.getNode('r1')]);
    view.applySetFilter(null);assert.equal(chartView.view.getRows().length,2);
    view.applyFilter(null,'base');
    view.applyFilter({value:'^Al',columns:['name'],dtype:'T',locale:'en-GB'});
    chartView.detach(); source.parentBag.popNode(source.label); t.mock.timers.tick(0);
    rows.setItem('r2',mode==='values'?new Bag({name:'Alto',amount:9}):null,mode==='attributes'?{name:'Alto',amount:9}:{});
    assert.match(chart.svg(),/Alto/);assert.doesNotMatch(chart.svg(),/Beta/);
});
