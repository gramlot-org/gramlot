# Classes, repository and server adapters

Document ID: **GC-090**. 0.1.2 APIs; 0.2.0 changes are marked.

> **Release status.** Describes **0.2.0 (HTML/SVG data binding)**: released 2026-09-30
> (GitHub `v0.2.0`; current patch **0.2.1**, 2026-10-01: PyPI `gramlot`, npm and JSR `@gramlot/gramlot`). Previous release:
> **0.1.2**. Unmarked text is behavior from 0.1.2; sections 030 and 035 are 0.2.0.

<a id="gc-090-005"></a>

## 005 · Reading this first draft

Implemented and owner-accepted 0.1.0 core, with the 0.2.0 binding layer marked. The Python wheel and
declared GitHub JS dependencies install in fresh environments; seven local
packaged Host profiles pass in Chromium. Richer PoC behavior is not core evidence.

<a id="gc-090-010"></a>

## 010 · A small repository

`src/gramlot`: page/ owns Page/builder/Source, server/ owns Host, db/ is reserved; collections/ holds exported grammars; resources/ holds runtime bundles. `js/src`: browser/JS authoring adapters, builder, renderer, view, references.js,
transport.js and bootstrap. `tests`/`js/tests`: contracts and fixtures. `docs/public`:
manual; `docs/internal`: working decisions; `docs_llm`: concise mirrors; `ports`:
bounded reviews. Generic Bag/builders live separately; `build` is generated output.
This tree does not imply a component inventory.
*0.2.0:* adds `js/src/builder/source.js`, `js/src/binding/`, `js/src/bootstrap.js`, `js/src/adapters/resources.js`,
`src/gramlot/server/resources.py`, Python renderers in `src/gramlot/renderer/` and grammar `src/gramlot/collections/binding.json`. `examples/`: families `html_svg`, `binding`, `controllers`; runner in `examples/00-runner/`.

<a id="gc-090-015"></a>

## 015 · Classes you work with

JavaScript pages must extend `Page` in hosted and standalone execution.
`Page.css` is an array of stylesheet URLs. Standalone loads them before starting
the Page and releases its stylesheet links on disposal.
*0.2.0:* `Page.css` stays for every host; Python and JS pages also declare
`css_requires`/`js_requires` name strings, interpreted only by a Host with a
resource system (gramlot-kajenn) (030).

Rendering requires `SourceBag` and `SourceBagNode`, associated with their builder.
Their methods are part of the contract. Plain Bags are valid for Data, not Source;
`attr.tag` is not an alternative to `nodeTag`. Invalid Source is rejected, not converted.

| API | Responsibility |
| --- | --- |
| Python `Page` | Metadata, `main(root)`, exposed Source methods |
| Python `Host` | Page resolution, IDs, bootstrap, main/Source calls |
| Python/JS `GramlotBuilder` | Gramlot dialect over Python `BuilderBase` / JS `HtmlBuilder` with loaded collections |
| JS `Gramlot` | Data/Source roots and main/remote coordination |
| JS `GramlotRenderer` | Generic `RendererBase` specialization; live DOM and references |
| *0.2.0:* JS `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Extend Builder `HtmlRenderer`/`SvgRenderer`, inherit their attribute/style adaptation; string rendering. `GramlotRenderer` extends `GramlotHtmlRenderer` and keeps live DOM and references |
| *0.2.0:* Python `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Static HTML/SVG rendering of a Gramlot Source, same rules as JS |
| JS `MainTransport` | Main and remote requests |
| JS `Host`/`Page`/`FileHost` | Node/Bun server boundary and file loading |

Dependency libraries own SourceBag, typed serialization and generic grammar/rendering. Pages
author Source, never DOM. Data roots exist; resolvers do not.
*0.2.0:* bindings and controllers enter, resolvers stay deferred; `Gramlot` gains
`getBaseSourceNode`/`getDomNode` and per-instance logic groups in `app.logic`
([GC-095 060](095-writing-pages.md)). Browser Source uses `GramlotBuilderBag`/
`GramlotBuilderBagNode` (extend `SourceBag`/`SourceBagNode`) for `PUT`, `FIRE`,
`FIRE_AFTER` and variable datapath; Builder/Bag unmodified. Python has same-named classes in `src/gramlot/page/source.py` for authoring and the wire (`__cls`), without runtime methods.
Other binding classes stay internal.

