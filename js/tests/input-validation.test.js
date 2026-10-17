import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';
import {validateInput} from '../src/components/validation.js';

function fixture(t, author) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.HTMLElement.prototype.showPopover = function () {};
    window.HTMLElement.prototype.hidePopover = function () {};
    window.HTMLElement.prototype.scrollIntoView = function () {};
    const app = new Gramlot({document:window.document,transport:false,collections:[inputs],locale:'it-IT'});
    const b = new GramlotBuilder(null,{collections:[inputs]});author(b.root,app);app.src.startSource(b.toTytx());
    t.after(()=>{app.dispose();window.close();});
    const host=id=>window.document.getElementById(id);
    const fire=(el,type)=>el.dispatchEvent(new window.Event(type,{bubbles:true}));
    const edit=(id,value,commit=true)=>{const el=host(id).control;el.focus();el.value=value;fire(el,'input');if(commit)fire(el,'change');return el;};
    return {window,app,host,fire,edit};
}

test('required and length use the legacy empty and length contracts without truthiness coercion',()=>{
    for(const value of [null,undefined,'']) assert.equal(validateInput(value,{validate_notnull:true}).error,'A value is required.');
    for(const value of [0,false,' ']) assert.equal(validateInput(value,{validate_notnull:true}).error,null);
    for(const [rule,good,bad] of [['2','ab','abc'],['2:4','abcd','a'],['2:','abc','a'],[':4','a','abcde']]) {
        assert.equal(validateInput(good,{validate_len:rule}).error,null);assert.notEqual(validateInput(bad,{validate_len:rule}).error,null);
    }
    assert.equal(validateInput('',{validate_len:'2:4'}).error,null);
    assert.notEqual(validateInput('',{validate_notnull:true,validate_notnull_error:''}).error,null);
    assert.equal(validateInput('a',{validate_len:'2:4',validate_len_error:'Too short'}).error,'Too short');
    assert.throws(()=>validateInput(12,{validate_len:'2'}),/text value/);
    assert.throws(()=>validateInput('a',{validate_len:'four'}),/Invalid validate_len/);
});

test('textbox keeps rejected drafts across label projection and Data echoes, then recovers',t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('name','Ada');a.data.setItem('position','TL');
        r.textbox({id:'name',value:'^name',lbl:'Name',lbl_position:'^position',validate_notnull:true,validate_len:'2:4',validate_notnull_error:'Name required',validate_len_error:'2 to 4'});
        r.textbox({id:'copy',value:'^name'});});
    f.edit('name','A');assert.equal(f.app.data.getItem('name'),'Ada');assert.equal(f.host('name').message.textContent,'2 to 4');
    f.app.data.setItem('position','R');assert.equal(f.host('name').control.value,'A');assert.equal(f.host('copy').control.value,'Ada');
    assert.equal(f.host('name').control.getAttribute('aria-invalid'),'true');
    assert.equal(f.host('name').control.validationMessage,'2 to 4');
    f.edit('name','Grace');assert.equal(f.host('name').control.value,'Grace');assert.equal(f.app.data.getItem('name'),'Ada');
    assert.equal(f.host('name').control.hasAttribute('maxlength'),false);
    f.edit('name','Eve');assert.equal(f.app.data.getItem('name'),'Eve');assert.equal(f.host('copy').control.value,'Eve');assert.equal(f.host('name').message.hidden,true);
    f.edit('name','');f.app.data.setItem('position','BL');assert.equal(f.host('name').control.value,'');assert.equal(f.host('name').message.textContent,'Name required');
    assert.equal(f.app.data.getItem('name'),'Eve');
    f.app.data.setItem('name','Amy');assert.equal(f.host('name').control.value,'Amy');assert.equal(f.host('name').message.hidden,true);
});

test('live validation respects composition, reactive rules, locking and disposal',t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('text','Ada');a.data.setItem('length','2:4');
        r.textBoxArea({id:'text',value:'^text',live:true,validate_len:'^length',readonly:'^locked'});});
    const el=f.host('text').control;
    f.fire(el,'compositionstart');f.edit('text','G',false);assert.equal(f.host('text').message.hidden,true);assert.equal(f.app.data.getItem('text'),'Ada');
    el.value='Grace';f.fire(el,'compositionend');assert.equal(f.app.data.getItem('text'),'Ada');assert.equal(f.host('text').message.hidden,false);
    f.app.data.setItem('length','2:6');assert.equal(el.value,'Grace');
    f.edit('text','Gracie',false);assert.equal(f.app.data.getItem('text'),'Gracie');
    f.app.data.setItem('locked',true);f.edit('text','No',false);assert.equal(f.app.data.getItem('text'),'Gracie');
    f.app.dispose();el.value='End';f.fire(el,'input');assert.equal(f.app.data.getItem('text'),'Gracie');
});

