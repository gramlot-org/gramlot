# 120 · Continuity audit for the 0.1.0 milestone

Document ID: **GC-120**. Audit date: **2026-09-22**.
Status: **audit preserved; documentary repair B1–B5 completed 2026-09-22**.

[Expanded counterpart](../../docs/internal/120-continuity-audit.md).
This is an audit, not a new plan or amendment. [GC-110](110-native-html-readiness.md#gc-110-020)
is the current plan. The owner meant first release **0.1.0**, not GC-094 phase 1.

<a id="gc-120-005"></a>

## 005 · Conclusion and evidence boundaries

Confirmed continuity defects: obsolete routing, superseded instructions presented
as current contracts, and long mixed-order histories. They can cause repeated
decisions or restoration of retired architecture. No file-corruption or
model-specific cause is established. Repeated confirmations and confusing missing
distribution with missing implementation are also demonstrated execution errors.

Scanned all 35 full Markdown documents and 35 mirrors structurally. Semantic review
focused on instructions, entry points, plans, status, contracts, public claims,
four ports and two handoffs. Inspected 233 September 20–22 UTC turns (77/109/47)
in **ex Coordinatore** and **coordinatore**, focusing on owner decisions/outcomes;
also checked **Controlla stato repository** for the Builder location. Inspected
current relevant code/manifests and reran core tests, not a full implementation audit.

<a id="gc-120-010"></a>

## 010 · Reconstructed decision sequence

- September 20: design-first GC-094; implement settled behavior without inventing
  solutions. Python-referenced generic Builder, one JSON grammar, static HTML in
  Builder, live rendering in Gramlot. Recipes deferred; strict typed Source required.
- September 21: 0.1.0 = native HTML/Source live only; DOM JS removed. Collection
  composition adds/merges, omitted/null preserves. Speculative rendering removed;
  FIFO and branch freeze/unfreeze approved. Standalone becomes JS Worker/Host/Page
  with Node/npm exporter; Python standalone retired, leaving seven profiles.
- GC-110 establishes readiness gates. Builder ownership is corrected using unchanged
  upstream Bag; tag replacement is delete/insert; validator-specific findings close.
- September 21–22: HTTP belongs to adapter; page-close implemented; minimal Host
  remains single-process, Python file loader stays in Host. Packaged Python grammar
  retained; CI drift enforcement and Safari/Firefox verification deferred.
- September 22: amendment 11.16 assigns bounded Python authoring to Gramlot;
  11.18 supersedes 11.17's local JS handle mapping: generic sourceTarget remains.
  Bounded 0.1.0 precedes application-led 0.1.1/0.1.2 corrections and later 0.2.0.

The latest coordinator partially repaired the September 22 handoff, GC-070 reading
warning and GC-110 Python checkpoint. The following defects remain.

<a id="gc-120-015"></a>

## 015 · Findings and concrete consequences

| ID | Severity | Defect and consequence |
| --- | --- | --- |
| A1 | High | docs/README, GC-086 and GC-075/080/087/088 still route execution to GC-094. Three plans give phase 1 different meanings. GC-094 retains contradictory active phase/priority labels. Route to GC-110. |
| A2 | High | GC-110 phase table closes host/grammar decisions and Python installation, but its baseline calls them open and describes the former patched Bag archive as current. Mark baseline historical. |
| A3 | High | GC-085 retains recipes, removed renderer classes/directories, unnecessary sibling Python wheel setup, and nonexistent js/collections/npm-test generation behavior. Rewrite from current code. |
| A4 | High | GC-065 still documents Host.fetch and recipes; GC-080 old recipe/renderer paths; GC-087 labels DOM JS ownership authoritative and retains old Bag creation-hook assumptions. These paths were superseded. |
| A5 | High | GC-115 §4 asks for changes/decisions resolved by its later entries: unchanged upstream Bag, Builder subclass correction, delete/insert tags, validator cleanup. Mark initial findings superseded where stated. |
| A6 | High | GC-092 still assigns Python loading to generic Builder, rejects conflicting declarations and describes recipes. Amendments 11.14/11.16 changed those contracts; 11.18 retired the temporary JS handle mapping. |
| A7 | Medium | Public GC-090 still says both generic Builders must land upstream; Python wheel already passed with published Builder. GC-005/020/025 and old collaborator material retain inconsistent PoC-only implementation wording. |
| A8 | High | GC-070 has 1,631 lines, mirror 1,569 (~95% of full characters); GC-094 1,479/1,125; old handoff 1,673 with repeated current headings and mixed update order. Separate active state and history. This is not proof of model-specific failure. |
| A9 | Medium | AGENTS should reference §14's adapter scope clarification. Constitution amendment order is nonchronological; completed narrow exceptions resemble active permission. Separate source distribution, package publication and deployment. |
| A10 | High | Conversation confirms repeated repository/permission questions after answers and an overbroad JS-independence proposal. AGENTS prohibits asking again; phase confirmation does not mean reconfirming settled decisions. |
| A11 | Medium | Prominent 8/8 and old core counts describe superseded artifacts; current scope has seven profiles. Separate implementation, local checks, fresh installation, matrix and acceptance. |
| A12 | Medium | Mirrors, anchors and local links pass structural checks, but internal meaning/recency is outside the public Sphinx/check_public_docs gate. Semantic review is required. |

These are stale-context defects and execution errors, not authority to change the
architecture. The full report gives the exact documentary and conversation evidence.

<a id="gc-120-020"></a>

## 020 · Disposition of the six September 21 review findings

Q1 staging and Q2 test-only validation removed (GC-093 §110); Q3 duplicate page
execution addressed by shared Worker/Host (GC-093 §120); Q4 HTTP split/Python loader,
Q5 page-close, Q6 packaged grammar settled in GC-110. CI grammar enforcement is
deferred; release artifact comparison remains. This does not close phase 2 or
grant design acceptance; a bounded final review can find concrete new defects.

<a id="gc-120-025"></a>

## 025 · Reliable continuation snapshot

- Target: native HTML/live Source 0.1.0. No recipes, Data binding, DB or new components.
- Implemented: typed Source, live event rendering, freeze/unfreeze, shared Page/Host,
  Worker, adapter HTTP and page-close. Python authoring correction belongs to Gramlot.
- Local/installed generic Builder JS is 0.1.3 with sourceTarget. Latest recorded
  clean probe found legacy genro-dom-js 0.1.0 at the declared GitHub dependency;
  this audit did not recheck remote availability. No current Bag change is required.
- GC-110: phase 0 complete; 1 incomplete on JS distribution, Python clean wheel
  verified; 2 in progress; 3 decisions complete; 4 pending; 5 pending with some
  checks performed; 6 pending. Gramlot remains at development versions.
- Next prerequisite: distribute existing maintained generic Builder through the
  declared dependency under owning-task authorization, then verify clean install.
  Do not recreate it in Gramlot. Complete bounded review, seven packaged profiles,
  documentation/packages, local versioned artifacts and owner acceptance afterward.
  Publication remains separate.

<a id="gc-120-030"></a>

## 030 · Document disposition inventory

- Constitution/AGENTS: preserve decisions; clarify current scope/supersession.
- Entry maps and GC-075/080/087/088/093/094: current routing to GC-110.
- GC-070/110: compact current state, historical evidence, reconciled gate status.
- GC-065/080/085/087/092: repair current contract/API descriptions.
- GC-093/094/115, four ports, GC-089 and handoffs: preserve rejection/verification
  history; mark superseded findings. No inferred port acceptance.
- GC-005/public GC-020/025/090: align core/PoC and Python/JS installability claims.
- GC-095/100: broadly align with inspected native/Worker/no-recipe scope; not full
  API certification. GC-091/105 remain export evidence/explicit parity register.
- GC-035/040/045/050 and inventories: proposals/PoC evidence, not release tasks.
  GC-055/060/HTML exports: older explanatory material, scope needs clear dating.
- Overview, GC-010/015/030 and build guide are not alternate execution plans.

<a id="gc-120-035"></a>

## 035 · Proposed next phase: documentary repair

Owner requested the detailed plan on 2026-09-22. Planning complete; repair awaits
approval. One documentary phase contains B1–B5, not new release phases. Approval
covers the internal steps; no repeated questions on settled choices. Stop only the
affected correction if a genuinely new architectural decision is necessary.

Outcome: resume 0.1.0 from maintained entry documents without reconstructing old
chats/handoffs. No runtime/dependency edit, scope change, version or publication.
All maintained documentation changes include their concise counterpart.

**B1 — Authority/navigation (A1/A9/A10).** Record current/superseded/deferred
decisions and owner evidence in existing GC-110 context. Preserve constitutional
amendments and mandatory constitution/overview/port reading. Route instructions,
indices and maps to GC-070 status / GC-110 execution; label GC-088/094 historical
and qualify phase IDs. Clarify approved adapter scope, dependency boundaries,
Python exception and communication: results/remaining work, no routine Git/diff/file
summaries, no repeated resolved questions. No new publication authorization.
Exit: every current entry agrees on milestone, plan, scope and authority.

**B2 — State/history (A2/A5/A8/A11).** Short current GC-070: scope, implementation,
dated verification, acceptance, blockers, one next action. Aim for 80–120 full /
40–70 concise lines without losing uncertainty. Preserve long evidence in paired
dated history and keep existing anchors resolvable. Mark obsolete instructions
locally; reconcile GC-110 baseline/table, old handoffs/ports and GC-093 Q1–Q6.
Do not rewrite original conversations or convert old 8/8 into current seven-profile
verification. Exit: one coherent current state, no lost decisions/evidence.

**B3 — Contracts/claims (A3/A4/A6/A7 and remaining A5/A11).** Reconcile GC-065/080/
085/087/092 with code/decisions: no recipes/retired renderer paths, adapter HTTP,
unchanged upstream Bag construction, approved Collection merge, Gramlot Python
authoring (11.16), generic JS sourceTarget (11.18). Correct real setup/packaging;
separate existing local source from distribution, dated Python clean install from
JS blocker. Align public/core/PoC wording, policy and mirrors. Review old collaborator
guides, diagrams and HTML editions; regenerate affected exports or clearly classify
historical editions. Preserve RTD styling and intentional edition language.
Exit: every current claim matches implementation or an explicit status/limit.

**B4 — Verification (A12/all findings).** Check mirror paths, IDs, anchors, moved
links, source references and generated editions. Scan docs, ports and handoffs for
obsolete routing/current/open/next claims, distinguishing historical text. Run
existing staging, strict Sphinx (`-W --keep-going -n`) and public-boundary checks.
Review semantics separately against owner decisions. Maintain A1–A12 closure evidence;
report actual blockers. No new CI system or runtime-suite repetition for prose alone;
verify changed executable examples at their owning boundary.
Exit: relevant checks pass and all findings resolved or explicitly blocked.

**B5 — Resume exercise.** Put a short continuation brief in existing operating/status
documents, linking GC-110 instead of copying its task list. From prescribed entry
documents alone, answer: release scope; ownership; settled decisions; implementation/
local verification/clean installation/acceptance; dependency blocker; next action.
Contradictions return to B1–B3. No automatic new task/delegation.

Next technical task after repair: read-only recheck of the existing maintained
generic Builder JS's availability through the already-established dependency;
remote state may have changed. Then the concrete owning-project distribution action
under applicable authorization, followed by clean-install verification. Do not
recreate Builder, assume stale remote state, or ask for source edits without a
concrete change. Exit: six consistent answers, actionable brief, completed repair
recorded with the next GC-110 task. Release closure remains separate.

No reset, architecture restart or model replacement is justified. At audit time, repair had not yet been implemented; the outcome is coherent existing docs, not competing plans.

<a id="gc-120-040"></a>

## 040 · Verification performed and limitations

Rerun: **Node 74/74**, **Python 16/16**. Baseline: **35/35 mirrors**, equal explicit
anchor sets, scanned local Markdown file links resolve; seven explicit GC fragment
references resolve across both views. Logs: `/private/tmp/gramlot-continuity-node.log`,
`/private/tmp/gramlot-continuity-python.log`; inventory: `/private/tmp/gramlot-doc-audit.json`.

Only this report pair and GC-070 completion record are added. No runtime/dependency
change, original history edit, new remote install, seven-host/browser verification,
Builder suite, Sphinx rebuild, publication or release acceptance is claimed.

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
