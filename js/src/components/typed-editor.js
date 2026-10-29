/** Typed text drafts. Components parse/present; ControlAdapter alone writes Data. */
import {parseDateExpression} from '@genrojs/toolbox';
import {CalendarView, checkCivilDate} from './date-calendar.js';
import {SVG_NS} from '../renderer/attributes.js';
import {NativeControl} from './bases.js';
import {positionPopup} from './popup.js';

const same = (a, b, isDecimal) => a instanceof Date && b instanceof Date ? a.getTime() === b.getTime()
    : isDecimal(a) && isDecimal(b) ? a.eq(b) : Object.is(a, b);
const finiteDecimal = v => !['NaN', 'Infinity', '-Infinity'].includes(v.toString());
const pad = v => String(v).padStart(2, '0');
function numberSymbols(locale) {
    const parts = new Intl.NumberFormat(locale).formatToParts(-12345.6);
    return {decimal: parts.find(p => p.type === 'decimal').value,
        group: parts.find(p => p.type === 'group')?.value,
        minus: parts.find(p => p.type === 'minusSign').value};
}

export function TypedEditor(HTMLElement) {
    return class extends NativeControl(HTMLElement) {
        #value = null;
        #dirty = false;
        #focused = false;
        #policy = null;
        #selection = null;
        #selecting = false;
        constructor() {
            super();
            this.control.addEventListener('focus', () => {
                this.#focused = true;
                if (!this.#dirty) {
                    const start = this.control.selectionStart, end = this.control.selectionEnd;
                    const all = start === 0 && end === this.control.value.length;
                    this.#policy = this.context(); this.display();
                    this.control.setSelectionRange(start, all ? this.control.value.length : end);
                }
            });
            this.control.addEventListener('input', () => {
                if (!this.#selecting) this.#selection = null;
                this.#dirty = true; this.#policy ??= this.context(); this.error('');
            });
            this.control.addEventListener('blur', () => {
                this.#focused = false;
                if (this.#dirty) this.control.dispatchEvent(new this.ownerDocument.defaultView.Event('change'));
                if (!this.#dirty) { this.#policy = null; this.display(); }
            });
            this.control.addEventListener('keydown', event => {
                if (event.isComposing || this.control.disabled || this.control.readOnly) return;
                if (event.key === 'Escape') {
                    event.preventDefault(); this.#selection = null; this.#dirty = false; this.#policy = null; if (this.pageContext.form) this.pageContext.formClearDraft(); this.error(''); this.display();
                    if (this.pageContext.form) this.validateCandidate(this.#value, () => {});
                } else if (event.key === 'Enter') {
                    event.preventDefault(); this.control.dispatchEvent(new this.ownerDocument.defaultView.Event('change'));
                }
            });
        }
        createControl() {
            const input = this.ownerDocument.createElement('input'); input.type = 'text'; return input;
        }
        context() {
            return {locale: this.parameters.locale ?? this.pageContext.locale,
                timeZone: this.pageContext.timeZone, pattern: this.parameters.format,
                dtype: this.parameters.dtype};
        }
        readControlValue() { return this.#value; }
        readDraftValue() {
            return !this.#dirty ? this.#value : this.control.value.trim() === '' ? null
                : this.parse(this.control.value, this.#policy ?? this.context());
        }
        sameControlValue(a, b) { return same(a, b, this.pageContext.isDecimal); }
        writeControlValue(value) {
            this.checkValue(value);
            if (this.sameControlValue(value, this.#value)) { if (!this.#dirty && !this.#focused) this.display(); return; }
            this.#value = value; this.#selection = null; this.#dirty = false; this.#policy = null; this.error(''); this.display();
        }
        selectControlValue(value) {
            this.checkValue(value);
            this.control.value = value === null ? '' : this.editText(value, this.context());
            this.#selection = {value}; this.#selecting = true;
            try {
                // Carry the selected typed value through the same live/commit adapter events.
                // Do not parse a localized short-year caption back into a different century.
                for (const type of ['input', 'change']) this.control.dispatchEvent(new this.ownerDocument.defaultView.Event(type, {bubbles:true}));
            } finally { this.#selecting = false; }
        }
        acceptControlValue() {
            if (!this.#dirty) return {ok: false};
            try {
                const value = this.#selection ? this.#selection.value : this.readDraftValue();
                this.checkValue(value);
                return this.validateCandidate(value, accepted => {
                    this.checkValue(accepted);
                    this.#value = accepted; this.#selection = null; this.#dirty = false;
                    // Preserve accepted spelling unless validation normalized the candidate.
                    if (!this.#focused || !this.sameControlValue(value, accepted)) { this.#policy = null; this.display(); }
                });
            } catch (error) { if (this.pageContext.form) this.pageContext.formParseError(error.message); this.error(error.message); return {ok: false}; }
        }
        restoreFormValue(value) { this.#dirty = false; this.#policy = null; this.#selection = null; this.error(''); this.writeControlValue(value); this.display(); }
        display() {
            if (!this.pageContext || !this.parameters) return;
            const text = this.#value == null ? '' : this.#focused
                ? this.editText(this.#value, this.#policy ?? this.context())
                : this.pageContext.format(this.#value, this.context());
            if (this.control.value !== text) this.control.value = text;
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            if (!this.#dirty && !this.#focused) this.display();
            return rest;
        }
    };
}
TypedEditor.parameters = {...NativeControl.parameters,
    placeholder: {dtype: 'T', qualification: 'intl_str', default: '', target: 'control'},
    locale: {dtype: 'T', nullable: true, binding: 'read'},
    format: {dtype: 'T', nullable: true, binding: 'read'}};

export const numberEditor = Base => class extends Base {
    createControl() { const control = super.createControl(); control.inputMode = 'decimal'; return control; }
    checkValue(value) {
        if (value === null) return;
        if (!(typeof value === 'number' && Number.isFinite(value)) && !(this.pageContext.isDecimal(value) && finiteDecimal(value))) {
            throw new TypeError('Expected a finite number or Decimal');
        }
    }
    context() { return {...super.context(), pattern: this.parameters.format ?? '0.####################'}; }
    editText(value, context) { return String(value).replace('.', numberSymbols(context.locale).decimal); }
    parse(text, context) {
        const {decimal, group, minus} = numberSymbols(context.locale);
        let draft = text.trim().replaceAll(minus, '-');
        if (group && draft.includes(group)) throw new Error('Enter the number without grouping separators.');
        draft = draft.replace(decimal, '.');
        if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(draft)) throw new Error('Enter a complete number.');
        const exact = context.dtype === 'N' || this.pageContext.isDecimal(this.readControlValue());
        if (exact && this.pageContext.getDecimalLibrary() === 'number') throw new Error('A Decimal backend is required.');
        const value = exact ? this.pageContext.createDecimal(draft) : Number(draft);
        this.checkValue(value);
        if (context.dtype === 'L' && !Number.isSafeInteger(value)) throw new Error('Enter a safe integer.');
        for (const [key, sign] of [['min', -1], ['max', 1]]) {
            const bound = this.parameters[key];
            if (bound != null && (exact ? value.cmp(bound) : Math.sign(value - bound)) === sign) throw new Error(`${key}: ${bound}`);
        }
        return value;
    }
};

export const dateEditor = Base => class extends Base {
    #opened = false;
    #cleanup;
    constructor() {
        super();
        const doc = this.ownerDocument;
        const style = doc.createElement('style');
        style.textContent = `.date-entry{position:relative;max-width:100%}
            .date-entry #control{display:block;min-width:0;width:100%}
            .date-entry:has(.calendar-toggle:not([hidden])) #control{padding-right:calc(var(--gramlot-touch-target,1.6em) + .4em)}
            .calendar-toggle{position:absolute;right:0;top:0;bottom:0;width:var(--gramlot-touch-target,1.6em);min-width:0;min-height:0;font:inherit;font-size:var(--gramlot-field-font-size,1em);line-height:inherit;padding:0;border:0;border-radius:var(--gramlot-radius-sm,4px);background:transparent;color:inherit;cursor:pointer}
            .calendar-toggle:disabled{cursor:default;opacity:.6}
            .calendar-toggle svg{display:block;width:1.1em;height:1.1em;margin:auto;pointer-events:none}
            .calendar-popup{position:fixed;inset:auto;margin:0;padding:.5em;max-width:var(--gramlot-popup-available-width,100vw);max-height:var(--gramlot-popup-available-height,100vh);overflow:auto;
                border:1px solid var(--gramlot-border-control,#aab4c4);border-radius:var(--gramlot-radius,5px);background:var(--gramlot-surface,Canvas);color:var(--gramlot-ink,CanvasText);box-shadow:var(--gramlot-shadow,0 3px 12px #0003);font:inherit}`;
        this.shadowRoot.append(style);
        // A tool button is a sibling of the input, not nested inside its label.
        const entry = doc.createElement('div'); entry.className = 'date-entry';
        this.control.parentElement.replaceWith(entry); entry.append(this.control);
        this.calendarButton = doc.createElement('button'); this.calendarButton.type = 'button';
        this.calendarButton.className = 'calendar-toggle';
        const icon = doc.createElementNS(SVG_NS, 'svg');
        for (const [name, value] of Object.entries({viewBox:'0 0 24 24', fill:'none', stroke:'currentColor',
            'stroke-width':'1.8', 'stroke-linecap':'round', 'stroke-linejoin':'round',
            'aria-hidden':'true', focusable:'false'})) icon.setAttribute(name, value);
        const outline = doc.createElementNS(SVG_NS, 'path');
        outline.setAttribute('d', 'M5 5h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z M7 2v6 M17 2v6 M3 11h18 M7 15h2 M15 15h2 M7 18h2 M15 18h2');
        icon.append(outline); this.calendarButton.append(icon);
        this.calendarButton.setAttribute('aria-label','Open calendar'); this.calendarButton.setAttribute('aria-haspopup','dialog');
        this.calendarButton.setAttribute('aria-expanded','false'); this.calendarButton.setAttribute('aria-controls','calendar-popup');
        entry.append(this.calendarButton);
        this.calendarPopup = doc.createElement('div'); this.calendarPopup.className = 'calendar-popup';
        this.calendarPopup.id = 'calendar-popup'; this.calendarPopup.setAttribute('popover','auto');
        this.calendarPopup.setAttribute('role','dialog'); this.calendarPopup.setAttribute('aria-label','Choose date');
        this.shadowRoot.append(this.calendarPopup);
        const view = doc.createElement('div'); this.calendarPopup.append(view);
        this.calendarView = new CalendarView(view, value => {
            if (this.control.disabled || this.control.readOnly || !this.pageContext.isActive()) return;
            this.closeCalendar(); this.control.focus();
            this.selectControlValue(value);
        });
        this.calendarButton.addEventListener('click', () => this.#opened ? this.closeCalendar() : this.openCalendar());
        this.control.addEventListener('keydown', event => {
            if (event.altKey && event.key === 'ArrowDown') {event.preventDefault(); this.openCalendar();}
        });
        this.calendarPopup.addEventListener('keydown', event => {
            if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); this.closeCalendar(); this.control.focus();}
        });
        this.calendarPopup.addEventListener('toggle', event => {
            if (event.newState === 'closed') {this.#opened = false; this.cleanupCalendar();}
        });
    }
    openCalendar() {
        if (!this.parameters.calendar || this.control.disabled || this.control.readOnly || !this.pageContext.isActive()) return;
        let value = this.readControlValue();
        try { value = this.readDraftValue(); } catch { /* Invalid draft: open on the committed date. */ }
        this.calendarView.configure({value, locale:this.context().locale, workdate:this.parameters.workdate});
        this.calendarPopup.showPopover(); this.#opened = true; this.calendarButton.setAttribute('aria-expanded','true');
        const win = this.ownerDocument.defaultView;
        const position = () => positionPopup(this.calendarPopup, this.control);
        this.#cleanup?.(); position();
        win.addEventListener('resize', position); win.addEventListener('scroll', position, true);
        this.#cleanup = () => {win.removeEventListener('resize', position); win.removeEventListener('scroll', position, true);};
        this.calendarView.focusDay();
    }
    cleanupCalendar() {
        this.#cleanup?.(); this.#cleanup = null; this.calendarButton.setAttribute('aria-expanded','false');
    }
    closeCalendar() {
        if (this.#opened) this.calendarPopup.hidePopover();
        this.#opened = false; this.cleanupCalendar();
    }
    projectAttributes(attrs, adapt) {
        const rest = super.projectAttributes(attrs, adapt);
        this.calendarButton.hidden = !this.parameters.calendar;
        this.calendarButton.disabled = this.control.disabled || this.control.readOnly;
        if (!this.parameters.calendar || this.calendarButton.disabled) this.closeCalendar();
        else if (this.#opened) this.calendarView.configure({value:this.readControlValue(),locale:this.context().locale,workdate:this.parameters.workdate});
        return rest;
    }
    writeControlValue(value) {
        super.writeControlValue(value);
        if (this.#opened) this.calendarView.configure({value,locale:this.context().locale,workdate:this.parameters.workdate});
    }
    releaseControl() { this.closeCalendar(); super.releaseControl(); }
    context() { return {...super.context(), dtype: 'D', pattern: this.parameters.format ?? 'short'}; }
    checkValue(value) { checkCivilDate(value); }
    editText(value, context) { return this.pageContext.format(value, {...context, pattern: 'short'}); }
    parse(text, context) {
        const now = new Date();
        const workdate = this.parameters.workdate ?? `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
        const options = {locale: context.locale, workdate};
        const result = parseDateExpression(text, options);
        if (!result.ok) throw new Error(result.error.message);
        if (result.kind !== 'date') throw new Error('Enter one complete date, not a period.');
        const [y, m, d] = result.date.split('-').map(Number);
        const value = new Date(0); value.setUTCFullYear(y, m - 1, d); return value;
    }
};

export const timeEditor = Base => class extends Base {
    context() { return {...super.context(), dtype: 'H', pattern: this.parameters.format ?? 'short'}; }
    checkValue(value) {
        if (value !== null && (!(value instanceof Date) || !Number.isFinite(value.getTime()) || value.getUTCFullYear() !== 1970 || value.getUTCMonth() !== 0 || value.getUTCDate() !== 1)) throw new TypeError('Expected a civil time on the TYTX epoch date');
    }
    editText(value) {
        return `${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}:${pad(value.getUTCSeconds())}` +
            (value.getUTCMilliseconds() ? `.${String(value.getUTCMilliseconds()).padStart(3, '0')}` : '');
    }
    parse(text) {
        const match = /^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(text.trim());
        if (!match || +match[1] > 23 || +match[2] > 59 || +(match[3] ?? 0) > 59) throw new Error('Enter HH:mm or HH:mm:ss, using the 24-hour clock.');
        return new Date(Date.UTC(1970, 0, 1, +match[1], +match[2], +(match[3] ?? 0), +(match[4] ?? '').padEnd(3, '0')));
    }
};
