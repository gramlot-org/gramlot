/** Civil-date calendar shared by the inline control and the text editor popup. */
import {controlElement} from './bases.js';

export function civilDate(year, month, day) {
    const value = new Date(0); value.setUTCFullYear(year, month, day); return value;
}
export function checkCivilDate(value) {
    if (value !== null && (!(value instanceof Date) || !Number.isFinite(value.getTime()) ||
        value.getUTCHours() || value.getUTCMinutes() || value.getUTCSeconds() || value.getUTCMilliseconds())) {
        throw new TypeError('Expected a civil Date at UTC midnight');
    }
}
const equal = (a, b) => a === b || a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
const iso = value => value.toISOString().slice(0, 10);

export class CalendarView {
    constructor(container, select) {
        this.container = container; this.select = select; this.value = null;
        const doc = container.ownerDocument;
        const style = doc.createElement('style');
        style.textContent = `.calendar{width:var(--gramlot-calendar-width,18em);max-width:100%;font:inherit;color:inherit}
            .calendar button{min-height:var(--gramlot-touch-target,0px);font:inherit;color:inherit;border:1px solid transparent;border-radius:3px;background:transparent;cursor:pointer;padding:.25em}
            .calendar button:focus-visible{outline:2px solid var(--gramlot-focus-ring,#4369c5);outline-offset:-2px}
            .calendar button:disabled{opacity:.5;cursor:default}
            .calendar-header,.calendar-footer{display:flex;align-items:center;justify-content:space-between;gap:.4em}
            .calendar-month{font-weight:600;text-align:center}
            .calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;margin:.4em 0}
            .calendar-weekday{text-align:center;font-size:.85em;color:var(--gramlot-text-secondary,#64748b)}
            .calendar button[aria-pressed=true]{background:var(--gramlot-brand-blue,#4369c5);color:white}
            .calendar button[data-today=true]{border-color:var(--gramlot-brand-blue,#4369c5)}
            .calendar button:hover:not(:disabled){background:var(--gramlot-selected,#e5ebf7);color:var(--gramlot-ink,#203047)}`;
        container.classList.add('calendar');
        this.header = doc.createElement('div'); this.header.className = 'calendar-header';
        this.month = doc.createElement('span'); this.month.className = 'calendar-month'; this.month.setAttribute('aria-live', 'polite');
        this.previous = this.button('‹', 'Previous month', () => this.moveMonth(-1));
        this.next = this.button('›', 'Next month', () => this.moveMonth(1));
        this.header.append(this.previous, this.month, this.next);
        this.grid = doc.createElement('div'); this.grid.className = 'calendar-grid';
        this.footer = doc.createElement('div'); this.footer.className = 'calendar-footer';
        this.todayButton = this.button('Today', 'Today', () => this.choose(this.today));
        this.clearButton = this.button('Clear', 'Clear date', () => this.choose(null));
        this.footer.append(this.todayButton, this.clearButton);
        container.append(style, this.header, this.grid, this.footer);
        this.grid.addEventListener('keydown', event => {
            if (this.locked || !event.target.dataset.date) return;
            const offsets = {ArrowLeft:-1, ArrowRight:1, ArrowUp:-7, ArrowDown:7};
            if (event.key in offsets) {
                event.preventDefault(); this.active = civilDate(this.active.getUTCFullYear(), this.active.getUTCMonth(), this.active.getUTCDate() + offsets[event.key]);
            } else if (event.key === 'Home' || event.key === 'End') {
                event.preventDefault(); const weekday = (this.active.getUTCDay() + 6) % 7;
                this.active = civilDate(this.active.getUTCFullYear(), this.active.getUTCMonth(), this.active.getUTCDate() + (event.key === 'Home' ? -weekday : 6 - weekday));
            } else if (event.key === 'PageUp' || event.key === 'PageDown') {
                event.preventDefault(); this.moveMonth(event.key === 'PageUp' ? -1 : 1, true); return;
            } else return;
            this.render(); this.focusDay();
        });
    }
    button(text, label, action) {
        const button = this.container.ownerDocument.createElement('button'); button.type = 'button';
        button.textContent = text; button.setAttribute('aria-label', label);
        button.addEventListener('click', action); return button;
    }
    configure({value, locale, workdate, locked = false}) {
        checkCivilDate(value);
        const now = new Date();
        this.today = workdate ? civilDate(...workdate.split('-').map((part, i) => Number(part) - (i === 1 ? 1 : 0)))
            : civilDate(now.getFullYear(), now.getMonth(), now.getDate());
        if (!this.active || !equal(this.value, value)) this.active = value ?? this.today;
        this.value = value; this.locale = locale; this.locked = locked;
        const focused = this.grid.contains(this.container.getRootNode().activeElement);
        this.render(); if (focused && !locked) this.focusDay();
    }
    choose(value) {
        if (this.locked) return;
        this.value = value; this.active = value ?? this.today; this.render(); this.focusDay(); this.select(value);
    }
    moveMonth(delta, focus = false) {
        if (this.locked) return;
        const y = this.active.getUTCFullYear(), m = this.active.getUTCMonth() + delta;
        this.active = civilDate(y, m, Math.min(this.active.getUTCDate(), civilDate(y, m + 1, 0).getUTCDate()));
        this.render(); if (focus) this.focusDay();
    }
    render() {
        const y = this.active.getUTCFullYear(), m = this.active.getUTCMonth();
        this.month.textContent = new Intl.DateTimeFormat(this.locale, {month:'long',year:'numeric',timeZone:'UTC'}).format(this.active);
        this.grid.replaceChildren();
        const weekday = new Intl.DateTimeFormat(this.locale, {weekday:'short',timeZone:'UTC'});
        for (let i = 0; i < 7; i++) {
            const caption = this.container.ownerDocument.createElement('span'); caption.className = 'calendar-weekday';
            caption.textContent = weekday.format(civilDate(2024, 0, 1 + i)); this.grid.append(caption);
        }
        const offset = (civilDate(y,m,1).getUTCDay() + 6) % 7;
        for (let i = 0; i < offset; i++) this.grid.append(this.container.ownerDocument.createElement('span'));
        const full = new Intl.DateTimeFormat(this.locale, {dateStyle:'full',timeZone:'UTC'});
        for (let day = 1; day <= civilDate(y,m+1,0).getUTCDate(); day++) {
            const value = civilDate(y,m,day), button = this.button(String(day), full.format(value), () => this.choose(value));
            button.dataset.date = iso(value); button.dataset.today = String(equal(value,this.today));
            button.setAttribute('aria-pressed', String(equal(value,this.value))); button.disabled = this.locked;
            button.tabIndex = day === this.active.getUTCDate() ? 0 : -1; this.grid.append(button);
        }
        for (const button of [this.previous,this.next,this.todayButton,this.clearButton]) button.disabled = this.locked;
    }
    focusDay() { this.grid.querySelector('button[tabindex="0"]')?.focus(); }
}

