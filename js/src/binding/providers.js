import {Bag} from '@genrojs/bag';
import {RpcResolver} from './rpc-resolver.js';
import {pointerTransform, pointerDependencies} from '@genrojs/builders';
import {resolvePointerAttribute} from './pointer.js';

/**
 * Providers of one Gramlot page (source plan §4.8): the semantic runtime of a `dataFormula`, a
 * `dataController`, a `dataRpc` or a `dataRemote`, owned by its NodeBinding.
 *
 * One owner per trigger (B7): the router delivers the Data changes of the `^` pointers to
 * `receive`; `_timing` is started by `register`; `_init`, `_onBuilt` and `_onStart` are invoked by
 * BindingRuntime; the click of a button invokes the controller or the rpc nested in it, through ButtonBinding. Every timer is tracked on the NodeBinding, so the close of the node cancels it.
 * A body is named logic (P20), the group method given by `LogicRegistry.resolve`, or inline code
 * compiled by the page's InlineCompiler (S09); there is no fallback from a name to inline.
 */

// Control attributes: read by the provider, never passed to the body (P20). `if`/`else` are the
// names runtimeValues gives to `_if`/`_else`.
const CONTROL_ATTRIBUTES = new Set([
    'destination_path', 'result_path', 'func', 'formula', 'script', 'if', 'else',
    '_init', '_onStart', '_onBuilt', '_delay', '_timing', '_userChanges',
    '_ask', '_ask_if', '_ask_title', '_ask_onCancel',
    'method', 'timeout', '_onCalling', '_onResult', '_onError', 'cacheTime', 'sync',
]);

/**
 * The `_delay` and `_timing` timers of one Source node: the debounce of its Data triggers and its periodic
 * trigger. Each timer is tracked on the node's NodeBinding, so the close of the node cancels it. Shared by
 * the Provider of a data-element and the RemoteBinding of a `remote` node.
 */
export class TriggerTimers {
    #binding;
    #stopTiming = null;
    #cancelDelay = null;

    constructor(binding) {
        this.#binding = binding;
    }

    get binding() { return this.#binding; }

    /** Run `run` after `delay` ms; a new call cancels the scheduled one, never a request in flight (the last call wins). */
    debounce(delay, run) {
        this.#cancelDelay?.();
        let release = null;
        const timer = setTimeout(() => {
            release();
            this.#cancelDelay = null;
            run();
        }, delay);
        release = this.binding.track(() => clearTimeout(timer));
        this.#cancelDelay = () => {
            clearTimeout(timer);
            release();
            this.#cancelDelay = null;
        };
    }

    /** `_timing` in seconds: `run` in a `setInterval` while `seconds` is above 0; null or 0 stops it. A new call restarts it. */
    startTiming(seconds, run) {
        this.#stopTiming?.();
        if (!(seconds > 0)) return;
        const timer = setInterval(run, seconds * 1000);
        const release = this.binding.track(() => clearInterval(timer));
        this.#stopTiming = () => {
            clearInterval(timer);
            release();
            this.#stopTiming = null;
        };
    }

    /** Cancel the scheduled `_delay` call and stop `_timing`. */
    cancel() {
        this.#cancelDelay?.();
        this.#stopTiming?.();
    }
}

export class Provider {
    #binding;
    #registrations = [];
    #timingRegistrations = new Set();
    #timers;
    // The RpcResolver a `dataRemote` installed and its absolute Data path.
    #installed = null;
    // The resolver removed last had loaded or was loading: the next one loads at once.
    #reload = false;

    constructor(binding) {
        this.#binding = binding;
        this.#timers = new TriggerTimers(binding);
        binding.track(() => {
            this.cancel();
            this.#closeRegistrations();
            this.#uninstall();
        });
    }

