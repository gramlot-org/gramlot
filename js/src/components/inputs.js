import {defineComponent, defineCollection} from './registry.js';
import {NativeControl, ChoiceGroup} from './bases.js';
import {Labelbox} from './labelbox.js';
import {TypedEditor, numberEditor, dateEditor, timeEditor} from './typed-editor.js';
import {CalendarControl} from './date-calendar.js';
import {FieldState} from './field-state.js';
import {ChoiceEditor, localChoices, callbackChoices} from './choice-editor.js';

export const Textbox = defineComponent({
    name: 'textbox', tag: 'gramlot-textbox', base: NativeControl, mixins: [Labelbox, FieldState],
    parameters: {
        value: {dtype: 'T', nullable: true, binding: 'twoWay'},
        placeholder: {dtype: 'T', qualification: 'intl_str', default: '', target: 'control'}
    },
    implementation: textEditor('input', 'text')
});
export const Checkbox = defineComponent({
    name: 'checkbox', tag: 'gramlot-checkbox', base: NativeControl, mixins: [Labelbox, FieldState],
    parameters: {
        value: {dtype: 'B', binding: 'twoWay'},
        mode: {dtype: 'T', default: 'checkbox', binding: 'read', enum: ['checkbox', 'switch']},
        switch_color: {dtype: 'T', nullable: true, default: null, binding: 'read'},
        label: {dtype: 'T', qualification: 'intl_str', default: '', target: 'optionCaption'}
    },
    implementation: Base => class extends Base {
        createControl() { const input = this.ownerDocument.createElement('input'); input.type = 'checkbox'; return input; }
        constructor() {
            super();
            const style = this.ownerDocument.createElement('style');
            style.textContent = `input[role=switch]{appearance:none;position:relative;flex:none;cursor:pointer;
                width:var(--gramlot-switch-width,2.5em);height:var(--gramlot-switch-height,1.4em);min-width:0;min-height:0;
                margin:0;border:1px solid var(--gramlot-border-control,#888);border-radius:2em;
                background:var(--gramlot-switch-off,var(--gramlot-field-readonly-background,#bbb));transition:background 120ms}
                input[role=switch]::before{content:'';position:absolute;top:var(--gramlot-switch-inset,2px);bottom:var(--gramlot-switch-inset,2px);left:var(--gramlot-switch-inset,2px);width:calc(var(--gramlot-switch-height,1.4em) - 2 * var(--gramlot-switch-inset,2px) - 2px);
                    border-radius:50%;background:var(--gramlot-switch-thumb,#fff);box-shadow:0 1px 2px #0004;transition:left 120ms}
                input[role=switch]:checked{background:var(--gramlot-switch-on,var(--gramlot-brand-blue,Highlight))}
                input[role=switch]:checked::before{left:calc(100% - var(--gramlot-switch-height,1.4em) + var(--gramlot-switch-inset,2px) + 2px)}
                input[role=switch]:disabled{cursor:not-allowed}
                @media(prefers-reduced-motion:reduce){input[role=switch],input[role=switch]::before{transition:none}}`;
            this.shadowRoot.append(style);
            this.control.addEventListener('click', event => { if (this.control.readOnly) event.preventDefault(); });
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const mode = this.parameters.mode;
            if (!this.constructor.gramlotComponent.parameters.mode.enum.includes(mode)) throw new TypeError('checkbox mode must be checkbox or switch');
            if (mode === 'switch') this.control.setAttribute('role', 'switch');
            else this.control.removeAttribute('role');
            if (mode === 'switch' && this.parameters.switch_color != null) {
                this.control.style.setProperty('--gramlot-switch-on', this.parameters.switch_color);
            } else this.control.style.removeProperty('--gramlot-switch-on');
            return rest;
        }
        readControlValue() { return this.control.checked; }
        writeControlValue(value) { this.control.checked = value; }
    }
});
export const RadioButtonText = defineComponent({
    name: 'radioButtonText', tag: 'gramlot-radio-button-text', base: ChoiceGroup, mixins: [Labelbox, FieldState],
    parameters: {
        value: {dtype: 'T', nullable: true, binding: 'twoWay'},
        values: {dtype: 'T', binding: 'read'},
        cols: {dtype: 'L', default: 1, binding: 'read'}
    },
    implementation: Base => class extends Base {
        get choiceType() { return 'radio'; }
        get multiple() { return false; }
    }
});
// Text variants keep the same editing contract, including IME and live/commit.
function textEditor(tag, type) {
    return Base => class extends Base {
        createControl() {
            const control = this.ownerDocument.createElement(tag);
            if (tag === 'input') control.type = type;
            return control;
        }
        readControlValue() { return this.control.value; }
        writeControlValue(value) { if (this.control.value !== (value ?? '')) this.control.value = value ?? ''; }
    };
}
export const TextBoxArea = defineComponent({
    name: 'textBoxArea', tag: 'gramlot-text-box-area', base: NativeControl, mixins: [Labelbox, FieldState],
    parameters: {
        value: {dtype: 'T', nullable: true, binding: 'twoWay'},
        placeholder: {dtype: 'T', qualification: 'intl_str', default: '', target: 'control'},
        rows: {dtype: 'L', default: 4, binding: 'read', target: 'control'},
        cols: {dtype: 'L', default: 24, binding: 'read', target: 'control'}
    },
    implementation: textEditor('textarea')
});
export const Passwordbox = defineComponent({
    name: 'passwordbox', tag: 'gramlot-passwordbox', base: NativeControl, mixins: [Labelbox, FieldState],
    parameters: {
        value: {dtype: 'T', nullable: true, binding: 'twoWay'},
        placeholder: {dtype: 'T', qualification: 'intl_str', default: '', target: 'control'}
    },
    implementation: textEditor('input', 'password')
});
export const RadioButton = defineComponent({
    name: 'radioButton', tag: 'gramlot-radio-button', base: NativeControl, mixins: [Labelbox, FieldState],
    parameters: {
        value: {dtype: 'B', default: false, binding: 'twoWay'},
        label: {dtype: 'T', qualification: 'intl_str', default: '', target: 'optionCaption'},
        group: {dtype: 'T', nullable: true, binding: 'read'}
    },
    implementation: Base => class extends Base {
        createControl() { const input = this.ownerDocument.createElement('input'); input.type = 'radio'; return input; }
        readControlValue() { return this.control.checked; }
        writeControlValue(value) { this.control.checked = value; }
    }
});
export const Colorpicker = defineComponent({
    name: 'colorpicker', tag: 'gramlot-colorpicker', base: NativeControl, mixins: [Labelbox, FieldState],
    parameters: {value: {dtype: 'T', default: '#000000', binding: 'twoWay'}},
    implementation: textEditor('input', 'color')
});
const rangeParameters = {
    value: {dtype: 'R', default: 0, binding: 'twoWay'},
    min: {dtype: 'R', default: 0, binding: 'read', target: 'control'},
    max: {dtype: 'R', default: 100, binding: 'read', target: 'control'},
    step: {dtype: 'R', default: 1, binding: 'read', target: 'control'}
};
function rangeEditor(vertical) {
    return Base => class extends Base {
        #sourceContext;
        #correcting = false;
        setSourceContext(context) { this.#sourceContext = context; }
        projectAttributes(attrs, adapt) {
            const previous = this.parameters;
            const rest = super.projectAttributes(attrs, adapt);
            if (previous && ['min', 'max', 'step'].some(name => previous[name] !== this.parameters[name])) {
                this.writeControlValue(this.parameters.value);
            }
            return rest;
        }
        createControl() {
            const control = this.ownerDocument.createElement('input');
            control.type = 'range';
            if (vertical) {
                control.style.cssText = 'writing-mode:vertical-lr;direction:rtl;width:var(--gramlot-slider-width,1.5rem);height:var(--gramlot-slider-height,10rem)';
                control.setAttribute('aria-orientation', 'vertical');
            } else control.style.width = '100%';
            return control;
        }
        readControlValue() { return this.control.valueAsNumber; }
        writeControlValue(value) {
            this.control.value = String(value);
            const corrected = this.control.valueAsNumber;
            if (!this.#correcting && Number.isFinite(value) && Number.isFinite(corrected) && corrected !== value) {
                this.#correcting = true;
                try { this.#sourceContext.writeParameter('value', corrected); }
                finally { this.#correcting = false; }
            }
        }
    };
}
export const HorizontalSlider = defineComponent({
    name: 'horizontalSlider', tag: 'gramlot-horizontal-slider', base: NativeControl,
    mixins: [Labelbox, FieldState], parameters: rangeParameters, sourceContext: true, implementation: rangeEditor(false)
});
export const VerticalSlider = defineComponent({
    name: 'verticalSlider', tag: 'gramlot-vertical-slider', base: NativeControl,
    mixins: [Labelbox, FieldState], parameters: rangeParameters, sourceContext: true, implementation: rangeEditor(true)
});
export const NumberTextBox = defineComponent({
    name: 'numberTextBox', tag: 'gramlot-number-text-box', base: TypedEditor, mixins: [Labelbox, FieldState],
    parameters: {value: {dtype: ['L', 'R', 'N'], nullable: true, binding: 'twoWay'},
        dtype: {dtype: 'T', default: 'R'}, min: {dtype: 'R', nullable: true, binding: 'read'},
        max: {dtype: 'R', nullable: true, binding: 'read'}}, implementation: numberEditor
});
export const DateTextBox = defineComponent({
    name: 'dateTextBox', tag: 'gramlot-date-text-box', base: TypedEditor, mixins: [Labelbox, FieldState],
    parameters: {value: {dtype: 'D', nullable: true, binding: 'twoWay'},
        workdate: {dtype: 'T', nullable: true, binding: 'read'},
        calendar: {dtype: 'B', default: true, binding: 'read'}}, implementation: dateEditor
});
export const DateCalendar = defineComponent({
    name:'dateCalendar', tag:'gramlot-date-calendar', base:CalendarControl, mixins:[Labelbox, FieldState],
    parameters:{}, implementation:Base => class extends Base {}
});
export const TimeTextBox = defineComponent({
    name: 'timeTextBox', tag: 'gramlot-time-text-box', base: TypedEditor, mixins: [Labelbox, FieldState],
    parameters: {value: {dtype: 'H', nullable: true, binding: 'twoWay'}}, implementation: timeEditor
});
export const FilteringSelect = defineComponent({
    name: 'filteringSelect', tag: 'gramlot-filtering-select', base: ChoiceEditor, mixins: [Labelbox, FieldState],
    parameters: {values: {dtype: 'T', default: '', binding: 'read'}, separator: {dtype: 'T', default: ',', binding: 'read'}}, implementation: localChoices
});
export const CallbackSelect = defineComponent({
    name: 'callbackSelect', tag: 'gramlot-callback-select', base: ChoiceEditor, mixins: [Labelbox, FieldState],
    parameters: {callback: {dtype: 'T'}}, implementation: callbackChoices
});
export const ComboBox = defineComponent({
    name: 'comboBox', tag: 'gramlot-combo-box', base: ChoiceEditor, mixins: [Labelbox, FieldState],
    parameters: {values: {dtype: 'T', default: '', binding: 'read'}, separator: {dtype: 'T', default: ',', binding: 'read'}, store: {dtype: 'X', nullable: true, default: null, binding: 'read'}},
    implementation: Base => class extends localChoices(Base) {
        get constrained() { return false; }
    }
});
export const CheckBoxText = defineComponent({
    name: 'checkBoxText', tag: 'gramlot-check-box-text', base: ChoiceGroup, mixins: [Labelbox, FieldState],
    parameters: {
        value: {dtype: 'T', nullable: true, binding: 'twoWay'},
        values: {dtype: 'T', binding: 'read'},
        cols: {dtype: 'L', default: 1, binding: 'read'}
    },
    implementation: Base => class extends Base {
        get choiceType() { return 'checkbox'; }
        get multiple() { return true; }
    }
});
export default defineCollection({name: 'inputs', components: [Textbox, Checkbox, RadioButtonText,
    TextBoxArea, Passwordbox, RadioButton, Colorpicker, HorizontalSlider, VerticalSlider,
    NumberTextBox, DateTextBox, TimeTextBox, FilteringSelect, CallbackSelect, ComboBox, CheckBoxText, DateCalendar]});
