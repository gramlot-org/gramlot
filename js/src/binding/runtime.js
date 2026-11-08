import {Bag} from '@genrojs/bag';
import {BagCollectionView} from '../stores/bag-collection-view.js';
import {BagCollectionStore, collectionKey} from '../stores/bag-collection-store.js';
import {SourceBag} from '@genrojs/builders';
import {DataRouter} from './router.js';
import {DataInstaller} from './installation.js';
import {ControllerProvider, FormulaProvider, RemoteProvider, RpcProvider} from './providers.js';
import {InlineCompiler} from './inline.js';
import {isLogicMethod, callLogic} from './hooks.js';
import {RemoteBinding} from './remote.js';
import {DataBinder} from './data-binder.js';
import {AskDialog} from './ask-dialog.js';
import {ErrorNotifications} from './error-notifications.js';
import {randomId} from '../random-id.js';
import {DATA_ROOT, pointerDependencies} from '@genrojs/builders';
import {SYMBOLIC_ATTRIBUTES} from '../builder/source.js';


// The Provider class of each provider data-element (§4.8).
const PROVIDERS = {
    dataFormula: FormulaProvider, dataController: ControllerProvider, dataRpc: RpcProvider,
    dataRemote: RemoteProvider,
};

// Attributes whose change moves the Data context of a whole branch (§4.4, upd_attrs row).
const CONTEXT_ATTRIBUTES = ['datapath', '_anchor', 'nodeId', 'form', 'formId', ...SYMBOLIC_ATTRIBUTES];

/**
 * The names a node gives to the symbolic resolution, besides the node itself: its nodeId and its
 * childname. A NodeBinding whose resolution read one of them is rebound when it
 * changes.
 */
function startKeys(node) {
    const keys = [node];
    if (node.getAttr('nodeId') != null) keys.push(`id:${node.getAttr('nodeId')}`);
    if (node.getAttr('childname') != null) keys.push(`childname:${node.getAttr('childname')}`);
    return keys;
}

/**
 * Semantic lifetime of one Gramlot page (source plan §4.4).
 *
 * The runtime owns the one Data subscription of the page, on Builder's Data
 * wrapper (`_dataroot` → `_root_` → `builder.data`), the DataRouter it feeds,
 * the `nodeId → node` map of the Source (R06) and one NodeBinding per Source
 * node, created once per node identity. The DOM lifetime stays in the
 * renderer records.
 */
export class BindingRuntime {
    #gramlot;
    #bindings = new Map();
    #nodeIds = new Map();
    // The NodeBindings whose registrations read a start of the symbolic resolution, by key: a Source
    // node, or `id:<nodeId>`, `childname:<name>`.
    #dependents = new Map();
    // The NodeBinding whose registrations are being resolved, or null.
    #resolving = null;
    // The keys moved by the Source event being handled and the nodes already resolved again, or null outside one.
    #moved = null;
    #router;
    #installer;
    #inlineCompiler;
    #askDialog;
    #errorNotifications;
    #subscriptions;
    #subscription = `gramlot-data-${randomId()}`;
    #disposed = false;
    #sourceTrees = new Set();
    #dataRootTrees = new Set();
    // One collection store per absolute Data path and rowMode, never per Bag identity.
    #collectionStores = new Map();

    constructor(gramlot, {subscriptions}) {
        this.#gramlot = gramlot;
        this.#subscriptions = subscriptions;
        this.#router = new DataRouter(this);
        this.#installer = new DataInstaller(this);
        this.#inlineCompiler = new InlineCompiler(this);
        this.#askDialog = new AskDialog(this);
        this.#errorNotifications = new ErrorNotifications(this);
    }

