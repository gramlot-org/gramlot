/** Literal membership shared by checkbox projections and collection-view predicates. */
export function containsId(value, id) { return (',' + value + ',').includes(',' + id + ','); }
export function requireIdSet(value) {
    if (typeof value !== 'string') throw new TypeError('grid checked must refer to a string (empty string for an empty set)');
    return value;
}
export function requireId(id) {
    if (typeof id !== 'string' || !id || id.includes(',')) throw new TypeError('grid checkedField requires nonempty text IDs without commas');
    return id;
}
