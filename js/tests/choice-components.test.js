import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';
import tree from '../src/components/tree.js';

const settle = () => new Promise(resolve => setTimeout(resolve, 0));
function fixture(t, author, Logic = class {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    // jsdom does not implement browser top-layer/layout APIs.
    window.HTMLElement.prototype.showPopover = function () {};
    window.HTMLElement.prototype.hidePopover = function () {};
    window.HTMLElement.prototype.scrollIntoView = function () {};
    const app = new Gramlot({document: window.document, transport: false, collections: [tree, inputs]});
    app.src.logicRegistry.register(Logic, {resource: 'test:choices'});
    const builder = new GramlotBuilder(null, {collections: [tree, inputs]});
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

test('combo Bag choices preserve comma/colon paths and accept newly typed directories',async t=>{
    const {Bag}=await import('../src/index.js');const bag=new Bag();bag.setItem('first','/tmp/a,b:c',{caption:'/tmp/a,b:c'});
    const f=fixture(t,(r,a)=>{a.data.setItem('recent',bag);r.comboBox({id:'root',value:'^root',store:'^recent'});});
    await settle();f.host('root').control.focus();f.key('root','ArrowDown');await settle();assert.equal(f.host('root').choices.textContent,'/tmp/a,b:c');
    f.key('root','Enter');assert.equal(f.app.data.getItem('root'),'/tmp/a,b:c');
    f.type('root','/tmp/new folder');f.key('root','Enter');assert.equal(f.app.data.getItem('root'),'/tmp/new folder');
});

test('combo store choices are read at the store address when they load',async t=>{
    const bag=new Bag();bag.setItem('a','alpha',{caption:'Alpha'});
    const f=fixture(t,(r,a)=>{a.data.setItem('recent',bag);r.comboBox({id:'root',value:'^root',store:'^recent'});});
    const open=async()=>{f.key('root','Escape');f.key('root','ArrowDown');await settle();return f.host('root').choices.textContent;};
    await settle();f.host('root').control.focus();
    assert.equal(await open(),'Alpha');
    bag.setItem('b','beta',{caption:'Beta'});await settle();
    assert.equal(await open(),'AlphaBeta','a change inside the store Bag reaches the choices');
    const replacement=new Bag();replacement.setItem('c','gamma',{caption:'Gamma'});
    f.app.data.setItem('recent',replacement);await settle();
    assert.equal(await open(),'Gamma','a replacement at the address reaches the choices');
    bag.setItem('d','delta',{caption:'Delta'});await settle();
    assert.equal(await open(),'Gamma','the replaced Bag is not read');
    // A silent replacement (no Data event) is read by the next load: the choices come from the address.
    const silent=new Bag();silent.setItem('e','epsilon',{caption:'Epsilon'});
    f.app.data.setItem('recent',silent,null,'>',false,true,null,false,false);
    assert.equal(await open(),'Epsilon');
    f.app.data.setItem('recent',null);await settle();
    assert.equal(await open(),'No results','an empty store address gives no choices');
});

test('local choices accept a newline separator',async t=>{
    const f=fixture(t,r=>r.comboBox({id:'choice',value:'^choice',values:'a,b\nc,d',separator:'\n'}));
    await settle();f.host('choice').control.focus();f.key('choice','ArrowDown');await settle();assert.equal(f.host('choice').choices.children.length,2);
    f.key('choice','Enter');assert.equal(f.app.data.getItem('choice'),'a,b');
});

test('checkBoxText popup commits repeatedly, displays captions, locks and restores focus', t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('selection','a');r.checkBoxText({id:'multi',value:'^selection',values:'a:Alpha,b:Beta',popup:'^popup',disabled:'^locked'});a.data.setItem('popup',true);});
    const host=f.host('multi'), control=host.control, first=control.querySelector('input');
    assert.equal(host.summary.value,'Alpha');
    assert.equal(f.app.data.getItem('selection?_dv_displayedValue'),'Alpha');
    host.summary.click();assert.equal(host.panel.hidden,false);
    control.querySelector('input[value=b]').click();
    assert.equal(f.app.data.getItem('selection'),'a,b');
    assert.equal(f.app.data.getItem('selection?_dv_displayedValue'),'Alpha,Beta');
    assert.equal(host.panel.hidden,false);
    control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(host.panel.hidden,true);assert.equal(host.shadowRoot.activeElement,host.summary);
    host.summary.click();f.app.data.setItem('locked',true);
    assert.equal(host.panel.hidden,true);assert.equal(host.summary.disabled,true);
    f.app.data.setItem('locked',false);f.app.data.setItem('popup',false);
    assert.equal(host.control,control);assert.equal(control.querySelector('input'),first);
    assert.equal(host.summary.hidden,true);assert.equal(control.parentElement,host.controlBox);
});

