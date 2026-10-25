import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import editors from '../src/components/editors.js';
import {codeMirrorWithOptions} from '../src/server/page.js';
import inputs from '../src/components/inputs.js';
import layout from '../src/components/layout.js';
import {undo, undoDepth} from '@codemirror/commands';
import {EditorState} from '@codemirror/state';

const {window} = new JSDOM('<body></body>', {pretendToBeVisual:true});
for (const name of ['window','document','MutationObserver','Window','HTMLElement','Node','getComputedStyle']) globalThis[name] = window[name];
window.ResizeObserver = class {observe() {} unobserve() {} disconnect() {}};
window.Range.prototype.getClientRects = () => [];
window.Range.prototype.getBoundingClientRect = () => ({left:0,right:0,top:0,bottom:0,width:0,height:0});
function fixture(author) {
    window.document.body.innerHTML = '<main id="gramlot-root"></main>';
    const app = new Gramlot({document:window.document, transport:false, collections:[inputs,layout,editors]});
    const builder = new GramlotBuilder(null,{collections:[inputs,layout,editors]});
    app.data.setItem('document.content','def hello():\n    return 42\n');
    author(builder.root, app);
    app.src.startSource(builder.toTytx());
    return {app, host:window.document.getElementById('editor'), stop:() => app.dispose()};
}
function base(root, attributes={}) {root.codeMirror({id:'editor',value:'^document.content',language:'python',...attributes});}

test('editor grammar is portable; engine is not loaded by grammar authoring', () => {
    assert.deepEqual(editors.toDocument(), JSON.parse(readFileSync(new URL('../../src/gramlot/collections/editors.json',import.meta.url))));
    const b = new GramlotBuilder(null,{collections:[inputs,layout,editors]});
    codeMirrorWithOptions(b.root,{datapath:'document',value:'^.content'});
    assert.match(b.toTytx(), /codeMirror/);
});

test('live binding writes once; external replacements are silent and reset history', async () => {
    const {app,host} = fixture(root => base(root));
    await host.ready;
    const view=host.editor.view;
    let inputs=0; host.addEventListener('input',()=>inputs++);
    view.dispatch({changes:{from:0,insert:'# comment\n'},selection:{anchor:10}});
    assert.equal(app.data.getItem('document.content'),view.state.doc.toString());
    assert.equal(inputs,1);
    assert.equal(undoDepth(view.state),1);
    app.data.setItem('document.content','new document');
    assert.equal(view.state.doc.toString(),'new document');
    assert.equal(inputs,1); assert.equal(undoDepth(view.state),0);
    host.remove(); assert.equal(host.editor,null);
});

test('configuration and theme do not replace view, selection or undo history',async () => {
    const {app,host}=fixture((root,app)=>{app.data.setItem('wrap',true); app.data.setItem('language','python');base(root,{lineWrapping:'^wrap',language:'^language'});});
    await host.ready; const view=host.editor.view;
    view.dispatch({changes:{from:0,insert:'x'},selection:{anchor:1}});
    app.data.setItem('wrap',false); app.data.setItem('language','markdown');
    assert.equal(host.editor.view,view); assert.equal(view.state.selection.main.head,1); assert.equal(undoDepth(view.state),1);
    assert.equal(view.contentDOM.classList.contains('cm-lineWrapping'),false); undo(view); assert.match(app.data.getItem('document.content'),/^def/);
    app.data.setItem('document.content','# markdown'); assert.equal(view.contentDOM.classList.contains('cm-lineWrapping'),false);
    host.remove();
});

test('external restore of the initial value reaches the editor after a live edit',async () => {
    const {app,host}=fixture(root=>base(root));
    await host.ready;
    const original=app.data.getItem('document.content');
    host.editor.view.dispatch({changes:{from:0,insert:'# edit\n'}});
    app.data.setItem('document.content',original);
    assert.equal(host.editor.view.state.doc.toString(),original);
    host.remove();
});

