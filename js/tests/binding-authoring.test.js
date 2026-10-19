// Phase S02: inert binding grammar and transport (decisions P18, P19, P25; R08).
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {Bag} from '@genrojs/bag';
import {fromTytx} from '@genrojs/tytx';
import {JSDOM} from 'jsdom';
import {sourceBagFromTytx, sourceTarget} from '@genrojs/builders';
import {Gramlot} from '../src/gramlot.js';
import {GramlotBuilder} from '../src/builder/gramlot-builder.js';
import {REMOTE_NAME} from '../src/builder/source.js';

const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';
const DATA_FORBIDDEN = /data is forbidden: write dataSetter for a Data value or html_data for the HTML5 <data> element/;

/** Author on `builder`, then mount its Source in a Gramlot page; `mount` returns the page renderer. */
function mounted(builder = new GramlotBuilder()) {
    const document = new JSDOM('<main></main>').window.document;
    const mount = () => new Gramlot({document, element: document.querySelector('main'), transport: false})
        .src.startSource(builder.source).src.renderer;
    return {builder, document, mount};
}

/** The elements of `container`, without the comment markers of Source fragments. */
function elementsHtml(container) {
    return [...container.children].map(element => element.outerHTML).join('');
}

test('html_ reaches label and data on a Source Bag and on a Source node', () => {
    const builder = new GramlotBuilder();
    const form = builder.root.form();
    assert.equal(sourceTarget(form.html_label('Name', {for: 'name'})).nodeTag, 'label');
    assert.equal(sourceTarget(form.html_data('one', {value: '1'})).nodeTag, 'data');
    assert.equal(sourceTarget(builder.root.html_label('Top')).nodeTag, 'label');
    assert.equal(sourceTarget(builder.root.html_data('two', {value: '2'})).nodeTag, 'data');
    assert.deepEqual(GramlotBuilder.dialectPrefixes, ['html_']);
});

test('the tag prefix gramlot_ is an error', () => {
    const builder = new GramlotBuilder();
    const form = builder.root.form();
    assert.throws(() => builder.root.gramlot_label('x'), /gramlot_label: the tag prefix 'gramlot_' is not accepted; use the prefix 'html_'/);
    assert.throws(() => form.gramlot_data('x'), /gramlot_data: the tag prefix 'gramlot_' is not accepted/);
});

test('data(...) is an error naming dataSetter and html_data, on a Source Bag and on a Source node', () => {
    const builder = new GramlotBuilder();
    assert.throws(() => builder.root.data('.nome', 'Ada'), DATA_FORBIDDEN);
    assert.throws(() => builder.root.data({value: 'Ada'}), DATA_FORBIDDEN);
    assert.throws(() => builder.root.div().DATA('x'), DATA_FORBIDDEN);
    assert.equal(builder.source.getNodes().length, 1);
});

test('excluded declarations are errors naming the tag, and the node for a received Source', () => {
    const builder = new GramlotBuilder();
    for (const name of ['serverpath', 'dbenv', 'shared_id', 'formsubscribe_x']) {
        assert.throws(() => builder.root.div({[name]: 'v'}), new RegExp(`div: attribute '${name}' is excluded from Gramlot 0\\.2\\.0`));
    }
    const received = new GramlotBuilder();
    const div = sourceTarget(received.root.div({id: 'x'}));
    div.attr.serverpath = 'y';
    const {mount} = mounted(received);
    assert.throws(mount, /div 'div_0': attribute 'serverpath' is excluded from Gramlot 0\.2\.0/);
});

test('dataRemote and the remote attribute build', () => {
    const builder = new GramlotBuilder();
    builder.root.dataRemote({destination_path: '.menu', method: 'loadMenu'});
    builder.root.div({remote: 'details', remote_id: '^.id'});
    const [menu, div] = builder.source.getNodes();
    assert.equal(menu.nodeTag, 'dataRemote');
    assert.equal(div.getAttr('remote'), 'details');
    assert.equal(div.getAttr('remote_id'), '^.id');
});

