import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {pointerTemplate, pointerExpression} from '@genrojs/builders';

import {sourceTarget} from '@genrojs/builders';

function mount(t, author) {
    const dom = new JSDOM('<main></main>');
    const app = new Gramlot({element: dom.window.document.querySelector('main'), transport: false,
        locale: 'it-IT', timeZone: 'Europe/Rome'});
    t.after(() => { app.dispose(); dom.window.close(); });
    const builder = new GramlotBuilder();
    author(builder.root);
    app.src.startSource(builder.toTytx());
    return {app, document: dom.window.document};
}

test('attribute transforms preserve typed Data, native editing and DOM identity', t => {
    const {app, document} = mount(t, root => {
        root.dataSetter({destination_path: 'width', value: 38});
        root.dataSetter({destination_path: 'draft', value: false});
        root.input({id: 'edit', type: 'number', value: '^width', live: true, readonly: '^draft:=!{}'});
        root.div('Width', {id: 'box', width: '^width:{}px', title: '^width:Width: {}'});
    });
    const field = document.querySelector('#edit'), box = document.querySelector('#box');
    assert.equal(field.readOnly, true);
    assert.equal(box.style.width, '38px');
    app.data.setItem('draft', true);
    assert.equal(field.readOnly, false);
    field.value = '45'; field.dispatchEvent(new document.defaultView.Event('input'));
    assert.equal(app.data.getItem('width'), 45);
    assert.equal(box.style.width, '45px');
    assert.equal(box.title, 'Width: 45');
    assert.equal(document.querySelector('#box'), box);
    app.data.setItem('width', null);
    assert.equal(box.style.width, '');
    assert.equal(box.hasAttribute('title'), false);
});

test('named attributes are resolved recursively and keep normal projection, including passive leading pointers', t => {
    const {app, document} = mount(t, root => {
        root.dataSetter({destination_path: 'w', value: 38});
        root.dataSetter({destination_path: 'unit', value: 'px'});
        root.div({id: 'box', title: '=w:{}{unit}', unit: '^unit', twice: '^w:={} * 2', 'data-double': '^w:{twice}'});
    });
    const box = document.querySelector('#box');
    assert.equal(box.title, '38px');
    assert.equal(box.getAttribute('data-double'), '76');
    assert.equal(box.getAttribute('unit'), 'px');
    assert.equal(box.getAttribute('twice'), '76');
    app.data.setItem('unit', 'em');
    assert.equal(box.title, '38em');
    assert.equal(box.getAttribute('unit'), 'em');
});

test('one current Source attribute set supplies references and projection, never DOM attributes', t => {
    const {app, document} = mount(t, root => {
        for (const [path, value] of Object.entries({height: 5, factor: 2, other: 'current'})) {
            root.dataSetter({destination_path: path, value});
        }
        root.div({node_id: 'box', id: 'box', height: "^height:=({} * {factor}) + 'px'",
            title: '^height:{factor}', factor: '^factor', 'data-other': '^other'});
    });
    const box = document.querySelector('#box');
    box.setAttribute('factor', '999');
    box.style.height = '999px';
    const node = sourceTarget(app.src.builder.nodeById('box'));
    const read = node.data.getItem, reads = [];
    t.mock.method(node.data, 'getItem', function (pointer) {
        reads.push(pointer);
        return read.call(this, pointer);
    });
    const [, attrs] = node.builder.runtimeValues(node);
    assert.equal(attrs.height, '10px');
    assert.equal(attrs.title, '2');
    assert.equal(attrs.factor, 2);
    assert.equal(attrs['data-other'], 'current');
    assert.equal(reads.filter(pointer => pointer === 'factor').length, 1);
    assert.equal(reads.filter(pointer => pointer === 'other').length, 1);
    assert.equal(node.getAttr('factor'), '^factor');
    app.data.setItem('factor', 3);
    assert.equal(box.style.height, '15px');
    assert.equal(box.title, '3');
});

test('passive leading pointer does not subscribe by itself', t => {
    const {app, document} = mount(t, root => {
        root.dataSetter({destination_path: 'w', value: 38});
        root.div({id: 'box', title: '=w:{}px'});
    });
    app.data.setItem('w', 45);
    assert.equal(document.querySelector('#box').title, '38px');
});

test('required, optional, null and repeated template inputs', () => {
    for (const [value, expected] of [[0, '0px / 0'], [false, 'falsepx / false'], ['', null], [null, null], [' ', ' px /  ']]) {
        assert.equal(pointerTemplate('{}px / {}', () => value), expected);
    }
    assert.equal(pointerTemplate('Name: {?}', () => ''), 'Name: ');
    assert.equal(pointerTemplate('Name: {?}', () => null), null);
    assert.equal(pointerTemplate('{}{?unit}', name => name ? '' : 38), '38');
});

