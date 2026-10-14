// Copyright 2025-2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
// Bounded adaptation of gramlot-devtools/vendor/gramlot-poc/js/dom/src/collections/storetree.js.
// Provenance, omissions and replacement contract: ports/PORT-0006-inspector-components/README.md.
import {Bag} from '@gramlot/gramlot';
import css from './gramlot-poc-tree.css';

let sequence = 0;

/** Provisional inspector tree. The caller explicitly supplies a Bag in this realm. */
export class GramlotPocTree extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        const style = this.ownerDocument.createElement('style');
        style.textContent = css;
        this._root = this.ownerDocument.createElement('div');
        this._root.className = 'tree-root';
        shadow.append(style, this._root);
        this._store = null;
        this._selectedPath = null;
        this._expanded = new Set();
        this._nodes = new Map();
        this._rowActions = [];
        this._pendingRender = null;
        this._subId = `gramlot-poc-tree-${++sequence}`;
    }

    get storeBag() { return this._store; }
    set storeBag(bag) {
        if (bag !== null && !(bag instanceof Bag)) throw new TypeError('storeBag requires a Bag or null');
        if (bag === this._store) return;
        if (this.isConnected && this._store) this._store.unsubscribe(this._subId, {any: true});
        this._store = bag;
        this._selectedPath = null;
        this._expanded.clear();
        this._root.replaceChildren();
        if (this.isConnected) {
            this._subscribe();
            this._render();
        }
    }

    get selectedPath() { return this._selectedPath; }
    set selectedPath(path) {
        if (path !== null && typeof path !== 'string') throw new TypeError('selectedPath requires a string or null');
        this._selectedPath = path;
        if (this.isConnected) this._markSelection();
    }

    get rowActions() { return this._rowActions; }
    set rowActions(actions) {
        if (!Array.isArray(actions) || actions.some(action => !action || typeof action.id !== 'string'
            || !action.id || typeof action.label !== 'string' || !action.label)) {
            throw new TypeError('rowActions requires actions with id and label');
        }
        this._rowActions = actions.map(action => ({...action}));
        if (this.isConnected) this._render();
    }

    connectedCallback() { this._subscribe(); this._render(); }
    disconnectedCallback() {
        this._pendingRender = null;
        if (this._store) this._store.unsubscribe(this._subId, {any: true});
    }

    _subscribe() {
        if (this._store) this._store.subscribe(this._subId, {any: () => {
            if (this._pendingRender) return;
            const pending = this._pendingRender = {};
            queueMicrotask(() => {
                if (this._pendingRender === pending && this.isConnected) this._render();
            });
        }});
    }

    _render() {
        this._pendingRender = null;
        // Read open state before replacing rows; a native toggle notification can still be queued.
        for (const details of this._root.querySelectorAll('details')) {
            if (details.open) this._expanded.add(details.dataset.path);
            else this._expanded.delete(details.dataset.path);
        }
        this._nodes.clear();
        this._root.replaceChildren(...(this._store ? [this._buildLevel(this._store, '', new Set())] : []));
        if (this._selectedPath !== null && !this._nodes.has(this._selectedPath)) {
            this._selectedPath = null;
            this._notifySelection();
        }
    }

    _buildLevel(bag, prefix, ancestors) {
        if (ancestors.has(bag)) throw new TypeError('gramlot-poc-tree requires an acyclic Bag');
        const nextAncestors = new Set([...ancestors, bag]);
        const document = this.ownerDocument;
        const list = document.createElement('ul');
        for (const node of bag.getNodes()) {
            const path = prefix ? `${prefix}.${node.label}` : node.label;
            this._nodes.set(path, node);
            // Inspecting must not run a resolver, including when the row is expanded.
            const value = node.getValue(true);
            const item = document.createElement('li');
            let row;
            if (!node.resolver && value instanceof Bag) {
                const details = document.createElement('details');
                details.dataset.path = path;
                details.open = this._expanded.has(path);
                row = document.createElement('summary');
                details.append(row, this._buildLevel(value, path, nextAncestors));
                item.append(details);
            } else {
                row = item;
                row.className = 'leaf';
                row.tabIndex = 0;
                row.addEventListener('keydown', event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        this._select(path);
                    }
                });
            }
            row.dataset.nodePath = path;
            row.classList.toggle('selected', path === this._selectedPath);
            const caption = document.createElement('span');
            caption.className = 'caption';
            caption.textContent = node.label;
            row.append(caption);
            row.addEventListener('click', () => this._select(path));
            this._actions(row, path, node);
            list.append(item);
        }
        return list;
    }

    _actions(row, path, node) {
        if (!this._rowActions.length) return;
        const actions = this.ownerDocument.createElement('span');
        actions.className = 'actions';
        for (const action of this._rowActions) {
            const button = this.ownerDocument.createElement('button');
            button.type = 'button';
            button.textContent = action.icon ?? action.label;
            button.title = action.label;
            button.setAttribute('aria-label', action.label);
            button.dataset.action = action.id;
            button.classList.toggle('active', action.activePaths?.includes(path) ?? false);
            button.classList.toggle('conditional', action.conditionalPaths?.includes(path) ?? false);
            button.addEventListener('click', event => {
                event.preventDefault(); event.stopPropagation();
                this.dispatchEvent(new this.ownerDocument.defaultView.CustomEvent('tree-action', {
                    bubbles: true, composed: true, detail: {action: action.id, path, node},
                }));
            });
            actions.append(button);
        }
        row.append(actions);
    }

    _markSelection() {
        for (const row of this._root.querySelectorAll('[data-node-path]')) {
            row.classList.toggle('selected', row.dataset.nodePath === this._selectedPath);
        }
    }

    _select(path) {
        this._selectedPath = path;
        this._markSelection();
        this._notifySelection();
    }

    _notifySelection() {
        this.dispatchEvent(new this.ownerDocument.defaultView.CustomEvent('change', {
            bubbles: true, composed: true,
            detail: {path: this._selectedPath, node: this._nodes.get(this._selectedPath) ?? null},
        }));
    }
}

customElements.define('gramlot-poc-tree', GramlotPocTree);
