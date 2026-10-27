import {Handler} from './handler.js';
import {sourceTarget} from '@genrojs/builders';

/** Page topics and Source self-topics. Owned privately by one Gramlot instance. */
export class SubscriptionsHandler extends Handler {
    #topics = new Map();
    #handles = new WeakSet();
    #nodeIds = new WeakMap();
    #sequence = 0;
    #closed = false;
    ready() { this.gramlot._frames.ready(); }

    subscribe(topic, callback) {
        this.#requireOpen();
        this.#requireTopic(topic);
        if (typeof callback !== 'function') throw new TypeError('subscribe requires a callback');
        const handle = Object.freeze({});
        this.#handles.add(handle);
        if (!this.#topics.has(topic)) this.#topics.set(topic, new Map());
        this.#topics.get(topic).set(handle, callback);
        return handle;
    }

    unsubscribe(handle) {
        if (!this.#handles.has(handle)) throw new TypeError('Unknown subscription registration');
        for (const [topic, callbacks] of this.#topics) {
            if (callbacks.delete(handle) && !callbacks.size) this.#topics.delete(topic);
        }
    }

    publish(topic, payload = {}, metadata = {}) {
        this.#requireOpen();
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            throw new TypeError('publish requires one object of named data');
        }
        if (typeof topic === 'string') return this.#deliver(topic, payload, metadata);
        if (!topic || typeof topic !== 'object' || Array.isArray(topic)) {
            throw new TypeError('publish requires a topic string or descriptor');
        }
        const keys = Object.keys(topic);
        if (keys.some(key => !['topic', 'nodeId', 'parent', 'iframe', 'pageId', 'server'].includes(key))) {
            throw new Error('This publication route is not implemented yet');
        }
        this.#requireTopic(topic.topic);
        if (topic.parent !== undefined && typeof topic.parent !== 'boolean') throw new TypeError('parent must be boolean');
        if (topic.server !== undefined && typeof topic.server !== 'boolean') throw new TypeError('server must be boolean');
        if (topic.iframe === '*') throw new Error('Recursive iframe broadcast is not implemented yet');
        if (topic.pageId !== undefined && (typeof topic.pageId !== 'string' || !topic.pageId)) throw new TypeError('pageId must be a nonempty string');
        if ((topic.parent || topic.iframe !== undefined || topic.pageId !== undefined) && Object.hasOwn(topic, 'nodeId')) {
            throw new Error('Interframe node addressing is not implemented yet');
        }
        let forward = null;
        if (topic.server === true) {
            if (['parent', 'iframe', 'nodeId'].some(key => Object.hasOwn(topic, key))) {
                throw new Error('Server publication cannot combine window or node selectors');
            }
            if (!this.gramlot._pageStore) throw new Error('Server publication requires a WebSocket channel');
            forward = this.gramlot._pageStore.preparePublish(topic, payload);
        } else if (topic.parent || topic.iframe !== undefined || topic.pageId !== undefined) {
            forward = this.gramlot._frames.prepare(topic, payload);
        }
        if (Object.hasOwn(topic, 'nodeId')) {
            const node = this.gramlot.src.binding.nodeIds.get(topic.nodeId);
            if (!node) throw new Error(`nodeId not found: ${topic.nodeId}`);
            return this.publishNode(node, topic.topic, payload);
        }
        this.#deliver(topic.topic, payload);
        return forward?.();
    }

    topicFor(node, topic) {
        this.#requireTopic(topic);
        node = sourceTarget(node);
        const binding = this.gramlot.src.binding.bindingFor(node);
        if (!binding || binding.closed) throw new Error('Topic target is not an active Source node of this page');
        let id = node.getAttr('nodeId');
        if (id == null) {
            if (!this.#nodeIds.has(node)) this.#nodeIds.set(node, `gramlot-self-${++this.#sequence}`);
            id = this.#nodeIds.get(node);
        }
        return `${id}_${topic}`;
    }

    publishNode(node, topic, payload = {}) {
        return this.publish(this.topicFor(node, topic), payload);
    }

    /**
     * Subscribe the topic declarations of the Source node `node`: `subscribe_<topic>`, and
     * `selfsubscribe_<topic>` on the topic of the node (`topicFor`). `callbackFor(name, value, topic)` gives
     * the callback of each declaration, or throws for one it refuses, before any subscription is made.
     * Returns the registrations, each with `close()`. The rule of the value belongs to the caller: a
     * provider subscribes by presence, a rendered node requires a handler (GC-095 §115).
     */
    subscribeNode(node, callbackFor) {
        const declarations = [];
        for (const [name, value] of Object.entries(node.getAttr())) {
            const prefix = name.startsWith('selfsubscribe_') ? 'selfsubscribe_' : name.startsWith('subscribe_') ? 'subscribe_' : null;
            if (!prefix) continue;
            const topic = prefix === 'selfsubscribe_'
                ? this.topicFor(node, name.slice(prefix.length)) : name.slice(prefix.length);
            this.#requireTopic(topic);
            declarations.push([topic, callbackFor(name, value, topic)]);
        }
        this.#requireOpen();
        return declarations.map(([topic, callback]) => {
            const handle = this.subscribe(topic, callback);
            return {close: () => this.unsubscribe(handle)};
        });
    }

    dispose() {
        this.#closed = true;
        this.#topics.clear();
    }

    #deliver(topic, payload, metadata = {}) {
        this.#requireTopic(topic);
        const callbacks = this.#topics.get(topic);
        if (!callbacks) return;
        // Synchronous, ordered, no retention/equality suppression; exceptions propagate.
        for (const [handle, callback] of [...callbacks]) {
            if (this.#closed) break;
            if (callbacks.has(handle)) callback(payload, {...metadata});
        }
    }
    #requireTopic(topic) {
        if (typeof topic !== 'string' || !topic) throw new TypeError('A topic must be a nonempty string');
    }
    #requireOpen() {
        if (this.#closed) throw new Error('Gramlot subscriptions are disposed');
    }
}