    get binding() { return this.#binding; }
    get node() { return this.binding.node; }
    /** 'formula' | 'controller' | 'rpc' | 'remote'. */
    get kind() { throw new Error('Provider.kind is defined by FormulaProvider, ControllerProvider, RpcProvider and RemoteProvider'); }

    /**
     * Step 4 of §5.1, and every rebinding: the `^` pointers are registered again from the current
     * context (a pointer on a null path is not registered, Q7), and `_timing` starts again from its
     * current value. A numeric `_onStart` must be a finite number not below zero (P22). A `dataRemote`
     * then installs its resolver with the current arguments.
     */
    register() {
        const node = this.node;
        const onStart = node.getAttr('_onStart');
        if (typeof onStart === 'number' && !(Number.isFinite(onStart) && onStart >= 0)) {
            throw new Error(`${node.nodeTag} '${node.label}': _onStart must be true or a delay in ms not below 0: ${onStart}`);
        }
        this.#closeRegistrations();
        const router = this.binding.runtime.router;
        const timingDependencies = pointerDependencies(node, node.getAttr('_timing'));
        for (const [name, pointer] of node.pointers()) {
            if (name === 'datapath') continue;
            const absolute = node.absDatapath(pointer);
            if (absolute === null) continue;
            const [path, attr = null] = absolute.split('?', 2);
            const registration = router.register({path, attr, recipient: this});
            this.#registrations.push(registration);
            if (name === '_timing' || timingDependencies.has(name)) this.#timingRegistrations.add(registration);
        }
        // Legacy provider declarations subscribe by presence, including a false value.
        this.#registrations.push(...this.binding.runtime.subscriptions.subscribeNode(node, (name, value, topic) => payload => {
            const trigger = {kind: 'subscription', topic, payload};
            if (this.#resolved('_userChanges') && topic !== 'node') return;
            const delay = this.#resolved('_delay');
            if (delay > 0) this.#timers.debounce(delay, () => this.invoke(trigger));
            else this.invoke(trigger);
        }));
        this.#startTiming();
        if (this.kind === 'remote') this.invoke({kind: 'install', change: null});
    }

    /**
     * Router recipient. The `_timing` pointer restarts the timer; any other change is a Data
     * trigger: `_userChanges` lets only the level `node` through (D2a), evaluated now; `_delay`
     * debounces, the last call wins, and the arguments are read when the body runs.
     */
    receive(change) {
        if (this.#timingRegistrations.has(change.registration)) {
            this.#startTiming();
            return;
        }
        if (this.#resolved('_userChanges') && change.level !== 'node') return;
        const trigger = {kind: 'data', change};
        const delay = this.#resolved('_delay');
        if (delay > 0) this.#timers.debounce(delay, () => this.invoke(trigger));
        else this.invoke(trigger);
    }

    /**
     * The one pipeline of every trigger, `{kind: 'data'|'init'|'built'|'start'|'timing', change}` or
     * `{kind: 'click', event, counter}`:
     * arguments, `_if`, body, and for a formula the write of the result at `result_path`. `_if` and
     * `_else` are inline (Q11.1): a false `_if` stops, or `_else` replaces the body (D5); an empty `_if`
     * is absent and an empty `_else` or body is none, as legacy. A body is
     * the inline `formula`/`script`, compiled by the page's InlineCompiler, or the named `func`. An
     * error propagates to the caller (P12). A closed node runs nothing. The body of a `dataRpc` is the
     * call: `invoke` returns its promise, and a false `_if` runs `_else` as inline code without calling.
     * The body of a `dataRemote` is the installation of its resolver; a false `_if` removes it, the
     * Data node keeping its last value, and runs `_else` as inline code. A false `_if` never aborts a
     * request in flight: it is a readiness condition.
     */
    invoke(trigger) {
        if (this.binding.closed) return;
        const node = this.node;
        const formula = this.kind === 'formula';
        const rpc = this.kind === 'rpc';
        const remote = this.kind === 'remote';
        const kwargs = this.readArguments(trigger);
        if (trigger.askResult) {
            Object.assign(kwargs, trigger.askResult);
            kwargs._askResult = trigger.askResult;
        }
        const ask = node.getAttr('_ask');
        const askDialog = this.binding.runtime.askDialog;
        if (ask && !trigger.askDone && askDialog.required(this.binding, ask, kwargs, '_ask')) {
            return askDialog.show(this.binding, ask, kwargs, node.getAttr('_ask_title') ?? 'Warning').then(result => {
                if (this.binding.closed) return;
                if (result === null) {
                    const cancel = node.getAttr('_ask_onCancel');
                    if (cancel) this.#inline('_ask_onCancel', cancel, cancel, kwargs, true);
                    return;
                }
                return this.invoke({...trigger, askDone: true, askResult: result});
            });
        }
        let [attr, body] = [formula ? 'formula' : 'script', node.getAttr(formula ? 'formula' : 'script')];
        // Truthiness of `_if`, `_else` and the body, as legacy (`gnrdomsource.js:371-385, 473-482`).
        const condition = node.getAttr('_if');
        if (condition && !this.#inline('_if', condition, `return (${condition})`, kwargs, false)) {
            if (remote) this.#uninstall();
            [attr, body] = ['_else', node.getAttr('_else')];
            if (!body) return;
            if (rpc || remote) {
                this.#inline(attr, body, body, kwargs, true);
                return;
            }
        }
        if (rpc) return this.#call(kwargs);
        if (remote) return this.#install(kwargs);
        const func = node.getAttr('func');
        let result;
        if (body) {
            result = this.#inline(attr, body, formula ? `return ${body}` : body, kwargs, true);
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
        const authored = Object.fromEntries(Object.entries(attrs).filter(([name]) =>
            !CONTROL_ATTRIBUTES.has(name) && !name.startsWith('subscribe_') && !name.startsWith('selfsubscribe_')));
        const kwargs = {...(trigger.kind === 'subscription' ? trigger.payload : {}),
            ...this.binding.runtime.renderer.references.resolveArguments(authored)};
        if (trigger.kind === 'subscription') kwargs._subscription_kwargs = trigger.payload;
        const change = trigger.change ?? null;
        const reason = change ? change.level : trigger.kind === 'subscription' ? trigger.topic : trigger.kind;
        kwargs._node = change ? change.node : null;
        kwargs._triggerpars = {kw: change, trigger_reason: reason};
        kwargs._reason = reason;
        if (trigger.kind === 'click') Object.assign(kwargs, clickArguments(trigger));
        return kwargs;
    }

    /** Cancel the pending `_delay` call and stop `_timing`. */
    cancel() {
        this.#timers.cancel();
    }

    /** `_timing` in seconds: a `setInterval` while the value is above 0; null or 0 stops it. */
    #startTiming() {
        this.#timers.startTiming(this.#resolved('_timing'), () => this.invoke({kind: 'timing', change: null}));
    }

    /** The current value of a control attribute: a pointer is read from Data. */
    #resolved(name) {
        const node = this.node;
        const value = node.getAttr(name);
        if (pointerTransform(value)) return resolvePointerAttribute(node, name);
        return node.pointerType(value) ? node.getRelativeData(value) : value ?? null;
    }

    /**
     * The inline declaration `attr`, written `code` in the Source and compiled as `source`, run on
     * `kwargs`, as legacy (`gnrdomsource.js:377-378, 480-482`): `this` = node, the parameters `_node`,
     * `_triggerpars`, `_reason`, the click arguments (undefined for any other trigger), then the author
     * attributes; a body (`formula`, `script`, or `_else` in their place) has `_kwargs` first, `_if` has not.
     */
    #inline(attr, code, source, kwargs, body) {
        const names = [...(body ? ['_kwargs'] : []), ...TRIGGER_FIELDS, ...CLICK_FIELDS,
            ...Object.keys(authorArguments(kwargs))];
        return this.binding.runtime.inlineCompiler.compile(this.node, attr, code, names, source)({...kwargs, _kwargs: kwargs});
    }

    /**
     * The call of a `dataRpc`: `_onCalling` (a result `false` makes no call), then
     * `gramlot.rpc.call('data', method, …)` with the author arguments, then the value written at
     * `result_path` when present and `_onResult`. The call follows the rule of `node.requests`
     * (NodeRequests): one request in flight, its answer always applied; the first call during the flight
     * waits with its arguments and is sent at the answer. The close of the node aborts the call;
     * `timeout` > 0 ms aborts it with a `TimeoutError`. A failure goes to `_onError`, or rejects the
     * returned promise when the node declares none; a method name outside the syntax rejects it too.
     */
    async #call(kwargs) {
        const node = this.node;
        const [onCalling, onResult, onError] = ['_onCalling', '_onResult', '_onError'].map(name => node.getAttr(name));
        const requests = node.requests;
        if (!requests.calling(onCalling ? () => this.#inline('_onCalling', onCalling, onCalling, kwargs, true) : null)) return;
        return requests.submit(this.#resolved('method'), authorArguments(kwargs),
            request => this.#send(request, kwargs, onResult, onError));
    }

    /** Send the call `request` of a `dataRpc` and apply its outcome; a call of a closed node sends nothing. */
    async #send(request, kwargs, onResult, onError) {
        if (this.binding.closed) return;
        const node = this.node;
        const timeout = this.#resolved('timeout');
        const timer = timeout > 0 ? setTimeout(() => {
            const error = new Error(`${node.nodeTag} '${node.label}': no answer within ${timeout} ms`);
            error.name = 'TimeoutError';
            request.controller.abort(error);
        }, timeout) : null;
        let outcome;
        try {
            outcome = {result: await this.binding.call('data', request)};
        } catch (error) {
            outcome = {error};
        }
        clearTimeout(timer);
        // The node closed, or the developer cancelled the request: the answer is ignored.
        if (this.binding.closed || request.ignored) return;
        if ('error' in outcome) {
            if (!onError) throw outcome.error;
            this.#inline('_onError', onError, onError, {...kwargs, error: outcome.error}, true);
            return;
        }
        const {result} = outcome;
        if (node.getAttr('result_path') != null) node.setRelativeData(node.pathAttribute('result_path'), result);
        if (onResult) this.#inline('_onResult', onResult, onResult, {...kwargs, result}, true);
    }

    /**
     * The body of a `dataRemote`: a new RpcResolver on the Data node at `destination_path`, with the
     * author arguments as params, in place of the previous one, so the next read loads again. When the
     * resolver removed last, by this call or by a false `_if`, had loaded or was loading, the new one
     * loads at once: its consumers receive the new value through the Data event without reading again.
     * `_onCalling` runs, with the arguments of the installation, before each load. A failed load is thrown
     * again naming the node, as an unhandled rejection. A null path (Q7) installs nothing.
     */
    #install(kwargs) {
        this.#uninstall();
        const reload = this.#reload;
        this.#reload = false;
        const node = this.node;
        const path = node.absDatapath(node.pathAttribute('destination_path'));
        if (path === null) return;
        const onCalling = node.getAttr('_onCalling');
        const resolver = new RpcResolver({
            binding: this.binding, method: this.#resolved('method'),
            params: authorArguments(kwargs), cacheTime: this.#resolved('cacheTime'),
            // `sync`, default true as in the legacy, waits only on a transport with synchronous calls.
            sync: this.#resolved('sync') !== false && this.binding.runtime.gramlot.rpc.supportsCallSync,
            onCalling: onCalling ? () => this.#inline('_onCalling', onCalling, onCalling, kwargs, true) : null,
            onError: error => {
                throw new Error(`${node.nodeTag} '${node.label}': dataRemote '${resolver.method}' failed: ${error.message}`,
                    {cause: error});
            },
        });
        this.binding.runtime.data.setResolver(path, resolver);
        this.#installed = {path, resolver};
        if (reload) resolver.refresh();
    }

    /**
     * Remove the resolver this `dataRemote` installed, when it is still on its Data node. Its load in flight
     * is not aborted: it finishes and writes its value (`node.requests`); the removal of the node aborts it.
     */
    #uninstall() {
        if (!this.#installed) return;
        const {path, resolver} = this.#installed;
        this.#installed = null;
        this.#reload = resolver.loaded || resolver.loading !== null;
        const dataNode = this.binding.runtime.data.getNode(path);
        if (dataNode?.resolver === resolver) dataNode.resolver = null;
    }

    #closeRegistrations() {
        for (const registration of this.#registrations.splice(0)) registration.close();
        this.#timingRegistrations.clear();
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

/** The provider of a `dataRpc`: the body is the call of a server endpoint through `gramlot.rpc`. */
export class RpcProvider extends Provider {
    get kind() { return 'rpc'; }
}

/** The provider of a `dataRemote`: the body installs an RpcResolver, which calls its endpoint when the Data node is read. */
export class RemoteProvider extends Provider {
    get kind() { return 'remote'; }
}

// The trigger fields of the kwargs, in the legacy order of the inline parameters.
const TRIGGER_FIELDS = ['_node', '_triggerpars', '_reason', '_subscription_kwargs', '_askResult'];
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
