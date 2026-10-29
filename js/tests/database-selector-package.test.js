import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';

const settle = () => new Promise(resolve => setTimeout(resolve, 0));
function fixture(t, author, remote, Logic = class {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    // jsdom does not implement browser top-layer/layout APIs.
    window.HTMLElement.prototype.showPopover = function () {};
    window.HTMLElement.prototype.hidePopover = function () {};
    window.HTMLElement.prototype.scrollIntoView = function () {};
    const app = new Gramlot({document: window.document, transport: false, collections: [inputs]});
    app.src.logicRegistry.register(Logic, {resource: 'test:choices'});
    const builder = new GramlotBuilder(null, {collections: [inputs]});
    app.rpc.call = (kind, method, parameters, options) => remote(method, parameters, options.signal);
    author(builder.root, app); app.src.startSource(builder.toTytx());
    t.after(() => {app.dispose(); window.close();});
    const host = id => window.document.getElementById(id);
    const event = (input, type) => input.dispatchEvent(new window.Event(type, {bubbles: true}));
    const type = (id, text) => {const input = host(id).control; input.focus(); input.value = text; event(input, 'input');};
    const key = (id, key) => host(id).control.dispatchEvent(new window.KeyboardEvent('keydown', {key, bubbles: true}));
    return {app, window, host, event, type, key};
}

const rows=[{id:0,name:'Zero',email:'zero@test'},{id:2,name:'Ada',email:'ada@test'}];
const reply=rows=>({rows,identifier:'id',caption:'name'});
const lookup=(method,kw)=>reply(rows.filter(r=>'_id' in kw?r.id===kw._id:r.name.includes(kw._querystring)));

test('reopening highlights the current identity while a fresh query highlights its first candidate', async t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('choice',2);r.dbSelect({id:'choice',value:'^choice',searchDelay:0});},lookup);
    await settle();f.host('choice').toggle.click();await settle();
    assert.equal(f.host('choice').control.value,'Ada');
    assert.equal(f.host('choice').choices.querySelector('[aria-selected=true]').textContent,'Ada');
    f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),2);
    f.key('choice','ArrowUp');await settle();
    assert.equal(f.host('choice').choices.querySelector('[aria-selected=true]').textContent,'Ada');
    f.key('choice','Escape');await settle();
    f.type('choice','Z');await settle();
    assert.equal(f.host('choice').choices.querySelector('[aria-selected=true]').textContent,'Zero');
    f.app.data.setItem('choice',0);await settle();f.host('choice').toggle.click();await settle();
    assert.equal(f.host('choice').choices.querySelector('[aria-selected=true]').textContent,'Zero');
});

test('reopening never highlights an unrelated candidate when the current key is absent from the result window', async t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('choice',2);r.dbSelect({id:'choice',value:'^choice',searchDelay:0});},
        (method,kw)=>reply('_id' in kw?[rows[1]]:[rows[0]]));
    await settle();f.host('choice').toggle.click();await settle();
    assert.equal(f.host('choice').choices.querySelector('[aria-selected=true]'),null);
    f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),2);
});

test('combo Enter and blur preserve free text, including an exact caption without a picked record', async t => {
    const f = fixture(t, r => r.dbComboBox({id:'choice', value:'^choice', searchDelay:0,
        selected_email:'email', selectedRecord:'record'}), lookup);
    f.type('choice','Ad'); await settle();
    assert.equal(f.host('choice').control.hasAttribute('aria-activedescendant'),false);
    f.key('choice','Enter');
    assert.equal(f.app.data.getItem('choice'),'Ad');
    assert.equal(f.app.data.getItem('record'),null);
    f.type('choice','Ada'); await settle(); f.event(f.host('choice').control,'blur');
    assert.equal(f.app.data.getItem('choice'),'Ada');
    assert.equal(f.app.data.getItem('email'),null);
    f.type('choice','Ad'); await settle(); f.key('choice','ArrowDown'); f.event(f.host('choice').control,'blur');
    assert.equal(f.app.data.getItem('choice'),'Ada');
    assert.equal(f.app.data.getItem('email'),'ada@test');
});

