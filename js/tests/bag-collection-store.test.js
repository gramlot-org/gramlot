import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {createDecimal} from '@genrojs/tytx';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';

function fixture(mode,records) {
    const data=new Bag(), bag=new Bag();data.setItem('rows',bag);data.setBackref();
    records.forEach((record,index)=>bag.setItem(`r${index}`,mode==='values'?new Bag(record):null,mode==='attributes'?record:{}));
    const parent=new BagCollectionStore(data,'rows',mode), first=new BagCollectionView(parent), second=new BagCollectionView(parent);
    first.connect();second.connect();
    return {data,bag,parent,first,second,labels:(view=first)=>view.getRows().map(node=>node.label)};
}
for(const mode of ['values','attributes']) {
    test(`${mode}: independent multicolumn order shares exact nodes and never writes business metadata`,()=>{
        const f=fixture(mode,[{group:'B',value:2},{group:'A',value:100},{group:'A',value:2},{group:'A',value:2}]);
        const nodes=f.bag.getNodes(), values=nodes.map(node=>node.staticValue), attrs=nodes.map(node=>({...node.getAttr()})), events=[];
        f.data.subscribe('writes',{any:event=>events.push(event)});
        f.first.sort('group:a,value:d');f.second.sort('value:a,group:d');
        assert.deepEqual(f.labels(),['r1','r2','r3','r0']);
        assert.deepEqual(f.labels(f.second),['r0','r2','r3','r1']);
        f.first.moveRow(nodes[3],nodes[2]);
        assert.equal(f.first.sortedBy,'');assert.equal(f.second.sortedBy,'value:a,group:d');
        assert.deepEqual(f.labels(f.second),['r0','r2','r3','r1']);
        f.first.sort('group:a,value:a');assert.deepEqual(f.labels(),['r3','r2','r1','r0'],'ties retain this view order');
        assert.deepEqual(f.bag.getNodes(),nodes);assert.deepEqual(nodes.map(node=>node.staticValue),values);
        assert.deepEqual(nodes.map(node=>node.getAttr()),attrs);assert.equal(events.length,0);
    });
    test(`${mode}: typed comparisons retain Decimal precision and sort dates, nulls and booleans`,()=>{
        const f=fixture(mode,[{v:createDecimal('9007199254740993.25')},{v:createDecimal('9007199254740993.24')},{v:2},{v:null},{}]);
        f.first.sort('v:a');assert.deepEqual(f.labels(),['r3','r4','r2','r1','r0']);
        f.first.applyFilter({value:'> 9007199254740993,24',columns:['v'],dtype:'N',locale:'it-IT'});
        assert.deepEqual(f.labels(),['r0']);assert.equal(f.second.filtered,null);
        const dates=fixture(mode,[{v:new Date('2026-10-29')},{v:new Date('2026-10-28')}]);
        dates.first.sort('v:a');assert.deepEqual(dates.labels(),['r1','r0']);
        dates.first.applyFilter({value:'>= 29/10/2026',columns:['v'],dtype:'D',locale:'it-IT'});assert.deepEqual(dates.labels(),['r0']);
        const flags=fixture(mode,[{v:true},{v:false}]);flags.first.sort('v:a');assert.deepEqual(flags.labels(),['r1','r0']);
    });
    test(`${mode}: distinct filters, clear and filtered drag preserve the other view and hidden nodes`,()=>{
        const f=fixture(mode,[{name:'Alpha',qty:3},{name:'Beta',qty:9},{name:'Alpine',qty:1}]);
        f.first.sort('qty:d');f.second.sort('qty:a');
        f.first.applyFilter({value:'^Al',columns:['name'],dtype:'T',locale:'en-GB'});
        f.second.applyFilter({value:'> 2',columns:['qty'],dtype:'L',locale:'en-GB'});
        assert.deepEqual(f.labels(),['r0','r2']);assert.deepEqual(f.first.filtered,[1,2]);
        assert.deepEqual(f.labels(f.second),['r0','r1']);assert.deepEqual(f.second.filtered,[1,2]);
        f.first.moveRow(f.bag.getNode('r2'),f.bag.getNode('r0'));
        assert.deepEqual(f.labels(),['r2','r0']);assert.equal(f.first.getRows(false).length,3);
        assert.deepEqual(f.labels(f.second),['r0','r1']);assert.equal(f.second.sortedBy,'qty:a');
        f.first.applyFilter(null);assert.equal(f.first.filtered,null);assert.equal(f.first.isFiltered(),false);
        assert.equal(f.second.isFiltered(),true);
        f.first.applyFilter({value:'absent',columns:['name'],dtype:'T',locale:'en-GB'});
        assert.deepEqual(f.first.filtered,[]);assert.equal(f.first.isFiltered(),true);
    });
    test(`${mode}: invalid sorts and filter drafts preserve the accepted view`,()=>{
        const f=fixture(mode,[{name:'Alpha',v:1200},{name:'Beta',v:5}]);
        f.first.sort('v:a');
        const accepted={value:'>= 1.200',columns:['v'],dtype:'L',locale:'it-IT'};
        f.first.applyFilter(accepted);
        for(const sortedBy of ['v:bad','v:a,v:d',null]) assert.throws(()=>f.first.sort(sortedBy));
        for(const [value,dtype,column] of [['[','T','name'],['>','L','v'],['> 12.34','L','v'],['= nonsense','D','v']]) {
            assert.throws(()=>f.first.applyFilter({value,columns:[column],dtype,locale:'it-IT'}));
            assert.deepEqual(f.first.filter,accepted);assert.deepEqual(f.labels(),['r0']);assert.equal(f.first.sortedBy,'v:a');
        }
        assert.throws(()=>f.first.filter.columns.push('bad'));
        f.first.applyFilter(null);assert.equal(f.first.sortedBy,'v:a');
        const mixed=fixture(mode,[{v:1},{v:'2'}]);assert.throws(()=>mixed.first.sort('v:a'),/mixed types/);
        for(const v of [NaN,Infinity,new Date('bad'),{},new Bag()]) {
            const bad=fixture(mode,[{v}]);assert.throws(()=>bad.first.sort('v:a'),/finite scalar/);
        }
    });
}

