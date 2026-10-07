/* RouterNode: segment decoding with ::code, _extraPath, call(kw), errors, metadata, async handlers. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {isDecimal} from '@genrojs/tytx';
import {RoutingClass, Signature, ReturnValue, NotFound} from '../../src/routes/index.js';

class SignatureError extends Error {
    constructor(selector, options) {
        super(selector, options);
        this.selector = selector;
    }
}

class TypedService extends RoutingClass {
    concat(kw) { return `${kw.text}:${kw.number}`; }
    brokenType(kw) { throw new TypeError(`body failure for ${kw.text}`); }
    brokenValue(kw) { throw new RangeError(`body failure for ${kw.text}`); }
    echo(kw) { return kw; }
}
TypedService.registerRoute('concat', {signature: new Signature({text: 'T', number: ['L', 1]})});
TypedService.registerRoute('brokenType', {signature: new Signature({text: 'T'})});
TypedService.registerRoute('brokenValue', {signature: new Signature({text: 'T'})});
TypedService.registerRoute('echo', {signature: new Signature({
    t: ['T', null], l: ['L', null], r: ['R', null], n: ['N', null], b: ['B', null],
    d: ['D', null], dhz: ['DHZ', null], h: ['H', null],
})});

const mapped = () => {
    const svc = new TypedService();
    svc.route.errors.signature_error = SignatureError;
    return svc;
};

test('each segment is decoded with the TYTX code of its parameter', () => {
    const node = name => new TypedService().route.node(`echo/${name}`).call();
    assert.equal(node('abc').t, 'abc');
    assert.equal(node('-/2026').l, 2026);
    assert.equal(node('-/1/1.5').r, 1.5);
    assert.ok(isDecimal(node('-/1/1/1.50').n));
    assert.equal(node('-/1/1/1/true').b, true);
    assert.equal(node('-/1/1/1/true/2026-10-07').d.toISOString().slice(0, 10), '2026-10-07');
    assert.equal(node('-/1/1/1/true/2026-10-07/2026-10-07T10:00:00Z').dhz.toISOString(), '2026-10-07T10:00:00.000Z');
    assert.ok(node('-/1/1/1/true/2026-10-07/2026-10-07T10:00:00Z/10:30:00').h instanceof Date);
});

test('a segment its code does not decode makes the node not_found', () => {
    const svc = new TypedService();
    for (const path of ['echo/x/abc', 'echo/x/1/abc', 'echo/x/1/1/abc', 'echo/x/1/1/1/true/abc', 'echo/x/1/1/1/true/2026-10-07/2026-10-07T10:00:00Z/abc']) {
        const node = svc.route.node(path);
        assert.equal(node.error, 'not_found', path);
        assert.throws(() => node.call(), NotFound, path);
    }
});

test('_extraPath is present only when segments are left over', () => {
    const svc = new TypedService();
    assert.equal(Object.hasOwn(svc.route.node('echo/a/1/1/1/true/2026-10-07/2026-10-07T10:00:00Z/10:30:00').call(), '_extraPath'), false);
    assert.equal(Object.hasOwn(svc.route.node('echo').call(), '_extraPath'), false);
    const kw = svc.route.node('echo/a/1/1/1/true/2026-10-07/2026-10-07T10:00:00Z/10:30:00/orders/new').call();
    assert.equal(kw._extraPath, 'orders/new');
});

test('_extraPath is refused in kw and on a direct call', () => {
    const svc = new TypedService();
    assert.throws(() => svc.echo({_extraPath: 'a/b'}), TypeError);
    assert.throws(() => svc.route.node('echo').call({_extraPath: 'a/b'}), TypeError);
});

// router_node.py:270 RouterNode.__call__: kwargs that conflict with path arguments are ignored - path wins
test('segment values win over kw and kw values are never converted', () => {
    const svc = new TypedService();
    assert.equal(svc.route.node('concat/a').call({number: 7}), 'a:7');
    assert.equal(svc.route.node('concat/a/2').call({text: 'b'}), 'a:2');
    assert.throws(() => svc.route.node('concat/a').call({number: '7'}), TypeError);
});

// test_error_codes.py:140 test_missing_required_argument_is_plain_typeerror_when_unmapped
test('a call that does not fit the signature is a plain TypeError when unmapped', () => {
    assert.throws(() => new TypedService().route.node('concat').call(), TypeError);
});

// test_error_codes.py:153 test_signature_error_selector_carries_router_and_path
test('a mapped signature_error carries the router name and path as selector', () => {
    assert.throws(
        () => mapped().route.node('concat').call({text: 'a', nope: 1}),
        err => err instanceof SignatureError && err.selector === 'route:concat' && err.cause instanceof TypeError,
    );
});

// test_error_codes.py:194 test_body_typeerror_propagates_even_when_both_codes_are_mapped
test('a TypeError from the handler body propagates untouched', () => {
    assert.throws(() => mapped().route.node('brokenType').call({text: 'a'}), {name: 'TypeError', message: 'body failure for a'});
});

// test_error_codes.py:200 test_body_valueerror_propagates_untouched
test('any other error from the handler body propagates untouched', () => {
    assert.throws(() => mapped().route.node('brokenValue').call({text: 'a'}), {name: 'RangeError', message: 'body failure for a'});
});

test('a not_found node raises the class mapped in router.errors with its selector', () => {
    const svc = new TypedService();
    assert.throws(() => svc.route.node('nope').call(), err => err instanceof NotFound && err.selector === 'route');
    class Missing extends Error {}
    svc.route.errors.not_found = Missing;
    assert.throws(() => svc.route.node('nope').call(), Missing);
});

test('metadata exposes name, docline, meta and result of the entry', () => {
    class Service extends RoutingClass {
        list() { return []; }
    }
    const result = new ReturnValue({type: 'T'});
    Service.registerRoute('list', {name: 'items', docline: 'List items', meta: {tag: 'x'}, result});
    const node = new Service().route.node('items');
    assert.deepEqual(node.metadata, {name: 'items', docline: 'List items', meta: {tag: 'x'}, result});
    assert.deepEqual(new Service().route.node('nope').metadata, {});
});

class Api extends RoutingClass {
    alfa() { return 'sync'; }
    async beta() { return 'async'; }
    async item(kw) { return `item=${kw.itemId}`; }
    async brokenType(kw) { throw new TypeError(`body failure for ${kw.text}`); }
}
Api.registerRoute('alfa');
Api.registerRoute('beta');
Api.registerRoute('item', {signature: new Signature({itemId: 'L'})});
Api.registerRoute('brokenType', {signature: new Signature({text: 'T'})});

// test_async_nodes.py:46 test_sync_node_is_not_coroutine
test('a sync handler returns its value', () => {
    assert.equal(new Api().route.node('alfa').call(), 'sync');
});

// test_async_nodes.py:52 test_async_node_is_coroutine
test('an async handler returns its Promise', async () => {
    const result = new Api().route.node('beta').call();
    assert.ok(result instanceof Promise);
    assert.equal(await result, 'async');
});

// test_async_nodes.py:73 test_async_node_with_path_segment
test('an async handler receives its segment values', async () => {
    assert.equal(await new Api().route.node('item/42').call(), 'item=42');
});

// test_async_nodes.py:82 test_not_found_node_is_not_coroutine
test('a not_found node raises synchronously', () => {
    assert.throws(() => new Api().route.node('nope').call(), NotFound);
});

// test_async_nodes.py:87 test_async_child_node_classified_through_hierarchy
test('an async handler is reached through a branch', async () => {
    class Child extends RoutingClass {
        async ping() { return 'pong'; }
    }
    Child.registerRoute('ping');
    class Parent extends RoutingClass {
        constructor() {
            super();
            this.addBranches({name: 'child', instance: new Child()});
        }
    }
    assert.equal(await new Parent().route.node('child/ping').call(), 'pong');
});

// test_error_codes.py:207 test_async_body_typeerror_surfaces_at_await_not_at_call
test('an async body TypeError surfaces at await, not at call', async () => {
    const promise = new Api().route.node('brokenType').call({text: 'a'});
    await assert.rejects(promise, {name: 'TypeError', message: 'body failure for a'});
});

test('a segment out of the text form of its code makes the node not_found', () => {
    const svc = new TypedService();
    const valid = ['a', '1', '1', '1', 'true', '2026-01-15', '2026-01-15T10:00:00Z', '10:30:00'];
    const invalid = [null, '1.5', 'x', '1x', 'yes', '15-01-2026', '2026-01-15', '10:30'];
    assert.equal(svc.route.node(`echo/${valid.join('/')}`).error, null);
    invalid.forEach((segment, index) => {
        if (segment === null) return;
        const path = `echo/${[...valid.slice(0, index), segment].join('/')}`;
        assert.equal(svc.route.node(path).error, 'not_found', path);
    });
    assert.equal(svc.route.node('echo/a/x').error, 'not_found');
    assert.equal(svc.route.node('echo/a/-12').call().l, -12);
});

// router_node.py: errors= of node() applies to the whole path
test('the errors of the router node() is called on apply to a path ending in a branch', () => {
    class Parent extends RoutingClass {}
    const parent = new Parent();
    parent.addBranches({name: 'child', instance: new TypedService()});
    class Missing extends Error {}
    parent.route.errors.not_found = Missing;
    parent.route.errors.signature_error = SignatureError;
    assert.throws(() => parent.route.node('child/nope/x').call(), Missing);
    assert.throws(() => parent.route.node('child/concat').call(), SignatureError);
});
