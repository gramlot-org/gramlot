// Phase S09: inline code in the page runtime only, and the legacy macro preprocessor (source plan
// §4.10, §4.8 step 3; decisions Q11.1, Q11.2, D5, D6).
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {Bag} from '@genrojs/bag';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {GramlotBuilderBag} from '../src/builder/source.js';
import {templateParameters} from '../src/renderer/attributes.js';
import {mount} from './fixtures/mount.js';

function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport: false});
    return {app, data: app.data, byId: id => document.getElementById(id), compiler: app.src.binding.inlineCompiler};
}

/** Register `methods` as the page companion (the root logic group). */
function companion(app, methods) {
    const Logic = class {};
    for (const [name, method] of Object.entries(methods)) {
        Object.defineProperty(Logic.prototype, name, {value: method, writable: true, configurable: true});
    }
    app.src.logicRegistry.register(Logic, {group: null, resource: '/test_aux.js'});
}

/** The console.warn messages emitted during `run`. */
function warnings(run) {
    const original = console.warn;
    const messages = [];
    console.warn = message => messages.push(message);
    try { run(); } finally { console.warn = original; }
    return messages;
}

/** The calls of the Function constructor during `run`: the compiler's only string evaluation. */
function functionCalls(run) {
    const original = globalThis.Function;
    let calls = 0;
    globalThis.Function = new Proxy(original, {
        construct(target, args) { calls += 1; return Reflect.construct(target, args); },
        apply(target, self, args) { calls += 1; return Reflect.apply(target, self, args); },
    });
    try { run(); } finally { globalThis.Function = original; }
    return calls;
}

test('D5: a formula with a previous result, _if true/false x _else present/absent', () => {
    const cases = [
        [true, false, 10], [true, true, 10], [false, false, 7], [false, true, 15],
    ];
    for (const [flag, withElse, expected] of cases) {
        const {app, data} = page();
        data.setItem('r', 7);
        data.setItem('flag', flag);
        globalThis.inlineBodyRuns = 0;
        mount(app, root => root.dataFormula({result_path: 'r', formula: '(globalThis.inlineBodyRuns++, a * 2)', a: '^a',
            flag: '=flag', _if: 'flag', ...(withElse ? {_else: 'a * 3'} : {})}));
        data.setItem('a', 5);
        assert.equal(data.getItem('r'), expected, `_if ${flag}, _else ${withElse}`);
        assert.equal(globalThis.inlineBodyRuns, flag ? 1 : 0, 'the main body does not run when _if is false');
        app.dispose();
    }
    delete globalThis.inlineBodyRuns;
});

test('Q11.1: _if true and false, with and without _else, on dataController: _else is statements', () => {
    for (const [flag, withElse, expected] of [[true, false, 'body'], [true, true, 'body'], [false, false, null], [false, true, 'else']]) {
        const {app, data} = page();
        data.setItem('flag', flag);
        mount(app, root => root.dataController({script: 'this.SET("out", "body")', a: '^a', flag: '=flag', _if: 'flag',
            ...(withElse ? {_else: 'this.SET("out", "else")'} : {})}));
        data.setItem('a', 1);
        assert.equal(data.getItem('out'), expected, `_if ${flag}, _else ${withElse}`);
        app.dispose();
    }
});

test('Q11.1: an error in _if propagates (P12); _if with func is an authoring error', () => {
    const {app, data} = page();
    mount(app, root => root.dataController({script: 'this.SET("out", 1)', a: '^a', _if: 'missing.value'}));
    assert.throws(() => data.setItem('a', 1), ReferenceError);
    assert.equal(data.getItem('out'), null);
    assert.throws(() => new GramlotBuilder().root.dataController({func: 'go', _if: 'a > 1'}),
        /dataController: '_if' is inline and cannot be declared with 'func'/);
    assert.throws(() => new GramlotBuilder().root.dataFormula({result_path: 'r', func: 'go', _if: 'a > 1'}),
        /dataFormula: '_if' is inline and cannot be declared with 'func'/);
    app.dispose();
});

