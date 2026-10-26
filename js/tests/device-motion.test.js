import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, Bag} from '../src/index.js';
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve();};
function fixture(t, overrides={}) {
    const {window}=new JSDOM('<main></main>');
    const app=new Gramlot({document:window.document,element:window.document.querySelector('main'),transport:false});
    const callbacks={},starts={},stops={};
    const stream=name=>async cb=>{callbacks[name]=cb;starts[name]=(starts[name]??0)+1;return async()=>{stops[name]=(stops[name]??0)+1;};};
    app.dvc.attach({capabilities:['orientation','gyroscope','accelerometer'],startOrientationEvents:stream('orientation'),
        startGyroscopeUpdates:stream('gyroscope'),startAccelerometerUpdates:stream('accelerometer'),...overrides});
    t.after(async()=>{app.dispose();await app.dvc.cleanup;window.close();});
    return {app,callbacks,starts,stops,node:name=>app.data.getNode(`gramlot.device.${name}`)};
}
test('screen state is automatic while physical sensors remain opt-in',async t=>{
    const f=fixture(t);await flush();
    assert.equal(f.starts.orientation,1);assert.equal(f.starts.gyroscope,undefined);
    f.callbacks.orientation({type:'landscape',direction:'secondary',timestamp:10});
    assert.equal(f.node('orientation').value.getItem('type'),'landscape');
    assert.equal(f.node('orientation').attr.status,'success');
    f.callbacks.orientation({type:'diagonal',direction:'secondary',timestamp:11});
    assert.equal(f.node('orientation').attr.status,'error');
    assert.equal(f.node('orientation').value.getItem('timestamp'),10);
});
for(const name of ['gyroscope','accelerometer'])test(`${name} intent, background state, samples, stop and late callbacks`,async t=>{
    const f=fixture(t),node=f.node(name);await flush();
    assert.deepEqual(node.attr,{enabled:false,watching:false,status:'idle',error:null});
    node.setAttr({enabled:true});await flush();assert.equal(f.starts[name],1);
    const send=f.callbacks[name];send({kind:'state',watching:true});
    send({kind:'sample',x:0.1,y:0.2,z:-1,timestamp:12});
    assert.ok(node.value instanceof Bag);assert.equal(node.value.getItem('z'),-1);
    assert.equal(node.attr.status,'success');
    send({kind:'sample',x:99,y:99,z:99,timestamp:10});assert.equal(node.value.getItem('x'),0.1);
    send({kind:'state',watching:false});assert.equal(node.attr.enabled,true);assert.equal(node.attr.watching,false);
    send({kind:'sample',x:99,y:99,z:99,timestamp:13});assert.equal(node.value.getItem('x'),0.1);
    send({kind:'state',watching:true});send({kind:'sample',x:0.3,y:0,z:0,timestamp:14});
    assert.equal(node.value.getItem('x'),0.3);
    node.setAttr({enabled:false});await flush();assert.equal(f.stops[name],1);
    send({kind:'state',watching:true});assert.equal(node.attr.watching,false);
    send({kind:'sample',x:99,y:99,z:99,timestamp:15});assert.equal(node.value.getItem('x'),0.3);
    assert.equal(node.attr.status,'idle');
});
test('stop during pending startup releases resource before restart; disposal rejects late samples',async t=>{
    let resolve,start=0,stops=0;
    const f=fixture(t,{startGyroscopeUpdates(cb){start++;f.callbacks.gyroscope=cb;return new Promise(r=>{resolve=r;});}});
    const node=f.node('gyroscope');node.setAttr({enabled:true});await flush();
    node.setAttr({enabled:false});node.setAttr({enabled:true});await flush();assert.equal(start,1);
    resolve(async()=>{stops++;});await flush();assert.equal(start,2);assert.equal(stops,1);
    f.app.dispose();resolve(async()=>{stops++;});await f.app.dvc.cleanup;
    assert.equal(stops,2);f.callbacks.gyroscope({kind:'state',watching:true});assert.equal(node.attr.watching,false);
});
test('unavailable sensors, malformed samples and denied permission are explicit; errors never retry by themselves',async t=>{
    const f=fixture(t,{capabilities:['gyroscope']});const gyro=f.node('gyroscope');
    f.node('accelerometer').setAttr({enabled:true});await flush();
    assert.equal(f.node('accelerometer').attr.status,'unavailable');
    gyro.setAttr({enabled:true});await flush();f.callbacks.gyroscope({kind:'state',watching:true});
    f.callbacks.gyroscope({kind:'sample',x:NaN,y:0,z:0,timestamp:1});assert.equal(gyro.attr.status,'error');
    f.callbacks.gyroscope({kind:'error',error:Object.assign(new Error('Denied'),{code:'PERMISSION_DENIED'})});
    assert.equal(gyro.attr.status,'denied');assert.equal(gyro.attr.watching,false);assert.equal(gyro.attr.enabled,true);
    await flush();assert.equal(f.starts.gyroscope,1);
});


test('a Data controller can disable the sensor synchronously when pending is written',async t=>{
    const f=fixture(t),node=f.node('gyroscope');
    f.app.data.subscribe('cancel-motion',{update:event=>{
        if(event.node===node && node.attr.status==='pending' && node.attr.enabled) node.setAttr({enabled:false});
    }});
    node.setAttr({enabled:true});await flush();
    assert.equal(f.starts.gyroscope,undefined);assert.equal(node.attr.enabled,false);assert.equal(node.attr.watching,false);
});


test('delayed native activation updates watching and the displayed axis bindings',async t=>{
    const f=fixture(t),b=new GramlotBuilder();
    b.root.span('^gramlot.device.gyroscope.x',{id:'motion-x'});
    b.root.span('^gramlot.device.gyroscope?watching',{id:'motion-watching'});
    f.app.src.startSource(b.source);
    const node=f.node('gyroscope');node.setAttr({enabled:true});await flush();
    const document=f.app.src.renderer.destination.ownerDocument;
    f.callbacks.gyroscope({kind:'state',watching:false});
    assert.equal(document.getElementById('motion-x').textContent,'');
    assert.equal(document.getElementById('motion-watching').textContent,'false');
    f.callbacks.gyroscope({kind:'state',watching:true});
    f.callbacks.gyroscope({kind:'sample',x:1.25,y:0,z:-0.5,timestamp:30});
    assert.equal(document.getElementById('motion-x').textContent,'1.25');
    assert.equal(document.getElementById('motion-watching').textContent,'true');
    assert.equal(node.attr.status,'success');
});
