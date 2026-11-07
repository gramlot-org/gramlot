import {Bag} from '@gramlot/gramlot';

export const SELECTION_MODES = Object.freeze(['none', 'single', 'multi']);

// Write parameters published on every selection change, each only when declared (legacy names).
const PUBLISHED = ['selectedId', 'selectedIndex', 'selectedLabel', 'selectedPkeys', 'selectedRowidx', 'selectedNodes', 'selectedRowData'];

/**
 * Row selection of one grid (legacy genro_grid.js selection publication). The identity of a row is
 * its node label in both row modes, as the legacy Bag store identifier `nodelabel`. Selected rows are
 * the visible rows of the view: a row leaving the view (filter, deletion) leaves the selection;
 * sorting keeps it.
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
    get current() { return this.#current; }
    isSelected(node) { return this.#selected.has(node); }
    /** Selected rows in view order. */
    get nodes() { return this.#host.view().getRows().filter(node => this.#selected.has(node)); }

    /** Click or keyboard selection of `node`: `toggle` (Ctrl/Cmd) and `range` (Shift) apply in multi mode. */
    select(node, {toggle = false, range = false} = {}) {
        if (this.mode === 'none') return;
        const rows = this.#host.view().getRows();
        if (this.mode === 'multi' && range && this.#anchor !== null && rows.includes(this.#anchor)) {
            const [from, to] = [rows.indexOf(this.#anchor), rows.indexOf(node)].sort((a, b) => a - b);
            this.#apply(new Set(rows.slice(from, to + 1)), node, this.#anchor);
        } else if (this.mode === 'multi' && toggle) {
            const selected = new Set(this.#selected);
            if (selected.has(node)) selected.delete(node); else selected.add(node);
            this.#apply(selected, selected.has(node) ? node : this.nodes.find(row => selected.has(row)) ?? null, node);
        } else this.#apply(new Set([node]), node, node);
    }

    /** Up/Down: move the current row by `step`; `extend` (Shift, multi mode) extends from the anchor. */
    move(step, extend = false) {
        if (this.mode === 'none') return null;
        const rows = this.#host.view().getRows();
        if (!rows.length) return null;
        const index = this.#current === null ? (step > 0 ? -1 : rows.length) : rows.indexOf(this.#current);
        const next = rows[Math.max(0, Math.min(rows.length - 1, index + step))];
        this.select(next, {range:extend});
        return next;
    }

    /** Ctrl/Cmd+A in multi mode: every visible row. */
    selectAll() {
        if (this.mode !== 'multi') return;
        const rows = this.#host.view().getRows();
        this.#apply(new Set(rows), this.#current ?? rows[0] ?? null, this.#anchor ?? rows[0] ?? null);
    }

    /** Keep only visible rows (after a filter, deletion or store replacement); publishes when it changes. */
    prune() {
        // selectionMode 'none' keeps no selection.
        const visible = new Set(this.mode === 'none' ? [] : this.#host.view().getRows());
        if ([...this.#selected].every(node => visible.has(node)) && (this.#current === null || visible.has(this.#current))) return;
        const selected = new Set([...this.#selected].filter(node => visible.has(node)));
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
        const store = this.#host.store(), view = this.#host.view(), nodes = this.nodes, current = this.#current;
        const idx = current === null ? -1 : view.getRows().indexOf(current);
        const selectedId = current === null ? null : current.label;
        const selectedPkeys = nodes.map(node => node.label);
        const resident = store.getRows();
        const values = {
            selectedId, selectedIndex:idx < 0 ? null : idx, selectedLabel:selectedId, selectedPkeys,
            selectedRowidx:nodes.map(node => resident.indexOf(node)).join(','),
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