test('checkBoxText observes the original Bag, preserves missing codes and releases subscriptions', t => {
    const options=new Bag();options.setItem('a',null,{caption:'Alpha'});options.setItem('b',null,{caption:'Beta'});
    const f=fixture(t,(r,a)=>{a.data.setItem('options',options);a.data.setItem('selection','a');
        r.checkBoxText({id:'multi',value:'^selection',values:'^options',labelAttribute:'caption',popup:true});});
    const host=f.host('multi'), first=host.control.querySelector('input');
    options.setItem('a',null,{caption:'Updated'});
    assert.equal(host.summary.value,'Updated');assert.equal(host.control.querySelector('input'),first);
    options.popNode('a');assert.equal(f.app.data.getItem('selection'),'a');assert.equal(host.summary.value,'a');
    host.control.querySelector('input[value=b]').click();assert.equal(f.app.data.getItem('selection'),'a,b');
    const replacement=new Bag();replacement.setItem('a',null,{caption:'Restored'});
    f.app.data.setItem('options',replacement);assert.equal(host.summary.value,'Restored,b');
    options.setItem('a',null,{caption:'Old'});assert.equal(host.summary.value,'Restored,b');
    f.app.dispose();replacement.setItem('a',null,{caption:'After disposal'});assert.equal(host.summary.value,'Restored,b');
});


test('checkBoxText remote options request a complete list and discard obsolete responses', async t => {
    const f=fixture(t,r=>r.checkBoxText({id:'multi',node_label:'multi',value:'^selection',popup:true}));
    const host=f.host('multi'), pending=[];
    host.pageContext.remote=(method,parameters,signal)=>new Promise(resolve=>pending.push({method,parameters,signal,resolve}));
    f.app.src.source.getNode('main.multi').setAttr({value:'^selection',popup:true,dbtable:'people',condition:'$state=:state',condition_state:'A'});
    f.app.src.source.getNode('main.multi').setAttr({value:'^selection',popup:true,dbtable:'people',condition:'$state=:state',condition_state:'B'});
    assert.equal(pending.length,2);assert.equal(pending[0].signal.aborted,true);
    assert.deepEqual(pending[1].parameters,{dbtable:'people',condition:'$state=:state',state:'B',_querystring:'',limit:null});
    const result=name=>({rows:[{id:0,name}],identifier:'id',caption:'name'});
    pending[1].resolve(result('New'));await settle();pending[0].resolve(result('Old'));await settle();
    assert.equal(host.control.textContent,'New');host.control.querySelector('input').click();
    assert.equal(f.app.data.getItem('selection'),'0');assert.equal(host.summary.value,'New');
    f.app.src.source.getNode('main.multi').setAttr({value:'^selection',popup:true,values:'',method:'choices'});
    f.app.dispose();assert.equal(pending[2].signal.aborted,true);pending[2].resolve(result('Disposed'));await settle();
    assert.equal(host.control.textContent,'New');
});

test('checkBoxText remote failures stay visible, keep Data and do not replace validation messages', async t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('selection','a');r.checkBoxText({id:'multi',node_label:'multi',value:'^selection',values:'a:Alpha',popup:true});});
    const host=f.host('multi');
    host.pageContext.remote=async()=>{throw new Error('Options unavailable');};
    f.app.src.source.getNode('main.multi').setAttr({value:'^selection',popup:true,values:'',method:'choices'});
    await settle();assert.equal(host.optionsMessage.textContent,'Options unavailable');
    assert.equal(host.message.id,'field-message');assert.equal(host.summary.disabled,true);
    assert.equal(f.app.data.getItem('selection'),'a');
    f.app.src.source.getNode('main.multi').setAttr({value:'^selection',popup:true,method:null,values:'a:^secret'});
    assert.equal(host.summary.disabled,false);assert.equal(host.summary.value,'^secret');
    assert.equal(host.optionsMessage.textContent,'');assert.equal(f.app.data.getItem('selection?_dv_displayedValue'),'^secret');
});

