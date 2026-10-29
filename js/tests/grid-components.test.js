import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import {BagResolver} from '@genrojs/bag';
import grid from '../src/components/grid.js';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';
import {GridRows} from '../src/components/grid-rows.js';
import {GridStructure} from '../src/components/grid-structure.js';
import {layoutWindow} from './helpers/layout-window.js';

function emptyStruct() {
    const bag = new Bag();
    bag.setItem('view_0', new Bag(), {tag:'view'});
    bag.getItem('view_0').setItem('rows_0', new Bag(), {tag:'rows'});
    bag.setItem('info', new Bag());
    bag.getItem('info').setItem('columnsets', new Bag());
    return bag;
}
function struct() {
    const bag = emptyStruct(), columns = bag.getItem('view_0.rows_0');
    columns.setItem('code', null, {tag:'cell',field:'code',name:'Code'});
    columns.setItem('amount', null, {tag:'cell',field:'amount',name:'Amount',dtype:'N',format:'0.00',width:'120px',columnset:'numbers'});
    bag.getItem('info.columnsets').setItem('numbers', null, {tag:'columnset',code:'numbers',name:'Numbers'});
    return bag;
}

function fixture(t, {mode = 'attributes', inline = false, two = false, empty = false, rowHeaders = false, rowResize = false, selfDragRows = false} = {}) {
    t.mock.timers.enable({apis:['setTimeout']});
    const flush = () => t.mock.timers.tick(0);
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const layout = layoutWindow(window);
    const app = new Gramlot({document: window.document, transport: false, collections: [grid], locale: 'en-US'});
    t.after(() => {app.dispose(); window.close();});
    const rows = new Bag();
    if (!empty) rows.setItem('r1', mode === 'values' ? new Bag({code: 'A', amount: 12.5}) : null,
        mode === 'attributes' ? {code: 'A', amount: 12.5} : {});
    app.data.setItem('model.rows', rows); app.data.setItem('model.structure', struct());
    const b = new GramlotBuilder(null, {collections: [grid]});
    const pane = b.root.div({datapath: 'model', node_label: 'pane'});
    const add = id => {
        const g = pane.grid({id, node_label: id, storepath: '.rows', rowMode: mode, rowHeaders, rowResize, selfDragRows, ...(inline ? {} : {structpath: '.structure'})});
        if (inline) {
            const s = g.struct();
            s.column({field: 'code', name: 'Code'});
            s.colgroup({code: 'numbers', name: 'Numbers'}).column({field: 'amount', name: 'Amount', dtype: 'N', format: '0.00', width: '120px'});
        }
    };
    add('first'); if (two) add('second');
    app.src.startSource(b.toTytx());
    flush();
    const host = window.document.getElementById('first');
    return {app, window, rows, host, layout, flush, source: app.src.source.getNode('main.pane.first'),
        cells: () => [...host.shadowRoot.querySelectorAll('tbody td')].map(td => td.textContent)};
}

for (const mode of ['values','attributes']) test(`${mode}: row invalidations coalesce and pull only affected rows`, t => {
    const f = fixture(t, {mode,two:true});
    f.rows.setItem('r2', mode === 'values' ? new Bag({code:'B',amount:8}) : null,
        mode === 'attributes' ? {code:'B',amount:8} : {});
    f.flush();
    const store = f.app.src.binding.collectionStore(f.rows,mode);
    const value = store.value.bind(store), reads = [];
    t.mock.method(store,'value',(node,field) => { reads.push(node); return value(node,field); });
    const timer = t.mock.method(f.window,'setTimeout');
    const notices=[]; const release=store.subscribe(change=>notices.push(change));
    const row=f.rows.getNode('r1');
    for (const amount of [20,30,40]) {
        if (mode === 'values') row.staticValue.setItem('amount',amount);
        else row.setAttr({amount});
    }
    assert.deepEqual(f.cells(),['A','12.50','B','8.00'], 'Data delivery does not render');
    assert.equal(reads.length,0);
    assert.equal(timer.mock.callCount(),2,'one timer per grid, not per notification');
    assert.ok(notices.every(change=>!change.full && change.rows.length===1 && change.rows[0]===row));
    f.flush();
    assert.deepEqual(f.cells(),['A','40.00','B','8.00']);
    assert.equal(reads.length,4,'two columns read once in each of two grids');
    assert.ok(reads.every(node=>node===row));
    assert.equal(timer.mock.callCount(),2,'there is no polling');
    release();
});

test('full invalidation absorbs pending row changes and pulls the final order once', t => {
    const f = fixture(t);
    f.rows.setItem('r2',null,{code:'B',amount:8}); f.flush();
    const store=f.app.src.binding.collectionStore(f.rows,'attributes');
    const value=store.value.bind(store), reads=[];
    t.mock.method(store,'value',(node,field)=>{ reads.push(node); return value(node,field); });
    const timer=t.mock.method(f.window,'setTimeout');
    f.rows.getNode('r1').setAttr({code:'Changed'});
    f.source.gridCollectionView.moveRow(f.rows.getNode('r2'),f.rows.getNode('r1'));
    f.rows.getNode('r2').setAttr({amount:9});
    assert.deepEqual(f.cells(),['A','12.50','B','8.00']);
    assert.equal(timer.mock.callCount(),1);
    f.flush();
    assert.deepEqual(f.cells(),['B','9.00','Changed','12.50']);
    assert.equal(reads.length,4);
});

