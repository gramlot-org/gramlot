import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {readFile} from 'node:fs/promises';
import {Bag, BagResolver} from '@genrojs/bag';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {TreeStore, TreeStoreLogic, TreeStoreResolver} from '../src/tree-store.js';
import tree, {Tree} from '../src/components/tree.js';
import {defineCollection, defineComponent} from '../src/components/registry.js';

const tick = () => new Promise(resolve => queueMicrotask(resolve));
const settle = () => new Promise(resolve => setTimeout(resolve, 0));
function dragEventPath(f, element) {
    let path;
    f.host.addEventListener('drag-context-test', event => { path = event.composedPath(); }, {once: true});
    element.dispatchEvent(new f.window.Event('drag-context-test', {bubbles: true, composed: true}));
    return {composedPath: () => path};
}
function dropContext(f, path = 'other', dropValues = {'text/plain': 'Received'}) {
    return {dropValues, item: f.store.getNode(path), path,
        source: Object.freeze({}), selfdrop: false, dropEffect: 'copy', dataAvailable: true};
}
function transfer() {
    const values = new Map();
    return {values, effectAllowed: 'all', dropEffect: 'none', image: null,
        clearData() { values.clear(); }, setData(type, value) { values.set(type, value); },
        getData(type) { return values.get(type) ?? ''; }, setDragImage(image) { this.image = image; }};
}
function nativeDrag(f, type, path, dataTransfer, clientY = 0) {
    const event = new f.window.Event(type, {bubbles: true, composed: true, cancelable: true});
    Object.defineProperty(event, 'dataTransfer', {value: dataTransfer});
    Object.defineProperty(event, 'clientY', {value: clientY});
    (path === null ? f.host : f.row(path).querySelector('.row')).dispatchEvent(event);
    return event;
}
function fixture(t, {collection = tree, tag = 'tree', two = false, attrs = {}, logic = null, actions = null, barAttrs = {}, initialChecked = null, initialPaths = null, prepare = null} = {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.HTMLElement.prototype.showPopover = function () {};
    const app = new Gramlot({document: window.document, transport: false, collections: [collection]});
    const children = new Bag({alpha: 'A', beta: 'B'});
    const store = new Bag({folder: children, other: 'C'});
    store.getNode('folder').setAttr({caption: 'Folder'});
    if (initialChecked !== null) store.getNode('other').setAttr({checked: initialChecked});
    if (prepare) prepare(store);
    app.data.setItem('model.nodes', store);
    app.data.setItem('model.selection', null);
    app.data.setItem('model.checked', initialPaths);
    app.data.setItem('model.search', '');
    app.data.setItem('model.favorites', new Bag());
    const b = new GramlotBuilder(null, {collections: [collection]});
    const pane = b.root.div({datapath: 'model', node_label: 'pane'});
    const treeNode = pane[tag]({id: 'tree', node_label: 'tree', storepath: '.nodes',
        labelAttribute: 'caption', hideValues: true, selectedPath: '^.selection', ...attrs});
    if (actions) actions(treeNode.rowActions({position: 'end', ...barAttrs}));
    if (two) pane[tag]({id: 'second', node_label: 'second', storepath: '.nodes', hideValues: true, selectedPath: '^.otherSelection'});
    if (logic) app.src.logicRegistry.register(logic, {group: null, resource: '/tree-test.js'});
    app.src.startSource(b.toTytx());
    t.after(() => {app.dispose(); window.close();});
    const host = window.document.getElementById('tree');
    return {window, app, store, host, source: app.src.source.getNode('main.pane.tree'),
        row: path => [...host.shadowRoot.querySelectorAll('[role=treeitem]')].find(row => row.dataset.path === path)};
}

test('row action presentation follows the focused row and reactive state', async t => {
    class Logic {
        presentation(node, {item, state}) {
            return {hidden: item.staticValue instanceof Bag, icon: state.getItem('saved') ? '♥' : '♡',
                title: state.getItem('saved') ? 'Remove favorite' : 'Add favorite'};
        }
    }
    const f = fixture(t, {logic: Logic, barAttrs: {actionState: 'presentation', state: '^.favorites'}, actions: bar => {
        bar.button({id: 'favorite-action', rowAction: 'favorite'}).dataController({func: 'presentation'});
        bar.button({id: 'inspect-action', icon: 'i'});
    }});
    await tick();
    const button = f.window.document.getElementById('favorite-action');
    const inspect = f.window.document.getElementById('inspect-action');
    f.row('folder').focus();
    assert.equal(button.hidden, true);
    assert.equal(inspect.hidden, false);
    f.row('other').focus();
    assert.equal(button.hidden, false);
    assert.equal(button.icon.textContent, '♡');
    assert.equal(button.control.getAttribute('aria-label'), 'Add favorite');
    const favorites = new Bag(); favorites.setItem('saved', true);
    f.app.data.setItem('model.favorites', favorites); await tick();
    assert.equal(button.icon.textContent, '♥');
    assert.equal(button.control.getAttribute('aria-label'), 'Remove favorite');
});

test('tree drop reports before, inside and after relative to the destination row', async t => {
    const placements = [];
    class Logic { receive(source, {placement}) { placements.push(placement); } }
    const f = fixture(t, {attrs: {draggable:true, dropTarget:true, dropTypes:'treenode', onDrop:'receive'}, logic:Logic});
    await tick();
    f.row('other').querySelector('.row').getBoundingClientRect = () => ({top:100, height:40});
    for (const y of [105, 120, 135]) {
        const data = transfer();
        nativeDrag(f, 'dragstart', 'folder', data);
        nativeDrag(f, 'dragover', 'other', data, y);
        nativeDrag(f, 'drop', 'other', data, y);
        await settle();
        nativeDrag(f, 'dragend', 'folder', data);
        await settle();
    }
    assert.deepEqual(placements, ['before', 'inside', 'after']);
});

test('a Source-linked external tree observes the original Bag and releases it on replacement and removal', async t => {
    const f = fixture(t); await tick();
    const owner = new Bag();
    const first = new Bag({first:'Ada'}), second = new Bag({second:'Grace'});
    const count = bag => Object.keys(bag._updSubscribers).length + Object.keys(bag._insSubscribers).length + Object.keys(bag._delSubscribers).length;
    owner.setItem('first', first); owner.setItem('second', second);
    const parent = first.parentNode;
    f.source.setTreeStore(first);
    assert.equal(count(first), 3);
    await tick();
    assert.equal(first.parentNode, parent);
    assert.ok(f.row('first'));
    first.setItem('added', 'New'); await tick();
    assert.ok(f.row('added'));
    f.source.setTreeStore(second); await tick();
    assert.equal(count(first), 0);
    assert.equal(count(second), 3);
    assert.equal(first.parentNode, parent);
    assert.ok(f.row('second'));
    first.setItem('stale', 'Old'); await tick();
    assert.equal(f.row('stale'), undefined);
    second.setItem('live', 'New'); await tick();
    assert.ok(f.row('live'));
    const domParent = f.host.parentNode;
    f.host.remove();
    second.setItem('whileDetached', 'Still live');
    domParent.append(f.host); await tick();
    assert.ok(f.row('whileDetached'));
    assert.equal(f.host.storeBag, second);
    f.source.parentBag.popNode(f.source.label);
    assert.equal(count(second), 0);
    second.setItem('afterRemoval', 'Safe'); await tick();
    assert.equal(f.window.document.getElementById('tree'), null);
});

test('external SourceBag nodes remain live and update the shared tree without copying', async t => {
    const f = fixture(t); await tick();
    const source = f.app.src.source;
    f.source.setTreeStore(source); await tick();
    assert.equal(f.host.storeBag, source);
    assert.ok(f.row('main.pane.tree'));
    f.app.src.builder.wrapSource(source.getNode('main.pane')).div('New', {node_label:'extra'});
    await tick();
    assert.ok(f.row('main.pane.extra'));
});

test('a burst of external Bag writes batches rendering and detachment cancels pending work', async t => {
    const f = fixture(t); await tick();
    const store = new Bag(); f.source.setTreeStore(store); await tick();
    let changes = 0;
    const observer = new f.window.MutationObserver(records => { changes += records.filter(record => record.type === 'childList').length; });
    observer.observe(f.host.control, {childList:true});
    for (let index = 0; index < 100; index++) store.setItem(`item_${index}`, index);
    await tick(); await tick();
    assert.equal(changes, 1);
    assert.ok(f.row('item_99'));
    store.setItem('after', 'last');
    f.source.parentBag.popNode(f.source.label); await tick(); await tick();
    assert.equal(changes, 1);
    observer.disconnect();
});

test('a tree can inspect resolver nodes without loading or traversing them', async t => {
    let calls = 0;
    class Deferred extends BagResolver { load() { calls++; return new Bag({child:'value'}); } }
    const f = fixture(t, {attrs:{resolveLazy:false, searchText:'^.search'}});
    f.store.setItem('deferred', new Deferred({cacheTime:-1})); await settle();
    const row = f.row('deferred');
    assert.equal(row.querySelector('.expander'), null);
    f.app.data.setItem('model.search', 'child');
    await new Promise(resolve => setTimeout(resolve, 250));
    assert.equal(calls, 0);
    assert.equal(f.row('deferred.child'), undefined);
});

test('reselecting a favorite retries a failed lazy path', async t => {
    let attempts = 0;
    class Section extends BagResolver {
        load() { if (++attempts === 1) return Promise.reject(new Error('Try again')); return new Bag({child: 1}); }
    }
    const f = fixture(t, {attrs: {favorites: '^.favorites'}}); await tick();
    f.store.setItem('lazy', new Section({cacheTime: -1}));
    const favorites = new Bag();
    favorites.setItem('one', null, {favoriteEntry: true, originalPath: 'lazy.child', fullcaption: 'Lazy child'});
    f.app.data.setItem('model.favorites', favorites); await settle();
    f.host.shadowRoot.querySelector('[data-favorites-group] button').click();
    f.host.shadowRoot.querySelector('[data-favorite-path] .row').click(); await settle(); await settle();
    assert.equal(attempts, 1);
    assert.ok(f.row('lazy').classList.contains('error'));
    f.host.shadowRoot.querySelector('[data-favorite-path] .row').click(); await settle(); await settle();
    assert.equal(attempts, 2);
    assert.equal(f.row('lazy.child').getAttribute('aria-selected'), 'true');
});

test('favorites are an expandable group in the same tree and select their original path', async t => {
    const f = fixture(t, {attrs: {favorites: '^.favorites', checkedPaths: '^.checked', internalNames: '^.internalNames'}}); await tick();
    const favorites = new Bag();
    favorites.setItem('one', null, {favoriteEntry: true, originalPath: 'folder.alpha',
        fieldpath: 'folder.alpha', fullcaption: 'Folder.Alpha', badge: 'T'});
    f.app.data.setItem('model.favorites', favorites); await settle();
    f.store.getNode('other').setAttr({fieldpath: 'other', caption: 'Descriptive name'}); await settle();
    const group = f.host.shadowRoot.querySelector('[data-favorites-group]');
    assert.ok(group);
    assert.equal(f.window.document.querySelectorAll('gramlot-tree').length, 1);
    assert.equal(group.getAttribute('aria-expanded'), 'false');
    group.querySelector('button').click();
    const favorite = group.querySelector('[data-favorite-path]');
    assert.equal(favorite.querySelector('.caption').textContent, 'Folder.Alpha');
    assert.equal(favorite.querySelector('.badge').textContent, 'T');
    favorite.querySelector('.row').click(); await settle();
    assert.equal(f.app.data.getItem('model.selection'), 'folder.alpha');
    assert.equal(f.row('folder.alpha').getAttribute('aria-selected'), 'true');
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'true');
    f.app.data.setItem('model.internalNames', true); await settle();
    assert.equal(f.host.shadowRoot.querySelector('[data-favorite-path] .caption').textContent, 'folder.alpha');
    assert.equal(f.row('other').querySelector('.caption').textContent, 'other');
    f.app.data.setItem('model.internalNames', false); await settle();
    assert.equal(f.host.shadowRoot.querySelector('[data-favorite-path] .caption').textContent, 'Folder.Alpha');
    assert.equal(f.row('other').querySelector('.caption').textContent, 'Descriptive name');
    assert.equal(f.app.data.getItem('model.checked'), null);
    f.app.data.setItem('model.favorites', new Bag()); await settle();
    assert.equal(f.host.shadowRoot.querySelector('[data-favorites-group]'), null);
});

