import test from 'node:test';
import assert from 'node:assert/strict';
import {parseScalar, scalarType, scalarText} from '../src/editor-values.js';

test('typed scalar edits validate without coercing invalid or empty values', () => {
    for (const [type, text, expected] of [['string', '^literal', '^literal'], ['integer', '42', 42],
        ['number', '1.25', 1.25], ['boolean', 'false', false], ['null', '', null]]) {
        assert.equal(parseScalar(type, text), expected);
    }
    for (const [type, text] of [['integer', '1.2'], ['number', ''], ['number', '0xff'], ['boolean', 'yes'],
        ['date', '2026-02-30'], ['date', '2026-13-01'], ['time', '24:00'], ['datetime', '2026-09-30T20:00']]) {
        assert.throws(() => parseScalar(type, text), /Invalid/);
    }
    for (const [type, text] of [['date', '2026-09-30'], ['time', '10:20:30.123'], ['datetime', '2026-09-30T12:30:00.000Z']]) {
        const value = parseScalar(type, text);
        assert.equal(scalarType(value), type);
        assert.equal(scalarText(value, type), text);
    }
    assert.equal(scalarType({nested: true}), null);
});
