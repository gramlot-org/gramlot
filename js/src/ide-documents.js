import {Bag} from '@genrojs/bag';
import {randomId} from './random-id.js';

/** UTF-8 identity is safe in Bag paths and keeps distinct roots/files distinct. */
export const documentKey = (root, path) => 'd_' + [...new TextEncoder().encode(JSON.stringify([root,path]))]
    .map(byte => byte.toString(16).padStart(2,'0')).join('');

/** Source-owned document requests; drafts and saved baselines are relative Data. */
export class IdeDocuments {
    constructor(gramlot, source) {
        this.gramlot = gramlot; this.source = source;
        this.pending = new Map(); this.disposed = false;
    }
    get state() { return this.source.getRelativeData('.'); }
    get documents() { return this.state.getItem('documents'); }
    async open(root, path) {
        const key = documentKey(root, path);
        const existing = this.documents.getNodes().find(node => !node.value.getItem('isNew') && node.value.getItem('root') === root && node.value.getItem('path') === path);
        if (existing) return existing.label;
        if (this.pending.has(key)) return this.pending.get(key).promise;
        const request = new AbortController();
        const promise = this.gramlot.rpc.call('data', 'document_read', {root,path}, {signal:request.signal}).then(result => {
            if (this.disposed || request.signal.aborted) return null;
            const document = new Bag();
            for (const [name,value] of Object.entries({...result, root, saved:result.content, busy:false})) document.setItem(name,value);
            this.documents.setItem(key, document);
            return key;
        }).finally(() => this.pending.delete(key));
        this.pending.set(key,{request,promise});
        return promise;
    }
    newDocument(language, extension, root = '') {
        const key = `new_${randomId()}`;
        const doc = new Bag();
        for (const [name,value] of Object.entries({language, root, path:`Untitled${extension}`,
            content:'', saved:'', writable:true, busy:false, isNew:true, createHidden:true,
            saveRoot:root, savePath:`Untitled${extension}`})) doc.setItem(name,value);
        this.documents.setItem(key,doc);
        return key;
    }
    async create(key) {
        const doc = this.documents.getItem(key);
        if (!doc || !doc.getItem('isNew') || !doc.getItem('writable') || this.pending.has(key)) return false;
        const root = doc.getItem('saveRoot'), path = doc.getItem('savePath');
        if (doc.getItem('path').endsWith('.typ.py') !== path.endsWith('.typ.py')) {
            throw new Error('The .typ.py extension is required for the Typst Python recipe document type.');
        }
        const content = doc.getItem('content'), request = new AbortController();
        doc.setItem('busy',true);
        const promise = this.gramlot.rpc.call('data','document_create',{root,path,content},
            {signal:request.signal}).then(result => {
            if (this.disposed || request.signal.aborted) return false;
            doc.setItem('root',result.root);
            doc.setItem('path',result.path);
            doc.setItem('revision',result.revision);
            doc.setItem('saved',content);
            doc.setItem('isNew',false);
            doc.setItem('createHidden',true);
            return true;
        }).finally(() => { this.pending.delete(key); if (!this.disposed) doc.setItem('busy',false); });
        this.pending.set(key,{request,promise});
        return promise;
    }
    invalidateRecipe(key) {
        const doc = this.documents.getItem(key);
        if (!doc.getItem('path').endsWith('.typ.py')) return;
        if (doc.getItem('rendering')) this.pending.get(key)?.request.abort();
        doc.setItem('previewHidden',true);
        doc.setItem('typstSource','');
        doc.setItem('renderStatus','Generate preview to render the current Python recipe.');
    }
    async renderRecipe(key) {
        const doc = this.documents.getItem(key);
        if (!doc || !doc.getItem('path').endsWith('.typ.py') || !doc.getItem('writable') || this.pending.has(key)) return false;
        const content = doc.getItem('content'), request = new AbortController();
        doc.setItem('busy',true);
        doc.setItem('rendering',true);
        doc.setItem('previewHidden',true);
        doc.setItem('typstSource','');
        doc.setItem('renderStatus','Generating Typst on the server…');
        const promise = this.gramlot.rpc.call('data','document_render_typst',{content},
            {signal:request.signal}).then(result => {
            if (this.disposed || request.signal.aborted || doc.getItem('content') !== content) return false;
            doc.setItem('typstSource',result.source);
            doc.setItem('previewHidden',false);
            doc.setItem('renderStatus','Typst generated from the current recipe.');
            return true;
        }).catch(error => {
            if (!this.disposed && !request.signal.aborted) doc.setItem('renderStatus',error.message);
            return false;
        }).finally(() => {
            this.pending.delete(key);
            if (!this.disposed) { doc.setItem('rendering',false); doc.setItem('busy',false); }
        });
        this.pending.set(key,{request,promise});
        return promise;
    }
    dirty(key) {
        const doc = this.documents.getItem(key);
        return doc && doc.getItem('content') !== doc.getItem('saved');
    }
    async save(key) {
        const doc = this.documents.getItem(key);
        if (!doc || doc.getItem('isNew') || !this.dirty(key) || !doc.getItem('writable') || this.pending.has(key)) return false;
        const content = doc.getItem('content'), request = new AbortController();
        doc.setItem('busy',true);
        const promise = this.gramlot.rpc.call('data','document_save', {
            root:doc.getItem('root'), path:doc.getItem('path'), content, revision:doc.getItem('revision')
        }, {signal:request.signal}).then(result => {
            if (this.disposed || request.signal.aborted) return false;
            doc.setItem('revision',result.revision);
            doc.setItem('saved',content);
            return true;
        }).finally(() => { this.pending.delete(key); if (!this.disposed) doc.setItem('busy',false); });
        this.pending.set(key,{request,promise});
        return promise;
    }
    revert(key) {
        const doc = this.documents.getItem(key);
        if (!doc || !this.dirty(key) || this.pending.has(key)) return false;
        doc.setItem('content',doc.getItem('saved'));
        return true;
    }
    canClose(key, discard = false) {
        return !this.pending.has(key) && (discard || !this.dirty(key));
    }
    close(key, discard = false) {
        if (!this.canClose(key,discard)) return false;
        this.documents.popNode(key);
        if (this.state.getItem('active') === key) this.state.setItem('active',this.documents.getNodes()[0]?.label ?? null);
        return true;
    }
    dispose() { this.disposed = true; for (const {request} of this.pending.values()) request.abort(); }
}

/** Preferences only: six successfully opened roots, never document content. */
export class RecentWorkspaces {
    constructor(storage) { this.storage = storage; this.key = 'gramlot.ide.recentWorkspaces'; }
    read() {
        const stored = this.storage.getItem(this.key);
        const roots = stored === null ? [] : JSON.parse(stored);
        if (!Array.isArray(roots) || roots.some(root => typeof root !== 'string' || !root)) throw new TypeError('Invalid recent workspace preference');
        return roots.slice(0,6);
    }
    remember(root) {
        const roots = [root, ...this.read().filter(item => item !== root)].slice(0,6);
        this.storage.setItem(this.key,JSON.stringify(roots));
        return roots;
    }
    choices(roots = this.read()) {
        const bag = new Bag();
        roots.forEach((root,index) => bag.setItem(`r${index}`,root,{caption:root}));
        return bag;
    }
}
