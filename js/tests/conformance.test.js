/**
 * The conformance checks of GC-230, JavaScript and Python, against the two reference adapters of
 * scripts/fixture_servers.mjs (tests/http_server.py and its Node counterpart).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {createServer} from 'node:http';
import {join} from 'node:path';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import {checkProtocol} from '../src/server/index.js';
import {startServers} from '../../scripts/fixture_servers.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
// The fixture index pages declare the fragment and the endpoints of GC-230 §150.
const PAGES = {py: join(root, 'tests/fixtures/pages'), js: join(root, 'js/tests/fixtures/pages')};
const PAGE = '/';

/** The Python check_protocol on url, run by the interpreter of the tests. */
const pythonCheck = (url, page, pageTtl = null) => promisify(execFile)(process.env.GRAMLOT_TEST_PYTHON ?? 'python3',
    ['-c', 'import sys\nfrom gramlot.server import check_protocol\n'
        + 'check_protocol(sys.argv[1], sys.argv[2], page_ttl=None if sys.argv[3] == "" else float(sys.argv[3]))',
        url, page, pageTtl === null ? '' : String(pageTtl)],
    {env: {...process.env, PYTHONPATH: join(root, 'src')}});

async function withServers(options, run) {
    const servers = await startServers(PAGES, options);
    try {
        for (const [, server] of servers) await run(server.url);
    } finally {
        for (const [, server] of servers) server.close();
    }
}

test('both reference adapters pass the JavaScript and the Python check', async () => {
    await withServers({}, async url => {
        await checkProtocol(url, PAGE);
        await pythonCheck(url, PAGE);
    });
});

test('both reference adapters pass both checks below a mount prefix with a policy', async () => {
    await withServers({prefix: '/mount', csp: "script-src 'nonce-{nonce}'"}, async url => {
        assert.match(url, /\/mount$/);
        await checkProtocol(url, PAGE);
        await pythonCheck(url, PAGE);
    });
});

test('both reference adapters renew a page by use and expire it when left idle, in both checks', async () => {
    const servers = await startServers(PAGES, {pageTtl: 0.8});
    try {
        await Promise.all(servers.flatMap(([, server]) => [checkProtocol(server.url, PAGE, {pageTtl: 0.8}),
            pythonCheck(server.url, PAGE, 0.8)]));
    } finally {
        for (const [, server] of servers) server.close();
    }
});

test('the expiry check fails when the adapter TTL is not the one given', async () => {
    const servers = await startServers(PAGES, {pageTtl: 0.8});
    try {
        await Promise.all(servers.flatMap(([, server]) => [
            // A TTL given three times as long: the adapter expires the page before the first call.
            assert.rejects(checkProtocol(server.url, PAGE, {pageTtl: 2.4}), {message: /^GC-230-010: a call at 0\.5 pageTtl/}),
            // A TTL given half as long: the idle page is still usable.
            assert.rejects(checkProtocol(server.url, PAGE, {pageTtl: 0.4}),
                {message: /^GC-230-010: a call 1\.3 pageTtl after the previous call/})]));
    } finally {
        for (const [, server] of servers) server.close();
    }
});

test('a failure names its GC-230 rule in both languages', async () => {
    await withServers({csp: "script-src 'self'"}, async url => {
        await assert.rejects(checkProtocol(url, PAGE), {name: 'AssertionError', message: /^GC-230-140: /});
        await assert.rejects(pythonCheck(url, PAGE), {stderr: /AssertionError: GC-230-140: /});
        await assert.rejects(checkProtocol(url, '/gramlot-conformance-missing-page'), {message: /^GC-230-115: /});
    });
});

/**
 * An adapter with one defect: a proxy in front of the JavaScript reference adapter at `upstream` whose
 * `defect(request, body)` answers `{status, headers}` in place of the adapter, or returns null to forward the
 * request; `forward(headers)` changes the request headers sent to the adapter and `answer(headers)` the response
 * headers sent back.
 */
async function defective(upstream, {defect = () => null, forward = headers => headers, answer = headers => headers} = {}) {
    const target = new URL(upstream);
    const proxy = createServer(async (request, response) => {
        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        const body = Buffer.concat(chunks);
        const replaced = defect(request, body);
        if (replaced) {
            response.writeHead(replaced.status, replaced.headers ?? {});
            return response.end();
        }
        const headers = forward(Object.fromEntries(Object.entries(request.headers)
            .filter(([name]) => !['host', 'content-length', 'connection'].includes(name))));
        const reply = await fetch(target.origin + request.url, {method: request.method, headers, redirect: 'manual',
            body: ['GET', 'HEAD'].includes(request.method) ? undefined : body});
        const sent = {};
        reply.headers.forEach((value, name) => { if (!['set-cookie', 'content-length', 'content-encoding',
            'transfer-encoding', 'connection'].includes(name)) sent[name] = value; });
        if (reply.headers.getSetCookie().length) sent['set-cookie'] = reply.headers.getSetCookie();
        response.writeHead(reply.status, answer(sent));
        response.end(Buffer.from(await reply.arrayBuffer()));
    });
    await new Promise(done => proxy.listen(0, '127.0.0.1', done));
    return {url: `http://127.0.0.1:${proxy.address().port}${target.pathname}`, close: () => proxy.close()};
}

/** The JavaScript reference adapter alone: the Python one is stopped at once. */
async function jsAdapter() {
    const servers = new Map(await startServers(PAGES));
    servers.get('py').close();
    return servers.get('js');
}

/** Both checks reject at `url` with `rule`. */
async function bothReject(url, rule) {
    await assert.rejects(checkProtocol(url, PAGE), {name: 'AssertionError', message: new RegExp(`^${rule}: `)});
    await assert.rejects(pythonCheck(url, PAGE), {stderr: new RegExp(`AssertionError: ${rule}: `)});
}

test('an adapter that answers HEAD of a page path, without Allow on 405, fails both checks', async () => {
    const js = await jsAdapter();
    const head = await defective(js.url, {defect: request =>
        request.method === 'HEAD' && request.url === '/' ? {status: 200, headers: {'content-type': 'text/html'}} : null});
    const noAllow = await defective(js.url, {defect: request =>
        request.method === 'PUT' && request.url === '/' ? {status: 405} : null});
    try {
        await bothReject(head.url, 'GC-230-115');
        await bothReject(noAllow.url, 'GC-230-115');
    } finally {
        head.close();
        noAllow.close();
        js.close();
    }
});

test('an adapter whose pages share one owner fails both checks', async () => {
    const js = await jsAdapter();
    // Every browser reaches the adapter as the same owner, as an adapter with a null owner for every request.
    const shared = await defective(js.url, {forward: headers => ({...headers, cookie: 'gramlot_owner=shared'}),
        answer: ({'set-cookie': cookie, ...headers}) => headers});
    try {
        await bothReject(shared.url, 'GC-230-135');
    } finally {
        shared.close();
        js.close();
    }
});

test('an adapter that refuses a leading byte order mark fails both checks', async () => {
    const js = await jsAdapter();
    const bom = await defective(js.url, {defect: (request, body) =>
        body.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])) ? {status: 400} : null});
    try {
        await bothReject(bom.url, 'GC-230-120');
    } finally {
        bom.close();
        js.close();
    }
});
