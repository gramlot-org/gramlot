import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, Bag} from '../src/index.js';
import inputs from '../src/components/inputs.js';
import {sourceTarget} from '@genrojs/builders';
import {fromTytx, toTytx} from '@genrojs/tytx';

const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return {promise,resolve,reject}; };
const info = {id:'test.device', name:'Device test', version:'1', build:'1'};
const position = timestamp => ({latitude:45, longitude:9, accuracy:12, timestamp});
const photo = {url:'capacitor://localhost/_capacitor_file_/test.jpg', format:'jpeg'};
const capture = f => sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.camera?capture');
function fixture(t, overrides={}) {
    const {window} = new JSDOM('<main></main>');
    const app = new Gramlot({document:window.document, element:window.document.querySelector('main'), transport:false, collections:[inputs]});
    t.after(() => { app.dispose(); window.close(); });
    let reads=0, starts=0, stops=0, callback;
    const provider={capabilities:['appinfo','location'],
        async readAppInfo() { reads++; return info; },
        async readLocation() { reads++; return position(100); },
        async startLocationUpdates(cb) { starts++; callback=cb; return async () => {stops++;}; }, ...overrides};
    app.dvc.attach(provider);
    const node=name => app.data.getNode(`gramlot.device.${name}`);
    return {app, node, window, data:app.data, provider,
        get reads(){return reads;}, get starts(){return starts;}, get stops(){return stops;},
        emit(value,error=null){callback(value,error);}};
}

test('initialization is lazy; first read is nonblocking and pending reads deduplicate', async t => {
    const pending=deferred(); let calls=0;
    const f=fixture(t,{readAppInfo(){calls++; return pending.promise;}});
    assert.equal(f.node('appinfo').staticValue,null);
    assert.equal(f.node('appinfo').attr.status,'idle');
    assert.deepEqual(f.node('location').attr,{status:'idle',error:null,cacheTime:5,enabled:false,watching:false});
    assert.equal(f.node('appinfo').value,null);
    assert.equal(f.node('appinfo').value,null);
    assert.equal(f.node('appinfo').attr.status,'pending');
    await flush(); assert.equal(calls,1);
    pending.resolve(info); await flush();
    assert.ok(f.node('appinfo').staticValue instanceof Bag);
    assert.equal(f.node('appinfo').value.getItem('id'),info.id);
    assert.equal(f.node('appinfo').attr.status,'success');
    assert.equal(f.app.dvc.refresh('appinfo'),undefined);
});

test('failed refresh retains value and requires explicit retry or invalidation', async t => {
    let fail=false, calls=0;
    const f=fixture(t,{async readLocation(){calls++; if(fail) throw Object.assign(new Error('Timeout'),{code:'TIMEOUT'}); return position(10);}});
    f.app.dvc.refresh('location'); await flush();
    const saved=f.node('location').staticValue;
    fail=true; f.app.dvc.refresh('location'); await flush();
    assert.equal(f.node('location').value,saved);
    assert.equal(f.node('location').attr.error.code,'TIMEOUT');
    for(let i=0;i<4;i++) void f.node('location').value;
    await flush(); assert.equal(calls,2);
    fail=false; f.app.dvc.invalidate('location');
    assert.equal(f.node('location').attr.status,'error');
    void f.node('location').value; await flush();
    assert.equal(calls,3); assert.equal(f.node('location').attr.error,null);
});

test('cache TTL, zero-cache reactive writes and reset preserve the value', async t => {
    const f=fixture(t);
    f.app.dvc.refresh('location'); await flush();
    void f.node('location').value; await flush(); assert.equal(f.reads,1);
    f.node('location').resolver._lastUpdate=Date.now()-6000;
    void f.node('location').value; await flush(); assert.equal(f.reads,2);
    f.node('location').setAttr({cacheTime:0});
    f.data.subscribe('consumer',{update:event=>{if(event.node===f.node('location')) void f.node('location').value;}});
    void f.node('location').value; await flush();
    assert.equal(f.reads,3);
    const saved=f.node('location').staticValue;
    f.app.dvc.invalidate('location'); assert.equal(f.node('location').staticValue,saved);
});

test('enabled owns one listener; watching is effective; reads reuse streamed data', async t => {
    const f=fixture(t);
    f.node('location').setAttr({enabled:true});
    assert.equal(f.node('location').attr.watching,false);
    await flush(); assert.equal(f.starts,1); assert.equal(f.node('location').attr.watching,true);
    f.node('location').setAttr({enabled:true}); await flush(); assert.equal(f.starts,1);
    f.emit(position(200));
    f.node('location').resolver._lastUpdate=0;
    assert.equal(f.node('location').value.getItem('timestamp'),200); await flush(); assert.equal(f.reads,0);
    f.app.dvc.refresh('location'); await flush(); assert.equal(f.reads,1);
    assert.equal(f.node('location').staticValue.getItem('timestamp'),200);
    f.node('location').setAttr({enabled:false}); await flush();
    assert.equal(f.stops,1); assert.equal(f.node('location').attr.watching,false);
    f.emit(position(300)); assert.equal(f.node('location').staticValue.getItem('timestamp'),200);
    assert.equal(f.app.dvc.watch,undefined); assert.equal(f.app.dvc.unwatch,undefined);
});

test('stop during asynchronous startup cleans up late handle and ignores events', async t => {
    const ready=deferred(); let signal, callback, stops=0;
    const f=fixture(t,{startLocationUpdates(cb,s){signal=s; callback=cb; return ready.promise;}});
    f.node('location').setAttr({enabled:true}); await flush();
    f.node('location').setAttr({enabled:false}); assert.equal(signal.aborted,true);
    ready.resolve(async()=>{stops++;}); await flush();
    callback(position(5),null); assert.equal(f.node('location').staticValue,null);
    assert.equal(stops,1); assert.equal(f.node('location').attr.watching,false);
});

test('denied monitoring preserves intent without automatic retries on metadata writes', async t => {
    let calls=0;
    const f=fixture(t,{async startLocationUpdates(){calls++; throw Object.assign(new Error('Denied'),{code:'PERMISSION_DENIED'});}});
    f.node('location').setAttr({enabled:true}); await flush();
    assert.equal(f.node('location').attr.enabled,true);
    assert.equal(f.node('location').attr.watching,false);
    assert.equal(f.node('location').attr.status,'denied');
    f.node('location').setAttr({cacheTime:10}); await flush(); assert.equal(calls,1);
});

test('disposal releases listener and rejects late point results', async t => {
    const pending=deferred(); const f=fixture(t,{readAppInfo:()=>pending.promise});
    f.app.dvc.refresh('appinfo'); f.node('location').setAttr({enabled:true}); await flush();
    const events=[]; f.data.subscribe('assert-disposed',{any:e=>events.push(e)});
    f.app.dispose(); await flush(); assert.equal(f.stops,1);
    pending.resolve(info); f.emit(position(20)); await flush(); assert.equal(events.length,0);
});

test('unavailable capability and bad names are explicit, without simulated data', async t => {
    const f=fixture(t,{capabilities:[]});
    f.app.dvc.refresh('appinfo'); await flush();
    assert.equal(f.node('appinfo').attr.status,'unavailable');
    assert.equal(f.node('appinfo').attr.error.code,'UNAVAILABLE');
    assert.equal(f.node('appinfo').staticValue,null);
    assert.throws(()=>f.app.dvc.refresh('App.getInfo'),/Unknown device/);
    assert.throws(()=>f.app.dvc.attach(f.provider),/already attached/);
    assert.throws(()=>f.node('appinfo').setAttr({cacheTime:-0.5}),/cacheTime/);
});

test('real Source bindings reflect location fields and write enabled attributes', async t => {
    const f=fixture(t);
    const b=new GramlotBuilder(null,{collections:[inputs]});
    b.root.checkbox({value:'^gramlot.device.location?enabled',id:'enabled'});
    b.root.span('^gramlot.device.location.latitude',{id:'latitude'});
    f.app.src.startSource(b.source);
    await flush();
    const input=f.window.document.getElementById('enabled').control;
    input.checked=true; input.dispatchEvent(new f.window.Event('change',{bubbles:true}));
    await flush(); assert.equal(f.node('location').attr.enabled,true);
    f.emit(position(30));
    assert.equal(f.window.document.getElementById('latitude').textContent,'45');
});

