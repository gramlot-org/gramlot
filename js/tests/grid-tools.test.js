import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {JSDOM, VirtualConsole} from 'jsdom';
import {fromTytx} from '@genrojs/tytx';
import {strFromU8, unzipSync} from 'fflate';
import {SourceBag} from '@genrojs/builders';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import grid from '../src/components/grid.js';
import inputs from '../src/components/inputs.js';
import layout from '../src/components/layout.js';
import {layoutWindow} from './helpers/layout-window.js';

const collections = [inputs, layout, grid];
const tick = () => new Promise(resolve => setTimeout(resolve, 0));

function valueRows(records) {
    const rows = new Bag();
    records.forEach((record, index) => rows.setItem(`r${index + 1}`, new Bag(record)));
    return rows;
}

async function mount(t, {tools, editable = true, mode = 'values', records = [{name:'Beta', quantity:2, price:3}, {name:'Alpha', quantity:1, price:5}, {name:'Gamma', quantity:4, price:1}]}) {
    const printed = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', error => printed.push(error.message));
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {virtualConsole});
    const layoutFrames = layoutWindow(window);
    for (const name of ['showPopover', 'hidePopover', 'scrollIntoView']) window.HTMLElement.prototype[name] = function() {};
    const app = new Gramlot({document:window.document, transport:false, collections, locale:'en-US'});
    grid.registerCommands(app);
    const errors = [];
    t.mock.method(app.src.binding, 'reportError', error => errors.push(error.message));
    t.after(() => { app.dispose(); window.close(); });
    const rows = mode === 'values' ? valueRows(records) : new Bag();
    if (mode === 'attributes') records.forEach((record, index) => rows.setItem(`r${index + 1}`, null, record));
    app.data.setItem('model', new Bag({rows}));
    const builder = new GramlotBuilder(null, {collections});
    const frame = builder.root.frameGrid({node_label:'orders', datapath:'model', storepath:'.rows', rowMode:mode, ...tools});
    const struct = frame.grid.struct();
    struct.column({field:'name', name:'Name', ...(editable ? {edit:true} : {})});
    struct.column({field:'quantity', name:'Qty', dtype:'L', ...(editable ? {edit:true} : {})});
    struct.column({field:'price', name:'Price', dtype:'L'});
    struct.column({field:'total', name:'Total', dtype:'L', formula:'quantity * price', calculated:true, totalize:true});
    app.src.startSource(builder.toTytx());
    await tick(); layoutFrames.flush(); await tick();
    const source = app.src.source.getNode('main.orders');
    const gridNode = source.value.getNode('center').value.getNode('grid');
    const find = (node, label) => {
        if (node.label === label && node.nodeTag === 'menuline') return node;
        for (const child of node.value instanceof SourceBag ? node.value.getNodes() : []) {
            const found = find(child, label);
            if (found) return found;
        }
        return null;
    };
    const click = async label => {
        app.dom.getDomNode(find(source, label)).control.dispatchEvent(new window.MouseEvent('click', {bubbles:true, composed:true}));
        await tick(); layoutFrames.flush(); await tick();
    };
    return {app, window, rows, source, gridNode, find, click, errors, printed, element:app.dom.getDomNode(gridNode)};
}

async function exported(t, format, mode = 'values') {
    const f = await mount(t, {mode, tools:{export:true}});
    const saved = [];
    t.mock.method(f.app.utl.inout, 'saveText', (content, filename, type) => saved.push({content, filename, type}));
    f.gridNode.gridCollectionView.sort('name:a');
    f.gridNode.gridCollectionView.applyColumnFilter('quantity', [1, 2]);
    await tick();
    await f.click(format);
    for (let i = 0; i < 20 && !saved.length; i++) await tick();
    assert.deepEqual(f.errors, []);
    assert.equal(saved.length, 1);
    return saved[0];
}

test('export CSV: visible rows in view order, captions and shown values', async t => {
    assert.deepEqual(await exported(t, 'csv'), {filename:'grid.csv', type:'text/csv',
        content:'Name,Qty,Price,Total\r\nAlpha,1,5,5\r\nBeta,2,3,6\r\n'});
});

test('export JSON: an array of objects keyed by field with raw values', async t => {
    const saved = await exported(t, 'json');
    assert.equal(saved.filename, 'grid.json');
    assert.deepEqual(JSON.parse(saved.content), [{name:'Alpha', quantity:1, price:5, total:5}, {name:'Beta', quantity:2, price:3, total:6}]);
});