test('readonly and disabled use engine facets and keep Data projection',async () => {
    const {app,host}=fixture((root,app)=>{app.data.setItem('locked',true);app.data.setItem('disabled',false);base(root,{readonly:'^locked',disabled:'^disabled'});});
    await host.ready; const view=host.editor.view;
    assert.equal(view.state.facet(EditorState.readOnly),true);
    app.data.setItem('document.content','incoming'); assert.equal(view.state.doc.toString(),'incoming');
    app.data.setItem('locked',false); assert.equal(view.state.facet(EditorState.readOnly),false);
    app.data.setItem('disabled',true); assert.equal(view.contentDOM.getAttribute('contenteditable'),'false');
    host.remove();
});

test('options composition controls the same editor through Data',async () => {
    const {app,host}=fixture(root=>codeMirrorWithOptions(root,{datapath:'document',value:'^.content',id:'editor',language:'python'}));
    await host.ready; const view=host.editor.view;
    app.data.setItem('document.settings.indentUnit',2);
    app.data.setItem('document.settings.lineNumbers',false);
    assert.equal(host.parameters.indentUnit,2); assert.equal(host.editor.view,view);
    assert.equal(host.shadowRoot.querySelector('.cm-lineNumbers'),null);
    host.remove();
});

test('disconnect while loading does not create an orphan editor',async () => {
    const {host}=fixture(root=>base(root));const ready=host.ready;host.remove();await ready;assert.equal(host.editor,null);
});

test('all declared languages reconfigure in place and diagnostics can be cleared',async () => {
    const {app,host}=fixture((root,app)=>{app.data.setItem('language','text');base(root,{language:'^language'});});
    await host.ready; const view=host.editor.view;
    for (const language of editors.components[0].parameters.language.enum) {
        app.data.setItem('language',language);
        assert.equal(host.editor.view,view);assert.equal(host.parameters.language,language);
    }
    host.setDiagnostics([{from:0,to:3,severity:'error',message:'Example diagnostic'}]);
    host.revealPosition(3); assert.equal(view.state.selection.main.head,3);
    host.setDiagnostics([]); host.remove();
});

test('live false commits on leaving editor; native contenteditable events do not double-write',async () => {
    const {app,host}=fixture(root=>base(root,{live:false}));
    await host.ready; const view=host.editor.view;
    view.dispatch({changes:{from:0,insert:'x'}});
    assert.match(app.data.getItem('document.content'),/^def/);
    view.contentDOM.dispatchEvent(new window.Event('input',{bubbles:true}));
    assert.match(app.data.getItem('document.content'),/^def/);
    view.contentDOM.dispatchEvent(new window.FocusEvent('focusout',{bubbles:true}));
    assert.match(app.data.getItem('document.content'),/^xdef/);
    host.remove();
});

test('save shortcut is consumed but never published while readonly or disabled',async()=>{
    const {keymap}=await import('@codemirror/view');
    const {app,host}=fixture((root,app)=>{app.data.setItem('locked',true);app.data.setItem('disabled',false);base(root,{readonly:'^locked',disabled:'^disabled'});});
    try {
        await host.ready;const view=host.editor.view,calls=[];
        host.pageContext.publish=(name,payload)=>calls.push({name,payload});
        const save=()=>view.state.facet(keymap).flat().find(item=>item.key==='Mod-s').run(view);
        assert.equal(save(),true);assert.equal(calls.filter(c=>c.name==='save').length,0);
        app.data.setItem('locked',false);app.data.setItem('disabled',true);
        assert.equal(save(),true);assert.equal(calls.filter(c=>c.name==='save').length,0);
        app.data.setItem('disabled',false);save();
        assert.deepEqual(calls.filter(c=>c.name==='save'),[{name:'save',payload:{value:app.data.getItem('document.content')}}]);
    } finally {app.dispose();}
});
