// Phase S05: installation of `dataSetter` (decisions A2, R1, R17, P8, P25, Q7; source plan §2, §4.6,
// §5.1 steps 2-4). Values are checked at the first render.
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {Bag} from '@genrojs/bag';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {GramlotBuilderBag} from '../src/builder/source.js';
import {fromTytx, toTytx} from '@genrojs/tytx';

const python = process.env.GRAMLOT_TEST_PYTHON ?? 'python3';

/** A fake server: `call` answers `main` and the remote Sources from the given functions, in the response envelope. */
function envelope({main, source, ...rest}) {
    return {...rest, async call(text, signal) {
        const {id, contentType, name, params} = fromTytx(text);
        const value = name === 'main' ? await main() : await source(name, params, signal);
        return toTytx({id, contentType, value});
    }};
}

function page(transport = false) {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'),
        transport: transport && envelope(transport)});
    return {app, document, data: app.data, byId: id => document.getElementById(id)};
}

/** A Source authored on a separate builder, mounted as one branch (one `ins` event). */
function authored(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.source;
}

function wire(author) {
    const builder = new GramlotBuilder();
    author(builder.root);
    return builder.toTytx();
}

/** The TYTX wire of a Source authored in Python on GramlotBuilder. */
function pythonWire(body) {
    return execFileSync(python, ['-c', `
from genro_bag import Bag
from genro_tytx import to_tytx
from gramlot import GramlotBuilder
builder = GramlotBuilder()
root = builder.root
${body}
print(to_tytx(builder.source))
`], {encoding: 'utf8'}).trim();
}

/** Attributes of a Data node without Bag bookkeeping. */
function attributes(data, path) {
    return data.getNode(path).getAttr();
}

test('A2: an earlier element sees a deep dataSetter declared after it, at the first render', () => {
    const {app, byId} = page();
    app.src.startSource(authored(root => {
        root.p('^x', {id: 'early', title: '^y'});
        const box = root.div();
        box.div().dataSetter({destination_path: 'x', value: 'deep'});
        box.dataSetter({destination_path: 'y', value: 'nested'});
    }));
    assert.equal(byId('early').textContent, 'deep');
    assert.equal(byId('early').title, 'nested');
    app.dispose();
});

test('A2: two dataSetters on the same path at different depths: the second in document order wins', () => {
    const deeperFirst = page();
    deeperFirst.app.src.startSource(authored(root => {
        root.span('^x', {id: 's'});
        root.div().div().dataSetter({destination_path: 'x', value: 'inner'});
        root.dataSetter({destination_path: 'x', value: 'outer'});
    }));
    assert.equal(deeperFirst.byId('s').textContent, 'outer');
    deeperFirst.app.dispose();
    const deeperSecond = page();
    deeperSecond.app.src.startSource(authored(root => {
        root.span('^x', {id: 's'});
        root.dataSetter({destination_path: 'x', value: 'outer'});
        root.div().div().dataSetter({destination_path: 'x', value: 'inner'});
    }));
    assert.equal(deeperSecond.byId('s').textContent, 'inner');
    deeperSecond.app.dispose();
});

test('A2: a relative destination_path resolves in the dataSetter context', () => {
    const {app, data, byId} = page();
    app.src.startSource(authored(root => {
        const box = root.div({datapath: 'ordine'});
        box.span('^.cliente', {id: 's'});
        box.dataSetter({destination_path: '.cliente', value: 'Ada'});
    }));
    assert.equal(data.getItem('ordine.cliente'), 'Ada');
    assert.equal(byId('s').textContent, 'Ada');
    app.dispose();
});

test('R1: null creates a missing path, keeps an existing value and applies the attributes; a value writes', () => {
    const {app, data} = page();
    data.setItem('kept', 7);
    data.setItem('replaced', 7);
    app.src.startSource(authored(root => {
        root.dataSetter({destination_path: 'absent', value: null});
        root.dataSetter({destination_path: 'seven', value: 7});
        root.dataSetter({destination_path: 'seven', value: null});
        root.dataSetter({destination_path: 'kept', value: null, colore: 'rosso'});
        root.dataSetter({destination_path: 'replaced', value: 9});
    }));
    assert.ok(data.getNode('absent'));
    assert.equal(data.getItem('absent'), null);
    assert.equal(data.getItem('seven'), 7);
    assert.equal(data.getItem('kept'), 7);
    assert.deepEqual(attributes(data, 'kept'), {colore: 'rosso'});
    assert.equal(data.getItem('replaced'), 9);
    app.dispose();
});