test('a controller can cancel synchronously when startup sets pending',async t=>{
    const f=fixture(t);
    f.data.subscribe('cancel-start',{update:event=>{
        if(event.node===f.node('location') && event.node.attr.status==='pending' && event.node.attr.enabled) {
            event.node.setAttr({enabled:false});
        }
    }});
    f.node('location').setAttr({enabled:true});await flush();
    assert.equal(f.starts,0);assert.equal(f.node('location').attr.status,'cancelled');
});

test('rapid disable/re-enable waits for obsolete startup cleanup',async t=>{
    const first=deferred();let starts=0,stops=0;
    const f=fixture(t,{startLocationUpdates(){starts++;return starts===1?first.promise:Promise.resolve(async()=>{stops++;});}});
    f.node('location').setAttr({enabled:true});await flush();
    f.node('location').setAttr({enabled:false});f.node('location').setAttr({enabled:true});await flush();
    assert.equal(starts,1);
    first.resolve(async()=>{stops++;});await flush();assert.equal(stops,1);assert.equal(starts,2);
    assert.equal(f.node('location').attr.watching,true);
});

test('effective listening remains true until asynchronous stop completes',async t=>{
    const stop=deferred();const f=fixture(t,{async startLocationUpdates(){return ()=>stop.promise;}});
    f.node('location').setAttr({enabled:true});await flush();
    f.node('location').setAttr({enabled:false});await flush();assert.equal(f.node('location').attr.watching,true);
    stop.resolve();await flush();assert.equal(f.node('location').attr.watching,false);
});

test('a late point failure cannot replace a more recent streamed success',async t=>{
    const point=deferred();const f=fixture(t,{readLocation:()=>point.promise});
    f.node('location').setAttr({enabled:true});await flush();
    f.app.dvc.refresh('location');await flush();f.emit(position(900));
    point.reject(new Error('Late failure'));await flush();
    assert.equal(f.node('location').attr.status,'success');assert.equal(f.node('location').attr.error,null);
    assert.equal(f.node('location').staticValue.getItem('timestamp'),900);
});

test('invalidation during a pending read leaves its accepted value stale',async t=>{
    const result=deferred();const f=fixture(t,{readAppInfo:()=>result.promise});
    f.app.dvc.refresh('appinfo');await flush();f.app.dvc.invalidate('appinfo');
    result.resolve(info);await flush();assert.equal(f.node('appinfo').staticValue.getItem('id'),info.id);
    assert.equal(f.node('appinfo').resolver.expired,true);
});

test('camera reads and ordinary attribute writes never open camera; only capture FIRE does', async t => {
    let calls=0;
    const f=fixture(t,{capabilities:['camera'], async takePhoto(){calls++;return photo;}});
    assert.equal(f.data.getItem('gramlot.device.camera'),null);
    assert.equal(f.data.getItem('gramlot.device.camera.url'),null);
    assert.equal(f.node('camera').resolver,null);
    f.node('camera').setAttr({capture:true});
    sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.camera?other');
    await flush(); assert.equal(calls,0);
    assert.throws(()=>f.app.dvc.refresh('camera'),/Unknown device value/);
    capture(f); assert.equal(f.node('camera').attr.status,'pending');
    assert.equal(f.node('camera').getAttr('capture')??null,null);
    await flush();assert.equal(calls,1);
    assert.deepEqual(Object.fromEntries(['url','format'].map(key=>[key,f.data.getItem('gramlot.device.camera').getItem(key)])),photo);
    assert.equal(f.node('camera').attr.status,'success');
});

test('capture result updates ordinary image binding and pending disables the command button',async t=>{
    const pending=deferred();let calls=0;
    const f=fixture(t,{capabilities:['camera'],takePhoto(){calls++;return pending.promise;}});
    class Logic { pending({status}){return status==='pending';} }
    f.app.src.logicRegistry.register(Logic,{group:null,resource:'/test.js'});
    const b=new GramlotBuilder(null,{collections:[inputs]});
    b.root.dataFormula({result_path:'view.pending',func:'pending',status:'^gramlot.device.camera?status'});
    b.root.button({id:'camera-command',innerHTML:'Capture',disabled:'^view.pending'});
    b.root.img({src:'^gramlot.device.camera.url'});
    f.app.src.startSource(b.source);
    capture(f);capture(f);await flush();assert.equal(calls,1);
    const button=f.window.document.getElementById('camera-command').control;
    assert.equal(button.disabled,true);
    pending.resolve(photo);await flush();
    assert.equal(button.disabled,false);
    assert.equal(f.window.document.querySelector('img').getAttribute('src'),photo.url);
});

test('camera cancellation, permission denial and failure retain the last photo; retry is explicit',async t=>{
    let error=null,calls=0;
    const f=fixture(t,{capabilities:['camera'],async takePhoto(){calls++;if(error)throw error;return photo;}});
    capture(f);await flush();
    for(const [code,status] of [['CANCELLED','cancelled'],['PERMISSION_DENIED','denied'],['FAILED','error']]){
        error=Object.assign(new Error('Synthetic camera outcome'),{code});
        capture(f);await flush();
        assert.equal(f.node('camera').attr.status,status);
        assert.deepEqual(Object.fromEntries(['url','format'].map(key=>[key,f.node('camera').staticValue.getItem(key)])),photo);
        assert.equal(f.node('camera').attr.error?.code??null,code==='CANCELLED'?null:code);
        f.data.getItem('gramlot.device.camera.url');await flush();
    }
    assert.equal(calls,4);error=null;capture(f);await flush();
    assert.equal(calls,5);assert.equal(f.node('camera').attr.status,'success');assert.equal(f.node('camera').attr.error,null);
});

test('unavailable camera and malformed provider result are explicit Data outcomes',async t=>{
    const f=fixture(t,{capabilities:[]});capture(f);await flush();
    assert.equal(f.node('camera').attr.status,'unavailable');assert.equal(f.node('camera').staticValue,null);
    const invalid=fixture(t,{capabilities:['camera'],async takePhoto(){return {url:null,format:'jpeg'};}});
    capture(invalid);await flush();assert.equal(invalid.node('camera').attr.status,'error');
    assert.equal(invalid.node('camera').attr.error.code,'FAILED');assert.equal(invalid.node('camera').staticValue,null);
});

test('closing a page aborts pending capture and ignores its late result or error',async t=>{
    for (const fail of [false,true]) {
        const pending=deferred();let signal;
        const f=fixture(t,{capabilities:['camera'],takePhoto(s){signal=s;return pending.promise;}});
        capture(f);await flush();f.app.dispose();assert.equal(signal.aborted,true);
        const events=[];f.data.subscribe('closed-camera',{any:e=>events.push(e)});
        if(fail)pending.reject(new Error('Late capture failure'));else pending.resolve(photo);
        await flush();assert.equal(events.length,0);assert.equal(f.node('camera').staticValue,null);
    }
});

const choosePhoto = f => sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.camera?choose');

test('photo selection requires explicit FIRE and updates the same photo binding as capture', async t => {
    let calls=0;
    const selected={url:'capacitor://localhost/_capacitor_file_/selected.png',format:'png'};
    const f=fixture(t,{capabilities:['camera'],async choosePhoto(){calls++;return selected;}});
    f.node('camera').setAttr({choose:true});
    f.data.getItem('gramlot.device.camera.url');await flush();assert.equal(calls,0);
    const b=new GramlotBuilder(null,{collections:[inputs]});
    b.root.img({src:'^gramlot.device.camera.url'});f.app.src.startSource(b.source);
    choosePhoto(f);assert.equal(f.node('camera').attr.status,'pending');
    await flush();assert.equal(calls,1);assert.equal(f.node('camera').attr.status,'success');
    assert.equal(f.data.getItem('gramlot.device.camera.format'),'png');
    assert.equal(f.window.document.querySelector('img').getAttribute('src'),selected.url);
});