test('render errors are isolated per grid and a later valid change recovers', t => {
    const f=fixture(t,{two:true});
    const onlyCode=emptyStruct();
    onlyCode.getItem('view_0.rows_0').setItem('code',null,{tag:'cell',field:'code'});
    f.app.data.setItem('onlyCode',onlyCode);
    f.app.src.source.getNode('main.pane.second').setAttr({structpath:'onlyCode'});
    f.flush();
    const errors=[];
    t.mock.method(f.app.src.binding,'reportError',(error,title)=>errors.push({error,title}));
    assert.doesNotThrow(()=>f.rows.getNode('r1').setAttr({code:'Next',amount:'invalid'}));
    f.flush();
    assert.deepEqual(f.cells(),['A','12.50']);
    assert.equal(f.window.document.getElementById('second').shadowRoot.querySelector('td').textContent,'Next');
    assert.equal(errors.length,1); assert.equal(errors[0].title,'Grid refresh');
    f.flush(); assert.equal(errors.length,1,'no retry loop');
    f.rows.getNode('r1').setAttr({amount:42}); f.flush();
    assert.deepEqual(f.cells(),['Next','42.00']);
    // Invalid structure is also a deferred view error, not an error in Data delivery.
    assert.doesNotThrow(()=>f.app.data.getItem('model.structure.view_0.rows_0').getNode('code').setAttr({dtype:'invalid'}));
    f.flush(); assert.equal(errors.length,2);
    f.app.data.getItem('model.structure.view_0.rows_0').getNode('code').setAttr({dtype:null});
    f.flush(); assert.deepEqual(f.cells(),['Next','42.00']);
});

test('removal cancels the pending pull and releases the store subscription', t => {
    const f=fixture(t);
    const store=f.app.src.binding.collectionStore(f.rows,'attributes');
    const value=t.mock.method(store,'value');
    const timer=t.mock.method(f.window,'setTimeout');
    const cancel=t.mock.method(f.window,'clearTimeout');
    f.rows.getNode('r1').setAttr({amount:23});
    assert.equal(timer.mock.callCount(),1);
    f.source.parentBag.popNode(f.source.label);
    assert.equal(cancel.mock.callCount(),1);
    f.rows.getNode('r1').setAttr({amount:24}); f.flush();
    assert.equal(timer.mock.callCount(),1);
    assert.equal(value.mock.callCount(),0);
});

test('business rowidx attributes cannot reorder a grid view', t => {
    const f=fixture(t);
    f.rows.setItem('r2',null,{code:'B',amount:8}); f.flush();
    f.rows.getNode('r1').setAttr({rowidx:1,code:'Changed'});
    f.rows.getNode('r2').setAttr({rowidx:0});
    f.flush();
    assert.deepEqual(f.cells(),['Changed','12.50','B','8.00']);
});

test('retargeting discards queued identities and detaches the old store listener', t => {
    const f=fixture(t);
    const old=f.app.src.binding.collectionStore(f.rows,'attributes');
    f.rows.getNode('r1').setAttr({amount:23});
    const replacement=new Bag(); replacement.setItem('new',null,{code:'New',amount:9});
    f.app.data.setItem('replacement',replacement);
    f.source.setAttr({storepath:'replacement'});
    old.receiveData({},f.rows.getNode('r1'));
    f.flush();
    assert.deepEqual(f.cells(),['New','9.00']);
    const timer=t.mock.method(f.window,'setTimeout');
    old.receiveData({});
    assert.equal(timer.mock.callCount(),0);
});

test('sort defers subtree projection and row edits never rebuild the struct', t => {
    const f = fixture(t, {two:true, empty:true});
    const rows = new Bag();
    for (let i = 0; i < 500; i++) rows.setItem(`r${i}`, null, {code:`R${i}`, amount:500-i});
    f.app.data.setItem('model.rows', rows);
    const hosts = [f.host, f.window.document.getElementById('second')];
    let structures = 0, projections = 0;
    for (const host of hosts) {
        const setStruct = host.setStructBag.bind(host), project = host.projectAttributes.bind(host);
        host.setStructBag = bag => { structures++; setStruct(bag); };
        host.projectAttributes = (...args) => { projections++; return project(...args); };
    }
    const store = f.source.gridCollectionView;
    store.sort('amount:a');
    f.flush();
    assert.equal(structures, 0);
    assert.equal(projections, 0, 'completion projects rows directly, not component attributes');
    assert.equal(hosts[0].shadowRoot.querySelector('tbody td').textContent,'R499');
    assert.equal(hosts[1].shadowRoot.querySelector('tbody td').textContent,'R0');
    rows.getNode('r499').setAttr({code:'Updated'});
    f.flush();
    assert.equal(structures, 0);
    assert.equal(hosts[0].shadowRoot.querySelector('tbody td').textContent,'Updated');
    assert.equal(hosts[1].shadowRoot.querySelector('tbody tr[data-row=r499] td').textContent,'Updated');
    f.app.data.getItem('model.structure.view_0.rows_0').getNode('code').setAttr({name:'Renamed'});
    f.flush();
    assert.equal(structures, 2, 'a struct event rebuilds each consumer once');
    for (const host of hosts) assert.equal(host.shadowRoot.querySelector('th[data-field="code"]').textContent, 'Renamed');
});

test('ancestor replacement, emptying and disposal preserve binding ownership', t => {
    const f = fixture(t, {two:true});
    const second = f.window.document.getElementById('second');
    const rows = new Bag(); rows.setItem('new', null, {code:'New',amount:9});
    const model = new Bag(); model.setItem('rows',rows); model.setItem('structure',struct());
    f.app.data.setItem('model',model);
    f.flush();
    assert.deepEqual(f.cells(), ['New','9.00']);
    assert.equal(second.shadowRoot.querySelector('tbody td').textContent,'New');
    rows.clear();
    f.flush();
    assert.deepEqual(f.cells(), ['No rows']);
    const store = f.app.src.binding.collectionStore(rows,'attributes');
    f.source.parentBag.popNode(f.source.label);
    rows.setItem('later',null,{code:'Later',amount:8});
    f.app.src.source.getNode('main.pane.second').gridCollectionView.sort('amount:d');
    f.flush();
    assert.deepEqual(f.cells(), ['No rows'], 'detached grid no longer receives store completion');
    assert.equal(second.shadowRoot.querySelector('tbody td').textContent,'Later');
});

