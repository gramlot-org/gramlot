/* @ts-self-types="./index-page-runtime.d.ts" */
import {Bag} from '@genrojs/bag';
import {sourceTarget} from '@genrojs/builders';

/** Coordinate a declared navigation Bag and tabContainer through Source and Data.
 * Region contents, drawer presentation, themes and application controls belong to the Page.
 */
export function mountIndexPage(renderer, root, onSelection = () => {}, prepareEntry = () => {},
    {state = root.builder.data.getItem(root.getAttr('datapath')), createEntry = null,
        onLoad = () => {}} = {}) {
    const navigation = state.getItem('navigation');
    if (!(navigation instanceof Bag)) throw new TypeError('IndexPage navigation must be a Bag');
    const tabs = root.value.getNode('frame.center.tabs');
    const builder = root.builder;
    const entries = new Map();
    let disposed = false, selecting = false, sequence = 0, requested = null;
    const opened = state.getItem('opened');
    for (const record of opened.getNodes()) {
        const {url, path, title} = record.attr;
        const pane = tabs.value.getNode(record.label);
        const entry = {url, path, title, pane, node: navigation.getNode(path), loading: false};
        prepareEntry(entry);
        entries.set(url, entry);
        sequence++;
    }
    const activate = entry => {
        if (disposed) return;
        selecting = true;
        try {
            state.setItem('active', entry.url);
            state.setItem('navigationSelection', entry.path);
            onSelection(entries, entry.url);
        } finally { selecting = false; }
    };
    // Includes validation and preparation errors before the asynchronous load starts.
    function requestSelection(path) {
        void select(path).catch(error => {
            if (!disposed) renderer.binding.reportError(error, 'Page could not be opened');
        });
    }
    async function select(path) {
        const node = navigation.getNode(path);
        if (!node) throw new Error(`Unknown index navigation path: ${path}`);
        const url = node.attr.url;
        if (url == null) return; // A folder may have children without its own page.
        if (typeof url !== 'string' || !url) throw new TypeError('IndexPage URL must be nonempty text');
        requested = url;
        let entry = entries.get(url);
        if (entry) {
            entry.path = path;
            activate(entry);
            return;
        }
        while (tabs.value !== null && tabs.value.getNode(`page${sequence}`)) sequence++;
        const pane = sourceTarget(builder.wrapSource(tabs).contentPane({node_label: `page${sequence++}`,
            title: node.attr.title ?? node.label, pageName: url, height: '100%', closable: true}));
        const previous = state.getItem('active');
        entry = {url, path, node, pane, title: node.attr.title ?? node.label, loading: true};
        entries.set(url, entry);
        try {
            activate(entry);
            onLoad(url, 'loading');
            if (createEntry) await createEntry(entry);
            else {
                const selection = new Bag();
                selection.setItem(node.label, null, {...node.attr});
                const mounted = await renderer.binding.gramlot.src.remoteSource(pane, 'index_panel', {selection});
                if (!mounted) throw new Error('Panel loading was cancelled');
            }
            if (disposed || entries.get(url) !== entry) return;
            entry.loading = false;
            opened.setItem(pane.label, null, {url, path: entry.path, title: entry.title});
            prepareEntry(entry);
            if (requested === url) { onLoad(url, 'ready'); activate(entry); }
        } catch (error) {
            if (disposed || entries.get(url) !== entry) return;
            renderer.binding.reportError(error, 'Page could not be opened');
            entries.delete(url);
            if (opened.getNode(pane.label)) opened.popNode(pane.label);
            if (pane.parentBag) pane.parentBag.popNode(pane.label);
            if (!disposed && requested === url) {
                onLoad(url, 'error', error);
                const restored = entries.get(previous);
                requested = restored?.url ?? null;
                if (restored) activate(restored);
                else {
                    selecting = true;
                    try {
                        state.setItem('active', null);
                        state.setItem('navigationSelection', null);
                        onSelection(entries, null);
                    } finally { selecting = false; }
                }
            }
        }
    }
    const sourceSubscription = `${root.getAttr('id')}-page-close`;
    root.value.subscribe(sourceSubscription, {any: event => {
        if (event.evt !== 'del') return;
        const entry = [...entries.values()].find(candidate => candidate.pane === event.node);
        if (!entry) return;
        const {url, pane} = entry;
        if (disposed || renderer.disposed || entries.get(url) !== entry) return;
        entries.delete(url);
        if (opened.getNode(pane.label)) opened.popNode(pane.label);
        if (state.getItem('active') === url) {
            const next = [...entries.values()].at(-1);
            requested = next?.url ?? null;
            if (next) activate(next);
            else {
                selecting = true;
                try { state.setItem('active', null); state.setItem('navigationSelection', null); onSelection(entries, null); }
                finally { selecting = false; }
            }
        } else onSelection(entries, state.getItem('active'));
    }});
    const subscription = `${root.getAttr('id')}-selection`;
    state.subscribe(subscription, {any: event => {
        if (selecting || disposed) return;
        if (event.node === state.getNode('navigationSelection')) {
            const path = state.getItem('navigationSelection');
            if (path !== null) requestSelection(path);
        } else if (event.node === state.getNode('active')) {
            const entry = entries.get(state.getItem('active'));
            if (entry) { requested = entry.url; activate(entry); }
        }
    }});
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        state.unsubscribe(subscription, {any: true});
        root.value.unsubscribe(sourceSubscription, {any: true});
        for (const entry of entries.values()) if (entry.loading && entry.pane.parentBag) {
            entry.pane.parentBag.popNode(entry.pane.label);
        }
    };
    renderer.onDispose(root, dispose);
    const active = entries.get(state.getItem('active'));
    if (active) activate(active);
    else if (state.getItem('navigationSelection') !== null) requestSelection(state.getItem('navigationSelection'));
    return {entries, dispose};
}

/** Re-export as the page's Logic; application Logic may delegate to indexMount. */
export class IndexLogic {
    indexMount(node, {shell_id}) {
        const renderer = this.page.src.renderer;
        const element = renderer.destination.ownerDocument.getElementById(shell_id);
        this.index = mountIndexPage(renderer, renderer.elements.get(element).node);
    }
}
export {THEME_READY, THEME_SET, THEMES, APPEARANCES} from './index-theme.js';
