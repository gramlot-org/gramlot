import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, IndexPage, IndexLogic, Bag} from '../src/index.js';
import {GramlotServer, PageNotFound} from '../src/server/gramlot-server.js';
class App extends IndexPage {
    static installable = true;
    static appIcon = '/icon.png';
    static navigation = new Bag();
}
class Server extends GramlotServer {
    async resolvePage() { return App; }
    async resolveResources() { return {css:[],js:[]}; }
}
test('the frame inherits the host theme without a hardcoded index theme', async () => {
    class Listing extends Server { async resolveResources(path, PageClass) { return {css:[...PageClass.css],js:[]}; } }
    const links = async server => JSON.parse(/"css":(\[.*?\])/.exec((await server.openPage('/')).html)[1]);
    assert.deepEqual(IndexPage.css, []);
    assert.deepEqual(await links(new Listing()), ['/themes/gramlot-base/theme.css']);
    assert.deepEqual(await links(new Listing({cssTheme:'mimi'})), ['/themes/mimi/theme.css']);
    assert.deepEqual(await links(new Listing({cssTheme:false})), []);
});
test('root manifest has mount-scoped URLs, no session; child does not advertise it', async () => {
    const server = new Server();
    const manifest = await server.pageManifest({prefix:'/demo'});
    assert.equal(manifest.start_url,'/demo/');
    assert.equal(manifest.icons[0].src,'/demo/icon.png');
    assert.equal(server.pages.size,0);
    assert.match((await server.openPage('/',{prefix:'/demo'})).html,/href="\/demo\/app.webmanifest"/);
    assert.doesNotMatch((await server.openPage('/child')).html,/rel="manifest"/);
    const old=App.installable; App.installable=false;
    await assert.rejects(server.pageManifest(), PageNotFound); App.installable=old;
});

test('index panel hook receives a BagNode snapshot and authors an iframe', () => {
    const b = new GramlotBuilder(); const selection = new Bag();
    selection.setItem('one', null, {title:'One', url:'/one'});
    new App().index_panel(b.root, {selection});
    const iframe = b.source.getNodes()[0];
    assert.equal(iframe.nodeTag, 'iframe');
    assert.equal(iframe.getAttr('src'), '/one');
    assert.equal(iframe.getAttr('title'), 'One');
});

test('container index creates Source on demand, deduplicates pending requests and retains loaded panels', async t => {
    const {default: layout} = await import('../src/components/layout.js');
    const {default: tree} = await import('../src/components/tree.js');
    const {mountIndexPage} = await import('../src/index-page-runtime.js');
    const document = new JSDOM('<main id="gramlot-root"></main>', {url: 'https://index.test/'}).window.document;
    document.defaultView.ResizeObserver = class {observe() {} unobserve() {} disconnect() {}};
    document.defaultView.HTMLElement.prototype.scrollIntoView = function () {};
    const navigation = new Bag();
    for (const key of ['one', 'two']) navigation.setItem(key, null, {title:key, url:'/'+key});
    class Listing extends IndexPage {static navigation = navigation; behavior() {}}
    const builder = new GramlotBuilder(null, {collections: [layout, tree]});
    new Listing().main(builder.root);
    const app = new Gramlot({document, transport:false, collections:[layout, tree]}).src.startSource(builder.source);
    t.after(() => {app.dispose(); document.defaultView.close();});
    const renderer = app.src.renderer;
    const root = renderer.elements.get(document.getElementById('index')).node;
    const calls = [], gates = new Map();
    const state = app.data.getItem('index');
    mountIndexPage(renderer, root, () => {}, () => {}, {state,
        async createEntry({url, pane}) {
            calls.push(url);
            await new Promise(resolve => gates.set(url, resolve));
            app.src.builder.wrapSource(pane).iframe({id: 'frame-'+url.slice(1)});
        },
    });
    const settle = () => new Promise(resolve => setTimeout(resolve, 0));
    state.setItem('navigationSelection', 'one'); state.setItem('navigationSelection', 'one');
    state.setItem('navigationSelection', 'two'); await settle();
    assert.deepEqual(calls, ['/one', '/two']);
    gates.get('/two')(); await settle();
    assert.equal(state.getItem('active'), '/two');
    gates.get('/one')(); await settle();
    assert.equal(state.getItem('active'), '/two');
    const frame = document.getElementById('frame-one');
    state.setItem('navigationSelection','one'); await settle();
    assert.equal(state.getItem('active'), '/one');
    assert.equal(document.getElementById('frame-one'), frame);
    assert.deepEqual(calls, ['/one', '/two']);
});
