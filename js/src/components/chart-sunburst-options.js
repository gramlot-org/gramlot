import {chartPalette} from './chart-domains.js';
import {chartCaption,chartHierarchy} from './chart-type-data.js';

/** Concentric rings from a nested Bag, the top level at the center. */
export function chartSunburstOptions(context) {
    const data=chartHierarchy(context,'Sunburst',chartPalette);
    const [field]=context.fields;
    return {backgroundColor:'#ffffff',tooltip:{trigger:'item',formatter:'{b}: {c}'},
        series:[{id:field,name:chartCaption(context.seriesOptions,field),type:'sunburst',radius:[0,'92%'],center:['50%','50%'],
            sort:null,nodeClick:'rootToNode',label:{rotate:'radial',minAngle:8},
            itemStyle:{borderColor:'#ffffff',borderWidth:1},data}]};
}
