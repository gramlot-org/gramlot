import {defineComponent} from './registry.js';
import {projectParameters} from './parameters.js';

function PreviewElement(HTMLElement){
    return class extends HTMLElement {
        #revision=0;
        #timer;
        #compiler;
        #loading;
        #busy=false;
        #urls=[];
        constructor(){
            super();
            const root=this.attachShadow({mode:'open'}),doc=this.ownerDocument;
            const style=doc.createElement('style');
            style.textContent=`:host{display:block;height:100%;min-height:0;color:var(--gramlot-ink,CanvasText)}
                .preview{display:flex;flex-direction:column;height:100%;background:var(--gramlot-surface-subtle,Canvas)}
                .tools{display:flex;gap:16px;align-items:center;padding:8px 12px;font:inherit}
                a{color:var(--gramlot-brand-blue,LinkText);border-radius:var(--gramlot-radius-sm,4px);padding:4px 8px;text-decoration:none;white-space:nowrap}
                a:hover{background:var(--gramlot-selected-background,Highlight)}
                a:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight)}
                a[aria-disabled=true]{opacity:.45;pointer-events:none}
                .status{white-space:pre-wrap;font-size:.9em;overflow:auto;max-height:8em}
                .pages{flex:1;min-height:0;overflow:auto;padding:16px}
                img{display:block;width:100%;height:auto;background:white;box-shadow:0 2px 10px #0002}
                img[hidden]{display:none}`;
            const pane=doc.createElement('div');pane.className='preview';
            const tools=doc.createElement('div');tools.className='tools';
            this.download=doc.createElement('a');this.download.textContent='Download PDF';
            this.status=doc.createElement('span');this.status.className='status';this.status.setAttribute('role','status');
            const pages=doc.createElement('div');pages.className='pages';
            this.image=doc.createElement('img');this.image.alt='Typst document preview';this.image.hidden=true;
            pages.append(this.image);tools.append(this.download,this.status);pane.append(tools,pages);root.append(style,pane);
            this.#invalidate();
        }
        #invalidate(){
            this.download.removeAttribute('href');this.download.setAttribute('aria-disabled','true');this.download.tabIndex=-1;
            this.image.hidden=true;this.image.removeAttribute('src');
            for(const url of this.#urls)this.ownerDocument.defaultView.URL.revokeObjectURL(url);
            this.#urls=[];
        }
        connectedCallback(){this.#schedule();}
        disconnectedCallback(){
            ++this.#revision;clearTimeout(this.#timer);this.#compiler?.release();this.#compiler=null;
            this.#invalidate();
        }
        projectAttributes(attrs){
            const previous=this.parameters?.value,rest=projectParameters(this,attrs);
            this.download.download=this.parameters.filename;
            if(previous!==this.parameters.value){++this.#revision;this.#invalidate();this.#schedule();}
            return rest;
        }
        #schedule(){
            clearTimeout(this.#timer);
            if(!this.isConnected || !this.parameters)return;
            this.status.textContent='Preparing preview…';
            this.#timer=setTimeout(()=>{this.ready=this.#render();},350);
        }
        async #render(){
            if(this.#busy)return;
            const revision=this.#revision;
            this.#busy=true;
            try{
                this.#loading??=import('./typst-client.js');
                const module=await this.#loading;
                if(!this.isConnected || revision!==this.#revision)return;
                this.#compiler??=module.acquireCompiler();
                this.status.textContent='Compiling…';
                const result=await this.#compiler.compile(this.parameters.value);
                if(!this.isConnected || revision!==this.#revision)return;
                const {URL,Blob}=this.ownerDocument.defaultView;
                const svg=URL.createObjectURL(new Blob([result.svg],{type:'image/svg+xml'}));
                const pdf=URL.createObjectURL(new Blob([result.pdf],{type:'application/pdf'}));
                this.#urls=[svg,pdf];this.image.src=svg;this.image.hidden=false;
                this.download.href=pdf;this.download.setAttribute('aria-disabled','false');this.download.tabIndex=0;
                this.status.textContent=result.diagnostics.length ? result.diagnostics.join('\n') : 'Preview and PDF are up to date';
            }catch(error){
                if(this.isConnected && revision===this.#revision)this.status.textContent=error.message;
            }finally{
                this.#busy=false;
                if(this.isConnected && revision!==this.#revision)this.#schedule();
            }
        }
    };
}
export const TypstPreview=defineComponent({name:'typstPreview',tag:'gramlot-typst-preview',base:PreviewElement,
    parameters:{value:{dtype:'T',default:'',binding:'read'},filename:{dtype:'T',default:'document.pdf',binding:'read'}},
    implementation:Base=>class extends Base {}});
