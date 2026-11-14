/** Bag hierarchy, lazy branch expansion, captions and path selection. */
import {Bag} from '@genrojs/bag';
import createDOMPurify from 'dompurify';
import {defineComponent, defineCollection} from './registry.js';
import {Container} from './container.js';
import {SVG_NS} from '../renderer/attributes.js';

export const RowActions = defineComponent({
    name: 'rowActions', tag: 'gramlot-row-actions', base: Container,
    subTags: 'button,dropDownButton', sourceContext: true, parameters: {
        position: {dtype: 'T', default: 'end'},
        actionState: {dtype: 'T', nullable: true, default: null},
        state: {dtype: 'X', nullable: true, default: null, binding: 'read'}
    },
    implementation: Base => class extends Base {
        #rowContext = null;
        #context;
        connectedCallback() { this.slot = 'row-actions'; this.hidden = true; }
        setSourceContext(context) { this.#context = context; }
        /** Keep the row's tree `path`; `read` gives the row's item at each use, or null when the row is gone. */
        setRowContext(path, read) { this.#rowContext = {path, read}; this.#refresh(); }
        getRowContext() {
            if (!this.#rowContext) return null;
            const {path, read} = this.#rowContext, item = read();
            return item ? {item, path} : null;
        }
        clearRowContext() { this.#rowContext = null; this.hidden = true; }
        // `state` is a `^` parameter of dtype 'X': a change inside the Bag or a replacement at its address
        // projects the bar again, and actionState receives the value read at that address for the call.
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            if (!['start', 'end'].includes(this.parameters.position)) throw new TypeError('rowActions position must be start or end');
            this.#refresh();
            return rest;
        }
        #refresh() {
            const context = this.getRowContext();
            if (!context || !this.parameters.actionState) return;
            for (const action of this.children) {
                const code = action.getAttribute('rowAction');
                if (code === null) continue;
                const presentation = this.#context.callLogic(this.parameters.actionState,
                    {...context, action: code, state: this.#context.getStaticData(this.#context.attrDatapath('state'))});
                if (!presentation || typeof presentation.hidden !== 'boolean' ||
                    typeof presentation.icon !== 'string' || typeof presentation.title !== 'string') {
                    throw new TypeError('rowActions actionState must return hidden, icon and title');
                }
                action.setActionPresentation(presentation);
            }
        }
    }
});

export const Tree = defineComponent({
    name: 'tree', tag: 'gramlot-tree', base: Container, subTags: 'rowActions[:1]', sourceContext: true, dragSource: true,
    parameters: {
        storepath: {dtype: 'T'},
        draggable: {dtype: 'B', default: false, binding: 'read'},
        labelAttribute: {dtype: 'T', nullable: true, default: null, binding: 'read'},
        internalNames: {dtype: 'B', default: false, binding: 'read'},
        hideValues: {dtype: 'B', default: false, binding: 'read'},
        excludeRoot: {dtype: 'T', nullable: true, default: null, binding: 'read'},
        labelCb: {dtype: 'T', nullable: true, default: null},
        getLabel: {dtype: 'T', nullable: true, default: null},
        labelState: {dtype: 'X', nullable: true, default: null, binding: 'read'},
        getLabelClass: {dtype: 'T', nullable: true, default: null},
        getIconClass: {dtype: 'T', nullable: true, default: null},
        selectedLabelClass: {dtype: 'T', default: '', binding: 'read'},
        searchText: {dtype: 'T', default: '', binding: 'read'},
        searchEager: {dtype: 'B', default: true, binding: 'read'},
        searchAttributes: {dtype: 'T', default: '', binding: 'read'},
        favorites: {dtype: 'X', nullable: true, default: null, binding: 'read'},
        favoritesLabel: {dtype: 'T', default: 'Favorites', binding: 'read'},
        autoCollapse: {dtype: 'B', default: false, binding: 'read'},
        resolveLazy: {dtype: 'B', default: true, binding: 'read'},
        selectedPath: {dtype: 'T', nullable: true, default: null, binding: 'twoWay'},
        onChecked: {dtype: ['B', 'T'], nullable: true, default: null},
        checkedPaths: {dtype: 'T', nullable: true, default: null, binding: 'twoWay'},
        checkedPaths_joiner: {dtype: 'T', default: ','},
        checkChildren: {dtype: 'B', default: true, binding: 'read'}
    },
    implementation: Base => class extends Base {
        #sanitizer;
        #context;
        #expanded = new Set();
        #rows = new Map();
        #favoriteRows = new Map();
        #favoritesOpen = false;
        #dragRows = new WeakMap();
        #presentations = new Map();
        #requestedPath;
        #selectionVersion = 0;
        #selectedPath = null;
        #scheduled = false;
        #checksEnabled = false;
        #pathsEnabled = false;
        // `checked_<attribute>` addresses, legacy syntax `path[:joiner]`, by attribute name.
        #checkedAttributes = new Map();
        // The check lists as last read or written by the tree, by list name; null before the first draw.
        #seenLists = null;
        // The path list of a tree without checkedPaths, kept like the expansion.
        #ownCheckedPaths = null;
        // The loaded branches whose loaded children are all checked (with checkChildren), derived like
        // the other lists: a child added or reloaded under one of them is checked, as in the legacy.
        #checkedBranches = null;
        // Expansion, loading, errors and resolutions are kept by tree path (row keys from
        // the store root), never by BagNode.
        #loading = new Set();
        #errors = new Map();
        #searchInput = '';
        #excludedRoot = null;
        #searchText = '';
        #searchTimer = null;
        #searchVersion = 0;
        #searchOpen = new Set();
        #searchClosed = new Set();
        #searchAttempted = new Set();
        #searching = false;
        #resolutions = new Map();

        constructor() {
            super();
            this.#sanitizer = createDOMPurify(this.ownerDocument.defaultView);
            this.control.replaceChildren();
            this.control.setAttribute('role', 'tree');
            this.control.setAttribute('aria-label', 'Tree');
            this.control.classList.add('tree');
            this.control.setAttribute('part', 'tree');
            const style = this.ownerDocument.createElement('style');
            style.textContent = `
                :host{position:relative}
                .control-box{overflow:auto;padding:4px;min-height:32px}
                ul{list-style:none;margin:0;padding:0} ul ul{padding-inline-start:20px}
                .row{display:flex;align-items:center;min-height:var(--gramlot-tree-row-height,28px);gap:2px;border-radius:3px;cursor:default}
                .row:hover{background:var(--gramlot-tree-hover-background,var(--gramlot-field-readonly-background,#f2f4f7))}
                .canBeDropped{outline:2px solid var(--gramlot-brand-blue,#3766b5);outline-offset:-2px}
                .cannotBeDropped{outline:2px dashed currentColor;outline-offset:-2px}.draggedItem{opacity:.75}
                [role=treeitem][aria-selected=true]>.row{background:var(--gramlot-tree-selected-background,#e3edff);
                    color:var(--gramlot-tree-selected-color,#214f91)}
                [role=treeitem]:focus{outline:none}
                [role=treeitem]:focus-visible>.row{outline:2px solid var(--gramlot-brand-blue,#3766b5);outline-offset:-2px}
                button{border:0;background:transparent;color:inherit;width:max(20px,var(--gramlot-touch-target,0px));height:24px;padding:0;font:inherit;cursor:pointer}
                .expander{display:grid;place-items:center;flex:none}
                .expander svg{display:block;width:14px;height:14px;pointer-events:none}
                [aria-expanded=true]>.row>.expander svg{transform:rotate(90deg)}
                .spacer{width:max(20px,var(--gramlot-touch-target,0px));flex:none}.caption{min-width:0;overflow-wrap:anywhere}
                .badge{display:inline-flex;align-items:center;justify-content:center;flex:none;min-width:18px;
                    height:16px;padding:0 3px;border-radius:3px;font-size:10px;line-height:1;
                    background:var(--gramlot-tree-badge-background,#e7eaf0);color:var(--gramlot-tree-badge-color,#394452)}
                .badge[data-colored]{color:var(--gramlot-tree-colored-badge-color,white)}
                .icon{width:16px;height:16px;flex:none;background:currentColor;opacity:.7;mask:center/contain no-repeat;
                    mask-image:url("data:image/svg+xml,%3Csvg xmlns='${SVG_NS}' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='black' stroke-width='1.7' d='M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h8'/%3E%3C/svg%3E")}
                .branch-icon{mask-image:url("data:image/svg+xml,%3Csvg xmlns='${SVG_NS}' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='black' stroke-width='1.7' d='M3 7V4h7l3 3h8v13H3z'/%3E%3C/svg%3E")}
                .opened-icon{mask-image:url("data:image/svg+xml,%3Csvg xmlns='${SVG_NS}' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='black' stroke-width='1.7' d='M3 19V4h7l3 3h8v3M3 20l3-9h16l-3 9z'/%3E%3C/svg%3E")}
                .loading>.row{opacity:.65}.error>.row .caption{text-decoration:underline dotted}
                mark{background:#ffe493;color:#302300;font-weight:600;border-radius:2px;padding:0 1px}
                .search-status{padding:4px;color:var(--gramlot-text-secondary,#555);font-size:.9em}
                [hidden]{display:none}`;
            this.shadowRoot.append(style);
            const actions = this.ownerDocument.createElement('slot');
            actions.name = 'row-actions';
            this.shadowRoot.append(actions);
            this.addEventListener('pointerleave', () => {
                const bar = this.#rowActions();
                if (bar && !bar.contains(this.ownerDocument.activeElement)) bar.clearRowContext();
            });
        }
        setSourceContext(context) { this.#context = context; }
        /** The store Bag, read from the tree's address at each use; the tree never keeps it. */
        get storeBag() { return this.#context.treeStore(); }
        /** Read only the rendered row and its BagNode; never request a resolver value. */
        getDragContext(event) {
            for (const element of event.composedPath()) {
                const row = this.#dragRows.get(element);
                if (!row) continue;
                const {path, caption, favorite} = row;
                const item = this.#rowItem(path, favorite);
                if (!item) return null;
                const rect = element.getBoundingClientRect();
                const fraction = rect.height ? (event.clientY - rect.top) / rect.height : 0.5;
                const placement = fraction < 0.25 ? 'before' : fraction > 0.75 ? 'after' : 'inside';
                return {element, item, path, placement, dragValues: {
                    'text/plain': caption.textContent,
                    nodeattr: {...item.getAttr()},
                    treenode: {fullpath: item.fullpath, relpath: path}
                }};
            }
            return null;
        }
        projectAttributes(attrs, adapt) {
            const own = {};
            this.#checkedAttributes = new Map();
            for (const [name, raw] of Object.entries(attrs)) {
                if (!name.startsWith('checked_')) { own[name] = raw; continue; }
                // Legacy genro_tree.js updateCheckedAttr: a Data path, the joiner after ':'.
                const attribute = name.slice('checked_'.length);
                if (!attribute || typeof raw !== 'string' || !raw || /^[\^=]/.test(raw)) {
                    throw new TypeError(`tree ${name} requires a Data path, optionally followed by :joiner`);
                }
                const index = raw.indexOf(':');
                this.#checkedAttributes.set(name, {attribute, path: index < 0 ? raw : raw.slice(0, index),
                    joiner: (index < 0 ? '' : raw.slice(index + 1)) || ','});
            }
            this.#pathsEnabled = Object.hasOwn(attrs, 'checkedPaths');
            this.#checksEnabled = this.#pathsEnabled || Boolean(attrs.onChecked) || this.#checkedAttributes.size > 0;
            const previousEager = this.parameters?.searchEager;
            const previousResolve = this.parameters?.resolveLazy;
            const rest = super.projectAttributes(own, adapt);
            if (previousEager !== this.parameters.searchEager || previousResolve !== this.parameters.resolveLazy) {
                this.#resetSearch();
                this.#searchText = this.#searchInput.toLowerCase();
            }
            if (this.#excludedRoot !== this.parameters.excludeRoot) {
                this.#excludedRoot = this.parameters.excludeRoot;
                this.#resetSearch();
                this.#searchText = this.#searchInput.toLowerCase();
            }
            const text = this.parameters.searchText.trim();
            if (text !== this.#searchInput) {
                this.#resetSearch();
                this.#searchInput = text;
                if (!text) this.#searchText = '';
                else this.#searchTimer = setTimeout(() => {
                    this.#searchTimer = null; this.#searchText = text.toLowerCase(); this.#schedule();
                }, 200);
            }
            this.#schedule();
            return rest;
        }
        connectedCallback() {
            if (this.#searchTimer === null) this.#searchText = this.#searchInput.toLowerCase();
            this.#schedule();
        }
        disconnectedCallback() { this.#resetSearch(); }
        #resetSearch() {
            clearTimeout(this.#searchTimer); this.#searchTimer = null;
            this.#searchVersion++; this.#searching = false;
            this.#searchAttempted.clear(); this.#searchOpen.clear(); this.#searchClosed.clear();
        }
        #opened(path) { return this.#searchText ? this.#searchOpen.has(path) : this.#expanded.has(path); }
        async #searchBranches() {
            const version = this.#searchVersion, store = this.storeBag;
            const current = () => this.isConnected && version === this.#searchVersion
                && this.parameters.searchEager && this.parameters.resolveLazy;
            this.#searching = true;
            const visit = async (bag, prefix, ancestors = new Set()) => {
                if (!current()) return;
                if (ancestors.has(bag)) throw new TypeError('tree requires an acyclic Bag store');
                const next = new Set(ancestors).add(bag);
                for (const node of bag.getNodes()) {
                    if (!prefix && node.label === this.parameters.excludeRoot) continue;
                    if (!current()) return;
                    if (node.attr.loop === true) continue;
                    if (node.resolver !== null && !this.parameters.resolveLazy) continue;
                    const path = prefix ? `${prefix}.${node.label}` : node.label;
                    if (node.resolver !== null && node.resolver.expired && !this.#searchAttempted.has(path)) {
                        this.#searchAttempted.add(path);
                        await this.#resolve(node, path, true);
                    }
                    if (!current()) return;
                    if (node.staticValue instanceof Bag) await visit(node.staticValue, path, next);
                }
            };
            try { await visit(store, ''); }
            finally { if (current()) { this.#searching = false; this.#schedule(); } }
        }
        #highlight(caption) {
            const walker = this.ownerDocument.createTreeWalker(caption, 4), texts = [];
            while (walker.nextNode()) texts.push(walker.currentNode);
            for (const text of texts) {
                const value = text.textContent, lower = value.toLowerCase(), fragment = this.ownerDocument.createDocumentFragment();
                let cursor = 0, start = lower.indexOf(this.#searchText);
                if (start < 0) continue;
                while (start >= 0) {
                    fragment.append(value.slice(cursor, start));
                    const mark = this.ownerDocument.createElement('mark'); mark.textContent = value.slice(start, start + this.#searchText.length);
                    fragment.append(mark); cursor = start + this.#searchText.length; start = lower.indexOf(this.#searchText, cursor);
                }
                fragment.append(value.slice(cursor)); text.replaceWith(fragment);
            }
        }
        retrySelection() { this.#requestedPath = undefined; this.#schedule(); }
        #schedule() {
            if (this.#scheduled) return;
            this.#scheduled = true;
            queueMicrotask(() => {
                this.#scheduled = false;
                if (!this.isConnected) return;
                // The final read of the address: an address without a Bag is reported, not drawn.
                let store;
                try {
                    store = this.storeBag;
                    // A store resolver still loading: its value arrives as a Data change that projects the tree again.
                    if (store instanceof Promise) return;
                    if (!(store instanceof Bag)) throw new TypeError('tree storepath must resolve to a Bag');
                } catch (error) {
                    this.#context.reportError(error, 'Tree');
                    return;
                }
                this.#render(store);
            });
        }
        #render(store) {
            const focused = this.shadowRoot.activeElement?.closest('[role=treeitem]')?.dataset.path;
            const focusedFavorite = this.shadowRoot.activeElement?.dataset.favoritePath;
            const focusedFavoritesGroup = this.shadowRoot.activeElement?.dataset.favoritesGroup === 'true';
            const items = new Map(), seen = new Set();
            const visit = (bag, prefix, ancestors) => {
                if (seen.has(bag)) throw new TypeError('tree requires an acyclic Bag store');
                seen.add(bag);
                for (const node of bag.getNodes()) {
                    if (!prefix && node.label === this.parameters.excludeRoot) continue;
                    const path = prefix ? `${prefix}.${node.label}` : node.label;
                    const value = node.resolver !== null && !this.parameters.resolveLazy ? null : node.staticValue;
                    items.set(path, {node, ancestors, children: value instanceof Bag ? value : null});
                    if (value instanceof Bag) visit(value, path, [...ancestors, node]);
                }
                seen.delete(bag);
            };
            visit(store, '', []);
            if (this.parameters.searchEager && this.parameters.resolveLazy && this.#searchText && this.#searchTimer === null && !this.#searching && [...items].some(([path, {node}]) =>
                node.attr.loop !== true && node.resolver !== null && node.resolver.expired && !this.#searchAttempted.has(path))) {
                void this.#searchBranches();
            }
            const actionBar = this.#rowActions();
            if (actionBar && actionBar.getRowContext() === null) actionBar.clearRowContext();
            const checks = this.#checksEnabled ? this.#drawnChecks(store) : null;
            for (const path of this.#expanded) if (!items.has(path)) this.#expanded.delete(path);
            for (const path of this.#errors.keys()) if (!items.has(path)) this.#errors.delete(path);
            const requested = this.parameters.selectedPath;
            let reveal = null;
            if (requested !== this.#requestedPath) {
                this.#requestedPath = requested;
                this.#selectedPath = requested;
                const version = ++this.#selectionVersion;
                const ancestors = items.get(requested)?.ancestors ?? [];
                if (requested && !items.has(requested)) {
                    reveal = {requested, version};
                }
                for (let index = 0; index < ancestors.length; index++) {
                    const path = requested.split('.').slice(0, index + 1).join('.');
                    if (this.#expanded.has(path)) continue;
                    this.#expand(path);
                }
            }
            const selected = this.#selectedPath;
            this.#rows.clear();
            this.#favoriteRows.clear();
            this.#dragRows = new WeakMap();
            this.#presentations.clear();
            const branchSync = new Map();
            const build = (bag, prefix, parent) => {
                const list = this.ownerDocument.createElement('ul');
                list.className = 'group'; list.setAttribute('part', 'group');
                list.setAttribute('role', 'group');
                for (const node of bag.getNodes()) {
                    if (!prefix && node.label === this.parameters.excludeRoot) continue;
                    const path = prefix ? `${prefix}.${node.label}` : node.label;
                    const {children} = items.get(path);
                    const scalar = children === null && !this.parameters.hideValues && (node.resolver === null || !node.resolver.expired);
                    const branch = children !== null ? children.length > 0
                        : scalar || (node.resolver !== null && this.parameters.resolveLazy && node.attr.child_count !== 0);
                    const entry = this.ownerDocument.createElement('li');
                    entry.className = `node ${branch ? 'branch' : 'leaf'}`;
                    entry.setAttribute('part', `node ${branch ? 'branch' : 'leaf'}`);
                    entry.classList.toggle('loading', this.#loading.has(path));
                    entry.classList.toggle('error', this.#errors.has(path));
                    entry.setAttribute('aria-busy', String(this.#loading.has(path)));
                    entry.setAttribute('role', 'treeitem');
                    entry.setAttribute('aria-selected', String(selected === path));
                    entry.classList.toggle('selected', selected === path);
                    entry.dataset.path = path;
                    entry.tabIndex = -1;
                    const row = this.ownerDocument.createElement('div'); row.className = 'row';
                    row.addEventListener('pointerenter', () => this.#showRowActions(row, path, false));
                    entry.addEventListener('focus', () => this.#showRowActions(row, path, false));
                    row.draggable = this.parameters.draggable;
                    row.setAttribute('part', `row ${branch ? 'branch-row' : 'leaf-row'}${selected === path ? ' selected-row' : ''}`);
                    if (this.#errors.has(path)) row.title = String(this.#errors.get(path));
                    const expander = this.ownerDocument.createElement(branch ? 'button' : 'span');
                    expander.setAttribute('part', branch ? 'expander' : 'spacer');
                    if (branch) {
                        expander.className = 'expander';
                        expander.type = 'button'; expander.tabIndex = -1;
                        const chevron = this.ownerDocument.createElementNS(SVG_NS, 'svg');
                        chevron.setAttribute('viewBox', '0 0 24 24');
                        chevron.setAttribute('aria-hidden', 'true'); chevron.setAttribute('focusable', 'false');
                        const chevronPath = this.ownerDocument.createElementNS(SVG_NS, 'path');
                        chevronPath.setAttribute('d', 'm9 5 7 7-7 7'); chevronPath.setAttribute('fill', 'none');
                        chevronPath.setAttribute('stroke', 'currentColor'); chevronPath.setAttribute('stroke-width', '1.8');
                        chevronPath.setAttribute('stroke-linecap', 'round'); chevronPath.setAttribute('stroke-linejoin', 'round');
                        chevron.append(chevronPath); expander.append(chevron);
                        expander.addEventListener('click', event => {
                            event.stopPropagation(); entry.focus(); toggle();
                        });
                    } else expander.className = 'spacer';
                    const caption = this.ownerDocument.createElement('span'); caption.className = 'caption';
                    const badge = this.ownerDocument.createElement('span'); badge.className = 'badge';
                    badge.setAttribute('part', 'badge');
                    this.#dragRows.set(row, {path, caption, favorite: false});
                    caption.setAttribute('part', 'caption');
                    const icon = this.ownerDocument.createElement('span');
                    icon.className = `icon ${branch ? 'branch-icon' : 'leaf-icon'}`;
                    icon.setAttribute('aria-hidden', 'true');
                    icon.setAttribute('part', `icon ${branch ? 'branch-icon' : 'leaf-icon'}`);

                    let check;
                    if (this.#checksEnabled) {
                        check = this.ownerDocument.createElement('input');
                        check.type = 'checkbox'; check.className = 'checkbox'; check.setAttribute('part', 'checkbox');
                        check.tabIndex = -1;
                        check.addEventListener('click', event => {
                            event.stopPropagation();
                            if (typeof this.parameters.onChecked === 'string') {
                                const result = this.#context.callLogic(this.parameters.onChecked, {item: node, path});
                                if (result instanceof Promise) throw new TypeError('tree onChecked must be synchronous');
                                if (result === false) { this.#schedule(); return; }
                            }
                            this.#toggleCheck(path);
                        });
                    }
                    row.append(expander, check || icon, badge, caption); entry.append(row);
                    const group = branch ? (children ? build(children, path, entry) : this.ownerDocument.createElement('ul')) : null;
                    if (group) { group.className = 'group'; group.setAttribute('role', 'group'); group.setAttribute('part', 'group'); }
                    if (group) entry.append(group);
                    if (scalar) {
                        const valueEntry = this.ownerDocument.createElement('li');
                        valueEntry.className = 'value-node'; valueEntry.setAttribute('part', 'value-node');
                        valueEntry.setAttribute('role', 'treeitem'); valueEntry.setAttribute('aria-selected', 'false');
                        valueEntry.tabIndex = -1; valueEntry.dataset.path = path; valueEntry.dataset.valueRow = 'true';
                        const valueRow = this.ownerDocument.createElement('div');
                        valueRow.className = 'row value-row'; valueRow.setAttribute('part', 'row value-row');
                        const spacer = this.ownerDocument.createElement('span'); spacer.className = 'spacer';
                        const text = this.ownerDocument.createElement('span');
                        text.className = 'value'; text.setAttribute('part', 'value'); text.textContent = String(node.staticValue);
                        valueRow.append(spacer, text); valueEntry.append(valueRow); group.append(valueEntry);
                        valueRow.addEventListener('click', () => this.#select(path));
                        valueEntry.addEventListener('keydown', event => {
                            const visible = this.#visible(), index = visible.indexOf(valueEntry);
                            let target;
                            if (event.key === 'ArrowUp') target = visible[index - 1];
                            else if (event.key === 'ArrowDown') target = visible[index + 1];
                            else if (event.key === 'Home') target = visible[0];
                            else if (event.key === 'End') target = visible.at(-1);
                            else if (event.key === 'ArrowLeft') target = entry;
                            else if (event.key === 'Enter' || event.key === ' ') this.#select(path);
                            else return;
                            event.preventDefault(); event.stopPropagation();
                            if (target) { this.#tabStop(target); target.focus(); }
                        });
                    }
                    const present = () => {
                        const opened = this.#opened(path), selected = this.#selectedPath === path;
                        const value = node.attr.badge;
                        if (value != null && typeof value !== 'string' && typeof value !== 'number') {
                            throw new TypeError('tree badge must be text or a number');
                        }
                        const color = node.attr.badge_color;
                        if (color != null && typeof color !== 'string') throw new TypeError('tree badge_color must be text');
                        badge.textContent = value == null ? '' : String(value);
                        badge.hidden = value == null || value === '';
                        badge.style.backgroundColor = color ?? '';
                        badge.toggleAttribute('data-colored', color != null && color !== '');
                        // labelState is read at its address for the callbacks of this draw; the tree keeps only the path.
                        const keywords = {item: node, path, opened, selected, state: this.#context.getStaticData(this.#context.attrDatapath('labelState'))};
                        const attribute = this.parameters.labelAttribute;
                        const label = this.parameters.internalNames && node.getAttr('fieldpath') ? node.label
                            : this.parameters.getLabel !== null ? this.#call('getLabel', keywords)
                            : attribute !== null ? (Object.hasOwn(node.attr, attribute) ? node.attr[attribute] : node.label)
                            : this.parameters.labelCb !== null ? this.#call('labelCb', keywords) : node.label;
                        this.#setCaption(caption, label, !(this.parameters.internalNames && node.getAttr('fieldpath')) &&
                            (this.parameters.getLabel !== null || (attribute === null && this.parameters.labelCb !== null)));
                        if (this.#searchText) this.#highlight(caption);
                        const labelClass = this.parameters.getLabelClass !== null ? this.#call('getLabelClass', keywords)
                            : node.attr[opened ? 'labelClassOpened' : 'labelClassClosed'] || node.attr.labelClass || '';
                        const labelClasses = [...this.#classes(labelClass), ...(selected ? this.#classes(this.parameters.selectedLabelClass) : [])];
                        caption.className = ['caption', ...labelClasses].join(' ');
                        caption.setAttribute('part', ['caption', ...labelClasses].join(' '));
                        const nodeClasses = this.#classes(node.attr.node_class ?? '');
                        entry.className = ['node', branch ? 'branch' : 'leaf', ...nodeClasses,
                            ...(selected ? ['selected'] : []), ...(branch ? [opened ? 'opened' : 'closed'] : []),
                            ...(this.#loading.has(path) ? ['loading'] : []), ...(this.#errors.has(path) ? ['error'] : [])].join(' ');
                        entry.setAttribute('part', ['node', branch ? 'branch' : 'leaf', ...nodeClasses].join(' '));
                        const customIcon = !check && this.parameters.getIconClass !== null;
                        const iconClasses = customIcon ? this.#classes(this.#call('getIconClass', keywords))
                            : [branch ? 'branch-icon' : 'leaf-icon', ...(branch ? [opened ? 'opened-icon' : 'closed-icon'] : [])];
                        icon.className = ['icon', ...iconClasses].join(' ');
                        icon.setAttribute('part', ['icon', ...iconClasses].join(' '));
                        icon.hidden = customIcon && iconClasses.length === 0;
                        if (check) {
                            const value = checks.get(path);
                            check.checked = value === true || value === 'disabled:on';
                            check.indeterminate = value === -1;
                            entry.setAttribute('aria-checked', value === -1 ? 'mixed' : String(check.checked));
                            check.disabled = value === 'disabled:on' || value === 'disabled:off';
                            check.setAttribute('aria-label', caption.textContent);
                        }
                        if (branch) expander.setAttribute('aria-label', `${opened ? 'Collapse' : 'Expand'} ${caption.textContent}`);
                    };
                    this.#presentations.set(path, present);
                    const sync = () => {
                        const opened = this.#opened(path);
                        entry.setAttribute('aria-expanded', String(opened));
                        entry.classList.toggle('opened', opened);
                        entry.classList.toggle('closed', !opened);
                        icon.classList.toggle('opened-icon', opened);
                        icon.setAttribute('part', `icon branch-icon ${opened ? 'opened-icon' : 'closed-icon'}`);
                        group.hidden = !opened;
                        present();
                    };
                    const toggle = () => {
                        const expanded = this.#searchText ? this.#searchOpen : this.#expanded;
                        if (expanded.has(path)) {
                            expanded.delete(path);
                            if (this.#searchText) this.#searchClosed.add(path);
                        } else {
                            if (this.#searchText) { this.#searchClosed.delete(path); this.#searchOpen.add(path); } else this.#expand(path);
                            if (node.resolver !== null) this.#resolve(node, path);
                        }
                        for (const update of branchSync.values()) update();
                        this.#tabStop(path);
                    };
                    if (branch) { branchSync.set(path, sync); sync(); } else present();
                    row.addEventListener('click', () => this.#select(path));
                    entry.addEventListener('keydown', event => {
                        if (event.target !== entry) return;
                        const visible = this.#visible(), index = visible.indexOf(entry);
                        let target;
                        if (event.key === 'ArrowDown') target = visible[index + 1];
                        else if (event.key === 'ArrowUp') target = visible[index - 1];
                        else if (event.key === 'Home') target = visible[0];
                        else if (event.key === 'End') target = visible.at(-1);
                        else if (event.key === 'ArrowRight' && branch) {
                            if (!this.#opened(path)) toggle(); else target = group.firstElementChild;
                        } else if (event.key === 'ArrowLeft') {
                            if (branch && this.#opened(path)) toggle(); else target = parent;
                        } else if (event.key === ' ' && check) check.click();
                        else if (event.key === 'Enter' || event.key === ' ') this.#select(path);
                        else return;
                        event.preventDefault(); event.stopPropagation();
                        if (target) { this.#tabStop(target); target.focus(); }
                    });
                    this.#rows.set(path, entry);
                    list.append(entry);
                }
                return list;
            };
            const root = build(store, '', null);
            const favorites = this.#favorites();
            if (favorites?.length) root.prepend(this.#buildFavorites(favorites, selected));
            this.control.replaceChildren(root);
            this.control.setAttribute('aria-busy', String(this.#searching));
            if (this.#searchText) {
                const visible = new Set(), matches = [];
                this.#searchOpen.clear();
                for (const [path, row] of this.#rows) {
                    const caption = row.firstElementChild.querySelector('.caption'), item = items.get(path);
                    if (item.ancestors.some(ancestor => ancestor.attr.loop === true)) continue;
                    const metadata = this.parameters.searchAttributes.split(',').map(name => name.trim()).filter(Boolean)
                        .flatMap(name => {
                            const value = item.node.getAttr(name);
                            return Array.isArray(value) ? value.filter(part => typeof part === 'string') : typeof value === 'string' ? [value] : [];
                        });
                    const match = [caption.textContent, ...metadata].some(text => text.toLowerCase().includes(this.#searchText));
                    if (match) matches.push(caption);
                    if (match || this.#errors.has(path) || this.#loading.has(path)) {
                        visible.add(path);
                        const parts = path.split('.');
                        for (const index of item.ancestors.keys()) {
                            const ancestorPath = parts.slice(0, index + 1).join('.');
                            visible.add(ancestorPath);
                            if (!this.#searchClosed.has(ancestorPath)) this.#searchOpen.add(ancestorPath);
                        }
                    }
                }
                for (const [path, row] of this.#rows) row.hidden = !visible.has(path);
                for (const update of branchSync.values()) update();
                const status = this.ownerDocument.createElement('div'); status.className = 'search-status'; status.setAttribute('role', 'status');
                status.textContent = this.#searching ? 'Searching…' : this.#errors.size ? 'Some branches could not be searched. Expand them to retry.' : matches.length ? '' : 'No matches';
                this.control.append(status);
            }
            this.#tabStop(focused ?? selected);
            if (focusedFavorite) this.#favoriteRows.get(focusedFavorite)?.focus();
            else if (focusedFavoritesGroup) root.querySelector('[data-favorites-group]')?.focus();
            else if (focused) this.#rows.get(focused)?.focus();
            if (reveal) queueMicrotask(() => this.#loadSelection(reveal));
        }
        #buildFavorites(favorites, selected) {
            const document = this.ownerDocument;
            const group = document.createElement('li');
            group.className = 'node branch'; group.setAttribute('role', 'treeitem');
            group.dataset.favoritesGroup = 'true'; group.tabIndex = -1;
            const row = document.createElement('div'); row.className = 'row';
            const button = document.createElement('button'); button.type = 'button'; button.className = 'expander'; button.tabIndex = -1;
            const heart = document.createElement('span'); heart.textContent = '♡'; heart.setAttribute('aria-hidden', 'true');
            const title = document.createElement('span'); title.className = 'caption'; title.textContent = this.parameters.favoritesLabel;
            const children = document.createElement('ul'); children.className = 'group'; children.setAttribute('role', 'group');
            const sync = () => {
                group.setAttribute('aria-expanded', String(this.#favoritesOpen));
                button.textContent = this.#favoritesOpen ? '▾' : '▸';
                button.setAttribute('aria-label', `${this.#favoritesOpen ? 'Collapse' : 'Expand'} ${this.parameters.favoritesLabel}`);
                children.hidden = !this.#favoritesOpen;
            };
            const toggle = () => { this.#favoritesOpen = !this.#favoritesOpen; sync(); };
            button.addEventListener('click', event => { event.stopPropagation(); toggle(); group.focus(); });
            row.addEventListener('click', toggle);
            group.addEventListener('focus', () => this.#rowActions()?.clearRowContext());
            group.addEventListener('keydown', event => {
                if (event.target !== group) return;
                if (event.key === 'ArrowRight') { if (!this.#favoritesOpen) toggle(); else children.firstElementChild?.focus(); }
                else if (event.key === 'ArrowLeft') { if (this.#favoritesOpen) toggle(); }
                else if (event.key === 'Enter' || event.key === ' ') toggle();
                else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    const visible = this.#visible(), index = visible.indexOf(group);
                    visible[index + (event.key === 'ArrowDown' ? 1 : -1)]?.focus();
                } else return;
                event.preventDefault(); event.stopPropagation();
            });
            row.append(button, heart, title); group.append(row, children);
            for (const node of favorites.getNodes()) {
                const path = node.getAttr('originalPath');
                const entry = document.createElement('li'); entry.className = 'node leaf'; entry.setAttribute('role', 'treeitem');
                entry.dataset.favoritePath = path; entry.tabIndex = -1; entry.setAttribute('aria-selected', String(selected === path));
                const favoriteRow = document.createElement('div'); favoriteRow.className = 'row';
                const spacer = document.createElement('span'); spacer.className = 'spacer';
                const icon = document.createElement('span'); icon.className = 'icon'; icon.setAttribute('aria-hidden', 'true');
                const badge = document.createElement('span'); badge.className = 'badge'; badge.setAttribute('part', 'badge');
                const badgeValue = node.getAttr('badge'); badge.textContent = badgeValue == null ? '' : String(badgeValue);
                badge.hidden = badgeValue == null || badgeValue === '';
                const color = node.getAttr('badge_color'); if (color) { badge.style.backgroundColor = color; badge.setAttribute('data-colored', ''); }
                const caption = document.createElement('span'); caption.className = 'caption';
                caption.textContent = node.getAttr(this.parameters.internalNames ? 'fieldpath' : 'fullcaption');
                favoriteRow.title = node.getAttr('fieldpath');
                favoriteRow.draggable = this.parameters.draggable;
                this.#dragRows.set(favoriteRow, {path, caption, favorite: true});
                favoriteRow.addEventListener('pointerenter', () => this.#showRowActions(favoriteRow, path, true));
                entry.addEventListener('focus', () => this.#showRowActions(favoriteRow, path, true));
                favoriteRow.addEventListener('click', () => this.#selectFavorite(path));
                entry.addEventListener('keydown', event => {
                    if (event.target !== entry) return;
                    if (event.key === 'Enter' || event.key === ' ') this.#selectFavorite(path);
                    else if (event.key === 'ArrowLeft') group.focus();
                    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                        const visible = this.#visible(), index = visible.indexOf(entry);
                        visible[index + (event.key === 'ArrowDown' ? 1 : -1)]?.focus();
                    } else return;
                    event.preventDefault(); event.stopPropagation();
                });
                favoriteRow.append(spacer, icon, badge, caption); entry.append(favoriteRow); children.append(entry);
                this.#favoriteRows.set(path, entry);
            }
            sync();
            return group;
        }
        #selectFavorite(path) {
            if (this.parameters.selectedPath === path) this.retrySelection();
            else this.#context.writeParameter('selectedPath', path);
        }
        async #loadSelection({requested, version}) {
            const current = () => this.isConnected && this.#selectionVersion === version &&
                this.parameters.selectedPath === requested && this.#selectedPath === requested;
            const parts = requested.split('.');
            for (const index of parts.slice(0, -1).keys()) {
                const path = parts.slice(0, index + 1).join('.');
                if (!current()) return;
                const node = this.#rowNode(path);
                if (!node) return;
                if (node.resolver !== null && !this.parameters.resolveLazy) return;
                if (node.resolver === null && !(node.staticValue instanceof Bag)) return;
                this.#expand(path);
                this.#schedule();
                if (node.resolver !== null && !(node.staticValue instanceof Bag)) await this.#resolve(node, path);
            }
            if (current() && this.#rowNode(requested)) this.#schedule();
        }
        /**
         * The check lists: `checkedPaths` (or the tree's own path list without it) and each
         * `checked_<attribute>`. Each carries its text, read at its address now, and its writer.
         */
        #checkLists() {
            // Legacy updateCheckedAttr: the tree's `_valuelabel` goes on the Data node of each written list.
            const label = this.#context.sourceNode.getAttr('_valuelabel');
            const attributes = label == null ? null : {_valuelabel: label};
            const lists = [{name: 'checkedPaths', attribute: null, joiner: this.parameters.checkedPaths_joiner,
                value: this.#pathsEnabled ? this.parameters.checkedPaths : this.#ownCheckedPaths,
                write: text => {
                    if (this.#pathsEnabled) this.#context.writeParameter('checkedPaths', text, attributes);
                    else this.#ownCheckedPaths = text;
                }},
                {name: 'checkedBranches', attribute: null, branches: true, joiner: ',', value: this.#checkedBranches,
                    write: text => { this.#checkedBranches = text; }}];
            for (const [name, {attribute, path, joiner}] of this.#checkedAttributes) {
                const value = this.#context.readRelativeData(path);
                if (value != null && typeof value !== 'string') throw new TypeError(`tree ${name} must address text`);
                lists.push({name, attribute, joiner, value, write: text => this.#context.setRelativeData(path, text, attributes)});
            }
            return lists;
        }
        #entries(list) { return (list.value ?? '').split(list.joiner).filter(Boolean); }
        /** The entries of `lists` as one source: tree paths and, by attribute, the listed values. */
        #checkSources(lists) {
            const sources = {paths: new Set(), attributes: new Map()};
            for (const attribute of this.#checkedAttributes.values()) sources.attributes.set(attribute.attribute, new Set());
            for (const list of lists) {
                const target = list.attribute === null ? sources.paths : sources.attributes.get(list.attribute);
                for (const entry of this.#entries(list)) target.add(entry);
            }
            return sources;
        }
        /** The children Bag the tree draws under `node`, read without running its resolver; null for none. */
        #childBag(node) {
            const value = node.resolver !== null && !this.parameters.resolveLazy ? null : node.staticValue;
            return value instanceof Bag ? value : null;
        }
        /**
         * The check state by tree path, computed from `sources` (legacy states): true, false, -1 for a
         * branch with mixed loaded children (with checkChildren), or the node's own `disabled:on` /
         * `disabled:off`, which nothing changes. A node is checked when the lists name its path or its
         * value of a `checked_<attribute>`, or, with checkChildren, an ancestor's; a disabled node stops
         * this propagation, as in the legacy click. `forced` sets the clicked `path` and, with
         * checkChildren, its descendants to `value`, as the legacy clickOnCheckbox.
         */
        #checkStates(store, sources, forced = null) {
            const states = new Map(), propagate = this.parameters.checkChildren, ancestors = new Set();
            const listed = (node, path) => sources.paths.has(path) || [...sources.attributes].some(([attribute, values]) =>
                node.attr[attribute] != null && values.has(String(node.attr[attribute])));
            const visit = (bag, prefix, inherited, force) => {
                if (ancestors.has(bag)) throw new TypeError('tree requires an acyclic Bag store');
                ancestors.add(bag);
                const values = [];
                for (const node of bag.getNodes()) {
                    if (!prefix && node.label === this.parameters.excludeRoot) continue;
                    const path = prefix ? `${prefix}.${node.label}` : node.label;
                    const children = this.#childBag(node);
                    const nodeForce = forced !== null && path === forced.path ? forced.value : force;
                    let state;
                    if (node.attr.checked === 'disabled:on' || node.attr.checked === 'disabled:off') {
                        state = node.attr.checked;
                        if (children) visit(children, path, false, undefined);
                    } else {
                        const own = nodeForce !== undefined ? nodeForce : inherited || listed(node, path);
                        const below = children ? visit(children, path, propagate && own, propagate ? nodeForce : undefined) : [];
                        state = propagate && below.length ? this.#aggregate(below) : own;
                    }
                    states.set(path, state);
                    values.push(state);
                }
                ancestors.delete(bag);
                return values;
            };
            visit(store, '', false, undefined);
            return states;
        }
        #aggregate(values) {
            const plain = values.map(value => value === 'disabled:on' ? true : value === 'disabled:off' ? false : value);
            return plain.every(value => value === true) ? true : plain.every(value => value === false) ? false : -1;
        }
        /**
         * The text of `list` for `states`, as the legacy updateCheckedAttr walk: with checkChildren only
         * the nodes without loaded children (an unloaded branch included), otherwise every checked node;
         * attribute values once each. The checkedBranches list takes the checked loaded branches instead. `previous` keeps the entries the walk cannot reach: paths below an
         * unloaded branch (except, with checkChildren, below `clicked`) and values no reachable node carries.
         */
        #listText(store, states, list, previous = null, clicked = null) {
            const entries = [], known = new Set(), propagate = this.parameters.checkChildren;
            const visit = (bag, prefix) => {
                for (const node of bag.getNodes()) {
                    if (!prefix && node.label === this.parameters.excludeRoot) continue;
                    const path = prefix ? `${prefix}.${node.label}` : node.label;
                    const children = this.#childBag(node);
                    const entry = list.attribute === null ? path
                        : node.attr[list.attribute] == null ? null : String(node.attr[list.attribute]);
                    if (entry !== null) known.add(entry);
                    const listed = list.branches ? propagate && children?.length > 0 : !(propagate && children?.length);
                    if (entry !== null && listed && states.get(path) === true && !entries.includes(entry)) entries.push(entry);
                    if (children) visit(children, path);
                }
            };
            visit(store, '');
            if (previous !== null && !list.branches) for (const entry of this.#entries(previous)) {
                if (entries.includes(entry)) continue;
                if (list.attribute !== null ? !known.has(entry) : this.#pendingCheckedPath(entry) &&
                    !(propagate && clicked !== null && (entry === clicked || entry.startsWith(`${clicked}.`)))) entries.push(entry);
            }
            return entries.join(list.joiner);
        }
        /**
         * The check states of this draw. Lists changed outside the tree since it last read or wrote them
         * are the source (at the first draw, the nonempty lists); the other lists are rewritten from the
         * states they give. Otherwise all lists together are the source and nothing is written.
         */
        #drawnChecks(store) {
            const lists = this.#checkLists(), first = this.#seenLists === null;
            const changed = lists.filter(list => first ? this.#entries(list).length
                : (this.#seenLists.get(list.name) ?? '') !== (list.value ?? ''));
            const states = this.#checkStates(store, this.#checkSources(changed.length || first ? changed : lists));
            this.#seenLists = new Map(lists.map(list => [list.name, list.value ?? '']));
            // Legacy setCheckedPaths checks each path of a changed checkedPaths, and each check publishes.
            const paths = changed.find(list => list.name === 'checkedPaths');
            if (paths && !first) for (const path of this.#entries(paths)) {
                if (states.has(path) && typeof states.get(path) !== 'string') this.#publishChecked(path, true);
            }
            if (changed.length) for (const list of lists) {
                if (changed.includes(list)) continue;
                const text = this.#listText(store, states, list);
                if (text === (list.value ?? '')) continue;
                this.#seenLists.set(list.name, text);
                list.write(text);
            }
            return states;
        }
        /**
         * Toggle the check at `path` as the legacy click (a checked or mixed node unchecks) and write
         * every list. With checkChildren a branch counts as checked when any leaf the click changes is
         * checked: the disabled nodes below it, which the click does not change, do not decide.
         */
        #toggleCheck(path) {
            const store = this.storeBag, lists = this.#checkLists();
            const current = this.#checkStates(store, this.#checkSources(lists));
            const state = current.get(path);
            if (state === 'disabled:on' || state === 'disabled:off') return;
            let checked = state !== false;
            if (this.parameters.checkChildren) {
                const below = [...current].filter(([key]) => key.startsWith(`${path}.`));
                const fixed = below.filter(([, value]) => value === 'disabled:on' || value === 'disabled:off').map(([key]) => `${key}.`);
                const leaves = below.filter(([key, value]) => value !== 'disabled:on' && value !== 'disabled:off'
                    && !fixed.some(prefix => key.startsWith(prefix)) && !below.some(([other]) => other.startsWith(`${key}.`)));
                if (leaves.length) checked = leaves.some(([, value]) => value === true);
            }
            const states = this.#checkStates(store, this.#checkSources(lists), {path, value: !checked});
            this.#publishChecked(path, !checked);
            for (const list of lists) {
                const text = this.#listText(store, states, list, list, path);
                this.#seenLists.set(list.name, text);
                if (text !== (list.value ?? '')) list.write(text);
            }
            this.#schedule();
        }
        /**
         * Publish the legacy `<nodeId>_checked` topic of the tree for the check of `path` set to `checked`,
         * before the lists are written; the payload is the store node (`item`), its tree path and the value.
         */
        #publishChecked(path, checked) {
            this.#context.publish('checked', {path, checked});
        }
        #pendingCheckedPath(path) {
            const parts = path.split('.');
            let bag = this.storeBag;
            for (let index = 0; index < parts.length; index++) {
                const node = bag.getNode(parts[index]);
                if (!node) return false;
                if (index === parts.length - 1) return false;
                if (node.resolver !== null && !(node.staticValue instanceof Bag)) return true;
                if (!(node.staticValue instanceof Bag)) return false;
                bag = node.staticValue;
            }
            return false;
        }
        #classes(value) {
            if (typeof value !== 'string') throw new TypeError('Tree classes must be a string');
            return value.split(/\s+/).filter(Boolean);
        }
        #rowActions() {
            const bars = [...this.children].filter(child => child.localName === 'gramlot-row-actions');
            if (bars.length > 1) throw new Error('tree accepts one rowActions bar');
            return bars[0] ?? null;
        }
        #showRowActions(row, path, favorite) {
            const bar = this.#rowActions();
            if (!bar || bar.contains(this.ownerDocument.activeElement)) return;
            const hostBox = this.getBoundingClientRect(), rowBox = row.getBoundingClientRect();
            bar.setRowContext(path, () => this.#rowItem(path, favorite));
            bar.style.position = 'absolute';
            bar.style.top = `${rowBox.top - hostBox.top}px`;
            bar.style.left = bar.parameters.position === 'start' ? `${rowBox.left - hostBox.left}px` : 'auto';
            bar.style.right = bar.parameters.position === 'end' ? `${hostBox.right - rowBox.right}px` : 'auto';
            bar.style.zIndex = '1';
            bar.hidden = false;
        }
        #call(name, keywords) {
            const result = this.#context.callLogic(this.parameters[name], keywords);
            if (name === 'labelCb' || name === 'getLabel') {
                if (!result || typeof result !== 'object' || Object.keys(result).length !== 1 ||
                    !(Object.hasOwn(result, 'text') && typeof result.text === 'string' ||
                      Object.hasOwn(result, 'html') && typeof result.html === 'string')) {
                    throw new TypeError(`tree ${name} must return {text: string} or {html: string} synchronously`);
                }
            } else if (typeof result !== 'string') throw new TypeError(`tree ${name} must return a string synchronously`);
            return result;
        }
        #setCaption(caption, label, computed) {
            if (computed && Object.hasOwn(label, 'html')) {
                caption.replaceChildren(this.#sanitizer.sanitize(label.html, {
                    USE_PROFILES: {html: true}, FORBID_TAGS: ['style', 'form', 'input', 'button', 'select', 'textarea'],
                    RETURN_DOM_FRAGMENT: true
                }));
            } else caption.textContent = computed ? label.text : label;
        }
        #visible() {
            return [...this.control.querySelectorAll('[role=treeitem]')].filter(row => !row.closest('[hidden]'));
        }
        /** Expand the row at tree `path`; autoCollapse closes the expanded siblings, matched by key. */
        #expand(path) {
            if (this.#searchText) { this.#searchOpen.add(path); return; }
            if (this.parameters.autoCollapse) {
                const parent = path.includes('.') ? path.slice(0, path.lastIndexOf('.')) : '';
                for (const other of [...this.#expanded]) {
                    const otherParent = other.includes('.') ? other.slice(0, other.lastIndexOf('.')) : '';
                    if (other !== path && otherParent === parent) this.#expanded.delete(other);
                }
            }
            this.#expanded.add(path);
        }
        #resolve(node, path, searching = false) {
            if (this.#resolutions.has(path)) return this.#resolutions.get(path);
            this.#loading.add(path); this.#errors.delete(path); this.#schedule();
            const pending = (async () => {
                try { await Promise.resolve().then(() => node.getValue()); }
                catch (error) { this.#errors.set(path, error); if (!searching) this.#expanded.delete(path); }
                finally { this.#loading.delete(path); this.#resolutions.delete(path); this.#schedule(); }
            })();
            this.#resolutions.set(path, pending);
            return pending;
        }
        /** The node at tree `path`, read from the store without running resolvers; null when absent. */
        #rowNode(path) {
            let bag = this.storeBag, node = null;
            for (const label of path.split('.')) {
                if (!(bag instanceof Bag)) return null;
                node = bag.getNode(label);
                if (!node) return null;
                bag = node.staticValue;
            }
            return node;
        }
        /** The item of a drawn row: the store node at `path`, or the favorite whose originalPath is `path`. */
        #rowItem(path, favorite) {
            if (!favorite) return this.#rowNode(path);
            const favorites = this.#context.getStaticData(this.#context.attrDatapath('favorites'));
            return favorites instanceof Bag ? favorites.getNodes().find(node => node.getAttr('originalPath') === path) ?? null : null;
        }
        /**
         * The favorites Bag, read at the address of the `favorites` pointer at each use; null without
         * favorites. A change inside the Bag or a replacement at its address projects the tree again.
         */
        #favorites() {
            const favorites = this.#context.getStaticData(this.#context.attrDatapath('favorites'));
            if (favorites !== null && !(favorites instanceof Bag)) throw new TypeError('tree favorites must be a Bag');
            return favorites;
        }
        #tabStop(path) {
            const visible = this.#visible(), target = typeof path === 'string' || path == null
                ? visible.find(row => row.dataset.path === path) ?? visible[0] : path;
            for (const row of this.control.querySelectorAll('[role=treeitem]')) row.tabIndex = row === target ? 0 : -1;
        }
        #select(path) {
            this.#selectedPath = path;
            for (const [key, row] of this.#rows) {
                row.setAttribute('aria-selected', String(key === path));
                row.classList.toggle('selected', key === path);
                this.#presentations.get(key)();
                row.firstElementChild.setAttribute('part', `row ${row.classList.contains('branch') ? 'branch-row' : 'leaf-row'}${key === path ? ' selected-row' : ''}`);
            }
            this.#tabStop(path);
            this.#rows.get(path).focus();
            this.#context.writeParameter('selectedPath', path);
        }
    }
});
export default defineCollection({name: 'tree', components: [Tree, RowActions]});
