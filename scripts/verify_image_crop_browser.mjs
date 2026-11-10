/** Browser qualification of the internal crop rasterizer. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL, fileURLToPath} from 'node:url';
const [entry, engineName = 'chromium'] = process.argv.slice(2);
if (!entry) throw new Error('Expected Playwright module');
const engines = await import(pathToFileURL(resolve(entry)));
const engine = engines[engineName];
if (!engine) throw new Error(`Unknown browser: ${engineName}`);
const code = await readFile(fileURLToPath(new URL('../js/src/components/image-crop.js', import.meta.url)), 'utf8');
const runtime = await readFile(new URL('../js/dist/gramlot.js',import.meta.url),'utf8');
const browser = await engine.launch({headless:true});
try {
    const page = await browser.newPage();
    const result = await page.evaluate(async ({source,runtime}) => {
        const {Bag}=await import(URL.createObjectURL(new Blob([runtime],{type:'text/javascript'})));
        const moduleUrl = URL.createObjectURL(new Blob([source], {type:'text/javascript'}));
        try {
            const {renderImageCrop, ImageCropSession} = await import(moduleUrl);
            const original = document.createElement('canvas'); original.width = 4; original.height = 2;
            const context = original.getContext('2d');
            context.fillStyle = '#ff0000'; context.fillRect(0,0,2,2);
            context.fillStyle = '#0000ff'; context.fillRect(2,0,2,2);
            const base = {document,image:original,sourceWidth:4,sourceHeight:2,width:2,height:2,
                outputWidth:4,outputHeight:4,x:0,y:0,zoom:1,rotate:0,type:'image/png'};
            async function pixels(params) {
                const blob = await renderImageCrop(params);
                const image = await createImageBitmap(blob);
                const canvas = document.createElement('canvas'); canvas.width = 4; canvas.height = 4;
                const ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.drawImage(image,0,0);
                const color = x => [...ctx.getImageData(x,1,1,1).data];
                return {left:color(0),right:color(3),type:blob.type};
            }
            const normal = await pixels(base);
            const shifted = await pixels({...base,x:1});
            const rotated = await pixels({...base,rotate:180});
            const originalRight = [...context.getImageData(3,0,1,1).data];
            const originalFile = new File(['original'], 'original.png', {type:'image/png'});
            const session = new ImageCropSession({data:new Bag(),path:'crop',...base, original:originalFile});
            session.setTransform({x:1,y:0,zoom:1,rotate:0});
            session.reset();
            const confirmed = await session.confirm({outputWidth:4,outputHeight:4,type:'image/png'});
            const cancelled = new ImageCropSession({data:new Bag(),path:'crop',...base, original:originalFile});
            const pending = cancelled.confirm({outputWidth:4,outputHeight:4,type:'image/png'});
            cancelled.cancel();
            let cancellation;
            try { await pending; cancellation = 'unexpected'; } catch (error) { cancellation = error.name; }
            const sessionResult = {type:confirmed.type, original:await originalFile.text(), cancellation};
            let rejected = false;
            try { await renderImageCrop({...base,type:'image/x-unsupported'}); } catch { rejected = true; }
            return {normal,shifted,rotated,originalRight,rejected,sessionResult};
        } finally { URL.revokeObjectURL(moduleUrl); }
    }, {source:code,runtime});
    const red = [255,0,0,255], blue = [0,0,255,255];
    assert.deepEqual(result.normal, {left:red,right:blue,type:'image/png'});
    assert.deepEqual(result.shifted.left, red);
    assert.ok(result.shifted.right[0] > result.shifted.right[2], 'translation moves the red area across the frame');
    assert.equal(result.shifted.type, 'image/png');
    assert.deepEqual(result.rotated, {left:blue,right:red,type:'image/png'});
    assert.deepEqual(result.originalRight, blue);
    assert.equal(result.rejected, true);
    assert.deepEqual(result.sessionResult, {type:'image/png',original:'original',cancellation:'AbortError'});
    console.log(`PASS ${engineName}: crop preserves the source; translation, rotation and output pixels are correct.`);
} finally { await browser.close(); }
