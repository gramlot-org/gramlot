# 380 · Forms and validation: legacy recovery and destination review

Document ID: **GC-380**. Investigation: **2026-10-29**.

**Recovery and comparison; Source-owned registers and save-indicator behavior approved in §050; current invalid values in form Data and legacy behavioral parity approved in §055. No form lifecycle implemented and no concrete new API approved.**
The owner requests recovering legacy and PoC forms/validation for transfer to
Gramlot. Existing field validation is the starting point, not something to replace.

<a id="gc-380-005"></a>
## 005 · Scope, provenance and limits

Owner request: “vorrei che recuperassi da legacy e poc tutta la parte felativa a
form e validazioni. in modo da farla arrivare a gramolot”. Earlier owner constraints
remain in force: state belongs to Source/Data, never Logic; moving DOM into a
floating must not change Source ownership; update controls through their APIs
without rebuilding them. Concrete new contracts still require owner confirmation.

The recovery is attached to the existing validation port as a separate
[dossier](../../ports/PORT-0013-input-validation/recovery-20261029/README.md).
It does not expand that port's historical acceptance to form persistence.

| Reference | Evidence |
| --- | --- |
| Updated legacy | `genropy/genropy@8ea63843fd11c4bd556869438ae289800c890db7`, HEAD retrieved on 2026-10-29; 40 selected files archived with hashes |
| Older local legacy | `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`; used to identify changes, not treated as the latest implementation |
| PoC | `gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`, actual inspected working files archived and hashed |
| Destination | Local working files fingerprinted in the dossier; HEAD alone does not reproduce the working tree |

The upstream recursive tree was complete (`truncated=false`). The retained path
search, selected runtime files, authoring examples and tests cover the central
form/validation implementation. This is **not** a claim to have inspected every
application-specific form, private repository, deleted branch or discussion.
Archived sources/notes are historical evidence, not maintained Gramlot APIs.

<a id="gc-380-010"></a>
## 010 · Three different responsibilities

1. **Layout:** labelbox, formlet, groupBox, frame regions and toolbars arrange
   controls. A formlet is not a transaction or a save service.
2. **Field editing and validation:** parse the candidate, normalize it, run rules,
   retain an invalid draft, display feedback and commit through the existing
   ControlAdapter. Gramlot already implements this layer for its input components.
3. **Form lifecycle:** associate fields with a Data scope, aggregate validity and
   pending edits, track changes, restore a baseline and coordinate load/save.
   This is the major missing portable layer in the inspected destination.

Gramlot already recognizes Source `formId` / `form=true` for semantic ownership
and radio-group isolation (`js/src/view/controls.js`). That is useful existing
machinery, but it is not a dirty tracker, validator summary or persistence service.
Neither an HTML form tag nor a groupBox supplies those missing responsibilities.

<a id="gc-380-015"></a>
## 015 · Recovered capability map

Legacy paths below are relative to the archived Genropy root. PoC paths under
`forms/` are relative to `js/dom/src/`. Presence in a prototype is not acceptance.

