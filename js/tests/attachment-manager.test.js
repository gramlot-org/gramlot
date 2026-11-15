import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {toTytx} from '@genrojs/tytx';
import {Gramlot,GramlotBuilder} from '../src/index.js';
import uploads from '../src/components/uploads.js';
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));

function setup(t) {
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    let sent=0;const calls=[],attachments=new Map();
    class Xhr extends window.EventTarget {
        constructor(){super();this.upload=new window.EventTarget();}
        open(){}setRequestHeader(){}
        send(){sent++;attachments.set('a1',{caption:'photo.txt',text:'<b>literal</b>'});this.status=200;
            this.responseText=toTytx({state:'completed',result:{attachmentId:'a1'}});queueMicrotask(()=>this.dispatchEvent(new window.Event('load')));}
        abort(){this.dispatchEvent(new window.Event('abort'));}
    }
    window.XMLHttpRequest=Xhr;
    const app=new Gramlot({document:window.document,transport:false,pageId:'page',uploadUrl:'/upload',capabilities:['upload'],collections:[uploads]});
    app.rpc.call=async(type,name,params)=>{
        calls.push({type,name,params});
        if(type==='upload')return {transferId:'transfer',authorization:'private'};
        if(name==='list_attachments'){const bag=new Bag();for(const [id,item] of attachments)bag.setItem(id,null,{caption:item.caption});return bag;}
        if(name==='read_attachment')return new Bag({kind:'text',text:attachments.get(params.selected).text,src:''});
        if(name==='remove_attachment'){attachments.delete(params.selected);return true;}
        throw new Error('unknown method');
    };
    app.data.setItem('form.queue',new Bag());app.data.setItem('form.context',new Bag({recordId:null}));app.data.setItem('form.ready',false);
    const b=new GramlotBuilder(null,{collections:[uploads]});
    b.root.div({datapath:'form'}).attachmentManager({id:'manager',operation:'receive',storepath:'.queue',contextPath:'.context',ready:'^.ready',
        listMethod:'list_attachments',readMethod:'read_attachment',removeMethod:'remove_attachment',selectedPath:'^.selectedUpload'});
    app.src.startSource(b.toTytx());
    const host=window.document.getElementById('manager');
    t.after(()=>{app.dispose();window.close();});
    return {window,app,host,calls,attachments,get sent(){return sent;}};
}

test('attachments queue before record save, then list, preview and remove using application context',async t=>{
    const f=setup(t),u=f.host.uploader;
    Object.defineProperty(u.input,'files',{value:[new f.window.File(['one'],'photo.txt',{type:'text/plain'})],configurable:true});
    u.input.dispatchEvent(new f.window.Event('change'));await tick();
    assert.equal(f.sent,0);assert.equal(f.calls.length,0);assert.equal(u.startButton.hidden,true);
    u.list.querySelector('button').click();assert.equal(f.app.data.getItem('form.selectedUpload'),f.app.data.getItem('form.queue').getNodes()[0].label);
    f.app.data.setItem('form.context.recordId','saved-123');f.app.data.setItem('form.ready',true);
    await tick();await tick();await tick();
    assert.equal(f.sent,1);
    const prepare=f.calls.find(call=>call.type==='upload');assert.deepEqual(prepare.params.metadata.context,{recordId:'saved-123'});
    assert.equal(f.host.list.children.length,1);
    f.host.list.querySelector('button').click();await tick();
    assert.equal(f.host.preview.querySelector('pre').textContent,'<b>literal</b>');
    assert.equal(f.host.preview.querySelector('b'),null);
    f.host.removeButton.click();await tick();await tick();
    assert.equal(f.attachments.size,0);assert.equal(f.host.list.children.length,0);
    assert.deepEqual(f.calls.find(call=>call.name==='remove_attachment').params,{context:{recordId:'saved-123'},selected:'a1'});
});

test('changing the record clears the old list and ignores a late list result',async t=>{
    const f=setup(t);let complete;
    f.app.rpc.call=async(type,name,params)=>{
        if(params.context.recordId==='first')return new Promise(resolve=>{complete=resolve;});
        const bag=new Bag();bag.setItem('second',null,{caption:'New record'});return bag;
    };
    f.app.data.setItem('form.context.recordId','first');f.app.data.setItem('form.ready',true);await tick();
    f.app.data.setItem('form.context.recordId','second');await tick();
    const stale=new Bag();stale.setItem('first',null,{caption:'Old record'});complete(stale);await tick();
    assert.match(f.host.list.textContent,/New record/);assert.doesNotMatch(f.host.list.textContent,/Old record/);
});


test('failed removal retains the selection and prevents duplicate requests',async t=>{
    const f=setup(t);let complete,removals=0;
    f.attachments.set('a1',{caption:'photo.txt',text:'literal'});
    const previous=f.app.rpc.call;
    f.app.rpc.call=async(type,name,params)=>name==='remove_attachment' ? (++removals,new Promise(resolve=>{complete=resolve;})) : previous(type,name,params);
    f.app.data.setItem('form.context.recordId','saved');f.app.data.setItem('form.ready',true);await tick();
    f.host.list.querySelector('button').click();await tick();
    f.host.removeButton.click();f.host.removeButton.click();assert.equal(removals,1);
    assert.equal(f.host.removeButton.disabled,true);complete(false);await tick();
    assert.match(f.host.message.textContent,/not removed/);assert.equal(f.host.removeButton.disabled,false);
    assert.equal(f.host.list.children.length,1);assert.equal(f.host.preview.querySelector('pre').textContent,'literal');
});

