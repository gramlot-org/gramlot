import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {GramlotBuilder, Gramlot} from '../src/index.js';
const controls = JSON.parse(readFileSync(new URL('../../tests/fixtures/collections/controls.json', import.meta.url)));

test('full exported HTML grammar replaces the restricted list', () => {
    const b = new GramlotBuilder();
    b.root.canvas('fallback', {id: 'canvas'});
    b.root.template().span('template body');
    assert.throws(() => b.root.ul().div('invalid'), /child|allowed|tag/i);
    assert.throws(() => b.root.br().span('invalid'), /child|allowed|void|tag/i);
});

test('future collection validates the same exported signature and structure', () => {
    const b = new GramlotBuilder(null, {collections: [controls]});
    const panel = b.root.ratingPanel(null, {title: 'Ratings'});
    const rating = panel.rating(null, {amount: 4, code: 'IT', caption: 'Score'});
    assert.equal(rating.nodeTag, 'rating');
    assert.equal(rating.attr._meta.render_tag, 'gramlot-rating');
    for (const attrs of [{code:'IT'}, {amount:11,code:'IT'}, {amount:'4',code:'IT'}, {amount:true,code:'IT'},
        {amount:4,code:'invalid'}, {amount:4,code:'IT',mode:'other'}, {amount:4,code:'IT',extra:true}]) {
        assert.throws(() => panel.rating(null, attrs));
    }
    assert.throws(() => b.root.rating(null, {amount:1,code:'IT'}));
    assert.throws(() => b.root.statusText('ready'));
    b.root.statusText('ready', {required_label:'Status'});
});

test('collection instances are isolated and invalid merge leaves valid grammar intact', () => {
    const left = new GramlotBuilder(), right = new GramlotBuilder();
    left.loadCollection(controls);
    assert.equal(right.root.statusText, undefined);
    const invalid = structuredClone(controls);
    invalid.elements.statusText.inherits_from = 'missing';
    assert.throws(() => left.loadCollection(invalid));
    left.root.statusText('ready', {required_label:'Status'});
});

test('custom collection renders its mapped tag', () => {
    const b = new GramlotBuilder(null, {collections:[controls]});
    b.root.ratingPanel().rating(null, {amount:3,code:'IT'});
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    const app = new Gramlot({document, collections:[controls], transport:false});
    app.startSource(b.toTytx());
    const rating = document.querySelector('section > gramlot-rating');
    assert.ok(rating);
    assert.equal(rating.getAttribute('amount'), '3');
    app.dispose();
    assert.equal(document.getElementById('gramlot-root').children.length, 0);
});

test('Python authors a future collection that JavaScript validates and renders', async () => {
    const {execFileSync} = await import('node:child_process');
    const {fileURLToPath} = await import('node:url');
    const root = fileURLToPath(new URL('../../', import.meta.url));
    const wire = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', `
import json
from gramlot import GramlotBuilder
from genro_tytx import to_tytx
with open('tests/fixtures/collections/controls.json') as f: collection=json.load(f)
b=GramlotBuilder(collections=[collection])
b.root.ratingPanel(title='Ratings').rating(amount=5,code='IT')
print(to_tytx(b.source))
`], {cwd:root, encoding:'utf8'}).trim();
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    const app = new Gramlot({document, collections:[controls], transport:false});
    app.startSource(wire);
    assert.equal(document.querySelector('gramlot-rating').getAttribute('amount'), '5');
    app.dispose();
});
