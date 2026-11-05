import {chartData3D} from './chart-data.js';


/** Cartesian 3D series keep store values and category labels on their actual axes. */
export function chartSpatialOptions(view,type,first,second,fields,settings,domains) {
    const rows=view.getRows();
    const numeric=field=>rows.every(row=>{
        const value=view.value(row,field);
        return typeof value==='number'&&Number.isFinite(value) || value instanceof Date&&Number.isFinite(value.getTime());
    });
    const axes=[first,second].map((field,i)=>({numeric:domains?domains.dimensions[i].kind!=='category':numeric(field),date:domains?domains.dimensions[i].kind==='time':rows.length>0&&view.value(rows[0],field) instanceof Date}));
    if(['scatter3D','surface'].includes(type)&&axes.some(axis=>!axis.numeric))throw new TypeError('Choose numeric or date fields for both dimensions');
    const datasets=fields.map(field=>chartData3D(view,first,second,field,domains));
    const dimensions=datasets[0]?.dimensions ?? [[],[]];
    const coordinates=dimensions.map((values,axis)=>values.map((value,index)=>axes[axis].numeric?(axes[axis].date?Date.parse(value):Number(value)):index));
    const axisOptions=index=>({type:axes[index].numeric?'value':'category',name:[first,second][index],nameGap:35,
        ...(axes[index].numeric?(domains?{min:domains.dimensions[index].range[0],max:domains.dimensions[index].range[1]}:{}):{data:dimensions[index]}),
        ...(axes[index].date?{axisLabel:{formatter:value=>new Date(value).toISOString().slice(0,10)}}:{})});
    const series=[];
    datasets.forEach((dataset,index)=>{
        const common={name:fields[index],type,itemStyle:{color:settings[index].color},lineStyle:{color:settings[index].color,width:3}};
        const mapped=dataset.source.map(([x,y,z])=>[coordinates[0][x],coordinates[1][y],z]);
        if(type==='line3D') {
            dimensions[1].forEach((plane,y)=>{
                const data=dataset.source.filter(row=>row[1]===y).map(([x,,z])=>[coordinates[0][x],coordinates[1][y],z]).sort((a,b)=>a[0]-b[0]);
                series.push({...common,id:`${fields[index]}:${y}`,data});
            });
        } else if(type==='surface') {
            const xs=[...coordinates[0]].sort((a,b)=>a-b),ys=[...coordinates[1]].sort((a,b)=>a-b),values=new Map();
            for(const [x,y,z] of mapped){const key=JSON.stringify([x,y]);if(values.has(key))throw new TypeError('Surface has repeated coordinates: prepare unique coordinate pairs upstream');values.set(key,z);}
            if(xs.length<2||ys.length<2)throw new TypeError('A surface needs at least two distinct values on each dimension');
            series.push({...common,id:fields[index],dataShape:[ys.length,xs.length],shading:'lambert',
                itemStyle:{color:settings[index].color,opacity:fields.length>1?0.7:1},
                data:ys.flatMap(y=>xs.map(x=>[x,y,values.get(JSON.stringify([x,y])) ?? NaN]))});
        } else series.push({...common,id:fields[index],symbolSize:9,data:mapped});
    });
    return {backgroundColor:'#fff',legend:{type:'scroll',left:12,right:12,bottom:10,data:fields},
        tooltip:{renderMode:'richText'},xAxis3D:axisOptions(0),yAxis3D:axisOptions(1),zAxis3D:{type:'value',name:'Value',nameGap:40,...(domains?{min:domains.z[0],max:domains.z[1]}:{})},
        grid3D:{top:8,bottom:64,height:null,left:16,right:16,width:null,boxWidth:100,boxDepth:80,viewControl:{projection:'perspective'}},series};
}
