import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createMarkdownCodec} from '../src/components/markdown-codec.js';
import {renderMarkdownDocument} from '../src/components/markdown-document.js';
import {Gramlot,GramlotBuilder} from '../src/index.js';
import editors from '../src/components/editors.js';
import {TextSelection, Plugin, PluginKey} from 'prosemirror-state';

const {window}=new JSDOM('<body></body>',{pretendToBeVisual:true});
for(const name of ['window','document','MutationObserver','Window','HTMLElement','Node','getComputedStyle'])globalThis[name]=window[name];
window.Range.prototype.getClientRects=()=>[];
window.Range.prototype.getBoundingClientRect=()=>({left:0,right:0,top:0,bottom:0,width:0,height:0});
const codec=createMarkdownCodec(window.document);
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
function fixture(source,attrs={},previewAttrs={}) {
    window.document.body.innerHTML='<main id="gramlot-root"></main>';
    const app=new Gramlot({document:window.document,transport:false,collections:[editors]});
    const builder=new GramlotBuilder(null,{collections:[editors]});
    app.data.setItem('source',source);
    builder.root.markdownEditor({id:'editor',value:'^source',...attrs});
    builder.root.markdownPreview({id:'preview',value:'^source',...previewAttrs});
    app.src.startSource(builder.toTytx());
    return {app,host:window.document.getElementById('editor'),preview:window.document.getElementById('preview'),stop:()=>app.dispose()};
}

test('supported Markdown keeps its document structure and complex blocks retain exact source',()=>{
    const source='# Title\n\nParagraph **bold** and *italic*.\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n<div>HTML</div>\n\n~~strike~~\n';
    const parsed=codec.parse(source),types=[];parsed.forEach(n=>types.push(n.type.name));
    assert.deepEqual(types,['heading','paragraph','source_block','source_block','source_block']);
    const result=codec.serialize(parsed);assert.ok(result.includes('| A | B |\n| - | - |\n| 1 | 2 |'));assert.ok(result.includes('<div>HTML</div>'));assert.ok(result.includes('~~strike~~'));
    assert.equal(codec.parse('```html\n<div>x</div>\n```').firstChild.type.name,'code_block');
    const nested=codec.parse('> | A | B |\n> | - | - |\n> | 1 | 2 |');assert.equal(nested.firstChild.type.name,'source_block');
});
test('reference definitions and frontmatter retain the whole source as one opaque block',()=>{
    for(const source of ['---\ntitle: Demo\n---\n\n# Heading','[guide]: https://example.com\n\n[guide]']){
        const doc=codec.parse(source);assert.equal(doc.childCount,1);assert.equal(doc.firstChild.attrs.source,source);
    }
});
test('Markdown preview renders syntax while keeping active HTML and unsafe links inert',()=>{
    const html=renderMarkdownDocument('# Title\n\n**Bold**\n\n<script>alert(1)</script>\n\n[x](javascript:alert(1))');
    assert.match(html,/<h1>Title<\/h1>/);assert.match(html,/<strong>Bold<\/strong>/);
    assert.doesNotMatch(html,/<script/);assert.doesNotMatch(html,/<a href="javascript/);assert.match(html,/default-src 'none'/);
});
test('live edits update Data and preview; undo restores exact source, external updates retain the engine and history',async()=>{
    const original='# Original\n\nA paragraph.\n',f=fixture(original);await f.host.ready;
    assert.equal(f.preview.parameters.allowHtml,false);
    const engine=f.host.engine,view=engine.view;
    let inputs=0;f.host.addEventListener('input',()=>inputs++);
    f.host.engine.view.dispatch(f.host.engine.view.state.tr.insertText('Changed ',1));
    assert.match(f.app.data.getItem('source'),/# Changed Original/);assert.equal(inputs,1);
    assert.match(f.preview.frame.srcdoc,/<h1>Changed Original<\/h1>/);assert.equal(f.preview.frame.getAttribute('sandbox'),'');
    assert.equal(f.host.undo(),true);assert.equal(f.app.data.getItem('source'),original);
    assert.equal(f.host.redo(),true);assert.match(f.app.data.getItem('source'),/Changed/);
    f.app.data.setItem('source','## Replaced\n');await f.host.ready;
    assert.equal(f.host.engine,engine);assert.equal(engine.view,view);
    assert.equal(view.state.doc.firstChild.textContent,'Replaced');
    assert.equal(inputs,3); // typing, undo, redo; external Data never echoes an input
    assert.equal(f.host.undo(),true);assert.match(f.app.data.getItem('source'),/Changed/);
    assert.equal(f.host.undo(),true);assert.equal(f.app.data.getItem('source'),original);
    assert.equal(f.host.redo(),true);assert.equal(f.host.redo(),true);
    assert.equal(view.state.doc.firstChild.textContent,'Replaced');
    f.stop();await tick();assert.equal(f.host.engine,null);
});
test('toolbar formatting uses the same Markdown Data and read-only rejects document changes',async()=>{
    const f=fixture('Hello world\n',{readonly:'^locked'});f.app.data.setItem('locked',false);await f.host.ready;
    const view=f.host.engine.view;view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc,1,6)));
    f.host.shadowRoot.querySelector('.markdown-tools button').click();assert.match(f.app.data.getItem('source'),/\*\*Hello\*\* world/);
    const saved=f.app.data.getItem('source');f.app.data.setItem('locked',true);
    assert.equal(f.host.shadowRoot.querySelector('.markdown-tools button').disabled,true);
    view.dispatch(view.state.tr.insertText('Blocked',1));assert.equal(f.app.data.getItem('source'),saved);assert.equal(f.host.undo(),false);
    f.app.data.setItem('source','External update');await f.host.ready;assert.equal(f.host.engine.view.state.doc.textContent,'External update');f.stop();
});
test('deferred writes commit on blur and disabled controls remain noneditable',async()=>{
    const f=fixture('Before',{live:false,disabled:'^disabled'});f.app.data.setItem('disabled',false);await f.host.ready;
    f.host.engine.view.dispatch(f.host.engine.view.state.tr.insertText('After ',1));assert.equal(f.app.data.getItem('source'),'Before');
    f.host.engine.view.dom.dispatchEvent(new window.FocusEvent('blur'));assert.equal(f.app.data.getItem('source'),'After Before');
    f.app.data.setItem('disabled',true);assert.equal(f.host.engine.view.dom.getAttribute('contenteditable'),'false');assert.equal(f.host.engine.view.dom.getAttribute('tabindex'),'-1');f.stop();
});
test('native contenteditable mutations pass through the same ProseMirror model into Data',async()=>{
    const f=fixture('# Original\n');await f.host.ready;
    f.host.engine.view.dom.querySelector('h1').firstChild.nodeValue='Typed in browser';
    f.host.engine.view.domObserver.flush();
    assert.equal(f.app.data.getItem('source'),'# Typed in browser');
    f.stop();
});
test('rich paste parsing excludes unsafe link and image targets',async()=>{
    const {DOMParser}=await import('prosemirror-model');
    const content=window.document.createElement('div');
    content.innerHTML='<p><a href="javascript:alert(1)">unsafe</a> <a href="https://example.com">safe</a><img src="data:image/svg+xml,bad"></p>';
    const parsed=DOMParser.fromSchema(codec.schema).parse(content);
    let links=[],images=[];parsed.descendants(node=>{for(const mark of node.marks)if(mark.type.name==='link')links.push(mark.attrs.href);if(node.type.name==='image')images.push(node.attrs.src);});
    assert.deepEqual(links,['https://example.com']);assert.deepEqual(images,[]);
});
test('disposing during lazy startup does not leave an editor or late writes',async()=>{
    const f=fixture('Draft');f.stop();await f.host.ready;await tick();
    assert.equal(f.host.engine,null);assert.equal(f.host.isConnected,false);
});


