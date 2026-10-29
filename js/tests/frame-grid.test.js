import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {fromTytx} from '@genrojs/tytx';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import {SourceBag, sourceTarget} from '@genrojs/builders';
import grid from '../src/components/grid.js';
import layout from '../src/components/layout.js';
import {layoutWindow} from './helpers/layout-window.js';
import {commandFrame, frameRecipient} from '../src/view/menu-command.js';

const collections = [layout, grid];
function author(root, name) {
    const frame = root.frameGrid({node_label: name, datapath: name, storepath: '.rows', rowMode: 'attributes', height: '300px'});
    frame.grid.setAttr({id: `${name}-grid`, selfsubscribe_refresh: 'refresh'});
    frame.grid.struct().column({field: 'name'});
    frame.top.menu({presentation: 'bar'}).menuline('gridDemo:refresh', {id: `${name}-refresh`});
    frame.bottom.menu({presentation: 'bar'}).menuline({group: true}).span('Read only');
    return frame;
}

test('frameGrid is ordinary Source with idempotent access and optional collections', () => {
    const b = new GramlotBuilder(null, {collections});
    const frame = author(b.root, 'one');
    assert.equal(frame.nodeTag, 'framePane');
    assert.equal(frame.grid, frame.grid);
    assert.equal(sourceTarget(frame.grid).parentNode, sourceTarget(frame.center));
    assert.equal(frame.grid.getAttr('frameTarget'), true);
    assert.equal(frame.getAttr('storepath'), null);
    assert.equal(b.toTytx().includes('frameGrid'), false);
    for (const missing of [[], [layout], [grid]]) {
        const empty = new GramlotBuilder(null, {collections: missing});
        assert.throws(() => empty.root.frameGrid({storepath: 'rows', rowMode: 'values'}), /requires/);
        assert.equal(empty.source.getNodes().length, 0);
    }
    assert.throws(() => b.root.framePane().grid, /no central grid/);
});

test('invalid grid parameters cannot leave a partial frame', () => {
    for (const attrs of [{storepath:null,rowMode:'values'}, {storepath:'rows',rowMode:'invalid'}]) {
        const b = new GramlotBuilder(null, {collections});
        assert.throws(() => b.root.frameGrid(attrs));
        assert.equal(b.source.getNodes().length,0);
    }
});

test('two frame toolbars address their own grid and survive row changes without remounting', async t => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    const app = new Gramlot({document: window.document, transport: false, collections});
    t.after(() => {app.dispose(); window.close();});
    app.commands.registerGroup('gridDemo').register('refresh', {label: 'Refresh', publish: 'refresh'});
    const received = [];
    app.src.logicRegistry.register(class Logic {
        refresh(node, message) {
            received.push(message);
            node.getRelativeData('.rows').getNode('r1').setAttr({name: 'Updated'});
        }
    }, {resource: 'test:frame-grid'});
    for (const name of ['one', 'two']) {
        const rows = new Bag(); rows.setItem('r1', null, {name}); app.data.setItem(`${name}.rows`, rows);
    }
    const b = new GramlotBuilder(null, {collections});
    author(b.root, 'one'); author(b.root, 'two');
    app.src.startSource(b.toTytx());
    await new Promise(resolve => window.setTimeout(resolve,0));
    const first = window.document.getElementById('one-grid');
    const row = first.shadowRoot.querySelector('tbody tr');
    const click = window.document.getElementById('one-refresh');
    click.control.dispatchEvent(new window.MouseEvent('click', {bubbles: true, composed: true}));
    await new Promise(resolve => window.setTimeout(resolve,0));
    assert.equal(received.length, 1);
    assert.equal(received[0].target.getAttr('id'), 'one-grid');
    assert.equal(received[0].command, 'gridDemo:refresh');
    assert.equal(first.shadowRoot.querySelector('td').textContent, 'Updated');
    assert.equal(window.document.getElementById('two-grid').shadowRoot.querySelector('td').textContent, 'two');
    assert.equal(first.shadowRoot.querySelector('tbody tr'), row);
    const target = received[0].target, frame = commandFrame(target);
    assert.equal(frameRecipient(frame), target);
    const path = target.getAttr('structpath');
    frame.parentBag.popNode(frame.label);
    assert.equal(first.isConnected, false);
    assert.equal(app.src.binding.bindingFor(target), null);
    assert.ok(app.data.getItem(path) instanceof Bag, 'installed struct remains ordinary Data');
});

