import test from 'node:test';
import assert from 'node:assert/strict';
import {Bag} from '@genrojs/bag';
import {DirectoryResolver, FileSystemController, fileSystemTree, FileSystemLogic} from '../src/filesystem.js';
import {IdeDocuments, RecentWorkspaces, documentKey} from '../src/ide-documents.js';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import tree from '../src/components/tree.js';
import {JSDOM} from 'jsdom';

function state() {const bag=new Bag();bag.setItem('store',new Bag());bag.setItem('documents',new Bag());return bag;}
const defer=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
const entries=()=>{const b=new Bag();b.setItem('folder',null,{path:'nested',caption:'Nested',is_directory:true});b.setItem('file',null,{path:'a.py',caption:'a.py',is_directory:false});return b;};

test('filesystem loads one level, caches child resolution and aborts pending descendants',async()=>{
    const calls=[],pending=defer();
    const app={rpc:{call:(type,method,args)=>{calls.push(args);return pending.promise;}}};
    const resolver=new DirectoryResolver({gramlot:app,root:'/workspace',onError:error=>{throw error;}});
    const bag=resolver.prepareValue(entries());
    assert.equal(calls.length,0); assert.equal(bag.getNode('file').resolver,null);
    const child=bag.getNode('folder').resolver;
    child.resolve();child.resolve();assert.equal(calls.length,1);assert.equal(calls[0].path,'nested');
    const result=new Bag();result.setItem('doc',null,{path:'nested/doc.md',caption:'doc.md'});
    pending.resolve(result);await child.loading;
    child.resolve();assert.equal(calls.length,1);assert.equal(bag.getNode('folder').staticValue,result);
    const pending2=defer();app.rpc.call=()=>pending2.promise;
    child.refresh();const loading=child.loading;resolver.abort();
    await assert.rejects(loading,{name:'AbortError'});
});

test('late and failed workspace requests cannot replace a successful tree',async()=>{
    const first=defer(),second=defer();
    const data=state(), app={rpc:{call:(t,m,{root})=>root==='first'?first.promise:second.promise}};
    const controller=new FileSystemController(app,data);
    const a=controller.open('first'),b=controller.open('second');
    second.resolve({root:'/second',entries:entries()});assert.equal(await b,'/second');
    first.resolve({root:'/first',entries:entries()});assert.equal(await a,null);assert.equal(data.getItem('root'),'/second');
    app.rpc.call=async()=>{throw new Error('Denied');};assert.equal(await controller.open('/denied'),null);
    assert.equal(data.getItem('root'),'/second');assert.equal(data.getItem('status'),'Denied');controller.dispose();
});

test('six recent directories preserve punctuation, deduplicate and survive a new preference instance',()=>{
    const map=new Map(),storage={getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,value)};
    const recent=new RecentWorkspaces(storage);
    for(let i=0;i<8;i++)recent.remember(`/data/folder, ${i}:docs`);
    recent.remember('/data/folder, 5:docs');
    const restored=new RecentWorkspaces(storage);
    assert.equal(restored.read().length,6);assert.equal(restored.read()[0],'/data/folder, 5:docs');
    assert.equal(restored.choices().getItem('r0'),'/data/folder, 5:docs');
    assert.equal(map.size,1);assert.ok(![...map.values()][0].includes('content'));
});

test('documents retain drafts across roots, save submitted snapshot and reject dirty/pending close',async()=>{
    const save=defer(),data=state();
    const app={rpc:{call:async(t,method,args)=>method==='document_read'?{path:args.path,content:'original',revision:'r1',writable:true,language:'text'}:save.promise}};
    const docs=new IdeDocuments(app,data);
    const key=await docs.open('/first','a.txt'),key2=await docs.open('/second','a.txt');
    assert.notEqual(key,key2);assert.equal(await docs.open('/first','a.txt'),key);
    const doc=docs.documents.getItem(key);doc.setItem('content','submitted');assert.equal(docs.close(key),false);
    const saving=docs.save(key);doc.setItem('content','typed during save');assert.equal(docs.close(key,true),false);
    assert.equal(docs.revert(key),false);
    save.resolve({revision:'r2'});assert.equal(await saving,true);
    assert.equal(doc.getItem('saved'),'submitted');assert.equal(doc.getItem('content'),'typed during save');assert.equal(docs.dirty(key),true);
    assert.equal(docs.revert(key),true);assert.equal(doc.getItem('content'),'submitted');assert.equal(docs.dirty(key),false);
    assert.equal(await docs.save(key),false);
    assert.equal(docs.close(key,true),true);assert.ok(docs.documents.getNode(key2));docs.dispose();
});

