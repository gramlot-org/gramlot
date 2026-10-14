// Copyright 2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
// Bounded adaptation of PoC collections/palette.js; no registry or WidgetLabel.
export class GramlotPocPalette extends HTMLElement {
    static observedAttributes = ['title', 'collapsed'];
    constructor() {
        super();
        this.attachShadow({mode:'open'}).innerHTML = `<style>
:host{box-sizing:border-box;position:fixed;z-index:2147483647;left:16px;top:16px;width:480px;height:620px;min-width:min(280px,100vw);min-height:200px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);display:block;font:11px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:white;color:#38414b;border:1px solid #b9bec5;border-radius:4px;box-shadow:0 6px 22px #20283026;overflow:hidden}
*{box-sizing:border-box}.frame{height:100%;display:flex;flex-direction:column}.bar{display:flex;align-items:center;height:25px;min-height:25px;padding:0 4px;border-bottom:1px solid #d8d8dc;background:#eceef1;cursor:move;touch-action:none;user-select:none}.title{flex:1;min-width:0;text-align:left;padding-left:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:600}.body{flex:1;min-height:0;display:flex;flex-direction:column}.resize{position:absolute;right:2px;bottom:2px;width:14px;height:14px;cursor:nwse-resize;touch-action:none;background:repeating-linear-gradient(135deg,transparent 0 3px,#aab0b8 3px 4px,transparent 4px 6px);clip-path:polygon(100% 0,100% 100%,0 100%)}button{font:inherit;color:#69727c;background:transparent;border:0;cursor:pointer}.close,.collapse{width:22px;flex:none;height:22px;font-size:18px;line-height:18px;padding:0}.close:hover,.collapse:hover{background:#dce1e7}.bar:focus-visible,button:focus-visible{outline:2px solid #356f9f;outline-offset:-2px}.resize:focus-visible{clip-path:none}::slotted(*){min-height:0}
:host([collapsed]){height:27px!important;min-height:27px}:host([collapsed]) .body,:host([collapsed]) .resize{display:none}
</style><div class="frame" role="dialog" aria-modal="false" aria-labelledby="title"><div class="bar" tabindex="0" aria-label="Move inspector: arrow keys, Home to reset"><span class="title" id="title"></span><button class="collapse" type="button" aria-label="Collapse inspector" aria-expanded="true" aria-controls="palette-body">−</button><button class="close" type="button" aria-label="Close inspector">×</button></div><div class="body" id="palette-body"><slot></slot></div><button class="resize" type="button" aria-label="Resize inspector: arrow keys"></button></div>`;
        this._bar=this.shadowRoot.querySelector('.bar');
        this._grip=this.shadowRoot.querySelector('.resize');
        this._collapse=this.shadowRoot.querySelector('.collapse');
        this._collapse.addEventListener('click',()=>{this.collapsed=!this.collapsed;});
        this.shadowRoot.querySelector('.close').addEventListener('click',()=>this.dispatchEvent(
            new this.ownerDocument.defaultView.CustomEvent('close',{bubbles:true,composed:true})));
        for (const handle of [this._bar,this._grip]) {
            handle.addEventListener('pointerdown',event=>{
                if(event.button!==0 || (handle===this._bar && event.target.closest('button'))) return;
                this._gesture={x:event.clientX,y:event.clientY,rect:this.getBoundingClientRect(),resize:handle===this._grip};
                handle.setPointerCapture(event.pointerId); event.preventDefault();
            });
            handle.addEventListener('pointermove',event=>{
                if(this._gesture) this._adjust(this._gesture.rect,event.clientX-this._gesture.x,event.clientY-this._gesture.y,this._gesture.resize);
            });
            for(const name of ['pointerup','pointercancel','lostpointercapture']) handle.addEventListener(name,()=>{this._gesture=null;});
            handle.addEventListener('keydown',event=>{
                if(event.target!==handle) return;
                if(event.key==='Home' && handle===this._bar){this.style.left='16px';this.style.top='16px';event.preventDefault();return;}
                const step=event.shiftKey?1:10;
                const delta={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]}[event.key];
                if(delta){event.preventDefault();this._adjust(this.getBoundingClientRect(),...delta,handle===this._grip);}
            });
        }
        this._fit=()=>this._adjust(this.getBoundingClientRect(),0,0,false);
    }
    get collapsed(){return this.hasAttribute('collapsed');}
    set collapsed(value){this.toggleAttribute('collapsed',value);}
    attributeChangedCallback(name){
        if(name==='title') this.shadowRoot.querySelector('.title').textContent=this.getAttribute('title')??'';
        else {
            this._collapse.textContent=this.collapsed?'＋':'−';
            this._collapse.setAttribute('aria-expanded',String(!this.collapsed));
            this._collapse.setAttribute('aria-label',this.collapsed?'Expand inspector':'Collapse inspector');
        }
    }
    connectedCallback(){this.ownerDocument.defaultView.addEventListener('resize',this._fit);}
    disconnectedCallback(){this.ownerDocument.defaultView.removeEventListener('resize',this._fit);this._gesture=null;}
    _adjust(rect,dx,dy,resize){
        const win=this.ownerDocument.defaultView;
        if(resize && this.collapsed)return;
        if(resize){this.style.width=Math.max(Math.min(280,win.innerWidth-16),Math.min(win.innerWidth-16,rect.width+dx))+'px';
            this.style.height=Math.max(Math.min(200,win.innerHeight-16),Math.min(win.innerHeight-16,rect.height+dy))+'px';}
        else{this.style.left=Math.max(0,Math.min(win.innerWidth-Math.min(rect.width,win.innerWidth),rect.left+dx))+'px';
            this.style.top=Math.max(0,Math.min(win.innerHeight-25,rect.top+dy))+'px';}
    }
}
customElements.define('gramlot-poc-palette',GramlotPocPalette);
