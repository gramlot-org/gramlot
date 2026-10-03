// Phase S08: providers (source plan §4.8, §5.1; decisions P20, B7, D2a, R15, Q2, P4, P5, D1).
// The bodies are named logic registered as the page companion; the end-to-end cases go through
// the real bootstrap with a Python page.
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder, PageBootstrap} from '../src/index.js';
import {GramlotBuilderBag} from '../src/builder/source.js';
import {FileHost} from '../src/adapters/index.js';
import {mount} from './fixtures/mount.js';

const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';
const LOGIC = fileURLToPath(new URL('./fixtures/logic/', import.meta.url)).replace(/\/$/, '');

function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport: false});
    return {app, document, data: app.data, byId: id => document.getElementById(id)};
}

/** Register `methods` as the page companion (the root logic group). */
function companion(app, methods) {
    const Logic = class {};
    for (const [name, method] of Object.entries(methods)) {
        Object.defineProperty(Logic.prototype, name, {value: method, writable: true, configurable: true});
    }
    app.logicRegistry.register(Logic, {group: null, resource: '/test_aux.js'});
}

/** A Source authored on a separate builder, mounted as one branch (one `ins` event). */
function authored(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.source;
}

/** A counting method: every call pushes its kwargs. */
function counter(calls, result = undefined) {
    return function (...args) {
        calls.push(args.at(-1));
        return typeof result === 'function' ? result(...args) : result;
    };
}

test('the ^/= matrix: ^ triggers and reads, = only reads, both at call time', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {sum: counter(calls, kwargs => kwargs.a + kwargs.b)});
    data.setItem('b', 10);
    app.builder.root.dataFormula({result_path: 'total', func: 'sum', a: '^a', b: '=b'});
    data.setItem('b', 20);
    assert.equal(calls.length, 0);
    data.setItem('a', 1);
    assert.equal(calls.length, 1);
    assert.equal(data.getItem('total'), 21);
    app.dispose();
});

test('a formula writes its result once on result_path per invocation', () => {
    const {app, data} = page();
    const writes = [];
    companion(app, {double: kwargs => kwargs.a * 2});
    app.builder.root.dataFormula({result_path: 'r', func: 'double', a: '^a'});
    data.subscribe('writes', {any: event => { if (event.node.label === 'r') writes.push(event.evt); }});
    data.setItem('a', 1);
    data.setItem('a', 2);
    assert.deepEqual(writes, ['ins', 'upd_value']);
    assert.equal(data.getItem('r'), 4);
    app.dispose();
});

test('P20: kwargs carry the resolved author attributes and the trigger fields, never the control attributes', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {go: counter(calls)});
    data.setItem('b', 'read');
    const node = sourceTarget(app.builder.root.dataController({
        func: 'go', a: '^a', b: '=b', plain: 7, _delay: 0, _userChanges: false, _timing: 0, _onBuilt: false,
    }));
    data.setItem('a', 1);
    const [kwargs] = calls;
    assert.deepEqual(Object.keys(kwargs).sort(), ['_node', '_reason', '_triggerpars', 'a', 'b', 'plain']);
    assert.deepEqual([kwargs.a, kwargs.b, kwargs.plain], [1, 'read', 7]);
    assert.equal(kwargs._node, data.getNode('a'));
    assert.equal(kwargs._reason, 'node');
    assert.equal(kwargs._triggerpars.trigger_reason, 'node');
    assert.equal(kwargs._triggerpars.kw.path, 'a');
    assert.equal(kwargs._triggerpars.kw.registration.recipient, app.binding.bindingFor(node).providers[0]);
    app.dispose();
});

test('P20: a controller receives the Source node and this is the group; a formula receives kwargs only', () => {
    const {app, data} = page();
    const seen = [];
    companion(app, {
        control(node, kwargs) { seen.push(['controller', this === app.logic, node.nodeTag, kwargs.a]); },
        compute(kwargs) { seen.push(['formula', this === app.logic, arguments.length, kwargs.a]); return 1; },
    });
    app.builder.root.dataController({func: 'control', a: '^a'});
    app.builder.root.dataFormula({result_path: 'r', func: 'compute', a: '^a'});
    data.setItem('a', 5);
    assert.deepEqual(seen, [['controller', true, 'dataController', 5], ['formula', true, 1, 5]]);
    app.dispose();
});

