import {BagCollectionView} from '../stores/bag-collection-view.js';

/** An independent collection view follows an originating grid's filter. */
export class ChartDataView {
    #gridView = null;
    #releaseGrid = null;
    #filterSignature;
    #view;

    constructor(store, gridView) {
        this.#view = new BagCollectionView(store);
        if (gridView) this.follow(gridView);
        this.#view.connect();
    }

    get view() { return this.#view; }

    follow(gridView) {
        if (gridView.path !== this.#view.path || gridView.rowMode !== this.#view.rowMode) {
            throw new TypeError('Chart and grid must use the same collection');
        }
        this.#releaseGrid?.();
        this.#gridView = gridView;
        this.#filterSignature = undefined;
        this.#syncFilter();
        this.#releaseGrid = gridView.subscribe(() => this.#syncFilter());
    }

    #syncFilter() {
        const signature = this.#gridView.filterSignature;
        if (signature === this.#filterSignature) return;
        this.#view.copyFiltersFrom(this.#gridView);
        this.#filterSignature = signature;
    }

    /** The independent view keeps the last accepted filter when the grid closes. */
    detach() {
        this.#releaseGrid?.();
        this.#releaseGrid = null;
        this.#gridView = null;
    }

    dispose() {
        this.detach();
        this.#view.disconnect();
    }
}