test('dataRemote builds with its attributes and its destination_path refuses ?attr', () => {
    const builder = new GramlotBuilder();
    builder.root.dataRemote({destination_path: '.menu', method: 'loadMenu', cacheTime: 5, table: 'x'});
    const node = builder.source.getNodes()[0];
    assert.equal(node.nodeTag, 'dataRemote');
    assert.deepEqual(['destination_path', 'method', 'cacheTime', 'table'].map(name => node.getAttr(name)),
        ['.menu', 'loadMenu', 5, 'x']);
    assert.throws(() => builder.root.dataRemote({destination_path: '.menu?a', method: 'loadMenu'}), /dataRemote: 'destination_path' does not accept '\?attr'/);
    assert.throws(() => builder.root.dataRemote({destination_path: '.menu'}), /dataRemote: missing required attribute 'method'/);
});

test('remote writes its attributes on the node and returns it', () => {
    const builder = new GramlotBuilder();
    const div = sourceTarget(builder.root.div().remote('details', {record_id: '^.record_id', _cachedRemote: true, _if: 'record_id'}));
    assert.equal(div.nodeTag, 'div');
    const {_meta, ...attrs} = div.getAttr();
    assert.deepEqual(attrs, {remote: 'details', remote_record_id: '^.record_id', _cachedRemote: true, _if: 'record_id'});
    for (const name of [3, null, '', '1x', 'a-b', 'abc\n', 'a\u00e8', 'a..b', '.a', 'a.', 'a._b', 'a.1b', '==x']) {
        assert.throws(() => builder.root.div().remote(name), {name: 'TypeError', message: /remote name must be a pointer or match/});
    }
    for (const name of ['details', 'orders.details', 'a.b.c.details', 'a_1.b2', '^.name', '=name', '^name:{}']) {
        assert.equal(sourceTarget(builder.root.div().remote(name)).getAttr('remote'), name);
    }
    const controls = sourceTarget(builder.root.div().remote('details', {_onCalling: 'true', _delay: 5, _timing: 1, _userChanges: true}));
    assert.deepEqual(['_onCalling', '_delay', '_timing', '_userChanges'].map(name => controls.getAttr(name)), ['true', 5, 1, true]);
    assert.throws(() => builder.root.div().remote('details', {_onResult: 'x'}), {name: 'TypeError', message: /remote parameter '_onResult' is not accepted; the control attributes are _cachedRemote, _if, _else, _onRemote, _onCalling, _delay, _timing, _userChanges$/});
    const named = sourceTarget(builder.root.div().remote('details', {name: '^.name'}));
    assert.equal(named.getAttr('remote_name'), '^.name');
    assert.equal(sourceTarget(builder.root.div().remote('details').span('x')).nodeTag, 'span');
});

test('html_data renders the HTML5 data element and stays distinct from dataSetter', () => {
    const {builder, document, mount} = mounted();
    builder.root.html_data('one', {value: '1', id: 'd'});
    builder.root.dataSetter({destination_path: 'x', value: 7});
    const renderer = mount();
    const element = document.getElementById('d');
    assert.equal(element.outerHTML, '<data value="1" id="d">one</data>');
    assert.equal(document.querySelector('main').children.length, 1);
    const [data, setter] = builder.source.getNodes();
    assert.equal(data.nodeTag, 'data');
    assert.equal(setter.nodeTag, 'dataSetter');
    renderer.dispose();
});

