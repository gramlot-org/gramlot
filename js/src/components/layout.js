/** Slotted layout components; Source owns children and Data owns field values. */
import {defineComponent, defineCollection} from './registry.js';
import {Labelbox} from './labelbox.js';
import {Container} from './container.js';
import {BorderContainer, ContentPane, FramePane} from './border-container.js';
export {BorderContainer, ContentPane, FramePane};
import {StackContainer, TabContainer} from './selected-container.js';
export {StackContainer, TabContainer};
import {positionPopup} from './popup.js';
import {FormletLabels} from './formlet-labels.js';
import {Dialog, FloatingPane} from './windows.js';
export {Dialog, FloatingPane};

const COPY_FEEDBACK_DURATION = 1600;


export const Formlet = defineComponent({
    name: 'formlet', tag: 'gramlot-formlet', base: Container, subTags: '*', presentationDefaults: ['lbl_', 'box_'],
    parameters: {
        columns: {dtype: ['L', 'T'], default: 1, binding: 'read'},
        col_min_width: {dtype: 'T', nullable: true, binding: 'read'},
    },
    implementation: Base => class extends Base {
        #labels;
        constructor() {
            super();
            const style = this.ownerDocument.createElement('style');
            style.textContent = `.control-box{display:grid;gap:inherit;align-items:start}
                :host{gap:var(--gramlot-formlet-gap,8px 16px)}`;
            this.shadowRoot.append(style);
            this.#labels = new FormletLabels(this);
        }
        connectedCallback() { this.#labels.connect(); }
        disconnectedCallback() { this.#labels.disconnect(); }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const {columns, col_min_width} = this.parameters;
            if (typeof columns === 'number' && (!Number.isInteger(columns) || columns < 1)) {
                throw new TypeError('formlet columns must be a positive integer or CSS track list');
            }
            this.control.style.gridTemplateColumns = col_min_width
                ? `repeat(auto-fit, minmax(min(100%, ${col_min_width}), 1fr))`
                : typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;
            this.#labels.schedule();
            // Presentation defaults belong to descendants, not this container's DOM.
            return Object.fromEntries(Object.entries(rest).filter(([name]) => !/^(lbl_|box_)/.test(name)));
        }
    }
});

export const GroupBox = defineComponent({
    name: 'groupBox', tag: 'gramlot-group-box', base: Container, subTags: '*', dataScope: true, mixins: [Labelbox],
    parameters: {
        copy: {dtype: 'B', default: false, binding: 'read'},
        lbl_variant: {dtype: 'T', default: 'bar', binding: 'read', enum: ['bar', 'underline']},
    },
    implementation: Base => class extends Base {
        #generation = 0;
        #timer;
        #busy = false;
        #menuEvents;
        #menuOpen = false;
        constructor() {
            super();
            this.control.setAttribute('role', 'group');
            this.fieldLabel.removeAttribute('for');
            const doc = this.ownerDocument;
            const style = doc.createElement('style');
            style.textContent = `.labelbox{gap:0;border:1px solid var(--gramlot-border-control,#aaa);border-radius:var(--gramlot-radius-sm,4px)}
                .label-box{display:flex;align-items:center;gap:.4em;padding:var(--gramlot-group-header-padding,.35em .65em);background:var(--gramlot-surface-subtle,#eef1f5)}
                .label-box[hidden]{display:none}.label-box label{flex:1;min-width:0}
                .control-box{padding:var(--gramlot-group-padding,.65em)}.labelbox[data-variant=underline]{border:0}
                [data-variant=underline]>.label-box{background:transparent;border-bottom:1px solid var(--gramlot-border-control,#aaa)}
                .actions{display:flex;align-items:center}.actions[hidden]{display:none}
                button{font:inherit;color:inherit;cursor:pointer;border:0;border-radius:var(--gramlot-radius-sm,4px);background:transparent;
                    padding:var(--gramlot-group-action-padding,.2em .4em);min-width:var(--gramlot-touch-target,var(--gramlot-group-action-size,24px));min-height:var(--gramlot-touch-target,var(--gramlot-group-action-size,24px))}
                button:hover{background:var(--gramlot-field-readonly-background,#ddd)}button:disabled{opacity:.5}
                button:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight)}
                .copy-menu{max-width:var(--gramlot-popup-available-width,100vw);position:fixed;inset:auto;margin:0;padding:var(--gramlot-popup-padding,4px);max-height:var(--gramlot-popup-available-height,100vh);overflow:auto;border:1px solid var(--gramlot-border-control,#aaa);
                    background:var(--gramlot-field-background,Canvas);color:var(--gramlot-ink,CanvasText);border-radius:var(--gramlot-radius-sm,4px)}
                .copy-menu button{display:block;width:100%;text-align:left}
                .status{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}`;
            this.actions = doc.createElement('span'); this.actions.className = 'actions';
            this.copyButton = doc.createElement('button'); this.copyButton.type = 'button';
            this.copyButton.textContent = '⧉'; this.copyButton.title = 'Copy TYTX';
            this.copyButton.setAttribute('aria-label', 'Copy TYTX');
            this.menuButton = doc.createElement('button'); this.menuButton.type = 'button';
            this.menuButton.textContent = '▾'; this.menuButton.setAttribute('aria-label', 'Choose copy format');
            this.menuButton.setAttribute('aria-expanded', 'false');
            this.copyMenu = doc.createElement('div'); this.copyMenu.className = 'copy-menu';
            this.copyMenu.id = 'copy-menu'; this.copyMenu.setAttribute('popover', 'auto');
            this.menuButton.setAttribute('aria-controls', 'copy-menu');
            for (const format of ['TYTX', 'JSON']) {
                const button = doc.createElement('button'); button.type = 'button'; button.textContent = `Copy ${format}`;
                button.addEventListener('click', () => { this.closeCopyMenu(); this.copyData(format); });
                this.copyMenu.append(button);
            }
            this.status = doc.createElement('span'); this.status.className = 'status';
            this.status.setAttribute('role', 'status');
            this.copyButton.addEventListener('click', () => this.copyData('TYTX'));
            this.menuButton.addEventListener('click', () => {
                if (this.#menuOpen) { this.closeCopyMenu(); return; }
                this.copyMenu.showPopover(); this.#menuOpen = true;
                positionPopup(this.copyMenu, this.menuButton, {align: 'end'});
                const view = doc.defaultView;
                this.#menuEvents = new view.AbortController();
                const options = {capture: true, signal: this.#menuEvents.signal};
                view.addEventListener('scroll', event => {
                    if (!event.composedPath().includes(this.copyMenu)) this.closeCopyMenu();
                }, options);
                view.addEventListener('resize', () => this.closeCopyMenu(), options);
                this.copyMenu.firstElementChild.focus();
            });
            this.copyMenu.addEventListener('toggle', event => {
                this.menuButton.setAttribute('aria-expanded', String(event.newState === 'open'));
                if (event.newState === 'closed') {
                    this.#menuOpen = false; this.#menuEvents?.abort(); this.#menuEvents = null;
                }
            });
            this.actions.append(this.copyButton, this.menuButton, this.status);
            this.labelBox.append(this.actions);
            this.shadowRoot.append(style, this.copyMenu);
        }
        closeCopyMenu() {
            if (this.#menuOpen) this.copyMenu.hidePopover();
            this.#menuOpen = false;
            this.#menuEvents?.abort(); this.#menuEvents = null;
            this.menuButton.setAttribute('aria-expanded', 'false');
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            if (!this.constructor.gramlotComponent.parameters.lbl_variant.enum.includes(this.parameters.lbl_variant)) throw new TypeError('groupBox lbl_variant must be bar or underline');
            this.box.dataset.variant = this.parameters.lbl_variant;
            this.actions.hidden = !this.parameters.copy;
            if (!this.parameters.copy) this.closeCopyMenu();
            this.labelBox.hidden = this.labelBox.hidden && !this.parameters.copy;
            this.copyButton.disabled = this.#busy;
            this.menuButton.disabled = this.#busy;
            return rest;
        }
        async copyData(format = 'TYTX') {
            if (!['TYTX', 'JSON'].includes(format)) throw new TypeError('Copy format must be TYTX or JSON');
            if (!this.parameters.copy || this.#busy || !this.isConnected) return;
            const generation = ++this.#generation;
            this.copyButton.title = 'Copy TYTX';
            this.copyButton.textContent = '⧉'; this.status.textContent = '';
            this.#busy = true; this.copyButton.disabled = this.menuButton.disabled = true;
            this.ownerDocument.defaultView.clearTimeout(this.#timer);
            try {
                const bag = this.readDataScope();
                const text = format === 'TYTX' ? bag.toTytx() : JSON.stringify(bag.asDict(false, false, true), null, 2);
                await this.ownerDocument.defaultView.navigator.clipboard.writeText(text);
                if (generation !== this.#generation || !this.isConnected) return;
                this.copyButton.textContent = '✓'; this.status.textContent = `Copied ${format}`;
                this.#timer = this.ownerDocument.defaultView.setTimeout(() => {
                    this.copyButton.textContent = '⧉'; this.status.textContent = '';
                }, COPY_FEEDBACK_DURATION);
            } catch (error) {
                if (generation !== this.#generation || !this.isConnected) return;
                this.copyButton.textContent = '!';
                this.copyButton.title = this.status.textContent = `Copy failed: ${error.message}`;
            } finally {
                if (generation === this.#generation) {
                    this.#busy = false; this.copyButton.disabled = this.menuButton.disabled = false;
                }
            }
        }
        disconnectedCallback() {
            this.closeCopyMenu();
            this.#generation++; this.#busy = false;
            this.ownerDocument.defaultView.clearTimeout(this.#timer);
        }
    }
});
export default defineCollection({name: 'layout', components: [Dialog, FloatingPane, FramePane, Formlet, GroupBox, ContentPane, BorderContainer, StackContainer, TabContainer]});