test('views are Source-owned and share only the parent collection resource',t=>{
    const f=fixture(t,{two:true});
    const second=f.app.src.source.getNode('main.pane.second');
    assert.notEqual(f.source.gridCollectionView,second.gridCollectionView);
    assert.equal(f.source.gridCollectionView.bag,second.gridCollectionView.bag);
    assert.equal(f.app.src.binding.collectionView(f.source,f.rows,'attributes'),f.source.gridCollectionView);
    assert.equal(f.rows.getNode('r1').getAttr('rowidx'),null);
});

for (const mode of ['values', 'attributes']) test(`${mode}: read-only Bag cells update without replacing rows`, t => {
    const f = fixture(t, {mode});
    assert.deepEqual(f.cells(), ['A', '12.50']);
    const original = f.host.shadowRoot.querySelector('tbody tr');
    if (mode === 'values') f.rows.getItem('r1').setItem('amount', 23);
    else f.rows.getNode('r1').setAttr({amount: 23});
    f.flush();
    assert.deepEqual(f.cells(), ['A', '23.00']);
    assert.equal(f.host.shadowRoot.querySelector('tbody tr'), original);
    assert.equal(f.host.shadowRoot.querySelector('input,[contenteditable]'), null);
});

test('nested struct is installed as ordinary Data before the component renders', t => {
    const f = fixture(t, {inline: true, two: true});
    assert.deepEqual(f.cells(), ['A', '12.50']);
    const path = f.source.getAttr('structpath');
    const second = f.app.src.source.getNode('main.pane.second').getAttr('structpath');
    f.flush();
    assert.notEqual(path, second);
    const data = f.app.data.getItem(path);
    f.flush();
    assert.equal(data.constructor, Bag);
    assert.equal(data.getNodes()[1].staticValue.constructor, Bag);
    assert.equal(f.source.staticValue.getNodes().length, 0);
    data.getItem('view_0.rows_0').getNodes()[0].setAttr({name: 'Updated'});
    f.flush();
    assert.equal(f.host.shadowRoot.querySelector('th[data-field]').textContent, 'Updated');
    assert.equal(f.window.document.getElementById('second').shadowRoot.querySelector('th[data-field]').textContent, 'Code');
});

test('insert, delete, replace store and retarget path follow the existing binding lifecycle', t => {
    const f = fixture(t);
    f.rows.setItem('r2', null, {code: 'B', amount: 7});
    f.flush();
    assert.deepEqual(f.cells(), ['A', '12.50', 'B', '7.00']);
    f.rows.popNode('r1');
    f.flush();
    assert.deepEqual(f.cells(), ['B', '7.00']);
    const replacement = new Bag(); replacement.setItem('r3', null, {code: 'C', amount: 0});
    f.app.data.setItem('model.rows', replacement);
    f.flush();
    assert.deepEqual(f.cells(), ['C', '0.00']);
    f.rows.setItem('stale', null, {code: 'Old', amount: 2});
    f.flush();
    assert.deepEqual(f.cells(), ['C', '0.00']);
    const other = new Bag(); other.setItem('r4', null, {code: 'D', amount: 5});
    f.app.data.setItem('other', other); f.source.setAttr({storepath: 'other'});
    f.flush();
    assert.deepEqual(f.cells(), ['D', '5.00']);
    const size = f.app.src.binding.router.size;
    f.source.parentBag.popNode(f.source.label);
    f.flush();
    assert.ok(f.app.src.binding.router.size < size);
    other.getNode('r4').setAttr({code: 'Changed'});
    f.flush();
    assert.deepEqual(f.cells(), ['D', '5.00']);
});

test('external struct changes and replacement update all sharing grids', t => {
    const f = fixture(t, {two: true});
    const s = f.app.data.getItem('model.structure');
    s.getNode('view_0.rows_0.code').setAttr({name: 'Identity'});
    f.flush();
    for (const id of ['first', 'second']) assert.equal(f.window.document.getElementById(id).shadowRoot.querySelector('th[data-field]').textContent, 'Identity');
    const next = emptyStruct(); next.getItem('view_0.rows_0').setItem('amount', null, {tag: 'cell', field: 'amount'});
    f.app.data.setItem('model.structure', next);
    f.flush();
    assert.deepEqual(f.cells(), ['12.5']);
});

test('the header is outside the rows viewport and both layouts expose one logical table', t => {
    const f = fixture(t);
    const root = f.host.shadowRoot, viewport = root.querySelector('.body-viewport');
    f.flush();
    assert.equal(viewport.contains(root.querySelector('thead')), false);
    assert.equal(viewport.contains(root.querySelector('tbody')), true);
    assert.equal(root.querySelectorAll('[role=table]').length, 1);
    assert.equal(root.querySelectorAll('table[role=presentation]').length, 2);
    assert.equal(root.querySelector('[role=table]').getAttribute('aria-colcount'), '2');
    assert.equal(root.querySelector('[role=table]').getAttribute('aria-rowcount'), '3');
    assert.equal(root.querySelector('tbody tr').getAttribute('aria-rowindex'), '3');
    assert.equal(root.querySelector('th[scope=colgroup]').getAttribute('aria-colindex'), '2');
    const widths = [...root.querySelectorAll('table')].map(table => [...table.querySelectorAll('col')].map(col => col.style.width));
    f.flush();
    assert.deepEqual(widths[0], widths[1]);
});

