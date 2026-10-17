import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {createDecimal, isDecimal} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';
import {validateInput} from '../src/components/validation.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => {resolve=a;reject=b;});return {promise,resolve,reject}; };
function fixture(t, author, Logic = class {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.HTMLElement.prototype.showPopover = function() {};
    window.HTMLElement.prototype.hidePopover = function() {};
    window.HTMLElement.prototype.scrollIntoView = function() {};
    const app = new Gramlot({document:window.document,transport:false,collections:[inputs]});
    app.src.logicRegistry.register(Logic,{resource:'test:validation'});
    const b = new GramlotBuilder(null,{collections:[inputs]}); author(b.root,app); app.src.startSource(b.toTytx());
    t.after(()=>{app.dispose();window.close();});
    const host = id => window.document.getElementById(id);
    const fire = (id,type) => host(id).control.dispatchEvent(new window.Event(type,{bubbles:true}));
    const edit = (id,value,commit=true) => {host(id).control.value=value;fire(id,'input');if(commit)fire(id,'change');};
    return {app,host,edit,fire,window};
}

test('ordered transformations feed following rules; false and zero defaults are real values',()=>{
    assert.equal(validateInput('',{validate_empty:'ada',validate_case:'upper',validate_len:'3'}).value,'ADA');
    assert.equal(validateInput(null,{validate_empty:false}).value,false);
    assert.equal(validateInput(null,{validate_empty:0,validate_min:0}).value,0);
    assert.equal(validateInput('',{validate_notnull:true,validate_empty:'fallback'}).error,'A value is required.');
    for (const [mode,expected] of [['u','ADA LOVELACE'],['l','ada lovelace'],['t','Ada Lovelace'],['c','Ada lovelace']]) {
        assert.equal(validateInput('aDa LoVeLaCe',{validate_case:mode}).value,expected);
    }
});
test('numeric, exact Decimal and civil date limits preserve types',()=>{
    assert.equal(validateInput(0,{validate_min:0,validate_max:1}).error,null);
    assert.ok(validateInput(-1,{validate_min:0}).error);
    const amount=createDecimal('9007199254740993.25');
    assert.equal(validateInput(amount,{validate_min:createDecimal('9007199254740993.20')},{isDecimal}).value,amount);
    assert.ok(validateInput(amount,{validate_max:createDecimal('9007199254740993.24')},{isDecimal}).error);
    const date=new Date('2026-10-17T00:00:00Z');
    assert.ok(validateInput(date,{validate_min:new Date('2026-10-18T00:00:00Z')}).error);
    assert.throws(()=>validateInput('12',{validate_min:1}),/matching/);
});
test('regex negation, warnings and message overrides have explicit precedence',()=>{
    assert.equal(validateInput('ABC',{validate_regex:'^[A-Z]+$'}).error,null);
    assert.ok(validateInput('ABC',{validate_regex:'!^[A-Z]+$'}).error);
    const warning=validateInput('broken',{validate_email:true});
    assert.equal(warning.error,null);assert.deepEqual(warning.warnings,['Check email format.']);
    assert.ok(validateInput('broken',{validate_email:true,validate_email_iswarning:false}).error);
    const result=validateInput('abc',{validate_regex:'^x',validate_regex_warning:'Unexpected {value}'});
    assert.equal(result.error,null);assert.deepEqual(result.warnings,['Unexpected abc']);
});
test('conditions and callback result contract, including a normalized warning',async()=>{
    const calls=[];
    const result=await validateInput('abc',{validate_len:'4',validate_len_if:'condition',validate_call:'check'}, {
        invoke:(name,code,kw,expression)=>{calls.push([name,kw.value,expression]);return expression ? false : Promise.resolve({value:'ABC',errorcode:'notice',iswarning:true,message:'Normalized'});}
    });
    assert.equal(result.value,'ABC');assert.equal(result.modified,true);assert.deepEqual(result.warnings,['Normalized']);
    assert.equal(calls.length,2);
    assert.throws(()=>validateInput('x',{validate_call:'bad'},{invoke:()=>42}),/validator returns/);
    for(const rule of ['nodup','exist','gridnodup']) assert.throws(()=>validateInput('x',{['validate_'+rule]:true}),/DB\/grid/);
});
test('local normalized acceptance and hooks use the sole Data writer',t=>{
    const seen=[];
    const f=fixture(t,(r,a)=>{a.data.setItem('name','Ada');r.textbox({id:'name',value:'^name',validate_case:'upper',validate_len:'2:5',validate_onAccept:'accepted',validate_onReject:'rejected'});},class {
        accepted(node,{value}) {seen.push(['accept',value,node.getRelativeData('name')]);}
        rejected(node,{value}) {seen.push(['reject',value,node.getRelativeData('name')]);}
    });
    f.edit('name','eve');assert.equal(f.app.data.getItem('name'),'EVE');assert.equal(f.host('name').control.value,'EVE');
    f.edit('name','a');assert.equal(f.host('name').control.value,'a');assert.equal(f.app.data.getItem('name'),'EVE');
    assert.deepEqual(seen,[['accept','EVE','EVE'],['reject','A','EVE']]);
});
test('activated conditions and callbacks see resolved validation arguments',t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('name','Ada');a.data.setItem('strict',false);r.textbox({id:'name',value:'^name',validate_strict:'^strict',validate_len:'4:',validate_len_if:'strict',validate_call:'return value === "bad" ? "reserved" : true;',validate_call_error:'Choose another name'});});
    f.edit('name','Al');assert.equal(f.app.data.getItem('name'),'Al');
    f.app.data.setItem('strict',true);f.edit('name','Bob');assert.equal(f.app.data.getItem('name'),'Al');
    f.app.data.setItem('strict',false);f.edit('name','bad');assert.equal(f.host('name').message.textContent,'Choose another name');
    f.app.src.source.getItem('main').getNodes()[0].setAttr({validate_call:'return true;'});
    f.edit('name','Other');assert.match(f.host('name').message.textContent,/received with the Source/);
});
test('async candidates leave Data intact; newer input cancels old replies',async t=>{
    const pending=[];
    const f=fixture(t,(r,a)=>{a.data.setItem('name','Ada');r.textbox({id:'name',value:'^name',validate_call:'check'});},class {check(node,kw){const d=deferred();pending.push({...d,value:kw.value});return d.promise;}});
    f.edit('name','First');assert.equal(f.app.data.getItem('name'),'Ada');assert.equal(f.host('name').control.getAttribute('aria-busy'),'true');
    f.edit('name','Second',false);pending[0].resolve(true);await tick();assert.equal(f.app.data.getItem('name'),'Ada');assert.equal(f.host('name').control.value,'Second');
    f.fire('name','change');pending[1].resolve({value:'SECOND'});await tick();assert.equal(f.app.data.getItem('name'),'SECOND');
    assert.equal(f.host('name').control.getAttribute('aria-busy'),'false');
});
test('external Data, rules, locks and disposal invalidate pending acceptance',async t=>{
    const pending=[];
    const f=fixture(t,(r,a)=>{a.data.setItem('name','Ada');a.data.setItem('limit','2:10');r.textbox({id:'name',value:'^name',validate_len:'^limit',readonly:'^locked',validate_call:'check'});},class {check(){const d=deferred();pending.push(d);return d.promise;}});
    f.edit('name','Eve');f.app.data.setItem('name','External');pending.shift().resolve(true);await tick();assert.equal(f.app.data.getItem('name'),'External');
    f.edit('name','Eve');f.app.data.setItem('limit','4:10');pending.shift().resolve(true);await tick();assert.equal(f.app.data.getItem('name'),'External');
    f.edit('name','Grace');f.app.data.setItem('locked',true);pending.shift().resolve(true);await tick();assert.equal(f.app.data.getItem('name'),'External');
    f.app.data.setItem('locked',false);f.edit('name','Grace');f.app.dispose();pending.shift().resolve(true);await tick();assert.equal(f.app.data.getItem('name'),'External');
});
test('remote uses data RPC, typed arguments, cancellation and failure handling',async t=>{
    const calls=[];
    const f=fixture(t,(r,a)=>{a.data.setItem('name','Ada');r.textbox({id:'name',value:'^name',validate_remote:'checkName',validate_remote_limit:3});});
    f.app.rpc.call=(type,method,kw,options)=>{const d=deferred();calls.push({type,method,kw,...options,...d});return d.promise;};
    f.edit('name','Eve');assert.deepEqual(calls[0].kw,{value:'Eve',limit:3});assert.equal(calls[0].type,'data');
    f.edit('name','Grace');assert.equal(calls[0].signal.aborted,true);
    calls[1].reject(new Error('Server unavailable'));await tick();assert.equal(f.app.data.getItem('name'),'Ada');assert.match(f.host('name').message.textContent,/Server unavailable/);
    calls[0].resolve(true);await tick();assert.equal(f.app.data.getItem('name'),'Ada');
});
test('remote Bag response applies patches only on acceptance',async t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('record.name','Ada');r.textbox({id:'name',datapath:'record',value:'^.name',validate_remote:'checkName'});});
    const patch=new Bag();patch.setItem('status','checked');
    const result=new Bag();result.setItem('value','EVE');result.setItem('data',patch);
    f.app.rpc.call=async()=>result;
    f.edit('name','Eve');await tick();assert.equal(f.app.data.getItem('record.name'),'EVE',f.host('name').message.textContent);assert.equal(f.app.data.getItem('record.status'),'checked');
    patch.setItem('status','bad');result.setItem('errorcode','reserved');
    f.edit('name','Bob');await tick();assert.equal(f.app.data.getItem('record.status'),'checked');assert.equal(f.app.data.getItem('record.name'),'EVE');
});
test('async typed candidate commits parsed value only after acceptance',async t=>{
    const pending=[];
    const f=fixture(t,(r,a)=>{a.data.setItem('amount',10);r.numberTextBox({id:'amount',value:'^amount',validate_call:'check'});},class {check(){const d=deferred();pending.push(d);return d.promise;}});
    f.edit('amount','20');assert.equal(f.host('amount').readControlValue(),10);
    f.edit('amount','30');pending[0].resolve(true);await tick();assert.equal(f.host('amount').readControlValue(),10);
    pending[1].resolve(true);await tick();assert.equal(f.app.data.getItem('amount'),30);assert.equal(f.host('amount').readControlValue(),30);
});
test('warnings remain accessible without invalidating the field',t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('email','');r.textbox({id:'email',value:'^email',validate_email:true});});
    f.edit('email','broken');assert.equal(f.app.data.getItem('email'),'broken');assert.equal(f.host('email').control.getAttribute('aria-invalid'),'false');
    assert.equal(f.host('email').message.dataset.severity,'warning');assert.match(f.host('email').message.textContent,/email/);
});
test('timeout aborts transport and rejects without an unhandled late rejection',async t=>{
    const d=deferred();let signal;
    const f=fixture(t,(r,a)=>{a.data.setItem('name','Ada');r.textbox({id:'name',value:'^name',validate_remote:'check',validate_timeout:5});});
    f.app.rpc.call=(type,method,kw,options)=>{signal=options.signal;return d.promise;};
    f.edit('name','Eve');await new Promise(resolve=>setTimeout(resolve,15));assert.equal(f.app.data.getItem('name'),'Ada');assert.equal(signal.aborted,true);assert.match(f.host('name').message.textContent,/timed out/);
    d.reject(new Error('late'));await tick();
});

