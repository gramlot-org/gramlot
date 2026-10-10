# Classes, repository and server adapters

Document ID: **GC-090**. 0.1.2 APIs; 0.2.0 changes are marked.

> **Release status.** Describes **0.2.0 (HTML/SVG data binding)**: released 2026-09-30
> (PyPI `gramlot`, npm and JSR `@gramlot/gramlot`; current release in the README). Previous release:
> **0.1.2**. Unmarked text is behavior from 0.1.2; sections 030 and 035 are 0.2.0.

<a id="gc-090-005"></a>

## 005 · Reading this first draft

Core map, with the 0.2.0 binding layer marked. Published on PyPI (`gramlot`), npm and JSR
(`@gramlot/gramlot`); adapters are tested in their own repositories. Richer PoC behavior is not core evidence.

<a id="gc-090-010"></a>

## 010 · A small repository

`src/gramlot`: page/ owns Page/builder/Source, server/ owns GramlotServer, db/ is reserved; collections/ holds exported grammars; resources/ holds runtime bundles. `js/src`: browser/JS authoring, server/ (JS server contracts, file page loading), builder, renderer, view, references.js,
http-transport.js (0.2.14) and bootstrap. `tests`/`js/tests`: contracts and fixtures. `docs/public`:
manual; `docs/internal`: working decisions; `docs_llm`: concise mirrors; `ports`:
bounded reviews. Generic Bag/builders live separately; `build` is generated output.
This tree does not imply a component inventory.
*0.2.0:* adds `js/src/builder/source.js`, `js/src/binding/`, `js/src/bootstrap.js`, `js/src/server/resources.js`,
`src/gramlot/server/resources.py`, Python renderers in `src/gramlot/renderer/` and grammar `src/gramlot/collections/binding.json`. Example families `html_svg`, `binding`, `controllers` and their gallery: separate package `gramlot-examples`.

<a id="gc-090-015"></a>

## 015 · Classes you work with

JavaScript pages must extend `Page` in hosted and standalone execution.
`Page.css` is an array of stylesheet URLs. Standalone loads them before starting
the Page and releases its stylesheet links on disposal.
*0.2.0:* `Page.css` stays for every server; Python and JS pages also declare
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
| JS `GramlotRenderer` | Generic `RendererBase` specialization; live DOM and references |
| *0.2.0:* JS `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Extend Builder `HtmlRenderer`/`SvgRenderer`, inherit their attribute/style adaptation; string rendering. `GramlotRenderer` extends `GramlotHtmlRenderer` and keeps live DOM and references |
| *0.2.0:* Python `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Static HTML/SVG rendering of a Gramlot Source, same rules as JS |
| JS `HttpTransport` | Envelope to `rpcUrl`, close message to `closeUrl` (transport of `gramlot.rpc`) |
| JS `GramlotServer`/`Page`/`GramlotFileServer` | Node/Bun server boundary and file loading |

Dependency libraries own SourceBag, typed serialization and generic grammar/rendering. Pages
author Source, never DOM. Data roots exist; resolvers do not.
*0.2.0:* bindings and controllers enter, resolvers stay deferred; `gramlot.dom` holds
`getBaseSourceNode`/`getDomNode`; per-instance logic groups in `app.logic`
([GC-095 060](095-writing-pages.md)). Browser Source uses `GramlotBuilderBag`/
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
| Unknown endpoint | `EndpointNotFound` | `EndpointNotFound` |
| Unknown or unexposed Source method | `SourceNotFound` | `SourceNotFound` |
| Base `Page` class as a page | Rejected | Rejected |
| Empty the page registry | `close_all()` | `closeAll()` |
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