test('R08: literal data-elements mount with no resolution and no DOM, also without a datapath', () => {
    const {builder, document, mount} = mounted();
    const button = builder.root.button('Save', {id: 'save'});
    button.dataController({func: 'save', a: '^missing'});
    builder.root.dataSetter({destination_path: 'literal', value: '^.unresolved', title: '=.other',
        expression: '==a + b', template: '${width}px'});
    builder.root.dataFormula({result_path: 'total', func: 'sum', a: '^a'});
    const renderer = mount();
    const main = document.querySelector('main');
    // The nested dataController is the button's click mechanism: R3 gives it type="button" (S12).
    assert.equal(elementsHtml(main), '<gramlot-button id="save" type="button">Save</gramlot-button>');
    const setter = builder.source.getNodes()[1];
    assert.deepEqual({...setter.getAttr(), _meta: undefined}, {
        destination_path: 'literal', value: '^.unresolved', title: '=.other',
        expression: '==a + b', template: '${width}px', _meta: undefined,
    });
    assert.equal(renderer.records.has(setter), false);
    // S05: the setter is installed literally at mount (source plan §2, `dataSetter` literal).
    const data = renderer.builder.data;
    assert.equal(data.getItem('literal'), '^.unresolved');
    assert.deepEqual(data.getNode('literal').getAttr(), {title: '=.other', expression: '==a + b', template: '${width}px'});
    builder.root.dataSetter({destination_path: 'later', value: '^.again'});
    setter.setAttr({value: '=.changed'});
    assert.equal(elementsHtml(main), '<gramlot-button id="save" type="button">Save</gramlot-button>');
    assert.equal(data.getItem('later'), '^.again');
    assert.equal(data.getItem('literal'), '^.unresolved');
    renderer.dispose();
});

test('binding attributes never reach the DOM', () => {
    const {builder, document, mount} = mounted();
    const bindings = {
        default: 1, default_value: 2, default_title: 't', attr_dtype: 'N', live: true, group: 'g', visible: false,
        action: 'x()', fire: '.f', fire_save: '.s', connect_onclick: 'go', _if: 'a', _else: 'b',
    };
    builder.root.input({id: 'field', value: 'v', ...bindings});
    builder.root.svg({id: 'drawing', width: 10, live: true, connect_onclick: 'go'}).circle({r: 1, fire_x: '.x'});
    const renderer = mount();
    const field = document.getElementById('field');
    // `visible` is projected as style.visibility (V1, Phase 6), never as an attribute of its own.
    // The `value` of a control is its ControlAdapter's (S10); a literal is also its default, the
    // `value` attribute a native form Reset restores (Phase 16 gate).
    assert.deepEqual(field.getAttributeNames(), ['id', 'style', 'value']);
    assert.equal(field.getAttribute('value'), 'v');
    assert.equal(field.value, 'v');
    assert.equal(field.style.visibility, 'hidden');
    assert.deepEqual(document.getElementById('drawing').getAttributeNames(), ['id', 'width']);
    assert.deepEqual(document.querySelector('circle').getAttributeNames(), ['r']);
    sourceTarget(builder.source.getNodes()[0]).setAttr({live: false, title: 'shown'});
    assert.deepEqual(field.getAttributeNames(), ['id', 'style', 'value', 'title']);
    renderer.dispose();
});

test('the attributes of remote never reach the DOM', () => {
    const {builder, document, mount} = mounted();
    builder.root.div('ph', {id: 'slot'}).remote('details', {id: 3, _cachedRemote: true, _onRemote: 'null', _if: 'false',
        _onCalling: 'null', _delay: 5, _timing: 0, _userChanges: true});
    const renderer = mount();
    assert.deepEqual(document.getElementById('slot').getAttributeNames(), ['id']);
    renderer.dispose();
});

const PYTHON_AUTHORING = `
from genro_tytx import to_tytx
from gramlot import GramlotBuilder
builder = GramlotBuilder()
form = builder.root.form(id="f")
form.html_label("Name", for_="n")
form.html_data("one", value="1", id="d")
builder.root.dataSetter("literal", value="^.unresolved", title="=.other", expression="==a + b", template="\${width}px")
print(to_tytx(builder.source))
`;

