import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot,GramlotBuilder} from '../src/index.js';
import layout from '../src/components/layout.js';
import {layoutWindow} from './helpers/layout-window.js';
const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
function fixture(t,author,remote=async()=>new Bag()){
 const {window}=new JSDOM('<main id="gramlot-root"></main>',{url:'https://example.test/menu'});layoutWindow(window);
 const matches=window.Element.prototype.matches;
 window.Element.prototype.matches=function(s){return s===':popover-open'?this.hasAttribute('data-test-open'):matches.call(this,s);};
 window.HTMLElement.prototype.showPopover=function(){this.setAttribute('data-test-open','');};
 window.HTMLElement.prototype.hidePopover=function(){this.removeAttribute('data-test-open');};
 const app=new Gramlot({document:window.document,transport:false,collections:[layout]});
 const group=app.commands.registerGroup('documenti');group.register('save',{label:'Save',publish:'save'});group.register('toggle',{label:'Details',publish:'toggle'});group.register('toggleDetails',{label:'Details',publish:'toggleDetails'});
 const received=[];
 app.src.logicRegistry.register(class Logic {toggleDetails(node){node.SET('details',!node.GET('details'));} save(node,message){received.push(message);node.SET('received',message.parameters.id??0);}},{resource:'test:menu'});
 app.rpc.call=(kind,method,params)=>remote(method,params);
 const b=new GramlotBuilder(null,{collections:[layout]});
 if(typeof author === "function")author(b.root,app);
 app.src.startSource(typeof author === "string" ? author : b.toTytx());
 t.after(()=>{app.dispose();window.close();});
 const element=id=>window.document.getElementById(id);
 return {app,window,received,element,click(id,options={}){element(id).control.dispatchEvent(new window.MouseEvent('click',{bubbles:true,composed:true,...options}));}};
}
function frame(root){const frame=root.framePane({node_label:'frame'});frame.center.contentPane({frameTarget:true,node_label:'editor',selfsubscribe_save:'save'});return frame;}
test('frame regions are unique Source nodes; repeated command occurrences have independent messages',async t=>{
 const f=fixture(t,(root,app)=>{app.data.setItem('id',42);const shell=frame(root);assert.equal(shell.top,shell.top);
  const bar=shell.top.menu({presentation:'bar',id:'bar'});bar.menuline('documenti:save',{id:'save',parameters:{id:'^id'}});bar.spacer({size:12});bar.menuline('documenti:save',{id:'copy',caption:'Copy',parameters:{id:99}});
 });
 f.click('save',{shiftKey:true});f.click('copy');
 assert.equal(f.received.length,2);assert.equal(f.received[0].parameters.id,42);assert.equal(f.received[1].parameters.id,99);
 assert.notEqual(f.received[0].sender,f.received[1].sender);assert.equal(f.received[0].target,f.received[1].target);
 assert.deepEqual(Object.keys(f.received[0]),['sender','target','command','parameters','modifiers']);assert.equal(f.received[0].modifiers.shift,true);
 assert.equal(f.element('copy').control.textContent.includes('Copy'),true);
});
test('bound checked/disabled/hidden and unknown command never toggle or dispatch accidentally',t=>{
 const f=fixture(t,(root,app)=>{app.data.setItem('checked',true);const bar=frame(root).top.menu({presentation:'bar'});
 bar.menuline('documenti:save',{id:'save',checked:'^checked',disabled:'^locked',hidden:'^hidden'});bar.menuline('missing:save',{id:'unknown'});});
 assert.equal(f.element('save').control.getAttribute('aria-checked'),'true');f.click('unknown');assert.equal(f.received.length,0);
 f.app.data.setItem('locked',true);f.click('save');assert.equal(f.received.length,0);
 f.app.data.setItem('locked',false);f.app.data.setItem('hidden',true);f.click('save');assert.equal(f.received.length,0);
 f.app.data.setItem('hidden',false);f.click('save');assert.equal(f.received.length,1);assert.equal(f.app.data.getItem('checked'),true);
});
test('delay captures parameters before data changes and cancels when its target is removed',async t=>{
 const f=fixture(t,(root,app)=>{app.data.setItem('id',42);frame(root).top.menu({presentation:'bar'}).menuline('documenti:save',{id:'save',parameters:{id:'^id'},_delay:15});});
 f.click('save');f.app.data.setItem('id',99);await new Promise(r=>setTimeout(r,25));assert.equal(f.received[0].parameters.id,42);
 f.click('save');const frameNode=f.received[0].target.parentNode;frameNode.value.popNode('editor');await new Promise(r=>setTimeout(r,25));assert.equal(f.received.length,1);
});
test('toolbar resolver mounts, reuses cache, refreshes on bound arguments and preserves stable entries',async t=>{
 const calls=[];const f=fixture(t,(root,app)=>{app.data.setItem('id',1);frame(root).top.menu({presentation:'bar',id:'bar',resolver:'items',resolver_id:'^id',cacheTime:60});},async(method,params)=>{
  calls.push(params.id);const b=new Bag();b.setItem('save',null,{kind:'command',command:'documenti:save',caption:`Save ${params.id}`,checked:'^checked'});return b;});
 await settle();await settle();assert.deepEqual(calls,[1]);const item=f.element('bar').items[0];assert.ok(item);
 await f.element('bar').menuBinding.load();assert.deepEqual(calls,[1]);
 f.app.data.setItem('id',2);await settle();await settle();assert.deepEqual(calls,[1,2]);assert.equal(f.element('bar').items[0],item);
 f.app.data.setItem('checked',true);assert.equal(item.control.getAttribute('aria-checked'),'true');assert.deepEqual(calls,[1,2]);
});
test('popup resolver waits for opening and exposes error/retry and empty states',async t=>{
 let count=0;const f=fixture(t,root=>frame(root).top.dropDownButton('Actions',{id:'drop'}).menu({id:'menu',resolver:'items',cacheTime:0}),async()=>{count++;if(count===1)throw new Error('offline');return new Bag();});
 assert.equal(count,0);f.element('drop').openMenu();await settle();assert.equal(f.element('menu').status,'error');assert.equal(count,1);
 await f.element('menu').menuBinding.load(true);assert.equal(count,2);assert.equal(f.element('menu').status,'empty');
});

