/** PoC row-header gestures, with preview separated from Source-owned heights. */
export class GridRowInteraction {
    #body;
    #control;
    #layout;
    #nodeForRow;
    #gesture = null;
    #drag = null;
    #store;
    #dragEnabled;
    constructor(body, control, layout, nodeForRow, store, dragEnabled) {
        this.#body = body;
        this.#control = control;
        this.#layout = layout;
        this.#nodeForRow = nodeForRow;
        this.#store = store;
        this.#dragEnabled = dragEnabled;
    }
    connect() {
        this.#body.addEventListener('pointerdown', this.#start);
        this.#body.addEventListener('pointermove', this.#move);
        this.#body.addEventListener('pointerup', this.#finish);
        this.#body.addEventListener('pointercancel', this.#cancel);
        this.#body.addEventListener('lostpointercapture', this.#cancel);
        this.#body.addEventListener('keydown', this.#key);
        this.#body.addEventListener('dblclick', this.#reset);
        this.#body.addEventListener('dragstart', this.#dragStart);
        this.#body.addEventListener('dragover', this.#dragOver);
        this.#body.addEventListener('dragleave', this.#dragLeave);
        this.#body.addEventListener('drop', this.#drop);
        this.#body.addEventListener('dragend', this.#dragEnd);
    }
    disconnect() {
        this.cancel();
        this.cancelDrag();
        this.#body.removeEventListener('pointerdown', this.#start);
        this.#body.removeEventListener('pointermove', this.#move);
        this.#body.removeEventListener('pointerup', this.#finish);
        this.#body.removeEventListener('pointercancel', this.#cancel);
        this.#body.removeEventListener('lostpointercapture', this.#cancel);
        this.#body.removeEventListener('keydown', this.#key);
        this.#body.removeEventListener('dblclick', this.#reset);
        this.#body.removeEventListener('dragstart', this.#dragStart);
        this.#body.removeEventListener('dragover', this.#dragOver);
        this.#body.removeEventListener('dragleave', this.#dragLeave);
        this.#body.removeEventListener('drop', this.#drop);
        this.#body.removeEventListener('dragend', this.#dragEnd);
    }
    #dragStart = event => {
        const row = event.target.closest('tr');
        const node = this.#nodeForRow(row);
        if (!this.#dragEnabled() || !node || this.#gesture || event.target.closest('.row-height-handle')) {
            event.preventDefault(); return;
        }
        this.#drag = {node, bag:this.#store().bag};
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', node.label);
        row.classList.add('row-dragging');
    };
    #dropTarget(event) {
        if (!this.#drag || !this.#dragEnabled()) return null;
        const {node, bag} = this.#drag;
        const row = event.target.closest('tr'), target = this.#nodeForRow(row);
        if (!target || target === node || this.#store().bag !== bag || node.parentBag !== bag || target.parentBag !== bag) return null;
        const box = row.getBoundingClientRect();
        return {row, target, after:event.clientY > box.top + box.height/2};
    }
    #clearMarker() {
        for (const row of this.#body.querySelectorAll('[data-row-drop]')) row.removeAttribute('data-row-drop');
    }
    #dragOver = event => {
        this.#clearMarker();
        const target = this.#dropTarget(event);
        if (!target) return;
        event.preventDefault(); event.dataTransfer.dropEffect = 'move';
        target.row.dataset.rowDrop = target.after ? 'after' : 'before';
    };
    #dragLeave = event => {
        if (!this.#body.contains(event.relatedTarget)) this.#clearMarker();
    };
    #drop = event => {
        const target = this.#dropTarget(event);
        if (!target) return;
        event.preventDefault(); event.stopPropagation();
        const {node} = this.#drag;
        this.cancelDrag();
        this.#store().moveRow(node, target.target, target.after);
    };
    #dragEnd = () => { this.cancelDrag(); };
    cancelDrag() {
        this.#drag = null;
        this.#clearMarker();
        for (const row of this.#body.querySelectorAll('.row-dragging')) row.classList.remove('row-dragging');
    }
    #target(event) {
        const handle = event.target.closest('.row-height-handle');
        if (!handle) return null;
        const row = handle.closest('tr');
        const node = this.#nodeForRow(row);
        return node ? {handle, row, node} : null;
    }
    project(row, node) {
        const height = this.#layout().height(node);
        row.style.height = height === null ? '' : `${height}px`;
    }
    #value(row) {
        const handle = row.querySelector('.row-height-handle');
        if (handle) handle.setAttribute('aria-valuenow', String(Math.round(row.getBoundingClientRect().height)));
    }
    #start = event => {
        const target = this.#target(event);
        if (!target || event.button !== 0 || this.#gesture) return;
        const {row} = target;
        const height = row.getBoundingClientRect().height;
        const original = row.style.height;
        // A table row cannot be shorter than its contents; measure that same native layout.
        row.style.height = '';
        const minimum = row.getBoundingClientRect().height;
        row.style.height = original;
        this.#gesture = {...target, pointerId:event.pointerId, y:event.clientY, height, minimum, preview:height};
        target.handle.focus({preventScroll:true});
        target.handle.setPointerCapture(event.pointerId);
        this.#control.classList.add('resizing-row');
        event.preventDefault();
    };
    #move = event => {
        const gesture = this.#gesture;
        if (!gesture || gesture.pointerId !== event.pointerId) return;
        gesture.preview = Math.max(gesture.minimum, Math.round(gesture.height + event.clientY - gesture.y));
        gesture.row.style.height = `${gesture.preview}px`;
        this.#value(gesture.row);
    };
    #finish = event => {
        const gesture = this.#gesture;
        if (!gesture || gesture.pointerId !== event.pointerId) return;
        this.#move(event);
        this.cancel();
        if (this.#nodeForRow(gesture.row) !== gesture.node || gesture.preview === gesture.height) return;
        this.#layout().setHeight(gesture.node, gesture.preview);
        this.project(gesture.row, gesture.node);
        this.#value(gesture.row);
    };
    #key = event => {
        if (event.key === 'Escape' && (this.#gesture || this.#drag)) {
            this.cancel(); this.cancelDrag(); event.preventDefault(); return;
        }
        const target = this.#target(event);
        if (!target || !['ArrowUp','ArrowDown','Home'].includes(event.key)) return;
        this.cancel();
        let height = null;
        if (event.key !== 'Home') {
            const current = target.row.getBoundingClientRect().height;
            target.row.style.height = '';
            const minimum = target.row.getBoundingClientRect().height;
            height = Math.max(minimum, current + (event.key === 'ArrowDown' ? 10 : -10));
        }
        this.#layout().setHeight(target.node, height);
        this.project(target.row, target.node);
        this.#value(target.row);
        event.preventDefault();
    };
    #reset = event => {
        const target = this.#target(event);
        if (!target) return;
        this.cancel();
        this.#layout().setHeight(target.node, null);
        this.project(target.row, target.node);
        this.#value(target.row);
        event.preventDefault();
    };
    #cancel = () => { this.cancel(); };
    cancel() {
        const gesture = this.#gesture;
        if (!gesture) return;
        this.#gesture = null;
        this.project(gesture.row, gesture.node);
        this.#control.classList.remove('resizing-row');
        if (gesture.handle.hasPointerCapture(gesture.pointerId)) gesture.handle.releasePointerCapture(gesture.pointerId);
    }
}
