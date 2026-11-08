/**
 * Per-grid row geometry. A row is identified by its key (node label): heights survive sorting,
 * filtering and a replacement of the Bag at the store path for the rows still present.
 */
export class GridRowLayout {
    #present = new Set();
    #window = null;
    setWindow(info) {
        if (info !== null && (!Number.isSafeInteger(info.start) || info.start < 0
                || !Number.isSafeInteger(info.total) || info.total < info.start)) {
            throw new TypeError('Invalid grid window');
        }
        this.#window = info;
        this.#dirty = true;
    }
    #headerWidth = null;
    get headerWidth() { return this.#headerWidth; }
    setHeaderWidth(width) {
        if (!Number.isFinite(width) || width <= 0) throw new TypeError('Grid row header width must be positive pixels');
        this.#headerWidth = Math.round(width);
    }
    #heights = new Map();
    #measured = new Map();
    #labels = [];
    #offsets = [0];
    #dirty = true;
    #estimate = 32;
    /** Keep the geometry of the resident row keys `labels` only. */
    retain(labels) {
        this.#present = new Set(labels);
        for (const map of [this.#heights, this.#measured]) {
            for (const label of map.keys()) if (!this.#present.has(label)) map.delete(label);
        }
        this.#dirty = true;
    }
    height(label) { return this.#heights.get(label) ?? null; }
    setHeight(label, height) {
        if (!this.#present.has(label)) return;
        if (height === null) this.#heights.delete(label);
        else {
            if (!Number.isFinite(height) || height <= 0) throw new TypeError('Grid row height must be positive pixels');
            this.#heights.set(label, Math.round(height));
        }
        this.forget(label);
    }
    /** The row keys of the view, in view order. */
    setRows(labels) { this.#labels = [...labels]; this.#dirty = true; }
    resetMeasurements() { this.#measured.clear(); this.#dirty = true; }
    forget(label) { this.#measured.delete(label); this.#dirty = true; }
    measure(label, height) {
        // Hidden/unlaid-out rows have no usable measurement yet.
        if (height <= 0 || this.#measured.get(label) === height) return false;
        this.#measured.set(label, height);
        this.#dirty = true;
        return true;
    }
    #index() {
        if (!this.#dirty) return;
        // The smallest observed natural row gives a theme-derived estimate for
        // unseen rows. Explicit heights and measured wrapped rows take priority.
        let natural = Infinity;
        for (const [label, height] of this.#measured) if (!this.#heights.has(label)) natural = Math.min(natural, height);
        if (natural !== Infinity) this.#estimate = natural;
        this.#offsets = [0];
        for (const label of this.#labels) this.#offsets.push(this.#offsets.at(-1) +
            (this.#measured.get(label) ?? Math.max(this.#heights.get(label) ?? 0, this.#estimate)));
        this.#dirty = false;
    }
    offset(index) {
        this.#index();
        if (!this.#window) return this.#offsets[index];
        const local = index - this.#window.start;
        if (local <= 0) return index * this.#estimate;
        if (local <= this.#labels.length) return this.#window.start * this.#estimate + this.#offsets[local];
        return index * this.#estimate + this.#offsets.at(-1) - this.#labels.length * this.#estimate;
    }
    get count() { return this.#window?.total ?? this.#labels.length; }
    get totalHeight() { return this.offset(this.count); }
    indexAt(position) {
        this.#index();
        let low = 0, high = this.count;
        while (low < high) {
            const middle = (low + high) >>> 1;
            if (this.offset(middle + 1) <= position) low = middle + 1;
            else high = middle;
        }
        return Math.min(low, Math.max(0, this.count - 1));
    }
    window(top, height) {
        this.#index();
        const margin = Math.max(height, this.#estimate * 8);
        return {start: this.indexAt(Math.max(0, top - margin)),
            end: Math.min(this.count, this.indexAt(top + height + margin) + 1)};
    }
}
