// Phase S16: counters with two fixtures. Both pages hold the same active branch on `active`; they differ only
// in the number of branches bound to other Data paths (unconnected to the path written). One write on the
// active path must cost the same work on both pages: same router candidates, same deliveries, same DOM
// mutations, same Data trace. The standing counters (registrations, bindings, records, elements) grow with
// the unconnected branches, and they are recorded to show that the two fixtures really differ.
import test from 'node:test';
import assert from 'node:assert/strict';
import {DataRegistration} from '../src/binding/router.js';
import {authored, counters, page} from './fixtures/lifecycle.js';

/** The active branch: an input, a text and a formula with its own text, on `active.x`. */
function activeBranch(root) {
    const pane = root.div({id: 'active', datapath: 'active'});
    pane.input({id: 'x', value: '^.x'});
    pane.span('^.x', {id: 'x-text'});
    pane.dataFormula({result_path: '.y', formula: 'x * 2', x: '^.x'});
    pane.span('^.y', {id: 'y-text'});
}

/** One unconnected branch: the same shape as the active branch, on `far.b<n>`. */
function farBranch(root, n) {
    const pane = root.div({datapath: `far.b${n}`});
    pane.input({value: '^.x'});
    pane.span('^.x');
    pane.dataFormula({result_path: '.y', formula: 'x * 2', x: '^.x'});
    pane.span('^.y');
}

/** A started page with the active branch and `far` unconnected branches. */
function fixture(t, far) {
    const ctx = page(t);
    ctx.app.src.startSource(authored(root => {
        activeBranch(root);
        for (let n = 0; n < far; n++) farBranch(root, n);
    }));
    return ctx;
}

/** Count the reads of a DataRegistration getter while `run` executes. */
function countReads(name, run) {
    const descriptor = Object.getOwnPropertyDescriptor(DataRegistration.prototype, name);
    let reads = 0;
    Object.defineProperty(DataRegistration.prototype, name, {
        configurable: true, get() { reads += 1; return descriptor.get.call(this); },
    });
    try { run(); } finally { Object.defineProperty(DataRegistration.prototype, name, descriptor); }
    return reads;
}

/** The work of one write on `active.x`: router candidates, deliveries, DOM mutations, Data trace. */
function writeWork(ctx, value) {
    const {window, document, data, trace} = ctx;
    const observer = new window.MutationObserver(() => {});
    observer.observe(document.querySelector('main'), {subtree: true, childList: true, attributes: true,
        characterData: true});
    trace.length = 0;
    let deliveries = 0;
    const candidates = countReads('attr', () => {
        deliveries = countReads('recipient', () => data.setItem('active.x', value));
    });
    const mutations = observer.takeRecords().map(record => `${record.type}:${record.target.nodeName}`);
    observer.disconnect();
    return {candidates, deliveries, mutations, trace: [...trace]};
}

/** Standing counters and the work of two writes on a page with `far` unconnected branches. */
function measure(t, far) {
    const ctx = fixture(t, far);
    const standing = counters(ctx);
    const writes = [3, 4].map(value => {
        const work = writeWork(ctx, value);
        assert.equal(ctx.byId('x').value, String(value));
        assert.equal(ctx.byId('x-text').textContent, String(value));
        assert.equal(ctx.byId('y-text').textContent, String(value * 2));
        return work;
    });
    ctx.app.dispose();
    return {standing, writes};
}

test('S16 counters: one write on the active path costs the same with 1 and with 200 unconnected branches', async t => {
    // Each page runs in its own subtest: the lifecycle fixture takes the virtual clock of its test.
    const results = {};
    for (const far of [1, 200]) await t.test(`${far} unconnected`, st => { results[far] = measure(st, far); });
    const [small, large] = [results[1], results[200]];
    // The fixtures differ: every standing counter bound to a branch grows with the unconnected branches.
    for (const key of ['bindings', 'registrations', 'records', 'elements']) {
        assert.ok(large.standing[key] > small.standing[key], `${key}: ${small.standing[key]} < ${large.standing[key]}`);
    }
    assert.deepEqual(large.writes, small.writes);
    for (const work of small.writes) {
        assert.ok(work.deliveries > 0);
        assert.ok(work.mutations.length > 0);
    }
    t.diagnostic(`per write: ${JSON.stringify(small.writes)}`);
    t.diagnostic(`standing, 1 branch: ${JSON.stringify(small.standing)}`);
    t.diagnostic(`standing, 200 branches: ${JSON.stringify(large.standing)}`);
});
