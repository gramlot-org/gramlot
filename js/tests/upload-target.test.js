import test from 'node:test';
import assert from 'node:assert/strict';
import {UploadTarget} from '../src/server/index.js';

test('upload target declares a finite size limit and application operations', () => {
    for (const maxBytes of [-1, Infinity, NaN, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
        assert.throws(() => new UploadTarget({maxBytes}), TypeError);
    }
    const target = new UploadTarget({maxBytes:0});
    assert.equal(target.maxBytes, 0);
    for (const operation of ['write', 'finish', 'abort', 'status']) {
        assert.throws(() => target[operation](), /must be implemented/);
    }
});

import {UploadTransfer} from '../src/server/upload.js';

test('transfer serializes writes, finish and cancellation and preserves committed result', async () => {
    const events = [];
    class Sink extends UploadTarget {
        constructor() { super({maxBytes:2}); }
        async write(chunk) { await Promise.resolve(); events.push([...chunk]); }
        finish() { events.push('finish'); return {state:'completed', result:'stored'}; }
        abort() { events.push('abort'); return {state:'unsaved'}; }
        status() { return {state:'pending'}; }
    }
    const transfer = new UploadTransfer(new Sink(), 2);
    const results = await Promise.all([transfer.write(new Uint8Array([1,2])), transfer.finish(), transfer.abort()]);
    assert.deepEqual(events, [[1,2], 'finish']);
    assert.deepEqual(results.slice(1), [{state:'completed',result:'stored'}, {state:'completed',result:'stored'}]);
});

test('uncertain writes can only be reconciled via the application target', async () => {
    class Sink extends UploadTarget {
        constructor() { super({maxBytes:1}); }
        write() { throw new Error('disk failure'); }
        finish() { return {state:'completed',result:null}; }
        abort() { return {state:'unsaved'}; }
        status() { return {state:'pending'}; }
    }
    const transfer = new UploadTransfer(new Sink(), 1);
    await assert.rejects(transfer.write(new Uint8Array([1])), /disk failure/);
    await assert.rejects(transfer.write(new Uint8Array([1])), /not writable/);
    assert.deepEqual(await transfer.status(), {state:'pending'});
    assert.deepEqual(await transfer.abort(), {state:'unsaved'});
});

test('transfer enforces target limit and exact declared byte count', async () => {
    class Sink extends UploadTarget { constructor() { super({maxBytes:2}); } write() {} }
    assert.throws(() => new UploadTransfer(new Sink(), 3), RangeError);
    const transfer = new UploadTransfer(new Sink(), 2);
    await assert.rejects(transfer.write(new Uint8Array(3)), RangeError);
    await transfer.write(new Uint8Array(1));
    await assert.rejects(transfer.finish(), RangeError);
});


test('completed outcome retention starts at completion', async () => {
    const {UploadRegistry} = await import('../src/server/upload.js');
    class Sink extends UploadTarget {
        constructor() { super({maxBytes:0}); }
        finish() { return {state:'completed',result:'saved'}; }
        abort() { return {state:'unsaved'}; }
    }
    const registry = new UploadRegistry({retention:30000});
    const grant = await registry.prepare({pageId:'page',owner:'owner',operation:'save',target:new Sink(),size:0});
    const record = registry.record(grant.transferId,'page','owner');
    const transfer = registry.admit(grant.transferId,'page','owner',grant.authorization);
    record.expires = performance.now() - 1;
    await transfer.finish();
    await registry.expire();
    assert.deepEqual(await registry.record(grant.transferId,'page','owner').transfer.status(), {state:'completed',result:'saved'});
    record.expires = performance.now() - 1;
    await registry.expire();
    assert.throws(() => registry.record(grant.transferId,'page','owner'), /Unknown/);
});

test('completion racing with expiry retains its outcome', async () => {
    const {UploadRegistry} = await import('../src/server/upload.js');
    let started, proceed;
    const entered = new Promise(resolve => { started = resolve; });
    class Slow extends UploadTarget {
        constructor() { super({maxBytes:0}); }
        async finish() { started(); await new Promise(resolve => { proceed = resolve; }); return {state:'completed',result:'saved'}; }
        abort() { return {state:'unsaved'}; }
    }
    const registry = new UploadRegistry({retention:30000});
    const grant = await registry.prepare({pageId:'page',owner:'owner',operation:'save',target:new Slow(),size:0});
    const record = registry.record(grant.transferId,'page','owner');
    const transfer = registry.admit(grant.transferId,'page','owner',grant.authorization);
    const finishing = transfer.finish(); await entered;
    record.expires = performance.now() - 1;
    const expiring = registry.expire();
    proceed(); await Promise.all([finishing,expiring]);
    assert.deepEqual(await registry.record(grant.transferId,'page','owner').transfer.status(), {state:'completed',result:'saved'});
});

test('uncertain finish retains its recovery window', async () => {
    const {UploadRegistry} = await import('../src/server/upload.js');
    class Sink extends UploadTarget {
        constructor() { super({maxBytes:0}); }
        finish() { throw new Error('outcome lost'); }
        status() { return {state:'completed',result:'saved'}; }
        abort() { return {state:'completed',result:'saved'}; }
    }
    const registry = new UploadRegistry({retention:30000});
    const grant = await registry.prepare({pageId:'page',owner:'owner',operation:'save',target:new Sink(),size:0});
    const record = registry.record(grant.transferId,'page','owner');
    const transfer = registry.admit(grant.transferId,'page','owner',grant.authorization);
    record.expires = performance.now() - 1;
    await assert.rejects(transfer.finish(), /outcome lost/);
    await registry.expire();
    assert.deepEqual(await registry.record(grant.transferId,'page','owner').transfer.status(), {state:'completed',result:'saved'});
});


test('active transfer activity renews the recovery window', async () => {
    const {UploadRegistry} = await import('../src/server/upload.js');
    class Sink extends UploadTarget { constructor() { super({maxBytes:1}); } write() {} abort() { return {state:'unsaved'}; } }
    const registry = new UploadRegistry({retention:30000});
    const grant = await registry.prepare({pageId:'page',owner:null,operation:'save',target:new Sink(),size:1});
    const record = registry.record(grant.transferId,'page',null);
    record.expires = performance.now() - 1;
    const transfer = registry.admit(grant.transferId,'page',null,grant.authorization);
    assert.ok(record.expires > performance.now());
    record.expires = performance.now() - 1;
    await transfer.write(new Uint8Array([1]));
    registry.touch(grant.transferId,'page',null);
    await registry.expire();
    assert.equal(registry.record(grant.transferId,'page',null),record);
});
