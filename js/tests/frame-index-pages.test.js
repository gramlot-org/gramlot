import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, Bag, FramePage, IndexPage, IndexLogic, mountIndexPage} from '../src/index.js';
import {fromTytx, toTytx} from '@genrojs/tytx';
import layout from '../src/components/layout.js';
import tree from '../src/components/tree.js';
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

test('FramePage creates only implemented regions, including inherited hooks', () => {
    class Base extends FramePage { top(pane) { pane.p('Title'); } }
    class App extends Base { right(pane) { pane.setAttr({drawer: 'close', width: '220px'}); pane.p('Tools'); } }
    const b = new GramlotBuilder(null, {collections: [layout]});
    new App().main(b.root);
    const shell = b.source.getNodes()[0];
    const regions = shell.value.getNode('frame').value.getNodes();
    assert.deepEqual(regions.map(n => n.getAttr('region')), ['top', 'right', 'center']);
    assert.equal(regions[1].getAttr('drawer'), 'close');
});

function fixture(t, createEntry) {
    const window = new JSDOM('<main id="gramlot-root"></main>', {url:'https://index.test/'}).window;
    window.ResizeObserver = class { observe() {} disconnect() {} unobserve() {} };
    window.HTMLElement.prototype.showPopover = function() {};
    const nav = new Bag();
    nav.setItem('folder', new Bag());
    nav.setItem('one', null, {url: '/one', title: 'One'});
    nav.setItem('alias', null, {url: '/one', title: 'Alias'});
    nav.setItem('two', null, {url: '/two', title: 'Two'});
    class App extends IndexPage { static navigation = nav; behavior() {} }
    const b = new GramlotBuilder(null, {collections: [layout, tree]}); new App().main(b.root);
    const app = new Gramlot({document: window.document, transport: false, collections: [layout, tree]});
    app.src.startSource(b.source);
    const renderer = app.src.renderer;
    const root = renderer.elements.get(window.document.getElementById('index')).node;
    const state = app.data.getItem('index');
    const mount = () => mountIndexPage(renderer, root, () => {}, () => {}, {createEntry});
    const behavior = mount();
    t.after(() => {app.dispose(); window.close();});
    return {app, state, root, behavior, mount, window};
}

test('URL identity retains a single panel; folder without URL does not open a tab', async t => {
    let calls = 0;
    const f = fixture(t, async entry => { calls++; entry.pane.builder.wrapSource(entry.pane).div({node_label:'content'}).input({value:'^draft'}); });
    f.state.setItem('navigationSelection', 'folder'); await settle(); assert.equal(calls, 0);
    f.state.setItem('navigationSelection', 'one'); await settle();
    const pane = f.behavior.entries.get('/one').pane;
    f.app.data.setItem('draft', 'Saved');
    f.state.setItem('navigationSelection', 'two'); await settle();
    f.state.setItem('navigationSelection', 'alias'); await settle();
    assert.equal(calls, 2); assert.equal(f.state.getItem('active'), '/one');
    assert.equal(f.behavior.entries.get('/one').pane, pane);
    assert.equal(f.app.data.getItem('draft'), 'Saved');
    f.state.setItem('active', '/two'); assert.equal(f.state.getItem('navigationSelection'), 'two');
    f.behavior.dispose(); const next = f.mount();
    assert.equal(next.entries.size, 2); assert.equal(calls, 2); next.dispose();
});

test('pending selection, failed retry and disposal retain Source lifecycle ownership', async t => {
    const gates = new Map(); let fail = true;
    const f = fixture(t, entry => new Promise((resolve, reject) => gates.set(entry.url, () => {
        if (entry.url === '/one' && fail) { fail = false; reject(new Error('Retry')); }
        else { entry.pane.builder.wrapSource(entry.pane).p(entry.url); resolve(); }
    })));
    f.state.setItem('navigationSelection','one'); f.state.setItem('navigationSelection','two');
    gates.get('/two')(); await settle(); gates.get('/one')(); await settle();
    assert.equal(f.state.getItem('active'), '/two'); assert.equal(f.behavior.entries.size, 1);
    f.state.setItem('navigationSelection', 'one'); gates.get('/one')(); await settle();
    assert.equal(f.state.getItem('active'), '/one');
    f.behavior.dispose(); f.state.setItem('navigationSelection','two');
    assert.equal(f.state.getItem('active'), '/one');
});

test('ordinary IndexLogic opens the panel hook through Source RPC without gallery controls', async t => {
    const window = new JSDOM('<main id="gramlot-root"></main>', {url:'https://index.test/'}).window;
    window.ResizeObserver = class {observe() {} disconnect() {} unobserve() {}};
    const navigation = new Bag();
    navigation.setItem('hello', null, {title:'Hello', url:'/hello'});
    navigation.setItem('again', null, {title:'Same page', url:'/hello'});
    class App extends IndexPage {static navigation = navigation;}
    const calls = [];
    const transport = {async close() {}, dispose() {}, async call(text) {
        const {id, contentType, name, params} = fromTytx(text);
        calls.push(name);
        assert.equal(name, 'index_panel');
        assert.ok(params.selection instanceof Bag);
        const fragment = new GramlotBuilder();
        new App().index_panel(fragment.root, params);
        return toTytx({id, contentType, value:fragment.toTytx()});
    }};
    const app = new Gramlot({document:window.document, transport, collections:[layout, tree]});
    t.after(()=>{app.dispose();window.close();});
    app.src.logicRegistry.register(IndexLogic, {resource:'/index_aux.js'});
    const builder = new GramlotBuilder(null, {collections:[layout, tree]});
    new App().main(builder.root);
    app.src.startSource(builder.source);
    const state = app.data.getItem('index');
    state.setItem('navigationSelection','hello'); await settle();
    const iframe = window.document.querySelector('iframe');
    assert.equal(iframe.getAttribute('src'), '/hello');
    state.setItem('navigationSelection','again'); await settle();
    assert.deepEqual(calls, ['index_panel']);
    assert.equal(window.document.querySelector('iframe'), iframe);
    assert.equal(state.getItem('active'), '/hello');
});