test('a Python Source with html_label, html_data and literal setters mounts in the browser unchanged', () => {
    const wire = execFileSync(python, ['-c', PYTHON_AUTHORING], {encoding: 'utf8'}).trim();
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    const app = new Gramlot({document, transport: false});
    app.src.startSource(sourceBagFromTytx(wire, app.src.builder));
    const root = document.getElementById('gramlot-root');
    assert.equal(document.getElementById('d').outerHTML, '<data value="1" id="d">one</data>');
    assert.equal(root.querySelector('label').getAttribute('for'), 'n');
    const setter = app.src.source.getItem('main').getNodes()[1];
    assert.equal(setter.nodeTag, 'dataSetter');
    assert.equal(setter.getAttr('value'), '^.unresolved');
    assert.equal(setter.getAttr('title'), '=.other');
    assert.equal(setter.getAttr('expression'), '==a + b');
    assert.equal(setter.getAttr('template'), '${width}px');
    assert.equal(root.querySelectorAll('*').length, 3);
    assert.equal(app.data.getItem('literal'), '^.unresolved');
    assert.deepEqual(app.data.getNode('literal').getAttr(), {title: '=.other', expression: '==a + b', template: '${width}px'});
    app.dispose();
});

test('binding.json is the Python file, and Builder composes it over the HTML grammar replacing the data-elements whole', () => {
    const python = readFileSync(new URL('../../src/gramlot/collections/binding.json', import.meta.url));
    const js = readFileSync(new URL('../src/builder/binding.json', import.meta.url));
    assert.ok(js.equals(python));
    const names = tag => GramlotBuilder._classSchema[tag].attributes.parameters.map(parameter => parameter.name);
    assert.deepEqual(names('dataSetter'), ['destination_path', 'value', 'attr']);
    assert.deepEqual(names('dataFormula'), ['result_path', 'formula', 'func', 'params']);
    assert.deepEqual(names('dataController'), ['script', 'func', 'params']);
    assert.equal(sourceTarget(new GramlotBuilder().root.div()).nodeTag, 'div');
});

/** The same data-element calls in Python, by name; each prints `ok` or the error message. */
const SIGNATURE_CASES = `
import json
from gramlot import GramlotBuilder
root = GramlotBuilder().root
cases = {
    "only path": lambda: root.dataSetter(destination_path=".a"),
    "path and attributes": lambda: root.dataSetter(destination_path=".b", colore="rosso"),
    "path and value": lambda: root.dataSetter(destination_path=".c", value=3),
    "explicit null": lambda: root.dataSetter(destination_path=".d", value=None),
    "formula": lambda: root.dataFormula(result_path=".t", formula="a + b", a="^.a"),
    "formula by name": lambda: root.dataFormula(result_path=".t", func="calc.total"),
    "script": lambda: root.dataController(script="x()", a="^.a"),
    "controller by name": lambda: root.dataController(func="calc.save"),
    "zero arguments": lambda: root.dataSetter(),
    "? in destination_path": lambda: root.dataSetter(destination_path=".a?title", value=1),
    "? in result_path": lambda: root.dataFormula(result_path=".t?x", formula="a"),
    "func and formula": lambda: root.dataFormula(result_path=".t", formula="a + b", func="calc.total"),
    "func and script": lambda: root.dataController(script="x()", func="calc.save"),
}
result = {}
for name, call in cases.items():
    try:
        call()
        result[name] = "ok"
    except ValueError as error:
        result[name] = str(error)
print(json.dumps(result))
`;

