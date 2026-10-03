/** Real-browser check of the page logic forms on the JavaScript and Python FileHost.
 * Usage: node scripts/verify_page_module_browser.mjs PYTHON PLAYWRIGHT_ENTRY [ENGINE …]
 * Build the runtime first (npm --prefix js run build). Both loopback hosts serve the
 * runtime, the .js and .css files below their pages folder and the page protocol, with
 * a strict CSP. Forms: the module that exports Page and Logic, and foo_aux.js.
 */
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtemp, mkdir, readFile, rm, symlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createInterface} from 'node:readline';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {FileHost} from '../js/src/adapters/index.js';

const [python, playwrightEntry, ...engines] = process.argv.slice(2);
if (!playwrightEntry) throw new Error('Usage: node scripts/verify_page_module_browser.mjs PYTHON PLAYWRIGHT_ENTRY [ENGINE …]');
const playwright = await import(pathToFileURL(playwrightEntry));
const root = fileURLToPath(new URL('../', import.meta.url));
const RUNTIME = join(root, 'js/dist/gramlot.js');
const CSP = "default-src 'self'; script-src 'self' 'nonce-{nonce}'";

const jsPage = `import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    static title = 'Logic form';

    main(root) {
        root.div('^out', {id: 'out'});
        root.dataFormula({result_path: 'out', func: 'double', value: '^value', _init: true});
        root.dataSetter({destination_path: 'value', value: 21});
    }
}
`;
const pyPage = `from gramlot import Page as Base


class Page(Base):
    title = "Logic form"

    def main(self, root):
        root.div("^out", id="out")
        root.dataFormula("out", func="double", value="^value", _init=True)
        root.dataSetter("value", 21)
`;
const logic = `export class Logic {
    double(kwargs) { return this.page.logic.double === this.double ? kwargs.value * 2 : null; }
}
`;

const PYTHON_HOST = String.raw`
import asyncio, json, sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from gramlot.server import FileHost, PageNotFound
pages, runtime, csp = Path(sys.argv[1]), Path(sys.argv[2]).read_bytes(), sys.argv[3]
host = FileHost(pages)
class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args): pass
    def reply(self, status, body, kind, headers={}):
        body = body.encode() if isinstance(body, str) else body
        self.send_response(status)
        self.send_header("Content-Type", kind)
        for name, value in headers.items(): self.send_header(name, value)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def do_GET(self):
        if self.path == host.runtime_url:
            return self.reply(200, runtime, "text/javascript")
        if self.path.endswith((".js", ".css")):
            filename = (pages / self.path.lstrip("/")).resolve()
            if filename.is_relative_to(pages.resolve()) and filename.is_file():
                kind = "text/javascript" if self.path.endswith(".js") else "text/css"
                return self.reply(200, filename.read_bytes(), kind)
            return self.reply(404, "Not found", "text/plain")
        try:
            opened = asyncio.run(host.open_page(self.path))
        except PageNotFound:
            return self.reply(404, "Not found", "text/plain")
        self.reply(200, opened.html, "text/html; charset=utf-8",
                   {"Content-Security-Policy": csp.replace("{nonce}", opened.nonce)})
    def do_POST(self):
        payload = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        if self.path == host.close_url:
            host.close_page(payload["pageId"])
            return self.reply(200, "{}", "application/json")
        self.reply(200, asyncio.run(host.main(payload["pageId"])), "application/json")
server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
print(f"http://127.0.0.1:{server.server_port}", flush=True)
server.serve_forever()
`;