test('camel-case registered topic and checked binding update both presentations',t=>{
 const f=fixture(t,(root,app)=>{app.data.setItem('details',false);const fr=root.framePane();fr.center.contentPane({frameTarget:true,selfsubscribe_toggleDetails:'toggleDetails'});
 for(const id of ['a','b'])fr.top.menu({presentation:'bar'}).menuline('documenti:toggleDetails',{id,checked:'^details'});});
 f.click('a');assert.equal(f.app.data.getItem('details'),true);assert.equal(f.element('b').control.getAttribute('aria-checked'),'true');
});

test('nested Data initialized from Python-shaped mapping remains reactive',t=>{
 const f=fixture(t,root=>{root.dataSetter({value:{id:42,details:false},destination_path:'document'});const fr=root.framePane();fr.center.contentPane({frameTarget:true,selfsubscribe_toggleDetails:"this.SET('document.details',!this.GET('document.details'))"});
 fr.top.menu({presentation:'bar'}).menuline('documenti:toggleDetails',{id:'nested',checked:'^document.details'});});
 f.click('nested');assert.equal(f.app.data.getItem('document.details'),true);assert.equal(f.element('nested').control.getAttribute('aria-checked'),'true');
});


test('Python wire preserves checked and transformed hidden bindings',t=>{
 const wire=execFileSync(process.env.GRAMLOT_TEST_PYTHON??'python3',['-c',`
from gramlot import GramlotBuilder
import json
from importlib.resources import files
from genro_tytx import to_tytx
b=GramlotBuilder(collections=[json.loads(files('gramlot').joinpath('collections/layout.json').read_text())])
r=b.root
r.dataSetter("document",dict(details=False))
f=r.framePane()
f.center.contentPane(frameTarget=True,selfsubscribe_toggleDetails="this.SET('document.details',!this.GET('document.details'))").p("Details",hidden="^document.details:=!{}",id="detail")
f.top.menu(presentation="bar").menuline("documenti:toggleDetails",checked="^document.details",id="nested")
print(to_tytx(b.source))
`],{encoding:'utf8'}).trim();
 const f=fixture(t,wire);f.click('nested');assert.equal(f.app.data.getItem('document.details'),true);assert.equal(f.element('nested').control.getAttribute('aria-checked'),'true');assert.equal(f.element('detail').hidden,false);
});

