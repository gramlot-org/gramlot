import {Bag} from '@gramlot/gramlot';
import {defineComponent} from '@gramlot/gramlot/components';
import {randomId} from '../random-id.js';
import {Container} from './container.js';
import {chartTypes,chartFixedMeasures} from './chart-types/index.js';

const chartLogic = new WeakMap();
function measureAction(binding) {
    if (!chartLogic.has(binding)) {
        const group = `chart_${randomId()}`;
        class Logic {
            toggleMeasure(node) {
                const path = node.getAttr('selectionPath');
                node.setRelativeData(path, !node.getRelativeData(path));
            }
        }
        binding.logicRegistry.register(Logic,{group,resource:'gramlot:charts'});
        chartLogic.set(binding,`${group}.toggleMeasure`);
    }
    return chartLogic.get(binding);
}

/**
 * The rows of `store`, or null when its address holds no readable collection. Chart fields and the
 * timeline derive configuration from the rows; the chart view, which reads the same address when it
 * draws, shows that error in its notice.
 */
export function chartRows(store) {
    try { return store.getRows(); }
    catch (error) {
        if (error instanceof TypeError) return null;
        throw error;
    }
}

/** Schema comes from the complete store, independently of any grid filter. */
export function chartFields(store) {
    const rows = store.getRows();
    const fields = [...new Set(rows.flatMap(row => store.rowMode === 'attributes'
        ? Object.keys(row.getAttr()) : row.staticValue.getNodes().map(cell => cell.label)))];
    const measures = fields.filter(field => rows.every(row => {
        const value = store.value(row,field);
        return typeof value === 'number' && Number.isFinite(value);
    }));
    const dates=fields.filter(field=>rows.some(row=>store.value(row,field) instanceof Date)&&rows.every(row=>{const value=store.value(row,field);return value==null||(value instanceof Date&&Number.isFinite(value.getTime()));}));
    return {fields,measures,dates};
}

