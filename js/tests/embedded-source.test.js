import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';

test('embedded typed Source uses prepared roots and a single insert without a server', async () => {
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    const authored = new GramlotBuilder();
    authored.root.h1('Hello World');
    const app = new Gramlot({document, transport: false});
    assert.equal(app.source, app.builder.source);
    assert.equal(app.builder._sourceroot.getNodes()[0].value, app.source);
    assert.equal(app.builder.data, app.data);
    const events = [];
    app.source.subscribe('offline-test', {any: event => events.push(event.evt)});
    assert.equal(app.startSource(authored.toTytx()), app);
    assert.deepEqual(events, ['ins']);
    assert.equal(app.state, 'started');
    assert.equal(document.querySelector('h1').textContent, 'Hello World');
    assert.throws(() => app.startSource(authored.toTytx()), /started/);
    await assert.rejects(app.start(), /no server transport/);
    await assert.rejects(app.remoteSource(null, 'details'), /unavailable/);
    app.dispose();
    assert.equal(document.querySelector('h1'), null);
    assert.throws(() => app.startSource(authored.toTytx()), /disposed/);
});
