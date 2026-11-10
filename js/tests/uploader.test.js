import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import uploads from '../src/components/uploads.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function setup(t, autoUpload, {onComplete = null, logic = null, manualUpload = true, contextPath = null} = {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    let sent = 0, calls = [];
    class Xhr extends window.EventTarget {
        constructor() { super(); this.upload = new window.EventTarget(); this.headers = {}; }
        open(method, url) { this.url = url; }
        setRequestHeader(name, value) { this.headers[name] = value; }
        send(file) { sent++; this.status = 200; this.responseText = toTytx({state:'completed',result:'stored'}); queueMicrotask(() => this.dispatchEvent(new window.Event('load'))); }
        abort() { this.dispatchEvent(new window.Event('abort')); }
    }
    window.XMLHttpRequest = Xhr;
    const app = new Gramlot({document:window.document, transport:false, pageId:'page', uploadUrl:'/gramlot/upload',
        capabilities:['upload'], collections:[uploads]});
    app.rpc.call = async (type, name, params) => { calls.push({type,name,params}); return {transferId:'transfer',authorization:'secret'}; };
    const store = new Bag(); app.data.setItem('form.queue', store);
    if (logic) app.src.logicRegistry.register(logic, {group:null, resource:'/upload-test.js'});
    const b = new GramlotBuilder(null, {collections:[uploads]});
    b.root.div({datapath:'form'}).uploader({id:'uploader', operation:'import_source', storepath:'.queue', contextPath, autoUpload, manualUpload, onComplete});
    app.src.startSource(b.toTytx());
    const host = window.document.getElementById('uploader');
    const file = new window.File(['hello'], 'file.grmlt', {type:'text/plain'});
    Object.defineProperty(host.input, 'files', {value:[file], configurable:true});
    t.after(() => {app.dispose(); window.close();});
    return {window, app, host, store, get sent() {return sent;}, calls};
}

test('explicit mode queues without exposing files or grants in Data', async t => {
    const f = setup(t, false);
    f.host.input.dispatchEvent(new f.window.Event('change'));
    assert.equal(f.sent, 0);
    assert.equal(f.store.getNodes().length, 1);
    const item = f.store.getNodes()[0];
    assert.equal(item.value.getItem('status'), 'queued');
    f.host.startButton.click();
    await tick(); await tick();
    assert.equal(f.sent, 1);
    assert.equal(item.value.getItem('status'), 'completed');
    assert.equal(item.value.getItem('result'), 'stored');
    assert.equal(f.store.toTytx().includes('secret'), false);
    assert.equal(f.calls[0].name, 'prepare');
});

test('automatic mode starts when a file is selected', async t => {
    const f = setup(t, true);
    f.host.input.dispatchEvent(new f.window.Event('change'));
    await tick(); await tick();
    assert.equal(f.sent, 1);
    assert.equal(f.store.getNodes()[0].value.getItem('status'), 'completed');
});

test('invalid file type is rejected on the shared selection path', async t => {
    const f = setup(t, false);
    f.host.projectAttributes({operation:'import_source', storepath:'.queue', accept:'.pdf', autoUpload:false}, x => x);
    f.host.input.dispatchEvent(new f.window.Event('change'));
    assert.equal(f.store.getNodes().length, 0);
    assert.match(f.host.message.textContent, /not accepted/);
});

test('lost response is reconciled and completion callback runs once', async t => {
    let completed = 0;
    const f = setup(t, false, {onComplete:'done', logic:class { done() { completed++; } }});
    class LostXhr extends f.window.EventTarget {
        constructor() { super(); this.upload = new f.window.EventTarget(); }
        open() {} setRequestHeader() {}
        send() { queueMicrotask(() => this.dispatchEvent(new f.window.Event('error'))); }
        abort() { this.dispatchEvent(new f.window.Event('abort')); }
    }
    f.window.XMLHttpRequest = LostXhr;
    f.app.rpc.call = async (type, name) => name === 'prepare' ? {transferId:'transfer',authorization:'secret'} :
        {state:'completed', result:'recovered'};
    f.host.input.dispatchEvent(new f.window.Event('change'));
    f.host.startButton.click();
    await tick(); await tick();
    assert.equal(f.store.getNodes()[0].value.getItem('status'), 'completed');
    assert.equal(f.store.getNodes()[0].value.getItem('result'), 'recovered');
    assert.equal(completed, 1);
});