test('a shared Source rowActions bar invokes a controller with row context without selecting', async t => {
    const calls = [];
    class Logic { inspect(source, args) { calls.push({source, args}); } }
    const f = fixture(t, {logic: Logic, actions: bar => bar.button({id: 'inspect', icon: 'i'}).dataController({func: 'inspect'})});
    await tick();
    const bar = f.host.querySelector('gramlot-row-actions');
    assert.ok(bar);
    f.row('folder').querySelector('.row').dispatchEvent(new f.window.Event('pointerenter'));
    assert.equal(bar.hidden, false);
    f.window.document.getElementById('inspect').shadowRoot.querySelector('button').click();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].args.item, f.store.getNode('folder'));
    assert.equal(calls[0].args.path, 'folder');
    assert.equal(calls[0].args.event.type, 'click');
    assert.equal(f.app.data.getItem('model.selection'), null);
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'false');
    f.store.popNode('folder'); await tick();
    assert.equal(bar.hidden, true);
    assert.equal(bar.getRowContext(), null);
});

test('rowActions reads its row item by tree path at each use', async t => {
    const calls = [];
    class Logic { inspect(source, args) { calls.push(args); } }
    const f = fixture(t, {logic: Logic, actions: bar => bar.button({id: 'inspect-path', action: 'inspect'})});
    await tick();
    const bar = f.host.querySelector('gramlot-row-actions');
    f.row('other').querySelector('.row').dispatchEvent(new f.window.Event('pointerenter'));
    const previous = f.store.getNode('other');
    // The node at the hovered path is replaced by a new node before the tree draws again.
    f.store.popNode('other'); f.store.setItem('other', 'D', {caption: 'Replaced'}); await tick();
    assert.notEqual(f.store.getNode('other'), previous);
    assert.equal(bar.hidden, false);
    assert.equal(bar.getRowContext().item, f.store.getNode('other'));
    f.window.document.getElementById('inspect-path').shadowRoot.querySelector('button').click();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].item.getAttr('caption'), 'Replaced');
    assert.equal(calls[0].path, 'other');
});

test('rowActions uses focused row context for a named action', async t => {
    const calls = [];
    class Logic { inspect(source, args) { calls.push(args); } }
    const f = fixture(t, {logic: Logic, actions: bar => bar.button({id: 'inspect-action', action: 'inspect'})});
    await tick();
    f.row('other').focus();
    const bar = f.host.querySelector('gramlot-row-actions');
    assert.equal(bar.hidden, false);
    f.window.document.getElementById('inspect-action').shadowRoot.querySelector('button').click();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].item, f.store.getNode('other'));
    assert.equal(calls[0].path, 'other');
    assert.equal(calls[0].event.type, 'click');
    assert.equal(f.app.data.getItem('model.selection'), null);
});

test('rowActions menu commands retain the current row context', async t => {
    const calls = [];
    class Logic { inspect(source, args) { calls.push(args); } }
    const f = fixture(t, {logic: Logic, actions: bar => {
        bar.dropDownButton({id: 'row-menu'}).menu().menuline({caption: 'Inspect', id: 'row-menu-item', code: 'inspect'})
            .dataController({func: 'inspect'});
    }});
    await tick();
    f.row('other').focus();
    f.window.document.getElementById('row-menu-item').shadowRoot.querySelector('button').click();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].item, f.store.getNode('other'));
    assert.equal(calls[0].path, 'other');
});

test('tree inspector shows row attributes and cleans up when closed or its Source is removed', async t => {
    const f = fixture(t, {logic: TreeStoreLogic, actions: bar =>
        bar.button({id: 'inspect-attributes', icon: 'i'}).dataController({func: 'treeInspect'})});
    f.window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    await tick();
    const logic = f.app.logic;
    const logicKeys = Object.keys(logic);
    f.app.data.setItem('secret', 'must not be shown');
    f.store.getNode('other').setAttr({caption: '<unsafe>', count: 0, diagnostic: '^secret', formula: '==1+1'}); await tick();
    f.row('other').focus();
    const click = () => f.window.document.getElementById('inspect-attributes').shadowRoot.querySelector('button').click();
    click();
    let dialog = f.window.document.querySelector('dialog');
    assert.ok(dialog);
    assert.match(dialog.textContent, /caption/);
    assert.match(dialog.textContent, /<unsafe>/);
    assert.equal(dialog.querySelector('unsafe'), null);
    assert.match(dialog.textContent, /count/);
    assert.match(dialog.textContent, /\^secret/);
    assert.match(dialog.textContent, /==1\+1/);
    assert.doesNotMatch(dialog.textContent, /must not be shown/);
    assert.deepEqual(Object.keys(logic), logicKeys);
    const inspector = [...f.app.src.binding.nodeIds.entries()].find(([key]) => key.startsWith('tree_inspect_'))[1];
    assert.equal(typeof inspector.treeInspectClose, 'function');
    dialog.querySelector('button').click(); await tick();
    assert.equal(f.window.document.querySelector('dialog'), null);
    assert.equal(Object.hasOwn(inspector, 'treeInspectClose'), false);
    click();
    assert.ok(f.window.document.querySelector('dialog'));
    f.app.src.source.popNode('main'); await tick();
    assert.equal(f.window.document.querySelector('dialog'), null);
});

test('node badges display reactive text and color, preserve zero and hide empty values', async t => {
    const f = fixture(t); await tick();
    const node = f.store.getNode('other');
    let badge = f.row('other').querySelector('[part="badge"]');
    assert.equal(badge.hidden, true);
    node.setAttr({badge: 0, badge_color: '#218544'}); await tick();
    badge = f.row('other').querySelector('[part="badge"]');
    assert.equal(badge.textContent, '0');
    assert.equal(badge.hidden, false);
    assert.equal(badge.style.backgroundColor, 'rgb(33, 133, 68)');
    assert.equal(badge.compareDocumentPosition(f.row('other').querySelector('.caption')) & f.window.Node.DOCUMENT_POSITION_FOLLOWING, f.window.Node.DOCUMENT_POSITION_FOLLOWING);
    node.setAttr({badge: '<b>T</b>', badge_color: null}); await tick();
    badge = f.row('other').querySelector('[part="badge"]');
    assert.equal(badge.textContent, '<b>T</b>');
    assert.equal(badge.children.length, 0);
    assert.equal(badge.style.backgroundColor, '');
    node.setAttr({badge: ''}); await tick();
    assert.equal(f.row('other').querySelector('[part="badge"]').hidden, true);
});

test('external selection loads the missing lazy ancestors of its path', async t => {
    const calls = [];
    class Second extends BagResolver { load() { calls.push('second'); return new Bag({target: null}); } }
    class First extends BagResolver { load() { calls.push('first'); const bag = new Bag(); bag.setItem('next', new Second()); return bag; } }
    const f = fixture(t); await tick();
    f.store.setItem('lazy', new First()); await tick();
    f.app.data.setItem('model.selection', 'lazy.next.target');
    await settle(); await settle();
    assert.deepEqual(calls, ['first', 'second']);
    assert.equal(f.row('lazy').getAttribute('aria-expanded'), 'true');
    assert.equal(f.row('lazy.next').getAttribute('aria-expanded'), 'true');
    assert.equal(f.row('lazy.next.target').getAttribute('aria-selected'), 'true');
});

test('marked loops open without a prompt by mouse, keyboard and selection', async t => {
    let calls = 0;
    class Loop extends BagResolver { load() { calls++; return new Bag({leaf: null}); } }
    const f = fixture(t); await tick();
    f.store.setItem('first', new Loop({cacheTime: -1}), {loop: true});
    f.store.setItem('second', new Loop({cacheTime: -1}), {loop: true});
    f.store.setItem('third', new Loop({cacheTime: -1}), {loop: true}); await tick();
    f.row('first').querySelector('button').click(); await settle();
    f.row('second').dispatchEvent(new f.window.KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true})); await settle();
    f.app.data.setItem('model.selection', 'third.leaf'); await settle(); await settle();
    assert.equal(calls, 3);
    assert.equal(f.row('third.leaf').getAttribute('aria-selected'), 'true');
    assert.equal(f.window.document.querySelector('dialog'), null);
});

test('checks of marked loop branches load nothing and follow the list after expansion', async t => {
    let calls = 0;
    class Loop extends BagResolver { load() { calls++; return new Bag({leaf: null}); } }
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    f.store.setItem('first', new Loop({cacheTime: -1}), {loop: true});
    f.store.setItem('second', new Loop({cacheTime: -1}), {loop: true}); await tick();
    f.row('first').querySelector('input').click(); await settle();
    f.app.data.setItem('model.checked', 'second'); await settle(); await settle();
    assert.equal(calls, 0);
    f.row('second').querySelector('button').click(); await settle(); await settle();
    assert.equal(calls, 1);
    assert.equal(f.row('second.leaf').querySelector('input').checked, true);
    assert.equal(f.window.document.querySelector('dialog'), null);
});

test('a changed selection does not open later branches after a pending load', async t => {
    let finish;
    let nextLoads = 0;
    class Next extends BagResolver { load() { nextLoads++; return new Bag({target: null}); } }
    class First extends BagResolver { load() { return new Promise(resolve => { finish = resolve; }); } }
    const f = fixture(t); await tick();
    f.store.setItem('lazy', new First()); await tick();
    f.app.data.setItem('model.selection', 'lazy.next.target'); await settle();
    assert.equal(typeof finish, 'function');
    f.app.data.setItem('model.selection', 'other'); await tick();
    const bag = new Bag(); bag.setItem('next', new Next()); finish(bag);
    await settle(); await settle();
    assert.equal(nextLoads, 0);
    assert.equal(f.row('other').getAttribute('aria-selected'), 'true');
    assert.equal(f.row('lazy.next').getAttribute('aria-expanded'), 'false');
});

test('a failed lazy selection stops at the failed branch', async t => {
    class Failure extends BagResolver { load() { throw new Error('load failed'); } }
    const f = fixture(t); await tick();
    f.store.setItem('failure', new Failure()); await tick();
    f.app.data.setItem('model.selection', 'failure.child'); await settle(); await settle();
    assert.equal(f.row('failure').getAttribute('aria-expanded'), 'false');
    assert.equal(f.row('failure').classList.contains('error'), true);
    assert.equal(f.row('failure.child'), undefined);
});

test('drag preparation is disabled by default and follows a reactive draggable parameter', async t => {
    let calls = 0;
    class Logic { prepare() { calls++; } }
    const f = fixture(t, {attrs: {onDrag: 'prepare'}, logic: Logic}); await tick();
    const prepare = () => f.app.src.renderer.prepareDrag(f.source, dragEventPath(f, f.row('other').querySelector('.caption')));
    assert.equal(prepare(), null);
    assert.equal(calls, 0);
    f.app.data.setItem('model.enabled', true);
    f.source.setAttr({draggable: '^.enabled'}); await tick();
    assert.equal(prepare().path, 'other');
    assert.equal(calls, 1);
    f.app.data.setItem('model.enabled', false); await tick();
    assert.equal(prepare(), null);
    assert.equal(calls, 1);
    assert.equal(f.host.hasAttribute('onDrag'), false);
});

test('tree drag payload uses rendered plain text, real attributes and full/relative paths', async t => {
    class Logic { label(source, {path}) { return {html: `<b>Row</b> <i>${path}</i>`}; } }
    const f = fixture(t, {attrs: {draggable: true, getLabel: 'label'}, logic: Logic}); await tick();
    f.row('folder').querySelector('button').click();
    const result = f.app.src.renderer.prepareDrag(f.source, dragEventPath(f, f.row('folder.alpha').querySelector('.caption b')));
    assert.equal(result.item, f.store.getNode('folder.alpha'));
    assert.equal(result.path, 'folder.alpha');
    assert.deepEqual(result.dragValues, {
        'text/plain': 'Row folder.alpha', nodeattr: {},
        treenode: {fullpath: '_root_.model.nodes.folder.alpha', relpath: 'folder.alpha'}
    });
    assert.equal(f.app.data.getItem('model.selection'), null);
    assert.equal(Object.hasOwn(result.dragValues, 'text/xml'), false);
});

test('onDrag receives the approved Logic arguments and can edit payload or veto the attempt', async t => {
    const calls = [];
    class Logic {
        prepare(source, context) {
            calls.push({source, context});
            if (context.path === 'folder') return false;
            context.dragValues['text/plain'] = 'Custom caption';
            delete context.dragValues.treenode;
            context.dragValues.nodeattr.caption = 'Payload only';
            context.dragValues['app/record'] = {id: context.item.label};
        }
    }
    const f = fixture(t, {attrs: {draggable: true, onDrag: 'prepare'}, logic: Logic}); await tick();
    const result = f.app.src.renderer.prepareDrag(f.source, dragEventPath(f, f.row('other').querySelector('.row')));
    assert.equal(calls[0].source, f.source);
    assert.deepEqual(Object.keys(calls[0].context).sort(), ['dragValues', 'item', 'path']);
    assert.notEqual(calls[0].context.dragValues, result.dragValues);
    assert.deepEqual(calls[0].context.dragValues, result.dragValues);
    assert.deepEqual(result.dragValues, {'text/plain': 'Custom caption', nodeattr: {caption: 'Payload only'}, 'app/record': {id: 'other'}});
    assert.equal(f.store.getNode('other').getAttr('caption'), null);
    assert.equal(f.app.src.renderer.prepareDrag(f.source, dragEventPath(f, f.row('folder').querySelector('.caption'))), null);
    assert.equal(calls.length, 2);
});

