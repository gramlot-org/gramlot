import test from 'node:test';
import assert from 'node:assert/strict';
import * as echarts from 'echarts/dist/echarts.js';
import {GramlotBuilder} from '../src/builder/gramlot-builder.js';
import charts from '../src/components/charts.js';
import {gaugeBands, gaugeBandColor, gaugeOption, gaugeText, gaugeValue, parseThresholds} from '../src/components/chart-gauge-options.js';

const palette = {accent: '#235db2', ink: '#202936', muted: '#526174', track: '#e9edf2'};
const base = {value: 50, min: 0, max: 100, mask: '{}', thresholds: [], presentation: 'needle', caption: '', palette};
const series = overrides => gaugeOption({...base, ...overrides}).series[0];

test('thresholds string parses into ascending value:color pairs', () => {
    assert.deepEqual(parseThresholds('85:#c23531,65:#e6a23c'), [{value: 65, color: '#e6a23c'}, {value: 85, color: '#c23531'}]);
    assert.deepEqual(parseThresholds(' -10.5 : red '), [{value: -10.5, color: 'red'}]);
    assert.deepEqual(parseThresholds(''), []);
    assert.deepEqual(parseThresholds(null), []);
    assert.throws(() => parseThresholds('65'), /value:color/);
    assert.throws(() => parseThresholds('65:#fff,65:#000'), /Duplicate/);
    assert.throws(() => parseThresholds(12), /string/);
});

test('a threshold color applies from its value upward, the accent below the first one', () => {
    const thresholds = parseThresholds('65:#e6a23c,85:#c23531');
    assert.equal(gaugeBandColor(thresholds, 10, palette.accent), palette.accent);
    assert.equal(gaugeBandColor(thresholds, 65, palette.accent), '#e6a23c');
    assert.equal(gaugeBandColor(thresholds, 84.9, palette.accent), '#e6a23c');
    assert.equal(gaugeBandColor(thresholds, 100, palette.accent), '#c23531');
    assert.deepEqual(gaugeBands(thresholds, 0, 100, palette.accent), [[0.65, palette.accent], [0.85, '#e6a23c'], [1, '#c23531']]);
    // Thresholds outside the range collapse instead of producing unordered stops.
    assert.deepEqual(gaugeBands(parseThresholds('-5:red,200:blue'), 0, 100, palette.accent), [[1, 'red']]);
    assert.deepEqual(gaugeBands([], 0, 100, palette.accent), [[1, palette.accent]]);
});

test('node text is a number; empty text is no value, zero stays zero', () => {
    assert.equal(gaugeValue(''), null);
    assert.equal(gaugeValue(null), null);
    assert.equal(gaugeValue('0'), 0);
    assert.equal(gaugeValue('12.5'), 12.5);
    assert.throws(() => gaugeValue('abc'), /number/);
});

test('null value: empty dial, no data, no text; never a fake zero', () => {
    for (const presentation of ['needle', 'ring', 'arc']) {
        const s = series({value: null, presentation});
        assert.deepEqual(s.data, []);
        assert.equal(s.detail.formatter(), '');
    }
    assert.deepEqual(series({value: 0}).data, [{value: 0, name: ''}]);
});

test('values outside min/max are clamped on the dial, the text shows the real value', () => {
    assert.equal(series({value: 140}).data[0].value, 100);
    assert.equal(series({value: -20}).data[0].value, 0);
    assert.equal(series({value: 140, mask: '{} %'}).detail.formatter(), '140 %');
    assert.equal(series({value: 12.3456}).detail.formatter(), '12.35');
    assert.equal(gaugeText(7, '[{}] of {}'), '[7] of 7');
    assert.equal(gaugeText(7, null), '7');
});

test('needle presentation: pointer, ticks and threshold bands on the dial', () => {
    const s = series({presentation: 'needle', thresholds: parseThresholds('65:#e6a23c,85:#c23531'), caption: 'CPU'});
    assert.equal(s.type, 'gauge');
    assert.equal(s.pointer.show, true);
    assert.equal(s.progress.show, false);
    assert.equal(s.axisLabel.show, true);
    assert.equal(s.axisLine.lineStyle.color.length, 3);
    assert.equal(s.data[0].name, 'CPU');
    assert.equal(s.min, 0); assert.equal(s.max, 100);
});

test('ring presentation: full circle progress, no needle, colored by the band of the value', () => {
    const s = series({presentation: 'ring', value: 90, thresholds: parseThresholds('65:#e6a23c,85:#c23531')});
    assert.equal(s.pointer.show, false);
    assert.equal(s.progress.show, true);
    assert.equal(s.progress.itemStyle.color, '#c23531');
    assert.equal(Math.abs(s.startAngle - s.endAngle), 360);
    assert.deepEqual(s.axisLine.lineStyle.color, [[1, palette.track]]);
    assert.equal(s.axisLabel.show, false);
});

test('arc presentation: half circle progress, no needle', () => {
    const s = series({presentation: 'arc', value: 10, thresholds: parseThresholds('65:#e6a23c')});
    assert.equal(s.pointer.show, false);
    assert.equal(s.progress.show, true);
    assert.equal(s.progress.itemStyle.color, palette.accent);
    assert.equal(Math.abs(s.startAngle - s.endAngle), 180);
});

test('invalid configuration is rejected', () => {
    assert.throws(() => gaugeOption({...base, presentation: 'speedometer'}), /presentation/);
    assert.throws(() => gaugeOption({...base, min: 10, max: 10}), /min lower than max/);
    assert.throws(() => gaugeOption({...base, value: Infinity}), /finite/);
});

test('every presentation sets the same keys, so a merge leaves nothing behind', () => {
    const keys = presentation => JSON.stringify(Object.keys(series({presentation})).sort());
    assert.equal(keys('ring'), keys('needle'));
    assert.equal(keys('arc'), keys('needle'));
});

test('ECharts renders the options: needle shown, none for a null value', () => {
    const render = options => {
        const chart = echarts.init(null, null, {renderer: 'svg', ssr: true, width: 320, height: 240});
        try { chart.setOption(gaugeOption({...base, ...options})); return chart.renderToSVGString(); }
        finally { chart.dispose(); }
    };
    assert.match(render({value: 42, mask: '{} %'}), /42 %/);
    assert.doesNotMatch(render({value: null, mask: '{} %'}), /%/);
    assert.match(render({value: 42, presentation: 'ring'}), /<path/);
    assert.match(render({value: 42, presentation: 'arc', caption: 'Load'}), /Load/);
});

test('gauge is a Source element of the charts collection with the node value and the parameters', () => {
    const builder = new GramlotBuilder(null, {collections: [charts]});
    builder.root.gauge('^.cpu.load?percent', {min: 0, max: '^.limit', mask: '{} %', thresholds: '65:#e6a23c,85:#c23531',
        presentation: 'ring', caption: 'CPU'});
    const node = builder.root.getNodes()[0];
    assert.equal(node.nodeTag, 'gauge');
    assert.equal(node.value, '^.cpu.load?percent');
    assert.equal(node.getAttr('presentation'), 'ring');
    assert.equal(node.getAttr('max'), '^.limit');
    assert.equal(node._getMeta('gramlot_component').parameters.presentation.default, 'needle');
    assert.equal(node._getMeta('gramlot_component').parameters.max.default, 100);
});
