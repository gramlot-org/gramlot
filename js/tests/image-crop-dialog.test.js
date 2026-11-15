import {Bag} from '@genrojs/bag';
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {ImageCropDialog} from '../src/components/image-crop-dialog.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function fixture(t) {
    const {window} = new JSDOM('<body></body>');
    t.after(() => window.close());
    window.HTMLDialogElement.prototype.showModal = function () {this.open = true;};
    window.HTMLDialogElement.prototype.close = function () {this.open = false; this.dispatchEvent(new window.Event('close'));};
    const context = {scale() {},translate() {},rotate() {},drawImage() {}};
    window.HTMLCanvasElement.prototype.getContext = () => context;
    let encode;
    window.HTMLCanvasElement.prototype.toBlob = callback => {encode = callback;};
    const image = window.document.createElement('img'); image.src = 'data:image/png;base64,AA==';
    const editor = new ImageCropDialog({data:new Bag(),path:'crop',document:window.document,original:new window.Blob(['original']),image,
        sourceWidth:4,sourceHeight:2,width:2,height:2,outputWidth:4,outputHeight:4,type:'image/png'});
    const button = name => [...window.document.querySelectorAll('dialog button')].find(item => item.textContent === name);
    return {window,editor,button,complete:value => encode(value)};
}

test('dialog reports encoding failure and allows another confirmation', async t => {
    const f = fixture(t), result = f.editor.open();
    f.button('Confirm').click(); f.complete(null); await tick();
    assert.match(f.window.document.querySelector('[role=alert]').textContent, /encoding failed/);
    assert.equal(f.button('Confirm').disabled, false);
    f.button('Confirm').click();
    const blob = new f.window.Blob(['edited'],{type:'image/png'}); f.complete(blob);
    assert.equal((await result).blob, blob);
    assert.equal(f.window.document.querySelector('dialog'), null);
});

test('dialog cancellation ignores a late encoded image and releases its UI', async t => {
    const f = fixture(t), result = f.editor.open();
    f.button('Confirm').click();
    f.button('Cancel').click();
    assert.equal(await result, null);
    f.complete(new f.window.Blob(['edited'],{type:'image/png'}));
    await tick();
    assert.equal(f.window.document.querySelector('dialog'), null);
});

function gestureFixture(t) {
    const f = fixture(t), captures = new Set();
    f.window.HTMLElement.prototype.setPointerCapture = function(id) {captures.add(id);};
    f.window.HTMLElement.prototype.hasPointerCapture = function(id) {return captures.has(id);};
    f.window.HTMLElement.prototype.releasePointerCapture = function(id) {captures.delete(id);};
    f.result = f.editor.open();
    f.frame = f.window.document.querySelector('[aria-label="Crop preview"]');
    f.send = (type,id,x,y,pointerType='touch',mods={}) => {
        const event = new f.window.Event(type,{bubbles:true,cancelable:true});
        Object.assign(event,{pointerId:id,clientX:x,clientY:y,pointerType,button:0,shiftKey:false,altKey:false,ctrlKey:false,metaKey:false,...mods});
        f.frame.dispatchEvent(event);
    };
    f.values = () => {
        const transform = f.frame.querySelector('img').style.transform;
        const m = transform.match(/translate\((-?[\d.]+)px, (-?[\d.]+)px\) rotate\((-?[\d.]+)deg\) scale\(([\d.]+)\)/);
        assert.ok(m,transform); return {x:Number(m[1]),y:Number(m[2]),rotate:Number(m[3]),zoom:Number(m[4])};
    };
    f.finish = async () => { f.button('Confirm').click(); f.complete(new f.window.Blob(['crop'],{type:'image/png'})); return (await f.result).transform; };
    f.captures = captures;
    return f;
}
const near = (actual, expected) => assert.ok(Math.abs(actual-expected)<1e-6, `${actual} != ${expected}`);

test('mouse drag and Shift/Alt drag adjust position, zoom and rotation', async t => {
    const f = gestureFixture(t);
    f.send('pointerdown',1,0,0,'mouse'); f.send('pointermove',1,30,20,'mouse'); f.send('pointerup',1,30,20,'mouse');
    f.send('pointerdown',2,0,0,'mouse',{shiftKey:true}); f.send('pointermove',2,0,50,'mouse',{shiftKey:true}); f.send('pointerup',2,0,50,'mouse',{shiftKey:true});
    f.send('pointerdown',3,0,0,'mouse',{altKey:true}); f.send('pointermove',3,0,40,'mouse',{altKey:true}); f.send('pointerup',3,0,40,'mouse',{altKey:true});
    const v = await f.finish(); near(v.x,30); near(v.y,20); near(v.zoom,Math.exp(.5)); near(v.rotate,-40);
    assert.equal(f.captures.size,0);
});

test('two touch pointers move, zoom and rotate together and rebase when one lifts', async t => {
    const f = gestureFixture(t);
    f.send('pointerdown',1,-50,0); f.send('pointerdown',2,50,0);
    f.send('pointermove',1,20,-70); f.send('pointermove',2,20,130);
    let v=f.values(); near(v.x,20); near(v.y,30); near(v.zoom,2); near(v.rotate,90);
    f.send('pointerup',2,20,130); f.send('pointermove',1,30,-60); f.send('pointerup',1,30,-60);
    v=await f.finish(); near(v.x,30); near(v.y,40); near(v.zoom,2); near(v.rotate,90);
    assert.equal(f.captures.size,0);
});

test('pointer cancellation stops gestures and reset restores framing', async t => {
    const f=gestureFixture(t);
    f.send('pointerdown',1,0,0); f.send('pointermove',1,10,20); f.send('pointercancel',1,10,20);
    f.send('pointermove',1,50,60); assert.equal(f.captures.size,0);
    f.button('Reset').click(); assert.deepEqual(await f.finish(),{x:0,y:0,zoom:1,rotate:0});
});

