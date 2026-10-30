/** Source-bound JSONL loader for the local resident-selection examples. */
import {Bag} from '@gramlot/gramlot';
import {defineComponent, ComponentCollection} from '../components/registry.js';
import {Container} from '../components/container.js';
import {WindowSelection} from './window-selection.js';
import {loadSelectionTrial} from './selection-transfer.js';

const SelectionTrial = defineComponent({
    name:'selectionTrial',tag:'gramlot-selection-trial',base:Container,sourceContext:true,
    parameters:{
        url:{dtype:'T'},method:{dtype:'T'},
        limit:{dtype:'T',binding:'read'},reload:{dtype:'L',default:0,binding:'read'},
        result:{dtype:'X',nullable:true,default:null,binding:'write'},
        metrics:{dtype:'X',nullable:true,default:null,binding:'write'},
        status:{dtype:'T',default:'',binding:'write'}
    },
    implementation:Base => class extends Base {
        #context; #controller; #key;
        setSourceContext(context) { this.#context=context; }
        projectAttributes(attrs,adapt) {
            const rest=super.projectAttributes(attrs,adapt);
            if(this.isConnected) this.#load();
            return rest;
        }
        connectedCallback() { this.#load(); }
        disconnectedCallback() { this.#controller?.abort(); this.#key=undefined; }
        async #load() {
            const {url,method,limit,reload}=this.parameters;
            const key=JSON.stringify([url,method,limit,reload]);
            if(key===this.#key) return;
            this.#key=key; this.#controller?.abort();
            const controller=new AbortController(); this.#controller=controller;
            const page=this.#context.sourceNode.rootBuilder.binding.gramlot;
            this.#context.writeParameter('status','Loading…');
            try {
                const {selection,metrics}=await loadSelectionTrial({url,method,limit,pageId:page.pageId,signal:controller.signal});
                if(this.#controller!==controller || !this.isConnected) return;
                this.#context.writeParameter('result',selection);
                this.#context.writeParameter('metrics',new Bag(metrics));
                this.#context.writeParameter('status','Loaded');
            } catch(error) {
                if(controller.signal.aborted || this.#controller!==controller) return;
                this.#context.writeParameter('status',`Failed: ${error.message}`);
            }
        }
    }
});
export default new ComponentCollection({name:'selection_trial',components:[SelectionTrial,WindowSelection]});
