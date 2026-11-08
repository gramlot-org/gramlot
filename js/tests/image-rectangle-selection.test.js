import {Bag} from '@genrojs/bag';
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {ImageCropDialog} from '../src/components/image-crop-dialog.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function fixture(t) {
    const {window} = new JSDOM('<body></body>');
    t.after(() => window.close());
    window.HTMLDialogElement.prototype.showModal = function () {this.open = true;};
    window.HTMLDialogElement.prototype.close = function () {this.open = false; this.dispatchEvent(new window.Event('close'));};
    window.ResizeObserver = class { observe() {} disconnect() {} };
    window.Element.prototype.setPointerCapture = function () {};
    window.Element.prototype.hasPointerCapture = () => false;
    window.Element.prototype.releasePointerCapture = function () {};
    // The rectangle view measures 400 x 200: the 400 x 200 source shows at scale 1.
    window.HTMLElement.prototype.getBoundingClientRect = function () {
        return this.className === 'gramlot-crop-rectangle' ? {width: 400, height: 200, left: 0, top: 0} : {width: 0, height: 0, left: 0, top: 0};
    };
    window.HTMLCanvasElement.prototype.getContext = () => ({scale() {}, translate() {}, rotate() {}, drawImage() {}});
    window.HTMLCanvasElement.prototype.toBlob = callback => callback(new window.Blob(['crop'], {type: 'image/png'}));
    const image = window.document.createElement('img'); image.src = 'data:image/png;base64,AA==';
    // zoom 0.5 on a 100 x 100 frame: the 200 x 200 area centered on the image.
    const editor = new ImageCropDialog({state: new Bag(), document: window.document, original: new window.Blob(['original']), image,
        sourceWidth: 400, sourceHeight: 200, width: 100, height: 100, x: 0, y: 0, zoom: 0.5, rotate: 30,
        outputWidth: 64, outputHeight: 64, type: 'image/png'});
    const $ = selector => window.document.querySelector(selector);
    const button = name => [...window.document.querySelectorAll('dialog button')].find(item => item.textContent === name || item.getAttribute('aria-label')?.startsWith(name));
    const pointer = (target, type, x, y) => {
        const event = new window.MouseEvent(type, {bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0});
        Object.defineProperty(event, 'pointerId', {value: 1});
        target.dispatchEvent(event);
    };
    return {window, editor, button, $, pointer};
}

test('Crop shows the rectangle on the whole image; it moves and resizes with the frame ratio; Apply frames it with rotation 0', async t => {
    const f = fixture(t), result = f.editor.open();
    f.button('Crop').click();
    assert.equal(f.$('.crop-rectangle-view').hidden, false);
    assert.equal(f.$('.crop-body').hidden, true);
    const selection = f.$('.crop-selection');
    const box = () => ['left', 'top', 'width', 'height'].map(key => selection.style[key]);
    assert.deepEqual(box(), ['100px', '0px', '200px', '200px']);
    selection.dispatchEvent(new f.window.KeyboardEvent('keydown', {key: 'ArrowRight', shiftKey: true, bubbles: true}));
    assert.deepEqual(box(), ['110px', '0px', '200px', '200px']);
    // The south-east corner shrinks the area; the north-west corner stays.
    f.pointer(selection.querySelector('[data-handle=se]'), 'pointerdown', 310, 200);
    f.pointer(selection, 'pointermove', 210, 200); f.pointer(selection, 'pointerup', 210, 200);
    assert.deepEqual(box(), ['110px', '0px', '100px', '100px']);
    // A drag past the image edge stops at the edge.
    f.pointer(selection, 'pointerdown', 150, 50); f.pointer(selection, 'pointermove', 600, 50); f.pointer(selection, 'pointerup', 600, 50);
    assert.deepEqual(box(), ['300px', '0px', '100px', '100px']);
    f.button('Apply').click();
    assert.equal(f.$('.crop-rectangle-view').hidden, true);
    assert.equal(f.$('.crop-body').hidden, false);
    f.button('Confirm').click(); await tick();
    assert.deepEqual((await result).transform, {x: -150, y: 50, zoom: 1, rotate: 0});
});

test('Back leaves the frame unchanged', async t => {
    const f = fixture(t), result = f.editor.open();
    f.button('Crop').click();
    f.$('.crop-selection').dispatchEvent(new f.window.KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}));
    f.button('Back').click();
    f.button('Confirm').click(); await tick();
    assert.deepEqual((await result).transform, {x: 0, y: 0, zoom: 0.5, rotate: 30});
});
