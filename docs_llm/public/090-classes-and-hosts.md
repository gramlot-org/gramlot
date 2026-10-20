# Classes, repository and server adapters

Document ID: **GC-090**.

<a id="gc-090-005"></a>

## 005 · How to use this reference

Map of the core: folders, classes, server boundary, packages. Published on PyPI (`gramlot`), npm and JSR
(`@gramlot/gramlot`); adapters are tested in their own repositories. Protocol for adapter authors:
[Server protocol](101-server-protocol.md). Richer PoC behavior is not core evidence.

<a id="gc-090-010"></a>

## 010 · A small repository

`src/gramlot`: page/ (Page, IndexPage, builder, Source), server/ (GramlotServer, GramlotFileServer,
resources, conformance), renderer/ (static HTML/SVG), db/ (reserved), collections/ (exported grammars),
resources/ (runtime bundles, themes, branding). `js/src`: server/ (JS server contracts, file page loading,
conformance), builder/ (dialect, GramlotBuilderBag/node), binding/, components/, handlers/ (src, rpc, dom,
utl), renderer/, view/, date-parser/, bootstrap.js, http-transport.js, server-adapter.js. `js/tools`: built
inspector; `themes/`; `tools/`: inspector source. `tests`/`js/tests`: contracts and fixtures. `docs/public`:
manual; `docs/internal`: working decisions; `docs_llm`: concise mirrors; `ports`: bounded reviews. Generic
Bag/builders live separately; `build` is generated output. No component inventory implied. Example pages and
gallery: separate package `gramlot-examples`.

<a id="gc-090-015"></a>

## 015 · Classes you work with

JavaScript pages must extend `Page` in hosted and standalone execution.
`Page.css` is a list of stylesheet URLs for every server. Standalone loads them before starting
the Page and releases its stylesheet links on disposal. Python and JS pages also declare
`css_requires`/`js_requires` name strings, interpreted only by a `GramlotServer` with a
resource system; `GramlotFileServer` and the current adapters have none and raise an error for any
name. The resource system comes with genro-kajenn, part of Genro, the framework that succeeds
GenroPy (built on Kajenn, Gramlot and Asqueel) (030).

Rendering requires `SourceBag` and `SourceBagNode`, associated with their builder.
Their methods are part of the contract. Plain Bags are valid for Data, not Source;
`attr.tag` is not an alternative to `nodeTag`. Invalid Source is rejected, not converted.

