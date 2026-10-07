// Phase S10: native editing. One ControlAdapter per form control consumes `value`: the Q5 matrix in
// both directions, `live`, IME, P1, Q7 on user input, C04.1 rebuilds and the adapter lifecycle
// (source plan §4.11, §7 S10). Real browsers: scripts/verify_binding_browser.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot} from '../src/index.js';
import {
    CheckboxControl, ColorControl, NumberControl, RadioControl, RangeControl, SelectControl, TemporalControl,
    TextControl,
} from '../src/view/controls.js';
import {mount} from './fixtures/mount.js';

function page() {
    const errors = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', error => errors.push(error));
    const {window} = new JSDOM('<main></main>', {virtualConsole});
    const document = window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    return {app, window, document, builder: app.src.builder, data: app.data, errors,
        byId: id => document.getElementById(id),
        record: node => app.src.renderer.records.get(sourceTarget(node))};
}

/** Type `text` into `element` as the browser does: the value changes, then `input`. */
function type(element, text) {
    element.value = text;
    element.dispatchEvent(new element.ownerDocument.defaultView.InputEvent('input', {bubbles: true}));
}

function change(element) {
    element.dispatchEvent(new element.ownerDocument.defaultView.Event('change', {bubbles: true}));
}

function select(builder, attrs, values = ['a', 'b', 'c']) {
    const node = builder.root.select(attrs);
    for (const value of values) node.option(value.toUpperCase(), {value, id: `o-${value}`});
    return node;
}

test('ControlAdapter.for chooses the class from tag and type; hidden, file and buttons have none', () => {
    const {builder, record} = page();
    const expected = {
        text: TextControl, password: TextControl, email: TextControl, url: TextControl, tel: TextControl,
        search: TextControl, unknown: TextControl, number: NumberControl, range: RangeControl,
        color: ColorControl, date: TemporalControl, time: TemporalControl, month: TemporalControl,
        week: TemporalControl, 'datetime-local': TemporalControl, hidden: undefined, file: undefined,
        checkbox: CheckboxControl, radio: RadioControl, button: undefined, submit: undefined, reset: undefined,
        image: undefined,
    };
    for (const [kind, Control] of Object.entries(expected)) {
        const node = builder.root.input({type: kind});
        assert.equal(record(node).control?.constructor, Control, kind);
    }
    assert.equal(record(builder.root.input()).control.constructor, TextControl);
    assert.equal(record(builder.root.textarea()).control.constructor, TextControl);
    assert.equal(record(select(builder, {})).control.constructor, SelectControl);
    assert.equal(record(builder.root.div()).control, undefined);
});

test('html.js writes neither the value attribute nor the property of a control; other elements keep both', () => {
    const {builder, data, byId} = page();
    data.setItem('v', 'x');
    data.setItem('m', ['a', 'b']);
    builder.root.input({id: 't', value: '^v'});
    select(builder, {id: 's', multiple: true, value: '^m'});
    builder.root.input({id: 'h', type: 'hidden', value: '^v'});
    builder.root.input({id: 'c', type: 'checkbox', value: 'on'});
    builder.root.input({id: 'b', type: 'button', value: '^v'});
    assert.equal(byId('t').getAttribute('value'), null);
    assert.equal(byId('t').value, 'x');
    assert.equal(byId('s').getAttribute('value'), null);
    assert.deepEqual([...byId('s').selectedOptions].map(option => option.value), ['a', 'b']);
    assert.equal(byId('h').getAttribute('value'), 'x');
    assert.equal(byId('c').getAttribute('value'), null, 'a checkbox consumes value as a boolean (S11)');
    assert.equal(byId('c').checked, true);
    assert.equal(byId('b').getAttribute('value'), 'x');
});

test('text and textarea: string both ways, null shown empty and not written, the empty string stays', () => {
    const {builder, data, byId} = page();
    data.setItem('f.t', 'one');
    builder.root.input({id: 't', value: '^f.t'});
    builder.root.textarea({id: 'a', value: '^f.a'});
    assert.equal(byId('t').value, 'one');
    assert.equal(byId('a').value, '');
    assert.equal(data.getItem('f.a'), null);
    data.setItem('f.t', 5);
    assert.equal(byId('t').value, '5');
    data.setItem('f.t', null);
    assert.equal(byId('t').value, '');
    type(byId('t'), 'typed');
    assert.equal(data.getItem('f.t'), null, 'not live: input does not write');
    change(byId('t'));
    assert.equal(data.getItem('f.t'), 'typed');
    type(byId('t'), '');
    change(byId('t'));
    assert.equal(data.getItem('f.t'), '');
    type(byId('a'), 'line 1\nline 2');
    change(byId('a'));
    assert.equal(data.getItem('f.a'), 'line 1\nline 2');
    data.setItem('f.a', 'from data');
    assert.equal(byId('a').value, 'from data');
});

