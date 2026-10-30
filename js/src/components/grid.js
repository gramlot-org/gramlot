import {Bag} from '@gramlot/gramlot';
import {SVG_NS} from '../renderer/attributes.js';
import {defineComponent, ComponentCollection} from './registry.js';
import {Container} from './container.js';
import {parseSort} from '../stores/bag-collection-view.js';
import {GridRows} from './grid-rows.js';
import {GridStructure} from './grid-structure.js';
import {GridHeaderInteraction} from './grid-header-interaction.js';
import {GridRowLayout} from './grid-row-layout.js';
import {GridRowInteraction} from './grid-row-interaction.js';
import {gridStyles} from './grid-styles.js';
import {gridSearch} from './grid-search.js';
import {SearchBox} from './grid-search-box.js';
import structureGrammar from './grid-grammar.json' with {type: 'json'};

/** First grid: explicit Bag row representation and a separately observable Data struct. */
export const Grid = defineComponent({
    name: 'grid', tag: 'gramlot-grid', base: Container, bagStore: true, bagStruct: true, sourceContext: true, subTags: 'struct',
    parameters: {windowInfo: {dtype:'X', nullable:true, default:null, binding:'read'},
        viewport: {dtype:'X', nullable:true, default:null, binding:'write'},
        sortRequest: {dtype:'T', default:'', binding:'write'},
        storepath: {dtype: 'T'}, structpath: {dtype: 'T'}, rowMode: {dtype: 'T'},
        rowHeaders: {dtype:'B', default:false, binding:'read'},
        rowResize: {dtype:'B', default:false, binding:'read'},
        selfDragRows: {dtype:'B', default:false, binding:'read'},
        sortedBy: {dtype:'T', default:'', binding:'read'},
        filter: {annotation:{kind:'type',module:'builtins',name:'dict'}, nullable:true, default:null, binding:'read'}},
    implementation: Base => class extends Base {
        #store;
        #windowRevision;
        #windowRequest;
        #context;
        #structure;
        #structBag;
        #structureDirty = true;
        #signature;
        #rows = new Map();
        #head;
        #body;
        #headerTable;
        #bodyTable;
        #headerViewport;
        #bodyViewport;
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
        #visibleNodes = [];
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
            this.control.replaceChildren(headerFrame, this.#bodyViewport); this.shadowRoot.append(style);
            this.#interaction = new GridHeaderInteraction(this.#head, this.control, () => this.#structure, (field, multiple) => this.#sort(field, multiple),
                () => this.#rowLayout, () => this.#scheduleLayout());
            this.#rowInteraction = new GridRowInteraction(this.#body, this.control, () => this.#rowLayout, row => {
                for (const [node, element] of this.#rows) if (element === row) return node;
                return null;
            }, () => this.#collectionView, () => this.parameters.selfDragRows, () => this.#scheduleLayout());
            this.#resizeObserver = new doc.defaultView.ResizeObserver(() => this.#scheduleLayout());
        }
        connectedCallback() {
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
            this.#cancelRefresh();
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
                if (!this.#structure) return;
                try { this.#layoutWindow(); }
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
            for (const [node, row] of this.#rows) {
                changed = this.#rowLayout.measure(node, row.getBoundingClientRect().height) || changed;
            }
            if (changed && this.#visibleNodes.length) {
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
                const loadedEnd = info.start + this.#visibleNodes.length;
                if (start < info.start || end > loadedEnd) {
                    const count = Math.max(200, end - start);
                    const requestedStart = Math.max(0, Math.min(Math.max(0, info.total - count), start));
                    const key = JSON.stringify([info.revision, requestedStart, count]);
                    if (key !== this.#windowRequest) {
                        this.#windowRequest = key;
                        this.#context.writeParameter('viewport', {start:requestedStart, count});
                    }
                    this.control.setAttribute('aria-busy', 'true');
                } else {
                    this.#windowRequest = null;
                    this.control.removeAttribute('aria-busy');
                }
                start = Math.max(start, info.start);
                end = Math.max(start, Math.min(end, loadedEnd));
            }
            if (force || start !== this.#windowStart || end !== this.#windowEnd) {
                const rows = new GridRows(this.#collectionView, this.#context.format)
                    .read(this.#structure.columns, this.#visibleNodes.slice(start-(info?.start ?? 0), end-(info?.start ?? 0)));
                this.#renderRows(rows, this.#structure.columns, start);
                this.#windowStart = start; this.#windowEnd = end;
                this.#scheduleLayout();
            }
            this.#setSpaces();
            this.#scrollTo(top);
        }
        #windowInfo() {
            const value = this.parameters.windowInfo;
            if (value === null) return null;
            if (!(value instanceof Bag)) throw new TypeError('Grid windowInfo requires a Bag');
            return Object.fromEntries(['start', 'total', 'revision', 'sortedBy'].map(key => [key, value.getItem(key)]));
        }
        setSourceContext(context) {
            this.#context = context;
            const node = context.sourceNode;
            if (!Object.hasOwn(node, 'gridRowLayout')) {
                Object.defineProperty(node, 'gridRowLayout', {value:new GridRowLayout(), configurable:true});
            }
            this.#rowLayout = node.gridRowLayout;
        }
        setStoreBag(bag) {
            if (!(bag instanceof Bag)) throw new TypeError('grid storepath must resolve to a Bag');
            this.#store = bag;
            this.#rowLayout.bindStore(bag);
        }
        setStructBag(bag) { this.#structBag = bag; this.#structureDirty = true; }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const store = this.#context.collectionView(this.#store, this.parameters.rowMode);
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
                this.#collectionView.applyFilter(filter === null ? null : {locale:this.#context.locale,timeZone:this.#context.timeZone,...filter});
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
            else for (const node of rows) this.#pendingRows.add(node);
            if (!this.isConnected || this.#refreshTimer !== null) return;
            this.#refreshTimer = this.ownerDocument.defaultView.setTimeout(() => {
                const full = this.#pendingFull, nodes = [...this.#pendingRows];
                this.#refreshTimer = null;
                this.#pendingFull = false;
                this.#pendingRows.clear();
                try {
                    if (full) this.#project();
                    else this.#projectRows(nodes);
                } catch (error) {
                    // Keep the last valid DOM. A later change retries a complete pull;
                    // there is no automatic retry loop and no exception in Data delivery.
                    this.#pendingFull = true;
                    this.#context.reportError(error, 'Grid refresh');
                }
            }, 0);
        }
        #projectRows(nodes) {
            for (const node of nodes) this.#rowLayout.forget(node);
            const rows = new GridRows(this.#collectionView, this.#context.format).read(this.#structure.columns, nodes.filter(node => this.#rows.has(node)));
            this.#rowInteraction.cancel();
            for (const {node, cells} of rows) this.#renderCells(this.#rows.get(node), cells);
            this.#scheduleLayout();
        }
        #project() {
            const model = this.#structureDirty ? new GridStructure(this.#structBag) : this.#structure;
            const nodes = this.#collectionView.getRows();
            this.#rowInteraction.cancel(); this.#rowInteraction.cancelDrag();
            this.#rowLayout.retain(this.#store.getNodes());
            if (this.#structureDirty) this.#rowLayout.resetMeasurements();
            const info = this.#windowInfo();
            this.#rowLayout.setWindow(info);
            this.#rowLayout.setRows(nodes);
            this.#visibleNodes = nodes;
            if (info && this.#windowRevision !== info.revision) {
                this.#endPinned = false;
                this.#scrollTo(0);
                this.#windowRequest = null;
            }
            this.#windowRevision = info?.revision;
            this.#structure = model;
            this.#structureDirty = false;
            gridSearch(this.#context.sourceNode).update(this.#collectionView, model.columns);
            const rowHeaders = this.parameters.rowHeaders || this.parameters.rowResize;
            const signature = JSON.stringify([model.groups, rowHeaders]);
            this.#rowHeaders = rowHeaders;
            if (signature !== this.#signature) {
                this.#renderHeader(model);
                this.#signature = signature;
            }
            this.#renderSort();
            this.#renderWindow(true);
            this.control.setAttribute('aria-colcount', String(model.columns.length + Number(this.#rowHeaders)));
            this.control.setAttribute('aria-rowcount', String(this.#headerRows + Math.max(this.#rowLayout.count, 1)));
            this.#scheduleLayout();
        }
        #sort(field, multiple) {
            try {
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
                    cell.title = 'Click: ascending / descending · Shift-click: add or reverse this column without changing the others · Numbers show sort priority · Drag to reorder';
                    const indicator = doc.createElementNS(SVG_NS, 'svg');
                    indicator.classList.add('sort-indicator'); indicator.setAttribute('viewBox', '0 0 16 16');
                    indicator.setAttribute('aria-hidden', 'true');
                    const arrow = doc.createElementNS(SVG_NS, 'path');
                    arrow.setAttribute('d', 'M4 10L8 6L12 10'); indicator.append(arrow); cell.append(indicator);
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
            for (const table of [this.#headerTable, this.#bodyTable]) {
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
                let tr = this.#rows.get(node);
                if (!tr) {
                    tr = this.ownerDocument.createElement('tr'); tr.setAttribute('part', 'row');
                    tr.setAttribute('role', 'row');
                    tr.dataset.row = node.label;
                    this.#rows.set(node, tr);
                }
                tr.classList.toggle('alternate', (start + keep.size) % 2 === 1);
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
                    }
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
                this.#renderCells(tr, cells);
                const next = previous ? previous.nextSibling : this.#body.firstChild;
                if (next !== tr) this.#body.insertBefore(tr, next);
                this.#rowInteraction.project(tr, node);
                previous = tr; keep.add(node);
            }
            for (const [node, tr] of this.#rows) if (!keep.has(node)) { tr.remove(); this.#rows.delete(node); }
            if (!rows.length) {
                const tr = this.ownerDocument.createElement('tr'), td = this.ownerDocument.createElement('td');
                tr.setAttribute('role', 'row'); tr.setAttribute('aria-rowindex', String(this.#headerRows + 1));
                td.setAttribute('role', 'cell'); td.setAttribute('aria-colspan', String(columns.length + Number(this.#rowHeaders)));
                td.className = 'empty'; td.colSpan = columns.length + Number(this.#rowHeaders); td.textContent = 'No rows'; tr.append(td); this.#body.append(tr);
            }
        }
        #renderCells(row, cells) {
            const offset = Number(this.#rowHeaders);
            cells.forEach((text, index) => {
                if (row.cells[index + offset].textContent !== text) row.cells[index + offset].textContent = text;
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
        return document;
    }
}
export default new GridCollection({name: 'grid', components: [Grid, SearchBox]});
