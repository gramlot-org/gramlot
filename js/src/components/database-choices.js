import createDOMPurify from 'dompurify';

/** Database suggestions share the choice editor and the ordinary data RPC. */
export const databaseParameters = {
    dbtable: {dtype:'T', binding:'read'},
    method: {dtype:'T', default:'dbSelect', binding:'read'},
    columns: {dtype:'T', binding:'read'},
    hiddenColumns: {dtype:'T', binding:'read'},
    auxColumns: {dtype:'T', binding:'read'},
    template: {dtype:'T', binding:'read'},
    order_by: {dtype:'T', binding:'read'},
    limit: {dtype:'L', default:10, binding:'read'},
    searchDelay: {dtype:'L', default:300, binding:'read'},
    ignoreCase: {dtype:'B', default:true, binding:'read'},
    hasDownArrow: {dtype:'B', default:true, binding:'read'},
    emptyLabel: {dtype:'T', qualification:'intl_str', default:'Clear selection', binding:'read'},
    selectedCaption: {dtype:'T'},
    selectedRecord: {dtype:'T'},
    selectedCb: {dtype:'T'}
};
const requestParameters = ['dbtable','method','columns','hiddenColumns','auxColumns','order_by','limit','ignoreCase'];

export function databaseChoices(Base) {
    return class extends Base {
        #configuration = {};
        #outputs = {};
        #revision = 0;
        #acceptedRow;
        #template;
        #sanitizer;
        constructor() {
            super();
            this.#sanitizer = createDOMPurify(this.ownerDocument.defaultView);
        }
        get choiceSource() { return this.#revision; }
        get searchDelay() { return this.parameters.searchDelay; }
        get autoHighlight() { return this.constrained; }
        get matchTypedChoice() { return this.constrained; }
        get emptyChoice() {
            return this.constrained && !this.parameters.validate_notnull
                ? {id:null, caption:this.parameters.emptyLabel} : null;
        }
        // Database writes wait for a complete choice/free-text edit, even with live=True.
        get commitOnChange() { return true; }
        textValue(text) { return text === '' ? null : text; }
        projectAttributes(attrs, adapt) {
            const configuration = Object.fromEntries(Object.entries(attrs).filter(([key]) =>
                requestParameters.includes(key) || ['autoSelect','template','emptyLabel','validate_notnull'].includes(key)
                || key.startsWith('condition_') || key.startsWith('selected_')));
            const keys = new Set([...Object.keys(configuration), ...Object.keys(this.#configuration)]);
            if ([...keys].some(key => !Object.is(configuration[key], this.#configuration[key]))) {
                this.cancelValidation(); this.#acceptedRow = undefined;
                this.#configuration = configuration; this.#revision++;
            }
            this.#outputs = Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('selected_')));
            const rest = super.projectAttributes(attrs, adapt);
            this.#template = null;
            if (this.parameters.template != null) {
                this.#template = this.#sanitizer.sanitize(this.parameters.template, {
                    USE_PROFILES: {html:true}, RETURN_DOM_FRAGMENT:true,
                    FORBID_TAGS: ['style','form','input','button','select','textarea','a','audio','video','details','summary'],
                    FORBID_ATTR: ['id','name','role','tabindex','contenteditable','autofocus']
                });
                for (const element of this.#template.querySelectorAll('*')) {
                    if ([...element.attributes].some(attr => /\{[A-Za-z0-9_]+\}/.test(attr.value))) {
                        this.#template = null;
                        throw new TypeError('Selector template placeholders belong in text, not HTML attributes.');
                    }
                }
            }
            const {limit, searchDelay, hasDownArrow} = this.parameters;
            if (!Number.isInteger(limit) || limit < 1) throw new TypeError('limit must be a positive integer.');
            if (!Number.isInteger(searchDelay) || searchDelay < 0) throw new TypeError('searchDelay must be a non-negative integer.');
            this.toggle.hidden = !hasDownArrow;
            this.control.style.paddingRight = hasDownArrow ? '' : 'var(--gramlot-field-padding, .25em)';
            for (const key of Object.keys(rest)) if (key.startsWith('condition_') || key.startsWith('selected_')) delete rest[key];
            return rest;
        }
        async loadChoices(keywords, signal) {
            const parameters = Object.fromEntries(requestParameters.filter(key => key !== 'method' && this.parameters[key] != null)
                .map(key => [key, this.parameters[key]]));
            const required = new Set(Object.entries(this.#outputs).filter(([, path]) => path).map(([name]) => name.slice(9)));
            if (this.#template) {
                const walker = this.ownerDocument.createTreeWalker(this.#template, 4);
                while (walker.nextNode()) {
                    for (const match of walker.currentNode.data.matchAll(/\{([A-Za-z0-9_]+)\}/g)) required.add(match[1]);
                }
            }
            if (required.size) parameters.hiddenColumns = [...new Set([
                ...(parameters.hiddenColumns ?? '').split(',').map(name => name.trim()).filter(Boolean), ...required
            ])].join(',');
            for (const [key, value] of Object.entries(this.#configuration)) {
                if (key.startsWith('condition_')) {
                    const name = key.slice(10);
                    if (!name || name.startsWith('_') || requestParameters.includes(name)) throw new TypeError('Invalid condition parameter.');
                    parameters[name] = value;
                }
            }
            const result = await this.pageContext.remote(this.parameters.method, {...parameters, ...keywords}, signal);
            if (!result || !Array.isArray(result.rows) || typeof result.identifier !== 'string' || typeof result.caption !== 'string') {
                throw new TypeError('Database selectors require {rows, identifier, caption}.');
            }
            if (parameters.auxColumns != null) {
                if (!Array.isArray(result.columns) || !Array.isArray(result.headers)
                    || result.columns.length !== result.headers.length || !result.columns.length
                    || result.columns.some(name => typeof name !== 'string' || !name)
                    || result.headers.some(label => typeof label !== 'string')
                    || new Set(result.columns).size !== result.columns.length) {
                    throw new TypeError('auxColumns requires columns and headers display metadata.');
                }
                for (const name of result.columns) required.add(name);
            }
            const ids = new Set();
            return result.rows.map(record => {
                const id = record[result.identifier], caption = record[result.caption];
                if (!((typeof id === 'string' && id.length) || Number.isSafeInteger(id)) || typeof caption !== 'string' || ids.has(id)) {
                    throw new TypeError('Invalid or duplicate database choice identity/caption.');
                }
                for (const name of required) if (!Object.hasOwn(record, name)) {
                    throw new TypeError(`Missing requested selector column: ${name}`);
                }
                ids.add(id); return {id, caption, record, captionField:result.caption,
                    columns:parameters.auxColumns != null ? result.columns : null,
                    headers:parameters.auxColumns != null ? result.headers : null};
            });
        }
        selectionAccepted(row) { this.#acceptedRow = row; }
        renderChoice(row, item) {
            if (row.id === null) {
                super.renderChoice(row, item);
                item.style.color = 'var(--gramlot-text-secondary,GrayText)';
                item.style.borderBottom = '1px solid var(--gramlot-border,#d5dce5)';
                item.style.marginBottom = 'var(--gramlot-space-1,.25rem)';
                return;
            }
            if (this.#template) {
                const content = this.#template.cloneNode(true);
                const walker = this.ownerDocument.createTreeWalker(content, 4);
                while (walker.nextNode()) {
                    walker.currentNode.data = walker.currentNode.data.replace(/\{([A-Za-z0-9_]+)\}/g,
                        (_, name) => row.record[name] == null ? '' : String(row.record[name]));
                }
                item.style.display = 'block';
                item.style.overflowWrap = 'anywhere';
                item.replaceChildren(content);
                return;
            }
            if (row.columns) {
                item.style.display = 'grid';
                item.style.gridTemplateColumns = `repeat(${row.columns.length}, minmax(0, 1fr))`;
                item.style.gap = 'var(--gramlot-space-3,.75rem)';
                item.style.alignItems = 'start';
                item.replaceChildren(...row.columns.map((name, index) => {
                    const cell = this.ownerDocument.createElement('span');
                    cell.style.overflowWrap = 'anywhere';
                    const label = this.ownerDocument.createElement('small');
                    label.textContent = row.headers[index];
                    label.style.display = 'block'; label.style.opacity = '.7';
                    const value = this.ownerDocument.createElement('span');
                    value.textContent = row.record[name] ?? '';
                    cell.append(label, value); return cell;
                }));
                return;
            }
            super.renderChoice(row, item);
            for (const name of (this.parameters.columns ?? '').split(',').map(name => name.trim()).filter(name => name && name !== row.captionField)) {
                const detail = this.ownerDocument.createElement('span');
                detail.className = 'choice-detail';
                detail.textContent = row.record[name] ?? '';
                item.append(detail);
            }
        }
        selectionResolved(row) { this.#writeOutputs(row); }
        #writeOutputs(row) {
            const {selectedCaption, selectedRecord} = this.parameters;
            this.pageContext.selectionOutputs({selectedCaption, selectedRecord, fields:this.#outputs}, row);
        }
        finishValidation(outcome) {
            if (outcome.ok && this.#acceptedRow !== undefined) {
                const row = this.#acceptedRow; this.#acceptedRow = undefined;
                this.#writeOutputs(row);
                if (this.parameters.selectedCb) {
                    const report = error => console.error('Selection notification failed:', error);
                    try {
                        const result = this.pageContext.callLogic(this.parameters.selectedCb,
                            {value:outcome.value, record:row?.record ?? null});
                        if (result instanceof Promise) result.catch(report);
                    } catch (error) { report(error); }
                }
            }
            super.finishValidation(outcome);
        }
        async resolveValue() {
            const value = this.readControlValue();
            const pending = super.resolveValue();
            // Identity resolution must not start autoSelect after a later clear/edit.
            if (value != null && value !== '') return pending;
            await pending;
            if (this.active && !this.locked && this.parameters.autoSelect && this.readControlValue() == null && this.control.value === '') {
                const rows = await this.request({_querystring:'', limit:2});
                if (rows?.length === 1 && this.readControlValue() == null && !this.locked) this.choose(rows[0]);
            }
        }
    };
}
