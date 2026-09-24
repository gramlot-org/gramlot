import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import {SvgBuilder, sourceTarget, sourceBagToTytx} from 'genro-builders-js';
import {Gramlot, GramlotBuilder} from '../src/index.js';

const SVG = 'http://www.w3.org/2000/svg';
const HTML = 'http://www.w3.org/1999/xhtml';
const XLINK = 'http://www.w3.org/1999/xlink';
function setup(transport = false) {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    return {document, app: new Gramlot({document, transport})};
}

test('one live renderer mounts nested SVG/HTML, updates native setters, and cleans the subtree', () => {
    const authored = new GramlotBuilder();
    const svg = authored.root.svg({id:'drawing', viewBox:'0 0 100 100'});
    svg.circle({id:'circle', cx:20, cy:20, r:10, stroke_width:2});
    svg.linearGradient({id:'gradient'}).stop({offset:'0%', stop_color:'red'});
    svg.html({id:'foreign', width:80, height:30}).div('Hello', {id:'label'});
    svg.use({id:'use', 'xlink:href':'#circle'});
    const {document, app} = setup();
    app.startSource(authored.toTytx());
    const drawing = document.getElementById('drawing');
    const circle = document.getElementById('circle');
    assert.equal(drawing.namespaceURI, SVG);
    assert.equal(drawing.getAttribute('viewBox'), '0 0 100 100');
    assert.equal(circle.namespaceURI, SVG);
    assert.equal(circle.getAttribute('stroke-width'), '2');
    assert.equal(document.getElementById('gradient').localName, 'linearGradient');
    assert.equal(document.getElementById('foreign').localName, 'foreignObject');
    assert.equal(document.getElementById('foreign').namespaceURI, SVG);
    assert.equal(document.getElementById('label').namespaceURI, HTML);
    const use = document.getElementById('use');
    assert.equal(use.getAttributeNS(XLINK, 'href'), '#circle');

    const svgNode = app.source.getItem('main').getNodes()[0];
    const circleNode = svgNode.value.getNodes()[0];
    const useNode = svgNode.value.getNodes().at(-1);
    circleNode.setAttr({r:15, stroke_width:4});
    assert.strictEqual(document.getElementById('circle'), circle);
    assert.equal(circle.getAttribute('r'), '15');
    assert.equal(circle.getAttribute('stroke-width'), '4');
    useNode.setAttr({'xlink:href':null});
    assert.equal(use.hasAttributeNS(XLINK,'href'), false);
    assert.throws(() => circleNode.builder.wrapSource(circleNode).g(), /child|allowed/i);
    assert.equal(circle.children.length, 0);
    const rectNode = sourceTarget(svgNode.builder.wrapSource(svgNode).rect({id:'rect', width:5, height:6}));
    assert.equal(document.getElementById('rect').namespaceURI, SVG);
    svgNode.value.popNode(rectNode.label);
    assert.equal(document.getElementById('rect'), null);
    let cleaned = 0;
    app.renderer.onDispose(circleNode, () => cleaned++);
    app.source.popNode('main');
    assert.equal(cleaned, 1);
    assert.equal(app.renderer.records.size, 0);
    assert.equal(document.querySelector('svg'), null);
    app.dispose();
});

test('direct live authoring enters SVG before the insert event is rendered', () => {
    const {document, app} = setup();
    const svg = app.builder.root.svg({id:'direct'});
    svg.circle({r:8});
    svg.html({width:20, height:20}).div('HTML');
    assert.equal(document.querySelector('circle').namespaceURI, SVG);
    assert.equal(document.querySelector('foreignObject').namespaceURI, SVG);
    assert.equal(document.querySelector('foreignObject > div').namespaceURI, HTML);
    assert.equal(app.renderer.records.size, 4);
    app.dispose();
});

test('remote SVG children use the destination dialect and preserve the existing container', async () => {
    const authored = new GramlotBuilder();
    authored.root.svg({id:'drawing'}).g({id:'slot'}).circle({r:1});
    const replacement = new SvgBuilder();
    replacement.root.rect({id:'new', width:30, height:20});
    const {document, app} = setup({main:async () => authored.toTytx(),
        source:async () => sourceBagToTytx(replacement.source)});
    await app.start();
    const target = app.source.getItem('main').getNodes()[0].value.getNodes()[0];
    const parent = document.getElementById('drawing');
    await app.remoteSource(target, 'details');
    assert.strictEqual(document.getElementById('drawing'), parent);
    assert.equal(document.querySelector('circle'), null);
    assert.equal(document.getElementById('new').namespaceURI, SVG);
    assert.equal(target.value.getNodes()[0].builder.constructor._name, 'svg');
    app.dispose();
});

test('Python Source crosses SVG/HTML boundaries through typed transport into the live DOM', () => {
    const root = fileURLToPath(new URL('../../', import.meta.url));
    const wire = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', `
from gramlot import GramlotBuilder
from genro_tytx import to_tytx
b=GramlotBuilder()
s=b.root.svg(viewBox='0 0 10 10')
s.circle(cx=5, cy=5, r=4, stroke_width=2)
s.html(width=10,height=10).div('Python')
print(to_tytx(b.source))
`], {cwd:root, encoding:'utf8'}).trim();
    const {document, app} = setup();
    app.startSource(wire);
    assert.equal(document.querySelector('circle').namespaceURI, SVG);
    assert.equal(document.querySelector('circle').getAttribute('stroke-width'), '2');
    assert.equal(document.querySelector('foreignObject').namespaceURI, SVG);
    assert.equal(document.querySelector('foreignObject > div').namespaceURI, HTML);
    assert.equal(document.querySelector('foreignObject > div').textContent, 'Python');
    app.dispose();
});
