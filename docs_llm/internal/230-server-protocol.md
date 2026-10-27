# 230 · Server protocol

Document ID: **GC-230**. Started: **2026-10-08** (0.2.12). Rewritten: **2026-10-09**
for 0.2.14. Revised: **2026-10-19**, review of the 0.3.5 releases, phase p4 (the
operations shared by every adapter, the name syntax declared by the server, the
server adapter of the page, the base theme) and phase p4c (the page expiry renewed
by use, the owner cookie without lifetime). Part A states the contract between the
browser runtime and any Gramlot server, independent of the transport. Parts B, C and
D state its realisation over HTTP, inside a Worker and over WebSocket. The internal
technique of a server is free; what it exposes is this. Rules already in the code
cite the core function that implements them (server `GramlotServer`:
`src/gramlot/server/gramlot_server.py`, `js/src/server/gramlot-server.js`; reference
adapters: `tests/http_server.py`, `scripts/fixture_servers.mjs`; client:
`js/src/http-transport.js`, `js/src/server-adapter.js`,
`js/src/handlers/rpc-handler.js`). The sections not revised on 2026-10-19 also cite
lines of the 0.2.14 code; those numbers are historical pointers. Decisions:
`temp/perimetro-0-2-x.md`, section 0.2.14.

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
- The core gives every adapter, whatever its transport, the operations of this
  contract: `GramlotServer.decode_body`, `call`, `close`, `open_page`, `close_all` and
  `theme_file` (JS `decodeBody`, `call`, `close`, `openPage` or `registerPage`,
  `closeAll`, `themeFile`) and, on a pages folder, `GramlotFileServer.companion_file`
  (JS `companionFile`). The adapter keeps only what its transport adds:
  routes, methods, status codes, headers, cookies, media types (review decision
  d-adapter-api, owner 2026-10-19).
- The **server adapter** is the object of the browser page that holds the
  server-dependent behaviour, `gramlot.serverAdapter` (class `ServerAdapter`, §045).
  The server chooses it in the bootstrap (§010); the core consults it, page authors
  do not call it.

<a id="gc-230-010"></a>

### 010 · Page lifecycle and bootstrap

Block ID: **GC-230-010**.

- Opening a page registers it with a `pageId` and an **owner** and answers the
  bootstrap: the HTML document with `<title>` from `Page.title`, the import map
  mapping `@gramlot/gramlot/page` to the runtime URL, the root `div` (`gramlot-root`),
  the resources (`css`, `js`) and a module script that imports `PageBootstrap` and
  runs it with `{config, resources}` (`GramlotServer.open_page`, JS `openPage`).
- `config` is `{pageId, rpcUrl, closeUrl, rootId, capabilities, nameSyntax}`, with
  `devices`, `locale` and `timeZone` when the page declares them (read by `Gramlot`):
  `rpcUrl` receives every envelope, `closeUrl` the close message, `capabilities` is
  the list of the MAY features the server offers (§040), `nameSyntax` the name
  syntax the server declares (§015), as `{kind: "regex", pattern, flags}`. Replaces
  `{pageId, mainUrl, sourceUrl, closeUrl, rootId}` of 0.2.12.
- `resources` is `{css: [url], js: [{url, group}]}`, with `collections` (application
  collection modules) and `serverAdapter` when the server has them. `css` starts
  with the theme of the page (`theme_css`/`themeCss`): the base theme of the server
  (option `css_theme`/`cssTheme`, default `gramlot-base`, `False`/`false` for none),
  unless the page replaces it (`Page.css_theme`: a theme name, or `False`/`false`
  for no theme); then the CSS the server resolves (`Page.css`, companions). Each URL
  appears once, in its last position, so a page that still lists the base theme in
  `Page.css` loads it once. The core ships one complete theme, `gramlot-base`;
  `gramlot-compact`, `mimi` and `joanna` are overlays a page loads after it with
  `Page.css`. `serverAdapter` is the URL of a module whose default
  export is the `ServerAdapter` class of the page (`GramlotServer.server_adapter`,
  JS `serverAdapter`); the module imports the core from `@gramlot/gramlot/page`,
  which the import map points at the runtime already loaded. Without it the page
  uses the HTTP `ServerAdapter` of the runtime (§045).
- As on a static host, `<path>/index.html` opens the page `<path>/` and
  `/index.html` the index: `open_page` and `registerPage` map the path.
- A page that does not exist is `PageNotFound`; a full registry is
  `ServerCapacity`.
