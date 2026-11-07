import {chartCell,chartName,chartCaption,chartSeriesText} from './chart-type-data.js';

/**
 * One candle per row in store order. `valueFields` is read as open, high, low, close; ECharts wants open, close, low, high.
 * A row with an empty value among the four is skipped, never drawn as zero.
 * Colors: `upColor` and `downColor` in the series options of the first measure (open); ECharts defaults otherwise.
 */
export function chartCandlestickOptions({view,category,fields,seriesOptions}) {
    if(fields.length!==4)throw new TypeError('Candlestick needs exactly four measures, selected in the order open, high, low, close.');
    const [open,high,low,close]=fields;
    const names=[],data=[];
    for(const row of view.getRows()) {
        const values=fields.map(field=>chartCell(view,row,field));
        if(values.some(value=>value===null))continue;
        names.push(chartName(view.value(row,category),category));
        data.push([values[0],values[3],values[2],values[1]]);
    }
    const up=chartSeriesText(seriesOptions,open,'upColor'),down=chartSeriesText(seriesOptions,open,'downColor');
    const itemStyle={};
    if(up){itemStyle.color=up;itemStyle.borderColor=up;}
    if(down){itemStyle.color0=down;itemStyle.borderColor0=down;}
    return {backgroundColor:'#ffffff',tooltip:{trigger:'axis',axisPointer:{type:'cross'}},
        grid:{left:60,right:30,top:30,bottom:70},
        xAxis:{type:'category',data:names,name:category,boundaryGap:true},
        yAxis:{type:'value',scale:true},
        dataZoom:[{type:'inside'}],
        series:[{id:open,name:chartCaption(seriesOptions,open),type:'candlestick',data,itemStyle}]};
}