test('R1: a missing path with null and attributes is created with null and the attributes', () => {
    const {app, data} = page();
    app.src.startSource(authored(root => root.dataSetter({destination_path: 'a.b', value: null, caption: 'Nome'})));
    assert.equal(data.getItem('a.b'), null);
    assert.deepEqual(attributes(data, 'a.b'), {caption: 'Nome'});
    app.dispose();
});

test('gate decision 1: a value replaces the attributes when the setter declares some, keeps them when it declares none', () => {
    const {app, data} = page();
    data.setItem('x', 1, {caption: 'old'});
    data.setItem('y', 1, {caption: 'old'});
    app.src.startSource(authored(root => {
        root.dataSetter({destination_path: 'x', value: 9, colore: 'rosso'});
        root.dataSetter({destination_path: 'y', value: 9});
    }));
    assert.equal(data.getItem('x'), 9);
    assert.deepEqual(attributes(data, 'x'), {colore: 'rosso'});
    assert.equal(data.getItem('y'), 9);
    assert.deepEqual(attributes(data, 'y'), {caption: 'old'});
    app.dispose();
});

test('gate decision 5: metadata, binding attributes and keys starting with _ never reach the Data node', () => {
    const {app, data} = page();
    app.src.startSource(authored(root => root.div({datapath: 'ctx', node_id: 'box'}).dataSetter({
        destination_path: '.x', value: 1, colore: 'rosso', _private: 'p', default: 3, attr_dtype: 'N',
        live: true, updateOn: 'input',
    })));
    assert.equal(data.getItem('ctx.x'), 1);
    assert.deepEqual(attributes(data, 'ctx.x'), {colore: 'rosso'});
    app.dispose();
});

test('R17: a null attribute counts as omitted, the same from Python and from JavaScript', () => {
    for (const source of [
        () => wire(root => root.dataSetter({destination_path: 'x', value: null, caption: null})),
        () => pythonWire('root.dataSetter("x", None, caption=None)'),
    ]) {
        const {app, data} = page();
        data.setItem('x', 5, {caption: 'old'});
        app.src.startSource(source());
        assert.equal(data.getItem('x'), 5);
        assert.deepEqual(attributes(data, 'x'), {caption: 'old'});
        app.dispose();
    }
});

test('P25: a Bag payload moves into Data with its backref; the value attribute leaves the Source node silently', () => {
    const {app, data, byId} = page();
    const payload = new Bag();
    payload.setItem('nome', 'Ada');
    const source = authored(root => {
        root.span('^cliente.nome', {id: 's'});
        root.dataSetter({destination_path: 'cliente', value: payload, tipo: 'persona'});
    });
    const events = [];
    app.src.source.subscribe('spy', {any: event => events.push(event.evt)});
    app.src.startSource(source);
    const setter = app.src.source.getItem('main').getNodes()[1];
    assert.strictEqual(data.getItem('cliente'), payload);
    assert.strictEqual(payload.parentNode, data.getNode('cliente'));
    assert.deepEqual(attributes(data, 'cliente'), {tipo: 'persona'});
    assert.equal(Object.hasOwn(setter.getAttr(), 'value'), false);
    assert.equal(setter.getAttr('tipo'), 'persona');
    assert.deepEqual(events, ['ins']);
    assert.equal(byId('s').textContent, 'Ada');
    data.setItem('cliente.nome', 'Bea');
    assert.equal(byId('s').textContent, 'Bea');
    app.dispose();
});

test('P25: a scalar value stays on the Source node', () => {
    const {app} = page();
    app.src.startSource(authored(root => root.dataSetter({destination_path: 'n', value: 3})));
    assert.equal(app.src.source.getItem('main').getNodes()[0].getAttr('value'), 3);
    app.dispose();
});

test('dataSetter is literal: pointers, == expressions and templates are written as strings', () => {
    const {app, data} = page();
    data.setItem('y', 'Y');
    app.src.startSource(authored(root => {
        root.dataSetter({destination_path: 'pointer', value: '^y'});
        root.dataSetter({destination_path: 'read', value: '=y'});
        root.dataSetter({destination_path: 'expression', value: '==a+b'});
        root.dataSetter({destination_path: 'template', value: 'a${b}'});
        root.dataSetter({destination_path: 'attribute', value: 1, caption: '^y', hint: '=y', size: '${w}'});
    }));
    assert.equal(data.getItem('pointer'), '^y');
    assert.equal(data.getItem('read'), '=y');
    assert.equal(data.getItem('expression'), '==a+b');
    assert.equal(data.getItem('template'), 'a${b}');
    assert.deepEqual(attributes(data, 'attribute'), {caption: '^y', hint: '=y', size: '${w}'});
    app.dispose();
});

