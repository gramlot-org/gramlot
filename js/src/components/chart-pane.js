import {Bag,fromTytx,toTytx} from '@gramlot/gramlot';
import {defineComponent} from './registry.js';
import {Container} from './container.js';
import {randomId} from '../random-id.js';
import {chartTimeLogic} from './chart-timeline.js';
import {chartControls} from './chart-controls.js';

/** One shared Source composition for Python and JavaScript callers. */
export const ChartPane = defineComponent({
    name:'chartPane',tag:'gramlot-chart-pane',base:Container,sourceContext:true,subTags:'*',
    parameters:{configDefaults:{dtype:'X',nullable:true},storepath:{dtype:'T'},configpath:{dtype:'T'},rowMode:{dtype:'T',default:'attributes'},gridId:{dtype:'T',nullable:true}},
    implementation:Base => class extends Base {
        #context; #built=false;
        constructor() {
            super();
            const style=this.ownerDocument.createElement('style');
            style.textContent=':host{height:100%;min-height:0}.control-box{height:100%;min-height:0}';
            this.shadowRoot.append(style);
        }
        setSourceContext(context) { this.#context=context; }
        connectedCallback() {
            if(this.#built)return;
            const node=this.#context.sourceNode;
            if(node.value !== null && node.value.getNode('frame'))return;
            const storepath=node.absDatapath(this.parameters.storepath);
            const configpath=node.absDatapath(this.parameters.configpath);
            let configuration=node.getRelativeData(configpath);
            if (configuration == null) {
                configuration=new Bag(); node.setRelativeData(configpath,configuration);
            }
            const initial=this.parameters.configDefaults;
            if (initial != null) {
                if (!(initial instanceof Bag)) throw new TypeError('configDefaults requires a Bag');
                const values=fromTytx(toTytx(initial));
                for (const entry of values.getNodes()) if (!configuration.getNode(entry.label))
                    configuration.setItem(entry.label,entry.getValue());
            }
            if(!(configuration instanceof Bag))throw new TypeError('chartPane requires a configuration Bag');
            const defaults={mapLabelMode:'value',mapBarScale:'zero',selectedTerritory:'',timeField:'',timeEmpty:'previous',timeSnapshotLabel:'',timeStep:'auto',timeUnit:'month',timeHasClock:false,timeIndex:0,timeMax:0,timeAtEnd:true,timeValue:null,timeLabel:'',timePlaying:false,timeSpeed:0.8,engine:'echarts',chartType:'bar',captionField:'',secondCaptionField:'',geometryField:'',mapValueField:'',mapLabelField:'',geoJSON:null,drawer:'close'};
            for(const [key,value] of Object.entries(defaults))if(!configuration.getNode(key))configuration.setItem(key,value);
            if(!configuration.getNode('seriesOptions'))configuration.setItem('seriesOptions',new Bag());
            if(!(configuration.getItem('seriesOptions') instanceof Bag))throw new TypeError('seriesOptions must be a Bag');
            const fragment=new node.builder.source.constructor(null,node.builder);
            const frame=node.builder.wrapSource(fragment).framePane({node_label:'frame',height:'100%'});
            frame.dataFormula({result_path:`${configpath}.valueFields`,formula:"options.getNodes().filter(n => n.getValue().getItem('selected')).map(n => n.label).join(',')",options:`^${configpath}.seriesOptions`,_onBuilt:true});
            const toolbar=frame.top.contentPane({display:'flex',justify_content:'flex-end',align_items:'center',padding:'2px 6px'});
            const path=JSON.stringify(`${configpath}.drawer`);
            toolbar.button({icon:'⚙',aria_label:'Chart settings',title:'Chart settings',action:`this.SET(${path},this.GET(${path}) === 'close' ? true : 'close');`});
            const prefix=node.getAttr('id') ?? `chart-${randomId()}`;
            const layout=frame.center.borderContainer({id:`${prefix}-layout`,height:'100%'});
            const config=layout.contentPane({region:'right',width:'260px',drawer:`^${configpath}.drawer`,
                drawer_style:'display:none',detachable:true,title:'Chart configuration',padding:'8px',
                border_left:'1px solid var(--gramlot-border)',background:'var(--gramlot-surface)',
                overflow:'auto',display:'grid',gap:'4px',align_content:'start',
                style:'font-size:12px;--gramlot-field-height:26px;--gramlot-field-padding:2px 5px;--gramlot-grid-row-height:26px'});
            const attrs={id:`${prefix}-view`,configpath,storepath,rowMode:this.parameters.rowMode};
            for(const key of ['mapLabelMode','mapBarScale','selectedTerritory','timeEmpty','timeField','timeValue','timeStep','engine','mapValueField','mapLabelField','geoJSON','geometryField','chartType','captionField','secondCaptionField','valueFields','seriesOptions'])attrs[key]=`^${configpath}.${key==='timeStep'?'timeUnit':key}`;
            if(this.parameters.gridId)attrs.gridId=this.parameters.gridId;
            layout.contentPane({region:'center',min_width:'0'}).chartView(attrs);
            chartControls(config,{configpath,storepath,rowMode:this.parameters.rowMode,prefix});
            frame.dataFormula({result_path:`${configpath}.timeInterval`,formula:'playing ? speed : 0',playing:`^${configpath}.timePlaying`,speed:`^${configpath}.timeSpeed`,_onBuilt:true});
            frame.dataController({func:chartTimeLogic(node.rootBuilder.binding),configpath,_timing:`^${configpath}.timeInterval`});
            frame.dataFormula({result_path:`${configpath}.timeAtEnd`,formula:'index >= max',index:`^${configpath}.timeIndex`,max:`^${configpath}.timeMax`,_onBuilt:true});
            const timeline=frame.bottom.contentPane({display:`^${configpath}.timeField:={} ? 'flex' : 'none'`,align_items:'center',flex_wrap:'wrap',gap:'10px',padding:'8px 12px',role:'toolbar',aria_label:'Playback controls',
                background:'var(--gramlot-surface-subtle)',border_top:'1px solid var(--gramlot-border)'});
            const get=key=>JSON.stringify(`${configpath}.${key}`);
            const transport=timeline.div({display:'flex',align_items:'center',gap:'2px',flex_shrink:'0'});
            transport.button({icon:'←',aria_label:'Previous period',title:'Previous period',id:`${prefix}-time-previous`,
                disabled:`^${configpath}.timeIndex:={} <= 0`,action:`this.SET(${get('timePlaying')},false);this.SET(${get('timeIndex')},Math.max(0,this.GET(${get('timeIndex')})-1));`});
            transport.button({icon:`^${configpath}.timePlaying:={} ? '⏸︎' : '▶'`,
                aria_label:`^${configpath}.timePlaying:={} ? 'Pause' : 'Play'`,title:`^${configpath}.timePlaying:={} ? 'Pause' : 'Play'`,aria_pressed:`^${configpath}.timePlaying`,id:`${prefix}-time-play`,disabled:`^${configpath}.timeMax:={} === 0`,
                action:`if(!this.GET(${get('timePlaying')}) && this.GET(${get('timeIndex')}) >= this.GET(${get('timeMax')}))this.SET(${get('timeIndex')},0);this.SET(${get('timePlaying')},!this.GET(${get('timePlaying')}));`});
            transport.button({icon:'■',aria_label:'Stop',title:'Stop and return to the beginning',id:`${prefix}-time-stop`,
                disabled:`^${configpath}.timeMax:={} === 0`,action:`this.SET(${get('timePlaying')},false);this.SET(${get('timeIndex')},0);`});
            transport.button({icon:'→',aria_label:'Next period',title:'Next period',id:`${prefix}-time-next`,
                disabled:`^${configpath}.timeAtEnd`,action:`this.SET(${get('timePlaying')},false);this.SET(${get('timeIndex')},Math.min(this.GET(${get('timeMax')}),this.GET(${get('timeIndex')})+1));`});
            const scrubber=timeline.div({flex:'1',min_width:'120px'});
            scrubber.horizontalSlider({width:'100%',id:`${prefix}-time-slider`,aria_label:'Temporal snapshot',value:`^${configpath}.timeIndex`,min:0,max:`^${configpath}.timeMax`,step:1,live:true,flex:'1',
                connect_oninput:`this.SET(${get('timePlaying')},false);`});
            const dates=timeline.div({display:'grid',gap:'2px',white_space:'nowrap',text_align:'right',font_size:'12px',font_variant_numeric:'tabular-nums'});
            dates.span(`^${configpath}.timeLabel`,{id:`${prefix}-time-label`,font_weight:'600'});
            dates.small(`^${configpath}.timeSnapshotLabel`,{id:`${prefix}-snapshot-label`,color:'var(--gramlot-text-secondary)',display:`^${configpath}.timeSnapshotLabel:={} ? '' : 'none'`});

            const app=node.rootBuilder.binding.gramlot;
            const source=app.src.prepareSource(fragment);
            app.src.renderer.validateCandidate(source);
            this.#built=true;
            node.setValue(source);
        }
    }
});
