import test from 'node:test';
import assert from 'node:assert/strict';
import {HttpTransport} from '../src/http-transport.js';

test('offline keepalive rejection cannot escape best-effort page close',async()=>{
    let sent;
    const transport=new HttpTransport('/rpc',{closeUrl:'/close',fetcher:(url,options)=>{
        sent={url,options};return Promise.reject(new TypeError('Offline'));
    }});
    assert.equal(transport.close('page-1'),undefined);
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(sent.url,'/close');assert.equal(sent.options.keepalive,true);
    assert.deepEqual(JSON.parse(sent.options.body),{pageId:'page-1'});
});

test('a synchronous delivery error cannot prevent local disposal',()=>{
    const fail=()=>{throw new Error('Delivery unavailable');};
    const transport=new HttpTransport('/rpc',{fetcher:fail,navigator:{sendBeacon:fail}});
    assert.doesNotThrow(()=>transport.close('page-1'));
    assert.doesNotThrow(()=>transport.close('page-1',{beacon:true}));
});
