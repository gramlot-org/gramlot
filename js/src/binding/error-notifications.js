import {GramlotBuilder} from '../builder/gramlot-builder.js';
import {randomId} from '../random-id.js';
import {sourceTarget} from '@genrojs/builders';

/** Source-authored nonmodal errors, owned by one BindingRuntime. */
export class ErrorNotifications {
    #runtime;
    #id = `errors_${randomId()}`;
    #group = null;
    #notices = new Map();
    #dismissed = new Set();
    #overflowCount = 0;
    constructor(runtime) { this.#runtime = runtime; }

    show(error, title) {
        const seen = new Set(), details = [];
        for (let current = error; current !== null && typeof current === 'object' && !seen.has(current); current = current.cause) {
            if (current.name === 'AbortError') return;
            seen.add(current);
            details.push(current.stack ?? current.message);
        }
        const message = typeof error?.message === 'string' ? error.message : String(error);
        queueMicrotask(() => {
            if (this.#runtime.disposed) return;
            this.#show(message, title, details.join('\nCaused by:\n'));
        });
    }

    #show(message, title, details) {
        const app = this.#runtime.gramlot, key = JSON.stringify([title, message]);
        if (this.#dismissed.has(key)) return;
        let panel = this.#runtime.nodeIds.get(this.#id);
        if (!panel) {
            this.#notices.clear();
            this.#overflowCount = 0;
            if (this.#group === null) {
                const notices = this;
                class Logic { close(node) { notices.#close(node.getAttr('notice')); } }
                this.#group = `errors_${randomId()}`;
                this.#runtime.logicRegistry.register(Logic, {group:this.#group, resource:'gramlot:error-notifications'});
            }
            const builder = new GramlotBuilder();
            builder.root.aside({nodeId:this.#id, class:'gramlot-error-notifications', popover:'manual',
                'aria-label':'Error notifications',
                style:'position:fixed;inset:auto max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) auto;margin:0;width:360px;max-width:calc(100vw - 24px);max-height:50vh;overflow:auto;box-sizing:border-box;padding:0;border:1px solid var(--gramlot-border-control,#aab4c2);border-radius:8px;background:var(--gramlot-surface,#fff);color:var(--gramlot-ink,#222);font:13px/1.4 system-ui;box-shadow:0 6px 24px #0003;'});
            app.src.source.setItem(this.#id, app.src.prepareSource(builder.source));
            panel = this.#runtime.nodeIds.get(this.#id);
        }
        if (this.#notices.has(key)) return;
        if (this.#notices.size === 5) {
            const text = `${++this.#overflowCount} additional errors`;
            const counter = panel.value.getNode('overflow');
            if (counter) counter.setValue(text);
            else app.src.builder.wrapSource(panel).p(text, {node_label:'overflow', role:'status', style:'margin:0;padding:12px;'});
            return;
        }
        const id = `notice_${randomId()}`;
        // Prepared constant expressions preserve arbitrary diagnostic text without reading or writing application Data.
        const fragment = new GramlotBuilder();
        const notice = fragment.root.article({ role:'alert', style:'color:inherit;padding:12px;border-bottom:1px solid var(--gramlot-border,#ddd);'});
        const header = notice.div({style:'display:flex;align-items:start;gap:12px;'});
        header.strong(`==${JSON.stringify(title)}`, {style:'flex:1;color:var(--gramlot-error,#b13d48);'});
        header.html_button('×', {type:'button', notice:id, connect_onclick:`${this.#group}.close`,
            'aria-label':'Dismiss notification', title:'Dismiss notification',
            style:'border:0;background:transparent;color:inherit;font:18px/1 system-ui;width:24px;height:24px;flex:0 0 24px;padding:0;cursor:pointer;'});
        notice.p(`==${JSON.stringify(message)}`, {style:'margin:6px 0;overflow-wrap:anywhere;'});
        const disclosure = notice.details({style:'border:0;padding:0;margin:8px 0 0;background:transparent;'});
        disclosure.summary('Details', {style:'cursor:pointer;'});
        disclosure.pre(`==${JSON.stringify(details)}`, {style:'font:11px/1.4 monospace;white-space:pre-wrap;overflow-wrap:anywhere;margin:6px 0 0;padding:8px;border:0;border-radius:4px;background:var(--gramlot-surface-subtle,#f2f4f6);'});
        const slot = app.src.builder.wrapSource(panel).div({node_label:id});
        sourceTarget(slot).setValue(app.src.prepareSource(fragment.source));
        this.#notices.set(key, id);
        app.dom.getDomNode(panel).showPopover();
    }

    #close(id) {
        const panel = this.#runtime.nodeIds.get(this.#id);
        panel.value.popNode(id);
        for (const [key, value] of this.#notices) if (value === id) { this.#notices.delete(key); this.#dismissed.add(key); }
        if (!this.#notices.size) {
            this.#runtime.gramlot.src.source.popNode(this.#id);
        }
    }
}
