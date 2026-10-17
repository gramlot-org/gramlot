# 245 · Component collection plan for 0.3

Document ID: **GC-245**. Updated: **2026-10-17**.
Status: **approved 0.3 scope implemented, qualified, accepted for release and published**.

[Concise counterpart](../../docs_llm/future/245-components-0-3-plan.md).
[Previous investigation and decisions](205-components.md).

<a id="gc-245-005"></a>
## 005 · Objective and decision evidence

Deliver a reusable component foundation and an input collection, authored from
Python and JavaScript through the same description. Start with textbox and shared
labelbox, but exercise different controls early enough to avoid a text-only design.

Owner, 2026-10-16: "ok includiamo callbackSelect nella 0.3 con questo esempio
random. aggiorna il piano e partiamo dal textbox con labelbox", followed by the
request to revisit registration, hierarchies and feature mixins and to plan several
controls together. Subsequent corrections: "non ho visto radiobutto e e gruppi di
radionbutton" and "se non trovi ispirati a legacy genropy come sintassi".

Accepted constraints: JS-owned implementation/description with exported Python
metadata; application-selected collections; shared labelbox and reactive
TL/TC/TR/L/R/BL/BC/BR positions (TL on omission); Gramlot-led validation; deferred
intl_str localization; modern browser facilities with documented legacy differences.
See constitution 11.76–11.79 and 11.84. The initial gallery collection configuration
is now approved and implemented (GC-105 §035); automatic discovery remains deferred.

This plan does not approve every PoC behavior, new public name, lifecycle hook,
metadata schema or registry policy. Stage proposals below are not implementation
receipts. No package publication, dependency-source edits or parallel agent work is
authorized by this document.

> **Historical record.** The original inventory and stage proposals below describe the planning baseline. Later dated decisions supersede their deferrals; §110 describes the current delivered scope. A proposal alone is not an approval.

<a id="gc-245-010"></a>
## 010 · Evidence and corrected inventory

The read-only review inspected PoC revision
`10478b57ce3f22e6445eb6b72eba343520cbebac`: `js/dom/src/components/{bases,registry}.js`,
`builtin-components.json`, `collections/inputs.js`, editor/provider helpers and
`collections/decoration/widget-label.js`. The architecture reviews and guide under
`docs/development/` distinguish proposals from subsequent implementation. In
particular, old claims of duplicated color-picker code predate its shared base.

GC-040's JS-owned metadata probe is historical evidence; its recorded worktree is
absent. Recreate its essential end-to-end proof with current core APIs. Do not
copy the PoC JSON-first generator as the new source of truth.

| Family | Existing PoC implementations | Proposed 0.3 disposition |
| --- | --- | --- |
| Text | textBox, passwordbox, textBoxArea | Include; textarea also checks a different native control shape |
| Boolean | checkbox | Include early; separate option caption from field label |
| Native scalar | colorpicker, horizontalSlider, verticalSlider | Include after shared projection/editing proves reusable |
| Typed editors | numberTextBox, dateTextBox, timeTextBox | Include; parsing, draft and typed-value requirements need their own gates |
| Calendar | dateCalendar | Include as a reusable collaborator of date editing |
| Local choices | comboBox, filteringSelect, checkBoxText | Include; free text, one identity and multiple choices are distinct contracts |
| Callback choices | callbackSelect | Owner explicitly includes it, with the random-data lesson |
| Radio choices | No dedicated input implementation found in active PoC sources | Add the legacy-derived single/group design to this plan |
| Server/database choices | remoteSelect, dbSelect | Proposed deferral to the service/database workstream |
| Rich editors | CodeMirror, Markdown, HTML/Jodit, IDE | Proposed deferral; not prerequisites for the input foundation |

Tabs, border layouts, stores, trees/grids and full form/save orchestration remain
separate workstreams. Reserve clean interfaces for them without implementing empty
base classes for hypothetical consumers. dateTimeTextBox is not an existing PoC
implementation; its old local-datetime design note does not automatically add it
to this scope.

<a id="gc-245-015"></a>
## 015 · Responsibility and hierarchy proposal

