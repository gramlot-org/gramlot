import {labelboxContent} from '../view/labelbox.js';
/** Built-in command surfaces. Execution stays in ButtonBinding, state in ControlAdapter. */
import {defineComponent, defineCollection} from './registry.js';
import {controlElement} from './bases.js';
import {projectParameters} from './parameters.js';
import {MenuContainer, menuLine} from './menus.js';

function Command(HTMLElement) {
    return class extends controlElement(HTMLElement) {
        constructor() {
            super();
            const doc = this.ownerDocument;
            this.control = doc.createElement('button');
            this.control.type = 'button';
            this.control.id = 'control';
            this.icon = doc.createElement('span');
            this.icon.className = 'icon';
            this.icon.setAttribute('aria-hidden', 'true');
            this.caption = doc.createElement('slot');
            this.control.append(this.icon, this.caption);
            this.controlBox.append(this.control);
            const style = doc.createElement('style');
            style.textContent = `:host{vertical-align:middle} .control-box{display:flex;align-items:stretch}
                button{display:inline-flex;align-items:center;justify-content:center;gap:var(--gramlot-button-gap,.35em);font:inherit;
                    color:var(--gramlot-button-color,var(--gramlot-ink,CanvasText));background:var(--gramlot-button-background,var(--gramlot-field-background,Canvas));
                    border:1px solid var(--gramlot-border-control,#888);border-radius:var(--gramlot-radius-sm,4px);
                    min-height:max(var(--gramlot-field-height,28px),var(--gramlot-touch-target,0px));
                    padding:var(--gramlot-button-padding,.25em .65em);cursor:pointer}
                button:hover:not(:disabled){background:var(--gramlot-button-hover,var(--gramlot-field-readonly-background,#eee))}
                :host(.button--secondary) button{background:var(--gramlot-selected,Highlight);color:var(--gramlot-action,CanvasText);border-color:transparent}
                :host(.button--secondary) button:hover:not(:disabled){background:var(--gramlot-selected,Highlight);color:var(--gramlot-action-hover,CanvasText);border-color:var(--gramlot-action,CanvasText)}
                button:active:not(:disabled){filter:brightness(.9)}
                @media(prefers-contrast:more){button{border:2px solid currentColor}}
                :host(.button--quiet) button{background:transparent;color:var(--gramlot-action,CanvasText);border-color:transparent}
                :host(.button--quiet) button:hover:not(:disabled){background:var(--gramlot-selected,Highlight);color:var(--gramlot-action-hover,CanvasText);border-color:transparent}
                button:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:2px}
                button:disabled{opacity:.55;cursor:not-allowed} .icon:empty{display:none} .icon img{display:block;width:100%;height:100%;object-fit:contain} .icon:has(img){width:1em;height:1em}
                .led{display:inline-block;width:.6em;height:.6em;border-radius:50%;background:var(--gramlot-button-led-off,#888)}
                [aria-pressed=true] .led{background:var(--gramlot-button-led-on,#2b9a46)}
                .arrow{border-start-start-radius:0;border-end-start-radius:0;border-inline-start:0}
                .split{border-start-end-radius:0;border-end-end-radius:0}
                .popup{position:fixed;inset:auto;margin:0;padding:var(--gramlot-popup-padding,4px);overflow:auto;
                    max-width:var(--gramlot-popup-available-width);max-height:var(--gramlot-popup-available-height);
                    border:1px solid var(--gramlot-border-control,#888);border-radius:var(--gramlot-radius-sm,4px);
                    color:var(--gramlot-ink,CanvasText);background:var(--gramlot-field-background,Canvas);box-shadow:0 3px 12px #0003}
                :host(:is([role=menuitem],[role=menuitemcheckbox])){display:block} :host(:is([role=menuitem],[role=menuitemcheckbox])) button{width:100%;justify-content:start;border:0;background:transparent}
                :host([role=separator]){display:block;border-top:1px solid var(--gramlot-border-control,#888);margin:.25em}
                :host([role=separator]) button{display:none}
                @media(forced-colors:active){button,:host(.button--secondary) button,:host(.button--quiet) button{background:ButtonFace;color:ButtonText;border-color:ButtonText;filter:none}}
                `;
            this.shadowRoot.append(style);
        }
        get disabled() { return this.control.disabled; }
        set disabled(value) { this.control.disabled = Boolean(value); }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            this.control.disabled = Boolean(this.parameters.disabled);
            this.control.readOnly = Boolean(this.parameters.readonly);
            this.renderIcon(this.parameters.icon, this.parameters.iconSrc);
            if (attrs['aria-label'] != null) this.control.setAttribute('aria-label', attrs['aria-label']);
            else this.control.removeAttribute('aria-label');
            return rest;
        }
        renderIcon(icon, iconSrc) {
            if (!iconSrc) { this.icon.textContent = icon ?? ''; return; }
            let image = this.icon.firstElementChild;
            if (!image) {
                image = this.ownerDocument.createElement('img');
                image.alt = ''; image.draggable = false;
                this.icon.replaceChildren(image);
            }
            if (image.getAttribute('src') !== iconSrc) image.setAttribute('src', iconSrc);
        }
        get entryIcon() { return this.parameters.icon; }
        get entryIconSrc() { return this.parameters.iconSrc; }
        attachCommand() {}
        releaseCommand() {}
        commandTarget() { return this; }
        prepareCommand() { return !this.disabled; }
    };
}
Command.parameters = {
    disabled: {dtype: 'B', default: false, binding: 'read'},
    icon: {dtype: 'T', default: '', binding: 'read'},
    iconSrc: {dtype: 'T', default: '', binding: 'read'}
};
export const Button = defineComponent({name: 'button', tag: 'gramlot-button', base: Command,
    command: true, subTags: '*', implementation: Base => class extends Base {}});
