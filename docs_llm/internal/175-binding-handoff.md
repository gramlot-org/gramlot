# 175 · Binding 0.2.0 handoff

> **Historical handoff — 2026-09-25 supersession:**
> [GC-210](210-binding-contract.md) is the owner-confirmed execution contract;
> [GC-070 §490](070-work-status.md#gc-070-490) is current. Preserve the dated
> baseline, probe limitations and approval receipts below. Root/ownership,
> Source-only delivery, dataSetter vocabulary and R1 are now settled; R3 is
> provisional and must be tested in S12. Do not restart GC-165 or ask those closed
> questions again. S00 alone is authorized by the present task.


> Subsequent owner decisions: [GC-070 §425](070-work-status.md#gc-070-425) confirms a stable outer Data subscription root analogous to Source; [§430](070-work-status.md#gc-070-430) assigns subscription and event routing to Gramlot, while Builder retains Data access/resolution and SourceNodes their specific reactions. The Python/JS Builder contract, not PoC segmentation, is the starting point; [§435](070-work-status.md#gc-070-435) confirms that gramlot.data and builder.data reference the same document Bag beneath the stable root main node, with no main prefix in authored Data paths. These are accepted contracts, not implemented runtime changes.

Document ID: **GC-175**. Prepared: **2026-09-24**.
Status: handoff prepared; implementation still paused for contract review.

[Full counterpart](../../docs/internal/175-binding-handoff.md). Read it for the
complete code/evidence map and detailed acceptance cases.

<a id="gc-175-005"></a>
## 005 · Start here

**Historical section:** the continuation/gates below are superseded by GC-210;
only its Q2–Q5 and recorded implementation questions remain for later phases.

Resume context from **develop**, not main or a release worktree. This request
prepares a handoff; it does not lift the binding pause or authorize implementation
or publication. Ask one unresolved decision at a time, explain why,
wait, and answer the owner's intervening questions first. Every decision needs
explicit confirmation; do not ask again for one already given. Communicate in
concise Italian; code and maintained docs remain English.

Implemented: resolved projection on mount/Source changes and unchanged-input caret
preservation. Not implemented: complete reactive Data/provider/control binding.
Green CI and four prerequisite tests are not binding acceptance.

<a id="gc-175-010"></a>
## 010 · Repository, revisions and completed maintenance work

Checkout: `/Users/gporcari/Sviluppo/gramlot/gramlot`. At handoff preparation:

- develop: `cbd80deed1b097ffbe778d05cb092c8338c5a9e7`, with unfinished 0.2.0 prerequisite.
- main: `b93d384b0403cbd9f2e0c27bfc62841d7b24ceec`, maintenance without binding runtime.
- v0.1.1: `ba868c4ba061bfd4afceec4613b2810598ec73a4`.
- v0.1.2: `47de64c67151095f14744d355b494d1f4488d49e`.

Branches/tags are public. JSR 0.1.2 payload and 13 examples were verified.
Maintenance, source provenance, packaging and CI integration are complete; do not
reopen them as binding prerequisites. Develop metadata remains 0.1.2 but its
binding code is not part of that published package. No 0.2.0 bump is authorized.
The checkout was clean before this documentation-only handoff; inspect actual
state on resume. Separate local checkouts hold maintenance, release and CI
snapshots; they are not interchangeable development roots.

<a id="gc-175-015"></a>
## 015 · Authority, approved direction and boundaries

Read constitution, overview, ports/README and [GC-170](170-binding-source-audit.md).
Amendments 11.41–43 govern binding scope, Gramlot specialization and decisions;
11.44–46 govern runner and Minimal ownership. The owner confirmed binding belongs
to **0.2.0**. SourceNode context, relative/symbolic access, GET/SET/PUT/FIRE,
expressions, formula/controller and delayed execution belong together from the
initial investigation/design. Recover legacy behavior and discuss deviations.

Gramlot may specialize Python/JS Builder bases through public APIs. Builder/Bag
repos and installed source are read-only. Genuine defects require executable
reproducers and owning issues; legacy differences alone do not prove defects.
Keep typed SourceBag/SourceBagNode, TYTX, Python-first authoring, independent hosts,
existing Source FIFO/freeze/disposal and paired status docs. No fallback parsers,
binding-object DSL, aliases, parallel Data/event/render systems or permissive
multiple wire shapes. No formal Live Object Tree semantics are approved.

Segmented Data/volumes are excluded as requirements. Replacement Data ownership,
setup/delivery and detailed provider/control contracts remain unresolved. The
existing browser `main` Bag and GC-155's proposed shared root are not design approval.

<a id="gc-175-020"></a>
## 020 · Actual code and the prerequisite to preserve

- `js/src/gramlot.js`: builder.data is app.data; creates main Bag; mounts Source
  and manages requests/disposal. No reactive Data subscription.
- `js/src/builder/gramlot-builder.js`: HtmlBuilder subclass, inert computeLogic;
  create calls setup(data)/main(root), but current hosts do not call create.
- `js/src/renderer/gramlot-renderer.js`: Source subscription, records, queue,
  freeze and onDispose. Develop preserves resolved `_text` and resolves runtimeValues
  and metadata before Source-update projection.
- `js/src/view/html.js`: resolved text/attrs and unchanged-value suppression,
  while restoring canonical values if DOM diverges. renderAttributes precedence
  remains unchanged; its rename was a maintenance cleanup.
- Python Page: `src/gramlot/page/base.py`; JS Page: `js/src/adapters/page.js`.
  Neither defines Page.setup. Python Host `_source` / JS Host `buildSource` invokes
  Page directly and sends only TYTX(Source), not author-side builder.data.
- Collection validates envelope/format; loader validates/compiles declarations.

`js/tests/binding-lifecycle-baseline.test.js` passes **4/4**, rerun for handoff:
untouched pointer strings and evaluated updates; branch text/caret; replacement/
disposal exactly once; frozen Source projection reading current Data on thaw.
This is jsdom evidence, not a real-browser IME matrix. Data-only changes still do
not refresh DOM: `ports/PORT-0005-data-binding/current-nonreactivity.test.mjs`
passes **1/1** because it asserts that gap. Replace it with positive cases when
reactivity lands; do not preserve the gap as a contract.

<a id="gc-175-025"></a>
## 025 · Hosting, runner and dependency ownership

Minimal owns standalone startup, WorkerTransport/WorkerHost and CSS/export handling.
Core exposes neutral host/page/server/runtime; do not restore removed standalone
or worker-host core entries. Local Minimal development has the relocation; a new
published Minimal release was not established. Inspect the matching adapter source
before end-to-end work. CI uses public Minimal/JS Server main to install example
dependencies only; runner tests do not prove those hosts or standalone exports.

Runner behavior is local to examples/00-runner/browser, with ordinary HTML IDs
and a bounded page-local exception. It is not general binding support, a source
marker API or permission for manual application event/state wiring. Future
components need approved design; teaching binding pages use Gramlot mechanisms.

<a id="gc-175-030"></a>
## 030 · Dependency evidence, reproduced now

Observed JS: Builder 0.1.5, Bag 0.5.3, TYTX 0.15.1; recheck after refresh, never pin.

- Bag doTrigger=false quiet write passes. Generic SourceNode.PUT emits one event:
  recovered Gramlot-contract gap, not automatically an upstream bug.
- Repeated FIRE emits both values and resets to null; absent fired payload metadata
  is an unresolved compatibility/design matter, not an established Bag requirement.
- `pointerType('==...')` returns `=`; Gramlot expression work is unresolved.
- Symbolic #FORM/#ANCHOR/#target drops ?caption; direct attribute read succeeds.
  [Builder issue #1](https://github.com/genropy/genro-builders-js/issues/1) is **OPEN**,
  checked for this handoff, updated 2026-09-24T15:23:09Z. Three cases still fail.
  Do not patch around it; verify an upstream fix before using that behavior.

Run from repository root:

```sh
node ports/PORT-0005-data-binding/contract-probes.mjs
node --test ports/PORT-0005-data-binding/current-nonreactivity.test.mjs
node --test js/tests/upstream-regressions/builder-symbolic-attribute.test.mjs
node --test js/tests/binding-contracts/gramlot-quiet-write.test.mjs
```

Current results: **1 match/6 gaps**, **1 pass**, **0 passes/3 failures**, and
**1 pass/1 failure**, respectively. Probe default exits zero after reporting gaps;
--strict exits nonzero. Diagnostic .mjs files are outside npm's tests/*.test.js.
Do not relax them or merge expected failures into passing CI. Their expectations
require GC-170 classification. Seven historical GenroPy comparisons never reached
semantic assertions because the adapter failed at `_nodes.splice`; not seven
established semantic defects. External adapter repair is outside current write scope.

<a id="gc-175-035"></a>
## 035 · Decision gates before new runtime changes

**Historical section:** the continuation/gates below are superseded by GC-210;
only its Q2–Q5 and recorded implementation questions remain for later phases.

Review sequentially, one owner question at a time:

1. Canonical page Data ownership and SourceNode context/addressing.
2. Python/JS authoring and declarations: native HTML data is not automatically a
   setter, and Page.setup is not an existing hook.
3. One host-neutral initial delivery: Source only versus an agreed typed payload;
   decide after authoring review, never support both to avoid choosing.
4. Provider grammar/startup and macro/callable semantics, conditions and arguments.
5. Dispatch/origin/PUT/FIRE defaults, expression details, control conversion and
   input/change/null/empty/invalid/IME behavior.
6. Selected legacy-only symbolic contexts needing forms/rows/widgets and release coverage.

GET path macro compilation is distinct from node.GET('path'). Distinguish _init,
_onStart, _onBuilt, delayedCall, provider _delay, _timing and delayed writes.
Initialization needs overwrite/missing/null/remount/remote branch/page-isolation
and provider-startup decisions. No server sync/persistence follows from initial
Data. Source FIFO is approved; provider ordering is not inferred from it or PoC.

<a id="gc-175-040"></a>
## 040 · Safe continuation sequence and acceptance evidence

**Historical section:** the continuation/gates below are superseded by GC-210;
only its Q2–Q5 and recorded implementation questions remain for later phases.

Verify develop/environment and read authority sources; explain the current
prerequisite and first unresolved ownership/context question. Wait for approval,
record its bounded scope and refine B0/B2/B3 of GC-165. B1 projection exists;
complete B4–B7 do not. Preserve formula/controller/delay in the first complete
execution design. Prefer public APIs and Gramlot specialization; do not precreate
speculative modules or copy the whole PoC runtime.

Add positive tests as implementation lands: reactive/passive sampling, untouched
Source, origin/peer propagation, value versus attributes, exact/ancestor/descendant
segment matching, dynamic/symbolic context, rebind/replacement, freeze/thaw,
partial failures and disposal of subscriptions/listeners/providers/timers/queues.
Do not recreate paths after detachment to discover cleanup ownership. Keep current
record identity and scheduling. Review cycles/recursion, argument resampling and
latest trigger metadata explicitly.

Python-first paired examples and Python/JS/Worker typed initialization parity
follow the agreed flow. Real browser focus/selection/IME and local-file standalone
checks are needed for those claims. Update GC-070/165/PORT-0005 with implementation,
verification and acceptance distinguished. No release, upstream write or broader
framework design follows automatically from this handoff.

<a id="gc-175-045"></a>
## 045 · Environment, commands and CI baseline

Local Python venv: Builder 0.23.4 from the temporary builder-template-artifacts
wheel, Bag 0.25.1, TYTX 0.15.0. Clean PyPI and hosted CI instead used Builder
0.23.2 with the same Bag/TYTX versions. [GC-085](085-operating-guide.md) records both.
Use isolated environments for fresh setup checks; do not rewrite a working venv
just to match version text. First-party dependencies remain floating with no lock.

```sh
.venv/bin/python -m unittest discover -s tests
GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" npm --prefix js test
node --test js/tests/binding-lifecycle-baseline.test.js
npm --prefix examples test
npm --prefix js run build
deno run --config jsr.json --allow-read scripts/verify_jsr_examples.mjs
```

Use absolute Python for JS interop. Runner setup requires declared example
dependencies and --install-links; follow its README and inspect adapter revisions.
Deno may require the existing cached npm executable on this machine. Its example
check establishes imports/Source generation, not browser binding.

Hosted Python 3.12 / Node 22 results: develop `361dcca` **18 Python/76 JS/8 runner**
([run](https://github.com/gramlot-org/gramlot/actions/runs/36059479696)); main `76321ac`
**18/72/8** ([run](https://github.com/gramlot-org/gramlot/actions/runs/36059477892)).
Both documentation workflows passed. Current branch tips add only result receipts.
CI excludes diagnostic .mjs files, coverage, seven-host and real-browser matrices.

<a id="gc-175-050"></a>
## 050 · Reading map and historical traps

**Historical section:** the continuation/gates below are superseded by GC-210;
only its Q2–Q5 and recorded implementation questions remain for later phases.

Read GC-170, GC-165, GC-155, GC-160, then PORT-0005. Its pointer, reactivity,
data-writeback, legacy-sourcenode/logic/delayed/lifecycle, initialization,
implementation-lifecycle and contract-probe reports provide evidence; full GC-175
links each file and code entry point.

Superseded inferences: old maintenance/CI pending states; the 97-test count before
ownership relocation; blanket upstream-edit gates instead of allowed Gramlot
specialization; PUT/FIRE/== automatically being dependency bugs; proposed shared
Data root/new payload already approved; routine-decision permission overriding
11.43; PoC manual/proposal summaries being owner approval. Segmented Data is
specifically excluded. GC-170 governs these corrections.

Historical evidence roots: `/Users/gporcari/Sviluppo/Genropy/genropy` at inspection
revision fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea and sibling gramlot-poc at
10478b57ce3f22e6445eb6b72eba343520cbebac. Recheck current state; some Python reports
use a distinct sourcerer checkout. GC-170 indexes local ignored original conversations
under PoC temp/conversations-2026-09-08. Missing evidence is a limit, not permission
to infer decisions; never bulk-publish conversation archives.
