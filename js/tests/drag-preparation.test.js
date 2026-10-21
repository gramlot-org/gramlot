import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';

test('ordinary Source elements share drag/drop Logic without a tree or native event attributes', async t => {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false});
    t.after(() => { app.dispose(); window.close(); });
    let received;
    let receivedDrop;
    class Logic {
        prepare(source, context) {
            received = {source, context};
            context.dragValues['app/record'] = {id: 42};
        }
        receive(source, context) { receivedDrop = {source, context}; }
    }
    app.src.logicRegistry.register(Logic, {group: null, resource: '/drag-test.js'});
    const b = new GramlotBuilder();
    b.root.div('A record', {node_label: 'record', id: 'record', draggable: true, onDrag: 'prepare', onDrop: 'receive'});
    app.src.startSource(b.toTytx());
    const source = app.src.source.getNode('main.record');
    const result = app.src.renderer.prepareDrag(source, {composedPath: () => []});
    assert.equal(received.source, source);
    assert.equal(received.context.item, undefined);
    assert.equal(received.context.path, undefined);
    assert.deepEqual(result.dragValues, {'app/record': {id: 42}});
    assert.equal(window.document.getElementById('record').hasAttribute('onDrag'), false);
    const context = {dropValues: result.dragValues, item: undefined, path: undefined,
        source: Object.freeze({}), selfdrop: true, dropEffect: 'move', dataAvailable: true};
    await app.src.renderer.invokeDrop(source, context);
    assert.equal(receivedDrop.source, source);
    assert.deepEqual(receivedDrop.context, context);
    assert.equal(window.document.getElementById('record').hasAttribute('onDrop'), false);
    assert.doesNotMatch(b.render(), /ondrag|ondrop/i);
});
