# 070 · Current 0.1.0 work status

Document ID: **GC-070**. Updated: **2026-09-24**.

[Concise counterpart](../../docs_llm/internal/070-work-status.md).

This is the current checkpoint. [GC-110](110-native-html-readiness.md#gc-110-020) is the completed release plan; [GC-125](125-execution-history.md) preserves dated execution history. The PoC and old handoffs are evidence, not startup instructions.

<a id="gc-070-005"></a>
## 005 · Current milestone

Published native Gramlot 0.1.0 is a reviewed, locally installable foundation with native HTML and live typed SourceBag/SourceBagNode. Python and JavaScript Page authoring, bootstrap/main/marked remote Source, synchronous FIFO updates, branch freeze/unfreeze and cleanup are in scope. Recipes, reactive Data binding, database integration and new components are deferred. Safari/Firefox and grammar-drift CI are follow-up work, not 0.1.0 gates.

<a id="gc-070-010"></a>
## 010 · Implemented and verified

- Implemented: strict typed Source, native HTML live rendering, shared Page/Host execution, Worker standalone, adapter-owned HTTP and page-close lifecycle. HTTP close is best effort with TTL; Worker termination releases its own registry. Neutral Host has no HTTP fetch dispatcher.
- Implemented: Python dialect grammar/transport/mixed-text/atomic insertion responsibilities under constitution 11.16; JavaScript consumes generic Builder `sourceTarget` under 11.18. Ordered Collection composition follows 11.14. Bag uses unchanged upstream source; element-type replacement uses delete/insert.
- Verified on 2026-09-22: core Python 16/16, installed Python wheel 16/16 with published Builder 0.23.2, and generic Builder JS 0.1.3 109/109 with freshly installed GitHub Bag/TYTX. The owner-authorized 0.1.3 source is now at `genropy/genro-builders-js` on `main` (a3a5860). A fresh Gramlot JS dependency installation resolves that source and passes core Node 74/74 with the existing Python test environment. The owner-authorized TYTX browser correction is available on GitHub at c8016d4. A second clean GitHub installation resolves it; Gramlot JS passes 74/74 and its browser bundle builds. TYTX passes 850/850 JS and 731/731 Python checks. These checks do not verify the seven-host matrix.
- Older eight-profile results are dated historical evidence in [GC-125](125-execution-history.md). The current matrix has seven profiles: Uvicorn, FastAPI, Kajenn, Flask, Node, Bun and Worker.
- GC-110 phase 2 implementation/ownership review is complete (2026-09-23). Both neutral Hosts now reject TTLs that cannot expire and invalid registry capacities. Local core checks pass Node 75/75 and Python 17/17; the reviewed state and limits are recorded in [GC-110 §2.1](110-native-html-readiness.md#gc-110-025).
- GC-110 phase 4 is complete (2026-09-23): newly built local Python wheels and JS archives installed in fresh Python 3.12/npm environments; Chromium passes Uvicorn, FastAPI, Kajenn, Flask, Node, Bun and Worker (7/7). The same bounded Source, remote, live update, freeze and disposal checks pass; server page closure and Worker termination pass. Installed adapter protocol checks pass FastAPI 3/3, Flask 3/3, ASGI/Kajenn 2/2. See [GC-110 §3.1](110-native-html-readiness.md#gc-110-035). This is not a registry release or Safari/Firefox verification.
- GC-110 phase 5 is complete (2026-09-23): public/internal documentation and mirrors now match the implemented core and 7/7 evidence; strict Sphinx and public boundary/link checks pass. Gramlot JS archive includes its LICENSE/NOTICE, all seven exports and bundles; Python wheel resources/collections match their owning packages byte for byte. Separate TYTX, NodeJS and Hello World notice gaps were corrected in local owning checkouts; new npm archives and relevant Python wheels include both files. See [GC-110 §5.1](110-native-html-readiness.md#gc-110-055). At that checkpoint those source changes were local; TYTX's later GitHub correction is verified in [GC-110 §6.2](110-native-html-readiness.md#gc-110-065).
- GC-110 phase 6 is complete locally (2026-09-23): Python/JS manifests and fresh wheel/npm archive are 0.1.0. Clean Python 3.12/npm installations and package contents pass; Python 17/17 and JS 75/75 pass after the SVG namespace correction. At that phase-6 checkpoint the earlier Chromium 7/7 matrix had not been rerun on versioned artifacts; the later GC-130 alignment below closes that verification gap. See [GC-110 §6.1](110-native-html-readiness.md#gc-110-060).

2026-09-23 ecosystem review: [GC-130](130-release-ecosystem-review.md) confirms the bounded core ownership and reports incompatible PoC entry points in current adapter packages, stale primary documentation and older-consumer exclusions. Rechecked core Python 17/17, Node 75/75, native Python adapters 8/8, standalone exporter 3/3 and strict Sphinx for core plus four adapters. The latest local 0.1.0 wheel/archive also pass Chromium 7/7 over the existing dependency graph; this is a versioned-artifact rerun, not a new clean network installation. No runtime changes or acceptance.

2026-09-23 approved alignment completed: native-only Python adapter public exports and paired primary documentation now agree with core 0.1.0. Fresh network-resolved installation of all five wheels/four npm archives passes; installed core Python 17/17, native adapters 8/8, four launcher HTTP checks, final-graph Chromium 7/7 and standalone file checks pass. Strict core/three native adapter Sphinx checks pass. Local payload is in `build/release-candidate/0.1.0`; owner acceptance and publication remain pending. See [GC-130 §035](130-release-ecosystem-review.md#gc-130-035).

<a id="gc-070-015"></a>
## 015 · Blocker, acceptance and next action

The earlier documentary and dependency blockers are closed; their dated evidence remains in GC-120, GC-125 and GC-130.

**Released — 2026-09-24:** [native 0.1.0](https://github.com/gramlot-org/gramlot/releases/tag/v0.1.0) is accepted and publicly available through GitHub archives. All nine downloaded packages, bundle checksums and source provenance match the verified delivery. Core documentation CI and all three native adapter CI matrices pass (Python 3.11/3.12). See [GC-135 §040](135-release-handoff.md#gc-135-040). GC-110 is complete. Next: implement and verify the owner-approved core examples/theme/runner (§045); no 0.2.0 feature contract has been approved yet. Registry publication, deployments and legacy-consumer migrations were not performed.

<a id="gc-070-020"></a>
## 020 · Deferred work

Application-led 0.1.1/0.1.2 corrections precede 0.2.0 features. Recipes, Data bindings, databases, richer components and broader browser claims require later bounded contracts; old plans do not add them to 0.1.0.

<a id="gc-070-025"></a>
## 025 · Updating this checkpoint

Update this file and its mirror after meaningful progress, checks, scope changes or blockers. Separate implemented, locally verified, clean-installed and owner-accepted states. Append dated evidence to GC-125 without promoting old “current” or “next” text. Report result, remaining work and next action without routine Git summaries.

<a id="gc-070-030"></a>
## 030 · Historical execution checkpoints

The former GC-070 chronology, including original decisions, rejected paths, artifacts and test counts, is preserved in [GC-125](125-execution-history.md). Its past-tense and present-tense snapshots are historical.

<a id="gc-070-035"></a>
## 035 · Superseded status snapshots

Earlier GC-094 phase states and eight-profile checkpoints are in [GC-125](125-execution-history.md); they do not define the current release gate.


<a id="gc-070-040"></a>
## 040 · Integration repository reorganization — 2026-09-24

Owner approved the six integration repositories, minimal/Kajenn reorganization
and native Django alignment (constitution 11.19–11.20). Implementation is local:
minimal owns the unchanged generic ASGI adapter plus browser/Worker packaging;
Kajenn imports minimal and exposes its host integration; Django uses ordinary
views/URLconf with the neutral core Host. Hello World has five Python host profiles
and uses the new local package names. The original core 0.1.0 assets are unchanged.

Verified locally: installed minimal ASGI protocol with Kajenn imports blocked;
exporter 3/3 and installed CLI/Chromium file-origin live Source/Worker without
HTTP(S); Kajenn native checks 2/2, Ruff, strict Sphinx, wheel imports and sdist
mirror contents; Hello World Python/JS checks and all five installed Python profile
imports; Django installed page/asset and Chromium heading/disposal smoke. Django native tests pass 3/3, covering lifecycle/ownership, request rejection,
capacity and application error mapping; Ruff, strict docs and package builds pass.
Its local CI configuration now builds core browser assets before installation
and checks the installed native wheel; it has not been executed remotely. Core strict Sphinx
and public link/search/mirror checks pass. This is targeted integration evidence,
not a newly rerun full eight-profile browser matrix.

The owner deferred all integration GitHub publication until further reviewed PoC
transfer/cleanup (constitution 11.21), superseding the earlier Django publication
instruction. No push, remote rename, tag, release, registry publication or deployment
was performed. Physical repository paths and GitHub names remain unchanged; minimal
and Kajenn are local development package identities. Future Kajenn CI needs the
minimal source to be published; it is not remotely verified in this local phase.

Next phase, requiring owner-selected scope: review the remaining PoC transfers and
cleanup. Historical modules are evidence, not approved core capabilities. Publication
requires a new explicit owner instruction after those steps.

Owner-requested reminder: [GC-140](140-integrations-and-examples.md) records the
six integration repositories, the agreed Hello World application and its eight
execution profiles, plus publication and historical-example boundaries. No further
PoC transfer list has been agreed. This is documentation only; runtime and
verification results above are unchanged.


<a id="gc-070-045"></a>
## 045 · Core HTML/SVG examples — 2026-09-24

Owner authorizes the [GC-145](145-html-svg-examples.md) local workstream: twelve
paired examples, shared `themes/gramlot-base`, and `examples/00-runner` with an
HTML catalogue, list and iframe panels. PoC work is set aside. Three Sol agents completed theme, examples and runner; root reviewed and integrated
the work. Verified 26 catalogue/example pages in Chromium with exact Python/JS DOM
parity, native controls, keyboard language switching, iframe navigation, source/README
links and light/dark/narrow layouts. Strict Sphinx and documentation checks pass.
The catalogue inventories all 117 grammar entries, with non-rendered contexts and
the ruby annotation grammar gap explicit. Owner visual acceptance remains pending.
Code viewing belongs to the runner; missing Inspector capability remains explicit.
No publication or changes to the already released archives are authorized.


<a id="gc-070-050"></a>
## 050 · Runner correction — 2026-09-24

Owner rejected the earlier runner presentation: language tabs and sidebar cards
were not the intended interface. The corrected contract is a compact title list
and persistent example tabs, each with explanation above the iframe. The serving
integration selects the language. Implemented and verified: 80/80 JavaScript tests, both integration-specific
runners in Chromium, and all 26 example/catalogue pages. Checks include one tab
per example, explanation above iframe, lazy loading and preserved form state on
reactivation. The in-app browser was refreshed and checked. Earlier browser tests
did not establish owner acceptance of the old UX; corrected visual acceptance
remains with the owner.
See constitution amendment 11.23.
