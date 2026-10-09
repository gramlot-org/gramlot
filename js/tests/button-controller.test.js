// Phase S12: the click of a `<button>`. One mechanism per button (P10): the nested `dataController`
// (a normal ControllerProvider, B7), `action`, or the `fire`/`fire_*` family; the owner node is the
// button (R11); R3 provisional (`type="button"`, `stopPropagation`, no `preventDefault`, only with a
// mechanism). Source plan §2 Button, §4.11, §7 S12. Real browsers: scripts/verify_binding_browser.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {ButtonBinding} from '../src/view/button.js';
import {mount} from './fixtures/mount.js';

function page() {
    const window = new JSDOM('<main></main>', {virtualConsole: new VirtualConsole()}).window;
    const document = window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    return {app, window, document, builder: app.src.builder, data: app.data,
        byId: id => document.getElementById(id),
        record: node => app.src.renderer.records.get(sourceTarget(node))};
}

/** Register `methods` as the page companion (the root logic group). */
function companion(app, methods) {
    const Logic = class {};
    for (const [name, method] of Object.entries(methods)) {
        Object.defineProperty(Logic.prototype, name, {value: method, writable: true, configurable: true});
    }
    app.src.logicRegistry.register(Logic, {group: null, resource: '/test_aux.js'});
}

/** A Source authored on a separate builder, mounted as one branch. */
function authored(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.source;
}

/** A click with the modifier keys `keys` (e.g. {shiftKey: true}), bubbling as a real one. */
function click(window, element, keys = {}) {
    return element.dispatchEvent(new window.MouseEvent('click', {bubbles: true, cancelable: true, ...keys}));
}

/** A keyboard activation as the browsers deliver it: a click with `detail` 0 on the button. */
function keyboardActivation(window, element) {
    return element.dispatchEvent(new window.MouseEvent('click', {bubbles: true, cancelable: true, detail: 0}));
}

/** Collect the jsdom listener errors of `window` while `fn` runs. */
function listenerErrors(window, fn) {
    const errors = [];
    const handler = event => { errors.push(event.error); event.preventDefault(); };
    window.addEventListener('error', handler);
    try { fn(); } finally { window.removeEventListener('error', handler); }
    return errors;
}

test('R11: text, span, SVG icon and keyboard activation invoke the nested controller once, with the button as owner node', () => {
    const {app, builder, byId, window, record} = page();
    const calls = [];
    companion(app, {pressed(node, kwargs) { calls.push([node.parentNode.label, kwargs._reason, kwargs.button_counter]); }});
    const button = builder.root.button({id: 'b'});
    button.span('Salva', {id: 'label'});
    button.svg({id: 'icon', width: 10, height: 10}).circle({id: 'dot', r: 4});
    button.dataController({func: 'pressed'});
    const owner = sourceTarget(button).label;
    assert.ok(record(button).button instanceof ButtonBinding);
    const element = byId('b');
    click(window, element);
    click(window, byId('label'));
    click(window, byId('dot'));
    keyboardActivation(window, element);
    assert.deepEqual(calls, [[owner, 'click', 1], [owner, 'click', 2], [owner, 'click', 3], [owner, 'click', 4]]);
    assert.equal(app.src.binding.bindingFor(sourceTarget(button)).clickCount, 4);
});

test('R11: a connect_onclick on an ancestor keeps its own node; the button mechanism stops the propagation (R3)', () => {
    const {app, byId, window} = page();
    const seen = [];
    globalThis.__seen = seen;
    try {
        const pane = mount(app, root => {
            const div = root.div({id: 'pane', connect_onclick: '__seen.push(["pane", this.label, event.target.id])'});
            div.button('native', {id: 'native'});
            div.button('fires', {id: 'fires', fire: 'x'});
            return div;
        });
        click(window, byId('native'));
        click(window, byId('fires'));
        assert.deepEqual(seen, [['pane', sourceTarget(pane).label, 'native']]);
    } finally {
        delete globalThis.__seen;
    }
});

