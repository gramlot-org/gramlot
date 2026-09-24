import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';

function page() {
    const {window} = new JSDOM('<main id="gramlot-root"></main>');
    const requests = [];
    const beacons = [];
    window.navigator.sendBeacon = (url, body) => { beacons.push({url, body}); return true; };
    const fetcher = (url, options) => {
        requests.push({url, options});
        return Promise.resolve({ok: true, text: async () => new GramlotBuilder().toTytx()});
    };
    const app = new Gramlot({pageId: 'page', document: window.document,
        mainUrl: '/prefix/main', sourceUrl: '/prefix/source', closeUrl: '/prefix/close'});
    app.transport.fetcher = fetcher;
    return {window, app, requests, beacons};
}

test('explicit disposal sends one owned close request and releases the page locally', async () => {
    const {window, app, requests, beacons} = page();
    await app.start();
    app.dispose();
    app.dispose();
    window.dispatchEvent(new window.Event('pagehide'));
    assert.equal(requests.length, 2);
    assert.equal(requests[1].url, '/prefix/close');
    assert.equal(requests[1].options.keepalive, true);
    assert.equal(requests[1].options.credentials, 'same-origin');
    assert.equal(requests[1].options.body, '{"pageId":"page"}');
    assert.equal(beacons.length, 0);
    assert.equal(app.state, 'disposed');
});

test('pagehide sends a JSON beacon, but a retained page stays active', async () => {
    const {window, app, requests, beacons} = page();
    await app.start();
    const retained = new window.Event('pagehide');
    Object.defineProperty(retained, 'persisted', {value: true});
    window.dispatchEvent(retained);
    assert.equal(app.state, 'started');
    assert.equal(beacons.length, 0);
    window.dispatchEvent(new window.Event('pagehide'));
    assert.equal(app.state, 'disposed');
    assert.equal(requests.length, 1);
    assert.equal(beacons.length, 1);
    assert.equal(beacons[0].url, '/prefix/close');
    assert.equal(beacons[0].body.type, 'application/json');
    assert.equal(await beacons[0].body.text(), '{"pageId":"page"}');
});
