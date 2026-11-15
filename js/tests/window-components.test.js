import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot,GramlotBuilder} from '../src/index.js';
import layout from '../src/components/layout.js';
import {layoutWindow} from './helpers/layout-window.js';
const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
async function fixture(t,author,logic=class {}) {
 const {window}=new JSDOM('<main id="gramlot-root"></main>',{url:'https://example.test/'});layoutWindow(window);
 Object.defineProperty(window.document.documentElement,'clientWidth',{value:1024,configurable:true});
 Object.defineProperty(window.document.documentElement,'clientHeight',{value:768,configurable:true});
 window.HTMLDialogElement.prototype.showModal=function(){this.open=true;this.dataset.modal='true';};
 window.HTMLDialogElement.prototype.show=function(){this.open=true;};
 window.HTMLDialogElement.prototype.close=function(){this.open=false;};
 const app=new Gramlot({document:window.document,transport:false,collections:[layout]});
 app.src.logicRegistry.register(logic,{resource:'test:windows'});
 const b=new GramlotBuilder(null,{collections:[layout]});author(b.root,app);
 app.src.startSource(b.toTytx());await settle();
 t.after(()=>{app.dispose();window.close();});
 return {app,window,element:id=>window.document.getElementById(id)};
}
test('Labelbox around the frame preserves window content and binding across reopen',async t=>{
 const f=await fixture(t,(root,app)=>{
  app.data.setItem('open',true);app.data.setItem('label','Document');
  const frame=root.floatingPane({id:'float',open:'^open'}).frame;
  sourceTarget(frame).setAttr({lbl:'^label'});
  frame.center.input({id:'draft',value:'^draft'});
 });
 const win=f.element('float'),input=f.element('draft'),presentation=win.firstElementChild;
 const frame=presentation.labelbox.controlBox.firstElementChild;
 assert.equal(frame.localName,'gramlot-frame-pane');assert.equal(win.opened,true);
 f.app.data.setItem('draft','Retained');f.app.data.setItem('label','Changed');
 f.app.data.setItem('open',false);await settle();f.app.data.setItem('open',true);await settle();
 assert.equal(win.firstElementChild,presentation);assert.equal(f.element('draft'),input);
 assert.equal(input.value,'Retained');assert.equal(presentation.labelbox.fieldLabel.textContent,'Changed');
});
test('window grammar and real frame helpers keep native dialog separate',async t=>{
 const b=new GramlotBuilder(null,{collections:[layout]});const w=b.root.dialog();
 assert.equal(w.frame,w.frame);assert.equal(sourceTarget(w).value.getNodes().length,1);
 assert.equal(w.frame.top, w.frame.top);
 const f=await fixture(t,root=>{root.dialog({id:'modal'}).frame.center.input({id:'draft',value:'^draft'});root.floatingPane({id:'float'}).frame.center.div('Tools');root.html_dialog({id:'native'});});
 for(const id of ['modal','float']){assert.equal(f.element(id).parameters.maximizable,false);assert.equal(f.element(id).maximizeButton.hidden,true);}
 assert.equal(f.element('modal').localName,'gramlot-dialog');assert.equal(f.element('native').localName,'dialog');
 for(const prop of ['movable','resizable','collapsible']) {assert.equal(f.element('modal').parameters[prop],false);assert.equal(f.element('float').parameters[prop],true);}
});
test('bound open/collapse retain content and modal session; disabling collapse restores',async t=>{
 const f=await fixture(t,(root,app)=>{app.data.setItem('open',true);root.dialog({id:'modal',open:'^open',collapsible:'^canCollapse',collapsed:'^collapsed'}).frame.center.input({id:'draft',value:'^draft'});});
 const w=f.element('modal'),input=f.element('draft');assert.equal(w.shell.dataset.modal,'true');
 f.app.data.setItem('canCollapse',true);await settle();w.collapseButton.click();await settle();
 assert.equal(f.app.data.getItem('collapsed'),true);assert.equal(w.shell.open,true);assert.equal(w.body.hidden,true);
 f.app.data.setItem('canCollapse',false);await settle();assert.equal(w.body.hidden,false);assert.equal(f.app.data.getItem('collapsed'),false);
 f.app.data.setItem('draft','retained');f.app.data.setItem('open',false);await settle();assert.equal(w.shell.open,false);
 f.app.data.setItem('open',true);await settle();assert.equal(f.element('draft'),input);assert.equal(input.value,'retained');
 w.closeButton.click();await settle();assert.equal(f.app.data.getItem('open'),false);
});
test('async close guard deduplicates requests, vetoes and ignores completion after state close',async t=>{
 let resolve,calls=0;
 const f=await fixture(t,(root,app)=>{app.data.setItem('open',true);root.dialog({id:'modal',open:'^open',beforeClose:'guard'}).frame.center.div('Guard');},class {guard(){calls++;return new Promise(r=>resolve=r);}});
 const w=f.element('modal');const one=w.requestClose('close');w.requestClose('escape');await settle();assert.equal(calls,1);assert.equal(w.shell.getAttribute('aria-busy'),'true');
 resolve(false);assert.equal(await one,false);assert.equal(w.opened,true);
 const stale=w.requestClose();await settle();f.app.data.setItem('open',false);await settle();f.app.data.setItem('open',true);await settle();resolve(true);assert.equal(await stale,false);assert.equal(w.opened,true);
 const accepted=w.requestClose();await settle();resolve(true);assert.equal(await accepted,true);assert.equal(f.app.data.getItem('open'),false);
});
test('native Escape obeys closable; disposal invalidates an outstanding guard',async t=>{
 let resolve;
 const f=await fixture(t,root=>root.dialog({id:'modal',open:true,closable:false,beforeClose:'guard'}).frame.center.div('Guard'),class {guard(){return new Promise(r=>resolve=r);}});
 const w=f.element('modal');w.shell.dispatchEvent(new f.window.Event('cancel',{cancelable:true}));await settle();assert.equal(w.opened,true);assert.equal(resolve,undefined);
 const pending=w.requestClose();await settle();f.app.dispose();resolve(true);assert.equal(await pending,false);assert.equal(w.shell.open,false);
});
test('window Source requestClose uses the same guard path',async t=>{
 const f=await fixture(t,root=>root.floatingPane({id:'float',nodeId:'floating',open:true,beforeClose:'guard'}).frame.center.div('Tools'),class {guard(){return false;}});
 const node=f.app.src.binding.nodeIds.get('floating');assert.equal(await node.requestClose(),false);assert.equal(f.element('float').opened,true);
});

