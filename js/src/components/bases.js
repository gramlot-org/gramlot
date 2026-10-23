import {projectParameters} from './parameters.js';
import {parseChoices} from './choices.js';

/** Internal control DOM; Source/Data binding remains in ControlAdapter. */
export function controlElement(HTMLElement) {
    return class extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({mode: 'open'});
            const style = this.ownerDocument.createElement('style');
            style.textContent = `:host{display:inline-block;font:inherit} *,*::before,*::after{box-sizing:border-box}
                input,textarea{font:inherit;max-width:100%} .control-box{min-width:0;color:var(--gramlot-ink,CanvasText)}
                input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]),textarea{
                    appearance:none;box-sizing:border-box;width:100%;border:1px solid var(--gramlot-border-control,#7a8798);
                    border-radius:var(--gramlot-radius-sm,4px);background:var(--gramlot-field-background,Canvas);color:var(--gramlot-ink,CanvasText);
                    min-height:var(--gramlot-field-height,28px);padding:var(--gramlot-field-padding,.25em .5em);font-size:var(--gramlot-field-font-size,1em);line-height:var(--gramlot-field-line-height,inherit)}
                input:read-only:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]),textarea:read-only{
                    background:var(--gramlot-field-readonly-background,Canvas)}
                input:disabled,textarea:disabled{opacity:.6;cursor:not-allowed}
                input::placeholder,textarea::placeholder{color:var(--gramlot-text-secondary,GrayText)}
                input:focus-visible,textarea:focus-visible,button:focus-visible{outline:2px solid var(--gramlot-focus-ring,Highlight);outline-offset:1px}
                input[type=checkbox],input[type=radio],input[type=range]{accent-color:var(--gramlot-brand-blue,Highlight)}
                input[type=range],input[type=color],button{min-width:var(--gramlot-touch-target,0px);min-height:var(--gramlot-touch-target,0px)}
                input[type=checkbox],input[type=radio]{min-width:calc(var(--gramlot-touch-target,0px) / 2);min-height:calc(var(--gramlot-touch-target,0px) / 2)}
                .options{display:grid;gap:.3em .8em} .option{display:flex;align-items:center;gap:.35em;min-width:var(--gramlot-touch-target,0px);min-height:var(--gramlot-touch-target,0px)}
                .caption:empty{display:none}`;
            this.controlBox = this.ownerDocument.createElement('div');
            this.controlBox.className = 'control-box';
            shadow.append(style, this.controlBox);
        }
        projectAttributes(attrs) {
            return projectParameters(this, attrs);
        }
        setPageContext(context) { this.pageContext = context; }
        releaseControl() {}
        get liveWrites() { return this.control.localName === 'textarea' || ['text', 'password', 'range', 'color'].includes(this.control.type); }
        validateCandidate(value, accept) {
            accept(value);
            return {ok:true, value, isCurrent:() => this.pageContext.isActive()};
        }
        finishValidation() {}
        validateSelection() { throw new TypeError('validate_select requires a constrained choice editor.'); }
        shouldProjectControlValue() { return true; }
        acceptControlValue() {
            const value = this.readControlValue();
            return this.validateCandidate(value, accepted => {
                if (accepted == null && !this.constructor.gramlotComponent.parameters.value.nullable) throw new TypeError('This component requires a non-null value.');
                if (accepted != null && value != null && typeof accepted !== typeof value) throw new TypeError('Validation must preserve the component value type.');
                if (!this.sameControlValue(value, accepted)) this.writeControlValue(accepted);
            });
        }
        sameControlValue(a, b) { return Object.is(a, b); }
        focus(options) { this.control.focus(options); }
    };
}