test('data changes reconcile each view, preserving independent criteria and original membership',()=>{
    const f=fixture('attributes',[{v:1},{v:2},{v:3}]);
    f.first.sort('v:d');f.second.sort('v:a');
    f.first.applyFilter({value:'> 1',columns:['v'],dtype:'L',locale:'en-GB'});
    f.second.applyFilter({value:'< 3',columns:['v'],dtype:'L',locale:'en-GB'});
    const row=f.bag.getNode('r0');row.setAttr({v:4});f.parent.receiveData({},row);
    assert.deepEqual(f.labels(),['r0','r2','r1']);assert.deepEqual(f.labels(f.second),['r1']);
    f.bag.setItem('new',null,{v:0});f.parent.receiveData({});
    assert.deepEqual(f.labels(f.second),['new','r1']);
    f.bag.popNode('r1');f.parent.receiveData({});assert.deepEqual(f.labels(f.second),['new']);
});

test('legacy shared ordering/filter attributes do not control a fresh view',()=>{
    const f=fixture('attributes',[{v:1,rowidx:99},{v:2,rowidx:-1}]);
    f.bag.parentNode.setAttr({sortedBy:'v:d',filter:{value:'missing'}});
    const view=new BagCollectionView(f.parent);
    assert.deepEqual(f.labels(view),['r0','r1']);assert.equal(view.sortedBy,'');assert.equal(view.filter,null);
    view.sort('v:d');assert.deepEqual(f.bag.getNodes().map(node=>node.getAttr('rowidx')),[99,-1]);
    view.sort('rowidx:d');assert.deepEqual(f.labels(view),['r0','r1'],'rowidx is an ordinary sortable business field');
});

test('one failing view does not prevent sibling reconciliation; notifications expose no value copies',()=>{
    const f=fixture('attributes',[{v:1,name:'A'},{v:2,name:'B'}]);f.first.sort('v:a');
    const notices=[];f.second.subscribe(change=>notices.push(change));
    const row=f.bag.getNode('r0');row.setAttr({v:'invalid',name:'Next'});
    assert.throws(()=>f.parent.receiveData({},row),AggregateError);
    assert.equal(notices.length,1);assert.equal(notices[0].rows[0],row);
    assert.ok(Object.isFrozen(notices[0])&&Object.isFrozen(notices[0].rows));
    row.setAttr({v:3});f.parent.receiveData({},row);assert.deepEqual(f.labels(),['r1','r0']);
});

