# PORT-0010-input-components

- **Status:** review corrections verified locally on 2026-10-17; owner acceptance pending.
- **PoC revision:** `gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`
- **Destination revision:** current development work, not published.
- **Constitution checked:** §§3–7, 13–14; amendments 11.76–11.79 and 11.84.

## Evidence

The [2026-10-17 adversarial review](../PORT-0011-formlet-group-box/review-2026-10-17.md)
also covers this input port: uncommitted plain-text drafts, readonly group parity,
switch theme sizing and shared projection/popup/choice parsing. The original findings and their verified corrections are retained there; earlier
verification below did not cover these reproductions. Preserve this feedback in subsequent component ports.

PoC `js/dom/src/components/{bases,registry,field-state}.js`,
`collections/inputs.js` and `collections/decoration/widget-label.js` informed the
responsibility split. Legacy `gnrjs/gnr_d11/js/genro_components.js`
(`RadioButtonText`) at `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea` supplies
values/code/caption semantics. GC-245 records the wider inventory and decisions.
This is a bounded reimplementation using Gramlot's existing binding and grammar;
no PoC runtime, second Data system or dependency source was copied in.

## Scope and contract

Owner approved the reviewed defineComponent/defineCollection API and requested
textbox + shared labelbox qualified with checkbox and radioButtonText. One JS
metadata definition exports Python grammar. DOM-free imports, explicit selected
collections, realm-local registration, NativeControl/ChoiceGroup composition,
Labelbox/FieldState mixins and runtime-owned two-way writes are included.
See GC-105 and GC-245 §055 for the public and development contracts.

## Verification

- Core JS suite: 3461 passed, zero failed.
- Python: 162 passed, 259 subtests passed, one expected upstream failure.
- Chromium and WebKit: Python-authored Source; editing, label click/focus/caret,
  checkbox, native radio keyboard/exclusivity, group isolation, readonly, cleanup.
- Generated grammar comparison and Node imports without DOM globals verified.
- Prefix style removal, native-script rejection and dynamic option retention tested.

## Differences and open questions

No tri-state checkbox gesture, form-associated submission/reset, validation engine,
localization engine, other input families, application loading configuration or
store-backed choices are claimed. FieldState presents accessibility state only.
The Python Builder ignores Regex metadata inside a Union; the direct reproduction
is `test_upstream_annotated_regex_inside_union`. No dependency edits or consumer
workaround. Invalid-literal authoring parity therefore remains an upstream gap.

## Destination review

- **Result:** accepted for the bounded three-control/labelbox implementation and
  successful primary-path qualification; not acceptance of the entire 0.3 plan.
- **Remaining defect:** Python nested-annotation validation; owner-library fix
  required before claiming full Python/JS invalid-input parity.
- **Reusable feedback:** test more than one control shape, preserve native editing
  through the existing ControlAdapter, keep component metadata export DOM-free,
  and exercise real browser keyboard/shadow boundaries before freezing the API.