test('relative binding rebase invalidates the previous request even when values are equal',async t=>{
    const pending=[];
    const f=fixture(t,(r,a)=>{a.data.setItem('scope','one');a.data.setItem('one.name','Ada');a.data.setItem('two.name','Ada');
        r.div({datapath:'^scope'}).textbox({id:'name',value:'^.name',validate_call:'check'});},class {check(){const d=deferred();pending.push(d);return d.promise;}});
    f.edit('name','Eve');f.app.data.setItem('scope','two');assert.equal(f.host('name').control.getAttribute('aria-busy'),'false');pending[0].resolve(true);await tick();
    assert.equal(f.app.data.getItem('one.name'),'Ada');assert.equal(f.app.data.getItem('two.name'),'Ada');
});
test('literal-valued fields still validate without requiring a Data address',t=>{
    const f=fixture(t,r=>r.textbox({id:'name',value:'Ada',validate_len:'2:'}));
    f.edit('name','A');assert.equal(f.host('name').control.getAttribute('aria-invalid'),'true');
    f.edit('name','Eve');assert.equal(f.host('name').control.getAttribute('aria-invalid'),'false');
});
test('single radio has callback context and does not change Data on rejection',t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('selected',false);r.radioButton({id:'radio',value:'^selected',validate_call:'deny'});},class {deny(){return {errorcode:'denied',message:'Denied'};}});
    f.host('radio').control.checked=true;f.fire('radio','change');assert.equal(f.app.data.getItem('selected'),false);assert.equal(f.host('radio').message.textContent,'Denied');
});
test('the remote result hook uses activated Source and never runs for an obsolete response',async t=>{
    const calls=[];
    const f=fixture(t,(r,a)=>{a.data.setItem('name','Ada');r.textbox({id:'name',value:'^name',validate_remote:'check',validate__onResult:'observed'});},class {observed(node,{result}) {calls.push(result);}});
    const pending=[];f.app.rpc.call=()=>{const d=deferred();pending.push(d);return d.promise;};
    f.edit('name','Old');f.edit('name','New');pending[0].resolve(false);pending[1].resolve(true);await tick();
    assert.deepEqual(calls,[true]);assert.equal(f.app.data.getItem('name'),'New');
});
test('an asynchronous condition serializes its rule and follows cancellation',async()=>{
    const gate=deferred();let called=false;
    const pending=validateInput('x',{validate_call:'check',validate_call_if:'condition'}, {invoke:(attr)=>attr.endsWith('_if')?gate.promise:(called=true)});
    assert.equal(called,false);gate.resolve(true);assert.equal((await pending).error,null);assert.equal(called,true);
});


