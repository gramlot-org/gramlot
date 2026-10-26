import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {Gramlot} from '../src/index.js';
import {IdeLogic} from '../src/ide-runtime.js';
import {documentKey} from '../src/ide-documents.js';
import layout from '../src/components/layout.js';
import inputs from '../src/components/inputs.js';
import tree from '../src/components/tree.js';
import editors from '../src/components/editors.js';

const settle = () => new Promise(resolve => setTimeout(resolve, 0));
const deferred = () => {let resolve;const promise = new Promise(r => {resolve = r;});return {promise,resolve};};

test('two Python IDEs share Logic but retain independent Source ownership, relative Data and DOM-only detachment', async t => {
    const source = execFileSync(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', `
import json
from pathlib import Path
from gramlot import GramlotBuilder
from gramlot.page import IdePage
b = GramlotBuilder(collections=[json.loads(Path(f'src/gramlot/collections/{name}.json').read_text()) for name in ['inputs','layout','tree','editors']])
tabs = b.root.tabContainer(node_label='editors', datapath='workbench', height='600px')
for name in ('one','two'):
    pane = tabs.contentPane(node_label=name, title=name, pageName=name, detachable=True)
    page = IdePage()
    page.shell_id = f'ide-{name}'
    page.datapath = f'.{name}'
    page.main(pane)
print(b.to_tytx())
`], {cwd:fileURLToPath(new URL('../..',import.meta.url)),encoding:'utf8'}).trim();
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {url:'https://gallery.test/',pretendToBeVisual:true});
    for (const name of ['window','document','MutationObserver','Window','HTMLElement','Node','getComputedStyle']) globalThis[name] = window[name];
    window.ResizeObserver = class {observe(){}unobserve(){}disconnect(){}};
    window.Range.prototype.getClientRects = () => [];
    window.Range.prototype.getBoundingClientRect = () => ({left:0,right:0,top:0,bottom:0,width:0,height:0});
    window.HTMLDialogElement.prototype.show = function(){this.open = true;};
    window.HTMLDialogElement.prototype.close = function(){this.open = false;};
    window.HTMLElement.prototype.showPopover = function(){};
    const errors = [];
    window.addEventListener('error', event => errors.push(event.error));
    const app = new Gramlot({document:window.document,transport:false,collections:[layout,inputs,tree,editors]});
    t.after(() => {app.dispose();window.close();});
    app.src.logicRegistry.register(IdeLogic, {resource:'test:two-ides'});
    const reads = [], saves = [], workspaces = [];
    app.rpc.call = (type,method,args,options) => {
        if (method === 'document_read') {const request = deferred();reads.push({...request,args,signal:options.signal});return request.promise;}
        if (method === 'document_save') {const request = deferred();saves.push({...request,args,signal:options.signal});return request.promise;}
        if (method === 'workspace_open') {const request = deferred();workspaces.push({...request,args,signal:options.signal});return request.promise;}
        throw Error(`Unexpected RPC: ${method}`);
    };
    app.src.startSource(source);
    await settle();
    const tabsSource = app.src.source.getNode('main.editors');
    const firstPanel = tabsSource.value.getNode('one');
    const one = firstPanel.value.getNodes()[0], two = tabsSource.value.getNode('two').value.getNodes()[0];
    const first = one.getRelativeData('.'), second = two.getRelativeData('.');
    assert.equal(first, app.data.getItem('workbench.one'));
    assert.equal(second, app.data.getItem('workbench.two'));
    assert.notEqual(one.ideContext, two.ideContext);
    for (const name of ['ideState','ideRoot','ideDocuments','idePanels','ideRequested','fileSystems']) assert.equal(app.logic[name], undefined, name);
    const ids = [...window.document.querySelectorAll('[id]')].map(node => node.id);
    assert.equal(new Set(ids).size, ids.length, 'two composed IDEs do not duplicate DOM IDs');

    first.setItem('browser.requestedRoot','/one');
    second.setItem('browser.requestedRoot','/two');
    await settle();
    workspaces[1].resolve({root:'/two',entries:new Bag(),writable:true});
    workspaces[0].resolve({root:'/one',entries:new Bag(),writable:true});
    await settle();
    assert.equal(first.getItem('browser.root'),'/one');
    assert.equal(second.getItem('browser.root'),'/two');

    const openingOne = app.logic.ideOpenDocument(one,'/shared','same.py');
    const openingTwo = app.logic.ideOpenDocument(two,'/shared','same.py');
    const result = content => ({path:'same.py',content,revision:'r1',writable:true,language:'python'});
    reads[1].resolve(result('second = 2'));
    await openingTwo;
    reads[0].resolve(result('first = 1'));
    await openingOne;
    const key = documentKey('/shared','same.py');
    const firstDoc = first.getItem(`documents.${key}`), secondDoc = second.getItem(`documents.${key}`);
    assert.equal(firstDoc.getItem('content'),'first = 1');
    assert.equal(secondDoc.getItem('content'),'second = 2');
    assert.equal(first.getItem('active'),key);
    assert.equal(second.getItem('active'),key);
    const firstEditor = app.logic.ideEditor(one,key), secondEditor = app.logic.ideEditor(two,key);
    await Promise.all([firstEditor.ready,secondEditor.ready]);
    assert.notEqual(firstEditor,secondEditor);
    assert.notEqual(app.src.renderer.elements.get(firstEditor).node,app.src.renderer.elements.get(secondEditor).node);
    firstDoc.setItem('content','first = 11');
    secondDoc.setItem('content','second = 22');
    firstEditor.pageContext.publish('save',{value:'first = 11'});
    await settle();
    assert.equal(saves.length,1,'one editor shortcut saves only its own IDE');
    assert.equal(saves[0].args.content,'first = 11');
    saves[0].resolve({revision:'r2'});
    await settle();
    assert.equal(firstDoc.getItem('saved'),'first = 11');
    assert.equal(secondDoc.getItem('saved'),'second = 2');

    const tabs = app.src.renderer.records.get(tabsSource).element;
    tabs.shadowRoot.querySelector('[aria-label="Detach one"]').click();
    await settle();
    assert.ok(tabs.shadowRoot.querySelector('dialog[open]'));
    assert.equal(tabsSource.value.getNode('one'),firstPanel);
    assert.equal(one.parentNode,firstPanel);
    assert.equal(one.getRelativeData('.'),first);
    assert.equal(app.logic.ideEditor(one,key),firstEditor);
    firstDoc.setItem('content','first = 33');
    await settle();
    assert.equal(firstEditor.editor.view.state.doc.toString(),'first = 33');
    tabs.shadowRoot.querySelector('[aria-label="Close window"]').click();
    await settle();
    assert.equal(one.parentNode,firstPanel);
    assert.equal(app.logic.ideEditor(one,key),firstEditor);
    assert.equal(secondEditor.editor.view.state.doc.toString(),'second = 22');

    const lateOne = app.logic.ideOpenDocument(one,'/shared','late.py');
    const lateTwo = app.logic.ideOpenDocument(two,'/shared','later.py');
    tabsSource.value.popNode('one');
    await settle();
    assert.equal(reads[2].signal.aborted,true);
    assert.equal(reads[3].signal.aborted,false);
    reads[2].resolve(result('discarded'));
    reads[3].resolve({...result('retained'),path:'later.py'});
    await Promise.all([lateOne,lateTwo]);
    assert.equal(first.getItem(`documents.${documentKey('/shared','late.py')}`),null);
    assert.equal(second.getItem(`documents.${documentKey('/shared','later.py')}.content`),'retained');
    assert.equal(two.ideContext.documents.disposed,false);
    assert.deepEqual(errors,[]);
});
