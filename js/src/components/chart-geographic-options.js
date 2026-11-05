import {isChartCoordinate,isChartPolygon} from './chart-geometry.js';
import {chartData} from './chart-data.js';

export function chartPolygonGeoJSON(view,nameField,geometryField) {
    if(!geometryField)throw new TypeError('Choose the coordinate field');
    const names=new Set();
    const features=view.getRows().map(row=>{
        const name=String(view.value(row,nameField)),coordinates=view.value(row,geometryField);
        if(names.has(name))throw new TypeError('Polygon names must be unique');
        names.add(name);
        if(!isChartPolygon(coordinates))throw new TypeError('Polygons require closed coordinate rings, including any holes');
        return {type:'Feature',properties:{name},geometry:{type:'Polygon',coordinates}};
    });
    return {type:'FeatureCollection',features};
}

export function chartGeographicOptions(view,type,nameField,geometryField,fields,settings,mapName,geoJSON) {
    if(!geoJSON || geoJSON.type!=='FeatureCollection' || !Array.isArray(geoJSON.features))throw new TypeError('Provide a GeoJSON FeatureCollection in configuration.geoJSON');
    for(const feature of geoJSON.features)if(feature.type!=='Feature'||!['Polygon','MultiPolygon'].includes(feature.geometry?.type)||typeof feature.properties?.name!=='string')throw new TypeError('Map features require Polygon/MultiPolygon geometry and properties.name');
    const rows=view.getRows();
    if(type!=='map3D'&&!geometryField)throw new TypeError('Choose the coordinate field');
    const mapValues=type==='map3D'?chartData(view,nameField,fields).source:null;
    if(mapValues&&new Set(mapValues.map(row=>row[0])).size!==mapValues.length)throw new TypeError('Provide one prepared row per territory; aggregate the store upstream');
    const geometry=type==='lines3D'?rows.map(row=>{
        const coords=view.value(row,geometryField);
        if(!Array.isArray(coords)||coords.length<2||!coords.every(isChartCoordinate))throw new TypeError('Paths require a list of at least two longitude/latitude/altitude coordinates');
        return coords;
    }):[];
    const series=[],geo3D=[],title=[];
    fields.forEach((field,index)=>{
        const viewport={left:`${index*100/fields.length}%`,width:`${100/fields.length}%`,top:35,bottom:60,height:null};
        title.push({text:field,left:`${(index+0.5)*100/fields.length}%`,top:8,textAlign:'center',textStyle:{fontSize:13,color:'#333'}});
        const values=type==='map3D'?mapValues.map(row=>({name:String(row[0]),value:row[index+1]})):rows.map(row=>({name:String(view.value(row,nameField)),value:view.value(row,field)}));
        if(values.some(item=>typeof item.value!=='number'||!Number.isFinite(item.value)||item.value<0))throw new TypeError('Geographic measures require finite nonnegative values');
        const common={id:field,name:field,type,itemStyle:{color:settings[index].color},shading:'lambert'};
        if(type!=='lines3D')series.push({...common,type:'map3D',...viewport,map:mapName,label:{show:true},
            data:values.map(item=>({...item,height:item.value})),viewControl:{projection:'perspective',distance:180,alpha:35,beta:20}});
        else {
            geo3D.push({...viewport,map:mapName,regionHeight:0,itemStyle:{color:'#e8edf1',opacity:0.5},viewControl:{projection:'perspective',distance:180,alpha:35,beta:20}});
            const data=values.map((item,i)=>({...item,coords:geometry[i],height:item.value}));
            series.push({...common,coordinateSystem:'geo3D',geo3DIndex:index,data,
                polyline:true,silent:false,lineStyle:{color:settings[index].color,width:4,opacity:1}});
        }
    });
    return {backgroundColor:'#fff',title,legend:{type:'scroll',data:fields,left:12,right:12,bottom:10},
        tooltip:{renderMode:'richText'},geo3D,series};
}