export const ToggleButton = defineComponent({name: 'toggleButton', tag: 'gramlot-toggle-button', base: Command,
    command: true, subTags: '*', parameters: {value: {dtype: 'B', default: false, binding: 'twoWay'},
        readonly: {dtype: 'B', default: false, binding: 'read'}},
    implementation: Base => class extends Base {
        #value = false;
        constructor() {
            super();
            const led = this.ownerDocument.createElement('span');
            led.className = 'led'; led.setAttribute('aria-hidden', 'true');
            this.control.prepend(led);
            this.writeControlValue(false);
        }
        get commitOnChange() { return true; }
        readControlValue() { return this.#value; }
        writeControlValue(value) {
            this.#value = value;
            this.control.setAttribute('aria-pressed', String(value));
        }
        prepareCommand(event) {
            if (!super.prepareCommand(event) || this.control.readOnly) return false;
            this.writeControlValue(!this.#value);
            this.control.dispatchEvent(new this.ownerDocument.defaultView.Event('change'));
            return true;
        }
    }
});

export const Menu = defineComponent({name:'menu',tag:'gramlot-menu',base:MenuContainer,
    subTags:'menuline,spacer,contentPane',parameters:{
        presentation:{dtype:'T',default:'popup',enum:['popup','bar']},
        orientation:{dtype:'T',default:'horizontal',enum:['horizontal','vertical']},
        modifiers:{dtype:'T',nullable:true},
        labelPosition:{dtype:'T',binding:'read',default:'beside',enum:['beside','below','tooltip']},iconSize:{dtype:'R',binding:'read',default:24},
        resolver:{dtype:'T',nullable:true},cacheTime:{dtype:'R',default:-1},sync:{dtype:'B',default:false}
    },implementation:Base=>class extends Base {}});
export const MenuLine = defineComponent({name:'menuline',tag:'gramlot-menu-line',base:Command,
    command:true,subTags:'*',parameters:{
        command:{dtype:'T',nullable:true},caption:{dtype:'T',nullable:true},code:{dtype:'T',nullable:true},
        checked:{dtype:'B',nullable:true,binding:'read'},tooltip:{dtype:'T',nullable:true},
        labelPosition:{dtype:'T',binding:'read',nullable:true,enum:['beside','below','tooltip']},iconSize:{dtype:'R',binding:'read',nullable:true},
        group:{dtype:'B',default:false},priority:{dtype:'R',default:0},overflowable:{dtype:'B',default:true},
        parameters:{annotation:{kind:'type',module:'builtins',name:'dict'},nullable:true},favorite:{dtype:'B',default:false}
    },implementation:menuLine});
export const Spacer = defineComponent({name:'spacer',tag:'gramlot-spacer',base:HTMLElement=>class extends HTMLElement {
    projectAttributes(attrs) {
        const rest=projectParameters(this,attrs),{size,flex}=this.parameters;
        if (size!=null && flex!=null) throw new TypeError('spacer accepts size or flex, not both');
        if (size!=null && (!Number.isFinite(size)||size<0) || flex!=null && (!Number.isFinite(flex)||flex<=0)) throw new TypeError('Invalid spacer size/flex');
        this.style.flex=flex!=null?`${flex} 1 0px`:`0 0 ${size??0}px`;
        this.setAttribute('aria-hidden','true');return rest;
    }
},parameters:{size:{dtype:'R',nullable:true},flex:{dtype:'R',nullable:true}},implementation:Base=>class extends Base {}});
export const DropDownButton = defineComponent({name:'dropDownButton',tag:'gramlot-drop-down-button',base:Command,
    command:true,subTags:'*',parameters:{persist:{dtype:'B',default:false}},
    implementation:Base=>class extends Base {
        #selected=null; #observer; #storageKey=null; #arrow; #chosenCaption;
        constructor() {
            super();const doc=this.ownerDocument;
            this.control.classList.add('split');
            this.#chosenCaption=doc.createElement('span');this.#chosenCaption.hidden=true;this.control.append(this.#chosenCaption);
            this.#arrow=doc.createElement('button');this.#arrow.type='button';this.#arrow.className='arrow';this.#arrow.textContent='▾';
            this.#arrow.setAttribute('aria-label','Open menu');this.#arrow.setAttribute('aria-haspopup','menu');this.#arrow.setAttribute('aria-expanded','false');
            this.controlBox.append(this.#arrow);
            const slot=doc.createElement('slot');slot.name='menu';this.shadowRoot.append(slot);
            this.#arrow.addEventListener('click',event=>{event.stopPropagation();if(this.menu.opened)this.closeMenu();else this.openMenu();});
            this.#arrow.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();this.openMenu(event.key==='ArrowUp');}});
        }
        get menu(){return [...this.children].map(labelboxContent).find(child=>child.localName==='gramlot-menu');}
        get menuItems(){return this.menu?.items??[];}
        projectAttributes(attrs,adapt){const rest=super.projectAttributes(attrs,adapt);this.#arrow.disabled=this.disabled;
            if(this.disabled)this.menu?.close(false);this.#refreshCaption();return rest;}
        attachCommand(){
            if(this.parameters.persist){
                if(!this.id)throw new TypeError('dropDownButton persist requires an explicit id');
                this.#storageKey=`gramlot:command:${this.ownerDocument.location.pathname}${this.ownerDocument.location.search}:${this.id}`;
                try{this.#selected=this.ownerDocument.defaultView.localStorage.getItem(this.#storageKey);}catch{/* storage may be disabled */}
            }
            this.#refreshCaption();this.#observer=new this.ownerDocument.defaultView.MutationObserver(()=>this.#refreshCaption());
            this.#observer.observe(this,{childList:true,subtree:true,characterData:true});
        }
        releaseCommand(){this.#observer?.disconnect();this.menu?.close(false);}
        commandTarget(event){if(event?.composedPath().includes(this.menu))return null;
            return this.menuItems.find(item=>item.occurrence===this.#selected)??this;}
        selectCommand(item,remember){if(remember){this.#selected=item.occurrence;
            if(this.#storageKey)try{this.ownerDocument.defaultView.localStorage.setItem(this.#storageKey,this.#selected);}catch{/* keep in-memory choice */}
            this.#refreshCaption();}this.closeMenu();}
        #refreshCaption(){
            const codes=this.menuItems.map(item=>item.occurrence).filter(Boolean);
            if(new Set(codes).size!==codes.length)throw new TypeError('Dropdown menu codes must be unique');
            const target=this.commandTarget(),selected=target!==this;
            this.caption.hidden=selected;this.#chosenCaption.hidden=!selected;
            this.#chosenCaption.textContent=selected?target.entryCaption:'';
            this.renderIcon(target.entryIcon, target.entryIconSrc);
        }
        openMenu(last=false){if(!this.disabled)this.menu?.open(this.#arrow,last);}
        closeMenu(){this.menu?.close();}
    }
});
export default defineCollection({name:'buttons',components:[Button,ToggleButton,DropDownButton,Menu,MenuLine,Spacer]});
