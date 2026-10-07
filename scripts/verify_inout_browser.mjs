/** Real-browser check of gramlot.utl.inout on the bundled runtime: email text, HTTP POST, save/restore with
 * exact types through a real download and file chooser, JSON/XML export, errors.
 * Usage: node scripts/verify_inout_browser.mjs PLAYWRIGHT_ENTRY [ENGINE …]
 * Build the runtime first (npm --prefix js run build).
 */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {Bag} from '../js/node_modules/@genrojs/bag/src/index.js';
import {createDecimal} from '../js/node_modules/@genrojs/tytx/js/src/index.js';

const [playwrightEntry, ...engines] = process.argv.slice(2);
if (!playwrightEntry) throw new Error('Usage: node scripts/verify_inout_browser.mjs PLAYWRIGHT_ENTRY [ENGINE …]');
const playwright = await import(pathToFileURL(playwrightEntry));
const runtime = await readFile(new URL('../js/dist/gramlot.js', import.meta.url));

const modulo = new Bag();
modulo.setItem('nome', 'Rossi');
modulo.setItem('nascita', new Date(Date.UTC(1990, 4, 2)));
modulo.setItem('quota', createDecimal('12.50'));
modulo.setItem('indirizzo.via', 'Roma 1');
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Iscrizione</title></head><body>
<main id="gramlot-root"></main>
<button id="save">save</button><button id="restore">restore</button>
<button id="json">json</button><button id="xml">xml</button>
<script type="module">
import {Gramlot, GramlotBuilder, Bag} from '/gramlot.js';
const app = new Gramlot({document, transport: false});
window.gramlot = app;
app.data.setItem('modulo', Bag.fromTytx(${JSON.stringify(modulo.toTytx())}));
app.src.logicRegistry.register(class Logic {
    mail() { this.page.utl.inout.sendMail('modulo', 'logic@example.org'); }
}, {group: null, resource: '/inout_aux.js'});
// A received Source: inline code in an action and a nested controller naming Logic.
const source = new GramlotBuilder();
source.root.button('inline', {id: 'inline', action: "gramlot.utl.inout.sendMail('modulo', 'inline@example.org')"});
source.root.button('logic', {id: 'logic'}).dataController({func: 'mail'});
app.src.startSource(source.source);
const on = (id, run) => document.getElementById(id).addEventListener('click', run);
on('save', () => app.utl.inout.save('modulo', 'iscrizione.json'));
on('restore', () => { window.restored = app.utl.inout.restore('copia').then(() => 'done', error => error.message); });
on('json', () => app.utl.inout.download('modulo', 'modulo.json', 'json'));
on('xml', () => app.utl.inout.download('modulo', 'modulo.xml', 'xml'));
window.ready = true;
</script></body></html>`;

const posts = [];
const server = createServer(async (request, response) => {
    if (request.method === 'POST') {
        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        posts.push({url: request.url, type: request.headers['content-type'], body: Buffer.concat(chunks).toString()});
        response.writeHead(request.url === '/fail' ? 500 : 200, {'Content-Type': 'text/plain'});
        return response.end('ok');
    }
    if (request.url === '/gramlot.js') {
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        return response.end(runtime);
    }
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(html);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/`;

/** The text of the file the browser downloads when the button id is clicked. */
async function downloaded(page, id) {
    const [download] = await Promise.all([page.waitForEvent('download'), page.click(`#${id}`)]);
    return {name: download.suggestedFilename(), path: await download.path(),
        text: await readFile(await download.path(), 'utf8')};
}

