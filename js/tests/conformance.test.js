/**
 * The conformance checks of GC-230, JavaScript and Python, against the two reference adapters of
 * scripts/fixture_servers.mjs (tests/http_server.py and its Node counterpart).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
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
const pythonCheck = (url, page) => promisify(execFile)(process.env.GRAMLOT_TEST_PYTHON ?? 'python3',
    ['-c', 'import sys\nfrom gramlot.server import check_protocol\ncheck_protocol(sys.argv[1], sys.argv[2])', url, page],
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

test('a failure names its GC-230 rule in both languages', async () => {
    await withServers({csp: "script-src 'self'"}, async url => {
        await assert.rejects(checkProtocol(url, PAGE), {name: 'AssertionError', message: /^GC-230-140: /});
        await assert.rejects(pythonCheck(url, PAGE), {stderr: /AssertionError: GC-230-140: /});
        await assert.rejects(checkProtocol(url, '/gramlot-conformance-missing-page'), {message: /^GC-230-115: /});
    });
});