test('keyboard geometry commits bound values and reopening restores the expanded rectangle',async t=>{
 const f=await fixture(t,root=>root.floatingPane({id:'float',open:'^open',width:'^width',height:'^height',left:'^left',top:'^top',collapsed:'^collapsed'}).frame.center.div('Tools'));
 const w=f.element('float');
 w.shell.getBoundingClientRect=()=>{const s=w.shell.style;return {left:parseFloat(s.left)||0,top:parseFloat(s.top)||0,width:parseFloat(s.width)||360,height:parseFloat(s.height)||240};};
 w.titlebar.getBoundingClientRect=()=>({height:36});
 f.app.data.setItem('open',true);await settle();
 const left=parseFloat(w.shell.style.left),height=parseFloat(w.shell.style.height);
 w.titlebar.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await settle();assert.equal(f.app.data.getItem('left'),`${left+10}px`);
 w.resizeButton.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));await settle();assert.equal(f.app.data.getItem('height'),`${height+10}px`);
 w.collapseButton.click();await settle();assert.equal(w.body.hidden,true);
 f.app.data.setItem('open',false);await settle();f.app.data.setItem('open',true);await settle();assert.equal(w.body.hidden,true);
 w.collapseButton.click();await settle();assert.equal(w.shell.style.height,`${height+10}px`);assert.equal(w.shell.style.left,`${left+10}px`);
});
test('invalid close guard result stays open and reports a diagnostic',async t=>{
 const f=await fixture(t,root=>root.dialog({id:'modal',open:true,beforeClose:'badGuard'}).frame.center.div('Guard'),class {badGuard(){return 'yes';}});
 const errors=[];f.window.console.error=error=>errors.push(error);
 const w=f.element('modal');assert.equal(await w.requestClose(),false);assert.equal(w.opened,true);assert.equal(w.status.hidden,false);assert.match(errors[0].message,/boolean/);
});

