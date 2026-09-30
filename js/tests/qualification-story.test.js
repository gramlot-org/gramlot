// Phase S16: the end-to-end story of source plan §8.1 (GC-210 §065) on `examples/controllers/09_end_to_end`,
// once from the Python page and once from the JavaScript page, through the real path: the FileHost of each
// language opens the page, the browser document is the bootstrap HTML the host wrote, PageBootstrap imports
// the companion `_aux.js` and starts Gramlot, the Source travels as TYTX over the MainTransport, and the page
// closes on a real `pagehide`. Nothing is registered, mounted or wired by hand: the test only answers the
// transport requests with the host, acts on the DOM with events, and observes.
//
// Each step records the Data trace, the DOM mutations, the transport requests and the counters; the two
// languages must give the same records, and every step checks its own outcome.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import {counters, liveListeners, liveTimers} from './fixtures/lifecycle.js';

// The core as the example page resolves it: `examples/node_modules/@gramlot/native-html` is a symlink to
// `js/` locally and a copy of it in CI (`--install-links`); loading FileHost and PageBootstrap from the same
// installation keeps one `Page` class, so the host's `instanceof Page` check holds in both.
const fromExamples = createRequire(new URL('../../examples/package.json', import.meta.url));
const {PageBootstrap} = await import(pathToFileURL(fromExamples.resolve('@gramlot/native-html')).href);
const {FileHost} = await import(pathToFileURL(fromExamples.resolve('@gramlot/native-html/server')).href);

const PAGES = fileURLToPath(new URL('../../examples/controllers/', import.meta.url)).replace(/\/$/, '');
const PATH = '/09_end_to_end';

/** The JavaScript FileHost on the controllers folder. */
function jsHost() {
    const host = new FileHost(PAGES);
    return {
        language: 'js',
        open: async () => host.openPage(PATH, {prefix: PAGES}),
        main: pageId => host.main(pageId),
        source: (pageId, method, params) => host.source(pageId, method, params),
        close: async pageId => host.closePage(pageId),
        stop() {},
    };
}

/** The Python FileHost on the controllers folder, one process answering one JSON request per line. */
const PYTHON_HOST = `
import asyncio, json, sys
from gramlot.server import FileHost
host = FileHost(sys.argv[1])
async def handle(request):
    op = request["op"]
    if op == "open":
        opened = await host.open_page(request["path"], prefix=sys.argv[1])
        return {"pageId": opened.page_id, "html": opened.html}
    if op == "main":
        return {"wire": await host.main(request["pageId"])}
    if op == "source":
        return {"wire": await host.source(request["pageId"], request["method"], request["params"])}
    if op == "close":
        host.close_page(request["pageId"])
        return {}
    raise ValueError(op)
async def run():
    for line in sys.stdin:
        try:
            reply = await handle(json.loads(line))
        except Exception as error:
            reply = {"error": type(error).__name__, "message": str(error)}
        print(json.dumps(reply), flush=True)
asyncio.run(run())
`;

function pythonHost() {
    const child = spawn(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', PYTHON_HOST, PAGES],
        {stdio: ['pipe', 'pipe', 'inherit']});
    const lines = createInterface({input: child.stdout})[Symbol.asyncIterator]();
    const ask = async request => {
        child.stdin.write(`${JSON.stringify(request)}\n`);
        const reply = JSON.parse((await lines.next()).value);
        if (reply.error) throw Object.assign(new Error(reply.message), {name: reply.error});
        return reply;
    };
    return {
        language: 'py',
        open: () => ask({op: 'open', path: PATH}),
        main: async pageId => (await ask({op: 'main', pageId})).wire,
        source: async (pageId, method, params) => (await ask({op: 'source', pageId, method, params})).wire,
        close: pageId => ask({op: 'close', pageId}),
        stop() { child.stdin.end(); },
    };
}

/** The argument the host wrote into `new PageBootstrap(…)`. */
function bootstrapArguments(html) {
    const match = html.match(/import \{PageBootstrap\} from "[^"]*";await new PageBootstrap\((.*)\)\.run\(\);<\/script>/s);
    assert.ok(match, 'the bootstrap script calls PageBootstrap');
    return JSON.parse(match[1]);
}

const tick = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

/** A short name for the target of a DOM mutation: its id, else the id of its nearest element with one. */
function where(node) {
    let element = node.nodeType === 1 ? node : node.parentNode;
    while (element && !element.id) element = element.parentNode;
    return `${node.nodeType === 3 ? '#text' : node.nodeName.toLowerCase()}@${element?.id ?? '-'}`;
}