for (const mode of ['values', 'attributes']) test(`${mode}: export TYTX and XML round-trip the visible rows shaped like the store`, async t => {
    const tytx = await exported(t, 'tytx', mode);
    assert.equal(tytx.filename, 'grid.tytx');
    const rows = fromTytx(tytx.content);
    assert.deepEqual(rows.getNodes().map(node => node.label), ['r2', 'r1']);
    const read = (bag, label, field) => mode === 'values' ? bag.getItem(`${label}.${field}`) : bag.getNode(label).getAttr(field);
    assert.equal(read(rows, 'r1', 'quantity'), 2, 'typed values');
    const xml = await exported(t, 'xml', mode);
    assert.equal(xml.filename, 'grid.xml');
    assert.match(xml.content, /^<\?xml version='1.0' encoding='UTF-8'\?>/);
    const parsed = Bag.fromXml(xml.content);
    assert.deepEqual(parsed.getNodes().map(node => node.label), ['r2', 'r1']);
    assert.equal(String(read(parsed, 'r2', 'name')), 'Alpha');
    assert.equal(String(read(parsed, 'r1', 'total')), '6');
});

test('export Excel: an XLSX workbook with captions and typed cells, loaded on first use', async t => {
    const saved = await exported(t, 'xlsx');
    assert.equal(saved.filename, 'grid.xlsx');
    assert.equal(saved.type, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const files = unzipSync(new Uint8Array(await saved.content.arrayBuffer()));
    const text = name => strFromU8(files[name]);
    const sheet = text('xl/worksheets/sheet1.xml');
    const strings = files['xl/sharedStrings.xml'] ? text('xl/sharedStrings.xml') : sheet;
    for (const caption of ['Name', 'Qty', 'Price', 'Total', 'Alpha', 'Beta']) assert.ok(strings.includes(caption), caption);
    assert.ok(!strings.includes('Gamma'), 'filtered rows are not exported');
    assert.match(sheet, /<c r="B2"[^>]*><v>1<\/v><\/c>/, 'numbers are numeric cells');
});

test('printRows prints the visible rows as a plain table', async t => {
    const f = await mount(t, {tools:{printRows:true}, records:[{name:'A "quoted", name', quantity:1, price:2}]});
    await f.click('printRows');
    const frame = f.window.document.querySelector('iframe.gramlot-grid-print');
    const cells = [...frame.contentDocument.querySelectorAll('tr')].map(row => [...row.children].map(cell => cell.textContent));
    assert.deepEqual(cells, [['Name', 'Qty', 'Price', 'Total'], ['A "quoted", name', '1', '2', '2']]);
    assert.ok(f.printed.some(message => /print/.test(message)), 'the frame print was requested');
});

test('advancedTools toggles the row numbers and lists export and print', async t => {
    const f = await mount(t, {tools:{advancedTools:true, export:true, printRows:true}});
    const menu = f.find(f.source, 'advancedTools').value.getNodes()[0].value.getNodes().map(node => node.getAttr('command'));
    assert.deepEqual(menu, ['grid:lineNumbers', null, 'grid:printRows']);
    const formats = f.find(f.source, 'advancedTools').value.getNodes()[0].value.getNode('export').value.getNodes()[0].value.getNodes();
    assert.deepEqual(formats.map(node => [node.getAttr('caption'), node.getAttr('parameters').format]),
        [['CSV', 'csv'], ['JSON', 'json'], ['TYTX', 'tytx'], ['XML', 'xml'], ['Excel', 'xlsx']]);
    assert.equal(f.element.shadowRoot.querySelectorAll('tbody th[scope=row]').length, 0);
    await f.click('lineNumbers');
    assert.deepEqual(f.errors, []);
    assert.equal(f.gridNode.getAttr('rowHeaders'), true);
    assert.deepEqual([...f.element.shadowRoot.querySelectorAll('tbody th[scope=row]')].map(cell => cell.textContent), ['1', '2', '3']);
    await f.click('lineNumbers');
    assert.equal(f.element.shadowRoot.querySelectorAll('tbody th[scope=row]').length, 0);
});

test('addrow appends a row with its defaults; formulas, totals and the editing session react', async t => {
    const f = await mount(t, {tools:{addrow:true, addrow_defaults:{name:'New', quantity:3, price:7}, gridsemaphore:true}});
    assert.equal(f.app.data.getItem('model.totalize.total'), 15);
    await f.click('addrow');
    assert.deepEqual(f.errors, []);
    const added = f.rows.getNodes().at(-1);
    assert.match(added.label, /^r_[0-9a-f]{32}$/);
    assert.equal(added.value.getItem('name'), 'New');
    assert.equal(added.value.getItem('total'), 21, 'the formula computes on the new row');
    assert.equal(f.app.data.getItem('model.totalize.total'), 36, 'the total includes the new row');
    const session = f.source.formState;
    assert.equal(f.gridNode.formState, session, 'the grid edits within the frame session');
    const changes = session.registers.getItem('changes').getNodes().map(node => node.value);
    assert.deepEqual(changes.map(change => [change.getItem('path'), change.getItem('existed'), change.getItem('exists')]),
        [[`rows.${added.label}`, false, true]], 'the new row is the only change; formula results and totals are derived');
    const status = f.window.document.querySelector('gramlot-editing-status');
    assert.equal(status.shadowRoot.querySelector('[data-kind=changes] .count').textContent, String(changes.length));
});

test('an edit tool on a grid without editable columns is an explicit error', async t => {
    const f = await mount(t, {tools:{addrow:true}, editable:false});
    assert.ok(f.errors.some(message => /grid tool 'grid:addrow' requires an editable column/.test(message)), f.errors.join('; '));
    const g = await mount(t, {tools:{gridsemaphore:true}, editable:false});
    assert.ok(g.errors.some(message => /grid editing status requires an editable column/.test(message)), g.errors.join('; '));
});

test('frameGrid tool switches are checked during authoring', () => {
    const b = new GramlotBuilder(null, {collections});
    assert.throws(() => b.root.frameGrid({storepath:'rows', rowMode:'values', export:'csv,yes'}), /export format 'yes' is not one of csv, json, tytx, xml, xlsx/);
    assert.throws(() => b.root.frameGrid({storepath:'rows', rowMode:'values', export:1}), /export requires a boolean or a list of formats/);
    const restricted = b.root.frameGrid({storepath:'rows', rowMode:'values', export:'csv,json'});
    assert.deepEqual(restricted.value.getNode('top').value.getNode('bar').value.getNode('export').value.getNodes()[0].value.getNodes()
        .map(node => node.getAttr('parameters').format), ['csv', 'json']);
    assert.throws(() => b.root.frameGrid({storepath:'rows', rowMode:'values', addrow_defaults:{a:1}}), /addrow_defaults requires addrow/);
    assert.throws(() => b.root.frameGrid({storepath:'rows', rowMode:'values', gridsemaphore:true}), /gridsemaphore frameGrid requires its own datapath/);
});

const TOOLS = {node_label:'orders', datapath:'model', storepath:'.rows', rowMode:'values', searchOn:true, export:true, printRows:true,
    advancedTools:true, addrow:true, addrow_defaults:{quantity:1}, gridsemaphore:true};

test('Python and JS frameGrid compose the same toolbar tools', () => {
    const root = new URL('../../', import.meta.url).pathname;
    const wire = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? `${root}.venv/bin/python`, ['-c', `
from gramlot import GramlotBuilder
from importlib.resources import files
import json
b=GramlotBuilder(collections=[json.loads(files('gramlot').joinpath('collections/'+name+'.json').read_text()) for name in ['inputs','layout','grid']])
b.root.frameGrid(**json.loads(${JSON.stringify(JSON.stringify(TOOLS))}))
print(b.to_tytx())
`], {encoding:'utf8'}).trim();
    const b = new GramlotBuilder(null, {collections});
    b.root.frameGrid({...TOOLS});
    const shape = bag => bag.getNodes().map(node => ({label:node.label, tag:node.nodeTag,
        attrs:node.getAttr(), children:node.staticValue instanceof SourceBag ? shape(node.staticValue) : node.staticValue}));
    assert.deepEqual(shape(fromTytx(wire)), shape(b.source));
});