test('a nested frame never borrows its outer recipient',t=>{
 const f=fixture(t,root=>{const outer=frame(root);outer.center.framePane().top.menu({presentation:'bar'}).menuline('documenti:save',{id:'save'});});
 f.click('save');assert.equal(f.received.length,0);
});
test('commands and submenu opening are mutually exclusive',t=>{
 assert.throws(()=>fixture(t,root=>frame(root).top.menu({presentation:'bar'}).menuline('documenti:save').menu()),/submenu cannot also execute/);
});
test('literal resolver captions never become pointers or expressions; invalid results do not partly replace entries',async t=>{
 let bad=false;
 const f=fixture(t,root=>frame(root).top.menu({presentation:'bar',id:'bar',resolver:'items',cacheTime:0}),async()=>{
  const bag=new Bag();bag.setItem('save',null,{kind:'command',command:'documenti:save',caption:'==globalThis.untrusted()'});
  if(bad)bag.setItem('invalid',null,{kind:'separator',caption:'not allowed'});return bag;
 });
 await settle();const menu=f.element('bar'),item=menu.items[0];assert.match(item.control.textContent,/==globalThis.untrusted/);
 bad=true;await menu.menuBinding.load(true);assert.equal(menu.status,'error');assert.equal(menu.items.length,1);assert.equal(menu.items[0],item);assert.equal(item.disabled,true);
});
test('keyboard skips separators and unavailable entries and relocates focus',async t=>{
 const f=fixture(t,(root,app)=>{app.data.setItem('hide',false);const bar=frame(root).top.menu({presentation:'bar',id:'bar'});
 bar.menuline('documenti:save',{id:'a'});bar.menuline('-');bar.menuline('documenti:save',{id:'disabled',disabled:true});bar.menuline('documenti:save',{id:'b',hidden:'^hide'});bar.menuline('documenti:save',{id:'c'});});
 f.element('a').focus();f.element('a').control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,composed:true}));
 assert.equal(f.window.document.activeElement,f.element('b'));
 f.app.data.setItem('hide',true);await settle();assert.equal(f.window.document.activeElement,f.element('c'));
 f.element('c').control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Home',bubbles:true,composed:true}));assert.equal(f.window.document.activeElement,f.element('a'));
});
test('an entry becoming hidden cancels delayed delivery even if it is shown again',async t=>{
 const f=fixture(t,root=>frame(root).top.menu({presentation:'bar'}).menuline('documenti:save',{id:'save',hidden:'^hidden',_delay:15}));
 f.click('save');f.app.data.setItem('hidden',true);f.app.data.setItem('hidden',false);await new Promise(r=>setTimeout(r,25));assert.equal(f.received.length,0);
});
test('a stale resolver result cannot overwrite a newer argument result',async t=>{
 const pending=[];const f=fixture(t,(root,app)=>{app.data.setItem('id',1);frame(root).top.menu({presentation:'bar',id:'bar',resolver:'items',resolver_id:'^id'});},(method,params)=>new Promise(resolve=>pending.push({id:params.id,resolve})));
 f.app.data.setItem('id',2);const bag=id=>{const b=new Bag();b.setItem('save',null,{kind:'command',command:'documenti:save',caption:`Save ${id}`});return b;};
 pending[0].resolve(bag(1));await settle();await settle();assert.equal(pending.at(-1).id,2);pending.at(-1).resolve(bag(2));await settle();await settle();assert.match(f.element('bar').items[0].control.textContent,/Save 2/);
});


test('an asynchronously populated popup focuses its first usable entry',async t=>{
 const f=fixture(t,root=>frame(root).top.dropDownButton('Actions',{id:'drop'}).menu({id:'menu',resolver:'items'}),async()=>{const b=new Bag();b.setItem('save',null,{kind:'command',command:'documenti:save'});return b;});
 f.element('drop').openMenu();await settle();await settle();assert.equal(f.window.document.activeElement,f.element('menu').items[0]);
});


test('frame side bars share a row; reactive contentPane flex projects to the slot container',t=>{
 const f=fixture(t,(root,app)=>{app.data.setItem('direction','row');app.data.setItem('display','flex');const fr=frame(root);
 fr.left.setAttr({id:'left'});fr.left.menu({presentation:'bar',orientation:'vertical'}).menuline('documenti:save');fr.left.menu({presentation:'bar',orientation:'vertical'}).menuline('documenti:save');
 fr.top.setAttr({id:'top'});fr.top.menu({presentation:'bar'}).menuline('documenti:save');fr.top.menu({presentation:'bar'}).menuline('documenti:save');
 fr.center.contentPane({id:'flex',display:'^display',flex_direction:'^direction',gap:'12px'}).input({value:'^text'});
 });
 assert.equal(f.element('left').control.style.display,'flex');assert.equal(f.element('left').control.style.flexDirection,'row');
 assert.equal(f.element('top').control.style.flexDirection,'column');
 const pane=f.element('flex'),child=pane.firstElementChild;
 assert.equal(pane.control.style.display,'flex');assert.equal(pane.control.style.gap,'12px');
 f.app.data.setItem('direction','column');assert.equal(pane.control.style.flexDirection,'column');assert.equal(pane.firstElementChild,child);
 f.app.data.setItem('display','block');assert.equal(pane.control.style.display,'');assert.equal(pane.control.style.flexDirection,'');assert.equal(pane.control.style.gap,'');
});


