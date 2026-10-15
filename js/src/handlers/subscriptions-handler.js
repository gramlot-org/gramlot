import {FrameMessages} from '../frame-messages.js';
import {Handler} from './handler.js';
import {sourceTarget} from '@genrojs/builders';

/** Page topics and Source self-topics. Owned privately by one Gramlot instance. */
export class SubscriptionsHandler extends Handler {
    #topics = new Map();
    #handles = new WeakSet();
    #nodeIds = new WeakMap();
    #sequence = 0;
    #closed = false;
    #frames;

    attach(document) { this.#frames = new FrameMessages(this.gramlot, document); }
    ready() { this.#frames.ready(); }

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

    publish(topic, payload = {}) {
        this.#requireOpen();
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            throw new TypeError('publish requires one object of named data');
        }
        if (typeof topic === 'string') return this.#deliver(topic, payload);
        if (!topic || typeof topic !== 'object' || Array.isArray(topic)) {
            throw new TypeError('publish requires a topic string or descriptor');
        }
        const keys = Object.keys(topic);
        if (keys.some(key => !['topic', 'nodeId', 'parent', 'iframe'].includes(key))) {
            throw new Error('This publication route is not implemented yet');
        }
        this.#requireTopic(topic.topic);
        if (topic.parent !== undefined && typeof topic.parent !== 'boolean') throw new TypeError('parent must be boolean');
        if (topic.iframe === '*') throw new Error('Recursive iframe broadcast is not implemented yet');
        if ((topic.parent || topic.iframe !== undefined) && Object.hasOwn(topic, 'nodeId')) {
            throw new Error('Interframe node addressing is not implemented yet');
        }
        const forward = topic.parent || topic.iframe !== undefined ? this.#frames.prepare(topic, payload) : null;
        if (Object.hasOwn(topic, 'nodeId')) {
            const node = this.gramlot.src.binding.nodeIds.get(topic.nodeId);
            if (!node) throw new Error(`node_id not found: ${topic.nodeId}`);
            return this.publishNode(node, topic.topic, payload);
        }
        this.#deliver(topic.topic, payload);
        forward?.();
    }

    topicFor(node, topic) {
        this.#requireTopic(topic);
        node = sourceTarget(node);
        const binding = this.gramlot.src.binding.bindingFor(node);
        if (!binding || binding.closed) throw new Error('Topic target is not an active Source node of this page');
        let id = node.getAttr('node_id');
        if (id == null) {
            if (!this.#nodeIds.has(node)) this.#nodeIds.set(node, `gramlot-self-${++this.#sequence}`);
            id = this.#nodeIds.get(node);
        }
        return `${id}_${topic}`;
    }

    publishNode(node, topic, payload = {}) {
        return this.publish(this.topicFor(node, topic), payload);
    }

    dispose() {
        this.#closed = true;
        this.#frames.dispose();
        this.#topics.clear();
    }

    #deliver(topic, payload) {
        this.#requireTopic(topic);
        const callbacks = this.#topics.get(topic);
        if (!callbacks) return;
        // Synchronous, ordered, no retention/equality suppression; exceptions propagate.
        for (const [handle, callback] of [...callbacks]) {
            if (this.#closed) break;
            if (callbacks.has(handle)) callback(payload);
        }
    }
    #requireTopic(topic) {
        if (typeof topic !== 'string' || !topic) throw new TypeError('A topic must be a nonempty string');
    }
    #requireOpen() {
        if (this.#closed) throw new Error('Gramlot subscriptions are disposed');
    }
}