test('pointer cancellation restores position and literal sizes retain user resize across reopen',async t=>{
 const f=await fixture(t,root=>root.floatingPane({id:'float',open:'^open',width:'360px',height:'240px'}).frame.center.div('Tools'));
 const w=f.element('float');
 w.shell.getBoundingClientRect=()=>{const s=w.shell.style;return {left:parseFloat(s.left)||0,top:parseFloat(s.top)||0,width:parseFloat(s.width)||360,height:parseFloat(s.height)||240};};
 const send=(handle,type,x,y)=>{
  const e=new f.window.MouseEvent(type,{bubbles:true,clientX:x,clientY:y,button:0});Object.defineProperty(e,'pointerId',{value:1});handle.dispatchEvent(e);
 };
 for(const handle of [w.titlebar,w.resizeButton]){let capture=false;handle.setPointerCapture=()=>capture=true;handle.hasPointerCapture=()=>capture;handle.releasePointerCapture=()=>capture=false;}
 f.app.data.setItem('open',true);await settle();const original=w.shell.style.left;
 send(w.titlebar,'pointerdown',0,0);send(w.titlebar,'pointermove',30,20);assert.notEqual(w.shell.style.left,original);
 send(w.titlebar,'pointercancel',30,20);assert.equal(w.shell.style.left,original);
 send(w.resizeButton,'pointerdown',0,0);send(w.resizeButton,'pointermove',40,30);send(w.resizeButton,'pointerup',40,30);
 assert.equal(w.shell.style.width,'400px');assert.equal(w.shell.style.height,'270px');
 f.app.data.setItem('open',false);await settle();f.app.data.setItem('open',true);await settle();
 assert.equal(w.shell.style.width,'400px');assert.equal(w.shell.style.height,'270px');
});

for(const tag of ['dialog','floatingPane'])test(`${tag}: maximize retains normal geometry, modality and content through collapse/reopen`,async t=>{
 const f=await fixture(t,(root,app)=>{
  app.data.setItem('width','360px');app.data.setItem('height','240px');app.data.setItem('left','60px');app.data.setItem('top','80px');
  app.data.setItem('canMaximize',true);
  root[tag]({id:'window',open:'^open',maximizable:'^canMaximize',maximized:'^maximized',collapsible:true,collapsed:'^collapsed',movable:true,resizable:true,
   width:'^width',height:'^height',left:'^left',top:'^top'}).frame.center.input({id:'retained',value:'^draft'});
 });
 const w=f.element('window'),input=f.element('retained');
 w.shell.getBoundingClientRect=()=>Object.fromEntries(['left','top','width','height'].map(k=>[k,parseFloat(w.shell.style[k])||0]));
 w.titlebar.getBoundingClientRect=()=>({height:36});
 let opens=0,closes=0;
 const show=tag==='dialog'?'showModal':'show',original=w.shell[show];
 w.shell[show]=function(){opens++;original.call(this);};
 const close=w.shell.close;w.shell.close=function(){closes++;close.call(this);};
 f.app.data.setItem('open',true);await settle();
 const normal=w.shell.getBoundingClientRect();
 f.app.data.setItem('draft','Keep this draft');
 w.maximizeButton.click();await settle();
 assert.equal(f.app.data.getItem('maximized'),true);
 assert.deepEqual(w.shell.getBoundingClientRect(),{left:0,top:0,width:1024,height:768});
 assert.equal(w.shell.dataset.modal,tag==='dialog'?'true':undefined);
 assert.equal(w.resizeButton.hidden,true);assert.equal(w.titlebar.tabIndex,-1);
 for(const handle of [w.titlebar,w.resizeButton]){
  handle.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  handle.setPointerCapture=()=>assert.fail('maximized gestures must not capture pointers');
  handle.dispatchEvent(new f.window.MouseEvent('pointerdown',{button:0,bubbles:true}));
 }
 assert.equal(w.shell.style.width,'1024px');assert.equal(f.app.data.getItem('width'),'360px');
 w.collapseButton.click();await settle();assert.equal(w.body.hidden,true);assert.equal(w.shell.style.height,'38px');
 assert.equal(f.app.data.getItem('maximized'),true);assert.equal(opens,1);assert.equal(closes,0);
 Object.defineProperty(f.window.document.documentElement,'clientWidth',{value:900,configurable:true});
 Object.defineProperty(f.window.document.documentElement,'clientHeight',{value:600,configurable:true});
 f.window.dispatchEvent(new f.window.Event('resize'));
 assert.equal(w.shell.style.width,'900px');assert.equal(w.shell.style.height,'38px');
 w.collapseButton.click();await settle();assert.equal(w.shell.style.height,'600px');
 w.maximizeButton.click();await settle();assert.deepEqual(w.shell.getBoundingClientRect(),normal);
 assert.equal(w.resizeButton.hidden,false);assert.equal(w.titlebar.tabIndex,0);
 f.app.data.setItem('maximized',true);await settle();
 f.app.data.setItem('open',false);await settle();f.app.data.setItem('open',true);await settle();
 assert.equal(w.shell.style.width,'900px');assert.equal(f.element('retained'),input);assert.equal(input.value,'Keep this draft');
 // Disabling the capability also restores the normal rectangle and bound state.
 f.app.data.setItem('canMaximize',false);await settle();
 assert.equal(f.app.data.getItem('maximized'),false);assert.equal(w.maximizeButton.hidden,true);
 assert.deepEqual(w.shell.getBoundingClientRect(),normal);
});