Use three tools for different purposes: inheritance for a stable control shape;
narrow mixins for capabilities shared across shapes; composed collaborators for
stateful editing, labels, popup tools and validation presentation.

Conceptual hierarchy, **not approved class names**:

```text
component lifecycle
├── value-bearing field
│   ├── one native control
│   │   ├── text / password / textarea
│   │   ├── checkbox / radio button / color / range
│   │   └── number / date / time editors
│   └── choice group
│       ├── multiple checkbox choices
│       └── one radio choice
└── non-field component
    └── reusable calendar (other layouts remain separate)
```

Introduce the shared field level only where the initial single/group pilots prove
the common responsibilities. A group must not inherit a mandatory `_input` or be
implemented as a disguised text field. Share selection/caption and popup behavior
between filteringSelect and callbackSelect; choose concrete inheritance only after
their input, query and result boundaries are demonstrated.

| Owner | Responsibility | Excluded responsibility |
| --- | --- | --- |
| Lifecycle base | Instance setup, connection resources, disconnect/reconnect and final cleanup | Data paths, validation policy, remote requests |
| Component | Inner controls, typed value interface, transient draft, focus/caret, semantic edit signal | Parsing pointers or writing arbitrary Data paths |
| Runtime binding adapter | Resolve Source attributes once, subscribe/rebind, commit through existing Data machinery | Reimplement component DOM or parsing |
| Label capability + collaborator | One labelbox implementation, routing and accessible association | A copied wrapper per component |
| Lock/state capabilities | Disabled/readonly and field-state presentation across real consumers | A second validator or form/save engine |
| Editor collaborators | Parse user drafts, distinguish committed value, display through gramlot.format | Guessing inverse parsing from format/mask or narrowing Decimal silently |
| Tool collaborator | Accessory buttons, popup focus boundary, ownership and cleanup | Committing Data independently of the field |

Mixin proposal: composition is explicit in the component class/factory; capability
metadata describes the result, rather than silently installing behavior. Define
requirements and lifecycle order; release connection resources in reverse order.
State is per instance. Duplicate capability installation and conflicting public
members need a clear diagnostic, not an import-order-dependent winner.

<a id="gc-245-020"></a>
## 020 · JS ownership, metadata inheritance and registration

Proposed flow:

```text
JS module: own description + implementation factory
             ↓ explicit collection exports
trusted preparation: resolve inheritance/capabilities, export effective metadata
             ├── shipped JSON → Python Builder declarations → Source
             ├── same metadata → JS/Worker Builder declarations → Source
             └── browser activation → register selected implementations → render
```

Automatic registration means that activating the application's selected collection
performs the registration work; application pages do not call customElements.define
for each widget. It does not mean scanning all installed packages or registering
every subclass merely because it extends a base. The collection's explicit exports
identify concrete components; abstract bases and mixins never become DOM tags.

Propose one entry point per collection, loaded through the existing trusted asset
path. Preparation must work without DOM globals. The same module can export a
description and a factory that creates its class only in the target browser realm.
Python consumes shipped JSON without Node; serverless Worker authoring must not
evaluate HTMLElement code. Browser activation registers in the correct realm,
including iframe pages, and completes before component rendering starts.

Proposed metadata rules: base parameters/events and capability contributions are
resolved once into each concrete component's effective declaration. Overrides are
explicit, and conflicts between contributions are reported during preparation.
The generated artifact includes parameters, defaults, types, pointer eligibility,
property/attribute projection, public events/methods and supported child structure.
intl_str qualifies visible/accessibility text without translating it in this release.
Typed value properties must not be coerced into HTML strings during projection.

This is distinct from merging Builder collections. Preserve GC-210 §090: later
collections replace complete named elements/abstracts; do not introduce an implicit
deep-merge alternative. The export therefore contains complete effective entries.

Registration policy proposal: activating the same selected implementation twice is
idempotent; another implementation claiming an occupied DOM tag is an explicit
conflict. A Builder vocabulary override is not a license to redefine a browser
custom element. Verify metadata/runtime agreement and missing assets on clean
installs. Distinct versions in the same realm and scoped registries are not assumed.

