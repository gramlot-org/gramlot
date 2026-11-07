import {chartPalette} from './chart-domains.js';
import {chartCell,chartName,chartCaption,chartSeriesNumber} from './chart-type-data.js';

/**
 * One axis per measure and one polygon per row. The axis maximum is the largest value unless `max` is set in the measure series options.
 * A polygon needs a value on every axis: ECharts plots an empty vertex at the center, which would read as zero,
 * so a row with an empty measure is left out.
 */
export function chartRadarOptions({view,category,fields,seriesOptions}) {
    if(!fields.length)throw new TypeError('Radar needs at least one measure.');
    const rows=[];
    for(const row of view.getRows()) {
        const values=fields.map(field=>chartCell(view,row,field));
        if(values.some(value=>value===null))continue;
        rows.push({name:chartName(view.value(row,category),category),values});
    }
    const indicator=fields.map((field,index)=>{
        const present=rows.map(row=>row.values[index]).filter(value=>value!==null);
        const min=chartSeriesNumber(seriesOptions,field,'min')??Math.min(0,...present);
        let max=chartSeriesNumber(seriesOptions,field,'max')??(present.length?Math.max(...present):1);
        if(max<=min)max=min+1;
        return {name:chartCaption(seriesOptions,field),min,max};
    });
    return {backgroundColor:'#ffffff',tooltip:{trigger:'item'},
        legend:{show:true,type:'scroll',orient:'horizontal',left:12,right:12,bottom:10,height:24,data:rows.map(row=>row.name)},
        radar:{indicator,center:['50%','48%'],radius:'62%'},
        series:[{type:'radar',areaStyle:{opacity:0.15},
            data:rows.map((row,index)=>({name:row.name,value:row.values,
                itemStyle:{color:chartPalette[index%chartPalette.length]},lineStyle:{color:chartPalette[index%chartPalette.length]}}))}]};
}
