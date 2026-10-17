import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs, {Textbox} from '../src/components/inputs.js';
import {defineCollection, defineComponent} from '../src/components/registry.js';

function fixture(author) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false, collections: [inputs]});
    const builder = new GramlotBuilder(null, {collections: [inputs]});
    const pane = builder.root.div({node_label:'pane', datapath:'form'});
    author(pane, app);
    app.src.startSource(builder.toTytx());
    return {app, window, element: id => window.document.getElementById(id)};
}
function change(window, input, type = 'change') {
    input.dispatchEvent(new window.Event(type, {bubbles: true, composed: type === 'input'}));
}

test('DOM-free effective metadata is identical to shipped Python grammar', () => {
    const grammar = JSON.parse(readFileSync(new URL('../../src/gramlot/collections/inputs.json', import.meta.url)));
    assert.deepEqual(inputs.toDocument(), grammar);
    assert.equal(grammar.elements.textbox._meta.gramlot_component.parameters.lbl.qualification, 'intl_str');
    assert.equal(grammar.elements.checkbox._meta.gramlot_component.parameters.lbl_position.default, 'TL');
    assert.equal(globalThis.HTMLElement, undefined);
    const b = new GramlotBuilder(null, {collections:[inputs]});
    assert.equal(b.root.RADIOBUTTONTEXT({values:'a:A', value:'a'}).nodeTag, 'radioButtonText');
    assert.throws(() => b.root.checkbox({value:'not a boolean'}));
    assert.throws(() => b.root.textbox({value:'^x:{}px'}), /suffix/);
});

test('textbox preserves null/empty, caret, label placement, binding and cleanup', () => {
    const {app, window, element} = fixture((pane, app) => {
        app.data.setItem('form.name', null);
        app.data.setItem('position', 'TL'); app.data.setItem('width', 220);
        pane.textbox({id:'name', node_label:'name', value:'^.name', lbl:'Customer',
            lbl_position:'^position', lbl_color:'red', box_c_width:'^width:{}px', live:'^live'});
    });
    const host = element('name'), input = host.control;
    assert.equal(input.value, ''); assert.equal(app.data.getItem('form.name'), null);
    assert.equal(host.fieldLabel.control, input);
    assert.equal(host.fieldLabel.style.color, 'red');
    assert.equal(host.controlBox.style.width, '220px');
    assert.equal(host.hasAttribute('lbl'), false);
    input.value = 'Ada'; change(window, input, 'input');
    assert.equal(app.data.getItem('form.name'), null);
    change(window, input); assert.equal(app.data.getItem('form.name'), 'Ada');
    input.focus(); input.setSelectionRange(1, 2);
    for (const position of ['TC','TR','L','R','BL','BC','BR','TL']) {
        app.data.setItem('position', position);
        assert.equal(host.control, input); assert.equal(host.box.dataset.position, position);
        assert.equal(host.shadowRoot.activeElement, input); assert.equal(input.selectionStart, 1);
    }
    app.data.setItem('width', 300); assert.equal(host.controlBox.style.width, '300px');
    app.data.setItem('live', true);
    input.value = ''; change(window, input, 'input'); assert.equal(app.data.getItem('form.name'), '');
    app.data.setItem('form.name', 'Grace'); assert.equal(input.value, 'Grace');
    app.src.source.popNode('main.pane');
    input.value = 'detached'; change(window, input); assert.equal(app.data.getItem('form.name'), 'Grace');
    app.dispose();
});

