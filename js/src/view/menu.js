/** Menu-owned RpcResolver and validated, keyed Bag-to-Source projection. */
import {Bag} from '@genrojs/bag';
import {SourceBag, sourceTarget} from '@genrojs/builders';
import {toTytx} from '@genrojs/tytx';
import {RpcResolver} from '../binding/rpc-resolver.js';

const ENTRY_FIELDS=new Set(['kind','command','caption','icon','iconSrc','tooltip','disabled','hidden','checked','favorite','parameters','resolver','cacheTime','sync']);
function entries(bag,ancestors=new Set()) {
    if (!(bag instanceof Bag) || ancestors.has(bag)) throw new TypeError('Menu resolver must return an acyclic Bag');
    const parents=new Set([...ancestors,bag]);
    return bag.getNodes().map(node=>{
        const a=node.attr,kind=a.kind,value=node.staticValue;
        if(Object.keys(a).some(key=>!ENTRY_FIELDS.has(key)&&!key.startsWith('resolver_')))throw new TypeError(`Unsupported menu record field: ${node.label}`);
        if(!['command','separator','submenu'].includes(kind))throw new TypeError(`Invalid menu kind: ${node.label}`);
        for(const name of ['disabled','hidden','checked'])if(a[name]!=null && typeof a[name]!=='boolean' && !(typeof a[name]==='string'&&a[name].startsWith('^')))throw new TypeError(`Invalid menu ${name}`);
        if(a.favorite!=null&&typeof a.favorite!=='boolean')throw new TypeError('favorite must be boolean');
        if(a.caption!=null&&typeof a.caption!=='string')throw new TypeError('Menu caption must be text');
        if(a.parameters!=null && (typeof a.parameters!=='object'||Array.isArray(a.parameters)))throw new TypeError('Menu parameters must be a mapping');
        if(kind==='command' && (typeof a.command!=='string'||!a.command||value!=null||a.resolver!=null))throw new TypeError('Command record requires a command and no children/resolver');
        if(kind==='separator' && (value!=null||Object.keys(a).length!==1))throw new TypeError('Separator record accepts kind only');
        if(kind==='submenu' && (typeof a.caption!=='string'||a.command!=null||((value instanceof Bag)===(a.resolver!=null))||(!(value instanceof Bag)&&value!=null)))throw new TypeError('Submenu requires caption and exactly one content source');
        const children=value instanceof Bag?entries(value,parents):null;
        return {label:node.label,attrs:{...a},children};
    });
}
function project(menu,records) {
    const handle=menu.builder.wrapSource(menu);
    const old=menu.value instanceof SourceBag?menu.value.getNodes():[];
    const keys=new Set(records.map(item=>item.label));
    for(const node of old)if(!keys.has(node.label))menu.value.popNode(node.label);
    for(const [index,item] of records.entries()){
        const {kind,...attrs}=item.attrs;
        const resolver=Object.fromEntries(Object.entries(attrs).filter(([key])=>key==='resolver'||key==='cacheTime'||key==='sync'||key.startsWith('resolver_')));
        for(const key of Object.keys(resolver))delete attrs[key];
        const value=kind==='separator'?'-':null;
        let node=menu.value instanceof SourceBag?menu.value.getNodes().find(node=>node.label===item.label):null;
        const wasSubmenu=node?.value instanceof SourceBag;
        if(node && (wasSubmenu!==(kind==='submenu') || (node.value==='-')!==(kind==='separator'))){menu.value.popNode(node.label);node=null;}
        if(!node)node=sourceTarget(handle.menuline(value,{...attrs,node_label:item.label}));
        else {
            const previous=Object.keys(node.attr).filter(key=>ENTRY_FIELDS.has(key)&&!Object.hasOwn(attrs,key));
            node.setAttr({...Object.fromEntries(previous.map(key=>[key,null])),...attrs});
        }
        if(kind==='submenu') {
            let child=node.value instanceof SourceBag?node.value.getNodes().find(n=>n.nodeTag==='menu'):null;
            if(!child)child=sourceTarget(node.builder.wrapSource(node).menu({...resolver,node_label:'menu'}));
            else child.setAttr({...Object.fromEntries(Object.keys(child.attr).filter(key=>key==='resolver'||key==='cacheTime'||key==='sync'||key.startsWith('resolver_')).map(key=>[key,null])),...resolver});
            if(item.children)project(child,item.children);
        }
        const order=menu.value.getNodes().indexOf(node);
        if(order!==index)menu.value.move(order,index);
    }
}
export class MenuBinding {
    #key=null; #resolver=null; #generation=0; #closed=false; #projection=null;
    constructor(binding,element){this.binding=binding;this.element=element;}
    get node(){return this.binding.node;}
    attach(){this.element.menuBinding=this;this.refresh();}
    detach(){this.#closed=true;this.#generation++;this.node.requests.inflight?.cancel();delete this.element.menuBinding;this.element.close(false);}
    refresh(){
        const [,attrs]=this.node.rootBuilder.runtimeValues(this.node);
        const params=Object.fromEntries(Object.entries(attrs).filter(([key])=>key.startsWith('resolver_')).map(([key,value])=>[key.slice(9),value]));
        const key=toTytx([attrs.resolver,params,attrs.cacheTime,attrs.sync]);
        if(key===this.#key)return;
        this.#key=key;this.#generation++;this.#projection=null;
        this.#resolver=attrs.resolver?new RpcResolver({binding:this.binding,method:attrs.resolver,params,cacheTime:attrs.cacheTime??-1,sync:attrs.sync??false,onError:()=>{}}):null;
        if(this.#resolver){this.element.setStatus('loading');if(this.element.opened&&this.element.isConnected)this.load();}
        else this.element.setStatus(null);
    }
    async load(force=false){
        if(this.#closed||!this.#resolver)return;
        const resolver=this.#resolver,generation=this.#generation;
        try{
            if(force)resolver.refresh();else resolver.resolve();
            if(resolver.loading){this.element.setStatus('loading');await resolver.loading;}
            if(this.#closed||generation!==this.#generation)return;
            const result=resolver.cachedValue;
            const records=entries(result);
            const fingerprint=toTytx(result);
            if(this.#projection!==fingerprint){project(this.node,records);this.#projection=fingerprint;}
            this.element.setStatus(records.length?null:'empty');
        }catch(error){
            if(this.#closed||generation!==this.#generation)return;
            this.element.setStatus('error');console.warn(`Menu '${this.node.label}' failed to load`,error);
        }
    }
}
