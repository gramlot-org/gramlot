import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {RendererBase, SourceBag} from '@jsr/genro__builders';
import {GramlotBuilder} from '../src/builder/gramlot-builder.js';
import {GramlotRenderer} from '../src/renderer/gramlot-renderer.js';
import {sourceTarget} from '@jsr/genro__builders';
import html5 from '../../src/gramlot/collections/html5.json' with {type: 'json'};

function setup() {
    const document = new JSDOM('<main id="root"><i id="host"></i></main>').window.document;
    const builder = new GramlotBuilder();
    const source = builder.source;
    const renderer = new GramlotRenderer(builder, source, document.getElementById('root'));
    return {document, builder, source, renderer};
}

function nativeBlock(builder, author) {
    const block = new SourceBag(null, builder, null);
    author(builder.wrapSource(block));
    return block;
}

test('native HTML void behavior follows collection metadata, including aliases', () => {
    const collection = {
        document_format: html5.document_format,
        grammar: {...html5.grammar, name: 'void-aliases'},
        abstracts: {},
        elements: {
            linebreak: {...html5.elements.br, _meta: {...html5.elements.br._meta, render_tag: 'void-alias'}},
            emptyText: {...html5.elements.textarea, _meta: {render_tag: 'span'}},
        },
    };
    const document = new JSDOM('<main id="root"></main>').window.document;
    const builder = new GramlotBuilder(null, {collections: [collection]});
    const renderer = new GramlotRenderer(builder, builder.source, document.getElementById('root'));
    builder.root.linebreak();
    builder.root.br();
    builder.root.input();
    builder.root.emptyText();
    assert.equal(document.querySelector('br').childNodes.length, 0);
    assert.equal(document.querySelector('void-alias').childNodes.length, 0);
    assert.equal(document.querySelector('input').childNodes.length, 0);
    assert.equal(document.querySelector('span').childNodes.length, 1);
    assert.equal(document.querySelector('span').firstChild.nodeType, 3);
    assert.equal(document.querySelector('[void], [_meta]'), null);
    renderer.dispose();
});

test('renderer uses the generic traversal and retains reactive mount ownership', () => {
    const {document, builder, source, renderer} = setup();
    assert.ok(renderer instanceof RendererBase);

    const block = nativeBlock(builder, root => {
        const panel = root.div(null, {id: 'panel'});
        builder.reference(panel, 'dom');
        panel.span('A');
    });
    const panelNode = block.getNodes()[0];
    panelNode.attr.__ref = 'panel-ref';
    source.setItem('main', block);

    assert.equal(document.getElementById('panel').textContent, 'A');
    assert.equal(renderer.records.size, 3); // main fragment, div, span
    assert.equal(renderer.references.resolve({$gramlotRef: 'panel-ref', kind: 'dom'}).id, 'panel');

    const mountedPanel = source.getNode('main').value.getNodes()[0];
    mountedPanel.setAttr({title: 'changed'});
    assert.equal(document.getElementById('panel').title, 'changed');
    assert.equal(document.getElementById('panel').hasAttribute('_meta'), false);
    builder.wrapSource(mountedPanel).strong('B');
    assert.equal(document.getElementById('panel').textContent, 'AB');

    let cleaned = 0;
    renderer.onDispose(mountedPanel, () => cleaned++);
    source.popNode('main');
    assert.equal(cleaned, 1);
    assert.equal(renderer.records.size, 0);
    assert.equal(document.querySelector('#host')?.id, 'host');
    renderer.dispose();
});

test('native SourceBag nodes keep nodeTag and scalar text through live rendering', () => {
    const {document, builder, renderer} = setup();
    const authored = builder.root.p('native text', {id: 'native'});
    const node = sourceTarget(authored);

    assert.equal(node.nodeTag, 'p');
    assert.equal(node.value, 'native text');
    assert.equal('tag' in node.attr, false);
    assert.equal('_text' in node.attr, false);
    assert.equal(document.getElementById('native').textContent, 'native text');
    assert.equal(renderer.records.get(node).node, node);

    node.setAttr({title: 'keeps text', _text: 'stale compatibility text'});
    assert.equal(document.getElementById('native').title, 'keeps text');
    assert.equal(document.getElementById('native').textContent, 'native text');
    node.setValue('replacement');
    assert.equal(document.getElementById('native').textContent, 'replacement');
    renderer.dispose();
});

