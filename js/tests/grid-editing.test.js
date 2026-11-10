import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';
import grid from '../src/components/grid.js';
import {GridCellEditor} from '../src/components/grid-cell-editor.js';
import {GramlotBuilderBagNode} from '../src/builder/source.js';
import {layoutWindow} from './helpers/layout-window.js';
import {assertFieldMapsByAddress} from './helpers/editing-session-addresses.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
async function fixture(t, {mode='values', form=false, nameColumn={}, nameValue=i=>`Item ${i}`,amountEdit={validate_min:0},count=1000} = {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const layout = layoutWindow(window);
    for (const name of ['showPopover','hidePopover','scrollIntoView']) window.HTMLElement.prototype[name] = function() {};
    const failures=[];
    window.addEventListener('error', e => { failures.push(e.error); });
    const app = new Gramlot({document:window.document,transport:false,collections:[inputs,grid],locale:'en-GB'});
    const rows = new Bag();
    for (let i=0;i<count;i++) rows.setItem(`r${i}`,mode==='values' ? new Bag({name:nameValue(i),amount:i+1}) : null,mode==='attributes' ? {name:nameValue(i),amount:i+1} : {});
    app.data.setItem('record',new Bag({title:'Invoice',rows}));
    const builder = new GramlotBuilder(null,{collections:[inputs,grid]});
    const pane = builder.root.div({node_label:'pane',datapath:'record',form});
    if (form) pane.textbox({id:'title',value:'^.title'});
    const g = pane.grid({node_label:'grid',id:'grid',storepath:'.rows',rowMode:mode,rowHeaders:true});
    const s = g.struct();
    s.column({field:'name',edit:{validate_notnull:true},...nameColumn});
    s.column({field:'amount',dtype:'L',edit:amountEdit});
    app.src.startSource(builder.toTytx()); await tick(); layout.flush();
    const host=window.document.getElementById('grid'), body=host.shadowRoot.querySelector('.body-viewport');
    Object.defineProperty(body,'clientHeight',{value:320});layout.flush();
    const source=app.src.source.getNode('main.pane.grid');
    t.after(() => {app.dispose();window.close(); assert.deepEqual(failures,[]);});
    const cell=(row,field)=>host.shadowRoot.querySelector(`tr[data-row="${row}"] td[data-field="${field}"]`);
    const open=async(row='r0',field='amount')=>{cell(row,field).dispatchEvent(new window.MouseEvent('dblclick',{bubbles:true}));await tick();if(failures.length)throw failures[0];return host.querySelector('[slot=cell-editor] gramlot-number-text-box');};
    const edit=(element,text,commit=false)=>{element.control.value=text;element.control.dispatchEvent(new window.Event('input',{bubbles:true}));if(commit)element.control.dispatchEvent(new window.Event('change',{bubbles:true}));};
    const scroll=async(index)=>{body.scrollTop=source._internal.gridRowLayout.offset(index);body.dispatchEvent(new window.Event('scroll'));layout.flush();await tick();layout.flush();};
    return {window,app,host,source,rows,cell,open,edit,scroll,layout,mode};
}
for (const mode of ['values','attributes']) {
    test(`${mode}: grid reuses the form session and typed validation`,async t=>{
        const f=await fixture(t,{mode,form:true});
        const editor=await f.open(); const session=f.source.formState;
        assert.equal(session,f.source.parentNode.formState);
        f.edit(editor,'-3',true);await tick();
        assert.equal(session.status.valid,false);
        assert.equal(mode==='values'?f.rows.getItem('r0.amount'):f.rows.getNode('r0').getAttr('amount'),-3);
        assert.equal(session.accept(),false);
        f.edit(editor,'7',true);await tick();assert.equal(session.status.valid,true);
        assert.equal(await session.validate(),true);assert.equal(session.accept(),true);
        f.edit(editor,'9',true);await tick();session.restore();await tick();
        const data=f.app.data.getItem('record.rows');
        assert.equal(mode==='values'?data.getItem('r0.amount'):data.getNode('r0').getAttr('amount'),7);
    });
    test(`${mode}: virtualization disposes controls, preserving incomplete drafts and errors by data identity`,async t=>{
        const f=await fixture(t,{mode});let editor=await f.open();
        f.edit(editor,'-',true);await tick();const session=f.source.formState;
        assert.equal(session.registers.getItem('drafts').length,1);
        assert.equal(session.status.valid,false);
        await f.scroll(500);
        assert.equal(f.cell('r0','amount'),null);
        assert.equal(f.host.querySelector('[slot=cell-editor]'),null,'editor DOM is released');
        assert.equal(session.registers.getItem('drafts').length,1);
        assert.equal(session.registers.getItem('errors').length,1);
        assert.equal(session.accept(),false);
        await f.scroll(0);editor=await f.open();
        assert.equal(editor.control.value,'-');
        f.edit(editor,'-5',true);await tick();await f.scroll(500);
        assert.equal(session.registers.getItem('drafts').length,0);
        assert.equal(session.registers.getItem('errors').length,1);
        await f.scroll(0);assert.equal(f.cell('r0','amount').getAttribute('aria-invalid'),'true');
        editor=await f.open();f.edit(editor,'6',true);await tick();
        assert.equal(session.status.valid,true);assert.equal(await session.validate(),true);assert.equal(session.accept(),true);
        assert.ok(f.host.shadowRoot.querySelectorAll('tbody tr').length<40);
    });
}
test('grid changes include attribute originals and returning to baseline removes the change',async t=>{
    const f=await fixture(t,{mode:'attributes'});const editor=await f.open();
    f.edit(editor,'9',true);await tick();const session=f.source.formState;
    const change=session.registers.getItem('changes').getNodes()[0].value;
    assert.equal(change.getItem('previousAttributes.amount'),1);
    assert.equal(change.getItem('currentAttributes.amount'),9);
    f.edit(editor,'1',true);await tick();assert.equal(session.status.dirty,false);
});
test('a row reloaded with a new node at the same path keeps its invalid draft and error',async t=>{
    const f=await fixture(t);const editor=await f.open();
    f.edit(editor,'-',true);await tick();const session=f.source.formState;
    const path='record.rows.r0.amount', before=f.app.data.getNode(path);
    assert.equal(session.fieldStatus(path).draft,'-');
    f.rows.setItem('r0',new Bag({name:'Item 0',amount:1}));await tick();await tick();
    assert.notEqual(f.app.data.getNode(path),before);
    assert.equal(session.fieldStatus(path).draft,'-');
    assert.equal(session.registers.getItem('drafts').length,1);
    assert.equal(session.registers.getItem('errors').length,1);
    assert.equal(session.status.valid,false);
});
test('removing a row clears its suspended drafts/errors, while restore resets the whole shared scope',async t=>{
    const f=await fixture(t,{form:true});const editor=await f.open();f.edit(editor,'-',true);await tick();await f.scroll(500);
    f.rows.popNode('r0');await tick();await tick();
    const session=f.source.formState;
    assert.equal(session.registers.getItem('errors').length,0);
    assert.equal(session.registers.getItem('drafts').length,0);
    session.restore();await tick();assert.equal(f.app.data.getItem('record.rows').length,1000);
    assert.equal(session.status.dirty,false);
});

test('Tab commits through the common adapter, moves in view order, and Escape discards only unfinished text',async t=>{
    const f=await fixture(t);let editor=await f.open();
    f.edit(editor,'13');
    editor.control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Tab',bubbles:true,composed:true}));await tick();
    assert.equal(f.rows.getItem('r0.amount'),13);
    assert.equal(f.host.querySelector('gramlot-textbox').control.value,'Item 1');
    await f.scroll(0);editor=await f.open();f.edit(editor,'-');
    editor.control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true}));await tick();
    assert.equal(f.rows.getItem('r0.amount'),13);
    assert.equal(f.source.formState.registers.getItem('drafts').length,0);
});

