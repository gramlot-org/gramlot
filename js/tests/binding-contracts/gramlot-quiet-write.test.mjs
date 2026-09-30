import test from 'node:test';
import assert from 'node:assert/strict';
import {BuilderBase} from '@jsr/genro__builders';
import {GramlotBuilderBag} from '../../src/builder/source.js';

test('Bag supports a silent write through doTrigger=false', () => {
    const builder = new BuilderBase();
    const events = [];
    builder.data.subscribe('proof', {any: event => events.push(event.evt)});
    builder.data.setItem('quiet', 7, null, '>', false, true, null, false, false);
    assert.equal(builder.data.getItem('quiet'), 7);
    assert.deepEqual(events, []);
});

test('GramlotBuilderBagNode PUT implements the recovered quiet-write contract', () => {
    const builder = new BuilderBase();
    const branch = new GramlotBuilderBag(null, builder);
    builder.source.setItem('scope', branch);
    const node = branch.setItem('writer', null);
    const events = [];
    builder.data.subscribe('proof', {any: event => events.push(event.evt)});
    node.PUT('quiet', 7);
    assert.equal(node.GET('quiet'), 7);
    assert.deepEqual(events, []);
});
