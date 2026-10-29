import {NativeControl} from './bases.js';
import {parseChoices} from './choices.js';
import {positionPopup} from './popup.js';
import {Bag} from '@gramlot/gramlot';

/** Shared suggestions: constrained controls commit codes; comboBox commits text. */
export function ChoiceEditor(HTMLElement) {
    return class extends NativeControl(HTMLElement) {
        #value;
        #rows = [];
        #active = -1;
        #generation = 0;
        #opened = false;
        #dirty = false;
        #picked = null;
        #source;
        #separator;
        #cleanup;
        #requestController;
        #resolvingValue = false;
        #searchTimer;
        constructor() {
            super();
            const doc = this.ownerDocument;
            const style = doc.createElement('style');
            style.textContent = `.option{position:relative} #control{width:100%;padding-right:calc(var(--gramlot-choice-toggle-width,1.6em) + .2em)}
                #control:focus-visible{outline:1px solid var(--gramlot-border-control,#7a8798);outline-offset:-3px}
                .toggle{position:absolute;right:0;top:0;bottom:0;width:var(--gramlot-choice-toggle-width,1.6em);min-width:0;min-height:0;font:inherit;font-size:var(--gramlot-field-font-size,1em);padding:0;border:0;background:transparent;color:inherit}
                .choices{min-width:min(var(--gramlot-choice-popup-min-width,0px),var(--gramlot-popup-available-width,100vw));max-width:var(--gramlot-popup-available-width,100vw);position:fixed;inset:auto;margin:0;padding:var(--gramlot-popup-padding,4px);box-sizing:border-box;max-height:min(var(--gramlot-choice-max-height,20rem),var(--gramlot-popup-available-height,100vh));overflow:auto;
                    border:1px solid var(--gramlot-border-control,#aab4c2);border-radius:var(--gramlot-radius-sm,4px);background:var(--gramlot-surface,Canvas);color:var(--gramlot-ink,CanvasText);font:inherit;font-size:var(--gramlot-field-font-size,1em);line-height:1.4;box-shadow:var(--gramlot-shadow,0 3px 9px #0002)}
                .choices[hidden]{display:none} .choice{min-height:var(--gramlot-touch-target,0px);display:flex;align-items:center;padding:var(--gramlot-choice-item-padding,.25em .5em);border-radius:var(--gramlot-radius-sm,4px);cursor:pointer}
                .choice:nth-child(even){background:var(--gramlot-choice-alternate-background,var(--gramlot-surface-subtle,transparent))}
                .choice:hover{background:var(--gramlot-selected,Highlight)}
                .choice-detail{margin-inline-start:var(--gramlot-space-3,.75rem);color:var(--gramlot-text-secondary,GrayText)}
                .choice[aria-selected=true]{background:var(--gramlot-selected,Highlight);color:var(--gramlot-ink,HighlightText)}`;
            this.toggle = doc.createElement('button');
            this.toggle.className = 'toggle'; this.toggle.type = 'button'; this.toggle.tabIndex = -1;
            this.toggle.textContent = '▾'; this.toggle.setAttribute('aria-label', 'Show options');
            this.control.parentElement.append(this.toggle);
            this.choices = doc.createElement('div');
            this.choices.id = 'choices'; this.choices.className = 'choices'; this.choices.hidden = true;
            this.choices.setAttribute('role', 'listbox'); this.choices.setAttribute('popover', 'manual');
            this.controlBox.append(style, this.choices);
            this.toggle.addEventListener('mousedown', event => event.preventDefault());
            this.toggle.addEventListener('click', () => {
                if (this.locked) return;
                this.control.focus();
                if (this.#opened) this.closeChoices(); else this.search('');
            });
            this.choices.addEventListener('mousedown', event => event.preventDefault());
            this.control.addEventListener('input', event => {
                this.#dirty = true; this.#picked = null;
                if (!event.isComposing) this.scheduleSearch(this.control.value);
            });
            this.control.addEventListener('compositionend', () => this.scheduleSearch(this.control.value));
            this.control.addEventListener('keydown', event => {
                if (event.isComposing || this.locked) return;
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    const direction = event.key === 'ArrowDown' ? 1 : -1;
                    if (!this.#opened) this.search('', direction);
                    else this.activate(this.#active < 0 ? (direction > 0 ? 0 : this.#rows.length - 1) : Math.max(0, this.#active + direction));
                } else if (event.key === 'Enter') {
                    event.preventDefault();
                    if (this.#opened && this.#rows[this.#active]) this.choose(this.#rows[this.#active]);
                    else this.commitDraft();
                } else if (event.key === 'Escape') {
                    this.closeChoices(); this.#dirty = false; this.#picked = null;
                    if (this.constrained) this.resolveValue();
                    else { this.control.value = this.#value ?? ''; this.error(''); }
                }
            });
            this.control.addEventListener('blur', () => {
                if (!this.autoHighlight && this.#opened && this.#rows[this.#active]) this.choose(this.#rows[this.#active]);
                else if (this.#dirty) this.commitDraft();
                this.closeChoices();
            });
        }
        createControl() {
            const input = this.ownerDocument.createElement('input'); input.type = 'text';
            input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list');
            input.setAttribute('aria-controls', 'choices'); input.setAttribute('aria-expanded', 'false');
            input.autocomplete = 'off'; return input;
        }
        get constrained() { return true; }
        get autoHighlight() { return true; }
        get matchTypedChoice() { return true; }
        get emptyChoice() { return null; }
        get choiceSource() { return this.parameters.store ?? this.parameters.callback ?? this.parameters.values; }
        get searchDelay() { return 0; }
        textValue(text) { return text; }
        selectionAccepted(row) {}
        selectionResolved(row) {}
        renderChoice(row, item) { item.textContent = row.caption; }
        scheduleSearch(query) {
            this.closeChoices();
            if (!this.searchDelay) return this.search(query);
            this.#searchTimer = setTimeout(() => { this.#searchTimer = null; this.search(query); }, this.searchDelay);
        }
        get commitOnChange() { return this.constrained; }
        get locked() { return this.control.disabled || this.control.readOnly; }
        get active() { return this.isConnected && this.pageContext?.isActive(); }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const source = this.choiceSource;
            const changed = source !== this.#source || this.parameters.separator !== this.#separator;
            this.#separator = this.parameters.separator;
            this.#source = source;
            this.toggle.disabled = this.locked;
            if (changed) { this.#rows = []; this.#picked = null; }
            if (changed || this.locked) this.closeChoices({cancelLookup: changed});
            if (changed && this.active && !this.#dirty) this.resolveValue();
            return rest;
        }
        setPageContext(context) { super.setPageContext(context); this.resolveValue(); }
        connectedCallback() { this.resolveValue(); }
        readControlValue() { return this.#value; }
        writeControlValue(value) {
            if (Object.is(value, this.#value)) return;
            this.#value = value; this.#dirty = false; this.#picked = null;
            this.closeChoices({cancelLookup: true}); this.resolveValue();
        }
        validateSelection(value) {
            if (!this.constrained) return super.validateSelection(value);
            if (value == null || this.#rows.some(row => row.id === value) || this.#picked?.id === value) return true;
            return {errorcode:'missing', message:'Choose a value from the list.'};
        }
        acceptControlValue() {
            if (!this.#dirty) return this.validateCandidate(this.#value, accepted => this.writeControlValue(accepted));
            const picked = this.#picked ?? (!this.autoHighlight && this.#opened ? this.#rows[this.#active] : null);
            const text = picked && !this.constrained ? picked.caption : this.control.value;
            const matches = picked ? [picked] : this.matchTypedChoice
                ? this.#rows.filter(row => row.caption === text) : [];
            if (this.constrained && text !== '' && matches.length !== 1) {
                this.error('Choose a value from the list.'); return {ok: false};
            }
            const value = this.constrained ? (text === '' ? null : matches[0].id) : this.textValue(text);
            return this.validateCandidate(value, accepted => {
                if (accepted !== value && this.constrained) throw new Error('Validation cannot replace a selected code; update the Data explicitly.');
                this.#value = accepted; this.#dirty = false; this.#picked = null;
                if (accepted == null || !this.constrained) this.control.value = accepted ?? '';
                this.selectionAccepted(matches.length === 1 && accepted === value && matches[0].id !== null ? matches[0] : null);
                if (picked && !this.autoHighlight) this.closeChoices();
            });
        }
        commitDraft() {
            this.closeChoices();
            const Event = this.ownerDocument.defaultView.Event;
            this.control.dispatchEvent(new Event('change', {bubbles: true}));
        }
        choose(row) {
            if (this.locked || !this.active) return;
            this.#picked = row; this.#dirty = true; this.control.value = row.id === null ? '' : row.caption;
            this.closeChoices(); this.commitDraft();
        }
        async request(keywords) {
            this.#requestController?.abort();
            const controller = new AbortController(); this.#requestController = controller;
            this.#resolvingValue = Object.hasOwn(keywords, '_id');
            const generation = ++this.#generation;
            this.control.setAttribute('aria-busy', 'true'); this.error('');
            try {
                const rows = await this.loadChoices(keywords, controller.signal);
                if (generation !== this.#generation || !this.active) return null;
                return rows;
            } catch (error) {
                if (generation === this.#generation && this.active) this.error(error.message);
                return null;
            } finally {
                if (generation === this.#generation) { this.#requestController = null; this.#resolvingValue = false; this.control.setAttribute('aria-busy', 'false'); }
            }
        }
        async resolveValue() {
            if (this.#value == null || this.#value === '') { this.control.value = ''; this.error(''); if (this.active) this.selectionResolved(null); return; }
            if (!this.active) return;
            this.control.value = this.#value;
            if (!this.constrained) { this.error(''); this.selectionResolved(null); return; }
            const pending = this.request({_id: this.#value});
            const generation = this.#generation;
            const rows = await pending;
            if (!rows) {
                if (generation === this.#generation && this.active) this.selectionResolved(null);
                return;
            }
            const row = rows.find(item => item.id === this.#value);
            this.#rows = rows;
            this.control.value = row ? row.caption : this.#value;
            this.error(row ? '' : 'Value is not in the list.');
            this.selectionResolved(row ?? null);
        }
        async search(query, navigation = 0) {
            if (this.locked || !this.active) return;
            this.closeChoices(); this.#rows = [];
            const rows = await this.request({_querystring: query});
            if (!rows || this.locked || this.shadowRoot.activeElement !== this.control) return;
            const emptyChoice = this.emptyChoice;
            this.#rows = emptyChoice ? [emptyChoice, ...rows] : rows;
            const doc = this.ownerDocument;
            this.choices.replaceChildren(...this.#rows.map((row, index) => {
                const item = doc.createElement('div'); item.id = `choice-${index}`;
                item.className = 'choice'; item.setAttribute('role', 'option'); this.renderChoice(row, item);
                item.addEventListener('click', () => this.choose(row)); return item;
            }));
            if (!this.#rows.length) this.choices.textContent = 'No results';
            const view = doc.defaultView;
            this.choices.hidden = false; this.choices.showPopover(); this.#opened = true;
            const inset = parseFloat(view.getComputedStyle(this).getPropertyValue('--gramlot-choice-popup-inset') || '2');
            positionPopup(this.choices, this.control, {matchWidth: true, inset});
            this.control.setAttribute('aria-expanded', 'true');
            const reopening = this.constrained && !this.#dirty && query === '' && this.#value != null;
            this.activate(reopening ? this.#rows.findIndex(row => row.id === this.#value)
                : navigation < 0 ? this.#rows.length - 1 : navigation > 0 ? 0
                : this.autoHighlight && rows.length ? (emptyChoice ? 1 : 0) : -1);
            const close = () => this.closeChoices();
            const outside = event => { if (!event.composedPath().includes(this)) close(); };
            const scroll = event => { if (!event.composedPath().includes(this.choices)) close(); };
            doc.addEventListener('pointerdown', outside, true); doc.addEventListener('scroll', scroll, true);
            view.addEventListener('resize', close);
            this.#cleanup = () => {
                doc.removeEventListener('pointerdown', outside, true); doc.removeEventListener('scroll', scroll, true);
                view.removeEventListener('resize', close);
            };
        }
        activate(index) {
            this.#active = this.#rows.length && index >= 0 ? Math.min(index, this.#rows.length - 1) : -1;
            for (const [i, item] of [...this.choices.children].entries()) {
                item.setAttribute('aria-selected', String(i === this.#active));
                if (i === this.#active) item.scrollIntoView({block: 'nearest'});
            }
            if (this.#active < 0) this.control.removeAttribute('aria-activedescendant');
            else this.control.setAttribute('aria-activedescendant', `choice-${this.#active}`);
        }
        closeChoices({cancelLookup = false} = {}) {
            clearTimeout(this.#searchTimer); this.#searchTimer = null;
            // Closing suggestions must not cancel resolution of the selected Data value.
            if (cancelLookup || !this.#resolvingValue) {
                this.#requestController?.abort(); this.#requestController = null;
                this.#resolvingValue = false; ++this.#generation;
                this.control.setAttribute('aria-busy', 'false');
            }
            this.#cleanup?.(); this.#cleanup = null;
            if (this.#opened) this.choices.hidePopover();
            this.#opened = false; this.choices.hidden = true;
            this.control.setAttribute('aria-expanded', 'false');
            this.control.removeAttribute('aria-activedescendant');
        }
        releaseControl() { this.closeChoices({cancelLookup: true}); }
        disconnectedCallback() { this.releaseControl(); }
    };
}
ChoiceEditor.parameters = {...NativeControl.parameters,
    value: {dtype: 'T', nullable: true, binding: 'twoWay'},
    placeholder: {dtype: 'T', qualification: 'intl_str', default: '', target: 'control'}};

export function localChoices(Base) {
    return class extends Base {
        loadChoices(keywords) {
            let rows;
            if (this.parameters.store != null) {
                if (!(this.parameters.store instanceof Bag)) throw new TypeError('store must be a Bag');
                if (this.parameters.values) throw new TypeError('store and values are mutually exclusive');
                const ids = new Set();
                rows = this.parameters.store.getNodes().map(node => {
                    const id = node.staticValue, caption = node.attr.caption;
                    if (typeof id !== 'string' || !id || typeof caption !== 'string' || ids.has(id)) throw new TypeError('Invalid or duplicate store choice');
                    ids.add(id);
                    return {id, caption};
                });
            } else rows = parseChoices(this.parameters.values ?? '', this.parameters.separator);
            return rows.filter(row => Object.hasOwn(keywords, '_id') ? row.id === keywords._id
                : row.caption.toLocaleLowerCase().includes(keywords._querystring.toLocaleLowerCase()));
        }
    };
}
export function callbackChoices(Base) {
    return class extends Base {
        async loadChoices(keywords) {
            const result = await this.pageContext.callLogic(this.parameters.callback, keywords);
            if (!result || !Array.isArray(result.rows) || typeof result.identifier !== 'string' || typeof result.caption !== 'string') {
                throw new TypeError('callbackSelect requires {rows, identifier, caption}');
            }
            const ids = new Set();
            return result.rows.map(record => {
                const id = record[result.identifier], caption = record[result.caption];
                if (typeof id !== 'string' || !id || typeof caption !== 'string' || ids.has(id)) throw new TypeError('Invalid or duplicate choice code/caption');
                ids.add(id); return {id, caption};
            });
        }
    };
}
