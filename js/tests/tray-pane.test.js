import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import layout from '../src/components/layout.js';
import inputs from '../src/components/inputs.js';
import {layoutWindow} from './helpers/layout-window.js';
import {toTytx,fromTytx} from '@genrojs/tytx';

const settle = () => new Promise(resolve => setTimeout(resolve,0));
function obstacle(root,app,tray) {
    app.data.setItem('scope.layout.other',new Bag({layer:0,left:150,top:20,width:80,height:80}));
    tray.div({node_label:'other',lbl:'Other',id:'obstacle'});
    root.numberTextBox({id:'layer-value',value:'^.layout.card.layer',dtype:'L'});
}
async function setSmallDimensions(f) {
    const row=f.store.getItem('card');row.setItem('width',100);row.setItem('height',80);
    sourceTarget(f.card).setAttr({minWidth:80,minHeight:60});await settle();
    return f.box.labelbox.resizeHandle;
}
async function fixture(t, author) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    const matches=window.Element.prototype.matches;
    window.Element.prototype.matches=function(selector){return selector===':popover-open'?this.hasAttribute('data-test-open'):matches.call(this,selector);};
    window.HTMLElement.prototype.showPopover=function(){this.setAttribute('data-test-open','');};
    window.HTMLElement.prototype.hidePopover=function(){this.removeAttribute('data-test-open');};
    const app = new Gramlot({document:window.document,transport:false,collections:[layout,inputs]});
    const store = new Bag({card:new Bag({layer:0,left:10,top:20})});
    app.data.setItem('scope.layout',store);
    const builder = new GramlotBuilder(null,{collections:[layout,inputs]});
    const root = builder.root.div({datapath:'scope'});
    const tray = root.trayPane({id:'tray',storepath:'.layout',height:'200px'});
    const card = tray.div({node_label:'card',id:'card',lbl:'Customer',box_width:'100px'});
    card.textbox({id:'field',value:'^.name',default:'Ada',live:true});
    author?.(root,app,tray);
    app.src.startSource(builder.source);
    await settle();
    t.after(() => {app.dispose();window.close();});
    const host = window.document.getElementById('tray'), element = window.document.getElementById('card');
    const box = element.parentElement.parentElement;
    let capture = null;
    host.setPointerCapture = id => {capture=id;};
    host.hasPointerCapture = id => capture===id;
    host.releasePointerCapture = () => {capture=null;};
    Object.defineProperties(host,{clientWidth:{value:300},clientHeight:{value:200}});
    Object.defineProperties(box,{offsetWidth:{value:100},offsetHeight:{value:80}});
    host.getBoundingClientRect = () => ({left:0,top:0,width:300,height:200});
    const send = (target,type,x,y,id=1,options={}) => {
        const event = new window.MouseEvent(type,{bubbles:true,composed:true,cancelable:true,clientX:x,clientY:y,button:0,...options});
        Object.defineProperty(event,'pointerId',{value:id});target.dispatchEvent(event);return event;
    };
    return {app,store,host,box,element,card,send,window};
}

test('tray uses Source label keys and relative storepath; live movement retains fields and bindings',async t => {
    const f = await fixture(t), row = f.store.getItem('card');
    const field = f.window.document.getElementById('field'), control = field.control;
    const source = sourceTarget(f.card), sourceParent = source.parentNode;
    assert.equal(f.box.dataset.variant,'card');assert.equal(f.box.dataset.position,'TC');
    assert.equal(f.box.style.left,'10px');assert.equal(f.box.style.top,'20px');
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    f.send(f.host,'pointermove',65.00003,75.00003);await settle();
    assert.equal(row.getItem('left'),55);assert.equal(row.getItem('top'),65);
    assert.equal(f.box.style.left,'55px');
    f.send(f.host,'pointerup',65,75);await settle();
    assert.equal(source.parentNode,sourceParent);assert.equal(source.getAttr('left'),null);
    assert.equal(field.control,control);assert.equal(f.window.document.getElementById('card'),f.element);
    control.value='Grace';control.dispatchEvent(new f.window.Event('input',{bubbles:true,composed:true}));
    assert.equal(f.app.data.getItem('scope.name'),'Grace');
    row.setItem('left',34);row.setItem('top',50);await settle();
    assert.equal(f.box.style.left,'34px');assert.equal(f.box.style.top,'50px');assert.equal(control.value,'Grace');
});

test('drag clamps to all panel edges; fields do not initiate drag; cancel restores Data',async t => {
    const f = await fixture(t), row=f.store.getItem('card');
    assert.equal(f.send(f.element,'pointerdown',20,30).defaultPrevented,false);
    f.send(f.host,'pointermove',100,100);assert.equal(row.getItem('left'),10);
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    f.send(f.host,'pointermove',1000,1000,2);assert.equal(row.getItem('left'),10);
    f.send(f.host,'pointermove',1000,1000);assert.ok(row.getItem('left')<200);assert.equal(row.getItem('top'),120);
    f.send(f.host,'pointermove',-1000,-1000);assert.ok(Math.abs(row.getItem('left'))<1e-9);assert.ok(row.getItem('top')>=0);
    f.send(f.host,'pointercancel',0,0);await settle();
    assert.equal(row.getItem('left'),10);assert.equal(row.getItem('top'),20);
    assert.equal(f.box.hasAttribute('data-moving'),false);
});

