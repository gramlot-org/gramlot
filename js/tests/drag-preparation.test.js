import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';

test('ordinary Source elements share drag/drop Logic without a tree or native event attributes', async t => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false});
    t.after(() => { app.dispose(); window.close(); });
    let received;
    let receivedDrop;
    class Logic {
        prepare(source, context) {
            received = {source, context};
            context.dragValues['app/record'] = {id: 42};
        }
        receive(source, context) { receivedDrop = {source, context}; }
    }
    app.src.logicRegistry.register(Logic, {group: null, resource: '/drag-test.js'});
    const b = new GramlotBuilder();
    b.root.div('A record', {node_label: 'record', id: 'record', draggable: true, onDrag: 'prepare', onDrop: 'receive'});
    app.src.startSource(b.toTytx());
    const source = app.src.source.getNode('main.record');
    const result = app.src.renderer.prepareDrag(source, {composedPath: () => []});
    assert.equal(received.source, source);
    assert.equal(received.context.item, undefined);
    assert.equal(received.context.path, undefined);
    assert.deepEqual(result.dragValues, {'app/record': {id: 42}});
    assert.equal(window.document.getElementById('record').hasAttribute('onDrag'), false);
    const context = {dropValues: result.dragValues, item: undefined, path: undefined,
        source: Object.freeze({}), selfdrop: true, dropEffect: 'move', dataAvailable: true};
    await app.src.renderer.invokeDrop(source, context);
    assert.equal(receivedDrop.source, source);
    assert.deepEqual(receivedDrop.context, context);
    assert.equal(window.document.getElementById('record').hasAttribute('onDrop'), false);
    assert.doesNotMatch(b.render(), /ondrag|ondrop/i);
});

test('drag target and async drop failures notify without blocking a later gesture',async t=>{
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    window.HTMLElement.prototype.showPopover=function(){};
    const app=new Gramlot({document:window.document,transport:false});
    t.after(()=>{app.dispose();window.close();});
    let mode='target',received=0,rejectDrop;
    class Logic {
        prepare(node,{dragValues}){dragValues['text/plain']='example';}
        accepts(){if(mode==='target')throw Error('Target failed');return true;}
        async drop(){
            if(mode==='drop')throw Error('Drop failed');
            if(mode==='pending')return new Promise((resolve,reject)=>{rejectDrop=reject;});
            received++;
        }
    }
    app.src.logicRegistry.register(Logic,{group:null,resource:'test:drag-errors'});
    const builder=new GramlotBuilder();
    builder.root.div('Source',{id:'source',draggable:true,onDrag:'prepare'});
    builder.root.div('Target',{node_label:'target',id:'target',dropTarget:true,dropTypes:'text/plain',dropTargetCb:'accepts',onDrop:'drop'});
    app.src.startSource(builder.toTytx());
    const transfer={clearData(){},setData(){},setDragImage(){},dropEffect:'move'};
    const fire=(id,type)=>{
        const event=new window.Event(type,{bubbles:true,cancelable:true});
        Object.defineProperty(event,'dataTransfer',{value:transfer});window.document.getElementById(id).dispatchEvent(event);
    };
    const settle=()=>new Promise(resolve=>setImmediate(resolve));
    fire('source','dragstart');fire('target','dragover');await settle();fire('source','dragend');
    mode='drop';fire('source','dragstart');fire('target','drop');await settle();fire('source','dragend');
    assert.match(window.document.querySelector('.gramlot-error-notifications').textContent,/Target failed/);
    assert.match(window.document.querySelector('.gramlot-error-notifications').textContent,/Drop failed/);
    mode='success';fire('source','dragstart');fire('target','drop');await settle();fire('source','dragend');
    assert.equal(received,1);
    const count=window.document.querySelectorAll('[role=alert]').length;
    mode='pending';fire('source','dragstart');fire('target','drop');await settle();
    app.src.source.getItem('main').popNode('target');
    rejectDrop(Error('Removed target failed'));await settle();fire('source','dragend');
    assert.equal(window.document.querySelectorAll('[role=alert]').length,count);
    assert.doesNotMatch(window.document.body.textContent,/Removed target failed/);
});