test('scroll/gutter synchronization has one geometry observer and releases pending work', t => {
    const f = fixture(t);
    const root = f.host.shadowRoot, body = root.querySelector('.body-viewport'), header = root.querySelector('.header-viewport');
    Object.defineProperties(body, {offsetWidth: {get: () => 320}, clientWidth: {get: () => 304}});
    f.layout.flush();
    f.flush();
    assert.equal(f.host.control.style.getPropertyValue('--grid-scrollbar-width'), '16px');
    body.scrollLeft = 74; body.dispatchEvent(new f.window.Event('scroll'));
    f.flush();
    assert.equal(header.scrollLeft, 74);
    const [observer] = f.layout.observers;
    f.flush();
    assert.equal(observer.targets.size, 2);
    observer.callback(); observer.callback();
    f.flush();
    assert.equal(f.layout.frames.size, 1);
    f.source.parentBag.popNode(f.source.label);
    f.flush();
    assert.equal(observer.targets.size, 0);
    assert.equal(f.layout.frames.size, 0);
    body.scrollLeft = 100; body.dispatchEvent(new f.window.Event('scroll'));
    f.flush();
    assert.equal(header.scrollLeft, 74);
});

test('rendering is read-only and a Source rebuild reuses the installed Data struct', t => {
    const f = fixture(t, {inline: true});
    let writes = 0;
    f.app.data.subscribe('grid-read-only-check', {any: () => writes++});
    const path = f.source.getAttr('structpath');
    f.source.setAttr({title: 'Read-only projection'});
    f.flush();
    assert.equal(writes, 0);
    f.app.src.renderer.freeze(f.source);
    f.rows.getNode('r1').setAttr({amount: 45});
    // Source freeze does not suspend Data projections.
    f.flush();
    assert.deepEqual(f.cells(), ['A', '45.00']);
    f.app.src.renderer.unfreeze(f.source);
    f.flush();
    assert.deepEqual([...f.window.document.getElementById('first').shadowRoot.querySelectorAll('tbody td')].map(td => td.textContent), ['A', '45.00']);
    assert.equal(f.source.getAttr('structpath'), path);
    assert.equal(writes, 1);
    f.app.data.unsubscribe('grid-read-only-check');
});

for (const empty of [false, true]) test(`nested struct (empty=${empty}) and external structpath conflict before Data installation`, t => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const layout = layoutWindow(window);
    const app = new Gramlot({document: window.document, transport: false, collections: [grid]});
    t.after(() => {app.dispose(); window.close();});
    const b = new GramlotBuilder(null, {collections: [grid]});
    b.root.dataSetter({destination_path: 'sentinel', value: true});
    const s = b.root.grid({storepath: 'rows', structpath: 'columns', rowMode: 'values'}).struct();
    if (!empty) s.column({field: 'code'});
    assert.throws(() => app.src.startSource(b.toTytx()), /not both/);
    assert.equal(app.data.getNode('sentinel'), null);
});

test('empty rows, false, zero and HTML-like text remain distinct and inert', t => {
    const f = fixture(t, {empty: true});
    assert.deepEqual(f.cells(), ['No rows']);
    f.rows.setItem('r1', null, {code: '<img src=x onerror=alert(1)>', amount: 0});
    f.flush();
    assert.deepEqual(f.cells(), ['<img src=x onerror=alert(1)>', '0.00']);
    assert.equal(f.host.shadowRoot.querySelector('img'), null);
    const next = emptyStruct(); next.getItem('view_0.rows_0').setItem('flag', null, {tag: 'cell', field: 'flag', dtype: 'B'});
    f.rows.getNode('r1').setAttr({flag: false}); f.app.data.setItem('model.structure', next);
    f.flush();
    assert.deepEqual(f.cells(), ['false']);
});

test('wrong representations and resolvers fail without reads or writes', () => {
    let loads = 0;
    class Lazy extends BagResolver { load() { loads++; return 'loaded'; } }
    const rows = new Bag(); const data = new Bag(); data.setItem('rows', rows); data.setBackref(); rows.setItem('r1', new Lazy());
    assert.throws(() => new GridRows(new BagCollectionStore(rows, 'attributes')).read([{field: 'code'}]), /loaded rows/);
    rows.popNode('r1');
    rows.setItem('r1', new Bag()); rows.getItem('r1').setItem('code', new Lazy());
    assert.throws(() => new GridRows(new BagCollectionStore(rows, 'values')).read([{field: 'code'}]), /loaded cells/);
    assert.equal(loads, 0);
    assert.throws(() => new BagCollectionStore({}, 'values'), /Bag/);
    assert.throws(() => new BagCollectionStore(rows, undefined), /rowMode/);
    rows.setItem('r1', 'bad');
    assert.throws(() => new GridRows(new BagCollectionStore(rows, 'values')).read([]), /contain a Bag/);
});

test('struct rejects unknown attributes, duplicate fields and nested groups', () => {
    const bag = struct();
    bag.getNode('view_0.rows_0.code').setAttr({formula: '1+1'});
    assert.throws(() => new GridStructure(bag), /Unsupported.*formula/);
    const duplicate = struct(); duplicate.getItem('view_0.rows_0').setItem('again', null, {tag: 'cell', field: 'code'});
    assert.throws(() => new GridStructure(duplicate), /Duplicate grid field/);
    const nested = struct(); nested.getItem('view_0.rows_0').setItem('bad', struct(), {tag: 'colgroup', code: 'bad'});
    assert.throws(() => new GridStructure(nested), /Unsupported|scalar declaration/);
});

