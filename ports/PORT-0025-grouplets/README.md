# PORT-0025-grouplets

> **Implemented base collection, 2026-10-28:** [GC-360 §065](../../docs/future/360-grouplets-implementation-plan.md#gc-360-065) records the authorized first increment, usage and checks. Earlier planning checkpoints below remain historical.

> **Current owner direction, 2026-10-28:** include saved grouplets and loading options in Kajenn resource integration from P1. The earlier deferral proposal was not approved; see [current contract](P1-CONTRACT.md) and [GC-360 §060](../../docs/future/360-grouplets-implementation-plan.md#gc-360-060).

> **P0 completed, 2026-10-28:** see [current plan §055](../../docs/future/360-grouplets-implementation-plan.md#gc-360-055) and the [first contract proposal](P1-CONTRACT.md). This worktree is ready. Earlier setup instructions below are historical preparation context; do not create another worktree. Original remote assumptions were corrected to current 11.85.

- **Status:** P0 complete; base grouplet and first card increment implemented and locally verified; owner acceptance, remaining compositions and resource integration pending.
- **Owner scope, 2026-10-28:** recover legacy grouplet material and prepare a Gramlot
  implementation plan for a different worktree. Exact request: GC-360 §005.
- **Legacy reference:** `genropy/genropy@a135c9d949d0b014a22f57c418e83b315f85e7bf`.
- **Historical PoC:** `gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`;
  the retained notes are working-file evidence, separately checksummed.
- **Destination baseline:** `evidence/gramlot-baseline.json` fingerprints inspected
  working files. This is not an accepted destination revision.
- **Constitution checked:** §§1,3–7,9–10,12–14; 11.43,11.56,the current 11.85–11.87;
  current host/database boundaries (§§7–8) do not authorize a new grouplet catalogue.

## Card increment

Owner confirms the first card slice and complete gallery case; see
[card contract](CARD-CONTRACT.md) and [qualification](verification/card-qualification.md).
The 20 archived JS card regressions pass. Gramlot implements the agreed header,
Data-bound fold/check state and static/remote/nested content. The order-review
lesson is g04. The Python Builder's union validator gap remains visible in three
strict expected failures; the browser rejects invalid states. No upstream edit.

## Gallery increment

Three base cases are implemented and browser-verified in the connected examples
worktree. See [GC-360 §070](../../docs/future/360-grouplets-implementation-plan.md#gc-360-070).
The owner requested incremental delivery with explicit @source gallery examples.
The initial sparse lessons were then rejected as insufficiently informative and
rewritten as complete customer, order-address and service-visit scenarios; see
[GC-360 §075](../../docs/future/360-grouplets-implementation-plan.md#gc-360-075)
and the [revision receipt](verification/gallery-revision.md).

## Plan and handoff

[Expanded plan GC-360](../../docs/future/360-grouplets-implementation-plan.md),
[concise plan](../../docs_llm/future/360-grouplets-implementation-plan.md),
[receiving-worktree brief](HANDOFF.md), [research index](evidence/RESEARCH-INDEX.md),
[source catalogue](evidence/SOURCE-INDEX.md).

## Recovered evidence

196 matching upstream files plus runtime dependencies/license (226 archived files),
all 74 results of the GitHub issue/PR search, 45 conversation and 36 inline review
comments, 247 indexed commits, two historical branch designs, six PoC notes/cards,
39 secondary local/archive references and one relevant meeting-summary extract.
The September-based local legacy checkout is also preserved as a separate
135-file archive with actual working-file hashes.
The index states coverage and exclusions. This is a transferable source dossier,
not a bulk implementation port. Exact revisions are historical evidence, not pins.

## Proposed scope and prerequisites

First slice: reusable resource fragments, explicit Data context, two isolated
instances, deterministic remote lifetime and teardown. Resource catalogue/host,
identity/dispatch, concrete declarations and loading policy require owner decisions.
Then compose topics/cards, shared forms, panels/chunks, wizard/choice and grids.
Form and collection lifecycle must be shared with their owning workstreams.
Current formula direction follows the separate grid/store research; no new Bag JS engine.
Record/DB/resource-host integration requires its own bounded approval.

## Verification

Exact-source JS regressions: **188 passed, zero failed/skipped**. Logs retained.
Python card/panel suites stopped during collection: `ModuleNotFoundError: unidecode`.
No browser, DB, complete legacy-suite or Gramlot runtime qualification is claimed.
Use `python3 ports/PORT-0025-grouplets/verify_evidence.py` to verify portable archive
contents and evidence checksums. Paired document links/anchors and existing public
documentation checks are part of this delivery.

## Destination review

- **Result:** base collection locally verified and ready for owner review; no acceptance claimed.
- **Owner decisions:** independent component collection implementation authorized; base component implemented, owner acceptance pending; resource API remains open.
- **Constitution conflict:** none in preparing this dossier. Directly copying
  Genropy/Dojo/mixin machinery, private Bag mutation, stub/fallback store modes or
  host/DB dependencies into core would conflict with §§3,7,13–14.
- **Open:** GC-360 D1–D8; missing complete legacy Python environment; broader host qualification;
  composed-family scope, resource contract and owner acceptance after the first increment in the prepared worktree.

## Feedback for later ports

Use the current upstream revision: September notes miss October cards, temporary
rows, navigation and save fixes. Treat issue state, branch designs and AI summaries
as evidence, not authority or implementation proof. Catalogue filtering does not
replace direct-call authorization. Data paths alone do not isolate methods/state.
Reuse current Source, Logic, RPC and stores before adding abstractions. Keep legacy
regressions and deliberate incompatibilities traceable per accepted increment.


Owner feedback for later increments (2026-10-28): a minimal remote fragment does
not adequately explain the purpose of a grouplet. Start from the corresponding
legacy test pages/resources, give the lesson a concrete user task with complete
fields and realistic Data, and verify observable edits/reloads and isolation.
Keep required @source methods visible. Do not present ordinary styled panels as
unimplemented card/form families. The first sparse examples are superseded;
passing runtime checks did not constitute owner acceptance of their usefulness.


Menu/Clear increment, 2026-10-28: owner explicitly confirms ordinary card.menu()
and menuline authoring, Data-bound delitem and confirmed scoped clearing. The
implementation reuses shared menus, AskDialog and Source/Data writes; complete
gallery g05 covers shipping management and the invoice lock. See
[CARD-CONTRACT.md](CARD-CONTRACT.md) and the qualification receipt. UI acceptance
remains with the owner; documentation/form integration and saved resources remain
future increments.


Inline-guide increment, 2026-10-28: owner explicitly chooses the first card-local
guide. Data-bound Markdown doc, accessible header button and popup are implemented
and locally verified with complete gallery g06. Shared document addresses, notes,
languages/permissions and Kajenn resource integration remain a distinct future
contract by owner choice. See CARD-CONTRACT.md and the qualification receipt.


Form integration, 2026-10-28: legacy research and three focused JS baseline checks
are complete. Owner explicitly defers the card increment until Gramlot supplies
the shared form manager. Neither a field-error-only alternative nor a private form
engine is started. The complete gallery case remains part of the resumed increment.
See [CARD-FORM-RESEARCH.md](CARD-FORM-RESEARCH.md) for the decision and evidence.
