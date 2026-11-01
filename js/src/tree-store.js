import {Bag, BagResolver, registerResolver} from '@genrojs/bag';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {GramlotBuilder} from './builder/gramlot-builder.js';
import {randomId} from './random-id.js';

/** A branch whose loader is supplied by its owning TreeStore after transport. */
export class TreeStoreResolver extends BagResolver {
    constructor({readOnly = false} = {}) {
        super({cacheTime: -1, readOnly});
        this.store = null;
        this.path = null;
        this.pending = null;
    }
    bind(store, path) {
        if (this.store !== null) throw new Error('TreeStoreResolver is already bound');
        this.store = store;
        this.path = path;
    }
    load() {
        if (this.store === null) throw new Error('TreeStoreResolver is not bound to a store');
        if (this.pending !== null) return this.pending;
        const node = this.node;
        const path = this.path ? this.store.pathFor(node) : '';
        const pending = this.store.load(path, path ? node.label : null, path ? {...node.attr} : {});
        this.pending = pending;
        pending.finally(() => { if (this.pending === pending) this.pending = null; }).catch(() => {});
        return pending;
    }
}

registerResolver(TreeStoreResolver, {
    module: 'gramlot.tree_store', name: 'TreeStoreResolver',
    encode: () => ({args: [], kwargs: {}}),
    decode: () => new TreeStoreResolver(),
});

/** One RPC method supplies the root and every lazy branch of a Data Bag. */
export class TreeStore {
    constructor({gramlot, method, params = {}}) {
        if (!gramlot || typeof method !== 'string' || !method) throw new TypeError('TreeStore requires a page and method');
        for (const key of ['path', 'label', 'attributes']) {
            if (Object.hasOwn(params, key)) throw new TypeError(`TreeStore params reserves ${key}`);
        }
        this.gramlot = gramlot;
        this.method = method;
        this.params = {...params};
        this.controller = new AbortController();
        this.root = null;
    }
    pathFor(node) {
        const labels = [];
        while (node && node.parentBag !== this.root) {
            labels.unshift(node.label);
            node = node.parentNode;
        }
        if (!node || this.root === null) throw new Error('TreeStore node is outside its root');
        labels.unshift(node.label);
        return labels.join('.');
    }
    async load(path = '', label = null, attributes = {}) {
        if (this.controller.signal.aborted) throw this.controller.signal.reason;
        const result = await this.gramlot.rpc.call('data', this.method,
            {...this.params, path, label, attributes}, {signal: this.controller.signal});
        if (this.controller.signal.aborted) throw this.controller.signal.reason;
        if (!(result instanceof Bag)) throw new TypeError('TreeStore method must return a Bag');
        if (!path) {
            this.root = result;
            result.setBackref();
        }
        const bind = (bag, prefix) => {
            for (const node of bag.getNodes()) {
                const nodePath = prefix ? `${prefix}.${node.label}` : node.label;
                if (node.resolver instanceof TreeStoreResolver) node.resolver.bind(this, nodePath);
                if (node.staticValue instanceof Bag) bind(node.staticValue, nodePath);
            }
        };
        bind(result, path);
        return result;
    }
    dispose() { this.controller.abort(); }
}

/** Source lifecycle for the Python tree_store composition. */
export class TreeStoreLogic {
    treeFavoriteActionState(node, {item, state}) {
        const hidden = item.resolver !== null || item.staticValue instanceof Bag;
        if (item.getAttr('favoriteEntry') === true) return {hidden: false, icon: '✕', title: 'Remove favorite'};
        const saved = !hidden && state.getNodes().some(favorite => favorite.getAttr('fieldpath') === item.getAttr('fieldpath'));
        return {hidden, icon: saved ? '♥' : '♡', title: saved ? 'Remove favorite' : 'Add favorite'};
    }

    treeFavoritesMount(node, {favoriteKey}) {
        const storage = this.page.src.renderer.destination.ownerDocument.defaultView.localStorage;
        const saved = storage.getItem(favoriteKey);
        this.setTreeFavorites(node.getRelativeData('.'), saved === null ? [] : fromTytx(saved));
    }

