import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';

const settle = () => new Promise(resolve => setTimeout(resolve, 0));
function fixture(t, author, Logic = class {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    // jsdom does not implement browser top-layer/layout APIs.
    window.HTMLElement.prototype.showPopover = function () {};
    window.HTMLElement.prototype.hidePopover = function () {};
    window.HTMLElement.prototype.scrollIntoView = function () {};
    const app = new Gramlot({document: window.document, transport: false, collections: [inputs]});
    app.src.logicRegistry.register(Logic, {resource: 'test:choices'});
    const builder = new GramlotBuilder(null, {collections: [inputs]});
    author(builder.root, app); app.src.startSource(builder.toTytx());
    t.after(() => {app.dispose(); window.close();});
    const host = id => window.document.getElementById(id);
    const event = (input, type) => input.dispatchEvent(new window.Event(type, {bubbles: true}));
    const type = (id, text) => {const input = host(id).control; input.focus(); input.value = text; event(input, 'input');};
    const key = (id, key) => host(id).control.dispatchEvent(new window.KeyboardEvent('keydown', {key, bubbles: true}));
    return {app, window, host, event, type, key};
}

test('local choices save codes, resolve captions, reject arbitrary text and clear to null', async t => {
    const f = fixture(t, (r,a) => {a.data.setItem('choice','b');
        r.filteringSelect({id:'choice',value:'^choice',values:'a:Alpha,b:Beta',lbl:'Choice',live:true});});
    await settle(); assert.equal(f.host('choice').control.value, 'Beta');
    f.type('choice','Al'); await settle();
    assert.equal(f.app.data.getItem('choice'),'b');
    assert.equal(f.host('choice').choices.textContent, 'Alpha');
    f.key('choice','Enter'); assert.equal(f.app.data.getItem('choice'),'a');
    f.type('choice','unknown'); await settle(); f.event(f.host('choice').control,'change');
    assert.equal(f.app.data.getItem('choice'),'a'); assert.equal(f.host('choice').control.getAttribute('aria-invalid'),'true');
    f.key('choice','Escape'); await settle(); assert.equal(f.host('choice').control.value,'Alpha');
    f.type('choice',''); f.event(f.host('choice').control,'change');
    assert.equal(f.app.data.getItem('choice'),null);
});

test('label and values react without rebuilding the input; keyboard, readonly and disposal', async t => {
    const f = fixture(t, (r,a) => {a.data.setItem('choice','a');a.data.setItem('values','a:Alpha,b:Beta');a.data.setItem('position','TL');
        r.filteringSelect({id:'choice',node_label:'choice',value:'^choice',values:'^values',lbl:'Choice',lbl_position:'^position',readonly:'^locked'});});
    await settle(); const host=f.host('choice'), input=host.control;
    f.type('choice','Al'); input.setSelectionRange(1,1); f.app.data.setItem('position','R');
    assert.equal(host.control,input); assert.equal(input.value,'Al'); assert.equal(input.selectionStart,1);
    f.key('choice','Escape'); await settle();
    f.app.data.setItem('values','a:Updated,b:Beta'); await settle(); assert.equal(input.value,'Updated');
    f.key('choice','ArrowDown'); await settle(); f.key('choice','ArrowDown'); f.key('choice','Enter');
    assert.equal(f.app.data.getItem('choice'),'b');
    f.app.data.setItem('locked',true); f.type('choice','Updated'); f.event(input,'change');
    assert.equal(f.app.data.getItem('choice'),'b'); assert.equal(host.choices.hidden,true);
    f.app.dispose(); f.event(input,'change'); assert.equal(f.app.data.getItem('choice'),'b');
});

test('named callback handles exact identity and asynchronous query races', async t => {
    const pending = new Map(), calls=[];
    class Logic {search(node, kw) {
        calls.push(kw);
        if ('_id' in kw) return {rows:[{id:'a',name:'Alpha'}],identifier:'id',caption:'name'};
        return new Promise(resolve => pending.set(kw._querystring, resolve));
    }}
    const f=fixture(t,(r,a)=>{a.data.setItem('choice','a');r.callbackSelect({id:'choice',value:'^choice',callback:'search',lbl:'Choice'});},Logic);
    await settle(); assert.equal(f.host('choice').control.value,'Alpha');
    f.type('choice','old'); f.type('choice','new');
    const reply=name=>({rows:[{id:name,name}],identifier:'id',caption:'name'});
    pending.get('new')(reply('new')); await settle(); assert.equal(f.host('choice').choices.textContent,'new');
    pending.get('old')(reply('old')); await settle(); assert.equal(f.host('choice').choices.textContent,'new');
    assert.equal(f.host('choice').control.getAttribute('aria-busy'),'false');
    f.key('choice','Enter'); assert.equal(f.app.data.getItem('choice'),'new');
    assert.deepEqual(calls[0],{_id:'a'});
});

test('callback failures are visible and pending requests cannot survive removal', async t => {
    let finish;
    class Logic {search(node,kw) {
        if(kw._querystring==='bad') return {rows:[{id:'a',name:'A'},{id:'a',name:'Duplicate'}],identifier:'id',caption:'name'};
        return new Promise(resolve=>{finish=resolve;});
    }}
    const f=fixture(t,r=>r.callbackSelect({id:'choice',node_label:'choice',value:'^choice',callback:'search'}),Logic);
    f.type('choice','bad'); await settle(); assert.match(f.host('choice').message.textContent,/duplicate/);
    f.type('choice','pending'); const host=f.host('choice');
    f.app.src.source.popNode('main.choice');
    finish({rows:[{id:'x',name:'X'}],identifier:'id',caption:'name'}); await settle();
    assert.equal(host.choices.hidden,true); assert.equal(f.app.data.getItem('choice'),null);
});

test('external selection supersedes a pending search, and rejected Promises are reported', async t => {
    let finish;
    class Logic {search(node, kw) {
        if ('_id' in kw) return {rows:[{id:kw._id,name:`Caption ${kw._id}`}],identifier:'id',caption:'name'};
        if (kw._querystring === 'error') return Promise.reject(new Error('Search unavailable'));
        return new Promise(resolve => {finish=resolve;});
    }}
    const f=fixture(t,(r,a)=>{a.data.setItem('choice','a');r.callbackSelect({id:'choice',value:'^choice',callback:'search'});},Logic);
    await settle(); f.type('choice','pending'); f.app.data.setItem('choice','b'); await settle();
    finish({rows:[{id:'old',name:'Old result'}],identifier:'id',caption:'name'}); await settle();
    assert.equal(f.host('choice').control.value,'Caption b'); assert.equal(f.host('choice').choices.hidden,true);
    f.type('choice','error'); await settle();
    assert.equal(f.host('choice').message.textContent,'Search unavailable');
    assert.equal(f.app.data.getItem('choice'),'b');
});

test('comboBox accepts free text, commits suggestion captions and preserves null versus empty', async t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('text',null);
        r.comboBox({id:'choice',value:'^text',values:'r:Rome,p:Paris',lbl:'City'});
        r.comboBox({id:'copy',value:'^text',values:'r:Rome,p:Paris'});});
    await settle(); assert.equal(f.app.data.getItem('text'),null);
    f.type('choice','New city'); await settle(); f.key('choice','Enter');
    assert.equal(f.app.data.getItem('text'),'New city'); assert.equal(f.host('copy').control.value,'New city');
    f.type('choice','Pa'); await settle(); f.key('choice','Enter');
    assert.equal(f.app.data.getItem('text'),'Paris'); assert.equal(f.host('copy').control.value,'Paris');
    f.type('choice',''); f.event(f.host('choice').control,'change');
    assert.equal(f.app.data.getItem('text'),'');
    f.app.data.setItem('text','Unlisted'); await settle();
    assert.equal(f.host('choice').control.value,'Unlisted'); assert.equal(f.host('choice').control.validationMessage,'');
});