export function CalendarControl(HTMLElement) {
    return class extends controlElement(HTMLElement) {
        #value = null;
        constructor() {
            super(); this.control = this.ownerDocument.createElement('div'); this.control.id = 'control';
            this.control.setAttribute('role','group'); this.controlBox.append(this.control);
            this.calendarView = new CalendarView(this.control, value => {
                this.#value = value;
                this.control.dispatchEvent(new this.ownerDocument.defaultView.Event('change', {bubbles:true}));
            });
        }
        get commitOnChange() { return true; }
        readControlValue() { return this.#value; }
        sameControlValue(a,b) { return equal(a,b); }
        writeControlValue(value) { checkCivilDate(value); this.#value = value; this.syncCalendar(); }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            this.control.disabled = Boolean(this.parameters.disabled); this.control.readOnly = Boolean(this.parameters.readonly);
            this.syncCalendar(); return rest;
        }
        syncCalendar() {
            if (!this.pageContext || !this.parameters) return;
            this.calendarView.configure({value:this.#value, locale:this.parameters.locale ?? this.pageContext.locale,
                workdate:this.parameters.workdate, locked:this.control.disabled || this.control.readOnly});
        }
        focus() { this.calendarView.focusDay(); }
        releaseControl() { this.calendarView.locked = true; }
    };
}
CalendarControl.parameters = {
    value:{dtype:'D',nullable:true,binding:'twoWay'},
    disabled:{dtype:'B',default:false,binding:'read'}, readonly:{dtype:'B',default:false,binding:'read'},
    locale:{dtype:'T',nullable:true,binding:'read'}, workdate:{dtype:'T',nullable:true,binding:'read'}
};
