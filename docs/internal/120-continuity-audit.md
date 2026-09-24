# 120 · Continuity audit for the 0.1.0 milestone

Document ID: **GC-120**. Audit date: **2026-09-22**.
Status: **audit preserved; documentary repair B1–B5 completed 2026-09-22**.

[Concise counterpart](../../docs_llm/internal/120-continuity-audit.md).

This audit preserves the pre-repair findings and records closure in §045. It is not another execution plan or an architectural amendment.
[GC-110](110-native-html-readiness.md#gc-110-020) remains the current 0.1.0 plan.
The owner clarified that the requested scope was the first **0.1.0 release**, not
phase 1 of the older GC-094 consolidation plan.

<a id="gc-120-005"></a>

## 005 · Conclusion and evidence boundaries

The documentation contains substantial continuity defects: superseded instructions
still appear as current contracts, navigation selects an obsolete plan, and current
state must be reconstructed from long records with inconsistent ordering. These
defects can cause a new task to repeat decisions, reopen resolved problems, or
implement a retired architecture. They warrant repair without restarting the code.

This audit does not establish file corruption or a model-specific cause. The
conversation also demonstrates execution errors independent of documentation:
repeated confirmations after an answer, treating a distribution problem as missing
implementation, and proposing broader changes before proving their necessity.

Evidence reviewed:

- All 35 Markdown documents under `docs` and their 35 counterparts were scanned
  for structure, paired anchors and local file links. Semantic review concentrated
  on instructions, entry points, plans, status, ownership, host/collection contracts,
  public release claims, four port records and the two continuation handoffs.
- 233 conversation turns dated September 20–22 UTC were inspected through the
  task reader, focusing on user decisions and recorded outcomes: 77 on September
  20, 109 on September 21 and 47 on September 22. The tasks were **ex Coordinatore**
  (`01a0b4b5-6bb7-7ba1-821c-89722496e91b`) and **coordinatore**
  (`01a0c90c-5d9b-7b12-9ffb-3bbfddaf3a74`). The separate **Controlla stato
  repository** task confirmed the local Builder location; it was not an execution
  instruction for this audit.
- Current core source and package manifests were inspected for the disputed
  ownership/API claims. Local core tests were rerun. This was not a new complete
  implementation review, dependency update, remote publication check or host matrix.

<a id="gc-120-010"></a>

## 010 · Reconstructed decision sequence

| Date | Owner decision / resulting direction | Consequence for continuation |
| --- | --- | --- |
| September 20 | GC-094 requested a design-first consolidation; implement settled responsibilities and report unresolved questions without inventing solutions. | Old review proposals do not become architecture through implementation or passing tests. |
| September 20 | Generic JS Builder follows Python with explicit adaptations; static HTML belongs to Builder, reactive rendering to Gramlot; one portable JSON grammar. | Do not reconstruct the former reactive generic engine or duplicate declarations. |
| September 20 | Recipes deferred; unnecessary declaration APIs removed; Source must be SourceBag/SourceBagNode. | Old recipe, plain-Bag compatibility and declaration-helper work is historical. |
| September 21 | 0.1.0 explicitly limited to native HTML and Source live, without reactive Data binding; DOM JS removed from the active dependency path. | A richer PoC or an earlier eight-profile result does not define release scope. |
| September 21 | Ordered Collection updates add/merge changes; omitted/null fields preserve previous values. | Earlier full replacement and collision-rejection descriptions are superseded. |
| September 21 | Speculative rendering removed; synchronous FIFO and branch freeze/unfreeze approved. | Do not restore pre-write veto, Source projection, candidate caches or rollback guarantees. |
| September 21 | Python pages require Python servers; JS standalone uses Worker/Host/Page; one Node/npm exporter. | Retire Python standalone and build-time page execution; matrix now has seven profiles. |
| September 21 | GC-110 established release-readiness gates; Builder ownership corrected using upstream Bag; tag changes use delete/insert; validator-only tests removed. | Bag changes are not a remaining prerequisite of this milestone. |
| September 21–22 | JS HTTP parsing moves to its adapter; page-close lifecycle implemented; minimal Host remains single-process; Python page loading stays in Host. | These questions are settled; implementation verification and acceptance remain distinct. |
| September 22 | Packaged Python grammar retained; CI drift enforcement deferred; Safari/Firefox are declared gaps, not new release gates. | Do not expand 0.1.0 into infrastructure or browser work the owner deferred. |
| September 22 | Python authoring responsibilities assigned to Gramlot by amendment 11.16. Temporary JS handle mapping superseded by 11.18: use latest generic Builder and its sourceTarget. | Python and JS have deliberately different ownership decisions; do not generalize the Python exception into a new JS Builder. |
| September 22 | Release sequence: bounded 0.1.0, application-led 0.1.1/0.1.2 corrections, then 0.2.0 capabilities. | “Perfect code” from earlier reviews must not silently broaden the agreed first release. |

The latest coordinator already added a historical notice to
`temp/handoff_2026-09-22.md`, a reading warning to GC-070, and corrected the Python
checkpoint in GC-110. Those are useful partial repairs; the defects below remain.

<a id="gc-120-015"></a>

## 015 · Findings and concrete consequences

### A1 · Entry points select the wrong execution plan — high

`docs/README.md` calls GC-094 the current design plan; GC-086 calls it the current
proposed execution plan. GC-075/080/087/088 also route execution to GC-094.
Meanwhile GC-110 explicitly declares itself the current execution plan.
GC-088 phase 1 means observable contracts, GC-094 phase 1 means generic foundations,
and GC-110 phase 1 means dependency provenance. “Continue phase 1” is ambiguous.

GC-094 contains a historical notice but also “Current priority — Builder JS first”,
“This is the current proposed execution sequence”, phase 0 active/not started at
section 080, and phase 1 active at section 090. Its front checkpoint still cites
eight profiles and an open prevalidation decision. Fix routing and local labels;
do not reinterpret these as a new requirement to rebuild Builder.

### A2 · The active plan contradicts its own phase table — high

[GC-110 §2](110-native-html-readiness.md#gc-110-020) marks host/grammar decisions
complete and Python clean installation verified. Its
[baseline section](110-native-html-readiness.md#gc-110-040) still describes a
temporary patched Bag archive as currently working and lists HTTP separation,
page closure, Python loader and grammar decisions as open. Later entries settle
those points. Label the entire baseline explicitly as historical and replace its
open-decision wording with links to the actual resolutions.

### A3 · The operating guide describes removed runtime paths — high

[GC-085](085-operating-guide.md) sends contributors to GC-080's recipe pipeline,
names `DomRendererBase` / `HtmlSourceRenderer`, and lists `model/` / `controller/`.
Current `js/src` instead has `GramlotRenderer extends RendererBase`, `references.js`
and `transport.js`. Recipes are absent from the active runtime.

Its setup still tells readers to install a sibling Python Builder wheel, although
the Gramlot-owned correction removed that requirement. Its final packaging paragraph
says npm packing creates `js/collections` and that npm test regenerates collections;
the current package scripts do neither. This guide can cause an agent to restore
removed layers or perform unnecessary dependency work. Rewrite it from current code.

### A4 · Contract pages can reintroduce retired architecture — high

[GC-065](065-host-adapters.md#gc-065-020) still documents `Host.fetch` and recipe
expansion; HTTP belongs to the Node/Bun adapter and neutral Host has no `fetch`.
[GC-080](080-builder-recipe-pipeline.md) asserts active recipes and the old renderer
hierarchy. [GC-087](087-javascript-layer-boundaries.md#gc-087-005) still labels
Gramlot → DOM JS → Builder JS “Authoritative logical ownership”; its opening note
says DOM JS retirement is undecided. The owner explicitly removed that active layer
on September 21. Section 075 also preserves the former Bag detached-creation hook
model, superseded by SourceBagNode construction through unchanged upstream Bag.

Retain the decisions as dated history, with a current ownership summary before them.
The current code and constitution do not authorize restoring these mechanisms.

### A5 · Bag audit still presents resolved requirements as pending — high

[GC-115 §4](115-bag-upstream-audit.md#gc-115-040) requests observable tag changes
and an owning-library correction. Its opening identifies the installed Bag with the
modified worktree. Later sections document the opposite final outcome: upstream Bag
installed unchanged, Builder subclass ownership corrected, tag replacement expressed
by delete/insert, and all three validator-specific findings closed.

The original conversation confirms an earlier inference error: a dependency on the
local `_createNode` extension was initially presented as proof Bag needed changes.
The user challenged it; comparison with Python removed that conclusion. The initial
finding must be explicitly superseded where it appears, rather than left as a task.

### A6 · Python ownership and Collection composition remain stale — high

[GC-092](092-collection-authoring.md#gc-092-005) assigns loading to both generic
libraries, calls differing declarations errors, and describes recipe propagation.
Amendment 11.14 superseded the collision/full-replacement proposals with ordered
composition. Amendment 11.16 assigns the bounded Python loader, typed registration,
mixed text and atomic rejected insertion to Gramlot. Current Python
`page/builder.py` and `_grammar_load.py` implement that choice.

Update this contract rather than reopening the already-decided Python ownership
question. The JS `sourceTarget` exception in 11.17 was explicitly superseded by
11.18; it is not a second supported path.

### A7 · Release messaging still implies the Python blocker is open — medium

[GC-090 §005](../public/090-classes-and-hosts.md#gc-090-005), in both views, says
generic Python and JS changes must land upstream. The recorded installed Python
wheel already passes with published Builder 0.23.2. Only the JS distribution issue
remains identified by the latest clean-install checkpoint.

GC-005 §020 still instructs authors to present the implementation as living in the
PoC; GC-020/025 and older collaborator guides contain variants of that wording.
README was corrected, but its downstream policy and evaluation pages were not fully
reconciled. Keep the richer PoC showcase distinct from the existing bounded core.

### A8 · Histories are too similar to instructions — high

At audit baseline GC-070 contains 1,631 lines / 114,325 characters; its “concise”
counterpart contains 1,569 lines / 109,027 characters, about 95% of the full text.
GC-094 adds 1,479 / 1,125 lines. `temp/handoff_ore_17.md` adds another 1,673 lines,
with many repeated “CURRENT CHECKPOINT” headings and both prepended and appended
updates. Document headers and physical position do not reliably identify the latest
decision. GC-070's new top warning helps, but does not fix linked documents.

This is measurable context duplication, not proof that a particular model failed
because of token volume. Keep a short current checkpoint and an explicitly historical
decision/evidence log, preserving chronology, IDs and rejected approaches.

### A9 · Scope and permission language needs explicit separation — medium

AGENTS retains “work only in Gramlot”; constitution §14 explicitly includes connected
adapters following the September 22 clarification. The instruction should point to
that clarification. Constitution amendments 11.15–11.18 physically precede older
11.12–11.14 and several narrowly authorized dependency corrections; reading only the
last paragraphs is unsafe. Completed exceptions must not look like general current
permission, and a later explicit owner decision must not be ignored.

GC-110 prohibits pushes in its local-readiness scope while the latest conversation
discusses distribution of existing Builder source through GitHub. Distinguish
read-only inspection, source preparation/push, npm/PyPI publication, version closure
and deployment. An unavailable dependency does not imply missing source code or a
need to change Builder. This audit does not grant new publication authorization.

### A10 · Repeated confirmations are not required by the project — high

On September 22 the user confirmed the GitHub direction and corrected repeated
questions about the already-declared `genropy/genro-builders-js` destination.
The coordinator then asked again. It also proposed making JS Gramlot self-contained
and removing its generic Builder dependency after finding the remote legacy package;
the user clarified that the latest maintained generic Builder must be used.

These were execution errors. AGENTS explicitly says not to ask again for a decision
already given. The request to confirm the *next phase* does not require reconfirming
an approved destination or asking for source-write permission when no code change
has been identified. A fresh task should receive resolved decisions, not replay them.

### A11 · Verification checkpoints do not identify one current release result — medium

GC-093/094/089 and PORT-0004 still prominently cite eight profiles or old unresolved
findings. The Worker migration retired Python standalone; current scope has seven
profiles. Node totals changed as tests moved to the adapter and page closure was added.
Neither 8/8 nor an old core count proves the current packaged graph.

Keep artifact/date/scope attached to each result. Record implementation, local checks,
clean installation, full host verification and owner acceptance separately.

### A12 · Structural documentation checks cannot catch these defects — medium

The 35 mirrors exist; explicit anchor sets match, and the scanned local Markdown
file links resolve. These are positive structural results. They coexist with the
semantic contradictions above. `scripts/check_public_docs.py` checks a public
allowlist, rendered links/search/source exposure and paired anchors, not the meaning
or recency of internal instructions. Passing Sphinx is not continuity acceptance.

<a id="gc-120-020"></a>

## 020 · Disposition of the six September 21 review findings

| GC-093 finding | Latest recorded disposition | Remaining distinction |
| --- | --- | --- |
| Q1 speculative validation/staging | Removed by explicit owner decision; GC-093 §110. | Do not reopen a rollback guarantee. |
| Q2 test-only candidate validator | Removed with Q1. | No replacement extension point requested. |
| Q3 hosted/standalone duplicated execution | Worker uses shared Host/Page execution; GC-093 §120. | Current packaged matrix still required. |
| Q4 HTTP/Host and Python loader boundaries | HTTP moved to adapter; existing Python loader retained; GC-110. | No separate Python FileHost required. |
| Q5 server page closure | HTTP close/dispose/pagehide implemented; GC-110. | Focused local checks are not the full matrix. |
| Q6 Python grammar distribution | Packaged canonical export chosen; local comparison recorded, CI deferred; GC-110. | Phase 5 release artifact comparison remains. |

This accounts for those six findings; it does **not** close GC-110 phase 2 or declare
architecture accepted. A final bounded review can still find new concrete defects.

<a id="gc-120-025"></a>

## 025 · Reliable continuation snapshot

- **Target:** local, verified Gramlot 0.1.0 native HTML and live typed Source.
  Recipes, reactive Data binding, databases and new component systems are deferred.
- **Implemented:** strict Source, live event rendering, branch freeze/unfreeze,
  shared Page/Host execution, Worker standalone, adapter-owned HTTP and page closure.
- **Dependencies:** local Builder JS and Gramlot's installed Builder both identify
  as `genro-builders-js` 0.1.3; `sourceTarget` exists and is consumed from the generic
  package. Python authoring lives in Gramlot under amendment 11.16. Bag is not an
  identified source-change requirement of the current milestone.
- **Recorded clean-install result:** Python wheel verified with published Builder;
  the latest recorded JS probe resolved the declared GitHub dependency to legacy
  `genro-dom-js` 0.1.0. Remote availability was not rechecked in this audit.
- **GC-110 state:** phase 0 complete; phase 1 partly complete with JS distribution
  unresolved; phase 2 in progress; phase 3 decisions complete; phase 4 pending;
  phase 5 pending with README/public-build/package checks already partly performed;
  phase 6 pending. Gramlot versions remain pre-release development versions.
- **Next technical prerequisite:** make the existing maintained generic Builder
  obtainable through its declared dependency, under the owning task's authorization;
  then prove clean installation. Do not substitute a new Gramlot implementation.
- **After that:** complete bounded review, seven packaged host profiles (Uvicorn,
  FastAPI, Kajenn, Flask, Node, Bun, Worker), documentation/package verification,
  local versioned artifacts and owner acceptance. Publication is a separate action.

<a id="gc-120-030"></a>

## 030 · Document disposition inventory

| Documents / records | Treatment needed |
| --- | --- |
| Constitution; AGENTS | Preserve principles/amendments; clarify current scope and superseded exceptions without inventing authorization. |
| docs/README; GC-086; GC-075/080/087/088/093/094 navigation | Route current execution to GC-110; explicitly classify earlier plans and checkpoints. |
| GC-070 and mirrors | Separate compact current state from chronological evidence; preserve historical decisions and test context. |
| GC-110 | Keep as sole current plan; reconcile historical baseline and current gates. |
| GC-065/080/085/087/092 | Reconcile runtime, authoring and ownership contracts with current decisions/code. |
| GC-093/094/115; PORT-0001–0004 | Preserve review/rejection history; explicitly mark resolved and superseded findings at their original locations. No implied port acceptance. |
| temp/handoff_2026-09-22.md | Historical banner is already present; use current checkpoint for execution. |
| temp/handoff_ore_17.md; GC-089 | Historical handoffs, not future startup instructions. |
| GC-005; public GC-020/025/090 | Align PoC/core distinction and Python versus JS installability. |
| GC-095/100 | Current native Source/Worker/no-recipe direction is broadly aligned with inspected code; retain declared limits. This is not full API certification. |
| GC-035/040/045/050; inventories and diagrams | Keep as proposals/PoC evidence, not 0.1.0 deliverables. Their existing disclaimers are useful. |
| GC-055/060 and HTML exports | Older explanatory material; distinguish target model from current release capabilities and preserve any intentional edition language. |
| GC-091/105 | Historical export evidence / explicit parity register. Open differences do not independently expand 0.1.0 scope. |
| Overview; GC-010/015; GC-030; documentation build guide | Product model, showcase, branding or verification guidance; not alternate release plans. |

<a id="gc-120-035"></a>

## 035 · Proposed next phase: documentary repair

Owner requested this detailed repair plan on 2026-09-22, after the audit. Planning
is complete; implementation awaits approval. This is one bounded documentary repair
phase, with five internal steps, not a replacement for GC-110's release phases.
Approval to execute it covers these steps without repeatedly asking about settled
decisions. A genuine new architectural choice stops only the affected correction.

**Outcome:** a contributor can resume the existing 0.1.0 work from maintained entry
documents without reconstructing three days of conversations or consulting an old
temporary handoff. Runtime and dependency source, release scope, versions and
publication are outside this repair. Every maintained change has its concise mirror.

### B1 · Establish current authority and navigation

Resolve findings A1/A9/A10. Use the constitution and latest explicit owner decisions
to build a current decision table inside the existing GC-110 context. Record each
decision's evidence and whether it is current, superseded or deferred; do not turn
an assistant proposal into owner approval. Give the constitution a clear route to
its current rules while preserving amendment identities and historical wording.

Update AGENTS, documentation entry points and repository maps so execution leads
to GC-070 for current status and GC-110 for the release plan. Preserve the existing
mandatory constitution/overview/port reading. GC-088/094 remain historical; qualify
every active phase reference with its plan ID. Explain that Gramlot includes the
approved adapter scope, with Builder/Bag edit boundaries and Python's bounded
ownership exception intact. Do not derive new publication permission from this plan.

Apply the owner's communication rule explicitly: report results, implications,
remaining work and next action; no routine Git-status/diff/file-list conclusions.
Necessary repository checks are not progress deliverables. Ask only about unresolved
decisions, not destinations or permissions already settled by the owner.

**Exit:** every current entry point identifies the same milestone, execution plan,
scope and authority. No older document presents itself as a competing current plan.

### B2 · Separate current state from historical evidence

Resolve A2/A5/A8/A11. Rebuild GC-070's current checkpoint around scope, implemented
behavior, dated verification, acceptance, open blockers and one next action. Aim for
roughly 80–120 lines in the full current checkpoint and 40–70 in its concise view;
retain necessary uncertainty rather than sacrificing correctness to a line target.

Move the long chronological material to clearly dated paired history, preserving
decisions, rejected approaches, artifact provenance and stable references. Existing
GC-070 section anchors must remain resolvable. Historical “current/next” text must
be visibly historical at the point of use. Date the GC-110 baseline and reconcile
its open questions with its phase table. Give old handoffs and ports explicit
status notices; original conversation records are never rewritten or deleted.

GC-093's six review findings receive current dispositions with their supporting
decisions/checks. They do not automatically close the broader design review. Old
eight-profile results remain dated evidence, never a current seven-profile result.

**Exit:** reading current status yields one coherent answer; old records cannot be
mistaken for a new instruction. No decision or verification evidence is lost.

### B3 · Reconcile contracts, operating instructions and release claims

Resolve A3/A4/A6/A7 and the remaining stale claims in A5/A11. Review GC-065/080/085/
087/092 against current code and owner decisions: no active recipe path, removed
renderer layers stay removed, neutral Host has no HTTP dispatcher, Bag uses its
upstream construction path, Collection composition follows the approved merge,
Python authoring belongs to Gramlot within amendment 11.16, and JS sourceTarget
comes from generic Builder under 11.18.

Correct setup and packaging descriptions using actual scripts and exports. Distinguish
the locally available Builder source from its distribution channel; retain the dated
Python clean-wheel result and JS availability blocker without promising a fresh
remote result. Preserve explicit deferred features and the single-process Host scope.

Align documentation policy, public evaluation/setup/class pages, README and their
mirrors on the bounded core versus richer PoC. Check older collaborator guides,
diagrams and HTML exports: update misleading current claims and regenerate affected
exports through their existing build process, or mark the historical edition clearly
where it belongs. Do not leave a contradictory rendered edition discoverable as
current. Preserve the RTD theme and intentional language of existing editions.

**Exit:** current technical claims have an implementation or an explicit scope/
status qualification. Historical contracts are labeled at their point of use;
no guide sends a contributor to restore a retired API or reopen a resolved decision.

### B4 · Verify structure and meaning

Resolve A12 and verify all A1–A12 corrections. Check paired paths, document IDs,
stable anchors, inbound links after moves, current source references and generated
editions. Scan both documentation trees, ports and known handoffs for obsolete
execution links and “current/open/next” assertions; classify historical matches
instead of deleting words mechanically.

Run the documented staging, strict Sphinx build and public boundary/link checks:
`scripts/prepare_docs.py`, Sphinx with `-W --keep-going -n`, and
`scripts/check_public_docs.py`, using the existing documentation environment.
Internal semantic review remains a separate gate because the public check cannot
establish it. Compare the repaired decision table with original owner instructions.
Do not add a new CI framework or repeat runtime suites solely for prose edits;
check any executable example whose documented behavior changes at the owning boundary.

Keep A1–A12 as a closure checklist with corrected references and evidence. A failed
check remains open; a dated passing test cannot conceal a new documentation conflict.

**Exit:** relevant documentation checks pass and all twelve findings are resolved
or have a concrete, explicitly reported blocker. No unsupported readiness claim.

### B5 · Prove that work can resume

Put a short continuation brief in the existing operating guide/current checkpoint,
not in another temporary handoff or new execution plan. It includes the target,
settled decisions, exclusions, verified baseline with dates, actual blocker, exact
first task and its completion criterion. GC-110 remains the authority for release
gates; the brief links to it rather than duplicating its evolving task list.

Perform a reader exercise using only the prescribed entry documents: can the reader
identify (1) the release scope, (2) current ownership, (3) decisions not to reopen,
(4) implemented versus locally verified versus clean-installed/accepted status,
(5) the unresolved dependency issue, and (6) the next action? Check answers against
the audit; any contradiction sends the affected document back to B1–B3. This exercise
does not create a task or delegate execution automatically.

The first technical task after repair is to **recheck availability of the existing
maintained generic Builder JS through the declared dependency**, identifying whether
the previous distribution blocker is still present. This starts read-only; the
destination is already established. Then perform the concrete owning-project
distribution action under the applicable authorization and prove a clean install.
Do not assume the remote remains unchanged, recreate Builder in Gramlot, or request
generic source-write permission without an identified source change.

**Exit:** all six reader answers agree, one actionable restart brief exists, and
GC-070 records completed repair plus the next GC-110 task. Report completion and
remaining release work in plain language. Documentary repair does not close the
release; the next technical phase still has its own verification and owner checkpoint.

No reset, architecture restart or model replacement is required by these findings.
At the time of the audit, the proposed repair had not yet been implemented; §045 records its later completion. Its durable result is coherent existing
documentation and an executable continuation, not another stack of competing plans.

<a id="gc-120-040"></a>

## 040 · Verification performed and limitations

- Node core: **74/74 passed**, no skipped tests. Command:
  `GRAMLOT_TEST_PYTHON="$PWD/.venv/bin/python" node --test js/tests/*.test.js`.
- Python core: **16/16 passed**. Command:
  `.venv/bin/python -m unittest discover -s tests -p 'test_*.py'`.
- Baseline structural scan: **35/35 mirrors**, equal explicit anchor sets, no
  missing targets among scanned local inline Markdown file links; seven explicit
  GC fragment references checked across both views without missing anchors.
- Logs: `/private/tmp/gramlot-continuity-node.log`,
  `/private/tmp/gramlot-continuity-python.log`; structural inventory:
  `/private/tmp/gramlot-doc-audit.json`. These are local evidence, not dependencies.

The audit changed no runtime, dependency source, package versions or original
conversation history. It adds this paired report and records completion in GC-070.
No fresh remote dependency installation, seven-host matrix, browser run, Builder
suite, Sphinx rebuild, publication or release acceptance is claimed for this audit.

<a id="gc-120-045"></a>

## 045 · Documentary repair closure — 2026-09-22

B1–B5 completed for documentation only. Earlier sections 005–040 preserve the pre-repair audit and proposal; their “pending” statements are historical. GC-110 remains the sole active release plan. This closure neither verifies the seven-host matrix nor accepts or publishes 0.1.0.

| Finding | Closure evidence |
| --- | --- |
| A1 | docs/README and GC-086/075/088/094 route execution to GC-070 status and GC-110 phases; GC-094 is labeled historical. |
| A2 | GC-110 §4 labels the September 21 baseline historical; §2 and its current decision register give the active state. |
| A3 | GC-085 maps actual renderer, references, transport and WorkerHost paths; Python uses published Builder 0.23.2; packaging commands no longer claim collection regeneration. |
| A4 | GC-065 states adapter HTTP/no Host.fetch; GC-080 marks recipes historical; GC-087 marks DOM JS layout superseded; GC-115 records unchanged upstream Bag closure. |
| A5 | GC-115 initial requests are explicitly superseded by Builder ownership, delete/insert and validator cleanup; GC-070 names no Bag blocker. |
| A6 | GC-092 follows ordered Collection add/update and Python 11.16; GC-110 register states JS 11.18 supersedes 11.17. |
| A7 | Public GC-090 distinguishes clean Python wheel from the JS dependency distribution blocker; GC-005/020/025 and older proposal guides distinguish bounded core from richer PoC. |
| A8 | GC-070 is the short current checkpoint; paired GC-125 preserves the former chronology with historical labels and GC-070 anchor stubs. GC-089, ports and temp handoffs carry historical notices. |
| A9 | AGENTS and constitution §14 identify approved Gramlot adapter scope and Builder/Bag boundary; GC-110 distinguishes source distribution, package publication, version closure and deployment. |
| A10 | GC-070/085 state one exact next task and preserve the already chosen Builder destination; no repeat confirmation is required. |
| A11 | GC-070 separates implementation, local checks, Python clean install, JS distribution, seven-host verification and acceptance; old 8/8 remains dated in GC-125/ports. |
| A12 | 37 paired Markdown paths and 273 current full-view explicit anchors were scanned; paired anchor sets agree and no duplicate full-view anchor was found. Strict Sphinx and public boundary/link/search/source checks passed. Semantic routing and B5 answers were reviewed separately. |

**Reader exercise from AGENTS, constitution, docs/README, GC-085, GC-070 and GC-110 only:**

1. Scope: native HTML and live typed Source, with seven host profiles; recipes, reactive binding, database integration and new components deferred.
2. Ownership: Bag/TYTX tree and transport; generic Builder JS grammar/SourceBag/`sourceTarget` and static rendering; bounded Gramlot Python authoring under 11.16; Gramlot live renderer/Page/Host; HTTP in the Node/Bun adapter.
3. Settled: strict SourceBag, ordered Collection composition, FIFO/freeze, delete/insert replacement, generic JS `sourceTarget`, Worker shared Page/Host, adapter HTTP, page-close best effort/TTL, Python Host loading and packaged grammar. Old DOM JS/recipe/8-profile paths do not reopen.
4. Status: implemented and locally tested core; Python clean wheel verified with published Builder 0.23.2; JS declared-dependency clean install and current seven-host matrix unverified; owner acceptance and publication open.
5. Blocker: the last JS clean probe resolved legacy `genro-dom-js` 0.1.0 instead of maintained generic Builder JS 0.1.3; current remote availability is unknown.
6. First task: read-only recheck of existing maintained generic Builder JS through the declared dependency. Completion means its current resolution is identified; if unavailable, perform only the applicable authorized owning-project distribution action and then prove clean installation before proceeding through GC-110.

The six answers agree with GC-120 §025 and GC-110's decision register. The next work is GC-110 phase 1 distribution/clean-install verification; documentary repair does not advance release acceptance.
