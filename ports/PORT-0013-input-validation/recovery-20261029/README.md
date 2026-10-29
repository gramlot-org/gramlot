# Form and validation recovery — 2026-10-29

**Status: investigation complete; destination form lifecycle not implemented.**
This supplements PORT-0013's field-validation evidence. It does not extend its
historical approval to form persistence. Later owner decisions on registers and
current invalid values in form Data are recorded separately in GC-380 §050/§055.
Owner scope and proposed transfers: [GC-380](../../../docs/future/380-forms-and-validation-recovery.md).

## Evidence

- `legacy-sources.tar.gz`: 40 selected upstream sources/examples/tests/license,
  at `genropy/genropy@8ea63843fd11c4bd556869438ae289800c890db7`.
- `legacy-manifest.json`: exact archive paths, SHA-256, sizes and retrieval scope.
- `legacy-path-search.json`: 56 path-name matches from a complete upstream tree,
  excluding Dojo/legacy_packages. This is an index, not a full content census.
- `legacy-local-to-upstream.diff`: historical local genro_frm.js compared with
  the retrieved October implementation; host paths in its header are provenance.
- `poc-sources.tar.gz`, `poc-manifest.json`: 17 inspected working files including
  original notes, implementation, tests and license; HEAD plus file hashes.
- `gramlot-baseline.json`: actual destination working-file hashes, including
  unrelated existing local changes. This is not a public-release fingerprint.

Everything inside the source archives is a **Historical record** retained for
review. No legacy/PoC source was installed into the Gramlot runtime. Refer to
original licenses; the archive does not relicense imported material.

## Verification receipts

| Receipt | Command / environment | Result |
| --- | --- | --- |
| `gramlot-tests.log` | From core root: `node --test js/tests/validation-engine.test.js js/tests/input-validation.test.js js/tests/live-source-validation.test.js` | 31 pass |
| `poc-tests.log` | From PoC js/dom: `node --test tests/forms.test.js tests/form-stores.test.js tests/remote-validation.test.js tests/formlet.test.js` | 32 pass |
| `legacy-tests.log` | From extracted legacy archive: `node --test gnrjs/tests/*.test.js` | 89 pass |

Zero failures/skips in these runs. The extra archived PoC validation-authoring
suite was read as evidence, not included in the reported 32 tests. Legacy tests
use upstream isolated VM harnesses; Gramlot/PoC tests use installed dependencies
and DOM emulation. No new browser/server form behavior is certified.

Run `python3 verify_evidence.py` in this directory to verify the archive files
against their manifests. Legacy replay needs Node and the extracted archive only.

## Destination review

**Revision requested for a direct PoC transfer:** typed rejected drafts enter the
PoC form Bag, while current Gramlot preserves accepted Data; controller/private
memory snapshots cannot become parallel application state; full-Source scans and
legacy persistence/Dojo machinery must not be copied as destination mechanisms.
Use Source/Data state ownership and existing adapters/binding/RPC/lifecycle.
Owner subsequently approved invalid current values in form Data, with registers
on the form Source node (GC-380 §050/§055, constitution 11.95). The initial draft
policy objection is resolved by that scoped decision; runtime transfer still
requires Source-owned state and one bounded form contract. Concrete API names and later store integration are still open.

No repository runtime modification, dependency edit, release or deployment was
performed by this recovery. The selected archives do not cover every legacy
application, backend service, private branch or historical discussion.

## Previous-value follow-up

GC-380 §045 records the owner-requested change-index/undo analysis. Replay with
`node change-tracking-probe.cjs /path/to/extracted/legacy` against the archived
sources. `change-tracking-probe.log` records baseline preservation, net-change
coalescing, typed outgoing oldValue, return-to-baseline and insertion/deletion.
The probe reuses the upstream Item-form fixture; it does not implement undo/redo.