test('legacy truthiness: an empty _if is absent, an empty _else stops, an empty formula writes the Bag of its arguments', () => {
    const {app, data} = page();
    data.setItem('r1', 7);
    mount(app, root => {
        root.dataFormula({result_path: 'r1', formula: 'a * 2', a: '^a', _if: ''});
        root.dataFormula({result_path: 'r2', formula: 'a * 2', a: '^a', _if: false});
        root.dataFormula({result_path: 'r3', formula: 'a * 2', a: '^a', _if: 'a > 10', _else: ''});
        root.dataFormula({result_path: 'r4', formula: '', a: '^a'});
    });
    data.setItem('r3', 7);
    data.setItem('a', 5);
    assert.equal(data.getItem('r1'), 10);
    assert.equal(data.getItem('r2'), 10);
    assert.equal(data.getItem('r3'), 7);
    assert.equal(data.getItem('r4.a'), 5);
    app.dispose();
});

test('parity name/inline: the same formula by name and inline gives the same result and the same kwargs', () => {
    const {app, data} = page();
    const seen = [];
    companion(app, {total(kwargs) { seen.push(Object.keys(kwargs)); return kwargs.a + kwargs.b; }});
    data.setItem('b', 2);
    mount(app, root => {
        root.dataFormula({result_path: 'byName', func: 'total', a: '^a', b: '=b'});
        root.dataFormula({result_path: 'inline', formula: '(globalThis.inlineKwargs = Object.keys(_kwargs), a + b)',
            a: '^a', b: '=b'});
    });
    data.setItem('a', 1);
    assert.equal(data.getItem('byName'), 3);
    assert.equal(data.getItem('inline'), 3);
    assert.deepEqual(globalThis.inlineKwargs, seen[0]);
    delete globalThis.inlineKwargs;
    app.dispose();
});

test('inline parameters as legacy: $1 is _kwargs, then _node, _triggerpars, _reason and the attributes; this is the node', () => {
    const {app, data} = page();
    const node = sourceTarget(mount(app, root => root.dataController({
        script: 'this.SET("out", [$1 === _kwargs, this.label, _reason, _triggerpars.trigger_reason, _node.label, a, _kwargs["class"]])',
        a: '^a', class: 'k',
    })));
    data.setItem('a', 4);
    assert.deepEqual(data.getItem('out'), [true, node.label, 'node', 'node', 'a', 4, 'k']);
    app.dispose();
});

test('gate fix 1: _if has no _kwargs, as legacy ($1 is _node); a body and an _else body have _kwargs first', () => {
    const {app, data} = page();
    mount(app, root => root.dataController({script: 'this.SET("body", $1 === _kwargs)', a: '^a',
        _if: '(this.SET("condition", [$1.label, typeof _kwargs]), a > 1)', _else: 'this.SET("else", $1 === _kwargs)'}));
    data.setItem('a', 2);
    assert.deepEqual(data.getItem('condition'), ['a', 'undefined']);
    assert.equal(data.getItem('body'), true);
    data.setItem('a', 0);
    assert.equal(data.getItem('else'), true);
    app.dispose();
});

test('gate fix 2: a compiled declaration is released when its attribute changes or is removed; a changed text is not run', () => {
    const {app, data, byId, compiler} = page();
    data.setItem('a', 1);
    const [formula, box] = mount(app, root => [
        sourceTarget(root.dataFormula({result_path: 'r', formula: 'a', a: '^a', _if: 'a > 5', _else: '-a'})),
        sourceTarget(root.div({id: 'box', title: '==a * 2', a: '^a'})),
    ]);
    data.setItem('a', 2);
    assert.equal(data.getItem('r'), -2);
    assert.equal(compiler.size, 3, '_if, _else and the title');
    formula.setAttr({_else: null});
    assert.equal(compiler.size, 2, 'the removed _else is released');
    formula.setAttr({_if: 'a > 0'});
    assert.equal(compiler.size, 1, 'the changed _if is released until its next invocation');
    box.setAttr({title: 'plain'});
    assert.equal(byId('box').getAttribute('title'), 'plain');
    assert.equal(compiler.size, 0, 'the title that is no longer == is released');
    assert.throws(() => data.setItem('a', 3),
        new RegExp(`^Error: dataFormula '${formula.label}' '_if': inline code runs only as received with the Source`));
    assert.equal(data.getItem('r'), -2);
    assert.equal(compiler.size, 0);
    app.dispose();
});

