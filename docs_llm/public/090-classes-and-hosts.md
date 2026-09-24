# Classes, repository and server adapters

Document ID: **GC-090**. Native 0.1.0 APIs; future capabilities remain explicitly deferred.

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

<a id="gc-090-015"></a>

## 015 · Classes you work with

JavaScript pages must extend `Page` in hosted and standalone execution.
`Page.css` is an array; standalone currently requires it to be empty.

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

<a id="gc-090-020"></a>

## 020 · What a server adapter connects

Python routes bootstrap to `open_page(path, owner=...)`, main to
`main(page_id, owner=...)`, and remote Source to
`source(page_id, method, params, owner=...)`; it serves `runtime_url`, supplies
authenticated owner identity and maps failures. `PageExpired` means expired,
unknown or unowned ID. Host starts no server: its bounded registry is process-local
and IDs are not credentials. `/` maps to `index.py`, `/catalog` to `catalog.py`;
each exports `Page`. Every call creates fresh page/builder state.

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
in Python; `@gramlot/native-html/runtime` in JS), never from a sibling checkout.
Python `PageNotFound`, `SourceNotFound`, `PageExpired` and `HostCapacity` distinguish
framework failures from unexpected application exceptions. Declared dependency
sources install freshly; Gramlot 0.1.0 is owner-accepted for GitHub archive delivery.


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
Data binding. Node-only imports cannot run in Worker. Current packaged Worker
passes in Chromium; an earlier local file check passed in Playwright WebKit.
WebKit is not Safari. Safari and Firefox remain unverified.

The standalone repository now supplies a Node/npm exporter, `@gramlot/standalone`:

```sh
gramlot-standalone build js/pages/index.js -o dist/app.html
```

It bundles the Page without executing it and generates the complete HTML through
HtmlBuilder. Python's old standalone compiler/provider has been removed. The
exported file is locally verified on Chrome and Playwright WebKit; these packages
are delivered as GitHub archives; no npm registry release is claimed.