test('save errors retain revision and draft, disposal rejects pending read results',async()=>{
    const data=state(),app={rpc:{call:async(t,method,args)=>{if(method==='document_read')return {path:args.path,content:'x',revision:'r1',writable:true};throw new Error('conflict');}}};
    const docs=new IdeDocuments(app,data),key=await docs.open('/root','file.py');
    docs.documents.getItem(key).setItem('content','y');await assert.rejects(docs.save(key),/conflict/);
    assert.equal(docs.documents.getItem(key).getItem('revision'),'r1');assert.equal(docs.dirty(key),true);
    const pending=defer();app.rpc.call=()=>pending.promise;const loading=docs.open('/root','late.py');docs.dispose();
    pending.resolve({content:'late'});assert.equal(await loading,null);assert.equal(docs.documents.getNode(documentKey('/root','late.py')),null);
});

test('filesystem composition mounts through Logic and Data and loads a root',async t=>{
    const {window}=new JSDOM('<main id="gramlot-root"></main>');
    const app=new Gramlot({document:window.document,transport:false,collections:[tree]});
    app.src.logicRegistry.register(FileSystemLogic,{resource:'test:filesystem'});
    app.rpc.call=async()=>({root:'/workspace',entries:entries()});
    const builder=new GramlotBuilder(null,{collections:[tree]});
    fileSystemTree(builder.root,{datapath:'files'});
    app.src.startSource(builder.toTytx());
    t.after(()=>{app.dispose();window.close();});
    app.data.setItem('files.requestedRoot','/workspace');
    await new Promise(resolve=>setTimeout(resolve,20));
    assert.equal(app.data.getItem('files.root'),'/workspace');
    assert.match(window.document.querySelector('gramlot-tree').shadowRoot.textContent,/Nested/);
});

