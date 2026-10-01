import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {HtmlBuilder, SvgBuilder, sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder, GramlotHtmlRenderer, GramlotSvgRenderer} from '../src/index.js';

const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';
const SVG = 'http://www.w3.org/2000/svg';
const HTML = 'http://www.w3.org/1999/xhtml';
const XLINK = 'http://www.w3.org/1999/xlink';

// The same Sources authored in JavaScript (CASES) and in Python (PYTHON_CASES), rendered to a string.
const CASES = {
    shortcuts(root) {
        root.div({background_color: 'red', rounded_top: 10, style_aspect_ratio: '16/9'});
        root.div('t', {style: 'color: red', color: 'blue'});
    },
    names(root) {
        root.div({data_role: 'x', aria_label: 'y', _class: 'c', html_width: 3});
        const svg = root.svg({xmlns_xlink: XLINK, data_kind: 'chart'});
        svg.rect({width: 10, font_size: 12, data_role: 'r', aria_label: 'q'});
        svg.g();
    },
    native(root) {
        root.canvas({width: 300, id: 'c'});
        root.img({width: 100, height: 50, alt: 'a'});
        root.table({width: '100%', border: 1});
        root.embed({width: 1, height: 2});
        root.div({width: 4});
    },
    nulls(root) {
        root.div({background_color: '^bg', color: 'blue', title: '^missing'});
        root.canvas({width: '^missing'});
    },
    text(root) {
        root.p({_text: 'hello'}).span('x');
        root.div(true);
        root.div(false);
    },
    mask(root, data) {
        data.setItem('m.empty', '');
        data.setItem('m.zero', 0);
        data.setItem('m.no', false);
        data.setItem('m.pct', 'a%sb');
        data.setItem('m.num', 1234.5);
        for (const name of ['none', 'empty', 'zero', 'no', 'pct']) root.div(`^m.${name}`, {mask: 'Ciao %s'});
        root.div('^m.num', {format: '#,###.00', places: 2, locale: 'it', dtype: 'N'});
    },
    foreign(root) {
        root.svg().html({width: 5}).div({color: 'green', data_x: '1'});
    },
    dataElements(root) {
        root.dataSetter({destination_path: 'a', value: '^x'});
        root.dataSetter({destination_path: 'b', value: '=y'});
        root.dataSetter({destination_path: 'c', value: '==x+1'});
        root.dataSetter({destination_path: 'd', value: '${x}'});
        root.dataSetter({destination_path: 'e', value: '^.literal'});
        root.div('ok');
    },
};
const DOCUMENTS = {
    htmlRoot(root) {
        const html = root.html();
        html.head().title('t');
        html.body().div('x');
    },
    otherRoot(root) {
        root.div('x');
        root.div('y');
    },
};
const PYTHON_CASES = String.raw`
import json
from gramlot import GramlotBuilder

XLINK = "http://www.w3.org/1999/xlink"

def shortcuts(root, data):
    root.div(background_color="red", rounded_top=10, style_aspect_ratio="16/9")
    root.div("t", style="color: red", color="blue")

def names(root, data):
    root.div(data_role="x", aria_label="y", _class="c", html_width=3)
    svg = root.svg(xmlns_xlink=XLINK, data_kind="chart")
    svg.rect(width=10, font_size=12, data_role="r", aria_label="q")
    svg.g()

def native(root, data):
    root.canvas(width=300, id="c")
    root.img(width=100, height=50, alt="a")
    root.table(width="100%", border=1)
    root.embed(width=1, height=2)
    root.div(width=4)

def nulls(root, data):
    root.div(background_color="^bg", color="blue", title="^missing")
    root.canvas(width="^missing")

def text(root, data):
    root.p(_text="hello").span("x")
    root.div(True)
    root.div(False)

def mask(root, data):
    data.set_item("m.empty", "")
    data.set_item("m.zero", 0)
    data.set_item("m.no", False)
    data.set_item("m.pct", "a%sb")
    data.set_item("m.num", 1234.5)
    for name in ("none", "empty", "zero", "no", "pct"):
        root.div(f"^m.{name}", mask="Ciao %s")
    root.div("^m.num", format="#,###.00", places=2, locale="it", dtype="N")

def foreign(root, data):
    root.svg().html(width=5).div(color="green", data_x="1")

def dataElements(root, data):
    root.dataSetter(destination_path="a", value="^x")
    root.dataSetter(destination_path="b", value="=y")
    root.dataSetter(destination_path="c", value="==x+1")
    root.dataSetter(destination_path="d", value="\u0024{x}")
    root.dataSetter(destination_path="e", value="^.literal")
    root.div("ok")

def htmlRoot(root, data):
    html = root.html()
    html.head().title("t")
    html.body().div("x")

def otherRoot(root, data):
    root.div("x")
    root.div("y")

def rendered(case, **opts):
    builder = GramlotBuilder()
    case(builder.root, builder.data)
    return builder.render(**opts)

cases = {case.__name__: rendered(case) for case in (shortcuts, names, native, nulls, text, mask, foreign, dataElements)}
documents = {case.__name__: rendered(case, doctype=True) for case in (htmlRoot, otherRoot)}
print(json.dumps({"cases": cases, "documents": documents}))
`;

