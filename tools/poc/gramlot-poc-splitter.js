// Copyright 2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
// Vertical inspector subset of PoC collections/layout.js (borderContainer).
export class GramlotPocSplitter extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'}).innerHTML=`<style>
:host{display:grid;grid-template-rows:minmax(60px,var(--top-size,45%)) var(--separator-size,6px) minmax(60px,1fr);min-height:126px;flex:1;overflow:hidden}
.region{overflow:auto;min-height:0;min-width:0}.handle{position:relative;background:var(--gramlot-surface-subtle, #e4e7eb);cursor:row-resize;touch-action:none;user-select:none}.handle:after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:1px;width:28px;background:var(--gramlot-border, #c2c9d3)}.handle:hover{background:var(--gramlot-selected, #c4d9ef)}.handle:focus-visible{outline:2px solid var(--gramlot-focus-ring, #356f9f);outline-offset:-2px}::slotted(*){min-height:0}
</style><div class="region"><slot name="top"></slot></div><div class="handle" role="separator" aria-label="Resize tree and properties" aria-orientation="horizontal" tabindex="0" aria-valuemin="10" aria-valuemax="90" aria-valuenow="45"></div><div class="region"><slot name="bottom"></slot></div>`;
        const handle=this.shadowRoot.querySelector('.handle');
        handle.addEventListener('pointerdown',event=>{if(event.button!==0)return;this._dragging=true;handle.setPointerCapture(event.pointerId);event.preventDefault();});
        handle.addEventListener('pointermove',event=>{if(this._dragging){const rect=this.getBoundingClientRect();this._resize(100*(event.clientY-rect.top)/rect.height);}});
        for(const name of ['pointerup','pointercancel','lostpointercapture'])handle.addEventListener(name,()=>{this._dragging=false;});
        handle.addEventListener('keydown',event=>{if(!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
            event.preventDefault();const value=Number(handle.getAttribute('aria-valuenow'));
            this._resize(event.key==='Home'?10:event.key==='End'?90:value+(event.key==='ArrowUp'?-5:5));});
    }
    _resize(value){value=Math.max(10,Math.min(90,value));this.style.setProperty('--top-size',`${value}%`);
        this.shadowRoot.querySelector('.handle').setAttribute('aria-valuenow',String(Math.round(value)));}
    disconnectedCallback(){this._dragging=false;}
}
customElements.define('gramlot-poc-splitter',GramlotPocSplitter);