test('image preview uses application response and a list failure is visible',async t=>{
    const f=setup(t);f.attachments.set('a1',{caption:'image.png',text:'unused'});
    const previous=f.app.rpc.call;
    f.app.rpc.call=async(type,name,params)=>name==='read_attachment' ? new Bag({kind:'image',text:'',src:'data:image/png;base64,AA=='}) : previous(type,name,params);
    f.app.data.setItem('form.context.recordId','saved');f.app.data.setItem('form.ready',true);await tick();
    f.host.list.querySelector('button').click();await tick();
    assert.equal(f.host.preview.querySelector('img').getAttribute('src'),'data:image/png;base64,AA==');
    f.app.rpc.call=async()=>{throw new Error('Service offline');};
    f.app.data.setItem('form.context.recordId','other');await tick();
    assert.match(f.host.message.textContent,/Service offline/);assert.equal(f.host.list.children.length,0);
});


test('invalid context clears the previous record and prevents stale results',async t=>{
    const f=setup(t);f.attachments.set('a1',{caption:'private.txt',text:'old'});
    f.app.data.setItem('form.context.recordId','saved');f.app.data.setItem('form.ready',true);await tick();
    f.host.list.querySelector('button').click();await tick();
    f.app.data.setItem('form.context','invalid');await tick();
    assert.equal(f.host.list.children.length,0);assert.equal(f.host.preview.childNodes.length,0);
    assert.equal(f.host.removeButton.disabled,true);assert.match(f.host.message.textContent,/contextPath must resolve to a Bag/);
});

test('preview and upload-triggered list refresh can finish independently',async t=>{
    const f=setup(t);f.attachments.set('a1',{caption:'photo.txt',text:'literal'});
    let listCalls=0,finishList;const previous=f.app.rpc.call;
    f.app.rpc.call=async(type,name,params)=>{
        if(name==='list_attachments' && ++listCalls===2) return new Promise(resolve=>{finishList=resolve;});
        return previous(type,name,params);
    };
    f.app.data.setItem('form.context.recordId','saved');f.app.data.setItem('form.ready',true);await tick();
    const u=f.host.uploader;
    Object.defineProperty(u.input,'files',{value:[new f.window.File(['x'],'later.txt')],configurable:true});
    u.input.dispatchEvent(new f.window.Event('change'));await tick();await tick();
    assert.equal(typeof finishList,'function');
    f.host.list.querySelector('button').click();await tick();
    const updated=new Bag();updated.setItem('a1',null,{caption:'photo.txt'});updated.setItem('a2',null,{caption:'later.txt'});
    finishList(updated);await tick();await tick();
    assert.equal(f.host.list.children.length,2);assert.equal(f.host.preview.querySelector('pre').textContent,'<b>literal</b>');
});

test('a late preview cannot reappear after the selected attachment is removed',async t=>{
    const f=setup(t);f.attachments.set('a1',{caption:'photo.txt',text:'literal'});
    let finishPreview;const previous=f.app.rpc.call;
    f.app.rpc.call=async(type,name,params)=>name==='read_attachment' ? new Promise(resolve=>{finishPreview=resolve;}) : previous(type,name,params);
    f.app.data.setItem('form.context.recordId','saved');f.app.data.setItem('form.ready',true);await tick();
    f.host.list.querySelector('button').click();await tick();f.host.removeButton.click();await tick();await tick();
    finishPreview(new Bag({kind:'text',text:'old',src:''}));await tick();
    assert.equal(f.host.preview.childNodes.length,0);assert.equal(f.host.list.children.length,0);
});

test('attachment state lives in the private Data area of its node and survives DOM relocation',async t=>{
    const f=setup(t);f.attachments.set('a1',{caption:'note.txt',text:'retained preview'});
    f.app.data.setItem('form.context.recordId','saved');f.app.data.setItem('form.ready',true);await tick();
    f.host.list.querySelector('button').click();await tick();
    const source=f.app.src.renderer.elements.get(f.host).node;
    const path=source.workspaceDatapath;
    assert.match(path,/^_gramlot\.workspace\.attachmentManager_/);
    assert.equal(source.attachmentState,undefined);
    assert.equal(f.app.data.getItem(`${path}.selected`),'a1');
    assert.equal(f.app.data.getItem(`${path}.items`).getNode('a1').getAttr('caption'),'note.txt');
    assert.equal(f.app.data.getItem(`${path}.preview.text`),'retained preview');
    const destination=f.window.document.createElement('section');f.window.document.body.append(destination);
    destination.append(f.host);await tick();
    assert.equal(f.app.data.getItem(`${path}.selected`),'a1');
    assert.equal(f.host.list.querySelector('button').getAttribute('aria-pressed'),'true');
    assert.equal(f.host.preview.querySelector('pre').textContent,'retained preview');
});

test('the shared context is observed at its contextPath address, not through the whole Data',async t=>{
    const f=setup(t);f.attachments.set('a1',{caption:'one.txt',text:'one'});
    const router=f.app.src.renderer.binding.router;
    f.app.data.setItem('form.context.recordId','r1');f.app.data.setItem('form.ready',true);await tick();
    assert.equal(f.host.list.children.length,1);
    const lists=()=>f.calls.filter(call=>call.name==='list_attachments').length, before=lists();
    f.app.data.setItem('unrelated.value',1);await tick();
    assert.equal(lists(),before,'a change outside the context address does not reach the manager');
    f.app.data.setItem('form.context.recordId','r2');await tick();
    assert.equal(lists(),before+1);
    assert.deepEqual(f.calls.filter(call=>call.name==='list_attachments').at(-1).params,{context:{recordId:'r2'}});
    const size=router.size;f.host.remove();await tick();
    assert.equal(router.size,size-1,'removal closes the context registration');
});