test('number: finite number or null, empty → null, an invalid draft stays and the Data is unchanged, never NaN', () => {
    const {builder, data, byId} = page();
    data.setItem('n', 3.5);
    builder.root.input({id: 'n', type: 'number', value: '^n'});
    const field = byId('n');
    assert.equal(field.value, '3.5');
    data.setItem('n', null);
    assert.equal(field.value, '');
    type(field, '42');
    change(field);
    assert.strictEqual(data.getItem('n'), 42);
    type(field, '');
    change(field);
    assert.strictEqual(data.getItem('n'), null);
    type(field, '7');
    change(field);
    // jsdom has no bad input: the browser state is set on the element (real engines in the browser script).
    Object.defineProperty(field, 'validity', {value: {badInput: true}, configurable: true});
    type(field, '');
    change(field);
    assert.strictEqual(data.getItem('n'), 7);
    delete field.validity;
    type(field, 'abc');
    change(field);
    assert.strictEqual(data.getItem('n'), null, 'the sanitized empty value is null, not NaN');
});

test('range: a number both ways; the browser limit does not write the Data', () => {
    const {builder, data, byId} = page();
    data.setItem('r', 30);
    builder.root.input({id: 'r', type: 'range', min: 0, max: 100, value: '^r'});
    const field = byId('r');
    assert.equal(field.value, '30');
    data.setItem('r', 500);
    assert.equal(field.value, '100');
    assert.equal(data.getItem('r'), 500);
    field.value = '70';
    change(field);
    assert.strictEqual(data.getItem('r'), 70);
    data.setItem('r', null);
    assert.equal(field.value, '50', 'null shows the browser default');
    assert.equal(data.getItem('r'), null);
});

test('select: string or null; a value without option selects nothing and leaves the Data; the first projection finds the options', () => {
    const {builder, data, byId} = page();
    data.setItem('s', 'b');
    select(builder, {id: 's', value: '^s'});
    const field = byId('s');
    assert.equal(field.value, 'b');
    data.setItem('s', null);
    assert.equal(field.selectedIndex, -1);
    data.setItem('s', 'zz');
    assert.equal(field.selectedIndex, -1);
    assert.equal(data.getItem('s'), 'zz');
    field.value = 'c';
    change(field);
    assert.equal(data.getItem('s'), 'c');
});

test('select multiple: an array of strings, also [], never a joined string; a non-array is an error', () => {
    const {builder, data, byId} = page();
    data.setItem('m', ['a', 'c']);
    select(builder, {id: 'm', multiple: true, value: '^m'});
    const field = byId('m');
    const chosen = () => [...field.selectedOptions].map(option => option.value);
    assert.deepEqual(chosen(), ['a', 'c']);
    data.setItem('m', []);
    assert.deepEqual(chosen(), []);
    field.options[1].selected = true;
    field.options[2].selected = true;
    change(field);
    assert.deepEqual(data.getItem('m'), ['b', 'c']);
    field.options[1].selected = false;
    field.options[2].selected = false;
    change(field);
    assert.deepEqual(data.getItem('m'), []);
    data.setItem('m', null);
    assert.deepEqual(chosen(), []);
    assert.throws(() => data.setItem('m', 'a,b'), {message: "select 'select_0': a multiple select requires an array"});
});

test('a select is projected again when its options change', () => {
    const {builder, data, byId} = page();
    data.setItem('s', 'd');
    const node = select(builder, {id: 's', value: '^s'});
    assert.equal(byId('s').selectedIndex, -1);
    node.option('D', {value: 'd'});
    assert.equal(byId('s').value, 'd');
    sourceTarget(node).value.popNode(sourceTarget(node).value.getNodes().at(-1).label);
    assert.equal(byId('s').selectedIndex, -1);
    assert.equal(data.getItem('s'), 'd');
    const option = sourceTarget(sourceTarget(node).value.getNodes()[0]);
    option.setAttr({value: 'd'});
    assert.equal(byId('s').value, 'd');
    assert.equal(byId('s').selectedIndex, 0);
});

