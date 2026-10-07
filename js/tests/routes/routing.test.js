/* registerRoute and RoutingClass: marker, direct-call validation, prototype-walk discovery, per-instance router.
 * Python genro-routes marks with @route; the JS routes call registerRoute after the class body. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {RoutingClass, Router, Signature, ReturnValue} from '../../src/routes/index.js';

const entryNames = instance => [...instance.route.entries.keys()].sort();
const run = (instance, name, kw = {}) => instance.route.entries.get(name).original.call(instance, kw);

// test_router_basic.py:219 test_route_without_args_uses_single_router
test('registerRoute without options registers the method under its own name', () => {
    class Table extends RoutingClass {
        add(kw) { return `added:${kw.data ?? ''}`; }
        get(kw) { return `got:${kw.key ?? ''}`; }
    }
    Table.registerRoute('add');
    Table.registerRoute('get');
    const table = new Table();
    assert.deepEqual(entryNames(table), ['add', 'get']);
    assert.equal(run(table, 'add'), 'added:');
    assert.equal(table.add({}), 'added:');
});

// test_router_basic.py:236 test_route_with_custom_entry_name
test('name overrides the entry name', () => {
    class Table extends RoutingClass {
        addRecord(kw) { return `added:${kw.data}`; }
    }
    Table.registerRoute('addRecord', {name: 'customAdd', signature: new Signature({data: 'T'})});
    const table = new Table();
    assert.deepEqual(entryNames(table), ['customAdd']);
    assert.equal(table.route.entries.get('customAdd').name, 'customAdd');
    assert.equal(table.addRecord({data: 'x'}), 'added:x');
});

// test_router_basic.py:249 test_route_inheritance_with_single_router
test('a subclass inherits the routes of its base', () => {
    class BaseTable extends RoutingClass {
        list() { return 'baseList'; }
    }
    BaseTable.registerRoute('list');
    class ExtendedTable extends BaseTable {
        add() { return 'extendedAdd'; }
    }
    ExtendedTable.registerRoute('add');
    const table = new ExtendedTable();
    assert.deepEqual(entryNames(table), ['add', 'list']);
    assert.equal(run(table, 'list'), 'baseList');
    assert.equal(run(table, 'add'), 'extendedAdd');
});

// test_router_runtime_extras.py:193 test_iter_marked_methods_deduplicate_same_function
// Python dedupes duplicate markers; the JS routes refuse the second marker (genro-routes #71)
test('registerRoute applied twice to the same method raises TypeError', () => {
    class Service extends RoutingClass {
        original() { return 'ok'; }
    }
    Service.registerRoute('original');
    assert.throws(() => Service.registerRoute('original'), {
        name: 'TypeError',
        message: "registerRoute applied twice to 'original'",
    });
    assert.deepEqual(entryNames(new Service()), ['original']);
});

// test_router_runtime_extras.py:202 test_mro_override_derived_wins
test('a marked override in the derived class wins over the base', () => {
    class Base extends RoutingClass {
        index() { return 'BASE'; }
    }
    Base.registerRoute('index');
    class Derived extends Base {
        index() { return 'DERIVED'; }
    }
    Derived.registerRoute('index');
    const derived = new Derived();
    assert.equal(run(derived, 'index'), 'DERIVED');
    assert.deepEqual(entryNames(derived), ['index']);
});

test('an unmarked override hides the marked base method', () => {
    class Base extends RoutingClass {
        index() { return 'BASE'; }
        other() { return 'other'; }
    }
    Base.registerRoute('index');
    Base.registerRoute('other');
    class Derived extends Base {
        index() { return 'plain'; }
    }
    assert.deepEqual(entryNames(new Derived()), ['other']);
});

test('a derived entry name wins over a base method registered under the same entry name', () => {
    class Base extends RoutingClass {
        first() { return 'base'; }
    }
    Base.registerRoute('first', {name: 'shared'});
    class Derived extends Base {
        second() { return 'derived'; }
    }
    Derived.registerRoute('second', {name: 'shared'});
    assert.equal(run(new Derived(), 'shared'), 'derived');
});

// test_router_edge_cases.py:183 test_router_detects_handler_name_collision
test('two methods of one class with the same entry name raise an Error', () => {
    class Duplicate extends RoutingClass {
        first() { return 'one'; }
        second() { return 'two'; }
    }
    Duplicate.registerRoute('first', {name: 'dup'});
    Duplicate.registerRoute('second', {name: 'dup'});
    assert.throws(() => new Duplicate().route, /handler name collision: 'dup'/);
});

// test_router_edge_cases.py:153 test_route_decorator_metadata_preserved
test('the marker keeps signature, docline, result and meta', () => {
    const signature = new Signature({email: 'T'});
    const result = new ReturnValue({type: 'T', mediaType: 'text/plain'});
    class Host extends RoutingClass {
        hello() { return 'hi'; }
    }
    Host.registerRoute('hello', {signature, docline: 'Say hi.', result, meta: {coreValue: 123}});
    const marker = new Host().route.entries.get('hello');
    assert.equal(marker.signature, signature);
    assert.equal(marker.docline, 'Say hi.');
    assert.equal(marker.result, result);
    assert.deepEqual(marker.meta, {coreValue: 123});
    assert.equal(typeof marker.original, 'function');
});

test('without options the signature has no parameters and meta is empty', () => {
    class Host extends RoutingClass {
        hello() { return 'hi'; }
    }
    Host.registerRoute('hello');
    const marker = new Host().route.entries.get('hello');
    assert.deepEqual(marker.signature.parameters, []);
    assert.deepEqual(marker.meta, {});
    assert.equal(marker.docline, undefined);
    assert.equal(marker.result, undefined);
});

test('a direct call is validated and receives the bound object', () => {
    class Service extends RoutingClass {
        sendMail(kw) { return kw; }
    }
    Service.registerRoute('sendMail', {signature: new Signature({to: 'T', copies: ['L', 1]})});
    const service = new Service();
    assert.deepEqual(service.sendMail({to: 'a@b.it'}), {to: 'a@b.it', copies: 1});
    assert.throws(() => service.sendMail({}), {name: 'TypeError', message: /missing required parameter 'to'/});
    assert.throws(() => service.sendMail({to: 'a', other: 1}), {name: 'TypeError', message: /unknown parameter/});
    assert.throws(() => service.sendMail({to: 7}), {name: 'TypeError', message: /not a valid 'T' value/});
    assert.deepEqual(service.sendMail({to: 'a', _extraPath: 'x'}), {to: 'a', copies: 1, _extraPath: 'x'});
});

test('the wrapper keeps `this` and an async method stays async', async () => {
    class Service extends RoutingClass {
        label = 'svc';
        async fetch(kw) { return `${this.label}:${kw.id}`; }
    }
    Service.registerRoute('fetch', {signature: new Signature({id: 'L'})});
    const pending = new Service().fetch({id: 4});
    assert.ok(pending instanceof Promise);
    assert.equal(await pending, 'svc:4');
});

test('registerRoute needs an own method of the class', () => {
    class Base extends RoutingClass {
        inherited() { return 1; }
    }
    class Derived extends Base {
        field = 3;
    }
    assert.throws(() => Derived.registerRoute('inherited'), {name: 'TypeError', message: /not a method of Derived/});
    assert.throws(() => Derived.registerRoute('missing'), {name: 'TypeError'});
    assert.throws(() => Derived.registerRoute('field'), {name: 'TypeError'});
});

test('route is created on first access, one per instance', () => {
    class Service extends RoutingClass {
        ping() { return 'pong'; }
    }
    Service.registerRoute('ping');
    const first = new Service();
    const second = new Service();
    assert.ok(first.route instanceof Router);
    assert.equal(first.route, first.route);
    assert.notEqual(first.route, second.route);
    assert.equal(first.route.instance, first);
});
