// An iframe srcdoc from Data gets an empty sandbox in the live DOM, written before srcdoc: the browser
// reads sandbox when srcdoc starts a navigation. The string rule is in style-shortcuts.test.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot} from '../src/index.js';
import {mount} from './fixtures/mount.js';

function page() {
    const window = new JSDOM('<main></main>').window;
    const document = window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport: false});
    return {window, app, data: app.data, frame: () => document.getElementById('frame')};
}

/** The names of the attributes written on `element` during `run`, in order. */
function written(window, element, run) {
    const observer = new window.MutationObserver(() => {});
    observer.observe(element, {attributes: true});
    run();
    const names = observer.takeRecords().map(record => record.attributeName);
    observer.disconnect();
    return names;
}

test('a Data change of srcdoc keeps the sandbox and writes only srcdoc', () => {
    const {window, app, data, frame} = page();
    data.setItem('doc', '<script>run()</script>');
    mount(app, root => root.iframe({id: 'frame', srcdoc: '^doc'}));
    assert.equal(frame().getAttribute('sandbox'), '');
    assert.equal(frame().getAttribute('srcdoc'), '<script>run()</script>');
    assert.deepEqual(written(window, frame(), () => data.setItem('doc', '<b>two</b>')), ['srcdoc']);
    assert.equal(frame().getAttribute('sandbox'), '');
    assert.equal(frame().getAttribute('srcdoc'), '<b>two</b>');
    app.dispose();
});

test('the iframe has its sandbox while srcdoc is still null', () => {
    const {app, data, frame} = page();
    mount(app, root => root.iframe({id: 'frame', srcdoc: '^doc'}));
    assert.equal(frame().getAttribute('sandbox'), '');
    assert.equal(frame().hasAttribute('srcdoc'), false);
    data.setItem('doc', '<p>late</p>');
    assert.equal(frame().getAttribute('sandbox'), '');
    assert.equal(frame().getAttribute('srcdoc'), '<p>late</p>');
    app.dispose();
});

test('a Source change from a literal srcdoc to Data writes sandbox before srcdoc, and back removes it first', () => {
    const {window, app, data, frame} = page();
    data.setItem('doc', '<script>run()</script>');
    const node = sourceTarget(mount(app, root => root.iframe({id: 'frame', srcdoc: '<p>lit</p>'})));
    assert.equal(frame().hasAttribute('sandbox'), false);
    assert.deepEqual(written(window, frame(), () => node.setAttr({srcdoc: '^doc'})), ['sandbox', 'srcdoc']);
    assert.equal(frame().getAttribute('sandbox'), '');
    assert.deepEqual(written(window, frame(), () => node.setAttr({srcdoc: '<p>again</p>'})), ['sandbox', 'srcdoc']);
    assert.equal(frame().hasAttribute('sandbox'), false);
    app.dispose();
});

test('a declared sandbox stays as declared, is written before srcdoc, and its removal brings the empty sandbox', () => {
    const {window, app, data, frame} = page();
    data.setItem('doc', 'one');
    data.setItem('other', 'two');
    const node = sourceTarget(mount(app, root => root.iframe({id: 'frame', srcdoc: '^doc', sandbox: 'allow-scripts'})));
    assert.equal(frame().getAttribute('sandbox'), 'allow-scripts');
    assert.deepEqual(written(window, frame(), () => node.setAttr({srcdoc: '^other', sandbox: 'allow-forms'})),
        ['sandbox', 'srcdoc']);
    assert.equal(frame().getAttribute('sandbox'), 'allow-forms');
    node.setAttr({sandbox: null});
    assert.equal(frame().getAttribute('sandbox'), '');
    assert.equal(frame().getAttribute('srcdoc'), 'two');
    app.dispose();
});

test('a literal srcdoc gets no sandbox', () => {
    const {app, frame} = page();
    mount(app, root => root.iframe({id: 'frame', srcdoc: '<p>lit</p>'}));
    assert.equal(frame().hasAttribute('sandbox'), false);
    app.dispose();
});
