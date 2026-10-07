// Phase S07: named logic, LogicRegistry and LogicGroup (decisions P20, P21; source plan §4.9).
// The page bootstrap that registers the logic files is in bootstrap.test.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {LogicGroup, LogicRegistry} from '../src/binding/logic.js';

function page() {
    const document = new JSDOM('<main id="gramlot-root"></main>').window.document;
    return new Gramlot({document, pageId: 'test', element: document.querySelector('main'), transport: false});
}

/** A data-element node that names `func`, in the object form (genropy/genro-builders-js#15). */
function formula(func) {
    return new GramlotBuilder().root.dataFormula({result_path: 'x', func});
}

test('methods of Logic.prototype are copied into the group; the constructor never runs', () => {
    const app = page();
    let constructed = 0;
    class Logic {
        somma(kwargs) { return kwargs.a + kwargs.b; }
        static helper() { constructed++; }
    }
    app.src.logicRegistry.register(Logic, {group: null, resource: '/calcolo_aux.js'});
    assert.deepEqual(Object.keys(app.logic), ['somma']);
    assert.equal(app.logic.somma, Logic.prototype.somma);
    assert.equal(app.logic.somma({a: 1, b: 2}), 3);
    assert.equal(constructed, 0);
    app.dispose();
});

test('resolve gives {group, method}; this is the group and this.page the page; a group calls another', () => {
    const app = page();
    app.src.logicRegistry.register(class Logic {
        calcolaSconto(kwargs) { return Math.round(kwargs.prezzo * 0.9 * 100) / 100; }
    }, {group: 'business', resource: '/business.js'});
    app.src.logicRegistry.register(class Logic {
        scroll(node, kwargs) { return {self: this, page: this.page, node, kwargs}; }
        prezzo(node, kwargs) { return this.page.logic.business.calcolaSconto(kwargs); }
    }, {group: 'gui', resource: '/gui.js'});
    app.src.logicRegistry.register(class Logic {
        azzera(node, kwargs) { return this.page.logic.gui.scroll(node, kwargs); }
    }, {group: null, resource: '/calcolo_aux.js'});
    const node = formula('gui.scroll');
    const {group, method} = app.src.logicRegistry.resolve('gui.scroll', node);
    assert.ok(group instanceof LogicGroup);
    assert.equal(group, app.logic.gui);
    const result = method.call(group, node, {x: 1});
    assert.equal(result.self, app.logic.gui);
    assert.equal(result.page, app);
    assert.equal(result.node, node);
    const business = app.src.logicRegistry.resolve('business.calcolaSconto', node);
    assert.equal(business.method.call(business.group, {prezzo: 10}), 9);
    const gui = app.src.logicRegistry.resolve('gui.prezzo', node);
    assert.equal(gui.method.call(gui.group, node, {prezzo: 20}), 18);
    const root = app.src.logicRegistry.resolve('azzera', node);
    assert.equal(root.group, app.logic);
    assert.equal(root.method.call(root.group, node, {}).self, app.logic.gui);
    app.dispose();
});

test('a name with / is a nested group, and a/b creates the group a as well', () => {
    const app = page();
    app.src.logicRegistry.register(class Logic { load() { return this.page; } },
        {group: 'gnrcomponents/settingmanager', resource: '/gnrcomponents/settingmanager.js'});
    assert.ok(app.logic.gnrcomponents instanceof LogicGroup);
    assert.ok(app.logic.gnrcomponents.settingmanager instanceof LogicGroup);
    assert.equal(app.logic.gnrcomponents.page, app);
    const {group, method} = app.src.logicRegistry.resolve('gnrcomponents.settingmanager.load', formula('x'));
    assert.equal(group, app.logic.gnrcomponents.settingmanager);
    assert.equal(method.call(group), app);
    app.src.logicRegistry.register(class Logic { other() { return 1; } }, {group: 'gnrcomponents', resource: '/gnrcomponents.js'});
    assert.deepEqual(Object.keys(app.logic.gnrcomponents), ['settingmanager', 'other']);
    app.dispose();
});

test('the same method name in the same group: the last registration wins', () => {
    const app = page();
    app.src.logicRegistry.register(class Logic { calc() { return 'first'; } keep() { return 'kept'; } },
        {group: 'calcoli', resource: '/calcoli.js'});
    app.src.logicRegistry.register(class Logic { calc() { return 'second'; } }, {group: 'calcoli', resource: '/calcoli_extra.js'});
    assert.equal(app.logic.calcoli.calc(), 'second');
    assert.equal(app.logic.calcoli.keep(), 'kept');
    app.dispose();
});

