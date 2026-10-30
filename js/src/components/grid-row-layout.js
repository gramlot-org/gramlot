/** Per-grid row geometry. BagNode identity survives sorting and filtering. */
export class GridRowLayout {
    #store;
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
    #nodes = [];
    #offsets = [0];
    #dirty = true;
    #estimate = 32;
    bindStore(store) {
        if (store !== this.#store) {
            this.#heights.clear(); this.resetMeasurements();
            this.#store = store;
        }
    }
    retain(nodes) {
        const current = new Set(nodes);
        for (const map of [this.#heights, this.#measured]) {
            for (const node of map.keys()) if (!current.has(node)) map.delete(node);
        }
        this.#dirty = true;
    }
    height(node) { return this.#heights.get(node) ?? null; }
    setHeight(node, height) {
        if (node.parentBag !== this.#store) return;
        if (height === null) this.#heights.delete(node);
        else {
            if (!Number.isFinite(height) || height <= 0) throw new TypeError('Grid row height must be positive pixels');
            this.#heights.set(node, Math.round(height));
        }
        this.forget(node);
    }
    setRows(nodes) { this.#nodes = nodes; this.#dirty = true; }
    resetMeasurements() { this.#measured.clear(); this.#dirty = true; }
    forget(node) { this.#measured.delete(node); this.#dirty = true; }
    measure(node, height) {
        // Hidden/unlaid-out rows have no usable measurement yet.
        if (height <= 0 || this.#measured.get(node) === height) return false;
        this.#measured.set(node, height);
        this.#dirty = true;
        return true;
    }
    #index() {
        if (!this.#dirty) return;
        // The smallest observed natural row gives a theme-derived estimate for
        // unseen rows. Explicit heights and measured wrapped rows take priority.
        let natural = Infinity;
        for (const [node, height] of this.#measured) if (!this.#heights.has(node)) natural = Math.min(natural, height);
        if (natural !== Infinity) this.#estimate = natural;
        this.#offsets = [0];
        for (const node of this.#nodes) this.#offsets.push(this.#offsets.at(-1) +
            (this.#measured.get(node) ?? Math.max(this.#heights.get(node) ?? 0, this.#estimate)));
        this.#dirty = false;
    }
    offset(index) {
        this.#index();
        if (!this.#window) return this.#offsets[index];
        const local = index - this.#window.start;
        if (local <= 0) return index * this.#estimate;
        if (local <= this.#nodes.length) return this.#window.start * this.#estimate + this.#offsets[local];
        return index * this.#estimate + this.#offsets.at(-1) - this.#nodes.length * this.#estimate;
    }
    get count() { return this.#window?.total ?? this.#nodes.length; }
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
