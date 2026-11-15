// A component reaches data and structure by address: the source context gives the absolute
// path of an original attribute and reads at a path without resolvers; a `^` parameter of
// dtype 'X' is registered on the router as a subtree, so a change inside the Bag and a
// replacement of the Bag at the address reach the component through the same registration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, BagCbResolver} from '@genrojs/bag';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {Container} from '../src/components/container.js';
import {defineComponent, defineCollection} from '../src/components/registry.js';

const AddressProbe = defineComponent({
    name: 'addressProbe', tag: 'test-address-probe', base: Container, sourceContext: true,
    parameters: {options: {dtype: 'X', binding: 'read'},
        caption: {dtype: 'T', default: '', binding: 'read'},
        picked: {dtype: 'X', nullable: true, default: null, binding: 'write'}},
    implementation: Base => class extends Base {
        reads = [];
        setSourceContext(context) { this.context = context; }
        projectAttributes(attrs, adapt) {
            const rest = super.projectAttributes(attrs, adapt);
            const options = this.context.getStaticData(this.context.attrDatapath('options'));
            this.reads.push(options?.getItem('color') ?? null);
            return rest;
        }
    },
});
const probes = defineCollection({name: 'addressProbes', components: [AddressProbe]});

function fixture(t, author) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const collections = [probes];
    const app = new Gramlot({document: window.document, transport: false, collections});
    const b = new GramlotBuilder(null, {collections});
    author(b.root, app); app.src.startSource(b.toTytx());
    t.after(() => {app.dispose(); window.close();});
    const probe = window.document.getElementById('probe');
    return {app, probe, node: probe.context.sourceNode};
}

test('attrDatapath resolves the original attribute in the node context; getStaticData runs no resolver', t => {
    const {app, probe} = fixture(t, (root, app) => {
        app.data.setItem('form.options', new Bag({color: 'red'}));
        root.div({datapath: 'form'}).addressProbe({id: 'probe', options: '^.options', caption: '=.title',
            storepath: '.rows', picked: '^.picked', expression: '==1+1'});
    });
    const context = probe.context;
    assert.equal(context.attrDatapath('options'), 'form.options');
    assert.equal(context.attrDatapath('caption'), 'form.title');
    assert.equal(context.attrDatapath('storepath'), 'form.rows');
    assert.equal(context.attrDatapath('missing'), null);
    assert.throws(() => context.attrDatapath('expression'), /'expression' is not a Data path/);

    assert.equal(context.getStaticData('form.options'), app.data.getItem('form.options'));
    assert.equal(context.getStaticData('form.nothing'), null);
    assert.equal(context.getStaticData(null), null);
    assert.throws(() => context.getStaticData(''), /requires a path/);
    let calls = 0;
    app.data.setItem('form.lazy', new BagCbResolver(() => { calls += 1; return 'loaded'; }));
    assert.equal(context.getStaticData('form.lazy'), null);
    assert.equal(calls, 0);
    assert.equal(app.data.getItem('form.lazy'), 'loaded');
    assert.equal(calls, 1);
});

test('a dtype X pointer is a subtree registration: inner change, inner attribute and replacement are the same event', t => {
    const {app, probe, node} = fixture(t, (root, app) => {
        app.data.setItem('form.options', new Bag({color: 'red'}));
        root.div({datapath: 'form'}).addressProbe({id: 'probe', options: '^.options', caption: '^.title', picked: '^.picked'});
    });
    const renderer = app.src.binding.renderer;
    const project = renderer.project.bind(renderer);
    const changes = [];
    renderer.project = (projected, change) => {
        if (projected === node) changes.push(change);
        return project(projected, change);
    };
    t.after(() => { renderer.project = project; });
    assert.deepEqual(probe.reads, ['red']);

    app.data.setItem('form.options.color', 'blue');
    app.data.getNode('form.options.color').setAttr({tone: 'dark'});
    app.data.setItem('form.options', new Bag({color: 'green'}));
    assert.deepEqual(changes.map(change => [change.evt, change.path, change.level]), [
        ['upd_value', 'form.options.color', 'child'],
        ['upd_attrs', 'form.options.color', 'child'],
        ['upd_value', 'form.options', 'node']]);
    const [registration] = new Set(changes.map(change => change.registration));
    assert.equal(changes.every(change => change.registration === registration), true);
    assert.equal(registration.path, 'form.options');
    assert.equal(registration.subtree, true);
    assert.deepEqual(probe.reads, ['red', 'blue', 'blue', 'green']);

    // A dtype T pointer and a write-only dtype X pointer keep the value registration.
    changes.length = 0;
    app.data.setItem('form.title', new Bag({text: 'a'}));
    app.data.getNode('form.title.text').setAttr({tone: 'dark'});
    app.data.setItem('form.picked', new Bag({row: 1}));
    app.data.getNode('form.picked.row').setAttr({tone: 'dark'});
    assert.deepEqual(changes.map(change => [change.evt, change.path, change.registration.subtree]), [
        ['ins', 'form.title', false],
        ['ins', 'form.picked', false]]);
});
