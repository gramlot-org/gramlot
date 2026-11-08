import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import drawing from '../src/components/drawing.js';
import inputs from '../src/components/inputs.js';
import layout from '../src/components/layout.js';
import tree from '../src/components/tree.js';
import {layoutWindow} from './helpers/layout-window.js';

function fixture(initial=new Bag(),extra={}) {
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    layoutWindow(window);
    window.SVGElement.prototype.getBBox=()=>({x:0,y:0,width:100,height:24});
    const collections=[tree,inputs,layout,drawing];
    const app=new Gramlot({document:window.document,transport:false,collections});
    app.data.setItem('annotations',initial);
    const builder=new GramlotBuilder(null,{collections});
    builder.root.drawingPane({id:'drawing',annotations:'^annotations',...extra});
    app.src.startSource(builder.toTytx());
    const pane=window.document.getElementById('drawing'), svg=pane.shadowRoot.querySelector('svg.canvas');
    svg.getScreenCTM=()=>({a:1,inverse:()=>({})});
    svg.createSVGPoint=()=>({x:0,y:0,matrixTransform(){return {x:this.x,y:this.y};}});
    svg.setPointerCapture=()=>{};svg.hasPointerCapture=()=>false;
    const click=tool=>pane.querySelectorAll('gramlot-menu-line')[[ 'select','freehand','arrow','circle','text' ].indexOf(tool)].control.click();
    const pointer=(type,x,y,target=svg)=>{const event=new window.MouseEvent(type,{button:0,clientX:x,clientY:y,bubbles:true});Object.defineProperty(event,'pointerId',{value:1});target.dispatchEvent(event);};
    return {window,app,pane,svg,click,pointer};
}

test('creates, moves, removes and restores Bag annotations',()=>{
    const f=fixture();const bag=f.app.data.getItem('annotations');
    f.click('arrow');f.pointer('pointerdown',10,20);f.pointer('pointermove',50,70);f.pointer('pointerup',50,70);
    assert.equal(bag.getNodes().length,1);const id=bag.getNodes()[0].label;assert.equal(bag.getItem(id).getItem('x2'),50);
    f.click('select');f.pointer('pointerdown',50,70,f.svg.querySelector('line'));f.pointer('pointermove',60,80);f.pointer('pointerup',60,80);
    assert.equal(bag.getItem(id).getItem('x'),20);assert.equal(bag.getItem(id).getItem('y2'),80);
    const snapshot=Bag.fromTytx(bag.toTytx());f.app.dispose();f.window.close();
    const restored=fixture(snapshot);assert.equal(restored.svg.querySelector('line').getAttribute('x1'),'20');
    restored.click('select');restored.pointer('pointerdown',60,80,restored.svg.querySelector('line'));restored.pointer('pointerup',60,80);
    [...restored.pane.querySelectorAll('gramlot-menu-line')].find(item=>item.parameters.caption==='Delete').control.click();assert.equal(snapshot.getNodes().length,0);
    restored.app.dispose();restored.window.close();
});

test('drawing popup tools have downward indicators',()=>{
    const f=fixture();
    try {
        for(const caption of ['Color','Pen size']) {
            const item=[...f.pane.querySelectorAll('gramlot-menu-line')].find(item=>item.parameters.caption===caption);
            assert.equal(item.control.querySelector('.menu-arrow').textContent,'⌄');
            assert.equal(item.control.getAttribute('aria-haspopup'),'menu');
        }
    } finally { f.app.dispose();f.window.close(); }
});

test('creates freehand, circle and text records',()=>{
    const f=fixture();const bag=f.app.data.getItem('annotations');
    for(const tool of ['freehand','circle']){f.click(tool);f.pointer('pointerdown',5,6);f.pointer('pointermove',20,30);f.pointer('pointerup',20,30);}
    f.click('text');f.pointer('pointerdown',30,40);
    const editor=f.pane.shadowRoot.querySelector('.text-editor');editor.value='Note';
    editor.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    assert.deepEqual(bag.getNodes().map(n=>n.getValue().getItem('type')),['freehand','circle','text']);
    assert.equal(bag.getNodes()[2].getValue().getItem('text'),'Note');
    assert.equal(f.pane.querySelectorAll('gramlot-menu-line')[0].getAttribute('aria-checked'),'true');
    f.click('text');f.pointer('pointerdown',30,40,f.svg.querySelector('text'));
    assert.equal(editor.value,'Note');editor.value='Updated';
    editor.dispatchEvent(new f.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    assert.equal(bag.getNodes()[2].getValue().getItem('text'),'Updated');
    assert.equal(f.pane.querySelector('gramlot-menu').getAttribute('aria-orientation'),'vertical');
    [...f.pane.querySelectorAll('gramlot-menu-line')].find(item=>item.parameters.caption==='Blue').control.click();
    assert.equal(bag.getNodes()[2].getValue().getItem('color'),'#1677d2');
    const color=f.pane.querySelector('gramlot-colorpicker').control;color.value='#0088cc';color.dispatchEvent(new f.window.Event('change',{bubbles:true}));
    const size=f.pane.querySelector('gramlot-number-text-box').control;size.focus();size.value='7';size.dispatchEvent(new f.window.Event('input',{bubbles:true}));size.dispatchEvent(new f.window.Event('change',{bubbles:true}));
    assert.equal(bag.getNodes()[2].getValue().getItem('color'),'#0088cc');assert.equal(bag.getNodes()[2].getValue().getItem('width'),7);
    const restored=Bag.fromTytx(bag.toTytx());
    f.app.data.setItem('annotations',restored);
    assert.equal(f.svg.querySelectorAll('polyline').length,1);
    assert.equal(f.svg.querySelector('text').textContent,'Updated');
    f.app.dispose();f.window.close();
});

test('toolbar SVG icons retain their namespace when bound color and size change',()=>{
    const f=fixture();
    try {
        const verify=()=>{
            for(const line of f.pane.querySelectorAll('gramlot-menu-line')) {
                const uri=line.parameters.iconSrc;
                if(!uri)continue;
                const document=new f.window.DOMParser().parseFromString(decodeURIComponent(uri.split(',')[1]),'image/svg+xml');
                assert.equal(document.querySelector('parsererror'),null);
                assert.equal(document.documentElement.namespaceURI,f.svg.namespaceURI);
            }
        };
        verify();
        const color=[...f.pane.querySelectorAll('gramlot-menu-line')].find(line=>line.parameters.caption==='Green');
        color.control.click();
        const size=[...f.pane.querySelectorAll('gramlot-menu-line')].find(line=>line.parameters.caption==='7 px');
        size.control.click();
        verify();
    } finally {f.app.dispose();f.window.close();}
});

test('without toolbar and with an aspectRatio the surface is 1000 units high and ratio times wider; tools still apply',()=>{
    const f=fixture(new Bag(),{toolbar:false,aspectRatio:2});
    try {
        assert.equal(f.pane.querySelector('gramlot-menu'),null);
        assert.equal(f.svg.getAttribute('viewBox'),'0 0 2000 1000');
        f.pane.setTool('arrow');f.pointer('pointerdown',10,20);f.pointer('pointermove',1900,70);f.pointer('pointerup',1900,70);
        const bag=f.app.data.getItem('annotations');assert.equal(bag.getItem(bag.getNodes()[0].label).getItem('x2'),1900);
    } finally {f.app.dispose();f.window.close();}
});
