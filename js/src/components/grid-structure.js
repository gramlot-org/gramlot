import {Bag} from '@gramlot/gramlot';
import {formulaDefinitions} from './grid-formulas.js';

const TYPES = new Set(['T', 'B', 'L', 'R', 'N', 'D', 'H', 'DHZ']);
const COLUMN_KEYS = new Set(['tag', 'field', 'name', 'title', 'dtype', 'width', 'align', 'format', 'columnset', 'white_space', 'max_height', 'edit', 'check', 'checked', 'checkedField',
    'formula', 'calculated', 'hidden', 'totalize', 'footer_value', 'footer_format']);
const FORMULA_PARAMETER = /^formula_[A-Za-z_$][\w$]*$/;
const GROUP_KEYS = new Set(['tag', 'code', 'name', 'background', 'color']);

/**
 * Legacy Data contract: ordered cells and independent columnset definitions. The model keeps plain
 * values and the cell key (label) of each field, never struct nodes; with its Data address
 * (`data`, the page Data root, and `path`, the absolute struct path) it writes the struct by path.
 */
export class GridStructure {
    #labels = new Map();
    #data;
    #path;
    constructor(bag, {data = null, path = null} = {}) {
        this.#data = data;
        this.#path = path;
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
        const declared = [];
        for (const node of cells.getNodes()) {
            const attrs = node.getAttr();
            requireKeys(attrs, COLUMN_KEYS, FORMULA_PARAMETER);
            if (attrs.tag !== 'cell' || node.staticValue != null || node.resolver) throw new TypeError('grid cell must be a scalar declaration');
            requireIdentity(attrs.field, 'field');
            if (fields.has(attrs.field)) throw new TypeError(`Duplicate grid field: ${attrs.field}`);
            fields.add(attrs.field); this.#labels.set(attrs.field, node.label);
            if (attrs.columnset != null && !groups.has(attrs.columnset)) throw new TypeError(`Unknown grid columnset: ${attrs.columnset}`);
            if (attrs.dtype != null && !TYPES.has(attrs.dtype)) throw new TypeError(`Unsupported grid dtype: ${attrs.dtype}`);
            if (attrs.align != null && !['start', 'center', 'end'].includes(attrs.align)) throw new TypeError('grid align requires start, center or end');
            if (attrs.width != null && (typeof attrs.width !== 'string' || !/^(?:\d+(?:\.\d+)?)(?:px|em|rem|ch|%)$/.test(attrs.width))) {
                throw new TypeError('grid width requires a nonnegative CSS length (px, em, rem, ch or %)');
            }
            if (attrs.max_height != null && (typeof attrs.max_height !== 'string' || !/^(?:\d+(?:\.\d+)?)(?:px|em|rem)$/.test(attrs.max_height))) {
                throw new TypeError('grid max_height requires a nonnegative CSS length (px, em or rem)');
            }
            if (attrs.white_space != null && !['normal','nowrap','pre-wrap'].includes(attrs.white_space)) throw new TypeError('grid white_space requires normal, nowrap or pre-wrap');
            for (const key of ['name', 'title', 'format']) if (attrs[key] != null && typeof attrs[key] !== 'string') throw new TypeError(`grid ${key} must be text`);
            if (attrs.edit != null && typeof attrs.edit !== 'boolean' && (typeof attrs.edit !== 'object' || Array.isArray(attrs.edit))) throw new TypeError('grid edit requires a boolean or editor options');
            if (attrs.check != null || attrs.checked != null || attrs.checkedField != null) {
                if (!['multiple','single'].includes(attrs.check) || typeof attrs.checked !== 'string' ||
                    !attrs.checked.startsWith('^') || attrs.checked.length < 2 || attrs.checked.includes('?')) {
                    throw new TypeError('grid check requires single or multiple and checked=^DataPath');
                }
                requireIdentity(attrs.checkedField, 'checkedField');
                if (attrs.edit) throw new TypeError('external check sets cannot edit row fields');
            }
            requireFormulaAttributes(attrs);
            const column = Object.freeze({...attrs, name: attrs.name ?? attrs.field,
                align: attrs.align ?? (['L', 'R', 'N'].includes(attrs.dtype) ? 'end' : 'start')});
            declared.push(column);
            // A hidden column is not displayed; its formula still calculates.
            if (attrs.hidden) continue;
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
        this.fields = Object.freeze([...fields]);
        this.formulas = formulaDefinitions(declared);
        for (const group of this.groups) { Object.freeze(group.columns); Object.freeze(group); }
        Object.freeze(this.columns); Object.freeze(this.groups); Object.freeze(this);
    }
    /** The cells Bag at the struct address, read at each use. */
    #cells() {
        if (this.#data === null || this.#path === null) throw new TypeError('grid structure without a Data address cannot be read or written');
        const bag = this.#data.getItem(this.#path, null, true);
        if (!(bag instanceof Bag)) throw new TypeError('grid structpath must resolve to a Bag');
        return branch(branch(bag, 'view_0'), 'rows_0');
    }
    /** The width written in the struct for `field`, read at its address. */
    columnWidth(field) { return this.#cells().getNode(this.#labels.get(field))?.getAttr('width'); }
    /** The field of the cell `step` places after (negative: before) the cell of `field`, or null. */
    adjacentField(field, step) {
        const nodes = this.#cells().getNodes();
        const target = nodes[nodes.findIndex(node => node.label === this.#labels.get(field)) + step];
        return target?.getAttr('tag') === 'cell' ? target.getAttr('field') : null;
    }
    moveColumn(field, targetField, after = false) {
        const label = this.#labels.get(field), targetLabel = this.#labels.get(targetField);
        if (label === undefined || targetLabel === undefined || label === targetLabel) return;
        const bag = this.#cells(), labels = bag.keys();
        const from = labels.indexOf(label), targetIndex = labels.indexOf(targetLabel);
        if (from < 0 || targetIndex < 0) return;
        const position = targetIndex + Number(after) - Number(from < targetIndex);
        if (position !== from) bag.move(from, position);
    }
    setColumnWidth(field, width) {
        if (!Number.isFinite(width) || width <= 0) throw new TypeError('grid resized width must be positive pixels');
        this.#cells().getNode(this.#labels.get(field)).setAttr({width: `${Math.round(width)}px`});
    }
}

function branch(bag, label) {
    const node = bag.getNode(label);
    if (!node || node.resolver || !(node.staticValue instanceof Bag)) throw new TypeError(`grid struct requires Bag ${label}`);
    return node.staticValue;
}
function requireKeys(attrs, allowed, pattern = null) {
    for (const key of Object.keys(attrs)) {
        if (!allowed.has(key) && !pattern?.test(key)) throw new TypeError(`Unsupported grid struct attribute: ${key}`);
    }
}
function requireFormulaAttributes(attrs) {
    if (attrs.formula != null && (typeof attrs.formula !== 'string' || !attrs.formula.trim())) throw new TypeError('grid formula must be nonempty text');
    if (attrs.formula == null && (attrs.calculated != null || Object.keys(attrs).some(key => key.startsWith('formula_')))) {
        throw new TypeError(`grid ${attrs.field}: calculated and formula_<name> require a formula`);
    }
    for (const key of ['calculated', 'hidden']) if (attrs[key] != null && typeof attrs[key] !== 'boolean') throw new TypeError(`grid ${key} must be a boolean`);
    if (attrs.totalize != null && typeof attrs.totalize !== 'boolean' && (typeof attrs.totalize !== 'string' || !attrs.totalize)) {
        throw new TypeError('grid totalize requires a boolean or a Data path');
    }
    for (const key of ['footer_value', 'footer_format']) if (attrs[key] != null && typeof attrs[key] !== 'string') throw new TypeError(`grid ${key} must be text`);
}
function requireIdentity(value, label) {
    if (typeof value !== 'string' || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) throw new TypeError(`grid ${label} requires a simple field identifier`);
}
