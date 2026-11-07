import {chartCell,chartName,chartCaption} from './chart-type-data.js';

/**
 * One box per row. `valueFields` is read as min, q1, median, q3, max; the statistics belong to the host, raw data is not accepted.
 * A row with an empty value is skipped; a row whose five values decrease is an error naming its caption.
 */
export function chartBoxplotOptions({view,category,fields,seriesOptions}) {
    const names=[],data=[];
    for(const row of view.getRows()) {
        const values=fields.map(field=>chartCell(view,row,field));
        if(values.some(value=>value===null))continue;
        const name=chartName(view.value(row,category),category);
        if(values.some((value,index)=>index>0&&value<values[index-1]))throw new TypeError(`Boxplot row ${name} must satisfy min <= q1 <= median <= q3 <= max.`);
        names.push(name);
        data.push(values);
    }
    return {backgroundColor:'#ffffff',tooltip:{trigger:'item'},
        grid:{left:60,right:30,top:30,bottom:50},
        xAxis:{type:'category',data:names,name:category,boundaryGap:true},
        yAxis:{type:'value',scale:true},
        series:[{id:fields[0],name:chartCaption(seriesOptions,fields[0]),type:'boxplot',data}]};
}
