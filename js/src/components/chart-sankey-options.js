import {chartCell,chartName,chartCaption} from './chart-type-data.js';

/** First cycle in the links as a list of node names ending where it began, or null. */
export function sankeyCycle(links) {
    const next=new Map();
    for(const {source,target} of links) {
        if(!next.has(source))next.set(source,[]);
        next.get(source).push(target);
    }
    const state=new Map(),path=[];
    const visit=node=>{
        state.set(node,1);path.push(node);
        for(const target of next.get(node)??[]) {
            if(state.get(target)===1)return [...path.slice(path.indexOf(target)),target];
            if(!state.has(target)){const found=visit(target);if(found)return found;}
        }
        path.pop();state.set(node,2);
        return null;
    };
    for(const node of next.keys())if(!state.has(node)){const found=visit(node);if(found)return found;}
    return null;
}

/** Links from `captionField` to `secondCaptionField`; nodes are the distinct names found there. */
export function chartSankeyOptions({view,category,structure,fields,seriesOptions}) {
    const target=structure.getItem('secondCaptionField');
    if(typeof target!=='string'||!target||target===category)throw new TypeError('Sankey needs a target column different from the source column. Choose another column.');
    if(fields.length!==1)throw new TypeError('Sankey needs exactly one measure. Select one measure.');
    const [field]=fields;
    const nodes=new Set(),links=[];
    for(const row of view.getRows()) {
        const source=chartName(view.value(row,category),category),to=chartName(view.value(row,target),target);
        const value=chartCell(view,row,field);
        if(value===null)continue;
        if(value<0)throw new TypeError('Sankey requires nonnegative link values.');
        nodes.add(source);nodes.add(to);
        links.push({source,target:to,value});
    }
    const cycle=sankeyCycle(links);
    if(cycle)throw new TypeError(`Sankey links contain a cycle: ${cycle.join(' → ')}. Remove or reverse one link.`);
    return {backgroundColor:'#ffffff',tooltip:{trigger:'item'},
        series:[{id:field,name:chartCaption(seriesOptions,field),type:'sankey',left:20,right:120,top:20,bottom:20,
            emphasis:{focus:'adjacency'},lineStyle:{color:'gradient',curveness:0.5},
            data:[...nodes].map(name=>({name})),links}]};
}