export const ChartFields = defineComponent({
    name:'chartFields',tag:'gramlot-chart-fields',base:Container,sourceContext:true,
    parameters:{timeFieldId:{dtype:'T'},storepath:{dtype:'T'},rowMode:{dtype:'T'},configpath:{dtype:'T'},categoryId:{dtype:'T'},mapMeasureId:{dtype:'T'},mapLabelId:{dtype:'T'},secondCategoryId:{dtype:'T'},geometryId:{dtype:'T'},measureMenuId:{dtype:'T'},measureRoleIds:{dtype:'T'}},
    implementation:Base => class extends Base {
        #context; #store; #release; #signature; #active=false;
        constructor() { super(); const style=this.ownerDocument.createElement('style');style.textContent=':host{display:none}';this.shadowRoot.append(style); }
        setSourceContext(context) { this.#context=context; }
        projectAttributes(attrs,adapt) { const rest=super.projectAttributes(attrs,adapt);if(this.#active)this.#connectStore();return rest; }
        connectedCallback() { this.#active=true;this.#connectStore(); }
        #connectStore() {
            const binding=this.#context.sourceNode.rootBuilder.binding;
            const store=binding.collectionStore(this.#context.attrDatapath('storepath'),this.parameters.rowMode);
            if(store.key===this.#store?.key)return;
            this.#release?.();this.#store=store;this.#signature=undefined;
            this.#release=store.subscribe(()=>this.#sync(store));
            this.#sync(store);
        }
        #sync(store) {
            if(!chartRows(store)?.length)return;
            const {fields,measures,dates}=chartFields(store);
            const signature=JSON.stringify([fields,measures,dates]);
            if(signature===this.#signature)return;
            const node=this.#context.sourceNode;
            const config=node.getRelativeData(this.parameters.configpath);
            const options=config.getItem('seriesOptions');
            const binding=node.rootBuilder.binding;
            const category=binding.nodeIds.get(this.parameters.categoryId);
            const menu=binding.nodeIds.get(this.parameters.measureMenuId);
            const palette=['#5470c6','#ee6666','#3ba272','#fac858','#9a60b4','#73c0de'];
            for(const entry of [...options.getNodes()]) if(!measures.includes(entry.label))options.popNode(entry.label);
            measures.forEach((field,index)=>{
                if(!options.getNode(field))options.setItem(field,new Bag());
                const settings=options.getItem(field);
                for(const [key,value] of Object.entries({axis:'left',color:palette[index%palette.length],caption:field.charAt(0).toUpperCase()+field.slice(1),selected:true})) {
                    if(!settings.getNode(key))settings.setItem(key,value);
                }
            });
            const reconcile = (target,choices,caption=field=>field.charAt(0).toUpperCase()+field.slice(1)) => {
                const existing = new Set();
            for(const child of [...target.value.getNodes()]) {
                const field=child.getAttr('value');
                if(choices.includes(field))existing.add(field);
                else target.value.popNode(child.label);
            }
            choices.forEach(field=>{
                if(!existing.has(field))target.builder.wrapSource(target).option(caption(field),{value:field,node_label:`field_${randomId()}`});
            });
            if(!choices.length)target.builder.wrapSource(target).option('No columns',{value:'',node_label:'empty'});
            };
            reconcile(category,fields);
            if(this.parameters.timeFieldId){
                reconcile(binding.nodeIds.get(this.parameters.timeFieldId),['',...dates],field=>field?field.charAt(0).toUpperCase()+field.slice(1):'Off');
                if(config.getItem('timeField')&&!dates.includes(config.getItem('timeField'))){config.setItem('timeField','');config.setItem('timePlaying',false);}
            }
            reconcile(binding.nodeIds.get(this.parameters.mapMeasureId),measures,field=>options.getItem(field).getItem('caption'));
            reconcile(binding.nodeIds.get(this.parameters.mapLabelId),fields);
            if(!measures.includes(config.getItem('mapValueField')))config.setItem('mapValueField',measures.find(field=>options.getItem(field).getItem('selected')) ?? measures[0] ?? '');
            if(!fields.includes(config.getItem('mapLabelField')))config.setItem('mapLabelField',fields.includes(config.getItem('captionField'))?config.getItem('captionField'):fields[0] ?? '');
            reconcile(binding.nodeIds.get(this.parameters.geometryId),fields);
            // Fixed measure roles: each select offers the numeric columns; an empty or vanished role takes the
            // measure at its position in the column order, so a type change shows a complete assignment.
            for(const id of this.parameters.measureRoleIds.split(','))
                reconcile(binding.nodeIds.get(id),['',...measures],field=>field?options.getItem(field).getItem('caption'):'Choose a column');
            if(!(config.getItem('measureRoles') instanceof Bag))config.setItem('measureRoles',new Bag());
            const roles=config.getItem('measureRoles');
            for(const type of chartTypes)chartFixedMeasures(type).forEach((name,index)=>{
                if(!measures.includes(roles.getItem(name)))roles.setItem(name,measures[index] ?? '');
            });
            reconcile(binding.nodeIds.get(this.parameters.secondCategoryId),fields);
            for(const child of [...menu.value.getNodes()])menu.value.popNode(child.label);
            measures.forEach((field,index)=>{
                const path=`${this.parameters.configpath}.seriesOptions.${field}.selected`;
                menu.builder.wrapSource(menu).menuline({node_label:`measure_${index}`,caption:options.getItem(field).getItem('caption'),
                    checked:`^${path}`,selectionPath:path,action:measureAction(binding)});
            });
            if(!measures.length)menu.builder.wrapSource(menu).menuline({caption:'No measures',disabled:true,node_label:'empty'});
            if(!fields.includes(config.getItem('captionField')))config.setItem('captionField',fields[0] ?? '');
            if(!fields.includes(config.getItem('secondCaptionField')))config.setItem('secondCaptionField',fields.find(field=>field!==config.getItem('captionField')) ?? '');
            if(!fields.includes(config.getItem('geometryField')))config.setItem('geometryField',fields.find(field=>store.getRows().every(row=>Array.isArray(store.value(row,field)))) ?? '');
            this.#signature=signature;
        }
        disconnectedCallback() { this.#active=false;this.#release?.();this.#release=null;this.#store=null;this.#signature=undefined; }
    }
});
