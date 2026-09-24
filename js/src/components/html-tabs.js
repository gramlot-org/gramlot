import {Bag} from 'genro-bag-js';

const KEY = /^[a-z][a-z0-9_-]*$/;

/** Browser behavior for a Source-declared set of persistent HTML tabs. */
export class HtmlTabs {
    constructor(renderer, root) {
        this.renderer = renderer;
        this.root = root;
        this.element = renderer.records.get(root).element;
        this.initial = root.getAttr('data_gramlot_tabs');
        this.entries = new Map();
        this.state = new Bag();
        this.opened = new Bag();
        this.state.setItem('active', this.initial);
        this.state.setItem('opened', this.opened);
        this.click = event => this.onClick(event);
        this.keydown = event => this.onKeydown(event);
    }

    mount() {
        if (typeof this.initial !== 'string' || !KEY.test(this.initial)) {
            throw new TypeError('HTML tabs require a valid initial key');
        }
        const groups = ['data_gramlot_open', 'data_gramlot_tab', 'data_gramlot_panel', 'data_gramlot_frame'];
        const declarations = Object.fromEntries(groups.map(group => [group, new Map()]));
        const walk = record => {
            for (const childNode of record.children) {
                const child = this.renderer.records.get(childNode);
                for (const group of groups) {
                    const key = childNode.getAttr(group);
                    if (key == null) continue;
                    if (typeof key !== 'string' || !KEY.test(key) || declarations[group].has(key)) {
                        throw new TypeError(`Invalid or duplicate ${group} key`);
                    }
                    declarations[group].set(key, child);
                }
                walk(child);
            }
        };
        walk(this.renderer.records.get(this.root));
        const opens = declarations.data_gramlot_open;
        const tabs = declarations.data_gramlot_tab;
        const panels = declarations.data_gramlot_panel;
        const frames = declarations.data_gramlot_frame;
        if (!tabs.size || !tabs.has(this.initial) || opens.size !== tabs.size ||
            panels.size !== tabs.size || frames.size !== tabs.size) {
            throw new TypeError('HTML tabs require matching open buttons, tabs, panels and frames');
        }
        for (const [key, tab] of tabs) {
            const open = opens.get(key), panel = panels.get(key), frame = frames.get(key);
            if (!open || !panel || !frame || open.node.nodeTag !== 'button' ||
                tab.node.nodeTag !== 'button' || panel.node.nodeTag !== 'section' ||
                frame.node.nodeTag !== 'iframe' || tab.node.getAttr('role') !== 'tab' ||
                panel.node.getAttr('role') !== 'tabpanel' ||
                tab.node.getAttr('id') !== `tab-${key}` ||
                tab.node.getAttr('aria_controls') !== `panel-${key}` ||
                panel.node.getAttr('id') !== `panel-${key}` ||
                panel.node.getAttr('aria_labelledby') !== `tab-${key}` ||
                frame.parent !== panel ||
                typeof frame.node.getAttr('data_gramlot_src') !== 'string' ||
                !KEY.test(frame.node.getAttr('data_gramlot_src')) ||
                typeof tab.node.getAttr('hidden') !== 'boolean' ||
                typeof panel.node.getAttr('hidden') !== 'boolean' ||
                tab.node.getAttr('hidden') && key === this.initial ||
                panel.node.getAttr('hidden') !== (key !== this.initial) ||
                tab.node.getAttr('aria_selected') !== String(key === this.initial) ||
                tab.node.getAttr('tabindex') !== (key === this.initial ? 0 : -1) ||
                open.node.getAttr('aria_current') !== (key === this.initial ? 'page' : null) ||
                frame.node.getAttr('src') !== (tab.node.getAttr('hidden') ? null : frame.node.getAttr('data_gramlot_src'))) {
                throw new TypeError(`Invalid HTML tab declaration for ${key}`);
            }
            this.entries.set(key, {open, tab, panel, frame});
            if (!tab.node.getAttr('hidden')) this.opened.setItem(key, true);
        }
        this.element.addEventListener('click', this.click);
        this.element.addEventListener('keydown', this.keydown);
        return this;
    }

    onClick(event) {
        const target = event.target.nodeType === 1 ? event.target : event.target.parentElement;
        const button = target?.closest('[data-gramlot-open], [data-gramlot-tab]');
        if (!button || !this.element.contains(button)) return;
        const key = button.getAttribute('data-gramlot-open') ?? button.getAttribute('data-gramlot-tab');
        const entry = this.entries.get(key);
        if (!entry || (button !== entry.open.element && button !== entry.tab.element)) return;
        this.select(key);
    }

    onKeydown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const selected = [...this.entries].filter(([key]) => this.opened.getItem(key));
        const index = selected.findIndex(([, entry]) => entry.tab.element === event.target);
        if (index < 0) return;
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? selected.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + selected.length) % selected.length;
        event.preventDefault();
        this.select(selected[next][0]);
        selected[next][1].tab.element.focus();
    }

    select(key) {
        const entry = this.entries.get(key);
        if (!entry) throw new RangeError(`Unknown HTML tab: ${key}`);
        if (!this.opened.getItem(key)) {
            this.opened.setItem(key, true);
            entry.tab.node.setAttr({hidden: false});
            entry.frame.node.setAttr({src: entry.frame.node.getAttr('data_gramlot_src')});
        }
        if (this.state.getItem('active') === key) return;
        for (const [current, item] of this.entries) {
            const active = current === key;
            item.tab.node.setAttr({aria_selected: String(active), tabindex: active ? 0 : -1});
            item.panel.node.setAttr({hidden: !active});
            item.open.node.setAttr({aria_current: active ? 'page' : null});
        }
        this.state.setItem('active', key);
        this.root.setAttr({data_gramlot_tabs: key});
    }

    dispose() {
        this.element.removeEventListener('click', this.click);
        this.element.removeEventListener('keydown', this.keydown);
    }
}