<a id="gc-090-017"></a>

## 017 · Python and JavaScript Host boundaries

Python Host and JS Host/FileHost have the same execution responsibility, not an
identical language-level API. Both create a fresh Page and builder for each main
or remote Source request; module loading is a separate lifecycle.

| Aspect | Python Host | JavaScript Host / FileHost |
| --- | --- | --- |
| Named Source parameters | Passed as keyword arguments: `details(root, name=...)` | Passed as one object: `details(root, {name})` |
| Omitted parameters | Empty dictionary | Empty object |
| Explicit `None` / `null` | `None` is treated as empty parameters | `null` is treated as empty parameters |
| Missing exposed Source method | `SourceNotFound` | `SourceNotFound` |
| Page module loading | FileHost executes the module on each page opening | FileHost uses cached ESM imports; no live reload |

Valid named parameters produce the same Source result in the bounded comparison.
The Source error classes and the explicit-null rule are the same in both languages
(since 2026-09-30); the parameter form and the module loading are language conventions,
not a promise of cross-language interchangeability. Module caching does not reuse Page instances
between Source requests. Custom page resolution belongs to the host integration;
the filesystem comparison above does not describe the bundled Worker loader of `@gramlot/gramlot-serverless`.


<a id="gc-090-020"></a>

## 020 · What a server adapter connects

Python routes bootstrap to `open_page(path, owner=...)`, main to
`main(page_id, owner=...)`, and remote Source to
`source(page_id, method, params, owner=...)`; it serves `runtime_url`, supplies
authenticated owner identity and maps failures. `PageExpired` means expired,
unknown or unowned ID. Host starts no server and searches no files: its bounded
registry is process-local and IDs are not credentials. A concrete host implements
`resolve_page(path)`/`resolvePage(path)` → Page class and
`resolve_resources(path, cls)`/`resolveResources(path, PageClass)` →
`{css: [url], js: [{url, group}]}` in load order, without prefix; the neutral Host
raises `PageNotFound` for both. Each module exports `Page`. Every main or remote
Source request creates fresh page/builder state.
Minimal reference `FileHost(pages_dir)`/`new FileHost(pagesDir)`, Python and JS,
one argument (the pages folder): `/` → `index.py`/`index.js`; `a/b` → file page
`a/b.py` first, then folder page `a/b/b.py`; both present → the file wins (030).
`open_page(path, *, owner=None, prefix="")`/`openPage(path, {owner, prefix})` →
`Bootstrap(page_id, html, nonce)`/`{pageId, html, nonce}`. The adapter's mount
prefix is added once, only to root-relative URLs (`/…`, not `//…`): stylesheet and JS
module URLs, runtime, main, Source, close; relative and absolute URLs stay as written.
The nonce is new at each opening, distinct from the page ID, on the bootstrap script.
*0.2.0:* the HTML holds one module script
`import {PageBootstrap} from <runtime>; await new PageBootstrap({config, resources}).run();`;
`config` = `{pageId, mainUrl, sourceUrl, closeUrl, rootId}`, `resources` =
`{css: [url], js: [{url, group}]}`; both Hosts write the same compact JSON. No `<link>`
in the HTML: `PageBootstrap` writes the CSS links in the browser (030).

JS Host exposes `openPage`, `main`, `source` and `closePage`; adapters own HTTP
translation and identity extraction. FileHost loads JS
pages and their same-name files. Reusable Node/Bun bridges and bounded ASGI/Uvicorn, FastAPI, Flask and
Kajenn adapters now exist in owning projects; these are local development
implementations delivered as GitHub archives, without production certification.
*0.2.0:* adapters verified on the minimal contract: `gramlot-uvicorn` (Python ASGI/Uvicorn), `gramlot-js-server` (Node.js, Bun), `@gramlot/gramlot-serverless` in `gramlot-js-server` (standalone, Worker); `gramlot-django`, `-fastapi`, `-flask`, `-kajenn` deferred to after 0.2.0. Each passes the mount prefix to `open_page` and serves the companions (030); the two server adapters send the configured CSP header (035); the standalone export writes a hash policy (025).

