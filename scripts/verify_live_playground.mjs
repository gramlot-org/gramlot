/** Hosted live Source example: mutations, animation and timer ownership. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const [playwright, executablePath, base] = process.argv.slice(2);
const {chromium} = await import(pathToFileURL(playwright));
const browser = await chromium.launch({headless: true, executablePath});
try {
    for (const language of (base.startsWith('file:') ? ['offline'] : ['py', 'js'])) {
        const page = await browser.newPage({offline: language === 'offline'});
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.addInitScript(() => {
            const start = window.setInterval.bind(window), stop = window.clearInterval.bind(window);
            window.activeTimers = new Set();
            window.setInterval = (...args) => { const id = start(...args); window.activeTimers.add(id); return id; };
            window.clearInterval = id => { window.activeTimers.delete(id); stop(id); };
        });
        await page.goto(language === 'offline' ? `${base}/e13/index.html` : `${base}/${language}/e13`);
        await page.waitForFunction(() => window.gramlot?.state === 'started');
        const list = page.locator('.live-items li');
        assert.equal(await list.count(), 2);
        await page.getByRole('button', {name: 'Add item', exact: true}).click();
        assert.equal(await list.count(), 3);
        assert.equal(await page.evaluate(() => window.gramlot.source.getItem('main.page.work.items').getNodes().length), 3);
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
        assert.equal(await page.evaluate(() => String(window.gramlot.source.getNode('main.page.motion.scene.ball').getAttr('cx')) === document.querySelector('circle').getAttribute('cx')), true);
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
} finally { await browser.close(); }
