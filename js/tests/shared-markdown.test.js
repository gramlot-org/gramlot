import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, loadMarkdown} from '../src/index.js';
import editors from '../src/components/editors.js';
import {runtimeOptions} from '../scripts/runtime-options.mjs';

// Code is shared; each consumer owns its parser configuration and mutable rules.
test('concurrent Markdown loads share the module, not parser policies', async () => {
    const [first, second] = await Promise.all([loadMarkdown(), loadMarkdown()]);
    assert.equal(first, second);
    const literal = new first.default({html:false});
    const html = new second.default({html:true});
    html.disable('heading');
    assert.match(literal.render('<b>text</b>'), /&lt;b&gt;/);
    assert.match(html.render('<b>text</b>'), /<b>/);
    assert.match(literal.render('# Heading'), /<h1>/);
    assert.doesNotMatch(html.render('# Heading'), /<h1>/);
});

test('the shipped runtime has only a lazy Markdown import; collections contain no parser copy', async () => {
    const built = await build({...runtimeOptions['gramlot.min.js'], write:false, metafile:true});
    assert.deepEqual(Object.keys(built.metafile.inputs).filter(name => /\/(markdown-it|entities|linkify-it)\//.test(name)), []);
    assert.match(built.outputFiles[0].text, /import\("@gramlot\/gramlot\/markdown"\)/);
    for (const name of ['editors','grouplets']) {
        const assets = new URL(`../dist/components/${name}/assets/`, import.meta.url);
        const text = (await Promise.all((await readdir(assets,{recursive:true})).filter(n=>n.endsWith('.js')).map(n=>readFile(new URL(n,assets),'utf8')))).join('\n');
        assert.ok(text.includes('@gramlot/gramlot/markdown'), name);
        assert.ok(!text.includes('Wrong `markdown-it` preset'), `${name} contains no parser implementation`);
    }
    const library = await readFile(new URL('../dist/gramlot-markdown.js', import.meta.url));
    assert.ok(library.length > 100000);
    assert.deepEqual(library, await readFile(new URL('../../src/gramlot/resources/gramlot-markdown.js', import.meta.url)));
    const notices=JSON.parse(await readFile(new URL('../dist/runtime-notices.json',import.meta.url),'utf8'));
    for (const name of ['markdown-it','entities','linkify-it','mdurl','punycode.js','uc.micro']) {
        const notice=notices.find(item=>item.name===name);
        assert.ok(notice?.text.includes('Copyright'), `${name} ships its license`);
    }
});

test('lazy preview uses latest Data and reconnects the same DOM without stale writes', async t => {
    const dom=new JSDOM('<main id="gramlot-root"></main>');
    const app=new Gramlot({document:dom.window.document, transport:false, collections:[editors]});
    t.after(()=>{app.dispose();dom.window.close();});
    const builder=new GramlotBuilder(null,{collections:[editors]});
    builder.root.markdownPreview({id:'preview', value:'^text'});
    app.data.setItem('text','# First');app.src.startSource(builder.toTytx());
    const preview=dom.window.document.getElementById('preview'), frame=preview.frame;
    app.data.setItem('text','# Latest');
    preview.remove();
    await preview.ready;
    assert.equal(frame.srcdoc,'', 'detached preview receives no late rendering');
    dom.window.document.body.append(preview);
    assert.equal(preview.frame,frame);
    assert.match(frame.srcdoc,/<h1>Latest<\/h1>/);
    app.data.setItem('text','# Next');
    assert.equal(preview.frame,frame);assert.match(frame.srcdoc,/<h1>Next<\/h1>/);
});
