// Copyright 2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
// Inspector subset of DevTools panel-tabs.css. Source owns the tab buttons and selection.
export class GramlotPocTabs extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode:'open'}).innerHTML=`<style>
:host{display:flex;flex:none;background:var(--gramlot-surface-subtle, #edf2fa);border-bottom:1px solid var(--gramlot-border, #d3e3fd)}
::slotted(button){height:25px;padding:0 10px;border:0;border-radius:0;border-bottom:2px solid transparent;background:transparent;color:var(--gramlot-ink, #474747);font:500 11px/23px system-ui,sans-serif;cursor:pointer}
::slotted(button:hover){background:var(--gramlot-selected, #e1e5ed)}::slotted(button[aria-selected=true]){color:var(--gramlot-action, #0b57d0);border-bottom-color:var(--gramlot-action, #0b57d0)}::slotted(button:focus-visible){outline:2px solid var(--gramlot-action, #0b57d0);outline-offset:-2px}
</style><slot></slot>`;
        this.addEventListener('keydown',event=>{
            if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
            const tabs=[...this.children].filter(element=>element.getAttribute('role')==='tab');
            const index=tabs.indexOf(event.target); if(index<0)return;
            const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
            event.preventDefault();tabs[next].focus();tabs[next].click();
        });
    }
}
customElements.define('gramlot-poc-tabs',GramlotPocTabs);
