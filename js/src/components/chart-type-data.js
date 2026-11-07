/** Cell and caption reading shared by the funnel, radar, parallel, heatmap, sankey, candlestick and boxplot builders. */

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