- Every call names the `pageId`; a call of another owner, of an unknown or of an
  expired page is the outcome `page_expired` (§025). Page IDs are not login.
- A page is closed by the close message (§020, `close`) or by
  `close_all()`/`closeAll()` on shutdown.
- A page expires `page_ttl` seconds after its last use (JS `pageTtl`, default 1800;
  owner decision 2026-10-19, review phase p4c). Opening the page sets its expiry to
  now plus `page_ttl`. Every call that names a page of its owner that has not expired
  moves the expiry to now plus `page_ttl` again, whatever the outcome of the method
  (`not_found`, `not_authenticated`, `not_authorized` and `application_error`
  included), because the page is in use (`GramlotServer._run`, JS `#run`). Nothing
  else renews a page: a call of another owner, of an unknown or of an expired page
  answers `page_expired` and changes nothing; a request the server cannot decode
  (`InvalidRequest`), the close message and the requests that name no page renew
  nothing. A page that no call names for `page_ttl` seconds is removed: its next call
  answers `page_expired`. The clock is monotonic (Python `time.monotonic`, JS
  `performance.now`). The renewal is in the core, in `call`: an adapter does nothing
  for it, and the cookie of §135 has no lifetime to renew.
- `GramlotServer` creates a new `Page` instance for every call. The contract promises
  no state between calls; a server MAY keep it (§040).

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
  fragment or endpoint name (`base.py` `_mark`, `page-base.js` `declare`). A declared
  method name matches `^[A-Za-z][A-Za-z0-9_]*$` in both languages (`DECLARED_NAME`).
- Name syntax: the `name` of a request follows the syntax the server declares,
  `GramlotServer.name_syntax` (JS `nameSyntax`), a `NameSyntax`: a portable regex in
  the format of genro-builders (`Regex(pattern, flags)`, exported as
  `{kind: "regex", pattern, flags}`), matched whole and loaded as genro-builders
  loads a grammar regex, so a construct that Python and JavaScript read differently
  (`\w`, `(?P<…>)`, inline flags, `IGNORECASE`) is refused. The bootstrap carries it
  (§010); the builders of the server and of the browser check the names of the
  `remote` helper with it, and the browser checks a name read from Data when the
  request is sent. A name outside the syntax is not declared and answers
  `not_found` (review decision d-pointer-separator, owner 2026-10-19).
- The core default `NAME_SYNTAX` is a declared method of the page or a path
  `a.b.c.method` read from the page (constitution 11.85;
  `resolve_declared`/`resolveDeclared`): every segment before the last is a public
  attribute (a getter runs), the last a method declared with the `contentType`'s
  marker on the class of the object before it, whose `auth` is the only
  authorization. In JS every object on the path is an `Exposed` instance, so an
  inherited member such as `constructor` never leads to a method. Any other name is
  not declared and answers `not_found`. A subclass of `GramlotServer` may declare a
  narrower syntax; a server whose syntax is not dotted resolves its names itself.
  The same name may not be both a fragment and an endpoint (`base.py` `_declared`,
  `page-base.js` `declare`).
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
  transport with free order (WebSocket) it pairs the two. A client Source node has
  one request in flight; the next waits for its answer (constitution 11.85,
  `node.requests`).
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
  extension may read them (planned Genro/genro-kajenn: `changes`, `serverpath`).
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
| `page_expired` | unknown, expired (no call for `page_ttl` seconds, §010), closed or unowned `pageId` | `PageExpired` (`gramlot_server.py:212-213`, `gramlot-server.js:180`) |
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
- Who evaluates is an extension point of `GramlotServer` (§045):
  `evaluate_auth(rule, *, owner, identity)`, JS `evaluateAuth(rule, {owner, identity})`.
  `identity` is the identity the adapter passes with the call
  (`call(text, owner=…, identity=…)`, JS `call(text, {owner, identity})`), for
  example the avatar of a login; `None`/`null` when it passes none. The server keeps
  nothing of it between calls, so an adapter never stores a per-request identity on
  the shared server object. The base evaluator knows no identity: any `auth` rule
  answers `not_authenticated` (closed by default). Kajenn evaluates the avatar tags.
  An evaluator answers `None`/`null`, `not_authenticated` or `not_authorized`; any
  other result is a `TypeError`, answered as `application_error`; endpoints and
  elements go through the same check.
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
- The current Kajenn adapter calls the same Page endpoints and evaluates avatar
  tags for auth. Mapping endpoints to genro-routes entries and their plugins is
  planned genro-kajenn integration, not delivered by this adapter.
