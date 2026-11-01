import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {BrowserCameraProvider} from '../src/browser-camera-provider.js';
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
function fixture(t, getUserMedia) {
    const {window}=new JSDOM('<body></body>');t.after(()=>window.close());
    window.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
    window.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new window.Event('close'));};
    window.HTMLMediaElement.prototype.play=async function(){};
    Object.defineProperty(window.HTMLVideoElement.prototype,'videoWidth',{get(){return 12;},configurable:true});
    Object.defineProperty(window.HTMLVideoElement.prototype,'videoHeight',{get(){return 8;},configurable:true});
    window.HTMLCanvasElement.prototype.getContext=()=>({drawImage(){}});
    window.HTMLCanvasElement.prototype.toDataURL=()=> 'data:image/jpeg;base64,cGhvdG8=';
    if (getUserMedia) Object.defineProperty(window.navigator,'mediaDevices',{value:{getUserMedia},configurable:true});
    const provider=new BrowserCameraProvider({document:window.document});
    const button=caption=>[...window.document.querySelectorAll('dialog button')].find(button=>button.textContent===caption);
    return {window,provider,button};
}
function stream(window) {
    const track=new window.EventTarget();track.count=0;track.stop=()=>{track.count++;};
    return {track,value:{getTracks:()=>[track]}};
}

test('capture stops video and returns a JPEG data URL only after the user confirms',async t=>{
    let media,request;const f=fixture(t,async options=>{request=options;return media.value;});media=stream(f.window);
    const result=f.provider.takePhoto(new AbortController().signal);await tick();
    assert.deepEqual(request,{video:true,audio:false});assert.equal(f.button('Capture').disabled,false);assert.equal(media.track.count,0);
    f.button('Capture').click();assert.deepEqual(await result,{url:'data:image/jpeg;base64,cGhvdG8=',format:'jpeg'});
    assert.equal(media.track.count,1);assert.equal(f.window.document.querySelector('dialog'),null);
});

test('cancelling while permission is pending closes the dialog and stops a late stream',async t=>{
    let complete;const f=fixture(t,()=>new Promise(resolve=>{complete=resolve;})), media=stream(f.window);
    const result=f.provider.takePhoto(new AbortController().signal);await tick();
    f.button('Cancel').click();await assert.rejects(result,error=>error.code==='CANCELLED');
    complete(media.value);await tick();assert.equal(media.track.count,1);assert.equal(f.window.document.querySelector('dialog'),null);
});

test('aborting before acquisition does not request the camera',async t=>{
    let calls=0;const f=fixture(t,async()=>{calls++;throw new Error('unexpected');});
    const ctrl=new AbortController(),result=f.provider.takePhoto(ctrl.signal);ctrl.abort();
    await assert.rejects(result,error=>error.code==='CANCELLED');await tick();assert.equal(calls,0);
});

test('camera denial and a stopped stream produce explicit device outcomes',async t=>{
    const denied=fixture(t,async()=>{throw Object.assign(new Error('no'),{name:'NotAllowedError'});});
    await assert.rejects(denied.provider.takePhoto(new AbortController().signal),error=>error.code==='PERMISSION_DENIED');
    assert.equal(denied.window.document.querySelector('dialog'),null);
    let media;const f=fixture(t,async()=>media.value);media=stream(f.window);
    const result=f.provider.takePhoto(new AbortController().signal);await tick();media.track.dispatchEvent(new f.window.Event('ended'));
    await assert.rejects(result,error=>error.code==='UNAVAILABLE');assert.equal(media.track.count,1);
});

test('without browser camera support no camera capability is advertised',t=>{
    const f=fixture(t);assert.deepEqual(f.provider.capabilities,[]);
    return assert.rejects(f.provider.takePhoto(new AbortController().signal),error=>error.code==='UNAVAILABLE');
});

test('photo library selection and cancellation use the camera provider contract',async t=>{
    const f=fixture(t,async()=>{});f.window.HTMLInputElement.prototype.click=function(){};
    let result=f.provider.choosePhoto(new AbortController().signal), input=f.window.document.querySelector('input[type=file]');
    Object.defineProperty(input,'files',{value:[new f.window.File(['photo'],'x.png',{type:'image/png'})]});input.dispatchEvent(new f.window.Event('change'));
    assert.deepEqual(await result,{url:'data:image/png;base64,cGhvdG8=',format:'png'});
    result=f.provider.choosePhoto(new AbortController().signal);input=f.window.document.querySelector('input[type=file]');input.dispatchEvent(new f.window.Event('cancel'));
    await assert.rejects(result,error=>error.code==='CANCELLED');assert.equal(f.window.document.querySelector('input'),null);
});
