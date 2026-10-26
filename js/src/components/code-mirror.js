import {controlElement} from './bases.js';
import {defineComponent} from './registry.js';
import {Labelbox} from './labelbox.js';
import {FieldState} from './field-state.js';

const languages = ['text', 'python', 'javascript', 'typescript', 'json', 'html', 'css', 'xml', 'markdown', 'sql', 'typst'];
let engineModule;
function EditorControl(HTMLElement) {
    return class extends controlElement(HTMLElement) {
        #value = '';
        #generation = 0;
        constructor() {
            super();
            this.control = this.ownerDocument.createElement('div');
            this.control.id = 'control'; this.control.className = 'editor-control';
            this.controlBox.append(this.control);
            const style = this.ownerDocument.createElement('style');
            style.textContent = `:host{display:block;height:300px;min-height:0;min-width:0}
                .control-box,.editor-control{height:100%;min-height:0;min-width:0}
                .editor-control{border:1px solid var(--gramlot-border-control,GrayText);border-radius:var(--gramlot-radius-sm,4px);overflow:hidden}
                :host([data-editor-disabled]) .editor-control{opacity:.6}
                .editor-status{padding:1em;color:var(--gramlot-text-secondary,GrayText)}`;
            this.shadowRoot.append(style);
            // Engine transactions emit one normalized control event. Native contenteditable
            // input events must not produce a second binding write.
            for (const type of ['input','change']) this.control.addEventListener(type, event => {
                if (event.target !== this.control) event.stopImmediatePropagation();
            });
            this.control.addEventListener('focusout', () => this.#emit('change'));
        }
        get liveWrites() { return true; }
        connectedCallback() {
            const generation = ++this.#generation;
            this.control.textContent = 'Loading editor…';
            this.ready = (engineModule ??= import('./code-mirror-engine.js')).then(module => {
                if (generation !== this.#generation || !this.isConnected) return;
                this.control.textContent = '';
                this.editor = module.createEditor(this);
                this.editor.publishHistory();
            }).catch(error => {
                if (generation !== this.#generation) return;
                this.control.textContent = `CodeMirror could not start: ${error.message}`;
                this.control.setAttribute('role','alert');
                throw error;
            });
            // Keep the rejected ready promise inspectable without an unhandled rejection.
            this.ready.catch(error => console.error(error));
        }
        releaseControl() { ++this.#generation; this.editor?.destroy(); this.editor = null; super.releaseControl(); }
        projectAttributes(attrs) {
            const rest = super.projectAttributes(attrs), p = this.parameters;
            if (!languages.includes(p.language)) throw new TypeError(`Unsupported CodeMirror language: ${p.language}`);
            if (!Number.isInteger(p.indentUnit) || p.indentUnit < 1 || p.indentUnit > 16) throw new TypeError('indentUnit must be an integer from 1 to 16');
            if (!Number.isFinite(p.fontSize) || p.fontSize < 8 || p.fontSize > 48) throw new TypeError('fontSize must be from 8 to 48');
            this.control.disabled = p.disabled; this.control.readOnly = p.readonly;
            this.toggleAttribute('data-editor-disabled', p.disabled);
            this.control.style.fontFamily = p.fontFamily; this.control.style.fontSize = `${p.fontSize}px`;
            this.editor?.configure();
            return rest;
        }
        #emit(type) {this.control.dispatchEvent(new this.ownerDocument.defaultView.Event(type, {bubbles:true}));}
        editorChanged(value) {this.#value = value; this.#emit('input');}
        readControlValue() {return this.#value;}
        writeControlValue(value) {
            if (typeof value !== 'string') throw new TypeError('CodeMirror value must be a string');
            if (value === this.#value) return;
            this.#value = value; this.editor?.replace(value);
        }
        focus() {if (!this.parameters.disabled) this.editor?.view.focus();}
        setDiagnostics(items) {this.editor.diagnostics(items);}
        revealPosition(position) {this.editor.reveal(position);}
        undo() {return this.editor ? this.editor.undo() : false;}
        redo() {return this.editor ? this.editor.redo() : false;}
    };
}
EditorControl.parameters = {
    disabled:{dtype:'B', default:false, binding:'read'}, readonly:{dtype:'B', default:false, binding:'read'},
    live:{dtype:'B', default:true, binding:'read'}
};
const toggle = {dtype:'B', default:true, binding:'read'};
export const CodeMirror = defineComponent({name:'codeMirror', tag:'gramlot-code-mirror', base:EditorControl, mixins:[Labelbox,FieldState],
    parameters:{value:{dtype:'T', default:'', binding:'twoWay'}, language:{dtype:'T', default:'text', binding:'read', enum:languages},
        lineNumbers:toggle, lineWrapping:toggle, indentUnit:{dtype:'L',default:4,binding:'read'},
        fontSize:{dtype:'L',default:14,binding:'read'}, fontFamily:{dtype:'T',default:'monospace',binding:'read'},
        folding:toggle, bracketMatching:toggle, autoCloseBrackets:toggle, autoIndent:toggle, autocompletion:toggle, highlightActiveLine:toggle, highlightSelectionMatches:toggle},
    implementation:Base => class extends Base {}
});
