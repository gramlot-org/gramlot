import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder, IndexPage, Bag, mountIndexPage} from '../src/index.js';
import layout from '../src/components/layout.js';
import tree from '../src/components/tree.js';

const settle = () => new Promise(resolve => setImmediate(resolve));
function fixture(t, {onLoad = () => {}, prepareEntry = () => {}, onSelection = () => {}} = {}) {
    const {window} = new JSDOM('<main id="gramlot-root"></main>', {url:'https://index.test/'});
    window.ResizeObserver = class {observe(){}unobserve(){}disconnect(){}};
    const navigation = new Bag();
    for (const name of ['one', 'two']) navigation.setItem(name, null, {url:`/${name}`, title:name});
    class Page extends IndexPage {static navigation = navigation; behavior(){}}
    const builder = new GramlotBuilder(null, {collections:[layout, tree]});
    new Page().main(builder.root);
    const app = new Gramlot({document:window.document, transport:false, collections:[layout, tree]});
    app.src.startSource(builder.source);
    t.after(()=>{app.dispose();window.close();});
    const renderer = app.src.renderer;
    const root = renderer.elements.get(window.document.getElementById('index')).node;
    const state = root.getRelativeData('.');
    const events = [], requests = [], errors = [];
    renderer.binding.reportError = (error, title) => errors.push({error, title});
    const context = mountIndexPage(renderer, root, onSelection, prepareEntry, {
        onLoad(url, status, error) {events.push([url, status, error]);onLoad(root, url, status);},
        createEntry(entry) {return new Promise((resolve, reject)=>requests.push({entry, resolve, reject}));},
    });
    return {root, state, context, requests, errors, events,
        select(name){state.setItem('navigationSelection', name);},
        close(url){const pane=context.entries.get(url).pane;pane.parentBag.popNode(pane.label);},
        outcomes(){return events.map(([url, status])=>[url,status]);}};
}

test('each load completes even in the background, without changing selection', async t => {
    const f = fixture(t);
    f.select('one');f.select('two');
    f.requests[0].resolve();await settle();
    assert.equal(f.state.getItem('active'), '/two');
    assert.deepEqual(f.outcomes(), [['/one','loading'],['/two','loading'],['/one','ready']]);
    f.state.setItem('active', '/one');
    const failure = Error('Background load failed');
    f.requests[1].reject(failure);await settle();
    assert.equal(f.state.getItem('active'), '/one');
    assert.deepEqual(f.outcomes().at(-1), ['/two','error']);
    assert.equal(f.events.at(-1)[2], failure);
    assert.equal(f.errors.length, 1);
    f.close('/one');
    assert.equal(f.events.length, 4, 'closing an already finished panel adds no cancellation');
});

test('closing and reopening a pending URL cancels only the old attempt', async t => {
    const f = fixture(t);
    f.select('one');f.select('two');f.close('/one');
    assert.equal(f.state.getItem('active'), '/two');
    f.select('one');
    const replacement = f.context.entries.get('/one');
    f.requests[0].reject(Error('Late failure'));await settle();
    assert.equal(f.context.entries.get('/one'), replacement);
    assert.equal(replacement.loading, true);
    assert.deepEqual(f.errors, []);
    f.requests[1].resolve();await settle();
    assert.equal(f.state.getItem('active'), '/one');
    f.requests[2].resolve();await settle();
    assert.deepEqual(f.outcomes(), [
        ['/one','loading'],['/two','loading'],['/one','cancelled'],['/one','loading'],
        ['/two','ready'],['/one','ready'],
    ]);
});

test('removing an index settles all pending loads once and ignores late replies', async t => {
    const f = fixture(t);
    f.select('one');f.select('two');
    f.root.parentBag.popNode(f.root.label);
    assert.deepEqual(f.outcomes(), [
        ['/one','loading'],['/two','loading'],['/one','cancelled'],['/two','cancelled'],
    ]);
    f.context.dispose();
    f.requests[0].resolve();f.requests[1].reject(Error('Gone'));await settle();
    assert.equal(f.events.length, 4);
    assert.equal(f.context.entries.size, 0);
    assert.deepEqual(f.errors, []);
});

test('closing from the loading callback does not start a cancelled request', t => {
    const f = fixture(t, {onLoad(root, url, status){
        if (status === 'loading') {
            const pane = root.indexContext.entries.get(url).pane;
            pane.parentBag.popNode(pane.label);
        }
    }});
    f.select('one');
    assert.deepEqual(f.outcomes(), [['/one','loading'],['/one','cancelled']]);
    assert.equal(f.requests.length, 0);
    assert.equal(f.context.entries.size, 0);
});

test('panel preparation failure ends in error, never ready', async t => {
    const f = fixture(t, {prepareEntry(){throw Error('Preparation failed');}});
    f.select('one');f.requests[0].resolve();await settle();
    assert.deepEqual(f.outcomes(), [['/one','loading'],['/one','error']]);
    assert.equal(f.context.entries.size, 0);
    assert.equal(f.state.getItem('opened').length, 0);
});

test('a failing outcome callback does not change an already completed outcome', async t => {
    const f = fixture(t, {onLoad(root, url, status){if(status === 'ready') throw Error('Listener failed');}});
    f.select('one');f.requests[0].resolve();await settle();
    assert.deepEqual(f.outcomes(), [['/one','loading'],['/one','ready']]);
    assert.equal(f.context.entries.get('/one').loading, false);
    assert.equal(f.state.getItem('active'), '/one');
    assert.equal(f.errors[0].title, 'Page load callback failed');
});


test('a selection listener failure after ready does not remove the loaded panel', async t => {
    const f = fixture(t, {onSelection(entries, active){
        if (entries.get(active)?.loading === false) throw Error('Selection listener failed');
    }});
    f.select('one');f.requests[0].resolve();await settle();
    assert.deepEqual(f.outcomes(), [['/one','loading'],['/one','ready']]);
    assert.equal(f.context.entries.get('/one').loading, false);
    assert.equal(f.state.getItem('opened').length, 1);
    assert.equal(f.errors.length, 1);
});
