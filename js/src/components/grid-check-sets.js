import {containsId, requireId, requireIdSet} from '../stores/id-set.js';

function singleId(id) {
    if (typeof id === 'number' && Number.isFinite(id)) return id;
    return requireId(id);
}

/** External membership columns. Data IDs and membership strings are authoritative; DOM checks are projections. */
export class GridCheckSets {
    #registrations = [];
    #connected = false;
    constructor(source, body, columns, rowFor, read, selection, view) {
        this.source = source; this.body = body; this.columns = columns;
        this.rowFor = rowFor; this.read = read; this.selection = selection; this.view = view;
    }
    path(column) { return this.source.absDatapath(column.checked.slice(1)); }
    value(column) {
        const value = this.source.getRelativeData(column.checked.slice(1));
        if (column.check === 'single') return value == null || value === '' ? value : singleId(value);
        return requireIdSet(value);
    }
    id(row, column) {
        const id = this.read(row,column.checkedField);
        if (column.check === 'single') return singleId(id);
        return requireId(id);
    }
    contains(column, value, id) { return column.check === 'single' ? value === id : containsId(value,id); }
    filter() {
        const selected = this.selection();
        const sets = selected === '' ? null : selected.split(',').map(field => {
            const column = this.columns().find(column => column.field === field && column.check === 'multiple');
            if (!column) throw new TypeError(`Unknown external check column: ${field}`);
            return {field:column.checkedField,value:this.value(column)};
        });
        this.view().applySetFilter(sets);
    }
    project(content, row, column) {
        const id = this.id(row,column), value = this.value(column);
        let input = content.querySelector('input.grid-set-check');
        if (!input) {
            input = content.ownerDocument.createElement('input');
            input.className = 'grid-set-check'; content.replaceChildren(input);
        }
        input.type = column.check === 'single' ? 'radio' : 'checkbox';
        if (column.check === 'single') input.name = column.field;
        else input.removeAttribute('name');
        input.setAttribute('aria-label', `${column.title ?? column.name}: ${id}`);
        input.checked = this.contains(column,value,id);
    }
    refresh = () => {
        this.filter();
        for (const input of this.body.querySelectorAll('input.grid-set-check')) {
            const cell = input.closest('td[data-field]');
            const column = this.columns().find(c => c.field === cell.dataset.field);
            const row = this.rowFor(cell.parentElement);
            if (column?.check && row) this.project(input.parentElement,row,column);
        }
    };
    change = event => {
        const input = event.target;
        if (!input.matches('input.grid-set-check')) return;
        const cell = input.closest('td[data-field]');
        const column = this.columns().find(c => c.field === cell.dataset.field);
        const row = this.rowFor(cell.parentElement);
        const id = this.id(row,column), value = this.value(column);
        const present = this.contains(column,value,id);
        if (input.checked === present) return;
        if (column.check === 'single') {
            if (input.checked) this.source.setRelativeData(column.checked.slice(1),id);
            else this.project(input.parentElement,row,column);
            return;
        }
        const next = input.checked ? (value ? value + ',' + id : id)
            : (',' + value + ',').replace(',' + id + ',', ',').slice(1,-1);
        this.source.setRelativeData(column.checked.slice(1),next);
    };
    configure() {
        for (const registration of this.#registrations) registration.close();
        this.#registrations = [];
        if (!this.#connected) return;
        this.filter();
        for (const column of this.columns().filter(column => column.check)) {
            this.#registrations.push(this.source.rootBuilder.binding.router.register({
                path:this.path(column), recipient:{receive:this.refresh}
            }));
        }
    }
    connect() {
        if (this.#connected) return;
        this.#connected = true;
        this.body.addEventListener('change',this.change);
    }
    disconnect() {
        this.body.removeEventListener('change',this.change);
        this.#connected = false;
        this.configure();
    }
}