test('explicit arrow opening and navigation select suggestions without affecting ordinary typing', async t => {
    const f = fixture(t, r => r.dbComboBox({id:'choice', value:'^choice', searchDelay:0, selected_email:'email'}), lookup);
    f.host('choice').control.focus(); f.key('choice','ArrowUp'); await settle(); f.key('choice','Enter');
    assert.equal(f.app.data.getItem('choice'),'Ada');
    f.key('choice','ArrowDown'); await settle(); f.key('choice','Enter');
    assert.equal(f.app.data.getItem('choice'),'Zero');
    f.type('choice','Z'); await settle();
    assert.equal(f.host('choice').control.hasAttribute('aria-activedescendant'),false);
    f.key('choice','Enter'); assert.equal(f.app.data.getItem('choice'),'Z');
    assert.equal(f.app.data.getItem('email'),null);
});

test('projection includes output and template fields on search and lookup without duplicate requests', async t => {
    const calls=[];
    const f=fixture(t,(r,a)=>{a.data.setItem('choice',0);r.dbSelect({id:'choice',value:'^choice',searchDelay:0,
        template:'<b>{name}</b> {city}',hiddenColumns:'city, email',selected_email:'email'});}, (method,kw)=>{
        calls.push(kw);
        assert.deepEqual(new Set(kw.hiddenColumns.split(',')),new Set(['city','email','name']));
        return reply([{id:0,name:'Zero',city:'Torino',email:'zero@test'}]);
    });
    await settle(); assert.equal(f.app.data.getItem('email'),'zero@test');
    f.type('choice','Ze');await settle();
    assert.equal(calls.length,2);assert.equal(calls[0]._id,0);assert.equal(calls[1]._querystring,'Ze');
    assert.equal(f.host('choice').choices.lastElementChild.textContent,'Zero Torino');
});

test('incomplete or refused selected-field projections fail without committing a candidate', async t => {
    for(const response of [() => reply(rows), () => {throw Error('Field not exposed: secret');}]) {
        const f=fixture(t,r=>r.dbSelect({id:'choice',value:'^choice',searchDelay:0,selected_secret:'secret'}),response);
        f.type('choice','Ad');await settle();
        assert.match(f.host('choice').message.textContent,/secret/);
        assert.equal(f.host('choice').choices.hidden,true);
        f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),null);
        assert.equal(f.app.data.getItem('secret'),null);
    }
});

test('null choice clears the typed key and all outputs, while required fields reject null', async t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('choice',0);a.data.setItem('required',false);r.dbSelect({id:'choice',value:'^choice',
        searchDelay:0,emptyLabel:'No customer',placeholder:'Find customer',validate_notnull:'^required',
        selected_email:'email',selectedRecord:'record',selectedCaption:'caption'});},lookup);
    await settle();f.host('choice').toggle.click();await settle();
    assert.equal(f.host('choice').control.placeholder,'Find customer');
    assert.equal(f.host('choice').choices.firstElementChild.textContent,'No customer');
    f.host('choice').choices.firstElementChild.click();
    assert.equal(f.app.data.getItem('choice'),null);assert.equal(f.host('choice').control.value,'');
    for(const path of ['email','record','caption'])assert.equal(f.app.data.getItem(path),null);
    f.app.data.setItem('choice',0);f.app.data.setItem('required',true);await settle();
    f.host('choice').toggle.click();await settle();
    assert.equal(f.host('choice').choices.children.length,2);
    assert.equal(f.host('choice').choices.firstElementChild.textContent,'Zero');
    f.type('choice','');f.event(f.host('choice').control,'change');
    assert.equal(f.app.data.getItem('choice'),0);assert.equal(f.app.data.getItem('email'),'zero@test');
    assert.equal(f.host('choice').control.getAttribute('aria-invalid'),'true');
});

