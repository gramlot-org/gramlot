// Phase S12: `connect_on<event>`. One listener per attribute on the element of the declaring node;
// the event name is the part after `connect_on`, lower-cased; a `group.method` value is named logic
// (LogicRegistry, no fallback to inline), any other value inline with `this` = the node. The button
// mechanism runs before a `connect_onclick` of the same button (P10). Source plan §2, §4.11, §7 S12.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot} from '../src/index.js';
import {NativeEventBinding} from '../src/view/events.js';

function page() {
    const window = new JSDOM('<main></main>', {virtualConsole: new VirtualConsole()}).window;
    const document = window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    return {app, window, document, builder: app.builder, data: app.data,
        byId: id => document.getElementById(id),
        record: node => app.renderer.records.get(sourceTarget(node))};
}

/** Register `methods` in the logic group `group`. */
function logic(app, group, methods) {
    const Logic = class {};
    for (const [name, method] of Object.entries(methods)) {
        Object.defineProperty(Logic.prototype, name, {value: method, writable: true, configurable: true});
    }
    app.logicRegistry.register(Logic, {group, resource: `/${group ?? 'page'}.js`});
}

function fire(window, element, type, init = {}) {
    const Event = type === 'click' ? window.MouseEvent : window.Event;
    return element.dispatchEvent(new Event(type, {bubbles: true, cancelable: true, ...init}));
}

function listenerErrors(window, fn) {
    const errors = [];
    const handler = event => { errors.push(event.error); event.preventDefault(); };
    window.addEventListener('error', handler);
    try { fn(); } finally { window.removeEventListener('error', handler); }
    return errors;
}

test('the event name is the part after connect_on, lower-cased; one listener per attribute', () => {
    const {builder, record} = page();
    const node = builder.root.input({id: 'i', connect_onclick: 'void 0', connect_onBlur: 'void 0', connect_onMouseOver: 'void 0'});
    const events = [...record(node).events.values()];
    assert.ok(events.every(binding => binding instanceof NativeEventBinding));
    assert.deepEqual(events.map(binding => [binding.attribute, binding.eventName]), [
        ['connect_onclick', 'click'], ['connect_onBlur', 'blur'], ['connect_onMouseOver', 'mouseover'],
    ]);
});

test('inline: this = the declaring node, the event as parameter and as arguments[0]; the legacy macros work', () => {
    const {builder, byId, window, data} = page();
    const node = sourceTarget(builder.root.div({id: 'd',
        connect_onclick: 'SET got = [this.label, event.type, arguments[0] === event].join()'}));
    const errors = listenerErrors(window, () => fire(window, byId('d'), 'click'));
    assert.deepEqual(errors, []);
    assert.equal(data.getItem('got'), `${node.label},click,true`);
});

test('named logic: group.method resolved by LogicRegistry, called with the node and the event, this = the group', () => {
    const {app, builder, byId, window} = page();
    const calls = [];
    logic(app, 'gui', {focused(node, event) { calls.push([this === app.logic.gui, node.label, event.type]); }});
    const node = sourceTarget(builder.root.input({id: 'i', connect_onfocus: 'gui.focused'}));
    fire(window, byId('i'), 'focus');
    assert.deepEqual(calls, [[true, node.label, 'focus']]);
});

test('named logic: a missing name raises from the listener, never falls back to inline (S09)', () => {
    const {app, builder, byId, window} = page();
    logic(app, 'gui', {other() {}});
    builder.root.div({id: 'd', connect_onclick: 'gui.missing'});
    const errors = listenerErrors(window, () => fire(window, byId('d'), 'click'));
    assert.equal(errors.length, 1);
    assert.match(errors[0].message, /div 'div_0': named logic 'gui.missing' not found/);
});

test('R11: an event on a descendant runs the handler with the declaring node', () => {
    const {builder, byId, window, data} = page();
    const pane = builder.root.div({id: 'pane', connect_onclick: 'this.SET("got", [this.label, event.target.id].join())'});
    pane.p({id: 'inner'}).span('x', {id: 'leaf'});
    fire(window, byId('leaf'), 'click');
    assert.equal(data.getItem('got'), `${sourceTarget(pane).label},leaf`);
});

