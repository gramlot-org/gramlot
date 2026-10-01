import {SourceBag} from '@genrojs/builders';
import {DataRouter} from './router.js';
import {DataInstaller} from './installation.js';
import {ControllerProvider, FormulaProvider} from './providers.js';
import {InlineCompiler} from './inline.js';

// The Provider class of each provider data-element (§4.8).
const PROVIDERS = {dataFormula: FormulaProvider, dataController: ControllerProvider};

// Attributes whose change moves the Data context of a whole branch (§4.4, upd_attrs row).
const CONTEXT_ATTRIBUTES = ['datapath', '_anchor', 'node_id', 'form', 'formId'];

/**
 * Semantic lifetime of one Gramlot page (source plan §4.4).
 *
 * The runtime owns the one Data subscription of the page, on Builder's Data
 * wrapper (`_dataroot` → `_root_` → `builder.data`), the DataRouter it feeds,
 * the `node_id → node` map of the Source (R06) and one NodeBinding per Source
 * node, created once per node identity. The DOM lifetime stays in the
 * renderer records.
 */
export class BindingRuntime {
    #gramlot;
    #bindings = new Map();
    #nodeIds = new Map();
    #router;
    #installer;
    #inlineCompiler;
    #subscription = `gramlot-data-${crypto.randomUUID()}`;
    #disposed = false;

    constructor(gramlot) {
        this.#gramlot = gramlot;
        this.#router = new DataRouter(this);
        this.#installer = new DataInstaller(this);
        this.#inlineCompiler = new InlineCompiler(this);
    }

