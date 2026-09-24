# 130 · 0.1.0 ecosystem review

Document ID: **GC-130**. Reviewed: **2026-09-23**.

**Current outcome:** the owner-approved alignment is complete; see [section 035](#gc-130-035). Earlier findings below record the initial review. Acceptance and publication remain pending.

[Expanded counterpart](../../docs/internal/130-release-ecosystem-review.md).

<a id="gc-130-005"></a>
## 005 · Verdict and scope

Native HTML core is technically a credible 0.1.0 candidate; the whole ecosystem
is not aligned for release. Review thirteen local repositories, concentrating
runtime checks on the agreed seven profiles. Historical applications received
compatibility/documentation triage, not full regression testing. Bag/Builder/TYTX
were inspected only at consumed boundaries. No remote website/registry/branch
verification, runtime changes, dependency edits or acceptance. GC-110 remains
the execution plan; this report recommends bounded release alignment.

<a id="gc-130-010"></a>
## 010 · Architecture assessment

Bag/TYTX/generic Builder own trees/events/typed Source/grammar/static rendering.
Python GramlotBuilder owns its bounded dialect loader and local Collection under
11.16; JS consumes generic sourceTarget. Gramlot coordinates startup and remote
Source; GramlotRenderer owns live DOM/FIFO/freeze/cleanup; HtmlElement and References
have concrete DOM/identity responsibilities. Neutral Hosts own fresh Page execution
and registries; adapters own HTTP; Worker reuses Host; standalone only packages.
Python's directory loader is accepted, not a missing FileHost to add. Database
core remains a placeholder. No structural redesign is needed for 0.1.0; future
components/mixins and Data contracts are not finalized by this architecture map.

<a id="gc-130-015"></a>
## 015 · Findings requiring release alignment

- **R1, high:** old FastAPI/Flask/Genro ASGI application exports and CLI paths
  import absent PoC `gramlot.builder`. Reproduced with core 0.1.0: old public
  imports fail; native imports and eight tests pass. NodeJS `npm start` also
  targets the historical PoC server. Choose the release entry points, make native
  commands primary and test them; no aliases or compatibility emulation.
- **R2, high:** primary adapter README/specification/architecture/release pages
  still describe PoC 0.1.5, fixed wheel dependencies or a non-executable clean
  core. Native guides exist but do not repair these entry points. Correct paired
  docs and actual trial commands; Sphinx success is not semantic correctness.
- **R3, medium:** GC-100 attributes both Collection paths to generic Builder,
  while Python uses `page/_collection.py` and `_grammar_load.py` under 11.16.
  GC-086 omits those modules. Correct ownership documentation, not approved code.
- **R4, high for an ecosystem claim:** Django, site and Rosetta are PoC consumers,
  with active first-party pins conflicting with constitution section 12. Explicitly
  exclude them from native release compatibility and track owning migration work;
  do not blindly unpin or migrate richer features as a hidden 0.1.0 gate.
- **R5, distribution:** core npm/NodeJS remain private; consumer npm dependencies
  float; adapter versions are independent development versions. Specify package
  set, versions, archive/registry delivery and ordering. Local packs are valid;
  ordinary registry installation is not established. Existing NodeJS/example
  notice distribution tasks remain unverified remotely. Do not infer lockstep
  versions or permission to change publishing flags.

<a id="gc-130-020"></a>
## 020 · Repository disposition and documentation debt

Core and native FastAPI/Flask/ASGI/Kajenn/Node/Bun/Worker profiles pass reviewed
checks. Standalone's exporter split is coherent. Hello World uses real core APIs,
but its repository README incorrectly calls server launchers placeholders and
its application README names `/server` instead of the actual `/page` import.
Django/PoC/site/Rosetta remain experimental; meta is an archive and git-app a
skeleton, neither a release gate.

Pre-report Markdown mirrors: core 37/37 with matching anchors; examples, Flask,
Genro ASGI, NodeJS and standalone paired. Missing mirrors: FastAPI 1, Django 11,
site 10, Rosetta 9; PoC has larger historical gaps. FastAPI/Django policies already
acknowledge legacy gaps. FastAPI GF-030 stable anchors match, old descriptive
aliases differ. Counts exclude history/archive/build and do not verify RST or
semantic equivalence. Fix revised release documents; retain other debt without
mass-renaming stable paths. Core's showcase fragment is absent from the current
local standalone README; verify intended destination, no live URL failure claimed.

<a id="gc-130-025"></a>
## 025 · Checks performed and limits

Python 17/17; Node 75/75; installed Python native adapters 8/8 with core 0.1.0
over the existing phase-4 environment (two dependency deprecation warnings).
Versioned core Chromium matrix 7/7: Uvicorn, FastAPI, Kajenn, Flask, Node, Bun,
Worker. Extracted latest local 0.1.0 artifacts over existing dependencies; this
supplements earlier fresh-install evidence, not a new network refresh. Checks:
typed main, text/attributes, nested insertion/deletion/replacement, remote, freeze,
plain-Bag rejection, disposal, server closure/Worker termination. Standalone
exporter 3/3 in a temporary copy against that graph. No Safari/Firefox claim.

Strict Sphinx passes core/FastAPI/Flask/Django/Genro ASGI; ASGI needed installed
package metadata, then passed. Core public seven-page boundary/link/search/source/
anchor checks pass. Chromium initially hit sandbox restrictions; permitted rerun
passed. No full legacy application suite or live remote state checked.

Artifact SHA-256 (evidence, not dependency pins): wheel
`5c95cefb212f87a34add4bdea22c698703bc71596f38906537677314f0c55a0b`;
npm archive `7bf5418e088ca67b242780aaeff798f0ded3e150c0718fe659e31d80a1b53937`.
Temporary logs/inventory/matrix under `/private/tmp/gramlot-review-*`; artifacts
under `/private/tmp/gramlot-phase6-20260923/artifacts/`. Preserve final release
evidence durably at release creation; expanded report identifies exact paths.

<a id="gc-130-030"></a>
## 030 · Proposed next step and 0.2.0 boundary

Confirm one bounded alignment phase: choose R1 entry points, fix R2/R3 paired docs,
state R4 exclusions and R5 delivery, verify actual installer/launch commands,
then request native 0.1.0 acceptance. Publication/deployment remain separate.
Subsequent develop work requires bounded Data/binding/controller/resolver ownership,
then selected recipes/components/database contracts; no final class hierarchy is
inferred. GC-110 records application-led 0.1.x fixes before 0.2.0 features; plan
the desired transition without adding future features to 0.1.0.

<a id="gc-130-035"></a>
## 035 · Approved alignment outcome — 2026-09-23

Owner approved and requested one Sol agent; coordinator reviewed exports/docs,
corrected installer gaps and independently checked final packages. Earlier findings
are historical: R1 native APIs/launchers primary, native-only __all__, explicit/star
imports pass; legacy modules/CLI remain outside compatibility, no aliases/fallbacks.
R2 primary docs/spec/site notices/mirrors aligned; all local wheels supplied and
PoC check workflows excluded from native gate. R3 Python loader/Collection ownership
fixed in GC-100/086. R4 Django/site/Rosetta explicitly excluded, migration/pin-policy
debt still open in owners. R5 GC-135 defines nine-package archive delivery; external
publication undecided and npm private flags unchanged.

Fresh network-resolved all-wheel Python 3.12 and four-archive npm installs pass;
pip check, native/star imports, installed Python 17/17, adapter native tests 8/8,
four Python launcher HTTP 200, final-graph Chromium 7/7 and exported standalone
file with HTTP(S) blocked pass. Corrected npx command builds installed Hello World.
Strict core/three native Python adapter Sphinx and core public boundary/link checks
pass. No full PoC suite or Safari/Firefox claim. Runtime source matches package
bytes; only package runtime edits narrow three __all__ lists. Core artifacts are
unchanged, verified source/resources; no architectural refactor or dependency edit.

Local payload: build/release-candidate/0.1.0 with artifact hashes. Temporary logs,
consumers/matrix/artifacts: /private/tmp/gramlot-alignment-*. Phase complete; owner
acceptance, public-reference consolidation and publication are separate. No release
or deployment performed.


<a id="gc-130-040"></a>
## 040 · Release closure — 2026-09-24

The owner accepted native 0.1.0 and GitHub archive distribution. The accepted
core and six native companion repositories are consolidated and published;
primary-path documentation and exports are aligned. Native adapter gates now
require imports without skipping, exclude old first-party locks and pass locally
and in GitHub CI. A pristine-source core build gap is fixed without changing
the verified runtime. The nine downloaded release packages and bundle checksums
match. See [GC-135 §040](135-release-handoff.md#gc-135-040) for the public receipt.
Excluded Django/site/Rosetta migrations and 0.2.0 features remain separate work.
