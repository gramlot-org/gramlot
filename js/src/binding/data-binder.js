import {randomId} from '../random-id.js';

const REMOTE = 'gramlot-page-store-remote';

/** One Source node's subscription between client Data and its page's server Bag. */
export class DataBinder {
    constructor(binding) {
        this.binding = binding;
        this.registration = null;
        this.ready = false;
    }

    register() {
        const {runtime, node} = this.binding;
        this.connection = runtime.gramlot._pageStore;
        if (!this.connection) throw new Error('dataBinder requires a PageStore WebSocket');
        this.clientPath = node.absDatapath(node.pathAttribute('destination_path'));
        this.serverPath = node.getAttr('server_path');
        if (typeof this.clientPath !== 'string' || !this.clientPath || this.clientPath.includes('?')) {
            throw new TypeError('dataBinder requires a nonempty client Data path');
        }
        if (typeof this.serverPath !== 'string' || !/^[^.?#\[\]!:]+(?:\.[^.?#\[\]!:]+)*$/.test(this.serverPath)) {
            throw new TypeError('dataBinder requires a literal server path');
        }
        this.id = randomId();
        this.ready = false;
        this.registration = runtime.router.register({path: this.clientPath, recipient: this, subtree: true});
        try { this.connection.register(this); }
        catch (error) { this.registration.close(); this.registration = null; throw error; }
    }

    receive(change) {
        if (!this.ready || change.reason === REMOTE) return;
        if (change.fired) throw new Error('Fired events are outside the first PageStore PoC');
        const {data} = this.binding.runtime;
        const ancestor = change.level === 'container';
        const node = ancestor ? data.getNode(this.clientPath) : change.node;
        this.connection.send({
            op: 'change', binderId: this.id,
            path: ancestor || change.path === this.clientPath ? '' : change.path.slice(this.clientPath.length + 1),
            evt: ancestor ? (node ? 'upd_value' : 'del') : change.evt,
            value: node?.value ?? null, attr: {...node?.attr},
            index: change.index, fired: false,
        });
    }

    apply(message) {
        if (!this.registration?.active) return;
        const {data} = this.binding.runtime;
        const path = message.path ? this.clientPath + '.' + message.path : this.clientPath;
        this.ready = true;
        if (message.op === 'snapshot') {
            if (!message.exists) data.popNode(this.clientPath, REMOTE);
            else data.setItem(this.clientPath, message.value, message.attr, '>', false, false, REMOTE);
        } else if (message.op === 'change') {
            if (message.evt === 'del') data.popNode(path, REMOTE);
            else if (message.evt === 'upd_attrs') data.getNode(path).setAttr(message.attr, REMOTE, false, false);
            else data.setItem(path, message.value, message.attr, message.index ?? '>', false, false, REMOTE);
        } else {
            throw new Error('Unknown PageStore delivery');
        }
    }

    unregister() {
        this.ready = false;
        this.registration?.close();
        this.registration = null;
        this.connection?.unregister(this);
    }
}

