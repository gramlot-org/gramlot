import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import uploads from '../src/components/uploads.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
async function setup(t, operation = null, result = '/images/photo.png', contextPath = null, getDisplayMedia = null, onComplete = null, logic = null) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.URL.createObjectURL = () => 'blob:original'; window.URL.revokeObjectURL = () => {};
    window.Image = class { naturalWidth = 4; naturalHeight = 4; async decode() {} };
    window.HTMLDialogElement.prototype.showModal = function() { this.setAttribute('open',''); };
    window.HTMLDialogElement.prototype.close = function() { this.removeAttribute('open'); };
    window.HTMLCanvasElement.prototype.getContext = () => ({scale() {},translate() {},rotate() {},drawImage() {}});
    window.HTMLCanvasElement.prototype.toBlob = callback => callback(new window.Blob(['crop'],{type:'image/png'}));
    if (getDisplayMedia) Object.defineProperty(window.navigator,'mediaDevices',{value:{getDisplayMedia},configurable:true});
    window.HTMLMediaElement.prototype.play=async function(){};
    Object.defineProperty(window.HTMLVideoElement.prototype,'videoWidth',{get(){return 4;},configurable:true});
    Object.defineProperty(window.HTMLVideoElement.prototype,'videoHeight',{get(){return 4;},configurable:true});
    Object.defineProperty(window.HTMLVideoElement.prototype,'readyState',{get(){return 2;},configurable:true});
    let sent = 0;
    class Xhr extends window.EventTarget {
        constructor() { super(); this.upload = new window.EventTarget(); }
        open() {} setRequestHeader() {}
        send(file) { sent++; this.status = 200; this.responseText = toTytx({state:'completed',result}); queueMicrotask(() => this.dispatchEvent(new window.Event('load'))); }
        abort() { this.dispatchEvent(new window.Event('abort')); }
    }
    window.XMLHttpRequest = Xhr;
    const app = new Gramlot({document:window.document,transport:false,pageId:'page',uploadUrl:'/upload',capabilities:['upload'],collections:[uploads]});
    const calls = [];
    app.rpc.call = async (type,name,params) => { calls.push({type,name,params}); return {transferId:'transfer',authorization:'secret'}; };
    const store = new Bag(); app.data.setItem('form.queue',store); app.data.setItem('form.image',null);
    app.data.setItem('form.context',new Bag({recordId:'saved-image-record'}));
    if (logic) app.src.logicRegistry.register(logic, {group:null, resource:'/image-upload-test.js'});
    const b = new GramlotBuilder(null,{collections:[uploads]});
    b.root.div({datapath:'form'}).imageUploader({id:'image',value:'^.image',storepath:'.queue',contextPath,operation,onComplete});
    app.src.startSource(b.toTytx());
    const host = window.document.getElementById('image');
    const file = new window.File(['original'],'photo.jpg',{type:'image/jpeg'});
    Object.defineProperty(host.input,'files',{value:[file],configurable:true});
    t.after(() => {app.dispose();window.close();});
    const select = async () => {host.input.dispatchEvent(new window.Event('change')); await tick();};
    const action = async caption => {const dialog = window.document.querySelector('dialog'); assert.ok(dialog); [...dialog.querySelectorAll('button')].find(el => el.textContent === caption).click(); await tick(); await tick();};
    return {window,app,host,store,calls,select,action,get sent(){return sent;}};
}

test('browser crop updates only the bound data URL after confirmation', async t => {
    const f = await setup(t); await f.select();
    assert.equal(f.app.data.getItem('form.image'),null);
    await f.action('Confirm');
    assert.equal(f.app.data.getItem('form.image'),'data:image/png;base64,Y3JvcA==');
    assert.equal(f.sent,0); assert.equal(f.store.getNodes().length,0);
    f.host.editButton.click(); await tick(); await f.action('Cancel');
    assert.equal(f.app.data.getItem('form.image'),'data:image/png;base64,Y3JvcA==');
});