test('popup rows align check/icon/caption/arrow and cascade from a toolbar',async t=>{
 const f=fixture(t,root=>{const bar=frame(root).top.menu({presentation:'bar'});
 const menu=bar.menuline({caption:'Document',id:'opener'}).menu({id:'popup'});
 menu.menuline('documenti:save',{id:'save',checked:true});menu.menuline('-');
 menu.menuline({caption:'Export',id:'export'}).menu({id:'formats'}).menuline('documenti:save',{id:'pdf',caption:'PDF'});
 });
 f.element('opener').control.getBoundingClientRect=()=>({left:20,right:100,top:20,bottom:48});
 f.element('popup').getBoundingClientRect=()=>({width:250,height:100});
 f.element('export').control.getBoundingClientRect=()=>({left:26,right:264,top:100,bottom:128});
 f.element('formats').getBoundingClientRect=()=>({width:200,height:100});
 await settle();
 assert.ok(f.element('opener').submenu);assert.equal(f.element('opener').disabled,false);
 f.click('opener');await settle();
 assert.equal(f.element('popup').style.top,'51px');
 assert.equal(f.element('opener').control.classList.contains('menu-row'),false);
 assert.equal(f.element('save').control.classList.contains('menu-row'),true);
 assert.equal(f.element('save').control.querySelector('.menu-check').textContent,'✓');
 assert.equal(f.element('export').control.querySelector('.menu-arrow').textContent,'›');
 assert.equal(f.element('opener').control.querySelector('.menu-arrow').textContent,'▾');
 f.click('export');await settle();
 assert.equal(f.element('formats').slot,'menu');
 assert.equal(f.element('formats').style.left,'267px');assert.equal(f.element('formats').style.top,'100px');
 f.element('pdf').control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true,composed:true}));
 assert.equal(f.element('formats').opened,false);assert.equal(f.element('popup').opened,true);
 assert.equal(f.window.document.activeElement,f.element('export'));
 f.element('export').dispatchEvent(new f.window.Event('pointerenter'));
 await new Promise(r=>setTimeout(r,210));assert.equal(f.element('formats').opened,true);
 f.element('save').dispatchEvent(new f.window.Event('pointerenter'));
 await new Promise(r=>setTimeout(r,210));assert.equal(f.element('formats').opened,false);
});


test('attached menu uses contextual opening, pointer position, keyboard and cleanup',async t=>{
 let calls=0;
 const f=fixture(t,root=>{const area=frame(root).center.div({id:'area',tabindex:0,node_label:'area'});
 area.menu({id:'context',resolver:'items'});},async()=>{calls++;const bag=new Bag();bag.setItem('save',null,{kind:'command',command:'documenti:save'});return bag;});
 const area=f.element('area'),menu=f.element('context');
 assert.equal(menu.getAttribute('slot'),null);
 menu.getBoundingClientRect=()=>({width:200,height:100});
 area.getBoundingClientRect=()=>({left:10,top:20,right:310,bottom:220,width:300});
 area.click();assert.equal(menu.opened,false);assert.equal(calls,0);
 const event=new f.window.MouseEvent('contextmenu',{bubbles:true,cancelable:true,button:2,clientX:120,clientY:80});
 area.dispatchEvent(event);await settle();
 assert.equal(event.defaultPrevented,true);assert.equal(menu.opened,true);assert.equal(calls,1);
 assert.equal(menu.style.left,'120px');assert.equal(menu.style.top,'83px');
 menu.items[0].control.dispatchEvent(new f.window.MouseEvent('click',{bubbles:true,composed:true,shiftKey:true}));
 assert.equal(menu.opened,false);assert.equal(f.received.length,1);assert.equal(f.received[0].modifiers.shift,true);
 area.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'F10',shiftKey:true,bubbles:true,cancelable:true}));
 assert.equal(menu.opened,true);assert.equal(menu.style.left,'18px');
 area.dispatchEvent(new f.window.MouseEvent('pointerdown',{bubbles:true}));assert.equal(menu.opened,false);
 const source=f.app.src.source.getNode('main.frame.center.area');assert.ok(source);
 source.parentBag.popNode('area');
 area.dispatchEvent(new f.window.MouseEvent('contextmenu',{bubbles:true,button:2}));assert.equal(menu.opened,false);
});

