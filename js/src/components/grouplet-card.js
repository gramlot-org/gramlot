/** A remote Source body with Data-bound card presentation. */
import {defineComponent} from './registry.js';
import {Container} from './container.js';
import {labelboxContent} from '../view/labelbox.js';
import {markdownRenderer} from './markdown-document.js';
import {positionPopup} from './popup.js';

export const GroupletCard = defineComponent({
    name: 'groupletCard', tag: 'gramlot-grouplet-card', base: Container,
    subTags: '*', sourceContext: true,
    parameters: {
        remote: {dtype: 'T', nullable: true, binding: 'read'},
        title: {dtype: 'T', default: '', qualification: 'intl_str', binding: 'read'},
        chromeSide: {dtype: 'T', default: 'top', enum: ['top', 'left', 'right'], binding: 'read'},
        collapsible: {dtype: 'B', default: false, binding: 'read'},
        collapsed: {dtype: 'B', default: false, binding: 'twoWay'},
        checkbox: {dtype: 'B', nullable: true, default: null, binding: 'twoWay'},
        checkboxLabel: {dtype: 'T', default: '', qualification: 'intl_str', binding: 'read'},
        delitem: {dtype: 'B', nullable: true, default: null, binding: 'read'},
        doc: {dtype: 'T', default: '', binding: 'read'},
    },
    implementation: Base => class extends Base {
        #context;
        #observer;
        #menu;
        #ownMenu;
        #docEvents;
        #docText;
        constructor() {
            super();
            const doc = this.ownerDocument;
            const style = doc.createElement('style');
            style.textContent = `
                :host {
                    border: 1px solid var(--gramlot-border-control, #aaa);
                    border-radius: var(--gramlot-window-radius, 8px);
                    background: var(--gramlot-surface, Canvas);
                }
                .card-shell {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    border-radius: inherit;
                    overflow: hidden;
                }
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: .65rem;
                    padding: .6rem .85rem;
                    min-width: 0;
                    background: var(--gramlot-card-header-background, var(--gramlot-header-background, #303946));
                    color: var(--gramlot-card-header-color, var(--gramlot-header-color, #fff));
                }
                button {
                    font: inherit;
                    color: inherit;
                    background: transparent;
                    border: 0;
                    border-radius: var(--gramlot-radius-sm, 4px);
                    cursor: pointer;
                }
                button:focus-visible,
                input:focus-visible {
                    outline: 2px solid var(--gramlot-focus-ring, Highlight);
                    outline-offset: 2px;
                }
                .card-title {
                    flex: 1;
                    min-width: 0;
                    padding: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    line-height: 1.5;
                    text-align: start;
                    overflow-wrap: break-word;
                }
                .card-title:disabled {
                    opacity: 1;
                    cursor: default;
                }
                .card-collapse {
                    display: grid;
                    place-items: center;
                    flex: none;
                    min-width: var(--gramlot-touch-target, 36px);
                    min-height: var(--gramlot-touch-target, 36px);
                    padding: .5rem;
                    font-size: 0;
                }
                .card-collapse::before {
                    content: '';
                    width: .5rem;
                    height: .5rem;
                    border-right: 2px solid currentColor;
                    border-bottom: 2px solid currentColor;
                    transform: translateY(-2px) rotate(45deg);
                }
                .card-collapse:hover,
                .card-actions:hover,
                .card-doc-button:hover,
                .card-doc-close:hover,
                .card-title:not(:disabled):hover {
                    background: color-mix(in srgb, currentColor 12%, transparent);
                }
                .card-check {
                    flex: none;
                    width: 1.2rem;
                    height: 1.2rem;
                    margin: .4rem;
                    accent-color: var(--gramlot-action, Highlight);
                    cursor: pointer;
                }
                .card-check-label {
                    display: flex;
                    align-items: center;
                    gap: .35rem;
                    min-width: 0;
                    max-width: 100%;
                    font-size: .9rem;
                    line-height: 1.4;
                    cursor: pointer;
                }
                .card-check-label > .card-check { margin: .25rem 0; }
                .card-check-caption {
                    min-width: 0;
                    overflow-wrap: anywhere;
                }
                .card-actions {
                    flex: none;
                    min-height: var(--gramlot-touch-target, 36px);
                    padding: .35rem .5rem;
                    font-size: .9rem;
                }
                .card-header { flex-wrap: wrap; }
                .card-doc-button, .card-doc-close {
                    flex: none;
                    min-height: var(--gramlot-touch-target, 36px);
                    min-width: var(--gramlot-touch-target, 36px);
                    padding: .35rem .5rem;
                }
                .card-doc-popup {
                    position: fixed;
                    inset: auto;
                    margin: 0;
                    padding: 0;
                    width: 34rem;
                    max-width: var(--gramlot-popup-available-width, calc(100vw - 16px));
                    max-height: var(--gramlot-popup-available-height, calc(100vh - 16px));
                    overflow: auto;
                    border: 1px solid var(--gramlot-border-control, #aaa);
                    border-radius: var(--gramlot-window-radius, 8px);
                    background: var(--gramlot-surface, Canvas);
                    color: var(--gramlot-ink, CanvasText);
                    box-shadow: 0 8px 28px #0003;
                    font-size: max(1rem, 15px);
                    line-height: 1.6;
                    overflow-wrap: anywhere;
                }
                .card-doc-heading {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: .6rem 1rem;
                    border-bottom: 1px solid var(--gramlot-border-control, #aaa);
                }
                .card-doc-heading h2 { flex: 1; font-size: 1.1em; margin: 0; }
                .card-doc-body { padding: .25rem 1.25rem 1rem; }
                .card-doc-body :is(h1, h2, h3) { font-size: 1.05em; line-height: 1.4; }
                .card-doc-body :is(ul, ol) { padding-inline-start: 1.5rem; }
                .card-doc-body li + li { margin-top: .4rem; }
                .card-doc-body a { color: var(--gramlot-action, LinkText); }
                .card-doc-body pre { overflow: auto; }
                .card-doc-body img { max-width: 100%; }
                .card-doc-body table { display: block; overflow: auto; border-collapse: collapse; }
                .card-doc-body :is(th, td) { border: 1px solid var(--gramlot-border-control, #aaa); padding: .3rem .5rem; }
                .control-box {
                    flex: 1;
                    min-width: 0;
                    padding: 1.25rem;
                }
                [hidden] { display: none !important; }

                /* Side headers occupy their content height, not a solid wall. */
                .card-shell[data-side=left],
                .card-shell[data-side=right] {
                    flex-direction: row;
                    align-items: flex-start;
                }
                .card-shell[data-side=right] > .card-header { order: 1; }
                .card-shell:not([data-side=top]) > .card-header {
                    flex: 0 0 8rem;
                    flex-direction: column;
                    align-items: flex-start;
                    max-width: 35%;
                    gap: .5rem;
                    padding: .75rem;
                }
                .card-shell[data-side=left] > .card-header { border-bottom-right-radius: .5rem; }
                .card-shell[data-side=right] > .card-header { border-bottom-left-radius: .5rem; }
                .card-shell:not([data-side=top]) > .card-header > .card-title { flex: 0; }

                .card-shell[data-collapsed] { display: block; }
                .card-shell[data-collapsed] > .card-header {
                    flex-direction: row;
                    align-items: center;
                    width: auto;
                    max-width: none;
                    border-radius: 0;
                }
                .card-shell[data-collapsed] > .card-header > .card-title { flex: 1; }
                .card-shell[data-collapsed] > .card-header > .card-collapse::before {
                    transform: translateX(-2px) rotate(-45deg);
                }
            `;
            this.shell = doc.createElement('div'); this.shell.className = 'card-shell';
            this.header = doc.createElement('div'); this.header.className = 'card-header';
            this.collapseButton = doc.createElement('button');
            this.collapseButton.type = 'button'; this.collapseButton.className = 'card-collapse';
            this.collapseButton.setAttribute('aria-controls', 'control');
            this.heading = doc.createElement('button');
            this.heading.type = 'button'; this.heading.className = 'card-title';
            this.heading.setAttribute('aria-controls', 'control');
            this.check = doc.createElement('input');
            this.check.type = 'checkbox'; this.check.className = 'card-check';
            this.checkLabel = doc.createElement('label'); this.checkLabel.className = 'card-check-label';
            this.checkCaption = doc.createElement('span'); this.checkCaption.className = 'card-check-caption';
            this.checkLabel.append(this.check, this.checkCaption);
            this.actionsButton = doc.createElement('button');
            this.actionsButton.type = 'button'; this.actionsButton.className = 'card-actions';
            this.actionsButton.textContent = 'Actions ⋮';
            this.actionsButton.setAttribute('aria-haspopup', 'menu');
            this.actionsButton.setAttribute('aria-expanded', 'false');
            this.actionsButton.hidden = true;
            const menuSlot = doc.createElement('slot'); menuSlot.name = 'card-menu';
            this.docButton = doc.createElement('button');
            this.docButton.type = 'button'; this.docButton.className = 'card-doc-button';
            this.docButton.textContent = 'ⓘ'; this.docButton.hidden = true;
            this.docButton.setAttribute('aria-haspopup', 'dialog');
            this.docButton.setAttribute('aria-controls', 'card-doc');
            this.docButton.setAttribute('aria-expanded', 'false');
            this.docPopup = doc.createElement('section');
            this.docPopup.id = 'card-doc'; this.docPopup.className = 'card-doc-popup';
            this.docPopup.setAttribute('popover', 'manual');
            this.docPopup.setAttribute('role', 'dialog');
            this.docPopup.setAttribute('aria-labelledby', 'card-doc-title');
            const docHeading = doc.createElement('div'); docHeading.className = 'card-doc-heading';
            this.docTitle = doc.createElement('h2'); this.docTitle.id = 'card-doc-title';
            this.docClose = doc.createElement('button');
            this.docClose.type = 'button'; this.docClose.className = 'card-doc-close';
            this.docClose.textContent = 'Close'; this.docClose.setAttribute('aria-label', 'Close guide');
            docHeading.append(this.docTitle, this.docClose);
            this.docBody = doc.createElement('div'); this.docBody.className = 'card-doc-body';
            this.docPopup.append(docHeading, this.docBody);
            this.header.append(this.collapseButton, this.heading, this.docButton, this.checkLabel, this.actionsButton);
            this.shell.append(this.header, this.controlBox);
            this.shadowRoot.append(style, this.shell, menuSlot, this.docPopup);
            this.docButton.addEventListener('click', event => {
                event.stopPropagation();
                if (this.#docEvents) this.closeDoc(); else this.openDoc();
            });
            this.docClose.addEventListener('click', event => { event.stopPropagation(); this.closeDoc(); });
            this.docPopup.addEventListener('click', event => event.stopPropagation());
            this.controlBox.setAttribute('role', 'group');
            this.controlBox.tabIndex = -1;
            this.collapseButton.addEventListener('click', event => {
                event.stopPropagation();
                if (this.isConnected && this.parameters.collapsible)
                    this.#context.writeParameter('collapsed', !this.parameters.collapsed);
            });
            this.heading.addEventListener('click', event => {
                event.stopPropagation();
                if (this.isConnected && this.parameters.collapsible && this.parameters.collapsed)
                    this.#context.writeParameter('collapsed', false);
            });
            this.check.addEventListener('click', event => event.stopPropagation());
            this.checkLabel.addEventListener('click', event => event.stopPropagation());
            this.check.addEventListener('change', event => {
                event.stopPropagation();
                if (this.isConnected && this.parameters.checkbox !== null) {
                    this.#context.writeParameter('checkbox', this.check.checked);
                    // A literal or read-only pointer cannot acquire local UI state.
                    this.check.checked = this.parameters.checkbox;
                }
            });
            this.actionsButton.addEventListener('click', event => {
                event.stopPropagation();
                if (this.actionsMenu?.opened) this.actionsMenu.close(); else this.openMenu();
            });
            this.actionsButton.addEventListener('keydown', event => {
                if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
                    event.preventDefault(); event.stopPropagation(); this.openMenu(event.key === 'ArrowUp');
                }
            });
            this.#observer = new this.ownerDocument.defaultView.MutationObserver(() => this.refreshMenu());
        }
        setSourceContext(context) { this.#context = context; }
        connectedCallback() {
            this.#observer.observe(this, {childList: true});
            this.refreshMenu();
        }
        disconnectedCallback() {
            this.closeDoc(false);
            this.#observer.disconnect();
            this.actionsMenu?.close(false);
            this.clearItem?.remove();
            this.#menu = null;
        }
        get actionsMenu() { return this.#menu; }
        refreshMenu() {
            if (!this.parameters || !this.isConnected) return;
            const menus = [...this.children].map(labelboxContent).filter(child => child.localName === 'gramlot-menu');
            if (menus.length > 1 || menus[0]?.permanent) throw new TypeError('groupletCard accepts one direct popup menu');
            const hasClear = this.parameters.delitem !== null;
            if (!menus.length && hasClear && !this.#ownMenu) {
                this.#ownMenu = this.ownerDocument.createElement('gramlot-menu');
                this.#ownMenu.projectAttributes({});
                this.shadowRoot.append(this.#ownMenu);
            }
            const menu = menus[0] ?? (hasClear ? this.#ownMenu : null);
            if (this.#menu !== menu) {
                this.#menu?.close(false);
                this.clearItem?.remove();
                this.#menu = menu;
            }
            if (menus[0]) menus[0].slot = 'card-menu';
            this.actionsButton.hidden = !menu;
            this.actionsButton.setAttribute('aria-label', `Actions for ${this.parameters.title || 'card'}`);
            if (!menu) return;
            if (hasClear) {
                if (!this.clearItem) {
                    this.clearItem = this.ownerDocument.createElement('gramlot-menu-line');
                    this.clearItem.addEventListener('click', event => {
                        event.stopPropagation();
                        if (!this.isConnected || this.clearItem.disabled) return;
                        this.actionsMenu.close();
                        this.cardActions.clear().catch(error => this.#context.reportError(error, 'Clear card fields'));
                    });
                }
                this.clearItem.projectAttributes({caption: 'Clear', disabled: this.parameters.delitem !== true});
                if (this.clearItem.parentElement !== menu) menu.append(this.clearItem);
            } else this.clearItem?.remove();
            menu.refreshItems();
        }
        openMenu(last = false) {
            if (!this.isConnected) return;
            this.closeDoc(false);
            this.refreshMenu();
            this.actionsMenu?.open(this.actionsButton, last);
        }
        refreshDoc() {
            const content = this.parameters.doc;
            if (typeof content !== 'string') throw new TypeError('groupletCard doc must be Markdown text');
            const present = content.trim().length > 0;
            if (!present && this.#docEvents) {
                this.closeDoc(false);
                (this.parameters.collapsible ? this.collapseButton : this.controlBox).focus({preventScroll: true});
            }
            this.docButton.hidden = !present;
            this.docButton.setAttribute('aria-label', `Guide for ${this.parameters.title || 'card'}`);
            this.docTitle.textContent = this.parameters.title || 'Card guide';
            if (this.#docText !== content) {
                // The shared Markdown renderer escapes raw HTML and rejects unsafe URL schemes.
                this.docBody.innerHTML = markdownRenderer.render(content);
                this.#docText = content;
            }
            if (this.#docEvents) positionPopup(this.docPopup, this.docButton, {align: 'end'});
        }
        openDoc() {
            if (!this.isConnected || !this.parameters.doc.trim()) return;
            this.actionsMenu?.close(false);
            this.refreshDoc();
            if (this.#docEvents) return;
            this.docPopup.showPopover();
            this.#docEvents = new this.ownerDocument.defaultView.AbortController();
            const options = {signal: this.#docEvents.signal};
            const place = () => positionPopup(this.docPopup, this.docButton, {align: 'end'});
            this.ownerDocument.addEventListener('keydown', event => {
                if (event.key === 'Escape' && !event.defaultPrevented) {
                    event.preventDefault(); event.stopPropagation(); this.closeDoc();
                }
            }, options);
            this.ownerDocument.addEventListener('pointerdown', event => {
                if (!event.composedPath().includes(this.docPopup) && !event.composedPath().includes(this.docButton)) this.closeDoc(false);
            }, options);
            this.ownerDocument.addEventListener('focusin', event => {
                if (!event.composedPath().includes(this.docPopup) && !event.composedPath().includes(this.docButton)) this.closeDoc(false);
            }, options);
            this.ownerDocument.addEventListener('scroll', place, {...options, capture: true});
            this.ownerDocument.defaultView.addEventListener('resize', place, options);
            this.docButton.setAttribute('aria-expanded', 'true');
            place();
            this.docClose.focus({preventScroll: true});
        }
        closeDoc(restore = true) {
            if (!this.#docEvents) return;
            this.#docEvents.abort(); this.#docEvents = null;
            this.docPopup.hidePopover();
            this.docButton.setAttribute('aria-expanded', 'false');
            if (restore && this.isConnected) this.docButton.focus({preventScroll: true});
        }
        projectAttributes(attrs) {
            const rest = super.projectAttributes(attrs);
            const p = this.parameters;
            if (!['top', 'left', 'right'].includes(p.chromeSide))
                throw new TypeError('groupletCard chromeSide must be top, left or right');
            if (typeof p.title !== 'string' || typeof p.checkboxLabel !== 'string'
                || typeof p.collapsible !== 'boolean' || typeof p.collapsed !== 'boolean'
                || (p.delitem !== null && typeof p.delitem !== 'boolean')
                || (p.checkbox !== null && typeof p.checkbox !== 'boolean'))
                throw new TypeError('groupletCard requires text labels and boolean states');
            const collapsed = p.collapsible && p.collapsed;
            if (collapsed && !this.controlBox.hidden && this.contains(this.ownerDocument.activeElement)
                && this.ownerDocument.activeElement !== this) this.collapseButton.focus();
            this.heading.textContent = p.title;
            this.heading.disabled = !collapsed;
            this.heading.setAttribute('aria-expanded', String(!collapsed));
            this.controlBox.setAttribute('aria-label', p.title);
            this.collapseButton.hidden = !p.collapsible;
            this.collapseButton.textContent = collapsed ? '▸' : '▾';
            this.collapseButton.title = collapsed ? 'Expand card' : 'Collapse card';
            this.collapseButton.setAttribute('aria-label', this.collapseButton.title);
            this.collapseButton.setAttribute('aria-expanded', String(!collapsed));
            this.check.hidden = p.checkbox === null;
            this.checkLabel.hidden = p.checkbox === null;
            this.checkCaption.textContent = p.checkboxLabel;
            this.check.checked = p.checkbox === true;
            this.check.setAttribute('aria-label', p.checkboxLabel || (p.title ? `Select ${p.title}` : 'Select card'));
            this.shell.dataset.side = p.chromeSide;
            this.shell.toggleAttribute('data-collapsed', collapsed);
            this.controlBox.hidden = collapsed;
            this.refreshMenu();
            this.refreshDoc();
            return rest;
        }
    },
});
