/** Built-in command surfaces. Execution stays in ButtonBinding, state in ControlAdapter. */
import {defineComponent, defineCollection} from './registry.js';
import {controlElement} from './bases.js';
import {projectParameters} from './parameters.js';
import {positionPopup} from './popup.js';

function Command(HTMLElement) {
    return class extends controlElement(HTMLElement) {
        constructor() {
            super();
            const doc = this.ownerDocument;
            this.control = doc.createElement('button');
            this.control.type = 'button';
            this.control.id = 'control';
            this.icon = doc.createElement('span');
            this.icon.className = 'icon';
            this.icon.setAttribute('aria-hidden', 'true');
            this.caption = doc.createElement('slot');
            this.control.append(this.icon, this.caption);
            this.controlBox.append(this.control);
            const style = doc.createElement('style');
            style.textContent = `:host{vertical-align:middle} .control-box{display:flex;align-items:stretch}
                button{display:inline-flex;align-items:center;justify-content:center;gap:var(--gramlot-button-gap,.35em);font:inherit;
                    color:var(--gramlot-ink,CanvasText);background:var(--gramlot-button-background,var(--gramlot-field-background,Canvas));
                    border:1px solid var(--gramlot-border-control,#888);border-radius:var(--gramlot-radius-sm,4px);
                    min-height:max(var(--gramlot-field-height,28px),var(--gramlot-touch-target,0px));
                    padding:var(--gramlot-button-padding,.25em .65em);cursor:pointer}
                button:hover:not(:disabled){background:var(--gramlot-button-hover,var(--gramlot-field-readonly-background,#eee))}
                :host(.button--quiet) button{background:transparent;color:var(--gramlot-action,CanvasText);border-color:transparent}
                :host(.button--quiet) button:hover:not(:disabled){background:var(--gramlot-selected,Highlight);color:var(--gramlot-action-hover,CanvasText);border-color:transparent}
                button:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:2px}
                button:disabled{opacity:.55;cursor:not-allowed} .icon:empty{display:none}
                .led{display:inline-block;width:.6em;height:.6em;border-radius:50%;background:var(--gramlot-button-led-off,#888)}
                [aria-pressed=true] .led{background:var(--gramlot-button-led-on,#2b9a46)}
                .arrow{border-start-start-radius:0;border-end-start-radius:0;border-inline-start:0}
                .split{border-start-end-radius:0;border-end-end-radius:0}
                .popup{position:fixed;inset:auto;margin:0;padding:var(--gramlot-popup-padding,4px);overflow:auto;
                    max-width:var(--gramlot-popup-available-width);max-height:var(--gramlot-popup-available-height);
                    border:1px solid var(--gramlot-border-control,#888);border-radius:var(--gramlot-radius-sm,4px);
                    color:var(--gramlot-ink,CanvasText);background:var(--gramlot-field-background,Canvas);box-shadow:0 3px 12px #0003}
                :host([role=menuitem]){display:block} :host([role=menuitem]) button{width:100%;justify-content:start;border:0;background:transparent}
                :host([role=separator]){display:block;border-top:1px solid var(--gramlot-border-control,#888);margin:.25em}
                :host([role=separator]) button{display:none}`;
            this.shadowRoot.append(style);
        }
        get disabled() { return this.control.disabled; }
        set disabled(value) { this.control.disabled = Boolean(value); }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            this.control.disabled = Boolean(this.parameters.disabled);
            this.control.readOnly = Boolean(this.parameters.readonly);
            this.icon.textContent = this.parameters.icon ?? '';
            if (attrs['aria-label'] != null) this.control.setAttribute('aria-label', attrs['aria-label']);
            else this.control.removeAttribute('aria-label');
            return rest;
        }
        attachCommand() {}
        releaseCommand() {}
        commandTarget() { return this; }
        prepareCommand() { return !this.disabled; }
    };
}
Command.parameters = {
    disabled: {dtype: 'B', default: false, binding: 'read'},
    icon: {dtype: 'T', default: '', binding: 'read'}
};
export const Button = defineComponent({name: 'button', tag: 'gramlot-button', base: Command,
    command: true, subTags: '*', implementation: Base => class extends Base {}});
