import {isDecimal} from '@genrojs/tytx';

/** Formatting projection only; collection membership and ordering belong to the store. */
export class GridRows {
    constructor(store, format) {
        this.store = store;
        this.format = format;
    }
    read(columns, nodes = this.store.getRows()) {
        return nodes.map(node => ({node, cells:columns.map(column =>
            cellText(this.store.value(node, column.field), column, this.format))}));
    }
}

function cellText(value, column, format) {
    if (value == null) return '';
    const {dtype, format: pattern} = column;
    if (dtype === 'T' && typeof value !== 'string' || dtype === 'B' && typeof value !== 'boolean') throw new TypeError(`grid ${column.field} does not match ${dtype}`);
    if (typeof value === 'string' || typeof value === 'boolean') {
        if (dtype && !['T', 'B'].includes(dtype) || pattern != null) throw new TypeError(`grid ${column.field} requires a typed numeric or temporal value`);
        return String(value);
    }
    if (value instanceof Date || pattern != null) return format(value, {dtype, pattern: pattern ?? 'short'});
    if (dtype && !['L', 'R', 'N'].includes(dtype)) throw new TypeError(`grid ${column.field} does not match ${dtype}`);
    if (dtype === 'L' && !Number.isInteger(value)) throw new TypeError('grid L requires an integer');
    if (typeof value === 'number' && Number.isFinite(value) || isDecimal(value) && value.isFinite()) return String(value);
    throw new TypeError(`grid ${column.field} requires a scalar value`);
}
