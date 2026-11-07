import {ChartSyntaxError} from './chart-syntax.js';
import {chartTypes} from './chart-types/index.js';

// The icon is a styled glyph, not an svg: the svg inside a chart view is always the chart.
const ICONS = {error:'!', info:'i'};

/** Shadow-root styles of the notice; colours follow the `--gramlot-*` theme variables. */
export const CHART_NOTICE_STYLE = `
.chart-notice{display:flex;align-items:flex-start;gap:10px;padding:16px 20px;font:13px/1.45 var(--gramlot-font-ui,system-ui,sans-serif);color:var(--gramlot-ink,#243449)}
.chart-notice[hidden]{display:none}
.chart-notice-icon{flex:none;display:grid;place-items:center;inline-size:20px;block-size:20px;border-radius:50%;font:700 13px/1 var(--gramlot-font-ui,system-ui,sans-serif);color:var(--gramlot-surface,#fff)}
.chart-notice[data-kind=error] .chart-notice-icon{background:var(--gramlot-error,#b13d48)}
.chart-notice[data-kind=info] .chart-notice-icon{background:var(--gramlot-text-secondary,#566579)}
.chart-notice-text{flex:1;min-inline-size:0;white-space:normal;overflow-wrap:anywhere}
.chart-notice button{flex:none;font:inherit;padding:2px 10px;border:1px solid var(--gramlot-border-control,#a9b4c2);border-radius:var(--gramlot-radius-sm,4px);background:var(--gramlot-surface,#fff);color:inherit;cursor:pointer}
.chart-notice-dialog{max-inline-size:min(640px,calc(100vw - 32px));border:1px solid var(--gramlot-border,#d5dce5);border-radius:var(--gramlot-radius,6px);padding:20px 24px;background:var(--gramlot-surface,#fff);color:var(--gramlot-ink,#243449);font:13px/1.5 var(--gramlot-font-ui,system-ui,sans-serif)}
.chart-notice-dialog h2{margin:0 0 12px;font-size:16px}
.chart-notice-dialog h3{margin:14px 0 4px;font-size:13px}
.chart-notice-dialog p{margin:0 0 6px}
.chart-notice-dialog table{border-collapse:collapse;inline-size:100%}
.chart-notice-dialog th,.chart-notice-dialog td{border-block-end:1px solid var(--gramlot-border,#d5dce5);padding:4px 6px;text-align:start;vertical-align:top}
.chart-notice-dialog code{font-family:var(--gramlot-font-code,ui-monospace,monospace)}
.chart-notice-dialog form{margin-block-start:16px;text-align:end}`;

function roleParameter(role, roles) {
    if (role.parameter !== 'valueFields' || role.count === 'many') return role.parameter;
    const fixed = roles.filter(item => item.parameter === 'valueFields');
    return fixed.length === 1 ? 'valueFields' : `valueFields, position ${fixed.indexOf(role) + 1}`;
}

/** The sections that explain a chart type: what it shows and the columns it reads. */
export function chartTypeSections(type) {
    return [
        {title:`What ${type.label.toLowerCase()} shows`, paragraphs:[type.doc]},
        {title:'Columns it reads', table:[['Column','Parameter','Required','Description'],
            ...type.syntax.map(role => [role.caption, roleParameter(role, type.syntax), role.required ? 'yes' : 'no',
                role.count === 'many' ? `One or more. ${role.doc}` : role.doc])]}
    ];
}

/** The sections that explain a chart error; `type` is null when the chart type itself is unknown. */
export function chartErrorSections(error, type) {
    if (error instanceof ChartSyntaxError) {
        const {expected, received, fix} = error.diagnosis;
        return [
            {title:'What is wrong', paragraphs:[error.message]},
            {title:'Expected', paragraphs:[expected]},
            {title:'Received', paragraphs:[received]},
            {title:'How to fix it', paragraphs:[fix]},
            ...chartTypeSections(type)
        ];
    }
    if (!type) return [
        {title:'What is wrong', paragraphs:[error.message]},
        {title:'Supported chart types', paragraphs:[chartTypes.map(item => `${item.id} (${item.label})`).join(', ')]}
    ];
    return [{title:'What is wrong', paragraphs:[error.message]}, ...chartTypeSections(type)];
}

/**
 * The notice shown in place of a chart that is not drawn: an icon, one line and "More info",
 * which opens a dialog with the explanation. `error` uses role alert, `info` role status.
 */
export class ChartNotice {
    #box; #icon; #text; #dialog; #sections = [];
    constructor(doc) {
        this.#box = doc.createElement('div');
        this.#box.className = 'chart-notice'; this.#box.hidden = true;
        this.#icon = doc.createElement('span');
        this.#icon.className = 'chart-notice-icon'; this.#icon.setAttribute('aria-hidden', 'true');
        this.#text = doc.createElement('div'); this.#text.className = 'chart-notice-text'; this.#text.hidden = true;
        this.#text.setAttribute('role', 'alert');
        const more = doc.createElement('button');
        more.type = 'button'; more.textContent = 'More info';
        more.addEventListener('click', () => this.open());
        this.#dialog = doc.createElement('dialog');
        this.#dialog.className = 'chart-notice-dialog';
        this.#box.append(this.#icon, this.#text, more, this.#dialog);
    }
    get element() { return this.#box; }
    get hidden() { return this.#box.hidden; }
    get dialog() { return this.#dialog; }
    get text() { return this.#text; }

    error(message, title, sections) { this.#show('error', 'alert', message, title, sections); }
    info(message, title, sections) { this.#show('info', 'status', message, title, sections); }
    hide() {
        this.#box.hidden = this.#text.hidden = true; this.#text.textContent = '';
        if (this.#dialog.open) this.#dialog.close();
    }

    /** Fill and open the dialog with the explanation of the current notice. */
    open() {
        const doc = this.#dialog.ownerDocument;
        const heading = doc.createElement('h2'); heading.textContent = this.#sections.title;
        const parts = [heading];
        for (const section of this.#sections.items) {
            const title = doc.createElement('h3'); title.textContent = section.title; parts.push(title);
            for (const text of section.paragraphs ?? []) { const p = doc.createElement('p'); p.textContent = text; parts.push(p); }
            if (section.table) {
                const table = doc.createElement('table');
                section.table.forEach((cells, index) => {
                    const row = table.insertRow();
                    for (const value of cells) {
                        const cell = doc.createElement(index ? 'td' : 'th'); cell.textContent = value; row.append(cell);
                    }
                });
                parts.push(table);
            }
        }
        const form = doc.createElement('form'); form.method = 'dialog';
        const close = doc.createElement('button'); close.textContent = 'Close'; form.append(close);
        parts.push(form);
        this.#dialog.replaceChildren(...parts);
        this.#dialog.showModal();
    }

    #show(kind, role, message, title, sections) {
        this.#box.dataset.kind = kind;
        this.#text.setAttribute('role', role);
        this.#icon.textContent = ICONS[kind];
        this.#text.textContent = message;
        this.#sections = {title, items:sections};
        this.#box.hidden = this.#text.hidden = false;
    }
}
