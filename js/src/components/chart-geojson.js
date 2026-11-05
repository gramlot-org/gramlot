import {isChartPolygon} from './chart-geometry.js';
import {defineComponent} from '@gramlot/gramlot/components';
import {controlElement} from './bases.js';

export function validateChartGeoJSON(value) {
    if(value?.type!=='FeatureCollection'||!Array.isArray(value.features)||!value.features.length)
        throw new TypeError('Choose a GeoJSON FeatureCollection containing territories.');
    const names=new Set();
    for(const feature of value.features) {
        const name=feature.properties?.name,geometry=feature.geometry;
        if(feature.type!=='Feature'||typeof name!=='string'||!name.trim())
            throw new TypeError('Every territory needs a nonempty properties.name.');
        if(names.has(name))throw new TypeError(`Duplicate territory name: ${name}`);
        names.add(name);
        if(!geometry||!['Polygon','MultiPolygon'].includes(geometry.type))
            throw new TypeError('Territories must use Polygon or MultiPolygon geometry.');
        const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;
        if(!Array.isArray(polygons)||!polygons.length||!polygons.every(isChartPolygon))
            throw new TypeError(`Invalid or unclosed coordinate rings: ${name}`);
    }
    return value;
}

export const ChartGeoJSON=defineComponent({
    name:'chartGeoJSON',tag:'gramlot-chart-geo-json',base:controlElement,sourceContext:true,
    parameters:{value:{dtype:'X',nullable:true,default:null,binding:'twoWay'}},
    implementation:Base=>class extends Base {
        #context; #revision=0;
        constructor() {
            super();
            const doc=this.ownerDocument;
            this.control=doc.createElement('input');this.control.type='file';
            this.control.accept='.geojson,.json,application/geo+json,application/json';
            this.control.setAttribute('aria-label','Load GeoJSON');
            this.control.style.cssText='width:100%;min-width:0;font:inherit';
            this.message=doc.createElement('div');this.message.setAttribute('role','status');
            this.message.style.cssText='font-size:11px;overflow-wrap:anywhere';
            this.controlBox.append(this.control,this.message);
            this.control.addEventListener('change',event=>{event.stopPropagation();this.#load();});
        }
        readControlValue(){return this.parameters.value;}
        writeControlValue(value){this.parameters.value=value;this.#summary();}
        setSourceContext(context){this.#context=context;}
        projectAttributes(attrs,adapt){const rest=super.projectAttributes(attrs,adapt);this.#revision++;this.#summary();return rest;}
        #summary(){const value=this.parameters.value;this.message.textContent=value?`${value.features.length} territories${value.features.length<=3?': '+value.features.map(feature=>feature.properties.name).join(', '):' loaded'}`:'No GeoJSON loaded';}
        async #load(){
            const file=this.control.files[0];if(!file)return;
            const revision=++this.#revision;
            try {
                const value=validateChartGeoJSON(JSON.parse(await file.text()));
                if(revision!==this.#revision||!this.isConnected)return;
                this.control.value='';
                this.#context.writeParameter('value',value);
            } catch(error) {
                if(revision===this.#revision&&this.isConnected)this.message.textContent=`GeoJSON not loaded: ${error.message}`;
            } finally {if(revision===this.#revision)this.control.value='';}
        }
        disconnectedCallback(){this.#revision++;}
    }
});
