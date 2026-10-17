import {NativeControl} from './bases.js';
import {parseChoices} from './choices.js';
import {positionPopup} from './popup.js';

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
        #cleanup;
        constructor() {
            super();
            const doc = this.ownerDocument;
            const style = doc.createElement('style');
            style.textContent = `.option{position:relative} #control{width:100%;padding-right:calc(var(--gramlot-choice-toggle-width,1.6em) + .2em)}
                .toggle{position:absolute;right:0;top:0;bottom:0;width:var(--gramlot-choice-toggle-width,1.6em);min-width:0;min-height:0;font:inherit;font-size:var(--gramlot-field-font-size,1em);padding:0;border:0;background:transparent;color:inherit}
                .choices{max-width:var(--gramlot-popup-available-width,100vw);position:fixed;inset:auto;margin:0;padding:var(--gramlot-popup-padding,4px);box-sizing:border-box;max-height:min(var(--gramlot-choice-max-height,12rem),var(--gramlot-popup-available-height,100vh));overflow:auto;
                    border:1px solid var(--gramlot-border-control,#aab4c2);border-radius:var(--gramlot-radius-sm,4px);background:var(--gramlot-surface,Canvas);color:var(--gramlot-ink,CanvasText);font:inherit;box-shadow:var(--gramlot-shadow,0 3px 9px #0002)}
                .choices[hidden]{display:none} .choice{min-height:var(--gramlot-touch-target,0px);display:flex;align-items:center;padding:.25em .5em;cursor:pointer}
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
                if (!event.isComposing) this.search(this.control.value);
            });
            this.control.addEventListener('compositionend', () => this.search(this.control.value));
            this.control.addEventListener('keydown', event => {
                if (event.isComposing || this.locked) return;
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    if (!this.#opened) this.search('');
                    else this.activate(this.#active + (event.key === 'ArrowDown' ? 1 : -1));
                } else if (event.key === 'Enter') {
                    event.preventDefault();
                    if (this.#opened && this.#rows[this.#active]) this.choose(this.#rows[this.#active]);
                    else this.commitDraft();
                } else if (event.key === 'Escape') {
                    this.closeChoices(); this.#dirty = false; this.#picked = null;
                    this.resolveValue();
                }
            });
            this.control.addEventListener('blur', () => { if (this.#dirty) this.commitDraft(); this.closeChoices(); });
        }
        createControl() {
            const input = this.ownerDocument.createElement('input'); input.type = 'text';
            input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list');
            input.setAttribute('aria-controls', 'choices'); input.setAttribute('aria-expanded', 'false');
            input.autocomplete = 'off'; return input;
        }
        get constrained() { return true; }
        get commitOnChange() { return this.constrained; }
        get locked() { return this.control.disabled || this.control.readOnly; }
        get active() { return this.isConnected && this.pageContext?.isActive(); }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const source = this.parameters.callback ?? this.parameters.values;
            const changed = source !== this.#source;
            this.#source = source;
            this.toggle.disabled = this.locked;
            if (changed || this.locked) this.closeChoices();
            if (changed && this.active && !this.#dirty) this.resolveValue();
            return rest;
        }
        setPageContext(context) { super.setPageContext(context); this.resolveValue(); }
        connectedCallback() { this.resolveValue(); }
        readControlValue() { return this.#value; }
        writeControlValue(value) {
            if (Object.is(value, this.#value)) return;
            this.#value = value; this.#dirty = false; this.#picked = null;
            this.closeChoices(); this.resolveValue();
        }
        validateSelection(value) {
            if (!this.constrained) return super.validateSelection(value);
            if (value == null || this.#rows.some(row => row.id === value) || this.#picked?.id === value) return true;
            return {errorcode:'missing', message:'Choose a value from the list.'};
        }
        acceptControlValue() {
            if (!this.#dirty) return this.validateCandidate(this.#value, accepted => this.writeControlValue(accepted));
            const text = this.control.value;
            const matches = this.#picked ? [this.#picked] : this.#rows.filter(row => row.caption === text);
            if (this.constrained && text !== '' && matches.length !== 1) {
                this.error('Choose a value from the list.'); return {ok: false};
            }
            const value = this.constrained ? (text === '' ? null : matches[0].id) : text;
            return this.validateCandidate(value, accepted => {
                if (accepted !== value && this.constrained) throw new Error('Validation cannot replace a selected code; update the Data explicitly.');
                this.#value = accepted; this.#dirty = false; this.#picked = null;
                if (!this.constrained) this.control.value = accepted ?? '';
            });
        }
        commitDraft() {
            const Event = this.ownerDocument.defaultView.Event;
            this.control.dispatchEvent(new Event('change', {bubbles: true}));
        }
        choose(row) {
            if (this.locked || !this.active) return;
            this.#picked = row; this.#dirty = true; this.control.value = row.caption;
            this.closeChoices(); this.commitDraft();
        }
        async request(keywords) {
            const generation = ++this.#generation;
            this.control.setAttribute('aria-busy', 'true'); this.error('');
            try {
                const rows = await this.loadChoices(keywords);
                if (generation !== this.#generation || !this.active) return null;
                return rows;
            } catch (error) {
                if (generation === this.#generation && this.active) this.error(error.message);
                return null;
            } finally {
                if (generation === this.#generation) this.control.setAttribute('aria-busy', 'false');
            }
        }
        async resolveValue() {
            if (this.#value == null || this.#value === '') { this.control.value = ''; this.error(''); return; }
            if (!this.active) return;
            this.control.value = this.#value;
            if (!this.constrained) { this.error(''); return; }
            const rows = await this.request({_id: this.#value});
            if (!rows) return;
            const row = rows.find(item => item.id === this.#value);
            this.#rows = rows;
            this.control.value = row ? row.caption : this.#value;
            this.error(row ? '' : 'Value is not in the list.');
        }
        async search(query) {
            if (this.locked || !this.active) return;
            this.closeChoices(); this.#rows = [];
            const rows = await this.request({_querystring: query});
            if (!rows || this.locked || this.shadowRoot.activeElement !== this.control) return;
            this.#rows = rows;
            const doc = this.ownerDocument;
            this.choices.replaceChildren(...rows.map((row, index) => {
                const item = doc.createElement('div'); item.id = `choice-${index}`;
                item.className = 'choice'; item.setAttribute('role', 'option'); item.textContent = row.caption;
                item.addEventListener('click', () => this.choose(row)); return item;
            }));
            if (!rows.length) this.choices.textContent = 'No results';
            const view = doc.defaultView;
            this.choices.hidden = false; this.choices.showPopover(); this.#opened = true;
            positionPopup(this.choices, this.control, {matchWidth: true});
            this.control.setAttribute('aria-expanded', 'true'); this.activate(0);
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
            this.#active = this.#rows.length ? Math.max(0, Math.min(index, this.#rows.length - 1)) : -1;
            for (const [i, item] of [...this.choices.children].entries()) {
                item.setAttribute('aria-selected', String(i === this.#active));
                if (i === this.#active) item.scrollIntoView({block: 'nearest'});
            }
            if (this.#active < 0) this.control.removeAttribute('aria-activedescendant');
            else this.control.setAttribute('aria-activedescendant', `choice-${this.#active}`);
        }
        closeChoices() {
            ++this.#generation; this.#cleanup?.(); this.#cleanup = null;
            if (this.#opened) this.choices.hidePopover();
            this.#opened = false; this.choices.hidden = true;
            this.control.setAttribute('aria-expanded', 'false'); this.control.setAttribute('aria-busy', 'false');
            this.control.removeAttribute('aria-activedescendant');
        }
        releaseControl() { this.closeChoices(); }
        disconnectedCallback() { this.releaseControl(); }
    };
}
ChoiceEditor.parameters = {...NativeControl.parameters,
    value: {dtype: 'T', nullable: true, binding: 'twoWay'},
    placeholder: {dtype: 'T', qualification: 'intl_str', default: '', target: 'control'}};

export function localChoices(Base) {
    return class extends Base {
        loadChoices(keywords) {
            const rows = parseChoices(this.parameters.values ?? '');
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