test('capture and selection exclude each other while either request is pending',async t=>{
    for(const selectionFirst of [true,false]){
        const pending=deferred();let captures=0,choices=0;
        const f=fixture(t,{capabilities:['camera'],takePhoto(){captures++;return pending.promise;},choosePhoto(){choices++;return pending.promise;}});
        const first=selectionFirst?choosePhoto:capture,second=selectionFirst?capture:choosePhoto;
        first(f);second(f);first(f);await flush();assert.equal(captures+choices,1);
        pending.resolve(photo);await flush();second(f);await flush();
        assert.equal(captures,1);assert.equal(choices,1);
    }
});

test('selection failures retain the last captured photo and allow explicit retry',async t=>{
    let error=null;
    const f=fixture(t,{capabilities:['camera'],async takePhoto(){return photo;},async choosePhoto(){if(error)throw error;return {...photo,format:'png'};}});
    capture(f);await flush();
    for(const [code,status] of [['CANCELLED','cancelled'],['PERMISSION_DENIED','denied'],['FAILED','error']]){
        error=Object.assign(new Error('Synthetic selection outcome'),{code});
        choosePhoto(f);await flush();assert.equal(f.node('camera').attr.status,status);
        assert.equal(f.data.getItem('gramlot.device.camera.url'),photo.url);
        assert.equal(f.node('camera').attr.error?.code??null,code==='CANCELLED'?null:code);
    }
    error=null;choosePhoto(f);await flush();
    assert.equal(f.node('camera').attr.status,'success');assert.equal(f.node('camera').attr.error,null);
    assert.equal(f.data.getItem('gramlot.device.camera.format'),'png');
});

test('photo selection reports absent capability and malformed provider results',async t=>{
    const f=fixture(t,{capabilities:[]});choosePhoto(f);await flush();assert.equal(f.node('camera').attr.status,'unavailable');
    const bad=fixture(t,{capabilities:['camera'],async choosePhoto(){return {url:photo.url,format:''};}});
    choosePhoto(bad);await flush();assert.equal(bad.node('camera').attr.status,'error');assert.equal(bad.node('camera').staticValue,null);
});

test('disposed pages ignore late photo selection success and failure',async t=>{
    for(const fail of [false,true]){
        const pending=deferred();let signal;
        const f=fixture(t,{capabilities:['camera'],choosePhoto(s){signal=s;return pending.promise;}});
        choosePhoto(f);await flush();f.app.dispose();assert.equal(signal.aborted,true);
        const events=[];f.data.subscribe('closed-selection',{any:e=>events.push(e)});
        if(fail)pending.reject(new Error('Late selection failure'));else pending.resolve(photo);
        await flush();assert.equal(events.length,0);assert.equal(f.node('camera').staticValue,null);
    }
});

const verifyBiometrics = f => sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.biometrics?verify');

test('biometric verification requires an explicit FIRE, never a read or ordinary attribute write',async t=>{
    let calls=0;
    const f=fixture(t,{capabilities:['biometrics'],async verifyBiometrics(){calls++;}});
    assert.equal(f.data.getItem('gramlot.device.biometrics'),null);
    assert.equal(f.data.getItem('gramlot.device.biometrics.verified'),null);
    f.node('biometrics').setAttr({verify:true});
    sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.biometrics?other');
    await flush();assert.equal(calls,0);
    assert.throws(()=>f.app.dvc.refresh('biometrics'),/Unknown device value/);
    verifyBiometrics(f);assert.equal(f.node('biometrics').attr.status,'pending');
    await flush();assert.equal(calls,1);assert.equal(f.node('biometrics').attr.status,'success');
    assert.equal(f.data.getItem('gramlot.device.biometrics.verified'),true);
    assert.equal(f.node('biometrics').getAttr('verify')??null,null);
});

test('a new biometric attempt clears the previous success; cancellation/failure cannot retain verified',async t=>{
    let pending;
    const f=fixture(t,{capabilities:['biometrics'],verifyBiometrics(){return pending.promise;}});
    for(const [code,status] of [['CANCELLED','cancelled'],['FAILED','error'],['UNAVAILABLE','unavailable'],['PERMISSION_DENIED','denied']]){
        pending=deferred();verifyBiometrics(f);await flush();pending.resolve();await flush();
        assert.equal(f.node('biometrics').staticValue.getItem('verified'),true);
        pending=deferred();verifyBiometrics(f);
        assert.equal(f.node('biometrics').staticValue,null);assert.equal(f.node('biometrics').attr.status,'pending');
        await flush();pending.reject(Object.assign(new Error('Synthetic verification outcome'),{code}));await flush();
        assert.equal(f.node('biometrics').staticValue,null);assert.equal(f.node('biometrics').attr.status,status);
        assert.equal(f.node('biometrics').attr.error?.code??null,code==='CANCELLED'?null:code);
    }
});

test('biometric result and pending state update real bindings; pending commands deduplicate',async t=>{
    const pending=deferred();let calls=0;
    const f=fixture(t,{capabilities:['biometrics'],verifyBiometrics(){calls++;return pending.promise;}});
    class Logic { pending({status}){return status==='pending';} }
    f.app.src.logicRegistry.register(Logic,{group:null,resource:'/test.js'});
    const b=new GramlotBuilder(null,{collections:[inputs]});
    b.root.dataFormula({result_path:'view.pending',func:'pending',status:'^gramlot.device.biometrics?status'});
    b.root.button({id:'verify-command',innerHTML:'Verify',disabled:'^view.pending'});
    b.root.span('^gramlot.device.biometrics.verified',{id:'verified'});
    f.app.src.startSource(b.source);
    verifyBiometrics(f);verifyBiometrics(f);await flush();assert.equal(calls,1);
    const button=f.window.document.getElementById('verify-command').control;
    assert.equal(button.disabled,true);pending.resolve();await flush();
    assert.equal(button.disabled,false);assert.equal(f.window.document.getElementById('verified').textContent,'true');
    f.provider.verifyBiometrics=async()=>{throw Object.assign(new Error('User cancelled'),{code:'CANCELLED'});};
    verifyBiometrics(f);assert.equal(f.window.document.getElementById('verified').textContent,'');
    await flush();assert.equal(f.window.document.getElementById('verified').textContent,'');
    assert.equal(button.disabled,false);assert.equal(f.node('biometrics').attr.status,'cancelled');
});

test('missing native biometrics produces unavailable without a positive result',async t=>{
    const f=fixture(t,{capabilities:[],verifyBiometrics(){assert.fail('No native invocation');}});
    verifyBiometrics(f);await flush();assert.equal(f.node('biometrics').attr.status,'unavailable');
    assert.equal(f.node('biometrics').staticValue,null);
});

test('disposing during biometric verification aborts its signal and ignores late success/failure',async t=>{
    for(const failed of [false,true]){
        const pending=deferred();let signal;
        const f=fixture(t,{capabilities:['biometrics'],verifyBiometrics(s){signal=s;return pending.promise;}});
        verifyBiometrics(f);await flush();f.app.dispose();assert.equal(signal.aborted,true);
        const events=[];f.data.subscribe('disposed-biometrics',{any:e=>events.push(e)});
        if(failed)pending.reject(new Error('Late error'));else pending.resolve();await flush();
        assert.equal(events.length,0);assert.equal(f.node('biometrics').staticValue,null);
    }
});

test('disposing synchronously on biometric pending does not start a native prompt',async t=>{
    const f=fixture(t,{capabilities:['biometrics'],verifyBiometrics(){assert.fail('Disposed before invocation');}});
    f.data.subscribe('close-on-pending',{update:e=>{
        if(e.node===f.node('biometrics')&&e.node.attr.status==='pending')f.app.dispose();
    }});
    verifyBiometrics(f);await flush();assert.equal(f.node('biometrics').staticValue,null);
});

