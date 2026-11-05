import {chartPalette,chartLabel} from '../chart-domains.js';
import {chartData} from '../chart-data.js';

/** Shared 2D layout; each type declares its presentation capabilities. */
export function cartesianOptions({view,category,fields,settings,domains}, {seriesType,radial=false,horizontal=false,stacked=false,scatter=false,area=false,donut=false}) {
        const {source,kind} = chartData(view,category,fields,domains?.dimension);
        if (stacked && new Set(settings.map(option => option.axis)).size > 1) throw new TypeError('Stacked series need the same scale. Assign all selected measures to the same axis.');
        if (scatter && !['value','time'].includes(kind)) throw new TypeError('Scatter needs a numeric or date dimension. Choose another column.');
        if (radial && source.some(row => row[1] < 0)) throw new TypeError('Pie and donut require nonnegative values.');
        const numericAxes = ['left','right'].map((side,index) => ({type:'value',
            position:horizontal ? ['bottom','top'][index] : side,
            show:settings.some(options => options.axis === side),
            name:fields.filter((field,i) => settings[i].axis === side).join(', '),
            ...(domains?{min:domains.axes[side][0],max:domains.axes[side][1]}:{}),splitLine:{show:index === 0}}));
        const option = {backgroundColor:'#ffffff',useUTC:true,legend:{show:true},
            tooltip:{trigger:radial || scatter ? 'item' : 'axis'},
            grid:{left:80,right:75,top:65,bottom:65}};
        if (radial) {
            option.legend = {show:true,type:'scroll',orient:'horizontal',left:12,right:12,bottom:10,height:24};
            option.series = fields.map(field => ({id:field,name:field,type:'pie',top:12,bottom:64,left:12,right:12,
                label:{alignTo:'edge',edgeDistance:10,overflow:'truncate'},labelLayout:{hideOverlap:true},
                radius:donut ? ['35%','65%'] : '65%',
                data:source.map(row => ({name:kind === 'time' ? new Date(row[0]).toISOString().slice(0,10) : String(row[0]),value:row[1],...(domains?{itemStyle:{color:chartPalette[domains.labels.indexOf(chartLabel(row[0],kind))%chartPalette.length]}}:{})}))}));
        } else {
            const renderedSource = horizontal && kind === 'time' ? source.map(row => [new Date(row[0]).toISOString().slice(0,10),...row.slice(1)]) : source;
            option.dataset = {source:renderedSource,sourceHeader:false};
            const dimension = {type:horizontal ? 'category' : kind === 'value' && seriesType === 'bar' ? 'category' : kind};
            // Coordinates follow the visible domain; only measure axes need a zero baseline.
            if(dimension.type==='value')dimension.scale=true;
            if(domains){
                if(dimension.type==='category'){
                    // Explicit ordinal domains interpret numbers as indices in ECharts.
                    dimension.data=domains.dimension.values.map(v=>chartLabel(v,kind));
                    option.dataset.source=source.map(row=>[chartLabel(row[0],kind),...row.slice(1)]);
                }
                else {dimension.min=domains.dimension.range[0];dimension.max=domains.dimension.range[1];}
            }
            option.xAxis = horizontal ? numericAxes : dimension;
            option.yAxis = horizontal ? dimension : numericAxes;
            option.series = fields.map((field,index) => ({id:field,name:field,
                type:seriesType,
                ...(seriesType==='line' ? {showSymbol:source.length===1} : {}),
                ...(horizontal ? {xAxisIndex:settings[index].axis === 'right' ? 1 : 0} : {yAxisIndex:settings[index].axis === 'right' ? 1 : 0}),
                ...(stacked ? {stack:'measures'} : {}),
                ...(area ? {areaStyle:{opacity:0.3}} : {}),
                itemStyle:{color:settings[index].color},lineStyle:{color:settings[index].color},
                encode:horizontal ? {x:index+1,y:0} : {x:0,y:index+1}}));
        }
    return option;
}