    get gramlot() { return this.#gramlot; }
    get builder() { return this.gramlot.builder; }
    get renderer() { return this.gramlot.renderer; }
    get logicRegistry() { return this.gramlot.logicRegistry; }
    /** The document Data Bag. */
    get data() { return this.builder.data; }
    /** Builder's Data wrapper `_dataroot`: `root.getItem('_root_') === data`. */
    get root() { return this.data.parent; }
    /** Number of open NodeBindings. */
    get size() { return this.#bindings.size; }
    get disposed() { return this.#disposed; }
    get router() { return this.#router; }
    get installer() { return this.#installer; }
    /** The compiler of the page's inline code (§4.10). */
    get inlineCompiler() { return this.#inlineCompiler; }
    /** `node_id → node` of the Source nodes with an open NodeBinding (R06). */
    get nodeIds() { return this.#nodeIds; }

    /** Subscribe once on Builder's Data wrapper; nothing is created. */
    attach() {
        this.root.subscribe(this.#subscription, {any: event => this.receiveData(event)});
    }

    /** Callback of the one Data subscription. */
    receiveData(event) {
        this.router.deliver(event);
    }

    /** The open NodeBinding of `node`, or null. */
    bindingFor(node) {
        return this.#bindings.get(node) ?? null;
    }

    /** The NodeBinding of `node`, created once per node identity. */
    openBinding(node) {
        if (this.disposed) throw new Error('BindingRuntime is disposed');
        let binding = this.bindingFor(node);
        if (!binding) {
            binding = new NodeBinding(this, node);
            this.#bindings.set(node, binding);
        }
        return binding;
    }

    /** Close the NodeBinding of `node` and of all its descendants; errors are collected. */
    closeBranch(node) {
        const errors = [];
        if (node.value instanceof SourceBag) {
            for (const child of node.value.getNodes()) {
                try { this.closeBranch(child); } catch (error) { errors.push(error); }
            }
        }
        const binding = this.bindingFor(node);
        if (binding) {
            this.#bindings.delete(node);
            const nodeId = node.getAttr('node_id');
            if (this.nodeIds.get(nodeId) === node) this.nodeIds.delete(nodeId);
            try { binding.close(); } catch (error) { errors.push(error); }
        }
        if (errors.length) throw new AggregateError(errors, 'Source branch close failed');
    }

    /**
     * Redo the registrations of `node` and of its descendants (change of Data context), then
     * project the branch again: the elements already built follow the new paths.
     */
    rebindBranch(node) {
        const nodes = this.#branchNodes(node);
        for (const each of nodes) this.bindingFor(each)?.rebind();
        for (const each of nodes) this.renderer.project(each);
    }

    /**
     * Semantic work of one Source event, called inside the renderer FIFO (§5.2).
     *
     * The rows of the event matrix: opening and closing of the NodeBindings,
     * the `node_id` map, the rebinding, and the installation of the `ins` and
     * new-branch rows (§5.1 steps 2-5).
     *
     * A failing disposer does not block the rest of the event: the errors of the
     * closings are returned, so the renderer does its structural work before
     * throwing them. Any other error is thrown, with the closing errors already
     * collected.
     */
    handleSourceEvent(event) {
        const {evt, node} = event;
        const errors = [];
        const close = removed => {
            try { this.closeBranch(removed); } catch (error) { errors.push(error); }
        };
        try {
            if (evt === 'ins') {
                this.#openBranch(node);
            } else if (evt === 'del') {
                for (const removed of Array.isArray(node) ? node : [node]) close(removed);
            } else if (evt === 'upd_value' || evt === 'upd_value_attr') {
                if (event.oldvalue instanceof SourceBag) for (const child of event.oldvalue.getNodes()) close(child);
                // A `==` node value compiled for the old value is released (S09).
                this.inlineCompiler.release(node, ['']);
                // The pointer in the node value may have changed, appeared or disappeared (R05).
                if (evt === 'upd_value_attr') this.#attributesChanged(node, event.attrs_diff);
                else this.#installedBinding(node).rebind();
                if (node.value instanceof SourceBag) this.#openBranch(node.value);
            } else if (evt === 'upd_attrs') {
                this.#attributesChanged(node, event.attrs_diff);
            } else {
                throw new Error(`Unsupported Source event: ${evt}`);
            }
        } catch (error) {
            if (!errors.length) throw error;
            throw new AggregateError([...errors, error], 'Source event failed');
        }
        return errors;
    }

    /**
     * §5.1 step 7, called by the renderer after a successful build of `node`: every node of the branch
     * still in the Source and not built before is stamped `built`, the `_onBuilt` of its providers
     * runs, then, when the page is started, the `_onStart` (step 8). A number is a delay in ms.
     */
    branchBuilt(node) {
        const built = [];
        for (const each of this.#branchNodes(node)) {
            const binding = this.bindingFor(each);
            if (!binding || binding.hasStamp('built') || !this.renderer.attached(each)) continue;
            binding.stamp('built');
            built.push(binding);
        }
        // An `_onBuilt` may remove a later node of the list: each node is checked when its turn comes.
        for (const binding of built) {
            if (this.renderer.attached(binding.node)) this.#lifecycle(binding, 'built', '_onBuilt');
        }
        if (this.gramlot.state !== 'started') return;
        for (const binding of built) {
            if (this.renderer.attached(binding.node)) this.#start(binding);
        }
    }

    /** §5.1 step 8 for the initial Source, called by Gramlot when the page becomes `started`. */
    pageStarted() {
        for (const binding of [...this.#bindings.values()]) {
            if (!binding.closed && binding.hasStamp('built')) this.#start(binding);
        }
    }

    /** Close every NodeBinding, the `node_id` map and the Data subscription; a second call does nothing. */
    dispose() {
        if (this.disposed) return;
        this.#disposed = true;
        this.root.unsubscribe(this.#subscription, {any: true});
        this.nodeIds.clear();
        const errors = [];
        for (const [node, binding] of [...this.#bindings.entries()].reverse()) {
            this.#bindings.delete(node);
            try { binding.close(); } catch (error) { errors.push(error); }
        }
        if (errors.length) throw new AggregateError(errors, 'Binding cleanup failed');
    }

    /**
     * Steps 2-4 of §5.1 on `branch` (a SourceBagNode or a new SourceBag value). The `node_id` map is
     * complete, and a duplicate refused, before the first write or registration, so a `#<node_id>`
     * of the branch translates; then the installation (`dataSetter`s and defaults), then one
     * NodeBinding per node and the registrations, providers included. On an error the NodeBindings
     * opened here are closed and the map entries they brought are removed; the Data is not rolled
     * back. Then `_init` (step 5), once per node: its error propagates and the NodeBindings stay
     * open (P12, no rollback).
     */
    #openBranch(branch) {
        // A node already open came in with its ancestor, whose event was processed first (P4).
        if (!(branch instanceof SourceBag) && this.bindingFor(branch)) return;
        const nodes = branch instanceof SourceBag
            ? branch.getNodes().flatMap(root => this.#branchNodes(root)) : this.#branchNodes(branch);
        const known = new Set(nodes.filter(node => this.bindingFor(node)));
        const entering = new Map();
        for (const node of nodes) {
            const nodeId = node.getAttr('node_id');
            if (nodeId == null) continue;
            if (entering.has(nodeId) || (this.nodeIds.has(nodeId) && this.nodeIds.get(nodeId) !== node)) {
                throw new Error(`Duplicate node_id '${nodeId}'`);
            }
            entering.set(nodeId, node);
        }
        for (const [nodeId, node] of entering) this.nodeIds.set(nodeId, node);
        try {
            this.installer.install(branch);
            for (const node of nodes) this.openBinding(node);
            for (const node of nodes) this.bindingFor(node).registerPointers();
        } catch (error) {
            const errors = [error];
            for (const node of nodes.filter(node => !known.has(node)).reverse()) {
                const nodeId = node.getAttr('node_id');
                if (entering.get(nodeId) === node && this.nodeIds.get(nodeId) === node) this.nodeIds.delete(nodeId);
                const binding = this.bindingFor(node);
                if (!binding) continue;
                this.#bindings.delete(node);
                try { binding.close(); } catch (closeError) { errors.push(closeError); }
            }
            if (errors.length > 1) throw new AggregateError(errors, 'Source branch installation failed');
            throw error;
        }
        // An `_init` may remove a later node of the branch: each node is checked when its turn comes.
        for (const node of nodes) {
            const binding = this.bindingFor(node);
            if (!binding || binding.hasStamp('init') || !this.renderer.attached(node)) continue;
            binding.stamp('init');
            if (isOn(node.getAttr('_init'))) {
                for (const provider of binding.providers) provider.invoke({kind: 'init', change: null});
            }
        }
    }

    /** The `_onStart` of a built node, once. */
    #start(binding) {
        if (binding.hasStamp('start')) return;
        binding.stamp('start');
        this.#lifecycle(binding, 'start', '_onStart');
    }

    /** Invoke the providers of `binding` for the lifecycle trigger `kind` when `attribute` is on; a number delays it. */
    #lifecycle(binding, kind, attribute) {
        const value = binding.node.getAttr(attribute);
        if (!isOn(value)) return;
        for (const provider of binding.providers) {
            if (typeof value !== 'number' || value <= 0) {
                provider.invoke({kind, change: null});
                continue;
            }
            let release = null;
            const timer = setTimeout(() => {
                release();
                provider.invoke({kind, change: null});
            }, value);
            release = binding.track(() => clearTimeout(timer));
        }
    }

    /**
     * An attribute change: the NodeBinding of the node is required first (GC-210 §090), then the inline
     * declarations of the changed attributes are released (S09), then the `node_id` map, then the
     * rebinding of the node, or of its branch for a context attribute.
     */
    #attributesChanged(node, diff) {
        const binding = this.#installedBinding(node);
        this.inlineCompiler.release(node, Object.keys(diff));
        if (Object.hasOwn(diff, 'node_id')) {
            const {old: previous, new: current} = diff.node_id;
            if (current != null && this.nodeIds.has(current) && this.nodeIds.get(current) !== node) {
                throw new Error(`Duplicate node_id '${current}'`);
            }
            if (this.nodeIds.get(previous) === node) this.nodeIds.delete(previous);
            if (current != null) this.nodeIds.set(current, node);
        }
        if (CONTEXT_ATTRIBUTES.some(name => Object.hasOwn(diff, name))) this.rebindBranch(node);
        else binding.rebind();
    }

    /**
     * The NodeBinding of a node that an update event reached; a node without one is a branch whose
     * installation failed and that stayed in the Source: an error naming node and tag.
     */
    #installedBinding(node) {
        const binding = this.bindingFor(node);
        if (!binding) {
            throw new Error(`${node.nodeTag ?? 'fragment'} '${node.label}': the node has no NodeBinding `
                + '(its installation failed); remove it from the Source and insert it again');
        }
        return binding;
    }

    /** `node` and its descendants, depth first. */
    #branchNodes(node) {
        const nodes = [node];
        if (node.value instanceof SourceBag) {
            for (const child of node.value.getNodes()) nodes.push(...this.#branchNodes(child));
        }
        return nodes;
    }
}

/** A lifecycle attribute is on when it is true or a number (P22: `0` counts as `true`). */
function isOn(value) {
    return value === true || typeof value === 'number';
}

/** Semantic owner of one Source node: the resources that live as long as the node is in the Source. */
export class NodeBinding {
    #runtime;
    #node;
    #closed = false;
    #disposers = [];
    #registrations = [];
    #stamps = new Set();
    #provider = null;
    // The clicks of a button, counted for its whole semantic life: a rebuild keeps them (P9, S12).
    #clickCount = 0;
    // The registration of the node's own variable datapath, read in the parent's context.
    #datapathRegistration = null;

    constructor(runtime, node) {
        this.#runtime = runtime;
        this.#node = node;
    }

    get runtime() { return this.#runtime; }
    get node() { return this.#node; }
    get closed() { return this.#closed; }
    /** The active DataRegistrations of the node. */
    get registrations() { return [...this.#registrations]; }
    /** The Provider of a `dataFormula` or `dataController`, as a list of zero or one. */
    get providers() { return this.#provider ? [this.#provider] : []; }

    /** The clicks counted by the node's ButtonBinding since the node entered the Source (P9). */
    get clickCount() { return this.#clickCount; }

    /** Count one click of the node's button and return the new count. */
    countClick() {
        return ++this.#clickCount;
    }

    /** Whether the lifecycle step `name` ('installed', 'init', 'built', 'start') ran for the node. */
    hasStamp(name) {
        return this.#stamps.has(name);
    }

    /** Record that the lifecycle step `name` ran for the node. */
    stamp(name) {
        this.#stamps.add(name);
    }

    /**
     * Register the `^` pointers of `node.pointers()` with the router: `=` is not registered, a
     * pointer on a null path (Q7) is not registered. The `datapath` pointer is resolved in the
     * parent's context. A `dataSetter` registers nothing; a `dataFormula` or `dataController`
     * registers its `datapath` here and the rest through its Provider, created once (§5.1 step 4).
     */
    registerPointers() {
        const node = this.node;
        const dataElement = node._getMeta('data_element');
        if (dataElement && !PROVIDERS[node.nodeTag]) return;
        for (const [name, pointer] of node.pointers()) {
            if (dataElement && name !== 'datapath') continue;
            const context = name === 'datapath' ? node.parentNode : node;
            const absolute = context.absDatapath(pointer);
            if (absolute === null) continue;
            const [path, attr = null] = absolute.split('?', 2);
            const registration = this.runtime.router.register({path, attr, recipient: this});
            this.#registrations.push(registration);
            if (name === 'datapath') this.#datapathRegistration = registration;
        }
        if (!dataElement) return;
        this.#provider ??= new PROVIDERS[node.nodeTag](this);
        this.#provider.register();
    }

    /** Close the registrations and make them again from the current pointers, the provider's included (D1). */
    rebind() {
        this.#closeRegistrations();
        this.registerPointers();
    }

    /** Router recipient: the node's datapath rebinds its branch; any other registration projects the node. */
    receive(change) {
        if (change.registration === this.#datapathRegistration) this.runtime.rebindBranch(this.node);
        else this.runtime.renderer.project(this.node, change);
    }

    /** Own a semantic resource until close; the returned function releases it without running it. */
    track(disposer) {
        if (this.closed) throw new Error(`NodeBinding of '${this.node.label}' is closed`);
        this.#disposers.push(disposer);
        return () => {
            const index = this.#disposers.indexOf(disposer);
            if (index !== -1) this.#disposers.splice(index, 1);
        };
    }

    /** Close the registrations, then run the disposers in reverse order and collect their errors. */
    close() {
        if (this.closed) return;
        this.#closed = true;
        this.#closeRegistrations();
        const errors = [];
        for (const disposer of this.#disposers.splice(0).reverse()) {
            try { disposer(); } catch (error) { errors.push(error); }
        }
        if (errors.length) throw new AggregateError(errors, `NodeBinding of '${this.node.label}' cleanup failed`);
    }

    #closeRegistrations() {
        for (const registration of this.#registrations.splice(0)) registration.close();
        this.#datapathRegistration = null;
    }
}
