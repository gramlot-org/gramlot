/** The terminal component (#87): frames, socket address and declaration. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {fromTytx, toTytx} from '@genrojs/tytx';
import {GramlotServer, Page} from '../src/server/index.js';
import {PageStoreConnection} from '../src/page-store-connection.js';
import {ACK, INPUT, OUTPUT, RESIZE, ackFrame, binaryInputFrame, inputFrame, outputPayload, resizeFrame}
    from '../src/components/terminal.js';

test('input frames carry the UTF-8 bytes of the keys on channel 0', () => {
    assert.deepEqual([...inputFrame('ls\r')], [INPUT, 108, 115, 13]);
    assert.deepEqual([...inputFrame('è')], [INPUT, 0xc3, 0xa8]);
    assert.deepEqual([...binaryInputFrame('\x1b\xff')], [INPUT, 0x1b, 0xff]);
});

test('resize frames carry the Kubernetes JSON and acknowledgements a 32-bit big-endian count', () => {
    const resize = resizeFrame(24, 80);
    assert.equal(resize[0], RESIZE);
    assert.deepEqual(JSON.parse(new TextDecoder().decode(resize.subarray(1))), {Width: 80, Height: 24});
    assert.deepEqual([...ackFrame(65536)], [ACK, 0, 1, 0, 0]);
    assert.deepEqual([...ackFrame(0xffffffff)], [ACK, 255, 255, 255, 255]);
    for (const count of [-1, 1.5, 2 ** 32]) assert.throws(() => ackFrame(count), RangeError);
});

test('output payload is the frame without its channel; another channel is an error', () => {
    const frame = new Uint8Array([OUTPUT, 104, 105]).buffer;
    assert.deepEqual([...outputPayload(frame)], [104, 105]);
    assert.throws(() => outputPayload(new Uint8Array([RESIZE, 1]).buffer), /channel 4/);
    assert.throws(() => outputPayload(new ArrayBuffer(0)), /Unexpected terminal frame/);
});

test('the terminal socket is the terminal route beside the store route, with page and session', () => {
    const connection = {endpoint: 'wss://example.test/py/gramlot/store', gramlot: {pageId: 'p 1'}};
    assert.equal(PageStoreConnection.prototype.terminalUrl.call(connection, 'shell'),
        'wss://example.test/py/gramlot/terminal?pageId=p+1&session=shell');
});

test('a page declares a terminal of the standard editors collection', async () => {
    class TerminalPage extends Page {
        main(root) { root.terminal({session: 'echo', fontSize: 13, connected: '^.connected'}); }
    }
    const server = new (class extends GramlotServer {
        async resolvePage() { return TerminalPage; }
        async resolveResources() { return {css: [], js: []}; }
    })();
    const {pageId} = await server.openPage('/');
    const result = fromTytx(await server.call(toTytx({id: 'r1', pageId, contentType: 'source', name: 'main', params: {}})));
    assert.equal(result.error, undefined);
    const node = result.value.getNode('#0');
    assert.equal(node.nodeTag, 'terminal');
    assert.equal(node.getAttr('session'), 'echo');
    assert.equal(node.getAttr('_meta').render_tag, 'gramlot-terminal');
});
