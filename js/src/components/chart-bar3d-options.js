import {chartData3D} from './chart-data.js';

/** Place measure bars beside each other inside each category group and plane. */
export function chartBar3DOptions(view, first, second, fields, settings, domains) {
    const datasets=fields.map(field=>chartData3D(view,first,second,field,domains));
    const dimensions=datasets[0]?.dimensions ?? [[],[]];
    const count=fields.length, span=0.72, step=count ? span/count : 0;
    const boxWidth=100,boxDepth=80;
    return {
        backgroundColor:'#ffffff',
        legend:{show:true,type:'scroll',left:12,right:12,bottom:10,height:24,data:fields},
        tooltip:{renderMode:'richText',formatter:params=>{
            const [x,y,value]=params.value;
            return `${first}: ${dimensions[0][Math.round(x)-1]}\n${second}: ${dimensions[1][y]}\n${params.seriesName}: ${value}`;
        }},
        xAxis3D:{type:'value',name:first,nameGap:35,min:0,max:Math.max(2,dimensions[0].length+1),interval:1,
            axisLabel:{formatter:value=>dimensions[0][value-1] ?? ''}},
        yAxis3D:{type:'category',name:second,nameGap:35,data:dimensions[1]},
        zAxis3D:{type:'value',name:'Value',nameGap:40,...(domains?{min:domains.z[0],max:domains.z[1]}:{})},
        grid3D:{top:8,bottom:64,height:null,left:16,right:16,width:null,boxWidth,boxDepth,viewControl:{projection:'perspective'},
            light:{main:{intensity:1.2},ambient:{intensity:0.4}}},
        series:fields.map((field,index)=>({
            id:field,name:field,type:'bar3D',shading:'lambert',
            barSize:[boxWidth/Math.max(2,dimensions[0].length+1)*step*0.85,
                boxDepth/Math.max(1,dimensions[1].length)*0.55],
            data:datasets[index].source.map(([x,y,value])=>[x+1+(index-(count-1)/2)*step,y,value]),
            itemStyle:{color:settings[index].color}
        }))
    };
}