test('D2a: _userChanges runs only the node level; programmatic node writes pass, container, child and autocreate do not', () => {
    const {app, data} = page();
    const filtered = [];
    const all = [];
    companion(app, {filtered: counter(filtered), all: counter(all)});
    app.builder.root.dataController({func: 'filtered', v: '^c.v', _userChanges: true});
    app.builder.root.dataController({func: 'all', v: '^c.v'});
    const writer = sourceTarget(app.builder.root.dataController({}));
    writer.SET('c.v', 1); // c created by autocreate, then the node insertion of v
    writer.SET('c.v', 2);
    writer.SET('c', new Bag({v: 3}));
    writer.SET('c.v.deep', 4);
    assert.deepEqual(filtered.map(kwargs => kwargs._reason), ['node', 'node']);
    assert.deepEqual(all.map(kwargs => kwargs._reason), ['node', 'node', 'container', 'child']);
    assert.equal(data.getItem('c.v.deep'), 4);
    app.dispose();
});

test('R15: two attributes hit by one container event give two invocations; a container pointer gives one', () => {
    const {app, data} = page();
    const pair = [];
    const container = [];
    companion(app, {pair: counter(pair), container: counter(container)});
    data.setItem('c', new Bag({x: 1, y: 2}));
    app.builder.root.dataController({func: 'pair', x: '^c.x', y: '^c.y'});
    app.builder.root.dataController({func: 'container', c: '^c'});
    data.setItem('c', new Bag({x: 3, y: 4}));
    assert.equal(pair.length, 2);
    assert.deepEqual(pair.map(kwargs => kwargs._reason), ['container', 'container']);
    assert.equal(container.length, 1);
    app.dispose();
});

test('Q2: two formulas that feed each other stop on the equal value, as legacy', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {copy: counter(calls, kwargs => kwargs.v)});
    app.builder.root.dataFormula({result_path: 'b', func: 'copy', v: '^a'});
    app.builder.root.dataFormula({result_path: 'a', func: 'copy', v: '^b'});
    data.setItem('a', 1);
    assert.equal(calls.length, 2);
    assert.deepEqual([data.getItem('a'), data.getItem('b')], [1, 1]);
    app.dispose();
});

test('_init runs once per node before the DOM: the first render shows its result; rebuild and thaw do not repeat it', () => {
    const {app, byId} = page();
    const calls = [];
    companion(app, {
        prepare: counter(calls, (kwargs) => {
            calls.dom = byId('shown');
            return `init ${kwargs._reason}`;
        }),
    });
    app.startSource(authored(root => {
        const box = root.section({id: 'box'});
        box.p('^shown', {id: 'shown'});
        box.dataFormula({result_path: 'shown', func: 'prepare', _init: true});
    }));
    assert.equal(calls.length, 1);
    assert.equal(calls.dom, null);
    assert.equal(byId('shown').textContent, 'init init');
    assert.equal(calls[0]._node, null);
    assert.deepEqual(calls[0]._triggerpars, {kw: null, trigger_reason: 'init'});
    const box = app.source.getItem('main').getNodes()[0];
    app.renderer.freeze(box);
    app.renderer.unfreeze(box);
    box.setAttr({title: 'rebuilt'});
    assert.equal(calls.length, 1);
    app.dispose();
});

