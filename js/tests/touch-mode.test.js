import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {GramlotServer, Page} from '../src/server/index.js';

test('touch mode changes presentation without replacing Source, Data or DOM', () => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false, devices: ['desktop', 'phone']});
    const builder = new GramlotBuilder();
    builder.root.input({id: 'draft', value: '^name'});
    app.src.startSource(builder.source);
    app.data.setItem('name', 'Ada');
    const input = window.document.getElementById('draft'), data = app.data, source = app.src.source;
    input.value = 'Uncommitted draft';
    for (const mode of ['on', 'off', 'auto']) {
        app.dom.setTouchMode(mode);
        assert.equal(window.document.documentElement.getAttribute('data-gramlot-touch'), mode === 'auto' ? null : mode);
        assert.equal(window.document.getElementById('draft'), input);
        assert.equal(input.value, 'Uncommitted draft');
        assert.equal(app.data, data); assert.equal(app.src.source, source);
        assert.equal(app.data.getItem('name'), 'Ada');
    }
    assert.deepEqual(app.devices, ['desktop', 'phone']); assert(Object.isFrozen(app.devices));
    assert.throws(() => app.dom.setTouchMode('mobile'), /Invalid touch mode/);
    app.dispose(); window.close();
});

test('page device declarations reach HTTP and Worker registration; default is undeclared', async () => {
    class MobilePage extends Page { static devices = ['desktop', 'tablet', 'phone']; }
    class Server extends GramlotServer {
        resolvePage() { return MobilePage; }
        resolveResources() { return {css: [], js: []}; }
    }
    const server = new Server();
    assert.deepEqual((await server.registerPage('/')).devices, MobilePage.devices);
    const result = await server.openPage('/');
    assert.match(result.html, /"devices":\["desktop","tablet","phone"\]/);
    assert.deepEqual(Page.devices, []);
});
