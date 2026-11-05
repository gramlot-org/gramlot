import {isDecimal, toTytx, fromTytx} from '@genrojs/tytx';

/** Typed identities: captions never determine membership. Blank values share one bucket. */
export function columnValue(value) {
    if (value == null || value === '') return null;
    if (typeof value === 'string' || typeof value === 'boolean' ||
        typeof value === 'number' && Number.isFinite(value) ||
        value instanceof Date && Number.isFinite(value.getTime()) ||
        isDecimal(value) && value.isFinite()) return value;
    throw new TypeError('Column filters require loaded scalar values');
}
export function columnValueKey(value) { return toTytx(columnValue(value)); }
export function columnSelection(values) {
    if (!Array.isArray(values)) throw new TypeError('Column selection requires an array or null');
    return Object.freeze([...new Map(values.map(value => {
        const key = columnValueKey(value);
        return [key, fromTytx(key)];
    })).values()]);
}

/** Civil bounds; datetime values use the same day convention as their display. */
export function columnDateRange(range) {
    if (range === null) return null;
    const {from, to, dtype, timeZone} = range;
    if (!['D','DH','DHZ'].includes(dtype)) throw new TypeError('Date range requires a date column');
    for (const value of [from,to]) {
        if (value !== null && (!(value instanceof Date) || !Number.isFinite(value.getTime()) ||
            value.getUTCHours() || value.getUTCMinutes() || value.getUTCSeconds() || value.getUTCMilliseconds())) {
            throw new TypeError('Date bounds require civil dates');
        }
    }
    if (from && to && from > to) throw new RangeError('From must not be after To.');
    if (dtype === 'DHZ' && !timeZone) throw new TypeError('DHZ requires a timeZone');
    return from || to ? Object.freeze({from:from?.toISOString().slice(0,10) ?? null,
        to:to?.toISOString().slice(0,10) ?? null,dtype,timeZone}) : null;
}

export function columnDateMatches(value, range) {
    if (!range) return true;
    if (value == null || value === '') return false;
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) throw new TypeError('Date range requires date values');
    let day;
    if (range.dtype === 'DHZ') {
        const parts = new Intl.DateTimeFormat('en', {timeZone:range.timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(value);
        const part = type => parts.find(item=>item.type===type).value;
        day = `${part('year')}-${part('month')}-${part('day')}`;
    } else day = value.toISOString().slice(0,10);
    return (!range.from || day >= range.from) && (!range.to || day <= range.to);
}