test('_onBuilt runs after the build of its branch; under freeze it waits for the thaw; _onStart follows for a branch inserted after start', () => {
    const {app, byId} = page();
    const order = [];
    companion(app, {
        built(node, kwargs) { order.push([kwargs._reason, byId('late') !== null]); },
        started(node, kwargs) { order.push([kwargs._reason, byId('late') !== null]); },
    });
    app.startSource(authored(root => root.section({id: 'box'})));
    const box = sourceTarget(app.source.getItem('main').getNodes()[0]);
    app.renderer.freeze(box);
    const inner = app.builder.wrapSource(box).div({id: 'late'});
    inner.dataController({func: 'built', _onBuilt: true});
    inner.dataController({func: 'started', _onStart: true});
    assert.deepEqual(order, []);
    app.renderer.unfreeze(box);
    assert.deepEqual(order, [['built', true], ['start', true]]);
    app.renderer.freeze(box);
    app.renderer.unfreeze(box);
    assert.equal(order.length, 2);
    app.dispose();
});

test('_onStart of the initial Source runs when the page is started, after every _onBuilt', () => {
    const {app} = page();
    const order = [];
    companion(app, {
        record(node, kwargs) { order.push([kwargs._reason, app.state]); },
    });
    app.startSource(authored(root => {
        root.dataController({func: 'record', _onStart: true});
        root.div().dataController({func: 'record', _onBuilt: true});
    }));
    assert.deepEqual(order, [['built', 'ready'], ['start', 'started']]);
    app.dispose();
});

test('P5: an observer outside the branch sees every dataSetter write; the providers of the branch see none of them', () => {
    const {app, data} = page();
    const outside = [];
    const inside = [];
    companion(app, {outside: counter(outside), inside: counter(inside)});
    app.builder.root.dataController({func: 'outside', x: '^x'});
    app.startSource(authored(root => {
        root.dataSetter({destination_path: 'x', value: 1});
        root.dataController({func: 'inside', x: '^x'});
        root.dataSetter({destination_path: 'x', value: 2});
    }));
    assert.deepEqual(outside.map(kwargs => kwargs.x), [1, 2]);
    assert.deepEqual(inside, []);
    data.setItem('x', 3);
    assert.deepEqual(inside.map(kwargs => kwargs.x), [3]);
    app.dispose();
});

test('P4: an _init that inserts a branch; the insertion is processed after the current branch, installed once', () => {
    const {app, data, byId} = page();
    const seen = [];
    companion(app, {
        grow() {
            seen.push(byId('box'));
            const grown = this.page.builder.root.div({id: 'grown'});
            grown.dataSetter({destination_path: 'g', value: 'once'});
            grown.span('^g', {id: 'g'});
        },
    });
    app.startSource(authored(root => root.section({id: 'box'}).dataController({func: 'grow', _init: true})));
    assert.deepEqual(seen, [null]);
    assert.ok(byId('box'));
    assert.equal(byId('g').textContent, 'once');
    const setter = app.source.getNodes().at(-1).value.getNodes()[0];
    assert.equal(app.binding.bindingFor(setter).hasStamp('installed'), true);
    data.setItem('g', 'changed');
    assert.equal(byId('g').textContent, 'changed');
    app.dispose();
});

test('P4: an _init that removes its own branch: no DOM of the removed nodes, their NodeBindings closed, no _onBuilt', () => {
    const {app, byId} = page();
    const built = [];
    companion(app, {
        leave(node) {
            const box = node.parentBag.parentNode;
            box.parentBag.popNode(box.label);
        },
        built: counter(built),
    });
    app.startSource(authored(root => {
        root.p('stays', {id: 'stays'});
        const box = root.section({id: 'box'});
        box.p('inside', {id: 'inside'});
        box.dataController({func: 'leave', _init: true});
        box.dataController({func: 'built', _onBuilt: true});
    }));
    assert.ok(byId('stays'));
    assert.equal(byId('box'), null);
    assert.equal(byId('inside'), null);
    assert.deepEqual(built, []);
    assert.equal(app.binding.size, 2); // the fragment main and p#stays
    app.dispose();
});

