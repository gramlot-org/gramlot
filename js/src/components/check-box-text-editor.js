/** Text projection for checkBoxText. Codes remain the field value; drafts belong to the Source node's `_internal`. */
export class CheckBoxTextEditor {
    constructor(owner) {
        this.owner = owner;
        const doc = owner.ownerDocument;
        this.input = doc.createElement('input');
        this.input.type = 'text'; this.input.className = 'summary';
        this.input.placeholder = 'Select options'; this.input.autocomplete = 'off';
        this.input.setAttribute('aria-label', 'Selected descriptions');
        this.list = doc.createElement('datalist'); this.list.id = 'description-options';
        this.input.setAttribute('list', this.list.id);
        this.toggle = doc.createElement('button'); this.toggle.type = 'button';
        this.toggle.className = 'choice-toggle'; this.toggle.setAttribute('aria-label', 'Show options');
        this.element = doc.createElement('div'); this.element.className = 'summary-row choice-field';
        this.element.append(this.input, this.toggle, this.list);
        this.toggle.addEventListener('click', () => owner.openChoices());
        this.input.addEventListener('input', event => {
            if (this.locked) return;
            owner.cancelValidation();
            this.state.draft = {text:this.input.value, value:owner.readControlValue()};
            owner.pageContext?.formSelectionError('Confirm the edited selection.');
            if (!event.isComposing) { owner.closeChoices(); this.suggest(); }
        });
        this.input.addEventListener('compositionend', () => this.suggest());
        this.input.addEventListener('change', () => this.commit());
        this.input.addEventListener('keydown', event => {
            if (event.isComposing || this.locked) return;
            if (event.key === 'Enter') { event.preventDefault(); this.commit(); }
            if (event.key === 'Escape') { event.preventDefault(); owner.cancelValidation(); this.clear(); owner.closeChoices(); owner.updateSummary(); }
        });
        owner.control.addEventListener('change', event => {
            if (event.target !== owner.control) this.clear();
        });
    }
    get state() { return this.source._internal; }
    get locked() { return this.input.disabled || this.input.readOnly || !this.owner.pageContext?.isActive(); }
    attach(source) { this.source = source; source._internal.draft ??= null; }
    clear() {
        if (this.source) this.state.draft = null;
        this.owner.pageContext?.formSelectionError('');
        this.input.setCustomValidity(''); this.input.setAttribute('aria-invalid','false');
        this.owner.error('');
    }
    project(value, caption) {
        if (this.source && this.state.draft && !Object.is(this.state.draft.value, value)) this.clear();
        const text = this.source && this.state.draft ? this.state.draft.text : caption ?? '';
        if (this.input.value !== text) this.input.value = text;
        this.toggle.disabled = this.input.disabled;
        this.element.hidden = this.input.hidden;
        this.suggest();
    }
    suggest() {
        const text = this.input.value, end = text.lastIndexOf(',') + 1;
        const prefix = text.slice(0,end), query = text.slice(end).trim().toLocaleLowerCase();
        const options = this.owner.textOptions();
        const used = new Set(prefix.split(',').map(s => s.trim().toLocaleLowerCase()));
        this.list.replaceChildren(...options.filter(row => !row.disabled && !used.has(row.caption.toLocaleLowerCase()) &&
            row.caption.toLocaleLowerCase().includes(query)).map(row => {
                const option = this.owner.ownerDocument.createElement('option');
                option.value = prefix + row.caption; option.label = row.id; return option;
            }));
    }
    candidate() {
        if (!this.source || !this.state.draft) return {value:this.owner.readControlValue()};
        const text = this.state.draft.text.trim();
        if (!text) return {value:null};
        const rows = this.owner.textOptions(), codes = [];
        const old = (this.state.draft.value || '').split(',');
        for (const token of text.split(',').map(s => s.trim())) {
            const matches = rows.filter(row => !row.disabled && row.caption.toLocaleLowerCase() === token.toLocaleLowerCase());
            if (matches.length !== 1) {
                // A missing code already present in Data may remain until options load.
                if (token && old.includes(token) && !rows.some(row => row.id === token)) { codes.push(token); continue; }
                return {error:matches.length > 1 ? 'Ambiguous description: choose its checkbox.' : 'Choose a description from the options.'};
            }
            if (!codes.includes(matches[0].id)) codes.push(matches[0].id);
        }
        return {value:codes.join(',') || null};
    }
    commit() {
        if (this.locked || !this.state.draft) return;
        this.owner.control.dispatchEvent(new this.owner.ownerDocument.defaultView.Event('change', {bubbles:true}));
    }
    reject(message) {
        this.input.setCustomValidity(message); this.input.setAttribute('aria-invalid','true');
        this.owner.error(message); this.owner.pageContext?.formSelectionError(message);
    }
}
