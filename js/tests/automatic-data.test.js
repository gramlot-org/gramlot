import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, writeFile, rm, symlink} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {JSDOM} from 'jsdom';
import {SourceBag} from '@genrojs/builders';
import {Bag} from '@genrojs/bag';
import {toTytx, fromTytx} from '@genrojs/tytx';
import {Gramlot} from '../src/gramlot.js';
import {GramlotFileServer} from '../src/server/gramlot-file-server.js';

const pageModule = new URL('../src/server/page.js', import.meta.url).href;
async function fixture(t) {
    const folder = await mkdtemp(join(tmpdir(), 'gramlot-initial-data-'));
    t.after(() => rm(folder, {recursive: true, force: true}));
    await writeFile(join(folder, 'foo.js'), `import {Page as BasePage} from ${JSON.stringify(pageModule)};
export class Page extends BasePage {
 main(root) {
   root.input({id:'name', value:'^customer.name', default:'Default name', live:true});
   root.p('^customer.name', {id:'preview'});
   root.input({id:'accent', value:'^ui.accent', default:'#2563eb'});
   root.dataSetter({destination_path:'explicit', value:42});
 }
 fragment(root) { root.p('fragment'); }
 answer() { return 7; }
}
Page.registerSource('fragment');
Page.registerEndpoint('answer');`);
    const server = new GramlotFileServer(folder);
    const {pageId} = await server.registerPage('/foo');
    const request = async (name='main', contentType='source') => fromTytx(await server.call(toTytx({id:'test',pageId,contentType,name,params:{}})));
    return {folder, server, pageId, request};
}
function client(t, server, pageId) {
    const dom = new JSDOM('<main></main>');
    const app = new Gramlot({document:dom.window.document, element:dom.window.document.querySelector('main'), pageId,
        transport:{call:text=>server.call(text), close(){}, dispose(){}}});
    t.after(()=>{app.dispose();dom.window.close();});
    return {app, document:dom.window.document};
}
function dataset() {
    const data = new Bag();
    data.setItem('customer.name', 'Ada', {caption:'Customer', optional:null}, '>', false, false);
    data.setItem('customer.active', true);
    data.setItem('explicit', 0);
    data.setItem('customer.balance', 1250.5);
    data.setItem(['literal.dot'], 'literal', {__replace:true});
    return data;
}

test('optional companion preserves the main value and initializes Data before defaults, bindings and setters', async t=>{
    const {folder, server, pageId, request}=await fixture(t);
    await writeFile(join(folder,'foo_data.tytx'),toTytx(dataset()));
    const reply=await request();
    assert.ok(reply.value instanceof SourceBag);
    assert.ok(reply.data instanceof Bag);
    const {app,document}=client(t,server,pageId), identity=app.data;
    await app.start();
    assert.equal(app.data,identity);
    assert.equal(app.data.getItem('customer.name'),'Ada');
    assert.equal(app.data.getNode('customer.name').attr.caption,'Customer');
    assert.equal(app.data.getNode('customer.name').attr.optional,null);
    assert.equal(app.data.getItem(['literal.dot']),'literal');
    assert.equal(app.data.getNode(['literal.dot']).attr.__replace,true);
    assert.equal(app.data.getItem('explicit'),42);
    assert.equal(app.data.getItem('ui.accent'),'#2563eb');
    assert.equal(document.getElementById('name').value,'Ada');
    assert.equal(document.getElementById('preview').textContent,'Ada');
    document.getElementById('name').value='Grace';
    document.getElementById('name').dispatchEvent(new document.defaultView.Event('input',{bubbles:true}));
    assert.equal(app.data.getItem('customer.name'),'Grace');
    assert.equal(document.getElementById('preview').textContent,'Grace');
    assert.equal((await request()).data.getItem('customer.name'),'Ada');
    assert.equal('data' in await request('fragment'),false);
    assert.equal('data' in await request('answer','data'),false);
    assert.equal(await app.rpc.call('data','answer'),7);
});

test('missing companion keeps the original response and defaults',async t=>{
    const {server,pageId,request}=await fixture(t);
    assert.equal('data' in await request(),false);
    const {app}=client(t,server,pageId);await app.start();
    assert.equal(app.data.getItem('customer.name'),'Default name');
    assert.equal(app.data.getItem('explicit'),42);
});

test('invalid or non-Bag data fails main without a partial Source or Data response',async t=>{
    const {folder,request}=await fixture(t);
    for(const text of ['not TYTX',toTytx({customer:'Ada'}),toTytx(null)]) {
        await writeFile(join(folder,'foo_data.tytx'),text);
        const result=await request();
        assert.equal(result.error.code,'application_error');
        assert.equal('value' in result,false);assert.equal('data' in result,false);
    }
});

test('a companion symlink cannot read outside the pages directory and data files are not public companions',async t=>{
    const {folder,server,request}=await fixture(t);
    const outside=await mkdtemp(join(tmpdir(),'gramlot-data-outside-'));
    t.after(()=>rm(outside,{recursive:true,force:true}));
    await writeFile(join(outside,'secret.tytx'),toTytx(dataset()));
    await symlink(join(outside,'secret.tytx'),join(folder,'foo_data.tytx'));
    assert.match((await request()).error.message,/leaves the pages folder/);
    assert.equal(await server.companionFile('/foo_data.tytx'),null);
});
