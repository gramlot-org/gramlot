import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import layout from '../src/components/layout.js';
import inputs from '../src/components/inputs.js';
import {layoutWindow} from './helpers/layout-window.js';
const settle = () => new Promise(resolve => setTimeout(resolve, 0));
async function fixture(tag='tabContainer', attrs={}) {
    const {window}=new JSDOM('<main id="gramlot-root"></main>'); layoutWindow(window);
    window.HTMLElement.prototype.showPopover=function() {};
    window.HTMLElement.prototype.hidePopover=function() {};
    window.HTMLElement.prototype.scrollIntoView=function() {};
    const app=new Gramlot({document:window.document,transport:false,collections:[layout,inputs]});
    const b=new GramlotBuilder(null,{collections:[layout,inputs]});
    app.data.setItem('page','a');app.data.setItem('index',0);app.data.setItem('name','Ada');app.data.setItem('locked',true);
    app.data.setItem('mode','tabs');app.data.setItem('position','top');app.data.setItem('align','start');
    const container=b.root[tag]({id:'pages',nodeId:'pages',node_label:'pages',selectedPage:'^page',selected:'^index',...attrs});
    container.contentPane({id:'a',pageName:'a',title:'Alpha',node_label:'a'}).textbox({id:'field',value:'^name',validate_len:'2:20',live:true});
    container.contentPane({id:'b',pageName:'b',title:'Beta',node_label:'b',closable:true,onClose:'return !this.GET("locked")'}).p('Second');
    container.borderContainer({id:'c',pageName:'c',title:'Gamma',node_label:'c',closable:true}).contentPane({region:'center'}).p('Nested');
    app.src.startSource(b.toTytx());
    const events=[];
    for (const topic of ['hiding','showing','selected','closing','closed']) app.subscribe(`pages_${topic}`, payload=>events.push({topic,...payload,dataPage:app.data.getItem('page')}));
    await settle();
    const element=window.document.getElementById('pages');
    return {app,window,element,events,source:app.src.source.getNode('main.pages'),
        tab:name=>[...element.shadowRoot.querySelectorAll('[role=tab]')].find(el=>el.textContent===name),
        close:name=>element.shadowRoot.querySelector(`[aria-label="Close ${name}"]`)};
}
test('initial selection, user and Data transitions share ordered events without duplicates; drafts stay mounted',async()=>{
    const f=await fixture(), {app,element,events,window}=f;
    assert.deepEqual(events.map(e=>[e.topic,e.page,e.selected]),[['selected','a',true]]);
    const field=window.document.getElementById('field'), control=field.control, pane=window.document.getElementById('a');
    control.value='A';control.dispatchEvent(new window.Event('input',{bubbles:true}));await settle();
    assert.equal(app.data.getItem('name'),'Ada');
    events.length=0;f.tab('Beta').click();await settle();
    assert.deepEqual(events.map(e=>e.topic),['hiding','showing','selected','selected']);
    assert.deepEqual(events.slice(2).map(e=>[e.page,e.selected,e.change,e.dataPage]),[['a',false,'a_hide','b'],['b',true,'b_show','b']]);
    assert.equal(app.data.getItem('index'),1);
    events.length=0;f.tab('Beta').click();await settle();assert.equal(events.length,0);
    app.data.setItem('index',0);await settle();assert.equal(app.data.getItem('page'),'a');
    assert.equal(window.document.getElementById('field'),field);assert.equal(window.document.getElementById('a'),pane);
    assert.equal(field.control,control);assert.equal(control.value,'A');assert.equal(app.data.getItem('name'),'Ada');
    events.length=0;app.data.setItem('page','a');await settle();assert.equal(events.length,0);
    element.style.width='400px';await settle();assert.equal(events.length,0);
    app.dispose();
});
test('onClose veto, selected closure, external removal and empty state preserve application Data',async()=>{
    const f=await fixture(),{app,events,source}=f;
    f.tab('Beta').click();await settle();events.length=0;
    f.close('Beta').click();await settle();assert.equal(events.length,0);assert.ok(source.value.getNode('b'));
    app.data.setItem('locked',false);f.close('Beta').click();await settle();
    assert.equal(source.value.getNode('b'),null);assert.equal(app.data.getItem('name'),'Ada');
    assert.deepEqual(events.map(e=>e.topic),['closing','hiding','showing','selected','selected','closed']);
    assert.equal(events.at(-1).pageName,'b');assert.equal(events.at(-1).index,1);assert.equal(events.at(-1).wasSelected,true);
    assert.equal(app.data.getItem('page'),'c');assert.equal(app.data.getItem('index'),1);
    events.length=0;source.value.popNode('a');await settle();
    assert.equal(app.data.getItem('index'),0);assert.equal(events.length,0);
    f.close('Gamma').click();await settle();assert.equal(app.data.getItem('page'),null);assert.equal(app.data.getItem('index'),null);
    assert.equal(app.data.getItem('name'),'Ada');app.dispose();
});
test('closing an inactive panel emits only close notifications; stack has identical Data selection without a tab strip',async()=>{
    const f=await fixture();f.events.length=0;f.close('Gamma').click();await settle();
    assert.deepEqual(f.events.map(e=>e.topic),['closing','closed']);assert.equal(f.events[0].wasSelected,false);assert.equal(f.app.data.getItem('page'),'a');f.app.dispose();
    const s=await fixture('stackContainer');assert.equal(s.element.shadowRoot.querySelector('[role=tablist]'),null);
    s.events.length=0;s.app.data.setItem('page','c');await settle();assert.equal(s.app.data.getItem('index'),2);
    assert.deepEqual(s.events.map(e=>e.topic),['hiding','showing','selected','selected']);s.app.dispose();
});
test('keyboard selection uses tab roles and roving focus; attributes update without rebuilding panels',async()=>{
    const f=await fixture();f.tab('Alpha').dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await settle();
    assert.equal(f.app.data.getItem('page'),'b');assert.equal(f.element.shadowRoot.activeElement,f.tab('Beta'));
    f.source.value.getNode('b').setAttr({title:'Renamed'});await settle();assert.equal(f.tab('Renamed').getAttribute('aria-selected'),'true');
    f.tab('Renamed').dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'End',bubbles:true}));await settle();assert.equal(f.app.data.getItem('page'),'c');
    f.app.dispose();await settle();
});
test('index-only selection initializes by index and named selection wins a simultaneous coherent update',async()=>{
    const f=await fixture('stackContainer',{selectedPage:null,selected:2});
    assert.equal(f.events[0].page,'c', JSON.stringify({parameters:f.element.parameters,attrs:f.source?.attr}));f.source.setAttr({selected:1});await settle();assert.equal(f.events.at(-1).page,'b');f.app.dispose();
    const g=await fixture();g.app.data.setItem('page','c');g.app.data.setItem('index',2);await settle();assert.equal(g.events.filter(e=>e.topic==='selected').length,3);g.app.dispose();
});
test('hidden and disabled choices are skipped, and child changes keep existing panel DOM',async()=>{
    const f=await fixture(), panel=f.window.document.getElementById('a');
    f.source.value.getNode('b').setAttr({disabled:true});await settle();
    f.tab('Alpha').dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await settle();
    assert.equal(f.app.data.getItem('page'),'c');
    f.source.value.getNode('c').setAttr({hidden:true});await settle();
    assert.equal(f.app.data.getItem('page'),'a');assert.equal(f.window.document.getElementById('a'),panel);f.app.dispose();
});
test('onClose never leaks to DOM and later unactivated callback text cannot run',async()=>{
    const f=await fixture();const node=f.source.value.getNode('b');
    assert.equal(f.window.document.getElementById('b').hasAttribute('onClose'),false);
    node.setAttr({onClose:'return true'});await settle();
    // Call the same registered listener through a captured error to observe the rejection.
    const errors=[];f.window.addEventListener('error',event=>{errors.push(event.error);event.preventDefault();});
    f.events.length=0;f.close('Beta').click();await settle();
    assert.equal(errors.length,1);assert.match(errors[0].message,/inline code runs only as received/);
    assert.ok(f.source.value.getNode('b'));assert.equal(f.events.length,0);f.app.dispose();
});

