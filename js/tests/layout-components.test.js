import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {layoutWindow} from './helpers/layout-window.js';
import {Bag} from '@genrojs/bag';
import {createDecimal} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';
import layout from '../src/components/layout.js';

function fixture(author) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const scheduling = layoutWindow(window);
    const app = new Gramlot({document:window.document, transport:false, collections:[inputs,layout]});
    const b = new GramlotBuilder(null,{collections:[inputs,layout]});
    author(b.root, app);
    app.src.startSource(b.toTytx());
    return {app,window,scheduling,element:id=>window.document.getElementById(id)};
}

test('portable layout grammar allows nested fields in Python and JavaScript', () => {
    assert.deepEqual(layout.toDocument(), JSON.parse(readFileSync(new URL('../../src/gramlot/collections/layout.json',import.meta.url))));
    const wire = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? '../.venv/bin/python', ['-c', `
import json
from gramlot import GramlotBuilder
from genro_tytx import to_tytx
from pathlib import Path
b=GramlotBuilder(collections=[json.loads(Path('../src/gramlot/collections/'+n+'.json').read_text()) for n in ('inputs','layout')])
g=b.root.GROUPBOX(id='group',lbl='Customer',datapath='customer',copy=True)
f=g.FORMLET(columns=2,lbl_position='L',lbl_width='8rem')
f.TEXTBOX(id='name',value='^.name',lbl='Name')
f.checkbox(value='^.enabled',lbl='Enabled',mode='switch')
f.radioButtonText(id='locked-radio',value='a',values='a:Alpha,b:Beta',readonly=True)
print(to_tytx(b.source))
`], {cwd:new URL('../',import.meta.url),encoding:'utf8'}).trim();
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    const app=new Gramlot({document:window.document,transport:false,collections:[inputs,layout]});
    app.data.setItem('customer.name','Ada');app.data.setItem('customer.enabled',true);
    app.src.startSource(wire);
    assert.equal(window.document.getElementById('name').control.value,'Ada');
    assert.equal(window.document.getElementById('name').box.dataset.position,'L');
    assert.equal(window.document.getElementById('locked-radio').control.querySelector('input').disabled,true);
    app.dispose();
});

test('formlet inherits resolved defaults in declaring scope, preserves overrides and drafts', () => {
    const {app,window,element}=fixture((root,app)=>{
        app.data.setItem('customer.name','Ada');app.data.setItem('layout.position','L');app.data.setItem('layout.cols',2);
        app.data.setItem('layout.color','red');
        const form=root.formlet({id:'form',node_label:'form',datapath:'layout',columns:'^.cols',lbl_position:'^.position',lbl_color:'^.color',lbl_width:'8rem',box_c_width:'100%'});
        form.textbox({id:'name',node_label:'name',datapath:'customer',value:'^.name',lbl:'Name'});
        form.textbox({id:'override',lbl:'Override',lbl_position:'TR',lbl_color:'blue'});
        form.textbox({id:'clear',lbl:'Cleared color',lbl_color:'^clearColor'});
        const nested=form.formlet({id:'nested',lbl_width:'6rem'});
        nested.checkbox({id:'nested-check',lbl:'Enabled',value:false});
    });
    const field=element('name'),input=field.control;
    assert.equal(field.box.dataset.position,'L');assert.equal(field.fieldLabel.style.color,'red');
    assert.equal(element('clear').fieldLabel.style.color,'');
    assert.equal(field.box.style.getPropertyValue('--gramlot-label-width'),'8rem');
    assert.equal(element('nested-check').box.style.getPropertyValue('--gramlot-label-width'),'6rem');
    input.value='uncommitted';input.focus();input.setSelectionRange(2,4);
    app.data.setItem('layout.position','TL');app.data.setItem('layout.cols',1);app.data.setItem('layout.color','green');
    assert.equal(element('name'),field);assert.equal(field.control,input);assert.equal(input.value,'uncommitted');
    assert.equal(input.selectionStart,2);assert.equal(field.shadowRoot.activeElement,input);
    assert.equal(field.box.dataset.position,'TL');assert.equal(field.fieldLabel.style.color,'green');
    assert.equal(element('override').box.dataset.position,'TR');assert.equal(element('override').fieldLabel.style.color,'blue');
    assert.equal(element('form').control.style.gridTemplateColumns,'repeat(1, minmax(0, 1fr))');
    const node=app.src.source.getNode('main.form.name');
    assert.equal(node.getAttr('lbl_position'),null);
    node.setAttr({lbl_position:'BR'});assert.equal(field.box.dataset.position,'BR');
    app.dispose();
});