test('a null choice never counts as a candidate and clearing does not restart autoSelect', async t => {
    let requests=0;
    const f=fixture(t,r=>r.dbSelect({id:'choice',value:'^choice',searchDelay:0,autoSelect:true,selected_email:'email'}),()=>{
        requests++;return reply([rows[0]]);
    });
    await settle();assert.equal(f.app.data.getItem('choice'),0);
    f.host('choice').toggle.click();await settle();const before=requests;
    f.host('choice').choices.firstElementChild.click();await settle();
    assert.equal(f.app.data.getItem('choice'),null);assert.equal(f.app.data.getItem('email'),null);
    assert.equal(requests,before);
});

test('dbSelect refuses ambiguous exact captions on blur but commits an explicitly chosen identity', async t => {
    const f=fixture(t,r=>r.dbSelect({id:'choice',value:'^choice',searchDelay:0}),()=>reply([
        {id:1,name:'Same'},{id:2,name:'Same'}]));
    f.type('choice','Same');await settle();f.event(f.host('choice').control,'blur');
    assert.equal(f.app.data.getItem('choice'),null);
    assert.equal(f.host('choice').control.getAttribute('aria-invalid'),'true');
    f.type('choice','Same');await settle();f.key('choice','ArrowDown');f.key('choice','Enter');
    assert.equal(f.app.data.getItem('choice'),2);
});

for (const widget of ['dbSelect', 'dbComboBox']) test(`${widget} renders record HTML templates and keeps the original selection contract`, async t => {
    const calls = [];
    const f = fixture(t, r => r[widget]({id:'choice', value:'^choice', method:'customers', searchDelay:0,
        template:'<b>{name}</b><br><span>{city}</span>', hiddenColumns:'city', selected_city:'city', selectedCaption:'caption'}),
    (method, kw) => { calls.push(kw); return reply([{id:0, name:'Ada', city:'Torino'}]); });
    f.type('choice', 'Ad'); await settle();
    const item = f.host('choice').choices.querySelector('b').closest('[role="option"]');
    assert.equal(item.querySelector('b').textContent, 'Ada');
    assert.equal(item.querySelector('span').textContent, 'Torino');
    assert.equal(item.querySelectorAll('br').length, 1);
    assert.equal(item.getAttribute('role'), 'option');
    assert.equal(item.getAttribute('aria-selected'), String(widget === 'dbSelect'));
    assert.equal(item.style.display, 'block');
    assert.equal('template' in calls[0], false);
    assert.deepEqual(new Set(calls[0].hiddenColumns.split(',')), new Set(['city','name']));
    item.querySelector('span').dispatchEvent(new f.window.MouseEvent('click', {bubbles:true}));
    assert.equal(f.app.data.getItem('choice'), widget === 'dbSelect' ? 0 : 'Ada');
    assert.equal(f.host('choice').control.value, 'Ada');
    assert.equal(f.app.data.getItem('city'), 'Torino');
    assert.equal(f.app.data.getItem('caption'), 'Ada');
});

test('template values remain literal text and passive markup preserves false, zero and null', async t => {
    const name = '<img src=x onerror="alert(1)">{city} $&';
    const f = fixture(t, r => r.dbSelect({id:'choice', value:'^choice', searchDelay:0,
        template:'<script>alert(1)</script><b onclick="alert(1)" role="button" tabindex="0">{name}</b><br><span>{id}/{active}/{city}</span><input autofocus>'}),
    () => reply([{id:0, name, active:false, city:null}]));
    f.type('choice', 'a'); await settle();
    const choices = f.host('choice').choices;
    assert.equal(choices.querySelector('b').textContent, name);
    assert.equal(choices.querySelector('span').textContent, '0/false/');
    assert.equal(choices.querySelector('script,img,input,[onclick],[tabindex],b[role]'), null);
    f.key('choice','Enter');
    assert.equal(f.app.data.getItem('choice'), 0);
    assert.equal(f.host('choice').control.value, name);
});