test('gate fix 3: a ${…} template inside a == attribute or node value is an explicit error naming it', () => {
    const {app, data} = page();
    data.setItem('price', 10);
    assert.throws(() => app.src.builder.root.div({a: '^price', total: '==${a} * 2'}),
        /div '.*': 'total' contains a \$\{…\} template, not accepted in a == expression/);
    const other = page();
    assert.throws(() => other.app.src.builder.root.div('==${a}', {a: 1}),
        /the == node value contains a \$\{…\} template/);
    app.dispose();
    other.app.dispose();
});

test('gate fix 5: one template rule for Builder templates, the == checks and the chain check: \\${ stays text', () => {
    assert.deepEqual(templateParameters('${a}px \\${b} ${c_1}'), ['a', 'c_1']);
    assert.deepEqual(templateParameters(3), []);
    const {app, data, byId} = page();
    data.setItem('price', 10);
    mount(app, root => root.div({id: 'box', a: '^price', title: '\\${a}px', total: '=="\\${x}" + a'}));
    assert.equal(byId('box').getAttribute('title'), '${a}px');
    assert.equal(byId('box').getAttribute('total'), '${x}10');
    app.dispose();
});

test('this.SET(...) needs no preprocessor and gives no warning', () => {
    const {app, data, compiler} = page();
    const node = sourceTarget(mount(app, root => root.dataController({script: 'this.SET("x", a); this.PUT("y", GETTER)', a: '^a', GETTER: 1})));
    assert.deepEqual(warnings(() => data.setItem('a', 3)), []);
    assert.equal(data.getItem('x'), 3);
    assert.equal(data.getItem('y'), 1);
    assert.equal(compiler.preprocess(node, 'script', 'this.SET(".x", a)'), 'this.SET(".x", a)');
    app.dispose();
});

test('every legacy macro is translated as in gnrlang.js, targeting the node methods', () => {
    const {app, compiler} = page();
    const node = sourceTarget(app.src.builder.root.dataController({script: 'x'}));
    const cases = [
        ['GET .a', "this.GET('.a')"],
        ['var v = GET ^.a.b;', "var v = this.GET('^.a.b');"],
        ['SET .a = v + 1;', "this.SET('.a', v + 1); "],
        ['x();SET .a=1', "x(); this.SET('.a', 1) "],
        ['PUT #form.a = 2', "this.PUT('#form.a', 2) "],
        ['FIRE .go = "yes";', "this.FIRE('.go', \"yes\"); "],
        ['FIRE .go', "this.FIRE('.go') "],
        ['FIRE_AFTER .go = 5', "this.FIRE_AFTER('.go', 5) "],
        ['FIRE_AFTER .go;', "this.FIRE_AFTER('.go'); "],
        ['SET .a = $1.b', "this.SET('.a', arguments[0].b) "],
        ['  return $2  ', 'return arguments[1]'],
    ];
    warnings(() => {
        for (const [source, expected] of cases) assert.equal(compiler.preprocess(node, 'script', source), expected, source);
    });
    assert.throws(() => compiler.preprocess(node, 'script', 'PUBLISH topic = 1'), /the PUBLISH macro is excluded from Gramlot 0\.2\.0/);
    app.dispose();
});

test('the macros run through the node methods, with one deprecation warning per declaration', () => {
    const {app, data} = page();
    data.setItem('ctx.a', 2);
    mount(app, root => root.div({datapath: 'ctx'}).dataController({script: 'SET .out = GET .a + $1.b; FIRE .done', b: '^b'}));
    const fired = [];
    data.subscribe('fired', {any: event => { if (event.node.label === 'done') fired.push(event.node.value); }});
    const messages = warnings(() => {
        data.setItem('b', 3);
        data.setItem('b', 4);
    });
    assert.equal(data.getItem('ctx.out'), 6);
    assert.equal(fired.filter(value => value === true).length, 2);
    assert.equal(messages.length, 1);
    assert.match(messages[0], /dataController '.*' 'script': legacy macros are deprecated; write this\.GET\(path\)/);
    app.dispose();
});

