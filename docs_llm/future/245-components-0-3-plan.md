# 245 · Component collection plan for 0.3

Document ID: **GC-245**. Updated: **2026-10-17**.
Status: **approved 0.3 scope implemented, qualified, accepted for release and published**.

[Expanded counterpart](../../docs/future/245-components-0-3-plan.md).
[Previous investigation](205-components.md).

<a id="gc-245-005"></a>
## 005 · Objective and decision evidence

Owner requests callbackSelect in 0.3 with the random example, textbox + labelbox as
the start, and several controls designed together to avoid a text-only foundation.
Follow-ups add radio buttons/groups to the investigation and direct us to legacy
syntax where PoC implementations are absent. Constitution 11.84 records the scope.

Already accepted: JS-owned description/implementation and exported Python metadata;
application-selected collections (configuration syntax deferred); shared labelbox
and reactive TL/TC/TR/L/R/BL/BC/BR, default TL; Gramlot-led validation; deferred
intl_str; modern platform with explicit legacy differences (11.76–11.79).
No blanket approval of API names, hierarchy, schema, registration or PoC behavior.
No publication, dependency edits or parallel agent work follows from this plan.

> **Historical record.** The original inventory and stage proposals below describe the planning baseline. Later dated decisions supersede their deferrals; §110 describes the current delivered scope. A proposal alone is not an approval.

<a id="gc-245-010"></a>
## 010 · Evidence and corrected inventory

Read PoC `10478b57ce3f22e6445eb6b72eba343520cbebac`: component bases/registry/catalogue,
inputs, editor/provider helpers, WidgetLabel and design reviews. Older duplication
claims predate colorpicker's shared base. GC-040's missing-worktree export probe
must be recreated against current core, not assumed reproduced.

Proposed scope: text/password/textarea; checkbox; color and both sliders; number,
date/calendar and time; comboBox/filteringSelect/checkBoxText; owner-confirmed
callbackSelect; legacy-derived single/group radio (absent as dedicated PoC inputs).
Defer remoteSelect/dbSelect, rich editors, layouts, stores, grids/trees and full
form/save orchestration. dateTimeTextBox is not an existing PoC implementation;
historical design notes do not add it automatically.

<a id="gc-245-015"></a>
## 015 · Responsibility and hierarchy proposal

Propose lifecycle → value-bearing field → single native control or choice group;
non-field calendar stays outside the field branch. These are conceptual roles,
not final class names. Introduce a shared level only with demonstrated consumers;
never require every component to have one `_input`.

Use inheritance for shape, explicit narrow mixins for cross-shape capabilities,
and stateful collaborators for labelbox, drafts, parsing and popup tools.
Runtime binding resolves Source, subscribes/rebinds and commits Data; components
own UI/draft/focus and report semantic edits. Neither components nor collaborators
parse pointers or write arbitrary Data. Formatting reuses gramlot.format, not an
assumed inverse parser. Validation presentation is not a second validation engine.
Mixin metadata describes composition; it does not install features magically.
Specify requirements/conflicts, initialization/disposal order and instance isolation.

<a id="gc-245-020"></a>
## 020 · JS ownership, metadata inheritance and registration

JS description + implementation factory → explicit collection exports → effective
inherited metadata → shipped JSON for Python and JS/Worker authoring; selected
browser activation registers concrete classes before rendering in the correct realm.
No DOM during export/Worker authoring, no Node required by a Python installation.

Propose automatic registration on selected-collection activation, not installed-
package scanning or subclass discovery. Bases/mixins are not tags. Same implementation
activation is idempotent; conflicting DOM definitions fail. Vocabulary replacement
does not redefine a browser tag. Compare metadata/runtime and test clean packages.
Do not assume scoped registries or multiple versions within one realm.

Flatten base/capability parameter and event contributions once, with explicit
overrides/conflict checks. Export types/defaults, pointer eligibility, projection,
events/methods and children; preserve intl_str qualification without translation.
Keep typed properties typed. This does not change Builder collection composition:
GC-210 §090 replaces complete named element/abstract entries, rather than deep
merging them. Application configuration syntax remains deferred; use current
explicit selection fixtures initially, but actual host delivery is a release gate.

<a id="gc-245-025"></a>
## 025 · Labelbox, styles and validation

Preserve lbl/lbl_position/lbl_ and box_/box_l_/box_c_ routing, specific prefixes
first, with existing supported attributes and Source resolution. Attribute suffixes
remain unavailable on widget value. Label/position changes preserve identity,
draft, value, focus and caret. Reuse theme tokens and define a shadow styling surface.
Test accessible association and propose side-label alignment/wrapping concretely.
Group lbl and individual option label have different roles; both are localizable,
while codes/paths are not. Gramlot rules guide native constraints without duplicate
declarations. Decide timing, invalid commits and null gestures before implementing
them; the PoC Backspace-to-null behavior and full form engine are not adopted.