test('replacement store restores the same DOM and ends the old drag; removal releases movement',async t => {
    const f = await fixture(t), original = f.store.getItem('card');
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    f.send(f.host,'pointermove',40,50);
    const restored=new Bag({card:new Bag({layer:0,left:60,top:70})});
    f.app.data.setItem('scope.layout',restored);await settle();
    f.send(f.host,'pointermove',100,100);assert.equal(restored.getItem('card.left'),60);
    assert.equal(f.box.style.left,'60px');assert.equal(f.element.parentElement.parentElement,f.box);
    assert.equal(original.getItem('left'),30);
    f.send(f.box.labelbox.fieldLabel,'pointerdown',65,75);
    sourceTarget(f.card).parentBag.popNode('card');
    f.send(f.host,'pointermove',120,120);assert.equal(restored.getItem('card.left'),60);
    assert.equal(f.box.hasAttribute('data-moving'),false);
});

test('same labels in two trays are isolated; new block positions initialize in Data',async t => {
    const f = await fixture(t,(root,app) => {
        app.data.setItem('scope.other',new Bag());
        root.trayPane({id:'other',storepath:'.other'}).div({node_label:'card',id:'second',lbl:'Other'});
    });
    assert.equal(f.app.data.getItem('scope.other.card.left'),0);
    f.store.setItem('card.left',80);await settle();
    const second=f.window.document.getElementById('second').parentElement.parentElement;
    assert.equal(second.style.left,'0px');assert.equal(second.hasAttribute('data-movable'),true);
    f.host.projectAttributes({locked:true});await settle();
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);f.send(f.host,'pointermove',100,100);
    assert.equal(f.store.getItem('card.left'),80);
});

test('card presentation works on groupBox and header actions never start a drag',async t => {
    const f=await fixture(t,root=>{
        const tray=root.trayPane({id:'group-tray',storepath:'.layout'});
        tray.groupBox({node_label:'group',id:'group',lbl:'Group',copy:true,datapath:'.record'}).input({value:'^.value'});
    });
    const group=f.window.document.getElementById('group');
    assert.equal(group.box.dataset.variant,'card');assert.equal(group.box.dataset.position,'TC');
    assert.equal(f.send(group.copyButton,'pointerdown',10,10).defaultPrevented,false);
    assert.equal(group.box.hasAttribute('data-moving'),false);
});

test('resize writes live width/height, keeps content identity and cancels to the same Bag',async t=>{
    const f=await fixture(t),handle=await setSmallDimensions(f),row=f.store.getItem('card');
    const field=f.window.document.getElementById('field'),control=field.control;
    const record=f.app.src.renderer.records.get(sourceTarget(f.card));
    f.send(handle,'pointerdown',100,90);f.send(f.host,'pointermove',145,125);await settle();
    assert.equal(row.getItem('width'),145);assert.equal(row.getItem('height'),115);
    assert.equal(row.getItem('left'),10);assert.equal(row.getItem('top'),20);
    assert.equal(f.box.style.width,'145px');assert.equal(f.box.style.height,'115px');
    f.send(f.host,'pointercancel',145,125);await settle();
    assert.equal(row.getItem('width'),100);assert.equal(row.getItem('height'),80);
    assert.equal(field.control,control);assert.equal(f.app.src.renderer.records.get(sourceTarget(f.card)),record);
    control.value='Retained';control.dispatchEvent(new f.window.Event('input',{bubbles:true,composed:true}));
    row.setItem('width',170);row.setItem('height',120);await settle();
    assert.equal(f.box.style.width,'170px');assert.equal(f.app.data.getItem('scope.name'),'Retained');
    assert.equal(field.control,control);assert.equal(f.box.labelbox.resizeHandle,handle);
});

test('resize obeys minimum dimensions and tray bounds; keyboard works without movement',async t=>{
    const f=await fixture(t),handle=await setSmallDimensions(f),row=f.store.getItem('card');
    f.send(handle,'pointerdown',100,90);f.send(f.host,'pointermove',-100,-100);await settle();
    assert.equal(row.getItem('width'),80);assert.equal(row.getItem('height'),60);
    f.send(f.host,'pointermove',1000,1000);f.send(f.host,'pointerup',1000,1000);await settle();
    const width=row.getItem('width');assert.ok(width<290);assert.equal(row.getItem('height'),180);
    handle.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowLeft',shiftKey:true,bubbles:true,cancelable:true}));
    handle.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true,cancelable:true}));
    await settle();assert.equal(row.getItem('width'),width-10);assert.equal(row.getItem('height'),179);
    f.host.projectAttributes({locked:true});await settle();assert.equal(handle.hidden,true);
    f.send(handle,'pointerdown',100,90);f.send(f.host,'pointermove',150,140);
    assert.equal(row.getItem('width'),width-10);
});