test('a macro inside a string is translated, as legacy', () => {
    const {app, data} = page();
    warnings(() => {
        mount(app, root => root.dataController({script: 'this.SET("msg", "read GET .a")', b: '^b'}));
        data.setItem('b', 1);
    });
    assert.equal(data.getItem('msg'), "read this.GET('.a')");
    app.dispose();
});

test('a text starting with function is the function itself, as legacy', () => {
    const {app, data} = page();
    mount(app, root => root.dataController({script: 'function(kwargs, node){ this.SET("out", [kwargs.b, node.label]); }', b: '^b'}));
    data.setItem('b', 5);
    assert.deepEqual(data.getItem('out'), [5, 'b']);
    app.dispose();
});

test('invalid syntax: the error names the node and the attribute and quotes the preprocessed text', () => {
    const {app, data} = page();
    const node = sourceTarget(mount(app, root => root.dataController({script: 'SET .a = (1', b: '^b'})));
    let error = null;
    warnings(() => {
        try { data.setItem('b', 1); } catch (caught) { error = caught; }
    });
    assert.ok(error instanceof SyntaxError);
    assert.match(error.message, new RegExp(`^dataController '${node.label}' 'script': .* in the inline code:\\nthis\\.SET\\('\\.a', \\(1\\) $`));
    app.dispose();
});

test('one compilation per declaration; a new text is not compiled; the removal releases the cache', () => {
    const {app, data, compiler} = page();
    data.setItem('prezzo', 1);
    let formula;
    const first = functionCalls(() => {
        formula = sourceTarget(mount(app, root => {
            root.div({id: 'price', title: '==prezzo * 2', prezzo: '^prezzo'});
            return root.dataFormula({result_path: 'r', formula: 'a + 1', a: '^a'});
        }));
        data.setItem('a', 1);
        data.setItem('a', 2);
        data.setItem('prezzo', 2);
        data.setItem('prezzo', 3);
    });
    assert.equal(first, 2);
    assert.equal(data.getItem('r'), 3);
    assert.equal(compiler.size, 2);
    const second = functionCalls(() => {
        formula.setAttr({formula: 'a + 10'});
        assert.throws(() => data.setItem('a', 3), /dataFormula '.*' 'formula': inline code runs only as received with the Source/);
    });
    assert.equal(second, 0);
    assert.equal(data.getItem('r'), 3);
    app.src.source.getItem('main').popNode(formula.label);
    assert.equal(compiler.size, 1);
    app.dispose();
    assert.equal(compiler.size, 0);
});

test('Q11.2: an == attribute is computed from its pointers and recomputed when they change', () => {
    const {app, data, byId} = page();
    data.setItem('prezzo', 100);
    data.setItem('iva', 0.2);
    mount(app, root => root.div({id: 'box', title: '==prezzo * (1 + iva)', prezzo: '^prezzo', iva: '^iva'}));
    assert.equal(byId('box').getAttribute('title'), '120');
    data.setItem('prezzo', 200);
    assert.equal(byId('box').getAttribute('title'), '240');
    data.setItem('iva', 0.5);
    assert.equal(byId('box').getAttribute('title'), '300');
    app.dispose();
});

test('Q11.2: an == does not see the other ==; an == node value is the element text', () => {
    const {app, data, byId} = page();
    data.setItem('n', 2);
    mount(app, root => root.div('==n * 10', {id: 'box', x: '==1', y: '==typeof x', n: '^n'}));
    assert.equal(byId('box').getAttribute('x'), '1');
    assert.equal(byId('box').getAttribute('y'), 'undefined');
    assert.equal(byId('box').textContent, '20');
    data.setItem('n', 3);
    assert.equal(byId('box').textContent, '30');
    app.dispose();
});

test('D6: a template-consumed pointer is an argument of ==, read from Data, and never reaches the DOM', () => {
    const {app, data, byId} = page();
    data.setItem('price', 10);
    mount(app, root => root.div({id: 'box', a: '^price', title: '${a}', total: '==a*2'}));
    assert.equal(byId('box').getAttribute('title'), '10');
    assert.equal(byId('box').getAttribute('total'), '20');
    assert.equal(byId('box').hasAttribute('a'), false);
    data.setItem('price', 11);
    assert.equal(byId('box').getAttribute('total'), '22');
    app.dispose();
});