test('disconnect releases parent subscription; reconnect and a replacement at the store path retain view criteria',()=>{
    const f=fixture('attributes',[{v:1},{v:2}]);f.first.sort('v:d');
    let notices=0;f.first.subscribe(()=>notices++);f.first.disconnect();
    f.bag.getNode('r0').setAttr({v:3});f.parent.receiveData({},f.bag.getNode('r0'));assert.equal(notices,0);
    f.first.connect();assert.deepEqual(f.labels(),['r0','r1']);assert.equal(notices,1);
    const replacement=new Bag();replacement.setItem('r0',null,{v:4});replacement.setItem('r1',null,{v:5});
    f.data.setItem('rows',replacement);f.parent.receiveData({});
    assert.equal(f.first.sortedBy,'v:d');assert.deepEqual(f.labels(),['r1','r0']);
    assert.equal(f.first.getRows()[0],replacement.getNode('r1'),'rows are read from the Bag now at the path');
    assert.equal(f.first.path,'rows');assert.equal(f.parent.path,'rows');
});

test('a replacement at the store path keeps the manual order of the keys still present',()=>{
    const f=fixture('attributes',[{v:1},{v:2},{v:3}]);
    const nodes=f.bag.getNodes();f.first.moveRow(nodes[2],nodes[0]);
    assert.deepEqual(f.labels(),['r2','r0','r1']);
    const replacement=new Bag();for(const [key,v] of [['r1',1],['new',9],['r2',3]])replacement.setItem(key,null,{v});
    f.data.setItem('rows',replacement);f.parent.receiveData({});
    assert.deepEqual(f.labels(),['r2','r1','new'],'present keys keep their order; new keys follow in Bag order');
    f.first.moveRow(nodes[0],replacement.getNode('r2'));
    assert.deepEqual(f.labels(),['r2','r1','new'],'a key absent from the collection does not move');
    f.first.moveRow(replacement.getNode('new'),nodes[2]);
    assert.deepEqual(f.labels(),['new','r2','r1'],'rows of another Bag identify the same keys');
});

test('a store reads its rows from the Data root at each access and rejects a path without a Bag',()=>{
    const f=fixture('attributes',[{v:1}]);
    f.data.setItem('rows','scalar');
    assert.throws(()=>f.parent.getRows(),/requires a Bag at rows/);
    f.data.setItem('rows',new Bag({a:1}));
    assert.deepEqual(f.parent.getRows().map(node=>node.label),['a']);
});

for (const mode of ['values','attributes']) test(`${mode}: all-column search retains formatted regex semantics and reads changed values`, () => {
    const f=fixture(mode, [
        {name:'Alpha', qty:1234.5, price:createDecimal('9007199254740993.25'), date:new Date('2026-10-16'), active:false},
        {name:'Beta', qty:0, price:null, date:null, active:true},
    ]);
    const columns=['name','qty','price','date','active'];
    const search = (view, value, locale) => view.applyFilter({value,columns,dtype:'T',locale});
    search(f.first, '^Alpha 1\\.234,5 ', 'it-IT');
    assert.deepEqual(f.labels(), ['r0'], 'regex can span column boundaries');
    search(f.second, '9,007,199,254,740,993\\.25', 'en-US');
    assert.deepEqual(f.labels(f.second), ['r0'], 'Decimal precision is preserved');
    search(f.first, '16/10/26 false$', 'it-IT');
    assert.deepEqual(f.labels(), ['r0']);
    search(f.second, '^Beta 0   true$', 'en-US');
    assert.deepEqual(f.labels(f.second), ['r1'], 'null columns retain separators');
    const node=f.bag.getNode('r0');
    if (mode==='values') node.staticValue.setItem('date',new Date('2026-10-17'));
    else node.setAttr({date:new Date('2026-10-17')});
    f.parent.receiveData({},node);
    assert.deepEqual(f.labels(), [], 'no stale text is cached after a value update');
    assert.deepEqual(f.labels(f.second), ['r1']);
});

