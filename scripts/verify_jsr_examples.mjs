/** Exercise every shipped example through the JSR import map before publishing.
 * Run: deno run --config jsr.json --allow-read scripts/verify_jsr_examples.mjs
 * Node-only example checks cannot detect publisher import-map resolution errors.
 */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Host} from '../js/src/adapters/host.js';
import {Page as BasePage} from '../js/src/adapters/page.js';
import {SourceBag} from '@jsr/genro__builders';
import {fromTytx} from '@jsr/genro__tytx';

const catalog = JSON.parse(await readFile(new URL('../examples/00-runner/catalog.json', import.meta.url), 'utf8'));
for (const {folder} of catalog) {
    const {Page} = await import(new URL(`../examples/html_svg/${folder}/page.js`, import.meta.url).href);
    assert.ok(Page.prototype instanceof BasePage, `${folder}: use this package's Page class`);
    class ExampleHost extends Host {
        async resolvePage() { return Page; }
    }
    const host = new ExampleHost();
    const {pageId} = await host.registerPage('/');
    try {
        const source = fromTytx(await host.main(pageId));
        assert.ok(source instanceof SourceBag, `${folder}: typed Source`);
        assert.ok(source.getNodes().length > 0, `${folder}: nonempty Source`);
    } finally {
        host.closePage(pageId);
    }
    assert.equal(host.pages.size, 0);
}
console.log(`PASS: ${catalog.length} JSR example imports, shared Page identity, typed Source and cleanup.`);