test('template field errors are reported as request errors and never commit an incomplete row', async t => {
    const f = fixture(t, r => r.dbSelect({id:'choice', value:'^choice', searchDelay:0,
        template:'<b>{name}</b> {city}'}), () => reply(rows));
    f.type('choice', 'Ad'); await settle();
    assert.match(f.host('choice').message.textContent, /Missing requested selector column: city/);
    assert.equal(f.host('choice').choices.hidden, true);
    f.key('choice','Enter');
    assert.equal(f.app.data.getItem('choice'), null);
});

test('changing a bound template cancels old results and clearing it restores the plain presentation', async t => {
    const calls = [];
    const f = fixture(t, (r,a) => {
        a.data.setItem('layout', '<b>{name}</b>');
        r.dbSelect({id:'choice', value:'^choice', searchDelay:0, template:'^layout'});
    }, (method,kw,signal) => new Promise(resolve => calls.push({signal,resolve})));
    f.type('choice','old');
    f.app.data.setItem('layout','<em>{email}</em>');
    assert.equal(calls[0].signal.aborted,true);
    calls[0].resolve(reply(rows)); await settle();
    assert.equal(f.host('choice').choices.hidden,true);
    f.type('choice','new'); calls[1].resolve(reply(rows)); await settle();
    assert.equal(f.host('choice').choices.querySelector('em').textContent,'zero@test');
    assert.equal(f.host('choice').choices.querySelector('b'),null);
    f.app.data.setItem('layout',null);
    assert.equal(f.host('choice').choices.hidden,true);
    f.type('choice','plain'); calls[2].resolve(reply(rows)); await settle();
    assert.equal(f.host('choice').choices.children[1].textContent,'Zero');
    assert.equal(f.host('choice').choices.querySelector('em'),null);
});

test('template placeholders cannot populate HTML attributes', async t => {
    const f = fixture(t, r => r.dbSelect({id:'choice', value:'^choice', searchDelay:0}), lookup);
    assert.throws(() => f.host('choice').projectAttributes({template:'<span title="{name}">{name}</span>'}, attrs => attrs),
        /placeholders belong in text/);
});

