# Classes, repository and server adapters

Document ID: **GC-090**. 0.1.2 APIs; 0.2.0 changes are marked.

> **Release status.** This page describes Gramlot **0.2.0 (HTML/SVG data
> binding)**, released on 2026-09-30 and is published on PyPI (`gramlot`)
> and on npm and JSR (`@gramlot/gramlot`); the README states the current release. The previous release is **0.1.2**.
> Text without a *0.2.0* mark describes behavior that comes from 0.1.2. Sections
> 030 and 035 describe 0.2.0 behavior.

<a id="gc-090-005"></a>

## 005 · Reading this first draft

This is the user-facing map of the Gramlot core, with the 0.2.0 binding layer
marked where it applies. The core is published
on PyPI (`gramlot`) and on npm and JSR (`@gramlot/gramlot`); the adapters are tested in
their own repositories. Richer examples in gramlot-poc
use an experimental runtime and do not establish features in this core.

<a id="gc-090-010"></a>

## 010 · A small repository

```text
src/gramlot/          Python page authoring and neutral server contracts
  page/              Page, GramlotBuilder and Source authoring
  server/            Neutral GramlotServer and page loading
  db/                Reserved database contracts
  collections/       Exported builder_grammar collections
  resources/         Generated browser bundles and notices
js/src/              Browser runtime and JavaScript authoring
  server/            JS server contracts and filesystem page loading
  builder/           Gramlot authoring dialect
  renderer/          Source events and DOM lifetime
  view/              HTML and SVG element handling
  references.js      Mounted Source/DOM references
  transport.js       Main and remote Source transport
tests/, js/tests/    Contract tests and small server fixtures
docs/public/         This user manual
docs/internal/       Contributor operations and working decisions
docs_llm/            Concise mirrors
ports/               Bounded transfer and review records
```

These are existing folders, not a proposed component inventory. Generic Bag and
builder implementations live in their own libraries. `build/` contains generated
assets and documentation; it is not an application source directory.

*0.2.0:* adds `js/src/builder/source.js` (`GramlotBuilderBag` and
`GramlotBuilderBagNode`), `js/src/binding/` (Data routing, installation, formulas
and controllers, named logic, inline code), `js/src/bootstrap.js`,
`js/src/server/resources.js`, `src/gramlot/server/resources.py`, the Python
renderers in `src/gramlot/renderer/` and the data-element grammar
`src/gramlot/collections/binding.json`. The example families `html_svg`, `binding`
and `controllers` and their gallery are the separate package `gramlot-examples`.

<a id="gc-090-015"></a>

## 015 · Classes you work with

JavaScript pages must extend `Page` in hosted and standalone execution.
`Page.css` is an array of stylesheet URLs. Standalone loads them before starting
the Page and releases its stylesheet links on disposal.

*0.2.0:* `Page.css` stays, in Python and JavaScript, for every server. Pages also
declare `css_requires` and `js_requires` as comma-separated strings of resource
names; only a `GramlotServer` with a resource system interprets them. The minimal `GramlotFileServer` and
the current adapters have none and raise an error for any name; the resource
system comes with genro-kajenn, part of Genro, the framework that succeeds GenroPy
(built on Kajenn, Gramlot and Asqueel) (section 030).

Rendering requires `SourceBag` and `SourceBagNode`, associated with their builder.
Their methods are part of the contract. Plain Bags are valid for Data, not Source;
`attr.tag` is not an alternative to `nodeTag`. Invalid Source is rejected, not converted.

| Class or API | Responsibility | Where you use it |
| --- | --- | --- |
| Python `Page` | Declares metadata, `main(root)` and exposed Source methods | Subclass for an application page |
| Python `GramlotServer` | Resolves page files, allocates page IDs, returns bootstrap HTML and Source | Used or specialized by a server adapter |
| `GramlotBuilder` in Python/JS | Authors the Gramlot dialect over Python `BuilderBase` / JS `HtmlBuilder` with loaded collections | Page roots are backed by it |
| JS `Gramlot` | Holds lifecycle and Data; its proxies `src` (`SourceHandler`: the Source and every change of it), `rpc` (`RpcHandler`: the exchange with the server), `dom` (`DomHandler`: the DOM and its correspondence with the Source), `utl` (`UtilitiesHandler`: page utilities) hold the themed members | Browser runtime bootstrap |
| JS `GramlotRenderer` | Extends generic `RendererBase`; owns live DOM and application references | Framework runtime |
| *0.2.0:* JS `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Extend Builder `HtmlRenderer` and `SvgRenderer`, inheriting their attribute and style adaptation; render to strings. `GramlotRenderer` extends `GramlotHtmlRenderer` and keeps the live DOM and application references | Framework runtime |
| *0.2.0:* Python `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Render a Gramlot Source to static HTML/SVG with the same attribute and style rules as JS | Static pages, pre-rendering |
| JS `MainTransport` | Main and remote Source requests | Runtime transport |
| JS `GramlotServer`, `Page`, `GramlotFileServer` | Same execution role; language-specific contracts below | Node/Bun adapter implementations |