test('checkbox shares labelbox while radio groups commit independent string codes', () => {
    const {app, window, element} = fixture((pane, app) => {
        app.data.setItem('form.enabled', false); app.data.setItem('form.first', 'a'); app.data.setItem('form.second', 'b');
        pane.checkbox({id:'check', value:'^.enabled', lbl:'Contact', label:'Newsletter'});
        for (const id of ['first','second']) pane.radioButtonText({id, value:`^.${id}`, values:'a:Alpha,b:Beta', lbl:id, cols:2});
    });
    const checkbox = element('check');
    assert.equal(checkbox.fieldLabel.textContent, 'Contact'); assert.equal(checkbox.optionCaption.textContent, 'Newsletter');
    checkbox.control.click(); assert.equal(app.data.getItem('form.enabled'), true);
    app.data.setItem('form.enabled', false); assert.equal(checkbox.control.checked, false);
    const first = element('first'), second = element('second');
    first.control.querySelector('input[value="b"]').click();
    assert.equal(app.data.getItem('form.first'), 'b');
    assert.equal(app.data.getItem('form.second'), 'b');
    first.control.querySelector('input[value="a"]').click();
    assert.equal(app.data.getItem('form.first'), 'a'); assert.equal(second.readControlValue(), 'b');
    assert.equal(first.control.getAttribute('aria-labelledby'), first.fieldLabel.id);
    assert.equal(first.control.style.gridTemplateColumns, 'repeat(2, minmax(0, 1fr))');
    app.dispose();
});

test('custom controls reuse IME handling and expose change to named Logic', () => {
    const {app, window, element} = fixture((pane, app) => {
        app.data.setItem('form.name','initial');
        class Logic { changed() { app.data.setItem('notified',true); } }
        app.src.logicRegistry.register(Logic, {group:'test', resource:'components'});
        pane.textbox({id:'name',value:'^.name',live:true,connect_onchange:'test.changed'});
    });
    const input = element('name').control;
    change(window,input,'compositionstart'); input.value='composing'; change(window,input,'input');
    assert.equal(app.data.getItem('form.name'),'initial');
    change(window,input,'compositionend'); assert.equal(app.data.getItem('form.name'),'composing');
    change(window,input); assert.equal(app.data.getItem('notified'),true);
    app.dispose();
});

test('collection registration is realm-local, repeatable and rejects conflicting tags', () => {
    const one = new JSDOM('').window, two = new JSDOM('').window;
    inputs.register(one); inputs.register(one); inputs.register(two);
    assert.notEqual(one.customElements.get(Textbox.tag), two.customElements.get(Textbox.tag));
    assert.throws(() => defineCollection({name:'conflict',components:[Textbox]}).register(one), /already registered/);
    const custom = defineComponent({...Textbox, name:'searchbox', tag:'app-searchbox',
        parameters:{...Textbox.parameters, placeholder:{dtype:'T',qualification:'intl_str',default:'Search',target:'control'}}});
    const collection = defineCollection({name:'app',components:[custom]}); collection.register(one);
    const el = one.document.createElement('app-searchbox');
    el.projectAttributes({}, attrs => attrs);
    assert.equal(el.control.placeholder, 'Search');
    assert.equal(collection.toDocument().elements.searchbox._meta.gramlot_component.parameters.lbl_position.default,'TL');
});

test('Python authors the same three widgets and JS mounts the resulting TYTX', () => {
    const root=fileURLToPath(new URL('../../',import.meta.url));
    const wire=execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? `${root}/.venv/bin/python`,['-c',`
import json
from gramlot import GramlotBuilder
from genro_tytx import to_tytx
with open('src/gramlot/collections/inputs.json') as f: grammar=json.load(f)
b=GramlotBuilder(collections=[grammar]); p=b.root.div(datapath='form')
p.TEXTBOX(id='name',value='^.name',lbl='Customer',lbl_position='^position')
p.checkbox(id='check',value='^.enabled',label='Newsletter')
p.radioButtonText(id='radio',value='^.shipping',values='a:Alpha,b:Beta',lbl='Shipping')
print(to_tytx(b.source))
`],{cwd:root,encoding:'utf8'}).trim();
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    const app=new Gramlot({document:window.document,transport:false,collections:[inputs]});
    app.data.setItem('form.name','Python'); app.data.setItem('form.enabled',true);
    app.data.setItem('form.shipping','b'); app.data.setItem('position','R');
    app.src.startSource(wire);
    assert.equal(window.document.getElementById('name').control.value,'Python');
    assert.equal(window.document.getElementById('name').box.dataset.position,'R');
    assert.equal(window.document.getElementById('check').control.checked,true);
    assert.equal(window.document.getElementById('radio').readControlValue(),'b');
    app.dispose();
});

