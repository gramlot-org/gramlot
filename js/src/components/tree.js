/** Bag hierarchy, lazy branch expansion, captions and path selection. */
import {Bag} from '@gramlot/gramlot';
import createDOMPurify from 'dompurify';
import {defineComponent, defineCollection} from './registry.js';
import {Container} from './container.js';
import {SVG_NS} from '../renderer/attributes.js';

export const Tree = defineComponent({
    name: 'tree', tag: 'gramlot-tree', base: Container, sourceContext: true, bagStore: true, dragSource: true,
    parameters: {
        storepath: {dtype: 'T'},
        draggable: {dtype: 'B', default: false, binding: 'read'},
        labelAttribute: {dtype: 'T', nullable: true, default: null, binding: 'read'},
        hideValues: {dtype: 'B', default: false, binding: 'read'},
        labelCb: {dtype: 'T', nullable: true, default: null},
        getLabel: {dtype: 'T', nullable: true, default: null},
        getLabelClass: {dtype: 'T', nullable: true, default: null},
        getIconClass: {dtype: 'T', nullable: true, default: null},
        selectedLabelClass: {dtype: 'T', default: '', binding: 'read'},
        autoCollapse: {dtype: 'B', default: false, binding: 'read'},
        selectedPath: {dtype: 'T', nullable: true, default: null, binding: 'twoWay'}
    },
    implementation: Base => class extends Base {
        #store;
        #sanitizer;
        #context;
        #expanded = new Set();
        #rows = new Map();
        #dragRows = new WeakMap();
        #presentations = new Map();
        #requestedPath;
        #selectedPath = null;
        #scheduled = false;
        #loading = new Set();
        #errors = new Map();

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
                .control-box{overflow:auto;padding:4px;min-height:32px}
                ul{list-style:none;margin:0;padding:0} ul ul{padding-inline-start:20px}
                .row{display:flex;align-items:center;min-height:var(--gramlot-tree-row-height,28px);gap:4px;border-radius:3px;cursor:default}
                .row:hover{background:var(--gramlot-tree-hover-background,var(--gramlot-field-readonly-background,#f2f4f7))}
                .canBeDropped{outline:2px solid var(--gramlot-brand-blue,#3766b5);outline-offset:-2px}
                .cannotBeDropped{outline:2px dashed currentColor;outline-offset:-2px}.draggedItem{opacity:.75}
                [role=treeitem][aria-selected=true]>.row{background:var(--gramlot-tree-selected-background,#e3edff);
                    color:var(--gramlot-tree-selected-color,#214f91)}
                [role=treeitem]:focus{outline:none}
                [role=treeitem]:focus-visible>.row{outline:2px solid var(--gramlot-brand-blue,#3766b5);outline-offset:-2px}
                button{border:0;background:transparent;color:inherit;width:24px;height:24px;padding:0;font:inherit;cursor:pointer}
                .spacer{width:24px;flex:none}.caption{min-width:0;overflow-wrap:anywhere}
                .icon{width:16px;height:16px;flex:none;background:currentColor;opacity:.7;mask:center/contain no-repeat;
                    mask-image:url("data:image/svg+xml,%3Csvg xmlns='${SVG_NS}' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='black' stroke-width='1.7' d='M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h8'/%3E%3C/svg%3E")}
                .branch-icon{mask-image:url("data:image/svg+xml,%3Csvg xmlns='${SVG_NS}' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='black' stroke-width='1.7' d='M3 7V4h7l3 3h8v13H3z'/%3E%3C/svg%3E")}
                .opened-icon{mask-image:url("data:image/svg+xml,%3Csvg xmlns='${SVG_NS}' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='black' stroke-width='1.7' d='M3 19V4h7l3 3h8v3M3 20l3-9h16l-3 9z'/%3E%3C/svg%3E")}
                .loading>.row{opacity:.65}.error>.row .caption{text-decoration:underline dotted}
                [hidden]{display:none}`;
            this.shadowRoot.append(style);
        }
        setSourceContext(context) { this.#context = context; }
        /** Read only the rendered row and its BagNode; never request a resolver value. */
        getDragContext(event) {
            for (const element of event.composedPath()) {
                const row = this.#dragRows.get(element);
                if (!row) continue;
                const {item, path, caption} = row;
                return {element, item, path, dragValues: {
                    'text/plain': caption.textContent,
                    nodeattr: {...item.getAttr()},
                    treenode: {fullpath: item.fullpath, relpath: path}
                }};
            }
            return null;
        }
        setStoreBag(bag) {
            if (!(bag instanceof Bag)) throw new TypeError('tree storepath must resolve to a Bag');
            if (bag !== this.#store) {
                this.#store = bag;
                this.#expanded.clear();
                this.#errors.clear();
                this.#requestedPath = undefined;
            }
            this.#schedule();
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            this.#schedule();
            return rest;
        }
        connectedCallback() { this.#schedule(); }
        #schedule() {
            if (this.#scheduled) return;
            this.#scheduled = true;
            queueMicrotask(() => {
                this.#scheduled = false;
                if (this.isConnected && this.#store) this.#render();
            });
        }
        #render() {
            const focused = this.shadowRoot.activeElement?.closest('[role=treeitem]')?.dataset.path;
            const items = new Map(), seen = new Set();
            const visit = (bag, prefix, ancestors) => {
                if (seen.has(bag)) throw new TypeError('tree requires an acyclic Bag store');
                seen.add(bag);
                for (const node of bag.getNodes()) {
                    const path = prefix ? `${prefix}.${node.label}` : node.label;
                    const value = node.staticValue; // Rendering never evaluates resolvers.
                    items.set(path, {node, ancestors, children: value instanceof Bag ? value : null});
                    if (value instanceof Bag) visit(value, path, [...ancestors, node]);
                }
                seen.delete(bag);
            };
            visit(this.#store, '', []);
            const identities = new Set([...items.values()].map(item => item.node));
            for (const node of this.#expanded) if (!identities.has(node)) this.#expanded.delete(node);
            for (const node of this.#errors.keys()) if (!identities.has(node)) this.#errors.delete(node);
            const requested = this.parameters.selectedPath;
            if (requested !== this.#requestedPath) {
                this.#requestedPath = requested;
                this.#selectedPath = requested;
                for (const node of items.get(requested)?.ancestors ?? []) this.#expand(node);
            }
            const selected = this.#selectedPath;
            this.#rows.clear();
            this.#dragRows = new WeakMap();
            this.#presentations.clear();
            const branchSync = new Map();
            const build = (bag, prefix, parent) => {
                const list = this.ownerDocument.createElement('ul');
                list.className = 'group'; list.setAttribute('part', 'group');
                list.setAttribute('role', 'group');
                for (const node of bag.getNodes()) {
                    const path = prefix ? `${prefix}.${node.label}` : node.label;
                    const {children} = items.get(path);
                    const scalar = children === null && !this.parameters.hideValues && (node.resolver === null || !node.resolver.expired);
                    const branch = children !== null ? children.length > 0
                        : scalar || (node.resolver !== null && node.attr.child_count !== 0);
                    const entry = this.ownerDocument.createElement('li');
                    entry.className = `node ${branch ? 'branch' : 'leaf'}`;
                    entry.setAttribute('part', `node ${branch ? 'branch' : 'leaf'}`);
                    entry.classList.toggle('loading', this.#loading.has(node));
                    entry.classList.toggle('error', this.#errors.has(node));
                    entry.setAttribute('aria-busy', String(this.#loading.has(node)));
                    entry.setAttribute('role', 'treeitem');
                    entry.setAttribute('aria-selected', String(selected === path));
                    entry.classList.toggle('selected', selected === path);
                    entry.dataset.path = path;
                    entry.tabIndex = -1;
                    const row = this.ownerDocument.createElement('div'); row.className = 'row';
                    row.draggable = this.parameters.draggable;
                    row.setAttribute('part', `row ${branch ? 'branch-row' : 'leaf-row'}${selected === path ? ' selected-row' : ''}`);
                    if (this.#errors.has(node)) row.title = String(this.#errors.get(node));
                    const expander = this.ownerDocument.createElement(branch ? 'button' : 'span');
                    expander.setAttribute('part', branch ? 'expander' : 'spacer');
                    if (branch) {
                        expander.className = 'expander';
                        expander.type = 'button'; expander.tabIndex = -1;
                        expander.addEventListener('click', event => {
                            event.stopPropagation(); toggle(); entry.focus();
                        });
                    } else expander.className = 'spacer';
                    const caption = this.ownerDocument.createElement('span'); caption.className = 'caption';
                    this.#dragRows.set(row, {item: node, path, caption});
                    caption.setAttribute('part', 'caption');
                    const icon = this.ownerDocument.createElement('span');
                    icon.className = `icon ${branch ? 'branch-icon' : 'leaf-icon'}`;
                    icon.setAttribute('aria-hidden', 'true');
                    icon.setAttribute('part', `icon ${branch ? 'branch-icon' : 'leaf-icon'}`);

                    row.append(expander, icon, caption); entry.append(row);
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
                        const opened = this.#expanded.has(node), selected = this.#selectedPath === path;
                        const keywords = {item: node, path, opened, selected};
                        const attribute = this.parameters.labelAttribute;
                        const label = this.parameters.getLabel !== null ? this.#call('getLabel', keywords)
                            : attribute !== null ? (Object.hasOwn(node.attr, attribute) ? node.attr[attribute] : node.label)
                            : this.parameters.labelCb !== null ? this.#call('labelCb', keywords) : node.label;
                        this.#setCaption(caption, label, this.parameters.getLabel !== null || (attribute === null && this.parameters.labelCb !== null));
                        const labelClass = this.parameters.getLabelClass !== null ? this.#call('getLabelClass', keywords)
                            : node.attr[opened ? 'labelClassOpened' : 'labelClassClosed'] || node.attr.labelClass || '';
                        const labelClasses = [...this.#classes(labelClass), ...(selected ? this.#classes(this.parameters.selectedLabelClass) : [])];
                        caption.className = ['caption', ...labelClasses].join(' ');
                        caption.setAttribute('part', ['caption', ...labelClasses].join(' '));
                        const nodeClasses = this.#classes(node.attr.node_class ?? '');
                        entry.className = ['node', branch ? 'branch' : 'leaf', ...nodeClasses,
                            ...(selected ? ['selected'] : []), ...(branch ? [opened ? 'opened' : 'closed'] : []),
                            ...(this.#loading.has(node) ? ['loading'] : []), ...(this.#errors.has(node) ? ['error'] : [])].join(' ');
                        entry.setAttribute('part', ['node', branch ? 'branch' : 'leaf', ...nodeClasses].join(' '));
                        const customIcon = this.parameters.getIconClass !== null;
                        const iconClasses = customIcon ? this.#classes(this.#call('getIconClass', keywords))
                            : [branch ? 'branch-icon' : 'leaf-icon', ...(branch ? [opened ? 'opened-icon' : 'closed-icon'] : [])];
                        icon.className = ['icon', ...iconClasses].join(' ');
                        icon.setAttribute('part', ['icon', ...iconClasses].join(' '));
                        icon.hidden = customIcon && iconClasses.length === 0;
                        if (branch) expander.setAttribute('aria-label', `${opened ? 'Collapse' : 'Expand'} ${caption.textContent}`);
                    };
                    this.#presentations.set(path, present);
                    const sync = () => {
                        const opened = this.#expanded.has(node);
                        entry.setAttribute('aria-expanded', String(opened));
                        entry.classList.toggle('opened', opened);
                        entry.classList.toggle('closed', !opened);
                        icon.classList.toggle('opened-icon', opened);
                        icon.setAttribute('part', `icon branch-icon ${opened ? 'opened-icon' : 'closed-icon'}`);
                        expander.textContent = opened ? '▾' : '▸';
                        group.hidden = !opened;
                        present();
                    };
                    const toggle = () => {
                        if (this.#expanded.has(node)) this.#expanded.delete(node);
                        else {
                            this.#expand(node);
                            if (node.resolver !== null) this.#resolve(node);
                        }
                        for (const update of branchSync.values()) update();
                        this.#tabStop(path);
                    };
                    if (branch) { branchSync.set(node, sync); sync(); } else present();
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
                            if (!this.#expanded.has(node)) toggle(); else target = group.firstElementChild;
                        } else if (event.key === 'ArrowLeft') {
                            if (branch && this.#expanded.has(node)) toggle(); else target = parent;
                        } else if (event.key === 'Enter' || event.key === ' ') this.#select(path);
                        else return;
                        event.preventDefault(); event.stopPropagation();
                        if (target) { this.#tabStop(target); target.focus(); }
                    });
                    this.#rows.set(path, entry);
                    list.append(entry);
                }
                return list;
            };
            this.control.replaceChildren(build(this.#store, '', null));
            this.#tabStop(focused ?? selected);
            if (focused) this.#rows.get(focused)?.focus();
        }
        #classes(value) {
            if (typeof value !== 'string') throw new TypeError('Tree classes must be a string');
            return value.split(/\s+/).filter(Boolean);
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
        #expand(node) {
            if (this.parameters.autoCollapse) {
                for (const sibling of node.parentBag.getNodes()) {
                    if (sibling !== node) this.#expanded.delete(sibling);
                }
            }
            this.#expanded.add(node);
        }
        async #resolve(node) {
            if (this.#loading.has(node)) return;
            this.#loading.add(node);
            this.#errors.delete(node);
            this.#schedule();
            try {
                await node.getValue();
            } catch (error) {
                this.#errors.set(node, error);
                this.#expanded.delete(node);
            } finally {
                this.#loading.delete(node);
                this.#schedule();
            }
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
export default defineCollection({name: 'tree', components: [Tree]});
