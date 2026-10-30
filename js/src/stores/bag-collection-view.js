import {isDecimal} from '@genrojs/tytx';
import {compileFilter} from './collection-filter.js';
import {publishCollection} from './bag-collection-store.js';

/** Source-owned view: original BagNodes, independent indices and criteria. */
export class BagCollectionView {
    #store;
    #release = null;
    #listeners = new Set();
    #indices = new Map();
    #sortedBy = '';
    #filter = null;
    #predicate = null;
    #filtered = null;
    constructor(store) { this.bindStore(store); }
    get bag() { return this.#store.bag; }
    get rowMode() { return this.#store.rowMode; }
    get sortedBy() { return this.#sortedBy; }
    get criteria() { return parseSort(this.#sortedBy); }
    get filter() { return this.#filter; }
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
        if (!change.full && !this.#sortedBy && !this.#predicate) {
            publishCollection(this.#listeners,change);
            return;
        }
        this.#commit(this.#sorted(this.#orderedNodes(),this.criteria),this.#sortedBy,this.#filter,this.#predicate,change);
    }
    sort(sortedBy) {
        const nodes = this.#sorted(this.#orderedNodes(),parseSort(sortedBy));
        this.#commit(nodes,sortedBy,this.#filter,this.#predicate);
    }
    moveRow(node, target, after = false) {
        if (node === target || node.parentBag !== this.bag || target.parentBag !== this.bag) return;
        const nodes = this.getRows(false);
        nodes.splice(nodes.indexOf(node),1);
        nodes.splice(nodes.indexOf(target)+Number(after),0,node);
        this.#commit(nodes,'',this.#filter,this.#predicate);
    }
    applyFilter(filter) {
        // The accepted definition is immutable Source-owned state. Invalid drafts
        // cannot replace it, the predicate or the visible index.
        const definition = filter === null ? null : Object.freeze({...filter,columns:Object.freeze([...filter.columns])});
        const predicate = compileFilter(definition);
        this.#commit(this.#orderedNodes(),this.#sortedBy,definition,predicate);
    }
    #commit(nodes, sortedBy, filter, predicate, change = {full:false, rows:[]}) {
        const filtered = predicate ? nodes.flatMap((node,index) => predicate(field => this.value(node,field)) ? [index] : []) : null;
        const full = change.full || sortedBy !== this.#sortedBy || JSON.stringify(filter) !== JSON.stringify(this.#filter) ||
            nodes.length !== this.#indices.size || nodes.some((node,index) => this.#indices.get(node) !== index) ||
            JSON.stringify(filtered) !== JSON.stringify(this.#filtered);
        this.#indices = new Map(nodes.map((node,index) => [node,index]));
        this.#sortedBy = sortedBy; this.#filter = filter; this.#predicate = predicate; this.#filtered = filtered;
        const visible = filtered === null ? null : new Set(filtered);
        const rows = full ? [] : change.rows.filter(node => this.#indices.has(node) && (visible === null || visible.has(this.#indices.get(node))));
        if (full || rows.length) publishCollection(this.#listeners,{full,rows});
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
