// The nodes created by the library sub-builders (SVG, and HTML inside SVG) have their `==` and `:=`
// expressions computed by Gramlot: the walk and the binding resolve their values through the root builder
// of the Source, the page's GramlotBuilder, whose `evaluatePointerExpression` compiles them. No method is
// assigned to an instance of a library class.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {mount} from './fixtures/mount.js';

const SVG = 'http://www.w3.org/2000/svg';
const XHTML = 'http://www.w3.org/1999/xhtml';

/** A fake server: `main` and the remote Sources answered by the given functions, in the response envelope. */
function envelope({source}) {
    return {close() {}, dispose() {}, async call(text) {
        const {id, contentType, name, params} = fromTytx(text);
        return toTytx({id, contentType, value: await source(name, params)});
    }};
}

function page({transport = false} = {}) {
    const window = new JSDOM('<main id="gramlot-root"></main>').window;
    const document = window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport});
    return {app, window, document, data: app.data, byId: id => document.getElementById(id)};
}

/** The SVG drawing and the HTML of its foreignObject, all built by library sub-builders. */
function drawing(root) {
    root.dataSetter({destination_path: 'n', value: 3});
    const svg = root.svg({id: 'drawing', width: 100, height: 100});
    svg.rect({nodeId: 'bar', id: 'bar', width: '^n:={} * 2', height: '==size * 3', size: '^n'});
    svg.text('==size + 1', {nodeId: 'label', id: 'label', size: '^n'});
    svg.html({width: 50, height: 20}).div('==size * 10', {nodeId: 'inner', id: 'inner', size: '^n',
        title: '^n:={} + 1', 'data-twice': '==size * 2'});
}

test('SVG and HTML-in-SVG nodes compute their `:=` and `==`, at the first render and on every Data change', () => {
    const {app, byId, data} = page();
    mount(app, drawing);
    assert.equal(byId('bar').namespaceURI, SVG);
    assert.equal(byId('bar').getAttribute('width'), '6');
    assert.equal(byId('bar').getAttribute('height'), '9');
    assert.equal(byId('label').textContent, '4');
    assert.equal(byId('inner').namespaceURI, XHTML);
    assert.equal(byId('inner').textContent, '30');
    assert.equal(byId('inner').title, '4');
    assert.equal(byId('inner').getAttribute('data-twice'), '6');
    data.setItem('n', 4);
    assert.equal(byId('bar').getAttribute('width'), '8');
    assert.equal(byId('bar').getAttribute('height'), '12');
    assert.equal(byId('label').textContent, '5');
    assert.equal(byId('inner').textContent, '40');
    assert.equal(byId('inner').title, '5');
    assert.equal(byId('inner').getAttribute('data-twice'), '8');
    app.dispose();
});

test('a sub-builder node keeps its own builder and its library instance carries no replaced method', () => {
    const {app} = page();
    mount(app, drawing);
    const root = app.src.builder;
    for (const [id, dialect] of [['bar', 'svg'], ['inner', 'html']]) {
        const node = sourceTarget(root.nodeById(id));
        assert.equal(node.builder.constructor._name, dialect);
        assert.notEqual(node.builder, root);
        assert.equal(node.rootBuilder, root);
        // The library instance is untouched: no own property replaces its class's method.
        assert.deepEqual(Object.getOwnPropertyNames(node.builder).filter(name => typeof node.builder[name] === 'function'), []);
        assert.equal(Object.hasOwn(node.builder, 'evaluatePointerExpression'), false);
    }
    app.dispose();
});

test('the string renderer writes no `==` and no `:=` of an SVG or HTML-in-SVG node, as the Python one', () => {
    const builder = new GramlotBuilder();
    builder.data.setItem('n', 3);
    drawing(builder.root);
    const svg = builder.source.getNodes().find(node => node.nodeTag === 'svg');
    assert.equal(builder.renderer_html.render(svg),
        '<svg id="drawing" width="100" height="100"><rect id="bar" size="3" /><text id="label" size="3"></text>'
        + '<foreignObject width="50" height="20" xmlns="http://www.w3.org/2000/svg"><div xmlns="http://www.w3.org/1999/xhtml" '
        + 'id="inner" size="3"></div></foreignObject></svg>');
});

test('a subscription handler of an SVG node reads its `:=` arguments through the root builder', () => {
    const {app, data} = page();
    mount(app, root => {
        root.dataSetter({destination_path: 'n', value: 3});
        root.svg({width: 10, height: 10}).rect({nodeId: 'bar', double: '^n:={} * 2',
            subscribe_pick: "this.SET('picked', double + p_0.extra);"});
    });
    app.publish('pick', {extra: 100});
    assert.equal(data.getItem('picked'), 106);
    data.setItem('n', 4);
    app.publish('pick', {extra: 100});
    assert.equal(data.getItem('picked'), 108);
    app.dispose();
});

test('`remote` on an element inside an SVG foreignObject reads its `:=` parameters through the root builder', async () => {
    const calls = [];
    const source = async (method, params) => {
        calls.push([method, params]);
        const builder = new GramlotBuilder();
        builder.root.span(`${method}:${params.double}`);
        return builder.toTytx();
    };
    const {app, document} = page({transport: envelope({source})});
    const builder = new GramlotBuilder();
    builder.root.dataSetter({destination_path: 'n', value: 3});
    builder.root.svg({width: 50, height: 50}).html({width: 40, height: 20}).div({id: 'slot', remote: 'details',
        remote_double: '^n:={} * 2'});
    app.src.startSource(builder.source);
    for (let i = 0; i < 8; i++) await new Promise(resolve => setTimeout(resolve, 0));
    assert.deepEqual(calls, [['details', {double: 6}]]);
    assert.equal(document.getElementById('slot').textContent, 'details:6');
    app.dispose();
});

test('no code of the runtime asks the builder of a node for its runtimeValues, and no method is assigned to a library instance', () => {
    const files = directory => readdirSync(directory).flatMap(name => {
        const path = join(directory, name);
        return statSync(path).isDirectory() ? files(path) : path.endsWith('.js') ? [path] : [];
    });
    const source = fileURLToPath(new URL('../src/', import.meta.url));
    for (const file of files(source)) {
        const text = readFileSync(file, 'utf8');
        assert.doesNotMatch(text, /\bbuilder\.runtimeValues\(/, `${file} asks a node's own builder for runtimeValues`);
        assert.doesNotMatch(text, /\b(?:builder|subbuilder)\.evaluatePointerExpression\s*=[^=]/, `${file} assigns the expression hook to an instance`);
    }
});
