import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import {createDecimal, isDecimal} from '@genrojs/tytx';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import grid from '../src/components/grid.js';
import inputs from '../src/components/inputs.js';
import {GridStructure} from '../src/components/grid-structure.js';
import {layoutWindow} from './helpers/layout-window.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

function dataStruct(cells) {
    const bag = new Bag();
    bag.setItem('view_0', new Bag(), {tag:'view'});
    bag.getItem('view_0').setItem('rows_0', new Bag(), {tag:'rows'});
    bag.setItem('info', new Bag());
    bag.getItem('info').setItem('columnsets', new Bag());
    for (const attrs of cells) bag.getItem('view_0.rows_0').setItem(`cell_${attrs.field}`, null, {tag:'cell', ...attrs});
    return bag;
}

function valueRows(records) {
    const rows = new Bag();
    records.forEach((record, index) => rows.setItem(`r${index + 1}`, new Bag(record)));
    return rows;
}

function attributeRows(records) {
    const rows = new Bag();
    records.forEach((record, index) => rows.setItem(`r${index + 1}`, null, record));
    return rows;
}

/** One page with grids on `model.rows`; `columns` is inline Source, `struct` a Data structure. */
async function mount(t, {rows, mode = 'values', columns = null, struct = null, data = {}, grids = ['first'], footer = false, extra = {}}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const layout = layoutWindow(window);
    for (const name of ['showPopover','hidePopover','scrollIntoView']) window.HTMLElement.prototype[name] = function() {};
    const failures = [];
    window.addEventListener('error', event => failures.push(event.error));
    const app = new Gramlot({document:window.document, transport:false, collections:[inputs, grid], locale:'en-US'});
    app.data.setItem('model', new Bag({rows, ...data}));
    if (struct) app.data.setItem('model.struct', struct);
    const builder = new GramlotBuilder(null, {collections:[inputs, grid]});
    const pane = builder.root.div({node_label:'pane', datapath:'model'});
    for (const spec of grids) {
        const {id, structpath = null} = typeof spec === 'string' ? {id:spec} : spec;
        const g = pane.grid({id, node_label:id, storepath:'.rows', rowMode:mode, footer,
            ...(structpath ? {structpath} : struct ? {structpath:'.struct'} : {}), ...extra});
        if (columns && !structpath) columns(g.struct());
    }
    app.src.startSource(builder.toTytx());
    await tick(); layout.flush(); await tick();
    t.after(() => { app.dispose(); window.close(); assert.deepEqual(failures, []); });
    const host = id => window.document.getElementById(id);
    const settle = async () => { await tick(); layout.flush(); await tick(); };
    return {app, window, rows, host, settle, layout, source:id => app.src.source.getNode(`main.pane.${id}`)};
}

test('calculated formulas chain in dependency order and keep Decimal precision; hidden formulas still calculate', async t => {
    const rows = valueRows([
        {quantity:createDecimal('9007199254740993'), price:createDecimal('1.1')},
        {quantity:createDecimal('0.1'), price:createDecimal('0.2')},
        {quantity:null, price:createDecimal('0.2')},
    ]);
    // grand is declared before its dependencies: evaluation follows the field graph.
    const struct = dataStruct([
        {field:'grand', formula:'total + tax', calculated:true, dtype:'N'},
        {field:'quantity', dtype:'N'}, {field:'price', dtype:'N'},
        {field:'tax', formula:'total * rate / 100', formula_rate:'^.rate', calculated:true, hidden:true},
        {field:'total', formula:'quantity * price', calculated:true, dtype:'N'},
    ]);
    const f = await mount(t, {rows, struct, data:{rate:createDecimal('10')}});
    for (const path of ['r1.total', 'r1.tax', 'r1.grand', 'r2.total']) assert.ok(isDecimal(rows.getItem(path)), path);
    assert.equal(rows.getItem('r1.total').toString(), '9907919180215092.3');
    assert.equal(rows.getItem('r1.tax').toString(), '990791918021509.23');
    assert.equal(rows.getItem('r1.grand').toString(), '10898711098236601.53');
    assert.equal(rows.getItem('r2.total').toString(), '0.02');
    assert.equal(rows.getItem('r3.total'), null);
    assert.equal(rows.getItem('r3.grand'), null);
    const headers = [...f.host('first').shadowRoot.querySelectorAll('th[scope=col]')].map(cell => cell.dataset.field);
    assert.deepEqual(headers, ['grand', 'quantity', 'price', 'total'], 'a hidden column is not displayed');

    rows.getItem('r2').setItem('quantity', createDecimal('0.3'));
    assert.equal(rows.getItem('r2.total').toString(), '0.06');
    assert.equal(rows.getItem('r2.grand').toString(), '0.066');
    f.app.data.setItem('model.rate', createDecimal('12.5'));
    assert.equal(rows.getItem('r2.tax').toString(), '0.0075', 'a ^ parameter triggers recalculation');
    assert.equal(rows.getItem('r2.grand').toString(), '0.0675');
    assert.equal(f.host('first').formulaErrors.size, 0);
});

