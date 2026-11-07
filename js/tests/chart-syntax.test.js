import test from 'node:test';
import assert from 'node:assert/strict';
import {chartTypes} from '../src/components/chart-types/index.js';
import charts from '../src/components/charts.js';

const chartView = charts.components.find(component => component.name === 'chartView');
const KEYS = ['name','parameter','count','required','dtype','caption','doc'];

test('every chart type declares its doc and its syntax', () => {
    for (const type of chartTypes) {
        assert.equal(typeof type.doc, 'string', type.id);
        assert.ok(type.doc.length > 0, type.id);
        assert.ok(Array.isArray(type.syntax) && type.syntax.length > 0, type.id);
        assert.equal('measureLimit' in type, false, type.id);
    }
});

test('every role has the declared keys and points to a chartView parameter', () => {
    for (const type of chartTypes) {
        const names = new Set();
        for (const role of type.syntax) {
            assert.deepEqual(Object.keys(role), KEYS, `${type.id}.${role.name}`);
            assert.ok(role.parameter in chartView.parameters, `${type.id}.${role.name} -> ${role.parameter}`);
            assert.ok(role.count === 1 || role.count === 'many', `${type.id}.${role.name}`);
            assert.equal(typeof role.required, 'boolean', `${type.id}.${role.name}`);
            assert.ok(role.dtype === null || role.dtype === 'numeric', `${type.id}.${role.name}`);
            assert.ok(role.caption && role.doc, `${type.id}.${role.name}`);
            assert.equal(names.has(role.name), false, `${type.id} repeats ${role.name}`);
            names.add(role.name);
        }
        assert.equal(type.syntax[0].parameter, 'captionField', type.id);
    }
});

test('a type with a list of measures declares no other measure role', () => {
    for (const type of chartTypes) {
        const measures = type.syntax.filter(role => role.parameter === 'valueFields');
        if (measures.some(role => role.count === 'many')) assert.equal(measures.length, 1, type.id);
    }
});

test('fixed measure roles keep the reading order of candlestick and boxplot', () => {
    const names = id => chartTypes.find(type => type.id === id).syntax.filter(role => role.parameter === 'valueFields').map(role => role.name);
    assert.deepEqual(names('candlestick'), ['open','high','low','close']);
    assert.deepEqual(names('boxplot'), ['min','q1','median','q3','max']);
    for (const id of ['pie','donut','funnel','heatmap','sankey','treemap','sunburst']) assert.deepEqual(names(id), ['value'], id);
});

test('checkChartSyntax: missing, excess and equal dimensions carry a diagnosis', async () => {
    const {Bag} = await import('@gramlot/gramlot');
    const {checkChartSyntax, ChartSyntaxError} = await import('../src/components/chart-syntax.js');
    const type = id => chartTypes.find(item => item.id === id);
    const check = (id, values) => () => checkChartSyntax(type(id), new Bag(values));
    assert.throws(check('bar', {captionField:null, valueFields:'a'}), error =>
        error instanceof ChartSyntaxError && error instanceof TypeError && error.diagnosis.role === 'captionField');
    assert.throws(check('bar', {captionField:'name', valueFields:null}), error => error.diagnosis.role === 'measures' && error.diagnosis.received === 'none');
    assert.throws(check('sankey', {captionField:'a', secondCaptionField:'a', valueFields:'v'}), error =>
        error.diagnosis.role === 'secondCaptionField' && error.diagnosis.fix === 'Choose another column for Target.');
    assert.throws(check('candlestick', {captionField:'day', valueFields:'o,h,l,c,v'}), error =>
        error.diagnosis.role === null && error.diagnosis.received === 'o, h, l, c, v' && error.diagnosis.fix === 'Remove v from the measures.');
    assert.throws(check('bar', {captionField:'name', valueFields:'a,,b'}), /distinct nonempty/);
    assert.deepEqual(checkChartSyntax(type('map'), new Bag({captionField:'name', mapValueField:'v', valueFields:'a,b'})), []);
    assert.throws(check('map', {captionField:'name', mapValueField:null}), error => error.diagnosis.role === 'mapValueField');
});
