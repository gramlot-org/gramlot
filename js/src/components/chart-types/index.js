import bar from './bar.js';
import line from './line.js';
import area from './area.js';
import stackedBar from './stackedBar.js';
import stackedArea from './stackedArea.js';
import horizontalBar from './horizontalBar.js';
import pie from './pie.js';
import donut from './donut.js';
import scatter from './scatter.js';
import bar3D from './bar3D.js';
import line3D from './line3D.js';
import scatter3D from './scatter3D.js';
import surface from './surface.js';
import map from './map.js';
import mapBar3D from './mapBar3D.js';
import map3D from './map3D.js';
import lines3D from './lines3D.js';
import polygons3D from './polygons3D.js';
import funnel from './funnel.js';
import radar from './radar.js';
import parallel from './parallel.js';
import heatmap from './heatmap.js';
import sankey from './sankey.js';
import candlestick from './candlestick.js';
import boxplot from './boxplot.js';
import treemap from './treemap.js';
import sunburst from './sunburst.js';

export const chartTypes = [bar,line,area,stackedBar,stackedArea,horizontalBar,pie,donut,scatter,bar3D,line3D,scatter3D,surface,map,mapBar3D,map3D,lines3D,polygons3D,funnel,radar,parallel,heatmap,sankey,candlestick,boxplot,treemap,sunburst];
const types=new Map(chartTypes.map(type=>[type.id,type]));
export function chartType(id) {
    const type=types.get(id);
    if(!type)throw new TypeError('Choose a supported chart type');
    return type;
}