test('opening modifiers match exactly; star means ordinary click with no modifiers',t=>{
 const f=fixture(t,root=>{const center=frame(root).center;
 for(const [id,modifiers] of [['ordinary','*'],['modified','Shift,Ctrl']])center.div({id}).menu({id:id+'menu',modifiers}).menuline('documenti:save');});
 const click=(id,mods={})=>{const e=new f.window.MouseEvent('click',{bubbles:true,cancelable:true,...mods});f.element(id).dispatchEvent(e);return e;};
 assert.equal(click('ordinary',{shiftKey:true}).defaultPrevented,false);assert.equal(f.element('ordinarymenu').opened,false);
 assert.equal(click('ordinary').defaultPrevented,true);assert.equal(f.element('ordinarymenu').opened,true);
 f.element('ordinarymenu').close();
 click('modified',{shiftKey:true});assert.equal(f.element('modifiedmenu').opened,false);
 click('modified',{shiftKey:true,ctrlKey:true,altKey:true});assert.equal(f.element('modifiedmenu').opened,false);
 click('modified',{shiftKey:true,ctrlKey:true});assert.equal(f.element('modifiedmenu').opened,true);
 assert.throws(()=>f.element('modifiedmenu').projectAttributes({modifiers:'Anything'}),/Menu modifiers/);
});

test('vertical bar submenus open to the side while horizontal bar submenus open below',t=>{
 const f=fixture(t,root=>{const bar=frame(root).top.menu({presentation:'bar',orientation:'vertical'});
 bar.menuline({caption:'Export',id:'vertical'}).menu({id:'branch'}).menuline('documenti:save');});
 f.element('vertical').control.getBoundingClientRect=()=>({left:20,right:180,top:40,bottom:68});
 f.element('branch').getBoundingClientRect=()=>({width:200,height:80});
 f.click('vertical');assert.equal(f.element('branch').style.left,'183px');assert.equal(f.element('branch').style.top,'40px');
 assert.equal(f.element('vertical').control.querySelector('.menu-arrow').textContent,'›');
});

test('toolbar overflow respects priority, end-first ties and indivisible groups without moving Source',t=>{
 const f=fixture(t,root=>{const bar=frame(root).top.menu({presentation:'bar',id:'bar'});
 bar.menuline('documenti:save',{id:'important',priority:20});
 bar.menuline('documenti:save',{id:'early',priority:0});
 const group=bar.menuline({group:true,id:'group',priority:10});
 group.menuline('documenti:save',{id:'group-a'});group.menuline('documenti:save',{id:'group-b'});
 bar.menuline('documenti:save',{id:'late',priority:0});
 bar.menuline('documenti:save',{id:'retained',overflowable:false});});
 const bar=f.element('bar'),group=f.element('group');let width=550;
 Object.defineProperty(bar,'clientWidth',{get:()=>width});
 bar.shadowRoot.querySelector('.toolbar-viewport').style.gap='0px';
 for(const [id,size] of Object.entries({important:100,early:100,group:180,late:100,retained:90}))f.element(id).getBoundingClientRect=()=>({width:size,height:30});
 group.getBoundingClientRect=()=>({width:group.hasAttribute('data-menu-group-rows')?60:180,height:30});
 const nodes=[...bar.children],groupChildren=[...group.children];
 bar.overflow.layout();
 assert.deepEqual(nodes.filter(n=>n.slot==='overflow').map(n=>n.id),['late']);
 assert.equal(bar.overflow.button.title,'More commands');
 assert.equal(bar.overflow.button.getAttribute('aria-label'),'More commands');
 assert.equal(bar.overflow.button.querySelector('svg').getAttribute('aria-hidden'),'true');
 width=450;bar.overflow.layout();
 assert.deepEqual(nodes.filter(n=>n.slot==='overflow').map(n=>n.id),['early','late']);
 width=330;bar.overflow.layout();
 assert.deepEqual(nodes.filter(n=>n.slot==='overflow').map(n=>n.id),['early','group','late']);
 bar.overflow.layout();assert.deepEqual(nodes.filter(n=>n.slot==='overflow').map(n=>n.id),['early','group','late']);
 assert.deepEqual([...bar.children],nodes);assert.deepEqual([...group.children],groupChildren);
 bar.overflow.open();assert.equal(group.hasAttribute('data-menu-group-rows'),true);f.click('group-b');assert.equal(f.received.length,1);assert.equal(bar.overflow.opened,false);
 assert.equal(f.received[0].sender.parentNode.getAttr('id'),'group');
 width=700;bar.overflow.layout();assert.ok(nodes.every(n=>n.slot===''));assert.equal(bar.overflow.button.hidden,true);
});