test('queued file can be removed without sending it', async t => {
    const f = setup(t, false);
    f.host.input.dispatchEvent(new f.window.Event('change'));
    assert.equal(f.store.getNodes().length, 1);
    [...f.host.list.querySelectorAll('button')].find(button => button.textContent === 'Preview').click();
    assert.equal(f.store.getNodes().length, 1);
    const remove = [...f.host.list.querySelectorAll('button')].find(button => button.textContent === 'Remove');
    remove.click();
    assert.equal(f.store.getNodes().length, 0);
    assert.equal(f.sent, 0);
});


test('text preview renders untrusted markup as text', async t => {
    const f = setup(t, false);
    const file = {name:'test.html', size:25, type:'text/html', text:async () => '<img src=x onerror=alert(1)>'};
    Object.defineProperty(f.host.input, 'files', {value:[file], configurable:true});
    f.host.input.dispatchEvent(new f.window.Event('change'));
    const preview = [...f.host.list.querySelectorAll('button')].find(button => button.textContent === 'Preview');
    preview.click();
    await tick();
    assert.equal(f.host.preview.querySelector('pre').textContent, '<img src=x onerror=alert(1)>');
    assert.equal(f.host.preview.querySelector('img'), null);
});

test('image preview revokes its object URL when removed', t => {
    const f = setup(t, false);
    const revoked = [];
    f.window.URL.createObjectURL = () => 'blob:preview';
    f.window.URL.revokeObjectURL = url => revoked.push(url);
    const file = {name:'image.png', size:4, type:'image/png'};
    Object.defineProperty(f.host.input, 'files', {value:[file], configurable:true});
    f.host.input.dispatchEvent(new f.window.Event('change'));
    const buttons = [...f.host.list.querySelectorAll('button')];
    buttons.find(button => button.textContent === 'Preview').click();
    assert.equal(f.host.preview.querySelector('img').getAttribute('src'), 'blob:preview');
    buttons.find(button => button.textContent === 'Remove').click();
    assert.deepEqual(revoked, ['blob:preview']);
    assert.equal(f.host.preview.querySelector('img'), null);
});

test('uncertain transfer stays non-retryable until status confirms completion', async t => {
    const f = setup(t, false);
    class Lost extends f.window.EventTarget {
        constructor() { super(); this.upload = new f.window.EventTarget(); }
        open() {} setRequestHeader() {}
        send() { queueMicrotask(() => this.dispatchEvent(new f.window.Event('error'))); }
        abort() { this.dispatchEvent(new f.window.Event('abort')); }
    }
    f.window.XMLHttpRequest = Lost;
    let calls = 0;
    f.app.rpc.call = async (type, name) => name === 'prepare' ? {transferId:'transfer',authorization:'secret'} :
        (++calls === 1 ? {state:'pending'} : {state:'completed',result:'saved'});
    f.host.input.dispatchEvent(new f.window.Event('change'));
    f.host.startButton.click();
    await tick(); await tick();
    const row = f.store.getNodes()[0].value;
    assert.equal(row.getItem('status'), 'uncertain');
    assert.equal([...f.host.list.querySelectorAll('button')].some(button => button.textContent === 'Retry'), false);
    [...f.host.list.querySelectorAll('button')].find(button => button.textContent === 'Check status').click();
    await tick(); await tick();
    assert.equal(row.getItem('status'), 'completed');
    assert.equal(row.getItem('result'), 'saved');
});


test('simultaneous status checks invoke completion only once', async t => {
    let completed = 0, resolveStatus, statusCalls = 0;
    const f = setup(t, false, {onComplete:'done', logic:class { done() { completed++; } }});
    class Lost extends f.window.EventTarget {
        constructor() { super(); this.upload = new f.window.EventTarget(); }
        open() {} setRequestHeader() {}
        send() { queueMicrotask(() => this.dispatchEvent(new f.window.Event('error'))); }
    }
    f.window.XMLHttpRequest = Lost;
    f.app.rpc.call = async (type, name) => {
        if (name === 'prepare') return {transferId:'transfer',authorization:'secret'};
        if (++statusCalls === 1) return {state:'pending'};
        return new Promise(resolve => { resolveStatus = resolve; });
    };
    f.host.input.dispatchEvent(new f.window.Event('change'));
    f.host.startButton.click(); await tick(); await tick();
    const check = [...f.host.list.querySelectorAll('button')].find(button => button.textContent === 'Check status');
    check.click(); check.click();
    assert.equal(statusCalls, 2);
    resolveStatus({state:'completed',result:'saved'});
    await tick(); await tick();
    assert.equal(f.store.getNodes()[0].value.getItem('status'), 'completed');
    assert.equal(completed, 1);
});