test('server crop uses shared upload and writes the returned image URL', async t => {
    const f = await setup(t,'save_image'); await f.select(); await f.action('Confirm');
    assert.equal(f.sent,1); assert.equal(f.app.data.getItem('form.image'),'/images/photo.png');
    assert.equal(f.store.getNodes()[0].value.getItem('status'),'completed');
    assert.equal(f.store.toTytx().includes('secret'),false);
});

test('image uploader invokes its declared completion logic after server upload', async t => {
    let received;
    const f = await setup(t,'save_image','/images/photo.png',null,null,'done',class { done(node, payload) { received = payload.result; } });
    await f.select(); await f.action('Confirm');
    assert.equal(received,'/images/photo.png');
});

test('invalid server result preserves the previous image', async t => {
    const f = await setup(t,'save_image',42); await f.select(); await f.action('Confirm');
    assert.equal(f.app.data.getItem('form.image'),null);
    assert.match(f.host.message.textContent,/displayable URL/);
});

test('uncertain server upload is checked before applying its result', async t => {
    const f = await setup(t,'save_image');
    class Lost extends f.window.EventTarget {
        constructor() { super(); this.upload = new f.window.EventTarget(); }
        open() {} setRequestHeader() {}
        send() { queueMicrotask(() => this.dispatchEvent(new f.window.Event('error'))); }
        abort() { this.dispatchEvent(new f.window.Event('abort')); }
    }
    f.window.XMLHttpRequest = Lost;
    let checks = 0;
    f.app.rpc.call = async (type,name) => name === 'prepare' ? {transferId:'transfer',authorization:'secret'} :
        (++checks === 1 ? {state:'pending'} : {state:'completed',result:'/images/recovered.png'});
    await f.select(); await f.action('Confirm');
    assert.equal(f.app.data.getItem('form.image'),null);
    assert.equal(f.store.getNodes()[0].value.getItem('status'),'uncertain');
    assert.equal(f.host.checkButton.hidden,false); assert.equal(f.host.chooseButton.disabled,true);
    f.host.checkButton.click(); await tick(); await tick();
    assert.equal(f.app.data.getItem('form.image'),'/images/recovered.png');
    assert.equal(f.host.chooseButton.disabled,false);
});

test('external value change cancels an open edit without overwriting it', async t => {
    const f = await setup(t); await f.select();
    assert.ok(f.window.document.querySelector('dialog'));
    f.app.data.setItem('form.image','/images/external.png'); await tick();
    assert.equal(f.window.document.querySelector('dialog'),null);
    assert.equal(f.app.data.getItem('form.image'),'/images/external.png');
});


test('image upload uses the same shared application context', async t => {
    const f=await setup(t,'save_image','/images/saved.png','.context');
    await f.select(); await f.action('Confirm');
    assert.deepEqual(f.calls[0].params.metadata.context,{recordId:'saved-image-record'});
    assert.deepEqual(f.calls[0].params.metadata.fields,{});
    assert.equal(f.app.data.getItem('form.image'),'/images/saved.png');
});

test('camera capability attached after rendering opens the same editor and saves locally', async t => {
    const f=await setup(t); let calls=0;
    assert.equal(f.host.cameraButton.hidden,true);
    f.app.dvc.attach({capabilities:['camera'],async takePhoto(){calls++;return {url:'data:image/jpeg;base64,cGhvdG8=',format:'jpeg'};}});
    await tick(); assert.equal(f.host.cameraButton.hidden,false);
    f.host.cameraButton.click(); await tick(); await tick();
    assert.equal(calls,1);assert.ok(f.window.document.querySelector('dialog'));
    assert.equal(f.app.data.getItem('form.image'),null);
    await f.action('Confirm');
    assert.equal(f.app.data.getItem('form.image'),'data:image/png;base64,Y3JvcA==');
});

test('camera capture uses the same server upload and shared record context', async t => {
    const f=await setup(t,'save_image','/images/camera.png','.context');
    f.app.dvc.attach({capabilities:['camera'],async takePhoto(){return {url:'data:image/jpeg;base64,cGhvdG8=',format:'jpeg'};}});
    await tick(); f.host.cameraButton.click(); await tick(); await tick(); await f.action('Confirm');
    assert.equal(f.app.data.getItem('form.image'),'/images/camera.png');
    assert.deepEqual(f.calls[0].params.metadata.context,{recordId:'saved-image-record'});
    assert.equal(f.sent,1);
});

