import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, mkdir, writeFile, symlink, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {GramlotFileServer} from '../src/server/gramlot-file-server.js';
import {GramlotBuilder} from '../src/builder/gramlot-builder.js';
import {GramlotServer} from '../src/server/gramlot-server.js';
import {Page} from '../src/server/page.js';
const grammar=JSON.parse(await readFile(new URL('../../tests/fixtures/collections/controls.json',import.meta.url),'utf8'));
const record=(name,document=grammar,dependencies=[])=>({name,buildId:'sha256:'+'a'.repeat(64),grammar:document,module:`/collections/${name}/index.js`,css:[],dependencies});

test('page selection accumulates base declarations and orders named dependencies',()=>{
 const a=record('a'),b=record('b',grammar,['a']);
 class Parent extends Page {static gramlots=[a];}
 class Child extends Parent {static gramlots=[b,a];}
 const server=new GramlotServer();
 assert.deepEqual(server.pageCollections(Child),[a,b]);
 assert.deepEqual(server.pageCollections(Page),[]);
 assert.throws(()=>server.collectionGraph([b]),/Missing collection dependency/);
 assert.throws(()=>server.collectionGraph([a,{...a,buildId:'sha256:'+'b'.repeat(64)}]),/Conflicting/);
 assert.throws(()=>server.collectionGraph([{...a,dependencies:['b']},b]),/cycle/);
});

test('prepared grammar is reused without sharing schema, Source, Data or authorization',()=>{
 let loads=0;
 class Builder extends GramlotBuilder {
  loadCollection(doc){loads++;return super.loadCollection(doc);}
 }
 const server=new GramlotServer(), selected=[record('controls')];
 const left=new Builder('left',{auth:()=>null});
 server.loadCollections(left,selected);
 left.root.statusText('left',{required_label:'Status'});
 left.data.setItem('secret','left');
 left.schema.statusText.testMarker=true;
 const auth=()=> 'not_authorized',right=new Builder('right',{auth});
 server.loadCollections(right,selected);
 assert.equal(loads,1);assert.equal(right.schema.statusText.testMarker,undefined);
 assert.equal(right.source.nodes.length,0);assert.equal(right.data.getItem('secret'),null);
 assert.equal(right.auth,auth);assert.notEqual(left._collection,right._collection);
 right.root.statusText('right',{required_label:'Status'});
 assert.equal(left.source.nodes.length,1);
});

test('different builder classes, initial grammars and changed records do not share compiled entries',()=>{
 const server=new GramlotServer(),selected=[record('controls')];
 const base=new GramlotBuilder();server.loadCollections(base,selected);
 class Other extends GramlotBuilder {}
 const other=new Other();server.loadCollections(other,selected);
 assert.notEqual(base.schema,other.schema);
 const changed=structuredClone(grammar);changed.elements.statusText.attributes.parameters=[];
 const fresh=new GramlotBuilder();server.loadCollections(fresh,[record('controls',changed)]);
 fresh.root.statusText('without required argument');
 assert.throws(()=>base.root.statusText('missing'));
 const initial=structuredClone(grammar);
 initial.elements.localStatus=initial.elements.statusText;
 const local=new GramlotBuilder(null,{collections:[initial]});
 server.loadCollections(local,selected);
 assert.ok(local.schema.localStatus);
 const plain=new GramlotBuilder();server.loadCollections(plain,selected);
 assert.equal(plain.schema.localStatus,undefined);
});


test('cached validators, cardinality Maps and parent Sets remain effective and independent',()=>{
 const server=new GramlotServer(),selected=[record('controls')];
 const first=new GramlotBuilder();server.loadCollections(first,selected);
 first.schema.ratingPanel._subSpec.clear();first.schema.rating._parentSpec.clear();
 const second=new GramlotBuilder();server.loadCollections(second,selected);
 assert.ok(second.schema.ratingPanel._subSpec.size);
 assert.ok(second.schema.rating._parentSpec.has('ratingPanel'));
 const annotation=second.schema.rating.attributes.parameters[0].annotation;
 assert.equal(annotation.test(5),true);assert.equal(annotation.test(15),false);
 const third=new GramlotBuilder();server.loadCollections(third,selected);
 assert.notEqual(second.schema.rating.attributes.parameters,third.schema.rating.attributes.parameters);
});

test('file discovery imports candidates once without constructing pages or calling main',async t=>{
 const root=await mkdtemp(join(tmpdir(),'gramlot-discovery-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const pageModule=new URL('../src/server/page.js',import.meta.url).href;
 await writeFile(join(root,'a.js'),`import {Page as Base} from ${JSON.stringify(pageModule)}; export class Page extends Base {constructor(){throw Error('constructor during discovery');} main(){throw Error('main during discovery');}}`);
 await writeFile(join(root,'b.js'),`export {Page} from './a.js';`);
 await writeFile(join(root,'helper.js'),'export const ready=true;');
 for(const file of ['_private.js','.hidden.js','a_aux.js'])await writeFile(join(root,file),"throw Error('excluded candidate');");
 await mkdir(join(root,'_private'));await writeFile(join(root,'_private','index.js'),"throw Error('excluded directory');");
 await symlink(join(root,'a.js'),join(root,'link.js'));
 const server=new GramlotFileServer(root),classes=[];
 for await(const cls of server.iterPageClasses())classes.push(cls);
 assert.equal(classes.length,1);
 const repeated=[];for await(const cls of server.iterPageClasses())repeated.push(cls);
 assert.equal(repeated[0],classes[0]);
 await writeFile(join(root,'invalid.js'),'export const Page=42;');
 await assert.rejects(async()=>{for await(const cls of server.iterPageClasses())void cls;},/Invalid Page export/);
});

test('environment Page includes host collections without mutating imported classes',()=>{
 const a=record('a'),b=record('b');
 class Example extends Page {}
 const left=new GramlotServer({collections:[a,b]}),right=new GramlotServer({collections:[b]});
 const bound=left.environmentPage(Example);
 assert.equal(bound,left.environmentPage(Example));
 assert.ok(new bound() instanceof Example);
 assert.deepEqual(bound.gramlots,[a,b]);
 assert.deepEqual(right.environmentPage(Example).gramlots,[b]);
 assert.deepEqual(Example.gramlots,[]);
 assert.deepEqual(left.pageCollections(bound),[a,b]);
});