- `main` is the method `Page.main` in both languages.

<a id="gc-230-040"></a>

### 040 · MUST and MAY

Block ID: **GC-230-040**.

A server MUST, whatever its kind (the Worker included):

- open a page and answer the bootstrap with `capabilities` and `nameSyntax` (§010);
- accept the envelope and answer the outcomes (§020, §025);
- read a request body as UTF-8 with a leading byte order mark removed (§120);
- `source`: build `main` and the declared fragments (§015);
- `data`: run the declared endpoints (§015);
- `auth` closed by default (§030);
- close a page on the close message and all pages on shutdown (§010);
- pass the conformance check of its transports (§150, §205).

A server MAY, and then names the capability in the bootstrap (`capabilities`,
`gramlot_server.py:129-132`, `gramlot-server.js:83-86`; empty in the base server):

| capability | Meaning | Implementation status |
|---|---|---|
| `auth` | evaluates `auth` rules against an identity (otherwise every rule is `not_authenticated`) | Implemented by the Kajenn adapter for avatar-tag auth |
| `websocket` | the envelope over WebSocket (Part D) | Isolated Uvicorn shared-channel PoC (GC-250); released adapter parity remains planned |
| `push` | messages without `id` from the server | Planned extended Genro/genro-kajenn scope; not in current adapters |
| `serverpath` | the client sends the changes of the `serverpath` Data branches with each call (extra field) | Planned extended Genro/genro-kajenn scope; not in current adapters |
| `state` | page state kept between calls | Planned extended Genro/genro-kajenn scope; not in current adapters |
| `grouplets` | catalogues of fragments | Planned extended Genro/genro-kajenn scope; not in current adapters |

The names are those of the 0.2.14 plan; a future Genro/genro-kajenn extended client may define its
own, the base client only reads the list. A server MAY also reject a request
body above a size of its choice (§130) and reload pages in development
(`GRAMLOT_DEV`, GC-225).

<a id="gc-230-045"></a>

### 045 · Extension points

Block ID: **GC-230-045**.

The base library is extended without modification through:

1. the extra fields of the envelope (§020);
2. the server adapter of the page, `gramlot.serverAdapter`: the server names the
   module of its class in the bootstrap (`resources.serverAdapter`, §010) and
   `PageBootstrap` gives an instance to `Gramlot`. It is not a proxy: the core
   consults it, page authors do not call it. The core `ServerAdapter` realises HTTP;
   the serverless Worker and Kajenn provide subclasses. Its method today is
   `createTransport({rpcUrl, closeUrl, document})`, the transport of `gramlot.rpc`;
3. the transport of `gramlot.rpc` (`RpcHandler`, GC-225 §015): HTTP, Worker,
   WebSocket. Its contract has three required members: `call(text, signal)`,
   `close(pageId, {beacon})` and `dispose()`. A page with a transport sends `close`
   and then `dispose` when it is disposed, and disposes itself on a `pagehide` that
   does not keep it in the back/forward cache (a beacon over HTTP). `HttpTransport`
   holds no connection: its `dispose` releases nothing. A transport MAY send a
   synchronous call: it then declares `supportsCallSync` true and has
   `callSync(text)`, which returns the response envelope text and blocks the page
   until the answer arrives. `gramlot.rpc.callSync(contentType, name, params)` uses
   it (the legacy `genro.serverCall` without callback), and a `dataRemote` with
   `sync` reads through it (GC-095 §105); on a transport without it `callSync`
   throws and `dataRemote` reads asynchronously. `HttpTransport` sends it with a
   synchronous `XMLHttpRequest`, which the browsers deprecate on the main thread;
   the Worker and a WebSocket cannot. A later step aims to remove synchronous calls
   (owner decision 2026-10-19; the plan of the asynchronous resolvers);
4. the hook on Data changes (planned Genro/genro-kajenn collection of `serverpath`);
5. the `auth` evaluator of `GramlotServer`, used by the builders and by the endpoint
   resolution, with the identity of the call (§030);
6. the name syntax of `GramlotServer` (§015).

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
  URL-safe base64.
- `PageNotFound` answers **404**; `ServerCapacity` answers **503**. Any method
  other than `GET` on a page path, `HEAD` included, answers **405** with an `Allow`
  header that lists `GET`.
- As on a static host, `<path>/index.html` opens the page `<path>/` and
  `/index.html` the index: the adapter passes the path to `open_page`, which maps it
  (§010).

