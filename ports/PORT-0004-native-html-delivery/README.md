**Native 0.1.0 acceptance — 2026-09-24:** owner accepted the bounded result recorded

> **Historical delivery record:** Data declaration and Page.css statements retain
> their dated scope. The 0.2.0 contract is [GC-210](../../docs/internal/210-binding-contract.md)
> and constitution 11.47: dataSetter(destination_path, value), R1 and full-branch
> installation; css_requires migration belongs to later phases.

in GC-110/GC-130 and authorized GitHub archives. Acceptance covers only the current
typed Source, native HTML, Page/Host, live lifecycle and seven-profile contract.
Earlier recipes, retired compilers, speculative rendering and broader PoC behavior
remain superseded or excluded; dated records below retain their original status.

**Branch freeze/unfreeze implemented and verified — 2026-09-21.**

**Historical port record.** Contracts, review feedback, rejected paths and dated test evidence remain here. The current 0.1.0 state is [GC-070](../../docs/internal/070-work-status.md) and the sole release plan is [GC-110](../../docs/internal/110-native-html-readiness.md#gc-110-020). Past “current”, “open” and “next” statements are local to their dated checkpoint; old eight-profile checks do not verify the seven-profile release matrix. No port acceptance is implied.

**Worker standalone runtime implemented and verified — 2026-09-21.**

Owner approved the Worker host, excluding database work. WorkerHost reuses Host
registration/main/source; WorkerTransport owns messages and Worker lifetime.
standalone.mount prepares Gramlot before main; app.dispose terminates its Worker.
Browser-safe `/page` and `/worker-host` exports added. Python/JS build-time standalone
compilers removed from the active tree (historical copies under temp/retired-standalone).
No Builder/Bag changes, compatibility path, database or Data binding.

Verified: Node72, Bun72, Python16; rebuilt bundles; strict Sphinx and public-doc
checks pass. Logs are in temp/worker-host-verification. Actual Chrome153.0.8010.48 and
Playwright WebKit26.6 pass file-based Worker main/remote Source, live mutations and
disposal without HTTP(S). Chrome hosted regression also passes, including freeze.
Safari/Firefox remain unverified. The former eight-profile matrix is historical:
the separate standalone exporter still needs migration from the removed compiler.

Next blocker: agreed single-HTML generation through HtmlBuilder encounters template
interpolation inside script text. No production HTML workaround was added. Dependency
changes require explicit owner authorization under constitution section14. Current
Worker is a single classic bundle, not a module/fallback pair; one Page, empty Page.css.
See GC-090 section025 for use and GC-093 section120 for responsibilities and limits.
Local implementation and checks do not imply acceptance or publication.


Owner settled overlap semantics: unfreeze releases a branch and all descendants;
a still-frozen ancestor keeps rendering suspended. Implemented only in GramlotRenderer
with freeze(node)/unfreeze(node). An idempotent frozen flag lives on existing mount
records. Events in frozen branches are discarded before enqueueing; other branches
retain synchronous FIFO processing. Unfreeze rebuilds current Source once, or removes
the old DOM if the root was deleted. No timer, counter, deferred-event log, new class,
Source projection, transaction, rollback or Data binding was introduced.

Shared the existing structural replacement code through a private rebuild method.
Old descendant records retain cleanup ownership while Source changes; unfreeze or
dispose releases them. Incoming replacement reference validation now excludes the
rendered descendants being replaced, which can differ from current Source during
freeze. This uses the existing mount records, not another registry or representation.

Verified: all **71 tests on Node and Bun**, including nine branch-freeze contracts
covering batching, transient insertion/deletion, both nested unfreeze orders,
independent branches, deleted frozen roots, mixed bulk deletion, references and
disposal. Chromium passes hosted bootstrap/main, Source updates, remote Source,
branch freeze/unfreeze and disposal. Bundle rebuilt; strict Sphinx and public-doc
checks pass. Full eight-host matrix was not rerun. Builder/Bag unchanged; no bump,
commit, push or publication. GC-095 section 030 documents the runtime API and limits.
The pending-overlap question below is superseded by the owner's explicit answer.

Remaining architectural review: Page execution duplication/return contract, host
boundaries, server lifetime and grammar distribution (GC-093 Q3–Q6). Binding maps
remain future work; freeze suspends rendering only and does not suppress Bag events
for other subscribers.

**Owner-directed removal of speculative rendering — 2026-09-21.**

Implemented the explicit decision to eliminate Q1's extra guarantee. Removed
Source Proxy projections, renderer pre-write validators, DOM setter clones,
prepared-token queues/caches, synthetic candidate nodes, stage/commit machinery
and whole-tree validation on each Bag event. Deleted source-mutation.js.
The test-only candidateValidator callback disappeared with that machinery (Q2).

Renderer subscribes only to events, resolves the affected node's ancestry, builds
inserted/replacement DOM once, updates existing setters locally and releases
subtree records/resources on deletion. Incoming main/remote Source still receives
structural validation, without constructing DOM. Rendering errors propagate after
the Source write; no Source rollback or preserved-old-DOM guarantee is offered.
Actual Source-to-DOM records and element-to-record WeakMap support traversal and
cleanup; they are not projected Source or prepared candidates. No binding added.

Verification: 62 tests pass on Node and Bun. Tests for the removed guarantee were
replaced with post-write error and event-local-work contracts; removed the custom
hook test and redundant speculative-stage test. With 100 elements, a scalar update
validates one node; an insertion validates one node and creates one element.
Chromium passes bootstrap/main, reported rendering error, nested updates, remote
Source and disposal. Bundles rebuilt; no Bag/Builder edits, dependency changes or
publication. Renderer shrank from 460 to 300 lines; 51-line projection module removed.
The earlier 8/8 matrix is historical evidence before this change, not rerun here.

Q1 and Q2 are closed by the owner's removal decision, not by inventing another
failure protocol. Remaining review topics: repeated page execution/return contract,
host boundaries, server lifecycle and grammar distribution (GC-093 Q3–Q6).

**Native HTML matrix and source-quality review — 2026-09-21.**

Implemented corrections: removed unused JS distribution grammar copies and their
copy script (129,154 bytes), preserving the generic HtmlBuilder grammar and shared
JSON test inputs; rejected JS remote source(null/undefined/main) dispatch; corrected
the repository map. No new class, workaround, recipe or dependency pin.

Verified from current local package archives in Chromium: **8/8** — raw ASGI/Uvicorn,
FastAPI, actual Kajenn BaseServer, Flask, Node, Bun, standalone Python and standalone
JS. Each passes Hello World, scalar/attribute/nested updates, insertion, replacement,
deletion, strict Source rejection and disposal. Standalone makes no HTTP requests.
Four Python profiles import no DB provider; Kajenn's registry is empty. Full core
Node/Bun tests passed after packaging cleanup (63 each); subsequent remote-method
regression and existing host tests passed (6 each), followed by the final 8/8 matrix.
The core version is unchanged; this is local minimum verification, not a release or
upstream-installability claim. Builder/Bag sources were not changed in this review.

Architecture **not accepted as clean**. GC-093 sections 100–105 contain the evidence
and six open findings: (Q1) whole-tree double validation/speculative DOM staging;
(Q2) test-only candidate-validator hook; (Q3) repeated page execution with hosted/
standalone return-value and builder-name differences; (Q4) inconsistent host/HTTP
ownership; (Q5) browser disposal does not close server pages; (Q6) Python grammar
snapshot refresh versus JS's current installed grammar. Reproduced Q1: one scalar
update among 100 elements invokes 200 validations; one insertion invokes 202
validations and creates the element twice. Existing tests do not justify this design.

Next decision: establish the intended pre-write failure contract before changing
Q1's machinery. Other open findings are problems to decide, not permission for new
abstractions. Evidence/harness: temp/matrix-review-2026-09-21; packages/logs:
/private/tmp/gramlot-matrix-review. No source pushes, release, deployment or changes
to unrelated running demo servers. The previous pending-local-matrix status below
is superseded; upstream installation and architectural acceptance remain open.

**Local Builder bumps and Gramlot refresh completed — 2026-09-21.**

- Implemented: Builder Python **0.23.3**, Builder JS **0.1.2**; built local archives
  and installed them in Gramlot's `.venv` and `js/node_modules`. The temporary
  Python host verification environment also uses 0.23.3. Maintained first-party
  dependency declarations remain unconstrained; no lockfile or publication.
- Gramlot now uses SourceBag.bindBuilder and RendererBase's renderedItem contract.
  Removed active recipe declarations/options/exports, RecipeExpander, attachSource,
  prepareItem and the duplicate collection list used only for recipe expansion.
  Structural fragment rendering remains Gramlot's responsibility.
- Updated remote fixtures and browser harness to native typed Source authoring;
  retained Source lifecycle/error tests. Collection collision tests now reject
  genuinely invalid inheritance rather than valid additive updates.
- Verified: Builder Python 444 tests; Builder JS 108 on Node and 108 on Bun;
  Gramlot Python 19, JS 63 on Node and 63 on Bun, all passing. Runtime bundles
  rebuilt; strict Sphinx/public-documentation checks pass. Chromium checks bootstrap,
  main, rejected invalid mutation, insert/update/delete/replace, remote Source and
  disposal without JS errors, using the loopback test host.
- Updated public guides to remove obsolete recipe APIs and document additive
  Collection updates. Artifacts/logs: /private/tmp/gramlot-builder-refresh and
  /private/tmp/gramlot-refresh-*. No version change to Gramlot itself.

Remaining: complete the Gramlot 0.1.0 host matrix on this dependency state;
Python Builder's previously recorded instance-only include_components rendering
issue; mixed wildcard/cardinality semantics require a decision; recipes and Data
bindings remain deferred. Python Builder Sphinx dependencies are still not
installed/verified here. No existing external demo server was restarted. This
completes the local dependency refresh, not owner acceptance of the full release.
Earlier version/installed-package statements below are historical and superseded.

# PORT-0004-native-html-delivery

**Collection composition implemented in owning sources — 2026-09-21.**
Owner decisions supersede full-declaration replacement and collision rejection.
Both Builder Python and JS now export Collection: raw portable JSON, ordered
update and independent document export. Declarations may be partial. Omitted/null
fields preserve prior values; named parameters and child rules add/update; no
removal marker, author-metadata extension or HTML documentation generator was added.
A supplied signature parameter remains a complete descriptor. Existing exporters
are unchanged. Version remains Python 0.23.2 / JS 0.1.1.

Both loaders compose and validate before publishing; class/instance isolation and
abstract recompilation are verified. Removed loaded-document/declaration registries
in favor of one Collection. Preserved executable component declarations across JSON
updates; injected component roots are not required author attributes.

Checks on exact staged sources applied with hash verification: Python **443/443**,
Node/Bun **107/107**, no skipped tests. The same HTML5 JSON + partial extension
produced identical composed JSON and static HTML in Python/JS. JS strict Sphinx
passed; Python Sphinx could not start because sphinx_autodoc_typehints is absent
from the documentation environment. No dependencies were installed to conceal this.

**Open:** mixed wildcard/named child-rule composition remains rejected pending
owner clarification. A pre-existing Python include_components rendering defect
was reproduced on unchanged sources: renderer looks up the instance-only method
on the class. It is recorded, not fixed here. Gramlot's installed JS package is
still the older 0.1.1; full consumer refresh is pending removal of obsolete recipe,
attachSource and prepareItem uses. This is not completion of the 0.1.0 host matrix.
No Bag changes, exporter-output changes, version bump, commit, push or publication.


**Builder JS correction applied — 2026-09-21 (supersedes earlier closure).**
The owner explicitly reopened Builder JS for removal of features outside the
Python port contract. Version stays **0.1.1**. Bag JS and Python were not changed.
Removed generic recipes (declaration, helper, Proxy dispatch, expander/export),
setData, attachSource/replace, prepareItem and five renderer access wrappers.
Base grammar is now generated by the Python exporter alongside HTML5/SVG;
Python-unsupported Callable generic descriptors are rejected. Kept the explicitly
approved format/mask divergence and necessary JS dispatch/typed transport mechanics.
The owning repo's GBJ-025 now maps every source module to Python or an explicit
adaptation. The earlier 0.1.1 review missed these additions and was not sufficient
for architectural acceptance.

Verification on the corrected owning repository: **100/100 Node and Bun**, no
skips; strict Sphinx build passes; base/HTML5/SVG match fresh Python exports.
Tests of rejected recipe functionality were removed; Source transport and
mutation-rejection coverage was retained, with negative API checks added.
The original file set was backed up to /private/tmp/builder-before-port-correction.tar.gz.
No version bump, commit, push, release, or dependency pin.

**Still open:** Gramlot's installed archive is the previous 0.1.1 and was not
refreshed in this correction. Gramlot still imports RecipeExpander, invokes
attachSource and implements prepareItem. Remove the deferred recipe path and
align the live renderer with the Python-equivalent base before refreshing and
validating the consumer. Do not restore removed generic APIs to make tests pass.
The inherited-collection collision was reproduced in Python too; its contract
remains undecided. Full parity gaps in GC-105 remain; this audit does not claim
identical behavior for every input. The older 56/7 Gramlot diagnostic below is
historical, not validation of the corrected dependency.


- **Status:** revision-requested after implementation-quality review; previous local verification remains historical evidence
- **Owner scope:** GC-087 layer split and GC-088 native HTML plan, including Python/JS Hello World, six hosted profiles and two standalone profiles.
- **Destination:** current uncommitted Gramlot, generic libraries and adapter worktrees. No source publication, release or deployment.
- **Constitution:** sections 2–7, 9–10 and 12. Core remains host/database independent; no widgets or database functionality added. Static HTML CSS adaptation now belongs to the generic HTML dialect; live CSS integration remains pending.

## Ownership and implementation

Current ownership (GC-087 / GC-094, superseding the initial delivery layout):
Bag/TYTX retain tree/events/typed transport. Local `genro-builders-js` owns generic
declarations, SourceBag association, RendererBase and static HTML/XML rendering.
Gramlot owns DomRendererBase, HtmlSourceRenderer and native HtmlElement, plus
application references/metadata and main/remote/embedded Source coordination.
`genro-dom-js` remains a reference repository and is no longer a dependency.
Recipes are deferred as a future Source macro; existing recipe code is provisional.
The single wire suffix is SOURCE; no ordinary-Bag coercion or XS alias.

Main/remote candidates expand and render detached before observed insertion;
matching renderer events consume the prepared DOM once. Preparation failure
preserves existing Source/DOM/reference identity. This is not rollback of arbitrary
external side effects in user lifecycle callbacks, nor of every raw Bag mutation.

Separate native host adapters implement ASGI/Uvicorn, FastAPI, Kajenn, Flask,
Node and Bun. Example pages contain only equivalent Python/JS declarations;
launchers invoke those adapters. Bounded native-html-v1 standalone compiles each
language at build time and embeds the same runtime/typed Source, with server
operations disabled. The broader standalone capability gate remains intact.

## Distribution and verification gates

Npm archives/wheels contain their browser assets; Python's resource accessor and
JS runtime exports replace sibling asset lookup. Builds preserve available actual
license/notice files; TYTX's missing notice file is reported from package metadata,
not fabricated. Local npm graph verification uses normal npm installs with temporary
artifact overrides; maintained first-party manifests are floating and no lockfile
is retained. No dependency implementation is patched inside node_modules.

Final test counts and the host/offline matrix are maintained in GC-070/GC-088.
Checks include actual Python↔JS JSON/MessagePack registered roots/branches, staged
render failure, dynamic HTML setters/replacement/order/cleanup, real loopback
listeners, actual installed Hello World launchers and network-blocked offline
Chromium. Existing PoC adapter tests are distinct from new clean-core verification.

## Review feedback and remaining gate

- Do not confuse successful local archive consumption with fresh upstream installation.
  Published Python Builder still lacks the local SOURCE registration, and the new
  JS generic repository has no consolidated remote source yet.
- Resolved: removed the historical core browser module shim; conditional browser/Node
  dependencies are implemented in TYTX. Final artifacts and browser matrix rerun.
- Resolved: audited transitive first-party metadata; removed Bag's TYTX tag at
  its owning source and Python owned dependency bounds in durable worktrees.
- Preserve initial fixture and historical checks as history, not stronger release claims.
- Develop/main consolidation, upstream source availability and owner acceptance are
  separate from local implementation and browser verification.

## Final local review record — 2026-09-19

Core: Python 14/14, Node 36/36, Bun 36/36. Generic Builder: 12/12 per JS
runtime; DOM: 124/124 per runtime. Final installed Chromium matrix passed for
Uvicorn, FastAPI, Flask, Kajenn, Node and Bun, plus Python/JS standalone with
network blocked. No application database provider was initialized.

The coordinator reviewed the ownership split, registered transport, detached
candidate lifecycle and final artifact consumption. No blocking local defect
remains identified; owner acceptance is still pending. The owner explicitly
requested keeping everything local for review. No commit/push/remote creation,
package publication or deployment is authorized.

[GC-089](../../docs/internal/089-native-html-handoff.md) records durable repository
and worktree paths, artifact evidence, reproduction and the upstream gate.

## Implementation-quality review — 2026-09-20

Destination result: **revision-requested**. GC-093 section 040 reviews code design
independently of runtime checks, including the recent pre-write changes. Generic
base responsibilities and rendering lifecycle, multiple validation/preparation
paths, recipe/reference ownership and repeated page execution must be simplified
before architectural acceptance. Naming and mixin contracts also need revision.
This supersedes any implication that functional completion closes design review;
previous verification evidence and rejected approaches remain historical evidence.

Reusable feedback: placing code in its nominal owner library does not make it a
minimal generic abstraction. Review inherited behavior and call paths, not just
file location. Prefer one explicit lifecycle and fewer mechanisms; tests cannot
justify a redundant abstraction. See
[GC-093](../../docs/internal/093-class-design-review.md#gc-093-040).


## Current remediation sequence — 2026-09-20

[GC-094](../../docs/internal/094-design-consolidation-plan.md) is the proposed phased
plan reconstructed from owner decisions. Phase 0 settles the actual shared API and
unresolved behavior before editing owner libraries. Functional completion of GC-088
is not acceptance. No implementation phase started in the planning task; all work
remains local without commits or publication.


## Bounded simplification — 2026-09-20

GC-094 §090 records the first phase-1 source change: remove the second recursive
copy of expanded recipe branches, relocate Source codec helpers to SourceBag's
module, preserve package exports and existing behavior. Code review precedes
verification; generic Node/Bun and core Node checks pass. Destination status remains
revision-requested for other findings; no owner acceptance or source publication.

### Builder-first review checkpoint — 2026-09-20

Owner prioritizes generic Builder JS consolidation against current Python with JSON
grammar before further native-HTML integration. GC-094 §105 and GC-070 record the
new static rendering APIs/XML counterpart, grammar composition and authoring fixes.
Isolated builder checks: 38 Node/38 Bun pass. Existing DOM consumer checks: 120 pass,
7 fail on the former target:null return-only convention, incompatible with Python's
registered-destination semantics. No compatibility patch or rewritten oracle.
Pending owner decision: preserve or retire exported legacy DOM Application before
removing its handler/subscription/patch dependencies from the generic base. The
current Gramlot installation remains on previous artifacts. Review stays
revision-requested; these bounded changes do not establish foundation acceptance.

### Owner revision — reactivity belongs to Gramlot, 2026-09-20

GC-087 §035 supersedes the former DOM lifecycle allocation and resolves the prior
compatibility question. Generic Builder JS now owns static flat Data/Source and
rendering without handler/subscriptions/patch machinery. Gramlot owns the moved
HtmlSourceRenderer and mutation projection; their tests moved with them. Component
schema/maps are instance-owned. DOM Application/BuilderHandler no longer exported
or packaged; historical sources retained, DOM package deletion undecided.
Generic46 and core50 checks pass on both Node and Bun; bundles and public docs build.
No installed-wheel/browser/host-matrix refresh. GC-094 §110 records remaining parity
and architecture limitations; review remains revision-requested, not acceptance.

### HTML dialect and DOM dependency checkpoint — 2026-09-20

GC-087 §045 / GC-094 §115: Builder JS now bundles the Python-exported HTML5 grammar,
HtmlBuilder and static HtmlRenderer, including CSS transformations/macros. Class
JSON parsing preserves subclass extensions. Gramlot owns relocated HtmlElement and
DomRendererBase and no longer depends on DOM JS; that repository is reference only.
Generic54 Node/54 Bun; core50 Node/50 Bun; rebuilt bundles verified.
Live CSS reuse and generic SVG sub-builder dispatch remain incomplete. Existing
Python CSS collision order is preserved pending owner precedence decision. No wheel/
browser/host-matrix refresh. Review remains revision-requested; no publication.

### CSS precedence correction — 2026-09-20

GC-087 §050 resolves the previously open precedence question: explicit CSS attrs
always override `style`. Python and JS now seed the fallback before explicit attrs;
13 focused Python and 55 Node/55 Bun generic checks pass. Native dynamic CSS reuse
is still pending; no broader port acceptance, publication or wheel refresh.

### Named sub-builder review checkpoint — 2026-09-20

GC-094 §120: named static dispatch, shared Data/root identity and typed Source
rebinding implemented in generic Builder JS. Destination review rejected duplicate
binding traversals and partial rebinding of prebuilt branches; one SourceBag plan
now serves both authoring insertion and transport. Installed archive verifies
generic62/core50 on both Node and Bun; bundles rebuilt. No SVG/runtime-reference/
live-sub-builder support claim. Recipe dialect inheritance and marker references
await owner decisions. Design review remains revision-requested; no publication.

### Recipe deferral and ordinary HTML review — 2026-09-20

Owner defers recipe design/implementation, retaining only the macro concept.
Earlier recipe decisions/questions are historical, not a gate for this slice.
GC-094 §125–130 records ordinary authoring review. Class grammar definitions now
share the same name-collision check as instance collections: exact-name overrides
are supported, ambiguous case-insensitive names are rejected before mutation.
Initial archive verified generic64/core50 on Node and Bun, with bundles rebuilt.
The CSS declaration splitter is corrected in both owning HTML renderers without
new dependencies/classes. Final installed verification: generic65/core50 on both
Node and Bun, plus 14 focused Python HTML checks; bundles rebuilt (GC-070). Missing-data output and precedence between
competing explicit CSS forms remain unresolved. Review stays revision-requested.

### Null at the DOM boundary — owner correction, 2026-09-20

The assistant's previous static-renderer interpretation is rejected and reverted
in Python and generic JS, including its tests and README claim. GC-087 §060 and
GC-094 §135 record the corrected rule: conversion occurs only on DOM assignment.
Existing Gramlot HtmlElement already handles it; one native Source regression
verifies initial/update text and input.value, without mutating Source nulls.
Installed generic65/core51 Node/Bun and Python HTML14 pass; bundles rebuilt.
No new runtime class/path, host refresh or broader acceptance.

### Generic declaration/ownership checkpoint — 2026-09-20

GC-094 §145: JS validation and ID lookup retain each node's dialect; keyword
escaping matches Python; one inheritance compiler recomputes subclass overrides
from raw class declarations. Python transitive abstract resolution corrected in
its owning library. Broader checks aligned two obsolete Bag API calls with
installed Bag 0.25.1 (traverse and negative cache TTL); no shims or pins.
Installed generic72/core51 Node/Bun and full Python430 pass; bundles rebuilt.
The later owner clarification (GC-087 §070) makes exported HTML/SVG JSON the
single native vocabulary; general JS declarations remain JS-only. Recipes deferred, null-to-empty DOM-only, running host wheel not refreshed.
Review remains revision-requested; no commits/publication or host acceptance.

### Canonical native collection export — 2026-09-20

HTML export unchanged (117 elements); missing SVG export added (58 elements,
2 abstracts). One generation entry point in genro-builders-js uses the existing
Python exporter; Gramlot copies those files for packaging. Fresh export/installed
resource byte equality and Python/Node/Bun JSON authoring/static output verified.
No new JS SVG builder or live SVG rendering, no overall port acceptance. Local
artifact/checks: /private/tmp/gramlot-json-collections/. Review stays revision-requested.

### SVG adaptation investigation — 2026-09-20

Read-only parent/Sol review confirmed: the canonical SVG JSON exists, but JS has
no registered SvgBuilder; the generic default-renderer dispatch does not ensure
DOM fragments for Gramlot's live transaction. Reuse addRender/getRender and one
live record owner rather than a second walk. The existing Python SvgExtensions.html
also assigns XHTML xmlns to foreignObject itself; a reproduced XML parse places
that boundary in XHTML instead of SVG. Correct the owning declaration/namespace
contract and regenerate; do not flatten vocabularies or compensate in JS.
Owner subsequently authorized both static SVG and reactive Gramlot SVG.
No runtime edits or new SVG compatibility claims. See GC-094 §150.

### Both SVG paths adapted — 2026-09-20

**Current checkpoint — static and live SVG adapted (owner authorized both):**
canonical SVG JSON feeds the registered JS SvgBuilder and its static SvgRenderer.
Gramlot's existing HtmlSourceRenderer owns one transaction/record map for HTML and
SVG; its native element collaborator creates SVG nodes with createElementNS and
uses the same exported SVG attribute adapter as the static renderer. No new live
renderer class, grammar copy, coordinator or traversal was added.

Corrected the owning Python SVG-to-HTML declaration: foreignObject remains SVG,
while the entered HTML children carry XHTML namespace. Regenerated canonical JSON.
The generic Bag now exposes detached candidate creation; SourceBag initializes
ownership through that hook before validators/subscribers see an insertion.
A proposed per-insert class and a hidden-attribute workaround were rejected.
One existing binding plan handles branches, including rejection rollback and
reentrant inserts. Remote preparation carries the target dialect through the
existing pipeline; recipe design remains deferred.

Verified with the final local graph: generic JS79 and Gramlot JS55 on both Node
and Bun; Python builder full431; Bag605 in its owning checkout. Chrome verified
Python typed Source, SVG/HTML namespaces, direct insertion, attribute update with
DOM identity preserved, disposal and no page errors. Bundles rebuilt; canonical
collection copies identical; floating dependency manifests preserved. Logs and
builder archive: /private/tmp/gramlot-svg/; Bag archive: /private/tmp/gramlot-svg-bag/.
Python verification uses the current owning source, not the previous host wheel.
This closes the bounded SVG adaptation, not full builder parity, host-matrix
acceptance or publication. Next: return to the remaining generic-builder review
and subsequent host consolidation. Data bindings/new recipes/CSS capabilities
and broader collection extensions are not part of this SVG increment.

Port review remains revision-requested for its broader consolidation scope;
the native SVG increment does not accept unrelated lifecycle or host work.

### Design review follow-up — 2026-09-20

**Current checkpoint — bounded design corrections verified, review still open:**
generic JS now rejects contradictory variadic signatures, follows Python's public
declaration-name boundary, and composes container aliases through one cache-free
inheritance walk. Alias rebinding fails before grammar mutation; subclass method
overrides remain valid. Removed unused pointer.js duplication.

One Source attribute-normalization function now serves both SourceBagNode and the
live DOM handler: `_class` becomes `class`, literal `foo_` stays literal, and Source
metadata does not leak into native attributes during creation or update. Structural
replacement completes even when disposal callbacks throw, then reports the cleanup
error; committed Source, DOM and mount records remain aligned.

Verified the installed local archive graph: generic JS84 and Gramlot JS57, both on
Node and Bun; bundles rebuilt. Logs/archive: /private/tmp/gramlot-design-review/.
First-party manifest references remain floating; no lockfile, commit or publication.
Earlier Python431/Bag605/Chrome checks remain historical, not new runs.

Open decisions: SVG static serialization currently drops scalar content on tags
incorrectly classified as void (e.g. metadata('license')). Reusing XmlRenderer
would remove duplicate serialization and emit paired empty tags; owner confirmation
of that spelling change is pending. HTML void knowledge is duplicated in static
and DOM handlers and is absent from exported JSON; sub_tags='' alone cannot encode
void semantics. attachSource({replace:true}) retains a stale structural root and
can duplicate target IDs when transferring between builders. No replacement/adoption
policy has been invented. Ordinary-Bag compatibility and projection/staging
complexity remain review findings. Recipes, live CSS and host expansion stay deferred.
See GC-093 §045. Broader port status remains revision-requested, not accepted.

Reusable review feedback: reject duplicate internal representations, caches without
a settled need, and agent proposals that reinterpret deferred work as permission
to remove it. Keep source normalization with generic Source; DOM lifecycle remains
Gramlot-owned. SVG content loss and HTML void vocabulary duplication are recorded
defects, not accepted behavior. See GC-093 §045 for examples and pending decisions.

### HTML void metadata — 2026-09-20

**Current checkpoint — HTML void semantics moved to grammar:** owner approved
using existing `_meta` rather than renderer-owned tag lists. The 13 Python HTML
void declarations now carry `_meta={"void": True}`; the existing exporter preserves
it in canonical builder_grammar 1.1 JSON. Python static HtmlRenderer, JS static
HtmlRenderer and Gramlot HtmlElement consume this metadata. All three HTML void-tag
lists were removed. An ordinary empty leaf remains paired; sub_tags='' does not
imply void. No new class, grammar version, serializer or SVG semantics introduced.

Canonical JSON was regenerated from Python, installed locally and copied unchanged
into Gramlot's Python/JS resources; browser bundles rebuilt. Verification: Python
export/roundtrip tests21 and HTML/load/indentation tests21; installed generic JS85 on
Node and Bun. Core full run had57 passes and one new test-authoring error: that test
used class declarations, which Gramlot's collection replacement does not expose.
It now uses the documented collections API; the final renderer file passes9/9 on
Node and Bun, including a void alias absent from the old lists. Generic HTML file
was also rechecked after strengthening its alias regression. No product workaround
was introduced for the test. Logs/archive: /private/tmp/gramlot-html-void/.

The HTML vocabulary duplication finding is resolved. SVG scalar-content loss and
its static serializer decision remain open, as do source adoption/ID ownership and
broader lifecycle/compatibility review. No port acceptance, source publication,
package release or host-matrix completion is claimed. Dependencies remain floating.


### Shared XML serializer for SVG — 2026-09-20

**Current checkpoint — SVG reuses XML serialization (owner approved):**
Python and JS SvgRenderer now extend XmlRenderer. Removed both SVG void-tag lists
and duplicate element serialization. Empty nodes render as paired tags; scalar
metadata content is preserved. Attribute aliases and namespace handling remain.
Python normalizes booleans to lowercase immediately before delegating attribute
formatting to XML, preserving HTML-to-SVG boundaries where adapt_attrs is skipped.
The first agent proposal normalized booleans only in adapt_attrs; parent review
caught and corrected that boundary regression before completion.

No XML header is emitted by default; explicit doc_header/docHeader uses the shared
XML finalizer. Native grammar documents did not change. Gramlot still owns the
reactive DOM and required no new renderer code. Installed the local JS archive and
rebuilt browser bundles; floating dependencies and absence of lockfiles preserved.
Verified generic JS87 and core JS58 on Node and Bun; strengthened SVG boundary
regression also passes. Strict Sphinx build and all seven public pages pass.
Canonical, installed and packaged collection bytes match. Artifacts and root logs:
/private/tmp/gramlot-svg-xml/. Final Python full suite: 435 passed using the owning
builder source and /private/tmp/gc088-python-hosts.XDzTXQ/venv/bin/python with Bag
0.25.1. The agent first used global Python with Bag0.21.0 (433 passed, two dependency
API failures); root repeated the full suite in the established environment instead
of patching code for the stale dependencies. Final log: python-full.log in the
same artifact directory. Future agents must receive the explicit interpreter.

SVG content loss and HTML void vocabulary duplication are now corrected. Remaining
review decisions concern whole-Source adoption/IDs, ordinary-Bag compatibility and
projection/staging complexity. No new lifecycle, recipe or CSS behavior was added.
The broader port remains revision-requested; this checkpoint is not full parity,
host-matrix acceptance or publication. All changes remain local and uncommitted.


### Deferred replacement decision — 2026-09-20

**Owner decision — 2026-09-20: defer whole-Source replacement policy.**
Keep `attachSource(source, {replace: true})` unchanged for now. The known defect
remains open: replacing the source can leave the structural root attached to the
old Bag; transferring between builders can also duplicate cached target IDs.
Gramlot main/remote does not use this option. Neither removal nor a new adoption,
identity-remapping or root-transfer contract is approved. Revisit with the owner
later; this deferred choice does not block independent review work.

### Native updates and component inheritance — 2026-09-20

**Current checkpoint — attribute ownership, emitted tags and component inheritance:**
HtmlElement now retains the attributes it actually applied, including render_attributes
and SVG spelling, and owns that snapshot. The coordinator no longer overwrites it
with raw Source attributes. Removing metadata-only attributes now removes them from
the DOM; an overridden Source attribute is restored. Failed detached validation
leaves the mounted snapshot unchanged. No second snapshot/cache or lifecycle added.

One generic resolveRenderTag function serves RendererBase and Gramlot's native
handler. The coordinator passes the resolved tag to creation and retains the authored
sourceTag separately. Example: del_ authors a real <del>; attribute/text updates keep
the same DOM element. Literal non-keyword underscores remain literal. Tag aliases,
existing ns prefixes and ordinary-Bag grammar metadata use the same resolution;
namespace URI selection is unchanged.

Generic component declarations now compose each class's own mappings and static
array base-to-child. Child declarations override parent mappings without losing
unrelated inherited components. Component case collisions fail before instance
schema publication. Parent review corrected the agent's first merge order, which
let a parent static array overwrite a child's declared mapping. Containers and
components share one class-chain traversal; no new classes or caches were added.

Verified final installed local graph: generic JS91 and core JS60 on Node and Bun;
bundles rebuilt. Python code/grammar did not change; prior Python435 is historical.
Artifacts/logs: /private/tmp/gramlot-attr-review/. Dependencies remain floating;
all work remains local, uncommitted and unpublished. Broader port remains
revision-requested, not accepted.

Open: repeated defineDeclarations/defineGrammar calls on one class currently discard
prior own elements/components, unlike retained container declarations. Owner choice
between cumulative declaration and replacement semantics is pending; no change made.
Whole-Source replacement remains explicitly deferred by the owner. Ordinary-Bag
compatibility and projection/staging policy also remain unresolved; no new contracts
were inferred. Recipes, live CSS and host-matrix expansion stay deferred.


### Necessity review directive — 2026-09-20

**Owner directive — necessity before API refinement (2026-09-20).**
Every additional class/API must name its concrete responsibility, actual consumers,
and why an existing mechanism cannot satisfy it. Tests authored for an API are not
independent evidence that it belongs in the architecture. Do not retain additions
merely because they work, and do not invent consumers to justify them.

The question about cumulative versus replacing defineDeclarations calls is withdrawn:
it is premature until the API itself is justified. No owner decision on that
behavior is requested now. Shared collection grammar remains builder_grammar JSON;
executable behavior lives in implementation methods. Earlier permission for JS-only
declarations is not evidence that every declaration helper/API is necessary.

Read-only consumer audit: core Python/JS plus JS source in gramlot-examples,
gramlot-standalone, gramlot-nodejs, gramlot-fastapi and gramlot-flask. No operational
consumer of defineDeclarations was found in that scope. Generic HtmlBuilder and
SvgBuilder use defineGrammar with imported JSON; Gramlot uses loadGrammar for its
instance collections. Generic BASE_GRAMMAR also uses defineGrammar with an inline
object. Generic tests and README exercise defineDeclarations; this is not proof of
an application need. No claim is made about uninspected external consumers.

Next review must justify or reject the programmatic grammar declaration path and
its helper exports before refining their semantics. A method-binding responsibility
may be legitimate; that does not automatically justify a second grammar notation.
No declaration APIs were removed and no replacement registry was designed in this
audit. Source replace policy remains separately deferred at the owner's request.


### Owner-directed declaration removal — 2026-09-20

**Completed locally — unnecessary declaration API removed (2026-09-20).**
Removed `defineDeclarations()`, the exported `element`/`abstract`/`container`/`component`
helpers, alias descriptors and their private declaration state from genro-builders-js.
No replacement API, registry or PoC copy was introduced. `defineGrammar()` now
requires the same complete `builder_grammar` 1.1 JSON accepted by `loadGrammar()`;
the existing four base declarations moved unchanged to `collections/base.json`.
Class loading serves HtmlBuilder/SvgBuilder; instance loading serves Gramlot collections.
Existing inherited static component/container arrays only associate same-name
executable methods. Python decorators/exporter and deferred recipes remain unchanged.

The installed local dependency and Gramlot browser bundles were refreshed. Parent
review checked the production implementation and absence of the deleted exports,
private state and shorthand grammar path. Canonical HTML/SVG JSON is byte-identical
across the owning package, installed dependency and Gramlot copies; no dependency
pin or lockfile was introduced. Installed verification: generic builder **89/89**
and Gramlot **60/60**, separately on Node and Bun, including Python/JS transport.
Three obsolete alias/declaration tests were removed, one canonical-format rejection
test added; remaining grammar fixtures use canonical JSON. These checks confirm
preserved behavior, not a justification for adding APIs. Python source is unchanged.

This completes the requested removal, not the broader architectural consolidation.
Whole-Source replacement remains owner-deferred; ordinary-Bag compatibility and
projection/staging ownership remain unresolved. Recipes, live CSS and host-matrix
expansion remain deferred. Work remains local, uncommitted and unpublished; broader
PORT-0004 acceptance remains revision-requested.


### Builder responsibility review — 2026-09-20

**Builder responsibility review — 2026-09-20: bounded corrections complete.**
Reviewed BuilderBase, grammar loading, Source authoring handles and RendererBase
against the Python implementation and actual Gramlot callers. A Sol agent audited
grammar/state ownership read-only; the parent reviewed the findings and changed code.

Implemented in generic Builder JS:
- Removed the uncached fallback in `wrapSource`: attached nodes delegate to their
  owning builder's existing handle cache; detached inputs remain unchanged.
- Removed the unused `isBag` duck-typing helper, unused import and stale renderer comment.
- Loading a grammar no longer changes document identity: `new GramlotBuilder('main')`
  retains `main`, instead of silently becoming `html` during default collection loading.
- One internal JSON serializer compares object content independently of member order
  for both documents and shared declarations. Removed the JS-only top-level ordering
  rejection; exact required keys remain checked. Array order and changed values still
  matter. This matches Python loading and adds no public API or registry.

Retained responsibilities: SourceBag adds builder ownership/authoring to Bag;
BuilderBase owns grammar and Data; RendererBase owns portable traversal/dialect
selection, with concrete XML/HTML/SVG output in subclasses. Loaded collection
identity and declaration identity serve distinct conflict checks; compiled schemas
and tag maps serve lookup. No additional class or inheritance layer was introduced.

**Unresolved duplication, demonstrated:** GramlotBuilder keeps a second `collections`
list for recipe child construction. Calling `builder.loadGrammar(extra)` makes
`reviewPanel` available on the parent while `new GramlotBuilder(null,
{collections: builder.collections})` cannot find it. This is a real divergent path,
not a solved capability. Keep it in the deferred recipe review; no new collection
accessor, replacement API or recipe protocol was inferred. Static template/presentation/
resolver parity with Python also remains incomplete: JS does not yet implement the
Python `div(w='^mywidth', width='${w}px')` resolution behavior.

Verification after local archive installation: generic builder **91/91** and Gramlot
**60/60** on both Node and Bun, including Python/JS typed transport. The two added
regressions cover name preservation and JSON comparison (including real conflicts).
Gramlot's installed explicit-name example passes; browser bundles were rebuilt.
Python sources were not changed. No pins, lockfiles, commits, publication or deployment.
Whole-Source replacement, ordinary-Bag policy, staging policy, recipes, live CSS
and the broader host matrix remain outside this correction. Broader port acceptance
remains revision-requested. Next review area: the collection ownership duplication
when recipe work resumes; remaining Python parity is recorded, not claimed complete.


### Recipe scope reaffirmed — 2026-09-20

**Owner scope decision — 2026-09-20:** recipes remain outside the current work.
Their addition will be addressed later. Park the duplicate collection state used
for recipe child construction with that future work; it is neither a current blocker
nor an active implementation task. Preserve the finding without designing a fix or
claiming recipe support consolidated. This scope decision does not request deletion
of the existing provisional code. Current review remains focused on the minimal
builder, shared JSON grammars and pure-HTML rendering.


### Strict Source contract — 2026-09-20

**Strict Source implementation — 2026-09-20, locally verified.**
Constitution §13 and AGENTS.md forbid unrequested compatibility paths. The renderer
now requires SourceBag/SourceBagNode and their builder ownership. Removed the five
ordinary-Bag access adapters, attr.tag fallback, method-presence fallbacks and the
HtmlElement fallback builder. Fragment preparation uses a genuine SourceBagNode;
no plain Bag conversion was introduced. Data Bags remain unchanged.

Corrected two defects in their owners: generic Builder no longer resets a child
Bag's backrefs after insertion; BagNode now notifies subscribers for nodeTag-only
updates through the existing event. Renderer subscription relies on Bag-owned
backref setup instead of resetting the Source's structural parent.

Verification: Bag 606/606 on Node; installed generic Builder 92/92 and Gramlot 62/62
on Node and Bun, including Python transport in the configured environment. Rebuilt
browser bundles. Negative checks reject ordinary Bag roots/branches, ordinary nodes,
attr.tag-only and unbound Source, including direct writes before mutation. Tests
support the explicit contract; they do not justify extra mechanisms. Parent reviewed
the code and a Sol agent checked for remaining compatibility paths read-only.
All work is local/uncommitted; no release, push or deployment. Recipes, their
collection-copy defect, whole-Source replacement and staging-policy design remain
deferred. See GC-093 §090 for the strict-path review.


### Primary-path cleanup — 2026-09-20

**Primary-path cleanup — 2026-09-20, implemented and verified locally.**
Removed unused renderer mount/removal hooks, the unused array-shaped renderedItem
input, optional setup/main calls despite inherited required methods, and Gramlot's
repeat Source type check after the generic typed loader already enforces it.
Standalone now requires Page inheritance as hosted pages do, validates the declared
CSS array, and uses the inherited title without a second fallback default.
Generic wrapSource now checks SourceBag/SourceBagNode explicitly; a parentBag-shaped
object is insufficient. Removed the unreachable empty-schema fallback after the
unknown-tag rejection. No class, compatibility API or alternate path was added.

Checked consumers in core and sibling examples/hosts before removing the unused
hooks. Installed Builder tests: 93/93; Gramlot: 63/63, on both Node and Bun. New
negative coverage checks unrelated page classes, invalid metadata and non-Source
handles. Browser bundles rebuilt; Python unchanged. Work remains local/uncommitted.

Next unresolved contract: Gramlot's inherited builder.render() route does not share
the event-driven renderer lifecycle (GC-093 R2); no bridge, alias or no-op was added.
The owner must settle whether Gramlot exposes explicit rendering as well as Source
events before that route changes. Recipes, Source replacement and staging-policy
redesign remain deferred. Passing checks are not broader architectural acceptance.


**Static Builder parity — 2026-09-21, implemented and verified locally.**
The owner requested Python/JS behavioral parity with explicit known differences.
Changed the owning genro-builders-js library, without Gramlot adapters or new classes:
- runtimeValues expands `${name}` templates after pointer resolution, consumes their
  input attributes, maps null template inputs to empty text, and rejects missing names;
- direct BagResolver attributes use resolve(), leaving caching/loading to Bag;
- value reads carry Data-node `_wdg` attributes over authored attributes, excluding
  data-elements and attribute-path reads;
- static HtmlRenderer supports includeDatapath, authored-ID precedence and stable
  generated IDs, matching Python's include_datapath option.

Verification: Builder 97/97 and Gramlot 63/63, each on Node and Bun. Installed the
local archive into Gramlot and rebuilt browser bundles; floating dependency manifests
were restored. No commit, publication or deployment. Checks establish these bounded
behaviors, not complete cross-language parity.

Remaining differences: Python %-format masks (no partial formatter introduced),
Python/JS value-to-string differences including template booleans/containers,
async resolver consumption by synchronous renderers, YAML and additional dialects,
filesystem targets/readback, TargetWrapper class, and portable validator/type limits.
A direct synchronous resolver is covered; no asynchronous rendering contract was added.
Recipes remain deferred. The earlier explicit Gramlot render lifecycle question is
still unresolved and is independent of static Builder parity.


**Formatting review — 2026-09-21.**
Found existing PoC helpers `js/dom/src/display-format.js` (formatDisplay) and
`number-format.js` (formatNumber): `format` handles numeric/temporal presentation,
`places` and locale; `mask` wraps the resulting text using `%s`. Removed the newly
attempted scalar percent formatter and its two tests from Builder JS; it had not
been installed in Gramlot. The other parity corrections remain, with 97 Builder
tests passing. No PoC code was promoted. Python Builder currently uses Python `%`
on Data-node masks; PoC formatting uses explicit Source options and has different
null/metadata behavior. A shared contract and ownership must be settled before
porting, rather than adding a second formatting implementation.


**Approved format/mask separation — 2026-09-21, implemented locally.**
Owner confirmed the PoC contract: format/places/locale format scalar presentation;
mask wraps that text with `%s`. Python stays unchanged; a Python backport may be
considered later. This supersedes the proposal to emulate Python percent masks.
Ported only the pure numeric/temporal formatting functions into Builder JS's HTML
renderer. No reactive handler, input parser, widget or new class was introduced.
Source options are consumed for scalar content, never input values, HTML attribute
values or Data logic. Ancestor locales resolve in their declaring Data scope.
Portable static fallback is the host Intl locale, with no browser/global application
lookup. Python Data-node mask behavior remains a known difference; it is not silently
mapped onto Source presentation. `%f` and `%d` are literal mask text, not directives.

Verified Builder 101/101 and Gramlot 63/63 on Node and Bun; installed the local
archive, restored floating manifests and rebuilt bundles. No publication or commit.
The static renderer is covered; this does not claim live Gramlot formatting/bindings
were ported. Existing scalar conversion, Intl locale and rounding differences are
explicit. Found a separate authoring defect: Date as the first positional argument
is treated as an attributes object (source-bag.js parseArgs); typed Data date reads
work. Record and resolve the owning API separately; no coercion workaround added.
Remaining parity items include YAML/other dialects, target facilities, async resolver
consumption, validators and value-to-string differences. Recipes remain deferred.


**Direct typed authoring values — 2026-09-21, fixed and verified locally.**
Fixed the Date argument defect in owning Builder JS source-bag.js splitArgs.
Only plain records (Object.prototype or null prototype) are attribute dictionaries;
Date and other class instances remain positional values. No Date-specific adapter,
conversion or extra representation was added. Root and nested authoring retain the
same Date instance and render 11/09/2026 with format='dd/MM/yyyy'. Attribute-only
calls, including null-prototype records, remain supported. This closes the Date
finding in the formatting checkpoint below.

Builder 102/102 and Gramlot 63/63 pass on Node and Bun. Local Builder archive
installed, floating manifests restored, browser bundles rebuilt. Python unchanged;
no publication or commit. Other parity gaps and deferred decisions remain open.


2026-09-21: GC-105 now records Builder Python/JS differences. Owner accepts the
missing JS TargetWrapper base class temporarily; no class added. Other gaps retain
their status. See [register](../../docs/internal/105-builder-python-js-differences.md).

**Builder JS final local review and patch bump — 2026-09-21.**
Prepared genro-builders-js **0.1.1** from local 0.1.0; no commit, push or release.
Reviewed source responsibilities, exports, grammar validation, typed Source,
renderers, comments, package metadata and documentation. Fixed positional tuple
validation against Python's existing contract. Replaced a grammar test silently
skipped by missing temporary files with mandatory bundled-collection checks.
HTML5/SVG JSON matches current Python exports. Removed stale comments about
shorthand grammar and alternate BagNode rendering; no new class/compatibility path.

Replaced the stale README with an entry point and created a six-page classic RTD
Sphinx manual, a differences register and a local changelog in the Builder repo.
Version comes from package.json; Node syntax floor is 18.20.0, with actual checks
on Node 23.11.0 and Bun 1.3.14. Deferred recipes and whole-Source replacement are
explicit; surplus authoring arguments are a recorded contract limitation.

Verified source and installed archive: Builder 103/103, Gramlot 63/63, on Node and
Bun; strict Sphinx build passed. Package inventory: 30 files, no dependencies or
build/temp artifacts. Installed 0.1.1 locally in Gramlot, preserved floating first-
party manifests and rebuilt bundles. Current Builder repo has no configured remote
or prior commit. The owner clarified 'bup' means bump only; earlier local-only
restriction remains. This closes the bounded review, not all Python parity gaps.


**0.1.0 scope clarification — 2026-09-21.**
Owner confirms recipes are outside the current scope in both Builder and Gramlot;
they will be designed later. Do not repair the inherited recipe declaration/helper
conflict as part of 0.1.0. Builder JS/Bag JS remain read-only. Existing provisional
recipe code is not evidence of accepted support. Removing recipe processing from
the active Gramlot path remains pending; no tests have been excluded in this turn.

0.1.0 targets native HTML and live Source changes only, not reactive Data bindings.
The working GramlotBuilder now inherits HtmlBuilder; GramlotRenderer directly
inherits RendererBase, and hosted bootstrap uses the host-language HtmlBuilder.
These in-progress changes are not yet accepted or fully verified. Latest diagnostic
run: 56 passing / 7 failing JS tests, involving the collection inheritance collision
and deferred recipe behavior. Do not replace this evidence with an all-green claim.

Collection discussion remains open: identical dataSetter/dataFormula/dataController
exports are accepted when both documents were loaded, but rejected when the first
declaration is inherited from HtmlBuilder. The dependency has not been modified;
no Gramlot workaround or collection exclusion has been introduced.

