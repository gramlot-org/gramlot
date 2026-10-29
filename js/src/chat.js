/** Shared chat behavior. Pages delegate their named Logic methods here. */
import {Bag} from '@genrojs/bag';
import {SourceBag, sourceTarget} from '@genrojs/builders';
import {GramlotBuilderBag} from './builder/source.js';
import {GramlotBuilder} from './builder/gramlot-builder.js';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {randomId} from './random-id.js';

const projections = new WeakMap();
const LABEL = /^m_[a-f0-9]+$/;

/** Reconcile message Source, preserving older fragments and their interactive Data. */
export function chatRender(page, node, {messages}) {
    if (!(messages instanceof Bag) || messages instanceof SourceBag) throw new TypeError('Chat messages require a Data Bag');
    const target = node.parentNode;
    const viewport = page.dom.getDomNode(target);
    if (!viewport) return;
    let state = projections.get(target);
    if (!state) {
        state = {rows:new Map(), active:true}; projections.set(target,state);
        page.src.renderer.onDispose(target, () => {
            state.active=false;
            for (const label of state.rows.keys()) target.getRelativeData('.messageData').popNode(label);
            state.rows.clear(); projections.delete(target);
        });
    }
    // Prepare all incoming content before changing the mounted conversation.
    const incoming = messages.getNodes();
    for (const message of incoming) {
        if (!LABEL.test(message.label) || !['user','assistant'].includes(message.attr.role)
                || typeof message.attr.author !== 'string'
                || !(typeof message.staticValue === 'string' || message.staticValue instanceof GramlotBuilderBag)) {
            throw new TypeError('Chat messages require a stable label, role, author and string or Gramlot Source');
        }
    }
    const follow = viewport.scrollHeight-viewport.clientHeight-viewport.scrollTop < 48;
    const plans = [];
    for (const message of incoming) {
        const old = state.rows.get(message.label);
        if (old && old.value === message.staticValue && old.role === message.attr.role && old.author === message.attr.author) continue;
        const fragment = new GramlotBuilder();
        const article = fragment.root.article({node_label:message.label,
            datapath:target.absDatapath('.messageData.'+message.label),'data-role':message.attr.role,
            'aria-label':message.attr.author});
        const body = sourceTarget(article.div());
        if (typeof message.staticValue === 'string') {
            fragment.wrapSource(body).div('=='+JSON.stringify(message.staticValue), {white_space:'pre-wrap'});
        } else {
            // Clone the typed fragment: never bind/move Source owned by the server Data Bag.
            body.setValue(page.src.prepareSource(message.staticValue.toTytx()));
        }
        const prepared = page.src.prepareSource(fragment.source);
        page.src.renderer.validateCandidate(prepared);
        plans.push({message,old,child:prepared.getNode(message.label)});
    }
    const labels = new Set(incoming.map(message=>message.label));
    for (const [label] of state.rows) if (!labels.has(label)) {
        target.value.popNode(label);
        target.getRelativeData('.messageData').popNode(label);
        state.rows.delete(label);
    }
    for (const {message,old,child} of plans) {
        if (old) target.value.popNode(message.label);
        if (!old) target.setRelativeData('.messageData.'+message.label,new Bag());
        // SourceBag insertion retains the same page renderer, bindings and Logic registry.
        page.src.builder.setChild(target.value,child.nodeTag,child.value,{...child.attr,node_label:message.label});
        state.rows.set(message.label,{value:message.staticValue,role:message.attr.role,author:message.attr.author});
    }
    if (follow) queueMicrotask(()=>{if(state.active) viewport.scrollTop=viewport.scrollHeight;});
}

function send(node, action, text=null) {
    if (node.getRelativeData('.pending') || node.getRelativeData('.picking') || !node.getRelativeData('.conversation.ready')) return;
    const id=randomId();
    node.SET('.requestId',id); node.SET('.pending',true); node.SET('.error','');
    // One atomic Data write; the normal binder carries it to the PageStore recipe.
    node.SET('.conversation.request',new Bag({id,action,text,attachments:fromTytx(toTytx(node.getRelativeData('.attachments')))}));
}
export function chatSend(page,node) {
    const text=node.getRelativeData('.draft');
    if(typeof text !== 'string' || (!text.trim() && !node.getRelativeData('.attachments').length)) return;
    send(node,'send',text);
}
export function chatReset(page,node) {send(node,'reset');}
export function chatCompleted(page,node,{response}) {
    if(response === null) return;
    if(!(response instanceof Bag)) throw new TypeError('Chat response requires a Data Bag');
    if(response.getItem('id') !== node.getRelativeData('.requestId')) return;
    if(response.getItem('accepted') && response.getItem('submitted') === node.getRelativeData('.draft')) node.SET('.draft','');
    if(response.getItem('accepted') && response.getItem('submitted') !== null) node.SET('.attachments',new Bag());
    node.SET('.pending',false);node.SET('.error',response.getItem('error'));
}


