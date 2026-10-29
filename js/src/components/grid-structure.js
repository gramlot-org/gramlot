import {Bag} from '@gramlot/gramlot';

const TYPES = new Set(['T', 'B', 'L', 'R', 'N', 'D', 'H', 'DHZ']);
const COLUMN_KEYS = new Set(['tag', 'field', 'name', 'dtype', 'width', 'align', 'format', 'columnset', 'white_space']);
const GROUP_KEYS = new Set(['tag', 'code', 'name', 'background', 'color']);

/** Legacy Data contract: ordered cells and independent columnset definitions. */
export class GridStructure {
    #nodes = new Map();
    constructor(bag) {
        if (!(bag instanceof Bag)) throw new TypeError('grid structpath must resolve to a Bag');
        const view = branch(bag, 'view_0'), info = branch(bag, 'info');
        const cells = branch(view, 'rows_0'), definitions = branch(info, 'columnsets');
        const fields = new Set(), groups = new Map();
        for (const node of definitions.getNodes()) {
            const attrs = node.getAttr();
            requireKeys(attrs, GROUP_KEYS);
            requireIdentity(attrs.code, 'colgroup code');
            if (attrs.tag !== 'columnset' || node.resolver || node.staticValue != null || node.label !== attrs.code) {
                throw new TypeError('grid columnset requires a scalar definition labelled by code');
            }
            if (groups.has(attrs.code)) throw new TypeError(`Duplicate grid colgroup: ${attrs.code}`);
            if (attrs.name != null && typeof attrs.name !== 'string') throw new TypeError('grid group name must be text');
            for (const key of ['background','color']) if (attrs[key] != null && typeof attrs[key] !== 'string') throw new TypeError(`grid ${key} must be text`);
            groups.set(attrs.code, {...attrs, name:attrs.name ?? attrs.code});
        }
        this.columns = [];
        this.groups = [];
        for (const node of cells.getNodes()) {
            const attrs = node.getAttr();
            requireKeys(attrs, COLUMN_KEYS);
            if (attrs.tag !== 'cell' || node.staticValue != null || node.resolver) throw new TypeError('grid cell must be a scalar declaration');
            requireIdentity(attrs.field, 'field');
            if (fields.has(attrs.field)) throw new TypeError(`Duplicate grid field: ${attrs.field}`);
            fields.add(attrs.field); this.#nodes.set(attrs.field, node);
            if (attrs.columnset != null && !groups.has(attrs.columnset)) throw new TypeError(`Unknown grid columnset: ${attrs.columnset}`);
            if (attrs.dtype != null && !TYPES.has(attrs.dtype)) throw new TypeError(`Unsupported grid dtype: ${attrs.dtype}`);
            if (attrs.align != null && !['start', 'center', 'end'].includes(attrs.align)) throw new TypeError('grid align requires start, center or end');
            if (attrs.width != null && (typeof attrs.width !== 'string' || !/^(?:\d+(?:\.\d+)?)(?:px|em|rem|ch|%)$/.test(attrs.width))) {
                throw new TypeError('grid width requires a nonnegative CSS length (px, em, rem, ch or %)');
            }
            if (attrs.white_space != null && !['normal','nowrap','pre-wrap'].includes(attrs.white_space)) throw new TypeError('grid white_space requires normal, nowrap or pre-wrap');
            for (const key of ['name', 'format']) if (attrs[key] != null && typeof attrs[key] !== 'string') throw new TypeError(`grid ${key} must be text`);
            const column = Object.freeze({...attrs, name: attrs.name ?? attrs.field,
                align: attrs.align ?? (['L', 'R', 'N'].includes(attrs.dtype) ? 'end' : 'start')});
            this.columns.push(column);
            const code = attrs.columnset ?? null;
            let run = this.groups.at(-1);
            if (!run || run.code !== code) {
                run = {code, ...(code === null ? {name:null} : groups.get(code)), columns:[]};
                this.groups.push(run);
            }
            run.columns.push(column);
        }
        if (!this.columns.length) throw new TypeError('grid struct requires at least one column');
        for (const group of this.groups) { Object.freeze(group.columns); Object.freeze(group); }
        Object.freeze(this.columns); Object.freeze(this.groups); Object.freeze(this);
    }
    columnNode(field) { return this.#nodes.get(field); }
    moveColumn(field, targetField, after = false) {
        const node = this.#nodes.get(field), target = this.#nodes.get(targetField);
        if (!node || !target || node === target) return;
        const bag = node.parentBag, nodes = bag.getNodes();
        const from = nodes.indexOf(node), targetIndex = nodes.indexOf(target);
        const position = targetIndex + Number(after) - Number(from < targetIndex);
        if (position !== from) bag.move(from, position);
    }
    setColumnWidth(field, width) {
        if (!Number.isFinite(width) || width <= 0) throw new TypeError('grid resized width must be positive pixels');
        this.#nodes.get(field).setAttr({width: `${Math.round(width)}px`});
    }
}

function branch(bag, label) {
    const node = bag.getNode(label);
    if (!node || node.resolver || !(node.staticValue instanceof Bag)) throw new TypeError(`grid struct requires Bag ${label}`);
    return node.staticValue;
}
function requireKeys(attrs, allowed) {
    for (const key of Object.keys(attrs)) if (!allowed.has(key)) throw new TypeError(`Unsupported grid struct attribute: ${key}`);
}
function requireIdentity(value, label) {
    if (typeof value !== 'string' || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) throw new TypeError(`grid ${label} requires a simple field identifier`);
}