test('hierarchical checkBoxText reuses the tree and original Bag, propagates and preserves disabled nodes', async t => {
    const children = new Bag({first:null,second:null,locked:null});
    children.getNode('locked').setAttr({checked:'disabled:on'});
    const options = new Bag({folder:children,other:null});
    const f=fixture(t,(r,a)=>{a.data.setItem('options',options);r.checkBoxText({id:'multi',value:'^selection',values:'^options',hierarchical:true,popup:true});});
    await settle();const host=f.host('multi'), tree=host.control.querySelector('gramlot-tree');
    assert.equal(tree.storeBag,options);
    host.summary.click();
    const check=path=>tree.shadowRoot.querySelector(`[data-path="${path}"] > .row > input`);
    check('folder').click();await settle();
    assert.equal(f.app.data.getItem('selection'),'folder.first,folder.second');
    assert.equal(check('folder.first').checked,true);assert.equal(check('folder').checked,true);
    assert.equal(children.getNode('first').attr.checked,undefined);
    assert.equal(children.getNode('locked').attr.checked,'disabled:on');
    assert.equal(check('folder.locked').checked,true);assert.equal(check('folder.locked').disabled,true);
    f.app.data.setItem('selection',null);await settle();
    assert.equal(check('folder.first').checked,false);assert.equal(check('folder').indeterminate,true);
    assert.equal(children.getNode('locked').attr.checked,'disabled:on');
    host.closeChoices();host.summary.click();assert.equal(host.control.querySelector('gramlot-tree'),tree);
});

test('hierarchical identifiers keep unknown codes and follow external values without copying the Bag', async t => {
    const children = new Bag();children.setItem('first',null,{code:'a',caption:'Alpha'});children.setItem('second',null,{code:'b',caption:'Beta'});
    const options=new Bag();options.setItem('folder',children,{code:'f',caption:'Folder'});
    const f=fixture(t,(r,a)=>{a.data.setItem('options',options);a.data.setItem('selection','a,unknown');
        r.checkBoxText({id:'multi',value:'^selection',values:'^options',identifier:'code',labelAttribute:'caption',hierarchical:true,readonly:'^locked'});});
    await settle();const host=f.host('multi'),tree=host.control.querySelector('gramlot-tree');
    assert.equal(tree.shadowRoot.querySelector('[data-path="folder.first"] > .row > input').checked,true);assert.equal(host.summary.value,'Alpha,unknown');
    // A mixed branch unchecks on click (legacy toggle); the next click checks it.
    tree.shadowRoot.querySelector('[data-path="folder"] > .row > input').click();await settle();
    assert.equal(f.app.data.getItem('selection'),'unknown');
    tree.shadowRoot.querySelector('[data-path="folder"] > .row > input').click();await settle();
    assert.equal(f.app.data.getItem('selection'),'a,b,unknown');
    children.getNode('first').setAttr({caption:'Updated'});await settle();assert.equal(host.summary.value,'Updated,Beta,unknown');
    f.app.data.setItem('locked',true);await settle();assert.equal(tree.inert,true);
    const replacement=new Bag();replacement.setItem('leaf',null,{code:'a',caption:'Replacement'});
    f.app.data.setItem('options',replacement);await settle();assert.equal(tree.storeBag,replacement);
    children.getNode('first').setAttr({caption:'Old'});await settle();assert.equal(host.summary.value,'Replacement,b,unknown');
});

