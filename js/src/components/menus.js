/** Shared popup/permanent menu presentation. Source and execution stay in bindings. */
import {projectParameters} from './parameters.js';
import {positionPopup} from './popup.js';
import {ToolbarOverflow} from './toolbar-overflow.js';

export function MenuContainer(HTMLElement) {
    return class extends HTMLElement {
        #events; #observer; #active = null; #previous = []; #opener = null;
        #overflow; #message; #retry; #slot; #opened = false; #attachment; #attachmentEvents;
        constructor() {
            super();
            const doc = this.ownerDocument, shadow = this.attachShadow({mode: 'open'});
            const style = doc.createElement('style');
            style.textContent = `:host{box-sizing:border-box;color:var(--gramlot-ink,CanvasText)}
                :host([role=menu]){position:fixed;inset:auto;margin:0;padding:5px;min-width:min(16rem,var(--gramlot-popup-available-width));width:max-content;font:inherit;
                  max-width:min(28rem,var(--gramlot-popup-available-width));max-height:var(--gramlot-popup-available-height);overflow:auto;
                  background:var(--gramlot-field-background,Canvas);border:1px solid var(--gramlot-border-control,#888);border-radius:var(--gramlot-radius-lg,9px);box-shadow:0 8px 28px #0004}
                :host([role=toolbar][aria-orientation=vertical]){flex-direction:column;align-items:stretch}
                :host([role=toolbar]){display:flex;gap:var(--gramlot-toolbar-gap,4px);align-items:center}
                :host([role=menu]) ::slotted([role=separator]){margin:5px 7px 5px 2.5rem;border-top:1px solid var(--gramlot-border-control,#888)}
                :host([role=toolbar][aria-orientation=horizontal]) ::slotted([role=separator]){border-top:0;border-left:1px solid var(--gramlot-border-control,#888);align-self:stretch;margin:4px}
                :host([hidden]){display:none!important} slot{display:contents} .status{padding:.4em;opacity:.75}
                .status:empty{display:none} button{font:inherit}`;
            this.#slot = doc.createElement('slot');
            this.#message = doc.createElement('span'); this.#message.className = 'status'; this.#message.setAttribute('role', 'status');
            this.#retry = doc.createElement('button'); this.#retry.textContent = 'Riprova'; this.#retry.hidden = true;
            this.#retry.addEventListener('click', event => { event.stopPropagation(); this.menuBinding.load(true); });
            shadow.append(style, this.#slot, this.#message, this.#retry);
            this.#overflow=new ToolbarOverflow(this,this.#slot);
            this.addEventListener('keydown', event => this.#key(event));
            this.addEventListener('focusin', event => {
                const item = event.composedPath().find(node => this.items.includes(node));
                if (item) { this.#active = item; this.refreshItems(); }
            });
        }
        get permanent() { return this.parameters.presentation === 'bar'; }
        get opened() { return this.permanent || this.#opened; }
        get items() { return [...this.querySelectorAll('gramlot-menu-line')].filter(item => item.menuOwner===this && !item.parameters.group); }
        get overflow() { return this.#overflow; }
        isOverflowed(item) { return this.#overflow.contains(item); }
        get usableItems() { return this.items.filter(item => item.slot!=='suppressed' && !item.disabled && !item.hidden && !item.closest('[hidden]') && item.getAttribute('role') !== 'separator'); }
        get parentMenu() { return this.parentElement?.closest('gramlot-menu') ?? null; }
        connectedCallback() {
            this.#observer = new this.ownerDocument.defaultView.MutationObserver(() => {this.refreshItems();this.#overflow.schedule();});
            this.#observer.observe(this, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:['hidden','disabled']});
            this.refreshItems();
            this.#attachOpening();
            this.#overflow.connect();
            if (this.permanent) this.menuBinding?.load();
        }
        disconnectedCallback() { this.#overflow.disconnect(); this.#observer?.disconnect(); this.#events?.abort(); this.#attachmentEvents?.abort(); this.#attachment=null; this.#opened = false; }
        projectAttributes(attrs) {
            const rest = projectParameters(this, attrs);
            this.#modifierKeys();
            if(!Number.isFinite(this.parameters.iconSize)||this.parameters.iconSize<=0)throw new TypeError('menu iconSize must be positive');
            this.setAttribute('role', this.permanent ? 'toolbar' : 'menu');
            this.setAttribute('aria-orientation', this.permanent ? this.parameters.orientation : 'vertical');
            this.tabIndex = -1;
            if (this.permanent) this.removeAttribute('popover');
            else this.setAttribute('popover','manual');
            this.refreshItems();
            this.#overflow.schedule();
            return rest;
        }
        #modifierKeys() {
            const value=this.parameters.modifiers;
            if (value==null) return null;
            if (value==='*') return [];
            const keys=value.trim().toLowerCase().split(/[,\s]+/);
            if (!keys.length || keys.some(key=>!['shift','ctrl','alt','meta'].includes(key)) || new Set(keys).size!==keys.length) {
                throw new TypeError('Menu modifiers require *, or a combination of Shift, Ctrl, Alt and Meta');
            }
            return keys;
        }
        #attachOpening() {
            const owner=this.parentElement;
            if (this.permanent || !owner) return;
            if (['gramlot-menu-line','gramlot-drop-down-button'].includes(owner.localName)) { this.slot='menu'; return; }
            this.removeAttribute('slot');
            if (owner.localName==='gramlot-menu') return;
            this.#attachment=owner;
            this.#attachmentEvents=new this.ownerDocument.defaultView.AbortController();
            const options={signal:this.#attachmentEvents.signal};
            const outsideMenus=event=>!event.composedPath().some(node=>node.localName==='gramlot-menu');
            const open=event=>{
                if (this.hidden || this.permanent || !outsideMenus(event)) return;
                if (event.composedPath().some(node=>node instanceof this.ownerDocument.defaultView.Element && (node.disabled===true || node.getAttribute('aria-disabled')==='true'))) return;
                const keys=this.#modifierKeys();
                if (event.type==='click') {
                    if (keys===null || event.button!==0 || ['shift','ctrl','alt','meta'].some(key=>Boolean(event[key+'Key'])!==keys.includes(key))) return;
                } else if (keys!==null) return;
                event.preventDefault(); event.stopPropagation();
                const keyboard=event.type==='keydown';
                const rect=keyboard ? owner.getBoundingClientRect() : null;
                this.open(owner,false,keyboard ? {x:rect.left+8,y:rect.top+8} : {x:event.clientX,y:event.clientY});
            };
            owner.addEventListener('click',open,options);
            owner.addEventListener('contextmenu',open,options);
            owner.addEventListener('keydown',event=>{
                if (event.key==='ContextMenu' || event.key==='F10' && event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) open(event);
            },options);
        }
        setStatus(status) {
            this.status = status;
            this.#message.textContent = ({loading:'Caricamento…',empty:'Nessuna voce',error:'Impossibile caricare'})[status] ?? '';
            this.#retry.hidden = status !== 'error';
            this.setAttribute('aria-busy', String(status === 'loading'));
            for (const item of this.items) item.refreshAvailability();
            this.refreshItems();
        }
        refreshItems() {
            for(const group of this.querySelectorAll('gramlot-menu-line'))if(group.menuOwner===this && group.parameters.group)group.refreshAvailability();
            for(const item of this.items)item.refreshAvailability();
            const usable = this.usableItems;
            if (this.#active && !usable.includes(this.#active)) {
                const index = this.#previous.indexOf(this.#active);
                const next = this.#previous.slice(index+1).find(item => usable.includes(item))
                    ?? this.#previous.slice(0,index).reverse().find(item => usable.includes(item));
                this.#active = next ?? null;
                if (this.opened && this.status !== 'loading') {
                    if (next) next.focus();
                    else if (this.permanent) this.focus(); else this.close();
                }
            }
            const visible=usable.filter(item=>!this.isOverflowed(item));
            for (const item of this.items) item.control.tabIndex = this.permanent && item === (visible.includes(this.#active)?this.#active:visible[0]) ? 0 : -1;
            this.#previous = this.items;
        }
        open(opener, last = false, point = null) {
            if (this.permanent) return;
            this.#opener = opener;
            if (!this.#opened) { this.showPopover(); this.#opened = true; }
            opener.setAttribute('aria-expanded','true');
            this.#events?.abort();
            this.#events = new this.ownerDocument.defaultView.AbortController();
            const options = {signal:this.#events.signal};
            const place = () => positionPopup(this, opener, {point,placement:this.parentMenu && (!this.parentMenu.permanent || this.parentMenu.parameters.orientation==='vertical' || this.parentMenu.isOverflowed(this.parentElement)) ? 'side' : 'bottom'});
            place();
            this.ownerDocument.defaultView.addEventListener('resize',place,options);
            this.ownerDocument.addEventListener('scroll',place,{...options,capture:true});
            this.ownerDocument.addEventListener('pointerdown',event => {
                if (!event.composedPath().includes(this) && (opener===this.#attachment || !event.composedPath().includes(opener))) this.closeChain(false);
            },options);
            this.menuBinding?.load().then(() => {
                if (this.#opened && (this.ownerDocument.activeElement === this || !this.contains(this.ownerDocument.activeElement))) this.focusEntry(last);
                if (this.#opened) place();
            });
            this.focusEntry(last);
        }
        focusEntry(last = false) {
            const usable = this.usableItems;
            const target = usable[last ? usable.length-1 : 0];
            if (target) { this.#active=target; target.focus(); } else this.focus();
        }
        close(restore = true) {
            for (const child of this.querySelectorAll('gramlot-menu')) if (!child.permanent) child.close(false);
            if (this.permanent) {this.#overflow.close(restore);return;}
            if (!this.#opened) return;
            this.hidePopover(); this.#opened = false; this.#events?.abort();
            this.#opener?.setAttribute('aria-expanded','false');
            if (restore && this.#opener?.isConnected) this.#opener.focus();
        }
        closeChain(restore = true) {
            const parent = this.parentMenu;
            this.close(restore && !parent);
            if (parent && !parent.permanent) parent.closeChain(restore);
            else if(parent?.isOverflowed(this.parentElement))parent.overflow.close(restore);
            else if (restore && this.#opener?.isConnected) this.#opener.focus();
        }
        #key(event) {
            if (event.defaultPrevented || event.composedPath().find(node => node.localName === 'gramlot-menu') !== this) return;
            const item = event.composedPath().find(node => this.items.includes(node));
            // Embedded editors retain their editing and Tab behavior.
            if (!item && event.target !== this) return;
            const inOverflow=item && this.isOverflowed(item);
            const items=this.usableItems.filter(entry=>this.isOverflowed(entry)===Boolean(inOverflow)), index=items.indexOf(item);
            const nextKey=this.permanent && !inOverflow && this.parameters.orientation==='horizontal' ? 'ArrowRight':'ArrowDown';
            const prevKey=this.permanent && !inOverflow && this.parameters.orientation==='horizontal' ? 'ArrowLeft':'ArrowUp';
            let next;
            if (event.key===nextKey) next=Math.min(items.length-1,index+1);
            if (event.key===prevKey) next=Math.max(0,index-1);
            if (event.key==='Home') next=0;
            if (event.key==='End') next=items.length-1;
            if (next!==undefined) { event.preventDefault(); event.stopPropagation(); items[next]?.focus(); return; }
            if ((!this.permanent || inOverflow) && event.key==='ArrowRight' && item?.submenu) {
                event.preventDefault(); event.stopPropagation(); item.openSubmenu();
            } else if ((event.key==='Escape' && (!this.permanent || this.overflow.opened || this.items.some(entry=>entry.submenu?.opened))) || (!this.permanent && event.key==='ArrowLeft' && this.parentMenu)) {
                event.preventDefault(); event.stopPropagation(); this.close();
            } else if (event.key==='Tab') this.closeChain(false);
        }
    };
}

export function menuLine(Base) {
    return class extends Base {
        #accessibleLabel; #group; #caption; #check; #arrow; #hover; #registry = null; #authoredDisabled = false;
        constructor() {
            super();
            const doc=this.ownerDocument;
            this.#caption=doc.createElement('span'); this.#check=doc.createElement('span');
            this.#caption.className='menu-caption'; this.#check.className='menu-check';
            this.#arrow=doc.createElement('span'); this.#arrow.className='menu-arrow';
            this.#arrow.setAttribute('aria-hidden','true');
            this.#check.setAttribute('aria-hidden','true');
            this.control.prepend(this.#check); this.control.append(this.#caption,this.#arrow);
            const style=doc.createElement('style');
            style.textContent=`:host{color:var(--gramlot-ink,CanvasText)} .control-box{color:inherit;height:100%} :host button{color:inherit}
                .menu-check:empty,.menu-arrow:empty{display:none}
                button.menu-row{display:grid;grid-template-columns:1em 1.15em minmax(0,1fr) .7em;column-gap:.5em;
                  align-items:center;width:100%;min-height:max(min(var(--gramlot-field-height,28px),28px),var(--gramlot-touch-target,0px));padding:var(--gramlot-button-padding,3px 8px);
                  line-height:1.3;text-align:left;border:0;border-radius:var(--gramlot-radius-sm,5px);background:transparent;cursor:default}
                .menu-row .menu-check,.menu-row .icon,.menu-row .menu-arrow{display:flex;align-items:center;justify-content:center;min-width:0}
                .menu-row .menu-check{grid-column:1}.menu-row .icon{grid-column:2}
                .menu-row .menu-caption{grid-column:3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
                .menu-row .menu-arrow{grid-column:4;font-size:1.2em;line-height:1}
                button.menu-row:hover:not(:disabled),button.menu-row:focus-visible,button.menu-row[aria-expanded=true]{
                  background:var(--gramlot-selected,Highlight);color:var(--gramlot-action-hover,HighlightText);outline:none}
                button.menu-row:disabled{opacity:.45;cursor:default}
                :host button.toolbar-button{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:var(--gramlot-button-gap,6px);
                  box-sizing:border-box;width:100%;height:100%;min-width:max(var(--gramlot-field-height,38px),var(--gramlot-touch-target,0px));min-height:max(var(--gramlot-field-height,38px),var(--gramlot-touch-target,0px));padding:var(--gramlot-button-padding,6px 5px);border:1px solid transparent;border-radius:var(--gramlot-radius-sm,8px);
                  background:transparent;cursor:pointer;line-height:1.2;white-space:nowrap}
                :host button.toolbar-button .icon{display:inline-flex;align-items:center;justify-content:center;
                  width:var(--gramlot-toolbar-icon-size);height:var(--gramlot-toolbar-icon-size);font-size:var(--gramlot-toolbar-icon-size);line-height:1}
                :host button.toolbar-button .icon:empty{display:none}
                :host button.toolbar-button:hover:not(:disabled){background:color-mix(in srgb,currentColor 10%,transparent)}
                :host button.toolbar-button:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:-2px}
                :host button.toolbar-button[aria-checked=true],:host button.toolbar-button[aria-expanded=true]{background:var(--gramlot-selected,color-mix(in srgb,currentColor 14%,transparent))}
                :host button.toolbar-button:disabled{opacity:.45;cursor:default}
                :host button.toolbar-below{flex-direction:column;gap:3px;min-width:54px}
                :host button.toolbar-below .menu-caption{font-size:11px;line-height:1.2}
                :host button.toolbar-tooltip .menu-caption{display:none}
                :host button.toolbar-button .menu-check{display:none}
                :host button.toolbar-tooltip .menu-arrow{position:absolute;right:3px;top:50%;transform:translateY(-50%);font-size:12px}
                :host button.toolbar-below .menu-arrow{position:absolute;inset:4px 3px auto auto;font-size:12px}`;
            style.textContent+=`
                :host([role=group]){display:block;min-width:0}
                :host([role=group]) .control-box{display:none}
                .menu-group{display:flex;align-items:center;gap:var(--gramlot-toolbar-gap,4px);flex-wrap:nowrap}
                .menu-group ::slotted(*){flex-shrink:0}
                .menu-group[hidden]{display:none}
                :host([data-menu-overflow]) .menu-group,:host([data-menu-group-rows]) .menu-group{flex-direction:column;align-items:stretch;padding:3px 0}
                :host([data-menu-overflow][role=group]){border-block-end:1px solid var(--gramlot-border-control,#888);margin-block-end:4px}
                :host([role=group][aria-disabled=true]) .menu-group{opacity:.45;pointer-events:none}
                :host([hidden]){display:none!important}`;
            this.caption.name='command-caption';
            this.#group=doc.createElement('div');this.#group.className='menu-group';
            this.#group.append(doc.createElement('slot'));this.#group.hidden=true;
            this.shadowRoot.append(style,this.#group);
            const slot=doc.createElement('slot'); slot.name='menu'; this.shadowRoot.append(slot);
            this.addEventListener('pointerenter',() => {
                if (this.menuOwner && (!this.menuOwner.permanent || this.menuOwner.isOverflowed(this)) && !this.disabled) {
                    clearTimeout(this.#hover);
                    this.#hover=setTimeout(()=>{
                        if (!this.isConnected || this.disabled || !this.menuOwner.opened) return;
                        this.control.focus({preventScroll:true});
                        if (this.submenu) this.openSubmenu();
                        else for (const sibling of this.menuOwner.items) sibling.submenu?.close(false);
                    },180);
                }
            });
            this.addEventListener('pointerleave',()=>clearTimeout(this.#hover));
        }
        get menuOwner() { return this.parentElement?.closest('gramlot-menu') ?? null; }
        get submenu() { return [...this.children].find(child=>child.localName==='gramlot-menu') ?? null; }
        get entryCaption() { return this.parameters.caption ?? this.#registry?.label ?? ''; }
        get entryIcon() { return this.parameters.icon || this.parameters.iconSrc ? this.parameters.icon : this.#registry?.icon; }
        get entryIconSrc() { return this.parameters.icon || this.parameters.iconSrc ? this.parameters.iconSrc : this.#registry?.iconSrc; }
        get occurrence() { return this.parameters.code ?? this.sourceLabel; }
        setCommandDefinition(definition, sourceLabel) {
            this.#registry=definition; this.sourceLabel=sourceLabel; this.#render();
        }
        projectAttributes(attrs,adapt) {
            const rest=super.projectAttributes(attrs,adapt);
            this.#accessibleLabel=attrs['aria-label'];
            if(this.parameters.iconSize!=null&&(!Number.isFinite(this.parameters.iconSize)||this.parameters.iconSize<=0))throw new TypeError('menuline iconSize must be positive');
            if(!Number.isFinite(this.parameters.priority))throw new TypeError('menuline priority must be finite');
            this.#authoredDisabled=Boolean(this.parameters.disabled);
            this.#render(); this.menuOwner?.overflow.schedule(); return rest;
        }
        #render() {
            const separator=[...this.childNodes].filter(node=>node.nodeType===3)
                .map(node=>node.textContent).join('').trim()==='-' && !this.parameters.command;
            this.setAttribute('role',this.parameters.group?'group':separator?'separator':this.parameters.checked==null?'menuitem':'menuitemcheckbox');
            this.#group.hidden=!this.parameters.group;
            this.setAttribute('aria-disabled',String(this.#authoredDisabled));
            if (this.parameters.checked!=null) {
                this.setAttribute('aria-checked',String(this.parameters.checked));
                this.control.setAttribute('aria-checked',String(this.parameters.checked));
            } else { this.removeAttribute('aria-checked'); this.control.removeAttribute('aria-checked'); }
            this.#check.textContent=this.parameters.checked ? '✓':'';
            this.#caption.textContent=this.parameters.command && !this.#registry ? '???':this.entryCaption;
            this.caption.hidden=true;
            this.renderIcon(this.entryIcon, this.entryIconSrc);
            const tooltip=this.parameters.tooltip ?? this.#registry?.tooltip ?? this.entryCaption;
            this.control.title=tooltip;
            this.control.setAttribute('aria-label',this.#accessibleLabel ?? (this.entryCaption || tooltip));
            if (this.submenu) this.control.setAttribute('aria-haspopup','menu');
            else this.control.removeAttribute('aria-haspopup');
            this.refreshAvailability();
        }
        refreshAvailability() {
            const owner=this.menuOwner;
            const popup = owner && (!owner.permanent || owner.isOverflowed(this));
            const inherited=name=>{
                for(let node=this;node && node!==owner;node=node.parentElement){
                    if(node.localName==='gramlot-menu-line' && node.parameters[name]!=null)return node.parameters[name];
                }
                return owner?.parameters[name];
            };
            const toolbar=Boolean(owner?.permanent && !popup);
            const labelPosition=inherited('labelPosition');
            this.control.classList.toggle('toolbar-button',toolbar);
            this.control.classList.toggle('toolbar-below',toolbar && labelPosition==='below');
            this.control.classList.toggle('toolbar-tooltip',toolbar && labelPosition==='tooltip');
            if(toolbar)this.control.style.setProperty('--gramlot-toolbar-icon-size',`${inherited('iconSize')}px`);
            else this.control.style.removeProperty('--gramlot-toolbar-icon-size');
            this.toggleAttribute('data-menu-group-rows',Boolean(popup || owner?.parameters.orientation==='vertical'));
            this.control.classList.toggle('menu-row', popup);
            this.#arrow.textContent = this.submenu ? (popup || owner?.parameters.orientation==='vertical' ? '›' : '▾') : '';
            const disabled=this.#authoredDisabled || this.getAttribute('role')==='separator'
                || Boolean(this.parameters.command && !this.#registry)
                || ['loading','error'].includes(owner?.status)
                || Boolean(this.closest('gramlot-drop-down-button')?.parameters.disabled);
            if(this.control.disabled!==disabled)this.control.disabled=disabled;
        }
        get disabled() {
            for(let p=this.parentElement;p && p!==this.menuOwner;p=p.parentElement)if(p.localName==='gramlot-menu-line' && p.parameters.disabled)return true;
            return this.control.disabled || Boolean(this.closest('gramlot-drop-down-button')?.parameters.disabled); }
        set disabled(value) { this.control.disabled=Boolean(value); }
        attachCommand() { this.#render(); }
        releaseCommand() { clearTimeout(this.#hover); this.submenu?.close(false); }
        openSubmenu() {
            if (this.disabled || !this.submenu) return;
            for (const sibling of this.menuOwner.items) if (sibling!==this) sibling.submenu?.close(false);
            this.submenu.open(this.control);
        }
        prepareCommand(event) {
            if (this.parameters.group || this.disabled || this.hidden) return false;
            if (this.submenu) { event.stopPropagation(); if(this.submenu.opened)this.submenu.close();else this.openSubmenu();return false; }
            const drop=this.menuOwner?.parentElement;
            if (drop?.localName==='gramlot-drop-down-button') drop.selectCommand(this,event.shiftKey);
            else this.menuOwner.closeChain();
            return true;
        }
    };
}