<a id="gc-230-120"></a>

### 120 · RPC request

Block ID: **GC-230-120**. Adapters: `tests/http_server.py:73-108`,
`scripts/fixture_servers.mjs:46-61` and `:91-94`.

- `/gramlot/rpc` accepts **POST** only (**405** otherwise) with
  `Content-Type: application/json` (**415** otherwise). The media type is compared
  case-insensitively, ignoring surrounding whitespace and semicolon parameters;
  an absent/empty type or a lookalike such as `application/jsonp` is refused.
  It replaces `/gramlot/main` and `/gramlot/source` of 0.2.12: `main` is the
  envelope `{contentType: 'source', name: 'main'}`.
- The adapter reads the body with `decode_body(data)`/`decodeBody(data)`: UTF-8,
  a leading byte order mark (EF BB BF) removed, as RFC 8259 §8.1 allows. The
  Gramlot client never sends the mark; a body saved by an editor may carry it.
  Bytes that are not UTF-8, including a bad byte inside otherwise valid JSON, raise
  `InvalidRequest`, which the adapter answers **400** before calling the server
  (review decision d-bom, 2026-10-19: until then the Python adapters answered 400
  to the mark and js-server removed it).
- The body is the request envelope of §020 as TYTX JSON text. A body that is not a
  TYTX text the server can decode (`InvalidRequest` from `call`), not an
  object, or whose `id`, `pageId`, `contentType` or `name` is not a string, whose
  `contentType` is neither `source` nor `data`, or whose `params` is not an object
  is refused by `call` with `InvalidRequest`; the adapter answers **400** when `call`
  raises it.
- The adapter passes `owner` (§135) with every call and, when it has an identity
  system, the `identity` of the request (§030).
- The response is **200** `application/json` with the response envelope of §020,
  for values and for outcomes alike.

<a id="gc-230-125"></a>

### 125 · Close request

Block ID: **GC-230-125**.