test('per-file metadata is snapshotted independently at preparation', async t => {
    const f = setup(t, false);
    const second = new f.window.File(['two'], 'other.txt', {type:'text/plain'});
    Object.defineProperty(f.host.input, 'files', {value:[f.host.input.files[0], second], configurable:true});
    f.host.projectAttributes({operation:'import_source', storepath:'.queue', multiple:true, autoUpload:false}, x => x);
    f.host.input.dispatchEvent(new f.window.Event('change'));
    const [first, other] = f.store.getNodes();
    first.value.getItem('metadata').setItem('description', 'first');
    first.value.getItem('metadata').setItem('details', new Bag({category:'source', count:2}));
    other.value.getItem('metadata').setItem('description', 'second');
    f.host.startButton.click();
    await tick(); await tick();
    assert.deepEqual(f.calls.map(c => c.params.metadata.fields), [
        {description:'first', details:{category:'source', count:2}}, {description:'second'}
    ]);
    first.value.getItem('metadata').setItem('description', 'changed');
    assert.equal(f.calls[0].params.metadata.fields.description, 'first');
});


test('shared uploader sends files through the Worker transport', async t => {
    const f = setup(t, false);
    f.app.uploadUrl = null;
    let received;
    f.app.rpc.transport = {close() {}, dispose() {}, upload:async (request, progress) => {
        received = request;
        progress(request.file.size);
        return {state:'completed', result:'worker saved'};
    }};
    f.host.input.dispatchEvent(new f.window.Event('change'));
    const row = f.store.getNodes()[0].value;
    row.getItem('metadata').setItem('title', 'Worker example');
    f.host.startButton.click();
    await tick(); await tick();
    assert.equal(received.file.name, 'file.grmlt');
    assert.equal(received.authorization, 'secret');
    assert.equal(row.getItem('loaded'), 5);
    assert.equal(row.getItem('result'), 'worker saved');
    assert.deepEqual(f.calls[0].params.metadata.fields, {title:'Worker example'});
    assert.equal(f.store.toTytx().includes('secret'), false);
});


test('summary derives progress and mixed outcomes from the same queue', async t => {
    const f = setup(t, false);
    f.host.projectAttributes({operation:'import_source', storepath:'.queue', multiple:true, autoUpload:false}, x => x);
    Object.defineProperty(f.host.input, 'files', {value:[new f.window.File(['one'], 'one.txt'), new f.window.File(['two!'], 'two.txt')], configurable:true});
    let sent = 0;
    class Transfer extends f.window.EventTarget {
        constructor() { super(); this.upload = new f.window.EventTarget(); }
        open() {} setRequestHeader() {}
        send(file) {
            const progress = new f.window.Event('progress');
            Object.defineProperty(progress, 'loaded', {value:file.size});
            this.upload.dispatchEvent(progress);
            if (++sent === 1) { this.status = 200; this.responseText = toTytx({state:'completed',result:'stored'});
                queueMicrotask(() => this.dispatchEvent(new f.window.Event('load'))); }
            else queueMicrotask(() => this.dispatchEvent(new f.window.Event('error')));
        }
        abort() { this.dispatchEvent(new f.window.Event('abort')); }
    }
    f.window.XMLHttpRequest = Transfer;
    f.app.rpc.call = async (type, name) => name === 'prepare' ? {transferId:'id',authorization:'secret'} : {state:'pending'};
    f.host.input.dispatchEvent(new f.window.Event('change'));
    assert.match(f.host.summary.textContent, /2 files — 0\/7 bytes · 2 queued/);
    f.host.startButton.click();
    await tick(); await tick(); await tick();
    assert.match(f.host.summary.textContent, /2 files — 7\/7 bytes/);
    assert.match(f.host.summary.textContent, /1 completed/);
    assert.match(f.host.summary.textContent, /1 uncertain/);
});


