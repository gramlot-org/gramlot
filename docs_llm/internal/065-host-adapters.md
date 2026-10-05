# 065 · Shared Python and JavaScript host foundations

Document ID: **GC-065**.

> **Naming (2026-10-02):** in the dated text of this document, "native" as the label of a release, profile, milestone, adapter, module, API or pages names the scope of the 0.1.0 milestone (no web components, no recipes). That label has no technical meaning; current documents do not use it ([GC-005 §030](../005-documentation-policy.md#gc-005-030)). "native" for browser controls, DOM events, HTML attributes, DOM operations, Bag events or platform APIs keeps its technical meaning. Dated text is not rewritten.

**Release scope:** latest published release **0.1.2**. Sections 005-025 describe 0.1.2. Section 030 records the 0.2.0 page resource and bootstrap changes. **The 0.2.0 parts are implemented on the development branch (S06, S07, S14), in qualification, not released.** Current contract: [GC-090 §030](../public/090-classes-and-hosts.md#gc-090-030).

**Current 0.1.2 boundary:** neutral JavaScript Host runs Page/main/source/close, while the Node/Bun adapter owns HTTP parsing and routing. Recipes in sections below describe the 2026-09-19 increment and are deferred. Use [GC-110](110-0-1-0-readiness.md#gc-110-020) for current release gates.

[Expanded counterpart](../../docs/internal/065-host-adapters.md).

<a id="gc-065-005"></a>

## 005 · Scope and status

Owner 2026-09-19 requested Python/JS host bases including Page bases, considering
Node and Bun. Python remains primary authoring. Implemented and locally verified;
not main-consolidated or released. PORT-0002 is pending acceptance. The initial 0.4.0 pin was stale. Updated to latest stable v0.7.1 on 2026-09-19;
nested-backref contract passes and the builder workaround has been removed.

<a id="gc-065-010"></a>

## 010 · Historical repository layout and current ownership

Python: page/base.py owns Page/@source; page/builder.py owns GramlotBuilder;
server/host.py owns Host main/Source. JS adapters/index.js exports Page, Host and
FileHost separately from the browser entry. Python loads its packaged HTML5 collection; JS inherits the generic HtmlBuilder
grammar. Both use registered generic SourceBags. Browser entry does not import server code.
Production engine integrations belong to adapter projects; test HTTP bridges are
not production servers. FileHost uses shared Node/Bun filesystem APIs.

<a id="gc-065-015"></a>

## 015 · Shared page and bootstrap contract

Path → trusted Page subclass → title/CSS → owner-associated expiring page ID →
bootstrap HTML. Browser prepares roots/subscriber before main. Main and explicit
Python @source methods create fresh page/builder instances. Typed Source inserts once and triggers live rendering. Recipe expansion is deferred.
An unmarked override hides inherited source exposure. Python Page imports from gramlot or gramlot.page; JS
from adapters/index.js. JS files export named Page. Python div('homer', id='panel')
corresponds to JS div('homer', {id:'panel'}). Python and JS serialize registered SourceBag roots directly through TYTX. HTML5 tags only, no CSS shorthand.
JS operations: openPage/main/source/closePage; Python open_page/main/source/close_page.
JS source receives `(pageId, method, params, {owner})`; Python receives
`(page_id, method, params, owner=...)`. Parameter/error differences are documented
in [GC-090 §017](../public/090-classes-and-hosts.md#gc-090-017). Override resolution
in subclasses. FileHost confines real paths, maps / to index.js, uses ESM caching;
no live reload. Python loader uses .py files.

<a id="gc-065-020"></a>

## 020 · HTTP boundary and runtime choice

The Node/Bun adapter dispatcher takes Web Request/Response; neutral Host has no `fetch`. GET bootstrap; POST /gramlot/main JSON
{pageId} returns TYTX JSON. Validates requests, missing pages and capacity;
unexpected application exceptions propagate. Adapters serve assets. Node fixture
bridges node:http; Bun fixture uses Bun.serve directly. Registry is bounded,
expiring, process-local. Concrete host supplies owner; IDs are not authentication.
Anonymous test fixtures do not establish production sessions, TLS, multiworker
registries or deployment. No performance claim.

<a id="gc-065-025"></a>

## 025 · Historical verification and current check entry points

Historical 2026-09-19 evidence: Node/Bun host tests and Python/Chromium checks
passed at that increment. Those counts and recipe checks do not describe 0.1.0.
Current commands: [GC-085](085-operating-guide.md#gc-085-025); versioned seven-profile
results: [GC-130](130-release-ecosystem-review.md#gc-130-025).
The browser harness takes runtime, Playwright entry, Chromium and python/js.
JS requires GRAMLOT_TEST_URL from an already running adapter; Python may start
its local fixture. Use its contract fixture, not an arbitrary or Hello World
page. No application launch/deployment, database/bindings/controllers/CSS claim.

Owner dependency policy: no first-party pins or lockfiles; follow upstream Git default branches and unconstrained package releases. Refresh during setup/update; historical version records are evidence only.

Python host imports use `from gramlot.server import Host`; public page imports remain `from gramlot import Page`. Internal pre-release adapters/model/root-builder paths have been replaced by server/page ownership.

Python default file loading executes the module on each page opening. Both Hosts
create fresh Page instances for main/remote Source requests, independently of module caching.

<a id="gc-065-030"></a>

## 030 · 0.2.0 page resources and bootstrap

**Status 2026-09-30: implemented on the development branch, in qualification.** Source: owner-confirmed 0.2.0 plan, 2026-09-25, revised 2026-09-28 (S06, S07, S14); GC-210 and amendment 11.48. The lists below are the original plan and the 0.1.2 facts, kept as history. Implemented contract (minimal Host contract): `Page.css` stays in the core (Q10) and is not replaced by `css_requires`; the two fields are interpreted only by a Host with a resource system (genro-kajenn, part of Genro, the framework that succeeds GenroPy) and the minimal `FileHost` and the current adapters raise `InvalidResourceName` for any name; no `ResourceResolver`, no `_resources` search in the core; a Host implements `resolve_page` and `resolve_resources`; `FileHost(pages_dir)` serves file page `foo.py` first, then `foo/foo.py`, plus companions `foo.css`, `foo_aux.js` (group null), `foo.md`; both page forms together are not an error (the file wins); `PageBootstrap` writes the CSS links in the browser (no `<link>` in the HTML); the adapter chooses the mount prefix at each opening; verified adapters: `gramlot-uvicorn`, `gramlot-js-server`, `gramlot-serverless` (since 2026-10-01 `@gramlot/gramlot-browser` in `gramlot-js-server`, renamed `@gramlot/gramlot-serverless` on 2026-10-02 (0.2.2); other four deferred, [GC-070 §595](070-work-status.md#gc-070-595)). 2026-10-03, amendment 11.55 (0.2.5): page logic = the page module's `Logic` export (`foo.js`, beside `foo.py` for Python), else `foo_aux.js`, both = error; import map `@gramlot/gramlot/page` → runtime in the bootstrap HTML; adapters serve `.css` and `.js` below the pages folder; P14's `ordini.js` with `Page` and `Logic` returns in this form. Current contract: [GC-090 §030](../public/090-classes-and-hosts.md#gc-090-030).

Current 0.1.2: `Page.css = ()` (`page/base.py:17`), JS `static css = []` (`adapters/page.js:24`); `open_page` writes one `<link>` per URL (`host.py:98`) and a script importing `Gramlot` (`host.py:102-104`); JS `openPage` same (`adapters/host.js:56`, `59-61`). `resolve_page` `a/b` → `pages/a/b.py` (`host.py:64-77`); `FileHost.resolvePage` `a/b` → `a/b.js` (`file-host.js:15-35`). `Bootstrap` (`host.py:33-36`) = `page_id`, `html`; no nonce.

Planned 0.2.0 (original plan; superseded items listed above):
- `css_requires`/`js_requires` strings replace `Page.css` in Python and JS (P23, P13); no alias.
- `parse_requires`/`parseRequires` (P7): empty = none; `,` separator; spaces and empty tokens ignored; duplicates ignored, first position kept; `/` subfolders; segments `^[A-Za-z0-9_-]+$`; `.`, `..`, leading/trailing `/`, extensions → error; `:` → error.
- `ResourceResolver.resolve(page_path, names, kind)` → URLs in load order. Search: page folder, then `_resources` upward to application root, all levels. Load: generic → specific, names in string order, companion last. JS: all levels, last registration wins (intentional difference: legacy loads only the most generic). CSS: all levels, cascade.
- P14: `pages/ordini.py` or `pages/ordini/ordini.py`; both → error; companion = same name in page folder; JS pages in a separate folder; `ordini.js` exports `Page` and `Logic`, importable on Node/Bun and in the browser; owner exception to §13; companion public, server-only logic in modules it does not import.
- Nonce `secrets.token_urlsafe(16)`, distinct from `page_id`; `Bootstrap.nonce`; applies to bootstrap scripts and renderer-created `<script>`; standalone uses a hash (S14).
- Script `import {PageBootstrap} from runtime; await new PageBootstrap({…}).run()`. `run()`: CSS links in order; import all JS, any completion order; `new Gramlot(config)`; register `module.Logic` in received order (`group` = `js_requires` name or null for companion); `window.gramlot = app; await app.start()`. Close or import failure before the last step → nothing mounts.
- Host and WorkerHost never evaluate code; companion runs only in the window.
- Source transport: Python authoring inert, empty Python Gramlot Source classes (`src/gramlot/page/source.py`, owner 2026-09-26); Source travels as `::X` with `__cls`; the browser decodes the named class, `GramlotBuilderBag`/`GramlotBuilderBagNode` for a Gramlot Source (`js/src/builder/source.js`); GramlotBuilder authoring yields `GramlotBuilderBag` in Python and JS ([GC-070 §525](070-work-status.md#gc-070-525)).
- S06 = core contract only; adapters migrate in S14 after Q4; S00 inventories their `Page.css` use. Outcome: see the status above.
