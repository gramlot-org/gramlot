/** Real browser check of native editing (S10), checkbox and radio (S11), button and events with the R3 side effects (S12), handlers of a branch removed under freeze (S13, R12), strict CSP with the Q3 error (S14): the bundled runtime from js/ on a file:// shell, real typing, clicks and keys. */
import {build} from '../js/node_modules/esbuild/lib/main.js';
import {HtmlBuilder} from '../js/node_modules/@genrojs/builders/src/index.js';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const [playwrightPath, engineName = 'chromium', executablePath] = process.argv.slice(2);
if (!playwrightPath) throw new Error('Usage: node scripts/verify_binding_browser.mjs PLAYWRIGHT_ENTRY [ENGINE] [EXECUTABLE]');
const engine = (await import(pathToFileURL(playwrightPath)))[engineName];
// The runtime built from js/ at this revision (C07), not a packaged copy.
const runtime = (await build({entryPoints: [fileURLToPath(new URL('../js/src/index.js', import.meta.url))],
    bundle: true, platform: 'browser', format: 'iife', globalName: 'GramlotRuntime', write: false})).outputFiles[0].text;
const folder = await mkdtemp(join(tmpdir(), 'gramlot-binding-check-'));
let browser;
try {
    const file = join(folder, 'index.html');
    const shell = new HtmlBuilder();
    const html = shell.root.html();
    html.head().meta({charset: 'utf-8'});
    const body = html.body();
    body.main({id: 'gramlot-root'});
    body.aside({id: 'other-root'});
    body.script(runtime.replaceAll('</script', '<\\/script'));
    body.script(`
        const app = new GramlotRuntime.Gramlot({document, element: document.getElementById('gramlot-root'), transport: false});
        // Inline code runs only as received with the Source: the page is built apart and mounted with startSource.
        const source = new GramlotRuntime.GramlotBuilder();
        const root = source.root;
        const data = app.data;
        data.setItem('f.n', 7);
        data.setItem('f.r', 30);
        data.setItem('f.s', 'b');
        data.setItem('f.m', ['a']);
        data.setItem('f.c', '#FF0000');
        root.input({id: 'live', value: '^f.live', title: '^f.live', class: '^f.live', live: true});
        root.input({id: 'lazy', value: '^f.lazy'});
        root.textarea({id: 'area', value: '^f.area', live: true});
        root.input({id: 'upper', value: '^f.upper', live: true});
        root.dataController({script: 'this.SET("f.upper", v.toUpperCase())', v: '^f.upper'});
        root.input({id: 'number', type: 'number', value: '^f.n'});
        root.input({id: 'range', type: 'range', min: 0, max: 100, value: '^f.r'});
        const single = root.select({id: 'single', value: '^f.s'});
        const multiple = root.select({id: 'multiple', value: '^f.m', multiple: true});
        for (const value of ['a', 'b', 'c']) {
            single.option(value.toUpperCase(), {value});
            multiple.option(value.toUpperCase(), {value});
        }
        for (const kind of ['date', 'time', 'month', 'week', 'datetime-local']) {
            root.input({id: kind, type: kind, value: '^t.' + kind});
        }
        root.input({id: 'color', type: 'color', value: '^f.c'});
        root.div({datapath: '^scelto'}).input({id: 'orphan', value: '^.v', live: true});
        root.input({id: 'ime', value: '^f.ime', live: true});
        data.setItem('b.ra', true);
        root.input({id: 'cb', type: 'checkbox', value: '^b.cb'});
        const panel = root.div({id: 'panel'});
        for (const id of ['ra', 'rb', 'rc']) panel.input({id, type: 'radio', group: 'g', value: '^b.' + id});
        // A second Gramlot page in the same document, with the same group name.
        const other = new GramlotRuntime.Gramlot({document, element: document.getElementById('other-root'), transport: false});
        other.data.setItem('b.ra', true);
        for (const id of ['oa', 'ob']) other.builder.root.input({id, type: 'radio', group: 'g', value: '^b.' + id.replace('o', 'r')});
        window.other = other;
        // S12: buttons in forms, a connect_onclick on the ancestor, native listeners of the author.
        window.seen = [];
        document.addEventListener('submit', event => {
            event.preventDefault();
            window.seen.push('submit ' + event.target.id + ' by ' + (event.submitter ? event.submitter.id : 'none'));
        });
        const buttons = root.div({id: 'buttons', connect_onclick: 'window.seen.push("pane " + event.target.id)'});
        const form1 = buttons.form({id: 'form1'});
        form1.input({id: 'field1', value: '^k.field1'});
        form1.button('native', {id: 'bnative'});
        const bctrl = form1.button({id: 'bctrl'});
        bctrl.span('Save', {id: 'bctrl-text'});
        bctrl.svg({id: 'bctrl-icon', width: 12, height: 12}).circle({id: 'bctrl-dot', cx: 6, cy: 6, r: 6});
        bctrl.dataController({script: 'window.seen.push("controller " + button_counter + " " + this.parentNode.attr.id)'});
        form1.button('typed', {id: 'btyped', type: 'submit', fire: 'k.typed'});
        const form2 = buttons.form({id: 'form2'});
        form2.input({id: 'field2', value: '^k.field2'});
        form2.button('only', {id: 'bonly', fire: 'k.only'});
        buttons.input({id: 'ibutton', type: 'button', value: 'input', connect_onclick: 'window.seen.push("connect ibutton")'});
        // S13, R12: a branch removed under freeze keeps its DOM until the thaw; an observer outside it counts.
        window.r12seen = [];
        const r12 = root.section({id: 'r12'}).div({id: 'r12box'});
        r12.input({id: 'r12text', value: '^z.text', live: true, connect_onkeydown: 'this.SET("z.key", event.key)'});
        r12.input({id: 'r12box-check', type: 'checkbox', value: '^z.box'});
        r12.button('fire', {id: 'r12fire', fire: 'z.fired'});
        r12.span('span', {id: 'r12span', connect_onclick: 'this.SET("z.clicked", true)'});
        root.dataController({script: 'window.r12seen.push(1)', t: '^z.text', k: '^z.key', b: '^z.box', f: '^z.fired', c: '^z.clicked'});
        app.startSource(source.source);
        window.app = app;
        document.getElementById('bctrl').addEventListener('click', () => window.seen.push('author on bctrl'));
        document.getElementById('buttons').addEventListener('click', event => window.seen.push('author bubble ' + event.target.id));
        document.getElementById('buttons').addEventListener('click', event => window.seen.push('author capture ' + event.target.id), {capture: true});
    `);
    await writeFile(file, '<!doctype html>' + shell.render());
    browser = await engine.launch({headless: true, ...(executablePath ? {executablePath} : {})});
    const page = await browser.newPage();
    const errors = [], network = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.goto(pathToFileURL(file).href);
    await page.waitForFunction(() => window.app);
    const get = path => page.evaluate(path => window.app.data.getItem(path), path);
    const set = (path, value) => page.evaluate(([path, value]) => window.app.data.setItem(path, value), [path, value]);
    const prop = (id, name) => page.evaluate(([id, name]) => document.getElementById(id)[name], [id, name]);
    const checks = [];

    // text, live: real typing, caret kept, title and class follow, the value attribute never written.
    await page.click('#live');
    await page.keyboard.type('abcd');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('X');
    assert.equal(await get('f.live'), 'abXcd');
    assert.equal(await prop('live', 'selectionStart'), 3);
    assert.equal(await prop('live', 'title'), 'abXcd');
    assert.equal(await prop('live', 'className'), 'abXcd');
    assert.equal(await page.evaluate(() => document.getElementById('live').getAttribute('value')), null);
    await set('f.live', 'external');
    assert.equal(await prop('live', 'value'), 'external');
    checks.push('text live + caret + title/class');

    // text, not live: the write happens on change (blur); the empty string stays.
    await page.click('#lazy');
    await page.keyboard.type('draft');
    assert.equal(await get('f.lazy'), null);
    await page.keyboard.press('Tab');
    assert.equal(await get('f.lazy'), 'draft');
    await page.fill('#lazy', '');
    await page.keyboard.press('Tab');
    assert.equal(await get('f.lazy'), '');
    await page.fill('#area', 'line 1\nline 2');
    assert.equal(await get('f.area'), 'line 1\nline 2');
    checks.push('text change + textarea');

    // A controller that normalizes the typed value: the correction reaches the control.
    await page.click('#upper');
    await page.keyboard.type('abc');
    assert.equal(await get('f.upper'), 'ABC');
    assert.equal(await prop('upper', 'value'), 'ABC');
    checks.push('controller correction');

    // number: typed number, empty → null, an invalid draft keeps the Data.
    assert.equal(await prop('number', 'value'), '7');
    await page.fill('#number', '42');
    await page.keyboard.press('Tab');
    assert.strictEqual(await get('f.n'), 42);
    await page.fill('#number', '');
    await page.keyboard.press('Tab');
    assert.strictEqual(await get('f.n'), null);
    await page.fill('#number', '7');
    await page.keyboard.press('Tab');
    await page.click('#number');
    await page.keyboard.press('End');
    await page.keyboard.type('e');
    const badInput = await page.evaluate(() => document.getElementById('number').validity.badInput);
    await page.keyboard.press('Tab');
    const invalid = await get('f.n');
    assert.strictEqual(invalid, 7, `invalid draft (badInput=${badInput}) must leave the Data unchanged`);
    checks.push(`number (draft '7e' badInput=${badInput})`);

    // range: keyboard writes a number; the browser limit does not write the Data.
    await page.focus('#range');
    await page.keyboard.press('ArrowRight');
    assert.strictEqual(await get('f.r'), 31);
    await set('f.r', 500);
    assert.equal(await prop('range', 'value'), '100');
    assert.strictEqual(await get('f.r'), 500);
    checks.push('range');

    // select single and multiple.
    assert.equal(await prop('single', 'value'), 'b');
    await page.selectOption('#single', 'c');
    assert.equal(await get('f.s'), 'c');
    await set('f.s', 'zz');
    assert.equal(await prop('single', 'selectedIndex'), -1);
    assert.equal(await get('f.s'), 'zz');
    await page.selectOption('#multiple', ['a', 'c']);
    assert.deepEqual(await get('f.m'), ['a', 'c']);
    await set('f.m', []);
    assert.deepEqual(await page.evaluate(() => [...document.getElementById('multiple').selectedOptions].length), 0);
    assert.equal(await page.evaluate(() => document.getElementById('multiple').getAttribute('value')), null);
    checks.push('select single + multiple');

    // temporal types: lexical strings both ways; empty → null.
    const temporal = {date: '2026-09-29', time: '18:30', month: '2026-09', week: '2026-W40', 'datetime-local': '2026-09-29T18:30'};
    const temporalTypes = [];
    for (const [kind, sample] of Object.entries(temporal)) {
        temporalTypes.push(`${kind}→${await prop(kind, 'type')}`);
        await page.fill(`#${kind}`, sample);
        await page.keyboard.press('Tab');
        assert.strictEqual(await get(`t.${kind}`), sample, kind);
        await set(`t.${kind}`, null);
        assert.equal(await prop(kind, 'value'), '', kind);
        await set(`t.${kind}`, sample);
        assert.equal(await prop(kind, 'value'), sample, kind);
    }
    checks.push(`temporal (${temporalTypes.join(', ')})`);

    // color: the browser normalization does not write the Data.
    assert.equal(await prop('color', 'value'), '#ff0000');
    assert.equal(await get('f.c'), '#FF0000');
    await page.fill('#color', '#00ff00');
    assert.equal(await get('f.c'), '#00ff00');
    checks.push('color');

    // Q7: input on a null path raises from the listener, naming node and path.
    await page.click('#orphan');
    await page.keyboard.type('x');
    assert.ok(errors.length >= 1);
    assert.ok(errors.every(message => message.includes("input 'input_") && message.includes("write on a null path: '.v'")), errors.join('\n'));
    const q7 = errors.splice(0).length;
    checks.push(`Q7 (${q7} listener errors)`);

    // IME, synthetic sequence (the real IME is a manual check): the projection waits for the end.
    const ime = await page.evaluate(() => {
        const field = document.getElementById('ime');
        const data = window.app.data;
        field.dispatchEvent(new CompositionEvent('compositionstart'));
        field.value = 'かな';
        field.dispatchEvent(new InputEvent('input', {isComposing: true}));
        const during = data.getItem('f.ime');
        data.setItem('f.ime', 'external');
        const shown = field.value;
        field.dispatchEvent(new CompositionEvent('compositionend', {data: 'かな'}));
        return {during, shown, after: data.getItem('f.ime'), value: field.value};
    });
    assert.deepEqual(ime, {during: null, shown: 'かな', after: 'かな', value: 'かな'});
    checks.push('IME synthetic');

    // C04.1: multiple of a select rebuilds the element, the NodeBinding stays.
    const rebuild = await page.evaluate(() => {
        const node = window.app.source.getItem('main').getNodes().find(each => each.attr.id === 'multiple');
        const binding = window.app.binding.bindingFor(node);
        const before = document.getElementById('multiple');
        node.setAttr({multiple: false});
        const after = document.getElementById('multiple');
        return {rebuilt: before !== after, multiple: after.multiple, same: window.app.binding.bindingFor(node) === binding};
    });
    assert.deepEqual(rebuild, {rebuilt: true, multiple: false, same: true});
    checks.push('C04.1 rebuild');

    // S11 checkbox: mouse click and Space write booleans, never 'on'.
    await page.click('#cb');
    assert.strictEqual(await get('b.cb'), true);
    await page.focus('#cb');
    await page.keyboard.press('Space');
    assert.strictEqual(await get('b.cb'), false);
    await set('b.cb', 'yes');
    assert.equal(await prop('cb', 'checked'), true);
    assert.equal(await page.evaluate(() => document.getElementById('cb').getAttribute('value')), null);
    checks.push('checkbox click + Space');

    // S11 radio: one generated name; a click writes true on B, then false on A, in Data and DOM.
    const radios = async () => page.evaluate(() => ['ra', 'rb', 'rc'].map(id => [
        window.app.data.getItem('b.' + id), document.getElementById(id).checked]));
    const names = await page.evaluate(() => ['ra', 'rb', 'rc', 'oa'].map(id => document.getElementById(id).name));
    assert.ok(names[0].startsWith('gramlot-') && names[0] === names[1] && names[1] === names[2], names.join());
    assert.notEqual(names[0], names[3]);
    assert.deepEqual(await radios(), [[true, true], [null, false], [null, false]]);
    await page.click('#rb');
    assert.deepEqual(await radios(), [[false, false], [true, true], [null, false]], 'false only on the peers that were on');
    checks.push('radio click');

    // Arrow keys move the choice inside the group; Space chooses the focused button.
    await page.focus('#rb');
    await page.keyboard.press('ArrowDown');
    assert.deepEqual(await radios(), [[false, false], [false, false], [true, true]]);
    await page.focus('#ra');
    await page.keyboard.press('Space');
    assert.deepEqual(await radios(), [[true, true], [false, false], [false, false]]);
    checks.push('radio arrow keys + Space');

    // C04.2: a true from code turns the others off in Data and DOM.
    await set('b.rc', true);
    assert.deepEqual(await radios(), [[false, false], [false, false], [true, true]]);
    checks.push('radio SET from code');

    // A rebuild of the group after the code write: the button written last is on.
    const regrouped = await page.evaluate(() => {
        const panel = window.app.source.getItem('main').getNodes().find(each => each.attr.id === 'panel');
        const before = document.getElementById('rc');
        window.app.renderer.freeze(panel);
        panel.setAttr({title: 'rebuilt'});
        window.app.renderer.unfreeze(panel);
        return document.getElementById('rc') !== before;
    });
    assert.equal(regrouped, true);
    assert.deepEqual(await radios(), [[false, false], [false, false], [true, true]]);
    checks.push('radio group rebuild');

    // Two Gramlot pages with the same group stay apart.
    await page.click('#ob');
    assert.deepEqual(await page.evaluate(() => [window.other.data.getItem('b.ra'), window.other.data.getItem('b.rb'),
        document.getElementById('oa').checked, document.getElementById('ob').checked]), [false, true, false, true]);
    assert.deepEqual(await radios(), [[false, false], [false, false], [true, true]]);
    checks.push('two instances');

    // S12, R3 side effects: every observation is printed for the phase note; the asserted lines are R3 itself.
    const observe = async action => {
        await page.evaluate(() => { window.seen = []; });
        await action();
        return page.evaluate(() => window.seen.splice(0));
    };
    const r3 = {};
    r3['click native button in form'] = await observe(() => page.click('#bnative'));
    r3['click controller button text'] = await observe(() => page.click('#bctrl-text'));
    r3['click controller button icon'] = await observe(() => page.click('#bctrl-dot', {force: true}));
    await page.focus('#bctrl');
    r3['Enter on controller button'] = await observe(() => page.keyboard.press('Enter'));
    r3['Space on controller button'] = await observe(() => page.keyboard.press('Space'));
    r3['click authored type=submit with fire'] = await observe(() => page.click('#btyped'));
    await page.focus('#field1');
    r3['Enter in form1 field (native button first)'] = await observe(() => page.keyboard.press('Enter'));
    await page.focus('#field2');
    r3['Enter in form2 field (only a mechanism button)'] = await observe(() => page.keyboard.press('Enter'));
    await page.focus('#bonly');
    r3['Space on form2 mechanism button'] = await observe(() => page.keyboard.press('Space'));
    r3['click input type=button with connect_onclick'] = await observe(() => page.click('#ibutton'));
    r3.types = await page.evaluate(() => ['bnative', 'bctrl', 'btyped', 'bonly'].map(id => id + '=' + document.getElementById(id).getAttribute('type')).join(' '));
    assert.equal(r3.types, 'bnative=null bctrl=button btyped=submit bonly=button');
    assert.deepEqual(r3['click controller button text'], ['author capture bctrl-text', 'controller 1 bctrl', 'author on bctrl']);
    assert.deepEqual(r3['click controller button icon'], ['author capture bctrl-dot', 'controller 2 bctrl', 'author on bctrl']);
    assert.deepEqual(r3['Enter on controller button'], ['author capture bctrl', 'controller 3 bctrl', 'author on bctrl']);
    assert.deepEqual(r3['Space on controller button'], ['author capture bctrl', 'controller 4 bctrl', 'author on bctrl']);
    assert.ok(r3['click native button in form'].includes('submit form1 by bnative'));
    assert.ok(r3['click authored type=submit with fire'].includes('submit form1 by btyped'));
    assert.ok(!r3['click authored type=submit with fire'].some(line => line.startsWith('pane') || line.startsWith('author bubble')));
    assert.strictEqual(await get('k.typed'), null);
    checks.push('button R3 ' + JSON.stringify(r3));

    // S13, R12: freeze, remove the branch, then real typing, clicks and keys on its elements.
    await page.evaluate(() => {
        const section = window.app.source.getItem('main').getNodes().find(each => each.attr.id === 'r12');
        window.app.renderer.freeze(section);
        section.value.popNode(section.value.getNodes()[0].label);
    });
    await page.click('#r12text');
    await page.keyboard.type('abc');
    await page.keyboard.press('Tab');
    await page.click('#r12box-check');
    await page.click('#r12fire');
    await page.focus('#r12fire');
    await page.keyboard.press('Enter');
    await page.click('#r12span');
    const r12 = await page.evaluate(() => ({
        data: ['text', 'key', 'box', 'fired', 'clicked'].map(name => window.app.data.getItem('z.' + name)),
        seen: window.r12seen.length, typed: document.getElementById('r12text').value,
    }));
    assert.deepEqual(r12, {data: [null, null, null, null, null], seen: 0, typed: 'abc'});
    const thawed = await page.evaluate(() => {
        window.app.renderer.unfreeze(window.app.source.getItem('main').getNodes().find(each => each.attr.id === 'r12'));
        return ['r12box', 'r12text', 'r12fire', 'r12span'].map(id => document.getElementById(id));
    });
    assert.deepEqual(thawed, [null, null, null, null]);
    checks.push('R12 removed under freeze (typing, checkbox, button click + Enter, connect_onclick, connect_onkeydown)');

    assert.deepEqual(errors, []);
    assert.deepEqual(network, []);

    // S14, Q3: strict CSP profile (meta in a second file:// shell: nonce only, no 'unsafe-eval'). Named logic
    // runs; inline code raises the Q3 error naming node and attribute; a script without the nonce is blocked.
    // Every action is real typing or a click: page.evaluate only reads.
    const nonce = 'gramlot-csp-check';
    const strictShell = new HtmlBuilder();
    const strictHtml = strictShell.root.html();
    const strictHead = strictHtml.head();
    strictHead.meta({charset: 'utf-8'});
    strictHead.meta({'http-equiv': 'Content-Security-Policy', content: `script-src 'nonce-${nonce}'`});
    const strictBody = strictHtml.body();
    strictBody.main({id: 'gramlot-root'});
    strictBody.script(`
        window.violations = [];
        document.addEventListener('securitypolicyviolation', event => window.violations.push(event.effectiveDirective + ' ' + event.blockedURI));
    `, {nonce});
    strictBody.script(runtime.replaceAll('</script', '<\\/script'), {nonce});
    strictBody.script('window.withoutNonce = true;');
    strictBody.script(`
        const app = new GramlotRuntime.Gramlot({document, element: document.getElementById('gramlot-root'), transport: false});
        app.logicRegistry.register(class Logic { somma(kwargs) { return kwargs.a + kwargs.b; } }, {group: null, resource: '/csp_aux.js'});
        const source = new GramlotRuntime.GramlotBuilder();
        const root = source.root;
        app.data.setItem('csp.b', 2);
        root.input({id: 'named-a', type: 'number', value: '^csp.a'});
        root.dataFormula({result_path: 'csp.named', func: 'somma', a: '^csp.a', b: '^csp.b'});
        root.input({id: 'inline-c', value: '^csp.c'});
        root.dataController({script: 'this.SET("csp.out", c)', c: '^csp.c'});
        root.button('go', {id: 'inline-go', action: 'this.SET("csp.out", "clicked")'});
        app.startSource(source.source);
        window.app = app;
    `, {nonce});
    const strictFile = join(folder, 'csp.html');
    await writeFile(strictFile, '<!doctype html>' + strictShell.render());
    const strictPage = await browser.newPage();
    const strictErrors = [], strictNetwork = [];
    strictPage.on('pageerror', error => strictErrors.push(`${error.name}: ${error.message}`));
    strictPage.on('request', request => { if (/^https?:/.test(request.url())) strictNetwork.push(request.url()); });
    await strictPage.goto(pathToFileURL(strictFile).href);
    await strictPage.waitForFunction(() => window.app);
    assert.equal(await strictPage.evaluate(() => window.withoutNonce), undefined);
    await strictPage.fill('#named-a', '5');
    await strictPage.press('#named-a', 'Tab');
    assert.equal(await strictPage.evaluate(() => window.app.data.getItem('csp.named')), 7);
    assert.deepEqual(strictErrors, []);
    await strictPage.fill('#inline-c', 'x');
    await strictPage.press('#inline-c', 'Tab');
    await strictPage.click('#inline-go');
    // Violation events and page errors are delivered asynchronously.
    await strictPage.waitForFunction(() => window.violations.some(line => line.endsWith(' eval')));
    for (let tries = 0; strictErrors.length < 2 && tries < 50; tries += 1) await strictPage.waitForTimeout(20);
    assert.equal(await strictPage.evaluate(() => window.app.data.getItem('csp.out')), null);
    const q3 = "inline code blocked by the Content Security Policy of the page \\(no 'unsafe-eval'\\); move the code to named "
        + "logic \\(a method of the page's class Logic\\) or serve the page with the permissive CSP profile, which allows 'unsafe-eval'$";
    assert.equal(strictErrors.length, 2, strictErrors.join('\n'));
    assert.match(strictErrors[0], new RegExp(`^EvalError: dataController '.+' 'script': ${q3}`));
    assert.match(strictErrors[1], new RegExp(`^EvalError: button '.+' 'action': ${q3}`));
    const violations = await strictPage.evaluate(() => window.violations);
    assert.ok(violations.some(line => /^script-src(-elem)? inline$/.test(line)), violations.join(', '));
    assert.ok(violations.some(line => line === 'script-src eval'), violations.join(', '));
    assert.deepEqual(strictNetwork, []);
    checks.push(`strict CSP (nonce, no unsafe-eval): named logic runs, inline script and button action raise the Q3 error, script without nonce blocked; violations ${JSON.stringify(violations)}`);

    console.log(`${engineName} ${browser.version()} PASS: ${checks.join('; ')}; no HTTP(S).`);
} finally {
    await browser?.close();
    await rm(folder, {recursive: true, force: true});
}