test('editor declarations keep plain values and find the container and control by address',async t=>{
    const editors=[],configure=GridCellEditor.prototype.configure;
    GridCellEditor.prototype.configure=function(...args){editors.push(this);return configure.apply(this,args);};
    t.after(()=>{GridCellEditor.prototype.configure=configure;});
    const f=await fixture(t);let editor=await f.open();
    const [cellEditor]=new Set(editors);
    const plain=value=>{
        assert.ok(!(value instanceof GramlotBuilderBagNode) && !(value instanceof Bag),'no Source node or Bag');
        if (value && typeof value==='object') {
            assert.equal(Object.getPrototypeOf(value),Object.prototype);
            for (const item of Object.values(value)) plain(item);
        }
    };
    assert.equal(cellEditor.declarations.size,1);
    for (const declaration of cellEditor.declarations.values()) {
        assert.deepEqual(Object.keys(declaration).sort(),['field','id','options','tag']);
        plain(declaration);
        const container=f.source.value.getNode(declaration.id);
        assert.equal(cellEditor.container(declaration),container);
        assert.equal(cellEditor.control(declaration).getAttr('id'),declaration.id);
    }
    f.edit(editor,'21');
    editor.control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true,composed:true}));await tick();
    assert.equal(f.rows.getItem('r0.amount'),21);
    assert.equal(cellEditor.declarations.size,0,'a committed clean field releases its declaration');
    assert.equal(f.source.value.getNodes().filter(node=>node.label.startsWith('grid-cell-')).length,0,'its container is removed');
    editor=await f.open('r1');f.edit(editor,'-');
    editor.control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true}));await tick();
    assert.equal(f.rows.getItem('r1.amount'),2);
    assert.equal(f.source.formState.registers.getItem('drafts').length,0);
});
for (const mode of ['values','attributes']) {
    test(`${mode}: =#ROW in column edit options reads the edited row, as legacy condition_*='=#ROW.x'`,async t=>{
        const f=await fixture(t,{mode,count:2,amountEdit:{validate_min:0,placeholder:'=#ROW.name'}});
        let editor=await f.open('r0');
        assert.equal(editor.control.placeholder,'Item 0');
        const control=f.source.value.getNode(editor.id).value.getNodes()[0];
        assert.equal(control.getAttr('placeholder'),mode==='values'?'=record.rows.r0.name':'=record.rows.r0?name','the option stays an address');
        editor.control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true}));await tick();
        editor=await f.open('r1');
        assert.equal(editor.control.placeholder,'Item 1');
        const struct=f.source.getRelativeData(f.source.getAttr('structpath'));
        struct.getNode('view_0.rows_0.cell_amount').setAttr({edit:{validate_min:0,placeholder:'=#ROW.name:Row {}'}});
        await tick();await tick();f.layout.flush();
        assert.equal(editor.control.placeholder,'Row Item 1','a changed struct applies the options to the edited row');
    });
    test(`${mode}: ^#ROW in column edit options follows the edited row, as legacy condition_*='^#ROW.x'`,async t=>{
        const f=await fixture(t,{mode,count:2,amountEdit:{validate_min:0,placeholder:'^#ROW.name'}});
        const editor=await f.open('r0');
        assert.equal(editor.control.placeholder,'Item 0');
        if (mode==='values') f.rows.getItem('r0').setItem('name','Renamed');
        else f.rows.getNode('r0').setAttr({name:'Renamed'});
        await tick();await tick();
        assert.equal(editor.control.placeholder,'Renamed');
        assert.equal(f.rows.getItem(mode==='values'?'r1.name':'r1?name'),'Item 1');
    });
}
test('local load establishes one baseline for both form fields and grid rows',async t=>{
    const f=await fixture(t,{form:true});const session=f.source.formState;
    const rows=new Bag();rows.setItem('fresh',new Bag({name:'Loaded',amount:27}));
    session.load(new Bag({title:'Loaded record',rows}));await tick();f.layout.flush();
    assert.equal(f.window.document.getElementById('title').control.value,'Loaded record');
    assert.equal(session.data.getItem('rows.fresh.amount'),27);
    assert.equal(session.status.dirty,false);
    assert.equal(session.registers.getItem('baseline.rows.fresh.amount'),27);
});