First qualification uses explicitly selected collection fixtures through current core
entry points. The owner subsequently approved application collection configuration
for the gallery; Python, Node and serverless delivery is now verified (GC-105 §035).
No application loading code is hidden in individual examples.

<a id="gc-245-025"></a>
## 025 · Labelbox, styles and validation

Retain the accepted routing: `lbl` is field-label text; `lbl_position` is explicit
layout; other `lbl_*` target the label; `box_*` target the outer wrapper;
`box_l_*`/`box_c_*` target label/control containers. Specific prefixes win before
generic routing. Reuse supported destination attributes and existing Source
pointer resolution, including `:` and `:=` where permitted; widget value still
cannot use suffix transformations. No component reads DOM attributes to resolve
another Source attribute.

Presentation updates preserve the control instance, draft, value, focus and caret.
Use shared theme tokens for normal/compact density and light/dark mode. Propose
an explicit styling surface for shadow content; avoid an ad hoc set of CSS mappings
per component. Label/control association must be tested across the actual shadow
boundary. Side-label alignment and wrapping need a concrete visual proposal.

For checkbox/radio groups distinguish the field's `lbl` from each option's caption
(`label` in the legacy single-control syntax). Both are localization candidates;
codes, paths and dimensions are not. The group label names the group, while option
captions identify individual choices.

Validation remains Gramlot-owned and may configure native constraints when their
meaning matches. First expose required/length behavior through one agreed rule path
and shared error presentation; do not port PoC FormField/Validator wholesale or
invent a required FormService dependency. Timing, invalid-draft commits and null
gestures require a bounded input decision before implementation. In particular,
the PoC's special Backspace-to-null behavior is not automatically adopted.

<a id="gc-245-030"></a>
## 030 · Radio syntax from legacy

Inspected legacy revision `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`:
`gnrpy/gnr/web/gnrwebstruct/dojo11.py`, `gnrjs/gnr_d11/js/genro_widgets.js`
(`gnr.widgets.RadioButton`), `genro_components.js` (`CheckBoxText`,
`RadioButtonText`) and `projects/gnrcore/packages/test/webpages/inputfields/checkboxtext.py`.

Legacy authoring examples, **not new Gramlot signatures**:

```python
pane.radioButton(label="Standard", value="^.standard", group="delivery")
pane.radioButton(label="Express", value="^.express", group="delivery")

pane.radioButtonText(
    values="standard:Standard,express:Express",
    value="^.delivery",
    lbl="Delivery",
    cols=2,
)
```

The first shape binds each button's checked state; `group` supplies exclusivity.
The second binds one selected code and derives captions from `values`.
RadioButtonText derives from CheckBoxText and changes its checker to radio, with
an automatically assigned group when omitted. This is evidence for common option
presentation and different single/multiple selection policies.

The old lowercase `radiogroup(labels, group, cols=1, ...)` helper is explicitly
deprecated in the inspected legacy. The similarly named DojoX declaration is not
evidence for this field contract. Prefer the useful radioButton/radioButtonText
authoring model rather than creating an unrelated API solely from the word group.

Current core RadioControl already uses a boolean per native radio, scoped groups
and ordered peer updates. Preserve it. A new single-value group must have its own
explicit contract rather than silently changing native radios to return codes.
Propose group-owned value/commit with internal option checked states. Test keyboard
navigation, one selection, option updates and two independent group instances.
Native radio exclusivity depends on tree/form/name boundaries; separate shadow roots
must not be assumed to form one native group. Settle the component composition and
runtime adapter using a real single/group fixture before freezing the hierarchy.

Owner correction, 2026-10-16 (constitution 11.84 and GC-225): widget names are
identical in Python and JavaScript, preferably with case-insensitive lookup.
Both installed Builders already resolve schema names case-insensitively. Keep one
canonical spelling in the declaration and documentation; do not translate widget
names into Python snake_case. Concrete widget names above remain design proposals.
Caption, values, group and layout semantics should stay familiar where possible;
record behavior differences in the Softwell migration table.

<a id="gc-245-035"></a>
## 035 · callbackSelect and random-data lesson

