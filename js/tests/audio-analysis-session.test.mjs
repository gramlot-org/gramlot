import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioAnalysisSession,audioAnalysisOptions} from '../src/components/audio-analysis-session.js';
function fixture(pending=false) {
    let resolve;const counters={stops:0,closes:0,frames:[],states:[],requests:0};const callbacks=new Map();let next=0;
    const track={stop(){counters.stops++;},addEventListener(){},removeEventListener(){}};
    const stream={getTracks:()=>[track]};
    const analyser={fftSize:1024,get frequencyBinCount(){return this.fftSize/2;},disconnect(){},
        getFloatTimeDomainData(a){a.fill(0.25);},getFloatFrequencyData(a){a.fill(-40);}};
    class AudioContext {
        sampleRate=48000;state='running';
        async resume(){} async close(){this.state='closed';counters.closes++;}
        createMediaStreamSource(){return {connect(target){assert.equal(target,analyser);},disconnect(){}};}
        createAnalyser(){return analyser;}
    }
    const window={isSecureContext:true,AudioContext,navigator:{mediaDevices:{getUserMedia(){counters.requests++;return pending?new Promise(r=>resolve=r):Promise.resolve(stream);}}},
        requestAnimationFrame(cb){callbacks.set(++next,cb);return next;},cancelAnimationFrame(id){callbacks.delete(id);}};
    const session=new AudioAnalysisSession(window,{frame:v=>counters.frames.push(v),state:v=>counters.states.push(v),error:e=>{throw e;}});
    return {session,counters,callbacks,resolve:()=>resolve(stream),tick(t){const current=[...callbacks.values()];callbacks.clear();current.forEach(cb=>cb(t));}};
}
test('capture produces exact FFT bins and waveform, limits display rate, and releases resources',async()=>{
    const f=fixture();await f.session.start({fftSize:1024,frameRate:20});
    f.tick(0);f.tick(10);f.tick(50);assert.equal(f.counters.frames.length,2);
    assert.equal(f.counters.frames[0].waveform.length,1024);assert.equal(f.counters.frames[0].spectrum.length,512);
    assert.equal(f.counters.frames[0].sampleRate,48000);
    f.session.configure({fftSize:2048,frameRate:30});f.tick(100);assert.equal(f.counters.frames[2].spectrum.length,1024);
    await f.session.stop();assert.equal(f.counters.stops,1);assert.equal(f.counters.closes,1);assert.equal(f.callbacks.size,0);
    await f.session.stop();assert.equal(f.counters.stops,1);
});
test('Stop while permission is pending releases late media without emitting frames',async()=>{
    const f=fixture(true);const starting=f.session.start({});await Promise.resolve();
    await f.session.stop();f.resolve();await starting;
    assert.equal(f.counters.stops,1);assert.equal(f.counters.closes,1);assert.equal(f.counters.frames.length,0);assert.equal(f.callbacks.size,0);
});
test('invalid configuration never requests microphone',async()=>{
    const f=fixture();await assert.rejects(f.session.start({fftSize:1000}),RangeError);assert.equal(f.counters.requests,0);
    assert.throws(()=>audioAnalysisOptions({frameRate:60}),RangeError);assert.throws(()=>audioAnalysisOptions({minimumDb:0}),RangeError);
});
