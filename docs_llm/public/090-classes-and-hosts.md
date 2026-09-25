# Classes, repository and server adapters

Document ID: **GC-090**. Native 0.1.2 APIs; planned 0.2.0 changes are marked.

> **Release status.** Describes **0.2.0 (HTML/SVG data binding), in development**:
> an approved plan, not yet implemented, tested or released. Latest published
> release: **0.1.2**. Unmarked text is 0.1.2; section 030 is planned 0.2.0 only.

<a id="gc-090-005"></a>

## 005 · Reading this first draft

Implemented and owner-accepted native HTML 0.1.0 foundation. The Python wheel and
declared GitHub JS dependencies install in fresh environments; seven local
packaged Host profiles pass in Chromium. Richer PoC behavior is not core evidence.

<a id="gc-090-010"></a>

## 010 · A small repository

`src/gramlot`: page/ owns Page/builder/Source, server/ owns Host, db/ is reserved; collections/ holds exported grammars; resources/ holds runtime bundles. `js/src`: browser/JS authoring adapters, builder, renderer, view, references.js,
transport.js and bootstrap. `tests`/`js/tests`: contracts and fixtures. `docs/public`:
manual; `docs/internal`: working decisions; `docs_llm`: concise mirrors; `ports`:
bounded reviews. Generic Bag/builders live separately; `build` is generated output.
This tree does not imply a component inventory.
*0.2.0:* planned `js/src/binding/`, `js/src/bootstrap.js`, `js/src/adapters/resources.js`,
`src/gramlot/server/resources.py` and grammar `src/gramlot/collections/binding.json`.

<a id="gc-090-015"></a>

## 015 · Classes you work with

JavaScript pages must extend `Page` in hosted and standalone execution.
`Page.css` is an array of stylesheet URLs. Standalone loads them before starting
the Page and releases its stylesheet links on disposal.
*0.2.0:* `css_requires` replaces `Page.css` without alias; Python and JS pages
declare `css_requires`/`js_requires` name strings (030).

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
| JS `MainTransport` | Main and remote requests |
| JS `Host`/`Page`/`FileHost` | Node/Bun server boundary and file loading |

Dependency libraries own SourceBag, typed serialization and generic grammar/rendering. Pages
author Source, never DOM. Data roots exist; bindings/controllers/resolvers do not.
*0.2.0:* bindings and controllers enter, resolvers stay deferred; `Gramlot` gains
`getBaseSourceNode`/`getDomNode` and per-instance logic groups in `app.logic`
([GC-095 060](095-writing-pages.md)); binding classes stay internal.

<a id="gc-090-017"></a>

## 017 · Python and JavaScript Host boundaries

Python Host and JS Host/FileHost have the same execution responsibility, not an
identical language-level API. Both create a fresh Page and builder for each main
or remote Source request; module loading is a separate lifecycle.

| Aspect | Python Host | JavaScript Host / FileHost |
| --- | --- | --- |
| Named Source parameters | Passed as keyword arguments: `details(root, name=...)` | Passed as one object: `details(root, {name})` |
| Omitted parameters | Empty dictionary | Empty object |
| Explicit `None` / `null` | `None` is treated as empty parameters | `null` is rejected with `TypeError` |
| Missing exposed Source method | `SourceNotFound` | `PageNotFound` |
| Page module loading | Default file loader executes the module on each page opening | FileHost uses cached ESM imports; no live reload |

Valid named parameters produce the same Source result in the bounded comparison.
The error classes and explicit-null behavior are current differences, not a promise
of cross-language interchangeability. Module caching does not reuse Page instances
between Source requests. Custom page resolution belongs to the host integration;
the filesystem comparison above does not describe Minimal's bundled Worker loader.


<a id="gc-090-020"></a>

## 020 · What a server adapter connects

Python routes bootstrap to `open_page(path, owner=...)`, main to
`main(page_id, owner=...)`, and remote Source to
`source(page_id, method, params, owner=...)`; it serves `runtime_url`, supplies
authenticated owner identity and maps failures. `PageExpired` means expired,
unknown or unowned ID. Host starts no server: its bounded registry is process-local
and IDs are not credentials. `/` maps to `index.py`, `/catalog` to `catalog.py`;
each exports `Page`. Every main or remote Source request creates fresh page/builder state.
*0.2.0:* `a/b` → `pages/a/b.py` or `pages/a/b/b.py`, both = error (030);
`open_page` adds a nonce distinct from the page ID.

JS Host exposes `openPage`, `main`, `source` and `closePage`; adapters own HTTP
translation and identity extraction. FileHost loads JS
pages. Reusable Node/Bun bridges and bounded ASGI/Uvicorn, FastAPI, Flask and
Kajenn adapters now exist in owning projects; these are local development
implementations delivered as GitHub archives, without production certification.

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
in Python; `@genro/gramlot/runtime` after JSR installation, or
`@gramlot/native-html/runtime` for the local development package in JS). See the
installation contexts below; adapters serve the assets of their installed package.
Python `PageNotFound`, `SourceNotFound`, `PageExpired` and `HostCapacity` distinguish
framework failures from unexpected application exceptions. Declared dependency
sources install freshly; Gramlot 0.1.0 is owner-accepted for GitHub archive delivery.


<a id="gc-090-022"></a>

## 022 · Published package and local development names

The public JSR package is `@genro/gramlot`. After installing it with
`npx jsr add @genro/gramlot`, use its public name in application imports:

```javascript
import {Page as BasePage, source} from '@genro/gramlot/page';
```

