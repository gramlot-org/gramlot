import {chartEngines,chartCapabilities} from './chart-engines/index.js';
import {chartTypes} from './chart-types/index.js';

/** Standard Source sections, reused by the type descriptors. No chart state lives here. */
export function chartControls(config, {configpath,storepath,rowMode,prefix}) {
    const refs={};
    function select(parent,label,key,choices,reference) {
        const id=`${prefix}-${key}`;
        parent.html_label(label,{for:id});
        const attrs={id,value:`^${configpath}.${key}`};
        if(reference) { attrs.nodeId=`${prefix}_${reference}`;refs[reference]=attrs.nodeId; }
        const control=parent.select(attrs);
        for(const [value,caption] of choices) {
            const attrs={value};
            if(key==='timeStep'&&['minute','hour'].includes(value)){
                attrs.disabled=`^${configpath}.timeHasClock:=!{}`;
            } else if(key==='chartType') {
                const engines=Object.entries(chartEngines).filter(([,Adapter])=>chartCapabilities(Adapter).includes(value)).map(([name])=>name);
                attrs.disabled=`^${configpath}.engine:=!${JSON.stringify(engines)}.includes({})`;
                attrs.hidden=attrs.disabled;
            } else if(key==='engine') {
                const types=chartCapabilities(chartEngines[value]);
                attrs.disabled=`^${configpath}.chartType:=!${JSON.stringify(types)}.includes({})`;
                attrs.hidden=attrs.disabled;
            }
            control.option(caption,attrs);
        }
        return control;
    }
    const columns=[['','No columns']];
    select(config,'Engine','engine',Object.entries(chartEngines).map(([id,Adapter])=>[id,Adapter.label]));
    select(config,'Chart type','chartType',chartTypes.map(type=>[type.id,type.label]));
    const animation=config.details({id:`${prefix}-animation`});
    animation.summary('Temporal animation');
    const animationControls=animation.div({display:'grid',gap:'4px'});
    select(animationControls,'Date field','timeField',[['','Off']],'timeFieldId');
    const timing=animationControls.div({display:`^${configpath}.timeField:={} ? 'grid' : 'none'`,gap:'4px'});
    select(timing,'Period','timeStep',[['auto','Automatic'],['minute','Minute'],['hour','Hour'],['day','Day'],['week','Week · Mon–Sun'],['month','Month'],['year','Year']]);
    select(timing,'Empty periods','timeEmpty',[['previous','Keep previous snapshot'],['empty','Show empty']]);
    const resolved=timing.div();
    resolved.span('Current period (UTC): ');resolved.span(`^${configpath}.timeUnit`);
    timing.html_label('Seconds per frame',{for:`${prefix}-time-speed`});
    timing.numberTextBox({id:`${prefix}-time-speed`,value:`^${configpath}.timeSpeed`,min:0.1,max:10});
    config.chartTimeline({storepath,rowMode,configpath,timeField:`^${configpath}.timeField`,timeStep:`^${configpath}.timeStep`,timeIndex:`^${configpath}.timeIndex`});
    const sections={
        category(parent) { select(parent,'Category / territory field','captionField',columns,'categoryId'); },
        geoJSON(parent) {
            parent.chartGeoJSON({value:`^${configpath}.geoJSON`});
            parent.div('Link the category / territory field to GeoJSON properties.name.',{style:'font-size:11px'});
        },
        mapMeasure(parent) {
            select(parent,'Map measure','mapValueField',[['','No measures']],'mapMeasureId');
            select(parent,'Map label field','mapLabelField',columns,'mapLabelId');
            select(parent,'Map labels','mapLabelMode',[['none','None'],['name','Names'],['value','Values'],['nameValue','Names and values']]);
            parent.div('Calculated measures must be supplied as store columns.',{style:'font-size:11px'});
        },
        mapBarScale(parent) {
            select(parent,'Height scale','mapBarScale',[['zero','From zero'],['extent','Data range']]);
            parent.div('Selected measures share one height scale. Data range truncates the baseline; tooltip values are unchanged.',{style:'font-size:11px'});
        },
        secondDimension(parent) { select(parent,'Second dimension','secondCaptionField',columns,'secondCategoryId'); },
        geometry(parent) { select(parent,'Coordinate field','geometryField',columns,'geometryId'); },
        measures(parent) {
            const menu=parent.menu({presentation:'bar',aria_label:'Measures toolbar'})
                .menuline({caption:'Measures',aria_label:'Choose measures'}).menu({nodeId:`${prefix}_measureMenuId`});
            refs.measureMenuId=`${prefix}_measureMenuId`;
            menu.menuline({caption:'No measures',disabled:true});
            const grid=parent.grid({id:`${prefix}-measures`,storepath:`${configpath}.seriesOptions`,rowMode:'values',height:'120px',
                style:'--gramlot-grid-row-height:24px;--gramlot-grid-font-size:12px;--gramlot-grid-cell-padding:2px 5px',
                filter:{value:'^true',columns:['selected'],dtype:'T'}});
            const columns=grid.struct();
            columns.column({field:'caption',name:'Measure',width:'40%'});
            columns.column({field:'color',name:'Color',width:'30%',edit:{tag:'colorpicker'}});
            columns.column({field:'axis',name:'Axis',width:'30%',edit:{tag:'filteringSelect',values:'left:Left,right:Right',validate_select:true}});
        }
    };
    for(const [name,compose] of Object.entries(sections)) {
        const types=chartTypes.filter(type=>type.controls.includes(name)).map(type=>type.id);
        const section=config.div({display:`^${configpath}.chartType:=${JSON.stringify(types)}.includes({}) ? "grid" : "none"`,gap:'4px'});
        compose(section);
    }
    config.chartFields({storepath,rowMode,configpath,...refs});
}