let browser;
try {
    for (const engineName of engines.length ? engines : ['chromium']) {
        browser = await playwright[engineName].launch({headless: true});
        const page = await browser.newPage({acceptDownloads: true});
        const errors = [];
        page.on('pageerror', error => errors.push(String(error)));
        await page.goto(url);
        await page.waitForFunction(() => window.ready === true);

        // sendMail: the followed mailto link, captured before the browser hands it to a mail program.
        const mail = await page.evaluate(() => {
            let href = null;
            const click = HTMLAnchorElement.prototype.click;
            HTMLAnchorElement.prototype.click = function () { href = this.href; };
            try {
                window.gramlot.utl.inout.sendMail('modulo', 'segreteria@example.org');
                let tooLong = null;
                window.gramlot.data.setItem('lungo.note', 'x'.repeat(2000));
                try { window.gramlot.utl.inout.sendMail('lungo', 'a@example.org'); } catch (error) { tooLong = error.message; }
                return {href, tooLong};
            } finally { HTMLAnchorElement.prototype.click = click; }
        });
        const mailto = new URL(mail.href);
        assert.equal(mailto.protocol, 'mailto:');
        assert.equal(decodeURIComponent(mailto.pathname), 'segreteria@example.org');
        assert.equal(mailto.searchParams.get('subject'), 'Iscrizione');
        assert.equal(mailto.searchParams.get('body'), 'nome: Rossi\nnascita: 1990-05-02\nquota: 12.5\nindirizzo.via: Roma 1');
        assert.match(mail.tooLong, /^gramlot\.utl\.inout\.sendMail: the email of 'lungo' is \d+ characters long, over the mailto: limit of 2000;/);

        // The same call from inline code and from a Logic method.
        await page.evaluate(() => {
            window.mailed = [];
            HTMLAnchorElement.prototype.click = function () { window.mailed.push(new URL(this.href).pathname); };
        });
        await page.click('#inline');
        await page.click('#logic');
        assert.deepEqual(await page.evaluate(() => window.mailed), ['inline%40example.org', 'logic%40example.org']);
        await page.reload();
        await page.waitForFunction(() => window.ready === true);

        // sendHttp: a real POST; a 500 rejects; a missing path raises before any request.
        posts.length = 0;
        const http = await page.evaluate(async () => {
            const status = (await window.gramlot.utl.inout.sendHttp('modulo', '/collect')).status;
            const failed = await window.gramlot.utl.inout.sendHttp('modulo', '/fail').then(() => null, error => error.message);
            let missing = null;
            try { await window.gramlot.utl.inout.sendHttp('assente', '/collect'); } catch (error) { missing = error.message; }
            return {status, failed, missing};
        });
        assert.deepEqual(http, {status: 200, failed: `gramlot.utl.inout.sendHttp: /fail answered 500`,
            missing: "gramlot.utl.inout: no data Bag at 'assente'"});
        assert.equal(posts.length, 2);
        assert.equal(posts[0].type, 'application/json');
        assert.deepEqual(JSON.parse(posts[0].body), {nome: 'Rossi', nascita: '1990-05-02T00:00:00.000Z', quota: '12.5',
            indirizzo: {via: 'Roma 1'}});

        // save then restore through the file chooser: date and decimal come back with their types.
        const saved = await downloaded(page, 'save');
        assert.equal(saved.name, 'iscrizione.json');
        assert.match(saved.text, /"1990-05-02::D"/);
        assert.match(saved.text, /"12\.5::N"/);
        const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('#restore')]);
        await chooser.setFiles(saved.path);
        assert.equal(await page.evaluate(() => window.restored), 'done');
        assert.deepEqual(await page.evaluate(() => {
            const get = path => window.gramlot.data.getItem(path);
            return {date: get('copia.nascita').toISOString(), decimal: get('copia.quota').constructor === get('modulo.quota').constructor,
                quota: String(get('copia.quota')), via: get('copia.indirizzo.via')};
        }), {date: '1990-05-02T00:00:00.000Z', decimal: true, quota: '12.5', via: 'Roma 1'});

        // JSON and XML export.
        const json = await downloaded(page, 'json');
        assert.equal(json.name, 'modulo.json');
        assert.deepEqual(JSON.parse(json.text).map(({label}) => label), ['nome', 'nascita', 'quota', 'indirizzo']);
        const xml = await downloaded(page, 'xml');
        assert.equal(xml.name, 'modulo.xml');
        // Date text in XML awaits genro-org/genro-bag-js#10: only text and numbers are checked.
        assert.match(xml.text, /^<\?xml version='1\.0' encoding='UTF-8'\?>\n<modulo><nome>Rossi<\/nome><nascita>.*<\/nascita><quota>12\.5<\/quota><indirizzo><via>Roma 1<\/via><\/indirizzo><\/modulo>$/);
        assert.equal(await page.evaluate(() => {
            try { window.gramlot.utl.inout.download('modulo', 'x.csv', 'csv'); } catch (error) { return error.message; }
        }), "gramlot.utl.inout.download: format 'csv' is not 'json' or 'xml'");

        assert.deepEqual(errors, []);
        console.log(`PASS ${engineName}: sendMail (also from inline code and Logic), sendHttp, save/restore with date and decimal, JSON/XML download, errors`);
        await browser.close();
        browser = null;
    }
} finally {
    await browser?.close();
    server.close();
}
