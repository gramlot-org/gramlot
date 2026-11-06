import {addNumeric, sameValue} from './grid-formulas.js';
import {cellText} from './grid-rows.js';

/**
 * Grid footer row and column totals (intermediate implementation; the final placement of
 * totals, data level or grid, is under review).
 *
 * A `totalize` column sums the field over every resident row of the store, never only the
 * mounted or visible rows, and publishes the total to `.totalize.<field>` relative to the grid
 * Source node, or to the Data path given as `totalize`. Booleans count as 0/1. Totals are
 * published also when the footer row is not displayed, as in legacy.
 * Legacy reference: genro_grid.js footer and totalize.
 */
export class GridFooter {
    #source;
    #format;
    #anchor;
    #frame;
    #viewport;
    #table;
    #row;
    #columns = [];
    #caption = false;
    #errors = new Map();

    /** The footer frame is placed after `anchor` while the footer is displayed. */
    constructor(source, format, anchor) {
        this.#source = source;
        this.#format = format;
        this.#anchor = anchor;
        const document = anchor.ownerDocument;
        this.#frame = document.createElement('div');
        this.#frame.className = 'footer-frame'; this.#frame.setAttribute('part', 'footer');
        this.#viewport = document.createElement('div');
        this.#viewport.className = 'footer-viewport';
        this.#table = document.createElement('table');
        this.#table.setAttribute('role', 'presentation');
        const body = document.createElement('tfoot');
        body.setAttribute('role', 'rowgroup');
        this.#row = document.createElement('tr');
        this.#row.setAttribute('role', 'row');
        body.append(this.#row); this.#table.append(body);
        this.#viewport.append(this.#table); this.#frame.append(this.#viewport);
    }

    get source() { return this.#source; }
    get frame() { return this.#frame; }
    get table() { return this.#table; }
    get viewport() { return this.#viewport; }
    /** The last error of each totalized column, by field name. */
    get errors() { return new Map(this.#errors); }
    /** The displayed cells, by field. */
    cell(field) { return this.#row.querySelector(`td[data-field="${field}"]`); }

    /** `footer` is false, true or a caption; `columns` are the displayed columns. */
    configure(footer, columns, rowHeaders) {
        this.#caption = footer;
        this.#columns = columns;
        if (footer === false) this.#frame.remove();
        else this.#anchor.after(this.#frame);
        const document = this.#row.ownerDocument;
        const cells = [];
        if (rowHeaders) {
            const gutter = document.createElement('th');
            gutter.className = 'row-heading'; gutter.setAttribute('role', 'rowheader');
            cells.push(gutter);
        }
        for (const [index, column] of columns.entries()) {
            const cell = document.createElement('td');
            cell.dataset.field = column.field; cell.setAttribute('role', 'cell'); cell.setAttribute('part', 'footer-cell');
            cell.setAttribute('aria-colindex', String(index + 1 + Number(rowHeaders)));
            cell.style.textAlign = column.totalize ? 'end' : column.align;
            cell.classList.toggle('numeric', Boolean(column.totalize));
            cells.push(cell);
        }
        this.#row.replaceChildren(...cells);
    }

    /**
     * Recompute totals over `rows`, read through `reader.value(row, field)`, publish them to Data
     * and refresh the footer cells. A total that cannot be computed is published as null.
     */
    update(reader, rows) {
        for (const [index, column] of this.#columns.entries()) {
            const cell = this.cell(column.field);
            let text = column.footer_value ?? '', problem = null;
            if (column.totalize) {
                let total = 0;
                try {
                    for (const row of rows) {
                        const value = reader.value(row, column.field);
                        total = addNumeric(total, typeof value === 'boolean' ? Number(value) : value);
                    }
                    this.#errors.delete(column.field);
                } catch (error) {
                    total = null;
                    this.#errors.set(column.field, error);
                }
                this.#publish(column, total);
                if (total === null) { text = '—'; problem = this.#errors.get(column.field).message; }
                else text = cellText(total, {...column, dtype:column.dtype === 'B' ? 'L' : column.dtype,
                    format:column.footer_format ?? column.format}, this.#format);
            } else if (index === 0 && text === '') text = this.#caption === true ? 'Total' : this.#caption;
            if (cell.textContent !== text) cell.textContent = text;
            if (problem === null) { cell.removeAttribute('title'); cell.removeAttribute('aria-invalid'); }
            else { cell.title = problem; cell.setAttribute('aria-invalid', 'true'); }
        }
    }

    /** The absolute Data paths of the published totals. */
    totalPaths() {
        return this.#columns.filter(column => column.totalize).map(column =>
            this.source.absDatapath(column.totalize === true ? `.totalize.${column.field}` : column.totalize));
    }

    #publish(column, total) {
        const path = column.totalize === true ? `.totalize.${column.field}` : column.totalize;
        if (!sameValue(this.source.getRelativeData(path), total)) this.source.setRelativeData(path, total);
    }
}
