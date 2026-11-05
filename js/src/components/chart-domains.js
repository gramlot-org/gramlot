import {chartData} from './chart-data.js';

export const chartPalette=['#5470c6','#91cc75','#fac858','#ee6666','#73c0de','#3ba272','#fc8452','#9a60b4','#ea7ccc'];
export function chartRange(values,zero=false) {
    let min=zero?0:Infinity,max=zero?0:-Infinity;
    for(const value of values)if(Number.isFinite(value)){min=Math.min(min,value);max=Math.max(max,value);}
    if(min===Infinity)return [0,1];
    if(min===max){const delta=Math.abs(min)*0.05||1;return zero&&min===0?[0,1]:[min-delta,max+delta];}
    return [min,max];
}
export function chartLabel(value,kind){return kind==='time'?new Date(value).toISOString().slice(0,10):String(value);}

/** Rendering extents only: source measures are neither grouped nor replaced. */
export function chartDomains(view,{category,fields,settings,structure,type}) {
    const {source,kind}=chartData(view,category,fields);
    const categories=[...new Set(source.map(row=>row[0]))];
    const dimension={kind,values:categories,range:chartRange(categories)};
    const axes={};
    for(const side of ['left','right']) {
        const indexes=fields.map((_,i)=>i).filter(i=>settings[i].axis===side);
        const values=[];
        for(const row of source) {
            if(['stackedBar','stackedArea'].includes(type.id)) {
                values.push(indexes.reduce((v,i)=>v+Math.max(0,row[i+1]),0),indexes.reduce((v,i)=>v+Math.min(0,row[i+1]),0));
            } else for(const i of indexes)values.push(row[i+1]);
        }
        axes[side]=chartRange(values,true);
    }
    const secondField=type.controls.includes('secondDimension')?structure.getItem('secondCaptionField'):null;
    const second=secondField?chartData(view,secondField,[]):null;
    const dimensions=[dimension,...(second?[{kind:second.kind,values:[...new Set(second.source.map(row=>row[0]))],range:chartRange(second.source.map(row=>row[0]))}]:[])];
    const mapField=type.id==='map'?structure.getItem('mapValueField'):null;
    const geoJSON=mapField?structure.getItem('geoJSON'):null;
    const territories=geoJSON?new Set(geoJSON.features.map(f=>f.properties.name)):null;
    const mapValues=mapField?view.getRows().filter(row=>!territories||territories.has(String(view.value(row,category)))).map(row=>view.value(row,mapField)):[];
    if(mapValues.some(value=>typeof value!=='number'||!Number.isFinite(value)))throw new TypeError('Selected map measure requires finite numeric values');
    const signed=mapValues.some(v=>v<0);
    let [min,max]=chartRange(mapValues);
    if(signed){max=Math.max(Math.abs(min),Math.abs(max));min=-max;}
    else min=Math.max(0,min);
    const barNames=type.id==='mapBar3D'?new Set(structure.getItem('geoJSON').features.map(f=>f.properties.name)):null;
    const heights=source.filter(row=>!barNames||barNames.has(String(row[0]))).flatMap(row=>row.slice(1));
    return {dimension,dimensions,axes,z:chartRange(heights,type.id!=='mapBar3D'||structure.getItem('mapBarScale')!=='extent'),
        labels:categories.map(value=>chartLabel(value,kind)),
        map:{min,max,signed},count:categories.length};
}
