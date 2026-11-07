import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import charts from '../src/components/charts.js';
import {ChartRenderer} from '../src/components/chart-renderer.js';
import {chartTypes} from '../src/components/chart-types/index.js';

const elementName = id => `chart${id[0].toUpperCase()}${id.slice(1)}`;

test('one element per chart type, with the doc of the type and its roles as attributes', () => {
    const elements = charts.toDocument().elements;
    for (const type of chartTypes) {
        const element = elements[elementName(type.id)];
        assert.ok(element, type.id);
        assert.equal(element.doc, `${type.doc} chartView with chartType '${type.id}'.`);
        const parameters = Object.fromEntries(element.attributes.parameters.map(parameter => [parameter.name, parameter]));
        assert.equal('chartType' in parameters, false, type.id);
        for (const role of type.syntax) {
            const name = role.parameter === 'valueFields' ? role.name : role.parameter;
            assert.ok(parameters[name], `${type.id}.${name}`);
            assert.equal(parameters[name].has_default, !role.required, `${type.id}.${name}`);
        }
    }
    assert.equal(elements.chartBar3D._meta.render_tag, 'gramlot-chart-bar3d');
    assert.equal(elements.chartMapBar3D._meta.render_tag, 'gramlot-chart-map-bar3d');
    assert.equal(elements.chartView.attributes.parameters.every(parameter => parameter.has_default || parameter.name === 'attr'), true);
});

test('the Builder rejects a chart type element without a required role', () => {
    const builder = new GramlotBuilder(null, {collections:[charts]});
    assert.throws(() => builder.root.chartCandlestick({captionField:'day', open:'o', high:'h', low:'l', storepath:'rows'}), /missing required attribute 'close'/);
    assert.throws(() => builder.root.chartPie({storepath:'rows', measure:'amount'}), /missing required attribute 'captionField'/);
    builder.root.chartCandlestick({captionField:'day', open:'o', high:'h', low:'l', close:'c', storepath:'rows'});
    builder.root.chartMap({captionField:'name', mapValueField:'v', storepath:'rows'});
});

test('the element is chartView with a fixed type; its roles compose valueFields in reading order', async t => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.ResizeObserver = class {observe() {} disconnect() {}};
    const updates = [];
    t.mock.method(ChartRenderer.prototype, 'prepare', async () => {});
    t.mock.method(ChartRenderer.prototype, 'resize', () => {});
    t.mock.method(ChartRenderer.prototype, 'update', function(structure) {
        updates.push([structure.getItem('chartType'), structure.getItem('valueFields')]);
    });
    const app = new Gramlot({document:window.document, transport:false, collections:[charts]});
    const builder = new GramlotBuilder(null, {collections:[charts]});
    const rows = new Bag();
    rows.setItem('r0', null, {day:'D1', o:1, h:3, l:0, c:2, v:5});
    app.data.setItem('rows', rows);
    app.data.setItem('options', new Bag({o:new Bag({axis:'left', color:'#5470c6'})}));
    builder.root.chartCandlestick({id:'candle', storepath:'rows', rowMode:'attributes', captionField:'day', open:'o', high:'h', low:'l', close:'^close', seriesOptions:'^options'});
    builder.root.chartBar({id:'bars', storepath:'rows', rowMode:'attributes', captionField:'day', measures:'o,c', seriesOptions:'^options'});
    app.data.setItem('close', 'c');
    try {
        app.src.startSource(builder.toTytx());
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.deepEqual(updates.find(([type]) => type === 'candlestick'), ['candlestick', 'o,h,l,c']);
        assert.deepEqual(updates.find(([type]) => type === 'bar'), ['bar', 'o,c']);
        app.data.setItem('close', 'v');
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.deepEqual(updates.filter(([type]) => type === 'candlestick').at(-1), ['candlestick', 'o,h,l,v']);
        assert.equal(window.document.getElementById('candle').localName, 'gramlot-chart-candlestick');
    } finally { app.dispose(); window.close(); }
});
