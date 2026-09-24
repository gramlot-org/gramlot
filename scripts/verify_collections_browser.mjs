/** Framework integration fixture, not an application authoring example. */
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const [playwrightPath, executablePath] = process.argv.slice(2);
if (!executablePath) throw new Error('Usage: node verify_collections_browser.mjs PLAYWRIGHT_ENTRY CHROMIUM');
const {chromium} = await import(pathToFileURL(playwrightPath));
const collection = JSON.parse(readFileSync(new URL('../tests/fixtures/collections/controls.json', import.meta.url)));
const url = process.env.GRAMLOT_TEST_URL;
if (!url) throw new Error('GRAMLOT_TEST_URL must identify a running Node/Bun adapter');
let browser;
try {
    browser=await chromium.launch({headless:true,executablePath});
    const page=await browser.newPage(); const errors=[];
    page.on('pageerror',error=>errors.push(String(error)));
    await page.goto(url); await page.waitForFunction(()=>window.gramlot?.state==='started');
    const result=await page.evaluate(async collection=>{
        window.gramlot.dispose();
        const {Gramlot,GramlotBuilder}=await import('/assets/gramlot.js');
        const builder=new GramlotBuilder(null,{collections:[collection]});
        builder.root.canvas('fallback',{id:'native-canvas'});
        builder.root.ratingPanel().rating(null,{amount:4,code:'IT'});
        const app=new Gramlot({document,transport:false,collections:[collection]});
        app.startSource(builder.toTytx());
        const rating=document.querySelector('gramlot-rating');
        const mounted=!!document.querySelector('canvas#native-canvas') && rating?.getAttribute('amount')==='4';
        const isolated=new GramlotBuilder().root.rating===undefined;
        let rejected=false;
        try{builder.root.ratingPanel().rating(null,{amount:20,code:'IT'});}catch{rejected=true;}
        app.dispose();
        return {mounted,isolated,rejected,records:app.renderer.records.size,children:document.getElementById('gramlot-root').children.length};
    },collection);
    assert.deepEqual(result,{mounted:true,isolated:true,rejected:true,records:0,children:0});
    assert.deepEqual(errors,[]);
    console.log('Browser PASS: full HTML collection, extra JSON collection, validation, render tag, isolation and cleanup.');
} finally {await browser?.close();}