test('revision 10: the expanded template and the consumed parameter are both available to ==', () => {
    const {app, data, byId} = page();
    data.setItem('price', 10);
    mount(app, root => root.div({id: 'box', a: '^price', title: '${a}px', total: '==title + a'}));
    assert.equal(byId('box').getAttribute('total'), '10px10');
    app.dispose();
});

test('a template chain used by == is an error naming both attributes; a template using an == is an error', () => {
    const {app, data} = page();
    data.setItem('price', 10);
    assert.throws(() => mount(app, root => root.div({a: '^price', title: '${a}px', aria_label: '${title}', total: '==title + a'})),
        /'total' uses 'title', a template consumed by another template/);
    const other = page();
    assert.throws(() => other.app.src.builder.root.div({title: '${t}', t: '==1 + 1'}),
        /the template of 'title' uses 't', a == expression/);
    app.dispose();
    other.app.dispose();
});

test('an == expression in an SVG attribute is computed by the same point', () => {
    const {app, data, byId} = page();
    data.setItem('r', 4);
    mount(app, root => root.svg({width: 20, height: 20}).circle({id: 'dot', r: '==size / 2', size: '^r'}));
    assert.equal(byId('dot').getAttribute('r'), '2');
    data.setItem('r', 10);
    assert.equal(byId('dot').getAttribute('r'), '5');
    app.dispose();
});

test('an == in an attribute of dataFormula or dataController is an error at installation; dataSetter stays literal', () => {
    const {app, data} = page();
    assert.throws(() => app.src.builder.root.dataFormula({result_path: 'r', formula: 'a', a: '==1'}),
        /dataFormula '.*': 'a' is a == expression, not accepted on dataFormula/);
    assert.throws(() => app.src.builder.root.dataController({script: 'x', b: '==2'}),
        /dataController '.*': 'b' is a == expression, not accepted on dataController/);
    app.src.builder.root.dataSetter({destination_path: 'literal', value: '==1'});
    assert.equal(data.getItem('literal'), '==1');
    app.dispose();
});

test('the string renderer has no page runtime and writes no == attribute or value, as the Python one', () => {
    const builder = new GramlotBuilder();
    builder.root.div('==1 + 1', {title: '==2', alt: 'x'});
    assert.equal(builder.renderer_html.render(builder.source.getNodes()[0]), '<div alt="x"></div>');
    builder.root.div({title: '${t}', t: '==1 + 1'});
    assert.throws(() => builder.renderer_html.render(builder.source.getNodes()[1]),
        /the template of 'title' uses 't', a == expression/);
});

test('import graph: inline.js is reachable from the page runtime only', async () => {
    const source = fileURLToPath(new URL('../src/', import.meta.url));
    const inputs = async entry => Object.keys((await build({entryPoints: [join(source, entry)], bundle: true, write: false,
        platform: 'browser', format: 'esm', packages: 'external', metafile: true, logLevel: 'silent'})).metafile.inputs);
    const reaches = keys => keys.some(key => key.endsWith('src/binding/inline.js'));
    assert.ok(reaches(await inputs('index.js')));
    assert.ok(reaches(await inputs('gramlot.js')));
    for (const entry of ['server/index.js', 'server/gramlot-server.js', 'server/page.js', 'builder/gramlot-builder.js']) {
        assert.equal(reaches(await inputs(entry)), false, entry);
    }
});

