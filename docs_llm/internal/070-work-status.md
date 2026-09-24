# 070 · Current 0.1.0 work status

Document ID: **GC-070**. Updated: **2026-09-24**.

[GC-110](110-native-html-readiness.md#gc-110-020) is the completed release plan; [GC-125](125-execution-history.md) preserves historical evidence. PoC and old handoffs are not startup instructions.

<a id="gc-070-005"></a>
## 005 · Current milestone

Published and accepted native 0.1.0: native HTML, live typed SourceBag/SourceBagNode, Python/JS Page, main/marked remote Source, FIFO updates, freeze/unfreeze and cleanup. Seven profiles: Uvicorn, FastAPI, Kajenn, Flask, Node, Bun, Worker. Recipes, reactive Data bindings, database integration and new components are deferred; Safari/Firefox and grammar-drift CI are follow-up work.

<a id="gc-070-010"></a>
## 010 · Implemented and verified

Implemented: strict Source, native live renderer, shared Page/Host, Worker, adapter HTTP and close lifecycle. HTTP close is best effort with TTL; Worker termination releases its registry. Python dialect loading/TYTX/mixed text/insertion is Gramlot-owned (11.16); JS uses generic `sourceTarget` (11.18); Collection add/update follows 11.14. Bag source is unchanged upstream; tag replacement uses delete/insert.

2026-09-22 checks: Python 16/16 and installed wheel 16/16 with published Builder 0.23.2. Owner-authorized generic Builder JS 0.1.3 source is available at the declared GitHub dependency on `main` (a3a5860); it passes 109/109 with fresh Bag/TYTX. Fresh Gramlot JS dependencies resolve it, and core Node passes 74/74 with the existing Python test environment. Owner-authorized TYTX correction c8016d4 is now on GitHub; a second clean install passes Gramlot JS 74/74 and builds the browser bundle. TYTX passes 850/850 JS and 731/731 Python checks. Seven-host verification remains open; old 8/8 is historical.

2026-09-23 phase 2 review complete: one typed Source/rendering path and approved ownership confirmed; neutral JS/Python Hosts now reject TTLs that cannot expire and invalid capacity. Local core Node 75/75 and Python 17/17 pass. [GC-110 §2.1](110-native-html-readiness.md#gc-110-025) records paths, rationale and limits.

2026-09-23 phase 4 complete: fresh local wheels/archives installed in new Python 3.12/npm environments; Chromium Uvicorn, FastAPI, Kajenn, Flask, Node, Bun and Worker 7/7. Same bounded Source/main/remote/live/freeze/disposal checks, six server page closures and Worker termination pass. Installed adapter protocol tests: FastAPI 3/3, Flask 3/3, ASGI/Kajenn 2/2. [GC-110 §3.1](110-native-html-readiness.md#gc-110-035) records evidence and limits; no release or Safari/Firefox claim.

2026-09-23 phase 5 complete: public/internal docs and mirrors match current core and 7/7; strict Sphinx and public checks pass. Gramlot JS archive carries LICENSE/NOTICE, seven exports and bundles; Python wheel resources/collections match their owners. Local TYTX, NodeJS and Hello World notice corrections now pack into npm archives and relevant Python wheels. [GC-110 §5.1](110-native-html-readiness.md#gc-110-055) records evidence. At that checkpoint the changes were local; TYTX's later GitHub correction is verified in [GC-110 §6.2](110-native-html-readiness.md#gc-110-065).

Phase 6 is complete locally: Python/JS 0.1.0 manifests, fresh wheel/npm installs,
resource/export checks, Python 17/17 and JS 75/75 pass. At that phase-6 checkpoint the Chromium matrix had not been rerun on versioned artifacts; later GC-130 alignment below closes that verification gap. See [GC-110 §6.1](110-native-html-readiness.md#gc-110-060).

2026-09-23 ecosystem review: [GC-130](130-release-ecosystem-review.md) confirms the bounded core ownership and reports incompatible PoC entry points in current adapter packages, stale primary documentation and older-consumer exclusions. Rechecked core Python 17/17, Node 75/75, native Python adapters 8/8, standalone exporter 3/3 and strict Sphinx for core plus four adapters. The latest local 0.1.0 wheel/archive also pass Chromium 7/7 over the existing dependency graph; this is a versioned-artifact rerun, not a new clean network installation. No runtime changes or acceptance.

2026-09-23 approved alignment completed: native-only Python adapter public exports and paired primary documentation now agree with core 0.1.0. Fresh network-resolved installation of all five wheels/four npm archives passes; installed core Python 17/17, native adapters 8/8, four launcher HTTP checks, final-graph Chromium 7/7 and standalone file checks pass. Strict core/three native adapter Sphinx checks pass. Local payload is in `build/release-candidate/0.1.0`; owner acceptance and publication remain pending. See [GC-130 §035](130-release-ecosystem-review.md#gc-130-035).

<a id="gc-070-015"></a>
## 015 · Blocker, acceptance and next action

The earlier documentary and dependency blockers are closed; their dated evidence remains in GC-120, GC-125 and GC-130.

**Released — 2026-09-24:** [native 0.1.0](https://github.com/gramlot-org/gramlot/releases/tag/v0.1.0) is accepted and publicly available through GitHub archives. All nine downloaded packages, bundle checksums and source provenance match the verified delivery. Core documentation CI and all three native adapter CI matrices pass (Python 3.11/3.12). See [GC-135 §040](135-release-handoff.md#gc-135-040). GC-110 is complete. Next: review the local integration work and select bounded PoC transfer/cleanup steps (§040); no 0.2.0 feature contract has been approved yet. Registry publication, deployments and legacy-consumer migrations were not performed.

<a id="gc-070-020"></a>
## 020 · Deferred work

Application-led 0.1.1/0.1.2 corrections precede 0.2.0 features; old plans do not expand 0.1.0.

<a id="gc-070-025"></a>
## 025 · Updating this checkpoint

Update both views after progress. Separate implemented, local, clean-installed and accepted status; append dated evidence to GC-125. Report result and next action without routine Git summaries.

<a id="gc-070-030"></a>
## 030 · Historical execution checkpoints

The former chronology, decisions, rejected paths, artifacts and counts are preserved in [GC-125](125-execution-history.md).

<a id="gc-070-035"></a>
## 035 · Superseded status snapshots

GC-094 phases and eight-profile checks in GC-125 are historical, not current release gates.


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
