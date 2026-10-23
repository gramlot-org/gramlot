import {GramlotBuilder} from '../builder/gramlot-builder.js';
import {randomId} from '../random-id.js';

const SPEC_KEYS = new Set(['title', 'msg', 'fields', '_if', 'askIf']);
const FIELD_KEYS = new Set(['name', 'lbl', 'tag', 'type', 'default_value', 'required', 'min', 'max', 'step', 'placeholder']);

/**
 * A bounded native dialog authored through Source/Data and named Logic. One instance per page, owned by
 * its BindingRuntime (`runtime.askDialog`): the `ask_<id>` Logic group, registered at the first dialog, and
 * the dialogs open.
 */
export class AskDialog {
    #runtime;
    // The name of the Logic group of the dialogs, null before the first one.
    #group = null;
    // The open dialogs by id: `{finish(confirmed)}`.
    #requests = new Map();

    constructor(runtime) {
        this.#runtime = runtime;
    }

    get runtime() { return this.#runtime; }

    /** Whether the ask `specification` of `binding` asks now, with `parameters` for its conditions. */
    required(binding, specification, parameters, attribute) {
        const evaluate = (name, code) => typeof code === 'boolean' ? code
            : binding.runtime.inlineCompiler.compile(binding.node, name, code,
                Object.keys(parameters), `return (${code});`)(parameters);
        if (typeof specification === 'string') {
            const condition = binding.node.getAttr('_ask_if');
            return !condition || Boolean(evaluate('_ask_if', condition));
        }
        // Legacy askIf alone does not suppress the prompt; askOn/skipOn are not ported.
        if (specification?.askIf) evaluate(`${attribute}.askIf`, specification.askIf);
        return !specification?._if || Boolean(evaluate(`${attribute}._if`, specification._if));
    }

    /** Show the dialog of `specification`; resolves with the values of its fields, or null when cancelled. */
    show(binding, specification, parameters, title = 'Parameters') {
        const spec = typeof specification === 'string' ? {msg: specification, title} : specification;
        if (!spec || typeof spec !== 'object' || Array.isArray(spec)) throw new TypeError('ask requires text or a parameter description');
        for (const key of Object.keys(spec)) {
            if (!SPEC_KEYS.has(key)) throw new Error(`Unsupported ask option: ${key}`);
        }
        const fields = spec.fields ?? [];
        if (!Array.isArray(fields)) throw new TypeError('ask fields must be an array');
        const names = new Set();
        for (const field of fields) {
            if (!field || !/^[A-Za-z_]\w*$/.test(field.name) || names.has(field.name)) throw new Error('ask fields require distinct simple names');
            names.add(field.name);
            for (const key of Object.keys(field)) {
                if (!FIELD_KEYS.has(key)) throw new Error(`Unsupported ask field option: ${key}`);
            }
            if (field.tag && !['input', 'textarea'].includes(field.tag)) throw new Error(`Unsupported ask widget: ${field.tag}`);
            if (field.type && !['text', 'number', 'date', 'checkbox', 'email', 'password', 'url', 'tel'].includes(field.type)) {
                throw new Error(`Unsupported ask input type: ${field.type}`);
            }
        }
        const app = this.runtime.gramlot;
        const group = this.#logicGroup();
        const requests = this.#requests;
        return new Promise((resolve, reject) => {
            const id = `ask_${randomId()}`;
            let finished = false;
            let release = () => {};
            const finish = (confirmed, failure = null) => {
                if (finished) return;
                finished = true;
                const result = confirmed ? Object.fromEntries(fields.map(field =>
                    [field.name, app.data.getItem(`${id}.${field.name}`)])) : null;
                requests.delete(id);
                release();
                try {
                    app.src.source.popNode(id);
                    if (app.data.getNode(id)) app.data.popNode(id);
                    if (failure) reject(failure);
                    else resolve(result);
                } catch (error) { reject(error); }
            };
            requests.set(id, {finish});
            release = binding.track(() => finish(false));
            try {
                const builder = new GramlotBuilder();
                const dialog = builder.root.html_dialog({nodeId: id, datapath: id, request: id,
                    connect_oncancel: `${group}.cancel`, connect_onclose: `${group}.cancel`,
                    class: 'gramlot-ask', 'aria-labelledby': `${id}_title`,
                    style: 'border:1px solid #aab4c2;border-radius:8px;padding:16px;max-width:32rem;width:calc(100% - 48px);font:inherit;'});
                dialog.h2(spec.title ?? title, {id: `${id}_title`, style: 'font-size:1.1em;margin:0 0 12px;'});
                if (spec.msg) dialog.p(spec.msg);
                const form = dialog.form({request: id, connect_onsubmit: `${group}.confirm`});
                for (const field of fields) {
                    form.dataSetter({destination_path: `.${field.name}`,
                        value: Object.hasOwn(parameters, field.name) ? parameters[field.name]
                            : field.default_value ?? (field.type === 'checkbox' ? false : '')});
                    const row = form.div({style: 'margin:8px 0;'});
                    row.html_label(field.lbl ?? field.name, {for: `${id}_${field.name}`, style: 'display:block;margin-bottom:4px;'});
                    const attrs = {id: `${id}_${field.name}`, value: `^.${field.name}`, live: true};
                    for (const key of ['required', 'min', 'max', 'step', 'placeholder']) {
                        if (field[key] !== undefined) attrs[key] = field[key];
                    }
                    if (field.tag === 'textarea') row.textarea(attrs);
                    else row.input({...attrs, type: field.type ?? 'text'});
                }
                const buttons = form.div({style: 'display:flex;justify-content:flex-end;gap:8px;margin-top:16px;'});
                buttons.html_button('Cancel', {type: 'button', request: id, connect_onclick: `${group}.cancel`});
                buttons.html_button('Confirm', {type: 'submit', autofocus: fields.length === 0});
                app.src.source.setItem(id, app.src.prepareSource(builder.source));
                const node = app.src.binding.nodeIds.get(id);
                app.dom.getDomNode(node).showModal();
            } catch (error) {
                finish(false, error);
            }
        });
    }

    /** The name of the Logic group whose `confirm` and `cancel` close the dialogs, registered once. */
    #logicGroup() {
        if (this.#group === null) {
            const group = `ask_${randomId()}`;
            const requests = this.#requests;
            class Logic {
                confirm(node, event) { event.preventDefault(); requests.get(node.getAttr('request'))?.finish(true); }
                cancel(node, event) { event.preventDefault(); requests.get(node.getAttr('request'))?.finish(false); }
            }
            this.runtime.logicRegistry.register(Logic, {group, resource: 'gramlot:ask'});
            this.#group = group;
        }
        return this.#group;
    }
}