test('preparing a lazy tree row never resolves it and preparation is local to this tree', async t => {
    let loads = 0;
    class Section extends BagResolver { load() { loads++; return new Bag({child: 1}); } }
    const f = fixture(t, {attrs: {draggable: true}, two: true}); await tick();
    f.store.setItem('lazy', new Section({cacheTime: -1}), {caption: 'Lazy section'}); await tick();
    const result = f.app.src.renderer.prepareDrag(f.source, dragEventPath(f, f.row('lazy').querySelector('.caption')));
    assert.equal(result.item, f.store.getNode('lazy'));
    assert.equal(result.dragValues['text/plain'], 'Lazy section');
    assert.equal(loads, 0);
    assert.equal(f.row('lazy').getAttribute('aria-expanded'), 'false');
    const second = f.window.document.getElementById('second');
    const foreignPath = {composedPath: () => [second.shadowRoot.querySelector('.row'), second]};
    assert.equal(f.app.src.renderer.prepareDrag(f.source, foreignPath), null);
});

test('empty areas and obsolete rows do not prepare a different node after rerender or disposal', async t => {
    const f = fixture(t, {attrs: {draggable: true}}); await tick();
    const oldPath = dragEventPath(f, f.row('other').querySelector('.caption'));
    assert.equal(f.app.src.renderer.prepareDrag(f.source, {composedPath: () => [f.host]}), null);
    f.store.popNode('other'); await tick();
    assert.equal(f.app.src.renderer.prepareDrag(f.source, oldPath), null);
    f.app.src.renderer.dispose();
    assert.equal(f.app.src.renderer.prepareDrag(f.source, oldPath), null);
});

test('asynchronous onDrag is rejected before returning prepared data', async t => {
    class Logic { async prepare() {} }
    const f = fixture(t, {attrs: {draggable: true, onDrag: 'prepare'}, logic: Logic}); await tick();
    assert.throws(() => f.app.src.renderer.prepareDrag(f.source, dragEventPath(f, f.row('other').querySelector('.caption'))), /onDrag must run synchronously/);
});

test('prepared structured data is a TYTX snapshot after onDrag, isolated from later Bag and attribute edits', async t => {
    let original;
    const payloadBag = new Bag({count: 4});
    const timestamp = new Date('2026-10-20T12:30:00Z');
    class Logic {
        prepare(source, {dragValues}) {
            original = dragValues;
            dragValues['app/record'] = {bag: payloadBag, timestamp, nested: {status: 'ready'}};
            dragValues.dragTags = 'document';
        }
    }
    const f = fixture(t, {attrs: {draggable: true, onDrag: 'prepare'}, logic: Logic}); await tick();
    f.store.getNode('other').setAttr({details: {caption: 'Before'}}); await tick();
    const result = f.app.src.renderer.prepareDrag(f.source, dragEventPath(f, f.row('other').querySelector('.row')));
    payloadBag.setItem('count', 9);
    timestamp.setUTCFullYear(2030);
    original['app/record'].nested.status = 'changed';
    f.store.getNode('other').getAttr('details').caption = 'After';
    const record = result.dragValues['app/record'];
    assert.ok(record.bag instanceof Bag);
    assert.equal(record.bag.getItem('count'), 4);
    assert.ok(record.timestamp instanceof Date);
    assert.equal(record.timestamp.toISOString(), '2026-10-20T12:30:00.000Z');
    assert.equal(record.nested.status, 'ready');
    assert.equal(result.dragValues.nodeattr.details.caption, 'Before');
    assert.equal(result.dragValues.dragTags, 'document');
    assert.equal(result.item, f.store.getNode('other'));
});

test('drag snapshots reuse transport guards for live references and cycles and require actual text formats', async t => {
    let mode = 'source';
    class Logic {
        prepare(source, {dragValues}) {
            if (mode === 'source') dragValues['app/record'] = {source};
            else if (mode === 'cycle') {
                const cycle = {}; cycle.self = cycle;
                dragValues['app/record'] = cycle;
            } else dragValues['text/plain'] = 42;
        }
    }
    const f = fixture(t, {attrs: {draggable: true, onDrag: 'prepare'}, logic: Logic}); await tick();
    const prepare = () => f.app.src.renderer.prepareDrag(f.source, dragEventPath(f, f.row('other').querySelector('.row')));
    assert.throws(prepare, /Live Source\/DOM references/);
    mode = 'cycle'; assert.throws(prepare, /circular references/);
    mode = 'text'; assert.throws(prepare, /text\/plain drag data must be text/);
});

test('general onDrop receives destination context and a Bag write updates the tree through normal rendering', async t => {
    let received;
    class Logic {
        receive(source, context) {
            received = {source, context};
            context.item.setAttr({caption: context.dropValues['text/plain']});
        }
    }
    const f = fixture(t, {attrs: {onDrop: 'receive'}, logic: Logic}); await tick();
    const context = dropContext(f);
    await f.app.src.renderer.invokeDrop(f.source, context); await tick();
    assert.equal(received.source, f.source);
    assert.deepEqual(Object.keys(received.context).sort(), ['dataAvailable', 'dropEffect', 'dropValues', 'item', 'path', 'selfdrop', 'source']);
    assert.deepEqual(received.context, context);
    assert.equal(received.context.source, context.source);
    assert.equal(f.store.getNode('other').getAttr('caption'), 'Received');
    assert.equal(f.row('other').querySelector('.caption').textContent, 'Received');
    assert.equal(f.app.data.getItem('model.selection'), null);
    assert.equal(f.host.hasAttribute('onDrop'), false);
});

test('general onDrop waits for asynchronous Logic before reporting action completion', async t => {
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    class Logic {
        async receive(source, {item, dropValues}) {
            await gate;
            item.setAttr({caption: dropValues['text/plain']});
        }
    }
    const f = fixture(t, {attrs: {onDrop: 'receive'}, logic: Logic}); await tick();
    let completed = false;
    const pending = f.app.src.renderer.invokeDrop(f.source, dropContext(f)).then(() => { completed = true; });
    await tick();
    assert.equal(completed, false);
    assert.equal(f.row('other').querySelector('.caption').textContent, 'other');
    release(); await pending; await tick();
    assert.equal(completed, true);
    assert.equal(f.row('other').querySelector('.caption').textContent, 'Received');
});

test('general onDrop skips empty residual data, absent handlers and detached destinations', async t => {
    let calls = 0;
    class Logic { receive() { calls++; } }
    const f = fixture(t, {attrs: {onDrop: 'receive'}, logic: Logic}); await tick();
    await f.app.src.renderer.invokeDrop(f.source, dropContext(f, 'other', {}));
    assert.equal(calls, 0);
    f.source.setAttr({onDrop: null}); await tick();
    await f.app.src.renderer.invokeDrop(f.source, dropContext(f));
    assert.equal(calls, 0);
    f.source.setAttr({onDrop: 'receive'}); await tick();
    await f.app.src.renderer.invokeDrop(f.source, dropContext(f));
    assert.equal(calls, 1);
    f.app.src.renderer.remove(f.source);
    await f.app.src.renderer.invokeDrop(f.source, dropContext(f));
    assert.equal(calls, 1);
});

test('general onDrop preserves synchronous and asynchronous application errors for its caller', async t => {
    const syncError = new Error('Sync application failure');
    const asyncError = new Error('Async application failure');
    class Logic {
        receive() { throw syncError; }
        async delayed() { throw asyncError; }
    }
    const f = fixture(t, {attrs: {onDrop: 'receive'}, logic: Logic}); await tick();
    await assert.rejects(f.app.src.renderer.invokeDrop(f.source, dropContext(f)), error => error === syncError);
    f.source.setAttr({onDrop: 'delayed'}); await tick();
    await assert.rejects(f.app.src.renderer.invokeDrop(f.source, dropContext(f)), error => error === asyncError);
    assert.equal(f.row('other').querySelector('.caption').textContent, 'other');
});

test('dropTargetCb shares the action context, rereads target state and never invokes the action', async t => {
    const calls = [];
    let actions = 0;
    class Logic {
        canReceive(source, context) {
            calls.push({source, context});
            return context.dataAvailable && context.item.getAttr('locked') !== true;
        }
        receive() { actions++; }
    }
    const f = fixture(t, {attrs: {dropTargetCb: 'canReceive', onDrop: 'receive'}, logic: Logic}); await tick();
    const context = dropContext(f);
    assert.equal(f.app.src.renderer.checkDropTarget(f.source, context), true);
    assert.equal(calls[0].source, f.source);
    assert.deepEqual(calls[0].context, context);
    assert.equal(calls[0].context.source, context.source);
    context.item.setAttr({locked: true}); await tick();
    assert.equal(f.app.src.renderer.checkDropTarget(f.source, context), false);
    context.item.setAttr({locked: false}); await tick();
    assert.equal(f.app.src.renderer.checkDropTarget(f.source, {...context, dropValues: {}, dataAvailable: false}), false);
    assert.equal(f.app.src.renderer.checkDropTarget(f.source, context), true);
    assert.equal(calls.length, 4);
    assert.equal(actions, 0);
    assert.equal(f.app.data.getItem('model.selection'), null);
    assert.equal(f.host.hasAttribute('dropTargetCb'), false);
});

test('dropTargetCb requires a synchronous boolean and does not coerce truthy results', async t => {
    class Logic {
        wrongType() { return 'yes'; }
        async asynchronous() { return true; }
    }
    const f = fixture(t, {attrs: {dropTargetCb: 'wrongType'}, logic: Logic}); await tick();
    assert.throws(() => f.app.src.renderer.checkDropTarget(f.source, dropContext(f)), /boolean synchronously/);
    f.source.setAttr({dropTargetCb: 'asynchronous'}); await tick();
    assert.throws(() => f.app.src.renderer.checkDropTarget(f.source, dropContext(f)), /boolean synchronously/);
    f.source.setAttr({dropTargetCb: null}); await tick();
    assert.equal(f.app.src.renderer.checkDropTarget(f.source, dropContext(f)), true);
    f.app.src.renderer.remove(f.source);
    assert.equal(f.app.src.renderer.checkDropTarget(f.source, dropContext(f)), false);
});

test('native tree drag snapshots payload, publishes acceptance, updates Data and cleans preview/feedback once', async t => {
    const events = [];
    class Logic {
        receive(source, {item, dropValues, selfdrop}) {
            events.push('action'); assert.equal(selfdrop, true);
            item.setAttr({caption: dropValues.nodeattr.caption});
        }
        ended(source, context) { events.push('end callback'); assert.equal(context.dropEffect, 'move'); }
    }
    const f = fixture(t, {attrs: {nodeId: 'dragTree', draggable: true, dropTarget: true, dropTypes: 'nodeattr', onDrop: 'receive', onDragEnd: 'ended'}, logic: Logic}); await tick();
    f.app.subscribe('dragTree_onDrop', context => { events.push('accepted'); assert.deepEqual(Object.keys(context.dropValues), ['nodeattr']); });
    f.app.subscribe('dragTree_endDrag', context => { events.push('end publish'); assert.equal(context.dropEffect, 'move'); });
    const data = transfer();
    assert.equal(f.row('folder').querySelector('.row').draggable, true);
    assert.equal(nativeDrag(f, 'dragstart', 'folder', data).defaultPrevented, false);
    assert.equal(data.getData('text/plain'), 'Folder');
    assert.ok(data.image.classList.contains('draggedItem'));
    assert.equal(f.row('folder').querySelector('.row').classList.contains('draggedItem'), false);
    f.store.getNode('folder').setAttr({caption: 'Changed after drag began'}); await tick();
    nativeDrag(f, 'dragover', 'other', data);
    assert.equal(data.dropEffect, 'move');
    assert.ok(f.row('other').querySelector('.row').classList.contains('canBeDropped'));
    assert.match(f.row('other').querySelector('.row').getAttribute('part'), /canBeDropped/);
    nativeDrag(f, 'drop', 'other', data); await tick();
    assert.equal(f.row('other').querySelector('.caption').textContent, 'Folder');
    assert.equal(f.host.shadowRoot.querySelector('.canBeDropped'), null);
    assert.equal(data.image.isConnected, false);
    nativeDrag(f, 'drop', 'other', data);
    nativeDrag(f, 'dragend', 'folder', data); await tick(); await tick();
    nativeDrag(f, 'dragend', 'folder', data); await tick();
    assert.deepEqual(events, ['accepted', 'action', 'end callback', 'end publish']);
});

