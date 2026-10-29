/** Committed presentation of one grid's rows, attached to its owning Source node. */
export class GridRowLayout {
    #store;
    #heights = new Map();
    bindStore(store) {
        if (store !== this.#store) {
            this.#heights.clear();
            this.#store = store;
        }
    }
    retain(nodes) {
        const current = new Set(nodes);
        for (const node of this.#heights.keys()) if (!current.has(node)) this.#heights.delete(node);
    }
    height(node) { return this.#heights.get(node) ?? null; }
    setHeight(node, height) {
        if (node.parentBag !== this.#store) return;
        if (height === null) this.#heights.delete(node);
        else {
            if (!Number.isFinite(height) || height <= 0) throw new TypeError('Grid row height must be positive pixels');
            this.#heights.set(node, Math.round(height));
        }
    }
}
