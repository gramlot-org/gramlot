# PORT-0011-formlet-group-box

- Status: review corrections verified locally on 2026-10-17; owner acceptance pending.
- PoC revision: `10478b57ce3f22e6445eb6b72eba343520cbebac`.
- Legacy revision: `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`.
- Evidence: gramlot-poc js/dom/src/collections/layout/formlet.js and group-box.js,
  recipe-policies.js; GenroPy gnrpy/gnr/web/gnrwebstruct/base.py formlet and
  formbuilder_formlet, gnrjs/gnr_d11/js/genro_widgets.js labledbox.
- Owner confirmation (2026-10-17): “ok TYTX di default e menu per scegliere JSON.
  procedi con formlet, groupBox con copia e checkbox in modalità switch, con
  esempi compatti nella gallery”.
- Destination: development work, not published.

## Contract and destination review

GC-105 §085 and GC-245 §105 describe the bounded port. Reimplemented using the
existing component registry, portable dtype grammar, Source projection, Data and
Labelbox. Container sub_tags is supported in Gramlot's collection export, without
modifying Builders. Group copy is TYTX by default, unlike the PoC's JSON default.
JSON is explicitly values-only. No PoC runtime or global recipe-policy registry
is imported; shared field presentation stays bounded to formlet ancestry.

Native switch is a checkbox variant, not a second boolean writer. Field drafts
must survive layout-only changes: the renderer's descendant presentation refresh
skips a control value write when the resolved Data value is unchanged. This is a
regression requirement for subsequent container ports.

## Exclusions

Legacy database table/formbuilder adapters, inherited field values/identities,
wrap layout, form-save/dirty-state services, drag/drop and paste are not ported.
Only reviewed lbl_*/box_* presentation defaults inherit. An explicit field setting
wins. Responsive layout uses col_min_width; fixed columns remain fixed.

## Verification

Core component tests cover Python→TYTX→JS nested construction, portable grammar,
scoped inheritance, nested and explicit overrides, reactive columns/styles,
control identity/focus/drafts, switch boolean binding/readonly, and copy of live
Data with typed values, node attributes and nested Bags. Browser verification
and final counts are recorded in GC-070 §1105.

## Adversarial review — 2026-10-17

The owner requested a search for duplication, non-parametric code, inconsistencies
and arbitrary constants before further component work. See
[review findings and reproductions](review-2026-10-17.md). Six defects were
reproduced despite all 47 targeted tests passing, with four additional structural
cleanup findings. Corrections and final verification are recorded in the review’s closing section. Reusable port feedback:
test presentation changes during uncommitted editing, theme-token overrides and
failure-to-success recovery; do not infer semantic capabilities from child grammar
or repeat parameter projection and ancestor expression evaluation.


Correction follow-up: owner authorized all R1–R10 fixes before further components.
The review's closing table and GC-070 §1115 record the completed corrections and
regression checks. The previous review remains historical evidence; no open item
from that bounded review is deferred. No publication or owner acceptance claimed.


Automatic label refinement — owner, 2026-10-17: formlet owns per-column intrinsic left-label sizing, reactive remeasurement and lifecycle cleanup; lbl_width is an explicit override. This supersedes gallery fixed-width alignment. Reusable feedback: framework layout defaults must demonstrate useful automatic behavior without presentation fixes in examples. Independent Python-first browser qualification covers real geometry, responsive columns, explicit widths, nested isolation and retained drafts/focus/Data.
