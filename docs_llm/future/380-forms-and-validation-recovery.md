# 380 · Forms and validation recovery

Document ID: **GC-380**. 2026-10-29. Recovery/comparison complete; §050 approves Source-owned registers and the save
indicator. §055 confirms invalid current values in form Data and legacy behavioral parity.
New form lifecycle implementation and concrete APIs remain pending.

<a id="gc-380-005"></a>
## 005 · Scope and evidence

Owner requests recovering legacy/PoC forms and validation for Gramlot. Preserve
Source/Data ownership, no state on Logic, DOM-only detachment and editor identity.
See the [full report](../../docs/future/380-forms-and-validation-recovery.md) and
[dossier](../../ports/PORT-0013-input-validation/recovery-20261029/README.md).
Updated legacy: `8ea63843fd11c4bd556869438ae289800c890db7` (2026-10-29), 40 selected
archived files. Older local legacy `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`
is not current. PoC `10478b57ce3f22e6445eb6b72eba343520cbebac`, working files
hashed/archived; destination working files separately hashed. Complete upstream
tree, selected form/validation runtime, examples and tests; not an exhaustive
census of every application/private repository/history. Archived files are
historical evidence, not approved Gramlot declarations.

<a id="gc-380-010"></a>
## 010 · Responsibilities

Layout (labelbox/formlet/groupBox/frame) differs from field validation and from
form lifecycle. Gramlot has field validation and semantic Source form ownership
(`formId`/`form=true`, including radio isolation); it lacks the general portable
form lifecycle reviewed here. HTML form and formlet do not imply dirty/save.

<a id="gc-380-015"></a>
## 015 · Inventory

Recovered: layouts/defaults; scope/field registration; parsing/null/drafts;
ordered and async validation; warnings/conditions/hooks; error summary/focus;
typed dirty tracking; restore vs reset; locking/protected paths; operation
concurrency; form errors; memory/item/document/record/collection stores;
new/delete/duplicate/navigation; form toolbars; pending editors/grid integration;
subforms/grouplets; autosave/keepable values/draft marker/clipboard/permissions.
Legacy sources: genro_frm.js, genro_widgets.js, gnrdomsource.js, Python
gnrwebstruct base/formbuilder and formhandler.py. PoC forms controller/service/
field/validator/stores/value-snapshot plus authoring/tests. Full capability matrix
separates implemented field/layout support, prototype-only behavior and gaps.

<a id="gc-380-020"></a>
## 020 · Validation difference

Gramlot implements select, notnull, empty, case, len, min/max, email, regex, call,
remote; conditions, messages, severity and callbacks; async cancellation/stale
guards. DB/grid nodup/exist/gridnodup explicitly deferred. False/zero/whitespace
are present; optional empty values skipped where appropriate; numeric bounds
retain types, no legacy coercion promise; email format defaults to warning.
PoC inside forms writes typed invalid candidates into Data and blocks save.
Gramlot currently keeps last accepted Data and rejected editor drafts. **Historical comparison, now resolved inside forms by §055**: a form must include the current invalid/pending editor
in its completion gate, never save older accepted Data while ignoring that draft.
PoC validate_depends/blankIsNull/form IDs/render tag are not new approved APIs.
Historical remote-validation notes are stale versus the actual RPC implementation.
Bag-level formulas/validation remain separately deferred (GC-335/340).

<a id="gc-380-025"></a>
## 025 · Current legacy lessons

Preserve newer regressions: remove errors on field teardown; deleted nodes must
not reappear through validation cleanup; nested deletions remain dirty; RPC failure
clears busy but retains edits; pending editors commit once before save/dismiss;
Item forms preserve parent tracking, identity and protected paths; hidden formlet
groups and rebuilt required controls behave correctly. Dojo/error envelopes are
legacy mechanisms, not destination contracts.

<a id="gc-380-030"></a>
## 030 · Stores and state

PoC memory is private snapshots, not persistence; item replaces a Bag; hierarchical
adds no separate behavior; subform is a field subset, not nested coordination;
collection edits existing keyed rows, not general CRUD/navigation; record uses
load/save RPC without remote version checking. See GC-320 §070.
PoC controller baseline/operation/error and private MemoryStore cannot be copied
as a parallel state system. Gramlot field values stay in Data; §050 places change/baseline, error and pending
registers on the form Source node, with relative field paths. Logic is behavior only.
Source-owned resources may hold abort/subscription/registration handles. Exact
Bag shape and stored/computed state remain open. Reuse existing mechanisms; do
not copy whole-Source scans per edit or rebuild controls on Data changes.

<a id="gc-380-035"></a>
## 035 · Proposed sequence and decisions

