import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import layout from '../src/components/layout.js';
import inputs from '../src/components/inputs.js';
import {layoutWindow} from './helpers/layout-window.js';

async function fixture(author) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {url:'https://example.test'});
    layoutWindow(window);
    window.HTMLElement.prototype.showPopover = function() {};
    window.HTMLElement.prototype.hidePopover = function() {};
    const app = new Gramlot({document:window.document, transport:false, collections:[inputs,layout]});
    const builder = new GramlotBuilder(null,{collections:[inputs,layout]});
    author(builder.root,app,window); app.src.startSource(builder.toTytx());
    await new Promise(resolve=>setTimeout(resolve,0));
    return {window,app,element:id=>window.document.getElementById(id)};
}
const separator = (border,side) => border.shadowRoot.querySelector(`.separator[data-side=${side}]`);
const viewport = (border,side) => border.shadowRoot.querySelector(`#region-${side}`);

test('automatic drawer visibility is immediate; button activation animates despite Source feedback', async () => {
    const {app, window, element} = await fixture((root, app) => {
        app.data.setItem('codeHidden', true);
        app.data.setItem('codeDrawer', true);
        const border = root.borderContainer({id:'border', height:'400px'});
        border.contentPane({region:'center'});
        border.contentPane({id:'code', nodeId:'code', region:'right', width:'240px',
            hidden:'^codeHidden', drawer:'^codeDrawer', drawer_label:'Code'});
    });
    const border = element('border'), view = viewport(border, 'right');
    const button = separator(border, 'right').querySelector('button');
    const animated = () => border.control.hasAttribute('data-drawer-motion');
    const feedback = app.subscribe('code_closable_change', ({open}) => {
        app.data.setItem('codeDrawer', open ? true : 'close');
    });
    try {
        assert.equal(view.hidden, true);
        assert.equal(animated(), false);
        app.data.setItem('codeHidden', false);
        assert.equal(view.hidden, false);
        assert.equal(animated(), false);
        button.click();
        assert.equal(view.hidden, true);
        assert.equal(animated(), true);
        assert.equal(app.data.getItem('codeDrawer'), 'close');
        button.click();
        assert.equal(view.hidden, false);
        assert.equal(animated(), true);
        app.data.setItem('codeHidden', true);
        assert.equal(view.hidden, true);
        assert.equal(animated(), false);
        app.data.setItem('codeDrawer', true);
        app.data.setItem('codeHidden', false);
        assert.equal(view.hidden, false);
        assert.equal(animated(), false);
        button.click();
        assert.equal(animated(), true);
        border.control.dispatchEvent(new window.Event('transitionend'));
        assert.equal(animated(), false);
        // JSDOM does not recompute shadow-root transition styles. Browser coverage uses reduced motion.
        const computedStyle = window.getComputedStyle.bind(window);
        window.getComputedStyle = element => element === border.control
            ? {transitionDuration: '0s'} : computedStyle(element);
        button.click();
        assert.equal(view.hidden, false);
        assert.equal(animated(), false, 'a disabled transition has no end event to wait for');
    } finally { app.unsubscribe(feedback); app.dispose(); }
});

function geometry(border) {
    border.control.getBoundingClientRect=()=>({width:800,height:500});
    for (const cell of border.shadowRoot.querySelectorAll('.region')) cell.getBoundingClientRect=()=>({
        width:parseFloat(border.control.style.getPropertyValue(`--${cell.style.gridArea}`))||0,
        height:parseFloat(border.control.style.getPropertyValue(`--${cell.style.gridArea}`))||0,
    });
}

test('region projection comes from Source; drawer preserves invalid draft, Data and nodes', async()=>{
    const {app,window,element}=await fixture((root,app)=>{
        app.data.setItem('name','Ada');app.data.setItem('size','180px');app.data.setItem('handle','navy');
        const bc=root.borderContainer({id:'border',height:'400px'});
        const left=bc.contentPane({id:'left',region:'left',width:'^size',splitter:true,drawer:'close',drawer_label:'Filters',drawer_background:'^handle'});
        left.textbox({id:'field',value:'^name',validate_len:'2:8'});
        bc.contentPane({id:'center',region:'center'}).p('Center');
    });
    const border=element('border'),field=element('field'),left=element('left');
    const handle=separator(border,'left').querySelector('button');
    assert.equal(left.slot,'left'); assert.equal(viewport(border,'left').hidden,true);
    assert.equal(viewport(border,'left').inert,true);
    handle.click(); assert.equal(viewport(border,'left').hidden,false);
    assert.equal(viewport(border,'left').inert,false);
    field.control.value='X';field.control.dispatchEvent(new window.Event('change',{bubbles:true}));
    assert.equal(app.data.getItem('name'),'Ada');
    handle.click();handle.click();
    assert.equal(element('field'),field);assert.equal(field.control.value,'X');assert.equal(left.parentElement,border);
    assert.match(handle.getAttribute('style'), /background: navy;/);
    app.data.setItem('size','230px');app.data.setItem('handle','red');
    assert.equal(border.control.style.getPropertyValue('--left'),'230px');
    assert.match(handle.getAttribute('style'), /background: red;/); assert.equal(field.control.value,'X');
    app.dispose();
});

