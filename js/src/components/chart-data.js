/** Project chart rows without calculating or grouping their measures. */
export function chartData(view, category, fields, dimension) {
    let kind = null;
    const source = [];
    for (const node of view.getRows()) {
        const caption = view.value(node, category);
        const current = caption instanceof Date && Number.isFinite(caption.getTime()) ? 'time'
            : typeof caption === 'string' || typeof caption === 'boolean' ? 'category'
            : typeof caption === 'number' && Number.isFinite(caption) ? 'value' : null;
        if (!current || kind && current !== kind) throw new TypeError('Choose a column with consistent text, numeric, boolean or date values');
        kind = current;
        const key = current === 'time' ? caption.getTime() : typeof caption === 'boolean' ? String(caption) : caption;
        const numbers = fields.map(field => view.value(node,field));
        if (numbers.some(value => typeof value !== 'number' || !Number.isFinite(value))) {
            throw new TypeError('Selected measures require finite numeric values');
        }
        source.push([key,...numbers]);
    }
    return {source,kind:kind ?? dimension?.kind ?? 'category'};
}

/** Index category coordinates without calculating measures or inventing combinations. */
export function chartData3D(view, first, second, measure, domains) {
    if(!first || !second || first===second)throw new TypeError('Choose two different dimensions for 3D bars');
    if(!measure)throw new TypeError('Choose a measure for 3D bars');
    const dimensions=domains?domains.dimensions.map(d=>d.values.map(v=>d.kind==='time'?new Date(v).toISOString():String(v))):[[],[]];
    const indexes=dimensions.map(values=>new Map(values.map((v,i)=>[v,i]))),source=[];
    for(const row of view.getRows()) {
        const coordinates=[first,second].map((field,axis)=>{
            const raw=view.value(row,field);
            const value=raw instanceof Date && Number.isFinite(raw.getTime()) ? raw.toISOString()
                : ['string','boolean'].includes(typeof raw) || typeof raw==='number' && Number.isFinite(raw) ? String(raw) : null;
            if(value===null)throw new TypeError('3D dimensions require text, numeric, boolean or date values');
            if(!indexes[axis].has(value)){indexes[axis].set(value,dimensions[axis].length);dimensions[axis].push(value);}
            return indexes[axis].get(value);
        });
        const value=view.value(row,measure);
        if((typeof value!=='number'||!Number.isFinite(value)))throw new TypeError('Selected measure requires finite numeric values');
        source.push([...coordinates,value]);
    }
    return {dimensions,source};
}
