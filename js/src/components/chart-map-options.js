import {chartMapLabel,chartMapColors} from './chart-map-labels.js';
import {chartMapData} from './chart-map-data.js';

/** A choropleth consumes explicit store measures; business ratios stay with their data owner. */
export function chartMapOptions(view,nameField,valueField,labelField,mapName,geoJSON,caption,domains,labelMode='value') {
    const {data,labels,...extent}=chartMapData(view,nameField,valueField,labelField,geoJSON);
    const {min,max,signed}=domains?domains.map:extent;
    const format=value=>Number(value).toLocaleString('en-GB',{maximumFractionDigits:2});
    const title=caption || valueField;
    return {backgroundColor:'#fff',title:{text:title,left:'center',top:8,textStyle:{color:'#27344b',fontSize:14}},
        tooltip:{trigger:'item',renderMode:'richText',formatter:params=>`${labels.get(params.name) || params.name}\n${title}: ${Number.isFinite(params.value)?format(params.value):'No data'}`},
        visualMap:{type:'continuous',min,max,seriesIndex:0,dimension:0,calculable:true,orient:'horizontal',left:'center',bottom:12,
            itemWidth:12,itemHeight:180,precision:2,formatter:format,textStyle:{color:'#27344b'},
            inRange:{color:signed?['#b73548','#f7f7f7','#2166ac']:chartMapColors},outOfRange:{color:'#e2e5e9'}},
        series:[{name:title,type:'map',map:mapName,preserveAspect:'contain',aspectScale:1,roam:true,top:42,bottom:70,left:20,right:20,
            itemStyle:{areaColor:'#e2e5e9',borderColor:'#fff',borderWidth:0.45},
            label:{show:true,color:'#182c46',fontSize:11,textBorderColor:'#fff',textBorderWidth:3,
                formatter:params=>chartMapLabel(labels.get(params.name) || params.name,params.value,labelMode)},labelLayout:{hideOverlap:true},
            emphasis:{label:{show:true},itemStyle:{borderColor:'#1b273d',borderWidth:2}},data}]};
}
