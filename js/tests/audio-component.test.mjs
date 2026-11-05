import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot,GramlotBuilder} from '../src/index.js';
import audio from '../src/components/audio.js';

test('Source-bound audio emits sample arrays and stops without sending audio',async()=>{
    const {window}=new JSDOM('<main id="gramlot-root"></main>',{url:'http://localhost/'});
    let requestCount=0,stopped=0,closed=0,callback;
    Object.defineProperty(window,'isSecureContext',{value:true});
    Object.defineProperty(window.navigator,'mediaDevices',{value:{async getUserMedia(){requestCount++;return {getTracks:()=>[{stop(){stopped++;},addEventListener(){},removeEventListener(){}}]};}}});
    window.AudioContext=class {sampleRate=48000;state='running';async resume(){}async close(){closed++;this.state='closed';}
        createMediaStreamSource(){return {connect(){},disconnect(){}};}
        createAnalyser(){return {fftSize:1024,get frequencyBinCount(){return this.fftSize/2;},disconnect(){},getFloatTimeDomainData(a){a.fill(.2);},getFloatFrequencyData(a){a.fill(-Infinity);a[10]=-20;}};}};
    window.requestAnimationFrame=fn=>{callback=fn;return 1;};window.cancelAnimationFrame=()=>{callback=null;};
    const app=new Gramlot({document:window.document,transport:false,collections:[audio]});
    app.data.setItem('running',false);
    const builder=new GramlotBuilder(null,{collections:[audio]});
    builder.root.audioAnalyser({running:'^running',waveform:'^waveform',spectrum:'^spectrum',status:'^status',error:'^error',sampleRate:'^sampleRate'});
    app.src.startSource(builder.toTytx());assert.equal(requestCount,0);
    app.data.setItem('running',true);await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(requestCount,1);assert.equal(app.data.getItem('status'),'running');
    callback(100);
    assert.equal(app.data.getItem('waveform').length,1024);assert.equal(app.data.getItem('spectrum').length,512);
    assert.ok(Array.isArray(app.data.getItem('waveform')));
    assert.ok(Array.isArray(app.data.getItem('spectrum')));
    assert.equal(app.data.getItem('spectrum')[10],-20);
    assert.equal(app.data.getItem('spectrum')[0],-100);
    const node=app.data.getNode('waveform'),first=node.staticValue;
    callback(200);
    assert.equal(app.data.getNode('waveform'),node);
    assert.notEqual(node.staticValue,first);
    assert.deepEqual(node.staticValue,first);
    app.data.setItem('running',false);await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(stopped,1);assert.equal(closed,1);assert.equal(callback,null);
    app.dispose();window.close();
});
