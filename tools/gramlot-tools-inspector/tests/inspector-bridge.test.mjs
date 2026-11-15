import test from 'node:test';
import assert from 'node:assert/strict';
import {MessageChannel} from 'node:worker_threads';
import {createRequire} from 'node:module';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import {attachInspectorAgent, InspectorConnection} from '../src/inspector-bridge.js';
const require = createRequire(import.meta.url);
const coreRequire = createRequire(require.resolve('@gramlot/gramlot'));
const {BagResolver} = await import(coreRequire.resolve('@genrojs/bag'));
const wait = async predicate => {
    const end = Date.now() + 3000;
    while (!predicate()) { if (Date.now() > end) throw new Error('Bridge update timeout'); await new Promise(resolve => setTimeout(resolve, 5)); }
};
/** A panel page whose dataBinders keep the copies of `connection` at `target.data` and `target.source`. */
function panel(window, connection) {
    const element = window.document.createElement('section');
    window.document.body.append(element);
    const ui = new Gramlot({document: window.document, element, transport: false});
    const builder = new GramlotBuilder();
    for (const root of ['data', 'source']) builder.root.dataBinder({destination_path: `target.${root}`, server_path: root, connection: 'target'});
    ui.src.startSource(builder.source);
    ui.rpc.registerConnection('target', connection.port);
    return {ui,
        copy: root => ui.data.getItem(`target.${root}`), info: (root, path) => ui.data.getNode(`target.${root}.${path}`)?.getAttr('_inspector')};
}
function setup() {
    const {window} = new JSDOM('<main></main>');
    const app = new Gramlot({document: window.document, element: window.document.querySelector('main'), transport: false});
    const builder = new GramlotBuilder(); builder.root.p('^name', {node_label:'greeting'}); builder.root.dataSetter({destination_path:'initial', value:'x', node_label:'setter'});
    app.data.setItem('name', 'Ada', {caption:'Name', nullable:null});
    app.data.setItem('nested', new Bag({count:42})); app.src.startSource(builder.source);
    const channel = new MessageChannel();
    const agent = attachInspectorAgent(app, channel.port1), client = new InspectorConnection(channel.port2);
    const view = panel(window, client);
    return {window, app, client, agent, ...view, close() {client.close(); agent.dispose(); view.ui.dispose(); app.dispose(); window.close();}};
}
function edit(f, root, path, changes) {
    const info = f.info(root, path);
    return f.client.request('edit', {root, path, nodeId:info.id, revision:info.revision, set:[], remove:[], ...changes});
}
test('port snapshots preserve supported types, cached reads, node identity and real target ownership', async () => {
    const f = setup(); let calls = 0;
    class Deferred extends BagResolver {load(){calls++; return 7;}}
    const date = new Date('2026-10-14T00:00:00Z');
    f.app.data.setItem('date', date); f.app.data.setItem('deferred', new Deferred());
    try {
        await wait(() => f.client.state === 'started' && f.copy('data')?.getItem('date'));
        assert.equal(f.copy('data').getItem('date').toISOString(), date.toISOString());
        assert.equal(f.copy('source').getItem('main.greeting'), '^name');
        assert.equal(f.copy('source').getNode('main.greeting').getAttr('_meta'), null);
        assert.equal(f.copy('source').getNode('main.setter'), null);
        assert.equal(f.app.src.source.getNode('main.setter'), null);
        assert.equal(f.copy('data').getItem('initial'), 'x');
        assert.equal(f.info('data', 'deferred').readonly, true);
        assert.equal(f.copy('data').getItem('deferred'), null);
        const before = f.copy('data').getNode('nested.count');
        f.app.data.setItem('nested.count', 43);
        await wait(() => f.copy('data').getItem('nested.count') === 43);
        assert.equal(f.copy('data').getNode('nested.count'), before);
        assert.equal(calls, 0); assert.equal(f.app.data.getItem('date'), date);
    } finally { f.close(); }
});
test('agent validates revisions and all scalar patches before writing; metadata and untouched Date identity survive', async () => {
    const f = setup();
    const date = new Date('2026-10-14T00:00:00Z'); f.app.data.setItem('when', date, {caption:'Day'});
    try {
        await wait(() => f.client.state === 'started' && f.info('data', 'when'));
        await edit(f, 'data', 'when', {set:[['nullable',null]],remove:['caption']});
        assert.equal(f.app.data.getItem('when'),date);
        assert.deepEqual(f.app.data.getNode('when').getAttr(),{nullable:null});
        const source = f.app.src.source.getNode('main.greeting'), meta = source.getAttr('_meta');
        await edit(f,'source','main.greeting',{value:'Changed',set:[['title','Title']]});
        assert.equal(source.getAttr('_meta'),meta);
        assert.equal(f.app.src.renderer.destination.querySelector('p').textContent,'Changed');
        await assert.rejects(edit(f,'data','name',{value:'Invalid',set:[['_meta','invalid']]}),/Cannot edit/);
        await assert.rejects(edit(f,'data','name',{set:[['_inspector','invalid']]}),/Cannot edit/);
        await assert.rejects(edit(f,'data','name',{value:{object:true}}),/scalar values only/);
        assert.equal(f.app.data.getItem('name'),'Ada');
        const info = f.info('data', 'name');
        f.app.data.setItem('name','External');
        await assert.rejects(f.client.request('edit',{root:'data',path:'name',nodeId:info.id,revision:info.revision,value:'Stale',set:[],remove:[]}),/Node changed/);
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

test('snapshot reconciliation preserves sibling order and identity after insertion and moves', async () => {
    const f = setup();
    try {
        await wait(() => f.client.state === 'started' && f.info('data', 'name'));
        const retained = f.info('data', 'name').id;
        f.app.data.setItem('first', 1, null, '<');
        await wait(() => f.copy('data').getItem('first') === 1);
        assert.deepEqual(f.copy('data').getNodes().map(node => node.label), f.app.data.getNodes().map(node => node.label));
        f.app.data.move(0, 2);
        await f.client.request('refresh');
        assert.deepEqual(f.copy('data').getNodes().map(node => node.label), f.app.data.getNodes().map(node => node.label));
        assert.equal(f.info('data', 'name').id, retained);
        f.app.data.clear();
        await f.client.request('refresh');
        assert.equal(f.copy('data').getNodes().length, 0);
    } finally { f.close(); }
});

test('separately bundled agents coexist without replacing each other’s subscriptions', async () => {
    const f = setup();
    const separate = await import('../src/inspector-agent.js?independent-bundle');
    const channel = new MessageChannel();
    const agent = separate.attachInspectorAgent(f.app, channel.port1);
    const second = new InspectorConnection(channel.port2);
    const view = panel(f.window, second);
    try {
        await wait(() => f.client.state === 'started' && second.state === 'started');
        f.app.data.setItem('name', 'Both');
        await wait(() => f.copy('data')?.getItem('name') === 'Both' && view.copy('data')?.getItem('name') === 'Both');
        agent.dispose();
        f.app.data.setItem('name', 'First remains');
        await wait(() => f.copy('data').getItem('name') === 'First remains');
        await wait(() => view.ui.rpc.connection('target').state === 'closed');
        assert.equal(view.copy('data').getItem('name'), 'Both');
        assert.equal(Object.keys(f.app.data._updSubscribers).filter(key => key.startsWith('inspector-bridge-')).length, 1);
    } finally {second.close(); agent.dispose(); view.ui.dispose(); f.close();}
});

test('structural commands and history execute in the target, reject stale nodes and retain bindings', async () => {
    const f = setup();
    const command = path => {
        const info = f.info('source', path);
        return {path, nodeId: info.id, revision: info.revision};
    };
    try {
        await wait(() => f.client.state === 'started' && f.info('source', 'main'));
        const catalog = (await f.client.request('catalog', {path:'main'})).catalog;
        assert.ok(catalog.some(item => item.tag === 'div' && item.kind === 'html'));
        assert.ok(!catalog.some(item => item.tag === 'dataSetter'));
        const added = await f.client.request('insert', {...command('main'), tag:'div'});
        assert.ok(f.app.src.source.getNode(added.selection));
        assert.equal(f.client.history.undo, 'Add element');
        const stale = command('main.greeting');
        await edit(f, 'source', 'main.greeting', {set:[['title', 'Edited']]});
        await assert.rejects(f.client.request('remove', stale), /changed/);
        const target = command(added.selection);
        const moved = await f.client.request('move', {...command('main.greeting'), destination:added.selection,
            placement:'inside', targetId:target.nodeId, targetRevision:target.revision});
        assert.equal(f.app.src.source.getItem(moved.selection), '^name');
        await f.client.request('remove', command(added.selection));
        assert.equal(f.app.src.renderer.destination.querySelector('p'), null);
        await f.client.request('undo');
        assert.equal(f.app.src.renderer.destination.querySelector('p').textContent, 'Ada');
        await f.client.request('undo');
        assert.equal(f.app.src.source.getItem('main.greeting'), '^name');
        await f.client.request('undo');
        assert.equal(f.app.src.source.getNode('main.greeting').getAttr('title'), null);
        await f.client.request('undo');
        assert.equal(f.app.src.source.getNode(added.selection), null);
        assert.equal(f.client.history.undo, '');
        for (let i=0;i<4;i++) await f.client.request('redo');
        assert.equal(f.app.src.renderer.destination.querySelector('p'), null);
        await f.client.request('undo');
        f.app.data.setItem('name','Grace');
        assert.equal(f.app.src.renderer.destination.querySelector('p').textContent,'Grace');
    } finally {f.close();}
});
