/** Adversarial regression checks on current core sources, independent of a gallery/server adapter. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';

const [entry] = process.argv.slice(2);
const playwright = await import(pathToFileURL(entry));
const root = fileURLToPath(new URL('../', import.meta.url));
const themes = {};
for (const theme of ['gramlot-base', 'gramlot-compact', 'mimi', 'joanna']) {
    themes[theme] = await readFile(new URL(`../themes/${theme}/theme.css`, import.meta.url), 'utf8');
}
const bundle = await build({stdin: {resolveDir: root, contents: `
import {Gramlot, GramlotBuilder} from './js/src/index.js';
import inputs from './js/src/components/inputs.js';
import layout from './js/src/components/layout.js';
window.gramlot=new Gramlot({document,transport:false,collections:[inputs,layout],locale:'it-IT'});
const b=new GramlotBuilder(null,{collections:[inputs,layout]});
const r=b.root;
r.formlet({id:'form',node_label:'form',columns:1,lbl_position:'^position',max_width:'24rem'})
 .textbox({id:'field',node_label:'field',lbl:'Name',value:'^customer.name'});
r.checkbox({id:'switch',lbl:'Enabled',value:'^customer.enabled',mode:'switch'});
r.groupBox({id:'group',lbl:'Customer',copy:true,datapath:'customer'});
r.filteringSelect({id:'choices',lbl:'Choose',values:Array.from({length:20},(_,i)=>i+':Choice '+i).join(',')});
r.dateTextBox({id:'date',lbl:'Date'});
r.textbox({id:'invalid',lbl:'Required',value:'^required',validate_notnull:true});
r.verticalSlider({id:'vertical',value:20});
gramlot.data.setItem('customer.name','Ada');gramlot.data.setItem('customer.enabled',false);
gramlot.data.setItem('position','TL');gramlot.data.setItem('required','Valid');
gramlot.src.startSource(b.toTytx());
`}, bundle:true, write:false, platform:'browser', format:'esm'});
const server = createServer((request,response) => {
    if (request.url === '/fixture.js') {
        response.writeHead(200, {'Content-Type':'text/javascript'}); response.end(bundle.outputFiles[0].text);
    } else {
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end('<!doctype html><title>Component review</title><style id="theme"></style><main id="gramlot-root"></main><script type="module" src="/fixture.js"></script>');
    }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
    for (const engine of ['chromium','webkit']) {
        browser = await playwright[engine].launch({headless:true});
        const page = await browser.newPage({viewport:{width:900,height:850}}), errors=[];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(`http://127.0.0.1:${server.address().port}`);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        const field=page.locator('#field input');
        await field.fill('Uncommitted');
        await page.evaluate(()=>gramlot.data.setItem('position','L'));
        assert.equal(await field.inputValue(),'Uncommitted');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('customer.name')),'Ada');
        for (const theme of Object.keys(themes)) {
            const css=themes['gramlot-base']+(theme==='gramlot-base'?'':themes['gramlot-compact'])
                +(['mimi','joanna'].includes(theme)?themes[theme]:'');
            await page.locator('#theme').evaluate((el,text)=>el.textContent=text,css);
            for (const touch of ['off','on']) {
                const size=await page.evaluate(touch=>{
                    document.documentElement.dataset.gramlotTouch=touch;
                    document.documentElement.style.setProperty('--gramlot-formlet-gap','27px');
                    const sw=document.getElementById('switch');
                    sw.style.setProperty('--gramlot-switch-width','70px');sw.style.setProperty('--gramlot-switch-height','40px');
                    const c=sw.control,thumb=getComputedStyle(c,'::before');
                    document.getElementById('vertical').style.setProperty('--gramlot-slider-height','160px');
                    return {gap:getComputedStyle(document.getElementById('form').control).gap,
                        width:parseFloat(thumb.width),height:parseFloat(thumb.height),
                        slider:getComputedStyle(document.getElementById('vertical').control).height};
                },touch);
                assert.equal(size.gap,'27px');assert(Math.abs(size.width-size.height)<1);assert.equal(size.slider,'160px');
                for (const checked of [false,true]) {
                    await page.evaluate(checked=>gramlot.data.setItem('customer.enabled',checked),checked);
                    const metrics=await page.locator('#switch input').evaluate(el=>{
                        const t=getComputedStyle(el,'::before');return {left:parseFloat(t.left),thumb:parseFloat(t.width),track:el.clientWidth};
                    });
                    assert(metrics.left>=0 && metrics.left+metrics.thumb<=metrics.track);
                }
            }
        }
        // Explicit per-instance spacing still wins over the page token.
        await page.evaluate(()=>gramlot.src.source.getNode('main.form').setAttr({gap:'9px'}));
        assert.equal(await page.locator('#form').evaluate(el=>getComputedStyle(el.control).gap),'9px');
        await page.evaluate(()=>{
            const choices=document.getElementById('choices');
            choices.style.cssText='position:fixed;right:2px;bottom:2px;width:180px;--gramlot-choice-max-height:80px';
        });
        await page.locator('#choices input').focus();await page.locator('#choices input').press('ArrowDown');
        await page.waitForFunction(()=>document.getElementById('choices').choices.matches(':popover-open'));
        const popup=await page.locator('gramlot-filtering-select#choices').evaluate(el=>{
            const r=el.choices.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,height:r.height};
        });
        assert(popup.x>=8 && popup.y>=8 && popup.right<=892 && popup.bottom<=842 && popup.height<=81);
        await page.locator('#choices input').press('Escape');
        await page.locator('#date button.calendar-toggle').click();
        await page.waitForFunction(()=>document.getElementById('date').calendarPopup.matches(':popover-open'));
        await page.keyboard.press('Escape');
        await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}});});
        await page.getByRole('button',{name:'Choose copy format'}).click();
        await page.waitForFunction(()=>document.getElementById('group').copyMenu.matches(':popover-open'));
        await page.setViewportSize({width:850,height:850});
        await page.waitForFunction(()=>!document.getElementById('group').copyMenu.matches(':popover-open'));
        await page.locator('#invalid input').fill('');await page.locator('#invalid input').press('Tab');
        await page.waitForFunction(()=>!document.getElementById('invalid').message.hidden);
        await page.waitForFunction(()=>document.getElementById('invalid').message.hidden);
        assert.equal(await page.locator('#invalid input').getAttribute('aria-invalid'),'true');
        assert.deepEqual(errors,[]);
        await page.screenshot({path:`/tmp/gramlot-review-${engine}.png`});
        await browser.close();browser=null;
        console.log(`${engine}: PASS — drafts, four themes × touch on/off, inherited/explicit gaps, switch geometry, slider sizing, popup bounds/cleanup and error expiry.`);
    }
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
