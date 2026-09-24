import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {fromTytx, toTytx} from 'genro-tytx';
import {
    SourceBag,
    SourceBagNode,
    sourceBagToTytx,
} from 'genro-builders-js';
import {Bag, Gramlot, GramlotBuilder} from '../src/index.js';

function wire(author) { const builder = new GramlotBuilder(); author(builder.root); return builder.toTytx(); }
function appWith(transport) {
    const document = new JSDOM('<div id="gramlot-root"></div>').window.document;
    return new Gramlot({document, pageId: 'test', transport});
}
test('registered SourceBag root and branches survive JSON and MessagePack and bind in place', () => {
    for (const transport of ['json', 'msgpack']) {
        const authored = new GramlotBuilder();
        authored.root.section().span('native');
        const runtime = new GramlotBuilder();
        const payload = sourceBagToTytx(authored.source, {transport});
        const restored = fromTytx(payload, transport === 'json' ? null : transport);
        const section = restored.getNodes()[0];
        const branch = section.value;
        const leaf = branch.getNodes()[0];

        assert.ok(restored instanceof SourceBag, `${transport} root`);
        assert.ok(branch instanceof SourceBag, `${transport} branch`);
        assert.ok(section instanceof SourceBagNode, `${transport} parent node`);
        assert.ok(leaf instanceof SourceBagNode, `${transport} leaf node`);
        assert.equal(section.nodeTag, 'section');
        assert.equal(leaf.nodeTag, 'span');
        assert.equal(leaf.value, 'native');
        assert.equal(restored.bindBuilder(runtime), restored);
        assert.equal(restored.getNodes()[0], section);
        assert.equal(section.value, branch);
        assert.equal(branch.getNodes()[0], leaf);
        assert.equal(section.builder, runtime);
        assert.equal(leaf.builder, runtime);
    }
});

test('recipes are outside the active grammar', () => {
    assert.equal(new GramlotBuilder().root.recipe, undefined);
});

test('main inserts the complete native tree with one observed event', async () => {
    const app = appWith({main: async () => wire(root => root.div('homer').span('bart'))});
    const observed = [];
    app.source.subscribe('test', {any: event => observed.push(event.evt)});
    await app.start();
    assert.deepEqual(observed, ['ins']);
    assert.equal(app.renderer.destination.textContent, 'homerbart');
    assert.ok(app.builder instanceof GramlotBuilder);
    app.dispose();
});

test('failed Source decoding never poisons the initial Source', async () => {
    let value = toTytx(new Bag());
    const app = appWith({main: async () => value});
    let count = 0;
    app.source.subscribe('test', {any: () => count++});
    await assert.rejects(app.start(), /SourceBag/);
    assert.equal(count, 0);
    assert.equal(app.source.getNodes().length, 0);
    assert.equal(app.renderer.records.size, 0);
    value = wire(root => root.div('retry'));
    await app.start();
    assert.equal(app.renderer.destination.textContent, 'retry');
    app.dispose();
});

test('remote blocks replace children; failure preserves mounted identities', async () => {
    let response = wire(root => root.div('remote').span('bart'));
    const app = appWith({main: async () => wire(root => root.section(null, {id: 'slot'}).span('old')),
        source: async () => response});
    await app.start();
    const target = app.source.getItem('main').getNodes()[0];
    let events = 0;
    app.source.subscribe('remote-test', {any: () => events++});
    await app.remoteSource(target, 'details', {});
    assert.equal(events, 1);
    assert.equal(app.renderer.destination.textContent, 'remotebart');
    const mounted = app.renderer.destination.querySelector('#slot');
    const oldValue = target.value;
    response = toTytx(new Bag());
    await assert.rejects(app.remoteSource(target, 'details'), /SourceBag/);
    assert.equal(target.value, oldValue);
    assert.equal(app.renderer.destination.querySelector('#slot'), mounted);
    assert.equal(events, 1);
    assert.equal(app.renderer.records.get(target).cleanup.length, 0);
    app.dispose();
});

test('latest remote request wins and disposal blocks late completion', async () => {
    const responses = [];
    const app = appWith({main: async () => wire(root => root.div('old')),
        source: () => new Promise(resolve => responses.push(resolve))});
    await app.start();
    const target = app.source.getItem('main').getNodes()[0];
    const a = app.remoteSource(target, 'details');
    const b = app.remoteSource(target, 'details');
    responses[1](wire(root => root.span('new')));
    await b;
    responses[0](wire(root => root.span('stale')));
    assert.equal(await a, false);
    assert.equal(app.renderer.destination.textContent, 'new');
    const pending = app.remoteSource(target, 'details');
    app.dispose();
    responses[2](wire(root => root.span('too late')));
    assert.equal(await pending, false);
    assert.equal(app.renderer.records.size, 0);
});

test('removing remote owner prevents late insertion', async () => {
    let resolve;
    const app = appWith({main: async () => wire(root => root.div('old')),
        source: () => new Promise(done => { resolve = done; })});
    await app.start();
    const target = app.source.getItem('main').getNodes()[0];
    const pending = app.remoteSource(target, 'details');
    app.source.getItem('main').popNode(target.label);
    resolve(wire(root => root.span('gone')));
    assert.equal(await pending, false);
    assert.equal(app.renderer.destination.textContent, '');
    app.dispose();
});


test('pipeline requires the registered SourceBag contract, without ordinary Bag coercion', async () => {
    const app = appWith({main: async () => toTytx(new Bag())});
    await assert.rejects(app.start(), /SourceBag/);
    assert.equal(app.source.getNodes().length, 0);
    app.dispose();
});

test('typed transport retains native source tags, scalar values and builder ownership', async () => {
    const app = appWith({main: async () => wire(root => root.section().span('native'))});
    await app.start();
    const body = app.source.getItem('main');
    const section = body.getNodes()[0];
    const leaf = section.value.getNodes()[0];
    assert.ok(body instanceof SourceBag);
    assert.ok(section.value instanceof SourceBag);
    assert.ok(leaf instanceof SourceBagNode);
    assert.equal(leaf.nodeTag, 'span');
    assert.equal(leaf.value, 'native');
    assert.equal(leaf.attr.tag, undefined);
    assert.equal(leaf.attr._text, undefined);
    assert.equal(leaf.builder, app.builder);
    leaf.setValue('changed');
    assert.equal(app.renderer.destination.textContent, 'changed');
    app.dispose();
});
