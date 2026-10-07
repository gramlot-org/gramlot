// Phase S05: defaults and `attr_*` (decisions D1a, P15, `attr_*`, Q7; source plan §2, §4.6, §5.1 step 3).
// Values are checked at the first render.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';

function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    return {app, document, data: app.data, byId: id => document.getElementById(id)};
}

/** A Source authored on a separate builder, mounted as one branch (one `ins` event). */
function authored(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.source;
}

test('D1a: a default fills an empty path at the first render', () => {
    const {app, data, byId} = page();
    app.src.startSource(authored(root => root.input({id: 'f', value: '^nome', default: 'Ada'})));
    assert.equal(data.getItem('nome'), 'Ada');
    assert.equal(byId('f').value, 'Ada');
    app.dispose();
});

test('D1a: defaults come after all dataSetters, so a default never beats a later dataSetter', () => {
    const {app, data, byId} = page();
    app.src.startSource(authored(root => {
        root.input({id: 'f', value: '^nome', default: 'default'});
        root.div().dataSetter({destination_path: 'nome', value: 'setter'});
    }));
    assert.equal(data.getItem('nome'), 'setter');
    assert.equal(byId('f').value, 'setter');
    app.dispose();
});

test('P15: false, 0 and the empty string are values; null and a missing path are empty', () => {
    const {app, data} = page();
    data.setItem('f', false);
    data.setItem('z', 0);
    data.setItem('e', '');
    data.setItem('n', null);
    app.src.startSource(authored(root => {
        for (const path of ['f', 'z', 'e', 'n', 'missing']) root.input({value: `^${path}`, default: 'D'});
    }));
    assert.equal(data.getItem('f'), false);
    assert.equal(data.getItem('z'), 0);
    assert.equal(data.getItem('e'), '');
    assert.equal(data.getItem('n'), 'D');
    assert.equal(data.getItem('missing'), 'D');
    app.dispose();
});

test('P15: a default of false, 0 or the empty string is written as a value', () => {
    const {app, data} = page();
    app.src.startSource(authored(root => {
        root.input({value: '^f', default: false});
        root.input({value: '^z', default: 0});
        root.input({value: '^e', default: ''});
    }));
    assert.equal(data.getItem('f'), false);
    assert.equal(data.getItem('z'), 0);
    assert.equal(data.getItem('e'), '');
    app.dispose();
});

test('P15: default_value wins over default; default_<attr> fills another attribute pointer', () => {
    const {app, data, byId} = page();
    app.src.startSource(authored(root => root.input({
        id: 'f', value: '^v', default: 'plain', default_value: 'specific', title: '^t', default_title: 'Titolo',
    })));
    assert.equal(data.getItem('v'), 'specific');
    assert.equal(data.getItem('t'), 'Titolo');
    assert.equal(byId('f').title, 'Titolo');
    app.dispose();
});

test('D1a: an = pointer gets its default too; a relative pointer resolves in the node context', () => {
    const {app, data, byId} = page();
    app.src.startSource(authored(root => root.div({datapath: 'ctx'})
        .span({id: 's', title: '=.hint', default_title: 'H', lang: '^.lang', default_lang: 'it'})));
    assert.equal(data.getItem('ctx.hint'), 'H');
    assert.equal(data.getItem('ctx.lang'), 'it');
    assert.equal(byId('s').title, 'H');
    app.dispose();
});

test('D1a: a default on a ?attr pointer fills the attribute of the Data node', () => {
    const {app, data} = page();
    data.setItem('kept', 1, {caption: 'old'});
    data.setItem('empty', 1);
    app.src.startSource(authored(root => {
        root.span({title: '^kept?caption', default_title: 'new'});
        root.span({title: '^empty?caption', default_title: 'new'});
        root.span({title: '^absent?caption', default_title: 'new'});
    }));
    assert.equal(data.getNode('kept').getAttr('caption'), 'old');
    assert.equal(data.getNode('empty').getAttr('caption'), 'new');
    assert.equal(data.getItem('empty'), 1);
    assert.equal(data.getItem('absent'), null);
    assert.equal(data.getNode('absent').getAttr('caption'), 'new');
    app.dispose();
});

