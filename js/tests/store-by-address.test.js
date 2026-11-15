import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM, VirtualConsole} from 'jsdom';
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

function chartFixture(t, attrs, before = () => {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    window.ResizeObserver = class {observe() {} disconnect() {}};
    t.mock.method(ChartRenderer.prototype, 'prepare', async () => {});
    t.mock.method(ChartRenderer.prototype, 'resize', () => {});
    const update = t.mock.method(ChartRenderer.prototype, 'update', () => {});
    const app = new Gramlot({document:window.document, transport:false, collections:[charts, grid], locale:'en-GB'});
    t.after(() => {app.dispose(); window.close();});
    app.data.setItem('options', new Bag({amount:new Bag({axis:'left', color:'#5470c6'})}));
    const b = new GramlotBuilder(null, {collections:[charts, grid]});
    before(b.root, app);
    b.root.chartView({id:'chart', engine:'echarts', chartType:'bar', seriesOptions:'^options', ...attrs});
    app.src.startSource(b.toTytx());
    const host = window.document.getElementById('chart');
    const notice = () => host.shadowRoot.querySelector('.chart-notice');
    return {app, host, notice, update};
}

function salesRows(...codes) {
    const sales = new Bag();
    codes.forEach((code, index) => sales.setItem(`r${index}`, null, {code, amount:index + 1}));
    return sales;
}

/** The notice of a chart error: the icon, the message and the "More info" button. */
function errorNotice(f) {
    const notice = f.notice();
    assert.equal(notice.hidden, false);
    assert.equal(notice.dataset.kind, 'error');
    assert.equal(notice.querySelector('.chart-notice-icon').textContent, '!');
    assert.equal(notice.querySelector('button').textContent, 'More info');
    return notice.querySelector('.chart-notice-text').textContent;
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

test('a gridId without a node shows the error with icon and More info in the chart notice', async t => {
    const f = chartFixture(t, {storepath:'sales', rowMode:'attributes', captionField:'code', valueFields:'amount', gridId:'missing'},
        (root, app) => app.data.setItem('sales', salesRows('A')));
    await settle();
    assert.match(errorNotice(f), /gridId 'missing': the page has no node with this nodeId/);
    assert.equal(f.update.mock.callCount(), 0);
});

test('a gridId on a node that is not a grid shows the error in the chart notice', async t => {
    const f = chartFixture(t, {storepath:'sales', rowMode:'attributes', captionField:'code', valueFields:'amount', gridId:'box'},
        (root, app) => { app.data.setItem('sales', salesRows('A')); root.div({nodeId:'box'}); });
    await settle();
    assert.match(errorNotice(f), /gridId 'box': the node is a div, not a grid/);
});

test('a grid on another storepath shows the error in the chart notice', async t => {
    const f = chartFixture(t, {storepath:'sales', rowMode:'attributes', captionField:'code', valueFields:'amount', gridId:'salesGrid'},
        (root, app) => {
            app.data.setItem('sales', salesRows('A')); app.data.setItem('other', salesRows('B'));
            app.data.setItem('model.structure', struct());
            root.div({height:'200px'}).grid({nodeId:'salesGrid', storepath:'other', structpath:'model.structure', rowMode:'attributes'});
        });
    await settle();
    assert.match(errorNotice(f), /same storepath and rowMode; the grid reads attributes:other, the chart attributes:sales/);
});

test('a chart follows the filter of the grid that reads the same store key', async t => {
    const f = chartFixture(t, {storepath:'sales', rowMode:'attributes', captionField:'code', valueFields:'amount', gridId:'salesGrid'},
        (root, app) => {
            app.data.setItem('sales', salesRows('Alpha', 'Beta'));
            app.data.setItem('model.structure', struct());
            root.div({height:'200px'}).grid({nodeId:'salesGrid', storepath:'sales', structpath:'model.structure', rowMode:'attributes'});
        });
    await settle();
    assert.equal(f.notice().hidden, true);
    const gridView = f.app.src.source.getNodeByAttr('nodeId', 'salesGrid')._internal.gridCollectionView;
    gridView.applyFilter({value:'^Zz', columns:['code'], dtype:'T', locale:'en-GB'}); await settle();
    assert.equal(f.notice().dataset.kind, 'info', 'the grid filter hides every row of the chart');
    gridView.applyFilter({value:'^Al', columns:['code'], dtype:'T', locale:'en-GB'}); await settle();
    assert.equal(f.notice().hidden, true);
    f.app.data.setItem('sales', salesRows('Beta')); await settle();
    assert.equal(f.notice().dataset.kind, 'info', 'a replacement at the address keeps the followed filter');
    assert.equal(f.notice().hidden, false);
    const gridNode = f.app.src.source.getNodeByAttr('nodeId', 'salesGrid');
    gridNode.parentBag.popNode(gridNode.label); await settle();
    f.app.data.getItem('sales').setItem('r9', null, {code:'Alto', amount:9}); await settle();
    assert.equal(f.notice().hidden, true, 'a grid that leaves the page leaves its last filter, not an error');
});

test('a sample chart with a gridId shows the error in the chart notice', async t => {
    const f = chartFixture(t, {storepath:'samples', rowMode:'samples', captionField:'time', valueFields:'amount', gridId:'salesGrid'},
        (root, app) => app.data.setItem('samples', [1, 2]));
    await settle();
    assert.match(errorNotice(f), /Sample charts do not use grid filters or temporal playback/);
});

test('seriesOptions travels as an address: the draw reads the options at the pointer path', async t => {
    const f = chartFixture(t, {storepath:'sales', rowMode:'attributes', captionField:'code', valueFields:'amount'},
        (root, app) => app.data.setItem('sales', salesRows('A')));
    await settle();
    const read = () => { const {data, path} = f.update.mock.calls.at(-1).arguments[1]; return data.getItem(path, null, true); };
    assert.equal(f.update.mock.calls.at(-1).arguments[1].path, 'options');
    const calls = f.update.mock.callCount();
    f.app.data.setItem('options.amount.color', '#123456'); await settle();
    assert.ok(f.update.mock.callCount() > calls, 'a change inside the options Bag draws again');
    assert.equal(read().getItem('amount.color'), '#123456');
    const replaced = new Bag({amount:new Bag({axis:'right', color:'#654321'})});
    f.app.data.setItem('options', replaced); await settle();
    assert.equal(read(), replaced, 'a replacement at the address is read at the next draw');
});

test('chartPane configDefaults: a literal parentless Bag stays a parameter and fills the configuration', async t => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    window.ResizeObserver = class {observe() {} disconnect() {}};
    t.mock.method(ChartRenderer.prototype, 'prepare', async () => {});
    t.mock.method(ChartRenderer.prototype, 'resize', () => {});
    t.mock.method(ChartRenderer.prototype, 'update', () => {});
    const collections = [charts, inputs, layoutComponents, grid];
    const app = new Gramlot({document:window.document, transport:false, collections, locale:'en-GB'});
    t.after(() => {app.dispose(); window.close();});
    const b = new GramlotBuilder(null, {collections});
    b.root.div({height:'400px'}).chartPane({id:'literal', storepath:'sales', configpath:'literalConfig', rowMode:'attributes', configDefaults:new Bag({chartType:'pie'})});
    app.src.startSource(b.toTytx()); await settle();
    const literal = window.document.getElementById('literal');
    assert.ok(literal.parameters.configDefaults instanceof Bag, 'a parentless Bag stays a parameter');
    assert.equal(app.data.getItem('literalConfig.chartType'), 'pie');
});

test('chart fields and timeline leave an address without rows to the chart notice', async t => {
    const virtualConsole = new VirtualConsole(), uncaught = [];
    virtualConsole.on('jsdomError', error => uncaught.push(error.message));
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {virtualConsole});
    layoutWindow(window);
    window.ResizeObserver = class {observe() {} disconnect() {}};
    t.mock.method(ChartRenderer.prototype, 'prepare', async () => {});
    t.mock.method(ChartRenderer.prototype, 'resize', () => {});
    t.mock.method(ChartRenderer.prototype, 'update', () => {});
    const collections = [charts, inputs, layoutComponents, grid];
    const app = new Gramlot({document:window.document, transport:false, collections, locale:'en-GB'});
    t.after(() => {app.dispose(); window.close();});
    const errors = [];
    app.src.renderer.binding.reportError = (error, title) => errors.push([title, error.message]);
    const b = new GramlotBuilder(null, {collections});
    b.root.div({height:'400px'}).chartPane({id:'pane', storepath:'sales', configpath:'config', rowMode:'attributes'});
    app.src.startSource(b.toTytx()); await settle();
    const host = window.document.getElementById('pane-view');
    const notice = () => host.shadowRoot.querySelector('.chart-notice');
    assert.doesNotThrow(() => app.data.setItem('sales', 'not rows')); await settle();
    assert.deepEqual(errors, []); assert.deepEqual(uncaught, []);
    assert.equal(notice().dataset.kind, 'error');
    assert.match(notice().textContent, /collection store requires a Bag at sales/);
    app.data.setItem('sales', salesRows('A', 'B')); await settle();
    assert.equal(app.data.getItem('config.captionField'), 'code', 'chart fields read the rows once the address holds them');
    assert.deepEqual(errors, []); assert.deepEqual(uncaught, []);
});
