import {Bag} from '@gramlot/gramlot';

export const SELECTION_MODES = Object.freeze(['none', 'single', 'multi']);

// Write parameters published on every selection change, each only when declared (legacy names).
const PUBLISHED = ['selectedId', 'selectedIndex', 'selectedLabel', 'selectedPkeys', 'selectedRowidx', 'selectedNodes', 'selectedRowData'];

/**
 * Row selection of one grid (legacy genro_grid.js selection publication). The identity of a row is
 * its key (node label) in both row modes, as the legacy Bag store identifier `nodelabel`: the
 * selection keeps only keys, never row nodes. Selected rows are the visible rows of the view: a row
 * leaving the view (filter, deletion) leaves the selection; sorting and a replacement of the Bag at
 * the store path keep the keys still visible.
 */
export class GridSelection {
    #context;
    #host;
    #selected = new Set();
    #current = null;
    #anchor = null;

    /** `host` gives `view()`, `store()` (BagCollectionStore), `mode()` and `rowData(node)` (plain field values). */
    constructor(context, host) {
        this.#context = context;
        this.#host = host;
    }

    get source() { return this.#context.sourceNode; }
    get mode() { return this.#host.mode(); }
    /** The key of the current row, or null. */
    get current() { return this.#current; }
    isSelected(label) { return this.#selected.has(label); }
    /** Selected rows in view order. */
    get nodes() { return this.#host.view().getRows().filter(node => this.#selected.has(node.label)); }

    /** Click or keyboard selection of the row of key `label`: `toggle` (Ctrl/Cmd) and `range` (Shift) apply in multi mode. */
    select(label, {toggle = false, range = false} = {}) {
        if (this.mode === 'none') return;
        const labels = this.#host.view().getRows().map(row => row.label);
        if (this.mode === 'multi' && range && this.#anchor !== null && labels.includes(this.#anchor)) {
            const [from, to] = [labels.indexOf(this.#anchor), labels.indexOf(label)].sort((a, b) => a - b);
            this.#apply(new Set(labels.slice(from, to + 1)), label, this.#anchor);
        } else if (this.mode === 'multi' && toggle) {
            const selected = new Set(this.#selected);
            if (selected.has(label)) selected.delete(label); else selected.add(label);
            this.#apply(selected, selected.has(label) ? label : labels.find(key => selected.has(key)) ?? null, label);
        } else this.#apply(new Set([label]), label, label);
    }

    /** Up/Down: move the current row by `step`; `extend` (Shift, multi mode) extends from the anchor. Gives the key of the new current row. */
    move(step, extend = false) {
        if (this.mode === 'none') return null;
        const labels = this.#host.view().getRows().map(row => row.label);
        if (!labels.length) return null;
        const index = this.#current === null ? (step > 0 ? -1 : labels.length) : labels.indexOf(this.#current);
        const next = labels[Math.max(0, Math.min(labels.length - 1, index + step))];
        this.select(next, {range:extend});
        return next;
    }

    /** Ctrl/Cmd+A in multi mode: every visible row. */
    selectAll() {
        if (this.mode !== 'multi') return;
        const labels = this.#host.view().getRows().map(row => row.label);
        this.#apply(new Set(labels), this.#current ?? labels[0] ?? null, this.#anchor ?? labels[0] ?? null);
    }

    /** Keep only visible rows (after a filter, deletion or store replacement); publishes when it changes. */
    prune() {
        // selectionMode 'none' keeps no selection.
        const visible = new Set(this.mode === 'none' ? [] : this.#host.view().getRows().map(row => row.label));
        if ([...this.#selected].every(label => visible.has(label)) && (this.#current === null || visible.has(this.#current))) return;
        const selected = new Set([...this.#selected].filter(label => visible.has(label)));
        this.#apply(selected, visible.has(this.#current) ? this.#current : null, visible.has(this.#anchor) ? this.#anchor : null);
    }

    /**
     * `.selectionLength` is relative to the datapath context of the grid (legacy genro_grid.js). A grid
     * with no `datapath` on itself or on an ancestor has no relative Data place, so it does not write it.
     */
    get #writesLength() { return this.source.attributeOwnerNode('datapath') !== null; }

    /** The absolute Data paths this grid publishes the selection to. */
    paths() {
        const names = Object.keys(this.source.getAttr()).filter(name => PUBLISHED.includes(name) || name.startsWith('selected_'));
        const paths = names.map(name => this.source.absDatapath(this.source.getAttr(name)));
        return this.#writesLength ? [this.source.absDatapath('.selectionLength'), ...paths] : paths;
    }

    #apply(selected, current, anchor) {
        this.#selected = selected; this.#current = current; this.#anchor = anchor;
        this.publish();
    }

    /** Publish the selection to the declared Data paths, `.selectionLength` (with a datapath context) and `onSelectedRow`. */
    publish() {
        const store = this.#host.store(), rows = this.#host.view().getRows();
        const nodes = rows.filter(node => this.#selected.has(node.label));
        const idx = this.#current === null ? -1 : rows.findIndex(node => node.label === this.#current);
        const current = idx < 0 ? null : rows[idx];
        const selectedId = this.#current;
        const selectedPkeys = nodes.map(node => node.label);
        const resident = store.getRows().map(node => node.label);
        const values = {
            selectedId, selectedIndex:idx < 0 ? null : idx, selectedLabel:selectedId, selectedPkeys,
            selectedRowidx:nodes.map(node => resident.indexOf(node.label)).join(','),
            selectedNodes:() => {
                const bag = new Bag();
                for (const node of nodes) bag.setItem(node.label, null, this.#host.rowData(node));
                return bag;
            },
            selectedRowData:() => current === null ? null : new Bag(this.#host.rowData(current)),
        };
        for (const name of PUBLISHED) {
            if (this.source.getAttr(name) == null) continue;
            const value = typeof values[name] === 'function' ? values[name]() : values[name];
            this.#context.writeParameter(name, value);
            // Legacy: the selectedNodes Data node carries the row count as attribute `count`.
            if (name === 'selectedNodes') this.source.rootBuilder.binding.data.getNode(this.source.absDatapath(this.source.getAttr(name))).setAttr({count:nodes.length});
        }
        for (const name of Object.keys(this.source.getAttr())) {
            if (!name.startsWith('selected_')) continue;
            const field = name.slice('selected_'.length);
            this.#context.writeParameter(name, [...new Set(nodes.map(node => store.value(node, field)))].join(','));
        }
        if (this.#writesLength && this.source.getRelativeData('.selectionLength') !== nodes.length) this.source.setRelativeData('.selectionLength', nodes.length);
        this.#context.publish('onSelectedRow', {idx, selectedId, selectedPkeys});
    }
}