test('all four separators resize with consistent limits and no Data changes; fixed drawers still open',async()=>{
    const {app,window,element}=await fixture(root=>{
        const bc=root.borderContainer({id:'border',height:'500px'});
        for(const region of ['left','right','top','bottom']) bc.contentPane({region,id:region,width:'100px',height:'100px',splitter:true,minSize:99,maxSize:101,drawer:true});
        bc.contentPane({region:'center'});
    });
    const border=element('border');geometry(border);
    for(const side of ['left','right','top','bottom']) {
        const s=separator(border,side),key=['top','bottom'].includes(side)?'ArrowDown':'ArrowRight';
        for(let i=0;i<5;i++) s.dispatchEvent(new window.KeyboardEvent('keydown',{key,bubbles:true}));
        assert.equal(border.control.style.getPropertyValue(`--${side}`),['left','top'].includes(side)?'101px':'99px');
        assert.equal(s.getAttribute('role'),'separator');
    }
    assert.equal(app.data.getNodes().length,0);
    app.dispose();
});

test('nested border, fixed drawer, placement style precedence and callback use Source context',async()=>{
    const {app,element}=await fixture(root=>{
        const bc=root.borderContainer({id:'border',height:'400px'});
        const nested=bc.borderContainer({id:'nested',region:'right',width:'200px',drawer:true,splitter:false,
            drawer_style:'top:50px',drawer_top:'12px',drawer_margin_top:'0',drawer_left:'-40px',drawer_class:'custom',
            drawer_onclick:'this.setRelativeData("clicked", show);'});
        nested.contentPane({region:'center'}).p('Nested');bc.contentPane({region:'center'});
    });
    const border=element('border'),nested=element('nested'),s=separator(border,'right'),handle=s.querySelector('button');
    assert.equal(s.dataset.draggable,'false');assert.equal(handle.style.top,'12px');
    assert(handle.classList.contains('custom'));assert.equal(handle.style.left,'-40px');
    handle.click(); assert.equal(app.data.getItem('clicked'),false);
    handle.click(); assert.equal(app.data.getItem('clicked'),true);
    assert.equal(element('nested'),nested); app.dispose();
});

test('persistent separator sizes restore by stable container id', async()=>{
    const {app,window,element}=await fixture((root,app,window)=>{
        window.document.cookie='gramlot-border-saved-left=137px';
        const bc=root.borderContainer({id:'saved',persist:true});
        bc.contentPane({region:'left',width:'120px',splitter:true});bc.contentPane({region:'center'});
    });
    const bc=element('saved');geometry(bc);
    assert.equal(bc.control.style.getPropertyValue('--left'),'137px');
    separator(bc,'left').dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight'}));
    assert.match(window.document.cookie,/gramlot-border-saved-left=138px/);
    const original=element('saved').firstElementChild;
    bc.remove();window.document.querySelector('main').append(bc);
    assert.equal(bc.firstElementChild,original);
    assert.equal(bc.control.style.getPropertyValue('--left'),'138px'); app.dispose();
});

test('drawer captions minimize by default; explicit and bound false keep them visible',async()=>{
    const {app,element}=await fixture((root,app)=>{
        app.data.setItem('minimize',false);
        const bc=root.borderContainer({id:'border',height:'400px'});
        bc.contentPane({region:'left',drawer:true,drawer_label:'Filters',drawer_icon:'⌕'});
        bc.contentPane({region:'right',drawer:true,drawer_label:'Details',drawer_minimize:false});
        bc.contentPane({region:'bottom',drawer:true,drawer_label:'Output',drawer_minimize:'^minimize'});
        bc.contentPane({region:'center'});
    });
    const handle=side=>separator(element('border'),side).querySelector('button');
    assert(handle('left').classList.contains('drawer-reveal'));
    assert.equal(handle('left').querySelector('.drawer-icon').hidden,false);
    assert.equal(handle('right').classList.contains('drawer-reveal'),false);
    assert.equal(handle('bottom').classList.contains('drawer-reveal'),false);
    app.data.setItem('minimize',true);
    assert(handle('bottom').classList.contains('drawer-reveal'));
    app.dispose();
});

