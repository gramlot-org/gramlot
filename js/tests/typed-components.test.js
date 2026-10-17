import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import {createDecimal, isDecimal} from '@genrojs/tytx';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';

function fixture(t, author) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.HTMLElement.prototype.showPopover = function () {};
    window.HTMLElement.prototype.hidePopover = function () {};
    const app = new Gramlot({document:window.document,transport:false,collections:[inputs],locale:'it-IT',timeZone:'America/Los_Angeles'});
    const b = new GramlotBuilder(null,{collections:[inputs]});
    author(b.root, app); app.src.startSource(b.toTytx());
    t.after(()=>{app.dispose();window.close();});
    const host = id => window.document.getElementById(id);
    const event = (input,type) => input.dispatchEvent(new window.Event(type,{bubbles:true}));
    const type = (id,text,commit=true) => {
        const input=host(id).control; input.focus();input.value=text;event(input,'input');if(commit)event(input,'change');return input;
    };
    return {app,window,host,event,type};
}

test('localized number drafts, invalid input, null, limits and exact Decimal', t=>{
    const f=fixture(t,(r,a)=>{
        a.data.setItem('price',12.5);a.data.setItem('exact',createDecimal('9007199254740993.25'));
        r.numberTextBox({id:'price',value:'^price',lbl:'Price',format:'0.00',min:0,max:100});
        r.numberTextBox({id:'exact',value:'^exact',dtype:'N',format:'0.00'});
    });
    assert.equal(f.host('price').control.value,'12,50');
    f.type('price','38,25');assert.equal(f.app.data.getItem('price'),38.25);
    f.type('price','38x');assert.equal(f.app.data.getItem('price'),38.25);
    assert.equal(f.host('price').control.getAttribute('aria-invalid'),'true');
    assert.equal(f.host('price').control.value,'38x');
    f.type('price','101');assert.equal(f.app.data.getItem('price'),38.25);
    f.type('price','');assert.equal(f.app.data.getItem('price'),null);
    f.type('exact','9007199254740993,75');
    const exact=f.app.data.getItem('exact');assert(isDecimal(exact));assert.equal(exact.toString(),'9007199254740993.75');
    f.host('exact').control.blur();assert.equal(f.host('exact').control.value,'9007199254740993,75');
});

test('typed drafts preserve focus across label changes and respect live/IME/disposal', t=>{
    const f=fixture(t,(r,a)=>{
        a.data.setItem('n',12);a.data.setItem('position','TL');a.data.setItem('live',false);
        r.numberTextBox({id:'n',value:'^n',live:'^live',lbl:'Number',lbl_position:'^position'});
    });
    const input=f.type('n','13,',false);input.setSelectionRange(2,2);
    f.app.data.setItem('position','R');assert.equal(input.value,'13,');assert.equal(input.selectionStart,2);
    input.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(input.value,'12');
    f.type('n','14',false);input.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Enter'}));assert.equal(f.app.data.getItem('n'),14);
    f.app.data.setItem('live',true);f.event(input,'compositionstart');f.type('n','15',false);assert.equal(f.app.data.getItem('n'),14);
    f.event(input,'compositionend');assert.equal(f.app.data.getItem('n'),15);
    f.type('n','no',false);f.app.data.setItem('n',16);assert.equal(input.value,'16');assert.equal(input.validationMessage,'');
    f.app.dispose();input.value='17';f.event(input,'input');assert.equal(f.app.data.getItem('n'),16);
});