const changePaths = session => session.registers.getItem('changes').getNodes().map(node => node.value.getItem('path'));

for (const mode of ['values', 'attributes']) test(`${mode}: formula results and totals are derived values, never session changes`, async t => {
    const f = await mount(t, {mode, tools:{gridsemaphore:true}});
    const session = f.source.formState;
    const read = (label, field) => mode === 'values' ? f.rows.getItem(`${label}.${field}`) : f.rows.getNode(label).getAttr(field);
    assert.equal(read('r1', 'total'), 6);
    assert.equal(f.app.data.getItem('model.totalize.total'), 15);
    assert.deepEqual(changePaths(session), [], 'a grid with formulas and totals loads clean');
    assert.equal(session.status.dirty, false);

    if (mode === 'values') f.rows.getItem('r1').setItem('quantity', 5);
    else f.rows.getNode('r1').setAttr({quantity:5});
    await tick(); await tick();
    assert.equal(read('r1', 'total'), 15);
    assert.equal(f.app.data.getItem('model.totalize.total'), 24);
    assert.deepEqual(changePaths(session), [mode === 'values' ? 'rows.r1.quantity' : 'rows.r1'], 'one change on the source field');
    if (mode === 'attributes') {
        assert.deepEqual(Object.keys(session.registers.getItem('changes').getNodes()[0].value.getItem('currentAttributes').asDict()).toSorted(),
            ['name', 'price', 'quantity'], 'derived attributes are not part of the change');
    }

    session.restore();
    await tick(); await tick(); await tick();
    const rows = f.app.data.getItem('model.rows');
    assert.equal(mode === 'values' ? rows.getItem('r1.quantity') : rows.getNode('r1').getAttr('quantity'), 2, 'restore brings back the source value');
    assert.equal(mode === 'values' ? rows.getItem('r1.total') : rows.getNode('r1').getAttr('total'), 6, 'the formula recomputes');
    assert.equal(f.app.data.getItem('model.totalize.total'), 15, 'the total recomputes');
    assert.deepEqual(changePaths(session), []);
    assert.equal(session.status.dirty, false);
});
