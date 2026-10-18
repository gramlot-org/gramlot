/** Target-owned inspector edits and their reversible Source/Data operations. */
export class InspectorHistory {
    #undo = [];
    #redo = [];
    #references = new WeakMap();
    constructor(gramlot) {
        this.gramlot = gramlot;
        this.Source = gramlot.src.source.constructor;
        this.Bag = gramlot.data.constructor;
    }
    get state() { return {undo: this.#undo.at(-1)?.label ?? '', redo: this.#redo.at(-1)?.label ?? ''}; }
    clear() { this.#undo = []; this.#redo = []; }
    #ref(node) {
        if (!this.#references.has(node)) this.#references.set(node, {node});
        return this.#references.get(node);
    }
    #bind(ref, node) { ref.node = node; this.#references.set(node, ref); }
    #capture(value) {
        if (!(value instanceof this.Bag)) return value;
        return value.getNodes().map(node => [this.#ref(node), node.nodeTag, node.resolver,
            Object.entries(node.getAttr()).sort(([a], [b]) => a.localeCompare(b)),
            this.#capture(node.getValue(true))]);
    }
    #equal(a, b) {
        return Object.is(a, b) || (Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => this.#equal(v, b[i])));
    }
    #commit(label, capture, redo, undo) {
        const before = capture();
        let error;
        try { redo(); } catch (caught) { error = caught; }
        const after = capture();
        if (!this.#equal(before, after)) {
            this.#undo.push({label, capture, before, after, undo, redo});
            this.#redo = [];
        }
        if (error) throw error;
    }
    #step(from, to, direction, expected, result) {
        const action = from.at(-1);
        if (!action) return;
        if (this.gramlot.state === 'disposed') throw new Error('Inspected page disconnected');
        if (!this.#equal(action.capture(), action[expected])) throw new Error('The target changed outside the inspector. Undo/Redo would overwrite those changes.');
        let error;
        try { action[direction](); } catch (caught) { error = caught; }
        if (this.#equal(action.capture(), action[result])) { from.pop(); to.push(action); }
        else if (!error) error = new Error('The application changed the target during Undo/Redo.');
        if (error) throw error;
    }
    undo() { this.#step(this.#undo, this.#redo, 'undo', 'after', 'before'); }
    redo() { this.#step(this.#redo, this.#undo, 'redo', 'before', 'after'); }
    edit(node, attrs, value, changeAttrs, changeValue) {
        const ref = this.#ref(node), oldAttrs = {...node.getAttr()}, oldValue = node.getValue(true);
        const capture = () => [ref.node.parentBag, this.#captureNode(ref.node)];
        const write = (attributes, content) => {
            if (changeAttrs) ref.node.setAttr(attributes, true, false, false);
            if (changeValue) ref.node.setValue(content);
        };
        this.#commit('Edit value or attributes', capture, () => write(attrs, value), () => write(oldAttrs, oldValue));
    }
    #captureNode(node) {
        return [node.resolver, Object.entries(node.getAttr()).sort(([a], [b]) => a.localeCompare(b)), this.#capture(node.getValue(true))];
    }
    #sourceCapture = () => this.#capture(this.gramlot.src.source);
    #node(path) {
        if (typeof path !== 'string' || !path) throw new Error('Select a Source node');
        const node = this.gramlot.src.source.getNode(path);
        if (!node || node.resolver) throw new Error('Source node is missing or deferred');
        return node;
    }
    #removable(node) {
        if (node.parentBag === this.gramlot.src.source) throw new Error('The page Source root cannot be removed or moved');
    }
    #saved(node) {
        return {ref: this.#ref(node), label: node.label, tag: node.nodeTag, value: node.getValue(true), attrs: {...node.getAttr()}};
    }
    #restore(saved, bag, index) {
        if (bag.getNode(saved.label)) throw new Error(`Source label already exists: ${saved.label}`);
        try {
            bag.setItem(saved.label, saved.value, saved.attrs, index, false, false, 'inspector', false, true, null, saved.tag);
        } finally {
            // A subscriber can throw after insertion. Keep the reference on the actual node.
            const inserted = bag.getNode(saved.label);
            if (inserted) this.#bind(saved.ref, inserted);
        }
    }
    #parentState(parent) { return {value: parent.getValue(true), attrs: {...parent.getAttr()}}; }
    #setParent(parent, state) {
        parent.setValue(state.value, true, state.attrs, false);
        parent.setAttr(state.attrs, true, false, false);
    }
    childFields(parent) {
        const specifications = parent._getMeta('gramlot_component')?.childParameters ?? {};
        return Object.entries(specifications).filter(([, spec]) => spec.required).map(([name, spec]) => {
            const children = parent.getValue(true);
            const used = spec.unique && children instanceof this.Source
                ? children.getNodes().map(child => child.getAttr(name)) : [];
            return {name, choices: spec.enum.filter(value => !used.includes(value))};
        });
    }
    validateChild(parent, attrs, moving = null) {
        const specifications = parent._getMeta('gramlot_component')?.childParameters ?? {};
        for (const [name, spec] of Object.entries(specifications)) {
            const value = attrs[name];
            if (spec.required && value == null) throw new Error(`Choose ${name} before inserting the child`);
            if (spec.enum && value != null && !spec.enum.includes(value)) throw new Error(`Invalid ${name}: ${value}`);
            const children = parent.getValue(true);
            if (spec.unique && children instanceof this.Source && children.getNodes().some(child => child !== moving && child.getAttr(name) === value)) {
                throw new Error(`${name} is already in use: ${value}`);
            }
        }
    }
    catalog(path) {
        const node = this.#node(path), builder = node.builder;
        return Object.entries(builder.schema).filter(([, info]) => !info._meta?.data_element && !info._meta?.subbuilder && !info._meta?.container)
            .map(([tag, info]) => ({tag, kind: info._meta?.gramlot_component ? 'component' : 'html', fields: this.childFields(node)}));
    }
    insert(path, requestedTag, attrs = {}) {
        const parent = this.#node(path), builder = parent.builder;
        const tag = builder.schemaTag(requestedTag);
        if (!this.catalog(path).some(entry => entry.tag === tag)) throw new Error('Choose an available component or HTML tag');
        this.validateChild(parent, attrs);
        const previous = this.#parentState(parent), parentRef = this.#ref(parent);
        let saved, promoted;
        const redo = () => {
            if (saved) {
                if (!(previous.value instanceof this.Source)) this.#setParent(parentRef.node, promoted);
                this.#restore(saved, parentRef.node.getValue(true), parentRef.node.getValue(true).getNodes().length);
                return;
            }
            const existing = previous.value instanceof this.Source ? new Set(previous.value.getNodes()) : new Set();
            try { builder.commandOnNode(parentRef.node, tag, null, attrs); }
            finally {
                const body = parentRef.node.getValue(true);
                if (body instanceof this.Source) {
                    const added = body.getNodes().find(node => !existing.has(node));
                    if (added) { saved = this.#saved(added); promoted = this.#parentState(parentRef.node); }
                }
            }
        };
        const undo = () => {
            if (saved) saved.ref.node.parentBag.popNode(saved.ref.node.label, 'inspector');
            if (!(previous.value instanceof this.Source)) this.#setParent(parentRef.node, previous);
        };
        this.#commit('Add element', this.#sourceCapture, redo, undo);
        return `${path}.${saved.label}`;
    }
    remove(path) {
        const node = this.#node(path); this.#removable(node);
        const saved = this.#saved(node), bag = node.parentBag, index = bag.getNodes().indexOf(node);
        this.#commit('Remove branch', this.#sourceCapture,
            () => saved.ref.node.parentBag.popNode(saved.label, 'inspector'),
            () => this.#restore(saved, bag, index));
        return path.slice(0, path.lastIndexOf('.'));
    }
    move(path, destination, placement) {
        if (!['before', 'inside', 'after'].includes(placement)) throw new Error('Invalid drop position');
        const node = this.#node(path), target = this.#node(destination); this.#removable(node);
        if (path === destination || destination.startsWith(path + '.')) throw new Error('A branch cannot be moved into itself');
        const parent = placement === 'inside' ? target : target.parentBag.parentNode;
        if (!parent) throw new Error('Drop inside the page Source root');
        const builder = parent.builder;
        if (node.builder !== builder) throw new Error('Branches cannot cross builder dialects');
        this.validateChild(parent, node.getAttr(), node);
        const parentRef = this.#ref(parent);
        const previous = this.#parentState(parent), origin = node.parentBag, oldIndex = origin.getNodes().indexOf(node);
        const body = previous.value;
        if (body instanceof this.Source && body !== origin && body.getNode(node.label)) throw new Error(`Source label already exists: ${node.label}`);
        const children = body instanceof this.Source ? body.getNodes().filter(child => child !== node) : [];
        if (parent.nodeTag) {
            builder.validateParent(node.nodeTag, parent.nodeTag);
            builder.validateChildren(parent.nodeTag, [...children.map(child => child.nodeTag), node.nodeTag]);
        }
        let index = placement === 'inside' ? children.length : children.indexOf(target) + (placement === 'after' ? 1 : 0);
        if (index < 0) throw new Error('Drop target changed');
        if (body === origin) {
            const ref = this.#ref(node);
            this.#commit('Move branch', this.#sourceCapture, () => origin.move(origin.getNodes().indexOf(ref.node), index), () => origin.move(origin.getNodes().indexOf(ref.node), oldIndex));
        } else {
            const saved = this.#saved(node);
            const destinationBag = body instanceof this.Source ? body : new this.Source(null, builder);
            let promoted;
            this.#commit('Move branch', this.#sourceCapture, () => {
                if (!(body instanceof this.Source)) {
                    if (promoted) this.#setParent(parentRef.node, promoted);
                    else { builder.promoteNodeValue(parentRef.node, body, destinationBag); promoted = this.#parentState(parentRef.node); }
                }
                saved.ref.node.parentBag.popNode(saved.label, 'inspector');
                this.#restore(saved, destinationBag, index);
            }, () => {
                saved.ref.node.parentBag.popNode(saved.label, 'inspector');
                this.#restore(saved, origin, oldIndex);
                if (!(body instanceof this.Source)) this.#setParent(parentRef.node, previous);
            });
        }
        return `${placement === 'inside' ? destination : destination.slice(0, destination.lastIndexOf('.'))}.${node.label}`;
    }
}