test('data-element signatures: the same calls give the same outcome in Python and JS', () => {
    const root = new GramlotBuilder().root;
    const cases = {
        'only path': () => root.dataSetter({destination_path: '.a'}),
        'path and attributes': () => root.dataSetter({destination_path: '.b', colore: 'rosso'}),
        'path and value': () => root.dataSetter({destination_path: '.c', value: 3}),
        'explicit null': () => root.dataSetter({destination_path: '.d', value: null}),
        'formula': () => root.dataFormula({result_path: '.t', formula: 'a + b', a: '^.a'}),
        'formula by name': () => root.dataFormula({result_path: '.t', func: 'calc.total'}),
        'script': () => root.dataController({script: 'x()', a: '^.a'}),
        'controller by name': () => root.dataController({func: 'calc.save'}),
        'zero arguments': () => root.dataSetter(),
        '? in destination_path': () => root.dataSetter({destination_path: '.a?title', value: 1}),
        '? in result_path': () => root.dataFormula({result_path: '.t?x', formula: 'a'}),
        'func and formula': () => root.dataFormula({result_path: '.t', formula: 'a + b', func: 'calc.total'}),
        'func and script': () => root.dataController({script: 'x()', func: 'calc.save'}),
    };
    const js = {};
    for (const [name, call] of Object.entries(cases)) {
        try { call(); js[name] = 'ok'; } catch (error) { js[name] = error.message; }
    }
    const py = JSON.parse(execFileSync(python, ['-c', SIGNATURE_CASES], {encoding: 'utf8'}));
    const valid = ['only path', 'path and attributes', 'path and value', 'explicit null',
        'formula', 'formula by name', 'script', 'controller by name'];
    for (const name of valid) assert.deepEqual([name, js[name], py[name]], [name, 'ok', 'ok']);
    // Builder words the missing required attribute differently in the two languages.
    assert.match(js['zero arguments'], /^dataSetter: missing required attribute 'destination_path'$/);
    assert.match(py['zero arguments'], /^dataSetter: missing required attributes \['destination_path'\]$/);
    const own = {
        '? in destination_path': "dataSetter: 'destination_path' does not accept '?attr': '.a?title'",
        '? in result_path': "dataFormula: 'result_path' does not accept '?attr': '.t?x'",
        'func and formula': "dataFormula: 'func' and 'formula' cannot be declared on the same node",
        'func and script': "dataController: 'func' and 'script' cannot be declared on the same node",
    };
    for (const [name, message] of Object.entries(own)) assert.deepEqual([name, js[name], py[name]], [name, message, message]);
});

test('a received Source with ? in destination_path or func with script fails at mount naming tag and label', () => {
    for (const [tag, attrs, message] of [
        ['dataSetter', {destination_path: '.a?title'}, /dataSetter 'dataSetter_0': 'destination_path' does not accept '\?attr'/],
        ['dataController', {script: 'x()', func: 'calc.save'}, /dataController 'dataController_0': 'func' and 'script' cannot be declared on the same node/],
    ]) {
        const received = new GramlotBuilder();
        const node = sourceTarget(tag === 'dataSetter'
            ? received.root.dataSetter({destination_path: '.a'}) : received.root.dataController({script: 'x()'}));
        Object.assign(node.attr, attrs);
        const {mount} = mounted(received);
        assert.throws(mount, message);
    }
});

/** P25 and the value round trip: author in Python (`encode`) or check a wire (`decode`). */
const VALUE_CASES = `
import sys
from genro_bag import Bag
from genro_tytx import to_tytx, from_tytx
from gramlot import GramlotBuilder
if sys.argv[1] == 'encode':
    builder = GramlotBuilder()
    bag = Bag(); bag.set_item('a', 1, colore='rosso')
    for path, value in (('.nul', None), ('.f', False), ('.z', 0), ('.e', ''), ('.bag', bag), ('.arr', [1, 'a', None]),
                        ('.dict', {'nome': 'Ada', 'indirizzo': {'citta': 'Roma'},
                                   'tag': [1, 'a', {'name': 'Grace', 'items': [False, None]}, []]}), ('.json', '{"a": 1}')):
        builder.root.dataSetter(path, value)
    print(to_tytx(builder.source))
else:
    attrs = {node.attr['destination_path']: node.attr for node in from_tytx(sys.stdin.read()).nodes}
    assert 'value' not in attrs['.nul']
    assert attrs['.f']['value'] is False
    assert type(attrs['.z']['value']) is int and attrs['.z']['value'] == 0
    assert attrs['.e']['value'] == ''
    assert type(attrs['.bag']['value']) is Bag and attrs['.bag']['value'].get_node('a').attr == {'colore': 'rosso'}
    assert attrs['.arr']['value'] == [1, 'a', None]
    value = attrs['.dict']['value']
    assert type(value) is Bag and type(value['indirizzo']) is Bag and value['indirizzo.citta'] == 'Roma'
    assert type(value['tag']) is Bag and value['nome'] == 'Ada'
    items = [node.value for node in value['tag'].nodes]
    assert len(items) == 4 and type(items[0]) is int and items[:2] == [1, 'a']
    assert type(items[2]) is Bag and items[2]['name'] == 'Grace'
    assert type(items[2]['items']) is Bag
    leaves = [node.value for node in items[2]['items'].nodes]
    assert len(leaves) == 2 and leaves[0] is False and leaves[1] is None
    assert type(items[3]) is Bag and len(items[3]) == 0
    assert attrs['.json']['value'] == '{"a": 1}'
    print('ok')
`;