test('hierarchical checkBoxText delegates asynchronous lazy propagation to the shared tree', async t => {
    const {BagResolver}=await import('@genrojs/bag');let finish,calls=0;
    class Lazy extends BagResolver {load(){calls++;return new Promise(resolve=>{finish=resolve;});}}
    const options=new Bag();options.setItem('lazy',new Lazy({cacheTime:-1}));
    const f=fixture(t,(r,a)=>{a.data.setItem('options',options);r.checkBoxText({id:'multi',value:'^selection',values:'^options',hierarchical:true});});
    await settle();assert.equal(calls,0);
    const tree=f.host('multi').control.querySelector('gramlot-tree');
    tree.shadowRoot.querySelector('[data-path="lazy"] > .row > input').click();await settle();
    assert.equal(calls,0);assert.equal(f.app.data.getItem('selection'),'lazy');
    tree.shadowRoot.querySelector('[data-path="lazy"] > .row > .expander').click();await settle();
    assert.equal(calls,1);
    finish(new Bag({first:null,second:null}));await settle();await settle();
    assert.equal(tree.shadowRoot.querySelector('[data-path="lazy.first"] > .row > input').checked,true);
    assert.equal(f.app.data.getItem('selection'),'lazy');
    assert.equal(tree.storeBag,options);
});

test('hierarchical explicit codes become checked when lazy children arrive', async t => {
    const {BagResolver}=await import('@genrojs/bag');let finish,calls=0;
    class Lazy extends BagResolver {load(){calls++;return new Promise(resolve=>{finish=resolve;});}}
    const options=new Bag();options.setItem('lazy',new Lazy({cacheTime:-1}),{code:'branch'});
    const f=fixture(t,(r,a)=>{a.data.setItem('options',options);a.data.setItem('selection','a');
        r.checkBoxText({id:'multi',value:'^selection',values:'^options',hierarchical:true,identifier:'code'});});
    await settle();const host=f.host('multi'),tree=host.control.querySelector('gramlot-tree');assert.equal(calls,0);
    tree.shadowRoot.querySelector('[data-path="lazy"] > .row > .expander').click();await settle();
    const children=new Bag();children.setItem('first',null,{code:'a'});children.setItem('second',null,{code:'b'});
    finish(children);await settle();await settle();
    const box=path=>tree.shadowRoot.querySelector(`[data-path="${path}"] > .row > input`);
    assert.equal(box('lazy.first').checked,true);assert.equal(box('lazy.second').checked,false);
    assert.equal(f.app.data.getItem('selection'),'a');
    tree.shadowRoot.querySelector('[data-path="lazy.second"] > .row > input').click();await settle();
    assert.equal(f.app.data.getItem('selection'),'a,b');
});

test('checkBoxText edits descriptions, suggests additions and keeps only codes in Data', async t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('cities','MI,TO,CO');r.checkBoxText({id:'cities',value:'^cities',popup:true,values:'MI:Milano,TO:Torino,CO:Como,PV:Pavia'});});
    await settle();const host=f.host('cities');
    assert.equal(host.summary.value,'Milano,Torino,Como');
    host.summary.value += ',pa';f.event(host.summary,'input');
    assert.equal(f.app.data.getItem('cities'),'MI,TO,CO');
    assert.deepEqual([...host.shadowRoot.querySelectorAll('datalist option')].map(n=>n.value),['Milano,Torino,Como,Pavia']);
    host.summary.value='Milano,Torino,Como,pavia';f.event(host.summary,'input');f.event(host.summary,'change');
    assert.equal(f.app.data.getItem('cities'),'MI,TO,CO,PV');
    assert.equal(f.app.data.getItem('cities?_dv_displayedValue'),'Milano,Torino,Como,Pavia');
    assert.equal(host.control.querySelector('input[value=PV]').checked,true);
    host.summary.value='Como,Pavia';f.event(host.summary,'input');f.event(host.summary,'change');
    assert.equal(f.app.data.getItem('cities'),'CO,PV');
    host.summary.value='';f.event(host.summary,'input');f.event(host.summary,'change');
    assert.equal(f.app.data.getItem('cities'),null);
});

test('description drafts stay in the Source node _internal, reject unknown/ambiguous text and yield to external Data', async t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('cities','MI');r.checkBoxText({id:'cities',node_label:'cities',value:'^cities',popup:true,values:'MI:Milano,PV:Pavia,XX:Pavia'});});
    await settle();const host=f.host('cities');const source=f.app.src.source.getNode('main.cities');
    host.summary.value='Pavia';f.event(host.summary,'input');f.event(host.summary,'change');
    assert.equal(f.app.data.getItem('cities'),'MI');assert.equal(source._internal.draft.text,'Pavia');
    assert.match(host.message.textContent,/Ambiguous/);
    host.summary.value='Unknown';f.event(host.summary,'input');f.event(host.summary,'change');
    assert.equal(host.summary.getAttribute('aria-invalid'),'true');assert.equal(f.app.data.getItem('cities'),'MI');
    host.summary.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(host.summary.value,'Milano');assert.equal(source._internal.draft,null);
    host.summary.value='partial';f.event(host.summary,'input');f.app.data.setItem('cities','PV');
    assert.equal(host.summary.value,'Pavia');assert.equal(source._internal.draft,null);
});