for (const mode of ['values','attributes']) test(`${mode}: base, search and ID sets compose without erasing each other`,()=>{
    const f=fixture(mode,[{id:'C1',city:'Milan',active:1},{id:'C2',city:'Milan',active:1},
        {id:'C3',city:'Rome',active:1},{id:'C10',city:'Milan',active:0}]);
    const before=f.bag.toTytx();
    f.first.applyFilter({value:'= 1',columns:['active'],dtype:'L',locale:'en-US'},'base');
    f.first.applyFilter({value:'Milan',columns:['city'],dtype:'T'});
    f.first.applySetFilter([{field:'id',value:'C1,C3,C10'},{field:'id',value:'C1,C2'}]);
    assert.deepEqual(f.labels(),['r0']);
    f.first.applySetFilter(null); assert.deepEqual(f.labels(),['r0','r1']);
    f.first.applySetFilter([{field:'id',value:'C1,C3'}]);
    f.first.applyFilter(null); assert.deepEqual(f.labels(),['r0','r2']);
    f.first.applyFilter({value:'= 0',columns:['active'],dtype:'L',locale:'en-US'},'base');
    assert.deepEqual(f.labels(),[]);
    f.first.applySetFilter([{field:'id',value:'C10'}]);assert.deepEqual(f.labels(),['r3']);
    f.first.applyFilter(null,'base');assert.deepEqual(f.labels(),['r3']);
    assert.throws(()=>f.first.applySetFilter([{field:'id',value:null}]),/string/);
    assert.deepEqual(f.labels(),['r3']);
    assert.deepEqual(f.labels(f.second),['r0','r1','r2','r3']);
    assert.equal(f.bag.toTytx(),before);
    f.first.applySetFilter(null);f.first.applyFilter({value:' ',columns:['city'],dtype:'T'});
    assert.deepEqual(f.labels(),['r0','r1','r2','r3']);
    f.first.disconnect();f.second.disconnect();
});

for(const mode of ['values','attributes']) test(`${mode}: column facets exclude their own criterion and compose with all other filters`,()=>{
    const f=fixture(mode,[{id:'1',city:'Milan',kind:'A'},{id:'2',city:'Turin',kind:'A'},
        {id:'3',city:'Milan',kind:'B'},{id:'4',city:'Rome',kind:'B'},{id:'5',city:'',kind:'A'}]);
    const original=f.bag.toTytx();
    const counts=field=>f.first.columnFacets(field).map(({value,count})=>[value,count]);
    assert.deepEqual(counts('city'),[['Milan',2],['Turin',1],['Rome',1],[null,1]]);
    f.first.applyColumnFilter('city',['Milan','Turin']);
    assert.deepEqual(f.labels(),['r0','r1','r2']);
    assert.deepEqual(counts('city'),[['Milan',2],['Turin',1],['Rome',1],[null,1]]);
    f.first.applyColumnFilter('kind',['A']);assert.deepEqual(f.labels(),['r0','r1']);
    assert.deepEqual(counts('city'),[['Milan',1],['Turin',1],['Rome',0],[null,1]]);
    assert.deepEqual(counts('kind'),[['A',2],['B',1]]);
    f.first.applySetFilter([{field:'id',value:'1,3,4'}]);
    f.first.applyFilter({value:'Milan',columns:['city'],dtype:'T'});
    assert.deepEqual(f.labels(),['r0']);assert.deepEqual(counts('city'),[['Milan',1],['Turin',0],['Rome',0],[null,0]]);
    assert(f.first.columnFacets('city').find(item=>item.value==='Turin').selected);
    f.first.applyColumnFilter('city',[]);assert.deepEqual(f.labels(),[]);
    assert.equal(counts('city')[0][1],1);
    f.first.applyColumnFilter('city',null);assert.deepEqual(f.labels(),['r0']);
    assert.equal(f.first.filter.value,'Milan');
    f.first.applyFilter(null);f.first.applySetFilter(null);f.first.applyColumnFilter('kind',null);
    f.first.applyColumnFilter('city',[null]);assert.deepEqual(f.labels(),['r4']);
    assert.equal(f.bag.toTytx(),original);assert.equal(f.labels(f.second).length,5);
    f.first.disconnect();f.second.disconnect();
});

