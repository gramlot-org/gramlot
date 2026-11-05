import {Bag} from '@gramlot/gramlot';

/** Identity/caption projection only. The shared tree owns checks and lazy propagation. */
export class CheckBoxTree {
    // Derived index from the last projection: newly loaded codes are still pending
    // until that projection has supplied their paths to the shared tree.
    #knownCodes = new Set();
    constructor(owner, context) {
        this.owner = owner;
        this.element = owner.ownerDocument.createElement('gramlot-tree');
        this.element.setSourceContext({...context, writeParameter:(name, paths) => {
            if (name !== 'checkedPaths' || !owner.pageContext?.isActive()) return;
            const rows = this.options(), byPath = new Map(rows.map(row => [row.path,row.id]));
            const known = this.#knownCodes;
            const selected = (paths || '').split(',').filter(Boolean).map(path => owner.parameters.identifier ? byPath.get(path) : path).filter(code => code !== undefined);
            const old = (owner.readControlValue() || '').split(',').filter(Boolean);
            const codes = old.filter(code => !known.has(code) || selected.includes(code));
            for (const code of selected) if (!codes.includes(code)) codes.push(code);
            const value = codes.join(',') || null;
            if (value !== owner.readControlValue()) owner.acceptTreeValue(value);
        }});
        owner.control.append(this.element);
    }
    options() {
        const {values, identifier, labelAttribute} = this.owner.parameters;
        if (!(values instanceof Bag)) throw new TypeError('hierarchical checkBoxText requires a Bag in values');
        const rows = [], ids = new Set(), ancestors = new Set();
        const visit = (bag, prefix) => {
            if (ancestors.has(bag)) throw new TypeError('Hierarchical options require an acyclic Bag');
            ancestors.add(bag);
            for (const node of bag.getNodes()) {
                const path = prefix ? `${prefix}.${node.label}` : node.label;
                const id = identifier ? node.getAttr(identifier) : path;
                if (typeof id !== 'string' || !id || id.includes(',') || ids.has(id)) {
                    throw new TypeError('Hierarchical option identifiers must be unique comma-free text on every loaded node');
                }
                const caption = labelAttribute ? node.getAttr(labelAttribute) ?? node.label : node.label;
                if (typeof caption !== 'string') throw new TypeError('Hierarchical captions must be text');
                ids.add(id); rows.push({id, path, caption, disabled:node.attr.checked === 'disabled:on' || node.attr.checked === 'disabled:off'});
                // Reading the index must never execute a resolver.
                if (node.staticValue instanceof Bag) visit(node.staticValue, path);
            }
            ancestors.delete(bag);
        };
        visit(values, '');
        return rows;
    }
    project(value) {
        const p = this.owner.parameters;
        const byCode = new Map(this.options().map(row => [row.id,row.path]));
        this.#knownCodes = new Set(byCode.keys());
        const paths = value === null ? null : (value || '').split(',').filter(Boolean)
            .map(code => p.identifier ? byCode.get(code) : code).filter(Boolean).join(',');
        this.element.inert = Boolean(p.disabled || p.readonly);
        this.element.setAttribute('aria-disabled', String(this.element.inert));
        this.element.setStoreBag(p.values);
        this.element.projectAttributes({checkedPaths:paths, checkChildren:p.checkChildren,
            labelAttribute:p.labelAttribute ?? null, hideValues:true});
    }
    focus() { this.element.shadowRoot.querySelector('[role=treeitem]')?.focus(); }
    dispose() { this.element.remove(); }
}