test('camera cancellation and denied permission preserve the current value and allow retry', async t => {
    const f=await setup(t);let code='CANCELLED';
    f.app.data.setItem('form.image','data:image/png;base64,b2xk');
    f.app.dvc.attach({capabilities:['camera'],async takePhoto(){throw Object.assign(new Error('Camera denied'),{code});}});
    await tick();f.host.cameraButton.click();await tick();await tick();
    assert.equal(f.app.data.getItem('form.image'),'data:image/png;base64,b2xk');
    assert.equal(f.window.document.querySelector('dialog'),null);assert.equal(f.host.cameraButton.disabled,false);
    code='PERMISSION_DENIED';f.host.cameraButton.click();await tick();await tick();
    assert.equal(f.app.data.getItem('form.image'),'data:image/png;base64,b2xk');
    assert.match(f.host.message.textContent,/Camera denied/);assert.equal(f.host.cameraButton.disabled,false);
});

test('removing the image component ignores a late camera result', async t => {
    const f=await setup(t);let complete;
    f.app.dvc.attach({capabilities:['camera'],takePhoto(){return new Promise(resolve=>{complete=resolve;});}});
    await tick();f.host.cameraButton.click();await tick();
    f.host.remove();complete({url:'data:image/jpeg;base64,cGhvdG8=',format:'jpeg'});await tick();await tick();
    assert.equal(f.window.document.querySelector('dialog'),null);
    assert.equal(f.app.data.getItem('form.image'),null);
});

test('camera capture cannot start twice and an external image change wins over a late photo', async t => {
    const f=await setup(t);let complete,calls=0;
    f.app.dvc.attach({capabilities:['camera'],takePhoto(){calls++;return new Promise(resolve=>{complete=resolve;});}});
    await tick();f.host.cameraButton.click();await tick();
    assert.equal(f.host.cameraButton.disabled,true);f.host.cameraButton.click();assert.equal(calls,1);
    f.app.data.setItem('form.image','/images/newer.png');
    complete({url:'data:image/jpeg;base64,cGhvdG8=',format:'jpeg'});await tick();await tick();
    assert.equal(f.app.data.getItem('form.image'),'/images/newer.png');
    assert.equal(f.window.document.querySelector('dialog'),null);
});

test('a device provider without camera does not expose the take-photo action', async t => {
    const f=await setup(t);
    f.app.dvc.attach({capabilities:[]});await tick();assert.equal(f.host.cameraButton.hidden,true);
});

test('dropping one image opens the same crop editor',async t=>{
    const f=await setup(t), box=f.host.control.querySelector('.image-uploader');
    const file=new f.window.File(['original'],'dropped.png',{type:'image/png'});
    const event=new f.window.Event('drop',{bubbles:true,cancelable:true});
    Object.defineProperty(event,'dataTransfer',{value:{types:['Files'],files:[file]}});
    box.dispatchEvent(event);assert.equal(event.defaultPrevented,true);await tick();
    assert.ok(f.window.document.querySelector('dialog'));await f.action('Confirm');
    assert.equal(f.app.data.getItem('form.image'),'data:image/png;base64,Y3JvcA==');
});

test('image drop rejects several files and ignores a disabled component',async t=>{
    const f=await setup(t), box=f.host.control.querySelector('.image-uploader');
    const file=new f.window.File(['x'],'x.png',{type:'image/png'});
    const drop=files=>{const event=new f.window.Event('drop',{bubbles:true,cancelable:true});
        Object.defineProperty(event,'dataTransfer',{value:{types:['Files'],files}});box.dispatchEvent(event);return event;};
    assert.equal(drop([file,file]).defaultPrevented,true);assert.match(f.host.message.textContent,/one image/);
    f.host.projectAttributes({value:null,storepath:'.queue',contextPath:null,operation:null,disabled:true},x=>x);
    assert.equal(drop([file]).defaultPrevented,false);await tick();assert.equal(f.window.document.querySelector('dialog'),null);
});


