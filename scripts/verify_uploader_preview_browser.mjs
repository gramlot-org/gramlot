/** Verify safe preview and queue removal on the uploader-preview fixture.
 * Usage: node scripts/verify_uploader_preview_browser.mjs PLAYWRIGHT_MODULE PAGE_URL
 */
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const [modulePath, url] = process.argv.slice(2);
if (!modulePath || !url) throw new Error('Expected PLAYWRIGHT_MODULE PAGE_URL');
const {chromium} = await import(pathToFileURL(resolve(modulePath)).href);
const browser = await chromium.launch({headless:true});
try {
    const page = await browser.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(url);
    if (!response.ok()) throw new Error(`Page HTTP ${response.status()}`);
    const host = page.locator('#preview-uploader');
    await host.locator('input[type=file]').setInputFiles([
        {name:'first.html', mimeType:'text/html', buffer:Buffer.from('<img src=x onerror=alert(1)>')},
        {name:'second.txt', mimeType:'text/plain', buffer:Buffer.from('two')}
    ]);
    if (await host.locator('li').count() !== 2) throw new Error('Multiple files not queued');
    await host.locator('li').first().getByRole('button', {name:'Preview'}).click();
    const preview = host.locator('[aria-label="File preview"]');
    await preview.locator('pre').waitFor();
    if (await preview.locator('img').count()) throw new Error('Markup was interpreted as HTML');
    if ((await preview.innerText()) !== '<img src=x onerror=alert(1)>') throw new Error('Unexpected preview text');
    await host.locator('li').first().getByRole('button', {name:'Remove'}).click();
    if (await host.locator('li').count() !== 1 || await preview.locator('pre').count()) throw new Error('Removal did not clear preview');
    if (errors.length) throw new Error(errors.join('; '));
    console.log('Multiple queue, safe text preview and removal verified.');
} finally { await browser.close(); }
