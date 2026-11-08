/** Application-owned attachment operations, composed with the shared upload queue. */
import {Bag} from '@gramlot/gramlot';
import {toTytx} from '@genrojs/tytx';
import {defineComponent} from './registry.js';
import {Container} from './container.js';
import {readUploadContext} from './upload-engine.js';
import {randomId} from '../random-id.js';

export const AttachmentManager = defineComponent({
    name:'attachmentManager', tag:'gramlot-attachment-manager', base:Container, sourceContext:true,
    parameters:{operation:{dtype:'T'},storepath:{dtype:'T'},contextPath:{dtype:'T'},
        ready:{dtype:'B',default:false,binding:'read'},listMethod:{dtype:'T'},readMethod:{dtype:'T'},removeMethod:{dtype:'T'},
        accept:{dtype:'T',default:'',binding:'read'},disabled:{dtype:'B',default:false,binding:'read'},
        selectedPath:{dtype:'T',nullable:true,default:null,binding:'twoWay'}},
    implementation: Base => class extends Base {
        #context; #subscription; #generation=0; #listSequence=0; #previewSequence=0; #disposed=false; #removeToken=null;
        get #state() { return this.#context.sourceNode.attachmentState; }
        get #contextKey() { return this.#state.getItem('contextKey'); }
        set #contextKey(value) { this.#state.setItem('contextKey', value); }
        get #selected() { return this.#state.getItem('selected'); }
        set #selected(value) { this.#state.setItem('selected', value); }
        get #list() { return this.#state.getItem('items'); }
        set #list(value) { this.#state.setItem('items', value); }
        constructor() {
            super(); this.control.replaceChildren(); const doc=this.ownerDocument;
            const style=doc.createElement('style');
            style.textContent=':host{display:block} .attachments{display:grid;gap:.75em} .attachment-list{padding-inline-start:1.2em} .preview img{max-width:100%;max-height:240px} button{font:inherit}';
            const box=doc.createElement('div'); box.className='attachments';
            this.uploader=doc.createElement('gramlot-uploader');
            const heading=doc.createElement('strong'); heading.textContent='Attachments';
            this.list=doc.createElement('ul'); this.list.className='attachment-list'; this.list.setAttribute('aria-label','Attachments');
            this.preview=doc.createElement('div'); this.preview.className='preview'; this.preview.setAttribute('aria-label','Attachment preview');
            this.removeButton=doc.createElement('button'); this.removeButton.type='button'; this.removeButton.textContent='Remove attachment';
            this.message=doc.createElement('div'); this.message.setAttribute('role','status');
            box.append(this.uploader,heading,this.list,this.preview,this.removeButton,this.message); this.control.append(box); this.shadowRoot.append(style);
            this.removeButton.addEventListener('click',()=>void this.#remove());
        }
        setSourceContext(context) {
            this.#context=context;
            if (!context.sourceNode.attachmentState) {
                Object.defineProperty(context.sourceNode, 'attachmentState', {value:new Bag({
                    contextKey:null, selected:null, items:new Bag(), preview:null, message:''
                }), configurable:true});
            }
            this.#message(this.#state.getItem('message'));
            this.#renderPreview();
            this.uploader.setSourceContext({...context,callLogic:()=>this.#refresh()});
        }
        projectAttributes(attrs,adapt) {
            const rest=super.projectAttributes(attrs,adapt), p=this.parameters;
            for (const name of ['operation','contextPath','listMethod','readMethod','removeMethod']) {
                if (typeof p[name] !== 'string' || !p[name]) throw new TypeError(`attachmentManager requires ${name}`);
            }
            this.uploader.projectAttributes({operation:p.operation,storepath:p.storepath,contextPath:p.contextPath,
                accept:p.accept,multiple:true,autoUpload:Boolean(p.ready),manualUpload:false,disabled:p.disabled,
                selectedPath:p.selectedPath,onComplete:'attachmentComplete'},adapt);
            this.#syncContext(); this.#render(); return rest;
        }
        connectedCallback() {
            this.#disposed=false;
            if (this.#context && !this.#subscription) {
                const {gramlot}=this.#context.upload(); this.#subscription=`attachment-manager-${randomId()}`;
                gramlot.data.subscribe(this.#subscription,{any:()=>this.#syncContext()});
            }
            this.#syncContext();
        }
        disconnectedCallback() {
            // DOM relocation into a floating keeps the same Source owner and resources.
            this.ownerDocument.defaultView.queueMicrotask(() => {
                if (this.isConnected) return;
                this.#disposed=true; this.#generation++;
                if (this.#subscription) { this.#context.upload().gramlot.data.unsubscribe(this.#subscription,{any:true}); this.#subscription=null; }
            });
        }
        #message(value) { this.#state.setItem('message',value); this.message.textContent=value; }
        #renderPreview() {
            this.preview.replaceChildren();
            const result=this.#state.getItem('preview');
            if (!result) return;
            if (result.getItem('kind') === 'image') {
                const image=this.ownerDocument.createElement('img'); image.src=result.getItem('src');
                image.alt='Attachment preview'; this.preview.append(image);
            } else {
                const pre=this.ownerDocument.createElement('pre'); pre.textContent=result.getItem('text'); this.preview.append(pre);
            }
        }
        #value() { return readUploadContext(this.#context.sourceNode,this.parameters.contextPath); }
        #syncContext() {
            if (!this.parameters || !this.#context || !this.isConnected || this.#disposed) return;
            if (!this.parameters.ready) {
                if (this.#contextKey !== null) { this.#contextKey=null; this.#generation++; this.#removeToken=null; this.#selected=null; this.#list=new Bag(); this.#state.setItem('preview',null); this.#renderPreview(); this.#render(); }
                return;
            }
            try {
                const context=this.#value(), key=toTytx(context);
                if (key !== this.#contextKey) { this.#contextKey=key; this.#generation++; this.#removeToken=null; this.#selected=null; this.#list=new Bag(); this.#state.setItem('preview',null); this.#renderPreview(); this.#render(); void this.#refresh(); }
            } catch (error) {
                if (this.#contextKey !== null) {
                    this.#contextKey=null; this.#generation++; this.#removeToken=null; this.#selected=null;
                    this.#list=new Bag(); this.#state.setItem('preview',null); this.#renderPreview(); this.#render();
                }
                this.#message(error.message);
            }
        }
        async #refresh() {
            if (!this.parameters.ready || this.#disposed || !this.isConnected) return;
            const generation=this.#generation, sequence=++this.#listSequence;
            try {
                const result=await this.#context.upload().gramlot.rpc.call('data',this.parameters.listMethod,{context:this.#value()});
                if (generation !== this.#generation || sequence !== this.#listSequence || this.#disposed) return;
                if (!(result instanceof Bag)) throw new TypeError('Attachment list must be a Bag');
                for (const node of result.getNodes()) if (typeof node.getAttr('caption') !== 'string') throw new TypeError('Attachment caption must be text');
                this.#list=result;
                if (this.#selected && !this.#list.getNode(this.#selected)) { this.#selected=null; this.#previewSequence++; this.#state.setItem('preview',null); this.#renderPreview(); }
                this.#message(''); this.#render();
            } catch (error) { if (generation === this.#generation && sequence === this.#listSequence && !this.#disposed) this.#message(`Attachments: ${error.message}`); }
        }
        #render() {
            if (!this.parameters || !this.#context) return;
            this.list.replaceChildren();
            for (const node of this.#list.getNodes()) {
                const item=this.ownerDocument.createElement('li'), button=this.ownerDocument.createElement('button');
                button.type='button'; button.textContent=node.getAttr('caption'); button.setAttribute('aria-pressed',String(node.label===this.#selected));
                button.disabled=Boolean(this.parameters.disabled || !this.parameters.ready || this.#removeToken);
                button.addEventListener('click',()=>void this.#read(node.label)); item.append(button); this.list.append(item);
            }
            this.removeButton.disabled=Boolean(this.parameters.disabled || !this.parameters.ready || !this.#selected || this.#removeToken);
        }
        async #read(selected) {
            if (!this.parameters.ready || this.parameters.disabled) return;
            this.#selected=selected; this.#render(); this.#state.setItem('preview',null); this.#renderPreview(); const generation=this.#generation, sequence=++this.#previewSequence;
            try {
                const result=await this.#context.upload().gramlot.rpc.call('data',this.parameters.readMethod,{context:this.#value(),selected});
                if (generation !== this.#generation || sequence !== this.#previewSequence || this.#disposed) return;
                if (!(result instanceof Bag)) throw new TypeError('Attachment preview must be a Bag');
                const kind=result.getItem('kind'), text=result.getItem('text'), src=result.getItem('src');
                if (!((kind === 'image' && typeof src === 'string' && src) ||
                    (['text','message'].includes(kind) && typeof text === 'string'))) throw new TypeError('Invalid attachment preview');
                this.#state.setItem('preview',result); this.#renderPreview();
                this.#message('');
            } catch (error) { if (generation === this.#generation && sequence === this.#previewSequence && !this.#disposed) this.#message(`Preview: ${error.message}`); }
        }
        async #remove() {
            if (!this.#selected || !this.parameters.ready || this.parameters.disabled || this.#removeToken) return;
            const selected=this.#selected, generation=this.#generation, token=this.#removeToken={};
            this.#previewSequence++; this.#render();
            try {
                const removed=await this.#context.upload().gramlot.rpc.call('data',this.parameters.removeMethod,{context:this.#value(),selected});
                if (generation !== this.#generation || this.#disposed) return;
                if (removed !== true) throw new Error('Attachment was not removed');
                this.#selected=null; this.#state.setItem('preview',null); this.#renderPreview(); await this.#refresh();
            } catch (error) { if (generation === this.#generation && !this.#disposed) this.#message(`Remove: ${error.message}`); }
            finally { if (this.#removeToken === token) { this.#removeToken=null; this.#render(); } }
        }
    }
});
