import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {createDecimal} from '@genrojs/tytx';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {BagCollectionView} from '../src/stores/bag-collection-view.js';

function fixture(mode,records) {
    const data=new Bag(), bag=new Bag();data.setItem('rows',bag);data.setBackref();
    records.forEach((record,index)=>bag.setItem(`r${index}`,mode==='values'?new Bag(record):null,mode==='attributes'?record:{}));
    const parent=new BagCollectionStore(bag,mode), first=new BagCollectionView(parent), second=new BagCollectionView(parent);
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

test('disconnect releases parent subscription; reconnect and retarget retain view criteria',()=>{
    const f=fixture('attributes',[{v:1},{v:2}]);f.first.sort('v:d');
    let notices=0;f.first.subscribe(()=>notices++);f.first.disconnect();
    f.bag.getNode('r0').setAttr({v:3});f.parent.receiveData({},f.bag.getNode('r0'));assert.equal(notices,0);
    f.first.connect();assert.deepEqual(f.labels(),['r0','r1']);assert.equal(notices,1);
    const replacement=fixture('attributes',[{v:4},{v:5}]);f.first.bindStore(replacement.parent);
    assert.equal(f.first.sortedBy,'v:d');assert.deepEqual(f.labels(),['r1','r0']);
    const count=notices;f.parent.receiveData({});assert.equal(notices,count);
});