test('Escape cancels a typed pending edit; normalization cannot change the value type',async t=>{
    const d=deferred();
    const f=fixture(t,(r,a)=>{a.data.setItem('amount',10);a.data.setItem('name','Ada');
        r.numberTextBox({id:'amount',value:'^amount',validate_call:'check'});
        r.textbox({id:'name',value:'^name',validate_call:'wrongType'});},class {check(){return d.promise;}wrongType(){return {value:42};}});
    f.edit('amount','20');f.host('amount').control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape'}));
    d.resolve(true);await tick();assert.equal(f.app.data.getItem('amount'),10);assert.equal(f.host('amount').readControlValue(),10);
    f.edit('name','Eve');assert.equal(f.app.data.getItem('name'),'Ada');assert.match(f.host('name').message.textContent,/value type/);
});


test('explicit selection validation checks the constrained editor and rejects other controls',async t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('choice','a');a.data.setItem('name','Ada');
        r.filteringSelect({id:'choice',value:'^choice',values:'a:Alpha,b:Beta',validate_select:true});
        r.textbox({id:'name',value:'^name',validate_select:true});});
    await tick();f.host('choice').control.focus();f.edit('choice','Beta',false);await tick();f.fire('choice','change');assert.equal(f.app.data.getItem('choice'),'b');
    f.edit('choice','Unknown');assert.equal(f.app.data.getItem('choice'),'b');
    f.edit('name','Eve');assert.equal(f.app.data.getItem('name'),'Ada');assert.match(f.host('name').message.textContent,/constrained choice/);
});
