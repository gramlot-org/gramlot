/* @ts-self-types="./conformance.d.ts" */
/**
 * Conformance check of a running adapter against the server protocol GC-230, over HTTP.
 *
 * @module
 */
import {AssertionError} from 'node:assert';

const OWNER_COOKIE = 'gramlot_owner';
const MAX_REQUEST_BYTES = 4096;
const BOOTSTRAP = /<script type="module" nonce="([^"]+)">import \{PageBootstrap\} from ("[^"]*");await new PageBootstrap\((\{.*?\})\)\.run\(\);<\/script>/;

const expect = (rule, condition, message) => {
    if (!condition) throw new AssertionError({message: `${rule}: ${message}`});
};

const mediaType = headers => (headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();

/** Run the checks of GC-230 §055 against the adapter at baseUrl (mount prefix included) with
 * the page pagePath; throw an AssertionError naming the rule of the first failure. The Python
 * counterpart is src/gramlot/server/conformance.py: both run the same list in the same order. */
export async function checkProtocol(baseUrl, pagePath) {
    const base = new URL(baseUrl);
    const prefix = base.pathname.replace(/\/+$/, '');
    let owner = null;

    const request = async (method, path, {body = null, contentType = 'application/json', withOwner = true} = {}) => {
        const headers = body === null ? {} : {'Content-Type': contentType};
        if (withOwner && owner !== null) headers.Cookie = `${OWNER_COOKIE}=${owner}`;
        const response = await fetch(base.origin + path, {method, body, headers, redirect: 'manual'});
        return {status: response.status, headers: response.headers, body: await response.text()};
    };
    const post = (url, payload, options = {}) => request('POST', url, {...options, body: JSON.stringify(payload)});

    if (prefix) {
        const {status, headers} = await request('GET', prefix);
        expect('GC-230-010', status === 301 && (headers.get('location') ?? '').endsWith(`${prefix}/`),
            `GET ${prefix} answers ${status}, not 301 to ${prefix}/`);
    }

    const pageUrl = prefix + pagePath;
    const page = await request('GET', pageUrl);
    expect('GC-230-020', page.status === 200 && mediaType(page.headers) === 'text/html',
        `GET ${pageUrl} answers ${page.status} ${page.headers.get('content-type')}, not 200 text/html`);
    const match = BOOTSTRAP.exec(page.body);
    expect('GC-230-020', match !== null, `GET ${pageUrl} has no bootstrap module script`);
    const [, nonce, runtimeJson, bootstrapJson] = match;
    const runtimeUrl = JSON.parse(runtimeJson);
    const {config, resources} = JSON.parse(bootstrapJson);
    expect('GC-230-020', page.body.includes(`<script type="importmap" nonce="${nonce}">`),
        'the import map does not carry the bootstrap nonce');
    const expected = {runtime: [runtimeUrl, '/assets/gramlot.js'], main: [config.mainUrl, '/gramlot/main'],
        source: [config.sourceUrl, '/gramlot/source'], close: [config.closeUrl, '/gramlot/close']};
    for (const [name, [url, path]] of Object.entries(expected)) {
        expect('GC-230-010', url === prefix + path, `bootstrap ${name} URL ${url}, not ${prefix + path}`);
    }

    const policy = page.headers.get('content-security-policy');
    if (policy !== null) {
        expect('GC-230-045', policy.includes(`'nonce-${nonce}'`), 'the Content-Security-Policy lacks the bootstrap nonce');
    }

    for (const line of page.headers.getSetCookie()) {
        const [pair, ...attributes] = line.split(';').map(part => part.trim());
        if (!pair.startsWith(`${OWNER_COOKIE}=`)) continue;
        const named = Object.fromEntries(attributes.map(attribute => {
            const [key, value = ''] = attribute.split('=');
            return [key.toLowerCase(), value];
        }));
        expect('GC-230-040', 'httponly' in named && named.samesite?.toLowerCase() === 'lax' && named.path === (prefix || '/'),
            `owner cookie without HttpOnly, SameSite=Lax and Path=${prefix || '/'}`);
        owner = pair.slice(OWNER_COOKIE.length + 1);
    }

    let response = await request('GET', runtimeUrl);
    expect('GC-230-015', response.status === 200 && mediaType(response.headers) === 'text/javascript',
        `GET ${runtimeUrl} answers ${response.status} ${response.headers.get('content-type')}, not 200 text/javascript`);
    response = await request('POST', runtimeUrl, {body: '{}'});
    expect('GC-230-015', response.status === 405, `POST ${runtimeUrl} answers ${response.status}, not 405`);

    const files = [...resources.css.map(url => [url, 'text/css']), ...resources.js.map(({url}) => [url, 'text/javascript'])];
    for (const [url, type] of files) {
        if (!url.startsWith('/') || url.startsWith('//')) continue;
        response = await request('GET', url);
        expect('GC-230-050', response.status === 200 && mediaType(response.headers) === type,
            `GET ${url} answers ${response.status} ${response.headers.get('content-type')}, not 200 ${type}`);
    }

    response = await request('GET', `${prefix}/gramlot-conformance-missing-page`);
    expect('GC-230-020', response.status === 404, `an unknown page answers ${response.status}, not 404`);
    response = await request('POST', pageUrl, {body: '{}'});
    expect('GC-230-020', response.status === 405, `POST ${pageUrl} answers ${response.status}, not 405`);
    if (pagePath.endsWith('/')) {
        response = await request('GET', `${pageUrl}index.html`);
        expect('GC-230-020', response.status === 200 && mediaType(response.headers) === 'text/html',
            `GET ${pageUrl}index.html answers ${response.status}, not the page ${pageUrl}`);
    }

    const {pageId, mainUrl: main} = config;
    response = await request('GET', main);
    expect('GC-230-025', response.status === 405, `GET ${main} answers ${response.status}, not 405`);
    response = await post(main, {pageId}, {contentType: 'text/plain'});
    expect('GC-230-025', response.status === 415, `main as text/plain answers ${response.status}, not 415`);
    response = await request('POST', main, {body: '{'});
    expect('GC-230-025', response.status === 400, `main with invalid JSON answers ${response.status}, not 400`);
    response = await post(main, {});
    expect('GC-230-025', response.status === 400, `main without pageId answers ${response.status}, not 400`);
    response = await post(main, {pageId, padding: 'x'.repeat(MAX_REQUEST_BYTES)});
    expect('GC-230-025', response.status === 413,
        `main above ${MAX_REQUEST_BYTES} bytes answers ${response.status}, not 413`);

    response = await post(main, {pageId});
    expect('GC-230-030', response.status === 200 && mediaType(response.headers) === 'application/json' && response.body,
        `main answers ${response.status} ${response.headers.get('content-type')}, not 200 application/json with the Source`);
    if (owner !== null) {
        response = await post(main, {pageId}, {withOwner: false});
        expect('GC-230-040', response.status === 404, `main without the owner cookie answers ${response.status}, not 404`);
    }
    response = await post(main, {pageId: '0'.repeat(32)});
    expect('GC-230-035', response.status === 404, `main of an unknown page answers ${response.status}, not 404`);

    const source = config.sourceUrl;
    response = await post(source, {pageId});
    expect('GC-230-025', response.status === 400, `Source without method answers ${response.status}, not 400`);
    response = await post(source, {pageId, method: 'details', params: []});
    expect('GC-230-025', response.status === 400, `Source with array params answers ${response.status}, not 400`);
    response = await post(source, {pageId, method: 'gramlot_conformance_missing'});
    expect('GC-230-035', response.status === 404, `an unknown Source method answers ${response.status}, not 404`);

    const close = config.closeUrl;
    response = await post(close, {pageId});
    let closed = null;
    try { closed = JSON.parse(response.body); } catch { /* checked below */ }
    expect('GC-230-030', response.status === 200 && mediaType(response.headers) === 'application/json' && closed?.ok === true,
        `close answers ${response.status} ${response.body}, not 200 {"ok": true}`);
    response = await post(main, {pageId});
    expect('GC-230-030', response.status === 404, `main after close answers ${response.status}, not 404`);
}
