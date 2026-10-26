import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder, IndexPage, IndexLogic, Bag} from '../src/index.js';
import layout from '../src/components/layout.js';
import tree from '../src/components/tree.js';

const settle = () => new Promise(resolve => setImmediate(resolve));
const collections = [layout, tree];

function source(language) {
    if (language === 'Python') return execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', `
import json
from pathlib import Path
from gramlot import GramlotBuilder, IndexPage
from genro_bag import Bag
b = GramlotBuilder(collections=[json.loads(Path(f'src/gramlot/collections/{name}.json').read_text()) for name in ['layout','tree']])
tabs = b.root.tabContainer(node_label='indexes', datapath='workbench', height='600px')
for name in ('one', 'two'):
    pane = tabs.contentPane(node_label=name, title=name, pageName=name, detachable=True)
    page = IndexPage()
    page.shell_id = f'index-{name}'
    page.datapath = f'.{name}'
    page.navigation = Bag()
    page.navigation.set_item('hello', None, url='/hello', title='Hello')
    page.main(pane)
print(b.to_tytx())
`], {cwd:fileURLToPath(new URL('../..', import.meta.url)), encoding:'utf8'}).trim();
    const builder = new GramlotBuilder(null, {collections});
    const tabs = builder.root.tabContainer({node_label:'indexes', datapath:'workbench', height:'600px'});
    for (const name of ['one', 'two']) {
        const pane = tabs.contentPane({node_label:name, title:name, pageName:name, detachable:true});
        class App extends IndexPage {
            static shellId = `index-${name}`;
            static datapath = `.${name}`;
            static navigation = new Bag();
        }
        App.navigation.setItem('hello', null, {url:'/hello', title:'Hello'});
        new App().main(pane);
    }
    return builder.source;
}

for (const language of ['Python', 'JavaScript']) test(`${language} IndexPages own their coordination in Source with relative Data and shared stateless Logic`, async t => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {url:'https://index.test/', pretendToBeVisual:true});
    window.ResizeObserver = class {observe(){}unobserve(){}disconnect(){}};
    window.HTMLDialogElement.prototype.show = function(){this.open = true;};
    window.HTMLDialogElement.prototype.close = function(){this.open = false;};
    window.HTMLElement.prototype.showPopover = function(){};
    const requests = [];
    const transport = {close:async()=>{}, dispose(){}, call(text) {
        const request = fromTytx(text);
        assert.equal(request.name, 'index_panel');
        return new Promise(resolve => requests.push({finish(){
            const fragment = new GramlotBuilder();
            new IndexPage().index_panel(fragment.root, request.params);
            resolve(toTytx({id:request.id, contentType:request.contentType, value:fragment.toTytx()}));
        }}));
    }};
    const app = new Gramlot({document:window.document, transport, collections});
    t.after(()=>{app.dispose();window.close();});
    app.src.logicRegistry.register(IndexLogic, {resource:'test:index-ownership'});
    const logicKeys = Reflect.ownKeys(app.logic);
    app.src.startSource(source(language));
    const renderer = app.src.renderer;
    const outer = app.src.source.getNode('main.indexes');
    const firstPanel = outer.value.getNode('one');
    const one = renderer.elements.get(window.document.getElementById('index-one')).node;
    const two = renderer.elements.get(window.document.getElementById('index-two')).node;
    const first = one.getRelativeData('.'), second = two.getRelativeData('.');
    const firstContext = one.indexContext, secondContext = two.indexContext;
    assert.equal(first, app.data.getItem('workbench.one'));
    assert.equal(second, app.data.getItem('workbench.two'));
    assert.notEqual(firstContext, secondContext);
    assert.deepEqual(Reflect.ownKeys(app.logic), logicKeys, 'mounting does not put state or references on Logic');
    assert.equal(Object.getOwnPropertyDescriptor(one, 'indexContext').enumerable, false);
    assert.equal(one.getAttr('indexContext'), null, 'runtime attachment is not a serialized Source attribute');
    assert.equal(one.value.getNode('frame.left.tree').getAttr('storepath'), '.navigation');
    first.setItem('navigationSelection', 'hello');
    second.setItem('navigationSelection', 'hello');
    assert.equal(requests.length, 2, 'same URL belongs to separate parent indexes');
    requests[1].finish(); await settle(); requests[0].finish(); await settle();
    assert.equal(first.getItem('active'), '/hello');
    assert.equal(second.getItem('active'), '/hello');
    for (const owner of [one, two]) {
        const tabs = renderer.records.get(owner.value.getNode('frame.center.tabs')).element;
        assert.equal(tabs.shadowRoot.querySelector('[role=tab][aria-selected=true]').textContent, 'Hello',
            'tab selection binds to its own relative Data');
    }
    const firstEntry = firstContext.entries.get('/hello'), secondEntry = secondContext.entries.get('/hello');
    assert.notEqual(firstEntry.pane, secondEntry.pane);
    assert.equal(first.getItem('opened').length, 1);
    assert.equal(second.getItem('opened').length, 1);
    const iframe = renderer.records.get(firstEntry.pane).element.querySelector('iframe');
    const otherIframe = renderer.records.get(secondEntry.pane).element.querySelector('iframe');
    assert.notEqual(iframe, otherIframe);
    const tabs = renderer.records.get(outer).element;
    tabs.shadowRoot.querySelector('[aria-label="Detach one"]').click(); await settle();
    assert.ok(tabs.shadowRoot.querySelector('dialog[open]'));
    assert.equal(outer.value.getNode('one'), firstPanel);
    assert.equal(one.parentNode, firstPanel);
    assert.equal(one.indexContext, firstContext);
    assert.equal(one.getRelativeData('.'), first);
    assert.equal(renderer.records.get(firstEntry.pane).element.querySelector('iframe'), iframe);
    tabs.shadowRoot.querySelector('[aria-label="Close window"]').click(); await settle();
    assert.equal(one.indexContext, firstContext);
    assert.equal(renderer.records.get(firstEntry.pane).element.querySelector('iframe'), iframe);
    firstEntry.pane.parentBag.popNode(firstEntry.pane.label);
    assert.equal(first.getItem('active'), null);
    assert.equal(second.getItem('active'), '/hello');
    first.setItem('navigationSelection', 'hello');
    assert.equal(requests.length, 3);
    firstPanel.parentBag.popNode(firstPanel.label);
    assert.equal(one.indexContext, undefined);
    assert.equal(firstContext.disposed, true);
    assert.equal(firstContext.entries.size, 0);
    requests[2].finish(); await settle();
    assert.equal(firstContext.entries.size, 0, 'late completion cannot revive removed Source');
    assert.equal(two.indexContext, secondContext);
    assert.equal(second.getItem('active'), '/hello');
    assert.equal(renderer.records.get(secondEntry.pane).element.querySelector('iframe'), otherIframe);
    assert.deepEqual(Reflect.ownKeys(app.logic), logicKeys);
});
