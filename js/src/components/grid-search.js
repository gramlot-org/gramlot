/** Source-owned connection: current grid resources, never copied row data. */
export class GridSearch {
    #listeners = new Set();
    view = null;
    #bag;
    columns = [];
    update(view, columns) {
        if (this.view === view && this.#bag === view.bag && this.columns === columns) return;
        this.view = view; this.#bag = view.bag; this.columns = columns;
        for (const listener of this.#listeners) listener();
    }
    subscribe(listener) { this.#listeners.add(listener); return () => this.#listeners.delete(listener); }
}

export function gridSearch(node) {
    if (!Object.hasOwn(node, 'gridSearch')) {
        Object.defineProperty(node, 'gridSearch', {value:new GridSearch(), configurable:true});
    }
    return node.gridSearch;
}

export function searchColumns(searchOn, columns) {
    if (searchOn === true || typeof searchOn === 'string' && searchOn.startsWith('*')) {
        const allowed = searchOn === true ? columns : columns.filter(column => searchOn.slice(1).includes(column.dtype ?? 'T'));
        return allowed.length ? [{field:allowed.map(column => column.field).join('+'), name:'All columns'},
            ...allowed.map(column => ({field:column.field, name:column.name}))] : [];
    }
    if (typeof searchOn !== 'string' || !searchOn.trim()) throw new TypeError('searchOn requires true or a column list');
    return searchOn.split(',').map(item => {
        const parts = item.trim().split(':');
        const field = parts.at(-1), name = parts.length === 2 ? parts[0] : columns.find(column => column.field === field)?.name;
        if (parts.length > 2 || !field || field.split('+').some(key => !columns.some(column => column.field === key))) {
            throw new TypeError(`Unknown searchOn column: ${item}`);
        }
        return {field, name:name ?? field};
    });
}
