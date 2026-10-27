/** Shared stable slotted container base. */
import {projectParameters} from './parameters.js';

export function Container(HTMLElement) {
    return class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({mode: 'open'});
            const style = this.ownerDocument.createElement('style');
            style.textContent = `:host{box-sizing:border-box;display:block;min-width:0;font:inherit;color:var(--gramlot-ink,CanvasText)}
                *,*::before,*::after{box-sizing:border-box}.control-box{min-width:0}slot{display:contents}
                ::slotted(*){min-width:0;max-width:100%}`;
            this.controlBox = this.ownerDocument.createElement('div');
            this.controlBox.className = 'control-box';
            this.control = this.controlBox; this.control.id = 'control';
            this.control.append(this.ownerDocument.createElement('slot'));
            shadow.append(style, this.controlBox);
        }
        projectAttributes(attrs) {
            return projectParameters(this, attrs);
        }
    };
}
Container.parameters = {};

