import {chartPalette} from './chart-domains.js';
import {chartCaption,chartHierarchy} from './chart-type-data.js';

/** Nested rectangles from a nested Bag; the breadcrumb and click drill-down are the ECharts defaults. */
export function chartTreemapOptions(context) {
    const data=chartHierarchy(context,'Treemap',chartPalette);
    const [field]=context.fields;
    return {backgroundColor:'#ffffff',tooltip:{trigger:'item',formatter:'{b}: {c}'},
        series:[{id:field,name:chartCaption(context.seriesOptions,field),type:'treemap',left:10,right:10,top:10,bottom:30,
            roam:false,nodeClick:'zoomToNode',breadcrumb:{show:true,bottom:4},
            label:{show:true,formatter:'{b}'},
            itemStyle:{borderColor:'#ffffff',borderWidth:1,gapWidth:1},
            levels:[{itemStyle:{borderWidth:0,gapWidth:6},upperLabel:{show:true,height:24,color:'#333333',fontWeight:'bold'}},
                {itemStyle:{borderWidth:0,gapWidth:3},upperLabel:{show:true,height:20,color:'#555555'}},{itemStyle:{gapWidth:1}}],
            data}]};
}
