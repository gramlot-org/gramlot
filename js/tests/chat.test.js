import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, Bag, chatRender, chatSend, chatCompleted, chatReset, chatPickAttachments} from '../src/index.js';
import chat from '../src/components/chat.js';
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
function fixture() {
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    const app=new Gramlot({document:window.document,transport:false,collections:[chat]});
    class Logic {
        render(node,params){chatRender(this.page,node,params);}
        increment(node){node.SET('.count',node.getRelativeData('.count')+1);}
    }
    app.src.logicRegistry.register(Logic,{resource:'chat-test'});
    const builder=new GramlotBuilder(null,{collections:[chat]});
    const root=builder.root.div({datapath:'chat'});
    root.dataSetter({value:new Bag(),destination_path:'.attachments'});root.dataSetter({value:new Bag(),destination_path:'.messages'});root.dataSetter({value:new Bag(),destination_path:'.messageData'});
    const log=root.chatMessages({node_label:'log',id:'log'});
    log.dataController({func:'render',messages:'^.messages',_onBuilt:true});
    app.src.startSource(builder.toTytx());
    return {app,window,log:window.document.getElementById('log'),messages:app.data.getItem('chat.messages')};
}
function fragment() {
    const b=new GramlotBuilder();
    b.root.dataSetter({value:0,destination_path:'.count'});
    b.root.button('Increment').dataController({func:'increment'});
    b.root.span('^.count',{'data-count':'yes'});
    b.root.input({value:'^.note','aria-label':'Note'});
    return b.source;
}
test('Source messages have independent data, Page controllers and stable DOM on append',async()=>{
    const {app,window,log,messages}=fixture();
    messages.setItem('m_a',fragment(),{role:'assistant',author:'Assistant'});
    const first=log.querySelector('article');
    assert.ok(first,window.document.body.textContent);first.querySelector('gramlot-button').control.click();
    assert.equal(first.querySelector('[data-count]').textContent,'1');
    messages.setItem('m_b',fragment(),{role:'assistant',author:'Assistant'});
    assert.equal(log.querySelector('article'),first);
    assert.deepEqual([...log.querySelectorAll('[data-count]')].map(n=>n.textContent),['1','0']);
    assert.equal(app.data.getItem('chat.messageData.m_a.count'),1);
    assert.equal(app.data.getItem('chat.messageData.m_b.count'),0);
    messages.popNode('m_a');
    assert.equal(app.data.getNode('chat.messageData.m_a'),null);
    assert.equal(log.querySelectorAll('article').length,1);
    app.data.setItem('chat.messages',new Bag());
    assert.equal(log.querySelectorAll('article').length,0);
    assert.equal(app.data.getItem('chat.messageData').getNodes().length,0);
    await tick();app.dispose();
});
test('strings remain literal, incoming Source stays in Data and removal releases bindings',()=>{
    const {app,log,messages}=fixture();
    messages.setItem('m_a','^secret <img src=x>',{role:'user',author:'You'});
    assert.ok(log.textContent.includes('^secret <img src=x>'));assert.equal(log.querySelector('img'),null);
    const source=fragment();messages.setItem('m_b',source,{role:'assistant',author:'Assistant'});
    assert.equal(messages.getItem('m_b'),source);
    const button=log.querySelector('gramlot-button');
    app.src.source.popNode('main');
    assert.equal(app.data.getItem('chat.messageData').getNodes().length,0);
    button.control.click();assert.equal(app.data.getNode('chat.messageData.m_b'),null);
    app.dispose();
});
test('requests use Data only; completion correlates IDs and preserves a newer draft',()=>{
    const {app}=fixture();
    const node=app.src.source.getNode('main').value.getNodes()[0];
    app.data.setItem('chat.conversation',new Bag({ready:true,response:null,request:null,feedback:''}));
    app.data.setItem('chat.draft','first');app.data.setItem('chat.pending',false);
    app.publish=()=>{throw new Error('Chat must use its binder');};
    chatSend(app,node);
    const request=app.data.getItem('chat.conversation.request');
    assert.equal(request.getItem('text'),'first');assert.equal(request.getItem('action'),'send');
    chatSend(app,node);assert.equal(app.data.getItem('chat.conversation.request'),request);
    app.data.setItem('chat.draft','newer');
    chatCompleted(app,node,{response:new Bag({id:'old',accepted:true,submitted:'first',error:''})});
    assert.equal(app.data.getItem('chat.pending'),true);
    chatCompleted(app,node,{response:new Bag({id:request.getItem('id'),accepted:true,submitted:'first',error:''})});
    assert.equal(app.data.getItem('chat.pending'),false);assert.equal(app.data.getItem('chat.draft'),'newer');
    chatReset(app,node);const reset=app.data.getItem('chat.conversation.request');
    assert.equal(reset.getItem('action'),'reset');assert.notEqual(reset.getItem('id'),request.getItem('id'));
    app.dispose();
});
test('failed response retains draft; success clears only submitted text; unready does not send',()=>{
    const {app}=fixture();const node=app.src.source.getNode('main').value.getNodes()[0];
    app.data.setItem('chat.conversation',new Bag({ready:false,response:null,request:null,feedback:''}));
    app.data.setItem('chat.draft','retry');chatSend(app,node);
    assert.equal(app.data.getItem('chat.conversation.request'),null);
    app.data.setItem('chat.conversation.ready',true);chatSend(app,node);
    chatCompleted(app,node,{response:new Bag({id:app.data.getItem('chat.requestId'),accepted:false,submitted:'retry',error:'Failed'})});
    assert.equal(app.data.getItem('chat.draft'),'retry');assert.equal(app.data.getItem('chat.pending'),false);
    chatSend(app,node);
    chatCompleted(app,node,{response:new Bag({id:app.data.getItem('chat.requestId'),accepted:true,submitted:'retry',error:''})});
    assert.equal(app.data.getItem('chat.draft'),'');app.dispose();
});
test('feedback replaces a bound status without rebuilding messages or scrolling',async()=>{
    const {app,log,messages}=fixture();
    const parent=app.src.source.getNode('main');
    app.data.setItem('chat.conversation',new Bag({feedback:''}));
    app.src.builder.setChild(parent.value,'div','^.conversation.feedback',{node_label:'feedback',datapath:'chat',role:'status'});
    messages.setItem('m_a',fragment(),{role:'assistant',author:'Assistant'});await tick();
    const article=log.querySelector('article');log.scrollTop=25;
    app.data.setItem('chat.conversation.feedback','Working');
    app.data.setItem('chat.conversation.feedback','Finishing');await tick();
    assert.equal(log.ownerDocument.querySelector('[role="status"]').textContent,'Finishing');
    assert.equal(log.querySelector('article'),article);assert.equal(log.scrollTop,25);
    app.data.setItem('chat.conversation.feedback','');await tick();
    assert.equal(log.ownerDocument.querySelector('[role="status"]').textContent,'');
    app.dispose();
});
test('scroll follows only when already at the bottom',async()=>{
    const {app,log,messages}=fixture();
    Object.defineProperty(log,'clientHeight',{value:100});Object.defineProperty(log,'scrollHeight',{value:500});
    log.scrollTop=400;messages.setItem('m_a','one',{role:'user',author:'You'});await tick();
    assert.equal(log.scrollTop,500);
    log.scrollTop=25;messages.setItem('m_b','two',{role:'assistant',author:'Assistant'});await tick();
    assert.equal(log.scrollTop,25);app.dispose();
});

