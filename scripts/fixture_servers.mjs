/** Loopback reference adapters of the server protocol GC-230 on one fixture pages folder, for the
 * conformance tests and the browser checks: the JavaScript GramlotFileServer below, the Python one in
 * tests/http_server.py. Build the runtime first (npm --prefix js run build). Each server serves the
 * runtime, the core themes under /themes/, the .js and .css files below the pages folder, the pages,
 * and rpc and close as POST. No Content-Security-Policy unless `csp` is given: the pages put
 * inline code in their Source. The Python server runs `GRAMLOT_TEST_PYTHON` (default python3) on the
 * src/ tree of this checkout.
 */
import {spawn} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {createServer} from 'node:http';
import {readFile, realpath, stat} from 'node:fs/promises';
import {extname, isAbsolute, join, relative, sep} from 'node:path';
import {createInterface} from 'node:readline';
import {fileURLToPath} from 'node:url';
import {GramlotFileServer, InvalidRequest, PageNotFound, ServerCapacity, runtimeAsset} from '../js/src/server/index.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const THEMES = join(root, 'themes');
const OWNER_COOKIE = 'gramlot_owner';
const JSON_MEDIA_TYPE = 'application/json';
const MEDIA_TYPES = {'.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8'};

/** The real path of path below folder when it is a file there, else null. */
async function staticFile(folder, path) {
    try {
        const base = await realpath(folder);
        const real = await realpath(join(base, ...path.split('/').filter(Boolean)));
        const rel = relative(base, real);
        return !(rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) && (await stat(real)).isFile() ? real : null;
    } catch (error) {
        if (['ENOENT', 'ENOTDIR'].includes(error.code)) return null;
        throw error;
    }
}

const ownerOf = request => (request.headers.cookie ?? '').split(';').map(part => part.trim())
    .find(part => part.startsWith(`${OWNER_COOKIE}=`))?.slice(OWNER_COOKIE.length + 1) ?? null;

/** The Node counterpart of tests/http_server.py on the same protocol. */
async function nodeHost(pages, {prefix = '', csp = null} = {}) {
    const server = new GramlotFileServer(pages);
    const trimmed = prefix.replace(/^\/+|\/+$/g, '');
    const mount = trimmed ? `/${trimmed}` : '';

    const operation = async (request, path, reply) => {
        if ((request.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase() !== JSON_MEDIA_TYPE) {
            return reply(415, 'Expected application/json');
        }
        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        const body = Buffer.concat(chunks).toString();
        const owner = ownerOf(request);
        if (path === server.rpcUrl) {
            let result;
            try { result = await server.call(body, {owner}); } catch (error) {
                if (error instanceof InvalidRequest) return reply(400, 'Invalid envelope');
                throw error;
            }
            return reply(200, result, JSON_MEDIA_TYPE);
        }
        let payload;
        try { payload = JSON.parse(body); } catch { return reply(400, 'Invalid JSON request'); }
        if (typeof payload?.pageId !== 'string') return reply(400, 'Invalid JSON request');
        server.closePage(payload.pageId, {owner});
        return reply(200, JSON.stringify({ok: true}), JSON_MEDIA_TYPE);
    };

    const httpServer = createServer(async (request, response) => {
        const reply = (status, body = '', kind = 'text/plain; charset=utf-8', headers = {}) => {
            response.writeHead(status, {'Content-Type': kind, 'Cache-Control': 'no-store', ...headers});
            response.end(request.method === 'HEAD' ? undefined : body);
        };
        try {
            const url = new URL(request.url, 'http://127.0.0.1');
            let path = decodeURIComponent(url.pathname);
            if (mount) {
                if (path === mount) return reply(301, '', undefined, {Location: `${mount}/${url.search}`});
                if (!path.startsWith(`${mount}/`)) return reply(404, 'Not found');
                path = path.slice(mount.length);
            }
            const kind = MEDIA_TYPES[extname(path)];
            if (path === server.runtimeUrl || path.startsWith('/themes/') || kind) {
                if (!['GET', 'HEAD'].includes(request.method)) return reply(405, 'Method not allowed', undefined, {Allow: 'GET, HEAD'});
                if (path === server.runtimeUrl) return reply(200, await readFile(runtimeAsset()), MEDIA_TYPES['.js']);
                const filename = path.startsWith('/themes/')
                    ? await staticFile(THEMES, path.slice('/themes/'.length)) : await staticFile(pages, path);
                if (!filename) return reply(404, 'Not found');
                return reply(200, await readFile(filename), kind ?? 'application/octet-stream');
            }
            if ([server.rpcUrl, server.closeUrl].includes(path)) {
                if (request.method !== 'POST') return reply(405, 'Method not allowed', undefined, {Allow: 'POST'});
                return await operation(request, path, reply);
            }
            if (request.method !== 'GET') return reply(405, 'Method not allowed', undefined, {Allow: 'GET'});
            // As on a static host, <path>/index.html is the page <path> and /index.html the index.
            if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length);
            const owner = ownerOf(request) ?? randomBytes(24).toString('base64url');
            const {html, nonce} = await server.openPage(path, {owner, prefix: mount});
            const headers = {'Set-Cookie': `${OWNER_COOKIE}=${owner}; Path=${mount || '/'}; HttpOnly; SameSite=Lax`};
            if (csp !== null) headers['Content-Security-Policy'] = csp.replaceAll('{nonce}', nonce);
            return reply(200, html, 'text/html; charset=utf-8', headers);
        } catch (error) {
            if (error instanceof PageNotFound) return reply(404, 'Not found');
            if (error instanceof ServerCapacity) return reply(503, 'Page registry capacity reached');
            reply(500, String(error.stack));
        }
    });
    await new Promise(done => httpServer.listen(0, '127.0.0.1', done));
    return {url: `http://127.0.0.1:${httpServer.address().port}${mount}`, close: () => {
        server.closeAll();
        httpServer.close();
    }};
}

function pythonHost(pages, {prefix = '', csp = null} = {}) {
    const options = ['--prefix', prefix, ...(csp === null ? [] : ['--csp', csp])];
    const child = spawn(process.env.GRAMLOT_TEST_PYTHON ?? 'python3', [join(root, 'tests/http_server.py'), pages, ...options], {
        env: {...process.env, PYTHONPATH: join(root, 'src')}, stdio: ['ignore', 'pipe', 'inherit'],
    });
    return new Promise((done, fail) => {
        const timer = setTimeout(() => fail(Error('Python server startup timed out')), 10000);
        createInterface({input: child.stdout}).once('line', url => {
            clearTimeout(timer);
            done({url, close: () => child.kill()});
        });
        child.once('exit', code => { clearTimeout(timer); fail(Error(`Python server exited: ${code}`)); });
    });
}

/** Start both servers on `pages`, one folder or `{py, js}` (a folder per server):
 * `[['py', {url, close}], ['js', {url, close}]]`; `url` carries the mount prefix. Options: `prefix`
 * (mount prefix), `csp` (policy with `{nonce}`). */
export async function startServers(pages, options = {}) {
    const {py, js} = typeof pages === 'string' ? {py: pages, js: pages} : pages;
    return [['py', await pythonHost(py, options)], ['js', await nodeHost(js, options)]];
}