test('store replacement and removal stop resize without overwriting restored geometry',async t=>{
    const f=await fixture(t),handle=await setSmallDimensions(f);
    f.send(handle,'pointerdown',100,90);f.send(f.host,'pointermove',130,130);
    const restored=new Bag({card:new Bag({layer:0,left:40,top:50,width:180,height:110})});
    f.app.data.setItem('scope.layout',restored);await settle();
    f.send(f.host,'pointermove',180,160);assert.equal(restored.getItem('card.width'),180);
    assert.equal(f.box.style.width,'180px');assert.equal(f.box.style.height,'110px');
    f.send(handle,'pointerdown',100,90);sourceTarget(f.card).parentBag.popNode('card');
    f.send(f.host,'pointercancel',130,120);assert.equal(restored.getItem('card.width'),180);
    assert.equal(f.box.hasAttribute('data-resizing'),false);
});

test('same-layer drag stops at first contact without tunnelling; moving away remains possible',async t=>{
    const f=await fixture(t,obstacle),row=f.store.getItem('card');
    const control=f.window.document.getElementById('field').control;
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    f.send(f.host,'pointermove',270,30);await settle();
    assert.equal(row.getItem('left'),50);assert.equal(row.getItem('top'),20);
    f.send(f.host,'pointermove',290,30);assert.equal(row.getItem('left'),50);
    f.send(f.host,'pointermove',10,30);assert.equal(row.getItem('left'),0);
    f.send(f.host,'pointerup',10,30);
    assert.equal(f.window.document.getElementById('field').control,control);
    assert.equal(f.box.style.zIndex,'0');
});

test('same-layer resize stops at contact, including keyboard; other layers do not obstruct',async t=>{
    const f=await fixture(t,obstacle),handle=await setSmallDimensions(f),row=f.store.getItem('card');
    f.send(handle,'pointerdown',110,100);f.send(f.host,'pointermove',350,100);
    assert.equal(row.getItem('width'),140);assert.equal(row.getItem('height'),80);
    f.send(f.host,'pointerup',350,100);
    handle.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
    assert.equal(row.getItem('width'),140);
    f.store.setItem('other.layer',1);await settle();
    f.send(handle,'pointerdown',150,100);f.send(f.host,'pointermove',260,100);
    assert.equal(row.getItem('width'),250);
    f.send(f.host,'pointerup',260,100);await settle();
    assert.equal(f.window.document.getElementById('obstacle').parentElement.parentElement.style.zIndex,'1');
});

test('layer change refuses overlap using the Bag old value; the bound editor and DOM retain the accepted layer',async t=>{
    const f=await fixture(t,obstacle),row=f.store.getItem('card');
    row.setItem('layer',2);await settle();
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);f.send(f.host,'pointerup',180,30);await settle();
    assert.equal(row.getItem('left'),170);assert.equal(f.box.style.zIndex,'2');
    const field=f.window.document.getElementById('layer-value'),control=field.control;
    control.focus();control.value='0';control.dispatchEvent(new f.window.Event('input',{bubbles:true,composed:true}));control.dispatchEvent(new f.window.Event('change',{bubbles:true,composed:true}));await settle();
    assert.equal(row.getItem('layer'),2);assert.equal(f.box.style.zIndex,'2');
    assert.equal(control.value,'2');assert.equal(field.control,control);
    row.setItem('layer',-1);await settle();assert.equal(row.getItem('layer'),-1);
    f.send(f.box.labelbox.fieldLabel,'pointerdown',180,30);f.send(f.host,'pointerup',20,30);await settle();
    row.setItem('layer',0);await settle();assert.equal(row.getItem('layer'),0);
});

test('ordinary tray reprojection keeps the gesture; actual external geometry changes stop it',async t=>{
    const f=await fixture(t),row=f.store.getItem('card');
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    f.host.setStoreBag(f.store);
    f.send(f.host,'pointermove',40,50);assert.equal(row.getItem('left'),30);
    row.setItem('top',75);
    f.send(f.host,'pointermove',80,80);assert.equal(row.getItem('left'),30);assert.equal(row.getItem('top'),75);
});

test('selection uses Data: ordinary click replaces, Shift toggles, empty space clears and secondary click is ignored',async t=>{
    const f=await fixture(t,obstacle),other=f.window.document.getElementById('obstacle');
    const row=f.store.getItem('card'),second=f.store.getItem('other');
    assert.equal(row.getItem('selected'),false);
    f.send(f.element,'pointerdown',20,30);await settle();
    assert.equal(row.getItem('selected'),true);assert.equal(second.getItem('selected'),false);
    f.send(other,'pointerdown',160,30,1,{shiftKey:true});await settle();
    assert.equal(row.getItem('selected'),true);assert.equal(second.getItem('selected'),true);
    assert.ok(f.box.hasAttribute('data-selected'));
    assert.ok(other.parentElement.parentElement.hasAttribute('data-selected'));
    f.send(f.element,'pointerdown',20,30,1,{shiftKey:true});await settle();
    assert.equal(row.getItem('selected'),false);assert.equal(second.getItem('selected'),true);
    f.send(f.element,'pointerdown',20,30);await settle();
    assert.equal(row.getItem('selected'),true);assert.equal(second.getItem('selected'),false);
    f.send(f.host,'pointerdown',280,180,1,{button:2});assert.equal(row.getItem('selected'),true);
    f.send(f.host,'pointerdown',280,180);await settle();
    assert.equal(row.getItem('selected'),false);assert.equal(second.getItem('selected'),false);
    assert.equal(f.box.hasAttribute('data-selected'),false);
});

