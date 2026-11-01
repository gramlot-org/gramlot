import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {toTytx} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';
import uploads from '../src/components/uploads.js';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

test('application Source binds its form to the selected file metadata', async t => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    class Xhr extends window.EventTarget {
        constructor() { super(); this.upload = new window.EventTarget(); }
        open() {} setRequestHeader() {}
        send() { this.status = 200; this.responseText = toTytx({state:'completed',result:null});
            queueMicrotask(() => this.dispatchEvent(new window.Event('load'))); }
        abort() { this.dispatchEvent(new window.Event('abort')); }
    }
    window.XMLHttpRequest = Xhr;
    const app = new Gramlot({document:window.document, transport:false, pageId:'p', uploadUrl:'/upload',
        capabilities:['upload'], collections:[inputs, uploads]});
    const calls = [];
    app.rpc.call = async (type, name, params) => { calls.push(params); return {transferId:'id',authorization:'secret'}; };
    app.data.setItem('form.queue', new Bag());
    app.data.setItem('form.empty', new Bag({status:'empty'}));
    app.data.setItem('form.editPath', 'form.empty');
    const b = new GramlotBuilder(null, {collections:[inputs, uploads]});
    const pane = b.root.div({datapath:'form'});
    pane.uploader({id:'uploader', operation:'receive', storepath:'.queue', selectedPath:'^.selected', multiple:true, autoUpload:false});
    pane.dataFormula({result_path:'.editPath', formula:"selected ? 'form.queue.' + selected : 'form.empty'", selected:'^.selected', _init:true});
    pane.div({datapath:'^.editPath'}).textbox({id:'title', value:'^.metadata.title', disabled:"^.status:={} !== 'queued'", live:true});
    app.src.startSource(b.toTytx());
    t.after(() => {app.dispose(); window.close();});
    const host = window.document.getElementById('uploader');
    const title = window.document.getElementById('title').control;
    Object.defineProperty(host.input, 'files', {value:[new window.File(['a'], 'first.txt'), new window.File(['b'], 'second.txt')], configurable:true});
    host.input.dispatchEvent(new window.Event('change'));
    const rows = app.data.getItem('form.queue').getNodes();
    const select = name => [...host.list.querySelectorAll('button')].find(button => button.getAttribute('aria-label') === `Select ${name}`).click();
    const edit = value => { title.value = value; title.dispatchEvent(new window.Event('input', {bubbles:true})); };
    select('first.txt'); await tick();
    assert.equal(app.data.getItem('form.selected'), rows[0].label);
    assert.equal(host.shadowRoot.activeElement.getAttribute('aria-label'), 'Select first.txt');
    edit('First description');
    select('second.txt'); await tick();
    assert.equal(title.value, '');
    edit('Second description');
    select('first.txt'); await tick();
    assert.equal(title.value, 'First description');
    assert.equal(rows[0].value.getItem('metadata.title'), 'First description');
    assert.equal(rows[1].value.getItem('metadata.title'), 'Second description');
    host.startButton.click(); await tick(); await tick(); await tick();
    assert.equal(title.disabled, true);
    assert.deepEqual(calls.map(call => call.metadata.fields), [{title:'First description'}, {title:'Second description'}]);
    const first = [...host.list.querySelectorAll('li')][0];
    [...first.querySelectorAll('button')].find(button => button.textContent === 'Remove').click();
    assert.equal(app.data.getItem('form.selected'), null);
    assert.equal(app.data.getItem('form.queue').getNodes().length, 1);
    select('second.txt');
    assert.equal(app.data.getItem('form.selected'), rows[1].label);
    host.setStoreBag(new Bag());
    assert.equal(app.data.getItem('form.selected'), null);
});