test('maximize while collapsed and geometry bindings updated while maximized preserve the restore rectangle',async t=>{
 const f=await fixture(t,root=>root.dialog({id:'window',open:'^open',maximizable:true,maximized:'^maximized',collapsible:true,collapsed:'^collapsed',width:'^width',height:'240px',left:'60px',top:'80px'}).frame.center.div('Content'));
 const w=f.element('window');
 w.shell.getBoundingClientRect=()=>Object.fromEntries(['left','top','width','height'].map(k=>[k,parseFloat(w.shell.style[k])||0]));
 w.titlebar.getBoundingClientRect=()=>({height:36});
 f.app.data.setItem('width','360px');f.app.data.setItem('open',true);await settle();
 w.collapseButton.click();w.maximizeButton.click();await settle();
 assert.equal(w.body.hidden,true);assert.equal(w.shell.style.width,'1024px');
 f.app.data.setItem('width','420px');await settle();assert.equal(w.shell.style.width,'1024px');
 w.maximizeButton.click();await settle();assert.equal(w.shell.style.width,'420px');assert.equal(w.body.hidden,true);
 w.collapseButton.click();await settle();assert.equal(w.shell.style.height,'240px');
 // Restoring after a viewport shrink must leave the window reachable.
 w.maximizeButton.click();await settle();
 Object.defineProperty(f.window.document.documentElement,'clientWidth',{value:300,configurable:true});
 f.window.dispatchEvent(new f.window.Event('resize'));assert.equal(w.shell.style.width,'300px');
 w.maximizeButton.click();await settle();assert.equal(w.shell.style.width,'284px');assert.equal(w.shell.style.left,'8px');
});


