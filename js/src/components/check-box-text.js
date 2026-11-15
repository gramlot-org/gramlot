import {Bag} from '@gramlot/gramlot';
import {parseChoices} from './choices.js';
import {positionPopup} from './popup.js';
import {CheckBoxTree} from './check-box-tree.js';
import {CheckBoxTextEditor} from './check-box-text-editor.js';
import {choiceFieldStyles} from './choice-field-styles.js';

/** Multiple choices keep the existing group's commit and validation lifecycle. */
export function checkBoxChoices(Base) {
    return class extends Base {
        #text;
        #sourceContext;
        #tree;
        #attrs;
        #request;
        #configuration;
        #rows = [];
        #available = true;
        #opened = false;
        #cleanup;
        constructor() {
            super();
            const doc = this.ownerDocument;
            this.#text = new CheckBoxTextEditor(this);
            this.summary = this.#text.input; this.summary.hidden = true;
            this.summary.className = 'summary';
            this.summary.setAttribute('aria-haspopup', 'dialog');
            this.summary.setAttribute('aria-expanded', 'false');
            this.panel = doc.createElement('div'); this.panel.id = 'checkbox-options';
            this.panel.setAttribute('popover', 'manual'); this.panel.setAttribute('role', 'dialog');
            this.panel.setAttribute('aria-label', 'Options'); this.panel.hidden = true;
            this.summary.setAttribute('aria-controls', this.panel.id);
            this.optionsMessage = doc.createElement('div'); this.optionsMessage.setAttribute('role', 'status');
            const style = doc.createElement('style');
            style.textContent = choiceFieldStyles + `.summary{min-width:0;box-sizing:border-box;font:inherit;text-align:start;width:100%;padding:var(--gramlot-field-padding,.25em .5em);min-height:var(--gramlot-field-height,28px);border:1px solid var(--gramlot-border-control,#7a8798);border-radius:var(--gramlot-radius-sm,4px);background:var(--gramlot-field-background,Canvas);color:var(--gramlot-ink,CanvasText)}
                .summary:disabled{opacity:.6}.summary[aria-invalid=true]{border-color:var(--gramlot-error,#8c1d18)}
                [popover]{position:fixed;inset:auto;margin:0;padding:8px;max-width:var(--gramlot-popup-available-width,100vw);max-height:min(20rem,var(--gramlot-popup-available-height,100vh));overflow:auto;border:1px solid var(--gramlot-border-control,#7a8798);border-radius:var(--gramlot-radius-sm,4px);background:var(--gramlot-surface,Canvas);color:var(--gramlot-ink,CanvasText);font:inherit}
                [hidden]{display:none!important}`;
            this.controlBox.prepend(style, this.#text.element);
            this.controlBox.append(this.panel, this.optionsMessage);
            this.summary.addEventListener('click', () => this.#opened ? this.closeChoices() : this.openChoices());
            this.summary.addEventListener('keydown', event => {
                if (event.altKey && ['ArrowDown','ArrowUp'].includes(event.key)) { event.preventDefault(); this.openChoices(); }
            });
            this.panel.addEventListener('keydown', event => {
                if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); this.closeChoices(); this.summary.focus();}
            });
        }
        setSourceContext(context) { this.#sourceContext = context; this.#text.attach(context.sourceNode); }
        get choiceType() { return 'checkbox'; }
        get multiple() { return true; }
        choiceOptions() {
            const {values, identifier, labelAttribute, dbtable, method, hierarchical} = this.parameters;
            if (hierarchical) return [];
            if (dbtable || method) return this.#rows;
            if (typeof values === 'string') return parseChoices(values);
            // Bag options are read at the address of the `values` pointer, never from the projected value.
            const options = this.#sourceContext.getStaticData(this.#sourceContext.attrDatapath('values'));
            if (!(options instanceof Bag)) throw new TypeError('values must be text or a Bag');
            const ids = new Set();
            return options.getNodes().map(node => {
                const read = key => node.staticValue instanceof Bag ? node.staticValue.getItem(key) : node.getAttr(key);
                const id = identifier ? read(identifier) : node.label;
                const caption = labelAttribute ? read(labelAttribute) : node.label;
                if (typeof id !== 'string' || !id || id.includes(',') || ids.has(id) || typeof caption !== 'string') throw new TypeError('Options require unique comma-free text codes and text captions');
                ids.add(id); return {id, caption};
            });
        }
        projectAttributes(attrs, adapt) {
            const current = this.readControlValue();
            this.#attrs = attrs;
            const rest = super.projectAttributes(attrs, adapt);
            const {values, popup, disabled, readonly, dbtable, method, hierarchical} = this.parameters;
            if (hierarchical && (dbtable || method)) throw new TypeError('Load hierarchical values into a Bag with dataRemote, not the flat selector service');
            if (hierarchical && !this.#tree) this.#tree = new CheckBoxTree(this, this.#sourceContext);
            if (!hierarchical && this.#tree) { this.#tree.dispose(); this.#tree = null; }
            if ((dbtable || method) && values !== '') throw new TypeError('Remote choices and values are mutually exclusive');
            // `values` is a `^` parameter of dtype 'X': a change inside the options Bag or a replacement at
            // its address projects the control again, and the options are read at that address.
            this.summary.hidden = !popup; this.summary.disabled = Boolean(disabled || readonly || !this.#available);
            for (const input of this.control.querySelectorAll("input")) input.disabled = this.summary.disabled;
            if (!popup || this.summary.disabled) this.closeChoices();
            const target = popup ? this.panel : this.controlBox;
            if (this.control.parentNode !== target) target.append(this.control);
            this.writeControlValue(current);
            const config = Object.fromEntries(Object.entries(attrs).filter(([key]) =>
                ['dbtable','method','caption_field','order_by','condition'].includes(key) || key.startsWith('condition_')));
            const signature = JSON.stringify(config);
            if (signature !== this.#configuration) { this.#configuration = signature; this.loadOptions(config); }
            for (const key of Object.keys(rest)) if (key.startsWith('condition_')) delete rest[key];
            return rest;
        }
        setPageContext(context) { super.setPageContext(context); this.#configuration = undefined; this.projectAttributes(this.#attrs); }
        async loadOptions(config) {
            this.#request?.abort(); this.#request = null;
            if (!(config.dbtable || config.method)) {
                this.#available = true; this.optionsMessage.textContent = '';
                this.summary.disabled = Boolean(this.parameters.disabled || this.parameters.readonly);
                for (const input of this.control.querySelectorAll('input')) input.disabled = this.summary.disabled;
                return;
            }
            if (!this.pageContext) return;
            const controller = new AbortController(); this.#request = controller;
            this.closeChoices(); this.#available = false; this.summary.disabled = true;
            for (const input of this.control.querySelectorAll('input')) input.disabled = true;
            this.optionsMessage.textContent = 'Loading options…'; this.summary.setAttribute('aria-busy','true');
            const {method, ...parameters} = config;
            try {
            for (const key of Object.keys(parameters)) if (key.startsWith('condition_')) {
                const name = key.slice(10);
                if (!name || name.startsWith('_') || ['limit','dbtable','condition','caption_field','order_by'].includes(name)) throw new TypeError('Invalid condition parameter');
                parameters[name] = parameters[key]; delete parameters[key];
            }
                const result = await this.pageContext.remote(method || 'dbSelect', {...parameters, _querystring:'', limit:null}, controller.signal);
                if (controller.signal.aborted || !this.pageContext.isActive()) return;
                if (!result || !Array.isArray(result.rows) || typeof result.identifier !== 'string' || typeof result.caption !== 'string') throw new TypeError('Options require {rows, identifier, caption}');
                const ids = new Set();
                this.#rows = result.rows.map(row => {
                    const key = row[result.identifier], caption = row[result.caption];
                    if (!(typeof key === 'string' || Number.isSafeInteger(key)) || key === '' || String(key).includes(',') || typeof caption !== 'string' || ids.has(String(key))) throw new TypeError('Invalid or duplicate option');
                    const id = String(key); ids.add(id); return {id, caption};
                });
                this.#available = true;
                const value = this.readControlValue(); this.projectAttributes(this.#attrs); this.writeControlValue(value);
                this.optionsMessage.textContent = '';
            } catch(error) {
                if (!controller.signal.aborted && this.pageContext.isActive()) this.optionsMessage.textContent = error.message;
            } finally { if (this.#request === controller) this.summary.setAttribute('aria-busy','false'); }
        }
        acceptTreeValue(value) {
            this.#text.clear();
            super.writeControlValue(value);
            this.control.dispatchEvent(new this.ownerDocument.defaultView.Event('change', {bubbles:true}));
        }
        restoreFormValue(value) { this.#text.clear(); super.restoreFormValue(value); }
        textOptions() { return this.#tree ? this.#tree.options() : this.choiceOptions(); }
        acceptControlValue() {
            const candidate = this.#text.candidate();
            if (candidate.error) { this.#text.reject(candidate.error); return {ok:false}; }
            this.pageContext?.formSelectionError('');
            return this.validateCandidate(candidate.value, accepted => {
                this.#text.clear(); this.writeControlValue(accepted);
            });
        }
        writeControlValue(value) {
            super.writeControlValue(value); this.#tree?.project(value); this.updateSummary(value);
        }
        updateSummary(value = this.readControlValue()) {
            const labels = new Map(this.textOptions().map(row => [row.id,row.caption]));
            const caption = value ? value.split(',').map(code => labels.get(code) ?? code).join(',') : null;
            this.#text.project(value, caption);
            this.pageContext?.selectionDisplay(caption, value);
        }
        openChoices() {
            if (this.#opened || !this.parameters.popup || this.summary.disabled || !this.pageContext?.isActive()) return;
            this.panel.hidden = false; this.panel.showPopover(); this.#opened = true;
            this.summary.setAttribute('aria-expanded','true'); positionPopup(this.panel,this.summary,{matchWidth:true});
            const doc = this.ownerDocument, view = doc.defaultView;
            const outside = event => {if (!event.composedPath().includes(this)) this.closeChoices();};
            const position = () => positionPopup(this.panel,this.summary,{matchWidth:true});
            doc.addEventListener('pointerdown',outside); doc.addEventListener('focusin',outside);
            view.addEventListener('resize',position); view.addEventListener('scroll',position,true);
            this.#cleanup = () => {doc.removeEventListener('pointerdown',outside);doc.removeEventListener('focusin',outside);view.removeEventListener('resize',position);view.removeEventListener('scroll',position,true);};
            this.summary.focus();
        }
        closeChoices() {
            if (!this.#opened) return;
            this.#cleanup(); this.#cleanup = null; this.panel.hidePopover(); this.panel.hidden = true;
            this.#opened = false; this.summary.setAttribute('aria-expanded','false');
        }
        focus(options) { if (this.parameters.popup) this.summary.focus(options); else if (this.#tree) this.#tree.focus(); else super.focus(options); }
        releaseControl() {
            this.closeChoices(); this.#request?.abort();
            this.#tree?.dispose(); this.#tree = null;
            super.releaseControl();
        }
    };
}
