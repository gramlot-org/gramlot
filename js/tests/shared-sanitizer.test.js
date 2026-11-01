import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import originalFactory from 'dompurify';
import {createDOMPurify} from '../src/index.js';
import {runtimeOptions} from '../scripts/runtime-options.mjs';

test('shared factory keeps component configuration, hooks and document ownership isolated', t => {
    const first = new JSDOM(''), second = new JSDOM('');
    t.after(() => {first.window.close(); second.window.close();});
    assert.equal(createDOMPurify, originalFactory);
    const editor = createDOMPurify(first.window);
    const tree = createDOMPurify(first.window);
    const otherFrame = createDOMPurify(second.window);
    editor.setConfig({FORBID_TAGS:['b']});
    editor.addHook('uponSanitizeAttribute', (node, event) => {
        if (event.attrName === 'title') event.keepAttr = false;
    });
    const value = '<b title="kept">Text</b><img src="x" onerror="bad()"><script>bad()</script>';
    assert.equal(editor.sanitize(value), 'Text<img src="x">');
    assert.equal(tree.sanitize(value), '<b title="kept">Text</b><img src="x">');
    const fragment = otherFrame.sanitize(value, {RETURN_DOM_FRAGMENT:true});
    assert.ok(fragment instanceof second.window.DocumentFragment);
    assert.equal(fragment instanceof first.window.DocumentFragment, false);
    assert.equal(fragment.querySelector('b').title, 'kept');
    assert.equal(fragment.querySelector('script,[onerror]'), null);
    tree.addHook('uponSanitizeAttribute', (node, event) => {
        if (event.attrName === 'title') event.attrValue = 'tree';
    });
    editor.removeAllHooks(); editor.clearConfig();
    assert.match(tree.sanitize(value), /title="tree"/);
    assert.match(editor.sanitize(value), /title="kept"/);
    assert.match(otherFrame.sanitize(value), /title="kept"/);
});

test('runtime owns DOMPurify and component build graphs reuse its export', async () => {
    const runtime = await build({...runtimeOptions['gramlot.min.js'], write:false, metafile:true, logLevel:'silent'});
    const purifierInputs = meta => Object.keys(meta.inputs).filter(name => name.includes('/dompurify/'));
    assert.equal(purifierInputs(runtime.metafile).length, 1);
    for (const name of ['inputs','layout','tree','editors','grouplets']) {
        const result = await build({entryPoints:[new URL(`../src/components/${name}.js`, import.meta.url).pathname],
            bundle:true, write:false, metafile:true, format:'esm', platform:'browser', loader:{'.css':'text'},
            external:['@gramlot/gramlot'], logLevel:'silent'});
        assert.deepEqual(purifierInputs(result.metafile), [], name);
        assert.match(result.outputFiles[0].text, /createDOMPurify/);
    }
});

test('prepared collection chunks contain no private DOMPurify implementation', async () => {
    async function inspect(directory) {
        for (const entry of await readdir(directory,{withFileTypes:true})) {
            const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
            if (entry.isDirectory()) await inspect(url);
            else if (entry.name.endsWith('.js')) assert.doesNotMatch(await readFile(url,'utf8'), /DOMPurify \d+\./, url.pathname);
        }
    }
    for (const name of ['inputs','layout','tree','editors','grouplets'])
        await inspect(new URL(`../dist/components/${name}/assets/`,import.meta.url));
    assert.match(await readFile(new URL('../dist/gramlot.min.js',import.meta.url),'utf8'), /DOMPurify \d+\./);
});