test('native drop revalidates eligibility and never falls through a rejected inner destination', async t => {
    let checks = 0, actions = 0, outer = 0;
    class Logic {
        canReceive(source, {item}) { checks++; return item.getAttr('locked') !== true; }
        receive() { actions++; }
        outer() { outer++; }
    }
    const f = fixture(t, {attrs: {draggable: true, dropTargetCb: 'canReceive', dropTypes: 'treenode', onDrop: 'receive'}, logic: Logic}); await tick();
    f.source.parentNode.setAttr({dropTarget: true, dropTypes: '*', onDrop: 'outer'});
    const data = transfer(); nativeDrag(f, 'dragstart', 'folder', data);
    nativeDrag(f, 'dragover', 'other', data); assert.equal(data.dropEffect, 'move');
    f.store.getNode('other').setAttr({locked: true}); await tick();
    nativeDrag(f, 'drop', 'other', data); await tick();
    assert.equal(checks, 2); assert.equal(actions, 0); assert.equal(outer, 0);
    assert.equal(data.dropEffect, 'none');
    nativeDrag(f, 'dragend', 'folder', data); await tick();
});

test('native type/tag/effect restrictions cannot be bypassed by an accepting callback', async t => {
    let checks = 0, actions = 0;
    class Logic { allow() { checks++; return true; } receive() { actions++; } }
    const f = fixture(t, {attrs: {draggable: true, dropTarget: true, dropTypes: 'missing', dropTargetCb: 'allow', onDrop: 'receive'}, logic: Logic}); await tick();
    for (const attrs of [{dropTypes: 'missing'}, {dropTypes: 'nodeattr', dropTags: '!blocked'},
        {dropTypes: 'nodeattr', dropTags: '', effectAllowed: 'copy', dropEffect: 'move'}]) {
        f.source.setAttr(attrs); await tick();
        const data = transfer(); nativeDrag(f, 'dragstart', 'folder', data); nativeDrag(f, 'dragover', 'other', data);
        assert.equal(data.dropEffect, 'none');
        assert.ok(f.row('other').querySelector('.row').classList.contains('cannotBeDropped'));
        nativeDrag(f, 'drop', 'other', data); nativeDrag(f, 'dragend', 'folder', data); await tick();
    }
    assert.equal(checks, 0); assert.equal(actions, 0);
});

test('external payloads and another window instance do not enter the internal drop pipeline', async t => {
    let actions = 0;
    class Logic { receive() { actions++; } }
    const attrs = {draggable: true, dropTarget: true, dropTypes: '*', onDrop: 'receive'};
    const a = fixture(t, {attrs, logic: Logic}); const b = fixture(t, {attrs, logic: Logic}); await tick();
    const external = transfer(); external.setData('nodeattr', '{"caption":"External"}');
    assert.equal(nativeDrag(b, 'dragover', 'other', external).defaultPrevented, true);
    nativeDrag(b, 'drop', 'other', external); await tick(); assert.equal(actions, 0);
    const internal = transfer(); nativeDrag(a, 'dragstart', 'folder', internal);
    nativeDrag(b, 'dragover', 'other', internal); nativeDrag(b, 'drop', 'other', internal); await tick();
    assert.equal(internal.dropEffect, 'none'); assert.equal(actions, 0);
    nativeDrag(a, 'dragend', 'folder', internal); await tick();
});

test('a vetoed or failed preparation cancels startup without endDrag notification', async t => {
    let mode = 'veto', ends = 0;
    class Logic { prepare() { if (mode === 'error') throw new Error('Preparation failed'); return false; } }
    const f = fixture(t, {attrs: {nodeId: 'dragTree', draggable: true, onDrag: 'prepare'}, logic: Logic}); await tick();
    f.app.subscribe('dragTree_endDrag', () => { ends++; });
    for (mode of ['veto', 'error']) {
        const data = transfer(); assert.equal(nativeDrag(f, 'dragstart', 'folder', data).defaultPrevented, true);
        nativeDrag(f, 'dragend', 'folder', data); await tick();
        assert.equal(f.host.shadowRoot.querySelector('.draggedItem'), null);
    }
    assert.equal(ends, 0); assert.equal(f.window.document.querySelectorAll('[role=alert]').length, 1);
});

test('eligibility errors reject and clean the gesture; end callback errors still publish completion', async t => {
    let ends = 0;
    class Logic { check() { throw new Error('Check failed'); } ended() { throw new Error('End callback failed'); } }
    const f = fixture(t, {attrs: {nodeId: 'dragTree', draggable: true, dropTypes: '*', dropTargetCb: 'check', onDragEnd: 'ended'}, logic: Logic}); await tick();
    f.app.subscribe('dragTree_endDrag', () => { ends++; });
    const data = transfer(); nativeDrag(f, 'dragstart', 'folder', data); nativeDrag(f, 'dragover', 'other', data);
    assert.equal(data.dropEffect, 'none'); assert.equal(data.image.isConnected, false);
    assert.equal(f.host.shadowRoot.querySelector('.canBeDropped,.cannotBeDropped'), null);
    nativeDrag(f, 'dragend', 'folder', data); await tick(); await tick();
    assert.equal(ends, 1); assert.equal(f.window.document.querySelectorAll('[role=alert]').length, 2);
});

test('action errors do not roll back Data or redefine the browser effect as operation success', async t => {
    let ending;
    class Logic { receive(source, {item}) { item.setAttr({caption: 'Written before failure'}); throw new Error('Action failed'); } }
    const f = fixture(t, {attrs: {nodeId: 'dragTree', draggable: true, dropTarget: true, dropTypes: 'nodeattr', onDrop: 'receive'}, logic: Logic}); await tick();
    f.app.subscribe('dragTree_endDrag', context => { ending = context; });
    const data = transfer(); nativeDrag(f, 'dragstart', 'folder', data); nativeDrag(f, 'drop', 'other', data); await tick(); await tick();
    assert.equal(data.image.isConnected, false);
    assert.equal(f.row('other').querySelector('.caption').textContent, 'Written before failure');
    nativeDrag(f, 'dragend', 'folder', data); await tick();
    assert.equal(ending.dropEffect, 'move'); assert.equal(f.window.document.querySelectorAll('[role=alert]').length, 1);
});

test('a late rejected async action cannot clear a subsequent active drag', async t => {
    let reject;
    class Logic { receive() { return new Promise((resolve, fail) => { reject = fail; }); } }
    const f = fixture(t, {attrs: {draggable: true, dropTarget: true, dropTypes: 'nodeattr', onDrop: 'receive'}, logic: Logic}); await tick();
    const old = transfer(); nativeDrag(f, 'dragstart', 'folder', old); nativeDrag(f, 'drop', 'other', old);
    nativeDrag(f, 'dragend', 'folder', old); await tick();
    const current = transfer(); nativeDrag(f, 'dragstart', 'folder', current);
    reject(new Error('Earlier operation failed')); await tick(); await tick();
    nativeDrag(f, 'dragover', 'other', current);
    assert.equal(current.dropEffect, 'move'); assert.equal(current.image.isConnected, true);
    nativeDrag(f, 'dragend', 'folder', current); await tick();
});

test('removing a drag source clears feedback and publishes completion once; disposal releases listeners', async t => {
    const f = fixture(t, {attrs: {nodeId: 'dragTree', draggable: true, dropTarget: true, dropTypes: '*'}}); await tick();
    const endings = [];
    f.app.subscribe('dragTree_endDrag', context => endings.push(context));
    const data = transfer(); nativeDrag(f, 'dragstart', 'folder', data);
    nativeDrag(f, 'dragover', 'other', data);
    const row = f.row('other').querySelector('.row');
    assert.ok(row.classList.contains('canBeDropped'));
    f.source.parentBag.popNode('tree'); await tick(); await tick();
    assert.equal(data.image.isConnected, false);
    assert.equal(row.classList.contains('canBeDropped'), false);
    assert.equal(endings.length, 1);
    assert.equal(endings[0].dropEffect, 'none');
    const end = new f.window.Event('dragend', {bubbles: true});
    Object.defineProperty(end, 'dataTransfer', {value: data});
    f.window.document.dispatchEvent(end); await tick();
    assert.equal(endings.length, 1);
    const g = fixture(t, {attrs: {draggable: true}}); await tick();
    const active = transfer(); nativeDrag(g, 'dragstart', 'folder', active);
    g.app.dispose();
    assert.equal(active.image.isConnected, false);
    assert.equal(g.window.document.head.querySelector('style'), null);
    g.window.document.dispatchEvent(new g.window.Event('dragend'));
});

test('relative Bag store, caption fallback, disclosure and selection round trip', async t => {
    const f = fixture(t); await tick();
    assert.equal(f.row('folder').querySelector('.caption').textContent, 'Folder');
    assert.equal(f.row('other').querySelector('.caption').textContent, 'other');
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'false');
    f.row('folder').querySelector('button').click();
    assert.equal(f.app.data.getItem('model.selection'), null);
    f.row('folder.alpha').querySelector('.row').click();
    assert.equal(f.app.data.getItem('model.selection'), 'folder.alpha');
    await tick();
    f.row('other').querySelector('.row').click(); await tick();
    assert.equal(f.host.shadowRoot.querySelectorAll('[aria-selected=true]').length, 1);
    f.app.data.setItem('model.selection', 'folder.beta'); await tick();
    assert.equal(f.row('folder.beta').getAttribute('aria-selected'), 'true');
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'true');
    f.app.data.setItem('model.selection', null); await tick();
    assert.equal(f.host.shadowRoot.querySelectorAll('[aria-selected=true]').length, 0);
});

test('live nested insert/update/delete retain expansion and external store replacement is routed', async t => {
    const f = fixture(t); await tick();
    f.row('folder').querySelector('button').click();
    const folder = f.store.getNode('folder').staticValue;
    folder.setItem('gamma', 'G', {caption: 'Gamma'}); await tick();
    assert.equal(f.row('folder.gamma').querySelector('.caption').textContent, 'Gamma');
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'true');
    folder.getNode('gamma').setAttr({caption: 'Changed'}); await tick();
    assert.equal(f.row('folder.gamma').querySelector('.caption').textContent, 'Changed');
    folder.popNode('gamma'); await tick(); assert.equal(f.row('folder.gamma'), undefined);
    f.app.data.setItem('model.nodes', new Bag({newNode: null})); await tick();
    assert.ok(f.row('newNode')); assert.equal(f.row('folder'), undefined);
});

test('selection from Data reveals ancestors and missing paths never select a different row', async t => {
    const f = fixture(t); await tick();
    f.app.data.setItem('model.selection', 'folder.alpha'); await tick();
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'true');
    f.store.getNode('folder').staticValue.popNode('alpha'); await tick();
    assert.equal(f.host.shadowRoot.querySelectorAll('[aria-selected=true]').length, 0);
    assert.equal(f.app.data.getItem('model.selection'), 'folder.alpha');
});

test('keyboard focus traverses visible rows and Enter selects without expanding', async t => {
    const f = fixture(t); await tick();
    const key = (row, value) => row.dispatchEvent(new f.window.KeyboardEvent('keydown', {key: value, bubbles: true}));
    const folder = f.row('folder'); folder.focus();
    key(folder, 'ArrowRight');
    assert.equal(folder.getAttribute('aria-expanded'), 'true');
    key(folder, 'ArrowDown');
    assert.equal(f.host.shadowRoot.activeElement, f.row('folder.alpha'));
    key(f.row('folder.alpha'), 'Enter');
    assert.equal(f.app.data.getItem('model.selection'), 'folder.alpha');
    key(f.row('folder.alpha'), 'ArrowLeft');
    assert.equal(f.host.shadowRoot.activeElement, folder);
});

test('two trees isolate selection and closing Source releases store route', async t => {
    const f = fixture(t, {two: true}); await tick();
    const second = f.window.document.getElementById('second');
    f.row('other').querySelector('.row').click(); await tick();
    assert.equal(second.shadowRoot.querySelectorAll('[aria-selected=true]').length, 0);
    const runtime = f.app.src.renderer.binding;
    const before = runtime.router.size;
    f.source.parentBag.popNode('tree');
    assert.equal(runtime.router.size, before - 2);
    f.store.setItem('late', 1); await tick();
    assert.ok(second.shadowRoot.querySelector('[data-path=late]'));
    f.app.dispose(); assert.equal(runtime.router.size, 0);
});