/** The string render of a JavaScript case. */
function rendered(authoring, opts = {}) {
    const builder = new GramlotBuilder();
    authoring(builder.root, builder.data);
    return builder.render(opts);
}

/** A live page with `authoring` mounted as its Source. */
function mounted(authoring) {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    const app = new Gramlot({document, transport: false});
    const authored = new GramlotBuilder();
    authoring(authored.root, authored.data);
    app.startSource(authored.toTytx());
    return {document, app, main: app.source.getItem('main')};
}

const EXPECTED = {
    shortcuts: '<div style="background-color: red; aspect-ratio: 16/9; border-top-left-radius: 10px; border-top-right-radius: 10px"></div>'
        + '<div style="color: blue">t</div>',
    names: '<div data-role="x" aria-label="y" class="c" width="3"></div>'
        + `<svg xmlns:xlink="${XLINK}" data-kind="chart"><rect width="10" font-size="12" data-role="r" aria-label="q" /><g></g></svg>`,
    native: '<canvas id="c" width="300"></canvas><img alt="a" width="100" height="50"/>'
        + '<table width="100%" border="1"></table><embed width="1" height="2"/><div style="width: 4"></div>',
    nulls: '<div style="color: blue"></div><canvas></canvas>',
    text: '<p>hello<span>x</span></p><div>true</div><div>false</div>',
    mask: '<div></div><div></div><div>Ciao 0</div><div>Ciao false</div><div>Ciao a%sb</div><div>1234.5</div>',
    foreign: `<svg><foreignObject width="5" xmlns="${SVG}"><div xmlns="${HTML}" data-x="1" style="color: green"></div></foreignObject></svg>`,
    dataElements: '<div>ok</div>',
};

test('Python and JavaScript GramlotHtmlRenderer give identical strings for the same Source', () => {
    const py = JSON.parse(execFileSync(python, ['-c', PYTHON_CASES], {encoding: 'utf8'}));
    const js = Object.fromEntries(Object.entries(CASES).map(([name, authoring]) => [name, rendered(authoring)]));
    assert.deepEqual(js, py.cases);
    assert.deepEqual(js, EXPECTED);
    const documents = Object.fromEntries(Object.entries(DOCUMENTS)
        .map(([name, authoring]) => [name, rendered(authoring, {doctype: true})]));
    assert.deepEqual(documents, py.documents);
    assert.deepEqual(documents, {
        htmlRoot: '<!doctype html><html><head><title>t</title></head><body><div>x</div></body></html>',
        otherRoot: '<!doctype html><html><div>x</div><div>y</div></html>',
    });
});

test('GramlotBuilder renders through GramlotHtmlRenderer, and SVG nodes through one GramlotSvgRenderer it owns', () => {
    const builder = new GramlotBuilder();
    const renderer = builder.renderer_html;
    assert.ok(renderer instanceof GramlotHtmlRenderer);
    assert.equal(renderer.getRender(builder), renderer);
    const html = new HtmlBuilder();
    assert.equal(renderer.getRender(html), renderer);
    const svg = new SvgBuilder();
    const svgRenderer = renderer.getRender(svg);
    assert.ok(svgRenderer instanceof GramlotSvgRenderer);
    assert.equal(svgRenderer.owner, renderer);
    assert.equal(renderer.getRender(svg), svgRenderer);
});

test('the attribute prefix html_ is the literal attribute and gramlot_ is an error', () => {
    assert.equal(rendered(root => root.div({html_width: 3, html_color: 'x'})), '<div width="3" color="x"></div>');
    assert.throws(() => rendered(root => root.div({gramlot_width: 1})),
        /gramlot_width: the attribute prefix 'gramlot_' is not accepted; use the prefix 'html_'/);
});

