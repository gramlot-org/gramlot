/** Real browser qualification of the command family; no gallery dependency. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';
const playwright = await import(pathToFileURL(process.argv[2]));
const root = fileURLToPath(new URL('../', import.meta.url));
const themes = {};
for (const name of ['gramlot-base','gramlot-compact','mimi','joanna']) themes[name] = await readFile(new URL(`../themes/${name}/theme.css`, import.meta.url),'utf8');
const bundle = await build({stdin:{resolveDir:root,contents:`
import {Gramlot,GramlotBuilder} from './js/src/index.js';
window.gramlot=new Gramlot({document,transport:false});
const b=new GramlotBuilder(); const r=b.root.main({class:'stack',padding:'20px'});
r.h2('Command components');
r.button('Confirm',{id:'ask',icon:'✓',ask:'Continue?',action:"this.SET('result','confirmed')"});
r.toggleButton('Enabled',{id:'toggle',value:'^enabled',action:"this.SET('observed',this.GET('enabled'))"});
const drop=r.dropDownButton('Default',{id:'drop',persist:true,action:"this.SET('result','default')"});
const m=drop.menu();
m.menuline('CSV',{code:'csv',id:'csv',action:"this.SET('result','csv'); this.SET('calls',(this.GET('calls')||0)+1)"});
m.menuline('-');
m.menuline('Unavailable',{code:'unavailable',disabled:true,action:'1'});
m.menuline('PDF',{code:'pdf',id:'pdf',action:"this.SET('result','pdf'); this.SET('calls',(this.GET('calls')||0)+1)"});
r.p('^result');gramlot.data.setItem('enabled',false);gramlot.src.startSource(b.toTytx());
`},bundle:true,write:false,platform:'browser',format:'esm'});
const server = createServer((req,res)=> {
    res.setHeader('Content-Type',req.url==='/fixture.js'?'text/javascript':'text/html');
    res.end(req.url==='/fixture.js'?bundle.outputFiles[0].text:'<!doctype html><style id="theme"></style><main id="gramlot-root"></main><script type="module" src="/fixture.js"></script>');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
    for(const engine of ['chromium','webkit']) {
        const browser=await playwright[engine].launch({headless:true});
        try {
            const page=await browser.newPage({viewport:{width:800,height:700}}), errors=[];
            page.on('pageerror',e=>errors.push(e.message));
            await page.goto(`http://127.0.0.1:${server.address().port}/`);
            await page.waitForFunction(()=>window.gramlot?.state==='started');
            const data=path=>page.evaluate(p=>gramlot.data.getItem(p),path);
            await page.locator('#drop button.split').click(); assert.equal(await data('result'),'default');
            assert.equal(await page.locator('#drop .popup').isVisible(),false);
            await page.locator('#drop button.arrow').click();
            await page.locator('#csv button').click(); assert.equal(await data('result'),'csv'); assert.equal(await data('calls'),1);
            await page.locator('#drop button.split').click(); assert.equal(await data('result'),'default');
            await page.locator('#drop button.arrow').click();
            await page.locator('#pdf button').click({modifiers:['Shift']}); assert.equal(await data('result'),'pdf'); assert.equal(await data('calls'),2);
            assert.equal(await page.locator('#drop button.split').innerText(),'PDF');
            await page.reload(); await page.waitForFunction(()=>window.gramlot?.state==='started');
            await page.locator('#drop button.split').click(); assert.equal(await data('result'),'pdf'); assert.equal(await data('calls'),1);
            await page.locator('#drop button.arrow').focus(); await page.keyboard.press('ArrowDown');
            await page.keyboard.press('End'); await page.keyboard.press('Home'); await page.keyboard.press('Shift+Enter');
            assert.equal(await data('result'),'csv'); assert.equal(await data('calls'),2);
            await page.locator('#drop button.arrow').click(); await page.keyboard.press('Escape');
            assert.equal(await page.locator('#drop .popup').isVisible(),false);
            assert.equal(await page.locator('#drop button.arrow').evaluate(el=>el.getRootNode().activeElement===el),true);
            await page.locator('#toggle button').focus(); await page.keyboard.press('Space');
            assert.equal(await data('enabled'),true);assert.equal(await data('observed'),true);
            assert.ok((await page.locator('#toggle .led').boundingBox()).width>0);
            await page.locator('#ask button').click();await page.locator('dialog button[type=submit]').click();
            assert.equal(await data('result'),'confirmed');
            for(const theme of Object.keys(themes)) {
                await page.locator('#theme').evaluate((el,css)=>el.textContent=css,themes['gramlot-base']+(theme==='gramlot-base'?'':themes['gramlot-compact'])+(['mimi','joanna'].includes(theme)?themes[theme]:''));
                for(const touch of ['off','on']) {
                    await page.evaluate(mode=>gramlot.dom.setTouchMode(mode),touch);
                    const size=await page.locator('#drop button.arrow').boundingBox();
                    assert.ok(size.width>0 && size.height>0);
                    if(touch==='on') assert.ok(size.height>=44,`${theme}: touch height ${size.height}`);
                    await page.locator('#drop button.arrow').click();
                    const popup=await page.locator('#drop .popup').boundingBox();
                    assert.ok(popup.x>=0&&popup.y>=0&&popup.x+popup.width<=800&&popup.y+popup.height<=700);
                    await page.keyboard.press('Escape');
                }
            }
            await page.evaluate(()=>gramlot.dom.setTouchMode('off'));
            await page.locator('#drop button.arrow').click();
            await page.screenshot({path:`/tmp/gramlot-buttons-${engine}.png`});
            assert.deepEqual(errors,[]);
            console.log(`${engine}: main/arrow, normal/Shift selection, persistence, keyboard, toggle, ask, 4 themes and touch passed`);
        } finally {await browser.close();}
    }
} finally {await new Promise(resolve=>server.close(resolve));}
