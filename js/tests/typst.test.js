import test from 'node:test';
import assert from 'node:assert/strict';
import {Worker as NodeWorker} from 'node:worker_threads';
import {JSDOM} from 'jsdom';
import {Gramlot,GramlotBuilder} from '../src/index.js';
import typst from '../src/components/typst.js';
import source from '../dist/typst-worker-source.js';

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const workers=[];
class FakeWorker {
    constructor(){this.jobs=[];workers.push(this);}
    postMessage(job){this.jobs.push(job);}
    terminate(){this.stopped=true;}
    answer(job,result={svg:'<svg xmlns="http://www.w3.org/2000/svg"/>',pdf:new Uint8Array([1]),diagnostics:[]}){this.onmessage({data:{id:job.id,...result}});}
}
const {window}=new JSDOM('<body></body>',{pretendToBeVisual:true});
globalThis.Worker=FakeWorker;
window.URL.createObjectURL=URL.createObjectURL;window.URL.revokeObjectURL=URL.revokeObjectURL;window.Blob=Blob;
function fixture(){
    window.document.body.innerHTML='<main id="gramlot-root"></main>';
    const app=new Gramlot({document:window.document,transport:false,collections:[typst]});
    const builder=new GramlotBuilder(null,{collections:[typst]});
    app.data.setItem('source','= First');
    builder.root.typstPreview({id:'preview',value:'^source',filename:'report.pdf'});
    app.src.startSource(builder.toTytx());
    return {app,preview:window.document.getElementById('preview')};
}

test('preview invalidates old PDF immediately, rejects stale results and releases its Worker',async()=>{
    const {app,preview}=fixture();await wait(450);
    const worker=workers.at(-1);assert.equal(worker.jobs.length,1);
    app.data.setItem('source','= Latest');
    worker.answer(worker.jobs[0]);await wait(450);
    assert.equal(preview.download.hasAttribute('href'),false);
    assert.equal(worker.jobs[1].value,'= Latest');
    worker.answer(worker.jobs[1]);await wait(0);
    assert.equal(preview.download.getAttribute('aria-disabled'),'false');assert.equal(preview.download.download,'report.pdf');
    assert.equal(preview.image.hidden,false);
    const url=preview.download.href;
    app.data.setItem('source','#invalid(');
    assert.equal(preview.download.hasAttribute('href'),false);assert.equal(preview.image.hidden,true);
    await assert.rejects(fetch(url));
    await wait(450);worker.answer(worker.jobs.at(-1),{error:'/main.typ:1: error: unclosed delimiter'});await wait(0);
    assert.match(preview.status.textContent,/unclosed delimiter/);assert.equal(preview.download.hasAttribute('href'),false);
    app.dispose();assert.equal(worker.stopped,true);
});
test('disposing before the debounce starts creates no Worker',async()=>{
    const count=workers.length,{app}=fixture();app.dispose();await wait(450);assert.equal(workers.length,count);
});
test('multiple previews share a Worker until the last owner closes',async()=>{
    const {acquireCompiler}=await import('../src/components/typst-client.js');
    const count=workers.length,first=acquireCompiler(),second=acquireCompiler();
    assert.equal(workers.length,count+1);
    const worker=workers.at(-1),result=second.compile('Second document');
    first.release();assert.equal(worker.stopped,undefined);
    worker.answer(worker.jobs[0]);assert.ok((await result).pdf);
    second.release();assert.equal(worker.stopped,true);
});

test('browser compiler produces multipage PDF and static SVG without network, diagnoses errors and recovers',{timeout:20000},async()=>{
    const worker=new NodeWorker(`const {parentPort}=require('node:worker_threads');globalThis.self=globalThis;let requests=0;globalThis.fetch=()=>{requests++;throw Error('Network forbidden in offline test');};self.postMessage=data=>parentPort.postMessage({...data,networkRequests:requests});${source}\nparentPort.on('message',data=>self.onmessage({data}));`,{eval:true});
    try{
        let id=0;
        const compile=value=>new Promise((resolve,reject)=>{worker.once('message',resolve);worker.once('error',reject);worker.postMessage({id:++id,value});});
        const valid=await compile('#set text(font: "Libertinus Serif")\n= First\n$ integral_0^1 x^2 dif x $\n#pagebreak()\n= Second');
        assert.equal(valid.error,undefined);assert.equal(new TextDecoder().decode(valid.pdf.subarray(0,5)),'%PDF-');
        assert.match(valid.svg,/<svg/);assert.doesNotMatch(valid.svg,/<script/);
        assert.equal((valid.svg.match(/class="typst-page"/g)||[]).length,2);
        const bad=await compile('#let a = (');assert.match(bad.error,/unclosed delimiter/);assert.equal(bad.pdf,undefined);
        const absent=await compile('#include "other.typ"');assert.match(absent.error,/failed to load file/);assert.equal(absent.networkRequests,0);
        const external=await compile('#import \"@preview/cetz:0.3.4\": *');assert.match(external.error,/External Typst packages/);assert.equal(external.networkRequests,0);
        const recovery=await compile('Recovered');assert.ok(recovery.pdf.length>1000);assert.equal(recovery.error,undefined);
    }finally{await worker.terminate();}
});

test('Worker crash rejects pending jobs and the same owners can retry on a new Worker',async()=>{
    const {acquireCompiler}=await import('../src/components/typst-client.js');
    const first=acquireCompiler(),second=acquireCompiler();
    const failed=workers.at(-1);
    const a=assert.rejects(first.compile('first'),/compiler crashed/);
    const b=assert.rejects(second.compile('second'),/compiler crashed/);
    failed.onerror({message:'compiler crashed'});
    await Promise.all([a,b]);assert.equal(failed.stopped,true);
    assert.equal(failed.onmessage,null);assert.equal(failed.onerror,null);
    const retry=first.compile('retry'),replacement=workers.at(-1);
    assert.notEqual(replacement,failed);
    const next=second.compile('other');assert.equal(workers.at(-1),replacement);
    replacement.answer(replacement.jobs[0]);replacement.answer(replacement.jobs[1]);
    assert.ok((await retry).pdf);assert.ok((await next).pdf);
    first.release();assert.equal(replacement.stopped,undefined);
    second.release();assert.equal(replacement.stopped,true);
});
