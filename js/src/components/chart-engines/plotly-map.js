import {chartMapLabel,chartMapColors} from '../chart-map-labels.js';
import {chartMapAnchors} from '../chart-map-anchors.js';
import {chartMapData} from '../chart-map-data.js';

export function plotlyMap({view,category,structure,seriesOptions,domains},layout) {
    const field=structure.getItem('mapValueField'),geoJSON=structure.getItem('geoJSON');
    const {data,labels,...extent}=chartMapData(view,category,field,structure.getItem('mapLabelField'),geoJSON);
    const {min,max,signed}=domains?domains.map:extent;
    // Plotly's spherical geographic renderer expects clockwise exteriors, unlike RFC 7946.
    // Change only drawing winding on a copy; never mutate the supplied GeoJSON.
    const rings=polygon=>polygon.map((ring,index)=>{
        const area=ring.slice(1).reduce((sum,point,i)=>sum+ring[i][0]*point[1]-point[0]*ring[i][1],0);
        return (index===0?area>0:area<0)?[...ring].reverse():ring;
    });
    const geometry={...geoJSON,features:geoJSON.features.map(feature=>({...feature,geometry:{...feature.geometry,
        coordinates:feature.geometry.type==='Polygon'?rings(feature.geometry.coordinates):feature.geometry.coordinates.map(rings)}}))};
    const title=seriesOptions.getItem(field)?.getItem('caption') || field;
    layout.title={text:title};layout.showlegend=false;layout.margin={l:10,r:70,t:45,b:20};
    // Own GeoJSON supplies all geometry; no basemap tiles, tokens or network assets.
    layout.geo={visible:false,showframe:false,showcoastlines:false,showland:false,showocean:false,
        showcountries:false,showlakes:false,showrivers:false,fitbounds:'geojson',projection:{type:'mercator'},bgcolor:'#fff'};
    const colors=signed?['#b73548','#f7f7f7','#2166ac']:chartMapColors;
    const dataTrace={type:'choropleth',geojson:geometry,featureidkey:'properties.name',
        locations:data.map(row=>row.name),z:data.map(row=>row.value),zmin:min,zmax:max,
        colorscale:colors.map((color,i)=>[i/2,color]),marker:{line:{color:'#fff',width:0.45}},
        colorbar:{title:{text:title},thickness:14},hovertemplate:'%{location}<br>%{z:.2f}<extra></extra>'};
    const anchors=chartMapAnchors(geoJSON);
    const centers=data.map(row=>({name:row.name,value:row.value,point:anchors.get(row.name)}));
    const missing=geoJSON.features.map(feature=>feature.properties.name).filter(name=>!data.some(row=>row.name===name));
    const background={type:'choropleth',geojson:geometry,featureidkey:'properties.name',locations:missing,z:missing.map(()=>0),
        colorscale:[[0,'#e2e5e9'],[1,'#e2e5e9']],showscale:false,marker:{line:{color:'#fff',width:0.45}},hovertemplate:'%{location}<br>No data<extra></extra>'};
    return {layout,data:[background,dataTrace,{type:'scattergeo',mode:'text',showlegend:false,hoverinfo:'skip',
        lon:centers.map(p=>p.point[0]),lat:centers.map(p=>p.point[1]),text:centers.map(p=>chartMapLabel(labels.get(p.name) || p.name,p.value,structure.getItem('mapLabelMode') ?? 'value')),textfont:{color:'#182c46',size:11}}]};
}
