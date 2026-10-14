/** First-slice qualification: Python wire and JS Source in Chromium and WebKit. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {chromium, webkit} from 'playwright';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const wire = execFileSync(`${repo}/.venv/bin/python`, ['tools/poc/tree-fixture.py'], {cwd:repo, encoding:'utf8'}).trim();
const fixture = `
import {Bag, Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import '../../poc/gramlot-poc-tree.js';
const app=new Gramlot({element:document.getElementById('app'), transport:false});
const data=new Bag({contexts:new Bag({name:'Outer',child:new Bag({name:'Inner'})}),
    settings:new Bag({caption:'Pointers',intro:'The Data being inspected'}), person:new Bag({name:'Ada'})});
let tree;
class Logic {
    select(node,event){app.data.setItem('selection', event.detail.path ?? 'Select a node');}
    action(node,event){app.data.setItem('selection',event.detail.action+': '+event.detail.path);}
    data(){tree.storeBag=data; app.data.setItem('selection','Select a node');}
    source(){tree.storeBag=app.src.source; app.data.setItem('selection','Select a node');}
}
app.src.logicRegistry.register(Logic,{group:'inspector',resource:'tree-fixture'});
const builder=new GramlotBuilder();
const pane=builder.root.section({node_label:'pane',class:'inspector-editor'});
const bar=pane.div({class:'tabs'});
bar.button('Data',{type:'button',connect_onclick:'inspector.data'});
bar.button('Source',{type:'button',connect_onclick:'inspector.source'});
pane.webcomponent({code:'gramlot-poc-tree',node_label:'tree',connect_onchange:'inspector.select','connect_ontree-action':'inspector.action'});
pane.p('^selection',{class:'path'});
app.data.setItem('selection','Select a node');
app.src.startSource(location.search==='?python' ? ${JSON.stringify(wire)} : builder.source);
tree=app.dom.getDomNode(app.src.source.getNode('main.pane.tree'));
tree.rowActions=[{id:'breakpoint',icon:'●',label:'Breakpoint'}];
tree.storeBag=data;
window.fixture={app,tree,data};
`;
const output = await build({stdin:{contents:fixture,resolveDir:fileURLToPath(new URL('./',import.meta.url)),sourcefile:'tree-fixture.js'},
    bundle:true,format:'esm',platform:'browser',target:'es2022',write:false,loader:{'.css':'text'},
    alias:{'@gramlot/gramlot':`${repo}/js/src/index.js`}});
const html=`<!doctype html><html><head><meta charset="utf-8"><title>Gramlot provisional tree qualification</title>
<style>body{margin:20px;background:#fff;color:#38414b;font:13px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.inspector-editor{width:440px;border:1px solid #d3dbe7;display:flex;flex-direction:column;min-height:360px}
.tabs{display:flex;background:#edf2fa;border-bottom:1px solid #d3dbe7;padding:4px 8px;gap:12px}
.tabs button{border:0;background:transparent;color:#315dbd;padding:6px 3px;font:600 13px sans-serif}
gramlot-poc-tree{padding:10px 8px;flex:1}.path{border-top:1px solid #d3dbe7;padding:8px;margin:0;background:#f6f7f9;font-style:italic}
</style></head><body><main id="app"></main><script type="module" src="/fixture.js"></script></body></html>`;
const server=createServer((request,response)=>{
    const js=request.url==='/fixture.js';
    response.setHeader('content-type',js?'text/javascript':'text/html');
    response.end(js?output.outputFiles[0].text:html);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
    for (const engine of [chromium,webkit]) {
        const browser=await engine.launch({headless:true});
        try {
            for (const author of ['python','javascript']) {
                const page=await browser.newPage({viewport:{width:800,height:600}});
                const errors=[]; page.on('pageerror',error=>errors.push(error.message));
                await page.goto(`http://127.0.0.1:${server.address().port}/${author==='python'?'?python':''}`);
                const tree=page.locator('gramlot-poc-tree');
                await tree.locator('summary').filter({hasText:'contexts'}).click();
                await tree.locator('[data-node-path="contexts.name"]').click();
                assert.equal(await page.locator('.path').textContent(),'contexts.name');
                await page.evaluate(()=>fixture.data.setItem('contexts.added','New'));
                await tree.locator('[data-node-path="contexts.added"]').waitFor();
                assert.equal(await tree.locator('.selected .caption').textContent(),'name');
                if (engine===chromium && author==='python') await page.screenshot({path:'/private/tmp/gramlot-poc-tree-python.png'});
                await page.getByRole('button',{name:'Source',exact:true}).click();
                await tree.locator('summary').filter({hasText:'main'}).first().click();
                await tree.locator('summary').filter({hasText:'pane'}).first().click();
                await tree.locator('[data-node-path="main.pane.tree"] .caption').click();
                assert.equal(await page.locator('.path').textContent(),'main.pane.tree');
                await tree.locator('[data-node-path="main.pane.tree"] button').click();
                assert.equal(await page.locator('.path').textContent(),'breakpoint: main.pane.tree');
                assert.deepEqual(errors,[]);
                await page.close();
                console.log(`${engine.name()} / ${author}: render, selection, live updates, Source and row action passed`);
            }
        } finally {await browser.close();}
    }
} finally {await new Promise(resolve=>server.close(resolve));}
