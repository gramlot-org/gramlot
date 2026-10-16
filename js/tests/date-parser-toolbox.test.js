// Copyright 2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDateExpression} from '@gramlot/gramlot';

const read = name => JSON.parse(readFileSync(new URL(`./fixtures/date-parser/${name}`, import.meta.url), 'utf8'));
const corpus = read('period_parser_corpus.json');
const divergences = read('period_parser_divergences.json');
const key = item => JSON.stringify([item.text, item.locale, item.workdate]);
const corrections = new Map(divergences.cases.map(item => [key(item), item]));
const cases = corpus.cases.map(item => corrections.get(key(item)) ?? item);

test('all upstream corrections refer to corpus cases', () => {
    const keys = new Set(corpus.cases.map(key));
    for (const item of divergences.cases) assert.ok(keys.has(key(item)), key(item));
    assert.equal(cases.length, 2796);
});
for (const item of cases) {
    test(`Toolbox ${key(item)}`, () => {
        const result = parseDateExpression(item.text, {workdate: item.workdate, locale: item.locale});
        if ('error' in item) assert.equal(result.ok, false, JSON.stringify(result));
        else {
            assert.equal(result.ok, true, JSON.stringify(result));
            const dates = result.kind === 'date' ? [result.date, result.date] : [result.start, result.end];
            assert.deepEqual(dates, [item.start, item.end]);
        }
    });
}