test('a missing name is an error naming the node and the resource, never an inline fallback', () => {
    const app = page();
    app.src.logicRegistry.register(class Logic { somma() {} }, {group: null, resource: '/calcolo_aux.js'});
    app.src.logicRegistry.register(class Logic { scroll() {} }, {group: 'gui', resource: '/gui.js'});
    const node = formula('gui.missing');
    assert.throws(() => app.src.logicRegistry.resolve('gui.missing', node),
        /^Error: dataFormula 'dataFormula_0': named logic 'gui.missing' not found: the group 'gui' has no method 'missing' \(resources: \/gui\.js\)$/);
    assert.throws(() => app.src.logicRegistry.resolve('business.calcolaSconto', node),
        /dataFormula 'dataFormula_0': named logic 'business.calcolaSconto' not found: no resource was registered for the group 'business'/);
    assert.throws(() => app.src.logicRegistry.resolve('sottrai', node),
        /named logic 'sottrai' not found: the page logic has no method 'sottrai' \(resources: \/calcolo_aux\.js\)/);
    assert.throws(() => app.src.logicRegistry.resolve('somma.x', node), /no resource was registered for the group 'somma'/);
    assert.throws(() => app.src.logicRegistry.resolve('return a + b', node), /not found/);
    assert.throws(() => page().src.logicRegistry.resolve('somma', node), /resources: none/);
    app.dispose();
});

test('the §4.9 rules: constructor, page, child group names, accessors, symbols, extends, no class', () => {
    const cases = [
        [class Logic { constructor() { this.x = 1; } run() {} }, null, /cannot declare a constructor/],
        [class Logic { 'constructor'() {} }, null, /cannot declare a constructor/],
        [class Logic { page() {} }, null, /method cannot be named 'page'/],
        [class Logic { get value() { return 1; } }, null, /accessor 'value'/],
        [class Logic { set value(x) {} }, null, /accessor 'value'/],
        [class Logic { [Symbol.iterator]() {} }, null, /symbol keys/],
        [class Logic extends Object {}, null, /cannot extend another class/],
        [function Logic() {}, null, /exports no class Logic/],
        [undefined, null, /exports no class Logic/],
        [class Logic { run() {} }, 'page', /cannot be named 'page'/],
        [class Logic { run() {} }, 'a/constructor', /cannot be named 'constructor'/],
    ];
    for (const [logicClass, group, message] of cases) {
        const app = page();
        assert.throws(() => app.src.logicRegistry.register(logicClass, {group, resource: '/bad.js'}),
            error => message.test(error.message) && error.message.startsWith('/bad.js: '), String(message));
        assert.throws(() => LogicRegistry.check([{logicClass, group, resource: '/bad.js'}]), message);
        app.dispose();
    }
    class Plain { run() { return this.constructor; } helper() { return 'constructor ('; } }
    assert.doesNotThrow(() => LogicRegistry.check([{logicClass: Plain, group: null, resource: '/ok.js'}]));
});

test('a method named like a child group is an error, in either registration order and in check', () => {
    const groupFirst = page();
    groupFirst.src.logicRegistry.register(class Logic { scroll() {} }, {group: 'gui', resource: '/gui.js'});
    assert.throws(() => groupFirst.src.logicRegistry.register(class Logic { gui() {} }, {group: null, resource: '/calcolo_aux.js'}),
        /\/calcolo_aux\.js: the logic method 'gui' has the name of a child group/);
    const methodFirst = page();
    methodFirst.src.logicRegistry.register(class Logic { gui() {} }, {group: null, resource: '/calcolo_aux.js'});
    assert.throws(() => methodFirst.src.logicRegistry.register(class Logic { scroll() {} }, {group: 'gui', resource: '/gui.js'}),
        /\/gui\.js: the group 'gui' has the name of a logic method/);
    assert.throws(() => LogicRegistry.check([
        {logicClass: class Logic { settingmanager() {} }, group: 'gnrcomponents', resource: '/gnrcomponents.js'},
        {logicClass: class Logic { load() {} }, group: 'gnrcomponents/settingmanager', resource: '/sm.js'},
    ]), /\/gnrcomponents\.js: the logic method 'settingmanager' has the name of a child group/);
    assert.throws(() => LogicRegistry.check([
        {logicClass: class Logic { gui() {} }, group: null, resource: '/calcolo_aux.js'},
        {logicClass: class Logic { scroll() {} }, group: 'gui', resource: '/gui.js'},
    ]), /\/calcolo_aux\.js: the logic method 'gui' has the name of a child group/);
    groupFirst.dispose();
    methodFirst.dispose();
});