test('editing one nested cell does not rescan unrelated resident rows and preserves changed ancestors',async t=>{
    const f=await fixture(t,{form:true}),session=f.source.formState;
    const unrelated=f.rows.getNode('r999');
    t.mock.method(unrelated,'getValue',()=>{throw new Error('Unrelated row was traversed');});
    f.rows.getItem('r0').setItem('amount',31);
    assert.equal(session.registers.getItem('changes').length,1);
    const added=new Bag({name:'New',amount:1});f.rows.setItem('added',added);
    added.setItem('amount',2);
    const entry=session.registers.getItem('changes').getNodes().find(n=>n.value.getItem('path')==='rows.added');
    assert.equal(entry.value.getItem('existed'),false);assert.equal(entry.value.getItem('current.amount'),2);
});


async function remoteField(f, options = {}) {
    const calls=[];
    f.app.rpc.call=(_kind,_method,params,{signal})=>new Promise(resolve=>calls.push({params,signal,resolve}));
    const struct=f.source.getRelativeData(f.source.getAttr('structpath'));
    struct.getNode('view_0.rows_0.cell_amount').setAttr({edit:{validate_remote:'check',...options}});
    await tick();
    return calls;
}
for (const mode of ['values','attributes']) {
    test(`${mode}: session finishes remote validation after editor disposal without reopening`,async t=>{
        const f=await fixture(t,{mode}),calls=await remoteField(f);
        const editor=await f.open();f.edit(editor,'19',true);await tick();
        const session=f.source.formState,request=calls.at(-1),count=calls.length;
        await f.scroll(500);
        assert.equal(f.host.querySelector('[slot=cell-editor]'),null);
        assert.equal(session.fields.size,0,'no mounted adapter retained');
        assert.equal(request.signal.aborted,false);
        assert.equal(session.accept(),false);
        request.resolve({value:100});await tick();await tick();
        assert.equal(mode==='values'?f.rows.getItem('r0.amount'):f.rows.getNode('r0').getAttr('amount'),100);
        f.app.rpc.call=async()=>true;
        assert.equal(session.status.pending,false);assert.equal(await session.validate(),true);assert.equal(session.accept(),true);
        assert.equal(calls.length,count,'completion does not restart validation');
        assert.equal(f.host.querySelector('[slot=cell-editor]'),null,'completion does not revive the view');
        assert.equal(session.validations.size,0,'clean suspended field releases semantic resources');
    });
}
test('grid editing session maps reference editor Source nodes by fullpath',async t=>{
    const f=await fixture(t,{form:true}),calls=await remoteField(f),session=f.source.formState;
    const editor=await f.open();f.edit(editor,'19',true);await tick();
    assert.equal(session.validations.size>0,true);assertFieldMapsByAddress(session);
    await f.scroll(500);assertFieldMapsByAddress(session);
    calls.at(-1).resolve({value:21});await tick();
    assert.equal(f.rows.getItem('r0.amount'),21);assertFieldMapsByAddress(session);
});
test('reopening a pending field attaches a fresh control without cancelling or repeating its request',async t=>{
    const f=await fixture(t),calls=await remoteField(f);
    let editor=await f.open();f.edit(editor,'19',true);await tick();const count=calls.length,request=calls.at(-1),old=editor;
    await f.scroll(500);await f.scroll(0);editor=await f.open();
    assert.notEqual(editor,old);assert.equal(calls.length,count);assert.equal(request.signal.aborted,false);
    request.resolve({errorcode:'bad',message:'Rejected by validator'});await tick();
    assert.equal(f.source.formState.status.pending,false);
    assert.equal(f.source.formState.status.valid,false);
    assert.match(editor.message.textContent,/Rejected by validator/);
    await f.scroll(500);assert.equal(f.source.formState.accept(),false);
    await f.scroll(0);editor=await f.open();assert.equal(calls.length,count);
    assert.match(editor.message.textContent,/Rejected by validator/);
});
test('normalization and callbacks retain real Source context after unmount',async t=>{
    const f=await fixture(t),calls=await remoteField(f,{validate_onAccept:'accepted'});
    const contexts=[];
    f.app.src.logicRegistry.register(class {accepted(node,kw) {contexts.push({node,value:kw.value});node.setRelativeData('.checked',kw.value);}}, {resource:'test:session-callback'});
    const editor=await f.open();f.edit(editor,'19',true);await tick();
    const node=f.source.formState.fieldNode([...f.source.formState.validations.keys()][0]);await f.scroll(500);
    calls.at(-1).resolve({value:23,data:new Bag({patched:true})});await tick();
    assert.equal(f.rows.getItem('r0.amount'),23);assert.equal(f.app.data.getItem('record.checked'),23);
    assert.equal(f.app.data.getItem('record.patched'),true);
    assert.deepEqual(contexts,[{node,value:23}]);
});
test('a newer candidate or external value supersedes a suspended validation',async t=>{
    const f=await fixture(t),calls=await remoteField(f);
    let editor=await f.open();f.edit(editor,'19',true);await tick();const first=calls.at(-1);
    await f.scroll(500);f.rows.getItem('r0').setItem('amount',27);await tick();const second=calls.at(-1);
    assert.equal(first.signal.aborted,true);assert.equal(second.params.value,27);
    first.resolve({value:99});await tick();assert.equal(f.rows.getItem('r0.amount'),27);
    await f.scroll(0);editor=await f.open();f.edit(editor,'31',true);await tick();const third=calls.at(-1);
    assert.equal(second.signal.aborted,true);
    second.resolve({errorcode:'stale'});third.resolve({value:32});await tick();
    assert.equal(f.rows.getItem('r0.amount'),32);assert.equal(f.source.formState.status.valid,true);
});
test('changing a bound validation rule while unmounted revalidates without mounting an editor',async t=>{
    const f=await fixture(t);f.app.data.setItem('minimum',0);
    const calls=await remoteField(f,{validate_min:'^minimum'});
    const editor=await f.open();f.edit(editor,'19',true);await tick();const request=calls.at(-1);
    await f.scroll(500);f.app.data.setItem('minimum',20);await tick();
    assert.equal(request.signal.aborted,true);assert.equal(f.source.formState.status.pending,false);
    assert.equal(f.source.formState.status.valid,false);assert.equal(f.host.querySelector('[slot=cell-editor]'),null);
    request.resolve({value:99});await tick();assert.equal(f.rows.getItem('r0.amount'),19);
    f.app.data.setItem('minimum',10);await tick();calls.at(-1).resolve({});await tick();
    assert.equal(f.source.formState.status.valid,true);
});
for (const action of ['remove','replace','restore','load','dispose']) {
    test(`${action} invalidates suspended validation and ignores late completion`,async t=>{
        const f=await fixture(t),calls=await remoteField(f);
        const editor=await f.open();f.edit(editor,'19',true);await tick();const request=calls.at(-1),session=f.source.formState;
        await f.scroll(500);
        if(action==='remove') f.rows.popNode('r0');
        if(action==='replace') {f.rows.popNode('r0');f.rows.setItem('r0',new Bag({name:'Replacement',amount:5}));}
        if(action==='restore') session.restore();
        if(action==='load') {const rows=new Bag();rows.setItem('r0',new Bag({name:'Loaded',amount:7}));session.load(rows);}
        if(action==='dispose') session.dispose();
        await tick();await tick();assert.equal(request.signal.aborted,true);
        request.resolve({value:999,errorcode:'obsolete'});await tick();
        assert.equal(session.registers.getItem('errors').length,0);
        if(action==='remove') assert.equal(f.rows.getNode('r0'),null);
        if(action==='replace') assert.equal(f.rows.getItem('r0.amount'),5);
        if(action==='restore') assert.equal(f.app.data.getItem('record.rows.r0.amount'),1);
        if(action==='load') assert.equal(f.app.data.getItem('record.rows.r0.amount'),7);
    });
}
test('timeout settles in the session after unmount and a late answer stays inert',async t=>{
    const f=await fixture(t),calls=await remoteField(f,{validate_timeout:80});
    const editor=await f.open();f.edit(editor,'19',true);await tick();const request=calls.at(-1);
    await f.scroll(500);await new Promise(resolve=>setTimeout(resolve,90));
    const session=f.source.formState;assert.equal(session.status.pending,false);assert.equal(session.accept(),false);
    assert.match(session.registers.getItem('errors').getNodes()[0].value.getNodes()[0].value,/timed out/);
    request.resolve({value:999});await tick();assert.equal(f.rows.getItem('r0.amount'),19);
});
test('wrong-type normalization is rejected equally with and without an editor',async t=>{
    const f=await fixture(t),calls=await remoteField(f);
    const editor=await f.open();f.edit(editor,'19',true);await tick();await f.scroll(500);
    calls.at(-1).resolve({value:'wrong'});await tick();
    assert.equal(f.rows.getItem('r0.amount'),19);assert.equal(f.source.formState.status.valid,false);
    assert.equal(f.source.formState.status.pending,false);
});


