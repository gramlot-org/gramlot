/* Router: instance branches, best-match path resolution, default entry.
 * Python genro-routes calls a node with node(); the JS routes call it with node.call(kw). */
import test from 'node:test';
import assert from 'node:assert/strict';
import {RoutingClass, Signature, NotFound} from '../../src/routes/index.js';

class AdminService extends RoutingClass {
    index(kw) { return `admin.index: ${kw.itemId}`; }
    users() { return 'admin.users'; }
}
AdminService.registerRoute('index', {signature: new Signature({itemId: ['T', null]})});
AdminService.registerRoute('users');

class RootService extends RoutingClass {
    constructor() {
        super();
        this.admin = new AdminService();
        this.addBranches({name: 'admin', instance: this.admin});
    }
    index(kw) { return `root.index${kw._extraPath ? `: ${kw._extraPath}` : ''}`; }
    action(kw) { return `root.action: ${kw.x}, ${kw.y}`; }
}
RootService.registerRoute('index');
RootService.registerRoute('action', {signature: new Signature({x: 'T', y: 'T'})});

class Child extends RoutingClass {
    ping() { return 'pong'; }
}
Child.registerRoute('ping');

// test_node_resolution.py:59 test_empty_path_uses_default_entry, :64 test_empty_path_with_slash
test('an empty path resolves to the default entry', () => {
    const root = new RootService();
    assert.equal(root.route.node('').call(), 'root.index');
    assert.equal(root.route.node('/').call(), 'root.index');
});

// test_node_resolution.py:69 test_entry_found_with_partial
test('an entry consumes the remaining segments as parameters', () => {
    assert.equal(new RootService().route.node('action/1/2').call(), 'root.action: 1, 2');
});

// test_node_resolution.py:74 test_child_router_uses_its_default_entry
test('a path ending on a child router resolves to its default entry', () => {
    assert.equal(new RootService().route.node('admin').call(), 'admin.index: null');
});

// test_node_resolution.py:79 test_head_not_entry_not_child_uses_default
test('a head that is neither entry nor child falls back to the default entry', () => {
    assert.equal(new RootService().route.node('admin/zuz').call(), 'admin.index: zuz');
});

// test_node_resolution.py:88 test_entry_found_and_partial_valid
test('an entry with fitting segments has no error', () => {
    const node = new RootService().route.node('action/a/b');
    assert.equal(node.error, null);
    assert.equal(node.call(), 'root.action: a, b');
});

// test_node_resolution.py:94 test_entry_not_found, :101 test_too_many_args_for_signature
// Python: segments beyond the parameters make the node not_found. JS: they join into _extraPath.
test('segments beyond the parameters reach the entry as _extraPath', () => {
    const root = new RootService();
    assert.equal(root.route.node('zuz').call(), 'root.index: zuz');
    assert.equal(root.route.node('zuz/orders/new').call(), 'root.index: zuz/orders/new');
    const node = root.route.node('action/1/2/3');
    assert.equal(node.error, null);
    assert.equal(node.call(), 'root.action: 1, 2');
});

// test_node_resolution.py:107 test_no_default_entry_defined
test('a router without the default entry gives a not_found node', () => {
    class NoDefaultService extends RoutingClass {
        onlyAction() { return 'only'; }
    }
    NoDefaultService.registerRoute('onlyAction');
    const node = new NoDefaultService().route.node('nonexistent');
    assert.equal(node.error, 'not_found');
    assert.throws(() => node.call(), NotFound);
});

// test_router_basic.py:342 test_default_entry_is_index_by_default
test('defaultEntry is index by default', () => {
    assert.equal(new Child().route.defaultEntry, 'index');
});

// test_router_basic.py:353 test_default_entry_can_be_customized
test('defaultEntry can be customized', () => {
    class Service extends RoutingClass {
        constructor() {
            super();
            this.route.defaultEntry = 'handle';
        }
        handle() { return 'handle'; }
    }
    Service.registerRoute('handle');
    const svc = new Service();
    assert.equal(svc.route.defaultEntry, 'handle');
    assert.equal(svc.route.node('').call(), 'handle');
});

// test_router_basic.py:367 test_leading_slash_is_stripped
test('a leading slash is stripped', () => {
    class Service extends RoutingClass {
        action() { return 'action result'; }
    }
    Service.registerRoute('action');
    const svc = new Service();
    assert.equal(svc.route.node('action').call(), 'action result');
    assert.equal(svc.route.node('/action').call(), 'action result');
});