/**
 * Open the story page on `host` and run it in a jsdom browser document, recording every step. Returns the
 * records of the eight steps; the checks of each step run here, identical for both languages.
 */
async function runStory(t, host) {
    const opened = await host.open();
    const args = bootstrapArguments(opened.html);
    const {window} = new JSDOM(opened.html, {url: pathToFileURL(`${PAGES}${PATH}`).href});
    const document = window.document;
    const timers = liveTimers(t);
    const listeners = liveListeners(window);
    const trace = {data: [], transport: []};
    const beacons = [];
    window.navigator.sendBeacon = (url, blob) => {
        trace.transport.push(`beacon:${url === args.config.closeUrl ? 'close' : url}`);
        beacons.push(blob.text().then(text => host.close(JSON.parse(text).pageId)));
        return true;
    };
    let observer = null;
    const mutations = [];
    const original = globalThis.fetch;
    globalThis.fetch = async (url, options) => {
        const body = JSON.parse(options.body);
        assert.equal(body.pageId, opened.pageId);
        let wire = '';
        if (url === args.config.mainUrl) {
            trace.transport.push('main');
            // The Gramlot instance exists (PageBootstrap set window.gramlot) and has not mounted yet.
            window.gramlot.data.subscribe('story-trace', {any: event => {
                const base = event.pathlist ?? [];
                const path = event.evt === 'ins' || event.evt === 'del' ? [...base, event.node.label] : base;
                trace.data.push(`${event.evt}:${path.join('.')}`);
            }});
            // Records delivered to the callback between two steps are kept with those still queued.
            observer = new window.MutationObserver(records => mutations.push(...records));
            observer.observe(document.getElementById(args.config.rootId), {subtree: true, childList: true,
                attributes: true, characterData: true});
            wire = await host.main(body.pageId);
        } else if (url === args.config.sourceUrl) {
            trace.transport.push(`source:${body.method}`);
            wire = await host.source(body.pageId, body.method, body.params);
        } else if (url === args.config.closeUrl) {
            trace.transport.push('close');
            await host.close(body.pageId);
        } else {
            assert.fail(`unexpected request ${url}`);
        }
        return {ok: true, status: 200, text: async () => wire};
    };
    const root = document.getElementById(args.config.rootId);
    const byId = id => document.getElementById(id);
    const data = path => app.data.getItem(`story.${path}`);
    const steps = [];
    let app;
    /** Close the current step: its Data trace, DOM mutations, transport requests and counters. */
    const record = name => {
        const dom = [...mutations.splice(0), ...observer.takeRecords()].map(item =>
            `${item.type}:${where(item.target)}${item.attributeName ? `.${item.attributeName}` : ''}`);
        steps.push({name, data: trace.data.splice(0), dom, transport: trace.transport.splice(0),
            counters: counters({app, document, timers, listeners, root})});
    };
    const edit = (id, value, type = 'change') => {
        byId(id).value = value;
        byId(id).dispatchEvent(new window.Event(type, {bubbles: true}));
    };
    const click = (id, options = {}) => byId(id).dispatchEvent(new window.MouseEvent('click',
        {bubbles: true, cancelable: true, ...options}));
    try {
        app = await new PageBootstrap({...args, document}).run();
        assert.equal(app.state, 'started');
        assert.equal(window.gramlot, app);
        // Page.css then the same-name companion, both with the mount prefix; the companion _aux.js is the Logic.
        assert.deepEqual(args.resources, {css: [`${PAGES}/themes/gramlot-base/theme.css`, `${PAGES}/09_end_to_end.css`],
            js: [{url: `${PAGES}/09_end_to_end_aux.js`, group: null}]});
        assert.deepEqual([...document.head.querySelectorAll('link[rel="stylesheet"]')].map(link => link.getAttribute('href')),
            args.resources.css);
        assert.equal(typeof app.logic.press, 'function');

        // 1. The first render shows the final values: the setters after the controls, the later branch
        // with its duplicates and the defaults are installed before the DOM, so no element is corrected.
        assert.equal(byId('caption').textContent, 'The story of a page');
        assert.equal(byId('caption-field').value, 'The story of a page');
        assert.equal(byId('quantity').value, '2');
        assert.equal(data('quantity'), 2);
        assert.equal(byId('live').checked, false);
        assert.deepEqual([byId('small').checked, byId('large').checked, byId('gift').checked], [true, false, false]);
        assert.equal(byId('total').textContent, '2');
        assert.equal(byId('circle').getAttribute('r'), '28');
        assert.equal(byId('circle').getAttribute('fill'), '#23745b');
        record('1 first render');
        assert.ok(steps[0].dom.every(item => item.startsWith('childList:')), `no correction: ${steps[0].dom}`);

        // 2. Editing with live false (input does not write, change does), then live true.
        edit('caption-field', 'Typed', 'input');
        assert.equal(byId('caption').textContent, 'The story of a page');
        assert.equal(data('settings.caption'), 'The story of a page');
        edit('caption-field', 'Typed', 'change');
        assert.equal(byId('caption').textContent, 'Typed');
        click('live');
        assert.equal(data('live'), true);
        edit('caption-field', 'Typed live', 'input');
        assert.equal(byId('caption').textContent, 'Typed live');
        assert.equal(data('settings.caption'), 'Typed live');
        record('2 editing');

        // 3. The formulas and the controller update the text and the SVG.
        edit('quantity', '6');
        assert.equal(data('quantity'), 6);
        assert.equal(byId('total').textContent, '6');
        assert.equal(byId('circle').getAttribute('r'), '44');
        assert.equal(byId('circle').getAttribute('fill'), '#23745b');
        click('gift');
        assert.equal(data('gift'), true);
        assert.equal(byId('total').textContent, '11');
        assert.equal(byId('circle').getAttribute('r'), '64');
        assert.equal(byId('circle').getAttribute('fill'), '#b13d48');
        record('3 formula and controller');

        // 4. Choosing a radio updates both booleans, in the Data and in the DOM.
        click('large');
        assert.deepEqual([data('size.small'), data('size.large')], [false, true]);
        assert.deepEqual([byId('small').checked, byId('large').checked], [false, true]);
        assert.equal(byId('total').textContent, '23');
        assert.equal(byId('circle').getAttribute('r'), '90');
        record('4 radio');

        // 5. The button calls its nested controller once per click, with counter and modifiers.
        click('press', {shiftKey: true});
        assert.equal(byId('presses').textContent, 'Pressed 1 times');
        assert.equal(byId('modifiers').textContent, 'with Shift');
        click('press');
        assert.equal(byId('presses').textContent, 'Pressed 2 times');
        assert.equal(byId('modifiers').textContent, 'without modifiers');
        record('5 button');

        // 6. remoteSource: the branch comes back from the host with its own setters, visible at its first render.
        click('loadExtras');
        for (let i = 0; i < 50 && !byId('extras-title'); i++) await tick(5);
        assert.equal(byId('extras-title').textContent, 'Extras from the server');
        assert.equal(byId('extras-items').textContent, 'Ribbon, card, envelope');
        record('6 remoteSource');
        assert.ok(!steps[5].dom.some(item => item.startsWith('characterData:')), `no correction: ${steps[5].dom}`);

        // 7. Freeze the later branch, change the Data and remove a child, then one thaw. Freeze suspends the
        // structural rebuild only (GC-210 §010 V1, §030): built elements, inside the frozen branch too, follow the Data;
        // the removed child keeps its element until the thaw.
        click('freeze');
        app.data.setItem('extras.title', 'Changed under freeze');
        click('removeNote');
        edit('quantity', '1');
        assert.equal(byId('extras-title').textContent, 'Changed under freeze');
        assert.equal(byId('notes').children.length, 2);
        assert.equal(byId('total').textContent, '8');
        click('thaw');
        assert.equal(byId('extras-title').textContent, 'Changed under freeze');
        assert.equal(byId('notes').children.length, 1);
        record('7 freeze and thaw');

        // 8. The page close (a real pagehide) stops everything: Gramlot disposed, the server page closed,
        // no binding, registration, timer or DOM listener left, and a later Data write changes nothing.
        window.dispatchEvent(new window.Event('pagehide'));
        await Promise.all(beacons);
        assert.equal(app.state, 'disposed');
        await assert.rejects(host.main(opened.pageId), /Unknown, expired or unowned page/);
        const closed = root.innerHTML;
        app.data.setItem('story.quantity', 9);
        assert.equal(root.innerHTML, closed);
        record('8 close');
        const last = steps.at(-1).counters;
        for (const key of ['bindings', 'registrations', 'nodeIds', 'inline', 'records', 'timers', 'listeners',
            'remoteRequests']) {
            assert.equal(last[key], 0, `${key} after the close`);
        }
    } finally {
        observer?.disconnect();
        globalThis.fetch = original;
        if (app && app.state !== 'disposed') app.dispose();
        host.stop();
    }
    return steps;
}

