/** Live Source on the fixture page 13_live_source, through the Python and the JavaScript GramlotFileServer of the
 * core: mutations, animation and timer ownership. node scripts/verify_live_playground.mjs PLAYWRIGHT_ENTRY [CHROMIUM]. */
import assert from 'node:assert/strict';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {startServers} from './fixture_servers.mjs';
const [playwright, executablePath] = process.argv.slice(2);
const {chromium} = await import(pathToFileURL(playwright));
const servers = await startServers(fileURLToPath(new URL('../js/tests/fixtures/live/', import.meta.url)));
const browser = await chromium.launch({headless: true, executablePath});
try {
    for (const [language, server] of servers) {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.addInitScript(() => {
            const start = window.setInterval.bind(window), stop = window.clearInterval.bind(window);
            window.activeTimers = new Set();
            window.setInterval = (...args) => { const id = start(...args); window.activeTimers.add(id); return id; };
            window.clearInterval = id => { window.activeTimers.delete(id); stop(id); };
        });
        await page.goto(`${server.url}/13_live_source`);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        const list = page.locator('.live-items li');
        assert.equal(await list.count(), 2);
        await page.getByRole('button', {name: 'Add item', exact: true}).click();
        assert.equal(await list.count(), 3);
        assert.equal(await page.evaluate(() => window.gramlot.src.source.getItem('main.page.work.items').getNodes().length), 3);
        await page.getByRole('button', {name: 'Remove last', exact: true}).click();
        assert.equal(await list.count(), 2);
        await page.getByRole('button', {name: 'Clear list', exact: true}).click();
        await page.getByRole('button', {name: 'Remove last', exact: true}).click();
        assert.equal(await list.count(), 0);
        await page.getByRole('button', {name: 'Add item', exact: true}).click();
        assert.equal(await list.count(), 1);
        await page.getByRole('button', {name: 'Change heading', exact: true}).click();
        assert.equal(await page.locator('h1').innerText(), 'Source is alive!');
        const initial = await page.locator('circle').getAttribute('cx');
        await page.waitForFunction(value => document.querySelector('circle').getAttribute('cx') !== value, initial);
        assert.equal(await page.evaluate(() => String(window.gramlot.src.source.getNode('main.page.motion.scene.ball').getAttr('cx')) === document.querySelector('circle').getAttribute('cx')), true);
        await page.getByRole('button', {name: 'Change ball color', exact: true}).click();
        assert.equal(await page.locator('circle').getAttribute('fill'), 'var(--gramlot-warning)');
        assert.equal(await page.evaluate(() => window.activeTimers.size), 1);
        await page.getByRole('button', {name: 'Remove animation', exact: true}).click();
        assert.equal(await page.locator('svg').count(), 0);
        assert.equal(await page.evaluate(() => window.activeTimers.size), 0);
        await page.reload();
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        assert.equal(await page.evaluate(() => window.activeTimers.size), 1);
        await page.evaluate(() => window.gramlot.dispose());
        assert.equal(await page.evaluate(() => window.activeTimers.size), 0);
        assert.deepEqual(errors, []);
        console.log(`PASS ${language}: insert/delete/clear/text/SVG, animation and section/page timer cleanup`);
        await page.close();
    }
} finally {
    await browser.close();
    for (const [, server] of servers) server.close();
}