test('optional embedded HTML preserves formatting but strips executable content',()=>{
    const source = '<div class="note" style="color:red"><strong>HTML note</strong></div>\n\n' +
        '<script>alert(1)</script><img src="x" onerror="alert(2)">' +
        '<a href="javascript:alert(3)" onclick="alert(4)">bad link</a>' +
        '<iframe srcdoc="&lt;script&gt;alert(5)&lt;/script&gt;"></iframe>' +
        '<style>body{display:none}</style><form><input name="x"></form>';
    const html=renderMarkdownDocument(source,{allowHtml:true,document:window.document});
    const body=new JSDOM(html).window.document.body;
    assert.equal(body.querySelector('.note strong').textContent,'HTML note');
    assert.equal(body.querySelector('.note').style.color,'red');
    assert.equal(body.querySelector('script,iframe,style,form,input'),null);
    assert.equal(body.querySelector('[onerror],[onclick],[srcdoc]'),null);
    assert.equal(body.querySelector('a').getAttribute('href'),null);
    assert.match(html,/default-src 'none'/);
    const disabled=renderMarkdownDocument(source);
    assert.match(disabled,/&lt;div/);assert.doesNotMatch(disabled,/<div class="note"/);
});

test('allowHtml binding changes only the preview, retaining Markdown and rich-editor history',async()=>{
    const original='A paragraph.\n\n<div class="note"><em>Embedded HTML</em></div>\n';
    const f=fixture(original,{}, {allowHtml:'^allowHtml'});f.app.data.setItem('allowHtml',false);await f.host.ready;
    const engine=f.host.engine;
    assert.equal(f.preview.parameters.allowHtml,false);
    assert.match(f.preview.frame.srcdoc,/&lt;div/);
    f.host.engine.view.dispatch(f.host.engine.view.state.tr.insertText('Edited ',1));
    const edited=f.app.data.getItem('source');
    assert.ok(edited.includes('<div class="note"><em>Embedded HTML</em></div>'));
    f.app.data.setItem('allowHtml',true);
    assert.match(f.preview.frame.srcdoc,/<div class="note"><em>Embedded HTML<\/em><\/div>/);
    assert.equal(f.app.data.getItem('source'),edited);assert.equal(f.host.engine,engine);
    assert.equal(f.preview.frame.getAttribute('sandbox'),'');
    assert.equal(f.host.shadowRoot.querySelector('.markdown-source-block em'),null);
    f.app.data.setItem('allowHtml',false);
    assert.match(f.preview.frame.srcdoc,/&lt;div/);
    assert.equal(f.host.undo(),true);assert.equal(f.app.data.getItem('source'),original);
    f.stop();
});


test('Data updates retain ProseMirror plugins and mapped selection without an input echo',async()=>{
    const f=fixture('# Heading\n\nParagraph.\n');await f.host.ready;
    const engine=f.host.engine,view=engine.view,key=new PluginKey('retained');
    const plugin=new Plugin({key,state:{init:()=>({retained:true}),apply:(_tr,value)=>value}});
    view.updateState(view.state.reconfigure({plugins:[...view.state.plugins,plugin]}));
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc,3)));
    const state=key.getState(view.state);let inputs=0;f.host.addEventListener('input',()=>inputs++);
    f.app.data.setItem('source','# Heading\n\nParagraph expanded.\n');
    assert.equal(f.host.engine,engine);assert.equal(engine.view,view);
    assert.equal(key.getState(view.state),state);assert.equal(view.state.selection.anchor,3);
    assert.equal(inputs,0);f.stop();
});