test('typed zero, lookup, projected outputs, callback and rejected draft',async t=>{
    let observed;
    class Logic {picked(node,kw){observed={kw,email:node.getRelativeData('email')};}}
    const f=fixture(t,(r,a)=>{a.data.setItem('choice',0);r.dbSelect({id:'choice',value:'^choice',dbtable:'customers',searchDelay:0,
        selectedCaption:'caption',selectedRecord:'record',selected_email:'email',selectedCb:'picked',hiddenColumns:'email'});},lookup,Logic);
    await settle();assert.equal(f.host('choice').control.value,'Zero');assert.equal(f.app.data.getItem('record.id'),0);
    f.type('choice','Ad');await settle();f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),2);
    assert.equal(observed.email,'ada@test');assert.equal(observed.kw.value,2);
    f.type('choice','invalid');await settle();f.event(f.host('choice').control,'change');
    assert.equal(f.app.data.getItem('choice'),2);assert.equal(f.host('choice').control.value,'invalid');
    f.type('choice','');f.event(f.host('choice').control,'change');assert.equal(f.app.data.getItem('choice'),null);
    assert.equal(f.app.data.getItem('record'),null);assert.equal(f.app.data.getItem('email'),null);
});
test('free text and clearing remove old selected outputs',async t=>{
    const f=fixture(t,r=>r.dbComboBox({id:'choice',value:'^choice',method:'dedicated',searchDelay:0,selected_email:'email'}),lookup);
    f.type('choice','Ad');await settle();f.key('choice','ArrowDown');f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),'Ada');assert.equal(f.app.data.getItem('email'),'ada@test');
    f.type('choice','New customer');await settle();f.event(f.host('choice').control,'change');
    assert.equal(f.app.data.getItem('choice'),'New customer');assert.equal(f.app.data.getItem('email'),null);
    f.type('choice','');f.event(f.host('choice').control,'change');assert.equal(f.app.data.getItem('choice'),null);
});
test('dedicated method, bound filters, cancellation, response races and removal',async t=>{
    const calls=[];
    const f=fixture(t,(r,a)=>{a.data.setItem('country','IT');r.dbSelect({id:'choice',node_label:'choice',value:'^choice',method:'customers',condition_country:'^country',searchDelay:0});},
        (method,kw,signal)=>new Promise(resolve=>calls.push({method,kw,signal,resolve})));
    f.type('choice','old');f.type('choice','new');assert.equal(calls[0].signal.aborted,true);
    assert.equal(calls[1].method,'customers');assert.equal(calls[1].kw.country,'IT');assert.equal('dbtable' in calls[1].kw,false);
    calls[1].resolve(reply([rows[1]]));await settle();calls[0].resolve(reply([rows[0]]));await settle();assert.equal(f.host('choice').choices.lastElementChild.textContent,'Ada');
    f.type('choice','pending');f.app.data.setItem('country','GB');assert.equal(calls[2].signal.aborted,true);
    f.type('choice','remove');const host=f.host('choice');f.app.src.source.popNode('main.choice');assert.equal(calls[3].signal.aborted,true);
    calls[3].resolve(reply(rows));await settle();assert.equal(host.choices.hidden,true);
});
test('debounce, invalid response, external clear and sole candidate',async t=>{
    const calls=[];const f=fixture(t,r=>r.dbSelect({id:'choice',value:'^choice',dbtable:'customers',searchDelay:20}),async(method,kw)=>{
        calls.push(kw);return reply(kw._querystring==='duplicate'?[rows[0],rows[0]]:rows);});
    f.type('choice','a');f.type('choice','duplicate');assert.equal(calls.length,0);
    await new Promise(r=>setTimeout(r,40));assert.equal(calls.length,1);assert.match(f.host('choice').message.textContent,/duplicate/);
    f.type('choice','pending');f.app.data.setItem('choice',0);await settle();f.app.data.setItem('choice',null);
    await new Promise(r=>setTimeout(r,40));assert.equal(f.host('choice').control.value,'');
    const auto=fixture(t,r=>r.dbSelect({id:'auto',value:'^choice',dbtable:'customers',autoSelect:true}),()=>reply([rows[0]]));
    await settle();await settle();assert.equal(auto.app.data.getItem('choice'),0);
});
test('autoSelect reacts to Data but never mistakes a limited result for a sole candidate',async t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('auto',false);r.dbSelect({id:'choice',value:'^choice',dbtable:'customers',autoSelect:'^auto',limit:1});},
        (method,kw)=>reply(rows.slice(0,kw.limit)));
    f.app.data.setItem('auto',true);await settle();await settle();assert.equal(f.app.data.getItem('choice'),null);
    const sole=fixture(t,(r,a)=>{a.data.setItem('auto',false);r.dbSelect({id:'choice',value:'^choice',dbtable:'customers',autoSelect:'^auto'});},()=>reply([rows[0]]));
    sole.app.data.setItem('auto',true);await settle();await settle();assert.equal(sole.app.data.getItem('choice'),0);
});
test('a changed filter cancels an asynchronous validation before it can commit an ineligible row',async t=>{
    let finish;
    class Logic {check(){return new Promise(resolve=>{finish=resolve;});}}
    const f=fixture(t,(r,a)=>{a.data.setItem('country','IT');r.dbSelect({id:'choice',value:'^choice',method:'eligible',
        condition_country:'^country',searchDelay:0,validate_call:'check'});},lookup,Logic);
    f.type('choice','Ad');await settle();f.key('choice','Enter');
    f.app.data.setItem('country','GB');finish(true);await settle();assert.equal(f.app.data.getItem('choice'),null);
});
test('string keys, visible columns, hidden fields and disabled autoSelect',async t=>{
    let requests=0;
    const f=fixture(t,r=>r.dbSelect({id:'choice',value:'^choice',method:'strings',searchDelay:0,columns:'name,country',hiddenColumns:'email'}),()=>{
        requests++;return reply([{id:'a',name:'Ada',country:'GB',email:'private@test'}]);});
    f.type('choice','Ada');await settle();assert.equal(f.host('choice').choices.lastElementChild.textContent,'AdaGB');
    f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),'a');
    const locked=fixture(t,r=>r.dbSelect({id:'choice',value:'^choice',dbtable:'customers',autoSelect:true,disabled:true,hasDownArrow:false}),()=>{throw Error('Disabled autoSelect requested data');});
    await settle();assert.equal(locked.app.data.getItem('choice'),null);assert.equal(locked.host('choice').toggle.hidden,true);
});