const notificationRequest={id:1,title:'Synthetic title',body:'Synthetic body',delay:5};
const scheduleNotification=f=>sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.notifications?schedule');
function notificationFixture(t,overrides={}){
    let callback,stops=0,reads=0;
    const f=fixture(t,{capabilities:['notifications'],
        async startNotificationEvents(cb){callback=cb;return async()=>{stops++;};},
        async scheduleNotification(request){reads++;return {id:request.id,at:10000};},...overrides});
    for(const [key,value] of Object.entries(notificationRequest))f.data.setItem(`gramlot.device.notifications.request.${key}`,value);
    return {...f,get schedules(){return reads;},get eventStops(){return stops;},event:e=>callback(e)};
}

test('notifications attach listeners without scheduling; only FIRE snapshots request and schedules',async t=>{
    let captured;const pending=deferred();
    const f=notificationFixture(t,{scheduleNotification(input){captured=input;return pending.promise;}});
    const node=f.node('notifications');await flush();assert.equal(node.attr.listening,true);assert.equal(node.attr.status,'idle');
    f.data.getItem('gramlot.device.notifications.request.title');node.setAttr({schedule:true});await flush();assert.equal(captured,undefined);
    scheduleNotification(f);scheduleNotification(f);f.data.setItem('gramlot.device.notifications.request.title','Changed after command');
    await flush();assert.deepEqual(captured,notificationRequest);assert.equal(node.attr.status,'pending');
    pending.resolve({id:1,at:10000});await flush();assert.equal(node.attr.status,'success');
    assert.equal(f.data.getItem('gramlot.device.notifications.scheduled.at'),10000);
    assert.equal(f.data.getItem('gramlot.device.notifications.received'),null);
});

test('notification received and action events update real bindings independently of scheduling status',async t=>{
    const f=notificationFixture(t);const b=new GramlotBuilder(null,{collections:[inputs]});
    b.root.span('^gramlot.device.notifications.received.title',{id:'received-title'});
    b.root.span('^gramlot.device.notifications.action.actionId',{id:'notification-action'});
    f.app.src.startSource(b.source);await flush();
    scheduleNotification(f);await flush();
    f.event({kind:'received',id:1,title:'Received',body:'Synthetic'});
    f.event({kind:'action',id:1,title:'Received',body:'Synthetic',actionId:'tap'});
    assert.equal(f.window.document.getElementById('received-title').textContent,'Received');
    assert.equal(f.window.document.getElementById('notification-action').textContent,'tap');
    assert.equal(f.node('notifications').attr.status,'success');
});

test('notification validation rejects malformed request before scheduling; denial never acknowledges success',async t=>{
    const f=notificationFixture(t);
    for(const [key,value] of [['id',1.5],['id',2147483648],['title',''],['body',false],['delay',0],['delay','5']]){
        f.data.setItem(`gramlot.device.notifications.request.${key}`,value);scheduleNotification(f);await flush();
        assert.equal(f.node('notifications').attr.status,'error');assert.equal(f.schedules,0);
        f.data.setItem(`gramlot.device.notifications.request.${key}`,notificationRequest[key]);
    }
    f.provider.scheduleNotification=async()=>{throw Object.assign(new Error('Denied'),{code:'PERMISSION_DENIED'});};
    scheduleNotification(f);await flush();assert.equal(f.node('notifications').attr.status,'denied');
    assert.equal(f.data.getItem('gramlot.device.notifications.scheduled'),null);
});

test('failed listener startup is visible and can retry on an explicit schedule request',async t=>{
    let starts=0;const f=notificationFixture(t,{async startNotificationEvents(){
        starts++;if(starts===1)throw new Error('Synthetic setup failure');return async()=>{};
    }});
    await flush();assert.equal(f.node('notifications').attr.listening,false);
    assert.equal(f.node('notifications').attr.listenerError.code,'FAILED');
    scheduleNotification(f);await flush();assert.equal(starts,2);assert.equal(f.node('notifications').attr.listening,true);
    assert.equal(f.node('notifications').attr.listenerError,null);assert.equal(f.node('notifications').attr.status,'success');
});

test('disposal waits for pending notification listener setup, removes it and ignores callbacks',async t=>{
    const pending=deferred();let signal,callback,stops=0;
    const f=notificationFixture(t,{startNotificationEvents(cb,s){callback=cb;signal=s;return pending.promise;}});
    await flush();f.app.dispose();assert.equal(signal.aborted,true);
    const events=[];f.data.subscribe('closed-notifications',{any:e=>events.push(e)});
    callback({kind:'received',id:1,title:'Late',body:'Synthetic'});
    pending.resolve(async()=>{stops++;});await flush();await f.app.dvc.cleanup;
    assert.equal(stops,1);assert.equal(events.length,0);
});

test('late scheduling acknowledgement cannot write after disposal; native accepted notifications are not cancelled',async t=>{
    const pending=deferred();let signal;
    const f=notificationFixture(t,{scheduleNotification(input,s){signal=s;return pending.promise;}});
    scheduleNotification(f);await flush();f.app.dispose();assert.equal(signal.aborted,true);
    pending.resolve({id:1,at:10000});await flush();await f.app.dvc.cleanup;
    assert.equal(f.data.getItem('gramlot.device.notifications.scheduled'),null);assert.equal(f.eventStops,1);
});

test('listener cleanup errors are observed and do not modify a disposed Data Bag',async t=>{
    const f=notificationFixture(t,{async startNotificationEvents(){return async()=>{throw new Error('Cleanup failed');};}});
    await flush();f.app.dispose();await assert.rejects(f.app.dvc.cleanup,/Cleanup failed/);await flush();
    assert.equal(f.app.dvc.cleanupError.message,'Cleanup failed');
});

test('unavailable notification scheduling has no fabricated acknowledgement',async t=>{
    const f=fixture(t,{capabilities:[]});scheduleNotification(f);await flush();
    assert.equal(f.node('notifications').attr.status,'unavailable');
    assert.equal(f.data.getItem('gramlot.device.notifications.scheduled'),null);
});

const registerPush=f=>sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.push?register');
function pushFixture(t,overrides={}){
    let callback,registrations=0,stops=0;
    const f=fixture(t,{capabilities:['push'],async startPushEvents(cb){callback=cb;return async()=>{stops++;};},
        async registerPush(){registrations++;},...overrides});
    return {...f,get registrations(){return registrations;},get pushStops(){return stops;},event:e=>callback(e)};
}
const pushMessage={kind:'received',id:'native-test-id',title:'Synthetic title',body:'Synthetic body',messageId:'server-test-id',destination:'device'};

test('push listeners attach without registration; SDK register acknowledgement is not token success',async t=>{
    const f=pushFixture(t);await flush();assert.equal(f.node('push').attr.listening,true);
    f.data.getItem('gramlot.device.push.registration');f.node('push').setAttr({register:true});await flush();assert.equal(f.registrations,0);
    registerPush(f);registerPush(f);await flush();assert.equal(f.registrations,1);
    assert.equal(f.node('push').attr.status,'pending');assert.equal(f.data.getItem('gramlot.device.push.registration'),null);
    f.event({kind:'registration',token:'SYNTHETIC_TOKEN_1'});
    assert.equal(f.node('push').attr.status,'success');assert.equal(f.data.getItem('gramlot.device.push.registration.token'),'SYNTHETIC_TOKEN_1');
    f.event({kind:'registration',token:'SYNTHETIC_TOKEN_2'});
    assert.equal(f.data.getItem('gramlot.device.push.registration.token'),'SYNTHETIC_TOKEN_2');
});

test('native push token drives a real dataRpc parameter; received and tapped fields update bindings',async t=>{
    const f=pushFixture(t);const calls=[];f.app.rpc.transport={close(){},dispose(){},async call(text){const request=fromTytx(text);calls.push(request);return toTytx({id:request.id,contentType:request.contentType,value:new Bag({registered:true})});}};
    const b=new GramlotBuilder(null,{collections:[inputs]});
    b.root.dataRpc({method:'pushRegister',result_path:'server.registration',token:'^gramlot.device.push.registration.token',_if:'token'});
    b.root.span('^gramlot.device.push.received.body',{id:'push-body'});
    b.root.span('^gramlot.device.push.action.destination',{id:'push-destination'});
    f.app.src.startSource(b.source);await flush();
    f.event({kind:'registration',token:'SYNTHETIC_TOKEN'});await flush();
    assert.equal(calls.length,1);assert.equal(calls[0].name,'pushRegister');assert.equal(calls[0].params.token,'SYNTHETIC_TOKEN');assert.equal(f.data.getItem('server.registration.registered'),true);
    f.event(pushMessage);f.event({...pushMessage,kind:'action',actionId:'tap'});
    assert.equal(f.window.document.getElementById('push-body').textContent,pushMessage.body);
    assert.equal(f.window.document.getElementById('push-destination').textContent,'device');
});

