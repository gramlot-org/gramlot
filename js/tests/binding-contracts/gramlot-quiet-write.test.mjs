import test from 'node:test';
import assert from 'node:assert/strict';
import {BuilderBase} from '@jsr/genro__builders';

test('Bag supports a silent write through doTrigger=false', () => {
    const builder = new BuilderBase();
    const events = [];
    builder.data.subscribe('proof', {any: event => events.push(event.evt)});
    builder.data.setItem('quiet', 7, null, '>', false, true, null, false, false);
    assert.equal(builder.data.getItem('quiet'), 7);
    assert.deepEqual(events, []);
});

test('SourceNode PUT should implement the recovered quiet-write contract', () => {
    const builder = new BuilderBase();
    const node = builder.source.setItem('writer', null);
    const events = [];
    builder.data.subscribe('proof', {any: event => events.push(event.evt)});
    node.PUT('quiet', 7);
    assert.equal(node.GET('quiet'), 7);
    assert.deepEqual(events, []);
});
