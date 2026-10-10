# 230 · Server protocol

Document ID: **GC-230**. Started: **2026-10-08** (0.2.12). Rewritten: **2026-10-09**
for 0.2.14. Part A states the contract between the browser runtime and any Gramlot
server, independent of the transport. Parts B, C and D state its realisation over
HTTP, inside a Worker and over WebSocket. The internal technique of a server is
free; what it exposes is this. Rules already in the code cite the core line that
implements them (server `GramlotServer`: `src/gramlot/server/gramlot_server.py`,
`js/src/server/gramlot-server.js`; reference adapters: `tests/http_server.py`,
`scripts/fixture_servers.mjs`; client: `js/src/http-transport.js`,
`js/src/handlers/rpc-handler.js`). Decisions: `temp/perimetro-0-2-x.md`, section 0.2.14.

## Part A · The contract

<a id="gc-230-005"></a>

### 005 · Scope and terms

Block ID: **GC-230-005**.

- Gramlot is a JS rendering library plus the rules of this document, which a
  server MUST or MAY satisfy (§040). The server side is realised separately for
  each kind of server (Kajenn, other Python servers, Node and Bun, a serverless
  Worker) under this one logical contract.
- `GramlotServer` opens pages, keeps the page registry, builds the Source
  fragments and runs the endpoints; it has no transport. An adapter connects it to
  a transport and owns everything the transport adds (URLs, bodies, status codes,
  cookies, headers, Worker messages).
- A **page** is a server page class (`Page`) opened for one browser tab. The open
  answers the **bootstrap** (§010).
- A **fragment** is a piece of Source built on the server. The whole page is the
  fragment named `main`, mounted in the root of the bootstrap; every other fragment
  is mounted below a node of the client Source.
- An **endpoint** is a server method the client calls for a value.
- Every call carries a **gramlot-content-type** (§015): `source` for a fragment,
  `data` for a value. Every message is an **envelope** (§020) that describes itself:
  the same message goes over HTTP, `postMessage` and WebSocket.

<a id="gc-230-010"></a>

### 010 · Page lifecycle and bootstrap

Block ID: **GC-230-010**.

- Opening a page registers it with a `pageId` and an **owner** and answers the
  bootstrap: the HTML document with `<title>` from `Page.title`, the import map
  mapping `@gramlot/gramlot/page` to the runtime URL, the root `div` (`gramlot-root`),
  the resources (`css`, `js`) and a module script that imports `PageBootstrap` and
  runs it with `{config, resources}` (`gramlot_server.py:152-190`,
  `gramlot-server.js:109-156`).
- `config` is `{pageId, rpcUrl, closeUrl, rootId, capabilities}`
  (`gramlot_server.py:169-171`, `gramlot-server.js:132-133`; read by `gramlot.js:18`):
  `rpcUrl` receives every envelope, `closeUrl` the close message, `capabilities` is
  the list of the MAY features the server offers (§040). Replaces
  `{pageId, mainUrl, sourceUrl, closeUrl, rootId}` of 0.2.12.
- A page that does not exist is `PageNotFound`; a full registry is
  `ServerCapacity` (`gramlot_server.py:157-163`, `gramlot-server.js:111-117`).
- Every call names the `pageId`; a call of another owner, of an unknown or of an
  expired page is the outcome `page_expired` (§025). Page IDs are not login.
- A page is closed by the close message (§020) or by `close_all()`/`closeAll()` on
  shutdown (`gramlot_server.py:243-250`, `gramlot-server.js:207-214`).
- `GramlotServer` creates a new `Page` instance for every call
  (`gramlot_server.py:214`, `gramlot-server.js:181`). The contract promises no state between calls; a
  server MAY keep it (§040).

<a id="gc-230-015"></a>

### 015 · gramlot-content-type

Block ID: **GC-230-015**.

| `contentType` | The client asks | The page declares | The value | Mounted |
|---|---|---|---|---|
| `source` | a fragment: `main` or another | `main`; `@source` / `Page.registerSource` | the **fragment document**: TYTX JSON of the `GramlotBuilderBag` the method populated (`gramlot_server.py:235-241`, `gramlot-server.js:200-204`) | root for `main`; below a node of the client Source otherwise |
| `data` | a value or a computation | `@endpoint` / `Page.registerEndpoint` (`base.py:34-37`, `page.js:73-75`) | TYTX JSON of one value: scalar, Bag or null; never code (`gramlot_server.py:232-234`, `gramlot-server.js:199`) | in Data, at the path the caller names |

