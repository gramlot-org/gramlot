import {validateInput, validationParameters} from './validation.js';
import {positionPopup} from './popup.js';

const MESSAGE_DURATION = 1800;
const MESSAGE_FADE_DURATION = 200;

/** Shared candidate validation and presentation; ControlAdapter alone writes Data. */
export function FieldState(Base) {
    return class extends Base {
        #rejected = false;
        #projected;
        #messageTimer;
        #messageEvents;
        #validation;
        #validationEpoch = 0;
        #validationCurrent;
        #rules = {};
        validationResult = null;
        constructor() {
            super();
            this.message = this.ownerDocument.createElement('small');
            this.message.id = 'field-message'; this.message.hidden = true;
            this.message.setAttribute('aria-live', 'polite');
            this.message.setAttribute('popover', 'manual');
            this.message.setAttribute('role', 'tooltip');
            const style = this.ownerDocument.createElement('style');
            style.textContent = `#control[aria-invalid="true"]{background:var(--gramlot-error-background,#fff1f0)}
                input#control[aria-invalid="true"],textarea#control[aria-invalid="true"]{color:var(--gramlot-error,#8c1d18)}
                #field-message{position:fixed;inset:auto;margin:0;padding:.4em .65em;border:1px solid var(--gramlot-error,#b3261e);border-radius:var(--gramlot-radius-sm,4px);
                    color:var(--gramlot-error,#8c1d18);background:var(--gramlot-error-background,#fff1f0);font:inherit;font-size:.85em;box-shadow:var(--gramlot-shadow,0 2px 8px #0003);
                    max-width:min(28em,var(--gramlot-popup-available-width,100vw));max-height:var(--gramlot-popup-available-height,100vh);overflow:auto;overflow-wrap:anywhere;opacity:1;transition:opacity ${MESSAGE_FADE_DURATION}ms ease-out}
                #field-message[data-severity="warning"]{color:var(--gramlot-warning,#805600);border-color:var(--gramlot-warning,#805600);background:var(--gramlot-warning-background,#fff8df)}
                #field-message[data-fading]{opacity:0}
                @media(prefers-reduced-motion:reduce){#field-message{transition:none}}`;
            this.shadowRoot.append(style);
            this.control.setAttribute('aria-describedby', this.message.id);
            this.controlBox.append(this.message);
            this.control.addEventListener('input', () => this.cancelValidation());
            this.control.addEventListener('compositionstart', () => this.cancelValidation());
            this.control.addEventListener('focusin', () => this.#showMessage());
            this.control.addEventListener('mouseenter', () => this.#showMessage());
            this.control.addEventListener('keydown', event => {
                if (event.key === 'Escape') { this.cancelValidation(); this.#hideMessage(); }
            });
        }
        #hideMessage() {
            this.ownerDocument.defaultView.clearTimeout(this.#messageTimer);
            this.#messageEvents?.abort(); this.#messageEvents = null;
            if (!this.message.hidden) this.message.hidePopover();
            this.message.hidden = true;
            this.message.removeAttribute('data-fading');
        }
        #showMessage() {
            if (!this.message.textContent || !this.isConnected) return;
            this.#hideMessage();
            const view = this.ownerDocument.defaultView;
            this.message.hidden = false;
            this.message.showPopover();
            positionPopup(this.message, this.control);
            this.#messageTimer = view.setTimeout(() => {
                if (this.message.hidden) return;
                this.message.setAttribute('data-fading', '');
                this.#messageTimer = view.setTimeout(() => this.#hideMessage(), MESSAGE_FADE_DURATION);
            }, MESSAGE_DURATION);
            this.#messageEvents = new view.AbortController();
            const options = {capture:true, signal:this.#messageEvents.signal};
            view.addEventListener('scroll', () => this.#hideMessage(), options);
            view.addEventListener('resize', () => this.#hideMessage(), options);
        }
        releaseControl() { this.cancelValidation(); this.#hideMessage(); super.releaseControl(); }
        disconnectedCallback() { this.releaseControl(); }
        setFieldState({invalid = false, pending = false} = {}) {
            this.control.setAttribute('aria-invalid', String(invalid));
            this.control.setAttribute('aria-busy', String(pending));
        }
        error(message) {
            this.#rejected = false;
            if (['input', 'textarea'].includes(this.control.localName)) this.control.setCustomValidity(message);
            this.control.setAttribute('aria-invalid', String(Boolean(message)));
            this.message.textContent = message;
            if (message) this.#showMessage(); else this.#hideMessage();
        }
        cancelValidation() {
            this.#validationEpoch++;
            this.#validation?.abort(); this.#validation = null; this.#validationCurrent = null;
            this.control.setAttribute('aria-busy', 'false');
        }
        validateCandidate(value, accept) {
            this.cancelValidation();
            const controller = new AbortController(); this.#validation = controller;
            const epoch = this.#validationEpoch;
            const rules = this.#rules;
            const current = this.pageContext.validationCurrent(); this.#validationCurrent = current;
            const valid = () => this.#validationEpoch === epoch && !controller.signal.aborted && current();
            const failure = error => ({value, modified:false, error:error.message, warnings:[], issues:[], datachanges:[]});
            const finish = result => {
                if (!valid()) {
                    if (this.#validation === controller) this.cancelValidation();
                    return {ok:false};
                }
                this.#validation = null; this.#validationCurrent = null;
                this.control.setAttribute('aria-busy', 'false');
                try { if (!result.error) accept(result.value); }
                catch (error) { result = failure(error); }
                this.validationResult = result;
                this.error(result.error || ''); this.message.dataset.severity = result.error ? 'error' : 'warning'; this.#rejected = Boolean(result.error);
                if (!result.error && result.warnings.length) {
                    this.message.textContent = result.warnings.join('\n'); this.#showMessage();
                }
                const outcome = {ok:!result.error, value:result.value, result, rules, isCurrent:valid};
                if (!outcome.ok) this.finishValidation(outcome);
                return outcome;
            };
            let result;
            try {
                if (rules.validate_timeout != null && (!Number.isInteger(rules.validate_timeout) || rules.validate_timeout <= 0)) throw new TypeError('validate_timeout must be a positive integer in milliseconds.');
                result = validateInput(value, rules, {...this.pageContext, signal:controller.signal, selection:value => this.validateSelection(value)});
            }
            catch (error) { return finish(failure(error)); }
            if (!(result instanceof Promise)) return finish(result);
            this.control.setAttribute('aria-busy', 'true');
            return new Promise(resolve => {
                let timer;
                const abort = () => { clearTimeout(timer); resolve({ok:false}); };
                controller.signal.addEventListener('abort', abort, {once:true});
                const settle = answer => {
                    clearTimeout(timer); controller.signal.removeEventListener('abort', abort);
                    resolve(finish(answer));
                };
                if (rules.validate_timeout != null) timer = setTimeout(() => {
                    settle(failure(new Error('Validation timed out.'))); controller.abort();
                }, rules.validate_timeout);
                result.then(settle, error => settle(failure(error)));
            });
        }
        finishValidation(outcome) {
            if (!outcome.result) return;
            this.pageContext.finishValidation(outcome);
        }
        shouldProjectControlValue(value) {
            if (this.#validationCurrent && !this.#validationCurrent()) this.cancelValidation();
            const same = this.sameControlValue(value, this.#projected);
            if (same && this.#rejected) return false;
            if (!same) this.cancelValidation();
            this.#projected = value;
            if (!same && this.#rejected) this.error('');
            return true;
        }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const rules = Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('validate_')));
            const keys = new Set([...Object.keys(rules), ...Object.keys(this.#rules)]);
            if ([...keys].some(key => !Object.is(rules[key], this.#rules[key])) || attrs.disabled || attrs.readonly) this.cancelValidation();
            this.#rules = rules;
            for (const key of Object.keys(rules)) delete rest[key];
            const required = Boolean(this.parameters.validate_notnull);
            this.control.setAttribute('aria-required', String(required));
            // required on a checkbox would mean "must be true", not "must be present".
            if (this.control.localName === 'textarea' || this.control.localName === 'input' && ['text', 'password'].includes(this.control.type)) {
                this.control.required = required;
            }
            return rest;
        }
    };
}
FieldState.parameters = validationParameters;
