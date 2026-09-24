# 065 · Shared Python and JavaScript host foundations

Document ID: **GC-065**.

**Current 0.1.0 boundary:** neutral JavaScript Host runs Page/main/source/close, while the Node/Bun adapter owns HTTP parsing and routing. Recipes in sections below describe the 2026-09-19 increment and are deferred. Use [GC-110](110-native-html-readiness.md#gc-110-020) for current release gates.

[Concise counterpart](../../docs_llm/internal/065-host-adapters.md).

<a id="gc-065-005"></a>

## 005 · Scope and status

The owner requested matching Python and JavaScript host foundations, including
the base class inherited by pages, on 2026-09-19. Python remains the primary
application-authoring language. JavaScript pages are supported by the corresponding
host without changing the browser's Source protocol.

This development increment is implemented and locally tested, not consolidated
into main or released. See [PORT-0002](../../ports/PORT-0002-host-foundations/README.md).
The initial dependency pin used old genro-bag-js 0.4.0. On 2026-09-19, checking
current official releases identified v0.7.1 as the latest stable release. Its
nested-backref behavior passes the isolated contract test; the provisional builder workaround has been removed. The subsequent owner
decision removes first-party pins: Git dependencies follow upstream default
branches, package dependencies have no version bounds. Exact versions above
record test evidence, not permanent dependency constraints.

<a id="gc-065-010"></a>

## 010 · Historical repository layout and current ownership

```text
src/gramlot/
  page/
    base.py           Page base, main(root) and explicit @source methods
    builder.py        GramlotBuilder and typed SourceBag authoring
  server/host.py      Path loader, registry, bootstrap, main and Source calls
  db/                 Reserved database contract area
  collections/html5.json Exported HTML5 grammar
js/src/
  adapters/
    page.js           Server-side Page base
    host.js           Neutral Host, without HTTP routing
    file-host.js      Optional filesystem loader for Node.js and Bun
    index.js          Server imports, separate from browser entry point
  references.js      Mounted Source/DOM references
  builder/            GramlotBuilder authoring dialect
  renderer/           GramlotRenderer (the former DOM JS phrase was superseded)
  transport.js       Browser main/remote transport
  gramlot.js          Browser bootstrap coordinator
```

Server Page is not a browser view component. Host has no Node HTTP or Bun server
dependency. FileHost uses filesystem/path/URL APIs available in both runtimes;
its module is imported explicitly. The browser entry point imports neither host
module. Concrete production server integrations remain owned by their adapter
projects. The small HTTP bridges in tests are verification fixtures only.

<a id="gc-065-015"></a>

## 015 · Shared page and bootstrap contract

1. Resolve a URL path to a trusted page module and its Page subclass.
2. Read class metadata: title and CSS URLs. Allocate a page ID and an expiring,
   owner-associated registry entry.
3. Return HTML containing the host element (default gramlot-root), runtime module
   import and Gramlot configuration. Do not invoke main during this request.
4. The browser prepares its Data root and Source subscriber, then calls main.
5. Instantiate a fresh page and builder, supply page identity, and invoke main(root).
   Explicit public Python `@source` methods use the same fresh pipeline for remote
   fragments. Both synchronous and asynchronous implementations work; an unmarked
   override hides an inherited exposure.
6. Insert the typed SourceBag under Source.main or the remote destination. The subscriber initiates live rendering. Named recipe expansion belonged to an earlier increment and is deferred from 0.1.0.

Python imports `Page` from `gramlot` or `gramlot.page`. JS server modules import
`Page` from `js/src/adapters/index.js` and export their subclass as named `Page`.
Python declares `root.div('homer', id='panel')`; JS declares
`root.div('homer', {id: 'panel'})`. Both authoring facades produce native SourceBag nodes, preserving node tags and
scalar values through registered TYTX transport. Mixed prefix text uses `_text`;
there is no ordinary-Bag snapshot or hydration boundary. No CSS shorthand translation is included.

The JS Host operations are `openPage(path, {owner})`, `main(pageId, {owner})`,
`source(pageId, method, params, {owner})` and `closePage(pageId, {owner})`.
Python uses `open_page`, `main`, `source` and `close_page`, with keyword `owner`.
These are corresponding responsibilities, not identical parameter/error contracts;
see [GC-090 §017](../public/090-classes-and-hosts.md#gc-090-017). A host subclass
can replace page resolution. FileHost maps `/` to `index.js` and `/a/b` to
`a/b.js`, confines real paths to the page directory and uses ordinary ESM imports.
ESM caching applies; live reload is not implemented. Python's default loader
executes the `.py` module on each page opening. Package-specific resolution belongs in a host subclass.

<a id="gc-065-020"></a>

## 020 · HTTP boundary and runtime choice

The Node/Bun adapter dispatcher accepts a standard Request and returns a Response; neutral JS Host has no `fetch` method. GET opens a
page; POST to `/gramlot/main` accepts JSON `{pageId}` and returns TYTX JSON.
Malformed requests, missing pages and exhausted capacity receive explicit status
responses. Unexpected application exceptions propagate to the concrete adapter.
Assets are served by that adapter, not by arbitrary paths inside Host.

Node's fixture converts node:http requests/responses at this boundary. Bun's
fixture passes requests directly from Bun.serve. This follows Bun's documented
[Request/Response server interface](https://bun.com/docs/runtime/http/server),
while retaining one framework implementation. No performance superiority is claimed.

Registries are bounded and expiring, in memory and process-local. Page IDs are
not authentication. Concrete integrations supply a stable owner through
ownerForRequest (JS) or the owner argument (Python); the fixtures use anonymous
access. Production authentication, shared registries, workers, static asset
policy, TLS and deployment are outside this increment.

<a id="gc-065-025"></a>

## 025 · Historical verification and current check entry points

Verified locally with Node v23.11.0, Bun 1.3.14 and Python 3.12:

- Five host contract tests pass under both JS runtimes: actual module loading,
  async/sync pages, identity, expiration/capacity, path confinement, request
  validation, escaping and cross-language JS-to-Python TYTX decoding.
- Four Python foundation tests pass after moving Page into the adapter layer.
- Chromium bootstrap/main/DOM checks pass with node:http and native Bun.serve;
  the same fixture exercises nested mutations and disposal with no page errors.
  These checks were repeated with Bag v0.7.1 and no builder workaround.

The counts above describe the 2026-09-19 increment, not the current release.
For current setup and tests use [GC-085](085-operating-guide.md#gc-085-025);
for the versioned seven-profile evidence use [GC-130](130-release-ecosystem-review.md#gc-130-025).
No database, bindings, application controller API or CSS shorthand is included.

`scripts/verify_native_html_browser.mjs` takes a runtime executable, an installed
Playwright entry, a Chromium executable and `python` or `js`. JavaScript checks
require `GRAMLOT_TEST_URL` from a running Node/Bun adapter; the script does not
start a JavaScript host. With no external URL, Python uses its local test fixture.
Use the matching native-HTML fixture page, not an arbitrary application or the
simpler Hello World page; each browser checker asserts its fixture's content.
These are verification commands, not application launch or deployment commands.


Python host imports use `from gramlot.server import Host`; public page imports remain `from gramlot import Page`. Internal pre-release adapters/model/root-builder paths have been replaced by server/page ownership.
