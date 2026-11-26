import {positionPopup} from './popup.js';

const minimumTabWidth = 80;

/** Presentation for the existing TabContainer buttons. Panels never move during a drag. */
export function createTabBar(document) {
    const window = document.defaultView;
    if (!window.customElements.get('gramlot-tab-bar')) {
        window.customElements.define('gramlot-tab-bar', TabBar(window.HTMLElement));
    }
    return document.createElement('gramlot-tab-bar');
}

function TabBar(HTMLElement) {
    return class extends HTMLElement {
        #observer;
        #frame = null;
        #slot;
        #more;
        #menu;
        #selected;
        #drag;
        #suppressClick = false;
        constructor() {
            super();
            const shadow = this.attachShadow({mode: 'open'});
            const style = this.ownerDocument.createElement('style');
            style.textContent = `
                :host{display:var(--gramlot-tab-strip-display,grid);flex:none;min-width:0;min-height:0;
                    grid-template-rows:1fr;opacity:1;transition:grid-template-rows 200ms ease-out,opacity 200ms ease-out}
                :host([inert]){grid-template-rows:0fr;opacity:0}
                .clip{overflow:hidden;min-height:0;min-width:0}
                .scroll{box-sizing:border-box;padding:4px 8px;overflow:auto;scrollbar-width:none;overscroll-behavior:contain}
                :host([data-position=vertical]){grid-template-rows:1fr;grid-template-columns:1fr;
                    transition:grid-template-columns 200ms ease-out,opacity 200ms ease-out}
                :host([data-position=vertical][inert]){grid-template-columns:0fr}
                :host([data-position=vertical]) .scroll{height:100%}
                :host([data-position=horizontal]) .scroll{display:flex;align-items:stretch;overflow:hidden}
                :host([data-position=horizontal]) slot{display:block;min-width:0;flex:1;overflow:clip}
                .more{flex:none;width:max(30px,var(--gramlot-touch-target,0px));min-height:max(24px,var(--gramlot-touch-target,0px));font:bold 17px system-ui;
                    color:inherit;background:transparent;border:0;border-radius:5px;cursor:pointer}
                .more:hover,.more:focus-visible,[role=menuitem]:is(:hover,:focus-visible){background:var(--gramlot-selected,ButtonFace)}
                [role=menu]{position:fixed;inset:auto;margin:0;padding:4px;box-sizing:border-box;
                    min-width:min(10rem,var(--gramlot-popup-available-width));max-width:var(--gramlot-popup-available-width);
                    max-height:var(--gramlot-popup-available-height);overflow:auto;border:1px solid var(--gramlot-border,#999);
                    border-radius:8px;background:var(--gramlot-surface,Canvas);color:var(--gramlot-ink,CanvasText);
                    box-shadow:0 3px 14px #0003}
                [role=menuitem]{box-sizing:border-box;display:flex;align-items:center;gap:.75em;width:100%;padding:5px 8px;
                    min-height:var(--gramlot-touch-target,24px);border:0;border-radius:4px;background:transparent;color:inherit;
                    text-align:start;font:inherit;cursor:pointer}
                .caption{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
                .badge{border-radius:999px;padding:0 .4em;background:var(--gramlot-tab-badge-background,#3766b5);
                    color:var(--gramlot-tab-badge-color,white);font-size:.85em}
                .drag-preview{position:fixed;inset:auto;left:0;top:0;margin:0;box-sizing:border-box;
                    padding:0 10px;pointer-events:none;user-select:none;border:1px solid var(--gramlot-border,#bbb);
                    border-radius:7px;background:var(--gramlot-surface,Canvas);color:var(--tabs-text,var(--gramlot-ink,CanvasText));
                    box-shadow:0 4px 12px #0003;font:12px system-ui;overflow:visible;will-change:transform}
                .drag-preview:popover-open{display:flex;align-items:center;justify-content:center;gap:.4em}
                .drag-preview .caption{flex:0 1 auto}
                .drag-preview[data-detach]{outline:2px solid var(--gramlot-action,Highlight);box-shadow:0 7px 18px #0004}
                .drag-preview[data-detach]::after{content:'↗';position:absolute;right:-6px;top:-7px;
                    border-radius:50%;padding:1px 4px;background:var(--gramlot-action,Highlight);color:var(--gramlot-surface,Canvas);font-weight:bold}
                @media(prefers-reduced-motion:reduce){:host{transition:none!important}}`;
            const clip = this.ownerDocument.createElement('div');
            const scroll = this.ownerDocument.createElement('div');
            clip.className = 'clip';
            scroll.className = 'scroll';
            this.#slot = this.ownerDocument.createElement('slot');
            this.#more = this.ownerDocument.createElement('button');
            this.#more.className = 'more';
            this.#more.type = 'button';
            this.#more.hidden = true;
            this.#more.textContent = '»';
            this.#more.title = 'More tabs';
            this.#more.setAttribute('aria-label', 'More tabs');
            this.#more.setAttribute('aria-haspopup', 'menu');
            this.#more.setAttribute('aria-expanded', 'false');
            this.#menu = this.ownerDocument.createElement('div');
            this.#menu.id = 'more-tabs';
            this.#menu.setAttribute('role','menu');
            this.#menu.setAttribute('aria-label','More tabs');
            this.#menu.setAttribute('popover','auto');
            this.#more.popoverTargetElement = this.#menu;
            this.#more.setAttribute('aria-controls', this.#menu.id);
            this.#menu.addEventListener('beforetoggle', event => {
                this.#more.setAttribute('aria-expanded', String(event.newState === 'open'));
                if (event.newState === 'open') this.#refreshMenu();
            });
            this.#menu.addEventListener('toggle', () => {
                if (!this.#menu.matches(':popover-open')) return;
                positionPopup(this.#menu, this.#more, {align:'end'});
            });
            this.#more.addEventListener('keydown', event => {
                if (event.key === 'ArrowDown') { event.preventDefault(); this.#more.click(); }
            });
            this.#menu.addEventListener('keydown', event => {
                const items = [...this.#menu.querySelectorAll('button:not(:disabled)')];
                const index = items.indexOf(event.target);
                if (!items.length || !['Home','End','ArrowDown','ArrowUp'].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length-1
                    : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
                items[next].focus();
            });
            scroll.append(this.#slot, this.#more);
            clip.append(scroll);
            shadow.append(style, clip, this.#menu);
            const view = this.ownerDocument.defaultView;
            this.#observer = new view.ResizeObserver(() => {
                if (this.#frame !== null) return;
                this.#frame = view.requestAnimationFrame(() => {
                    this.#frame = null;
                    this.#layout();
                });
            });
            this.addEventListener('pointerdown', event => {
                const button = event.target.closest('[role=tab]');
                if (this.#drag || !button || button.disabled || event.button !== 0 || !event.isPrimary) return;
                this.#suppressClick = false;
                this.#drag = {entry:button.parentElement, strip:button.parentElement.parentElement, id:event.pointerId, x:event.clientX, y:event.clientY};
                button.setPointerCapture(event.pointerId);
            });
            this.addEventListener('pointermove', event => {
                const drag = this.#drag;
                if (drag?.id !== event.pointerId) return;
                if (!drag.preview) {
                    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 4) return;
                    this.#suppressClick = true;
                    this.#lift(drag);
                }
                const drop = this.#dropPosition(event);
                drag.preview.style.transform = 'translate(' + (event.clientX - drag.gripX) + 'px,' + (event.clientY - drag.gripY) + 'px)';
                drag.preview.toggleAttribute('data-detach', drop.outside && drag.entry.hasAttribute('data-detachable'));
                this.#showGap(drop);
            });
            this.addEventListener('pointerup', event => {
                const drag = this.#drag;
                if (drag?.id !== event.pointerId) return;
                const drop = drag.preview && this.#dropPosition(event);
                this.#endDrag();
                if (!drop) return;
                if (drop.outside) {
                    this.detachTab(drag.entry, {left:event.clientX-12, top:event.clientY-12});
                    return;
                }
                const strip = drag.entry.parentElement;
                const focused = strip.getRootNode().activeElement;
                strip.insertBefore(drag.entry, drop.before);
                if (drag.entry.contains(focused)) focused.focus({preventScroll:true});
                this.#layout();
            });
            for (const type of ['pointercancel','lostpointercapture']) {
                this.addEventListener(type, event => {
                    if (this.#drag?.id === event.pointerId) this.#endDrag();
                });
            }
            this.addEventListener('keydown', event => {
                if (event.key === 'Escape' && this.#drag) {
                    event.preventDefault();
                    this.#endDrag();
                }
            });
            this.addEventListener('click', event => {
                if (event.detail && this.#suppressClick) {
                    event.stopPropagation();
                    this.#suppressClick = false;
                }
            }, true);
            this.addEventListener('auxclick', event => {
                const button = event.target.closest('[role=tab]');
                if (event.button !== 1 || !button || button.disabled) return;
                event.preventDefault();
                const close = button.parentElement.querySelector('.close');
                if (!close.hidden) close.click();
            });
            this.addEventListener('transitionend', () => this.#position());
        }
        #lift(drag) {
            const rect = drag.entry.getBoundingClientRect();
            drag.gripX = drag.x - rect.left;
            drag.gripY = drag.y - rect.top;
            const preview = this.ownerDocument.createElement('div');
            preview.className = 'drag-preview';
            preview.setAttribute('popover','manual');
            preview.setAttribute('aria-hidden','true');
            preview.inert = true;
            preview.style.width = rect.width + 'px';
            preview.style.height = rect.height + 'px';
            for (const part of drag.entry.querySelector('[role=tab]').children) {
                if (!part.hidden && part.textContent) preview.append(part.cloneNode(true));
            }
            this.shadowRoot.append(preview);
            preview.showPopover();
            drag.preview = preview;
            drag.entry.setAttribute('data-dragging','');
        }
        #dropPosition(event) {
            const entry = this.#drag.entry, strip = entry.parentElement;
            const vertical = this.dataset.position === 'vertical';
            const bounds = this.getBoundingClientRect();
            const outside = vertical ? Math.max(bounds.left-event.clientX, event.clientX-bounds.right) > 24
                : Math.max(bounds.top-event.clientY, event.clientY-bounds.bottom) > 24;
            const rect = strip.getBoundingClientRect();
            const point = vertical ? event.clientY - rect.top : event.clientX - rect.left;
            const tabs = [...strip.children].filter(tab => !tab.hidden && !tab.inert && !tab.hasAttribute('data-overflow'));
            // Offsets describe the committed slots even while their contents slide into the proposed order.
            const before = tabs.find(tab => tab !== entry && point < (vertical
                ? tab.offsetTop + tab.offsetHeight / 2 : tab.offsetLeft + tab.offsetWidth / 2));
            return {outside, vertical, tabs, before:before ?? tabs.at(-1)?.nextElementSibling ?? null};
        }
        #showGap({outside, vertical, tabs, before}) {
            const {entry} = this.#drag;
            const strip = entry.parentElement;
            const from = tabs.indexOf(entry);
            const others = tabs.filter(tab => tab !== entry);
            const beforeIndex = others.indexOf(before);
            const to = outside ? from : beforeIndex < 0 ? others.length : beforeIndex;
            const size = vertical ? entry.offsetHeight : entry.offsetWidth;
            tabs.forEach((tab, index) => {
                let shift = 0;
                if (index > from && index <= to) shift = -size;
                if (index < from && index >= to) shift = size;
                tab.style.translate = shift ? (vertical ? '0 ' + shift + 'px' : shift + 'px 0') : '';
                if (tab === this.#selected) strip.style.setProperty('--capsule-shift', tab.style.translate || 'none');
            });
        }
        #endDrag() {
            const drag = this.#drag;
            this.#drag = null;
            if (!drag) return;
            if (drag.preview) {
                drag.preview.remove();
                drag.entry.removeAttribute('data-dragging');
                for (const tab of drag.strip.children) tab.style.removeProperty('translate');
                drag.strip.style.removeProperty('--capsule-shift');
            }
            const button = drag.entry.querySelector('[role=tab]');
            if (button.hasPointerCapture(drag.id)) button.releasePointerCapture(drag.id);
        }
        connectedCallback() {
            this.#observer.observe(this);
            if (this.#selected) this.#observer.observe(this.#selected);
        }
        disconnectedCallback() {
            this.#observer.disconnect();
            if (this.#frame !== null) this.ownerDocument.defaultView.cancelAnimationFrame(this.#frame);
            this.#frame = null;
            this.#endDrag();
        }
        update(count, selected) {
            const collapsed = count < 2;
            const reveal = this.hasAttribute('inert') && !collapsed;
            this.toggleAttribute('inert', collapsed);
            this.setAttribute('aria-hidden', String(collapsed));
            const changed = selected !== this.#selected;
            if (changed) {
                if (this.#selected) this.#observer.unobserve(this.#selected);
                this.#selected = selected;
                if (selected) this.#observer.observe(selected);
            }
            this.#layout();
            if (this.dataset.position === 'vertical' && selected && !collapsed && (changed || reveal)) {
                const scroller = this.shadowRoot.querySelector('.scroll');
                const target = selected.getBoundingClientRect(), bounds = scroller.getBoundingClientRect();
                if (target.left < bounds.left) scroller.scrollLeft += target.left - bounds.left;
                if (target.right > bounds.right) scroller.scrollLeft += target.right - bounds.right;
                if (target.top < bounds.top) scroller.scrollTop += target.top - bounds.top;
                if (target.bottom > bounds.bottom) scroller.scrollTop += target.bottom - bounds.bottom;
            }
        }
        #refreshMenu() {
            const focused = this.shadowRoot.activeElement?.dataset.tab;
            const items = [...this.querySelectorAll('.tab-entry[data-overflow]:not([hidden]) [role=tab]')].map(tab => {
                const item = this.ownerDocument.createElement('button');
                item.type = 'button';
                item.setAttribute('role','menuitem');
                item.tabIndex = -1;
                item.dataset.tab = tab.id;
                item.disabled = tab.disabled;
                item.append(tab.querySelector('.caption').cloneNode(true));
                const badge = tab.querySelector('.badge');
                if (!badge.hidden) item.append(badge.cloneNode(true));
                item.addEventListener('click', () => {
                    this.#menu.hidePopover();
                    tab.click();
                    if (tab.offsetWidth) tab.focus();
                    else this.#more.focus();
                });
                return item;
            });
            const first = items.find(item => !item.disabled);
            if (first) first.autofocus = true;
            this.#menu.replaceChildren(...items);
            if (focused) (items.find(item => item.dataset.tab === focused) ?? items.find(item => !item.disabled))?.focus();
        }
        #layout() {
            const tabs = [...this.querySelectorAll('.tab-entry:not([hidden]):not(.closing)')];
            const horizontal = this.dataset.position === 'horizontal';
            const width = this.#slot.clientWidth + this.#more.offsetWidth;
            const overflow = horizontal && width > 0 && tabs.length > 1 && tabs.length * minimumTabWidth > width;
            this.#more.hidden = !overflow;
            const capacity = overflow ? Math.max(0, Math.floor((width-this.#more.offsetWidth)/minimumTabWidth)) : tabs.length;
            const visible = tabs.slice(0,capacity);
            if (capacity && this.#selected && !visible.includes(this.#selected)) visible[capacity-1] = this.#selected;
            for (const tab of tabs) tab.toggleAttribute('data-overflow', !visible.includes(tab));
            if (this.#more.getAttribute('aria-expanded') === 'true') {
                if (overflow) {
                    this.#refreshMenu();
                    positionPopup(this.#menu, this.#more, {align:'end'});
                } else this.#menu.hidePopover();
            }
            if (this.#drag && (!visible.includes(this.#drag.entry) || this.inert || this.#drag.entry.querySelector('[role=tab]').disabled)) this.#endDrag();
            this.#position();
        }
        #position() {
            const tab = this.#selected;
            if (!tab) return;
            const style = tab.parentElement.style;
            style.setProperty('--capsule-x', tab.offsetLeft + 'px');
            style.setProperty('--capsule-y', tab.offsetTop + 'px');
            style.setProperty('--capsule-width', tab.offsetWidth + 'px');
            style.setProperty('--capsule-height', tab.offsetHeight + 'px');
        }
    };
}

/** Entries stay in the container's shadow tree alongside the panels they label. */
export const tabBarStyles = `
    gramlot-tab-bar .tabs.tabs{position:relative;box-sizing:border-box;display:flex;align-items:stretch;
        min-width:min-content;width:100%;padding:0;border:0;gap:0;overflow:visible;border-radius:8px;
        background:var(--tabs-track,light-dark(rgb(0 0 0 / .06),rgb(255 255 255 / .08)))}
    gramlot-tab-bar .tabs:has([aria-selected=true])::before{content:"";position:absolute;top:0;left:0;
        pointer-events:none;border-radius:6px;width:var(--capsule-width);height:var(--capsule-height);
        transform:translate(var(--capsule-x),var(--capsule-y));translate:var(--capsule-shift,none);transition:transform 180ms ease-out,translate 120ms ease-out;
        background:var(--tabs-active,light-dark(white,rgb(255 255 255 / .18)));
        box-shadow:0 0 0 .5px rgb(0 0 0 / .12),0 1px 2px rgb(0 0 0 / .12)}
    gramlot-tab-bar .tabs .tab-entry{box-sizing:border-box;min-width:${minimumTabWidth}px;flex:1 1 0;overflow:hidden;
        height:max(24px,var(--gramlot-touch-target,0px));border:0;border-radius:6px;
        background:transparent;color:var(--tabs-text,var(--gramlot-ink,CanvasText));
        transition:flex-grow 200ms ease-out,min-width 200ms ease-out}
    gramlot-tab-bar .tabs:has([data-dragging]) .tab-entry{transition:translate 120ms ease-out}
    gramlot-tab-bar .tab-entry[data-dragging]{opacity:.25}
    gramlot-tab-bar .tabs:has([data-dragging] [aria-selected=true])::before{opacity:.25}
    gramlot-tab-bar[data-position=horizontal] .tab-entry{max-width:200px;contain:inline-size}
    gramlot-tab-bar .tab-entry[data-overflow]{display:none}
    @starting-style{gramlot-tab-bar .tabs .tab-entry{flex-grow:0;min-width:0}}
    gramlot-tab-bar .tabs .tab-entry button{padding:0 20px;min-height:0;font:12px system-ui}
    gramlot-tab-bar .tabs .tab-entry [role=tab]{width:100%;color:inherit;justify-content:center;
        touch-action:none;user-select:none;cursor:grab;opacity:.55}
    gramlot-tab-bar .tabs .tab-entry[data-dragging] [role=tab]{cursor:grabbing}
    gramlot-tab-bar .tabs .tab-entry [aria-selected=true]{opacity:1}
    gramlot-tab-bar .tabs .tab-entry .close{position:absolute;inset-inline-start:0;top:0;height:100%;
        margin:0;padding:0;width:20px;min-width:0;font:14px system-ui;opacity:0}
    gramlot-tab-bar .tabs .tab-entry:is(:hover,:focus-within) .close{opacity:1}
    @media(hover:hover){gramlot-tab-bar .tabs .tab-entry button:hover{background:transparent}
        gramlot-tab-bar .tabs .tab-entry:hover:not(:has([aria-selected=true])){background:rgb(0 0 0 / .05)}}
    @media(pointer:coarse){gramlot-tab-bar .tabs .tab-entry{height:max(44px,var(--gramlot-touch-target,0px))}
        gramlot-tab-bar .tabs .tab-entry .close{opacity:1;width:36px}
        gramlot-tab-bar .tabs .tab-entry [role=tab]{padding-inline:36px}}
    gramlot-tab-bar[data-position=vertical] .tabs.tabs{height:100%;max-width:none;width:100%}
    gramlot-tab-bar[data-position=vertical] .tabs .tab-entry{min-height:24px}
    gramlot-tab-bar .tabs .closing{animation:tab-bar-close 200ms ease-out forwards;pointer-events:none}
    @keyframes tab-bar-close{to{min-width:0;min-height:0;flex-grow:0}}
    @media(prefers-reduced-motion:reduce){gramlot-tab-bar .tabs .closing{animation:none;display:none}
        gramlot-tab-bar .tabs::before,gramlot-tab-bar .tabs .tab-entry{transition:none!important}}
`;