| Installation | Core name used in imports | Scope |
| --- | --- | --- |
| JSR via `jsr add` | `@genro/gramlot` | Published registry package |
| Repository examples (`file:../js`) | `@gramlot/native-html` | Local development package declared in `js/package.json` |
| Original GitHub 0.1.0 archives | Follow the archive README and package manifest | Frozen archive delivery, separate from JSR |

The [JSR installation documentation](https://jsr.io/docs/npm-compatibility)
explains how its CLI installs the public import name through npm compatibility.
The repository's local package name is not automatically provided by that install.
The names above identify different installation contexts; do not mix them within
one application's core dependency graph.

The standalone examples below explicitly use the local development installation:
matching core and `@gramlot/minimal` packages, as configured by the repository
examples. Minimal now owns standalone startup and Worker integration. This new
boundary is not supplied by installing the published JSR 0.1.0 package alone;
unchanged GitHub archives also retain their original boundary. No package rename
or compatibility alias is introduced by this guide.


<a id="gc-090-025"></a>

## 025 · JavaScript standalone host

A dedicated browser Worker hosts one JavaScript Page. `WorkerHost` inherits `Host`
and reuses its page registration, `main`, explicitly marked Source methods, typed
serialization, fresh instance per call, expiry and error rules. There is no separate
standalone Page compiler. Python pages execute on Python servers only.

For the local development installation described above, use the browser-safe
Page entry for pages shared by Node, Bun and standalone:

```javascript
import {Page as BasePage, source} from '@gramlot/native-html/page';

export class Page extends BasePage {
    main(root) { root.section(null, {id: 'details'}).p('Hello'); }
    details(root, {name}) { root.p(name); }
}
source(Page.prototype.details);
```

The Worker entry belongs to Minimal host configuration. This development boundary
requires the matching core with the browser-safe `/host` export; unchanged 0.1.0
archives do not provide it:

```javascript
import {WorkerHost} from '@gramlot/minimal/worker-host';
import {Page} from './page.js';
new WorkerHost(Page);
```

Bundle this entry and its imports into a classic Worker script. The browser runtime
starts it with `await mount({workerUrl})` from `@gramlot/minimal/standalone`.
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

Current scope: one Page per Worker, native HTML, Source live, declared `Page.css`, no database or
Data binding. Node-only imports cannot run in Worker. Current packaged Worker
passes in Chromium; an earlier local file check passed in Playwright WebKit.
WebKit is not Safari. Safari and Firefox remain unverified.
*0.2.0:* all host paths, Minimal included, move to `css_requires`/`js_requires`;
the companion loads in the window, never in the WorkerHost, which compiles no code
(server side). Standalone uses a hash instead of a nonce.

The minimal integration repository supplies a Node/npm exporter, `@gramlot/minimal`,
for its browser standalone profile (development naming after 0.1.0):

```sh
gramlot-minimal build js/pages/index.js -o dist/app.html
```

It bundles the Page without executing it and generates the complete HTML through
HtmlBuilder. Python's old standalone compiler/provider has been removed. The
exported file is locally verified on Chrome and Playwright WebKit; these packages
are delivered as GitHub archives; no npm registry release is claimed.

The development Minimal integration also exports a static directory containing
multiple documents, each with its own Worker. `Page.css` URLs are loaded before
`main` runs; assets must be included by the exporter and served at their declared
paths. The examples runner directory opens directly through `file://`: relative
classic scripts start Blob Workers, and an explicit export root resolves local
stylesheets. A server is not required.

The published 0.1.0 archive retains `@gramlot/standalone` and its
`gramlot-standalone` command; use its bundled README for that immutable release.
The minimal integration also owns generic Python ASGI/Uvicorn hosting. Kajenn
extends that integration in its own repository.


<a id="gc-090-030"></a>

## 030 · Page resources and file layout (0.2.0)

Planned 0.2.0 behavior. Python `css_requires = ""`/`js_requires = ""`; JS
`static css_requires = ''`/`static js_requires = ''`. Authors write names only
(`"business,gui"`); the framework adds extensions, paths, tags and nonce.
Parsing: empty/missing = none; `,` separator, spaces ignored; empty tokens and
duplicates ignored (first position kept); `/` separates subfolders, segments
`^[A-Za-z0-9_-]+$`, no `.`, `..`, leading/trailing `/` or extensions; `:`
(`name:media`) = error.

Lookup per name: page folder, then `_resources` folders up to the application root;
all levels kept. Load order: generic → specific, names in string order. JS: last
registration (most specific) wins; CSS: all load, cascade favours specific. The
folder hierarchy belongs to the adapter/integration; default is page folder plus
`_resources` above it.

Page files: `pages/orders.py`, or `pages/orders/orders.py` when it has own files;
both = error. Companion = same-name `orders.js`/`orders.css` in the page folder,
both forms, loaded after all requires. JS pages (Node/Bun) live in a folder separate
from Python pages; a JS page file (`orders.js`) exports `Page` (host builds Source)
and `Logic` (browser), so it must import in both environments, without server-only
imports. The companion is public (served to the browser); server-only
logic lives in modules it does not import.

Bootstrap: CSS links in order; import all JS modules; create `Gramlot`; register each
module's `Logic` in received order; start. Import failure or page close before start
mounts nothing. Bootstrap scripts carry a nonce separate from the page ID, placed by
the adapter in the CSP header; standalone uses a hash. CSP profiles for named and
inline logic are still to be confirmed.
