import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {invokeHook} from '../src/binding/hooks.js';
import layout from '../src/components/layout.js';
import inputs from '../src/components/inputs.js';
import {layoutWindow} from './helpers/layout-window.js';
const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
function fixture(t,author,Logic,prepare = () => {}) {
    const {window}=new JSDOM('<main id="gramlot-root"></main>');layoutWindow(window);
    const app=new Gramlot({document:window.document,transport:false,collections:[layout,inputs]});
    app.src.logicRegistry.register(Logic,{resource:'test:hooks'});
    app.src.logicRegistry.register(Logic,{resource:'test:qualified-hooks',group:'shared'});
    const builder=new GramlotBuilder(null,{collections:[layout,inputs]});author(builder.root);
    prepare(app);
    app.src.startSource(builder.toTytx());
    t.after(()=>{app.dispose();window.close();});
    return {app,window,root:app.src.source.getNode('main')};
}

test('dynamic tab onClose resolves Logic, preserves sync veto and never compiles text',async t=>{
    const calls=[];
    class Logic {close(node,context){calls.push({node,context});return !this.page.data.getItem('dirty');}}
    const {app,window,root}=fixture(t,r=>r.tabContainer({node_label:'tabs',id:'tabs'}),Logic);
    const tabs=root.value.getNode('tabs');
    tabs.builder.wrapSource(tabs).contentPane({node_label:'doc',title:'Document',closable:true,onClose:'close'});
    await settle();app.data.setItem('dirty',true);
    app.src.binding.inlineCompiler.compile=()=>{throw new Error('Named hook must not compile');};
    const close=window.document.getElementById('tabs').shadowRoot.querySelector('[aria-label="Close Document"]');
    close.click();assert.ok(tabs.value.getNode('doc'));assert.deepEqual(calls[0].context,{});
    app.data.setItem('dirty',false);close.click();assert.equal(tabs.value.getNode('doc'),null);
    assert.equal(calls.length,2);
});

test('drawer hook, button action, event and subscription share method recognition and preserve signatures',async t=>{
    const calls=[];
    class Logic {
        drawer(node,context){calls.push(['drawer',context.show,context.evt.type]);}
        action(node,context){calls.push(['action',context.event.type]);}
        event(node,event){calls.push(['event',event.type]);}
        message(node,payload){calls.push(['message',payload.text]);}
    }
    const {app,window,root}=fixture(t,r=>{
        const frame=r.borderContainer({node_label:'frame',id:'frame',height:'300px'});
        frame.contentPane({region:'left',width:'100px',drawer:'close',drawer_onclick:'shared.drawer'});
        frame.contentPane({region:'center'});
        r.div({node_label:'receiver',id:'receiver',connect_onclick:'event',selfsubscribe_notice:'message'});
    },Logic);
    await settle();
    app.src.binding.inlineCompiler.compile=()=>{throw new Error('Named hook must not compile');};
    root.builder.wrapSource(root).button('Run',{id:'run',action:'shared.action'});
    window.document.getElementById('run').click();
    const receiver=root.value.getNode('receiver');receiver.publish('notice',{text:'payload'});
    window.document.getElementById('receiver').dispatchEvent(new window.Event('click',{bubbles:true}));
    window.document.getElementById('frame').shadowRoot.querySelector('[aria-label="Open left region"]').click();
    assert.deepEqual(calls,[['action','click'],['message','payload'],['event','click'],['drawer',true,'click']]);
});

test('missing named hook does not fall back to inline; dynamically added inline code stays blocked',t=>{
    class Logic {}
    const {app,root}=fixture(t,r=>r.tabContainer({node_label:'tabs'}).contentPane({node_label:'node'}),Logic);
    const node=root.value.getNode('tabs.node');
    assert.throws(()=>invokeHook(app.src.binding,node,'onClose','missing',{}),/named logic 'missing' not found/);
    node.setAttr({onClose:'return true'});
    assert.throws(()=>invokeHook(app.src.binding,node,'onClose','return true',{}),/only as received with the Source/);
});

test('RPC lifecycle callbacks resolve simple Logic names with results and errors',async t=>{
    const calls=[];
    class Logic {
        before(node,context){calls.push(['before',context.trigger]);}
        after(node,context){calls.push(['after',context.result]);}
        failed(node,context){calls.push(['failed',context.error.message]);}
    }
    const {app}=fixture(t,r=>r.dataRpc({method:'load',trigger:'^trigger',_onCalling:'before',_onResult:'after',_onError:'failed'}),Logic);
    app.rpc.call=async()=>42;
    app.data.setItem('trigger',1);await settle();
    assert.deepEqual(calls,[['before',1],['after',42]]);
    app.rpc.call=async()=>{throw new Error('unavailable');};
    app.data.setItem('trigger',2);await settle();
    assert.deepEqual(calls.slice(2),[['before',2],['failed','unavailable']]);
});

test('remote completion hook resolves Logic without compiling the method name',async t=>{
    const calls=[];
    class Logic {mounted(node,context){calls.push(context.record);}}
    const {app}=fixture(t,r=>{r.dataSetter({destination_path:'record',value:7});r.div({remote:'details',remote_record:'^record',_onRemote:'mounted'});},Logic,app=>{
        app.src.remoteSource=async()=>true;
        app.src.binding.inlineCompiler.compile=()=>{throw new Error('Named hook must not compile');};
    });
    await settle();
    app.data.setItem('record',8);await settle();
    assert.deepEqual(calls,[7,8]);
});