test('unloaded resolver is not evaluated by render or store updates', async t => {
    let loads = 0;
    class Lazy extends BagResolver { load() { loads++; return new Bag({child: 'Loaded'}); } }
    const f = fixture(t); await tick();
    f.store.setItem('lazy', new Lazy()); await tick();
    assert.ok(f.row('lazy'));
    f.store.setItem('unrelated', 1); await tick();
    assert.equal(loads, 0);
});

test('child_count suppresses empty lazy branches without resolving them', async t => {
    let loads = 0;
    class Lazy extends BagResolver { load() { loads++; return new Bag({child: 'Loaded'}); } }
    const f = fixture(t); await tick();
    f.store.setItem('empty', new Lazy({cacheTime: -1}), {child_count: 0});
    f.store.setItem('unknown', new Lazy({cacheTime: -1}));
    f.store.setItem('known', new Lazy({cacheTime: -1}), {child_count: 1});
    await tick();
    assert.equal(f.row('empty').querySelector('button'), null);
    assert.ok(f.row('unknown').querySelector('button'));
    assert.ok(f.row('known').querySelector('button'));
    assert.equal(loads, 0);
    f.row('unknown').querySelector('button').click(); await tick(); await tick();
    assert.equal(loads, 1);
    assert.ok(f.row('unknown.child'));
});

test('store routing follows the declared storepath parameter, not the tree tag name', async t => {
    const collection = defineCollection({name: 'testTree', components: [
        defineComponent({...Tree, name: 'outline', tag: 'test-outline'})
    ]});
    const f = fixture(t, {collection, tag: 'outline'}); await tick();
    f.store.setItem('newNode', 1); await tick(); assert.ok(f.row('newNode'));
    const meta = collection.toDocument().elements.outline._meta.gramlot_component;
    assert.ok(meta.parameters.storepath);
    assert.equal(Object.hasOwn(meta, 'bagStore'), false);
    assert.equal(Object.hasOwn(f.host, 'setStoreBag') || 'setStoreBag' in f.host, false);
});

test('a tree reads its store at the address when it draws and reports an address without a Bag', async t => {
    const f = fixture(t); await tick();
    const errors = [];
    f.app.src.renderer.binding.reportError = (error, title) => errors.push([title, error.message]);
    const replacement = new Bag({fresh: 'New'});
    f.app.data.setItem('model.nodes', replacement); await tick();
    assert.equal(f.host.storeBag, replacement);
    assert.ok(f.row('fresh')); assert.equal(f.row('folder'), undefined);
    f.app.data.setItem('model.nodes', 'not a Bag'); await tick();
    assert.deepEqual(errors, [['Tree', 'tree storepath must resolve to a Bag']]);
    assert.ok(f.row('fresh'), 'the last drawn rows stay');
});

test('absolute storepath changes rebind the store and release the previous route', async t => {
    const f = fixture(t, {attrs: {storepath: 'model.nodes'}}); await tick();
    const replacement = new Bag({replacement: 'New'});
    f.app.data.setItem('different.nodes', replacement);
    const before = f.app.src.renderer.binding.router.size;
    f.source.setAttr({storepath: 'different.nodes'}); await tick();
    assert.ok(f.row('replacement')); assert.equal(f.row('folder'), undefined);
    assert.equal(f.app.src.renderer.binding.router.size, before);
    f.store.setItem('obsolete', 1); await tick();
    assert.equal(f.row('obsolete'), undefined);
    replacement.setItem('added', 2); await tick(); assert.ok(f.row('added'));
});

test('unbound selection survives store updates and responds to a new Source selection', async t => {
    const f = fixture(t, {attrs: {selectedPath: null}}); await tick();
    f.row('other').querySelector('.row').click(); await tick();
    f.store.setItem('added', 2); await tick();
    assert.equal(f.row('other').getAttribute('aria-selected'), 'true');
    f.source.setAttr({selectedPath: 'folder.alpha'}); await tick();
    assert.equal(f.row('folder.alpha').getAttribute('aria-selected'), 'true');
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'true');
});

test('lazy expansion reads only the requested resolver, retains cached children and exposes style parts', async t => {
    let loads = 0, nested = 0;
    class Nested extends BagResolver { load() { nested++; return new Bag({deep: 1}); } }
    class Section extends BagResolver {
        load() { loads++; const children = new Bag({one: 1}); children.setItem('next', new Nested()); return children; }
    }
    const f = fixture(t); await tick();
    f.store.setItem('lazy', new Section({cacheTime: -1})); await tick();
    assert.equal(loads, 0);
    assert.equal(f.row('lazy').querySelector('.icon').getAttribute('part'), 'icon branch-icon closed-icon');
    f.row('lazy').querySelector('button').click(); await tick(); await tick();
    assert.equal(loads, 1); assert.equal(nested, 0); assert.ok(f.row('lazy.one'));
    assert.equal(f.row('lazy').querySelector('.icon').getAttribute('part'), 'icon branch-icon opened-icon');
    f.row('lazy').querySelector('button').click();
    f.row('lazy').querySelector('button').click(); await tick(); await tick();
    assert.equal(loads, 1);
    f.row('lazy.one').querySelector('.row').click();
    assert.ok(f.row('lazy.one').querySelector('.row').getAttribute('part').includes('selected-row'));
});

test('pending lazy resolution is not duplicated and completion respects collapse and disposal', async t => {
    let finish, loads = 0;
    class Section extends BagResolver {
        load() { loads++; return new Promise(resolve => {finish = resolve;}); }
    }
    const f = fixture(t); await tick();
    f.store.setItem('lazy', new Section({cacheTime: -1})); await tick();
    f.row('lazy').querySelector('button').click(); await tick();
    assert.equal(f.row('lazy').getAttribute('aria-busy'), 'true');
    f.row('lazy').querySelector('button').click();
    f.row('lazy').querySelector('button').click();
    f.row('lazy').querySelector('button').click();
    assert.equal(loads, 1);
    finish(new Bag({child: 1})); await tick(); await tick(); await tick();
    assert.equal(f.row('lazy').getAttribute('aria-expanded'), 'false');
    assert.equal(f.row('lazy').getAttribute('aria-busy'), 'false');
    assert.ok(f.row('lazy.child').closest('[hidden]'));
    f.store.setItem('late', new Section({cacheTime: -1})); await tick();
    f.row('late').querySelector('button').click(); await tick();
    f.app.dispose();
    finish(new Bag({afterClose: 1})); await tick(); await tick(); await tick();
    assert.equal(f.host.isConnected, false);
    assert.equal(f.app.src.renderer.binding.router.size, 0);
});

test('failed branch reads are visible and retryable without a substitute store', async t => {
    let attempts = 0;
    class Section extends BagResolver {
        load() { if (++attempts === 1) return Promise.reject(new Error('Try again')); return new Bag({child: 1}); }
    }
    const f = fixture(t); await tick();
    f.store.setItem('lazy', new Section({cacheTime: -1})); await tick();
    f.row('lazy').querySelector('button').click(); await tick(); await tick(); await tick();
    assert.ok(f.row('lazy').classList.contains('error'));
    assert.match(f.row('lazy').querySelector('.row').title, /Try again/);
    f.row('lazy').querySelector('button').click(); await tick(); await tick();
    assert.equal(attempts, 2); assert.ok(f.row('lazy.child'));
    assert.equal(f.row('lazy').classList.contains('error'), false);
});

test('autoCollapse closes siblings at each depth and external selection reveals its branch', async t => {
    const f = fixture(t, {attrs: {autoCollapse: true}}); await tick();
    f.store.setItem('folder.left', new Bag({one: 1}));
    f.store.setItem('folder.right', new Bag({two: 2}));
    f.store.setItem('second', new Bag({child: 3})); await tick();
    const open = path => f.row(path).querySelector('button').click();
    const expanded = path => f.row(path).getAttribute('aria-expanded');
    open('folder'); open('folder.left'); open('folder.right');
    assert.equal(expanded('folder'), 'true');
    assert.equal(expanded('folder.left'), 'false');
    assert.equal(expanded('folder.right'), 'true');
    f.row('folder.right.two').querySelector('.row').click(); await tick();
    open('second');
    assert.equal(expanded('folder'), 'false');
    assert.equal(expanded('second'), 'true');
    assert.equal(f.app.data.getItem('model.selection'), 'folder.right.two');
    assert.ok(f.row('folder.right.two').closest('[hidden]'));
    assert.ok(f.row('folder').classList.contains('closed'));
    open('folder');
    assert.equal(expanded('second'), 'false');
    assert.equal(expanded('folder.right'), 'true');
    f.app.data.setItem('model.selection', 'second.child'); await tick();
    assert.equal(expanded('folder'), 'false');
    assert.equal(expanded('second'), 'true');
    f.app.data.setItem('model.selection', 'folder.left.one'); await tick();
    assert.equal(expanded('second'), 'false');
    assert.equal(expanded('folder'), 'true');
    assert.equal(expanded('folder.left'), 'true');
    assert.equal(expanded('folder.right'), 'false');
});

test('autoCollapse is opt-in and a late resolver result cannot reopen a closed sibling', async t => {
    const ordinary = fixture(t); await tick();
    ordinary.store.setItem('second', new Bag({child: 1})); await tick();
    ordinary.row('folder').querySelector('button').click();
    ordinary.row('second').querySelector('button').click();
    assert.equal(ordinary.row('folder').getAttribute('aria-expanded'), 'true');

    let finish, loads = 0;
    class Section extends BagResolver {
        load() { loads++; return new Promise(resolve => { finish = resolve; }); }
    }
    const f = fixture(t, {attrs: {autoCollapse: true}}); await tick();
    f.store.setItem('lazy', new Section({cacheTime: -1})); await tick();
    f.row('lazy').querySelector('button').click(); await tick();
    f.row('folder').dispatchEvent(new f.window.KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));
    assert.equal(f.row('lazy').getAttribute('aria-expanded'), 'false');
    finish(new Bag({child: 1})); await tick(); await tick(); await tick();
    assert.equal(f.row('lazy').getAttribute('aria-expanded'), 'false');
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'true');
    f.row('lazy').querySelector('button').click(); await tick(); await tick();
    assert.equal(loads, 1);
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'false');
    assert.equal(f.row('lazy').getAttribute('aria-expanded'), 'true');
});

test('scalar values are visual children, preserve zero/false/null, and select the owning Bag node', async t => {
    assert.equal(Tree.parameters.hideValues.default, false);
    const f = fixture(t, {attrs: {hideValues: false}}); await tick();
    f.store.setItem('zero', 0); f.store.setItem('no', false); f.store.setItem('nil', null); await tick();
    for (const [path, value] of [['other', 'C'], ['zero', '0'], ['no', 'false'], ['nil', 'null']]) {
        const owner = f.row(path); owner.querySelector('button').click();
        const child = owner.querySelector('.value-node');
        assert.equal(child.querySelector('.value').textContent, value);
        child.querySelector('.row').click(); await tick();
        assert.equal(f.app.data.getItem('model.selection'), path);
        assert.equal(f.store.getNode(path).staticValue instanceof Bag, false);
    }
    f.source.setAttr({hideValues: true}); await tick();
    assert.equal(f.host.shadowRoot.querySelector('.value-node'), null);
    f.source.setAttr({hideValues: false}); await tick();
    f.store.setItem('other', '<b>plain scalar</b>'); await tick();
    assert.equal(f.row('other').querySelector('.value').textContent, '<b>plain scalar</b>');
    assert.equal(f.row('other').querySelector('.value b'), null);
});

test('node classes and caption state classes react without replacing selection or store', async t => {
    const f = fixture(t, {attrs: {selectedLabelClass: 'chosen emphasis'}}); await tick();
    f.store.getNode('folder').setAttr({labelClass: 'base', labelClassOpened: 'open-label', labelClassClosed: 'closed-label', node_class: 'attention'}); await tick();
    const caption = () => f.row('folder').querySelector('.caption');
    assert.ok(caption().classList.contains('closed-label'));
    assert.match(f.row('folder').getAttribute('part'), /attention/);
    f.row('folder').querySelector('button').click();
    assert.ok(caption().classList.contains('open-label'));
    f.row('folder').querySelector('.row').click(); await tick();
    assert.ok(caption().classList.contains('chosen'));
    assert.match(caption().getAttribute('part'), /chosen emphasis/);
    f.store.getNode('folder').setAttr({labelClassOpened: '', labelClass: 'revised'}); await tick();
    assert.ok(caption().classList.contains('revised'));
    f.app.data.setItem('model.selection', 'other'); await tick();
    assert.equal(caption().classList.contains('chosen'), false);
});

