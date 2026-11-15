import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import grid from '../src/components/grid.js';
import inputs from '../src/components/inputs.js';
import layout from '../src/components/layout.js';
import {layoutWindow} from './helpers/layout-window.js';

const collections = [inputs, layout, grid];
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const PUBLISHED = {selectedId:'^.sel.id', selectedIndex:'^.sel.index', selectedLabel:'^.sel.label', selectedPkeys:'^.sel.pkeys',
    selectedRowidx:'^.sel.rowidx', selectedNodes:'^.sel.nodes', selectedRowData:'^.sel.row', selected_kind:'^.sel.kinds'};

async function mount(t, {mode = 'values', grid: gridAttrs = {}, frame = null, editable = false, datapath = 'model'}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const layoutFrames = layoutWindow(window);
    for (const name of ['showPopover', 'hidePopover', 'scrollIntoView']) window.HTMLElement.prototype[name] = function() {};
    const app = new Gramlot({document:window.document, transport:false, collections, locale:'en-US'});
    grid.registerCommands(app);
    const errors = [];
    t.mock.method(app.src.binding, 'reportError', error => errors.push(error.message));
    t.after(() => { app.dispose(); window.close(); });
    const records = [{name:'Alpha', kind:'a', amount:1}, {name:'Beta', kind:'b', amount:2}, {name:'Gamma', kind:'a', amount:3}];
    const rows = new Bag();
    records.forEach((record, index) => rows.setItem(`r${index + 1}`, mode === 'values' ? new Bag(record) : null, mode === 'values' ? {} : record));
    app.data.setItem('model', new Bag({rows}));
    const builder = new GramlotBuilder(null, {collections});
    let gridNode;
    if (frame) {
        const composed = builder.root.frameGrid({node_label:'orders', ...(datapath ? {datapath} : {}), storepath:datapath ? '.rows' : 'model.rows', rowMode:mode, ...frame, ...gridAttrs});
        gridNode = composed.grid;
    } else gridNode = builder.root.div({node_label:'pane', ...(datapath ? {datapath} : {})}).grid({node_label:'grid', storepath:datapath ? '.rows' : 'model.rows', rowMode:mode, ...gridAttrs});
    const struct = gridNode.struct();
    struct.column({field:'name', ...(editable ? {edit:true} : {})});
    struct.column({field:'kind'});
    struct.column({field:'amount', dtype:'L', totalize:datapath ? true : 'model.total'});
    app.src.startSource(builder.toTytx());
    await tick(); layoutFrames.flush(); await tick();
    const source = frame ? app.src.source.getNode('main.orders').value.getNode('center').value.getNode('grid')
        : app.src.source.getNode('main.pane.grid');
    const element = app.dom.getDomNode(source);
    const published = [];
    const subscriptions = app.src.binding.subscriptions;
    subscriptions.subscribe(subscriptions.topicFor(source, 'onSelectedRow'), payload => published.push(payload));
    const settle = async () => { await tick(); layoutFrames.flush(); await tick(); };
    const tr = label => element.shadowRoot.querySelector(`tr[data-row="${label}"]`);
    const click = async (label, modifiers = {}) => {
        tr(label).querySelector('td').dispatchEvent(new window.MouseEvent('click', {bubbles:true, composed:true, ...modifiers}));
        await settle();
    };
    const key = async (keyName, modifiers = {}) => {
        element.shadowRoot.querySelector('.body-viewport').dispatchEvent(new window.KeyboardEvent('keydown', {key:keyName, bubbles:true, composed:true, ...modifiers}));
        await settle();
    };
    const selected = () => [...element.shadowRoot.querySelectorAll('tbody tr[aria-selected=true]')].map(row => row.dataset.row);
    return {app, window, rows, source, element, published, click, key, selected, tr, errors, settle, data:path => app.data.getItem(`model.${path}`)};
}