test('floating windows stay above layout chrome when opened and raised', async t=>{
 const f=await fixture(t,root=>{
  const border=root.borderContainer({id:'layout',height:'400px'});
  border.contentPane({region:'left',width:'180px',splitter:true,drawer:true}).div('Navigation');
  border.contentPane({region:'center'}).div('Page');
  root.floatingPane({id:'first',open:true}).frame.center.input({id:'retained',value:'^draft'});
  root.floatingPane({id:'second',open:true}).frame.center.div('Second');
 });
 const first=f.element('first'),second=f.element('second');
 const chrome=[...f.element('layout').shadowRoot.querySelectorAll('.separator,.drawer,.drag-cover')];
 const chromeLevel=Math.max(...chrome.map(el=>Number(f.window.getComputedStyle(el).zIndex)||0));
 assert.ok(Number(first.shell.style.zIndex)>chromeLevel);
 assert.ok(Number(second.shell.style.zIndex)>Number(first.shell.style.zIndex));
 const input=f.element('retained');f.app.data.setItem('draft','Still here');
 first.shell.dispatchEvent(new f.window.Event('pointerdown',{bubbles:true}));
 assert.ok(Number(first.shell.style.zIndex)>Number(second.shell.style.zIndex));
 assert.ok(Number(second.shell.style.zIndex)>chromeLevel);
 assert.equal(f.element('retained'),input);assert.equal(input.value,'Still here');
 assert.equal(first.shell.dataset.modal,undefined);
});

test('docking a floatingPane retains its content, geometry and collapsed state',async t=>{
 const f=await fixture(t,(root,app)=>{
  app.data.setItem('open',true);app.data.setItem('docked',false);app.data.setItem('draft','Before');
  root.floatingPane({id:'float',open:'^open',docked:'^docked',collapsed:'^collapsed',width:'360px',height:'240px',left:'60px',top:'80px'}).frame.center.input({id:'draft',value:'^draft'});
 });
 const w=f.element('float'),input=f.element('draft');
 w.shell.getBoundingClientRect=()=>Object.fromEntries(['left','top','width','height'].map(k=>[k,parseFloat(w.shell.style[k])||0]));
 w.titlebar.getBoundingClientRect=()=>({height:36});
 const before=w.shell.style.cssText, geometry=['left','top','width','height'].map(k=>w.shell.style[k]);
 f.app.data.setItem('docked',true);await settle();
 assert.equal(w.shell.hasAttribute('data-docked'),true);assert.equal(w.opened,true);
 assert.equal(f.element('draft'),input);f.app.data.setItem('draft','Still here');
 w.titlebar.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
 assert.equal(w.shell.style.cssText,before);
 f.app.data.setItem('docked',false);await settle();
 assert.equal(w.shell.hasAttribute('data-docked'),false);assert.equal(f.element('draft'),input);assert.equal(input.value,'Still here');
 assert.deepEqual(['left','top','width','height'].map(k=>w.shell.style[k]),geometry);
 w.collapseButton.click();await settle();f.app.data.setItem('docked',true);await settle();assert.equal(w.body.hidden,false);assert.equal(w.shell.style.getPropertyValue('--collapsed-height'),'0px');
 f.app.data.setItem('docked',false);await settle();assert.equal(w.body.hidden,true);
});

test('a floatingPane first opened docked restores its configured geometry when undocked',async t=>{
 const f=await fixture(t,(root,app)=>{
  app.data.setItem('docked',true);root.floatingPane({id:'float',open:true,docked:'^docked',width:'360px',height:'240px',left:'60px',top:'80px'}).frame.center.input({id:'draft'});
 });
 const w=f.element('float'),input=f.element('draft');
 w.shell.getBoundingClientRect=()=>Object.fromEntries(['left','top','width','height'].map(k=>[k,parseFloat(w.shell.style[k])||0]));
 assert.equal(w.shell.hasAttribute('data-docked'),true);
 f.app.data.setItem('docked',false);await settle();
 assert.equal(w.shell.hasAttribute('data-docked'),false);assert.equal(f.element('draft'),input);
 assert.deepEqual(['left','top','width','height'].map(k=>w.shell.style[k]),['60px','80px','360px','240px']);
});

