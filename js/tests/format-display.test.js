import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {Gramlot, GramlotBuilder} from '../src/index.js';
import {GramlotServer, Page} from '../src/server/index.js';

function mounted(t, author) {
    const dom = new JSDOM('<main></main>');
    const app = new Gramlot({element: dom.window.document.querySelector('main'), transport: false,
        locale: 'it-IT', timeZone: 'Europe/Rome'});
    t.after(() => { app.dispose(); dom.window.close(); });
    const builder = new GramlotBuilder();
    author(builder.root);
    app.src.startSource(builder.toTytx());
    return {app, document: dom.window.document};
}

test('page context supplies method defaults, with per-call overrides and short shorthand', t => {
    const {app} = mounted(t, () => {});
    assert.equal(app.format(1234.5, '0.00'), '1234,50');
    assert.equal(app.format(1234.5, {pattern: '0.00', locale: 'en-US'}), '1234.50');
    const instant = new Date('2026-10-16T12:30:00Z');
    assert.equal(app.format(instant, 'short'), '16/10/26, 14:30');
    assert.equal(app.format(instant, {timeZone: 'America/Los_Angeles'}), '16/10/26, 05:30');
});

test('resolved format, mask and locale update node text without rewriting Data or rebuilding DOM', t => {
    const {app, document} = mounted(t, root => {
        root.dataSetter({destination_path: 'amount', value: 12.5});
        root.dataSetter({destination_path: 'pattern', value: '0.00;;(0.00)'});
        root.dataSetter({destination_path: 'mask', value: 'Total: {}'});
        root.dataSetter({destination_path: 'locale', value: 'it-IT'});
        root.p('^amount', {id: 'amount', format: '^pattern', mask: '^mask', locale: '^locale'});
        root.p('^amount', {id: 'raw'});
        root.input({id: 'edit', type: 'number', value: '^amount', format: '0.00'});
        root.p({_text: '^amount', id: 'branch', format: '^pattern', mask: '^mask'}).span(' child');
    });
    const element = document.getElementById('amount');
    assert.equal(element.textContent, 'Total: 12,50');
    assert.equal(document.getElementById('branch').textContent, 'Total: 12,50 child');
    app.data.setItem('amount', -2.5);
    assert.equal(element.textContent, 'Total: (2,50)');
    assert.equal(document.getElementById('raw').textContent, '-2.5');
    assert.equal(document.getElementById('edit').value, '-2.5');
    assert.equal(app.data.getItem('amount'), -2.5);
    app.data.setItem('locale', 'en-US');
    assert.equal(element.textContent, 'Total: (2.50)');
    app.data.setItem('mask', '[{}]');
    assert.equal(element.textContent, '[(2.50)]');
    app.data.setItem('pattern', '000.0');
    assert.equal(element.textContent, '[-002.5]');
    app.data.setItem('amount', null);
    assert.equal(element.textContent, '');
    app.data.setItem('pattern', '0.00;;(0.00)');
    app.data.setItem('amount', 0);
    assert.equal(element.textContent, '');
    assert.equal(document.getElementById('amount'), element);
    for (const key of ['format', 'mask', 'locale', 'dtype', 'timeZone']) assert.equal(element.hasAttribute(key), false);
});

test('temporal display accepts bound dtype/timeZone and preserves the underlying Date', t => {
    const {app, document} = mounted(t, root => {
        root.dataSetter({destination_path: 'date', value: new Date('2026-10-16T00:00:00Z')});
        root.dataSetter({destination_path: 'dtype', value: 'D'});
        root.dataSetter({destination_path: 'zone', value: 'America/Los_Angeles'});
        root.p('^date', {id: 'date', format: 'short', dtype: '^dtype', timeZone: '^zone'});
    });
    const element = document.getElementById('date');
    assert.equal(element.textContent, '16/10/26');
    app.data.setItem('dtype', 'DHZ');
    assert.equal(element.textContent, '15/10/26, 17:00');
    app.data.setItem('zone', 'Europe/Rome');
    assert.equal(element.textContent, '16/10/26, 02:00');
    assert.equal(app.data.getItem('date').toISOString(), '2026-10-16T00:00:00.000Z');
});

test('plain masks use braces, escape text, preserve false/zero and skip null/empty', t => {
    const {document} = mounted(t, root => {
        for (const [id, value] of [['text', '<b>{}</b>'], ['zero', 0], ['false', false], ['empty', ''], ['null', null]]) {
            root.p(value, {id, mask: 'Value: {}'});
        }
    });
    assert.equal(document.getElementById('text').textContent, 'Value: <b>{}</b>');
    assert.equal(document.getElementById('text').querySelector('b'), null);
    assert.equal(document.getElementById('zero').textContent, 'Value: 0');
    assert.equal(document.getElementById('false').textContent, 'Value: false');
    assert.equal(document.getElementById('empty').textContent, '');
    assert.equal(document.getElementById('null').textContent, '');
});

test('JavaScript page metadata travels through registration and HTTP bootstrap', async () => {
    class Localized extends Page {
        static locale = 'it-IT';
        static timeZone = 'Europe/Rome';
        main(root) { root.p('hello'); }
    }
    class Server extends GramlotServer {
        async resolvePage() { return Localized; }
        async resolveResources() { return {css: [], js: []}; }
    }
    const server = new Server();
    const registered = await server.registerPage('/');
    assert.equal(registered.locale, 'it-IT');
    assert.equal(registered.timeZone, 'Europe/Rome');
    const {html} = await server.openPage('/');
    const bootstrap = JSON.parse(html.match(/new PageBootstrap\((.*)\)\.run\(\)/s)[1]);
    assert.equal(bootstrap.config.locale, 'it-IT');
    assert.equal(bootstrap.config.timeZone, 'Europe/Rome');
});

test('browser context supplies omitted page fields independently, below page and call overrides', t => {
    const dom = new JSDOM('<main></main>');
    Object.defineProperty(dom.window, 'Intl', {value: {
        DateTimeFormat: () => ({resolvedOptions: () => ({locale: 'de-DE', timeZone: 'America/New_York'})}),
    }});
    t.after(() => dom.window.close());
    for (const [options, expectedLocale, expectedZone] of [
        [{}, 'de-DE', 'America/New_York'],
        [{locale: 'it-IT'}, 'it-IT', 'America/New_York'],
        [{timeZone: 'Europe/Rome'}, 'de-DE', 'Europe/Rome'],
        [{locale: 'it-IT', timeZone: 'Europe/Rome'}, 'it-IT', 'Europe/Rome'],
    ]) {
        const app = new Gramlot({element: dom.window.document.querySelector('main'), transport: false, ...options});
        assert.equal(app.locale, expectedLocale);
        assert.equal(app.timeZone, expectedZone);
        assert.equal(app.format(1.5, {pattern: '0.00', locale: 'en-US'}), '1.50');
        app.dispose();
    }
});
