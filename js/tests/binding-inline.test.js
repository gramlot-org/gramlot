// Phase S09: inline code in the page runtime only, and the legacy macro preprocessor (source plan
// §4.10, §4.8 step 3; decisions Q11.1, Q11.2, D5, D6).
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {sourceTarget} from '@genrojs/builders';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {templateParameters} from '../src/renderer/attributes.js';

function page() {
    const document = new JSDOM('<main></main>').window.document;
    const app = new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport: false});
    return {app, data: app.data, byId: id => document.getElementById(id), compiler: app.binding.inlineCompiler};
}

/** Register `methods` as the page companion (the root logic group). */
function companion(app, methods) {
    const Logic = class {};
    for (const [name, method] of Object.entries(methods)) {
        Object.defineProperty(Logic.prototype, name, {value: method, writable: true, configurable: true});
    }
    app.logicRegistry.register(Logic, {group: null, resource: '/test_aux.js'});
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
        app.builder.root.dataFormula({result_path: 'r', formula: '(globalThis.inlineBodyRuns++, a * 2)', a: '^a',
            flag: '=flag', _if: 'flag', ...(withElse ? {_else: 'a * 3'} : {})});
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
        app.builder.root.dataController({script: 'this.SET("out", "body")', a: '^a', flag: '=flag', _if: 'flag',
            ...(withElse ? {_else: 'this.SET("out", "else")'} : {})});
        data.setItem('a', 1);
        assert.equal(data.getItem('out'), expected, `_if ${flag}, _else ${withElse}`);
        app.dispose();
    }
});

test('Q11.1: an error in _if propagates (P12); _if with func is an authoring error', () => {
    const {app, data} = page();
    app.builder.root.dataController({script: 'this.SET("out", 1)', a: '^a', _if: 'missing.value'});
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
    app.builder.root.dataFormula({result_path: 'r1', formula: 'a * 2', a: '^a', _if: ''});
    app.builder.root.dataFormula({result_path: 'r2', formula: 'a * 2', a: '^a', _if: false});
    app.builder.root.dataFormula({result_path: 'r3', formula: 'a * 2', a: '^a', _if: 'a > 10', _else: ''});
    app.builder.root.dataFormula({result_path: 'r4', formula: '', a: '^a'});
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
    app.builder.root.dataFormula({result_path: 'byName', func: 'total', a: '^a', b: '=b'});
    app.builder.root.dataFormula({result_path: 'inline', formula: '(globalThis.inlineKwargs = Object.keys(_kwargs), a + b)',
        a: '^a', b: '=b'});
    data.setItem('a', 1);
    assert.equal(data.getItem('byName'), 3);
    assert.equal(data.getItem('inline'), 3);
    assert.deepEqual(globalThis.inlineKwargs, seen[0]);
    delete globalThis.inlineKwargs;
    app.dispose();
});

test('inline parameters as legacy: $1 is _kwargs, then _node, _triggerpars, _reason and the attributes; this is the node', () => {
    const {app, data} = page();
    const node = sourceTarget(app.builder.root.dataController({
        script: 'this.SET("out", [$1 === _kwargs, this.label, _reason, _triggerpars.trigger_reason, _node.label, a, _kwargs["class"]])',
        a: '^a', class: 'k',
    }));
    data.setItem('a', 4);
    assert.deepEqual(data.getItem('out'), [true, node.label, 'node', 'node', 'a', 4, 'k']);
    app.dispose();
});

test('gate fix 1: _if has no _kwargs, as legacy ($1 is _node); a body and an _else body have _kwargs first', () => {
    const {app, data} = page();
    app.builder.root.dataController({script: 'this.SET("body", $1 === _kwargs)', a: '^a',
        _if: '(this.SET("condition", [$1.label, typeof _kwargs]), a > 1)', _else: 'this.SET("else", $1 === _kwargs)'});
    data.setItem('a', 2);
    assert.deepEqual(data.getItem('condition'), ['a', 'undefined']);
    assert.equal(data.getItem('body'), true);
    data.setItem('a', 0);
    assert.equal(data.getItem('else'), true);
    app.dispose();
});

test('gate fix 2: a compiled declaration is released when its attribute changes or is removed', () => {
    const {app, data, byId, compiler} = page();
    data.setItem('a', 1);
    const formula = sourceTarget(app.builder.root.dataFormula({result_path: 'r', formula: 'a', a: '^a', _if: 'a > 5',
        _else: '-a'}));
    const box = sourceTarget(app.builder.root.div({id: 'box', title: '==a * 2', a: '^a'}));
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
    data.setItem('a', 3);
    assert.equal(data.getItem('r'), 3);
    assert.equal(compiler.size, 2);
    app.dispose();
});