test('controller kwargs: _evt, button_counter and the modifier booleans; a body reads them as locals', () => {
    const {app, byId, window} = page();
    const calls = [];
    companion(app, {pressed(node, kwargs) { calls.push(kwargs); }});
    mount(app, root => {
        root.button({id: 'named'}).dataController({func: 'pressed', a: 1});
        root.button({id: 'inline'}).dataController({
            script: 'this.SET("seen", [button_counter, button_shift, button_ctrl, button_alt, button_meta, _evt.type, a].join())', a: 'A'});
    });
    click(window, byId('named'), {shiftKey: true, metaKey: true});
    const [kwargs] = calls;
    assert.equal(kwargs._evt.type, 'click');
    assert.deepEqual([kwargs.button_counter, kwargs.button_shift, kwargs.button_ctrl, kwargs.button_alt, kwargs.button_meta, kwargs.a],
        [1, true, false, false, true, 1]);
    click(window, byId('inline'), {ctrlKey: true, altKey: true});
    click(window, byId('inline'));
    assert.equal(app.data.getItem('seen'), '2,false,false,false,false,click,A');
});

test('B7: the nested controller also reacts to ^ and _init; a click invokes it once', () => {
    const {app, builder, byId, window, data} = page();
    const reasons = [];
    companion(app, {pressed(node, kwargs) { reasons.push(kwargs._reason); }});
    builder.root.button({id: 'b'}).dataController({func: 'pressed', v: '^v', _init: true});
    assert.deepEqual(reasons, ['init']);
    data.setItem('v', 1);
    click(window, byId('b'));
    assert.deepEqual(reasons, ['init', 'node', 'click']);
});

test('the counter lives as long as the semantic node: a rebuild keeps it', () => {
    const {app, builder, byId, window} = page();
    const counters = [];
    companion(app, {pressed(node, kwargs) { counters.push(kwargs.button_counter); }});
    const pane = builder.root.div({id: 'pane'});
    pane.button({id: 'b'}).dataController({func: 'pressed'});
    click(window, byId('b'));
    const before = byId('b');
    app.src.renderer.freeze(pane);
    sourceTarget(pane).setAttr({title: 'rebuilt'});
    app.src.renderer.unfreeze(pane);
    assert.notEqual(byId('b'), before);
    click(window, byId('b'));
    assert.deepEqual(counters, [1, 2]);
});

test('action: inline with this = the button node, the button attributes, event, _counter and modifiers', () => {
    const {app, byId, window, data} = page();
    const node = sourceTarget(mount(app, root => root.button('go', {id: 'b', title: 'T',
        action: 'this.SET("got", [this.label, title, event.type, _counter, modifiers].join("|"))'})));
    click(window, byId('b'), {ctrlKey: true, shiftKey: true});
    assert.equal(data.getItem('got'), `${node.label}|T|click|1|ShiftCtrl`);
    click(window, byId('b'));
    assert.equal(data.getItem('got'), `${node.label}|T|click|2|`);
});

test('fire: the modifier string or true, with modifier and _counter on the Data node; the value goes back to null', () => {
    const {builder, byId, window, data} = page();
    builder.root.button('go', {id: 'b', fire: 'x'});
    const events = [];
    data.subscribe('fire-watch', {any: event => events.push([event.node.label, event.node.value, {...event.node.attr}])});
    click(window, byId('b'));
    click(window, byId('b'), {ctrlKey: true, altKey: true});
    assert.deepEqual(events, [
        ['x', true, {modifier: '', _counter: 1}],
        ['x', 'CtrlAlt', {modifier: 'CtrlAlt', _counter: 2}],
    ]);
    assert.equal(data.getItem('x'), null);
    assert.deepEqual({...data.getNode('x').attr}, {modifier: 'CtrlAlt', _counter: 2});
});

test('fire_*: every fire_<name> fires the string <name>, in attribute order; fire wins over fire_* (legacy chain)', () => {
    const {builder, byId, window, data} = page();
    builder.root.button('go', {id: 'b', fire_salva: 'azione', fire_chiudi: 'chiusura'});
    builder.root.button('both', {id: 'both', fire: 'solo', fire_altro: 'altro'});
    const events = [];
    data.subscribe('fire-watch', {any: event => events.push([event.node.label, event.node.value, event.node.attr._counter])});
    click(window, byId('b'));
    assert.deepEqual(events, [['azione', 'salva', 1], ['chiusura', 'chiudi', 1]]);
    events.length = 0;
    click(window, byId('both'));
    assert.deepEqual(events, [['solo', true, 1]]);
});