Python routes bootstrap to `open_page(path, owner=...)`, `POST rpc_url`
(`/gramlot/rpc`) to `call(body, owner=...)` (200 with its text; 400 on
`InvalidRequest`) and `POST close_url` (`/gramlot/close`) to `close_page`; it serves
`runtime_url` and supplies authenticated owner identity.
*0.2.14:* `call(text, *, owner=None)`/`call(text, {owner})`: TYTX request envelope
`{id, pageId, contentType, name, params}` → TYTX response envelope; `source` =
fragment (`main` = whole page), `data` = endpoint; failures other than
`InvalidRequest` are outcomes in the response (`not_found`, `page_expired`,
`not_authenticated`, `not_authorized`, `application_error`), status codes only for
transport. `PageExpired` means expired, unknown or unowned ID. `capabilities` → the
bootstrap (none in the base server). `evaluate_auth(rule, *, owner)`/
`evaluateAuth(rule, {owner})` → null (allow), `not_authenticated` or
`not_authorized`; base server: any rule → `not_authenticated`; a server with
identity overrides it and announces `auth`. `GramlotServer` starts no HTTP server and searches no files: its bounded
registry is process-local and IDs are not credentials. A concrete server implements
`resolve_page(path)`/`resolvePage(path)` → Page class and
`resolve_resources(path, cls)`/`resolveResources(path, PageClass)` →
`{css: [url], js: [{url, group}]}` in load order, without prefix; the neutral `GramlotServer`
raises `PageNotFound` for both. Each module exports `Page`. Every call creates a fresh
page (and builder for a fragment).
Minimal reference `GramlotFileServer(pages_dir)`/`new GramlotFileServer(pagesDir)`, Python and JS,
the pages folder plus optional `reload` (017): `/` → `index.py`/`index.js`; `a/b` → file page
`a/b.py` first, then folder page `a/b/b.py`; both present → the file wins (030).
`open_page(path, *, owner=None, prefix="")`/`openPage(path, {owner, prefix})` →
`Bootstrap(page_id, html, nonce)`/`{pageId, html, nonce}`. The adapter's mount
prefix is added once, only to root-relative URLs (`/…`, not `//…`): stylesheet and JS
module URLs, runtime, rpc, close; relative and absolute URLs stay as written.
The nonce is new at each opening, distinct from the page ID, on the bootstrap script.
*0.2.0:* the HTML holds one module script
`import {PageBootstrap} from <runtime>; await new PageBootstrap({config, resources}).run();`;
`config` = `{pageId, rpcUrl, closeUrl, rootId, capabilities}` (0.2.14, replaces
`mainUrl`/`sourceUrl`), `resources` =
`{css: [url], js: [{url, group}]}`; both `GramlotServer` classes write the same compact JSON. No `<link>`
in the HTML: `PageBootstrap` writes the CSS links in the browser (030).

JS `GramlotServer` exposes `openPage`, `call`, `closePage` and `closeAll`; adapters own HTTP
translation and identity extraction and call `close_all()`/`closeAll()` on shutdown. `GramlotFileServer` loads JS
pages and their same-name files. Node/Bun bridges are in `gramlot-js-server`; the Python
adapters (ASGI/Uvicorn, Django, Flask, FastAPI, Kajenn) are modules of `gramlot-py-server`.
Each adapter repository states the versions it verifies. The browser protocol of every adapter
(URLs, payloads, status codes) is stated in GC-230, Server protocol (`docs/internal/`); any adapter
can run the conformance check `check_protocol(base_url, page_path)` (Python, `gramlot.server`) /
`checkProtocol(baseUrl, pagePath)` (JS, `@gramlot/gramlot/server`) against itself.
*0.2.0:* verified on the minimal contract at the 0.2.0 release: `gramlot-uvicorn` (Python ASGI/Uvicorn), `gramlot-js-server` (Node.js, Bun) and the standalone exporter (today `@gramlot/gramlot-serverless`); today the five adapters of `gramlot-py-server` and the packages of `gramlot-js-server` implement the contract. Each passes the mount prefix to `open_page` and serves the companions (030); the two server adapters send the configured CSP header (035); the standalone export writes a hash policy (025).

HTTP browser disposal sends a best-effort close request; non-persisted `pagehide`
sends a JSON beacon, while back/forward-cache pages stay active. Adapters supply
owner identity, `GramlotServer` checks it, and TTL handles lost delivery. Worker disposal
remains local.

Next: [Writing pages](095-writing-pages.md).


The generic `genro-builders-js` owns authoring and static HTML/SVG rendering.
Gramlot owns its live renderer; `genro-dom-js` is no longer a dependency.
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

## 022 · Published package and local development names

The core is published as `@gramlot/gramlot` on npm (`npm install @gramlot/gramlot`)
and on JSR (`npx jsr add @gramlot/gramlot`). Application imports use that name:

```javascript
import {Page as BasePage} from '@gramlot/gramlot/page';
```

| Installation | Core name used in imports | Scope |
| --- | --- | --- |
| npm (`npm install`) or JSR (`jsr add`) | `@gramlot/gramlot` | Published registry package, from 0.2.1 |
| Core test fixtures (`js/tests/fixtures`) | `@gramlot/gramlot` | Package self-reference inside `js/`, same name |
| JSR `@genro/gramlot` 0.1.0–0.2.0 | `@genro/gramlot` | Earlier JSR name, archived |
| Original GitHub 0.1.0 archives | Follow the archive README and package manifest | Frozen archive delivery, separate from JSR |

