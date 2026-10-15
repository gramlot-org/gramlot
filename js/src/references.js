/* @ts-self-types="./references.d.ts" */
/**
 * Opaque references to mounted Source nodes and their DOM elements.
 *
 * @module
 */
import {SourceBag, SourceBagNode, sourceTarget} from '@genrojs/builders';
import {Bag} from '@genrojs/bag';

/** Live references have meaning only in their owning page, never on the wire. */
export function assertTransportData(value, ancestors = new Set()) {
    if (!value || typeof value !== 'object') return;
    const nodeClass = value.ownerDocument?.defaultView?.Node ?? value.defaultView?.Node;
    if (sourceTarget(value) instanceof SourceBagNode || (nodeClass && value instanceof nodeClass)) {
        throw new TypeError('Live Source/DOM references cannot cross a transport boundary');
    }
    if (ancestors.has(value)) throw new TypeError('Transport data cannot contain circular references');
    ancestors.add(value);
    const children = value instanceof Bag
        ? value.getNodes().flatMap(node => [node.staticValue, node.getAttr()]) : Object.values(value);
    for (const child of children) assertTransportData(child, ancestors);
    ancestors.delete(value);
}

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
    /** Resolve only directly authored descriptors; message payloads are not expressions. */
    resolveArguments(attrs) {
        return Object.fromEntries(Object.entries(attrs).map(([name, value]) => [name,
            value && typeof value === 'object' && Object.hasOwn(value, '$gramlotRef')
                ? this.resolve(value) : value]));
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