test('queued files start when automatic upload becomes enabled after record save', async t => {
    const f = setup(t, '^.ready', {manualUpload:false});
    f.host.input.dispatchEvent(new f.window.Event('change'));
    await tick();
    assert.equal(f.sent, 0);
    assert.equal(f.host.startButton.hidden, true);
    f.host.startButton.click();
    await tick();
    assert.equal(f.sent, 0);
    const row = f.store.getNodes()[0].value;
    row.getItem('metadata').setItem('recordId', 'record-123');
    f.app.data.setItem('form.ready', true);
    await tick(); await tick();
    assert.equal(f.sent, 1);
    assert.equal(f.calls[0].params.metadata.fields.recordId, 'record-123');
    assert.equal(row.getItem('status'), 'completed');
    f.app.data.setItem('form.ready', false);
    f.app.data.setItem('form.ready', true);
    await tick();
    assert.equal(f.sent, 1);
});


test('shared context is read after record save and stays separate from per-file fields', async t => {
    const f=setup(t,'^.ready',{manualUpload:false,contextPath:'.context'});
    f.app.data.setItem('form.context',new Bag({recordId:null,details:new Bag({type:'invoice'})}));
    f.host.input.dispatchEvent(new f.window.Event('change')); await tick();
    const row=f.store.getNodes()[0].value;
    row.getItem('metadata').setItem('recordId','per-file-value');
    f.app.data.setItem('form.context.recordId','saved-123');
    f.app.data.setItem('form.ready',true); await tick(); await tick();
    assert.equal(f.sent,1);
    assert.deepEqual(f.calls[0].params.metadata.context,{recordId:'saved-123',details:{type:'invoice'}});
    assert.deepEqual(f.calls[0].params.metadata.fields,{recordId:'per-file-value'});
    f.app.data.setItem('form.context.recordId','changed');
    assert.equal(f.calls[0].params.metadata.context.recordId,'saved-123');
    f.host.input.dispatchEvent(new f.window.Event('change')); await tick(); await tick();
    assert.equal(f.sent,2);assert.equal(f.calls[1].params.metadata.context.recordId,'changed');
});

test('invalid shared context fails before preparation', async t => {
    const f=setup(t,false,{contextPath:'.context'});
    f.app.data.setItem('form.context','not a Bag');
    f.host.input.dispatchEvent(new f.window.Event('change')); f.host.startButton.click(); await tick();
    assert.equal(f.calls.length,0);assert.equal(f.sent,0);
    const row=f.store.getNodes()[0].value;assert.equal(row.getItem('status'),'failed');
    assert.match(row.getItem('error'),/contextPath must resolve to a Bag/);
});

test('moving the uploader DOM retains queued files and the upload engine',async t=>{
    const f=setup(t,false);
    f.host.input.dispatchEvent(new f.window.Event('change'));
    const destination=f.window.document.createElement('section');f.window.document.body.append(destination);
    destination.append(f.host);await tick();
    f.host.startButton.click();await tick();await tick();
    assert.equal(f.sent,1);
    assert.equal(f.store.getNodes()[0].value.getItem('status'),'completed');
});

test('the queue is reached by address: a replacement at storepath receives the next files', async t => {
    const f = setup(t, false);
    f.host.input.dispatchEvent(new f.window.Event('change'));
    assert.equal(f.store.getNodes().length, 1);
    assert.deepEqual(Object.keys(f.store._updSubscribers), [], 'the uploader keeps no subscription on the queue Bag');
    const replacement = new Bag();
    f.app.data.setItem('form.queue', replacement); await tick();
    assert.equal(f.host.list.children.length, 0, 'the list shows the queue at the address');
    f.host.input.dispatchEvent(new f.window.Event('change'));
    assert.equal(replacement.getNodes().length, 1, 'the engine writes into the queue at the address');
    assert.equal(f.store.getNodes().length, 1);
    f.host.startButton.click(); await tick(); await tick();
    assert.equal(replacement.getNodes()[0].value.getItem('status'), 'completed');
});
