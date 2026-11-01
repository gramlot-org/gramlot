/** Select rendered Source descendants in an editor preview without activating them. */
export class SourcePicker {
    #renderer; #root; #canvas; #onSelect; #observer; #selectedPath = null;
    #highlighted = null; #release = null; #disposed = false;
    constructor({renderer, root, onSelect}) {
        if (!root?.parentNode || typeof onSelect !== 'function') throw new TypeError('SourcePicker requires a mounted Source root and onSelect');
        const canvas = renderer.records.get(root.parentNode)?.presentation;
        if (!canvas || canvas.nodeType !== 1) throw new TypeError('SourcePicker requires a mounted preview');
        this.#renderer = renderer; this.#root = root; this.#canvas = canvas; this.#onSelect = onSelect;
        canvas.addEventListener('pointerdown', this, true);
        canvas.addEventListener('click', this, true);
        this.#observer = new canvas.ownerDocument.defaultView.MutationObserver(() => this.#paint());
        this.#observer.observe(canvas, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});
        this.#release = renderer.onDispose(root.parentNode, () => this.dispose());
    }
    handleEvent(event) {
        if (this.#disposed) return;
        const prefix = this.#root.fullpath + '.';
        const record = event.composedPath().map(element => this.#renderer.elements.get(element)).find(item =>
            item?.node.fullpath.startsWith(prefix));
        if (!record) return;
        const editing = event.composedPath().some(element => element.nodeType === 1 && (
            element.matches('input:not([type=button]):not([type=submit]):not([type=reset]):not([type=image]), textarea, select, label') ||
            element.isContentEditable));
        if (!editing) { event.preventDefault(); event.stopImmediatePropagation(); }
        this.#onSelect(record.node);
    }
    select(node) {
        if (this.#disposed) return;
        if (node === null) this.#selectedPath = null;
        else {
            const prefix = this.#root.fullpath + '.';
            if (!node.fullpath.startsWith(prefix)) throw new TypeError('Selected node must be inside the preview Source root');
            this.#selectedPath = node.fullpath.slice(prefix.length);
        }
        this.#paint();
    }
    #paint() {
        if (this.#disposed) return;
        const node = this.#selectedPath ? this.#root.staticValue.getNode(this.#selectedPath) : null;
        const element = node ? this.#renderer.records.get(node)?.presentation : null;
        const next = element?.nodeType === 1 ? element : null;
        if (this.#highlighted !== next) {
            this.#highlighted?.classList.remove('gramlot-source-selected');
            this.#highlighted = next;
        }
        if (next && !next.classList.contains('gramlot-source-selected')) next.classList.add('gramlot-source-selected');
    }
    dispose() {
        if (this.#disposed) return;
        this.#disposed = true; this.#observer.disconnect();
        this.#canvas.removeEventListener('pointerdown', this, true);
        this.#canvas.removeEventListener('click', this, true);
        this.#highlighted?.classList.remove('gramlot-source-selected');
        this.#release?.(); this.#release = null; this.#highlighted = null;
    }
}