    setTreeFavorites(state, records) {
        if (!Array.isArray(records)) throw new TypeError('Tree favorites must be an array');
        const favorites = new Bag();
        records.forEach((record, index) => {
            if (!record || typeof record.fieldpath !== 'string' || typeof record.path !== 'string' ||
                typeof record.caption !== 'string' || !record.attrs || typeof record.attrs !== 'object') {
                throw new TypeError('Invalid tree favorite');
            }
            const attrs = {...record.attrs};
            for (const name of ['caption', 'fullcaption']) {
                if (typeof attrs[name] === 'string')
                    attrs[name] = attrs[name].replace(/(^|\.)!!(?:\[[^\]]+\])?/g, '$1');
            }
            favorites.setItem(`favorite_${index}`, null, {...attrs,
                favoriteEntry: true, originalPath: record.path});
        });
        state.setItem('favorites', favorites);
    }

    treeFavoriteToggle(node, {item, path, favoriteKey}) {
        if (item.resolver || item.staticValue instanceof Bag) return;
        const attrs = item.getAttr();
        const state = node.getRelativeData('.');
        const records = state.getItem('favorites').getNodes().map(favorite => {
            const {favoriteEntry, originalPath, ...attributes} = favorite.getAttr();
            return {fieldpath: attributes.fieldpath, path: originalPath, caption: attributes.caption, attrs: attributes};
        });
        const index = records.findIndex(record => record.fieldpath === attrs.fieldpath);
        if (index === -1) records.push({fieldpath: attrs.fieldpath, path, caption: attrs.caption, attrs: {...attrs}});
        else records.splice(index, 1);
        const storage = this.page.src.renderer.destination.ownerDocument.defaultView.localStorage;
        storage.setItem(favoriteKey, toTytx(records));
        this.setTreeFavorites(state, records);
    }

    treeStoreMount(node, {storeMethod, storeParams}) {
        const scope = node.parentNode;
        const state = node.getRelativeData('.');
        const store = new TreeStore({gramlot: this.page, method: storeMethod, params: storeParams});
        this.page.src.renderer.onDispose(scope, () => store.dispose());
        const resolver = new TreeStoreResolver({readOnly: true});
        resolver.bind(store, '');
        state.setResolver('store', resolver);
        return Promise.resolve(state.getItem('store')).then(value => {
            if (!store.controller.signal.aborted) state.setItem('store', value);
        });
    }

    treeInspect(node, {item, path}) {
        const binding = this.page.src.binding.bindingFor(node);
        let closed = false;
        const id = `tree_inspect_${randomId()}`;
        let release = () => {};
        const close = () => {
            if (closed) return;
            closed = true;
            release();
            if (this.page.src.source.getNode(id)) this.page.src.source.popNode(id);
        };
        release = binding.track(close);
        try {
            const builder = new GramlotBuilder();
            const dialog = builder.root.html_dialog({nodeId: id, request: id,
                connect_oncancel: 'treeInspectClose', connect_onclose: 'treeInspectClose',
                'aria-labelledby': `${id}_title`,
                style: 'width:min(36rem,calc(100% - 48px));max-height:80vh;overflow:auto;'});
            dialog.h2('Attributes', {id: `${id}_title`});
            dialog.p(`==${JSON.stringify(path)}`);
            dialog.html_button('Close', {type: 'button', autofocus: true, request: id, connect_onclick: 'treeInspectClose'});
            const table = dialog.table();
            for (const [name, value] of Object.entries(item.getAttr())) {
                const row = table.tr();
                row.th(`==${JSON.stringify(name)}`, {scope: 'row'});
                const text = typeof value === 'string' ? value : value === undefined ? 'undefined' : toTytx(value);
                row.td(`==${JSON.stringify(text)}`);
            }
            this.page.src.source.setItem(id, this.page.src.prepareSource(builder.source));
            const dialogNode = this.page.src.binding.nodeIds.get(id);
            Object.defineProperty(dialogNode, 'treeInspectClose', {value: close, configurable: true});
            this.page.src.renderer.onDispose(dialogNode, () => {
                close();
                delete dialogNode.treeInspectClose;
            });
            this.page.dom.getDomNode(dialogNode).showModal();
        } catch (error) {
            close();
            throw error;
        }
    }

    treeInspectClose(node, event) {
        event.preventDefault();
        const dialog = this.page.src.binding.nodeIds.get(node.getAttr('request'));
        if (dialog) dialog.treeInspectClose();
    }
}
