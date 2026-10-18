/** Python-authored border fixture; real pointer geometry, retained browsing context and draft. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';
const [python,entry,...engines]=process.argv.slice(2);
const playwright=await import(pathToFileURL(entry));
const root=fileURLToPath(new URL('../',import.meta.url));
const wire=execFileSync(python,['tests/fixtures/components/border_container.py'],{cwd:root,encoding:'utf8'}).trim();
const bundle=await build({stdin:{contents:`import {Gramlot} from './js/src/index.js';import inputs from './js/src/components/inputs.js';import layout from '/layout.js';layout.register(window);window.gramlot=new Gramlot({document,transport:false,collections:[inputs,layout.toDocument()]});gramlot.src.startSource(${JSON.stringify(wire)});`,resolveDir:root},external:['/layout.js'],bundle:true,write:false,format:'esm',platform:'browser',target:'es2022'});
const collection=await build({entryPoints:[root+'js/src/components/layout.js'],bundle:true,write:false,format:'esm',platform:'browser',target:'es2022'});
const server=createServer((req,res)=>{
    if(req.url==='/layout.js'){res.setHeader('Content-Type','text/javascript');res.end(collection.outputFiles[0].text);}
    else if(req.url==='/app.js'){res.setHeader('Content-Type','text/javascript');res.end(bundle.outputFiles[0].text);}
    else {res.setHeader('Content-Type','text/html');res.end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:16px;font:16px system-ui}*{box-sizing:border-box}</style><main id="gramlot-root"></main><script type="module" src="/app.js"></script>');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
try{
 for(const engine of engines.length?engines:['chromium','webkit']){
    const browser=await playwright[engine].launch();
    try{
        const page=await browser.newPage({viewport:{width:1000,height:700}}),errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        await page.goto(`http://127.0.0.1:${server.address().port}`);
        await page.locator('#draft input').waitFor({timeout:10000}).catch(error => { throw new Error(`${error.message}; page errors: ${errors.join('; ')}`); });
        await page.waitForFunction(()=>document.querySelector('#frame').contentDocument?.body?.textContent.includes('Retained'));
        await page.evaluate(()=>{
            window.saved={pane:document.querySelector('#left'),field:document.querySelector('#draft'),frame:document.querySelector('#frame'),context:document.querySelector('#frame').contentWindow};
            saved.context.marker=42;
        });
        for (const id of ['border','nested']) {
            assert(await page.locator('#'+id).evaluate(el => {
                const box=el.getBoundingClientRect();
                return [[1,1],[box.width-1,1],[1,box.height-1],[box.width-1,box.height-1]].every(([x,y]) =>
                    !el.contains(document.elementFromPoint(box.x+x,box.y+y)));
            }), `${engine} ${id} rounded corner clips its children`);
        }
        await page.evaluate(()=>gramlot.data.setItem('rounded',36));
        for(const id of ['border','nested']) assert.equal(await page.locator('#'+id).evaluate(el=>getComputedStyle(el).borderTopLeftRadius),'36px');
        const sep=side=>page.locator('#border').locator(`.separator[data-side=${side}]`).first();
        for (const side of ['left','right','top','bottom']) {
            const vertical=['left','right'].includes(side), separator=sep(side), drawer=separator.locator('button');
            const line=await separator.boundingBox(), grip=await drawer.boundingBox();
            assert.equal(line[vertical?'width':'height'],1, `${engine} thin ${side} separator`);
            assert.equal(grip[vertical?'width':'height'],4, `${engine} discreet ${side} drawer`);
            assert.equal(grip[vertical?'height':'width'],28);
            assert.equal(await drawer.getAttribute('title'),side);
            assert.equal(await drawer.textContent(),'');
            // Touch enlarges only the hit target, not the visible grip.
            await page.locator('#border').evaluate(el=>el.style.setProperty('--gramlot-touch-target','44px'));
            assert.equal((await drawer.boundingBox())[vertical?'width':'height'],4);
            assert.equal(await drawer.evaluate(el=>getComputedStyle(el,'::after').width),'44px');
            if(side==='left') {
                // Click outside the painted grip, inside its touch hit area.
                await page.mouse.click(grip.x+12,grip.y+grip.height/2);
                assert.equal(await drawer.getAttribute('aria-expanded'),'false');
                await drawer.click();assert.equal(await drawer.getAttribute('aria-expanded'),'true');
            }
            await page.locator('#border').evaluate(el=>el.style.removeProperty('--gramlot-touch-target'));
        }
        const size=side=>page.locator(`#${side}`).evaluate(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height}));
        for(const side of ['left','right','top','bottom']){
            const vertical=['left','right'].includes(side),before=await size(side),box=await sep(side).boundingBox();
            // Avoid the centrally placed drawer button.
            const x=vertical?box.x+box.width/2:box.x+10,y=vertical?box.y+10:box.y+box.height/2;
            await page.mouse.move(x,y);await page.mouse.down();
            const sign=['left','top'].includes(side)?1:-1;
            await page.mouse.move(x+(vertical?25*sign:0),y+(vertical?0:25*sign),{steps:4});
            const during=await size(side);
            assert(during[vertical?'w':'h']>before[vertical?'w':'h']+20,`${engine} ${side} live resize`);
            await page.mouse.up();
        }
        for(const side of ['left','right','top','bottom']) {
            const drawer=sep(side).locator('button'), box=await drawer.boundingBox();
            const vertical=['left','right'].includes(side), axis=vertical?'w':'h', before=await size(side);
            const sign=['left','top'].includes(side)?1:-1, x=box.x+box.width/2,y=box.y+box.height/2;
            await page.mouse.move(x,y);await page.mouse.down();
            await page.mouse.move(x+(vertical?16*sign:0),y+(vertical?0:16*sign),{steps:4});
            assert((await size(side))[axis]>before[axis]+12,`${engine} ${side} drawer drags its splitter live`);
            await page.mouse.up();
            assert.equal(await drawer.getAttribute('aria-expanded'),'true','drag must not toggle the drawer');
            await drawer.click();assert.equal(await drawer.getAttribute('aria-expanded'),'false');
            await drawer.focus();await page.keyboard.press('Enter');assert.equal(await drawer.getAttribute('aria-expanded'),'true');
        }
        for(const side of ['left','right','top','bottom']) {
            const drawer=sep(side).locator('button'), vertical=['left','right'].includes(side), axis=vertical?'w':'h';
            const before=await size(side), sign=['left','top'].includes(side)?1:-1;
            await drawer.click();assert.equal(await drawer.getAttribute('aria-expanded'),'false');
            const box=await drawer.boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;
            await page.mouse.move(x,y);await page.mouse.down();
            await page.mouse.move(x+(vertical?before[axis]*sign:0),y+(vertical?0:before[axis]*sign),{steps:5});
            assert.equal(await drawer.getAttribute('aria-expanded'),'true',`${engine} ${side} opens during drag`);
            assert(Math.abs((await size(side))[axis]-before[axis])<2,`${engine} ${side} closed drag sets its size`);
            await page.mouse.up();assert.equal(await drawer.getAttribute('aria-expanded'),'true','release keeps the reopened drawer open');
        }
        await page.mouse.move(0,0);await page.waitForTimeout(200);
        const hoverGrip=sep('left').locator('button'), normalGrip=await hoverGrip.boundingBox(), normalPanel=await size('left');
        await hoverGrip.hover();await page.waitForTimeout(200);
        const grownGrip=await hoverGrip.boundingBox();
        assert(grownGrip.width>normalGrip.width*1.6,`${engine} hover inflates the grip`);
        assert.equal((await size('left')).w,normalPanel.w,'hover does not change layout');
        await page.emulateMedia({reducedMotion:'reduce'});
        assert.equal(await hoverGrip.evaluate(el=>getComputedStyle(el).transitionDuration),'0s');
        await page.mouse.move(0,0);
        // Slight pointer jitter still counts as a click, without resizing.
        const jitter=sep('left').locator('button'), jitterBox=await jitter.boundingBox(), beforeJitter=await size('left');
        await page.mouse.move(jitterBox.x+2,jitterBox.y+14);await page.mouse.down();
        await page.mouse.move(jitterBox.x+4,jitterBox.y+14);await page.mouse.up();
        assert.equal(await jitter.getAttribute('aria-expanded'),'false');
        await jitter.click();assert.equal((await size('left')).w,beforeJitter.w);
        await page.locator('#draft input').fill('X');await page.locator('#draft input').press('Tab');
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('name')),'Ada');
        const handle=sep('left').locator('button');
        await handle.click();await page.waitForTimeout(50);
        assert.equal(await page.locator('#draft input').isVisible(),false);
        await handle.click();assert.equal(await page.locator('#draft input').inputValue(),'X');
        await page.evaluate(()=>gramlot.data.setItem('design','sidebar'));
        await page.setViewportSize({width:390,height:700});
        await page.setViewportSize({width:1000,height:700});
        assert(await page.evaluate(()=>saved.pane===document.querySelector('#left')&&saved.field===document.querySelector('#draft')&&saved.frame===document.querySelector('#frame')&&saved.context===document.querySelector('#frame').contentWindow&&saved.context.marker===42));
        const left=await page.locator('#left').boundingBox(),top=await page.locator('#top').boundingBox();
        assert(left.y<top.y+1 && left.height>400,`${engine} sidebar full height`);
        const w=(await size('left')).w;await sep('left').focus();await page.keyboard.press('ArrowRight');assert((await size('left')).w>w);
        await page.evaluate(()=>gramlot.data.setItem('shade','rgb(255, 0, 0)'));
        assert.equal(await sep('left').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 0, 0)');
        await page.locator('#popup-date .calendar-toggle').click();
        const popup=page.locator('#popup-date .calendar-popup');
        await popup.waitFor({state:'visible'});
        assert(await popup.evaluate(el=>el.matches(':popover-open')));
        const nestedBox=await page.locator('#nested').boundingBox();
        const days=popup.locator('.calendar-grid button');
        let selected=false;
        for(let i=0;i<await days.count();i++) {
            const day=days.nth(i), box=await day.boundingBox();
            if(box && (box.y+box.height/2>nestedBox.y+nestedBox.height || box.y+box.height/2<nestedBox.y)) {
                await day.click(); selected=true; break;
            }
        }
        assert(selected, 'Calendar date remains clickable outside the rounded ancestor');
        assert.equal(await popup.isVisible(),false);
        await page.locator('#popup-choice .toggle').click();
        const choiceBox=await page.locator('#popup-choice input').boundingBox();
        const menuBox=await page.locator('#popup-choice .choices').boundingBox();
        assert(Math.abs(menuBox.width-(choiceBox.width-4))<1, 'choice popup is inset from its field');
        await page.getByRole('option',{name:'Weekend',exact:true}).click();
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('delivery')),'weekend');
        for(const side of ['top','bottom','left','right']) {
            const drawer=sep(side).locator('button');
            await drawer.click(); await drawer.click();
        }
        await page.locator('#draft input').focus();await page.mouse.move(0,0);
        await page.evaluate(()=>{gramlot.data.setItem('drawerLabel','Details');gramlot.data.setItem('drawerClass','drawer-rotated drawer-reveal');});
        const reveal=sep('right').locator('button'), caption=reveal.locator('.drawer-label');
        assert.equal(await caption.evaluate(el=>getComputedStyle(el).writingMode),'vertical-rl');
        assert.equal(await caption.evaluate(el=>getComputedStyle(el).opacity),'0', JSON.stringify(await reveal.evaluate(el=>({open:getComputedStyle(el).getPropertyValue('--drawer-open'),hover:el.matches(':hover'),focus:el.matches(':focus-visible'),coarse:matchMedia('(pointer:coarse)').matches,nohover:matchMedia('(hover:none)').matches,html:el.outerHTML}))));
        const beforeReveal=await size('right');
        await reveal.hover();
        assert.equal(await reveal.evaluate(el=>getComputedStyle(el).width),'24px');
        assert.equal(await caption.evaluate(el=>getComputedStyle(el).opacity),'1');
        assert.deepEqual(await size('right'),beforeReveal,'revealing the label leaves region geometry unchanged');
        await page.mouse.move(0,0);await reveal.focus();await page.keyboard.press('ArrowRight');
        assert.equal(await caption.evaluate(el=>getComputedStyle(el).opacity),'1','keyboard focus reveals the text');
        await page.locator('#draft input').focus();
        await page.locator('#border').evaluate(el=>el.style.setProperty('--gramlot-drawer-reveal','1'));
        assert.equal(await caption.evaluate(el=>getComputedStyle(el).opacity),'1','touch preview token keeps text visible');
        await page.locator('#border').evaluate(el=>el.style.setProperty('--gramlot-drawer-reveal','0'));
        assert.equal(await caption.evaluate(el=>getComputedStyle(el).opacity),'0');
        await page.evaluate(()=>{gramlot.data.setItem('drawerLabel','');gramlot.data.setItem('drawerClass','');});
        await page.locator('#border').evaluate(el=>{el.style.setProperty('--gramlot-drawer-thickness','6px');el.style.setProperty('--gramlot-drawer-length','36px');});
        assert.equal(await reveal.evaluate(el=>getComputedStyle(el).width),'6px');
        assert.equal(await reveal.evaluate(el=>getComputedStyle(el).height),'36px');
        const touchPage=await browser.newPage({viewport:{width:600,height:800},hasTouch:true,isMobile:true});
        await touchPage.goto(`http://127.0.0.1:${server.address().port}`);await touchPage.locator('#draft input').waitFor();
        await touchPage.evaluate(()=>{gramlot.data.setItem('drawerLabel','Details');gramlot.data.setItem('drawerClass','drawer-rotated drawer-reveal');});
        assert.equal(await touchPage.locator('#border .separator[data-side=right] .drawer-label').first().evaluate(el=>getComputedStyle(el).opacity),'1','touch devices show labels without hover');
        await touchPage.close();
        await page.screenshot({path:`/tmp/gramlot-border-${engine}.png`});
        assert.deepEqual(errors,[]);await page.evaluate(()=>gramlot.dispose());
        console.log(`${engine}: four live splitters, nested geometry, drawers, invalid draft, Data, iframe identity, responsive resize, keyboard, reactive styling, rounded clipping and top-layer popup selection passed`);
    }finally{await browser.close();}
 }
}finally{await new Promise(r=>server.close(r));}