test('style shortcuts, names and noConvertStyle reach the live DOM', () => {
    const {document, app} = mounted(root => {
        root.div({id: 'panel', background_color: 'red', rounded_top: 10, style_aspect_ratio: '16/9',
            data_role: 'x', aria_label: 'y', _class: 'c'});
        root.div('t', {id: 'mixed', style: 'color: red', color: 'blue'});
        root.canvas({id: 'canvas', width: 300});
        root.img({id: 'image', width: 100});
        root.table({id: 'table', width: '100%', border: 1});
        const svg = root.svg({id: 'drawing', xmlns_xlink: XLINK, data_kind: 'chart'});
        svg.rect({id: 'rect', width: 10, font_size: 12, data_role: 'r'});
        svg.html({id: 'foreign', width: 80}).div({id: 'inner', color: 'green'});
    });
    const panel = document.getElementById('panel');
    assert.equal(panel.style.backgroundColor, 'red');
    assert.equal(panel.style.aspectRatio, '16/9');
    assert.equal(panel.style.borderTopLeftRadius, '10px');
    assert.equal(panel.getAttribute('data-role'), 'x');
    assert.equal(panel.getAttribute('aria-label'), 'y');
    assert.equal(panel.getAttribute('class'), 'c');
    assert.equal(panel.hasAttribute('background_color'), false);
    assert.equal(document.getElementById('mixed').getAttribute('style'), 'color: blue');
    for (const id of ['canvas', 'image']) {
        assert.equal(document.getElementById(id).hasAttribute('style'), false);
    }
    assert.equal(document.getElementById('canvas').getAttribute('width'), '300');
    assert.equal(document.getElementById('image').getAttribute('width'), '100');
    assert.equal(document.getElementById('table').getAttribute('width'), '100%');
    assert.equal(document.getElementById('table').getAttribute('border'), '1');
    const drawing = document.getElementById('drawing');
    assert.equal(drawing.getAttribute('xmlns:xlink'), XLINK);
    assert.equal(drawing.getAttribute('data-kind'), 'chart');
    const rect = document.getElementById('rect');
    assert.equal(rect.namespaceURI, SVG);
    assert.equal(rect.getAttribute('width'), '10');
    assert.equal(rect.getAttribute('font-size'), '12');
    assert.equal(rect.getAttribute('data-role'), 'r');
    assert.equal(rect.hasAttribute('style'), false);
    assert.equal(document.getElementById('inner').namespaceURI, HTML);
    assert.equal(document.getElementById('inner').style.color, 'green');
    app.dispose();
});

test('setAttr updates a shortcut in style and a noConvertStyle attribute natively, on the same element (R16)', () => {
    const {document, app, main} = mounted(root => {
        root.div({id: 'panel', background_color: 'red', color: 'blue'});
        root.canvas({id: 'canvas', width: 300});
    });
    const [panelNode, canvasNode] = main.getNodes();
    const panel = document.getElementById('panel');
    const canvas = document.getElementById('canvas');
    panelNode.setAttr({background_color: 'green'});
    assert.strictEqual(document.getElementById('panel'), panel);
    assert.equal(panel.style.backgroundColor, 'green');
    assert.equal(panel.style.color, 'blue');
    panelNode.setAttr({background_color: null});
    assert.equal(panel.style.backgroundColor, '');
    assert.equal(panel.style.color, 'blue');
    assert.equal(panel.getAttribute('style').includes('null'), false);
    canvasNode.setAttr({width: 400});
    assert.strictEqual(document.getElementById('canvas'), canvas);
    assert.equal(canvas.getAttribute('width'), '400');
    assert.equal(canvas.hasAttribute('style'), false);
    canvasNode.setAttr({width: null});
    assert.equal(canvas.hasAttribute('width'), false);
    app.dispose();
});

test('an SVG setAttr keeps SVG names and no style; the live text uses mask and _text as the string render', () => {
    const {document, app, main} = mounted(root => {
        root.svg().rect({id: 'rect', width: 1, font_size: 2});
        root.div('v', {id: 'masked', mask: 'Ciao %s', format: 'x', places: 2});
        root.p({id: 'mixed', _text: 'hello'}).span('x');
    });
    const rectNode = sourceTarget(main.getNodes()[0].value.getNodes()[0]);
    const rect = document.getElementById('rect');
    rectNode.setAttr({font_size: 5, data_role: 'r'});
    assert.strictEqual(document.getElementById('rect'), rect);
    assert.equal(rect.getAttribute('font-size'), '5');
    assert.equal(rect.getAttribute('data-role'), 'r');
    assert.equal(rect.hasAttribute('style'), false);
    const masked = document.getElementById('masked');
    assert.equal(masked.textContent, 'Ciao v');
    for (const name of ['mask', 'format', 'places']) assert.equal(masked.hasAttribute(name), false);
    main.getNodes()[1].setValue('w');
    assert.equal(document.getElementById('masked').textContent, 'Ciao w');
    assert.equal(document.getElementById('mixed').textContent, 'hellox');
    assert.equal(document.getElementById('mixed').hasAttribute('_text'), false);
    app.dispose();
});