test('floating error expires without clearing invalid state, reopens and cleans up',t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('name','Ada');r.textbox({id:'name',value:'^name',validate_len:'2:4'});});
    const host=f.host('name');let expire,finishFade,cleared=0;
    const timer=f.window.setTimeout.bind(f.window);
    f.window.setTimeout=(callback,delay)=>{if(delay===1800){expire=callback;return 123;}if(delay===200){finishFade=callback;return 124;}return timer(callback,delay);};
    const clear=f.window.clearTimeout.bind(f.window);
    f.window.clearTimeout=id=>{if(id===123||id===124)cleared++;else clear(id);};
    f.edit('name','A');
    assert.equal(host.message.getAttribute('popover'),'manual');
    assert.equal(host.message.hidden,false);expire();assert.equal(host.message.hasAttribute('data-fading'),true);assert.equal(host.message.hidden,false);finishFade();assert.equal(host.message.hidden,true);
    assert.equal(host.control.getAttribute('aria-invalid'),'true');assert.equal(f.app.data.getItem('name'),'Ada');
    assert.notEqual(host.message.textContent,''); // retained accessible description
    f.fire(host.control,'mouseenter');assert.equal(host.message.hidden,false);assert.equal(host.message.hasAttribute('data-fading'),false);
    host.control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(host.message.hidden,true);
    f.fire(host.control,'focusin');assert.equal(host.message.hidden,false);
    f.fire(f.window,'resize');assert.equal(host.message.hidden,true);
    f.fire(host.control,'focusin');host.remove();assert.equal(host.message.hidden,true);assert(cleared>0);
    expire();assert.equal(host.message.hidden,true);
});

test('typed editor and calendar reject null before accepting it internally or overwriting Data',t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('date',new Date('2026-10-16T00:00:00Z'));a.data.setItem('n',0);
        r.dateTextBox({id:'date',value:'^date',validate_notnull:true});
        r.dateCalendar({id:'calendar',value:'^date',validate_notnull:true});
        r.numberTextBox({id:'number',value:'^n',validate_notnull:true});});
    f.edit('date','');f.host('date').control.blur();assert.equal(f.host('date').control.value,'');
    assert.equal(f.host('date').readControlValue().toISOString(),'2026-10-16T00:00:00.000Z');assert.equal(f.host('date').message.hidden,false);
    f.host('date').control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape'}));assert.notEqual(f.host('date').control.value,'');
    f.host('calendar').calendarView.clearButton.click();assert.notEqual(f.app.data.getItem('date'),null);assert.equal(f.host('calendar').message.hidden,false);
    f.host('calendar').control.querySelector('[data-date="2026-10-20"]').click();assert.equal(f.app.data.getItem('date').getUTCDate(),20);
    f.edit('number','');assert.equal(f.app.data.getItem('n'),0);assert.equal(f.host('number').message.hidden,false);
    f.edit('number','0');assert.equal(f.app.data.getItem('n'),0);assert.equal(f.host('number').message.hidden,true);
});

test('multiple choices retain the empty rejected selection and correct through the common writer',t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('codes','email');a.data.setItem('position','TL');
        r.checkBoxText({id:'codes',value:'^codes',values:'email:Email,sms:SMS',validate_notnull:true,lbl:'Channels',lbl_position:'^position'});
        r.checkbox({id:'flag',value:'^flag',validate_notnull:true});});
    const host=f.host('codes'),box=code=>host.control.querySelector(`input[value="${code}"]`);
    box('email').click();assert.equal(f.app.data.getItem('codes'),'email');assert.equal(host.message.hidden,false);
    f.app.data.setItem('position','R');assert.equal(box('email').checked,false);
    box('sms').click();assert.equal(f.app.data.getItem('codes'),'sms');assert.equal(host.message.hidden,true);
    f.host('flag').control.click();f.host('flag').control.click();assert.equal(f.app.data.getItem('flag'),false);assert.equal(f.host('flag').message.hidden,true);
});

test('choice editor validates the proposed code before replacing the committed choice',async t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('code','a');r.filteringSelect({id:'code',value:'^code',values:'a:Alpha,b:Beta',validate_notnull:true});});
    await new Promise(resolve=>setTimeout(resolve,0));
    f.edit('code','');assert.equal(f.app.data.getItem('code'),'a');assert.equal(f.host('code').readControlValue(),'a');assert.equal(f.host('code').message.hidden,false);
    f.edit('code','Beta',false);await new Promise(resolve=>setTimeout(resolve,0));f.fire(f.host('code').control,'change');
    assert.equal(f.app.data.getItem('code'),'b');assert.equal(f.host('code').message.hidden,true);
});


test('text editors request browser assistance off without disabling their own choice semantics',t=>{
    const f=fixture(t,r=>{r.textbox({id:'text'});r.textBoxArea({id:'area'});r.numberTextBox({id:'number'});r.dateTextBox({id:'date'});r.filteringSelect({id:'choice',values:'a:Alpha'});});
    for(const id of ['text','area','number','date','choice']) {
        const control=f.host(id).control;
        for(const name of ['autocomplete','autocorrect','autocapitalize']) assert.equal(control.getAttribute(name),'off');
        assert.equal(control.getAttribute('spellcheck'),'false');
    }
    assert.equal(f.host('choice').control.getAttribute('aria-autocomplete'),'list');
});