test('push registration errors, denial and unavailability cannot report a registered token',async t=>{
    const f=pushFixture(t);registerPush(f);await flush();
    f.event({kind:'registrationError',error:new Error('Synthetic native registration failure')});
    assert.equal(f.node('push').attr.status,'error');assert.equal(f.data.getItem('gramlot.device.push.registration'),null);
    f.provider.registerPush=async()=>{throw Object.assign(new Error('Denied'),{code:'PERMISSION_DENIED'});};
    registerPush(f);await flush();assert.equal(f.node('push').attr.status,'denied');
    const missing=fixture(t,{capabilities:[]});registerPush(missing);await flush();assert.equal(missing.node('push').attr.status,'unavailable');
});

test('push registration timeout allows explicit retry and later genuine token events',async t=>{
    t.mock.timers.enable({apis:['setTimeout']});
    const f=pushFixture(t);registerPush(f);await flush();t.mock.timers.tick(30000);
    assert.equal(f.node('push').attr.error.code,'TIMEOUT');registerPush(f);await flush();assert.equal(f.registrations,2);
    f.event({kind:'registration',token:'SYNTHETIC_TOKEN'});t.mock.timers.tick(30000);
    assert.equal(f.node('push').attr.status,'success');
});

test('disposing while push listeners start removes arriving handles and ignores buffered events',async t=>{
    let callback,signal,stops=0;const pending=deferred();
    const f=pushFixture(t,{startPushEvents(cb,s){callback=cb;signal=s;return pending.promise;}});
    registerPush(f);await flush();f.app.dispose();assert.equal(signal.aborted,true);
    const events=[];f.data.subscribe('disposed-push',{any:e=>events.push(e)});
    callback({kind:'registration',token:'LATE_SYNTHETIC'});callback({...pushMessage,kind:'action',actionId:'tap'});
    pending.resolve(async()=>{stops++;});await f.app.dvc.cleanup;await flush();
    assert.equal(stops,1);assert.equal(f.registrations,0);assert.equal(events.length,0);
});

test('a native token event cannot be replaced by a later failure of the SDK registration request',async t=>{
    const pending=deferred();const f=pushFixture(t,{registerPush:()=>pending.promise});
    registerPush(f);await flush();f.event({kind:'registration',token:'SYNTHETIC_TOKEN'});
    pending.reject(new Error('Late native request error'));await flush();assert.equal(f.node('push').attr.status,'success');
});


test('shortcut requests reach real Data controllers once per id; unknown destinations remain Data', async t => {
    let emit, stops=0;
    const f=fixture(t,{capabilities:['shortcuts'],async startShortcutEvents(cb){emit=cb;return async()=>{stops++;};}});
    const seen=[];
    class Logic { recordShortcut(node,{request}) { if(request)seen.push(request.getItem('destination')); } }
    f.app.src.logicRegistry.register(Logic,{group:null,resource:'/test-shortcuts.js'});
    const b=new GramlotBuilder(null,{collections:[inputs]});
    b.root.dataController({func:'recordShortcut',request:'^gramlot.device.shortcuts.request'});
    f.app.src.startSource(b.source);
    await flush();
    assert.equal(f.node('shortcuts').attr.listening,true);
    emit({id:'one',destination:'gallery'});
    emit({id:'one',destination:'gallery'});
    emit({id:'two',destination:'other'});
    assert.deepEqual(seen,['gallery','other']);
    const saved=f.data.getItem('gramlot.device.shortcuts.request');
    emit({id:'bad',destination:7});
    assert.equal(f.data.getItem('gramlot.device.shortcuts.request'),saved);
    assert.equal(f.node('shortcuts').attr.listenerError.code,'FAILED');
    f.app.dispose();await flush();assert.equal(stops,1);
    emit({id:'late',destination:'gallery'});assert.deepEqual(seen,['gallery','other']);
});

test('shortcut startup disposal removes late listener and setup errors are explicit', async t => {
    const ready=deferred();let stops=0, signal, emit;
    const f=fixture(t,{capabilities:['shortcuts'],startShortcutEvents(cb,s){emit=cb;signal=s;return ready.promise;}});
    await flush();f.app.dispose();assert.equal(signal.aborted,true);
    ready.resolve(async()=>{stops++;});await flush();assert.equal(stops,1);
    emit({id:'late',destination:'gallery'});assert.equal(f.data.getItem('gramlot.device.shortcuts.request'),null);
    const failed=fixture(t,{capabilities:['shortcuts'],async startShortcutEvents(){throw new Error('setup failed');}});
    await flush();assert.equal(failed.node('shortcuts').attr.listening,false);
    assert.equal(failed.node('shortcuts').attr.listenerError.message,'setup failed');
});


const scanBarcode=f=>sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.barcode?scan');
test('barcode scan requires FIRE, deduplicates pending and updates real bound fields',async t=>{
 const pending=deferred();let scans=0;
 const f=fixture(t,{capabilities:['barcode'],scanBarcode(){scans++;return pending.promise;}});
 const b=new GramlotBuilder(null,{collections:[inputs]});
 class Logic { pending({status}){return status==='pending';} }
 f.app.src.logicRegistry.register(Logic,{group:null,resource:'/barcode-test.js'});
 b.root.dataFormula({result_path:'view.barcode.pending',func:'pending',status:'^gramlot.device.barcode?status'});
 b.root.button({id:'scan-command',disabled:'^view.barcode.pending'});
 b.root.span('^gramlot.device.barcode.text',{id:'scanned-text'});
 f.app.src.startSource(b.source);
 void f.node('barcode').value;
 f.node('barcode').setAttr({scan:true});await flush();assert.equal(scans,0);
 scanBarcode(f);scanBarcode(f);await flush();assert.equal(scans,1);
 assert.equal(f.window.document.getElementById('scan-command').control.disabled,true);
 const text='<script>not executable</script>';
 pending.resolve({text,format:'QR_CODE'});await flush();
 assert.equal(f.node('barcode').attr.status,'success');
 assert.equal(f.data.getItem('gramlot.device.barcode.format'),'QR_CODE');
 assert.equal(f.window.document.getElementById('scanned-text').textContent,text);
 assert.equal(f.window.document.querySelector('script'),null);
 assert.equal(f.window.document.getElementById('scan-command').control.disabled,false);
});
test('barcode retries clear previous data and distinguish cancellation, denial and malformed results',async t=>{
 let run=async()=>({text:'GRAMLOT-POC-QR-001',format:'QR_CODE'});
 const f=fixture(t,{capabilities:['barcode'],scanBarcode:()=>run()});
 scanBarcode(f);await flush();assert.ok(f.node('barcode').staticValue);
 run=async()=>{throw Object.assign(new Error('dismissed'),{code:'CANCELLED'});};
 scanBarcode(f);assert.equal(f.node('barcode').staticValue,null);await flush();
 assert.equal(f.node('barcode').attr.status,'cancelled');assert.equal(f.node('barcode').attr.error,null);
 run=async()=>{throw Object.assign(new Error('camera denied'),{code:'PERMISSION_DENIED'});};
 scanBarcode(f);await flush();assert.equal(f.node('barcode').attr.status,'denied');
 assert.equal(f.node('barcode').attr.error.code,'PERMISSION_DENIED');
 run=async()=>({text:'text',format:0});scanBarcode(f);await flush();
 assert.equal(f.node('barcode').attr.status,'error');assert.equal(f.node('barcode').attr.error.code,'FAILED');
 assert.equal(f.node('barcode').staticValue,null);
});
test('barcode unavailable and disposed scans never fabricate or write a late result',async t=>{
 const unavailable=fixture(t,{capabilities:[]});scanBarcode(unavailable);await flush();
 assert.equal(unavailable.node('barcode').attr.status,'unavailable');
 const pending=deferred();let signal;
 const f=fixture(t,{capabilities:['barcode'],scanBarcode(s){signal=s;return pending.promise;}});
 scanBarcode(f);await flush();f.app.dispose();assert.equal(signal.aborted,true);
 pending.resolve({text:'late',format:'QR_CODE'});await flush();assert.equal(f.node('barcode').staticValue,null);
});


