# Server protocol

Document ID: **GC-101**.

This page is for authors of server adapters. It states what a Gramlot server
exposes to the browser runtime: the bootstrap, the request and response envelopes,
the close message, the outcomes and, over HTTP, the URLs, methods and status codes.
Page authors do not need it: [Writing pages](095-writing-pages.md) and
[Calling the server](098-server-calls.md) describe the same behaviour from the page.

The core implements every rule that does not depend on the transport, in Python and
JavaScript (`GramlotServer`, `GramlotFileServer`, see
[Classes and server adapters](090-classes-and-hosts.md#gc-090-020)). An adapter adds
only what its transport needs. The conformance check of §150 verifies an adapter
over HTTP. The section numbers of this page are the rule numbers the conformance
check prints (§150).

## Part A · The contract

<a id="gc-101-005"></a>

### 005 · Scope and terms

Block ID: **GC-101-005**.

- The contract has one logical form. It is realised over HTTP (Part B), inside a
  Web Worker (Part C) and, for a server that offers it, over WebSocket (Part D).
- `GramlotServer` opens pages, keeps the page registry, builds the Source fragments
  and runs the endpoints. It has no transport. An adapter connects it to a transport
  and owns what the transport adds: URLs, bodies, status codes, cookies, headers,
  Worker messages.
- A **page** is a server page class (`Page`) opened for one browser tab. Opening it
  answers the **bootstrap** (§010).
- A **fragment** is a piece of Source built on the server. The whole page is the
  fragment `main`, mounted in the root element of the bootstrap. Every other
  fragment is mounted below a node of the Source in the browser.
- An **endpoint** is a server method the browser calls for a value.
- Every call names a **content type**, `source` for a fragment or `data` for a value
  (§015). Every message is an **envelope** (§020). The same envelope travels over
  HTTP, `postMessage` and WebSocket.
- The core gives every adapter the operations of this contract:
  `GramlotServer.decode_body`, `call`, `close`, `open_page` and `close_all` (JavaScript
  `decodeBody`, `call`, `close`, `openPage` or `registerPage`, `closeAll`) and, for a
  pages folder, `GramlotFileServer.companion_file` and `theme_file` (JavaScript
  `companionFile`, `themeFile`).
- The **server adapter** of a page is the browser object that holds the
  server-dependent behaviour, `gramlot.serverAdapter`, an instance of `ServerAdapter`
  (§045). The server chooses its class in the bootstrap (§010). The core consults it;
  page authors do not call it.

<a id="gc-101-010"></a>

### 010 · Page lifecycle and bootstrap

Block ID: **GC-101-010**.

- `open_page(path, *, owner=None, prefix="")` (JavaScript
  `openPage(path, {owner, prefix})`) registers the page with a `pageId` and an
  **owner** (§135) and returns the bootstrap: the page ID, the HTML document and its
  nonce.
- The HTML document has a `<title>` from `Page.title`, an import map that maps
  `@gramlot/gramlot/page` to the runtime URL, the root `div` (`gramlot-root` by
  default) and a module script that imports `PageBootstrap` and runs it with
  `{config, resources}`. The import map and the module script carry the same nonce.
- `config` is `{pageId, rpcUrl, closeUrl, rootId, capabilities, nameSyntax}`, plus
  `devices`, `locale` and `timeZone` when the page declares them. `rpcUrl` receives
  every request envelope and `closeUrl` the close message. `capabilities` lists the
  optional features the server offers (§040). `nameSyntax` is the syntax of a method
  name the server accepts (§015), written `{kind: "regex", pattern, flags}`.
- `resources` is `{css: [url], js: [{url, group}]}`, plus `collections` (the browser
  modules of the component collections) and `serverAdapter` when the server has them.
  `css` starts with the theme of the page: the base theme of the server (option
  `css_theme`, JavaScript `cssTheme`, default `gramlot-base`, `False`/`false` for
  none), unless the page sets its own `css_theme` (a theme name, or `False`/`false`
  for none). The CSS of `Page.css` and the companion stylesheet follow. Each URL
  appears once, in its last position.
- `serverAdapter` is the URL of a module whose default export is the
  `ServerAdapter` class of the page (`GramlotServer.server_adapter`, JavaScript
  `serverAdapter`; none by default). The module imports the core from
  `@gramlot/gramlot/page`, which the import map maps to the runtime already loaded.
  Without it the page uses the HTTP `ServerAdapter` of the runtime (§045).
- As on a static host, `<path>/index.html` opens the page `<path>/` and
  `/index.html` opens the index page.
- A page that does not exist raises `PageNotFound`. A full registry raises
  `ServerCapacity`.
- Every call names its `pageId`. A call for a page of another owner, or for an
  unknown or expired page, answers the outcome `page_expired` (§025). Page IDs are
  not login credentials.
- A page is closed by the close message (§020) or by `close_all()`/`closeAll()` when
  the adapter shuts down. A page expires `page_ttl` seconds (JavaScript `pageTtl`,
  default 1800) after it was opened; calls do not extend it, and a call after the
  expiry answers `page_expired`.
- `GramlotServer` creates a new `Page` instance for every call. The contract keeps
  no state between calls; a server may keep it as a capability (§040).

<a id="gc-101-015"></a>

### 015 · Content types and method names

Block ID: **GC-101-015**.

| `contentType` | The browser asks for | The page declares | The value | Mounted |
|---|---|---|---|---|
| `source` | a fragment: `main` or another | `main`; `@source` / `Page.registerSource` | the fragment document: the TYTX JSON text of the `GramlotBuilderBag` the method populated | in the root for `main`; below a Source node otherwise |
| `data` | a value | `@endpoint` / `Page.registerEndpoint` | one value as TYTX JSON: a scalar, a Bag or null; never code | in Data, at the path the caller names |

- A fragment method populates the root it receives and returns nothing. An endpoint
  returns its value.
- Inline code runs only when it arrives inside a fragment. A `GramlotBuilderBag`
  inside a `data` value is a value and activates nothing.
- `main` is reserved to the whole page: it cannot be declared as a fragment or an
  endpoint. A declared method name matches `^[A-Za-z][A-Za-z0-9_]*$` in both
  languages. The same method cannot be both a fragment and an endpoint.
- The `name` of a request follows the syntax the server declares,
  `GramlotServer.name_syntax` (JavaScript `nameSyntax`), a `NameSyntax`. It is a
  regex matched against the whole name, in the portable format of genro-builders
  (`{kind: "regex", pattern, flags}`): a construct that Python and JavaScript read
  differently (`\w`, `(?P<…>)`, inline flags, `IGNORECASE`) is refused when the
  syntax is created. The bootstrap carries it to the browser, where the `remote`
  helper and a name read from Data are checked before a request is sent. A name
  outside the syntax is not declared and answers `not_found`.
- The core default, `NAME_SYNTAX`, accepts a method of the page or a path
  `a.b.c.method` read from the page: segments of an ASCII letter followed by ASCII
  letters, digits and `_`, separated by `.`. Every segment before the last is a
  public attribute (its name does not start with `_`); a property getter runs when a
  request names it. The last segment is a method declared with the marker of the
  content type on the class of the object before it; its `auth` rule (§030) is the
  only authorization of the request. In JavaScript every object on the path is an
  instance of `Exposed`, so an inherited member such as `constructor` never leads to
  a method. A subclass of `GramlotServer` may declare a narrower syntax; a server
  whose syntax is not dotted resolves its names itself.
- Python methods receive `params` as keyword arguments. JavaScript methods receive
  them as one object. The protocol does not check parameter types.

<a id="gc-101-020"></a>

### 020 · The envelope

Block ID: **GC-101-020**.

```text
request:  {id, pageId, contentType, name, params}
response: {id, contentType, value}
          {id, contentType, error: {code, name, message}}
close:    {pageId}
```

- `id` is a string the browser generates. The response carries it back; over a
  transport without ordering (WebSocket) it pairs request and response. A Source node
  has one request in flight at a time.
- `pageId` is the page of §010.
- `contentType` is `source` or `data` (§015). The response repeats it.
- `name` is the fragment or endpoint name. `main` is the whole page.
- `params` is an object of named values, encoded as TYTX JSON; `{}` when there are
  none. `null`, an array or a scalar is a transport error (§120) and never reaches the
  page. A string value carrying a TYTX suffix (`"x::D"`) is decoded by TYTX, not
  passed through as text: endpoints must not rely on such strings.
- `value` is the fragment document or the endpoint value (§015).
- `error` is the outcome (§025). `name` and `message` are those of the exception.
  With `GRAMLOT_DEV=DEBUG` the core adds `details`, the traceback.
- Extra fields are allowed on both sides. The base runtime ignores them; an
  extension may read them.
- A message from the server without `id` is reserved to push (§040). The base
  runtime ignores it.
- The close message is `{pageId}` alone. The browser sends it without waiting for an
  answer; over HTTP it is a beacon on `pagehide` (§125).

<a id="gc-101-025"></a>

### 025 · Outcomes

Block ID: **GC-101-025**.

| `code` | Cause | Core class |
|---|---|---|
| `not_found` | the page declares no fragment or endpoint of that `contentType` and `name` | `SourceNotFound`, `EndpointNotFound` |
| `page_expired` | unknown, expired, closed or unowned `pageId` | `PageExpired` |
| `not_authenticated` | the target has an `auth` rule and the server knows no identity for the caller | `NotAuthenticated` |
| `not_authorized` | the target has an `auth` rule the caller's identity does not satisfy | `NotAuthorized` |
| `application_error` | the method raised; `name` and `message` are the exception's | any other exception, including a value TYTX cannot serialise |

An outcome is a normal response of the transport (HTTP 200). Status codes are for
transport failures only (§130). The class names are the API of `GramlotServer`; the
`code` is their form in the envelope.

<a id="gc-101-030"></a>

### 030 · `auth`

Block ID: **GC-101-030**.

- One attribute, `auth`, protects Source elements and endpoints. Its value is a rule
  over tags with `|`, `&` and `!`, the syntax of the genro-routes `AuthPlugin`.
- Endpoint: an unsatisfied rule answers `not_authenticated` or `not_authorized`;
  the method does not run.
- Element: when the server serialises a fragment, an element whose rule is refused
  is left out with all its children and never reaches the browser. An accepted
  element is sent without its `auth` attribute. The Source the method built is not
  changed. An `auth` value that is not a string answers `application_error`. A
  builder without an evaluator (the browser, authoring alone) keeps every element.
- The evaluator is a method of `GramlotServer`:
  `evaluate_auth(rule, *, owner, identity)`, JavaScript
  `evaluateAuth(rule, {owner, identity})`. It answers `None`/`null` to allow,
  `not_authenticated` or `not_authorized`; any other result answers
  `application_error`. Endpoints and elements go through the same check.
- `identity` is the identity the adapter passes with the call,
  `call(text, owner=…, identity=…)` (JavaScript `call(text, {owner, identity})`), for
  example the user of a login. The server keeps nothing of it between calls, so an
  adapter never stores a per-request identity on the shared server object.
- The base evaluator knows no identity: every rule answers `not_authenticated`. A
  server with an identity system overrides it and announces the `auth` capability
  (§040).
- `auth` protects what the server builds, not the page source. A JavaScript page
  module served to the browser for its `Logic` (§145) is readable. A page that runs
  in a Worker (Part C) runs in the browser, where `auth` protects nothing.

<a id="gc-101-035"></a>

### 035 · Declaring fragments and endpoints

Block ID: **GC-101-035**.

- Python: `@source` and `@endpoint`, bare or with `auth="rule"`, on methods of the
  `Page` subclass or of an object the page reaches (§015).
- JavaScript: `registerSource('name', {auth})` and
  `registerEndpoint('name', {auth})`, static methods of `Exposed` called after the
  class body; `Page` extends `Exposed`.
- `main` is the method `Page.main` in both languages.

<a id="gc-101-040"></a>

### 040 · Required and optional behaviour

Block ID: **GC-101-040**.

Every server, the Worker included, must:

- open a page and answer the bootstrap with `capabilities` and `nameSyntax` (§010);
- accept the envelope and answer the outcomes (§020, §025);
- read a request body as UTF-8, with a leading byte order mark removed (§120);
- build `main` and the declared fragments for `source` (§015);
- run the declared endpoints for `data` (§015);
- refuse every `auth` rule unless it evaluates identities (§030);
- close a page on the close message, and all pages on shutdown (§010);
- pass the conformance check of its transport (§150, §205).

A server may offer more, and then names the capability in `config.capabilities`. The
base server offers none.

| Capability | Meaning | Current adapters |
|---|---|---|
| `auth` | evaluates `auth` rules against an identity | the `kajenn` adapter of gramlot-py-server, with the tags of the avatar |
| `websocket` | the envelope over WebSocket (Part D) | none |
| `push` | messages without `id` from the server | none |
| `serverpath` | the browser sends the changes of the `serverpath` Data branches with each call, as an extra field | none |
| `state` | page state kept between calls | none |
| `grouplets` | catalogues of fragments | none |

The names without a current adapter are reserved for Genro, through genro-kajenn. The
base runtime only reads the list. A server may also reject a request body above a
size of its choice (§130) and read pages again in development (`GRAMLOT_DEV`).

<a id="gc-101-045"></a>

### 045 · Extension points

Block ID: **GC-101-045**.

The base library is extended without modification through:

1. the extra fields of the envelope (§020);
2. the server adapter of the page, `gramlot.serverAdapter`. The server names the
   module of its class in the bootstrap (`resources.serverAdapter`, §010) and
   `PageBootstrap` gives an instance to `Gramlot`. The core class, `ServerAdapter`,
   realises HTTP. Its method is `createTransport({rpcUrl, closeUrl, document})`,
   which returns the transport of `gramlot.rpc`;
3. the transport of `gramlot.rpc`. It has three required members:
   `call(text, signal)` sends a request envelope text and resolves with the
   response envelope text; `close(pageId, {beacon})` sends the close message;
   `dispose()` releases the transport. A page sends `close` and then `dispose` when it
   is disposed, and disposes itself on a `pagehide` that does not keep it in the
   back/forward cache (with a beacon over HTTP). `HttpTransport` holds no connection:
   its `dispose` releases nothing;
4. a synchronous call, optional for a transport. A transport that offers it declares
   `supportsCallSync` true and has `callSync(text)`, which returns the response
   envelope text and blocks the page until the answer arrives.
   `gramlot.rpc.callSync(contentType, name, params)` uses it, and a `dataRemote` with
   `sync` reads through it. On a transport without it, `callSync` throws and
   `dataRemote` reads asynchronously. `HttpTransport` sends it with a synchronous
   `XMLHttpRequest`, which the browsers deprecate on the main thread; a Worker or a
   WebSocket transport cannot;
5. the `auth` evaluator of `GramlotServer`, with the identity of the call (§030);
6. the name syntax of `GramlotServer` (§015).

## Part B · HTTP

The URLs are written without the mount prefix (§105).

<a id="gc-101-105"></a>

### 105 · Mount prefix

Block ID: **GC-101-105**.

- An adapter may serve Gramlot below a mount prefix, such as `/py`. Every URL of
  this part is then below the prefix. The adapter removes the prefix before
  dispatching and answers 404 to paths outside it.
- The prefix without its final slash answers **301** to the prefix with the slash,
  with the query string kept, because pages link each other with relative URLs.
- `open_page`/`openPage` adds the prefix once to the root-relative URLs of the
  bootstrap (`/…`, not `//…`). Relative and absolute URLs stay as written.
- The default bootstrap URLs are: runtime `/assets/gramlot.js`, rpc `/gramlot/rpc`,
  close `/gramlot/close`. They are options of `GramlotServer` (`runtime_url`,
  `rpc_url`, `close_url`; JavaScript `runtimeUrl`, `rpcUrl`, `closeUrl`).

<a id="gc-101-110"></a>

### 110 · Runtime URL

Block ID: **GC-101-110**.

- `GET` and `HEAD` of `/assets/gramlot.js` answer **200** with the media type
  `text/javascript`. Any other method answers **405**.
- The file is the one `runtime_asset()`/`runtimeAsset()` returns: the readable
  `gramlot.js` with `GRAMLOT_DEV=DEBUG`, the minified `gramlot.min.js` otherwise.
  The URL is the same for both.

<a id="gc-101-115"></a>

### 115 · Page request

Block ID: **GC-101-115**.

- `GET` of a page path answers **200** `text/html` with the bootstrap document of
  §010.
- The nonce is new at each opening: 16 random bytes in URL-safe base64.
- `PageNotFound` answers **404**. `ServerCapacity` answers **503**.
- Any method other than `GET` on a page path, `HEAD` included, answers **405** with
  an `Allow` header that lists `GET`.
- The adapter passes the path to `open_page`, which maps `<path>/index.html` to
  `<path>/` (§010).

<a id="gc-101-120"></a>

### 120 · RPC request

Block ID: **GC-101-120**.

- `/gramlot/rpc` accepts **POST** only (**405** otherwise), with
  `Content-Type: application/json` (**415** otherwise). The media type is compared
  without regard to case, surrounding whitespace and parameters such as `charset`.
  An absent or empty type, or a lookalike such as `application/jsonp`, is refused.
- The adapter reads the body with `decode_body(data)`/`decodeBody(data)`: UTF-8,
  with a leading byte order mark (EF BB BF) removed, as RFC 8259 §8.1 allows. The
  Gramlot runtime never sends the mark; a body saved by an editor may carry it.
  Bytes that are not UTF-8 raise `InvalidRequest`, and the adapter answers **400**
  without calling the server.
- The body is the request envelope of §020 as TYTX JSON text. `call` raises
  `InvalidRequest`, and the adapter answers **400**, when the text cannot be decoded,
  is not an object, has an `id`, `pageId`, `contentType` or `name` that is not a
  string, has a `contentType` other than `source` and `data`, or has `params` that is
  not an object.
- The adapter passes the `owner` of the request (§135) with every call and, when it
  has an identity system, the `identity` (§030).
- The response is **200** `application/json` with the response envelope of §020, for
  values and outcomes alike.

<a id="gc-101-125"></a>

### 125 · Close request

Block ID: **GC-101-125**.

- `/gramlot/close` accepts **POST** `application/json` with `{pageId}`, with the
  transport errors of §120 and the body read with `decode_body`. It answers **200**
  `application/json` `{"ok": true}`.
- The adapter passes the text to `close(text, owner=…)` (JavaScript
  `close(text, {owner})`), which removes the page when the requester owns it. A text
  that is not JSON, or whose `pageId` is not a string, raises `InvalidRequest`
  (**400**). An unknown or unowned `pageId` answers `{"ok": true}` and leaves every
  page open.
- The browser sends the close message as a beacon on `pagehide`. The adapter reads
  the body by its `Content-Length`, which a beacon sends.

<a id="gc-101-130"></a>

### 130 · Transport status codes

Block ID: **GC-101-130**.

| Status | Cause | Section |
|---|---|---|
| 301 | the mount prefix without its final slash | §105 |
| 400 | a body that is not a valid envelope or close message | §120, §125 |
| 404 | `PageNotFound` on a page request; a path outside the prefix | §115, §105 |
| 405 | a method the URL does not accept; on a page path with `Allow: GET` | §110, §115, §120, §125 |
| 413 | optional: a body above a size the adapter or the web server in front of it chooses; the protocol fixes no size | adapter |
| 415 | a body that is not `application/json` | §120, §125 |
| 503 | `ServerCapacity` on a page request | §115 |

Every other failure is an outcome inside a 200 response (§025).

<a id="gc-101-135"></a>

### 135 · Owner

Block ID: **GC-101-135**.

- `GramlotServer` registers each page with an owner and answers `page_expired` to
  every call of another owner; a close message of another owner leaves the page open.
  The core takes the owner with each operation (`open_page`, `call`, `close`); the
  way to recognise it belongs to the adapter.
- An adapter over HTTP must give each browser its own owner: a page opened by one
  browser is reachable from another only as `page_expired`. A null owner for every
  request is not allowed over HTTP. The Worker (Part C) keeps the null owner, because
  the page and the Worker live in the same browser.
- An adapter that recognises the owner by a cookie names it `gramlot_owner`, sets it
  on the page response with `Path=<prefix or />; HttpOnly; SameSite=Lax`, reuses the
  value the browser already sends and passes it as `owner` to every call. The value
  is random, for example 24 random bytes in URL-safe base64.
- An adapter may take the owner from its own identity system instead, with the same
  isolation between browsers.

<a id="gc-101-140"></a>

### 140 · Content Security Policy

Block ID: **GC-101-140**.

The policy belongs to the application. When an adapter is configured with one, it
sends it as the `Content-Security-Policy` header of each page response, with
`{nonce}` replaced by the nonce of that bootstrap, so the policy allows the two
bootstrap scripts (§115). The profiles are described in
[Classes and server adapters](090-classes-and-hosts.md#gc-090-035).

<a id="gc-101-145"></a>

### 145 · Themes and companion files

Block ID: **GC-101-145**.

- `GET` and `HEAD` of `/themes/<path>` answer the file of the core themes, with the
  media type of its extension. The file is `GramlotFileServer.theme_file(path)`
  (JavaScript `themeFile`), `None`/`null` when the core has no such file inside its
  themes folder. The adapter adds methods, media types and headers.
- `GET` and `HEAD` of a `.css` or `.js` URL answer the file whose real path is inside
  the pages folder: page modules, companions such as `foo.css` and `foo_aux.js`, and
  `Page.css` files placed there. Any other file of the folder is not served. The file
  is `GramlotFileServer.companion_file(path)` (JavaScript `companionFile`); a path with
  a NUL character names no file.
- A JavaScript page module whose `Logic` lives in the module itself is served to the
  browser, so its source, `auth` rules included, is readable; its `main` still runs
  on the server. A page whose logic is in `foo_aux.js` is not served. Python page
  modules are never served.
- Every root-relative URL of the bootstrap `resources` answers **200** with
  `text/css` (CSS) or `text/javascript` (JavaScript).

<a id="gc-101-150"></a>

### 150 · Conformance check

Block ID: **GC-101-150**.

`check_protocol(base_url, page_path)` (Python, `gramlot.server`) and
`checkProtocol(baseUrl, pagePath)` (JavaScript, `@gramlot/gramlot/server`) run the
list below, in this order, over HTTP against a running adapter. `base_url` includes
the mount prefix. `page_path` names a page of the adapter that declares the fragments
`check_fragment` and `check_fragment_auth` (an element with an `auth` rule) and the
endpoints `check_endpoint`, `check_endpoint_auth` (with an `auth` rule) and
`check_endpoint_raise`, as the conformance fixture pages of the core do. The first
failure raises `AssertionError` (Python) or rejects with the `AssertionError` of
`node:assert` (JavaScript). Its message starts with the identifier of the rule; the
last number of the identifier is the section of this page.

1. §105: with a prefix, `GET <prefix>` answers 301 to `<prefix>/`.
2. §115: `GET <page>` answers 200 `text/html` with the bootstrap module script; the
   import map carries its nonce; `config` has `rpcUrl`, `closeUrl` and a
   `capabilities` array. §010: `config.nameSyntax` is
   `{kind: "regex", pattern, flags}`.
3. §105: the bootstrap URLs are the defaults below the prefix.
4. §140: a `Content-Security-Policy` header, when present, contains
   `'nonce-<nonce>'`.
5. §135: a `gramlot_owner` cookie, when set, has `HttpOnly`, `SameSite=Lax` and the
   prefix path; later requests send it.
6. §110: `GET` of the runtime answers 200 `text/javascript`; `POST` answers 405.
7. §145: each root-relative bootstrap resource answers 200 with its media type.
8. §115: an unknown page answers 404; `POST`, `HEAD`, `PUT`, `DELETE` and `PATCH` of
   `<page>` answer 405 with an `Allow` header that lists `GET` and not the method;
   when `page_path` ends with `/`, `<page>index.html` answers the page.
9. §120 and §125: `rpc` answers 405 to `GET`; `rpc` and `close` answer 415 to
   `text/plain`, to JSON lookalike media types and to an empty media type, and 400 to
   invalid UTF-8 inside otherwise valid JSON. Mixed-case JSON media types and
   `charset` parameters are accepted. Invalid close requests leave the page usable.
   A body with a leading byte order mark is accepted: `rpc` answers the endpoint
   value, `close` answers `{"ok": true}`. `rpc` also answers 400 to invalid JSON, to a
   body without `pageId`, to `params: null`, to array `params` and to an unknown
   `contentType`.
10. §020: `source`/`main` answers 200 `application/json` with an envelope whose `id`
    and `contentType` repeat the request and whose `value` is a string.
11. §135: the same call without the cookies of the page answers `page_expired`; with
    an owner cookie, the call with another owner value answers `page_expired`; a
    close without the cookies of the page leaves the page usable.
12. §025: `main` of an unknown `pageId` answers `page_expired`; an unknown fragment
    and an unknown endpoint answer `not_found`; `{contentType: 'data', name: 'main'}`
    answers `not_found`; `constructor`, `constructor.prototype.check_endpoint` and
    (`source`) `constructor.prototype.check_fragment` answer `not_found`.
13. §015: `source`/`check_fragment` with `params` answers a fragment document;
    `data`/`check_endpoint` with `params` answers the value the fixture computes from
    them: `3`, `"x"` and a date, which comes back as the same typed value.
14. §030: `data`/`check_endpoint_auth` answers `not_authenticated` on an adapter
    without the `auth` capability; on an adapter with it, `not_authenticated`,
    `not_authorized` or a value.
15. §030: `source`/`check_fragment_auth` answers a fragment document; without the
    `auth` capability the document does not contain the element with the `auth` rule.
16. §025: `data`/`check_endpoint_raise` answers `application_error` with the
    exception `name`.
17. §125: `close` answers 200 `{"ok": true}`; `main` of the closed page then answers
    `page_expired`.

Not checked: the 503 of a full registry, `HEAD` of the runtime and of the files, and
the 413 of a server that chooses a size. Run the check against every adapter, with
and without a mount prefix and a Content Security Policy.

## Part C · Worker

<a id="gc-101-205"></a>

### 205 · Messages

Block ID: **GC-101-205**.

The serverless package `@gramlot/gramlot-serverless` of gramlot-js-server realises
the contract inside a dedicated Web Worker, one per tab. The Worker runs
`GramlotWorkerServer`, a `GramlotServer`; the window side is `WorkerTransport`. Every
message goes through `postMessage`.

- Open: the window sends `{id, open: true}` and receives `{id, open}`, where `open`
  holds the bootstrap data of §010 returned by `registerPage`, with
  `capabilities: []` and `nameSyntax`.
- Calls: the window sends `{id, text}`, where `text` is the request envelope of §020,
  and receives `{id, text}` with the response envelope.
- A failed open, or an `InvalidRequest`, answers `{id, error: {name, message}}`.
- Close: the close message `{pageId}`, without `id`.
- The transport errors of §120 do not exist: the window is the only sender.
- `WorkerTransport` has no synchronous call (§045): a `dataRemote` with `sync`
  reads asynchronously.
- The owner is null; the owner check stays and always matches. `auth` protects
  nothing: the page runs in the browser (§030).
- The serverless package runs the envelope part of the conformance list (items 10
  and 12–16 of §150) over `postMessage`.

## Part D · WebSocket

<a id="gc-101-305"></a>

### 305 · Messages

Block ID: **GC-101-305**.

A server with the `websocket` capability accepts each request envelope as one text
message and answers each with its response envelope. Responses may arrive in any
order; `id` pairs them. A message without `id` from the server is a push (`push`
capability). The close message is `{pageId}` without `id`; closing the socket also
closes the page. No current adapter offers this capability, and the base runtime has
no WebSocket transport.

## Part E · Application metadata

<a id="gc-101-310"></a>

### 310 · Root web-app manifest

Block ID: **GC-101-310**.

`GET <prefix>/app.webmanifest` answers the result of the root page's `manifest`
method, only when its `installable` property is true, as a JSON object with the media
type `application/manifest+json`. `HEAD` has the same status and headers and no body.
Other methods answer 405. A missing or not installable root answers 404. No page is
registered, and no envelope or endpoint is involved. The result is public metadata.
`page_manifest(prefix=...)`/`pageManifest({prefix})` are the server operations; the
adapter maps HTTP requests and responses. The bootstrap of the root page adds the
manifest link; other pages do not. An application mounted at `/demo` uses `/demo/`
for the default scope, id and start URL. The page side is described in
[Writing pages](095-writing-pages.md#gc-095-110).

<a id="gc-101-315"></a>

### 315 · Device suitability

Block ID: **GC-101-315**.

`Page.devices` is a Python tuple or a JavaScript array of `desktop`, `tablet` and
`phone`. An empty value declares nothing. A non-empty value reaches the browser as a
copy in `config.devices` (HTTP) or in the result of `registerPage` (Worker), and the
runtime exposes it frozen as `gramlot.devices`. It is information only: not a
permission, a redirect rule or a layout change. Adapters do not interpret it.