test('Python IDE closes Source before document Data and retains edits when closure is vetoed',async t=>{
    const {execFileSync}=await import('node:child_process');
    const {fileURLToPath}=await import('node:url');
    const {IdeLogic}=await import('../src/ide-runtime.js');
    const {default:layout}=await import('../src/components/layout.js');
    const {default:inputs}=await import('../src/components/inputs.js');
    const {default:editors}=await import('../src/components/editors.js');
    const source=execFileSync('python3',['-c',`
import json
from pathlib import Path
from gramlot import GramlotBuilder
from gramlot.page import IdePage
b = GramlotBuilder(collections=[json.loads(Path(f'src/gramlot/collections/{name}.json').read_text()) for name in ['inputs','layout','tree','editors']])
IdePage().main(b.root)
print(b.to_tytx())
`],{cwd:fileURLToPath(new URL('../..',import.meta.url)),encoding:'utf8'}).trim();
    const {window}=new JSDOM('<main id="gramlot-root"></main>',{url:'http://localhost/',pretendToBeVisual:true});
    for(const name of ['window','document','MutationObserver','Window','HTMLElement','Node','getComputedStyle'])globalThis[name]=window[name];
    window.ResizeObserver=class {observe(){}unobserve(){}disconnect(){}};
    window.Range.prototype.getClientRects=()=>[];
    window.Range.prototype.getBoundingClientRect=()=>({left:0,right:0,top:0,bottom:0,width:0,height:0});
    const errors=[];window.addEventListener('error',event=>errors.push(event.error));
    const app=new Gramlot({document:window.document,transport:false,collections:[layout,inputs,tree,editors]});
    app.src.logicRegistry.register(IdeLogic,{resource:'test:ide'});
    const calls=[];
    app.rpc.call=async(type,method,args)=>{
        calls.push({method,args});
        if(method==='document_create') return {root:args.root,path:args.path,revision:'new'};
        if(method==='workspace_open') return {root:args.root,entries:entries(),writable:true};
        if(method==='document_read' && args.path.endsWith('.md')) return {path:args.path,content:'<div><strong>HTML</strong></div>',revision:'md1',writable:true,language:'markdown'};
        return method==='document_read'
            ?{path:args.path,content:'value = 1\n',revision:'r1',writable:args.path !== 'draft.py',language:'python'}:{revision:'r2'};
    };
    app.src.startSource(source);await new Promise(resolve=>setTimeout(resolve,20));
    t.after(()=>{app.dispose();window.close();});
    assert.equal(window.document.getElementById('ide-open'),null);
    const workspace=window.document.getElementById('ide-workspace');
    workspace.control.value='/workspace';
    workspace.control.dispatchEvent(new window.Event('input',{bubbles:true}));
    workspace.control.dispatchEvent(new window.FocusEvent('blur'));
    workspace.control.dispatchEvent(new window.FocusEvent('focusout',{bubbles:true,composed:true}));
    await new Promise(resolve=>setTimeout(resolve,20));
    assert.equal(app.data.getItem('ide.browser.root'),'/workspace');
    workspace.control.dispatchEvent(new window.FocusEvent('focusout',{bubbles:true,composed:true}));
    assert.equal(calls.filter(call=>call.method==='workspace_open').length,1);
    await app.logic.ideOpenDocument('/workspace','a.py');
    const editor=window.document.querySelector('gramlot-code-mirror');assert.ok(editor,app.data.getItem('ide.status'));await editor.ready;
    const key=documentKey('/workspace','a.py');
    const button=name=>window.document.querySelector(`.gramlot-ide-${name}`).control;
    assert.equal(button('save').disabled,true);assert.equal(button('revert').disabled,true);
    editor.editor.view.dispatch({changes:{from:8,to:9,insert:'2'}});
    await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(button('save').disabled,false);assert.equal(button('revert').disabled,false);
    assert.equal(button('undo').disabled,false);assert.equal(button('redo').disabled,true);
    button('undo').click();await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(app.data.getItem(`ide.documents.${key}.content`),'value = 1\n');
    assert.equal(button('save').disabled,true);assert.equal(button('redo').disabled,false);
    button('redo').click();await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(app.data.getItem(`ide.documents.${key}.content`),'value = 2\n');
    button('revert').click();await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(editor.editor.view.state.doc.toString(),'value = 1\n');
    assert.equal(button('undo').disabled,true);assert.equal(button('redo').disabled,true);
    editor.editor.view.dispatch({changes:{from:8,to:9,insert:'2'}});
    await app.logic.ideOpenDocument('/workspace','draft.py');
    const draftKey=documentKey('/workspace','draft.py');
    const draft=app.logic.ideDocuments.documents.getItem(draftKey);
    assert.equal(draft.getItem('readonly'),false,'draft editing is allowed without host writes');
    draft.setItem('content','value = 42\n');
    assert.equal(draft.getItem('saveDisabled'),true);
    assert.equal(draft.getItem('revertDisabled'),false);
    const saves=calls.filter(call=>call.method==='document_save').length;
    assert.equal(await app.logic.ideDocuments.save(draftKey),false);
    assert.equal(calls.filter(call=>call.method==='document_save').length,saves);
    app.logic.ideDocuments.revert(draftKey);
    assert.equal(draft.getItem('content'),'value = 1\n');
    await new Promise(resolve=>setTimeout(resolve,20));
    window.document.querySelector('gramlot-tab-container').shadowRoot.querySelector('[aria-label="Close draft.py"]').click();
    await new Promise(resolve=>setTimeout(resolve,0));
    await app.logic.ideOpenDocument('/workspace','b.py');
    const secondEditor=window.document.querySelectorAll('gramlot-code-mirror')[1];await secondEditor.ready;
    assert.equal(app.data.getItem('ide.active'),documentKey('/workspace','b.py'));
    assert.equal(window.document.querySelectorAll('.gramlot-ide-save')[1].control.disabled,true);
    assert.equal(window.document.querySelectorAll('.gramlot-ide-undo')[1].control.disabled,true);
    const tabs=window.document.querySelector('gramlot-tab-container');
    tabs.shadowRoot.querySelector('[aria-label="Close ● a.py"]').click();
    assert.ok(app.data.getNode(`ide.documents.${key}`));assert.equal(editor.isConnected,true);
    button('save').click();await new Promise(resolve=>setTimeout(resolve,20));
    assert.equal(calls.find(call=>call.method==='document_save').args.path,'a.py');
    assert.equal(button('save').disabled,true);assert.equal(button('revert').disabled,true);
    tabs.shadowRoot.querySelector('[aria-label="Close a.py"]').click();
    await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(editor.isConnected,false);assert.equal(app.data.getNode(`ide.documents.${key}`),null);
    app.data.setItem('ide.newType','python');
    app.logic.ideNew();
    const newKey=app.data.getItem('ide.active');
    const newDoc=app.data.getItem(`ide.documents.${newKey}`);
    assert.equal(newDoc.getItem('saveDisabled'),false);
    assert.equal(newDoc.getItem('revertDisabled'),true);
    assert.equal(newDoc.getItem('createHidden'),true);
    await app.logic.ideSave(null,{documentKey:newKey});
    assert.equal(newDoc.getItem('createHidden'),false);
    assert.equal(calls.filter(call=>call.method==='document_create').length,0);
    app.logic.ideCancelCreate(null,{documentKey:newKey});
    assert.equal(newDoc.getItem('createHidden'),true);
    await app.logic.ideSave(null,{documentKey:newKey});
    newDoc.setItem('savePath','created.py');
    await app.logic.ideCreate(null,{documentKey:newKey});
    assert.equal(newDoc.getItem('isNew'),false);
    assert.equal(newDoc.getItem('saveDisabled'),true);
    assert.equal(newDoc.getItem('createHidden'),true);
    assert.equal(newDoc.getItem('path'),'created.py');
    await app.logic.ideOpenDocument('/workspace','created.py');
    assert.equal(app.data.getItem('ide.active'),newKey);
    await app.logic.ideOpenDocument('/workspace','note.md');
    const mdKey=app.data.getItem('ide.active'),mdDoc=app.data.getItem(`ide.documents.${mdKey}`);
    const htmlOption=window.document.querySelector('.gramlot-ide-allow-html').control;
    const mdPreview=window.document.querySelector('gramlot-markdown-preview');
    assert.equal(htmlOption.checked,false);assert.match(mdPreview.frame.srcdoc,/&lt;div/);
    htmlOption.click();await new Promise(resolve=>setTimeout(resolve,0));
    assert.equal(mdDoc.getItem('allowHtml'),true);
    assert.match(mdPreview.frame.srcdoc,/<div><strong>HTML<\/strong><\/div>/);
    assert.equal(mdDoc.getItem('content'),'<div><strong>HTML</strong></div>');
    assert.equal(mdDoc.getItem('saveDisabled'),true);
    assert.deepEqual(errors,[]);
});