test('selection roundtrips with geometry, projects external changes and preserves controls and Source',async t=>{
    const f=await fixture(t,obstacle),field=f.window.document.getElementById('field'),control=field.control;
    const node=sourceTarget(f.card),record=f.app.src.renderer.records.get(node);
    f.send(control,'pointerdown',20,40);
    control.value='Grace';control.dispatchEvent(new f.window.Event('input',{bubbles:true,composed:true}));
    f.store.setItem('other.selected',true);await settle();
    const saved=toTytx(f.store);
    f.send(f.host,'pointerdown',280,180);await settle();
    const restored=fromTytx(saved);f.app.data.setItem('scope.layout',restored);await settle();
    assert.equal(restored.getItem('card.selected'),true);assert.equal(restored.getItem('other.selected'),true);
    assert.equal(f.box.hasAttribute('data-selected'),true);
    assert.equal(field.control,control);assert.equal(control.value,'Grace');
    assert.equal(f.app.src.renderer.records.get(node),record);assert.equal(node.getAttr('selected'),null);
    restored.setItem('card.selected',false);await settle();assert.equal(f.box.hasAttribute('data-selected'),false);
    f.store.setItem('card.selected',true);await settle();assert.equal(f.box.hasAttribute('data-selected'),false);
});

test('selection belongs to its tray; nested tray interactions do not select the containing block',async t=>{
    const f=await fixture(t,(root,app,tray)=>{
        app.data.setItem('scope.inner',new Bag({inside:new Bag({left:0,top:0,layer:0})}));
        const outer=tray.div({node_label:'outer',id:'outer',lbl:'Outer'});
        outer.trayPane({storepath:'.inner',id:'inner'}).div({node_label:'inside',id:'inside',lbl:'Inside'});
    });
    f.send(f.element,'pointerdown',20,40);await settle();
    f.send(f.window.document.getElementById('inside'),'pointerdown',10,10);await settle();
    assert.equal(f.app.data.getItem('scope.inner.inside.selected'),true);
    assert.equal(f.store.getItem('outer.selected'),false);assert.equal(f.store.getItem('card.selected'),true);
    f.send(f.window.document.getElementById('inner'),'pointerdown',250,150);await settle();
    assert.equal(f.app.data.getItem('scope.inner.inside.selected'),false);assert.equal(f.store.getItem('card.selected'),true);
});

test('layer and zoom popovers use Data, restore rejected layers and release resources',async t=>{
    const f=await fixture(t,obstacle),row=f.store.getItem('card'),editor=f.box.labelbox.traySettings;
    const layer=editor.controls.layer.input;
    assert.equal(layer.min,'-10');assert.equal(layer.max,'10');assert.equal(layer.step,'1');
    assert.equal(layer.getAttribute('aria-orientation'),'vertical');
    assert.equal(f.send(editor.controls.layer.button,'pointerdown',95,25).defaultPrevented,false);
    editor.controls.layer.button.click();await settle();assert.equal(row.getItem('settings.layerOpen'),true);
    assert.equal(editor.controls.layer.popup.matches(':popover-open'),true);assert.equal(f.box.hasAttribute('data-moving'),false);
    assert.equal(editor.controls.layer.popup.parentNode,f.host.shadowRoot);
    for(const value of [-10,10,2]) {
        layer.value=String(value);layer.dispatchEvent(new f.window.Event('input',{bubbles:true}));await settle();
        assert.equal(row.getItem('layer'),value);assert.equal(editor.controls.layer.output.value,`Layer ${value}`);
    }
    row.setItem('left',170);await settle();
    layer.value='0';layer.dispatchEvent(new f.window.Event('input',{bubbles:true}));await settle();
    assert.equal(row.getItem('layer'),2);assert.equal(layer.value,'2');
    sourceTarget(f.card).setAttr({lbl:'Renamed'});await settle();
    assert.equal(f.box.labelbox.traySettings,editor);assert.equal(editor.controls.layer.button.getAttribute('aria-label'),'Layer for Renamed');
    editor.controls.layer.input.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await settle();assert.equal(row.getItem('settings.layerOpen'),false);
    editor.controls.layer.button.click();await settle();
    editor.controls.scale.button.click();await settle();
    assert.equal(row.getItem('settings.layerOpen'),false);
    assert.equal(row.getItem('settings.scaleOpen'),true);
    assert.equal(editor.controls.scale.input.getAttribute('aria-orientation'),'vertical');
    assert.equal(editor.controls.scale.popup.parentNode,f.host.shadowRoot);
    const close=new f.window.Event('beforetoggle');Object.defineProperty(close,'newState',{value:'closed'});
    editor.controls.scale.popup.dispatchEvent(close);await settle();
    assert.equal(row.getItem('settings.scaleOpen'),false);
    f.host.remove();assert.equal(editor.controls.layer.popup.isConnected,false);
    assert.equal(editor.controls.scale.popup.isConnected,false);
});