test('facets keep typed identities, missing selections and notify on hidden record edits',()=>{
    const f=fixture('attributes',[{value:1},{value:'1'},{value:new Date('2026-01-01')},{value:null},{value:''}]);
    assert.equal(f.first.columnFacets('value').length,4);
    f.first.applyColumnFilter('value',[1]);assert.deepEqual(f.labels(),['r0']);
    f.first.applyColumnFilter('value',[new Date('2026-01-01')]);assert.deepEqual(f.labels(),['r2']);
    f.first.applyColumnFilter('value',['missing']);assert.deepEqual(f.labels(),[]);
    assert.deepEqual(f.first.columnFacets('value').at(-1),{key:'"missing"',value:'missing',count:0,selected:true});
    let events=0;f.first.subscribe(()=>events++);
    f.bag.getNode('r0').setAttr({value:2});f.parent.receiveData({},f.bag.getNode('r0'));assert.equal(events,1);
    assert.equal(f.first.columnFacets('value')[0].value,2);
    assert.throws(()=>f.first.applyColumnFilter('value',[{}]),/scalar/);
    assert.deepEqual(f.first.columnFilter('value'),['missing']);
    f.first.disconnect();f.second.disconnect();
});

test('date column ranges are inclusive, self-excluding and intersect typed picks and other filters',()=>{
    const d=text=>new Date(text);
    const f=fixture('attributes',[
        {day:d('2026-03-01T00:00:00Z'),group:'A'},
        {day:d('2026-03-31T23:59:59Z'),group:'A'},
        {day:d('2026-04-01T00:00:00Z'),group:'A'},
        {day:null,group:'A'},
        {day:d('2026-03-01T00:00:00Z'),group:'B'}]);
    const range={from:d('2026-03-01'),to:d('2026-03-31'),dtype:'DH'};
    f.first.applyColumnFilter('group',['A']);
    f.first.applyColumnFilter('day',null,range);
    assert.deepEqual(f.labels(),['r0','r1']);
    assert.deepEqual(f.first.columnFacets('day').map(v=>[v.count,v.selected]),[[1,true],[1,true]]);
    f.first.applyColumnFilter('day',[d('2026-03-01')]);assert.deepEqual(f.labels(),['r0']);
    f.first.applyColumnFilter('day',null);assert.deepEqual(f.labels(),['r0','r1']);
    assert.throws(()=>f.first.applyColumnFilter('day',null,{...range,from:d('2026-04-01')}),/From/);
    assert.deepEqual(f.labels(),['r0','r1']);
    const snapshot=f.first.columnRange('day');snapshot.from.setFullYear(2000);
    assert.equal(f.first.columnRange('day').from.getUTCFullYear(),2026);
    f.second.copyFiltersFrom(f.first);assert.deepEqual(f.labels(f.second),['r0','r1']);
    f.first.applyColumnFilter('day',[],range);assert.deepEqual(f.labels(),[]);
    f.first.applyColumnFilter('day',null,null);assert.deepEqual(f.labels(),['r0','r1','r2','r3']);
    f.first.applyColumnFilter('day',null,{from:null,to:d('2026-03-01'),dtype:'DHZ',timeZone:'America/Los_Angeles'});
    assert.deepEqual(f.labels(),['r0']);
});

test('literal search retains raw query and treats regex punctuation as ordinary text',()=>{
    const f=fixture('attributes',[{name:'A[B].*'},{name:'ab'},{name:'a|b'}]);
    const filter={value:'[b].*',columns:['name'],dtype:'T',literal:true};
    f.first.applyFilter(filter);assert.deepEqual(f.labels(),['r0']);assert.deepEqual(f.first.filter,filter);
    f.first.applyFilter({...filter,value:'a|b'});assert.deepEqual(f.labels(),['r2']);
    f.first.applyFilter({...filter,value:'a|b',literal:false});assert.equal(f.labels().length,3);
});
