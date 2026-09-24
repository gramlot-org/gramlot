/** Local examples acceptance check; uses an already installed Playwright and Chrome. */
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const [url, playwrightEntry, executablePath, output = 'build/examples-review'] = process.argv.slice(2);
if (!url || !playwrightEntry || !executablePath) {
    throw new Error('Usage: node scripts/verify_examples_browser.mjs URL PLAYWRIGHT_ENTRY CHROME [OUTPUT]');
}
const {chromium} = await import(pathToFileURL(resolve(playwrightEntry)));
await mkdir(output, {recursive: true});
const browser = await chromium.launch({headless: true, executablePath});
console.log(`Browser: ${browser.version()}`);
const errors = [];
const context = await browser.newContext({viewport: {width: 1440, height: 1000}, colorScheme: 'light'});
context.on('page', page => page.on('pageerror', error => errors.push(`${page.url()}: ${error.stack}`)));
context.on('response', response => {
    if (response.url().startsWith(url) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
});
const page = await context.newPage();
const routes = ['catalog', ...Array.from({length: 12}, (_, i) => `e${String(i + 1).padStart(2, '0')}`)];
const snapshot = () => {
    const visit = node => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent;
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        return [node.localName, node.namespaceURI,
            [...node.attributes].map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b)),
            [...node.childNodes].map(visit).filter(n => n !== null)];
    };
    return visit(document.querySelector('#gramlot-root'));
};
try {
    for (const route of routes) {
        const rendered = [];
        for (const language of ['py', 'js']) {
            const response = await page.goto(`${url}/${language}/${route}`);
            assert.equal(response.status(), 200);
            await page.waitForFunction(() => window.gramlot?.state === 'started');
            rendered.push(await page.evaluate(snapshot));
            assert.deepEqual(await page.locator('label[for]').evaluateAll(labels => labels.filter(l => !l.control).map(l => l.htmlFor)), [], 'Every explicit label resolves to its control');
            assert.equal(await page.locator('link[href="/themes/gramlot-base/theme.css"]').count(), 1);
            assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(247, 248, 245)');
            assert.equal(await page.evaluate(() => [...document.querySelectorAll('svg')].every(svg =>
                svg.namespaceURI === 'http://www.w3.org/2000/svg')), true);
            if (route === 'e06') {
                const range = page.locator('input[type=range]').first();
                const initial = await range.inputValue();
                await range.fill('25');
                assert.equal(await range.inputValue(), '25');
                await page.locator('button[type=reset]').click();
                assert.equal(await range.inputValue(), initial);
                assert.equal(await page.locator('input[readonly]').first().getAttribute('readonly') !== null, true);
                assert.equal(await page.locator('button[type=submit]').isDisabled(), true);
            }
            if (route === 'e07') {
                const details = page.locator('details').first();
                const before = await details.getAttribute('open');
                await details.locator('summary').click();
                assert.notEqual(await details.getAttribute('open'), before);
            }
        }
        assert.deepEqual(rendered[1], rendered[0], `Python/JS rendered parity: ${route}`);
        await page.emulateMedia({colorScheme: 'dark'});
        await page.setViewportSize({width: 390, height: 844});
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${route}: narrow layout`);
        await page.emulateMedia({colorScheme: 'light'});
        await page.setViewportSize({width: 1440, height: 1000});
        console.log(`${route}: Python/JavaScript render and parity passed`);
    }
    await page.goto(`${url}/`);
    await page.waitForFunction(() => window.gramlot?.state === 'started');
    await page.locator('iframe[name="python-example"]').waitFor();
    for (const name of ['python-example', 'javascript-example']) {
        const initialFrame = page.frame({name});
        await initialFrame.waitForFunction(() => window.gramlot?.state === 'started');
    }
    await page.locator('a[href="/py/e12"][target="python-example"]').click();
    const frame = page.frame({name: 'python-example'});
    await frame.waitForURL('**/py/e12');
    await frame.waitForFunction(() => window.gramlot?.state === 'started');
    await page.locator('label[for=show-javascript]').click();
    assert.equal(await page.locator('#show-javascript').isChecked(), true);
    assert.equal(await page.locator('.runner-panel-js').isVisible(), true);
    assert.equal(await page.locator('.runner-panel-py').isVisible(), false);
    await page.locator('#show-javascript').press('ArrowLeft');
    assert.equal(await page.locator('#show-python').isChecked(), true, 'Native keyboard radio selection');
    const links = await page.locator('a[href^="/examples/"]').evaluateAll(nodes => [...new Set(nodes.map(a => a.getAttribute('href')))]);
    for (const link of links) assert.equal((await context.request.get(`${url}${link}`)).status(), 200, link);
    await page.screenshot({path: `${output}/runner-light.png`, fullPage: true});
    await page.emulateMedia({colorScheme: 'dark'});
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(247, 248, 245)');
    await page.screenshot({path: `${output}/runner-dark.png`, fullPage: true});
    await page.setViewportSize({width: 390, height: 844});
    await page.screenshot({path: `${output}/runner-narrow.png`, fullPage: true});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'Runner must fit narrow viewport');
    await page.goto(`${url}/py/catalog`);
    await page.waitForFunction(() => window.gramlot?.state === 'started');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'Catalogue must fit narrow viewport');
    await page.screenshot({path: `${output}/catalogue-dark-narrow.png`, fullPage: true});
    assert.deepEqual(errors, [], 'Browser errors or failed local assets');
    console.log('PASS: 26 pages; language parity; native controls; runner navigation; light/dark/narrow smoke checks.');
} finally {
    await browser.close();
}
