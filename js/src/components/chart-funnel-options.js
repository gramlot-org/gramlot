import {chartPalette} from './chart-domains.js';
import {chartCell,chartName,chartCaption} from './chart-type-data.js';

/** Funnel stages in store order. Empty measures are skipped, never drawn as zero. */
export function chartFunnelOptions({view,category,fields,seriesOptions}) {
    const [field]=fields;
    const data=[];
    for(const row of view.getRows()) {
        const value=chartCell(view,row,field);
        if(value===null)continue;
        if(value<0)throw new TypeError('Funnel requires nonnegative values.');
        const name=chartName(view.value(row,category),category);
        data.push({name,value,itemStyle:{color:chartPalette[data.length%chartPalette.length]}});
    }
    return {backgroundColor:'#ffffff',tooltip:{trigger:'item',formatter:'{b}: {c}'},
        legend:{show:true,type:'scroll',orient:'horizontal',left:12,right:12,bottom:10,height:24,data:data.map(item=>item.name)},
        series:[{id:field,name:chartCaption(seriesOptions,field),type:'funnel',top:20,bottom:64,left:'10%',width:'80%',
            sort:'none',gap:2,label:{show:true,position:'inside'},data}]};
}