test('new documents are distinct, can save empty content and retain edits during creation',async()=>{
    const request=defer(), data=state(), calls=[];
    const app={rpc:{call:(type,method,args)=>{calls.push({method,args});return request.promise;}}};
    const docs=new IdeDocuments(app,data);
    const key=docs.newDocument('typst','.typ','/workspace');
    assert.notEqual(key,docs.newDocument('typst','.typ','/workspace'));
    assert.equal(calls.length,0);
    const doc=docs.documents.getItem(key);
    doc.setItem('savePath','report.typ');
    const creating=docs.create(key);
    assert.equal(docs.canClose(key,true),false);
    assert.equal(await docs.create(key),false);
    doc.setItem('content','= Typed while saving');
    request.resolve({root:'/workspace',path:'report.typ',revision:'empty'});
    assert.equal(await creating,true);
    assert.equal(calls[0].method,'document_create');
    assert.equal(calls[0].args.content,'');
    assert.equal(doc.getItem('saved'),'');
    assert.equal(docs.dirty(key),true);
    assert.equal(doc.getItem('isNew'),false);
    assert.equal(await docs.open('/workspace','report.typ'),key);
    assert.equal(calls.length,1);
});

test('failed creation retains unsaved draft and allows retry',async()=>{
    const app={rpc:{call:async()=>{throw new Error('File already exists');}}};
    const docs=new IdeDocuments(app,state()),key=docs.newDocument('python','.py','/workspace');
    const doc=docs.documents.getItem(key);doc.setItem('content','value = 1');
    await assert.rejects(docs.create(key),/already exists/);
    assert.equal(doc.getItem('content'),'value = 1');
    assert.equal(doc.getItem('isNew'),true);assert.equal(doc.getItem('busy'),false);
    app.rpc.call=async()=>({root:'/workspace',path:'other.py',revision:'new'});
    doc.setItem('savePath','other.py');assert.equal(await docs.create(key),true);
    assert.equal(docs.dirty(key),false);
});