test('Escape restores accepted combo text and preserves its selected projection', async t => {
    let notifications = 0;
    class Logic { picked() { notifications++; } }
    const f = fixture(t, r => r.dbComboBox({id:'choice', value:'^choice', method:'dedicated', searchDelay:0,
        selected_email:'email', selectedCaption:'caption', selectedRecord:'record', selectedCb:'picked'}), lookup, Logic);
    f.type('choice', 'Ad'); await settle(); f.key('choice', 'ArrowDown'); f.key('choice', 'Enter');
    const record = f.app.data.getItem('record');
    f.type('choice', 'discard this draft'); f.key('choice', 'Escape'); await settle();
    assert.equal(f.app.data.getItem('choice'), 'Ada');
    assert.equal(f.host('choice').control.value, 'Ada');
    assert.equal(f.app.data.getItem('caption'), 'Ada');
    assert.equal(f.app.data.getItem('email'), 'ada@test');
    assert.equal(f.app.data.getItem('record'), record);
    assert.equal(notifications, 1);
    f.type('choice', 'new text'); await settle(); f.event(f.host('choice').control, 'change');
    assert.equal(f.app.data.getItem('email'), null);
});

test('failed current lookup clears the previous projection but stale failure cannot clear a newer one', async t => {
    let rejectOld;
    const f = fixture(t, (r, a) => {
        a.data.setItem('choice', 0);
        r.dbSelect({id:'choice', value:'^choice', method:'dedicated',
            selected_email:'email', selectedCaption:'caption', selectedRecord:'record'});
    }, (method, parameters) => {
        if (parameters._id === 99) throw new Error('Lookup unavailable');
        if (parameters._id === 98) return new Promise((resolve, reject) => { rejectOld = reject; });
        return lookup(method, parameters);
    });
    await settle(); assert.equal(f.app.data.getItem('record.id'), 0);
    f.app.data.setItem('choice', 99); await settle();
    assert.equal(f.app.data.getItem('choice'), 99);
    for (const path of ['caption', 'email', 'record']) assert.equal(f.app.data.getItem(path), null);
    assert.equal(f.host('choice').message.textContent, 'Lookup unavailable');
    f.app.data.setItem('choice', 98);
    f.app.data.setItem('choice', 2); await settle();
    rejectOld(new Error('Obsolete failure')); await settle();
    assert.equal(f.app.data.getItem('record.id'), 2);
    assert.equal(f.app.data.getItem('email'), 'ada@test');
    assert.equal(f.host('choice').message.textContent, '');
});

test('cancelled identity lookup never restarts autoSelect over a subsequent draft', async t => {
    const requests = [];
    const f = fixture(t, (r, a) => {
        a.data.setItem('choice', 0);
        r.dbSelect({id:'choice', value:'^choice', method:'dedicated', autoSelect:true, searchDelay:0});
    }, (method, parameters, signal) => new Promise(resolve => requests.push({parameters, signal, resolve})));
    await settle();
    const oldLookups = requests.slice();
    f.type('choice', ''); f.event(f.host('choice').control, 'change');
    f.type('choice', 'Draft');
    const activeSearch = requests.at(-1);
    const count = requests.length;
    for (const request of oldLookups) request.resolve(reply([rows[0]]));
    await settle(); await settle();
    assert.equal(requests.length, count);
    assert.equal(activeSearch.signal.aborted, false);
    assert.equal(f.app.data.getItem('choice'), null);
    assert.equal(f.host('choice').control.value, 'Draft');
    activeSearch.resolve(reply([])); await settle();
    assert.equal(f.host('choice').control.value, 'Draft');
});


