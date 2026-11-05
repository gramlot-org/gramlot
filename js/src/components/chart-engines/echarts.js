import * as echarts from 'echarts/dist/echarts.js';
import {randomId} from '../../random-id.js';
import {chartType} from '../chart-types/index.js';
import {cartesianOptions} from './echarts-options.js';
import {chartBar3DOptions} from '../chart-bar3d-options.js';
import {chartSpatialOptions} from '../chart-spatial-options.js';
import {chartGeographicOptions,chartPolygonGeoJSON} from '../chart-geographic-options.js';
import {chartMapBar3DOptions} from '../chart-map-bar3d-options.js';
import {chartMapOptions} from '../chart-map-options.js';

let glLoading;
export class EChartsAdapter {
    static label='ECharts';
    static async load(type) {
        if(chartType(type).threeD)await (glLoading ??= import('echarts-gl/dist/echarts-gl.js'));
    }
    #chart; #type; #element; #options; #renderer;
    #mapName=`chart_${randomId()}`; #mapData;
    constructor(element,options={}) {
        this.#element=element;this.#options=options;
        this.#renderer=options.renderer ?? 'canvas';
        this.#chart=echarts.init(element,null,options);this.#bindSelection();
    }
    #bindSelection() {
        this.#chart.on('click',event=>{
            if(this.#type==='mapBar3D' && event.seriesType==='bar3D')this.#options.onTerritorySelect?.(event.name);
            if(this.#type==='map' && event.componentType==='series' && event.seriesType==='map')this.#options.onTerritorySelect?.(event.name);
        });
    }
    validate(context) { return this[`render_${context.type.id}`](context); }
    update(context,option) {
        this.#type=context.type.id;
        const renderer=context.type.threeD?'canvas':(this.#options.renderer ?? 'canvas');
        if(renderer!==this.#renderer) {
            this.#chart.dispose();this.#chart=echarts.init(this.#element,null,{...this.#options,renderer});this.#renderer=renderer;this.#bindSelection();
        }
        this.#chart.setOption(option,{notMerge:true});
    }
    render_bar(context) { return cartesianOptions(context,{seriesType:'bar'}); }
    render_line(context) { return cartesianOptions(context,{seriesType:'line'}); }
    render_area(context) { return cartesianOptions(context,{seriesType:'line',area:true}); }
    render_stackedBar(context) { return cartesianOptions(context,{seriesType:'bar',stacked:true}); }
    render_stackedArea(context) { return cartesianOptions(context,{seriesType:'line',area:true,stacked:true}); }
    render_horizontalBar(context) { return cartesianOptions(context,{seriesType:'bar',horizontal:true}); }
    render_pie(context) { return cartesianOptions(context,{seriesType:'pie',radial:true}); }
    render_donut(context) { return cartesianOptions(context,{seriesType:'pie',radial:true,donut:true}); }
    render_scatter(context) { return cartesianOptions(context,{seriesType:'scatter',scatter:true}); }
    render_bar3D({view,category,structure,fields,settings,domains}) {
        return chartBar3DOptions(view,category,structure.getItem('secondCaptionField'),fields,settings,domains);
    }
    render_line3D(context) { return this.#spatial(context,'line3D'); }
    render_scatter3D(context) { return this.#spatial(context,'scatter3D'); }
    render_surface(context) { return this.#spatial(context,'surface'); }
    #spatial({view,category,structure,fields,settings,domains},type) {
        return chartSpatialOptions(view,type,category,structure.getItem('secondCaptionField'),fields,settings,domains);
    }
    #map(geoJSON) {
        if(geoJSON!==this.#mapData) { echarts.registerMap(this.#mapName,geoJSON);this.#mapData=geoJSON; }
        return this.#mapName;
    }
    render_map({view,category,structure,seriesOptions,domains}) {
        const field=structure.getItem('mapValueField'),geoJSON=structure.getItem('geoJSON');
        const option=chartMapOptions(view,category,field,structure.getItem('mapLabelField'),this.#mapName,geoJSON,seriesOptions.getItem(field)?.getItem('caption'),domains,structure.getItem('mapLabelMode') ?? 'value');
        this.#map(geoJSON);return option;
    }
    render_mapBar3D(context) {
        const geoJSON=context.structure.getItem('geoJSON');
        const option=chartMapBar3DOptions(context,this.#mapName);this.#map(geoJSON);return option;
    }
    render_map3D(context) { return this.#geographic(context,'map3D',context.structure.getItem('geoJSON')); }
    render_lines3D(context) { return this.#geographic(context,'lines3D',context.structure.getItem('geoJSON')); }
    render_polygons3D(context) {
        return this.#geographic(context,'polygons3D',chartPolygonGeoJSON(context.view,context.category,context.structure.getItem('geometryField')));
    }
    #geographic({view,category,structure,fields,settings},type,geoJSON) {
        const option=chartGeographicOptions(view,type,category,structure.getItem('geometryField'),fields,settings,this.#mapName,geoJSON);
        this.#map(geoJSON);return option;
    }
    svg() { return this.#chart.renderToSVGString(); }
    resize() { this.#chart.resize(); }
    dispose() { this.#chart.dispose();if(this.#mapData)echarts.registerMap(this.#mapName,{type:'FeatureCollection',features:[]}); }
}