function assertValueCases(source) {
    const attrs = Object.fromEntries(source.getNodes().map(node => [node.getAttr('destination_path'), node.getAttr()]));
    assert.equal(Object.hasOwn(attrs['.nul'], 'value'), false);
    assert.equal(attrs['.f'].value, false);
    assert.equal(attrs['.z'].value, 0);
    assert.equal(attrs['.e'].value, '');
    assert.ok(attrs['.bag'].value instanceof Bag);
    assert.deepEqual(attrs['.bag'].value.getNode('a').getAttr(), {colore: 'rosso'});
    assert.deepEqual(attrs['.arr'].value, [1, 'a', null]);
    const value = attrs['.dict'].value;
    assert.ok(value instanceof Bag);
    assert.ok(value.getItem('indirizzo') instanceof Bag);
    assert.equal(value.getItem('indirizzo.citta'), 'Roma');
    assert.ok(value.getItem('tag') instanceof Bag);
    const items = value.getItem('tag').getNodes().map(node => node.value);
    assert.equal(items.length, 4);
    assert.deepEqual(items.slice(0, 2), [1, 'a']);
    assert.ok(items[2] instanceof Bag);
    assert.equal(items[2].getItem('name'), 'Grace');
    assert.ok(items[2].getItem('items') instanceof Bag);
    assert.deepEqual(items[2].getItem('items').getNodes().map(node => node.value), [false, null]);
    assert.ok(items[3] instanceof Bag);
    assert.equal(items[3].getNodes().length, 0);
    assert.equal(value.getItem('nome'), 'Ada');
    assert.equal(attrs['.json'].value, '{"a": 1}');
}

test('P25 and values round trip in four directions: dictionaries and nested lists become Bags, a JSON string stays a string', () => {
    const builder = new GramlotBuilder();
    const bag = new Bag();
    bag.setItem('a', 1, {colore: 'rosso'});
    for (const [path, value] of [['.nul', null], ['.f', false], ['.z', 0], ['.e', ''], ['.bag', bag], ['.arr', [1, 'a', null]],
        ['.dict', {nome: 'Ada', indirizzo: {citta: 'Roma'}, tag: [1, 'a', {name: 'Grace', items: [false, null]}, []]}],
        ['.json', '{"a": 1}']]) {
        builder.root.dataSetter({destination_path: path, value});
    }
    const jsWire = builder.toTytx();
    const pythonWire = execFileSync(python, ['-c', VALUE_CASES, 'encode'], {encoding: 'utf8'}).trim();
    assertValueCases(fromTytx(jsWire));
    assertValueCases(fromTytx(pythonWire));
    for (const wire of [jsWire, pythonWire]) {
        assert.equal(execFileSync(python, ['-c', VALUE_CASES, 'decode'], {input: wire, encoding: 'utf8'}).trim(), 'ok');
    }
});

