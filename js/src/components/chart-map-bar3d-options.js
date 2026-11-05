import {chartData} from './chart-data.js';
import {validateChartGeoJSON} from './chart-geojson.js';
import {chartMapAnchors} from './chart-map-anchors.js';
import {chartRange} from './chart-domains.js';

/** Geographic columns retain source values; only drawing positions are offset. */
export function chartMapBar3DOptions({view,category,fields,settings,structure,seriesOptions,domains},mapName) {
    const geoJSON=validateChartGeoJSON(structure.getItem('geoJSON'));
    const scale=structure.getItem('mapBarScale') ?? 'zero';
    if(!['zero','extent'].includes(scale))throw new TypeError('Choose zero or extent for geographic bar heights');
    const anchors=chartMapAnchors(geoJSON),{source}=chartData(view,category,fields);
    if(new Set(source.map(row=>String(row[0]))).size!==source.length)throw new TypeError('Provide one prepared row per territory; aggregate the store upstream');
    const rows=source.filter(row=>anchors.has(String(row[0])));
    if(source.length&&!rows.length)throw new TypeError('No store territories match GeoJSON properties.name');
    const values=rows.flatMap(row=>row.slice(1));
    if(values.some(v=>!Number.isFinite(v)||v<0))throw new TypeError('Geographic bars require finite nonnegative measures');
    const range=domains?domains.z:chartRange(values,scale==='zero');
    const min=scale==='zero'?0:range[0],max=range[1];
    const longitudes=geoJSON.features.flatMap(f=>(f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates).flatMap(p=>p[0].map(point=>point[0])));
    const [west,east]=longitudes.reduce(([min,max],v)=>[Math.min(min,v),Math.max(max,v)],[Infinity,-Infinity]);
    const width=east-west;
    const size=0.45,spacing=width/100*size*1.25;
    const caption=field=>seriesOptions.getItem(field).getItem('caption') || field;
    const series=fields.map((field,index)=>({
        id:field,name:caption(field),type:'bar3D',coordinateSystem:'geo3D',geo3DIndex:0,
        barSize:size,shading:'lambert',itemStyle:{color:settings[index].color},
        label:{show:false},emphasis:{label:{show:true,formatter:p=>Number(p.value[2]).toLocaleString('en-GB',{maximumFractionDigits:2})}},
        data:rows.map(row=>{const [lng,lat]=anchors.get(String(row[0]));return {name:String(row[0]),value:[lng+(index-(fields.length-1)/2)*spacing,lat,row[index+1]]};})
    }));
    // Owner-approved renderer reference: fixes altitude extent without altering store values.
    const anchor=anchors.values().next().value;
    series.push({id:'map-height-reference',type:'scatter3D',coordinateSystem:'geo3D',geo3DIndex:0,
        silent:true,symbolSize:0,itemStyle:{opacity:0},label:{show:false},tooltip:{show:false},
        data:[[...anchor,min],[...anchor,max]]});
    return {backgroundColor:'#fff',legend:{type:'scroll',data:fields.map(caption),bottom:8},
        title:{text:scale==='zero'?'Geographic bars · baseline 0':'Geographic bars · truncated baseline',left:'center',top:8,textStyle:{fontSize:14,color:'#27344b'}},
        tooltip:{renderMode:'richText',formatter:p=>`${p.name}\n${p.seriesName}: ${Number(p.value[2]).toLocaleString('en-GB',{maximumFractionDigits:2})}`},
        geo3D:{map:mapName,top:35,bottom:45,boxWidth:100,boxHeight:35,regionHeight:0.15,
            itemStyle:{color:'#d9e3eb',borderColor:'#8e9ca9',borderWidth:0.3},label:{show:false},shading:'lambert',
            viewControl:{projection:'perspective',distance:145,minDistance:30,maxDistance:300,alpha:45,beta:0}},series};
}