HTTP browser disposal sends a best-effort close request; non-persisted `pagehide`
sends a JSON beacon, while back/forward-cache pages stay active. Adapters supply
owner identity, Host checks it, and TTL handles lost delivery. Worker disposal
remains local.

Next: [Writing pages](095-writing-pages.md).


The generic `genro-builders-js` owns authoring and static HTML/SVG rendering.
Gramlot owns its live renderer; `genro-dom-js` is no longer a dependency.
`Gramlot.startSource(wire)` can mount an already-authored typed Source through the
same renderer; it does not execute a Page. Standalone Page execution uses the Worker
host described below, not a build-time compiler.

Hosts obtain browser code from packaged assets (`gramlot.server.runtime_asset`
in Python; `@gramlot/gramlot/runtime` in JS, from npm, JSR or the repository's `js/`). See the
installation contexts below; adapters serve the assets of their installed package.
`PageNotFound`, `SourceNotFound`, `PageExpired` and `HostCapacity`, in Python and JS, distinguish
framework failures from unexpected application exceptions. Declared dependency
sources install freshly; Gramlot 0.1.0 is owner-accepted for GitHub archive delivery.


<a id="gc-090-022"></a>

## 022 · Published package and local development names

The core is published as `@gramlot/gramlot` on npm (`npm install @gramlot/gramlot`)
and on JSR (`npx jsr add @gramlot/gramlot`). Application imports use that name:

```javascript
import {Page as BasePage, source} from '@gramlot/gramlot/page';
```

| Installation | Core name used in imports | Scope |
| --- | --- | --- |
| npm (`npm install`) or JSR (`jsr add`) | `@gramlot/gramlot` | Published registry package, from 0.2.1 |
| Repository examples (`file:../js`) | `@gramlot/gramlot` | The repository's `js/package.json`, same name |
| JSR `@genro/gramlot` 0.1.0–0.2.0 | `@genro/gramlot` | Earlier JSR name, archived |
| Original GitHub 0.1.0 archives | Follow the archive README and package manifest | Frozen archive delivery, separate from JSR |

The [JSR installation documentation](https://jsr.io/docs/npm-compatibility)
explains how its CLI installs the public import name through npm compatibility.
The repository's local package name is not automatically provided by that install.
The names above identify different installation contexts; do not mix them within
one application's core dependency graph.

The standalone examples below explicitly use the local development installation:
matching core and standalone packages, as configured by the repository examples.
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

A dedicated browser Worker hosts one JavaScript Page. `WorkerHost` inherits `Host`
and reuses its page registration, `main`, explicitly marked Source methods, typed
serialization, fresh instance per call, expiry and error rules. There is no separate
standalone Page compiler. Python pages execute on Python servers only.

For the local development installation described above, use the browser-safe
Page entry for pages shared by Node, Bun and standalone:

```javascript
import {Page as BasePage, source} from '@gramlot/gramlot/page';

export class Page extends BasePage {
    main(root) { root.section(null, {id: 'details'}).p('Hello'); }
    details(root, {name}) { root.p(name); }
}
source(Page.prototype.details);
```

The Worker entry belongs to the `@gramlot/gramlot-serverless` host configuration. This
development boundary requires the matching core with the browser-safe `/host`
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
The returned Gramlot instance uses its ordinary `remoteSource` and live Source APIs.
`app.dispose()` terminates its dedicated Worker and rejects outstanding requests.
An optional mount `signal` cancels startup. A cancelled remote request drops its
reply; it does not interrupt JavaScript already executing inside the host.

Current scope: one Page per Worker, HTML Source, Source live, declared `Page.css`, no database.
*0.2.0:* Data binding runs in the window; the Worker builds the Source. Node-only imports cannot run in Worker. Current packaged Worker
passes in Chromium; an earlier local file check passed in Playwright WebKit.
WebKit is not Safari. Safari and Firefox remain unverified.
*0.2.0:* `Page.css` stays on every host path; `css_requires`/`js_requires` need a
Host with a resource system (030); the WorkerHost is server side: it compiles no
code and never runs the companion.

Export shape (0.2.0), `@gramlot/gramlot-serverless`: one HTML file. The Worker script holds
the Page and `WorkerHost`, without the inline compiler (`binding/inline.js` is not in
its bundle). The companion `foo_aux.js` is a separate bundle that runs in the window
only, through a blob URL that replaces its `_aux` URL, resource order kept. The CSP is
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
and served at their declared paths. The runner directory opens through `file://`
(Blob Workers, explicit export root for local stylesheets). Dependencies:
`@gramlot/gramlot >=0.2.1`, `@genrojs/builders >=0.4.1`, Node 22+; commands are in
its repository.

The published 0.1.0 archive retains `@gramlot/standalone` and its
`gramlot-standalone` command; use its bundled README for that immutable release.
Generic Python ASGI/Uvicorn hosting belongs to `gramlot-uvicorn`. `gramlot-kajenn`
depends only on Kajenn besides the core (11.48 item 5); its adapter is not migrated yet,
deferred to after 0.2.0. The retired `gramlot-minimal` repository is historical; heirs
`gramlot-uvicorn` and `gramlot-serverless`, which joined `gramlot-js-server` on
2026-10-01 as `@gramlot/gramlot-browser`, renamed `@gramlot/gramlot-serverless` on 2026-10-02 (0.2.2).


<a id="gc-090-030"></a>

## 030 · Page resources and file layout (0.2.0)

0.2.0 behavior.
`Page.css`: list of URLs as in `<link href>`, in the core for every host. `/…` gets
the mount prefix once; `theme.css`, `https://…`, `//…` stay as written.

Page files: `FileHost` serves one pages folder. Path `orders` → file page
`orders.py` (`orders.js` for JS) first, then folder page `orders/orders.py`; both →
the file wins, no error. Segments: letters, digits, `_`, `-`. A real path leaving
the pages folder is rejected. Same-name files beside the file page or in its
folder: `orders.css` (stylesheet), `orders_aux.js` (auxiliary JS module exporting
`Logic`), `orders.md` (README). `_aux` is reserved: `orders_aux.js` is never a page,
no page is `*_aux`. Python and JS pages may share a folder: `orders.js` is a JS
page; the logic of `orders.py` is in `orders_aux.js`.

Load order: `Page.css` as written, then `orders.css` and `orders_aux.js`. A repeated
URL loads once, in its last position. One JS URL with two different groups = error.

Resource fields: Python `css_requires = ""`/`js_requires = ""`; JS
`static css_requires = ''`/`static js_requires = ''`. Names are interpreted by a
Host with a resource system (gramlot-kajenn); on `FileHost` any name raises
`InvalidResourceName` ("requires need a Host with a resource system"). Core parser,
same in both languages: empty/missing = none; `,` separator, spaces ignored; empty
tokens and duplicates ignored (first position kept); `/` separates subfolders,
segments `^[A-Za-z0-9_-]+$`, no `.`, `..`, leading/trailing `/` or extensions; `:`
(`name:media`) = error.

The companion is public (served to the browser); server-only logic lives in
modules it does not import.

Companion rule of the adapters (the `FileHost.url` rule): GET/HEAD answer only `.css`
and `_aux.js` files whose real path is inside the pages folder; other files 404, other
methods 405. `Page.css` URLs outside the pages folder stay application assets.

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
`content_security_policy` in `gramlot-uvicorn`, `contentSecurityPolicy` in
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

Inline code runs only as received with the Source. `Gramlot.prepareSource` activates
the inline code of the received Source (`main` from the host, a remote Source, a
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
