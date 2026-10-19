# Server protocol

Document ID: **GC-101**.

For adapter authors: what a Gramlot server exposes to the browser runtime (bootstrap, envelopes, close
message, outcomes; over HTTP URLs, methods, status codes). Page authors: [Writing pages](095-writing-pages.md),
[Calling the server](098-server-calls.md). The core implements every transport-independent rule in Python
and JavaScript (`GramlotServer`, `GramlotFileServer`, [GC-090 020](090-classes-and-hosts.md#gc-090-020));
an adapter adds only its transport. Section numbers = the rule numbers printed by the conformance check (§150).

## Part A · The contract

<a id="gc-101-005"></a>

### 005 · Scope and terms

Block ID: **GC-101-005**.

One logical contract, realised over HTTP (B), in a Web Worker (C), over WebSocket for a server offering it
(D). `GramlotServer`: opens pages, page registry, builds fragments, runs endpoints; no transport. Adapter:
URLs, bodies, status codes, cookies, headers, Worker messages. Page = server `Page` class opened for one tab;
opening answers the bootstrap (§010). Fragment = Source built on the server (`main` = whole page, in the root;
others below a browser Source node). Endpoint = server method called for a value. Every call names a content
type (`source`/`data`, §015); every message is an envelope (§020), the same over HTTP, `postMessage`, WebSocket.
Core operations for every adapter: `decode_body`, `call`, `close`, `open_page`, `close_all` (JS `decodeBody`,
`call`, `close`, `openPage`/`registerPage`, `closeAll`), `GramlotFileServer.companion_file`/`theme_file` (JS
`companionFile`/`themeFile`). Server adapter = `gramlot.serverAdapter` (`ServerAdapter`, §045), chosen by the
server in the bootstrap, consulted by the core, never by page authors.

<a id="gc-101-010"></a>

### 010 · Page lifecycle and bootstrap

Block ID: **GC-101-010**.

`open_page(path, *, owner=None, prefix="")`/`openPage(path, {owner, prefix})` registers the page (`pageId`,
owner §135) and returns page ID, HTML, nonce. HTML: `<title>` from `Page.title`, import map
`@gramlot/gramlot/page` → runtime URL, root `div` (`gramlot-root`), module script running `PageBootstrap` with
`{config, resources}`; import map and script share the nonce. `config` = `{pageId, rpcUrl, closeUrl, rootId,
capabilities, nameSyntax}` (+ `devices`, `locale`, `timeZone` when declared); `nameSyntax` =
`{kind: "regex", pattern, flags}`. `resources` = `{css: [url], js: [{url, group}]}` (+ `collections`,
`serverAdapter`). `css`: theme first (server `css_theme`/`cssTheme`, default `gramlot-base`, `False`/`false`
none; the page's own `css_theme` replaces it), then `Page.css` and the companion; each URL once, last
position. `serverAdapter` = URL of a module whose default export is the page's `ServerAdapter` class
(`server_adapter`/`serverAdapter`, none by default), importing the core from `@gramlot/gramlot/page`; without
it the runtime's HTTP `ServerAdapter`. `<path>/index.html` → `<path>/`. Missing page `PageNotFound`, full
registry `ServerCapacity`. Calls of another owner, unknown or expired pages → `page_expired`; page IDs are not
login. Close by the close message or `close_all()`/`closeAll()` on shutdown; a page expires `page_ttl`
(`pageTtl`, default 1800 s) after opening, calls do not extend it (later calls → `page_expired`). A new `Page` per call; no state between calls unless a capability (§040).

<a id="gc-101-015"></a>

### 015 · Content types and method names

Block ID: **GC-101-015**.

`source`: a fragment (`main`; `@source`/`registerSource`), value = TYTX JSON of the populated
`GramlotBuilderBag`, mounted in the root (`main`) or below a Source node. `data`: a value
(`@endpoint`/`registerEndpoint`), one TYTX value (scalar, Bag, null; never code), written in Data. Fragment
methods populate the root and return nothing; endpoints return the value. Inline code runs only inside a
fragment; a `GramlotBuilderBag` inside `data` activates nothing. `main` reserved; declared names
`^[A-Za-z][A-Za-z0-9_]*$`; not both fragment and endpoint. Request `name` follows the server syntax
`name_syntax`/`nameSyntax` (`NameSyntax`): genro-builders portable regex matched whole, constructs read
differently by Python and JS (`\w`, `(?P<…>)`, inline flags, `IGNORECASE`) refused at creation; carried by the
bootstrap, checked in the browser for the `remote` helper and names read from Data; outside it →
`not_found`. Default `NAME_SYNTAX`: page method or path `a.b.c.method` (ASCII letter + letters/digits/`_`
segments); segments before the last = public attributes (no leading `_`, getters run); the last = method with
the content type's marker on the class of the object before it; its `auth` is the only authorization; JS path
objects are `Exposed` (no `constructor` route). Subclasses may narrow the syntax; a non-dotted syntax resolves
its names itself. Python receives `params` as keywords, JS as one object; no type check.

<a id="gc-101-020"></a>

### 020 · The envelope

Block ID: **GC-101-020**.

Request `{id, pageId, contentType, name, params}`; response `{id, contentType, value}` or
`{id, contentType, error: {code, name, message}}`; close `{pageId}`. `id`: browser string echoed back
(pairs messages without ordering); one request in flight per Source node. `params`: object, TYTX JSON, `{}`
when empty; `null`, array or scalar = transport error (§120); a string with a TYTX suffix (`"x::D"`) is
decoded by TYTX. `error.name`/`message` from the exception; `GRAMLOT_DEV=DEBUG` adds `details`. Extra fields
allowed both ways. Server messages without `id` are reserved to push (§040), ignored by the base runtime.
Close: `{pageId}` alone, not awaited; over HTTP a beacon on `pagehide` (§125).

<a id="gc-101-025"></a>

### 025 · Outcomes

Block ID: **GC-101-025**.

`not_found` (`SourceNotFound`, `EndpointNotFound`), `page_expired` (`PageExpired`: unknown, expired, closed,
unowned), `not_authenticated` (`NotAuthenticated`: `auth` rule, no identity), `not_authorized`
(`NotAuthorized`: identity fails the rule), `application_error` (any other exception, including a value TYTX
cannot serialise). Outcomes travel in a normal response (HTTP 200); status codes only for transport (§130).

<a id="gc-101-030"></a>

### 030 · `auth`

Block ID: **GC-101-030**.

One attribute for elements and endpoints; rule over tags with `|`, `&`, `!` (genro-routes `AuthPlugin`).
Endpoint: refused → `not_authenticated`/`not_authorized`, method not run. Element: refused element and its
children left out of the serialised fragment; accepted ones sent without `auth`; the built Source unchanged;
non-string rule → `application_error`; a builder without evaluator keeps everything. Evaluator:
`evaluate_auth(rule, *, owner, identity)`/`evaluateAuth(rule, {owner, identity})` → `None`/`null` (allow),
`not_authenticated`, `not_authorized`; other results → `application_error`. `identity` travels with the call
(`call(text, owner=…, identity=…)`/`call(text, {owner, identity})`), never stored on the shared server. Base
evaluator: every rule `not_authenticated`; identity-aware servers override it and announce `auth`. `auth`
protects what the server builds, not page source: a JS page module served for its `Logic` is readable; a
Worker page runs in the browser.

<a id="gc-101-035"></a>

### 035 · Declaring fragments and endpoints

Block ID: **GC-101-035**.

Python `@source`/`@endpoint` (bare or `auth="rule"`) on `Page` methods or objects the page reaches; JS static
`registerSource('name', {auth})`/`registerEndpoint('name', {auth})` of `Exposed` (base of `Page`) after the
class body; `main` = `Page.main`.

<a id="gc-101-040"></a>

### 040 · Required and optional behaviour

Block ID: **GC-101-040**.

Every server (Worker too) must: answer the bootstrap with `capabilities` and `nameSyntax`; accept envelopes and
answer outcomes; read bodies as UTF-8 removing a leading BOM; build `main` and declared fragments; run declared
endpoints; refuse every `auth` rule without an identity system; close on the close message and all pages on
shutdown; pass the conformance check of its transport (§150, §205). Optional capabilities, named in
`config.capabilities` (base: none): `auth` (current adapter: `kajenn` of gramlot-py-server, avatar tags);
`websocket`, `push`, `serverpath`, `state`, `grouplets` (no current adapter; names reserved for Genro through
genro-kajenn). A server may also reject bodies above a chosen size (§130) and reload pages in development
(`GRAMLOT_DEV`).

<a id="gc-101-045"></a>

### 045 · Extension points

Block ID: **GC-101-045**.

1 extra envelope fields; 2 the server adapter `gramlot.serverAdapter` (module named in
`resources.serverAdapter`, instance given by `PageBootstrap` to `Gramlot`; core class = HTTP;
`createTransport({rpcUrl, closeUrl, document})` → transport of `gramlot.rpc`); 3 the transport: required
`call(text, signal)` (response text), `close(pageId, {beacon})`, `dispose()`; a disposed page sends `close` then
`dispose`, and disposes itself on a `pagehide` not kept in the back/forward cache (beacon over HTTP);
`HttpTransport.dispose` releases nothing; 4 optional synchronous call: `supportsCallSync` true plus
`callSync(text)` (blocks the page), used by `gramlot.rpc.callSync(contentType, name, params)` and `dataRemote`
with `sync`; elsewhere `callSync` throws and `dataRemote` reads asynchronously; `HttpTransport` uses a
synchronous `XMLHttpRequest` (deprecated on the main thread); Worker and WebSocket cannot; 5 the `auth`
evaluator with the call identity; 6 the server name syntax.

## Part B · HTTP

URLs without the mount prefix.

<a id="gc-101-105"></a>

### 105 · Mount prefix

Block ID: **GC-101-105**.

Optional prefix (`/py`): all URLs below it; the adapter strips it, 404 outside. Prefix without final slash →
301 to the slash form, query kept. `open_page`/`openPage` adds it once to root-relative bootstrap URLs (`/…`,
not `//…`). Defaults: runtime `/assets/gramlot.js`, rpc `/gramlot/rpc`, close `/gramlot/close` (options
`runtime_url`, `rpc_url`, `close_url`; JS `runtimeUrl`, `rpcUrl`, `closeUrl`).

<a id="gc-101-110"></a>

### 110 · Runtime URL

Block ID: **GC-101-110**.

`GET`/`HEAD` `/assets/gramlot.js` → 200 `text/javascript`; other methods 405. File from
`runtime_asset()`/`runtimeAsset()`: `gramlot.js` with `GRAMLOT_DEV=DEBUG`, else `gramlot.min.js`; same URL.

<a id="gc-101-115"></a>

### 115 · Page request

Block ID: **GC-101-115**.

`GET` page → 200 `text/html` bootstrap; nonce new per opening (16 random bytes, URL-safe base64);
`PageNotFound` 404, `ServerCapacity` 503; any other method (`HEAD` included) 405 with `Allow` listing `GET`;
`<path>/index.html` mapped by `open_page`.

<a id="gc-101-120"></a>

### 120 · RPC request

Block ID: **GC-101-120**.

`/gramlot/rpc`: POST only (405), `Content-Type: application/json` (415; case, whitespace and parameters
ignored; empty/absent or lookalikes such as `application/jsonp` refused). Body read by
`decode_body`/`decodeBody`: UTF-8, leading BOM (EF BB BF) removed (RFC 8259 §8.1; the runtime never sends it);
non-UTF-8 → `InvalidRequest` → 400 without calling the server. Body = request envelope as TYTX JSON; `call`
raises `InvalidRequest` (→ 400) for undecodable text, non-object, non-string `id`/`pageId`/`contentType`/`name`,
`contentType` other than `source`/`data`, non-object `params`. The adapter passes `owner` (§135) and, with an
identity system, `identity` (§030). Response 200 `application/json` with the response envelope, values and
outcomes alike.

<a id="gc-101-125"></a>

### 125 · Close request

Block ID: **GC-101-125**.

`/gramlot/close`: POST `application/json` `{pageId}` (transport errors of §120, body via `decode_body`) → 200
`{"ok": true}`. `close(text, owner=…)`/`close(text, {owner})` removes the page if owned; non-JSON or non-string
`pageId` → `InvalidRequest` (400); unknown/unowned → `{"ok": true}`, pages unchanged. Sent as a beacon on
`pagehide`; read by `Content-Length`.

<a id="gc-101-130"></a>

### 130 · Transport status codes

Block ID: **GC-101-130**.

301 prefix without slash (§105); 400 invalid envelope/close (§120, §125); 404 `PageNotFound`, path outside the
prefix (§115, §105); 405 method not accepted, page path with `Allow: GET` (§110–§125); 413 optional, size
chosen by adapter or front server, none fixed; 415 not `application/json`; 503 `ServerCapacity`. Every other
failure is an outcome in a 200 response.

<a id="gc-101-135"></a>

### 135 · Owner

Block ID: **GC-101-135**.

Pages are registered with an owner; calls of another owner → `page_expired`, its close leaves the page open;
the core takes the owner with `open_page`, `call`, `close`; recognising it is the adapter's job. Over HTTP each
browser must have its own owner (null for every request not allowed); the Worker keeps the null owner. Cookie
adapters use `gramlot_owner`, set on the page response with `Path=<prefix or />; HttpOnly; SameSite=Lax`, reuse
the browser's value and pass it as `owner` (random value, e.g. 24 random bytes URL-safe base64). Own identity
systems may supply the owner with the same isolation.

<a id="gc-101-140"></a>

### 140 · Content Security Policy

Block ID: **GC-101-140**.

The policy belongs to the application; a configured adapter sends it as the `Content-Security-Policy` header of
each page response with `{nonce}` replaced by the bootstrap nonce. Profiles:
[GC-090 035](090-classes-and-hosts.md#gc-090-035).

<a id="gc-101-145"></a>

### 145 · Themes and companion files

Block ID: **GC-101-145**.

`GET`/`HEAD` `/themes/<path>` → core theme file (`theme_file`/`themeFile`, `None`/`null` outside the themes
folder), media type by extension; `GET`/`HEAD` `.css`/`.js` → file whose real path is inside the pages folder
(page modules, `foo.css`, `foo_aux.js`, `Page.css` files there; `companion_file`/`companionFile`; NUL in the
path names no file); nothing else from the folder. A JS page module holding `Logic` is served (source readable,
`auth` rules included; `main` still runs on the server); `foo_aux.js` pages and Python modules are not.
Root-relative bootstrap resources → 200 `text/css`/`text/javascript`.

<a id="gc-101-150"></a>

### 150 · Conformance check

Block ID: **GC-101-150**.

`check_protocol(base_url, page_path)` (Python `gramlot.server`) / `checkProtocol(baseUrl, pagePath)` (JS
`@gramlot/gramlot/server`), over HTTP, in order; `base_url` includes the prefix; `page_path` declares
`check_fragment`, `check_fragment_auth`, `check_endpoint`, `check_endpoint_auth`, `check_endpoint_raise` (as
the core conformance fixtures). First failure: `AssertionError` (JS: `node:assert`), message starting with the
rule identifier whose last number is the section here. Items: 1 §105 301; 2 §115 bootstrap, nonce, `rpcUrl`,
`closeUrl`, `capabilities`, §010 `nameSyntax`; 3 §105 default URLs; 4 §140 nonce in the CSP; 5 §135 cookie
flags and reuse; 6 §110 runtime 200 / POST 405; 7 §145 resources; 8 §115 404, 405 with `Allow` for `POST`,
`HEAD`, `PUT`, `DELETE`, `PATCH`, `index.html` mapping; 9 §120/§125 405, 415, 400 (invalid UTF-8, invalid JSON,
no `pageId`, `params` null or array, unknown `contentType`), mixed-case and `charset` accepted, BOM accepted,
invalid closes leave the page usable; 10 §020 `source`/`main` envelope; 11 §135 other owner → `page_expired`,
foreign close leaves the page; 12 §025 `page_expired`, `not_found` (unknown names, `data` `main`,
`constructor` paths); 13 §015 fragment and typed endpoint values (`3`, `"x"`, a date); 14 §030
`check_endpoint_auth`; 15 §030 `check_fragment_auth` without the refused element; 16 §025
`application_error`; 17 §125 close then `page_expired`. Not checked: 503, `HEAD` of runtime and files, 413.
Run on every adapter with and without prefix and CSP.

## Part C · Worker

<a id="gc-101-205"></a>

### 205 · Messages

Block ID: **GC-101-205**.

`@gramlot/gramlot-serverless` (gramlot-js-server): one dedicated Worker per tab running `GramlotWorkerServer`
(a `GramlotServer`); window side `WorkerTransport`; all via `postMessage`. Open `{id, open: true}` →
`{id, open}` with the `registerPage` bootstrap data, `capabilities: []`, `nameSyntax`; calls `{id, text}` →
`{id, text}` (request/response envelope text); failed open or `InvalidRequest` → `{id, error: {name,
message}}`; close `{pageId}` without `id`. No §120 transport errors. No synchronous call (`dataRemote` with
`sync` reads asynchronously). Null owner, check always matches; `auth` protects nothing. Conformance: envelope
items 10 and 12–16 over `postMessage`.

## Part D · WebSocket

<a id="gc-101-305"></a>

### 305 · Messages

Block ID: **GC-101-305**.

`websocket` capability: one text message per request envelope, one per response, any order, paired by `id`;
server messages without `id` = push (`push`); close `{pageId}` without `id`; closing the socket closes the page.
No current adapter offers it; the base runtime has no WebSocket transport.

## Part E · Application metadata

<a id="gc-101-310"></a>

### 310 · Root web-app manifest

Block ID: **GC-101-310**.

`GET <prefix>/app.webmanifest` → the root page's `manifest` result, only when `installable` is true, as JSON
`application/manifest+json`; `HEAD` same status/headers, no body; other methods 405; missing or not installable
root 404. No page registered, no envelope or endpoint; public metadata. Server operations
`page_manifest(prefix=...)`/`pageManifest({prefix})`; the adapter maps HTTP. Only the root bootstrap links the
manifest; mounted at `/demo` → scope, id, start URL `/demo/`. Page side:
[Writing pages](095-writing-pages.md#gc-095-110).

<a id="gc-101-315"></a>

### 315 · Device suitability

Block ID: **GC-101-315**.

`Page.devices` (tuple/array of `desktop`, `tablet`, `phone`; empty = undeclared) → copy in `config.devices`
(HTTP) or the `registerPage` result (Worker) → frozen `gramlot.devices`. Information only, not permission,
redirect or layout; adapters do not interpret it.