test('Source rule updates on an unmounted editor do not recreate its DOM',async t=>{
    const f=await fixture(t),calls=await remoteField(f);
    const editor=await f.open();f.edit(editor,'19',true);await tick();
    const node=f.source.formState.fieldNode([...f.source.formState.validations.keys()][0]),request=calls.at(-1);
    await f.scroll(500);node.setAttr({validate_min:20});await tick();
    assert.equal(request.signal.aborted,true);assert.equal(f.source.formState.status.valid,false);
    assert.equal(f.host.querySelector('[slot=cell-editor]'),null);
    await f.scroll(0);await f.open();
    assert.equal(f.source.formState.status.valid,false);
});


test('changing validation rules preserves an unparseable suspended draft',async t=>{
    const f=await fixture(t),editor=await f.open();f.edit(editor,'-',true);await tick();
    const node=f.source.formState.fieldNode([...f.source.formState.validations.keys()][0]);
    await f.scroll(500);node.setAttr({validate_min:20});await tick();
    assert.equal(f.source.formState.registers.getItem('drafts').getNodes()[0].value,'-');
    await f.scroll(0);assert.equal((await f.open()).control.value,'-');
});

for (const mode of ['values','attributes']) {
    test(`${mode}: session reports restore an offscreen editor and include form changes`,async t=>{
        const f=await fixture(t,{mode,form:true}),session=f.source.formState;
        let editor=await f.open();f.edit(editor,'-',true);await tick();await f.scroll(500);
        const path=mode==='values'?'record.rows.r0.amount':'record.rows.r0?amount';
        assert.equal(session.errorEntries[0].path,path);
        assert.equal(session.focusField(path),true);await tick();
        editor=f.host.querySelector('gramlot-number-text-box');assert.equal(editor.control.value,'-');
        f.edit(editor,'9',true);await tick();
        f.app.data.setItem('record.title','Changed form');await tick();
        const change=session.changeEntries.find(entry=>entry.path===path);
        assert.ok(change);
        assert.equal(change.previous,1);assert.equal(change.current,9);
        assert.equal(session.changeEntries.length,2);
        await f.scroll(500);f.source.setAttr({filter:{value:'Item 500',columns:['name'],dtype:'T'}});await tick();f.layout.flush();
        assert.equal(session.focusField(path),false,'do not erase the filter to reach a row');
        f.source.setAttr({filter:null});await tick();f.layout.flush();
        assert.equal(session.focusField(path),true);
        f.rows.popNode('r0');await tick();assert.equal(session.focusField(path),false);
    });
}

