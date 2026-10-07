import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {HtmlBuilder, SourceBag} from '@genrojs/builders';
import {Bag, BagNode} from '@genrojs/bag';
import {Gramlot} from '../src/gramlot.js';
import {GramlotBuilderBag} from '../src/builder/source.js';
import {GramlotRenderer} from '../src/renderer/gramlot-renderer.js';

/** A Gramlot page: its Source reaches the renderer as events while it is filled. */
function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    return {document, app, builder: app.src.builder, renderer: app.src.renderer};
}

test('a scalar update validates only its node; insertion creates one DOM element', () => {
    const {document, builder, renderer} = page();
    for (let i = 0; i < 100; i++) builder.root.div('stable');
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
    const {document, app, builder, renderer} = page();
    builder.root.p('stable', {id: 'stable'});

    const plainRoot = new Bag();
    plainRoot.setItem('fake', 'plain', {tag: 'p'});
    assert.throws(() => new GramlotRenderer(builder, plainRoot, document.querySelector('main'), {binding: app.src.binding}),
        /GramlotBuilderBag/);
    assert.throws(() => new GramlotRenderer(builder, builder.source, document.querySelector('main')), /BindingRuntime/);
    assert.throws(() => renderer.validateCandidate(plainRoot), /GramlotBuilderBag/);
    const nestedPlain = new GramlotBuilderBag(null, builder);
    nestedPlain.setItem('branch', plainRoot, {}, '>', false, true, null, false, true, null, 'div');
    assert.throws(() => renderer.validateCandidate(nestedPlain), /SourceBag|scalar/);

    class PlainNodeSource extends GramlotBuilderBag {
        get nodeClass() { return BagNode; }
    }
    const malformed = new PlainNodeSource(null, builder);
    malformed.setItem('fake', 'plain', {}, '>', false, true, null, false, true, null, 'p');
    assert.throws(() => renderer.validateCandidate(malformed), /GramlotBuilderBagNode/);

    // R07: a generic SourceBag, also one produced by HtmlBuilder, is not a Gramlot Source.
    const generic = new SourceBag(null, builder);
    generic.setItem('fake', 'plain', {}, '>', false, true, null, false, true, null, 'p');
    assert.throws(() => renderer.validateCandidate(generic), /GramlotBuilderBags/);
    const html = new HtmlBuilder();
    html.root.p('html');
    assert.throws(() => renderer.validateCandidate(html.source), /GramlotBuilderBags/);

    const missingNodeTag = new GramlotBuilderBag(null, builder);
    missingNodeTag.setItem('fake', 'plain', {tag: 'p'});
    assert.throws(() => renderer.validateCandidate(missingNodeTag), /fragment|nodeTag|SourceBagNode/i);
    assert.equal(document.getElementById('stable').textContent, 'stable');
    renderer.dispose();
});

test('unbound typed Source is rejected and never acquires fallback builder ownership', () => {
    const {renderer} = page();
    const unbound = new GramlotBuilderBag();
    unbound.setItem('candidate', 'text', {}, '>', false, true, null, false, true, null, 'p');
    const node = unbound.getNode('candidate');
    assert.equal(unbound._builder, null);
    assert.equal(node.builder, null);
    assert.throws(() => renderer.validateCandidate(unbound), /builder|bound/i);
    assert.equal(unbound._builder, null);
    assert.equal(node.builder, null);
    renderer.dispose();
});