test('formulas from the Source: = parameters read without triggering, failures store null, equal results are not written', async t => {
    const rows = valueRows([{quantity:2, price:3, deferred:99, broken:12}]);
    const f = await mount(t, {rows, data:{offset:1}, columns:s => {
        s.column({field:'quantity'}); s.column({field:'price'});
        s.column({field:'deferred', formula:'quantity * price', calculated:false});
        s.column({field:'broken', formula:'quantity + missing', calculated:true});
        s.column({field:'passive', formula:'quantity + offset', formula_offset:'=.offset', calculated:true});
        s.column({field:'rounded', formula:'Math.max(quantity, price) + bonus', formula_bonus:10, calculated:true});
    }});
    assert.equal(rows.getItem('r1.deferred'), 99, 'calculated=false does not initialize');
    assert.equal(rows.getItem('r1.broken'), null);
    assert.match(f.host('first').formulaErrors.get('broken').message, /missing/);
    assert.equal(rows.getItem('r1.passive'), 3);
    assert.equal(rows.getItem('r1.rounded'), 13, 'globals and literal parameters resolve');

    f.app.data.setItem('model.offset', 5);
    assert.equal(rows.getItem('r1.passive'), 3, 'a = parameter does not trigger recalculation');
    rows.getItem('r1').setItem('quantity', 4);
    assert.equal(rows.getItem('r1.deferred'), 12);
    assert.equal(rows.getItem('r1.passive'), 9, 'a row dependency reads the current = parameter');
    let writes = 0;
    rows.getItem('r1').subscribe('formula-writes', {any:event => { if (event.node?.label === 'deferred') writes++; }});
    rows.getItem('r1').setItem('price', 3);
    assert.equal(writes, 0, 'an equal result is not written back');
    rows.getItem('r1').popNode('quantity');
    assert.equal(rows.getItem('r1.deferred'), null);
    rows.getItem('r1').setItem('quantity', 5);
    assert.equal(rows.getItem('r1.deferred'), 15, 'inserting a field triggers its formulas');
});

test('from a Data structure an arithmetic formula computes with plain numbers; a non-arithmetic formula is not compiled (inline code rule)', async t => {
    const rows = valueRows([{quantity:2, price:3}, {quantity:7, price:2}]);
    const struct = dataStruct([{field:'quantity'}, {field:'price'},
        {field:'total', formula:'(quantity * price - 1) % 4 + 2 ** 3 / 2', calculated:true},
        {field:'larger', formula:'Math.max(quantity, price)', calculated:true}]);
    const f = await mount(t, {rows, struct});
    assert.equal(rows.getItem('r1.total'), (2 * 3 - 1) % 4 + 2 ** 3 / 2, 'JavaScript number semantics');
    assert.equal(rows.getItem('r2.total'), (7 * 2 - 1) % 4 + 2 ** 3 / 2);
    rows.getItem('r1').setItem('price', 10);
    assert.equal(rows.getItem('r1.total'), (2 * 10 - 1) % 4 + 4);
    assert.equal(rows.getItem('r1.larger'), null);
    assert.match(f.host('first').formulaErrors.get('larger').message,
        /grid 'first' 'struct\.larger\.formula': inline code runs only as received with the Source/);
});

