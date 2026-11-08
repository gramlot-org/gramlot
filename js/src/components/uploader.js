/** Select or drop files into a shared upload queue. */
import {Bag} from '@gramlot/gramlot';
import {defineComponent} from './registry.js';
import {Container} from './container.js';
import {UploadEngine, readUploadContext} from './upload-engine.js';

export const Uploader = defineComponent({
    name:'uploader', tag:'gramlot-uploader', base:Container, sourceContext:true,
    parameters:{operation:{dtype:'T'}, storepath:{dtype:'T'}, contextPath:{dtype:'T',nullable:true,default:null}, accept:{dtype:'T', default:'', binding:'read'},
        multiple:{dtype:'B', default:false, binding:'read'}, autoUpload:{dtype:'B', default:true, binding:'read'},
        manualUpload:{dtype:'B', default:true, binding:'read'},
        disabled:{dtype:'B', default:false, binding:'read'},
        selectedPath:{dtype:'T', nullable:true, default:null, binding:'twoWay'}, onComplete:{dtype:'T', nullable:true, default:null}},
    implementation: Base => class extends Base {
        #context; #engine; #draining = false; #previewUrl = null; #previewId = null;
        #requestedPath; #selectedPath = null;
        constructor() {
            super();
            this.control.replaceChildren();
            const doc = this.ownerDocument;
            const style = doc.createElement('style');
            style.textContent = ':host{display:block} .drop{border:1px dashed currentColor;padding:1em;display:grid;gap:.5em} ul{padding-inline-start:1.2em} button,input{font:inherit}';
            this.drop = doc.createElement('div'); this.drop.className = 'drop';
            const label = doc.createElement('label'); label.textContent = 'Choose files or drop them here ';
            this.input = doc.createElement('input'); this.input.type = 'file';
            label.append(this.input);
            this.startButton = doc.createElement('button'); this.startButton.type = 'button'; this.startButton.textContent = 'Upload';
            this.message = doc.createElement('div'); this.message.setAttribute('role','status');
            this.summary = doc.createElement('div'); this.summary.setAttribute('aria-label', 'Upload summary');
            this.summary.setAttribute('aria-live', 'polite');
            this.list = doc.createElement('ul');
            this.preview = doc.createElement('div'); this.preview.setAttribute('aria-label', 'File preview');
            this.drop.append(label, this.startButton, this.message, this.summary, this.list, this.preview); this.control.append(this.drop);
            this.shadowRoot.append(style);
            this.input.addEventListener('change', () => { this.#add(this.input.files); this.input.value = ''; });
            this.startButton.addEventListener('click', () => {
                if (this.parameters.manualUpload && !this.parameters.autoUpload) void this.#startAll();
            });
            this.drop.addEventListener('dragover', event => { if (!this.parameters?.disabled && [...event.dataTransfer.types].includes('Files')) { event.preventDefault(); event.stopPropagation(); event.dataTransfer.dropEffect = 'copy'; } });
            this.drop.addEventListener('drop', event => { if (!this.parameters?.disabled && [...event.dataTransfer.types].includes('Files')) { event.preventDefault(); event.stopPropagation(); this.#add(event.dataTransfer.files); } });
        }
        setSourceContext(context) { this.#context = context; }
        /** The queue Bag, read at the storepath address at each use; the uploader never keeps it. */
        #storeBag() {
            const store = this.#context.getStaticData(this.#context.attrDatapath('storepath'));
            if (!(store instanceof Bag)) throw new TypeError('uploader storepath must resolve to a Bag');
            return store;
        }
        projectAttributes(attrs, adapt) {
            // A new address is a new queue: the engine of the previous one ends with its selection.
            if (this.#engine && this.#engine.path !== this.#context.attrDatapath('storepath')) {
                this.#clearPreview(); this.#engine.dispose(); this.#engine = null;
                this.#selectedPath = null; this.#requestedPath = null;
                this.#context.writeParameter('selectedPath', null);
            }
            const wasReady = Boolean(this.parameters?.autoUpload && !this.parameters.disabled);
            const rest = super.projectAttributes(attrs, adapt);
            this.input.accept = this.parameters.accept || '';
            this.input.multiple = Boolean(this.parameters.multiple);
            this.input.disabled = Boolean(this.parameters.disabled);
            this.startButton.disabled = Boolean(this.parameters.disabled);
            this.startButton.hidden = Boolean(this.parameters.autoUpload || !this.parameters.manualUpload);
            if (this.parameters.selectedPath !== this.#requestedPath) {
                this.#requestedPath = this.parameters.selectedPath;
                this.#selectedPath = this.parameters.selectedPath;
            }
            this.#ensureEngine();
            if (this.#engine) this.#engine.operation = this.parameters.operation;
            this.#render();
            if (!wasReady && this.parameters.autoUpload && !this.parameters.disabled && this.#engine) {
                this.ownerDocument.defaultView.queueMicrotask(() => {
                    if (this.isConnected && this.parameters.autoUpload && !this.parameters.disabled) void this.#startAll();
                });
            }
            return rest;
        }
        #ensureEngine() {
            if (!this.#engine && this.#context && this.parameters) {
                const {gramlot, window} = this.#context.upload();
                this.#engine = new UploadEngine({gramlot, window, data:this.#context.sourceNode.data,
                    path:this.#context.attrDatapath('storepath'), operation:this.parameters.operation,
                    onChange:() => this.#render(), getContext:() => readUploadContext(this.#context.sourceNode,this.parameters.contextPath),
                    onComplete:(item, result) => this.parameters.onComplete ? this.#context.callLogic(this.parameters.onComplete, {item, result}) : null});
            }
        }
        connectedCallback() { this.#ensureEngine(); }
        disconnectedCallback() {
            // DOM relocation into a floating keeps the same Source owner and resources.
            this.ownerDocument.defaultView.queueMicrotask(() => {
                if (this.isConnected) return;
                this.#clearPreview(); this.#engine?.dispose(); this.#engine = null;
            });
        }
        #add(files) {
            if (!this.#engine || this.parameters.disabled) return;
            const selected = [...files];
            if (!this.parameters.multiple && selected.length > 1) { this.message.textContent = 'Select one file'; return; }
            const accepted = (this.parameters.accept || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
            for (const file of selected) {
                const filename = file.name.toLowerCase(), type = (file.type || '').toLowerCase();
                if (accepted.length && !accepted.some(rule => rule.startsWith('.') ? filename.endsWith(rule) :
                    rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule)) {
                    this.message.textContent = `${file.name}: file type is not accepted`; continue;
                }
                this.#engine.add(file);
            }
            if (this.parameters.autoUpload) void this.#startAll();
        }
        async #startAll() {
            if (!this.#engine || this.parameters.disabled || this.#draining) return;
            this.#draining = true;
            const engine = this.#engine;
            try {
                while (!this.parameters.disabled && this.#engine === engine) {
                    const node = engine.store.getNodes().find(item => item.value.getItem('status') === 'queued');
                    if (!node) break;
                    await engine.start(node.label);
                }
            } finally { this.#draining = false; }
        }
        #select(path) {
            this.#selectedPath = path;
            this.#requestedPath = path;
            this.#context.writeParameter('selectedPath', path);
            this.#render();
        }
        #clearPreview() {
            if (this.#previewUrl) this.ownerDocument.defaultView.URL.revokeObjectURL(this.#previewUrl);
            this.#previewUrl = null; this.#previewId = null;
            this.preview?.replaceChildren();
        }
        async #showPreview(id, file) {
            this.#clearPreview(); this.#previewId = id;
            const type = (file.type || '').toLowerCase();
            if (['image/png','image/jpeg','image/gif','image/webp'].includes(type)) {
                this.#previewUrl = this.ownerDocument.defaultView.URL.createObjectURL(file);
                const image = this.ownerDocument.createElement('img'); image.src = this.#previewUrl;
                image.alt = file.name; image.style.maxWidth = '100%'; image.style.maxHeight = '200px';
                this.preview.append(image); return;
            }
            if ((type.startsWith('text/') || file.name.toLowerCase().endsWith('.grmlt')) && file.size <= 1048576) {
                try {
                    const text = await file.text();
                    if (this.#previewId !== id || !this.isConnected) return;
                    const pre = this.ownerDocument.createElement('pre'); pre.textContent = text;
                    pre.style.maxHeight = '200px'; pre.style.overflow = 'auto'; this.preview.append(pre);
                } catch (error) { if (this.#previewId === id) this.preview.textContent = `Preview failed: ${error.message}`; }
                return;
            }
            this.preview.textContent = 'No preview available';
        }
        #render() {
            if (!this.list || !this.#context) return;
            const nodes = this.#storeBag().getNodes();
            this.list.replaceChildren();
            const counts = new Map();
            let loaded = 0, size = 0;
            for (const node of nodes) {
                const row = node.value, state = row.getItem('status');
                counts.set(state, (counts.get(state) ?? 0) + 1);
                loaded += row.getItem('loaded'); size += row.getItem('size');
            }
            this.summary.textContent = `${nodes.length} file${nodes.length === 1 ? '' : 's'} — ${loaded}/${size} bytes` +
                [...counts].map(([state, count]) => ` · ${count} ${state}`).join('');
            for (const node of nodes) {
                const row = node.value, item = this.ownerDocument.createElement('li');
                const select = this.ownerDocument.createElement('button');
                select.type = 'button'; select.textContent = row.getItem('name');
                select.disabled = Boolean(this.parameters.disabled);
                select.setAttribute('aria-pressed', String(node.label === this.#selectedPath));
                select.setAttribute('aria-label', `Select ${row.getItem('name')}`);
                select.addEventListener('click', () => {
                    this.#select(node.label);
                    const index = this.#storeBag().getNodes().findIndex(item => item.label === node.label);
                    if (index >= 0) this.list.children[index].firstElementChild.focus();
                });
                item.append(select, this.ownerDocument.createTextNode(` — ${row.getItem('status')} (${row.getItem('loaded')}/${row.getItem('size')}) `));
                const state = row.getItem('status');
                if (['preparing','uploading'].includes(state)) {
                    const button = this.ownerDocument.createElement('button'); button.textContent = 'Cancel'; button.type = 'button';
                    button.addEventListener('click', () => this.#engine.cancel(node.label)); item.append(button);
                } else if (['failed','cancelled'].includes(state)) {
                    const button = this.ownerDocument.createElement('button'); button.textContent = 'Retry'; button.type = 'button'; button.disabled = Boolean(this.parameters.disabled);
                    button.addEventListener('click', () => { this.#engine.retry(node.label); if (this.parameters.autoUpload) void this.#startAll(); }); item.append(button);
                }
                if (state === 'uncertain') {
                    const button = this.ownerDocument.createElement('button'); button.textContent = 'Check status'; button.type = 'button';
                    button.addEventListener('click', () => void this.#engine.reconcile(node.label)); item.append(button);
                }
                if (['queued','completed','failed','cancelled'].includes(state)) {
                    const file = this.#engine?.localFile(node.label);
                    if (file) {
                        const preview = this.ownerDocument.createElement('button'); preview.textContent = 'Preview'; preview.type = 'button';
                        preview.addEventListener('click', () => void this.#showPreview(node.label, file)); item.append(preview);
                    }
                    const remove = this.ownerDocument.createElement('button'); remove.textContent = 'Remove'; remove.type = 'button';
                    remove.disabled = Boolean(this.parameters.disabled);
                    remove.addEventListener('click', () => {
                        if (this.#engine.remove(node.label)) {
                            if (this.#previewId === node.label) this.#clearPreview();
                            if (this.#selectedPath === node.label) this.#select(null);
                        }
                    });
                    item.append(remove);
                }
                if (row.getItem('error')) item.append(this.ownerDocument.createTextNode(` ${row.getItem('error')}`));
                this.list.append(item);
            }
        }
    }
});