for (const mode of ['values', 'attributes']) test(`${mode}: multi selection publishes the legacy Data paths and onSelectedRow`, async t => {
    const f = await mount(t, {mode, grid:PUBLISHED});
    assert.equal(f.element.control.getAttribute('aria-multiselectable'), 'true');
    assert.deepEqual(f.selected(), []);
    await f.click('r2');
    assert.deepEqual(f.selected(), ['r2']);
    assert.equal(f.tr('r2').getAttribute('part'), 'row selected-row');
    assert.deepEqual([f.data('sel.id'), f.data('sel.index'), f.data('sel.label'), f.data('sel.pkeys'), f.data('selectionLength')], ['r2', 1, 'r2', ['r2'], 1]);
    await f.click('r3', {ctrlKey:true});
    assert.deepEqual(f.data('sel.pkeys'), ['r2', 'r3']);
    assert.equal(f.data('sel.kinds'), 'b,a', 'distinct values of the field over the selected rows');
    await f.click('r3', {metaKey:true});
    assert.deepEqual(f.data('sel.pkeys'), ['r2'], 'Cmd+click toggles off');
    await f.click('r3');
    await f.click('r1', {shiftKey:true});
    assert.deepEqual(f.selected(), ['r1', 'r2', 'r3'], 'Shift+click selects the range from the anchor');
    assert.equal(f.data('sel.id'), 'r1');
    assert.equal(f.data('sel.rowidx'), '0,1,2');
    const nodes = f.app.data.getNode('model.sel.nodes');
    assert.equal(nodes.getAttr('count'), 3);
    assert.deepEqual(nodes.value.getNode('r2').getAttr(), {name:'Beta', kind:'b', amount:2});
    assert.equal(f.data('sel.row').getItem('name'), 'Alpha');
    assert.deepEqual(f.published.at(-1), {idx:0, selectedId:'r1', selectedPkeys:['r1', 'r2', 'r3']});
    await f.click('r2');
    await f.key('a', {ctrlKey:true});
    assert.deepEqual(f.selected(), ['r1', 'r2', 'r3'], 'Ctrl+A selects every visible row');
    assert.deepEqual(f.errors, []);
});

test('keyboard: Up/Down move the current row, Shift extends; single mode ignores toggles and ranges', async t => {
    const f = await mount(t, {grid:{selectedId:'^.sel.id'}});
    await f.key('ArrowDown');
    assert.deepEqual(f.selected(), ['r1']);
    await f.key('ArrowDown');
    await f.key('ArrowDown', {shiftKey:true});
    assert.deepEqual(f.selected(), ['r2', 'r3']);
    assert.equal(f.data('sel.id'), 'r3');
    await f.key('ArrowUp');
    assert.deepEqual(f.selected(), ['r2']);

    const g = await mount(t, {grid:{selectionMode:'single', selectedId:'^.sel.id'}});
    assert.equal(g.element.control.hasAttribute('aria-multiselectable'), false);
    await g.click('r1');
    await g.click('r3', {ctrlKey:true});
    await g.click('r2', {shiftKey:true});
    await g.key('a', {metaKey:true});
    assert.deepEqual(g.selected(), ['r2']);
    await g.key('ArrowDown', {shiftKey:true});
    assert.deepEqual(g.selected(), ['r3']);
});

test('selectionMode none selects nothing and exposes no aria-selected', async t => {
    const f = await mount(t, {grid:{selectionMode:'none', selectedId:'^.sel.id'}});
    await f.click('r1');
    await f.key('ArrowDown');
    assert.equal(f.element.shadowRoot.querySelectorAll('tbody tr[aria-selected]').length, 0);
    assert.equal(f.data('sel.id'), null);
    assert.equal(f.published.length, 0);
});

test('a sort keeps the selection; rows excluded by a filter leave it', async t => {
    const f = await mount(t, {grid:{selectedPkeys:'^.sel.pkeys'}});
    await f.click('r1'); await f.click('r3', {ctrlKey:true});
    f.source._internal.gridCollectionView.sort('amount:d');
    await f.settle();
    assert.deepEqual(f.data('sel.pkeys'), ['r1', 'r3'], 'a sort does not change the selection');
    assert.deepEqual(f.selected(), ['r3', 'r1']);
    f.source._internal.gridCollectionView.applyColumnFilter('kind', ['a']);
    f.source._internal.gridCollectionView.applyColumnFilter('name', ['Gamma']);
    await f.settle();
    assert.deepEqual(f.data('sel.pkeys'), ['r3']);
    assert.equal(f.data('selectionLength'), 1);
});

for (const mode of ['values', 'attributes']) test(`${mode}: a replacement at the store path keeps the selected keys still present, the sort and the filter`, async t => {
    const f = await mount(t, {mode, grid:{selectedPkeys:'^.sel.pkeys', selectedId:'^.sel.id'}});
    await f.click('r1'); await f.click('r3', {ctrlKey:true});
    f.source._internal.gridCollectionView.sort('amount:d');
    f.source._internal.gridCollectionView.applyColumnFilter('kind', ['a']);
    await f.settle();
    assert.deepEqual(f.selected(), ['r3', 'r1']);
    const replacement = new Bag();
    for (const [key, record] of [['r3', {name:'Gamma 2', kind:'a', amount:30}], ['r4', {name:'Delta', kind:'a', amount:40}], ['r2', {name:'Beta 2', kind:'b', amount:20}]]) {
        replacement.setItem(key, mode === 'values' ? new Bag(record) : null, mode === 'values' ? {} : record);
    }
    f.app.data.setItem('model.rows', replacement);
    await f.settle();
    assert.deepEqual([...f.element.shadowRoot.querySelectorAll('tbody tr[data-row]')].map(row => row.dataset.row), ['r4', 'r3'],
        'sort and filter apply to the replacement');
    assert.deepEqual(f.selected(), ['r3'], 'the key r3 stays selected; r1 left the collection');
    assert.deepEqual(f.data('sel.pkeys'), ['r3']);
    assert.equal(f.data('sel.id'), 'r3');
    assert.deepEqual(f.errors, []);
});