test('hierarchical descriptions select paths and cannot select disabled nodes', async t => {
    const options=new Bag();options.setItem('folder.first',null,{caption:'Milano'});options.setItem('folder.fixed',null,{caption:'Fixed',checked:'disabled:on'});
    const f=fixture(t,(r,a)=>{a.data.setItem('options',options);r.checkBoxText({id:'cities',value:'^cities',values:'^options',hierarchical:true,popup:true,labelAttribute:'caption'});});
    await settle();const host=f.host('cities');host.summary.value='Milano';f.event(host.summary,'input');f.event(host.summary,'change');await settle();
    const box=path=>host.control.querySelector('gramlot-tree').shadowRoot.querySelector(`[data-path="${path}"] > .row > input`);
    assert.equal(f.app.data.getItem('cities'),'folder.first');assert.equal(box('folder.first').checked,true);
    host.summary.value='Fixed';f.event(host.summary,'input');f.event(host.summary,'change');
    assert.equal(f.app.data.getItem('cities'),'folder.first');assert.equal(options.getNode('folder.fixed').attr.checked,'disabled:on');
    assert.equal(box('folder.fixed').checked,true);assert.equal(box('folder.fixed').disabled,true);
});

test('opening the choice popup focuses its field without scrolling the containing pane', async t => {
    const f = fixture(t, root => root.filteringSelect({id:'choice', values:'a:Alpha,b:Beta'}));
    const host = f.host('choice');
    const focus = t.mock.method(host.control, 'focus');
    host.toggle.click();
    await settle();
    assert.deepEqual(focus.mock.calls[0].arguments, [{preventScroll:true}]);
    assert.equal(host.choices.hidden, false);
});

test('checkBoxText reads Bag values at the pointer address and keeps no subscription on the Bag', async t => {
    for (const hierarchical of [false, true]) {
        const options=new Bag();options.setItem('a',null,{caption:'Alpha'});
        const f=fixture(t,(r,a)=>{a.data.setItem('choices.options',options);a.data.setItem('selection','a');
            r.div({datapath:'choices'}).checkBoxText({id:'multi',value:'^selection',values:'^.options',labelAttribute:'caption',hierarchical,popup:true});});
        await settle();const host=f.host('multi');
        assert.deepEqual(Object.keys(options._updSubscribers),[],'no subscription on the options Bag');
        assert.equal(host.summary.value,'Alpha');
        options.setItem('a',null,{caption:'Changed'});await settle();
        assert.equal(host.summary.value,'Changed','a change inside the Bag at the address reaches the control');
        const replacement=new Bag();replacement.setItem('a',null,{caption:'Replaced'});
        f.app.data.setItem('choices.options',replacement);await settle();
        assert.equal(host.summary.value,'Replaced','the options are read at the address');
        assert.deepEqual(Object.keys(replacement._updSubscribers),[]);
    }
});

test('checkBoxText options bound to a Data Bag are never held: a replacement at the address is read', async t => {
    const f=fixture(t,(r,a)=>{a.data.setItem('picked','a');a.data.setItem('lists.options',new Bag({a:null,b:null}));
        r.checkBoxText({id:'bound',value:'^picked',values:'^lists.options'});});
    await settle();const host=f.host('bound');
    assert.equal(host.parameters.values,null,'a Data sub Bag is projected as null');
    assert.deepEqual([...host.control.querySelectorAll('input')].map(input=>input.value),['a','b']);
    f.app.data.setItem('lists.options',new Bag({a:null,c:null,d:null}));await settle();
    assert.equal(host.parameters.values,null);
    assert.deepEqual([...host.control.querySelectorAll('input')].map(input=>input.value),['a','c','d']);
});