test('rotation and scale roundtrip in Data without recreating content; transformed bounds constrain edits',async t=>{
    const f=await fixture(t),row=f.store.getItem('card'),field=f.window.document.getElementById('field'),control=field.control;
    row.setItem('left',100);row.setItem('top',60);row.setItem('rotation',30);row.setItem('scale',1.2);await settle();
    assert.equal(row.getItem('rotation'),30);assert.equal(row.getItem('scale'),1.2);
    assert.equal(f.box.style.transform,'rotate(30deg) scale(1.2)');
    const saved=toTytx(f.store);row.setItem('scale',10);await settle();
    assert.ok(row.getItem('scale')<2);assert.ok(row.getItem('scale')>1.2);
    row.setItem('scale',0);assert.ok(row.getItem('scale')>1.2);
    f.app.data.setItem('scope.layout',fromTytx(saved));await settle();
    assert.equal(f.box.style.transform,'rotate(30deg) scale(1.2)');
    assert.equal(field.control,control);assert.equal(f.element.parentElement.parentElement,f.box);
});

test('resize of a rotated/zoomed block follows local axes, anchors its corner and preserves controls',async t=>{
    const f=await fixture(t),handle=await setSmallDimensions(f),row=f.store.getItem('card');
    row.setItem('left',100);row.setItem('top',60);row.setItem('rotation',90);row.setItem('scale',.5);await settle();
    const control=f.window.document.getElementById('field').control;
    f.send(handle,'pointerdown',150,100);f.send(f.host,'pointermove',150,110);f.send(f.host,'pointerup',150,110);await settle();
    assert.equal(row.getItem('width'),120);assert.equal(row.getItem('height'),80);
    assert.equal(row.getItem('left'),90);assert.equal(row.getItem('top'),65);
    assert.equal(f.window.document.getElementById('field').control,control);
});

test('rotation grip drags around the center, preserves geometry/content and cancels to Data',async t=>{
    const f=await fixture(t),row=f.store.getItem('card'),handle=f.box.labelbox.rotationHandle;
    const control=f.window.document.getElementById('field').control;
    row.setItem('left',100);row.setItem('top',60);await settle();
    Object.defineProperties(f.host,{clientLeft:{value:2},clientTop:{value:3}});
    f.send(handle,'pointerdown',112,63);assert.equal(f.box.hasAttribute('data-rotating'),true);
    f.send(f.host,'pointermove',192,63);await settle();
    assert.ok(Math.abs(row.getItem('rotation')-90)<1e-8);
    assert.equal(row.getItem('left'),100);assert.equal(row.getItem('top'),60);
    assert.equal(f.window.document.getElementById('field').control,control);
    f.send(f.host,'pointercancel',190,60);await settle();
    assert.equal(row.getItem('rotation'),0);assert.equal(f.box.hasAttribute('data-rotating'),false);
    handle.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',shiftKey:true,bubbles:true}));
    assert.equal(row.getItem('rotation'),10);
});

test('rotation grip unwraps the signed angle boundary and cannot cross same-layer contact',async t=>{
    const f=await fixture(t,obstacle),row=f.store.getItem('card'),handle=f.box.labelbox.rotationHandle;
    row.setItem('left',100);row.setItem('top',60);row.setItem('layer',1);await settle();
    const point=a=>[150+50*Math.cos(a*Math.PI/180),100+50*Math.sin(a*Math.PI/180)];
    f.send(handle,'pointerdown',...point(179));f.send(f.host,'pointermove',...point(-179));
    assert.ok(Math.abs(row.getItem('rotation')-2)<1e-8);
    handle.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(row.getItem('rotation'),0);
    row.setItem('left',10);row.setItem('top',20);row.setItem('layer',0);f.store.setItem('other.left',110);await settle();
    f.send(handle,'pointerdown',20,20);f.send(f.host,'pointermove',100,20);await settle();
    assert.ok(row.getItem('rotation')<.001);assert.equal(row.getItem('left'),10);
});

test('vertical zoom slider reflects external Data and reflects contact limits without replacing controls',async t=>{
    const f=await fixture(t),row=f.store.getItem('card'),editor=f.box.labelbox.traySettings;
    row.setItem('left',100);row.setItem('top',60);await settle();
    const change=value=>{editor.controls.scale.input.value=String(value);editor.controls.scale.input.dispatchEvent(new f.window.Event('input',{bubbles:true}));};
    change(60);await settle();assert.equal(row.getItem('scale'),.6);assert.equal(editor.controls.scale.input.value,'60');
    row.setItem('scale',1.25);await settle();assert.equal(editor.controls.scale.input.value,'125');
    row.setItem('left',40);change(200);await settle();assert.ok(row.getItem('scale')<2);
    assert.ok(Math.abs(Number(editor.controls.scale.input.value)-row.getItem('scale')*100)<=.5);
    assert.equal(f.box.labelbox.traySettings,editor);
});


