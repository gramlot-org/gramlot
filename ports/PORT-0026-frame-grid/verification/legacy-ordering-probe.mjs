/** Read-only investigation probe, not a core/CI dependency on Genropy.
 * Usage: node legacy-ordering-probe.mjs /path/to/genropy
 * Executes the inspected legacy methods with narrow host/store fixtures.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {join} from 'node:path';
const root = process.argv[2];
if (!root) throw new Error('Pass the legacy repository root');
const read = file => readFileSync(join(root,'gnrjs/gnr_d11/js',file),'utf8');
const grid = read('genro_grid.js'), components = read('genro_components.js'), bags = read('gnrbag.js');
function method(text, anchor, name, globals = {}) {
    const base = text.indexOf(anchor);
    assert.ok(base >= 0, anchor);
    const start = text.indexOf(`${name}:`, base);
    assert.ok(start >= base, name);
    const fn = text.indexOf('function', start), end = text.indexOf('\n    },', fn);
    assert.ok(end > fn, name);
    return runInNewContext(`(${text.slice(fn,end+6)})`, globals);
}
const bagSort = method(bags,'    sort: function','sort', {Date,stringStrip:s=>s.trim(),stringEndsWith:(s,end)=>s.endsWith(end)});
const collection = 'dojo.declare("gnr.stores._Collection"';
const bagRows = 'dojo.declare("gnr.stores.BagRows"';
const modernGrid = 'dojo.declare("gnr.widgets.NewIncludedView"';
const calls = [];
for (const mode of ['Values','Attributes']) {
    const records = [{id:'b1',group:'b',amount:1},{id:'a2',group:'a',amount:2},
        {id:'a10',group:'a',amount:10},{id:'b8',group:'b',amount:8}];
    const original = records.map(attr=>({label:attr.id,attr,getValue:()=>({getItem:field=>attr[field]}),getAttr:field=>attr[field]}));
    const bag = {_nodes:[...original],sort:bagSort,getNodes(){return this._nodes;}};
    const store = {getData:()=>bag,
        sort:method(components,`dojo.declare("gnr.stores.${mode}BagRows"`,'sort'),
        getItems:method(components,collection,'getItems'),
        len:method(components,collection,'len'),
        absIndex:method(components,collection,'absIndex',{dojo:{indexOf:(a,v)=>a.indexOf(v)}}),
        itemByIdx:method(components,bagRows,'itemByIdx'),
        rowByIndex:method(components,collection,'rowByIndex'),
        gridRowByIndex:method(components,collection,'gridRowByIndex'),
        rowFromItem:node=>node.attr,setExternalChangeClasses(){},filterToRebuild:value=>calls.push(['filter',value])};
    const widget = {collectionStore:()=>store,_virtual:false,updateRowCount:value=>calls.push(['rows',value])};
    method(grid,modernGrid,'mixin_sortStore').call(widget,'group:a,amount:d');
    assert.equal(store.sortedBy,'group:a,amount:d');
    assert.deepEqual(bag._nodes.map(node=>node.label),['a10','a2','b8','b1']);
    assert.ok(original.every(node=>bag._nodes.includes(node)), 'same nodes survive local sort');
    const rowByIndex = method(grid,modernGrid,'mixin_rowByIndex');
    assert.equal(rowByIndex.call(widget,0).id,'a10');
    store._filtered=[2,0];
    assert.equal(rowByIndex.call(widget,0).id,'b8','visible position is mapped by the store');
    assert.equal(rowByIndex.call(widget,0,false,true).id,'a10','ignoreFilter reads store order directly');
    console.log(`${mode}BagRows: grid delegates; store sorts raw values by multiple criteria; Bag order changes; node identities and filtered position mapping verified`);
}
let sorted = false, cleared = 0;
const virtualStore = {sort(){sorted=true;},clearBagCache(){cleared++;}};
const virtualGrid = {collectionStore:()=>virtualStore,_virtual:true,rowCount:500,updateRowCount:value=>calls.push(['virtualRows',value])};
method(grid,modernGrid,'mixin_sortStore').call(virtualGrid,'amount:d,group:a');
assert.equal(sorted,false); assert.equal(cleared,1);
assert.equal(virtualStore.sortedBy,'amount:d,group:a');
assert.deepEqual(calls.slice(-2),[['virtualRows',0],['virtualRows',500]]);
let request;
const pageStore = {chunkSize:40,sortedBy:virtualStore.sortedBy,pendingPages:{},storeNode:{attr:{httpMethod:'POST'}},
    getData:()=>({getParentNode:()=>({attr:{method:'app.getSelection',selectionName:'selection',table:'demo.rows'}})})};
method(components,'dojo.declare("gnr.stores.VirtualSelection"','loadBagPageFromServer',
    {genro:{rpc:{remoteCall:(method,parameters)=>{request={method,parameters};return {};}}}}).call(pageStore,3,false);
assert.equal(request.parameters.sortedBy,'amount:d,group:a');
assert.equal(request.parameters.row_start,120); assert.equal(request.parameters.row_count,40);
console.log('VirtualSelection: no local sort; cache invalidation and server request preserve full sort criteria and page coordinates');
