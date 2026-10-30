import test from 'node:test';
import assert from 'node:assert/strict';
import {toTytxIter, createDecimal, isDecimal} from '@genrojs/tytx';
import {decodeSelectionStream, loadSelectionTrial} from '../src/experiments/selection-transfer.js';

function stream(frames, size=7) {
    const text=[...toTytxIter(frames)].map(frame=>JSON.stringify(frame)+'\n').join('');
    const bytes=new TextEncoder().encode(text);
    return new ReadableStream({start(controller){for(let i=0;i<bytes.length;i+=size)controller.enqueue(bytes.slice(i,i+size));controller.close();}});
}
const metrics=()=>({bytes:0,decode_ms:0,bag_ms:0});
const frames=()=>[{kind:'start',id:'x'},
    {kind:'row',record:{id:'row',description:'Caffè 🫖',quantity:2,price:createDecimal('1234567890123456.78'),date:new Date('2026-10-29T00:00:00Z'),optional:null}},
    {kind:'end',id:'x',count:1,requested:100,query_ms:2,encode_ms:3}];

test('JSONL preserves arbitrary UTF-8 chunk boundaries and typed row attributes',async()=>{
    const m=metrics(), selection=await decodeSelectionStream(stream(frames(),1),'x',m);
    const row=selection.getItem('rows').getNodes()[0];
    assert.equal(row.staticValue,null); assert.equal(row.getAttr('description'),'Caffè 🫖');
    assert.equal(row.getAttr('price').toString(),'1234567890123456.78');assert.ok(isDecimal(row.getAttr('price')));
    assert.equal(row.getAttr('date').toISOString(),'2026-10-29T00:00:00.000Z');
    assert.equal(selection.getItem('count'),1);assert.ok(m.bytes>0);
});
for(const [name,alter] of [
    ['missing completion',f=>f.slice(0,2)],['wrong count',f=>[...f.slice(0,2),{...f[2],count:2}]],
    ['wrong request ID',f=>[{...f[0],id:'other'},...f.slice(1)]],
    ['data after completion',f=>[...f,f[1]]],['server failure',f=>[f[0],f[1],{kind:'error',id:'x',message:'failed'}]]
])test(`JSONL rejects ${name}`,async()=>{await assert.rejects(decodeSelectionStream(stream(alter(frames())),'x',metrics()));});
test('JSONL rejects a truncated final line',async()=>{
    const body=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('{"kind":"start"}'));c.close();}});
    await assert.rejects(decodeSelectionStream(body,'x',metrics()),/Incomplete/);
});
test('JSONL errors cancel the upstream reader',async()=>{
    let cancelled=false;
    const body=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('not-json\n'));},cancel(){cancelled=true;}});
    await assert.rejects(decodeSelectionStream(body,'x',metrics()));assert.ok(cancelled);
});
test('a load aborted after the last frame cannot publish a selection',async()=>{
    const controller=new AbortController();
    const fetcher=async(url,options)=>{
        const id=JSON.parse(options.body).id;
        controller.abort();
        return new Response(stream([{kind:'start',id},{kind:'end',id,count:0,requested:100,query_ms:0}]),{headers:{'content-type':'application/x-ndjson'}});
    };
    await assert.rejects(loadSelectionTrial({url:'/trial',pageId:'p',method:'m',limit:'100',signal:controller.signal,fetcher}),{name:'AbortError'});
});


test('JSONL loader reports typed selection metrics and requires the streaming content type', async () => {
    const fetcher = async (url, options) => {
        const id = JSON.parse(options.body).id;
        return new Response(stream([{kind:'start', id}, frames()[1],
            {kind:'end', id, count:1, requested:100, query_ms:2, encode_ms:3}]),
            {headers:{'content-type':'application/x-ndjson'}});
    };
    const options = {url:'/trial', pageId:'p', method:'m', limit:'100', signal:new AbortController().signal};
    const result = await loadSelectionTrial({...options, fetcher});
    assert.equal(result.selection.getItem('count'), 1);
    assert.equal(result.metrics.query_ms, 2);
    assert.equal(result.metrics.encode_ms, 3);
    assert.ok(result.metrics.bytes > 0);
    assert.ok(result.metrics.total_ms >= result.metrics.receive_ms);
    await assert.rejects(loadSelectionTrial({...options, fetcher:async () => new Response('{}',
        {headers:{'content-type':'application/json'}})}), /Expected JSONL response/);
});
