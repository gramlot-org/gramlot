import test from 'node:test';
import assert from 'node:assert/strict';
import {DragDropPolicy as Policy} from '../src/renderer/drag-drop-policy.js';

test('target enablement preserves callback candidacy even with explicit dropTarget false', () => {
    assert.equal(Policy.isTarget({}), false);
    assert.equal(Policy.isTarget({dropTarget: false}), false);
    assert.equal(Policy.isTarget({dropTarget: true}), true);
    assert.equal(Policy.isTarget({dropTarget: false, dropTargetCb: 'canReceive'}), true);
    assert.equal(Policy.isTarget({dropTargetCb_nodeattr: 'canReceiveNode'}), true);
    assert.equal(Policy.isTarget({onDrop_nodeattr: 'receiveNode'}), false);
});

test('whole-type wildcard matching does not inherit regex or substring behavior', () => {
    const types = ['text/plain', 'application/text/plain', 'text/html', 'app/record', 'app/record.v1', 'app/recordXv1'];
    assert.deepEqual(Policy.acceptedTypes(types, 'text/plain'), ['text/plain']);
    assert.deepEqual(Policy.acceptedTypes(types, 'text/*, app/*.v1'), ['text/plain', 'text/html', 'app/record.v1']);
    assert.deepEqual(Policy.acceptedTypes(types, 'app/record.v1'), ['app/record.v1']);
    assert.deepEqual(Policy.acceptedTypes(['app/a+b', 'app/ab', 'app/[a]', 'app/a'], 'app/a+b,app/[a]'), ['app/a+b', 'app/[a]']);
    assert.deepEqual(Policy.acceptedTypes(['app/a/b/c', 'app/a/x'], 'app/*/b/*'), ['app/a/b/c']);
});

test('typed handlers add exact accepted types and reserved dragTags never becomes payload', () => {
    assert.deepEqual(Policy.acceptedTypes(['nodeattr', 'treenode', 'text/plain'], '', ['nodeattr']), ['nodeattr']);
    assert.deepEqual(Policy.acceptedTypes(['nodeattr'], '', ['node*']), []);
    assert.deepEqual(Policy.acceptedTypes(['text/plain', 'dragTags'], '*', ['dragTags']), ['text/plain']);
    assert.deepEqual(Policy.acceptedTypes(['nodeattr']), []);
});

test('tag filters combine exact alternatives, conjunction and negation', () => {
    assert.equal(Policy.acceptsTags('documenti,archivio', 'documenti AND archivio'), true);
    assert.equal(Policy.acceptsTags('documenti,archivio', 'immagini,documenti AND !bloccato'), true);
    assert.equal(Policy.acceptsTags('documenti,bloccato', 'documenti AND !bloccato'), false);
    assert.equal(Policy.acceptsTags('documenti', 'document'), false);
    assert.equal(Policy.acceptsTags('documenti', 'Documenti'), false);
    assert.equal(Policy.acceptsTags('documenti', 'documenti AND archivio'), false);
});

test('an active tag filter rejects an untagged source, including a negative-only filter', () => {
    assert.equal(Policy.acceptsTags('', '!bloccato'), false);
    assert.equal(Policy.acceptsTags('', 'documenti'), false);
    assert.equal(Policy.acceptsTags('', ''), true);
    assert.equal(Policy.acceptsTags('documenti', ''), true);
});

test('effect restrictions are intersected without substituting a different effect', () => {
    const permitted = {
        all: ['copy', 'move', 'link'], none: [], copy: ['copy'], move: ['move'], link: ['link'],
        copyMove: ['copy', 'move'], copyLink: ['copy', 'link'], linkMove: ['link', 'move']
    };
    for (const [source, effects] of Object.entries(permitted)) {
        for (const target of ['copy', 'move', 'link']) {
            assert.equal(Policy.acceptsEffect(source, target), effects.includes(target), `${source} / ${target}`);
        }
    }
    assert.equal(Policy.acceptsEffect(), true);
    assert.equal(Policy.acceptsEffect('copy'), false);
    assert.throws(() => Policy.acceptsEffect('uninitialized'), /Invalid effectAllowed/);
    assert.throws(() => Policy.acceptsEffect('all', 'none'), /Invalid dropEffect/);
});

test('enabled targets need a matching type even when tags and effects pass', () => {
    assert.deepEqual(Policy.evaluate(['treenode'], 'documenti', 'all', {dropTarget: true}),
        {accepted: false, types: [], dropEffect: 'none'});
    assert.equal(Policy.evaluate(['treenode'], '', 'all', {dropTargetCb_treenode: 'canReceive'}).accepted, false);
});

test('eligibility combines types, tags and effects and returns the exact accepted payload subset', () => {
    const target = {dropTarget: true, dropTypes: 'treenode', dropTags: 'documenti AND !bloccato', dropEffect: 'move'};
    assert.deepEqual(Policy.evaluate(['text/plain', 'treenode', 'nodeattr'], 'documenti', 'copyMove', target),
        {accepted: true, types: ['treenode'], dropEffect: 'move'});
    assert.equal(Policy.evaluate(['treenode'], 'documenti,bloccato', 'copyMove', target).accepted, false);
    assert.deepEqual(Policy.evaluate(['treenode'], 'documenti', 'copy', target),
        {accepted: false, types: ['treenode'], dropEffect: 'none'});
});

test('reevaluation uses current destination rules without stale eligibility or payload mutation', () => {
    const target = {dropTarget: true, dropTypes: 'treenode'};
    const types = Object.freeze(['treenode']);
    assert.equal(Policy.evaluate(types, '', 'all', target).accepted, true);
    target.dropTypes = 'nodeattr';
    assert.equal(Policy.evaluate(types, '', 'all', target).accepted, false);
    target.dropTypes = 'treenode'; target.dropTarget = false;
    assert.equal(Policy.evaluate(types, '', 'all', target).accepted, false);
    target.dropTargetCb = 'canReceive';
    assert.equal(Policy.evaluate(types, '', 'all', target).accepted, true);
});