const shown = (f, id, field) => [...f.host(id).shadowRoot.querySelectorAll('tbody tr')]
    .map(tr => [tr.dataset.row, tr.querySelector(`td[data-field="${field}"]`).textContent]);

for (const mode of ['values', 'attributes']) test(`${mode}: # and += are view values of each grid; %= is written once into the rows`, async t => {
    const records = [{amount:createDecimal('0.1')}, {amount:createDecimal('0.2')}, {amount:createDecimal('0.7')}];
    const rows = mode === 'values' ? valueRows(records) : attributeRows(records);
    const read = field => rows.getNodes().map(node => {
        const value = mode === 'values' ? node.value.getItem(field) : node.getAttr(field);
        return isDecimal(value) ? value.toString() : value;
    });
    let shareWrites = 0;
    const f = await mount(t, {rows, mode, grids:['first', 'second'], columns:s => {
        s.column({field:'position', formula:'#'});
        s.column({field:'amount', dtype:'N'});
        s.column({field:'running', dtype:'N', formula:'+=amount'});
        s.column({field:'next', dtype:'N', formula:'running + amount', calculated:true});
        s.column({field:'share', dtype:'N', formula:'%=amount', calculated:true});
    }});
    rows.subscribe('share-writes', {any:event => {
        if (event.node?.label === 'share' || Object.hasOwn(event.attrs_diff ?? {}, 'share')) shareWrites++;
    }});
    f.source('second').gridCollectionView.sort('amount:d');
    await f.settle();
    assert.deepEqual(shown(f, 'first', 'position'), [['r1', '1'], ['r2', '2'], ['r3', '3']]);
    assert.deepEqual(shown(f, 'first', 'running'), [['r1', '0.1'], ['r2', '0.3'], ['r3', '1']]);
    assert.deepEqual(shown(f, 'second', 'position'), [['r3', '1'], ['r2', '2'], ['r1', '3']]);
    assert.deepEqual(shown(f, 'second', 'running'), [['r3', '0.7'], ['r2', '0.9'], ['r1', '1']]);
    assert.deepEqual(shown(f, 'second', 'next'), [['r3', '1.4'], ['r2', '1.1'], ['r1', '1.1']], 'a formula over += is a view value');
    const stored = field => rows.getNodes().some(node => mode === 'values' ? node.value.getNode(field) !== null : Object.hasOwn(node.getAttr(), field));
    for (const field of ['position', 'running', 'next']) assert.equal(stored(field), false, `${field} is not written into the rows`);
    assert.deepEqual(read('share'), ['10', '20', '70']);

    const set = (label, value) => mode === 'values' ? rows.getItem(label).setItem('amount', value) : rows.getNode(label).setAttr({amount:value});
    set('r1', createDecimal('0.3'));
    await f.settle();
    assert.deepEqual(read('share'), ['25', '16.666666666666666667', '58.333333333333333333']);
    assert.equal(shareWrites, 3, 'one write per changed share for both grids');
    assert.deepEqual(shown(f, 'first', 'running'), [['r1', '0.3'], ['r2', '0.5'], ['r3', '1.2']], 'every mounted row shows the new running sum');
    assert.deepEqual(shown(f, 'second', 'running'), [['r3', '0.7'], ['r1', '1'], ['r2', '1.2']]);
    rows.popNode('r3');
    await f.settle();
    assert.deepEqual(shown(f, 'second', 'position'), [['r1', '1'], ['r2', '2']]);
    assert.deepEqual(read('share'), ['60', '40']);
});

