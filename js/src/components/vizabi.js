import {Bag} from '@gramlot/gramlot';
import {defineCollection,defineComponent} from '@gramlot/gramlot/components';
import {Container} from './container.js';
import {BagCollectionView} from '../stores/bag-collection-view.js';
import {VizabiSession} from './vizabi-session.js';

const VizabiBubble=defineComponent({
    name:'vizabiBubble',tag:'gramlot-vizabi-bubble',base:Container,sourceContext:true,bagStore:true,
    parameters:{storepath:{dtype:'T'},rowMode:{dtype:'T',default:'attributes'},configuration:{dtype:'X',binding:'read'},libraryUrl:{dtype:'T'}},
    implementation:Base=>class extends Base {
        #context;#bag;#signature;#libraryUrl;#configuration;#view;#release;#session;#resize;#revision=0;#active=false;#subscription=Symbol('vizabi-config');#style;#message;#host;
        constructor(){
            super();this.control.replaceChildren();
            this.#style=this.ownerDocument.createElement('style');this.shadowRoot.append(this.#style);
            this.#message=this.ownerDocument.createElement('div');this.#message.setAttribute('role','status');
            this.#host=this.ownerDocument.createElement('div');this.#host.style.cssText='width:100%;height:100%;position:relative;background:white;color:#222';
            this.control.append(this.#message,this.#host);this.control.style.height='100%';
            this.#resize=new this.ownerDocument.defaultView.ResizeObserver(()=>this.#session?.resize());
        }
        setSourceContext(context){this.#context=context;}
        setStoreBag(bag){this.#bag=bag;}
        projectAttributes(attrs,adapt){const result=super.projectAttributes(attrs,adapt);if(this.#active)this.#connect();return result;}
        connectedCallback(){this.#active=true;this.#connect();this.#resize.observe(this.#host);}
        #connect(){
            let changed=this.#libraryUrl!==this.parameters.libraryUrl;this.#libraryUrl=this.parameters.libraryUrl;
            const configuration=this.parameters.configuration;
            if(!(configuration instanceof Bag))throw new TypeError('vizabiBubble requires a configuration Bag');
            if(this.#configuration!==configuration){
                changed=true;
                this.#configuration?.unsubscribe(this.#subscription,{any:true});this.#configuration=configuration;
                configuration.subscribe(this.#subscription,{any:()=>{
                    if(this.#session?.writing)return;
                    this.#refreshConfiguration();
                }});
            }
            const store=this.#context.sourceNode.rootBuilder.binding.collectionStore(this.#bag,this.parameters.rowMode);
            if(!this.#view){changed=true;this.#view=new BagCollectionView(store);this.#view.connect();this.#release=this.#view.subscribe(()=>this.#render());}
            else if(this.#view.bag!==this.#bag){this.#view.bindStore(store);return;}
            if(changed)this.#signature=null;
            this.#refreshConfiguration();
        }
        #refreshConfiguration(){
            const signature=JSON.stringify(['entityField','timeField','xField','yField','sizeField','colorField'].map(key=>this.#configuration.getItem(key)));
            if(this.#session?.writing){this.#signature=signature;return;}
            if(signature!==this.#signature){this.#signature=signature;this.#render();}
            else this.#session?.update();
        }
        async #render(){
            const revision=++this.#revision;this.#session?.dispose();this.#session=null;
            this.#message.hidden=false;this.#message.textContent='Loading optional Vizabi library…';
            try{
                if(!this.parameters.libraryUrl)throw new Error('Provide libraryUrl to load the optional Vizabi module');
                const library=await import(this.parameters.libraryUrl);
                if(!this.#active||revision!==this.#revision)return;
                this.#style.textContent=library.style+'\n:host{display:block;height:100%;min-height:0}.control-box{height:100%}';
                this.#session=new VizabiSession(library,this.#host,this.#view,this.#configuration);
                this.#message.hidden=true;
            }catch(error){if(revision!==this.#revision)return;this.#message.setAttribute('role','alert');this.#message.textContent=error.message;}
        }
        disconnectedCallback(){
            this.#active=false;this.#revision++;this.#resize.disconnect();this.#configuration?.unsubscribe(this.#subscription,{any:true});
            this.#release?.();this.#view?.disconnect();this.#session?.dispose();this.#session=null;this.#view=null;this.#configuration=null;
        }
    }
});
export default defineCollection({name:'vizabi',components:[VizabiBubble]});