1. Portable field aggregation, validity/pending, dirty/baseline and restore.
2. Local Bag commit boundary and a minimal Python-first example.
3. Shared RPC load/save/cancel/failure lifecycle.
4. Frame/menu commands, pending editors, subforms/grouplets and navigation.
5. Backend-owned existence/uniqueness, records, permissions and conflicts.

Historical proposal superseded by §055: retain accepted Data with form-level invalid-editor gating
(recommended continuity), or explicitly introduce a Bag of typed invalid drafts.
Unparseable input cannot be treated as a typed valid value. Then settle authoring,
scope/status/baseline paths, initial validation, hidden/read-only/removed fields,
dynamic participation, nesting and naming under GC-225. Later persistence policy
is separate. Regression gates: two isolated relocated forms; no stale async
writes; dirty insert/delete/type/revert; pending editor saves; failed/concurrent
operations; teardown; DOM detachment and editor identity/undo preserved.

<a id="gc-380-040"></a>
## 040 · Verification

Executed focused Node suites: Gramlot **31**, PoC **32**, updated legacy **89**;
all passed, no failures/skips. Receipts retained. DOM emulation/isolated harnesses,
not browser/server qualification of a new form. No runtime edits, dependency
patches, publication or deployment. Backend/private integrations not exercised.
Next: define one bounded implementation contract using §050/§055.

<a id="gc-380-045"></a>
## 045 · Previous values and undo/redo — 2026-10-29

Owner asks to verify legacy old-value metadata and proposes a change index for
form undo/redo and save deltas. Direction only: no concrete schema/replay/transport
contract approved; invalid-draft policy is now settled inside forms by §055.
Verified upstream: `_loadedValue` is the first old value since baseline, not the
immediately preceding edit. Controller Data `changesLogger` separately stores net
path/from/to changes. Return to baseline clears both; insert/delete cancels;
deletion log alone lacks the old subtree. `getFormChanges` walks record clusters,
metadata, nested Bags and grids, not just the logger; scalar oldValue and nested
__old are typed legacy protocol. Invalid form candidates enter Data; save normally
blocks them but legacy allowSaveInvalid exists. No implicit adoption of that flag.
Probe using archived test fixture: 120→121→122 yields baseline120, one120→122
entry, outgoing oldValue120::L; return clears; insert/delete cancels; deletion
lacks old value. Receipt retained, no new runtime behavior claimed.

The proposal keeps operation history+cursor and a net change index derived from
the same edits. §050 supersedes the initial Data-owned register proposal: these
registers are attached to the form Source node; field values remain in Data.
Returning to baseline can be clean yet undoable. Need contracts for user-operation
grouping, redo branching, replay suppression, derived/external edits and editor
undo. Reversible insert/delete/Bag/attribute edits need existence-vs-null, typed
values, attributes, sibling order and detached deleted subtrees. Verify existing
Bag event guarantees; no dependency workaround. Relative paths, state never on
Logic; replay through Data/bindings, retain widgets.
Send net deltas, not history. Failed save retains state; successful async save
acknowledges only submitted snapshot, preserving later edits. History across save,
server conflicts/versioning and canonical responses remain open. oldValue alone
does not guarantee concurrency protection. Refines the proposed tracking slice;
no parallel private state store or implementation is approved.


<a id="gc-380-050"></a>
## 050 · Approved registers and save indicator — 2026-10-29

Owner: “terrei collegato al source node della form un registro dei cambiamenti
con l'indicazione deol valore precedente. e u. registro errori”; subsequently
“Sì, anche le validazioni in corso vanno tenute collegate alla form e devono
impedire il salvataggio finché non finiscono. Aggiorna il progetto con i registri
sul Source node”. Owner supplies mario → luigi → mario → required empty example.

Confirmed: form Source owns changes/previous values, errors and pending-validation
registers, retaining them across DOM-only detachment. Field values remain in Data.
Never state on Logic. Supersedes the proposal to put the registers in form Data;
no new exception to existing Source-or-Data ownership. Attachment names/schema
still open under GC-225. Change tracking compares with loaded/acknowledged baseline.

LED: valid unchanged mario=green; valid luigi=yellow with mario→luigi change;
return to mario=green/no net change even with undo history; empty required name=
invalid field/red/save blocked. Errors override clean/dirty presentation. Pending
validations independently block save until finished; pending appearance remains
open, no automatic queued save approved. Green is valid/unchanged, not proof of
sending each edit to server. Finishing validation must reassess errors/changes,
not force green. Warnings differ from blocking errors.

Future tests: exact sequence; clean Data with invalid editor; nonempty history
with no net changes; multiple pending validations; isolated forms; stale replies;
Source disposal and DOM detachment. §055 subsequently confirms invalid current values in form Data. Concrete API, history grouping/replay/save and pending appearance remain
open. Documentation only; no runtime implementation or new verification claim.