Follow-up, 2026-10-16: owner classifies the nested-Regex/Union discrepancy as an
edge case and authorizes opening the upstream issue ("ok ma è un edge case. apri
pure l'issue"). Filed [Builders Python #59](https://github.com/genro-org/genro-builders/issues/59)
with the minimal reproduction, expected branch-local validation and JS parity.
Track it as non-blocking for the component work; the known limitation and direct
expected-failure regression remain explicit until upstream resolves it.


Gallery follow-up — 2026-10-16: owner-approved application loading now pairs the
JSON grammar with a browser module URL. Python, Node and serverless galleries
select inputs explicitly and expose w01/w02/w03 after the controller lessons.
Chromium and WebKit pass on both hosts and the file:// export. The same examples
build in the public manual. This closes the initial gallery-delivery gap; owner
visual acceptance and the wider component inventory remain separate.


Simple-family follow-up — 2026-10-16: owner authorizes textarea/password/single
radio/color/horizontal and vertical sliders, labelbox and compact gallery lessons.
The bounded implementation adds textBoxArea, passwordbox, radioButton, colorpicker,
horizontalSlider and verticalSlider through the existing descriptors/mixins. No
PoC bulk copy, parallel binding engine or dependency workaround was introduced.
Numeric metadata exports as Python float signatures (including valid integer
arguments); radios reuse Source/form-scoped RadioGroups with cross-shadow arrows.

Destination review: code, generated JSON, paired public/plan docs and gallery
w04–w09 are implemented and verified. See GC-070 §1020 for full test evidence and
native browser limitations. User visual acceptance is pending; later typed and
selection families remain outside this block. Reusable feedback: compare real
Chromium/WebKit controls, distinguish native keyboard differences from binding
bugs, and test compact cards at narrow widths as well as desktop.


Typed-family follow-up — 2026-10-16: owner authorizes portable dtype support in
both Builders, then numberTextBox/dateTextBox/timeTextBox and compact gallery
w10–w12. Reuse the existing TYTX registries; no Bag/TYTX source changes. The shared
TypedEditor keeps invalid drafts out of Data, formats through the page and receives
Decimal services from that same runtime (a separate bundle must not create a second
type identity). Civil D/H stay typed; the JS carrier's midnight ambiguity is resolved
by the editor's declared dtype. Python dates/times/Decimal survive Source transport.

Destination feedback: renderer display directives must remain available to declared
component parameters; numeric drafts need testing with an exact value beyond 2^53,
not just ordinary floats. Check both bundled browser collections and source-module
tests. Keep a host-only import inside Page.main when the shared module also exports browser Logic.
Browser qualification passes in Chromium/WebKit on Python/Node/file://; GC-070
records full checks. This is local implementation, not publication or owner visual
acceptance. Selection families and full validation remain future increments.


Choice-family follow-up — 2026-10-16: owner confirms filteringSelect and
callbackSelect signatures with named Logic and the PoC query/result envelope.
Bounded destination implementation reuses NativeControl, Labelbox, FieldState,
the Logic registry and the existing Data writer. It does not port the PoC's
server/database providers or inline callback evaluator. Shared ChoiceEditor owns
caption drafts and top-layer popup lifetime. w13/w14 demonstrate local choices
and stable random records in Data, in Python, Node and serverless.

Destination feedback: test initial identity resolution after DOM/context attachment,
not just typing; pending searches must not overwrite external value changes or
survive removal. The runtime adapter, not the widget, commits Data. Core and
browser qualification is recorded in GC-070 §1030; public API and limits in GC-105
§055. Other choice families and owner visual acceptance remain separate.


Remaining local-choice follow-up — 2026-10-16: owner confirms comboBox/checkBoxText
and the PoC comma-separated-code/null value contract. The destination extends
ChoiceEditor with its constrained/free-text policy and ChoiceGroup with multiple
selection. Neither component writes Data independently. Existing radio and
constrained-select tests remain regression gates. The group uses an accessible
inline layout and preserves selected-code order; popup and store-backed options
are not ported in this increment. Gallery w15/w16 are compact Python-first lessons
with JS twins. GC-070 §1035 records final verification and publication status.


### Calendar increment — 2026-10-16

Owner confirmed standalone dateCalendar and dateTextBox calendar=True (False opt-out), with labelbox and compact gallery. PoC evidence: js/dom/src/collections/date-calendar.js and symbolic-date-editor.js. Destination uses a shared CalendarView, existing component descriptors and ControlAdapter, not the PoC tool host or a second Data writer. Civil D is retained throughout; Monday-first weeks and month navigation follow PoC. Popup uses native Popover with cleanup; typed editing still uses Gramlot parsing/format. No date ranges, constraints or time popup. Core and gallery suites pass; Chromium and WebKit pass against Python, Node and file:// serverless. Both Sphinx builds pass with warnings as errors. A selected date travels as a typed value rather than being parsed back from a localized caption; a century-preservation/live-mode regression and Python TYTX calendar authoring verify this responsibility. Owner visual acceptance/publication are separate.


### Shared required/length validation — 2026-10-17

Owner approved rejected input staying visible while Data keeps its last valid value. Bounded port of PoC forms/validator.js notnull/len semantics into a pure input rule evaluator, using shared FieldState presentation. Do not port FormField, remote callbacks or save orchestration. The accepted rule runs before typed/choice commitment and before ControlAdapter writes. Component parameters come from resolved Source, not HTML-filtered attributes. No Builder edits or alternate Data state system. Core rule/editing regressions pass; gallery suites and Chromium/WebKit checks pass on Python, Node and file:// serverless. Both Sphinx builds pass with warnings as errors. Remaining full validators are outside scope.


### Validation presentation correction — 2026-10-17

Owner requests no layout shift, red invalid controls and a disappearing floating
message. Legacy evidence: gnrjs/gnr_d11/js/genro_widgets.js, mixin_displayMessage
and patch_displayMessage, delegates to dijit.showTooltip/hideTooltip;
dijit/form/ValidationTextBox.js sets state Error and displays its tooltip when
focused. The tundra theme's form/Common.css used a yellow error background;
Gramlot uses red as explicitly requested, not the old theme color. Local evidence:
../worktrees/genropy-gramlot-pages. No legacy code is copied.

FieldState now uses a manual native popover, positioned at the control within the
viewport. The implementation timeout is four seconds; Escape/scroll/resize dismiss,
focus/mouse entry redisplay. Red state and accessible description survive dismissal.
Data acceptance and validation rules are unchanged. Cleanup belongs to the mixin.

Verification: 3494 core JS tests pass; the final focused validation tests pass.
Chromium/WebKit checks pass in Python, Node and serverless, measuring unchanged
field height and following-control position. WebKit native appearance changed size
when styled with background/border colors: use outline and text color only, retaining
native metrics. This finding applies to future input theme work. Docs build passes.


### Multiple theme families — 2026-10-17

Owner requests GenroPy Mimi/Gioanna-inspired looks and multiple themes. References:
resources/common/themes/mimi.css and joanna.css in the legacy checkout. Map compact
proportions and palettes to Gramlot tokens without copying Dojo rules/widgets.
Profile IDs: genropy-mimi/genropy-gioanna. Keep light/dark independent; dark profiles
are new adaptations. Shared shadow CSS consumes semantic colors/metrics, including
calendar/choices/error popovers. Source label/box overrides retain precedence.
Use the existing index/frame theme protocol and preference storage. Native checkbox,
radio and slider rendering remains browser-specific. Themes ship in core packages.

Theme verification: core JS suite 3494 passed, focused index suite 6 passed,
Python 163 passed/1 existing xfail/261 subtests, gallery 86 passed. Both themes and
color modes pass Chromium/WebKit on Python/Node/serverless; validation geometry
regression checks pass all six environments. Shared component tokens, preserved
Data/instances, profile replacement and persistence are verified. Visual similarity
is an owner review, not a claim of pixel-identical legacy rendering.


### Visual reference: Demetra (2026-10-17)

Owner-supplied *Demetra · Manuale del backoffice generale*, edition 16 October 2026,
pages 5–7: the person and consultation-office forms, nested office dialog and
schedule illustrate compact label/control spacing, thin borders, restrained radii,
small action toolbars and field widths chosen by content. Several fields share a
row; the schedule and grids use the remaining area. This is an application theme
layered over a GenroPy base, as the owner explicitly clarified. Beige/ochre and
the dark header are Demetra-specific visual evidence, not the Mimi/Gioanna palette.

Comparison with the Gramlot previews: field size, typography, readonly/error and
popup colors belong to shared theme tokens; columns, field widths and grouping
belong to the page composition. Removing repeated label-position selectors makes
the lessons less like test panels. The PDF supplies visual proportions, not exact
CSS dimensions, hover/focus behavior or the identity of Demetra's base theme. The
manual was inspected visually; a live invoice session was not available among the
open browser tabs or identified running demo processes. No Demetra-specific theme
is implemented or claimed.


### Live invoice comparison — 2026-10-17

Reference: authenticated `test_invoice_pg`, Invoice form, Mimi theme, inspected
in Chrome after the owner opened an invoice. Screenshot and computed DOM metrics
agree: fields 17.5px, text 12px, labels 10.8px, radius 4px, field padding 1px top /
3px left, formbuilder spacing 4px (3px totals). Enabled/locked fields have the same
geometry. No records were edited; lock restored after inspection.

Gramlot Mimi now uses an 18px minimum, 12px text, .9em labels and 4px field corners;
Gioanna uses a 20px minimum, 13px text and Joanna's .8em label ratio. Both use 1px ×
3px padding, 2px label gap and 6px stack spacing. Native HTML and shadow controls
share field-line-height; labelbox reads label-gap and label-color. The calendar
button uses the field's height and colors. No widths are forced globally.

Evidence boundary: only Mimi has a live comparison; Gioanna follows its source
CSS and the same density refinement, not a claim of pixel parity. The gallery is
not a legacy invoice layout. Chromium/WebKit × Python/Node/file theme checks pass,
including geometry, edits, colors, popups and errors without layout shift; WebKit's
input minimum can be exceeded by 1px due to its native line metrics. 39 component
tests pass. Local work is verified, unpublished, awaiting owner visual acceptance.

Owner naming correction, 2026-10-17: the profiles described above are now named `mimi` and `joanna`, including theme IDs, captions and directories. The earlier names are historical only.


Correction follow-up: owner authorized all R1–R10 fixes before further components.
The review's closing table and GC-070 §1115 record the completed corrections and
regression checks. The previous review remains historical evidence; no open item
from that bounded review is deferred. No publication or owner acceptance claimed.
