# 094 · Historical native HTML design consolidation plan

Document ID: **GC-094**. Date: **2026-09-20**.
Status: **local minimum matrix verified; architectural acceptance open**.

2026-09-21 checkpoint: GC-093 sections 100–105 and GC-070 supersede old active
recipe/DOM-layer and pending-matrix descriptions below. Current path is generic
Builder → GramlotRenderer, native HTML Source live, no recipes. Eight local profiles
pass; prevalidation/staging policy and the other six review findings remain open.
The following phase descriptions preserve historical planning, not new authority.


**Strict Source decision implemented locally — 2026-09-20.**
Only SourceBag/SourceBagNode are supported for rendering; ordinary-Bag support is
removed, not an unresolved compatibility choice. Constitution §13 governs future
changes. Implementation and checks: GC-093 §090 and GC-070. Recipes remain deferred.

**Owner scope decision — 2026-09-20:** recipes remain outside the current work.
Their addition will be addressed later. Park the duplicate collection state used
for recipe child construction with that future work; it is neither a current blocker
nor an active implementation task. Preserve the finding without designing a fix or
claiming recipe support consolidated. This scope decision does not request deletion
of the existing provisional code. Current review remains focused on the minimal
builder, shared JSON grammars and pure-HTML rendering.

**Reactive ownership settled:** GC-087 §035 supersedes the Application-compatibility question: reactivity belongs to Gramlot. DOM JS deletion is not decided. Implementation/checks: §110.

**Historical priority at this checkpoint — Builder JS first:** the owner now asks to consolidate the
generic JS builder before building the remaining layers on it. The reference is
the current Python builder with JSON grammar. Bootstrap migration, further DOM/
Gramlot work and the host matrix wait for this foundation; see GC-094 §105.

**Builder scope clarified:** GC-087 §030 now records the owner's current-Python
porting criterion, JSON grammars and generic static/object rendering. Use that as
the reference for phase 1, not the old JavaScript reactive application engine.

**Latest owner direction:** section 085 supersedes the earlier question gates and
requests to design solutions for unresolved cases. Implement the agreed scope;
record unresolved problems for the final report, without inventing their solutions.