`SourceBag`, typed serialization and generic grammar/rendering belong to dependency
libraries. Page code builds Source; it does not construct DOM. Data roots exist;
the 0.2.0 bindings and controllers are described below and in
[Writing pages](095-writing-pages.md), and resolvers are not implemented.

*0.2.0:* bindings and controllers enter with 0.2.0; resolvers stay deferred.
`gramlot.dom` holds `getBaseSourceNode(domNode)` and `getDomNode(sourceNode)`, and
each instance owns its named logic groups in `app.logic`
([Writing pages](095-writing-pages.md)). In the browser, Source is built from
`GramlotBuilderBag` and `GramlotBuilderBagNode`, which extend `SourceBag` and
`SourceBagNode`. They provide `PUT`, `FIRE`, `FIRE_AFTER` and the variable
datapath; Builder and Bag are not modified. Python has two classes of the same
names in `src/gramlot/page/source.py`, for authoring and the wire (`__cls`); they
carry no runtime methods. The other binding classes are internal to the runtime.

<a id="gc-090-017"></a>

## 017 · Python and JavaScript server boundaries

`GramlotServer` and `GramlotFileServer`, in Python and JavaScript, provide the
same functionality, not an identical member-by-member API. Both create a fresh
Page and builder for each main or remote Source request; module loading is a
separate lifecycle.

| Aspect | Python `GramlotServer` / `GramlotFileServer` | JavaScript `GramlotServer` / `GramlotFileServer` |
| --- | --- | --- |
| Named Source parameters | Passed as keyword arguments: `details(root, name=...)` | Passed as one object: `details(root, {name})` |
| Omitted parameters | Empty dictionary | Empty object |
| Explicit `None` / `null` | `None` is treated as empty parameters | `null` is treated as empty parameters |
| Exposed Source method | `@source` decorator | `registerSource('details')` on the `Page` subclass |
| Unknown or unexposed Source method | `SourceNotFound` | `SourceNotFound` |
| The base `Page` class as a page | Rejected | Rejected |
| Empty the page registry | `close_all()` | `closeAll()` |
| Page module loading without reload | Executes the module once per real path, then caches it | Imports the module once per real path, then uses the ESM import cache |
| Page module loading with reload | Executes the module again at each opening | Imports the module again when its modification time changes |

`GramlotFileServer(pages_dir, reload=None)`/`new GramlotFileServer(pagesDir,
{reload: null})` takes the reload choice from `GRAMLOT_DEV` when `reload` is
`None`/`null`: reload for `YES` and `DEBUG`, no reload when the variable is unset.
An explicit boolean wins. Adapters call `close_all()`/`closeAll()` on shutdown.
The JavaScript error classes set `name` to their class name. `registerPage` exists
in JavaScript only: the serverless Worker uses it.

Valid named parameters produce the same Source result in the bounded comparison.
The Source error classes and the explicit-null rule are the same in both languages
(since 2026-09-30); the parameter form and the module loading are language conventions,
not a promise of cross-language interchangeability. Module caching does not reuse Page instances
between Source requests. Custom page resolution belongs to the server integration;
the filesystem comparison above does not describe the bundled Worker loader of
`@gramlot/gramlot-serverless`.


<a id="gc-090-020"></a>

## 020 · What a server adapter connects

The Python adapter calls `await server.open_page(path, owner=identity)` and returns
its `.html`. Later it routes the configured main endpoint to
`await server.main(page_id, owner=identity)` and the remote Source endpoint to
`await server.source(page_id, method, params, owner=identity)`. It serves the JS bundle
at `runtime_url`, connects authentication to `owner`, and maps failures to HTTP
responses. `PageExpired` covers expired, unknown or unowned page IDs.

