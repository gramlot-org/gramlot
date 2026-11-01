import {defineComponent} from './registry.js';
import {projectParameters} from './parameters.js';

function PreviewElement(HTMLElement) {
    return class extends HTMLElement {
        constructor() {
            super();
            const root=this.attachShadow({mode:'open'});
            const style=this.ownerDocument.createElement('style');
            style.textContent=':host{display:block;height:100%;min-height:0}iframe{display:block;width:100%;height:100%;border:0;background:white}';
            this.frame=this.ownerDocument.createElement('iframe');
            this.frame.setAttribute('sandbox','');
            this.frame.title='HTML preview';
            root.append(style,this.frame);
        }
        renderDocument(value) {return value;}
        render() {
            const html=this.renderDocument(this.parameters.value);
            if (this.frame.srcdoc !== html) this.frame.srcdoc=html;
        }
        projectAttributes(attrs) {
            const rest=projectParameters(this,attrs);
            this.render();
            return rest;
        }
    };
}
export const HtmlPreview=defineComponent({name:'htmlPreview',tag:'gramlot-html-preview',base:PreviewElement,
    parameters:{value:{dtype:'T',default:'',binding:'read'}},implementation:Base=>class extends Base {}});

export const MarkdownPreview=defineComponent({name:'markdownPreview',tag:'gramlot-markdown-preview',base:PreviewElement,
    parameters:{value:{dtype:'T',default:'',binding:'read'},allowHtml:{dtype:'B',default:false,binding:'read'}},implementation:Base=>class extends Base {
        #renderDocument;
        constructor(){super();this.frame.title='Markdown preview';}
        connectedCallback(){this.render();}
        render() {
            if (this.#renderDocument) {super.render();return;}
            if (this.ready) return;
            this.ready=import('./markdown-document.js').then(module=>{
                this.#renderDocument=module.renderMarkdownDocument;
                if(this.isConnected) this.render();
            });
            this.ready.catch(error=>console.error(error));
        }
        renderDocument(value){return this.#renderDocument(value,{allowHtml:this.parameters.allowHtml,document:this.ownerDocument});}
    }});
