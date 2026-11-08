import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import {createRequire, register} from 'node:module';
import {MessageChannel} from 'node:worker_threads';
import {layoutWindow} from '../../../js/tests/helpers/layout-window.js';
const require = createRequire(import.meta.url);
const coreRequire = createRequire(require.resolve('@gramlot/gramlot'));
const {BagResolver} = await import(coreRequire.resolve('@genrojs/bag'));

const {window} = new JSDOM('<main></main>', {url: 'https://inspector.test/'});
layoutWindow(window);
Object.assign(globalThis, {HTMLElement: window.HTMLElement, customElements: window.customElements});
register(new URL('./layout-loader.mjs', import.meta.url), import.meta.url);
const {InspectorConnection, attachInspectorAgent} = await import('../dist/gramlot-tools-inspector.js');
// jsdom has no MessageChannel; a local target is inspected over Node's.
window.MessageChannel = MessageChannel;
window.HTMLDialogElement.prototype.showModal = function () {this.open = true;};
window.HTMLDialogElement.prototype.show = function () {this.open = true;};
window.HTMLDialogElement.prototype.close = function () {this.open = false;};
// Port messages are tasks: a tick lets the copies and replies of the agent arrive.
const tick = () => new Promise(resolve => setTimeout(resolve, 20));
const wait = async (predicate, message = 'Inspector update timeout') => {
    const end = Date.now() + 3000;
    while (!predicate()) {
        if (Date.now() > end) throw new Error(message);
        await new Promise(resolve => setTimeout(resolve, 5));
    }
};
function target() {
    const mount = window.document.createElement('main');
    window.document.body.append(mount);
    const app = new Gramlot({document: window.document, element: mount, transport: false});
    const builder = new GramlotBuilder();
    builder.root.p('^name', {node_label: 'greeting'});
    app.data.setItem('name', 'Ada', {description: 'Name'});
    app.data.setItem('nested', new Bag({count: 42}));
    app.src.startSource(builder.source);
    return app;
}
async function inspector(app) {
    const element = window.document.createElement('gramlot-tools-inspector');
    element.gramlot = app;
    window.document.body.append(element);
    if (app) await wait(() => element.shadowRoot.querySelector('[role=alert]').textContent === ''
        && tree(element)?.shadowRoot.querySelector('[role="treeitem"]'));
    return element;
}
function button(element, text) {
    const tabs = element.shadowRoot.querySelector('gramlot-tab-container')?.shadowRoot;
    return [...element.shadowRoot.querySelectorAll('button'), ...(tabs?.querySelectorAll('button') ?? [])].find(node => node.textContent === text || node.getAttribute('aria-label') === text);
}
function tree(element) { return element.shadowRoot.querySelector('gramlot-tree:not([hidden])'); }
function row(element, path) { return tree(element).shadowRoot.querySelector(`[role="treeitem"][data-path="${path}"]`); }
async function select(element, path) { await tick(); const node = row(element, path); assert.ok(node, path); node.querySelector('.row').click(); await tick(); }
function field(element, label = 'Value') { return element.shadowRoot.querySelector(`[aria-label="${label}"]`); }
function save(element, label = 'Value') { field(element, label).dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Enter', bubbles: true})); }
function revert(element) { field(element).dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Escape', bubbles: true})); }
async function openBreakpoint(element, path) { await tick(); row(element, path).querySelector('.row').dispatchEvent(new window.Event('pointerenter')); tree(element).querySelector('[rowaction=breakpoint]').control.click(); await tick(); }
function subscriberCount(bag) {
    return Object.keys(bag._updSubscribers).length + Object.keys(bag._insSubscribers).length + Object.keys(bag._delSubscribers).length;
}

test('clearing connected targets detaches the view; local assignment removes the remote selector', async () => {
    const app = target(), local = target();
    const channel = new MessageChannel();
    const agent = attachInspectorAgent(app, channel.port1), connection = new InspectorConnection(channel.port2);
    const element = await inspector(null);
    try {
        element.targets = [{id:'page', title:'Page', connection}];
        element.targets = [];
        assert.equal(element.selectedTarget, null);
        assert.equal(element.gramlot, null);
        assert.equal(tree(element).storeBag.getNodes().length, 0);
        element.targets = [{id:'page', title:'Page', connection}];
        element.gramlot = local;
        assert.deepEqual(element.targets, []);
        assert.equal(element.selectedTarget, null);
        await wait(() => tree(element).storeBag.getItem('name') === 'Ada');
        assert.notEqual(tree(element).storeBag, local.data);
    } finally {element.remove(); connection.close(); agent.dispose(); app.dispose(); local.dispose();}
});

test('Data and Source are live; literal pointer and markup values remain text', async () => {
    const app = target();
    const element = await inspector(app);
    await select(element, 'name');
    assert.equal(field(element)?.value ?? '', 'Ada');
    assert.equal(field(element, 'description value').value, 'Name');
    app.data.setItem('name', '<img src=x onerror=alert(1)>');
    await tick();
    assert.equal(row(element, 'name').querySelector('.caption').textContent, 'name');
    assert.equal(element.shadowRoot.querySelectorAll('img').length, 0);
    assert.equal(field(element)?.value ?? '', '<img src=x onerror=alert(1)>');
    await tick(); button(element, 'Source').click();
    await select(element, 'main.greeting');
    assert.equal(field(element)?.value ?? '', '^name');
    app.src.source.getNode('main.greeting').setAttr({title: 'Updated'});
    await tick();
    assert.equal(field(element, 'title value').value, 'Updated');
    element.remove(); app.dispose();
});

test('retargeting, closing, reconnecting and multiple palettes release independent subscriptions', async () => {
    const app = target(); const second = target();
    const baseline = subscriberCount(app.data) + subscriberCount(app.src.source);
    const first = await inspector(app); const other = await inspector(app);
    // Each palette's agent and history subscribe the two roots of the target.
    const perPalette = (subscriberCount(app.data) + subscriberCount(app.src.source) - baseline) / 2;
    assert.ok(Number.isInteger(perPalette) && perPalette > 0);
    app.data.setItem('name', 'Queued');
    first.gramlot = second;
    assert.equal(subscriberCount(app.data) + subscriberCount(app.src.source), baseline + perPalette);
    await wait(() => row(first, 'name'));
    await select(first, 'name'); assert.equal(field(first).value, 'Ada');
    first.shadowRoot.querySelector('gramlot-floating-pane').closeButton.click(); await tick();
    assert.equal(first.isConnected, false);
    window.document.body.append(first);
    await wait(() => row(first, 'name'));
    await select(first, 'name'); assert.equal(field(first).value, 'Ada');
    first.remove(); other.remove();
    assert.equal(subscriberCount(app.data) + subscriberCount(app.src.source), baseline);
    app.dispose(); second.dispose();
});

test('inspection reads resolver caches without running resolvers and does not mutate the target', async () => {
    const app = target();
    let calls = 0;
    class Deferred extends BagResolver { load() { calls++; return 99; } }
    app.data.setItem('deferred', new Deferred());
    const before = app.data.getNodes().map(node => [node, node.getValue(true), node.resolver]);
    const changes = [];
    app.data.subscribe('inspection-proof', {any: event => changes.push(event)});
    const element = await inspector(app);
    await select(element, 'deferred');
    assert.equal(calls, 0);
    assert.deepEqual(app.data.getNodes().map(node => [node, node.getValue(true), node.resolver]), before);
    assert.deepEqual(changes, []);
    app.data.unsubscribe('inspection-proof', {any: true});
    element.remove(); app.dispose();
});

test('the target is explicit and rejects lookalikes and disposed instances', async () => {
    const element = await inspector(null);
    assert.match(element.shadowRoot.textContent, /No Gramlot instance selected/);
    assert.throws(() => { element.gramlot = {data: new Bag(), src: {source: new Bag()}}; }, /live Gramlot/);
    const app = target(); app.dispose();
    assert.throws(() => { element.gramlot = app; }, /live Gramlot/);
    element.remove();
});


test('selection follows node identity across siblings and clears when that node is deleted', async () => {
    const app = target();
    const element = await inspector(app);
    await select(element, 'name');
    app.data.popNode('nested');
    app.data.setItem('new', 'Another');
    await tick();
    assert.equal(field(element)?.value ?? '', 'Ada');
    app.data.popNode('name');
    await tick();
    assert.equal(field(element)?.value ?? '', '');
    element.remove(); app.dispose();
});


test('a collapsed branch stays collapsed after a target update', async () => {
    const app = target();
    const element = await inspector(app);
    await tick();
    const branch = row(element, 'nested');
    assert.equal(branch.getAttribute('aria-expanded'), 'false');
    app.data.setItem('nested.count', 43);
    await tick();
    assert.equal(row(element, 'nested').getAttribute('aria-expanded'), 'false');
    await tick(); button(element, 'Source').click();
    assert.equal(button(element, 'Source').getAttribute('aria-selected'), 'true');
    element.remove(); app.dispose();
});

function edit(element, label, value) {
    const input = [...element.shadowRoot.querySelectorAll('input, textarea, select')].find(node => node.getAttribute('aria-label') === label);
    assert.ok(input, `Missing ${label}`);
    input.value = value;
    input.dispatchEvent(new window.Event(input.tagName === 'SELECT' ? 'change' : 'input', {bubbles: true}));
}
const status = element => element.shadowRoot.querySelector('.edit-status').textContent;
const breakpointError = element => element.shadowRoot.querySelector('.properties .breakpoint-status').textContent;
const dialog = element => element.shadowRoot.querySelector('dialog.breakpoint-dialog');
/** The palette is idle: no command waits for the agent's reply. */
const idle = element => wait(() => !element.shadowRoot.querySelector('fieldset').disabled);
const breakpointStatus = element => element.shadowRoot.querySelector('.breakpoint-dialog .breakpoint-status').textContent;

test('grid edits cells on leaving the row; names stay fixed; new attributes are typed and removable', async () => {
    const app = target(); const element = await inspector(app);
    await select(element, 'name');
    assert.equal(field(element, 'description name'), null);
    assert.equal(field(element, 'description type'), null);
    edit(element, 'Value', '^literal');
    field(element).closest('.property-row').dispatchEvent(new window.FocusEvent('focusout', {bubbles:true}));
    await wait(() => app.data.getItem('name') === '^literal'); await idle(element);
    button(element, 'Add attribute').click();
    edit(element, 'New attribute name', 'count');
    edit(element, 'New attribute type', 'integer');
    edit(element, 'New attribute value', '42');
    save(element, 'New attribute value');
    await wait(() => app.data.getNode('name').getAttr('count') === 42); await idle(element);
    button(element, 'Add attribute').click();
    edit(element, 'New attribute name', 'nullable');
    edit(element, 'New attribute type', 'null');
    save(element, 'New attribute value');
    await wait(() => Object.hasOwn(app.data.getNode('name').getAttr(), 'nullable')); await idle(element);
    assert.deepEqual(app.data.getNode('name').getAttr(), {description: 'Name', count: 42, nullable: null});
    button(element, 'Remove description').click();
    await wait(() => !Object.hasOwn(app.data.getNode('name').getAttr(), 'description'));
    assert.deepEqual(app.data.getNode('name').getAttr(), {count: 42, nullable: null});
    element.remove(); app.dispose();
});

test('invalid typed cells and conflicts never overwrite the target', async () => {
    const app = target(); const element = await inspector(app);
    await select(element, 'nested.count');
    edit(element, 'Value', '4.5'); save(element);
    assert.match(status(element), /Invalid integer/);
    assert.equal(app.data.getItem('nested.count'), 42);
    edit(element, 'Value', '5');
    app.data.setItem('nested.count', 99); await tick();
    assert.match(status(element), /outside this draft/);
    save(element);
    await wait(() => /Escape/.test(status(element)));
    assert.equal(app.data.getItem('nested.count'), 99);
    await idle(element);
    // A bubbling Escape also reaches the floating window, which then closes the palette
    // (pre-existing, outside the inspector): the cell receives it alone here.
    field(element).dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Escape'}));
    edit(element, 'Value', '6'); save(element);
    await wait(() => app.data.getItem('nested.count') === 6);
    app.data.popNode('nested.count'); await tick();
    assert.equal(field(element), null);
    element.remove(); app.dispose();
});

test('shared tabs retain an invalid draft and switch after a valid edit', async () => {
    const app = target(); const element = await inspector(app);
    await select(element, 'nested.count');
    edit(element, 'Value', '4.5');
    button(element, 'Source').click(); await tick();
    assert.equal(button(element, 'Data').getAttribute('aria-selected'), 'true');
    assert.equal(app.data.getItem('nested.count'), 42);
    assert.match(status(element), /Invalid integer/);
    edit(element, 'Value', '6');
    button(element, 'Source').click();
    await wait(() => app.data.getItem('nested.count') === 6 && button(element, 'Source').getAttribute('aria-selected') === 'true');
    element.remove(); app.dispose();
});

test('Source editing updates the rendered page and preserves schema metadata', async () => {
    const app = target(); const element = await inspector(app);
    await tick(); button(element, 'Source').click(); await select(element, 'main.greeting');
    const node = app.src.source.getNode('main.greeting');
    const metadata = node.getAttr('_meta');
    edit(element, 'Value', 'Changed in inspector');
    button(element, 'Add attribute').click();
    await wait(() => field(element, 'New attribute name'));
    edit(element, 'New attribute name', 'title');
    edit(element, 'New attribute value', 'Edited title');
    save(element);
    await wait(() => app.src.renderer.destination.querySelector('p').title === 'Edited title');
    assert.equal(app.src.renderer.destination.querySelector('p').textContent, 'Changed in inspector');
    assert.equal(app.src.renderer.destination.querySelector('p').title, 'Edited title');
    assert.equal(node.getAttr('_meta'), metadata);
    element.remove(); app.dispose();
});

test('resolver values and containers are not replaced by editing; inspection never resolves them', async () => {
    const app = target(); let calls = 0;
    class Deferred extends BagResolver { load() { calls++; return 99; } }
    const resolver = new Deferred(); app.data.setItem('deferred', resolver);
    const element = await inspector(app); await select(element, 'deferred');
    assert.equal(field(element).disabled, true);
    button(element, 'Add attribute').click();
    edit(element, 'New attribute name', 'hint'); edit(element, 'New attribute value', 'Lazy');
    save(element);
    await wait(() => app.data.getNode('deferred').getAttr('hint') === 'Lazy');
    assert.equal(calls, 0);
    assert.equal(app.data.getNode('deferred').resolver, resolver);
    await select(element, 'nested');
    assert.equal(field(element), null);
    element.remove(); app.dispose();
});

test('path breakpoints are synchronous, conditional, root-specific and removed on disconnect', async () => {
    const app = target(); const element = await inspector(app);
    const hits = []; const log = window.console.log;
    window.console.log = (...args) => hits.push(args);
    try {
        await select(element, 'name');
        await openBreakpoint(element, 'name');
        edit(element, 'Breakpoint mode', 'console');
        edit(element, 'Breakpoint condition', 'value === "Grace"');
        button(element, 'Save').click();
        await wait(() => !dialog(element).open);
        app.data.setItem('name', 'Ada'); assert.equal(hits.length, 0);
        app.data.setItem('name', 'Grace'); assert.equal(hits.length, 1);
        assert.equal(hits[0][1], 'data');
        assert.equal(hits[0][2].path, 'name');
        assert.equal(hits[0][2].oldvalue, 'Ada');
        await tick();
        await openBreakpoint(element, 'name');
        edit(element, 'Breakpoint condition', '(()');
        button(element, 'Save').click();
        await wait(() => /not saved/.test(breakpointStatus(element)));
        app.data.setItem('name', 'Again'); app.data.setItem('name', 'Grace');
        assert.equal(hits.length, 2); // Failed compilation leaves the old breakpoint intact.
        edit(element, 'Breakpoint condition', ''); button(element, 'Save').click();
        await wait(() => !dialog(element).open);
        app.data.popNode('name'); assert.equal(hits.length, 3);
        assert.equal(hits[2][2].evt, 'del');
        app.data.setItem('name', 'Inserted'); assert.equal(hits.length, 4);
        assert.equal(hits[3][2].evt, 'ins');
        app.data.clear(); assert.equal(hits.length, 5);
        element.remove(); app.data.setItem('name', 'Closed'); assert.equal(hits.length, 5);
    } finally { window.console.log = log; element.remove(); app.dispose(); }
});

test('Source attribute breakpoints and condition errors stay in their inspected instance', async () => {
    const app = target(); const second = target(); const element = await inspector(app);
    const hits = []; const log = window.console.log; window.console.log = (...args) => hits.push(args);
    try {
        await tick(); button(element, 'Source').click(); await select(element, 'main.greeting');
        await openBreakpoint(element, 'main.greeting');
        edit(element, 'Breakpoint mode', 'console');
        edit(element, 'Breakpoint condition', 'evt === "upd_attrs"'); button(element, 'Save').click();
        await wait(() => !dialog(element).open);
        app.src.source.getNode('main.greeting').setAttr({title: 'Hit'});
        assert.equal(hits.length, 1); assert.equal(hits[0][2].path, 'main.greeting');
        await tick();
        await openBreakpoint(element, 'main.greeting');
        edit(element, 'Breakpoint condition', 'missingName.value'); button(element, 'Save').click();
        await wait(() => !dialog(element).open);
        assert.doesNotThrow(() => app.src.source.getNode('main.greeting').setAttr({title: 'Error'}));
        // The agent records the failed condition; the palette shows it beside the properties.
        await wait(() => /main\.greeting: missingName/.test(breakpointError(element)));
        assert.equal(hits.length, 1);
        element.gramlot = second;
        app.src.source.getNode('main.greeting').setAttr({title: 'Old target'});
        second.src.source.getNode('main.greeting').setAttr({title: 'New target'});
        assert.equal(hits.length, 1);
    } finally { window.console.log = log; element.remove(); app.dispose(); second.dispose(); }
});

test('attribute edits preserve an unedited Date identity and reject internal metadata injection', async () => {
    const app = target(); const date = new Date('2026-09-30T00:00:00.000Z');
    app.data.setItem('when', date);
    const element = await inspector(app); await select(element, 'when');
    button(element, 'Add attribute').click();
    edit(element, 'New attribute name', '_meta'); edit(element, 'New attribute value', 'invalid');
    save(element);
    assert.match(status(element), /Unsupported attribute/);
    assert.equal(app.data.getNode('when').getAttr('_meta'), null);
    edit(element, 'New attribute name', '_inspector'); save(element);
    assert.match(status(element), /Unsupported attribute/);
    edit(element, 'New attribute name', 'caption'); edit(element, 'New attribute value', 'Day');
    save(element);
    await wait(() => app.data.getNode('when').getAttr('caption') === 'Day');
    assert.equal(app.data.getItem('when'), date);
    assert.equal(app.data.getNode('when').getAttr('caption'), 'Day');
    element.remove(); app.dispose();
});


test('a breakpoint action targets its own row; the active list removes deleted paths', async () => {
    const app = target(); const element = await inspector(app);
    await select(element, 'name'); await openBreakpoint(element, 'nested.count');
    edit(element, 'Breakpoint mode', 'console'); button(element, 'Save').click();
    await wait(() => !dialog(element).open);
    assert.equal(field(element).value, 'Ada');
    await tick(); row(element, 'nested.count').querySelector('.row').dispatchEvent(new window.Event('pointerenter'));
    assert.equal(tree(element).querySelector('[rowaction=breakpoint]').icon.textContent, '●');
    assert.match(row(element, 'nested.count').querySelector('.caption').textContent, /●/);
    app.data.popNode('nested.count');
    button(element, 'Active breakpoints').click();
    button(element, 'Remove breakpoint data: nested.count').click();
    await wait(() => button(element, 'Active breakpoints').hidden === true);
    element.remove(); app.dispose();
});

for (const remote of [false, true]) test(`enum editors use component metadata and preserve pointers (${remote ? 'bridge' : 'local'})`, async () => {
    const {default: inputs} = await import('@gramlot/gramlot/components/inputs');
    const mount = window.document.createElement('main'); window.document.body.append(mount);
    const app = new Gramlot({document: window.document, element: mount, transport: false, collections: [inputs]});
    const builder = new GramlotBuilder(null, {collections: [inputs]});
    builder.root.checkbox({node_label: 'check', mode: 'switch', value: '^enabled', lbl_position: 'L'});
    app.data.setItem('enabled', true); app.data.setItem('presentation', 'switch');
    app.src.startSource(builder.source);
    const channel = remote ? new MessageChannel() : null;
    const agent = remote ? attachInspectorAgent(app, channel.port1) : null;
    const connection = remote ? new InspectorConnection(channel.port2) : null;
    const element = await inspector(remote ? null : app);
    const wait = async predicate => {
        const end = Date.now() + 3000;
        while (!predicate()) {
            if (Date.now() > end) throw new Error('Inspector enum update timeout');
            await new Promise(resolve => setTimeout(resolve, 5));
        }
    };
    try {
        if (remote) { element.targets = [{id: 'page', title: 'Page', connection}]; await wait(() => connection.state === 'started'); }
        await tick(); button(element, 'Source').click(); await select(element, 'main.check');
        const mode = field(element, 'mode value');
        assert.equal(mode.tagName, 'SELECT');
        assert.deepEqual([...mode.options].map(option => option.value), ['checkbox', 'switch']);
        assert.deepEqual([...field(element, 'lbl_position value').options].map(option => option.value), ['TL','TC','TR','L','R','BL','BC','BR']);
        edit(element, 'mode value', 'checkbox');
        const node = app.src.source.getNode('main.check');
        await wait(() => node.getAttr('mode') === 'checkbox');
        assert.equal(mount.querySelector('gramlot-checkbox').control.getAttribute('role'), null);
        // A second edit must retain the metadata after accepting the first one.
        await wait(() => !field(element, 'mode value').disabled);
        edit(element, 'mode value', 'switch');
        await wait(() => node.getAttr('mode') === 'switch');
        await wait(() => !field(element, 'mode value').disabled);
        node.setAttr({mode: '^presentation'});
        await wait(() => field(element, 'mode value')?.tagName === 'INPUT');
        assert.equal(field(element, 'mode value').value, '^presentation');
        assert.equal(field(element, 'value value').value, '^enabled');
        app.data.setItem('presentation', 'checkbox');
        assert.equal(node.getAttr('mode'), '^presentation');
    } finally {element.remove(); connection?.close(); agent?.dispose(); app.dispose(); mount.remove();}
});

test('docking keeps the inspector, selected path and unfinished editor value alive', async () => {
    const app = target(), element = await inspector(app);
    await tick();
    await select(element, 'name');
    const palette = element.shadowRoot.querySelector('gramlot-floating-pane');
    const editor = field(element);
    editor.value = 'Uncommitted';
    for (const docked of [true, false, true]) {
        element.toggleAttribute('docked', docked);
        assert.equal(element.shadowRoot.querySelector('gramlot-floating-pane'), palette);
        await tick(); assert.equal(palette.shell.hasAttribute('data-docked'), docked);
        assert.equal(field(element), editor);
        assert.equal(editor.value, 'Uncommitted');
        assert.equal(app.data.getItem('name'), 'Ada');
    }
    element.hidden = true; element.hidden = false;
    assert.equal(field(element), editor);
    assert.equal(editor.value, 'Uncommitted');
    element.remove(); app.dispose();
});

for (const remote of [false, true]) for (const kind of ['value', 'data attribute', 'source attribute']) {
    test(`boolean ${kind} commits on click without blur and supports undo (${remote ? 'bridge' : 'local'})`, async () => {
        const app = target();
        app.data.setItem('enabled', false, {active: false});
        const source = kind === 'source attribute';
        const node = source ? app.src.source.getNode('main.greeting') : app.data.getNode('enabled');
        if (source) node.setAttr({hidden: false});
        const name = source ? 'hidden' : 'active';
        const read = () => kind === 'value' ? node.value : node.getAttr(name);
        const label = kind === 'value' ? 'Value' : `${name} value`;
        const channel = remote ? new MessageChannel() : null;
        const agent = remote ? attachInspectorAgent(app, channel.port1) : null;
        const connection = remote ? new InspectorConnection(channel.port2) : null;
        const element = await inspector(remote ? null : app);
        const wait = async predicate => {
            const end = Date.now() + 3000;
            while (!predicate()) {
                if (Date.now() > end) throw new Error('Inspector boolean update timeout');
                await new Promise(resolve => setTimeout(resolve, 5));
            }
        };
        try {
            if (remote) {
                element.targets = [{id: 'page', title: 'Page', connection}];
                await wait(() => connection.state === 'started');
            }
            if (source) { await tick(); button(element, 'Source').click(); }
            await select(element, source ? 'main.greeting' : 'enabled');
            assert.equal(field(element, label).type, 'checkbox');
            field(element, label).focus();
            field(element, label).click();
            await wait(() => read() === true && !field(element, label).disabled);
            assert.equal(status(element), '');
            await wait(() => !button(element, '↶ Undo').disabled);
            button(element, '↶ Undo').click();
            await wait(() => read() === false && !field(element, label).disabled);
            assert.equal(button(element, '↶ Undo').disabled, true);
            button(element, '↷ Redo').click();
            await wait(() => read() === true && !field(element, label).disabled);
            field(element, label).click();
            await wait(() => read() === false && !field(element, label).disabled);
            assert.equal(field(element, label).checked, false);
        } finally {
            element.remove(); connection?.close(); agent?.dispose(); app.dispose();
        }
    });
}