// test_router_basic.py:381 test_leading_slash_with_hierarchy, :194 test_dotted_path_and_nodes_with_attached_child
test('a path walks through an instance branch', () => {
    class Root extends RoutingClass {
        constructor() {
            super();
            this.child = new Child();
            this.addBranches({name: 'child', instance: this.child});
        }
    }
    const root = new Root();
    assert.equal(root.route.node('child/ping').call(), 'pong');
    assert.equal(root.route.node('/child/ping').call(), 'pong');
});

// test_router_edge_cases.py:335 test_instance_branch_via_add_branches, test_lazy_branches.py:161 test_instance_branch_built_immediately
test('addBranches on the router links an already-built instance', () => {
    class Parent extends RoutingClass {}
    const parent = new Parent();
    const child = new Child();
    parent.route.addBranches({name: 'child', instance: child});
    assert.equal(parent.route.node('child/ping').call(), 'pong');
});

test('addBranches accepts an array and any iterable of specs', () => {
    class Parent extends RoutingClass {}
    const parent = new Parent();
    parent.addBranches([{name: 'a', instance: new Child()}]);
    parent.addBranches(new Set([{name: 'b', instance: new Child()}]));
    parent.addBranches((function* () { yield {name: 'c', instance: new Child()}; })());
    for (const name of ['a', 'b', 'c']) assert.equal(parent.route.node(`${name}/ping`).call(), 'pong');
});

// test_router_edge_cases.py:238 test_instance_branch_name_collision
test('a duplicate branch name is a TypeError', () => {
    class Parent extends RoutingClass {}
    const parent = new Parent();
    parent.addBranches({name: 'sales', instance: new Child()});
    assert.throws(() => parent.addBranches({name: 'sales', instance: new Child()}), TypeError);
});

// test_router_edge_cases.py:278 test_instance_branch_requires_routing_class
test('a branch instance must be a RoutingClass', () => {
    class Parent extends RoutingClass {}
    const parent = new Parent();
    assert.throws(() => parent.addBranches({name: 'x', instance: {}}), TypeError);
    assert.throws(() => parent.addBranches({name: 'x', instance: null}), TypeError);
});

// test_lazy_branches.py:757 test_instance_form_rejects_params, :768 test_instance_and_cls_mutually_exclusive
test('only the {name, instance} form is accepted', () => {
    class Parent extends RoutingClass {}
    const parent = new Parent();
    assert.throws(() => parent.addBranches({name: 'x', instance: new Child(), params: {}}), TypeError);
    assert.throws(() => parent.addBranches({name: 'x', instance: new Child(), cls: Child}), TypeError);
    assert.throws(() => parent.addBranches({name: 'x', cls: Child, params: {}}), TypeError);
    assert.throws(() => parent.addBranches({name: 1, instance: new Child()}), TypeError);
});

// test_router_edge_cases.py:313 test_instance_branch_rejects_other_parent_when_already_bound, test_lazy_branches.py:779 test_instance_already_bound_rejected
test('an instance bound to another parent is rejected', () => {
    class Parent extends RoutingClass {}
    const first = new Parent();
    const second = new Parent();
    const child = new Child();
    first.addBranches({name: 'child', instance: child});
    assert.ok(first.route.node('child'));
    assert.throws(() => second.addBranches({name: 'child', instance: child}), /already bound/);
    first.addBranches({name: 'again', instance: child});
    assert.equal(first.route.node('again/ping').call(), 'pong');
});

// test_lazy_branches.py:509 test_branch_name_collision_with_branch_raises, :519 ..._with_materialized_child_raises
test('a branch name collides with an existing branch after it was traversed', () => {
    class Parent extends RoutingClass {}
    const parent = new Parent();
    parent.addBranches({name: 'beta', instance: new Child()});
    assert.equal(parent.route.node('beta/ping').call(), 'pong');
    assert.throws(() => parent.addBranches({name: 'beta', instance: new Child()}), /collision/);
});

// test_lazy_branches.py:284 test_nodes_instance_branch_is_fully_expanded, :796 test_instance_not_in_branches_view (resolution part)
test('an instance branch is a live child reached through the parent', () => {
    class Gamma extends RoutingClass {
        ping() { return 'gamma.ping:gamma'; }
    }
    Gamma.registerRoute('ping');
    const gamma = new Gamma();
    class Alfa extends RoutingClass {
        constructor() {
            super();
            this.addBranches({name: 'gamma', instance: gamma});
        }
    }
    assert.equal(new Alfa().route.node('gamma/ping').call(), 'gamma.ping:gamma');
});

test('a branch that is the owner or one of its ancestors is refused', () => {
    const a = new Child();
    const b = new Child();
    assert.throws(() => a.addBranches({name: 'me', instance: a}), Error);
    a.addBranches({name: 'b', instance: b});
    assert.throws(() => b.addBranches({name: 'a', instance: a}), Error);
    assert.deepEqual(Object.keys(a.route.nodes().routers), ['b']);
});