test('Up/Down follow view order, preserve invalid drafts and cross virtualization boundaries',async t=>{
    const f=await fixture(t),session=f.source.formState;
    let editor=await f.open('r0','amount');f.edit(editor,'-');
    const key=(element,name)=>element.control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:name,bubbles:true,composed:true,cancelable:true}));
    key(editor,'ArrowDown');await tick();
    assert.equal(f.host.querySelector('gramlot-number-text-box').control.value,'2');
    assert.equal(session.errorEntries[0].path,'record.rows.r0.amount');
    editor=f.host.querySelector('gramlot-number-text-box');key(editor,'ArrowUp');await tick();
    assert.equal(f.host.querySelector('gramlot-number-text-box').control.value,'-');
    session.restore();await tick();f.layout.flush();
    assert.equal(session.focusField('record.rows.r500.amount'),true);await tick();
    editor=f.host.querySelector('gramlot-number-text-box');key(editor,'ArrowDown');await tick();
    assert.equal(f.host.querySelector('gramlot-number-text-box').control.value,'502');
    key(f.host.querySelector('gramlot-number-text-box'),'ArrowLeft');await tick();
    assert.equal(f.host.querySelector('gramlot-number-text-box').control.value,'502');
    f.source.setAttr({sortedBy:'amount:d'});await tick();f.layout.flush();
    assert.equal(session.focusField('record.rows.r500.amount'),true);await tick();
    key(f.host.querySelector('gramlot-number-text-box'),'ArrowDown');await tick();
    assert.equal(f.host.querySelector('gramlot-number-text-box').control.value,'500');
});