Accepted example: generate a page-local set of 100 stable codes and random values
once at startup (for example item_001 with caption "Sample 001 — value 73").
The callback filters captions for text search and retrieves the caption/record for
an already-selected identity. Repeated queries must not regenerate the data. A
Python-authored page binds the selection; named JS Logic generates/searches data.
Use a Data Bag for the dataset, existing references for the callback, and ordinary
controllers/actions for interaction. No server, fetch, DOM scraping or second UI
state system is needed. Supply the equivalent JavaScript page for other galleries.

PoC evidence: `_querystring`/`_id`, rows with named identity/caption fields, and
synchronous or Promise results. Proposed contract retains these useful roles;
the exact signature, callback reference spelling and result envelope were confirmed
for the bounded implementation in §085. Use existing jsref/Logic mechanisms without a second callback evaluator.
An optional async variant illustrates pending state and obsolete-result rejection.

Keep the approved optional Regenerate button. Proposed behavior: regenerate only
on its explicit action and clear the prior selection together with its caption;
confirm that reset rule before implementing it. Deterministic generated data in
tests proves search and exact lookup; the gallery may use randomness. A stale
Promise must not overwrite a newer search, regenerated dataset or disposed control.

<a id="gc-245-040"></a>
## 040 · Delivery stages and acceptance gates

These are proposed stages for the requested 0.3 plan. The initial inspection and
scope update are complete. The first bounded runtime increment is now implemented
and qualified (§060); the remaining stages are not complete.

| Stage | Concrete output | Gate before moving on |
| --- | --- | --- |
| P0 · Contract sketch | One JS module example, hierarchy/capability composition, effective metadata and Python result; textbox, checkbox and radio-group examples side by side | Review actual public syntax and ownership, not an abstract architecture alone |
| P1 · First working family | Shared labelbox + textbox, textarea, checkbox, single radio and radioButtonText-style group, introduced in small reviewable increments | Same Python/JS metadata path; two controls sharing Data; labels and positions update without recreation; group semantics prove the base is not text-specific |
| P2 · Registration and extension proof | Automatic activation of selected exports, generated metadata in packages, inherited parameters/capabilities, a separate test collection extending a base | DOM-free export and Worker import; Python-only install; no edits to a central per-widget catalogue; duplicate/conflicting registration diagnostics; realm isolation |
| P3 · Complete simple family | Password, color, horizontal/vertical range; basic shared validation integration after its contract is accepted | Typed/null/empty behavior, lock propagation, events and keyboard behavior match their accepted contracts |
| P4 · Typed editors | Numeric editor, date editor/calendar and time editor | Locale/timezone/format reuse; explicit parsing; invalid drafts do not silently corrupt Data; Decimal/date types and focus/selection preserved |
| P5 · Choice family | comboBox, filteringSelect, checkBoxText and callbackSelect; reuse option behavior with radio groups | Free text versus constrained identity versus multiple selection; reactive options, exact lookup, Promise races and disposal; random-data lesson works serverless |
| P6 · Teaching and qualification | Chronological lessons, component authoring/extension guide, parameter references and Softwell migration notes | Python + Node + serverless, Chromium + WebKit, keyboard/labels/themes; actual Safari checks identified separately; final review before release authorization |

P1 and P2 are interleaved: the first textbox already travels through real metadata
and activation; P2 proves extension and distribution rather than replacing a
temporary hardcoded path. The controls are designed together, not all implemented
in one large patch. Do not introduce a new shared layer until at least two concrete
consumers demonstrate its purpose. Radio groups are the early non-scalar shape.

Create bounded PORT records at implementation entry, preserving PoC evidence,
accepted differences and feedback. Core tests use owned fixtures, never an examples
dependency. Examples live in gramlot-examples; adapter delivery changes stay in the
owning integration repository. Any required Builder/Bag/TYTX capability is reported
upstream rather than patched in a consumer.

<a id="gc-245-045"></a>
## 045 · Verification and teaching plan