test('temporal types: the lexical string or null, no Date object; an invalid string is not written back', () => {
    const {builder, data, byId} = page();
    const samples = {date: '2026-09-29', time: '18:30', month: '2026-09', week: '2026-W40',
        'datetime-local': '2026-09-29T18:30'};
    for (const [kind, sample] of Object.entries(samples)) {
        builder.root.input({id: kind, type: kind, value: `^d.${kind}`});
        const field = byId(kind);
        data.setItem(`d.${kind}`, sample);
        assert.equal(field.value, sample, kind);
        data.setItem(`d.${kind}`, null);
        assert.equal(field.value, '', kind);
        field.value = sample;
        change(field);
        assert.strictEqual(data.getItem(`d.${kind}`), sample, kind);
        field.value = '';
        change(field);
        assert.strictEqual(data.getItem(`d.${kind}`), null, kind);
    }
    data.setItem('d.date', 'not a date');
    assert.equal(byId('date').value, '');
    assert.equal(data.getItem('d.date'), 'not a date');
    type(byId('date'), '2026-01-02');
    assert.equal(data.getItem('d.date'), 'not a date', 'temporal types write on change only');
});

test('color: the serialized string; the browser normalization does not write the Data', () => {
    const {builder, data, byId} = page();
    data.setItem('c', '#FF0000');
    builder.root.input({id: 'c', type: 'color', value: '^c', live: true});
    assert.equal(byId('c').value, '#ff0000');
    assert.equal(data.getItem('c'), '#FF0000');
    type(byId('c'), '#00ff00');
    assert.equal(data.getItem('c'), '#FF0000', 'color writes on change, also with live');
    change(byId('c'));
    assert.equal(data.getItem('c'), '#00ff00');
});

test('live: text, textarea, number and range write on input; select, color and temporal types on change', () => {
    const {builder, data, byId} = page();
    builder.root.input({id: 't', value: '^l.t', live: true});
    builder.root.textarea({id: 'a', value: '^l.a', live: true});
    builder.root.input({id: 'n', type: 'number', value: '^l.n', live: true});
    builder.root.input({id: 'r', type: 'range', value: '^l.r', live: true});
    select(builder, {id: 's', value: '^l.s', live: true});
    type(byId('t'), 'x');
    type(byId('a'), 'y');
    type(byId('n'), '4');
    type(byId('r'), '20');
    assert.deepEqual([data.getItem('l.t'), data.getItem('l.a'), data.getItem('l.n'), data.getItem('l.r')], ['x', 'y', 4, 20]);
    const field = byId('s');
    field.value = 'b';
    field.dispatchEvent(new field.ownerDocument.defaultView.Event('input'));
    assert.equal(data.getItem('l.s'), null);
    change(byId('s'));
    assert.equal(data.getItem('l.s'), 'b');
});

test('a change of live, literal or from a pointer, changes the write moment without a rebuild', () => {
    const {app, builder, data, byId} = page();
    const node = sourceTarget(builder.root.input({id: 't', value: '^v', live: '^mode'}));
    const field = byId('t');
    const binding = app.src.binding.bindingFor(node);
    type(field, 'a');
    assert.equal(data.getItem('v'), null);
    data.setItem('mode', true);
    assert.strictEqual(byId('t'), field);
    type(field, 'ab');
    assert.equal(data.getItem('v'), 'ab');
    node.setAttr({live: false});
    assert.strictEqual(byId('t'), field);
    assert.strictEqual(app.src.binding.bindingFor(node), binding);
    type(field, 'abc');
    assert.equal(data.getItem('v'), 'ab');
    change(field);
    assert.equal(data.getItem('v'), 'abc');
});

test('a literal or = value accepts input and writes nothing; ^ with ?attr writes the attribute', () => {
    const {builder, data, byId} = page();
    data.setItem('src', 'read');
    builder.root.input({id: 'lit', value: 'literal', live: true});
    builder.root.input({id: 'eq', value: '=src', live: true});
    builder.root.input({id: 'attr', value: '^rec?label', live: true});
    type(byId('lit'), 'typed');
    type(byId('eq'), 'typed');
    assert.equal(byId('lit').value, 'typed');
    assert.equal(byId('eq').value, 'typed');
    assert.equal(data.getItem('src'), 'read');
    type(byId('attr'), 'named');
    assert.equal(data.getNode('rec').getAttr('label'), 'named');
    data.setItem('rec', null, {label: 'external'});
    assert.equal(byId('attr').value, 'external');
});

