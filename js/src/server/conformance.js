/* @ts-self-types="./conformance.d.ts" */
/**
 * Conformance check of a running adapter against the server protocol GC-230, over HTTP.
 *
 * @module
 */
import {AssertionError} from 'node:assert';
import {isDeepStrictEqual} from 'node:util';
import {fromTytx, toTytx} from '@genrojs/tytx';

const OWNER_COOKIE = 'gramlot_owner';
const BOOTSTRAP = /<script type="module" nonce="([^"]+)">import \{PageBootstrap\} from ("[^"]*");await new PageBootstrap\((\{.*?\})\)\.run\(\);<\/script>/;

const expect = (rule, condition, message) => {
    if (!condition) throw new AssertionError({message: `${rule}: ${message}`});
};

const mediaType = headers => (headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();

/** Run the checks of GC-230 §150 against the adapter at baseUrl (mount prefix included) with
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

    if (prefix) {
        const {status, headers} = await request('GET', prefix);
        expect('GC-230-105', status === 301 && (headers.get('location') ?? '').endsWith(`${prefix}/`),
            `GET ${prefix} answers ${status}, not 301 to ${prefix}/`);
    }

    const pageUrl = prefix + pagePath;
    const page = await request('GET', pageUrl);
    expect('GC-230-115', page.status === 200 && mediaType(page.headers) === 'text/html',
        `GET ${pageUrl} answers ${page.status} ${page.headers.get('content-type')}, not 200 text/html`);
    const match = BOOTSTRAP.exec(page.body);
    expect('GC-230-115', match !== null, `GET ${pageUrl} has no bootstrap module script`);
    const [, nonce, runtimeJson, bootstrapJson] = match;
    const runtimeUrl = JSON.parse(runtimeJson);
    const {config, resources} = JSON.parse(bootstrapJson);
    expect('GC-230-115', page.body.includes(`<script type="importmap" nonce="${nonce}">`),
        'the import map does not carry the bootstrap nonce');
    expect('GC-230-115', typeof config.rpcUrl === 'string' && typeof config.closeUrl === 'string'
        && Array.isArray(config.capabilities),
        `bootstrap config ${JSON.stringify(config)} lacks rpcUrl, closeUrl or a capabilities array`);
    const expected = {runtime: [runtimeUrl, '/assets/gramlot.js'], rpc: [config.rpcUrl, '/gramlot/rpc'],
        close: [config.closeUrl, '/gramlot/close']};
    for (const [name, [url, path]] of Object.entries(expected)) {
        expect('GC-230-105', url === prefix + path, `bootstrap ${name} URL ${url}, not ${prefix + path}`);
    }

    const policy = page.headers.get('content-security-policy');
    if (policy !== null) {
        expect('GC-230-140', policy.includes(`'nonce-${nonce}'`), 'the Content-Security-Policy lacks the bootstrap nonce');
    }

    for (const line of page.headers.getSetCookie()) {
        const [pair, ...attributes] = line.split(';').map(part => part.trim());
        if (!pair.startsWith(`${OWNER_COOKIE}=`)) continue;
        const named = Object.fromEntries(attributes.map(attribute => {
            const [key, value = ''] = attribute.split('=');
            return [key.toLowerCase(), value];
        }));
        expect('GC-230-135', 'httponly' in named && named.samesite?.toLowerCase() === 'lax' && named.path === (prefix || '/'),
            `owner cookie without HttpOnly, SameSite=Lax and Path=${prefix || '/'}`);
        owner = pair.slice(OWNER_COOKIE.length + 1);
    }

    let response = await request('GET', runtimeUrl);
    expect('GC-230-110', response.status === 200 && mediaType(response.headers) === 'text/javascript',
        `GET ${runtimeUrl} answers ${response.status} ${response.headers.get('content-type')}, not 200 text/javascript`);
    response = await request('POST', runtimeUrl, {body: '{}'});
    expect('GC-230-110', response.status === 405, `POST ${runtimeUrl} answers ${response.status}, not 405`);

    const files = [...resources.css.map(url => [url, 'text/css']), ...resources.js.map(({url}) => [url, 'text/javascript'])];
    for (const [url, type] of files) {
        if (!url.startsWith('/') || url.startsWith('//')) continue;
        response = await request('GET', url);
        expect('GC-230-145', response.status === 200 && mediaType(response.headers) === type,
            `GET ${url} answers ${response.status} ${response.headers.get('content-type')}, not 200 ${type}`);
    }

    response = await request('GET', `${prefix}/gramlot-conformance-missing-page`);
    expect('GC-230-115', response.status === 404, `an unknown page answers ${response.status}, not 404`);
    response = await request('POST', pageUrl, {body: '{}'});
    expect('GC-230-115', response.status === 405, `POST ${pageUrl} answers ${response.status}, not 405`);
    if (pagePath.endsWith('/')) {
        response = await request('GET', `${pageUrl}index.html`);
        expect('GC-230-115', response.status === 200 && mediaType(response.headers) === 'text/html',
            `GET ${pageUrl}index.html answers ${response.status}, not the page ${pageUrl}`);
    }

    const {pageId, rpcUrl: rpc} = config;
    const envelope = (contentType, name, params = {}, fields = {}) =>
        ({id: crypto.randomUUID(), pageId, contentType, name, params, ...fields});
    const parse = (text, decode) => {
        try { return decode(text); } catch { return null; }
    };
    /** POST the envelope sent to rpc; the response with the decoded envelope as `received`. */
    const call = async (sent, options = {}) => {
        const answer = await request('POST', rpc, {...options, body: toTytx(sent)});
        return {...answer, received: parse(answer.body, fromTytx)};
    };
    const outcome = async (rule, sent, code, label, options = {}) => {
        const {status, body, received} = await call(sent, options);
        const error = received?.error;
        expect(rule, status === 200 && error?.code === code,
            `${label} answers ${status} ${body.slice(0, 200)}, not 200 with the outcome ${code}`);
        return error;
    };

    response = await request('GET', rpc);
    expect('GC-230-120', response.status === 405, `GET ${rpc} answers ${response.status}, not 405`);
    response = await request('POST', rpc, {body: toTytx(envelope('source', 'main')), contentType: 'text/plain'});
    expect('GC-230-120', response.status === 415, `rpc as text/plain answers ${response.status}, not 415`);
    response = await request('POST', rpc, {body: '{'});
    expect('GC-230-120', response.status === 400, `rpc with invalid JSON answers ${response.status}, not 400`);
    const {pageId: omitted, ...withoutPageId} = envelope('source', 'main');
    const invalid = {'without pageId': withoutPageId, 'with params null': envelope('source', 'main', null),
        'with array params': envelope('source', 'main', []), 'with an unknown contentType': envelope('other', 'main')};
    for (const [label, sent] of Object.entries(invalid)) {
        response = await call(sent);
        expect('GC-230-120', response.status === 400, `rpc ${label} answers ${response.status}, not 400`);
    }

    const sent = envelope('source', 'main');
    response = await call(sent);
    const received = parse(response.body, JSON.parse);
    expect('GC-230-020', response.status === 200 && mediaType(response.headers) === 'application/json'
        && received?.id === sent.id && received?.contentType === 'source' && typeof received?.value === 'string',
        `main answers ${response.status} ${response.headers.get('content-type')} ${response.body.slice(0, 200)}, not 200 `
        + 'application/json with an envelope echoing id and contentType and carrying the fragment document as a string');
    if (owner !== null) {
        await outcome('GC-230-135', envelope('source', 'main'), 'page_expired', 'main without the owner cookie',
            {withOwner: false});
    }

    await outcome('GC-230-025', envelope('source', 'main', {}, {pageId: '0'.repeat(32)}), 'page_expired',
        'main of an unknown page');
    await outcome('GC-230-025', envelope('source', 'gramlot_conformance_missing'), 'not_found', 'an unknown fragment');
    await outcome('GC-230-025', envelope('data', 'gramlot_conformance_missing'), 'not_found', 'an unknown endpoint');
    await outcome('GC-230-025', envelope('data', 'main'), 'not_found', 'data main');

    response = await call(envelope('source', 'check_fragment', {text: 'gramlot-conformance'}));
    const fragment = parse(response.body, JSON.parse)?.value;
    expect('GC-230-015', response.status === 200 && typeof fragment === 'string' && fragment.includes('gramlot-conformance'),
        `check_fragment answers ${response.status} ${response.body.slice(0, 200)}, not a fragment document with its params`);
    // The date crosses the wire typed (::D) and comes back as the same typed value.
    for (const value of [3, 'x', new Date(Date.UTC(2020, 0, 1))]) {
        response = await call(envelope('data', 'check_endpoint', {value}));
        expect('GC-230-015', response.status === 200 && isDeepStrictEqual(response.received?.value, value),
            `check_endpoint of ${JSON.stringify(value)} answers ${response.status} ${response.body.slice(0, 200)}, `
            + `not ${JSON.stringify(value)}`);
    }

    if (config.capabilities.includes('auth')) {
        response = await call(envelope('data', 'check_endpoint_auth'));
        const {received: answer} = response;
        expect('GC-230-030', response.status === 200 && answer !== null && typeof answer === 'object' && (!('error' in answer)
            ? 'value' in answer : ['not_authenticated', 'not_authorized'].includes(answer.error?.code)),
            `check_endpoint_auth answers ${response.status} ${response.body.slice(0, 200)}, not 200 with not_authenticated, `
            + 'not_authorized or a value');
    } else {
        await outcome('GC-230-030', envelope('data', 'check_endpoint_auth'), 'not_authenticated', 'check_endpoint_auth');
    }

    const error = await outcome('GC-230-025', envelope('data', 'check_endpoint_raise'), 'application_error',
        'check_endpoint_raise');
    expect('GC-230-025', typeof error.name === 'string' && error.name !== '' && error.message === 'check',
        `check_endpoint_raise answers the error ${JSON.stringify(error)}, not the exception name and the message 'check'`);

    const close = config.closeUrl;
    response = await request('POST', close, {body: JSON.stringify({pageId})});
    const closed = parse(response.body, JSON.parse);
    expect('GC-230-125', response.status === 200 && mediaType(response.headers) === 'application/json' && isDeepStrictEqual(closed, {ok: true}),
        `close answers ${response.status} ${response.body}, not 200 {"ok": true}`);
    await outcome('GC-230-125', envelope('source', 'main'), 'page_expired', 'main after close');
}