// Q3 under a real engine refusal: node started with --disallow-code-generation-from-strings refuses
// `new Function` with an EvalError, as a browser does under a CSP without 'unsafe-eval'.
const STRICT_PAGE = `
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from ${JSON.stringify(new URL('../src/index.js', import.meta.url).href)};
const document = new JSDOM('<main></main><section></section>').window.document;
const app = new Gramlot({document, pageId: 'strict', element: document.querySelector('main'), transport: false});
app.src.logicRegistry.register(class Logic { somma(kwargs) { return kwargs.a + kwargs.b; } }, {group: null, resource: '/strict_aux.js'});
const builder = new GramlotBuilder();
const root = builder.root;
const failure = run => { try { run(); return null; } catch (error) {
    return {name: error.name, message: error.message, cause: error.cause?.name ?? null}; } };
root.dataFormula({result_path: 'named', func: 'somma', a: '^a', b: '^b'});
root.dataController({id: 'ctrl', script: 'this.SET("out", 1)', c: '^c'});
root.dataFormula({result_path: 'f', formula: 'a * 2', a: '^a2'});
root.button('go', {id: 'go', action: 'this.SET("out", 2)'});
root.span('x', {id: 'clicked', connect_onclick: 'this.SET("out", 3)'});
app.src.startSource(builder.source);
app.data.setItem('a', 1);
app.data.setItem('b', 2);
// An == is evaluated when its node is rendered: the mount of a second page with one raises.
const other = new Gramlot({document, pageId: 'strict-expression', element: document.querySelector('section'), transport: false});
const expression = new GramlotBuilder();
expression.root.div({title: '==a + 1', a: 1});
const result = {
    named: app.data.getItem('named'),
    script: failure(() => app.data.setItem('c', 1)),
    formula: failure(() => app.data.setItem('a2', 1)),
    expression: failure(() => other.src.startSource(expression.source)),
    out: null,
};
// A listener's error goes to the window error event, not to the caller of click().
const reported = [];
document.defaultView.addEventListener('error', event => { event.preventDefault(); reported.push(event.error); });
for (const [key, id] of [['action', 'go'], ['event', 'clicked']]) {
    result[key] = failure(() => document.getElementById(id).click());
    const error = reported.shift();
    result[key + 'Reported'] = error ? {name: error.name, message: error.message, cause: error.cause?.name ?? null} : null;
}
result.out = app.data.getItem('out');
app.dispose();
other.dispose();
process.stdout.write(JSON.stringify(result));
`;

test('Q3: inline code under a CSP without unsafe-eval raises an EvalError naming node and attribute; named logic runs', () => {
    const output = execFileSync(process.execPath, ['--disallow-code-generation-from-strings', '--input-type=module', '-e', STRICT_PAGE],
        {cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8'});
    const result = JSON.parse(output);
    assert.equal(result.named, 3);
    assert.equal(result.out, null);
    const hint = "inline code blocked by the Content Security Policy of the page \\(no 'unsafe-eval'\\); move the code to named "
        + "logic \\(a method of the page's class Logic\\) or serve the page with the permissive CSP profile, which allows 'unsafe-eval'$";
    assert.equal(result.action, null);
    assert.equal(result.event, null);
    for (const [key, target] of [['script', "dataController '.+' 'script'"], ['formula', "dataFormula '.+' 'formula'"],
        ['expression', "div '.+' 'title'"], ['actionReported', "button '.+' 'action'"],
        ['eventReported', "span '.+' 'connect_onclick'"]]) {
        assert.equal(result[key].name, 'EvalError', key);
        assert.equal(result[key].cause, 'EvalError', key);
        assert.match(result[key].message, new RegExp(`^${target}: ${hint}`), key);
    }
});

// The inline code runs only as received with the Source (SourceHandler.prepareSource): the TYTX wire, a
// GramlotBuilderBag given to startSource, or a remote Source. A text written later is not run.
const REFUSED = "inline code runs only as received with the Source \\(main or a remote Source\\); a text written later "
    + 'is not run: use named logic$';

/** The Source of every inline declaration: formula, script, `_if`/`_else`, `==` attribute and value, action, connect_on. */
function inlineSource(root) {
    root.dataFormula({result_path: 'f', formula: 'a * 2', a: '^a', _if: 'a > 0', _else: '-1'});
    root.dataController({script: 'this.SET("s", a + 1)', a: '^a'});
    root.div('==a * 10', {id: 'expr', title: '==a + 100', a: '^a'});
    root.button('go', {id: 'go', action: 'this.SET("clicked", "action")'});
    root.span('x', {id: 'span', connect_onclick: 'this.SET("connected", event.type)'});
}

/** The effects of inlineSource after a = 3 and a click on each element. */
function inlineEffects({data, byId}) {
    data.setItem('a', 3);
    byId('go').click();
    byId('span').click();
    return [data.getItem('f'), data.getItem('s'), byId('expr').textContent, byId('expr').getAttribute('title'),
        data.getItem('clicked'), data.getItem('connected')];
}

test('a Source from the TYTX wire runs its inline code: formula, script, _if/_else, ==, action, connect_on', () => {
    const {app, data, byId} = page();
    const builder = new GramlotBuilder();
    inlineSource(builder.root);
    app.src.startSource(builder.toTytx());
    assert.deepEqual(inlineEffects({data, byId}), [6, 4, '30', '103', 'action', 'click']);
    data.setItem('a', -1);
    assert.equal(data.getItem('f'), -1, '_else');
    app.dispose();
});

test('a GramlotBuilderBag given to startSource runs its inline code', () => {
    const {app, data, byId} = page();
    const builder = new GramlotBuilder();
    inlineSource(builder.root);
    assert.ok(builder.source instanceof GramlotBuilderBag);
    app.src.startSource(builder.source);
    assert.deepEqual(inlineEffects({data, byId}), [6, 4, '30', '103', 'action', 'click']);
    app.dispose();
});

test('a remote Source runs its inline code; a node of a remote Source keeps its own text', async () => {
    const remote = new GramlotBuilder();
    remote.root.dataFormula({result_path: 'remote', formula: 'b + 1', b: '^b'});
    const wire = remote.toTytx();
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, pageId: 'remote', element: document.querySelector('main'),
        transport: {source: async () => wire}});
    const target = sourceTarget(mount(app, root => root.div({id: 'target'})));
    assert.equal(await app.src.remoteSource(target, 'details'), true);
    app.data.setItem('b', 1);
    assert.equal(app.data.getItem('remote'), 2);
    app.dispose();
});

