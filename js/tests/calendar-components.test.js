import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import inputs from '../src/components/inputs.js';

function fixture(t) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.HTMLElement.prototype.showPopover = function () {this.dataset.open = 'true';};
    window.HTMLElement.prototype.hidePopover = function () {delete this.dataset.open;};
    const app = new Gramlot({document:window.document,transport:false,collections:[inputs],locale:'it-IT',timeZone:'America/Los_Angeles'});
    const b = new GramlotBuilder(null,{collections:[inputs]});
    app.data.setItem('date',new Date('2024-01-31T00:00:00Z'));app.data.setItem('enabled',true);app.data.setItem('position','TL');
    b.root.dateCalendar({id:'calendar',node_label:'calendar',value:'^date',lbl:'Day',lbl_position:'^position',readonly:'^locked',disabled:'^disabled',workdate:'2024-02-10'});
    b.root.dateTextBox({id:'editor',node_label:'editor',value:'^date',lbl:'Day',calendar:'^enabled',readonly:'^locked',workdate:'2024-02-10'});
    b.root.dateTextBox({id:'plain',value:'^date',calendar:false});
    app.src.startSource(b.toTytx());
    t.after(()=>{app.dispose();window.close();});
    return {window,app,host:id=>window.document.getElementById(id),date:()=>app.data.getItem('date')?.toISOString()??null};
}

test('inline calendar shares a civil D with the text editor; leap month, clear and external updates',t=>{
    const f=fixture(t),c=f.host('calendar'),editor=f.host('editor');
    c.calendarView.next.click();
    assert.equal(c.control.querySelectorAll('[data-date]').length,29);
    c.control.querySelector('[data-date="2024-02-29"]').click();
    assert.equal(f.date(),'2024-02-29T00:00:00.000Z');assert.match(editor.control.value,/29/);
    c.calendarView.clearButton.click();assert.equal(f.date(),null);assert.equal(editor.control.value,'');
    c.calendarView.todayButton.click();assert.equal(f.date(),'2024-02-10T00:00:00.000Z');
    f.app.data.setItem('date',new Date('2025-12-25T00:00:00Z'));
    assert.equal(c.control.querySelector('[aria-pressed="true"]').dataset.date,'2025-12-25');
    assert.equal(f.host('plain').calendarButton.hidden,true);
});

test('calendar keyboard moves across months and years without writing until selected',t=>{
    const f=fixture(t),c=f.host('calendar');
    f.app.data.setItem('date',new Date('2024-12-31T00:00:00Z'));
    const key=key=>c.control.querySelector('[tabindex="0"]').dispatchEvent(new f.window.KeyboardEvent('keydown',{key,bubbles:true}));
    key('ArrowRight');assert.equal(c.control.querySelector('[tabindex="0"]').dataset.date,'2025-01-01');
    assert.equal(f.date(),'2024-12-31T00:00:00.000Z');
    key('Home');assert.equal(c.control.querySelector('[tabindex="0"]').dataset.date,'2024-12-30');
    key('PageDown');assert.equal(c.control.querySelector('[tabindex="0"]').dataset.date,'2025-01-30');
    c.control.querySelector('[tabindex="0"]').click();assert.equal(f.date(),'2025-01-30T00:00:00.000Z');
});

test('popup selection uses the typed commit path; readonly, reactive calendar flag and removal close it',t=>{
    const f=fixture(t),editor=f.host('editor'),c=f.host('calendar');
    editor.openCalendar();assert.equal(editor.calendarButton.getAttribute('aria-expanded'),'true');
    editor.calendarView.next.click();editor.calendarPopup.querySelector('[data-date="2024-02-29"]').click();
    assert.equal(f.date(),'2024-02-29T00:00:00.000Z');assert.equal(editor.calendarButton.getAttribute('aria-expanded'),'false');
    assert.equal(editor.shadowRoot.activeElement,editor.control);
    editor.openCalendar();f.app.data.setItem('enabled',false);
    assert.equal(editor.calendarButton.hidden,true);assert.equal(editor.calendarButton.getAttribute('aria-expanded'),'false');
    f.app.data.setItem('enabled',true);editor.openCalendar();f.app.data.setItem('locked',true);
    assert.equal(editor.calendarButton.disabled,true);assert.equal(editor.calendarButton.getAttribute('aria-expanded'),'false');
    c.calendarView.clearButton.click();assert.equal(f.date(),'2024-02-29T00:00:00.000Z');
    f.app.data.setItem('locked',false);f.app.data.setItem('position','R');assert.equal(c.box.dataset.position,'R');
    f.app.data.setItem('disabled',true);assert.equal(c.control.querySelector('[data-date]').disabled,true);
    editor.openCalendar();f.app.src.source.popNode('main.editor');assert.equal(editor.calendarButton.getAttribute('aria-expanded'),'false');
    editor.openCalendar();assert.equal(editor.calendarButton.getAttribute('aria-expanded'),'false');
});

test('popup opening preserves invalid drafts; Escape cancels and external Data refreshes the open view',t=>{
    const f=fixture(t),e=f.host('editor');
    e.control.focus();e.control.value='invalid';e.control.dispatchEvent(new f.window.Event('input',{bubbles:true}));
    e.openCalendar();assert.equal(f.date(),'2024-01-31T00:00:00.000Z');assert.equal(e.control.value,'invalid');
    e.calendarPopup.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(e.control.value,'invalid');assert.equal(e.calendarButton.getAttribute('aria-expanded'),'false');
    e.openCalendar();f.app.data.setItem('date',new Date('2024-03-15T00:00:00Z'));
    assert.equal(e.calendarPopup.querySelector('[aria-pressed="true"]').dataset.date,'2024-03-15');
    e.calendarView.clearButton.click();assert.equal(f.date(),null);
});


test('popup commits the selected typed date without reparsing the short-year caption, also live',t=>{
    const f=fixture(t),e=f.host('editor');
    f.app.data.setItem('date',new Date('2099-12-10T00:00:00Z'));
    e.openCalendar();e.calendarPopup.querySelector('[data-date="2099-12-11"]').click();
    assert.equal(f.date(),'2099-12-11T00:00:00.000Z');
    f.app.src.source.getNode('main.editor').setAttr({live:true});
    e.openCalendar();e.calendarPopup.querySelector('[data-date="2099-12-12"]').click();
    assert.equal(f.date(),'2099-12-12T00:00:00.000Z');
});
