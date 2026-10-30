/** Shared column resize gestures; Data owns field widths, per-grid layout owns the row header. */
export class GridHeaderInteraction {
    #head;
    #control;
    #structure;
    #sort;
    #rowLayout;
    #layoutChanged;
    #suppressClick = false;
    #gesture = null;
    #drag = null;
    constructor(head, control, structure, sort, rowLayout, layoutChanged) {
        this.#head = head;
        this.#control = control;
        this.#structure = structure;
        this.#sort = sort;
        this.#rowLayout = rowLayout;
        this.#layoutChanged = layoutChanged;
    }
    connect() {
        this.#head.addEventListener('click', this.#click);
        this.#head.addEventListener('pointerdown', this.#start);
        this.#head.addEventListener('pointermove', this.#move);
        this.#head.addEventListener('pointerup', this.#finish);
        this.#head.addEventListener('pointercancel', this.#cancel);
        this.#head.addEventListener('lostpointercapture', this.#cancel);
        this.#head.addEventListener('keydown', this.#key);
        this.#head.addEventListener('dragstart', this.#dragStart);
        this.#head.addEventListener('dragover', this.#dragOver);
        this.#head.addEventListener('drop', this.#drop);
        this.#head.addEventListener('dragend', this.#clearDrag);
    }
    disconnect() {
        this.cancel();
        this.#head.removeEventListener('click', this.#click);
        this.#head.removeEventListener('pointerdown', this.#start);
        this.#head.removeEventListener('pointermove', this.#move);
        this.#head.removeEventListener('pointerup', this.#finish);
        this.#head.removeEventListener('pointercancel', this.#cancel);
        this.#head.removeEventListener('lostpointercapture', this.#cancel);
        this.#head.removeEventListener('keydown', this.#key);
        this.#head.removeEventListener('dragstart', this.#dragStart);
        this.#head.removeEventListener('dragover', this.#dragOver);
        this.#head.removeEventListener('drop', this.#drop);
        this.#head.removeEventListener('dragend', this.#clearDrag);
    }
    #click = event => {
        if (this.#suppressClick) { this.#suppressClick = false; return; }
        if (event.target.closest('.column-resize')) return;
        const header = event.target.closest('th[data-field]');
        if (header) this.#sort(header.dataset.field, event.shiftKey);
    };
    #dragStart = event => {
        const header = event.target.closest('th[data-field]');
        if (!header || this.#gesture) { event.preventDefault(); return; }
        this.#suppressClick = true;
        this.#drag = {field:header.dataset.field, node:this.#structure().columnNode(header.dataset.field)};
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', header.textContent);
        header.classList.add('column-dragging');
    };
    #dropTarget(event) {
        const header = event.target.closest('th[data-field]');
        if (!this.#drag || !header) return null;
        const target = this.#structure().columnNode(header.dataset.field);
        if (this.#structure().columnNode(this.#drag.field) !== this.#drag.node ||
            target === this.#drag.node || target.parentBag !== this.#drag.node.parentBag) return null;
        return {header, field:header.dataset.field,
            after:event.clientX > header.getBoundingClientRect().left + header.getBoundingClientRect().width / 2};
    }
    #dragOver = event => {
        const target = this.#dropTarget(event);
        for (const cell of this.#head.querySelectorAll('[data-drop]')) cell.removeAttribute('data-drop');
        if (!target) return;
        event.preventDefault(); event.dataTransfer.dropEffect = 'move';
        target.header.dataset.drop = target.after ? 'after' : 'before';
    };
    #drop = event => {
        const target = this.#dropTarget(event);
        if (!target) return;
        event.preventDefault();
        const field = this.#drag.field;
        this.#clearDrag();
        this.#structure().moveColumn(field, target.field, target.after);
        this.#head.querySelector(`th[data-field="${field}"]`).focus({preventScroll:true});
    };
    #clearDrag = () => {
        this.#drag = null;
        for (const cell of this.#head.querySelectorAll('th')) {
            cell.classList.remove('column-dragging'); cell.removeAttribute('data-drop');
        }
    };
    #target(header) {
        const field = header.dataset.field;
        if (field === undefined) {
            const layout = this.#rowLayout();
            return {identity:layout, width:layout.headerWidth, setWidth:width => {
                layout.setHeaderWidth(width); this.#layoutChanged();
            }};
        }
        const structure = this.#structure(), node = structure.columnNode(field);
        return {identity:node, width:node.getAttr('width'), setWidth:width => structure.setColumnWidth(field, width)};
    }
    #minimum(header) {
        if (header.classList.contains('row-heading')) {
            return Math.max(40, Math.ceil(header.querySelector('.row-number-measure').getBoundingClientRect().width));
        }
        return Number.parseFloat(this.#control.ownerDocument.defaultView.getComputedStyle(this.#control)
            .getPropertyValue('--gramlot-grid-column-min-width')) || 40;
    }
    #start = event => {
        this.#suppressClick = false;
        const handle = event.target.closest('.column-resize');
        if (!handle || event.button !== 0 || this.#gesture) return;
        const header = handle.closest('th');
        const field = header.dataset.field;
        const target = this.#target(header);
        const tables = [...this.#control.querySelectorAll('table')];
        const headers = [...this.#head.querySelectorAll('th[scope=col]')];
        const widths = headers.map(cell => cell.getBoundingClientRect().width);
        this.#gesture = {pointerId:event.pointerId, field, header, identity:target.identity, originalWidth:target.width,
            x:event.clientX, index:headers.indexOf(header), widths, width:header.getBoundingClientRect().width,
            tables:tables.map(table => ({table, width:table.style.width,
                columns:[...table.querySelectorAll('col')].map(col => ({col, width:col.style.width}))}))};
        this.#head.setPointerCapture(event.pointerId);
        this.#control.classList.add('resizing');
        event.preventDefault();
    };
    #move = event => {
        const gesture = this.#gesture;
        if (!gesture || gesture.pointerId !== event.pointerId) return;
        gesture.width = Math.max(this.#minimum(gesture.header), Math.round(gesture.widths[gesture.index] + event.clientX - gesture.x));
        const widths = gesture.widths.map((width, index) => index === gesture.index ? gesture.width : width);
        for (const {table, columns} of gesture.tables) {
            table.style.width = `${widths.reduce((sum, width) => sum + width, 0)}px`;
            columns.forEach(({col}, index) => { col.style.width = `${widths[index]}px`; });
        }
    };
    #finish = event => {
        const gesture = this.#gesture;
        if (!gesture || gesture.pointerId !== event.pointerId) return;
        this.#move(event);
        const current = this.#target(gesture.header);
        this.#suppressClick = true;
        this.cancel();
        // A retargeted/replaced struct or concurrent width edit must win over this gesture.
        if (current.identity !== gesture.identity || current.width !== gesture.originalWidth) return;
        current.setWidth(gesture.width);
        this.#focus(gesture.field);
    };
    #key = event => {
        if (event.key === 'Escape' && this.#gesture) {
            this.cancel(); event.preventDefault(); return;
        }
        const handle = event.target.closest('.column-resize');
        if (!handle && ['Enter', ' '].includes(event.key)) {
            const header = event.target.closest('th[data-field]');
            if (header) { event.preventDefault(); this.#sort(header.dataset.field, event.shiftKey); }
            return;
        }
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        if (!handle) {
            const header = event.target.closest('th[data-field]');
            if (!header || !event.altKey) return;
            const field = header.dataset.field, structure = this.#structure();
            const node = structure.columnNode(field), siblings = node.parentBag.getNodes();
            const target = siblings[siblings.indexOf(node) + (event.key === 'ArrowRight' ? 1 : -1)];
            if (target?.getAttr('tag') === 'cell') {
                structure.moveColumn(field, target.getAttr('field'), event.key === 'ArrowRight');
                this.#head.querySelector(`th[data-field="${field}"]`).focus({preventScroll:true});
            }
            event.preventDefault(); return;
        }
        const header = handle.closest('th');
        const delta = (event.key === 'ArrowRight' ? 1 : -1) * (event.shiftKey ? 1 : 10);
        this.#target(header).setWidth(Math.max(this.#minimum(header), Math.round(header.getBoundingClientRect().width + delta)));
        this.#focus(header.dataset.field);
        event.preventDefault();
    };
    #focus(field) {
        this.#head.querySelector(field === undefined ? '.row-heading .column-resize' : `th[data-field="${field}"] .column-resize`).focus({preventScroll:true});
    }
    #cancel = () => { if (this.#gesture) this.cancel(); };
    cancel() {
        this.#clearDrag();
        const gesture = this.#gesture;
        if (!gesture) return;
        this.#gesture = null;
        for (const {table, width, columns} of gesture.tables) {
            table.style.width = width;
            for (const {col, width} of columns) col.style.width = width;
        }
        this.#control.classList.remove('resizing');
        if (this.#head.hasPointerCapture(gesture.pointerId)) this.#head.releasePointerCapture(gesture.pointerId);
    }
}
