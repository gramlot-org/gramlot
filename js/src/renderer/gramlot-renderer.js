import {RendererBase, BuilderBase, HtmlBuilder, SvgBuilder, SourceBag, SourceBagNode, sourceTarget} from '@jsr/genro__builders';
import {HtmlElement} from '../view/html.js';
import {References} from '../references.js';

/** Own the live DOM lifecycle driven by typed Source insert/update/delete events. */
export class GramlotRenderer extends RendererBase {
    static renderType = 'object';

    constructor(builder, source, destination, {
        html = new HtmlElement({metadataAttributes: ['__ref']}), references = new References(source),
    } = {}) {
        super(builder);
        if (!(builder instanceof BuilderBase) || !(source instanceof SourceBag) || destination?.nodeType !== 1) {
            throw new TypeError('GramlotRenderer requires a BuilderBase, SourceBag and HTML destination');
        }
        if (!(source._builder instanceof BuilderBase)) throw new TypeError('SourceBag requires builder ownership');
        this.source = source;
        this.destination = destination;
        this.html = html;
        this.records = new Map();
        this.references = references;
        this.pending = [];
        this.building = false;
        this.disposed = false;
        this.elements = new WeakMap();
        this.subscription = `html-source-renderer-${crypto.randomUUID()}`;
        source.subscribe(this.subscription, {any: event => this.receive(event)});
    }

    /** Native dialects share this live lifecycle and its mount records. */
    getRender(builder) {
        if (builder instanceof HtmlBuilder || builder instanceof SvgBuilder) {
            this.addRender(builder, this);
        }
        return super.getRender(builder);
    }

    /** Strip wire-only names after RendererBase has resolved runtime attrs. */
    adaptAttrs(attrs) {
        const {_meta, ...result} = attrs;
        return result;
    }

    /** Structural Source fragments are owned by the live renderer. */
    render(node, opts = {}) {
        if (!(node instanceof SourceBagNode)) throw new TypeError('Source children must be SourceBagNodes');
        if (node.nodeTag) this.html.validate(node, node._getMeta('subbuilder') ? node.parentBag._builder : node.builder);
        else if (!(node.value instanceof SourceBag)) throw new TypeError('Source fragments must contain child SourceBags');
        return node.nodeTag ? super.render(node, opts) : this.renderFragment(node, opts);
    }

    renderFragment(node, {document = this.destination.ownerDocument, ...opts} = {}) {
        const fragment = document.createDocumentFragment();
        const record = {
            node, container: null, parent: null, children: new Set(), cleanup: [],
            start: document.createComment('source-fragment'),
            end: document.createComment('/source-fragment'),
        };
        this.records.set(node, record);
        this.elements.set(fragment, record);
        fragment.append(record.start);
        for (const child of node.value.getNodes()) {
            const rendered = this.render(child, {document, ...opts});
            fragment.append(rendered);
            const childRecord = this.elements.get(rendered);
            if (childRecord) {
                childRecord.parent = record;
                record.children.add(child);
            }
        }
        fragment.append(record.end);
        return fragment;
    }

    /** RendererBase's dialect hook: create one detached element. */
    renderedItem(node, item, runtimeAttrs, {tag, document = this.destination.ownerDocument} = {}) {
        const children = Array.isArray(item) ? item : [];
        const text = Array.isArray(item) ? runtimeAttrs._text : item;
        const record = {
            node,
            container: null,
            parent: null,
            children: new Set(),
            cleanup: [],
            ...this.html.create(node, document, tag, runtimeAttrs),
        };
        this.html.compose(record, text, children);
        this.records.set(node, record);
        this.elements.set(record.element, record);
        this.references?.register(node, record.element);
        for (const element of children) {
            const child = this.elements.get(element);
            if (!child) continue;
            child.parent = record;
            child.container = record.element;
            record.children.add(child.node);
        }
        return record.element;
    }

