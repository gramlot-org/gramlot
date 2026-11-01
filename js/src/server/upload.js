/** Application-owned destination for a single upload. */
export class UploadTarget {
    constructor({maxBytes}) {
        if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) {
            throw new TypeError('maxBytes must be a nonnegative safe integer');
        }
        this.maxBytes = maxBytes;
    }
    write(chunk) { throw new Error('UploadTarget.write must be implemented'); }
    finish() { throw new Error('UploadTarget.finish must be implemented'); }
    abort() { throw new Error('UploadTarget.abort must be implemented'); }
    status() { throw new Error('UploadTarget.status must be implemented'); }
}

import {toTytx} from '@genrojs/tytx';

function checkedOutcome(value) {
    if (value === null || typeof value !== 'object' || Object.getPrototypeOf(value) !== Object.prototype ||
        !['completed', 'unsaved', 'pending', 'uncertain'].includes(value.state)) {
        throw new TypeError('Invalid upload outcome');
    }
    const keys = Object.keys(value).sort().join(',');
    if (keys !== (value.state === 'completed' ? 'result,state' : 'state')) {
        throw new TypeError('Invalid upload outcome fields');
    }
    if (value.state === 'completed') toTytx(value.result);
    return {...value};
}

/** A serialized operation on an application-owned upload target. */
export class UploadTransfer {
    #tail = Promise.resolve();
    #state = {state:'pending'};
    #received = 0;
    #sealed = false;
    constructor(target, size, onOutcome = null) {
        if (!(target instanceof UploadTarget)) throw new TypeError('Upload operation must return an UploadTarget');
        if (!Number.isSafeInteger(size) || size < 0 || size > target.maxBytes) throw new RangeError('Invalid upload size');
        this.target = target;
        this.size = size;
        this.onOutcome = onOutcome;
    }
    #run(action) {
        const current = this.#tail.then(action);
        this.#tail = current.catch(() => {});
        return current;
    }
    #record(outcome) { this.#state = checkedOutcome(outcome); if (this.#state.state === 'completed') this.onOutcome?.(); return {...this.#state}; }
    #terminal() { return ['completed', 'unsaved'].includes(this.#state.state); }
    write(chunk) {
        return this.#run(async () => {
            if (!(chunk instanceof Uint8Array)) throw new TypeError('Upload chunks must be Uint8Array');
            if (this.#state.state !== 'pending' || this.#sealed) throw new Error('Upload is not writable');
            if (this.#received + chunk.byteLength > this.size) throw new RangeError('Upload exceeds declared size');
            try { await this.target.write(chunk); }
            catch (error) { this.#state = {state:'uncertain'}; this.#sealed = true; this.onOutcome?.(); throw error; }
            this.#received += chunk.byteLength;
        });
    }
    finish() {
        return this.#run(async () => {
            if (this.#state.state !== 'pending' || this.#sealed) throw new Error('Upload cannot be finished');
            if (this.#received !== this.size) throw new RangeError('Upload size does not match declaration');
            this.#sealed = true;
            try { return this.#record(await this.target.finish()); }
            catch (error) { this.#state = {state:'uncertain'}; this.onOutcome?.(); throw error; }
        });
    }
    abort() {
        return this.#run(async () => {
            if (this.#terminal()) return {...this.#state};
            this.#sealed = true;
            try { return this.#record(await this.target.abort()); }
            catch (error) { this.#state = {state:'uncertain'}; throw error; }
        });
    }
    status() {
        return this.#run(async () => {
            if (this.#terminal()) return {...this.#state};
            try { return this.#record(await this.target.status()); }
            catch (error) { this.#state = {state:'uncertain'}; throw error; }
        });
    }
}

/** Private server registry: grants are one-use and bound to a page and its owner. */
export class UploadRegistry {
    constructor({capacity = 1000, grantTtl = 300000, retention = 1800000} = {}) {
        this.records = new Map();
        Object.assign(this, {capacity, grantTtl, retention});
    }
    async expire() {
        const now = performance.now();
        for (const [id, record] of this.records) {
            if (record.expires <= now || (!record.started && record.grantExpires <= now)) {
                const expires = record.expires;
                try { await record.transfer.abort(); } catch {} // The outcome can remain uncertain.
                if (record.expires === expires) this.records.delete(id);
            }
        }
    }
    async prepare({pageId, owner, operation, target, size}) {
        await this.expire();
        if (this.records.size >= this.capacity) throw new Error('Upload registry capacity reached');
        const transferId = crypto.randomUUID();
        const transfer = new UploadTransfer(target, size, () => {
            const record = this.records.get(transferId);
            if (record) record.expires = performance.now() + this.retention;
        });
        const authorization = crypto.randomUUID() + crypto.randomUUID();
        const now = performance.now();
        this.records.set(transferId, {pageId, owner, operation, transfer, authorization,
            started:false, grantExpires:now + this.grantTtl, expires:now + this.retention});
        return {transferId, authorization};
    }
    record(transferId, pageId, owner) {
        const record = this.records.get(transferId);
        if (!record || record.pageId !== pageId || record.owner !== owner) throw new Error('Unknown or unauthorized upload');
        return record;
    }
    admit(transferId, pageId, owner, authorization) {
        const record = this.record(transferId, pageId, owner);
        if (record.started || record.grantExpires <= performance.now() || record.authorization !== authorization) {
            throw new Error('Invalid upload authorization');
        }
        record.started = true;
        record.authorization = null;
        record.expires = performance.now() + this.retention;
        return record.transfer;
    }
    touch(transferId, pageId, owner) {
        this.record(transferId, pageId, owner).expires = performance.now() + this.retention;
    }
    async closePage(pageId, owner) {
        for (const [id, record] of this.records) {
            if (record.pageId === pageId && record.owner === owner) {
                this.records.delete(id);
                try { await record.transfer.abort(); } catch {} // The page can no longer query this outcome.
            }
        }
    }
}