test('overflow keeps a focused input, its live binding and identity through exit and return',t=>{
 const f=fixture(t,root=>{const bar=frame(root).top.menu({presentation:'bar',id:'bar'});
 bar.menuline('documenti:save',{id:'keep',overflowable:false});
 bar.menuline({group:true,id:'search-group'}).input({id:'search',value:'^query',live:true});});
 const bar=f.element('bar'),input=f.element('search'),group=f.element('search-group');let width=400;
 Object.defineProperty(bar,'clientWidth',{get:()=>width});
 bar.shadowRoot.querySelector('.toolbar-viewport').style.gap='0px';
 f.element('keep').getBoundingClientRect=()=>({width:100,height:30});group.getBoundingClientRect=()=>({width:220,height:30});
 bar.overflow.layout();input.focus();input.value='invoice';input.dispatchEvent(new f.window.Event('input',{bubbles:true}));
 assert.equal(f.app.data.getItem('query'),'invoice');
 width=180;bar.overflow.layout();
 assert.equal(group.slot,'overflow');assert.equal(bar.overflow.opened,true);assert.equal(f.window.document.activeElement,input);
 assert.equal(input.value,'invoice');assert.equal(f.element('search'),input);
 input.value='updated';input.dispatchEvent(new f.window.Event('input',{bubbles:true}));assert.equal(f.app.data.getItem('query'),'updated');
 width=400;bar.overflow.layout();assert.equal(group.slot,'');assert.equal(bar.overflow.opened,false);assert.equal(f.window.document.activeElement,input);
 assert.equal(input.value,'updated');assert.equal(bar.overflow.button.hidden,true);
});

test('retained units never overflow; elastic space is consumed before migration and vertical sizing uses height',t=>{
 const f=fixture(t,root=>{const bar=frame(root).top.menu({presentation:'bar',orientation:'vertical',id:'bar'});
 bar.menuline('documenti:save',{id:'keep',overflowable:false});bar.spacer({flex:1,id:'space'});
 bar.menuline('documenti:save',{id:'eligible'});});
 const bar=f.element('bar');let height=100;
 Object.defineProperty(bar,'clientHeight',{get:()=>height});bar.shadowRoot.querySelector('.toolbar-viewport').style.gap='0px';
 for(const id of ['keep','eligible'])f.element(id).getBoundingClientRect=()=>({height:40,width:100});
 f.element('space').getBoundingClientRect=()=>({height:500,width:100});
 bar.overflow.layout();assert.equal(bar.overflow.button.hidden,true);
 height=60;bar.overflow.layout();assert.ok(bar.overflow.button.querySelector('svg'));assert.equal(bar.overflow.button.title,'More commands');assert.equal(f.element('eligible').slot,'overflow');assert.equal(f.element('keep').slot,'');assert.equal(f.element('space').slot,'');
 height=20;bar.overflow.layout();assert.equal(f.element('keep').slot,'');
});

test('overflow keyboard navigation traverses grouped commands and opens their submenu sideways',t=>{
 const f=fixture(t,root=>{const bar=frame(root).top.menu({presentation:'bar',id:'bar'});
 const g=bar.menuline({group:true,id:'group'});g.menuline('documenti:save',{id:'first'});
 g.menuline({caption:'Export',id:'export'}).menu({id:'popup'}).menuline('documenti:save',{id:'pdf'});});
 const bar=f.element('bar');Object.defineProperty(bar,'clientWidth',{value:60});f.element('group').getBoundingClientRect=()=>({width:250,height:30});
 bar.overflow.layout();bar.overflow.open();assert.equal(f.window.document.activeElement,f.element('first'));
 f.element('first').control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,composed:true}));assert.equal(f.window.document.activeElement,f.element('export'));
 f.element('export').control.getBoundingClientRect=()=>({left:30,right:230,top:60,bottom:90});f.element('popup').getBoundingClientRect=()=>({width:180,height:100});
 f.element('export').control.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,composed:true}));
 assert.equal(f.element('popup').opened,true);assert.equal(f.element('popup').style.left,'233px');
 f.click('pdf');assert.equal(f.received.length,1);assert.equal(bar.overflow.opened,false);assert.equal(f.element('popup').opened,false);
});

