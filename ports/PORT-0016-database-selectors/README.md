# PORT-0016-database-selectors

- Status: implemented and locally verified; owner visual review pending.
- PoC evidence: gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac,
  js/dom/src/collections/db-select.js and the September selector audits.
- Destination: current development checkout; not released.
- Owner approval: 2026-10-18, “OK, update the contract and proceed with dbSelect and
  dbComboBox on SQLite with SQLAlchemy, including method for dedicated endpoints.
  Add examples to the Python gallery and check the tests” (translated from Italian).

## Scope and destination review

GC-315 §050 is the bounded contract. Shared editor and RPC remain in core;
registered SQLAlchemy metadata, connections and the real SQLite examples belong
to the Python server integration. No generic store, dataRecord/dataSelection,
Genropy SQL parser or DB/grid validation is introduced. Existing callbackSelect
keeps its string-only code contract. Database selectors accept typed identities.
No Builder/Bag source was edited and no PoC implementation was bulk-copied.

## Verification and feedback

Meaningful checks cover zero/string keys, invalid drafts, free-text clearing,
selected output ordering, response races, removal, bound filters, asynchronous
validation cancellation, and autoSelect with a visible limit of one. Provider
checks cover literal search, case sensitivity, identity eligibility, projection
allowlists, SQL-looking input and key types. Python gallery browser verification
uses actual SQLite RPC. The original qualification was recorded as GC-070 §1425 in its source checkout.
Current combined verification and limits are recorded in
[GC-070 §1655](../../docs/internal/070-work-status.md#gc-070-1655).

Keep backend-specific examples in environment catalogs, not the portable examples
package. A search limit cannot establish candidate uniqueness; probe at least two
rows for autoSelect. Search cancellation and validation cancellation are separate
lifecycles and both must invalidate on eligibility changes. Ordinary selected
output writes do not promise a multi-path atomic Data transaction.


### Gallery recovery — 2026-10-29

Constitution 11.101 authorizes separate Base/Application galleries. The previously approved selector package is recovered on current develop; the existing full selector regressions are retained. Real Asqueel/SQLAlchemy/Django copies and read-only Invoice qualification are recorded in GC-315 §170 and GC-070 §2440. Physical model/application behavior limits remain explicit. This is implementation/verification evidence, not owner acceptance of the port or publication authorization.


2026-10-29 owner follow-up: direct auxColumns relation projection is implemented under constitution 11.103 and GC-315 §175. Native compiled Asqueel keys and metadata are used without model alias columns; shared rendering validates the declared response. Verification is recorded in GC-070 §2450. Full advanced-policy/legacy parity remains outside this increment.


## Model-resolved auxiliary correction — 2026-10-29

Asqueel now resolves auxColumns directly from its model at request time. The
caller does not register each auxiliary field or relation path first. Native
compiled result names remain authoritative, including nested relation aliases;
those names can be used by template and selected-field hidden projections in the
same request. Auxiliary metadata and projections are request-local: no request
mutates the registered selector or leaves fields available to later requests.
Duplicate output names representing different expressions are refused.

Only model field/path syntax is accepted, not client SQL expressions. Asqueel
compilation errors propagate unchanged to the RPC error envelope and the browser
shows the failure. An invalid field is not an empty successful query. Ordinary
registered projections, ordering/filter configuration and eligibility predicates
retain their existing behavior. SQLAlchemy/Django still use explicitly prepared
projections and reject unsupported paths; no cross-provider relation translation
was introduced. This supersedes the per-auxiliary-field registration restriction
in GC-315 §175 and GC-070 §2450, per constitution 11.104.

The Base and Application service registrations no longer list @state.name. The
same Python pages request it through auxColumns. Implementation is in the two
invoice-galleries adapter worktrees; the current component baseline is in
invoice-galleries/runtime/gramlot. No frontend runtime change was needed for this
correction; an explicit native-error regression was added for both controls.
The older database-selector-package worktrees were left intact.

Verification: 56 focused Base Python tests pass, including 35 Asqueel/RPC and
auxiliary cases; the same 35 Asqueel cases pass from the Application worktree.
47 JavaScript selector/choice tests pass. Real PostgreSQL reads compare all 3,200
customer relation values against an independent LEFT JOIN in both Base and
Application, without relation registration. Base's native-model verification and
17 selector cases pass. Application lookup and missing-field propagation pass.
No data/schema or dependency source was changed. Broader legacy behavior and
visual acceptance remain separate from this bounded correction.

Final runtime verification: Base/Kajenn on port 61401 and Application/Kajenn on
61404 were restarted with the corrected provider and without @state.name in
registration. The browser verifies Base search, state output and dbComboBox
Enter/Tab free text, plus Application search/template/state output. SQLAlchemy
and Django servers were left running unchanged. No runtime rebuild was needed:
this increment changes Python provider behavior and adds a frontend error test,
not JavaScript runtime code. Both adapter documentation identity checks and both
Sphinx views pass. Component/provider responsibility is retained here; gallery
pages/models/dataset work remains in the dedicated gallery chat. No merge,
publication, dependency edit or owner visual acceptance is claimed.