test('Python and JS frameGrid produce the same Source composition', () => {
    const wire = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', `
from gramlot import GramlotBuilder
from importlib.resources import files
import json
b=GramlotBuilder(collections=[json.loads(files('gramlot').joinpath('collections/'+name+'.json').read_text()) for name in ['layout','grid']])
f=b.root.frameGrid(node_label='demo',storepath='rows',rowMode='attributes',structpath='columns',searchOn=True,height='300px')
f.top.menu(presentation='bar').menuline('gridDemo:refresh')
print(b.to_tytx())
`], {encoding: 'utf8'}).trim();
    const b = new GramlotBuilder(null, {collections});
    const f = b.root.frameGrid({node_label: 'demo', storepath: 'rows', rowMode: 'attributes', structpath: 'columns', searchOn:true, height: '300px'});
    f.top.menu({presentation: 'bar'}).menuline('gridDemo:refresh');
    const shape = bag => bag.getNodes().map(node => ({label: node.label, tag: node.nodeTag,
        attrs: node.getAttr(), children: node.staticValue instanceof SourceBag ? shape(node.staticValue) : node.staticValue}));
    assert.deepEqual(shape(fromTytx(wire)), shape(b.source));
});


function searchFixture(t, {mode='attributes',searchOn=true}={}) {
    t.mock.timers.enable({apis:['setTimeout']});
    const {window}=new JSDOM('<main id="gramlot-root"></main>'); layoutWindow(window);
    const app=new Gramlot({document:window.document,transport:false,collections,locale:'it-IT'});
    t.after(()=>{app.dispose();window.close();});
    const records=[{name:'Alpha',qty:3},{name:'Beta',qty:9},{name:'Alpine',qty:1}], rows=new Bag();
    records.forEach((row,i)=>rows.setItem('r'+i,mode==='values'?new Bag(row):null,mode==='attributes'?row:{}));
    app.data.setItem('demo.rows',rows);
    const b=new GramlotBuilder(null,{collections});
    const frame=b.root.frameGrid({datapath:'demo',storepath:'.rows',rowMode:mode,searchOn});
    frame.grid.setAttr({id:'search-grid',rowResize:true,selfDragRows:true});
    const struct=frame.grid.struct();
    struct.column({field:'name',name:'Name'});
    struct.column({field:'qty',name:'Quantity',dtype:'L'});
    app.src.startSource(b.toTytx()); t.mock.timers.tick(0);
    const gridElement=window.document.getElementById('search-grid');
    const box=window.document.querySelector('gramlot-search-box');
    const input=box.shadowRoot.querySelector('input'), select=box.shadowRoot.querySelector('select');
    const labels=()=>[...gridElement.shadowRoot.querySelectorAll('tbody tr[data-row]')].map(row=>row.dataset.row);
    const type=value=>{input.value=value;input.dispatchEvent(new window.Event('input'));};
    const flush=()=>t.mock.timers.tick(100);
    const view=app.src.binding.renderer.getBaseSourceNode(gridElement).gridCollectionView;
    return {app,window,rows,input,select,box,gridElement,labels,type,flush,view};
}

for(const mode of ['values','attributes']) {
    test(`${mode}: FrameGrid search selects all or a typed column and reacts to Data changes`,t=>{
        const f=searchFixture(t,{mode});
        assert.deepEqual([...f.select.options].map(option=>option.textContent),['All columns','Name','Quantity']);
        f.type('^Al'); assert.equal(f.labels().length,3); f.flush();
        assert.deepEqual(f.labels(),['r0','r2']);
        const update=(key,value)=>mode==='values'?f.rows.getItem(key).setItem('name',value):f.rows.getNode(key).setAttr({name:value});
        update('r1','Albatross'); f.flush(); assert.equal(f.labels().length,3);
        update('r0','Hidden'); f.flush(); assert.deepEqual(f.labels(),['r1','r2']);
        f.select.value='qty';f.select.dispatchEvent(new f.window.Event('change'));f.flush();
        assert.equal(f.labels().length,3); assert.equal(f.input.placeholder,' '); assert.match(f.box.shadowRoot.querySelector('#search-help').textContent,/> 100/);
        f.type('> 2');f.flush();assert.deepEqual(f.labels(),['r0','r1']);
        f.gridElement.shadowRoot.querySelector('th[data-field=qty]').click();f.flush();
        assert.deepEqual(f.labels(),['r0','r1']);
        assert.equal(f.view.sortedBy,'qty:a');
        f.type('>');f.flush();assert.equal(f.input.getAttribute('aria-invalid'),'true');
        assert.deepEqual(f.labels(),['r0','r1']);
        f.box.shadowRoot.querySelector('button').click();f.flush();
        assert.deepEqual(f.labels(),['r2','r0','r1']);
        assert.equal(f.view.sortedBy,'qty:a');
        assert.equal(f.view.filter,null);
    });
}

test('search menu accepts legacy caption/field lists and dtype restriction',t=>{
    const f=searchFixture(t,{searchOn:'*L'});
    assert.deepEqual([...f.select.options].map(option=>option.textContent),['All columns','Quantity']);
    f.type('<= 3');f.flush();assert.deepEqual(f.labels(),['r0','r2']);
});

test('search timer is cancelled on removal and hidden row heights survive filtering',t=>{
    const f=searchFixture(t);
    const source=f.app.src.binding.renderer.getBaseSourceNode(f.gridElement);
    source.gridRowLayout.setHeight(f.rows.getNode('r1'),80);
    f.type('^Al');f.flush();
    f.box.shadowRoot.querySelector('button').click();f.flush();
    assert.equal(source.gridRowLayout.height(f.rows.getNode('r1')),80);
    f.type('Beta');f.box.remove();f.flush();
    assert.equal(f.view.filter,null);
});


test('explicit legacy menu captions select only the declared fields',t=>{
    const f=searchFixture(t,{searchOn:'Product:name,Stock:qty'});
    assert.deepEqual([...f.select.options].map(option=>[option.textContent,option.value]),[['Product','name'],['Stock','qty']]);
    f.type('[');f.flush();
    assert.equal(f.input.getAttribute('aria-invalid'),'true');assert.equal(f.labels().length,3);
    f.type('^Al');f.flush();assert.deepEqual(f.labels(),['r0','r2']);
});

test('store replacement retargets search and pending work cannot filter the old Bag',t=>{
    const f=searchFixture(t);f.type('Alpha');
    const next=new Bag();next.setItem('new',null,{name:'New',qty:7});
    f.app.data.setItem('demo.rows',next);t.mock.timers.tick(0);f.flush();
    assert.deepEqual(f.labels(),['new']);assert.equal(f.input.value,'');
    f.type('New');f.flush();assert.deepEqual(f.view.filter.columns,['name','qty']);
    assert.equal(f.rows.getNodes().length,3);
});

test('active filters recompute membership and omit hidden rows from partial refreshes',t=>{
    const f=searchFixture(t);f.type('^Al');f.flush();
    f.rows.setItem('new',null,{name:'Albatross',qty:10});f.flush();
    assert.deepEqual(f.labels(),['r0','r2','new']);
    f.rows.popNode('r0');f.flush();assert.deepEqual(f.labels(),['r2','new']);
    const store=f.view;
    const invalidations=[];const release=store.subscribe(change=>invalidations.push(change));
    f.rows.getNode('r1').setAttr({qty:20});f.flush();
    assert.ok(invalidations.every(change=>change.full===false && change.rows.length===0));
    release();
});

test('two search bars and declarative requests remain independent on one Bag', t => {
    t.mock.timers.enable({apis:['setTimeout']});
    const {window}=new JSDOM('<main id="gramlot-root"></main>'); layoutWindow(window);
    const app=new Gramlot({document:window.document,transport:false,collections});
    t.after(()=>{app.dispose();window.close();});
    const rows=new Bag();
    for (const [label,name,qty] of [['a','Alpha',3],['b','Beta',9],['c','Alpine',1]]) rows.setItem(label,null,{name,qty});
    app.data.setItem('rows',rows);
    app.data.setItem('order','name:a,qty:d');
    app.data.setItem('filter',{value:'^Al',columns:['name'],dtype:'T'});
    const b=new GramlotBuilder(null,{collections});
    for (const id of ['first','second']) {
        const frame=b.root.frameGrid({storepath:'rows',rowMode:'attributes',searchOn:true});
        frame.grid.setAttr({id, sortedBy:id==='first'?'^order':'qty:d',
            filter:id==='first'?'^filter':{value:'> 2',columns:['qty'],dtype:'L'}});
        const s=frame.grid.struct(); s.column({field:'name'}); s.column({field:'qty',dtype:'L'});
    }
    app.src.startSource(b.toTytx()); t.mock.timers.tick(0);
    const hosts=['first','second'].map(id=>window.document.getElementById(id));
    const sources=hosts.map(host=>app.src.binding.renderer.getBaseSourceNode(host));
    const boxes=[...window.document.querySelectorAll('gramlot-search-box')];
    const labels=i=>[...hosts[i].shadowRoot.querySelectorAll('tbody tr[data-row]')].map(row=>row.dataset.row);
    assert.deepEqual(labels(0),['a','c']);assert.deepEqual(labels(1),['b','a']);
    assert.equal(boxes[0].shadowRoot.querySelector('input').value,'^Al');
    assert.equal(boxes[1].shadowRoot.querySelector('input').value,'> 2');
    hosts[0].shadowRoot.querySelector('th[data-field=name]').click();t.mock.timers.tick(0);
    sources[0].setAttr({rowHeaders:true});t.mock.timers.tick(0);
    assert.equal(sources[0].gridCollectionView.sortedBy,'name:d');
    assert.deepEqual(labels(0),['c','a']);assert.deepEqual(labels(1),['b','a']);
    const input=boxes[0].shadowRoot.querySelector('input');
    input.value='Beta';input.dispatchEvent(new window.Event('input'));t.mock.timers.tick(100);
    sources[0].setAttr({height:'400px'});t.mock.timers.tick(0);
    assert.deepEqual(labels(0),['b']);assert.deepEqual(labels(1),['b','a']);
    assert.equal(app.data.getItem('filter').value,'^Al','interactive filtering does not write back requests');
    app.data.setItem('order','qty:a');app.data.setItem('filter',null);t.mock.timers.tick(0);
    assert.deepEqual(labels(0),['c','a','b']);assert.deepEqual(labels(1),['b','a']);
    rows.getNode('b').setAttr({qty:0});t.mock.timers.tick(0);
    assert.deepEqual(labels(0),['b','c','a']);assert.deepEqual(labels(1),['a']);
    assert.equal(boxes[1].shadowRoot.querySelector('input').value,'> 2');
    assert.deepEqual(rows.getNodes().map(node=>node.label),['a','b','c']);
});