const composerLayouts = new WeakMap();
/** Shared geometry: grow with wrapped text and content, cap the editor, release observers. */
export function chatResize(page,node) {
    const source=node.parentNode;
    let layout=composerLayouts.get(source);
    if(!layout) {
        const body=page.dom.getDomNode(source);
        // Data setters can notify before mounting; _onBuilt installs the layout.
        if(!body)return;
        const composer=body.closest('[data-chat-composer]');
        const editor=body.querySelector('textarea');
        const top=composer.querySelector('[data-chat-top]');
        const toolbar=composer.querySelector('[data-chat-toolbar]');
        const win=body.ownerDocument.defaultView;
        let frame=0,active=true;
        const measure=()=>{
            frame=0;if(!active)return;
            editor.style.height='0px';
            const css=win.getComputedStyle(editor);
            const border=parseFloat(css.borderTopWidth)+parseFloat(css.borderBottomWidth);
            const height=Math.max(44,Math.min(180,editor.scrollHeight+border));
            editor.style.height=height+'px';
            editor.style.overflowY=editor.scrollHeight+border>height?'auto':'hidden';
            const total=Math.ceil(body.getBoundingClientRect().height+top.getBoundingClientRect().height+toolbar.getBoundingClientRect().height+2);
            if(node.getRelativeData('.composerHeight')!==total) node.SET('.composerHeight',total);
        };
        const schedule=()=>{if(active&&!frame)frame=win.requestAnimationFrame(measure);};
        const observer=new win.ResizeObserver(schedule);
        for(const element of [body,top,toolbar]) observer.observe(element);
        page.src.renderer.onDispose(source,()=>{active=false;observer.disconnect();if(frame)win.cancelAnimationFrame(frame);composerLayouts.delete(source);});
        layout={schedule};composerLayouts.set(source,layout);
    }
    layout.schedule();
}

const textExtensions=['txt','md','csv','json','py','js','ts','jsx','tsx','html','css','sql','yaml','yml','xml','sh','toml','log'];
const fileTypes={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',pdf:'application/pdf',...Object.fromEntries(textExtensions.map(ext=>[ext,'text/plain']))};
function readFile(file,win) {
    return new Promise((resolve,reject)=>{
        const reader=new win.FileReader();
        reader.onload=()=>resolve(reader.result.slice(reader.result.indexOf(',')+1));
        reader.onerror=()=>reject(new Error('Could not read the selected file.'));
        reader.readAsDataURL(file);
    });
}
export async function chatPickAttachments(page,node) {
    if(node.getRelativeData('.pending')||node.getRelativeData('.picking'))return;
    const doc=page.dom.getDomNode(node.parentNode).ownerDocument;
    const input=doc.createElement('input');input.type='file';input.multiple=true;
    input.accept=Object.keys(fileTypes).map(ext=>'.'+ext).join(',');
    input.style.display='none';doc.body.append(input);
    let active=true,finish;
    const release=page.src.renderer.onDispose(node.parentNode,()=>{active=false;input.remove();finish([]);});
    node.SET('.picking',true);node.SET('.error','');
    try {
        const files=await new Promise(resolve=>{
            finish=resolve;
            input.addEventListener('cancel',()=>resolve([]),{once:true});
            input.addEventListener('change',()=>resolve([...input.files]),{once:true});
            input.click();
        });
        if(!active||!files.length)return;
        const attachments=fromTytx(toTytx(node.getRelativeData('.attachments')));
        if(attachments.length+files.length>5)throw new Error('Choose at most 5 files.');
        let total=attachments.getNodes().reduce((n,file)=>n+file.staticValue.getItem('size'),0);
        for(const file of files) {
            const mediaType=fileTypes[file.name.split('.').pop().toLowerCase()];
            if(!mediaType)throw new Error('Supported files: PNG, JPEG, WebP, PDF and UTF-8 text/code.');
            const limit=mediaType==='text/plain'?1024*1024:2*1024*1024;
            total+=file.size;
            if(!file.size||file.size>limit||total>4*1024*1024)throw new Error('Limits: 2 MiB per file, 1 MiB for text, 4 MiB total.');
            const data=await readFile(file,doc.defaultView);
            if(mediaType==='text/plain') {
                const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));
                new TextDecoder('utf-8',{fatal:true}).decode(bytes);
                if(bytes.includes(0))throw new Error('The selected file is not UTF-8 text.');
            }
            attachments.setItem('a_'+randomId(),new Bag({name:file.name,mediaType,size:file.size,data}));
        }
        if(active)node.SET('.attachments',attachments);
    } catch(error) {if(active)node.SET('.error',error.message);}
    finally {release();input.remove();if(active)node.SET('.picking',false);}
}
export function chatRemoveAttachment(page,node) {
    if(!node.getRelativeData('.pending'))node.getRelativeData('.attachments').popNode(node.getAttr('attachment_id'));
}
export function chatRenderAttachments(page,node,{attachments}) {
    const target=node.parentNode;
    for(const child of [...target.value.getNodes()])if(child.label.startsWith('a_'))target.value.popNode(child.label);
    const builder=new GramlotBuilder();
    for(const attachment of attachments.getNodes()) {
        const file=attachment.staticValue;
        const item=builder.root.div({node_label:attachment.label,display:'flex',align_items:'center',gap:'6px',
            padding:'4px 8px',border:'1px solid var(--gramlot-border-control,#aaa)',border_radius:'10px',flex_shrink:0});
        if(file.getItem('mediaType').startsWith('image/')) item.img({src:'data:'+file.getItem('mediaType')+';base64,'+file.getItem('data'),
            alt:'Attachment preview',width:'36px',height:'36px',object_fit:'cover',border_radius:'6px'});
        item.span('=='+JSON.stringify(file.getItem('name')),{font_size:'12px',max_width:'180px',overflow:'hidden',text_overflow:'ellipsis',white_space:'nowrap'});
        item.button({icon:'×','aria-label':'Remove '+file.getItem('name'),disabled:'^.pending',class:'button--quiet'})
            .dataController({func:'chatRemoveAttachment',attachment_id:attachment.label});
    }
    const prepared=page.src.prepareSource(builder.source);
    page.src.renderer.validateCandidate(prepared);
    for(const child of prepared.getNodes())page.src.builder.setChild(target.value,child.nodeTag,child.value,{...child.attr,node_label:child.label});
}
