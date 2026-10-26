/** Transformed outer rectangles. Contact is allowed; shadows/radii are irrelevant. */
const EPSILON=1e-7;
const radians=degrees=>degrees*Math.PI/180;
const dot=(p,n)=>p.x*n.x+p.y*n.y;
const axes=r=>{const a=radians(r.rotation??0);return [{x:Math.cos(a),y:Math.sin(a)},{x:-Math.sin(a),y:Math.cos(a)}];};
export function corners(r) {
    const [u,v]=axes(r),s=r.scale??1,cx=r.left+r.width/2,cy=r.top+r.height/2;
    return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>({
        x:cx+s*(u.x*x*r.width+v.x*y*r.height)/2,
        y:cy+s*(u.y*x*r.width+v.y*y*r.height)/2}));
}
function projection(points,n){const values=points.map(p=>dot(p,n));return [Math.min(...values),Math.max(...values)];}
export function overlaps(a,b) {
    const pa=corners(a),pb=corners(b);
    return [...axes(a),...axes(b)].every(n=>{
        const [amin,amax]=projection(pa,n),[bmin,bmax]=projection(pb,n);
        return amax>bmin+EPSILON && bmax>amin+EPSILON;
    });
}
function pose(from,to,t){return Object.fromEntries(Object.keys(from).map(key=>[key,from[key]+(to[key]-from[key])*t]));}

// With fixed orientation and linear corner paths SAT gives exact entry/exit times.
function linearContact(from,to,obstacles,bounds) {
    const start=corners(from),end=corners(to);let fraction=1;
    for(const obstacle of obstacles) {
        let enter=0,leave=1;const other=corners(obstacle);
        for(const axis of [...axes(from),...axes(obstacle)]) {
            const [a,b]=projection(start,axis),[c,d]=projection(end,axis),[low,high]=projection(other,axis);
            for(const [first,last] of [[b-low,d-low],[high-a,high-c]]) {
                const delta=last-first;
                if(Math.abs(delta)<1e-12){if(first<=EPSILON)leave=0;}
                else if(delta>0)enter=Math.max(enter,-first/delta);
                else leave=Math.min(leave,-first/delta);
            }
        }
        if(enter<leave&&leave>0&&enter<1)fraction=Math.min(fraction,Math.max(0,enter));
    }
    if(bounds)for(let i=0;i<4;i++)for(const [key,max] of [['x',bounds.width],['y',bounds.height]]) {
        const a=start[i][key],b=end[i][key];
        if(b<0&&b<a)fraction=Math.min(fraction,Math.max(0,a/(a-b)));
        if(b>max&&b>a)fraction=Math.min(fraction,Math.max(0,(max-a)/(b-a)));
    }
    return fraction;
}

/** First contact along the whole path, including rotation through a free end pose. */
export function contactFraction(start,end,obstacles,bounds) {
    const from={...start,rotation:start.rotation??0,scale:start.scale??1};
    const to={...end,rotation:end.rotation??0,scale:end.scale??1};
    // Pure rotations repeat after a full turn. Certifying the first turn also
    // certifies every later turn, avoiding work proportional to an entered angle.
    const turn=to.rotation-from.rotation;
    if(Math.abs(turn)>360 && ['left','top','width','height','scale'].every(key=>from[key]===to[key])) {
        const first=contactFraction(from,{...to,rotation:from.rotation+Math.sign(turn)*360},obstacles,bounds);
        return first===1?1:first*360/Math.abs(turn);
    }
    const omega=Math.abs(radians(to.rotation-from.rotation)),ds=Math.abs(to.scale-from.scale);
    const dr=Math.hypot(to.width-from.width,to.height-from.height)/2;
    const radius=Math.max(Math.hypot(from.width,from.height),Math.hypot(to.width,to.height))/2;
    const scale=Math.max(from.scale,to.scale);
    // Upper bound on every corner's acceleration. A curve differs from its
    // endpoint chord by at most acceleration * duration² / 8. This certifies
    // free intervals; endpoint sampling alone could skip an entire collision.
    const acceleration=2*ds*dr+2*omega*(ds*radius+scale*dr)+omega*omega*scale*radius;
    if(acceleration===0)return linearContact(from,to,obstacles,bounds);
    const fixed=obstacles.map(r=>({points:corners(r),axes:axes(r)}));
    function freeInterval(a,b) {
        const p=corners(pose(from,to,a)),q=corners(pose(from,to,b)),points=[...p,...q];
        const margin=acceleration*(b-a)**2/8;
        if(bounds && points.some(point=>point.x-margin < -EPSILON || point.y-margin < -EPSILON
            || point.x+margin>bounds.width+EPSILON || point.y+margin>bounds.height+EPSILON))return false;
        const movingAxes=axes(pose(from,to,(a+b)/2));
        return fixed.every(other=>[...movingAxes,...other.axes].some(axis=>{
            const [lo,hi]=projection(points,axis),[olo,ohi]=projection(other.points,axis);
            return hi+margin<=olo+EPSILON || lo-margin>=ohi-EPSILON;
        }));
    }
    const speed=Math.hypot(to.left-from.left+(to.width-from.width)/2,to.top-from.top+(to.height-from.height)/2)
        +ds*radius+scale*dr+omega*scale*radius;
    function search(a,b) {
        if(freeInterval(a,b))return b;
        if(speed*(b-a)<=EPSILON || b-a<Number.EPSILON*4)return a;
        const mid=(a+b)/2,first=search(a,mid);
        return first<mid?first:search(mid,b);
    }
    return search(0,1);
}