test('a grid sorted by a formula field shows # in the order produced by the formula write', async t => {
    const rows = valueRows([{quantity:1, price:5}, {quantity:2, price:2}]);
    const f = await mount(t, {rows, extra:{sortedBy:'total:d'}, columns:s => {
        s.column({field:'position', formula:'#'});
        s.column({field:'quantity', dtype:'L'}); s.column({field:'price', dtype:'L'});
        s.column({field:'total', dtype:'L', formula:'quantity * price', calculated:true});
    }});
    await f.settle();
    assert.deepEqual(shown(f, 'first', 'position'), [['r1', '1'], ['r2', '2']]);
    rows.getItem('r2').setItem('quantity', 4);
    await f.settle();
    assert.equal(rows.getItem('r2.total'), 8);
    assert.deepEqual(shown(f, 'first', 'position'), [['r2', '1'], ['r1', '2']]);
});

test('under a filter # and += cover the visible rows 1..n, marked with filtered-numbering also on row headers', async t => {
    const rows = valueRows([{amount:1, kind:'a'}, {amount:2, kind:'b'}, {amount:3, kind:'a'}, {amount:4, kind:'b'}, {amount:5, kind:'a'}]);
    const f = await mount(t, {rows, extra:{rowHeaders:true}, columns:s => {
        s.column({field:'position', formula:'#'});
        s.column({field:'kind'});
        s.column({field:'amount', dtype:'L', totalize:true});
        s.column({field:'running', dtype:'L', formula:'+=amount', totalize:true});
    }});
    const marked = () => [...f.host('first').shadowRoot.querySelectorAll('tbody .filtered-numbering')]
        .map(cell => cell.localName === 'th' ? 'header' : cell.dataset.field);
    assert.deepEqual(marked(), []);
    f.source('first').gridCollectionView.applyColumnFilter('kind', ['a']);
    await f.settle();
    assert.deepEqual(shown(f, 'first', 'position'), [['r1', '1'], ['r3', '2'], ['r5', '3']]);
    assert.deepEqual(shown(f, 'first', 'running'), [['r1', '1'], ['r3', '4'], ['r5', '9']]);
    assert.deepEqual(marked(), ['header', 'position', 'running', 'header', 'position', 'running', 'header', 'position', 'running']);
    assert.equal(f.app.data.getItem('model.totalize.running'), 14, 'totals read the view values of the visible rows');
    assert.equal(f.app.data.getItem('model.totalize.amount'), 15, 'stored totals keep every resident row');
    f.source('first').gridCollectionView.applyColumnFilter('kind', null);
    await f.settle();
    assert.deepEqual(shown(f, 'first', 'position'), [['r1', '1'], ['r2', '2'], ['r3', '3'], ['r4', '4'], ['r5', '5']]);
    assert.deepEqual(marked(), []);
});

for (const mode of ['values', 'attributes']) test(`${mode}: a formula parameter =#ROW.<field> reads the field of each row by key, through sorting and filtering`, async t => {
    const records = [{code:'a', amount:1, factor:10}, {code:'b', amount:2, factor:20}, {code:'c', amount:3, factor:30}];
    const rows = mode === 'values' ? valueRows(records) : attributeRows(records);
    const f = await mount(t, {rows, mode, columns:s => {
        s.column({field:'position', formula:'#'});
        s.column({field:'code'}); s.column({field:'amount', dtype:'L'});
        // factor is not a column: the parameter reads it at the row address.
        s.column({field:'total', dtype:'L', formula:'amount * k', formula_k:'=#ROW.factor', calculated:true});
        s.column({field:'scaled', dtype:'L', formula:'position * k', formula_k:'=#ROW.factor'});
    }});
    await f.settle();
    const stored = label => mode === 'values' ? rows.getItem(`${label}.total`) : rows.getNode(label).getAttr('total');
    assert.deepEqual(['r1', 'r2', 'r3'].map(stored), [10, 40, 90], 'a data formula reads the factor of its own row');
    assert.deepEqual(shown(f, 'first', 'scaled'), [['r1', '10'], ['r2', '40'], ['r3', '90']]);
    const view = f.source('first').gridCollectionView;
    view.sort('amount:d');
    await f.settle();
    assert.deepEqual(shown(f, 'first', 'scaled'), [['r3', '30'], ['r2', '40'], ['r1', '30']], 'the row key, not the rendered index, selects the row');
    view.applyColumnFilter('code', ['a', 'c']);
    await f.settle();
    assert.deepEqual(shown(f, 'first', 'scaled'), [['r3', '30'], ['r1', '20']]);
    if (mode === 'values') rows.getItem('r1').setItem('factor', 5);
    else rows.getNode('r1').setAttr({factor:5});
    if (mode === 'values') rows.getItem('r1').setItem('amount', 4);
    else rows.getNode('r1').setAttr({amount:4});
    await f.settle();
    assert.equal(stored('r1'), 20, 'a recalculation reads the current field of the row');
    assert.deepEqual(shown(f, 'first', 'scaled'), [['r1', '5'], ['r3', '60']]);
});