test('P1: typing does not move the caret and a typed-equal value is not written back; an external write is', () => {
    const {builder, data, byId} = page();
    builder.root.input({id: 't', value: '^v', live: true});
    builder.root.input({id: 'n', type: 'number', value: '^n', live: true});
    const field = byId('t');
    field.focus();
    type(field, 'abcd');
    field.setSelectionRange(2, 2);
    type(field, 'abXcd');
    field.setSelectionRange(3, 3);
    type(field, 'abXcd');
    assert.equal(data.getItem('v'), 'abXcd');
    assert.equal(field.selectionStart, 3);
    type(byId('n'), '1.0');
    assert.strictEqual(data.getItem('n'), 1);
    assert.equal(byId('n').value, '1.0', "'1.0' equals 1: the draft stays");
    data.setItem('n', 2);
    assert.equal(byId('n').value, '2');
});

test('a controller that normalizes the typed value: the correction reaches the control that wrote', () => {
    const {app, data, byId} = page();
    mount(app, root => {
        root.input({id: 't', value: '^f.v', live: true});
        root.dataController({script: 'this.SET("f.v", v.toUpperCase())', v: '^f.v'});
    });
    type(byId('t'), 'abc');
    assert.equal(data.getItem('f.v'), 'ABC');
    assert.equal(byId('t').value, 'ABC');
});

test('title and class bound to the same path follow the typing', () => {
    const {builder, byId} = page();
    builder.root.input({id: 't', value: '^v', title: '^v', class: '^v', live: true});
    const field = byId('t');
    type(field, 'wide');
    assert.equal(field.title, 'wide');
    assert.equal(field.className, 'wide');
    type(field, 'narrow');
    assert.equal(field.title, 'narrow');
    assert.equal(field.className, 'narrow');
});

test('IME (synthetic sequence): no write while composing; at the end the write per live, then the waiting projection', () => {
    const {builder, data, byId, window} = page();
    builder.root.input({id: 'live', value: '^ime.live', title: '^ime.live', live: true});
    builder.root.input({id: 'lazy', value: '^ime.lazy'});
    const compose = (field, text, external) => {
        field.dispatchEvent(new window.CompositionEvent('compositionstart'));
        field.value = text;
        field.dispatchEvent(new window.InputEvent('input', {isComposing: true}));
        external?.();
        field.dispatchEvent(new window.CompositionEvent('compositionend', {data: text}));
    };
    const live = byId('live');
    compose(live, 'かな', () => {
        assert.equal(data.getItem('ime.live'), null, 'no write during the composition');
        data.setItem('ime.live', 'external');
        assert.equal(live.value, 'かな', 'the projection waits for the end');
        assert.equal(live.title, 'external', 'the other attributes are projected');
    });
    assert.equal(data.getItem('ime.live'), 'かな', 'the typed text reaches the Data');
    assert.equal(live.value, 'かな');
    const lazy = byId('lazy');
    compose(lazy, '漢字', () => data.setItem('ime.lazy', 'external'));
    assert.equal(lazy.value, 'external', 'not live: the waiting projection at the end');
    compose(lazy, '漢字');
    change(lazy);
    assert.equal(data.getItem('ime.lazy'), '漢字');
});

test('Q7: user input on a null path raises from the listener naming node and path', () => {
    const {builder, data, byId, errors} = page();
    builder.root.div({datapath: '^scelto'}).input({id: 'i', value: '^.v', live: true});
    type(byId('i'), 'lost');
    assert.equal(errors.length, 1);
    assert.equal(errors[0].cause.message, "input 'input_0': write on a null path: '.v'");
    data.setItem('r.v', 'ok');
    data.setItem('scelto', 'r');
    assert.equal(byId('i').value, 'ok');
    type(byId('i'), 'kept');
    assert.equal(data.getItem('r.v'), 'kept');
    assert.equal(errors.length, 1);
});

test('C04.1: multiple of a select rebuilds the element with the same NodeBinding, from the Source and from Data', () => {
    const {app, builder, data, byId, record} = page();
    data.setItem('m', ['a']);
    const node = sourceTarget(select(builder, {id: 's', value: '^m', multiple: '^multi'}));
    const binding = app.src.binding.bindingFor(node);
    const first = byId('s');
    assert.equal(first.multiple, false);
    data.setItem('multi', true);
    const second = byId('s');
    assert.notStrictEqual(second, first);
    assert.equal(second.multiple, true);
    assert.deepEqual([...second.selectedOptions].map(option => option.value), ['a']);
    assert.strictEqual(app.src.binding.bindingFor(node), binding);
    node.setAttr({multiple: false});
    const third = byId('s');
    assert.notStrictEqual(third, second);
    assert.strictEqual(app.src.binding.bindingFor(node), binding);
    assert.equal(third.multiple, false);
    // The detached element no longer writes.
    first.value = 'c';
    change(first);
    assert.deepEqual(data.getItem('m'), ['a']);
    third.value = 'b';
    change(third);
    assert.equal(data.getItem('m'), 'b');
    assert.strictEqual(record(node).element, third);
});