test('network events update bound Data, reject malformed state and recover',async t=>{
 let emit,stops=0;
 const f=fixture(t,{capabilities:['network'],async startNetworkEvents(cb){emit=cb;cb({connected:true,type:'wifi'});return async()=>{stops++;};}});
 const b=new GramlotBuilder(null,{collections:[inputs]});
 b.root.span('^gramlot.device.network.type',{id:'network-type'});
 f.app.src.startSource(b.source);
 await flush();assert.equal(f.node('network').attr.listening,true);
 assert.equal(f.window.document.getElementById('network-type').textContent,'wifi');
 emit({connected:false,type:'none'});await flush();
 assert.equal(f.data.getItem('gramlot.device.network.connected'),false);
 assert.equal(f.window.document.getElementById('network-type').textContent,'none');
 emit({connected:'yes',type:'wifi'});assert.equal(f.node('network').attr.status,'error');
 assert.equal(f.data.getItem('gramlot.device.network.connected'),false);
 emit({connected:true,type:'cellular'});assert.equal(f.node('network').attr.status,'success');
 f.app.dispose();await f.app.dvc.cleanup;assert.equal(stops,1);
 emit({connected:false,type:'none'});assert.equal(f.data.getItem('gramlot.device.network.type'),'cellular');
});

test('lifecycle state is independent of pause/resume and repeated events are reactive',async t=>{
 let emit;
 const f=fixture(t,{capabilities:['lifecycle'],async startLifecycleEvents(cb){emit=cb;cb({kind:'state',active:true});return async()=>{};}});
 const b=new GramlotBuilder(null,{collections:[inputs]});
 const observed=[];
 class Logic { observe(node,{sequence,event}) {if(sequence) observed.push([sequence,event]);} }
 f.app.src.logicRegistry.register(Logic,{group:null,resource:'/lifecycle-test.js'});
 b.root.dataController({func:'observe',sequence:'^gramlot.device.lifecycle.sequence',event:'=gramlot.device.lifecycle.event'});
 b.root.span('^gramlot.device.lifecycle.active',{id:'active-state'});
 f.app.src.startSource(b.source);await flush();
 emit({kind:'state',active:false});await flush();assert.deepEqual(observed,[]);
 assert.equal(f.data.getItem('gramlot.device.lifecycle.sequence'),0);
 emit({kind:'pause'});emit({kind:'resume'});await flush();
 emit({kind:'pause'});await flush();emit({kind:'resume'});await flush();
 emit({kind:'state',active:true});await flush();
 assert.deepEqual(observed,[[1,'pause'],[2,'resume'],[3,'pause'],[4,'resume']]);
 assert.equal(f.data.getItem('gramlot.device.lifecycle.active'),true);
 emit({kind:'state',active:'yes'});assert.equal(f.node('lifecycle').attr.status,'error');
 assert.equal(f.data.getItem('gramlot.device.lifecycle.active'),true);
});

test('state setup failure, absent capabilities and disposal during setup are explicit',async t=>{
 const absent=fixture(t);await flush();
 for(const name of ['network','lifecycle']) {assert.equal(absent.node(name).attr.status,'unavailable');assert.equal(absent.node(name).attr.listening,false);}
 const failed=fixture(t,{capabilities:['network'],async startNetworkEvents(){throw new Error('listener refused');}});
 await flush();assert.equal(failed.node('network').attr.status,'error');assert.equal(failed.node('network').attr.listening,false);
 const pending=deferred();let emit,signal,stops=0;
 const f=fixture(t,{capabilities:['lifecycle'],startLifecycleEvents(cb,s){emit=cb;signal=s;return pending.promise;}});
 await flush();f.app.dispose();assert.equal(signal.aborted,true);
 pending.resolve(async()=>{stops++;});await f.app.dvc.cleanup;
 emit({kind:'state',active:true});assert.equal(f.data.getItem('gramlot.device.lifecycle.active'),null);assert.equal(stops,1);
});

const impact=f=>sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.haptics?impact');
test('haptics requires FIRE, snapshots style and deduplicates pending commands',async t=>{
 const pending=deferred();const calls=[];
 const f=fixture(t,{capabilities:['haptics'],impact(style){calls.push(style);return pending.promise;}});
 void f.node('haptics').value;f.node('haptics').setAttr({impact:true,style:'light'});await flush();assert.deepEqual(calls,[]);
 impact(f);f.node('haptics').setAttr({style:'heavy'});impact(f);await flush();assert.deepEqual(calls,['light']);
 assert.equal(f.node('haptics').attr.status,'pending');pending.resolve();await flush();
 assert.equal(f.data.getItem('gramlot.device.haptics.style'),'light');assert.equal(f.data.getItem('gramlot.device.haptics.acknowledged'),true);
 f.node('haptics').setAttr({style:'invalid'});impact(f);await flush();
 assert.equal(f.node('haptics').staticValue,null);assert.equal(f.node('haptics').attr.status,'error');assert.deepEqual(calls,['light']);
});
test('haptic failures and disposed completions never fabricate acknowledgement',async t=>{
 const unavailable=fixture(t);impact(unavailable);await flush();assert.equal(unavailable.node('haptics').attr.status,'unavailable');
 const failed=fixture(t,{capabilities:['haptics'],async impact(){throw new Error('native failure');}});
 impact(failed);await flush();assert.equal(failed.node('haptics').attr.status,'error');assert.equal(failed.node('haptics').staticValue,null);
 const pending=deferred();let signal;
 const f=fixture(t,{capabilities:['haptics'],impact(style,s){signal=s;return pending.promise;}});
 impact(f);await flush();f.app.dispose();assert.equal(signal.aborted,true);pending.resolve();await flush();assert.equal(f.node('haptics').staticValue,null);
});


const vibrate=f=>sourceTarget(f.app.src.builder.root.dataController({})).FIRE('gramlot.device.haptics?vibrate');
test('vibration requires FIRE, snapshots milliseconds and shares the pending gate with impact',async t=>{
 const pending=deferred();const calls=[];
 const f=fixture(t,{capabilities:['haptics'],vibrate(duration){calls.push(duration);return pending.promise;},async impact(){calls.push('impact');}});
 f.node('haptics').setAttr({vibrate:true});void f.node('haptics').value;await flush();assert.deepEqual(calls,[]);
 vibrate(f);f.node('haptics').setAttr({duration:900});vibrate(f);impact(f);await flush();assert.deepEqual(calls,[600]);
 pending.resolve();await flush();assert.equal(f.node('haptics').attr.status,'success');
 assert.equal(f.data.getItem('gramlot.device.haptics.duration'),600);assert.equal(f.data.getItem('gramlot.device.haptics.acknowledged'),true);
 impact(f);assert.equal(f.node('haptics').staticValue,null);await flush();assert.deepEqual(calls,[600,'impact']);
 assert.equal(f.data.getItem('gramlot.device.haptics.duration'),null);assert.equal(f.data.getItem('gramlot.device.haptics.style'),'medium');
});
test('vibration rejects invalid duration, reports native failures and ignores disposed results',async t=>{
 let calls=0,run=async()=>{};
 const f=fixture(t,{capabilities:['haptics'],vibrate(){calls++;return run();}});
 for(const duration of [0,-1,5001,1.5,'600',NaN]){
  f.node('haptics').setAttr({duration});vibrate(f);await flush();
  assert.equal(f.node('haptics').attr.status,'error');assert.equal(f.node('haptics').staticValue,null);
 }
 assert.equal(calls,0);f.node('haptics').setAttr({duration:600});
 run=async()=>{throw new Error('native vibration failed');};vibrate(f);await flush();assert.equal(f.node('haptics').attr.error.message,'native vibration failed');
 const pending=deferred();run=()=>pending.promise;vibrate(f);await flush();f.app.dispose();pending.resolve();await flush();assert.equal(f.node('haptics').staticValue,null);
 const absent=fixture(t);vibrate(absent);await flush();assert.equal(absent.node('haptics').attr.status,'unavailable');
});


