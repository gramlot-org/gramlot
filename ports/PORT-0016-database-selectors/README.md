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