- A fragment method populates the given root and returns nothing
  (`gramlot_server.py:236-240`, `gramlot-server.js:202-203`); an endpoint returns
  its value.
- Inline code runs only when it arrives inside a fragment (constitution 11.53); a
  `GramlotBuilderBag` inside a `data` value is a value and activates nothing.
- Names: `main` is reserved to the whole page; `main` is refused as a declared
  fragment or endpoint name (`base.py:17-18`, `page.js:34`). A fragment or endpoint
  name matches `^[A-Za-z][\w]*$` with ASCII word characters in both languages
  (`page.js:16`, `base.py:10`, `:61`); any other name is not declared and answers
  `not_found`. The same name may not be both a fragment and an endpoint
  (`base.py:64-65`, `page.js:42-43`).
- Arguments: Python methods receive `params` as keyword arguments
  (`gramlot_server.py:233`, `:230`), JS methods as one object
  (`gramlot-server.js:199`, `:194`).
  No parameter type check in 0.2.14 (the `Signature` of GC-225 §010 left the core
  with the routes package; GC-225 is amended with this document).

<a id="gc-230-020"></a>

### 020 · The envelope

Block ID: **GC-230-020**. Request checked by `gramlot_server.py:76-91` and
`gramlot-server.js:31-47`; response built by `gramlot_server.py:192-207` and
`gramlot-server.js:161-174`; sent and read by the client in `rpc-handler.js:36-42`.

```
request:  {id, pageId, contentType, name, params}
response: {id, contentType, value}
          {id, contentType, error: {code, name, message}}
close:    {pageId}
```

- `id`: a string the client generates; the response carries it back. Over a
  transport with free order (WebSocket) it pairs the two; on the same client node
  the latest request wins (constitution, `remoteSource`).
- `pageId`: the page of §010.
- `contentType`: `source` or `data` (§015). The response repeats it.
- `name`: the fragment or endpoint name. `main` is the whole page.
- `params`: a JSON object, name → value, encoded as TYTX JSON; `{}` when there are
  none. `null`, an array or a scalar is a transport error (§120), never reaches
  `GramlotServer`. A string value carrying a TYTX suffix (`"x::D"`) is decoded by
  TYTX, not passed through as text (genro-tytx decodes only text it encoded):
  endpoint authors do not rely on such strings.
- `value`: the fragment document or the endpoint value (§015).
- `error`: the outcome (§025). `name` and `message` are those of the exception;
  with `GRAMLOT_DEV=DEBUG` the server MAY add further fields (the core adds
  `details`, `gramlot_server.py:205-206`, `gramlot-server.js:171`).
- Extra fields are allowed on both sides: the base library ignores them, an
  extension reads them (the Kajenn client: `changes`, `serverpath`).
- A message without `id` from the server is reserved to push (§040); the base
  client ignores it.
- The close message is `{pageId}` alone, sent without waiting for an answer
  (`http-transport.js:25-40`); over HTTP it is a beacon (§125).

<a id="gc-230-025"></a>

### 025 · Outcomes

Block ID: **GC-230-025**. The codes are spelled once, in `OUTCOME_CODES`
(`gramlot_server.py:51-53`, `gramlot-server.js:24-26`).

| `code` | Cause | Core class |
|---|---|---|
| `not_found` | the page declares no fragment or endpoint of that `contentType` and `name` | `SourceNotFound`, `EndpointNotFound` (`gramlot_server.py:222-224`, `gramlot-server.js:188-191`) |
| `page_expired` | unknown, expired, closed or unowned `pageId` | `PageExpired` (`gramlot_server.py:212-213`, `gramlot-server.js:180`) |
| `not_authenticated` | the target carries an `auth` rule and the server knows no identity for the caller | `NotAuthenticated` (`gramlot_server.py:228-231`, `gramlot-server.js:194-198`) |
| `not_authorized` | the target carries an `auth` rule the caller's identity does not satisfy | `NotAuthorized` (same lines) |
| `application_error` | the method raised; `name` and `message` are the exception's | any other exception, a value TYTX cannot serialise and an `evaluate_auth`/`evaluateAuth` result outside the three outcomes included (`gramlot_server.py:198-204`, `:221-222`, `gramlot-server.js:164-170`, `:185-187`) |

An outcome is a normal response of the transport (HTTP 200): status codes are for
transport failures only (§130). The class names stay the API of `GramlotServer`;
the `code` is their form in the envelope.

<a id="gc-230-030"></a>

### 030 · `auth`

Block ID: **GC-230-030**.

