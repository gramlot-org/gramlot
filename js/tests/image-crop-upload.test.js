import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {toTytx} from '@genrojs/tytx';
import {ImageCropSession} from '../src/components/image-crop.js';
import {UploadEngine} from '../src/components/upload-engine.js';

test('a confirmed crop can use the existing upload engine without putting files in Data', async t => {
    const {window} = new JSDOM('<main></main>');
    t.after(() => window.close());
    const original = new window.File(['original'], 'photo.png', {type:'image/png'});
    const cropBlob = new window.Blob(['cropped'], {type:'image/png'});
    const context = {scale() {}, translate() {}, rotate() {}, drawImage() {}};
    const document = {createElement() { return {getContext:() => context, toBlob:callback => callback(cropBlob)}; }};
    const session = new ImageCropSession({state:new Bag(),document, original, image:{}, sourceWidth:2, sourceHeight:2,
        width:2, height:2, x:0, y:0, zoom:1, rotate:0});
    const edited = await session.confirm({outputWidth:2, outputHeight:2, type:'image/png'});
    const uploadFile = new window.File([edited], original.name, {type:edited.type});
    let sent, completed, metadata;
    class Xhr extends window.EventTarget {
        constructor() { super(); this.upload = new window.EventTarget(); }
        open() {} setRequestHeader() {}
        send(file) { sent = file; this.status = 200; this.responseText = toTytx({state:'completed',result:'/images/photo.png'});
            queueMicrotask(() => this.dispatchEvent(new window.Event('load'))); }
        abort() { this.dispatchEvent(new window.Event('abort')); }
    }
    window.XMLHttpRequest = Xhr;
    const gramlot = {pageId:'page',uploadUrl:'/upload',capabilities:['upload'],rpc:{call:async (type,name,params) => {
        metadata = params.metadata; return {transferId:'transfer',authorization:'private-token'};
    }}};
    const store = new Bag();
    const engine = new UploadEngine({gramlot,window,store,operation:'save_image',getContext:() => ({}),onChange() {},onComplete:(item,result) => {completed = result;}});
    t.after(() => engine.dispose());
    const id = engine.add(uploadFile);
    await engine.start(id);
    assert.equal(sent, uploadFile);
    assert.equal(sent.size, 7);
    assert.deepEqual(metadata, {name:'photo.png',size:7,mediaType:'image/png',fields:{},context:{}});
    assert.equal(completed, '/images/photo.png');
    assert.equal(session.original, original);
    assert.equal(original.size, 8);
    assert.equal(store.toTytx().includes('private-token'), false);
});