test('missing Data is null, expression receives null and empty strings as typed values', t => {
    const {app, document} = mount(t, root => {
        root.div({id: 'box', title: '^missing:{}px', hidden: '^missing:=!{}'});
    });
    const box = document.querySelector('#box');
    assert.equal(box.hasAttribute('title'), false);
    assert.equal(box.hidden, true);
    app.data.setItem('missing', '');
    assert.equal(box.hasAttribute('title'), false);
    assert.equal(box.hidden, true);
});

test('format and mask inside expressions use page context and do not consume quoted mask slots', t => {
    const {app, document} = mount(t, root => {
        root.dataSetter({destination_path: 'amount', value: 12.5});
        root.dataSetter({destination_path: 'pattern', value: '0.00'});
        root.div({id: 'box', title: "^amount:=_F({}, {pattern: {pattern}, mask: '{} €'})", pattern: '^pattern'});
        root.p('^amount', {id: 'text', format: '^pattern', mask: 'Total: {} €'});
    });
    assert.equal(document.querySelector('#box').title, '12,50 €');
    assert.equal(document.querySelector('#text').textContent, 'Total: 12,50 €');
    app.data.setItem('amount', 38);
    assert.equal(document.querySelector('#box').title, '38,00 €');
    app.data.setItem('pattern', '0.0');
    assert.equal(document.querySelector('#box').title, '38,0 €');
    assert.equal(app.data.getItem('amount'), 38);
    assert.equal(document.defaultView._F, undefined);
});

test('expression slots never interpolate data into JavaScript source', t => {
    const text = "L'amico'); throw Error('oops";
    const {app, document} = mount(t, root => {
        root.dataSetter({destination_path: 'name', value: text});
        root.div({id: 'box', title: '^name:={} + "!"'});
    });
    assert.equal(document.querySelector('#box').title, text + '!');
    app.data.setItem('name', '^other');
    assert.equal(document.querySelector('#box').title, '^other!');
});

test('lexical slots exclude strings, comments and regular expressions', () => {
    const parsed = pointerExpression("_F({}, {mask: '{} €'}) + /{word}/.source /* {} */ + {name}");
    assert.deepEqual(parsed.slots, ['', 'name']);
    assert.ok(parsed.text.includes("mask: '{} €'"));
    assert.ok(parsed.text.includes('/{word}/'));
    assert.throws(() => pointerExpression('{?}'), /Optional slots/);
});

test('transforms are rejected on native and custom widget values at authoring', () => {
    for (const tag of ['input', 'textarea', 'select', 'webcomponent']) {
        for (const value of ['^name:{}', '=name:={}', '^name:={name}']) {
            const builder = new GramlotBuilder();
            assert.throws(() => builder.root[tag]({value, ...(tag === 'webcomponent' ? {code: 'test-input'} : {})}), /value.*does not accept pointer suffixes/);
        }
    }
});

test('missing references and cyclic dependencies produce explicit node errors', t => {
    assert.throws(() => mount(t, root => root.div({title: '^name:{absent}'})), /absent.*does not exist/);
    assert.throws(() => mount(t, root => root.div({title: '^name:{other}', other: '^name:{title}'})), /cyclic attribute dependency/i);
});

test('relative paths, symbolic paths and Bag attribute selectors keep their addressing', t => {
    const {app, document} = mount(t, root => {
        root.dataSetter({destination_path: 'settings.w', value: 38, unit: 'px'});
        const pane = root.div({datapath: 'settings', node_id: 'settings'});
        pane.div({id: 'relative', title: '^.w:{}px'});
        root.div({id: 'symbolic', title: '^#settings.w:{}px'});
        root.div({id: 'attribute', title: '^settings.w?unit:Unit: {}'});
    });
    assert.equal(document.querySelector('#relative').title, '38px');
    assert.equal(document.querySelector('#symbolic').title, '38px');
    assert.equal(document.querySelector('#attribute').title, 'Unit: px');
    app.data.getNode('settings.w').setAttr({unit: 'em'});
    assert.equal(document.querySelector('#attribute').title, 'Unit: em');
});

