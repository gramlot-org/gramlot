import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import grid from '../src/components/grid.js';
import inputs from '../src/components/inputs.js';
import layoutComponents from '../src/components/layout.js';
import charts from '../src/components/charts.js';
import {ChartRenderer} from '../src/components/chart-renderer.js';
import {layoutWindow} from './helpers/layout-window.js';

const settle = () => new Promise(resolve => setTimeout(resolve, 0));

function struct() {
    const bag = new Bag();
    bag.setItem('view_0', new Bag(), {tag:'view'});
    bag.getItem('view_0').setItem('rows_0', new Bag(), {tag:'rows'});
    bag.setItem('info', new Bag());
    bag.getItem('info').setItem('columnsets', new Bag());
    bag.getItem('view_0.rows_0').setItem('code', null, {tag:'cell', field:'code', name:'Code'});
    return bag;
}
function rows(...codes) {
    const bag = new Bag();
    for (const code of codes) bag.setItem(code, null, {code});
    return bag;
}

function gridFixture(t) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    const app = new Gramlot({document:window.document, transport:false, collections:[inputs, layoutComponents, grid], locale:'en-US'});
    t.after(() => {app.dispose(); window.close();});
    const errors = [];
    app.src.renderer.binding.reportError = (error, title) => errors.push([title, error.message]);
    app.data.setItem('model.rows', rows('A'));
    app.data.setItem('model.structure', struct());
    const b = new GramlotBuilder(null, {collections:[inputs, layoutComponents, grid]});
    b.root.div({datapath:'model'}).grid({id:'g', storepath:'.rows', structpath:'.structure', rowMode:'attributes'});
    app.src.startSource(b.toTytx());
    const host = window.document.getElementById('g');
    return {app, host, errors, cells:() => [...host.shadowRoot.querySelectorAll('tbody td')].map(td => td.textContent)};
}

test('a grid reads its rows and structure by address: no Bag is handed to it', async t => {
    const f = gridFixture(t); await settle();
    assert.equal('setStoreBag' in f.host, false);
    assert.equal('setStructBag' in f.host, false);
    assert.deepEqual(f.cells(), ['A']);
    f.app.data.getItem('model.rows').setItem('B', null, {code:'B'}); await settle();
    assert.deepEqual(f.cells(), ['A', 'B']);
});

test('a replacement of the rows Bag at the storepath address redraws the grid', async t => {
    const f = gridFixture(t); await settle();
    f.app.data.setItem('model.rows', rows('X', 'Y')); await settle();
    assert.deepEqual(f.cells(), ['X', 'Y']);
    const structure = struct();
    structure.getItem('view_0.rows_0').getNode('code').setAttr({name:'Renamed'});
    f.app.data.setItem('model.structure', structure); await settle();
    assert.equal(f.host.shadowRoot.querySelector('th[data-field="code"]').textContent, 'Renamed');
    assert.deepEqual(f.errors, []);
});

test('an address without rows is reported by the grid when it draws, not by the renderer', async t => {
    const f = gridFixture(t); await settle();
    assert.doesNotThrow(() => f.app.data.setItem('model.rows', 'not rows'));
    await settle();
    assert.deepEqual(f.errors, [['Grid refresh', 'collection store requires a Bag at model.rows']]);
    assert.deepEqual(f.cells(), ['A'], 'the last valid rows stay');
    f.app.data.setItem('model.rows', rows('C')); await settle();
    assert.deepEqual(f.cells(), ['C']);
});

function chartFixture(t, attrs) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.ResizeObserver = class {observe() {} disconnect() {}};
    t.mock.method(ChartRenderer.prototype, 'prepare', async () => {});
    t.mock.method(ChartRenderer.prototype, 'resize', () => {});
    t.mock.method(ChartRenderer.prototype, 'update', () => {});
    const app = new Gramlot({document:window.document, transport:false, collections:[charts]});
    t.after(() => {app.dispose(); window.close();});
    app.data.setItem('options', new Bag({amount:new Bag({axis:'left', color:'#5470c6'})}));
    const b = new GramlotBuilder(null, {collections:[charts]});
    b.root.chartView({id:'chart', engine:'echarts', chartType:'bar', seriesOptions:'^options', ...attrs});
    app.src.startSource(b.toTytx());
    const host = window.document.getElementById('chart');
    const notice = () => host.shadowRoot.querySelector('.chart-notice');
    return {app, host, notice};
}

test('a chart whose store address holds no rows shows the error in its notice', async t => {
    const f = chartFixture(t, {storepath:'sales', rowMode:'attributes', captionField:'code', valueFields:'amount'});
    await settle();
    assert.equal('setStoreBag' in f.host, false);
    assert.equal(f.notice().dataset.kind, 'error');
    assert.match(f.notice().textContent, /collection store requires a Bag at sales/);
    const sales = new Bag(); sales.setItem('r1', null, {code:'A', amount:1});
    f.app.data.setItem('sales', sales); await settle();
    assert.equal(f.notice().hidden, true);
});

test('a sample chart reads its array at the store address and shows a wrong value in its notice', async t => {
    const f = chartFixture(t, {storepath:'samples', rowMode:'samples', captionField:'time', valueFields:'amount'});
    await settle();
    f.app.data.setItem('samples', [1, 2, 3]); await settle();
    assert.equal(f.notice().hidden, true);
    f.app.data.setItem('samples', 'not samples'); await settle();
    assert.equal(f.notice().dataset.kind, 'error');
    assert.match(f.notice().textContent, /Sample chart requires an array of finite numbers/);
});
