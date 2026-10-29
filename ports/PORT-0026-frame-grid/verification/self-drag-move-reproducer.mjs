import assert from 'node:assert/strict';
import {Bag} from '../../../js/src/index.js';
const bag = new Bag();
for (const key of ['a','b','c']) bag.setItem(key, null, {caption:key});
const snapshots = [];
bag.subscribe('move-observer', {any:event => snapshots.push({
    event:event.evt, order:bag.getNodes().map(node=>node.label)
})});
const moved = bag.getNode('a');
bag.move(0,2);
assert.equal(bag.getNode('a'), moved);
console.log(JSON.stringify(snapshots, null, 2));
assert.deepEqual(snapshots, [
    {event:'del',order:['b','c']},
    {event:'ins',order:['b','c','a']}
]);
// This confirms the current behavior, not the missing movement contract.
