import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {readFileSync} from 'node:fs';

test('Python and JS ship identical webcomponent grammar', () => {
    assert.equal(readFileSync(new URL('../src/builder/webcomponent.json', import.meta.url), 'utf8'),
        readFileSync(new URL('../../src/gramlot/collections/webcomponent.json', import.meta.url), 'utf8'));
});

test('static and live rendering use code as a tag, and existing binding and events work', () => {
    const {window} = new JSDOM('<main></main>');
    class Tree extends window.HTMLElement {}
    window.customElements.define('gramlot-poc-tree', Tree);
    const app = new Gramlot({document: window.document, element: window.document.querySelector('main'), transport: false});
    class Logic { selected(node, event) { app.data.setItem('selection', event.detail.path); } }
    app.src.logicRegistry.register(Logic, {group: 'inspector', resource: 'test'});
    const builder = new GramlotBuilder();
    const node = builder.root.div({node_label:'pane'}).webcomponent({code:'gramlot-poc-tree',
        node_label:'tree', id:'tree', title:'^caption', connect_onchange:'inspector.selected'});
    node.span('Fallback <text>');
    assert.match(builder.render(), /<gramlot-poc-tree[^>]*><span>Fallback &lt;text&gt;<\/span><\/gramlot-poc-tree>/);
    app.data.setItem('caption', 'Tree');
    app.src.startSource(builder.source);
    const tree = window.document.querySelector('#tree');
    assert.ok(tree instanceof Tree);
    assert.equal(tree.title, 'Tree');
    assert.equal(tree.hasAttribute('code'), false);
    assert.equal(tree.hasAttribute('connect_onchange'), false);
    app.data.setItem('caption', 'Updated');
    assert.equal(tree.title, 'Updated');
    tree.dispatchEvent(new window.CustomEvent('change', {detail:{path:'a.b'}}));
    assert.equal(app.data.getItem('selection'), 'a.b');
    app.src.source.popNode('main.pane');
    tree.dispatchEvent(new window.CustomEvent('change', {detail:{path:'removed'}}));
    assert.equal(app.data.getItem('selection'), 'a.b');
    app.dispose();
});

test('code is a required literal tag, not a pointer, expression or markup', () => {
    for (const code of [undefined, null, 42, '', 'div', 'Tree-node', 'tree-x\n', '^tree-code',
        '=tree-code', '==tree-code', 'x-tree><script>', 'font-face', 'x-tree onclick="bad"']) {
        const builder = new GramlotBuilder();
        assert.throws(() => builder.root.webcomponent({code}), /literal|code/);
        assert.equal(builder.source.getNodes().length, 0);
    }
    assert.throws(() => new GramlotBuilder().root.ul().div(), /not allowed/);
});
