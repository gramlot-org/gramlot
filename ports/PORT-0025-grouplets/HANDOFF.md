# Grouplet implementation handoff for a separate worktree

> **Implemented base collection, 2026-10-28:** [GC-360 §065](../../docs/future/360-grouplets-implementation-plan.md#gc-360-065) records the authorized first increment, usage and checks. Earlier planning checkpoints below remain historical.

> **Current owner direction, 2026-10-28:** include saved grouplets and loading options in Kajenn resource integration from P1. The earlier deferral proposal was not approved; see [current contract](P1-CONTRACT.md) and [GC-360 §060](../../docs/future/360-grouplets-implementation-plan.md#gc-360-060).

> **P0 completed, 2026-10-28:** see [current plan §055](../../docs/future/360-grouplets-implementation-plan.md#gc-360-055) and the [first contract proposal](P1-CONTRACT.md). This worktree is ready. Earlier setup instructions below are historical preparation context; do not create another worktree. Original remote assumptions were corrected to current 11.85.

This is a **planning handoff**, not an instruction to implement an unapproved API.
The owner subsequently authorized implementation; the base collection is implemented (GC-360 §065). Earlier preparation instructions below are historical.

## Read first

1. The destination's AGENTS.md, current constitution, overview and ports/README.md.
2. Paired GC-360 and this port README; GC-225 for names and GC-230 for transport.
3. GC-070 current status, the archived collection-store research, the archived current-formula discussion,
   the archived updated grid evidence and the associated the separate grid/store workstream discussion.
4. `evidence/RESEARCH-INDEX.md`, then relevant immutable source and historical notes.

## Baseline and transfer

Create/reuse the user-requested separate worktree only at implementation start,
using a verified development baseline. The inspected core had pre-existing working
changes; the recorded HEAD is not a complete source baseline. Compare
`evidence/gramlot-baseline.json` with current accepted work and bring only required
increments. Do not overwrite unrelated work or copy the whole dirty tree.

The dossier is self-contained for source recovery: transfer `ports/PORT-0025-grouplets/`
and both `docs/future/360-grouplets-implementation-plan.md` and its `docs_llm` mirror.
Carry the corresponding GC-070 entry by its anchor, not by replacing the status
file. Preserve any newer entries and current constitution. The optional delivery
archive under `temp/grouplets-worktree-handoff.tar.gz` contains the dossier and
paired plan, not the core runtime or all pending work.

Run the evidence verifier from the receiving repository root:

```sh
python3 ports/PORT-0025-grouplets/verify_evidence.py
```

For an isolated legacy JS replay, extract `evidence/legacy-sources.tar.gz` into
a temporary directory. From its `genropy/` directory:

```sh
node --test gnrjs/tests/grouplet*.test.js \
  gnrjs/tests/wizard_save_paths.test.js \
  gnrjs/tests/item_formstore_record.test.js \
  gnrjs/tests/memory_store_writeback.test.js \
  gnrjs/tests/remote_content_reentry.test.js \
  gnrjs/tests/form_torn_down_field.test.js
```

Expected research receipt: 188 passing tests. These VM/unit tests do not replace
browser or host checks. Python tests need a correctly provisioned full legacy
environment; the selective archive is not a complete Python installation.

## Historical first-decision checklist and stop conditions

The base collection is now authorized and implemented (GC-360 §065); do not repeat
its approval question. Apply the remaining checklist only to unresolved scope.

Present D1: a basic reusable resource fragment with explicit Data, two isolated
instances, reactive resource parameters and deterministic teardown, with form/grid
composition deferred. Ask one decision at a time and record exact confirmation.
Do not ask again if the owner has since supplied that decision.

Then settle resource host/registration, identity/dispatch and naming before P2.
Current 11.85 supports method pointers and public dotted paths; reuse NameSyntax and node.requests. Reuse typed
Source, Data Bags, named Logic, hooks, RPC and lifecycle. No arbitrary import paths,
new proxy/state machine/bus by default, compatibility aliases or silent store modes.
Any proven dependency gap is reported upstream, not patched in installed copies.

Form/card/wizard/grids must not create their own competing persistence/store
engine. Coordinate with the separate grid/store workstream and shared form work. Runtime examples belong
in gramlot-examples; core fixtures stay self-contained. No package publication,
deployment, new chat or unattended workflow is authorized by this handoff.