test('tray lock hides chrome, ends gestures and keeps content and Data projection live',async t=>{
    const f=await fixture(t),handle=await setSmallDimensions(f),row=f.store.getItem('card');
    sourceTarget(f.card).parentNode.setAttr({locked:'^scope.locked'});
    const control=f.window.document.getElementById('field').control;
    f.box.labelbox.traySettings.controls.layer.button.click();await settle();
    assert.equal(row.getItem('settings.layerOpen'),true);
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    f.app.data.setItem('scope.locked',true);await settle();
    const before=toTytx(row);
    assert.equal(row.getItem('settings.layerOpen'),false);
    assert.equal(handle.hidden,true);
    assert.equal(f.box.labelbox.rotationHandle.hidden,true);
    assert.equal(f.box.labelbox.traySettings.controls.layer.button.hidden,true);
    assert.equal(f.box.hasAttribute('data-movable'),false);
    assert.equal(f.box.labelbox.traySettings.controls.scale.button.hidden,true);
    f.send(f.host,'pointermove',50,60);f.send(f.host,'pointerup',50,60);
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);f.send(f.host,'pointermove',50,60);
    handle.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
    f.box.labelbox.rotationHandle.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
    f.box.labelbox.traySettings.controls.layer.button.click();await settle();
    assert.equal(toTytx(row),before);
    control.value='Still editable';control.dispatchEvent(new f.window.Event('input',{bubbles:true}));
    assert.equal(f.app.data.getItem('scope.name'),'Still editable');
    row.setItem('left',35);await settle();assert.equal(f.box.style.left,'35px');
    f.app.data.setItem('scope.locked',false);await settle();
    assert.equal(handle.hidden,false);assert.equal(f.box.labelbox.rotationHandle.hidden,false);
    assert.equal(f.box.labelbox.traySettings.controls.layer.button.hidden,false);
    assert.equal(f.window.document.getElementById('field').control,control);
});

test('independent geometry snapshots restore all fields without remounting content',async t=>{
    const f=await fixture(t);await setSmallDimensions(f);
    const row=f.store.getItem('card'),control=f.window.document.getElementById('field').control;
    for(const [key,value] of Object.entries({left:40,top:40,width:100,height:80,layer:2,rotation:15,scale:.8}))row.setItem(key,value);
    await settle();
    const saved=f.store.deepcopy(),expected=toTytx(saved);
    f.app.data.setItem('scope.saved',saved);
    row.setItem('left',70);row.setItem('rotation',0);row.setItem('scale',1);await settle();
    assert.equal(toTytx(saved),expected);
    f.app.data.setItem('scope.layout',saved.deepcopy());await settle();
    assert.equal(toTytx(f.app.data.getItem('scope.layout')),expected);
    assert.equal(f.box.style.left,'40px');assert.equal(f.box.style.zIndex,'2');
    assert.equal(f.box.style.transform,'rotate(15deg) scale(0.8)');
    assert.equal(f.window.document.getElementById('field').control,control);
    f.app.data.getItem('scope.layout.card').setItem('top',50);
    assert.equal(toTytx(saved),expected);
});

test('Shift snaps movement and resize to bound steps; release restores free movement and contact wins',async t=>{
    const f=await fixture(t,(root,app,tray)=>{
        obstacle(root,app,tray);
        app.data.setItem('scope.options',new Bag({step:10,visible:true,angle:15}));
        sourceTarget(tray).setAttr({gridStep:'^.options.step',gridVisible:'^.options.visible',rotationStep:'^.options.angle'});
    });
    const row=f.store.getItem('card'),control=f.window.document.getElementById('field').control;
    assert.equal(f.host.style.getPropertyValue('--tray-grid-size'),'10px');
    assert.equal(f.host.style.getPropertyValue('--tray-grid-display'),'block');
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    f.send(f.host,'pointermove',27,37,1,{shiftKey:true});
    assert.equal(row.getItem('left'),20);assert.equal(row.getItem('top'),30);
    f.send(f.host,'pointermove',27,37);
    assert.equal(row.getItem('left'),17);assert.equal(row.getItem('top'),27);
    f.send(f.host,'pointercancel',27,37);
    f.app.data.setItem('scope.options.step',17);await settle();
    assert.equal(f.host.style.getPropertyValue('--tray-grid-size'),'17px');
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    f.send(f.host,'pointermove',90,30,1,{shiftKey:true});
    assert.ok(row.getItem('left')<=50);assert.ok(row.getItem('left')>49.9);
    f.send(f.host,'pointercancel',90,30);
    const handle=await setSmallDimensions(f);
    f.app.data.setItem('scope.options.step',10);await settle();
    f.send(handle,'pointerdown',110,100);
    f.send(f.host,'pointermove',117,107,1,{shiftKey:true});
    assert.equal(row.getItem('width'),110);assert.equal(row.getItem('height'),90);
    f.send(f.host,'pointermove',117,107);
    assert.equal(row.getItem('width'),107);assert.equal(row.getItem('height'),87);
    f.send(f.host,'pointercancel',117,107);
    f.app.data.setItem('scope.options.step',0);await settle();
    assert.equal(f.host.style.getPropertyValue('--tray-grid-display'),'none');
    f.send(handle,'pointerdown',110,100);f.send(f.host,'pointermove',117,107,1,{shiftKey:true});
    assert.equal(row.getItem('width'),107);f.send(f.host,'pointerup',117,107,1,{shiftKey:true});
    assert.equal(f.window.document.getElementById('field').control,control);
});

