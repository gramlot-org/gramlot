import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@jsr/genro__bag';
import {toTytx, fromTytx} from '@jsr/genro__tytx';
import {BuilderBase} from '@jsr/genro__builders';

test('observed root activates prebuilt nested Bags without builder assistance', () => {
    const root = new Bag();
    root.setBackref();
    const events = [];
    root.subscribe('contract', {any: event => events.push(event)});
    const incoming = new Bag(), children = new Bag();
    children.setItem('span', new Bag());
    incoming.setItem('div', children);
    root.setItem('main', incoming);
    assert.equal(events.length, 1);
    events.length = 0;
    children.setItem('second', new Bag());
    children.getNode('span').setAttr({title: 'changed'});
    children.popNode('second');
    assert.deepEqual(events.map(event => event.evt), ['ins', 'upd_attrs', 'del']);
    assert.equal(children.parentNode, incoming.getNode('div'));
    assert.equal(children.parent, incoming);
    const replacement = new Bag(), nested = new Bag();
    replacement.setItem('nested', nested);
    incoming.getNode('div').setValue(replacement);
    events.length = 0;
    nested.setItem('deep', new Bag());
    assert.equal(events.length, 1);
    assert.equal(events[0].node.label, 'deep');
    assert.deepEqual(events[0].pathlist, ['main', 'div', 'nested']);
});

test('doTrigger=false keeps insert, update and attribute writes silent', () => {
    const data = new Bag();
    data.setBackref();
    const events = [];
    data.subscribe('contract', {any: event => events.push(event.evt)});
    data.setItem('a', 1, null, '>', false, true, null, false, false);
    data.setItem('a', 2, null, '>', false, true, null, false, false);
    data.setItem('a', 2, {k: 1}, '>', false, true, null, false, false);
    data.setItem('a?k', 5, null, '>', false, true, null, false, false);
    assert.equal(data.getItem('a'), 2);
    assert.deepEqual(data.getNode('a').getAttr(), {k: 5});
    assert.deepEqual(events, []);
});

test('Builder PUT emits an event; fired writes emit only on a changed value, then reset silently', () => {
    const builder = new BuilderBase();
    const node = builder.source.setItem('writer', null);
    const events = [];
    builder.data.subscribe('contract', {any: event => events.push([event.evt, event.node.label])});
    node.PUT('quiet', 7);
    assert.deepEqual(events, [['ins', 'quiet']]);
    events.length = 0;
    node.FIRE('shot');
    assert.deepEqual(events, [['ins', 'shot']]);
    assert.equal(node.GET('shot'), null);
    node.FIRE('shot');
    assert.deepEqual(events, [['ins', 'shot'], ['upd_value', 'shot']]);
    assert.equal(node.GET('shot'), null);
    events.length = 0;
    node.SET('steady', 3);
    events.length = 0;
    node.FIRE('steady', 3);
    assert.deepEqual(events, []);
    assert.equal(node.GET('steady'), null);
});

test('BagNode.setAttr turns the attribute event reason into a string; value events keep it', () => {
    const data = new Bag();
    data.setBackref();
    data.setItem('a', 1);
    const events = [];
    data.subscribe('contract', {any: event => events.push([event.evt, event.reason])});
    const node = data.getNode('a');
    const origin = {origin: true};
    node.setAttr({x: 1});
    node.setAttr({x: 2}, 'user');
    node.setAttr({x: 3}, origin);
    data.setItem('a?x', 4, null, '>', false, true, origin);
    data.setItem('a', 9, {x: 5}, '>', true, true, origin);
    data.setItem('a', 10, null, '>', false, true, origin);
    assert.deepEqual(events, [
        ['upd_attrs', 'true'], ['upd_attrs', 'user'], ['upd_attrs', '[object Object]'],
        ['upd_attrs', 'true'], ['upd_value_attr', origin], ['upd_value', origin],
    ]);
});

test('Bag.fromTytx drops null attributes that the wire carries', () => {
    const bag = new Bag();
    bag.setItem('x', 1, {keep: 1}).setAttr({gone: null}, false, true, false);
    assert.deepEqual(bag.getNode('x').getAttr(), {keep: 1, gone: null});
    const wire = toTytx(bag);
    assert.match(wire, /"gone":null/);
    assert.deepEqual(fromTytx(wire).getNode('x').getAttr(), {keep: 1});
});

test('the builder Data Bag mounts under an outer main without copy and reports main-prefixed paths', () => {
    const builder = new BuilderBase();
    const root = new Bag();
    root.setBackref();
    root.setItem('main', builder.data);
    assert.equal(root.getItem('main'), builder.data);
    assert.equal(builder.data.parent, root);
    assert.equal(builder.data.parentNode, root.getNode('main'));
    const events = [];
    root.subscribe('contract', {any: event => events.push([event.evt, event.pathlist.join('.'), event.node.label])});
    const node = builder.source.setItem('writer', null);
    node.SET('x', 1);
    node.SET('x', 2);
    node.SET('box.y', 3);
    builder.data.getNode('x').setAttr({caption: 'X'});
    builder.data.popNode('x');
    assert.deepEqual(events, [
        ['ins', 'main', 'x'], ['upd_value', 'main.x', 'x'], ['ins', 'main', 'box'],
        ['ins', 'main.box', 'y'], ['upd_attrs', 'main.x', 'x'], ['del', 'main', 'x'],
    ]);
});