test('gate fix 3: a ${…} template inside a == attribute or node value is an explicit error naming it', () => {
    const {app, data} = page();
    data.setItem('price', 10);
    assert.throws(() => app.builder.root.div({a: '^price', total: '==${a} * 2'}),
        /div '.*': 'total' contains a \$\{…\} template, not accepted in a == expression/);
    const other = page();
    assert.throws(() => other.app.builder.root.div('==${a}', {a: 1}),
        /the == node value contains a \$\{…\} template/);
    app.dispose();
    other.app.dispose();
});

test('gate fix 5: one template rule for Builder templates, the == checks and the chain check: \\${ stays text', () => {
    assert.deepEqual(templateParameters('${a}px \\${b} ${c_1}'), ['a', 'c_1']);
    assert.deepEqual(templateParameters(3), []);
    const {app, data, byId} = page();
    data.setItem('price', 10);
    app.builder.root.div({id: 'box', a: '^price', title: '\\${a}px', total: '=="\\${x}" + a'});
    assert.equal(byId('box').getAttribute('title'), '${a}px');
    assert.equal(byId('box').getAttribute('total'), '${x}10');
    app.dispose();
});

test('this.SET(...) needs no preprocessor and gives no warning', () => {
    const {app, data, compiler} = page();
    const node = sourceTarget(app.builder.root.dataController({script: 'this.SET("x", a); this.PUT("y", GETTER)', a: '^a', GETTER: 1}));
    assert.deepEqual(warnings(() => data.setItem('a', 3)), []);
    assert.equal(data.getItem('x'), 3);
    assert.equal(data.getItem('y'), 1);
    assert.equal(compiler.preprocess(node, 'script', 'this.SET(".x", a)'), 'this.SET(".x", a)');
    app.dispose();
});

test('every legacy macro is translated as in gnrlang.js, targeting the node methods', () => {
    const {app, compiler} = page();
    const node = sourceTarget(app.builder.root.dataController({script: 'x'}));
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
    app.builder.root.div({datapath: 'ctx'}).dataController({script: 'SET .out = GET .a + $1.b; FIRE .done', b: '^b'});
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
        app.builder.root.dataController({script: 'this.SET("msg", "read GET .a")', b: '^b'});
        data.setItem('b', 1);
    });
    assert.equal(data.getItem('msg'), "read this.GET('.a')");
    app.dispose();
});

test('a text starting with function is the function itself, as legacy', () => {
    const {app, data} = page();
    app.builder.root.dataController({script: 'function(kwargs, node){ this.SET("out", [kwargs.b, node.label]); }', b: '^b'});
    data.setItem('b', 5);
    assert.deepEqual(data.getItem('out'), [5, 'b']);
    app.dispose();
});

test('invalid syntax: the error names the node and the attribute and quotes the preprocessed text', () => {
    const {app, data} = page();
    const node = sourceTarget(app.builder.root.dataController({script: 'SET .a = (1', b: '^b'}));
    let error = null;
    warnings(() => {
        try { data.setItem('b', 1); } catch (caught) { error = caught; }
    });
    assert.ok(error instanceof SyntaxError);
    assert.match(error.message, new RegExp(`^dataController '${node.label}' 'script': .* in the inline code:\\nthis\\.SET\\('\\.a', \\(1\\) $`));
    app.dispose();
});

test('one compilation per declaration; a new text compiles again; the removal releases the cache', () => {
    const {app, data, compiler} = page();
    data.setItem('prezzo', 1);
    let formula;
    const first = functionCalls(() => {
        formula = sourceTarget(app.builder.root.dataFormula({result_path: 'r', formula: 'a + 1', a: '^a'}));
        app.builder.root.div({id: 'price', title: '==prezzo * 2', prezzo: '^prezzo'});
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
        data.setItem('a', 3);
        data.setItem('a', 4);
    });
    assert.equal(second, 1);
    assert.equal(data.getItem('r'), 14);
    app.builder.source.popNode(formula.label);
    assert.equal(compiler.size, 1);
    app.dispose();
    assert.equal(compiler.size, 0);
});