| Capability | Legacy evidence | PoC evidence / limits | Gramlot destination |
| --- | --- | --- | --- |
| Form layout and labels | `gnrwebstruct/formbuilder.py`; `base.py` formbuilder/formlet; widget label wrappers | Layout recipes, shared defaults, relative paths | Reuse existing labelbox/formlet/groupBox; no second wrapper |
| Semantic scope and field registration | `genro_frm.js` constructor, registerChild/unregisterChild | `forms/service.js` Source-owned registration; nested forms and overlapping Data scopes rejected | Reuse Source identity and existing form references; general field aggregation missing |
| Ordered field rules | `GnrValidator`, validationTags | `forms/validator.js` | Existing `validation.js` / `field-state.js`; see §020 |
| Parsing, null and rejected drafts | Widget write path plus validator | `forms/field.js`; invalid typed values enter the form Bag | Existing component parsing and accepted-Data policy; incompatible draft policy must be decided |
| Dependencies and async validation | Conditional rules, remote checks, pending validations | Explicit dependency signatures, cancellation, timeout, stale-result guards | Existing reactive parameters and cancellation; do not assume arbitrary cross-field reads are tracked |
| Validity summary and focus | invalidFields, formErrors, checkInvalidFields, focusFirstInvalidField | Aggregated errors/warnings/pending; summary and focus | General form summary/first-invalid navigation missing |
| Dirty tracking | triggerUPD/INS/DEL, changesLogger, getFormChanges | Typed snapshots compare nested Bags, attributes, order and scalar types | Missing general baseline/diff service; inspect Bag capabilities before designing one |
| Reset/revert | reset clears tracking/errors; reload restores through a store | restoreBaseline replaces with a detached copy | Must distinguish clearing tracking from restoring data; no ambiguous reset contract |
| Lock/read-only/protection | setLocked, protected paths, write/delete protection, parent lock | locked/readonly/disabled gate edits/save | Existing field flags; form-wide propagation and protected paths need a bounded design |
| Load/save concurrency | operation status, callbacks, pending changes, busy/save gates | AbortController/serial guards; detached saves retain later edits; load detects intervening writes | Missing form operation coordinator; reuse RPC and Source lifecycle |
| Form-level errors | setFormError and error Bags | Separate formErrors; persistenceError | State must be owned by Source/Data; notification policy remains outside this port |
| Memory/item/document/record stores | Base, Item, SubForm, Collection, Hierarchical; memory/RPC/document/recordCluster handlers | memory/item/collection/subform/hierarchical/record factory | Do not collapse form stores into collection stores; see §030 |
| New/delete/duplicate/navigation | newrecord, deleteItem, duplicateRecord, first/last/prev/next | Not a complete CRUD/navigation implementation | Later record/collection integration, not first GUI slice |
| Save/revert/lock/navigation toolbar | `resources/common/gnrcomponents/formhandler.py` slotbar methods | Source-bound form commands; partial composition | Compose existing menu/menuline commands and framePane, no parallel toolbar system |
| Active editors and grids | registerGridEditor, registerPendingEditor, commitPendingEditors | Flush field editor before save; no complete grid coordination | Later shared pending-editor contract, preserving editor instance and undo |
| Nested forms/grouplets | SubForm, Item over parent record, linkedForm, grid and iframe compositions | subform is only a subset adapter; nested ownership rejected | Coordinate with GC-350 and collection work; do not equate subset copy with nested forms |
| Convenience/application behavior | autosave/lazySave, keepable values, draft marker, clipboard/paste, permissions, prompts | Mostly absent | Retain in inventory; choose individually after foundational form behavior |

The full legacy `genro_frm.js`, Python formhandler/base/formbuilder, and examples
such as `formclientstore`, `formdocumentstore`, `formhandler_baggrid`,
`formhandler_selection`, `dynamicform` and `advanced_form` are in the dossier.

<a id="gc-380-020"></a>
## 020 · Validation parity and deliberate differences

Legacy rule order is `select`, `notnull`, `empty`, `case`, `len`, `min`, `max`,
`email`, `regex`, `call`, `gridnodup`, `nodup`, `exist`, `remote`.
Gramlot implements the same portable sequence without the three DB/grid rules;
it explicitly rejects their configuration instead of pretending to validate.

| Rule/facility | Inspected Gramlot behavior |
| --- | --- |
| select | Selection-capable control checks validity; not a generic database lookup |
| notnull | Rejects null/undefined/empty string; false, zero and whitespace are present |
| empty, case | Replacement and case transformations in the ordered pipeline |
| len | Exact length or min:max; configuration checked; optional empty skipped |
| min/max | Typed finite numbers, Decimal or matching Date values; no legacy coercion/rounding promise |
| email | Local format warning by default, configurable severity; no delivery guarantee |
| regex | Pattern with optional leading `!` negation |
| call, remote | Existing activated callbacks/RPC, async handling and obsolete-response rejection |
| Conditions/severity/messages | Per-rule conditions, warning/error messages and result codes |
| Exit hooks | Existing onAccept/onReject and remote result hook; do not duplicate execution |
| Returned Data changes | Checked patches through existing write handling; no mutation merely because a stale/rejected result contains data |
| nodup/exist/gridnodup | Deferred DB/grid integration; uniqueness enforcement also belongs on the server |