- `/gramlot/close` accepts **POST** `application/json` with `{pageId}` (same
  transport errors as §120, the body read with `decode_body`) and answers **200**
  `application/json` `{"ok": true}`. The adapter passes the text to
  `close(text, owner=…)`/`close(text, {owner})`, which removes the page owned by the
  requester; a text that is not JSON, or whose `pageId` is not a string, raises
  `InvalidRequest` (**400**). An unknown or unowned `pageId` answers `{"ok": true}`.
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
| 405 | Method not allowed on the URL; on a page path with `Allow: GET` | §110, §115, §120, §125 |
| 413 | MAY: body above a size the adapter or the web server in front chooses; the contract fixes no size (owner, 2026-10-09; Kajenn: kajenn-org/kajenn#32) | adapter |
| 415 | Body not `application/json` | §120, §125 |
| 503 | `ServerCapacity` on page GET | §115 |

Every other failure is an outcome inside a 200 response (§025). `MAX_REQUEST_BYTES`
of 0.2.12 and its mandatory 413 are removed in 0.2.14.

<a id="gc-230-135"></a>

### 135 · Owner cookie

Block ID: **GC-230-135**.

- `GramlotServer` registers each page with an owner and answers `page_expired` to
  every call of another owner; `close` of another owner leaves the page open. The
  core takes the owner with each operation (`open_page`, `call`, `close`); the
  cookie belongs to the adapter.
- An adapter over HTTP MUST give each browser its own owner (review decision
  d-owner, owner 2026-10-19): a page opened by one browser is reachable from
  another only as `page_expired`. A null owner for every request is not allowed
  over HTTP. The Worker (Part C) keeps the null owner: page and Worker live in the
  same browser.
- An adapter that identifies the owner by cookie names it `gramlot_owner`, sets it
  on the page response with `Path=<prefix or />; HttpOnly; SameSite=Lax`, reuses
  the value the browser already sends, and passes it as `owner` to every call. The
  value is 24 random bytes in URL-safe base64 in the reference adapters.
- The cookie has no lifetime (review phase p4c, owner 2026-10-19): the attributes
  above include no `Max-Age` and no `Expires`, as in the reference adapters, so it is
  a session cookie. Nothing renews it and the core gives an adapter no value to
  re-issue it. The expiry of a page (§010) does not depend on it: a call whose cookie
  is gone has another owner and answers `page_expired`.
- An adapter may take the owner from its own identity system instead, with the same
  isolation between browsers.

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
  path is inside their folder, with the media type of its extension. The file is
  `GramlotServer.theme_file(path)` (JS `themeFile`), `None`/`null` when the
  core has none; the adapter adds methods, media types and headers. It is on
  `GramlotServer`, not on `GramlotFileServer`: it does not read the pages folder and
  the bootstrap lists the theme of the page (§010), so a server that resolves its pages another way
  serves the themes too. JS `themeFile` loads the Node.js file lookup
  (`js/src/server/files.js`) on its first call, so the neutral `gramlot-server.js` has no
  Node.js import and the Worker bundle builds; a Worker never calls it (review p4d).
- `GET`/`HEAD` of a `.css` or `.js` URL answer the file whose real path is below
  the pages folder: page modules, companions `foo.css`, `foo_aux.js` and `Page.css`
  files placed there; any other file of the folder is not served. The file is
  `GramlotFileServer.companion_file(path)` (JS `companionFile`); a path with a NUL
  character names no file.
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

`check_protocol(base_url, page_path, *, page_ttl=None)` (Python, `gramlot.server`,
`src/gramlot/server/conformance.py`) and `checkProtocol(baseUrl, pagePath, {pageTtl})` (JS,
`@gramlot/gramlot/server`, `js/src/server/conformance.js`) run the list below, in
this order, over HTTP against a running adapter. `base_url` includes the mount
prefix; `page_path` names a page of the adapter that declares the fragment
`check_fragment`, the fragment `check_fragment_auth` (an element with an `auth`
rule) and the endpoints `check_endpoint`, `check_endpoint_auth`
(with an `auth` rule) and `check_endpoint_raise` of the core fixtures
(`tests/fixtures/pages/index.py`, `js/tests/fixtures/pages/index.js`). The first failure raises `AssertionError` (Python) or rejects with
`AssertionError` from `node:assert` (JS), its message starting with the rule ID.
Standard library (`urllib`, `fetch`) plus genro-tytx / `@genrojs/tytx` for the envelope.
`page_ttl` (JS `pageTtl`) is the `page_ttl` in seconds of the server of the adapter, a
short one so that the check is fast; with it the check also runs item 18, which takes
about 2.5 times `page_ttl`; without it item 18 is left out.

1. GC-230-105: with a prefix, `GET <prefix>` answers 301 to `<prefix>/`.
2. GC-230-115: `GET <page>` answers 200 `text/html` with the bootstrap module
   script; the import map carries its nonce; `config` has `rpcUrl`, `closeUrl`
   and a `capabilities` array; GC-230-010: `config.nameSyntax` is
   `{kind: "regex", pattern, flags}`.
3. GC-230-105: the bootstrap URLs are the defaults below the prefix.
4. GC-230-140: a `Content-Security-Policy` header, when present, contains
   `'nonce-<nonce>'`.
5. GC-230-135: a `gramlot_owner` cookie, when set, has `HttpOnly`,
   `SameSite=Lax` and the prefix path; later requests send it.
6. GC-230-110: `GET` of the runtime answers 200 `text/javascript`; `POST` answers 405.
7. GC-230-145: each root-relative bootstrap resource answers 200 with its media type.
8. GC-230-115: an unknown page answers 404; `POST`, `HEAD`, `PUT`, `DELETE` and
   `PATCH` of `<page>` answer 405 with an `Allow` header that lists `GET` and not
   the method; when `page_path` ends with `/`, `<page>index.html` answers the page.
9. GC-230-120/125: `rpc` answers 405 to `GET`; both `rpc` and `close` answer
   415 to `text/plain`, JSON-prefix lookalikes and empty media types, and 400 to
   invalid UTF-8 inside otherwise valid JSON. Mixed-case JSON media types and
   charset parameters are accepted. Invalid close requests leave the page usable.
   A body with a leading byte order mark is accepted: `rpc` answers the endpoint
   value, `close` `{"ok": true}`. `rpc` also answers 400 to invalid JSON, a body
   without `pageId`, `params: null`, array `params` and an unknown `contentType`.
10. GC-230-020: `source`/`main` answers 200 `application/json` with an envelope
    whose `id` and `contentType` echo the request and whose `value` is a string.
11. GC-230-135: the same call without the cookies of the page answers
    `page_expired`; with an owner cookie, the call with another owner value answers
    `page_expired`; a close without the cookies of the page leaves the page usable.
12. GC-230-025: `main` of an unknown `pageId` answers `page_expired`; an unknown
    fragment name and an unknown endpoint name answer `not_found`;
    `{contentType: 'data', name: 'main'}` answers `not_found`; `constructor`,
    `constructor.prototype.check_endpoint` and (`source`)
    `constructor.prototype.check_fragment` answer `not_found`.
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
18. GC-230-010, only with `page_ttl` (review phase p4c): a page opened now answers a
    call at 0.5 `page_ttl`, answers another one at 1.2 `page_ttl` after its opening
    (0.7 `page_ttl` after the previous call, so the previous call renewed it), and
    answers `page_expired` to a call 1.3 `page_ttl` after the previous one.

Not checked: the 503 of a full registry (filling it takes `max_pages` page
requests), `HEAD` of the runtime and of the files, and the 413 of a server that
chooses a size. Item 18 needs an adapter whose server has a short `page_ttl`, because
the default is 1800 seconds: the reference adapters take one
(`tests/http_server.py --page-ttl`, `pageTtl` of `startServers` in
`scripts/fixture_servers.mjs`) and the core tests give it to both checks
(`tests/test_conformance.py`, `js/tests/conformance.test.js`, which also run the check
against an adapter whose TTL is not the one given). The renewal is in
`GramlotServer.call`, which every adapter uses; the unit tests move a clock instead of
waiting (`PageExpiryTests` in `tests/test_source_server.py`, the `page expiry` tests of
`js/tests/gramlot-server.test.js`). The checks of `HEAD` and of the other methods on the page path, of
the owner isolation and of the byte order mark were added in review phase p4. Run on
2026-10-19 with this core against the released adapters: Flask and Django of
gramlot-py-server 0.2.10 answer 200 to `HEAD`; Django, Kajenn and gramlot-js-server
0.2.13 answer 405 without `Allow`; the five Python adapters answer 400 to the byte
order mark; js-server gives every browser the same owner. The core tests run the
checks also against an adapter with each defect (`js/tests/conformance.test.js`).

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
- Open: the window sends `{id, open: true}` (0.2.12: `operation: 'open'`) and receives the bootstrap data of §010 with `capabilities: []` and `nameSyntax` (`registerPage`).
- Calls: the request and response envelopes of §020, unchanged. The Worker
  dispatches on `contentType` and `name` (0.2.12 dispatched on `operation`,
  `gramlot-worker-server.js:35-43`).
- Close: the close message `{pageId}` without `id`.
- Transport errors of §120 do not exist: the window is the only sender.
- `WorkerTransport` has no synchronous call (§045): a `dataRemote` with `sync`
  reads asynchronously.
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
- Released adapter support remains planned. The isolated Uvicorn PoC now
  supplies WebSocketTransport on the shared PageStore channel (GC-250 §018),
  as requested by the owner on 2026-10-27. It keeps these RPC envelopes and
  adds pageId to responses for descendant routing. Its binder pushes use op
  without id; cancellation uses op=cancel with pageId/id. Descendants close
  through detach, the primary by socket close, with HTTP close notification
  retained for bootstrap cleanup. This bounded extension supersedes the simple
  close packet above for the PoC only; it does not claim adapter parity.


## Part E · Application metadata

<a id="gc-230-310"></a>

### 310 · Root web-app manifest

Block ID: **GC-230-310**. Development addition, constitution 11.63.

`GET <prefix>/app.webmanifest` calls the root Page's `manifest` method only if
its `installable` property is true. It returns a JSON object with
`application/manifest+json`; HEAD has the same status/headers and no body.
Other verbs return 405. A missing or disabled root returns 404. No page session
is created, and no RPC envelope or endpoint registration is involved. Treat the
result as public metadata. `page_manifest(prefix=...)` / `pageManifest({prefix})`
are the shared server operations; adapters only map HTTP requests and responses.
The root bootstrap adds the manifest link; child pages do not. An application
mounted at `/demo` uses `/demo/` for the default scope, id and start URL. Directory
exports materialize the same method as JSON with relative URLs. This resource
does not introduce a service worker, offline behavior or another RPC transport.


<a id="gc-230-315"></a>
### 315 · Device suitability metadata

Block ID: **GC-230-315**. Development addition, owner 2026-10-17.

Page.devices is a Python tuple / JS array of desktop, tablet and phone identifiers.
An empty default means undeclared. For a nonempty declaration, HTTP bootstrap
config includes a copied devices array. registerPage returns the same optional
field for Worker hosts; standalone startup forwards it into GramlotOptions.
The client freezes its own copy as gramlot.devices. This is informational metadata,
not a permission, redirect rule or responsive transformation. Transport hosts do
not interpret its contents.