    get gramlot() { return this.#gramlot; }
    reportError(error, title) { if (!this.disposed) this.#errorNotifications.show(error, title); }
    /** The page topics and Source self-topics: the private `_subscriptions` of the Gramlot instance, given at construction. */
    get subscriptions() { return this.#subscriptions; }
    get builder() { return this.gramlot.src.builder; }
    get renderer() { return this.gramlot.src.renderer; }
    get logicRegistry() { return this.gramlot.src.logicRegistry; }
    /** The document Data Bag. */
    get data() { return this.builder.data; }
    /** Resolve a tree store against the selected live root. */
    treeStore(node) {
        if (node.treeStore !== null) return node.treeStore;
        const path = node.getAttr('storepath');
        if (path === '*S' || path.startsWith('*S.')) {
            const root = this.renderer.source.getItem('main');
            return path === '*S' ? root : root.getItem(path.slice(3));
        }
        if (path === '*D' || path.startsWith('*D.')) {
            return path === '*D' ? this.data : this.data.getItem(path.slice(3));
        }
        return node.getRelativeData(path);
    }
    registerTreeRoot(binding, source) {
        const trees = source ? this.#sourceTrees : this.#dataRootTrees;
        trees.add(binding);
        return {close: () => trees.delete(binding)};
    }
    refreshSourceTrees() {
        for (const binding of [...this.#sourceTrees]) {
            if (!binding.closed && this.renderer.attached(binding.node)) this.renderer.project(binding.node);
        }
    }
    /** Builder's Data wrapper `_dataroot`: `root.getItem('_root_') === data`. */
    get root() { return this.data.parent; }
    /** Number of open NodeBindings. */
    get size() { return this.#bindings.size; }
    get disposed() { return this.#disposed; }
    get router() { return this.#router; }
    get installer() { return this.#installer; }
    /** The compiler of the page's inline code (§4.10). */
    get inlineCompiler() { return this.#inlineCompiler; }
    /** The ask dialogs of the page (`_ask` of a provider, `ask` of a button). */
    get askDialog() { return this.#askDialog; }
    /** `nodeId → node` of the Source nodes with an open NodeBinding (R06). */
    get nodeIds() { return this.#nodeIds; }

    /** Run `run` resolving the registrations of `binding`: the starts it reads are recorded for it. */
    resolveFor(binding, run) {
        const previous = this.#resolving;
        this.#resolving = binding;
        try { return run(); } finally { this.#resolving = previous; }
    }

    /** Record that the registrations being resolved read the start `key` (a Source node or a name key). */
    dependOn(key) {
        const binding = this.#resolving;
        if (!binding) return;
        let dependents = this.#dependents.get(key);
        if (!dependents) this.#dependents.set(key, dependents = new Set());
        dependents.add(binding);
        binding.dependencies.add(key);
    }

    /** Forget the starts read by `binding`; called when its registrations close. */
    releaseDependencies(binding) {
        for (const key of binding.dependencies) {
            const dependents = this.#dependents.get(key);
            dependents?.delete(binding);
            if (dependents && !dependents.size) this.#dependents.delete(key);
        }
        binding.dependencies.clear();
    }

    /**
     * One shared resident data resource per absolute Data `path` and `rowMode`; presentation state
     * belongs to views. The store keeps the address: a replacement of the Bag at `path` keeps it.
     */
    collectionStore(path, rowMode) {
        if (this.disposed) throw new Error('BindingRuntime is disposed');
        const key = collectionKey(path, rowMode);
        let store = this.#collectionStores.get(key);
        if (!store) {
            store = new BagCollectionStore(this.data, path, rowMode);
            this.#collectionStores.set(key, store);
        }
        return store;
    }

    /**
     * Each grid Source owns one view over the store at `path`. A new address gives a new view that
     * starts from the criteria of the previous one; the previous view is disconnected.
     */
    collectionView(node, path, rowMode) {
        const store = this.collectionStore(path,rowMode);
        const previous = Object.hasOwn(node,'gridCollectionView') ? node.gridCollectionView : null;
        if (previous?.path === path && previous.rowMode === rowMode) return previous;
        const view = new BagCollectionView(store);
        if (previous) {
            previous.disconnect();
            view.sort(previous.sortedBy);
            view.copyFiltersFrom(previous);
        }
        Object.defineProperty(node,'gridCollectionView',{value:view,configurable:true});
        return view;
    }

    /** Subscribe once on Builder's Data wrapper; nothing is created. */
    attach() {
        this.root.subscribe(this.#subscription, {any: event => this.receiveData(event)});
    }

    /** Callback of the one Data subscription. */
    receiveData(event) {
        // Resident stores reconcile before the consumers that the router reaches.
        this.#notifyCollectionStores(event);
        this.router.deliver(event);
        for (const binding of [...this.#dataRootTrees]) {
            if (!binding.closed && this.renderer.attached(binding.node)) this.renderer.project(binding.node);
        }
    }

    /**
     * Notify the collection stores an event reaches, by path. An event inside the collection
     * carries its row (the node under the store path, read without resolvers) and field; an event
     * on the store path, on a row list, or replacing an ancestor is a full change. A path that
     * does not hold a Bag notifies nothing: its consumers read the address and report the error.
     */
    #notifyCollectionStores(event) {
        const {pathlist} = event;
        if (!this.#collectionStores.size || !pathlist?.length || pathlist[0] !== DATA_ROOT) return;
        const base = pathlist.slice(1), container = event.evt === 'ins' || event.evt === 'del';
        const labels = container ? (Array.isArray(event.node) ? event.node : [event.node]).map(node => node.label) : [];
        for (const store of this.#collectionStores.values()) {
            const target = store.path.split('.');
            const shared = Math.min(base.length, target.length);
            let index = 0;
            while (index < shared && base[index] === target[index]) index++;
            if (index < shared) continue;
            let row = null, field = null;
            if (base.length > target.length) {
                row = base[target.length];
                field = base[target.length + 1] ?? null;
            } else if (base.length < target.length) {
                const reached = container ? labels.includes(target[base.length]) : event.evt === 'upd_value';
                if (!reached) continue;
            }
            const bag = this.data.getItem(store.path, null, true);
            if (!(bag instanceof Bag)) continue;
            store.receiveData(event, row === null ? null : bag.node(row) ?? null, field);
        }
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
            const nodeId = node.getAttr('nodeId');
            if (this.nodeIds.get(nodeId) === node) this.nodeIds.delete(nodeId);
            try { binding.close(); } catch (error) { errors.push(error); }
            try { this.#moving(startKeys(node)); } catch (error) { errors.push(error); }
        }
        if (errors.length) throw new AggregateError(errors, 'Source branch close failed');
    }

    /**
     * Redo the registrations of `node` and of its descendants (change of Data context), then
     * project the branch again: the elements already built follow the new paths, and a started
     * `remote` requests its fragment for the new context. Not in `rebind`: the fragment mounted by
     * `remoteSource` is a value event of the node itself, which rebinds it.
     */
    rebindBranch(node) {
        const nodes = this.#branchNodes(node);
        for (const each of nodes) this.bindingFor(each)?.rebind();
        for (const each of nodes) this.renderer.project(each);
        for (const each of nodes) this.bindingFor(each)?.remote?.trigger();
        this.#moving(nodes, nodes);
    }

    /**
     * Rebind and project the open NodeBindings whose registrations read one of `keys`, except those of
     * the nodes in `skip`; their errors are returned. A NodeBinding whose resolution fails keeps no
     * registration on the old paths and keeps its dependencies: it is rebound again when the start returns.
     */
    #rebindDependents(keys, skip = new Set()) {
        const bindings = new Set();
        for (const key of keys) {
            for (const binding of this.#dependents.get(key) ?? []) if (!skip.has(binding.node)) bindings.add(binding);
        }
        const errors = [];
        const failed = new Set();
        for (const binding of bindings) {
            if (binding.closed) continue;
            try { binding.rebind(); } catch (error) { errors.push(error); failed.add(binding); }
        }
        for (const binding of bindings) {
            if (binding.closed || failed.has(binding)) continue;
            try {
                this.renderer.project(binding.node);
                binding.remote?.trigger();
            } catch (error) { errors.push(error); }
        }
        return errors;
    }

    /**
     * Keys moved by a Source change, with the nodes whose NodeBindings resolved again already: collected
     * until the end of the Source event, rebound at once outside one.
     */
    #moving(keys, done = []) {
        if (this.#moved) {
            for (const key of keys) this.#moved.keys.add(key);
            for (const node of done) this.#moved.done.add(node);
            return;
        }
        const errors = this.#rebindDependents(keys, new Set(done));
        if (errors.length) throw errors.length === 1 ? errors[0] : new AggregateError(errors, 'Symbolic start rebinding failed');
    }

    /**
     * Semantic work of one Source event, called inside the renderer FIFO (§5.2).
     *
     * The rows of the event matrix: opening and closing of the NodeBindings,
     * the `nodeId` map, the rebinding, and the installation of the `ins` and
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
        const moved = this.#moved = {keys: new Set(), done: new Set()};
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
        } finally {
            this.#moved = null;
        }
        // The NodeBindings that read a start this event moved resolve again; their errors follow the closings'.
        errors.push(...this.#rebindDependents(moved.keys, moved.done));
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

    /** Close every NodeBinding, the `nodeId` map and the Data subscription; a second call does nothing. */
    dispose() {
        if (this.disposed) return;
        this.#disposed = true;
        this.root.unsubscribe(this.#subscription, {any: true});
        this.nodeIds.clear();
        this.#dependents.clear();
        this.#collectionStores.clear();
        const errors = [];
        for (const [node, binding] of [...this.#bindings.entries()].reverse()) {
            this.#bindings.delete(node);
            try { binding.close(); } catch (error) { errors.push(error); }
        }
        if (errors.length) throw new AggregateError(errors, 'Binding cleanup failed');
    }

    /**
     * Steps 2-4 of §5.1 on `branch` (a SourceBagNode or a new SourceBag value). The `nodeId` map is
     * complete, and a duplicate refused, before the first write or registration, so a `#<nodeId>`
     * of the branch translates; one NodeBinding per node owns expression cleanup before installation
     * (`dataSetter`s and defaults), followed by registrations, providers included. On an error the NodeBindings
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
            const nodeId = node.getAttr('nodeId');
            if (nodeId == null) continue;
            if (entering.has(nodeId) || (this.nodeIds.has(nodeId) && this.nodeIds.get(nodeId) !== node)) {
                throw new Error(`Duplicate nodeId '${nodeId}'`);
            }
            entering.set(nodeId, node);
        }
        for (const [nodeId, node] of entering) this.nodeIds.set(nodeId, node);
        try {
            for (const node of nodes) this.openBinding(node);
            this.installer.install(branch);
            for (const node of nodes) {
                if (this.renderer.attached(node)) this.bindingFor(node).registerPointers();
            }
        } catch (error) {
            const errors = [error];
            for (const node of nodes.filter(node => !known.has(node)).reverse()) {
                const nodeId = node.getAttr('nodeId');
                if (entering.get(nodeId) === node && this.nodeIds.get(nodeId) === node) this.nodeIds.delete(nodeId);
                const binding = this.bindingFor(node);
                if (!binding) continue;
                this.#bindings.delete(node);
                try { binding.close(); } catch (closeError) { errors.push(closeError); }
            }
            if (errors.length > 1) throw new AggregateError(errors, 'Source branch installation failed');
            throw error;
        }
        // The nodeIds and childnames that entered can be the start a NodeBinding waits for; the
        // NodeBindings installed here resolved them already.
        const installed = nodes.filter(node => !known.has(node));
        this.#moving(installed.flatMap(node => startKeys(node).slice(1)), installed);
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

    /** The `_onStart` of a built node, then the first request of its `remote`, once. */
    #start(binding) {
        if (binding.hasStamp('start')) return;
        binding.stamp('start');
        this.#lifecycle(binding, 'start', '_onStart');
        binding.remote?.trigger();
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
     * declarations of the changed attributes are released (S09), then the `nodeId` map, then the
     * rebinding of the node, or of its branch for a context attribute.
     */
    #attributesChanged(node, diff) {
        const binding = this.#installedBinding(node);
        this.inlineCompiler.release(node, Object.keys(diff));
        if (Object.hasOwn(diff, 'nodeId')) {
            const {old: previous, new: current} = diff.nodeId;
            if (current != null && this.nodeIds.has(current) && this.nodeIds.get(current) !== node) {
                throw new Error(`Duplicate nodeId '${current}'`);
            }
            if (this.nodeIds.get(previous) === node) this.nodeIds.delete(previous);
            if (current != null) this.nodeIds.set(current, node);
            this.#moving([`id:${previous}`, `id:${current}`]);
        }
        if (Object.hasOwn(diff, 'childname')) this.#moving([`childname:${diff.childname.old}`, `childname:${diff.childname.new}`]);
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
    #binder = null;
    #remote = null;
    // The registrations of `remote` and of the `remote_<k>` parameters: their changes request the fragment again.
    #remoteRegistrations = new Set();
    // The registrations of the `_timing` of a `remote` node: their changes restart its timer.
    #remoteTimingRegistrations = new Set();
    // The clicks of a button, counted for its whole semantic life: a rebuild keeps them (P9, S12).
    #clickCount = 0;
    // The registration of the node's own variable datapath, read in the parent's context.
    #datapathRegistrations = new Set();
    #storeRegistration = null;
    // The starts of the symbolic resolution read by the registrations (BindingRuntime.dependOn).
    #dependencies = new Set();
    editingSession = null;

    constructor(runtime, node) {
        this.#runtime = runtime;
        this.#node = node;
    }

    get runtime() { return this.#runtime; }
    get node() { return this.#node; }
    get closed() { return this.#closed; }
    /** The active DataRegistrations of the node. */
    get registrations() { return [...this.#registrations]; }
    /** The starts of the symbolic resolution read by the active registrations: Source nodes and name keys. */
    get dependencies() { return this.#dependencies; }
    /** The Provider of a `dataFormula`, `dataController`, `dataRpc` or `dataRemote`, as a list of zero or one. */
    get providers() { return this.#provider ? [this.#provider] : []; }
    /** The RemoteBinding of a node whose `remote` attribute is a string, or null. */
    get remote() { return this.#remote; }

    /** The clicks counted by the node's ButtonBinding since the node entered the Source (P9). */
    get clickCount() { return this.#clickCount; }

    /** Count one click of the node's button and return the new count. */
    countClick() {
        return ++this.#clickCount;
    }

    /** Whether the lifecycle step `name` ('init', 'built', 'start') ran for the node. */
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
     * A node whose `remote` is a string gets its RemoteBinding, created once, whose `_timing` starts
     * again from its current value.
     */
    registerPointers() {
        this.runtime.resolveFor(this, () => this.#registerPointers());
    }

    #registerPointers() {
        // Data elements have semantic lifetime but no rendered item to register their reference.
        if (this.node._getMeta('data_element')) {
            this.runtime.renderer.references.remove(this.node);
            this.runtime.renderer.references.register(this.node, null);
        }
        const node = this.node;
        const dataElement = node._getMeta('data_element');
        if (dataElement && !PROVIDERS[node.nodeTag] && node.nodeTag !== 'dataBinder') return;
        if (!dataElement && typeof node.getAttr('remote') === 'string') this.#remote ??= new RemoteBinding(this);
        else if (this.#remote) {
            this.#remote.close();
            this.#remote = null;
        }
        const remoteDependencies = new Set();
        const component = node._getMeta('gramlot_component');
        // A component that declares `storepath` or `structpath` reads data or structure at that
        // address when it draws: a change inside the Bag and a replacement of the Bag at the
        // address reach the node through one subtree registration.
        for (const attribute of ['storepath', 'structpath']) {
            if (!component?.parameters?.[attribute]) continue;
            const store = attribute === 'storepath';
            if (store && node.nodeTag === 'tree' && node.treeStore !== null) {
                const external = node.treeStore;
                const subscription = `gramlot-tree-${randomId()}`;
                external.subscribe(subscription, {any: () => {
                    if (!this.closed && this.runtime.renderer.attached(node)) this.runtime.renderer.project(node);
                }});
                this.#registrations.push({close: () => external.unsubscribe(subscription, {any: true})});
                continue;
            }
            const value = node.getAttr(attribute);
            if (typeof value !== 'string' || !value || /^[\^=]/.test(value) || value.includes('?')) {
                throw new TypeError(`${attribute} requires a plain Bag data path`);
            }
            if (store && node.nodeTag === 'tree' && (value === '*S' || value.startsWith('*S.'))) {
                this.#registrations.push(this.runtime.registerTreeRoot(this, true));
                continue;
            }
            if (store && node.nodeTag === 'tree' && value === '*D') {
                this.#registrations.push(this.runtime.registerTreeRoot(this, false));
                continue;
            }
            const path = store && node.nodeTag === 'tree' && value.startsWith('*D.')
                ? value.slice(3) : node.absDatapath(value);
            const registration = this.runtime.router.register({path, recipient: this, subtree: true});
            this.#registrations.push(registration);
            // Grid receives store invalidations separately. Other Bag consumers
            // (such as tree) continue to receive every ordinary Data event.
            if (store && component.parameters.structpath) this.#storeRegistration = registration;
        }
        // A tree `checked_<attribute>` names a Data path with the legacy syntax `path[:joiner]`: the tree
        // reads that list when it draws, so a change at the path projects the tree again.
        if (node.nodeTag === 'tree') for (const [name, value] of Object.entries(node.getAttr())) {
            if (!name.startsWith('checked_')) continue;
            if (typeof value !== 'string' || !value || /^[\^=]/.test(value)) {
                throw new TypeError(`tree ${name} requires a Data path, optionally followed by :joiner`);
            }
            const path = node.absDatapath(value.split(':')[0]);
            this.#registrations.push(this.runtime.router.register({path, recipient: this}));
        }
        const timingDependencies = this.remote ? pointerDependencies(node, node.getAttr('_timing')) : new Set();
        if (this.remote) for (const [name, raw] of Object.entries(node.getAttr())) {
            if (name.startsWith('remote_')) for (const dependency of pointerDependencies(node, raw)) remoteDependencies.add(dependency);
        }
        for (const [name, pointer] of node.pointers()) {
            if (dataElement && name !== 'datapath') continue;
            const context = name === 'datapath' ? node.parentNode : node;
            const absolute = context.absDatapath(pointer);
            if (absolute === null) continue;
            const [path, attr = null] = absolute.split('?', 2);
            // A component parameter declared with dtype 'X' carries data or structure: a change
            // inside the Bag and a replacement of the Bag at the path reach the node through the
            // same subtree registration, as storepath/structpath above. Write-only parameters
            // are not read by the component and keep the value registration.
            const spec = component?.parameters?.[name];
            const subtree = attr === null && spec !== undefined && spec.binding !== 'write'
                && [spec.dtype].flat().includes('X');
            const registration = this.runtime.router.register({path, attr, recipient: this, subtree});
            this.#registrations.push(registration);
            if (name === 'datapath') this.#datapathRegistrations.add(registration);
            if (this.remote && (name === 'remote' || name.startsWith('remote_') || remoteDependencies.has(name))) this.#remoteRegistrations.add(registration);
            if (this.remote && (name === '_timing' || timingDependencies.has(name))) this.#remoteTimingRegistrations.add(registration);
        }
        if (!dataElement) {
            this.#registerTopics();
            this.remote?.register();
            return;
        }
        if (node.nodeTag === 'dataBinder') {
            this.#binder ??= new DataBinder(this);
            this.#binder.register();
            return;
        }
        this.#provider ??= new PROVIDERS[node.nodeTag](this);
        this.#provider.register();
    }

    /** Rendered node topic handlers share semantic lifetime, not DOM lifetime. */
    #registerTopics() {
        const node = this.node;
        this.#registrations.push(...this.runtime.subscriptions.subscribeNode(node, (name, handler) => {
            if (typeof handler !== 'string' || !handler) throw new TypeError(`${name} requires a handler`);
            return payload => {
                if (this.closed) return;
                if (isLogicMethod(handler)) return callLogic(this.runtime, node, handler, payload);
                const [, attrs] = node.rootBuilder.runtimeValues(node);
                const authored = Object.fromEntries(Object.entries(attrs).filter(([key]) =>
                    !key.startsWith('subscribe_') && !key.startsWith('selfsubscribe_')));
                const values = {...this.runtime.renderer.references.resolveArguments(authored), p_0: payload};
                return this.runtime.inlineCompiler.compile(node, name, handler, Object.keys(values))(values);
            };
        }));
    }

    /** Close the registrations and make them again from the current pointers, the provider's included (D1). */
    rebind() {
        this.#closeRegistrations();
        this.registerPointers();
        this.editingSession?.refreshField(this.node);
    }

    /**
     * Router recipient: the node's datapath rebinds its branch; any other registration projects the node,
     * after a registration of `remote` or of a `remote_<k>` parameter reached the RemoteBinding, and a
     * registration of its `_timing` restarted the timer.
     */
    receive(change) {
        if (change.registration === this.#storeRegistration &&
            (change.level === 'child' || change.evt === 'upd_attrs')) return;
        if (this.#datapathRegistrations.has(change.registration)) {
            this.runtime.rebindBranch(this.node);
            return;
        }
        if (this.#remoteRegistrations.has(change.registration)) this.remote.receive(change);
        if (this.#remoteTimingRegistrations.has(change.registration)) this.remote.register();
        this.editingSession?.refreshField(this.node);
        this.runtime.renderer.project(this.node, change);
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

    /**
     * Send `request`, the request of this node in flight (NodeRequests), through `gramlot.rpc.call` as
     * `contentType`; resolves with the value. The close of the node aborts it until the answer arrives, also
     * when the answer arrived and was not yet received here: the call then rejects with the abort reason.
     * Used by `dataRpc`, `dataRemote` and `remoteSource`.
     */
    async call(contentType, request) {
        const {controller} = request;
        const release = this.track(() => controller.abort());
        try {
            const value = await this.runtime.gramlot.rpc.call(contentType, request.method, request.params,
                {signal: controller.signal});
            if (controller.signal.aborted) throw controller.signal.reason;
            return value;
        } finally {
            release();
        }
    }

    /**
     * Send the synchronous call of `method` with `params` as `contentType` through `gramlot.rpc.callSync` and
     * return its value: the page waits. It follows the rule of the node's requests (`submitSync`): no request of
     * the node in flight, a method within the name syntax. Used by a `dataRemote` with `sync`.
     */
    callSync(contentType, method, params) {
        return this.node.requests.submitSync(method,
            () => this.runtime.gramlot.rpc.callSync(contentType, method, params));
    }

    /** Close the registrations, then run the disposers in reverse order and collect their errors. */
    close() {
        if (this.closed) return;
        this.#closed = true;
        this.#remote?.close();
        if (this.node._getMeta('data_element')) this.runtime.renderer.references.remove(this.node);
        this.#closeRegistrations();
        const errors = [];
        for (const disposer of this.#disposers.splice(0).reverse()) {
            try { disposer(); } catch (error) { errors.push(error); }
        }
        if (errors.length) throw new AggregateError(errors, `NodeBinding of '${this.node.label}' cleanup failed`);
    }

    #closeRegistrations() {
        this.runtime.releaseDependencies(this);
        this.#binder?.unregister();
        for (const registration of this.#registrations.splice(0)) registration.close();
        this.#storeRegistration = null;
        this.#datapathRegistrations.clear();
        this.#remoteRegistrations.clear();
        this.#remoteTimingRegistrations.clear();
    }
}