test('Q11.2: an == attribute is computed from its pointers and recomputed when they change', () => {
    const {app, data, byId} = page();
    data.setItem('prezzo', 100);
    data.setItem('iva', 0.2);
    app.builder.root.div({id: 'box', title: '==prezzo * (1 + iva)', prezzo: '^prezzo', iva: '^iva'});
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
    app.builder.root.div('==n * 10', {id: 'box', x: '==1', y: '==typeof x', n: '^n'});
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
    app.builder.root.div({id: 'box', a: '^price', title: '${a}', total: '==a*2'});
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
    app.builder.root.div({id: 'box', a: '^price', title: '${a}px', total: '==title + a'});
    assert.equal(byId('box').getAttribute('total'), '10px10');
    app.dispose();
});

test('a template chain used by == is an error naming both attributes; a template using an == is an error', () => {
    const {app, data} = page();
    data.setItem('price', 10);
    assert.throws(() => app.builder.root.div({a: '^price', title: '${a}px', aria_label: '${title}', total: '==title + a'}),
        /'total' uses 'title', a template consumed by another template/);
    const other = page();
    assert.throws(() => other.app.builder.root.div({title: '${t}', t: '==1 + 1'}),
        /the template of 'title' uses 't', a == expression/);
    app.dispose();
    other.app.dispose();
});

test('an == expression in an SVG attribute is computed by the same point', () => {
    const {app, data, byId} = page();
    data.setItem('r', 4);
    app.builder.root.svg({width: 20, height: 20}).circle({id: 'dot', r: '==size / 2', size: '^r'});
    assert.equal(byId('dot').getAttribute('r'), '2');
    data.setItem('r', 10);
    assert.equal(byId('dot').getAttribute('r'), '5');
    app.dispose();
});

test('an == in an attribute of dataFormula or dataController is an error at installation; dataSetter stays literal', () => {
    const {app, data} = page();
    assert.throws(() => app.builder.root.dataFormula({result_path: 'r', formula: 'a', a: '==1'}),
        /dataFormula '.*': 'a' is a == expression, not accepted on dataFormula/);
    assert.throws(() => app.builder.root.dataController({script: 'x', b: '==2'}),
        /dataController '.*': 'b' is a == expression, not accepted on dataController/);
    app.builder.root.dataSetter({destination_path: 'literal', value: '==1'});
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
    for (const entry of ['adapters/index.js', 'adapters/host.js', 'adapters/page.js', 'builder/gramlot-builder.js']) {
        assert.equal(reaches(await inputs(entry)), false, entry);
    }
});

// Q3 under a real engine refusal: node started with --disallow-code-generation-from-strings refuses
// `new Function` with an EvalError, as a browser does under a CSP without 'unsafe-eval'.
const STRICT_PAGE = `
import {JSDOM} from 'jsdom';
import {Gramlot} from ${JSON.stringify(new URL('../src/index.js', import.meta.url).href)};
const document = new JSDOM('<main></main>').window.document;
const app = new Gramlot({document, pageId: 'strict', element: document.querySelector('main'), transport: false});
app.logicRegistry.register(class Logic { somma(kwargs) { return kwargs.a + kwargs.b; } }, {group: null, resource: '/strict_aux.js'});
const root = app.builder.root;
const failure = run => { try { run(); return null; } catch (error) {
    return {name: error.name, message: error.message, cause: error.cause?.name ?? null}; } };
root.dataFormula({result_path: 'named', func: 'somma', a: '^a', b: '^b'});
app.data.setItem('a', 1);
app.data.setItem('b', 2);
root.dataController({id: 'ctrl', script: 'this.SET("out", 1)', c: '^c'});
root.dataFormula({result_path: 'f', formula: 'a * 2', a: '^a2'});
root.button('go', {id: 'go', action: 'this.SET("out", 2)'});
root.span('x', {id: 'clicked', connect_onclick: 'this.SET("out", 3)'});
const result = {
    named: app.data.getItem('named'),
    script: failure(() => app.data.setItem('c', 1)),
    formula: failure(() => app.data.setItem('a2', 1)),
    expression: failure(() => root.div({title: '==a + 1', a: 1})),
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
process.stdout.write(JSON.stringify(result));
`;

test('Q3: inline code under a CSP without unsafe-eval raises an EvalError naming node and attribute; named logic runs', () => {
    const output = execFileSync(process.execPath, ['--disallow-code-generation-from-strings', '--input-type=module', '-e', STRICT_PAGE],
        {cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8'});
    const result = JSON.parse(output);
    assert.equal(result.named, 3);
    assert.equal(result.out, null);
    const hint = "inline code blocked by the Content Security Policy of the page \\(no 'unsafe-eval'\\); move the code to named "
        + "logic \\(a method of the page companion _aux\\.js\\) or serve the page with the permissive CSP profile, which allows 'unsafe-eval'$";
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
