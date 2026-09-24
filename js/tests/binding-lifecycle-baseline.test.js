// Destination prerequisites for PORT-0005. Reactive Data routing is separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {SourceBag, sourceTarget} from '@jsr/genro__builders';
import {GramlotBuilder} from '../src/builder/gramlot-builder.js';
import {GramlotRenderer} from '../src/renderer/gramlot-renderer.js';

function mounted() {
    const builder = new GramlotBuilder();
    const document = new JSDOM('<main></main>').window.document;
    const mount = () => new GramlotRenderer(builder, builder.source, document.querySelector('main')).mount();
    return {builder, document, mount};
}

test('Builder evaluates Data on mount and Source updates without consuming pointers', () => {
    const {builder, document, mount} = mounted();
    builder.data.setItem('message', 'first');
    builder.data.setItem('other', 'second');
    const node = sourceTarget(builder.root.p('^message', {id: 'bound', title: '=message'}));
    const renderer = mount();
    const element = document.getElementById('bound');
    assert.equal(element.textContent, 'first');
    assert.equal(element.title, 'first');
    assert.equal(node.value, '^message');
    assert.equal(node.getAttr('title'), '=message');

    builder.data.setItem('message', 'changed');

    node.setAttr({title: '=other'});
    assert.strictEqual(document.getElementById('bound'), element);
    assert.equal(element.textContent, 'changed');
    assert.equal(element.title, 'second');
    assert.equal(node.value, '^message');
    assert.equal(node.getAttr('title'), '=other');
    node.setValue('^other');
    assert.strictEqual(document.getElementById('bound'), element);
    assert.equal(element.textContent, 'second');
    assert.equal(node.value, '^other');
    node.setValue('^absent');
    assert.equal(element.textContent, '');
    assert.equal(node.value, '^absent');
    renderer.dispose();
});

test('Source updates resolve branch text and preserve an unchanged input value and caret', () => {
    const {builder, document, mount} = mounted();
    builder.data.setItem('message', 'alpha');
    const panel = sourceTarget(builder.root.div('lead', {id: 'panel'}));
    builder.wrapSource(panel).span('child');
    panel.setAttr({_text: '^message'});
    const input = sourceTarget(builder.root.input({id: 'field', value: '^message'}));
    const renderer = mount();
    const field = document.getElementById('field');
    assert.equal(document.getElementById('panel').textContent, 'alphachild');
    assert.equal(field.value, 'alpha');
    field.focus();
    field.setSelectionRange(2, 2);
    panel.setAttr({title: 'recomputed'});
    input.setAttr({title: 'updated'});
    assert.equal(document.getElementById('panel').textContent, 'alphachild');
    assert.strictEqual(document.getElementById('field'), field);
    assert.equal(field.value, 'alpha');
    assert.equal(field.selectionStart, 2);
    assert.equal(field.selectionEnd, 2);
    assert.equal(input.getAttr('value'), '^message');
    panel.setAttr({_text: null});
    assert.equal(document.getElementById('panel').textContent, 'child');

    // A changed declaration resolving to the live value must not touch the caret.
    field.value = 'beta';
    field.setSelectionRange(2, 2);
    input.setAttr({value: 'beta'});
    assert.equal(field.value, 'beta');
    assert.equal(field.selectionStart, 2);
    assert.equal(field.selectionEnd, 2);

    // An unchanged declaration still projects its canonical value when the DOM diverges.
    field.value = 'stale';
    input.setAttr({title: 'reproject'});
    assert.equal(field.value, 'beta');

    const checkbox = sourceTarget(builder.root.input({type: 'checkbox', checked: true}));
    const box = document.querySelector('input[type="checkbox"]');
    box.checked = false;
    checkbox.setAttr({title: 'reproject'});
    assert.equal(box.checked, true);
    renderer.dispose();
});

test('replacement and disposal release mounted Source-owned cleanup once', () => {
    const {builder, document, mount} = mounted();
    builder.data.setItem('message', 'ready');
    const section = sourceTarget(builder.root.section(null, {id: 'section'}));
    const old = sourceTarget(builder.wrapSource(section).span('^message'));
    const renderer = mount();
    const cleanup = [];
    renderer.onDispose(old, () => cleanup.push('old'));
    const replacement = new SourceBag(null, builder);
    const next = sourceTarget(builder.wrapSource(replacement).strong('new'));
    section.setValue(replacement);
    assert.deepEqual(cleanup, ['old']);
    assert.equal(renderer.records.has(old), false);
    assert.equal(document.getElementById('section').textContent, 'new');
    renderer.onDispose(next, () => cleanup.push('next'));
    renderer.dispose();
    renderer.dispose();
    assert.deepEqual(cleanup, ['old', 'next']);
    assert.equal(renderer.records.size, 0);
});

test('freeze delays Source projection; thaw reads current Data and disposes discarded records', () => {
    const {builder, document, mount} = mounted();
    builder.data.setItem('message', 'before');
    const panel = sourceTarget(builder.root.section(null, {id: 'panel'}));
    const old = sourceTarget(builder.wrapSource(panel).span('^message'));
    const renderer = mount();
    let cleaned = 0;
    renderer.onDispose(old, () => cleaned++);
    renderer.freeze(panel);
    panel.value.popNode(old.label);
    builder.wrapSource(panel).strong('^message');
    builder.data.setItem('message', 'after');
    assert.equal(document.getElementById('panel').textContent, 'before');
    assert.equal(cleaned, 0);
    renderer.unfreeze(panel);
    assert.equal(document.getElementById('panel').textContent, 'after');
    assert.equal(cleaned, 1);
    renderer.dispose();
});