test('double-click still edits a selected row; arrows in an open editor move the editor, not the selection', async t => {
    const f = await mount(t, {grid:{selectedId:'^.sel.id'}, editable:true});
    const cell = f.tr('r1').querySelector('td[data-field="name"]');
    cell.dispatchEvent(new f.window.MouseEvent('click', {bubbles:true, composed:true}));
    cell.dispatchEvent(new f.window.MouseEvent('dblclick', {bubbles:true, composed:true}));
    await f.settle();
    const editor = f.element.querySelector('[slot=cell-editor] gramlot-textbox');
    assert.ok(editor, 'the editor opens');
    assert.equal(f.data('sel.id'), 'r1');
    editor.control.dispatchEvent(new f.window.KeyboardEvent('keydown', {key:'ArrowDown', bubbles:true, composed:true}));
    await f.settle();
    assert.equal(f.data('sel.id'), 'r1', 'the selection does not move while editing');
});

test('duprow and delrow act on the selected rows through the editing session; totals follow', async t => {
    const f = await mount(t, {frame:{duprow:true, delrow:true, gridsemaphore:true}, editable:true});
    const frameNode = f.app.src.source.getNode('main.orders');
    const bar = frameNode.value.getNode('top').value.getNode('bar');
    const press = async label => {
        f.app.dom.getDomNode(bar.value.getNode(label)).control.dispatchEvent(new f.window.MouseEvent('click', {bubbles:true, composed:true}));
        await f.settle();
    };
    assert.equal(f.data('totalize.amount'), 6);
    assert.equal(f.data('selectedId'), null);
    await f.click('r2'); await f.click('r3', {ctrlKey:true});
    assert.equal(f.data('selectedId'), 'r3', 'frameGrid publishes selectedId at .selectedId; Ctrl+click makes the row current');
    await press('duprow');
    assert.deepEqual(f.errors, []);
    const labels = f.rows.getNodes().map(node => node.label);
    assert.equal(labels.length, 5);
    assert.deepEqual(f.rows.getNodes().slice(3).map(node => node.value.getItem('name')), ['Beta', 'Gamma']);
    assert.ok(labels.slice(3).every(label => /^r_[0-9a-f]{32}$/.test(label)), 'duplicates get new identities');
    assert.equal(f.data('totalize.amount'), 11);
    const session = frameNode.formState;
    assert.equal(session.registers.getItem('changes').length, 2);
    await f.click('r1'); await f.click('r2', {ctrlKey:true});
    await press('delrow');
    assert.deepEqual(f.rows.getNodes().map(node => node.label), labels.filter(label => !['r1', 'r2'].includes(label)));
    assert.equal(f.data('totalize.amount'), 8);
    assert.equal(f.data('selectionLength'), 0, 'deleted rows leave the selection');
    assert.equal(session.registers.getItem('changes').length, 4);
});

test('duprow or delrow with selectionMode none is an explicit error', async t => {
    const f = await mount(t, {frame:{delrow:true}, grid:{selectionMode:'none'}, editable:true});
    assert.ok(f.errors.some(message => /grid tool 'grid:delrow' requires selectionMode single or multi/.test(message)), f.errors.join('; '));
});

test('an unknown selectionMode is an error', async t => {
    const f = await mount(t, {grid:{selectionMode:'many'}});
    assert.ok(f.errors.some(message => /selectionMode requires none, single or multi/.test(message)), f.errors.join('; '));
});

for (const frame of [null, {}]) test(`a ${frame ? 'frameGrid' : 'grid'} without a datapath context selects rows and writes no .selectionLength`, async t => {
    const f = await mount(t, {frame, datapath:null, grid:{selectedPkeys:'^model.sel.pkeys'}});
    await f.click('r2'); await f.click('r3', {ctrlKey:true});
    assert.deepEqual(f.selected(), ['r2', 'r3']);
    assert.deepEqual(f.data('sel.pkeys'), ['r2', 'r3']);
    assert.deepEqual(f.published.at(-1), {idx:2, selectedId:'r3', selectedPkeys:['r2', 'r3']});
    f.source._internal.gridCollectionView.applyColumnFilter('kind', ['a']);
    await f.settle();
    assert.deepEqual(f.data('sel.pkeys'), ['r3']);
    assert.equal(f.app.data.getItem('selectionLength'), null);
    assert.deepEqual(f.errors, []);
});
