import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {prepareHtmlDocument} from '../src/components/html-document.js';
import {HtmlPreview} from '../src/components/html-preview.js';

const window=new JSDOM('').window;
test('rich edits preserve head, document attributes and protected body nodes',()=>{
    const source='<!DOCTYPE html><html lang="it"><head><title>Original</title><style>p{color:red}</style></head><body class="page"><p onclick="run()">Before</p><!--kept--><svg><circle r="4"/></svg><script>run()</script></body></html>';
    const doc=prepareHtmlDocument(source,window);
    assert.ok(!doc.html.includes('<script'));
    assert.ok(!doc.html.includes('onclick'));
    const result=doc.serialize(doc.html.replace('Before','After'));
    const parsed=new window.DOMParser().parseFromString(result,'text/html');
    assert.equal(parsed.documentElement.lang,'it');assert.equal(parsed.body.className,'page');
    assert.equal(parsed.title,'Original');assert.equal(parsed.querySelector('style').textContent,'p{color:red}');
    assert.equal(parsed.querySelector('script').textContent,'run()');assert.equal(parsed.querySelector('circle').getAttribute('r'),'4');
    assert.equal(parsed.querySelector('p').getAttribute('onclick'),'run()');assert.equal(parsed.querySelector('p').textContent,'After');
    assert.match(result,/<!--kept-->/);assert.match(result,/<!DOCTYPE html>/i);assert.doesNotMatch(result,/data-gramlot-/);
});
test('rich edits cannot remove or duplicate protected regions, or introduce active content',()=>{
    const doc=prepareHtmlDocument('<p>Text</p><script>keep()</script>',window);
    assert.throws(()=>doc.serialize('<p>Text</p>'),/Protected/);
    assert.throws(()=>doc.serialize(doc.html+doc.html),/Protected/);
    assert.throws(()=>doc.serialize(doc.html+'<img src="x" onerror="run()">'),/Active/);
    assert.throws(()=>doc.serialize(doc.html+'<iframe src="/">'),/Active/);
});
test('HTML fragments remain fragments and external replacements get independent protection',()=>{
    const doc=prepareHtmlDocument('<p>Hello <b>world</b></p>',window);
    assert.equal(doc.serialize('<p>Hello <em>world</em></p>'),'<p>Hello <em>world</em></p>');
    const a=prepareHtmlDocument('<p onclick="a()">A</p>',window),b=prepareHtmlDocument('<p onclick="b()">B</p>',window);
    assert.throws(()=>a.serialize(b.html),/Protected/);
});
test('preview descriptor exposes a read-only HTML value',()=>{
    assert.equal(HtmlPreview.name,'htmlPreview');
    assert.equal(HtmlPreview.parameters.value.binding,'read');
});
test('explicit body documents retain their body attributes',()=>{
    const doc=prepareHtmlDocument('<body class="sheet"><p>Before</p></body>',window);
    const result=doc.serialize(doc.html.replace('Before','After'));
    assert.match(result,/<body class="sheet">/);assert.match(result,/>After</);
});

test('preview binds external Data replacements while keeping scripts sandboxed',async()=>{
    const {Gramlot,GramlotBuilder}=await import('../src/index.js');
    const {default:editors}=await import('../src/components/editors.js');
    window.document.body.innerHTML='<main id="gramlot-root"></main>';
    const app=new Gramlot({document:window.document,transport:false,collections:[editors]});
    const builder=new GramlotBuilder(null,{collections:[editors]});
    app.data.setItem('html','<h1>First</h1><script>throw 1</script>');
    builder.root.htmlPreview({id:'preview',value:'^html'});
    app.src.startSource(builder.toTytx());
    const host=window.document.getElementById('preview');
    assert.equal(host.frame.getAttribute('sandbox'),'');
    assert.equal(host.frame.srcdoc,app.data.getItem('html'));
    app.data.setItem('html','<p>Second</p>');
    assert.equal(host.frame.srcdoc,'<p>Second</p>');assert.equal(host.frame.getAttribute('sandbox'),'');
    app.dispose();
});
test('IDE history belongs to the active HTML view, with Preview commands disabled',async()=>{
    const {IdeLogic}=await import('../src/ide-runtime.js');
    const {Bag}=await import('@genrojs/bag');
    const logic=new IdeLogic(),doc=new Bag();
    doc.setItem('view','code');
    const node=view=>({getRelativeData:()=>doc,getAttr:()=>view});
    logic.ideHistoryChanged(node('code'),{canUndo:true,canRedo:false});
    logic.ideHistoryChanged(node('rich'),{canUndo:false,canRedo:true});
    assert.equal(doc.getItem('undoDisabled'),false);assert.equal(doc.getItem('redoDisabled'),true);
    doc.setItem('view','rich');logic.ideHistoryState(doc);
    assert.equal(doc.getItem('undoDisabled'),true);assert.equal(doc.getItem('redoDisabled'),false);
    doc.setItem('view','preview');logic.ideHistoryState(doc);
    assert.equal(doc.getItem('undoDisabled'),true);assert.equal(doc.getItem('redoDisabled'),true);
});
