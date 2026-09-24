/** Verify Source-driven card removal in hosted and offline pages. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [playwright, executablePath, ...urls] = process.argv.slice(2);
const {chromium} = await import(pathToFileURL(playwright));
const browser = await chromium.launch({headless: true, executablePath});
try {
    for (const url of urls) {
        const context = await browser.newContext({offline: url.startsWith('file:')});
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(url);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        assert.equal(await page.locator('.icon-cards article').count(), 3);
        await page.evaluate(() => {
            window.originalCards = window.gramlot.builder.source.getItem('main.page.cards');
            window.originalSibling = document.querySelector('.icon-cards article');
            window.removedCard = window.originalCards.getNode('drawing');
            window.recordCount = window.gramlot.renderer.records.size;
        });
        await page.getByRole('button', {name: 'Remove Drawing', exact: true}).click();
        assert.equal(await page.locator('.icon-cards article').count(), 2);
        assert.deepEqual(await page.evaluate(() => ({
            labels: window.originalCards.getNodes().map(node => node.label),
            sameSource: window.originalCards === window.gramlot.builder.source.getItem('main.page.cards'),
            sameSibling: window.originalSibling === document.querySelector('.icon-cards article'),
            removedRecord: !window.gramlot.renderer.records.has(window.removedCard),
            fewerRecords: window.gramlot.renderer.records.size < window.recordCount,
        })), {labels: ['structure', 'reading'], sameSource: true, sameSibling: true,
            removedRecord: true, fewerRecords: true});
        await page.getByRole('button', {name: 'Remove Structure', exact: true}).click();
        await page.getByRole('button', {name: 'Remove Reading', exact: true}).focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.icon-cards article').count(), 0);
        assert.equal(await page.evaluate(() => window.originalCards.getNodes().length), 0);
        await page.reload();
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        assert.equal(await page.locator('.icon-cards article').count(), 3);
        assert.deepEqual(errors, []);
        console.log(`PASS: ${url} — Source removal, DOM cleanup, sibling identity, keyboard and reload`);
        await context.close();
    }
} finally { await browser.close(); }