| Area | Evidence required |
| --- | --- |
| Metadata | Inherited/default/type/pointer rules agree in Python, JS authoring and runtime; no manually duplicated Python schema |
| Reuse | Textarea, checkbox and radio group reuse label/state capabilities; separate extension collection does not edit framework registration lists |
| Source/Data | External writes, user edits, equal echoes and differing corrections; one intended commit; dynamic datapath and Source updates |
| Lifetime | Reconnect without duplicate listeners; semantic disposal under freeze; callbacks cannot commit to removed/rebound nodes |
| Editing | Empty string versus null, live/commit, IME, focus/caret, readonly/disabled, invalid draft feedback |
| Layout/accessibility | All eight label positions and reactive switching; label click/focus, group/option names, keyboard navigation; compact/default and light/dark |
| Transport/packaging | Clean Python installation without Node; Node/Bun authoring; Worker export without DOM; assets and effective metadata shipped together |
| Callback | Stable random dataset across queries, identity lookup, pending/error state and obsolete completion; optional regeneration behavior documented |

Teaching order: native HTML comparison → textbox with labelbox → multiline and
boolean differences → single/group radio → typed editors → local selections →
callbackSelect. Reuse the same customer/delivery example to demonstrate reduced
application code. Each lesson says briefly what it shows, what it teaches and which
library layer it uses; it does not import later-release concepts into older lessons.

The initial planning pass inspected source and existing test cases without running
new component tests. Subsequent bounded runtime qualification is recorded in §060.
Beyond that increment, browser compatibility and full validation behavior
are not claimed implemented or verified.

<a id="gc-245-050"></a>
## 050 · Next concrete decision and platform references

Next deliverable is P0's small JS definition and generated Python signature for
textbox, checkbox and the radio group. Review whether to adopt the proposed
base + explicit capability mixins + stateful collaborators and selected-collection
activation. Public names and concrete hooks are recorded in GC-225 before use.
Then settle only the value/edit and registration rules needed for P1; typed editor
and provider details are decided when their stages need them. No exhaustive edge
case checklist is a prerequisite for seeing the first concrete definition.

Standards checked on 2026-10-16:

- [WHATWG custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-core-concepts):
  definition/registry lifecycle, constructors and attribute reactions. A subclass
  declaration alone is not registration. Form-associated custom elements and
  ElementInternals are separate capabilities, not automatic effects of a value property.
- [WHATWG radio input](https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio)):
  group identity, checkedness and tree/form boundaries. Verify actual component
  keyboard and accessibility behavior rather than assuming native grouping survives
  arbitrary shadow composition.

These references support the platform analysis, not blanket browser qualification.


<a id="gc-245-055"></a>
## 055 · Accepted first implementation — 2026-10-16

Owner: "ok mi torna, aggiorna il contratto e procedi con textbox e labelbox,
verificando che la stessa struttura funzioni anche per checkbox e radioButtonText".
The JS descriptor API is defineComponent({name, tag, base, mixins, parameters,
implementation: Base => class extends Base {...}}). defineCollection({name,
components}) lists explicit concrete exports. Abstract bases and mixins contribute
parameter metadata and behavior; the effective declaration is exported to the
existing Builder grammar format for Python without executing JavaScript there.
intl_str remains a string qualified in component metadata until localization lands.

NativeControl implements the native-control lifecycle; concrete implementations
provide createControl/readControlValue/writeControlValue. ChoiceGroup implements
radio options and one scalar group value. Labelbox composes labels/containers;
FieldState presents state without adding a validation engine. The existing runtime
resolves Source attributes and owns two-way writes; components do not read the Bag.
Names are textbox, checkbox and radioButtonText in both authoring languages.

The existing explicit collections argument is the bounded integration point:
JS receives the collection descriptor, Python its generated grammar document.
Activating a browser collection registers its custom elements in that document's
realm. Server/Worker imports and grammar export do not require DOM globals.
Automatic application configuration and remaining control families stay deferred.


<a id="gc-245-060"></a>
## 060 · First increment implemented and qualified