test('presentation bindings and inactive tab metadata update without selection events or remounting',async()=>{
    const f=await fixture('tabContainer',{tabMode:'^mode',tabPosition:'^position'});
    const {app,source,element,window,events}=f;
    const field=window.document.getElementById('field'), control=field.control;
    control.value='A';control.dispatchEvent(new window.Event('input',{bubbles:true}));await settle();
    source.value.getNode('b').setAttr({icon:'^icon',badge:'^unread',badge_color:'^badgeColor'});
    app.data.setItem('icon','✉');app.data.setItem('unread',3);app.data.setItem('badgeColor','crimson');await settle();
    const beta=element.shadowRoot.querySelector('[role=tab][title=Beta]');
    assert.equal(beta.querySelector('.badge').textContent,'3');assert.equal(beta.getAttribute('aria-label'),'Beta 3');
    assert.equal(beta.querySelector('.icon').textContent,'✉');assert.equal(beta.querySelector('.badge').style.backgroundColor,'crimson');
    assert.equal(window.document.getElementById('b').hasAttribute('badge'),false);
    events.length=0;
    for (const mode of ['tabs','underline']) for (const position of ['top','bottom','left','right']) {
        app.data.setItem('mode',mode);app.data.setItem('position',position);await settle();
        assert.equal(element.control.dataset.mode,mode);assert.equal(element.control.dataset.position,position);
        assert.equal(element.tabStrip.getAttribute('aria-orientation'),['left','right'].includes(position)?'vertical':'horizontal');
        assert.equal(window.document.getElementById('field'),field);assert.equal(field.control,control);assert.equal(control.value,'A');
    }
    app.data.setItem('unread',0);await settle();assert.equal(beta.querySelector('.badge').hidden,false);assert.equal(beta.querySelector('.badge').textContent,'0');
    app.data.setItem('unread',null);await settle();assert.equal(beta.querySelector('.badge').hidden,true);
    app.data.setItem('unread','<b>new</b>');app.data.setItem('icon','★');app.data.setItem('badgeColor','seagreen');await settle();
    assert.equal(beta.querySelector('.badge').textContent,'<b>new</b>');assert.equal(beta.querySelector('.badge b'),null);
    assert.equal(beta.querySelector('.icon').textContent,'★');assert.equal(beta.querySelector('.badge').style.backgroundColor,'seagreen');
    assert.equal(events.length,0);assert.equal(app.data.getItem('page'),'a');assert.equal(app.data.getItem('name'),'Ada');
    f.tab('Alpha').dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await settle();assert.equal(events.length,0);
    f.tab('Alpha').dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));await settle();assert.equal(app.data.getItem('page'),'b');
    assert.equal(element.shadowRoot.activeElement,beta);app.dispose();
});