test('auxColumns sends relation paths and renders native returned keys with metadata', async t => {
    const calls=[];
    const f=fixture(t,(r,a)=>r.dbSelect({id:'choice',value:'^choice',searchDelay:0,
        auxColumns:'@state.name',selected__state_name:'stateName'}),(method,kw)=>{
        calls.push(kw);
        assert.equal(kw.auxColumns,'@state.name');
        assert.equal(kw.hiddenColumns,'_state_name');
        return {rows:[{id:1,name:'Ada',_state_name:'<b>Tasmania</b>'}],identifier:'id',caption:'name',
            columns:['name','_state_name'],headers:['Customer','State']};
    });
    f.type('choice','Ad');await settle();
    assert.equal(f.host('choice').choices.lastElementChild.textContent,'CustomerAdaState<b>Tasmania</b>');
    assert.equal(f.host('choice').choices.querySelector('b'),null);
    f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),1);
    assert.equal(f.app.data.getItem('stateName'),'<b>Tasmania</b>');
    f.app.data.setItem('choice',null);await settle();
    assert.equal(f.app.data.getItem('stateName'),null);
    f.app.data.setItem('choice',1);await settle();
    assert.equal(calls.at(-1)._id,1);
    assert.equal(f.app.data.getItem('stateName'),'<b>Tasmania</b>');
});

test('auxColumns refuses unsupported services, malformed metadata and missing values', async t => {
    for(const metadata of [{}, {columns:['name'],headers:[]},
        {columns:['name','missing'],headers:['Customer','State']}]) {
        const f=fixture(t,r=>r.dbSelect({id:'choice',value:'^choice',searchDelay:0,auxColumns:'@state.name'}),
            ()=>({...reply([{id:1,name:'Ada'}]),...metadata}));
        f.type('choice','Ad');await settle();
        assert.match(f.host('choice').message.textContent,/metadata|Missing requested/);
        assert.equal(f.host('choice').choices.hidden,true);
        f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),null);
    }
});

test('auxColumns retains template precedence and handles null related values', async t => {
    const f=fixture(t,r=>r.dbSelect({id:'choice',value:'^choice',searchDelay:0,
        auxColumns:'@state.name',template:'<b>{name}</b> {_state_name}'}),
        ()=>({...reply([{id:1,name:'Ada',_state_name:null}]),columns:['name','_state_name'],headers:['Customer','State']}));
    f.type('choice','Ad');await settle();
    assert.equal(f.host('choice').choices.lastElementChild.textContent,'Ada ');
    assert.equal(f.host('choice').choices.querySelector('b').textContent,'Ada');
});

test('both database controls show native provider errors instead of empty results', async t => {
    for (const tag of ['dbSelect', 'dbComboBox']) {
        const message = 'Unknown column demo.state.missing';
        const f = fixture(t, r => r[tag]({id:'choice', value:'^choice', searchDelay:0,
            auxColumns:'@state.missing'}), async () => { throw new Error(message); });
        f.type('choice', 'Ad'); await settle();
        assert.equal(f.host('choice').message.textContent, message);
        assert.equal(f.host('choice').choices.hidden, true);
        assert.equal(f.app.data.getItem('choice'), null);
        assert.equal(f.host('choice').control.getAttribute('aria-busy'), 'false');
    }
});


test('templateNull preserves zero, false and empty text in both database controls', async t => {
    for (const kind of ['dbSelect', 'dbComboBox']) {
        const f = fixture(t, r => r[kind]({id:'choice', template:'<span>{amount}</span>',
            templateNull:'—', searchDelay:0}),
            () => reply([null, 0, false, ''].map((amount, id) => ({id, name:String(id), amount}))));
        await settle(); f.host('choice').toggle.click(); await settle();
        assert.deepEqual([...f.host('choice').choices.querySelectorAll('[role=option] span')]
            .map(node => node.textContent), ['—', '0', 'false', '']);
    }
});