const audioCommand=(f,command)=>sourceTarget(f.app.src.builder.root.dataController({})).FIRE(`gramlot.device.audio?${command}`);
const audioResult={url:'capacitor://localhost/_capacitor_file_/test.m4a',mimeType:'audio/mp4',duration:1200};
test('audio starts only on FIRE, deduplicates and exposes a real bound player after stop',async t=>{
 let starts=0,stops=0,closes=0;
 const pending=deferred();
 const f=fixture(t,{capabilities:['audio'],async startAudioRecording(){starts++;return {stop(){stops++;return pending.promise;},async dispose(){closes++;}};}});
 const b=new GramlotBuilder(null,{collections:[inputs]});
 b.root.audio({src:'^gramlot.device.audio.url',controls:true,id:'audio-player'});
 f.app.src.startSource(b.source);
 f.node('audio').setAttr({start:true});void f.node('audio').value;await flush();assert.equal(starts,0);
 audioCommand(f,'start');audioCommand(f,'start');await flush();assert.equal(starts,1);
 assert.equal(f.node('audio').attr.recording,true);assert.equal(f.node('audio').attr.status,'recording');
 audioCommand(f,'stop');audioCommand(f,'stop');await flush();assert.equal(stops,1);
 pending.resolve(audioResult);await flush();assert.equal(f.node('audio').attr.recording,false);
 assert.equal(f.node('audio').attr.status,'success');assert.equal(f.data.getItem('gramlot.device.audio.duration'),1200);
 assert.equal(f.window.document.getElementById('audio-player').getAttribute('src'),audioResult.url);
 audioCommand(f,'start');await flush();assert.equal(closes,1);assert.equal(starts,2);assert.equal(f.node('audio').staticValue,null);
});
test('audio cancellation during startup releases a late native session without result',async t=>{
 const pending=deferred();let signal,closes=0;
 const f=fixture(t,{capabilities:['audio'],startAudioRecording(cb,s){signal=s;return pending.promise;}});
 audioCommand(f,'start');await flush();audioCommand(f,'cancel');assert.equal(signal.aborted,true);
 pending.resolve({async stop(){return audioResult;},async dispose(){closes++;}});await flush();
 assert.equal(closes,1);assert.equal(f.node('audio').attr.status,'cancelled');assert.equal(f.node('audio').attr.error,null);assert.equal(f.node('audio').staticValue,null);
});
test('audio interruptions, invalid results, denial and missing capability remain distinct',async t=>{
 let interrupt,closes=0;
 const f=fixture(t,{capabilities:['audio'],async startAudioRecording(cb){interrupt=cb;return {async stop(){return {...audioResult,duration:NaN};},async dispose(){closes++;}};}});
 audioCommand(f,'start');await flush();interrupt(Object.assign(new Error('background'),{code:'CANCELLED'}));await flush();
 assert.equal(f.node('audio').attr.status,'cancelled');assert.equal(closes,1);
 audioCommand(f,'start');await flush();audioCommand(f,'stop');await flush();assert.equal(f.node('audio').attr.status,'error');assert.equal(closes,2);
 const denied=fixture(t,{capabilities:['audio'],async startAudioRecording(){throw Object.assign(new Error('denied'),{code:'PERMISSION_DENIED'});}});
 audioCommand(denied,'start');await flush();assert.equal(denied.node('audio').attr.status,'denied');
 const absent=fixture(t);audioCommand(absent,'start');await flush();assert.equal(absent.node('audio').attr.status,'unavailable');
});
test('disposed audio does not write late output and awaits microphone/file cleanup',async t=>{
 const pending=deferred();let closes=0;
 const f=fixture(t,{capabilities:['audio'],async startAudioRecording(){return {stop:()=>pending.promise,async dispose(){await pending.promise;closes++;}};}});
 audioCommand(f,'start');await flush();audioCommand(f,'stop');await flush();f.app.dispose();pending.resolve(audioResult);await f.app.dvc.cleanup;
 assert.equal(closes,1);assert.equal(f.node('audio').staticValue,null);
});
test('failed audio replacement cleanup retains ownership for explicit cancellation retry',async t=>{
 let starts=0,closes=0;
 const f=fixture(t,{capabilities:['audio'],async startAudioRecording(){starts++;return {async stop(){return audioResult;},async dispose(){closes++;if(closes===1)throw new Error('file busy');}};}});
 audioCommand(f,'start');await flush();audioCommand(f,'stop');await flush();audioCommand(f,'start');await flush();
 assert.equal(starts,1);assert.equal(f.node('audio').attr.status,'error');assert.equal(f.node('audio').attr.error.message,'file busy');
 audioCommand(f,'cancel');await flush();assert.equal(closes,2);assert.equal(f.node('audio').attr.status,'cancelled');
 audioCommand(f,'start');await flush();assert.equal(starts,2);
});


test('audio sharing requires a completed recording and deduplicates without invalidating its file',async t=>{
 let starts=0,shares=0,closes=0;const pending=deferred();
 const f=fixture(t,{capabilities:['audio'],async startAudioRecording(){starts++;return {async stop(){return audioResult;},share(){shares++;return pending.promise;},async dispose(){closes++;}};}});
 audioCommand(f,'share');await flush();assert.equal(f.node('audio').attr.shareStatus,'error');assert.equal(shares,0);
 audioCommand(f,'start');await flush();audioCommand(f,'stop');await flush();const recording=f.node('audio').staticValue;
 audioCommand(f,'share');audioCommand(f,'share');audioCommand(f,'start');audioCommand(f,'cancel');await flush();
 assert.equal(shares,1);assert.equal(starts,1);assert.equal(closes,0);assert.equal(f.node('audio').staticValue,recording);
 assert.equal(f.node('audio').attr.shareStatus,'pending');assert.equal(f.node('audio').attr.status,'success');
 pending.resolve({activity:'com.apple.UIKit.activity.SaveToFiles'});await flush();
 assert.equal(f.node('audio').attr.shareStatus,'success');assert.equal(f.node('audio').attr.shareActivity,'com.apple.UIKit.activity.SaveToFiles');
 audioCommand(f,'start');await flush();assert.equal(closes,1);assert.equal(f.node('audio').attr.shareStatus,'idle');assert.equal(f.node('audio').attr.shareActivity,null);
});
test('share cancellation/error preserve the recording and allow retry',async t=>{
 let outcome=async()=>{throw Object.assign(new Error('closed'),{code:'CANCELLED'});};
 const f=fixture(t,{capabilities:['audio'],async startAudioRecording(){return {async stop(){return audioResult;},share:()=>outcome(),async dispose(){}};}});
 audioCommand(f,'start');await flush();audioCommand(f,'stop');await flush();const recording=f.node('audio').staticValue;
 audioCommand(f,'share');await flush();assert.equal(f.node('audio').attr.shareStatus,'cancelled');assert.equal(f.node('audio').attr.shareError,null);
 assert.equal(f.node('audio').staticValue,recording);
 outcome=async()=>{throw Object.assign(new Error('no share'),{code:'UNAVAILABLE'});};audioCommand(f,'share');await flush();assert.equal(f.node('audio').attr.shareStatus,'unavailable');
 outcome=async()=>({activity:42});audioCommand(f,'share');await flush();assert.equal(f.node('audio').attr.shareStatus,'error');
 outcome=async()=>({activity:''});audioCommand(f,'share');await flush();assert.equal(f.node('audio').attr.shareStatus,'success');assert.equal(f.node('audio').attr.shareActivity,'');
});
test('page disposal ignores late audio sharing result and awaits session cleanup',async t=>{
 const pending=deferred();let closed=false,signal;
 const f=fixture(t,{capabilities:['audio'],async startAudioRecording(){return {async stop(){return audioResult;},share(s){signal=s;return pending.promise;},async dispose(){await pending.promise;closed=true;}};}});
 audioCommand(f,'start');await flush();audioCommand(f,'stop');await flush();audioCommand(f,'share');await flush();
 const attributesBeforeDispose={...f.node('audio').attr};f.app.dispose();
 assert.equal(signal.aborted,true);assert.equal(closed,false);pending.resolve({activity:'late'});await f.app.dvc.cleanup;await flush();
 assert.equal(closed,true);assert.deepEqual(f.node('audio').attr,attributesBeforeDispose);
});


