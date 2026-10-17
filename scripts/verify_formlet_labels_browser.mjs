/** Python Source + selected JS collection, tested with actual native controls in browser engines. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {build} from '../js/node_modules/esbuild/lib/main.js';

const [python, playwrightEntry, ...engines] = process.argv.slice(2);
if (!playwrightEntry) throw new Error('Usage: node scripts/verify_formlet_labels_browser.mjs PYTHON PLAYWRIGHT_ENTRY [ENGINE ...]');
const root = fileURLToPath(new URL('../', import.meta.url));
const playwright = await import(pathToFileURL(playwrightEntry));
const wire = execFileSync(python, ['tests/fixtures/components/formlet_labels.py'], {cwd:root, encoding:'utf8'}).trim();
const bundle = await build({stdin:{contents:`
import {Gramlot} from './js/src/index.js';
import inputs from './js/src/components/inputs.js';
import layout from './js/src/components/layout.js';
window.gramlot = new Gramlot({document, transport:false, collections:[inputs,layout]});
window.gramlot.src.startSource(${JSON.stringify(wire)});
`, resolveDir:root}, bundle:true, write:false, format:'esm', platform:'browser', target:'es2022'});
const server = createServer((request,response) => {
    if (request.url === '/fixture.js') {
        response.writeHead(200, {'Content-Type':'text/javascript'});
        response.end(bundle.outputFiles[0].text);
    } else {
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end('<!doctype html><title>Component qualification</title><main id="gramlot-root"></main><script type="module" src="/fixture.js"></script>');
    }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
    for (const engine of engines.length ? engines : ['chromium','webkit']) {
        browser = await playwright[engine].launch({headless:true});
        const page = await browser.newPage({viewport:{width:1000,height:760}});
        const errors=[]; page.on('pageerror', error=>errors.push(String(error)));
        await page.goto(`http://127.0.0.1:${server.address().port}`);
        await page.waitForFunction(()=>window.gramlot?.state === 'started');
        const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))));
        const geometry = () => page.evaluate(() => Object.fromEntries(['a','b','c','d','e','f','nested-field','outer-field','fixed'].map(id => {
            const h=document.getElementById(id), box=h.labelBox.getBoundingClientRect(), control=h.controlBox.getBoundingClientRect();
            return [id, {host:h.getBoundingClientRect().left, label:box.width, text:h.fieldLabel.getBoundingClientRect().width,
                x:control.left, gap:control.left-h.fieldLabel.getBoundingClientRect().right,
                explicit:h.box.style.getPropertyValue('--gramlot-label-width')}];
        })));
        const aligned = (g, ids) => {for (const id of ids) assert(Math.abs(g[id].x-g[ids[0]].x)<1, `unaligned ${ids}: ${JSON.stringify(g)}`);};
        await settle();
        let g=await geometry();
        aligned(g,['a','c','e']); aligned(g,['b','d','f']);
        assert(g.c.label > g.b.label + 30, 'columns use independent intrinsic maxima');
        assert(g['nested-field'].label < g['outer-field'].label, 'nested columns are independent');
        assert.equal(g.fixed.explicit,'10rem');
        assert.equal(g.a.explicit,'');
        const beforeTheme=g.c.label;
        const theme=await page.addStyleTag({content:'#form{--gramlot-label-size:24px}'});
        await settle(); g=await geometry(); aligned(g,['a','c','e']);
        assert(g.c.label>beforeTheme+20,'theme font changes resize intrinsic columns');
        await theme.evaluate(el=>el.remove());
        await settle();
        await page.locator('#a input').fill('Uncommitted draft');
        await page.locator('#a input').evaluate(el=>el.setSelectionRange(2,5));
        await page.evaluate(()=>gramlot.data.setItem('caption','Longer customer description'));
        await settle(); g=await geometry(); aligned(g,['a','c','e']);
        const larger=g.c.label;
        await page.evaluate(()=>gramlot.data.setItem('caption','N'));
        await settle(); g=await geometry(); aligned(g,['a','c','e']);
        assert(g.c.label < larger-20, 'column shrinks after longest label shortens');
        await page.evaluate(()=>gramlot.data.setItem('caption',null));
        await settle(); g=await geometry(); aligned(g,['a','c','e']);
        await page.evaluate(()=>gramlot.data.setItem('caption','N'));
        await page.evaluate(()=>gramlot.data.setItem('columns',1));
        await settle(); g=await geometry(); aligned(g,['a','b','c','d','e','f']);
        assert.deepEqual(await page.locator('#a input').evaluate(el=>({draft:el.value,focus:el.getRootNode().activeElement===el,start:el.selectionStart,end:el.selectionEnd})),
            {draft:'Uncommitted draft',focus:true,start:2,end:5});
        assert.equal(await page.evaluate(()=>gramlot.data.getItem('name')),'Ada');
        await page.evaluate(()=>gramlot.data.setItem('minimum','20rem'));
        await page.setViewportSize({width:430,height:900});
        await settle(); g=await geometry(); aligned(g,['a','b','c','d','e','f']);
        await page.setViewportSize({width:900,height:900});
        await settle(); g=await geometry(); aligned(g,['a','c','e']); aligned(g,['b','d','f']);
        assert(g.b.host > g.a.host+100, 'responsive columns expand again');
        // Label styling reprojects through Source; no widths are supplied by the fixture.
        await page.evaluate(()=>gramlot.src.source.getNode('main.main_0.form').setAttr({lbl_font_size:'22px'}));
        await settle(); g=await geometry(); aligned(g,['a','c','e']);
        assert(g.c.text > 70, 'font change is measured');
        await page.evaluate(()=>gramlot.src.source.getNode('main.main_0.form.a').setAttr({lbl_width:'12rem'}));
        await settle(); g=await geometry(); aligned(g,['a','c','e']);
        assert.equal(g.a.explicit,'12rem');
        await page.evaluate(()=>gramlot.src.source.getNode('main.main_0.form.a').setAttr({lbl_width:null}));
        await settle(); g=await geometry(); assert.equal(g.a.explicit,'');
        const beforeRemoval=g.c.label;
        await page.evaluate(()=>gramlot.src.source.getNode('main.main_0.form').value.popNode('textbox_1'));
        await settle();
        const afterRemoval=await page.locator('#e .label-box').evaluate(el=>el.getBoundingClientRect().width);
        assert(afterRemoval<beforeRemoval,'removing the widest label releases its width');
        await page.screenshot({path:`/tmp/gramlot-formlet-labels-${engine}.png`});
        await page.evaluate(()=>gramlot.dispose());
        assert.deepEqual(errors,[]);
        await browser.close(); browser=null;
        console.log(`${engine}: PASS — per-column intrinsic labels, reactive growth/shrink, responsive layout, nested isolation, explicit override, font changes, removal, draft/focus/Data retention.`);
    }
} finally {await browser?.close(); await new Promise(resolve=>server.close(resolve));}
