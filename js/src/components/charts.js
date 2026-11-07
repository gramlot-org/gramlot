import {ChartTimeView,timeLabel} from './chart-time.js';
import {ChartTimeline} from './chart-timeline.js';
import {ChartPane} from './chart-pane.js';
import {Bag} from '@gramlot/gramlot';
import {defineCollection, defineComponent} from '@gramlot/gramlot/components';
import {Container} from './container.js';
import {gridSearch} from './grid-search.js';
import {ChartSampleView} from './chart-sample-view.js';
import {ChartDataView} from './chart-data-view.js';
import {ChartGeoJSON} from './chart-geojson.js';
import {ChartFields} from './chart-fields.js';
import {ChartRenderer} from './chart-renderer.js';
import {Gauge} from './chart-gauge.js';

const ChartView = defineComponent({
    name:'chartView', tag:'gramlot-chart-view', base:Container, sourceContext:true, bagStore:true,
    parameters:{sampleMin:{dtype:'R',nullable:true,binding:'read'},sampleMax:{dtype:'R',nullable:true,binding:'read'},sampleStep:{dtype:'R',default:1,binding:'read'},sampleStart:{dtype:'R',default:0,binding:'read'},mapLabelMode:{dtype:'T',default:'value',binding:'read'},mapBarScale:{dtype:'T',default:'zero',binding:'read'},selectedTerritory:{dtype:'T',default:'',binding:'twoWay'},configpath:{dtype:'T'},timeEmpty:{dtype:'T',default:'previous',binding:'read'},timeField:{dtype:'T',default:'',binding:'read'},timeValue:{dtype:'X',nullable:true,binding:'read'},timeStep:{dtype:'T',default:'month',binding:'read'},engine:{dtype:'T',default:'echarts',binding:'read'},mapValueField:{dtype:'T',binding:'read'},mapLabelField:{dtype:'T',binding:'read'},geoJSON:{dtype:'X',nullable:true,binding:'read'},geometryField:{dtype:'T',binding:'read'},secondCaptionField:{dtype:'T',binding:'read'},seriesOptions:{dtype:'X',binding:'read'},storepath:{dtype:'T'}, rowMode:{dtype:'T'}, gridId:{dtype:'T'},
        chartType:{dtype:'T',binding:'read'}, captionField:{dtype:'T',binding:'read'}, valueFields:{dtype:'T',nullable:true,binding:'read'}},
    implementation:Base => class extends Base {
        #sampleView; #timeView; #revision=0; #active=false; #message; #context; #store; #grid; #releaseGrid; #view; #releaseView; #renderer; #resize; #options; #optionsSubscription = Symbol('chart-options');
        constructor() {
            super();
            this.control.replaceChildren();
            const style = this.ownerDocument.createElement('style');
            style.textContent = ':host{height:100%;min-height:0}.control-box{height:100%;min-height:0;overflow:hidden}';
            this.shadowRoot.append(style);
            this.#message = this.ownerDocument.createElement('div');
            this.#message.setAttribute('role','alert'); this.#message.hidden = true;
            this.#message.style.cssText = 'padding:20px;white-space:normal';
            this.control = this.ownerDocument.createElement('div');
            this.controlBox.append(this.#message, this.control);
            this.controlBox.style.backgroundColor = '#fff';
            this.#message.style.color = '#333';
            this.control.style.cssText = 'width:100%;height:100%;min-width:0;background:#fff';
            this.#resize = new this.ownerDocument.defaultView.ResizeObserver(() => this.#renderer?.resize());
        }
        setSourceContext(context) { this.#context = context; }
        setStoreBag(bag) {
            if (bag != null && !(bag instanceof Bag) && !Array.isArray(bag)) throw new TypeError('Chart requires a Data Bag or sample array');
            this.#store = bag;
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs,adapt);
            this.#bindOptions();
            if (this.#active) { this.#connectStore(); this.#render(); }
            return rest;
        }
        #bindOptions() {
            const options = this.parameters.seriesOptions;
            if (!(options instanceof Bag)) throw new TypeError('seriesOptions requires a Bag');
            if (options === this.#options) return;
            this.#options?.unsubscribe(this.#optionsSubscription,{any:true});
            this.#options = options;
            options.subscribe(this.#optionsSubscription,{any:() => this.#render()});
        }
        connectedCallback() {
            this.#active = true;
            this.#bindOptions();
            const binding = this.#context.sourceNode.rootBuilder.binding;
            if (this.parameters.gridId) {
                const target = binding.nodeIds.get(this.parameters.gridId);
                if (!target || target.nodeTag !== 'grid') throw new TypeError('gridId requires an existing grid nodeId');
                if (target.absDatapath(target.getAttr('storepath')) !== this.#context.sourceNode.absDatapath(this.parameters.storepath)) {
                    throw new TypeError('Chart and grid must use the same storepath');
                }
                this.#grid = gridSearch(target);
                this.#releaseGrid = this.#grid.subscribe(() => this.#syncGrid());
            }
            this.#connectStore();
            this.#render();
            this.#resize.observe(this.control);
        }
        #connectStore() {
            if (this.parameters.rowMode === 'samples') {
                if (this.parameters.gridId || this.parameters.timeField) throw new TypeError('Sample charts do not use grid filters or temporal playback');
                if (!this.#sampleView) {
                    this.#releaseView?.(); this.#releaseView = null;
                    this.#view?.dispose(); this.#view = null;
                    this.#renderer?.dispose(); this.#renderer = null;
                    this.#sampleView = new ChartSampleView();
                }
                this.#sampleView.bind(this.#store ?? [], this.parameters.sampleStep, this.parameters.sampleStart,
                    this.parameters.captionField, this.parameters.valueFields);
                if (!this.#renderer) {
                    this.#timeView = new ChartTimeView(this.#sampleView);
                    this.#renderer = new ChartRenderer(this.control, this.#timeView, {renderer:'svg', domains:context=>this.#sampleView.domains(context,this.parameters.sampleMin,this.parameters.sampleMax)});
                }
                return;
            }
            if (this.#sampleView) {
                this.#renderer.dispose(); this.#renderer = null; this.#sampleView = null;
            }
            const store = this.#context.sourceNode.rootBuilder.binding.collectionStore(this.#store,this.parameters.rowMode);
            if (!this.#view) {
                this.#view = new ChartDataView(store);
                this.#timeView = new ChartTimeView(this.#view.view);
                this.#renderer = new ChartRenderer(this.control,this.#timeView,{renderer:'svg',domains:context=>this.#timeView.domains(context),onTerritorySelect:name=>this.#context.writeParameter('selectedTerritory',name)});
                this.#releaseView = this.#view.view.subscribe(() => {this.#timeView.invalidateDomains();this.#render();});
            } else if (this.#view.view.bag !== this.#store) this.#view.bindStore(store);
            if (this.#grid) this.#syncGrid();
        }
        #syncGrid() {
            const gridView = this.#grid.view;
            if (!gridView) { this.#view?.detach(); return; }
            // Grid and chart receive the same Data replacement independently.
            // Follow only once both consumers refer to that replacement Bag.
            if (!this.#view || gridView.bag !== this.#store) return;
            this.#view.follow(gridView);
            this.#render();
        }
        async #render() {
            if (!this.#renderer) return;
            const {engine,chartType:typeId,captionField,valueFields,secondCaptionField,geometryField,geoJSON,mapValueField,mapLabelField,mapLabelMode,mapBarScale} = this.parameters;
            const revision=++this.#revision;
            this.#renderer.invalidate();
            try {
                this.#timeView.setPeriod(this.parameters.timeField,this.parameters.timeValue,this.parameters.timeStep,this.parameters.timeEmpty);
                const rows=this.#timeView.getRows(),snapshot=this.#timeView.snapshotDate;
                if(this.parameters.configpath){
                    const node=this.#context.sourceNode,path=`${this.parameters.configpath}.timeSnapshotLabel`;
                    const label=snapshot&&snapshot.getTime()!==this.parameters.timeValue.getTime()?`Showing: ${timeLabel(snapshot,this.parameters.timeStep)}`:'';
                    if(node.getRelativeData(path)!==label)node.setRelativeData(path,label);
                }
                if (!rows.length && !(this.parameters.timeField && this.#view.view.getRows().some(row=>this.#view.view.value(row,this.parameters.timeField)!=null))) {
                    this.control.hidden = true;
                    this.#message.setAttribute('role','status');
                    this.#message.textContent = 'No data to display'; this.#message.hidden = false;
                    return;
                }
                await this.#renderer.prepare(engine,typeId);
                if(revision!==this.#revision || !this.#renderer)return;
                this.control.hidden = false;
                const structure=new Bag({engine,chartType:typeId,captionField,valueFields,secondCaptionField,geometryField,mapValueField,mapLabelField,mapLabelMode,mapBarScale});
                structure.setItem('geoJSON',geoJSON);
                await this.#renderer.update(structure, this.#options);
                if(revision!==this.#revision || !this.#renderer)return;
                this.#message.setAttribute('role','alert'); this.#message.hidden = true; this.#message.textContent = '';
                this.#renderer.resize();
            }
            catch (error) { if(revision!==this.#revision || !this.#renderer)return; this.control.hidden = true; this.#message.setAttribute('role','alert'); this.#message.textContent = error.message; this.#message.hidden = false; }
        }
        disconnectedCallback() {
            this.#active = false;
            this.#revision++;
            this.#options?.unsubscribe(this.#optionsSubscription,{any:true}); this.#options = null;
            this.#resize.disconnect(); this.#releaseGrid?.(); this.#releaseView?.();
            this.#view?.dispose(); this.#renderer?.dispose();
            this.#sampleView = null;
            this.#grid = this.#view = this.#renderer = this.#releaseGrid = this.#releaseView = null;
        }
    }
});
export default defineCollection({name:'charts',assets:{echartsGlLicense:new URL('./licenses/echarts-gl.txt',import.meta.url),clayglLicense:new URL('./licenses/claygl.txt',import.meta.url),plotlyLicense:new URL('./licenses/plotly.txt',import.meta.url),vegaLicense:new URL('./licenses/vega.txt',import.meta.url),uplotLicense:new URL('./licenses/uplot.txt',import.meta.url)},components:[ChartPane,ChartView,ChartFields,ChartGeoJSON,ChartTimeline,Gauge]});
