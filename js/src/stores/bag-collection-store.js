import {Bag} from '@genrojs/bag';

/** Shared resident data. Ordering and filtering belong to each consuming view. */
export class BagCollectionStore {
    #listeners = new Set();
    constructor(bag, rowMode) {
        if (!(bag instanceof Bag)) throw new TypeError('collection store requires a Bag');
        if (!['values','attributes'].includes(rowMode)) throw new TypeError('collection store rowMode must explicitly be values or attributes');
        if (!bag.parentNode) throw new TypeError('collection store requires a Bag attached to Data');
        this.bag = bag;
        this.rowMode = rowMode;
    }
    subscribe(listener) {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }
    /** Called by the page's single Data subscription. Each view reconciles independently. */
    receiveData(event, row = null) {
        publishCollection(this.#listeners, {full:row === null, rows:row ? [row] : []});
    }
    getRows() {
        const nodes = this.bag.getNodes();
        for (const node of nodes) {
            if (node.resolver) throw new TypeError('collection store requires loaded rows');
            if (this.rowMode === 'values' && !(node.staticValue instanceof Bag)) {
                throw new TypeError(`collection store row ${node.label} must contain a Bag`);
            }
        }
        return nodes;
    }
    value(node, field) {
        if (node.resolver) throw new TypeError('collection store requires loaded rows');
        if (this.rowMode === 'attributes') return node.getAttr(field);
        const row = node.staticValue;
        if (!(row instanceof Bag)) throw new TypeError(`collection store row ${node.label} must contain a Bag`);
        const cell = row.getNode(field);
        if (cell?.resolver) throw new TypeError('collection store requires loaded cells');
        return cell?.staticValue;
    }
}

/** One invalidation protocol at both collection levels; failures cannot skip siblings. */
export function publishCollection(listeners, change) {
    const errors = [];
    const notice = Object.freeze({full:change.full, rows:Object.freeze([...change.rows])});
    for (const listener of [...listeners]) {
        if (!listeners.has(listener)) continue;
        try { listener(notice); } catch (error) { errors.push(error); }
    }
    if (errors.length) throw new AggregateError(errors, 'Collection notification failed');
}
