import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, IndexPage, IndexLogic} from '../src/index.js';
import {GramlotServer, PageNotFound} from '../src/server/gramlot-server.js';
class App extends IndexPage {
    static installable = true;
    static appIcon = '/icon.png';
    static navigation = [{key:'work',title:'Work',children:[{key:'one',title:'One',url:'one'},{key:'two',title:'Two',url:'two'}]}];
}
class Server extends GramlotServer {
    async resolvePage() { return App; }
    async resolveResources() { return {css:[],js:[]}; }
}
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
function fixture(custom=false, prepare=()=>{}) {
    const document=new JSDOM('<main id="gramlot-root"></main>',{url:'https://example.test/app/'}).window.document;
    prepare(document.defaultView);
    class TestPage extends App { footer(pane) { if(custom) pane.p('Custom footer'); else super.footer(pane); } }
    const builder=new GramlotBuilder(); new TestPage().main(builder.root);
    const app=new Gramlot({document,transport:false});
    app.src.logicRegistry.register(IndexLogic,{resource:'fixture'});
    app.src.startSource(builder.source);
    return {app,document,get:id=>document.getElementById(id)};
}
test('index opens pages lazily, reuses iframe and keeps Source selection',()=>{
    const f=fixture();
    assert.equal(f.document.querySelectorAll('iframe[src]').length,0);
    f.get('open-one').click(); const frame=f.get('frame-one');
    assert.equal(frame.getAttribute('src'),'one');
    f.get('open-two').click(); f.get('open-one').click();
    assert.equal(f.get('frame-one'),frame);
    assert.equal(f.get('panel-one').hidden,false);
    assert.equal(f.get('panel-two').hidden,true);
    f.app.dispose();
});
test('custom footer can replace every standard control',()=>{const f=fixture(true);f.get('open-one').click();assert.equal(f.get('panel-one').hidden,false);f.app.dispose();});
test('GenroPy appearances replace the current CSS and survive remount independently of color mode',()=>{
    const f=fixture(),win=f.document.defaultView;
    const select=(id,value)=>{f.get(id).value=value;f.get(id).dispatchEvent(new win.Event('change'));};
    select('index-appearance','mimi');select('index-theme','dark');
    const css=()=>[...f.document.querySelectorAll('style')].map(el=>el.textContent).join('\n');
    assert.match(css(),/--gramlot-field-height: 18px/);
    select('index-appearance','joanna');
    assert.match(css(),/--gramlot-field-height: 20px/);
    assert.doesNotMatch(css(),/--gramlot-field-height: 18px/);
    const saved=win.localStorage.getItem('gramlot.index.preferences:/app/');f.app.dispose();
    const g=fixture(false,w=>w.localStorage.setItem('gramlot.index.preferences:/app/',saved));
    assert.equal(g.get('index-appearance').value,'joanna');
    assert.equal(g.get('index-theme').value,'dark');g.app.dispose();
});
test('sidebar and theme preferences survive remount; disposed listeners stop',()=>{
    const f=fixture();f.get('index-theme').value='dark';f.get('index-theme').dispatchEvent(new f.document.defaultView.Event('change'));
    f.get('index-sidebar-divider').dispatchEvent(new f.document.defaultView.KeyboardEvent('keydown',{key:'ArrowRight'}));
    const saved=f.document.defaultView.localStorage.getItem('gramlot.index.preferences:/app/');
    f.app.dispose();const g=fixture(false,w=>w.localStorage.setItem('gramlot.index.preferences:/app/',saved));
    assert.equal(g.get('index-theme').value,'dark');assert.equal(g.get('index-sidebar-divider').getAttribute('aria-valuenow'),'250');g.app.dispose();
});

test('install action uses a browser-provided prompt once, and reports dismissal',async()=>{
    const f=fixture();let calls=0;
    const event=new f.document.defaultView.Event('beforeinstallprompt',{cancelable:true});
    event.prompt=async()=>{calls++;};event.userChoice=Promise.resolve({outcome:'dismissed'});
    f.document.defaultView.dispatchEvent(event);
    assert.equal(event.defaultPrevented,true);assert.equal(f.get('index-install-button').hidden,false);
    f.get('index-install-button').click();await new Promise(r=>setTimeout(r,0));
    assert.equal(calls,1);assert.match(f.get('index-install-status').textContent,/cancelled/);
    f.app.dispose();
    const later=new f.document.defaultView.Event('beforeinstallprompt',{cancelable:true});
    f.document.defaultView.dispatchEvent(later);assert.equal(later.defaultPrevented,false);
});
