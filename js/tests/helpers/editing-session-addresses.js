import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {GramlotBuilderBagNode} from '../../src/builder/source.js';

/**
 * The field maps of an EditingSession reference Source nodes by fullpath: their keys are strings and no
 * value reachable through public properties is a Source node or a Bag. The session itself, which owns
 * its node and its registers, is not visited again. The `target` of a validation record is the Data node
 * whose identity detects a replaced row; it is a separate open point and is only checked not to be a
 * Source node.
 */
export function assertFieldMapsByAddress(session) {
    for (const name of ['fields','validations','validationQueue']) {
        const keys = [...session[name].keys()];
        assert.ok(keys.every(key => typeof key === 'string'), `${name} keys are fullpaths`);
    }
    const seen = new Set();
    const visit = (value, where) => {
        if (value === null || typeof value !== 'object' || value === session || seen.has(value)) return;
        seen.add(value);
        assert.ok(!(value instanceof GramlotBuilderBagNode), `${where} holds a Source node`);
        assert.ok(!(value instanceof Bag), `${where} holds a Bag`);
        if (value instanceof Map) for (const [key, item] of value) { visit(key, `${where} key`); visit(item, `${where}.${key}`); }
        else if (value instanceof Set) for (const item of value) visit(item, `${where} item`);
        else for (const [key, item] of Object.entries(value)) {
            if (key === 'target' && session.validations.has(where.slice('validations.'.length))) {
                assert.ok(!(item instanceof GramlotBuilderBagNode), `${where}.target holds a Source node`);
            } else visit(item, `${where}.${key}`);
        }
    };
    visit(session.fields, 'fields');
    visit(session.validations, 'validations');
    visit(session.validationQueue, 'validationQueue');
}