test('P10: several dataController children or two mechanisms raise at mount, naming the button', () => {
    const {app} = page();
    assert.throws(() => app.src.startSource(authored(root => {
        const button = root.button({id: 'b'});
        button.dataController({script: '1'});
        button.dataController({script: '2'});
    })), /button 'button_0': several dataController or dataRpc children; a button has one click mechanism/);
    for (const [attrs, found] of [
        [{action: 'x()', fire: 'y'}, 'action and fire'],
        [{action: 'x()', fire_a: 'y'}, 'action and fire'],
    ]) {
        const {builder} = page();
        assert.throws(() => builder.root.button({id: 'b', ...attrs}), new RegExp(`${found} together`));
    }
    const {app: other} = page();
    assert.throws(() => other.src.startSource(authored(root => {
        root.button({id: 'b', action: 'x()'}).dataController({script: '1'});
    })), /controller and action together/);
});

test('P10: an ambiguity brought by a Source change raises at the change, not at the click', () => {
    const {builder} = page();
    const button = builder.root.button({id: 'b', action: 'x()'});
    assert.throws(() => sourceTarget(button).setAttr({fire: 'y'}), /action and fire together/);
    const {builder: second} = page();
    const other = second.root.button({id: 'c'});
    other.dataController({script: '1'});
    assert.throws(() => other.dataController({script: '2'}), /several dataController or dataRpc children/);
});

test('R3: type="button" only with a mechanism, also when the mechanism appears later; an author type stays', () => {
    const {builder, byId} = page();
    builder.root.button('native', {id: 'native'});
    const submit = builder.root.button('submit', {id: 'submit', type: 'submit', fire: 'x'});
    const late = builder.root.button('late', {id: 'late'});
    const nested = builder.root.button({id: 'nested'});
    assert.equal(byId('native').getAttribute('type'), null);
    assert.equal(byId('submit').getAttribute('type'), 'submit');
    assert.equal(byId('late').getAttribute('type'), null);
    sourceTarget(late).setAttr({fire: 'y'});
    assert.equal(byId('late').getAttribute('type'), 'button');
    nested.span('x');
    assert.equal(byId('nested').getAttribute('type'), null);
    nested.dataController({func: 'pressed'});
    assert.equal(byId('nested').getAttribute('type'), 'button');
    sourceTarget(submit).setAttr({type: null});
    assert.equal(byId('submit').getAttribute('type'), 'button');
});

test('disabled button: the click runs nothing and is not counted (legacy early return)', () => {
    const {app, builder, byId, window, data} = page();
    data.setItem('off', true);
    const node = sourceTarget(builder.root.button('go', {id: 'b', disabled: '^off', fire: 'x'}));
    const events = [];
    data.subscribe('fire-watch', {any: event => { if (event.node.label === 'x') events.push(event.node.value); }});
    click(window, byId('b'));
    assert.deepEqual(events, []);
    assert.equal(app.src.binding.bindingFor(node).clickCount, 0);
    data.setItem('off', false);
    click(window, byId('b'));
    assert.deepEqual(events, [true]);
    assert.equal(app.src.binding.bindingFor(node).clickCount, 1);
});

test('removal during a callback: the button removed by its own action runs nothing more (R12)', () => {
    const {app, byId, window, data} = page();
    globalThis.__remove = node => node.parentBag.popNode(node.label);
    try {
        mount(app, root => root.button('go', {id: 'b', action: '__remove(this)', connect_onclick: 'this.SET("after", true)'}));
        const element = byId('b');
        const errors = listenerErrors(window, () => click(window, element));
        assert.deepEqual(errors, []);
        assert.equal(byId('b'), null);
        assert.equal(data.getItem('after'), null, 'the connect_onclick of the removed node does nothing');
    } finally {
        delete globalThis.__remove;
    }
});

