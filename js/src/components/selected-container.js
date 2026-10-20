/** Shared selection keeps panel Source and light DOM mounted until explicit closing. */
import {defineComponent} from './registry.js';
import {Container} from './container.js';

function SelectedContainer(HTMLElement) {
    // Named as its factory: inside the body `SelectedContainer` is this class, owner of the static state.
    return class SelectedContainer extends Container(HTMLElement) {
        // The panel configuration of each child element and the count of the panel slots made, for this class
        // in this window (ComponentCollection.register).
        static #selectionPanels = new WeakMap();
        static #panelSequence = 0;
        static projectChild(element, attrs, actions) {
            const {pageName = null, title = '', icon = '', badge = null, badge_color = '', closable = false, onClose, hidden = false, disabled = false, ...rest} = attrs;
            if (pageName !== null && typeof pageName !== 'string') throw new TypeError('pageName must be a string');
            if (typeof closable !== 'boolean') throw new TypeError('closable must be a boolean');
            const panels = SelectedContainer.#selectionPanels;
            const slot = panels.get(element)?.slot ?? `panel-${++SelectedContainer.#panelSequence}`;
            panels.set(element, {pageName, title, icon, badge, badge_color, closable, hidden, disabled, slot,
                remove: actions.remove, allowClose: () => onClose == null ? true : actions.invoke('onClose', onClose, {})});
            rest.slot = slot;
            if (element.parentElement) element.parentElement.scheduleSelection();
            return rest;
        }
        #panels = new Map();
        #selected = null;
        #initialized = false;
        #scheduled = false;
        #requested = {selectedPage: null, selected: null};
        #observer;
        #context;
        constructor() {
            super();
            this.control.replaceChildren();
            this.control.className = 'control-box selection';
            const style = this.ownerDocument.createElement('style');
            style.textContent = `:host{min-height:0;overflow:hidden}.selection{height:100%;min-height:0;display:flex;flex-direction:column}
                .panels{flex:1;min-height:0;min-width:0;position:relative}.panel{height:100%;min-height:0;overflow:auto}
                .panel[hidden]{display:none}::slotted(*){height:100%;min-height:0}`;
            this.panelArea = this.ownerDocument.createElement('div'); this.panelArea.className = 'panels';
            this.control.append(this.panelArea); this.shadowRoot.append(style);
            this.#observer = new this.ownerDocument.defaultView.MutationObserver(() => this.scheduleSelection());
        }
        setSourceContext(context) { this.#context = context; }
        connectedCallback() { this.#observer.observe(this, {childList:true}); this.scheduleSelection(); }
        disconnectedCallback() { this.#observer.disconnect(); }
        scheduleSelection() {
            if (this.#scheduled) return;
            this.#scheduled = true;
            queueMicrotask(() => {
                this.#scheduled = false;
                if (this.isConnected) this.#sync();
            });
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const {selected, selectedPage} = this.parameters;
            if (selected != null && (!Number.isInteger(selected) || selected < 0)) throw new TypeError('selected must be a nonnegative index or null');
            if (selectedPage != null && typeof selectedPage !== 'string') throw new TypeError('selectedPage must be a string or null');
            this.scheduleSelection();
            return rest;
        }
        #sync() {
            const records = [], names = new Set();
            for (const child of this.children) {
                const config = SelectedContainer.#selectionPanels.get(child);
                if (!config) continue;
                if (config.pageName != null && names.has(config.pageName)) throw new Error(`Duplicate pageName: ${config.pageName}`);
                names.add(config.pageName);
                let record = this.#panels.get(child);
                if (!record) {
                    const viewport = this.ownerDocument.createElement('div'); viewport.className = 'panel'; viewport.hidden = true;
                    viewport.id = config.slot; viewport.setAttribute('role', 'group');
                    const slot = this.ownerDocument.createElement('slot'); slot.name = config.slot; viewport.append(slot);
                    this.panelArea.append(viewport);
                    record = {child, viewport, config, index:records.length}; this.#panels.set(child, record);
                }
                record.config = config;
                records.push(record);
            }
            const previousIndex = this.#selected?.index ?? 0;
            for (const [child, record] of this.#panels) {
                if (!records.includes(record)) { record.viewport.remove(); this.#panels.delete(child); }
            }
            records.forEach((record, index) => { record.index = index; });
            this.#panels = new Map(records.map(record => [record.child, record]));
            const {selectedPage, selected} = this.parameters;
            const nameChanged = !Object.is(selectedPage, this.#requested.selectedPage);
            const indexChanged = !Object.is(selected, this.#requested.selected);
            this.#requested = {selectedPage, selected};
            const available = record => record && !record.config.hidden && !record.config.disabled;
            let target = this.#selected;
            if (!this.#initialized || nameChanged || indexChanged) {
                const requested = (nameChanged || !this.#initialized && selectedPage != null)
                    ? records.find(record => record.config.pageName === selectedPage) : records[selected];
                if (available(requested)) target = requested;
            }
            if (!records.includes(target) || !available(target)) {
                target = records.slice(previousIndex).find(available) ?? records.slice(0, previousIndex).reverse().find(available) ?? null;
            }
            this.renderTabs(records, target);
            if (records.length || this.#initialized) this.#select(target);
        }
        renderTabs() {}
        selectPanel(record) {
            if (record.config.hidden || record.config.disabled) return;
            this.#select(record);
        }
        #payload(record, selected) {
            const page = record.config.pageName ?? record.index;
            return {page, index:record.index, selected, change:`${page}_${selected ? 'show' : 'hide'}`};
        }
        #writeSelection(target) {
            this.#context.writeParameter('selectedPage', target?.config.pageName ?? null);
            this.#context.writeParameter('selected', target?.index ?? null);
        }
        #select(target) {
            const previous = this.#selected, initial = !this.#initialized;
            if (!initial && target === previous) {
                this.#writeSelection(target);
                return;
            }
            if (!initial) {
                if (previous) this.#context.publish('hiding', {pageName:previous.config.pageName, index:previous.index});
                if (target) this.#context.publish('showing', {pageName:target.config.pageName, index:target.index});
            }
            this.#selected = target; this.#initialized = true;
            for (const record of this.#panels.values()) record.viewport.hidden = record !== target;
            this.renderTabs([...this.#panels.values()], target);
            this.#writeSelection(target);
            if (!initial && previous) this.#context.publish('selected', this.#payload(previous, false));
            if (target) this.#context.publish('selected', this.#payload(target, true));
        }
        closePanel(record) {
            if (!record.config.closable) return;
            const allowed = record.config.allowClose();
            if (typeof allowed !== 'boolean') throw new TypeError('onClose must return a synchronous boolean');
            if (!allowed) return;
            const payload = {pageName:record.config.pageName, index:record.index, wasSelected:record === this.#selected};
            this.#context.publish('closing', payload);
            record.config.remove();
            this.#sync();
            this.#context.publish('closed', payload);
        }
    };
}
SelectedContainer.parameters = {
    selectedPage: {dtype:'T', default:null, nullable:true, binding:'twoWay'},
    selected: {dtype:'L', default:null, nullable:true, binding:'twoWay'},
};

const selectionChildParameters = {onClose: {inline: []}};

export const StackContainer = defineComponent({
    name:'stackContainer', tag:'gramlot-stack-container', base:SelectedContainer, subTags:'*',
    sourceContext: true, childParameters: selectionChildParameters,
    implementation: Base => class extends Base {},
});

export const TabContainer = defineComponent({
    name:'tabContainer', tag:'gramlot-tab-container', base:SelectedContainer, subTags:'*',
    sourceContext: true, childParameters: selectionChildParameters,
    parameters: {
        tabMode: {dtype:'T', default:'tabs', binding:'read', enum:['tabs','underline']},
        tabPosition: {dtype:'T', default:'top', binding:'read', enum:['top','bottom','left','right']},
        tabAlign: {dtype:'T', default:'start', binding:'read', enum:['start','center','end']},
    },
    implementation: Base => class extends Base {
        #tabs = new Map();
        constructor() {
            super();
            const doc = this.ownerDocument;
            this.tabStrip = doc.createElement('div'); this.tabStrip.className = 'tabs'; this.tabStrip.setAttribute('role', 'tablist');
            this.control.prepend(this.tabStrip);
            const style = doc.createElement('style');
            style.textContent = `
                .selection{min-width:0;--tab-border:var(--gramlot-tab-border,var(--gramlot-border,#aaa));
                    --tab-radius:var(--gramlot-tab-radius,4px);--tab-indicator:var(--gramlot-tab-indicator-color,var(--gramlot-action,#3766b5))}
                .panels{background:var(--gramlot-tab-selected-background,var(--gramlot-surface,white))}
                .tabs{display:var(--gramlot-tab-strip-display,flex);flex:none;align-items:stretch;gap:var(--gramlot-tab-gap,3px);min-width:0;min-height:0;
                    padding:var(--gramlot-tab-strip-padding,4px);overflow:auto;overscroll-behavior:contain;
                    border-bottom:1px solid var(--tab-border);background:var(--gramlot-tab-background,var(--gramlot-surface-subtle,#eef1f5))}
                [data-align=center] .tabs{justify-content:safe center}
                [data-align=end] .tabs{justify-content:safe flex-end}
                .tab-entry{position:relative;display:flex;flex:none;align-items:stretch;border:1px solid transparent;border-bottom:0;
                    border-radius:var(--tab-radius) var(--tab-radius) 0 0;color:var(--gramlot-tab-color,var(--gramlot-text-secondary,#555))}
                .tab-entry:has([aria-selected=true]){border-color:var(--tab-border);color:var(--gramlot-tab-selected-color,var(--gramlot-ink,#222));
                    background:var(--gramlot-tab-selected-background,var(--gramlot-surface,white))}
                button{box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:var(--gramlot-tab-content-gap,.4em);
                    font:inherit;line-height:1.2;color:inherit;border:0;background:transparent;cursor:pointer;white-space:nowrap;min-width:0;
                    padding:var(--gramlot-tab-padding,4px 10px);min-height:max(var(--gramlot-touch-target,0px),var(--gramlot-tab-height,28px));border-radius:inherit}
                button[aria-selected=true]{font-weight:600}
                .icon,.badge{flex:none}.icon:empty{display:none}.caption{overflow:hidden;text-overflow:ellipsis}
                .badge{font-size:var(--gramlot-tab-badge-size,.8em);font-weight:600;line-height:1.3;border-radius:999px;
                    min-width:1.3em;padding:var(--gramlot-tab-badge-padding,0 .35em);text-align:center;
                    background:var(--gramlot-tab-badge-background,var(--gramlot-brand-blue,#3766b5));color:var(--gramlot-tab-badge-color,white)}
                @media(hover:hover){button:not(:disabled):hover{background:var(--gramlot-tab-hover-background,var(--gramlot-selected,#e8f1fc))}}
                button:disabled{opacity:.5;cursor:default}
                button:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:-3px}
                .close{align-self:center;flex:none;min-height:var(--gramlot-touch-target,20px);min-width:var(--gramlot-touch-target,20px);
                    padding:0;margin-inline-end:3px;border-radius:var(--tab-radius);font-size:1.15em}
                [hidden]{display:none!important}
                [data-position=top] .tabs{padding-bottom:0}
                [data-position=bottom]{flex-direction:column-reverse}
                [data-position=bottom] .tabs{border-bottom:0;border-top:1px solid var(--tab-border);padding-top:0}
                [data-position=bottom] .tab-entry{border-bottom:1px solid transparent;border-top:0;border-radius:0 0 var(--tab-radius) var(--tab-radius)}
                [data-position=left]{flex-direction:row}[data-position=right]{flex-direction:row-reverse}
                :is([data-position=left],[data-position=right]) .tabs{flex-direction:column;max-width:min(40%,var(--gramlot-tab-side-width,12rem));border-bottom:0}
                :is([data-position=left],[data-position=right]) button[role=tab]{flex:1;justify-content:flex-start}
                [data-position=left] .tabs{border-right:1px solid var(--tab-border);padding-right:0}
                [data-position=right] .tabs{border-left:1px solid var(--tab-border);padding-left:0}
                [data-position=left] .tab-entry{border-bottom:1px solid transparent;border-right:0;border-radius:var(--tab-radius) 0 0 var(--tab-radius)}
                [data-position=right] .tab-entry{border-bottom:1px solid transparent;border-left:0;border-radius:0 var(--tab-radius) var(--tab-radius) 0}
                .tab-entry:has([aria-selected=true]){border-color:var(--tab-border)}
                [data-mode=underline] .tabs{background:transparent}
                [data-mode=underline] .tab-entry{border:0;border-radius:0;background:transparent}
                [data-mode=underline] .tab-entry:has([aria-selected=true])::after{content:'';position:absolute;pointer-events:none;
                    background:var(--tab-indicator);height:var(--gramlot-tab-indicator-size,2px);bottom:0;left:0;right:0}
                [data-mode=underline][data-position=bottom] .tab-entry::after{top:0;bottom:auto}
                [data-mode=underline]:is([data-position=left],[data-position=right]) .tab-entry::after{height:auto;width:var(--gramlot-tab-indicator-size,2px);top:0;bottom:0}
                [data-mode=underline][data-position=left] .tab-entry::after{left:auto;right:0}
                [data-mode=underline][data-position=right] .tab-entry::after{left:0;right:auto}`;
            this.shadowRoot.append(style);
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const {tabMode, tabPosition, tabAlign} = this.parameters;
            if (!['tabs','underline'].includes(tabMode)) throw new TypeError('Invalid tabMode');
            if (!['top','bottom','left','right'].includes(tabPosition)) throw new TypeError('Invalid tabPosition');
            if (!['start','center','end'].includes(tabAlign)) throw new TypeError('Invalid tabAlign');
            this.control.dataset.mode = tabMode; this.control.dataset.position = tabPosition;
            this.control.dataset.align = tabAlign;
            this.tabStrip.setAttribute('aria-orientation', ['left','right'].includes(tabPosition) ? 'vertical' : 'horizontal');
            return rest;
        }
        renderTabs(records, selected) {
            for (const [record, entry] of this.#tabs) {
                if (!records.includes(record)) { entry.root.remove(); this.#tabs.delete(record); }
            }
            for (const [index, record] of records.entries()) {
                let entry = this.#tabs.get(record);
                if (!entry) {
                    const doc = this.ownerDocument, root = doc.createElement('div'), button = doc.createElement('button'), close = doc.createElement('button');
                    root.className = 'tab-entry'; button.type = close.type = 'button'; button.setAttribute('role', 'tab');
                    button.id = `tab-${record.config.slot}`; button.setAttribute('aria-controls', record.viewport.id);
                    record.viewport.setAttribute('role', 'tabpanel');
                    record.viewport.setAttribute('aria-labelledby', button.id);
                    const icon = doc.createElement('span'), caption = doc.createElement('span'), badge = doc.createElement('span');
                    icon.className = 'icon'; icon.setAttribute('aria-hidden', 'true'); caption.className = 'caption'; badge.className = 'badge';
                    button.append(icon, caption, badge);
                    close.className = 'close'; close.textContent = '×';
                    button.addEventListener('click', () => this.selectPanel(record));
                    close.addEventListener('click', () => {
                        this.closePanel(record);
                        if (!close.isConnected) this.tabStrip.querySelector('[aria-selected=true]')?.focus();
                    });
                    button.addEventListener('keydown', event => {
                        if (event.key === 'Delete') { event.preventDefault(); this.closePanel(record); this.tabStrip.querySelector('[aria-selected=true]')?.focus(); return; }
                        const vertical = ['left','right'].includes(this.parameters.tabPosition);
                        const previous = vertical ? 'ArrowUp' : 'ArrowLeft', nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
                        if (![previous,nextKey,'Home','End'].includes(event.key)) return;
                        event.preventDefault();
                        const available = [...this.#tabs].filter(([r]) => !r.config.hidden && !r.config.disabled)
                            .sort(([a], [b]) => a.index - b.index);
                        let index = available.findIndex(([r]) => r === record);
                        index = event.key === 'Home' ? 0 : event.key === 'End' ? available.length - 1
                            : (index + (event.key === nextKey ? 1 : -1) + available.length) % available.length;
                        const [next, tab] = available[index]; this.selectPanel(next); tab.button.focus();
                        tab.button.scrollIntoView({block:'nearest',inline:'nearest'});
                    });
                    root.append(button, close); this.tabStrip.append(root); entry = {root,button,close,icon,caption,badge}; this.#tabs.set(record, entry);
                }
                if (this.tabStrip.children[index] !== entry.root) this.tabStrip.insertBefore(entry.root, this.tabStrip.children[index] ?? null);
                entry.root.hidden = !!record.config.hidden;
                const caption = record.config.title || record.config.pageName || String(record.index + 1);
                entry.caption.textContent = caption; entry.button.title = caption;
                entry.icon.textContent = record.config.icon;
                entry.badge.textContent = record.config.badge ?? '';
                entry.badge.hidden = record.config.badge == null || record.config.badge === '';
                entry.badge.style.backgroundColor = record.config.badge_color;
                entry.button.setAttribute('aria-label', entry.badge.hidden ? caption : `${caption} ${record.config.badge}`);
                entry.button.disabled = !!record.config.disabled;
                entry.button.setAttribute('aria-selected', String(record === selected));
                entry.button.tabIndex = record === selected ? 0 : -1;
                entry.close.hidden = !record.config.closable;
                entry.close.disabled = !!record.config.disabled;
                entry.close.setAttribute('aria-label', `Close ${caption}`);
            }
        }
    },
});
