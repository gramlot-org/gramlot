import {Bag} from '@genrojs/bag';

/**
 * Shared resident data at one Data address. The store keeps the page's Data root and the
 * absolute `path`, never the collection Bag: rows are read from the root at each access,
 * without running resolvers. Ordering and filtering belong to each consuming view.
 */
export class BagCollectionStore {
    #listeners = new Set();
    #data;
    #path;
    #rowMode;
    constructor(data, path, rowMode) {
        if (!(data instanceof Bag)) throw new TypeError('collection store requires the Data root Bag');
        if (typeof path !== 'string' || !path) throw new TypeError(`collection store requires a Data path: ${path}`);
        if (!['values','attributes'].includes(rowMode)) throw new TypeError('collection store rowMode must explicitly be values or attributes');
        this.#data = data;
        this.#path = path;
        this.#rowMode = rowMode;
    }
    /** The absolute Data path of the collection. */
    get path() { return this.#path; }
    get rowMode() { return this.#rowMode; }
    /** The key of the store among the page's stores: one store per absolute path and rowMode. */
    get key() { return collectionKey(this.#path, this.#rowMode); }
    subscribe(listener) {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }
    /**
     * Called by the page's single Data subscription. Each view reconciles independently.
     * `row` is the row node the event is inside, null for a change of the row list itself;
     * `field` is the label directly under the row on the event path, null when the event
     * targets the row node or inserts/deletes its direct children.
     */
    receiveData(event, row = null, field = null) {
        publishCollection(this.#listeners, {full:row === null, rows:row ? [row] : [], event, field});
    }
    getRows() {
        const bag = this.#data.getItem(this.path, null, true);
        if (!(bag instanceof Bag)) throw new TypeError(`collection store requires a Bag at ${this.path}`);
        const nodes = bag.getNodes();
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

/** The key of the collection store at the absolute Data `path` read in `rowMode`. */
export function collectionKey(path, rowMode) { return `${rowMode}:${path}`; }

/**
 * One invalidation protocol at both collection levels; failures cannot skip siblings.
 * A store notice also carries its Data `event` and changed `field`; a view notice carries null.
 */
export function publishCollection(listeners, change) {
    const errors = [];
    const notice = Object.freeze({full:change.full, rows:Object.freeze([...change.rows]),
        event:change.event ?? null, field:change.field ?? null});
    for (const listener of [...listeners]) {
        if (!listeners.has(listener)) continue;
        try { listener(notice); } catch (error) { errors.push(error); }
    }
    if (errors.length) throw new AggregateError(errors, 'Collection notification failed');
}