<a id="gc-245-030"></a>
## 030 · Radio syntax from legacy

Legacy inspected at `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`: dojo11.py,
genro_widgets.js RadioButton, genro_components.js CheckBoxText/RadioButtonText,
and inputfields/checkboxtext.py. Evidence syntax:
`radioButton(label=..., value='^.checked', group=...)` binds individual checked
state; `radioButtonText(values='a:A,b:B', value='^.choice', lbl=..., cols=2)`
binds a chosen code. RadioButtonText derives from CheckBoxText with a radio checker
and an automatic group. The lowercase radiogroup helper is deprecated in legacy;
the DojoX namesake is not this field contract.

Preserve current core native boolean-per-radio/group behavior. Propose a distinct
group-owned value/commit contract for the composite selector. Verify two groups,
keyboard behavior, dynamic options and tree/form/name isolation; separate shadow
roots cannot be assumed to form a native group. Owner correction, 2026-10-16
(constitution 11.84, GC-225): identical widget names in Python and JS, preferably
case-insensitive. Both installed Builders already support case-insensitive schema
lookup. One canonical declaration/spelling; no snake_case translation for widgets.
Concrete widget names remain proposals.

<a id="gc-245-035"></a>
## 035 · callbackSelect and random-data lesson

Accepted: 100 stable codes/random captions generated once per page; query filters
captions and identity lookup restores a selection's caption. Python page + named
JS Logic + Data Bag dataset, with a JS twin; no server/fetch/parallel UI state.
PoC `_querystring`/`_id`, identity/caption rows and sync/Promise results inform the
proposal; exact signature/result envelope and existing jsref spelling need review.
Optional Regenerate stays in the plan; clearing selection/caption on regeneration
is a proposed rule to confirm. Test deterministically; stale results cannot affect
a newer query, regenerated dataset, disposed or rebound control.

<a id="gc-245-040"></a>
## 040 · Delivery stages and acceptance gates

Inspection/scope update done; no new component runtime implemented.

| Stage | Output and gate |
| --- | --- |
| P0 | Concrete JS/Python definitions for textbox, checkbox and radio group; review composition, ownership and API |
| P1 | Textbox + labelbox, textarea, checkbox, single/group radio in small increments; real metadata/binding, no recreation, one selection |
| P2 | Registration, inherited metadata, packaging and separate extension collection; no central per-widget catalogue edit, DOM-free export, realms and conflicts |
| P3 | Password/color/ranges and agreed basic validation; types, null/empty, locks and keyboard |
| P4 | Number/date/calendar/time; parsing distinct from format, typed Data, locale/timezone, invalid drafts and focus |
| P5 | Local selections + callbackSelect/random lesson; identity/caption, multiple selection, options and async races |
| P6 | Chronological lessons, developer guide, migration notes; Python/Node/serverless and Chromium/WebKit, separately identified Safari evidence |

P1/P2 interleave: no temporary hardcoded registration/metadata path. Design several
controls together; implement reviewable increments. Require two real consumers for
shared layers. Bounded PORT records retain review/omissions. Core tests own fixtures;
examples/adapters stay in their repos. Dependency gaps belong upstream.

<a id="gc-245-045"></a>
## 045 · Verification and teaching plan

Prove metadata parity/inheritance; cross-control reuse; one Data commit; external
updates and corrections; datapath/Source changes; reconnect and frozen disposal;
IME, empty/null, locks and invalid drafts; eight positions, labels, keyboard and
themes; Python-only installs and DOM-free Worker imports; callback search/lookup,
pending/errors and obsolete results. Teaching progresses from native comparisons
to text/boolean/radio, typed editors, local options and callbacks, reusing the same
customer/delivery case. Short lessons state their library scope and preserve release
chronology. No new component tests or browser qualification ran in this planning pass.

<a id="gc-245-050"></a>
## 050 · Next concrete decision and platform references

Next: P0's concrete definitions and generated signatures; review base + explicit
mixins + collaborators and selected-collection activation, recording public names
in GC-225 before use. Settle only the next stage's required behavior; defer typed
editor/provider detail to its stage. No exhaustive edge-case gate before the sketch.

Checked 2026-10-16: [WHATWG custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-core-concepts)
for registration/lifecycle and the distinct form-associated capability;
[WHATWG radios](https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio))
for checkedness and tree/form/name grouping. These support analysis, not blanket
cross-browser qualification.


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
