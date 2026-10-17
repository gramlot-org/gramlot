import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Bag, Gramlot, GramlotBuilder} from '@gramlot/gramlot';
import {createRequire} from 'node:module';
import {MessageChannel} from 'node:worker_threads';
const require = createRequire(import.meta.url);
const coreRequire = createRequire(require.resolve('@gramlot/gramlot'));
const {BagResolver} = await import(coreRequire.resolve('@genrojs/bag'));

const {window} = new JSDOM('<main></main>', {url: 'https://inspector.test/'});
Object.assign(globalThis, {HTMLElement: window.HTMLElement, customElements: window.customElements});
const {InspectorConnection, attachInspectorAgent} = await import('../dist/gramlot-tools-inspector.js');
window.HTMLDialogElement.prototype.showModal = function () {this.open = true;};
window.HTMLDialogElement.prototype.close = function () {this.open = false;};
const tick = () => new Promise(resolve => queueMicrotask(resolve));
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
function inspector(app) {
    const element = window.document.createElement('gramlot-tools-inspector');
    element.gramlot = app;
    window.document.body.append(element);
    if (app) assert.equal(element.shadowRoot.querySelector('[role=alert]').textContent, '');
    return element;
}
function button(element, text) {
    return [...element.shadowRoot.querySelectorAll('button')].find(node => node.textContent === text || node.getAttribute('aria-label') === text);
}
function tree(element) { return element.shadowRoot.querySelector('gramlot-poc-tree:not([hidden])'); }
function row(element, path) { return tree(element).shadowRoot.querySelector(`[data-node-path="${path}"]`); }
function select(element, path) { const node = row(element, path); assert.ok(node, path); node.click(); }
function field(element, label = 'Value') { return element.shadowRoot.querySelector(`[aria-label="${label}"]`); }
function save(element, label = 'Value') { field(element, label).dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Enter', bubbles: true})); }
function revert(element) { field(element).dispatchEvent(new window.KeyboardEvent('keydown', {key: 'Escape', bubbles: true})); }
function openBreakpoint(element, path) { row(element, path).querySelector('[data-action=breakpoint]').click(); }
function subscriberCount(bag) {
    return Object.keys(bag._updSubscribers).length + Object.keys(bag._insSubscribers).length + Object.keys(bag._delSubscribers).length;
}

test('clearing connected targets detaches the view; local assignment removes the remote selector', async () => {
    const app = target(), local = target();
    const channel = new MessageChannel();
    const agent = attachInspectorAgent(app, channel.port1), connection = new InspectorConnection(channel.port2);
    const element = inspector(null);
    try {
        element.targets = [{id:'page', title:'Page', connection}];
        element.targets = [];
        assert.equal(element.selectedTarget, null);
        assert.equal(element.gramlot, null);
        assert.equal(tree(element).storeBag, null);
        element.targets = [{id:'page', title:'Page', connection}];
        element.gramlot = local;
        assert.deepEqual(element.targets, []);
        assert.equal(element.selectedTarget, null);
        assert.equal(tree(element).storeBag, local.data);
    } finally {element.remove(); connection.close(); agent.dispose(); app.dispose(); local.dispose();}
});

test('Data and Source are live; literal pointer and markup values remain text', async () => {
    const app = target();
    const element = inspector(app);
    select(element, 'name');
    assert.equal(field(element)?.value ?? '', 'Ada');
    assert.equal(field(element, 'description value').value, 'Name');
    app.data.setItem('name', '<img src=x onerror=alert(1)>');
    await tick();
    assert.equal(row(element, 'name').querySelector('.caption').textContent, 'name');
    assert.equal(element.shadowRoot.querySelectorAll('img').length, 0);
    assert.equal(field(element)?.value ?? '', '<img src=x onerror=alert(1)>');
    button(element, 'Source').click();
    select(element, 'main.greeting');
    assert.equal(field(element)?.value ?? '', '^name');
    app.src.source.getNode('main.greeting').setAttr({title: 'Updated'});
    await tick();
    assert.equal(field(element, 'title value').value, 'Updated');
    element.remove(); app.dispose();
});

test('retargeting, closing, reconnecting and multiple palettes release independent subscriptions', async () => {
    const app = target(); const second = target();
    const baseline = subscriberCount(app.data) + subscriberCount(app.src.source);
    const first = inspector(app); const other = inspector(app);
    assert.equal(subscriberCount(app.data) + subscriberCount(app.src.source), baseline + 24);
    app.data.setItem('name', 'Queued');
    first.gramlot = second;
    await tick();
    select(first, 'name'); assert.equal(field(first).value, 'Ada');
    first.shadowRoot.querySelector('gramlot-poc-palette').shadowRoot.querySelector('.close').click();
    assert.equal(first.isConnected, false);
    window.document.body.append(first);
    select(first, 'name'); assert.equal(field(first).value, 'Ada');
    first.remove(); other.remove();
    assert.equal(subscriberCount(app.data) + subscriberCount(app.src.source), baseline);
    app.dispose(); second.dispose();
});

test('inspection reads resolver caches without running resolvers and does not mutate the target', () => {
    const app = target();
    let calls = 0;
    class Deferred extends BagResolver { load() { calls++; return 99; } }
    app.data.setItem('deferred', new Deferred());
    const before = app.data.getNodes().map(node => [node, node.getValue(true), node.resolver]);
    const changes = [];
    app.data.subscribe('inspection-proof', {any: event => changes.push(event)});
    const element = inspector(app);
    select(element, 'deferred');
    assert.equal(calls, 0);
    assert.deepEqual(app.data.getNodes().map(node => [node, node.getValue(true), node.resolver]), before);
    assert.deepEqual(changes, []);
    app.data.unsubscribe('inspection-proof', {any: true});
    element.remove(); app.dispose();
});

test('the target is explicit and rejects lookalikes and disposed instances', () => {
    const element = inspector(null);
    assert.match(element.shadowRoot.textContent, /No Gramlot instance selected/);
    assert.throws(() => { element.gramlot = {data: new Bag(), src: {source: new Bag()}}; }, /live Gramlot/);
    const app = target(); app.dispose();
    assert.throws(() => { element.gramlot = app; }, /live Gramlot/);
    element.remove();
});


test('selection follows node identity across siblings and clears when that node is deleted', async () => {
    const app = target();
    const element = inspector(app);
    select(element, 'name');
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
    const element = inspector(app);
    const branch = tree(element).shadowRoot.querySelector('details');
    branch.open = false;
    branch.dispatchEvent(new window.Event('toggle'));
    app.data.setItem('nested.count', 43);
    await tick();
    assert.equal(tree(element).shadowRoot.querySelector('details').open, false);
    button(element, 'Source').click();
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
const breakpointStatus = element => element.shadowRoot.querySelector('.breakpoint-dialog .breakpoint-status').textContent;

test('grid edits cells on leaving the row; names stay fixed; new attributes are typed and removable', async () => {
    const app = target(); const element = inspector(app);
    select(element, 'name');
    assert.equal(field(element, 'description name'), null);
    assert.equal(field(element, 'description type'), null);
    edit(element, 'Value', '^literal');
    field(element).closest('.property-row').dispatchEvent(new window.FocusEvent('focusout', {bubbles:true}));
    assert.equal(app.data.getItem('name'), '^literal');
    button(element, 'Add attribute').click();
    edit(element, 'New attribute name', 'count');
    edit(element, 'New attribute type', 'integer');
    edit(element, 'New attribute value', '42');
    save(element, 'New attribute value');
    button(element, 'Add attribute').click();
    edit(element, 'New attribute name', 'nullable');
    edit(element, 'New attribute type', 'null');
    save(element, 'New attribute value');
    assert.deepEqual(app.data.getNode('name').getAttr(), {description: 'Name', count: 42, nullable: null});
    button(element, 'Remove description').click();
    assert.deepEqual(app.data.getNode('name').getAttr(), {count: 42, nullable: null});
    element.remove(); app.dispose();
});

test('invalid typed cells and conflicts never overwrite the target', async () => {
    const app = target(); const element = inspector(app);
    select(element, 'nested.count');
    edit(element, 'Value', '4.5'); save(element);
    assert.match(status(element), /Invalid integer/);
    assert.equal(app.data.getItem('nested.count'), 42);
    edit(element, 'Value', '5');
    app.data.setItem('nested.count', 99); await tick();
    assert.match(status(element), /outside this draft/);
    save(element);
    assert.equal(app.data.getItem('nested.count'), 99);
    assert.match(status(element), /Escape/);
    revert(element); edit(element, 'Value', '6'); save(element);
    assert.equal(app.data.getItem('nested.count'), 6);
    app.data.popNode('nested.count'); await tick();
    assert.equal(field(element), null);
    element.remove(); app.dispose();
});

test('Source editing updates the rendered page and preserves schema metadata', () => {
    const app = target(); const element = inspector(app);
    button(element, 'Source').click(); select(element, 'main.greeting');
    const node = app.src.source.getNode('main.greeting');
    const metadata = node.getAttr('_meta');
    edit(element, 'Value', 'Changed in inspector');
    button(element, 'Add attribute').click();
    edit(element, 'New attribute name', 'title');
    edit(element, 'New attribute value', 'Edited title');
    save(element);
    assert.equal(app.src.renderer.destination.querySelector('p').textContent, 'Changed in inspector');
    assert.equal(app.src.renderer.destination.querySelector('p').title, 'Edited title');
    assert.equal(node.getAttr('_meta'), metadata);
    element.remove(); app.dispose();
});

test('resolver values and containers are not replaced by editing; inspection never resolves them', () => {
    const app = target(); let calls = 0;
    class Deferred extends BagResolver { load() { calls++; return 99; } }
    const resolver = new Deferred(); app.data.setItem('deferred', resolver);
    const element = inspector(app); select(element, 'deferred');
    assert.equal(field(element).disabled, true);
    button(element, 'Add attribute').click();
    edit(element, 'New attribute name', 'hint'); edit(element, 'New attribute value', 'Lazy');
    save(element);
    assert.equal(calls, 0);
    assert.equal(app.data.getNode('deferred').resolver, resolver);
    select(element, 'nested');
    assert.equal(field(element), null);
    element.remove(); app.dispose();
});

test('path breakpoints are synchronous, conditional, root-specific and removed on disconnect', async () => {
    const app = target(); const element = inspector(app);
    const hits = []; const log = window.console.log;
    window.console.log = (...args) => hits.push(args);
    try {
        select(element, 'name');
        openBreakpoint(element, 'name');
        edit(element, 'Breakpoint mode', 'console');
        edit(element, 'Breakpoint condition', 'value === "Grace"');
        button(element, 'Save').click();
        app.data.setItem('name', 'Ada'); assert.equal(hits.length, 0);
        app.data.setItem('name', 'Grace'); assert.equal(hits.length, 1);
        assert.equal(hits[0][1], 'data');
        assert.equal(hits[0][2].path, 'name');
        assert.equal(hits[0][2].oldvalue, 'Ada');
        await tick();
        openBreakpoint(element, 'name');
        edit(element, 'Breakpoint condition', '(()');
        button(element, 'Save').click();
        assert.match(breakpointStatus(element), /not saved/);
        app.data.setItem('name', 'Again'); app.data.setItem('name', 'Grace');
        assert.equal(hits.length, 2); // Failed compilation leaves the old breakpoint intact.
        edit(element, 'Breakpoint condition', ''); button(element, 'Save').click();
        app.data.popNode('name'); assert.equal(hits.length, 3);
        assert.equal(hits[2][2].evt, 'del');
        app.data.setItem('name', 'Inserted'); assert.equal(hits.length, 4);
        assert.equal(hits[3][2].evt, 'ins');
        app.data.clear(); assert.equal(hits.length, 5);
        element.remove(); app.data.setItem('name', 'Closed'); assert.equal(hits.length, 5);
    } finally { window.console.log = log; element.remove(); app.dispose(); }
});

test('Source attribute breakpoints and condition errors stay in their inspected instance', async () => {
    const app = target(); const second = target(); const element = inspector(app);
    const hits = []; const log = window.console.log; window.console.log = (...args) => hits.push(args);
    try {
        button(element, 'Source').click(); select(element, 'main.greeting');
        openBreakpoint(element, 'main.greeting');
        edit(element, 'Breakpoint mode', 'console');
        edit(element, 'Breakpoint condition', 'evt === "upd_attrs"'); button(element, 'Save').click();
        app.src.source.getNode('main.greeting').setAttr({title: 'Hit'});
        assert.equal(hits.length, 1); assert.equal(hits[0][2].path, 'main.greeting');
        await tick();
        openBreakpoint(element, 'main.greeting');
        edit(element, 'Breakpoint condition', 'missingName.value'); button(element, 'Save').click();
        assert.doesNotThrow(() => app.src.source.getNode('main.greeting').setAttr({title: 'Error'}));
        assert.match(breakpointStatus(element), /Condition failed/);
        assert.equal(hits.length, 1);
        element.gramlot = second;
        app.src.source.getNode('main.greeting').setAttr({title: 'Old target'});
        second.src.source.getNode('main.greeting').setAttr({title: 'New target'});
        assert.equal(hits.length, 1);
    } finally { window.console.log = log; element.remove(); app.dispose(); second.dispose(); }
});

test('attribute edits preserve an unedited Date identity and reject internal metadata injection', () => {
    const app = target(); const date = new Date('2026-09-30T00:00:00.000Z');
    app.data.setItem('when', date);
    const element = inspector(app); select(element, 'when');
    button(element, 'Add attribute').click();
    edit(element, 'New attribute name', '_meta'); edit(element, 'New attribute value', 'invalid');
    save(element);
    assert.match(status(element), /Unsupported attribute/);
    assert.equal(app.data.getNode('when').getAttr('_meta'), null);
    edit(element, 'New attribute name', 'caption'); edit(element, 'New attribute value', 'Day');
    save(element);
    assert.equal(app.data.getItem('when'), date);
    assert.equal(app.data.getNode('when').getAttr('caption'), 'Day');
    element.remove(); app.dispose();
});


test('a breakpoint action targets its own row; the active list removes deleted paths', () => {
    const app = target(); const element = inspector(app);
    select(element, 'name'); openBreakpoint(element, 'nested.count');
    edit(element, 'Breakpoint mode', 'console'); button(element, 'Save').click();
    assert.equal(field(element).value, 'Ada');
    assert.ok(row(element, 'nested.count').querySelector('button.active'));
    app.data.popNode('nested.count');
    button(element, 'Active breakpoints').click();
    button(element, 'Remove breakpoint data: nested.count').click();
    assert.equal(button(element, 'Active breakpoints').hidden, true);
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
    const element = inspector(remote ? null : app);
    const wait = async predicate => {
        const end = Date.now() + 3000;
        while (!predicate()) {
            if (Date.now() > end) throw new Error('Inspector enum update timeout');
            await new Promise(resolve => setTimeout(resolve, 5));
        }
    };
    try {
        if (remote) { element.targets = [{id: 'page', title: 'Page', connection}]; await wait(() => connection.state === 'started'); }
        button(element, 'Source').click(); select(element, 'main.check');
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
    const app = target(), element = inspector(app);
    await tick();
    select(element, 'name');
    const palette = element.shadowRoot.querySelector('gramlot-poc-palette');
    const editor = field(element);
    editor.value = 'Uncommitted';
    for (const docked of [true, false, true]) {
        element.toggleAttribute('docked', docked);
        assert.equal(element.shadowRoot.querySelector('gramlot-poc-palette'), palette);
        assert.equal(palette.hasAttribute('docked'), docked);
        assert.equal(field(element), editor);
        assert.equal(editor.value, 'Uncommitted');
        assert.equal(app.data.getItem('name'), 'Ada');
    }
    element.hidden = true; element.hidden = false;
    assert.equal(field(element), editor);
    assert.equal(editor.value, 'Uncommitted');
    element.remove(); app.dispose();
});
