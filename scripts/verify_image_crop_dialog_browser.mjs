/** Browser qualification of framing controls and confirmation/cancellation. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL, fileURLToPath} from 'node:url';
const [entry, engineName='chromium'] = process.argv.slice(2);
if (!entry) throw new Error('Expected Playwright module');
const engines = await import(pathToFileURL(resolve(entry)));
const crop = await readFile(fileURLToPath(new URL('../js/src/components/image-crop.js', import.meta.url)), 'utf8');
const dialogCode = await readFile(fileURLToPath(new URL('../js/src/components/image-crop-dialog.js', import.meta.url)), 'utf8');
const runtime = await readFile(new URL('../js/dist/gramlot.js',import.meta.url),'utf8');
const browser = await engines[engineName].launch({headless:true});
try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.evaluate(async ({crop,dialogCode,runtime}) => {
        const {Bag}=await import(URL.createObjectURL(new Blob([runtime],{type:'text/javascript'})));
        const cropUrl = URL.createObjectURL(new Blob([crop],{type:'text/javascript'}));
        const dialogUrl = URL.createObjectURL(new Blob([dialogCode.replace("'./image-crop.js'", JSON.stringify(cropUrl))],{type:'text/javascript'}));
        const {ImageCropDialog} = await import(dialogUrl);
        const canvas = document.createElement('canvas'); canvas.width = 4; canvas.height = 2;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red'; ctx.fillRect(0,0,2,2);
        ctx.fillStyle = 'blue'; ctx.fillRect(2,0,2,2);
        const image = new Image(); image.src = canvas.toDataURL('image/png'); await image.decode();
        const original = new File(['original'], 'original.png', {type:'image/png'});
        globalThis.makeDialog = () => {
            const editor = new ImageCropDialog({data:new Bag(),path:'crop',document,original,image,sourceWidth:4,sourceHeight:2,
                width:2,height:2,x:0,y:0,zoom:1,rotate:0,outputWidth:4,outputHeight:4,type:'image/png'});
            globalThis.editorResult = editor.open();
        };
        globalThis.imageOriginal = original;
    }, {crop,dialogCode,runtime});
    await page.evaluate(() => globalThis.makeDialog());
    const dialog = page.getByRole('dialog', {name:'Edit image'});
    await dialog.waitFor();
    const frame = dialog.getByLabel('Crop preview');
    const offset = () => frame.locator('img').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).e);
    const initial = await offset();
    await frame.focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await offset(), initial + 1);
    await dialog.getByRole('button', {name:'Reset'}).click();
    assert.equal(await offset(), initial);
    await dialog.getByRole('button', {name:'Confirm'}).click();
    const result = await page.evaluate(async () => {
        const {blob,transform} = await globalThis.editorResult;
        return {type:blob.type,size:blob.size,transform,original:await globalThis.imageOriginal.text()};
    });
    assert.equal(result.type,'image/png'); assert.ok(result.size > 0);
    assert.deepEqual(result.transform,{x:0,y:0,zoom:1,rotate:0});
    assert.equal(result.original,'original');
    await page.evaluate(() => globalThis.makeDialog());
    await page.getByRole('dialog').getByRole('button',{name:'Cancel'}).click();
    assert.equal(await page.evaluate(() => globalThis.editorResult), null);
    assert.equal(await page.locator('dialog').count(), 0);
    assert.deepEqual(errors, []);
    console.log(`PASS ${engineName}: accessible framing controls, reset, confirm and cancel.`);
} finally { await browser.close(); }