export const ToggleButton = defineComponent({name: 'toggleButton', tag: 'gramlot-toggle-button', base: Command,
    command: true, subTags: '*', parameters: {value: {dtype: 'B', default: false, binding: 'twoWay'},
        readonly: {dtype: 'B', default: false, binding: 'read'}},
    implementation: Base => class extends Base {
        #value = false;
        constructor() {
            super();
            const led = this.ownerDocument.createElement('span');
            led.className = 'led'; led.setAttribute('aria-hidden', 'true');
            this.control.prepend(led);
            this.writeControlValue(false);
        }
        get commitOnChange() { return true; }
        readControlValue() { return this.#value; }
        writeControlValue(value) {
            this.#value = value;
            this.control.setAttribute('aria-pressed', String(value));
        }
        prepareCommand(event) {
            if (!super.prepareCommand(event) || this.control.readOnly) return false;
            this.writeControlValue(!this.#value);
            this.control.dispatchEvent(new this.ownerDocument.defaultView.Event('change'));
            return true;
        }
    }
});
function MenuContainer(HTMLElement) {
    return class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: 'open'}).append(this.ownerDocument.createElement('slot'));
        }
        connectedCallback() { this.slot = 'menu'; this.setAttribute('role', 'menu'); }
        projectAttributes(attrs) { return projectParameters(this, attrs); }
    };
}
export const Menu = defineComponent({name: 'menu', tag: 'gramlot-menu', base: MenuContainer,
    subTags: 'menuline', implementation: Base => class extends Base {}});
