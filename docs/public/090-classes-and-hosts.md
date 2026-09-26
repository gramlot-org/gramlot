# Classes, repository and server adapters

Document ID: **GC-090**. Native 0.1.2 APIs; planned 0.2.0 changes are marked.

> **Release status.** This page describes Gramlot **0.2.0 (HTML/SVG data
> binding), in development**. 0.2.0 is an approved plan: its code is not yet
> implemented, tested or released. The latest published release is **0.1.2**.
> Text without a *0.2.0* mark describes 0.1.2 behavior. Section 030 describes
> planned 0.2.0 behavior only.

<a id="gc-090-005"></a>

## 005 · Reading this first draft

This is the user-facing map of the native HTML foundation in this development
checkout. It describes the owner-accepted native 0.1.0 classes. The Python
wheel and declared GitHub JS dependencies install in fresh environments; seven
locally packaged Host profiles pass in Chromium. Richer examples in gramlot-poc
use an experimental runtime and do not establish features in this core.

<a id="gc-090-010"></a>

## 010 · A small repository

```text
src/gramlot/          Python page authoring and neutral host contracts
  page/              Page, GramlotBuilder and Source authoring
  server/            Neutral Host and page loading
  db/                Reserved database contracts
  collections/       Exported builder_grammar collections
  resources/         Generated browser bundles and notices
js/src/              Browser runtime and JavaScript authoring
  adapters/          JS host contracts and filesystem page loading
  builder/           Gramlot authoring dialect
  renderer/          Source events and DOM lifetime
  view/              Native HTML element handling
  references.js      Mounted Source/DOM references
  transport.js       Main and remote Source transport
tests/, js/tests/    Contract tests and small host fixtures
docs/public/         This user manual
docs/internal/       Contributor operations and working decisions
docs_llm/            Concise mirrors
ports/               Bounded transfer and review records
```

These are existing folders, not a proposed component inventory. Generic Bag and
builder implementations live in their own libraries. `build/` contains generated
assets and documentation; it is not an application source directory.

*0.2.0:* the plan adds `js/src/builder/source.js` (`GramlotBuilderBag` and
`GramlotBuilderBagNode`), `js/src/binding/` (Data routing, installation, formulas
and controllers, named logic, inline code), `js/src/bootstrap.js`,
`js/src/adapters/resources.js`, `src/gramlot/server/resources.py` and the
data-element grammar `src/gramlot/collections/binding.json`.

<a id="gc-090-015"></a>

## 015 · Classes you work with

JavaScript pages must extend `Page` in hosted and standalone execution.
`Page.css` is an array of stylesheet URLs. Standalone loads them before starting
the Page and releases its stylesheet links on disposal.

*0.2.0:* `Page.css` is replaced by `css_requires`, without alias. Python and
JavaScript pages declare `css_requires` and `js_requires` as comma-separated
strings of resource names (section 030).

Rendering requires `SourceBag` and `SourceBagNode`, associated with their builder.
Their methods are part of the contract. Plain Bags are valid for Data, not Source;
`attr.tag` is not an alternative to `nodeTag`. Invalid Source is rejected, not converted.

