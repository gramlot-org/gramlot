# 088 · Native HTML implementation plan


> Historical review/plan. Current execution: [GC-110](110-native-html-readiness.md#gc-110-020); status: [GC-070](070-work-status.md).
> This document retains earlier decisions and checkpoints. Statements about pending
> extraction or completed verification refer to their recorded stage, not current
> architectural acceptance. GC-087's agreed ownership remains binding; GC-094 does
> not promote later review proposals into owner decisions.

Document ID: **GC-088**. Date: **2026-09-19**.
Status: **local implementation and final verification complete; owner review and upstream consolidation pending**.

[Full counterpart](../../docs/internal/088-native-html-plan.md).
[Ownership](087-javascript-layer-boundaries.md). [Status](070-work-status.md).

<a id="gc-088-005"></a>

## 005 · Delivery boundary

One equivalent Python/JS Hello World in apps/hello-world; native HTML insert,
delete, setters, rebuild and cleanup tested in framework fixtures. Python profiles:
ASGI/Uvicorn, FastAPI, Kajenn, Flask. JS: Node, Bun without Python workers.
Standalone: both Python and JS author at build time; embed Source plus browser runtime.
Eight bounded profiles, not a cross-language/database Cartesian product. All eight
profiles passed the local installed-artifact browser matrix; DB folders remain placeholders. No database/BagDB,
ORM/SQL implementation, widgets, CSS shorthand, bindings/controllers/resolvers,
GitHub functionality, production auth, multipage offline editing/printing/export,
package publication or deployment.

<a id="gc-088-010"></a>

## 010 · Baseline and ownership

Reuse locally verified typed Source/recipe/HTML code and tests; no bulk PoC copy.
Bag/TYTX own tree/events/codecs. Builder owns grammar, SourceBag, recipes and only
neutral RendererBase. DOM JS owns HTML dialect/render/update/cleanup. Gramlot owns
specialization and page/host/transport coordination. Adapters own engine integration;
standalone owns packaging; examples own declarations/config. Before extraction, genro-dom-js was mixed and generic finalization used DOM.
The ledger below records the completed separation. Preserve unrelated edits.

<a id="gc-088-012"></a>

## 012 · Execution ledger — 2026-09-19

| Phase | Current result |
| --- | --- |
| 0 | Local generic repository `genro-builders-js` on develop; DOM re-scoped; SOURCE selected; plain ESM declarations and renderer APIs implemented. Remote consolidation pending. |
| 1 | Python↔JS JSON/MessagePack typed root/branch tests, native events, references, render failure and cleanup verified. |
| 2 | Generic package installed and tested without DOM globals in Node/Bun. |
| 3 | Concrete DOM renderer, metadata hooks and single-use detached candidate preparation implemented and tested. |
| 4 | Installed wheel/npm graph and packaged runtime assets verified; owner TYTX browser loading and unconstrained transitive first-party metadata are fixed and included in the final rebuilt graph. |
| 5 | Real listeners and Chromium pass for Python Uvicorn/FastAPI/Kajenn/Flask and JS Node/Bun; actual installed Hello World JS launchers pass. No DB provider initialized. |
| 6 | Python/JS native-html-v1 artifacts built from installed packages pass Chromium with network blocked, typed mutations, cleanup and no external request. |
| 7 | Documentation/maps and bounded review record updated; fresh floating upstream installation, develop/main consolidation and owner acceptance remain open. |

The final transitive graph was rebuilt and all eight profiles reverified. Owner
instruction: keep all work local for review; no commit, push or remote creation.
Local archive success is not fresh upstream installation or owner acceptance.
See [GC-089](089-native-html-handoff.md) for final counts and durable worktrees.

The phase specifications below preserve the original plan and pre-extraction
inventory. Their future tense and baseline observations are historical; the
execution ledger above records completed local delivery.

<a id="gc-088-015"></a>

## 015 · Phase 0 — Freeze the extraction contract

Choose repository/package homes and entry points, file/test inventory and JS
declaration semantics. Suggested names genro-builders-js + re-scoped genro-dom-js
remain proposals; record supersession of retirement decision. Resolve SOURCE vs
XS and decorator syntax/build support. Distinguish Python element/abstract/
container/component semantics and persistent recipes from render-time expansion.
Gate: unambiguous bounded APIs, ownership and transport; no invented SQL framework.

Execution inventory (2026-09-19): mixed `renderer/base.js:finalize` creates DOM;
`builder-base.js` imports browser collection/CSS helpers. Proposed first patches:
abstract generic finalization plus DOM-specific finalizer, then separate browser
collection setup before extraction. Generic candidates: SourceBag, recipe, pointer/
utils, neutralized builder/renderer bases. HTML/targets/browser collections belong
to DOM; split current Gramlot renderer/HTML handler by responsibility. Review
BuilderHandler/SVG/application separately rather than copying them into acceptance.
Recommend plain ESM declaration helpers, without a decorator transpiler. These are
phase-0 recommendations, not completed API/extraction claims.


<a id="gc-088-020"></a>

## 020 · Phase 1 — Lock the observable contracts

Baseline installed artifacts: Python↔JS JSON/MessagePack typed roots/branches,
node tags/scalars, identity-preserving association, first and nested events,
ordering, setters/rebuild, refs/cleanup, main/remote recipe preprocessing, failures,
stale responses and disposal. Reject coercion/unknown types. Gate: observable
package contracts; failures assigned to owners. Bag changes only for proven defects.

<a id="gc-088-025"></a>

## 025 · Phase 2 — Extract the generic Builder JS

Independent generic package: grammar/declarations, SourceBag/typed integration,
in-place association, recipes, neutral RendererBase. Move tests/provenance. Agree
and implement declaration subset needed by HTML; test inheritance, abstracts,
defaults/validation/discovery. Proposed minimum: element/abstract declarations; explicitly inventory/defer unimplemented decorator families.
Gate: Node+Bun tests without DOM globals/shims; typed interop; tiny test-only
string/object dialect renderer consumes installed package without Gramlot/DOM JS. Inspect runtime imports/browser API usage and exercise traversal/finalization without browser globals.

<a id="gc-088-030"></a>

## 030 · Phase 3 — Establish the HTML/DOM dialect

DOM JS owns HTML grammar, concrete renderer and native handler; move DOM finalize
and generic mutation/lifecycle out of base/core. Define Gramlot hooks without
copying renderer. Gate: standalone DOM package handles pure HTML, fragments,
scalars, void tags, ordering, complete insertion metadata, updates and cleanup;
jsdom+Chromium pass; generic tests still browser-free. No widgets/CSS shortcuts.

<a id="gc-088-035"></a>

## 035 · Phase 4 — Reconnect Gramlot and verify distributions

Thin Gramlot specializations consume public packages; preserve Python page/server/db
ownership and detached main/remote preprocessing. Remove mixed/duplicate paths and
any snapshot/hydration workaround. Include exports/assets in pip/npm packages;
resolve core js/ package acquisition without pretending repository root is npm-ready.
Gate: clean artifact graph installs without sibling imports/symlinks or node_modules
patching, then fresh floating accepted-upstream consumption. No first-party pins or
lockfiles, no implied release. Core/cross-language/browser checks pass.

<a id="gc-088-040"></a>

## 040 · Phase 5 — Executable hosted profiles

First Python ASGI/Uvicorn + JS Node, then FastAPI/Kajenn/Flask/Bun. Engine code in
owning adapters, config/commands in example. Verify Kajenn actual integration.
Initial inventory: real Python adapters and Node listener target the old PoC API;
all six example server profiles are placeholders and Bun has no reusable bridge.
Assign generic ASGI ownership; Node repo is proposed for both JS engines. Package a
public browser runtime asset before porting; current npm/Python archives do not
include the generated bundle. Remove FastAPI's first-party wheel pin/PoC source
and Node's sibling runtime lookup from the new profiles. Inventory is read-only
source evidence, not host revalidation.

Gate per profile: real listener+Chromium, one h1, bootstrap/assets/main, native
mutations/remote block in tests, page-ID errors/expiry and clean shutdown. Same
Python/JS declarations across matching hosts, no database. jsdom alone insufficient.

<a id="gc-088-045"></a>

## 045 · Phase 6 — Bounded standalone HTML

Same pages/runtime, build-time Python or JS authoring, embedded typed Source/recipes/assets and notices; browser-time authoring is not required. Explicit
framework offline bootstrap, no mocked app HTTP. Add versioned native-HTML profile;
do not claim current broad standalone data/multipage/print capabilities. Replace
ordinary-Bag hydration requirement; reject remote/server operations. Gate: Python
and JS outputs run via file:// in network-blocked Chromium, same Hello World,
native mutation/disposal tests, zero requests and no server process.

<a id="gc-088-050"></a>

## 050 · Phase 7 — Close milestone

Fresh-install full matrix, recorded commands/revisions/results, paired maps/internal
operations/user guide, port reviews. Verified/accepted develop→main, with external
push/publication separate. Gate: documented reproducible use without private paths
or manual dependency patches, no database, honest profile limits. Partial profiles
remain incomplete despite aggregate passing tests.

<a id="gc-088-055"></a>

## 055 · Sequence and agents

0→1→2→3→4→(5 and 6)→7. Sol agents own bounded work; coordinator reviews contracts
and integration. No Bag implementation agent absent a defect. Generic API precedes
DOM work. After4, Python hosts, JS hosts and standalone can run independently.
Update paired docs per phase. Start with decisions and baseline; writing this plan
does not execute implementation or authorize new pages/databases.
