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
    calls[1].resolve(reply([rows[1]]));await settle();calls[0].resolve(reply([rows[0]]));await settle();assert.equal(f.host('choice').choices.textContent,'Clear selectionAda');
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
    f.type('choice','Ada');await settle();assert.equal(f.host('choice').choices.textContent,'Clear selectionAdaGB');
    f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),'a');
    const locked=fixture(t,r=>r.dbSelect({id:'choice',value:'^choice',dbtable:'customers',autoSelect:true,disabled:true,hasDownArrow:false}),()=>{throw Error('Disabled autoSelect requested data');});
    await settle();assert.equal(locked.app.data.getItem('choice'),null);assert.equal(locked.host('choice').toggle.hidden,true);
});