test('a method name like __proto__ or toString stays a plain member of the group', () => {
    const app = page();
    app.src.logicRegistry.register(class Logic { toString() { return 'mine'; } ['__proto__']() { return 'proto'; } },
        {group: null, resource: '/calcolo_aux.js'});
    assert.equal(Object.getPrototypeOf(app.logic), LogicGroup.prototype);
    assert.equal(app.src.logicRegistry.resolve('__proto__', formula('x')).method(), 'proto');
    assert.equal(app.logic.toString(), 'mine');
    app.dispose();
});

test('two instances are isolated: registries, groups and methods', () => {
    const one = page();
    const two = page();
    one.src.logicRegistry.register(class Logic { calc() { return this.page; } }, {group: 'calcoli', resource: '/calcoli.js'});
    assert.equal(two.logic.calcoli, undefined);
    assert.throws(() => two.src.logicRegistry.resolve('calcoli.calc', formula('x')), /no resource was registered/);
    assert.equal(one.logic.calcoli.calc(), one);
    assert.notEqual(one.src.logicRegistry, two.src.logicRegistry);
    one.dispose();
    two.dispose();
});

test('the constructor check reads the class body only at its top level', () => {
    const declared = [
        class Logic { x = 'a'
            constructor() {} },
        class Logic { /* c */ 'constructor'() {} },
        class Logic { "constructor" () {} },
    ];
    const plain = [
        class Logic { static constructor() {} },
        class Logic { run() { return this.constructor; } },
        class Logic { run() { return 'constructor('; } },
        class Logic { run() { return `${'x'} constructor(`; } },
        class Logic { // constructor()
            run() { /* constructor() */ return {constructor() {}}; } },
    ];
    for (const logicClass of declared) {
        assert.throws(() => LogicRegistry.check([{logicClass, group: null, resource: '/a.js'}]), /cannot declare a constructor/,
            logicClass.toString());
    }
    for (const logicClass of plain) {
        assert.doesNotThrow(() => LogicRegistry.check([{logicClass, group: null, resource: '/a.js'}]), logicClass.toString());
    }
});

// Phase 18 (ASTRA-01): a regular expression literal such as /[/*]/ made the constructor scan restart
// from index 0 forever. The check runs in its own process with a timeout, so a loop fails the test.
test('ASTRA-01: the constructor check ends on regular expression literals and an unterminated /*', () => {
    const logicUrl = new URL('../src/binding/logic.js', import.meta.url).href;
    const script = `
        import {LogicRegistry} from ${JSON.stringify(logicUrl)};
        const results = [];
        const check = (logicClass) => {
            try { LogicRegistry.check([{logicClass, group: null, resource: '/a.js'}]); results.push('ok'); }
            catch (error) { results.push(error.message); }
        };
        check(class Logic { run(s) { return s.replace(/[/*]/g, ''); } });
        check(class Logic { run(s) { return /\\/*/.test(s) ? 'a' : 'b'; } });
        check(class Logic { run(a, b) { return a / b / 2; } });
        check(class Logic { run(s) { return /constructor\\(/.test(s) || /[}]/.test(s); } });
        check(class Logic { run(s) { return s.split(/[/*]/); } constructor() {} });
        check(class Logic { run(s) { return 'a' + '/*'; } });
        process.stdout.write(JSON.stringify(results));
    `;
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], {encoding: 'utf8', timeout: 5000});
    assert.equal(run.signal, null, 'the check did not end within 5 s');
    assert.equal(run.status, 0, run.stderr);
    assert.deepEqual(JSON.parse(run.stdout), [
        'ok', 'ok', 'ok', 'ok', '/a.js: class Logic cannot declare a constructor; state lives on the group or the page', 'ok',
    ]);
});

test('ASTRA-01: an unterminated /* in a class source is not a comment and the scan ends', () => {
    const logicUrl = new URL('../src/binding/logic.js', import.meta.url).href;
    const script = `
        import {LogicRegistry} from ${JSON.stringify(logicUrl)};
        const logicClass = class Logic { run() {} };
        logicClass.toString = () => 'class Logic { run() { return 1 /* } constructor() {} }';
        const original = Function.prototype.toString;
        Function.prototype.toString = function () { return this === logicClass ? logicClass.toString() : original.call(this); };
        let result = 'ok';
        try { LogicRegistry.check([{logicClass, group: null, resource: '/a.js'}]); } catch (error) { result = error.message; }
        process.stdout.write(result);
    `;
    const run = spawnSync(process.execPath, ['--input-type=module', '-e', script], {encoding: 'utf8', timeout: 5000});
    assert.equal(run.signal, null, 'the check did not end within 5 s');
    assert.equal(run.status, 0, run.stderr);
    assert.match(run.stdout, /cannot declare a constructor/);
});