    /**
     * Validate a detached candidate without changing the observed Source.
     * Mounted references below replacingNode are excluded when checking a replacement.
     */
    validateCandidate(block, {replacingNode = null} = {}) {
        if (!(block instanceof SourceBag)) throw new TypeError('Source values must be SourceBags');
        const excluded = new Set();
        const exclude = node => {
            excluded.add(node);
            for (const child of this.records.get(node)?.children ?? []) exclude(child);
        };
        // Replacing a node's VALUE retains that node and its reference. Only
        // the rendered descendants which the replacement removes leave the ref set.
        // During freeze these can differ from the current Source descendants.
        for (const child of this.records.get(replacingNode)?.children ?? []) exclude(child);
        this.#validateBlock(block, replacingNode ? replacingNode.nodeTag : null);
        this.references?.validate(block, excluded);
        return block;
    }

    #validateBlock(block, parentTag = null) {
        const bags = new Set();
        const walk = (bag, parentTag = null) => {
            if (!(bag instanceof SourceBag) || bags.has(bag)) {
                throw new TypeError('Source values must be unshared, acyclic SourceBags');
            }
            if (!(bag._builder instanceof BuilderBase)) throw new TypeError('SourceBag requires builder ownership');
            bags.add(bag);
            for (const node of bag.getNodes()) {
                if (!(node instanceof SourceBagNode)) throw new TypeError('Source children must be SourceBagNodes');
                if (!(node.builder instanceof BuilderBase)) throw new TypeError('SourceBagNode requires builder ownership');
                if (node.resolver) throw new TypeError('Source resolvers are outside this port');
                if (node.nodeTag) {
                    // The enclosing Bag owns the boundary declaration; the node
                    // and its contents already belong to the entered dialect.
                    const owner = node._getMeta('subbuilder') ? bag._builder : node.builder;
                    this.html.validate(node, owner);
                    if (!node._getMeta('subbuilder')) {
                        node.builder.validateParent(node.nodeTag, parentTag);
                    }
                } else {
                    if (!(node.value instanceof SourceBag)) {
                        throw new TypeError('Source fragments must contain child SourceBags');
                    }
                    if (Object.keys(node.attr).some(key => key !== '_meta')) {
                        throw new TypeError('Fragment attributes are unsupported');
                    }
                }
                if (node.value instanceof SourceBag) {
                    walk(node.value, node._getMeta('subbuilder') ? null : (node.nodeTag ?? parentTag));
                }
            }
        };
        walk(block, parentTag);
    }

    mount() {
        this.validateCandidate(this.source);
        for (const node of this.source.getNodes()) this.insert(node);
        return this;
    }

    /** Suspend rendering for a mounted branch; Source keeps changing normally. */
    freeze(node) {
        node = sourceTarget(node);
        const record = this.records.get(node);
        if (!record || this.disposed) throw new Error('Freeze requires a mounted Source node');
        record.frozen = true;
    }

    /** Resume the whole branch and build its current Source once. */
    unfreeze(node) {
        node = sourceTarget(node);
        const record = this.records.get(node);
        if (!record || this.disposed) throw new Error('Unfreeze requires a mounted Source node');
        const thaw = record => {
            delete record.frozen;
            for (const child of record.children) thaw(this.records.get(child));
        };
        thaw(record);
        if (this.#isFrozen(node)) return;
        let bag = node.parentBag;
        while (bag && bag !== this.source) bag = bag.parentNode?.parentBag;
        if (bag === this.source) this.#rebuild(node);
        else this.remove(node);
    }

    #isFrozen(node) {
        while (node) {
            const record = this.records.get(node);
            if (record?.frozen) return true;
            // Deleted nodes may have lost their Source parent. Their existing
            // mount record still belongs to the frozen, previously rendered branch.
            node = node.parentBag?.parentNode ?? record?.parent?.node;
        }
        return false;
    }

    receive(event) {
        if (this.disposed) return;
        if (Array.isArray(event.node)) {
            const nodes = event.node.filter(node => !this.#isFrozen(node));
            if (!nodes.length) return;
            event = {...event, node: nodes};
        } else if (this.#isFrozen(event.node)) return;
        this.pending.push(event);
        if (this.building) return;
        this.building = true;
        try {
            while (this.pending.length) {
                const next = this.pending.shift();
                if (next.evt === 'del') {
                    for (const node of Array.isArray(next.node) ? next.node : [next.node]) this.remove(node);
                    continue;
                }
                let bag = next.node.parentBag;
                while (bag && bag !== this.source) bag = bag.parentNode?.parentBag;
                if (bag !== this.source) continue;
                if (next.evt === 'ins') this.insert(next.node);
                else if (next.evt.startsWith('upd_')) this.update(next.node, next.evt);
                else throw new Error(`Unsupported Source event: ${next.evt}`);
            }
        } catch (error) {
            this.pending.length = 0;
            throw error;
        } finally {
            this.building = false;
        }
    }

    insert(node) {
        const parent = this.records.get(node.parentBag?.parentNode);
        const container = parent?.element ?? parent?.container ?? this.destination;
        const siblings = node.parentBag.getNodes();
        let before = parent?.end ?? null;
        for (let i = siblings.indexOf(node) + 1; i < siblings.length; i++) {
            const record = this.records.get(siblings[i]);
            if (record) { before = record.element ?? record.start; break; }
        }
        this.buildNode(node, container, before, parent);
    }

    buildNode(node, container, before = null, parent = null) {
        const output = this.render(node, {document: container.ownerDocument});
        const record = this.records.get(node);
        container.insertBefore(output, before);
        record.parent = parent;
        this.assignContainer(record, container);
        parent?.children.add(node);
        return record;
    }

    assignContainer(record, container) {
        record.container = container;
        const childContainer = record.element ?? container;
        for (const childNode of record.children) {
            const child = this.records.get(childNode);
            if (child) this.assignContainer(child, childContainer);
        }
    }

    update(node, event) {
        const record = this.records.get(node);
        if (!record) { this.insert(node); return; }
        const scalarValue = node.value == null || ['string', 'number', 'boolean'].includes(typeof node.value);
        const scalarValueUpdate = event === 'upd_value' && scalarValue
            && record.element && record.children.size === 0 && this.html.matches(record, node);
        if ((event === 'upd_attrs' || scalarValueUpdate) && record.element && this.html.matches(record, node)) {
            if (node.nodeTag) this.html.validate(node, node._getMeta('subbuilder') ? node.parentBag._builder : node.builder);
            const [value, runtimeAttrs] = node.builder.runtimeValues(node);
            const [, resolvedAttrs] = this._handleMeta(node, runtimeAttrs);
            const attrs = node._getMeta('subbuilder') ? resolvedAttrs : this.adaptAttrs(resolvedAttrs);
            this.html.update(record, node, attrs, node.value instanceof SourceBag ? attrs._text : value);
            if (event === 'upd_attrs') {
                this.references?.remove(node);
                this.references?.register(node, record.element);
            }
        } else {
            this.#rebuild(node);
        }
    }

    #rebuild(node) {
        const record = this.records.get(node);
        const before = record.element?.nextSibling ?? record.end?.nextSibling ?? null;
        const container = record.container;
        const parent = record.parent;
        let removeError = null;
        try { this.remove(node); }
        catch (error) { removeError = error; }
        try {
            this.buildNode(node, container, before, parent);
        } catch (commitError) {
            if (removeError) {
                throw new AggregateError(
                    [removeError, commitError],
                    'Source replacement cleanup and commit failed',
                );
            }
            throw commitError;
        }
        if (removeError) throw removeError;
    }

    onDispose(node, callback) {
        const record = this.records.get(node);
        if (!record) throw new Error('Source node is not mounted');
        record.cleanup.push(callback);
        return () => {
            const index = record.cleanup.indexOf(callback);
            if (index !== -1) record.cleanup.splice(index, 1);
        };
    }

    remove(node) {
        const record = this.records.get(node);
        if (!record) return;
        const errors = [];
        for (const child of [...record.children]) {
            try { this.remove(child); } catch (error) { errors.push(error); }
        }
        for (const cleanup of record.cleanup.splice(0).reverse()) {
            try { cleanup(); } catch (error) { errors.push(error); }
        }
        this.references?.remove(node);
        record.element?.remove();
        record.start?.remove();
        record.end?.remove();
        record.parent?.children.delete(node);
        this.records.delete(node);
        if (errors.length) throw new AggregateError(errors, 'Source cleanup failed');
    }

    dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.source.unsubscribe(this.subscription, {any: true});
        this.pending.length = 0;
        const errors = [];
        const roots = [...this.records.entries()]
            .filter(([, record]) => !record.parent)
            .map(([node]) => node);
        for (const node of roots) {
            try { this.remove(node); } catch (error) { errors.push(error); }
        }
        if (errors.length) throw new AggregateError(errors, 'Renderer cleanup failed');
    }
}