test('Shift rotation accumulates small pointer deltas, snaps absolute angles and returns to free rotation',async t=>{
    const f=await fixture(t),row=f.store.getItem('card');
    row.setItem('left',100);row.setItem('top',60);await settle();
    const point=a=>[150+50*Math.cos(a*Math.PI/180),100+50*Math.sin(a*Math.PI/180)];
    f.send(f.box.labelbox.rotationHandle,'pointerdown',...point(0));
    for(let a=1;a<=23;a++)f.send(f.host,'pointermove',...point(a),1,{shiftKey:true});
    assert.ok(Math.abs(row.getItem('rotation')-30)<1e-8);
    f.send(f.host,'pointermove',...point(24));
    assert.ok(Math.abs(row.getItem('rotation')-24)<1e-8);
    f.send(f.host,'pointercancel',...point(24));assert.equal(row.getItem('rotation'),0);
});

async function groupFixture(t) {
    return fixture(t,(root,app,tray)=>{
        app.data.setItem('scope.layout.second',new Bag({left:130,top:20,width:80,height:80,layer:0,selected:true}));
        app.data.setItem('scope.layout.wall',new Bag({left:230,top:20,width:40,height:80,layer:0}));
        app.data.setItem('scope.layout.card.selected',true);
        tray.div({node_label:'second',id:'second',lbl:'Second'});
        tray.div({node_label:'wall',id:'wall',lbl:'Wall'});
    });
}
test('selected group shares first contact, preserves spacing, reverses and cancels all rows',async t=>{
    const f=await groupFixture(t),row=f.store.getItem('card'),second=f.store.getItem('second');
    const field=f.window.document.getElementById('field'),control=field.control;
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    assert.equal(second.getItem('selected'),true);
    f.send(f.host,'pointermove',120,30);await settle();
    assert.equal(row.getItem('left'),30);assert.equal(second.getItem('left'),150);
    assert.equal(second.getItem('left')-row.getItem('left'),120);
    assert.equal(f.store.getItem('wall.left'),230);
    f.send(f.host,'pointermove',25,30);
    assert.equal(row.getItem('left'),15);assert.equal(second.getItem('left'),135);
    f.send(f.host,'pointercancel',25,30);await settle();
    assert.equal(row.getItem('left'),10);assert.equal(second.getItem('left'),130);
    assert.equal(field.control,control);
    assert.equal(f.box.hasAttribute('data-moving'),false);
    assert.equal(f.window.document.getElementById('second').parentElement.parentElement.hasAttribute('data-moving'),false);
});
test('mixed-layer group ignores its members, snaps the anchor only and stops at tray bounds',async t=>{
    const f=await groupFixture(t),row=f.store.getItem('card'),second=f.store.getItem('second');
    second.setItem('layer',1);second.setItem('left',133);await settle();
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30,1,{shiftKey:true});
    f.send(f.host,'pointermove',27,37,1,{shiftKey:true});
    assert.equal(row.getItem('left'),20);assert.equal(second.getItem('left'),143);
    assert.equal(row.getItem('top'),30);assert.equal(second.getItem('top'),30);
    f.send(f.host,'pointermove',1000,37);await settle();
    assert.ok(Math.abs(second.getItem('left')-220)<1e-8);
    assert.ok(Math.abs(second.getItem('left')-row.getItem('left')-123)<1e-8);
    f.send(f.host,'pointerup',1000,37);
    assert.equal(second.getItem('selected'),true);assert.equal(row.getItem('selected'),true);
    // A title click without movement still supports Shift toggling and ordinary single selection.
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30,1,{shiftKey:true});
    f.send(f.host,'pointerup',20,30,1,{shiftKey:true});assert.equal(row.getItem('selected'),false);
    assert.equal(second.getItem('selected'),true);
});
test('transformed group retains poses and external replacement ends the whole gesture',async t=>{
    const f=await groupFixture(t),row=f.store.getItem('card'),second=f.store.getItem('second');
    second.setItem('rotation',20);second.setItem('scale',.7);await settle();
    f.send(f.box.labelbox.fieldLabel,'pointerdown',20,30);
    f.send(f.host,'pointermove',33,41);await settle();
    assert.equal(row.getItem('left'),23);assert.equal(second.getItem('left'),143);
    assert.equal(row.getItem('top'),31);assert.equal(second.getItem('top'),31);
    assert.equal(second.getItem('rotation'),20);assert.equal(second.getItem('scale'),.7);
    const copy=f.store.deepcopy();f.app.data.setItem('scope.layout',copy);await settle();
    f.send(f.host,'pointermove',60,70);f.send(f.host,'pointercancel',60,70);
    assert.equal(copy.getItem('card.left'),23);assert.equal(copy.getItem('second.left'),143);
});

