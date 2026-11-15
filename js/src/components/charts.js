import {ChartTimeView,timeLabel} from './chart-time.js';
import {ChartTimeline} from './chart-timeline.js';
import {ChartPane} from './chart-pane.js';
import {Bag} from '@gramlot/gramlot';
import {collectionKey} from '../stores/bag-collection-store.js';
import {defineCollection, defineComponent} from '@gramlot/gramlot/components';
import {Container} from './container.js';
import {gridSearch} from './grid-search.js';
import {ChartSampleView} from './chart-sample-view.js';
import {ChartDataView} from './chart-data-view.js';
import {ChartGeoJSON} from './chart-geojson.js';
import {ChartFields} from './chart-fields.js';
import {ChartRenderer} from './chart-renderer.js';
import {Gauge} from './chart-gauge.js';
import {ChartNotice,CHART_NOTICE_STYLE,chartErrorSections,chartTypeSections} from './chart-notice.js';
import {ChartSyntaxError} from './chart-syntax.js';
import {chartTypes} from './chart-types/index.js';

const ChartView = defineComponent({
    name:'chartView', tag:'gramlot-chart-view', base:Container, sourceContext:true,
    parameters:{sampleMin:{dtype:'R',nullable:true,binding:'read'},sampleMax:{dtype:'R',nullable:true,binding:'read'},sampleStep:{dtype:'R',default:1,binding:'read'},sampleStart:{dtype:'R',default:0,binding:'read'},mapLabelMode:{dtype:'T',default:'value',binding:'read'},mapBarScale:{dtype:'T',default:'zero',binding:'read'},selectedTerritory:{dtype:'T',default:'',binding:'twoWay'},configpath:{dtype:'T'},timeEmpty:{dtype:'T',default:'previous',binding:'read'},timeField:{dtype:'T',default:'',binding:'read'},timeValue:{dtype:'X',nullable:true,binding:'read'},timeStep:{dtype:'T',default:'month',binding:'read'},engine:{dtype:'T',default:'echarts',binding:'read'},mapValueField:{dtype:'T',binding:'read'},mapLabelField:{dtype:'T',binding:'read'},geoJSON:{dtype:'X',nullable:true,binding:'read'},geometryField:{dtype:'T',binding:'read'},secondCaptionField:{dtype:'T',binding:'read'},seriesOptions:{dtype:'X',binding:'read'},storepath:{dtype:'T'}, rowMode:{dtype:'T'}, gridId:{dtype:'T'},
        chartType:{dtype:'T',binding:'read'}, captionField:{dtype:'T',binding:'read'}, valueFields:{dtype:'T',nullable:true,binding:'read'}},
    implementation:Base => class extends Base {
        #sampleView; #timeView; #revision=0; #active=false; #notice; #context; #grid; #releaseGrid; #view; #releaseView; #renderer; #resize;
        constructor() {
            super();
            this.control.replaceChildren();
            const style = this.ownerDocument.createElement('style');
            style.textContent = ':host{height:100%;min-height:0}.control-box{height:100%;min-height:0;overflow:hidden}' + CHART_NOTICE_STYLE;
            this.shadowRoot.append(style);
            this.#notice = new ChartNotice(this.ownerDocument);
            this.control = this.ownerDocument.createElement('div');
            this.controlBox.append(this.#notice.element, this.control);
            this.controlBox.style.backgroundColor = 'var(--gramlot-surface,#fff)';
            this.control.style.cssText = 'width:100%;height:100%;min-width:0;background:#fff';
            this.#resize = new this.ownerDocument.defaultView.ResizeObserver(() => this.#renderer?.resize());
        }
        setSourceContext(context) { this.#context = context; }
        // seriesOptions is a `^` parameter of dtype 'X': a change inside the options Bag or a replacement
        // at its address projects the chart again, and the draw reads the options at that address.
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs,adapt);
            if (this.#active) this.#render();
            return rest;
        }
        connectedCallback() {
            this.#active = true;
            this.#render();
            this.#resize.observe(this.control);
        }
        /**
         * Connect the chart to the collection at its storepath and to the grid of gridId, at each draw.
         * Every link error is thrown here, inside the draw, and shows in the chart notice.
         */
        #connect() {
            const {rowMode,gridId,timeField} = this.parameters;
            if (rowMode === 'samples') {
                if (gridId || timeField) throw new TypeError('Sample charts do not use grid filters or temporal playback: remove gridId and timeField, or use rowMode values or attributes');
                if (!this.#sampleView) {
                    this.#release();
                    this.#sampleView = new ChartSampleView();
                    this.#timeView = new ChartTimeView(this.#sampleView);
                    this.#renderer = new ChartRenderer(this.control, this.#timeView, {renderer:'svg', domains:context=>this.#sampleView.domains(context,this.parameters.sampleMin,this.parameters.sampleMax)});
                }
                return;
            }
            const path = this.#context.attrDatapath('storepath');
            // The view follows the store address: a replacement at the address keeps it, a new address replaces it.
            if (this.#sampleView || this.#view && this.#view.view.storeKey !== collectionKey(path,rowMode)) this.#release();
            if (!this.#view) {
                // The view reads the rows at the address when it is created: an address without rows
                // shows in the notice, and the Data change that brings them projects the chart again.
                this.#view = new ChartDataView(this.#context.sourceNode.rootBuilder.binding.collectionStore(path,rowMode));
                this.#timeView = new ChartTimeView(this.#view.view);
                this.#renderer = new ChartRenderer(this.control,this.#timeView,{renderer:'svg',domains:context=>this.#timeView.domains(context),onTerritorySelect:name=>this.#context.writeParameter('selectedTerritory',name)});
                this.#releaseView = this.#view.view.subscribe(() => {this.#timeView.invalidateDomains();this.#render();});
            }
            this.#linkGrid();
        }
        /**
         * gridId names the grid by nodeId, in the page's nodeId map that `#<nodeId>` paths read. The chart
         * and the grid reach the same store by path and rowMode; the chart view follows the filter of the
         * grid view while the grid shows, and keeps the last filter when the grid closes or leaves the page.
         * A gridId that never reached a grid is an error.
         */
        #linkGrid() {
            const gridId = this.parameters.gridId;
            if (!gridId) { this.#unlinkGrid(); this.#view.detach(); return; }
            const target = this.#context.sourceNode.rootBuilder.binding.nodeIds.get(gridId);
            if (!target && this.#grid) { this.#view.detach(); return; }
            if (!target) throw new TypeError(`gridId '${gridId}': the page has no node with this nodeId`);
            if (target.nodeTag !== 'grid') throw new TypeError(`gridId '${gridId}': the node is a ${target.nodeTag}, not a grid`);
            const gridKey = collectionKey(target.absDatapath(target.getAttr('storepath')), target.getAttr('rowMode'));
            if (gridKey !== this.#view.view.storeKey) {
                throw new TypeError(`gridId '${gridId}': chart and grid must use the same storepath and rowMode; the grid reads ${gridKey}, the chart ${this.#view.view.storeKey}`);
            }
            const search = gridSearch(target);
            if (search !== this.#grid) {
                this.#unlinkGrid();
                this.#grid = search;
                this.#releaseGrid = search.subscribe(() => this.#render());
            }
            const gridView = search.view;
            if (!gridView) this.#view.detach();
            // The grid view reaches the new store when the grid draws; its notice draws the chart again.
            else if (gridView.storeKey === this.#view.view.storeKey) this.#view.follow(gridView);
        }
        #unlinkGrid() { this.#releaseGrid?.(); this.#releaseGrid = this.#grid = null; }
        /** Release the view and the engine of the current store, as a new store or the samples mode require. */
        #release() {
            this.#releaseView?.(); this.#view?.dispose(); this.#renderer?.dispose();
            this.#releaseView = this.#view = this.#renderer = this.#timeView = this.#sampleView = null;
        }
        async #render() {
            const {engine,chartType:typeId,captionField,valueFields,secondCaptionField,geometryField,geoJSON,mapValueField,mapLabelField,mapLabelMode,mapBarScale} = this.parameters;
            const revision=++this.#revision;
            try {
                this.#connect();
                this.#renderer.invalidate();
                // The samples are read at the store address when the chart draws: a value that is not
                // an array of numbers shows in the notice, as a store address without rows.
                if (this.#sampleView) this.#sampleView.bind(this.#context.getStaticData(this.#context.attrDatapath('storepath')) ?? [],
                    this.parameters.sampleStep, this.parameters.sampleStart, this.parameters.captionField, this.parameters.valueFields);
                this.#timeView.setPeriod(this.parameters.timeField,this.parameters.timeValue,this.parameters.timeStep,this.parameters.timeEmpty);
                const rows=this.#timeView.getRows(),snapshot=this.#timeView.snapshotDate;
                if(this.parameters.configpath){
                    const node=this.#context.sourceNode,path=`${this.parameters.configpath}.timeSnapshotLabel`;
                    const label=snapshot&&snapshot.getTime()!==this.parameters.timeValue.getTime()?`Showing: ${timeLabel(snapshot,this.parameters.timeStep)}`:'';
                    if(node.getRelativeData(path)!==label)node.setRelativeData(path,label);
                }
                if (!rows.length && !(this.parameters.timeField && this.#view.view.getRows().some(row=>this.#view.view.value(row,this.parameters.timeField)!=null))) {
                    this.control.hidden = true;
                    this.#notice.info('No data to display','No data to display',this.#emptySections(typeId));
                    return;
                }
                await this.#renderer.prepare(engine,typeId);
                if(revision!==this.#revision || !this.#renderer)return;
                this.control.hidden = false;
                const structure=new Bag({engine,chartType:typeId,captionField,valueFields,secondCaptionField,geometryField,mapValueField,mapLabelField,mapLabelMode,mapBarScale});
                structure.setItem('geoJSON',geoJSON);
                // The final read: the renderer reads seriesOptions at its address where it hands the values to the engine.
                await this.#renderer.update(structure, {data:this.#context.sourceNode.data, path:this.#context.attrDatapath('seriesOptions')});
                if(revision!==this.#revision || !this.#renderer)return;
                this.#notice.hide();
                this.#renderer.resize();
            }
            catch (error) {
                if(revision!==this.#revision)return;
                this.#showError(error);
            }
        }
        #showError(error) {
            this.control.hidden = true;
            const type=chartTypes.find(item=>item.id===this.parameters.chartType) ?? null;
            const title=error instanceof ChartSyntaxError ? `${type.label}: the configuration does not match the chart type` : `${type?.label ?? 'Chart'}: the chart cannot be drawn`;
            this.#notice.error(error.message,title,chartErrorSections(error,type));
        }
        /** Why a chart has no rows to draw, from its own parameters. */
        #emptySections(typeId) {
            const {storepath,rowMode,gridId,timeField}=this.parameters;
            const reasons=[rowMode==='samples' ? 'The chart reads its samples from the bound array, which is empty.'
                : `The chart reads its rows from storepath ${storepath} (rowMode ${rowMode}), which has no rows.`];
            if(gridId)reasons.push(`It shows only the rows that pass the filter of grid ${gridId}: the filter may hide every row.`);
            if(timeField)reasons.push(`Temporal animation is on: no row has a value in ${timeField}, its date field.`);
            reasons.push('Add rows to the store, or clear the filter, to draw the chart.');
            const type=chartTypes.find(item=>item.id===typeId);
            return [{title:'Why the chart is empty',paragraphs:reasons},...(type?chartTypeSections(type):[])];
        }
        disconnectedCallback() {
            this.#active = false;
            this.#revision++;
            this.#resize.disconnect(); this.#unlinkGrid(); this.#release();
        }
    }
});
/**
 * One element per chart type, generated from its syntax: `chartCandlestick(captionField, open, high, low, close)`.
 * It is chartView with a fixed chartType; a fixed measure role is its own attribute, a list of measures is `measures`.
 * The roles the syntax requires are required attributes, so the Builders reject the element without them.
 */
function chartTypeElement(type) {
    const name=`chart${type.id[0].toUpperCase()}${type.id.slice(1)}`;
    const tag=`gramlot-chart-${type.id.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase()}`;
    const parameters=structuredClone(ChartView.parameters);
    delete parameters.chartType; delete parameters.valueFields;
    const measures=type.syntax.filter(role=>role.parameter==='valueFields');
    for(const role of type.syntax) {
        const spec=role.parameter==='valueFields' ? {dtype:'T',binding:'read'} : parameters[role.parameter];
        delete spec.default; delete spec.nullable;
        if(role.required)spec.required=true;
        parameters[role.parameter==='valueFields'?role.name:role.parameter]=spec;
    }
    return defineComponent({name,tag,base:ChartView.base,sourceContext:true,parameters,
        doc:`${type.doc} chartView with chartType '${type.id}'.`,
        implementation:Base=>ChartView.implementation(class extends Base {
            projectAttributes(attrs,adapt) {
                const rest=super.projectAttributes(attrs,adapt);
                const values=measures.map(role=>this.parameters[role.name]).filter(Boolean);
                this.parameters={...this.parameters,chartType:type.id,valueFields:values.length?values.join(','):null};
                return rest;
            }
        })});
}
const chartTypeElements=chartTypes.map(chartTypeElement);

export default defineCollection({name:'charts',assets:{echartsGlLicense:new URL('./licenses/echarts-gl.txt',import.meta.url),clayglLicense:new URL('./licenses/claygl.txt',import.meta.url),plotlyLicense:new URL('./licenses/plotly.txt',import.meta.url),vegaLicense:new URL('./licenses/vega.txt',import.meta.url),uplotLicense:new URL('./licenses/uplot.txt',import.meta.url)},components:[ChartPane,ChartView,ChartFields,ChartGeoJSON,ChartTimeline,Gauge,...chartTypeElements]});