test('titlebar=false hides the title bar; the framePane top region moves the window and remains when collapsed',async t=>{
 const f=await fixture(t,(root,app)=>{
  app.data.setItem('collapsed',false);
  const frame=root.floatingPane({id:'float',open:'^open',titlebar:false,collapsed:'^collapsed',width:'360px',height:'240px',left:'60px',top:'80px'}).frame;
  const bar=frame.top.div({id:'bar'});bar.span('Name',{id:'name'});bar.button('Act',{id:'act'});
  frame.center.input({id:'draft'});
  root.floatingPane({id:'plain',open:true}).frame.center.div('Plain');
 });
 const w=f.element('float'),top=w.querySelector('gramlot-frame-pane>[slot="top"]');
 assert.equal(w.titlebar.hidden,true);assert.equal(f.element('plain').titlebar.hidden,false);
 w.shell.getBoundingClientRect=()=>Object.fromEntries(['left','top','width','height'].map(k=>[k,parseFloat(w.shell.style[k])||0]));
 top.getBoundingClientRect=()=>({height:24});
 f.app.data.setItem('open',true);await settle();
 let capture=false;top.setPointerCapture=()=>capture=true;top.hasPointerCapture=()=>capture;top.releasePointerCapture=()=>capture=false;
 const send=(target,type,x,y)=>{const e=new f.window.MouseEvent(type,{bubbles:true,composed:true,clientX:x,clientY:y,button:0});Object.defineProperty(e,'pointerId',{value:1});target.dispatchEvent(e);};
 send(f.element("act").shadowRoot.querySelector("button"),"pointerdown",0,0);assert.equal(capture,false);
 const start=[w.shell.style.left,w.shell.style.top].map(parseFloat);
 send(f.element('name'),'pointerdown',0,0);assert.equal(capture,true);
 send(top,'pointermove',30,20);send(top,'pointerup',30,20);
 assert.deepEqual([w.shell.style.left,w.shell.style.top],[`${start[0]+30}px`,`${start[1]+20}px`]);assert.equal(capture,false);
 send(f.element("draft"),"pointerdown",0,0);assert.equal(capture,false);
 f.app.data.setItem('collapsed',true);await settle();
 assert.equal(w.body.hidden,false);assert.equal(w.shell.style.height,'26px');
 f.app.data.setItem('collapsed',false);await settle();assert.equal(w.shell.style.height,'240px');
});

test('a docked floatingPane collapses to its framePane top region and maximizes over the page, restoring into its cell',async t=>{
 const f=await fixture(t,(root,app)=>{
  app.data.setItem('collapsed',false);app.data.setItem('maximized',false);app.data.setItem('docked',true);
  const frame=root.floatingPane({id:'float',open:true,docked:'^docked',titlebar:false,maximizable:true,collapsed:'^collapsed',maximized:'^maximized',
   width:'360px',height:'240px',left:'60px',top:'80px'}).frame;
  frame.top.div('Name');frame.center.input({id:'draft'});
 });
 const w=f.element('float'),input=f.element('draft'),top=w.querySelector('gramlot-frame-pane>[slot="top"]');
 w.shell.getBoundingClientRect=()=>Object.fromEntries(['left','top','width','height'].map(k=>[k,parseFloat(w.shell.style[k])||0]));
 top.getBoundingClientRect=()=>({height:24});
 f.app.data.setItem('collapsed',true);await settle();
 assert.equal(w.shell.hasAttribute('data-docked'),true);assert.equal(w.body.hidden,false);
 assert.equal(w.shell.style.getPropertyValue('--collapsed-height'),'24px');
 f.app.data.setItem('collapsed',false);await settle();assert.equal(w.shell.style.getPropertyValue('--collapsed-height'),'');
 f.app.data.setItem('maximized',true);await settle();
 assert.equal(w.shell.hasAttribute('data-docked'),false);assert.equal(w.shell.hasAttribute('data-maximized'),true);
 assert.deepEqual(['left','top','width','height'].map(k=>w.shell.style[k]),['0px','0px','1024px','768px']);assert.ok(Number(w.shell.style.zIndex)>=100);
 f.app.data.setItem('maximized',false);await settle();
 assert.equal(w.shell.hasAttribute('data-docked'),true);assert.equal(w.shell.hasAttribute('data-maximized'),false);
 assert.equal(f.element('draft'),input);
 f.app.data.setItem('docked',false);await settle();
 assert.deepEqual(['left','top','width','height'].map(k=>w.shell.style[k]),['60px','80px','360px','240px']);
});

