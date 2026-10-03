// Phase S11: checkbox and radio. `value` is a boolean (D4); RadioGroups generates the DOM `name` of a
// group (P11); choosing a button, or a `true` from the Data, turns the other buttons of the group off
// with the same code (C04.2). Source plan §4.11, §7 S11. Real browsers: scripts/verify_binding_browser.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {CheckboxControl, RadioControl, TextControl} from '../src/view/controls.js';
import {mount} from './fixtures/mount.js';

function page(window = new JSDOM('<main></main><aside></aside>', {virtualConsole: new VirtualConsole()}).window,
    element = window.document.querySelector('main')) {
    const document = window.document;
    const app = new Gramlot({document, element, transport: false});
    return {app, window, document, builder: app.builder, data: app.data,
        byId: id => document.getElementById(id),
        record: node => app.renderer.records.get(sourceTarget(node))};
}

/** The Data events on `labels`, as [label, value], in order. */
function watch(data, ...labels) {
    const events = [];
    data.subscribe(`watch-${labels.join('-')}`, {any: event => {
        if (labels.includes(event.node.label)) events.push([event.node.label, event.node.value]);
    }});
    return events;
}

function radios(parent, group, labels, attrs = {}) {
    return labels.map(label => sourceTarget(
        parent.input({id: label, type: 'radio', group, value: `^g.${label}`, ...attrs})));
}

test('checkbox: a boolean both ways; truthiness for other Data values, null off, only true/false written, never on', () => {
    const {builder, data, byId, record} = page();
    data.setItem('c', true);
    const node = builder.root.input({id: 'c', type: 'checkbox', value: '^c'});
    const box = byId('c');
    assert.ok(record(node).control instanceof CheckboxControl);
    assert.equal(box.checked, true);
    assert.equal(box.getAttribute('value'), null);
    box.click();
    assert.strictEqual(data.getItem('c'), false);
    box.click();
    assert.strictEqual(data.getItem('c'), true);
    data.setItem('c', null);
    assert.equal(box.checked, false);
    data.setItem('c', 'yes');
    assert.equal(box.checked, true);
    data.setItem('c', 0);
    assert.equal(box.checked, false);
    box.click();
    assert.strictEqual(data.getItem('c'), true, 'the written value is a boolean, not "on"');
});

test('checkbox: writes on change only; a literal or = value sets the initial state and writes nothing', () => {
    const {builder, data, byId, window} = page();
    data.setItem('src', true);
    builder.root.input({id: 'w', type: 'checkbox', value: '^w'});
    builder.root.input({id: 'lit', type: 'checkbox', value: true});
    builder.root.input({id: 'eq', type: 'checkbox', value: '=src'});
    const box = byId('w');
    box.checked = true;
    box.dispatchEvent(new window.Event('input', {bubbles: true}));
    assert.equal(data.getItem('w'), null, 'input does not write');
    box.dispatchEvent(new window.Event('change', {bubbles: true}));
    assert.strictEqual(data.getItem('w'), true);
    assert.equal(byId('lit').checked, true);
    assert.equal(byId('eq').checked, true);
    byId('lit').click();
    byId('eq').click();
    assert.equal(byId('eq').checked, false);
    assert.strictEqual(data.getItem('src'), true);
});

test('checkbox: an authored checked with a ^ value is an error (two sources)', () => {
    const {builder} = page();
    assert.throws(() => builder.root.input({type: 'checkbox', value: '^c', checked: true}),
        {message: "input 'input_0': checked and a ^ value are two sources"});
});

test('D1: type from text to checkbox through ^.tipo rebuilds with CheckboxControl, a boolean in the Data, same NodeBinding', () => {
    const {app, builder, data, byId, record} = page();
    data.setItem('r.tipo', 'text');
    data.setItem('r.v', 'abc');
    const node = sourceTarget(builder.root.div({datapath: 'r'}).input({id: 'f', type: '^.tipo', value: '^.v'}));
    const binding = app.binding.bindingFor(node);
    assert.ok(record(node).control instanceof TextControl);
    const text = byId('f');
    data.setItem('r.tipo', 'checkbox');
    const box = byId('f');
    assert.notStrictEqual(box, text);
    assert.ok(record(node).control instanceof CheckboxControl);
    assert.strictEqual(app.binding.bindingFor(node), binding);
    assert.equal(box.checked, true, "'abc' is truthy");
    box.click();
    assert.strictEqual(data.getItem('r.v'), false);
    box.click();
    assert.strictEqual(data.getItem('r.v'), true);
});