- The same attribute `auth` protects Source elements and endpoints. Its value is a
  rule in the syntax of the genro-routes `AuthPlugin` (`|`, `&`, `!` over tags), the
  legacy `_tags` of elements and `tags` of `@public_method`.
- Endpoint: an unsatisfied rule answers `not_authenticated` or `not_authorized`
  (§025); the method does not run (`gramlot_server.py:227-231`,
  `gramlot-server.js:192-198`).
- Element: when the server serialises a fragment, an element whose `auth` rule the
  evaluator refuses is left out with its subtree; the element never reaches the
  client. The server builds the fragment with `page.source_builder(name, auth=…)`
  and `new PageClass.sourceBuilder(name, {auth})`, passing the evaluator of the
  owner (`gramlot_server.py:235`, `gramlot-server.js:200-201`).
  `GramlotBuilder.to_tytx()` and `toTytx()` (`builder.py:122-126`,
  `gramlot-builder.js:191-193`) serialise `GramlotBuilderBag.authorized_copy(auth)`
  and `authorizedCopy(auth)` (`source.py:44-69`, `source.js:284-302`): a copy
  without the refused elements and without the `auth` attribute of the accepted
  ones (the rule belongs to the server), nested Source branches included. The live Source
  of the builder is not changed. An `auth` value that is not a string is a
  `TypeError`, answered as `application_error`. A builder without evaluator (the
  browser, authoring alone) keeps every element. genro-builders is not changed
  ([gramlot-org/gramlot#34](https://github.com/gramlot-org/gramlot/issues/34)).
- Who evaluates is an extension point of `GramlotServer` (§045). The base
  evaluator knows no identity: any `auth` rule answers `not_authenticated`
  (closed by default; `evaluate_auth`, `gramlot_server.py:134-138`;
  `evaluateAuth`, `gramlot-server.js:88-92`). Kajenn evaluates the avatar tags.
  An evaluator answers `None`/`null`, `not_authenticated` or `not_authorized`; any
  other result is a `TypeError`, answered as `application_error`
  (`gramlot_server.py:140-146`, `gramlot-server.js:94-102`); endpoints and elements
  go through the same check.
- `auth` protects what the server builds, not the page source. A JS page module
  served to the browser (§145) is readable; a Worker page (Part C) runs in the
  browser and `auth` is no protection there.

<a id="gc-230-035"></a>

### 035 · Declaring fragments and endpoints

Block ID: **GC-230-035**.

- Python: `@source` and `@endpoint`, bare or with `auth="rule"`, on methods of the
  `Page` subclass (`base.py:24-37`).
- JS: `Page.registerSource('name', {auth})` and
  `Page.registerEndpoint('name', {auth})` (`page.js:67-75`), static methods called after the
  class body (the decorator syntax is a `SyntaxError` on Node).
- Kajenn: an endpoint is an entry of genro-routes with its plugins (auth,
  permissions); the Kajenn adapter maps the envelope to the entry. Outside this
  document.
- `main` is the method `Page.main` in both languages.

<a id="gc-230-040"></a>

### 040 · MUST and MAY

Block ID: **GC-230-040**.

A server MUST, whatever its kind (the Worker included):

- open a page and answer the bootstrap with `capabilities` (§010);
- accept the envelope and answer the outcomes (§020, §025);
- `source`: build `main` and the declared fragments (§015);
- `data`: run the declared endpoints (§015);
- `auth` closed by default (§030);
- close a page on the close message and all pages on shutdown (§010);
- pass the conformance check of its transports (§150, §205).

A server MAY, and then names the capability in the bootstrap (`capabilities`,
`gramlot_server.py:129-132`, `gramlot-server.js:83-86`; empty in the base server):

| capability | Meaning | Realised by |
|---|---|---|
| `auth` | evaluates `auth` rules against an identity (otherwise every rule is `not_authenticated`) | Kajenn |
| `websocket` | the envelope over WebSocket (Part D) | Kajenn |
| `push` | messages without `id` from the server | Kajenn |
| `serverpath` | the client sends the changes of the `serverpath` Data branches with each call (extra field) | Kajenn |
| `state` | page state kept between calls | Kajenn, Genro |
| `grouplets` | catalogues of fragments | Kajenn, Genro |

The names are those of the 0.2.14 plan; the Kajenn extended client defines its
own, the base client only reads the list. A server MAY also reject a request
body above a size of its choice (§130) and reload pages in development
(`GRAMLOT_DEV`, GC-225).

<a id="gc-230-045"></a>

### 045 · Extension points

Block ID: **GC-230-045**.

The base library is extended without modification through:

1. the extra fields of the envelope (§020);
2. the transport of `gramlot.rpc` (`RpcHandler`, GC-225 §015): HTTP, Worker,
   WebSocket;
3. the hook on Data changes (the Kajenn client collects `serverpath`);
4. the `auth` evaluator of `GramlotServer`, used by the builders and by the endpoint
   resolution (§030).

## Part B · HTTP realisation

The URLs are written without the mount prefix (§105).

<a id="gc-230-105"></a>

### 105 · Mount prefix

Block ID: **GC-230-105**.

- An adapter may serve Gramlot below a mount prefix (`/py`). Every URL of this
  part is then below the prefix; the adapter removes the prefix before dispatching
  and answers 404 to paths outside it.
- The prefix without its final slash answers **301** to the prefix with the slash,
  query string kept: pages link each other with relative URLs
  (`tests/http_server.py:57-62`, `scripts/fixture_servers.mjs:77-81`).
- `open_page`/`openPage` adds the prefix once to the root-relative URLs of the
  bootstrap (`/…`, not `//…`); relative and absolute URLs stay as written
  (`gramlot_server.py:63-66`, `gramlot-server.js:59`).
- The bootstrap URLs are the defaults of `GramlotServer`: runtime
  `/assets/gramlot.js`, `rpc` `/gramlot/rpc`, `close` `/gramlot/close`
  (`gramlot_server.py:104-105`, `gramlot-server.js:66`).

<a id="gc-230-110"></a>

### 110 · Runtime URL

Block ID: **GC-230-110**.

- `GET` and `HEAD` of `/assets/gramlot.js` answer **200** with a `text/javascript`
  media type; any other method answers **405**.
- The file served is the one `runtime_asset()`/`runtimeAsset()` chooses:
  `gramlot.js` with `GRAMLOT_DEV=DEBUG`, `gramlot.min.js` otherwise; the URL is the
  same for both (`assets.py:16`, `assets.js:26`).

<a id="gc-230-115"></a>

### 115 · Page request

Block ID: **GC-230-115**.

- `GET` of a page path answers **200** `text/html` with the bootstrap of §010.
- The import map and the module script carry the same nonce, 16 random bytes in
  URL-safe base64 (`gramlot_server.py:165`, `gramlot-server.js:52-55`).
- `PageNotFound` answers **404**; `ServerCapacity` answers **503**. Any method
  other than `GET` on a page path answers **405**.
- As on a static host, `<path>/index.html` opens the page `<path>/` and
  `/index.html` the index (`tests/http_server.py:79-81`,
  `scripts/fixture_servers.mjs:96-97`).

<a id="gc-230-120"></a>

### 120 · RPC request

Block ID: **GC-230-120**. Adapters: `tests/http_server.py:73-108`,
`scripts/fixture_servers.mjs:46-61` and `:91-94`.

- `/gramlot/rpc` accepts **POST** only (**405** otherwise) with
  `Content-Type: application/json` (**415** otherwise). It replaces `/gramlot/main`
  and `/gramlot/source` of 0.2.12: `main` is the envelope
  `{contentType: 'source', name: 'main'}`.
- The body is the request envelope of §020 as TYTX JSON text. A body that is not a
  TYTX text the server can decode (`InvalidRequest` from `call`), not an
  object, or whose `id`, `pageId`, `contentType` or `name` is not a string, whose
  `contentType` is neither `source` nor `data`, or whose `params` is not an object
  is refused by `call` with `InvalidRequest` (`gramlot_server.py:76-91`,
  `gramlot-server.js:31-47`); the adapter answers **400** when `call` raises it
  (`tests/http_server.py:104-107`, `scripts/fixture_servers.mjs:55-58`).
- The adapter passes `owner` (§135) with every call.
- The response is **200** `application/json` with the response envelope of §020,
  for values and for outcomes alike.

<a id="gc-230-125"></a>

### 125 · Close request

Block ID: **GC-230-125**.

- `/gramlot/close` accepts **POST** `application/json` with `{pageId}` (same
  transport errors as §120) and answers **200** `application/json` `{"ok": true}`;
  it removes the page owned by the requester (`gramlot_server.py:243-246`,
  `gramlot-server.js:207-209`; adapters `tests/http_server.py:109-116`,
  `scripts/fixture_servers.mjs:62-66`). An unknown or unowned `pageId` answers the same.
- The client sends it as a beacon on `pagehide` (`http-transport.js:27-30`,
  `gramlot.js:30-31`, `bootstrap.js:40-45`, `:73-76`). The adapter reads the body by
  its `Content-Length`, which a beacon sends.

<a id="gc-230-130"></a>

### 130 · Transport status codes

Block ID: **GC-230-130**.

| Status | Cause | Core |
|---|---|---|
| 400 | Body not a valid envelope (§120, §125) | adapter |
| 404 | `PageNotFound` on page GET; path outside the prefix | §115, §105 |
| 405 | Method not allowed on the URL | §110, §115, §120, §125 |
| 413 | MAY: body above a size the adapter or the web server in front chooses; the contract fixes no size (owner, 2026-10-09; Kajenn: kajenn-org/kajenn#32) | adapter |
| 415 | Body not `application/json` | §120, §125 |
| 503 | `ServerCapacity` on page GET | §115 |

Every other failure is an outcome inside a 200 response (§025). `MAX_REQUEST_BYTES`
of 0.2.12 and its mandatory 413 are removed in 0.2.14.

<a id="gc-230-135"></a>

### 135 · Owner cookie

Block ID: **GC-230-135**.

- `GramlotServer` registers each page with an owner and answers `page_expired` to
  every call of another owner (`gramlot_server.py:212-213`, `gramlot-server.js:180`).
- An adapter that identifies the owner by cookie names it `gramlot_owner`, sets it
  on the page response with `Path=<prefix or />; HttpOnly; SameSite=Lax`, reuses
  the value the browser already sends, and passes it as `owner` to every call
  (`tests/http_server.py:82-89`, `scripts/fixture_servers.mjs:98-100`).
- An adapter may take the owner from its own identity system instead; without one,
  the owner is null for every request.

<a id="gc-230-140"></a>

### 140 · Content-Security-Policy

Block ID: **GC-230-140**.

- The policy belongs to the application. When an adapter is given one, it sends it
  as the `Content-Security-Policy` header of each page response, with `{nonce}`
  replaced by the bootstrap nonce of that response (`tests/http_server.py:90-91`,
  `scripts/fixture_servers.mjs:101`), so the header allows the two bootstrap scripts
  (§115).

<a id="gc-230-145"></a>

### 145 · Themes and companion files

Block ID: **GC-230-145**.

- `GET`/`HEAD` of `/themes/<path>` answer the file of the core themes whose real
  path is inside their folder, with the media type of its extension.
- `GET`/`HEAD` of a `.css` or `.js` URL answer the file whose real path is below
  the pages folder: page modules, companions `foo.css`, `foo_aux.js` and `Page.css`
  files placed there; any other file of the folder is not served
  (`gramlot_file_server.py:89`, `gramlot-file-server.js:112`;
  `tests/http_server.py:46-52`, `scripts/fixture_servers.mjs:24-35`).
- A JS page module whose `Logic` lives in the module itself is served to the
  browser (`gramlot-file-server.js:38-41`): `main` runs on the server
  (`fetch.mjs:130`) and the fragment document carries only what the builder kept,
  but the module source, `auth` rules included, is readable. A page whose logic is
  in `foo_aux.js` is not served. Python page modules are never served.
- Every root-relative URL of the bootstrap `resources` answers **200** with
  `text/css` (CSS) or `text/javascript` (JS).

<a id="gc-230-150"></a>

### 150 · Conformance check

Block ID: **GC-230-150**.

`check_protocol(base_url, page_path)` (Python, `gramlot.server`,
`src/gramlot/server/conformance.py`) and `checkProtocol(baseUrl, pagePath)` (JS,
`@gramlot/gramlot/server`, `js/src/server/conformance.js`) run the list below, in
this order, over HTTP against a running adapter. `base_url` includes the mount
prefix; `page_path` names a page of the adapter that declares the fragment
`check_fragment`, the fragment `check_fragment_auth` (an element with an `auth`
rule) and the endpoints `check_endpoint`, `check_endpoint_auth`
(with an `auth` rule) and `check_endpoint_raise` of the core fixtures
(`tests/fixtures/pages/index.py`, `js/tests/fixtures/pages/index.js`). The first failure raises `AssertionError` (Python) or rejects with
`AssertionError` from `node:assert` (JS), its message starting with the rule ID.
Standard library (`urllib`, `fetch`) plus genro-tytx / `@genrojs/tytx` for the envelope.

1. GC-230-105: with a prefix, `GET <prefix>` answers 301 to `<prefix>/`.
2. GC-230-115: `GET <page>` answers 200 `text/html` with the bootstrap module
   script; the import map carries its nonce; `config` has `rpcUrl`, `closeUrl`
   and a `capabilities` array.
3. GC-230-105: the bootstrap URLs are the defaults below the prefix.
4. GC-230-140: a `Content-Security-Policy` header, when present, contains
   `'nonce-<nonce>'`.
5. GC-230-135: a `gramlot_owner` cookie, when set, has `HttpOnly`,
   `SameSite=Lax` and the prefix path; later requests send it.
6. GC-230-110: `GET` of the runtime answers 200 `text/javascript`; `POST` answers 405.
7. GC-230-145: each root-relative bootstrap resource answers 200 with its media type.
8. GC-230-115: an unknown page answers 404; `POST <page>` answers 405; when
   `page_path` ends with `/`, `<page>index.html` answers the page.
9. GC-230-120: `rpc` answers 405 to `GET`, 415 to `text/plain`, 400 to invalid
   JSON, to a body without `pageId`, with `params: null`, with an array `params`,
   with an unknown `contentType`.
10. GC-230-020: `source`/`main` answers 200 `application/json` with an envelope
    whose `id` and `contentType` echo the request and whose `value` is a string.
11. GC-230-135: with an owner cookie, the same call without it answers
    `page_expired`.
12. GC-230-025: `main` of an unknown `pageId` answers `page_expired`; an unknown
    fragment name and an unknown endpoint name answer `not_found`;
    `{contentType: 'data', name: 'main'}` answers `not_found`.
13. GC-230-015: `source`/`check_fragment` with `params` answers a fragment
    document; `data`/`check_endpoint` with `params` answers the value the fixture
    computes from them: `3`, `"x"` and a date, which comes back as the same typed
    value.
14. GC-230-030: `data`/`check_endpoint_auth` (an endpoint with an `auth` rule)
    answers `not_authenticated` on an adapter without the `auth` capability; on an
    adapter with it, `not_authenticated`, `not_authorized` or a value.
15. GC-230-030: `source`/`check_fragment_auth` answers a fragment document; on an
    adapter without the `auth` capability the document does not contain the
    element with the `auth` rule (its text `check-refused`).
16. GC-230-025: `data`/`check_endpoint_raise` answers `application_error` with the
    exception `name`.
17. GC-230-125: `close` answers 200 `{"ok": true}`; `main` of the closed page
    answers `page_expired`.

Not checked: the 503 of a full registry (filling it takes `max_pages` page
requests), `HEAD`, and the 413 of a server that chooses a size.

The core runs both checks against both reference adapters
(`tests/test_conformance.py`, `js/tests/conformance.test.js`), with and without a
mount prefix and a policy. An adapter repository runs them against its own
adapters.

## Part C · Worker realisation

<a id="gc-230-205"></a>

### 205 · Messages

Block ID: **GC-230-205**. Realised by the serverless package of gramlot-js-server,
outside this repository, after the core 0.2.14; the line citations below are to
its 0.2.12 code.

- The serverless package runs one `GramlotWorkerServer` (a `GramlotServer`) per
  tab inside a dedicated Worker (`gramlot-worker-server.js:9-18`); the window side
  is `WorkerTransport`. Every message goes through `postMessage`.
- Open: the window sends `{id, open: true}` (0.2.12: `operation: 'open'`) and receives the bootstrap data of §010 with `capabilities: []`.
- Calls: the request and response envelopes of §020, unchanged. The Worker
  dispatches on `contentType` and `name` (0.2.12 dispatched on `operation`,
  `gramlot-worker-server.js:35-43`).
- Close: the close message `{pageId}` without `id`.
- Transport errors of §120 do not exist: the window is the only sender.
- The owner is null (`gramlot-worker-server.js:39-41`); the owner check stays and
  always matches. `auth` is no protection: the page runs in the browser (§030).
- Conformance: the serverless package runs the envelope part of the check (items
  10, 12-16 of §150) over `postMessage`.

## Part D · WebSocket realisation (MAY)

<a id="gc-230-305"></a>

### 305 · Messages

Block ID: **GC-230-305**.

- A server with the `websocket` capability accepts the request envelope as one
  text message each and answers each with its response envelope; responses may
  arrive in any order and `id` pairs them.
- A message without `id` from the server is a push (`push` capability).
- The close message is `{pageId}` without `id`; closing the socket closes the
  page as well.
- Realised by the Kajenn extended client after 0.2.14; the base client has no
  WebSocket transport.
