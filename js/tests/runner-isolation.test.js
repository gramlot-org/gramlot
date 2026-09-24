import assert from 'node:assert/strict';
import test from 'node:test';
import {JSDOM} from 'jsdom';
import {GramlotBuilder} from '../src/builder/gramlot-builder.js';
import {Gramlot} from '../src/gramlot.js';

test('core renders former runner markers as ordinary HTML attributes', () => {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    const builder = new GramlotBuilder();
    const root = builder.root.div({id: 'plain', data_gramlot_tabs: 'intro', data_gramlot_theme: 'dark'});
    root.div('# Heading', {data_gramlot_markdown: true});
    root.pre().code('function demo() {}', {data_gramlot_highlight: true});
    root.div({data_gramlot_split: 65});
    const app = new Gramlot({document, transport: false}).startSource(builder.source);
    assert.equal(document.querySelector('h1, .hljs-keyword'), null);
    assert.match(document.getElementById('plain').textContent, /# Heading/);
    assert.equal(document.documentElement.hasAttribute('data-theme'), false);
    app.dispose();
});

test('core has no runner theme protocol in framed pages', () => {
    const parent = new JSDOM('<iframe></iframe>').window;
    const frame = parent.document.querySelector('iframe').contentWindow;
    frame.document.body.innerHTML = '<main id="gramlot-root"></main>';
    const messages = [];
    parent.postMessage = (...args) => messages.push(args);
    const app = new Gramlot({document: frame.document, transport: false});
    for (const type of ['gramlot:theme-set', 'runner:theme-set']) {
        frame.dispatchEvent(new frame.MessageEvent('message', {source: parent, data: {type, theme: 'dark'}}));
    }
    assert.deepEqual(messages, []);
    assert.equal(frame.document.documentElement.hasAttribute('data-theme'), false);
    app.dispose();
});
