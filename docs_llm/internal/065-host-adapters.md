# 065 · Shared Python and JavaScript host foundations

Document ID: **GC-065**.

**Current 0.1.0 boundary:** neutral JavaScript Host runs Page/main/source/close, while the Node/Bun adapter owns HTTP parsing and routing. Recipes in sections below describe the 2026-09-19 increment and are deferred. Use [GC-110](110-native-html-readiness.md#gc-110-020) for current release gates.

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
corresponds to JS div('homer', {id:'panel'}). Python and JS serialize registered SourceBag roots directly through TYTX. Native tags only, no CSS shorthand.
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
its local fixture. Use its native-HTML fixture, not an arbitrary or Hello World
page. No application launch/deployment, database/bindings/controllers/CSS claim.

Owner dependency policy: no first-party pins or lockfiles; follow upstream Git default branches and unconstrained package releases. Refresh during setup/update; historical version records are evidence only.

Python host imports use `from gramlot.server import Host`; public page imports remain `from gramlot import Page`. Internal pre-release adapters/model/root-builder paths have been replaced by server/page ownership.

Python default file loading executes the module on each page opening. Both Hosts
create fresh Page instances for main/remote Source requests, independently of module caching.
