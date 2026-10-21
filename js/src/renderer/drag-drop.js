import {toTytx, fromTytx} from '@genrojs/tytx';
import {DragDropPolicy} from './drag-drop-policy.js';

const EVENTS = ['dragstart', 'dragover', 'dragleave', 'drop', 'dragend'];

/** One renderer's internal gestures. Other windows/instances and external payloads are not admitted. */
export class DragDrop {
    #renderer;
    #document;
    #session = null;
    #feedback = null;
    #style = null;
    #hide;

    constructor(renderer) {
        this.#renderer = renderer;
        this.#document = renderer.destination.ownerDocument;
        for (const name of EVENTS) this.#document.addEventListener(name, this);
        this.#hide = () => this.#finish('none');
        this.#document.defaultView.addEventListener('pagehide', this.#hide);
    }

    handleEvent(event) {
        if (event.type === 'dragstart') this.#start(event);
        else if (event.type === 'dragend') this.#finish(event.dataTransfer.dropEffect);
        else if (event.type === 'dragleave') this.#clearFeedback();
        else if (event.type === 'dragover') this.#over(event);
        else if (event.type === 'drop') void this.#drop(event);
    }

    #record(event, predicate) {
        for (const element of event.composedPath()) {
            const record = this.#renderer.elements.get(element);
            if (record && predicate(record.resolved)) return record;
        }
        return null;
    }

    #context(record, event) {
        return record.node._getMeta('gramlot_component')?.dragSource
            ? record.element.getDragContext(event)
            : {element: record.element, item: undefined, path: undefined};
    }

    #start(event) {
        const record = this.#record(event, attrs => attrs.draggable === true);
        if (!record) return;
        this.#finish('none');
        try {
            const prepared = this.#renderer.prepareDrag(record.node, event);
            if (!prepared || !record.element.isConnected || this.#renderer.records.get(record.node) !== record) {
                event.preventDefault(); return;
            }
            const context = this.#context(record, event);
            if (!context) { event.preventDefault(); return; }
            const wires = new Map(Object.entries(prepared.dragValues).filter(([type]) => type !== 'dragTags')
                .map(([type, value]) => [type, type.startsWith('text/') ? value : toTytx(value)]));
            if (!wires.size) { event.preventDefault(); return; }
            const effectAllowed = record.resolved.effectAllowed ?? 'all';
            DragDropPolicy.acceptsEffect(effectAllowed, 'move'); // Validate the source enum, without negotiating a fallback.
            let declaredTags = '';
            for (let ancestor = record; ancestor; ancestor = ancestor.parent) {
                if (ancestor.resolved?.dragTags != null) { declaredTags = ancestor.resolved.dragTags; break; }
            }
            const session = this.#session = {record, wires, effectAllowed, phase: 'active',
                tags: [declaredTags, prepared.dragValues.dragTags].filter(Boolean).join(','),
                endTopic: this.#renderer.binding.gramlot._subscriptions.topicFor(record.node, 'endDrag'),
                source: {pageId: this.#renderer.binding.gramlot.pageId ?? null,
                    sourcePath: record.node.fullpath, itemPath: prepared.path ?? null}, preview: null, release: null};
            event.dataTransfer.clearData();
            for (const [type, wire] of wires) event.dataTransfer.setData(type, wire);
            event.dataTransfer.effectAllowed = effectAllowed;
            this.#style = this.#document.createElement('style');
            this.#style.textContent = '.canBeDropped{outline:2px solid var(--gramlot-brand-blue,#3766b5);outline-offset:-2px}'
                + '.cannotBeDropped{outline:2px dashed currentColor;outline-offset:-2px}.draggedItem{opacity:.75}';
            this.#document.head.append(this.#style);
            this.#preview(session, context.element, event.dataTransfer);
            session.release = this.#renderer.onDispose(record.node, () => this.#finish('none'));
        } catch (error) {
            event.preventDefault();
            this.#clearSession(); // A failed start emits no endDrag.
            this.#report(error);
        }
    }

    #preview(session, element, transfer) {
        const preview = element.cloneNode(true);
        preview.removeAttribute('id');
        for (const child of preview.querySelectorAll('[id]')) child.removeAttribute('id');
        preview.setAttribute('aria-hidden', 'true');
        preview.classList.add(...(session.record.resolved.dragClass ?? 'draggedItem').split(/\s+/).filter(Boolean));
        Object.assign(preview.style, {position: 'fixed', left: '-10000px', top: '0',
            width: `${element.getBoundingClientRect().width}px`, pointerEvents: 'none'});
        element.parentNode.append(preview);
        session.preview = preview;
        transfer.setDragImage(preview, 0, 0);
    }

    #target(event) {
        const session = this.#session;
        const record = this.#record(event, attrs => DragDropPolicy.isTarget(attrs));
        if (!record) return null;
        const row = this.#context(record, event);
        if (!row) return {record, element: record.element, accepted: false};
        const policy = DragDropPolicy.evaluate([...session.wires.keys()], session.tags, session.effectAllowed, record.resolved);
        const dropValues = Object.fromEntries(policy.types.map(type => [type,
            type.startsWith('text/') ? session.wires.get(type) : fromTytx(session.wires.get(type))]));
        const context = {dropValues, item: row.item, path: row.path, source: {...session.source},
            selfdrop: record === session.record, dropEffect: policy.dropEffect, dataAvailable: true};
        const accepted = policy.accepted && this.#renderer.checkDropTarget(record.node, context)
            && this.#renderer.records.get(record.node) === record && row.element.isConnected;
        return {record, element: row.element, accepted, context};
    }

    #over(event) {
        if (!this.#session) {
            if (this.#record(event, attrs => DragDropPolicy.isTarget(attrs))) {
                event.preventDefault(); event.dataTransfer.dropEffect = 'none';
            }
            return;
        }
        event.preventDefault();
        if (this.#session.phase !== 'active') { event.dataTransfer.dropEffect = 'none'; return; }
        try {
            const session = this.#session;
            const target = this.#target(event);
            if (this.#session !== session) { event.dataTransfer.dropEffect = 'none'; return; }
            event.dataTransfer.dropEffect = target?.accepted ? target.context.dropEffect : 'none';
            this.#clearFeedback();
            if (target) this.#showFeedback(target.element, target.accepted);
        } catch (error) {
            event.dataTransfer.dropEffect = 'none';
            if (this.#session) this.#session.phase = 'rejected';
            this.#clearPayload();
            this.#report(error);
        }
    }

    async #drop(event) {
        if (!this.#session) {
            if (this.#record(event, attrs => DragDropPolicy.isTarget(attrs))) event.preventDefault();
            return;
        }
        event.preventDefault();
        if (this.#session.phase !== 'active') return;
        const session = this.#session;
        try {
            const target = this.#target(event); // Revalidate using current Data and declarations.
            if (this.#session !== session) { event.dataTransfer.dropEffect = 'none'; return; }
            session.phase = 'dropped';
            this.#clearPayload();
            if (!target?.accepted) { event.dataTransfer.dropEffect = 'none'; return; }
            event.dataTransfer.dropEffect = target.context.dropEffect;
            target.record.node.publish('onDrop', target.context);
            await this.#renderer.invokeDrop(target.record.node, target.context);
        } catch (error) {
            if (this.#session === session) {
                session.phase = 'rejected';
                this.#clearPayload();
            }
            this.#report(error);
        }
    }

    #showFeedback(element, accepted) {
        const name = accepted ? 'canBeDropped' : 'cannotBeDropped';
        const parts = (element.getAttribute('part') ?? '').split(/\s+/).filter(Boolean);
        this.#feedback = {element, name, hadClass: element.classList.contains(name), hadPart: parts.includes(name)};
        element.classList.add(name);
        if (!parts.includes(name)) element.setAttribute('part', [...parts, name].join(' '));
    }

    #clearFeedback() {
        if (!this.#feedback) return;
        const {element, name, hadClass, hadPart} = this.#feedback;
        if (!hadClass) element.classList.remove(name);
        if (!hadPart) element.setAttribute('part', (element.getAttribute('part') ?? '').split(/\s+/).filter(part => part !== name).join(' '));
        this.#feedback = null;
    }

    #clearPayload() {
        this.#clearFeedback();
        if (!this.#session) return;
        this.#session.preview?.remove();
        this.#session.preview = null;
        this.#session.wires.clear();
    }

    #clearSession() {
        const session = this.#session;
        this.#clearPayload();
        this.#session = null;
        session?.release?.();
        this.#style?.remove();
        this.#style = null;
        return session;
    }

    #finish(dropEffect) {
        const session = this.#clearSession();
        if (!session || this.#renderer.disposed) return;
        void this.#renderer.endDrag(session.record.node, {source: {...session.source}, dropEffect}, session.endTopic)
            .catch(error => this.#report(error));
    }

    #report(error) { console.error('Gramlot drag/drop failed:', error); }

    dispose() {
        this.#clearSession();
        for (const name of EVENTS) this.#document.removeEventListener(name, this);
        this.#document.defaultView.removeEventListener('pagehide', this.#hide);
    }
}