test('P8: duplicate dataSetters are installed with no warning', () => {
    const {app, data} = page();
    const warnings = [];
    const warn = console.warn;
    console.warn = (...args) => warnings.push(args);
    try {
        app.src.startSource(authored(root => {
            root.dataSetter({destination_path: 'x', value: 1});
            root.dataSetter({destination_path: 'x', value: 2});
        }));
    } finally {
        console.warn = warn;
    }
    assert.equal(data.getItem('x'), 2);
    assert.deepEqual(warnings, []);
    app.dispose();
});

test('the _path rule: a destination_path written as a pointer loses its symbol, with one warning per declaration', () => {
    const {app, data} = page();
    const warnings = [];
    const warn = console.warn;
    console.warn = (...args) => warnings.push(args.join(' '));
    try {
        app.src.startSource(authored(root => {
            root.dataSetter({destination_path: '^x', value: 1});
            root.dataSetter({destination_path: '=y', value: 2});
            root.dataSetter({destination_path: 'z', value: 3});
        }));
        const [first] = app.src.source.getItem('main').getNodes();
        app.src.binding.installer.applySetter(first); // a second read of the same declaration
        app.src.builder.root.dataSetter({destination_path: '^w', value: 4});
    } finally {
        console.warn = warn;
    }
    assert.deepEqual([data.getItem('x'), data.getItem('y'), data.getItem('z'), data.getItem('w')], [1, 2, 3, 4]);
    assert.equal(warnings.length, 3);
    assert.match(warnings[0], /dataSetter '.*': 'destination_path' holds a bare Data path; the pointer symbol of '\^x' is removed/);
    assert.match(warnings[1], /'=y'/);
    assert.match(warnings[2], /'\^w'/);
    app.dispose();
});

test('Q7: a dataSetter on a null path is skipped', () => {
    const {app, data} = page();
    app.src.startSource(authored(root => {
        const box = root.div({datapath: '^sel'});
        box.dataSetter({destination_path: '.x', value: 1});
    }));
    assert.equal(data.getNodes().length, 0);
    app.dispose();
});

test('an inserted branch installs its setters before its DOM, and the NodeBinding is stamped installed', () => {
    const {app, data, byId} = page();
    const box = sourceTarget(app.src.builder.root.div({id: 'box'}));
    const branch = new GramlotBuilderBag(null, app.src.builder);
    app.src.builder.wrapSource(branch).span('^late', {id: 'late'});
    const setter = sourceTarget(app.src.builder.wrapSource(branch).dataSetter({destination_path: 'late', value: 'ok'}));
    box.setValue(branch);
    assert.equal(byId('late').textContent, 'ok');
    assert.equal(app.src.binding.bindingFor(setter).hasStamp('installed'), true);
    const direct = sourceTarget(app.src.builder.root.dataSetter({destination_path: 'direct', value: 1}));
    assert.equal(data.getItem('direct'), 1);
    assert.equal(app.src.binding.bindingFor(direct).hasStamp('installed'), true);
    app.dispose();
});

test('P3: a branch inserted under freeze installs at once; its DOM waits for thaw', () => {
    const {app, data, byId} = page();
    const box = sourceTarget(app.src.builder.root.section({id: 'box'}));
    app.src.renderer.freeze(box);
    const inner = app.src.builder.wrapSource(box).div();
    inner.span('^x', {id: 'x'});
    inner.dataSetter({destination_path: 'x', value: 'frozen'});
    assert.equal(data.getItem('x'), 'frozen');
    assert.equal(byId('x'), null);
    app.src.renderer.unfreeze(box);
    assert.equal(byId('x').textContent, 'frozen');
    app.dispose();
});

test('no reinstallation at rebuild or thaw, nor on a Source change of the dataSetter', () => {
    const {app, data, byId} = page();
    app.src.startSource(authored(root => {
        const box = root.section({id: 'box'});
        box.span('^x', {id: 'x'});
        box.dataSetter({destination_path: 'x', value: 1});
    }));
    const box = app.src.source.getItem('main').getNodes()[0];
    const setter = box.value.getNodes()[1];
    data.setItem('x', 5);
    app.src.renderer.freeze(box);
    app.src.renderer.unfreeze(box); // thaw rebuilds the section
    assert.equal(data.getItem('x'), 5);
    assert.equal(byId('x').textContent, '5');
    setter.setAttr({value: 2});
    assert.equal(data.getItem('x'), 5);
    app.dispose();
});

