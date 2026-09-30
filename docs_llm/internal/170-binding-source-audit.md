# 170 · Binding source audit and decision provenance

> **Historical reference — superseded for execution on 2026-09-25:**
> [GC-210](210-binding-contract.md) records the owner-confirmed 0.2.0 contract
> and phase plan; [GC-070 §490](070-work-status.md#gc-070-490) records current work.
> GC-175 is a historical handoff, not the current checkpoint. The body below
> preserves earlier proposals, observations and dated evidence; its pause/next-step
> language is historical. Legacy data/path quotations do not define the new API.
> Source provenance rules remain valid and do not reopen later owner decisions.

Document ID: **GC-170**. Date: **2026-09-24**.
Status: preventive audit completed for the binding planning sources; implementation
paused pending review of the corrected basis. This is not an audit of all PoC docs.

[Paired version](../../docs/internal/170-binding-source-audit.md).

<a id="gc-170-005"></a>
## 005 · Authority and use of sources

The owner explicitly requests checking the documents used before they contaminate
the implementation. The owner also rejects the historical manual's segmented-Data
explanation as a design reference and allows discussing differences from legacy.

| Source | What it can establish | What it cannot establish |
| --- | --- | --- |
| Current owner messages and core constitution with subsequent amendments | Current direction, boundaries and decisions | Unstated detailed runtime contracts |
| Archived original user messages, with role/date/context | A historical instruction in its original scope | Automatic current approval of all surrounding assistant suggestions |
| Dependency documentation plus executable public-API tests | Declared API and observed behavior at a specified version | That every difference from legacy is a defect |
| Legacy/PoC code and tests | Observed behavior and regression evidence in that checkout | Product acceptance or owner authorization |
| PoC decision register and conversation summaries | Index into possible decisions | Independent proof of the owner wording or continued applicability |
| Historical manuals | Description of a past implementation | Current architecture, accepted contract or release requirement |
| Agent reports, GC-155/160/165 | Analysis, proposals and evidence locations | Independent authority; agreement between reports does not validate their common source |

For each implementation-driving claim record the source, speaker if conversational,
date/revision, scope, verification and one status: current decision, observed fact,
proposal, unresolved, or rejected/superseded. Keep these statuses separate. A failing
legacy-compatibility assertion is not automatically a dependency regression.

<a id="gc-170-010"></a>
## 010 · Sources reviewed

Reviewed GC-155 and GC-165 end to end; GC-160 and PORT-0005's consolidated recovery;
pointer, reactivity, writeback, SourceNode, logic, timer and lifecycle reports;
initialization/projection reports and diagnostic contract claims. Checked implicated
PoC historical manuals, decision-register sections and original conversation records.
The core constitution/overview/port protocol remain the governing reference.

Original local archive: gramlot-poc/temp/conversations-2026-09-08, first-pages.md
and corresponding JSON. Its manifest identifies task 01a070d8-8319-7d53-96aa-2996546bdd77.
All five archived JSON files match their manifest SHA-256 values. This checks local
archive integrity, not external certification or whether the archive is exhaustive.
The archive is ignored/local; do not publish whole conversations to document one fact.

Relevant imported PoC code first appears in this checkout at dd1aec3a (2026-09-09).
That is an import point, not proof of original authorship or approval. The inspected
legacy JS files gnrdomsource.js, genro_src.js, gnrbag.js and gnrlang.js have no local
tracked modifications at audit time. Their checkout is still a specific integration
revision, not a guarantee of all historical GenroPy behavior.

<a id="gc-170-015"></a>
## 015 · Confirmed contamination and corrections

| Claim previously carried into planning | Evidence and corrected classification | Action |
| --- | --- | --- |
| Per-builder Data segments/volume:path are a model to preserve or explicitly remove | PoC code does implement this. Original assistant messages 39–41 (2026-09-05) explicitly retain the old JS API temporarily and leave flat-path alignment open. No owner adoption is established by that exchange | Exclude segmented Data and volume syntax from requirements; keep historical observation only. Do not claim the replacement model has already been accepted |
| Historical manual documents an approved design | Historical 01-architecture:92 and 03-runtime:77 describe runtime segmentation; documentation is not approval. Current owner says that account is wrong as design guidance | Do not use these passages to determine architecture; preserve provenance rather than silently rewriting the external archive |
| Bag must change for quiet PUT | Direct public setItem with doTrigger=false writes silently; Builder PUT supplies reason=false instead | No Bag defect established; define Gramlot specialization using the available API |
| Missing fired event flag / == support prove dependency defects | Bag documents reset behavior, not that payload field; generic Builder documents ^/= and static evaluation | Compatibility differences / Gramlot design work, not upstream bugs by default |
| Generic Builder exclusively owns all expressions and SourceNode extensions | Current owner explicitly allows specialization of Python/JS base classes | Correct ownership in active plans; no blanket upstream-write gate |
| setup(data) and root.data in PoC mandate both public APIs and a new wire payload | Host invokes Page.main, not Builder.create; Page has no setup hook. PoC has a GUI alias and generic HTML has native data | Observations only; authoring/initialization contract remains open, no inferred payload or alias |
| Legacy implementation details are mandatory in every first release | Owner permits differences after discussion; code evidence does not independently fix release scope | Mark acceptance cases as proposals until selected; preserve explicit current SourceNode/formula/controller/delay scope |
| Seven failing legacy comparisons show seven semantic defects | All stop in adapter construction at _nodes.splice | Semantic comparisons remain unverified; do not use their failure as architecture evidence |
| All observed cleanup/order must be copied | Legacy LIFO and cleanup differ from core's approved Source FIFO/freeze and some timer cleanup is unproven | Retain approved core contract; discuss Data/provider order and cleanup separately |

A concrete API anomaly remains: symbolic #FORM/#ANCHOR/#id resolution loses
?attribute while equivalent direct reads preserve it. Three public-API tests
reproduce it; [Builder JS issue #1](https://github.com/genropy/genro-builders-js/issues/1)
contains the complete test. This is separate from the compatibility comparisons.

<a id="gc-170-020"></a>
## 020 · Original conversation evidence

first-pages original records, roles preserved:

- Message 29, user, 2026-09-05 10:43 UTC: asks to analyze potentially older JS
  versions. Does not approve segmented Data.
- Messages 33 and 39–41, assistant, same date: describe older JS segments versus
  Python paths, retain the JS API for the first bounded fix, and leave alignment
  and initial Data loading unresolved. These are assistant status statements.
- Message 34, user: confirms reactivity leaves Python and remains in the browser.
  This approval must not be expanded into approval of the assistant's full table.
- Message 42, user: requests an explanation of the unclear term flat datastore;
  asking for an explanation is not selecting a design.
- Message 987, user, 2026-09-07 07:56 UTC: suggests page-owned Data passed/proxied
  to Builder and asks whether it makes sense. This is a proposal/question, not
  a final wire/namespace contract. Message 989 discusses page-register state in
  the sticky-worker scenario; it does not approve such server persistence for
  the current browser binding slice.

No claim is made that all later conversations have been searched exhaustively.
The evidence is sufficient to invalidate using the historical manual as approval;
it is not sufficient to infer an unspoken final Data model.

<a id="gc-170-025"></a>
## 025 · Safe implementation basis and remaining review

Current owner direction reliably establishes: SourceNode-centred behavior;
relative/symbolic Data access and GET/SET/PUT/FIRE; formula/controller/delayed
operations in the initial design; maintainability; use/specialization of existing
Python/JS Builder bases; dependency defects demonstrated by tests and issues;
and discussion of legacy differences before accepting them.

Retain core SourceBag/SourceBagNode, server independence, Python-first teaching,
paired docs and ownership/lifecycle constraints. The resolved projection fix has
97 passing core JS tests and is independent of the disputed Data segmentation.
It does not implement a namespace, Data subscriptions or provider semantics.

Not settled by this audit: exact Data ownership/address model; initialization
and host delivery; provider grammar/startup; macro surface; detailed control
conversion/timing; selected legacy-only symbolic contexts. These are concrete
review topics, not permission to adopt PoC defaults or omit functionality silently.

Before resuming a work package, cite its current decision basis, APIs used and
unresolved choices. Resolve the choices with the owner one at a time. Agent reports
must label recommendations as proposals and must not cite another report as sole
proof of an owner decision. This audit updates the planning basis, not runtime code.
