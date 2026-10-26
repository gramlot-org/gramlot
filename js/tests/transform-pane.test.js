import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import layout from '../src/components/layout.js';
import inputs from '../src/components/inputs.js';

function fixture(ended = null) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    // Pointer capture is a browser facility absent in JSDOM, not a production fallback.
    const captures = new WeakMap();
    window.HTMLElement.prototype.setPointerCapture = function(id) {
        if (!captures.has(this)) captures.set(this, new Set());
        captures.get(this).add(id);
    };
    window.HTMLElement.prototype.hasPointerCapture = function(id) { return captures.get(this)?.has(id) ?? false; };
    window.HTMLElement.prototype.releasePointerCapture = function(id) { captures.get(this).delete(id); };
    window.HTMLElement.prototype.showPopover = function () {};
    const app = new Gramlot({document:window.document, transport:false, collections:[inputs,layout]});
    const published = [];
    class Logic { ended(node, values) { if (ended) return ended(node, values); this.page.publish('transformReleased', values); } }
    app.src.logicRegistry.register(Logic,{group:null,resource:'/transform-test.js'});
    app.subscribe('transformReleased', payload => published.push(payload));
    for (const [name,value] of Object.entries({x:0,y:0,rotate:0,zoom:1})) app.data.setItem(name,value);
    const b = new GramlotBuilder(null,{collections:[inputs,layout]});
    const root = b.root.div({node_label:'fixture'});
    for (const id of ['photo','rectangle']) root.transformPane({id,x:'^x',y:'^y',rotate:'^rotate',zoom:'^zoom',min:.5,max:3,step:.01,onEnd:'ended'}).div('Content');
    root.horizontalSlider({id:'slider',value:'^zoom',min:.5,max:3,step:.01,live:true});
    app.src.startSource(b.toTytx());
    const photo=window.document.getElementById('photo'), rectangle=window.document.getElementById('rectangle');
    const send=(type,id,x,y=0,target=photo,pointerType='touch') => {
        const event=new window.Event(type,{bubbles:true,composed:true});
        Object.assign(event,{pointerId:id,clientX:x,clientY:y,pointerType,button:0});target.dispatchEvent(event);
    };
    const start=()=>{send('pointerdown',1,-50);send('pointerdown',2,50);};
    return {app,window,photo,rectangle,published,send,start,slider:window.document.getElementById('slider').control};
}

const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-8, `${actual} != ${expected}`);
const values=f=>Object.fromEntries(['x','y','rotate','zoom'].map(name=>[name,f.app.data.getItem(name)]));

test('two touches translate, rotate and zoom shared Data; only last lift completes',()=>{
    const f=fixture();try {
        f.start();f.send('pointermove',1,20,-70);f.send('pointermove',2,20,130);
        const current=values(f);near(current.x,20);near(current.y,30);near(current.rotate,90);near(current.zoom,2);
        assert.equal(f.slider.value,'2');near(f.rectangle.parameters.rotate,90);assert.deepEqual(f.published,[]);
        f.send('pointerup',1,20,-70);assert.deepEqual(f.published,[]);
        f.send('pointerup',2,20,130);assert.equal(f.published.length,1);
        for(const key of Object.keys(current)) near(f.published[0][key],current[key]);
        assert.equal(f.photo.hasPointerCapture(1),false);assert.equal(f.photo.hasPointerCapture(2),false);
        f.app.data.setItem('zoom',.75);assert.equal(f.slider.value,'0.75');assert.equal(f.photo.parameters.zoom,.75);assert.equal(f.published.length,1);
    } finally {f.app.dispose();}
});

for(const type of ['touch','mouse','pen']) test(`one ${type} pointer translates without changing rotation/zoom`,()=>{
    const f=fixture();try {
        f.send('pointerdown',1,10,20,f.photo,type);f.send('pointermove',1,30,50,f.photo,type);
        assert.deepEqual(values(f),{x:20,y:30,rotate:0,zoom:1});assert.deepEqual(f.published,[]);
        f.send('pointerup',1,30,50,f.photo,type);assert.deepEqual(f.published,[{x:20,y:30,rotate:0,zoom:1}]);
    } finally {f.app.dispose();}
});

