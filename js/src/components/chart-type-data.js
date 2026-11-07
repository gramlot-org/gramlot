import {Bag} from '@gramlot/gramlot';

/** Cell and caption reading shared by the funnel, radar, parallel, heatmap, sankey, candlestick, boxplot, treemap and sunburst builders. */

/** A missing measure is no value; any other non-number is an error. Zero stays zero. */
export function chartCell(view,row,field) {
    const value=view.value(row,field);
    if(value==null)return null;
    if(typeof value!=='number'||!Number.isFinite(value))throw new TypeError(`Measure ${field} requires finite numeric values or empty cells`);
    return value;
}
/** Category text: dates as ISO days, everything else as text. */
export function chartName(value,field) {
    if(value instanceof Date&&Number.isFinite(value.getTime()))return value.toISOString().slice(0,10);
    if(['string','number','boolean'].includes(typeof value)&&!(typeof value==='number'&&!Number.isFinite(value)))return String(value);
    throw new TypeError(`Choose a ${field} column with text, numeric, boolean or date values`);
}
/** Measure caption from seriesOptions, falling back to the field code. */
export function chartCaption(seriesOptions,field) {
    const caption=seriesOptions?.getItem(field)?.getItem('caption');
    return typeof caption==='string'&&caption?caption:field;
}
/** Number from the series options of a measure (for example `max`), or null. */
export function chartSeriesNumber(seriesOptions,field,key) {
    const value=seriesOptions?.getItem(field)?.getItem(key);
    return typeof value==='number'&&Number.isFinite(value)?value:null;
}
/** Text from the series options of a measure (for example a color), or null. */
export function chartSeriesText(seriesOptions,field,key) {
    const value=seriesOptions?.getItem(field)?.getItem(key);
    return typeof value==='string'&&value?value:null;
}

/**
 * Nested Bag read as a tree of `{name,value,children?,itemStyle}` for treemap and sunburst.
 * Needs `rowMode='attributes'`: every node carries the caption and the measure as attributes.
 * The top level is read through the view; deeper levels read the attributes of each BagNode.
 * A node whose value is a Bag is a parent, any other node is a leaf. A parent's value is the sum of its children,
 * so a parent carrying the measure is an error. A null leaf is skipped, a negative leaf is an error,
 * a parent whose leaves are all skipped is skipped. Each top-level node takes one palette color, descendants inherit it.
 */
export function chartHierarchy({view,category,fields},typeLabel,palette) {
    if(view.rowMode!=='attributes')throw new TypeError(`${typeLabel} needs rowMode='attributes': each node carries the caption and the measure as attributes.`);
    if(fields.length!==1)throw new TypeError(`${typeLabel} needs exactly one measure. Select one measure.`);
    const [field]=fields;
    const attributes={value:(node,key)=>node.getAttr(key)};
    const read=(nodes,reader,color)=>nodes.flatMap(node=>{
        const name=chartName(reader.value(node,category),category);
        const children=node.staticValue;
        if(children instanceof Bag) {
            if(node.getAttr(field)!=null)throw new TypeError(`Node ${name} has children and carries ${field}: the value of a parent is the sum of its children. Remove the attribute from ${name}.`);
            const items=read(children.getNodes(),attributes,color);
            if(!items.length)return [];
            return [{name,value:items.reduce((sum,item)=>sum+item.value,0),children:items,itemStyle:{color}}];
        }
        const value=chartCell(reader,node,field);
        if(value===null)return [];
        if(value<0)throw new TypeError(`Node ${name} has a negative ${field}: areas cannot be negative.`);
        return [{name,value,itemStyle:{color}}];
    });
    const top=view.getRows();
    return top.flatMap((node,index)=>read([node],view,palette[index%palette.length]));
}