test('inline code written in the live Source after the start is not run, naming node and attribute', () => {
    const {app, data} = page();
    mount(app, root => root.div({id: 'pane'}));
    const main = app.src.source.getItem('main');
    const later = new GramlotBuilder();
    const formula = sourceTarget(later.root.dataFormula({result_path: 'f', formula: 'a * 2', a: '^a'}));
    main.setItem('late', later.source);
    assert.throws(() => data.setItem('a', 1), new RegExp(`^Error: dataFormula '${formula.label}' 'formula': ${REFUSED}`));
    assert.equal(data.getItem('f'), null);
    assert.throws(() => app.src.builder.root.div({id: 'expr', title: '==1 + 1'}), new RegExp(`'title': ${REFUSED}`));
    app.dispose();
});

test('a GramlotBuilderBag arrived inside Data is not activated: inserted in the Source, its inline code is not run', () => {
    const {app, data} = page();
    mount(app, root => root.div({id: 'pane'}));
    const carried = new GramlotBuilder();
    carried.root.dataController({script: 'globalThis.inlineFromData = true', c: '^c'});
    const payload = new Bag();
    payload.setItem('branch', carried.source);
    const received = Bag.fromTytx(payload.toTytx());
    const branch = received.getItem('branch');
    assert.ok(branch instanceof GramlotBuilderBag, 'the TYTX decoding gives the Source class back');
    app.src.source.getItem('main').setItem('fromData', branch.bindBuilder(app.src.builder));
    assert.throws(() => data.setItem('c', 1), new RegExp(`'script': ${REFUSED}`));
    assert.equal(globalThis.inlineFromData, undefined);
    app.dispose();
});

test('a Data Bag with code-named attributes is never compiled', () => {
    const {app, data} = page();
    mount(app, root => root.div({id: 'pane', title: '^d'}));
    const payload = new Bag();
    payload.setItem('d', 'text', {formula: 'globalThis.inlineFromData = 1', script: 'globalThis.inlineFromData = 2',
        action: 'globalThis.inlineFromData = 3', connect_onclick: 'globalThis.inlineFromData = 4', title: '==globalThis.inlineFromData = 5'});
    const received = Bag.fromTytx(payload.toTytx()).getNode('d');
    const calls = functionCalls(() => {
        data.setItem('d', received.value, received.getAttr());
        data.setItem('d', 'changed');
    });
    assert.equal(calls, 0);
    assert.equal(globalThis.inlineFromData, undefined);
    app.dispose();
});

