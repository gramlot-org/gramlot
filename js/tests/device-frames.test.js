import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {DeviceFrameHost,FrameDeviceProvider} from '../src/device-frames.js';
const tick=()=>new Promise(resolve=>setTimeout(resolve,15));
function fixture(t,createProvider) {
    const dom=new JSDOM('<main></main>',{url:'https://parent.test/'}),window=dom.window;
    const owned=new Set();
    const host=new DeviceFrameHost({window,origins:['https://child.test'],resolveFrame:source=>[...owned].find(f=>f.contentWindow===source),createProvider});
    t.after(()=>{host.dispose();window.close();});
    async function connect({origin='https://child.test',authorized=true}={}) {
        const frame=window.document.createElement('iframe');frame.src=origin+'/probe';window.document.body.append(frame);if(authorized)owned.add(frame);
        const events=new EventTarget();
        const child={document:{readyState:'complete'},MessageChannel,addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events),
            parent:{postMessage:(data,target,ports)=>{assert.equal(target,'https://parent.test');window.dispatchEvent(new window.MessageEvent('message',{data,origin,source:frame.contentWindow,ports}));}}};
        const provider=await FrameDeviceProvider.connect({window:child,parentOrigin:'https://parent.test',timeout:80});
        t.after(()=>provider.dispose());return {provider,frame};
    }
    return {host,window,connect};
}
test('frames have independent provider results and errors; native entry capabilities stay at the top',async t=>{
    let sequence=0;
    const f=fixture(t,()=>{const id=++sequence;return {capabilities:['appinfo','camera','links','shortcuts'],async readAppInfo(){return {id:String(id)};},async takePhoto(){throw Object.assign(new Error('Declined'),{code:'PERMISSION_DENIED'});}};});
    const a=await f.connect(),b=await f.connect();
    assert.deepEqual(a.provider.capabilities,['appinfo','camera']);
    assert.deepEqual(await a.provider.readAppInfo(),{id:'1'});assert.deepEqual(await b.provider.readAppInfo(),{id:'2'});
    await assert.rejects(a.provider.takePhoto(new AbortController().signal),{code:'PERMISSION_DENIED',message:'Declined'});
    await assert.rejects(a.provider.invoke('constructor',[]),/Unknown device method/);
});
test('unowned and wrong-origin frames cannot connect',async t=>{
    let calls=0;const f=fixture(t,()=>{calls++;return {capabilities:[]};});
    await assert.rejects(f.connect({authorized:false}),{code:'UNAVAILABLE'});
    await assert.rejects(f.connect({origin:'https://untrusted.test'}),{code:'UNAVAILABLE'});
    assert.equal(calls,0);
});
test('stream events belong to their frame; removal cleans subscriptions and closes the provider',async t=>{
    const callbacks=[];let stopped=0;
    const f=fixture(t,()=>({capabilities:['network'],async startNetworkEvents(cb){callbacks.push(cb);return async()=>{stopped++;};}}));
    const a=await f.connect(),b=await f.connect(),receivedA=[],receivedB=[];
    await a.provider.startNetworkEvents(v=>receivedA.push(v),new AbortController().signal);
    const stopB=await b.provider.startNetworkEvents(v=>receivedB.push(v),new AbortController().signal);
    callbacks[0]({connected:true,type:'wifi'});await tick();assert.equal(receivedA.length,1);assert.equal(receivedB.length,0);
    a.frame.remove();await tick();callbacks[0]({connected:false,type:'none'});await tick();
    assert.equal(stopped,1);assert.equal(receivedA.length,1);assert.equal(a.provider.closed,true);
    await stopB();assert.equal(stopped,2);
});
test('one native modal at a time; cancellation rejects and suppresses late result',async t=>{
    let complete,signal;
    const f=fixture(t,()=>({capabilities:['camera'],takePhoto(s){signal=s;return new Promise(resolve=>{complete=resolve;});}}));
    const a=await f.connect(),b=await f.connect(),abort=new AbortController();
    const pending=a.provider.takePhoto(abort.signal);const rejected=assert.rejects(pending,{code:'CANCELLED'});await tick();
    await assert.rejects(b.provider.takePhoto(new AbortController().signal),/Another frame/);
    abort.abort();await rejected;await tick();assert.equal(signal.aborted,true);
    complete({url:'late',format:'jpeg'});await tick();assert.equal(a.provider.pending.size,0);
});
test('audio session methods remain tied to the owning frame and disposal releases microphone',async t=>{
    let stopped=0,disposed=0;
    const f=fixture(t,()=>({capabilities:['audio'],async startAudioRecording(){return {async stop(){stopped++;return {url:'blob:audio',duration:3,mimeType:'audio/aac'};},async share(){return {activity:'save'};},async dispose(){disposed++;}};}}));
    const a=await f.connect(),b=await f.connect();
    const session=await a.provider.startAudioRecording(()=>{},new AbortController().signal);
    await assert.rejects(b.provider.startAudioRecording(()=>{},new AbortController().signal),/Another frame/);
    assert.equal((await session.stop()).duration,3);assert.equal(stopped,1);
    assert.deepEqual(await session.share(new AbortController().signal),{activity:'save'});
    await session.dispose();assert.equal(disposed,1);assert.equal(f.host.audio,null);
});
test('late listener setup after frame removal is released; iframe load invalidates old connection',async t=>{
    let complete,stopped=0;
    const f=fixture(t,()=>({capabilities:['network'],startNetworkEvents(){return new Promise(resolve=>{complete=resolve;});}}));
    const a=await f.connect();const pending=a.provider.startNetworkEvents(()=>{},new AbortController().signal);
    const rejected=assert.rejects(pending,{code:'CANCELLED'});await tick();
    a.frame.dispatchEvent(new f.window.Event('load'));await rejected;
    complete(async()=>{stopped++;});await tick();assert.equal(stopped,1);
});

