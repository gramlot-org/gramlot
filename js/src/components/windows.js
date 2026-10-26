/** Source-owned window adapter over the shared window presentation. */
import {defineComponent} from './registry.js';
import {projectParameters} from './parameters.js';
import {labelboxContent} from '../view/labelbox.js';
import {WindowSurface} from './window-surface.js';

function WindowShell(HTMLElement) {
    return class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({mode:'open'});
            const style = this.ownerDocument.createElement('style');
            style.textContent = ':host{display:contents;font:inherit;color:var(--gramlot-ink,CanvasText)}';
            const root = this.ownerDocument.createElement('div');
            shadow.append(style, root);
            this.surface = new WindowSurface(this, root, {modal:this.constructor.gramlotComponent.name === 'dialog',
                validateContent:() => {
                    if (this.children.length !== 1 || labelboxContent(this.firstElementChild).localName !== 'gramlot-frame-pane') {
                        throw new TypeError('A window requires exactly one framePane child');
                    }
                }});
        }
        get shell() { return this.surface.shell; }
        get titlebar() { return this.surface.titlebar; }
        get heading() { return this.surface.heading; }
        get body() { return this.surface.body; }
        get status() { return this.surface.status; }
        get closeButton() { return this.surface.closeButton; }
        get collapseButton() { return this.surface.collapseButton; }
        get maximizeButton() { return this.surface.maximizeButton; }
        get resizeButton() { return this.surface.resizeButton; }
        get modal() { return this.surface.modal; }
        get opened() { return this.surface.opened; }
        setSourceContext(context) { this.surface.setSourceContext(context); }
        connectedCallback() { this.surface.connect(); }
        disconnectedCallback() { this.surface.disconnect(); }
        projectAttributes(attrs) {
            const rest = projectParameters(this, attrs);
            this.surface.configure(this.parameters);
            return rest;
        }
        requestClose(reason) { return this.surface.requestClose(reason); }
    };
}
const bool=(value,binding='read')=>({dtype:'B',default:value,binding});
WindowShell.parameters={
    title:{dtype:'T',default:'',binding:'read'},open:bool(false,'twoWay'),collapsed:bool(false,'twoWay'),closable:bool(true),
    movable:bool(false),resizable:bool(false),collapsible:bool(false),maximizable:bool(false),maximized:bool(false,'twoWay'),
    beforeClose:{dtype:'T',nullable:true},
    ...Object.fromEntries(['width','height','left','top'].map(name=>[name,{dtype:'T',nullable:true,binding:'twoWay'}])),
    ...Object.fromEntries(['minWidth','minHeight'].map(name=>[name,{dtype:'T',nullable:true,binding:'read'}])),
};
export const Dialog=defineComponent({name:'dialog',tag:'gramlot-dialog',base:WindowShell,sourceContext:true,subTags:'framePane',implementation:Base=>class extends Base{}});
export const FloatingPane=defineComponent({name:'floatingPane',tag:'gramlot-floating-pane',base:WindowShell,sourceContext:true,subTags:'framePane',
    parameters:{movable:bool(true),resizable:bool(true),collapsible:bool(true)},implementation:Base=>class extends Base{}});
