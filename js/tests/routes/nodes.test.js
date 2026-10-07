/* nodes(): the tree of entries and instance branches.
 * Python nodes() also returns router/instance/plugin_info, callable, basepath and lazy; none of those exist in JS. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {RoutingClass, Signature, ReturnValue} from '../../src/routes/index.js';

class Child extends RoutingClass {
    childAction() { return 'child'; }
}
Child.registerRoute('childAction');

class Grandchild extends RoutingClass {
    grandchildAction() { return 'grandchild'; }
}
Grandchild.registerRoute('grandchildAction');

class Empty extends RoutingClass {}

// test_router_runtime_extras.py:229 test_router_node_and_nodes_structure
test('nodes lists the entries and omits routers when there are no branches', () => {
    const tree = new Child().route.nodes();
    assert.deepEqual(Object.keys(tree.entries), ['childAction']);
    assert.equal('routers' in tree, false);
    assert.equal(tree.name, 'route');
});

// test_router_runtime_extras.py:277 test_router_nodes_with_basepath (nested tree only; basepath is out of scope)
test('nodes expands the instance branches recursively', () => {
    class Root extends RoutingClass {
        constructor() {
            super();
            this.child = new Child();
            this.child.grandchild = new Grandchild();
            this.addBranches({name: 'child', instance: this.child});
            this.child.addBranches({name: 'grandchild', instance: this.child.grandchild});
        }
        rootAction() { return 'root'; }
    }
    Root.registerRoute('rootAction');
    const tree = new Root().route.nodes();
    assert.deepEqual(Object.keys(tree.entries), ['rootAction']);
    assert.deepEqual(Object.keys(tree.routers), ['child']);
    assert.deepEqual(Object.keys(tree.routers.child.entries), ['childAction']);
    assert.deepEqual(Object.keys(tree.routers.child.routers.grandchild.entries), ['grandchildAction']);
});

test('a branch without entries and branches is left out of routers', () => {
    class Root extends RoutingClass {
        constructor() {
            super();
            this.addBranches([{name: 'child', instance: new Child()}, {name: 'empty', instance: new Empty()}]);
        }
    }
    const tree = new Root().route.nodes();
    assert.deepEqual(Object.keys(tree.routers), ['child']);
    assert.equal('entries' in tree, false);
});

test('a router with neither entries nor branches gives an empty tree', () => {
    assert.deepEqual(new Empty().route.nodes(), {});
});

// test_router_runtime_extras.py:405 test_nodes_includes_description_and_owner_doc
test('nodes carries the description and the ownerDoc from the static docline', () => {
    class ArticleService extends RoutingClass {
        static docline = 'Service for managing articles.';
        constructor() {
            super();
            this.route.description = 'API for articles';
        }
        listArticles() { return []; }
    }
    ArticleService.registerRoute('listArticles');
    const tree = new ArticleService().route.nodes();
    assert.equal(tree.description, 'API for articles');
    assert.equal(tree.ownerDoc, 'Service for managing articles.');
});

// test_router_runtime_extras.py:425 test_nodes_description_none_when_not_set
test('description and ownerDoc are null when not set', () => {
    const tree = new Child().route.nodes();
    assert.equal(tree.description, null);
    assert.equal(tree.ownerDoc, null);
});

test('ownerDoc is not inherited from a base class docline', () => {
    class Base extends RoutingClass {
        static docline = 'Base doc.';
    }
    class Derived extends Base {
        action() { return 'x'; }
    }
    Derived.registerRoute('action');
    assert.equal(new Derived().route.nodes().ownerDoc, null);
});

test('an entry carries name, doc, parameters, meta', () => {
    class Svc extends RoutingClass {
        send() { return 'sent'; }
        ping() { return 'pong'; }
    }
    Svc.registerRoute('send', {
        signature: new Signature({to: 'T', weight: ['L', 0]}),
        docline: 'Send a message.',
        name: 'deliver',
        meta: {tag: 'mail'},
    });
    Svc.registerRoute('ping');
    const {entries} = new Svc().route.nodes();
    assert.deepEqual(entries.deliver, {
        name: 'deliver',
        doc: 'Send a message.',
        parameters: [
            {name: 'to', type: 'T', required: true, default: undefined},
            {name: 'weight', type: 'L', required: false, default: 0},
        ],
        meta: {tag: 'mail'},
    });
    assert.equal(entries.ping.doc, '');
    assert.deepEqual(entries.ping.parameters, []);
    assert.deepEqual(entries.ping.meta, {});
});

test('the parameters of the tree are copies of the declared ones', () => {
    class Svc extends RoutingClass {
        send() { return 'sent'; }
    }
    Svc.registerRoute('send', {signature: new Signature({to: 'T'})});
    new Svc().route.nodes().entries.send.parameters[0].type = 'L';
    assert.equal(new Svc().route.nodes().entries.send.parameters[0].type, 'T');
});

// test_result_description.py:134 test_media_type_surfaces_without_pydantic_plugin
test('the result block carries type, mediaType and docline of the ReturnValue', () => {
    class Svc extends RoutingClass {
        handler() { return 'x'; }
        rows() { return []; }
    }
    Svc.registerRoute('handler', {result: new ReturnValue({type: 'T', mediaType: 'text/plain', docline: 'plain text'})});
    Svc.registerRoute('rows', {result: new ReturnValue({type: {id: 'L'}})});
    const {entries} = new Svc().route.nodes();
    assert.deepEqual(entries.handler.result, {type: 'T', mediaType: 'text/plain', docline: 'plain text'});
    assert.deepEqual(entries.rows.result, {type: {id: 'L'}, mediaType: undefined, docline: undefined});
});

// test_result_description.py:116 test_result_block_absent_without_pydantic_plugin
test('the result block is absent without a ReturnValue', () => {
    class Svc extends RoutingClass {
        handler() { return 'x'; }
    }
    Svc.registerRoute('handler');
    assert.equal('result' in new Svc().route.nodes().entries.handler, false);
});
