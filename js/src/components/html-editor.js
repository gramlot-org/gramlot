import {controlElement} from './bases.js';
import {defineComponent} from './registry.js';
import {Labelbox} from './labelbox.js';
import {FieldState} from './field-state.js';

let engineModule;
function HtmlControl(HTMLElement) {
    return class extends controlElement(HTMLElement) {
        #value='';
        #generation=0;
        constructor() {
            super();
            this.control=this.ownerDocument.createElement('div');
            this.control.className='html-editor-control';
            this.controlBox.append(this.control);
            const style=this.ownerDocument.createElement('style');
            style.textContent=':host{display:block;height:400px;min-height:0}.control-box,.html-editor-control{height:100%;min-height:0}.html-editor-control{overflow:hidden}.html-editor-status{font:inherit;color:var(--gramlot-text-secondary,GrayText)}.html-editor-status:empty{display:none}';
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
            this.control.textContent='Loading HTML editor…';
            this.ready=(engineModule ??= import('./jodit-engine.js')).then(module=>{
                if (generation!==this.#generation || !this.isConnected) return;
                this.control.textContent='';
                this.engine=module.createHtmlEditor(this);
            }).catch(error=>{
                if (generation!==this.#generation) return;
                this.control.textContent=`HTML editor could not start: ${error.message}`;
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
            if (typeof value!=='string') throw new TypeError('HTML editor value must be a string');
            if (value===this.#value) return;
            this.#value=value;
            this.engine?.replace(value);
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
HtmlControl.parameters={disabled:{dtype:'B',default:false,binding:'read'},readonly:{dtype:'B',default:false,binding:'read'},live:{dtype:'B',default:true,binding:'read'}};
export const HtmlEditor=defineComponent({name:'htmlEditor',tag:'gramlot-html-editor',base:HtmlControl,mixins:[Labelbox,FieldState],
    parameters:{value:{dtype:'T',default:'',binding:'twoWay'}},implementation:Base=>class extends Base {}});
