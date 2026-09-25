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
Status: handoff prepared; binding implementation remains paused for contract review.

[Concise counterpart](../../docs_llm/internal/175-binding-handoff.md).
[Current status](070-work-status.md#gc-070-410) · [Source authority audit](170-binding-source-audit.md).

<a id="gc-175-005"></a>
## 005 · Start here

**Historical section:** the continuation/gates below are superseded by GC-210;
only its Q2–Q5 and recorded implementation questions remain for later phases.

Continue binding work from **develop**, not main or a 0.1.x release worktree.
The owner requests a handoff, not automatic resumption of implementation. The
previous binding pause has not been lifted by maintenance releases or CI work.
Read this document, the constitution and GC-170 before proposing the next bounded
step. Discuss one unresolved decision with the owner at a time, explain its origin,
and wait for the answer. Answer the owner's intervening question before advancing.
User-facing communication is concise Italian; maintained code/docs stay English.

The owner explicitly said every decision must be confirmed. Do not turn evidence,
a proposal, a historical manual or a passing test into approval. An
explicit owner instruction already establishes its bounded decision; do not ask
again for the same permission. Do not start historical work assignments merely
because GC-165 lists them. No implementation was started for this handoff.

**Implemented:** resolved Data projection when Source is mounted/updated, preserving
pointer declarations and unchanged native input selection. **Not implemented:**
a complete reactive Data/provider/native-control binding flow. Four prerequisite
tests and a green CI do not prove reactive binding.

<a id="gc-175-010"></a>
## 010 · Repository, revisions and completed maintenance work

Primary checkout: `/Users/gporcari/Sviluppo/gramlot/gramlot`.
The following references were verified at preparation; re-read actual state on resume.

| Reference | Revision | Scope |
| --- | --- | --- |
| develop | `cbd80deed1b097ffbe778d05cb092c8338c5a9e7` | Maintenance fixes, CI, unfinished binding prerequisite and its tests |
| main | `b93d384b0403cbd9f2e0c27bfc62841d7b24ceec` | Maintenance foundation and CI, without binding runtime changes |
| v0.1.1 | `ba868c4ba061bfd4afceec4613b2810598ec73a4` | Source of JSR 0.1.1; bundled example import defect is historical |
| v0.1.2 | `47de64c67151095f14744d355b494d1f4488d49e` | Source of published JSR 0.1.2; 74 registry files and all 13 examples verified |

Both main/develop and source tags are public. Source availability, wheel packaging,
JSR example import mapping, documentation ownership and CI integration are complete;
they are not prerequisites still awaiting work. GC-070 sections 355–410 preserve
the exact history. No further 0.1.x release is requested.

The checkout was clean at the revision above before this documentation handoff.
This handoff changes documentation only. Version metadata on develop is still
**0.1.2**, identifying the maintenance baseline; develop's binding code is not in
that published package. A 0.2.0 bump/publication requires its own owner instruction.
Do not publish the mixed development checkout as 0.1.2.

Other local checkouts exist and are not interchangeable with develop:

- a separate maintenance checkout for main;
- a historical 0.1.x preparation/receipt checkout;
- a CI integration snapshot checkout.

<a id="gc-175-015"></a>
## 015 · Authority, approved direction and boundaries

Read [constitution](../00-constitution.md), [overview](../01-overview.md),
[port protocol](../../ports/README.md), then [GC-170](170-binding-source-audit.md).
Constitution amendments **11.41–11.43** govern binding scope, specialization and
explicit decisions; **11.44–11.46** govern runner/standalone ownership.

Confirmed direction:

- Binding belongs to **0.2.0**. The owner explicitly confirmed “si il binding va
  nella 0.2.0”. Maintenance release/CI authorization does not accept full binding.
- SourceNode is the context for relative/symbolic Data access. GET/SET/PUT/FIRE,
  expressions, dataFormula, dataController and delayed execution belong in the
  initial investigation/design; do not quietly defer them as optional extras.
- Recover legacy behavior accurately and discuss necessary differences. Preserve
  authored declarations and existing syntax; do not invent binding objects,
  replacement DSLs, aliases or permissive old/new wire-shape fallbacks.
- Gramlot may specialize Python/JS Builder bases using their public APIs.
  A difference from legacy is not automatically a dependency defect.
- Bag/Builder repositories and installed source copies are **read-only**. Prove
  genuine defects with minimal executable tests and issues in the owning project.
  No direct upstream fixes are authorized for this binding work.
- Keep SourceBag/SourceBagNode, typed TYTX, server independence, Python-first
  examples, existing Source FIFO/freeze/disposal and one agreed primary path.
  Missing capabilities are reported to their owner, not hidden by consumer shims.
- Follow paired documentation policy; update GC-070 and the port record as work
  progresses. Do not claim implementation, verification and acceptance as synonyms.

Not approved: segmented Data, per-builder volumes or `volume:path` as requirements;
a replacement Data ownership model; a new setup/wire protocol; formal Live Object
Tree semantics; arbitrary legacy cleanup/order; new general web-component APIs.
The constructor's present `main` Bag is observable code, not proof of an accepted
future namespace design. GC-155's proposed one-page root is not a settled contract.

<a id="gc-175-020"></a>
## 020 · Actual code and the prerequisite to preserve

| Code | Current responsibility and relevant behavior |
| --- | --- |
| [Gramlot](../../js/src/gramlot.js) | Creates GramlotBuilder; `app.data === builder.data`; inserts a `main` Bag. Mounts typed Source, manages remote requests and page disposal. Does not install a Data binding subscription |
| [JS GramlotBuilder](../../js/src/builder/gramlot-builder.js) | HtmlBuilder subclass; grammar loading, references, mixed text, Source serialization. `create()` calls `setup(data)` then `main(root)`; `computeLogic()` is inert for authoring |
| [GramlotRenderer](../../js/src/renderer/gramlot-renderer.js) | Subscribes to Source events; owns records, synchronous FIFO, freeze/thaw and cleanup. Calls inherited `runtimeValues(node)` on relevant Source updates |
| [HtmlElement](../../js/src/view/html.js) | Projects resolved text/attrs, skips equal native value writes, preserves selection; `renderAttributes` retain their overriding precedence |
| [Python Builder](../../src/gramlot/page/builder.py) | Python authoring, owned grammar adaptation and typed Source |
| [Python Page](../../src/gramlot/page/base.py) / [JS Page](../../js/src/adapters/page.js) | Page.main plus explicitly marked remote Source methods; neither establishes Page.setup |
| [Python Host](../../src/gramlot/server/host.py) / [JS Host](../../js/src/adapters/host.js) | `_source` / `buildSource` constructs Page and Builder, invokes the Page method directly and returns TYTX(Source); does not call Builder.create or deliver builder.data |
| [Collection](../../src/gramlot/page/_collection.py) / [grammar loader](../../src/gramlot/page/_grammar_load.py) | Collection validates format/envelope; loader compiles/validates declarations atomically. Recent audit cleanup removed duplicate checks, not binding behavior |

The develop-only runtime prerequisite consists of:

1. Renderer keeps resolved `_text` available and uses it for branch text on mount.
2. Source update projection resolves `runtimeValues`, metadata and attrs before
   calling HtmlElement.update, instead of applying raw pointer declarations.
3. HtmlElement accepts resolved text; it avoids equal text/attribute/native-property
   assignments while still restoring a canonical value if the DOM has diverged.
4. Existing record identity and lifecycle hooks are reused; no Data router exists.

[Four baseline tests](../../js/tests/binding-lifecycle-baseline.test.js) verify:
mount/Source-update evaluation with untouched `^`/`=` strings; branch text and
caret preservation; replacement/disposal cleanup exactly once; frozen Source
projection reading current Data on thaw. They were rerun for this handoff: **4/4**.
Caret evidence is jsdom characterization, not a completed real-browser IME matrix.

A Data write alone still leaves mounted text unchanged. The passing
[current-nonreactivity diagnostic](../../ports/PORT-0005-data-binding/current-nonreactivity.test.mjs)
asserts this missing capability; it is not desired behavior to preserve. It passed
again for this handoff. Replace it with positive regression cases when routing lands.

<a id="gc-175-025"></a>
## 025 · Hosting, runner and dependency ownership

Standalone startup, CSS/export asset handling, WorkerTransport and WorkerHost
belong to **gramlot-minimal**, not core. Core exposes neutral `/host`, `/page`,
`/server`, `/runtime` and its root entry. Do not restore removed core `/standalone`
or `/worker-host` exports. Minimal owns its `/standalone` and `/worker-host` entries.
Current local Minimal development contains the relocation; a newly published
Minimal package has not been established by the core release/CI work. Inspect the
actual matching adapter revision before end-to-end standalone work.

Runner UI lives in `examples/00-runner/browser/`. Its bounded exception uses
ordinary Source-authored HTML IDs and page-local events/Bag state. This is not an
application binding API and does not authorize framework components, custom source
markers or manual event/data wiring in binding teaching pages. Future components
need separate approved design. `serve.py` now consumes `catalog.json` keys/folders.

CI checks out public Minimal and JS Server main only to install declared example
dependencies and run runner unit tests. It does not establish their compatibility
with future initial-Data delivery, standalone build or host behavior.

<a id="gc-175-030"></a>
## 030 · Dependency evidence, reproduced now

Observed installed JS versions: `@jsr/genro__builders` **0.1.5**,
`@jsr/genro__bag` **0.5.3**, `@jsr/genro__tytx` **0.15.1**. They are observations,
not pins. Recheck after any dependency refresh. Source inspection is allowed;
editing those installed packages is not.

| Probe | Result on 2026-09-24 | Classification |
| --- | --- | --- |
| Bag setItem with doTrigger=false | Silent write passes | Available public API; no Bag defect established |
| Generic SourceNode.PUT | Emits one event; quiet-write expectation fails | Gramlot recovered-contract gap, not automatically an upstream bug |
| Repeated FIRE | Two values of 42 observed; stored value resets to null | Matching observation, not complete FIRE semantics |
| FIRE event `fired` field | Absent | Compatibility/design question; not a documented Bag requirement |
| `pointerType('==...')` | Returns `=` | Generic behavior; Gramlot expression design remains required |
| Symbolic `#FORM`, `#ANCHOR`, `#target` with `?caption` | All three lose the selector | Reproduced upstream API defect; direct attribute read succeeds |

[Builder issue #1](https://github.com/genropy/genro-builders-js/issues/1) was checked
live for this handoff: **OPEN**, last updated 2026-09-24T15:23:09Z. It contains the
public-API reproducer. Rerun it against a corrected release before using affected
symbolic paths; do not patch around it in Gramlot. Other unaffected review work
can proceed without pretending the entire effort is blocked by this issue.

Diagnostic commands from repository root:

```sh
node ports/PORT-0005-data-binding/contract-probes.mjs
node --test ports/PORT-0005-data-binding/current-nonreactivity.test.mjs
node --test js/tests/upstream-regressions/builder-symbolic-attribute.test.mjs
node --test js/tests/binding-contracts/gramlot-quiet-write.test.mjs
```

Rerun results: contract probes **1 match / 6 gaps**; nonreactivity **1/1 passes**;
symbolic attributes **0/3 passes**; quiet-write **1 passes / 1 fails**. Normal probe
mode reports gaps with exit zero; `--strict` exits nonzero for gaps. These files
are outside `tests/*.test.js`, the normal npm suite; do not silently add expected
failures to green CI or relax them to manufacture a pass. Their expected values
remain evidence/targets to classify under GC-170, not universal accepted contracts.

Seven older legacy comparison failures were all stopped by adapter construction
(`this._nodes.splice is not a function`), before semantic assertions. Do not cite
them as seven binding defects. Fixing that external adapter needs owning-project
work/authorization; its failure does not permit editing dependencies here.

<a id="gc-175-035"></a>
## 035 · Decision gates before new runtime changes

**Historical section:** the continuation/gates below are superseded by GC-210;
only its Q2–Q5 and recorded implementation questions remain for later phases.

These are topics for sequential review, not a questionnaire to send all at once.
Attach current source evidence and concrete consequences to each question.

| Order | Unresolved decision | Why it matters |
| --- | --- | --- |
| 1 | Canonical page Data ownership and SourceNode addressing/context | The rejected segmented model cannot supply a default, and the replacement is not yet approved |
| 2 | Python/JS authoring and initial Data declarations | Generic native HTML `data` must not silently become a nonvisual setter; setup is not an established Page hook |
| 3 | One host-neutral initial delivery contract | Current hosts send Source only. Choose after authoring/context review; do not implement both old and new payload shapes |
| 4 | Provider grammar, startup and script/macro surface | `_init`, `_onStart`, `_onBuilt`, conditions, expression/callable semantics and arguments are not interchangeable |
| 5 | Data/provider dispatch, native-control conversion and timing | Resolve origin, PUT/FIRE defaults, `^`/`=`/`==`, input/change, null/empty/invalid and IME behavior with cases |
| 6 | Selected legacy-only symbolic contexts and release coverage | Forms/rows/widgets may lack an owning capability; do not invent it or quietly omit a promised behavior |

Legacy `GET path` macro compilation and `sourceNode.GET('path')` calls are separate
surfaces, not proof of interchangeable APIs. Define the contract before adding a
compiler or replacement parser. Provider delay must preserve latest trigger metadata
and evaluate current arguments when it runs; confirm the detailed behavior with
cases. Distinguish delayedCall, provider `_delay`, `_timing` and delayed writes.

Initialization review must address missing vs explicit null, collision/overwrite,
inserted/remote branches, remount, page isolation and formula/controller startup.
Do not infer persistent server Data or automatic server synchronization from an
initial typed snapshot. Preserve approved Source FIFO/freeze; Data/provider ordering
requires its own decision, not copied legacy LIFO or PoC batching by assumption.

<a id="gc-175-040"></a>
## 040 · Safe continuation sequence and acceptance evidence

**Historical section:** the continuation/gates below are superseded by GC-210;
only its Q2–Q5 and recorded implementation questions remain for later phases.

1. Verify develop and environment; read constitution and GC-170, then this checkpoint.
   Report what is already verified and the first unresolved decision. Do not reopen
   completed 0.1.x maintenance work or ask again whether binding belongs in 0.2.0.
2. Present the canonical Data ownership/context question with existing code evidence.
   Wait for the owner's answer and record the exact bounded decision in paired docs.
   Where architectural principles change, record an explicitly approved amendment.
3. Refine GC-165 B0/B2/B3 around those answers and executable cases. B1's projection
   prerequisite exists; it is not a full binding implementation or blanket acceptance.
4. Implement only the agreed SourceNode/Data/provider flow using existing APIs and
   the appropriate Gramlot specialization. Keep formula/controller/delay in that
   design. Use the renderer's existing ownership and scheduling, not a parallel
   datastore, event bus or DOM queue. Do not precreate speculative modules/classes.
5. Add positive reactive and native-writeback cases to the normal suite as behavior
   lands. Replace the negative nonreactivity diagnostic, and keep upstream probes
   separate until the owning dependency is corrected and verified.
6. Verify dynamic context, insert/delete/rebind, ancestor replacement, attribute
   selectors, no `a.b`/`a.bc` confusion, origin/peer propagation, errors, freeze/thaw,
   partial mount failure and cleanup of subscriptions/listeners/queued/timed work.
7. Add Python-first paired examples using Gramlot mechanisms. Exercise equivalent
   typed initialization and behavior through owned Python, JS and Minimal Worker
   hosts, including local-file standalone. Real-browser focus/selection/IME checks
   are required for those claims; node/jsdom CI alone is insufficient.
8. Update GC-070, GC-165 and PORT-0005 with implemented/verified/accepted separately.
   Ask for the next phase only where a new decision is needed. No release, version
   bump, upstream write, deployment or broader component design follows automatically.

GC-165 B4–B7 remain unimplemented as complete increments. Its proposed scenario
list is a review aid, not already approved details. Keep exact origin/condition/
recursion/cycle/timer/null semantics explicit rather than guessing from convenience.

<a id="gc-175-045"></a>
## 045 · Environment, commands and CI baseline

Local Python `.venv`: Builder **0.23.4**, Bag **0.25.1**, TYTX **0.15.0**.
Builder came from `/private/tmp/builder-template-artifacts/genro_builders-0.23.4-py3-none-any.whl`.
It is not required for clean setup. Fresh PyPI and GitHub CI resolved Builder
**0.23.2**, Bag **0.25.1**, TYTX **0.15.0**, with all normal tests passing.
[GC-085](085-operating-guide.md) distinguishes environments and setup evidence.

Use the existing environment for ordinary checks; refresh in a separate clean
checkout when testing dependency/setup reproducibility. Never pin/cap first-party
dependencies or introduce a lockfile. Do not change a local environment merely to
make its version text match a report.

From repository root:

```sh
.venv/bin/python -m unittest discover -s tests
GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" npm --prefix js test
node --test js/tests/binding-lifecycle-baseline.test.js
npm --prefix examples test
npm --prefix js run build
deno run --config jsr.json --allow-read scripts/verify_jsr_examples.mjs
```

The absolute interpreter matters: default `python3` may not import Gramlot, and
some interop tests change cwd. The runner requires declared example dependencies;
follow [its setup guide](../../examples/00-runner/README.md), using `--install-links`
and matching local integrations. Do not replace its file dependencies with aliases.
Deno is optional for ordinary unit tests; this machine previously used the cached
npm Deno executable when `deno` was not on PATH. The JSR example check verifies
imports/Source generation, not browser binding.

Hosted evidence already completed on Python 3.12 / Node 22:

| Branch / tested source | Python | JS | Runner | Evidence |
| --- | --- | --- | --- | --- |
| develop `361dcca` | 18/18 | 76/76 | 8/8 | [tests](https://github.com/gramlot-org/gramlot/actions/runs/36059479696), [docs](https://github.com/gramlot-org/gramlot/actions/runs/36059479702) |
| main `76321ac` | 18/18 | 72/72 | 8/8 | [tests](https://github.com/gramlot-org/gramlot/actions/runs/36059477892), [docs](https://github.com/gramlot-org/gramlot/actions/runs/36059477783) |

The current branch tips above contain documentation-only result receipts after
these tested source revisions. CI includes committed binding-baseline tests on
develop and excludes them on main. It does not run diagnostic `.mjs` probes,
collect coverage, run the seven-host matrix or establish full 0.2.0 acceptance.

<a id="gc-175-050"></a>
## 050 · Reading map and historical traps

**Historical section:** the continuation/gates below are superseded by GC-210;
only its Q2–Q5 and recorded implementation questions remain for later phases.

Read in order:

1. [GC-170](170-binding-source-audit.md): authority/provenance and rejected inferences.
2. [GC-165](165-binding-execution.md): proposed execution packages and unresolved gates.
3. [GC-155](155-binding-implementation.md): proposed responsibility split, not final module/API names.
4. [GC-160](160-legacy-binding-flow.md): legacy SourceNode/provider/timer investigation.
5. [PORT-0005](../../ports/PORT-0005-data-binding/README.md) and the focused evidence below.

| Evidence | File |
| --- | --- |
| Pointer syntax and relative/symbolic paths | [pointers](../../ports/PORT-0005-data-binding/pointers.md) |
| Matching, origin, batching and cleanup | [reactivity](../../ports/PORT-0005-data-binding/reactivity.md) |
| Initial values and native writeback | [data/writeback](../../ports/PORT-0005-data-binding/data-writeback.md) |
| SourceNode receiver and macros | [legacy SourceNode](../../ports/PORT-0005-data-binding/legacy-sourcenode-flow.md) |
| Formula/controller conditions and arguments | [legacy logic](../../ports/PORT-0005-data-binding/legacy-logic-flow.md) |
| Timer mechanisms and cancellation | [legacy delay](../../ports/PORT-0005-data-binding/legacy-delayed-flow.md) |
| Mount, freeze and disposal | [legacy lifecycle](../../ports/PORT-0005-data-binding/legacy-lifecycle-flow.md) |
| Current host/authoring gap | [initialization](../../ports/PORT-0005-data-binding/initialization-contract.md) |
| Implemented projection and proposed next hooks | [lifecycle contract](../../ports/PORT-0005-data-binding/implementation-lifecycle-contract.md) |
| Runnable dependency comparisons | [probes](../../ports/PORT-0005-data-binding/contract-probes.md) |

Do not carry these stale statements into new work:

- GC-155/160/165 references to unconsolidated 0.1.0 or unpublished CI are historical;
  maintenance and branch integration are complete.
- GC-170's old 97-test count predates runner/Minimal relocation. Current counts are
  76 develop / 72 main. Fewer tests do not by themselves establish lost coverage.
- The lifecycle report's blanket ban on Gramlot specialization and treatment of
  PUT/FIRE/expressions as upstream defects are superseded by 11.42 and GC-170.
- GC-165's old wording allowing routine choices without confirmation does not
  override the later explicit-decision rule in 11.43.
- GC-155's ownership table and lifecycle report's proposed typed initial payload
  do not settle the Data/wire model. GC-170 explicitly leaves it open.
- PoC manuals, decision summaries and agreement among earlier reports are not
  independent proof of owner approval. Segmented Data is specifically excluded.

Historical read-only evidence roots: `/Users/gporcari/Sviluppo/Genropy/genropy`
(inspection revision `fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`) and
`/Users/gporcari/Sviluppo/gramlot/gramlot-poc`
(`10478b57ce3f22e6445eb6b72eba343520cbebac`). These identify old inspections,
not current clean-tree guarantees. Some Python evidence uses the separately named
sourcerer checkout; follow each report's exact path. Original conversation evidence
is indexed by GC-170 under PoC `temp/conversations-2026-09-08`; it is local/ignored,
may be unavailable elsewhere, and must not be bulk-published. If evidence is absent,
report that limit rather than inventing an owner decision.

This handoff introduces no new binding contract. It makes the present verified
state and the next required review explicit so the next session does not repeat
maintenance work or implement from superseded assumptions.