test('R12: a button removed under freeze keeps its DOM until the thaw and does nothing', () => {
    const {app, builder, byId, window, data} = page();
    const pane = builder.root.div({id: 'pane'});
    const button = sourceTarget(pane.button('go', {id: 'b', fire: 'x'}));
    const binding = app.src.binding.bindingFor(button);
    const events = [];
    data.subscribe('fire-watch', {any: event => events.push(event.node.label)});
    app.src.renderer.freeze(pane);
    button.parentBag.popNode(button.label);
    const element = byId('b');
    assert.ok(element);
    click(window, element);
    assert.deepEqual(events, []);
    assert.equal(binding.clickCount, 0);
    app.src.renderer.unfreeze(pane);
    assert.equal(byId('b'), null);
});

test('a listener error propagates from the click, naming the node (as Q7)', () => {
    const {builder, byId, window} = page();
    builder.root.div({datapath: '^nowhere'}).button('go', {id: 'b', fire: '.x'});
    const errors = listenerErrors(window, () => click(window, byId('b')));
    assert.equal(errors.length, 1);
    assert.match(errors[0].message, /button 'button_0': write on a null path: '\.x'/);
});

test('R3 side effects: a button in a form, with and without type, with and without a mechanism', () => {
    const {builder, byId, window, document} = page();
    const form = builder.root.form({id: 'f'});
    form.button('native', {id: 'native'});
    form.button('typed', {id: 'typed', type: 'submit', fire: 'x'});
    form.button('mech', {id: 'mech', fire: 'x'});
    form.button('plain', {id: 'plain', type: 'button'});
    const submits = [];
    document.getElementById('f').addEventListener('submit', event => {
        submits.push(event.submitter?.id ?? null);
        event.preventDefault();
    });
    const results = {};
    for (const id of ['native', 'typed', 'mech', 'plain']) {
        const notCancelled = click(window, byId(id));
        results[id] = {type: byId(id).getAttribute('type'), defaultPrevented: !notCancelled};
    }
    assert.deepEqual(submits, ['native', 'typed']);
    assert.deepEqual(results, {
        native: {type: null, defaultPrevented: false},
        typed: {type: 'submit', defaultPrevented: false},
        mech: {type: 'button', defaultPrevented: false},
        plain: {type: 'button', defaultPrevented: false},
    });
});

test('R3 side effects: a dataController nested on a parent node is not the click mechanism of the button', () => {
    const {app, builder, byId, window} = page();
    const reasons = [];
    companion(app, {pane(node, kwargs) { reasons.push(kwargs._reason); }});
    const pane = builder.root.div({id: 'pane'});
    pane.dataController({func: 'pane', v: '^v'});
    pane.button('native', {id: 'b'});
    assert.equal(byId('b').getAttribute('type'), null);
    click(window, byId('b'));
    assert.deepEqual(reasons, [], 'the click of a button does not invoke a controller of its parent');
    app.data.setItem('v', 1);
    assert.deepEqual(reasons, ['node']);
});

test('R3 side effects: native listeners added by the author, on the button and on an ancestor', () => {
    const {builder, byId, window} = page();
    const pane = builder.root.div({id: 'pane'});
    pane.button('mech', {id: 'mech', fire: 'x'});
    pane.button('native', {id: 'native'});
    const seen = [];
    byId('mech').addEventListener('click', () => seen.push('mech on button'));
    byId('native').addEventListener('click', () => seen.push('native on button'));
    byId('pane').addEventListener('click', event => seen.push(`pane from ${event.target.id}`));
    byId('pane').addEventListener('click', event => seen.push(`pane capture from ${event.target.id}`), {capture: true});
    click(window, byId('mech'));
    click(window, byId('native'));
    assert.deepEqual(seen, ['pane capture from mech', 'mech on button',
        'pane capture from native', 'native on button', 'pane from native']);
});

test('R3 side effects: Enter and Space keydown on a button with a mechanism are not prevented by Gramlot', () => {
    // jsdom has no keyboard activation: the real Enter/Space effects are in scripts/verify_binding_browser.mjs.
    const {builder, byId, window} = page();
    builder.root.form({id: 'f'}).button('mech', {id: 'mech', fire: 'x'});
    for (const key of ['Enter', ' ']) {
        const event = new window.KeyboardEvent('keydown', {key, bubbles: true, cancelable: true});
        byId('mech').dispatchEvent(event);
        assert.equal(event.defaultPrevented, false, key);
    }
});