JavaScript follows the same division: the shared Node/Bun adapter translates HTTP
requests into `server.openPage`, `server.main`, `server.source` and `server.closePage`, extracts request identity
through its `ownerForRequest(request)` option, and maps errors to HTTP responses.
The neutral JS `GramlotServer` has no `fetch` or request-identity callback. WorkerHost invokes
the same page methods through messages, without HTTP handling. Every adapter
calls `close_all()`/`closeAll()` on shutdown.

The neutral `GramlotServer` does not start an HTTP server and does not search files. Its registry
is process-local, bounded and expiring; page IDs are not login credentials. A
concrete server implements two methods: `resolve_page(path)`/`resolvePage(path)`
returns the `Page` class, and `resolve_resources(path, cls)`/`resolveResources(path,
PageClass)` returns `{css: [url], js: [{url, group}]}` in load order, without mount
prefix. The neutral `GramlotServer` raises `PageNotFound` for both. Each module exports a
`Page` subclass. Each main/source invocation uses a fresh page and builder;
instance fields are not persistent session state.

`GramlotFileServer(pages_dir)`/`new GramlotFileServer(pagesDir)` is the minimal reference
implementation, in Python and JavaScript. It takes the pages folder and an optional
`reload` (section 017).
It maps `/` to `index.py`/`index.js`. For `a/b` it takes the file page `a/b.py`
first, then the folder page `a/b/b.py`; when both exist the file wins (section 030).

`open_page(path, *, owner=None, prefix="")`/`openPage(path, {owner, prefix})`
returns `Bootstrap(page_id, html, nonce)`/`{pageId, html, nonce}`. The adapter
chooses the mount prefix. The `GramlotServer` adds it once, only to root-relative URLs
(`/…`, not `//…`): stylesheet URLs, JavaScript module URLs, runtime, main, Source
and close. Relative and absolute URLs stay as written. The nonce is new at each
opening and distinct from the page ID; the bootstrap script carries it.

*0.2.0:* the returned HTML holds one module script:
`import {PageBootstrap} from <runtime>; await new PageBootstrap({config, resources}).run();`.
`config` is `{pageId, mainUrl, sourceUrl, closeUrl, rootId}`; `resources` is
`{css: [url], js: [{url, group}]}`. The Python and JavaScript `GramlotServer` classes write the same
compact JSON. The HTML has no `<link>`: `PageBootstrap` writes the stylesheet links
in the browser (section 030).

The JS `GramlotServer` provides `openPage`, `main`, `source`, `closePage` and `closeAll`; HTTP
`Request`/`Response` translation belongs to the adapter. `GramlotFileServer` resolves JS page modules and their same-name files. Reusable Node and Bun bridges now live in `@gramlot/gramlot-js-server/node` and
`@gramlot/gramlot-js-server/bun`. The Python adapters live in `gramlot-py-server`:
generic ASGI (Uvicorn or any ASGI server), Django, Flask, FastAPI and Kajenn are
distinct modules of one package. Each adapter repository states the versions it
verifies. The browser protocol every adapter exposes (URLs, payloads, status codes)
is stated in GC-230, Server protocol, in `docs/internal/`; any adapter can run the
conformance check `check_protocol(base_url, page_path)` (Python, `gramlot.server`)
or `checkProtocol(baseUrl, pagePath)` (JS, `@gramlot/gramlot/server`) against itself.

*0.2.0:* at the 0.2.0 release the adapters verified against the minimal contract
were `gramlot-uvicorn` (Python, ASGI and Uvicorn), `gramlot-js-server` (Node.js and
Bun) and the standalone exporter, today `@gramlot/gramlot-serverless` in
`gramlot-js-server`. Today the five adapters of `gramlot-py-server` and the packages
of `gramlot-js-server` implement the contract. Each adapter
passes the mount prefix to `open_page` and serves the companions (section 030). The
two server adapters send the Content Security Policy header they are configured
with (section 035); the standalone export writes a hash policy (section 025).

For HTTP pages, explicit browser disposal sends a best-effort close request;
non-persisted `pagehide` sends a JSON beacon. A page retained in the browser's
back/forward cache stays registered. The adapter supplies request identity and
the neutral `GramlotServer` deletes only a page owned by it; TTL remains the fallback when
delivery fails. The Worker standalone host has a separate local lifecycle.