test('named label and class callbacks receive row context, obey precedence and refresh on open/selection', async t => {
    const calls = [];
    class Logic {
        label(source, kw) { calls.push({source, ...kw}); return {text: `Computed ${kw.item.label}`}; }
        override(source, kw) { return {text: `${kw.opened ? 'Open' : 'Closed'} ${kw.path}${kw.selected ? ' selected' : ''}`}; }
        classes(source, {opened}) { return opened ? 'custom-open' : 'custom-closed'; }
        icon(source, {item, opened}) { return item.label === 'other' ? '' : opened ? 'opened-icon custom-icon' : 'branch-icon custom-icon'; }
    }
    const f = fixture(t, {logic: Logic, attrs: {labelCb: 'label', getLabelClass: 'classes', getIconClass: 'icon', selectedLabelClass: 'selected-label'}}); await tick();
    assert.equal(calls.length, 0);
    assert.equal(f.row('folder').querySelector('.caption').textContent, 'Folder');
    assert.equal(f.row('other').querySelector('.icon').hidden, true);
    f.source.setAttr({labelAttribute: null}); await tick();
    assert.equal(f.row('folder').querySelector('.caption').textContent, 'Computed folder');
    const call = calls.find(entry => entry.path === 'folder');
    assert.equal(call.source, f.source);
    assert.equal(call.item, f.store.getNode('folder'));
    assert.equal(call.opened, false); assert.equal(call.selected, false);
    f.source.setAttr({getLabel: 'override'}); await tick();
    f.row('folder').querySelector('button').click();
    assert.equal(f.row('folder').querySelector('.caption').textContent, 'Open folder');
    assert.ok(f.row('folder').querySelector('.caption').classList.contains('custom-open'));
    assert.match(f.row('folder').querySelector('.icon').getAttribute('part'), /custom-icon/);
    f.row('folder').querySelector('.row').click(); await tick();
    assert.equal(f.row('folder').querySelector('.caption').textContent, 'Open folder selected');
    assert.ok(f.row('folder').querySelector('.caption').classList.contains('selected-label'));
});


test('structured HTML labels are sanitized and raw labels remain text', async t => {
    class Logic {
        label(source, {item}) { return item.label === 'folder'
            ? {html: '<strong>Documents</strong><script>bad()</script><img src="x" onerror="bad()"><a href="javascript:bad()">bad link</a><button onclick="bad()">action</button>'}
            : {text: '<em>literal</em>'}; }
    }
    const f = fixture(t, {logic: Logic, attrs: {getLabel: 'label'}}); await tick();
    const caption = f.row('folder').querySelector('.caption');
    assert.equal(caption.querySelector('strong').textContent, 'Documents');
    assert.equal(caption.querySelector('script, button, [onerror], [onclick]'), null);
    assert.equal(caption.querySelector('a').hasAttribute('href'), false);
    assert.equal(f.row('other').querySelector('.caption').textContent, '<em>literal</em>');
    assert.equal(f.row('other').querySelector('em'), null);
    f.source.setAttr({getLabel: null});
    f.store.getNode('folder').setAttr({caption: '<strong>untrusted label</strong>'}); await tick();
    assert.equal(f.row('folder').querySelector('.caption strong'), null);
});

test('cached scalar resolver children remain lazy until requested', async t => {
    let reads = 0;
    class Scalar extends BagResolver { load() { reads++; return 42; } }
    const f = fixture(t, {attrs: {hideValues: false}}); await tick();
    f.store.setItem('number', new Scalar({cacheTime: -1})); await tick();
    assert.equal(reads, 0);
    assert.equal(f.row('number').querySelector('.value-node'), null);
    f.row('number').querySelector('button').click(); await tick(); await tick();
    assert.equal(reads, 1);
    assert.equal(f.row('number').querySelector('.value').textContent, '42');
    f.row('number').querySelector('button').click(); f.row('number').querySelector('button').click();
    await tick(); assert.equal(reads, 1);
});

const searchWait = () => new Promise(resolve => setTimeout(resolve, 230));
const shownPaths = f => [...f.host.shadowRoot.querySelectorAll('[role=treeitem]')]
    .filter(row => !row.closest('[hidden]')).map(row => row.dataset.path);

test('searchText matches literal captions, retains ancestors and restores expansion without selecting', async t => {
    const f=fixture(t,{attrs:{searchText:'^.search',autoCollapse:true}}); await tick();
    f.row('folder').querySelector('button').click();
    f.store.setItem('folder.special',null,{caption:'Use (A+B) safely'}); await tick();
    const original=shownPaths(f);
    f.app.data.setItem('model.search','(a+b)'); await searchWait();
    assert.deepEqual(shownPaths(f),['folder','folder.special']);
    assert.equal(f.row('folder.special').querySelector('mark').textContent,'(A+B)');
    assert.equal(f.app.data.getItem('model.selection'),null);
    f.app.data.setItem('model.search',''); await tick();
    assert.deepEqual(shownPaths(f),original);
    assert.equal(f.host.shadowRoot.querySelector('mark'),null);
});

test('searchText reads unopened nested resolvers, shares cached data and never changes original expansions', async t => {
    let reads=0;
    class Nested extends BagResolver {load(){reads++;return new Bag({needle:'found'});}}
    class Outer extends BagResolver {load(){reads++;const bag=new Bag();bag.setItem('deep',new Nested({cacheTime:-1}));return bag;}}
    const f=fixture(t,{attrs:{searchText:'^.search'}});await tick();
    f.store.setItem('lazy',new Outer({cacheTime:-1}));await tick();assert.equal(reads,0);
    f.app.data.setItem('model.search','needle');await searchWait();
    assert.deepEqual(shownPaths(f),['lazy','lazy.deep','lazy.deep.needle']);assert.equal(reads,2);
    f.app.data.setItem('model.search','');await tick();
    assert.equal(f.row('lazy').getAttribute('aria-expanded'),'false');
    f.app.data.setItem('model.search','needle');await searchWait();assert.equal(reads,2);
});

test('clearing or changing a pending search ignores late results and supports store replacement', async t => {
    let finish;
    class Pending extends BagResolver {load(){return new Promise(resolve=>{finish=resolve;});}}
    const f=fixture(t,{attrs:{searchText:'^.search'}});await tick();
    f.store.setItem('lazy',new Pending({cacheTime:-1}));await tick();
    f.app.data.setItem('model.search','needle');await searchWait();
    f.app.data.setItem('model.search','');await tick();
    finish(new Bag({needle:'result'}));await tick();await tick();await tick();
    assert.equal(f.row('lazy').getAttribute('aria-expanded'),'false');
    assert.equal(f.host.shadowRoot.querySelector('mark'),null);
    f.app.data.setItem('model.search','other');f.app.data.setItem('model.search','alpha');await searchWait();
    assert.deepEqual(shownPaths(f),['folder','folder.alpha']);
    f.app.data.setItem('model.nodes',new Bag({alpha:1,unrelated:2}));await tick();
    assert.deepEqual(shownPaths(f),['alpha']);
});

test('failed search branches remain visible for retry; HTML caption matches are marked safely', async t => {
    let reads=0;
    class Failing extends BagResolver {load(){reads++;throw new Error('offline');}}
    class Logic {label(source,{item}){return {html:`<b>${item.label}</b><script>bad()</script>`};}}
    const f=fixture(t,{attrs:{searchText:'^.search',getLabel:'label'},logic:Logic});await tick();
    f.store.setItem('lazy',new Failing({cacheTime:-1}));await tick();
    f.app.data.setItem('model.search','alpha');await searchWait();
    assert.equal(reads,1);assert.ok(shownPaths(f).includes('lazy'), f.host.control.outerHTML);
    assert.match(f.host.shadowRoot.querySelector('[role=status]').textContent,/could not be searched/);
    assert.equal(f.row('folder.alpha').querySelector('b mark').textContent,'alpha');
    assert.equal(f.host.shadowRoot.querySelector('.caption script'),null);
    f.app.data.setItem('model.search','zzzzz');await searchWait();assert.equal(reads,2);
    f.app.data.setItem('model.search','');await tick();
    f.store.popNode('lazy');await tick();f.app.data.setItem('model.search','zzzzz');await searchWait();
    assert.equal(f.host.shadowRoot.querySelector('[role=status]').textContent,'No matches');
});


test('search survives detaching before debounce and respects manual collapse on rerender', async t => {
    const f=fixture(t,{attrs:{searchText:'^.search'}}); await tick();
    f.app.data.setItem('model.search','alpha');
    const parent=f.host.parentNode; f.host.remove(); parent.append(f.host);
    await searchWait();
    assert.deepEqual(shownPaths(f),['folder','folder.alpha']);
    f.row('folder').querySelector('button').click();
    f.store.setItem('unrelated',null,{caption:'Unrelated'}); await tick();
    assert.deepEqual(shownPaths(f),['folder']);
    assert.equal(f.row('folder').getAttribute('aria-expanded'),'false');
    f.row('folder').querySelector('button').click();
    assert.deepEqual(shownPaths(f),['folder','folder.alpha']);
    f.app.data.setItem('model.search',''); await tick();
    assert.equal(f.row('folder').getAttribute('aria-expanded'),'false');
});


test('Python tree grammar matches the current component document', async () => {
    const grammar = JSON.parse(await readFile(new URL('../../src/gramlot/collections/tree.json', import.meta.url), 'utf8'));
    assert.deepEqual(grammar, tree.toDocument());
});

/** The drawn check state of the row at `path`: true, false or -1 (mixed). */
function checkState(f, path) {
    const input = f.row(path).firstElementChild.querySelector('input[type=checkbox]');
    return input.indeterminate ? -1 : input.checked;
}
const checkBox = (f, path) => f.row(path).firstElementChild.querySelector('input[type=checkbox]');
const withIds = store => {
    store.getNode('folder').setAttr({id: 'f'});
    store.getNode('folder.alpha').setAttr({id: 'a'});
    store.getNode('folder.beta').setAttr({id: 'b'});
    store.getNode('other').setAttr({id: 'c'});
};

test('checkedPaths uses a two-way binding and propagates across loaded children', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    checkBox(f, 'folder').click(); await tick();
    assert.deepEqual(['folder', 'folder.alpha', 'folder.beta'].map(path => checkState(f, path)), [true, true, true]);
    assert.equal(f.app.data.getItem('model.checked'), 'folder.alpha,folder.beta');
    checkBox(f, 'folder.alpha').click(); await tick();
    assert.equal(checkState(f, 'folder'), -1);
    assert.equal(f.row('folder').getAttribute('aria-checked'), 'mixed');
    assert.equal(f.app.data.getItem('model.checked'), 'folder.beta');
    checkBox(f, 'folder.beta').click(); await tick();
    assert.equal(checkState(f, 'folder'), false);
    assert.equal(f.app.data.getItem('model.checked'), '');
    f.app.data.setItem('model.checked', 'other'); await tick(); await tick();
    assert.equal(checkState(f, 'other'), true);
    assert.equal(checkState(f, 'folder.beta'), false);
    for (const path of ['folder', 'folder.alpha', 'other']) assert.equal(f.store.getNode(path).attr.checked, undefined);
});

test('a mixed branch unchecks on click, as the legacy toggle', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}, initialPaths: 'folder.alpha'}); await tick();
    assert.equal(checkState(f, 'folder'), -1);
    checkBox(f, 'folder').click(); await tick();
    assert.equal(checkState(f, 'folder'), false);
    assert.equal(f.app.data.getItem('model.checked'), '');
});

test('the checkedPaths list is the source of the checks and emptying it clears them', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}, initialPaths: 'folder'}); await tick();
    assert.deepEqual(['folder', 'folder.alpha', 'folder.beta', 'other'].map(path => checkState(f, path)), [true, true, true, false]);
    assert.equal(f.app.data.getItem('model.checked'), 'folder');
    f.app.data.setItem('model.checked', 'folder.beta,other'); await settle();
    assert.deepEqual(['folder', 'folder.alpha', 'folder.beta', 'other'].map(path => checkState(f, path)), [-1, false, true, true]);
    assert.equal(f.app.data.getItem('model.checked'), 'folder.beta,other');
    f.app.data.setItem('model.checked', ''); await settle();
    assert.deepEqual(['folder', 'folder.alpha', 'folder.beta', 'other'].map(path => checkState(f, path)), [false, false, false, false]);
    f.app.data.setItem('model.checked', 'other'); await settle();
    f.app.data.setItem('model.checked', null); await settle();
    assert.equal(checkState(f, 'other'), false);
});