test('a formula parameter ^#ROW has no registration: the grid reports the error at each projection', async t => {
    const rows = valueRows([{amount:1, factor:2}]);
    const struct = dataStruct([{field:'amount', dtype:'L'}]);
    const f = await mount(t, {rows, struct});
    const errors = [];
    t.mock.method(f.app.src.binding, 'reportError', (error, title) => errors.push(`${title}: ${error.message}`));
    struct.getItem('view_0.rows_0').setItem('cell_total', null, {tag:'cell', field:'total', dtype:'L', formula:'amount * k', formula_k:'^#ROW.factor', calculated:true});
    await f.settle();
    assert.equal(errors.length, 1);
    assert.match(errors[0], /^Grid refresh: #ROW: no row context for \^#ROW\.factor/);
    assert.equal(rows.getItem('r1.total'), null, 'nothing is calculated');
    rows.getItem('r1').setItem('amount', 3);
    await f.settle();
    assert.equal(errors.length, 2, 'the next projection reports it again');
});

test('sorting, column-filtering or searching a view value is an explicit error', async t => {
    const rows = valueRows([{amount:1}, {amount:2}]);
    const f = await mount(t, {rows, extra:{columnFilters:true}, columns:s => {
        s.column({field:'position', formula:'#'});
        s.column({field:'amount', dtype:'L'});
        s.column({field:'running', dtype:'L', formula:'+=amount'});
    }});
    const errors = [];
    t.mock.method(f.app.src.binding, 'reportError', error => errors.push(error.message));
    const host = f.host('first'), view = f.source('first').gridCollectionView;
    assert.equal(host.shadowRoot.querySelector('th[data-field="position"] .column-filter-button, th[data-field="position"] button'), null,
        'no column filter button on a view value');
    assert.ok(host.shadowRoot.querySelector('th[data-field="amount"] button'));
    assert.deepEqual(f.source('first').gridSearch.columns.map(column => column.field), ['amount']);
    host.shadowRoot.querySelector('th[data-field="position"]').click();
    assert.match(errors.at(-1), /grid cannot sort by the view value 'position'/);
    view.sort('running:d');
    await f.settle();
    assert.match(errors.at(-1), /grid cannot sort by the view value 'running'/);
    view.sort('');
    view.applyColumnFilter('position', [1]);
    await f.settle();
    assert.match(errors.at(-1), /grid cannot filter the view value 'position'/);
    view.applyColumnFilter('position', null);
    view.applyFilter({value:'1', columns:['running'], dtype:'T', locale:'en-US'});
    await f.settle();
    assert.match(errors.at(-1), /grid cannot search the view value 'running'/);
});

test('a column accepts its declared attributes and formula_<name> only, in JS authoring too', () => {
    const s = new GramlotBuilder(null, {collections:[inputs, grid]}).root.grid({storepath:'rows', rowMode:'values'}).struct();
    assert.equal(s.column({field:'total', formula:'a * rate', formula_rate:2}).getAttr('formula_rate'), 2);
    for (const attrs of [{sum:true}, {'formula-rate':1}, {formulas_rate:1}, {formula_:1}]) {
        assert.throws(() => s.column({field:'other', formula:'a * rate', ...attrs}), /unknown attribute/, JSON.stringify(attrs));
    }
});

test('dependency cycles are rejected; unsupported Decimal expressions fail explicitly', async t => {
    const cycle = dataStruct([{field:'a', formula:'b + 1', calculated:true}, {field:'b', formula:'a + 1', calculated:true}]);
    assert.throws(() => new GridStructure(cycle), /dependency cycle at 'a'/);
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    const app = new Gramlot({document:window.document, transport:false, collections:[inputs, grid]});
    t.after(() => { app.dispose(); window.close(); });
    const builder = new GramlotBuilder(null, {collections:[inputs, grid]});
    const s = builder.root.grid({storepath:'rows', rowMode:'values'}).struct();
    s.column({field:'a', formula:'b + 1'}); s.column({field:'b', formula:'a + 1'});
    assert.throws(() => app.src.startSource(builder.toTytx()), /dependency cycle/);

    const rows = valueRows([{amount:createDecimal('9007199254740993.25')}]);
    const f = await mount(t, {rows, columns:s => {
        s.column({field:'amount', dtype:'N'}); s.column({field:'rounded', formula:'Math.round(amount)', calculated:true});
    }});
    assert.equal(rows.getItem('r1.rounded'), null);
    assert.match(f.host('first').formulaErrors.get('rounded').message, /Decimal grid formulas support arithmetic expressions only/);
});

test('D1: an editing draft does not recalculate; the committed value does', async t => {
    const rows = valueRows([{quantity:2, price:3}]);
    const f = await mount(t, {rows, columns:s => {
        s.column({field:'quantity', dtype:'L', edit:true}); s.column({field:'price', dtype:'L'});
        s.column({field:'total', dtype:'L', formula:'quantity * price', calculated:true});
    }});
    assert.equal(rows.getItem('r1.total'), 6);
    const host = f.host('first');
    host.shadowRoot.querySelector('tr[data-row="r1"] td[data-field="quantity"]').dispatchEvent(new f.window.MouseEvent('dblclick', {bubbles:true}));
    await f.settle();
    const editor = host.querySelector('[slot=cell-editor] gramlot-number-text-box');
    editor.control.value = '5';
    editor.control.dispatchEvent(new f.window.Event('input', {bubbles:true}));
    await f.settle();
    assert.equal(f.source('first').formState.registers.getItem('drafts').length, 1);
    assert.equal(rows.getItem('r1.quantity'), 2);
    assert.equal(rows.getItem('r1.total'), 6, 'a draft does not recalculate');
    editor.control.dispatchEvent(new f.window.Event('change', {bubbles:true}));
    await f.settle();
    assert.equal(rows.getItem('r1.quantity'), 5);
    assert.equal(rows.getItem('r1.total'), 15, 'the committed value recalculates');
});

test('footer totals use every resident row, publish to Data and format; booleans count as 0/1', async t => {
    const records = Array.from({length:1000}, (_unused, index) => ({amount:index + 1, done:index % 2 === 0, price:createDecimal('0.1')}));
    const rows = valueRows(records);
    const f = await mount(t, {rows, footer:'Grand total', columns:s => {
        s.column({field:'label'});
        s.column({field:'amount', dtype:'L', totalize:true});
        s.column({field:'done', dtype:'B', totalize:'.summary.done'});
        s.column({field:'price', dtype:'N', totalize:true, footer_format:'#,##0.00'});
        s.column({field:'note', footer_value:'end'});
    }});
    const host = f.host('first');
    host.shadowRoot.querySelector('.body-viewport').scrollTop = 0;
    assert.ok(host.shadowRoot.querySelectorAll('tbody tr').length < 100, 'only a window of rows is mounted');
    assert.equal(f.app.data.getItem('model.totalize.amount'), 500500);
    assert.equal(f.app.data.getItem('model.summary.done'), 500);
    assert.equal(f.app.data.getItem('model.totalize.price').toString(), '100');
    const footer = field => host.shadowRoot.querySelector(`.footer-frame td[data-field="${field}"]`).textContent;
    assert.equal(footer('label'), 'Grand total');
    assert.equal(footer('amount'), '500500');
    assert.equal(footer('price'), '100.00');
    assert.equal(footer('note'), 'end');
    rows.getItem('r1000').setItem('amount', 0);
    await f.settle();
    assert.equal(f.app.data.getItem('model.totalize.amount'), 499500, 'a change outside the mounted window updates the total');
    assert.equal(footer('amount'), '499500');
    rows.getItem('r1').setItem('label', 'text');
    await f.settle();
    assert.equal(footer('label'), 'Grand total');
});

test('totals are published without a displayed footer; a total that cannot be computed is published as null', async t => {
    const rows = valueRows([{amount:2, code:'A'}, {amount:3, code:'B'}]);
    const f = await mount(t, {rows, columns:s => { s.column({field:'amount', dtype:'L', totalize:true}); s.column({field:'code', totalize:true}); }});
    assert.equal(f.host('first').shadowRoot.querySelector('.footer-frame'), null);
    assert.equal(f.app.data.getItem('model.totalize.amount'), 5);
    const numbers = valueRows([{code:1}]);
    const g = await mount(t, {rows:numbers, footer:true, columns:s => { s.column({field:'code', totalize:true}); }});
    assert.equal(g.app.data.getItem('model.totalize.code'), 1);
    numbers.getItem('r1').setItem('code', 'A');
    await g.settle();
    const cell = g.host('first').shadowRoot.querySelector('.footer-frame td[data-field="code"]');
    assert.equal(g.app.data.getItem('model.totalize.code'), null, 'a failed total is published as null');
    assert.match(g.host('first').totalErrors.get('code').message, /numeric/);
    assert.equal(cell.textContent, '—');
    assert.equal(cell.getAttribute('aria-invalid'), 'true');
    assert.match(cell.title, /numeric/);
});

test('two grids on the same Bag see formula results; a second grid with the same formulas writes nothing more', async t => {
    const rows = valueRows([{quantity:2, price:3}]);
    const struct = dataStruct([{field:'quantity', dtype:'N'}, {field:'price', dtype:'N'}, {field:'total', dtype:'N', formula:'quantity * price', calculated:true}]);
    rows.getItem('r1').setItem('quantity', createDecimal('2'));
    rows.getItem('r1').setItem('price', createDecimal('3'));
    const f = await mount(t, {rows, struct, grids:['first', 'second']});
    assert.equal(rows.getItem('r1.total').toString(), '6');
    let writes = 0;
    rows.getItem('r1').subscribe('writes', {any:event => { if (event.node?.label === 'total') writes++; }});
    rows.getItem('r1').setItem('quantity', createDecimal('4'));
    assert.equal(rows.getItem('r1.total').toString(), '12');
    assert.equal(writes, 1, 'one write for both grids');
    await f.settle();
    for (const id of ['first', 'second']) {
        assert.equal(f.host(id).shadowRoot.querySelector('tr[data-row="r1"] td[data-field="total"]').textContent, '12', id);
    }
});

test('a grid without formulas shows the results written by another grid on the same Bag', async t => {
    const rows = valueRows([{quantity:createDecimal('2'), price:createDecimal('3')}]);
    const f = await mount(t, {rows, data:{plain:dataStruct([{field:'total', dtype:'N'}])},
        grids:['first', {id:'viewer', structpath:'.plain'}], columns:s => {
            s.column({field:'quantity', dtype:'N'}); s.column({field:'price', dtype:'N'});
            s.column({field:'total', dtype:'N', formula:'quantity * price', calculated:true});
        }});
    rows.getItem('r1').setItem('price', createDecimal('5'));
    assert.equal(rows.getItem('r1.total').toString(), '10');
    await f.settle();
    assert.equal(f.host('viewer').shadowRoot.querySelector('td[data-field="total"]').textContent, '10');
});

// Q3 under a real engine refusal, as in binding-inline.test.js: a CSP without 'unsafe-eval'.
const STRICT_GRID = `
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from ${JSON.stringify(new URL('../src/index.js', import.meta.url).href)};
import grid from ${JSON.stringify(new URL('../src/components/grid.js', import.meta.url).href)};
import inputs from ${JSON.stringify(new URL('../src/components/inputs.js', import.meta.url).href)};
import {layoutWindow} from ${JSON.stringify(new URL('./helpers/layout-window.js', import.meta.url).href)};
const {window} = new JSDOM('<main id="gramlot-root"></main>');
layoutWindow(window);
const app = new Gramlot({document:window.document, transport:false, collections:[inputs, grid]});
const rows = new Bag(); rows.setItem('r1', new Bag({quantity:2, price:3}));
app.data.setItem('rows', rows);
const builder = new GramlotBuilder(null, {collections:[inputs, grid]});
const s = builder.root.grid({id:'g', node_label:'g', storepath:'rows', rowMode:'values'}).struct();
s.column({field:'quantity'}); s.column({field:'price'}); s.column({field:'total', formula:'quantity * price', calculated:true});
s.column({field:'larger', formula:'Math.max(quantity, price)', calculated:true});
app.src.startSource(builder.source);
await new Promise(resolve => setTimeout(resolve, 0));
const error = window.document.getElementById('g').formulaErrors.get('larger');
process.stdout.write(JSON.stringify({total:rows.getItem('r1.total'), larger:rows.getItem('r1.larger'),
    name:error.name, cause:error.cause?.name ?? null, message:error.message}));
app.dispose();
`;

test('D2/Q3: under a CSP without unsafe-eval an arithmetic formula computes; a non-arithmetic one records the inline EvalError and stores null', () => {
    const output = execFileSync(process.execPath, ['--disallow-code-generation-from-strings', '--input-type=module', '-e', STRICT_GRID],
        {cwd:fileURLToPath(new URL('..', import.meta.url)), encoding:'utf8'});
    const result = JSON.parse(output);
    assert.equal(result.total, 6, 'arithmetic formulas are not compiled');
    assert.equal(result.larger, null);
    assert.equal(result.name, 'EvalError');
    assert.equal(result.cause, 'EvalError');
    assert.match(result.message, /^grid 'g' 'struct\.larger\.formula': inline code blocked by the Content Security Policy of the page \(no 'unsafe-eval'\)/);
});

test('Python declares the same formulas, =#ROW parameters and totals; JS mounts the resulting TYTX', async t => {
    const root = fileURLToPath(new URL('../../', import.meta.url));
    const wire = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? `${root}/.venv/bin/python`, ['-c', `
import json
from gramlot import GramlotBuilder
from genro_tytx import to_tytx
with open('src/gramlot/collections/grid.json') as f: grammar=json.load(f)
b=GramlotBuilder(collections=[grammar])
g=b.root.div(datapath='model').grid(id='g', storepath='.rows', rowMode='values', footer='Total')
s=g.struct()
s.column('label')
s.column('quantity', dtype='L')
s.column('total', dtype='L', formula='quantity * rate', formula_rate='^.rate', calculated=True, totalize=True)
s.column('position', formula='#', calculated=True, hidden=True)
s.column('scaled', dtype='L', formula='quantity * k', formula_k='=#ROW.factor', calculated=True)
print(to_tytx(b.source))
`], {cwd:root, encoding:'utf8'}).trim();
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    const app = new Gramlot({document:window.document, transport:false, collections:[inputs, grid], locale:'en-US'});
    t.after(() => { app.dispose(); window.close(); });
    const rows = valueRows([{quantity:2, factor:3}, {quantity:3, factor:4}]);
    app.data.setItem('model', new Bag({rows, rate:10}));
    app.src.startSource(wire);
    await tick(); await tick();
    assert.deepEqual(rows.getNodes().map(node => node.value.getItem('scaled')), [6, 12], 'a Python =#ROW parameter reads each row');
    assert.deepEqual(rows.getNodes().map(node => [node.value.getItem('total'), node.value.getNode('position')]), [[20, null], [30, null]],
        '# is a view value, never written');
    app.data.setItem('model.rate', 2);
    assert.equal(rows.getItem('r2.total'), 6);
    await tick();
    assert.equal(app.data.getItem('model.totalize.total'), 10);
    assert.equal(window.document.getElementById('g').shadowRoot.querySelector('.footer-frame td[data-field="label"]').textContent, 'Total');
});
