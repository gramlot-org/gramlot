/** Database suggestions share the choice editor and the ordinary data RPC. */
export const databaseParameters = {
    dbtable: {dtype:'T', binding:'read'},
    method: {dtype:'T', default:'dbSelect', binding:'read'},
    columns: {dtype:'T', binding:'read'},
    hiddenColumns: {dtype:'T', binding:'read'},
    order_by: {dtype:'T', binding:'read'},
    limit: {dtype:'L', default:10, binding:'read'},
    searchDelay: {dtype:'L', default:300, binding:'read'},
    ignoreCase: {dtype:'B', default:true, binding:'read'},
    hasDownArrow: {dtype:'B', default:true, binding:'read'},
    emptyLabel: {dtype:'T', default:'', binding:'read'},
    selectedCaption: {dtype:'T'},
    selectedRecord: {dtype:'T'},
    selectedCb: {dtype:'T'}
};
const requestParameters = ['dbtable','method','columns','hiddenColumns','order_by','limit','ignoreCase'];

export function databaseChoices(Base) {
    return class extends Base {
        #configuration = {};
        #outputs = {};
        #revision = 0;
        #acceptedRow;
        get choiceSource() { return this.#revision; }
        get searchDelay() { return this.parameters.searchDelay; }
        // Database writes wait for a complete choice/free-text edit, even with live=True.
        get commitOnChange() { return true; }
        textValue(text) { return text === '' ? null : text; }
        projectAttributes(attrs, adapt) {
            const configuration = Object.fromEntries(Object.entries(attrs).filter(([key]) =>
                requestParameters.includes(key) || key === 'autoSelect' || key.startsWith('condition_')));
            const keys = new Set([...Object.keys(configuration), ...Object.keys(this.#configuration)]);
            if ([...keys].some(key => !Object.is(configuration[key], this.#configuration[key]))) {
                this.cancelValidation(); this.#acceptedRow = undefined;
                this.#configuration = configuration; this.#revision++;
            }
            this.#outputs = Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('selected_')));
            const rest = super.projectAttributes(attrs, adapt);
            const {limit, searchDelay, hasDownArrow, emptyLabel} = this.parameters;
            if (!Number.isInteger(limit) || limit < 1) throw new TypeError('limit must be a positive integer.');
            if (!Number.isInteger(searchDelay) || searchDelay < 0) throw new TypeError('searchDelay must be a non-negative integer.');
            this.toggle.hidden = !hasDownArrow;
            this.control.style.paddingRight = hasDownArrow ? '' : 'var(--gramlot-field-padding, .25em)';
            if (!this.parameters.placeholder) this.control.placeholder = emptyLabel;
            for (const key of Object.keys(rest)) if (key.startsWith('condition_') || key.startsWith('selected_')) delete rest[key];
            return rest;
        }
        async loadChoices(keywords, signal) {
            const parameters = Object.fromEntries(requestParameters.filter(key => key !== 'method' && this.parameters[key] != null)
                .map(key => [key, this.parameters[key]]));
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
            const ids = new Set();
            return result.rows.map(record => {
                const id = record[result.identifier], caption = record[result.caption];
                if (!((typeof id === 'string' && id.length) || Number.isSafeInteger(id)) || typeof caption !== 'string' || ids.has(id)) {
                    throw new TypeError('Invalid or duplicate database choice identity/caption.');
                }
                ids.add(id); return {id, caption, record, captionField:result.caption};
            });
        }
        selectionAccepted(row) { this.#acceptedRow = row; }
        renderChoice(row, item) {
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
            await super.resolveValue();
            if (this.active && !this.locked && this.parameters.autoSelect && this.readControlValue() == null) {
                const rows = await this.request({_querystring:'', limit:2});
                if (rows?.length === 1 && this.readControlValue() == null && !this.locked) this.choose(rows[0]);
            }
        }
    };
}
