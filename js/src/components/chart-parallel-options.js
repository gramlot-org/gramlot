import {chartPalette} from './chart-domains.js';
import {chartCell,chartName,chartCaption,chartSeriesNumber} from './chart-type-data.js';

/** One vertical axis per measure and one polyline per row; `captionField` names the row. */
export function chartParallelOptions({view,category,fields,seriesOptions}) {
    if(!fields.length)throw new TypeError('Parallel coordinates need at least one measure.');
    const rows=[];
    for(const row of view.getRows()) {
        const values=fields.map(field=>chartCell(view,row,field));
        if(values.every(value=>value===null))continue;
        rows.push({name:chartName(view.value(row,category),category),values});
    }
    const parallelAxis=fields.map((field,dim)=>{
        const axis={dim,name:chartCaption(seriesOptions,field)};
        const min=chartSeriesNumber(seriesOptions,field,'min'),max=chartSeriesNumber(seriesOptions,field,'max');
        if(min!==null)axis.min=min;
        if(max!==null)axis.max=max;
        return axis;
    });
    return {backgroundColor:'#ffffff',tooltip:{trigger:'item'},
        parallel:{left:60,right:60,top:60,bottom:40,parallelAxisDefault:{type:'value',nameLocation:'start',nameGap:20}},
        parallelAxis,
        series:[{type:'parallel',lineStyle:{width:2,opacity:0.7},emphasis:{lineStyle:{width:4,opacity:1}},
            data:rows.map((row,index)=>({name:row.name,value:row.values,lineStyle:{color:chartPalette[index%chartPalette.length]}}))}]};
}
