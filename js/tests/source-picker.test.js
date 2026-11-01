import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {SourcePicker} from '../src/source-picker.js';

test('preview selection suppresses actions, follows rendering and releases resources', async () => {
    const {window} = new JSDOM('<main><button>Item</button></main>');
    const canvas = window.document.querySelector('main'), button = canvas.querySelector('button');
    const owner = {}, child = {fullpath:'design.item'}, other = {fullpath:'outside.item'};
    const root = {parentNode:owner, fullpath:'design', staticValue:{getNode:path => path === 'item' ? child : null}};
    const records = new Map([[owner,{presentation:canvas}],[child,{node:child,presentation:button}]]);
    const elements = new WeakMap([[button,records.get(child)]]);
    let cleanup, selected, action = 0;
    const renderer = {records,elements,onDispose(node, callback) { assert.equal(node,owner); cleanup=callback; return () => {}; }};
    button.addEventListener('click', () => action++);
    const picker = new SourcePicker({renderer,root,onSelect:node => {selected=node;}});
    const click = new window.MouseEvent('click',{bubbles:true,cancelable:true});
    assert.equal(button.dispatchEvent(click),false); assert.equal(selected,child); assert.equal(action,0);
    picker.select(child); assert.equal(button.classList.contains('gramlot-source-selected'),true);
    assert.throws(() => picker.select(other),/inside the preview/);
    const replacement = window.document.createElement('button');
    records.set(child,{node:child,presentation:replacement}); elements.set(replacement,records.get(child));
    button.replaceWith(replacement); await new Promise(resolve => window.setTimeout(resolve,0));
    assert.equal(replacement.classList.contains('gramlot-source-selected'),true);
    assert.equal(button.classList.contains('gramlot-source-selected'),false);
    cleanup(); assert.equal(replacement.classList.contains('gramlot-source-selected'),false);
    replacement.addEventListener('click', () => action++);
    replacement.click(); assert.equal(action,1); picker.dispose(); window.close();
});