| Class or API | Responsibility | Where you use it |
| --- | --- | --- |
| Python `Page` | Declares metadata, `main(root)` and exposed Source methods | Subclass for an application page |
| Python `Host` | Resolves page files, allocates page IDs, returns bootstrap HTML and Source | Used or specialized by a server adapter |
| `GramlotBuilder` in Python/JS | Authors the Gramlot dialect over Python `BuilderBase` / JS `HtmlBuilder` with loaded collections | Page roots are backed by it |
| JS `Gramlot` | Prepares Data/Source roots and coordinates main and remote responses | Browser runtime bootstrap |
| JS `GramlotRenderer` | Extends generic `RendererBase`; owns live DOM and application references | Framework runtime |
| *0.2.0:* JS `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Replace `GramlotRenderer`; extend Builder `HtmlRenderer` and `SvgRenderer`, inheriting their attribute and style adaptation; own live DOM and application references | Framework runtime |
| *0.2.0:* Python `GramlotHtmlRenderer`, `GramlotSvgRenderer` | Render a Gramlot Source to static HTML/SVG with the same attribute and style rules as JS | Static pages, pre-rendering |
| JS `MainTransport` | Main and remote Source requests | Runtime transport |
| JS `Host`, `Page`, `FileHost` | Same execution role; language-specific contracts below | Node/Bun adapter implementations |

`SourceBag`, typed serialization and generic grammar/rendering belong to dependency
libraries. Page code builds Source; it does not construct DOM. Data roots exist,
but bindings, controllers and resolvers are not yet implemented in this slice.

*0.2.0:* bindings and controllers enter with 0.2.0; resolvers stay deferred.
`Gramlot` gains `getBaseSourceNode(domNode)` and `getDomNode(sourceNode)`, and
each instance owns its named logic groups in `app.logic`
([Writing pages](095-writing-pages.md)). In the browser, Source is built from
`GramlotBuilderBag` and `GramlotBuilderBagNode`, which extend `SourceBag` and
`SourceBagNode`. They provide `PUT`, `FIRE`, `FIRE_AFTER` and the variable
datapath; Builder and Bag are not modified. Python authoring does not need them.
The other planned binding classes are internal to the runtime.

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

The Python adapter calls `await host.open_page(path, owner=identity)` and returns
its `.html`. Later it routes the configured main endpoint to
`await host.main(page_id, owner=identity)` and the remote Source endpoint to
`await host.source(page_id, method, params, owner=identity)`. It serves the JS bundle
at `runtime_url`, connects authentication to `owner`, and maps failures to HTTP
responses. `PageExpired` covers expired, unknown or unowned page IDs.

JavaScript follows the same division: the shared Node/Bun adapter translates HTTP
requests into `host.openPage`, `host.main`, `host.source` and `host.closePage`, extracts request identity
through its `ownerForRequest(request)` option, and maps errors to HTTP responses.
The neutral JS Host has no `fetch` or request-identity callback. WorkerHost invokes
the same page methods through messages, without HTTP handling.

The neutral Host does not start a server. Its registry is process-local, bounded
and expiring; page IDs are not login credentials. Default Python resolution maps
`/` to `index.py`, and `/catalog` to `catalog.py`, under the configured pages
folder. Each module exports a `Page` subclass. Each main/source invocation uses a
fresh page and builder; instance fields are not persistent session state.

*0.2.0:* a page path `a/b` resolves to `pages/a/b.py` or `pages/a/b/b.py`; both
present is an error (section 030). `open_page` also generates a
nonce, distinct from the page ID.

The JS Host provides `openPage`, `main`, `source` and `closePage`; HTTP
`Request`/`Response` translation belongs to the adapter. `FileHost` resolves JS page modules. Reusable Node and Bun bridges now live in `gramlot-js-server/native` and
`gramlot-js-server/bun`. Bounded Python integrations live in FastAPI, Flask and Genro
ASGI adapter packages; generic ASGI and the Kajenn-specific wrapper are distinct.
These are development implementations with a local artifact verification gate,
not production-certified integrations; delivery uses GitHub archives.

For HTTP pages, explicit browser disposal sends a best-effort close request;
non-persisted `pagehide` sends a JSON beacon. A page retained in the browser's
back/forward cache stays registered. The adapter supplies request identity and
the neutral Host deletes only a page owned by it; TTL remains the fallback when
delivery fails. The Worker standalone host has a separate local lifecycle.

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
framework failures from unexpected application exceptions. The current dependency
sources are available through the declared installation paths; Gramlot 0.1.0 itself
is owner-accepted for GitHub archive delivery.


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
Data binding. Node-only imports cannot run in the Worker. The current packaged
Worker profile passes in Chromium; an earlier local file check also passed in
Playwright WebKit. WebKit is not Safari. Safari and Firefox remain unverified.

*0.2.0:* every host path, Minimal included, moves from `Page.css` to
`css_requires` and `js_requires`. The companion is loaded in the window and never
executed in the WorkerHost. The WorkerHost counts as server side: it compiles no
code. The standalone export uses a hash instead of a nonce.

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

This section describes planned 0.2.0 behavior.

**Resource fields.** Python pages declare `css_requires = ""` and
`js_requires = ""`; JavaScript pages declare `static css_requires = ''` and
`static js_requires = ''`. The author writes only names, for example
`js_requires = "business,gui"`. The framework adds extensions, paths, tags and the
nonce.

Parsing rules:

- an empty or missing field declares no resource;
- `,` separates names; spaces around a name are ignored;
- empty tokens and duplicates are ignored; a duplicate keeps its first position;
- `/` separates subfolders inside the resource folders, for example
  `frameplugin_menu/frameplugin_menu`. Each segment is non-empty and matches
  `^[A-Za-z0-9_-]+$`. `.`, `..`, a leading or trailing `/` and extensions are
  rejected;
- `:` is an error: `name:media` is outside 0.2.0.

**Lookup.** For each name, the resolver searches the page folder, then the
`_resources` folders up to the application root, and keeps every level found.
Loading goes the opposite way, from the most generic level to the page folder.
Names are processed in string order. For JavaScript the last registration wins,
so the most specific level wins. For CSS all files load, and the cascade favours
the most specific one. The concrete folder hierarchy belongs to the adapter or
environment integration; the default is the page folder plus the `_resources`
folders above it.

**Page files.** A page is `pages/orders.py`. When it has its own files, it is
`pages/orders/orders.py`. Both forms present is an error. The companion is the
file with the page's name in the page folder, `orders.js` and `orders.css`, for
both forms. The companion loads after all `js_requires` and `css_requires`
resources. JavaScript pages, for Node or Bun, live in a folder separate from the
Python pages. A JavaScript page file, such as `orders.js`, exports both `Page`,
used by the Node or Bun host to build the Source, and `Logic`, used in the
browser. The file must therefore import in both environments, without
server-only imports.

**Companion visibility.** The companion is served to the browser, so it is public.
Server-only logic, such as queries, keys and data access, belongs in separate
modules that the companion does not import.

**Bootstrap.** The bootstrap adds the CSS links in order, imports all JavaScript
modules, creates the `Gramlot` instance, registers each module's `Logic` class in
the received order, then starts the page. If an import fails or the page closes
before the start, nothing is mounted. The bootstrap scripts carry a nonce
generated separately from the page ID; the adapter puts it in the CSP header.
The standalone export uses a hash. The CSP profiles for named and inline logic
are still to be confirmed.