test('radio group: RadioGroups generates one name per group; choosing B writes true on B, then false on A', () => {
    const {app, builder, data, byId, record} = page();
    data.setItem('g.a', true);
    const [a, b, c] = radios(builder.root, 'g', ['a', 'b', 'c']);
    assert.ok(record(a).control instanceof RadioControl);
    const name = byId('a').name;
    assert.match(name, new RegExp(`^gramlot-${app.renderer.instanceId}-page-g$`));
    assert.deepEqual([byId('b').name, byId('c').name], [name, name]);
    assert.equal(byId('a').checked, true);
    const events = watch(data, 'a', 'b', 'c');
    byId('b').click();
    assert.deepEqual(events, [['b', true], ['a', false]], 'true on B first, then false on the peers that are on');
    assert.deepEqual([data.getItem('g.a'), data.getItem('g.b'), data.getItem('g.c')], [false, true, null]);
    assert.deepEqual([byId('a').checked, byId('b').checked, byId('c').checked], [false, true, false]);
    events.length = 0;
    byId('b').click();
    assert.deepEqual(events, [], 'a checked radio fires no change');
    assert.deepEqual(app.renderer.radioGroups.peers(record(b).control).map(peer => peer.node), [a, c]);
});

test('C04.2: SET of B to true from code turns A off in Data and DOM; A observers are notified once', () => {
    const {builder, data, byId} = page();
    data.setItem('g.a', true);
    data.setItem('g.b', false);
    radios(builder.root, 'g', ['a', 'b']);
    let notified = 0;
    data.subscribe('observer', {any: event => { if (event.node.label === 'a') notified++; }});
    data.setItem('g.b', true);
    assert.strictEqual(data.getItem('g.a'), false);
    assert.equal(byId('a').checked, false);
    assert.equal(byId('b').checked, true);
    assert.equal(notified, 1);
    data.setItem('g.b', false);
    assert.equal(byId('b').checked, false);
    assert.strictEqual(data.getItem('g.a'), false, 'a false turns nothing on');
});

test('rebuild of the group after a code write: the button written last is on', () => {
    const {app, builder, data, byId} = page();
    data.setItem('g.a', true);
    const panel = sourceTarget(builder.root.div({id: 'panel', title: 'x'}));
    radios(builder.wrapSource(panel), 'g', ['a', 'b', 'c']);
    data.setItem('g.c', true);
    const before = byId('c');
    // A new value of the panel rebuilds its branch.
    app.renderer.freeze(panel);
    panel.setAttr({title: 'y'});
    app.renderer.unfreeze(panel);
    assert.notStrictEqual(byId('c'), before);
    assert.deepEqual([byId('a').checked, byId('b').checked, byId('c').checked], [false, false, true]);
    assert.deepEqual([data.getItem('g.a'), data.getItem('g.b'), data.getItem('g.c')], [false, null, true]);
});

test('several true values in one group at mount are an error naming node and group', () => {
    const {builder, data} = page();
    data.setItem('g.a', true);
    data.setItem('g.b', true);
    radios(builder.root, 'g', ['a']);
    assert.throws(() => radios(builder.root, 'g', ['b']),
        {message: "input 'input_1': several true values in radio group 'g'"});
});

test('a projection that keeps a button on writes nothing on its peers', () => {
    const {builder, data} = page();
    data.setItem('g.a', true);
    const [a] = radios(builder.root, 'g', ['a', 'b'], {title: '^t'});
    const events = watch(data, 'a', 'b');
    data.setItem('t', 'x');
    sourceTarget(a).setAttr({class: 'y'});
    assert.deepEqual(events, []);
    assert.equal(data.getItem('g.b'), null, 'the mount does not write false on the peers');
});

test('a rebuilt radio that is on is not a conflict (C04.1 through a Data type)', () => {
    const {builder, data, byId} = page();
    data.setItem('g.a', true);
    data.setItem('kind', 'radio');
    builder.root.input({id: 'a', type: '^kind', group: 'g', value: '^g.a'});
    builder.root.input({id: 'b', type: 'radio', group: 'g', value: '^g.b'});
    const first = byId('a');
    data.setItem('kind', 'RADIO');
    assert.notStrictEqual(byId('a'), first);
    assert.equal(byId('a').checked, true);
    assert.equal(byId('a').name, byId('b').name);
});

