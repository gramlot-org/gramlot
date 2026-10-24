import {Bag} from '@genrojs/bag';
import {RemoteResolver} from './binding/remote-resolver.js';

/** One directory per request; the host owns filesystem access. */
export class DirectoryResolver extends RemoteResolver {
    static internalParams = new Set([...RemoteResolver.internalParams, 'gramlot', 'method', 'params', 'onError']);
    #closed = false;
    #controller = null;
    constructor({gramlot, root, path = '', onError}) {
        super({cacheTime: -1, onError});
        this.gramlot = gramlot;
        this.method = 'directory_tree';
        this.params = {root, path};
        this.children = new Set();
    }
    get closed() { return this.#closed; }
    startLoad(perform) {
        if (this.loading) return this.loading;
        const controller = new AbortController();
        this.#controller = controller;
        return perform({controller, method: this.method, params: this.params, ignored: false});
    }
    async loadAsync({controller, method, params}) {
        const {signal} = controller;
        let abort;
        const cancelled = new Promise((_, reject) => {
            abort = () => reject(signal.reason);
            signal.addEventListener('abort', abort, {once: true});
        });
        try {
            const value = await Promise.race([this.gramlot.rpc.call('data', method, params, {signal}), cancelled]);
            if (signal.aborted) throw signal.reason;
            return value;
        } finally {
            signal.removeEventListener('abort', abort);
            if (this.#controller === controller) this.#controller = null;
        }
    }
    prepareValue(bag) {
        if (!(bag instanceof Bag)) throw new TypeError('directory_tree must return a Bag');
        for (const child of this.children) child.abort();
        this.children.clear();
        for (const node of bag.getNodes()) {
            if (node.attr.is_directory) {
                const resolver = new DirectoryResolver({gramlot: this.gramlot, root: this.params.root,
                    path: node.attr.path, onError: this.onError});
                this.children.add(resolver);
                bag.setResolver(node.label, resolver);
            }
        }
        return bag;
    }
    abort() {
        this.#closed = true;
        this.#controller?.abort();
        for (const child of this.children) child.abort();
        this.children.clear();
    }
}

/** Own directory requests; the selection and store remain in the component's Data Bag. */
export class FileSystemController {
    constructor(gramlot, state) {
        this.gramlot = gramlot;
        this.state = state;
        this.request = null;
        this.resolver = null;
        this.disposed = false;
    }
    async open(root) {
        this.request?.abort();
        const request = this.request = new AbortController();
        this.state.setItem('status', 'Opening directory…');
        try {
            const result = await this.gramlot.rpc.call('data', 'workspace_open', {root}, {signal:request.signal});
            if (this.disposed || request.signal.aborted) return null;
            const resolver = new DirectoryResolver({gramlot:this.gramlot, root:result.root,
                onError:error => this.state.setItem('status', error.message)});
            const store = resolver.prepareValue(result.entries);
            this.resolver?.abort();
            this.resolver = resolver;
            this.state.setItem('selectedPath', null);
            this.state.setItem('store', store);
            this.state.setItem('writable', result.writable);
            this.state.setItem('root', result.root);
            this.state.setItem('status', '');
            return result.root;
        } catch (error) {
            if (!this.disposed && !request.signal.aborted) this.state.setItem('status', error.message);
            return null;
        } finally { if (this.request === request) this.request = null; }
    }
    dispose() { this.disposed = true; this.request?.abort(); this.resolver?.abort(); }
}

/** Named Logic used by the reusable Source composition; instances are scoped by Data. */
export class FileSystemLogic {
    fileSystemMount(node) {
        this.fileSystems ??= new WeakMap();
        const scope = node.parentNode, state = scope.getRelativeData('.');
        const controller = new FileSystemController(this.page, state);
        this.fileSystems.set(state, controller);
        this.page.src.renderer.onDispose(scope, () => controller.dispose());
    }
    fileSystemOpen(node, {root}) {
        if (root) return this.fileSystems.get(node.getRelativeData('.')).open(root);
    }
}

export function fileSystemTree(parent, {datapath, ...attributes}) {
    const pane = parent.div({datapath, class:'gramlot-filesystem', ...attributes});
    pane.dataSetter({destination_path:'.store', value:new Bag()});
    pane.dataSetter({destination_path:'.root', value:null});
    pane.dataSetter({destination_path:'.requestedRoot', value:null});
    pane.dataSetter({destination_path:'.selectedPath', value:null});
    pane.dataSetter({destination_path:'.status', value:''});
    pane.dataController({func:'fileSystemMount', _onBuilt:true});
    pane.dataController({func:'fileSystemOpen', root:'^.requestedRoot'});
    pane.tree({storepath:'.store', selectedPath:'^.selectedPath', labelAttribute:'caption', hideValues:true,
        class:'gramlot-filesystem-tree'});
    pane.div('^.status', {role:'status', class:'gramlot-filesystem-status'});
    return pane;
}