test('datapath transformations rebind the branch when the pointer or a named helper changes', t => {
    const {app, document} = mount(t, root => {
        for (const [path, value] of Object.entries({selected: 'a', group: 'records', 'records.a.name': 'Ada',
            'records.b.name': 'Grace', 'archived.b.name': 'Barbara'})) root.dataSetter({destination_path: path, value});
        root.div({datapath: '^selected:{group}.{}', group: '^group'}).p('^.name', {id: 'name'});
        root.div({datapath: "^selected:='records.' + {}"}).p('^.name', {id: 'expr'});
    });
    assert.equal(document.querySelector('#name').textContent, 'Ada');
    assert.equal(document.querySelector('#expr').textContent, 'Ada');
    app.data.setItem('selected', 'b');
    assert.equal(document.querySelector('#name').textContent, 'Grace');
    assert.equal(document.querySelector('#expr').textContent, 'Grace');
    app.data.setItem('group', 'archived');
    assert.equal(document.querySelector('#name').textContent, 'Barbara');
});

test('provider parameters and computed result paths use the same transform', t => {
    const {app} = mount(t, root => {
        root.dataSetter({destination_path: 'n', value: 3});
        root.dataSetter({destination_path: 'target', value: 'result'});
        root.dataFormula({result_path: '=target:{}', formula: 'amount + 1', amount: '^n:={} * 2', _init: true});
    });
    assert.equal(app.data.getItem('result'), 7);
    app.data.setItem('n', 4);
    assert.equal(app.data.getItem('result'), 9);
});

test('SVG attributes and existing == expressions can use typed transforms and the local formatter', t => {
    const {app, document} = mount(t, root => {
        root.dataSetter({destination_path: 'n', value: 3});
        root.svg().rect({id: 'rect', width: '^n:={} * 2', height: 10});
        root.p('==_F(amount, "0.00")', {id: 'text', amount: '^n'});
    });
    assert.equal(document.querySelector('#rect').getAttribute('width'), '6');
    assert.equal(document.querySelector('#text').textContent, '3,00');
    app.data.setItem('n', 4);
    assert.equal(document.querySelector('#rect').getAttribute('width'), '8');
});

test('new expression source cannot be activated by an ordinary Source attribute edit', t => {
    const {app} = mount(t, root => root.div({node_id: 'box', title: '^n:={} + 1'}));
    const node = sourceTarget(app.src.builder.nodeById('box'));
    assert.throws(() => node.setAttr({title: '^n:={} + 2'}), /inline code runs only as received/);
});

test('expression compilation is reused and released when its Source branch is removed', t => {
    const {app} = mount(t, root => {
        root.dataSetter({destination_path: 'n', value: 3});
        root.div({node_label: 'box', title: '^n:={} * 2'});
    });
    const compiler = app.src.binding.inlineCompiler;
    const compiled = compiler.size;
    assert.ok(compiled > 0);
    app.data.setItem('n', 4);
    assert.equal(compiler.size, compiled);
    app.src.source.getItem('main').popNode('box');
    assert.equal(compiler.size, 0);
});

test('a named dependency of transformed _timing restarts the timer rather than invoking immediately', t => {
    t.mock.timers.enable({apis: ['setInterval']});
    const {app} = mount(t, root => {
        root.dataSetter({destination_path: 'period', value: 1});
        root.dataSetter({destination_path: 'enabled', value: false});
        root.dataSetter({destination_path: 'ticks', value: 0});
        root.dataController({script: "this.SET('ticks', this.GET('ticks') + 1)",
            _timing: '^period:={enabled} ? {} : 0', enabled: '^enabled'});
    });
    t.mock.timers.tick(1000);
    assert.equal(app.data.getItem('ticks'), 0);
    app.data.setItem('enabled', true);
    assert.equal(app.data.getItem('ticks'), 0);
    t.mock.timers.tick(1000);
    assert.equal(app.data.getItem('ticks'), 1);
    app.data.setItem('enabled', false);
    t.mock.timers.tick(2000);
    assert.equal(app.data.getItem('ticks'), 1);
});

test('suffixes follow a variable context through null and back without reading the Data root', t => {
    const {app, document} = mount(t, root => {
        root.dataSetter({destination_path: 'selected', value: 'records.a'});
        root.dataSetter({destination_path: 'records.a.width', value: 38});
        root.div({datapath: '^selected'}).div({id: 'context', title: '^.width:{}px',
            'data-empty': '^.width:={} === null'});
    });
    const box = document.querySelector('#context');
    assert.equal(box.title, '38px');
    app.data.setItem('selected', null);
    assert.equal(box.hasAttribute('title'), false);
    assert.equal(box.getAttribute('data-empty'), 'true');
    app.data.setItem('selected', 'records.a');
    assert.equal(box.title, '38px');
    assert.equal(box.getAttribute('data-empty'), 'false');
});
