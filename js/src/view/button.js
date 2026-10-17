/** Shared command engine for the built-in button components (GC-310 §045).
 * One action, nested provider or fire mechanism. Components own presentation and
 * target selection; this binding owns execution, ask, delay and disposal.
 */

import {AskDialog} from '../binding/ask-dialog.js';

export class ButtonBinding {
    #binding;
    #record;
    #cancelDelay = null;
    #pendingCount = 0;

    /** The binding of a Gramlot button; html_button remains native despite its DOM tag. */
    static for(binding, record) {
        const element = record.element;
        if (!element?.constructor.gramlotComponent?.command) return null;
        return new ButtonBinding(binding, record);
    }

    constructor(binding, record) {
        this.#binding = binding;
        this.#record = record;
    }

    get binding() { return this.#binding; }
    get node() { return this.binding.node; }
    get element() { return this.#record.element; }

    /** The `dataController` and `dataRpc` children of the button, in Source order. */
    get controllers() {
        const value = this.node.value;
        if (!value?.getNodes) return [];
        return value.getNodes().filter(child => child.nodeTag === 'dataController' || child.nodeTag === 'dataRpc');
    }

    /**
     * 'controller' | 'action' | 'fire' | null, from the current Source. Several `dataController` or
     * `dataRpc` children, or two mechanisms together, are an error naming the button (P10).
     */
    get mechanism() {
        const node = this.node;
        const controllers = this.controllers;
        if (controllers.length > 1) {
            throw new Error(`${node.nodeTag} '${node.label}': several dataController or dataRpc children; a button has one click mechanism`);
        }
        const attrs = node.getAttr() ?? {};
        const found = [];
        if (controllers.length) found.push('controller');
        if (attrs.action != null) found.push('action');
        if (fireAttributes(attrs).length) found.push('fire');
        if (found.length > 1) {
            throw new Error(`${node.nodeTag} '${node.label}': ${found.join(' and ')} together; a button has one click mechanism`);
        }
        return found[0] ?? null;
    }

    /** Check the mechanism, apply R3's `type`, then listen to `click`. */
    attach() {
        this.refresh();
        this.element.activateCommand = event => this.onClick(event);
        this.element.attachCommand();
        this.element.addEventListener('click', this);
    }

    /**
     * The Source of the button changed (its attributes, a child inserted): the mechanism is checked
     * again, so an ambiguity raises now, and a button that gained a mechanism gets `type="button"`.
     */
    refresh() {
        const mechanism = this.mechanism;
        if (mechanism && this.node.getAttr('type') == null && this.element.getAttribute('type') !== 'button') {
            this.element.setAttribute('type', 'button');
        }
    }

    detach() {
        this.element.removeEventListener('click', this);
        this.element.releaseCommand();
        delete this.element.activateCommand;
        this.#cancelDelay?.();
    }

    handleEvent(event) {
        this.onClick(event);
    }

    /**
     * One click: nothing on a closed node (R12) or without a mechanism; `stopPropagation` (R3); a
     * disabled button counts nothing and runs nothing (legacy early return); then the counter and
     * the mechanism. An error propagates from the listener.
     */
    onClick(event) {
        if (this.binding.closed || this.element.disabled) return;
        const target = this.element.commandTarget(event);
        if (target === null) return;
        if (target !== this.element) {
            event.stopPropagation();
            return target.activateCommand(event);
        }
        if (!this.element.prepareCommand(event)) return;
        const mechanism = this.mechanism;
        if (!mechanism) return;
        event.stopPropagation();
        if (this.element.disabled) return;
        const counter = this.binding.countClick();
        // Legacy reads inherited _delay. An explicit zero overrides an ancestor's delay.
        let owner = this.node;
        while (owner && owner.getAttr('_delay') == null) owner = owner.parentNode;
        const delay = owner ? owner.builder.runtimeValues(owner)[1]._delay : 0;
        if (delay > 0) {
            const count = this.#pendingCount + 1;
            this.#cancelDelay?.();
            this.#pendingCount = count;
            const timer = setTimeout(() => {
                release();
                this.#cancelDelay = null;
                this.#pendingCount = 0;
                this.#execute(event, count);
            }, delay);
            const release = this.binding.track(() => this.#cancelDelay?.());
            this.#cancelDelay = () => {
                clearTimeout(timer);
                release();
                this.#cancelDelay = null;
                this.#pendingCount = 0;
            };
            return;
        }
        this.#cancelDelay?.();
        return this.#execute(event, counter);
    }

    /** Deliver the last event once; arguments are read when the mechanism executes. */
    #execute(event, counter) {
        if (this.binding.closed || this.element.disabled) return;
        const mechanism = this.mechanism;
        if (!mechanism) return;
        const node = this.node;
        const modifiers = eventToString(event);
        if (mechanism === 'controller') {
            const provider = this.binding.runtime.bindingFor(this.controllers[0])?.providers[0];
            provider?.invoke({kind: 'click', event, counter});
        } else if (mechanism === 'action') {
            const read = () => {
                const [, attrs] = node.builder.runtimeValues(node);
                const authored = Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'ask'));
                return {...this.binding.runtime.renderer.references.resolveArguments(authored), event, _counter: counter, modifiers};
            };
            const execute = result => {
                if (this.binding.closed || this.element.disabled || result === null) return;
                const values = {...read(), ...result};
                if (result) values._askResult = result;
                this.binding.runtime.inlineCompiler.compile(node, 'action', node.getAttr('action'), Object.keys(values))(values);
            };
            const ask = node.getAttr('ask');
            if (ask && AskDialog.required(this.binding, ask, read(), 'ask')) {
                return AskDialog.show(this.binding, ask, read()).then(execute);
            }
            execute(undefined);
        } else {
            const attributes = {modifier: modifiers, _counter: counter};
            // `fire` wins over the `fire_*` of the same button, as the legacy chain.
            const fire = node.getAttr('fire');
            if (fire != null) {
                node.FIRE(fire, modifiers || true, attributes);
                return;
            }
            // A recipient that removes the button stops the remaining `fire_*` (R12).
            for (const [name, path] of fireAttributes(node.getAttr())) {
                if (this.binding.closed) return;
                node.FIRE(path, name.slice('fire_'.length), attributes);
            }
        }
    }
}

/** The `fire` and `fire_*` attributes of `attrs` with a value, in attribute order. */
function fireAttributes(attrs) {
    return Object.entries(attrs ?? {}).filter(([name, value]) => value != null
        && (name === 'fire' || name.startsWith('fire_')));
}

/** The modifier keys of `event`, as legacy `eventToString` (`gnrlang.js`): 'Shift', 'CtrlAlt', …, or ''. */
function eventToString(event) {
    return ['shift', 'ctrl', 'alt', 'meta']
        .filter(key => event[`${key}Key`])
        .map(key => key[0].toUpperCase() + key.slice(1))
        .join('');
}
