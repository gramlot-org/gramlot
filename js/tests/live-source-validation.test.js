import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {HtmlBuilder, SourceBag} from 'genro-builders-js';
import {Bag, BagNode} from 'genro-bag-js';
import {GramlotRenderer} from '../src/renderer/gramlot-renderer.js';

test('a scalar update validates only its node; insertion creates one DOM element', () => {
    const builder = new HtmlBuilder();
    for (let i = 0; i < 100; i++) builder.root.div('stable');
    const document = new JSDOM('<main></main>').window.document;
    const renderer = new GramlotRenderer(builder, builder.source, document.querySelector('main')).mount();
    let validations = 0, creations = 0;
    const validate = renderer.html.validate.bind(renderer.html);
    const create = renderer.html.create.bind(renderer.html);
    renderer.html.validate = (...args) => { validations++; return validate(...args); };
    renderer.html.create = (...args) => { creations++; return create(...args); };
    builder.source.getNodes()[0].setValue('changed');
    assert.equal(validations, 1);
    assert.equal(creations, 0);
    validations = 0;
    builder.root.div('new');
    assert.equal(validations, 1);
    assert.equal(creations, 1);
    assert.equal(document.querySelector('main').textContent, 'changed' + 'stable'.repeat(99) + 'new');
    renderer.dispose();
});

test('renderer rejects unsupported Source representations without mutating mounted state', () => {
    const builder = new HtmlBuilder();
    const document = new JSDOM('<main></main>').window.document;
    const renderer = new GramlotRenderer(builder, builder.source, document.querySelector('main')).mount();
    builder.root.p('stable', {id: 'stable'});

    const plainRoot = new Bag();
    plainRoot.setItem('fake', 'plain', {tag: 'p'});
    assert.throws(() => new GramlotRenderer(builder, plainRoot, document.querySelector('main')), /SourceBag/);
    assert.throws(() => renderer.validateCandidate(plainRoot), /SourceBag/);
    const nestedPlain = new SourceBag(null, builder);
    nestedPlain.setItem('branch', plainRoot, {}, '>', false, true, null, false, true, null, 'div');
    assert.throws(() => renderer.validateCandidate(nestedPlain), /SourceBag|scalar/);

    class PlainNodeSource extends SourceBag {
        get nodeClass() { return BagNode; }
    }
    const malformed = new PlainNodeSource(null, builder);
    malformed.setItem('fake', 'plain', {}, '>', false, true, null, false, true, null, 'p');
    assert.throws(() => renderer.validateCandidate(malformed), /SourceBagNode/);

    const missingNodeTag = new SourceBag(null, builder);
    missingNodeTag.setItem('fake', 'plain', {tag: 'p'});
    assert.throws(() => renderer.validateCandidate(missingNodeTag), /fragment|nodeTag|SourceBagNode/i);
    assert.equal(document.getElementById('stable').textContent, 'stable');
    renderer.dispose();
});

test('unbound typed Source is rejected and never acquires fallback builder ownership', () => {
    const builder = new HtmlBuilder();
    const document = new JSDOM('<main></main>').window.document;
    const renderer = new GramlotRenderer(builder, builder.source, document.querySelector('main')).mount();
    const unbound = new SourceBag();
    unbound.setItem('candidate', 'text', {}, '>', false, true, null, false, true, null, 'p');
    const node = unbound.getNode('candidate');
    assert.equal(unbound._builder, null);
    assert.equal(node.builder, null);
    assert.throws(() => renderer.validateCandidate(unbound), /builder|bound/i);
    assert.equal(unbound._builder, null);
    assert.equal(node.builder, null);
    renderer.dispose();
});
