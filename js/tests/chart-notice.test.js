import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag} from '@gramlot/gramlot';
import {ChartNotice, chartErrorSections, chartTypeSections} from '../src/components/chart-notice.js';
import {checkChartSyntax} from '../src/components/chart-syntax.js';
import {chartTypes} from '../src/components/chart-types/index.js';

const type = id => chartTypes.find(item => item.id === id);
const syntaxError = (id, values) => { try { checkChartSyntax(type(id), new Bag(values)); } catch (error) { return error; } };

function notice() {
    const {window} = new JSDOM('<main></main>');
    // jsdom has no modal dialogs; the browser opens the same element with showModal.
    window.HTMLDialogElement.prototype.showModal = function() { this.setAttribute('open', ''); };
    window.HTMLDialogElement.prototype.close = function() { this.removeAttribute('open'); };
    const box = new ChartNotice(window.document);
    window.document.body.append(box.element);
    return {window, box};
}

test('an error shows icon, line and More info; the dialog explains the syntax of the type', () => {
    const {window, box} = notice();
    const error = syntaxError('candlestick', {captionField:'day', valueFields:'o,h,l,c,v'});
    box.error(error.message, 'Candlestick: the configuration does not match the chart type', chartErrorSections(error, type('candlestick')));
    assert.equal(box.hidden, false);
    assert.equal(box.element.dataset.kind, 'error');
    assert.equal(box.text.getAttribute('role'), 'alert');
    assert.match(box.text.textContent, /takes 4 measures in the order open, high, low, close; received 5/);
    box.element.querySelector('button').click();
    const dialog = box.dialog.textContent;
    assert.equal(box.dialog.hasAttribute('open'), true);
    for (const text of ['What is wrong','Expected','Received','o, h, l, c, v','How to fix it','Remove v from the measures.',
        'What candlestick shows','Columns it reads','valueFields, position 1','valueFields, position 4']) assert.ok(dialog.includes(text), text);
    assert.deepEqual([...box.dialog.querySelectorAll('tr')].slice(1).map(row => row.cells[0].textContent), ['Period','Open','High','Low','Close']);
    box.hide();
    assert.equal(box.dialog.hasAttribute('open'), false);
    assert.equal(box.hidden, true);
    assert.equal(box.text.hidden, true);
    window.close();
});

test('an unknown chart type lists the supported types; a data error keeps the type explanation', () => {
    const unknown = chartErrorSections(new TypeError('Choose a supported chart type'), null);
    assert.equal(unknown[1].title, 'Supported chart types');
    assert.match(unknown[1].paragraphs[0], /candlestick \(Candlestick\)/);
    const data = chartErrorSections(new TypeError('Sankey links contain a cycle: a → b → a.'), type('sankey'));
    assert.deepEqual(data.map(section => section.title), ['What is wrong','What sankey shows','Columns it reads']);
});

test('info notices use role status; a list of measures is described as one or more', () => {
    const {window, box} = notice();
    box.info('No data to display', 'No data to display', chartTypeSections(type('bar')));
    assert.equal(box.element.dataset.kind, 'info');
    assert.equal(box.text.getAttribute('role'), 'status');
    box.open();
    assert.match(box.dialog.textContent, /One or more\. Each measure is one series/);
    window.close();
});
