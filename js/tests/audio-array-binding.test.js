import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';
import {BagCollectionStore} from '../src/stores/bag-collection-store.js';

test('audio snapshots occupy one Data node and replacement triggers existing bindings', () => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document:window.document, transport:false});
    const builder = new GramlotBuilder();
    builder.root.dataController({samples:'^samples',
        script:'this.SET("count", samples.length); this.SET("first", samples[0]);'});
    builder.root.p('^first', {id:'sample'});
    try {
        app.src.startSource(builder.toTytx());
        const element = window.document.getElementById('sample');
        let node;
        for (let frame = 0; frame < 20; frame++) {
            const samples = Array.from({length:1024}, (_, i) => frame + i / 1024);
            app.data.setItem('samples', samples);
            node ??= app.data.getNode('samples');
            assert.equal(app.data.getNode('samples'), node);
            assert.equal(app.data.getItem('samples'), samples);
            assert.equal(app.data.getItem('count'), 1024);
            assert.equal(app.data.getItem('first'), frame);
            assert.equal(element.textContent, String(frame));
            assert.equal(window.document.getElementById('sample'), element);
        }
        assert.equal(app.data.getNodes().filter(n => n.label === 'samples').length, 1);
        assert.ok(Array.isArray(node.staticValue));
        assert.equal(node.staticValue instanceof Bag, false);
    } finally { app.dispose(); window.close(); }
});

test('current chart collection contract does not consume raw snapshot arrays', () => {
    assert.throws(() => new BagCollectionStore([0, 0.5, 1], 'values'), /requires a Bag/);
});
