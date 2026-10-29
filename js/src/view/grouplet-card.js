/** Confirmed clearing belongs to Source/Data, never to DOM input scraping. */
import {SourceBag, pointerTransform} from '@genrojs/builders';

export class GroupletCardActions {
    #closed = false;
    #pending = false;
    constructor(binding, element) { this.binding = binding; this.element = element; }
    attach() { this.element.cardActions = this; }
    detach() { this.#closed = true; delete this.element.cardActions; }
    async clear() {
        const {binding, element} = this;
        const allowed = () => !this.#closed && !binding.closed && element.isConnected
            && element.parameters.delitem === true;
        if (this.#pending || !allowed()) return;
        const node = binding.node, source = node.value, root = node.absDatapath('.');
        if (root === null || !(source instanceof SourceBag)) return;
        this.#pending = true;
        try {
            const confirmed = await binding.runtime.askDialog.show(binding, {
                title: 'Clear card fields',
                msg: `Clear the fields of “${element.parameters.title}”? This cannot be undone.`,
            }, {});
            // A refreshed body or a different record requires a fresh confirmation.
            if (confirmed === null || !allowed() || node.value !== source || node.absDatapath('.') !== root) return;
            const fields = new Map();
            const states = new Set();
            const retainStates = card => {
                for (const name of ['collapsed', 'checkbox']) {
                    const pointer = card.getAttr(name);
                    if (card.pointerType(pointer)) states.add(card.absDatapath(pointer));
                }
            };
            retainStates(node);
            const visit = bag => {
                for (const child of bag.getNodes()) {
                    if (child.nodeTag === 'groupletCard') retainStates(child);
                    const pointer = child.getAttr('value');
                    if (!child._getMeta('data_element') && child.pointerType(pointer) === '^' && !pointerTransform(pointer)) {
                        const path = child.absDatapath(pointer);
                        if (path !== null && (root === '' || path.startsWith(`${root}.`))) fields.set(path, {child, pointer});
                    }
                    if (child.staticValue instanceof SourceBag) visit(child.staticValue);
                }
            };
            visit(source);
            for (const [path, {child, pointer}] of fields) {
                if (!allowed() || node.value !== source || node.absDatapath('.') !== root) break;
                if (states.has(path)) continue;
                if (child.getAttr('value') !== pointer || child.absDatapath(pointer) !== path) continue;
                binding.runtime.renderer.html.writeParameter(child, 'value', null);
            }
        } finally { this.#pending = false; }
    }
}