test('P4: an _init or an _onBuilt that removes a later node: the removed node runs neither', () => {
    const {app} = page();
    const ran = [];
    companion(app, {
        drop(node) {
            ran.push(node.getAttr('name'));
            const target = node.parentBag.getNodes().find(each => each.getAttr('name') === node.getAttr('target'));
            node.parentBag.popNode(target.label);
        },
        record(node) { ran.push(node.getAttr('name')); },
    });
    app.startSource(authored(root => {
        root.dataController({func: 'drop', name: 'a', target: 'b', _init: true});
        root.dataController({func: 'record', name: 'b', _init: true});
        root.dataController({func: 'drop', name: 'c', target: 'd', _onBuilt: true});
        root.dataController({func: 'record', name: 'd', _onBuilt: true});
        root.dataController({func: 'record', name: 'e', _init: true, _onBuilt: true});
    }));
    assert.deepEqual(ran, ['a', 'e', 'c', 'e']);
    app.dispose();
});

test('P4: an _init that replaces an ancestor: the new value is built once its event is processed', () => {
    const {app, byId} = page();
    companion(app, {
        swap(node) {
            const outer = node.parentBag.parentNode.parentBag.parentNode;
            const fresh = new GramlotBuilderBag(null, outer.builder);
            outer.builder.wrapSource(fresh).p('fresh', {id: 'fresh'});
            outer.setValue(fresh);
        },
    });
    app.startSource(authored(root => root.section({id: 'outer'}).div({id: 'box'}).dataController({func: 'swap', _init: true})));
    assert.equal(byId('box'), null);
    assert.equal(byId('fresh').textContent, 'fresh');
    assert.ok(app.binding.bindingFor(app.renderer.getBaseSourceNode(byId('fresh'))));
    app.dispose();
});

test('P4: an observer that mutates the Source during a dataSetter; the same cases under freeze', () => {
    for (const frozen of [false, true]) {
        const {app, byId} = page();
        companion(app, {
            react(node, kwargs) {
                if (kwargs.x === 1) this.page.builder.root.p('reaction', {id: 'reaction'});
            },
            grow() { this.page.builder.root.p('grown', {id: 'grown'}); },
        });
        app.builder.root.dataController({func: 'react', x: '^x'});
        const box = sourceTarget(app.builder.root.section({id: 'box'}));
        if (frozen) app.renderer.freeze(box);
        const branch = new GramlotBuilderBag(null, app.builder);
        const inner = app.builder.wrapSource(branch).div({id: 'inner'});
        inner.dataSetter({destination_path: 'x', value: 1});
        inner.dataController({func: 'grow', _init: true});
        box.setValue(branch);
        assert.equal(byId('reaction').textContent, 'reaction');
        assert.equal(byId('grown').textContent, 'grown');
        assert.equal(byId('inner') === null, frozen);
        if (frozen) app.renderer.unfreeze(box);
        assert.ok(byId('inner'));
        assert.equal(app.data.getItem('x'), 1);
        app.dispose();
    }
});

test('an _init error propagates; the NodeBindings of the branch stay open (P12, no rollback)', () => {
    const {app, data} = page();
    companion(app, {fail() { throw new Error('init failure'); }});
    const box = sourceTarget(app.builder.root.section());
    const branch = new GramlotBuilderBag(null, app.builder);
    const setter = sourceTarget(app.builder.wrapSource(branch).dataSetter({destination_path: 'x', value: 1}));
    const failing = sourceTarget(app.builder.wrapSource(branch).dataController({func: 'fail', _init: true}));
    assert.throws(() => box.setValue(branch), /init failure/);
    assert.equal(data.getItem('x'), 1);
    assert.ok(app.binding.bindingFor(setter));
    assert.ok(app.binding.bindingFor(failing));
    app.dispose();
});

test('gate decision 5: provider attributes on a visual node or a dataSetter are an error at installation', () => {
    for (const [author, pattern] of [
        [root => root.div({_init: true}), /div 'div_0': '_init' is allowed only on dataFormula and dataController/],
        [root => root.dataSetter({destination_path: 'x', value: 1, _delay: 5}), /dataSetter '.*': '_delay' is allowed only/],
        [root => root.p({_timing: 1}), /'_timing' is allowed only/],
        [root => root.span({_onStart: true}), /'_onStart' is allowed only/],
        [root => root.span({_onBuilt: true}), /'_onBuilt' is allowed only/],
        [root => root.span({_userChanges: true}), /'_userChanges' is allowed only/],
    ]) {
        const {app, data} = page();
        assert.throws(() => app.startSource(authored(root => {
            root.dataSetter({destination_path: 'before', value: 1});
            author(root);
        })), pattern);
        assert.equal(data.getItem('before'), null);
        app.dispose();
    }
});