test('detachable: a drag past 6 px on the move handle of a docked window undocks it under the pointer; double click toggles docked',async t=>{
 const f=await fixture(t,(root,app)=>{
  app.data.setItem('docked',true);app.data.setItem('maximized',false);
  const frame=root.floatingPane({id:'float',open:true,docked:'^docked',detachable:true,titlebar:false,maximizable:true,maximized:'^maximized',
   left:'^left',top:'^top'}).frame;
  frame.top.div({id:'bar'}).span('Name',{id:'name'});frame.center.input({id:'draft'});
  const plain=root.floatingPane({id:'plain',open:true,docked:true}).frame;plain.top.div({id:'plainBar'});
 });
 const w=f.element('float'),top=w.querySelector('gramlot-frame-pane>[slot="top"]');
 // Docked at 100,200 in its cell, 300x160.
 w.shell.getBoundingClientRect=()=>w.shell.hasAttribute('data-docked')?{left:100,top:200,width:300,height:160}
  :Object.fromEntries(['left','top','width','height'].map(k=>[k,parseFloat(w.shell.style[k])||0]));
 let capture=false;top.setPointerCapture=()=>capture=true;top.hasPointerCapture=()=>capture;top.releasePointerCapture=()=>capture=false;
 const send=(target,type,x,y)=>{const e=new f.window.MouseEvent(type,{bubbles:true,composed:true,clientX:x,clientY:y,button:0});Object.defineProperty(e,'pointerId',{value:1});target.dispatchEvent(e);};
 assert.equal(w.parameters.detachable,true);assert.equal(f.element('plain').parameters.detachable,false);
 // Below the threshold nothing changes.
 send(f.element('name'),'pointerdown',110,210);assert.equal(capture,true);
 send(top,'pointermove',113,213);send(top,'pointerup',113,213);
 assert.equal(f.app.data.getItem('docked'),true);assert.equal(w.shell.hasAttribute('data-docked'),true);
 // Past the threshold the window undocks with its docked size and the grab point under the pointer, then follows it.
 send(f.element('name'),'pointerdown',110,210);send(top,'pointermove',150,260);
 assert.equal(f.app.data.getItem('docked'),false);assert.equal(w.shell.hasAttribute('data-docked'),false);
 assert.deepEqual(['left','top','width','height'].map(k=>w.shell.style[k]),['140px','250px','300px','160px']);
 send(top,'pointermove',200,300);send(top,'pointerup',200,300);
 assert.deepEqual([w.shell.style.left,w.shell.style.top],['190px','290px']);
 assert.deepEqual([f.app.data.getItem('left'),f.app.data.getItem('top')],['190px','290px']);
 await settle();assert.equal(w.parameters.docked,false);
 // Double click docks; again, it floats where its cell is.
 send(f.element('name'),'dblclick',200,300);await settle();
 assert.equal(f.app.data.getItem('docked'),true);assert.equal(w.shell.hasAttribute('data-docked'),true);
 send(f.element('name'),'dblclick',110,210);await settle();
 assert.equal(f.app.data.getItem('docked'),false);assert.deepEqual([w.shell.style.left,w.shell.style.top],['190px','290px']);
 // A maximized floating window docks at normal size.
 f.app.data.setItem('maximized',true);await settle();
 send(f.element('name'),'dblclick',10,10);await settle();
 assert.deepEqual([f.app.data.getItem('docked'),f.app.data.getItem('maximized')],[true,false]);
 // Without detachable a docked window neither moves nor toggles.
 const p=f.element('plain'),plainTop=p.querySelector('gramlot-frame-pane>[slot="top"]');let plainCapture=false;plainTop.setPointerCapture=()=>plainCapture=true;
 send(f.element('plainBar'),'pointerdown',0,0);send(f.element('plainBar'),'dblclick',0,0);await settle();
 assert.equal(plainCapture,false);assert.equal(p.parameters.docked,true);
});
