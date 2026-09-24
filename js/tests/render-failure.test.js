import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {HtmlElement} from '../src/view/html.js';

function wire(author) { const builder = new GramlotBuilder(); author(builder.root); return builder.toTytx(); }

test('application disposal releases transport even when renderer cleanup fails', async () => {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    let disposed = 0;
    const app = new Gramlot({document, transport: {
        main: async () => wire(root => root.p('hello')),
        dispose: () => disposed++,
    }});
    await app.start();
    const node = app.source.getItem('main').getNodes()[0];
    app.renderer.onDispose(node, () => { throw new Error('cleanup failure'); });
    assert.throws(() => app.dispose(), /Renderer cleanup failed/);
    assert.equal(disposed, 1);
    assert.equal(app.renderer.records.size, 0);
    assert.equal(document.querySelector('main').childNodes.length, 0);
    app.dispose();
    assert.equal(disposed, 1);
});
class RejectBadText extends HtmlElement {
    create(node, ...args) {
        if (node.value === 'bad') throw Error('injected create failure');
        return super.create(node, ...args);
    }
}

test('DOM errors propagate after Source insertion, without speculative rendering or rollback', async () => {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    const app = new Gramlot({document, transport: {main: async () => wire(root => root.p('bad'))}});
    app.renderer.html = new RejectBadText();
    await assert.rejects(app.start(), /injected create failure/);
    assert.equal(app.source.getItem('main').getNodes()[0].value, 'bad');
    app.dispose();
    assert.equal(app.renderer.records.size, 0);
    assert.equal(document.querySelector('main').childNodes.length, 0);
});

test('remote DOM failure does not roll back the Source or resurrect removed records', async () => {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    const app = new Gramlot({document, transport: {
        main: async () => wire(root => root.section().span('old')),
        source: async () => wire(root => root.span('bad')),
    }});
    app.renderer.html = new RejectBadText();
    await app.start();
    const target = app.source.getItem('main').getNodes()[0];
    let cleaned = 0;
    app.renderer.onDispose(target, () => cleaned++);
    await assert.rejects(app.remoteSource(target, 'details'), /injected create failure/);
    assert.equal(target.value.getNodes()[0].value, 'bad');
    assert.equal(cleaned, 1);
    assert.equal(document.querySelector('section'), null);
    app.dispose();
    assert.equal(app.renderer.records.size, 0);
});

test('replacement completes after cleanup failure and still surfaces the error', async () => {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    const initial = wire(root => root.section(null, {id: 'target'}).span('old'));
    const app = new Gramlot({document, transport: {main: async () => initial}});
    await app.start();

    const target = app.source.getItem('main').getNodes()[0];
    const oldElement = document.getElementById('target');
    let cleaned = 0;
    app.renderer.onDispose(target, () => {
        cleaned += 1;
        throw new Error('injected cleanup failure');
    });

    assert.throws(() => target.setValue('new'), /Source cleanup failed/);
    const newElement = document.getElementById('target');
    assert.equal(cleaned, 1);
    assert.equal(target.value, 'new');
    assert.notEqual(newElement, oldElement);
    assert.equal(newElement.textContent, 'new');
    assert.equal(app.renderer.records.get(target).element, newElement);
    app.dispose();
});
