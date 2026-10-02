# 215 · Gramlot 0.2.0 qualification (S16)

Document ID: **GC-215**. Recorded: **2026-09-30**.

> **Naming (2026-10-02):** in the dated text of this document, "native" as the label of a release, profile, milestone, adapter, module, API or pages names the scope of the 0.1.0 milestone (no web components, no recipes). That label has no technical meaning; current documents do not use it ([GC-005 §030](../005-documentation-policy.md#gc-005-030)). "native" for browser controls, DOM events, HTML attributes, DOM operations, Bag events or platform APIs keeps its technical meaning. Dated text is not rewritten.

**Current outcome:** complete (2026-09-30). R20 passes after `b79a80d` (19/19); R22, R24, L1
waived by the owner (§035); Firefox rows (§025) passed. Nothing published.

[Expanded counterpart](../../docs/internal/215-qualification-0-2-0.md).
[Contract](210-binding-contract.md) · [Current status](070-work-status.md#gc-070-615) ·
form of [GC-130 §025](130-release-ecosystem-review.md#gc-130-025).

<a id="gc-215-005"></a>
## 005 · Revision, environment and versions

Block ID: **GC-215-005**.

- Source plan revision 11, SHA-256 `5ca51670`. Core: `wf/gramlot-0-2-0-binding` at `f0e2a6b`
  plus the Phase 19 changes committed with this report. Packages still 0.1.2 (version is S17).
- macOS arm64; Python 3.12.9, Node 23.11.0, npm 10.9.2, Bun 1.3.14; playwright-core 1.63.0:
  Chromium 153.0.8010.12, WebKit 26.6, Firefox 155.0 (owner).
- Resolved without pins, equal to the latest published: genro-bag 0.27.0, genro-builders 0.27.0,
  genro-tytx 0.16.0; `@jsr/genro__bag` 0.10.0, `@jsr/genro__builders` 0.4.0,
  `@jsr/genro__tytx` 0.16.0. `pip check` clean.
- Adapters run, not edited, trees clean: gramlot-uvicorn `abdf54b`, gramlot-js-server `1214ac0`,
  gramlot-serverless `5d5a65e`.

<a id="gc-215-010"></a>
## 010 · Artifacts, runtime bundle and C07

Block ID: **GC-215-010**.

- SHA-256: wheel `e915ce6a…217b`, sdist `f0ae4ab1…5e83`, npm tgz `6a938906…4b41` (full values
  in the expanded view); in `/private/tmp/gramlot-s16/artifacts/`.
- Served bundle (`js/dist`, `src/gramlot/resources`, wheel, tgz): `a35d468f…c807`.
- `js/tests/runtime-bundle.test.js` fails on a missing or stale bundle; it caught the stale
  checkout bundle at start (`f09e64e9…`, before `3aec35a`); rebuilt, passes.

<a id="gc-215-015"></a>
## 015 · Mandatory rows

Block ID: **GC-215-015**.

| Row | Outcome |
| --- | --- |
| R01-R03 checkout suites | Python 72 OK, JS 451/451 (enrolled contracts included), examples 31/31 |
| R04-R07 clean environments (`qualify-clean.sh`) | installed from the artifacts, imports pass; Python 72 OK, JS 451/451, examples 31/31 |
| R08 counters, two fixtures | same work per write with 1 and 200 unconnected branches |
| R09 §8.1 story, real bootstrap path | pass, Python and JS pages identical (§020) |
| R10 C07 | pass after rebuild |
| R11-R12 binding, Worker host | Chromium and WebKit PASS |
| R13-R14 examples runner, Node and Bun host | Chromium PASS, 64 pages |
| R15-R16 gramlot-uvicorn | 5 passed; strict and permissive acceptance, story 1-8: Chromium and WebKit PASS |
| R17-R19 gramlot-js-server | Node 7/7, Bun 5/5; harness Chromium PASS; acceptance Node and Bun, Chromium and WebKit PASS |
| R20 gramlot-serverless tests | PASS 19/19 after `b79a80d` (first run 17/19, D1) |
| R21 serverless standalone strict CSP | Chromium and WebKit PASS |
| R22 story on the standalone | **blocked** (D2) |
| R23 core runner standalone | Chromium PASS with both package names linked to one checkout (D3) |
| R24 four deferred adapters | not run; waiver requested |
| R25 Firefox | PASS F1-F9, Firefox 155.0, owner's Terminal run 2026-09-30 |

Commands and log names: expanded view.

<a id="gc-215-020"></a>
## 020 · The §8.1 story

Block ID: **GC-215-020**.

`qualification-story.test.js`: `FileHost` of each language, bootstrap HTML in jsdom,
`PageBootstrap` (CSS links, companion import), TYTX over `MainTransport`, real `pagehide`.
Steps 1-8 pass with exact Data trace and DOM records; no element corrected at the first render
or at the remote branch's first render; one controller call per click; freeze keeps the removed
note until the one thaw while built elements follow the Data; after the close every counter is
0 and the host page is gone. Counters (bindings, registrations, records): 52/18/39, 56/20/41
after the remote branch, 55/20/40 after the removal. Also in real browsers on every hosted
adapter (R16, R19).

<a id="gc-215-022"></a>
## 022 · Acceptance families of source §8

Block ID: **GC-215-022**.

A01-A18 are each mapped to tests and rows in the expanded view; all green in the checkout and
clean runs. Firefox is not part of any family yet.

<a id="gc-215-025"></a>
## 025 · Firefox rows, to be run by the owner

Block ID: **GC-215-025**.

From the Terminal app: `zsh /private/tmp/gramlot-s16/firefox.sh 2>&1 | tee
/private/tmp/gramlot-s16/logs/firefox.log`. F1 binding, F2 Worker host, F3 serverless strict
CSP, F4-F9 acceptance on uvicorn, Node, Bun (strict, permissive). Checked by the executor with
`chromium`: nine PASS. F1-F9 PASS on Firefox 155.0 (owner's Terminal run, 2026-09-30).

<a id="gc-215-030"></a>
## 030 · Defects and limits (not fixed here)

Block ID: **GC-215-030**.

- D1: gramlot-serverless `tests/standalone.test.js:53`, `:105` expect "Source method not found";
  the core says "Unknown Source method" since `c9744e6` (S15bis).
- D2: the standalone has the strict profile only; `09_end_to_end` has inline formulas: Q3 error.
- D3: `@gramlot/native-html` and `@jsr/genro__gramlot` as two copies break the runner export
  ("Page modules must export a subclass of Page"); package names are S17.
- D4: stale runtime bundle at start, rebuilt.
- L1: `verify_examples_browser`, `verify_standalone_runner`, js-server `native-browser` are
  Chromium-only.
- L2: standalone `Page.css` at the root path needs `assetRoot`.

<a id="gc-215-035"></a>
## 035 · Waivers requested from the owner

Block ID: **GC-215-035**.

Owner, 2026-09-30: R20/D1 refused (fix in gramlot-serverless, row re-run); R22/D2 granted (standalone strict only; story passes on the hosted adapters, permissive); R24 granted (deferral of 2026-09-29); L1 granted (pages covered by R16, R19, F4-F9); F1-F9 not needed (owner runs §025).

<a id="gc-215-040"></a>
## 040 · Evidence

Block ID: **GC-215-040**.

`/private/tmp/gramlot-s16/` (logs, artifacts, clean, hosts, scripts); commands keep these paths. Retained 2026-10-01: `logs/` (64 files), scripts and host launchers in `/Users/gporcari/Sviluppo/gramlot/v_0.2.0/qualification-evidence/` (outside the repositories); venvs not kept; the 0.1.2-versioned artifacts are superseded by the GitHub release `v0.2.0`.

<a id="gc-215-045"></a>
## 045 · Release status

Block ID: **GC-215-045**.

Implemented yes (`ac5c08f`); accepted yes (owner, 2026-09-30, GC-070 §620); packaged locally (version 0.2.0 authorized 2026-09-30; wheel `79e48b9e…`, sdist `5717f9bb…`, npm pack `2a13efcc…`; C07: bundle in wheel and npm package = fresh build `a35d468f…`); published 2026-09-30: tag `v0.2.0` (`eabf2f0`), GitHub release, PyPI `gramlot` 0.2.0 (trusted publisher, run 36761273989), JSR `@genro/gramlot` 0.2.0 (owner); distributed from PyPI, JSR, GitHub; adapters not yet pushed.
