import {SVG_NS} from '../renderer/attributes.js';
/** Shared window chrome. Source owns the frame; native dialog owns modality. */
import {defineComponent} from './registry.js';
import {projectParameters} from './parameters.js';

function WindowShell(HTMLElement) {
    return class extends HTMLElement {
        #context; #observer; #scheduled = false; #live = false;
        #open = false; #collapsed = false; #maximized = false; #pending = null; #generation = 0;
        #geometry = null; #gesture = null; #previousFocus = null;
        #resize = () => { if (this.#open) this.#fit(); };
        constructor() {
            super();
            const doc = this.ownerDocument;
            const shadow = this.attachShadow({mode:'open'});
            const style = doc.createElement('style');
            style.textContent = `:host{display:contents;font:inherit;color:var(--gramlot-ink,CanvasText)}
                *,*::before,*::after{box-sizing:border-box}
                dialog{position:fixed;inset:auto;margin:0;padding:0;border:1px solid var(--gramlot-border-control,#8793a4);
                  border-radius:var(--gramlot-window-radius,9px);color:inherit;font:inherit;
                  background:var(--gramlot-surface,Canvas);box-shadow:0 12px 40px #0005;overflow:hidden;
                  max-width:calc(100vw - 16px);max-height:calc(100dvh - 16px)}
                dialog[open]{display:flex;flex-direction:column}
                dialog[data-maximized]{max-width:100vw;max-height:100dvh;border-radius:0}
                dialog::backdrop{background:var(--gramlot-window-backdrop,#0006)}
                .titlebar{display:flex;align-items:center;gap:var(--gramlot-space-2,8px);flex:none;min-height:max(28px,var(--gramlot-field-height,36px));padding:2px 4px 2px 10px;
                  background:var(--gramlot-surface-subtle,#e5e9ef);border-bottom:1px solid var(--gramlot-border-control,#8793a4)}
                .title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0;font-size:1em;font-weight:600}
                .titlebar[data-movable]{cursor:move;touch-action:none;user-select:none}
                button{font:inherit;color:inherit;background:transparent;border:0;border-radius:4px;cursor:pointer;min-width:max(24px,var(--gramlot-touch-target,0px));min-height:max(24px,var(--gramlot-touch-target,0px))}
                button:hover{background:color-mix(in srgb,currentColor 12%,transparent)}
                button:focus-visible,.titlebar:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:-2px}
                .body{flex:1;min-height:0;min-width:0;display:flex;overflow:hidden}
                slot{display:contents}::slotted(gramlot-frame-pane){flex:1;width:100%;height:100%;min-height:0;min-width:0}
                .resize{position:absolute;right:0;bottom:0;width:20px;height:20px;min-width:20px;min-height:20px;
                  display:grid;place-items:end;padding:2px;cursor:nwse-resize;touch-action:none;opacity:.65}
                .resize:hover,.resize:focus-visible{opacity:1}
                .resize svg{width:14px;height:14px;pointer-events:none}
                [hidden]{display:none!important}.status{flex:none;font-size:.85em;padding:4px 10px;color:var(--gramlot-error,#b22)}
                dialog[data-collapsed] .titlebar{border-bottom:0}`;
            this.shell = doc.createElement('dialog'); this.shell.setAttribute('aria-labelledby','title');
            this.titlebar = doc.createElement('header'); this.titlebar.className='titlebar';
            this.heading = doc.createElement('h2'); this.heading.id='title'; this.heading.className='title';
            this.collapseButton = this.#button('Collapse window','−');
            this.maximizeButton = this.#button('Maximize window','□');
            this.closeButton = this.#button('Close window','×');
            this.titlebar.append(this.heading,this.collapseButton,this.maximizeButton,this.closeButton);
            this.body = doc.createElement('div');this.body.className='body';this.body.append(doc.createElement('slot'));
            this.resizeButton = this.#button('Resize window','');this.resizeButton.className='resize';
            const resizeIcon=doc.createElementNS(SVG_NS,'svg');
            resizeIcon.setAttribute('viewBox','0 0 16 16');resizeIcon.setAttribute('aria-hidden','true');resizeIcon.setAttribute('focusable','false');
            const resizePath=doc.createElementNS(SVG_NS,'path');
            resizePath.setAttribute('d','M5 13 13 5M9 13l4-4');resizePath.setAttribute('fill','none');
            resizePath.setAttribute('stroke','currentColor');resizePath.setAttribute('stroke-width','1.25');resizePath.setAttribute('stroke-linecap','round');
            resizeIcon.append(resizePath);this.resizeButton.append(resizeIcon);
            this.status = doc.createElement('div');this.status.className='status';this.status.hidden=true;this.status.setAttribute('role','alert');
            this.shell.append(this.titlebar,this.body,this.status,this.resizeButton);shadow.append(style,this.shell);
            this.closeButton.addEventListener('click',()=>this.requestClose('close'));
            this.collapseButton.addEventListener('click',()=>this.#setCollapsed(!this.#collapsed,true));
            this.maximizeButton.addEventListener('click',()=>this.#setMaximized(!this.#maximized,true));
            this.shell.addEventListener('cancel',event=>{event.preventDefault();this.requestClose('escape');});
            this.shell.addEventListener('keydown',event=>{
                if(!this.modal && event.key==='Escape' && !event.defaultPrevented){event.preventDefault();this.requestClose('escape');}
            });
            this.shell.addEventListener('focusin',()=>this.#raise());
            this.shell.addEventListener('pointerdown',()=>this.#raise());
            for (const [handle,kind] of [[this.titlebar,'move'],[this.resizeButton,'resize']]) {
                handle.addEventListener('pointerdown',event=>this.#startGesture(event,kind));
                handle.addEventListener('pointermove',event=>this.#moveGesture(event));
                handle.addEventListener('pointerup',event=>this.#endGesture(event,true));
                handle.addEventListener('pointercancel',event=>this.#endGesture(event,false));
                handle.addEventListener('lostpointercapture',event=>this.#endGesture(event,false));
                handle.addEventListener('keydown',event=>this.#keyGeometry(event,kind));
            }
            this.#observer=new doc.defaultView.MutationObserver(()=>this.#schedule());
        }
        #button(label,text) { const b=this.ownerDocument.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',label);b.title=label;return b; }
        get modal() { return this.constructor.gramlotComponent.name==='dialog'; }
        get opened() { return this.#open; }
        setSourceContext(context) { this.#context=context; }
        connectedCallback() {
            this.#live=true;this.#observer.observe(this,{childList:true});
            this.ownerDocument.defaultView.addEventListener('resize',this.#resize);this.#schedule();
        }
        disconnectedCallback() {
            this.#live=false;this.#generation++;this.#pending=null;this.#observer.disconnect();
            this.ownerDocument.defaultView.removeEventListener('resize',this.#resize);this.#cancelGesture();
            if(this.shell.open)this.shell.close();this.#open=false;this.#restoreFocus();
        }
        projectAttributes(attrs) {
            const previous=this.parameters;
            const rest=projectParameters(this,attrs);
            if(previous) {
                if(['width','height','left','top','minWidth','minHeight'].some(name=>previous[name]!==this.parameters[name])) {
                    this.#cancelGesture();this.#geometry=null;this.#collapsed=false;this.#maximized=false;
                }
                if(previous.open!==this.parameters.open) { this.#generation++;this.#pending=null; }
                if(previous.movable!==this.parameters.movable || previous.resizable!==this.parameters.resizable)this.#cancelGesture();
            }
            this.#schedule();return rest;
        }
        #schedule() {
            if(this.#scheduled)return;this.#scheduled=true;
            queueMicrotask(()=>{this.#scheduled=false;if(this.#live&&this.isConnected&&this.parameters)this.#sync();});
        }
        #sync() {
            if(this.children.length!==1 || this.firstElementChild.localName!=='gramlot-frame-pane')throw new TypeError('A window requires exactly one framePane child');
            const p=this.parameters;
            this.heading.textContent=p.title;this.shell.setAttribute('aria-label',p.title);
            this.closeButton.hidden=!p.closable;this.closeButton.disabled=Boolean(this.#pending);
            this.collapseButton.hidden=!p.collapsible;this.maximizeButton.hidden=!p.maximizable;
            if(!p.open) { this.#close(false);return; }
            if(!this.#open) {
                this.#previousFocus=this.#activeElement();
                this.#collapsed=false;this.#maximized=false;this.body.hidden=false;this.shell.removeAttribute('data-collapsed');
                if(this.modal)this.shell.showModal();else this.shell.show();
                this.#open=true;this.#applySize();this.#fit();this.#raise();
                this.#context.publish('opened',{});
            } else if(!this.#geometry) { this.#applySize();this.#fit(); }
            this.#setMaximized(p.maximizable&&p.maximized,false);
            this.#setCollapsed(p.collapsible&&p.collapsed,false);
            if(!p.maximizable && p.maximized)this.#context.writeParameter('maximized',false);
            if(!p.collapsible && p.collapsed)this.#context.writeParameter('collapsed',false);
        }
        #activeElement() { let active=this.ownerDocument.activeElement;while(active?.shadowRoot?.activeElement)active=active.shadowRoot.activeElement;return active; }
        #restoreFocus() { const previous=this.#previousFocus;this.#previousFocus=null;if(previous?.isConnected)previous.focus({preventScroll:true}); }
        #applySize() {
            const p=this.parameters,s=this.shell.style;
            this.shell.removeAttribute('data-maximized');
            s.width=p.width??'var(--gramlot-window-width,36rem)';s.height=p.height??'var(--gramlot-window-height,24rem)';
            s.minWidth=p.minWidth??'min(220px, calc(100vw - 16px))';s.minHeight=p.minHeight??'min(140px, calc(100dvh - 16px))';
            s.left=p.left??'0px';s.top=p.top??'0px';
            if(this.#geometry){this.#paint(this.#geometry);return;}
            if(!this.#geometry) {
                const r=this.shell.getBoundingClientRect(),w=this.ownerDocument.defaultView;
                if(p.left==null)s.left=`${Math.max(8,(w.document.documentElement.clientWidth-r.width)/2)}px`;
                if(p.top==null)s.top=`${Math.max(8,(w.document.documentElement.clientHeight-r.height)/2)}px`;
            }
        }
        #fit() {
            if(this.#maximized){this.#renderGeometry();return;}
            const r=this.shell.getBoundingClientRect(),w=this.ownerDocument.defaultView;
            const width=Math.min(r.width,Math.max(0,w.document.documentElement.clientWidth-16)),height=Math.min(r.height,Math.max(0,w.document.documentElement.clientHeight-16));
            const rect={left:Math.max(8,Math.min(r.left,w.document.documentElement.clientWidth-width-8)),top:Math.max(8,Math.min(r.top,w.document.documentElement.clientHeight-height-8)),width,height};
            this.#paint(rect);if(!this.#collapsed)this.#geometry=rect;
            else this.#geometry={...this.#geometry,left:rect.left,top:rect.top,width:rect.width};
        }
        #paint(rect) { for(const key of ['left','top','width','height'])this.shell.style[key]=`${rect[key]}px`; }
        #raise() {
            if(this.modal||!this.#open)return;
            // Reserve the page's low stacking levels for layout chrome (splitters/drawers).
            // Modal dialogs and menu popovers remain above these nonmodal windows in the top layer.
            const base=100;
            const peers=[...this.getRootNode().querySelectorAll('gramlot-floating-pane')].filter(n=>n.opened&&n!==this);
            peers.sort((a,b)=>Number(a.shell.style.zIndex)-Number(b.shell.style.zIndex)).forEach((n,i)=>n.shell.style.zIndex=String(base+i));
            this.shell.style.zIndex=String(base+peers.length);
        }
        // #geometry always holds the normal expanded rectangle, never viewport size.
        #renderGeometry() {
            const viewport=this.ownerDocument.documentElement;
            const rect=this.#maximized?{left:0,top:0,width:viewport.clientWidth,height:viewport.clientHeight}:{...this.#geometry};
            if(this.#collapsed)rect.height=this.titlebar.getBoundingClientRect().height+2;
            this.shell.toggleAttribute('data-maximized',this.#maximized);
            this.shell.style.minWidth=this.#maximized?'0':this.parameters.minWidth??'min(220px, calc(100vw - 16px))';
            this.shell.style.minHeight=this.#collapsed||this.#maximized?'0':this.parameters.minHeight??'min(140px, calc(100dvh - 16px))';
            this.#paint(rect);
            const movable=this.parameters.movable&&!this.#maximized;
            this.titlebar.toggleAttribute('data-movable',movable);this.titlebar.tabIndex=movable?0:-1;
            this.titlebar.setAttribute('aria-label',movable?'Move window: use arrow keys':this.parameters.title);
            this.resizeButton.hidden=this.#collapsed||this.#maximized||!this.parameters.resizable;
        }
        #setMaximized(value,write) {
            if(!this.#open)return;
            if(value!==this.#maximized){this.#cancelGesture();this.#maximized=value;}
            this.#renderGeometry();
            if(!value)this.#fit();
            this.maximizeButton.textContent=value?'❐':'□';
            this.maximizeButton.setAttribute('aria-label',value?'Restore size':'Maximize window');
            this.maximizeButton.title=value?'Restore size':'Maximize window';
            this.maximizeButton.setAttribute('aria-pressed',String(value));
            if(write){this.parameters.maximized=value;this.#context.writeParameter('maximized',value);}
        }
        #setCollapsed(value,write) {
            if(!this.#open)return;
            if(value!==this.#collapsed) {
                this.#cancelGesture();
                if(value && this.body.contains(this.#activeElement()))this.collapseButton.focus();
                this.#collapsed=value;
            }
            this.body.hidden=value;
            this.shell.toggleAttribute('data-collapsed',value);this.collapseButton.textContent=value?'＋':'−';
            this.collapseButton.setAttribute('aria-label',value?'Expand window':'Collapse window');
            this.collapseButton.title=value?'Expand window':'Collapse window';
            this.collapseButton.setAttribute('aria-expanded',String(!value));
            this.#renderGeometry();this.#fit();
            if(write){this.parameters.collapsed=value;this.#context.writeParameter('collapsed',value);}
        }
        async requestClose(reason='application') {
            if(!this.#open || (!this.parameters.closable&&reason!=='application'))return false;
            if(this.#pending)return this.#pending;
            const generation=this.#generation;
            this.status.hidden=true;
            const run=async()=>{
                try {
                    const accepted=this.parameters.beforeClose?await this.#context.callLogic(this.parameters.beforeClose,{reason}):true;
                    if(typeof accepted!=='boolean')throw new TypeError('beforeClose must return a boolean');
                    if(!this.#live||generation!==this.#generation||!this.#open)return false;
                    if(accepted)this.#close(true);return accepted;
                } catch(error) {
                    if(this.#live&&generation===this.#generation){this.status.textContent='Unable to close: '+error.message;this.status.hidden=false;this.ownerDocument.defaultView.console.error(error);}
                    return false;
                } finally {if(generation===this.#generation){this.#pending=null;this.closeButton.disabled=false;this.shell.removeAttribute('aria-busy');}}
            };
            this.closeButton.disabled=true;this.shell.setAttribute('aria-busy','true');
            // Start after assigning the pending request, also for a synchronous guard.
            this.#pending=Promise.resolve().then(run);return this.#pending;
        }
        #close(write) {
            if(!this.#open)return;
            this.#generation++;this.#pending=null;this.#cancelGesture();this.#open=false;
            if(this.shell.open)this.shell.close();this.shell.removeAttribute('aria-busy');this.closeButton.disabled=false;
            this.#restoreFocus();
            if(write){this.parameters.open=false;this.#context.writeParameter('open',false);}
            this.#context.publish('closed',{});
        }
        #startGesture(event,kind) {
            if(event.button!==0||!this.#open||this.#maximized||kind==='move'&&!this.parameters.movable||kind==='resize'&&(!this.parameters.resizable||this.#collapsed))return;
            if(kind==='move'&&event.target.closest('button'))return;
            event.preventDefault();this.#cancelGesture();
            const r=this.shell.getBoundingClientRect();
            this.#gesture={kind,id:event.pointerId,handle:event.currentTarget,x:event.clientX,y:event.clientY,rect:{left:r.left,top:r.top,width:r.width,height:r.height}};
            event.currentTarget.setPointerCapture(event.pointerId);event.currentTarget.focus();
        }
        #moveGesture(event) {
            const g=this.#gesture;if(!g||g.id!==event.pointerId)return;
            this.#adjust(g.rect,event.clientX-g.x,event.clientY-g.y,g.kind);
        }
        #adjust(start,dx,dy,kind) {
            const rect={...start},w=this.ownerDocument.defaultView;
            if(kind==='move'){rect.left+=dx;rect.top+=dy;}
            else {
                const style=w.getComputedStyle(this.shell);
                rect.width=Math.max(parseFloat(style.minWidth)||0,rect.width+dx);
                rect.height=Math.max(parseFloat(style.minHeight)||0,rect.height+dy);
            }
            rect.width=Math.min(rect.width,Math.max(0,w.document.documentElement.clientWidth-16));rect.height=Math.min(rect.height,Math.max(0,w.document.documentElement.clientHeight-16));
            rect.left=Math.max(8,Math.min(rect.left,w.document.documentElement.clientWidth-rect.width-8));rect.top=Math.max(8,Math.min(rect.top,w.document.documentElement.clientHeight-rect.height-8));
            this.#paint(rect);
            if(this.#collapsed){this.#geometry={...this.#geometry,left:rect.left,top:rect.top,width:rect.width};}
            else this.#geometry=rect;
        }
        #endGesture(event,commit) {
            const g=this.#gesture;if(!g||g.id!==event.pointerId)return;
            this.#gesture=null;if(g.handle.hasPointerCapture(g.id))g.handle.releasePointerCapture(g.id);
            if(commit)this.#commitGeometry(g.kind);else {this.#paint(g.rect);if(!this.#collapsed)this.#geometry=g.rect;else this.#geometry={...this.#geometry,left:g.rect.left,top:g.rect.top,width:g.rect.width};}
        }
        #cancelGesture() { if(this.#gesture)this.#endGesture({pointerId:this.#gesture.id},false); }
        #commitGeometry(kind) {
            const r=this.shell.getBoundingClientRect();
            for(const key of kind==='move'?['left','top']:['width','height']) {
                const value=`${r[key]}px`;this.#context.writeParameter(key,value);
            }
        }
        #keyGeometry(event,kind) {
            if(event.target!==event.currentTarget||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
            if(this.#maximized||kind==='move'&&!this.parameters.movable||kind==='resize'&&(!this.parameters.resizable||this.#collapsed))return;
            event.preventDefault();event.stopPropagation();
            const r=this.shell.getBoundingClientRect(),step=event.shiftKey?1:10;
            this.#adjust({left:r.left,top:r.top,width:r.width,height:r.height},event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0,event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0,kind);
            this.#commitGeometry(kind);
        }
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