The [JSR installation documentation](https://jsr.io/docs/npm-compatibility)
explains how its CLI installs the public import name through npm compatibility.
The repository's local package name is not automatically provided by that install.
The names above identify different installation contexts; do not mix them within
one application's core dependency graph.

The standalone examples below use matching core and standalone packages.
`@gramlot/gramlot-serverless` owns standalone startup and Worker integration and replaces the
retired `gramlot-minimal` (025). This boundary is not supplied by installing the
published JSR 0.1.x package alone; unchanged GitHub archives also retain their
original boundary. No package rename or compatibility alias is introduced by this
guide.


<a id="gc-090-023"></a>

## 023 · Theme and logo files in the packages (0.2.2)

From 0.2.2 npm, PyPI and JSR carry the same files: `themes/gramlot-base/theme.css`
(+ `README.md`); of `assets/branding/`, `gramlot-logo.svg`, `gramlot-logo-dark.svg`,
`gramlot-mark.png`, `gramlot-mark-dark.png` and the 24 SVG of `svg/`. Paths: npm
`@gramlot/gramlot/themes/…` and `@gramlot/gramlot/assets/branding/…` (exports
`./themes/*`, `./assets/branding/*`, e.g. `import.meta.resolve(...)`); wheel
`files("gramlot") / "resources" / "themes" / …` and `… / "resources" / "assets" / "branding" / …`
(`importlib.resources`); JSR `themes/…`, `assets/branding/…` at the package root.
Sources at the repository root; `js/scripts/build-runtime.mjs` copies them into the
npm package and the wheel. The rest of the identity kit is not packaged.


<a id="gc-090-025"></a>

## 025 · JavaScript standalone host

A dedicated browser Worker hosts one JavaScript Page. `WorkerHost` inherits `GramlotServer`
and reuses its page registration, `main`, explicitly marked Source methods, typed
serialization, fresh instance per call, expiry and error rules. There is no separate
standalone Page compiler. Python pages execute on Python servers only.

For the local development installation described above, use the browser-safe
Page entry for pages shared by Node, Bun and standalone:

```javascript
import {Page as BasePage} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) { root.section(null, {id: 'details'}).p('Hello'); }
}
```

`@source` / `registerSource(...)` declare Source fragments and `@endpoint` / `registerEndpoint(...)` declare endpoints (GC-230 §035; GC-095 §100). The declarative `remote` grammar attribute, which would mount a fragment from the Source itself, is not yet available: a fragment is requested from code with `gramlot.src.remoteSource(target, method, params)`.

The Worker entry belongs to the `@gramlot/gramlot-serverless` host configuration. This
development boundary requires the matching core with the browser-safe `/gramlot-server`
export; unchanged 0.1.0 archives do not provide it:

```javascript
import {WorkerHost} from '@gramlot/gramlot-serverless/worker-host';
import {Page} from './page.js';
new WorkerHost(Page);
```

Bundle this entry and its imports into a classic Worker script. The browser runtime
starts it with `await mount({workerUrl})` from `@gramlot/gramlot-serverless/standalone`.
The document must already contain `gramlot-root`, or pass an explicit `element`.
`mount` opens the Page, prepares Gramlot roots/subscriptions, then requests `main`.
For an exported directory, `mount({workerUrl, assetRoot})` accepts an absolute
file/HTTP/HTTPS directory URL ending in `/`. With this option, declared CSS URLs
must be root-relative paths and are resolved inside that export directory.
The exporter supplies the directory URL; it does not rewrite `Page.css`.
The returned Gramlot instance uses its ordinary live Source APIs.
`app.dispose()` terminates its dedicated Worker and rejects outstanding requests.
An optional mount `signal` cancels startup. A cancelled remote request drops its
reply; it does not interrupt JavaScript already executing inside the host.

Current scope: one Page per Worker, HTML Source, Source live, declared `Page.css`, no database.
*0.2.0:* Data binding runs in the window; the Worker builds the Source. Node-only imports cannot run in Worker. Current packaged Worker
passes in Chromium; an earlier local file check passed in Playwright WebKit.
WebKit is not Safari. Safari and Firefox remain unverified.
*0.2.0:* `Page.css` stays on every server path; `css_requires`/`js_requires` need a
`GramlotServer` with a resource system (030); the WorkerHost is server side: it compiles no
code and never runs the companion.

Export shape (0.2.0), `@gramlot/gramlot-serverless`: one HTML file. The Worker script holds
the Page and `WorkerHost`, without the inline compiler (`binding/inline.js` is not in
its bundle). The page logic (`Logic` export of the page module, else `foo_aux.js`) is a
separate bundle that runs in the window only, through a blob URL that replaces its URL,
resource order kept. The CSP is
a hash profile: `script-src` has the sha256 of the final script bytes, `'unsafe-eval'`
and `blob:`, no `'unsafe-inline'`; a copy with one added byte is blocked.
`'unsafe-eval'` lets the window compile the inline code of the Source received from the
Worker: named logic and inline code run (035). `connect-src *` until a page can declare
its own policy. Only profile of the export (from gramlot-js-server 0.2.3; 0.2.2: no
`'unsafe-eval'`, `connect-src 'none'`).

`@gramlot/gramlot-serverless`, in `gramlot-js-server` (heir of the retired `gramlot-minimal`), supplies the Node/npm
exporter of the browser standalone profile: it bundles the Page without executing it
and generates the HTML through HtmlBuilder; it also exports a static directory of
several documents, each with its own Worker. Assets must be included by the exporter
and served at their declared paths. The exported gallery directory opens through `file://`
(Blob Workers, explicit export root for local stylesheets). Dependencies:
`@gramlot/gramlot >=0.2.5`, `@genrojs/builders >=0.4.1`, Node 22+; commands are in
its repository.

The published 0.1.0 archive retains `@gramlot/standalone` and its
`gramlot-standalone` command; use its bundled README for that immutable release.
Generic Python ASGI hosting (Uvicorn or any ASGI server) is the `uvicorn` adapter of
`gramlot-py-server`; Kajenn is its `kajenn` adapter. The retired `gramlot-minimal` repository
is historical; heirs: the `uvicorn` adapter of `gramlot-py-server` (formerly the archived
`gramlot-uvicorn`) and `@gramlot/gramlot-serverless` in `gramlot-js-server` (formerly the
archived `gramlot-serverless` repository).


<a id="gc-090-030"></a>

## 030 · Page resources and file layout (0.2.0)

0.2.0 behavior.
`Page.css`: list of URLs as in `<link href>`, in the core for every server. `/…` gets
the mount prefix once; `theme.css`, `https://…`, `//…` stay as written.

Page files: `GramlotFileServer` serves one pages folder. Path `orders` → file page
`orders.py` (`orders.js` for JS) first, then folder page `orders/orders.py`; both →
the file wins, no error. Segments: letters, digits, `_`, `-`. A real path leaving
the pages folder is rejected. Same-name files beside the file page or in its
folder: `orders.css` (stylesheet), `orders_aux.js` (auxiliary JS module exporting
`Logic`), `orders.md` (README). `_aux` is reserved: `orders_aux.js` is never a page,
no page is `*_aux`. Python and JS pages may share a folder: `orders.js` is the JS page
and the logic of `orders.py`.

Page logic (0.2.5), group null: JS page → the page module's `Logic` export, else
`orders_aux.js`; Python page → `orders.js` beside `orders.py` (its `Logic`; its `Page`
unused), else `orders_aux.js`. Python cannot read JS exports: beside a Python page
`orders.js` exports `Logic`, else the browser rejects it naming the file. Both modules
→ error (`Error`/`ValueError`) before registration. The browser imports the page
module, so its imports must resolve there; a JS `Page` with server-only imports keeps
`orders_aux.js`.

Load order: `Page.css` as written, then `orders.css` and the page logic. A repeated
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

Companion rule of the adapters (the `GramlotFileServer.url` rule): GET/HEAD answer only `.css`
and `.js` files whose real path is inside the pages folder (page modules and their
relative imports; until 0.2.4 `.css` and `_aux.js`); other files 404, other
methods 405. `Page.css` URLs outside the pages folder stay application assets.

Import map (0.2.5): before the bootstrap script, `<script type="importmap">` with the
bootstrap nonce maps `@gramlot/gramlot/page` → runtime URL (mount prefix); the runtime
exports `Page`; one runtime instance; no new CSP source.

Bootstrap (`PageBootstrap`, in the browser): 1 write the CSS links in load order;
2 import all JS modules (relative URLs against the document); 3 check every `Logic`
(explicit constructor, accessor, symbol key, extended class, group names `page` and
`constructor` are errors) before creating anything; 4 create `Gramlot`, register each
`Logic` in received order, set `window.gramlot`; 5 start. A failed import or `Logic`
check names the resource, keeps the CSS links, closes the server page and mounts
nothing. Page close before start: no `Gramlot`, close beacon sent. The bootstrap module script
carries a nonce separate from the page ID, placed by the adapter in the CSP header;
standalone uses a hash (025).

<a id="gc-090-035"></a>

## 035 · Content Security Policy profiles (0.2.0)

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
runs). The declaration decides, not the value: `^`/`=` pointer, `==`, `${…}` template
reading a pointer (also through another template), or a pointer node value whose datum
can carry `srcdoc` in `_wdg`; so `sandbox` is there while `srcdoc` is null and a Data
change writes only `srcdoc`. Literal `srcdoc`: no `sandbox`. A `sandbox` declared in
the Source (any value) is kept and turns the rule off; removing it brings `sandbox=""`
back. `html_srcdoc` → `html_sandbox`. The live renderer writes `sandbox` before every
other attribute: the browser reads it when `src`/`srcdoc` starts a navigation.
