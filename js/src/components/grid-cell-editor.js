import {toTytx} from '@genrojs/tytx';
import {sourceTarget} from '@genrojs/builders';
import {Bag} from '@genrojs/bag';
import {pointerTransform} from '@genrojs/builders';

/**
 * Grid navigation and temporary Source controls; all editing registers belong to the shared session.
 * A row is its key (node label): the editor keeps keys and Data paths, never row nodes.
 */
export class GridCellEditor {
    /**
     * `cellFor(label, field)` gives the rendered cell; `store()` gives `{labels(), window}`;
     * `renderedRows()` the rendered rows by key; `navigate(label, field, step)` opens a neighbour editor.
     */
    constructor(grid, context, cellFor, store, renderedRows, navigate, focusField) {
        this.grid = grid;
        this.context = context;
        this.cellFor = cellFor;
        this.store = store;
        this.renderedRows = renderedRows;
        this.navigate = navigate;
        this.focusField = focusField;
        this.retained = new Map();
        this.declarations = new Map();
        this.checking = new Set();
        this.columns = [];
        this.layer = grid.ownerDocument.createElement('div');
        this.layer.className = 'cell-editor'; this.layer.hidden = true;
        const slot = grid.ownerDocument.createElement('slot'); slot.name = 'cell-editor'; this.layer.append(slot);
        grid.control.append(this.layer);
        this.keydown = event => {
            if (!this.active || event.isComposing) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                const cell = this.cellFor(this.active.row,this.active.column.field);
                this.session.clearDraft(this.control(this.active));
                this.close(); cell?.focus({preventScroll:true});
            } else if (event.key === 'Enter' || event.key === 'Tab') {
                if (event.key === 'Enter' && this.active.element.control.localName === 'textarea' && !event.ctrlKey && !event.metaKey) return;
                event.preventDefault();
                const active = this.active;
                this.session.commitField(active.path);
                const cell = this.cellFor(active.row,active.column.field);
                this.close(); cell?.focus({preventScroll:true});
                if (event.key === 'Tab') this.navigate(active.row,active.column.field,event.shiftKey ? -1 : 1);
            }
        };
        this.arrowKeydown = event => {
            if (!this.active || event.isComposing || !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
            const control = this.active.element.control;
            if (control.localName === 'textarea' || ['range','date','time','datetime-local'].includes(control.type)) return;
            // Composite controls own their popup arrows; date/time fields own their editing keys.
            if (['gramlot-date-text-box','gramlot-time-text-box','gramlot-date-calendar'].includes(this.active.element.localName)) return;
            if (control.getAttribute('aria-expanded') === 'true' || (event.key === 'ArrowDown' && control.getAttribute('role') === 'combobox')) return;
            const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
            const backwards = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
            if (horizontal) {
                if (typeof control.selectionStart !== 'number' || control.selectionStart !== control.selectionEnd) return;
                if (control.selectionStart !== (backwards ? 0 : control.value.length)) return;
            }
            event.preventDefault(); event.stopPropagation();
            const active = this.active;
            this.session.commitField(active.path);
            this.navigate(active.row,active.column.field,horizontal ? (backwards ? -1 : 1) : {row:backwards ? -1 : 1});
            if (horizontal && this.active && this.active !== active) {
                const target = this.active.element.control;
                if (typeof target.selectionStart === 'number') {
                    const caret = backwards ? target.value.length : 0;
                    target.setSelectionRange(caret,caret);
                }
            }
        };
        this.connect();
        context.sourceNode.rootBuilder.binding.bindingFor(context.sourceNode).track(() => this.dispose());
    }
    connect() {
        this.grid.addEventListener('keydown',this.keydown);
        this.grid.addEventListener('keydown',this.arrowKeydown,true);
        if (this.session && !this.releaseNavigator) this.releaseNavigator = this.session.registerNavigator(this.focusField);
    }
    disconnect() {
        this.close();
        this.grid.removeEventListener('keydown',this.keydown);
        this.grid.removeEventListener('keydown',this.arrowKeydown,true);
        this.releaseNavigator?.(); this.releaseNavigator = null;
    }
    /** The Data path of `field` in the row of key `row`: `#ROW.<field>` of the grid for that row. */
    path(row, field) {
        return this.context.sourceNode.absDatapath(`#ROW.${field}`, {row});
    }
    configure(columns) {
        const editable = columns.filter(column => column.edit);
        if (editable.length) {
            if (this.store().window !== null) throw new Error('Editing requires a fully resident Bag; remote windows are read-only.');
            const owner = this.context.sourceNode;
            this.session = owner.editCollection(owner.absDatapath(owner.getAttr('storepath')));
        }
        const signature = toTytx(editable.map(({field,dtype,edit}) => ({field,dtype,edit})));
        if (signature === this.validationSignature) return;
        this.validationSignature = signature;
        this.columns = editable;
        for (const [path,declaration] of this.declarations) {
            const column = editable.find(column => column.field === declaration.field);
            if (!column) {
                if (this.active?.path === path) this.close();
                this.releaseField(path);
            } else {
                const {tag,options} = this.definition(column);
                if (tag !== declaration.tag) {
                    if (this.active?.path === path) this.close();
                    this.releaseField(path);
                } else {
                    this.control(declaration).setAttr({...Object.fromEntries(Object.keys(declaration.options).map(key => [key,null])),...this.rowOptions(options,this.retained.get(path))});
                    declaration.options = options;
                }
            }
        }
        if (!editable.length) {
            this.releaseValidation?.(); this.releaseValidation = null;
            return;
        }
        if (!this.releaseStatus) this.releaseStatus = this.session.subscribe(() => this.refresh());
        if (!this.releaseNavigator) this.releaseNavigator = this.session.registerNavigator(this.focusField);
        if (!this.releaseValidation) this.releaseValidation = this.session.registerValidationSource(() => this.validationFields());
        else this.session.invalidateValidation();
    }
    definition(column) {
        const options = column.edit === true ? {} : {...column.edit};
        const tag = options.tag ?? ({L:'numberTextBox',R:'numberTextBox',N:'numberTextBox',D:'dateTextBox',H:'timeTextBox',B:'checkBox'}[column.dtype] ?? 'textbox');
        if (column.dtype === 'DHZ' && !options.tag) throw new Error('A datetime column requires an explicitly declared supported editor.');
        delete options.tag;
        return {tag,options:{...options,dtype:column.dtype ?? 'T'}};
    }
    /**
     * The control options of `options` for the row of key `row`: an option holding a `=#ROW` or `^#ROW`
     * pointer (`#ROW`, `#ROW.<field>`, `#ROW?<attr>`, `#ROW.<field>?<attr>`, with any `:` template or
     * expression after it) keeps its prefix and tail, its path becomes the Data path of that row, as legacy
     * GenroPy evaluated `#ROW` edit attributes against the edited row. The control has no row context.
     */
    rowOptions(options, row) {
        const owner = this.context.sourceNode;
        return Object.fromEntries(Object.entries(options).map(([key,value]) => {
            const pointer = pointerTransform(value)?.pointer ?? value, type = owner.pointerType(pointer);
            const bare = type ? pointer.slice(1) : null;
            if (bare !== '#ROW' && !bare?.startsWith('#ROW.') && !bare?.startsWith('#ROW?')) return [key,value];
            return [key,`${type}${owner.absDatapath(pointer,{row})}${value.slice(pointer.length)}`];
        }));
    }
    *validationFields() {
        const owner = this.context.sourceNode;
        this.session.trackValidationDependency(owner.absDatapath(owner.getAttr('structpath')));
        for (const row of this.store().labels()) for (const column of this.columns) {
            // A row deleted while the validation pass runs has no field to declare.
            const bag = this.collection();
            if (!(bag instanceof Bag) || !bag.getNode(row)) continue;
            const path = this.path(row,column.field);
            this.checking.add(path);
            try {
                const declaration = this.declare(row,column,false);
                yield {node:this.control(declaration),release:() => {
                    this.checking.delete(path);
                    if (path !== this.active?.path) this.releaseCleanField(path);
                }};
            } catch (error) { this.checking.delete(path); this.releaseCleanField(path); throw error; }
        }
    }
    open(row, column, cell) {
        if (this.store().window !== null) throw new Error('Editing requires a fully resident Bag; remote windows are read-only.');
        if (this.active?.row === row && this.active.column.field === column.field) { this.active.element.control.focus(); return; }
        this.close();
        const path = this.path(row,column.field), declaration = this.declare(row,column,true);
        const element = this.grid.ownerDocument.getElementById(declaration.id);
        this.active = {row,column,path,...declaration,element};
        this.layer.hidden = false;
        this.position(cell);
        element.control.focus();
    }
    declare(row,column,mount) {
        const owner = this.context.sourceNode, path = this.path(row,column.field);
        if (!this.retained.has(path)) { this.session.retainField(path); this.retained.set(path,row); }
        let declaration = this.declarations.get(path);
        if (!declaration) {
            const {tag,options} = this.definition(column);
            if (!owner.rootBuilder.schemaTag(tag)) throw new Error(`Grid editor requires the ${tag} input collection.`);
            const builder = owner.rootBuilder, id = `grid-cell-${crypto.randomUUID()}`;
            const container = builder.wrapSource(owner).div({node_label:id, slot:'cell-editor'});
            // Unmount the branch before declaring a control: no editor element is constructed.
            if (!mount) builder.binding.renderer.unmountView(sourceTarget(container));
            try {
                const control = sourceTarget(container[tag]({...this.rowOptions(options,row), value:'^'+path, id, width:'100%', margin:'0'}));
                declaration = {id,tag,options,field:column.field};
                const component = this.grid.ownerDocument.defaultView.customElements.get(control._getMeta('render_tag'));
                this.session.registerField(control,component,mount);
                this.declarations.set(path,declaration);
            } catch (error) {
                const node = sourceTarget(container); node.parentBag.popNode(node.label);
                this.releaseCleanField(path);
                throw error;
            }
        } else if (mount) owner.rootBuilder.binding.renderer.mountView(this.container(declaration));
        return declaration;
    }
    /** The editor container of `declaration`: the grid Source child labelled with its id, read at each call. */
    container(declaration) {
        const node = this.context.sourceNode.value.getNode(declaration.id);
        if (!node) throw new Error(`Grid cell editor container ${declaration.id} is missing from the grid Source.`);
        return node;
    }
    /** The editor control of `declaration`: the only child of its container. */
    control(declaration) {
        const nodes = this.container(declaration).value.getNodes();
        if (nodes.length !== 1) throw new Error(`Grid cell editor container ${declaration.id} must hold exactly one control, found ${nodes.length}.`);
        return nodes[0];
    }
    close() {
        const active = this.active;
        this.active = null; this.layer.hidden = true;
        if (active) {
            this.context.sourceNode.rootBuilder.binding.renderer.unmountView(this.container(active));
            this.releaseCleanField(active.path);
        }
    }
    releaseCleanField(path) {
        if (this.checking.has(path)) return;
        const state = this.session.fieldStatus(path);
        if (state.error === null && state.pending === null && state.draft === null && this.retained.has(path)) {
            this.releaseField(path);
        }
    }
    releaseField(path) {
        const declaration = this.declarations.get(path);
        this.declarations.delete(path);
        // The container may already be gone with its grid Source branch; nothing is left to remove then.
        if (declaration && this.context.sourceNode.value.getNode(declaration.id)) this.context.sourceNode.value.popNode(declaration.id);
        this.session.releaseField(path); this.retained.delete(path);
    }
    position(cell = null) {
        if (!this.active) return;
        cell ??= this.cellFor(this.active.row,this.active.column.field);
        if (!cell) { this.close(); return; }
        const rect = cell.getBoundingClientRect(), host = this.grid.control.getBoundingClientRect();
        const viewport = this.grid.shadowRoot.querySelector('.body-viewport').getBoundingClientRect();
        Object.assign(this.layer.style,{
            left:`${rect.left-host.left-this.grid.control.clientLeft}px`,
            top:`${rect.top-host.top-this.grid.control.clientTop}px`,width:`${rect.width}px`
        });
        this.layer.style.setProperty('--grid-editor-height',`${rect.height}px`);
        const maxHeight = cell.style.getPropertyValue('--grid-cell-max-height');
        if (maxHeight) this.layer.style.setProperty('--grid-cell-max-height',maxHeight);
        else this.layer.style.removeProperty('--grid-cell-max-height');
        const editor = this.layer.getBoundingClientRect();
        if (viewport.height && (editor.top < viewport.top || editor.bottom > viewport.bottom || editor.right <= viewport.left || editor.left >= viewport.right)) this.close();
    }
    decorate(tr, row) {
        if (!this.session) return;
        for (const cell of tr.querySelectorAll('td[data-field]')) {
            const state = this.session.fieldStatus(this.path(row,cell.dataset.field));
            cell.classList.toggle('invalid-cell',Boolean(state.error));
            cell.classList.toggle('draft-cell',state.draft !== null);
            if (state.error) { cell.setAttribute('aria-invalid','true'); cell.title = state.error.getNodes().map(n => n.value).join('\n'); }
            else { cell.removeAttribute('aria-invalid'); cell.removeAttribute('title'); }
        }
    }
    /** The value at the store path, read by address at each call and never kept. */
    collection() {
        const owner = this.context.sourceNode;
        return this.context.getStaticData(owner.absDatapath(owner.getAttr('storepath')));
    }
    /**
     * Retained fields follow the row key: a field whose row key left the store is released, and the
     * fields of the keys still present survive a replacement of the Bag at the store path.
     */
    refresh() {
        const bag = this.collection();
        const rows = new Set(bag instanceof Bag ? bag.keys() : []);
        for (const [path,label] of this.retained) if (!rows.has(label)) {
            // Close before releasing: closing unmounts the container, which releasing removes from the Source.
            if (this.active?.row === label) this.close();
            if (this.retained.has(path)) this.releaseField(path);
        }
        for (const path of this.retained.keys()) if (path !== this.active?.path) this.releaseCleanField(path);
        for (const [row,tr] of this.renderedRows()) this.decorate(tr,row);
    }
    dispose() {
        this.releaseValidation?.(); this.releaseValidation = null;
        this.disconnect();
        if (this.session) for (const path of [...this.retained.keys()]) this.releaseField(path);
        this.releaseStatus?.(); this.layer.remove();
    }
}