test('gate decision 6: a formula whose result_path is in a null context raises at every invocation', () => {
    const {app, data} = page();
    companion(app, {one: () => 1});
    app.builder.root.div({datapath: '^sel'}).dataFormula({result_path: '.r', func: 'one', a: '^a'});
    assert.throws(() => data.setItem('a', 1), /dataFormula '.*': write on a null path: '\.r'/);
    assert.throws(() => data.setItem('a', 2), /write on a null path/);
    app.dispose();
});

test('gate decision 7: an inline body registers and runs (S09); a missing func raises at the first invocation', () => {
    const {app, data} = page();
    mount(app, root => {
        root.dataFormula({result_path: 'r', formula: 'a + 1', a: '^a'});
        root.dataController({script: 'this.SET("seen", b)', b: '^b'});
        root.dataController({func: 'missing', c: '^c'});
    });
    assert.equal(app.binding.router.size, 3);
    data.setItem('a', 1);
    assert.equal(data.getItem('r'), 2);
    data.setItem('b', 1);
    assert.equal(data.getItem('seen'), 1);
    assert.throws(() => data.setItem('c', 1), /named logic 'missing' not found/);
    app.dispose();
});

test('no body, as legacy: a formula writes the Bag of its author arguments; a controller does nothing', () => {
    const {app, data} = page();
    app.builder.root.dataFormula({result_path: 'r', a: '^a', k: 'x'});
    app.builder.root.dataController({b: '^a'});
    data.setItem('a', 1);
    assert.ok(data.getItem('r') instanceof Bag);
    assert.deepEqual([data.getItem('r.a'), data.getItem('r.k')], [1, 'x']);
    app.dispose();
});

test('D1: a provider through a valid, a null and a valid path: null arguments, no call on the old path', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {go: counter(calls)});
    data.setItem('sel', 'one');
    const box = app.builder.root.div({datapath: '^sel'});
    box.dataController({func: 'go', v: '^.v', go: '^go'});
    data.setItem('one.v', 1);
    data.setItem('sel', null);
    data.setItem('one.v', 2);
    data.setItem('go', true);
    data.setItem('sel', 'two');
    data.setItem('one.v', 3);
    data.setItem('two.v', 4);
    assert.deepEqual(calls.map(kwargs => [kwargs._triggerpars.kw.path, kwargs.v]), [['one.v', 1], ['go', null], ['two.v', 4]]);
    app.dispose();
});

test('a variable datapath on the data-element itself rebinds its provider', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {go: counter(calls)});
    data.setItem('sel', 'one');
    app.builder.root.dataController({datapath: '^sel', func: 'go', v: '^.v'});
    data.setItem('sel', 'two');
    data.setItem('one.v', 1);
    data.setItem('two.v', 2);
    assert.deepEqual(calls.map(kwargs => kwargs.v), [2]);
    app.dispose();
});

test('removing a provider closes its registrations', () => {
    const {app, data} = page();
    const calls = [];
    companion(app, {go: counter(calls)});
    const node = sourceTarget(app.builder.root.dataController({func: 'go', a: '^a', b: '^b'}));
    assert.equal(app.binding.router.size, 2);
    node.parentBag.popNode(node.label);
    assert.equal(app.binding.router.size, 0);
    data.setItem('a', 1);
    assert.deepEqual(calls, []);
    app.dispose();
});

/** The Python FileHost of the fixture folder: page HTML and main wire. */
function openPython(path) {
    return JSON.parse(execFileSync(python, ['-c', `
import asyncio, json, sys
from gramlot.server import FileHost, parse_requires
class LogicHost(FileHost):
    def resolve_resources(self, path, cls):
        if not cls.js_requires:
            return super().resolve_resources(path, cls)
        return {"css": [], "js": [*({"url": f"/{name}.js", "group": name} for name in parse_requires(cls.js_requires)),
                                  {"url": "/calcolo_aux.js", "group": None}]}
async def run():
    host = LogicHost(sys.argv[1])
    opened = await host.open_page(sys.argv[2], prefix=sys.argv[1])
    return {"html": opened.html, "wire": await host.main(opened.page_id)}
print(json.dumps(asyncio.run(run())))
`, LOGIC, path], {encoding: 'utf8'}));
}