export const MenuLine = defineComponent({name: 'menuline', tag: 'gramlot-menu-line', base: Command,
    command: true, subTags: '*', parameters: {code: {dtype: 'T', nullable: true}},
    implementation: Base => class extends Base {
        attachCommand() {
            const separator = this.textContent.trim() === '-';
            if (!separator && !this.parameters.code) throw new TypeError('menuline requires a stable code');
            this.setAttribute('role', separator ? 'separator' : 'menuitem');
            this.control.tabIndex = -1;
            this.disabled ||= separator;
        }
        get disabled() {
            return super.disabled || Boolean(this.closest('gramlot-drop-down-button')?.parameters.disabled);
        }
        set disabled(value) { super.disabled = value; }
        prepareCommand(event) {
            if (!super.prepareCommand(event)) return false;
            this.closest('gramlot-drop-down-button').selectCommand(this, event.shiftKey);
            return true;
        }
    }
});
export const DropDownButton = defineComponent({name: 'dropDownButton', tag: 'gramlot-drop-down-button', base: Command,
    command: true, subTags: '*', parameters: {persist: {dtype: 'B', default: false}},
    implementation: Base => class extends Base {
        #selected = null;
        #observer = null;
        #viewport = null;
        #storageKey = null;
        #popup;
        #arrow;
        #chosenCaption;
        constructor() {
            super();
            const doc = this.ownerDocument;
            this.control.classList.add('split');
            this.#chosenCaption = doc.createElement('span');
            this.#chosenCaption.hidden = true;
            this.control.append(this.#chosenCaption);
            this.#arrow = doc.createElement('button');
            this.#arrow.type = 'button'; this.#arrow.className = 'arrow'; this.#arrow.textContent = '▾';
            this.#arrow.setAttribute('aria-label', 'Open menu');
            this.#arrow.setAttribute('aria-haspopup', 'menu');
            this.#arrow.setAttribute('aria-expanded', 'false');
            this.controlBox.append(this.#arrow);
            this.#popup = doc.createElement('div');
            this.#popup.className = 'popup'; this.#popup.id = 'menu'; this.#popup.setAttribute('popover', 'auto');
            this.#arrow.setAttribute('aria-controls', 'menu');
            const slot = doc.createElement('slot'); slot.name = 'menu';
            this.#popup.append(slot); this.shadowRoot.append(this.#popup);
            this.#arrow.addEventListener('click', event => {
                event.stopPropagation();
                if (this.#popup.matches(':popover-open')) this.closeMenu(); else this.openMenu();
            });
            this.#arrow.addEventListener('keydown', event => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault(); this.openMenu(event.key === 'ArrowUp');
                }
            });
            this.addEventListener('keydown', event => {
                if (!this.#popup.matches(':popover-open')) return;
                const items = this.menuItems.filter(item => !item.disabled);
                const index = items.indexOf(event.composedPath().find(item => items.includes(item)));
                let next;
                if (event.key === 'ArrowDown') next = (index + 1) % items.length;
                if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
                if (event.key === 'Home') next = 0;
                if (event.key === 'End') next = items.length - 1;
                if (next !== undefined) { event.preventDefault(); items[next]?.focus(); }
                if (event.key === 'Escape' || event.key === 'Tab') {
                    if (event.key === 'Escape') event.preventDefault();
                    this.closeMenu();
                }
            });
            this.#popup.addEventListener('toggle', () => {
                const open = this.#popup.matches(':popover-open');
                this.#arrow.setAttribute('aria-expanded', String(open));
                if (!open) { this.#viewport?.abort(); this.#viewport = null; }
            });
        }
        get menuItems() { return [...this.querySelectorAll(':scope > gramlot-menu > gramlot-menu-line')]; }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            this.#arrow.disabled = this.disabled;
            if (this.disabled && this.#popup.matches(':popover-open')) this.closeMenu();
            this.#refreshCaption();
            return rest;
        }
        attachCommand() {
            if (this.parameters.persist) {
                if (!this.id) throw new TypeError('dropDownButton persist requires an explicit id');
                this.#storageKey = `gramlot:command:${this.ownerDocument.location.pathname}${this.ownerDocument.location.search}:${this.id}`;
                try { this.#selected = this.ownerDocument.defaultView.localStorage.getItem(this.#storageKey); } catch { /* Storage may be disabled. */ }
            }
            this.#refreshCaption();
            this.#observer = new this.ownerDocument.defaultView.MutationObserver(() => this.#refreshCaption());
            this.#observer.observe(this, {childList: true, subtree: true, characterData: true});
        }
        releaseCommand() {
            this.#observer?.disconnect(); this.#observer = null;
            this.#viewport?.abort(); this.#viewport = null;
            if (this.#popup.matches(':popover-open')) this.#popup.hidePopover();
        }
        commandTarget(event) {
            if (event?.composedPath().includes(this.#popup)) return null;
            return this.menuItems.find(item => item.parameters.code === this.#selected) ?? this;
        }
        selectCommand(item, remember) {
            if (remember) {
                this.#selected = item.parameters.code;
                if (this.#storageKey) {
                    try { this.ownerDocument.defaultView.localStorage.setItem(this.#storageKey, this.#selected); } catch { /* Keep the in-memory choice. */ }
                }
                this.#refreshCaption();
            }
            this.closeMenu();
        }
        #refreshCaption() {
            const codes = this.menuItems.filter(item => item.parameters.code).map(item => item.parameters.code);
            if (new Set(codes).size !== codes.length) throw new TypeError('Dropdown menu codes must be unique');
            const target = this.commandTarget();
            const selected = target !== this;
            this.caption.hidden = selected;
            this.#chosenCaption.hidden = !selected;
            this.#chosenCaption.textContent = selected ? target.textContent : '';
            this.icon.textContent = selected ? target.parameters.icon : this.parameters.icon;
        }
        openMenu(last = false) {
            if (this.disabled) return;
            const items = this.menuItems.filter(item => !item.disabled);
            if (!items.length) return;
            this.#popup.showPopover();
            this.#arrow.setAttribute('aria-expanded', 'true');
            const place = () => positionPopup(this.#popup, this.controlBox);
            place();
            this.#viewport?.abort();
            this.#viewport = new this.ownerDocument.defaultView.AbortController();
            const options = {signal: this.#viewport.signal, capture: true};
            this.ownerDocument.defaultView.addEventListener('resize', place, options);
            this.ownerDocument.addEventListener('scroll', place, options);
            items[last ? items.length - 1 : 0].focus();
        }
        closeMenu() {
            if (!this.#popup.matches(':popover-open')) return;
            this.#popup.hidePopover();
            this.#arrow.setAttribute('aria-expanded', 'false');
            this.#viewport?.abort(); this.#viewport = null;
            this.#arrow.focus();
        }
    }
});
export default defineCollection({name: 'buttons', components: [Button, ToggleButton, DropDownButton, Menu, MenuLine]});
