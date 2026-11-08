import {Bag} from '@gramlot/gramlot';

/** Identity/caption projection only. The shared tree owns checks and lazy propagation. */
export class CheckBoxTree {
    // Paths of the loaded options at the last projection: a path the tree cannot reach is kept.
    #knownPaths = new Set();
    constructor(owner, context) {
        this.owner = owner;
        this.element = owner.ownerDocument.createElement('gramlot-tree');
        // The inner tree has no Source node: it reads the host's `values` address at each use. Its check
        // list is the control value: the `checkedPaths` of the tree, or with an identifier its
        // `checked_<identifier>`, which the tree reads and writes through the control at every draw.
        this.element.setSourceContext({...context, treeStore:() => context.getStaticData(context.attrDatapath('values')), writeParameter:(name, paths) => {
            if (name !== 'checkedPaths' || !owner.pageContext?.isActive()) return;
            const selected = (paths || '').split(',').filter(Boolean);
            const old = (owner.readControlValue() || '').split(',').filter(Boolean);
            const codes = old.filter(code => !this.#knownPaths.has(code) || selected.includes(code));
            for (const code of selected) if (!codes.includes(code)) codes.push(code);
            const value = codes.join(',') || null;
            if (value !== owner.readControlValue()) owner.acceptTreeValue(value);
        },
        readRelativeData:() => owner.readControlValue(),
        setRelativeData:(_path, codes) => {
            if (owner.pageContext?.isActive() && (codes || null) !== owner.readControlValue()) owner.acceptTreeValue(codes || null);
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
        this.#knownPaths = new Set(this.options().map(row => row.path));
        this.element.inert = Boolean(p.disabled || p.readonly);
        this.element.setAttribute('aria-disabled', String(this.element.inert));
        const checks = p.identifier ? {[`checked_${p.identifier}`]:'value'} : {checkedPaths:value};
        this.element.projectAttributes({...checks, checkChildren:p.checkChildren,
            labelAttribute:p.labelAttribute ?? null, hideValues:true});
    }
    focus() { this.element.shadowRoot.querySelector('[role=treeitem]')?.focus(); }
    dispose() { this.element.remove(); }
}
