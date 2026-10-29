/** Contained Labelbox movement. The store Bag is the sole geometry state. */
import {Bag} from '@gramlot/gramlot';
import {defineComponent} from './registry.js';
import {Container} from './container.js';
import {SVG_NS} from '../renderer/attributes.js';
import {randomId} from '../random-id.js';
import {corners, overlaps, contactFraction} from './tray-geometry.js';
import {createTraySettings} from './tray-settings.js';

export const TrayPane = defineComponent({
    name: 'trayPane', tag: 'gramlot-tray-pane', base: Container, subTags: '*', bagStore: true,
    parameters: {storepath: {dtype: 'T'}, locked: {dtype:'B',default:false,binding:'read'},
        gridStep:{dtype:'L',default:10,binding:'read'},gridVisible:{dtype:'B',default:false,binding:'read'},
        rotationStep:{dtype:'N',default:15,binding:'read'}},
    childParameters: {closable:{dtype:'B',default:false},minWidth:{dtype:'N',default:100},minHeight:{dtype:'N',default:64}},
    implementation: Base => class TrayPane extends Base {
        // Projection metadata, keyed by the existing renderer presentation.
        static #blocks = new WeakMap();
        static projectChild(box, attrs, {label, remove}) {
            if (!box.labelbox) throw new TypeError('trayPane children require a Labelbox (declare lbl)');
            const {minWidth=100, minHeight=64, closable=false, ...rest} = attrs;
            if(typeof closable!=='boolean')throw new TypeError('closable must be a boolean');
            if (![minWidth,minHeight].every(value=>typeof value==='number'&&Number.isFinite(value)&&value>0))
                throw new TypeError('trayPane minimum dimensions must be positive numbers');
            TrayPane.#blocks.set(box, {label, minWidth, minHeight, closable, remove});
            box.setAttribute('data-tray-block','');
            const settings=box.labelbox.traySettings ??= createTraySettings(box);
            for(const [key,{button}] of Object.entries(settings.controls)) {
                button.title=`${key==='layer'?'Layer':'Zoom'} for ${attrs.lbl ?? label}`;
                button.setAttribute('aria-label',button.title);
            }
            if(!box.labelbox.rotationHandle) {
                const doc=box.ownerDocument,handle=doc.createElement('button');
                handle.type='button';handle.className='tray-rotate';
                const icon=doc.createElementNS(SVG_NS,'svg'),path=doc.createElementNS(SVG_NS,'path');
                icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');
                path.setAttribute('d','M4 10a8 8 0 1 1 2 8M4 4v6h6');
                path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');
                path.setAttribute('stroke-width','1.5');path.setAttribute('stroke-linecap','round');
                path.setAttribute('stroke-linejoin','round');icon.append(path);handle.append(icon);
                box.labelbox.labelBox.append(handle);box.labelbox.rotationHandle=handle;
            }
            box.labelbox.rotationHandle.setAttribute('aria-label',`Rotate ${attrs.lbl ?? label}`);
            box.labelbox.rotationHandle.title='Rotate: drag around the center or use arrow keys';
            if(closable&&!box.labelbox.closeButton) {
                const button=box.ownerDocument.createElement('button');
                button.type='button';button.className='tray-close';
                const icon=box.ownerDocument.createElementNS(SVG_NS,'svg');
                const path=box.ownerDocument.createElementNS(SVG_NS,'path');
                icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');
                path.setAttribute('d','m6 6 12 12M18 6 6 18');
                path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');
                path.setAttribute('stroke-width','1.5');path.setAttribute('stroke-linecap','round');
                icon.append(path);button.append(icon);box.labelbox.labelBox.append(button);
                box.labelbox.closeButton=button;
            }
            if(box.labelbox.closeButton) {
                box.labelbox.closeButton.hidden=!closable;
                box.labelbox.closeButton.title=`Remove ${attrs.lbl ?? label}`;
                box.labelbox.closeButton.setAttribute('aria-label',box.labelbox.closeButton.title);
            }
            box.toggleAttribute('data-movable', true);
            box.toggleAttribute('data-resizable', true);
            if (!box.labelbox.resizeHandle) {
                const doc=box.ownerDocument, button=doc.createElement('button');
                button.type='button';button.className='tray-resize';
                const icon=doc.createElementNS(SVG_NS,'svg'),path=doc.createElementNS(SVG_NS,'path');
                icon.setAttribute('viewBox','0 0 16 16');icon.setAttribute('aria-hidden','true');
                path.setAttribute('d','M5 13 13 5M9 13l4-4');path.setAttribute('fill','none');
                path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','1.25');
                path.setAttribute('stroke-linecap','round');icon.append(path);button.append(icon);
                box.append(button);box.labelbox.resizeHandle=button;
            }
            if (box.labelbox.resizeHandle) {
                box.labelbox.resizeHandle.hidden=false;
                box.labelbox.resizeHandle.setAttribute('aria-label',`Resize ${attrs.lbl ?? label}`);
                box.labelbox.resizeHandle.title='Resize: drag or use arrow keys';
            }
            if (box.parentElement instanceof TrayPane) box.parentElement.#schedule();
            return {...rest, box_position: 'absolute',
                ...(rest.lbl_variant == null ? {lbl_variant: 'card'} : {})};
        }
        #store;
        #settings=new Set();
        #subscription = `tray-${randomId()}`;
        #events;
        #scheduled = false;
        #drag;
        #writing = false;
        #suppressClick = false;
        constructor() {
            super();
            const style = this.ownerDocument.createElement('style');
            style.textContent = ':host{display:block;position:relative;isolation:isolate;overflow:hidden;min-height:0}.control-box{display:contents}:host::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:-2147483648;display:var(--tray-grid-display,none);background-image:linear-gradient(to right,color-mix(in srgb,currentColor 13%,transparent) 1px,transparent 1px),linear-gradient(to bottom,color-mix(in srgb,currentColor 13%,transparent) 1px,transparent 1px);background-size:var(--tray-grid-size) var(--tray-grid-size)}';
            style.textContent += '.tray-marquee{position:absolute;box-sizing:border-box;pointer-events:none;z-index:2147483647;border:1px solid var(--gramlot-brand-blue,#3766b5);background:color-mix(in srgb,var(--gramlot-brand-blue,#3766b5) 12%,transparent)}';
            this.shadowRoot.append(style);
        }
        projectAttributes(attrs) {
            const rest=super.projectAttributes(attrs);
            for(const key of ['gridStep','rotationStep']) {
                const value=this.parameters[key];
                if(typeof value!=='number'||!Number.isFinite(value)||value<0||(key==='gridStep'&&!Number.isInteger(value)))
                    throw new TypeError(`trayPane ${key} must be a nonnegative ${key==='gridStep'?'integer':'number'}`);
            }
            this.style.setProperty('--tray-grid-size',`${this.parameters.gridStep}px`);
            this.style.setProperty('--tray-grid-display',this.parameters.gridVisible&&this.parameters.gridStep>0?'block':'none');
            if(this.parameters.locked)this.#finish();
            this.#schedule();
            return rest;
        }
        setStoreBag(bag) {
            if (!(bag instanceof Bag)) throw new TypeError('trayPane storepath must resolve to a Bag');
            // External geometry changes end an in-progress gesture, without
            // overwriting the new store. Own writes retain pointer capture.
            if(this.#store!==bag) {
                this.#finish();

                this.#store?.unsubscribe(this.#subscription,{any:true});
                this.#store = bag;
                if(this.isConnected)this.#observeGeometry();
            }
            this.#schedule();
        }
        connectedCallback() {
            if(this.#store)this.#observeGeometry();
            this.#events = new this.ownerDocument.defaultView.AbortController();
            const options = {signal:this.#events.signal};
            this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => this.#schedule(), options);
            this.addEventListener('pointerdown', event => this.#start(event), options);
            this.addEventListener('pointermove', event => this.#move(event), options);
            this.addEventListener('keydown', event => this.#keyGeometry(event), options);
            this.ownerDocument.addEventListener('keydown',event=>{
                if(this.#drag?.marquee&&event.key==='Escape'){this.#cancel();event.preventDefault();event.stopPropagation();}
            },options);
            this.addEventListener('pointerup', event => {
                if (event.pointerId === this.#drag?.id) {
                    this.#move(event);
                    if(this.#drag?.pendingSelection&&!this.#drag.moved)this.#select(this.#drag.box,this.#drag.extend);
                    this.#finish();
                }
            }, options);
            this.addEventListener('pointercancel', event => {
                if (event.pointerId === this.#drag?.id) this.#cancel();
            }, options);
            this.addEventListener('lostpointercapture', event => {
                if (event.pointerId === this.#drag?.id) this.#cancel();
            }, options);
            this.addEventListener('click', event => {
                if (this.#suppressClick) { this.#suppressClick = false; event.preventDefault(); event.stopPropagation(); return; }
                if(this.parameters.locked)return;
                const path=event.composedPath(),box=path.find(item=>item.parentElement===this);
                if(!TrayPane.#blocks.has(box))return;
                const block=TrayPane.#blocks.get(box);
                if(block.closable&&path.includes(box.labelbox.closeButton)) {
                    event.preventDefault();event.stopPropagation();this.#finish();
                    box.labelbox.traySettings.remove();
                    this.#settings.delete(box.labelbox.traySettings);
                    block.remove();
                    if(this.#store.getNode(block.label))this.#store.popNode(block.label);
                    return;
                }
                const settings=box.labelbox.traySettings;
                for(const [key,{button}] of Object.entries(settings.controls))
                    if(path.includes(button))settings.open(this.#row(TrayPane.#blocks.get(box).label),key);
            }, {...options, capture:true});
            this.#schedule();
        }
        disconnectedCallback() {
            for(const settings of this.#settings)settings.remove();
            this.#finish(); this.#events.abort();
            this.#store?.unsubscribe(this.#subscription,{any:true});
        }
        #observeGeometry() {
            this.#store.subscribe(this.#subscription,{any:event=>{
                if(this.#writing)return;
                if(event.node.label!=='selected'||this.#drag?.members||this.#drag?.marquee)this.#finish();
                if(!['layer','rotation','scale'].includes(event.node.label) || !['upd_value','upd_value_attr'].includes(event.evt))return;
                const box=[...this.children].find(child=>
                    this.#store.getItem([TrayPane.#blocks.get(child).label])===event.node.parentBag);
                if(!box)return;
                const key=event.node.label,value=event.node.value;
                let accepted=value;
                if(key==='layer') {
                    if(!Number.isInteger(value) || this.#obstacles(box,value).some(other=>overlaps(this.#rectangle(box),other)))accepted=event.oldvalue;
                } else if(typeof value!=='number'||!Number.isFinite(value)||(key==='scale'&&value<=0))accepted=event.oldvalue;
                else {
                    const to=this.#rectangle(box),from={...to,[key]:event.oldvalue};
                    const fraction=contactFraction(from,to,this.#obstacles(box,event.node.parentBag.getItem('layer')),this.#bounds());
                    accepted=event.oldvalue+(value-event.oldvalue)*fraction;
                }
                if(accepted!==value) {
                    this.#writing=true;
                    try { event.node.setValue(accepted); } finally { this.#writing=false; }
                }
                this.#schedule();
            }});
        }
        #schedule() {
            if (this.#scheduled) return;
            this.#scheduled = true;
            queueMicrotask(() => {
                this.#scheduled = false;
                if (!this.isConnected || !this.#store) return;
                for(const settings of this.#settings)if(![...this.children].some(box=>box.labelbox.traySettings===settings)) {
                    settings.remove();this.#settings.delete(settings);
                }
                for (const box of this.children) {
                    const block = TrayPane.#blocks.get(box);
                    const row = this.#row(block.label);
                    box.style.left = `${row.getItem('left')}px`;
                    box.style.top = `${row.getItem('top')}px`;
                    box.style.zIndex = String(row.getItem('layer'));
                    box.style.transformOrigin='center';
                    box.style.transform=`rotate(${row.getItem('rotation')}deg) scale(${row.getItem('scale')})`;
                    const settings=box.labelbox.traySettings;
                    const locked=this.parameters.locked;
                    box.toggleAttribute('data-movable',!locked);
                    for(const [key,{button}] of Object.entries(settings.controls)) {
                        button.hidden=locked;
                        if(locked&&row.getItem(`settings.${key}Open`)===true)row.setItem(`settings.${key}Open`,false);
                    }
                    box.labelbox.rotationHandle.hidden=locked;
                    if(box.labelbox.closeButton)box.labelbox.closeButton.hidden=locked||!block.closable;
                    if(box.labelbox.resizeHandle)box.labelbox.resizeHandle.hidden=locked;
                    settings.mount(this,()=>this.#row(block.label),(key,value)=>{
                        if(!this.parameters.locked)this.#row(block.label).setItem(key,value);
                    });
                    settings.project(row);this.#settings.add(settings);
                    box.toggleAttribute('data-selected',!locked&&row.getItem('selected'));
                    if (row.getNode('width')) {
                        box.style.width=`${row.getItem('width')}px`;box.style.height=`${row.getItem('height')}px`;
                    } else {
                        const authored=this.ownerDocument.createElement('div').style;
                        authored.cssText=box.labelbox.previous.box.style ?? '';
                        box.style.width=authored.width;box.style.height=authored.height;
                    }
                }
            });
        }
        #row(label) {
            const node = this.#store.getNode([label]);
            let row = node?.value;
            if (!node) {
                row = new Bag({left:0, top:0, layer:0, selected:false});
                this.#store.setItem([label], row);
            }
            if (!(row instanceof Bag)) throw new TypeError(`trayPane position '${label}' must be a Bag`);
            if(!row.getNode('selected'))row.setItem('selected',false);
            for(const [key,value] of [['rotation',0],['scale',1]])if(!row.getNode(key))row.setItem(key,value);
            if(typeof row.getItem('rotation')!=='number'||!Number.isFinite(row.getItem('rotation')))
                throw new TypeError(`trayPane ${label}.rotation must be finite`);
            if(typeof row.getItem('scale')!=='number'||!Number.isFinite(row.getItem('scale'))||row.getItem('scale')<=0)
                throw new TypeError(`trayPane ${label}.scale must be positive`);
            if(typeof row.getItem('selected')!=='boolean')throw new TypeError(`trayPane ${label}.selected must be boolean`);
            if(!Number.isInteger(row.getItem('layer')))throw new TypeError(`trayPane ${label}.layer must be an integer`);
            for (const key of ['left', 'top']) {
                const value = row.getItem(key);
                if (typeof value !== 'number' || !Number.isFinite(value))
                    throw new TypeError(`trayPane ${label}.${key} must be a finite number`);
            }
            if (row.getNode('width') || row.getNode('height')) {
                for (const key of ['width','height']) {
                    const value=row.getItem(key);
                    if(typeof value!=='number'||!Number.isFinite(value)||value<=0)
                        throw new TypeError(`trayPane ${label}.${key} must be a positive number`);
                }
            }
            return row;
        }
        #rectangle(box) {
            const row=this.#row(TrayPane.#blocks.get(box).label);
            return {left:row.getItem('left'),top:row.getItem('top'),rotation:row.getItem('rotation'),scale:row.getItem('scale'),
                width:row.getNode('width') ? row.getItem('width') : box.offsetWidth,
                height:row.getNode('height') ? row.getItem('height') : box.offsetHeight};
        }
        #obstacles(box,layer) {
            return [...this.children].filter(other=>other!==box
                && this.#row(TrayPane.#blocks.get(other).label).getItem('layer')===layer)
                .map(other=>this.#rectangle(other));
        }
        #bounds(){return {width:this.clientWidth,height:this.clientHeight};}
        #constrain(box,row,values) {
            const from=this.#rectangle(box),to={...from,...values};
            const fraction=contactFraction(from,to,this.#obstacles(box,row.getItem('layer')),this.#bounds());
            // Fractional contact coordinates are retained: rounding outward could overlap.
            return Object.fromEntries(Object.entries(values).map(([key,value])=>
                [key,from[key]+(value-from[key])*fraction]));
        }
        #start(event) {
            if (this.parameters.locked || event.button !== 0 || this.#drag) return;
            this.#suppressClick = false;
            const path = event.composedPath(), box = path.find(item => item.parentElement === this);
            if(path.some(item=>item.classList?.contains('tray-settings-popup')&&item.parentNode===this.shadowRoot))return;
            // A nested tray handles its own blocks; interactive children still
            // receive the original event and keep their editing behavior.
            if(path.find(item=>item instanceof TrayPane)!==this)return;
            const block = TrayPane.#blocks.get(box);
            if (!block) {
                const rect=this.getBoundingClientRect(),overlay=this.ownerDocument.createElement('div');
                overlay.className='tray-marquee';overlay.hidden=true;overlay.setAttribute('aria-hidden','true');
                const marquee=[...this.children].map(child=>({box:child,row:this.#row(TrayPane.#blocks.get(child).label),
                    selected:this.#row(TrayPane.#blocks.get(child).label).getItem('selected')}));
                this.#drag={id:event.pointerId,marquee,overlay,extend:event.shiftKey,
                    x:event.clientX-rect.left-this.clientLeft,y:event.clientY-rect.top-this.clientTop};
                this.shadowRoot.append(overlay);
                if(!event.shiftKey)this.#select(null,false);
                this.setPointerCapture(event.pointerId);event.preventDefault();return;
            }
            const rotate=path.includes(box.labelbox.rotationHandle);
            const resize=path.includes(box.labelbox.resizeHandle);
            const move=path.includes(box.labelbox.labelBox)&&!path.some(item=>
                item instanceof this.ownerDocument.defaultView.Element&&item.matches('button,a,input,select,textarea,[contenteditable]'));
            // A selected title preserves the group until a click (without drag) completes.
            const pendingSelection=move&&this.#row(block.label).getItem('selected');
            if(!pendingSelection)this.#select(box,event.shiftKey);
            if(!rotate&&!resize&&!move)return;
            const row = this.#row(block.label), rect = this.getBoundingClientRect();
            const members=!rotate&&!resize ? [...this.children].filter(child=>child===box||this.#row(TrayPane.#blocks.get(child).label).getItem('selected'))
                .map(child=>({box:child,row:this.#row(TrayPane.#blocks.get(child).label),...this.#rectangle(child)})) : null;
            this.#drag = {box, row, members, pendingSelection, extend:event.shiftKey, moved:false, id:event.pointerId, left:row.getItem('left'), top:row.getItem('top'),
                resize, rotate, angle:row.getItem('rotation'), ...this.#rectangle(box),
                x:event.clientX-rect.left, y:event.clientY-rect.top};
            if(rotate)this.#drag.pointerAngle=Math.atan2(event.clientY-rect.top-this.clientTop-this.#drag.top-this.#drag.height/2,
                event.clientX-rect.left-this.clientLeft-this.#drag.left-this.#drag.width/2);
            if(members)for(const member of members)member.box.setAttribute('data-moving','');
            else box.setAttribute(rotate?'data-rotating':'data-resizing','');
            this.setPointerCapture(event.pointerId);
            event.preventDefault();
        }
        #select(box,extend) {
            for(const child of this.children) {
                const row=this.#row(TrayPane.#blocks.get(child).label);
                const selected=child===box ? (extend ? !row.getItem('selected') : true)
                    : (box && extend ? row.getItem('selected') : false);
                this.#write(row,{selected});
            }
        }
        #write(row, values) {
            this.#writing = true;
            try {
                for(const [key,value] of Object.entries(values))
                    if(row.getItem(key)!==value)row.setItem(key,value);
            } finally { this.#writing = false; }
            this.#schedule();
        }
        #move(event) {
            const drag = this.#drag;
            if (!drag || event.pointerId !== drag.id) return;
            if(drag.marquee){this.#marqueeMove(event);return;}
            if (drag.box.parentElement !== this||drag.members?.some(member=>member.box.parentElement!==this)) { this.#finish(); return; }
            const rect = this.getBoundingClientRect();
            const dx=event.clientX-rect.left-drag.x,dy=event.clientY-rect.top-drag.y;
            if(drag.rotate){
                const x=event.clientX-rect.left-this.clientLeft-drag.left-drag.width/2,y=event.clientY-rect.top-this.clientTop-drag.top-drag.height/2;
                if(Math.hypot(x,y)<1)return;
                const angle=Math.atan2(y,x),difference=angle-drag.pointerAngle;
                const delta=Math.atan2(Math.sin(difference),Math.cos(difference))*180/Math.PI;
                drag.pointerAngle=angle;
                drag.angle+=delta;
                const rotation=this.#snap(drag.angle,this.parameters.rotationStep,event.shiftKey);
                this.#write(drag.row,this.#constrain(drag.box,drag.row,{rotation}));
                this.#suppressClick=true;event.preventDefault();return;
            }
            if(drag.resize){
                const angle=drag.rotation*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
                this.#resize(drag.box,drag.row,
                    this.#snap(drag.width+(c*dx+s*dy)/drag.scale,this.parameters.gridStep,event.shiftKey),
                    this.#snap(drag.height+(-s*dx+c*dy)/drag.scale,this.parameters.gridStep,event.shiftKey),drag);
                this.#suppressClick=true;event.preventDefault();return;
            }
            if(dx===0&&dy===0&&!drag.moved)return;
            drag.moved=true;
            const left=this.#snap(Math.round(drag.left+dx),this.parameters.gridStep,event.shiftKey),
                top=this.#snap(Math.round(drag.top+dy),this.parameters.gridStep,event.shiftKey);
            if (left !== drag.left || top !== drag.top) this.#suppressClick = true;
            const delta={left:left-drag.row.getItem('left'),top:top-drag.row.getItem('top')};
            const moving=new Set(drag.members.map(member=>member.box));
            let fraction=1;
            for(const member of drag.members) {
                const from=this.#rectangle(member.box),to={...from,left:from.left+delta.left,top:from.top+delta.top};
                const obstacles=[...this.children].filter(other=>!moving.has(other)
                    &&this.#row(TrayPane.#blocks.get(other).label).getItem('layer')===member.row.getItem('layer'))
                    .map(other=>this.#rectangle(other));
                fraction=Math.min(fraction,contactFraction(from,to,obstacles,this.#bounds()));
            }
            for(const member of drag.members)this.#write(member.row,{
                left:member.row.getItem('left')+delta.left*fraction,top:member.row.getItem('top')+delta.top*fraction});
            event.preventDefault();
        }
        #marqueeMove(event) {
            const drag=this.#drag,rect=this.getBoundingClientRect();
            const x=Math.max(0,Math.min(this.clientWidth,event.clientX-rect.left-this.clientLeft));
            const y=Math.max(0,Math.min(this.clientHeight,event.clientY-rect.top-this.clientTop));
            const left=Math.min(drag.x,x),top=Math.min(drag.y,y),right=Math.max(drag.x,x),bottom=Math.max(drag.y,y);
            const moved=right>left&&bottom>top;
            Object.assign(drag.overlay.style,{left:`${left}px`,top:`${top}px`,width:`${right-left}px`,height:`${bottom-top}px`});
            drag.overlay.hidden=!moved;
            for(const member of drag.marquee) {
                if(member.box.parentElement!==this)continue;
                const inside=moved&&corners(this.#rectangle(member.box)).every(p=>p.x>=left&&p.x<=right&&p.y>=top&&p.y<=bottom);
                this.#write(member.row,{selected:inside||(drag.extend&&member.selected)});
            }
            this.#suppressClick ||= moved;event.preventDefault();
        }
        #snap(value,step,enabled){return enabled&&step>0?Math.round(value/step)*step:value;}
        #cancel() {
            const drag = this.#drag;
            if(drag.marquee) {
                for(const member of drag.marquee)if(member.box.parentElement===this)this.#write(member.row,{selected:member.selected});
            }
            else if(drag.members)for(const member of drag.members) {
                if(member.box.parentElement===this)this.#write(member.row,{left:member.left,top:member.top});
            }
            else if (drag.box.parentElement === this) this.#write(drag.row,drag.rotate ? {rotation:drag.rotation} : drag.resize
                ? {left:drag.left,top:drag.top,width:drag.width,height:drag.height} : {left:drag.left,top:drag.top});
            this.#suppressClick = false;
            this.#finish();
        }
        #finish() {
            const drag = this.#drag;
            if (!drag) return;
            if(drag.marquee) {
                drag.overlay.remove();this.#drag=null;
                if(this.hasPointerCapture(drag.id))this.releasePointerCapture(drag.id);
                return;
            }
            if(drag.members)for(const member of drag.members)member.box.removeAttribute('data-moving');
            this.#drag = null; drag.box.removeAttribute('data-moving');drag.box.removeAttribute('data-resizing');drag.box.removeAttribute('data-rotating');
            if (this.hasPointerCapture(drag.id)) this.releasePointerCapture(drag.id);
        }
        #resize(box,row,width,height,origin=this.#rectangle(box)){
            const block=TrayPane.#blocks.get(box);
            width=Math.max(block.minWidth,width);height=Math.max(block.minHeight,height);
            // Keep the transformed upper-left corner anchored during resize.
            const dw=(width-origin.width)/2,dh=(height-origin.height)/2,a=origin.rotation*Math.PI/180;
            const c=Math.cos(a)*origin.scale,s=Math.sin(a)*origin.scale;
            this.#write(row,this.#constrain(box,row,{width,height,
                left:origin.left+c*dw-s*dh-dw,top:origin.top+s*dw+c*dh-dh}));
        }
        #keyGeometry(event){
            if(this.parameters.locked)return;
            const box=event.composedPath().find(item=>item.parentElement===this);
            const block=TrayPane.#blocks.get(box);
            if((this.#drag?.rotate||this.#drag?.marquee)&&event.key==='Escape'){this.#cancel();event.preventDefault();event.stopPropagation();return;}
            if(block&&event.target===box.labelbox.rotationHandle&&!this.#drag) {
                const direction={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1}[event.key];
                if(direction) {
                    const row=this.#row(block.label);
                    this.#write(row,this.#constrain(box,row,{rotation:row.getItem('rotation')+direction*(event.shiftKey?10:1)}));
                    event.preventDefault();event.stopPropagation();
                }
                return;
            }
            if(!block||event.target!==box.labelbox.resizeHandle||this.#drag)return;
            const steps={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
            if(!Object.hasOwn(steps,event.key))return;
            const row=this.#row(block.label),[x,y]=steps[event.key],step=event.shiftKey?10:1;
            const size=this.#rectangle(box);
            this.#resize(box,row,size.width+x*step,size.height+y*step);
            event.preventDefault();event.stopPropagation();
        }
    }
});
