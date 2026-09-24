# 093 · Class and ownership review

Document ID: **GC-093**. Updated: **2026-09-21**.
Historical review findings and eight-profile matrix: sections 100–115. Current 0.1.0 scope has seven profiles; use [GC-110](110-native-html-readiness.md#gc-110-020) for release gates. Q1/Q2 speculative validation was removed; Q3 Worker shared execution, Q4 HTTP adapter/Python loader, Q5 page closure and Q6 packaged grammar were settled as recorded in [GC-120 §020](120-continuity-audit.md#gc-120-020). Broader design acceptance remains open.

Historical review follows. Status: **architectural revision requested**. Section 040 reviews implementation
quality independently of runtime checks and reopens the design of changes in 030.
Section 030 records functional progress only. **Not architecture acceptance**.
Execution sequencing and unresolved decisions are now in
[GC-094](094-design-consolidation-plan.md); findings below are not approved solutions.
Module placement portion of R7 is now corrected: transport.js and references.js
replace controller/main.js and model/source.js; public names remain unchanged.
See GC-094 §095. Earlier file paths below identify the reviewed snapshot.

<a id="gc-093-005"></a>

## 005 · Scope and method

Reviewed every class declared in core Python and JS, its callers, generic
Builder/SourceBag dispatch, and the DOM renderer lifecycle. Inspected FastAPI
as the current host boundary and standalone functions because they repeat page
loading/execution. This is a local-source review, not production verification.
Each class must own distinct behavior in the correct library. Passing tests do
not justify a redundant abstraction. Ownership remains Bag/TYTX → Builder → DOM
→ Gramlot. No new capability hierarchy or Live Object Tree semantics are implied.

<a id="gc-093-010"></a>

## 010 · Corrections applied

1. Removed Python and JS compatibility classes named Source. Both forwarded to
   GramlotBuilder; JS even returned another object from its constructor. Use
   builder.root for declarations and builder.source for the actual SourceBag.
   Updated exports and inter-language fixtures.
2. Removed the unused JS Builder alias for GramlotRenderer.
3. Removed Gramlot's HtmlElement subclass: its only behavior was passing
   metadataAttributes=['__ref'] to the DOM library. GramlotRenderer now configures
   the existing collaborator directly.
4. Removed public authoring .bag access. Python's getter could replace scalar
   content with a child Bag merely on read. Child preparation is now an explicit
   private write helper. This does not resolve the larger authoring issue below.
5. Gramlot reuses builder.source instead of allocating a second SourceBag and
   leaving the generic internal root pointing at another tree. builder.data and
   app.data share the prepared Data Bag. Existing bootstrap tests now assert
   these identities.

These intentionally change local pre-release exports. No compatibility aliases
were added. Sibling example/adapter source searches found no consumers of the
removed entries.

<a id="gc-093-015"></a>

## 015 · Class-by-class disposition

| Class or family | Responsibility | Disposition |
| --- | --- | --- |
| Python/JS GramlotBuilder | Collections and application authoring dialect | Keep; remove repeated generic dispatch before acceptance |
| Python AuthoringNode / Gramlot JS authoring Proxy | Duplicated generic dispatch | Removed; generic node dispatch retained |
| Python/JS Page | Metadata, main, explicit remote declarations | Keep; consolidate execution contract |
| Python Host | File loading, registry, bootstrap, invocation, serialization | Review loader/registry boundaries; multiple responsibilities |
| JS Host | Registry/bootstrap/invocation plus HTTP dispatch | Review HTTP separation and Python parity |
| JS FileHost | Node/Bun filesystem resolution | Distinct environment responsibility; keep |
| Python Bootstrap | Immutable page ID/HTML result | Keep; result record, not another service |
| Python host exceptions | Typed adapter-visible failures | Keep |
| JS host exceptions | Typed host failures | Keep; missing SourceNotFound distinction |
| JS Gramlot | Roots, main/remote pipeline, cancellation/disposal | Keep; root ownership corrected; server close incomplete |
| JS GramlotRenderer | Configure DOM renderer and references | Keep as dialect specialization |
| JS References | Mounted Source/DOM identity index | Keep; model/source.js location/name is misleading |
| JS MainTransport | Main and remote HTTP calls | Keep responsibility; name/controller location need review |
| Python/JS Source | Compatibility wrapper | Removed |
| JS Builder alias | Old renderer name | Removed |
| JS HtmlElement specialization | Constructor configuration only | Removed |

<a id="gc-093-020"></a>

## 020 · Open defects and design gaps

### A. Duplicated authoring dispatch — acceptance blocker

Generic Python SourceBag/SourceBagNode already route declarations through the
builder, including containers, subbuilders and positions. Generic JS provides
wrapSource and commandOnNode. Gramlot's wrappers expose a selected subset plus
recipes/references, hiding generic APIs and risking future collection collisions.

Mixed text needs an explicit dialect policy: scalar-to-children promotion moves
text to _text in Gramlot. Removing the facade blindly loses text because generic
child promotion replaces scalar values. Define owning-library extension points,
then remove repeated dispatch; do not introduce another opaque wrapper.

### B. Rejected child writes mutate the parent — reproduced

Python and JS: create br('kept'), attempt a nested span, catch validation failure.
The scalar is already replaced with a child SourceBag and moved to _text.
Generic command-on-node also promotes the parent before validating the child.
Fix the generic validation/mutation boundary and apply dialect mixed-text policy
only on successful insertion. A Gramlot-only rollback hides the generic defect.

### C. Invalid direct live updates diverge Source and DOM — reproduced

After mounting a div, set title to an object. DOM validation raises; DOM stays
unchanged, but the invalid object remains in Source. The reactive renderer
validates after the Bag event and does not undo the original mutation.
Main/remote candidate preparation protects those pipelines only. Define and
implement direct live-write failure semantics across Builder/DOM/Bag ownership;
do not claim general transactional updates.

### D. Host and page execution contracts diverge

Python Host.source rejects main; JS source(pageId, null) currently routes to main
through buildSource. JS missing Source methods use PageNotFound. Page-class import
caching and relative-import behavior differ between Python/JS loaders.
Hosted and standalone execution separately instantiate pages/builders, invoke
main and check return values: hosted JS accepts null, standalone rejects it.
Consolidate explicit method selection and shared page execution while preserving
transport/packaging boundaries. Do not implicitly introduce session-persistent
Page objects: current requests construct fresh instances.

### E. Lifecycle and public-surface gaps

- FastAPI exposes close, but browser dispose only cleans client state and aborts
  requests. JS has closePage without a matching route. TTL bounds registry growth;
  explicit cross-host page lifetime is incomplete.
- JS GramlotBuilder imports the browser renderer into the server-authoring graph.
  Import works without DOM globals, but renderer selection/cache lifetime and
  inherited generic render/finalize compatibility require a deliberate contract.
- Standalone mount does not forward additional collections. Authoring collection
  loading does not distribute schemas to browsers. Current custom-collection
  tests explicitly supply matching runtime documents.
- Python caches authoring wrappers strongly for the builder lifetime; JS uses a
  WeakMap. Long-lived builders need an explicit retention policy.
- MainTransport labels remote failures as 'main failed'.
- Generic rendering accepts ordinary-Bag/tag forms alongside typed Source nodes.
  Review that compatibility surface; do not add conversions back to Gramlot.

<a id="gc-093-025"></a>

## 025 · Validation and next action

After cleanup: Python 17/17, Node 41/41, including cross-language transport and
root/Data identity assertions. Rebuilt and installed the wheel; FastAPI native
adapter tests pass 2/2. Chromium passes both Hello World and the full dynamic
Source/remote/disposal fixture on FastAPI/Uvicorn. Strict Sphinx and the public
documentation boundary check pass. Mutation defects above were reproduced by focused
probes; they remain findings, not successful contract tests.

Next: resolve authoring ownership and failed-write semantics before capabilities
or the host matrix. FastAPI/Uvicorn remains the integration target. Changes stay
local; no acceptance, commit or publication.


<a id="gc-093-030"></a>

## 030 · Implemented resolution of A–C

- Generic Python Builder now exposes its actual SourceBag as root. Element calls
  return SourceBagNode. The Gramlot AuthoringNode class and its strong cache are
  gone. Generic JS owns stable fluent handles; sourceTarget unwraps a handle when
  an identity-based API needs the actual node. Collections take precedence over
  convenience helpers, including an element named recipe.
- Both generic builders validate child creation on detached prospective content
  through their ordinary grammar path, then attach once. Python preserves custom
  dialect validation hooks and copies Bag-valued inputs for validation so caller
  backrefs are untouched. Gramlot's promotion policy preserves leading text in
  _text. Failed attributes, positions, cardinalities, IDs or subbuilders leave
  the scalar parent and existing same-label nodes unchanged.
- References are explicit builder.reference(node, kind) operations, using Bag's
  attribute setter. No wrapper .node, .bag or node.reference API remains.
- Bag JS owns opt-in synchronous addMutationValidator/removeMutationValidator.
  Validators inspect the proposed state before values, attributes, resolver,
  parent links, insertion/deletion/order or subscriber notifications change.
  A rejection emits no mutation event. Nested path creation is preflighted as a
  complete branch. Async/reentrant validators are rejected. Existing subscriber
  event payloads remain unchanged.
- DOM JS registers/removes its validator with renderer lifetime. It validates an
  ephemeral read-only projection of the proposed tree against grammar, native
  HTML value types and references. No Bag is reconstructed from wire to do this.
  Native setters are tried on a detached clone; direct structural writes are
  staged detached before acceptance. Main/remote reuse their prepared stage.

### Deliberate contract limits

This is pre-write validation, not a general transaction/rollback system.
Direct writes to raw attr dictionaries or private fields bypass the Bag mutation
API and are not supported reactive updates. Exceptions from arbitrary subscribers
or cleanup callbacks after commit do not roll back Source. Browser custom-element
constructor side effects are outside this native-HTML slice; direct structural
validation may construct a detached trial element before the committed rendering.

Mounted Source writes must notify the renderer: silent writes are rejected before
mutation. Legacy fired writes are two-phase and are rejected on any Bag hierarchy
with mutation validators, before their first phase. Unvalidated Data Bags retain
existing silent/fired semantics. These boundaries are explicit errors, not hidden
fallbacks or compatibility adapters.

### Verification

Core Python 19/19; Node and Bun 45/45. Generic JS 22/22 per runtime; DOM
127/127 per runtime. Bag JS 604/604 Node and new contract 15/15 Bun; the full Bag
Bun suite retains four previously known node:test mock incompatibilities.
Generic Python with current host-environment dependencies: 422 passed and the
same two recorded baseline failures (XSD Bag.walk and resolver cache_time bool).
The agent's 424/424 result used older Bag/TYTX installations and is not evidence
that those regressions were fixed. No dependency pins were restored.

Final rebuilt wheel: FastAPI tests2/2 and real Chromium Hello World plus native
Source fixture pass, including rejection before a live write. Strict Sphinx and
public documentation boundary checks pass.

Host/lifecycle findings D–E remain separate open review items. The matrix is still
deferred. All sources and artifacts remain local; no acceptance or publication.


<a id="gc-093-040"></a>

## 040 · Implementation-quality review, independent of tests

Owner request, 2026-09-20: judge ownership, class design, inheritance, mixins,
naming, readability, economy and extensibility. This review reads implementation
and call sites; it does not run tests or use previous results as design evidence.
It revisits the changes in section 030, including code introduced by this agent.

**Verdict: revision requested. The native-HTML implementation is not ready for
architectural consolidation.** Functional completion in section 030 does not
close design review. The following recommendations are not approved architecture
amendments and have not been implemented.

Scope: all core runtime/authoring/host/page/standalone modules; the directly used
JS generic Builder, Source handles, RecipeExpander and RendererBase; DOM renderer
and HTML handler; Bag pre-write validation mechanism; Python builder lifecycle,
grammar dispatch and Source mixin composition. This is not an exhaustive audit of
every Bag implementation method, every generic dialect or every external adapter.

### R1 · Critical: the generic bases carry a second reactive engine

Evidence: genro-builders-js `src/builder-base.js`, constructor, create,
renderNodes, _writebackAdd and _purgeWritebackPrefix; `src/renderer/base.js`,
_registerExpansionWriteback and _registerCell. BuilderBase allocates writeback
and cell indexes; RendererBase knows writable value/checked fields, row paths,
component rules and patch operations. Gramlot overrides create/computeLogic and
uses HtmlSourceRenderer's separate event-to-DOM machinery.

This is inherited coupling, not merely a large file. A new dialect must understand
reactive application machinery to understand its supposedly generic base; Gramlot
must bypass parts of the lifecycle it inherits. It also makes future SQL-oriented
builders harder to reason about.

Recommended direction: keep grammar, Source authoring and generic traversal in
the minimal bases. Give optional reactive computation/patch behavior an explicit
owner outside that minimal contract. Preserve existing generic-library consumers:
first identify them, then move their behavior without silently deleting it. Do not
solve this by adding more no-op overrides in Gramlot. The same lifecycle question
applies to Python BuilderBase.create and GramlotBuilder.compute_logic.

### R2 · Critical: inherited rendering contracts do not compose

Evidence: generic BuilderBase.render invokes renderer.renderChildren then finalize;
DomRendererBase.finalize expects target.full(fragment). GramlotBuilder.renderer_html
uses a native HTML element as target, caches a subscribed renderer, and
HtmlSourceRenderer.renderedItem requires a transaction installed by _stageNode.
The browser instead accesses renderer_html and inserts into Source.

The inherited public rendering route and the actual reactive route have different
preconditions. Changing target after the lazy getter also leaves the cached renderer
bound to its original destination. Inheritance currently communicates more
substitutability than the implementation provides.

Recommended direction: define one explicit rendering lifecycle, target contract
and owner for renderer creation/disposal. Retain the agreed generic renderer base
and concrete DOM/Gramlot specialization; do not abandon that ownership chain.
Remove the divergent inherited route or make it participate in the same contract.
Keep authoring importable without importing the concrete browser renderer graph.

### R3 · High: validation has become multiple coordinated pipelines

Evidence: DOM `src/renderer/html-source-renderer.js`, prepareCandidate,
validateMutation, validate, receive, _stageNode, _takePrepared; `source-mutation.js`.
Main/remote validate and construct a detached stage; a Bag validator projects and
walks the complete prospective tree; receive walks the committed tree again.
Direct structural writes create a trial stage, discard it, and construct again.
Prepared tokens have a WeakMap queue, a Set, consumption and disposal rules.

The cost is not just runtime work: one change requires understanding projections,
identity remapping, token lifetimes, native setter checks and post-write validation.
The renderer's 480 lines alone are not the finding; duplicated preparation and
hidden coordination are. A future component constructor cannot be treated as a
harmless validation operation.

Recommended direction: separate declaration validation from DOM effects; use one
preparation/commit path for incoming and direct mutations. Keep Bag's hook generic
if retained, with no knowledge of DOM. Do not retain the token/projection machinery
merely to preserve previous checks, and do not remove rejection semantics without
an explicit replacement contract. Rejecting silent/fired writes is a behavioral
restriction that must be justified independently, not an incidental implementation
convenience. The smaller final design still needs to be worked out.

### R4 · High: projection and identity protocols are implicit

Evidence: source-mutation.js traps a selection of Bag/node properties but forwards
other methods; attr returns the original mutable object. Its 'read-only' claim is
stronger than that interface. Generic source-bag.js adds another Proxy protocol,
with sourceTarget required for identity-sensitive calls. Gramlot.remoteSource reads
renderer.records directly to decide whether a node is mounted.

These are different mechanisms, not one universally bad use of Proxy. Fluent
schema dispatch has a reason to exist. Pretending a partial projection is a full
read-only Bag and exposing the renderer's storage layout do not.

Recommended direction: state the minimal validation input explicitly, avoiding a
Bag-shaped facade unless its complete semantics are needed. Normalize authored
handles at the API boundary, keep raw node identity internally, and expose an
isMounted(node) operation instead of letting callers inspect records. No new class
is needed for that operation.

### R5 · High: generic recipes know Gramlot-specific metadata

Evidence: genro-builders-js `src/recipe.js`, _expandMarker rejects __ref, although
GramlotBuilder.reference and Gramlot References define that protocol. The same
method expands into a new Source tree and then copies nested branches again through
copySource. Transport codec helpers also reside in the recipe module.

Recommended direction: generic expansion owns recursion, parameters and structural
composition. Gramlot owns restrictions on its reference descriptors. Move the
specific check to the dialect boundary (only introduce an extension hook if needed).
Reduce expansion to one deliberate output-tree construction; retain the useful
rule that incoming detached trees are not mutated. Put Source codec helpers with
Source serialization, not recipes.

### R6 · High: Host and standalone repeat page execution

Evidence: Python server/host.py and standalone.py both import files, instantiate
pages/builders, execute main and check results. JS adapters/host.js and standalone.js
repeat execution with different return-value rules. Python Host also requires a
filesystem directory; JS separates FileHost but puts HTTP body parsing/routing in
Host.fetch. Python registry records are positional tuples, unlike JS named records.

Recommended direction: one small shared page-execution function per language;
hosted and standalone callers supply their own policy. Keep filesystem loading and
HTTP adaptation outside the neutral host contract. Use named registry fields.
Do not create a service class for every helper: functions suffice until state or
substitutability requires a class. Align method selection, missing-method errors
and close/dispose ownership across languages before adding host features.

### R7 · Medium: names and module boundaries misdescribe responsibilities

- controller/main.js exports MainTransport, which performs both main and remote
  Source requests. This is transport, not a Data/application controller. Prefer
  SourceTransport in a transport module; make error messages operation-neutral.
- model/source.js mostly implements References and re-exports Bag. Prefer
  SourceReferences in a references module and direct Bag imports.
- DOM HtmlElement is one shared creation/update policy for many elements, not an
  element instance. Prefer HtmlElementHandler (or equally explicit handler name).
- builder.target means a DOM element in Gramlot and a full/partial render target
  in the generic API. Resolve the contract before choosing the final name.
- Gramlot.reference resolves while GramlotBuilder.reference creates a descriptor.
  Use a verb such as resolveReference on the runtime side.
- GramlotRenderer is a thin but useful dialect assembly point. Its small size is
  not a reason to remove it, unlike a compatibility alias with no responsibility.

Names are recommendations, not performed renames or accepted public API.

### R8 · Medium: composition needs narrower contracts, not more mixins

Python _GrammarMixin groups dispatch/validation but assumes numerous BuilderBase
internals: it is private implementation factoring, not an independently reusable
capability. SourceBag/SourceBagNode mixins depend on Bag lookup and cooperative MRO.
JS core currently uses ordinary subclasses and collaborators, not a capability
mixin system. Do not describe this as the future styling/binding capability model.

Recommended direction: retain private mixins only where they make a coherent
implementation easier to read; document required hooks and method precedence.
Use inheritance for real dialect specialization and composition for orthogonal
stateful responsibilities. Do not add styling/boxing/labeling bases speculatively.
Prefer clear short methods over compressed one-line implementations or positional
boolean argument sequences (notably recipe appendNode and Source mutation calls).

### What should remain

Keep Bag as the actual data structure, typed SourceBag transport, shared collection
grammars, detached recipe preprocessing, a small Page contract, and one reactive
DOM coordinator with an HTML handler. Keep explicit cleanup and reference ownership.
The problem is duplicated execution paths and implicit contracts, not the existence
of these responsibilities. Fewer lines means fewer mechanisms, not code golfing.

### Implementation order and acceptance criteria

1. Resolve R1–R2: minimal inherited contract and renderer lifecycle, checking owner
   library consumers before changing shared APIs.
2. Simplify R3–R5 as one Source preparation/update path with clear identity and
   reference ownership; remove superseded mechanisms rather than layering adapters.
3. Consolidate R6, then perform R7 naming changes on the settled responsibilities.
4. Review each resulting class and call chain against R8 before host expansion.

A reviewer must be able to follow authoring → serialization → expansion → Source
insertion → DOM update without consulting test fixtures or discovering hidden
alternate paths. Each class needs a concise reason to exist and an identifiable
owner of its state. No implementation changes, runtime checks, commits or publication
were performed for this review. GC-070 is updated to put this design work first.

<a id="gc-093-045"></a>

## 045 · Generic-builder and native-renderer design review — 2026-09-20

Implemented within settled ownership:

- Grammar decoding rejects variadic flags contradicting the actual parameters.
  Public names follow Python's loader boundary (nonempty, not private), including
  keyword, Unicode and hyphenated names. This does not broaden sub_tags syntax.
- Container composition has one base-to-child walk and one collision rule: an
  alias cannot change implementation method name. Overriding that same method in
  a subclass remains valid. Proposed declarations validate before state mutation.
  Removed the unnecessary array-or-object internal representation and cache: static
  field order must not hide later declarations. No cache invalidation system added.
- Removed unused generic pointer.js after checking imports and package exports.
- SourceBagNode and the DOM handler share sourceAttributeItems for metadata removal
  and Python keyword escapes. Example: `_class` renders as `class`, `foo_` remains
  `foo_`, and datapath/node_id/updateOn never become DOM attributes. Initial mount
  and later updates use the same rule, including the retained ordinary-Bag path.
- Structural DOM replacement now commits its already prepared replacement even
  when old-node cleanup throws, then reports that error. Example: a failing
  onDispose callback no longer leaves Source='new' with no corresponding DOM.

Review findings still requiring decisions:

1. **SVG serialization loses content.** Both owning Python and JS implementations
   classify metadata and geometric tags as void. metadata('license') becomes
   `<metadata />`. The grammar permits scalar text: sub_tags='' only excludes child
   nodes. Proposed correction: reuse XmlRenderer composition, retaining SVG attribute
   adaptation and Python lowercase boolean output. This changes empty `<rect />`
   to `<rect></rect>` and inherits XML doc-header handling. Owner confirmation of
   exact empty-tag spelling is pending; no serializer change made.
2. **HTML void vocabulary is duplicated.** Static HtmlRenderer and Gramlot HtmlElement
   each list br/input/img and other void elements. Ordinary empty tags already have
   paired output. Exported HTML JSON does not carry explicit void metadata. Do not
   infer it from sub_tags='' or add another vocabulary; ownership/export representation
   needs a bounded decision before correction.
3. **Source replacement lacks an adoption contract.** attachSource({replace:true})
   binds a new source while _sourceroot still points to the old one. Reproduced loss
   of pretty-render nesting. Moving a previously rendered source between builders
   also allows cached target ID n1 and a newly allocated n1 to coexist. Gramlot's
   normal main/remote path retains its root and does not use this replace option.
   Decide whether to remove this unused option or define transfer/identity ownership;
   no detach, remapping or compatibility patch has been introduced.
4. **Ordinary-Bag compatibility and projection/staging complexity remain.** No
   typed-only migration or new pre-write/rollback protocol has been authorized.
   Earlier withdrawn universal validation questions do not authorize deleting
   current machinery either.

Agent proposals to remove deferred recipes, move the renderer association out of
GramlotBuilder, or add live CSS were rejected as contrary to scope/owner decisions.
A speculative staging-hook leak was not treated as a reproduced defect. Tests
support these bounded fixes; they do not establish that the architecture is complete.

Verification: installed local package graph, generic 84/84 and core 57/57 on both
Node and Bun; bundles rebuilt. Python and Bag source did not change in this review.
Logs: /private/tmp/gramlot-design-review/. Work remains local and uncommitted.

<a id="gc-093-050"></a>

## 050 · HTML void metadata — owner-approved correction

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


<a id="gc-093-055"></a>

## 055 · SVG specializes XML serialization

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


<a id="gc-093-060"></a>

## 060 · Whole-Source replacement decision deferred

**Owner decision — 2026-09-20: defer whole-Source replacement policy.**
Keep `attachSource(source, {replace: true})` unchanged for now. The known defect
remains open: replacing the source can leave the structural root attached to the
old Bag; transferring between builders can also duplicate cached target IDs.
Gramlot main/remote does not use this option. Neither removal nor a new adoption,
identity-remapping or root-transfer contract is approved. Revisit with the owner
later; this deferred choice does not block independent review work.

<a id="gc-093-065"></a>

## 065 · Attribute ownership, shared tag resolution and inherited components

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


<a id="gc-093-070"></a>

## 070 · Necessity audit before refining extra APIs

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

| Existing mechanism | Observed reason to exist | Review result |
| --- | --- | --- |
| JSON grammar parsing/resolution | Shared Python/JS collections; actual HTML/SVG and Gramlot consumers | Required responsibility; shared parsing/resolution already exists |
| defineGrammar(JSON) | Installs class-level HTML/SVG grammar with inheritance | Actual internal use; does not itself justify a second public declaration notation |
| loadGrammar(JSON) | Installs per-instance Gramlot collections without changing other instances | Required behavior with existing consumers |
| defineDeclarations elements/abstracts | Alternative declaration objects in generic tests and README | Necessity not established; repeated-call policy question withdrawn |
| element/abstract helper exports | Wrap/copy declaration objects | No independent operational need established in audited consumers |
| container/component helper exports and static arrays | Associate executable methods with names | Underlying behavior exists; coexistence of several declaration surfaces still requires justification |

This audit neither approves the extra surfaces nor removes behavior by inference.
The next implementation must follow a justified boundary, not optimize unsupported
APIs merely to make their tests pass.


<a id="gc-093-075"></a>

## 075 · Remove the unnecessary JS declaration surface

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


<a id="gc-093-080"></a>

## 080 · Builder ownership and grammar identity review

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

**Deferred by owner (2026-09-20), with future recipe work.**

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


<a id="gc-093-085"></a>

## 085 · Native DOM record ownership

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


<a id="gc-093-090"></a>

## 090 · Strict Source contract and owning-library corrections

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


<a id="gc-093-095"></a>

## 095 · Primary-path cleanup without compatibility additions

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


<a id="gc-093-100"></a>

## 100 · Current native HTML matrix — 2026-09-21

**Functional minimum reached locally; architectural acceptance remains open.**
This supersedes earlier matrix and class-inheritance descriptions for the active
slice. Generic Builder owns Source/grammar/static rendering; Gramlot owns the
live renderer directly. No DOM JS dependency or recipe path is active.

| Profile | Authoring | Hello World | Source live | Disposal |
| --- | --- | --- | --- | --- |
| Raw ASGI / Uvicorn | Python | Pass | Pass | Pass |
| FastAPI / Uvicorn | Python | Pass | Pass | Pass |
| Kajenn BaseServer | Python | Pass | Pass | Pass |
| Flask | Python | Pass | Pass | Pass |
| Node HTTP | JavaScript | Pass | Pass | Pass |
| Bun.serve | JavaScript | Pass | Pass | Pass |
| Standalone file | Python | Pass | Pass | Pass |
| Standalone file | JavaScript | Pass | Pass | Pass |

All eight execute installed local packages in Chromium. Source checks include
scalar text, attributes, nested insertion/update, branch replacement, deletion,
rejection of ordinary Bag Source and complete renderer/root disposal. Standalone
files make zero HTTP requests. Mutations are test-driver actions against framework
APIs; example pages remain just root.h1('Hello World'), without application DOM or
manual event/fetch code. Remote Source is covered by core contracts and the separate
native browser fixture, not by the Hello World matrix (which declares no remotes).

Dependencies: Builder Python 0.23.3, Builder JS 0.1.2, JS Bag 0.5.2, JS TYTX 0.15.0.
Core remains 0.0.0.dev1 / JS 0.0.0-dev.1; this is not a 0.1.0 release. Built current
core, adapter and example sources into wheel/tarball artifacts before installation.
The Python host environment and a fresh JS consumer use local archives, not source
fallback imports. No upstream-install guarantee, dependency pins, commit or publish.
No provider database imports appeared in the four Python profiles: Kajenn imports
its own database registry module but the registry is empty. Example JS imports
no database provider. Database folders remain placeholders.

Evidence: local temp/matrix-review-2026-09-21 retains the browser harness, Python
launcher and JSON results; /private/tmp/gramlot-matrix-review contains installed
artifacts, logs and standalone outputs. Harness paths identify this machine's
verification environment, not application installation instructions.

<a id="gc-093-105"></a>

## 105 · Implementation quality — source review independent of passing tests

Reviewed every handwritten core Python/JS module, both host-language page paths,
standalone compilation, generated grammar ownership and native adapter bridges.
Passing the matrix does not resolve the following findings.

### Corrected within existing decisions

- Removed the unused JS distribution copy of HTML5/SVG collections (129,154 bytes)
  and its copy script/lifecycle commands. Runtime already uses HtmlBuilder's bundled
  grammar. Two raw-JSON tests now read the existing shared Python package export;
  no new grammar or format was introduced. Final npm archive has no collections/.
- JS Host.source(pageId, null) previously dispatched main via buildSource's internal
  sentinel. It now rejects missing/null methods and main, matching the explicit
  remote-method contract. A real decorated method still works on Node and Bun.
- Corrected the repository map: removed nonexistent DomRendererBase and
  HtmlSourceRenderer files/classes and generic recipe responsibility.

### Q1 — High: repeated validation and speculative rendering

GramlotRenderer.validateMutation projects the whole Source using Proxy objects,
validates the projection, checks references and may construct a temporary DOM.
receive then validates the complete committed Source again. Direct structural
writes discard the first stage and build it again. Main/remote instead maintain
single-use prepared-token queues/maps and remap a synthetic/proxy root identity.

Reproduced by counting calls on HtmlElement (no production instrumentation): with
100 divs, changing one scalar triggers **200 validate calls**; inserting one div
triggers **202 validate calls and 2 create calls**. This is unnecessary repeated
work for ordinary updates and a substantial extra protocol to maintain. It is
not evidence that Bag notifications require a parallel state engine. The existing
code offers pre-write DOM-failure guarantees beyond the original event-driven
insert/delete/setter-or-rebuild description. Those guarantees remain an explicit
owner decision; no replacement transaction/cache protocol was invented in this audit.
Files: js/src/renderer/gramlot-renderer.js and source-mutation.js.

### Q2 — Medium: test-only extension surface

The renderer constructor's validateCandidate callback, stored candidateValidator,
has no production consumer in core or the reviewed examples/adapters. Its sole
caller is a custom-hook test. It participates in three validation routes. A test
of an invented extension is not justification for a framework API. It remains
flagged, not accepted as a requirement or expanded with additional hooks.

### Q3 — Medium: duplicated Page execution has observable divergence

Python Host.resolve_page and standalone._page_class repeat module loading/class
validation; Host._source and standalone._compile_python repeat builder creation,
invocation and return checks. JS Host.buildSource and compilePage repeat the same
execution contract. A concrete JS Page.main that authors h1 then returns null works
hosted but fails offline (only undefined is accepted there). Hosted JS constructs
its builder without a name; standalone uses 'main', while Python names it after
the invoked method. These are real contract differences, not language necessities.
No new execution service/base class was added to hide the choice of contract.

### Q4 — Medium: neutral-host and transport boundaries differ

JS Host contains Web Request/Response parsing, body-size limits and endpoint
routing in fetch; Python Host delegates HTTP to engine adapters but itself loads
filesystem pages, whereas JS has a separate FileHost. Web APIs are engine-neutral,
so this is not a Node import violation, but the ownership split is inconsistent.
Python adapters also repeat the main/source/close payload policy. Consolidation
needs an agreed boundary; moving code into more classes is not automatically better.

### Q5 — Medium: server lifetime is not connected to browser disposal

Gramlot.dispose releases browser records and requests, not the server's page entry.
Python adapters expose close routes; JS Host has closePage but no HTTP close route.
Entries therefore remain until TTL/pruning or server shutdown. The current matrix
proves browser cleanup only. No beacon/session lifecycle was invented here.

### Q6 — Recorded distribution limitation: grammar refresh

Python Gramlot loads a packaged HTML5 JSON snapshot; JS inherits the installed
HtmlBuilder grammar. Both packaged HTML5/SVG exports match the currently installed
Builder JS byte-for-byte. An independent future dependency update can nevertheless
leave the snapshot behind. The remaining Python-side packaging/export policy needs
an explicit decision; this audit removed only the demonstrably unused JS copy.
The Python svg.json snapshot currently has no direct core loader consumer.

### Classes and mechanisms that have a concrete present purpose

- GramlotBuilder: application authoring dialect over generic builders; mixed text
  preservation and transportable references. Inert execution overrides implement
  the agreed separation from browser logic, not a second generic dispatch system.
- Page, Host, FileHost, Bootstrap and typed errors: page declaration, neutral host
  operations, environment-specific file loading and explicit result/failure values.
  Their overlap is Q3/Q4, not grounds for blindly merging them.
- Gramlot: one Source/Data root pair and main/remote/embedded lifecycle; MainTransport
  performs HTTP. Its name now understates remote responsibilities; renaming is pending.
- GramlotRenderer / HtmlElement: live coordination versus concrete native DOM
  properties/setters. Records associate Source nodes to DOM and cleanup; that map
  itself is necessary. Its speculative preparation machinery is Q1.
- References: explicit mounted Source/DOM references, as requested. No new view,
  model, mixin or compatibility class is needed for this milestone.

No plain-Bag-to-Source conversion, attr.tag fallback, duck-typed Source acceptance,
recipe implementation, DOM JS dependency or application-authored DOM construction
was found in the active native path. Legacy PoC paths in adapter repositories were
not promoted or declared release-ready by this audit.

**Next decision:** settle Q1's required failure semantics before redesigning the
renderer. Q2–Q6 remain listed problems, not permission to invent their solutions.


<a id="gc-093-110"></a>

## 110 · Speculative rendering removed by owner decision

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



<a id="gc-093-115"></a>

## 115 · Explicit branch freeze/unfreeze

**Branch freeze/unfreeze implemented and verified — 2026-09-21.**

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



<a id="gc-093-120"></a>

## 120 · Dedicated Worker host replaces standalone compilation

Owner approved implementation after the file/Worker/IndexedDB feasibility probe;
database integration is explicitly excluded. Q3's duplicated execution is removed:
Host.registerPage now owns registration independently of HTTP bootstrap generation;
WorkerHost inherits Host.main/source/buildSource without overriding page execution.
Both hosted and Worker pages use fresh Page/Builder instances and accept null or
undefined returns under the same rule. WorkerHost serves one Page at `/`.

Only two classes were added: WorkerHost for message dispatch to the existing host,
and WorkerTransport for correlated requests, cancellation, errors and Worker lifetime.
standalone.mount creates the transport, registers the Page, prepares Gramlot before
main, and disposes on startup failure. Gramlot.dispose releases an owned transport;
Worker termination releases its entire page registry. Hosted server cleanup (Q5)
remains unchanged. No new Source representation, binding map, DB or recipe path.

Removed the active Python standalone compiler and JS compilePage, including the
old compile-only tests. Historical copies are in temp/retired-standalone. Dedicated
public package entries `/page` and `/worker-host` avoid Node filesystem imports.
Applications must import the shared Page from `/page` to run in both environments.
The separate standalone exporter still targets the removed compiler and needs
migration; the previous eight-profile matrix no longer describes the current API.

Verified: Node72, Bun72, Python16. Real Chrome153.0.8010.48 and Playwright WebKit26.6
pass local-file Worker main, remote Source, live text/attribute/insert/delete and
disposal without HTTP(S). Chrome also passes the existing HTTP host browser contract
including freeze/unfreeze. No Safari or Firefox claim. Runtime assets rebuilt.

One primary Worker format: bundled classic JavaScript. A Blob module Worker failed
from file:// in Chrome; no automatic retry/fallback was introduced. The test HTML
is explicit scaffolding. Single-HTML production export remains blocked by static
Builder interpolation of `${...}` inside embedded scripts, e.g. `${depth}` from the
bundle; Builder is read-only and no Gramlot workaround was added.

Cancellation discards the response and clears browser bookkeeping; it does not
interrupt host page code already running. WorkerHost inherits page TTL/capacity.
External Page.css and multiple pages remain outside this bounded standalone contract.


### Neutral JS Host / HTTP separation completed — 2026-09-21

Moved Host.fetch parsing/routing/HTTP error mapping into the existing shared
gramlot-nodejs/src/native-fetch.mjs. Adapter ownerForRequest supplies identity;
Host retains ownership checks and page execution. Removed the Host callback and
fetch method, with no forwarding alias or new class. Node/Bun use one dispatcher;
WorkerHost remains on neutral open/main/source methods.

Moved HTTP request validation coverage to the adapter's real-listener test and
changed Hello World's host test to call main directly. Removed the core's duplicate
HTTP bridge fixture. JS browser harnesses now require GRAMLOT_TEST_URL from a
running adapter; Python harness startup remains available. Paired public host guide,
core map and adapter guide updated. Local core/adapter/example installations refreshed
from packages with unchanged upstream Bag and corrected local Builder. No pins or
lockfiles, source publication or version bump.

Verified: core Node72/Bun72 (one HTTP test moved to adapter); adapter listener on
Node and Bun; installed Hello World; Chrome Node/Bun main/remote/live Source/freeze/
unfreeze/dispose; Chrome file Worker main/remote/live/dispose with no HTTP(S).
Strict Sphinx and public-doc boundary/link/mirror checks pass. Evidence under
temp/host-http-separation. This is not the full seven-profile refreshed matrix.

HTTP ownership part of GC-093 Q4 is settled. Python filesystem loader alignment,
HTTP page-close lifecycle and Python grammar distribution remain open; no decision
was inferred for them. GC-110 phase3 therefore remains in progress.
