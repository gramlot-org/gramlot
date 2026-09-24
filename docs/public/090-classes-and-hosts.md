# Classes, repository and server adapters

Document ID: **GC-090**. Native 0.1.0 APIs; future capabilities remain explicitly deferred.

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

<a id="gc-090-015"></a>

## 015 · Classes you work with

JavaScript pages must extend `Page` in hosted and standalone execution.
`Page.css` is an array; standalone currently requires it to be empty.

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
| JS `MainTransport` | Main and remote Source requests | Runtime transport |
| JS `Host`, `Page`, `FileHost` | Equivalent server-side authoring and host boundary | Node/Bun adapter implementations |

`SourceBag`, typed serialization and generic grammar/rendering belong to dependency
libraries. Page code builds Source; it does not construct DOM. Data roots exist,
but bindings, controllers and resolvers are not yet implemented in this slice.

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

The JS Host provides `openPage`, `main`, `source` and `closePage`; HTTP
`Request`/`Response` translation belongs to the adapter. `FileHost` resolves JS page modules. Reusable Node and Bun bridges now live in `gramlot-nodejs/native` and
`gramlot-nodejs/bun`. Bounded Python integrations live in FastAPI, Flask and Genro
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
in Python; `@gramlot/native-html/runtime` in JS), never from a sibling checkout.
Python `PageNotFound`, `SourceNotFound`, `PageExpired` and `HostCapacity` distinguish
framework failures from unexpected application exceptions. The current dependency
sources are available through the declared installation paths; Gramlot 0.1.0 itself
is owner-accepted for GitHub archive delivery.


<a id="gc-090-025"></a>

## 025 · JavaScript standalone host

A dedicated browser Worker hosts one JavaScript Page. `WorkerHost` inherits `Host`
and reuses its page registration, `main`, explicitly marked Source methods, typed
serialization, fresh instance per call, expiry and error rules. There is no separate
standalone Page compiler. Python pages execute on Python servers only.

Use the browser-safe Page entry for pages shared by Node, Bun and standalone:

```javascript
import {Page as BasePage, source} from '@gramlot/native-html/page';

export class Page extends BasePage {
    main(root) { root.section(null, {id: 'details'}).p('Hello'); }
    details(root, {name}) { root.p(name); }
}
source(Page.prototype.details);
```

The Worker entry belongs to the host configuration:

```javascript
import {WorkerHost} from '@gramlot/native-html/worker-host';
import {Page} from './page.js';
new WorkerHost(Page);
```

Bundle this entry and its imports into a classic Worker script. The browser runtime
starts it with `await mount({workerUrl})` from `@gramlot/native-html/standalone`.
The document must already contain `gramlot-root`, or pass an explicit `element`.
`mount` opens the Page, prepares Gramlot roots/subscriptions, then requests `main`.
The returned Gramlot instance uses its ordinary `remoteSource` and live Source APIs.
`app.dispose()` terminates its dedicated Worker and rejects outstanding requests.
An optional mount `signal` cancels startup. A cancelled remote request drops its
reply; it does not interrupt JavaScript already executing inside the host.

Current scope: one Page, native HTML, Source live, empty `Page.css`, no database or
Data binding. Node-only imports cannot run in the Worker. The current packaged
Worker profile passes in Chromium; an earlier local file check also passed in
Playwright WebKit. WebKit is not Safari. Safari and Firefox remain unverified.

The standalone repository now supplies a Node/npm exporter, `@gramlot/standalone`:

```sh
gramlot-standalone build js/pages/index.js -o dist/app.html
```

It bundles the Page without executing it and generates the complete HTML through
HtmlBuilder. Python's old standalone compiler/provider has been removed. The
exported file is locally verified on Chrome and Playwright WebKit; these packages
are delivered as GitHub archives; no npm registry release is claimed.
