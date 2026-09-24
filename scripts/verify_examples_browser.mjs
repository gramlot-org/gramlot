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
    for (const integration of ['py', 'js']) {
        await page.goto(`${url}/${integration}/index`);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        await page.frame({name: 'example-catalog'}).waitForFunction(() => window.gramlot?.state === 'started');
        assert.equal(await page.locator('[role=tab]:visible').count(), 1, 'Only catalogue starts open');
        assert.equal(await page.locator('input[name=runner-language]').count(), 0);
        assert.equal(await page.locator('.runner-list button').count(), 13);
        assert.equal(await page.locator('iframe[src]').count(), 1, 'Examples load only when opened');
        await page.locator('[data-gramlot-open=e06]').click();
        const formFrame = page.frame({name: 'example-e06'});
        await formFrame.waitForURL(`**/${integration}/e06`);
        await formFrame.waitForFunction(() => window.gramlot?.state === 'started');
        await formFrame.locator('#name').fill('Preserve this input');
        const instance = await formFrame.evaluate(() => window.gramlot.pageId);
        await page.locator('[data-gramlot-open=e12]').click();
        await page.frame({name: 'example-e12'}).waitForFunction(() => window.gramlot?.state === 'started');
        assert.equal(await page.locator('[role=tab]:visible').count(), 3);
        await page.locator('[data-gramlot-tab=e06]').click();
        assert.equal(await formFrame.locator('#name').inputValue(), 'Preserve this input');
        assert.equal(await formFrame.evaluate(() => window.gramlot.pageId), instance, 'Frame was not reloaded');
        await page.locator('[data-gramlot-open=e06]').click();
        assert.equal(await page.locator('[role=tab]:visible').count(), 3, 'Reopen reuses the tab');
        const panel = page.locator('#panel-e06');
        assert.equal(await panel.isVisible(), true);
        assert.match(await panel.locator('.runner-explanation').innerText(), /Reset/);
        const descriptionBox = await panel.locator('.runner-explanation').boundingBox();
        const frameBox = await panel.locator('iframe').boundingBox();
        assert.ok(descriptionBox.y + descriptionBox.height <= frameBox.y + 1, 'Explanation sits above frame');
        const paths = await page.locator('iframe[src]').evaluateAll(frames => frames.map(f => new URL(f.src).pathname));
        assert.ok(paths.every(path => path.startsWith(`/${integration}/`)), 'Integration owns language');
        await page.locator('[data-gramlot-tab=e06]').focus();
        await page.keyboard.press('End');
        assert.equal(await page.locator('[data-gramlot-tab=e12]').getAttribute('aria-selected'), 'true');
        const links = await page.locator('a[href^="/examples/"]').evaluateAll(nodes => [...new Set(nodes.map(a => a.getAttribute('href')))]);
        for (const link of links) assert.equal((await context.request.get(`${url}${link}`)).status(), 200, link);
        console.log(`${integration} runner: integration-owned language, open/reuse, explanation, iframe state and keyboard passed`);
    }
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