<a id="gc-380-055"></a>
## 055 · Current form Data and legacy parity — approved 2026-10-29

Owner: “Sì, come nel legacy: nei Data va il valore corrente anche se non valido,
l’errore sta nel registro della form e impedisce il salvataggio. Il valore
precedente resta nel registro delle modifiche.” Owner also requires legacy
business logic to find analogous behavior although code may need adaptation.
Constitution 11.95 records this scoped supersession of accepted-Data policy.

Inside forms, Data holds current values even when validation rejects them;
Source-owned registers keep previous values/changes, errors and pending checks.
Errors and pending checks block save. Clearing required mario puts the empty
current value in Data, keeps mario as baseline, produces field error/red LED.
No new empty-string/null normalization is inferred. Returning to valid mario
clears error/net difference, green when checks finish; history may remain.
Outside-form policy unchanged. Incomplete/unparseable typed drafts remain a
separate open contract; no fabricated typed values or implicit coercion.

Reuse shared writer/validation/bindings/Source lifetime; no Logic state. Preserve
legacy observable Data visibility, transformations, callback order, pending state,
change tracking and save gating. Explicitly review intentional deviations; no
Dojo compatibility layer, aliases or defect copying implied. Server validation,
authorization, concurrency/save payload remain separate responsibilities.
Regression gates: invalid value in Data/bindings; Source previous/error records;
error/pending save blocking; mario sequence; outside-form behavior; isolated forms;
no stale async overwrite/error clearing. Design documentation only, not runtime
implementation or tested delivery of the new semantics.


<a id="gc-380-060"></a>
## 060 · First local form tranche — 2026-10-29

Owner confirms: “Sì, teniamo il testo incompleto nel Source e l’ultimo valore
tipizzato nei Data, bloccando il salvataggio. Aggiorna il contratto e procedi con
la prima tranche delle form, con test e un esempio nella gallery.” This supersedes
the open parsing decision above. See constitution `gc-000-form-drafts`; the earlier
study's 11.95 number collided with another worktree amendment and is not reused.

A Source scope marked `form=True` or `formId` owns `node.formState`. Descendants
resolve that same proxy by Source ancestry, independently of DOM placement.
`registers` is a Bag attached to that Source-owned object: `baseline`, `changes`,
`errors`, `pending`, `drafts`, and the last published `status` summary. The field's
`formDraft` contains unfinished editor text. No register is stored on Logic.

- Initial baseline: the record Bag after Source defaults, before field editing.
- Parsed candidates enter Data even on a validation error. Outside a form the
  existing accepted-value policy is unchanged.
- Unparseable number/date text remains in Source. Data retains the previous typed
  value. Errors, unfinished drafts and pending validations prevent acceptance.
- Net changes retain the original baseline value, current value and existence
  flags, using relative paths. Returning to the baseline removes the change.
- `status` reports `dirty`, `valid`, `pending`, `canSave` and `status`
  (`ok`, `changed`, `error`, `pending`). `formStatus` publishes this summary on
  the form's existing self-topic. Keep any UI projection outside the record Bag.
- `accept()` flushes mounted field drafts and returns false if a check is pending
  or any draft/error remains. Otherwise it accepts a local snapshot and returns
  true. **It performs no server write and is not a remote save acknowledgement.**
- `restore()` restores the accepted Data snapshot and revalidates fields. It
  updates existing controls and leaves their DOM/Source instances in place.
- Lifecycle cleanup removes field errors and pending records. Validation epochs
  prevent late results from overwriting a newer candidate. Relative bindings and
  the form's Data subscription follow Source datapath changes.

First qualification covers the existing Gramlot input components, scoped record
Bags, local acceptance/restore and asynchronous field validation. It is not a
complete form store system. Native HTML field validation, nested/overlapping form
transactions, grid editor flushing, undo/redo, server persistence/concurrency,
record CRUD and Invoice remain outside this increment. Native HTML controls keep
their existing ControlAdapter semantics; do not mistake their HTML form tag for
this validation lifecycle. Field-only numeric parser policies are unchanged.

Gallery: `01-inputs/07-forms_and_validation/05-form_state`, Python and JavaScript,
with `_data.tytx`. Existing field-only validation lessons remain unchanged so the
inside/outside-form distinction can be compared.


<a id="gc-380-065"></a>
## 065 · Shared local form/grid session — 2026-11-01

Owner: “sì procedi con il meccanismo comune di editing per form e grid, senza
 duplicazioni e senza collegare ancora il db. verifica che la form continui a
 funzionare e che scrollando non si perdano bozze ed errori della grid”.

