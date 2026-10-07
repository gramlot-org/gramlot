/** Signature and ReturnValue: declared parameters, the per-code check of bind, defaults, the _extraPath rule.
 * Python genro-routes has no counterpart: it reads type hints, the JS routes declare them. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {createDecimal} from '@genrojs/tytx';
import {Signature, ReturnValue} from '../../src/routes/index.js';

const VALID = {
    T: 'text',
    L: 7,
    R: 1.5,
    N: createDecimal('12.50'),
    B: true,
    D: new Date(Date.UTC(2026, 9, 7)),
    DHZ: new Date(Date.UTC(2026, 9, 7, 9, 30)),
    H: new Date(Date.UTC(2026, 9, 7, 9, 30)),
};
const INVALID = {
    T: 7,
    L: 1.5,
    R: Infinity,
    N: 12.5,
    B: 'true',
    D: '2026-10-07',
    DHZ: new Date(NaN),
    H: 0,
};

test('parameters: declared specs in declaration order', () => {
    const signature = new Signature({name: 'T', email: ['T', null], weight: ['L', 0]});
    assert.deepEqual(signature.parameters, [
        {name: 'name', type: 'T', required: true, default: undefined},
        {name: 'email', type: 'T', required: false, default: null},
        {name: 'weight', type: 'L', required: false, default: 0},
    ]);
});

test('an empty Signature has no parameters', () => {
    assert.deepEqual(new Signature().parameters, []);
    assert.deepEqual(new Signature().bind({}), {});
});

test('bind accepts a value of each code and rejects one of another type', () => {
    for (const code of Object.keys(VALID)) {
        const signature = new Signature({value: code});
        assert.deepEqual(signature.bind({value: VALID[code]}), {value: VALID[code]}, code);
        assert.throws(() => signature.bind({value: INVALID[code]}), TypeError, code);
    }
});

test('bind returns a new object and never converts values', () => {
    const signature = new Signature({value: 'L'});
    const kw = {value: 3};
    const bound = signature.bind(kw);
    assert.notEqual(bound, kw);
    assert.deepEqual(bound, kw);
    assert.throws(() => signature.bind({value: '3'}), TypeError);
});

test('bind applies defaults for absent optional names, without type-checking them', () => {
    const signature = new Signature({name: 'T', weight: ['L', 'heavy'], tag: ['T', null]});
    assert.deepEqual(signature.bind({name: 'a'}), {name: 'a', weight: 'heavy', tag: null});
    assert.deepEqual(signature.bind({name: 'a', weight: 2}), {name: 'a', weight: 2, tag: null});
});

test('bind rejects unknown names, naming them', () => {
    const signature = new Signature({name: 'T'});
    assert.throws(() => signature.bind({name: 'a', color: 1, size: 2}), /color, size/);
});

test('bind rejects missing required names', () => {
    const signature = new Signature({name: 'T', email: 'T'});
    assert.throws(() => signature.bind({name: 'a'}), /missing required parameter 'email'/);
});

test('null is accepted only when the default of that parameter is null', () => {
    const signature = new Signature({name: 'T', email: ['T', null], weight: ['L', 0]});
    assert.deepEqual(signature.bind({name: 'a', email: null}), {name: 'a', email: null, weight: 0});
    assert.throws(() => signature.bind({name: null}), TypeError);
    assert.throws(() => signature.bind({name: 'a', weight: null}), TypeError);
});

test('bind with extraPath carries _extraPath only for a non-empty string', () => {
    const signature = new Signature({name: 'T'});
    assert.deepEqual(signature.bind({name: 'a'}, {extraPath: 'x/y'}), {name: 'a', _extraPath: 'x/y'});
    assert.deepEqual(signature.bind({name: 'a'}, {extraPath: ''}), {name: 'a'});
    assert.deepEqual(signature.bind({name: 'a'}, {}), {name: 'a'});
    assert.deepEqual(signature.bind({name: 'a'}), {name: 'a'});
});

test('_extraPath inside kw is an unknown name', () => {
    const signature = new Signature({name: 'T'});
    assert.throws(() => signature.bind({name: 'a', _extraPath: 'x'}), /_extraPath/);
    assert.throws(() => signature.bind({name: 'a', _extraPath: 'x'}, {extraPath: 'y'}), /_extraPath/);
});

test('a spec that is neither a code nor [code, default] is a TypeError at construction', () => {
    for (const spec of [7, null, undefined, {}, [], ['T'], ['T', 1, 2], [7, 1], true]) {
        assert.throws(() => new Signature({name: spec}), TypeError, String(spec));
    }
});

test('an unknown code is a TypeError at construction', () => {
    assert.throws(() => new Signature({name: 'X'}), /unknown TYTX code 'X'/);
    assert.throws(() => new Signature({name: ['X', null]}), /unknown TYTX code 'X'/);
    assert.throws(() => new Signature({name: 'toString'}), TypeError);
});

test('ReturnValue holds type, mediaType and docline, all optional', () => {
    const result = new ReturnValue({type: 'T', mediaType: 'text/plain', docline: 'The greeting.'});
    assert.equal(result.type, 'T');
    assert.equal(result.mediaType, 'text/plain');
    assert.equal(result.docline, 'The greeting.');
    const bare = new ReturnValue();
    assert.equal(bare.type, undefined);
    assert.equal(bare.mediaType, undefined);
    assert.equal(bare.docline, undefined);
});

test('ReturnValue validates a code type and an object type with the Signature rules', () => {
    const fields = {id: 'L', label: ['T', null]};
    assert.equal(new ReturnValue({type: fields}).type, fields);
    assert.throws(() => new ReturnValue({type: 'X'}), /unknown TYTX code 'X'/);
    assert.throws(() => new ReturnValue({type: {id: 'X'}}), /unknown TYTX code 'X'/);
    assert.throws(() => new ReturnValue({type: {id: 7}}), TypeError);
    for (const type of [7, null, ['T', null]]) {
        assert.throws(() => new ReturnValue({type}), TypeError, String(type));
    }
});

test('parameters returns copies: changing them does not change bind', () => {
    const signature = new Signature({name: 'T'});
    signature.parameters[0].required = false;
    signature.parameters.push({name: 'extra', type: 'T', required: false, default: null});
    assert.throws(() => signature.bind({}), TypeError);
    assert.throws(() => signature.bind({name: 'a', extra: 'b'}), TypeError);
});