/**
 * The exact Data trace and transport requests of each step, and the DOM mutations of the steps driven by the
 * Data (the thaw and the close also rebuild or remove whole elements: their structural records are compared
 * between the two languages only).
 */
const EXPECTED = [
    {name: '1 first render', transport: ['main'], dom: ['childList:div@gramlot-root'], data: ['ins:story',
        'ins:story.settings', 'ins:story.settings.caption', 'upd_value:story.settings.caption', 'ins:story.size',
        'ins:story.gift', 'ins:story.live', 'ins:story.quantity', 'ins:story.total', 'ins:story.radius',
        'ins:story.color']},
    {name: '2 editing', transport: [], dom: ['characterData:#text@caption', 'characterData:#text@caption'],
        data: ['upd_value:story.settings.caption', 'upd_value:story.live', 'upd_value:story.settings.caption']},
    {name: '3 formula and controller', transport: [], dom: ['characterData:#text@total', 'attributes:circle@circle.r',
        'characterData:#text@total', 'attributes:circle@circle.r', 'attributes:circle@circle.fill'],
    data: ['upd_value:story.quantity', 'upd_value:story.total', 'upd_value:story.radius', 'upd_value:story.gift',
        'upd_value:story.total', 'upd_value:story.radius', 'upd_value:story.color']},
    {name: '4 radio', transport: [], dom: ['characterData:#text@total', 'attributes:circle@circle.r'],
        data: ['upd_value:story.size.large', 'upd_value:story.total', 'upd_value:story.radius',
            'upd_value:story.size.small']},
    {name: '5 button', transport: [], dom: ['characterData:#text@presses', 'characterData:#text@modifiers',
        'characterData:#text@presses', 'characterData:#text@modifiers'],
    data: ['ins:story.presses', 'ins:story.modifiers', 'upd_value:story.presses', 'upd_value:story.modifiers']},
    {name: '6 remoteSource', transport: ['source:extras'], dom: ['childList:section@extras',
        'childList:section@gramlot-root', 'childList:section@gramlot-root'],
    data: ['ins:extras', 'ins:extras.title', 'ins:extras.items']},
    {name: '7 freeze and thaw', transport: [], dom: ['characterData:#text@extras-title', 'characterData:#text@total',
        'attributes:circle@circle.r', 'attributes:circle@circle.fill'],
    data: ['upd_value:extras.title', 'upd_value:story.quantity', 'upd_value:story.total', 'upd_value:story.radius',
        'upd_value:story.color']},
    // The close removes every element; the radios leave their group on the way (their `name` is rewritten).
    // The Data write of the test after the close reaches nothing.
    {name: '8 close', transport: ['beacon:close'], dom: ['attributes:input@small.name', 'attributes:input@large.name'],
        data: ['upd_value:story.quantity']},
];

