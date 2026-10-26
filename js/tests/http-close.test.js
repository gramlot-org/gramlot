import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {HttpTransport, Gramlot, PageBootstrap} from '../src/index.js';

const noFetch = () => {throw Error('Close must not use fetch');};

test('explicit HTTP close sends a single JSON beacon, preserving its navigator receiver', async () => {
    const calls = [];
    const navigator = {sendBeacon(url, body){assert.equal(this,navigator);calls.push({url,body});return true;}};
    const transport = new HttpTransport('/rpc', {closeUrl:'/prefix/close', navigator, fetcher:noFetch});
    assert.equal(transport.close('page-1'), undefined);
    assert.equal(calls.length,1);
    assert.equal(calls[0].url,'/prefix/close');
    assert.equal(calls[0].body.type.split(';',1)[0],'application/json');
    assert.deepEqual(JSON.parse(await calls[0].body.text()), {pageId:'page-1'});
});

test('a refused or blocked beacon does not retry or prevent local disposal', () => {
    for (const outcome of [false, new DOMException('Blocked','SecurityError')]) {
        let calls=0;
        const transport=new HttpTransport('/rpc',{fetcher:noFetch,navigator:{sendBeacon(){
            calls++;
            if(outcome instanceof Error) throw outcome;
            return outcome;
        }}});
        assert.doesNotThrow(()=>transport.close('page-1'));
        assert.equal(calls,1);
    }
});

test('missing beacon API and invalid close configuration are visible, never replaced by fetch', () => {
    for (const navigator of [null, {}, {sendBeacon:42}]) {
        const transport=new HttpTransport('/rpc',{navigator,fetcher:noFetch});
        assert.throws(()=>transport.close('page-1'), /requires navigator.sendBeacon/);
    }
    for (const closeUrl of [null, 42, '', '  ']) {
        const transport=new HttpTransport('/rpc',{closeUrl,fetcher:noFetch,navigator:{sendBeacon(){assert.fail('Invalid URL reached beacon');}}});
        assert.throws(()=>transport.close('page-1'), /closeUrl must be nonempty text/);
    }
});

test('native malformed URL TypeErrors remain visible across browser realms', t => {
    const {window}=new JSDOM('',{runScripts:'outside-only'});
    t.after(()=>window.close());
    const invalid=new window.TypeError('Invalid URL');
    assert.equal(invalid instanceof TypeError,false);
    const transport=new HttpTransport('/rpc',{fetcher:noFetch,navigator:{sendBeacon(){throw invalid;}}});
    assert.throws(()=>transport.close('page-1'), error=>error===invalid);
});

test('regular RPC still uses fetch and does not send a close beacon', async () => {
    const calls=[];
    const transport=new HttpTransport('/rpc',{navigator:{sendBeacon(){assert.fail('RPC sent a beacon');}},
        fetcher:async(url,options)=>{calls.push({url,options});return {status:200,text:async()=>'response'};}});
    assert.equal(await transport.call('request'),'response');
    assert.equal(calls[0].url,'/rpc');
    assert.equal(calls[0].options.body,'request');
});

test('configuration error propagates after Gramlot releases local resources and transport', t => {
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    t.after(()=>window.close());
    const transport=new HttpTransport('/rpc',{navigator:{},fetcher:noFetch});
    let released=0;
    transport.dispose=()=>{released++;};
    const app=new Gramlot({pageId:'page-1',document:window.document,transport});
    assert.throws(()=>app.dispose(), /requires navigator.sendBeacon/);
    assert.equal(app.state,'disposed');
    assert.equal(app.abort.signal.aborted,true);
    assert.equal(app.src.renderer.disposed,true);
    assert.equal(released,1);
    assert.doesNotThrow(()=>app.dispose());
    window.dispatchEvent(new window.Event('pagehide'));
    assert.equal(released,1);
});

test('bootstrap cleanup releases the transport even when close configuration is invalid', () => {
    const transport=new HttpTransport('/rpc',{navigator:{},fetcher:noFetch});
    let released=0;
    transport.dispose=()=>{released++;};
    const bootstrap=new PageBootstrap({config:{pageId:'page-1'},resources:{}});
    bootstrap.serverAdapter={createTransport:()=>transport};
    assert.throws(()=>bootstrap.closePage(), /requires navigator.sendBeacon/);
    assert.equal(released,1);
});


test('invalid close configuration cannot leave bootstrap waiting for pending styles', {timeout:2000}, async t => {
    const {window}=new JSDOM('<main id="gramlot-root"></main>',{url:'https://app.test/'});
    t.after(()=>window.close());
    const errors=[];
    window.addEventListener('error',event=>{errors.push(event.error);event.preventDefault();});
    const transport=new HttpTransport('/rpc',{navigator:{},fetcher:noFetch});
    let released=0;
    transport.dispose=()=>{released++;};
    const bootstrap=new PageBootstrap({config:{pageId:'page-1'},resources:{css:['/pending.css'],js:[]},document:window.document});
    bootstrap.serverAdapter={createTransport:()=>transport};
    const starting=bootstrap.run();
    window.dispatchEvent(new window.Event('pagehide'));
    assert.equal(await starting,null);
    assert.equal(released,1);
    assert.equal(errors.length,1);
    assert.match(errors[0].message,/requires navigator.sendBeacon/);
    window.dispatchEvent(new window.Event('pagehide'));
    assert.equal(errors.length,1);
});
