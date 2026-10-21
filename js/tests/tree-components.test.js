import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, BagResolver} from '@genrojs/bag';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import tree, {Tree} from '../src/components/tree.js';
import {defineCollection, defineComponent} from '../src/components/registry.js';

const tick = () => new Promise(resolve => queueMicrotask(resolve));
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
function nativeDrag(f, type, path, dataTransfer) {
    const event = new f.window.Event(type, {bubbles: true, composed: true, cancelable: true});
    Object.defineProperty(event, 'dataTransfer', {value: dataTransfer});
    (path === null ? f.host : f.row(path).querySelector('.row')).dispatchEvent(event);
    return event;
}
function fixture(t, {collection = tree, tag = 'tree', two = false, attrs = {}, logic = null} = {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false, collections: [collection]});
    const children = new Bag({alpha: 'A', beta: 'B'});
    const store = new Bag({folder: children, other: 'C'});
    store.getNode('folder').setAttr({caption: 'Folder'});
    app.data.setItem('model.nodes', store);
    app.data.setItem('model.selection', null);
    const b = new GramlotBuilder(null, {collections: [collection]});
    const pane = b.root.div({datapath: 'model', node_label: 'pane'});
    pane[tag]({id: 'tree', node_label: 'tree', storepath: '.nodes',
        labelAttribute: 'caption', hideValues: true, selectedPath: '^.selection', ...attrs});
    if (two) pane[tag]({id: 'second', node_label: 'second', storepath: '.nodes', hideValues: true, selectedPath: '^.otherSelection'});
    if (logic) app.src.logicRegistry.register(logic, {group: null, resource: '/tree-test.js'});
    app.src.startSource(b.toTytx());
    t.after(() => {app.dispose(); window.close();});
    const host = window.document.getElementById('tree');
    return {window, app, store, host, source: app.src.source.getNode('main.pane.tree'),
        row: path => [...host.shadowRoot.querySelectorAll('[role=treeitem]')].find(row => row.dataset.path === path)};
}

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
    t.mock.method(console, 'error', () => {});
    let mode = 'veto', ends = 0;
    class Logic { prepare() { if (mode === 'error') throw new Error('Preparation failed'); return false; } }
    const f = fixture(t, {attrs: {nodeId: 'dragTree', draggable: true, onDrag: 'prepare'}, logic: Logic}); await tick();
    f.app.subscribe('dragTree_endDrag', () => { ends++; });
    for (mode of ['veto', 'error']) {
        const data = transfer(); assert.equal(nativeDrag(f, 'dragstart', 'folder', data).defaultPrevented, true);
        nativeDrag(f, 'dragend', 'folder', data); await tick();
        assert.equal(f.host.shadowRoot.querySelector('.draggedItem'), null);
    }
    assert.equal(ends, 0); assert.equal(console.error.mock.callCount(), 1);
});

test('eligibility errors reject and clean the gesture; end callback errors still publish completion', async t => {
    t.mock.method(console, 'error', () => {});
    let ends = 0;
    class Logic { check() { throw new Error('Check failed'); } ended() { throw new Error('End callback failed'); } }
    const f = fixture(t, {attrs: {nodeId: 'dragTree', draggable: true, dropTypes: '*', dropTargetCb: 'check', onDragEnd: 'ended'}, logic: Logic}); await tick();
    f.app.subscribe('dragTree_endDrag', () => { ends++; });
    const data = transfer(); nativeDrag(f, 'dragstart', 'folder', data); nativeDrag(f, 'dragover', 'other', data);
    assert.equal(data.dropEffect, 'none'); assert.equal(data.image.isConnected, false);
    assert.equal(f.host.shadowRoot.querySelector('.canBeDropped,.cannotBeDropped'), null);
    nativeDrag(f, 'dragend', 'folder', data); await tick(); await tick();
    assert.equal(ends, 1); assert.equal(console.error.mock.callCount(), 2);
});

test('action errors do not roll back Data or redefine the browser effect as operation success', async t => {
    t.mock.method(console, 'error', () => {});
    let ending;
    class Logic { receive(source, {item}) { item.setAttr({caption: 'Written before failure'}); throw new Error('Action failed'); } }
    const f = fixture(t, {attrs: {nodeId: 'dragTree', draggable: true, dropTarget: true, dropTypes: 'nodeattr', onDrop: 'receive'}, logic: Logic}); await tick();
    f.app.subscribe('dragTree_endDrag', context => { ending = context; });
    const data = transfer(); nativeDrag(f, 'dragstart', 'folder', data); nativeDrag(f, 'drop', 'other', data); await tick(); await tick();
    assert.equal(data.image.isConnected, false);
    assert.equal(f.row('other').querySelector('.caption').textContent, 'Written before failure');
    nativeDrag(f, 'dragend', 'folder', data); await tick();
    assert.equal(ending.dropEffect, 'move'); assert.equal(console.error.mock.callCount(), 1);
});

test('a late rejected async action cannot clear a subsequent active drag', async t => {
    t.mock.method(console, 'error', () => {});
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

test('bagStore routing uses capability metadata, not the tree tag name', async t => {
    const collection = defineCollection({name: 'testTree', components: [
        defineComponent({...Tree, name: 'outline', tag: 'test-outline'})
    ]});
    const f = fixture(t, {collection, tag: 'outline'}); await tick();
    f.store.setItem('newNode', 1); await tick(); assert.ok(f.row('newNode'));
    assert.equal(collection.toDocument().elements.outline._meta.gramlot_component.bagStore, true);
    assert.throws(() => f.host.setStoreBag({}), /must resolve to a Bag/);
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