test('a code attribute holding a ^/= pointer is an error at the reception, before any effect', () => {
    const cases = [
        ['formula', root => root.dataFormula({result_path: 'f', formula: '^code'})],
        ['script', root => root.dataController({script: '=code'})],
        ['_if', root => root.dataController({script: 'void 0', _if: '^code'})],
        ['_else', root => root.dataFormula({result_path: 'f', formula: '1', _if: 'false', _else: '^code'})],
        ['action', root => root.button('go', {action: '^code'})],
        ['connect_onclick', root => root.span('x', {connect_onclick: '^code'})],
    ];
    for (const [attr, build] of cases) {
        for (const received of [builder => builder.source, builder => builder.toTytx()]) {
            const {app, byId} = page();
            const builder = new GramlotBuilder();
            builder.root.div({id: 'before'});
            build(builder.root);
            assert.throws(() => app.src.startSource(received(builder)),
                new RegExp(`^Error: \\w+ '.+': '${attr}' is inline code and cannot be the pointer '[\\^=]code'; inline code is never read from Data$`),
                attr);
            assert.equal(app.state, 'failed');
            assert.equal(app.src.source.getItem('main'), null, attr);
            assert.equal(byId('before'), null, attr);
            app.dispose();
        }
    }
    // `action` is inline code of a button only: the action of a form stays an ordinary attribute.
    const {app} = page();
    mount(app, root => root.form({action: '^url'}));
    app.dispose();
});

test('an on<event> attribute is an error naming node and attribute, pointing to connect_on<event>', () => {
    const {app, data} = page();
    data.setItem('code', 'globalThis.inlineFromData = 1');
    assert.throws(() => mount(app, root => root.button('b', {id: 'b', onclick: '^code'})),
        /^Error: button '.+': 'onclick' has the form of a native event handler, run by the browser outside Gramlot; write connect_onclick for an event, or rename the attribute$/);
    const other = page();
    assert.throws(() => mount(other.app, root => root.div({html_onMouseOver: 'x()'})), /'html_onMouseOver' has the form of a native event handler/);
    const svg = page();
    assert.throws(() => mount(svg.app, root => root.svg({width: 1}).circle({r: 1, onload: 'x()'})), /circle '.+': 'onload' has the form/);
    const string = new GramlotBuilder();
    string.root.div({onclick: 'x()'});
    assert.throws(() => string.renderer_html.render(string.source.getNodes()[0]), /div '.+': 'onclick' has the form of a native event handler/);
    // An attribute named `on`, a connect_on<event> and a dataController are not native handlers.
    const plain = page();
    mount(plain.app, root => root.input({id: 'i', on: '^flag', connect_onclick: 'void 0'}));
    plain.data.setItem('flag', true);
    assert.equal(plain.byId('i').getAttribute('on'), 'true');
    assert.equal(globalThis.inlineFromData, undefined);
    for (const page of [app, other.app, svg.app, plain.app]) page.dispose();
});

test('a javascript: URL in href, src, formaction or xlink:href is an error, written or from Data', () => {
    const {app, data, byId} = page();
    data.setItem('url', 'https://example.org/');
    const link = sourceTarget(mount(app, root => root.a('x', {id: 'link', href: '^url'})));
    assert.equal(byId('link').getAttribute('href'), 'https://example.org/');
    for (const url of ['javascript:alert(1)', ' JavaScript:alert(1)', 'java\tscr\nipt:alert(1)', '\u0001javascript:void 0']) {
        assert.throws(() => data.setItem('url', url),
            new RegExp(`^Error: a '${link.label}': 'href' holds a javascript: URL, run by the browser as code; write connect_onclick or the action of a button instead$`),
            JSON.stringify(url));
    }
    for (const [attr, build] of [
        ['src', root => root.iframe({src: 'javascript:alert(1)'})],
        ['formaction', root => root.button('b', {formaction: 'javascript:alert(1)'})],
        ['href', root => root.svg({width: 1}).a({href: 'javascript:alert(1)'})],
        ['xlink_href', root => root.svg({width: 1}).a({xlink_href: 'javascript:alert(1)'})],
    ]) {
        const other = page();
        assert.throws(() => mount(other.app, build), new RegExp(`'${attr}' holds a javascript: URL`), attr);
        other.app.dispose();
    }
    const string = new GramlotBuilder();
    string.root.a('x', {href: 'javascript:alert(1)'});
    assert.throws(() => string.renderer_html.render(string.source.getNodes()[0]), /'href' holds a javascript: URL/);
    app.dispose();
});