test('invalid inline structure is rejected before preceding Data setters run', t => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const layout = layoutWindow(window);
    const app = new Gramlot({document: window.document, transport: false, collections: [grid]});
    t.after(() => {app.dispose(); window.close();});
    const b = new GramlotBuilder(null, {collections: [grid]});
    b.root.dataSetter({destination_path: 'shouldNotExist', value: true});
    const g = b.root.grid({storepath: 'model.rows', rowMode: 'attributes'});
    const s = g.struct(); s.column({field: 'code'}); s.column({field: 'code'});
    assert.throws(() => app.src.startSource(b.toTytx()), /Duplicate grid field/);
    assert.equal(app.data.getNode('shouldNotExist'), null);
});


test('resizing writes the existing struct column and preserves both sharing grids and rows', t => {
    const f = fixture(t, {two: true});
    const bag = f.app.data.getItem('model.structure');
    f.flush();
    const row = f.host.shadowRoot.querySelector('tbody tr');
    const cell = row.cells[1];
    const node = bag.getNode('view_0.rows_0.amount');
    new GridStructure(bag).setColumnWidth('amount', 211);
    f.flush();
    assert.equal(bag.getNode('view_0.rows_0.amount'), node);
    assert.equal(node.getAttr('width'), '211px');
    for (const id of ['first', 'second']) {
    f.flush();
        const root = f.window.document.getElementById(id).shadowRoot;
    f.flush();
        assert.equal(root.querySelectorAll('table')[0].querySelectorAll('col')[1].style.width, '211px');
        assert.equal(root.querySelectorAll('table')[1].querySelectorAll('col')[1].style.width, '211px');
    }
    f.flush();
    assert.equal(f.host.shadowRoot.querySelector('tbody tr'), row);
    assert.equal(row.cells[1], cell);
});

test('column movement changes Bag order and projects all sharing grids without replacing rows', t => {
    const f = fixture(t, {two:true});
    const bag = f.app.data.getItem('model.structure');
    const group = bag.getItem('view_0.rows_0');
    group.setItem('quantity', null, {tag:'cell',field:'quantity',name:'Quantity',width:'60px'});
    f.rows.getNode('r1').setAttr({quantity:3});
    const node = group.getNode('amount');
    f.flush();
    const row = f.host.shadowRoot.querySelector('tbody tr');
    new GridStructure(bag).moveColumn('amount', 'quantity', true);
    f.flush();
    assert.deepEqual(group.getNodes().map(n => n.label), ['code','quantity','amount']);
    assert.equal(group.getNode('amount'), node);
    for (const id of ['first', 'second']) {
    f.flush();
        const root = f.window.document.getElementById(id).shadowRoot;
    f.flush();
        assert.deepEqual([...root.querySelectorAll('tbody td')].map(td=>td.textContent), ['A','3','12.50']);
    }
    f.flush();
    assert.equal(f.host.shadowRoot.querySelector('tbody tr'), row);
});


test('moving across a columnset preserves membership and splits/joins contiguous header bands', t => {
    const f = fixture(t);
    const bag = f.app.data.getItem('model.structure'), cells = bag.getItem('view_0.rows_0');
    cells.setItem('quantity', null, {tag:'cell',field:'quantity',columnset:'numbers'});
    const amount = cells.getNode('amount'), definitions = bag.getItem('info.columnsets');
    new GridStructure(bag).moveColumn('code', 'amount', true);
    f.flush();
    assert.deepEqual(cells.getNodes().map(node=>node.getAttr('field')), ['amount','code','quantity']);
    assert.equal(cells.getNode('amount'), amount);
    assert.equal(amount.getAttr('columnset'), 'numbers');
    assert.equal(bag.getItem('info.columnsets'), definitions);
    assert.deepEqual([...f.host.shadowRoot.querySelectorAll('th[scope=colgroup]')].map(th=>th.textContent), ['Numbers','Numbers']);
    new GridStructure(bag).moveColumn('code', 'quantity', true);
    f.flush();
    assert.equal(f.host.shadowRoot.querySelectorAll('th[scope=colgroup]').length, 1);
    assert.equal(f.host.shadowRoot.querySelector('th[scope=colgroup]').colSpan, 2);
});


test('legacy group colors and cell white_space project from struct Data', t => {
    const f = fixture(t), bag = f.app.data.getItem('model.structure');
    const row = f.host.shadowRoot.querySelector('tbody tr');
    bag.getNode('info.columnsets.numbers').setAttr({background:'rgb(20, 90, 60)',color:'white'});
    bag.getNode('view_0.rows_0.amount').setAttr({white_space:'pre-wrap'});
    f.flush();
    const band = f.host.shadowRoot.querySelector('th[scope=colgroup]');
    f.flush();
    assert.equal(band.style.background, 'rgb(20, 90, 60)');
    assert.equal(band.style.color, 'white');
    assert.equal(row.cells[1].style.whiteSpace, 'pre-wrap');
    assert.equal(f.host.shadowRoot.querySelector('tbody tr'), row);
});

