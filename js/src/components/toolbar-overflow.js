import {SVG_NS} from '../renderer/attributes.js';
/** Responsive menu projection. Original Source and light-DOM nodes never move. */
import {positionPopup} from './popup.js';

export class ToolbarOverflow {
    #menu; #viewport; #panel; #button; #resize; #events; #openEvents;
    #frame = null; #opened = false; #units = []; #overflow = new Set();
    constructor(menu, slot) {
        this.#menu=menu;
        const doc=menu.ownerDocument;
        this.#viewport=doc.createElement('div'); this.#viewport.className='toolbar-viewport';
        this.#viewport.append(slot);
        this.#button=doc.createElement('button'); this.#button.type='button';
        this.#button.className='toolbar-more'; this.#button.hidden=true;
        this.#button.title='More commands';
        const icon=doc.createElementNS(SVG_NS,'svg');
        icon.setAttribute('viewBox','0 0 24 24'); icon.setAttribute('aria-hidden','true'); icon.setAttribute('focusable','false');
        const path=doc.createElementNS(SVG_NS,'path');
        path.setAttribute('d','m5 6 6 6-6 6m8-12 6 6-6 6'); path.setAttribute('fill','none');
        path.setAttribute('stroke','currentColor'); path.setAttribute('stroke-width','1.8');
        path.setAttribute('stroke-linecap','round'); path.setAttribute('stroke-linejoin','round');
        icon.append(path); this.#button.append(icon);
        this.#button.setAttribute('aria-label','More commands'); this.#button.setAttribute('aria-haspopup','menu');
        this.#button.setAttribute('aria-expanded','false');
        this.#panel=doc.createElement('div'); this.#panel.className='toolbar-overflow';
        this.#panel.setAttribute('popover','manual'); this.#panel.setAttribute('role','menu'); this.#panel.tabIndex=-1;
        const overflowSlot=doc.createElement('slot'); overflowSlot.name='overflow'; this.#panel.append(overflowSlot);
        this.#button.addEventListener('click',()=>this.#opened?this.close():this.open());
        this.#button.addEventListener('keydown',event=>{
            if(['ArrowDown','ArrowRight'].includes(event.key)){event.preventDefault();event.stopPropagation();this.open();}
        });
        this.#panel.addEventListener('keydown',event=>{
            if(event.key==='Escape' && !event.composedPath().some(node=>node.localName==='gramlot-menu' && node!==menu)){
                event.preventDefault();event.stopPropagation();this.close();
            }
        });
        const style=doc.createElement('style');
        style.textContent=`
          :host([role=toolbar]){min-width:0;min-height:0;max-width:100%;width:100%;flex-shrink:1;gap:0}
          :host([role=toolbar][aria-orientation=vertical]){width:auto;height:100%;max-height:100%}
          .toolbar-viewport{display:contents}
          :host([role=toolbar]) .toolbar-viewport{display:flex;align-items:center;gap:var(--gramlot-toolbar-gap,4px);flex:1 1 0%;min-width:0;min-height:0;overflow-x:auto;overflow-y:hidden}
          :host([role=toolbar][aria-orientation=vertical]) .toolbar-viewport{flex-direction:column;align-items:stretch;overflow-x:hidden;overflow-y:auto;width:100%}
          :host([role=toolbar]) ::slotted(*){flex-shrink:0}
          .toolbar-more{flex:0 0 auto;width:max(var(--gramlot-field-height,32px),var(--gramlot-touch-target,0px));height:max(var(--gramlot-field-height,32px),var(--gramlot-touch-target,0px));padding:0;border:0;border-radius:4px;background:transparent;color:inherit;font:inherit;display:grid;place-items:center}
          .toolbar-more svg{display:block;width:18px;height:18px;pointer-events:none}
          .toolbar-more:hover,.toolbar-more:focus-visible{background:var(--gramlot-selected,Highlight)}
          :host([role=toolbar][aria-orientation=vertical]) .toolbar-more{width:100%}
          .toolbar-more[hidden]{display:none}
          .toolbar-overflow{position:fixed;inset:auto;margin:0;padding:5px;box-sizing:border-box;min-width:min(16rem,var(--gramlot-popup-available-width));width:max-content;
             max-width:var(--gramlot-popup-available-width);max-height:var(--gramlot-popup-available-height);overflow:auto;
             background:var(--gramlot-field-background,Canvas);color:var(--gramlot-ink,CanvasText);border:1px solid var(--gramlot-border-control,#888);border-radius:var(--gramlot-radius-lg,9px);box-shadow:0 8px 28px #0004}
          .toolbar-overflow ::slotted([role=separator]){margin:5px 7px;border-top:1px solid var(--gramlot-border-control,#888)}
        `;
        menu.shadowRoot.append(style,this.#viewport,this.#button,this.#panel);
    }
    get opened(){return this.#opened;}
    get button(){return this.#button;}
    get panel(){return this.#panel;}
    contains(item){
        let unit=item;
        while(unit && unit.parentElement!==this.#menu)unit=unit.parentElement;
        return this.#overflow.has(unit);
    }
    connect(){
        if(!this.#menu.permanent || this.#resize)return;
        const win=this.#menu.ownerDocument.defaultView;
        this.#events=new win.AbortController();
        this.#resize=new win.ResizeObserver(()=>this.schedule());
        this.#resize.observe(this.#menu);
        this.#menu.ownerDocument.fonts.addEventListener('loadingdone',()=>this.schedule(),{signal:this.#events.signal});
        this.schedule();
    }
    disconnect(){
        this.close(false); this.#resize?.disconnect();this.#resize=null;this.#events?.abort();
        if(this.#frame!==null)this.#menu.ownerDocument.defaultView.cancelAnimationFrame(this.#frame);
        this.#frame=null;this.#units=[];
    }
    schedule(){
        if(!this.#menu.isConnected)return;
        if(!this.#menu.permanent){
            this.disconnect();
            for(const unit of this.#menu.children){unit.removeAttribute('slot');unit.removeAttribute('data-menu-overflow');}
            this.#overflow.clear();this.#button.hidden=true;return;
        }
        if(!this.#resize)this.connect();
        if(this.#frame!==null)return;
        this.#frame=this.#menu.ownerDocument.defaultView.requestAnimationFrame(()=>{this.#frame=null;this.layout();});
    }
    layout(){
        const menu=this.#menu,win=menu.ownerDocument.defaultView;
        if(!menu.permanent || !menu.isConnected)return;
        const vertical=menu.parameters.orientation==='vertical',axis=vertical?'height':'width';
        const style=win.getComputedStyle(menu);
        const available=(vertical?menu.clientHeight:menu.clientWidth)-parseFloat(style[vertical?'paddingTop':'paddingLeft']||0)-parseFloat(style[vertical?'paddingBottom':'paddingRight']||0);
        if(available<=0)return;
        let active=menu.ownerDocument.activeElement;
        while(active?.shadowRoot?.activeElement)active=active.shadowRoot.activeElement;
        const units=[...menu.children].filter(unit=>!unit.hidden && (unit.localName!=='gramlot-menu' || unit.permanent));
        for(const unit of this.#units)if(!units.includes(unit)){
            this.#resize.unobserve(unit);unit.removeAttribute('slot');unit.removeAttribute('data-menu-overflow');
        }
        for(const unit of units)if(!this.#units.includes(unit))this.#resize.observe(unit);
        this.#units=units;
        // Measure each original node in its toolbar presentation, then distribute
        // slots synchronously before paint. No clones or Source changes are made.
        for(const unit of units){unit.removeAttribute('slot');unit.removeAttribute('data-menu-overflow');}
        this.#overflow.clear();
        menu.refreshItems();
        for(const item of menu.items)item.refreshAvailability();
        const gap=parseFloat(win.getComputedStyle(this.#viewport).gap)||0;
        const lengths=new Map(units.map(unit=>{
            const css=win.getComputedStyle(unit);
            const length=unit.localName==='gramlot-spacer'?(unit.parameters.size??0):unit.getBoundingClientRect()[axis];
            return [unit,length+(parseFloat(css[vertical?'marginTop':'marginLeft'])||0)+(parseFloat(css[vertical?'marginBottom':'marginRight'])||0)];
        }));
        const separator=unit=>unit.getAttribute('role')==='separator';
        const tidy=list=>list.filter((unit,index)=>!separator(unit) ||
            list.slice(0,index).some(item=>item.localName!=='gramlot-spacer'&&!separator(item)) &&
            list.slice(index+1).find(item=>item.localName!=='gramlot-spacer') &&
            !separator(list.slice(index+1).find(item=>item.localName!=='gramlot-spacer')));
        const required=remaining=>remaining.reduce((sum,unit)=>sum+lengths.get(unit),0)+Math.max(0,remaining.length-1)*gap;
        let remaining=tidy(units);
        if(required(remaining)>available){
            const candidates=units.map((unit,index)=>({unit,index})).filter(({unit})=>unit.localName==='gramlot-menu-line' && !separator(unit) && unit.parameters.overflowable)
                .sort((a,b)=>a.unit.parameters.priority-b.unit.parameters.priority || b.index-a.index);
            for(const {unit} of candidates){
                if(required(remaining)<=available-32)break;
                this.#overflow.add(unit);remaining=tidy(remaining.filter(item=>item!==unit));
            }
        }
        const overflowRows=tidy(units.filter(unit=>this.#overflow.has(unit)||separator(unit)&&!remaining.includes(unit)));
        for(const unit of overflowRows)this.#overflow.add(unit);
        for(const unit of units)if(separator(unit)&&!remaining.includes(unit)&&!this.#overflow.has(unit))unit.slot='suppressed';
        for(const unit of this.#overflow){unit.slot='overflow';unit.setAttribute('data-menu-overflow','');}
        this.#button.hidden=this.#overflow.size===0;
        for(const item of menu.items)item.refreshAvailability();
        menu.refreshItems();
        const activeUnit=units.find(unit=>{
            let node=active;
            while(node){if(node===unit)return true;node=node.parentNode??node.host;}
            return false;
        });
        if(this.#overflow.size===0)this.close(false);
        else if(activeUnit && this.#overflow.has(activeUnit))this.open(false);
        else if(this.#opened)this.#place();
        if(activeUnit && active?.isConnected)active.focus({preventScroll:true});
        menu.refreshItems();
    }
    #place(){positionPopup(this.#panel,this.#button,{placement:this.#menu.parameters.orientation==='vertical'?'side':'bottom'});}
    open(focus=true){
        if(!this.#overflow.size)return;
        if(!this.#opened){
            this.#panel.showPopover();this.#opened=true;this.#button.setAttribute('aria-expanded','true');
            this.#openEvents=new this.#menu.ownerDocument.defaultView.AbortController();
            const options={signal:this.#openEvents.signal};
            this.#menu.ownerDocument.addEventListener('pointerdown',event=>{
                if(!event.composedPath().includes(this.#panel)&&!event.composedPath().includes(this.#button))this.close(false);
            },options);
            this.#menu.ownerDocument.addEventListener('scroll',()=>this.#place(),{...options,capture:true});
        }
        this.#menu.refreshItems();this.#place();
        if(focus){
            const focusable=element=>{
                if(element.hidden || element.disabled)return null;
                if(element.localName==='gramlot-menu-line'&&!element.parameters.group)return element.getAttribute('role')==='separator'?null:element;
                if(element.matches('input:not([type=hidden]),textarea,select,button,[tabindex="0"]'))return element;
                for(const child of element.children){const found=focusable(child);if(found)return found;}
                return null;
            };
            const target=[...this.#menu.children].filter(unit=>this.#overflow.has(unit)).map(focusable).find(Boolean);
            (target??this.#panel).focus();
        }
    }
    close(restore=true){
        if(!this.#opened)return;
        for(const unit of this.#overflow)for(const child of unit.querySelectorAll('gramlot-menu'))if(!child.permanent)child.close(false);
        this.#panel.hidePopover();this.#opened=false;this.#openEvents?.abort();this.#button.setAttribute('aria-expanded','false');
        if(restore&&!this.#button.hidden)this.#button.focus();
    }
}