test('remoteSource installs the dataSetters of the replacement before its first render', async () => {
    let resolve;
    const {app, data, byId} = page({main: async () => wire(root => root.div('old', {id: 'slot'})),
        source: () => new Promise(done => { resolve = done; })});
    await app.start();
    const target = app.src.source.getItem('main').getNodes()[0];
    const pending = app.src.remoteSource(target, 'details');
    resolve(wire(root => {
        root.span('^remote.nome', {id: 'nome'});
        root.dataSetter({destination_path: 'remote.nome', value: 'Ada', caption: 'Nome'});
    }));
    assert.equal(await pending, true);
    assert.equal(data.getItem('remote.nome'), 'Ada');
    assert.deepEqual(attributes(data, 'remote.nome'), {caption: 'Nome'});
    assert.equal(byId('nome').textContent, 'Ada');
    app.dispose();
});

test('an invalid form fails at validation, before any installation', () => {
    const {app, data} = page();
    const source = authored(root => {
        root.dataSetter({destination_path: 'x', value: 1});
        root.dataSetter({destination_path: 'y', value: 2});
    });
    source.getNodes()[1].setAttr({destination_path: 'y?caption'}, false);
    assert.throws(() => app.src.startSource(source), /'destination_path' does not accept '\?attr'/);
    assert.equal(data.getNodes().length, 0);
    assert.equal(app.src.binding.size, 0);
    app.dispose();
});

test('gate decision 2: a dataSetter inside svg is an error before any write', () => {
    const {app, data} = page();
    const source = authored(root => {
        root.dataSetter({destination_path: 'x', value: 1});
        root.svg().dataSetter({destination: 'y', value: 2});
    });
    assert.throws(() => app.src.startSource(source), /dataSetter '.*': dataSetter is not supported inside svg/);
    assert.equal(data.getNodes().length, 0);
    app.dispose();
});

