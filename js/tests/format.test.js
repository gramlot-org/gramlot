import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {execFileSync} from 'node:child_process';
import {Gramlot} from '../src/index.js';
import {createDecimal, fromTytx} from '@genrojs/tytx';

function page(t) {
    const dom = new JSDOM('<main></main>');
    const app = new Gramlot({element: dom.window.document.querySelector('main'), transport: false});
    t.after(() => { app.dispose(); dom.window.close(); });
    return app;
}

test('Gramlot.format formats numbers with explicit locale, grouping and decimal precision', t => {
    const app = page(t);
    assert.equal(app.format(12345.5, {pattern: '#,##0.00', locale: 'it-IT'}), '12.345,50');
    assert.equal(app.format(12345.5, {pattern: '#,##0.00', locale: 'en-US'}), '12,345.50');
    assert.equal(app.format(1234.5, {pattern: '0.00', locale: 'it-IT', mask: 'Totale: {} €'}), 'Totale: 1234,50 €');
    assert.equal(app.format(1.236, {pattern: '0.00', locale: 'en-US'}), '1.24');
    assert.equal(app.format(12, {pattern: '0000.0##', locale: 'en-US'}), '0012.0');
    assert.equal(app.format(12.3456, {pattern: '0.0##', locale: 'en-US'}), '12.346');
    assert.equal(app.format(-12.5, {pattern: '0.00', locale: 'en-US'}), '-12.50');
});

test('two sections mean positive/negative, three mean positive/zero/negative', t => {
    const app = page(t);
    const two = {pattern: '#,##0.00;(#,##0.00)', locale: 'it-IT'};
    const three = {...two, pattern: '#,##0.00;-;(#,##0.00)'};
    assert.deepEqual([12.5, 0, -12.5].map(v => app.format(v, two)), ['12,50', '0,00', '(12,50)']);
    assert.deepEqual([12.5, 0, -12.5].map(v => app.format(v, three)), ['12,50', '-', '(12,50)']);
    assert.equal(app.format(-12.5, {...two, pattern: '0.00;(0)'}), '(12,50)');
    assert.equal(app.format(-0, three), '-');
    assert.equal(app.format(0, {...two, pattern: '0.00;000;(0.00)'}), '000');
});

test('mask follows formatting; null and the empty zero section bypass it', t => {
    const app = page(t);
    const options = {pattern: '0.00;;(0.00)', locale: 'it-IT', mask: 'Totale: {} €'};
    assert.equal(app.format(0, options), '');
    assert.equal(app.format(-0, options), '');
    assert.equal(app.format(null, options), '');
    assert.equal(app.format(null), '');
    assert.equal(app.format(null, {pattern: 'unsupported', locale: 'bad', mask: '{name}'}), '');
    assert.equal(app.format(-2, options), 'Totale: (2,00) €');
    assert.equal(app.format(2, {...options, mask: '{} / {}'}), '2,00 / 2,00');
});

test('unsupported inputs and incomplete context fail explicitly instead of coercing', t => {
    const app = page(t);
    const options = {pattern: '0.00', locale: 'it-IT'};
    for (const value of [undefined, '', '123', true, {}, [], NaN, Infinity, 123n, createDecimal('1.2')]) {
        assert.throws(() => app.format(value, options), /finite JavaScript numbers/);
    }
    assert.throws(() => app.format(1), /explicit pattern/);
    assert.equal(app.format(1, '0.00'), new Intl.NumberFormat(app.locale, {minimumFractionDigits: 2}).format(1));
    assert.throws(() => app.format(1, {...options, locale: 'zz-ZZ'}), /Unsupported format locale/);
    assert.throws(() => app.format(1, {...options, format: '0.0'}), /Unsupported format option/);
    for (const pattern of ['0.0.0', '0%', 'currency', '#,##,##0', "'EUR '0.00", '0;;', '0;0;0;0', '0;bad', '(0)']) {
        assert.throws(() => app.format(1, {...options, pattern}), RangeError, pattern);
    }
    assert.throws(() => app.format(1, {...options, mask: '{name}'}), /only \{\}/);
    assert.throws(() => app.format(1, {...options, mask: '{?}'}), /only \{\}/);
});

