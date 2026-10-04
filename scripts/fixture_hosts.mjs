/** Loopback hosts of one fixture pages folder for the browser checks: the JavaScript and the Python
 * FileHost of the core. Build the runtime first (npm --prefix js run build). Each host serves the
 * runtime, the core themes under /themes/, the .js and .css files below the pages folder, the pages
 * and main and close as POST. No Content-Security-Policy: the pages put inline code in their Source.
 * The Python host runs `GRAMLOT_TEST_PYTHON` (default python3) on the src/ tree of this checkout.
 */
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {join, resolve, sep} from 'node:path';
import {createInterface} from 'node:readline';
import {fileURLToPath} from 'node:url';
import {FileHost} from '../js/src/adapters/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const RUNTIME = join(root, 'js/dist/gramlot.js');
const THEMES = join(root, 'themes');

const PYTHON_HOST = String.raw`
import asyncio, json, sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from gramlot.server import FileHost, PageNotFound
pages, runtime, themes = Path(sys.argv[1]), Path(sys.argv[2]).read_bytes(), Path(sys.argv[3])
host = FileHost(pages)
class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args): pass
    def reply(self, status, body, kind):
        body = body.encode() if isinstance(body, str) else body
        self.send_response(status)
        self.send_header("Content-Type", kind)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def do_GET(self):
        if self.path == host.runtime_url:
            return self.reply(200, runtime, "text/javascript")
        if self.path.endswith((".js", ".css")):
            folder, relative = (themes, self.path[len("/themes/"):]) if self.path.startswith("/themes/") else (pages, self.path.lstrip("/"))
            filename = (folder / relative).resolve()
            if filename.is_relative_to(folder.resolve()) and filename.is_file():
                kind = "text/javascript" if self.path.endswith(".js") else "text/css"
                return self.reply(200, filename.read_bytes(), kind)
            return self.reply(404, "Not found", "text/plain")
        try:
            opened = asyncio.run(host.open_page(self.path))
        except PageNotFound:
            return self.reply(404, "Not found", "text/plain")
        self.reply(200, opened.html, "text/html; charset=utf-8")
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
async function nodeHost(pages) {
    const host = new FileHost(pages);
    const runtime = await readFile(RUNTIME);
    const server = createServer(async (request, response) => {
        const reply = (status, body, kind) => {
            response.writeHead(status, {'Content-Type': kind});
            response.end(body);
        };
        try {
            if (request.method === 'GET' && request.url === host.runtimeUrl) return reply(200, runtime, 'text/javascript');
            if (request.method === 'GET' && /\.(js|css)$/.test(request.url)) {
                const kind = request.url.endsWith('.js') ? 'text/javascript' : 'text/css';
                if (request.url.startsWith('/themes/')) {
                    const filename = resolve(THEMES, ...request.url.slice('/themes/'.length).split('/'));
                    if (!filename.startsWith(THEMES + sep)) return reply(404, 'Not found', 'text/plain');
                    return reply(200, await readFile(filename), kind);
                }
                const filename = join(pages, ...request.url.split('/').filter(Boolean));
                try { await host.url(filename); }
                catch { return reply(404, 'Not found', 'text/plain'); }
                return reply(200, await readFile(filename), kind);
            }
            if (request.method === 'GET') return reply(200, (await host.openPage(request.url)).html, 'text/html; charset=utf-8');
            const chunks = [];
            for await (const chunk of request) chunks.push(chunk);
            const {pageId} = JSON.parse(Buffer.concat(chunks).toString());
            if (request.url === host.closeUrl) { host.closePage(pageId); return reply(200, '{}', 'application/json'); }
            return reply(200, await host.main(pageId), 'application/json');
        } catch (error) {
            reply(500, String(error.stack), 'text/plain');
        }
    });
    await new Promise(done => server.listen(0, '127.0.0.1', done));
    return {url: `http://127.0.0.1:${server.address().port}`, close: () => server.close()};
}

function pythonHost(pages) {
    const child = spawn(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', ['-c', PYTHON_HOST, pages, RUNTIME, THEMES], {
        env: {...process.env, PYTHONPATH: join(root, 'src')}, stdio: ['ignore', 'pipe', 'inherit'],
    });
    return new Promise((done, fail) => {
        const timer = setTimeout(() => fail(Error('Python host startup timed out')), 10000);
        createInterface({input: child.stdout}).once('line', url => {
            clearTimeout(timer);
            done({url, close: () => child.kill()});
        });
        child.once('exit', code => { clearTimeout(timer); fail(Error(`Python host exited: ${code}`)); });
    });
}

/** Start both hosts on `pages`: `[['py', {url, close}], ['js', {url, close}]]`. */
export async function startHosts(pages) {
    return [['py', await pythonHost(pages)], ['js', await nodeHost(pages)]];
}