test('date editor accepts locale and natural language, keeps civil dates and rejects periods', t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('d',new Date('2026-10-16T00:00:00Z'));
        r.dateTextBox({id:'d',value:'^d',lbl:'Date',workdate:'2026-10-16',format:'long'});});
    assert.match(f.host('d').control.value,/16 ottobre 2026/);
    f.type('d','domani');assert.equal(f.app.data.getItem('d').toISOString(),'2026-10-17T00:00:00.000Z');
    f.type('d','31/02/2026');assert.equal(f.app.data.getItem('d').toISOString(),'2026-10-17T00:00:00.000Z');
    assert.equal(f.host('d').control.getAttribute('aria-invalid'),'true');
    f.type('d','18/10/2026');assert.equal(f.app.data.getItem('d').toISOString(),'2026-10-18T00:00:00.000Z');
    f.host('d').control.blur();assert.match(f.host('d').control.value,/18 ottobre/);
    f.type('d','');assert.equal(f.app.data.getItem('d'),null);
});

test('date editor defaults to local today at each edit, independently of its value', t=>{
    t.mock.timers.enable({apis:['Date'],now:new Date(2026,9,17,12).getTime()});
    const f=fixture(t,(r,a)=>{a.data.setItem('d',new Date('2026-10-01T00:00:00Z'));
        r.dateTextBox({id:'d',value:'^d',lbl:'Date'});});
    for(const [text,expected] of [['ieri',16],['oggi',17],['domani',18]]) {
        f.type('d',text);assert.equal(f.app.data.getItem('d').toISOString(),`2026-10-${expected}T00:00:00.000Z`);
    }
    t.mock.timers.setTime(new Date(2026,9,18,12).getTime());
    f.type('d','ieri');assert.equal(f.app.data.getItem('d').toISOString(),'2026-10-17T00:00:00.000Z');
});

test('time editor preserves midnight, seconds and milliseconds without timezone conversion', t=>{
    const f=fixture(t,(r,a)=>{a.data.setItem('h',new Date('1970-01-01T09:30:00Z'));
        r.timeTextBox({id:'h',value:'^h',lbl:'Time',format:'medium'});});
    assert.equal(f.host('h').control.value,'09:30:00');
    f.type('h','23:59:58.125');assert.equal(f.app.data.getItem('h').toISOString(),'1970-01-01T23:59:58.125Z');
    f.type('h','25:00');assert.equal(f.app.data.getItem('h').getUTCHours(),23);
    f.type('h','00:00');assert.equal(f.app.data.getItem('h').toISOString(),'1970-01-01T00:00:00.000Z');
    f.type('h','');assert.equal(f.app.data.getItem('h'),null);
});

test('Python dtype signatures preserve date, time and Decimal in Source TYTX', t=>{
    const root=fileURLToPath(new URL('../../',import.meta.url));
    const wire=execFileSync(process.env.GRAMLOT_TEST_PYTHON??`${root}/.venv/bin/python`,['-c',`
import json
from datetime import date, time
from decimal import Decimal
from gramlot import GramlotBuilder
with open('src/gramlot/collections/inputs.json') as f: grammar=json.load(f)
b=GramlotBuilder(collections=[grammar])
b.root.numberTextBox(id='n',value=Decimal('9007199254740993.25'),dtype='N',format='0.00')
b.root.dateTextBox(id='d',value=date(2026,10,16))
b.root.dateCalendar(id='calendar',value=date(2026,10,16),lbl='Day')
b.root.timeTextBox(id='h',value=time(9,30,15))
print(b.to_tytx())
`],{cwd:root,env:{...process.env,PYTHONPATH:`${root}/src`},encoding:'utf8'}).trim();
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    const app=new Gramlot({document:window.document,transport:false,collections:[inputs],locale:'it-IT'});
    t.after(()=>{app.dispose();window.close();});app.src.startSource(wire);
    const host=id=>window.document.getElementById(id);
    assert.equal(host('n').readControlValue().toString(),'9007199254740993.25');
    assert.equal(host('d').readControlValue().toISOString(),'2026-10-16T00:00:00.000Z');
    assert.equal(host('calendar').readControlValue().toISOString(),'2026-10-16T00:00:00.000Z');
    assert.equal(host('calendar').control.querySelector('[aria-pressed="true"]').dataset.date,'2026-10-16');
    assert.equal(host('h').readControlValue().toISOString(),'1970-01-01T09:30:15.000Z');
});