test('groupBox copies only its live Bag scope, TYTX preserves types and attributes, JSON is values-only',async()=>{
    const {app,window,element}=fixture((root,app)=>{
        app.data.setItem('customer.name','Ada');app.data.setItem('customer.enabled',true);
        app.data.setItem('customer.amount',createDecimal('9007199254740993.25'));
        app.data.setItem('customer.date',new Date('2026-10-17T00:00:00Z'));
        app.data.getNode('customer.date').setAttr({kind:'civil-date'});
        app.data.setItem('customer.address.city','Rome');
        app.data.setItem('outside','excluded');
        root.groupBox({id:'group',lbl:'Customer',datapath:'customer',copy:true}).formlet({columns:1}).textbox({value:'^.name',lbl:'Name'});
    });
    const copies=[];Object.defineProperty(window.navigator,'clipboard',{value:{writeText:async text=>copies.push(text)}});
    const group=element('group');
    await group.copyData();
    const restored=Bag.fromTytx(copies[0]);
    assert.equal(restored.getItem('name'),'Ada');
    assert.equal(restored.getNode('date').getAttr('kind'),'civil-date');
    assert.equal(restored.getItem('address.city'),'Rome');assert.equal(restored.getItem('amount').toString(),'9007199254740993.25');
    assert.equal(restored.getItem('date').toISOString(),'2026-10-17T00:00:00.000Z');assert.equal(restored.getItem('outside'),null);
    app.data.setItem('customer.name','Grace');await group.copyData('JSON');
    assert.equal(JSON.parse(copies[1]).name,'Grace');assert.equal(Object.hasOwn(JSON.parse(copies[1]),'outside'),false);
    window.navigator.clipboard.writeText=async()=>{throw new Error('Permission denied');};
    await group.copyData();assert.match(group.status.textContent,/Permission denied/);
    app.dispose();await group.copyData();assert.equal(copies.length,2);
});

test('switch keeps boolean binding, native keyboard target, readonly and instance identity',()=>{
    const {app,element}=fixture((root,app)=>{
        app.data.setItem('enabled',false);app.data.setItem('mode','switch');app.data.setItem('readonly',false);
        root.checkbox({id:'switch',value:'^enabled',lbl:'Enabled',mode:'^mode',readonly:'^readonly'});
        root.checkbox({id:'plain',value:'^enabled',lbl:'Same boolean'});
    });
    const host=element('switch'),control=host.control;
    assert.equal(control.getAttribute('role'),'switch');assert.equal(control.getAttribute('aria-label'),host.fieldLabel.textContent);
    control.click();assert.equal(app.data.getItem('enabled'),true);assert.equal(element('plain').control.checked,true);
    app.data.setItem('readonly',true);control.click();assert.equal(control.checked,true);assert.equal(app.data.getItem('enabled'),true);
    app.data.setItem('mode','checkbox');assert.equal(host.control,control);assert.equal(control.hasAttribute('role'),false);
    app.dispose();
});

test('switch color follows Data, restores the theme and stays local to the active switch', () => {
    const {app, element} = fixture((root, app) => {
        app.data.setItem('enabled', true); app.data.setItem('shade', 'purple'); app.data.setItem('mode', 'switch');
        root.checkbox({id: 'colored', value: '^enabled', mode: '^mode', switch_color: '^shade', color: 'green'});
        root.checkbox({id: 'themed', value: '^enabled', mode: 'switch'});
    });
    const host = element('colored'), control = host.control;
    assert.equal(control.style.getPropertyValue('--gramlot-switch-on'), 'purple');
    assert.equal(element('themed').control.style.getPropertyValue('--gramlot-switch-on'), '');
    app.data.setItem('shade', '#ff0000');
    assert.equal(control.style.getPropertyValue('--gramlot-switch-on'), '#ff0000');
    app.data.setItem('mode', 'checkbox');
    assert.equal(control.style.getPropertyValue('--gramlot-switch-on'), '');
    app.data.setItem('mode', 'switch');
    assert.equal(control.style.getPropertyValue('--gramlot-switch-on'), '#ff0000');
    app.data.setItem('shade', null);
    assert.equal(control.style.getPropertyValue('--gramlot-switch-on'), '');
    assert.equal(host.style.color, 'green');
    assert.equal(host.control, control); assert.equal(app.data.getItem('enabled'), true);
    app.dispose();
});


test('intrinsic label layout batches projection and releases observers on detach/disposal', async () => {
    const {app,window,scheduling,element}=fixture(root=>{
        const f=root.formlet({id:'layout',lbl_position:'L'});
        f.textbox({id:'field',lbl:'Name'});
        f.p('Ordinary slotted content');
    });
    scheduling.flush();
    const form=element('layout'),field=element('field');
    const observer=scheduling.observers[0];
    assert(observer.targets.has(field.fieldLabel));
    assert(observer.targets.has(form.control));
    assert.equal(field.box.dataset.formletAligned,'');
    for(let i=0;i<5;i++) field.dispatchEvent(new window.Event('gramlot-label-layout',{bubbles:true}));
    assert.equal(scheduling.frames.size,1);
    const parent=form.parentNode;
    form.remove();
    assert.equal(observer.targets.size,0);
    assert.equal(scheduling.frames.size,0);
    assert.equal(field.box.hasAttribute('data-formlet-aligned'),false);
    parent.append(form);
    scheduling.flush();
    assert(scheduling.observers[1].targets.has(field.fieldLabel));
    field.box.remove();
    await Promise.resolve();
    scheduling.flush();
    assert.equal(scheduling.observers[1].targets.has(field.fieldLabel),false);
    assert.equal(field.box.hasAttribute('data-formlet-aligned'),false);
    app.dispose();
    assert.equal(scheduling.frames.size,0);
    assert(scheduling.observers.every(observer=>observer.targets.size===0));
    window.close();
});
