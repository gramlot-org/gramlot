import {defineComponent} from '@gramlot/gramlot/components';
import {Container} from './container.js';
import {randomId} from '../random-id.js';
import {timeProfile,timeLabel,timeDate,timePeriod} from './chart-time.js';

const scripts=new WeakMap();
export function chartTimeLogic(binding){
    if(!scripts.has(binding)){
        const group=`chart_time_${randomId()}`;
        class Logic {
            tick(node){
                const path=node.getAttr('configpath'),config=node.getRelativeData(path);
                if(!config.getItem('timePlaying')||!config.getItem('timeField'))return;
                const next=config.getItem('timeIndex')+1,max=config.getItem('timeMax');
                if(next<=max)node.setRelativeData(`${path}.timeIndex`,next);
                if(next>=max)node.setRelativeData(`${path}.timePlaying`,false);
            }
        }
        binding.logicRegistry.register(Logic,{group,resource:'gramlot:charts'});scripts.set(binding,`${group}.tick`);
    }
    return scripts.get(binding);
}
export const ChartTimeline=defineComponent({
    name:'chartTimeline',tag:'gramlot-chart-timeline',base:Container,sourceContext:true,bagStore:true,
    parameters:{storepath:{dtype:'T'},rowMode:{dtype:'T'},configpath:{dtype:'T'},timeField:{dtype:'T',binding:'read'},timeStep:{dtype:'T',binding:'read'},timeIndex:{dtype:'R',binding:'read'}},
    implementation:Base=>class extends Base{
        #context;#bag;#store;#release;#active=false;#syncing=false;#selection;#minimum;#profile;#field;
        constructor(){super();const style=this.ownerDocument.createElement('style');style.textContent=':host{display:none}';this.shadowRoot.append(style);}
        setSourceContext(context){this.#context=context;}
        setStoreBag(bag){this.#bag=bag;}
        projectAttributes(attrs,adapt){const result=super.projectAttributes(attrs,adapt);if(this.#active)this.#connect();return result;}
        connectedCallback(){this.#active=true;this.#connect();}
        #connect(){
            const store=this.#context.sourceNode.rootBuilder.binding.collectionStore(this.#context.attrDatapath('storepath'),this.parameters.rowMode);
            if(store!==this.#store){this.#release?.();this.#store=store;this.#profile=null;this.#release=store.subscribe(()=>{this.#profile=null;this.#sync();});}
            this.#sync();
        }
        #sync(){
            if(this.#syncing)return;this.#syncing=true;
            try{
                const node=this.#context.sourceNode,path=this.parameters.configpath,config=node.getRelativeData(path);
                const put=(key,value)=>{const old=config.getItem(key);if(old instanceof Date&&value instanceof Date?old.getTime()!==value.getTime():old!==value)node.setRelativeData(`${path}.${key}`,value);};
                const {timeField:field,timeStep:requested}=this.parameters;
                if(!this.#profile||field!==this.#field){this.#profile=timeProfile(this.#store,field);this.#field=field;}
                const profile=this.#profile,step=requested==='auto'?profile.suggested:requested;
                put('timeHasClock',profile.hasClock);put('timeUnit',step);
                const selection=JSON.stringify([field,step]);
                let index=config.getItem('timeIndex');
                const changed=this.#selection!==undefined&&selection!==this.#selection;
                if(changed){index=0;put('timePlaying',false);}
                this.#selection=selection;
                const extent=field&&profile.first?{min:timePeriod(profile.first,step),max:timePeriod(profile.last,step)}:null;
                if(!changed&&extent&&this.#minimum!==undefined&&extent.min!==this.#minimum&&config.getItem('timeValue') instanceof Date)index=timePeriod(config.getItem('timeValue'),step)-extent.min;
                this.#minimum=extent?.min;
                const max=extent?extent.max-extent.min:0;
                if(!Number.isInteger(index))throw new TypeError('Time index requires an integer');
                index=Math.max(0,Math.min(max,index));
                const value=extent?timeDate(extent.min+index,step):null;
                put('timeMax',max);put('timeIndex',index);put('timeValue',value);
                put('timeLabel',value?timeLabel(value,step):'No temporal data');
                if(!extent||max===0)put('timePlaying',false);
            }finally{this.#syncing=false;}
        }
        disconnectedCallback(){
            this.#active=false;this.#release?.();this.#release=null;this.#store=null;
            const path=this.parameters.configpath;
            this.#context.sourceNode.setRelativeData(`${path}.timePlaying`,false);
        }
    }
});
