/** Browser diagnostic only, not a Gramlot application or component implementation. */
import {webkit, chromium} from '../../../tools/gramlot-tools-inspector/node_modules/playwright/index.mjs';
for (const [name, engine] of Object.entries({webkit, chromium})) {
    const browser = await engine.launch();
    try {
        const page = await browser.newPage();
        await page.setContent('<div id="from" draggable="true" style="width:200px;height:80px">drag</div><div id="to" style="width:200px;height:80px">drop</div><button id="next">Next</button>');
        await page.evaluate(() => {
            window.trace = [];
            document.querySelector('#from').addEventListener('dragstart', event => event.dataTransfer.setData('text/plain', 'row'));
            document.querySelector('#to').addEventListener('dragover', event => event.preventDefault());
            document.querySelector('#to').addEventListener('drop', event => event.preventDefault());
            for (const type of ['pointerdown','mousedown','pointerup','mouseup','pointercancel','dragstart','dragend']) {
                document.addEventListener(type, event => window.trace.push([type, event.target.id]));
            }
        });
        await page.locator('#from').dragTo(page.locator('#to'));
        await page.locator('#next').click();
        console.log(JSON.stringify({browser:name, version:browser.version(), events:await page.evaluate(()=>window.trace)}));
    } finally { await browser.close(); }
}