test('D7: type from Data rebuilds and chooses the adapter again; under freeze the rebuild waits for the thaw', () => {
    const {app, builder, data, byId, record} = page();
    data.setItem('tipo', 'text');
    data.setItem('v', 3);
    const panel = sourceTarget(builder.root.div({id: 'panel'}));
    const node = sourceTarget(builder.wrapSource(panel).input({id: 'f', type: '^tipo', value: '^v'}));
    assert.ok(record(node).control instanceof TextControl);
    const first = byId('f');
    data.setItem('tipo', 'number');
    assert.notStrictEqual(byId('f'), first);
    assert.ok(record(node).control instanceof NumberControl);
    assert.equal(byId('f').value, '3');
    const second = byId('f');
    app.src.renderer.freeze(panel);
    data.setItem('tipo', 'range');
    assert.strictEqual(byId('f'), second);
    assert.equal(second.type, 'number');
    app.src.renderer.unfreeze(panel);
    assert.notStrictEqual(byId('f'), second);
    assert.ok(record(node).control instanceof RangeControl);
});

test('lifecycle: removal detaches the listeners once; a removed attribute value shows the control empty', () => {
    const {builder, data, byId, record} = page();
    data.setItem('v', 'a');
    const node = sourceTarget(builder.root.input({id: 't', value: '^v', live: true}));
    const field = byId('t');
    const control = record(node).control;
    let detached = 0;
    const detach = control.detach.bind(control);
    control.detach = () => { detached++; detach(); };
    node.setAttr({value: null});
    assert.equal(field.value, '');
    type(field, 'free');
    assert.equal(data.getItem('v'), 'a');
    node.setAttr({title: 'x'});
    assert.equal(field.value, 'free', 'a control without value is not projected');
    builder.source.popNode(node.label);
    assert.equal(detached, 1);
    field.value = 'after';
    field.dispatchEvent(new field.ownerDocument.defaultView.InputEvent('input'));
    assert.equal(data.getItem('v'), 'a');
});

test('a literal value is the default a native form Reset restores; a ^ value stays property-only (P1)', () => {
    const {builder, data, byId} = page();
    data.setItem('bound', 'from data');
    const form = builder.root.form({id: 'f'});
    form.input({id: 'lit', value: 'Ada Lovelace'});
    form.input({id: 'range', type: 'range', min: 0, max: 100, step: 5, value: 60});
    form.textarea({id: 'note', value: 'A literal note.'});
    form.input({id: 'bound', value: '^bound'});
    assert.equal(byId('range').value, '60');
    assert.equal(byId('range').getAttribute('value'), '60');
    assert.equal(byId('note').defaultValue, 'A literal note.');
    assert.equal(byId('bound').getAttribute('value'), null);
    type(byId('lit'), 'typed');
    type(byId('range'), '25');
    type(byId('note'), 'typed note');
    byId('f').reset();
    assert.equal(byId('lit').value, 'Ada Lovelace');
    assert.equal(byId('range').value, '60');
    assert.equal(byId('note').value, 'A literal note.');
    assert.equal(byId('bound').value, '', 'a ^ value has no default: Reset gives the browser default');
    assert.equal(data.getItem('bound'), 'from data', 'Reset fires no change event: the Data is unchanged');
});

