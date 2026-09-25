# 210 · Gramlot 0.2.0 binding contract and execution plan

Document ID: **GC-210**. Recorded: **2026-09-25**.

[Concise counterpart](../../docs_llm/internal/210-binding-contract.md).
[Constitution](../00-constitution.md) · [Current status](070-work-status.md#gc-070-495).

<a id="gc-210-005"></a>
## 005 · Authority, provenance and delivery boundary

Block ID: **GC-210-005**.

This is the English repository transcription of the unified 0.2.0 plan, revision 3 with
its later additions, including its approved decisions, architecture, phases and acceptance gates. It
supersedes GC-165 as the binding execution plan; GC-110 remains the completed 0.1.0
plan. The earlier plans, handoffs and legacy probes remain historical evidence.
This contract is planned behavior, not a claim that reactive binding is implemented.

Owner evidence, 2026-09-25: the unified plan header records the owner's approval on
2026-09-25; its sections 2–3 and the decision record confirm the remaining proposals **“per ora”** (for now). Individually settled decisions
are identified below. The S00 brief authorizes transcription, the disposition of
pre-existing documentation, baseline checks and inventories; the current task says
“Esegui la fase S00 di Gramlot 0.2.0” and requires one commit on develop, no push,
and a final report beside that brief. Completion acceptance still belongs to the
owner after review. Q2–Q5 remain open at their consuming phases.

Provenance: the owner-approved unified plan (revision 3 with later additions,
sections 2–10) and the S00 brief, both kept outside this repository. The brief identifies the owner-decision record
(section “Decisioni dell'owner” through the document-ID decision) and the review
section 3 disposition table. SHA-256 at transcription:

- Unified plan, revision 3 with later additions: `9d7251c4d0ad0a1eb02b7ce6aa3a9b8f198f862a62c93a37c69d840212ead035`.
- Unified plan, revision 2 (first transcription): `a9eda5d9f9f1541b3851ff7fc93e37bfbc74658df67ad5a9794929e6622c8b33`.
- Owner-decision record: `40de3e54e8a9e2ef02ef88a5b5c3261f41345506bd17563aae6835b824b649b1`.
- Disposition review: `1ec993d5f65746e2b3bbba92e4d9b2261cf32b70e502dd3e5393fcc49bcaa153`.
- S00 brief: `baed3e78d36bd10289c4fd561e5a6442cc2634f6d99d5135fbb6f84cca3c2e0a`.

These references establish provenance; the contract below is self-contained.
Constitution amendment 11.47 records the decisions in both repository views.

Implementation uses real SourceBag/SourceBagNode and TYTX, one agreed path, no
parallel Source or Data store, no module-level mutable state and no global `genro`.
Python authoring comes first. Builder and Bag, including installed copies, are
read-only here. Fixes to genro-builders or genro-bag are forbidden (owner, 2026-09-25);
missing behavior goes into the Gramlot source classes of §018, never elsewhere. Record tested versions without pinning dependencies. Each phase needs
its own owner authorization, bounded commit, behavior note, meaningful tests and
paired GC-070 update. New JS tests belong in `js/tests/*.test.js`, Python tests in
`tests/`; real-browser tests use a separate runner. No release or deployment is
implied. Execution/review assignments remain operational metadata in the external brief.

<a id="gc-210-010"></a>
## 010 · Release decisions and supersession register

Block ID: **GC-210-010**.

Every row is an owner decision dated 2026-09-25, sourced by the correspondingly
named decision in the record identified in §005, or by unified-plan §2. “New” means
there was no earlier approved behavior to replace. Test names below are planned
unless §080 explicitly records execution.

| Decision | Contract and superseded proposal | Phase | Required evidence |
| --- | --- | --- | --- |
| Data root/ownership | Outer root → `main` → document Bag; `gramlot.data === builder.data`; authored paths omit `main`; one Gramlot subscription/router. Supersedes segmented Data and unresolved ownership gates; original receipts GC-070 §§425–435 | S01, S03 | Identity/backrefs, two isolated instances, stable root after branch replacement |
| Canonical declarations, P18 | `dataSetter(destination_path, value=None, **attr)`; `dataFormula(result_path, formula=None, func=None, **params)`; `dataController(script=None, func=None, **params)`. Inline `formula`/`script` and named `func` are mutually exclusive. Supersedes `.data(path, value)`, setter `destination`, formula `destination`, generic-only signatures and legacy dispatch | S02 | Python/JS positional and named calls, attribute-only setter, invalid calls, inert transport |
| B8 | No `?attr` in `destination_path` or `result_path`; reject before installation. Attribute selectors remain valid in reading pointers | S02, S05 | Validation before side effects; R1 attribute-only update |
| `_path` suffix | Bare paths; strip authored `^`/`=` pointer prefix with one warning per declaration. `foopath` is an ordinary attribute. New explicit normalization exception | S02, S04 | Prefix removal and one warning; ordinary attribute unaffected |
| Variable datapath | `datapath='^.foo'` uses the Data value at `.foo`; changes rebind the whole branch. Supersedes literal-only context assumptions; resolved by `GramlotBuilderBagNode.absDatapath` (§018) | S04 | Changing, empty and nested variable contexts |
| A2 | All setters of initial/inserted branch before any DOM, document order including deep later descendants; later non-null duplicate wins. Supersedes per-build-level legacy stripping | S05 | First-render values, duplicates at different depths, remote insertion |
| R1 | Non-null writes; null on existing path retains value and applies attributes; null on missing path creates null plus attributes. Runtime setData unchanged. Supersedes unconditional null overwrite and legacy lost attributes | S05 | Absent null, 7 then null, attribute-only null, 7 then 9 |
| D1a | `default`, `default_value`, `default_<attr>` after setters, empty paths only; `attr_*` follows §012. Construction defaults differ from future newrecord defaults | S05, S15 | False/0/empty string preserved; defaults never beat later setter |
| D2a | `_userChanges` accepts only `node` trigger level, excluding `container`, `child`, `autocreate`; it is not user-versus-program discrimination | S08 | All levels including programmatic node writes |
| Pointers/lifetime | `^`, `=`, page-only `==`; relative/symbolic (§012)/attribute pointers; rebind on Source/context changes; removal keeps Data; rebuild/thaw do not reinstall | S04, S09, S13 | Rebinding and exact lifecycle traces |
| D4 | Boolean `value='^x'` on checkbox; radio adds `group`, one boolean per button and peer writes. Supersedes `checked='^x'`; radioButtonText deferred | S11 | Both Data booleans and DOM peers, mouse/keyboard, isolation |
| V1, live, freeze | `visible=false` → visibility hidden; native `hidden` unchanged; `live=False` default; freeze suspends structural rebuild only. Retains separately recorded freeze extension | S04, S10, S13 | Geometry, input/change, active existing views/providers under freeze |
| D7 | Named logic primary, inline only in page runtime; no eval in Python/JS Host, WorkerHost or DevTools. Native Source script stays HTML5. Explicit named/inline exception to §13 | S07–S09, S14 | Import graphs, server sentinels, real CSP |
| Source operations | Named code uses `node.SET` etc.; inline uses `this.SET` etc., `this` is Source node. Builder `setRelativeData`, `getRelativeData`, GET/SET; PUT/FIRE/FIRE_AFTER of `GramlotBuilderBagNode` (§018); no Gramlot ops layer | S01, S08 | Silent PUT, FIRE marked for the router, nested writes and reset |
| Macro compatibility | Deprecated inline preprocessor uses legacy regexes, translates GET/SET/PUT/FIRE/FIRE_AFTER to node methods and `$n` to arguments; one warning on first compilation. Same string/comment limitations. Supersedes macros as sole inline write mechanism | S09 | Direct calls without warning, each macro, strings/comments, cache/release |
| Delayed writes | `FIRE_AFTER(path, value=true, delay=10)` in ms, method of `GramlotBuilderBagNode` (§018); timer tracked on the NodeBinding and cancelled when it closes | S08 | Default/explicit delay, cancellation at NodeBinding close, closed recipients not called |
| Button, B7 | Nested ordinary dataController is primary, still reacts to pointers/init/start/timing; click adds a trigger. Alternatives action or fire family (§012); connect_on events secondary | S08, S12 | Normal provider plus click, exactly one click invocation |
| R3 provisional | Gramlot-enabled button gets type=button only if absent; preserve explicit type; stopPropagation, no preventDefault. Plain button native. Supersedes both unconditional native cancellation and unqualified native defaults | S12 | Forms, submit, parent handlers/controllers, Enter/Space, native listeners; owner reviews effects |
| Bootstrap/resources, P23 | Page declares `js_requires`/`css_requires` in both languages, names only; hierarchical all-level JS last registration wins, CSS cascade; public same-name companion last; nonce distinct from page_id, static hashes. Supersedes Page.css, camelCase and legacy first-JS-only resolution | S06, S07, S14 | Three resource levels, nonce/hash, CSP, all eight hosts |
| Source↔DOM | Renderer and Gramlot expose `getBaseSourceNode(domNode)` and `getDomNode(sourceNode)` through existing maps; no added object properties | S04 | Ancestors/text/fragments; null for nonvisual/unbuilt/removed nodes, fresh element after rebuild |
| Exclusions | Explicit errors for serverpath, dbenv, shared_id, remote, dataRpc, dataRemote, subscribe_*, selfsubscribe_*, formsubscribe_*, PUBLISH, _ask, ask; same keys inside user Data stay data | S02, S16 | Rejection at declaration boundary, user payload untouched |

Deferred without adding new error contracts: components/widgets, stores/grids/trees,
forms/records/newrecord, server synchronization, CSS beyond css_requires and native
projection, rich editing, asynchronous scheduling/transactions, gramlot.warning,
LightButton, automatic 200 ms disable and click-burst behavior.

<a id="gc-210-012"></a>
## 012 · Legacy attr_*, symbolic paths and click attributes

Block ID: **GC-210-012**.

Added on 2026-09-25 when GC-210 was aligned with unified plan revision 3 and its
later additions. Every row is an owner decision dated 2026-09-25 from unified-plan §2.

| Decision | Contract and superseded proposal | Phase | Required evidence |
| --- | --- | --- | --- |
| `attr_*` | As legacy `stripDataNode` (`genro_src.js:581-593`, origin/develop): on a visual node `attr_<name>=v` sets attribute `<name>` on the Data node of the control's `value` (the path in `value`, or in `src`). `v` may be a pointer, resolved on the node. It applies only if that Data node exists, without checking whether the attribute is empty, and after the node's own defaults: a default that just created the Data node lets `attr_*` apply. Example: `input(value='^.prezzo', attr_dtype='N')` sets `dtype='N'` on Data node `.prezzo`. Corrects the P15 clause that evaluated `attr_*` before the default | S05 | Existing Data node, Data node created by the default, absent Data node (no effect), pointer value |
| Symbolic paths | Only the symbols Builder already resolves (`source-bag.js:109-190`): `#parent` (one level up), `#FORM` (first ancestor with `formId` or `form=True`), `#ANCHOR` (first ancestor with `_anchor`), `#<node_id>` (the node with that `node_id`). Example: `value='^#FORM.cliente.nome'`. Legacy `#WORKSPACE`, `#ROW`, `#DATA` and aliases do not exist in Builder and stay out of 0.2.0 | S01, S04 | Each supported symbol, including `?attr` pointers |
| `action` | As legacy `_ButtonLogic._clickHandlerDo` (`genro_widgets.js:3545-3598`, origin/develop): inline code run on click with `this` = button node. It receives the current button attributes plus `event`, `_counter` and `modifiers`. D7 inline rules apply: page runtime only, discouraged | S09, S12 | Click invocation and received arguments |
| `fire` | `fire='.path'` runs FIRE on `.path` on click. The value is the modifier string (`'Shift'`, `'CtrlAlt'`, …, from `eventToString`, `gnrlang.js:1757`), or `true` without modifiers. The Data node receives attributes `modifier` and `_counter` | S12 | Value with and without modifiers; `modifier`/`_counter` attributes |
| `fire_<name>` | `fire_<name>='.path'` runs FIRE on `.path` with value `'<name>'`. Several `fire_*` on one button all fire (P10 order). Example: `fire_salva='.azione', fire_chiudi='.chiusura'` | S12 | Several `fire_*` on one button |
| Click mechanism exclusion | Legacy excludes the mechanisms in a chain (`action`, then `fire`, then `fire_*`) and fires the nested controller in addition. Gramlot applies P10: any combination of nested controller, `action` and the fire family is an error | S12 | Each combination rejected |

<a id="gc-210-015"></a>
## 015 · Confirmed proposals and remaining decisions

Block ID: **GC-210-015**.

All P rows have owner provenance dated 2026-09-25. P4/P7/P14/P17/P18/P21/P23/P25 were
settled individually; the remaining proposals were confirmed “per ora”. A discovered
problem must return to the owner; this is not permission to choose an alternative.
Nonarchitectural corrections may belong in 0.2.1. Unless stated otherwise these
settle previously unapproved proposals, not older approved behavior.

| ID | Confirmed rule | Phase → test |
| --- | --- | --- |
| P1 | Suppress only redundant value projection originating at that control when its DOM value already matches. Corrective values return to origin; title/class/style and providers always react | S04/S10 → caret preserved, controller normalization visible, other attributes updated |
| P2 | Eight-step installation in §035 | S05/S08 → exact ordered trace |
| P3 | Frozen inserted branch executes steps 1–5 immediately; DOM/built at thaw, start waits for first build | S05/S13 → never-built and nested-freeze cases |
| P4 | Settled, aligned with legacy `nodeTrigger` (`genro_src.js:167-203`) and `_isBuilding` (`gnrdomsource.js:982-992`): finish each build; queue Source mutations and run them after the build; ignore changes to a currently building node (§025); queue in arrival order as today (`gramlot-renderer.js:211`), where legacy uses pop(); onBuilt after complete construction (`onBuiltCall`). Supersedes error-on-reentrancy and legacy LIFO | S03/S05 → observer/init mutation traces |
| P5 | Existing observers see setter writes synchronously; new branch providers wait through setters/defaults | S05 → external sees 1 then 2, internal sees final state |
| P6 | Finite style vocabulary in §030 | S04 → types, removal, SVG and precedence |
| P7 | Comma parsing, trim, ignore empty tokens/duplicates preserving first position; slash-separated segments match `^[A-Za-z0-9_-]+$`; reject dot segments, leading/trailing slash, extensions and colon. Supersedes slash ban and errors on empty/duplicate tokens | S06 → parser parity and invalid names |
| P8 | No duplicate-setter warning; future warning Bag deferred | S05 → deterministic writes without warning |
| P9 | button_counter, button_shift, button_ctrl, button_alt, button_meta; counter lasts for semantic node | S12 → modifiers, rebuild retains counter |
| P10 | Exactly one click mechanism: one nested controller, action, or fire family. Ambiguity errors; all fire_* attributes in attribute order; connect_onclick separate and afterward | S12 → multiple controllers/mechanisms rejected, fire order |
| P11 | Radio DOM name scoped by instance plus group; multiple initial true values in one group error | S11 → isolation/conflict tests |
| P12 | Provider exception interrupts delivery visibly; context/FIRE markers restored in finally, silent FIRE reset still runs; no rollback; subsequent writes work | S08 → throwing recipient and next write |
| P13 | Requires fields are one comma-separated string | S06 → Python/JS descriptors |
| P14 | pages/name.py or pages/name/name.py; both present error; companion beside either; JS pages in separate directory. A JS page `ordini.js` exports both `Page` (used by the Node/Bun host to build the Source) and `Logic` (used in the browser), so it must import in both environments without server-only imports. Explicit §13 exception, supersedes folder-only proposal | S06 → both layouts/ambiguity/traversal; S07/S14 → JS page imports on Node/Bun and in the browser |
| P15 | Only null/missing empty; false, 0, empty string values; default_value beats default; attr_* follows the legacy rule in §012 (after own default, only if the value's Data node exists) | S05 → boundary/default precedence |
| P16 | S00 execution followed by separate review; S06 assigned separately in external brief | S00/S06 → delivery and review receipts; no runtime behavior |
| P17 | Settled (owner, 2026-09-25): the node methods live in `GramlotBuilderBagNode extends SourceBagNode` and `GramlotBuilderBag extends SourceBag` (§018); no prototype mutation. Node semantic state (registrations, timers, counter, stamps) stays for now in NodeBinding, in a BindingRuntime Map keyed by the actual node; it may move onto the node later without author-visible effects. Supersedes "no SourceBagNode subclass" | S01/S03 → Gramlot classes on every browser path; identity through insertion and transport destination |
| P18 | Canonical signatures in §010, no legacy dispatch; optional setter value | S02 → valid/invalid signatures in both languages |
| P19 | Reject legacy data-element calls with migration message only if distinguishable from HTML5 data without content heuristics; otherwise documentation migration. No alias | S01/S02 → observed legacy call and legitimate HTML5 data |
| P20 | Formula: method(kwargs) returns result; controller: method(node, kwargs); this=group. Resolved author attributes plus _node, _triggerpars, _reason, and button _evt/button_*; exclude control attributes listed in §040 | S07/S08 → argument/receiver contract |
| P21 | Each resource exports class Logic; per-page resource groups, companion root, specific methods override generic. Supersedes static-method holder/page mixin proposal | S07 → groups, collision, constructor and isolation checks |
| P22 | Numeric _onStart in ms; true and 0 immediate; negative/nonfinite error; independent of other-trigger _delay | S08 → virtual clock |
| P23 | Same snake_case requires fields in Python and JS, no aliases | S06/S14 → authoring and all hosts |
| P24 | remoteSource admissibility, response validity and cancellation use semantic lifetime; latest request wins | S03 → rebuild, removal, late response, frozen living target |
| P25 | Authoring dict/plain JS object becomes Bag(value); nested dicts become Bags, lists and their dictionary items remain lists/items, JSON strings stay strings. Supersedes scalar-only assumptions; no custom converter | S02 → TYTX cross-language payload identity/types |

| Open ID | Decision still required | Gate |
| --- | --- | --- |
| Q2 | Synchronous provider cycles: gather real cases, no arbitrary limit | S08 |
| Q3 | Actual CSP profiles: named without unsafe-eval, inline only under application-selected permissive policy | S14 |
| Q4 | Connected-repository write authorization for 0.2.0 migration | S14 |
| Q5 | Native conversion matrix in §060 | S10 |

Q1 is closed by dataSetter. No fixes to genro-builders or genro-bag (owner,
2026-09-25). Silent PUT, FIRE marked for the router, FIRE_AFTER with a tracked timer
and absDatapath with variable datapath and symbolic `?attr` are implemented in the
Gramlot source classes (§018), so S04 and S08 wait for no external release. S01
measures the TYTX null-attribute loss in `Bag.fromTytx`; any solution goes into
those classes after owner approval. No Builder or Bag source is edited.

<a id="gc-210-018"></a>
## 018 · Gramlot source classes

Block ID: **GC-210-018**.

Owner decision, 2026-09-25: fixes to genro-builders and genro-bag are forbidden for
Gramlot. The previously planned dependency fixes are withdrawn. Behavior that
Builder lacks goes into two Gramlot classes in the new file
`js/src/builder/source.js`. They are planned for S01 and not yet implemented.

```js
export class GramlotBuilderBag extends SourceBag {
    get nodeClass()               // returns GramlotBuilderBagNode
}
export class GramlotBuilderBagNode extends SourceBagNode {
    PUT(path, value)              // silent: Bag setItem(..., doTrigger=false)
    FIRE(path, value = true)      // marks its own write for the router, then writes with fired=true
    FIRE_AFTER(path, value = true, delay = 10)   // FIRE after delay ms; timer tracked on the NodeBinding
    absDatapath(path)             // variable datapath; ?attr preserved on symbolic paths
}
```

- `SET`, `GET`, `setRelativeData` and `getRelativeData` remain Builder's.
- `PUT` writes without any reaction. Builder's current PUT emits an event.
- `FIRE` opens a FireMark on the absolute path. The router consumes it with
  `takeFire(path)` at the first event on that path. A nested SET on the same path
  during delivery finds the mark consumed and is not fired. The mark is removed in
  `finally`. The Bag event itself carries no fired field.
- `FIRE_AFTER` keeps its timer on the NodeBinding; closing the NodeBinding cancels it.
- `absDatapath` supports variable datapath: with `datapath='^.foo'` the branch
  datapath is the value read from Data at `.foo`; an empty value gives a null path.
  Symbolic paths keep their `?attr` suffix.
- Node semantic state (registrations, timers, click counter, stamps) stays for now in
  NodeBinding, in the BindingRuntime Map keyed by the actual node (P17). It may move
  onto the node later without author-visible effects.
- S01 verifies that every browser path produces the Gramlot classes: JS authoring,
  `sourceBagFromTytx`, `bindBuilder`, insertion and `remoteSource`. No prototype
  mutation. No change to Builder or Bag. Python needs no counterpart: authoring stays
  inert and these methods run only in the browser.
- S01 measures the null-attribute loss in `Bag.fromTytx`. Any solution goes into
  these classes after owner approval.

<a id="gc-210-020"></a>
## 020 · Modules, instance ownership and construction

Block ID: **GC-210-020**.

| Planned file | Classes/exports | Phase |
| --- | --- | --- |
| js/src/builder/source.js | GramlotBuilderBag, GramlotBuilderBagNode (§018) | S01 |
| js/src/binding/runtime.js | BindingRuntime, NodeBinding | S03 |
| js/src/binding/router.js | DataRouter, DataRegistration, DataChange | S04 |
| js/src/binding/installation.js | DataInstaller | S05 |
| js/src/binding/providers.js | Provider, FormulaProvider, ControllerProvider | S08 |
| js/src/binding/logic.js | LogicRegistry, LogicGroup | S03 root only, S07 registration |
| js/src/binding/inline.js | InlineCompiler | S09 |
| js/src/view/controls.js | ControlAdapter and subclasses, RadioGroups | S10/S11 |
| js/src/view/button.js | ButtonBinding | S12 |
| js/src/view/events.js | NativeEventBinding | S12 |
| js/src/bootstrap.js | PageBootstrap | S07 |
| js/src/adapters/resources.js | ResourceResolver, parseRequires | S06 |
| src/gramlot/server/resources.py | ResourceResolver, parse_requires | S06 |
| src/gramlot/collections/binding.json | Binding grammar | S02 |

All state is per instance. Parent passes itself to collaborator; child exposes a
getter. Class methods use public getters/methods instead of private fields except
constructors/setters. Expected contract errors identify node, tag and attribute.
No swallowed impossible states. New unplanned names require a rationale in phase notes.

Gramlot constructs, in order: `new LogicRegistry(this)` (root logic group),
`new GramlotBuilder(null, {collections})`, `new BindingRuntime(this)` (router,
installer, inlineCompiler), sets `this.data = this.builder.data`, calls
`this.binding.attach()`, sets `this.source = this.builder.source`, then constructs
`GramlotRenderer(builder, source, destination, {binding})`. Registration happens
after construction and before start/startSource, never in a provisional registry.
Use LogicRegistry.resolve, not Builder._resolveLogicFunc (static-method lookup).
Authoring remains inert. The current `this.data.setItem('main', new Bag())` line
(`gramlot.js:14`) is removed: `main` lives in the outer root created by `binding.attach()`.

BindingRuntime exposes gramlot/builder/renderer/data/root/logicRegistry/router/
installer/inlineCompiler getters and attach, bindingFor(node), openBinding(node),
closeBranch(node), rebindBranch(node), handleSourceEvent(event), receiveData(event),
dispose. inlineCompiler is the S09 InlineCompiler, created by the runtime and imported
only in the page runtime. The runtime has no radio-group state (§050).
attach retains document Bag identity under outer main and subscribes once.
NodeBinding(runtime,node) exposes runtime/node/closed/registrations/providers/
clickCount, hasStamp/stamp (`installed`, `init`, `built`, `start`), track(disposer),
registerPointers (step 4 of §035), evaluateFormulas (evaluates `==` attributes through
InlineCompiler.compileExpression at each projection, S09), rebind, receive and close. track returns a removal function;
close runs semantic disposers in reverse order and collects errors.

Semantic lifetime owns registrations, providers, timers, click counter, stamps and
remoteSource request. DOM records own elements/listeners/ControlAdapter/ButtonBinding/
NativeEventBinding. Rebuild closes only DOM lifetime. Gramlot.dispose closes binding
before renderer. No new public Live Object Tree semantics or Builder parent model.

<a id="gc-210-025"></a>
## 025 · Source event ingress and semantic lifetime

Block ID: **GC-210-025**.

All Source events enter the renderer FIFO before freeze filtering or semantic work.
Closed renderer ignores events; otherwise enqueue, return if already building, and
drain with building=true. Discard detached-node events except del. Ignore mutations
of a node currently being built (P4). Run semantic handling even under freeze,
then structural insert/remove/update only outside frozen branches. An exception
clears pending events and propagates. Track currently building nodes during buildNode.

| Source event | Semantic work (old context for cleanup, new for registration) |
| --- | --- |
| ins | Install inserted node/branch |
| del, including arrays | Close each removed branch |
| upd_value with old SourceBag | Close old children |
| upd_value with new SourceBag | Install new branch |
| upd_value to scalar/null | Close previous branch only |
| upd_attrs | Rebind node; datapath/_anchor/node_id/form/formId changes rebind branch |
| upd_value_attr | Close old branch, process attributes, install new branch in that order |

remoteSource uses semantic binding for eligibility, current-response check and
cancellation registration, including targets rebuilt or living under freeze.
Latest request still wins. `setValue(prepared, true, {_text: null}, true)` emits
upd_value_attr; the installer is entered through the FIFO, not separately from
mountMainSource or remoteSource. Removal under freeze closes semantic ownership
immediately; old DOM waits until thaw. Thaw builds current Source once, without
reinstallation or repeating init/start.

<a id="gc-210-030"></a>
## 030 · Data routing, projection and DOM lookup

Block ID: **GC-210-030**.

DataRouter(runtime) exposes runtime/size, register({path,attr=null,recipient}) and
deliver(event). DataRegistration exposes path without main, attr, recipient,
active, close. DataChange carries evt, node, path, oldvalue, attrsDiff, reason,
fired, level, registration. `fired` comes from `takeFire(path)` on the FireMark
opened by `GramlotBuilderBagNode.FIRE` (§018), asked once per event; the Bag event
has no fired field. The root event path begins with main; remove only that
segment, ignore events outside it. An authored user field named main remains data.
For upd_* pathlist includes the node; for ins/del append node.label to parent path.
Use a segment trie: a.b and a.bc differ. Node level is exact, container means event
ancestor, child means event descendant. Attribute registrations receive matching
attrs_diff or node replacement. Ignore autocreate; fired child events do not deliver.
Snapshot candidates, skip registrations closed during delivery. No full scan or
channel observer. S01 checks no prior subscriber writes before the root router.

Visual pointers come from node.pointers(); '=' is read-only, not registered; classify
'==' before '='. Rebind on pointer replacement/removal, context/anchor changes and
variable datapath changes, then reproject the affected branch. NodeBinding.receive
calls renderer.project(node,change); renderer.update reuses project. Registrations
happen at step 4 of §035; renderedItem only links the new record to the NodeBinding
already open (`binding.bindingFor(node)`). renderer.project does nothing while the node
has no element (steps 4–5, or under freeze). Reuse
runtimeValues → _handleMeta → adaptAttrs → html.update; render_attributes wins last.
P1 applies only to redundant origin value; providers and other attributes still run.
Existing built elements react during freeze; no fake Source events.

| Style vocabulary | Projection and null rule |
| --- | --- |
| style, class | String or null only; null removes attribute |
| visible | false sets style.visibility=hidden; otherwise no override; removal restores current style |
| hidden | Existing native boolean behavior |
| SVG presentation (fill/stroke/stroke-width/opacity/transform/…) | Builder svgAttributes, correct namespace; null removes |
| Other native attributes | Existing HtmlElement boolean/reflected/name adaptation (data_*, aria_*, xmlns_*) and namespace rules |

No color/font_size/_class shortcuts, style Bags/dicts, themes or root.css. Text
remains safe text; SVG/XLink and foreignObject preserve namespaces and DOM identity.
`getBaseSourceNode` climbs parentNode to the first generated element in elements,
returning its record.node or null; a DocumentFragment is not an element.
`getDomNode` uses records and returns element or null for fragment, data-element,
unbuilt/removed node. Gramlot delegates both; never add domNode/sourceNode properties.

<a id="gc-210-035"></a>
## 035 · Branch installation and Data ownership

Block ID: **GC-210-035**.

Eight ordered steps for every initial or inserted branch:
1. Validate whole candidate without effects via renderer.validateCandidate.
2. Apply all dataSetter nodes, parent-before-descendants in document order (A2).
3. Apply defaults to all visual nodes (D1a/P15).
4. Open semantic bindings and register visual pointers/providers.
5. Invoke _init once per node through BindingRuntime.
6. Build DOM from current values; defer under freeze.
7. Invoke _onBuilt after first successful complete build.
8. Invoke _onStart after initial page readiness, or step 7 for later insertions;
   never-built nodes wait. Numeric delay follows P22.

Existing observers see synchronous setter writes; new providers wait through steps
2–3. Under freeze steps 1–5 still execute. On error close newly created bindings,
with no Data rollback. The installed stamp and semantic lifetime survive rebuild/thaw.

DataInstaller(runtime) exposes install(branch), setterNodes(branch), applySetter(node),
applyDefaults(nodes). Setter destination_path and value are Source **attributes**
(role: attribute), not Source node value. Resolve with node.absDatapath, with '?' already
rejected. Payload attributes exclude destination_path/value, _meta/META_ATTRS and
binding attributes. For non-null value, or absent target with null, use
`data.setItem(path,value,attrs,'>',false,true,node)`; null at existing target uses
`data.getNode(path).setAttr(attrs,true)` preserving value. Bag payload transfers
without copying. Silently remove Source value attribute with
`node.setAttr({value:null},false)` so no second Bag owner or Source event remains.
Stamp installed; no duplicate warnings. Defaults handle ^/= pointers only when
null/missing; attr_* reads before own control default; default_value beats default.

<a id="gc-210-040"></a>
## 040 · Providers, writes, time and inline execution

Block ID: **GC-210-040**.

No operations.js: writes use Source node methods, that is GramlotBuilderBagNode
(§018). SET and setRelativeData remain Builder's and react. PUT of GramlotBuilderBagNode
is silent. FIRE writes with fired=true, so Bag emits even equal values and then resets
to null silently; GramlotBuilderBagNode.FIRE also marks the write for the router.
FIRE_AFTER of GramlotBuilderBagNode has default 10 ms; its timer is tracked on the
NodeBinding and cancelled when it closes, and closed recipients are not delivered. Installation alone uses
direct Bag writes for R1. Formulas/controls use node.setRelativeData.

Provider(binding) exposes binding/node/kind, register, receive, invoke(trigger),
readArguments, cancel. FormulaProvider writes returned result to result_path;
ControllerProvider invokes without formula writeback. dataSetter is not a provider.
register owns ^ subscriptions and _timing; BindingRuntime owns init/built/start;
ButtonBinding adds click. invoke reads current arguments (^ triggers, = reads),
filters _userChanges by node level, evaluates _if/_else, calls named or inline body,
then writes formula result. Conditions are named-only in S08; inline arrives S09.
_delay debounces latest trigger; _timing is reactive seconds-based setInterval with
stop/restart; semantic track owns provider timers. Provider reactions have no anti-echo.
Exception behavior is P12; nested SET during FIRE is not itself fired.

P20 kwargs contains resolved author attributes plus _node/_triggerpars/_reason and
button _evt/button_* where relevant. The excluded control attributes are
`destination_path`, `result_path`, `func`, `formula`, `script`, `_if`, `_else`, `_init`,
`_onStart`, `_onBuilt`, `_delay`, `_timing`, `_userChanges`.

InlineCompiler(runtime) exposes preprocess(node,attr,source),
compile(node,attr,source,argNames), compileExpression(node,attr,expr), release(node).
It ports legacy macroExpand_GET/SET/PUT/FIRE/FIRE_AFTER regexes and `$n` replacement
from gnrlang.js, preserving regex limitations in strings/comments, translating to
this.GET/SET/PUT/FIRE/FIRE_AFTER and arguments[n-1]. Warn once per declaration at
first macro compilation. Direct this.SET calls pass unchanged without warnings.
Cache by declaration, release on mutation/removal. Import only in page runtime,
never adapters, builder, server or WorkerHost. Missing named methods never fall
back to inline. Syntax errors include location. No arbitrary cycle cap (Q2).

<a id="gc-210-045"></a>
## 045 · Named logic, resources and browser bootstrap

Block ID: **GC-210-045**.

LogicRegistry(gramlot) exposes gramlot, register(logicClass,{group,resource}),
resolve(name,node) returning {group,method} or resource/node error. LogicGroup has
only page as its own framework member. Companion methods live in gramlot.logic;
requires names become groups, slash names nested groups. Each resource exports
class Logic. Copy Logic.prototype methods except constructor, in load order;
explicit constructors are errors and never run. Methods initialize group/page state.
Method/child-group or method/page collisions are errors; missing names error.
`this` is group, `this.page` the Gramlot instance. Named formulas take kwargs,
controllers node/kwargs. No static-method holder or page mixin.

parse_requires(text) returns tuple in Python; parseRequires(text) is JS equivalent;
P7/P13 apply. ResourceResolver takes pages/application root (Python Path; JS
pagesDirectory/applicationRoot), resolve(pagePath,names,kind) returns ordered URLs.
Search each name from page directory through ancestor _resources to application
root; load reverse, generic to specific. Process names in declared order; same-name
companion last. Both file and same-name-folder page layouts are allowed; both at
once error. Reject traversal/symlink escapes. Public companion must not import
server-only queries/keys/access logic. A JS page's same-name file exports both Page
and Logic and must import on Node/Bun and in the browser (P14); Python and JS page
directories remain separate.

Replace Python Page.css tuple and JS static css array with css_requires/js_requires
strings, no aliases. Both hosts resolve resources, create nonce independently from
page_id (Python secrets.token_urlsafe(16)), and clean registry on bootstrap failure.
Keep host TTL/capacity/ownership checks. Concrete adapter resource hierarchy belongs
to integration, neutral resolver/bootstrap contract to core.

PageBootstrap({config,resources,document}), resources={js:[{url,group}],css:[url]},
run: append CSS links in supplied order; import all JS and await completion; construct
Gramlot; register each module.Logic in supplied order regardless of import completion
order, group null for companion; assign window.gramlot and await app.start(). Close
or import failure before start mounts nothing. Bootstrap generated by both Hosts
imports PageBootstrap. Nonce covers bootstrap and Source script .nonce; standalone
hashes final bytes. Native event attributes are not covered by nonce. S14 tests
actual headers and named/inline CSP separately; Q3/Q4 still gate that work.

<a id="gc-210-050"></a>
## 050 · Native controls and button ownership

Block ID: **GC-210-050**.

ControlAdapter.for(binding,record) returns matching subclass or null; constructor
owns binding/element/live getters, project(value,change), read(), commit(event),
attach(), detach(). commit uses node.setRelativeData(valuePath,read()). Subclasses:
TextControl (text/textarea), NumberControl, RangeControl, SelectControl (single/multiple),
TemporalControl, ColorControl, then CheckboxControl and RadioControl. ControlAdapter
consumes value; HtmlElement no longer independently writes control.value. DOM record
cleanup owns detach, including input/change/composition listeners.

RadioGroups(renderer) is created by the renderer and stays in the view layer. It
exposes join(control,group,form), leave(control), peers(control).
Join generates instance-scoped name; selecting B synchronously writes peers false
and B true in documented order. No selection store. Initial multiple true is error;
insertion/removal/rebinding and keyboard behavior require browser tests.

ButtonBinding(binding,record) exposes mechanism, attach, onClick, detach. onClick
uses R3, increments semantic clickCount, invokes the single P10 mechanism. Nested
controller remains ordinary B7 provider. NativeEventBinding(binding,record,eventName,
handler) owns attach/detach for connect_on<event>; click connection runs after the
Gramlot click mechanism. Both use renderer.getBaseSourceNode(event.target).
DOM listener teardown does not reset semantic count. R3 is provisional, with all
form/keyboard/parent/native-listener effects reported for owner review in S12.

<a id="gc-210-055"></a>
## 055 · Phase map, deliverables and gates S00–S09

Block ID: **GC-210-055**.

Each phase stops dependent work on missing contracts or unproved hooks; independent
already-authorized work continues. Dependencies do not authorize concurrent changes
or the next phase. S06 depends on S00 only and can proceed beside S01–S05, because it
touches different files. Owner authorization still precedes S06. This does not launch it.

| Phase / dependencies | Files and implementation | Tests and completion gate |
| --- | --- | --- |
| S00 / approved brief | Constitution, GC-210, GC-005, GC-055/070/125/155/160/165/170/175 and mirrors; PORT-0004/0005; prepare npm/CI enrollment subject to red-CI gate | Baseline before edits; inventories/fixture design; documentation checks; owner reviews amendment/contract. One commit, no push, report and stop |
| S01 / S00 | New js/src/builder/source.js (GramlotBuilderBag, GramlotBuilderBagNode, §018); new source-extension-contract.test.js; bag-contract.test.js, two nested regressions, test_python_builder.py. Builder and Bag read-only | Complete Python grammar→Source→TYTX→browser bindBuilder route; node identity in one runtime; legacy HTML5 data call; Bag/scalar/array/null value attribute roundtrip; symbolic selectors; null-attribute loss; silent insert/update/attrs; Gramlot classes on JS authoring, sourceBagFromTytx, bindBuilder, insertion and remoteSource without prototype mutation; silent PUT, FIRE mark, FIRE_AFTER, absDatapath with variable datapath and symbolic ?attr; fired/reset, reason string conversion; root backrefs/ins-del paths; runtimeValues/pointers incl empty value key; static-only _resolveLogicFunc; RendererBase runtimeValues on nonvisual declarations. Every hook proved directly or through the Gramlot classes; no Builder or Bag change |
| S02 / S01 | Python page/builder.py, _collection.py/_grammar_load.py if needed; JS gramlot-builder.js; binding.json after HTML grammar; renderer validation; exporter only if needed | test_binding_authoring.py, binding-authoring.test.js, collections and transport-interop: signatures, optional value, invalid missing path/?attr, dict→Bag, four-direction typed/null/false/0/empty/Bag/array transport. Mark data_element, recognize binding attributes, validate nonvisual before visual; hosts compute_logic/computeLogic inert; no alias/dispatch/evaluator/host serializer |
| S03 / S01 | Gramlot, renderer, runtime.js and root-only LogicRegistry; remoteSource semantic lifetime, FIFO before freeze | binding-lifetime.test.js and lifecycle/page-close/freeze/render-failure/source-pipeline: roots/identity/isolation, disposal twice, counters, DOM rebuild vs semantic lifetime, complete event matrix, reentrant mutation, building-node suppression, remote rebuild/remove/late/frozen target. One owner/subscription per app |
| S04 / S03 | router.js/runtime.js, renderer.project and lookup methods, view/html.js | binding-router/projection and renderer/svg/native-html/live-source-validation: exact recipient counts, paths/selectors, rebinding, nested writes/removal, user main field, safe text/SVG/XLink/foreignObject, render_attributes precedence/removal, visible/style/class null, stable DOM, title/class origin updates, variable datapath through absDatapath (change, empty gives null path, nested) and lookup edge cases. Work independent of unrelated branch count |
| S05 / S02, S04 | installation.js/runtime.js, Gramlot/renderer through FIFO only | data-installation/binding-defaults, Python authoring/interop fixtures: A2/R1/P15, Bag backref and Source attribute removal without event, later defaults/setters, remote branch, synchronous old observers, new provider activation after final state, init inserting/removing/replacing ancestors and observer mutation also frozen, no duplicate install/removed-node DOM, no reinstall/reinit on thaw. First render proves values |
| S06 / S00 | Python Page/Host/assets/resources.py; JS Page/Host/FileHost/resources.js | test_page_resources.py/page-resources.test.js plus native-html/host: two layouts/ambiguity, same-name companions, parser parity, three levels and companion last, traversal/symlink/name safety, CSS cascade, distinct fresh nonce, migrate fixtures from css, preserve TTL/capacity/owner. Core only; adapters S14 |
| S07 / S02, S03, S06 | bootstrap.js/logic.js, Gramlot/index/runtime/builder, both host bootstrap generators, build-runtime.mjs and companion fixtures | named-logic/bootstrap tests: specific override, reversed import completion, isolated groups/nested names/this.page, cross-group calls, constructor/collision/missing errors, companion before init, close during import no mount, server/Worker graph no compiler, named CSP. Real Python Source through real bootstrap |
| S08 / S05, S07; Q2 | providers.js/runtime/router/logic | binding-writes/providers/timing: ^/= and levels, formula once, node.PUT silent, repeated FIRE recognized as fired by the router, FIRE→SET same/other path (SET not fired), FIRE→FIRE, PUT in FIRE, exceptions/reset/next write, fired-child suppression, node.FIRE_AFTER default/explicit delay cancelled at NodeBinding close, virtual-clock _delay/_timing/_onStart, no callback after removal, host/Worker sentinels. Named providers end-to-end |
| S09 / S02, S07, S08 | inline.js, logic/providers dispatch only, build import graph | binding-inline: named/inline parity, direct calls without warnings, each legacy regex and its string/comment limits, syntax location, once-per-declaration compilation, mutation/removal cleanup, page-only import graph. Unsupported syntax explicit |

<a id="gc-210-060"></a>
## 060 · Phase map and remaining gates S10–S17

Block ID: **GC-210-060**.

| Phase / dependencies | Files and implementation | Tests and completion gate |
| --- | --- | --- |
| S10 / S04, S08; Q5 | controls.js/html.js/runtime/renderer; native-controls.test.js; new scripts/verify_binding_browser.mjs | Q5 matrix below in both directions on Chromium/Firefox/WebKit; empty/invalid/lifetime, cursor/IME, controller correction returns to origin, title/class update while typing. Synthetic IME distinguished from manual |
| S11 / S10 | controls RadioGroups/Checkbox/Radio, html/runtime, boolean-controls.test.js and browser fixtures | Boolean-only data (never 'on'), peer Data and DOM, initial conflicts, insertion/removal/rebinding, mouse/keyboard, two instances, three engines |
| S12 / S08, S11 | button.js/events.js, controls/providers/renderer; button-controller/native-events tests | One invocation, disabled button, modifiers/count across rebuild, removal in callback, handler replacement, ambiguity and multiple controllers, B7 pointer/init plus click, ordered fire_*; all R3 form/submit/parent/Enter/Space/native-listener effects. Owner confirms or revises R3 |
| S13 / S09–S12 | Gramlot/renderer/binding only for defects; freeze/source-pipeline/embedded-source/render-failure/page-close, new binding-integration/cleanup tests | Exact install/default/start/timer/subscription traces for mount/rebuild/new identity/remove/insert/nested freeze/dispose; stale remote, validation/install/first-render/provider/cleanup failures; failing disposer does not stop others; 100 mount/remove cycles restore counters; no special thaw/remote path |
| S14 / S06–S09, S13; Q3/Q4 | Authorized Minimal WorkerHost/transport/standalone/build/build-directory/ASGI; JS Server native-fetch/node/bun; Django/FastAPI/Flask/Kajenn native adapters and tests | Same fixture on eight paths, resource descriptors and companion before Source, no Page.css/eval in Host, Worker sentinel, actual CSP headers, nonce on bootstrap/Source scripts, final-byte standalone hashes, altered nonce/hash blocked, named without unsafe-eval, inline blocked where forbidden. Blocked host prevents its S16 qualification |
| S15 / S12–S14 | examples/html_svg/01–13 and runner, new examples/binding; public GC-090/095 and related paired guides, prepare_docs only for approved guides | Migrate css_requires/companions, examples 10/13 to named nested controller; Python-first paired initialization/default/formula/live/boolean/SVG/dynamic/freeze examples. Packaged-runtime examples, no manual DOM/state, ID/link/allowlist checks. Document signatures, types/events/cleanup/CSP/exports, construction vs newrecord defaults, intentional legacy differences and migration from 0.1.x |
| S16 / S15 | Qualification report and clean installed artifacts with updated unconstrained dependencies | Complete suites incl enrolled regressions, Chromium/Firefox/WebKit, all eight hosts, two fixtures with same active path but different unrelated branch counts, revisions/hashes/versions/commands/skip reasons. Every mandatory acceptance executed and passed, or explicit owner waiver; unavailable is unverified, never success. No publication |
| S17 / S16 | Explicit owner acceptance receipt, consolidation to main, version 0.2.0 only if authorized | Distinguish implemented/accepted/packaged/published/distributed. Publication requires separate authorization |

Q5 is a **proposal awaiting confirmation before S10**, not silently approved by
other P rows:

| Control | Proposed Data representation | Boundary behavior to confirm |
| --- | --- | --- |
| text/textarea | string or null displayed empty | Empty string retained; defer external projection during IME |
| number | finite number or null | Empty→null; invalid draft remains DOM, never NaN |
| range | finite number or null | Browser clamp does not write Data during projection |
| single select | string or null | Missing option: no selection, Data unchanged |
| multiple select | string array incl [] | No delimiter strings |
| date/time/month/week/datetime-local | lexical string or null | No Date object/time-zone conversion |
| color | serialized string | Browser normalization does not write Data |

live only selects input versus change timing; no updateOn alias.

<a id="gc-210-065"></a>
## 065 · Acceptance families and end-to-end fixture design

Block ID: **GC-210-065**.

| Family | Owning phases |
| --- | --- |
| A01 roots/identity | S01–S05 |
| A02 authoring/types/null/HTML5 data distinction | S02, S05 |
| A03 initialization/A2/R1/defaults/no reinstall | S05, S13 |
| A04 relative/attribute/symbolic/context paths | S01, S04 |
| A05 routing/levels/rebind/removal in delivery | S04, S08, S13 |
| A06 safe projection/booleans/visible/render_attributes | S04 |
| A07 SVG | S04, S16 |
| A08 SET/PUT/FIRE/FIRE_AFTER | S01, S08 |
| A09 providers/^/=/==/_userChanges | S08, S09 |
| A10 timing/startup | S08, S13 |
| A11 editing | S10, S16 |
| A12 booleans | S11 |
| A13 clicks/events/B7/R3 | S12 |
| A14 dynamic Source/FIFO/freeze | S03, S13 |
| A15 resources | S06, S07, S14 |
| A16 execution/CSP | S07, S09, S14, S16 |
| A17 errors/lifetime | S03, S13, S16 |
| A18 distribution/documentation | S14–S17 |

Fixture design only, no implementation in S00: one Python Page and equivalent JS
Page with title bound to `.settings.caption`, input, two radios and checkbox,
calculated result, SVG bound color/size, button with nested named dataController.
Put setters after some controls and in a later descendant, with duplicate paths
and defaults, exercising first-render order rather than correcting after mount.
Use real Page/Host/TYTX/bootstrap/named companion, then run unchanged behavior on
each authorized integration. No manual registry injection, DOM wiring or extra store.

Acceptance story: (1) first DOM shows final Data; (2) edit with live false then true;
(3) formula/controller update text and SVG; (4) choosing radio updates both booleans;
(5) button invokes once with counter/modifiers; (6) remoteSource branch's own setters
are visible on its first render; (7) freeze, mutate Data, remove child, then one thaw;
(8) page close stops owned work. Record semantic/DOM counters and exact trace, not
just screenshots. FIRE_AFTER timers are tracked on the NodeBinding and cancelled at
its close, like provider timers; closed recipients must not react. Q5 and CSP cases wait for
their decisions. Real engines and host coverage belong to S14/S16, not S00 baseline.

<a id="gc-210-070"></a>
## 070 · Existing test inventory and positive-contract migration

Block ID: **GC-210-070**.

Read-only inventory of tests/, js/tests/ and PORT-0005 diagnostics on S00 baseline.
No assertion was changed. Distinguish actual negative assertions from prerequisites
that merely lack a positive reactive check.

| Existing case | Baseline meaning | Planned transformation |
| --- | --- | --- |
| ports/PORT-0005-data-binding/current-nonreactivity.test.mjs, “current destination does not refresh mounted Source after a Data-only write” | Explicitly expects old text after Data write, outside npm glob | S04 replace/retire negative diagnostic in favor of positive Data-only projection test |
| js/tests/binding-lifecycle-baseline.test.js, “Builder evaluates Data on mount and Source updates without consuming pointers” | Requires Source mutation before re-read; does not explicitly assert immediate Data nonreactivity | S04 assert immediate Data projection plus preserved pointers/rebinding/identity |
| Same file, “Source updates resolve branch text and preserve an unchanged input value and caret” | Source-driven projection/caret prerequisite, native checked property | S04 positive Data projection; S10 origin/correction/IME; S11 value-bound boolean coverage, retaining legitimate native checked behavior |
| Same file, “replacement and disposal release mounted Source-owned cleanup once” | Positive DOM cleanup only, no semantic ownership | S03 semantic-versus-DOM ownership; S13 exact cleanup and repeated cycles |
| Same file, “freeze delays Source projection; thaw reads current Data and disposes discarded records” | Explicit old DOM and delayed DOM cleanup while frozen | S03 immediate semantic cleanup; S04 Data reactivity on surviving built nodes; S13 separate DOM delay/no reinstall |
| js/tests/freeze.test.js and source-pipeline.test.js | Structural freeze/FIFO tests, no general binding absence contract | S03/S13 extend with semantic work before structural freeze and reentrancy |
| js/tests/render-failure.test.js, page-close.test.js, embedded-source.test.js | Existing Source/DOM ownership and errors | S03/S13 remote semantic validity, partial install/provider/cleanup failures |
| tests/test_python_builder.py::test_create_does_not_compute_browser_logic | Explicitly proves create does not invoke browser logic; remains a positive no-server-eval boundary | S02/S08 preserve inert Host authoring and add execution sentinels |
| ports/PORT-0005-data-binding/contract-probes.mjs | Reports observations/gaps; normal mode can exit zero despite gaps | S01 classify/reproduce hooks; S04/S08 positive router/write/provider tests, not count probe exit as acceptance |
| Two nested .mjs regressions in §080 | Quiet PUT plus symbolic attribute target assertions | Out of CI until GramlotBuilderBagNode provides silent PUT and symbolic ?attr (S01), then S04/S08 positive integration; never weaken expectations |
| legacy-data-installation-probe.cjs | Legacy characterization, not 0.2.0 acceptance | Keep unchanged; S05 creates separate A2/R1 tests |

No Python test explicitly asserting browser nonreactivity was found. Absence of
coverage is not an assertion of absence; the new positive suites above supply it.

<a id="gc-210-075"></a>
## 075 · Eight-host inventory and Page.css migration exposure

Block ID: **GC-210-075**.

S00 reads sibling repositories only. Paths below are repository-relative; the
workspace uses physical sibling directories with these names. No adapter was
modified or newly qualified. Core Python Host.open_page currently loops over
cls.css; JS Host.registerPage returns css and openPage emits links. Thus hosted
adapters inherit Page.css indirectly even when they contain no literal `.css`.

| Host profile | Repository and actual entry | Page.css exposure / future S14 work |
| --- | --- | --- |
| Minimal ASGI/Uvicorn | gramlot-minimal, src/gramlot_minimal/asgi.py: NativeHtmlASGI, create_asgi_application | NativeHtmlASGI.host=core Host; __call__ uses open_page. Migrate resource serving/bootstrap/CSP contract |
| FastAPI | gramlot-fastapi, src/gramlot_fastapi/native_html.py: NativeHtmlPages, NativeHtmlApplication, mount_native_html | Core Host.open_page supplies CSS/bootstrap; adapter serves responses and runtime |
| Kajenn | gramlot-genro-asgi (approved name gramlot-kajenn), src/gramlot_kajenn/native_html.py: KajennNativeHtmlApplication, _KajennASGI | _KajennASGI derives Minimal NativeHtmlASGI, inherits core CSS path; custom runtime source remains adapter-owned |
| Flask | gramlot-flask, src/gramlot_flask/native_html.py: NativeHtmlPages, mount_native_html | asyncio.run(core Host.open_page) returns bootstrap containing cls.css |
| Django | gramlot-django, src/gramlot_django/native_html.py: NativeHtmlPages | async_to_sync(core Host.open_page); needs new 0.2.0 qualification, not inferred from seven-profile history |
| Node | gramlot-js-server, src/native-node.mjs: startNativeServer → src/native-fetch.mjs:createNativeDispatch | Core FileHost/Host.openPage reads Page.css; shared HTTP adapter migration. Obsolete src/bootstrap.mjs is not the entry |
| Bun | gramlot-js-server, src/native-bun.mjs: startNativeServer → native-fetch.mjs | Same FileHost CSS/bootstrap contract through Bun socket bridge |
| Minimal standalone | gramlot-minimal, src/build.js:build and src/build-directory.js:buildDirectory; src/standalone.js:mount; src/worker-host.js:WorkerHost | WorkerHost.resolvePage validates PageClass.css array; registerPage returns css; mount destructures css and loadStyles before app.start. Requires descriptor/companion/window-vs-Worker migration and static hashes |

[GC-130](130-release-ecosystem-review.md) records historical Chromium seven-profile
0.1.0 checks: Uvicorn, FastAPI, Kajenn, Flask, Node, Bun, Worker. Django is not in
that seven. Separate later Django/standalone work does not qualify 0.2.0 binding.
S16 requires all eight with Chromium, Firefox and WebKit, clean current artifacts,
actual versions and explicit skips. Q4 must authorize connected edits first.

<a id="gc-210-080"></a>
## 080 · S00 baseline, enrollment gate and stop conditions

Block ID: **GC-210-080**.

Baseline HEAD cbd80deed1b097ffbe778d05cb092c8338c5a9e7, develop, core 0.1.2.
Observed environment: Python 3.12.9, Node 23.11.0, npm 10.9.2; Python Builder 0.23.4,
Bag 0.25.1, TYTX 0.15.0; JS Builder 0.1.5, Bag 0.5.3, TYTX 0.15.1. No dependency
update/setup or pin change was performed. CI uses Node 22; this is a local baseline.

Before edits: `.venv/bin/python -m unittest discover -s tests` passes 18/18;
`GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" npm --prefix js test` passes 76/76.
An experimentally expanded npm command discovered 81 cases: 77 passed, 4 failed.
The quiet-write case expects [] but gets ['ins'] at gramlot-quiet-write.test.mjs:21.
The three symbolic cases FORM/ANCHOR/target expect main.form.x?caption but receive
main.form.x at builder-symbolic-attribute.test.mjs:15. Direct attribute reads pass;
the final symbolic GET assertion is not reached after the earlier path assertion.

The prepared enrollment patch adds both exact nested paths to npm test; CI already
calls that command and its step label documents the expanded contract coverage.
With the tested dependency graph this makes its required test step fail. Per S00
brief §4.6, enrollment is withheld from the commit pending the owner's explicit
red-CI decision; the final report preserves the patch and failure output. No skip,
continue-on-error or changed expected values hide these failures. Passing ordinary
suites must never be called full 0.2.0 qualification. Owner decision, 2026-09-25:
both nested tests stay out of CI until GramlotBuilderBagNode provides silent PUT
and symbolic ?attr in S01.

Other stops: unresolved Q2–Q5, a hook the Gramlot source classes cannot provide
without an owner decision, any new unapproved contract,
or unavailable mandatory S16 acceptance without owner waiver. In particular record
any implementation contradiction for the owning phase instead of deciding silently. This S00 transcription does not
start S01 or connected-repository work. Acceptance, release, packaging, publication
and distribution remain distinct states.

<a id="gc-210-085"></a>
## 085 · Risks and stop responses

Block ID: **GC-210-085**.

| Risk | Response |
| --- | --- |
| Builder or Bag hooks are insufficient | Solution in the Gramlot source classes (§018), decided with the owner; no change to Builder or Bag |
| Builder creates nodes without `nodeClass` on some path | S01 verification; every path found goes into the Gramlot source classes |
| Legacy `data(path, value)` silently produces an HTML5 element (P19) | Migration documentation; no alias |
| Attribute event reason converted to a string (`bag-node.js:345`) | Measured in S01; P1 anti-echo compares the DOM value, not the reason |
| Another Data subscriber writes before the router | S01 verification; the router remains the only root subscriber |
| Semantic lifetime tied to the DOM | S03 before providers; exact traces in S13 |
| Reentrant Source events during installation | §025 ingress; tests in S03 and S05 |
| Named logic incompatible with Builder lookup | Gramlot logic resolves through LogicRegistry (§045), not `_resolveLogicFunc` |
| Radios updated only in part | S11 verifies Data and DOM |
| Removing `Page.css` breaks Minimal | S00 inventory, Q4, migration in S14 |
| Nonce mistaken for an eval permission | Distinct CSP profiles in S14 |
| Tests not discovered by CI | Enrollment in S00 |
| Scope growth | Every class, state or API answers a current requirement |
| Qualification confused with publication | Separate S16 and S17 |
