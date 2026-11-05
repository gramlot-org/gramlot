import {chartData} from './chart-data.js';
import {validateChartGeoJSON} from './chart-geojson.js';

/** Validate and project prepared territory measures for any renderer. */
export function chartMapData(view,nameField,valueField,labelField,geoJSON) {
    validateChartGeoJSON(geoJSON);
    if(!valueField)throw new TypeError('Choose a map measure');
    const {source}=chartData(view,nameField,[valueField]);
    if(new Set(source.map(row=>String(row[0]))).size!==source.length)throw new TypeError('Provide one prepared row per territory; aggregate the store upstream');
    const labels=new Map();
    for(const row of view.getRows()) {
        const name=String(view.value(row,nameField)),label=view.value(row,labelField);
        if(typeof label!=='string' && typeof label!=='number')throw new TypeError('Choose a text or numeric map label field');
        if(labels.has(name)&&labels.get(name)!==String(label))throw new TypeError('Map labels must be consistent for each territory');
        labels.set(name,String(label));
    }
    const names=new Set(geoJSON.features.map(f=>f.properties.name));
    const data=source.filter(row=>names.has(String(row[0]))).map(([name,value])=>({name:String(name),value}));
    if(source.length&&!data.length)throw new TypeError('No store territories match GeoJSON properties.name');
    const values=data.map(row=>row.value),signed=values.some(value=>value<0);
    let min=values.length?Math.min(...values):0,max=values.length?Math.max(...values):1;
    if(signed){max=Math.max(Math.abs(min),Math.abs(max));min=-max;}
    else if(min===max){const delta=Math.abs(max)*0.01||1;min=Math.max(0,min-delta);max+=delta;}
    return {data,labels,min,max,signed};
}