test('keyboard traversal follows Source reorder and retains panel controls', async () => {
    const f = await fixture();
    const field = f.window.document.getElementById('field');
    f.source.value.move(2, 0);
    await settle();
    assert.deepEqual([...f.element.tabStrip.querySelectorAll('[role=tab]')].map(tab => tab.textContent), ['Gamma', 'Alpha', 'Beta']);
    f.tab('Alpha').dispatchEvent(new f.window.KeyboardEvent('keydown', {key: 'Home', bubbles: true}));
    await settle();
    assert.equal(f.app.data.getItem('page'), 'c');
    f.tab('Gamma').dispatchEvent(new f.window.KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));
    await settle();
    assert.equal(f.app.data.getItem('page'), 'a');
    assert.equal(f.window.document.getElementById('field'), field);
    f.app.dispose();
});


test('tabAlign defaults to start and reactive alignment retains selection, drafts and events', async () => {
    const f = await fixture();
    try {
        assert.equal(f.element.parameters.tabAlign, 'start');
        f.source.setAttr({tabAlign: '^align', tabPosition: '^position'});
        const field = f.window.document.getElementById('field');
        field.control.value = 'Uncommitted draft';
        const tab = f.tab('Alpha');
        f.events.length = 0;
        for (const position of ['top', 'bottom', 'left', 'right']) {
            f.app.data.setItem('position', position);
            for (const align of ['center', 'end', 'start']) {
                f.app.data.setItem('align', align);
                await settle();
                assert.equal(f.element.control.dataset.align, align);
                assert.equal(f.window.document.getElementById('field'), field);
                assert.equal(field.control.value, 'Uncommitted draft');
                assert.equal(f.tab('Alpha'), tab);
                assert.equal(f.app.data.getItem('page'), 'a');
            }
        }
        assert.deepEqual(f.events, []);
        assert.throws(() => f.source.setAttr({tabAlign: 'middle'}), /tabAlign|enum|Invalid/i);
    } finally {
        f.app.dispose();
        f.window.close();
    }
});