test('gate decision 6: an installation error closes the new NodeBindings; Data is not rolled back', () => {
    const {app, data} = page();
    const box = sourceTarget(app.src.builder.root.div({id: 'box'}));
    const before = app.src.binding.size;
    const branch = new GramlotBuilderBag(null, app.src.builder);
    const wrapped = app.src.builder.wrapSource(branch);
    wrapped.span('^missing', {id: 'kept', node_id: 'kept'});
    wrapped.dataSetter({destination_path: 'written', value: 1});
    wrapped.dataSetter({destination_path: '#nowhere.x', value: 2});
    assert.throws(() => box.setValue(branch), /#<id>: cannot resolve/);
    assert.equal(data.getItem('written'), 1);
    assert.equal(app.src.binding.size, before);
    for (const node of branch.getNodes()) assert.equal(app.src.binding.bindingFor(node), null);
    assert.equal(app.src.binding.nodeIds.has('kept'), false);
    app.dispose();
});

test('Python and JavaScript Sources install the same Data', () => {
    const js = page();
    const bag = new Bag();
    bag.setItem('a', 1, {colore: 'rosso'});
    js.data.setItem('kept', 7);
    js.app.src.startSource(wire(root => {
        root.dataSetter({destination_path: 'absent', value: null});
        root.dataSetter({destination_path: 'kept', value: null, colore: 'rosso'});
        root.dataSetter({destination_path: 'n', value: 9});
        root.dataSetter({destination_path: 'literal', value: '^y', caption: '=z'});
        root.dataSetter({destination_path: 'bag', value: bag});
        root.div({datapath: 'ctx'}).dataSetter({destination_path: '.deep', value: 'd'});
    }));
    const py = page();
    py.data.setItem('kept', 7);
    py.app.src.startSource(pythonWire(`
bag = Bag()
bag.set_item("a", 1, colore="rosso")
root.dataSetter("absent", None)
root.dataSetter("kept", None, colore="rosso")
root.dataSetter("n", 9)
root.dataSetter("literal", "^y", caption="=z")
root.dataSetter("bag", bag)
root.div(datapath="ctx").dataSetter(".deep", "d")
`));
    const snapshot = data => ({
        absent: [data.getItem('absent'), attributes(data, 'absent')],
        kept: [data.getItem('kept'), attributes(data, 'kept')],
        n: data.getItem('n'),
        literal: [data.getItem('literal'), attributes(data, 'literal')],
        bag: [data.getItem('bag.a'), attributes(data, 'bag.a')],
        deep: data.getItem('ctx.deep'),
    });
    assert.deepEqual(snapshot(py.data), snapshot(js.data));
    assert.deepEqual(snapshot(js.data), {
        absent: [null, {}], kept: [7, {colore: 'rosso'}], n: 9, literal: ['^y', {caption: '=z'}],
        bag: [1, {colore: 'rosso'}], deep: 'd',
    });
    js.app.dispose();
    py.app.dispose();
});

// Phase 18 (Fable R1 + R6): the installation rules run at the validation of the candidate (§5.1 step 1);
// a failure after the insertion takes main out of the Source again, so the page can start once more.
test('Fable R1+R6: main never stays in the Source without NodeBindings; the page starts again', () => {
    const {app, data, byId} = page();
    assert.throws(() => app.src.startSource(authored(root => {
        root.dataSetter({destination_path: 'before', value: 1});
        root.div({_init: true});
    })), /div 'div_0': '_init' is allowed only on dataFormula, dataController and dataRpc/);
    assert.ok(!app.src.source.getNode('main'));
    assert.equal(data.getItem('before'), null);
    assert.equal(app.state, 'failed');
    assert.throws(() => app.src.startSource(authored(root => {
        root.dataSetter({destination_path: 'written', value: 1});
        root.dataController({script: 'x', _onStart: -1});
    })), /_onStart must be true or a delay in ms not below 0/);
    assert.ok(!app.src.source.getNode('main'));
    assert.equal(data.getItem('written'), 1);
    assert.equal(app.src.binding.size, 0);
    app.src.startSource(authored(root => root.span('^v', {id: 's'})));
    assert.equal(app.state, 'started');
    data.setItem('v', 'ok');
    assert.equal(byId('s').textContent, 'ok');
    sourceTarget(app.src.source.getItem('main').getNodes()[0]).setAttr({title: 't'});
    assert.equal(byId('s').title, 't');
    app.dispose();
});

test('Fable R1: an update of a later branch whose installation failed is an error naming node and tag', () => {
    const {app} = page();
    app.src.startSource(authored(root => root.div({id: 'host'})));
    const host = sourceTarget(app.src.source.getItem('main').getNodes()[0]);
    assert.throws(() => app.src.builder.wrapSource(host).dataController({script: 'x', _onStart: -1}), /_onStart must be/);
    const failed = host.value.getNodes()[0];
    assert.equal(app.src.binding.bindingFor(failed), null);
    assert.throws(() => failed.setAttr({script: 'y'}),
        {message: `dataController '${failed.label}': the node has no NodeBinding (its installation failed); remove it from the Source and insert it again`});
    assert.throws(() => failed.setValue('text'), /dataController '.*': the node has no NodeBinding/);
    // Gate check: a context attribute raises the same error, before the node_id map changes.
    for (const attrs of [{datapath: 'ctx'}, {_anchor: true}, {node_id: 'lost'}, {form: true}, {formId: 'f'}]) {
        assert.throws(() => failed.setAttr(attrs), /dataController '.*': the node has no NodeBinding/, Object.keys(attrs)[0]);
    }
    assert.equal(app.src.binding.nodeIds.has('lost'), false);
    host.value.popNode(failed.label);
    app.src.builder.wrapSource(host).span('ok', {id: 'ok'});
    app.dispose();
});

// Gate check of Phase 18: the installation rules are part of step 1 (§5.1), so an invalid candidate
// leaves the observed Source as it was.
test('Fable R1: a candidate that is not installable changes nothing in the Source', async () => {
    const {app, byId} = page({main: async () => wire(root => root.div({id: 'slot'}).span('old', {id: 'old'})),
        source: async () => wire(root => root.dataController({script: 'x', _onStart: 'later'}))});
    await app.start();
    const target = app.src.source.getItem('main').getNodes()[0];
    const [old] = target.value.getNodes();
    await assert.rejects(app.src.remoteSource(target, 'details'), /'_onStart' accepts true, false, null or a number/);
    assert.deepEqual(target.value.getNodes(), [old]);
    assert.ok(app.src.binding.bindingFor(old));
    assert.equal(byId('old').textContent, 'old');
    app.dispose();

    const other = page();
    // The renderer subscribes first: after an `ins` whose installation fails, this probe would see the
    // `del` that takes main out again; no event at all means no insertion.
    const events = [];
    other.app.src.source.subscribe('probe', {any: event => events.push(event.evt)});
    assert.throws(() => other.app.src.startSource(authored(root => root.div({_init: true}))),
        /div 'div_0': '_init' is allowed only on dataFormula, dataController and dataRpc/);
    assert.deepEqual(events, []);
    other.app.dispose();
});
