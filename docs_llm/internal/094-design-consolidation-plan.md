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

[Expanded counterpart](../../docs/internal/094-design-consolidation-plan.md).
[Ledger](070-work-status.md). [Review](093-class-design-review.md#gc-093-040).

<a id="gc-094-005"></a>

## 005 · Purpose, authority and baseline

Finish the native-HTML foundation with minimal, readable responsibilities. Reuse
appropriate existing code; no restart/bulk PoC port. At that time GC-094 proposed the
sequence; GC-070 tracks progress; GC-088 is historical; GC-093 findings are not
owner-approved architecture. Existing uncommitted work is the baseline, not design
acceptance. Preserve unrelated changes. Local only: no commits/pushes/remotes,
releases/deployments or dirty-checkout reset. Planning does not approve open choices.

<a id="gc-094-010"></a>

## 010 · Decisions already made

D1 Bag/TYTX→Builder→DOM→Gramlot responsibilities, no compensating layers.
D2 generic grammar/Source/recipes/renderer base; concrete renderers in dialects,
future SQL independent of DOM (GC-087).
D3 shared exported JSON collections for Python/JS; future JS-owned components,
no duplicate HTML whitelist (GC-060/092).
D4 host URL→Page/ID/bootstrap; browser roots/backrefs/subscriptions before main.
D5 one DOM coordinator, native Bag events, insert/delete/setter-or-rebuild and cleanup.
D6 detached recipe expansion before main/remote insertion (GC-080).
D7 registered typed Source transport, in-place association, no Bag coercion/hydration.
D8 neutral Page/Host in both languages, engine adapters; preserve Python generic
object/string renderers, no restored Python dynamic engine (GC-075).
D9 pure HTML first, equivalent Hello World, FastAPI/Uvicorn before full matrix.
D10 floating first-party dependencies; internal/public separation and paired docs.
HTML5's present Python export is a bootstrap source, not a reversal of future
JS component ownership. authoring/hosting names and audit proposals are not approved.

<a id="gc-094-015"></a>

## 015 · Scope and intended flow

Page→GramlotBuilder/collection→typed Source/TYTX→decode/associate→detached recipes
→observed Source insertion→native Bag event→GramlotRenderer/DOM using generic base.
Roots exist before main; standalone joins after transport. No second renderer.
Included: native text/attributes, references, pages/hosts/adapters and bounded offline.
Deferred: CSS shorthand, capabilities/widgets, bindings/controllers/resolvers,
reactive SVG, automatic custom-element discovery, databases/ORM/Git app, general
transactions and LOT. Database placeholders remain. No new GNR-prefixed API.
Coverage is not design acceptance.

<a id="gc-094-020"></a>

## 020 · Recorded open issues — not prerequisites for agreed work

Q1 native DOM write failure; Q2 renderer lifecycle/target mismatch; Q3 inherited
reactive consumers; Q4 automatic collection distribution; Q5 server record closure.
These are a final-report problem list, not authorization to design solutions or
prerequisites for agreed work. Q1 question withdrawn by owner instruction (§085).
Keep explicit configuration/known consumers and no new guarantees, protocols or
compatibility layers. Leave affected undecided changes unresolved, proceed elsewhere.

<a id="gc-094-025"></a>

## 025 · Phase 0 — Set the concrete contracts

Coordinator; active. Produce class/API/state/cleanup table, keep/simplify/move/remove
inventory, bootstrap and mutation traces, affected generic consumers, exact next
phase files. Resolve Q1–Q3. Documents/sketches only. Exit: one meaning per shared
contract, no design delegated to coding time; no reapproval of settled decisions.

<a id="gc-094-030"></a>

## 030 · Phase 1 — Minimal generic foundations

After 0: Python/JS builders, Bag/TYTX only for owner defects. R1/R2/R5/R8.
Minimal authoring/traversal, shared collections/typed Source, dialect-independent
recipes, classified optional reactive ownership; preserve actual generic consumers
and Python object/string rendering. No browser imports, speculative SQL, blanket
reactive deletion or no-op compensation. Deliver migrations and deletions. Design
exit first: coherent minimal API/mixins. Then affected generic and transport checks.

<a id="gc-094-035"></a>

## 035 · Phase 2 — One native DOM lifecycle

After 1 and Q1/Q2: DOM owner, agreed Bag defects only. R2–R4.
One target/mount/update/dispose contract and native event path; replace duplicated
candidate/projection/trial paths per Q1. Encapsulate mounted lookup. No second tree,
hidden double construction, partial facades or arbitrary rollback guarantees.
Design exit: one traceable path per operation and cleanup owner. Then native
render/update/rejection/cleanup checks.

<a id="gc-094-040"></a>

## 040 · Phase 3 — Thin Gramlot integration

After 2: Gramlot. R4/R5/R7/R8. Roots before main, typed decode and recipes for
main/remote/embedded. References here, not generic recipes. Shared grammar;
server authoring without concrete browser imports. Names follow settled ownership;
no speculative folder overhaul. Explicit collection propagation, Q4 only if needed.
Design exit: application policy, no duplicate library engine or exposed renderer
storage. Then end-to-end Source and cross-language checks.

<a id="gc-094-045"></a>

## 045 · Phase 4 — Page and neutral Host, FastAPI first

After 3 and Q5: core and FastAPI. R6/R7. Shared page execution per language,
explicit hosted/offline policies, aligned methods/results/errors, clear filesystem,
HTTP/bootstrap/registry/lifetime boundaries. Functions before unnecessary classes.
No persistent sessions, DB work or unrelated host changes. JS contracts reviewed;
Node/Bun listeners later. Design exit: one execution path/language, neutral core.
Then FastAPI lifecycle and shared standalone execution checks.

<a id="gc-094-050"></a>

## 050 · Phase 5 — Review the complete small implementation

After 1–4: coordinator traces authored div and each dynamic operation through code;
reviews necessity, inheritance, names, state, mixins, cleanup and plan deviations.
Close findings with code/decision evidence. Update internal guide, framework/example
maps, public drafts, mirrors/handoff. Build normal local artifacts, no dependency
patches/pins/sibling shortcuts. Design exit before checks; then real FastAPI/Uvicorn
Hello World/dynamic Source/remote from installed artifacts. Attribute unrelated
failures. Owner single-host checkpoint required before matrix; silence not acceptance.

<a id="gc-094-055"></a>

## 055 · Phase 6 — Refresh the agreed host and standalone matrix

After phase 5 owner checkpoint: adapters/examples. Same Python page across
ASGI/Uvicorn, FastAPI, Kajenn, Flask; same JS page on Node/Bun; both bounded offline
profiles. Python pip installability; multiple apps in gramlot-examples, Git separate
and deferred. No databases/showcase expansion/host-specific page hacks. Design exit:
shared contracts, no alternate engines. Then real installed browser/listener/offline
checks per profile. Shared-contract changes reopen their owning/dependent phases.

<a id="gc-094-060"></a>

## 060 · Phase 7 — Local closure and acceptance

After 6: final maps/limits/reproduction/port disposition; remove obsolete routes,
reconcile ledger/review/handoff. Owner accepts bounded design and behavior. No
critical design issue hidden by checks. Commits/pushes/remotes/upstream availability
and develop/main consolidation require separate authorization; no release/deploy.

<a id="gc-094-065"></a>

## 065 · Execution discipline and delegation

Dependency order; no parallel adjacent layers with unsettled contracts. Sol when
delegating, as requested. Each task specifies phase/decision IDs, exact files,
owner APIs, deletions, forbidden workarounds, stop conditions and design exit.
Coordinator reviews shared-contract sketch before edits, code before checks.
Ask owner on architectural doubt before implementing. Stop affected work for an
unplanned public class/shared state/second path/wire change/behavior restriction
or responsibility move; ordinary mechanical choices remain autonomous. Record
changes and affected phases before resuming. Report changes/reasons/deletions/API
conformance/open points/design outcome, then verification. Same rules for coordinator.
States: pending/active/blocked-on-decision/design-reviewed/verified/accepted.

<a id="gc-094-070"></a>

## 070 · Current ledger and immediate next action

Phase 0 active: class/operation inventory recorded; Q1–Q3 pending. Phases 1–7
pending. One Sol agent inventories consumers read-only. Execution authorized on
settled decisions; ask on architectural doubt. No runtime edits. GC-070 tracks progress.


<a id="gc-094-075"></a>

## 075 · Phase 0 working contract inventory

Owner authorized execution on 2026-09-20: proceed on established decisions, ask on
architectural uncertainty. Inventory complete in expanded section; no runtime edits.

Keep Bag/BagNode for structure/events; SourceBag/SourceBagNode for typed declarative
nodes/association; generic Builder for grammar/authoring/render orchestration and
RendererBase for traversal/dialect fragments. Simplify only misplaced behavior,
preserving actual consumers and static Python rendering. RecipeExpander owns detached
composition, not Gramlot __ref. No new codecs/wrapper tree.

Keep DomRendererBase's explicit static finalization contract; preserve HtmlRenderer/
SvgRenderer consumers. HtmlSourceRenderer alone coordinates Gramlot live events,
mount associations and cleanup, with shared HtmlElement handler. GramlotBuilder
selects collections/application declaration policy; GramlotRenderer supplies
reference integration. References owns live ref lookup. Gramlot owns roots, requests
and one renderer; transport owns HTTP only. Page stays small; Host registry/bootstrap
and filesystem/HTTP boundaries must be distinct; share page execution with offline.
FileHost and named Bootstrap/errors have real responsibilities. Existing exported
Application/BuilderHandler/DomTarget cannot be removed without consumer migration.
Private Python mixins are implementation factoring, not a capability API. No new
service classes for codecs/method lookup/stateless page execution.

Bag subscriber payloads read from implementation: ins/del = node,pathlist,ind,evt,
reason (del may have node array); update = node,pathlist,oldvalue,attrs_diff,evt,
reason. Pre-write descriptors are different and remain under Q1.

Traces: bootstrap establishes roots/subscription before main; Page builds/serializes
Source; decode/bind→detached recipes→observed insertion→native event→DOM. Remote uses
same preparation, target lifetime/cancellation and child replacement. Direct local
HTML insertion uses generic declaration validation and native Bag ins, not simulated
transport. Updates use setter or replacement; deletion uses retained mount identity
for cleanup. Disposal cancels requests and removes renderer resources; server record
closure remains Q5. Error semantics remain Q1, not implied rollback.

Q2 clarification: GC-075 permits distinct static/reactive operations; do not delete
static render/finalize or force Python into live traversal. Current mismatch:
BuilderBase.render(opts), DomRendererBase.finalize(result,target),
HtmlSourceRenderer(builder,source,destination), cached/subscribing renderer_html
getter; GramlotBuilder also lacks a default render mode. Need explicit builder
renderer selection versus runtime activation/disposal. Factory/registration versus
explicit construction is still a design choice, not approved by this inventory.

Phase-1 edit envelope: generic JS builder-base/source-bag/renderer/base/recipe/index;
Python builder/base/_grammar/source_bag only if necessary; DOM consumers migrate
with shared changes. Bag/TYTX unchanged unless an owner defect/contract justifies it;
Q1 required for mutation policy. Core dependent imports only, orchestration phase 3.
Q1 asked and pending; Q2 API and Q3 consumer migration open. No runtime implementation.


<a id="gc-094-080"></a>

## 080 · Phase 0 consumer inventory and decision status

Sol read-only inventory independently checked against code/exports/examples.
DOM Application→BuilderHandler assigns handler, invokes create/renderNodes and
reads writeback. Exported HtmlBuilder/SvgBuilder depend on generic bases and the
same component/patch subsystem; DOM examples index/page/live/gallery instantiate
Application with HtmlBuilder subclasses. Generic renderNodes and renderExpansionBlock
share row/cell/writeback/rule machinery. HtmlSourceRenderer instead uses generic
traversal plus its own subscriber; Gramlot does not use old patch machinery.
PoC uses a copied implementation, not extracted packages. Searched adapters/examples
have no direct old reactive calls; unknown external consumers remain unknown.
Root exports are public; shipped historical re-export source paths are not declared
package subpaths. No tests used as evidence.

Q3: reject wholesale deletion; preserve exported behavior unless owner retires it.
Preservation requires no extra permission, but exact migration still needs Q2 design;
no new facade/parallel Gramlot engine. Generic component expansion is not inherently
DOM policy. Q1 question pending: error report without restoration versus rejection
of predictable native DOM failures before direct Source write; no default assumed.
Authoring validation and arbitrary side effects are separate. Silent/fired policy
must follow an explicit consequence statement. Q2 builder/renderer association is
settled, factory/activation API still being drafted with static consumers preserved.
Phase 0 active, phase 1 not started; no runtime/dependency changes.


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

2026-09-20: phase 1 active, not complete/accepted. Generic recipe output was expanded
then recursively copied again. Removed copySource; existing BagNode.setValue releases
the temporary node's branch before output attachment. No input/recipe-builder tree
mutation, label/metadata/API/failure-policy change, new class or hook.
Moved unchanged Source codecs from recipe.js to source-bag.js; root exports unchanged.
Existing nested-recipe test now checks output backrefs and original builder isolation.
README updated. Generic __ref dependency and other findings remain unresolved.
Code review first; normal local archive installed in isolated/core consumers without
pins/locks/installed-source patches. Checks: generic 22 Node/22 Bun, core 45 Node.
Artifacts/logs /private/tmp/gramlot-phase1-recipe/. No Python wheel/browser bundle
rebuild or host matrix rerun. Local/uncommitted; unresolved issues reported per §085.


<a id="gc-094-095"></a>

## 095 · Independent module placement cleanup

2026-09-20: mechanical ownership cleanup, not closure of phase 1 or advancement of
dependent redesign. controller/main.js→transport.js (MainTransport does HTTP),
model/source.js→references.js (References owns mounted lookup); direct Bag imports.
Public root exports/class names/behavior unchanged; callers/maps updated, empty
folders removed, no forwarding wrappers. Source-path imports were not package exports.
Example: remote @source fetching is transport; opaque ref lookup is a registry,
not an application controller or another Source model.
Bundles rebuilt including §090. Existing core checks45 Node/45 Bun; no new tests.
Installed Python host wheel/browser matrix not refreshed. Logs in
/private/tmp/gramlot-module-cleanup-{build,node,bun}.log; local/uncommitted.


<a id="gc-094-100"></a>

## 100 · Installed checkpoint and actual runtime boundary

2026-09-20: current wheel/bundles installed in isolated host environment, dependencies
unchanged. FastAPI/Uvicorn Chromium dynamic/main/remote/disposal and Hello World pass.
HelloWorld running localhost:8000; fixture8765 stopped. Supersedes §090/095 installed
artifact limitation, not architecture acceptance/matrix. Artifacts/logs:
/private/tmp/gramlot-current-review-wheel/ and corresponding review logs.

Actual exported paths confirmed by read-only source/export/example review:
Application(element, HtmlBuilder page)→BuilderHandler→BuilderBase.create/render/
renderNodes→HtmlRenderer; Gramlot({pageId})→GramlotBuilder→GramlotRenderer→
HtmlSourceRenderer→Source events/DOM. D5 does not explicitly retire the former.
External consumers unknown. Preserve it for independent cleanup. Before coupled
base removal, ask whether this exported runtime stays supported in DOM JS or is
retired from destination scope and kept as historical/PoC material. No retirement,
new classes/facades or migration solution assumed. This is a current public API
boundary, not the withdrawn hypothetical failure question. Phase1 partial.

<a id="gc-094-105"></a>

## 105 · Builder-first consolidation, 2026-09-20

Owner priority: consolidate generic Builder JS against current Python, with JSON
grammar, before further DOM/Gramlot/Host work. Components/containers still carry
executable code; no compatibility engine approved.

Implemented in genro-builders-js: getRenderer/materialize/materialized, per-mode
targets, render→materialize→finalize, shared foreign-renderer selection, portable
string finalization, inherited XmlRenderer. XML escapes text/attrs, supports
namespace attrs/pretty/header and rejects object fragments without coercion.
Grammar loading now resolves prior abstracts and rejects inherited-schema and
case-insensitive element collisions atomically; abstract references remain
case-sensitive. Authoring rejects unknown tags, duplicate node_id and invalid
prebuilt children before mutation; minimum cardinality stays explicit. Old
renderNodes full fallback preserves its explicit target. DOM changes are only
object type and HTML/SVG mode declarations, not a new runtime.

Code review caught and fixed XML's bypass of string-fragment validation. Isolated
package checks: builder38 Node/38 Bun pass; old DOM120 pass/7 fail, all using the
old target:null return-only convention. Python null means registered destination.
No altered oracle or compatibility workaround; materialize + explicit finalize
supports undelivered object output. Logs/archives: /private/tmp/gramlot-builder-foundation.
Gramlot's installed packages/HelloWorld were not updated; no acceptance or matrix
claim. Local only, no commits/pins/publication/deployment.

Remaining order: owner decision on legacy Application compatibility/retirement
(question pending); then generic flat Data/value resolution, instance-owned
components and removal of WC activation; full grammar/sub-builder/body contract;
remaining static renderer parity; design review and generic/package verification.
Old handler/segmented Data/subscriptions/row-cell patch engine still remain.
Filesystem destinations/rendered_target, other Python modes, templates/presentation,
component depth and tag/scalar formatting are not fully ported. Do not invent a
Node-only dependency, wire-code protocol or compatibility layer to conceal gaps.
Resume Gramlot/Host work only after the builder foundation is coherent.

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
