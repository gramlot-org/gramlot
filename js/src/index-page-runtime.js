/* @ts-self-types="./index-page-runtime.d.ts" */
import {Bag} from '@genrojs/bag';

/** Coordinate a declared navigation Bag and tabContainer through Source and Data.
 * Region contents, drawer presentation, themes and application controls belong to the Page.
 */
export function mountIndexPage(renderer, root, onSelection = () => {}, prepareEntry = () => {},
    {state = root.absDatapath('.'), createEntry = null,
        onLoad = () => {}} = {}) {
    // The coordinator keeps the Data path of its state and its own Source node; every Bag and every
    // other node is read at its address when it is used.
    if (typeof state !== 'string' || !state) throw new TypeError('IndexPage state must be a Data path');
    const data = renderer.binding.gramlot.data;
    const read = name => data.getItem(`${state}.${name}`);
    const write = (name, value) => data.setItem(`${state}.${name}`, value);
    const navigation = () => read('navigation');
    if (!(navigation() instanceof Bag)) throw new TypeError('IndexPage navigation must be a Bag');
    const tabs = () => root.value.getNode('frame.center.tabs');
    const builder = root.builder;
    const entries = new Map();
    const context = {entries, disposed: false, selecting: false, sequence: 0, requested: null};
    root._internal.indexContext = context;
    // `pane` and `node` resolve the tab panel and the navigation node by label and path on each access.
    const createRecord = ({url, path, title, paneLabel, loading}) => ({url, path, title, paneLabel, loading,
        get pane() { return tabs().value?.getNode(this.paneLabel) ?? null; },
        get node() { return navigation().getNode(this.path); }});
    for (const record of read('opened').getNodes()) {
        const {url, path, title} = record.attr;
        const entry = createRecord({url, path, title, paneLabel: record.label, loading: false});
        prepareEntry(entry);
        entries.set(url, entry);
        context.sequence++;
    }
    const notifyLoad = (entry, status, error) => {
        try { onLoad(entry.url, status, error); }
        catch (callbackError) { renderer.binding.reportError(callbackError, 'Page load callback failed'); }
    };
    const finishLoad = (entry, status, error) => {
        if (!entry.loading) return;
        entry.loading = false;
        notifyLoad(entry, status, error);
    };
    const activate = entry => {
        if (context.disposed) return;
        context.selecting = true;
        try {
            write('active', entry.url);
            write('navigationSelection', entry.path);
            onSelection(entries, entry.url);
        } finally { context.selecting = false; }
    };
    const forget = paneLabel => {
        if (read('opened').getNode(paneLabel)) read('opened').popNode(paneLabel);
    };
    // Includes validation and preparation errors before the asynchronous load starts.
    function requestSelection(path) {
        void select(path).catch(error => {
            if (!context.disposed) renderer.binding.reportError(error, 'Page could not be opened');
        });
    }
    async function select(path) {
        const node = navigation().getNode(path);
        if (!node) throw new Error(`Unknown index navigation path: ${path}`);
        const url = node.attr.url;
        if (url == null) return; // A folder may have children without its own page.
        if (typeof url !== 'string' || !url) throw new TypeError('IndexPage URL must be nonempty text');
        context.requested = url;
        let entry = entries.get(url);
        if (entry) {
            entry.path = path;
            activate(entry);
            return;
        }
        while (tabs().value !== null && tabs().value.getNode(`page${context.sequence}`)) context.sequence++;
        const paneLabel = `page${context.sequence++}`;
        const title = node.attr.title ?? node.label;
        builder.wrapSource(tabs()).contentPane({node_label: paneLabel,
            title, pageName: url, height: '100%', closable: true});
        const previous = read('active');
        entry = createRecord({url, path, title, paneLabel, loading: true});
        entries.set(url, entry);
        try {
            notifyLoad(entry, 'loading');
            if (context.disposed || entries.get(url) !== entry) return;
            activate(entry);
            if (context.disposed || entries.get(url) !== entry) return;
            if (createEntry) await createEntry(entry);
            else {
                const selection = new Bag();
                const selected = entry.node;
                selection.setItem(selected.label, null, {...selected.attr});
                const mounted = await renderer.binding.gramlot.src.remoteSource(entry.pane, 'index_panel', {selection});
                if (!mounted) throw new Error('Panel loading was cancelled');
            }
            if (context.disposed || entries.get(url) !== entry) return;
            read('opened').setItem(paneLabel, null, {url, path: entry.path, title: entry.title});
            prepareEntry(entry);
        } catch (error) {
            if (context.disposed || entries.get(url) !== entry) return;
            try {
                renderer.binding.reportError(error, 'Page could not be opened');
                entries.delete(url);
                forget(paneLabel);
                if (entry.pane) tabs().value.popNode(paneLabel);
                if (!context.disposed && context.requested === url) {
                    const restored = entries.get(previous);
                    context.requested = restored?.url ?? null;
                    if (restored) activate(restored);
                    else {
                        context.selecting = true;
                        try {
                            write('active', null);
                            write('navigationSelection', null);
                            onSelection(entries, null);
                        } finally { context.selecting = false; }
                    }
                }
            } finally { finishLoad(entry, 'error', error); }
            return;
        }
        if (context.disposed || entries.get(url) !== entry) return;
        finishLoad(entry, 'ready');
        if (!context.disposed && entries.get(url) === entry && context.requested === url) activate(entry);
    }
    // Source structure: a panel removed from the tabs, by the user or by the application, closes its entry.
    const sourceSubscription = `${root.getAttr('id')}-page-close`;
    root.value.subscribe(sourceSubscription, {any: event => {
        if (event.evt !== 'del' || (event.pathlist ?? []).join('.') !== 'frame.center.tabs') return;
        const entry = [...entries.values()].find(candidate => candidate.paneLabel === event.node.label);
        if (!entry) return;
        const {url, paneLabel} = entry;
        if (context.disposed || renderer.disposed || entries.get(url) !== entry) return;
        entries.delete(url);
        forget(paneLabel);
        try {
            if (read('active') === url) {
                const next = [...entries.values()].at(-1);
                context.requested = next?.url ?? null;
                if (next) activate(next);
                else {
                    context.selecting = true;
                    try { write('active', null); write('navigationSelection', null); onSelection(entries, null); }
                    finally { context.selecting = false; }
                }
            } else onSelection(entries, read('active'));
        } finally { finishLoad(entry, 'cancelled'); }
    }});
    // Data: a change at navigationSelection or active, written by the tree or the tabs, selects a page.
    const router = renderer.binding.router;
    const registrations = [
        router.register({path: `${state}.navigationSelection`, recipient: {receive: () => {
            if (context.selecting || context.disposed) return;
            const path = read('navigationSelection');
            if (path !== null) requestSelection(path);
        }}}),
        router.register({path: `${state}.active`, recipient: {receive: () => {
            if (context.selecting || context.disposed) return;
            const entry = entries.get(read('active'));
            if (entry) { context.requested = entry.url; activate(entry); }
        }}})];
    const dispose = () => {
        if (context.disposed) return;
        context.disposed = true;
        for (const registration of registrations) registration.close();
        root.value.unsubscribe(sourceSubscription, {any: true});
        for (const entry of entries.values()) if (entry.loading) {
            if (entry.pane) tabs().value.popNode(entry.paneLabel);
            finishLoad(entry, 'cancelled');
        }
        entries.clear();
        if (root._internal.indexContext === context) delete root._internal.indexContext;
    };
    context.dispose = dispose;
    renderer.onDispose(root, dispose);
    const active = entries.get(read('active'));
    if (active) activate(active);
    else if (read('navigationSelection') !== null) requestSelection(read('navigationSelection'));
    return context;
}

/** Re-export as the page's Logic; application Logic may delegate to indexMount. */
export class IndexLogic {
    indexMount(node) {
        mountIndexPage(this.page.src.renderer, node.parentNode);
    }
}
export {THEME_READY, THEME_SET, THEMES, APPEARANCES} from './index-theme.js';
