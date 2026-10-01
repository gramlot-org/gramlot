import {Bag} from '@genrojs/bag';

/**
 * Providers of one Gramlot page (source plan §4.8): the semantic runtime of a `dataFormula` or a
 * `dataController`, owned by its NodeBinding.
 *
 * One owner per trigger (B7): the router delivers the Data changes of the `^` pointers to
 * `receive`; `_timing` is started by `register`; `_init`, `_onBuilt` and `_onStart` are invoked by
 * BindingRuntime; the click of a button invokes the controller nested in it, through ButtonBinding. Every timer is tracked on the NodeBinding, so the close of the node cancels it.
 * A body is named logic (P20), the group method given by `LogicRegistry.resolve`, or inline code
 * compiled by the page's InlineCompiler (S09); there is no fallback from a name to inline.
 */

// Control attributes: read by the provider, never passed to the body (P20). `if`/`else` are the
// names runtimeValues gives to `_if`/`_else`.
const CONTROL_ATTRIBUTES = new Set([
    'destination_path', 'result_path', 'func', 'formula', 'script', 'if', 'else',
    '_init', '_onStart', '_onBuilt', '_delay', '_timing', '_userChanges',
]);

export class Provider {
    #binding;
    #registrations = [];
    #timingRegistration = null;
    #stopTiming = null;
    #cancelDelay = null;

    constructor(binding) {
        this.#binding = binding;
        binding.track(() => {
            this.cancel();
            this.#closeRegistrations();
        });
    }

    get binding() { return this.#binding; }
    get node() { return this.binding.node; }
    /** 'formula' | 'controller'. */
    get kind() { throw new Error('Provider.kind is defined by FormulaProvider and ControllerProvider'); }

    /**
     * Step 4 of §5.1, and every rebinding: the `^` pointers are registered again from the current
     * context (a pointer on a null path is not registered, Q7), and `_timing` starts again from its
     * current value. A numeric `_onStart` must be a finite number not below zero (P22).
     */
    register() {
        const node = this.node;
        const onStart = node.getAttr('_onStart');
        if (typeof onStart === 'number' && !(Number.isFinite(onStart) && onStart >= 0)) {
            throw new Error(`${node.nodeTag} '${node.label}': _onStart must be true or a delay in ms not below 0: ${onStart}`);
        }
        this.#closeRegistrations();
        const router = this.binding.runtime.router;
        for (const [name, pointer] of node.pointers()) {
            if (name === 'datapath') continue;
            const absolute = node.absDatapath(pointer);
            if (absolute === null) continue;
            const [path, attr = null] = absolute.split('?', 2);
            const registration = router.register({path, attr, recipient: this});
            this.#registrations.push(registration);
            if (name === '_timing') this.#timingRegistration = registration;
        }
        this.#startTiming();
    }

    /**
     * Router recipient. The `_timing` pointer restarts the timer; any other change is a Data
     * trigger: `_userChanges` lets only the level `node` through (D2a), evaluated now; `_delay`
     * debounces, the last call wins, and the arguments are read when the body runs.
     */
    receive(change) {
        if (change.registration === this.#timingRegistration) {
            this.#startTiming();
            return;
        }
        if (this.#resolved('_userChanges') && change.level !== 'node') return;
        const trigger = {kind: 'data', change};
        const delay = this.#resolved('_delay');
        if (delay > 0) this.#debounce(trigger, delay);
        else this.invoke(trigger);
    }

    /**
     * The one pipeline of every trigger, `{kind: 'data'|'init'|'built'|'start'|'timing', change}` or
     * `{kind: 'click', event, counter}`:
     * arguments, `_if`, body, and for a formula the write of the result at `result_path`. `_if` and
     * `_else` are inline (Q11.1): a false `_if` stops, or `_else` replaces the body (D5); an empty `_if`
     * is absent and an empty `_else` or body is none, as legacy. A body is
     * the inline `formula`/`script`, compiled by the page's InlineCompiler, or the named `func`. An
     * error propagates to the caller (P12). A closed node runs nothing.
     */
    invoke(trigger) {
        if (this.binding.closed) return;
        const node = this.node;
        const formula = this.kind === 'formula';
        const kwargs = this.readArguments(trigger);
        let [attr, body] = [formula ? 'formula' : 'script', node.getAttr(formula ? 'formula' : 'script')];
        // Truthiness of `_if`, `_else` and the body, as legacy (`gnrdomsource.js:371-385, 473-482`).
        const condition = node.getAttr('_if');
        if (condition && !this.#inline('_if', `return (${condition})`, kwargs, false)) {
            [attr, body] = ['_else', node.getAttr('_else')];
            if (!body) return;
        }
        const func = node.getAttr('func');
        let result;
        if (body) {
            result = this.#inline(attr, formula ? `return ${body}` : body, kwargs, true);
        } else if (func === null || func === undefined) {
            // No body, as legacy: a formula writes the Bag of its arguments, a controller does nothing.
            if (!formula) return;
            result = new Bag(authorArguments(kwargs));
        } else {
            const {group, method} = this.binding.runtime.logicRegistry.resolve(func, node);
            result = formula ? method.call(group, kwargs) : method.call(group, node, kwargs);
        }
        if (formula) node.setRelativeData(node.pathAttribute('result_path'), result);
    }

    /**
     * The kwargs of P20, read now: the resolved author attributes (`^` and `=` alike; null on a null
     * path, D1) without the control attributes, plus `_node`, `_triggerpars` and `_reason`. A Data
     * trigger gives the Data node, the delivered change and its level, as legacy; any other trigger
     * gives null, null and its own name. A click adds `_evt` and the `button_*` arguments of P9.
     */
    readArguments(trigger) {
        const node = this.node;
        const [, attrs] = node.builder.runtimeValues(node);
        const kwargs = {};
        for (const [name, value] of Object.entries(attrs)) {
            if (!CONTROL_ATTRIBUTES.has(name)) kwargs[name] = value;
        }
        const change = trigger.change ?? null;
        const reason = change ? change.level : trigger.kind;
        kwargs._node = change ? change.node : null;
        kwargs._triggerpars = {kw: change, trigger_reason: reason};
        kwargs._reason = reason;
        if (trigger.kind === 'click') Object.assign(kwargs, clickArguments(trigger));
        return kwargs;
    }

    /** Cancel the pending `_delay` call and stop `_timing`. */
    cancel() {
        this.#cancelDelay?.();
        this.#stopTiming?.();
    }

    /** `_timing` in seconds: a `setInterval` while the value is above 0; null or 0 stops it. */
    #startTiming() {
        this.#stopTiming?.();
        const seconds = this.#resolved('_timing');
        if (!(seconds > 0)) return;
        const timer = setInterval(() => this.invoke({kind: 'timing', change: null}), seconds * 1000);
        const release = this.binding.track(() => clearInterval(timer));
        this.#stopTiming = () => {
            clearInterval(timer);
            release();
            this.#stopTiming = null;
        };
    }