const clipboardCommand=(f,operation)=>sourceTarget(f.app.src.builder.root.dataController({})).FIRE(`gramlot.device.clipboard?${operation}`);
test('clipboard is explicit, snapshots copy input and deduplicates competing commands',async t=>{
 const pending=deferred(),copies=[];let pastes=0;
 const f=fixture(t,{capabilities:['clipboard'],copyText(text){copies.push(text);return pending.promise;},async pasteText(){pastes++;return {text:'paste'};}});
 const node=f.node('clipboard');node.setAttr({text:'first',copy:true,paste:true});void node.value;await flush();
 assert.deepEqual(copies,[]);assert.equal(pastes,0);
 clipboardCommand(f,'copy');node.setAttr({text:'second'});clipboardCommand(f,'copy');clipboardCommand(f,'paste');await flush();
 assert.deepEqual(copies,['first']);assert.equal(pastes,0);assert.equal(node.attr.status,'pending');
 pending.resolve();await flush();assert.equal(node.attr.status,'success');assert.equal(node.attr.operation,'copy');assert.equal(node.staticValue.getItem('text'),'first');
 clipboardCommand(f,'paste');await flush();assert.equal(pastes,1);assert.equal(node.attr.operation,'paste');assert.equal(node.staticValue.getItem('text'),'paste');
});
test('clipboard accepts empty strings and rejects invalid copy/paste types without coercion',async t=>{
 let copies=0;let result={text:''};const f=fixture(t,{capabilities:['clipboard'],async copyText(){copies++;},async pasteText(){return result;}});
 clipboardCommand(f,'copy');await flush();assert.equal(copies,1);assert.equal(f.node('clipboard').staticValue.getItem('text'),'');
 clipboardCommand(f,'paste');await flush();assert.equal(f.node('clipboard').attr.status,'success');
 for(const text of [null,42,{},true]) {f.node('clipboard').setAttr({text});clipboardCommand(f,'copy');await flush();assert.equal(f.node('clipboard').attr.status,'error');assert.equal(f.node('clipboard').staticValue,null);}
 assert.equal(copies,1);result={text:42};clipboardCommand(f,'paste');await flush();assert.equal(f.node('clipboard').attr.status,'error');
});
test('clipboard clears stale results, reports failures and supports explicit retry',async t=>{
 let fail=false;const f=fixture(t,{capabilities:['clipboard'],async pasteText(){if(fail)throw new Error('There is no data on the clipboard');return {text:'ok'};}});
 clipboardCommand(f,'paste');await flush();fail=true;clipboardCommand(f,'paste');assert.equal(f.node('clipboard').staticValue,null);await flush();
 assert.equal(f.node('clipboard').attr.status,'error');assert.equal(f.node('clipboard').attr.error.message,'There is no data on the clipboard');
 fail=false;clipboardCommand(f,'paste');await flush();assert.equal(f.node('clipboard').attr.status,'success');assert.equal(f.node('clipboard').attr.error,null);
 const absent=fixture(t);clipboardCommand(absent,'paste');await flush();assert.equal(absent.node('clipboard').attr.status,'unavailable');
});
for(const operation of ['copy','paste']) test(`clipboard ${operation} ignores late completion after disposal`,async t=>{
 const pending=deferred();let signal;const f=fixture(t,{capabilities:['clipboard'],copyText(text,s){signal=s;return pending.promise;},pasteText(s){signal=s;return pending.promise;}});
 clipboardCommand(f,operation);await flush();const node=f.node('clipboard');f.app.dispose();const snapshot={...node.attr};
 assert.equal(signal.aborted,true);pending.resolve({text:'late'});await flush();assert.equal(node.staticValue,null);assert.deepEqual(node.attr,snapshot);
});

test('link requests reach real Data controllers once per id; unknown urls remain Data', async t => {
    let emit, stops=0;
    const f=fixture(t,{capabilities:['links'],async startLinkEvents(cb){emit=cb;return async()=>{stops++;};}});
    const seen=[];
    class Logic { recordLink(node,{request}) { if(request)seen.push(request.getItem('url')); } }
    f.app.src.logicRegistry.register(Logic,{group:null,resource:'/test-links.js'});
    const b=new GramlotBuilder(null,{collections:[inputs]});
    b.root.dataController({func:'recordLink',request:'^gramlot.device.links.request'});
    f.app.src.startSource(b.source);
    await flush();
    assert.equal(f.node('links').attr.listening,true);
    emit({id:'one',url:'gallery'});
    emit({id:'one',url:'gallery'});
    emit({id:'two',url:'other'});
    assert.deepEqual(seen,['gallery','other']);
    const saved=f.data.getItem('gramlot.device.links.request');
    emit({id:'bad',url:7});
    assert.equal(f.data.getItem('gramlot.device.links.request'),saved);
    assert.equal(f.node('links').attr.listenerError.code,'FAILED');
    f.app.dispose();await flush();assert.equal(stops,1);
    emit({id:'late',url:'gallery'});assert.deepEqual(seen,['gallery','other']);
});

test('link startup disposal removes late listener and setup errors are explicit', async t => {
    const ready=deferred();let stops=0, signal, emit;
    const f=fixture(t,{capabilities:['links'],startLinkEvents(cb,s){emit=cb;signal=s;return ready.promise;}});
    await flush();f.app.dispose();assert.equal(signal.aborted,true);
    ready.resolve(async()=>{stops++;});await flush();assert.equal(stops,1);
    emit({id:'late',url:'gallery'});assert.equal(f.data.getItem('gramlot.device.links.request'),null);
    const failed=fixture(t,{capabilities:['links'],async startLinkEvents(){throw new Error('setup failed');}});
    await flush();assert.equal(failed.node('links').attr.listening,false);
    assert.equal(failed.node('links').attr.listenerError.message,'setup failed');
});


test('database driver writes state, rejects a second connection and closes with the page', async t => {
    let closes=0;
    const f=fixture(t,{capabilities:['database'],async openDatabase(){return {async query(){return [{text:'saved'}];},async execute(){throw new Error('constraint failed');},async close(){closes++;}};}});
    const statuses=[]; f.data.subscribe('database-test',{update:event=>{if(event.node===f.node('database'))statuses.push(event.node.attr.status);}});
    const db=await f.app.dvc.openDatabase('notes');
    assert.deepEqual(statuses,['pending','success']);
    assert.equal(f.node('database').attr.status,'success');
    await assert.rejects(f.app.dvc.openDatabase('other'),/already owns/);
    assert.deepEqual(await db.query('SELECT text'),[{text:'saved'}]);
    await assert.rejects(db.execute('INSERT'),/constraint/);
    assert.equal(f.node('database').attr.status,'error');
    f.app.dispose();await f.app.dvc.cleanup;assert.equal(closes,1);
    await assert.rejects(db.query('SELECT'),/disposed|closed/i);
});
test('database opened after page disposal closes without a late Data write', async t => {
    const pending=deferred();let closes=0;
    const f=fixture(t,{capabilities:['database'],openDatabase(){return pending.promise;}});
    const result=f.app.dvc.openDatabase('notes');f.app.dispose();
    pending.resolve({async close(){closes++;}});
    await assert.rejects(result,/closed/i);await f.app.dvc.cleanup;assert.equal(closes,1);
});