PORT-0013 and constitution §11.84 already approve the shared field engine and
last-accepted Data policy. The explicit owner decision in §055 and constitution 11.95 now changes this
policy inside forms; the outside-form policy is unchanged.

**Historical comparison, resolved for the future form by §055:** PoC `FormField.finish` writes a typed rejected
candidate whenever a field belongs to a form; its tests explicitly require that.
Gramlot `FieldState.validateCandidate` invokes the Data acceptance path only when
there is no blocking error. A future form must account for a visible invalid or
pending editor even when its Data still holds an earlier valid value. It must not
save that earlier value while silently ignoring the user's current draft.

PoC `validate_depends`, `blankIsNull`, its form ID requirements and its generated
`gnr-form` tag are evidence, not newly approved Gramlot parameters. The September
PoC implementation note also says string remote methods are rejected, whereas
the inspected validator now forwards them to RPC: source/tests take precedence.

Bag-level validation/formula ideas in [GC-335](335-bag-formulas-and-validation.md)
and [GC-340](340-bag-js-calculation-and-validation.md) remain a separate deferred
workstream. This recovery does not authorize dependency changes.

<a id="gc-380-025"></a>
## 025 · Newer legacy regressions that must not be lost

The October upstream differs materially from the local September checkout:

- Removing a field unregisters its errors; removing a Bag branch does not recreate
  deleted values while cleaning or propagating invalid-field metadata.
- Changes consisting only of nested deletions still enter the outgoing changes.
- RPC failure clears the busy/loading condition, retains unsaved edits and does
  not execute success handling. Legacy error envelopes/Dojo Deferreds are not a
  proposed transport contract for Gramlot.
- Pending editors can participate in dirty status and must prepare/commit before
  save/dismiss; a focused entry row must not create an endless commit loop.
- Item forms over parent records preserve change tracking and record identity;
  protected paths and exceptions follow the correct destination scope.
- Hidden formlet groups and rebuilt required controls have explicit regressions.

Source anchors in the updated `genro_frm.js`: protected paths ~342, pending editor
registration ~439, teardown ~496, RPC failure ~1012, deletion ~2110, status ~2284,
validator ~2504, store base ~2838, SubForm ~3451, Item ~3486, Collection ~3600.
Line numbers belong to the archived revision only.

<a id="gc-380-030"></a>
## 030 · Store and state ownership review

The PoC's six store names do not represent six equally complete implementations:

- **memory:** private detached snapshot; not durable persistence.
- **item:** copy a Data Bag and replace it on save.
- **hierarchical:** follows the item branch; no extra hierarchy implementation.
- **subform:** copy selected fields and merge them back; no coordinated nested
  form lifecycle.
- **collection:** edit an existing row by key; no general create/delete/navigation
  or off-page retrieval. Identity cannot be changed by the draft.
- **record:** RPC load/save with a key; no optimistic remote version protocol.