for (const mode of ['values', 'attributes']) test(`${mode}: row headers are generated ordinals and follow store indices`, t => {
    const f = fixture(t, {mode, rowHeaders:true});
    const headings = () => [...f.host.shadowRoot.querySelectorAll('tbody th[scope=row]')].map(cell => cell.textContent);
    const content = mode === 'values' ? new Bag({code:'B',amount:7}) : null;
    f.rows.setItem('r2', content, mode === 'attributes' ? {code:'B',amount:7} : {});
    f.flush();
    assert.deepEqual(headings(), ['1','2']);
    assert.deepEqual(f.cells(), ['A','12.50','B','7.00']);
    assert.equal(f.host.control.getAttribute('aria-colcount'), '3');
    assert.equal(f.host.shadowRoot.querySelector('tbody td').getAttribute('aria-colindex'), '2');
    const corner = f.host.shadowRoot.querySelector('thead .row-heading');
    f.flush();
    assert.equal(corner.rowSpan, 2);
    assert.equal(corner.querySelector('.column-resize'), null);
    assert.equal(f.host.shadowRoot.querySelectorAll('col').length, 6);
    f.source.gridCollectionView.moveRow(f.rows.getNode('r2'), f.rows.getNode('r1'));
    f.flush();
    assert.deepEqual(headings(), ['1','2']);
    assert.deepEqual(f.cells(), ['B','7.00','A','12.50']);
    f.rows.popNode('r1');
    f.flush();
    assert.deepEqual(headings(), ['1']);
    assert.deepEqual(f.cells(), ['B','7.00']);
    assert.equal(f.rows.getNode('r2').getAttr('rowHeight'), null);
    f.source.setAttr({rowHeaders:false});
    f.flush();
    assert.deepEqual(headings(), []);
    assert.deepEqual(f.cells(), ['B','7.00']);
    assert.equal(f.host.control.getAttribute('aria-colcount'), '2');
    f.source.setAttr({rowHeaders:true});
    f.flush();
    assert.deepEqual(headings(), ['1']);
    assert.deepEqual(f.cells(), ['B','7.00']);
});


function rowGesture(f) {
    const body = f.host.shadowRoot.querySelector('tbody');
    const row = body.querySelector('tr');
    const handle = row.querySelector('.row-height-handle');
    row.getBoundingClientRect = () => ({height:Math.max(32, Number.parseFloat(row.style.height) || 0)});
    const captured = new Set();
    handle.setPointerCapture = id => captured.add(id);
    handle.hasPointerCapture = id => captured.has(id);
    handle.releasePointerCapture = id => captured.delete(id);
    const pointer = (type, y, target = body) => {
        const event = new f.window.MouseEvent(type, {bubbles:true,button:0,clientY:y});
        Object.defineProperty(event, 'pointerId', {value:1});
        target.dispatchEvent(event);
    };
    const key = value => handle.dispatchEvent(new f.window.KeyboardEvent('keydown', {bubbles:true,key:value}));
    return {body,row,handle,captured,pointer,key};
}

for (const mode of ['values','attributes']) test(`${mode}: row heights belong to each Source grid, not shared Data`, t => {
    const f = fixture(t, {mode,two:true,rowResize:true});
    const g = rowGesture(f), node = f.rows.getNode('r1');
    const otherSource = f.app.src.source.getNode('main.pane.second');
    f.flush();
    const second = f.window.document.getElementById('second').shadowRoot.querySelector('tbody tr');
    f.flush();
    assert.notEqual(f.source.gridRowLayout, otherSource.gridRowLayout);
    const originalData = JSON.stringify(f.rows.getNodes().map(node => [node.label, node.attr, node.staticValue instanceof Bag ? node.staticValue.getNodes().map(cell => [cell.label,cell.staticValue]) : node.staticValue]));
    g.pointer('pointerdown', 32, g.handle); g.pointer('pointermove', 82);
    f.flush();
    assert.equal(g.row.style.height, '82px');
    assert.equal(f.source.gridRowLayout.height(node), null, 'preview is not committed');
    assert.equal(second.style.height, '');
    g.pointer('pointerup', 82);
    f.flush();
    assert.equal(f.source.gridRowLayout.height(node), 82);
    assert.equal(otherSource.gridRowLayout.height(node), null);
    assert.equal(JSON.stringify(f.rows.getNodes().map(node => [node.label, node.attr, node.staticValue instanceof Bag ? node.staticValue.getNodes().map(cell => [cell.label,cell.staticValue]) : node.staticValue])), originalData);
    g.pointer('pointerdown', 82, g.handle); g.pointer('pointermove', 120); g.key('Escape');
    assert.equal(g.row.style.height, '82px');
    assert.equal(g.captured.size, 0);
    g.pointer('pointerdown', 82, g.handle); g.pointer('pointermove', 120); g.pointer('pointercancel', 120);
    assert.equal(g.row.style.height, '82px');
    assert.equal(g.captured.size, 0);
    g.key('ArrowDown');
    f.flush();
    assert.equal(g.row.style.height, '92px');
    g.key('ArrowUp');
    f.flush();
    assert.equal(g.row.style.height, '82px');
    g.key('Home');
    f.flush();
    assert.equal(g.row.style.height, '');
    g.pointer('pointerdown', 32, g.handle); g.pointer('pointerup', 10);
    f.flush();
    assert.equal(g.row.getBoundingClientRect().height, 32, 'content is the minimum');
    assert.equal(f.source.gridRowLayout.height(node), null, 'a gesture with no size change keeps automatic height');
    g.handle.dispatchEvent(new f.window.MouseEvent('dblclick', {bubbles:true}));
    f.flush();
    assert.equal(f.source.gridRowLayout.height(node), null);
});

test('row heights survive updates and DOM moves; removal/replacement clears their state', t => {
    const f = fixture(t, {rowResize:true});
    const g = rowGesture(f), node = f.rows.getNode('r1'), layout = f.source.gridRowLayout;
    g.pointer('pointerdown', 32, g.handle); g.pointer('pointerup', 80);
    f.rows.getNode('r1').setAttr({amount:17});
    f.flush();
    assert.equal(g.row.style.height, '80px');
    f.app.data.getItem('model.structure').getNode('view_0.rows_0.code').setAttr({name:'Identity'});
    f.flush();
    assert.equal(g.row.style.height, '80px');
    const parent = f.host.parentElement;
    g.pointer('pointerdown', 80, g.handle); g.pointer('pointermove', 120);
    f.host.remove();
    assert.equal(g.captured.size, 0);
    assert.equal(g.row.style.height, '80px');
    parent.append(f.host);
    f.flush();
    assert.equal(f.source.gridRowLayout, layout);
    assert.equal(g.row.style.height, '80px');
    g.pointer('pointerdown', 80, g.handle); g.pointer('pointermove', 100);
    f.rows.popNode('r1');
    f.flush();
    assert.equal(g.captured.size, 0);
    assert.equal(layout.height(node), null);
    f.rows.setItem('r1', null, {code:'New',amount:1});
    f.flush();
    assert.equal(f.host.shadowRoot.querySelector('tbody tr').style.height, '');
    const newNode = f.rows.getNode('r1'); layout.setHeight(newNode, 90);
    const replacement = new Bag(); replacement.setItem('r1', null, {code:'Replacement',amount:2});
    f.app.data.setItem('model.rows', replacement);
    f.flush();
    assert.equal(layout.height(newNode), null);
    assert.equal(f.host.shadowRoot.querySelector('tbody tr').style.height, '');
});


