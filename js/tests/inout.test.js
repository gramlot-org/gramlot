/** gramlot.utl.inout in jsdom: email text, HTTP POST, save/restore with exact types, JSON/XML export, errors.
 * scripts/verify_inout_browser.mjs runs the same functions in real browsers. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createDecimal, isDecimal} from '@genrojs/tytx';
import {Gramlot, InOut} from '../src/index.js';

function page() {
    const {window} = new JSDOM('<title>Iscrizione</title><main id="gramlot-root"></main>');
    const app = new Gramlot({document: window.document, transport: false});
    app.data.setItem('modulo.nome', 'Rossi');
    app.data.setItem('modulo.nascita', new Date(Date.UTC(1990, 4, 2)));
    app.data.setItem('modulo.arrivo', new Date(Date.UTC(2026, 9, 3, 9, 30)));
    app.data.setItem('modulo.quota', createDecimal('12.50'));
    app.data.setItem('modulo.indirizzo.via', 'Roma 1');
    app.data.setItem('altro', 'testo');
    // Every link click is recorded: the URL and the download name, the file text read from its Blob.
    const links = [];
    const blobs = new Map();
    window.URL.createObjectURL = blob => { const url = `blob:${blobs.size}`; blobs.set(url, blob); return url; };
    window.URL.revokeObjectURL = () => {};
    window.HTMLAnchorElement.prototype.click = function () { links.push({href: this.href, download: this.download}); };
    // jsdom's Blob has no text(): a FileReader reads it.
    const file = index => new Promise(resolve => {
        const reader = new window.FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(blobs.get(links[index].href));
    });
    return {window, app, links, file};
}

test('gramlot.utl.inout is an InOut of the page instance', () => {
    const {app} = page();
    assert.ok(app.utl.inout instanceof InOut);
    assert.equal(app.utl.inout.gramlot, app);
    app.dispose();
});

test('sendMail: one readable line per leaf, the page title as subject, the mailto link followed', () => {
    const {app, links} = page();
    assert.equal(app.utl.inout.mailText('modulo'), [
        'nome: Rossi', 'nascita: 1990-05-02', 'arrivo: 2026-10-03T09:30:00.000Z', 'quota: 12.5',
        'indirizzo.via: Roma 1'].join('\n'));
    app.utl.inout.sendMail('modulo', 'segreteria@example.org');
    assert.equal(links.length, 1);
    const url = new URL(links[0].href);
    assert.equal(url.protocol, 'mailto:');
    assert.equal(decodeURIComponent(url.pathname), 'segreteria@example.org');
    assert.equal(url.searchParams.get('subject'), 'Iscrizione');
    assert.equal(url.searchParams.get('body'), app.utl.inout.mailText('modulo'));
    app.dispose();
});

test('sendMail: an email over the mailto: limit raises an Error and opens nothing', () => {
    const {app, links} = page();
    app.data.setItem('modulo.note', 'x'.repeat(2000));
    assert.throws(() => app.utl.inout.sendMail('modulo', 'a@example.org'),
        /^Error: gramlot\.utl\.inout\.sendMail: the email of 'modulo' is \d+ characters long, over the mailto: limit of 2000;/);
    assert.equal(links.length, 0);
    app.dispose();
});

test('a missing path or a value that is not a Bag raises an Error naming the path', () => {
    const {app} = page();
    for (const [path, run] of [['assente', inout => inout.sendMail('assente', 'a@example.org')],
        ['altro', inout => inout.save('altro', 'x.json')], ['modulo.nome', inout => inout.download('modulo.nome', 'x', 'json')]]) {
        assert.throws(() => run(app.utl.inout), {message: `gramlot.utl.inout: no data Bag at '${path}'`});
    }
    app.dispose();
});

test('sendHttp: a JSON POST of the branch as an object; a status out of 2xx rejects', async () => {
    const {window, app} = page();
    const requests = [];
    let status = 200;
    window.fetch = async (url, options) => { requests.push({url, options}); return {ok: status < 300, status}; };
    const response = await app.utl.inout.sendHttp('modulo', 'https://example.org/iscrizioni');
    assert.equal(response.status, 200);
    assert.equal(requests[0].url, 'https://example.org/iscrizioni');
    assert.equal(requests[0].options.method, 'POST');
    assert.equal(requests[0].options.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(requests[0].options.body), {nome: 'Rossi', nascita: '1990-05-02T00:00:00.000Z',
        arrivo: '2026-10-03T09:30:00.000Z', quota: '12.5', indirizzo: {via: 'Roma 1'}});
    status = 500;
    await assert.rejects(app.utl.inout.sendHttp('modulo', 'https://example.org/x'),
        {message: 'gramlot.utl.inout.sendHttp: https://example.org/x answered 500'});
    app.dispose();
});

test('save and restore: the TYTX file comes back with its exact date, datetime and decimal', async () => {
    const {window, app, links, file} = page();
    app.utl.inout.save('modulo', 'iscrizione.json');
    assert.equal(links[0].download, 'iscrizione.json');
    const text = await file(0);
    let chosen = text;
    window.HTMLInputElement.prototype.click = function () {
        // The File of Node, with text(), as the browser's.
        Object.defineProperty(this, 'files', {value: [new File([chosen], 'iscrizione.json')]});
        this.dispatchEvent(new window.Event('change'));
    };
    const restored = await app.utl.inout.restore('copia');
    assert.equal(app.data.getItem('copia'), restored);
    assert.equal(app.data.getItem('copia.nascita').toISOString(), '1990-05-02T00:00:00.000Z');
    assert.equal(app.data.getItem('copia.arrivo').toISOString(), '2026-10-03T09:30:00.000Z');
    assert.ok(isDecimal(app.data.getItem('copia.quota')));
    assert.equal(String(app.data.getItem('copia.quota')), '12.5');
    assert.equal(app.data.getItem('copia.indirizzo.via'), 'Roma 1');
    chosen = '{"not": "a branch"';
    await assert.rejects(app.utl.inout.restore('copia'), /^Error: gramlot\.utl\.inout\.restore: the file is not a saved Gramlot branch: /);
    app.dispose();
});

test('download: JSON from Bag.toJson, XML inside one root element, any other format raises', async () => {
    const {app, links, file} = page();
    app.data.setItem('export.nome', 'Rossi');
    app.data.setItem('export.anni', 36);
    app.data.setItem('export.quota', createDecimal('12.50'));
    app.utl.inout.download('export', 'dati.json', 'json');
    app.utl.inout.download('export', 'dati.xml', 'xml');
    assert.deepEqual(links.map(link => link.download), ['dati.json', 'dati.xml']);
    assert.deepEqual(JSON.parse(await file(0)), [{label: 'nome', value: 'Rossi', attr: {}},
        {label: 'anni', value: 36, attr: {}}, {label: 'quota', value: '12.5', attr: {}}]);
    assert.equal(await file(1),
        "<?xml version='1.0' encoding='UTF-8'?>\n<export><nome>Rossi</nome><anni>36</anni><quota>12.5</quota></export>");
    assert.throws(() => app.utl.inout.download('export', 'dati.csv', 'csv'),
        {message: "gramlot.utl.inout.download: format 'csv' is not 'json' or 'xml'"});
    assert.equal(links.length, 2);
    app.dispose();
});