test('D1a: a default keeps the attributes of an existing Data node with a null value', () => {
    const {app, data} = page();
    data.setItem('x', null, {caption: 'Nome'});
    app.src.startSource(authored(root => root.input({value: '^x', default: 'Ada'})));
    assert.equal(data.getItem('x'), 'Ada');
    assert.deepEqual(data.getNode('x').getAttr(), {caption: 'Nome'});
    app.dispose();
});

test('Q7: a default on a null path is skipped', () => {
    const {app, data} = page();
    app.src.startSource(authored(root => root.div({datapath: '^sel'}).input({value: '^.x', default: 'D'})));
    assert.equal(data.getNodes().length, 0);
    app.dispose();
});

test('defaults of an inserted branch are applied when it enters the Source', () => {
    const {app, data, byId} = page();
    const box = sourceTarget(app.src.builder.root.div({id: 'box'}));
    app.src.builder.wrapSource(box).input({id: 'f', value: '^late', default: 'L'});
    assert.equal(data.getItem('late'), 'L');
    assert.equal(byId('f').value, 'L');
    app.dispose();
});

test('attr_*: an existing Data node of value receives the attribute, with no emptiness check', () => {
    const {app, data} = page();
    data.setItem('prezzo', 10, {dtype: 'L'});
    app.src.startSource(authored(root => root.input({value: '^prezzo', attr_dtype: 'N', attr_caption: 'Prezzo'})));
    assert.equal(data.getItem('prezzo'), 10);
    assert.deepEqual(data.getNode('prezzo').getAttr(), {dtype: 'N', caption: 'Prezzo'});
    app.dispose();
});

test('attr_*: a Data node created by the node\'s own default receives the attribute', () => {
    const {app, data} = page();
    app.src.startSource(authored(root => root.input({value: '^prezzo', default: 0, attr_dtype: 'N'})));
    assert.equal(data.getItem('prezzo'), 0);
    assert.equal(data.getNode('prezzo').getAttr('dtype'), 'N');
    app.dispose();
});

test('attr_*: no effect when the Data node of value does not exist', () => {
    const {app, data} = page();
    app.src.startSource(authored(root => root.input({value: '^prezzo', attr_dtype: 'N'})));
    assert.equal(data.getNode('prezzo'), null);
    assert.equal(data.getNodes().length, 0);
    app.dispose();
});

test('attr_*: a pointer value is resolved on the node; src is used when there is no value pointer', () => {
    const {app, data} = page();
    data.setItem('ctx.tipo', 'N');
    data.setItem('ctx.prezzo', 3);
    data.setItem('ctx.url', 'a.png');
    app.src.startSource(authored(root => {
        const box = root.div({datapath: 'ctx'});
        box.input({value: '^.prezzo', attr_dtype: '^.tipo', attr_hint: '=.tipo'});
        box.img({src: '^.url', attr_kind: 'image'});
    }));
    assert.deepEqual(data.getNode('ctx.prezzo').getAttr(), {dtype: 'N', hint: 'N'});
    assert.deepEqual(data.getNode('ctx.url').getAttr(), {kind: 'image'});
    app.dispose();
});

test('attr_*: applied after the defaults of its own node, before the defaults of the next node', () => {
    const {app, data} = page();
    app.src.startSource(authored(root => {
        root.input({value: '^a', attr_seen: '=b'});
        root.input({value: '^b', default: 'B'});
        root.input({value: '^a', default: 'A', attr_after: '=b'});
    }));
    // The first node's attr_* ran before `a` existed; the third node's after its own default and after `b`.
    assert.equal(data.getItem('a'), 'A');
    assert.deepEqual(data.getNode('a').getAttr(), {after: 'B'});
    app.dispose();
});
