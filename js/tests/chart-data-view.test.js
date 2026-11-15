import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';
import {ChartDataView} from '../src/components/chart-data-view.js';

for (const mode of ['values', 'attributes']) test(`chart follows and retains grid filter: ${mode}`, () => {
    const data = new Bag(), rows = new Bag();
    data.setItem('rows', rows); data.setBackref();
    for (const [i, record] of [{name:'Alpha'}, {name:'Beta'}, {name:'Alpine'}].entries()) {
        rows.setItem(`r${i}`, mode === 'values' ? new Bag(record) : null, mode === 'attributes' ? record : {});
    }
    const store = new BagCollectionStore(data,'rows',mode);
    const grid = new BagCollectionView(store); grid.connect();
    const chart = new ChartDataView(store, grid);
    const labels = () => chart.view.getRows().map(row => row.label);
    try {
        assert.deepEqual(labels(), ['r0','r1','r2']);
        grid.applyFilter({value:'^Al', columns:['name'], dtype:'T', locale:'en-GB'});
        assert.deepEqual(labels(), ['r0','r2']);
        chart.detach(); grid.disconnect();
        rows.setItem('r3', mode === 'values' ? new Bag({name:'Alto'}) : null, mode === 'attributes' ? {name:'Alto'} : {});
        store.receiveData({}, null);
        assert.deepEqual(labels(), ['r0','r2','r3']);
        chart.follow(grid);
        grid.applyFilter(null);
        assert.deepEqual(labels(), ['r0','r1','r2','r3']);
    } finally { chart.dispose(); grid.disconnect(); }
});

test('chart rejects a view of another collection', () => {
    const data = new Bag(), a = new Bag(), b = new Bag();
    data.setItem('a', a); data.setItem('b', b); data.setBackref();
    const store = new BagCollectionStore(data,'a','values');
    const foreign = new BagCollectionView(new BagCollectionStore(data,'b','values'));
    assert.throws(() => new ChartDataView(store, foreign), /same collection/);
});

for(const mode of ['attributes','values'])test(`a replacement at the store path keeps the followed filter and the view: ${mode}`,()=>{
    const data=new Bag(),old=new Bag(),next=new Bag();data.setItem('rows',old);data.setBackref();
    const put=(bag,key,name)=>bag.setItem(key,mode==='values'?new Bag({name}):null,mode==='attributes'?{name}:{});
    put(old,'a','Alpha');put(next,'b','Beta');put(next,'c','Alpine');
    const store=new BagCollectionStore(data,'rows',mode);
    const grid=new BagCollectionView(store);grid.connect();grid.applyFilter({value:'^Al',columns:['name'],dtype:'T',locale:'en-GB'});
    const chart=new ChartDataView(store,grid),view=chart.view;
    try{
        let changes=0;const release=view.subscribe(()=>changes++);
        data.setItem('rows',next);store.receiveData({},null);
        assert.equal(chart.view,view);assert.ok(changes>0);
        assert.deepEqual(view.getRows().map(row=>row.label),['c']);
        assert.deepEqual(grid.getRows().map(row=>row.label),['c']);
        grid.applyFilter(null);assert.equal(view.getRows().length,2,'the chart still follows the grid');
        release();
    }finally{chart.dispose();grid.disconnect();}
});

test('chart follows a grid view over the same path and rowMode, not over the same Bag',()=>{
    const data=new Bag(),rows=new Bag();data.setItem('rows',rows);data.setBackref();
    rows.setItem('a',new Bag({name:'Alpha'}),{name:'Alpha'});
    const grid=new BagCollectionView(new BagCollectionStore(data,'rows','attributes'));
    const chart=new ChartDataView(new BagCollectionStore(data,'rows','attributes'),grid);
    chart.dispose();
    assert.throws(()=>new ChartDataView(new BagCollectionStore(data,'rows','values'),grid),/same collection/);
});


// Separate module evaluation reproduces runtime and lazy collection bundles.
const {BagCollectionView: RuntimeView} = await import('../src/stores/bag-collection-view.js?runtime-copy');
for (const mode of ['values', 'attributes']) test(`cross-bundle filter contributions and detachment: ${mode}`, () => {
    const data = new Bag(), rows = new Bag();
    data.setItem('rows', rows); data.setBackref();
    for (const [key, record] of Object.entries({a:{name:'Alpha',group:'one'},b:{name:'Alpine',group:'two'},c:{name:'Beta',group:'one'}})) {
        rows.setItem(key, mode === 'values' ? new Bag(record) : null, mode === 'attributes' ? record : {});
    }
    const store = new BagCollectionStore(data,'rows',mode), grid = new RuntimeView(store);
    grid.connect();
    grid.applyFilter({value:'^Al',columns:['name'],dtype:'T',locale:'en-GB'},'base');
    const chart = new ChartDataView(store, grid);
    const labels = () => chart.view.getRows().map(row => row.label);
    try {
        assert.deepEqual(labels(), ['a','b']);
        grid.applyFilter({value:'one',columns:['group'],dtype:'T',locale:'en-GB'});
        assert.deepEqual(labels(), ['a']);
        grid.applySetFilter([{field:'name',value:'Alpine'}]);
        assert.deepEqual(labels(), [], 'base, search and sets intersect');
        grid.applySetFilter(null);
        assert.deepEqual(labels(), ['a']);
        const snapshot = grid.filterContributions;
        assert.throws(() => snapshot.push([]), TypeError);
        assert.throws(() => { snapshot[0][1].predicate = null; }, TypeError);
        grid.applyFilter(null);
        assert.deepEqual(labels(), ['a','b']);
        chart.detach();
        grid.applyFilter(null,'base');
        assert.deepEqual(labels(), ['a','b'], 'detached chart retains its own criteria');
        chart.follow(grid);
        assert.deepEqual(labels(), ['a','b','c']);
    } finally { chart.dispose(); grid.disconnect(); }
});
