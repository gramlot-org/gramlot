import {chartData3D} from '../chart-data.js';

/** Plotly Cartesian 3D translation: no measure calculation or grouping. */
export function plotlySpatial({view,category,structure,fields,settings,domains},type,layout) {
    const second=structure.getItem('secondCaptionField'),rows=view.getRows();
    const axes=[category,second].map((field,i)=>({field,
        numeric:domains?domains.dimensions[i].kind!=='category':rows.every(row=>{const value=view.value(row,field);return typeof value==='number'&&Number.isFinite(value)||value instanceof Date&&Number.isFinite(value.getTime());}),
        date:domains?domains.dimensions[i].kind==='time':rows.length>0&&view.value(rows[0],field) instanceof Date}));
    if(type!=='line3D'&&axes.some(axis=>!axis.numeric))throw new TypeError('Choose numeric or date fields for both dimensions');
    const datasets=fields.map(field=>chartData3D(view,category,second,field,domains));
    const dimensions=datasets[0]?.dimensions ?? [[],[]];
    const coordinates=dimensions.map((values,i)=>values.map((value,index)=>axes[i].numeric?(axes[i].date?Date.parse(value):Number(value)):index));
    const axis=i=>({title:{text:axes[i].field},type:axes[i].date?'date':'linear',
        ...(!axes[i].numeric?{tickvals:coordinates[i],ticktext:dimensions[i],...(domains?{range:[-0.5,dimensions[i].length-0.5],autorange:false}:{})}:domains?{range:domains.dimensions[i].range,autorange:false}:{})});
    layout.scene={xaxis:axis(0),yaxis:axis(1),zaxis:{title:{text:'Value'},...(domains?{range:domains.z,autorange:false}:{})},aspectmode:'cube'};
    const data=[];
    datasets.forEach((dataset,i)=>{
        const color=settings[i].color,common={name:fields[i],legendgroup:fields[i],showlegend:true};
        const mapped=dataset.source.map(([x,y,z])=>[coordinates[0][x],coordinates[1][y],z]);
        if(type==='surface') {
            const xs=[...coordinates[0]].sort((a,b)=>a-b),ys=[...coordinates[1]].sort((a,b)=>a-b),values=new Map();
            for(const [x,y,z] of mapped){const key=JSON.stringify([x,y]);if(values.has(key))throw new TypeError('Surface has repeated coordinates: prepare unique coordinate pairs upstream');values.set(key,z);}
            if(xs.length<2||ys.length<2)throw new TypeError('A surface needs at least two distinct values on each dimension');
            data.push({...common,type:'surface',x:xs,y:ys,z:ys.map(y=>xs.map(x=>values.get(JSON.stringify([x,y])) ?? null)),
                connectgaps:false,colorscale:[[0,color],[1,color]],showscale:false,opacity:fields.length>1?0.7:1});
        } else if(type==='line3D') {
            dimensions[1].forEach((_,plane)=>{
                const points=dataset.source.filter(row=>row[1]===plane).map(([x,,z])=>[coordinates[0][x],coordinates[1][plane],z]).sort((a,b)=>a[0]-b[0]);
                data.push({...common,showlegend:plane===0,type:'scatter3d',mode:points.length===1?'lines+markers':'lines',
                    x:points.map(p=>p[0]),y:points.map(p=>p[1]),z:points.map(p=>p[2]),line:{color,width:4},marker:{color,size:4}});
            });
        } else data.push({...common,type:'scatter3d',mode:'markers',x:mapped.map(p=>p[0]),y:mapped.map(p=>p[1]),z:mapped.map(p=>p[2]),marker:{color,size:4}});
    });
    return {data,layout};
}
