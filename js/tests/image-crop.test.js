import {Bag} from '@genrojs/bag';
import test from 'node:test';
import assert from 'node:assert/strict';
import {renderImageCrop} from '../src/components/image-crop.js';

function fixture() {
    const calls = [];
    const blob = new Blob(['result'], {type:'image/png'});
    const context = Object.fromEntries(['scale','translate','rotate','drawImage'].map(name => [name, (...args) => calls.push([name,...args])]));
    const canvas = {getContext:() => context, toBlob:callback => callback(blob)};
    const document = {createElement:() => canvas};
    const image = {};
    const params = {document,image,sourceWidth:800,sourceHeight:600,width:400,height:200,
        outputWidth:800,outputHeight:400,x:15,y:-10,zoom:1.5,rotate:90,type:'image/png'};
    return {calls,blob,canvas,image,params};
}

test('crop applies the viewport transform to a new output at matching aspect ratio', async () => {
    const f = fixture();
    assert.equal(await renderImageCrop(f.params), f.blob);
    assert.equal(f.canvas.width, 800); assert.equal(f.canvas.height, 400);
    assert.deepEqual(f.calls, [['scale',2,2],['translate',215,90],['rotate',Math.PI/2],['scale',1.5,1.5],
        ['drawImage',f.image,-400,-300,800,600]]);
});

test('crop rejects distorted output, invalid geometry and silent format fallback', async () => {
    const f = fixture();
    await assert.rejects(renderImageCrop({...f.params,outputWidth:799}), /aspect ratio/);
    await assert.rejects(renderImageCrop({...f.params,zoom:0}), /transform/);
    await assert.rejects(renderImageCrop({...f.params,outputHeight:0}), /dimensions/);
    await assert.rejects(renderImageCrop({...f.params,type:'image/webp'}), /Unsupported image format/);
    await assert.rejects(renderImageCrop({...f.params,quality:2}), /quality/);
});

import {ImageCropSession} from '../src/components/image-crop.js';

test('editing retains the original, resets framing and produces a new Blob only on confirmation', async () => {
    const f = fixture();
    const original = new Blob(['original'], {type:'image/png'});
    const state = new Bag();
    const session = new ImageCropSession({state,...f.params, original});
    session.setTransform({x:2,y:3,zoom:2,rotate:0});
    assert.deepEqual(state.getItem('transform'), {x:2,y:3,zoom:2,rotate:0});
    const copy = session.transform; copy.x = 100;
    assert.equal(session.transform.x, 2);
    session.reset();
    assert.deepEqual(session.transform, {x:15,y:-10,zoom:1.5,rotate:90});
    assert.equal(session.original, original);
    assert.equal(await session.confirm({outputWidth:800,outputHeight:400,type:'image/png'}), f.blob);
    assert.equal(await original.text(), 'original');
    assert.throws(() => session.reset(), /closed/);
});

test('cancelling or changing an edit prevents a late canvas result from being committed', async () => {
    for (const cancel of [true, false]) {
        const f = fixture();
        let complete;
        f.canvas.toBlob = callback => { complete = callback; };
        const session = new ImageCropSession({state:new Bag(),...f.params, original:new Blob(['original'])});
        const result = session.confirm({outputWidth:800,outputHeight:400,type:'image/png'});
        if (cancel) session.cancel();
        else session.setTransform({x:0,y:0,zoom:1,rotate:0});
        complete(f.blob);
        await assert.rejects(result, {name:'AbortError'});
    }
});