test('null stays in Source and becomes empty text only at the DOM boundary', () => {
    const {document, builder, renderer} = setup();
    const node = sourceTarget(builder.root.p(null, {id: 'empty'}));
    const element = document.getElementById('empty');
    assert.equal(node.value, null);
    assert.equal(element.textContent, '');

    for (const [value, text] of [['hello', 'hello'], [null, ''], [0, '0'], [false, 'false']]) {
        node.setValue(value);
        assert.equal(node.value, value);
        assert.equal(document.getElementById('empty'), element);
        assert.equal(element.textContent, text);
    }

    const input = sourceTarget(builder.root.input({id: 'field', value: 'hello'}));
    input.setAttr({value: null});
    assert.equal(input.getAttr('value'), null);
    assert.equal(document.getElementById('field').value, '');
    renderer.dispose();
});

test('candidate validation is read-only and excludes only replaced descendants', () => {
    const {builder, source, renderer} = setup();
    const initial = nativeBlock(builder, root => {
        const target = root.section();
        target.attr.__ref = 'target';
        const old = target.span('old');
        old.attr.__ref = 'old';
    });
    source.setItem('main', initial);
    const mountedTarget = source.getNode('main').value.getNodes()[0];

    const replacement = nativeBlock(builder, root => {
        const fresh = root.strong('new');
        fresh.attr.__ref = 'old';
    });
    assert.equal(renderer.validateCandidate(replacement, {replacingNode: mountedTarget}), replacement);
    assert.equal(renderer.records.size, 3);

    const targetConflict = nativeBlock(builder, root => {
        const bad = root.strong('bad');
        bad.attr.__ref = 'target';
    });
    assert.throws(
        () => renderer.validateCandidate(targetConflict, {replacingNode: mountedTarget}),
        /Duplicate Source reference/,
    );
    assert.equal(mountedTarget.value.getNodes()[0].attr.__ref, 'old');
    renderer.dispose();
});

test('invalid detached candidates do not emit observed events or mutate mounted state', () => {
    const {document, builder, source, renderer} = setup();
    const initial = nativeBlock(builder, root => {
        const stable = root.p('stable');
        stable.attr.__ref = 'stable';
    });
    source.setItem('main', initial);
    const before = document.getElementById('root').innerHTML;
    let events = 0;
    source.subscribe('candidate-test', {any: () => events++});

    const invalid = nativeBlock(builder, root => {
        const one = root.span('one');
        one.attr.__ref = 'stable';
    });
    assert.throws(() => renderer.validateCandidate(invalid), /Duplicate Source reference/);
    assert.equal(events, 0);
    assert.equal(document.getElementById('root').innerHTML, before);
    assert.equal(renderer.references.resolve({$gramlotRef: 'stable', kind: 'node'}).value, 'stable');
    renderer.dispose();
});

test('nested typed branches retain ordering and disposable ownership', () => {
    const {document, builder, source, renderer} = setup();
    const incoming = nativeBlock(builder, root => {
        const panel = root.div('A');
        panel.span('B', {node_label: 'middle'});
        panel.strong('C', {node_label: 'last'});
    });
    source.setItem('main', incoming);
    assert.equal(document.getElementById('root').textContent, 'ABC');

    const panelNode = source.getNode('main').value.getNodes()[0];
    builder.wrapSource(panelNode).em('D', {node_position: '<last'});
    assert.equal(document.getElementById('root').textContent, 'ABDC');
    let cleaned = 0;
    const middleNode = panelNode.value.getNode('middle');
    const unregister = renderer.onDispose(middleNode, () => cleaned++);
    unregister();
    panelNode.value.popNode('middle');
    assert.equal(cleaned, 0);
    assert.equal(document.getElementById('root').textContent, 'ADC');
    renderer.dispose();
});

test('replacement may reuse a removed descendant reference without leaking metadata', () => {
    const {document, builder, source, renderer} = setup();
    const block = nativeBlock(builder, root => root.section().span('old'));
    const section = block.getNodes()[0];
    section.value.getNodes()[0].setAttr({__ref: 'replaceable'});
    source.setItem('main', block);
    const previous = renderer.references.resolve({$gramlotRef: 'replaceable', kind: 'dom'});
    const replacement = nativeBlock(builder, root => root.span('new'));
    replacement.getNodes()[0].setAttr({__ref: 'replaceable'});
    renderer.validateCandidate(replacement, {replacingNode: section});
    section.setValue(replacement);
    const current = renderer.references.resolve({$gramlotRef: 'replaceable', kind: 'dom'});
    assert.notEqual(current, previous);
    assert.equal(previous.isConnected, false);
    assert.equal(current.textContent, 'new');
    assert.equal(document.querySelector('[__ref]'), null);
    renderer.dispose();
});

