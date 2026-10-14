import test from 'node:test';
import assert from 'node:assert/strict';
import {MessageChannel} from 'node:worker_threads';
import {createRequire} from 'node:module';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import {attachInspectorAgent, InspectorConnection, encodeScalar} from '../src/inspector-bridge.js';
const require = createRequire(import.meta.url);
const coreRequire = createRequire(require.resolve('@gramlot/gramlot'));
const {BagResolver} = await import(coreRequire.resolve('@genrojs/bag'));
const wait = async predicate => {
    const end = Date.now() + 3000;
    while (!predicate()) { if (Date.now() > end) throw new Error('Bridge update timeout'); await new Promise(resolve => setTimeout(resolve, 5)); }
};
function setup() {
    const {window} = new JSDOM('<main></main>');
    const app = new Gramlot({document: window.document, element: window.document.querySelector('main'), transport: false});
    const builder = new GramlotBuilder(); builder.root.p('^name', {node_label:'greeting'}); builder.root.dataSetter({destination_path:'initial', value:'x', node_label:'setter'});
    app.data.setItem('name', 'Ada', {caption:'Name', nullable:null});
    app.data.setItem('nested', new Bag({count:42})); app.src.startSource(builder.source);
    const channel = new MessageChannel();
    const agent = attachInspectorAgent(app, channel.port1), client = new InspectorConnection(channel.port2);
    return {window, app, client, agent, close() {client.close(); agent.dispose(); app.dispose(); window.close();}};
}
function edit(client, root, path, changes) {
    const node = client[root].getNode(path), info = client.nodeInfo(node);
    return client.request('edit', {root, path, nodeId:info.id, revision:info.revision, set:[], remove:[], ...changes});
}
test('port snapshots preserve supported types, cached reads, node identity and real target ownership', async () => {
    const f = setup(); let calls = 0;
    class Deferred extends BagResolver {load(){calls++; return 7;}}
    const date = new Date('2026-10-14T00:00:00Z');
    f.app.data.setItem('date', date); f.app.data.setItem('deferred', new Deferred());
    try {
        await wait(() => f.client.state === 'started');
        assert.equal(f.client.data.getItem('date').toISOString(), date.toISOString());
        assert.equal(f.client.source.getItem('main.greeting'), '^name');
        assert.equal(f.client.source.getNode('main.greeting').getAttr('_meta'), null);
        assert.equal(f.client.source.getNode('main.setter').getAttr('_meta'), null);
        assert.ok(f.app.src.source.getNode('main.setter').getAttr('_meta'));
        assert.equal(f.client.nodeInfo(f.client.data.getNode('deferred')).readonly, true);
        const before = f.client.data.getNode('nested.count');
        f.app.data.setItem('nested.count', 43);
        await wait(() => f.client.data.getItem('nested.count') === 43);
        assert.equal(f.client.data.getNode('nested.count'), before);
        assert.equal(calls, 0); assert.equal(f.app.data.getItem('date'), date);
    } finally { f.close(); }
});
test('agent validates revisions and all scalar patches before writing; metadata and untouched Date identity survive', async () => {
    const f = setup();
    const date = new Date('2026-10-14T00:00:00Z'); f.app.data.setItem('when', date, {caption:'Day'});
    try {
        await wait(() => f.client.state === 'started');
        await edit(f.client, 'data', 'when', {set:[['nullable',encodeScalar(null)]],remove:['caption']});
        assert.equal(f.app.data.getItem('when'),date);
        assert.deepEqual(f.app.data.getNode('when').getAttr(),{nullable:null});
        const source = f.app.src.source.getNode('main.greeting'), meta = source.getAttr('_meta');
        await edit(f.client,'source','main.greeting',{value:encodeScalar('Changed'),set:[['title',encodeScalar('Title')]]});
        assert.equal(source.getAttr('_meta'),meta);
        assert.equal(f.app.src.renderer.destination.querySelector('p').textContent,'Changed');
        await assert.rejects(edit(f.client,'data','name',{value:encodeScalar('Invalid'),set:[['_meta',encodeScalar('invalid')]]}),/Cannot edit/);
        assert.equal(f.app.data.getItem('name'),'Ada');
        const info = f.client.nodeInfo(f.client.data.getNode('name'));
        f.app.data.setItem('name','External');
        await assert.rejects(f.client.request('edit',{root:'data',path:'name',nodeId:info.id,revision:info.revision,value:encodeScalar('Stale'),set:[],remove:[]}),/Node changed/);
        assert.equal(f.app.data.getItem('name'),'External');
    } finally {f.close();}
});
test('breakpoints run synchronously in the owning page, preserve old config on errors, and disconnect releases subscriptions', async () => {
    const f = setup(), hits=[]; f.window.console.log=(...args)=>hits.push(args);
    try {
        await wait(() => f.client.state === 'started');
        await f.client.request('breakpoint',{root:'data',path:'name',mode:'console',condition:'value === "Grace"'});
        await assert.rejects(f.client.request('breakpoint',{root:'data',path:'name',mode:'console',condition:'(()'}));
        f.app.data.setItem('name','Grace'); assert.equal(hits.length,1);
        await wait(() => f.client.breakpoints[0]?.hits === 1);
        await f.client.request('breakpoint',{root:'source',path:'main.greeting',mode:'console',condition:'unknownName.value'});
        assert.doesNotThrow(()=>f.app.src.source.getNode('main.greeting').setAttr({title:'error'}));
        await wait(() => f.client.breakpoints.some(bp=>bp.error));
        f.agent.dispose(); await wait(()=>f.client.state==='disposed');
        f.app.data.setItem('name','Other'); f.app.data.setItem('name','Grace'); assert.equal(hits.length,1);
        assert.equal(Object.keys(f.app.data._updSubscribers).filter(id=>id.startsWith('inspector-bridge-')).length,0);
    } finally {f.close();}
});