test('group command ambiguity is rejected and overflow cleanup removes observers and popovers',t=>{
 assert.throws(()=>fixture(t,root=>frame(root).top.menu({presentation:'bar'}).menuline('documenti:save',{group:true})),/group cannot execute/);
 const f=fixture(t,root=>frame(root).top.menu({presentation:'bar',id:'bar'}).menuline('documenti:save',{id:'save'}));
 const bar=f.element('bar');Object.defineProperty(bar,'clientWidth',{value:30});f.element('save').getBoundingClientRect=()=>({width:100,height:30});
 bar.overflow.layout();bar.overflow.open();const panel=bar.overflow.panel;
 bar.remove();assert.equal(panel.hasAttribute('data-test-open'),false);assert.equal(bar.overflow.opened,false);
});

test('overflow suppresses orphan separators and restores declaration order on return',t=>{
 const f=fixture(t,root=>{const bar=frame(root).top.menu({presentation:'bar',id:'bar'});
 bar.menuline('-',{id:'leading'});bar.menuline('documenti:save',{id:'first',overflowable:false});bar.menuline('-',{id:'divider'});
 bar.menuline('documenti:save',{id:'second'});bar.menuline('-',{id:'trailing'});});
 const bar=f.element('bar');let width=150;Object.defineProperty(bar,'clientWidth',{get:()=>width});
 for(const id of ['first','second'])f.element(id).getBoundingClientRect=()=>({width:100,height:30});
 for(const id of ['leading','divider','trailing'])f.element(id).getBoundingClientRect=()=>({width:5,height:30});
 bar.overflow.layout();assert.equal(f.element('second').slot,'overflow');
 for(const id of ['leading','divider','trailing'])assert.equal(f.element(id).slot,'suppressed');
 width=500;bar.overflow.layout();assert.equal(f.element('divider').slot,'');assert.equal(f.element('leading').slot,'suppressed');assert.equal(bar.overflow.button.hidden,true);
});

test('opening an input-only overflow focuses the input and hidden groups leave no overflow button',async t=>{
 const f=fixture(t,root=>{const bar=frame(root).top.menu({presentation:'bar',id:'bar'});
 bar.menuline({group:true,id:'group',hidden:'^hide'}).input({id:'field',value:'^query',live:true});});
 const bar=f.element('bar');Object.defineProperty(bar,'clientWidth',{value:80});f.element('group').getBoundingClientRect=()=>({width:220,height:30});
 bar.overflow.layout();bar.overflow.open();assert.equal(f.window.document.activeElement,f.element('field'));
 f.app.data.setItem('hide',true);bar.overflow.layout();assert.equal(bar.overflow.opened,false);assert.equal(bar.overflow.button.hidden,true);
});

test('toolbar label modes preserve captions, tooltip names and command identity through overflow and return',t=>{
 const f=fixture(t,root=>{const fr=frame(root);
 for(const mode of ['beside','below','tooltip']){
  const bar=fr.top.menu({presentation:'bar',labelPosition:mode,iconSize:28,id:`bar-${mode}`});
  bar.menuline('documenti:save',{icon:'▣',id:`save-${mode}`});
 }});
 for(const mode of ['beside','below','tooltip']){
  const bar=f.element(`bar-${mode}`),item=f.element(`save-${mode}`);let width=200;
  Object.defineProperty(bar,'clientWidth',{get:()=>width});item.getBoundingClientRect=()=>({width:100,height:60});
  bar.overflow.layout();
  assert.equal(item.control.classList.contains('toolbar-button'),true);
  assert.equal(item.control.classList.contains('toolbar-below'),mode==='below');
  assert.equal(item.control.classList.contains('toolbar-tooltip'),mode==='tooltip');
  assert.equal(item.control.style.getPropertyValue('--gramlot-toolbar-icon-size'),'28px');
  assert.equal(item.control.getAttribute('aria-label'),'Save');assert.equal(item.control.title,'Save');
  const caption=item.control.querySelector('.menu-caption');assert.equal(caption.textContent,'Save');
  width=60;bar.overflow.layout();bar.overflow.open();
  assert.equal(item.control.classList.contains('menu-row'),true);assert.equal(item.control.classList.contains('toolbar-button'),false);
  assert.equal(item.control.classList.contains('toolbar-tooltip'),false);assert.equal(item.control.classList.contains('toolbar-below'),false);
  assert.equal(item.control.style.getPropertyValue('--gramlot-toolbar-icon-size'),'');assert.equal(caption.textContent,'Save');
  f.click(`save-${mode}`);assert.equal(f.received.at(-1).command,'documenti:save');
  width=200;bar.overflow.layout();assert.equal(item.control.classList.contains('toolbar-tooltip'),mode==='tooltip');
  assert.equal(item.control.classList.contains('toolbar-below'),mode==='below');assert.equal(item.control.querySelector('.menu-caption'),caption);
 }
});