test('native attributes share Source keyword rules and never publish structural metadata', () => {
    const {document, builder, source, renderer} = setup();
    const authored = sourceTarget(builder.root.div('typed', {
        id:'typed', _class:'before', foo_:'literal', datapath:'customer', node_id:'typed-ref',
    }));
    const typed = document.getElementById('typed');
    assert.equal(typed.className, 'before');
    assert.equal(typed.getAttribute('foo_'), 'literal');
    assert.equal(typed.hasAttribute('foo'), false);
    authored.setAttr({_class:'after', foo_:'changed', datapath:'other'});
    assert.strictEqual(document.getElementById('typed'), typed);
    assert.equal(typed.className, 'after');
    assert.equal(typed.getAttribute('foo_'), 'changed');
    assert.equal(typed.hasAttribute('datapath'), false);
    assert.equal(typed.hasAttribute('node_id'), false);

    const block = nativeBlock(builder, root => root.div('wire', {
        id:'wire', _class:'wire-before', datapath:'record', node_id:'wire-ref', updateOn:'blur',
    }));
    const legacy = block.getNodes()[0];
    source.setItem('wireBlock', block);
    const wire = document.getElementById('wire');
    assert.equal(wire.className, 'wire-before');
    legacy.setAttr({_class:'wire-after', datapath:'updated'});
    assert.equal(wire.className, 'wire-after');
    for (const name of ['datapath', 'node_id', 'updateOn', '_class']) {
        assert.equal(wire.hasAttribute(name), false, name);
    }
    renderer.dispose();
});

test('metadata attributes are removed or restored from Source without replacing the DOM', () => {
    const {document, builder, renderer} = setup();
    const node = sourceTarget(builder.root.div('text', {
        id: 'metadata', title: 'authored',
        _meta: {render_attributes: {title: 'override', 'aria-label': 'temporary'}},
    }));
    const element = document.getElementById('metadata');
    assert.equal(element.title, 'override');
    assert.equal(element.getAttribute('aria-label'), 'temporary');

    node.setAttr({_meta: {render_attributes: {}}});
    assert.strictEqual(document.getElementById('metadata'), element);
    assert.equal(element.title, 'authored');
    assert.equal(element.hasAttribute('aria-label'), false);

    const svg = builder.root.svg();
    const rect = sourceTarget(svg.rect({id: 'rect',
        _meta: {render_attributes: {stroke_width: 2, 'xlink:href': '#old'}},
    }));
    const rectangle = document.getElementById('rect');
    assert.equal(rectangle.getAttribute('stroke-width'), '2');
    assert.equal(rectangle.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), '#old');
    assert.throws(() => rect.setAttr({_meta: {render_attributes: {'bad name': 'invalid'}}}));
    assert.equal(rect.attr._meta.render_attributes['bad name'], 'invalid');
    rect.setAttr({_meta: {render_attributes: {}}});
    assert.strictEqual(document.getElementById('rect'), rectangle);
    assert.equal(rectangle.hasAttribute('stroke-width'), false);
    assert.equal(rectangle.hasAttributeNS('http://www.w3.org/1999/xlink', 'href'), false);
    renderer.dispose();
});

test('DOM creation and updates share generic tag resolution', () => {
    const {document, builder, renderer} = setup();
    const node = sourceTarget(builder.root.del_('removed', {id: 'deleted'}));
    const element = document.getElementById('deleted');
    assert.equal(element.localName, 'del');
    assert.equal(node.nodeTag, 'del_');
    node.setAttr({title: 'same node'});
    assert.strictEqual(document.getElementById('deleted'), element);
    node.setValue('updated');
    assert.strictEqual(document.getElementById('deleted'), element);
    assert.equal(element.textContent, 'updated');

    const literal = sourceTarget(builder.root.div('literal', {
        id: 'literal', _meta: {render_tag: 'custom_'},
    }));
    assert.equal(document.getElementById('literal').localName, 'custom_');
    literal.setAttr({_meta: {render_tag: 'del_'}});
    assert.equal(document.getElementById('literal').localName, 'del');

    const svg = builder.root.svg();
    const prefixed = sourceTarget(svg.g({id: 'prefixed', ns: 's'}));
    const group = document.getElementById('prefixed');
    assert.equal(group.tagName, 's:g');
    assert.equal(group.namespaceURI, 'http://www.w3.org/2000/svg');
    prefixed.setAttr({title: 'same group'});
    assert.strictEqual(document.getElementById('prefixed'), group);
    renderer.dispose();
});
