# 205 · General components and provisional replacements

Document ID: **GC-205**. Status: **analysis complete; JS description ownership and shared labelbox contract approved; remaining input decisions open**.

**Current planning:** [GC-245 · Component 0.3 plan](245-components-0-3-plan.md) includes callbackSelect, the random example and legacy-derived radio design. See [§095](#gc-205-095).

[Expanded counterpart](../../docs/future/205-components.md).

<a id="gc-205-005"></a>
## 005 · Retained direction and next decisions

Block ID: **GC-205-005**.

**Goal:** settle the final definition of Gramlot components, then scope the
input collection (owner item 2.1) and integration of layout components such as
border and tabs (2.2). Provisional inspector replacements are one consumer of
that wider workstream, not its whole scope. The owner distinguished
the dedicated `gramlot-tools-inspector` from the future general component series
and accepted isolated provisional `gramlot-poc-*` components.

**Existing evidence:** [GC-040](../internal/040-js-owned-components.md) records a
JS-owned component/collection experiment, explicitly proposed rather than an
accepted API. [GC-195](../internal/195-tools-inspector.md) and
[PORT-0006](../../ports/PORT-0006-inspector-components/README.md) describe the
bounded inspector work. `webcomponent(code=...)` and that specific port do not
approve a general component registry, object-property binding system or wholesale
PoC transfer. Older port checkpoint statements must be reconciled with current
release evidence before assigning remaining work.

**Before implementation:** choose one component and its consumer, inventory the
legacy/PoC behavior, confirm the public parameters, events, Data integration,
lifecycle and ownership, and determine how the provisional implementation will be
replaced. No component priority, replacement schedule or new release number is
assigned by this backlog. Follow the [port protocol](../../ports/README.md).

**Dependencies and parallelism:** independently bounded components can be reviewed
in parallel after their common contracts are settled. Shared renderer, grammar,
registration or binding work must be coordinated; separate worktrees alone do not
make conflicting contracts independent. The editorial website use case must not
silently require completion of an entire component framework.

**Proposed completion evidence:** one approved port with meaningful interaction,
Data, lifecycle and browser checks, Python authoring where in scope, updated paired
documentation, and explicit disposition of removed provisional responsibilities.
This card adds no runtime implementation or new test suite; reruns of existing
tests are reported in §070.


<a id="gc-205-010"></a>
## 010 · Owner workstream inventory, 2026-10-15

Block ID: **GC-205-010**.

The owner lists final component definition as item 2, the input collection as
2.1, and layout integration (border/tab, etc.) as 2.2. This grouping is retained
without selecting priorities or an implementation phase. Store-based tree/grid
widgets are a separate item 5, to compare with components and stores when deciding
contracts and opportunities for parallel work. The earlier single-port completion
criteria do not establish completion of this entire workstream.

<a id="gc-205-015"></a>
## 015 · Research authorization and evidence snapshot

Owner, 2026-10-15: “ok procedi con l'analisi di legacy e poc e prepara il documento
sul contratto dei componenti, poi decidiamo le API”. Analysis only: no API, runtime
port, Builder change, release or hierarchy approved. Separate observed code, existing
constraints and recommendations.

Read-only snapshots (inspected legacy/PoC files unmodified):

- Legacy `genropy/genropy`, `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`:
  `gnrpy/gnr/web/gnrwebstruct/base.py`, `gnrbaseclasses.py`;
  `gnrjs/gnr_d11/js/genro_wdg.js`, `genro_widgets.js`, `gnrdomsource.js`,
  `genro_src.js`; test pages `inputfields/textbox.py`, `layout/tabcontainer.py`.
- PoC `gramlot-org/gramlot-poc`, `10478b57ce3f22e6445eb6b72eba343520cbebac`:
  `js/dom/src/components/{bases,registry}.js`, `builtin-components.json`,
  `collections.js`, `builder-base.js`, `collections/{inputs,layout}.js`,
  `contrib/html/html-builder.js`, `application.js`, `forms/field.js`,
  `renderer/base.js`, `scripts/generate_components.py`, component-alpha tests.
- Core `c3753e25500e8b551a18650567ae612e1fadd1ed`: Python/JS GramlotBuilder,
  renderer, `js/src/view/controls.js`, webcomponent validation, collection/native
  control/webcomponent tests and bounded `tools/poc/` contracts.

The expanded counterpart provides pinned links and entry points. This is focused
input/layout/authoring/lifecycle research, not an audit of all widgets or a form/store
port. Research complete; owner review pending.

<a id="gc-205-020"></a>
## 020 · Three meanings that must remain distinct

Legacy browser widgets (HTML/Dijit/external objects) differ from Python
`BaseComponent`/`py_requires`/`struct_method` composition. PoC custom-element
collections differ from `_meta.component` render-time Source expansion/iteration.
Current `button` and `html_button` share a native DOM tag but have different
behavior. `webcomponent(code=...)` is an explicit custom-tag declaration, not a
catalogue or generic binding contract.

Recommendation: define observable component behavior and Source/Data integration;
choose Custom Elements/Shadow DOM separately. Keep recipes, services and controllers
separate under constitution §6. No universal hierarchy proposed for adoption.

<a id="gc-205-025"></a>
## 025 · Legacy: declaration, construction and composition

`GnrDomSrc` resolves tags/structure methods and builds Source. `BaseComponent`
mixes Python page behavior and resources; `struct_method` calls a page method with
the current Source pane. Formbuilder composition need not create a browser widget.

Client Source resolves dynamic attributes and context, calls `GnrWdgHandler.create`,
which selects a handler, executes hooks, creates/links HTML or Dijit objects and
inserts children. Source retains widget/DOM identity; browser objects receive
`sourceNode`. Runtime mixin/patch/version-patch conventions adapt Dojo.

Recommendation: preserve declarative use and ownership, not reflective fallbacks,
case aliases, Dojo lifecycle or page-mixin machinery as mandatory component bases.

<a id="gc-205-030"></a>
## 030 · Legacy: binding, editing, layout and teardown

Data → view: dynamic `^` attributes register dependencies; updates reach browser
setters/special handling. External widgets may rebuild if their setter is absent.
View → Data: adapters reject lost nodes/recursive writes, may normalize blank to
null, validate, attach display metadata, write the Bag with Source as reason and
publish `onSetValueInData`. Controllers use existing Data/topic mechanisms.
Legacy validation/`rejectInvalid` is more than presentation; do not import it silently.

Tabs/stack track children, selection by numeric position and by `pageName`, write
bound `selected`/`selectedPage`, and publish show/hide selection messages. Closing
removes Source; final-child removal clears selection. Selection and child lifetime
are distinct. Deletion calls hooks, parent notification, widget/DOM destruction and
node/descendant subscription cleanup. Late events must not write through dead nodes.

Recommendation: specify ordering, invalid-selection and teardown instead of copying
Dojo callbacks. Detailed messaging evidence remains in
[GC-196](../internal/196-legacy-publish-subscribe.md).

<a id="gc-205-035"></a>
## 035 · PoC: useful mechanisms and limits

The checked-in JSON catalogue generates JS metadata and Python `**kwargs`
declarations. The later JS-owned-description/generic-Python-loader experiment in
[GC-040](../internal/040-js-owned-components.md) is separate: its recorded
`/private/tmp/gramlot-js-component-manifest` path is absent, and it is not in the
pinned commit. Historical results are not a rerun; recover/recreate before delivery.

Registry validation rejects duplicate collection names and entries within a collection;
other paths use different policies. Builder resolves selected grammar in order with
later entries winning. Per-page grammar is not isolation of custom-element names
within a window. Base classes are cached per HTMLElement realm; connection guards
and reverse-order disposers manage resources. ControlElement composes decoration,
field-state presentation, native shadow input, typed value and composed change.
Native input already crosses shadow boundaries; avoid duplicate re-emission.

Application listeners and FormField own additional commit/validation/draft behavior;
renderer branches own property/store/grid/layout integration. Copying only the base
omits these responsibilities; copying everything imports unapproved subsystems.
The focused-draft guard applies to value **attribute** updates; direct renderer
property assignment and FormField have other paths. The alpha test does not prove
universal focus protection. Tabs use slots, observers and `gnr-set` pointer/value
commands with three selection representations; these are evidence, not final APIs.

<a id="gc-205-040"></a>
## 040 · Current Gramlot: reuse and gaps

Reuse portable grammar, typed Source, Data paths, binding, native adapters, lifecycle,
Logic, subscriptions and Source/DOM refs. `load_collection`/`loadCollection` already
exist. `webcomponent` renders a literal tag and ordinary attributes/events; it does
not acquire ControlAdapter through a value property. Inspector Bag assignment is
explicit JavaScript under 11.62, not general property binding.

Native editing preserves empty strings, suppresses equal commit echoes, accepts a
controller's different correction and defers projection during IME. New controls
must not accidentally change it through legacy/PoC defaults. Gaps: typed component
property/commit integration, activation, readiness/lifecycle, child ownership,
packaging and public events/styling, not a missing entire Source/Data framework.

**Documentation divergence:** constitution 11.14 specifies additive merging, but
later [GC-210 §090](../internal/210-binding-contract.md#gc-210-090) records owner
decisions of 2026-09-30 including ASTRA-03 whole-declaration replacement (grammar
metadata merges). Current Python/JS tests match the later record and pass. Reconcile
the earlier constitutional wording with that documented lineage; no unexplained
runtime change, new override policy or dependency fix is established here.

<a id="gc-205-045"></a>
## 045 · Proposed responsibility contract, before API spelling

Recommendations only:

- Description/export: metadata, assets and implementation association; reuse Builder.
- Authoring: equivalent typed Source from Python/JS; no browser execution on server.
- Binding integration: resolve pointers/project typed properties/commit once/cleanup.
- Component: inner UI, temporary draft/focus/accessibility and semantic edits.
- Source/renderer: child identity, order and removal; no parallel Source tree.
- Services: separately contracted validation, formatting, stores and requests.
- Themes: common tokens, compact density and documented styling surfaces.

Data → binding → component projection must not emit a user edit. Component edit →
binding → Data → existing controllers is one commit path. Temporary editor state
is legitimate; it is not a second application model. Bag properties require explicit
identity/replacement/mutation ownership, not HTML attribute stringification.

<a id="gc-205-050"></a>
## 050 · Questions every component description must answer

Semantic checklist, not a JSON schema: identity; parameter types/defaults/null/pointer
acceptance; attributes versus properties; update versus rebuild; model/display/draft
values; live/commit/IME/correction policy; event payload/order/cancelability/composition;
methods/references; child constraints/slots; readiness/reconnect/disposal; labels,
keyboard and themes; package metadata/module correspondence and failures.

Do not duplicate Builder validators or request extensions without a concrete gap.
Python consumes shipped metadata without Node. Serverless Worker authoring must not
import DOM implementation. Description loading differs from browser registration.
Collection metadata is unrelated to the installable root page's web manifest.
Final names follow [GC-225](../internal/225-naming-and-proxy-conventions.md);
legacy/PoC names and aliases are not approved by being cited.

<a id="gc-205-055"></a>
## 055 · Lifecycle and interaction cases to settle

Distinguish construction/property delivery/mount readiness; updates/rebuilds;
reconnect versus removal; hidden tabs versus destruction; logical disposal under
freeze before DOM removal; final disposal and failed initialization. Cancel late
edits/async results and release subscriptions, observers and timers exactly once.

Shadow DOM affects retargeting, composed events, labels/focus and CSS. Nested edits
must not be committed by the wrong control. Native form association/submission/reset
is a separate decision. Use existing Logic/Source/DOM refs and pub/sub; component
instance refs are not approved, nor are live references across postMessage frames.

<a id="gc-205-060"></a>
## 060 · Recommended pilots and acceptance evidence

Propose a text input, then tabs, using Python-first and equivalent JS pages. Not yet
authorization to implement or migrate the inspector. Text pilot: two controls and
formula on one path, edits/external corrections, null/empty, live, IME, focus,
readonly/disabled and rebinding. Tabs: stable identity versus position, Data/user
selection once, child add/remove/reorder, hidden/disabled/final-child behavior.
Both: themes, keyboard, nested events, reconnect, freeze removal, late completion,
instance/realm isolation. Collection: grammar/wire/runtime metadata agree; missing
modules, names, collisions and no-DOM imports fail predictably across environments.

Later typed inputs need independent precision/format/calendar tests; text success
does not qualify Decimal/Date. Stores precede store-widget claims. Propose Chromium
and WebKit tests, distinguish actual Safari qualification; none run for new pilots.

<a id="gc-205-065"></a>
## 065 · Decision register for owner review

Open proposals, discuss one at a time:

1. D1: keep component/recipe distinction; choose browser substrate by need.
2. D2 ownership approved: description and implementation in one JS module, generated
   Builder JSON and no manually duplicated Python definition. See §075; exact API
   remains open and the unavailable GC-040 probe still needs reproduction.
3. D3: reconcile historical 11.14/later GC-210 §090 wording and registration scope.
4. D4: runtime-owned binding/commits, component-owned draft; select exact semantics.
5. D5: Source-owned children, readiness/reconnect/freeze and tab mounting policy.
6. D6: public methods/events/order via current Logic, references and messaging.
7. D7: shared themes, compact density, styling surfaces, accessible labels/focus.
8. D8: input pilot then tabs; separate form engines/stores/db/recipes/inspector ports.

Preserve familiar legacy concepts without automatically adopting aliases/fallbacks.
Final API/schema/classes and implementation plan follow owner decisions.

<a id="gc-205-070"></a>
## 070 · Verification and handoff

Rerun 2026-10-15: **4/4 PoC component-alpha tests** and **35/35 core native-control,
webcomponent and collection tests**, including Python-to-JS. Core initial attempts
had Python import/relative interpreter configuration errors; absolute interpreter
and source paths passed without code changes. Headless DOM only, no new browser
qualification. Legacy is source-traced, no live widget suite run. GC-040's separate
worktree is absent, so its old probe was not rerun.

Paired anchors/local links passed, six pinned references match Git objects, and
strict Sphinx/public-manual checks passed (10 pages). Planning stays outside the manual. Analysis complete, API/implementation awaiting owner. No runtime
change, release number, publication or deployment. Next: D1/D2 and concrete input
consumer; resolve D3 before defining collection override behavior.


<a id="gc-205-075"></a>
## 075 · Approved description ownership (2026-10-15)

Owner confirmed "si" to: "descrizione e implementazione nello stesso modulo
JavaScript, JSON generato per i Builders e nessuna definizione Python duplicata".
See constitution 11.76. One JS module owns the implementation and description;
collection preparation exports metadata that Python reads to author Source without
executing JavaScript or requiring Node on the Python server. Any future editor
stubs derive from that same description.

The illustrative factory, base class, export names and declaration names are not
approved APIs. JSON schema, public signatures, collection selection, asset delivery,
registration and lifecycle remain to be decided. This confirmation does not authorize
implementation, dependency edits or publication. GC-040's missing historical probe
is still a verification gap, not restored evidence.

Owner clarification: the **application** declares the collections it uses, not
individual pages as previously proposed. The owner explicitly defers how to declare,
select and load them (constitution 11.76 follow-up). No application API or automatic
loading rule is approved. Continue the individual component contract without opening
this deferred mechanism; next discuss its public parameters and value/edit boundary.


<a id="gc-205-080"></a>
## 080 · Modern platform and Softwell migration evidence (2026-10-16)

Owner direction, constitution 11.77: maximize suitable modern HTML/CSS/JavaScript
capabilities, preserving compatibility where feasible and explaining discrepancies
to the Softwell team. Evaluate legacy behavior and contemporary browser facilities
together; do not treat a legacy implementation technique as the desired contract.

For each component capability, record:

| Review field | Required evidence |
| --- | --- |
| Legacy contract | Actual declaration and observable behavior, with source reference |
| Platform candidate | Relevant HTML/CSS/JS facility, checked against current official documentation and browser support |
| Benefit | Concrete reduction in custom code, improved behavior, accessibility or maintainability |
| Semantic differences | User edits, programmatic values, events, typing, validation, styling and lifecycle as applicable |
| Compatibility disposition | Behavior retained, intentionally changed or deferred; owner approval for the changed contract |
| Softwell migration | Before/after declaration, affected cases, required application changes and reason |
| Qualification | Browser/keyboard/accessibility and lifecycle evidence for the claimed behavior; unsupported cases explicit |

Do not declare an entire family modern/portable based only on syntax or one browser.
Use native facilities where they match the agreed semantics; framework services still
own the responsibilities that the platform does not provide. General compatibility
layers or multiple alternate paths still need explicit approval under constitution §13.

The input validation direction is now clarified in §085: Gramlot validation has
priority and may configure native constraints automatically where their semantics
match. Specific mappings remain open: compare length metrics, programmatic values,
error presentation and preventing extra input versus accepting an invalid draft.
No validation engine or concrete attribute mapping is implemented by this note.

<a id="gc-205-085"></a>
## 085 · Gramlot validation and browser constraints (2026-10-16)

Owner direction: "darei la priorita alla validazione gramlot che semmai guida in
automatico quella nativa laddove sia usabile". This clarifies the overlap discussed
in §080; see constitution 11.77 follow-up.

**Gramlot defines the validation rules; browser constraints help enforce them.**
There is some overlap between Gramlot validation and checks supplied by HTML.
Application authors should not need to declare the same rule twice. A component
may derive native constraints from the Gramlot rule when they preserve its meaning.
Native validation supports the Gramlot contract rather than defining a second,
independent validation policy.

For example, an agreed required-value rule could configure HTML `required`, and an
agreed length rule could configure `minlength`/`maxlength`. These are candidate
mappings, not approved equivalences: whitespace handling, length metrics and editing
restrictions must match the intended Gramlot behavior. Browser capabilities do not
silently redefine a Gramlot rule. Where native checks are insufficient, Gramlot
remains responsible for the agreed validation behavior, including values supplied
through Data rather than user editing.

Document this overlap and each supported mapping for application authors. Explain
any legacy differences and migration implications for Softwell. Exact validator
syntax, native mappings, messages, validation timing and invalid-value commit policy
remain part of the component design; this decision does not implement them.


Localization is being examined before the input contract is finalized, at the
owner's request. [GC-235](235-localization.md) traces the Python/JS legacy mechanism,
validation-message interaction and modern alternatives. Engine, message identity
and API decisions remain open; this investigation does not implement localization.

The subsequent [localization decisions (GC-240)](240-localization-decisions.md)
identify `intl_str` parameters and shared page metadata. They refine the authoring
direction without yet selecting an engine or implementing component localization.

Owner follow-up, 2026-10-16: [GC-240 §§050–060](240-localization-decisions.md#gc-240-050)
includes JS component descriptions/generated Python signatures, existing `lbl`/`label`,
visible/accessibility text and validation messages in the localization scope.
Keep business values, technical codes and message arguments distinct. Localization
is explicitly non-priority and non-blocking: this supersedes interpreting the earlier
analysis-before-input discussion as an implementation prerequisite. Continue component
work; retain the deferred classification plan without implementing provisional APIs.

<a id="gc-205-090"></a>
## 090 · Approved shared labelbox contract (2026-10-16)

Owner evidence: "si includiamo labelbox con lbl_ e box_ nel contratto condiviso";
"per position prevedevo TL TC TR per il top poi L e R e poi BL BC e BR per iol
bottom"; "e puo essere ^position"; finally "si TL come default. aggiorna il
contratto con labelbox, lbl_ e box_ e lbl_position anche reattivo".
This accepts the bounded presentation contract below, not the entire proposed
text-input API, validation policy or implementation. Names are recorded in GC-225 §050.

Labelbox is a shared composition responsibility for inputs: it owns label placement,
label/control containers and accessible label association. The control retains its
editing/value responsibility. Do not reproduce labelbox independently in each input.
The concrete composition mechanism and public standalone declaration remain open.

| Declaration | Destination / meaning |
| --- | --- |
| `lbl` | Label text, qualified as `intl_str` |
| `lbl_position` | Explicit labelbox layout parameter; not a label CSS attribute |
| Other `lbl_*` | Attributes of the label |
| `box_*` | Attributes of the outer composition container |
| `box_l_*` | Attributes of the label container |
| `box_c_*` | Attributes of the control container |
| Control parameters | Remain on the control, e.g. its value and editing behavior |

Recognize explicit `lbl_position` before generic `lbl_`, and `box_l_`/`box_c_` before
`box_`; strip the destination prefix when forwarding. Reuse the destination's
supported attribute contract rather than treating groups as arbitrary untyped keys.
The complete allowed attribute inventory and export schema still need definition.
The legacy label/control subdivisions are `box_l_`/`box_c_`, not `lbl_c_`.

| Resolved `lbl_position` | Placement and alignment |
| --- | --- |
| `TL`, `TC`, `TR` | Above the control, aligned left / center / right |
| `L`, `R` | Beside the control, on its left / right |
| `BL`, `BC`, `BR` | Below the control, aligned left / center / right |

Omitting `lbl_position` defaults to **`TL`**. A literal or reactive pointer is allowed;
the resolved value belongs to the eight-code domain. Default on omission does not
establish fallback/coercion for null, missing pointer values or unknown codes; error
handling must be settled before implementation. Vertical alignment for side labels
and wrapping/overflow behavior remain open.

Illustrative future authoring (the `textbox` method name is not finalized):

```python
pane.textbox(
    value="^.customer.name",
    lbl="Customer",
    lbl_position="^position",
    lbl_color="var(--text-muted)",
    box_width="100%",
    box_l_padding_bottom="4px",
    box_c_min_width="0",
)
```

Gramlot resolves/subscribes to the pointer through its binding machinery; labelbox
receives the resolved position. A change updates presentation without recreating
the input: preserve its value, focused control and caret/selection. Labelbox does
not parse pointers or introduce an independent Data model.

Localization remains deferred: `lbl` is `intl_str`, while position codes, dimensions
and colors are not translatable. Other prefixed attributes inherit the semantic type
of their destination; a prefix does not make every string localizable. Text is
shown as supplied until the separate localization work is implemented.

Legacy migration: the source's `labledbox` / `buildLblWrapper` mechanisms are evidence,
not classes to copy. Replace legacy `lbl_side` authoring with `lbl_position` and the
explicit position codes; no compatibility alias is approved. The previous proposed
`top/bottom/left/right` domain and `top` default are superseded by this decision.
The earlier JS descriptor example remains illustrative, not an approved export API.

Future acceptance checks (not executed implementation tests): correct routing with
no prefix overlap; all eight placements; omitted position yields TL; live Data changes
preserve input identity/value/focus/selection; accessible association survives layout
changes; label text remains literal without localization. Define unresolved errors
and side-label layout before testing their behavior. No runtime work is authorized
by this documentation update; invalid-value commit policy remains undecided.


<a id="gc-205-095"></a>
## 095 · Component 0.3 planning follow-up — 2026-10-16

The owner includes callbackSelect and the random-data lesson, asks to start from
textbox/labelbox while designing multiple controls together, and requests radio
buttons/groups with legacy-inspired syntax. [GC-245](245-components-0-3-plan.md)
contains the updated plan, including inherited metadata, automatic activation of
selected collections, explicit capability mixins and stateful collaborators.
The earlier textbox-then-tabs sequence in §060/D8 is superseded as a proposal by
this multi-control input plan; layout remains a separate workstream.

Confirmed scope and proposed architecture are kept distinct (constitution 11.84).
Legacy radioButton and radioButtonText are the relevant authoring evidence; the
old radiogroup helper is deprecated, and existing native boolean radio semantics
remain unchanged. The subsequent definition sketch was accepted and its first
implementation is recorded in [GC-245 §060](245-components-0-3-plan.md#gc-245-060).
No new release is claimed.
