import {GridColumnFilters} from './grid-column-filters.js';
import {Bag} from '@genrojs/bag';
import {SVG_NS} from '../renderer/attributes.js';
import {defineComponent, ComponentCollection} from './registry.js';
import {Container} from './container.js';
import {parseSort} from '../stores/bag-collection-view.js';
import inputs from './inputs.js';
import {GridCellEditor} from './grid-cell-editor.js';
import {GridCheckSets} from './grid-check-sets.js';
import {GridRows} from './grid-rows.js';
import {GridStructure} from './grid-structure.js';
import {GridFormulas} from './grid-formulas.js';
import {GridFooter} from './grid-footer.js';
import {GridTools, registerGridCommands} from './grid-tools.js';
import {GridSelection, SELECTION_MODES} from './grid-selection.js';
import {GridHeaderInteraction} from './grid-header-interaction.js';
import {GridRowLayout} from './grid-row-layout.js';
import {GridRowInteraction} from './grid-row-interaction.js';
import {gridStyles} from './grid-styles.js';
import {gridSearch} from './grid-search.js';
import {SearchBox} from './grid-search-box.js';
import structureGrammar from './grid-grammar.json' with {type: 'json'};

/** First grid: explicit Bag row representation and a separately observable Data struct. */
export const Grid = defineComponent({
    name: 'grid', tag: 'gramlot-grid', base: Container, sourceContext: true, subTags: 'struct,div',
    parameters: {columnFilters: {dtype:'B', default:false, binding:'read'}, setFilter: {dtype:'T', default:'', binding:'read'}, windowInfo: {dtype:'X', nullable:true, default:null, binding:'read'},
        loading: {dtype:'B', default:false, binding:'read'},
        viewport: {dtype:'X', nullable:true, default:null, binding:'write'},
        sortRequest: {dtype:'T', default:'', binding:'write'},
        storepath: {dtype: 'T'}, structpath: {dtype: 'T'}, rowMode: {dtype: 'T'},
        rowHeaders: {dtype:'B', default:false, binding:'read'},
        footer: {dtype:['B','T'], default:false, binding:'read'},
        selectionMode: {dtype:'T', default:'multi', binding:'read'},
        selectedId: {dtype:'T', nullable:true, default:null, binding:'write'},
        selectedIndex: {dtype:'L', nullable:true, default:null, binding:'write'},
        selectedLabel: {dtype:'T', nullable:true, default:null, binding:'write'},
        selectedPkeys: {dtype:'X', nullable:true, default:null, binding:'write'},
        selectedRowidx: {dtype:'T', nullable:true, default:null, binding:'write'},
        selectedNodes: {dtype:'X', nullable:true, default:null, binding:'write'},
        selectedRowData: {dtype:'X', nullable:true, default:null, binding:'write'},
        rowResize: {dtype:'B', default:false, binding:'read'},
        selfDragRows: {dtype:'B', default:false, binding:'read'},
        sortedBy: {dtype:'T', default:'', binding:'read'},
        filter: {annotation:{kind:'type',module:'builtins',name:'dict'}, nullable:true, default:null, binding:'read'}},
    implementation: Base => class extends Base {
        #checkSets;
        #columnFilters;
        #cellEditor;
        #formulas;
        #footer;
        #tools;
        #derivedSession = null;
        #releaseDerived = null;
        #selection;
        /** Click selects (single); Ctrl/Cmd+click toggles and Shift+click extends (multi). Double-click still edits. */
        #selectRow = event => {
            const label = this.#labelOf(event.target.closest('tr[data-row]'));
            if (label === null || this.#selection.mode === 'none') return;
            try {
                this.#selection.select(label, {toggle:event.ctrlKey || event.metaKey, range:event.shiftKey});
                this.#renderSelection();
            } catch (error) { this.#context.reportError(error, 'Grid selection'); }
        };
        /** Without an open editor: Up/Down move the current row, Shift extends (multi), Ctrl/Cmd+A selects all visible rows. */
        #selectionKey = event => {
            if (this.#selection.mode === 'none' || event.altKey) return;
            const all = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a';
            const step = {ArrowUp:-1, ArrowDown:1}[event.key];
            if (!all && (step === undefined || event.ctrlKey || event.metaKey)) return;
            event.preventDefault();
            try {
                if (all) this.#selection.selectAll();
                else {
                    const field = event.target.closest?.('td[data-field]')?.dataset.field;
                    const label = this.#selection.move(step, event.shiftKey);
                    if (label !== null) this.#revealRow(label, field);
                }
                this.#renderSelection();
            } catch (error) { this.#context.reportError(error, 'Grid selection'); }
        };
        #editCell = event => {
            if (event.type === 'keydown' && !['Enter','F2'].includes(event.key)) return;
            const cell = event.target.closest('td[data-field]');
            if (!cell || !this.#structure) return;
            const row = this.#labelOf(cell.parentElement);
            const column = this.#structure.columns.find(column => column.field === cell.dataset.field);
            if (row !== null && column.edit) {
                event.preventDefault();
                try { this.#cellEditor.open(row, column, cell); }
                catch (error) { this.#context.reportError(error,'Grid editor'); }
            }
        };
        #windowRevision;
        #windowRequest;
        #context;
        #structure;
        #structureDirty = true;
        #signature;
        /** The rendered rows by row key (node label); the grid keeps keys, never row nodes. */
        #rows = new Map();
        #head;
        #body;
        #headerTable;
        #bodyTable;
        #headerViewport;
        #bodyViewport;
        #loadingStatus;
        #resizeObserver;
        #layoutFrame = null;
        #headerRows = 1;
        #rowHeaders = false;
        #interaction;
        #rowInteraction;
        #rowLayout;
        #collectionView;
        #requestedSort;
        #requestedFilter;
        #unsubscribeStore;
        #refreshTimer = null;
        #pendingFull = false;
        #pendingRows = new Set();
        #visibleLabels = [];
        #windowStart = -1;
        #windowEnd = -1;
        #topSpace;
        #bottomSpace;
        #geometryKey;
        #endPinned = false;
        #adjustedScroll = null;
        #viewportKey = event => {
            if (event.target !== this.#bodyViewport || !['Home', 'End'].includes(event.key) || !this.#structure) return;
            event.preventDefault();
            this.#endPinned = event.key === 'End';
            this.#scrollTo(this.#endPinned ? Math.max(0, this.#rowLayout.totalHeight - this.#bodyViewport.clientHeight) : 0);
            this.#scheduleLayout();
        };
        #syncScroll = () => {
            const viewport = this.#bodyViewport;
            if (viewport.scrollTop !== this.#adjustedScroll) {
                this.#endPinned = viewport.scrollTop > 0 && viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop <= 1;
            }
            this.#adjustedScroll = null;
            this.#headerViewport.scrollLeft = this.#bodyViewport.scrollLeft;
            if (this.#footer) this.#footer.viewport.scrollLeft = this.#bodyViewport.scrollLeft;
            this.#scheduleLayout();
        };
        constructor() {
            super();
            const doc = this.ownerDocument;
            const style = doc.createElement('style');
            style.textContent = gridStyles;
            // Two layout tables expose one logical read-only table, with explicit row groups.
            // The header is outside the only user-scrollable viewport.
            this.control.setAttribute('role', 'table');
            this.control.setAttribute('aria-label', 'Grid');
            this.control.setAttribute('part', 'table');
            const headerFrame = doc.createElement('div');
            headerFrame.className = 'header-frame'; headerFrame.setAttribute('part', 'header');
            this.#headerViewport = doc.createElement('div');
            this.#headerViewport.className = 'header-viewport';
            this.#headerViewport.setAttribute('part', 'header-viewport');
            this.#bodyViewport = doc.createElement('div');
            this.#bodyViewport.className = 'body-viewport';
            this.#bodyViewport.setAttribute('part', 'body-viewport');
            this.#bodyViewport.tabIndex = 0;
            this.#bodyViewport.setAttribute('role', 'rowgroup');
            this.#headerTable = doc.createElement('table');
            this.#bodyTable = doc.createElement('table');
            for (const table of [this.#headerTable, this.#bodyTable]) table.setAttribute('role', 'presentation');
            this.#head = doc.createElement('thead'); this.#head.setAttribute('role', 'rowgroup');
            this.#body = doc.createElement('tbody'); this.#body.setAttribute('role', 'presentation');
            this.#headerTable.append(this.#head); this.#bodyTable.append(this.#body);
            this.#headerViewport.append(this.#headerTable); headerFrame.append(this.#headerViewport);
            this.#topSpace = doc.createElement('div');
            this.#bottomSpace = doc.createElement('div');
            for (const space of [this.#topSpace, this.#bottomSpace]) {
                space.className = 'row-space'; space.setAttribute('aria-hidden', 'true');
            }
            this.#bodyViewport.append(this.#topSpace, this.#bodyTable, this.#bottomSpace);
            const bodyFrame = doc.createElement('div'); bodyFrame.className = 'body-frame';
            this.#loadingStatus = doc.createElement('div');
            this.#loadingStatus.className = 'loading-status';
            this.#loadingStatus.setAttribute('role', 'status');
            this.#loadingStatus.setAttribute('aria-label', 'Loading…');
            this.#loadingStatus.hidden = true;
            const spinner = doc.createElementNS(SVG_NS, 'svg');
            spinner.setAttribute('viewBox', '0 0 24 24'); spinner.setAttribute('aria-hidden', 'true');
            const track = doc.createElementNS(SVG_NS, 'circle');
            track.setAttribute('cx', '12'); track.setAttribute('cy', '12'); track.setAttribute('r', '9');
            track.setAttribute('opacity', '.2');
            const arc = doc.createElementNS(SVG_NS, 'path');
            arc.setAttribute('d', 'M12 3a9 9 0 0 1 9 9');
            spinner.append(track, arc); this.#loadingStatus.append(spinner);
            bodyFrame.append(this.#bodyViewport, this.#loadingStatus);
            this.control.replaceChildren(headerFrame, bodyFrame); this.shadowRoot.append(style);
            this.#columnFilters = new GridColumnFilters(this, this.#head);
            this.#interaction = new GridHeaderInteraction(this.#head, this.control, () => this.#structure, (field, multiple) => this.#sort(field, multiple),
                () => this.#rowLayout, () => this.#scheduleLayout());
            this.#rowInteraction = new GridRowInteraction(this.#body, this.control, () => this.#rowLayout, row => this.#labelOf(row),
                () => this.#collectionView, () => this.parameters.selfDragRows, () => this.#scheduleLayout());
            this.#resizeObserver = new doc.defaultView.ResizeObserver(() => this.#scheduleLayout());
        }
        connectedCallback() {
            this.#body.addEventListener('dblclick', this.#editCell);
            this.#body.addEventListener('keydown', this.#editCell);
            this.#body.addEventListener('click', this.#selectRow);
            this.#bodyViewport.addEventListener('keydown', this.#selectionKey);
            this.#cellEditor?.connect();
            this.#checkSets?.connect();
            this.#tools?.connect();
            this.#columnFilters.connect();
            this.#observeStore();
            if (this.#collectionView) this.#invalidate({full:true, rows:[]});
            this.#interaction.connect();
            this.#rowInteraction.connect();
            this.#bodyViewport.addEventListener('scroll', this.#syncScroll, {passive: true});
            this.#bodyViewport.addEventListener('keydown', this.#viewportKey);
            this.#resizeObserver.observe(this.#bodyViewport);
            this.#resizeObserver.observe(this.#bodyTable);
            this.#scheduleLayout();
        }
        disconnectedCallback() {
            this.#body.removeEventListener('dblclick', this.#editCell);
            this.#body.removeEventListener('keydown', this.#editCell);
            this.#body.removeEventListener('click', this.#selectRow);
            this.#bodyViewport.removeEventListener('keydown', this.#selectionKey);
            this.#cellEditor?.disconnect();
            this.#checkSets?.disconnect();
            this.#tools.disconnect();
            this.#releaseDerived?.(); this.#releaseDerived = null; this.#derivedSession = null;
            this.#columnFilters.disconnect();
            this.#formulas.disconnect();
            this.#cancelRefresh();
            gridSearch(this.#context.sourceNode).detach(this.#collectionView);
            this.#collectionView?.disconnect();
            this.#unsubscribeStore?.(); this.#unsubscribeStore = null;
            this.#interaction.disconnect();
            this.#rowInteraction.disconnect();
            this.#bodyViewport.removeEventListener('scroll', this.#syncScroll);
            this.#bodyViewport.removeEventListener('keydown', this.#viewportKey);
            this.#resizeObserver.disconnect();
            if (this.#layoutFrame !== null) this.ownerDocument.defaultView.cancelAnimationFrame(this.#layoutFrame);
            this.#layoutFrame = null;
        }
        #scheduleLayout() {
            if (!this.isConnected || this.#layoutFrame !== null) return;
            this.#layoutFrame = this.ownerDocument.defaultView.requestAnimationFrame(() => {
                this.#layoutFrame = null;
                const gutter = this.#bodyViewport.offsetWidth - this.#bodyViewport.clientWidth;
                const width = `${gutter}px`;
                if (this.control.style.getPropertyValue('--grid-scrollbar-width') !== width) {
                    this.control.style.setProperty('--grid-scrollbar-width', width);
                }
                this.#sizeRowHeader();
                for (const header of this.#head.querySelectorAll('th[scope=col]')) {
                    header.querySelector('.column-resize').setAttribute('aria-valuenow', String(Math.round(header.getBoundingClientRect().width)));
                }
                for (const row of this.#rows.values()) {
                    const handle = row.querySelector('.row-height-handle');
                    if (handle) handle.setAttribute('aria-valuenow', String(Math.round(row.getBoundingClientRect().height)));
                }
                this.#headerViewport.scrollLeft = this.#bodyViewport.scrollLeft;
                this.#footer.viewport.scrollLeft = this.#bodyViewport.scrollLeft;
                if (!this.#structure) return;
                try { this.#layoutWindow(); this.#cellEditor.position(); }
                catch (error) { this.#context.reportError(error, 'Grid viewport'); }
            });
        }
        #sizeRowHeader() {
            if (!this.#rowHeaders) return;
            const probe = this.#head.querySelector('.row-number-measure');
            probe.textContent = String(Math.max(1, this.#rowLayout.count));
            const minimum = Math.ceil(probe.getBoundingClientRect().width);
            this.control.style.setProperty('--grid-row-header-min-width', `${minimum}px`);
            if (this.#rowLayout.headerWidth === null) this.control.style.removeProperty('--grid-row-header-width');
            else this.control.style.setProperty('--grid-row-header-width', `${this.#rowLayout.headerWidth}px`);
            const handle = this.#head.querySelector('.row-heading .column-resize');
            handle.setAttribute('aria-valuemin', String(Math.max(40, minimum)));
        }
        #layoutWindow() {
            const viewport = this.#bodyViewport;
            const anchor = this.#rowLayout.indexAt(viewport.scrollTop);
            const within = viewport.scrollTop - this.#rowLayout.offset(anchor);
            let changed = false;
            const first = this.#rows.values().next().value;
            if (first) {
                const style = this.ownerDocument.defaultView.getComputedStyle(first.querySelector('td'));
                const key = JSON.stringify([this.#bodyTable.getBoundingClientRect().width,
                    style.font, style.lineHeight, style.padding, style.getPropertyValue('--gramlot-grid-row-height')]);
                if (key !== this.#geometryKey) {
                    this.#rowLayout.resetMeasurements(); this.#geometryKey = key; changed = true;
                }
            }
            for (const [label, row] of this.#rows) {
                changed = this.#rowLayout.measure(label, row.getBoundingClientRect().height) || changed;
            }
            if (changed && this.#visibleLabels.length) {
                // Keep the same visible row while estimated heights become exact.
                const top = this.#rowLayout.offset(anchor) + within;
                this.#setSpaces();
                this.#scrollTo(this.#endPinned ? Math.max(0, this.#rowLayout.totalHeight - viewport.clientHeight) : top);
            }
            if (!this.#rowInteraction.resizing) this.#renderWindow();
        }
        #setSpaces() {
            const start = Math.max(0, this.#windowStart), end = Math.max(start, this.#windowEnd);
            this.#topSpace.style.height = `${this.#rowLayout.offset(start)}px`;
            this.#bottomSpace.style.height = `${Math.max(0, this.#rowLayout.totalHeight - this.#rowLayout.offset(end))}px`;
        }
        #scrollTo(top) {
            if (this.#bodyViewport.scrollTop === top) return;
            this.#bodyViewport.scrollTop = top;
            // A layout correction emits a scroll event too. Do not mistake it
            // for a user leaving the bottom while new rows are being measured.
            this.#adjustedScroll = this.#bodyViewport.scrollTop;
        }
        #renderWindow(force = false) {
            const viewport = this.#bodyViewport;
            const maximum = Math.max(0, this.#rowLayout.totalHeight - viewport.clientHeight);
            const top = this.#endPinned ? maximum : Math.min(viewport.scrollTop, maximum);
            let {start, end} = this.#rowLayout.window(top, viewport.clientHeight);
            const info = this.#windowInfo();
            if (info) {
                const loadedEnd = info.start + this.#visibleLabels.length;
                if (start < info.start || end > loadedEnd) {
                    const count = Math.max(200, end - start);
                    const requestedStart = Math.max(0, Math.min(Math.max(0, info.total - count), start));
                    const key = JSON.stringify([info.revision, requestedStart, count]);
                    if (key !== this.#windowRequest) {
                        this.#windowRequest = key;
                        this.#context.writeParameter('viewport', {start:requestedStart, count});
                    }
                } else this.#windowRequest = null;
                start = Math.max(start, info.start);
                end = Math.max(start, Math.min(end, loadedEnd));
            }
            if (!info) this.#windowRequest = null;
            const loading = this.parameters.loading || this.#windowRequest !== null;
            this.#loadingStatus.hidden = !loading;
            if (loading) this.control.setAttribute('aria-busy', 'true');
            else this.control.removeAttribute('aria-busy');
            if (force || start !== this.#windowStart || end !== this.#windowEnd) {
                const rows = new GridRows(this.#formulas, this.#context.format)
                    .read(this.#structure.columns, this.#rowNodes(this.#visibleLabels.slice(start-(info?.start ?? 0), end-(info?.start ?? 0))));
                this.#renderRows(rows, this.#structure.columns, start);
                this.#windowStart = start; this.#windowEnd = end;
                this.#scheduleLayout();
            }
            this.#setSpaces();
            this.#scrollTo(top);
        }
        /** The provider window, read at the address of the `windowInfo` pointer at each use; never kept. */
        #windowInfo() {
            const value = this.#context.getStaticData(this.#context.attrDatapath('windowInfo'));
            if (value === null) return null;
            if (!(value instanceof Bag)) throw new TypeError('Grid windowInfo requires a Bag');
            return Object.fromEntries(['start', 'total', 'revision', 'sortedBy'].map(key => [key, value.getItem(key)]));
        }
        #nextEditor(row,field,step) {
            const rows = this.#collectionView.getRows().map(node => node.label), columns = this.#structure.columns.filter(column => column.edit);
            const index = rows.indexOf(row) * columns.length + columns.findIndex(column => column.field === field) + (typeof step === 'object' ? step.row * columns.length : step);
            if (index < 0 || index >= rows.length * columns.length) return;
            this.#openEditorAt(Math.floor(index / columns.length),columns[index % columns.length]);
        }
        #openEditorAt(rowIndex,column) {
            const next = this.#collectionView.getRows()[rowIndex].label;
            this.#endPinned = false;
            const top = this.#rowLayout.offset(rowIndex), bottom = this.#rowLayout.offset(rowIndex + 1);
            if (top < this.#bodyViewport.scrollTop) this.#scrollTo(top);
            else if (bottom > this.#bodyViewport.scrollTop + this.#bodyViewport.clientHeight) this.#scrollTo(Math.max(0,bottom-this.#bodyViewport.clientHeight));
            this.#renderWindow(true);
            // An unseen row still has an estimated height. Measure the materialized window
            // before revealing its cell, so opening an error cannot leave it below the viewport.
            this.#layoutWindow();
            const cell = this.#rows.get(next).querySelector(`td[data-field="${column.field}"]`);
            const rect = cell.getBoundingClientRect(), viewport = this.#bodyViewport.getBoundingClientRect();
            if (rect.top < viewport.top) this.#scrollTo(Math.floor(this.#bodyViewport.scrollTop + rect.top-viewport.top));
            else if (rect.bottom > viewport.bottom) this.#scrollTo(Math.ceil(this.#bodyViewport.scrollTop + Math.min(rect.top-viewport.top,rect.bottom-viewport.bottom)));
            if (rect.left < viewport.left) this.#bodyViewport.scrollLeft += rect.left-viewport.left;
            else if (rect.right > viewport.right) this.#bodyViewport.scrollLeft += Math.min(rect.left-viewport.left,rect.right-viewport.right);
            this.#headerViewport.scrollLeft = this.#bodyViewport.scrollLeft;
            this.#cellEditor.open(next,column,cell);
        }
        #focusField(path) {
            const address = this.#context.sourceNode.rowField(path);
            if (address === null) return false;
            const column = this.#structure.columns.find(column => column.field === address.field && column.edit);
            const index = this.#collectionView.getRows().findIndex(row => row.label === address.row);
            if (!column || index < 0) return false;
            this.#openEditorAt(index,column);
            return true;
        }
        /** The last error of each formula field, by field name. */
        get formulaErrors() { return this.#formulas.errors; }
        /** The last error of each totalized column, by field name. */
        get totalErrors() { return this.#footer.errors; }
        setSourceContext(context) {
            this.#context = context;
            this.#formulas = new GridFormulas(context.sourceNode);
            this.#footer = new GridFooter(context.sourceNode, context.format, this.#bodyViewport.parentElement);
            this.#selection = new GridSelection(context, {view:() => this.#collectionView, store:() => this.#collectionStore(),
                mode:() => this.#selectionMode(), rowData:node => this.#rowData(node)});
            this.#tools = new GridTools(context, {columns:() => this.#structure.columns, rows:() => this.#collectionView.getRows(),
                selected:() => this.#selection.nodes, selectionMode:() => this.#selectionMode(),
                reader:() => this.#formulas, store:() => ({mode:this.parameters.rowMode}),
                parameters:() => this.parameters, document:this.ownerDocument});
            if (this.isConnected) this.#tools.connect();
            this.#columnFilters.setSourceContext(context);
            this.#checkSets = new GridCheckSets(context.sourceNode, this.#body,
                () => this.#structure?.columns ?? [],
                element => { const label = this.#labelOf(element); return label === null ? undefined : this.#rowNodes([label])[0]; },
                (node,field) => this.#collectionView.value(node,field),
                () => this.parameters.setFilter, () => this.#collectionView);
            if (this.isConnected) this.#checkSets.connect();
            this.#cellEditor = new GridCellEditor(this, context, (row, field) => this.#rows.get(row)?.querySelector(`td[data-field="${field}"]`),
                () => ({labels:() => this.#collectionStore().getRows().map(row => row.label), window:this.#windowInfo()}),
                () => this.#rows, (row,field,step) => this.#nextEditor(row,field,step), path => this.#focusField(path));
            const node = context.sourceNode;
            this.#rowLayout = node._internal.gridRowLayout ??= new GridRowLayout();
        }
        /** The rows Bag, read at its address at each use; the grid never keeps it. */
        #storeBag() {
            const bag = this.#context.getStaticData(this.#context.attrDatapath('storepath'));
            if (!(bag instanceof Bag)) throw new TypeError('grid storepath must resolve to a Bag');
            return bag;
        }
        /** The row nodes of the keys `labels` still in the rows Bag, read at their address at this call. */
        #rowNodes(labels) {
            const bag = this.#storeBag();
            return labels.flatMap(label => bag.getNode(label) ?? []);
        }
        /** The key of a rendered row element of this grid, or null. */
        #labelOf(tr) {
            return tr && this.#rows.get(tr.dataset.row) === tr ? tr.dataset.row : null;
        }
        projectAttributes(attrs, adapt, changedPath = null) {
            const rest = super.projectAttributes(attrs, adapt);
            // The structure is read again at its address when a change reaches it, or on a full projection.
            const structpath = this.#context.attrDatapath('structpath');
            if (changedPath === null || changedPath === structpath || changedPath.startsWith(`${structpath}.`)
                || structpath.startsWith(`${changedPath}.`)) this.#structureDirty = true;
            if (this.#windowInfo() && (this.parameters.columnFilters || this.#collectionView?.filterContributions.some(([name]) => name.startsWith('column:')))) throw new TypeError('grid columnFilters requires a complete resident store');
            if (this.#windowInfo() && this.parameters.setFilter !== '') throw new TypeError('grid setFilter requires a complete resident store');
            const store = this.#context.collectionView(this.#context.attrDatapath('storepath'), this.parameters.rowMode);
            if (this.#collectionView !== store) {
                this.#cancelRefresh();
                this.#unsubscribeStore?.(); this.#unsubscribeStore = null;
                this.#collectionView = store;
                this.#observeStore();
            }
            if (!this.#windowInfo() && this.#requestedSort !== this.parameters.sortedBy) {
                this.#collectionView.sort(this.parameters.sortedBy);
                this.#requestedSort = this.parameters.sortedBy;
            }
            const filter = this.parameters.filter;
            const signature = JSON.stringify(filter);
            if (!this.#windowInfo() && this.#requestedFilter !== signature) {
                this.#collectionView.applyFilter(filter === null ? null : {locale:this.#context.locale,timeZone:this.#context.timeZone,...filter}, 'base');
                this.#requestedFilter = signature;
            }
            this.#invalidate({full:true, rows:[]});
            return rest;
        }
        #observeStore() {
            if (this.isConnected && this.#collectionView && !this.#unsubscribeStore) {
                this.#collectionView.connect();
                this.#unsubscribeStore = this.#collectionView.subscribe(change => this.#invalidate(change));
            }
        }
        #cancelRefresh() {
            if (this.#refreshTimer !== null) this.ownerDocument.defaultView.clearTimeout(this.#refreshTimer);
            this.#refreshTimer = null;
            this.#pendingFull = false;
            this.#pendingRows.clear();
        }
        #invalidate({full, rows}) {
            this.#pendingFull ||= full;
            if (this.#pendingFull) this.#pendingRows.clear();
            else for (const node of rows) this.#pendingRows.add(node.label);
            if (!this.isConnected || this.#refreshTimer !== null) return;
            this.#refreshTimer = this.ownerDocument.defaultView.setTimeout(() => {
                const full = this.#pendingFull, labels = [...this.#pendingRows];
                this.#refreshTimer = null;
                this.#pendingFull = false;
                this.#pendingRows.clear();
                try {
                    if (full) this.#project();
                    // View values (#, += and their dependents) of other rows can change too.
                    else this.#projectRows(this.#formulas.viewFields.size ? [...this.#rows.keys()] : labels);
                } catch (error) {
                    // Keep the last valid DOM. A later change retries a complete pull;
                    // there is no automatic retry loop and no exception in Data delivery.
                    this.#pendingFull = true;
                    this.#context.reportError(error, 'Grid refresh');
                }
            }, 0);
        }
        #projectRows(labels) {
            for (const label of labels) this.#rowLayout.forget(label);
            this.#footer.update(this.#formulas, this.#collectionStore().getRows());
            const rows = new GridRows(this.#formulas, this.#context.format).read(this.#structure.columns, this.#rowNodes(labels.filter(label => this.#rows.has(label))));
            this.#rowInteraction.cancel();
            for (const {node, cells} of rows) this.#renderCells(this.#rows.get(node.label), cells, node);
            this.#scheduleLayout();
        }
        #project() {
            const structpath = this.#context.attrDatapath('structpath');
            const model = this.#structureDirty
                ? new GridStructure(this.#context.getStaticData(structpath), {data:this.#context.sourceNode.data, path:structpath}) : this.#structure;
            const store = this.#collectionStore();
            this.#formulas.configure(model, this.#collectionView, store);
            this.#requireStoredCriteria();
            this.#tools.requireEditableTools(model.columns);
            this.#selection.prune();
            const structureChanged = this.#structureDirty;
            this.#cellEditor.configure(model.columns);
            this.#structure = model;
            this.#checkSets.configure();
            const labels = this.#collectionView.getRows().map(row => row.label);
            this.#rowInteraction.cancel(); this.#rowInteraction.cancelDrag();
            this.#rowLayout.retain(store.getRows().map(row => row.label));
            if (this.#structureDirty) this.#rowLayout.resetMeasurements();
            const info = this.#windowInfo();
            this.#rowLayout.setWindow(info);
            this.#rowLayout.setRows(labels);
            this.#visibleLabels = labels;
            if (info && this.#windowRevision !== info.revision) {
                this.#endPinned = false;
                this.#scrollTo(0);
                this.#windowRequest = null;
            }
            this.#windowRevision = info?.revision;
            this.#structureDirty = false;
            // View values (#, += and their dependents) derive from the order: they are not searchable.
            gridSearch(this.#context.sourceNode).update(this.#collectionView,
                model.columns.filter(column => !column.check && !this.#formulas.viewFields.has(column.field)));
            const rowHeaders = this.parameters.rowHeaders || this.parameters.rowResize;
            const signature = JSON.stringify([model.groups, rowHeaders, this.parameters.columnFilters, this.parameters.footer]);
            this.#rowHeaders = rowHeaders;
            if (signature !== this.#signature) {
                this.#footer.configure(this.parameters.footer, model.columns, rowHeaders);
                this.#renderHeader(model);
                this.#signature = signature;
            }
            this.#footer.update(this.#formulas, store.getRows());
            this.#declareDerived(structureChanged);
            this.#columnFilters.update(this.#collectionView, model.columns, this.parameters.columnFilters, this.#context.format);
            this.#renderSort();
            this.#renderWindow(true);
            this.#renderSelection();
            this.control.setAttribute('aria-colcount', String(model.columns.length + Number(this.#rowHeaders)));
            this.control.setAttribute('aria-rowcount', String(this.#headerRows + Math.max(this.#rowLayout.count, 1)));
            this.#scheduleLayout();
        }
        /** Formula results, published totals and the published selection are derived values of the editing session, never changes. */
        #declareDerived(structureChanged) {
            const session = this.#context.sourceNode.formState;
            if (session === this.#derivedSession) {
                if (structureChanged) session?.updateChanges();
                return;
            }
            this.#releaseDerived?.();
            this.#derivedSession = session;
            this.#releaseDerived = session === null ? null : session.registerDerived(path => this.#derivedPath(path));
        }
        #derivedPath(path) {
            const base = this.#derivedSession.path;
            const relative = absolute => absolute === base ? '' : absolute.startsWith(base + '.') ? absolute.slice(base.length + 1) : null;
            if (this.#footer.totalPaths().some(total => relative(total) === path)) return true;
            // A published selection Bag (selectedNodes, selectedRowData) is derived with its content.
            if (this.#selection.paths().some(selection => {
                const own = relative(selection);
                return own !== null && (path === own || path.startsWith(own + '.') || path.startsWith(own + '?'));
            })) return true;
            const address = this.#context.sourceNode.rowField(path === '' ? base : `${base}.${path}`);
            return address !== null && this.#formulas.dataFields.has(address.field);
        }
        #selectionMode() {
            const mode = this.parameters.selectionMode;
            if (!SELECTION_MODES.includes(mode)) throw new TypeError('grid selectionMode requires none, single or multi');
            return mode;
        }
        /** The plain field values of a row, as published by selectedNodes and selectedRowData. */
        #rowData(node) {
            if (this.parameters.rowMode === 'attributes') return {...node.getAttr()};
            return Object.fromEntries(node.staticValue.getNodes().filter(cell => !(cell.staticValue instanceof Bag)).map(cell => [cell.label, cell.staticValue]));
        }
        #renderSelection() {
            const mode = this.#selectionMode();
            if (mode === 'multi') this.control.setAttribute('aria-multiselectable', 'true');
            else this.control.removeAttribute('aria-multiselectable');
            for (const [label, tr] of this.#rows) {
                const selected = this.#selection.isSelected(label);
                if (mode === 'none') tr.removeAttribute('aria-selected');
                else tr.setAttribute('aria-selected', String(selected));
                tr.setAttribute('part', selected ? 'row selected-row' : 'row');
            }
        }
        /** Scroll the view row of key `label` into the viewport; focus the cell of `field` when given. */
        #revealRow(label, field) {
            const index = this.#collectionView.getRows().findIndex(row => row.label === label);
            this.#endPinned = false;
            const top = this.#rowLayout.offset(index), bottom = this.#rowLayout.offset(index + 1);
            if (top < this.#bodyViewport.scrollTop) this.#scrollTo(top);
            else if (bottom > this.#bodyViewport.scrollTop + this.#bodyViewport.clientHeight) this.#scrollTo(Math.max(0, bottom - this.#bodyViewport.clientHeight));
            this.#renderWindow(true);
            if (field) this.#rows.get(label)?.querySelector(`td[data-field="${field}"]`)?.focus({preventScroll:true});
        }
        /** The shared resident store under this grid's view. */
        #collectionStore() {
            return this.#context.sourceNode.rootBuilder.binding.collectionStore(this.#context.attrDatapath('storepath'), this.parameters.rowMode);
        }
        /** Sort, column filter and search criteria apply to stored fields: a view value derives from the order. */
        #requireStoredCriteria() {
            const view = this.#collectionView, fields = this.#formulas.viewFields;
            const used = [...view.criteria.map(({field}) => ['sort by', field]),
                ...view.filterContributions.flatMap(([name, {definition}]) => name.startsWith('column:') ? [['filter', name.slice('column:'.length)]]
                    : name === 'sets' ? [] : definition.columns.map(field => ['search', field]))];
            const [kind, field] = used.find(([, field]) => fields.has(field)) ?? [];
            if (field !== undefined) throw new TypeError(`grid cannot ${kind} the view value '${field}'`);
        }
        #sort(field, multiple) {
            if (this.#structure.columns.find(column => column.field === field)?.check) return;
            try {
                if (this.#formulas.viewFields.has(field)) throw new TypeError(`grid cannot sort by the view value '${field}'`);
                const criteria = this.#windowInfo() ? parseSort(this.#windowInfo().sortedBy) : this.#collectionView.criteria;
                const current = criteria.find(item => item.field === field);
                const direction = current?.direction === 'a' ? 'd' : 'a';
                const next = multiple ? criteria.filter(item => item.field !== field) : [];
                if (multiple && current) next.splice(criteria.indexOf(current), 0, {field, direction});
                else next.push({field, direction});
                const sortedBy = next.map(item => `${item.field}:${item.direction}`).join(',');
                if (this.#windowInfo()) this.#context.writeParameter('sortRequest', sortedBy);
                else this.#collectionView.sort(sortedBy);
            } catch (error) { this.#context.reportError(error, 'Grid sort'); }
        }
        #renderSort() {
            const criteria = this.#windowInfo() ? parseSort(this.#windowInfo().sortedBy) : this.#collectionView.criteria;
            this.#sizeRowHeader();
            for (const header of this.#head.querySelectorAll('th[scope=col]')) {
                const index = criteria.findIndex(item => item.field === header.dataset.field);
                header.removeAttribute('aria-sort');
                if (index < 0) {
                    delete header.dataset.sortDirection; delete header.dataset.sortPriority;
                    header.removeAttribute('aria-label');
                } else {
                    const direction = criteria[index].direction === 'a' ? 'ascending' : 'descending';
                    header.dataset.sortDirection = direction; header.dataset.sortPriority = String(index + 1);
                    if (index === 0) header.setAttribute('aria-sort', direction);
                    header.setAttribute('aria-label', `${header.textContent}, sort ${index + 1}, ${direction}`);
                }
            }
        }
        #renderHeader(model) {
            this.#interaction.cancel();
            const focused = this.shadowRoot.activeElement;
            const focusedField = focused?.closest('th[data-field]')?.dataset.field;
            const resizeFocused = focused?.classList.contains('column-resize');
            const doc = this.ownerDocument, grouped = model.groups.some(group => group.name !== null);
            this.#headerRows = grouped ? 2 : 1;
            const top = doc.createElement('tr'), bottom = doc.createElement('tr');
            for (const [index, row] of [top, bottom].entries()) {
                row.setAttribute('role', 'row'); row.setAttribute('aria-rowindex', String(index + 1));
            }
            const header = (text, span, rowSpan, scope, index, align = 'start') => {
                const cell = doc.createElement('th'); cell.textContent = text;
                cell.colSpan = span; cell.rowSpan = rowSpan; cell.scope = scope;
                cell.setAttribute('role', 'columnheader'); cell.setAttribute('part', scope === 'colgroup' ? 'group-header' : 'column-header');
                cell.setAttribute('aria-colindex', String(index + 1 + Number(this.#rowHeaders)));
                cell.setAttribute('aria-colspan', String(span)); cell.setAttribute('aria-rowspan', String(rowSpan));
                cell.style.textAlign = align;
                if (scope === 'col') {
                    const caption = doc.createElement('span');
                    caption.className = 'column-caption'; caption.textContent = text; cell.replaceChildren(caption);
                    const column = model.columns[index];
                    cell.dataset.field = column.field;
                    cell.draggable = true; cell.tabIndex = 0;
                    cell.setAttribute('aria-label', column.title ?? column.name);
                    cell.title = column.check ? (column.title ?? column.name) + ' · Drag to reorder' : 'Click: ascending / descending · Shift-click: add or reverse this column without changing the others · Numbers show sort priority · Drag to reorder';
                    const indicator = doc.createElementNS(SVG_NS, 'svg');
                    indicator.classList.add('sort-indicator'); indicator.setAttribute('viewBox', '0 0 16 16');
                    indicator.setAttribute('aria-hidden', 'true');
                    const arrow = doc.createElementNS(SVG_NS, 'path');
                    arrow.setAttribute('d', 'M4 10L8 6L12 10'); indicator.append(arrow); cell.append(indicator);
                    if (this.parameters.columnFilters && !column.check && !this.#formulas.viewFields.has(column.field)) cell.append(this.#columnFilters.button(column));
                    const handle = doc.createElement('span');
                    handle.className = 'column-resize'; handle.tabIndex = 0;
                    handle.setAttribute('role', 'separator');
                    handle.setAttribute('aria-orientation', 'vertical');
                    handle.setAttribute('aria-valuemin', '40');
                    handle.setAttribute('aria-label', `Resize ${column.name}`);
                    handle.title = 'Drag to resize · Arrow keys adjust width';
                    cell.append(handle);
                }
                return cell;
            };
            if (this.#rowHeaders) {
                const corner = doc.createElement('th');
                corner.textContent = '#'; corner.scope = 'col'; corner.className = 'row-heading';
                corner.rowSpan = this.#headerRows;
                corner.setAttribute('role', 'columnheader');
                corner.setAttribute('aria-colindex', '1');
                corner.setAttribute('aria-rowspan', String(this.#headerRows));
                corner.setAttribute('part', 'row-header');
                const probe = doc.createElement('span');
                probe.className = 'row-number-measure'; probe.setAttribute('aria-hidden', 'true');
                const handle = doc.createElement('span');
                handle.className = 'column-resize'; handle.tabIndex = 0;
                handle.setAttribute('role', 'separator'); handle.setAttribute('aria-orientation', 'vertical');
                handle.setAttribute('aria-label', 'Resize row numbers');
                handle.title = 'Drag to resize · Arrow keys adjust width';
                corner.append(probe, handle); top.append(corner);
            }
            let index = 0;
            for (const group of model.groups) {
                if (grouped && group.name !== null) {
                    const band = header(group.name, group.columns.length, 1, 'colgroup', index, 'center');
                    band.style.background = group.background ?? '';
                    band.style.color = group.color ?? '';
                    top.append(band);
                    for (const col of group.columns) bottom.append(header(col.name, 1, 1, 'col', index++, col.align));
                } else for (const col of group.columns) {
                    if (grouped) {
                        const spacer = doc.createElement('td');
                        spacer.className = 'group-spacer'; spacer.setAttribute('aria-hidden', 'true');
                        top.append(spacer);
                    }
                    (grouped ? bottom : top).append(header(col.name, 1, 1, 'col', index++, col.align));
                }
            }
            this.#head.replaceChildren(top, ...(grouped ? [bottom] : []));
            if (focusedField) this.#head.querySelector(`th[data-field="${focusedField}"]${resizeFocused ? ' .column-resize' : ''}`)?.focus({preventScroll:true});
            const widths = model.columns.map(column => column.width ?? 'var(--gramlot-grid-column-width, 10rem)');
            if (this.#rowHeaders) widths.unshift('max(var(--grid-row-header-min-width, 0px), var(--grid-row-header-width, var(--gramlot-grid-row-header-width, 44px)))');
            this.control.style.setProperty('--grid-columns-width', `calc(${widths.join(' + ')})`);
            // Identical colgroups and table constraints keep one CSS sizing policy for both areas.
            const footer = this.parameters.footer === false ? [] : [this.#footer.table];
            for (const table of [this.#headerTable, this.#bodyTable, ...footer]) {
                for (const group of table.querySelectorAll(':scope > colgroup')) group.remove();
                table.prepend(...model.groups.map(group => {
                    const element = doc.createElement('colgroup');
                    for (const column of group.columns) {
                        const col = doc.createElement('col');
                        col.style.width = column.width ?? 'var(--gramlot-grid-column-width, 10rem)';
                        element.append(col);
                    }
                    return element;
                }));
                if (this.#rowHeaders) {
                    const group = doc.createElement('colgroup'), col = doc.createElement('col');
                    col.style.width = 'max(var(--grid-row-header-min-width, 0px), var(--grid-row-header-width, var(--gramlot-grid-row-header-width, 44px)))';
                    group.append(col); table.prepend(group);
                }
            }
        }
        #renderRows(rows, columns, start) {
            this.#rowInteraction.cancel();

            const keep = new Set(); let previous = null;
            this.#body.querySelector('.empty')?.parentElement.remove();
            for (const {node, cells} of rows) {
                const label = node.label;
                let tr = this.#rows.get(label);
                if (!tr) {
                    tr = this.ownerDocument.createElement('tr'); tr.setAttribute('part', 'row');
                    tr.setAttribute('role', 'row');
                    tr.dataset.row = label;
                    this.#rows.set(label, tr);
                }
                tr.classList.toggle('alternate', (start + keep.size) % 2 === 1);
                tr.setAttribute('part', this.#selection.isSelected(label) ? 'row selected-row' : 'row');
                if (this.#selection.mode === 'none') tr.removeAttribute('aria-selected');
                else tr.setAttribute('aria-selected', String(this.#selection.isSelected(label)));
                // Under a filter the numbering covers the visible rows only.
                const partial = this.#collectionView.isFiltered();
                tr.draggable = this.parameters.selfDragRows;
                let heading = tr.querySelector('th[scope=row]');
                if (this.#rowHeaders) {
                    if (!heading) {
                        heading = this.ownerDocument.createElement('th');
                        heading.scope = 'row'; heading.className = 'row-heading';
                        heading.setAttribute('role', 'rowheader'); heading.setAttribute('part', 'row-header');
                        heading.setAttribute('aria-colindex', '1');
                        const caption = this.ownerDocument.createElement('span');
                        caption.className = 'row-number'; heading.append(caption); tr.prepend(heading);
                    }
                    heading.querySelector('.row-number').textContent = String(start + keep.size + 1);
                    heading.classList.toggle('filtered-numbering', partial);
                    let handle = heading.querySelector('.row-height-handle');
                    if (this.parameters.rowResize) {
                        if (!handle) {
                            handle = this.ownerDocument.createElement('span');
                            handle.className = 'row-height-handle'; handle.tabIndex = 0;
                            handle.setAttribute('role', 'separator');
                            handle.setAttribute('aria-orientation', 'horizontal');
                            handle.title = 'Drag to resize row · Double-click or Home resets · Arrow keys adjust height';
                            heading.append(handle);
                        }
                        handle.setAttribute('aria-label', `Resize row ${start + keep.size + 1}`);
                    } else handle?.remove();
                } else heading?.remove();
                const offset = Number(this.#rowHeaders);
                const existing = new Map([...tr.querySelectorAll('td[data-field]')].map(td => [td.dataset.field, td]));
                for (const [index, column] of columns.entries()) {
                    let td = existing.get(column.field);
                    if (!td) {
                        td = this.ownerDocument.createElement('td'); td.setAttribute('part', 'cell');
                        td.dataset.field = column.field; td.setAttribute('role', 'cell');
                        const content = this.ownerDocument.createElement('div');
                        content.className = 'cell-content'; content.setAttribute('part','cell-content');
                        td.append(content);
                    }
                    if (column.edit) td.tabIndex = 0; else td.removeAttribute('tabindex');
                    td.classList.toggle('filtered-numbering', partial && this.#formulas.viewFields.has(column.field));
                    const content = td.firstElementChild;
                    const capped = column.max_height != null;
                    if (capped) td.style.setProperty('--grid-cell-max-height',column.max_height);
                    else td.style.removeProperty('--grid-cell-max-height');
                    content.classList.toggle('cell-scroll',capped);
                    if (capped) content.tabIndex = 0; else content.removeAttribute('tabindex');
                    td.style.textAlign = column.align;
                    td.style.whiteSpace = column.white_space ?? '';
                    td.style.overflowWrap = column.white_space === 'pre-wrap' || column.white_space === 'normal' ? 'anywhere' : '';
                    td.setAttribute('aria-colindex', String(index + 1 + offset));
                    td.classList.toggle('numeric', ['L', 'R', 'N'].includes(column.dtype));
                    if (tr.cells[index + offset] !== td) tr.insertBefore(td, tr.cells[index + offset] ?? null);
                    existing.delete(column.field);
                }
                for (const td of existing.values()) td.remove();
                tr.setAttribute('aria-rowindex', String(this.#headerRows + start + keep.size + 1));
                this.#renderCells(tr, cells, node);
                this.#cellEditor.decorate(tr, label);
                const next = previous ? previous.nextSibling : this.#body.firstChild;
                if (next !== tr) this.#body.insertBefore(tr, next);
                this.#rowInteraction.project(tr, label);
                previous = tr; keep.add(label);
            }
            for (const [label, tr] of this.#rows) if (!keep.has(label)) { tr.remove(); this.#rows.delete(label); }
            if (!rows.length && this.#rowLayout.count === 0 && !this.parameters.loading) {
                const tr = this.ownerDocument.createElement('tr'), td = this.ownerDocument.createElement('td');
                tr.setAttribute('role', 'row'); tr.setAttribute('aria-rowindex', String(this.#headerRows + 1));
                td.setAttribute('role', 'cell'); td.setAttribute('aria-colspan', String(columns.length + Number(this.#rowHeaders)));
                td.className = 'empty'; td.colSpan = columns.length + Number(this.#rowHeaders); td.textContent = 'No rows'; tr.append(td); this.#body.append(tr);
            }
        }
        #renderCells(row, cells, node) {
            const offset = Number(this.#rowHeaders);
            cells.forEach((text, index) => {
                const content = row.cells[index + offset].firstElementChild;
                const column = this.#structure.columns[index];
                content.parentElement.classList.toggle('check-cell', Boolean(column.check));
                if (column.check) {
                    this.#checkSets.project(content,node,column);
                    return;
                }
                const color = column.edit?.tag === 'colorpicker';
                if (color) {
                    let swatch = content.querySelector('.cell-color-swatch');
                    if (!swatch) {
                        swatch = this.ownerDocument.createElement('span');
                        swatch.className = 'cell-color-swatch'; swatch.setAttribute('role','img');
                        content.replaceChildren(swatch);
                    }
                    swatch.hidden = text === '';
                    swatch.style.backgroundColor = text;
                    swatch.title = text;
                    swatch.setAttribute('aria-label',text);
                } else if (content.firstElementChild || content.textContent !== text) content.textContent = text;
            });
        }
    }
});

class GridCollection extends ComponentCollection {
    toDocument() {
        const document = super.toDocument();
        const parameters = document.elements.grid.attributes.parameters;
        for (const name of ['storepath', 'rowMode']) {
            const parameter = parameters.find(item => item.name === name);
            parameter.has_default = false; delete parameter.default;
            if (name === 'rowMode') parameter.annotation = {kind: 'annotated', base: {kind: 'dtype', dtype: 'T'},
                metadata: [{kind: 'regex', pattern: '^(values|attributes)$', flags: 0}]};
        }
        Object.assign(document.elements, structuredClone(structureGrammar.elements));
        // selected_<field> is a declared parameter family: composites route it to the grid (frameGrid).
        document.elements.grid._meta.parameterPattern = '^selected_[A-Za-z_][A-Za-z0-9_]*$';
        return document;
    }
}
export default new GridCollection({name: 'grid', components: [Grid, SearchBox], dependencies:[inputs], registerCommands:registerGridCommands,
    // The lazily loaded Excel writer and its compression library ship their licenses with the collection.
    assets:{writeExcelFileLicense:new URL('./licenses/write-excel-file.txt', import.meta.url), fflateLicense:new URL('./licenses/fflate.txt', import.meta.url)}});
