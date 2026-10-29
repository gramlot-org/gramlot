import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';

const tick = () => new Promise(resolve => setTimeout(resolve,0));
function fixture(t, extra = () => {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    for (const name of ['showPopover','hidePopover','scrollIntoView']) window.HTMLElement.prototype[name] = function() {};
    const app = new Gramlot({document:window.document,transport:false,collections:[inputs],locale:'en-GB'});
    app.data.setItem('record',new Bag({name:'Mario',amount:12,date:new Date('2026-10-29T00:00:00Z')}));
    const builder = new GramlotBuilder(null,{collections:[inputs]});
    const form = builder.root.div({node_label:'form',form:true,datapath:'record'});
    form.textbox({node_label:'name',id:'name',value:'^.name',validate_notnull:true});
    form.numberTextBox({node_label:'amount',id:'amount',value:'^.amount',validate_min:0});
    form.dateTextBox({node_label:'date',id:'date',value:'^.date'});
    extra(form,app,builder.root);
    app.src.startSource(builder.toTytx());
    t.after(() => { app.dispose(); window.close(); });
    const owner = app.src.builder.source.getNode('main.form');
    const host = id => window.document.getElementById(id);
    const fire = (control,type) => control.dispatchEvent(new window.Event(type,{bubbles:true}));
    const edit = (id,value,commit=true) => { const control=host(id).control; control.focus();control.value=value;fire(control,'input');if(commit)fire(control,'change'); };
    return {app,owner,state:owner.formState,host,edit,fire,window};
}

test('form baseline, previous values, invalid current Data and return to clean',async t => {
    const f=fixture(t); await tick();
    assert.equal(f.state.status.status,'ok');
    f.edit('name','Luigi'); assert.equal(f.app.data.getItem('record.name'),'Luigi');
    assert.equal(f.state.status.status,'changed');
    assert.equal(f.state.registers.getItem('changes.name.previous'),'Mario');
    f.edit('name','Mario'); assert.equal(f.state.status.status,'ok');
    f.edit('name',''); assert.equal(f.app.data.getItem('record.name'),'');
    assert.equal(f.state.status.status,'error'); assert.equal(f.state.accept(),false);
    f.edit('name','Ada'); assert.equal(f.state.accept(),true);
    assert.equal(f.state.registers.getItem('baseline.name'),'Ada'); assert.equal(f.state.status.status,'ok');
});

test('unparseable number/date drafts live on Source; typed invalid numbers live in Data',async t => {
    const f=fixture(t); await tick();
    const input=f.host('amount');
    f.edit('amount','-'); assert.equal(f.owner.value.getNode('amount').formDraft,'-');
    assert.equal(f.app.data.getItem('record.amount'),12); assert.equal(f.state.accept(),false);
    f.edit('amount','-3'); assert.equal(f.app.data.getItem('record.amount'),-3);
    assert.equal(f.state.status.valid,false); assert.equal(Object.hasOwn(f.owner.value.getNode('amount'),'formDraft'),false);
    f.edit('amount','15'); f.edit('date','not a date');
    assert.equal(f.owner.value.getNode('date').formDraft,'not a date'); assert.equal(f.state.accept(),false);
    f.state.restore(); await tick();
    assert.equal(f.app.data.getItem('record.amount'),12); assert.equal(f.state.status.status,'ok');
    assert.equal(f.host('amount'),input); assert.equal(f.host('amount').control.value,'12');
});

test('pending validations block acceptance and late answers cannot replace newer edits',async t => {
    let answer;
    const f=fixture(t,(form,app) => {
        form.textbox({node_label:'remote',id:'remote',value:'^.remote',validate_remote:'check'});
        app.data.setItem('record.remote','ready');
        app.rpc.call=(_kind,_method,{value}) => value==='slow' ? new Promise(resolve => {answer=resolve;}) : Promise.resolve({value});
    }); await tick();
    f.edit('remote','slow'); assert.equal(f.app.data.getItem('record.remote'),'slow');
    assert.equal(f.state.status.pending,true); assert.equal(f.state.accept(),false);
    f.edit('remote','new'); await tick(); answer({value:'STALE'}); await tick();
    assert.equal(f.app.data.getItem('record.remote'),'new'); assert.equal(f.state.status.pending,false);
    assert.equal(f.state.accept(),true);
});

test('external edits, removal and separate scopes preserve registers and instances',async t => {
    const f=fixture(t,(_form,app,root) => {
        app.data.setItem('other',new Bag({name:'Other'}));
        root.div({node_label:'other',form:true,datapath:'other'}).textbox({id:'other-name',value:'^.name',validate_notnull:true});
    });await tick();
    const other=f.app.src.builder.source.getNode('main.other').formState;
    f.edit('name',''); assert.equal(other.status.status,'ok');
    f.owner.value.popNode('name'); await tick(); assert.equal(f.state.status.valid,true);
    f.app.data.setItem('record.amount',23);await tick();assert.equal(f.state.status.dirty,true);
    const node=f.owner.value.getNode('amount'),host=f.host('amount');
    const mount=host.parentNode;host.remove();mount.append(host);await tick();
    assert.equal(f.host('amount'),host);assert.equal(f.state.fields.has(node),true);
    f.state.restore();await tick();assert.equal(f.state.status.status,'ok');
});


test('initial errors and dynamic validation rules gate acceptance without recreating fields',async t => {
    const f=fixture(t,(form,app) => { app.data.setItem('required',false); app.data.setItem('record.extra','');
        form.textbox({id:'extra',value:'^.extra',validate_notnull:'^required'}); });
    await tick();const host=f.host('extra');
    f.app.data.setItem('required',true);assert.equal(f.state.accept(),false);await tick();
    assert.equal(f.state.status.valid,false);assert.equal(f.host('extra'),host);
    f.app.data.setItem('required',false);await tick();assert.equal(f.state.status.valid,true);
});

test('accept flushes an uncommitted editor and restore retains typed dates and nested Bag snapshots',async t => {
    const f=fixture(t);await tick();
    f.edit('name','Luigi',false);assert.equal(f.app.data.getItem('record.name'),'Mario');
    assert.equal(f.state.accept(),true);assert.equal(f.app.data.getItem('record.name'),'Luigi');
    f.app.data.setItem('record.date',new Date('2026-10-29T00:00:00Z'));await tick();
    assert.equal(f.state.status.dirty,false);
    f.app.data.setItem('record.nested',new Bag({a:1}));await tick();
    assert.equal(f.state.registers.getItem('changes.nested.existed'),false);
    f.state.restore();await tick();assert.equal(f.app.data.getNode('record.nested'),null);
    assert.equal(f.app.data.getItem('record.date').toISOString(),'2026-10-29T00:00:00.000Z');
});

test('form scope relocation follows relative paths and preserves controls',async t => {
    const f=fixture(t);await tick();const host=f.host('name');
    f.app.data.setItem('moved',f.app.data.getItem('record').deepcopy());
    f.owner.setAttr({datapath:'moved'});await tick();
    f.edit('name','Moved');assert.equal(f.app.data.getItem('moved.name'),'Moved');
    assert.equal(f.app.data.getItem('record.name'),'Mario');assert.equal(f.host('name'),host);
    f.state.restore();await tick();assert.equal(f.app.data.getItem('moved.name'),'Mario');
});

test('async field removal clears pending/error registers and does not revive on completion',async t => {
    let answer;
    const f=fixture(t,(form,app) => {
        form.textbox({node_label:'remote',id:'remote',value:'^.remote',validate_remote:'check'});
        app.data.setItem('record.remote','ready');
        app.rpc.call=() => new Promise(resolve => { answer=resolve; });
    });await tick();assert.equal(f.state.status.pending,true);
    f.owner.value.popNode('remote');assert.equal(f.state.status.pending,false);
    answer({errorcode:'bad',message:'Late error'});await tick();assert.equal(f.state.status.valid,true);
});

test('form records are not stored on Logic and pending validation survives DOM relocation',async t => {
    const answers=[];
    const f=fixture(t,(form,app) => {
        form.textbox({node_label:'remote',id:'remote',value:'^.remote',validate_remote:'check'});
        app.data.setItem('record.remote','ready');
        app.rpc.call=() => new Promise(resolve => answers.push(resolve));
    });await tick();const host=f.host('remote'),mount=host.parentNode;
    host.remove();mount.append(host);assert.equal(f.state.accept(),false);await tick();
    answers.at(-1)({errorcode:'bad',message:'Rejected'});await tick();
    assert.equal(f.state.status.valid,false);assert.equal(f.host('remote'),host);
    assert.equal(f.owner.value.getNode('remote').formState,f.state);
});


test('selected identity resolution and hard-condition errors block a form',async t => {
    const f=fixture(t,(form,app) => {
        app.data.setItem('record.customer',1);app.data.setItem('state','NSW');
        form.dbSelect({id:'customer',value:'^.customer',dbtable:'customer',condition:'$state = :state',condition_state:'^state'});
        app.rpc.call=async (_kind,_method,params) => ({rows:[{id:1,name:'Mario'}],identifier:'id',caption:'name',
            ...(params.state==='VIC' ? {errors:'Customer belongs to another state.'} : {})});
    });await tick();await tick();
    assert.equal(f.state.status.status,'ok');assert.equal(f.host('customer').control.value,'Mario');
    f.app.data.setItem('state','VIC');assert.equal(f.state.accept(),false);await tick();await tick();
    assert.equal(f.app.data.getItem('record.customer'),1);assert.equal(f.state.status.valid,false);
    assert.equal(f.state.accept(),false);
    f.app.data.setItem('state','NSW');await tick();await tick();assert.equal(f.state.status.valid,true);
});

test('restoring a rejected text draft and typed zero does not recreate or lose the baseline',async t => {
    const f=fixture(t);await tick();const host=f.host('name');
    f.edit('name','');f.edit('amount','0');assert.equal(f.app.data.getItem('record.amount'),0);
    f.state.restore();await tick();assert.equal(f.host('name'),host);assert.equal(host.control.value,'Mario');
    assert.equal(f.state.status.status,'ok');
});


test('required dbSelect candidate lookup gates acceptance until the unique candidate is validated', async t => {
    let answer;
    const f=fixture(t,(form,app) => {
        app.data.setItem('record.customer',1);app.data.setItem('state','NSW');
        form.dbSelect({id:'customer',value:'^.customer',dbtable:'customer',validate_notnull:true,
            condition:'$state = :state',condition_state:'^state'});
        app.rpc.call=async (_kind,_method,params) => {
            if (params.state === 'VIC' && Object.hasOwn(params,'_querystring')) {
                return new Promise(resolve => {answer=resolve;});
            }
            return {rows:[{id:params._id ?? 1,name:'Customer'}],identifier:'id',caption:'name'};
        };
    });await tick();await tick();
    f.app.data.setItem('state','VIC');assert.equal(f.state.accept(),false);
    answer({rows:[{id:2,name:'Victoria customer'}],identifier:'id',caption:'name'});
    await tick();await tick();
    assert.equal(f.app.data.getItem('record.customer'),2);assert.equal(f.state.status.pending,false);
    assert.equal(f.state.accept(),true);
});


test('restore clears incomplete editor text even when the typed Data never changed',async t => {
    const f=fixture(t);await tick();
    f.edit('amount','-');f.edit('date','31/');
    assert.equal(f.app.data.getItem('record.amount'),12);
    f.state.restore();await tick();
    assert.equal(f.host('amount').control.value,'12');
    assert.notEqual(f.host('date').control.value,'31/');
    assert.equal(f.state.status.status,'ok');
    assert.equal(f.state.registers.getItem('drafts').length,0);
});