test('checkChildren false leaves descendants independent and includes checked branches', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked', checkChildren: false}}); await tick();
    checkBox(f, 'folder').click(); await tick();
    assert.equal(checkState(f, 'folder'), true);
    assert.equal(checkState(f, 'folder.alpha'), false);
    assert.equal(f.app.data.getItem('model.checked'), 'folder');
    checkBox(f, 'folder.alpha').click(); await tick();
    assert.equal(checkState(f, 'folder'), true);
    assert.equal(f.app.data.getItem('model.checked'), 'folder,folder.alpha');
});

test('checking an unloaded branch lists its path without loading and its children follow the list', async t => {
    let loads = 0;
    class Lazy extends BagResolver { load() { loads++; return new Bag({child: 1}); } }
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    f.store.getItem('folder').setItem('lazy', new Lazy({cacheTime: -1})); await tick();
    checkBox(f, 'folder').click(); await tick();
    assert.equal(loads, 0);
    assert.equal(checkState(f, 'folder.lazy'), true);
    assert.equal(f.app.data.getItem('model.checked'), 'folder.alpha,folder.beta,folder.lazy');
    f.row('folder').querySelector('button').click();
    f.row('folder.lazy').querySelector('button').click(); await settle(); await settle();
    assert.equal(loads, 1);
    assert.equal(checkState(f, 'folder.lazy.child'), true);
    assert.equal(f.app.data.getItem('model.checked'), 'folder.alpha,folder.beta,folder.lazy');
});

test('children reloaded by a resolver with cacheTime 0 follow the list without memory', async t => {
    let loads = 0;
    class Lazy extends BagResolver { load() { loads++; return new Bag({child: 1, extra: loads}); } }
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    f.store.setItem('lazy', new Lazy()); await tick();
    const expand = async () => { f.row('lazy').querySelector('button').click(); await settle(); await settle(); };
    await expand();
    assert.equal(loads, 1);
    checkBox(f, 'lazy.child').click(); await tick();
    assert.equal(f.app.data.getItem('model.checked'), 'lazy.child');
    await expand(); await expand();
    assert.equal(loads, 2);
    assert.equal(checkState(f, 'lazy.child'), true);
    assert.equal(checkState(f, 'lazy.extra'), false);
    assert.equal(checkState(f, 'lazy'), -1);
    f.app.data.setItem('model.checked', 'lazy'); await settle();
    await expand(); await expand();
    assert.equal(loads, 3);
    assert.deepEqual(['lazy', 'lazy.child', 'lazy.extra'].map(path => checkState(f, path)), [true, true, true]);
    assert.equal(f.app.data.getItem('model.checked'), 'lazy');
    f.app.data.setItem('model.checked', ''); await settle();
    await expand(); await expand();
    assert.deepEqual(['lazy', 'lazy.child', 'lazy.extra'].map(path => checkState(f, path)), [false, false, false]);
});

test('a checked path below an unloaded branch is kept and checked when the branch loads', async t => {
    class Lazy extends BagResolver { load() { return new Bag({child: 1, sibling: 2}); } }
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    f.store.setItem('first', new Lazy({cacheTime: -1}));
    f.store.setItem('second', new Lazy({cacheTime: -1})); await tick();
    f.app.data.setItem('model.checked', 'first.child,second.child'); await settle();
    checkBox(f, 'other').click(); await tick();
    assert.equal(f.app.data.getItem('model.checked'), 'other,first.child,second.child');
    f.row('first').querySelector('button').click(); await settle(); await settle();
    assert.equal(checkState(f, 'first.child'), true);
    assert.equal(checkState(f, 'first'), -1);
    checkBox(f, 'second').click(); await tick();
    assert.equal(f.app.data.getItem('model.checked'), 'other,first.child,second');
});

test('checkChildren false does not propagate to a later resolved branch', async t => {
    class Lazy extends BagResolver { load() { return new Bag({child: 1}); } }
    const f = fixture(t, {attrs: {checkedPaths: '^.checked', checkChildren: false}}); await tick();
    f.store.setItem('lazy', new Lazy({cacheTime: -1})); await tick();
    checkBox(f, 'lazy').click(); await tick();
    f.row('lazy').querySelector('button').click(); await settle(); await settle();
    assert.equal(checkState(f, 'lazy.child'), false);
    assert.equal(checkState(f, 'lazy'), true);
    assert.equal(f.app.data.getItem('model.checked'), 'lazy');
});

test('space toggles the checkbox without selecting the tree row', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    f.row('other').dispatchEvent(new f.window.KeyboardEvent('keydown', {key: ' ', bubbles: true, cancelable: true})); await tick();
    assert.equal(checkState(f, 'other'), true);
    assert.equal(f.app.data.getItem('model.checked'), 'other');
    assert.equal(f.app.data.getItem('model.selection'), null);
});

test('disabled checkbox cannot be changed by a direct click or parent propagation', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    f.store.getNode('folder.beta').setAttr({checked: 'disabled:off'}); await tick();
    checkBox(f, 'folder').click(); await tick();
    assert.equal(f.store.getNode('folder.beta').attr.checked, 'disabled:off');
    assert.equal(checkBox(f, 'folder.beta').disabled, true);
    assert.equal(checkState(f, 'folder.beta'), false);
    assert.equal(checkState(f, 'folder'), -1);
    assert.equal(f.app.data.getItem('model.checked'), 'folder.alpha');
    checkBox(f, 'folder.beta').click(); await tick();
    assert.equal(f.app.data.getItem('model.checked'), 'folder.alpha');
    f.app.data.setItem('model.checked', 'folder'); await settle();
    assert.equal(checkState(f, 'folder.beta'), false);
});

test('a disabled:on node shows checked, is never listed and counts as checked for its parent', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    f.store.getNode('folder.beta').setAttr({checked: 'disabled:on'}); await tick();
    assert.equal(checkState(f, 'folder.beta'), true);
    assert.equal(checkState(f, 'folder'), -1);
    checkBox(f, 'folder.alpha').click(); await tick();
    assert.equal(checkState(f, 'folder'), true);
    assert.equal(f.app.data.getItem('model.checked'), 'folder.alpha');
});

test('onChecked Logic can veto without changing the Bag or checkedPaths', async t => {
    const calls = [];
    class Logic { check(source, {item, path}) { calls.push({source, item, path}); return false; } }
    const f = fixture(t, {attrs: {checkedPaths: '^.checked', onChecked: 'check'}, logic: Logic}); await tick();
    checkBox(f, 'other').click(); await tick();
    assert.equal(f.store.getNode('other').attr.checked, undefined);
    assert.equal(f.app.data.getItem('model.checked'), null);
    assert.equal(checkBox(f, 'other').checked, false);
    assert.equal(f.host.hasAttribute('onChecked'), false);
    assert.equal(calls[0].source, f.source);
    assert.equal(calls[0].item, f.store.getNode('other'));
    assert.equal(calls[0].path, 'other');
});

test('onChecked true without lists keeps the tree path list itself', async t => {
    const f = fixture(t, {attrs: {onChecked: true}}); await tick();
    checkBox(f, 'other').click(); await tick();
    assert.equal(checkState(f, 'other'), true);
    assert.equal(f.store.getNode('other').attr.checked, undefined);
    checkBox(f, 'folder').click(); await tick();
    assert.deepEqual(['folder.alpha', 'other'].map(path => checkState(f, path)), [true, true]);
});

for (const state of ['disabled:on', 'disabled:off']) {
    test(`external checkedPaths replacement preserves ${state} on nested nodes`, async t => {
        const f = fixture(t, {attrs: {checkedPaths: '^.checked'}, initialChecked: state});
        await tick();
        f.store.getNode('folder.beta').setAttr({checked: state});
        await tick();
        for (const paths of ['folder.alpha,folder.beta,other', '', 'folder.alpha', null, 'folder']) {
            f.app.data.setItem('model.checked', paths);
            await tick(); await tick();
            for (const path of ['other', 'folder.beta']) {
                assert.equal(f.store.getNode(path).attr.checked, state);
                assert.equal(checkBox(f, path).disabled, true);
                assert.equal(checkBox(f, path).checked, state === 'disabled:on');
            }
            assert.equal(checkState(f, 'folder.alpha'), Boolean(paths));
            assert.equal(f.app.data.getItem('model.checked'), paths);
        }
    });
}

test('checked_<attribute> writes the attribute values of the checked nodes and its list checks them', async t => {
    const f = fixture(t, {attrs: {checked_id: '.ids'}, prepare: withIds}); await tick();
    assert.equal(f.host.hasAttribute('checked_id'), false);
    checkBox(f, 'folder').click(); await tick();
    assert.equal(f.app.data.getItem('model.ids'), 'a,b');
    checkBox(f, 'folder.alpha').click(); await tick();
    assert.equal(f.app.data.getItem('model.ids'), 'b');
    f.app.data.setItem('model.ids', 'c,a'); await settle();
    assert.deepEqual(['folder', 'folder.alpha', 'folder.beta', 'other'].map(path => checkState(f, path)), [-1, true, false, true]);
    assert.equal(f.app.data.getItem('model.ids'), 'c,a');
    f.app.data.setItem('model.ids', 'f'); await settle();
    assert.deepEqual(['folder', 'folder.alpha', 'folder.beta', 'other'].map(path => checkState(f, path)), [true, true, true, false]);
    f.app.data.setItem('model.ids', ''); await settle();
    assert.deepEqual(['folder', 'folder.alpha', 'folder.beta', 'other'].map(path => checkState(f, path)), [false, false, false, false]);
});

test('checked_<attribute> takes its joiner after a colon, as in the legacy', async t => {
    const f = fixture(t, {attrs: {checked_id: '.ids:;', checkChildren: false}, prepare: withIds}); await tick();
    checkBox(f, 'folder').click(); await tick();
    checkBox(f, 'other').click(); await tick();
    assert.equal(f.app.data.getItem('model.ids'), 'f;c');
    f.app.data.setItem('model.ids', 'a;b'); await settle();
    assert.deepEqual(['folder', 'folder.alpha', 'folder.beta', 'other'].map(path => checkState(f, path)), [false, true, true, false]);
});

test('checked_<attribute> keeps values that no loaded node carries', async t => {
    class Lazy extends BagResolver { load() { const bag = new Bag(); bag.setItem('child', 1, {id: 'x'}); return bag; } }
    const f = fixture(t, {attrs: {checked_id: '.ids'}, prepare: withIds}); await tick();
    f.store.setItem('lazy', new Lazy({cacheTime: -1}), {id: 'l'}); await tick();
    f.app.data.setItem('model.ids', 'x'); await settle();
    checkBox(f, 'other').click(); await tick();
    assert.equal(f.app.data.getItem('model.ids'), 'c,x');
    f.row('lazy').querySelector('button').click(); await settle(); await settle();
    assert.equal(checkState(f, 'lazy.child'), true);
    checkBox(f, 'lazy').click(); await tick();
    assert.equal(f.app.data.getItem('model.ids'), 'c');
});

test('checkedPaths and checked_<attribute> stay consistent', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked', checked_id: '.ids'}, prepare: withIds, initialPaths: 'other'}); await tick();
    assert.equal(f.app.data.getItem('model.ids'), 'c');
    assert.equal(f.app.data.getItem('model.checked'), 'other');
    checkBox(f, 'folder').click(); await tick();
    assert.equal(f.app.data.getItem('model.checked'), 'folder.alpha,folder.beta,other');
    assert.equal(f.app.data.getItem('model.ids'), 'a,b,c');
    f.app.data.setItem('model.ids', 'b'); await settle();
    assert.deepEqual(['folder.alpha', 'folder.beta', 'other'].map(path => checkState(f, path)), [false, true, false]);
    assert.equal(f.app.data.getItem('model.checked'), 'folder.beta');
    f.app.data.setItem('model.checked', 'folder'); await settle();
    assert.equal(f.app.data.getItem('model.ids'), 'a,b');
    assert.equal(f.app.data.getItem('model.checked'), 'folder');
    f.app.data.setItem('model.checked', ''); await settle();
    assert.equal(f.app.data.getItem('model.ids'), '');
    assert.equal(checkState(f, 'folder'), false);
});