for (const [tag,settings,value] of [
    ['textBoxArea',{},'First\nSecond'],
    ['dateTextBox',{dtype:'D'},new Date('2026-11-01T00:00:00Z')],
    ['timeTextBox',{dtype:'H'},new Date('1970-01-01T10:30:00Z')],
    ['filteringSelect',{},'One']
]) {
    test(`${tag}: embedded control keeps its vertical arrow behavior`,async t=>{
        const options=tag==='filteringSelect'?{values:'One,Two'}:{};
        const f=await fixture(t,{nameColumn:{...settings,edit:{tag,...options}},nameValue:()=>value});
        f.rows.setItem('r0.name',value);await tick();f.layout.flush();
        f.cell('r0','name').dispatchEvent(new f.window.MouseEvent('dblclick',{bubbles:true}));await tick();
        const host=f.host.querySelector('[slot=cell-editor] [id^=grid-cell-]');
        const control=host.control;
        control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,composed:true,cancelable:true}));await tick();
        assert.equal(f.host.querySelector('[slot=cell-editor] [id^=grid-cell-]'),host);
        if (tag==='filteringSelect') assert.equal(control.getAttribute('aria-expanded'),'true');
        for (const [key,caret] of [['ArrowLeft',0],['ArrowRight',control.value.length]]) {
            control.setSelectionRange(caret,caret);
            control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key,bubbles:true,composed:true,cancelable:true}));await tick();
            assert.equal(f.host.querySelector('[slot=cell-editor] [id^=grid-cell-]'),host);
        }
    });
}

for (const mode of ['values','attributes']) {
    test(`${mode}: horizontal arrows leave a cell only at a collapsed text boundary`,async t=>{
        const f=await fixture(t,{mode});let editor=await f.open();
        const key=(element,key,options={})=>{
            const event=new f.window.KeyboardEvent('keydown',{key,bubbles:true,composed:true,cancelable:true,...options});
            element.control.dispatchEvent(event);return event;
        };
        editor.control.setSelectionRange(0,0);
        assert.equal(key(editor,'ArrowLeft').defaultPrevented,true);await tick();
        const text=f.host.querySelector('gramlot-textbox');
        assert.equal(text.control.value,'Item 0');assert.equal(text.control.selectionStart,6);
        text.control.setSelectionRange(2,2);
        assert.equal(key(text,'ArrowRight').defaultPrevented,false);assert.equal(f.host.querySelector('gramlot-textbox'),text);
        text.control.setSelectionRange(0,6);
        assert.equal(key(text,'ArrowRight').defaultPrevented,false);
        text.control.setSelectionRange(6,6);
        for (const options of [{shiftKey:true},{ctrlKey:true},{altKey:true},{metaKey:true},{isComposing:true}]) {
            assert.equal(key(text,'ArrowRight',options).defaultPrevented,false);
            assert.equal(f.host.querySelector('gramlot-textbox'),text);
        }
        assert.equal(key(text,'ArrowRight').defaultPrevented,true);await tick();
        editor=f.host.querySelector('gramlot-number-text-box');assert.equal(editor.control.value,'1');assert.equal(editor.control.selectionStart,0);
        // Empty text can advance; invalid drafts still belong to the session after navigation.
        f.edit(editor,'-');editor.control.setSelectionRange(1,1);key(editor,'ArrowRight');await tick();
        assert.equal(f.host.querySelector('gramlot-textbox').control.value,'Item 1');
        const session=f.source.formState,path=mode==='values'?'record.rows.r0.amount':'record.rows.r0?amount';
        assert.equal(session.fieldStatus(path).draft,'-');assert.equal(session.status.valid,false);
        const next=f.host.querySelector('gramlot-textbox');next.control.setSelectionRange(0,0);key(next,'ArrowLeft');await tick();
        editor=f.host.querySelector('gramlot-number-text-box');assert.equal(editor.control.value,'-');assert.equal(editor.control.selectionStart,1);
        // Do not wrap past the dataset edges.
        assert.equal(session.focusField(mode==='values'?'record.rows.r0.name':'record.rows.r0?name'),true);await tick();
        const first=f.host.querySelector('gramlot-textbox');first.control.setSelectionRange(0,0);key(first,'ArrowLeft');await tick();
        assert.equal(f.host.querySelector('gramlot-textbox'),first);
        f.edit(first,'');first.control.setSelectionRange(0,0);key(first,'ArrowRight');await tick();
        assert.equal(f.host.querySelector('gramlot-number-text-box').control.value,'-');
        assert.equal(session.focusField(mode==='values'?'record.rows.r999.amount':'record.rows.r999?amount'),true);await tick();
        const last=f.host.querySelector('gramlot-number-text-box');last.control.setSelectionRange(last.control.value.length,last.control.value.length);key(last,'ArrowRight');await tick();
        assert.equal(f.host.querySelector('gramlot-number-text-box'),last);
    });
}


test('editors without a text caret keep their horizontal keys',async t=>{
    const f=await fixture(t,{nameColumn:{dtype:'B',edit:{tag:'checkbox'}},nameValue:()=>true});
    f.cell('r0','name').dispatchEvent(new f.window.MouseEvent('dblclick',{bubbles:true}));await tick();
    const host=f.host.querySelector('gramlot-checkbox');
    for (const key of ['ArrowLeft','ArrowRight']) {
        const event=new f.window.KeyboardEvent('keydown',{key,bubbles:true,composed:true,cancelable:true});
        host.control.dispatchEvent(event);await tick();
        assert.equal(event.defaultPrevented,false);assert.equal(f.host.querySelector('gramlot-checkbox'),host);
    }
});