test('the false writes go only to the peers bound with ^; an unbound chosen button still turns the bound peers off', () => {
    const {builder, data, byId} = page();
    data.setItem('g.a', true);
    data.setItem('lit', false);
    builder.root.input({id: 'a', type: 'radio', group: 'g', value: '^g.a'});
    builder.root.input({id: 'b', type: 'radio', group: 'g', value: false});
    builder.root.input({id: 'c', type: 'radio', group: 'g', value: '=lit'});
    byId('b').click();
    assert.strictEqual(data.getItem('g.a'), false);
    byId('a').click();
    assert.strictEqual(data.getItem('g.a'), true);
    assert.equal(byId('b').checked, false);
    byId('c').click();
    assert.strictEqual(data.getItem('g.a'), false);
    assert.strictEqual(data.getItem('lit'), false, 'an = value writes nothing');
});

test('a radio without group is a standalone boolean with no name', () => {
    const {builder, data, byId} = page();
    builder.root.input({id: 'x', type: 'radio', value: '^x'});
    builder.root.input({id: 'y', type: 'radio', value: '^y'});
    assert.equal(byId('x').getAttribute('name'), null);
    byId('x').click();
    byId('y').click();
    assert.deepEqual([data.getItem('x'), data.getItem('y')], [true, true]);
    assert.deepEqual([byId('x').checked, byId('y').checked], [true, true]);
});

test('an authored name together with group is an error (two names); string renderers write no name', () => {
    const {builder} = page();
    assert.throws(() => builder.root.input({type: 'radio', group: 'g', name: 'n', value: '^v'}),
        {message: "input 'input_0': name and group are two names"});
    const string = new GramlotBuilder();
    string.root.input({type: 'radio', group: 'g', value: true});
    assert.equal(string.render().includes('name='), false);
});

test('group scope: a Source form (formId or form=true) separates groups of the same name', () => {
    const {builder, data, byId} = page();
    data.setItem('g.a', true);
    data.setItem('g.x', true);
    const one = builder.root.div({formId: 'one'});
    const two = builder.root.div({form: true});
    one.input({id: 'a', type: 'radio', group: 'g', value: '^g.a'});
    one.input({id: 'b', type: 'radio', group: 'g', value: '^g.b'});
    two.input({id: 'x', type: 'radio', group: 'g', value: '^g.x'});
    builder.root.input({id: 'p', type: 'radio', group: 'g', value: '^g.p'});
    assert.equal(byId('a').name, byId('b').name);
    assert.notEqual(byId('a').name, byId('x').name);
    assert.notEqual(byId('a').name, byId('p').name);
    assert.notEqual(byId('x').name, byId('p').name);
    byId('b').click();
    assert.deepEqual([data.getItem('g.a'), data.getItem('g.b'), data.getItem('g.x')], [false, true, true]);
    assert.equal(byId('x').checked, true);
});

test('two Gramlot pages in one document keep their groups apart', () => {
    const {window} = new JSDOM('<main></main><aside></aside>');
    const first = page(window, window.document.querySelector('main'));
    const second = page(window, window.document.querySelector('aside'));
    first.data.setItem('g.a', true);
    second.data.setItem('g.a', true);
    first.builder.root.input({id: 'a1', type: 'radio', group: 'g', value: '^g.a'});
    first.builder.root.input({id: 'b1', type: 'radio', group: 'g', value: '^g.b'});
    second.builder.root.input({id: 'a2', type: 'radio', group: 'g', value: '^g.a'});
    second.builder.root.input({id: 'b2', type: 'radio', group: 'g', value: '^g.b'});
    const byId = id => window.document.getElementById(id);
    assert.notEqual(byId('a1').name, byId('a2').name);
    byId('b1').click();
    assert.deepEqual([first.data.getItem('g.a'), first.data.getItem('g.b')], [false, true]);
    assert.deepEqual([second.data.getItem('g.a'), second.data.getItem('g.b')], [true, null]);
    assert.equal(byId('a2').checked, true);
});

