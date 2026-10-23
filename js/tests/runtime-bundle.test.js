// Phase S16, C07: the served runtime bundles are the build of js/src at this revision. The hosts serve
// readable and minified variants in js/dist (npm) and src/gramlot/resources (Python); all four are
// gitignored, so nothing but this check tells a stale copy from a current one.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {runtimeOptions} from '../scripts/runtime-options.mjs';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';

const sha256 = text => createHash('sha256').update(text).digest('hex');

test('hosted input bundle accepts runtime Bags and respects Bag validation errors', async () => {
    const {default: inputs} = await import('../dist/components/inputs/assets/index.js');
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    window.HTMLElement.prototype.showPopover = function() {};
    window.HTMLElement.prototype.hidePopover = function() {};
    inputs.register(window);
    const collections = [inputs.toDocument()];
    const app = new Gramlot({document:window.document, transport:false, collections});
    const store = new Bag(); store.setItem('italy', 'IT', {caption:'Italy'});
    const response = new Bag(); response.setItem('errorcode', 'denied'); response.setItem('message', 'Denied');
    app.src.logicRegistry.register(class Logic { check() { return response; } }, {resource:'test:bundled-validation'});
    const builder = new GramlotBuilder(null, {collections});
    builder.root.comboBox({id:'choice', store:'^store'});
    builder.root.textbox({id:'field', value:'^value', validate_call:'check'});
    app.data.setItem('store', store); app.data.setItem('value', 'accepted');
    try {
        app.src.startSource(builder.toTytx());
        const choice = window.document.getElementById('choice');
        assert.deepEqual(choice.loadChoices({_querystring:'it'}), [{id:'IT',caption:'Italy'}]);
        const field = window.document.getElementById('field');
        field.control.value = 'rejected';
        field.control.dispatchEvent(new window.Event('input', {bubbles:true}));
        field.control.dispatchEvent(new window.Event('change', {bubbles:true}));
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.equal(app.data.getItem('value'), 'accepted');
        assert.equal(field.message.textContent, 'Denied');
        response.setItem('errorcode', null);
        field.control.dispatchEvent(new window.Event('change', {bubbles:true}));
        await new Promise(resolve => setTimeout(resolve, 0));
        assert.equal(app.data.getItem('value'), 'rejected');
    } finally { app.dispose(); window.close(); }
});

test('C07: every served runtime bundle is the build of js/src with the installed dependencies', async t => {
    // Importing the build configuration does not regenerate or repair the artifacts being checked.
    for (const [name, options] of Object.entries(runtimeOptions)) {
        const fresh = await build({...options, write: false, logLevel: 'silent'});
        const expected = sha256(fresh.outputFiles[0].contents);
        for (const folder of ['dist', '../src/gramlot/resources']) {
            const relative = `${folder}/${name}`;
            await t.test(relative, async () => {
                let served;
                try { served = await readFile(new URL(relative, new URL('../', import.meta.url))); }
                catch (error) { assert.fail(`${relative}: missing (${error.code}); run npm --prefix js run build`); }
                assert.equal(sha256(served), expected, `${relative} is stale: run npm --prefix js run build`);
            });
        }
    }
});