// Phase 18 (ASTRA-02): `type`, `multiple` and `live` are read from the renderer's resolved projection
// (runtimeValues, then `==`), not from the raw Source; a `==` value is no longer a truthy string.
test('ASTRA-02: type from ^, = and == is the resolved one, at mount and on update; the Data gets the typed value', () => {
    const {app, data, byId, record} = page();
    data.setItem('k', 'text');
    const nodes = mount(app, root => ({
        e: sourceTarget(root.input({id: 'e', type: '==kind === "n" ? "number" : "text"', kind: '^kn', value: '^v.e', live: true})),
        r: sourceTarget(root.input({id: 'r', type: '=k', value: '^v.r', live: true})),
        p: sourceTarget(root.input({id: 'p', type: '^k', value: '^v.p', live: true})),
    }));
    for (const [id, node] of Object.entries(nodes)) {
        assert.ok(record(node).control instanceof TextControl, id);
        type(byId(id), '12');
        assert.strictEqual(data.getItem(`v.${id}`), '12', id);
    }
    const binding = app.src.binding.bindingFor(nodes.e);
    data.setItem('kn', 'n');
    data.setItem('k', 'number');
    nodes.r.setAttr({title: 'projected again'});
    for (const [id, node] of Object.entries(nodes)) {
        assert.ok(record(node).control instanceof NumberControl, id);
        assert.equal(byId(id).type, 'number', id);
        type(byId(id), '13');
        assert.strictEqual(data.getItem(`v.${id}`), 13, id);
    }
    assert.strictEqual(app.src.binding.bindingFor(nodes.e), binding);
});

test('ASTRA-02: multiple from == rebuilds the select; live from == is its value, not a truthy string', () => {
    const {app, data, byId, record, errors} = page();
    data.setItem('m', ['a']);
    const node = sourceTarget(mount(app, root => {
        root.input({id: 'off', value: '^l.off', live: '==false'});
        root.input({id: 'eq', value: '^l.eq', live: '==on', on: '^liveOn'});
        root.input({id: 'ro', value: '^l.ro', live: '=liveRead'});
        return select({root}, {id: 's', value: '^m', multiple: '==many', many: '^manyFlag'});
    }));
    assert.equal(byId('s').multiple, false);
    const first = byId('s');
    data.setItem('manyFlag', true);
    assert.notStrictEqual(byId('s'), first);
    assert.equal(byId('s').multiple, true);
    assert.ok(record(node).control instanceof SelectControl);
    assert.deepEqual([...byId('s').selectedOptions].map(option => option.value), ['a']);

    type(byId('off'), 'x');
    type(byId('eq'), 'x');
    type(byId('ro'), 'x');
    assert.deepEqual([data.getItem('l.off'), data.getItem('l.eq'), data.getItem('l.ro')], [null, null, null]);
    change(byId('off'));
    assert.equal(data.getItem('l.off'), 'x');
    data.setItem('liveOn', true);
    type(byId('eq'), 'xy');
    assert.equal(data.getItem('l.eq'), 'xy');
    data.setItem('liveOn', false);
    type(byId('eq'), 'xyz');
    assert.equal(data.getItem('l.eq'), 'xy');
    assert.deepEqual(errors, []);
});

// Gate check of Phase 18: a shape change rebuilds with the projection already resolved by `project`.
test('ASTRA-02: a shape change evaluates the == of the node once, the rebuild included', () => {
    const {app, data, byId, record} = page();
    const compiler = app.src.renderer.inlineCompiler;
    const compile = compiler.compileExpression.bind(compiler);
    let runs = 0;
    compiler.compileExpression = (node, attr, expression) => {
        const run = compile(node, attr, expression);
        return attrs => {
            if (attr === 'type') runs++;
            return run(attrs);
        };
    };
    data.setItem('kind', 'text');
    const node = sourceTarget(mount(app, root => root.input({id: 'n', type: '==kind', kind: '^kind', value: '^v'})));
    assert.equal(runs, 1);
    runs = 0;
    data.setItem('kind', 'number');
    assert.ok(record(node).control instanceof NumberControl);
    assert.equal(byId('n').type, 'number');
    assert.equal(runs, 1);
});

// Gate check of Phase 18: `live` written with `=` is read at every projection, not at every event.
test('ASTRA-02: live written with = is read at every projection of the node', () => {
    const {builder, data, byId} = page();
    const node = sourceTarget(builder.root.input({id: 'ro', value: '^l.ro', live: '=liveRead'}));
    data.setItem('liveRead', true);
    type(byId('ro'), 'x');
    assert.equal(data.getItem('l.ro'), null, 'no projection yet: live keeps the value read at the build');
    node.setAttr({title: 'projected'});
    type(byId('ro'), 'xy');
    assert.equal(data.getItem('l.ro'), 'xy');
    data.setItem('liveRead', false);
    type(byId('ro'), 'xyz');
    assert.equal(data.getItem('l.ro'), 'xyz', '= does not follow the Data: live stays on until a projection');
    node.setAttr({title: 'projected again'});
    type(byId('ro'), 'xyzw');
    assert.equal(data.getItem('l.ro'), 'xyz');
});