| API | Responsibility |
| --- | --- |
| Python `Page` | Metadata, `main(root)`, exposed Source methods and endpoints |
| Python `GramlotServer` | Page resolution, IDs, bootstrap, every envelope through `call` |
| Python/JS `GramlotBuilder` | Gramlot dialect over Python `BuilderBase` / JS `HtmlBuilder` with loaded collections |
| JS `Gramlot` | Lifecycle and Data; proxies `src` (`SourceHandler`), `rpc` (`RpcHandler`), `dom` (`DomHandler`), `utl` (`UtilitiesHandler`) hold the themed members |
| JS `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Extend Builder `HtmlRenderer`/`SvgRenderer`, inherit their attribute/style adaptation; string rendering. `GramlotRenderer` extends `GramlotHtmlRenderer` and keeps live DOM and references |
| Python `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Static HTML/SVG rendering of a Gramlot Source, same rules as JS; number node text differs ([static rendering](095-writing-pages.md#gc-095-125)) |
| JS `HttpTransport` | Envelope to `rpcUrl`, close message to `closeUrl` (transport of `gramlot.rpc`); `dispose` releases nothing; `supportsCallSync` true, `callSync` = synchronous `XMLHttpRequest` |
| JS `ServerAdapter` | `gramlot.serverAdapter`, server-dependent behaviour consulted by the core (not a proxy): `createTransport({rpcUrl, closeUrl, document})`; core class = HTTP; a server names a subclass module in `resources.serverAdapter` |
| `NameSyntax` (Python/JS) | Method-name syntax declared by the server (`name_syntax`/`nameSyntax`): portable genro-builders regex `{kind: "regex", pattern, flags}`, `matches(name)` whole; default `NAME_SYNTAX` |
| JS `GramlotServer`/`Page`/`GramlotFileServer` | Node/Bun server boundary and file loading |

Dependency libraries own SourceBag, typed serialization and generic grammar/rendering. Pages
author Source, never DOM. Bindings/controllers: [Data binding and controllers](097-data-binding.md);
endpoint-backed `dataRemote`: [Remote content and lazy Data](099-remote-content.md); no other
resolver families. `gramlot.dom` holds `getBaseSourceNode`/`getDomNode`; per-instance logic groups in
`app.logic` ([named logic](097-data-binding.md#gc-095-060)). Browser Source uses `GramlotBuilderBag`/
`GramlotBuilderBagNode` (extend `SourceBag`/`SourceBagNode`) for `PUT`, `FIRE`,
`FIRE_AFTER` and variable datapath; Builder/Bag unmodified. Python has same-named classes in `src/gramlot/page/source.py` for authoring and the wire (`__cls`), without runtime methods.
Other binding classes stay internal.

<a id="gc-090-017"></a>

## 017 · Python and JavaScript server boundaries

`GramlotServer`/`GramlotFileServer`, Python and JS: same functionality, not an
identical member-by-member API. Both create a fresh Page (and a builder for a fragment)
for each call; module loading is a separate lifecycle.

| Aspect | Python | JavaScript |
| --- | --- | --- |
| Named parameters | Keyword arguments: `details(root, name=...)`, `total(price=...)` | One object: `details(root, {name})`, `total({price})` |
| Omitted parameters | Empty dictionary | Empty object |
| `params` not an object (`null` included) | `InvalidRequest` from `call` | `InvalidRequest` from `call` |
| Exposed Source method | `@source` | `registerSource('details')` on the `Page` subclass |
| Endpoint | `@endpoint`, `@endpoint(auth=...)` | `registerEndpoint('total', {auth})` on the `Page` subclass |
| Object reached by a method path (`orders.total`, [method name](099-remote-content.md#gc-095-105)) | Any object; `@source`/`@endpoint` | Instance of a class extending `Exposed`, `registerSource`/`registerEndpoint` |
| Unknown endpoint | `EndpointNotFound` | `EndpointNotFound` |
| Unknown or unexposed Source method | `SourceNotFound` | `SourceNotFound` |
| Base `Page` class as a page | Rejected | Rejected |
| Empty the page registry | `close_all()` | `closeAll()` |
| Body → text (UTF-8, leading BOM removed) | `decode_body(data)`, else `InvalidRequest` | `decodeBody(data)`, else `InvalidRequest` |
| Close message `{"pageId"}` | `close(text, *, owner=None)`, else `InvalidRequest` | `close(text, {owner})`, same |
| Identity of one call | `call(text, *, owner, identity)` → `evaluate_auth(rule, *, owner, identity)` | `call(text, {owner, identity})` → `evaluateAuth(rule, {owner, identity})` |
| Name syntax / browser adapter module | `name_syntax` (`NAME_SYNTAX`) / `server_adapter` (`None`) | `nameSyntax` / `serverAdapter` (`null`) |
| Base theme | `css_theme="gramlot-base"`, `False` none, else `ValueError` | `{cssTheme}`, `false` none, else `TypeError` |
| Page theme | `css_theme`: `None` (base), a name, `False`; else `InvalidResourceName` | `static css_theme`: same |
| `<path>/index.html` | `open_page` → `<path>/` | `openPage`/`registerPage` → `<path>/` |
| [Server protocol §145](101-server-protocol.md#gc-101-145) `/themes/` file | `GramlotServer.theme_file(path)` → path or `None` | `themeFile` → path or `null` (npm themes); Node.js/Bun only |
| §145 `.css`/`.js` file below the pages folder | `GramlotFileServer.companion_file(path)` → path or `None` | `companionFile` → path or `null` |
| `page_ttl`/`pageTtl` not finite positive, `max_pages`/`maxPages` not a positive integer | `ValueError` | `TypeError` |
| Root manifest not a JSON object (NaN, infinity, non-JSON value, cycle) | `TypeError` | `TypeError` |
| Page registration by `open_page`/`openPage` | Before the bootstrap; removed if it fails | Same |
| Module loading, no reload | Executed once per real path, cached | Imported once per real path, ESM import cache |
| Module loading, reload | Executed again at each opening | Imported again when its modification time changes |

`GramlotFileServer(pages_dir, reload=None)`/`new GramlotFileServer(pagesDir, {reload: null})`:
`None`/`null` takes reload from `GRAMLOT_DEV` (true for `YES`/`DEBUG`, false when unset);
an explicit boolean wins. Adapters call `close_all()`/`closeAll()` on shutdown. JS error
classes set `name` to their class name. `registerPage` is JS-only (serverless Worker).

Valid named parameters produce the same Source result in the bounded comparison.
The error classes and the `params` rule are the same in both languages; the parameter form and the module loading are language conventions,
not a promise of cross-language interchangeability. Module caching does not reuse Page instances
between Source requests. Custom page resolution belongs to the server integration;
the filesystem comparison above does not describe the bundled Worker loader of `@gramlot/gramlot-serverless`.


<a id="gc-090-020"></a>

## 020 · What a server adapter connects

Python routes bootstrap to `open_page(path, owner=...)` (maps `<path>/index.html`),
`POST rpc_url` (`/gramlot/rpc`) to `call(decode_body(body), owner=..., identity=...)`
(200 with its text; 400 on `InvalidRequest`) and `POST close_url` (`/gramlot/close`) to
`close(decode_body(body), owner=...)`; it serves `runtime_url`, `theme_file`,
`companion_file` and gives each browser its own owner ([Server protocol §135](101-server-protocol.md#gc-101-135)).
Shared rules are core; the adapter adds only HTTP (routes, methods, status, headers, cookies, media
types).
`call(text, *, owner=None, identity=None)`/`call(text, {owner, identity})`: TYTX request envelope
`{id, pageId, contentType, name, params}` → TYTX response envelope; `source` =
fragment (`main` = whole page), `data` = endpoint; failures other than
`InvalidRequest` are outcomes in the response (`not_found`, `page_expired`,
`not_authenticated`, `not_authorized`, `application_error`), status codes only for
transport. `PageExpired` means expired, unknown or unowned ID. `capabilities` → the
bootstrap (none in the base server). `evaluate_auth(rule, *, owner, identity)`/
`evaluateAuth(rule, {owner, identity})` (`identity` passed with that call; nothing kept
between calls) → null (allow), `not_authenticated` or
`not_authorized`; base server: any rule → `not_authenticated`; a server with
identity overrides it and announces `auth`. `GramlotServer` starts no HTTP server and searches no files: its bounded
registry is process-local and IDs are not credentials. A concrete server implements
`resolve_page(path)`/`resolvePage(path)` → Page class and
`resolve_resources(path, cls)`/`resolveResources(path, PageClass)` →
`{css: [url], js: [{url, group}]}` in load order, without prefix; the neutral `GramlotServer`
raises `PageNotFound` for both and searches no application file (only the core themes, `theme_file`). Each module exports `Page`. Every call creates a fresh
page (and builder for a fragment).
Reference `GramlotFileServer(pages_dir)`/`new GramlotFileServer(pagesDir)`, Python and JS,
the pages folder plus optional `reload` (017): `/` → `index.py`/`index.js`; `a/b` → file page
`a/b.py` first, then folder page `a/b/b.py`; both present → the file wins (030).
`open_page(path, *, owner=None, prefix="")`/`openPage(path, {owner, prefix})` →
`Bootstrap(page_id, html, nonce)`/`{pageId, html, nonce}`. The adapter's mount
prefix is added once, only to root-relative URLs (`/…`, not `//…`): stylesheet and JS
module URLs, runtime, rpc, close; relative and absolute URLs stay as written.
The nonce is new at each opening, distinct from the page ID, on the bootstrap script.
The HTML holds one module script
`import {PageBootstrap} from <runtime>; await new PageBootstrap({config, resources}).run();`;
`config` = `{pageId, rpcUrl, closeUrl, rootId, capabilities, nameSyntax}`, `resources` =
`{css: [url], js: [{url, group}]}` (+ `collections`, `serverAdapter` when present); both `GramlotServer` classes write the same compact JSON. No `<link>`
in the HTML: `PageBootstrap` writes the CSS links in the browser (030).

JS `GramlotServer` exposes `openPage`, `decodeBody`, `call`, `close`, `closePage` and `closeAll`; adapters own HTTP
translation and the owner of each request and call `close_all()`/`closeAll()` on shutdown. `GramlotFileServer` loads JS
pages and their same-name files. Node/Bun bridges are in `gramlot-js-server`; the Python
adapters (ASGI/Uvicorn, Django, Flask, FastAPI, Kajenn) are modules of `gramlot-py-server`.
Each adapter repository states the versions it verifies. The browser protocol of every adapter
(URLs, payloads, status codes) is stated in [Server protocol](101-server-protocol.md); any adapter
can run the conformance check `check_protocol(base_url, page_path)` (Python, `gramlot.server`) /
`checkProtocol(baseUrl, pagePath)` (JS, `@gramlot/gramlot/server`) against itself.
The five adapters of `gramlot-py-server` and the packages of `gramlot-js-server` implement the protocol. Each passes the mount prefix to `open_page` and serves the companions (030); the server adapters send the configured CSP header (035); the standalone export writes a hash policy (025).

A page with a transport closes its server page at dispose (`close`, then `dispose` of
the transport); over HTTP explicit disposal sends a best-effort close request,
non-persisted `pagehide` disposes with a JSON beacon, back/forward-cache pages stay active. Adapters supply
the owner, `GramlotServer` checks it, and a page no call has used for `page_ttl` seconds expires, which removes a page whose close never arrives. Worker disposal
remains local.

Next: [Writing pages](095-writing-pages.md).


The generic `genro-builders-js` owns authoring and static HTML/SVG rendering.
Gramlot owns its live renderer.
`gramlot.src.startSource(wire)` can mount an already-authored typed Source through the
same renderer; it does not execute a Page. Standalone Page execution uses the Worker
host described below, not a build-time compiler.

Servers obtain browser code from packaged assets (`runtime_asset()` in `gramlot.server`;
`runtimeAsset()` from `@gramlot/gramlot/server` and `@gramlot/gramlot/runtime` in JS, from npm, JSR or the repository's `js/`). See the
installation contexts below; adapters serve the assets of their installed package.
The build writes `gramlot.js` (readable) and `gramlot.min.js` (minified); the runtime URL
(default `/assets/gramlot.js`) serves `gramlot.js` when `GRAMLOT_DEV=DEBUG`, `gramlot.min.js`
otherwise (`runtime_asset()`/`runtimeAsset()` return the file; `runtimeAsset()` returns a `URL`: `file:` from npm, read with `fs.readFile`; `https:` from JSR, read with `fetch`).
`GRAMLOT_DEV`, read by `gramlot_dev()`/`gramlotDev()`: unset = deploy; `YES` = development,
pages read again (017); `DEBUG` = development with the readable runtime; any other value
raises (`ValueError` Python, `TypeError` JS).
`PageNotFound`, `SourceNotFound`, `PageExpired` and `ServerCapacity`, in Python and JS, distinguish
framework failures from unexpected application exceptions. Dependencies install from the
registries each package declares (PyPI, npm, JSR).


<a id="gc-090-022"></a>

## 022 · Published package name

Core: `@gramlot/gramlot` on npm (`npm install @gramlot/gramlot`) and JSR (`npx jsr add @gramlot/gramlot`);
imports use that name (`import {Page as BasePage} from '@gramlot/gramlot/page';`). Core test fixtures
(`js/tests/fixtures`) use the same name (self-reference in `js/`). `@genro/gramlot` on JSR: earlier,
archived name; never mix it with `@gramlot/gramlot` in one application. JSR CLI and npm compatibility:
[JSR documentation](https://jsr.io/docs/npm-compatibility). `@gramlot/gramlot-serverless` (in
`gramlot-js-server`) owns standalone startup and Worker integration (025); use matching versions.


<a id="gc-090-023"></a>

## 023 · Theme and logo files in the packages

npm, PyPI and JSR carry the same files: `themes/` (complete `gramlot-base`; overlays `gramlot-compact`,
`mimi`, `joanna`; `gramlot-index` for the index page); of `assets/branding/`, `gramlot-logo.svg`,
`gramlot-logo-dark.svg`, `gramlot-mark.png`, `gramlot-mark-dark.png`, `app-icon.png` and the 24 SVG of
`svg/`. Paths: npm `@gramlot/gramlot/themes/…`, `@gramlot/gramlot/assets/branding/…` (exports `./themes/*`,
`./assets/branding/*`, e.g. `import.meta.resolve(...)`); wheel `files("gramlot") / "resources" / "themes" / …`
and `… / "resources" / "assets" / "branding" / …`; JSR `themes/…`, `assets/branding/…`. Sources at the
repository root; `js/scripts/build-runtime.mjs` copies them into the npm package and the wheel. The rest of
the identity kit is not packaged.


<a id="gc-090-024"></a>

## 024 · Entry points of the JavaScript package

npm and JSR (`./themes/*`, `./assets/branding/*` npm only; JSR carries the files):

| Entry point | For | Public surface |
| --- | --- | --- |
| `@gramlot/gramlot` | Browser runtime and JS authoring | `Gramlot` and proxies (`SourceHandler`, `RpcHandler`, `DomHandler`, `UtilitiesHandler`, `Handler`), `PageBootstrap`, `Page`, `Exposed`, `GramlotBuilder`, `GramlotRenderer`, `GramlotHtmlRenderer`, `GramlotSvgRenderer`, `Bag`, `BagNode`, `createDecimal`, `References`, `HttpTransport`, `ServerAdapter`, `RpcError`, `InOut`, `IndexPage`, `IndexLogic`, `mountIndexPage`, `parseDateExpression` |
| `/page` | Page modules, server and browser | `Page`, `Exposed`, `IndexPage`, `IndexLogic`, `mountIndexPage`, `ServerAdapter`, typed literals `Bag`, `BagNode`, `createDecimal`; the import map points it at the loaded runtime, which exports the same names |
| `/server` | Servers and adapters, not the browser | `GramlotServer`, `GramlotFileServer`, `GramlotBuilder`, `Page`, `Exposed`, error classes, `gramlotDev`, `runtimeAsset`, `checkProtocol`, `InvalidResourceName`, `parseRequires`, `NAME_SYNTAX`, `NameSyntax` |
| `/gramlot-server` | `GramlotServer` without file access (serverless Worker) | `GramlotServer`, error classes |
| `/runtime` | Bundled runtime served at the runtime URL | One ES module, exports of `@gramlot/gramlot` |
| `/components` | Component authoring ([Components](105-components.md#gc-105-025)) | `defineComponent`, `defineCollection`, `ComponentCollection`, `NativeControl`, `ChoiceGroup`, `Labelbox`, `FieldState` |
| `/components/inputs`, `/components/layout` | Collections ([Components](105-components.md#gc-105-035)) | Default export; `toDocument()` = grammar |
| `/index-page-runtime` | `IndexPage` browser behavior alone ([Writing pages](095-writing-pages.md#gc-095-110)) | `IndexLogic` (export as `Logic`), `mountIndexPage(renderer, root, onSelection, prepareEntry, options)` → `{dispose()}`, `THEME_READY`/`THEME_SET` (theme message types index ↔ iframes), `THEMES` (`light`, `dark`), `APPEARANCES` (`base`, `compact`, `mimi`, `joanna`) |
| `/tools/inspector` | Optional inspector palette: Data/Source trees, styles, property editor, path breakpoints | Defines `gramlot-tools-inspector` (`GramlotToolsInspector`); `InspectorConnection`, `attachInspectorAgent` |
| `/tools/inspector-agent` | Page side of an inspector connection, no runtime or palette | `attachInspectorAgent(gramlot, port)` → `{dispose()}` |

Typed literals: the server runs `main` of a page module and the browser imports it for its `Logic`; the import
map there resolves only `@gramlot/gramlot/page`, so that name exports what a module needs to author typed
values: `Bag`, `BagNode`, `createDecimal` (exact Decimal). A date or time is a `Date` (no import). Server entry
and runtime export the same names: one page module loads in both. A Python page imports `decimal.Decimal`,
`datetime`, `genro_bag.Bag` ([Data binding](097-data-binding.md#gc-095-045)).

The runtime never imports the inspector. Same window: map `@gramlot/gramlot` to the page's runtime URL,
`import '@gramlot/gramlot/tools/inspector'`, declare `<gramlot-tools-inspector id="inspector">`, set
`.gramlot = window.gramlot` (live `Gramlot` or `null`, else `TypeError`; no discovery). Other window/frame:
`attachInspectorAgent(gramlot, port)` in the page on one `MessageChannel` end, `new InspectorConnection(port)`
beside the inspector; `targets` = unique `{id, title, connection}`, `selectedTarget` picks one. `embedded`
(before connect) = panel without palette controls; `docked` = fill parent height; closing removes the element
and emits `close`. Breakpoint conditions compile in the inspected page under its CSP.


<a id="gc-090-025"></a>

## 025 · JavaScript standalone host

A dedicated browser Worker hosts one JavaScript Page. `GramlotWorkerServer` inherits `GramlotServer`
and reuses its page registration, `main`, marked Source methods, typed serialization, fresh instance per
call, expiry and error rules; no standalone Page compiler; Python pages run on Python servers only.
Shared pages import `{Page}` from `@gramlot/gramlot/page`. Fragments and endpoints:
[Calling the server](098-server-calls.md#gc-095-100), [Remote content](099-remote-content.md#gc-095-105);
from code `gramlot.src.remoteSource(target, method, params)`.

Worker entry (serverless host configuration, core entry `@gramlot/gramlot/gramlot-server`):
`import {GramlotWorkerServer} from '@gramlot/gramlot-serverless/gramlot-worker-server'; new GramlotWorkerServer(Page);`,
bundled as a classic Worker script, started with `await mount({workerUrl})` from
`@gramlot/gramlot-serverless/standalone`. The document holds `gramlot-root` or pass `element`. `mount` opens
the Page, prepares roots/subscriptions, requests `main`. `mount({workerUrl, assetRoot})`: absolute
file/HTTP/HTTPS directory URL ending in `/`; CSS URLs then root-relative, resolved inside the export; the
exporter supplies the URL and does not rewrite `Page.css`. `app.dispose()` terminates the Worker and rejects
outstanding requests; optional `signal` cancels startup; a cancelled remote request drops its reply.

Scope: one Page per Worker, HTML Source, live Source, declared `Page.css`, no database. Binding runs in the
window, the Worker builds Source; no Node-only imports. `css_requires`/`js_requires` need a resource system
(030); the `GramlotWorkerServer` compiles no code and never runs the page logic.

Export shape: one HTML file. Worker script = Page + `GramlotWorkerServer`, no inline compiler
(`binding/inline.js` absent). Page logic (`Logic` of the page module, else `foo_aux.js`) = separate window-only
bundle through a blob URL, resource order kept. CSP hash profile: `script-src` sha256 of the final script
bytes, `'unsafe-eval'`, `blob:`, no `'unsafe-inline'` (one added byte is blocked); `'unsafe-eval'` lets the
window compile inline code of the received Source (035); `connect-src *` until a page can declare its own
policy. Only profile of the export.

`@gramlot/gramlot-serverless` (`gramlot-js-server`) is the Node/npm exporter: bundles the Page without running
it, generates the HTML through HtmlBuilder, also exports a static directory (one Worker per document); assets
included by the exporter at their declared paths; the exported gallery opens through `file://` (Blob Workers,
explicit export root). Its repository documents commands and requirements; first-party dependencies unpinned.
ASGI hosting (Uvicorn or any ASGI server): `uvicorn` adapter of `gramlot-py-server`; Kajenn: its `kajenn` adapter.


<a id="gc-090-030"></a>

## 030 · Page resources and file layout

`Page.css`: list of URLs as in `<link href>`, in the core for every server. `/…` gets
the mount prefix once; `theme.css`, `https://…`, `//…` stay as written.
Theme: before `Page.css` every page loads the base theme of the server
(`css_theme="gramlot-base"`/`{cssTheme}`, `False`/`false` none) unless the page sets
`css_theme` (a name, or `False` for none); URL `/themes/<name>/theme.css`. `Page.css` =
additional CSS (overlays such as Compact, application CSS); a listed base theme loads once.

Page files: `GramlotFileServer` serves one pages folder. Path `orders` → file page
`orders.py` (`orders.js` for JS) first, then folder page `orders/orders.py`; both →
the file wins, no error. Segments: letters, digits, `_`, `-`. A real path leaving
the pages folder is rejected. Same-name files beside the file page or in its
folder: `orders.css` (stylesheet), `orders_aux.js` (auxiliary JS module exporting
`Logic`), `orders.md` (README). `_aux` is reserved: `orders_aux.js` is never a page,
no page is `*_aux`. Python and JS pages may share a folder: `orders.js` is the JS page
and the logic of `orders.py`.

Page logic, group null: JS page → the page module's `Logic` export, else
`orders_aux.js`; Python page → `orders.js` beside `orders.py` (its `Logic`; its `Page`
unused), else `orders_aux.js`. Python cannot read JS exports: it sends `orders.js`;
without `Logic` it gives no methods. `Logic` only when the page has methods; a missing
method is reported by the `func` that names it. Both modules
→ error (`Error`/`ValueError`) before registration. The browser imports the page
module, so its imports must resolve there; a JS `Page` with server-only imports keeps
`orders_aux.js`.

Load order: the theme, `Page.css` as written, then `orders.css` and the page logic. A repeated
URL loads once, in its last position. One JS URL with two different groups = error.

Resource fields: Python `css_requires = ""`/`js_requires = ""`; JS
`static css_requires = ''`/`static js_requires = ''`. Names are interpreted by a
`GramlotServer` with a resource system (genro-kajenn, part of Genro, the framework that succeeds GenroPy,
built on Kajenn, Gramlot and Asqueel); `GramlotFileServer` and the current adapters have none: any name raises
`InvalidResourceName` ("requires need a GramlotServer with a resource system"). Core parser,
same in both languages: empty/missing = none; `,` separator, spaces ignored; empty
tokens and duplicates ignored (first position kept); `/` separates subfolders,
segments `^[A-Za-z0-9_-]+$`, no `.`, `..`, leading/trailing `/` or extensions; `:`
(`name:media`) = error.

The page logic module is public (served to the browser); server-only logic lives in
modules it does not import.

Companion rule of the adapters (`GramlotFileServer.companion_file`/`companionFile`): GET/HEAD answer only `.css`
and `.js` files whose real path is inside the pages folder (page modules and their
relative imports); other files 404, other
methods 405. `Page.css` URLs outside the pages folder stay application assets.

Import map: before the bootstrap script, `<script type="importmap">` with the
bootstrap nonce maps `@gramlot/gramlot/page` → runtime URL (mount prefix); the runtime
exports `Page` and the typed literals of section 024; one runtime instance; no new CSP source.

Bootstrap (`PageBootstrap`, in the browser): 0 import the server adapter module of
`resources.serverAdapter`, if any (else the HTTP `ServerAdapter`); 1 write the CSS links in load order;
2 import all JS modules (relative URLs against the document); 3 check every `Logic`
(explicit constructor, accessor, symbol key, extended class, group names `page` and
`constructor` are errors) before creating anything; 4 create `Gramlot` (server adapter, `nameSyntax`), register each
`Logic` in received order, set `window.gramlot`; 5 start. A failed import or `Logic`
check names the resource, keeps the CSS links, closes the server page and mounts
nothing. Page close before start: no `Gramlot`, close beacon sent. The bootstrap module script
carries a nonce separate from the page ID, placed by the adapter in the CSP header;
standalone uses a hash (025).

<a id="gc-090-035"></a>

## 035 · Content Security Policy profiles

The application chooses the CSP; Gramlot defines two profiles and never sets the
header. The adapter writes it with the opening's nonce through a `{nonce}` placeholder:
`content_security_policy` in the adapters of `gramlot-py-server`, `contentSecurityPolicy` in
`gramlot-js-server`; HTML responses only.

| Profile | `script-src` | Runs |
| --- | --- | --- |
| Strict | `'nonce-{nonce}'`, plus `object-src 'none'; base-uri 'none'` | Named logic only (companion and `js_requires` methods) |
| Permissive | strict plus `'unsafe-eval'` | Named logic and inline code (`formula`, `script`, `==`, `action`, `connect_on<event>`, `_if`/`_else`) |

Under strict, inline code fails with an `EvalError`: `<tag> '<label>' '<attribute>':
inline code blocked by the Content Security Policy of the page (no 'unsafe-eval'); move
the code to named logic (a method of the page companion _aux.js) or serve the page with
the permissive CSP profile, which allows 'unsafe-eval'`; for inline code in the node
value the prefix is `<tag> '<label>' node value`; browser error kept as `cause`;
nothing is written. One bootstrap module script carries the nonce and imports the runtime; a script without the nonce is blocked. The standalone export has its
own hash profile (025).

Inline code runs only as received with the Source. `gramlot.src.prepareSource` activates
the inline code of the received Source (`main` from the server, a remote Source, a
`GramlotBuilderBag` given to `startSource`): each `GramlotBuilderBagNode` keeps the text
of its code attributes (`formula` of `dataFormula`, `script` of `dataController`,
`_if`/`_else`, `action` of `button`, `connect_on<event>`, `==` attributes and node
value); the compiler runs only that text. A text written later (attribute changed by
page code, node inserted in the live Source, `GramlotBuilderBag` arrived in Data or RPC)
is never run: `<tag> '<label>' '<attribute>': inline code runs only as received with the
Source (main or a remote Source); a text written later is not run: use named logic`.
Not in the TYTX decoding, because a `GramlotBuilderBag` can arrive inside a Data Bag; a
Data Bag is never compiled. A code attribute holding a `^`/`=` pointer is an error at
reception, before any effect: `<tag> '<label>': '<attribute>' is inline code and cannot
be the pointer '<pointer>'; inline code is never read from Data`. Python runs no inline
code; its Source carries plain strings, activated by the page on reception.

Attributes the browser runs: the Python and JS renderers refuse, written or resolved
from Data, (1) a name of the form `on` + at least one character (`onclick`,
`html_onload`): `… has the form of a native event handler, run by the browser outside
Gramlot; write connect_<attribute> for an event, or rename the attribute` (every such
name, not a list; `on` alone accepted); (2) a `javascript:` URL in `href`, `src`,
`formaction`, `xlink:href`, read as the URL parser does (tabs/newlines removed, leading
spaces/controls trimmed): `… holds a javascript: URL, run by the browser as code; write
connect_onclick or the action of a button instead`.
**`iframe` `srcdoc` from Data**: both renderers add `sandbox=""` (HTML shown, nothing
runs). The declaration decides, not the value: `^`/`=` pointer, `==`, explicit pointer template, or a pointer node value whose datum
can carry `srcdoc` in `_wdg`; so `sandbox` is there while `srcdoc` is null and a Data
change writes only `srcdoc`. Literal `srcdoc`: no `sandbox`. A `sandbox` declared in
the Source (any value) is kept and turns the rule off; removing it brings `sandbox=""`
back. `html_srcdoc` → `html_sandbox`. The live renderer writes `sandbox` before every
other attribute: the browser reads it when `src`/`srcdoc` starts a navigation.
