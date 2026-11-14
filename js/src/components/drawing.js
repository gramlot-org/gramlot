import {sourceTarget} from '@genrojs/builders';
import {Bag} from '@genrojs/bag';
import inputs from './inputs.js';
import layout from './layout.js';
import {defineCollection, defineComponent} from './registry.js';
import {Container} from './container.js';
import {randomId} from '../random-id.js';

import {SVG_NS} from '../renderer/attributes.js';

/** An editable image annotation layer whose durable state is a Data Bag. */
export const DrawingPane = defineComponent({
    name:'drawingPane', tag:'gramlot-drawing-pane', base:Container, sourceContext:true, subTags:'*',
    parameters:{image:{dtype:'T',nullable:true,default:null,binding:'read'},
        annotations:{dtype:'X',binding:'read'}},
    implementation:Base => class extends Base {
        // The annotations are read at the address of the `annotations` pointer at each use; the
        // tool state lives in the node's private Data area and is observed through a router registration.
        #svg; #image; #editor; #editing; #stateRegistration = null; #syncing = false; #built = false; #lastColor; #lastSize; #annotationsPath = null;
        #tool='select'; #selected=null; #gesture=null; #dimensions=[1000,1000]; #url=null; #events;
        constructor() {
            super();
            const d=this.ownerDocument;
            const style=d.createElement('style');
            style.textContent=`:host{display:block;height:100%;min-height:0}.control-box{height:100%;display:flex;flex-direction:row;min-height:0;position:relative}
                slot{display:contents} ::slotted(gramlot-menu){flex:0 0 56px;box-sizing:border-box;padding:6px;background:var(--gramlot-surface,Canvas);border-right:1px solid var(--gramlot-border-control,#a8b2bf);overflow:hidden}
                .canvas{display:block;flex:1;width:0;height:100%;min-width:0;min-height:0;background:var(--gramlot-surface-subtle,#eee);touch-action:none;user-select:none}
                .text-editor{position:absolute;z-index:2;min-width:120px;padding:2px 4px;border:1px solid #3977bc;border-radius:3px;background:white;color:#222;box-shadow:0 2px 8px #0003}
                .text-editor[hidden]{display:none}.shape{cursor:pointer}.selected{stroke:#1683ff}.selected [data-text-hit]{stroke:#3977bc;stroke-width:1;stroke-dasharray:4 3}`;
            this.shadowRoot.append(style);this.control.replaceChildren();
            this.#editor=d.createElement('input');this.#editor.type='text';this.#editor.className='text-editor';this.#editor.hidden=true;this.#editor.setAttribute('aria-label','Annotation text');
            this.#svg=d.createElementNS(SVG_NS,'svg');this.#svg.setAttribute('role','img');this.#svg.setAttribute('aria-label','Annotated image');
            this.#svg.setAttribute('class','canvas');
            this.#svg.setAttribute('viewBox','0 0 1000 1000');this.#svg.setAttribute('preserveAspectRatio','xMidYMid meet');
            this.controlBox.append(d.createElement('slot'),this.#svg,this.#editor);
            this.#image=d.createElement('img');
        }
        setSourceContext(context) { this.context=context; }
        /** The tool state address: the private Data area of the drawingPane node (`workspaceDatapath`). */
        get #statePath() { return this.context.sourceNode.workspaceDatapath; }
        #state(key) { return this.context.getStaticData(`${this.#statePath}.${key}`); }
        #setState(key,value) { this.context.sourceNode.data.setItem(`${this.#statePath}.${key}`,value); }
        /** The annotations Bag, read at the address of the `annotations` pointer at each use; never kept. */
        #annotations() {
            const bag=this.context.getStaticData(this.#annotationsPath);
            if(!(bag instanceof Bag))throw new TypeError('drawingPane annotations requires a Data Bag');
            return bag;
        }
        projectAttributes(attrs,adapt) {
            const rest=super.projectAttributes(attrs,adapt);
            if(this.isConnected)this.#connect();
            return rest;
        }
        connectedCallback() {
            this.#events=new this.ownerDocument.defaultView.AbortController();const options={signal:this.#events.signal};
            this.#makeToolbar();
            if(!this.isConnected)return;
            this.#stateRegistration=this.context.sourceNode.rootBuilder.binding.router.register({path:this.#statePath,subtree:true,
                recipient:{receive:()=>this.#stateChanged()}});
            this.#svg.addEventListener('pointerdown',e=>this.#down(e),options);
            this.#svg.addEventListener('pointermove',e=>this.#move(e),options);
            this.#svg.addEventListener('pointerup',e=>this.#up(e),options);
            this.#svg.addEventListener('pointercancel',()=>{this.#gesture=null;this.#render();},options);
            this.#svg.addEventListener('dblclick',e=>{const id=e.target.closest('[data-id]')?.dataset.id;if(id&&this.#annotations().getItem(id)?.getItem('type')==='text'){this.#gesture=null;this.#editText(id);e.preventDefault();}},options);
            this.#editor.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();this.#finishText(true);}else if(e.key==='Escape'){e.preventDefault();this.#finishText(false);}},options);
            this.#editor.addEventListener('blur',()=>this.#finishText(true),options);
            this.#connect();
        }
        disconnectedCallback() {this.#finishText(false);this.#events?.abort();this.#events=null;this.#stateRegistration?.close();this.#stateRegistration=null;this.#annotationsPath=null;this.#image.onload=null;this.#image.onerror=null;this.#url=null;this.#gesture=null;}
        #connect() {
            // `annotations` is a `^` parameter of dtype 'X': a change inside the Bag or a replacement at its
            // address projects the pane again. A new address ends the selection.
            const path=this.context.attrDatapath('annotations');
            if(path!==this.#annotationsPath){this.#annotationsPath=path;this.#selected=null;}
            this.#annotations();
            const url=this.parameters.image;
            if(url!==this.#url){
                this.#url=url;this.#gesture=null;
                if(!url){this.#dimensions=[1000,1000];this.#render();}
                else {
                    this.#dimensions=null;this.#render();
                    this.#image.onload=()=>{if(this.#url!==url)return;this.#dimensions=[this.#image.naturalWidth,this.#image.naturalHeight];this.#render();};
                    this.#image.onerror=()=>{if(this.#url===url){this.#dimensions=null;this.context.reportError(new Error('Cannot load image'),'Drawing image');this.#render();}};
                    this.#image.src=url;
                }
            }
            this.#render();
        }
        #makeToolbar(){
            if(this.#built)return;
            const node=this.context.sourceNode,builder=node.rootBuilder;
            const existing=node.value?.getNode('bar');
            if(existing){existing._internal.drawingController=this;this.#built=true;this.#tool=this.#state('tool');this.#lastColor=this.#state('color');this.#lastSize=this.#state('size');return;}
            // The private area keeps the tool state of an earlier build of the same node.
            if(!(this.#state('tool')&&this.#state('color')&&this.#state('size')))
                node.data.setItem(this.#statePath,new Bag({tool:'select',color:'#dd2222',size:3}));
            this.#tool=this.#state('tool');this.#lastColor=this.#state('color');this.#lastSize=this.#state('size');
            const fragment=new builder.source.constructor(null,builder),root=builder.wrapSource(fragment);
            const bar=root.menu({node_label:'bar',presentation:'bar',orientation:'vertical',labelPosition:'tooltip',iconSize:20,aria_label:'Image annotations'});
            sourceTarget(bar)._internal.drawingController=this;
            const paths={select:'M5 3l13 11-6 .5-3 5z',freehand:'M4 20l3.5-.7L19 7.8 16.2 5 4.7 16.5z M14.7 6.5l2.8 2.8',arrow:'M4 19L19 4 M12 4h7v7',circle:'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0z',text:'M4 5h16 M12 5v14 M8 19h8',delete:'M4 7h16 M9 7V4h6v3 M7 7l1 13h8l1-13 M10 10v7 M14 10v7'};
            const icon=key=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="${SVG_NS}" viewBox="0 0 24 24" fill="none" stroke="#7e93ad" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[key]}"/></svg>`);
            for(const [tool,label] of [['select','Select'],['freehand','Draw'],['arrow','Arrow'],['circle','Circle'],['text','Text']]){
                bar.menuline({caption:label,tooltip:label,iconSrc:icon(tool),checked:`^${this.#statePath}.tool:={} === '${tool}'`,action:`this.parentBag.parentNode._internal.drawingController.setTool('${tool}')`});
            }
            bar.contentPane({height:'1px',margin:'6px 4px',background:'var(--gramlot-border-control,#a8b2bf)'});
            const circleIcon=color=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="${SVG_NS}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="${color}" stroke="#8793a3" stroke-width="1.5"/></svg>`);
            const colorMenu=bar.menuline({caption:'Color',tooltip:'Color',iconSrc:`^${this.#statePath}.color:='data:image/svg+xml,' + encodeURIComponent('<svg xmlns="${SVG_NS}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="' + {} + '" stroke="#8793a3" stroke-width="1.5"/></svg>')`}).menu({aria_label:'Annotation colors'});
            for(const [color,label] of [['#dd2222','Red'],['#e6a700','Yellow'],['#16834a','Green'],['#1677d2','Blue'],['#ffffff','White'],['#202733','Black']]){
                colorMenu.menuline({caption:label,iconSrc:circleIcon(color),checked:`^${this.#statePath}.color:={} === '${color}'`,
                    action:`this.SET('${this.#statePath}.color', '${color}');`});
            }
            colorMenu.contentPane({padding:'8px'}).colorpicker({value:`^${this.#statePath}.color`,lbl:'Custom color',aria_label:'Color',width:'140px'});
            const strokeIcon=size=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="${SVG_NS}" viewBox="0 0 24 24"><path d="M4 12h16" stroke="#7e93ad" stroke-width="${size}" stroke-linecap="round"/></svg>`);
            const sizeMenu=bar.menuline({caption:'Pen size',tooltip:'Pen size',iconSrc:`^${this.#statePath}.size:='data:image/svg+xml,' + encodeURIComponent('<svg xmlns="${SVG_NS}" viewBox="0 0 24 24"><path d="M4 12h16" stroke="#7e93ad" stroke-width="' + Math.min({}, 12) + '" stroke-linecap="round"/></svg>')`}).menu({aria_label:'Pen size'});
            for(const size of [1,3,5,7,12,20])sizeMenu.menuline({caption:`${size} px`,iconSrc:strokeIcon(Math.min(size,12)),checked:`^${this.#statePath}.size:={} === ${size}`,action:`this.SET('${this.#statePath}.size', ${size});`});
            sizeMenu.contentPane({padding:'8px'}).numberTextBox({value:`^${this.#statePath}.size`,lbl:'Custom size',aria_label:'Pen size',dtype:'L',min:1,max:20,width:'140px'});
            bar.contentPane({flex:'1',min_height:'12px'});
            bar.menuline({caption:'Delete',tooltip:'Delete',iconSrc:icon('delete'),action:'this.parentBag.parentNode._internal.drawingController.deleteSelection()'});
            const app=builder.binding.gramlot,source=app.src.prepareSource(fragment);
            app.src.renderer.validateCandidate(source);this.#built=true;node.setValue(source);
        }
        setTool(tool){this.#finishText(true);this.#gesture=null;this.#setState('tool',tool);}
        deleteSelection(){if(this.#selected){this.#annotations().popNode(this.#selected);this.#selected=null;this.#render();}}
        #stateChanged(){
            const tool=this.#state('tool');this.#tool=tool;
            const color=this.#state('color'),size=this.#state('size');
            const changed=color!==this.#lastColor||size!==this.#lastSize;this.#lastColor=color;this.#lastSize=size;
            if(changed&&!this.#syncing)this.#styleSelection();
            this.#render();
        }
        #point(event){
            const matrix=this.#svg.getScreenCTM();if(!matrix)return null;
            const p=this.#svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;const q=p.matrixTransform(matrix.inverse());
            return {x:Math.max(0,Math.min(this.#dimensions[0],q.x)),y:Math.max(0,Math.min(this.#dimensions[1],q.y))};
        }
        #down(event){
            if(event.button!==0||!this.#dimensions)return;const point=this.#point(event);if(!point)return;
            const id=event.target.closest('[data-id]')?.getAttribute('data-id');
            if(this.#tool==='select'){
                this.#selected=id||null;
                if(id){const value=this.#annotations().getItem(id);if(!(value instanceof Bag))throw new TypeError('Annotation must be a Bag');const row=this.#read(value);this.#syncing=true;try{this.#setState('color',row.color);this.#setState('size',row.width);}finally{this.#syncing=false;}this.#gesture={id,start:point,original:row};}
            }else if(this.#tool==='text'){
                const value=id?this.#annotations().getItem(id):null;
                this.#editText(value instanceof Bag&&value.getItem('type')==='text'?id:null,point);
            }else {this.#selected=null;this.#gesture={start:point,current:point,points:[point]};}
            if(this.#gesture)this.#svg.setPointerCapture(event.pointerId);this.#render();event.preventDefault();
        }
        #move(event){if(!this.#gesture||!this.#dimensions)return;const point=this.#point(event);if(!point)return;this.#gesture.current=point;if(this.#tool==='freehand')this.#gesture.points.push(point);this.#render();}
        #up(event){
            if(!this.#gesture)return;this.#move(event);const gesture=this.#gesture;this.#gesture=null;
            if(gesture.id){const delta={x:gesture.current.x-gesture.start.x,y:gesture.current.y-gesture.start.y};const row=this.#translate(gesture.original,delta);this.#annotations().setItem(gesture.id,new Bag(row));}
            else {const {start,current,points}=gesture;let row;
                if(this.#tool==='arrow')row={type:'arrow',x:start.x,y:start.y,x2:current.x,y2:current.y};
                else if(this.#tool==='circle')row={type:'circle',x:start.x,y:start.y,radius:Math.hypot(current.x-start.x,current.y-start.y)};
                else if(this.#tool==='freehand')row={type:'freehand',points};
                if(row)this.#insert({...row,color:this.#state('color'),width:this.#penSize()});
            }
            if(this.#svg.hasPointerCapture(event.pointerId))this.#svg.releasePointerCapture(event.pointerId);this.#render();
        }
        #insert(row){const id=`item_${randomId()}`;this.#annotations().setItem(id,new Bag(row));this.#selected=id;}
        #penSize(){const value=this.#state('size');return Number.isFinite(value)?Math.max(1,Math.min(20,value)):3;}
        #styleSelection(){if(!this.#selected)return;const value=this.#annotations().getItem(this.#selected);if(!(value instanceof Bag))return;const row=this.#read(value);row.color=this.#state('color');row.width=this.#penSize();this.#annotations().setItem(this.#selected,new Bag(row));}
        #editText(id,point){
            this.#finishText(true);const row=id?this.#read(this.#annotations().getItem(id)):{type:'text',...point,text:'',color:this.#state('color'),width:this.#penSize()};
            this.#selected=id;this.#editing={id,row};this.#editor.value=row.text;this.#editor.hidden=false;
            const svgPoint=this.#svg.createSVGPoint();svgPoint.x=row.x;svgPoint.y=row.y;const matrix=this.#svg.getScreenCTM();if(!matrix){this.#finishText(false);return;}
            const position=svgPoint.matrixTransform(matrix),box=this.controlBox.getBoundingClientRect();
            const fontSize=Math.max(14,Math.max(14,12+row.width*2)*matrix.a);
            this.#editor.style.left=`${position.x-box.left}px`;this.#editor.style.top=`${position.y-box.top-fontSize}px`;
            this.#editor.style.fontSize=`${fontSize}px`;this.#editor.focus();this.#editor.select();
        }
        #finishText(commit){
            if(!this.#editing)return;const {id,row}=this.#editing;this.#editing=null;const text=this.#editor.value.trim();this.#editor.hidden=true;
            if(commit&&text){row.text=text;if(id)this.#annotations().setItem(id,new Bag(row));else this.#insert(row);}
            if(commit)this.#setState('tool','select');
            this.#render();
        }
        #read(row){
            const result=Object.fromEntries(row.getNodes().map(node=>[node.label,node.getValue()]));
            if(result.type==='freehand')result.points=result.points.getNodes().map(node=>({x:node.getValue().getItem('x'),y:node.getValue().getItem('y')}));
            return result;
        }
        #translate(row,delta){const result={...row};if(row.type==='freehand')result.points=row.points.map(p=>({x:p.x+delta.x,y:p.y+delta.y}));else {result.x+=delta.x;result.y+=delta.y;if(row.type==='arrow'){result.x2+=delta.x;result.y2+=delta.y;}}return result;}
        #element(tag,attrs){const el=this.ownerDocument.createElementNS(SVG_NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));return el;}
        #shape(row,id){
            const g=this.#element('g',{'data-id':id,class:`shape${id===this.#selected?' selected':''}`,fill:'none',stroke:row.color,'stroke-width':row.width,'stroke-linecap':'round','stroke-linejoin':'round'});
            if(row.type==='circle')g.append(this.#element('circle',{cx:row.x,cy:row.y,r:row.radius}));
            if(row.type==='arrow'){
                g.append(this.#element('line',{x1:row.x,y1:row.y,x2:row.x2,y2:row.y2}));
                const angle=Math.atan2(row.y2-row.y,row.x2-row.x),size=Math.max(12,row.width*5);
                const x1=row.x2-size*Math.cos(angle-0.45),y1=row.y2-size*Math.sin(angle-0.45),x2=row.x2-size*Math.cos(angle+0.45),y2=row.y2-size*Math.sin(angle+0.45);
                g.append(this.#element('polyline',{points:`${x1},${y1} ${row.x2},${row.y2} ${x2},${y2}`}));
            }
            if(row.type==='freehand')g.append(this.#element('polyline',{points:row.points.map(p=>`${p.x},${p.y}`).join(' ')}));
            if(row.type==='text'){const hit=this.#element('rect',{'data-text-hit':'',fill:'transparent',stroke:'none','pointer-events':'all'});const t=this.#element('text',{x:row.x,y:row.y,fill:row.color,stroke:'none','font-size':Math.max(14,12+row.width*2)});t.textContent=row.text;g.append(hit,t);}
            return g;
        }
        #render(){
            if(!this.#svg||!this.#annotationsPath)return;this.#svg.replaceChildren();if(!this.#dimensions)return;
            const [width,height]=this.#dimensions;this.#svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
            if(this.#url)this.#svg.append(this.#element('image',{href:this.#url,x:0,y:0,width,height,'pointer-events':'none'}));
            for(const node of this.#annotations().getNodes()){
                const value=node.getValue();if(!(value instanceof Bag))throw new TypeError('Annotation must be a Bag');let row=this.#read(value);
                if(this.#gesture?.id===node.label&&this.#gesture.current)row=this.#translate(this.#gesture.original,{x:this.#gesture.current.x-this.#gesture.start.x,y:this.#gesture.current.y-this.#gesture.start.y});
                const shape=this.#shape(row,node.label);this.#svg.append(shape);
                if(row.type==='text'){const bounds=shape.querySelector('text').getBBox(),hit=shape.querySelector('[data-text-hit]');for(const name of ['x','y','width','height'])hit.setAttribute(name,bounds[name]);}
            }
            const g=this.#gesture;if(g&&!g.id&&g.current){let row;if(this.#tool==='arrow')row={type:'arrow',x:g.start.x,y:g.start.y,x2:g.current.x,y2:g.current.y};if(this.#tool==='circle')row={type:'circle',x:g.start.x,y:g.start.y,radius:Math.hypot(g.current.x-g.start.x,g.current.y-g.start.y)};if(this.#tool==='freehand')row={type:'freehand',points:g.points};if(row)this.#svg.append(this.#shape({...row,color:this.#state('color'),width:this.#penSize()},''));}
        }
    }
});
export default defineCollection({name:'drawing',dependencies:[inputs,layout],components:[DrawingPane]});
