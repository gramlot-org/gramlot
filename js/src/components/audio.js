import {defineCollection,defineComponent} from '@gramlot/gramlot/components';
import {Container} from './container.js';
import {AudioAnalysisSession} from './audio-analysis-session.js';

export const AudioAnalyser=defineComponent({
    name:'audioAnalyser',tag:'gramlot-audio-analyser',base:Container,sourceContext:true,
    parameters:{running:{dtype:'B',default:false,binding:'twoWay'},fftSize:{dtype:'L',default:1024,binding:'read'},
        frameRate:{dtype:'N',default:20,binding:'read'},minimumDb:{dtype:'N',default:-100,binding:'read'},
        spectrum:{dtype:'X',nullable:true,binding:'twoWay'},waveform:{dtype:'X',nullable:true,binding:'twoWay'},
        sampleRate:{dtype:'N',default:0,binding:'twoWay'},status:{dtype:'T',default:'stopped',binding:'twoWay'},error:{dtype:'T',default:'',binding:'twoWay'}},
    implementation:Base=>class extends Base {
        #context; #session; #active=false; #requested=false; #hide; #configuration;
        setSourceContext(context){this.#context=context;}
        connectedCallback(){
            this.#active=true;this.style.display='none';
            const write=(name,value)=>{if(this.#active)this.#context.writeParameter(name,value);};
            this.#session=new AudioAnalysisSession(this.ownerDocument.defaultView,{
                state:status=>write('status',status),error:error=>this.#failed(error),
                frame:({waveform,spectrum,sampleRate,minimumDb})=>{
                    write('sampleRate',sampleRate);
                    write('waveform',Array.from(waveform));
                    write('spectrum',Array.from(spectrum,value=>Math.max(minimumDb,value)));
                }});
            this.#hide=()=>{this.#requested=false;write('running',false);void this.#session.stop().catch(error=>this.#failed(error));};
            this.ownerDocument.defaultView.addEventListener('pagehide',this.#hide);
            this.#sync();
        }
        projectAttributes(attrs,adapt){const rest=super.projectAttributes(attrs,adapt);if(this.#active)this.#sync();return rest;}
        #failed(error){if(!this.#active)return;this.#requested=false;this.#context.writeParameter('running',false);this.#context.writeParameter('error',error.message);void this.#session.stop().then(()=>{if(this.#active)this.#context.writeParameter('status','error');},cleanupError=>console.error('Audio cleanup failed',cleanupError));}
        #sync(){
            const {running,fftSize,frameRate,minimumDb}=this.parameters;
            try {
                const configuration=JSON.stringify([fftSize,frameRate,minimumDb]);
                if(configuration!==this.#configuration){this.#configuration=configuration;this.#session.configure({fftSize,frameRate,minimumDb});}
                if(running===this.#requested)return;
                this.#requested=running;
                if(running){this.#context.writeParameter('error','');void this.#session.start({fftSize,frameRate,minimumDb}).catch(error=>this.#failed(error));}
                else void this.#session.stop().catch(error=>this.#failed(error));
            }catch(error){this.#failed(error);}
        }
        disconnectedCallback(){this.#active=false;this.#requested=false;this.ownerDocument.defaultView.removeEventListener('pagehide',this.#hide);void this.#session.stop().catch(error=>console.error('Audio analysis cleanup failed',error));}
    }
});
export default defineCollection({name:'audio',components:[AudioAnalyser]});
