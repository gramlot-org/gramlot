/** `Gramlot` keeps lifecycle, Data and the four proxies; every themed member lives in its handler. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, Handler, SourceHandler, RpcHandler, DomHandler, UtilitiesHandler, GramlotBuilder,
    GramlotRenderer, InOut} from '../src/index.js';

function page() {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    return new Gramlot({document: window.document, transport: false});
}

test('a Gramlot instance has only lifecycle, Data and the four proxies as own members', () => {
    const app = page();
    assert.deepEqual(Object.keys(app).sort(),
        ['abort', 'data', 'dom', 'logic', 'pageId', 'rpc', 'src', 'state', 'utl']);
});

test('each proxy is an instance of its handler and of Handler, pointing back to the page', () => {
    const app = page();
    for (const [name, handlerClass] of [['src', SourceHandler], ['rpc', RpcHandler], ['dom', DomHandler],
        ['utl', UtilitiesHandler]]) {
        assert.ok(app[name] instanceof handlerClass, name);
        assert.ok(app[name] instanceof Handler, name);
        assert.equal(app[name].gramlot, app, name);
    }
});

test('every moved member is reachable at its new path', () => {
    const app = page();
    assert.ok(app.src.builder instanceof GramlotBuilder);
    assert.equal(app.src.source, app.src.builder.source);
    assert.ok(app.src.renderer instanceof GramlotRenderer);
    assert.equal(app.src.binding.gramlot, app);
    assert.equal(app.src.logicRegistry.gramlot, app);
    assert.equal(app.data, app.src.builder.data);
    for (const name of ['startSource', 'mountMainSource', 'prepareSource', 'remoteSource']) {
        assert.equal(typeof app.src[name], 'function', name);
    }
    assert.equal(app.rpc.transport, null);
    assert.ok(app.rpc.remoteRequests instanceof Map);
    for (const name of ['getDomNode', 'getBaseSourceNode', 'reference']) assert.equal(typeof app.dom[name], 'function', name);
    assert.ok(app.utl.inout instanceof InOut);
    assert.equal(app.utl.inout.gramlot, app);
});