test('comboBox live text uses the existing IME and readonly binding guards', async t => {
    const f=fixture(t,r=>r.comboBox({id:'choice',value:'^text',values:'Rome,Paris',live:true,readonly:'^locked'}));
    const input=f.host('choice').control;
    f.event(input,'compositionstart'); f.type('choice','draft');
    assert.equal(f.app.data.getItem('text'),null);
    f.event(input,'compositionend'); assert.equal(f.app.data.getItem('text'),'draft');
    f.app.data.setItem('locked',true); f.type('choice','blocked'); f.event(input,'change');
    assert.equal(f.app.data.getItem('text'),'draft');
});

test('checkBoxText shares comma-separated codes, preserves selection order and writes null when empty', t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('channels','email');
        for (const id of ['choice','copy']) r.checkBoxText({id,value:'^channels',values:'email:Email,sms:SMS,push:Push',lbl:'Channels',cols:2});});
    const box=(id,code)=>f.host(id).control.querySelector(`input[value="${code}"]`);
    assert.equal(f.host('choice').control.getAttribute('role'),'group');
    assert.equal(box('choice','email').checked,true);
    box('choice','push').click(); assert.equal(f.app.data.getItem('channels'),'email,push');
    assert.equal(box('copy','push').checked,true);
    box('choice','sms').click(); assert.equal(f.app.data.getItem('channels'),'email,push,sms');
    box('choice','email').click(); assert.equal(f.app.data.getItem('channels'),'push,sms');
    box('choice','push').click(); box('copy','sms').click();
    assert.equal(f.app.data.getItem('channels'),null);
    assert.equal([...f.host('choice').control.querySelectorAll('input')].some(input=>input.checked),false);
    f.app.data.setItem('channels','sms,email');
    assert.equal(box('choice','sms').checked,true); assert.equal(box('choice','email').checked,true);
});

test('checkBoxText keeps focus during label/options changes and respects locks and disposal', t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('channels','email');a.data.setItem('position','TL');a.data.setItem('cols',2);
        a.data.setItem('choices','email:Email,sms:SMS,push:Push');
        r.checkBoxText({id:'choice',value:'^channels',values:'^choices',cols:'^cols',lbl:'Channels',lbl_position:'^position',readonly:'^locked',disabled:'^disabled'});});
    const host=f.host('choice'), first=host.control.querySelector('input'); first.focus();
    f.app.data.setItem('position','R'); f.app.data.setItem('cols',1);
    assert.equal(host.shadowRoot.activeElement,first);
    f.app.data.setItem('choices','sms:Text message,email:Mail,push:Push');
    assert.equal(host.control.querySelector('input[value="email"]'),first);
    assert.equal(first.checked,true); assert.equal(f.app.data.getItem('channels'),'email');
    first.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
    assert.equal(host.shadowRoot.activeElement.value,'sms');
    host.shadowRoot.activeElement.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'End',bubbles:true}));
    assert.equal(host.shadowRoot.activeElement.value,'push');
    f.app.data.setItem('locked',true); first.click(); assert.equal(f.app.data.getItem('channels'),'email');
    assert.equal(first.disabled,true); f.app.data.setItem('locked',false); f.app.data.setItem('disabled',true);
    assert.equal(first.disabled,true); f.app.data.setItem('disabled',false);
    f.app.dispose(); first.click(); assert.equal(f.app.data.getItem('channels'),'email');
});