/** The argument the host writes into `new PageBootstrap(…)`. */
function bootstrapArguments(html) {
    const match = html.match(/await new PageBootstrap\((.*)\)\.run\(\);<\/script>/s);
    assert.ok(match, 'the bootstrap script calls PageBootstrap');
    return JSON.parse(match[1]);
}

/** Run the real bootstrap of `html` in jsdom, `main` answering `wire`. */
async function boot({html, wire}, name) {
    const {window} = new JSDOM(html, {url: pathToFileURL(`${LOGIC}/${name}`).href});
    window.navigator.sendBeacon = () => true;
    const original = globalThis.fetch;
    globalThis.fetch = async () => ({ok: true, status: 200, text: async () => wire});
    try {
        const app = await new PageBootstrap({...bootstrapArguments(html), document: window.document}).run();
        return {app, window};
    } finally { globalThis.fetch = original; }
}

test('a Python Source calls named logic through the real bootstrap, with no manual injection', async () => {
    const {app, window} = await boot(openPython('/calcolo'), 'calcolo');
    app.data.setItem('ordine.prezzo', 10);
    assert.equal(app.data.getItem('ordine.sconto'), 9);
    app.data.setItem('ordine.a', 1);
    app.data.setItem('ordine.b', 2);
    assert.equal(app.data.getItem('ordine.totale'), 3);
    assert.equal(window.document.querySelector('input').value, '10');
    app.dispose();
});

test('the companion is registered before the first _init; opening the page on the JS and Python hosts runs no logic', async () => {
    globalThis.gramlotSentinel = 0;
    const host = new FileHost(LOGIC);
    const opened = await host.openPage('/avvio', {prefix: LOGIC});
    const jsWire = await host.main(opened.pageId);
    const pythonOpened = openPython('/avvio');
    assert.equal(globalThis.gramlotSentinel, 0);
    for (const [pageOpened, wire] of [[pythonOpened, pythonOpened.wire], [opened, jsWire]]) {
        const {app, window} = await boot({html: pageOpened.html, wire}, 'avvio');
        assert.equal(app.data.getItem('pronto'), 'ok: init');
        assert.equal(window.document.getElementById('pronto').textContent, 'ok: init');
        app.dispose();
    }
    assert.equal(globalThis.gramlotSentinel, 2);
    delete globalThis.gramlotSentinel;
});

// Phase 18 (Fable R5): a lifecycle attribute is true, false, null or a number; anything else is an error
// naming node and attribute, at the validation of the candidate, instead of being ignored.
test('Fable R5: _init, _onBuilt and _onStart reject pointers and strings, naming node and attribute', () => {
    for (const name of ['_init', '_onBuilt', '_onStart']) {
        for (const value of ['^flag', 'yes', '=flag', {}]) {
            const {app, data} = page();
            data.setItem('flag', true);
            assert.throws(() => app.startSource(authored(root => {
                root.dataSetter({destination_path: 'before', value: 1});
                root.dataController({script: 'x', [name]: value});
            })), error => error.message.startsWith("dataController '")
                && error.message.endsWith(`: '${name}' accepts true, false, null or a number, not ${JSON.stringify(value)}`));
            assert.equal(data.getItem('before'), null);
            assert.ok(!app.source.getNode('main'));
            app.dispose();
        }
    }
    const {app} = page();
    let runs = 0;
    companion(app, {count() { runs++; }});
    app.startSource(authored(root => {
        root.dataController({func: 'count', _init: false, _onBuilt: null, _onStart: true});
        root.dataController({func: 'count', _init: 0});
    }));
    assert.equal(runs, 2);
    app.dispose();
});