test('toolbar style inherits through groups, supports occurrence overrides and updates reactively',async t=>{
 const f=fixture(t,(root,app)=>{app.data.setItem('mode','below');app.data.setItem('size',32);
 const bar=frame(root).top.menu({presentation:'bar',orientation:'vertical',labelPosition:'tooltip',iconSize:24,id:'styles'});
 const group=bar.menuline({group:true,labelPosition:'^mode',iconSize:'^size'});
 group.menuline('documenti:save',{id:'inherited'});
 group.menuline('documenti:save',{id:'override',labelPosition:'beside',iconSize:36,tooltip:'Save this document'});
 });
 const inherited=f.element('inherited'),override=f.element('override');
 f.element('styles').refreshItems();
 assert.equal(inherited.control.classList.contains('toolbar-below'),true);
 assert.equal(inherited.control.style.getPropertyValue('--gramlot-toolbar-icon-size'),'32px');
 assert.equal(override.control.classList.contains('toolbar-tooltip'),false);assert.equal(override.control.classList.contains('toolbar-below'),false);
 assert.equal(override.control.style.getPropertyValue('--gramlot-toolbar-icon-size'),'36px');assert.equal(override.control.title,'Save this document');
 f.app.data.setItem('mode','tooltip');f.app.data.setItem('size',30);await settle();
 f.element('styles').refreshItems();assert.equal(inherited.control.classList.contains('toolbar-tooltip'),true);
 assert.equal(inherited.control.style.getPropertyValue('--gramlot-toolbar-icon-size'),'30px');
 assert.equal(override.control.style.getPropertyValue('--gramlot-toolbar-icon-size'),'36px');
});


test('SVG icons use image nodes, occurrence overrides and live image/text transitions',t=>{
 const f=fixture(t,(root,app)=>{
  app.commands.registerGroup('graphics').register('save',{label:'Save',publish:'save',iconSrc:'/icons/save.svg'});
  app.data.setItem('image','/icons/custom.svg');
  const bar=frame(root).top.menu({presentation:'bar',id:'svg-bar',labelPosition:'tooltip'});
  bar.menuline('graphics:save',{id:'registered-svg'});
  bar.menuline('graphics:save',{id:'emoji-override',icon:'💾'});
  bar.menuline('graphics:save',{id:'bound-svg',icon:'📂',iconSrc:'^image',checked:true});
  root.button({id:'image-button',iconSrc:'^image',icon:'📂'});
 });
 assert.equal(f.element('registered-svg').icon.querySelector('img').getAttribute('src'),'/icons/save.svg');
 assert.equal(f.element('emoji-override').icon.textContent,'💾');
 assert.equal(f.element('emoji-override').icon.querySelector('img'),null);
 for(const id of ['bound-svg','image-button']){
  const image=f.element(id).icon.querySelector('img');
  assert.equal(image.getAttribute('src'),'/icons/custom.svg');assert.equal(image.alt,'');
  assert.equal(f.element(id).icon.querySelector('svg'),null);
 }
 const bar=f.element('svg-bar'),item=f.element('bound-svg');
 Object.defineProperty(bar,'clientWidth',{value:60});
 for(const child of bar.children)child.getBoundingClientRect=()=>({width:48,height:40});
 bar.overflow.layout();assert.equal(item.slot,'overflow');
 assert.ok(item.control.classList.contains('menu-row'));assert.equal(item.control.getAttribute('aria-checked'),'true');
 assert.equal(item.icon.querySelector('img').getAttribute('src'),'/icons/custom.svg');
 f.app.data.setItem('image','');
 assert.equal(item.icon.textContent,'📂');assert.equal(f.element('image-button').icon.textContent,'📂');
 f.app.data.setItem('image','/icons/next.svg');
 assert.equal(item.icon.querySelector('img').getAttribute('src'),'/icons/next.svg');
});

test('Escape in a permanent bar without an open popup reaches the containing window',t=>{
 const f=fixture(t,root=>frame(root).top.menu({presentation:'bar'}).menuline('documenti:save',{id:'save'}));
 const event=new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true,cancelable:true});
 let reached=false;f.window.document.addEventListener('keydown',()=>reached=true,{once:true});
 f.element('save').control.dispatchEvent(event);assert.equal(event.defaultPrevented,false);assert.equal(reached,true);
});
