import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot} from '../src/index.js';
import {mount} from './fixtures/mount.js';
function page() {
    const {window} = new JSDOM('<main></main>');
    const app = new Gramlot({document:window.document,element:window.document.querySelector('main'),transport:false});
    return {window,app,document:window.document};
}

test('HTML labelbox keeps div, children, Source, Data and bindings stable across label/layout changes',()=>{
    const {app,document,window}=page(); app.data.setItem('caption','Name');app.data.setItem('position','TL');app.data.setItem('value','Ada');
    const {group,field}=mount(app,root=>{
        const group=root.div({id:'group',lbl:'^caption',lbl_position:'^position',box_padding:'8px',box_l_background:'ivory',box_c_padding:'3px',lbl_color:'red',color:'blue'});
        const field=group.input({id:'field',value:'^value',live:true,lbl:'Name'});return {group,field};
    });
    const renderer=app.src.renderer, node=sourceTarget(group), record=renderer.records.get(node);
    const element=document.getElementById('group'), input=document.getElementById('field');
    const fieldRecord=renderer.records.get(sourceTarget(field)),binding=fieldRecord.binding;
    const source=app.src.builder.source, data=app.data;
    assert.notEqual(record.presentation,element);assert.equal(renderer.getDomNode(node),element);
    assert.equal(record.labelbox.box.style.padding,'8px');assert.equal(record.labelbox.labelBox.style.background,'ivory');
    assert.equal(record.labelbox.controlBox.style.padding,'3px');assert.equal(record.labelbox.fieldLabel.style.color,'red');assert.equal(element.style.color,'blue');
    assert.equal(element.hasAttribute('lbl'),false);assert.equal(element.hasAttribute('box_padding'),false);
    assert.equal(fieldRecord.labelbox.fieldLabel.htmlFor,input.id);
    input.focus();input.setSelectionRange(1,2);
    app.data.setItem('caption','Customer');app.data.setItem('position','L');
    assert.equal(document.activeElement,input);assert.equal(input.selectionStart,1);
    assert.equal(record.labelbox.fieldLabel.textContent,'Customer');assert.equal(record.presentation.dataset.position,'L');
    assert.equal(document.getElementById('group'),element);assert.equal(document.getElementById('field'),input);
    assert.equal(app.data,data);assert.equal(app.src.builder.source,source);assert.equal(fieldRecord.binding,binding);
    input.value='Grace';input.dispatchEvent(new window.Event('input',{bubbles:true}));assert.equal(app.data.getItem('value'),'Grace');
    app.data.setItem('caption',null);assert.equal(record.labelbox.labelBox.hidden,true);assert.equal(record.presentation.hasAttribute('aria-labelledby'),false);
    node.setAttr({box_padding:null,lbl_color:null,hidden:true});assert.equal(record.presentation.hidden,true);assert.equal(record.presentation.style.padding,'');
    node.setAttr({hidden:false});assert.equal(record.presentation.hidden,false);
});

test('wrapped siblings insert, rebuild and remove through their outer presentation',()=>{
    const {app,document}=page();
    const {parent,first,last}=mount(app,root=>{const parent=root.div({id:'parent'});const first=parent.div('First',{id:'first',lbl:'A'});const last=parent.div('Last',{id:'last',lbl:'B'});return {parent,first,last};});
    const renderer=app.src.renderer,lastNode=sourceTarget(last),lastRecord=renderer.records.get(lastNode);
    const added=parent.div('New',{id:'new',lbl:'C',node_position:`<${lastNode.label}`}),addedNode=sourceTarget(added),addedRecord=renderer.records.get(addedNode);
    assert.equal(addedRecord.presentation.parentNode,document.getElementById('parent'));
    assert.equal(addedRecord.presentation.nextSibling,lastRecord.presentation);
    sourceTarget(first).setValue('Changed');assert.equal(document.getElementById('first').textContent,'Changed');
    lastNode.parentBag.popNode(lastNode.label);assert.equal(lastRecord.presentation.isConnected,false);assert.equal(renderer.records.has(lastNode),false);
    sourceTarget(parent).parentBag.popNode(sourceTarget(parent).label);
    assert.equal(document.querySelector('.gramlot-labelbox'),null);assert.equal(renderer.records.has(addedNode),false);
});

test('unlabelled HTML retains exact shape; unsupported structure and late wrapping fail explicitly',()=>{
    const {app,document}=page();const plain=mount(app,root=>root.div('Plain',{id:'plain'}));
    assert.equal(document.querySelector('main').firstElementChild,document.getElementById('plain'));
    assert.throws(()=>sourceTarget(plain).setAttr({lbl:'Late'}),/Declare lbl or box_/);
    const {app:other,document:otherDocument}=page();mount(other,root=>root.select({id:'choice',lbl:'Choice'}).option('One',{value:'one'}));
    assert.equal(otherDocument.querySelector('label').control,otherDocument.getElementById('choice'));
    const {app:third}=page();assert.throws(()=>mount(third,root=>root.table().input({lbl:'Invalid'})),/not allowed as child|flow container/);
});

