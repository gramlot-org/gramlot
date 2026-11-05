import {VegaAdapter} from './vega.js';
import {UPlotAdapter} from './uplot.js';
import {EChartsAdapter} from './echarts.js';
import {PlotlyAdapter} from './plotly.js';

export const chartEngines={echarts:EChartsAdapter,plotly:PlotlyAdapter,vega:VegaAdapter,uplot:UPlotAdapter};
export function chartEngine(name) {
    const adapter=chartEngines[name];
    if(!Object.hasOwn(chartEngines,name))throw new TypeError(`Unknown chart engine: ${name}`);
    return adapter;
}
/** Method inventory is the sole supported-type list. */
export function chartCapabilities(Adapter) {
    return Object.getOwnPropertyNames(Adapter.prototype)
        .filter(name=>name.startsWith('render_')&&typeof Adapter.prototype[name]==='function')
        .map(name=>name.slice('render_'.length));
}
export function requireChartCapability(engine,type) {
    const Adapter=chartEngine(engine);
    if(!chartCapabilities(Adapter).includes(type))throw new TypeError(`${Adapter.label} does not support ${type}. Choose another type or engine. Configuration retained.`);
    return Adapter;
}