test('one/two/one finger transition rebases without jumps and publishes once',()=>{
    const f=fixture();try {
        f.send('pointerdown',1,0);f.send('pointermove',1,20,30);
        f.send('pointerdown',2,120,30);assert.deepEqual(values(f),{x:20,y:30,rotate:0,zoom:1});
        f.send('pointermove',2,200,30);assert.deepEqual(values(f),{x:60,y:30,rotate:0,zoom:1.8});
        f.send('pointerup',2,200,30);assert.equal(f.published.length,0);
        f.send('pointermove',1,30,40);assert.deepEqual(values(f),{x:70,y:40,rotate:0,zoom:1.8});
        f.send('pointerup',1,30,40);assert.deepEqual(f.published,[values(f)]);
    } finally {f.app.dispose();}
});

test('rotation unwraps angle crossing and can continue beyond a full turn',()=>{
    const f=fixture();try {
        f.send('pointerdown',1,0);f.send('pointerdown',2,100);
        for(const angle of [90,179,181,270,359,361,450]) {
            const rad=angle*Math.PI/180;f.send('pointermove',2,100*Math.cos(rad),100*Math.sin(rad));
            near(f.app.data.getItem('rotate'),angle);
        }
    } finally {f.app.dispose();}
});

test('zoom bounds apply and a stationary gesture never completes',()=>{
    const f=fixture();try {
        f.start();f.send('pointerup',1,-50);f.send('pointerup',2,50);assert.deepEqual(f.published,[]);
        f.start();f.send('pointermove',2,1000);assert.equal(f.app.data.getItem('zoom'),3);
        f.send('pointermove',2,-49);assert.equal(f.app.data.getItem('zoom'),.5);
    } finally {f.app.dispose();}
});

for(const reason of ['pointercancel','lostpointercapture','third','external','blur','hidden','remove']) test(`cancellation (${reason}) retains current Data and releases captures without completion`,()=>{
    const f=fixture();try {
        f.start();f.send('pointermove',2,100);const before=values(f);
        if(reason==='third') f.send('pointerdown',3,50);
        else if(reason==='external') f.app.data.setItem('x',80);
        else if(reason==='blur') f.window.dispatchEvent(new f.window.Event('blur'));
        else if(reason==='hidden') {Object.defineProperty(f.window.document,'hidden',{value:true,configurable:true});f.window.document.dispatchEvent(new f.window.Event('visibilitychange'));}
        else if(reason==='remove') f.app.src.source.popNode('main.fixture');
        else f.send(reason,2,100);
        f.send('pointerup',2,200);assert.deepEqual(f.published,[]);
        assert.deepEqual(values(f),reason==='external'?{...before,x:80}:before);
        assert.equal(f.photo.hasPointerCapture(1),false);assert.equal(f.photo.hasPointerCapture(2),false);
    } finally {f.app.dispose();}
});

test('zero-distance baseline cancels; invalid constraints reject',()=>{
    const f=fixture();try {
        f.send('pointerdown',1,0);f.send('pointerdown',2,0);f.send('pointermove',2,50);f.send('pointerup',2,50);
        assert.deepEqual(values(f),{x:0,y:0,rotate:0,zoom:1});assert.deepEqual(f.published,[]);
        assert.throws(()=>f.photo.projectAttributes({x:0,y:0,rotate:0,zoom:1,min:0,max:3,step:.01}),/positive min/);
    } finally {f.app.dispose();}
});

test('onEnd is reserved to transformPane; the superseded pinch alias is absent',()=>{
    assert.equal(layout.toDocument().elements.pinchPane,undefined);
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    const app=new Gramlot({document:window.document,transport:false});
    const b=new GramlotBuilder();b.root.div({onEnd:'untrusted'});
    try {assert.throws(()=>app.src.startSource(b.toTytx()),/onEnd is only supported on transformPane/);}
    finally {app.dispose();}
});


test('onEnd reports synchronous and asynchronous failures and ignores late disposal',async()=>{
    const settle=()=>new Promise(resolve=>setImmediate(resolve));
    for(const asynchronous of [false,true]) {
        const f=fixture(()=>{if(asynchronous)return Promise.reject(Error('End failed'));throw Error('End failed');});
        try {
            f.send('pointerdown',1,0);f.send('pointerup',1,10);await settle();
            assert.match(f.window.document.querySelector('[role=alert]').textContent,/Transform completion failed.*End failed/s);
            assert.equal(f.photo.hasPointerCapture(1),false);
        }finally{f.app.dispose();f.window.close();}
    }
    let reject;
    const f=fixture(()=>new Promise((resolve,fail)=>{reject=fail;}));
    try {
        f.send('pointerdown',1,0);f.send('pointerup',1,10);f.app.dispose();
        reject(Error('Late end failed'));await settle();
        assert.equal(f.window.document.querySelector('[role=alert]'),null);
    }finally{f.window.close();}
});
