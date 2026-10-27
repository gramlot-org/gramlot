/** Registered commands use the existing node-scoped publication bus. */
import {SourceBag} from '@genrojs/builders';
import {toTytx,fromTytx} from '@genrojs/tytx';

export function commandFrame(node) {
    for(let parent=node.parentNode;parent;parent=parent.parentNode)if(parent.nodeTag==='framePane')return parent;
    return null;
}
export function frameRecipient(frame) {
    if(!frame || !(frame.value instanceof SourceBag))return null;
    const center=frame.value.getNodes().find(node=>node.getAttr('region')==='center');
    const targets=[];
    function visit(node){
        if(node.nodeTag==='framePane')return;
        if(node.getAttr('frameTarget')===true)targets.push(node);
        if(node.value instanceof SourceBag)for(const child of node.value.getNodes())visit(child);
    }
    if(center)visit(center);
    return targets.length===1?targets[0]:null;
}
function eligible(binding){
    if(binding.closed||!binding.runtime.renderer.attached(binding.node))return false;
    for(let node=binding.node;node;node=node.parentNode){
        const [,attrs]=node.rootBuilder.runtimeValues(node);
        if(attrs.hidden===true||attrs.disabled===true)return false;
    }
    return true;
}
function freeze(value){if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;}
export function captureCommand(binding,event){
    const sender=binding.node,command=sender.getAttr('command');
    const definition=binding.runtime.gramlot.commands.get(command);
    const frame=commandFrame(sender),target=frameRecipient(frame);
    if(!definition||!target){console.warn(`Cannot dispatch command '${command}' at '${sender.label}': missing or duplicate frame recipient`);return null;}
    const raw=sender.getAttr('parameters')??{};
    if(typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Command parameters require a mapping');
    const values=Object.fromEntries(Object.entries(raw).map(([key,value])=>[key,sender.pointerType(value)?sender.getRelativeData(value):value]));
    const parameters=freeze(fromTytx(toTytx(values)));
    const modifiers=Object.freeze(Object.fromEntries(['shift','ctrl','alt','meta'].map(key=>[key,Boolean(event[`${key}Key`])])));
    const message=Object.freeze({sender,target,command,parameters,modifiers});
    let cancelled=false;
    const release=binding.runtime.bindingFor(target).track(()=>{cancelled=true;});
    const current=()=>!cancelled&&eligible(binding)&&frameRecipient(frame)===target&&binding.runtime.renderer.attached(target)&&sender.getAttr('command')===command;
    return {message,current,release,cancel(){cancelled=true;},deliver(){if(current())target.publish(definition.publish,message);}};
}