test('bound templateNull updates literally without replacing the editor or selected value', async t => {
    const f = fixture(t, (r, a) => {
        a.data.setItem('placeholder', '—'); a.data.setItem('choice', 1);
        a.data.setItem('secret', 'must not be displayed');
        r.dbSelect({id:'choice', value:'^choice', template:'<span>{amount}</span>',
            templateNull:'^placeholder', searchDelay:0});
    }, () => reply([{id:1, name:'Alpha', amount:null}]));
    await settle(); const host = f.host('choice'), control = host.control;
    host.toggle.click(); await settle();
    assert.equal(host.choices.querySelector('[role=option] span').textContent, '—');
    f.key('choice','Escape');
    f.app.data.setItem('placeholder', '^secret <img src=x onerror=alert(1)>');
    await settle(); host.toggle.click(); await settle();
    assert.equal(host.choices.querySelector('[role=option] span').textContent,
        '^secret <img src=x onerror=alert(1)>');
    assert.equal(host.choices.querySelector('img'), null);
    assert.equal(f.host('choice'), host); assert.equal(host.control, control);
    assert.equal(f.app.data.getItem('choice'), 1);
});


test('Escape followed by blur lets the selected-caption lookup finish', async t => {
    let deferred = false, finish, signal;
    const f = fixture(t, (r,a) => {
        a.data.setItem('choice', 2);
        r.dbSelect({id:'choice', value:'^choice', selected_email:'email', searchDelay:0});
    }, (method,kw,currentSignal) => {
        if (deferred && '_id' in kw) {
            signal = currentSignal;
            return new Promise(resolve => {finish = resolve;});
        }
        return lookup(method,kw);
    });
    await settle(); const host = f.host('choice');
    assert.equal(host.control.value, 'Ada');
    host.toggle.click(); await settle(); deferred = true;
    f.key('choice','Escape'); f.event(host.control,'blur');
    assert.equal(signal.aborted, false);
    finish(reply([rows[1]])); await settle();
    assert.equal(host.control.value, 'Ada');
    assert.equal(f.app.data.getItem('choice'), 2);
    assert.equal(f.app.data.getItem('email'), 'ada@test');
    assert.equal(host.choices.hidden, true);
});

test('Enter cancels a debounced or in-flight combo search without reopening', async t => {
    for (const delay of [0, 20]) {
        let finish; const calls = [];
        const f = fixture(t, r => r.dbComboBox({id:'choice', value:'^choice', searchDelay:delay}),
            (method,kw,signal) => {calls.push(signal); return new Promise(resolve => {finish=resolve;});});
        f.type('choice', 'Draft'); f.key('choice','Enter');
        if (finish) finish(reply(rows));
        await new Promise(resolve => setTimeout(resolve,40));
        assert.equal(f.app.data.getItem('choice'),'Draft');
        assert.equal(f.host('choice').choices.hidden,true);
        if (delay) assert.equal(calls.length,0);
        else assert.equal(calls[0].aborted,true);
    }
});


test('clearing or removing a selector still cancels its pending selected-value lookup', async t => {
    for (const remove of [false, true]) {
        let finish, signal;
        const f = fixture(t, (r,a) => {
            a.data.setItem('choice',2);
            r.dbSelect({id:'choice',node_label:'choice',value:'^choice',selected_email:'email'});
        }, (method,kw,currentSignal) => {
            signal=currentSignal; return new Promise(resolve=>{finish=resolve;});
        });
        const host=f.host('choice');
        if (remove) f.app.src.source.popNode('main.choice');
        else f.app.data.setItem('choice',null);
        assert.equal(signal.aborted,true);
        finish(reply([rows[1]])); await settle();
        assert.equal(f.app.data.getItem('email'),null);
        assert.equal(host.choices.hidden,true);
        if (!remove) assert.equal(host.control.value,'');
    }
});