test('numeric regional bindings keep sliders synchronized during drag and keyboard resize', async()=>{
    const {app,window,element}=await fixture((root,app)=>{
        const pane=root.div({datapath:'layout'});
        const bc=pane.borderContainer({id:'border',nodeId:'workspace',height:'500px'});
        for(const side of ['left','right','top','bottom']) {
            app.data.setItem(`layout.${side}`,100);
            pane.horizontalSlider({id:`slider-${side}`,value:`^.${side}`,min:90,max:110,live:true});
            bc.contentPane({id:side,region:side,[['top','bottom'].includes(side)?'height':'width']:`^.${side}`,splitter:true,minSize:90,maxSize:110});
        }
        bc.contentPane({region:'center'}).textbox({id:'draft',value:'^.draft'});
    });
    const border=element('border');geometry(border);
    const draft=element('draft'), events=[];
    app.subscribe('workspace_splitter_resize', payload=>events.push({...payload, data:app.data.getItem('layout.'+payload.region)}));
    for(const side of ['left','right','top','bottom']) {
        const sep=separator(border,side), vertical=['top','bottom'].includes(side);
        assert.equal(border.control.style.getPropertyValue(`--${side}`),'100px');
        sep.setPointerCapture=()=>{};sep.hasPointerCapture=()=>false;
        const event=(type,position)=>new window.MouseEvent(type,{bubbles:true,button:0,[vertical?'clientY':'clientX']:position});
        const count=events.length;
        sep.dispatchEvent(event('pointerdown',100));
        sep.dispatchEvent(event('pointermove',105));
        const expected=['left','top'].includes(side)?105:95;
        assert.equal(app.data.getItem(`layout.${side}`),expected,'Data changes before release');
        assert.equal(Number(element(`slider-${side}`).control.value),expected);
        assert.equal(events.length,count,'live Data writes do not emit completion notifications');
        sep.dispatchEvent(event('pointerup',105));
        assert.deepEqual(events.at(-1),{region:side,size:`${expected}px`,previousSize:'100px',data:expected});
        assert.equal(events.length,count+1);
        sep.dispatchEvent(new window.KeyboardEvent('keydown',{key:vertical?'ArrowDown':'ArrowRight'}));
        assert.equal(app.data.getItem(`layout.${side}`),expected+(['left','top'].includes(side)?1:-1));
        const slider=element(`slider-${side}`).control;
        slider.value='102';slider.dispatchEvent(new window.Event('input',{bubbles:true}));
        assert.equal(app.data.getItem(`layout.${side}`),102);
        assert.equal(border.control.style.getPropertyValue(`--${side}`),'102px');
        assert.equal(events.length,count+2,'only drag completion and keyboard resize publish');
        assert.equal(app.dom.getBaseSourceNode(element(side)).getAttr(vertical?'height':'width'),`^.${side}`);
    }
    assert.equal(element('draft'),draft);
    app.dispose();
});

test('resize respects limits and the current relative or attribute binding without feedback', async()=>{
    const {app,window,element}=await fixture((root,app)=>{
        app.data.setItem('layout.measure',null,{pixels:100});
        app.data.setItem('layout.other',103);
        const bc=root.borderContainer({id:'border',datapath:'layout',height:'400px'});
        bc.contentPane({id:'left',region:'left',width:'^.measure?pixels',splitter:true,minSize:99,maxSize:101});
        bc.contentPane({region:'center'});
    });
    const border=element('border');geometry(border);
    const sep=separator(border,'left');
    const key=()=>sep.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight'}));
    key();key();
    assert.equal(app.data.getItem('layout.measure?pixels'),101);
    assert.equal(border.control.style.getPropertyValue('--left'),'101px');
    const node=app.dom.getBaseSourceNode(element('left'));
    node.setAttr({width:'^.other'});
    assert.equal(border.control.style.getPropertyValue('--left'),'103px');
    key();
    assert.equal(app.data.getItem('layout.other'),101);
    assert.equal(app.data.getItem('layout.measure?pixels'),101);
    app.dispose();
});

test('literal, read-only, CSS string and transformed dimensions never acquire writeback',async()=>{
    for(const width of [100,'=size','^size:{}px','^size:= {} + 0','^css']) {
        const {app,window,element}=await fixture((root,app)=>{
            app.data.setItem('size',100);app.data.setItem('css','100px');
            const bc=root.borderContainer({id:'border',height:'400px'});
            bc.contentPane({id:'left',region:'left',width,splitter:true});bc.contentPane({region:'center'});
        });
        const border=element('border');geometry(border);
        assert.equal(border.control.style.getPropertyValue('--left'),'100px');
        separator(border,'left').dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight'}));
        assert.equal(border.control.style.getPropertyValue('--left'),'101px');
        assert.equal(app.data.getItem('size'),100);
        assert.equal(app.data.getItem('css'),'100px');
        assert.equal(app.data.getNodes().length,2);
        app.dispose();
    }
});