function fakeDisplay(window) {
    const track=new window.EventTarget();track.stopped=0;track.stop=()=>{track.stopped++;};
    return {track,stream:{getTracks:()=>[track]}};
}

test('screen selection captures a frame, stops sharing and opens the same local editor',async t=>{
    let f,requested=0,options;const media=()=>{requested++;return Promise.resolve(display.stream);};
    f=await setup(t,null,'/images/photo.png',null,params=>{options=params;return media();});
    const display=fakeDisplay(f.window);
    assert.equal(f.host.screenButton.hidden,false);f.host.screenButton.click();
    assert.equal(requested,1);assert.deepEqual(options,{video:true,audio:false});
    await tick();await tick();assert.equal(display.track.stopped,1);assert.ok(f.window.document.querySelector('dialog'));
    assert.equal(f.app.data.getItem('form.image'),null);await f.action('Confirm');
    assert.equal(f.app.data.getItem('form.image'),'data:image/png;base64,Y3JvcA==');
});

test('screen image uses the existing server upload and shared context',async t=>{
    let display;const f=await setup(t,'save_image','/images/screen.png','.context',()=>Promise.resolve(display.stream));
    display=fakeDisplay(f.window);f.host.screenButton.click();await tick();await tick();await f.action('Confirm');
    assert.equal(display.track.stopped,1);assert.equal(f.sent,1);
    assert.deepEqual(f.calls[0].params.metadata.context,{recordId:'saved-image-record'});
    assert.equal(f.calls[0].params.metadata.name,'screen.png');assert.equal(f.app.data.getItem('form.image'),'/images/screen.png');
});

test('cancelling a screen chooser stops a late stream and retains the current image',async t=>{
    let complete;const f=await setup(t,null,'/images/photo.png',null,()=>new Promise(resolve=>{complete=resolve;}));
    const display=fakeDisplay(f.window);f.app.data.setItem('form.image','/images/old.png');
    f.host.screenButton.click();assert.equal(f.host.cancelScreenButton.hidden,false);
    f.host.cancelScreenButton.click();await tick();complete(display.stream);await tick();
    assert.equal(display.track.stopped,1);assert.equal(f.app.data.getItem('form.image'),'/images/old.png');
    assert.equal(f.window.document.querySelector('dialog'),null);assert.equal(f.host.screenButton.disabled,false);
});

test('screen chooser denial retains the value and unsupported browsers hide the action',async t=>{
    const unavailable=await setup(t);assert.equal(unavailable.host.screenButton.hidden,true);
    const denied=await setup(t,null,'/images/photo.png',null,()=>Promise.reject(Object.assign(new Error('denied'),{name:'NotAllowedError'})));
    denied.app.data.setItem('form.image','/images/old.png');denied.host.screenButton.click();await tick();
    assert.equal(denied.app.data.getItem('form.image'),'/images/old.png');assert.match(denied.host.message.textContent,/cancelled or not permitted/);
});

test('the crop framing lives in the private Data area of the imageUploader node', async t => {
    const f = await setup(t); await f.select();
    const node = f.app.src.renderer.elements.get(f.host).node, path = node.workspaceDatapath;
    assert.match(path, /^_gramlot\.workspace\.imageUploader_/);
    assert.equal(node.imageCropState, undefined);
    assert.deepEqual(Object.keys(f.app.data.getItem(`${path}.transform`)).sort(), ['rotate','x','y','zoom']);
    assert.deepEqual(f.app.data.getItem(`${path}.transform`), f.app.data.getItem(`${path}.initial`));
    await f.action('Cancel');
});

test('the server queue is reached by address: a replacement at storepath receives the next upload', async t => {
    const f = await setup(t, 'save_image');
    const replacement = new Bag(); f.app.data.setItem('form.queue', replacement); await tick();
    await f.select(); await f.action('Confirm');
    assert.equal(f.app.data.getItem('form.image'), '/images/photo.png');
    assert.equal(replacement.getNodes().length, 1); assert.equal(f.store.getNodes().length, 0);
    assert.equal(replacement.getNodes()[0].value.getItem('status'), 'completed');
});
