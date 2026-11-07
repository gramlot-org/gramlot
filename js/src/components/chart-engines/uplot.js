import {chartData} from '../chart-data.js';
import {loadLibrary} from '../../libraries.js';

let loading,UPlot,styleText;
export class UPlotAdapter {
    static label='uPlot';
    static async load(type,document) {
        await (loading ??= Promise.all([loadLibrary('uplot',document,()=>import('uplot/dist/uPlot.esm.js')),
            loadLibrary('uplotStyle',document,()=>import('uplot/dist/uPlot.min.css'))])
            .then(([engine,style])=>{UPlot=engine.default;styleText=style;}));
    }
    #element; #plot; #style; #signature; #disposed=false;
    constructor(element) { this.#element=element; }
    validate(context) { return this[`render_${context.type.id}`](context); }
    render_line({view,category,fields,settings,domains}) {
        const {source,kind}=chartData(view,category,fields,domains?.dimension);
        if(source.length&&kind==='category')throw new TypeError('uPlot requires a numeric or date X field. Configuration retained.');
        if(source.some((row,index)=>index>0&&row[0]<=source[index-1][0]))
            throw new TypeError('uPlot requires distinct X values in ascending order. Prepare the store upstream. Configuration retained.');
        return {category,fields,settings,domains,time:kind==='time',
            data:[source.map(row=>kind==='time'?row[0]/1000:row[0]),
                ...fields.map((_,index)=>source.map(row=>row[index+1]))]};
    }
    update(context,figure,isCurrent=()=>true) {
        if(this.#disposed||!isCurrent())return;
        const {data,...configuration}=figure,signature=JSON.stringify(configuration);
        if(!this.#style) {
            this.#style=this.#element.ownerDocument.createElement('style');
            this.#style.textContent=styleText+'\n.uplot{color:#333;background:#fff;font-size:12px}.u-legend{font-size:12px;max-height:90px;overflow:auto}';
            this.#element.append(this.#style);
        }
        if(signature!==this.#signature) {
            this.#plot?.destroy();
            const {category,fields,settings,time,domains}=figure;
            const rect=this.#element.getBoundingClientRect();
            const scales={x:{time,...(domains?{range:()=>domains.dimension.range.map(v=>time?v/1000:v)}:{})}},axes=[{label:category,stroke:'#333',font:'12px sans-serif'}];
            for(const side of ['left','right']) {
                const names=fields.filter((_,i)=>settings[i].axis===side);
                if(!names.length)continue;
                scales[side]={time:false,...(domains?{range:()=>domains.axes[side]}:{})};
                axes.push({scale:side,side:side==='left'?3:1,label:names.join(', '),stroke:'#333',font:'12px sans-serif',grid:{show:side==='left',stroke:'#e5e7eb'}});
            }
            this.#plot=new UPlot({width:Math.max(1,Math.round(rect.width)),height:Math.max(1,Math.round(rect.height)-50),
                pxAlign:false,scales,axes,
                series:[{label:category},...fields.map((field,i)=>({label:field,stroke:settings[i].color,scale:settings[i].axis,width:1.5}))]},data,this.#element);
            this.#signature=signature;
        } else this.#plot.setData(data);
        this.resize();
    }
    resize() {
        if(this.#disposed||!this.#plot)return;
        const rect=this.#element.getBoundingClientRect();
        const legend=this.#plot.root.querySelector('.u-legend');
        const width=Math.max(1,Math.round(rect.width));
        const height=Math.max(1,Math.floor(rect.height-legend.getBoundingClientRect().height));
        if(this.#plot.width!==width||this.#plot.height!==height)this.#plot.setSize({width,height});
    }
    dispose() { this.#disposed=true;this.#plot?.destroy();this.#plot=null;this.#style?.remove(); }
}
