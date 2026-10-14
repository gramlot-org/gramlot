import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const coreRequire = createRequire(require.resolve('@gramlot/gramlot'));
const {BagResolver} = await import(coreRequire.resolve('@genrojs/bag'));
const {window} = new JSDOM('<main></main>');
Object.assign(globalThis, {HTMLElement: window.HTMLElement, customElements: window.customElements});
await import('../dist/gramlot-poc-tree.js');

function fixture() {
    const mount = window.document.createElement('main');
    window.document.body.append(mount);
    const app = new Gramlot({document:window.document, element:mount, transport:false});
    class Logic {
        selected(node, event) { app.data.setItem('selection', event.detail.path); }
        action(node, event) { app.data.setItem('action', `${event.detail.action}:${event.detail.path}`); }
    }
    app.src.logicRegistry.register(Logic, {group:'inspector', resource:'tree-test'});
    const builder = new GramlotBuilder();
    builder.root.div({node_label:'pane'}).webcomponent({code:'gramlot-poc-tree', node_label:'tree',
        connect_onchange:'inspector.selected', 'connect_ontree-action':'inspector.action'});
    app.src.startSource(builder.source);
    const tree = app.dom.getDomNode(app.src.source.getNode('main.pane.tree'));
    tree.storeBag = new Bag({main: new Bag({heading:'Hello', section:new Bag({count:42})})});
    return {app, tree, mount};
}
const row = (tree, path) => [...tree.shadowRoot.querySelectorAll('[data-node-path]')]
    .find(element => element.dataset.nodePath === path);
const count = bag => Object.keys(bag._updSubscribers).length + Object.keys(bag._insSubscribers).length
    + Object.keys(bag._delSubscribers).length;

test('tree preserves DevTools label-only rows and selection goes through named Gramlot Logic', () => {
    const {app,tree,mount} = fixture();
    assert.equal(row(tree,'main.heading').textContent, 'heading');
    row(tree,'main.heading').click();
    assert.equal(app.data.getItem('selection'),'main.heading');
    assert.equal(tree.selectedPath,'main.heading');
    assert.equal(tree.shadowRoot.querySelectorAll('.selected').length,1);
    row(tree,'main.section.count').click();
    assert.equal(app.data.getItem('selection'),'main.section.count');
    assert.equal(row(tree,'main.heading').classList.contains('selected'),false);
    app.dispose(); mount.remove();
});

test('live Bag changes retain open state and selection, deletion clears selection', async () => {
    const {app,tree,mount} = fixture();
    const details=tree.shadowRoot.querySelector('details');
    details.open=true;
    row(tree,'main.heading').click();
    tree.storeBag.setItem('main.added','New');
    await Promise.resolve();
    assert.ok(row(tree,'main.added'));
    assert.equal(tree.shadowRoot.querySelector('details').open,true);
    assert.equal(row(tree,'main.heading').classList.contains('selected'),true);
    tree.storeBag.popNode('main.heading');
    await Promise.resolve();
    assert.equal(tree.selectedPath,null);
    assert.equal(app.data.getItem('selection'),null);
    app.dispose(); mount.remove();
});

test('replacement, disconnect and reconnect release subscriptions and isolate instances', () => {
    const {app,tree,mount}=fixture();
    const old=tree.storeBag;
    assert.equal(count(old),3);
    const next=new Bag({other:1});
    tree.storeBag=next;
    assert.equal(count(old),0);
    assert.equal(count(next),3);
    tree.remove();
    assert.equal(count(next),0);
    mount.append(tree);
    assert.equal(count(next),3);
    const other=window.document.createElement('gramlot-poc-tree');
    other.storeBag=next; mount.append(other);
    assert.equal(count(next),6);
    other.remove();
    assert.equal(count(next),3);
    assert.throws(()=>{tree.storeBag={other:2};}, /requires a Bag/);
    assert.equal(tree.storeBag,next);
    tree.remove(); app.dispose(); mount.remove();
    assert.equal(count(next),0);
});

test('resolver values are never evaluated; row actions keep the selected row', () => {
    const {app,tree,mount}=fixture();
    let loads=0;
    class Resolver extends BagResolver {load(){loads++; return new Bag({hidden:'secret'});}}
    tree.storeBag.setItem('remote',new Resolver());
    tree.rowActions=[{id:'breakpoint',icon:'●',label:'Breakpoint'}];
    row(tree,'main.heading').click();
    row(tree,'remote').querySelector('button').click();
    assert.equal(app.data.getItem('action'),'breakpoint:remote');
    assert.equal(tree.selectedPath,'main.heading');
    assert.equal(loads,0);
    app.dispose(); mount.remove();
});

test('the same component inspects actual SourceBag nodes without copies', async () => {
    const {app,tree,mount}=fixture();
    tree.storeBag=app.src.source;
    row(tree,'main.pane.tree').click();
    assert.equal(app.data.getItem('selection'),'main.pane.tree');
    app.src.builder.wrapSource(app.src.source.getNode('main.pane')).div('new',{node_label:'extra'});
    await Promise.resolve();
    assert.ok(row(tree,'main.pane.extra'));
    tree.storeBag=null;
    app.dispose(); mount.remove();
});

test('a burst of snapshot changes renders once and cannot refresh a detached tree', async () => {
    const {app,tree,mount}=fixture();
    let renders=0;
    const render=tree._render.bind(tree);
    tree._render=()=>{renders++;render();};
    for(let i=0;i<300;i++)tree.storeBag.setItem(`main.item_${i}`,i);
    await Promise.resolve();
    assert.equal(renders,1);
    assert.ok(row(tree,'main.item_299'));
    tree.storeBag.setItem('main.last','last');
    tree.remove();
    await Promise.resolve();
    assert.equal(renders,1);
    app.dispose();mount.remove();
});
