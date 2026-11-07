import {chartPalette} from '../chart-domains.js';
import {chartData} from '../chart-data.js';
import {plotlySpatial} from './plotly-spatial.js';
import {plotlyMap} from './plotly-map.js';
import {loadLibrary} from '../../libraries.js';

let loading,Plotly;
export class PlotlyAdapter {
    static label='Plotly';
    static async load(type,document) {
        Plotly=await (loading ??= loadLibrary('plotly',document,()=>import('plotly.js-dist-min')).then(module=>module.default));
    }
    #element; #options; #type; #listening=false; #style; #disposed=false; #pending=Promise.resolve(); #drawn=false;
    constructor(element,options={}) { this.#element=element;this.#options=options; }
    validate(context) {
        return this[`render_${context.type.id}`](context);
    }
    update(context,figure,isCurrent=()=>true) {
        const draw=async()=>{
            if(this.#disposed||!isCurrent())return;
            if(!this.#style) {
                // Plotly's document styles cannot cross the chart component's shadow boundary.
                this.#style=this.#element.ownerDocument.createElement('style');
                this.#style.textContent=`.js-plotly-plot,.js-plotly-plot div{margin:0;padding:0;border:0}
                    .js-plotly-plot .main-svg{position:absolute;top:0;left:0;pointer-events:none}
                    .js-plotly-plot .main-svg .draglayer{pointer-events:all}
                    .js-plotly-plot .user-select-none{user-select:none;-webkit-user-select:none}
                    .js-plotly-plot .crisp{shape-rendering:crispEdges}`;
                this.#element.parentElement.append(this.#style);
            }
            const rect=this.#element.getBoundingClientRect();
            await Plotly.react(this.#element,figure.data,{...figure.layout,width:Math.max(1,rect.width),height:Math.max(1,rect.height)},
                {displayModeBar:false,responsive:false,displaylogo:false,scrollZoom:context.type.id==='map'});
            if(this.#disposed)Plotly.purge(this.#element);
            else {
                this.#drawn=true;this.#type=context.type.id;
                if(!this.#listening){
                    this.#element.on('plotly_click',event=>{
                        const point=event.points[0];
                        if(this.#type==='map' && point?.data.type==='choropleth')this.#options.onTerritorySelect?.(point.location);
                    });
                    this.#element.on('plotly_afterplot',()=>this.#fitMapLabels());
                    this.#listening=true;
                }
                this.#fitMapLabels();
            }
        };
        const result=this.#pending.then(draw);
        this.#pending=result.catch(()=>{});
        return result;
    }
    #fitMapLabels() {
        if(this.#type!=='map'||this.#disposed)return;
        const occupied=[],bounds=this.#element.getBoundingClientRect();
        for(const text of this.#element.querySelectorAll('.scattergeo text')){
            text.style.visibility='visible';text.style.pointerEvents='none';
            const r=text.getBoundingClientRect();
            const overlaps=occupied.some(b=>r.left<b.right+4&&r.right>b.left-4&&r.top<b.bottom+2&&r.bottom>b.top-2);
            const outside=r.left<bounds.left||r.right>bounds.right||r.top<bounds.top||r.bottom>bounds.bottom;
            if(overlaps||outside)text.style.visibility='hidden';
            else if(text.textContent)occupied.push(r);
        }
    }
    render_bar(context) { return this.#cartesian(context,{type:'bar'}); }
    render_line(context) { return this.#cartesian(context,{type:'scatter'}); }
    render_area(context) { return this.#cartesian(context,{type:'scatter',area:true}); }
    render_stackedBar(context) { return this.#cartesian(context,{type:'bar',stacked:true}); }
    render_stackedArea(context) { return this.#cartesian(context,{type:'scatter',area:true,stacked:true}); }
    render_horizontalBar(context) { return this.#cartesian(context,{type:'bar',horizontal:true}); }
    render_pie(context) { return this.#radial(context,false); }
    render_donut(context) { return this.#radial(context,true); }
    render_scatter(context) { return this.#cartesian(context,{type:'scatter',points:true}); }
    render_line3D(context) { return plotlySpatial(context,'line3D',this.#layout()); }
    render_scatter3D(context) { return plotlySpatial(context,'scatter3D',this.#layout()); }
    render_surface(context) { return plotlySpatial(context,'surface',this.#layout()); }
    render_map(context) { return plotlyMap(context,this.#layout()); }
    #cartesian({view,category,fields,settings,domains},{type,area=false,stacked=false,horizontal=false,points=false}) {
        const {source,kind}=chartData(view,category,fields,domains?.dimension);
        if(points&&!['value','time'].includes(kind))throw new TypeError('Scatter needs a numeric or date dimension. Choose another column.');
        if(stacked&&new Set(settings.map(option=>option.axis)).size>1)throw new TypeError('Stacked series need the same scale. Assign all selected measures to the same axis.');
        // Plotly stackgroup interpolates and combines repeated X values. Never alter measures silently.
        if(stacked&&new Set(source.map(row=>row[0])).size!==source.length)
            throw new TypeError('Plotly stacked series require distinct X values. Prepare the store upstream. Configuration retained.');
        if(stacked&&area&&source.some(row=>row.slice(1).some(value=>value<0)))
            throw new TypeError('Plotly stacked areas do not implement separate positive/negative stacks. Choose another type or engine. Configuration retained.');
        const coordinates=source.map(row=>kind==='time'?new Date(row[0]).toISOString():row[0]);
        const layout=this.#layout(),dimension=horizontal?'y':'x',measure=horizontal?'x':'y';
        layout.barmode=stacked?'relative':'group';
        layout[dimension+'axis']={type:kind==='time'&&!horizontal?'date':kind==='category'||type==='bar'?'category':'linear',automargin:true};
        for(const [index,side] of ['left','right'].entries()) {
            layout[measure+'axis'+(index?'2':'')]={side:horizontal?(index?'top':'bottom'):side,
                visible:settings.some(s=>s.axis===side),automargin:true,
                title:{text:fields.filter((_,i)=>settings[i].axis===side).join(', ')},
                ...(index?{overlaying:measure}:{}),rangemode:'tozero'};
        }
        if(domains){
            const axis=layout[dimension+'axis'];
            if(axis.type==='category'){axis.categoryorder='array';axis.categoryarray=domains.dimension.values.map(v=>kind==='time'?new Date(v).toISOString():v);axis.range=[-0.5,axis.categoryarray.length-0.5];}
            else axis.range=domains.dimension.range.map(v=>kind==='time'?new Date(v).toISOString():v);
            axis.autorange=false;
            for(const [i,side] of ['left','right'].entries())Object.assign(layout[measure+'axis'+(i?'2':'')],{range:domains.axes[side],autorange:false});
        }
        const data=fields.map((field,i)=>({type,name:field,
            [dimension]:[...coordinates],[measure]:source.map(row=>row[i+1]),
            [measure+'axis']:measure+(settings[i].axis==='right'?'2':''),marker:{color:settings[i].color},
            ...(type==='scatter'?{mode:points?'markers':source.length===1?'lines+markers':'lines',line:{color:settings[i].color},
                ...(area?{fill:stacked?'tonexty':'tozeroy',fillcolor:settings[i].color+'4d'}:{}),
                ...(stacked?{stackgroup:'measures',stackgaps:'infer zero'}:{})}
                :{orientation:horizontal?'h':'v',...(stacked?{}:{offsetgroup:field}),alignmentgroup:'measures'})}));
        return {data,layout};
    }
    #radial({view,category,fields,domains},donut) {
        const {source,kind}=chartData(view,category,fields,domains?.dimension);
        const labels=source.map(row=>kind==='time'?new Date(row[0]).toISOString().slice(0,10):String(row[0]));
        if(new Set(labels).size!==source.length)
            throw new TypeError('Plotly pie/donut requires distinct category labels. Prepare the store upstream or choose another engine. Configuration retained.');
        if(source.some(row=>row[1]<0))throw new TypeError('Pie and donut require nonnegative values. Configuration retained.');
        return {layout:this.#layout(),data:fields.map(field=>({type:'pie',name:field,sort:false,hole:donut?0.5:0,
            labels,...(domains?{marker:{colors:labels.map(label=>chartPalette[domains.labels.indexOf(label)%chartPalette.length])}}:{}),
            values:source.map(row=>row[1]),textposition:'inside',textinfo:'label+percent',automargin:true}))};
    }
    #layout() {
        return {paper_bgcolor:'#fff',plot_bgcolor:'#fff',font:{color:'#333'},showlegend:true,
            margin:{l:70,r:70,t:40,b:75},legend:{orientation:'h',y:-0.18,x:0},autosize:true};
    }
    resize() {
        if(this.#disposed||!this.#drawn)return;
        // Serialize resize with react, and do not enqueue another resize from its own observer callback.
        const rect=this.#element.getBoundingClientRect();
        if(this.#element.layout.width===Math.round(rect.width)&&this.#element.layout.height===Math.round(rect.height))return;
        const resize=()=>{
            if(this.#disposed)return;
            const rect=this.#element.getBoundingClientRect();
            return Plotly.relayout(this.#element,{width:Math.max(1,Math.round(rect.width)),height:Math.max(1,Math.round(rect.height))});
        };
        this.#pending=this.#pending.then(resize).catch(()=>{});
    }
    dispose() { this.#disposed=true;this.#style?.remove();if(this.#drawn)Plotly.purge(this.#element); }
}