function rowDrag(f) {
    const dataTransfer = {effectAllowed:'none',dropEffect:'none',setData() {}};
    return (target, type, clientY = 0) => {
        const event = new f.window.Event(type, {bubbles:true,cancelable:true});
        Object.defineProperties(event, {dataTransfer:{value:dataTransfer},clientY:{value:clientY},relatedTarget:{value:null}});
        target.dispatchEvent(event);
        return event;
    };
}
for (const mode of ['values','attributes']) test(`${mode}: selfDragRows changes indices only, retaining rows and individual heights`, t => {
    const f = fixture(t, {mode,two:true,rowHeaders:true,rowResize:true,selfDragRows:true});
    for (const [label,code] of [['r2','B'],['r3','C']]) f.rows.setItem(label,
        mode === 'values' ? new Bag({code,amount:2}) : null, mode === 'attributes' ? {code,amount:2} : {});
    f.flush();
    const nodes = f.rows.getNodes(), rows = [...f.host.shadowRoot.querySelectorAll('tbody tr')];
    const layout = f.source.gridRowLayout;
    layout.setHeight(nodes[0], 91);
    f.source.setAttr({rowHeaders:true});
    const drag = rowDrag(f);
    drag(rows[0], 'dragstart');
    drag(rows[2], 'dragover', 1);
    f.flush();
    assert.equal(rows[2].dataset.rowDrop, 'after');
    drag(rows[2], 'drop', 1);
    f.flush();
    assert.deepEqual(f.rows.getNodes(), nodes, 'physical Bag order is unchanged');
    assert.deepEqual(nodes.map(node => node.getAttr('rowidx')), [null,null,null]);
    assert.equal(f.host.shadowRoot.querySelector('tbody tr:last-child'), rows[0]);
    assert.equal(rows[0].style.height, '91px');
    assert.deepEqual([...f.host.shadowRoot.querySelectorAll('.row-number')].map(n=>n.textContent), ['1','2','3']);
    const other = f.window.document.getElementById('second').shadowRoot;
    f.flush();
    assert.equal(other.querySelector('tbody tr:last-child').dataset.row, 'r3');
    assert.equal(other.querySelector('tbody tr:last-child').style.height, '');
    assert.equal(f.host.shadowRoot.querySelector('[data-row-drop],.row-dragging'), null);
    drag(rows[0], 'dragstart'); drag(rows[1], 'drop', -1);
    f.flush();
    assert.deepEqual(f.rows.getNodes(), nodes);
    assert.deepEqual(nodes.map(node => node.getAttr('rowidx')), [null,null,null], 'drag does not write business metadata');
    drag(rows[0], 'dragstart'); drag(rows[0], 'drop', 1); drag(rows[0], 'dragend');
    f.flush();
    assert.deepEqual(f.rows.getNodes(), nodes, 'self drop is a no-op');
});

test('selfDragRows is opt-in, rejects foreign-grid drops and cancels when disabled or retargeted', t => {
    const f = fixture(t, {two:true,rowResize:true});
    f.rows.setItem('r2', null, {code:'B',amount:2});
    f.flush();
    const rows = [...f.host.shadowRoot.querySelectorAll('tbody tr')], nodes = f.rows.getNodes(), drag=rowDrag(f);
    f.flush();
    assert.equal(rows[0].draggable, false);
    assert.equal(drag(rows[0], 'dragstart').defaultPrevented, true);
    f.source.setAttr({selfDragRows:true});
    f.flush();
    assert.equal(rows[0].draggable, true);
    drag(rows[0], 'dragstart');
    f.flush();
    const other = f.window.document.getElementById('second').shadowRoot.querySelector('tbody tr:last-child');
    f.flush();
    assert.equal(drag(other, 'dragover', 1).defaultPrevented, false);
    drag(other, 'drop', 1);
    f.flush();
    assert.deepEqual(f.rows.getNodes(), nodes);
    f.source.setAttr({selfDragRows:false});
    drag(rows[1], 'drop', 1);
    f.flush();
    assert.deepEqual(f.rows.getNodes(), nodes);
    assert.equal(f.host.shadowRoot.querySelector('.row-dragging'), null);
    f.source.setAttr({selfDragRows:true});
    f.flush();
    assert.equal(drag(rows[0].querySelector('.row-height-handle'), 'dragstart').defaultPrevented, true);
    drag(rows[0], 'dragstart'); drag(rows[1], 'dragover', 1);
    const replacement = new Bag(); replacement.setItem('fresh', null, {code:'Fresh',amount:1});
    f.app.data.setItem('model.rows', replacement);
    f.flush();
    drag(f.host.shadowRoot.querySelector('tbody tr'), 'drop', 1);
    f.flush();
    assert.deepEqual(f.rows.getNodes(), nodes);
    assert.deepEqual(replacement.getNodes().map(n=>n.label), ['fresh']);
});


