import {Bag} from '@genrojs/bag';
import {loadLibrary} from '../libraries.js';
import {isDecimal} from '@genrojs/tytx';
import {GridRows} from './grid-rows.js';

/** Export formats of `grid:export`, by `format` parameter: caption, file extension and media type. */
export const EXPORT_FORMATS = Object.freeze({
    csv: {caption:'CSV', extension:'csv', type:'text/csv'},
    json: {caption:'JSON', extension:'json', type:'application/json'},
    tytx: {caption:'TYTX', extension:'tytx', type:'text/plain'},
    xml: {caption:'XML', extension:'xml', type:'application/xml'},
    xlsx: {caption:'Excel', extension:'xlsx', type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
});

// The Excel writer is an external engine, loaded on first use.
let excelEngine = null;

/** Grid toolbar commands of the `grid` namespace, delivered to the frame's target grid by publication. */
export const GRID_COMMANDS = Object.freeze({
    export: {label:'Export', publish:'export', icon:'⇩', tooltip:'Export the visible rows'},
    printRows: {label:'Print', publish:'printRows', icon:'⎙', tooltip:'Print the visible rows'},
    lineNumbers: {label:'Line numbers', publish:'lineNumbers', tooltip:'Show or hide the row numbers'},
    addrow: {label:'Add row', publish:'addrow', icon:'+', tooltip:'Add a row'},
    duprow: {label:'Duplicate', publish:'duprow', icon:'⧉', tooltip:'Duplicate the selected rows'},
    delrow: {label:'Delete', publish:'delrow', icon:'−', tooltip:'Delete the selected rows'},
});

// Commands that change rows: they require at least one editable column.
const EDIT_COMMANDS = new Set(['grid:addrow', 'grid:duprow', 'grid:delrow']);
// Commands that act on the selected rows: they require a selection mode.
const SELECTION_COMMANDS = new Set(['grid:duprow', 'grid:delrow']);

/** Register the grid command group on one Gramlot page. */
export function registerGridCommands(gramlot) {
    const group = gramlot.commands.registerGroup('grid', {description:'Grid toolbar tools'});
    for (const [name, definition] of Object.entries(GRID_COMMANDS)) group.register(name, definition);
}

function csvField(text) {
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/**
 * Toolbar tools of one grid element: subscriptions to the grid's own command topics while it is
 * connected, export and print of the visible rows, the row-number toggle and row insertion.
 */
export class GridTools {
    #context;
    #host;
    #handles = [];

    /**
     * `host` gives `columns()`, `rows()` (visible, in view order), `reader()` (shown values),
     * `store()` ({mode}), `selected()` (selected rows in view order), `selectionMode()`,
     * `parameters()` and `document`.
     */
    constructor(context, host) {
        this.#context = context;
        this.#host = host;
    }

    get source() { return this.#context.sourceNode; }
    get runtime() { return this.source.rootBuilder.binding; }

    connect() {
        if (this.#handles.length) return;
        const subscriptions = this.runtime.subscriptions;
        const handlers = {export:message => this.exportRows(message.parameters.format), printRows:() => this.printRows(),
            lineNumbers:() => this.toggleLineNumbers(), addrow:message => this.addRow(message.parameters.defaults ?? {}),
            duprow:() => this.duplicateRows(), delrow:() => this.deleteRows()};
        for (const [topic, handler] of Object.entries(handlers)) {
            this.#handles.push(subscriptions.subscribe(subscriptions.topicFor(this.source, topic), async message => {
                try { await handler(message); } catch (error) { this.#context.reportError(error, 'Grid tool'); }
            }));
        }
    }

    disconnect() {
        for (const handle of this.#handles) this.runtime.subscriptions.unsubscribe(handle);
        this.#handles = [];
    }

    /** The visible rows as text cells of the displayed columns, as shown by the grid. */
    #table() {
        const columns = this.#host.columns().filter(column => !column.check);
        const rows = new GridRows(this.#host.reader(), this.#context.format).read(columns, this.#host.rows());
        return {captions:columns.map(column => column.name), cells:rows.map(row => row.cells)};
    }

    /** CSV of the visible rows in view order, with the column captions. */
    csv() {
        const {captions, cells} = this.#table();
        return [captions, ...cells].map(line => line.map(csvField).join(',')).join('\r\n') + '\r\n';
    }

    /** The visible columns and rows with their raw values (view values included). */
    #records() {
        const columns = this.#host.columns().filter(column => !column.check), reader = this.#host.reader();
        return {columns, rows:this.#host.rows().map(node => [node, columns.map(column => reader.value(node, column.field) ?? null)])};
    }

    /** The visible rows as a Bag shaped like the store: one row per label, values or attributes. */
    rowsBag() {
        const {columns, rows} = this.#records(), bag = new Bag(), values = this.#host.store().mode === 'values';
        for (const [node, cells] of rows) {
            const fields = Object.fromEntries(columns.map((column, index) => [column.field, cells[index]]));
            if (values) bag.setItem(node.label, new Bag(fields));
            else bag.setItem(node.label, null, fields);
        }
        return bag;
    }

    /** XML of the visible rows under the legacy `GenRoBag` root element (values as text, no type markers). */
    xml() {
        const root = new Bag();
        root.setItem('GenRoBag', this.rowsBag());
        return root.toXml({docHeader:true});
    }

    /** JSON array of the visible rows, keyed by field, converted as the groupBox Copy JSON. */
    json() {
        const {columns, rows} = this.#records();
        return JSON.stringify(rows.map(([, cells]) => new Bag(Object.fromEntries(columns.map((column, index) => [column.field, cells[index]])))
            .asDict(false, false, true)), null, 2);
    }

    /** XLSX Blob of the visible rows: captions, then typed cells (numbers, dates, booleans, text). */
    async xlsx() {
        const {columns, rows} = this.#records();
        const writeExcelFile = (await (excelEngine ??= loadLibrary('writeExcelFile', this.#host.document, () => import('write-excel-file/browser')))).default;
        const cell = (value, column) => {
            if (value === null) return null;
            if (isDecimal(value)) return Number(value.toString());
            if (value instanceof Date) return {value, type:Date, format:['DH', 'DHZ'].includes(column.dtype) ? 'yyyy-mm-dd hh:mm:ss' : 'yyyy-mm-dd'};
            if (['number', 'boolean', 'string'].includes(typeof value)) return value;
            return String(value);
        };
        const header = columns.map(column => ({value:column.name, fontWeight:'bold'}));
        const data = [header, ...rows.map(([, cells]) => cells.map((value, index) => cell(value, columns[index])))];
        return writeExcelFile(data, {sheet:this.source.label, stickyRowsCount:1}).toBlob();
    }

    /** Save the visible rows in `format` (EXPORT_FORMATS) as `<grid label>.<extension>`. */
    async exportRows(format) {
        const definition = EXPORT_FORMATS[format];
        if (!definition) throw new TypeError(`grid export format must be one of ${Object.keys(EXPORT_FORMATS).join(', ')}`);
        const content = format === 'csv' ? this.csv() : format === 'json' ? this.json() : format === 'tytx' ? this.rowsBag().toTytx()
            : format === 'xml' ? this.xml() : await this.xlsx();
        // saveText takes any Blob part: text or the XLSX Blob.
        this.runtime.gramlot.utl.inout.saveText(content, `${this.source.label}.${definition.extension}`, definition.type);
    }

    /** Print the visible rows as a plain table in a temporary frame. */
    printRows() {
        const document = this.#host.document;
        const {captions, cells} = this.#table();
        const frame = document.createElement('iframe');
        frame.className = 'gramlot-grid-print';
        frame.setAttribute('aria-hidden', 'true');
        frame.style.cssText = 'position:fixed;inset-inline-start:-10000px;inline-size:1px;block-size:1px;border:0';
        document.body.append(frame);
        const page = frame.contentDocument;
        const table = page.createElement('table');
        const head = page.createElement('thead'), body = page.createElement('tbody');
        const line = (parent, values, tag) => {
            const row = page.createElement('tr');
            for (const value of values) { const cell = page.createElement(tag); cell.textContent = value; row.append(cell); }
            parent.append(row);
        };
        line(head, captions, 'th');
        for (const values of cells) line(body, values, 'td');
        table.append(head, body);
        const style = page.createElement('style');
        style.textContent = 'table{border-collapse:collapse;font:12px sans-serif}th,td{border:1px solid #888;padding:2px 6px;text-align:start}';
        page.head.append(style);
        page.body.append(table);
        frame.contentWindow.addEventListener('afterprint', () => frame.remove());
        frame.contentWindow.print();
    }

    /** Show or hide the row numbers (legacy showLineNumber): a `^` pointer writes Data, a literal the Source. */
    toggleLineNumbers() {
        const value = !this.#host.parameters().rowHeaders;
        if (this.source.pointerType(this.source.getAttr('rowHeaders'))) this.#context.writeParameter('rowHeaders', value);
        else this.source.setAttr({rowHeaders:value});
    }

    /** The Data path of the row of key `label`: `#ROW` of the grid for that row. */
    #rowPath(label) { return this.source.absDatapath('#ROW', {row:label}); }

    /** Append one row with `defaults` at its path in the store; an editing session records it as a change. */
    addRow(defaults) {
        const path = this.#rowPath(`r_${crypto.randomUUID().replaceAll('-', '')}`);
        if (this.#host.store().mode === 'values') this.source.data.setItem(path, new Bag(defaults));
        else this.source.data.setItem(path, null, defaults);
    }

    /** Append a copy of each selected row, with a new identity. */
    duplicateRows() {
        const values = this.#host.store().mode === 'values';
        for (const node of this.#host.selected()) {
            const path = this.#rowPath(`r_${crypto.randomUUID().replaceAll('-', '')}`);
            if (values) this.source.data.setItem(path, node.staticValue.deepcopy());
            else this.source.data.setItem(path, null, {...node.getAttr()});
        }
    }

    /** Remove the selected rows at their paths in the store; an editing session records each removal. */
    deleteRows() {
        for (const label of this.#host.selected().map(node => node.label)) this.source.data.popNode(this.#rowPath(label));
    }

    /** Edit tools declared in the grid's frame require an editable column; selection tools a selection mode. */
    requireEditableTools(columns) {
        const editable = columns.some(column => column.edit), selecting = this.#host.selectionMode() !== 'none';
        if (editable && selecting) return;
        let frame = this.source.parentNode;
        while (frame && frame.nodeTag !== 'framePane') frame = frame.parentNode;
        if (!frame) return;
        const visit = node => {
            if (node.nodeTag === 'framePane') return;
            const command = node.nodeTag === 'menuline' ? node.getAttr('command') : null;
            if (!editable && EDIT_COMMANDS.has(command)) throw new TypeError(`grid tool '${command}' requires an editable column`);
            if (!selecting && SELECTION_COMMANDS.has(command)) throw new TypeError(`grid tool '${command}' requires selectionMode single or multi`);
            if (!editable && node.nodeTag === 'editingStatus') throw new TypeError('grid editing status requires an editable column');
            if (node.value instanceof Bag) for (const child of node.value.getNodes()) visit(child);
        };
        for (const child of frame.value.getNodes()) visit(child);
    }
}
