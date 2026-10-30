import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '../src/index.js';
import {GridRowLayout} from '../src/components/grid-row-layout.js';

function model() {
    const bag=new Bag();
    for(let i=0;i<1000;i++) bag.setItem(`r${i}`,null,{code:i});
    const layout=new GridRowLayout();layout.bindStore(bag);layout.setRows(bag.getNodes());
    return {bag,layout,nodes:bag.getNodes()};
}
test('pixel lookup covers boundaries, bottom and empty views',()=>{
    const {layout}=model();
    assert.equal(layout.totalHeight,32000);
    assert.equal(layout.indexAt(31),0);assert.equal(layout.indexAt(32),1);
    assert.equal(layout.indexAt(32000),999);
    const range=layout.window(16000,320);
    assert.ok(range.start<=500 && range.end>509 && range.end-range.start<40);
    layout.setRows([]);assert.equal(layout.totalHeight,0);assert.deepEqual(layout.window(0,320),{start:0,end:0});
});
test('measured and manual heights follow identity through sort, filter and layout changes',()=>{
    const {layout,nodes}=model();
    layout.measure(nodes[0],40);layout.measure(nodes[1],100);
    layout.setHeight(nodes[2],150);
    assert.equal(layout.offset(3),290);
    layout.setRows([nodes[2],nodes[0]]);assert.equal(layout.offset(1),150);
    layout.resetMeasurements();assert.equal(layout.height(nodes[2]),150);
    layout.measure(nodes[0],30);assert.equal(layout.totalHeight,180);
    layout.setHeight(nodes[2],null);assert.equal(layout.totalHeight,60);
    layout.setHeight(nodes[0],70);layout.retain([nodes[2]]);assert.equal(layout.height(nodes[0]),null);
    layout.bindStore(new Bag());assert.equal(layout.height(nodes[2]),null);
});


test('server windows retain bounded geometry with global ordinals and measured heights', () => {
    const {layout, nodes} = model();
    layout.setRows(nodes.slice(0, 200));
    layout.setWindow({start: 250000, total: 500000});
    assert.equal(layout.count, 500000);
    assert.equal(layout.totalHeight, 16000000);
    layout.measure(nodes[0], 32);
    layout.measure(nodes[1], 96);
    assert.equal(layout.offset(250002), 250002 * 32 + 64);
    assert.equal(layout.indexAt(layout.offset(250001) + 95), 250001);
    assert.equal(layout.indexAt(layout.totalHeight), 499999);
    assert.equal(layout.totalHeight, 16000064);
    layout.setWindow({start: 499800, total: 500000});
    const end = layout.window(layout.totalHeight - 320, 320);
    assert.equal(end.end, 500000);
    assert.ok(end.end - end.start < 40);
    layout.setWindow(null);
    assert.equal(layout.count, 200);
    assert.equal(layout.totalHeight, 6464);
    assert.throws(() => layout.setWindow({start: 10, total: 9}), /Invalid grid window/);
});
