import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';

function page(author) {
    const window = new JSDOM('<main></main>').window;
    // jsdom lacks native dialog presentation; browser qualification exercises showModal itself.
    window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    const document = window.document;
    const app = new Gramlot({document, element: document.querySelector('main'), transport: false});
    const builder = new GramlotBuilder();
    author(builder.root);
    app.src.startSource(builder.toTytx());
    return {app, document, window};
}
const settle = () => new Promise(resolve => setTimeout(resolve, 0));
const confirm = (document, window) => document.querySelector('dialog form').dispatchEvent(new window.Event('submit', {bubbles: true, cancelable: true}));

test('controller ask gathers fields through native Data binding, then executes once and clears temporary state', async () => {
    const {app, document, window} = page(root => root.dataController({subscribe_run: true,
        script: "this.SET('answer', name);", _ask: {title: 'Name', fields: [{name: 'name', lbl: 'Your name'}]}}));
    app.publish('run', {name: 'Ada'});
    assert.equal(app.data.getItem('answer'), null);
    const field = document.querySelector('dialog input');
    assert.equal(field.value, 'Ada');
    field.value = 'Grace';
    field.dispatchEvent(new window.Event('input', {bubbles: true}));
    confirm(document, window);
    await settle();
    assert.equal(app.data.getItem('answer'), 'Grace');
    assert.equal(document.querySelector('dialog'), null);
    assert.deepEqual(app.data.getNodes().map(node => node.label), ['answer']);
    app.dispose();
});

test('string confirmation obeys _ask_if; cancel does not execute and runs _ask_onCancel', async () => {
    const {app, document} = page(root => root.dataController({subscribe_run: true,
        script: "this.SET('answer', id);", _ask: 'Proceed?', _ask_if: 'confirmNeeded',
        _ask_onCancel: "this.SET('cancelled', true);"}));
    app.publish('run', {id: 1, confirmNeeded: false});
    assert.equal(app.data.getItem('answer'), 1);
    assert.equal(document.querySelector('dialog'), null);
    app.publish('run', {id: 2, confirmNeeded: true});
    document.querySelector('dialog button').click();
    await settle();
    assert.equal(app.data.getItem('answer'), 1);
    assert.equal(app.data.getItem('cancelled'), true);
    app.dispose();
});

test('ask._if skips field collection and runs with existing arguments; legacy askIf false alone still asks', async () => {
    const {app, document, window} = page(root => {
        root.dataController({subscribe_run: true, script: "this.SET('answer', name);",
            _ask: {_if: 'askNow', fields: [{name: 'name'}]}});
        root.button('Go', {id: 'go', action: "this.SET('clicked', true);", ask: {askIf: 'false', msg: 'Confirm'}});
    });
    app.publish('run', {name: 'Ada', askNow: false});
    assert.equal(document.querySelector('dialog'), null);
    assert.equal(app.data.getItem('answer'), 'Ada');
    document.getElementById('go').click();
    assert.ok(document.querySelector('dialog'));
    confirm(document, window);
    await settle();
    assert.equal(app.data.getItem('clicked'), true);
    app.dispose();
});

test('button action gets collected arguments, while closing its owner cancels any later action', async () => {
    const {app, document, window} = page(root => root.button('Go', {id: 'go', node_id: 'go',
        action: "this.SET('answer', count);", count: 2,
        ask: {fields: [{name: 'count', type: 'number', lbl: 'Count'}]}}));
    document.getElementById('go').click();
    const input = document.querySelector('dialog input');
    input.value = '7'; input.dispatchEvent(new window.Event('input', {bubbles: true}));
    confirm(document, window); await settle();
    assert.equal(app.data.getItem('answer'), 7);
    document.getElementById('go').click();
    app.src.source.popNode('main'); await settle();
    assert.equal(document.querySelector('dialog'), null);
    assert.equal(app.data.getItem('answer'), 7);
    assert.ok(!app.data.getNodes().some(node => node.label.startsWith('ask_')));
    app.dispose();
});

test('unsupported legacy widgets fail explicitly without leaving a dialog or temporary Data', async () => {
    const {app, document} = page(root => root.dataController({node_id: 'work', script: "this.SET('bad', true);",
        _ask: {fields: [{name: 'x', tag: 'dbSelect'}]}}));
    const node = sourceTarget(app.src.builder.nodeById('work'));
    assert.throws(() => app.src.binding.bindingFor(node).providers[0].invoke({kind: 'subscription', topic: 'run', payload: {}}), /Unsupported ask widget/);
    assert.equal(document.querySelector('dialog'), null);
    assert.equal(app.data.getNodes().length, 0);
    app.dispose();
});

test('pending ask rereads authored references and rejects a removed target without executing', async () => {
    const {app, document, window} = page(root => {
        const target = root.div({node_id: 'target'});
        root.dataController({node_id: 'work', target, script: "this.SET('executed', true);", _ask: 'Proceed?'});
    });
    const node = sourceTarget(app.src.builder.nodeById('work'));
    const pending = app.src.binding.bindingFor(node).providers[0].invoke({kind: 'subscription', topic: 'run', payload: {}});
    app.src.source.getItem('main').popNode('div_0');
    confirm(document, window);
    await assert.rejects(pending, /Source reference is not mounted/);
    assert.equal(app.data.getItem('executed'), null);
    assert.equal(document.querySelector('dialog'), null);
    app.dispose();
});

test('button _delay groups clicks before ask and confirmation retains the group count', async t => {
    t.mock.timers.enable({apis: ['setTimeout']});
    const {app, document, window} = page(root => root.button('Delayed', {id: 'delayed', _delay: 300,
        action: "this.SET('answer', _counter);", ask: 'Proceed?'}));
    document.getElementById('delayed').click();
    t.mock.timers.tick(100);
    document.getElementById('delayed').click();
    t.mock.timers.tick(299);
    assert.equal(document.querySelector('dialog'), null);
    t.mock.timers.tick(1);
    assert.equal(document.querySelectorAll('dialog').length, 1);
    assert.equal(app.data.getItem('answer'), null);
    confirm(document, window);
    await Promise.resolve();
    assert.equal(app.data.getItem('answer'), 2);
    document.getElementById('delayed').click();
    t.mock.timers.tick(300);
    document.querySelector('dialog button').click();
    await Promise.resolve();
    assert.equal(app.data.getItem('answer'), 2);
    app.dispose();
});