test('label prefixes keep style removal and reject native script attributes', () => {
    const {app, element} = fixture((pane, app) => {
        app.data.setItem('color','red'); app.data.setItem('customClass','custom');
        pane.textbox({id:'name',node_label:'name',lbl:'Name',lbl_color:'^color',box_class:'^customClass'});
    });
    const host=element('name');
    assert.ok(host.box.classList.contains('labelbox')); assert.ok(host.box.classList.contains('custom'));
    app.data.setItem('color',null); assert.equal(host.fieldLabel.style.color,'');
    app.data.setItem('customClass',null); assert.equal(host.box.className,'labelbox');
    app.dispose();
    assert.throws(()=>fixture(pane=>pane.textbox({lbl_onclick:'alert(1)'})),/native event handler/);
});

test('changing radio captions/options retains a valid selected code without cross-group writes', () => {
    const {app, element} = fixture((pane, app) => {
        app.data.setItem('options','a:Alpha,b:Beta'); app.data.setItem('form.choice','b');
        pane.radioButtonText({id:'choice',value:'^.choice',values:'^options'});
    });
    const host=element('choice'), input=host.control.querySelector('input[value="b"]');
    input.focus(); app.data.setItem('options','a:Alpha,b:Updated,c:New');
    assert.equal(host.control.querySelector('input[value="b"]'),input);
    assert.equal(host.shadowRoot.activeElement,input);
    assert.equal(host.readControlValue(),'b');
    app.data.setItem('options','a:Alpha,c:New');
    assert.equal(host.readControlValue(),null);
    assert.equal(app.data.getItem('form.choice'),'b');
    app.dispose();
});

test('shared Data and a reactive datapath reuse controls and detach the previous path', () => {
    const {app, window, element} = fixture((pane, app) => {
        app.data.setItem('selected','left');
        app.data.setItem('left.name','Left'); app.data.setItem('right.name','Right');
        const group=pane.div({datapath:'^selected'});
        group.textbox({id:'one',value:'^.name',live:true});
        group.textbox({id:'two',value:'^.name',live:true});
    });
    const one=element('one'), two=element('two');
    one.control.value='Changed'; change(window,one.control,'input');
    assert.equal(two.control.value,'Changed');
    app.data.setItem('selected','right');
    assert.equal(element('one'),one); assert.equal(one.control.value,'Right');
    app.data.setItem('left.name','Detached'); assert.equal(one.control.value,'Right');
    two.control.value='Current'; change(window,two.control,'input');
    assert.equal(app.data.getItem('right.name'),'Current');
    assert.equal(app.data.getItem('left.name'),'Detached');
    app.dispose();
});

test('textarea and password reuse editing, shared Data, labels and native constraints', () => {
    const {app, window, element} = fixture((pane, app) => {
        app.data.setItem('form.note', 'First\nSecond'); app.data.setItem('rows', 3);
        pane.textBoxArea({id:'note', value:'^.note', lbl:'Notes', rows:'^rows', cols:20, live:true, readonly:'^locked'});
        pane.textBoxArea({id:'copy', value:'^.note'});
        pane.passwordbox({id:'password', value:'^.password', lbl:'Password', live:true});
    });
    const note=element('note'), password=element('password');
    assert.equal(note.control.localName,'textarea'); assert.equal(note.fieldLabel.control,note.control);
    assert.equal(note.control.rows,3); assert.equal(note.control.cols,20);
    note.control.value='Edited\ntext'; change(window,note.control,'input');
    assert.equal(element('copy').control.value,'Edited\ntext');
    note.control.focus(); note.control.setSelectionRange(1,4);
    app.data.setItem('rows',5); assert.equal(note.control.rows,5); assert.equal(note.control.selectionStart,1);
    app.data.setItem('locked',true); assert.equal(note.control.readOnly,true);
    assert.equal(password.control.type,'password');
    password.control.value='secret'; change(window,password.control,'input');
    assert.equal(app.data.getItem('form.password'),'secret');
    app.dispose();
});