Implemented in the development worktree, awaiting owner acceptance. EditingSession
replaces the form-specific implementation; node.formState remains the Source
accessor. Form fields and resident grid editors use the same ControlAdapter,
FieldState and validation engine. A grid under a form must bind data inside that
form scope and shares its session; a standalone editable grid owns a session at
its storepath. A changed active standalone storepath is rejected. Replacement
of the Bag at the same path remains supported. No parallel grid change journal,
validation engine, working-data copy or persistence handler is created.

The common load(Bag) operation copies supplied local data into the scope and
establishes its baseline. accept() flushes mounted drafts, refuses errors, pending
checks or suspended incomplete text, and accepts a local snapshot. restore()
restores the shared baseline and clears suspended drafts. None of these methods
performs a server write. Real save acknowledgement, partial save scopes, conflicts,
autosave and row traffic lights remain Asqueel–Kajenn integration work.

Field register keys use absolute Data pointers (including ?attribute). Validation
contributions also distinguish Source declarations so a second, more permissive
control cannot clear another control's error. Form fields retain their existing
removal semantics; retainField/releaseField keep grid field state independent of
temporary control lifetime. GridCellEditor owns only Source-control mounting,
positioning and navigation. It mounts an ordinary Source input in a stable slot,
removes it when its cell leaves the viewport, and restores incomplete text and
errors on reopening. Clean editor references are released; hidden rows do not
retain one DOM control per cell. Removed rows release retained field state.

Column edit=True chooses a typed existing input; edit=dict(tag=..., validate_*=...)
configures that input. Double-click, Enter or F2 opens a cell. Enter confirms;
Tab/Shift+Tab confirms and moves in current view order; multiline Enter remains
text, with Ctrl/Cmd+Enter confirming. Escape discards unfinished text, not already
committed working Data. Typed invalid values remain in working Data and block
acceptance, exactly as in forms. Grid editing requires resident Bags; windowInfo
selections remain read-only. A DHZ column needs an explicitly supported editor;
there is no implicit datetime-to-text coercion.

Net changes reconcile only the affected subtree. Changes retain previous/current
values and attributes, including insertion/deletion identity. Initial snapshots
and explicit load/accept/restore still copy the whole local scope. Validation
continues to be field-driven, not a new whole-dataset schema-validation service.
The session owns each started validation through ValidationRun, independently of
mounted adapters. A grid field keeps its real Source declaration while its view
is unmounted: callbacks retain their original scope and activated-code rules,
without retaining a hidden widget. Completion updates Data, pending and errors
without reopening the cell; reopening attaches to the same request/result.
New candidates, external Data or rule changes, row removal/replacement,
load/restore and disposal invalidate obsolete work. Timeouts and typed result
checks also operate without a view. Ordinary form fields use this same mechanism;
standalone inputs share the pure execution lifecycle. This is not whole-selection
schema validation or undo/redo. The previously reported requirement to reopen a
cancelled check was explicitly rejected and superseded by the owner on 2026-11-01
(GC-000 session-validation-20261101).

Verification: shared form tests plus grid integration tests cover values and
attributes, 1,000 resident rows, real editor disposal, incomplete drafts, invalid
values, independent validation contributions, attribute originals, local load,
restore, row removal, Tab/Escape, incremental reconciliation and async completion
without a view, stale-response cancellation, timeout and rule invalidation. Python authoring and actual prepared bundles are checked. The browser
fixture tests Chromium and WebKit with variable-height rows and bounded DOM rows.


<a id="gc-380-070"></a>
## 070 · Shared reports and field navigation — 2026-11-01

Owner request: GC-000 editing-reports-20261101. `editingStatus` in the inputs
collection reads the nearest Source `formState`. `errorEntries` projects one
message entry per absolute Data field; `changeEntries` projects existing baseline
changes, including individual changed attributes. No additional history Bag is
created. PoC `GridStatus` is behavioral evidence for outstanding changes rather
than an event journal. Form and grid changes share local accept/restore semantics.

`focusField(path)` first uses a mounted field adapter, then a registered grid
navigator; navigator cleanup follows grid connection/disposal. Grid navigation
uses the current collection view and row-layout geometry, releases end-pinning,
and reveals the destination column before opening the ordinary Source editor.
Filtered-out and removed rows remain unavailable without resetting the filter.
Reports subscribe to session notifications and release subscriptions on removal.
They do not acquire validation ownership or keep hidden editors alive.

Owner confirmed PoC arrow behavior: Up/Down navigate the same editable column,
including invalid/pending fields, without waiting for asynchronous validation.
Tab/Shift+Tab retains its existing behavior. As amended by owner confirmation
GC-000 grid-caret-boundaries-20261101, Left/Right navigates editable cells only
when the text selection is collapsed at the beginning/end. Inside text or with
a selection, caret behavior remains native. Multiline, date/time
and choice controls retain their own arrow behavior. DB writes, autosave, audit
persistence and undo/redo remain outside this tranche.
