import {controlElement} from './bases.js';
import {defineComponent} from './registry.js';
import {Labelbox} from './labelbox.js';
import {FieldState} from './field-state.js';

let engineModule;
function MarkdownControl(MarkdownElement) {
    return class extends controlElement(MarkdownElement) {
        #value='';
        #generation=0;
        constructor() {
            super();
            this.control=this.ownerDocument.createElement('div');
            this.control.className='markdown-editor-control';
            this.controlBox.append(this.control);
            const style=this.ownerDocument.createElement('style');
            style.textContent=':host{display:block;height:400px;min-height:0}.control-box,.labelbox,.markdown-editor-control{height:100%;min-height:0}.labelbox{grid-template-rows:auto minmax(0,1fr)}.markdown-editor-control{overflow:hidden}.markdown-editor-status{font:inherit;color:var(--gramlot-text-secondary,GrayText)}.markdown-editor-status:empty{display:none}';
            this.shadowRoot.append(style);
            for (const type of ['input','change']) this.control.addEventListener(type,event=>{
                if (event.target!==this.control) event.stopImmediatePropagation();
            });
        }
        get liveWrites() {return true;}
        connectedCallback() {this.load();}
        load() {
            const generation=++this.#generation;
            this.engine?.destroy();this.engine=null;
            this.control.textContent='Loading Markdown editor…';
            this.ready=(engineModule ??= import('./prose-mirror-engine.js')).then(module=>{
                if (generation!==this.#generation || !this.isConnected) return;
                this.control.textContent='';
                this.engine=module.createMarkdownEditor(this);
            }).catch(error=>{
                if (generation!==this.#generation) return;
                this.control.textContent=`Markdown editor could not start: ${error.message}`;
                this.control.setAttribute('role','alert');
                throw error;
            });
            this.ready.catch(error=>console.error(error));
        }
        projectAttributes(attrs) {
            const rest=super.projectAttributes(attrs);
            this.control.disabled=this.parameters.disabled;
            this.control.readOnly=this.parameters.readonly;
            this.engine?.configure();
            return rest;
        }
        readControlValue() {return this.#value;}
        writeControlValue(value) {
            if (typeof value!=='string') throw new TypeError('Markdown editor value must be a string');
            if (value===this.#value) return;
            this.#value=value;
            if (this.isConnected && this.engine) this.load();
        }
        editorChanged(value) {
            this.#value=value;
            this.control.dispatchEvent(new this.ownerDocument.defaultView.Event('input',{bubbles:true}));
        }
        editorBlurred() {this.control.dispatchEvent(new this.ownerDocument.defaultView.Event('change',{bubbles:true}));}
        undo() {return this.engine ? this.engine.undo() : false;}
        redo() {return this.engine ? this.engine.redo() : false;}
        focus() {if (!this.parameters.disabled) this.engine?.focus();}
        releaseControl() {++this.#generation;this.engine?.destroy();this.engine=null;super.releaseControl();}
    };
}
MarkdownControl.parameters={disabled:{dtype:'B',default:false,binding:'read'},readonly:{dtype:'B',default:false,binding:'read'},live:{dtype:'B',default:true,binding:'read'}};
export const MarkdownEditor=defineComponent({name:'markdownEditor',tag:'gramlot-markdown-editor',base:MarkdownControl,mixins:[Labelbox,FieldState],
    parameters:{value:{dtype:'T',default:'',binding:'twoWay'}},implementation:Base=>class extends Base {}});
