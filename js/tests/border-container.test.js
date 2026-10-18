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
    handle.click(); assert.equal(viewport(border,'left').hidden,false);
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