The accepted §055 API now has a bounded implementation: textbox, checkbox and
radioButtonText; NativeControl/ChoiceGroup; Labelbox/FieldState; realm-local
registration; JS-generated Python grammar. The existing explicit collections
argument is used; the gallery now selects inputs through application collection configuration (GC-105 §035).
See [GC-105](../public/105-components.md) for executable authoring/activation examples
and limits, and [GC-070 §1010](../internal/070-work-status.md#gc-070-1010) for verification.
P0 is accepted. The three-control portion of P1 and its P2 registration/export
proof are implemented, not the entire P1/P2 matrix or the complete 0.3 scope.

Python and JS valid input/pointer flows, reactive layout, shared Data, IME, disposal
and native radio keyboard/group behavior are verified. Python's nested-Regex/Union
validation gap remains an explicit dependency defect with a direct expected-failure
regression. No dependency workaround is included. Local runtime verification is
separate from owner acceptance and publication. The gallery rollout is now implemented (GC-070 §1015).


Implementation note: effective binding metadata stays separate from the portable
signature: a non-string bound parameter accepts its literal type or an Annotated
string matching the pointer/expression prefix. No arbitrary string alternative is
intended. NativeControl contributes disabled, readonly and live; ChoiceGroup
contributes disabled. FieldState.setFieldState presents invalid/pending ARIA state
without introducing a validation engine. A collection uses toDocument/register;
constructor.gramlotComponent identifies its registered implementation internally.


Gallery loading follow-up — 2026-10-16: the owner approved explicit inputs activation
for Python, Node and serverless. This supersedes the deferred-loading statements
above for this bounded increment. Applications supply generated grammar plus a
browser module URL; the gallery includes the three input examples after controllers.
Remaining collections, automatic discovery and distribution policies remain future work.


<a id="gc-245-065"></a>
## 065 · Simple input block — 2026-10-16

Owner authorization: "ok procedi con il primo blocco: textarea, password, radio
singolo, colore e slider orizzontale e verticale, con labelbox ed esempi compatti
nella gallery". Following the existing naming inventory, the concrete methods are
textBoxArea, passwordbox, radioButton, colorpicker, horizontalSlider and verticalSlider
(GC-225). All six reuse NativeControl/Labelbox/FieldState, the generated Python
JSON and the existing binding engine; no second component hierarchy is introduced.
Single radios reuse Source-scoped RadioGroups, with arrow navigation across shadow
roots. Native range controls retain browser keyboard behavior.

Implemented together with compact Python-first gallery lessons w04–w09 and matching
JavaScript pages. See GC-105 §040 for contracts and native limitations. Number/date/
time editors, selection families (including the accepted callbackSelect random-data
example), full validation and store-backed components remain later increments.
This block does not complete the entire 0.3 collection or authorize publication.


<a id="gc-245-070"></a>
## 070 · Typed editor block — owner direction, 2026-10-16

Owner requests the next block: numeric, date and time inputs, with shared labelbox
and compact gallery examples. Asked to choose text editors or browser-native inputs,
the owner confirms: "Editor testuali come nel PoC, con formattazione Gramlot".
Use the inventoried numberTextBox, dateTextBox and timeTextBox names, retaining the
shared descriptor/export/registration pipeline. Localized numeric drafts and date
expressions such as "oggi" are part of the selected editing direction. Parsing and
formatting remain separate; invalid drafts must not overwrite the committed Data.

Read-only qualification found a prerequisite: current Builder JS rejects portable
annotation types datetime.date, datetime.time and decimal.Decimal during grammar
activation; Gramlot's Python loader also has no entries for those named types.
A concrete reproduction substitutes each named type in the generated collection
and instantiates GramlotBuilder: each fails with "unsupported type". CustomTypes
currently supports Regex/Range on primitives, not these domain types. Do not weaken
the signatures to object/Any or convert values to strings to hide this gap.
A bounded owning-library extension has been submitted for explicit authorization;
no Builder source or installed dependency has been edited. Date/Decimal runtime
wire support and grammar-signature support are distinct responsibilities.


<a id="gc-245-075"></a>
## 075 · Portable dtype contract — owner confirmed, 2026-10-16

The owner corrects §070's proposed remedy: exported component parameter types use
Gramlot/TYTX dtype codes, not names such as datetime.date or decimal.Decimal.
Confirmed descriptor example: value: {dtype: 'D', nullable: true, binding: 'twoWay'}.
The dtype describes the value; nullable and binding describe independent policies.
Keep JavaScript/Python interpretation aligned with the owning type library. Do not
create an independent component-specific mapping or serialize/reparse values merely
to validate their declared type. Localization qualifications such as intl_str stay
separate from the underlying text dtype.

The earlier proposal to extend Python-named type whitelists is superseded.
Correction to the initial inspection: TYTX getRegisteredType includes built-ins,
not just custom classes; Python exposes SUFFIX_TO_TYPE. These existing registries
are sufficient. No new independent type catalog is needed.

Owner authorization: "ok procedi con il supporto dei dtype nei builder e poi
completa gli input numerici, date e orari con labelbox ed esempi compatti nella
gallery". This authorizes the bounded Python/JS Builder dtype descriptor and
Python domain-annotation export, core loader/component integration, and gallery.
All component metadata now uses dtype; intl_str remains a separate qualification.

<a id="gc-245-080"></a>
## 080 · Typed editor delivery — 2026-10-16

Implemented numberTextBox/dateTextBox/timeTextBox with shared TypedEditor,
Labelbox and FieldState; invalid drafts are separate from committed typed Data.
See GC-105 §045–050 for executable examples and bounded parsing/formatting rules.
Compact Python-first gallery lessons w10–w12 have matching JS pages. The numeric
JS example initializes an exact value through Bag.fromTytx, importing Bag inside
async Page.main. The shared page module retains its empty client Logic without
executing the host-only import in the browser. Components use the page runtime's TYTX functions to preserve type
identity across separately built collection modules. No changes to TYTX or Bag.

No calendar/time popup, full validation engine, numeric spinner, selection/store
family or publication is part of this increment. callbackSelect and the remaining
selection components are still future work. Verification and remaining known
Builder nested-Regex limitation are tracked in GC-070; owner visual acceptance
remains distinct from automated qualification.


<a id="gc-245-085"></a>
## 085 · Choice editor delivery — 2026-10-16

Owner requested select/callbackSelect with compact labelbox gallery pages and
confirmed "Sì, confermo questa API" to filteringSelect(value, values, lbl) and
callbackSelect(value, callback='searchChoices', lbl), with named Logic search by
_querystring or lookup by _id and {rows, identifier, caption} results, optionally
as a Promise. Native select is unchanged. This resolves §035's contract gap.

Implemented ChoiceEditor over NativeControl, with Labelbox/FieldState and local
or callback providers. Runtime context calls the existing Logic registry; the
ControlAdapter remains the only Data writer. Query drafts never write codes,
unknown captions stay invalid, empty commits null, and external values recover
captions. Popover/keyboard/async lifetime behavior is shared. See GC-105 §055.

Python-first w13/w14 have JS twins. A startup controller generates 100 records in
a Data Bag once; search and exact lookup reuse those records. No regeneration
button is added; its reset policy remains deferred. comboBox, checkBoxText,
store/DB providers and the complete validation pipeline remain later increments.
GC-070 records checks; implementation is local, without publication or a claim
of owner visual acceptance.


<a id="gc-245-090"></a>
## 090 · Remaining local choices — 2026-10-16

Owner accepts the proposed comboBox/checkBoxText block with "procedi", then
confirms "Sì, stringa di codici come nel PoC" for multiple selection: comma-separated
codes or null for no selection. Implemented comboBox as the unconstrained policy
of ChoiceEditor/localChoices: suggestions and arbitrary text, caption values,
textbox-like empty strings and live/IME behavior. checkBoxText activates the
multiple policy of ChoiceGroup, with the same labelbox and portable grammar.
No new binding adapter, application state system or dependency change is needed.

Python-first compact w15/w16 pages have JS twins. The group demonstrates shared
selection, reactive columns/labels and readonly. This completes the four listed
P5 choice components at the accepted bounded level; the PoC checkBoxText popup
variant and store-backed options are not claimed. Calendar is completed in §095; basic validation is completed in §100; theme refinement and final collection distribution/qualification remain pending.
See GC-105 §§060–065 and GC-070 §1035. No publication is authorized.


<a id="gc-245-095"></a>
## 095 · Calendar increment — 2026-10-16

Owner confirms calendar=True by default, calendar=False opt-out, standalone dateCalendar, Labelbox and compact gallery examples. The shared CalendarView composes into CalendarControl and dateTextBox; both use ControlAdapter, nullable D values, existing page locale and workdate. This completes the calendar part of P4. Monday-first weeks retain the PoC convention; Intl formats month/day captions. Text-only and popup entry share the existing natural-date parser and typed draft policy. Keyboard navigation, null, external Data changes, readonly/disabled, popup cleanup and narrow-screen placement are verified in core tests and Chromium/WebKit across all three hosts (GC-070 §1040). No time popup, date constraints, range selection or validation engine is added. Implementation is local; acceptance and publication remain separate.


<a id="gc-245-100"></a>
## 100 · Basic validation — 2026-10-17

Owner confirms the rejected-draft/last-valid-Data contract and authorizes required values and length. FieldState declares validate_notnull, validate_len and *_error messages; one pure evaluator gates candidates before typed/choice acceptance and the existing adapter write. The renderer routes declared component parameters from resolved Source before HTML attribute filtering. No Builder modification, second Data writer or form service is required. Messages are shared with parsing and choice errors. Existing live/change/IME timing is retained; null/empty, zero/false and string-length semantics follow the bounded legacy rules. The full validation pipeline remains a later scope. Python-first compact gallery w18 teaches draft versus accepted value. See GC-105 §075 and GC-070 §1045 for qualification.


<a id="gc-245-105"></a>
## 105 · Layout increment (2026-10-17)

Owner explicitly approved formlet, groupBox with default TYTX copy and optional
JSON, checkbox mode="switch", and compact gallery examples. This extends the
input increment with a separate layout collection. Container definitions export
sub_tags="*"; leaf controls retain empty sub_tags. Container rendering uses slots
and does not attach a ControlAdapter. Formlet supplies reactive presentation
defaults resolved in the declaring Source scope; fields keep their own labelbox
and explicit overrides. GroupBox receives a renderer-owned readDataScope
capability, uses Bag serialization and never scrapes the DOM. See GC-105 §085.
Database/forms, drag/drop and paste remain outside this bounded port.


Owner refinement, 2026-10-17: formlet automatically aligns left labels to the widest intrinsic label in each rendered column. lbl_width is explicit only. Gallery field groups use formlet and no fixed label-width preview overrides; see GC-105 §085. This is shared component behavior, not example-specific layout compensation.


### Full validation follow-up — 2026-10-17

Owner “tutte le validazioni”; confirmed “Motore completo; DB/grid nel loro filone”. Supersedes the full-engine deferral of the basic validation increment. Scope: ordered local rules and transformations, conditions, warning/error messages, named/activated callbacks, asynchronous existing data RPC, cancellation and exit notifications. Preserve invalid drafts and last-valid Data. DB/grid validators and form persistence/save remain separate. See PORT-0013 and GC-105 §076; verification is recorded in GC-070.


<a id="gc-245-110"></a>
## 110 · Consolidated implementation and closing gate — 2026-10-17

The approved 0.3 increments are implemented: JS-owned component definitions,
explicit collections and generated Python grammar; seventeen input controls with
shared labelbox; formlet with intrinsic per-column label alignment; groupBox with
TYTX/JSON copy; checkbox switch mode; button, LED toggle and unified dropdown;
Mimi/Joanna themes and touch presentation; complete field validation with local
rules, callbacks and asynchronous existing RPC. GC-105 documents the public API.
Application startup activates the same collections in Python, Node and serverless.

The owner requests removal of the unnecessary datapath="." from w25 and restoration
of relative pointers before final verification. The group now owns datapath="profile";
its fields and callbacks inherit that context. No Builder or general binding
change follows from this example correction.

Final qualification covers full core/gallery suites, Chromium and WebKit across
all three hosts, inspector checks, clean wheel/npm installations and strict public
documentation builds. GC-070 §1175 records the results and environment limitations.
The original stage proposals are not evidence that an unimplemented feature ships.

Still outside this release: DB/grid validators and stores, tree/grid widgets,
buttonbars and the wider container collection, form persistence/save, rich editors,
and actual intl_str translation services. Localization metadata preparation remains
available. The owner subsequently authorized version bump, public consolidation and publication; all four releases succeeded. See GC-070 §§1180–1185 for authorization, package versions, registry installation checks and public documentation receipts.
