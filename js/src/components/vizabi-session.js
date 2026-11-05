import {randomId} from '../random-id.js';

/** One optional Vizabi instance; the Gramlot Bag owns authored state. */
export class VizabiSession {
    constructor(library, element, view, configuration) {
        this.library=library; this.configuration=configuration; this.element=element;
        const {Vizabi,BubbleChart,mobx}=library;
        if(!Number.isInteger(configuration.getItem('year'))||typeof configuration.getItem('playing')!=='boolean'||!Number.isFinite(configuration.getItem('speed'))||configuration.getItem('speed')<=0)throw new TypeError('Vizabi requires an integer year, Boolean playing and positive speed in milliseconds');
        const keys=['entityField','timeField','xField','yField','sizeField','colorField'];
        const fields=Object.fromEntries(keys.map(key=>[key,configuration.getItem(key)]));
        for(const [key,value] of Object.entries(fields))if(typeof value!=='string'||!value)throw new TypeError(`${key} requires a field name`);
        if(Object.entries(fields).some(([key,value])=>value==='name'&&key!=='entityField'))throw new TypeError('The Vizabi entity catalogue reserves name for the entity display name');
        const rows=view.getRows().map(node=>Object.fromEntries([...new Set(Object.values(fields))].map(field=>[field,view.value(node,field)])));
        const identities=new Set();
        for(const row of rows) {
            if(typeof row[fields.entityField]!=='string'||!Number.isInteger(row[fields.timeField]))throw new TypeError('Vizabi trial requires text entities and integer years');
            const key=JSON.stringify([row[fields.entityField],row[fields.timeField]]);
            if(identities.has(key))throw new TypeError('Vizabi requires one prepared row per entity and year');
            identities.add(key);
            for(const field of [fields.xField,fields.yField,fields.sizeField])if(typeof row[field]!=='number'||!Number.isFinite(row[field]))throw new TypeError(`${field} requires finite numbers`);
            if(row[fields.sizeField]<0)throw new TypeError('Bubble size cannot be negative');
            if(typeof row[fields.colorField]!=='string')throw new TypeError('Bubble color requires a text category');
        }
        // Vizabi's entity catalogue requires its reserved display-name property.
        for(const row of rows)row.name=row[fields.entityField];
        if(!rows.length)throw new TypeError('No data to display');
        this.id=`bubble_${randomId()}`;this.legendId=`legend_${randomId()}`;this.sourceId=`data_${randomId()}`;
        const defaults=JSON.parse(JSON.stringify(BubbleChart.DEFAULT_MODEL).replaceAll('markers.bubble',`markers.${this.id}`).replaceAll('markers.legend',`markers.${this.legendId}`));
        const bubble=defaults.bubble;
        bubble.data={source:this.sourceId,space:[fields.entityField,fields.timeField]};
        for(const [encoding,field] of Object.entries({x:fields.xField,y:fields.yField,size:fields.sizeField,color:fields.colorField,label:fields.entityField}))bubble.encoding[encoding].data={concept:field,constant:null};
        bubble.encoding.label.data={modelType:'entityPropertyDataConfig',concept:'name'};
        bubble.requiredEncodings=['x','y','size','color','label'];
        bubble.encoding.y.modelType='baseType';
        bubble.encoding.y.scale.type='linear';
        bubble.encoding.frame={modelType:'frame',data:{concept:fields.timeField},value:String(configuration.getItem('year')),speed:configuration.getItem('speed'),splash:false,loop:true};
        const models=Vizabi({dataSources:{[this.sourceId]:{values:rows,keyConcepts:[fields.entityField,fields.timeField],dtypes:{[fields.timeField]:'year'}}},markers:{[this.id]:bubble,[this.legendId]:defaults.legend}});
        this.models=models;
        this.frame=models.markers[this.id].encoding.frame;
        this.tool=new BubbleChart({Vizabi,placeholder:element,model:{config:models.config,dataSources:models.dataSources,markers:{bubble:models.markers[this.id],legend:models.markers[this.legendId]}},locale:{id:'en',resolve:{en:library.locale},placeholder:element},layout:{placeholder:element},ui:{buttons:{buttons:[]},dialogs:{dialogs:{sidebar:[],popup:[]}}}});
        this.release=mobx.reaction(()=>{const marker=models.markers[this.id];return [marker.state==='fulfilled'?this.frame.value.getUTCFullYear():null,this.frame.playing,...['x','y','size','color'].map(key=>marker.encoding[key].data.concept)];},([year,playing,x,y,size,color])=>{
            if(!Number.isFinite(year))return;
            this.writing=true;
            try { for(const [key,value] of Object.entries({xField:x,yField:y,sizeField:size,colorField:color}))if(configuration.getItem(key)!==value)configuration.setItem(key,value);if(configuration.getItem('year')!==year)configuration.setItem('year',year);if(configuration.getItem('playing')!==playing)configuration.setItem('playing',playing); }
            finally {this.writing=false;}
        });
        this.ready=mobx.when(()=>models.markers[this.id].state==='fulfilled',()=>this.update());
    }
    update() {

        if(this.writing||this.models.markers[this.id].state!=='fulfilled')return;
        const c=this.configuration,f=this.frame;
        this.library.mobx.runInAction(()=>{
            f.setSpeed(c.getItem('speed'));
            if(f.value?.getUTCFullYear()!==c.getItem('year'))f.setValue(String(c.getItem('year')));
            if(f.playing!==c.getItem('playing'))f.setPlaying(c.getItem('playing'));
        });
    }
    resize() { this.tool.services.layout._resizeHandler(); }
    dispose() {
        this.release();this.ready();this.frame.stopPlaying();this.tool.deconstruct();
        const stores=this.library.Vizabi.stores;
        stores.markers.dispose(this.legendId);stores.markers.dispose(this.id);stores.dataSources.dispose(this.sourceId);
        this.element.replaceChildren();
    }
}
