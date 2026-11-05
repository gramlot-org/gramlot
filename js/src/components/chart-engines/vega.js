import {chartPalette} from '../chart-domains.js';
import {chartData} from '../chart-data.js';

let loading,Vega;
export class VegaAdapter {
    static label='Vega';
    static async load() { Vega=await (loading ??= import('vega')); }
    #element; #view; #signature; #disposed=false; #pending=Promise.resolve(); #width; #height;
    constructor(element) { this.#element=element; }
    validate(context) { return this[`render_${context.type.id}`](context); }
    update(context,spec,isCurrent=()=>true) {
        const signature=JSON.stringify({...spec,data:spec.data.map(({values,...definition})=>definition)});
        const draw=async()=>{
            if(this.#disposed||!isCurrent())return;
            if(signature!==this.#signature) {
                this.#view?.finalize();
                this.#element.replaceChildren();
                this.#view=new Vega.View(Vega.parse(spec),{renderer:'svg',container:this.#element,hover:true});
                this.#signature=signature;
            } else {
                for(const dataset of spec.data)if(dataset.values)this.#view.data(dataset.name,dataset.values);
            }
            const rect=this.#element.getBoundingClientRect();
            this.#width=Math.max(1,Math.round(rect.width));this.#height=Math.max(1,Math.round(rect.height));
            await this.#view.width(this.#width).height(this.#height).runAsync();
            if(this.#disposed)this.#view.finalize();
        };
        const result=this.#pending.then(draw);
        this.#pending=result.catch(()=>{});
        return result;
    }
    render_bar(context) { return this.#cartesian(context,true); }
    render_line(context) { return this.#cartesian(context,false); }
    #cartesian({view,category,fields,settings,domains},bar) {
        const {source,kind}=chartData(view,category,fields,domains?.dimension);
        const band=bar&&kind!=='time';
        const spec=this.#spec();
        spec.data=[{name:'rows',values:source.map((row,index)=>({x:row[0],index}))},
            ...fields.map((field,i)=>({name:`series${i}`,values:source.map(row=>({x:row[0],y:row[i+1],label:kind==='time'?new Date(row[0]).toISOString().slice(0,10):String(row[0])}))}))];
        spec.scales=[{name:'x',type:band?'band':kind==='time'?'utc':kind==='category'?'point':'linear',
            domain:domains?(band||kind==='category'?domains.dimension.values:domains.dimension.range):{data:'rows',field:'x'},range:'width',...(band?{padding:0.2}:{zero:false,padding:0.5})},
            {name:'color',type:'ordinal',domain:fields,range:settings.map(option=>option.color)}];
        spec.axes=[{orient:'bottom',scale:'x',labelOverlap:true,title:category}];
        for(const side of ['left','right']) {
            const indexes=fields.map((_,i)=>i).filter(i=>settings[i].axis===side);
            if(!indexes.length)continue;
            spec.scales.push({name:side,type:'linear',domain:domains?domains.axes[side]:{fields:indexes.map(i=>({data:`series${i}`,field:'y'}))},range:'height',zero:true,nice:true});
            spec.axes.push({orient:side,scale:side,grid:side==='left',title:indexes.map(i=>fields[i]).join(', '),format:'~s'});
        }
        spec.legends=[{fill:'color',orient:'bottom',direction:'horizontal',title:null}];
        if(bar)spec.signals=[{name:'groupWidth',update:band?"bandwidth('x')":"min(60, width / max(1, length(data('rows'))) * 0.7)"}];
        spec.marks=fields.flatMap((field,i)=>{
            const y={scale:settings[i].axis,field:'y'};
            if(bar)return {name:`measure${i}`,type:'rect',from:{data:`series${i}`},encode:{update:{
                x:{signal:`scale('x',datum.x) ${band?'':'- groupWidth / 2'} + groupWidth * ${i} / ${fields.length}`},
                width:{signal:`groupWidth / ${fields.length} * 0.9`},
                y:{signal:`scale('${settings[i].axis}',max(0,datum.y))`},y2:{signal:`scale('${settings[i].axis}',min(0,datum.y))`},
                fill:{value:settings[i].color},tooltip:{signal:'datum.label + ": " + datum.y'}}}};
            const position={x:{scale:'x',field:'x'},y,tooltip:{signal:'datum.label + ": " + datum.y'}};
            return [{name:`measure${i}`,type:'line',from:{data:`series${i}`},encode:{update:{...position,
                stroke:{value:settings[i].color},strokeWidth:{value:2}}}},
                {name:`points${i}`,type:'symbol',from:{data:`series${i}`},encode:{update:{...position,
                    fill:{value:settings[i].color},size:{signal:`length(data('series${i}')) === 1 ? 36 : 0`}}}}];
        });
        return spec;
    }
    render_pie({view,category,fields,domains}) {
        const {source,kind}=chartData(view,category,fields,domains?.dimension);
        if(source.some(row=>row[1]<0))throw new TypeError('Pie requires nonnegative values. Configuration retained.');
        const spec=this.#spec();
        spec.data=[{name:'slices',values:fields.length?source.map((row,index)=>({index,label:kind==='time'?new Date(row[0]).toISOString().slice(0,10):String(row[0]),value:row[1]})):[],
            transform:[{type:'pie',field:'value',sort:false}]}];
        spec.scales=[{name:'color',type:'ordinal',domain:domains?domains.labels:{data:'slices',field:'label'},range:domains?chartPalette:{scheme:'tableau10'}}];
        spec.legends=[{fill:'color',orient:'bottom',direction:'horizontal',columns:3,title:null}];
        const center={x:{signal:'width / 2'},y:{signal:'height / 2'}};
        spec.marks=[{name:'pieSlices',type:'arc',from:{data:'slices'},encode:{update:{...center,
            startAngle:{field:'startAngle'},endAngle:{field:'endAngle'},outerRadius:{signal:'min(width,height) * 0.46'},
            fill:{scale:'color',field:'label'},stroke:{value:'#fff'},tooltip:{signal:'datum.label + ": " + datum.value'}}}},
            {name:'sliceLabels',type:'text',from:{data:'slices'},encode:{update:{...center,
                radius:{signal:'min(width,height) * 0.30'},theta:{signal:'(datum.startAngle + datum.endAngle) / 2'},
                text:{field:'label'},align:{value:'center'},baseline:{value:'middle'},fill:{value:'#222'},
                limit:{signal:'min(width,height) * 0.25'}}}}];
        return spec;
    }
    #spec() {
        return {background:'#fff',autosize:{type:'fit',contains:'padding',resize:true},padding:12,
            data:[],scales:[],axes:[],marks:[],config:{axis:{labelColor:'#333',titleColor:'#333',gridColor:'#eee'},legend:{labelColor:'#333'}}};
    }
    resize() {
        if(this.#disposed||!this.#view)return;
        const rect=this.#element.getBoundingClientRect(),width=Math.max(1,Math.round(rect.width)),height=Math.max(1,Math.round(rect.height));
        if(width===this.#width&&height===this.#height)return;
        this.#width=width;this.#height=height;
        const resize=async()=>{
            if(this.#disposed)return;
            await this.#view.width(this.#width).height(this.#height).resize().runAsync();
        };
        this.#pending=this.#pending.then(resize).catch(()=>{});
    }
    dispose() { this.#disposed=true;this.#view?.finalize(); }
}
