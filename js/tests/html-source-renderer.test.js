// Copyright 2025 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { GramlotRenderer } from '../src/renderer/gramlot-renderer.js';
import { HtmlElement } from '../src/view/html.js';
import { HtmlBuilder, SourceBag } from 'genro-builders-js';
import html5 from '../../src/gramlot/collections/html5.json' with {type: 'json'};

function sourceBlock(builder) {
    return new SourceBag(null, builder);
}

function element(builder, bag, label, tag, value = '', attrs = {}) {
    return builder.setChild(bag, tag, value, {node_label: label, ...attrs});
}

test('HTML source renderer mounts and reacts with ordered records and cleanup', () => {
    const document = new JSDOM('<main id="root"></main>').window.document;
    const builder = new HtmlBuilder();
    const source = builder.source;
    const section = element(builder, source, 'section', 'section', sourceBlock(builder), { id: 'panel' });
    element(builder, section.value, 'a', 'span', 'A');
    const renderer = new GramlotRenderer(builder, source, document.getElementById('root')).mount();
    assert.equal(document.getElementById('panel').textContent, 'A');
    let cleaned = 0;
    renderer.onDispose(section, () => cleaned += 1);
    const mountedSection = source.getNode('section');
    builder.wrapSource(mountedSection).strong('B', {node_label: 'b'});
    assert.equal(document.getElementById('panel').textContent, 'AB');
    section.setAttr({ title: 'updated' });
    assert.equal(document.getElementById('panel').title, 'updated');
    source.popNode('section');
    assert.equal(cleaned, 1);
    assert.equal(renderer.records.size, 0);
    renderer.dispose();
});

test('same-tag scalar value update preserves element, reference and cleanup ownership', () => {
    const document = new JSDOM('<main id="root"></main>').window.document;
    const builder = new HtmlBuilder();
    const source = builder.source;
    const heading = element(builder, source, 'heading', 'h1', 'old', {__ref: 'heading'});
    const entries = new Map();
    let removed = 0;
    const references = {
        validate() {},
        register(node, element) { entries.set(node, element); },
        remove(node) { removed += 1; entries.delete(node); },
    };
    const renderer = new GramlotRenderer(builder, source, document.getElementById('root'), {
        html: new HtmlElement({metadataAttributes: ['__ref']}), references,
    }).mount();
    const original = document.querySelector('h1');
    let cleaned = 0;
    renderer.onDispose(heading, () => cleaned += 1);
    heading.setValue('new');
    assert.equal(document.querySelector('h1'), original);
    assert.equal(original.textContent, 'new');
    assert.equal(entries.get(heading), original);
    assert.equal(removed, 0);
    assert.equal(cleaned, 0);
    renderer.dispose();
    assert.equal(cleaned, 1);
});

test('dialect metadata is validated separately and never leaks into HTML', () => {
    const document = new JSDOM('<main id="root"></main>').window.document;
    const builder = new HtmlBuilder();
    const source = builder.source;
    element(builder, source, 'p', 'p', 'text', { __ref: 'owned' });
    const renderer = new GramlotRenderer(builder, source, document.getElementById('root'), {
        html: new HtmlElement({ metadataAttributes: ['__ref'] }),
    }).mount();
    assert.equal(document.querySelector('p').hasAttribute('__ref'), false);
    const openAttrs = sourceBlock(builder); element(builder, openAttrs, 'p', 'p', 'text', { definitelyUnknown: 'x' });
    assert.doesNotThrow(() => renderer.validateCandidate(openAttrs));
    const invalid = sourceBlock(builder);
    invalid._setBuilderItem(builder, null, 'p', 'text', {invalidValue: {}}, '>', false, true, null, false, true, null, 'p');
    assert.throws(() => renderer.validateCandidate(invalid), /must be scalar/);
    renderer.dispose();
});

test('events render each inserted or replaced element once', () => {
    class CountingHtml extends HtmlElement {
        constructor() { super(); this.creates = 0; }
        create(...args) { this.creates += 1; return super.create(...args); }
    }
    const document = new JSDOM('<main id="root"></main>').window.document;
    const builder = new HtmlBuilder();
    const source = builder.source;
    const html = new CountingHtml();
    const renderer = new GramlotRenderer(builder, source, document.getElementById('root'), {html});
    const initial = sourceBlock(builder); element(builder, initial, 'p', 'p', 'old');
    source.setItem('main', initial);
    assert.equal(html.creates, 1);
    const target = source.getNode('main').value.getNode('p');
    const originalValue = target.value;
    const replacement = sourceBlock(builder); element(builder, replacement, 'strong', 'strong', 'new');
    target.setValue(replacement, true, {_text: null}, true);
    assert.equal(html.creates, 3); // initial p + strong + replacement p
    assert.equal(document.getElementById('root').textContent, 'new');
    renderer.dispose();
});

test('active grammar renders native and collection-mapped tags without a DOM whitelist', () => {
    const collection = {
        document_format: html5.document_format,
        grammar: {...html5.grammar, name: 'test-controls'},
        abstracts: {},
        elements: {
            fancyBox: {...html5.elements.div, sub_tags: '*', _meta: {render_tag: 'gramlot-fancy-box'}},
        },
    };
    const document = new JSDOM('<main id="root"></main>').window.document;
    const builder = new HtmlBuilder().loadGrammar(collection);
    const source = builder.source;
    element(builder, source, 'canvas', 'canvas', 'fallback', {class_: 'surface', data_owner_id: '42'});
    element(builder, source, 'custom', 'fancyBox', 'content', {enabled: true});
    const renderer = new GramlotRenderer(
        builder, source, document.getElementById('root'),
    ).mount();
    assert.equal(document.querySelector('canvas.surface').dataset.ownerId, '42');
    assert.equal(document.querySelector('gramlot-fancy-box').textContent, 'content');
    assert.equal(document.querySelector('gramlot-fancy-box').getAttribute('enabled'), 'true');
    renderer.dispose();
});

test('native boolean attributes use presence semantics and reflected properties', () => {
    const document = new JSDOM('<main id="root"></main>').window.document;
    const builder = new HtmlBuilder();
    const source = builder.source;
    const input = element(builder, source, 'input', 'input', '', {checked: true, readonly: true});
    const renderer = new GramlotRenderer(
        builder, source, document.getElementById('root'),
    ).mount();
    const domInput = document.querySelector('input');
    assert.equal(domInput.checked, true);
    assert.equal(domInput.readOnly, true);
    input.setAttr({checked: false, readonly: false});
    assert.equal(domInput.hasAttribute('checked'), false);
    assert.equal(domInput.hasAttribute('readonly'), false);
    assert.equal(domInput.checked, false);
    assert.equal(domInput.readOnly, false);
    renderer.dispose();
});