test('empty-space rectangle selects enclosed blocks in Data and supports reverse Shift extension',async t=>{
    const f=await groupFixture(t);
    const control=f.window.document.getElementById('field').control;
    f.send(f.host,'pointerdown',0,0);
    assert.equal(f.store.getItem('card.selected'),false);
    f.send(f.host,'pointermove',220,110);await settle();
    assert.equal(f.store.getItem('card.selected'),true);assert.equal(f.store.getItem('second.selected'),true);
    assert.equal(f.store.getItem('wall.selected'),false);
    assert.equal(f.box.hasAttribute('data-selected'),true);
    const overlay=f.host.shadowRoot.querySelector('.tray-marquee');
    assert.equal(overlay.hidden,false);assert.equal(overlay.style.width,'220px');
    f.send(f.host,'pointerup',220,110);assert.equal(overlay.isConnected,false);
    f.send(f.host,'pointerdown',299,190,1,{shiftKey:true});
    f.send(f.host,'pointermove',225,10,1,{shiftKey:true});f.send(f.host,'pointerup',225,10,1,{shiftKey:true});
    for(const label of ['card','second','wall'])assert.equal(f.store.getItem(`${label}.selected`),true);
    assert.equal(f.window.document.getElementById('field').control,control);
    assert.equal(f.store.getItem('card.left'),10);assert.equal(f.store.getItem('second.left'),130);
});

test('marquee uses transformed outer corners and cancellation restores the original selection',async t=>{
    const f=await fixture(t),row=f.store.getItem('card');
    row.setItem('left',100);row.setItem('top',60);row.setItem('rotation',45);row.setItem('selected',true);await settle();
    f.send(f.host,'pointerdown',95,45);f.send(f.host,'pointermove',205,155);
    assert.equal(row.getItem('selected'),false);
    f.send(f.host,'pointercancel',205,155);assert.equal(row.getItem('selected'),true);
    assert.equal(f.host.shadowRoot.querySelector('.tray-marquee'),null);
    f.send(f.host,'pointerdown',80,30);f.send(f.host,'pointermove',220,170);
    assert.equal(row.getItem('selected'),true);
    f.host.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(row.getItem('selected'),true);assert.equal(f.host.shadowRoot.querySelector('.tray-marquee'),null);
});

test('marquee respects lock and external store replacement without writing stale selection',async t=>{
    const f=await groupFixture(t);
    f.send(f.host,'pointerdown',0,0);f.send(f.host,'pointermove',220,110);
    const copy=f.store.deepcopy();copy.setItem('card.selected',false);
    f.app.data.setItem('scope.layout',copy);await settle();
    assert.equal(f.host.shadowRoot.querySelector('.tray-marquee'),null);
    f.send(f.host,'pointerup',220,110);assert.equal(copy.getItem('card.selected'),false);
    f.host.projectAttributes({locked:true});
    f.send(f.host,'pointerdown',0,0);assert.equal(f.host.shadowRoot.querySelector('.tray-marquee'),null);
});


test('tray membership alone supplies card chrome and resize works from authored dimensions',async t=>{
    const f=await fixture(t),row=f.store.getItem('card'),field=f.window.document.getElementById('field'),control=field.control;
    assert.equal(row.getNode('width'),null);
    assert.equal(f.box.dataset.variant,'card');assert.equal(f.box.labelbox.resizeHandle.hidden,false);
    f.send(f.box.labelbox.resizeHandle,'pointerdown',110,100);
    f.send(f.host,'pointermove',130,115);f.send(f.host,'pointerup',130,115);await settle();
    assert.equal(row.getItem('width'),120);assert.equal(row.getItem('height'),95);
    assert.equal(field.control,control);
});

test('closable tray card removes its Source and layout row while siblings keep their instance',async t=>{
    const f=await fixture(t,obstacle);
    sourceTarget(f.card).setAttr({closable:true});await settle();
    const other=f.window.document.getElementById('obstacle');
    const button=f.box.labelbox.closeButton;
    assert.equal(button.hidden,false);
    assert.equal(button.getAttribute('aria-label'),'Remove Customer');
    f.box.labelbox.traySettings.controls.scale.button.click();await settle();
    const popup=f.box.labelbox.traySettings.controls.scale.popup;
    const parent=sourceTarget(f.card).parentBag;
    button.click();await settle();
    assert.equal(parent.getNode('card'),null);
    assert.equal(f.store.getNode('card'),null);
    assert.equal(f.window.document.getElementById('card'),null);
    assert.equal(f.window.document.getElementById('obstacle'),other);
    assert.equal(popup.isConnected,false);
    assert.ok(f.store.getNode('other'));
});

test('tray close is opt-in and obeys layout lock and dynamic closable changes',async t=>{
    const f=await fixture(t);
    assert.equal(f.box.labelbox.closeButton,undefined);
    const card=sourceTarget(f.card);
    card.setAttr({closable:true});await settle();
    const button=f.box.labelbox.closeButton;
    card.parentNode.setAttr({locked:true});await settle();
    assert.equal(button.hidden,true);button.click();await settle();
    assert.ok(f.window.document.getElementById('card'));
    card.parentNode.setAttr({locked:false});card.setAttr({closable:false});await settle();
    assert.equal(button.hidden,true);button.click();await settle();
    assert.ok(f.store.getNode('card'));
    card.setAttr({closable:true});await settle();
    assert.equal(f.box.labelbox.closeButton,button);
    assert.equal(button.hidden,false);
});