export function NativeControl(HTMLElement) {
    return class extends controlElement(HTMLElement) {
        constructor() {
            super();
            this.control = this.createControl();
            if (this.control.localName === 'textarea' || this.control.localName === 'input' && ['text', 'password'].includes(this.control.type)) {
                this.control.setAttribute('autocomplete', 'off');
                this.control.setAttribute('autocorrect', 'off');
                this.control.setAttribute('autocapitalize', 'off');
                this.control.setAttribute('spellcheck', 'false');
            }
            this.control.id = 'control';
            const option = this.ownerDocument.createElement('label');
            option.className = 'option';
            this.optionCaption = this.ownerDocument.createElement('span');
            this.optionCaption.className = 'caption';
            option.append(this.control, this.optionCaption);
            this.controlBox.append(option);
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const {disabled, readonly} = this.parameters;
            this.control.disabled = Boolean(disabled);
            this.control.readOnly = Boolean(readonly);
            for (const [name, spec] of Object.entries(this.constructor.gramlotComponent.parameters)) {
                if (spec.target === 'control') {
                    const value = this.parameters[name] ?? '';
                    if (String(this.control[name]) !== String(value)) this.control[name] = value;
                }
                if (spec.target === 'optionCaption') this.optionCaption.textContent = this.parameters[name] ?? '';
            }
            return rest;
        }
    };
}
NativeControl.parameters = {
    disabled: {dtype: 'B', default: false, binding: 'read'},
    readonly: {dtype: 'B', default: false, binding: 'read'},
    live: {dtype: 'B', default: false, binding: 'read'}
};

export function ChoiceGroup(HTMLElement) {
    return class extends controlElement(HTMLElement) {
        #options = new Map();
        #values;
        #value = null;
        constructor() {
            super();
            this.control = this.ownerDocument.createElement('div');
            this.control.className = 'options';
            this.control.id = 'control';
            this.control.setAttribute('role', this.multiple ? 'group' : 'radiogroup');
            this.controlBox.append(this.control);
            this.control.addEventListener('keydown', event => {
                if (!this.multiple || !['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                const items = [...this.control.querySelectorAll('input:not(:disabled)')];
                const index = items.indexOf(event.target);
                if (index < 0) return;
                event.preventDefault();
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
                    : Math.max(0, Math.min(items.length - 1, index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1)));
                items[next].focus();
            });
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const values = this.parameters.values ?? '';
            if (values !== this.#values) {
                const options = parseChoices(values);
                const retained = new Set();
                let previous = null;
                for (const {id: code, caption} of options) {
                    let item = this.#options.get(code);
                    if (!item) {
                        const label = this.ownerDocument.createElement('label');
                        label.className = 'option';
                        const input = this.ownerDocument.createElement('input');
                        input.type = this.choiceType; input.name = 'choice'; input.value = code;
                        const text = this.ownerDocument.createElement('span');
                        label.append(input, text); item = {label, input, text};
                        this.#options.set(code, item);
                    }
                    item.text.textContent = caption;
                    const expected = previous ? previous.nextSibling : this.control.firstChild;
                    if (expected !== item.label) this.control.insertBefore(item.label, expected);
                    previous = item.label; retained.add(code);
                }
                for (const [code, item] of this.#options) if (!retained.has(code)) {
                    item.label.remove(); this.#options.delete(code);
                }
                this.#values = values;
            }
            const cols = this.parameters.cols;
            if (!Number.isInteger(cols) || cols < 1) throw new TypeError('cols must be a positive integer');
            this.control.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
            this.control.disabled = Boolean(this.parameters.disabled);
            this.control.readOnly = Boolean(this.parameters.readonly);
            for (const {input} of this.#options.values()) input.disabled = this.control.disabled || this.control.readOnly;
            return rest;
        }
        readControlValue() {
            if (this.multiple) {
                const codes = this.#value ? this.#value.split(',') : [];
                const selected = codes.filter(code => !this.#options.has(code) || this.#options.get(code).input.checked);
                for (const [code, {input}] of this.#options) if (input.checked && !selected.includes(code)) selected.push(code);
                return selected.join(',') || null;
            }
            for (const [code, {input}] of this.#options) if (input.checked) return code;
            return null;
        }
        writeControlValue(value) {
            this.#value = value;
            const selected = this.multiple ? new Set(value ? value.split(',') : []) : null;
            for (const [code, {input}] of this.#options) input.checked = this.multiple ? selected.has(code) : code === value;
        }
        acceptControlValue() {
            const value = this.readControlValue();
            return this.validateCandidate(value, accepted => this.writeControlValue(accepted));
        }
        focus(options) {
            const items = [...this.#options.values()];
            (items.find(({input}) => input.checked && !input.disabled) ?? items.find(({input}) => !input.disabled))?.input.focus(options);
        }
    };
}
ChoiceGroup.parameters = {disabled: {dtype: 'B', default: false, binding: 'read'},
    readonly: {dtype: 'B', default: false, binding: 'read'}};
