import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@jsr/genro__builders';
import {GramlotBuilder, GramlotRenderer} from '../src/index.js';

function setup() {
    const builder = new GramlotBuilder();
    const panel = sourceTarget(builder.root.section(null, {id: 'panel'}));
    builder.wrapSource(panel).span('old');
    const sibling = sourceTarget(builder.root.p('outside'));
    const document = new JSDOM('<main></main>').window.document;
    const renderer = new GramlotRenderer(builder, builder.source, document.querySelector('main')).mount();
    return {builder, panel, sibling, document, renderer};
}

test('freeze holds subtree DOM while Source and unrelated branches change synchronously', () => {
    const {builder, panel, sibling, document, renderer} = setup();
    const original = document.querySelector('#panel');
    let creates = 0, cleaned = 0;
    const create = renderer.html.create.bind(renderer.html);
    renderer.html.create = (...args) => { creates++; return create(...args); };
    renderer.onDispose(panel.value.getNodes()[0], () => cleaned++);
    renderer.freeze(panel);
    panel.value.clear();
    builder.wrapSource(panel).strong('final');
    panel.setAttr({title: 'changed'});
    sibling.setValue('immediate');
    assert.equal(panel.value.getNodes()[0].value, 'final');
    assert.equal(original.textContent, 'old');
    assert.equal(original.title, '');
    assert.equal(document.querySelector('p').textContent, 'immediate');
    assert.equal(creates, 0);
    renderer.unfreeze(panel);
    const current = document.querySelector('#panel');
    assert.equal(current.textContent, 'final');
    assert.equal(current.title, 'changed');
    assert.notEqual(current, original);
    assert.equal(creates, 2);
    assert.equal(cleaned, 1);
    renderer.dispose();
});

test('insert then delete during freeze never constructs the intermediate element', () => {
    const {builder, panel, document, renderer} = setup();
    renderer.freeze(panel);
    const transient = builder.wrapSource(panel).em('transient');
    panel.value.popNode(transient.label);
    renderer.unfreeze(panel);
    assert.equal(document.querySelector('em'), null);
    assert.equal(document.querySelector('#panel').textContent, 'old');
    renderer.dispose();
});

test('disposal releases frozen subtree resources', () => {
    const {panel, renderer, document} = setup();
    let cleaned = 0;
    renderer.onDispose(panel.value.getNodes()[0], () => cleaned++);
    renderer.freeze(panel);
    panel.value.clear();
    renderer.dispose();
    assert.equal(cleaned, 1);
    assert.equal(renderer.records.size, 0);
    assert.equal(document.querySelector('main').childNodes.length, 0);
});


test('unfreezing a child waits for its frozen ancestor', () => {
    const {panel, renderer, document} = setup();
    const child = panel.value.getNodes()[0];
    renderer.freeze(panel);
    renderer.freeze(child);
    child.setValue('final');
    renderer.unfreeze(child);
    assert.equal(document.querySelector('span').textContent, 'old');
    assert.equal(renderer.pending.length, 0);
    renderer.unfreeze(panel);
    assert.equal(document.querySelector('span').textContent, 'final');
    child.setValue('live');
    assert.equal(document.querySelector('span').textContent, 'live');
    renderer.dispose();
});

test('unfreezing an ancestor also releases frozen descendants', () => {
    const {panel, renderer, document} = setup();
    const child = panel.value.getNodes()[0];
    renderer.freeze(child);
    renderer.freeze(panel);
    renderer.freeze(panel); // A flag, not a counter.
    child.setValue('final');
    renderer.unfreeze(panel);
    assert.equal(document.querySelector('span').textContent, 'final');
    child.setValue('live');
    assert.equal(document.querySelector('span').textContent, 'live');
    renderer.dispose();
});

test('independent frozen branches resume independently', () => {
    const {panel, sibling, renderer, document} = setup();
    renderer.freeze(panel);
    renderer.freeze(sibling);
    panel.value.getNodes()[0].setValue('panel');
    sibling.setValue('sibling');
    renderer.unfreeze(panel);
    assert.equal(document.querySelector('span').textContent, 'panel');
    assert.equal(document.querySelector('p').textContent, 'outside');
    renderer.unfreeze(sibling);
    assert.equal(document.querySelector('p').textContent, 'sibling');
    renderer.dispose();
});

test('a deleted frozen root is removed on unfreeze, not rebuilt', () => {
    const {builder, panel, renderer, document} = setup();
    let cleaned = 0;
    renderer.onDispose(panel, () => cleaned++);
    renderer.freeze(panel);
    builder.source.popNode(panel.label);
    assert.equal(document.querySelector('#panel').textContent, 'old');
    assert.equal(renderer.pending.length, 0);
    renderer.unfreeze(panel);
    assert.equal(document.querySelector('#panel'), null);
    assert.equal(cleaned, 1);
    renderer.dispose();
});

test('clear can discard frozen deletions and process other branches immediately', () => {
    const {builder, panel, renderer, document} = setup();
    renderer.freeze(panel);
    builder.source.clear();
    assert.equal(document.querySelector('p'), null);
    assert.equal(document.querySelector('#panel').textContent, 'old');
    renderer.unfreeze(panel);
    assert.equal(document.querySelector('main').childNodes.length, 0);
    renderer.dispose();
});

test('discarded frozen descendants retain references only until the branch is rebuilt', () => {
    const {builder, panel, renderer, document} = setup();
    const child = panel.value.getNodes()[0];
    child.setAttr({__ref: 'same'});
    renderer.freeze(panel);
    panel.value.clear();
    const replacement = new GramlotBuilder();
    replacement.root.strong('final', {__ref: 'same'});
    replacement.source.bindBuilder(builder);
    renderer.validateCandidate(replacement.source, {replacingNode: panel});
    panel.setValue(replacement.source);
    assert.equal(renderer.references.resolve({$gramlotRef: 'same', kind: 'node'}), child);
    renderer.unfreeze(panel);
    assert.equal(renderer.references.resolve({$gramlotRef: 'same', kind: 'dom'}), document.querySelector('strong'));
    assert.equal(renderer.records.has(child), false);
    renderer.dispose();
});