These findings agree with [GC-320 §070](320-grid-and-stores.md#gc-320-070).
A form's editable data and a collection's row model are distinct responsibilities.
Memory snapshot isolation is not a database transaction.

The PoC stores baseline, operation and persistence error on FormController, and
projects a summary into Data only when controllerPath is supplied. Its MemoryStore
also owns a private data copy. **Do not transplant that as the destination state
model.** For Gramlot, editable values stay in Data; the form Source node owns change,
error and pending-validation registers (§050), with relative field paths.
Baseline information for tracking belongs with the Source-owned form registers.
Logic remains behavior only.
Source-owned external objects may hold runtime resources (registrations, abort
controllers, subscriptions), but must not become a parallel application store.
Exact Bag shape/paths and whether any derived state is stored or computed remain
design decisions, not approved names in this report.

Reuse Source lifetime, existing field adapters, bindings, activated callbacks,
RPC and publish/subscribe. Detaching a panel moves DOM only; it must not unregister
the form or lose drafts, dirty state, editor focus/undo or bindings. No full Source
scan on every keystroke should be copied from the PoC without a justified design.

<a id="gc-380-035"></a>
## 035 · Proposed bounded transfers and acceptance cases

This is a proposed order, not a second approved execution plan.

| Slice | Deliverable | Required checks |
| --- | --- | --- |
| 1 · Portable form | Existing Source scope + registered fields; Source-owned registers/baseline; validity, pending edits, dirty, restore | Two forms at relocated datapaths; no shared state; invalid draft and pending validation block completion; nested insert/delete/type changes; revert clears dirty; remove invalid child; retain widget identity and detached DOM behavior |
| 2 · Local commit | Explicit load/apply/restore boundary using Bags; a compact Python-first example | Detached baseline; changes during save remain dirty; failed commit preserves draft; no ambiguity between clear tracking and restore; serialized state excludes runtime handles |
| 3 · Remote operations | Use existing RPC lifecycle, cancellation and callbacks | Older load cannot overwrite newer edits; busy clears after failure; deletion never succeeds on failure; no stale callback after Source disposal |
| 4 · Composition | FramePane/menu commands, pending editors, subforms/grouplets and collection navigation | Child validity/dirty aggregation; commit focused editor once; correct owner when DOM floats; refuse navigation without resolved dirty policy |
| 5 · Data integration | Existence/uniqueness, records, permissions, conflict/version protocol | Backend-owned checks, server revalidation and concurrent-write behavior; selectors remain in their separate review workstream |

Historical proposal, superseded by §055: the initial **invalid draft policy**
recommendation was to
retain Gramlot's existing accepted Data writes and have the form include editor
errors/pending state in its completion gate. The alternative is an explicitly
defined draft Bag that may contain typed invalid candidates, as in legacy/PoC;
that changes semantics and needs owner approval. Incomplete unparseable input
must never masquerade as a valid typed value in either option.

Then settle form authoring/identity, status and baseline ownership, validation
timing on initially loaded Data, hidden/read-only/removed field participation,
dynamic field inclusion, nesting and command/result names under GC-225. Later
slices need separate persistence/navigation decisions. No API spelling is approved
merely by appearing in a legacy example.

<a id="gc-380-040"></a>
## 040 · Verification and next step

Executed on 2026-10-29, with receipts in the dossier:

- Gramlot: validation-engine, input-validation and live-source-validation —
  **31 passed**, zero failed/skipped.
- PoC: forms, form-stores, remote-validation and formlet — **32 passed**, zero
  failed/skipped.
- Updated legacy: eight recovered form/layout/validation regression files —
  **89 passed**, zero failed/skipped, against the same archived upstream sources.

These are focused Node tests, including DOM emulation in the Gramlot/PoC suites
and isolated legacy harnesses. They are not browser/server qualification of a new
Gramlot form. No form runtime was changed, no old prototype was installed and no
release/deployment was performed. Full end-to-end legacy application testing,
backend persistence and private form integrations were not run.

Next: use the approved semantics in §050/§055 to define one small destination
contract and its regression cases before porting.

<a id="gc-380-045"></a>
## 045 · Previous values, change index and undo/redo — owner follow-up

Owner, 2026-10-29, asks to verify legacy previous-value tracking and proposes an
index of changes supporting form undo/redo and changes sent to the server. This
is a design direction; no journal schema, replay policy or transport format has
been approved. The invalid-draft decision discussed in §020 is now settled by §055.

Verified in the archived upstream `genro_frm.js`:

- `triggerUPD` stores the **first old value since the baseline** in the Data
  node's `_loadedValue` attribute. It is not overwritten with every previous edit.
- A separate controller Data Bag, `changesLogger`, retains net changes with
  `_dataPath`, `from`, `to` and presentation/permission metadata. Attribute changes
  can be logged as well. Returning to the baseline removes the net change and
  `_loadedValue` (using legacy loose/null-blank equality, not a proposed new rule).
- Insertion followed by deletion removes the insertion entry. Deleting an
  existing node records its path and removes child entries; that log entry alone
  does **not** retain the old subtree needed to undo deletion.
- `getFormChanges` does not simply serialize changesLogger. It walks the record
  cluster, using `_loadedValue`, the logger for nested Bag changes, record metadata,
  removed rows and grid changes. Scalar old values become typed `oldValue`;
  copied nested Bag values can carry `__old`. This is legacy server protocol,
  not a generic patch format to adopt unchanged.
- Widget `_doChangeInData` writes validation-error metadata and the candidate
  inside a form; outside a form it returns on a validation error. The legacy save
  gate normally refuses invalid forms, but has an explicit `allowSaveInvalid`
  escape hatch. Do not describe legacy rejection as an unconditional invariant.

An isolated probe using the archived upstream test fixture verifies: 120 → 121 →
122 keeps `_loadedValue=120` and one `from=120,to=122` entry; the outgoing record
contains `oldValue=120::L`; returning to 120 clears the entry; insert/delete cancels;
deleting a pre-existing value leaves a path without the deleted value. Receipt
and reproducible probe are in the dossier. This does not test a new Gramlot API.

**Tracking proposal, ownership updated by §050:** keep two complementary
representations attached to the form Source node, with paths relative to the form,
never mutable state on Logic. This supersedes the initial Data-owned register
proposal; edited field values remain in Data:

| Representation | Purpose | Example after 120 → 121 → 122 |
| --- | --- | --- |
| Operation history and cursor | Undo/redo each user operation | 120 → 121, then 121 → 122 |
| Net changes against acknowledged baseline | Dirty status, change review and save payload | 120 → 122 |

The net index can be derived/maintained from the same captured operations rather
than independently authored. It must not discard the history when a value returns
to baseline: the form can be clean while still having undoable actions. A new edit
after undo normally discards the redo branch; this and grouping policy need an
explicit contract. One user action may change multiple fields, so grouping by
user operation matters more than recording every keystroke independently.

For reversible insert/delete/attribute/Bag operations, preserve existence separately
from null, typed old/new values, relevant attributes and sibling position; removed
subtrees need detached snapshots. Capture mutations through existing Bag events;
first check their payload/transaction guarantees instead of patching Bag/Builders
or duplicating their implementation. Undo/redo writes through the same Data path
and bindings without recreating widgets and must not recursively record replay as
a fresh user edit. Derived/calculated changes, external updates and editor-local
undo require explicit boundaries so one action is neither lost nor counted twice.

A save sends the **net change set**, not the undo history. Failed save retains
the baseline and history. On successful asynchronous save, acknowledge the submitted
snapshot only: later edits must remain pending. Server conflict/version checks and
canonical returned values need a separate agreed integration contract; oldValue
alone does not guarantee concurrency safety. Keeping history across successful
saves versus opening a new undo boundary is also still open.

These requirements refine the planned baseline/change-tracking slice. No private
controller snapshot or independent undo state store is approved by this discussion.


<a id="gc-380-050"></a>
## 050 · Approved Source-owned registers and save indicator

Owner decisions, 2026-10-29:

- “terrei collegato al source node della form un registro dei cambiamenti con
  l'indicazione deol valore precedente. e u. registro errori”.
- “Sì, anche le validazioni in corso vanno tenute collegate alla form e devono
  impedire il salvataggio finché non finiscono. Aggiorna il progetto con i registri
  sul Source node”.
- The owner gives the sequence server name=mario → edit luigi (yellow save LED)
  → edit mario again (green) → clear a required name (invalid field, red LED).

**Confirmed ownership:** the form Source node owns its changes register (including
previous values), error register and pending-validation register. These follow
Source lifetime and remain attached when only DOM is moved into a floating.
Field values remain in the form Data scope. No form state on Logic or independent
application state store. References to form-owned Data registers in earlier
proposals are superseded; this clarifies the existing Source-or-Data ownership
principle rather than weakening it. Exact attachment names and record schemas
are still to be defined under GC-225.

**Confirmed behavior:** dirty means a net difference from the loaded/acknowledged
baseline, not “the user has edited something” and not “history is nonempty”.
Error state and validation-in-progress are separate from dirty. A blocking error
prevents save and takes precedence over clean/changed LED presentation. Pending
validations also prevent save; their completion must be accounted for before
save can become available. This does not authorize an automatic deferred save.

| Sequence (initial valid name is mario) | Net changes | Blocking field error | Pending | Indicator / save gate |
| --- | --- | --- | --- | --- |
| Initial server value mario | None | None | None | Green: valid and unchanged |
| User enters luigi, validation complete | mario → luigi | None | None | Yellow: valid changes available to save |
| User enters mario again, validation complete | None | None | None | Green again, even if undo history remains |
| User clears the required name | mario → empty current value (§055) | Required error | None | Invalid field and red LED; save blocked |
| Remote validation has not finished | Independent | Independent | Present | Save blocked; pending visual treatment remains open |
| Error and another pending validation coexist | Independent | Present | Present | Red for the error; save still blocked by both conditions |

Green means valid and unchanged, not that every attempted edit was sent to the
server. Returning to baseline removes the net change without requiring deletion
of undo history. The follow-up in §055 settles the empty-name case: Data holds the current
empty value, and the Source-owned error register blocks save. Warnings remain distinct from blocking
errors. Pending is not silently equated with a successful validation.

**Acceptance cases to implement later:** the exact mario/luigi/mario/empty sequence;
returning to baseline while history remains; two independent forms; required empty value in Data with a blocking error; multiple pending validations (finishing one does not
unblock the others); rejected/outdated replies; Source disposal and DOM-only
reparenting. A validation finishing may expose errors or remaining changes; it
must not merely force the indicator to green. Async completion and save concurrency
will reuse existing lifecycles; no new runtime code is part of this update.

**Subsequent decision:** §055 confirms current invalid values in form Data.
Pending indicator appearance, incomplete typed input, history grouping/replay/save
boundaries and concrete APIs remain open.


<a id="gc-380-055"></a>
## 055 · Approved current-value Data policy and legacy business behavior

Owner, 2026-10-29: “Sì, come nel legacy: nei Data va il valore corrente anche se
non valido, l’errore sta nel registro della form e impedisce il salvataggio. Il
valore precedente resta nel registro delle modifiche.” Also: “tutta la business
logic che abbiamo da riporatre dalle applicazioni legacy puo riadattare il codice
ma deve trovare comportamenti analoghi”. Recorded in constitution amendment 11.95.

This supersedes the accepted-Data proposal in §020/§035 **inside forms**:

- Current field values, including values rejected by validation, go into form Data.
- The form Source node owns changes/previous values, errors and pending validations.
- An error prevents save; validation in progress also prevents save.
- Business logic reading form Data must observe current values, not silently stale
  accepted values. Validation no longer means rejecting the form Data write.
- Clearing required name=mario updates Data to the current empty value, retains
  mario as the baseline in the change register, records the error and produces red.
  The decision does not specify empty-string/null normalization anew.
- Returning to valid mario removes the error and net difference, giving green
  once relevant validations finish; undo history may still exist.

Retain the existing shared writer, Source lifecycle and validation engine; no
parallel writes or state on Logic. The outside-form accepted-Data behavior is
not changed by this decision. Incomplete/unparseable numeric/date editor text
requires its own explicit contract; do not manufacture a typed value or store
raw text in a typed field without a decision.

**Port criterion:** preserve analogous observable behavior of legacy business
logic, allowing API/code adaptation. Review Data visibility, dependency updates,
validation transformations and ordering, accept/reject callbacks, async pending
state, baseline/net-change semantics and save gating against legacy examples.
Document and obtain owner decisions for intentional semantic differences. This
is behavioral parity, not a Dojo compatibility layer, unconditional alias support
or permission to copy defects. Server validation/authorization remains separate
from client GUI validation; save payloads and concurrency contracts remain open.

Regression requirements now include invalid current values visible in Data and
bindings; prior values retained in Source-owned changes; error/pending save gates;
exact mario/luigi/mario/empty sequence; outside-form behavior unchanged; independent
forms; stale async results never overwrite a newer value or clear its errors.
This update changes design documentation only; implementation and qualification
of the new form behavior have not started.


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
