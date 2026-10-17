import {AskDialog} from './ask-dialog.js';
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
    'method', 'timeout', '_onCalling', '_onResult', '_onError', 'cacheTime',
]);

export class Provider {
    #binding;
    #registrations = [];
    #timingRegistrations = new Set();
    #stopTiming = null;
    #cancelDelay = null;
    // The AbortController of the in-flight call of a `dataRpc`: a new call aborts it (latest wins).
    #rpcCall = null;
    // The RpcResolver a `dataRemote` installed and its absolute Data path.
    #installed = null;
    // The resolver removed last had loaded or was loading: the next one loads at once.
    #reload = false;

    constructor(binding) {
        this.#binding = binding;
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
        const subscriptions = this.binding.runtime.gramlot._subscriptions;
        for (const name of Object.keys(node.getAttr())) {
            const prefix = name.startsWith('selfsubscribe_') ? 'selfsubscribe_' : name.startsWith('subscribe_') ? 'subscribe_' : null;
            if (!prefix) continue;
            const topic = prefix === 'selfsubscribe_'
                ? subscriptions.topicFor(node, name.slice(prefix.length)) : name.slice(prefix.length);
            // Legacy provider declarations subscribe by presence, including a false value.
            const handle = subscriptions.subscribe(topic, payload => {
                const trigger = {kind: 'subscription', topic, payload};
                if (this.#resolved('_userChanges') && topic !== 'node') return;
                const delay = this.#resolved('_delay');
                if (delay > 0) this.#debounce(trigger, delay);
                else this.invoke(trigger);
            });
            this.#registrations.push({close: () => subscriptions.unsubscribe(handle)});
        }
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
     * error propagates to the caller (P12). A closed node runs nothing. The body of a `dataRpc` is the
     * call: `invoke` returns its promise, and a false `_if` runs `_else` as inline code without calling.
     * The body of a `dataRemote` is the installation of its resolver; a false `_if` removes it, the
     * Data node keeping its last value, and runs `_else` as inline code.
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
        if (ask && !trigger.askDone && AskDialog.required(this.binding, ask, kwargs, '_ask')) {
            return AskDialog.show(this.binding, ask, kwargs, node.getAttr('_ask_title') ?? 'Warning').then(result => {
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
     * The call of a `dataRpc`: `_onCalling`, then `gramlot.rpc.call('data', method, …)` with the author
     * arguments, then the value written at `result_path` when present and `_onResult`. The previous
     * call of the node is aborted and its answer dropped (latest wins); the close of the node aborts
     * the call too. `timeout` > 0 ms aborts it with a `TimeoutError`. A failure goes to `_onError`, or
     * rejects the returned promise when the node declares none.
     */
    async #call(kwargs) {
        const node = this.node;
        const [onCalling, onResult, onError] = ['_onCalling', '_onResult', '_onError'].map(name => node.getAttr(name));
        if (onCalling) this.#inline('_onCalling', onCalling, onCalling, kwargs, true);
        this.#rpcCall?.abort();
        const controller = new AbortController();
        this.#rpcCall = controller;
        const release = this.binding.track(() => controller.abort());
        const timeout = this.#resolved('timeout');
        const timer = timeout > 0 ? setTimeout(() => {
            const error = new Error(`${node.nodeTag} '${node.label}': no answer within ${timeout} ms`);
            error.name = 'TimeoutError';
            controller.abort(error);
        }, timeout) : null;
        const aborted = new Promise((resolve, reject) => {
            controller.signal.addEventListener('abort', () => reject(controller.signal.reason), {once: true});
        });
        let outcome;
        try {
            const call = this.binding.runtime.gramlot.rpc.call('data', this.#resolved('method'), authorArguments(kwargs),
                {signal: controller.signal});
            outcome = {result: await Promise.race([call, aborted])};
        } catch (error) {
            outcome = {error};
        }
        clearTimeout(timer);
        release();
        // Superseded by a newer call, or the node closed: the answer is dropped.
        const current = this.#rpcCall === controller && !this.binding.closed;
        if (this.#rpcCall === controller) this.#rpcCall = null;
        if (!current) return;
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
     * A failed load is thrown again naming the node, as an unhandled rejection. A null path (Q7)
     * installs nothing.
     */
    #install(kwargs) {
        this.#uninstall();
        const reload = this.#reload;
        this.#reload = false;
        const node = this.node;
        const path = node.absDatapath(node.pathAttribute('destination_path'));
        if (path === null) return;
        const resolver = new RpcResolver({
            gramlot: this.binding.runtime.gramlot, method: this.#resolved('method'),
            params: authorArguments(kwargs), cacheTime: this.#resolved('cacheTime'),
            onError: error => {
                throw new Error(`${node.nodeTag} '${node.label}': dataRemote '${resolver.method}' failed: ${error.message}`,
                    {cause: error});
            },
        });
        this.binding.runtime.data.setResolver(path, resolver);
        this.#installed = {path, resolver};
        if (reload) resolver.refresh();
    }

    /** Remove the resolver this `dataRemote` installed, when it is still on its Data node, and abort its load. */
    #uninstall() {
        if (!this.#installed) return;
        const {path, resolver} = this.#installed;
        this.#installed = null;
        this.#reload = resolver.loaded || resolver.loading !== null;
        resolver.abort();
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