Next: [Writing pages](095-writing-pages.md).


The generic `genro-builders-js` owns authoring and static HTML/SVG rendering.
Gramlot owns its live renderer; `genro-dom-js` is no longer a dependency.
`gramlot.src.startSource(wire)` can mount an already-authored typed Source through the
same renderer; it does not execute a Page. Standalone Page execution uses the Worker
host described below, not a build-time compiler.

Servers obtain browser code from packaged assets (`runtime_asset()` in `gramlot.server`
in Python; `runtimeAsset()` from `@gramlot/gramlot/server` and `@gramlot/gramlot/runtime`
in JS, from npm, JSR or the repository's `js/`). See the
installation contexts below; adapters serve the assets of their installed package.
The build writes two runtime files, `gramlot.js` (readable) and `gramlot.min.js`
(minified). The runtime URL, `/assets/gramlot.js` by default, serves `gramlot.js`
when `GRAMLOT_DEV=DEBUG` and `gramlot.min.js` otherwise: `runtime_asset()`/`runtimeAsset()`
returns the file to serve. `runtimeAsset()` returns a `URL`: a `file:` URL from npm, read
with `fs.readFile`, an `https:` URL from JSR, read with `fetch`.

`GRAMLOT_DEV` is read the same way in Python (`gramlot_dev()`) and JavaScript
(`gramlotDev()`): unset means deploy; `YES` means development, with pages read
again (section 017); `DEBUG` means development with the readable runtime. Any
other value raises `ValueError` in Python and `TypeError` in JavaScript.

`PageNotFound`, `SourceNotFound`, `PageExpired` and `ServerCapacity`, in Python and JS, distinguish
framework failures from unexpected application exceptions. The dependencies are
installed from the registries that each package declares (PyPI, npm, JSR).


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
`@gramlot/gramlot-serverless` owns standalone startup and Worker integration; it replaces
the retired `gramlot-minimal` (section 025). This boundary is not supplied by
installing the published JSR 0.1.x package alone; unchanged GitHub archives also
retain their original boundary. No package rename or compatibility alias is
introduced by this guide.


<a id="gc-090-023"></a>

## 023 · Theme and logo files in the packages (0.2.2)

From 0.2.2 the three core packages carry the same theme and logo files:

- `themes/gramlot-base/theme.css` and its `README.md`;
- of `assets/branding/`, the four stable entry points `gramlot-logo.svg`,
  `gramlot-logo-dark.svg`, `gramlot-mark.png`, `gramlot-mark-dark.png`, and the
  24 transparent SVG variants in `svg/`.

| Registry | Path of the theme | Path of a logo |
| --- | --- | --- |
| npm `@gramlot/gramlot` | `@gramlot/gramlot/themes/gramlot-base/theme.css` | `@gramlot/gramlot/assets/branding/svg/gramlot-logo-primary.svg` |
| PyPI `gramlot` | `gramlot/resources/themes/gramlot-base/theme.css` | `gramlot/resources/assets/branding/svg/gramlot-logo-primary.svg` |
| JSR `@gramlot/gramlot` | `themes/gramlot-base/theme.css` | `assets/branding/svg/gramlot-logo-primary.svg` |

The npm package exports `./themes/*` and `./assets/branding/*`, so the files
resolve by name:

```javascript
const theme = import.meta.resolve('@gramlot/gramlot/themes/gramlot-base/theme.css');
```

The wheel reads them as package resources:

```python
from importlib.resources import files

theme = files("gramlot") / "resources" / "themes" / "gramlot-base" / "theme.css"
```

The sources stay at the repository root (`themes/`, `assets/branding/`);
`js/scripts/build-runtime.mjs` copies them into the npm package and the wheel.
The rest of the identity kit is not packaged.


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

Source methods (`@source`, `registerSource(...)`, `remoteSource`) are not yet part of the page-writing API: they arrive together with the `remote` grammar attribute and `@endpoint`.

The Worker entry belongs to the `@gramlot/gramlot-serverless` host configuration. This
development boundary requires the matching core with the browser-safe `/gramlot-server`
export; unchanged 0.1.0 archives do not provide it:

```javascript
import {WorkerHost} from '@gramlot/gramlot-serverless/worker-host';
import {Page} from './page.js';
new WorkerHost(Page);
```

Bundle this entry and its imports into a classic Worker script. The browser runtime
starts it with `await mount({workerUrl})` from the standalone entry of
`@gramlot/gramlot-serverless` (`@gramlot/gramlot-serverless/standalone`).
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
*0.2.0:* Data binding runs in the window; the Worker builds the Source. Node-only imports cannot run in the Worker. The current packaged
Worker profile passes in Chromium; an earlier local file check also passed in
Playwright WebKit. WebKit is not Safari. Safari and Firefox remain unverified.

*0.2.0:* `Page.css` stays on every server path; `css_requires` and `js_requires`
need a `GramlotServer` with a resource system (section 030). The WorkerHost counts as server
side: it compiles no code, and it never executes the companion.

**Export shape (0.2.0).** The `@gramlot/gramlot-serverless` export is one HTML file:

- the Worker script holds the Page and the `WorkerHost`; it has no inline
  compiler (`binding/inline.js` is not in its bundle);
- the page logic (the `Logic` export of the page module, else the companion
  `foo_aux.js`) is a separate bundle that runs in the window only, reached through
  a blob URL that replaces its URL, with the order of the resources kept;
- the Content Security Policy is a hash profile: `script-src` holds the sha256 of
  the final script bytes, `'unsafe-eval'` and `blob:`, without `'unsafe-inline'`;
  the export uses the hash where the HTTP servers use a nonce. A copy of the file
  with one added byte is blocked. `'unsafe-eval'` lets the window compile the
  inline code of the Source it receives from the Worker, so the file runs named
  logic and inline code (section 035). `connect-src` is `*`: connections stay open
  until a page can declare its own policy. This is the only profile of the export
  (from gramlot-js-server 0.2.3; 0.2.2 had no `'unsafe-eval'` and
  `connect-src 'none'`).

**Standalone integration.** `@gramlot/gramlot-serverless`, in `gramlot-js-server` (heir
of the retired `gramlot-minimal`), supplies the Node/npm exporter of the browser standalone profile.
It bundles the Page without executing it and generates the complete HTML through
HtmlBuilder; it also exports a static directory with several documents, each
with its own Worker. Assets must be included by the exporter and served at their
declared paths. The exported gallery directory opens through `file://`:
relative classic scripts start Blob Workers, and an explicit export root resolves
local stylesheets. The repository of each integration documents its commands.
Its dependencies are `@gramlot/gramlot >=0.2.5` and `@genrojs/builders
>=0.4.1` (Node 22 or newer).

The published 0.1.0 archive retains `@gramlot/standalone` and its
`gramlot-standalone` command; use its bundled README for that immutable release.
Generic Python ASGI hosting, with Uvicorn or any ASGI server, is the `uvicorn`
adapter of `gramlot-py-server`; Kajenn is its `kajenn` adapter. The retired
`gramlot-minimal` repository is historical; its heirs are the `uvicorn` adapter of
`gramlot-py-server` (formerly the archived `gramlot-uvicorn`) and
`@gramlot/gramlot-serverless` in `gramlot-js-server` (formerly the archived
`gramlot-serverless` repository).


<a id="gc-090-030"></a>

## 030 · Page resources and file layout (0.2.0)

This section describes 0.2.0 behavior.

**Stylesheets.** `Page.css` is a list of URLs, written as in `<link href>`, and
stays in the core for every server. A root-relative URL (`/themes/base.css`)
receives the mount prefix once; a relative URL (`theme.css`) and an absolute URL
(`https://…`, `//…`) stay as written.

**Page files.** `GramlotFileServer` serves one pages folder. For the page path `orders` it
takes the file page `orders.py` (`orders.js` for a JavaScript page) first, then the
folder page `orders/orders.py`. When both exist the file wins, without error.
Path segments contain letters, digits, `_` and `-`. A path whose real location
leaves the pages folder is rejected. Files with the page's name, beside the file
page or in its folder:

- `orders.css`: the page stylesheet;
- `orders_aux.js`: the page's auxiliary JavaScript module, exporting `Logic`;
- `orders.md`: the README.

**Page logic (0.2.5).** The page logic, group null, comes from one module:

- JavaScript page: the `Logic` export of the page module `orders.js`, else
  `orders_aux.js`;
- Python page: `orders.js` beside `orders.py`, else `orders_aux.js`. Its `Logic`
  export is the logic; its `Page` export, the JavaScript version of the same page,
  stays unused. Python cannot read the exports of a JavaScript file: `orders.js`
  beside a Python page exports `Logic`, and the browser rejects it otherwise,
  naming the file.

Both modules for one page raise an error (`Error` in JavaScript, `ValueError` in
Python), before the page is registered. The page module is imported by the browser
for its `Logic`, so every import of it resolves in the browser; a JavaScript `Page`
with server-only imports keeps its logic in `orders_aux.js`.

The `_aux` suffix is reserved: `orders_aux.js` is never a page, and no page is
called `*_aux`. Python and JavaScript pages may share one folder: `orders.js` is
the JavaScript page and the logic of `orders.py`.

**Load order.** The `Page.css` URLs as written, then `orders.css` and the page
logic. The same URL repeated loads once, in its last position. The same
JavaScript URL declared with two different groups is an error.

**Resource fields.** Python pages declare `css_requires = ""` and
`js_requires = ""`; JavaScript pages declare `static css_requires = ''` and
`static js_requires = ''`. The names are interpreted only by a `GramlotServer` with a
resource system, which comes with genro-kajenn, part of Genro, the framework that
succeeds GenroPy (built on Kajenn, Gramlot and Asqueel). The minimal `GramlotFileServer` and
the current adapters have none: on `GramlotFileServer` a name in either field raises
`InvalidResourceName` ("requires need a GramlotServer with a resource system"). The core
parses both fields with the same rules in both languages:

- an empty or missing field declares no resource;
- `,` separates names; spaces around a name are ignored;
- empty tokens and duplicates are ignored; a duplicate keeps its first position;
- `/` separates subfolders, for example `frameplugin_menu/frameplugin_menu`. Each
  segment is non-empty and matches `^[A-Za-z0-9_-]+$`. `.`, `..`, a leading or
  trailing `/` and extensions are rejected;
- `:` is an error: `name:media` is outside 0.2.0.

**Companion visibility.** The page logic module is served to the browser, so it is
public. Server-only logic, such as queries, keys and data access, belongs in
separate modules that the page logic does not import.

**Companion rule of the adapters.** An adapter serves the companions with the
`GramlotFileServer.url` rule: GET and HEAD answer only `.css` and `.js` files whose real
path is inside the pages folder, so a page module and its relative imports reach
the browser (until 0.2.4: `.css` and `_aux.js`). Any other file answers 404 and any other method
405. `Page.css` URLs that point outside the pages folder stay application assets and
are not served by this rule.

**Import map (0.2.5).** Before the bootstrap script, the bootstrap HTML carries
`<script type="importmap">`, with the bootstrap nonce, that maps
`@gramlot/gramlot/page` to the runtime URL with the mount prefix. The runtime exports
`Page`, so a page module imported for its `Logic` loads the runtime
already in the page: one runtime instance. A strict CSP needs no new source: the
import map carries the nonce.

**Bootstrap.** The bootstrap script (section 020) runs `PageBootstrap` in the
browser:

1. it writes the CSS links in load order;
2. it imports all JavaScript modules, relative URLs resolved against the document;
3. it checks every `Logic` class (an explicit constructor, an accessor, a symbol
   key, a class that extends another, the group names `page` and `constructor`
   are errors) before creating anything;
4. it creates the `Gramlot` instance, registers each module's `Logic` class in the
   received order and sets `window.gramlot`;
5. it starts the page.

If an import or a `Logic` check fails, the error names the resource, the CSS links
stay, the server page is closed and nothing is mounted. If the page closes before
the start, no `Gramlot` instance is created and the close beacon is sent. The
bootstrap module script carries a nonce generated separately from the page ID; the
adapter puts it in the CSP header. The standalone export uses a hash (section 025).

<a id="gc-090-035"></a>

## 035 · Content Security Policy profiles (0.2.0)

The application chooses the Content Security Policy; Gramlot defines two profiles
and never sets the header itself. The adapter writes it with the nonce of the
opening, through a `{nonce}` placeholder in its configuration:
`content_security_policy` in the adapters of `gramlot-py-server`, `contentSecurityPolicy` in
`gramlot-js-server`. The header is sent on HTML responses only.

| Profile | `script-src` | Pages that run |
| --- | --- | --- |
| Strict | `'nonce-{nonce}'`, plus `object-src 'none'; base-uri 'none'` | Named logic only: methods of the companion and of `js_requires` resources, no inline code |
| Permissive | as the strict profile, plus `'unsafe-eval'` | Named logic and inline code (`formula`, `script`, `==`, `action`, `connect_on<event>`, `_if`/`_else`) |

Under the strict profile an inline declaration fails with an `EvalError`:
`<tag> '<label>' '<attribute>': inline code blocked by the Content Security Policy
of the page (no 'unsafe-eval'); move the code to named logic (a method of the page
companion _aux.js) or serve the page with the permissive CSP profile, which allows
'unsafe-eval'`. For inline code in the node value, `'<attribute>'` is written
`node value`: `<tag> '<label>' node value: inline code blocked …`. The browser error
stays as `cause`. Nothing is written to the Data.
The page that hits it reports the violation as any `script-src eval` violation.

**Inline code runs only as received with the Source.** `gramlot.src.prepareSource`
activates the inline code of the Source the page receives: `main` from the server,
a remote Source, or a `GramlotBuilderBag` given to `startSource`. Each
`GramlotBuilderBagNode` keeps the text of its code attributes (`formula` of a
`dataFormula`, `script` of a `dataController`, `_if`/`_else` of both, `action` of a
`button`, every `connect_on<event>`, every `==` attribute and a `==` node value), and
the compiler runs only that text. A text written later is never run: a code
attribute changed by page code, a node inserted in the live Source, a
`GramlotBuilderBag` that arrived inside Data or an RPC answer. The error is
`<tag> '<label>' '<attribute>': inline code runs only as received with the Source
(main or a remote Source); a text written later is not run: use named logic`.
Activation is in `prepareSource` and not in the TYTX decoding, because a
`GramlotBuilderBag` can arrive inside a Data Bag. A Data Bag is never compiled,
whatever the names of its attributes. A code attribute that holds a `^` or `=`
pointer is an error when the Source is received, before any effect:
`<tag> '<label>': '<attribute>' is inline code and cannot be the pointer
'<pointer>'; inline code is never read from Data`. Python runs no inline code: a
Python Source carries its code attributes as plain strings, and the page
activates them when it receives the Source.

**Attributes the browser runs.** The renderers, Python and JavaScript, refuse two
kinds of attribute that the browser would run outside the compiler, written in the
Source or resolved from Data:

- a name with the form of a native event handler, `on` followed by at least one
  character (`onclick`, `html_onload`): `<tag> '<label>': '<attribute>' has the
  form of a native event handler, run by the browser outside Gramlot; write
  connect_<attribute> for an event, or rename the attribute`. The rule covers every
  such name, not a list of events. An attribute named `on` is accepted;
- a `javascript:` URL in `href`, `src`, `formaction` or `xlink:href`, read as the URL
  parser reads it (tabs and newlines removed, leading spaces and controls trimmed):
  `<tag> '<label>': '<attribute>' holds a javascript: URL, run by the browser as
  code; write connect_onclick or the action of a button instead`.

**An `iframe` `srcdoc` from Data.** The renderers, Python and JavaScript, add
`sandbox=""` to an `iframe` whose `srcdoc` comes from Data: the browser shows its
HTML and runs nothing of it. The declaration decides, not the value: a `^`/`=`
pointer, a `==` expression, a `${…}` template reading a pointer, also through
another template, or a node value that is a pointer, whose datum can carry `srcdoc`
in its `_wdg`. The iframe has its `sandbox` while `srcdoc` is still null, so a Data
change writes only `srcdoc`. A literal `srcdoc` gets no `sandbox`. A `sandbox`
declared in the Source, with any value, is kept as declared and turns the rule off
(`sandbox='allow-scripts'` runs the scripts of the HTML); removing it brings the
empty `sandbox` back. With the `html_` prefix, `html_srcdoc` gets `html_sandbox`.
The live renderer writes `sandbox` before every other attribute of an element: the
browser reads `sandbox` when `src` or `srcdoc` starts a navigation, so a change of
both, or of a literal `srcdoc` into a pointer, navigates with the new `sandbox`.

One bootstrap module script carries the nonce and imports the runtime, so a script
without the nonce is blocked. The standalone export has its own hash profile
(section 025).
