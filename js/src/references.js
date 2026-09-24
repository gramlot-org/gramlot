/** Opaque references to mounted Source nodes and their DOM elements. */
import {SourceBag} from '@jsr/genro__builders';

export class References {
    constructor(sourceRoot = null) { this.entries = new Map(); this.sourceRoot = sourceRoot; }
    validate(block, excluded = new Set()) {
        const references = new Map();
        const walk = bag => {
            for (const node of bag.getNodes()) {
                const id = node.getAttr('__ref');
                if (id) {
                    if (references.has(id)) throw new Error('Duplicate Source reference');
                    const mounted = this.entries.get(id);
                    if (block !== this.sourceRoot && mounted && mounted.node !== node && !excluded.has(mounted.node)) {
                        throw new Error('Duplicate Source reference');
                    }
                    references.set(id, node);
                }
                if (node.value instanceof SourceBag) walk(node.value);
            }
        };
        walk(block);
    }
    register(node, element) {
        const id = node.getAttr('__ref');
        if (!id) return;
        if (this.entries.has(id)) throw new Error(`Duplicate Source reference: ${id}`);
        this.entries.set(id, {node, dom: element});
    }
    remove(node) {
        for (const [id, entry] of this.entries) {
            if (entry.node === node) this.entries.delete(id);
        }
    }
    resolve(reference) {
        if (!reference || !['node', 'dom'].includes(reference.kind)) {
            throw new TypeError('Expected a node or DOM reference');
        }
        const entry = this.entries.get(reference.$gramlotRef);
        if (!entry) throw new Error('Source reference is not mounted');
        return entry[reference.kind];
    }
}