test('column max_height reaches the display and editor through the same struct projection',async t=>{
    const f=await fixture(t,{nameColumn:{white_space:'pre-wrap',max_height:'6rem',edit:{tag:'textBoxArea'}},nameValue:()=>Array(20).fill('Long text').join('\n')});
    const cell=f.cell('r0','name');
    assert.equal(cell.style.getPropertyValue('--grid-cell-max-height'),'6rem');
    assert.equal(cell.firstElementChild.textContent.split('\n').length,20);
    cell.dispatchEvent(new f.window.MouseEvent('dblclick',{bubbles:true}));await tick();
    const layer=f.host.shadowRoot.querySelector('.cell-editor');
    assert.equal(layer.style.getPropertyValue('--grid-cell-max-height'),'6rem');
    const editor=f.host.querySelector('gramlot-text-box-area');
    assert.equal(editor.control.value.split('\n').length,20);
    f.source.formState.focusField('record.rows.r0.amount');await tick();
    assert.equal(layer.style.getPropertyValue('--grid-cell-max-height'),'','uncapped editors do not inherit the previous column limit');
});

for (const mode of ['values','attributes']) {
    test(`${mode}: full validation covers unopened offscreen cells without constructing input elements`,async t=>{
        const f=await fixture(t,{mode,form:true,nameValue:i=>i===800?'':`Item ${i}`});
        const session=f.source.formState;
        const create=f.window.document.createElement.bind(f.window.document);
        let editors=0;
        t.mock.method(f.window.document,'createElement',(tag,...args)=>{
            if (['gramlot-textbox','gramlot-number-text-box','input','textarea'].includes(tag)) editors++;
            return create(tag,...args);
        });
        assert.equal(session.accept(),false,'collection coverage is required even before any editor opens');
        assert.equal(await session.validate(),false);
        assert.equal(editors,0);
        const path='record.rows.r800'+(mode==='values'?'.':'?')+'name';
        assert.deepEqual(session.errorEntries.map(item=>item.path),[path]);
        assert.equal(f.host.querySelector('[slot=cell-editor]'),null);
        assert.equal(session.validations.size,2,'only the existing form field and invalid grid field remain');
        f.app.data.setItem(path,'Corrected');await tick();
        assert.equal(session.errorEntries.length,0);
        assert.equal(await session.validate(),true);
        assert.equal(session.accept(),true);
        assert.equal(editors,0);
    });
}
test('complete validation uses shared typed normalization without a view',async t=>{
    const f=await fixture(t,{nameColumn:{edit:{validate_case:'upper'}}});
    assert.equal(await f.source.formState.validate(),true);
    assert.equal(f.rows.getItem('r999.name'),'ITEM 999');
    assert.equal(f.source.formState.accept(),true);
    assert.equal(f.host.querySelector('[slot=cell-editor]'),null);
});
test('full validation bounds remote requests, awaits every check and refuses a changed snapshot',async t=>{
    const f=await fixture(t);f.rows.clear();
    for(let i=0;i<20;i++)f.rows.setItem(`r${i}`,new Bag({name:`Item ${i}`,amount:i+1}));
    const calls=await remoteField(f);const session=f.source.formState;
    const promise=session.validate();await tick();
    assert.equal(session.validate(),promise,'concurrent confirmations share one pass');
    assert.equal(session.status.pending,true);assert.equal(session.accept(),false);
    assert.ok(calls.length>0&&calls.length<=8);
    f.rows.getItem('r19').setItem('amount',99);
    for(const request of calls)request.resolve(true);
    assert.equal(await promise,false);assert.equal(session.accept(),false);
    let active=0,peak=0,count=0;
    f.app.rpc.call=async()=>{active++;peak=Math.max(peak,active);count++;await tick();active--;return true;};
    assert.equal(await session.validate(),true);assert.equal(count,20);assert.ok(peak<=8);
    assert.equal(session.accept(),true);
    f.rows.getItem('r19').setItem('amount',100);
    assert.equal(session.accept(),false,'coverage expires after any Data change');
});

