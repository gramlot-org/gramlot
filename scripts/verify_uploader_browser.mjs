/** Verify the uploader fixture against a running ASGI application.
 * Usage: node scripts/verify_uploader_browser.mjs PLAYWRIGHT_MODULE PAGE_URL SOURCE_FILE
 */
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const [modulePath, url, source] = process.argv.slice(2);
if (!modulePath || !url || !source) throw new Error('Expected PLAYWRIGHT_MODULE PAGE_URL SOURCE_FILE');
const {chromium} = await import(pathToFileURL(resolve(modulePath)).href);
const browser = await chromium.launch({headless:true});
try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
    const response = await page.goto(url);
    if (!response.ok()) throw new Error(`Page HTTP ${response.status()}`);
    const uploader = page.locator('#upload-test');
    await uploader.locator('input[type=file]').setInputFiles({name:'invalid.grmlt', mimeType:'text/plain', buffer:Buffer.from('invalid')});
    await uploader.getByRole('button', {name:'Upload'}).click();
    await uploader.getByText('failed', {exact:false}).waitFor();
    await page.getByText('Old design').waitFor();
    await uploader.locator('input[type=file]').setInputFiles(resolve(source));
    await uploader.getByRole('button', {name:'Upload'}).click();
    await uploader.getByText('completed', {exact:false}).waitFor();
    await page.getByText('Imported design').waitFor();
    const unexpected = errors.filter(error => !error.includes('400 (Bad Request)'));
    if (unexpected.length) throw new Error(`Browser errors: ${unexpected.join('; ')}`);
    console.log('Rejected invalid Source without replacing the page; uploaded and mounted valid Source.');
} finally { await browser.close(); }