test('detachable icon handles drag, cancellation, dynamic eligibility and Source removal', async () => {
    const f=await fixture(), {app,element,source,window}=f;
    window.HTMLDialogElement.prototype.show=function(){this.open=true;};
    window.HTMLDialogElement.prototype.close=function(){this.open=false;};
    const child=source.value.getNode('a'); child.setAttr({detachable:true}); await settle();
    const button=element.shadowRoot.querySelector('[aria-label="Detach Alpha"]');
    const toolbar=button.closest('.panel-tools'), viewport=button.closest('[role=tabpanel]');
    assert.ok(viewport, 'detach belongs inside the panel');
    assert.equal(element.shadowRoot.querySelector('.tabs .detach'),null);
    assert.equal(toolbar.hidden,false);
    element.shadowRoot.querySelector('[role=tab][aria-label=Beta]').click();await settle();
    assert.equal(toolbar.hidden,true,'closed panel does not expose a detach control');
    element.shadowRoot.querySelector('[role=tab][aria-label=Alpha]').click();await settle();
    assert.equal(toolbar.hidden,false);
    let capture=null;
    button.setPointerCapture=id=>{capture=id;};button.hasPointerCapture=id=>capture===id;
    button.releasePointerCapture=()=>{capture=null;};
    const pointer=(type,x,y)=>{
        const event=new window.MouseEvent(type,{button:0,clientX:x,clientY:y,bubbles:true});
        Object.defineProperty(event,'pointerId',{value:1});button.dispatchEvent(event);
    };
    pointer('pointerdown',30,20);pointer('pointercancel',100,100);pointer('pointerup',100,100);await settle();
    assert.equal(element.shadowRoot.querySelector('dialog'),null);
    pointer('pointerdown',30,20);pointer('pointerup',300,180);button.click();await settle();
    assert.equal(element.shadowRoot.querySelectorAll('dialog[open]').length,1);
    assert.equal(app.data.getItem('page'),'b');
    assert.equal(toolbar.hidden,true,'floating uses its own window title bar');
    element.shadowRoot.querySelector('[aria-label="Close window"]').click();await settle();
    assert.equal(toolbar.hidden,false,'docking restores the internal handle');
    button.click();await settle();
    assert.equal(app.src.renderer.elements.get(window.document.getElementById('a')).node,child);
    child.setAttr({title:'Updated'});await settle();
    assert.equal(element.shadowRoot.querySelector('dialog').getAttribute('aria-label'),'Updated');
    child.setAttr({hidden:true});await settle();
    assert.equal(element.shadowRoot.querySelector('dialog'),null);
    child.setAttr({hidden:false});await settle();
    element.shadowRoot.querySelector('[aria-label="Detach Updated"]').click();await settle();
    child.setAttr({detachable:false});await settle();
    assert.equal(element.shadowRoot.querySelector('dialog'),null);
    child.setAttr({detachable:true});await settle();
    element.shadowRoot.querySelector('[aria-label="Detach Updated"]').click();await settle();
    source.value.popNode('a');await settle();
    assert.equal(element.shadowRoot.querySelector('dialog'),null);
    assert.equal(window.document.getElementById('field'),null);
    app.dispose();window.close();
});
