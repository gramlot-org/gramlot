import {Bag, sourceTarget} from '@gramlot/gramlot';
import {positionPopup} from './popup.js';
import {cellText} from './grid-rows.js';
import {SVG_NS} from '../renderer/attributes.js';
import {randomId} from '../random-id.js';

/** Source composition over a derived Data Bag; accepted filters remain in the outer view. */
export class GridColumnFilters {
    #host; #head; #view; #columns = []; #format; #context;
    #panel; #anchor = null; #field = null; #pane; #frame; #search; #path; #data;
    #rangeQueued = false; #rangeFields = [];
    #release; #registrations = []; #connected = false; #syncing = false;
    constructor(host, head) {
        this.#host=host;this.#head=head;
        const panel=this.#panel=host.ownerDocument.createElement('div');
        panel.className='column-filter-panel';panel.setAttribute('popover','auto');panel.setAttribute('role','dialog');
        const slot=host.ownerDocument.createElement('slot');slot.name='column-filter';panel.append(slot);
        panel.addEventListener('toggle',event=>{if(event.newState==='closed' && !panel.matches(':popover-open'))this.#closed();});
        host.addEventListener('keydown',event=>{
            if(this.#anchor && event.key==='Escape'){event.preventDefault();event.stopPropagation();this.close();}
        });
        host.shadowRoot.append(panel);
    }
    setSourceContext(context) {
        this.#context=context;
        const owner=context.sourceNode,builder=owner.rootBuilder;
        // Prepare the child Source during initial component construction, before it is rendered.
        // Opening the popup later inserts children; it never replaces the grid Source value.
        if(owner.staticValue===null)owner.setValue(new builder.source.constructor(null,builder),false);
        context.sourceNode.rootBuilder.binding.bindingFor(context.sourceNode).track(()=>this.dispose());
    }
    #build() {
        if(this.#data)return;
        const owner=this.#context.sourceNode,builder=owner.rootBuilder;
        this.#path=`_gramlot.grid.${randomId()}.columnFilter`;
        this.#data=new Bag({rows:new Bag(),checked:'',title:'',summary:'',from:null,to:null,hideRange:true,rangeError:''});
        owner.setRelativeData(this.#path,this.#data);
        const container=builder.wrapSource(owner).div({node_label:`column_filter_${randomId()}`,slot:'column-filter',
            display:'flex',flex_direction:'column',gap:'8px',padding:'10px',
            style:'font-size:12px;--gramlot-grid-row-height:28px;--gramlot-grid-font-size:12px;--gramlot-grid-cell-padding:4px 7px;--gramlot-menu-item-padding:4px 7px'});
        this.#pane=sourceTarget(container);
        this.#pane.setAttr({datapath:this.#path});
        const fragment=new builder.source.constructor(null,builder);
        const pane=builder.wrapSource(fragment);
        pane.div('^.title',{font_weight:'600',padding:'0 2px'});
        const dates=pane.div({display:'flex',gap:'8px',hidden:'^.hideRange'});
        this.#rangeFields=[sourceTarget(dates.dateTextBox({value:'^.from',period_to:'.to',lbl:'From',width:'136px'})),
            sourceTarget(dates.dateTextBox({value:'^.to',lbl:'To',width:'136px'}))];
        pane.div('^.rangeError',{role:'alert',color:'var(--gramlot-error)'});
        const frame=pane.frameGrid({storepath:'.rows',rowMode:'attributes',height:'270px',width:'100%'});
        this.#frame=sourceTarget(frame);
        this.#search=sourceTarget(frame.toolbar.menuline({group:true,class:'gramlot-grid-search'})
            .searchBox({searchOn:'Value:caption',searchLiteral:true}));
        const grid=frame.grid;
        grid.setAttr({sortedBy:'caption:a'});
        const struct=grid.struct();
        struct.column({field:'selected',name:'✓',title:'Selected values',width:'32px',align:'center',check:'multiple',checked:'^.checked',checkedField:'id'});
        struct.column({field:'caption',name:'Value',width:'170px'});
        struct.column({field:'count',name:'Rows',dtype:'L',width:'64px',align:'end'});
        const bar=pane.menu({presentation:'bar',aria_label:'Column filter actions'});
        Object.defineProperty(sourceTarget(bar),'gridColumnFilters',{value:this,configurable:true});
        for(const [caption,method] of [['All','selectAll'],['None','selectNone'],['Reset','reset']]) {
            bar.menuline({caption,action:`this.parentBag.parentNode.gridColumnFilters.${method}()`});
        }
        pane.div('^.summary',{color:'var(--gramlot-text-secondary)',font_size:'11px',padding:'0 2px'});
        const prepared=builder.binding.gramlot.src.prepareSource(fragment);
        builder.binding.renderer.validateCandidate(prepared);
        this.#pane.setValue(prepared);
        this.#subscribeData();
    }
    #subscribeData() {
        if(!this.#data || this.#registrations.length)return;
        const router=this.#context.sourceNode.rootBuilder.binding.router;
        this.#registrations.push(router.register({path:this.#path+'.checked',recipient:{receive:()=>this.#selectionChanged()}}));
        for(const name of ['from','to'])this.#registrations.push(router.register({path:this.#path+'.'+name,recipient:{receive:()=>this.#queueRange()}}));
    }
    #selectionChanged() {
        if(this.#syncing || this.#field===null)return;
        const checked=','+this.#data.getItem('checked')+',';
        const nodes=this.#data.getItem('rows').getNodes();
        const values=nodes.filter(node=>checked.includes(','+node.label+',' )).map(node=>node.getAttr('value'));
        this.#view.applyColumnFilter(this.#field,this.#view.columnRange(this.#field) && values.length===nodes.length ? null : values);
    }
    #queueRange() {
        if(this.#syncing || this.#rangeQueued || this.#field===null)return;
        this.#rangeQueued=true;
        // period_to and the edited start commit in the same turn.
        queueMicrotask(()=>{this.#rangeQueued=false;if(this.#field!==null && this.#connected)this.#rangeChanged();});
    }
    #rangeChanged() {
        const column=this.#columns.find(item=>item.field===this.#field);
        if(!['D','DH','DHZ'].includes(column.dtype))return;
        let from=this.#data.getItem('from'),to=this.#data.getItem('to');
        const previous=this.#view.columnRange(this.#field);
        if(previous?.from && !from){to=null;this.#syncing=true;this.#data.setItem('to',null);this.#syncing=false;}
        if(from && to && from>to){this.#data.setItem('rangeError','From must not be after To.');return;}
        this.#data.setItem('rangeError','');
        if(+from===+(previous?.from ?? null) && +to===+(previous?.to ?? null))return;
        const values=!from && !to ? this.#view.columnFacets(this.#field).filter(item=>item.selected).map(item=>item.value) : null;
        this.#view.applyColumnFilter(this.#field,values,{from,to,dtype:column.dtype,timeZone:this.#context.timeZone});
    }
    selectAll() { this.#view.applyColumnFilter(this.#field,this.#view.columnRange(this.#field) ? null : this.#view.columnFacets(this.#field).map(item=>item.value)); }
    selectNone() { this.#view.applyColumnFilter(this.#field,[]); }
    reset() {
        this.#syncing=true;
        try {
            this.#data.setItem('from',null);this.#data.setItem('to',null);this.#data.setItem('rangeError','');
            const renderer=this.#context.sourceNode.rootBuilder.binding.renderer;
            for(const node of this.#rangeFields)renderer.getDomNode(node).restoreFormValue(null);
        } finally {this.#syncing=false;}
        this.#view.applyColumnFilter(this.#field,null,null);
    }
    button(column) {
        const doc = this.#host.ownerDocument, button = doc.createElement('button');
        button.type = 'button'; button.className = 'column-filter'; button.dataset.field = column.field;
        button.setAttribute('aria-label',`Filter ${column.title ?? column.name}`);
        button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');
        button.title = `Filter ${column.title ?? column.name}`;
        const svg=doc.createElementNS(SVG_NS,'svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
        const path=doc.createElementNS(SVG_NS,'path');path.setAttribute('d','M3 5h18l-7 8v6l-4 2v-8z');svg.append(path);button.append(svg);
        return button;
    }
    update(view,columns,enabled,format) {
        if(view!==this.#view){this.close();this.#release?.();this.#release=null;this.#view=view;}
        this.#columns=columns;this.#format=format;
        if(!enabled || this.#anchor && !this.#anchor.isConnected)this.close();
        if(this.#connected && !this.#release)this.#release=view.subscribe(this.refresh);
        this.refresh();
    }
    #click = event => {
        const anchor=event.target.closest('.column-filter');
        if(!anchor)return;event.stopPropagation();
        if(anchor===this.#anchor){this.close();return;}
        this.close();this.#build();this.#anchor=anchor;this.#field=anchor.dataset.field;
        this.#syncing=true;
        const range=this.#view.columnRange(this.#field);
        this.#data.setItem('from',range?.from ?? null);this.#data.setItem('to',range?.to ?? null);this.#data.setItem('rangeError','');
        const column=this.#columns.find(item=>item.field===this.#field);
        this.#data.setItem('hideRange',!['D','DH','DHZ'].includes(column.dtype));
        const renderer=this.#context.sourceNode.rootBuilder.binding.renderer;
        for(const [index,key] of ['from','to'].entries())renderer.getDomNode(this.#rangeFields[index]).restoreFormValue(this.#data.getItem(key));
        this.#data.getItem('rows').clear();this.#data.setItem('checked','');renderer.getDomNode(this.#search).clear();
        this.#syncing=false;
        this.refresh();this.#panel.showPopover();anchor.setAttribute('aria-expanded','true');this.#position();
        this.#context.sourceNode.rootBuilder.binding.renderer.getDomNode(this.#search).focus();
    };
    refresh = () => {
        if(!this.#view)return;
        for(const button of this.#head.querySelectorAll('.column-filter')) {
            const active=(this.#view.columnFilter(button.dataset.field)!==null || this.#view.columnRange(button.dataset.field)!==null);
            button.classList.toggle('active',active);button.closest('th').classList.toggle('column-filtered',active);
            button.setAttribute('aria-pressed',String(active));
        }
        if(this.#field===null)return;
        const column=this.#columns.find(column=>column.field===this.#field);
        if(!column){this.close();return;}
        const title=column.title??column.name;
        this.#panel.setAttribute('aria-label',`Filter ${title}`);
        const entries=this.#view.columnFacets(this.#field),rows=this.#data.getItem('rows');
        this.#frame.setAttr({height:`${76+28*Math.max(1,Math.min(entries.length,8))}px`});
        const existing=new Map(rows.getNodes().map(node=>[node.getAttr('key'),node]));
        const selected=[];
        this.#syncing=true;
        try {
            this.#data.setItem('title',title);
            for(const entry of entries) {
                const caption=entry.value===null?'Empty':cellText(entry.value,column,this.#format);
                const attrs={key:entry.key,value:entry.value,caption,count:entry.count};
                let node=existing.get(entry.key);
                if(node){existing.delete(entry.key);node.setAttr(attrs);}
                else {const id=`v_${randomId()}`;rows.setItem(id,null,{...attrs,id});node=rows.getNode(id);}
                if(entry.selected)selected.push(node.label);
            }
            for(const node of existing.values())rows.popNode(node.label);
            const checked=selected.join(',');
            if(this.#data.getItem('checked')!==checked)this.#data.setItem('checked',checked);
            this.#data.setItem('summary',`${selected.length} of ${entries.length} values selected`);
        } finally {this.#syncing=false;}
        this.#position();
    };
    #position = () => {if(this.#anchor)positionPopup(this.#panel,this.#anchor,{align:'start'});};
    #closed(){this.#anchor?.setAttribute('aria-expanded','false');this.#anchor=null;this.#field=null;}
    close(){if(!this.#anchor)return;const anchor=this.#anchor;this.#panel.hidePopover();this.#closed();if(anchor.isConnected)anchor.focus({preventScroll:true});}
    connect(){
        if(this.#connected)return;this.#connected=true;this.#subscribeData();
        this.#head.addEventListener('click',this.#click);
        this.#host.ownerDocument.defaultView.addEventListener('resize',this.#position);
        this.#host.ownerDocument.defaultView.addEventListener('scroll',this.#position,true);
    }
    disconnect(){
        this.close();this.#connected=false;this.#release?.();this.#release=null;
        for(const registration of this.#registrations)registration.close();this.#registrations=[];
        this.#head.removeEventListener('click',this.#click);
        this.#host.ownerDocument.defaultView.removeEventListener('resize',this.#position);
        this.#host.ownerDocument.defaultView.removeEventListener('scroll',this.#position,true);
    }
    dispose(){this.disconnect();if(this.#path)this.#context.sourceNode.data.popNode(this.#path);}
}
