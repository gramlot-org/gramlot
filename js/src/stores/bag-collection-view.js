import {columnValue, columnValueKey, columnSelection, columnDateRange, columnDateMatches} from './column-filter.js';
import {isDecimal} from '@genrojs/tytx';
import {compileFilter} from './collection-filter.js';
import {containsId, requireId, requireIdSet} from './id-set.js';
import {publishCollection} from './bag-collection-store.js';

/** Source-owned view: original BagNodes, independent indices and criteria. */
export class BagCollectionView {
    #store;
    #release = null;
    #listeners = new Set();
    #indices = new Map();
    #sortedBy = '';
    #filters = new Map();
    #filtered = null;
    constructor(store) { this.bindStore(store); }
    get bag() { return this.#store.bag; }
    get rowMode() { return this.#store.rowMode; }
    get sortedBy() { return this.#sortedBy; }
    get criteria() { return parseSort(this.#sortedBy); }
    get filter() { return this.#filters.get('search')?.definition ?? null; }
    get filterSignature() { return JSON.stringify([...this.#filters].map(([name,{definition}]) => [name,definition])); }
    /** Immutable accepted entries cross runtime/collection bundle boundaries. */
    get filterContributions() {
        return Object.freeze([...this.#filters].map(([name, entry]) =>
            Object.freeze([name, Object.freeze({...entry})])));
    }
    /** Copy immutable accepted criteria into another Source-owned view, never rows. */
    copyFiltersFrom(view) {
        if (this.filterSignature === view.filterSignature) return;
        this.#commit(this.#orderedNodes(),this.#sortedBy,new Map(view.filterContributions));
    }
    get filtered() { return this.#filtered === null ? null : [...this.#filtered]; }
    isFiltered() { return this.#filtered !== null; }
    value(node, field) { return this.#store.value(node, field); }
    subscribe(listener) {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }
    connect() {
        if (this.#release) return;
        this.synchronize();
        this.#release = this.#store.subscribe(change => this.synchronize(change));
    }
    disconnect() { this.#release?.(); this.#release = null; }
    bindStore(store) {
        if (this.#store === store) return;
        const connected = this.#release !== null;
        this.disconnect();
        this.#store = store;
        // Only node identities are retained, never cell values. A replacement Bag
        // keeps this widget's criteria but starts a fresh manual index.
        this.#indices.clear();
        if (connected) this.connect(); else this.synchronize();
    }
    getRows(filtered = true) {
        const nodes = this.#orderedNodes();
        return filtered && this.#filtered !== null ? this.#filtered.map(index => nodes[index]) : nodes;
    }
    #orderedNodes() {
        return this.#store.getRows().toSorted((a,b) => (this.#indices.get(a) ?? Infinity) - (this.#indices.get(b) ?? Infinity));
    }
    synchronize(change = {full:true, rows:[]}) {
        if (!change.full && !this.#sortedBy && !this.#filters.size) {
            publishCollection(this.#listeners,change);
            return;
        }
        this.#commit(this.#sorted(this.#orderedNodes(),this.criteria),this.#sortedBy,this.#filters,change);
    }
    sort(sortedBy) {
        const nodes = this.#sorted(this.#orderedNodes(),parseSort(sortedBy));
        this.#commit(nodes,sortedBy,this.#filters);
    }
    moveRow(node, target, after = false) {
        if (node === target || node.parentBag !== this.bag || target.parentBag !== this.bag) return;
        const nodes = this.getRows(false);
        nodes.splice(nodes.indexOf(node),1);
        nodes.splice(nodes.indexOf(target)+Number(after),0,node);
        this.#commit(nodes,'',this.#filters);
    }
    applyFilter(filter, contribution = 'search') {
        if (!['base','search'].includes(contribution)) throw new TypeError('Unknown collection filter contribution');
        const definition = filter === null ? null : Object.freeze({...filter,columns:Object.freeze([...filter.columns])});
        this.#applyContribution(contribution, definition, compileFilter(definition));
    }
    applySetFilter(sets) {
        const definition = sets === null ? null : Object.freeze(sets.map(({field,value}) => {
            if (typeof field !== 'string' || !field) throw new TypeError('Set filter requires an identity field');
            requireIdSet(value);
            return Object.freeze({field,value});
        }));
        const predicate = definition === null ? null : read => definition.every(({field,value}) =>
            containsId(value,requireId(read(field))));
        this.#applyContribution('sets',definition,predicate);
    }
    columnFilter(field) { return this.#filters.get(`column:${field}`)?.definition.values ?? null; }
    columnRange(field) {
        const range = this.#filters.get(`column:${field}`)?.definition.range;
        return range ? {...range,from:range.from && new Date(range.from+'T00:00:00Z'),to:range.to && new Date(range.to+'T00:00:00Z')} : null;
    }
    applyColumnFilter(field, values, range = this.columnRange(field)) {
        range = columnDateRange(range);
        if (typeof field !== 'string' || !field) throw new TypeError('Column filter requires a field');
        const selected = values === null ? null : columnSelection(values);
        const keys = selected?.map(columnValueKey);
        const definition = selected === null && range === null ? null : Object.freeze({field,values:selected,keys:keys && Object.freeze(keys),range});
        const predicate = definition === null ? null : read => columnDateMatches(read(field),range) && (keys === undefined || keys.includes(columnValueKey(read(field))));
        this.#applyContribution(`column:${field}`,definition,predicate);
    }
    columnFacets(field) {
        const facets = new Map();
        const range = this.#filters.get(`column:${field}`)?.definition.range ?? null;
        const selected = this.columnFilter(field);
        const keys = selected?.map(columnValueKey);
        const predicates = [...this.#filters].filter(([name]) => name !== `column:${field}`)
            .map(([,entry]) => entry.predicate).filter(predicate => predicate !== null);
        for (const node of this.#orderedNodes()) {
            const value = columnValue(this.value(node,field)), key = columnValueKey(value);
            if (!facets.has(key)) facets.set(key,{key,value,count:0,selected:columnDateMatches(value,range) && (keys === undefined || keys.includes(key))});
            if (predicates.every(predicate => predicate(field => this.value(node,field)))) facets.get(key).count++;
        }
        // Selections absent from the current Bag remain visible and removable.
        for (const value of selected ?? []) {
            const key = columnValueKey(value);
            if (!facets.has(key)) facets.set(key,{key,value,count:0,selected:true});
        }
        return [...facets.values()].filter(entry => columnDateMatches(entry.value,range));
    }
    #applyContribution(name, definition, predicate) {
        if (JSON.stringify(this.#filters.get(name)?.definition ?? null) === JSON.stringify(definition)) return;
        const filters = new Map(this.#filters);
        if (definition === null) filters.delete(name);
        else filters.set(name,{definition,predicate});
        this.#commit(this.#orderedNodes(),this.#sortedBy,filters);
    }
    #commit(nodes, sortedBy, filters, change = {full:false, rows:[]}) {
        const predicates = [...filters.values()].map(entry => entry.predicate).filter(predicate => predicate !== null);
        const filtered = predicates.length ? nodes.flatMap((node,index) =>
            predicates.every(predicate => predicate(field => this.value(node,field))) ? [index] : []) : null;
        const full = change.full || sortedBy !== this.#sortedBy || filters !== this.#filters ||
            nodes.length !== this.#indices.size || nodes.some((node,index) => this.#indices.get(node) !== index) ||
            JSON.stringify(filtered) !== JSON.stringify(this.#filtered);
        this.#indices = new Map(nodes.map((node,index) => [node,index]));
        this.#sortedBy = sortedBy; this.#filters = filters; this.#filtered = filtered;
        const visible = filtered === null ? null : new Set(filtered);
        const rows = full ? [] : change.rows.filter(node => this.#indices.has(node) && (visible === null || visible.has(this.#indices.get(node))));
        if (full || rows.length || change.rows.length) publishCollection(this.#listeners,{full,rows});
    }
    #sorted(nodes, criteria) {
        if (!criteria.length) return nodes;
        const keyed = nodes.map(node => ({node,keys:criteria.map(({field}) => this.value(node,field))}));
        for (let index=0; index<criteria.length; index++) {
            const kinds = new Set(keyed.map(row => scalarKind(row.keys[index])).filter(kind => kind !== null));
            if (kinds.size > 1) throw new TypeError(`collection view cannot compare mixed types in ${criteria[index].field}`);
        }
        return keyed.sort((a,b) => {
            for (const [index,{direction}] of criteria.entries()) {
                const result = compare(a.keys[index],b.keys[index]);
                if (result) return direction === 'a' ? result : -result;
            }
            return 0;
        }).map(row => row.node);
    }
}

export function parseSort(sortedBy) {
    if (typeof sortedBy !== 'string') throw new TypeError('collection view sortedBy must be a string');
    if (sortedBy === '') return [];
    const seen = new Set();
    return sortedBy.split(',').map(item => {
        const match = /^([^,:]+):([ad])$/.exec(item);
        if (!match || seen.has(match[1])) throw new TypeError(`Invalid collection view sort criterion: ${item}`);
        seen.add(match[1]);
        return {field:match[1], direction:match[2]};
    });
}
function scalarKind(value) {
    if (value == null) return null;
    if (typeof value === 'number' && Number.isFinite(value) || isDecimal(value) && value.isFinite()) return 'number';
    if (value instanceof Date && Number.isFinite(value.getTime())) return 'date';
    if (typeof value === 'string' || typeof value === 'boolean') return typeof value;
    throw new TypeError('collection view sort requires loaded finite scalar values');
}
function compare(a, b) {
    if (a == null || b == null) return a == null ? (b == null ? 0 : -1) : 1;
    if (isDecimal(a)) return a.comparedTo(b);
    if (isDecimal(b)) return -b.comparedTo(a);
    return a < b ? -1 : a > b ? 1 : 0;
}