for (const mode of ['values', 'attributes']) test(`${mode}: multicolumn headers share typed store order and drag switches to manual`, t => {
    const f = fixture(t, {mode,two:true,selfDragRows:true,rowResize:true});
    for (const [label, code, amount] of [['r2','B',2],['r3','A',100],['r4','A',2]]) {
        f.rows.setItem(label, mode === 'values' ? new Bag({code,amount}) : null,
            mode === 'attributes' ? {code,amount} : {});
    }
    const physical = f.rows.getNodes();
    f.flush();
    const original = [...f.host.shadowRoot.querySelectorAll('tbody tr')];
    f.flush();
    const labels = host => [...host.shadowRoot.querySelectorAll('tbody tr')].map(row => row.dataset.row);
    f.flush();
    const header = field => f.host.shadowRoot.querySelector(`th[data-field=${field}]`);
    const click = (field, shiftKey = false) => header(field).dispatchEvent(new f.window.MouseEvent('click', {bubbles:true,shiftKey}));
    click('code'); click('amount', true);
    f.flush();
    assert.equal(f.source.gridCollectionView.sortedBy, 'code:a,amount:a');
    assert.deepEqual(labels(f.host), ['r4','r1','r3','r2']);
    assert.deepEqual(labels(f.window.document.getElementById('second')), ['r1','r2','r3','r4']);
    assert.equal(header('code').getAttribute('aria-sort'), 'ascending');
    assert.equal(header('amount').dataset.sortPriority, '2');
    assert.equal(header('amount').getAttribute('aria-sort'), null);
    click('amount', true);
    f.flush();
    assert.deepEqual(labels(f.host), ['r3','r1','r4','r2']);
    assert.equal(f.source.gridCollectionView.sortedBy, 'code:a,amount:d');
    // Values are live; numbers are compared before their displayed 0.00 formatting.
    if (mode === 'values') f.rows.getItem('r1').setItem('amount', 200);
    else f.rows.getNode('r1').setAttr({amount:200});
    f.flush();
    assert.deepEqual(labels(f.host), ['r1','r3','r4','r2']);
    const drag = rowDrag(f);
    drag(original[0], 'dragstart'); drag(original[1], 'drop', 1);
    f.flush();
    assert.deepEqual(labels(f.host), ['r3','r4','r2','r1']);
    assert.equal(f.source.gridCollectionView.sortedBy, '');
    assert.equal(f.host.shadowRoot.querySelector('[data-sort-priority]'), null);
    assert.equal(f.window.document.getElementById('second').shadowRoot.querySelector('[data-sort-priority]'), null);
    assert.deepEqual(f.rows.getNodes(), physical);
    assert.equal(f.host.shadowRoot.querySelector('tbody tr:last-child'), original[0]);
    header('amount').dispatchEvent(new f.window.KeyboardEvent('keydown', {key:'Enter',bubbles:true}));
    f.flush();
    assert.deepEqual(labels(f.host), ['r4','r2','r3','r1']);
    header('amount').dispatchEvent(new f.window.KeyboardEvent('keydown', {key:' ',bubbles:true}));
    f.flush();
    assert.deepEqual(labels(f.host), ['r1','r3','r4','r2']);
});

test('view sort survives detach, struct changes and store replacement; resize does not sort', t => {
    const f = fixture(t, {selfDragRows:true});
    f.rows.setItem('r2', null, {code:'B',amount:2});
    f.flush();
    const header = f.host.shadowRoot.querySelector('th[data-field=amount]');
    header.click();
    const parent = f.host.parentElement;
    f.host.remove();
    f.source.gridCollectionView.sort('code:d');
    parent.append(f.host);
    f.flush();
    assert.equal(f.host.shadowRoot.querySelector('th[data-field=code]').getAttribute('aria-sort'), 'descending');
    f.app.data.getItem('model.structure').getNode('view_0.rows_0.code').setAttr({name:'Identity'});
    f.flush();
    assert.equal(f.host.shadowRoot.querySelector('th[data-field=code]').getAttribute('aria-sort'), 'descending');
    f.host.shadowRoot.querySelector('.column-resize').click();
    f.flush();
    assert.equal(f.source.gridCollectionView.sortedBy, 'code:d');
    const replacement = new Bag(); replacement.setItem('x', null, {code:'X',amount:1});
    f.app.data.setItem('model.fresh', replacement);
    f.source.setAttr({storepath:'.fresh'});
    f.flush();
    assert.equal(f.host.shadowRoot.querySelector('th[data-field=code]').dataset.sortDirection,'descending');
    assert.equal(f.host.shadowRoot.querySelector('tbody tr').dataset.row, 'x');
    f.source.gridCollectionView.sort('code:a');
    f.flush();
    assert.equal(f.host.shadowRoot.querySelector('tbody tr').dataset.row, 'x');
});


test('two grids keep independent filters and both react to shared values',t=>{
    const f=fixture(t,{two:true});f.rows.setItem('r2',null,{code:'B',amount:2});f.flush();
    const second=f.window.document.getElementById('second');
    const other=f.app.src.source.getNode('main.pane.second').gridCollectionView;
    f.source.gridCollectionView.applyFilter({value:'A',columns:['code'],dtype:'T',locale:'en-GB'});
    other.applyFilter({value:'^B$',columns:['code'],dtype:'T',locale:'en-GB'});
    f.flush();assert.deepEqual(f.cells(),['A','12.50']);
    assert.equal(second.shadowRoot.querySelector('tbody td').textContent,'B');
    f.rows.getNode('r2').setAttr({code:'AA'});f.flush();
    assert.equal(f.host.shadowRoot.querySelectorAll('tbody tr[data-row]').length,2);
    assert.equal(second.shadowRoot.querySelectorAll('tbody tr[data-row]').length,0);
    assert.equal(other.filter.value,'^B$');
    assert.equal(f.rows.parentNode.getAttr('filter'),null);
});