test('the browser runtime executes no logic at authoring; at mount only the dataSetter is installed', () => {
    const {builder, mount} = mounted();
    builder.root.dataSetter({destination_path: 'x', value: 1});
    builder.root.dataFormula({result_path: 'y', formula: '1 + 1'});
    builder.root.dataController({script: 'this.SET("z", 1)'});
    assert.equal(builder.data.getNodes().length, 0);
    const renderer = mount();
    assert.deepEqual(renderer.builder.data.getNodes().map(node => [node.label, node.value]), [['x', 1]]);
    renderer.dispose();
});

// Phase 18 (ASTRA-07): a scalar value promoted to `_text` when its node gets children keeps its type in
// Python and JS alike; the browser renderer converts it to text once, so both wires give the same DOM.
test('ASTRA-07: promoted _text stays typed; Python→TYTX→JS and JS→TYTX→JS give the same Source and DOM', () => {
    const values = [true, false, 1.5, 'text'];
    const pythonWire = execFileSync(python, ['-c', `
from genro_tytx import to_tytx
from gramlot import GramlotBuilder
builder = GramlotBuilder()
for index, value in enumerate([True, False, 1.5, 'text']):
    builder.root.p(value, id=f'p{index}').span('child')
print(to_tytx(builder.source))
`], {encoding: 'utf8'}).trim();
    const builder = new GramlotBuilder();
    values.forEach((value, index) => builder.root.p(value, {id: `p${index}`}).span('child'));
    const jsWire = builder.toTytx();
    const mount = wire => {
        const document = new JSDOM('<main></main>').window.document;
        const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
        app.src.startSource(wire);
        const texts = app.src.source.getItem('main').getNodes().map(node => node.getAttr('_text'));
        const html = document.querySelector('main').innerHTML;
        app.dispose();
        return {texts, html};
    };
    const fromPython = mount(pythonWire);
    const fromJs = mount(jsWire);
    assert.deepEqual(fromPython.texts, values);
    assert.deepEqual(fromJs.texts, values);
    assert.equal(fromPython.html, fromJs.html);
    assert.match(fromJs.html, /^<!--source-fragment--><p id="p0">true<span>child<\/span><\/p><p id="p1">false<span>child<\/span><\/p><p id="p2">1\.5<span>/);
});

// Constitution 11.85: the same method names are accepted by the `remote` helper and by the server
// resolution in Python and JavaScript, with the same portable pattern.
const REMOTE_NAME_CASES = ['details', 'orders.details', 'a.b.c.details', 'a_1.b2', 'A9', '^.name', '=name', '^name:{}',
    '', '1x', 'a-b', 'abc\n', 'aè', 'a..b', '.a', 'a.', 'a._b', 'a.1b', '_a', '==x', 'a b', 'a.b\n'];

test('remote names: Python and JavaScript accept and refuse the same strings with the same pattern', () => {
    const builder = new GramlotBuilder();
    const js = REMOTE_NAME_CASES.map(name => {
        try { builder.root.div().remote(name); return 'ok'; } catch (error) { return error.name; }
    });
    const py = JSON.parse(execFileSync(python, ['-c', `
import json, sys
from gramlot import GramlotBuilder
from gramlot.page.source import REMOTE_NAME
builder = GramlotBuilder()
outcomes = []
for name in json.loads(sys.argv[1]):
    try:
        builder.root.div().remote(name)
        outcomes.append("ok")
    except ValueError:
        outcomes.append("error")
print(json.dumps({"outcomes": outcomes, "pattern": REMOTE_NAME.pattern}))
`, JSON.stringify(REMOTE_NAME_CASES)], {encoding: 'utf8'}));
    assert.deepEqual(py.outcomes, js.map(outcome => outcome === 'ok' ? 'ok' : 'error'));
    assert.deepEqual(js.map(outcome => outcome === 'ok'), REMOTE_NAME_CASES.map((_, index) => index < 8));
    assert.equal(py.pattern, REMOTE_NAME.source);
});