/** The Node counterpart of PYTHON_HOST on the same protocol. */
async function nodeHost(pages, runtime) {
    const host = new FileHost(pages);
    const server = createServer(async (request, response) => {
        const reply = (status, body, kind, headers = {}) => {
            response.writeHead(status, {'Content-Type': kind, ...headers});
            response.end(body);
        };
        try {
            if (request.method === 'GET' && request.url === host.runtimeUrl) return reply(200, runtime, 'text/javascript');
            if (request.method === 'GET' && /\.(js|css)$/.test(request.url)) {
                const filename = join(pages, ...request.url.split('/').filter(Boolean));
                try { await host.url(filename); }
                catch { return reply(404, 'Not found', 'text/plain'); }
                return reply(200, await readFile(filename), request.url.endsWith('.js') ? 'text/javascript' : 'text/css');
            }
            if (request.method === 'GET') {
                const opened = await host.openPage(request.url);
                return reply(200, opened.html, 'text/html; charset=utf-8',
                    {'Content-Security-Policy': CSP.replaceAll('{nonce}', opened.nonce)});
            }
            const chunks = [];
            for await (const chunk of request) chunks.push(chunk);
            const {pageId} = JSON.parse(Buffer.concat(chunks).toString());
            if (request.url === host.closeUrl) { host.closePage(pageId); return reply(200, '{}', 'application/json'); }
            return reply(200, await host.main(pageId), 'application/json');
        } catch (error) {
            reply(500, String(error.stack), 'text/plain');
        }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    return {url: `http://127.0.0.1:${server.address().port}`, close: () => server.close()};
}

function pythonHost(pages) {
    const child = spawn(python, ['-c', PYTHON_HOST, pages, RUNTIME, CSP], {
        env: {...process.env, PYTHONPATH: join(root, 'src')}, stdio: ['ignore', 'pipe', 'inherit'],
    });
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(Error('Python host startup timed out')), 10000);
        createInterface({input: child.stdout}).once('line', url => {
            clearTimeout(timer);
            resolve({url, close: () => child.kill()});
        });
        child.once('exit', code => { clearTimeout(timer); reject(Error(`Python host exited: ${code}`)); });
    });
}

const folder = await mkdtemp(join(tmpdir(), 'gramlot-page-module-'));
const hosts = [];
let browser;
try {
    // JS pages: the module form and the _aux form. The Node host resolves @gramlot/gramlot/page here.
    const js = join(folder, 'js');
    await mkdir(join(js, 'node_modules/@gramlot'), {recursive: true});
    await symlink(join(root, 'js'), join(js, 'node_modules/@gramlot/gramlot'));
    await writeFile(join(js, 'package.json'), '{"type":"module"}\n');
    await writeFile(join(js, 'module.js'), `${jsPage}\n${logic}`);
    await writeFile(join(js, 'companion.js'), jsPage);
    await writeFile(join(js, 'companion_aux.js'), logic);
    // Python pages: module.js beside module.py exports Page (unused here) and Logic; else _aux.
    const py = join(folder, 'py');
    await mkdir(py);
    await writeFile(join(py, 'module.py'), pyPage);
    await writeFile(join(py, 'module.js'), `${jsPage}\n${logic}`);
    await writeFile(join(py, 'companion.py'), pyPage);
    await writeFile(join(py, 'companion_aux.js'), logic);

    hosts.push(['js', await nodeHost(js, await readFile(RUNTIME))], ['py', await pythonHost(py)]);
    for (const engineName of engines.length ? engines : ['chromium']) {
        browser = await playwright[engineName].launch({headless: true});
        for (const [language, {url}] of hosts) {
            for (const [path, logicUrl] of [['/module', '/module.js'], ['/companion', '/companion_aux.js']]) {
                const page = await browser.newPage();
                const errors = [], requests = [];
                page.on('pageerror', error => errors.push(String(error)));
                page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
                page.on('request', request => requests.push(new URL(request.url()).pathname));
                await page.goto(url + path);
                await page.waitForFunction(() => window.gramlot?.state === 'started');
                const label = `${engineName} ${language} ${path}`;
                assert.equal(await page.locator('#out').textContent(), '42', label);
                assert.equal(requests.filter(item => item === '/assets/gramlot.js').length, 1, `${label}: one runtime`);
                assert.ok(requests.includes(logicUrl), `${label}: ${logicUrl} imported`);
                assert.deepEqual(errors, [], label);
                await page.close();
                console.log(`PASS ${label}`);
            }
        }
        await browser.close();
        browser = null;
    }
} finally {
    await browser?.close();
    for (const [, host] of hosts) host.close();
    await rm(folder, {recursive: true, force: true});
}
