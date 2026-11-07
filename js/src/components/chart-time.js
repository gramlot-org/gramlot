import {getDateType} from '@genrojs/tytx';
import {chartDomains} from './chart-domains.js';
const day=86400000;
const units={minute:60000,hour:3600000,day,week:7*day};
const monday=4*day; // 1970-01-05, first Monday after the epoch.
export function timePeriod(value,step) {
    if(!(value instanceof Date)||!Number.isFinite(value.getTime()))throw new TypeError('Temporal snapshots require Date values');
    if(Object.hasOwn(units,step))return Math.floor((value.getTime()-(step==='week'?monday:0))/units[step]);
    if(step==='month')return value.getUTCFullYear()*12+value.getUTCMonth();
    if(step==='year')return value.getUTCFullYear();
    throw new TypeError('Time step must be minute, hour, day, week, month or year');
}
export function timeDate(period,step) {
    if(Object.hasOwn(units,step))return new Date(period*units[step]+(step==='week'?monday:0));
    const date=new Date(0);
    if(step==='month')date.setUTCFullYear(Math.floor(period/12),period-Math.floor(period/12)*12,1);
    else if(step==='year')date.setUTCFullYear(period,0,1);
    else throw new TypeError('Time step must be minute, hour, day, week, month or year');
    return date;
}
export function timeExtent(view,field,step) {
    let min=Infinity,max=-Infinity;
    for(const row of view.getRows()) {
        const value=view.value(row,field);
        if(value==null)continue;
        const period=timePeriod(value,step);min=Math.min(min,period);max=Math.max(max,period);
    }
    return min===Infinity?null:{min,max};
}
/** Detect available precision using the framework's existing Date classification. */
export function timeProfile(view,field){
    let min=Infinity,max=-Infinity,hasClock=false;
    for(const row of field?view.getRows():[]){
        const value=view.value(row,field);
        if(value==null)continue;
        timePeriod(value,'day');
        min=Math.min(min,value.getTime());max=Math.max(max,value.getTime());
        hasClock ||= getDateType(value)!=='D';
    }
    const steps=hasClock?['minute','hour','day','week','month','year']:['day','week','month','year'];
    const first=min===Infinity?null:new Date(min),last=min===Infinity?null:new Date(max);
    const suggested=first?steps.find(step=>timePeriod(last,step)-timePeriod(first,step)<=36) ?? 'year':'day';
    return {hasClock,steps,suggested,first,last};
}
export function timeLabel(value,step){
    const iso=value.toISOString();
    if(step==='week')return `${iso.slice(0,10)} – ${new Date(value.getTime()+6*day).toISOString().slice(0,10)} UTC`;
    if(step==='hour'||step==='minute')return `${iso.slice(0,16).replace('T',' ')} UTC`;
    return iso.slice(0,step==='year'?4:step==='month'?7:10);
}
/** A temporal projection of the already filtered view; no copied or aggregated rows. */
export class ChartTimeView {
    constructor(view){this.view=view;this.field='';}
    invalidateDomains(){this.domainKey=null;}
    domains(context){
        if(!this.field||context.type.domains===false)return null;
        const key=JSON.stringify([this.field,this.step,context.category,context.fields,context.settings,context.type.id,context.structure.getItem('secondCaptionField'),context.structure.getItem('mapValueField'),context.structure.getItem('mapBarScale')]);
        const geoJSON=context.structure.getItem('geoJSON');
        if(key!==this.domainKey || geoJSON!==this.domainGeoJSON){
            const rows=this.view.getRows().filter(row=>this.value(row,this.field)!=null);
            this.domainValue=chartDomains({getRows:()=>rows,value:(row,field)=>this.value(row,field)},context);
            this.domainKey=key;this.domainGeoJSON=geoJSON;
        }
        return this.domainValue;
    }
    setPeriod(field,value,step,empty='previous'){
        if(!['previous','empty'].includes(empty))throw new TypeError('Empty periods require previous or empty');
        this.field=field;this.date=value;this.step=step;this.empty=empty;
    }
    value(row,field){return this.view.value(row,field);}
    getRows(){
        const rows=this.view.getRows();
        this.snapshotDate=null;
        if(!this.field)return rows;
        if(this.date==null)return [];
        const selected=timePeriod(this.date,this.step);
        let period=this.empty==='empty'?selected:-Infinity;
        const dated=rows.map(row=>{const value=this.value(row,this.field);return {row,period:value==null?null:timePeriod(value,this.step)};});
        if(this.empty==='previous')for(const entry of dated)if(entry.period!==null&&entry.period<=selected)period=Math.max(period,entry.period);
        const snapshot=dated.filter(entry=>entry.period===period).map(entry=>entry.row);
        if(snapshot.length)this.snapshotDate=timeDate(period,this.step);
        return snapshot;
    }
}