[Concise counterpart](../../docs_llm/internal/094-design-consolidation-plan.md).
[Working ledger](070-work-status.md). [Code review](093-class-design-review.md#gc-093-040).

<a id="gc-094-005"></a>

## 005 · Purpose, authority and baseline

Finish the agreed native-HTML foundation with a small, readable implementation,
clear responsibilities and extensible contracts. Do not restart the project, bulk
port the PoC, or rewrite working code merely to match new names. Reuse code only
where its design fits the agreed contract.

This was the proposed execution sequence on 2026-09-20 and is superseded by [GC-110](110-native-html-readiness.md#gc-110-020). GC-088 remains historical delivery
evidence, not a second active task list. GC-070 is the single progress ledger;
GC-093 contains findings, not owner-approved architectural decisions. The owner subsequently authorized execution on 2026-09-20 where decisions are
clear, requiring questions on uncertain architecture. Open choices below are not
automatically approved by that authorization. The existing uncommitted working trees are the baseline; preserve
unrelated changes. All work remains local: no commits, pushes, remote creation,
releases or deployment. Do not switch/reset dirty checkouts to enforce branch policy.
Future develop/main consolidation requires the corresponding authorization.

The current implementation includes Python/JS pages and builders, typed Source,
recipes, DOM updates, hosts and standalone. These are material to review and reuse,
not proof that their architecture is accepted. Previous runtime results are dated
verification evidence. They do not close any design gate below.

<a id="gc-094-010"></a>

## 010 · Decisions already made

| ID | Binding decision | Evidence |
| --- | --- | --- |
| D1 | Keep Bag/TYTX, generic Builder, DOM and Gramlot responsibilities separate. Fix missing mechanisms in their owner; no consumer-side coercion or compensating layer. | Owner discussion; GC-087 §005/025; constitution §7/10 |
| D2 | Generic Builder owns grammar, SourceBag, recipe expansion and a browser-independent renderer base. Concrete renderers belong to dialects; future SQL need not import DOM. | Owner builder→DOM→Gramlot decision; GC-087 §005 |
| D3 | Both GramlotBuilders consume shared JSON collections with exported declaration information. Do not maintain a second handwritten HTML whitelist. Future component definitions originate in JS; Python consumes their descriptions. | Owner collections decision; GC-060 §015/020/030; GC-092 |
| D4 | URL→host resolves Page, issues page ID and renders bootstrap. Browser prepares Data/Source roots, backrefs and subscriptions before main returns typed Source. The first insertion invokes the renderer. | Owner three-step bootstrap description; GC-065/080/088 |
| D5 | One reactive DOM coordinator receives native Bag subscriber events. Insert builds at the source location; delete cleans the subtree and owned resources; update uses setters where applicable, otherwise replacement. A supplied HTML destination/default root ID anchors it. | Owner insert/delete/update and renderer naming decisions |
| D6 | RecipeExpander runs on detached main and remote @source blocks before observed Source insertion. Recipe expansion is distinct from rendering and future component behavior. | Owner pipeline decision; GC-080 §015 |
| D7 | Typed Bag transport reconstructs registered SourceBag classes. Generic builder binds ownership in place. No ordinary-Bag→SourceBag conversion, snapshot/hydration protocol or second observable tree. | Owner rejection of patches; GC-080 §010 |
| D8 | Python and JS Page/neutral Host contracts support engine-specific adapters. Python does not execute browser behavior. Preserve generic Python object/string rendering; do not restore its removed dynamic engine. | Owner host/page decisions; GC-075 §010/015 |
| D9 | First milestone: pure HTML, literal text/native attributes, equivalent Python/JS Hello World. Finish FastAPI/Uvicorn first; then refresh the other hosts and standalone. | Owner latest priority; GC-070/088 |
| D10 | No first-party dependency pins/caps/lockfiles. Keep internal architecture separate from the public developer guide and update paired docs/maps. | Owner instructions; constitution §9/12 |

HTML5 currently exports from Python HtmlBuilder; that is the recorded bootstrap
source, not a decision to abandon future JS-owned component descriptions. Naming
suggestions such as authoring/hosting were discussed, not approved package renames.
Likewise GC-093's proposed names and class movements are recommendations only.

<a id="gc-094-015"></a>

## 015 · Scope and intended flow

```text
Page (Python or JS)
  → GramlotBuilder + collection grammar
  → typed SourceBag → TYTX
  → browser main / remote reception
  → registered decoding + generic builder association
  → detached RecipeExpander
  → insertion/replacement in the observed Source
  → native Bag event
  → GramlotRenderer → concrete DOM rendering/update/cleanup
                         uses generic RendererBase traversal contract
```

The root and subscriber exist before reception. Embedded standalone enters the
same Source pipeline after transport, not a second rendering engine. Validation
and failure boundaries must be explicit in phase 0; this diagram does not approve
trial rendering, a transaction system or a new Bag event payload.

Included: minimal authoring/collections, typed transport, recipes, HTML lifecycle,
references, neutral Page/Host, reusable adapters, one Hello World per language and
bounded native-HTML standalone. Preserve equivalent collection use across languages.

Deferred: CSS shorthand; styling/binding/labeling/boxing capabilities; production
custom widgets and automatic custom-element discovery/registration; reactive SVG;
Data controllers/resolvers; SQL/ORM and real database adapters; Gramlot Git features;
full legacy inventory; general transactions and formal Live Object Tree semantics.
Database directories remain placeholders. Do not introduce GNR-prefixed new APIs.
Coverage reporting is a later engineering task, not a substitute for design closure.

<a id="gc-094-020"></a>

## 020 · Recorded open issues — not prerequisites for agreed work

The following issues arose during review. They do not authorize new guarantees,
new architecture or an expansion of the current milestone. Work supported by D1–D10
continues; unresolved behavior is recorded for the final problem list.

| Issue | Observed limitation | Current treatment |
| --- | --- | --- |
| Q1: native DOM failure after a direct Source write | Pre-write/trial-render guarantees were not requested; current implementation introduced extra machinery. | Owner question withdrawn. No new failure/recovery mechanism; report existing complexity and limitations. |
| Q2: generic versus live render contract | Cached renderer activation and static target APIs have different requirements. | Preserve agreed inheritance/association; report remaining mismatches rather than invent a factory/registry design. |
| Q3: inherited reactive code | Exported DOM consumers still use it. | Preserve known consumers; only perform responsibility changes justified by existing decisions. No blanket deletion or new compatibility layer. |
| Q4: collection/recipe distribution | Explicit configuration exists; automatic distribution does not. | Keep explicit configuration in this slice; report the missing capability. |
| Q5: server record closure on browser disposal | Browser and server lifetimes are not fully connected. | Report the gap; do not invent a new lifecycle protocol. |

No unanswered issue in this table blocks independent, agreed work. If a specific
change cannot be made without a new decision, leave that change unresolved and
include a concrete example in the final report.

<a id="gc-094-025"></a>

## 025 · Phase 0 — Set the concrete contracts

**Depends on:** this plan and current source inspection. **Owner:** coordinator.
**State:** class/operation and consumer inventories recorded (§075–080).
The proposed extra decision gates are withdrawn by owner instruction (§085).

Deliver a compact API/class table for Bag, generic Builder/Source/Renderer/Expander,
DOM coordinator/handler, GramlotBuilder/Renderer/runtime, Page/Host and transport.
For each: responsibility, state owned, base/collaborators, callers and cleanup.
Mark each existing class keep/simplify/move/remove, with reason and consumer impact.
Include one bootstrap trace and one insert/update/delete trace, matching D4–D6.
Inventory the runtime/library consumers affected by Q2–Q3; distinguish old API
compatibility from new abstractions. Record Q1–Q5 as open issues, not requests
to invent solutions. List exact owning files for agreed changes in the following phase.

**Allowed changes:** decision records, class/API sketches and maps of proposed
changes; no runtime implementation. **Exit:** every phase-1/2 contract has a single
meaning within existing decisions; unresolved portions are explicitly excluded
and retained in the final problem list. Do not close with 'the agent
will decide while coding'. No demand to approve already-decided responsibilities again.

<a id="gc-094-030"></a>

## 030 · Phase 1 — Minimal generic foundations

**Depends on:** phase 0. **Owners:** Python/JS Builder libraries; Bag/TYTX only for
an identified defect in their contract. **Audit findings:** R1, R2, R5, R8.

Implement the settled generic authoring and traversal contracts. Reuse collection
loading, SourceBag and native serialization; preserve ordinary Python object/string
renderers. Separate only the reactive machinery identified as a misplaced
responsibility; preserve its real consumers in the assigned owner. Generic recipes
must not know Gramlot reference names. Remove duplicate expansion construction where
possible under the chosen ownership contract. Do not add new wire tags or codecs.

**Deliverables:** actual edited-file list and consumer migration, smaller base API,
explicit extension hooks, list of removed mechanisms and retained compatibility.
**Not allowed:** HTML/Gramlot imports in generic code; a new SQL implementation;
blanket deletion of all reactive support; no-op overrides hiding inherited behavior;
new Bag mechanisms solely to accommodate a renderer workaround.
**Design exit:** authoring and generic traversal are explainable without browser
lifecycle; each retained mixin has a coherent purpose and stated requirements.
**Then verify:** affected generic consumers, collection constraints and typed
Python/JS transport. Reopen design on failure; do not add a fallback to force success.

<a id="gc-094-035"></a>

## 035 · Phase 2 — One native DOM lifecycle

**Depends on:** phase 1 for settled contracts; unresolved Q1–Q2 work remains excluded. **Owner:** DOM JS; Bag only for agreed
Bag-owned changes. **Audit findings:** R2–R4.

Implement one event-driven coordinator with HTML creation/setter/cleanup handling.
Keep Source as authority, mount records as necessary DOM associations, and the
agreed generic renderer extension. Define target, attach/mount, update and disposal
once. Use actual subscriber payloads, not a new parallel mutation protocol.

Replace duplicated candidate/projection/trial-build paths according to Q1; list
what is deleted. Keep reference hooks generic. Encapsulate mounted-node lookup
rather than exposing record storage. A constructor must not subscribe invisibly
if the settled lifecycle requires a separate activation step.

**Not allowed:** a second live tree, double DOM construction as an undocumented
validation technique, partial Bag-shaped facades with unstated semantics, arbitrary
callback rollback guarantees, new component/capability hierarchy.
**Design exit:** insert/delete/update can each be traced through one path; validation
has a stated boundary; every listener/record/resource has one cleanup owner.
**Then verify:** native HTML ordering, setters/rebuild, rejection behavior specified
by Q1, cleanup and initial/nested events in the owning library/browser.

<a id="gc-094-040"></a>

## 040 · Phase 3 — Thin Gramlot integration

**Depends on:** phase 2. **Owner:** Gramlot core. **Audit findings:** R4–R5, R7–R8.

Connect GramlotBuilder, GramlotRenderer and runtime using settled public owner APIs.
Preserve prepared roots before main, typed decoding and detached recipe expansion
for both main and remote. Apply Gramlot-specific reference rules here. Preserve
shared JSON collections and remove any duplicate declaration source. Keep server
page authoring independent of concrete browser rendering imports.

Use one Source preparation operation for main/remote/embedded entry points; transport
and remote-request cancellation remain distinct concerns. Keep collection propagation
to recipe builders explicit; no hidden discovery system. Address names where ownership
is now clear (transport, reference registry, reference resolution), documenting actual
renames without speculative package reorganization. Review Q4 only if this slice
requires more than explicit collection configuration; otherwise record the omission.

**Design exit:** Gramlot contains application policy and orchestration, no copied Bag,
grammar or DOM engine. No caller accesses renderer storage to determine lifecycle.
State explicitly what a third-party collection can do now and what remains future.
**Then verify:** cross-language authoring and the complete main/remote/embedded Source
path; no extension of application capabilities to make fixtures work.

<a id="gc-094-045"></a>

## 045 · Phase 4 — Page and neutral Host, FastAPI first

**Depends on:** phase 3; a new Q5 lifecycle protocol is excluded pending a later decision. **Owners:** core Page/Host and FastAPI adapter.
**Audit findings:** R6–R7. Other adapters are inventoried but not expanded yet.

Factor shared page execution per language into the smallest useful implementation;
hosted and standalone entry points reuse it with explicit policy differences. Align
main/remote method selection, result rules and errors. Keep filesystem resolution,
HTTP adaptation, bootstrap generation and page-record ownership identifiable; use
functions where a class adds no state or substitutable behavior. Complete the chosen
close/dispose contract without inventing persistent Page sessions.

Retain Python-first and equivalent JS page authoring. JS neutral contracts are
reviewed here; Node/Bun listener verification waits for phase 6. Leave database
placeholders untouched. Folder renames require a justified map, not dissatisfaction
with a name alone. Do not refactor unrelated host functionality.

**Design exit:** one Page execution path per language; neutral core has no engine
imports; an adapter supplies its own request/response and identity integration.
**Then verify:** FastAPI/Uvicorn bootstrap/main/remote/close as applicable to Q5;
standalone compilation shares execution without pretending to have a server.

<a id="gc-094-050"></a>

## 050 · Phase 5 — Review the complete small implementation

**Depends on:** phases 1–4. **Owner:** coordinator.

Read the resulting code as a new collaborator: follow an authored div to the DOM,
then one nested insertion, one setter update, one replacement and one deletion.
Review class necessity, inheritance contracts, names, state duplication, mixin
requirements and cleanup. Compare every change with phase 0; classify deviations
explicitly. Close audit findings only with code evidence or a documented decision.

Update internal operating guide, logical repository maps for framework/examples,
public classes/hosts/page/extension placeholders, paired mirrors and handoff. Keep
planned capabilities out of current API claims. Build local distribution artifacts
using floating manifests; no installed dependency patches or sibling-import shortcuts.

**Design exit first:** a readable code path with no undocumented alternative engine;
remaining limitations are explicit and within the agreed milestone.
**Then verify:** focused affected contracts plus real FastAPI/Uvicorn Hello World and
dynamic Source/remote lifecycle from installed artifacts. Existing unrelated library
failures remain attributed; no pins or compensating fixes.
**Owner checkpoint:** present code/design changes and usable single-host result before
expanding to the matrix, as previously requested. Verification is necessary, not
architectural acceptance. Do not treat silence as acceptance.

<a id="gc-094-055"></a>

## 055 · Phase 6 — Refresh the agreed host and standalone matrix

**Depends on:** phase 5 owner checkpoint. **Owners:** adapter repositories and examples;
core changes only for a demonstrated shared contract defect.

Reuse the same Python Hello World for ASGI/Uvicorn, FastAPI, Kajenn and Flask, and
the same JS page for Node and Bun. Verify native-HTML standalone artifacts for both
languages through the shared runtime. Keep example applications in gramlot-examples;
Gramlot Git remains a separate, deferred application. Python examples remain pip
installable. No database execution, new showcase pages or per-host application hacks.

**Design exit:** host adapters connect engines to shared contracts and do not grow
alternative page/render pipelines. Any shared-contract change returns to its owning
phase and reopens dependent results; do not silently rewrite the settled design.
**Then verify:** installed artifacts, real listeners/browser and network-free
standalone; record each profile separately rather than declaring an aggregate pass.

<a id="gc-094-060"></a>

## 060 · Phase 7 — Local closure and acceptance

**Depends on:** phase 6. **Owner:** coordinator and owner review.

Produce one final class/dependency map, remaining-limit list, reproducible local
usage instructions and port disposition. Confirm obsolete implementations are
removed rather than left as alternative routes. Reconcile GC-070, GC-093,
PORT-0004 and the handoff; preserve rejected approaches as history, not active API.

**Exit:** owner accepts the bounded design and behavior; no open critical design
finding is hidden by verification results. Local acceptance does not make upstream
installation available. Commits, pushes, repository creation, fresh upstream install
and develop/main consolidation remain separately authorized future actions. Package
publication and deployment remain excluded. Do not label the milestone released.

<a id="gc-094-065"></a>

## 065 · Execution discipline and delegation

Work in dependency order. Do not assign adjacent layers to agents while their
shared contract is unresolved. When delegating, use Sol as the owner requested;
the coordinator reviews the design before code and code before runtime results.

Every bounded assignment must carry: phase/decision IDs; exact editable files and
owner repository; existing APIs to use; proposed deletions; forbidden workarounds;
explicit stop conditions; deliverables and design exit criteria. Require a short
implementation sketch before edits that affect a shared contract. Agents report
doubts to the coordinator; architectural choices not resolved by owner decisions
are asked of the owner before implementation. No 'choose anything that works'.

Stop affected edits if a new public class, shared state, second execution path,
new wire representation, behavior restriction or responsibility move is necessary
but absent from the agreed phase contract. This is not a request to ask permission
for every helper or mechanical edit. Resolve ordinary choices locally within the
contract. When a decision changes, record its reason and affected phases before
resuming; do not reopen unrelated settled areas.

For each phase, report: what changed and why; classes/mechanisms removed; actual
versus planned public API; unresolved questions; design review outcome; subsequent
verification outcome. Update GC-070 after meaningful progress. Track states as
pending / active / blocked-on-decision / design-reviewed / verified / accepted.
The coordinator must apply the same discipline to their own edits.

<a id="gc-094-070"></a>

## 070 · Current ledger and immediate next action

| Phase | State | Next deliverable |
| --- | --- | --- |
| 0 Inventory | Recorded | Classes, native events and consumers documented; unresolved issues retained, extra question gates withdrawn |
| 1 Generic foundations | Active — bounded work only | Recipe double-copy removed, codecs relocated (§090); phase not complete |
| 2 DOM lifecycle | Pending; depends on 1 | Single event/update path |
| 3 Gramlot integration | Pending; depends on 2 | Thin typed Source/recipe/reference orchestration |
| 4 Page/Host | Pending; depends on 3 | Shared execution and explicit lifecycle |
| 5 Single-host closure | Pending; depends on 4 | Code review, docs and usable FastAPI result |
| 6 Matrix | Pending; requires phase 5 checkpoint | Six hosts and two standalone profiles |
| 7 Local acceptance | Pending; depends on 6 | Owner-reviewed local delivery |

Immediate next action is **phase 0**, not another renderer patch or matrix run.
Execution is authorized. Phase 0 has a concrete class/operation inventory and a
bounded Sol agent is checking consumers read-only. No runtime code changed.
Q1 is pending owner input; GC-070 records subsequent progress.


<a id="gc-094-075"></a>

## 075 · Phase 0 working contract inventory

Execution authorized by the owner on 2026-09-20: proceed where decisions are clear,
ask before acting on uncertain architecture. This inventory describes current
implementation and assigns intended responsibilities. It does not approve new API
signatures implicitly. No runtime implementation changed during this inventory.

### Class disposition and state ownership

| Existing class / owner | Role and state to retain | Actual callers / interface | Disposition and boundary |
| --- | --- | --- | --- |
| Bag / BagNode — Bag libraries | Values, attributes, ordered children, parent links and subscribers | SourceBag inheritance; Source/Data operations | Keep. Structural mutation/events belong here. Pre-write validators remain under Q1; no DOM/grammar knowledge in Bag. |
| SourceBag / SourceBagNode — generic builders | Typed declarative nodes, structural tags and builder association | GramlotBuilder.root/source, TYTX registry, recipes | Keep. Python inherits Bag/BagNode with private dispatch mixins; JS uses stable fluent handles. No Gramlot wrapper or coercion. |
| BuilderBase — generic Python/JS | Grammar, source root, dispatch, validation and generic rendering orchestration | GramlotBuilder; DOM HtmlBuilder/SvgBuilder; other Python dialects | Simplify only identified misplaced responsibilities. Preserve source identity and static dialect APIs. Consumers of reactive JS methods must be migrated before removal. |
| RendererBase — generic Python/JS | Traversal and dispatch to dialect fragment production | DomRendererBase and Python concrete renderers | Keep. render/renderChildren/prepareItem/renderedItem/finalize are distinct operations, not duplicate engines by themselves. Row/cell/writeback policy needs an explicit optional owner. |
| RecipeExpander — generic JS | Recipe registry, depth/cycle policy and detached expansion | Gramlot.prepareSource | Keep/simplify. expand(source) returns expanded Source; no subscriptions or mounted DOM. Move Gramlot __ref policy out. Retain one deliberate output construction. |
| DomRendererBase — DOM JS | DOM fragment finalization | HtmlRenderer, SvgRenderer, HtmlSourceRenderer | Review contract, do not delete as 'thin'. target.full belongs to current static target interface; native element destination is a different interface. |
| HtmlRenderer / SvgRenderer — DOM JS | Existing static dialect fragment generation | HtmlBuilder/SvgBuilder and Application path | Preserve existing consumers; not the Gramlot native-HTML live coordinator. No SVG integration or CSS capability port in this milestone. |
| HtmlSourceRenderer — DOM JS | Source subscription, node→DOM associations, insertion/update/removal, resource cleanup | GramlotRenderer, native DOM consumers | Simplify to one live-update path. State is mount records plus necessary lifecycle resources, not a second authoritative Source. Failure preparation depends on Q1. |
| HtmlElement — DOM JS | Shared native element creation/attribute update/text policy | HtmlSourceRenderer | Keep as collaborator; it is not a component base or per-element model. A more explicit handler name is a later naming edit. |
| GramlotBuilder — core Python/JS | Collection selection and Gramlot declaration policy, reference descriptors | Page source_builder/sourceBuilder; runtime builder | Keep as dialect. Browser behavior is inert during server authoring. Renderer association must not import browser concrete code into the server graph or hide subscription in a property read. |
| GramlotRenderer — core JS | Assemble Gramlot reference policy with concrete DOM renderer | Gramlot runtime | Keep as dialect specialization, not a duplicate renderer. No independent traversal/event system. |
| References — core JS | Live opaque reference→node/DOM index | GramlotRenderer hooks and Gramlot.reference | Keep; registration/removal follows mount lifetime. Rename/module move later; no Gramlot ref knowledge in generic recipes. |
| Gramlot — core JS | Data/Source roots, page ID, main/remote coordination, request cancellation and runtime lifetime | Host bootstrap and standalone mount | Keep. It owns one active renderer, not its record implementation. A shared Data Bag is passed to builder; Source is builder.source. |
| MainTransport — core JS | HTTP endpoints/fetch adapter | Gramlot.start/remoteSource | Keep responsibility, rename/module move later. Not an application controller. No own Source state. |
| Page — core Python/JS | Application main, declared remote methods, title/CSS and builder selection | Host and standalone compiler | Keep small. No server engine, DOM renderer or database connection in the base. Current instances are per execution; no persistence implied. |
| Host — core Python/JS | Page identity/registry, bootstrap coordination and authorized page operations | Engine adapters | Simplify boundaries: page execution shared with standalone; loader/HTTP handling separately identifiable. Server page lifetime remains Q5. |
| FileHost — core JS | Trusted filesystem page resolution | Node/Bun host integration | Keep specific specialization; no replication of neutral page execution. Python separation must follow same responsibility, not necessarily identical class count. |
| Bootstrap and typed Host errors — core Python | Named return value / operation failures | Host adapters | Keep where they clarify contracts. Do not replace named fields with positional records to save lines. Align JS errors later. |
| Application / BuilderHandler / DomTarget — existing DOM JS | Existing data-driven reactive application and patch delivery | Exported DOM package APIs | Preserve pending consumer review. This is not automatically accepted Gramlot runtime code and must not be silently deleted. |

Private Python _GrammarMixin and Source mixins are implementation factoring with
Builder/Bag/MRO dependencies, not independently approved capabilities. No styling,
binding, labeling or boxing mixin hierarchy is introduced here. Stateless codecs,
source-method discovery and page execution do not require new service classes.

### Source subscriber contract already present

Read directly from Bag JS bag.js _onNodeInserted/_onNodeChanged/_onNodeDeleted:

| Notification | Payload supplied by Bag | Renderer responsibility |
| --- | --- | --- |
| ins | node, pathlist, ind, evt, reason | Locate parent/sibling anchor from source identity and mounted associations, create subtree, register owned resources. |
| upd_value / upd_attrs / combined update | node, pathlist, oldvalue, attrs_diff, evt, reason | Decide native setter versus subtree replacement; do not invent a second event schema. |
| del | node or node array, pathlist, ind, evt, reason | Remove previously mounted subtree/resources using retained associations; parent links need not survive deletion. |

A pre-write validator descriptor is NOT this notification payload. The former was
added by implementation and is under Q1; the latter is the established event API.
Do not confuse Bag's structural source wrapper with a redundant observable model.

### Concrete operation traces

**Bootstrap:** Host.openPage/open_page resolves Page and stores its page record;
bootstrap constructs Gramlot. Gramlot creates Data root, obtains builder.source,
associates Data, supplies the destination and establishes the renderer subscription.
Only then start() requests main. The host executes Page.main against builder.root
and serializes builder.source. Browser registered decoding binds its builder;
RecipeExpander expands detached Source; insertion at source.main produces the native
ins event; the coordinator creates/mounts HTML. Renderer construction/activation API
still needs the Q2 signature decision, but this ordering is already settled.

**Remote:** runtime checks target lifetime, cancels its previous request and calls
the exposed source method. Page execution returns typed Source. The same decode/
association/recipe operation prepares it; target.setValue replaces its children,
producing a native update. The renderer selects replacement and releases previous
children/resources. Stale replies do not replace a removed target. Failure behavior
before/after the write is exactly the Q1 decision, not a promise of generic rollback.

**Direct insertion:** authoring dispatch validates declarations in generic Builder,
then Bag inserts under the actual parent and emits ins. Renderer locates existing
parent and sibling anchor, traverses the inserted subtree through the generic
rendering hook and mounts native elements. No transport/recipe simulation is needed
for ordinary locally authored HTML nodes.

**Direct update:** Bag emits its update event with original node identity. Renderer
uses native setter handling where supported; otherwise removes/recreates the node
under the same parent and sibling position. Q1 defines native failure guarantees;
no prospective DOM copy or validation view is assumed by this trace.

**Delete:** Bag emits del for the removed node(s). Renderer uses mounted records to
release descendants, callbacks/references and HTML. Gramlot.dispose cancels its
requests and disposes its one renderer. Server record closure is a distinct Q5 issue.

### Q2 clarification from existing decisions

GC-075 already distinguishes static rendering from reactive realization. Consequently
R2 must NOT be implemented by deleting static render/finalize or forcing Python to
adopt a live traversal. The invariant is one coherent contract per operation and
one reactive coordinator for this Gramlot instance, not one universal render method.

Current signatures exposing the mismatch are BuilderBase.render(opts),
DomRendererBase.finalize(result, target), HtmlSourceRenderer(builder, source,
destination), and GramlotBuilder.renderer_html. The last is a cached getter that
subscribes; the first requires a default render mode which GramlotBuilder does not
declare, and the underlying DOM hook requires an active mount transaction.

Before phase 1 closes, specify how renderer selection remains associated with the
builder while activation/disposal belongs to the runtime, and how standalone/static
consumers use their existing target. A factory/registration API or explicit runtime
construction are alternative designs, not silently approved by this inventory.

### Phase 1 edit boundaries, conditional on contracts

- Generic JS: src/builder-base.js, src/source-bag.js, src/renderer/base.js,
  src/recipe.js and src/index.js; split helper modules only for an identified
  responsibility with consumers. Exact removals depend on the consumer inventory.
- Generic Python: builder/base.py, builder/_grammar.py and builder/source_bag.py
  only if the agreed generic authoring/lifecycle change requires it; preserve
  static renderer/dialect interfaces. Do not manufacture symmetry with JS.
- DOM JS: consumer adaptations in Application/BuilderHandler/HtmlBuilder/SvgBuilder
  must accompany a shared API move; phase 1 does not redesign their application
  capabilities. Live HtmlSourceRenderer mechanics belong to phase 2.
- Bag/TYTX: no edits authorized by this file merely because a validator exists;
  retain the established registered transport/event API. Mutation-policy edits
  require Q1 resolution and their owner contract.
- Core: update dependent imports/callers only when required by an agreed library
  API; application orchestration changes remain phase 3.

Current gate: Q1 has been asked of the owner, not answered in this record. Q2 API
selection and Q3 affected-consumer migration are still open. Only inventory and
contract documentation are changing; no runtime work is being smuggled into phase 0.


<a id="gc-094-080"></a>

## 080 · Phase 0 consumer inventory and decision status

Read-only Sol inventory, independently checked against package exports, Application,
BuilderHandler.live and actual DOM examples. No test result used as design evidence.

| Confirmed consumer | Dependency | Consequence |
| --- | --- | --- |
| DOM src/application.js → src/builder-handler.js | handler assignment/create, renderNodes, _writebackMap lookup | Existing complete reactive runtime; change together, not by deleting methods from the base. |
| DOM src/contrib/html/html-builder.js and svg/svg-builder.js | Generic BuilderBase, DomRendererBase, inherited component expansion and patch behavior | Keep known callers working during owner migration; do not confuse these with Gramlot native-HTML support. |
| DOM examples/index.html, page.html, live.html, gallery.html | new Application(root, new HtmlBuilder subclass) | Actual repository consumers beyond tests. Usage is evidence of compatibility impact, not approval of their design for Gramlot. |
| Generic BuilderBase.renderNodes ↔ RendererBase.renderExpansionBlock | Cell/writeback indexes, row/cell patches, handler component rules | One coupled subsystem; neutral expansion and traversal must be distinguished from reactive patch policy before movement. |
| DOM HtmlSourceRenderer | Generic render/meta/dialect traversal, own Source subscriber | Does not call renderNodes; its live Source path is independently coordinated. |
| Core GramlotBuilder/GramlotRenderer/Gramlot | Generic declarations/association, DOM Source renderer, detached recipes | Does not use the old Application/BuilderHandler patch runtime. Inherited writeback fields are unnecessary for this active path. |
| gramlot-poc js/dom and its pages | Copied pre-extraction implementation | Evidence and migration laboratory, not a direct consumer of the extracted packages. |
| Searched sibling adapters/examples | Gramlot runtime/server/authoring entry points | No direct old reactive-internal caller found; indirect runtime impact still exists. |

Both packages export their classes from the root entry point. DOM additionally
exports Application, BuilderHandler, HtmlBuilder, SvgBuilder, TargetWrapper and
DomTarget. Historical source paths re-export generic classes, but package exports
only declares the root, not those source subpaths. Shipping a file is not the same
as supporting an import subpath. Unseen external consumers are unknown, not absent.

**Q3 result:** the consumer inventory is sufficient to reject blanket deletion.
Preserve existing exported behavior unless the owner explicitly retires it. This
conservative boundary does not require asking permission to preserve it. Exact
migration of its reactive subsystem still needs a concrete design consistent with
Q2; no compatibility facade or parallel Gramlot engine is thereby authorized.
Pure generic component expansion is not automatically a DOM-only concern.

**Q1 state:** a self-contained owner question is pending: for a direct Source write
that passes grammar validation but fails a native DOM operation, report the error
without automatic restoration, or reject predictable native failures before the
Source changes. No answer/default is assumed. This question does not conflate
invalid authoring declarations with browser failure or promise rollback for arbitrary
component side effects. Silent/fired Source semantics require a separate explicit
consequence statement once that choice is known.

**Q2 state:** shared generic renderer association is already decided; the exact
factory/activation contract is not. Continue drafting against preserved static
consumers, not by immediately removing builder.render or renderer subclasses.
Phase 0 remains active; phase 1 is not started. Runtime files and dependency
installations remain unchanged by this phase.


<a id="gc-094-085"></a>

## 085 · Owner correction — stay within decided behavior

Owner instruction, 2026-09-20: implement what works within the existing decisions;
list unresolved problems at the end for later owner decisions and resolution.
Do not construct speculative solutions or turn outside-scope cases into preliminary
questions. This supersedes earlier instructions in this plan to resolve Q1–Q5 by
inventing new APIs/guarantees before proceeding.

The native file-input example and Q1 question were an agent-driven scope expansion.
That question is withdrawn, not answered in favor of either alternative. No universal
pre-write safety, rollback, trial DOM, new factory/registry or close protocol is
approved. Existing overbuilt mechanisms remain review findings, not accepted design.
Implement only changes justified by established decisions; leave any change requiring
a new behavioral decision unresolved and record it with a concrete example.

Keep the agreed phase order, but do not block the entire sequence on these issues.
Report implemented work separately from unresolved problems. No runtime code changed
by this correction; no commits or publication.


<a id="gc-094-090"></a>

## 090 · Phase 1 bounded implementation — recipe construction

Date: 2026-09-20. State: **phase 1 active; this bounded simplification implemented
and checked, not completion of the phase or architecture acceptance**.

Settled scope: generic recipes compose detached Source without changing the incoming
tree. Example: a recipe produces a div with ten children. _expandBag already builds
a new expanded branch; the old _expandMarker recursively copied that branch again
before attaching it. That second recursive construction had no independent role.

Changes in the owning genro-builders-js working tree:

- src/recipe.js: remove copySource and its second traversal. Detach the value of
  the temporary expanded node with the existing BagNode.setValue API and attach
  the already-expanded branch to the output. The input and recipe builder Source
  trees remain untouched; label collision resolution, metadata and recipe behavior
  are unchanged. No new class, hook, public method or failure policy.
- src/source-bag.js: move existing sourceBagToTytx/sourceBagFromTytx functions here
  unchanged, beside the type they serialize. Recipe expansion no longer houses
  transport codec helpers.
- src/index.js: preserve the same package exports from their owning modules.
- tests/recipe.test.js: extend the existing nested-recipe case to verify output
  parent links and isolation from both recipe builders, not allocation counts or
  implementation shape. README states responsibility and ownership transfer.

Design review preceded checks: the duplicate helper is gone, ordinary Bag mutation
releases temporary ownership, package API is unchanged, and no runtime compatibility
facade was introduced. The generic __ref dependency and other unresolved findings
remain recorded; this change does not silently solve them.

Normal local npm archive installed in an isolated consumer and the Gramlot JS
consumer, with floating maintained manifests restored and no lockfile or dependency
source patches. Generic checks: 22 Node / 22 Bun; core integration: 45 Node.
Logs/artifact: /private/tmp/gramlot-phase1-recipe/. Python wheel, hosted browser
bundle and full host matrix were not rebuilt/reverified by this bounded change.
These checks confirm the retained behavior, not a new design contract.

All changes remain local/uncommitted. Next work remains limited to clearly assigned
responsibilities; unresolved design problems go to the final report per §085.


<a id="gc-094-095"></a>

## 095 · Independent module placement cleanup

2026-09-20. Two mechanical ownership corrections are implemented without changing
shared contracts or starting the deferred renderer/host redesign. These do not
close phase 1 or advance the dependent phases. Existing behavior and root package
exports are preserved; proposed public class renames remain unresolved.

- Move js/src/controller/main.js to js/src/transport.js. MainTransport performs
  main/remote HTTP requests; it is not a Data/application controller. No routing,
  request, error or cancellation behavior changed.
- Move js/src/model/source.js to js/src/references.js. References is a mounted
  node/DOM registry, not SourceBag implementation. Bag/BagNode are imported directly
  from their owning library and remain available from the public Gramlot entry.
- Update callers, existing checks and both repository maps; remove the now-empty
  controller/model directories. Do not leave forwarding files or compatibility
  classes. Current package exports never exposed these internal source paths.

Example: fetching a remote @source block is transport; resolving an opaque node
reference uses the reference registry. Neither operation needs a new Source model
or a controller hierarchy. This is why the module placement changes, while the
public classes and their behavior stay unchanged.

Runtime bundles rebuilt from current local dependencies (including §090). Existing
core Node/Bun checks pass, 45 each. No new implementation-shaped tests were added.
The installed Python host wheel and full browser/host matrix were not refreshed;
do not claim the currently running host has these newest bundles. Logs:
/private/tmp/gramlot-module-cleanup-{build,node,bun}.log. All work local/uncommitted.


<a id="gc-094-100"></a>

## 100 · Installed checkpoint and actual runtime boundary

2026-09-20. Rebuilt Gramlot wheel from the current local sources/bundles and installed
it in the existing isolated Python host environment, without changing dependencies.
Real FastAPI/Uvicorn main, nested HTML updates, remote recipe and disposal pass in
Chromium. The separate Hello World also passes and is available on localhost:8000.
The temporary dynamic fixture listener on 8765 was stopped. This updates the earlier
§090/095 installation limitation; it does not close design review or the host matrix.
Wheel/logs: /private/tmp/gramlot-current-review-wheel/ and
/private/tmp/gramlot-current-review-{wheel,install,browser,hello}.log.

Before coupled removal from generic bases, one concrete scope decision remains:
DOM JS exports and its examples use Application + HtmlBuilder/BuilderHandler.
This is not the same entry point as Gramlot, and D5's single Gramlot coordinator
does not explicitly retire that separate library interface.

```text
Existing exported DOM application:
new Application(element, page /* extends HtmlBuilder */)
  → BuilderHandler → BuilderBase.create/render/renderNodes → HtmlRenderer

Current Gramlot application:
new Gramlot({pageId})
  → GramlotBuilder → GramlotRenderer → HtmlSourceRenderer
  → Source events → DOM
```

A second bounded read-only review confirmed these exact call paths against source,
exports and checked-in examples. External consumers are unknown. It is safe to
preserve the older interface while making independent behavior-neutral changes;
removing its generic reactive dependencies without replacement would break it.

Owner question at the next dependent edit: should the exported Application +
HtmlBuilder reactive runtime remain supported in DOM JS, or be explicitly retired
from the destination scope and retained as historical/PoC material? No retirement,
replacement class, compatibility facade or migration design is implemented before
this answer. This is a real existing API boundary, not the withdrawn hypothetical
native-file-input failure question. Phase 1 remains partial; known generic render
behavior is preserved. Other recorded problems remain for the final review list.

<a id="gc-094-105"></a>

## 105 · Builder-first consolidation, 2026-09-20

The owner selects a clean generic Builder JS as the first concrete deliverable;
subsequent DOM/Gramlot/Host work builds on it. This changes execution priority,
not the native-HTML milestone or ownership boundaries. Current Python code is the
reference, with JSON grammar replacing decorator-supplied descriptions. Executable
component/container bodies remain code. No new compatibility engine is authorized.

The bounded implementation in the separate genro-builders-js checkout includes:

- `getRenderer`, `materialize`, `materialized`, and per-mode `setRenderTarget`;
  `render` composes materialization with finalization. Foreign renderer selection
  uses the same `getRenderer` entry point. Null mode selects the default.
- `RendererBase` declares string output and composes/delivers text. `XmlRenderer`
  is the Python counterpart, inherited by all builders, with escaped text/attrs,
  namespace attributes, indentation and optional declaration/header. Objects in
  string fragment lists raise instead of becoming `[object Object]`.
- Loaded collections may inherit previously loaded abstracts. Collisions with
  class schema and ambiguous case-insensitive element names fail before committing
  candidate grammar state. Abstract references stay case-sensitive as in Python.
- Authoring rejects unknown tags and duplicate `node_id` values, including child
  insertion that would first promote a scalar parent; it checks supplied SourceBag
  child tags before insertion. Minimum cardinalities remain an explicit final
  validation, matching Python's incremental authoring contract.
- Target resolution follows the renderer's declared mode. Old `renderNodes` full
  fallback now preserves an explicit destination. The separate DOM library only
  gains `renderType='object'` and HTML/SVG `mode` declarations; its reactive engine
  has not been migrated or retired.

Review preceded testing and caught an XML coercion gap: its own fragment join
bypassed the base check. Shared string composition now covers nested XML and final
output. Review also identified an old full-render fallback losing an explicit
destination; it is corrected without another rendering path.

Verification: isolated archives, 38 Node and 38 Bun builder checks passed. Old DOM
consumer checks: 120 passed, seven failed. Every failure is a call using
`render({target: null})` as a return-only DOM operation; Python treats null as the
registered default destination. These are recorded API incompatibilities, not
silently hidden by changing the test oracle or adding a fallback. Object fragments
can be materialized and finalized explicitly without a target under the new API.
Only the isolated consumer environment was updated; the running Gramlot/Hello World
installation still uses the previous packages. Logs and archives are under
`/private/tmp/gramlot-builder-foundation/`. No full host matrix rerun or acceptance.

Remaining work, in dependency order:

1. Settle compatibility/retirement of exported DOM `Application`. Its handler,
   segmented Data paths, subscriptions, pointer bookkeeping, and row/cell patch
   engine still live partly in the generic JS base, unlike current Python. An
   asynchronous owner question is pending; do not infer retirement or create a
   compatibility subclass. This choice determines removal/migration scope.
2. Align instance-owned Data/value resolution and component inclusion with Python;
   remove class mutation and WC collection activation from generic authoring under
   the settled boundary. Preserve the JSON declaration format and actual Source.
3. Complete grammar inheritance/declaration parity, sub-builder dispatch and the
   callable component/container contract. Do not reconstruct executable bodies
   from JSON. Existing ESM declaration helpers are not parity evidence.
4. Review remaining generic renderer differences: templates/presentation, component
   depth, escaped tag names, and optional Python render modes. String filesystem
   targets and `rendered_target` have no portable JS implementation; they currently
   fail clearly. Do not add Node imports to the neutral entry point or promise
   byte-identical scalar stringification without an explicit portable contract.
5. Review the resulting classes/modules and then validate generic examples and
   package consumers. Refresh Gramlot, bootstrap and the single-host milestone
   only after the builder foundation is coherent. Report acceptance separately.

This is a partial foundation, not a claim of a complete or "perfect" builder.

<a id="gc-094-110"></a>

## 110 · Reactive ownership implementation, 2026-09-20

The owner places reactivity in Gramlot and requires it to leave generic Builder JS.
This resolves item 1 of §105; no generic compatibility engine is retained. DOM JS
may disappear, but its deletion/location of remaining static functionality is still
an open decision. The older §100/105 questions are superseded on ownership.

Implemented:

- BuilderBase and SourceBag no longer carry handlers, segmented datastore paths,
  Source subscriptions, pointer registries, renderNodes, row/cell patch planning,
  or writeback maps. Data is a flat, instance-owned Bag; Gramlot reuses that same
  Bag instead of allocating and substituting a second root. Node access and `^`/`=`
  resolution are static. Static create runs setup/main/data logic once. Arbitrary
  function-source strings are no longer compiled. WC activation left the base.
- RendererBase retains static parameter/store/iterate component expansion and
  carries indentation depth, without registration or live expansion side effects.
  Existing component declarations now enrich only the instance schema/map, also
  when JSON grammar has already been loaded. No new class or compatibility layer.
- HtmlSourceRenderer and source-mutation.js moved from DOM JS to Gramlot's renderer
  folder, together with their five native lifecycle checks. GramlotRenderer imports
  the local implementation. There is one implementation of the live subscriber.
- DOM JS still supplies HtmlElement, object finalization and HTML/SVG dialects.
  Application/BuilderHandler no longer appear in root exports or packaged files;
  historical source/examples remain for review, not as a working destination API.
  The package's eventual deletion has not been assumed.

Verification: generic46 Node/46 Bun, core50 Node/50 Bun pass with current local
archives; browser/standalone bundles rebuild. The core suite covers typed Source
transport and native insert/update/delete/disposal, main/remote recipes and host
contracts. Full old DOM Application suites are superseded runtime evidence, not
claimed compatible. No real-browser or installed-wheel refresh in this step.
The running Hello World uses the prior wheel. Logs and source backups:
`/private/tmp/gramlot-reactivity-ownership/`. No commits, pushes or publication.

Code review limitations to preserve, not hide with patches:

- Full current-Python parity is incomplete: sub-builders, declaration inheritance,
  templates/presentation/resolver semantics, callable declarations and other
  render modes/target policy remain. Recipe __ref rejection is still application-
  specific metadata in the generic expander and needs an ownership correction.
- Static component expansion is not a mounted Gramlot component implementation:
  the live renderer currently lacks an authored component's stable mount record.
  Do not add a new record/block protocol without a bounded approved component
  step. Native HTML and pre-insertion recipes are the supported current slice.
- Existing ordinary-Bag/legacy-tag adapters and prospective validation projections
  remain in the moved renderer. Projected node parentBag still points at live
  ancestry. This move does not accept those earlier design choices.
- Generic attachSource({replace:true}) still replaces source without rebuilding
  the structural wrapper, so its target-ID semantics are inconsistent. The
  Gramlot main/remote path inserts under the retained root and does not use it.

Next: finish generic-builder parity/review within settled contracts. Inventory
remaining DOM functions before deciding package elimination; do not resume the
host matrix or promote old widget/row/cell features as part of this ownership move.

<a id="gc-094-115"></a>

## 115 · Bundled static HTML and removal of the DOM dependency

Owner confirmation (GC-087 §040/045): Builder JS includes the HTML5 JSON grammar,
HtmlBuilder and static HtmlRenderer. CSS attribute adaptation/macros remain in the
HTML dialect, following Python; RendererBase remains CSS-agnostic. Gramlot is to
reuse that policy for dynamic DOM. Live CSS integration, labels, boxing and bindings
are not part of this transfer. The DOM JS repository is retained as reference.

Implemented and verified:

- HtmlElement and DomRendererBase relocated unchanged into Gramlot's view/html.js
  and renderer/dom-base.js. Imports and fixtures use the owning classes; there is
  no DOM JS dependency in the manifest, installed graph or rebuilt notices.
- Builder JS bundles the Python-exported HTML5 JSON (117 declarations, format 1.1),
  HtmlBuilder and static HtmlRenderer. Static defineGrammar accepts full portable
  documents through the existing parser, preserving subclass extensions rather
  than overwriting them in an instance constructor. No HTML-specific schema merge.
- Static HTML handles escaped text/attributes, raw script/style, void/boolean tags,
  indentation and Python CSS keywords/macros. Svg remains a declared grammar
  boundary with an explicit error until generic sub-builder dispatch exists.
- Source review checked ownership and class inheritance before artifact checks.
  Generic54 Node/54 Bun, core50 Node/50 Bun pass. Bundles rebuilt;
  Python installed grammar export equals bundled JSON. No live CSS integration,
  labels, binding, mounted-component protocol or host-matrix work was added.

Local npm artifact/logs: `/private/tmp/gramlot-html-static/`. npm ls reports local
archive origins as differing from restored floating Git specifications; this is
not verification of upstream availability. Installation and runtime checks use the
local artifacts normally through npm. Running Hello World remains on its older
wheel. The remaining §110 design limitations and revision-requested review stand.
No commit, push or publication.

Reference defect resolved by owner decision GC-087 §050: explicit CSS attributes
must always beat `style`, independently of order. Both renderers now parse the
fallback first, then apply explicit contributions. Regression checks cover both
orders, normal keywords, `style_*` escapes and retained unrelated properties.
Python focused 13 / generic JS 55 Node and 55 Bun pass. No new classes or alternative
rendering path were introduced; existing macro precedence is unchanged.

<a id="gc-094-120"></a>

## 120 · Named sub-builder consolidation checkpoint

The current Python implementation specifies the next generic mechanism without
requiring new application semantics: a grammar element can switch its node and
subtree to a named builder. The boundary is validated using the declaring dialect;
the returned authoring handle uses the mounted dialect. Builders share the same
Data Bag, while document identity remains with the root builder. Rendering chooses
the mounted builder's default renderer. No browser lifecycle is involved.

Reference: Python builder/_grammar.py dispatch and _resolve_subbuilder_reference,
builder/base.py get_subbuilder/get_builder_class, and builder/source_bag.py active
builder/root_builder. Current JS traversal already dispatches per node builder;
authoring and binding currently flatten ownership instead of preserving boundaries.

Bounded work: explicit class registry, host-local sub-builder cache, atomic named
boundary resolution, correct fluent handles and document identity, and named
metadata reconstruction when binding transported Source. The existing parser and
authoring path remain authoritative. No new wire format or grammar adapter.

Runtime `kwarg:attr` references and the SVG dialect assets remain separate gaps;
unsupported references must fail clearly instead of silently retaining the host
builder. Named mechanism verification uses separate small dialects so it does not
claim SVG support. Concrete example: a report dialect opens a chart subtree; the
returned handle accepts chart elements, and both read the same report Data.

Independently, recipe-marker reference semantics await the owner: current generic
RecipeExpander prohibits Gramlot's __ref, an application-specific rule in the wrong
layer. No new reference target semantics or replacement class has been invented.
GC-080 ownership/setup prose has been corrected to match the implemented packages.

Destination review during implementation: reject conditional dispatch from
SourceBag.bindBuilder to a new BuilderBase traversal plus the retained old flat
binding fallback. Keep one traversal in SourceBag, using BuilderBase only to resolve
dialects. Also verify prebuilt branches recursively; changing only a branch root's
builder can leave descendants owned by the previous dialect. These are review
requirements, not accepted parallel APIs. Source behavior and class ownership take
precedence over merely making existing checks pass.

Implemented after the review: explicit registerBuilder/getBuilderClass, per-host
getSubbuilder cache with shared Data, per-node dialect and fluent dispatch, root
identity lookup, and one SourceBag._builderBindingPlan traversal used by bindBuilder
and prebuilt Source insertion. Planning precedes mutation; ownership assignments
are applied only after planning/insertion succeeds. No fallback binding traversal
remains. The HTML-specific delayed error was removed: unknown svg fails at the
generic authoring boundary until the SVG dialect is supplied.

Independent installed-artifact verification: generic62 Node/62 Bun and core50
Node/50 Bun pass. The initial agent failure was traced to a different Bag install
lacking addMutationValidator; the approved owning Bag worktree and Gramlot package
contain it. Verification uses that coherent local graph, not a dependency rollback.
Bundles rebuilt; no installed-wheel/browser/host matrix refresh. Logs/archive:
`/private/tmp/gramlot-subbuilder/`. No commits, pins, pushes or publication.

Limits still open: boundary builder assignment follows synchronous insertion, as
in Python; this is not a live sub-builder event contract. Mounted-dialect data
logic lifecycle, runtime reference-form dispatch and SVG assets are not claimed.
The targetId ownership check now follows rootBuilder.source.root, including
replace:true sources; the separate structural-wrapper replacement API remains
unconsolidated. No formal Live Object Tree model was introduced.

A separate recipe interaction was reproduced: a marker in a named child dialect
still creates its expansion builder from RecipeExpander.builder (the document host),
so a recipe calling a child-only tag fails. Asked the owner whether recipe execution
inherits the surrounding dialect or declares its own builder. This is independent
of the open question about references to replaced recipe markers. Do not silently
add a factory convention, fallback grammar or new reference target model.

Owner clarification after this checkpoint (GC-087 §055): recipe expansion must
produce one rooted tree; caller attributes override defaults and are applied to
the outermost node. Named descendant prefixes route overrides recursively at any
depth. References to recipes target the resulting root, resolving the earlier
prohibition question. This is now a contract to implement; existing forest/attr-
discarding behavior is not acceptance. Prefix ambiguity and dialect selection
remain pending owner decisions before implementing those policies.

Owner naming guidance: CSS attribute names are strongly discouraged as Source
labels. Record this as a recommendation; do not add a CSS blacklist or new label
restrictions. Structural labels keep recursive overrides clear. The subsequent
macro clarification below supersedes the pending dialect-selection question;
implementation of the revised recipe contract is not claimed complete.

Owner clarification, 2026-09-20: a recipe is a Source macro, only a
preprocessor. Its result is the same tree the author could write manually using
the available builders and their ordinary composition rules. It may use whichever
builders its body needs. The renderer receives the expanded nodes; no recipe
runtime object, renderer or independent dialect-selection protocol is implied.
The earlier enclosing-builder-versus-recipe-builder question was too restrictive
and is withdrawn. Preserve the normal builder ownership of the authored nodes.


<a id="gc-094-125"></a>

## 125 · Recipe deferral and return to ordinary HTML

**Owner scope update, 2026-09-20 — recipes deferred:** keep only the possibility
of a Source macro/authoring shortcut. Do not define or implement its contract now.
The earlier root/override/parameter discussions below are retained as history,
not current acceptance criteria or prerequisites. Existing recipe code is
provisional; it is not being accepted, extended or removed by this deferral.
Continue the generic builder and ordinary native HTML authoring/static rendering.

This supersedes recipe-dependent gates in earlier sections. The current work is
a source-code review of static HTML and ordinary grammar/class inheritance.
Broader unsupported mechanisms remain recorded gaps, not permission to invent
them. Publication and the host matrix remain deferred.

<a id="gc-094-130"></a>

## 130 · Ordinary grammar and static HTML review

Recipes are excluded by §125. A source-code review reproduced a generic class
invariant failure: a parent declaring `Item` and child declaring `item` were both
accepted, and case-insensitive dispatch silently selected the latter. Python
rejects this at class definition. JS instance collection loading already rejected
it, but class declarations did not.

Implemented one `grammarTagNames` compiler, reused by class definitions, instance
loading and lazy lookup. Validation precedes state changes; exact-name overrides
remain valid and parent schemas remain unchanged. No new class, compatibility
path or declaration format. Installed local archive verification: generic64/core50
on both Node and Bun; bundles rebuilt. Artifacts and logs:
`/private/tmp/gramlot-grammar-review/`. Local only; no commits or publication.

Independent Sol review found no duplicate class in HtmlBuilder/HtmlRenderer: the
builder owns grammar/renderer selection and the renderer owns HTML serialization
and CSS adaptation. Findings independently reproduced by the parent:

- `style='--caption:"a;b"'` is rejected because the parser splits inside the
  quoted value. Corrected in both Python and JS: a small scanner recognizes
  declaration boundaries outside quotes, escapes, comments and nested groups.
  It retains existing first-colon, trimming and last-key-wins semantics; it is
  not a complete CSS validator. No new dependency or class.
- `rounded=4, border_top_left_radius='20px'` produces `4px`. This matches current
  Python; precedence between competing explicit forms has NOT been approved.
  Do not confuse it with explicit attributes overriding the style string.
- `title='^missing'` becomes literal `title="null"` when Data has no such value.
  Owner question pending: omit, empty string or error. No guessed behavior.
- Packaging review should verify the Node minimum: the bundled JSON import uses
  import attributes while the manifest currently declares Node >=18. The current
  Node/Bun verification does not establish support across all Node 18 minors.

These are bounded findings, not complete generic-builder or host acceptance.

Final installed checkpoint for this bounded review: generic65 and core50 on both
Node and Bun, 14 focused Python HTML checks. The new CSS regression exercises
quoted/data-URL values, escaped semicolons, unquoted nested functions and explicit
width overriding style. The parent reviewed the Sol changes before installing the
new npm archive. Public Sphinx/allowlist/mirror checks pass; bundles rebuilt.
The running Python Hello World still uses its previous wheel; no browser/matrix
acceptance or source publication. Other findings above remain open.

<a id="gc-094-135"></a>

## 135 · Correction: null text belongs to the DOM boundary

The assistant misinterpreted the owner's null-to-empty answer as a static HTML
serialization policy and changed the Python and JS HtmlRenderer methods. The owner
corrected this: conversion happens at the DOM node, not in Python. Those static
changes, regressions and README claim are reverted; the earlier generic66/core50
checkpoint is evidence of an unapproved interpretation, not acceptance.

Gramlot HtmlElement already maps null to empty text at initial creation and updates;
input.value assignment also uses the empty string. No runtime modification is
necessary. Added one native Source-to-DOM regression confirming both paths, retained
null in Source, preserved element identity and zero/false text. Existing ordinary
attribute removal semantics are unchanged; this does not assert title="" markup
or implement pointer/Data binding.

Installed verification after correction: generic65/core51 on Node and Bun, Python
HTML14. Generic JS source files in the fresh archive match the checkpoint preceding
the incorrect change. Bundles rebuilt; archive/logs `/private/tmp/gramlot-dom-null/`.
No Python wheel/host refresh, commits or publication. Recipes remain deferred.

<a id="gc-094-140"></a>

## 140 · Compact CSS form wins

Owner resolves the remaining macro/direct-property example from §130: the more
compact form wins. `rounded=4` overrides `border_top_left_radius='20px'`, so that
corner is `4px`. Current Python and JS implementations already follow this order.
Verified directly in both authoring orders, with no runtime edit or extra class.
This resolves that question; earlier pending references are historical. General
precedence among arbitrary macro sub-parameters is not inferred. Other generic
builder gaps and the deferred host matrix remain open; this is not full acceptance.

<a id="gc-094-145"></a>

## 145 · Generic ownership and declaration review in progress

Owner requests continued execution, not stopping after isolated decisions. Recipe
work remains deferred and null-to-empty remains a DOM concern. The ordinary
Builder JS review reproduced these defects against the current Python contract:

- `validateSource()` consulted the host schema inside mounted dialects, hiding
  their missing required children. `nodeById()` wrapped a foreign node with the
  host grammar, so a valid child-only authoring method disappeared after lookup.
  Both are corrected to use the existing node.builder; structural envelopes stay
  outside containment checks. No new owner registry or traversal is introduced.
- Tag serialization stripped every trailing underscore, and attributes used an
  incomplete mixed Python/JS keyword list. A shared private Python keyword set
  now decodes only actual keyword escapes. Legitimate `foo_`/`new_` names remain
  literal; supported keyword attributes include `from_` and legacy `_class`.
- Class inheritance eagerly flattened parent declarations, so overriding an
  abstract left inherited elements with stale rules. The correction keeps raw
  class declarations separate from compiled schema and uses one inheritance
  resolver. Internal parsing is being simplified into strict decoding followed by
  composition/resolution; no second instance grammar state or component overlay
  is added. Instance collection conflict/replacement policy remains unchanged.

Python investigation confirmed a separate transitive abstract inheritance defect:
`base → flow → box` fails to inherit base's allowed child tags at runtime despite
the documented literal-export/transitive-consumer contract. A bounded fix is being
made in the owning Python grammar resolver. Parent-instance cache leakage was
suspected but not reproduced; no speculative cache invalidation is authorized.

The earlier JSON-only-versus-JS question is superseded by GC-087 §070:
JSON is portable; JavaScript declarations are JS-only. Native HTML/SVG vocabulary
comes exclusively from the exported JSON. No blanket declaration API deletion
was requested. The final installed verification follows below.

### Final checkpoint for §145

Implemented and reviewed: node-owned validation/ID handles, exact shared Python
keyword decoding, one class/instance inheritance compiler with raw class
`_classDeclarations` separate from compiled schema. Parent review removed a redundant
resolve-during-parse step: parseGrammarDocument now only validates/normalizes;
class and instance paths each call the resolver once before state commit.
No extra raw instance snapshot or component overlay state was introduced.

The Python transitive-abstract defect is fixed in _GrammarMixin._get_schema_info
with one merge rule for abstract and element inheritance, local recursion and
clear cycle/missing-parent errors. Raw export remains unchanged. The suspected
parent cache leak was not reproduced and no cache invalidation was added.

Full Python checks initially found two unrelated obsolete Bag calls. The owning
builder now uses the public Bag.traverse() iterator; its infinite-cache regression
uses negative TTL instead of boolean False, preserving the same behavioral
assertion. The installed Bag is 0.25.1; the older sibling 0.22.0 checkout was not
substituted to conceal these failures. No compatibility paths or dependency pins.

Final verification: generic72/core51 on Node and Bun, Python full430 passed.
Rebuilt browser bundles; local archive/logs `/private/tmp/gramlot-declaration-review/`.
Owning source tests do not imply the running Python host wheel has been refreshed.
All local/uncommitted, no publication. The owner's later single-source grammar
clarification is recorded in GC-087 §070; recipes remain deferred.

<a id="gc-094-150"></a>

## 150 · SVG adaptation review

**SVG adaptation review — both paths authorized:** the owner calls for
adapting existing SVG rendering, not designing an unrelated implementation.
Read-only review reproduced two concrete problems: JS `GramlotBuilder.root.svg()`
raises `No builder registered with name 'svg'`; Python
`svg.html().div("Hello")` renders foreignObject in the XHTML namespace because
SvgExtensions.html exports that xmlns on the boundary itself. SVG foreignObject
must stay in the SVG namespace; its HTML contents use XHTML (W3C SVG 2 embedded
content). The incorrect metadata is already in the canonical JSON: no JS-only
correction or second vocabulary has been introduced.

Existing reusable mechanisms: old DOM JS SvgRenderer uses createElementNS;
generic RendererBase has addRender/getRender for dialect renderer selection.
Default selection currently requests the child builder's default renderer, which
is insufficient to guarantee object output in a live DOM traversal. Decisions
about static versus live integration must remain explicit; the earlier plan
deferred reactive SVG. Owner subsequently authorized both static builder SVG and live Gramlot SVG.
The following findings describe the pre-change review; §155 records the
completed and verified SVG adaptation.

Reference: [W3C SVG 2 embedded content](https://www.w3.org/TR/SVG/embedded.html).
The concrete namespace defect belongs to Python SvgExtensions.html and its
exported metadata. Retain one canonical collection; do not silently compensate
for that defect in the browser. The existing HTML/SVG boundary declaration and
renderer selection need review together before broadening the live milestone.

<a id="gc-094-155"></a>

## 155 · Static and live SVG adaptation complete within the native slice

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


<a id="gc-094-160"></a>

## 160 · Bounded design corrections and remaining decisions

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


<a id="gc-094-165"></a>

## 165 · One grammatical source for HTML void semantics

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


<a id="gc-094-170"></a>

## 170 · Shared XML serializer for SVG

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


<a id="gc-094-175"></a>

## 175 · Deferred Source replacement policy

**Owner decision — 2026-09-20: defer whole-Source replacement policy.**
Keep `attachSource(source, {replace: true})` unchanged for now. The known defect
remains open: replacing the source can leave the structural root attached to the
old Bag; transferring between builders can also duplicate cached target IDs.
Gramlot main/remote does not use this option. Neither removal nor a new adoption,
identity-remapping or root-transfer contract is approved. Revisit with the owner
later; this deferred choice does not block independent review work.

<a id="gc-094-180"></a>

## 180 · Bounded native updates and component inheritance

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


<a id="gc-094-185"></a>

## 185 · Necessity gate and withdrawal of the repeated-declaration question

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


<a id="gc-094-190"></a>

## 190 · Owner-directed declaration removal completed

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

This supersedes earlier open questions about retaining or refining defineDeclarations.


<a id="gc-094-195"></a>

## 195 · Bounded builder review corrections

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


<a id="gc-094-200"></a>

## 200 · Remove unused native mount state

**Native HTML record review — 2026-09-20.**
Removed unused `sourceTag` and `declaration` copies from HtmlElement mount records.
The original tag remains on the associated Source node; the grammar remains owned
by the builder. `definition()` returns only metadata, namespace and resolved tag,
and no longer accepts an unused tag override. This removes redundant state and
parameters without adding classes, compatibility paths or APIs.

Retained state has concrete readers: the resolved emitted tag and namespace select
update versus replacement; the applied-attributes snapshot removes previous DOM
attributes; the element/text references support native setters. The coordinator's
Source-node association, parent/children and cleanup callbacks support insertion,
subtree removal and disposal. DomRendererBase supplies DOM-fragment finalization;
HtmlSourceRenderer owns Bag-event coordination; HtmlElement owns native DOM handling;
GramlotRenderer adds application references. No new class split is proposed here.

Verified: all 60 Gramlot Node tests pass, including native updates, SVG and typed
Python/JS transport; browser bundles rebuilt. Removed one assertion of redundant
internal state; the test still checks the authored tag, emitted tag and DOM identity
through updates. Recipes and their collection-copy defect remain parked. This pass
leaves the already-recorded ordinary-Bag and staging policy questions unresolved;
no new failure or adoption protocol is inferred. Remaining generic Python parity
(template/presentation/resolver behavior) is recorded separately and not claimed done.


<a id="gc-094-205"></a>

## 205 · Strict Source boundary completed

Owner requires one primary path: SourceBag and SourceBagNode. The ordinary-Bag
renderer route and its fallbacks are removed. See GC-093 §090 for the changes and
verification. This supersedes earlier preservation of ordinary-Bag consumers in
this plan; no compatibility shims preserve those callers. Recipe work stays deferred.


<a id="gc-094-210"></a>

## 210 · Bounded primary-path cleanup

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