    #debounce(trigger, delay) {
        this.#cancelDelay?.();
        let release = null;
        const timer = setTimeout(() => {
            release();
            this.#cancelDelay = null;
            this.invoke(trigger);
        }, delay);
        release = this.binding.track(() => clearTimeout(timer));
        this.#cancelDelay = () => {
            clearTimeout(timer);
            release();
            this.#cancelDelay = null;
        };
    }

    /** The current value of a control attribute: a pointer is read from Data. */
    #resolved(name) {
        const node = this.node;
        const value = node.getAttr(name);
        return node.pointerType(value) ? node.getRelativeData(value) : value ?? null;
    }

    /**
     * The inline declaration `attr` run on `kwargs`, as legacy (`gnrdomsource.js:377-378, 480-482`):
     * `this` = node, the parameters `_node`, `_triggerpars`, `_reason`, the click arguments (undefined
     * for any other trigger), then the author attributes; a body (`formula`, `script`, or `_else` in
     * their place) has `_kwargs` first, `_if` has not.
     */
    #inline(attr, source, kwargs, body) {
        const names = [...(body ? ['_kwargs'] : []), ...TRIGGER_FIELDS, ...CLICK_FIELDS,
            ...Object.keys(authorArguments(kwargs))];
        return this.binding.runtime.inlineCompiler.compile(this.node, attr, source, names)({...kwargs, _kwargs: kwargs});
    }

    #closeRegistrations() {
        for (const registration of this.#registrations.splice(0)) registration.close();
        this.#timingRegistration = null;
    }
}

/** The provider of a `dataFormula`: the body's return value is written at `result_path`. */
export class FormulaProvider extends Provider {
    get kind() { return 'formula'; }
}

/** The provider of a `dataController`: the body runs for its side effects on the node. */
export class ControllerProvider extends Provider {
    get kind() { return 'controller'; }
}

// The trigger fields of the kwargs, in the legacy order of the inline parameters.
const TRIGGER_FIELDS = ['_node', '_triggerpars', '_reason'];
// The fields a click adds (P9): locals of the inline bodies, never author arguments.
const CLICK_FIELDS = ['_evt', 'button_counter', 'button_shift', 'button_ctrl', 'button_alt', 'button_meta'];

/** The kwargs written by the author, without the trigger and click fields. */
function authorArguments(kwargs) {
    const author = {...kwargs};
    for (const name of [...TRIGGER_FIELDS, ...CLICK_FIELDS]) delete author[name];
    return author;
}

/** `_evt` and the `button_*` arguments of a click trigger (P9). */
function clickArguments({event, counter}) {
    return {
        _evt: event, button_counter: counter, button_shift: Boolean(event.shiftKey),
        button_ctrl: Boolean(event.ctrlKey), button_alt: Boolean(event.altKey), button_meta: Boolean(event.metaKey),
    };
}
