/** The terminal component's life (#87): socket, Data state, acknowledgements, session change and close. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

// The real xterm.js in JSDOM; esbuild turns the xterm style import into text, as the published bundle does.
const bundle = await build({stdin: {contents: `
    export {Gramlot, GramlotBuilder} from './src/index.js';
    export {default as editors} from './src/components/editors.js';
    export {default as layout} from './src/components/layout.js';
    export {ACK, OUTPUT, RESIZE} from './src/components/terminal.js';`, resolveDir: new URL('..', import.meta.url).pathname},
    bundle: true, write: false, format: 'esm', platform: 'node', loader: {'.css': 'text'}});
// A file URL: the runtime carries grid, whose collection assets are URLs relative to the module.
const folder = await mkdtemp(join(tmpdir(), 'gramlot-terminal-'));
await writeFile(join(folder, 'bundle.mjs'), bundle.outputFiles[0].text);
const {Gramlot, GramlotBuilder, editors, layout, ACK, OUTPUT, RESIZE} = await import(pathToFileURL(join(folder, 'bundle.mjs')).href);
await rm(folder, {recursive: true, force: true});

const {window} = new JSDOM('<body></body>', {pretendToBeVisual: true});
for (const name of ['window', 'document', 'MutationObserver', 'Window', 'HTMLElement', 'Node', 'getComputedStyle']) globalThis[name] = window[name];
window.ResizeObserver = class {observe() {} unobserve() {} disconnect() {}};
window.HTMLElement.prototype.showPopover ??= function () {};
window.HTMLCanvasElement.prototype.getContext = () => null;
window.matchMedia ??= () => ({matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}});

const sockets = [];
window.WebSocket = class extends window.EventTarget {
    constructor(url) { super(); this.url = url; this.readyState = 0; this.sent = []; this.closed = null; sockets.push(this); }
    send(bytes) { this.sent.push([...bytes]); }
    close(code) { this.closed = code ?? 1005; this.readyState = 3; this.dispatchEvent(new window.Event('close')); }
    open() { this.readyState = 1; this.dispatchEvent(new window.Event('open')); }
    receive(bytes) { const event = new window.Event('message'); event.data = new Uint8Array(bytes).buffer; this.dispatchEvent(event); }
};

function fixture(session = '^session') {
    sockets.length = 0;
    window.document.body.innerHTML = '<main id="gramlot-root"></main>';
    const app = new Gramlot({document: window.document, transport: false, collections: [layout, editors]});
    app._pageStore = {terminalUrl: name => `ws://example.test/gramlot/terminal?session=${name}`, close() {}};
    app.data.setItem('session', 'echo');
    const builder = new GramlotBuilder(null, {collections: [layout, editors]});
    builder.root.terminal({id: 'term', session, connected: '^state.connected', rows: '^state.rows', columns: '^state.columns'});
    app.src.startSource(builder.toTytx());
    const host = window.document.getElementById('term');
    return {app, host};
}

const settle = () => new Promise(resolve => setTimeout(resolve, 50));
const channels = socket => socket.sent.map(frame => frame[0]);

test('an open socket marks the Data connected with the size, and every output frame is acknowledged after the write', async () => {
    const {app, host} = fixture();
    await host.ready;
    assert.equal(sockets.length, 1);
    const socket = sockets[0];
    assert.equal(socket.url, 'ws://example.test/gramlot/terminal?session=echo');
    socket.open();
    assert.equal(app.data.getItem('state.connected'), true);
    assert.ok(app.data.getItem('state.rows') > 0 && app.data.getItem('state.columns') > 0);
    assert.equal(channels(socket)[0], RESIZE);
    socket.receive([OUTPUT, 104, 105, 33]);
    await settle();
    assert.deepEqual(socket.sent.at(-1), [ACK, 0, 0, 0, 3]);
    host.input('ls\r');
    assert.deepEqual(socket.sent.at(-1), [0, 108, 115, 13]);
    socket.close(1000);
    assert.equal(app.data.getItem('state.connected'), false);
    app.dispose();
});

test('a frame on another channel closes the socket and is not acknowledged', async () => {
    const {app, host} = fixture();
    await host.ready;
    const socket = sockets[0];
    socket.open();
    const before = socket.sent.length;
    socket.receive([RESIZE, 1]);
    await settle();
    assert.notEqual(socket.closed, null);
    assert.equal(socket.sent.length, before);
    assert.equal(app.data.getItem('state.connected'), false);
    app.dispose();
});

test('changing the session closes the old socket and opens the new session; late frames of the old one are ignored', async () => {
    const {app, host} = fixture();
    await host.ready;
    const first = sockets[0];
    first.open();
    app.data.setItem('session', 'shell');
    await host.ready;
    assert.equal(first.closed, 1000);
    assert.equal(sockets.length, 2);
    assert.equal(sockets[1].url, 'ws://example.test/gramlot/terminal?session=shell');
    const sent = first.sent.length;
    first.receive([OUTPUT, 120]);
    await settle();
    assert.equal(first.sent.length, sent);
    sockets[1].open();
    assert.equal(app.data.getItem('state.connected'), true);
    app.dispose();
});

test('removing the terminal closes its socket and marks the Data disconnected', async () => {
    const {app, host} = fixture();
    await host.ready;
    sockets[0].open();
    host.remove();
    assert.equal(sockets[0].closed, 1000);
    assert.equal(app.data.getItem('state.connected'), false);
    app.dispose();
});
