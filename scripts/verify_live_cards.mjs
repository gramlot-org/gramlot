/** Verify Source-driven card removal on the fixture page 10_cards_with_icons, through the Python and the
 * JavaScript FileHost of the core: node scripts/verify_live_cards.mjs PLAYWRIGHT_ENTRY [CHROMIUM]. */
import assert from 'node:assert/strict';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {startHosts} from './fixture_hosts.mjs';
const [playwright, executablePath] = process.argv.slice(2);
const {chromium} = await import(pathToFileURL(playwright));
const hosts = await startHosts(fileURLToPath(new URL('../js/tests/fixtures/live/', import.meta.url)));
const browser = await chromium.launch({headless: true, executablePath});
try {
    for (const [language, host] of hosts) {
        const url = `${host.url}/10_cards_with_icons`;
        const context = await browser.newContext();
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(url);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        assert.equal(await page.locator('.icon-cards article').count(), 3);
        await page.evaluate(() => {
            window.originalCards = window.gramlot.src.builder.source.getItem('main.page.cards');
            window.originalSibling = document.querySelector('.icon-cards article');
            window.removedCard = window.originalCards.getNode('drawing');
            window.recordCount = window.gramlot.src.renderer.records.size;
        });
        await page.getByRole('button', {name: 'Remove Drawing', exact: true}).click();
        assert.equal(await page.locator('.icon-cards article').count(), 2);
        assert.deepEqual(await page.evaluate(() => ({
            labels: window.originalCards.getNodes().map(node => node.label),
            sameSource: window.originalCards === window.gramlot.src.builder.source.getItem('main.page.cards'),
            sameSibling: window.originalSibling === document.querySelector('.icon-cards article'),
            removedRecord: !window.gramlot.src.renderer.records.has(window.removedCard),
            fewerRecords: window.gramlot.src.renderer.records.size < window.recordCount,
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
        console.log(`PASS ${language}: ${url} — Source removal, DOM cleanup, sibling identity, keyboard and reload`);
        await context.close();
    }
} finally {
    await browser.close();
    for (const [, host] of hosts) host.close();
}
