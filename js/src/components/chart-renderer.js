import {Bag} from '@gramlot/gramlot';
import {chartType} from './chart-types/index.js';
import {requireChartCapability} from './chart-engines/index.js';

/** Engine-independent context. Reading it never rewrites either Data Bag. */
export function chartContext(view,structure,seriesOptions) {
        if (!(seriesOptions instanceof Bag)) throw new TypeError('seriesOptions requires a Bag');
        const type = chartType(structure.getItem('chartType'));
        const category = structure.getItem('captionField');
        const selection = structure.getItem('valueFields');
        if (selection !== null && typeof selection !== 'string') throw new TypeError('valueFields requires comma-separated codes or null');
        let fields = selection ? selection.split(',') : [];
        if (fields.some(field => !field) || new Set(fields).size !== fields.length) throw new TypeError('valueFields requires distinct nonempty fields');
        if (typeof category !== 'string' || !category) {
            throw new TypeError('Chart requires captionField');
        }
        const measures = type.syntax.filter(role => role.parameter === 'valueFields');
        if (measures.length && measures.every(role => role.count === 1)) fields = fields.slice(0,measures.length);
        const settings = fields.map(field => {
            const options = seriesOptions.getItem(field);
            if (!(options instanceof Bag)) throw new TypeError(`Missing seriesOptions for ${field}`);
            const axis = options.getItem('axis'), color = options.getItem('color');
            if (!['left','right'].includes(axis) || typeof color !== 'string' || !/^#[0-9a-f]{6}$/i.test(color)) {
                throw new TypeError('Series requires left/right axis and a six-digit hex color');
            }
            return {axis,color};
        });
    return {view,category,structure,fields,settings,seriesOptions,type};
}

/** Own an engine instance; adapters own rendering and engine-specific resources. */
export class ChartRenderer {
    #element; #view; #options; #adapter; #engine; #host; #revision=0;
    constructor(element,view,options={}) { this.#element=element;this.#view=view;this.#options=options; }
    async prepare(engine,type) { await requireChartCapability(engine,type).load(type); }
    invalidate() { this.#revision++; }
    update(structure,seriesOptions) {
        const engine=structure.getItem('engine') ?? 'echarts';
        const context=chartContext(this.#view,structure,seriesOptions);
        context.domains=this.#options.domains ? this.#options.domains(context) : null;
        const Adapter=requireChartCapability(engine,context.type.id);
        const revision=++this.#revision;
        if(engine!==this.#engine) {
            this.#adapter?.dispose();this.#host?.remove();
            this.#host=null;
            if(this.#element) {
                this.#host=this.#element.ownerDocument.createElement('div');
                this.#host.style.cssText='width:100%;height:100%;position:relative';
                this.#element.append(this.#host);
            }
            this.#adapter=new Adapter(this.#host,this.#options);this.#engine=engine;
        }
        const figure=this.#adapter.validate(context);
        return this.#adapter.update(context,figure,()=>revision===this.#revision);
    }
    svg() { return this.#adapter.svg(); }
    resize() { this.#adapter?.resize(); }
    dispose() { this.invalidate();this.#adapter?.dispose();this.#adapter=null;this.#engine=null;this.#host?.remove();this.#host=null; }
}