test('color and both ranges project native values without writing normalized values back', () => {
    const {app, window, element} = fixture((pane, app) => {
        app.data.setItem('form.amount',.5);app.data.setItem('maximum',2);app.data.setItem('form.color','#315fa8');
        for(const name of ['horizontalSlider','verticalSlider']) pane[name]({id:name,value:'^.amount',min:-2,max:'^maximum',step:.5,live:true,lbl:'Amount',disabled:'^locked'});
        pane.colorpicker({id:'color',value:'^.color',lbl:'Color',live:true});
    });
    const h=element('horizontalSlider'),v=element('verticalSlider'),color=element('color');
    assert.equal(h.control.min,'-2'); assert.equal(h.control.step,'0.5');
    assert.equal(v.control.style.writingMode,'vertical-lr');assert.equal(v.control.style.direction,'rtl');
    h.control.value='1.5';change(window,h.control,'input');
    assert.equal(app.data.getItem('form.amount'),1.5);assert.equal(v.control.value,'1.5');
    app.data.setItem('maximum',1);assert.equal(h.control.max,'1');
    assert.equal(app.data.getItem('form.amount'),1.5,'bounds changes do not rewrite Data');
    app.data.setItem('form.amount',9);assert.equal(h.control.value,'1');
    assert.equal(app.data.getItem('form.amount'),9,'native clamping does not rewrite Data');
    app.data.setItem('locked',true);assert.equal(v.control.disabled,true);
    color.control.value='#123456';change(window,color.control,'input');
    assert.equal(app.data.getItem('form.color'),'#123456');
    app.dispose();
});

test('single component radios preserve boolean groups, scope, keyboard and disposal', () => {
    const {app,window,element}=fixture((pane,app)=>{
        app.data.setItem('form.standard',true);app.data.setItem('form.express',false);
        pane.radioButton({id:'standard',node_label:'standard',value:'^.standard',group:'shipping',lbl:'Delivery',label:'Standard'});
        pane.radioButton({id:'express',node_label:'express',value:'^.express',group:'shipping',label:'Express'});
        pane.div({formId:'other'}).radioButton({id:'other',value:'^other',group:'shipping',label:'Other scope'});
    });
    const standard=element('standard'),express=element('express'),other=element('other');
    assert.equal(standard.control.checked,true);
    express.control.click();assert.equal(app.data.getItem('form.express'),true);assert.equal(app.data.getItem('form.standard'),false);
    other.control.click();assert.equal(app.data.getItem('form.express'),true);
    app.data.setItem('form.standard',true);assert.equal(app.data.getItem('form.express'),false);
    standard.control.focus();standard.control.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
    assert.equal(app.data.getItem('form.express'),true);assert.equal(express.shadowRoot.activeElement,express.control);
    app.src.source.popNode('main.pane.express');
    app.data.setItem('form.express',false);
    app.data.setItem('form.standard',true);
    express.control.click();assert.equal(app.data.getItem('form.express'),false,'detached control must not commit');
    assert.equal(app.data.getItem('form.standard'),true);
    app.dispose();
});

test('Python exports the six new controls, including fractional range parameters', () => {
    const root=fileURLToPath(new URL('../../',import.meta.url));
    const wire=execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? `${root}/.venv/bin/python`,['-c',`
import json
from gramlot import GramlotBuilder
from genro_tytx import to_tytx
with open('src/gramlot/collections/inputs.json') as f: grammar=json.load(f)
b=GramlotBuilder(collections=[grammar]); p=b.root.div()
p.textBoxArea(id='area',value='Line one\\nLine two',rows=3,lbl='Notes')
p.passwordbox(id='secret',value='secret')
p.radioButton(id='single',value=True,group='choice',label='One')
p.colorpicker(id='color',value='#123456')
p.horizontalSlider(id='horizontal',value=0.5,min=0,max=2,step=0.5)
p.VERTICALSLIDER(id='vertical',value=1,min=0,max=2,step=0.5)
print(to_tytx(b.source))
`],{cwd:root,encoding:'utf8'}).trim();
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    const app=new Gramlot({document:window.document,transport:false,collections:[inputs]});app.src.startSource(wire);
    const get=id=>window.document.getElementById(id).control;
    assert.equal(get('area').value,'Line one\nLine two');assert.equal(get('secret').type,'password');
    assert.equal(get('single').checked,true);assert.equal(get('color').value,'#123456');
    assert.equal(get('horizontal').value,'0.5');assert.equal(get('vertical').value,'1');app.dispose();
});