test('trackpad pinch changes zoom without consuming ordinary scrolling', async t => {
    const f=gestureFixture(t);
    const scroll = new f.window.WheelEvent('wheel',{deltaY:-20,bubbles:true,cancelable:true});
    f.frame.dispatchEvent(scroll); assert.equal(scroll.defaultPrevented,false); near(f.values().zoom,1);
    const pinch = new f.window.WheelEvent('wheel',{deltaY:-50,ctrlKey:true,bubbles:true,cancelable:true});
    f.frame.dispatchEvent(pinch); assert.equal(pinch.defaultPrevented,true);
    const v=await f.finish(); near(v.zoom,Math.exp(.5)); near(v.rotate,0);
});

test('native trackpad gesture combines zoom and rotation without double counting wheel', async t => {
    const f=gestureFixture(t);
    const gesture=(type,scale,rotation) => {
        const event = new f.window.Event(type,{bubbles:true,cancelable:true});
        Object.assign(event,{scale,rotation}); f.frame.dispatchEvent(event); return event;
    };
    assert.equal(gesture('gesturestart',1,0).defaultPrevented,true);
    const wheel = new f.window.WheelEvent('wheel',{deltaY:-50,ctrlKey:true,bubbles:true,cancelable:true});
    f.frame.dispatchEvent(wheel); assert.equal(wheel.defaultPrevented,true);
    assert.equal(gesture('gesturechange',2,45).defaultPrevented,true);
    gesture('gestureend',2,45);
    const v=await f.finish(); near(v.zoom,2); near(v.rotate,45);
});

test('touch pointer gestures are not replaced by simultaneous native gesture events', async t => {
    const f=gestureFixture(t); f.send('pointerdown',1,0,0);
    const start = new f.window.Event('gesturestart',{bubbles:true,cancelable:true});
    Object.assign(start,{scale:1,rotation:0}); f.frame.dispatchEvent(start);
    f.send('pointermove',1,10,20); f.send('pointerup',1,10,20);
    const v=await f.finish(); near(v.x,10); near(v.y,20); near(v.zoom,1); near(v.rotate,0);
});

test('Alt-scroll rotates without clicking and ordinary scroll remains available', async t => {
    const f=gestureFixture(t);
    const scroll = new f.window.WheelEvent('wheel',{deltaY:40,bubbles:true,cancelable:true});
    f.frame.dispatchEvent(scroll); assert.equal(scroll.defaultPrevented,false);
    const rotate = new f.window.WheelEvent('wheel',{deltaY:40,altKey:true,bubbles:true,cancelable:true});
    f.frame.dispatchEvent(rotate); assert.equal(rotate.defaultPrevented,true);
    const v=await f.finish(); near(v.rotate,-10); near(v.zoom,1);
});

test('pinch takes precedence over Alt-scroll and active gestures are not duplicated', async t => {
    const f=gestureFixture(t);
    const pinch=new f.window.WheelEvent('wheel',{deltaY:-50,ctrlKey:true,altKey:true,bubbles:true,cancelable:true});
    f.frame.dispatchEvent(pinch);
    const start=new f.window.Event('gesturestart',{bubbles:true,cancelable:true}); f.frame.dispatchEvent(start);
    const rotate=new f.window.WheelEvent('wheel',{deltaY:40,altKey:true,bubbles:true,cancelable:true});
    f.frame.dispatchEvent(rotate); assert.equal(rotate.defaultPrevented,true);
    const change=new f.window.Event('gesturechange',{bubbles:true,cancelable:true});
    Object.assign(change,{scale:1,rotation:30}); f.frame.dispatchEvent(change);
    const end=new f.window.Event('gestureend',{bubbles:true,cancelable:true}); f.frame.dispatchEvent(end);
    const v=await f.finish(); near(v.zoom,Math.exp(.5)); near(v.rotate,30);
});

test('corner handles zoom and rotate without moving the image', async t => {
    const f=gestureFixture(t);
    f.frame.getBoundingClientRect = () => ({left:0,top:0,width:100,height:100});
    const sendDown=(caption,id,x,y) => {
        const button=f.window.document.querySelector(`button[aria-label="${caption}"]`);
        const event=new f.window.Event('pointerdown',{bubbles:true,cancelable:true});
        Object.assign(event,{pointerId:id,clientX:x,clientY:y,pointerType:'mouse',button:0,shiftKey:false,altKey:false,ctrlKey:false,metaKey:false});
        button.dispatchEvent(event);
    };
    sendDown('Zoom image',1,100,100); f.send('pointermove',1,150,150,'mouse'); f.send('pointerup',1,150,150,'mouse');
    sendDown('Rotate image',2,100,0); f.send('pointermove',2,100,100,'mouse'); f.send('pointerup',2,100,100,'mouse');
    const v=await f.finish();near(v.zoom,2);near(v.rotate,90);near(v.x,0);near(v.y,0);
});

test('corner handles support keyboard adjustment', async t => {
    const f=gestureFixture(t);
    for(const caption of ['Zoom image','Rotate image']) {
        f.window.document.querySelector(`button[aria-label="${caption}"]`).dispatchEvent(
            new f.window.KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true,cancelable:true}));
    }
    const v=await f.finish();near(v.zoom,1.05);near(v.rotate,5);
});


test('preview has no sliders and keyboard arrows move the image', async t => {
    const f=gestureFixture(t);
    assert.equal(f.window.document.querySelectorAll('dialog input[type=range]').length,0);
    f.frame.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true,cancelable:true}));
    f.frame.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',shiftKey:true,bubbles:true,cancelable:true}));
    const v=await f.finish();near(v.x,10);near(v.y,-1);
});
