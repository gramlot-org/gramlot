/**
 * The store side of the dataBinder protocol over one MessagePort: the browser counterpart of the
 * protocol part of the Python `PageStore` (`subscribe`, `unsubscribe`, `change` and the dispatch of
 * the changes of the served Bag to the binders whose path intersects).
 *
 * It imports no Bag or TYTX module: it uses the class of the Bag it serves, so a page-side bundle
 * shares the Bag class and the TYTX types of the page.
 *
 * @module
 */
const PATH = /^[^.?#\[\]!:]+(?:\.[^.?#\[\]!:]+)*$/;
const OPERATIONS = new Set(['subscribe', 'unsubscribe', 'change']);
let nextStore = 0;

function intersects(left, right) {
    return left === right || left.startsWith(right + '.') || right.startsWith(left + '.');
}

/** Serve one Bag to the dataBinder connections at the other end of one MessagePort. */
export class MessagePortStore {
    #subscribers = new Map();
    #changes = [];
    #dispatching = false;
    #subscription;
    #receive;

    /**
     * `bag` is the served root; `receive(message)` gets the decoded messages that are not
     * `subscribe`, `unsubscribe` or `change`, for the owner of the port.
     */
    constructor(bag, port, receive = null) {
        this.bag = bag;
        this.port = port;
        this.closed = false;
        this.#receive = receive;
        this.#subscription = `gramlot-message-port-store-${++nextStore}`;
        bag.subscribe(this.#subscription, {any: event => this.#changed(event)});
        port.addEventListener('message', this.#listener);
        port.start();
    }

    /** Send one message to the other end as the TYTX text of a Bag of its fields. */
    post(message) {
        if (this.closed) return;
        const wire = new this.bag.constructor();
        for (const [name, value] of Object.entries(message)) {
            if (value !== undefined) wire.setItem(name, value);
        }
        this.port.postMessage(wire.toTytx('json'));
    }

    #listener = event => {
        if (this.closed) return;
        const message = this.bag.constructor.fromTytx(event.data, 'json').asDict();
        if (!OPERATIONS.has(message.op)) {
            this.#receive?.(message);
            return;
        }
        try {
            if (message.op === 'subscribe') this.subscribe(message.binderId, message.path);
            else if (message.op === 'unsubscribe') this.unsubscribe(message.binderId);
            else this.change(message.binderId, message);
        } catch (error) {
            this.post({op: 'error', binderId: message.binderId, error: error.message});
        }
    };

    /** Register a binder and send its snapshot before any later change. */
    subscribe(binderId, path) {
        if (typeof binderId !== 'string' || !binderId) throw new TypeError('A binder requires an id');
        if (typeof path !== 'string' || !PATH.test(path)) throw new TypeError('A store path must contain dot-separated literal labels');
        if (this.#subscribers.has(binderId)) throw new Error('Binder is already registered');
        this.#subscribers.set(binderId, path);
        const node = this.bag.getNode(path);
        this.post({op: 'snapshot', binderId, path: '', exists: node !== null,
            value: node ? this.#copy(node.getValue(true)) : null, attr: node ? {...node.getAttr()} : {}});
    }

    unsubscribe(binderId) {
        this.#subscribers.delete(binderId);
    }

    /** Apply a change of a binder inside its branch; the dispatch skips that binder. */
    change(binderId, message) {
        const base = this.#subscribers.get(binderId);
        if (base === undefined) throw new Error('Binder is not registered');
        const relative = message.path;
        if (typeof relative !== 'string' || (relative !== '' && !PATH.test(relative))) {
            throw new TypeError('A change path must contain dot-separated literal labels');
        }
        if (message.fired) throw new Error('Fired events are outside the dataBinder protocol');
        const path = relative ? base + '.' + relative : base;
        if (message.evt === 'del') this.bag.popNode(path, binderId);
        else if (message.evt === 'upd_attrs') {
            const node = this.bag.getNode(path);
            if (!node) throw new Error('Attribute target does not exist');
            node.setAttr(message.attr, binderId, false, false);
        } else if (['ins', 'upd_value', 'upd'].includes(message.evt)) {
            this.bag.setItem(path, message.value, message.attr, message.index ?? '>', false, false, binderId);
        } else throw new Error('Unsupported datachange event');
    }

    /** A static copy: resolvers are never run, a resolver node travels with its cached value. */
    #copy(value) {
        if (!(value instanceof this.bag.constructor)) return value;
        const copy = new this.bag.constructor();
        for (const node of value.getNodes()) {
            copy.setItem(node.label, this.#copy(node.getValue(true)), {...node.getAttr()}, '>', false, false);
        }
        return copy;
    }

    #changed(event) {
        if (event.reason === 'autocreate') return;
        const structural = event.evt === 'ins' || event.evt === 'del';
        const pathlist = event.pathlist ?? [];
        for (const node of Array.isArray(event.node) ? event.node : [event.node]) {
            // The copy is taken now: a later write must not change an earlier message.
            this.#changes.push({path: (structural ? [...pathlist, node.label] : pathlist).join('.'), evt: event.evt,
                origin: event.reason, index: event.ind ?? null,
                value: event.evt === 'del' ? null : this.#copy(node.getValue(true)), attr: {...node.getAttr()}});
        }
        if (this.#dispatching) return;
        this.#dispatching = true;
        try {
            while (this.#changes.length) this.#dispatch(this.#changes.shift());
        } finally {
            this.#dispatching = false;
        }
    }

    #dispatch({path, evt, origin, index, value, attr}) {
        for (const [binderId, base] of [...this.#subscribers]) {
            if (binderId === origin || !intersects(path, base)) continue;
            if (path === base || path.startsWith(base + '.')) {
                this.post({op: 'change', binderId, path: path === base ? '' : path.slice(base.length + 1),
                    evt, value, attr, index});
            } else {
                if (evt === 'upd_attrs') continue;
                // The change of an ancestor: the binder's branch inside the copied value.
                const child = evt !== 'del' && value instanceof this.bag.constructor ? value.getNode(base.slice(path.length + 1)) : null;
                this.post({op: 'change', binderId, path: '', evt: child ? 'upd_value' : 'del',
                    value: child ? child.getValue(true) : null, attr: child ? {...child.getAttr()} : {}, index: null});
            }
        }
    }

    /** Tell the other end that the store is closed, then release the Bag and the port listener. */
    close() {
        if (this.closed) return;
        this.post({op: 'closed'});
        this.closed = true;
        this.bag.unsubscribe(this.#subscription, {any: true});
        this.port.removeEventListener('message', this.#listener);
        this.#subscribers.clear();
        this.#changes = [];
    }
}