test('attachment-only requests snapshot data, retain failed drafts and clear accepted files',()=>{
    const {app}=fixture();const node=app.src.source.getNode('main').value.getNodes()[0];
    const files=new Bag({a_one:new Bag({name:'note.txt',mediaType:'text/plain',size:3,data:'YWJj'})});
    app.data.setItem('chat.attachments',files);app.data.setItem('chat.draft','');
    app.data.setItem('chat.conversation',new Bag({ready:true,request:null}));
    app.data.setItem('chat.picking',true);chatSend(app,node);
    assert.equal(app.data.getItem('chat.conversation.request'),null);
    app.data.setItem('chat.picking',false);chatSend(app,node);
    const request=app.data.getItem('chat.conversation.request');
    assert.equal(request.getItem('text'),'');assert.notEqual(request.getItem('attachments'),files);
    assert.equal(request.getItem('attachments.a_one.data'),'YWJj');
    chatCompleted(app,node,{response:new Bag({id:request.getItem('id'),accepted:false,submitted:'',error:'Failed'})});
    assert.equal(app.data.getItem('chat.attachments'),files);
    chatReset(app,node);
    chatCompleted(app,node,{response:new Bag({id:app.data.getItem('chat.requestId'),accepted:true,submitted:null,error:''})});
    assert.equal(app.data.getItem('chat.attachments'),files);
    chatSend(app,node);
    chatCompleted(app,node,{response:new Bag({id:app.data.getItem('chat.requestId'),accepted:true,submitted:'',error:''})});
    assert.equal(app.data.getItem('chat.attachments').length,0);app.dispose();
});

test('file chooser uses mounted Source lifecycle, validates text, handles cancel and disposal',async()=>{
    const {app,window}=fixture();
    const scope=app.src.source.getNode('main').value.getNodes()[0];
    const controller=scope.value.getNodes().find(n=>n.nodeTag==='chatMessages').value.getNodes()[0];
    let selected=[new window.File(['hello'],'note.txt',{type:'text/plain'})];
    window.HTMLInputElement.prototype.click=function(){
        Object.defineProperty(this,'files',{value:selected});
        this.dispatchEvent(new window.Event(selected.length?'change':'cancel'));
    };
    await chatPickAttachments(app,controller);
    const file=app.data.getItem('chat.attachments').getNodes()[0].staticValue;
    assert.equal(file.getItem('data'),'aGVsbG8=');assert.equal(file.getItem('size'),5);
    assert.equal(app.data.getItem('chat.picking'),false);
    selected=[];await chatPickAttachments(app,controller);
    assert.equal(app.data.getItem('chat.attachments').length,1);
    selected=[new window.File([new Uint8Array([255,0])],'binary.txt')];
    await chatPickAttachments(app,controller);
    assert.equal(app.data.getItem('chat.attachments').length,1);
    assert.ok(app.data.getItem('chat.error'));assert.equal(window.document.querySelector('input[type=file]'),null);
    selected=[new window.File([new Uint8Array(2*1024*1024+1)],'large.pdf')];
    await chatPickAttachments(app,controller);
    assert.match(app.data.getItem('chat.error'),/Limits/);
    selected=Array.from({length:5},()=>new window.File(['ok'],'note.txt'));
    await chatPickAttachments(app,controller);
    assert.match(app.data.getItem('chat.error'),/at most 5/);
    assert.equal(app.data.getItem('chat.attachments').length,1);
    window.HTMLInputElement.prototype.click=function(){};
    const waiting=chatPickAttachments(app,controller);app.src.source.popNode('main');await waiting;
    assert.equal(window.document.querySelector('input[type=file]'),null);app.dispose();
});
