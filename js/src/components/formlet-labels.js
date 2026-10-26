/** Intrinsic label columns for a formlet's directly slotted fields. */
export class FormletLabels {
    #fields = new Set();
    #observer;
    #frame;
    constructor(formlet) {
        this.formlet = formlet;
        this.window = formlet.ownerDocument.defaultView;
        this.slot = formlet.control.querySelector('slot');
    }
    connect() {
        this.#observer = new this.window.ResizeObserver(this.schedule);
        this.#observer.observe(this.formlet.control);
        this.slot.addEventListener('slotchange', this.schedule);
        this.formlet.addEventListener('gramlot-label-layout', this.schedule);
        this.formlet.ownerDocument.fonts.addEventListener('loadingdone', this.schedule);
        this.schedule();
    }
    disconnect() {
        this.#observer.disconnect();
        this.window.cancelAnimationFrame(this.#frame);
        this.#frame = undefined;
        this.slot.removeEventListener('slotchange', this.schedule);
        this.formlet.removeEventListener('gramlot-label-layout', this.schedule);
        this.formlet.ownerDocument.fonts.removeEventListener('loadingdone', this.schedule);
        for (const field of this.#fields) this.#clear(field);
        this.#fields.clear();
    }
    schedule = () => {
        if (!this.formlet.isConnected || this.#frame !== undefined) return;
        this.#frame = this.window.requestAnimationFrame(() => {
            this.#frame = undefined;
            this.#align();
        });
    };
    #clear(field) {
        delete field.box.dataset.formletAligned;
        field.box.style.removeProperty('--gramlot-formlet-label-width');
    }
    #align() {
        // Labelbox is the capability; nested formlets own their own fields.
        const fields = new Set(this.slot.assignedElements()
            .filter(element => element.labelbox && element.labelbox.box.dataset.position === 'L')
            .map(element => element.labelbox));
        for (const field of this.#fields) if (!fields.has(field)) {
            this.#observer.unobserve(field.fieldLabel);
            this.#clear(field);
        }
        for (const field of fields) {
            field.box.dataset.formletAligned = '';
            if (!this.#fields.has(field)) this.#observer.observe(field.fieldLabel);
        }
        this.#fields = fields;
        const columns = new Map();
        for (const field of fields) {
            if (!field.box.getClientRects().length) continue;
            const host = field.box.getBoundingClientRect();
            const label = field.labelBox.getBoundingClientRect();
            const style = this.window.getComputedStyle(field.labelBox);
            const boxStyle = this.window.getComputedStyle(field.box);
            const gap = parseFloat(boxStyle.columnGap) || 0;
            const labelLeft = field.labelBox.hidden
                ? field.box.getBoundingClientRect().left + parseFloat(boxStyle.paddingLeft) + parseFloat(boxStyle.borderLeftWidth)
                : label.left;
            const inset = labelLeft - host.left + gap;
            const width = field.box.style.getPropertyValue('--gramlot-label-width') ? label.width :
                field.fieldLabel.getBoundingClientRect().width +
                parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) +
                parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
            const column = columns.get(host.left) ?? [];
            column.push({field, inset, width});
            columns.set(host.left, column);
        }
        for (const column of columns.values()) {
            const edge = Math.max(...column.map(({inset, width}) => inset + width));
            for (const {field, inset} of column) {
                field.box.style.setProperty('--gramlot-formlet-label-width', `${edge - inset}px`);
            }
        }
    }
}
