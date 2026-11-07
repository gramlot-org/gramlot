import {chartCell,chartName,chartCaption} from './chart-type-data.js';

/** X categories from `captionField`, Y categories from `secondCaptionField`, one measure as cell color. */
export function chartHeatmapOptions({view,category,structure,fields,settings,seriesOptions}) {
    const second=structure.getItem('secondCaptionField');
    if(typeof second!=='string'||!second||second===category)throw new TypeError('Heatmap needs a second dimension different from the category. Choose another column.');
    if(fields.length!==1)throw new TypeError('Heatmap needs exactly one measure. Select one measure.');
    const [field]=fields;
    const xs=[],ys=[],xIndex=new Map(),yIndex=new Map(),seen=new Set(),data=[];
    const index=(list,map,name)=>{if(!map.has(name)){map.set(name,list.length);list.push(name);}return map.get(name);};
    for(const row of view.getRows()) {
        const x=index(xs,xIndex,chartName(view.value(row,category),category));
        const y=index(ys,yIndex,chartName(view.value(row,second),second));
        const value=chartCell(view,row,field);
        if(value===null)continue;
        const key=`${x}:${y}`;
        if(seen.has(key))throw new TypeError(`Heatmap has two cells for ${xs[x]} / ${ys[y]}. Prepare one row per pair upstream.`);
        seen.add(key);
        data.push([x,y,value]);
    }
    let min=data.length?Math.min(...data.map(cell=>cell[2])):0,max=data.length?Math.max(...data.map(cell=>cell[2])):1;
    if(min===max){min-=1;max+=1;}
    const name=chartCaption(seriesOptions,field);
    return {backgroundColor:'#ffffff',tooltip:{trigger:'item',position:'top'},
        grid:{left:80,right:40,top:36,bottom:110},
        xAxis:{type:'category',data:xs,name:category,splitArea:{show:true}},
        yAxis:{type:'category',data:ys,name:second,splitArea:{show:true}},
        visualMap:{type:'continuous',min,max,calculable:true,orient:'horizontal',left:'center',bottom:10,
            inRange:{color:['#f3f6fb',settings[0].color]}},
        series:[{id:field,name,type:'heatmap',data,emphasis:{itemStyle:{borderColor:'#333',borderWidth:1}}}]};
}