test('dtype disambiguates a midnight Date without changing its value or TYTX', t => {
    const app = page(t);
    const date = fromTytx('"2026-10-16::D"');
    const instant = fromTytx('"2026-10-16T00:00:00Z::DHZ"');
    assert.equal(date.getTime(), instant.getTime());
    const context = {locale: 'it-IT', timeZone: 'America/Los_Angeles'};
    assert.equal(app.format(instant, context), '16/10/26'); // TYTX inference => D
    assert.equal(app.format(instant, {...context, dtype: 'D'}), '16/10/26');
    assert.equal(app.format(instant, {...context, dtype: 'DHZ'}), '15/10/26, 17:00');
    assert.equal(instant.toISOString(), '2026-10-16T00:00:00.000Z');
    assert.equal(app.format(null, {dtype: 'DHZ'}), '');
});

test('named temporal styles use Intl with short as default and then apply mask', t => {
    const app = page(t);
    const value = new Date('2026-10-16T12:30:45Z');
    for (const dtype of ['D', 'H', 'DHZ']) {
        for (const pattern of ['short', 'medium', 'long', 'full']) {
            const native = {timeZone: dtype === 'DHZ' ? 'Europe/Rome' : 'UTC'};
            if (dtype !== 'H') native.dateStyle = pattern;
            if (dtype !== 'D') native.timeStyle = pattern;
            const expected = new Intl.DateTimeFormat('it-IT', native).format(value);
            assert.equal(app.format(value, {dtype, pattern, locale: 'it-IT', timeZone: 'Europe/Rome', mask: 'Data: {}'}), `Data: ${expected}`);
            if (pattern === 'short') assert.equal(app.format(value, {dtype, locale: 'it-IT', timeZone: 'Europe/Rome'}), expected);
        }
    }
    assert.equal(app.format(new Date('1970-01-01T10:30:00Z'), {locale: 'it-IT'}), '10:30');
    assert.equal(app.format(new Date('1970-01-01T00:00:00Z'), {dtype: 'H', locale: 'it-IT'}), '00:00');
    assert.equal(app.format(value, {locale: 'it-IT', timeZone: 'Europe/Rome'}), '16/10/26, 14:30');
});

test('dtype selects interpretation, not coercion; unsupported types/context remain explicit', t => {
    const app = page(t);
    const value = new Date('2026-10-16T12:30:00Z');
    const options = {locale: 'it-IT', pattern: 'short'};
    assert.equal(app.format(value, options), new Intl.DateTimeFormat('it-IT',
        {dateStyle: 'short', timeStyle: 'short', timeZone: app.timeZone}).format(value));
    assert.throws(() => app.format(value, {...options, dtype: 'DHZ', timeZone: 'Invalid/Zone'}), RangeError);
    assert.throws(() => app.format(new Date(NaN), options), /valid Date/);
    assert.throws(() => app.format(value, {...options, dtype: 'D', pattern: 'dd\/MM\/yyyy'}), /short, medium, long and full/);
    assert.throws(() => app.format('2026-10-16', {...options, dtype: 'D'}), /valid Date/);
    assert.throws(() => app.format(123, {...options, dtype: 'D'}), /valid Date/);
    assert.throws(() => app.format(value, {...options, dtype: 'N'}), /finite JavaScript numbers/);
    for (const dtype of ['DH', 'unknown', null, '']) assert.throws(() => app.format(value, {...options, dtype}), /Unsupported format dtype/);
    assert.throws(() => app.format(1.5, {dtype: 'L', locale: 'it-IT', pattern: '0'}), /requires an integer/);
    for (const dtype of ['L', 'R', 'N']) assert.equal(app.format(12, {dtype, locale: 'it-IT', pattern: '0.0'}), '12,0');
});

test('civil fields and explicit instant zones do not depend on the process timezone', () => {
    const moduleUrl = new URL('../src/format.js', import.meta.url).href;
    const script = `import {formatValue} from ${JSON.stringify(moduleUrl)};
        const value = new Date('2026-10-16T00:00:00Z');
        console.log(JSON.stringify(['D', 'H', 'DHZ'].map(dtype =>
            formatValue(value, {dtype, locale: 'it-IT', timeZone: 'America/Los_Angeles'}))));`;
    for (const TZ of ['Europe/Rome', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
        const output = execFileSync(process.execPath, ['--input-type=module', '-e', script], {encoding: 'utf8', env: {...process.env, TZ}});
        assert.deepEqual(JSON.parse(output), ['16/10/26', '00:00', '15/10/26, 17:00']);
    }
});
