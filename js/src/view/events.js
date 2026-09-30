/**
 * `connect_on<event>` (source plan §2 Button, §4.11, S12): one DOM listener per attribute, bound to the
 * element of the node that declares it. The DOM event is the name after `connect_on`, lower-cased
 * (`connect_onclick` → `click`, `connect_onBlur` → `blur`). A value of dotted identifiers
 * (`group.method`) is named logic, resolved by LogicRegistry at every event (a missing name raises,
 * no fallback to inline, S09); any other value is inline code with `this` = the node and the
 * parameter `event`. The handler runs with the declaring node, also when the event hits a
 * descendant (R11). A closed NodeBinding does nothing (R12); an error propagates from the listener.
 */

const PREFIX = 'connect_on';
const NAMED_LOGIC = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)+$/;

export class NativeEventBinding {
    #binding;
    #record;
    #eventName;
    #handler;
    #attribute;

    /** The `connect_on<event>` attributes of `node` with a value, as `[attribute, eventName, handler]`. */
    static declared(node) {
        return Object.entries(node.getAttr() ?? {})
            .filter(([name, value]) => name.startsWith(PREFIX) && name.length > PREFIX.length && value != null)
            .map(([name, value]) => [name, name.slice(PREFIX.length).toLowerCase(), value]);
    }

    constructor(binding, record, eventName, handler, attribute = `${PREFIX}${eventName}`) {
        this.#binding = binding;
        this.#record = record;
        this.#eventName = eventName;
        this.#handler = handler;
        this.#attribute = attribute;
    }

    get binding() { return this.#binding; }
    get node() { return this.binding.node; }
    get element() { return this.#record.element; }
    get eventName() { return this.#eventName; }
    get handler() { return this.#handler; }
    /** The Source attribute that declares the listener, as written. */
    get attribute() { return this.#attribute; }

    attach() {
        this.element.addEventListener(this.eventName, this);
    }

    detach() {
        this.element.removeEventListener(this.eventName, this);
    }

    /** Run the handler with the declaring node and the event. */
    handleEvent(event) {
        if (this.binding.closed) return;
        const node = this.node;
        const runtime = this.binding.runtime;
        if (NAMED_LOGIC.test(this.handler)) {
            const {group, method} = runtime.logicRegistry.resolve(this.handler, node);
            method.call(group, node, event);
            return;
        }
        runtime.inlineCompiler.compile(node, this.attribute, this.handler, ['event'])({event});
    }
}