test('buttons added and removed: removal leaves the group and drops the name; an added button joins it', () => {
    const {app, builder, data, byId, record} = page();
    data.setItem('g.a', true);
    const [a, b] = radios(builder.root, 'g', ['a', 'b']);
    const groups = app.renderer.radioGroups;
    const control = record(b).control;
    const element = byId('b');
    builder.source.popNode(b.label);
    assert.equal(element.getAttribute('name'), null);
    assert.deepEqual(groups.peers(record(a).control), []);
    assert.equal(groups.peers(control).length, 0);
    const [c] = radios(builder.root, 'g', ['c']);
    assert.equal(byId('c').name, byId('a').name);
    byId('c').click();
    assert.deepEqual([data.getItem('g.a'), data.getItem('g.c')], [false, true]);
    assert.ok(record(c).control instanceof RadioControl);
    // The removed button no longer writes.
    element.checked = true;
    element.dispatchEvent(new element.ownerDocument.defaultView.Event('change'));
    assert.equal(data.getItem('g.b'), null);
});

test('rebinding: a datapath change projects the new values; a true there turns the peers off', () => {
    const {builder, data, byId} = page();
    data.setItem('r1.a', true);
    data.setItem('r2.b', true);
    data.setItem('rec', 'r1');
    const box = builder.root.div({datapath: '^rec'});
    box.input({id: 'a', type: 'radio', group: 'g', value: '^.a'});
    box.input({id: 'b', type: 'radio', group: 'g', value: '^.b'});
    assert.deepEqual([byId('a').checked, byId('b').checked], [true, false]);
    data.setItem('rec', 'r2');
    assert.deepEqual([byId('a').checked, byId('b').checked], [false, true]);
    byId('a').click();
    assert.deepEqual([data.getItem('r2.a'), data.getItem('r2.b')], [true, false]);
    assert.strictEqual(data.getItem('r1.a'), true, 'the old record is untouched');
});

test('a controller that refuses the choice: its correction reaches B, and A still follows the choice', () => {
    const {app, data, byId} = page();
    data.setItem('g.a', true);
    mount(app, root => {
        radios(root, 'g', ['a', 'b']);
        root.dataController({script: 'if (b) this.SET("g.b", false)', b: '^g.b'});
    });
    byId('b').click();
    assert.strictEqual(data.getItem('g.b'), false);
    assert.equal(byId('b').checked, false, 'the correction reaches the button that wrote');
    assert.strictEqual(data.getItem('g.a'), false);
});

// Phase 18 (ASTRA-02): `group` is read from the renderer's resolved projection (`==` included).
test('ASTRA-02: group from ^, = and == is the resolved group, at mount and on update', () => {
    const {app, window, data, byId} = page();
    data.setItem('gn', 'colors');
    const prefix = `gramlot-${app.renderer.instanceId}-page-`;
    const eq = sourceTarget(mount(app, root => {
        root.input({id: 'r', type: 'radio', group: '=gn', value: '^g.r'});
        root.input({id: 'p', type: 'radio', group: '^gn', value: '^g.p'});
        root.input({id: 'l', type: 'radio', group: '==lit', lit: 'colors', value: '^g.l'});
        return root.input({id: 'e', type: 'radio', group: '==gname', gname: '^gn', value: '^g.e'});
    }));
    for (const id of ['e', 'r', 'p', 'l']) assert.equal(byId(id).name, `${prefix}colors`, id);
    byId('e').checked = true;
    byId('e').dispatchEvent(new window.Event('change'));
    assert.deepEqual(['e', 'r', 'p', 'l'].map(id => data.getItem(`g.${id}`)), [true, null, null, null]);
    byId('p').checked = true;
    byId('p').dispatchEvent(new window.Event('change'));
    assert.deepEqual(['e', 'r', 'p', 'l'].map(id => data.getItem(`g.${id}`)), [false, null, true, null]);
    const binding = app.binding.bindingFor(eq);
    data.setItem('gn', 'sizes');
    assert.equal(byId('e').name, `${prefix}sizes`);
    assert.equal(byId('p').name, `${prefix}sizes`);
    assert.equal(byId('r').name, `${prefix}colors`);
    assert.strictEqual(app.binding.bindingFor(eq), binding);
});

