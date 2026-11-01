/** One browser queue, independent of its presentation. Files and grants stay private. */
import {Bag} from '@gramlot/gramlot';
import {fromTytx} from '@genrojs/tytx';
import {randomId} from '../random-id.js';

/** Read the optional shared context at preparation time, independently of file fields. */
export function readUploadContext(sourceNode, path) {
    if (path === null) return {};
    const context = sourceNode.getRelativeData(path);
    if (!(context instanceof Bag)) throw new TypeError('uploader contextPath must resolve to a Bag');
    return context.asDict(false, false, true);
}

export class UploadEngine {
    #files = new Map();
    #active = new Map();
    #transfers = new Map();
    #checking = new Set();
    #closed = false;
    constructor({gramlot, window, store, operation, onComplete, onChange, getContext}) {
        if (!(store instanceof Bag)) throw new TypeError('uploader storepath must resolve to a Bag');
        Object.assign(this, {gramlot, window, store, operation, onComplete, onChange, getContext});
    }
    add(file) {
        if (this.#closed) throw new Error('Uploader is closed');
        const id = `f_${randomId().replaceAll('-', '')}`;
        this.#files.set(id, file);
        this.store.setItem(id, new Bag({name:file.name, size:file.size, mediaType:file.type || '',
            metadata:new Bag(), status:'queued', loaded:0, result:null, error:null}));
        this.onChange();
        return id;
    }
    #update(id, values) {
        if (this.#closed) return;
        const row = this.store.getItem(id);
        if (!row) return;
        for (const [key, value] of Object.entries(values)) row.setItem(key, value);
        if (!this.#closed) this.onChange();
    }
    async start(id) {
        if (this.#closed || this.#active.has(id)) return;
        const file = this.#files.get(id);
        const row = this.store.getItem(id);
        if (!file || !row || row.getItem('status') !== 'queued') return;
        if (!this.gramlot.capabilities.includes('upload')) {
            this.#update(id, {status:'failed', error:'Upload is unavailable in this environment'}); return;
        }
        const state = {xhr:null, controller:new AbortController(), transferId:null, cancelled:false};
        this.#active.set(id, state);
        this.#update(id, {status:'preparing', error:null});
        try {
            const grant = await this.gramlot.rpc.call('upload', 'prepare', {operation:this.operation,
                metadata:{name:file.name, size:file.size, mediaType:file.type || '',
                    fields:row.getItem('metadata').asDict(false, false, true), context:this.getContext()}});
            state.transferId = grant.transferId;
            this.#transfers.set(id, grant.transferId);
            if (state.cancelled || this.#closed) {
                const outcome = await this.gramlot.rpc.call('upload', 'cancel', {transferId:state.transferId});
                await this.#apply(id, outcome, true); return;
            }
            this.#update(id, {status:'uploading'});
            const result = await this.#send(file, state, grant.authorization, id);
            await this.#apply(id, result, state.cancelled);
        } catch (error) {
            if (state.transferId) {
                try {
                    const outcome = await this.gramlot.rpc.call('upload', state.cancelled ? 'cancel' : 'status',
                        {transferId:state.transferId});
                    await this.#apply(id, outcome, state.cancelled);
                } catch (recoveryError) {
                    this.#update(id, {status:'uncertain', error:recoveryError.message});
                }
            } else this.#update(id, {status:state.cancelled ? 'cancelled' : 'failed', error:error.message});
        } finally {
            this.#active.delete(id);
        }
    }
    #send(file, state, token, id) {
        if (!this.gramlot.uploadUrl) {
            return this.gramlot.rpc.transport.upload({pageId:this.gramlot.pageId, transferId:state.transferId,
                authorization:token, file}, loaded => this.#update(id, {loaded}), state.controller.signal);
        }
        return new Promise((resolve, reject) => {
            const request = state.xhr = new this.window.XMLHttpRequest();
            request.open('POST', this.gramlot.uploadUrl, true);
            request.setRequestHeader('Content-Type', 'application/octet-stream');
            request.setRequestHeader('X-Gramlot-Page-Id', this.gramlot.pageId);
            request.setRequestHeader('X-Gramlot-Transfer-Id', state.transferId);
            request.setRequestHeader('X-Gramlot-Upload-Token', token);
            request.upload.addEventListener('progress', event => this.#update(id, {loaded:event.loaded}));
            request.addEventListener('load', () => {
                if (request.status !== 200) { reject(new Error(`Upload HTTP ${request.status}`)); return; }
                try { resolve(fromTytx(request.responseText)); } catch (error) { reject(error); }
            }, {once:true});
            request.addEventListener('error', () => reject(new Error('Upload connection failed')), {once:true});
            request.addEventListener('abort', () => reject(new Error('Upload cancelled')), {once:true});
            request.send(file);
        });
    }
    async #apply(id, outcome, cancelled = false) {
        if (outcome.state === 'completed') {
            this.#update(id, {status:'completed', result:outcome.result, error:null});
            this.#files.delete(id);
            this.#transfers.delete(id);
            if (!this.#closed && this.onComplete) {
                try { await this.onComplete(this.store.getNode(id), outcome.result); }
                catch (error) { this.#update(id, {error:`Completion callback: ${error.message}`}); }
            }
        } else if (outcome.state === 'unsaved') {
            this.#transfers.delete(id);
            this.#update(id, {status:cancelled ? 'cancelled' : 'failed', error:cancelled ? null : 'Transfer was not saved'});
        } else {
            this.#update(id, {status:'uncertain', error:'Upload outcome is not yet known'});
        }
    }
    localFile(id) { return this.#files.get(id) ?? null; }
    remove(id) {
        const row = this.store.getItem(id);
        if (!row || this.#active.has(id) || !['queued', 'completed', 'failed', 'cancelled'].includes(row.getItem('status'))) return false;
        this.#files.delete(id);
        this.#transfers.delete(id);
        this.store.popNode(id);
        if (!this.#closed) this.onChange();
        return true;
    }
    async reconcile(id) {
        const transferId = this.#transfers.get(id);
        if (!transferId || this.#closed || this.#active.has(id) || this.#checking.has(id)) return;
        this.#checking.add(id);
        try {
            const outcome = await this.gramlot.rpc.call('upload', 'status', {transferId});
            await this.#apply(id, outcome);
        } catch (error) {
            this.#update(id, {status:'uncertain', error:error.message});
        } finally {
            this.#checking.delete(id);
        }
    }
    retry(id) {
        const row = this.store.getItem(id);
        if (!row || !this.#files.has(id) || !['failed', 'cancelled'].includes(row.getItem('status'))) return;
        this.#update(id, {status:'queued', loaded:0, error:null});
    }
    cancel(id) {
        const state = this.#active.get(id);
        if (!state) return;
        state.cancelled = true;
        state.controller.abort();
        state.xhr?.abort();
    }
    dispose() {
        this.#closed = true;
        for (const id of this.#active.keys()) this.cancel(id);
        this.#files.clear();
    }
}
