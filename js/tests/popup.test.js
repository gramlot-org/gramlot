import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {positionPopup} from '../src/components/popup.js';

function geometry(t, rect, size) {
    const {window} = new JSDOM('<button></button><div></div>');
    t.after(() => window.close());
    const anchor = window.document.querySelector('button');
    const popup = window.document.querySelector('div');
    Object.assign(window, {innerWidth:800, innerHeight:600});
    anchor.getBoundingClientRect = () => rect;
    popup.getBoundingClientRect = () => ({width:Math.min(size.width, parseFloat(popup.style.getPropertyValue('--gramlot-popup-available-width'))), height:size.height});
    return {anchor, popup};
}
test('a cascading popup opens beside its row, aligned to its top', t => {
    const {popup, anchor} = geometry(t, {left:20, right:250, top:120, bottom:148}, {width:200,height:160});
    positionPopup(popup, anchor, {placement:'side'});
    assert.equal(popup.style.left, '253px');
    assert.equal(popup.style.top, '120px');
});
test('a cascading popup flips left and stays above the lower viewport edge', t => {
    const {popup, anchor} = geometry(t, {left:550, right:780, top:550, bottom:578}, {width:200,height:160});
    positionPopup(popup, anchor, {placement:'side'});
    assert.equal(popup.style.left, '347px');
    assert.equal(popup.style.top, '432px');
});
test('ordinary popups still open below, or above when space requires it', t => {
    const {popup, anchor} = geometry(t, {left:20, right:250, top:120, bottom:148}, {width:200,height:160});
    positionPopup(popup, anchor);
    assert.equal(popup.style.left, '20px');
    assert.equal(popup.style.top, '151px');
    anchor.getBoundingClientRect = () => ({left:20,right:250,top:550,bottom:578});
    positionPopup(popup, anchor);
    assert.equal(popup.style.top, '387px');
});