test('a replaced handler no longer fires; a removed one is gone; an added one fires; a Data projection keeps one listener', () => {
    const {builder, byId, window, data, record} = page();
    const node = sourceTarget(builder.root.div({id: 'd', title: '^t', connect_onclick: 'this.SET("which", "old")'}));
    const first = record(node).events.get('connect_onclick');
    data.setItem('t', 'projected');
    assert.equal(record(node).events.get('connect_onclick'), first, 'a projection keeps the listener');
    node.setAttr({connect_onclick: 'this.SET("which", "new")'});
    fire(window, byId('d'), 'click');
    assert.equal(data.getItem('which'), 'new');
    data.setItem('which', null);
    node.setAttr({connect_onclick: null});
    fire(window, byId('d'), 'click');
    assert.equal(data.getItem('which'), null);
    assert.equal(record(node).events.size, 0);
    node.setAttr({connect_ondblclick: 'this.SET("which", "dbl")'});
    fire(window, byId('d'), 'dblclick');
    assert.equal(data.getItem('which'), 'dbl');
});

test('a rebuilt element gets its listeners once; a removed element keeps none', () => {
    const {app, builder, byId, window, data} = page();
    const pane = builder.root.div({id: 'pane'});
    const node = sourceTarget(pane.div({id: 'd', connect_onclick: 'this.SET("n", (this.GET("n") || 0) + 1)'}));
    app.renderer.freeze(pane);
    sourceTarget(pane).setAttr({title: 'rebuilt'});
    app.renderer.unfreeze(pane);
    fire(window, byId('d'), 'click');
    assert.equal(data.getItem('n'), 1);
    const element = byId('d');
    node.parentBag.popNode(node.label);
    fire(window, element, 'click');
    assert.equal(data.getItem('n'), 1);
});

test('R12: a node removed under freeze keeps its DOM until the thaw and its handler does nothing', () => {
    const {app, builder, byId, window, data} = page();
    const pane = builder.root.div({id: 'pane'});
    const node = sourceTarget(pane.input({id: 'i', connect_onkeydown: 'this.SET("typed", true)'}));
    app.renderer.freeze(pane);
    node.parentBag.popNode(node.label);
    fire(window, byId('i'), 'keydown');
    assert.equal(data.getItem('typed'), null);
    app.renderer.unfreeze(pane);
    assert.equal(byId('i'), null);
});

test('P10: the button mechanism runs before a connect_onclick of the same button; a button with only connect_onclick stays native', () => {
    const {builder, byId, window} = page();
    const order = [];
    globalThis.__order = order;
    try {
        const pane = builder.root.div({id: 'pane', connect_onclick: '__order.push("pane")'});
        pane.button('both', {id: 'both', action: '__order.push("action")', connect_onclick: '__order.push("connect")'});
        pane.button('only', {id: 'only', connect_onclick: '__order.push("only")'});
        fire(window, byId('both'), 'click');
        assert.deepEqual(order.splice(0), ['action', 'connect']);
        fire(window, byId('only'), 'click');
        assert.deepEqual(order.splice(0), ['only', 'pane']);
        assert.equal(byId('only').getAttribute('type'), null);
    } finally {
        delete globalThis.__order;
    }
});

test('input type=button, submit, reset and image stay native; connect_onclick works on them', () => {
    const {builder, byId, window, data, record} = page();
    for (const type of ['button', 'submit', 'reset', 'image']) {
        const node = builder.root.input({id: type, type, connect_onclick: `this.SET("clicked.${type}", true)`});
        assert.equal(record(node).button, undefined);
        assert.equal(record(node).control, undefined);
        fire(window, byId(type), 'click');
        assert.equal(data.getItem(`clicked.${type}`), true, type);
        assert.equal(byId(type).getAttribute('type'), type);
    }
});

test('an SVG element takes connect_on<event> as well', () => {
    const {builder, byId, window, data} = page();
    builder.root.svg({width: 10, height: 10}).circle({id: 'c', r: 4, connect_onclick: 'this.SET("hit", this.nodeTag)'});
    fire(window, byId('c'), 'click');
    assert.equal(data.getItem('hit'), 'circle');
});