test('label text stays literal after binding resolution; prefixed unsafe HTML is rejected',()=>{
    const {app,document}=page(); app.data.setItem('caption','<img src=x onerror=alert(1)>');
    mount(app,root=>root.div({lbl:'^caption'}));assert.equal(document.querySelector('label').textContent,'<img src=x onerror=alert(1)>');assert.equal(document.querySelector('img'),null);
    const {app:other}=page();assert.throws(()=>mount(other,root=>root.input({lbl:'Name',lbl_onclick:'alert(1)'})),/script|event|onclick/i);
});

test('one renderer Labelbox composes native fields, components and group actions in a mixed formlet',async()=>{
    const {default:inputs}=await import('../src/components/inputs.js');
    const {default:layout}=await import('../src/components/layout.js');
    const {GramlotBuilder}=await import('../src/index.js');
    const {layoutWindow}=await import('./helpers/layout-window.js');
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    const scheduling=layoutWindow(window);
    const app=new Gramlot({document:window.document,transport:false,collections:[inputs,layout]});
    const builder=new GramlotBuilder(null,{collections:[inputs,layout]});
    const group=builder.root.groupBox({id:'group',lbl:'Customer',copy:true,datapath:'customer'});
    const form=group.formlet({id:'form',lbl_position:'^position',columns:2});
    form.checkbox({id:'readonly-check',lbl:'Readonly',value:'^.locked',readonly:true});
    const native=form.input({id:'native',lbl:'HTML name',value:'^.name',live:true});
    const rich=form.textbox({id:'rich',lbl:'Component name',value:'^.name',live:true});
    form.div({id:'compound',lbl:'A whole panel'}).span('Any flow content');
    app.data.setItem('position','L');app.data.setItem('customer.name','Ada');
    app.src.startSource(builder.toTytx());scheduling.flush();
    const renderer=app.src.renderer;
    const nativeRecord=renderer.elements.get(window.document.getElementById('native'));
    const richRecord=renderer.elements.get(window.document.getElementById('rich'));
    const groupElement=window.document.getElementById('group');
    for(const record of [nativeRecord,richRecord]){
        assert.equal(record.presentation.labelbox,record.labelbox);
        assert.equal(record.presentation.parentElement.id,'form');
        assert.equal(record.presentation.dataset.position,'L');
        assert.equal(record.presentation.dataset.formletAligned,'');
    }
    assert.equal(richRecord.element.shadowRoot.querySelector('.labelbox'),null);
    assert.equal(groupElement.shadowRoot.querySelector('.labelbox'),null);
    assert.equal(groupElement.actions.parentElement,groupElement.labelBox);
    assert.equal(groupElement.labelBox.hidden,false);
    const readonly=window.document.getElementById('readonly-check');
    readonly.fieldLabel.click();assert.notEqual(app.data.getItem('customer.locked'),true);
    const field=richRecord.element.control;field.focus();field.setSelectionRange(1,2);
    const binding=richRecord.binding;
    app.data.setItem('position','BR');
    assert.equal(richRecord.element.shadowRoot.activeElement,field);assert.equal(field.selectionStart,1);
    assert.equal(richRecord.binding,binding);assert.equal(nativeRecord.presentation.dataset.position,'BR');
    field.value='Grace';field.dispatchEvent(new window.Event('input',{bubbles:true,composed:true}));
    assert.equal(nativeRecord.element.value,'Grace');assert.equal(app.data.getItem('customer.name'),'Grace');
    app.dispose();assert.equal(window.document.querySelector('.gramlot-labelbox'),null);window.close();
});

test('labelled content is the parent-owned panel in tab and border containers',async()=>{
    const {default:layout}=await import('../src/components/layout.js');
    const {GramlotBuilder}=await import('../src/index.js');
    const {layoutWindow}=await import('./helpers/layout-window.js');
    const {window}=new JSDOM('<main id="gramlot-root"></main>');layoutWindow(window);
    const app=new Gramlot({document:window.document,transport:false,collections:[layout]});
    const builder=new GramlotBuilder(null,{collections:[layout]});
    const tabs=builder.root.tabContainer({id:'tabs',selectedPage:'^selected'});
    tabs.div({id:'one',lbl:'One',title:'First tab',pageName:'one'}).input({value:'^draft'});
    tabs.div({id:'two',lbl:'Two',title:'Second tab',pageName:'two'}).span('Second');
    const border=builder.root.borderContainer({id:'border'});
    border.div({id:'center',lbl:'Workspace',region:'center'}).span('Content');
    app.data.setItem('selected','one');app.src.startSource(builder.toTytx());
    await Promise.resolve();await Promise.resolve();
    const one=app.src.renderer.elements.get(window.document.getElementById('one'));
    assert.equal(one.presentation.parentElement.id,'tabs');assert.ok(one.presentation.slot);
    assert.equal(one.element.hasAttribute('slot'),false);
    const input=one.element.querySelector('input');
    app.data.setItem('selected','two');await Promise.resolve();
    app.data.setItem('selected','one');await Promise.resolve();
    assert.equal(one.element.querySelector('input'),input);
    const center=app.src.renderer.elements.get(window.document.getElementById('center'));
    assert.equal(center.presentation.slot,'center');assert.equal(center.presentation.parentElement.id,'border');
    app.dispose();window.close();
});