test('a child added under a fully checked branch is checked, as the legacy inherited check', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked', checked_id: '.ids'}, prepare: withIds}); await tick();
    checkBox(f, 'folder').click(); await tick();
    f.store.getItem('folder').setItem('late', 1, {id: 'l'}); await settle();
    assert.equal(checkState(f, 'folder.late'), true);
    assert.equal(checkState(f, 'folder'), true);
    assert.equal(f.store.getNode('folder.late').attr.checked, undefined);
    assert.equal(f.app.data.getItem('model.checked'), 'folder.alpha,folder.beta');
    assert.equal(f.app.data.getItem('model.ids'), 'a,b');
    checkBox(f, 'folder').click(); await tick();
    assert.deepEqual(['folder', 'folder.alpha', 'folder.late'].map(path => checkState(f, path)), [false, false, false]);
    f.store.getItem('folder').setItem('later', 2); await settle();
    assert.equal(checkState(f, 'folder.later'), false);
    f.app.data.setItem('model.checked', 'folder.alpha,folder.beta,folder.late,folder.later'); await settle();
    f.store.getItem('folder').setItem('latest', 3); await settle();
    assert.equal(checkState(f, 'folder.latest'), true);
    f.app.data.setItem('model.checked', ''); await settle();
    assert.equal(checkState(f, 'folder.latest'), false);
});

test('a child added under a partially checked branch stays unchecked', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    checkBox(f, 'folder.alpha').click(); await tick();
    f.store.getItem('folder').setItem('late', 1); await settle();
    assert.equal(checkState(f, 'folder.late'), false);
    assert.equal(checkState(f, 'folder'), -1);
});

test('children reloaded under a fully checked branch are checked', async t => {
    let loads = 0;
    class Lazy extends BagResolver { load() { loads++; return new Bag({[`child${loads}`]: 1}); } }
    const f = fixture(t, {attrs: {checkedPaths: '^.checked'}}); await tick();
    f.store.setItem('lazy', new Lazy()); await tick();
    const expand = async () => { f.row('lazy').querySelector('button').click(); await settle(); await settle(); };
    await expand();
    checkBox(f, 'lazy').click(); await tick();
    assert.equal(f.app.data.getItem('model.checked'), 'lazy.child1');
    await expand(); await expand();
    assert.equal(checkState(f, 'lazy.child2'), true);
});

test('a check publishes the legacy <nodeId>_checked topic before the lists are written', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked', nodeId: 'places'}}); await tick();
    const events = [];
    f.app.subscribe('places_checked', payload => events.push({...payload, list: f.app.data.getItem('model.checked')}));
    checkBox(f, 'folder').click(); await tick();
    assert.equal(events.length, 1);
    assert.equal(events[0].item, f.store.getNode('folder'));
    assert.equal(events[0].path, 'folder');
    assert.equal(events[0].checked, true);
    assert.equal(events[0].list, null);
    checkBox(f, 'folder').click(); await tick();
    assert.equal(events[1].checked, false);
    f.app.data.setItem('model.checked', 'other,folder.alpha'); await settle();
    assert.deepEqual(events.slice(2).map(({path, checked}) => [path, checked]), [['other', true], ['folder.alpha', true]]);
});

test('_valuelabel goes on the Data node of every written list, as in the legacy', async t => {
    const f = fixture(t, {attrs: {checkedPaths: '^.checked', checked_id: '.ids', _valuelabel: 'Places'}, prepare: withIds}); await tick();
    checkBox(f, 'other').click(); await tick();
    assert.equal(f.app.data.getItem('model.checked'), 'other');
    assert.equal(f.app.data.getNode('model.checked').attr._valuelabel, 'Places');
    assert.equal(f.app.data.getNode('model.ids').attr._valuelabel, 'Places');
});

test('checked_<attribute> requires a Data path', async t => {
    assert.throws(() => fixture(t, {attrs: {checked_id: '^.ids'}}), /tree checked_id requires a Data path/);
});

test('search stops at loop nodes without loading or exposing matching descendants', async t => {
    let calls = 0;
    class Lazy extends BagResolver { load() { calls++; return new Bag({needle: null}); } }
    const f = fixture(t, {attrs: {searchText: '^.search'}}); await tick();
    f.store.setItem('looping', new Lazy({cacheTime: -1}), {loop: true});
    const children = new Bag({needle: null}); f.store.setItem('cached', children, {loop: true});
    f.app.data.setItem('model.search', 'needle'); await searchWait(); await settle();
    assert.equal(calls, 0);
    assert.equal(f.row('cached.needle').hidden, true);
    assert.equal(f.row('cached').getAttribute('aria-expanded'), 'false');
});

test('excludeRoot omits only its root branch from rendering and resolver search', async t => {
    const f=fixture(t,{attrs:{excludeRoot:'__editor'}});
    let resolutions=0;
    class PrivateBranch extends BagResolver {
        load(){resolutions++;return new Bag({private:'secret'});}
    }
    f.store.setItem('__editor',new Bag({catalogue:new PrivateBranch()}));
    f.store.setItem('folder.__editor','ordinary nested data');
    await tick();
    assert.equal(f.row('__editor'),undefined);
    assert.ok(f.row('folder.__editor'));
    f.source.setAttr({searchText:'secret'});
    await new Promise(resolve=>setTimeout(resolve,250));
    assert.equal(resolutions,0);
    assert.equal(f.row('__editor'),undefined);
    assert.ok(f.store.getNode('__editor'), 'exclusion must not modify the store');
    f.source.setAttr({excludeRoot:null,searchText:''});
    await tick();
    assert.ok(f.row('__editor'));
});

test('tree observes the live Source root and nested Source bags', async t => {
    const f = fixture(t, {attrs: {storepath: '*S.pane'}});
    await tick();
    assert.ok(f.row('tree'));
    const pane = f.app.src.source.getItem('main.pane');
    f.app.src.builder.wrapSource(pane).span('Hello', {node_label: 'newNode'});
    await tick();
    assert.ok(f.row('newNode'));
    pane.getNode('newNode').setAttr({caption: 'Changed'});
    await tick();
    assert.match(f.row('newNode').textContent, /Changed/);
    pane.popNode('newNode');
    await tick();
    assert.equal(f.row('newNode'), undefined);
    f.source.setAttr({storepath: '*S'});
    await tick();
    assert.ok(f.row('pane'));
});

test('tree switches from a live Source subtree back to relative Data', async t => {
    const f = fixture(t, {attrs: {storepath: '*S.pane', labelAttribute: null}});
    const pane = f.app.src.source.getItem('main.pane');
    const preview = f.app.src.builder.wrapSource(pane).div({node_label: 'preview'});
    preview.span('First', {node_label: 'first'});
    f.source.setAttr({storepath: '*S.pane.preview'});
    await tick();
    assert.ok(f.row('first'));
    preview.getValue(true).popNode('first');
    await tick();
    assert.equal(f.row('first'), undefined);
    preview.span('Second', {node_label: 'second'});
    await tick();
    assert.ok(f.row('second'));
    f.source.setAttr({storepath: '.nodes'});
    let treeProjections = 0;
    const project = f.app.src.renderer.project.bind(f.app.src.renderer);
    f.app.src.renderer.project = (node, ...args) => {
        if (node === f.source) treeProjections++;
        return project(node, ...args);
    };
    pane.getNode('preview').setAttr({title: 'Changed outside Data'});
    assert.equal(treeProjections, 0);
    f.store.setItem('liveData', 'Value');
    await tick();
    assert.ok(f.row('liveData'));
    assert.ok(treeProjections > 0);
});

test('tree observes Data root and absolute subpaths selected with *D', async t => {
    const f = fixture(t, {attrs: {storepath: '*D', labelAttribute: null}});
    await tick();
    assert.ok(f.row('model'));
    f.app.data.setItem('another', 'Value');
    await tick();
    assert.ok(f.row('another'));
    f.source.setAttr({storepath: '*D.model.nodes'});
    await tick();
    assert.ok(f.row('folder'));
    f.store.setItem('later', 'Value');
    await tick();
    assert.ok(f.row('later'));
    f.app.data.setItem('model.nodes', new Bag({replacement: 'Value'}));
    await tick();
    assert.ok(f.row('replacement'));
    assert.equal(f.row('later'), undefined);
});

test('search and selection use real Source nodes, and removing the tree releases it', async t => {
    const f = fixture(t, {attrs: {storepath: '*S', labelAttribute: null, searchText: '^.search'}});
    const pane = f.app.src.source.getItem('main.pane');
    f.app.src.builder.wrapSource(pane).span('Hello', {node_label: 'uniqueSourceNode'});
    f.app.data.setItem('model.search', 'uniqueSourceNode');
    await new Promise(resolve => setTimeout(resolve, 250));
    assert.ok(f.row('pane.uniqueSourceNode'));
    assert.equal(f.row('pane.uniqueSourceNode').querySelector('mark').textContent, 'uniqueSourceNode');
    const row = f.row('pane.uniqueSourceNode');
    row.querySelector('.row').click();
    await tick();
    assert.equal(f.app.data.getItem('model.selection'), 'pane.uniqueSourceNode');
    pane.popNode('tree');
    f.app.src.builder.wrapSource(pane).span('Later', {node_label: 'later'});
    assert.equal(f.host.isConnected, false);
});

test('searchEager limits search to loaded nodes until enabled, independently from resolveLazy', async t => {
    let reads=0;
    class Lazy extends BagResolver {load(){reads++;return new Bag({needle:'found'});}}
    const f=fixture(t,{attrs:{searchText:'^.search',searchEager:'^.eager',resolveLazy:'^.resolve'}});
    f.app.data.setItem('model.resolve',true);f.app.data.setItem('model.eager',false);
    f.store.setItem('lazy',new Lazy({cacheTime:-1}));
    f.store.setItem('loaded',new Bag({needle:'cached'}));
    f.app.data.setItem('model.search','needle');await searchWait();
    assert.equal(reads,0);assert.ok(shownPaths(f).includes('loaded.needle'));
    f.app.data.setItem('model.resolve',false);f.app.data.setItem('model.eager',true);await searchWait();
    assert.equal(reads,0);
    f.app.data.setItem('model.resolve',true);await searchWait();
    assert.equal(reads,1);assert.ok(shownPaths(f).includes('lazy.needle'));
    f.app.data.setItem('model.eager',false);await tick();
    assert.ok(shownPaths(f).includes('lazy.needle'));assert.equal(reads,1);
});

test('disabling eager search during a request does not resolve its new descendants', async t => {
    let finish,reads=0;
    class Inner extends BagResolver {load(){reads++;return new Bag({needle:'found'});}}
    class Outer extends BagResolver {load(){return new Promise(resolve=>{finish=resolve;});}}
    const f=fixture(t,{attrs:{searchText:'^.search',searchEager:'^.eager'}});
    f.app.data.setItem('model.eager',true);f.store.setItem('lazy',new Outer({cacheTime:-1}));
    f.app.data.setItem('model.search','needle');await searchWait();
    f.app.data.setItem('model.eager',false);
    const children=new Bag();children.setItem('inner',new Inner({cacheTime:-1}));finish(children);
    await searchWait();assert.equal(reads,0);
    f.app.data.setItem('model.eager',true);await searchWait();assert.equal(reads,1);
});

test('searchAttributes includes configured text and tag arrays without changing captions or searching unrelated attributes', async t => {
    const f=fixture(t,{attrs:{searchText:'^.search',searchAttributes:'description,tags,component'}});await tick();
    f.store.setItem('lesson',null,{description:'Multiple selection',tags:['checkbox','hierarchical'],component:'checkBoxText',privateNote:'secret'});
    for (const query of ['multiple','hierarchical','checkboxtext']) {
        f.app.data.setItem('model.search',query);await searchWait();assert.ok(shownPaths(f).includes('lesson'));
        assert.equal(f.row('lesson').querySelector('.caption').textContent,'lesson');
    }
    f.app.data.setItem('model.search','secret');await searchWait();assert.ok(!shownPaths(f).includes('lesson'));
    f.app.data.setItem('model.search','later');await searchWait();assert.ok(!shownPaths(f).includes('lesson'));
    f.store.getNode('lesson').setAttr({tags:['later']});await tick();await tick();assert.ok(shownPaths(f).includes('lesson'));
});

test('expansion follows the tree path when a branch value is replaced', async t => {
    const f = fixture(t);
    f.store.setItem('folder', new Bag({sub: new Bag({x: 'X'})}));
    await settle();
    f.row('folder').querySelector('.expander').click(); await settle();
    f.row('folder.sub').querySelector('.expander').click(); await settle();
    assert.equal(f.row('folder.sub').getAttribute('aria-expanded'), 'true');
    f.store.setItem('folder', new Bag({sub: new Bag({y: 'Y'}), more: new Bag({z: 'Z'})}));
    await settle();
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'true');
    assert.equal(f.row('folder.sub').getAttribute('aria-expanded'), 'true', 'a new node at an expanded path stays expanded');
    assert.equal(f.row('folder.more').getAttribute('aria-expanded'), 'false');
    f.store.popNode('folder');
    await settle();
    f.store.setItem('folder', new Bag({sub: new Bag({y: 'Y'})}));
    await settle();
    assert.equal(f.row('folder').getAttribute('aria-expanded'), 'false', 'a removed path forgets its expansion');
});