test('§8.1 story through the real Page/Host/TYTX/PageBootstrap path: Python and JavaScript pages agree', async t => {
    const records = {};
    for (const [language, open] of [['py', pythonHost], ['js', jsHost]]) {
        await t.test(`${language} page`, async st => { records[language] = await runStory(st, open()); });
    }
    assert.deepEqual(records.py, records.js);
    const steps = records.js;
    assert.deepEqual(steps.map(({name}) => name), EXPECTED.map(({name}) => name));
    EXPECTED.forEach((expected, index) => {
        const step = steps[index];
        assert.deepEqual(step.data, expected.data, `${step.name}: Data trace`);
        assert.deepEqual(step.transport, expected.transport, `${step.name}: transport`);
        const dom = index < 6 ? step.dom : step.dom.filter(item => !item.startsWith('childList:'));
        assert.deepEqual(dom, expected.dom, `${step.name}: DOM mutations`);
    });
    // Counters: steady through the Data steps; the remote branch adds its NodeBindings (div, h3, p and two
    // setters), records and registrations; the removed note takes its own away; the close leaves nothing.
    const at = name => steps.find(step => step.name === name).counters;
    for (const name of ['2 editing', '3 formula and controller', '4 radio', '5 button']) {
        assert.deepEqual(at(name), at('1 first render'), name);
    }
    assert.deepEqual([at('1 first render').bindings, at('6 remoteSource').bindings, at('7 freeze and thaw').bindings],
        [52, 56, 55]);
    assert.deepEqual([at('1 first render').registrations, at('6 remoteSource').registrations], [18, 20]);
    for (const step of records.js) t.diagnostic(`${step.name}: ${JSON.stringify(step)}`);
});