test('closing during microphone startup retains its exclusive lease until cleanup completes',async t=>{
    let complete,disposed=0;
    const f=fixture(t,()=>({capabilities:['audio'],startAudioRecording(){return new Promise(resolve=>{complete=resolve;});}}));
    const a=await f.connect(),b=await f.connect();
    const pending=a.provider.startAudioRecording(()=>{},new AbortController().signal);
    const rejected=assert.rejects(pending,{code:'CANCELLED'});await tick();a.frame.remove();await rejected;
    await assert.rejects(b.provider.startAudioRecording(()=>{},new AbortController().signal),/Another frame/);
    complete({dispose:async()=>{disposed++;}});await tick();
    assert.equal(disposed,1);assert.equal(f.host.audio,null);
});


test('motion and orientation streams cross frames independently and release on frame removal',async t=>{
    const listeners=[],removed=[];
    const f=fixture(t,()=>({capabilities:['orientation','gyroscope','accelerometer'],
        ...Object.fromEntries(['startOrientationEvents','startGyroscopeUpdates','startAccelerometerUpdates'].map(name=>[name,async cb=>{
            const entry={name,cb};listeners.push(entry);return async()=>{removed.push(entry);};
        }]))}));
    const a=await f.connect(), b=await f.connect(), received=[];
    const sa=new AbortController(),sb=new AbortController();
    await a.provider.startGyroscopeUpdates(value=>received.push(value),sa.signal);
    await a.provider.startOrientationEvents(()=>{},sa.signal);
    const stop=await b.provider.startAccelerometerUpdates(()=>{},sb.signal);
    listeners[0].cb({kind:'error',error:Object.assign(new Error('Denied'),{code:'PERMISSION_DENIED'})});
    await tick();assert.ok(received[0].error instanceof Error);assert.equal(received[0].error.code,'PERMISSION_DENIED');
    a.frame.remove();await tick();assert.equal(removed.length,2);assert.equal(f.host.connections.size,1);
    await stop();assert.equal(removed.length,3);
});


test('database resources isolate frames, forward parameters and close on frame removal',async t=>{
    let opens=0,closes=0;
    const f=fixture(t,()=>({capabilities:['database'],async openDatabase(name){const id=++opens;return {
        async query(sql,params){return [{id,name,sql,value:params[':text']}];},async execute(){},async close(){closes++;}};}}));
    const a=await f.connect(),b=await f.connect();
    const da=await a.provider.openDatabase('notes',new AbortController().signal), db=await b.provider.openDatabase('notes',new AbortController().signal);
    assert.deepEqual(await da.query('SELECT :text',{':text':'hello'}),[{id:1,name:'notes',sql:'SELECT :text',value:'hello'}]);
    assert.equal((await db.query('SELECT :text',{':text':'other'}))[0].id,2);
    a.frame.remove();await tick();assert.equal(closes,1);
    await db.close();assert.equal(closes,2);
    await assert.rejects(db.query('SELECT',[]),/Unknown device resource/);
});
