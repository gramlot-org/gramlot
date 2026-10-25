// Copyright 2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
// Parsing semantics are tested in @genrojs/toolbox; these tests cover Gramlot's re-export.
import {test} from 'node:test';
import assert from 'node:assert/strict';
// Package self-reference verifies the isolated public entry in a DOM-free process.
import {parseDateExpression} from '@gramlot/gramlot';
import * as toolbox from '@genrojs/toolbox';

const context = {locale: 'it-IT', workdate: '2026-09-11'};
const date = value => ({ok: true, kind: 'date', date: value});
const period = (start, end) => ({ok: true, kind: 'period', start, end});

test('public entry re-exports the Toolbox parser', () => {
    assert.equal(parseDateExpression, toolbox.parseDateExpression);
});

test('readable and minified shipped bundles expose the same parsing contract', async () => {
    for (const file of ['gramlot.js', 'gramlot.min.js']) {
        const runtime = await import(new URL(`../dist/${file}`, import.meta.url));
        assert.deepEqual(runtime.parseDateExpression('domani', context), date('2026-09-12'));
        assert.deepEqual(runtime.parseDateExpression('mese scorso', context), period('2026-08-01', '2026-08-31'));
        assert.equal(runtime.parseDateExpression('2026-02-30', context).error.code, 'INVALID_DATE');
    }
});