// Phase 18 (ASTRA-04): the radio group follows the semantic form owner when `form`/`formId` changes above it.
test('ASTRA-04: adding, removing and moving a form scope moves the radios to the group of their new scope; two true raise', () => {
    const {app, builder, data, byId} = page();
    const outer = sourceTarget(builder.root.div({id: 'outer', formId: 'outer'}));
    const inner = sourceTarget(builder.wrapSource(outer).div({id: 'inner'}));
    const [a] = radios(builder.wrapSource(inner), 'g', ['a']);
    radios(builder.wrapSource(outer), 'g', ['o']);
    radios(builder.root, 'g', ['p']);
    const binding = app.binding.bindingFor(a);
    const element = byId('a');
    assert.equal(byId('a').name, byId('o').name);
    // Add: inner becomes a form; a leaves the group of o.
    inner.setAttr({formId: 'inner'});
    assert.notEqual(byId('a').name, byId('o').name);
    assert.notEqual(byId('a').name, byId('p').name);
    byId('o').click();
    byId('a').click();
    assert.deepEqual([data.getItem('g.o'), data.getItem('g.a')], [true, true]);
    // Remove while a and o are both on: the move raises, as the join does at mount (P11).
    assert.throws(() => inner.setAttr({formId: null}), /input 'input_0': several true values in radio group 'g'/);
    assert.notEqual(byId('a').name, byId('o').name);
    // With a off the next projection moves a back with o, and choosing a turns o off.
    data.setItem('g.a', false);
    assert.equal(byId('a').name, byId('o').name);
    byId('o').click();
    assert.deepEqual([data.getItem('g.o'), data.getItem('g.a')], [true, false]);
    byId('a').click();
    assert.deepEqual([data.getItem('g.o'), data.getItem('g.a')], [false, true]);
    // Move: the outer form goes away, so a and o join the page group of p.
    outer.setAttr({formId: null});
    assert.equal(byId('a').name, byId('p').name);
    assert.equal(byId('o').name, byId('p').name);
    byId('p').click();
    assert.deepEqual([data.getItem('g.o'), data.getItem('g.a'), data.getItem('g.p')], [false, false, true]);
    assert.strictEqual(app.binding.bindingFor(a), binding);
    assert.strictEqual(byId('a'), element);
    const groups = app.renderer.radioGroups;
    assert.equal(groups.peersOf('g', null).length, 3);
    assert.equal(groups.peersOf('g', outer).length, 0);
});

// Phase 18 (ASTRA-05): a radio removed under freeze keeps its DOM until the thaw, but it is not a peer
// for the initial-conflict check of a new button.
test('ASTRA-05: a radio removed under freeze is not counted by the several-true check of a new radio', () => {
    const {app, builder, data, byId} = page();
    data.setItem('g.a', true);
    const panel = sourceTarget(builder.root.div({id: 'panel'}));
    const [a] = radios(builder.wrapSource(panel), 'g', ['a']);
    app.renderer.freeze(panel);
    panel.value.popNode(a.label);
    assert.ok(byId('a'));
    data.setItem('g.b', true);
    radios(builder.root, 'g', ['b']);
    assert.equal(byId('b').checked, true);
    app.renderer.unfreeze(panel);
    assert.equal(byId('a'), null);
});

// Phase 18 (ASTRA-06): a control whose first projection raises leaves no listener behind.
test('ASTRA-06: a failed first projection of a control cleans up its partial record, listeners included', () => {
    const {app, window, builder, data} = page();
    const added = [];
    const removed = [];
    const add = window.EventTarget.prototype.addEventListener;
    const remove = window.EventTarget.prototype.removeEventListener;
    window.EventTarget.prototype.addEventListener = function (type, listener, options) {
        added.push([this, type, listener]);
        return add.call(this, type, listener, options);
    };
    window.EventTarget.prototype.removeEventListener = function (type, listener, options) {
        removed.push([this, type, listener]);
        return remove.call(this, type, listener, options);
    };
    try {
        data.setItem('choice', 'invalid-array');
        const box = sourceTarget(builder.root.div({id: 'box'}));
        builder.wrapSource(box).span('kept', {id: 'kept'});
        assert.throws(() => {
            const node = builder.wrapSource(box).select({id: 's', multiple: true, value: '^choice'});
            node.option('A', {value: 'a'});
        }, /a multiple select requires an array/);
    } finally {
        window.EventTarget.prototype.addEventListener = add;
        window.EventTarget.prototype.removeEventListener = remove;
    }
    const live = added.filter(([target, type, listener]) =>
        !removed.some(([t, ty, l]) => t === target && ty === type && l === listener));
    assert.deepEqual(live.map(([, type]) => type), []);
    assert.equal(added.filter(([target]) => target.localName === 'select').length, 4);
    assert.deepEqual([...app.renderer.records.keys()].map(node => node.nodeTag).sort(), ['div', 'span']);
});