test('full validation includes filtered rows and watches rule dependencies after clean Sources are released',async t=>{
    const f=await fixture(t,{count:5,nameColumn:{edit:{validate_notnull:'^required'}},nameValue:i=>i===4?'':`Item ${i}`});
    f.app.data.setItem('required',false);
    f.source.setAttr({filter:{value:'Item',columns:['name'],dtype:'T'}});await tick();f.layout.flush();
    const session=f.source.formState;
    assert.equal(await session.validate(),true);
    assert.equal(f.host.querySelector('[slot=cell-editor]'),null);
    f.app.data.setItem('required',true);
    assert.equal(session.accept(),false,'a dependency outside the session invalidates completed coverage');
    assert.equal(await session.validate(),false);
    assert.equal(session.errorEntries[0].path,'record.rows.r4.name');
    assert.equal(f.cell('r4','name'),null,'filtered-out rows participate');
});
for (const tag of ['filteringSelect','callbackSelect','dbSelect']) {
    test(`${tag}: unopened choice cells resolve identity through the shared provider`,async t=>{
        const options={tag,validate_select:true,...(tag==='filteringSelect'?{values:'good:Good'}:tag==='callbackSelect'?{callback:'choices'}:{dbtable:'test.items'})};
        const f=await fixture(t,{count:2,nameColumn:{edit:options},nameValue:i=>i?'missing':'good'});
        if(tag==='dbSelect')f.app.rpc.call=async(_kind,_method,params)=>({rows:params._id==='good'?[{id:'good',caption:'Good'}]:[],identifier:'id',caption:'caption'});
        if(tag==='callbackSelect')t.mock.method(f.source.rootBuilder.binding.logicRegistry,'resolve',()=>({group:{},method:(_node,params)=>({rows:params._id==='good'?[{id:'good',caption:'Good'}]:[],identifier:'id',caption:'caption'})}));
        assert.equal(await f.source.formState.validate(),false);
        assert.deepEqual(f.source.formState.errorEntries.map(e=>e.path),['record.rows.r1.name']);
        assert.match(f.source.formState.errorEntries[0].message,/Choose/);
        assert.equal(f.host.querySelector('[slot=cell-editor]'),null);
    });
}
test('changed struct rules replace retained field rules and invalidate completed coverage',async t=>{
    const f=await fixture(t,{count:3});const session=f.source.formState;
    f.rows.getItem('r2').setItem('amount',-1);
    assert.equal(await session.validate(),false);
    const struct=f.source.getRelativeData(f.source.getAttr('structpath'));
    struct.getNode('view_0.rows_0.cell_amount').setAttr({edit:{validate_min:-2}});
    await tick();await tick();f.layout.flush();
    assert.equal(await session.validate(),true);assert.equal(session.accept(),true);
    struct.getNode('view_0.rows_0.cell_amount').setAttr({edit:{validate_min:0}});
    assert.equal(session.accept(),false,'struct edits invalidate coverage before the next paint');
    await tick();await tick();f.layout.flush();
    assert.equal(await session.validate(),false);
});
for(const action of ['restore','dispose']) {
    test(`full validation cancels pending requests on ${action}`,async t=>{
        const f=await fixture(t,{count:20});const calls=await remoteField(f);
        const session=f.source.formState,pending=session.validate();await tick();
        assert.ok(calls.length>0);
        const started=[...calls];
        if(action==='restore')session.restore();else f.app.dispose();
        assert.equal(await pending,false);
        // Retained cell fields follow the row key: restore validates them again on the restored values.
        for(const call of started){assert.equal(call.signal.aborted,true);call.resolve({value:999});}
        for(const call of calls.slice(started.length))call.resolve(true);
        await tick();
        if(action==='restore')assert.equal(f.app.data.getItem('record.rows.r0.amount'),1);
    });
}

test('failed field declaration releases temporary Source and does not leave confirmation pending',async t=>{
    const f=await fixture(t,{count:2,nameColumn:{edit:{tag:'missingEditor'}}});
    const session=f.source.formState;
    await assert.rejects(session.validate(),/requires the missingEditor input collection/);
    assert.equal(session.status.pending,false);
    assert.equal(session.accept(),false);
    assert.equal(f.source.value.getNodes().filter(node=>node.label.startsWith('grid-cell-')).length,0);
    const struct=f.source.getRelativeData(f.source.getAttr('structpath'));
    struct.getNode('view_0.rows_0.cell_name').setAttr({edit:{validate_notnull:true}});
    await tick();await tick();f.layout.flush();
    assert.equal(await session.validate(),true);assert.equal(session.accept(),true);
});

test('an unopened choice error follows changes to its bound choices without mounting a widget',async t=>{
    const f=await fixture(t,{count:2,nameColumn:{edit:{tag:'filteringSelect',values:'^choices'}},nameValue:i=>i?'new':'good'});
    f.app.data.setItem('choices','good:Good');
    const session=f.source.formState;
    assert.equal(await session.validate(),false);
    assert.equal(session.errorEntries.length,1);
    f.app.data.setItem('choices','good:Good,new:New');await tick();await tick();
    assert.equal(session.errorEntries.length,0,'selection configuration is semantic, not dependent on widget projection');
    assert.equal(await session.validate(),true);assert.equal(session.accept(),true);
    assert.equal(f.host.querySelector('[slot=cell-editor]'),null);
});


test('colorpicker columns show a swatch and refresh it without replacing Data', async t => {
    const f=await fixture(t,{count:2,nameColumn:{edit:{tag:'colorpicker'}},nameValue:()=> '#ee6666'});
    const content=f.cell('r0','name').firstElementChild;
    assert.equal(content.textContent,'');
    const swatch=content.querySelector('.cell-color-swatch');
    assert.equal(swatch.style.backgroundColor,'rgb(238, 102, 102)');
    assert.equal(swatch.getAttribute('aria-label'),'#ee6666');
    f.rows.getItem('r0').setItem('name','#3ba272'); await tick();await tick();
    assert.equal(content.querySelector('.cell-color-swatch'),swatch);
    assert.equal(swatch.style.backgroundColor,'rgb(59, 162, 114)');
    assert.equal(swatch.title,'#3ba272');
    assert.equal(f.rows.getItem('r0.name'),'#3ba272');
});