test('Typst recipes explicitly render unsaved Python and invalidate derived output',async()=>{
    const calls=[],app={rpc:{call:async(t,method,args)=>{calls.push({method,args});return {source:'#par("From Python")'};}}};
    const docs=new IdeDocuments(app,state()),key=docs.newDocument('python','.typ.py');
    const doc=docs.documents.getItem(key);doc.setItem('content','recipe draft');
    docs.invalidateRecipe(key);
    assert.equal(calls.length,0);assert.equal(doc.getItem('previewHidden'),true);
    assert.equal(await docs.renderRecipe(key),true);
    assert.equal(calls[0].method,'document_render_typst');
    assert.equal(calls[0].args.content,'recipe draft');
    assert.equal(doc.getItem('typstSource'),'#par("From Python")');
    assert.equal(doc.getItem('previewHidden'),false);
    assert.equal(doc.getItem('saved'),'');assert.equal(doc.getItem('isNew'),true);
    doc.setItem('content','edited recipe');docs.invalidateRecipe(key);
    assert.equal(doc.getItem('previewHidden'),true);assert.equal(doc.getItem('typstSource'),'');
    assert.equal(calls.length,1);
    doc.setItem('savePath','wrong.py');
    await assert.rejects(docs.create(key),/extension is required/);
});

test('recipe requests reject stale results, errors and disposed completion',async()=>{
    const first=defer(),app={rpc:{call:()=>first.promise}};
    const docs=new IdeDocuments(app,state()),key=docs.newDocument('python','.typ.py');
    const doc=docs.documents.getItem(key);doc.setItem('content','first');
    const generating=docs.renderRecipe(key);assert.equal(await docs.renderRecipe(key),false);
    assert.equal(docs.canClose(key,true),false);
    doc.setItem('content','second');docs.invalidateRecipe(key);
    doc.setItem('content','first');docs.invalidateRecipe(key);
    first.resolve({source:'obsolete'});assert.equal(await generating,false);
    assert.equal(doc.getItem('typstSource'),'');assert.equal(doc.getItem('previewHidden'),true);
    app.rpc.call=async()=>{throw new Error('Invalid Recipe');};
    assert.equal(await docs.renderRecipe(key),false);
    assert.equal(doc.getItem('renderStatus'),'Invalid Recipe');assert.equal(doc.getItem('busy'),false);
    const late=defer();app.rpc.call=()=>late.promise;
    const rendering=docs.renderRecipe(key);docs.dispose();late.resolve({source:'late'});
    assert.equal(await rendering,false);assert.equal(doc.getItem('typstSource'),'');
});

test('ordinary Python and read-only recipes are not executed',async()=>{
    const app={rpc:{call:()=>{throw new Error('must not be called');}}};
    const docs=new IdeDocuments(app,state());
    const python=docs.newDocument('python','.py'),recipe=docs.newDocument('python','.typ.py');
    docs.documents.getItem(recipe).setItem('writable',false);
    assert.equal(await docs.renderRecipe(python),false);
    assert.equal(await docs.renderRecipe(recipe),false);
});


test('a new draft without host write permission never calls document_create',async()=>{
    let calls=0;
    const docs=new IdeDocuments({rpc:{call:async()=>{calls++;}}},state());
    const key=docs.newDocument('text','.txt','/workspace');
    docs.documents.getItem(key).setItem('writable',false);
    docs.documents.getItem(key).setItem('content','Draft only');
    assert.equal(await docs.create(key),false);
    assert.equal(calls,0);
    assert.equal(docs.documents.getItem(key).getItem('content'),'Draft only');
    docs.dispose();
});
