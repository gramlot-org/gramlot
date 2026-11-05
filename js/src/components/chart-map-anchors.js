/** Interior display anchors, not customer coordinates or geocoding. */
export function chartMapAnchors(geoJSON) {
    const area=ring=>Math.abs(ring.slice(1).reduce((sum,p,i)=>sum+ring[i][0]*p[1]-p[0]*ring[i][1],0));
    return new Map(geoJSON.features.map(feature=>{
        const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
        const rings=[...polygons].sort((a,b)=>area(b[0])-area(a[0]))[0];
        const ys=rings[0].map(p=>p[1]);
        // Use an interior scanline between vertices; even/odd intersections respect holes.
        const levels=[...new Set(ys)].sort((a,b)=>a-b),middle=(levels[0]+levels.at(-1))/2;
        const gaps=levels.slice(1).map((v,i)=>(levels[i]+v)/2).sort((a,b)=>Math.abs(a-middle)-Math.abs(b-middle));
        for(const y of gaps){
            const xs=[];
            for(const ring of rings)for(let i=1;i<ring.length;i++){
                const a=ring[i-1],b=ring[i];
                if((a[1]>y)!==(b[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));
            }
            xs.sort((a,b)=>a-b);
            let best=null;
            for(let i=0;i+1<xs.length;i+=2)if(xs[i+1]>xs[i]&&(!best||xs[i+1]-xs[i]>best[1]-best[0]))best=[xs[i],xs[i+1]];
            if(best)return [feature.properties.name,[(best[0]+best[1])/2,y]];
        }
        throw new TypeError(`Territory has no drawable interior: ${feature.properties.name}`);
    }));
}
