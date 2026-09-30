# 165 · Binding 0.2.0 execution plan

> **Historical reference — superseded for execution on 2026-09-25:**
> [GC-210](210-binding-contract.md) records the owner-confirmed 0.2.0 contract
> and phase plan; [GC-070 §490](070-work-status.md#gc-070-490) records current work.
> GC-175 is a historical handoff, not the current checkpoint. The body below
> preserves earlier proposals, observations and dated evidence; its pause/next-step
> language is historical. Legacy data/path quotations do not define the new API.
> Source provenance rules remain valid and do not reopen later owner decisions.

> **Source audit (2026-09-24):** Read [GC-170](170-binding-source-audit.md) first.
> Historical observations and proposed compatibility cases below are not owner
> decisions. Segmented Data is excluded as a requirement; Gramlot may specialize
> Builder bases. Implementation is paused for review of the corrected basis.

Document ID: **GC-165**. Date: **2026-09-24**.
Status: implementation paused for source/contract review; GC-170 governs evidence use.

[Paired version](../../docs_llm/internal/165-binding-execution.md).
[Behavioral investigation](160-legacy-binding-flow.md) · [Ownership](155-binding-implementation.md) · [Port evidence](../../ports/PORT-0005-data-binding/README.md).

<a id="gc-165-005"></a>
## 005 · Objective and execution boundary

Deliver one maintainable SourceNode-centred Data flow: initialization, relative and
symbolic addressing, reactive/passive pointers, expressions, native controls,
GET/SET/PUT/FIRE, dataFormula, dataController and owned delayed execution. Preserve
legacy authoring wherever evidenced; do not introduce replacement binding objects,
a second parser, duplicated Data state or another DOM rendering queue.

The owner requested a detailed plan and Sol agents implementing the necessary work.
Owner subsequently clarified that Gramlot may specialize Python/JS Builder base
classes using their public APIs. Upstream writes are not a general prerequisite;
real library defects require executable tests and issues (amendment 11.42). Publication is outside this implementation request.

Work now uses the existing develop branch. Its formerly attached secondary checkout
was clean and was detached at the same revision; all local work was preserved.
Earlier 0.1.0 work remains present and unconsolidated. Do not label it accepted or
mix its release verification with the new binding verification.

<a id="gc-165-010"></a>
## 010 · Work packages, dependencies and completion gates

| ID | Deliverable | Dependency | Completion evidence |
| --- | --- | --- | --- |
| B0 | Executable compatibility matrix and diagnosis of legacy comparison failures | GC-160 | Reproducible observations, desired contract and owning defect separated; no false parity claims |
| B1 | Consistent resolved projection on initial render and Source updates; unchanged native values preserve selection | Existing Builder runtimeValues | Real Source/DOM tests; no rewritten declarations, duplicate parser or dependency edits |
| B2 | Gramlot SourceNode/Builder specialization using public APIs; report proven upstream defects | B0 and amendment 11.42 | Silent PUT, FIRE reset/metadata/repetition, expressions, symbolic attribute tails, dynamic context; upstream and consumer tests |
| B3 | Canonical initial Data and provider declaration contract across authoring/hosts | B0; resolve namespace and wire decisions | Python, JS and Worker carry the same typed content; no old/new shape fallback; missing/null/remount cases |
| B4 | SourceNode execution and reactive projection, including formula/controller/delay | B1–B3 | One complete Data-to-provider-to-view flow with startup order, current arguments, trigger metadata and cancellation |
| B5 | Native two-way controls | B4 | Text, textarea, select, checkbox, range/number cases; peer propagation, passive writeback, origin, IME and caret retention |
| B6 | Dynamic scopes and lifecycle hardening | B4, in parallel with B5 where independent | Insert/delete/rebind, changing symbolic target, parent replacement, freeze/thaw, failure cleanup and no detached activity |
| B7 | Teaching pages and complete host verification | B4–B6 | Python-first paired JS examples, README per page, runner category README; Python/Node/Bun/Worker evidence |

No package is complete merely because its code exists. Every completed row requires
its tests, reviewed ownership and documentation. Formula/controller/delay belong to
B4's first complete execution flow, not a later optional feature.

<a id="gc-165-015"></a>
## 015 · Concrete implementation responsibilities

**Bag:** use its documented typed data and change-event APIs. Silent writes already
work through doTrigger=false. A legacy fired payload is not a stated Bag requirement. Do not teach Bag
about HTML, providers or Source pointer syntax.

**Builder bases / Gramlot specialization:** use the generic public APIs and assign
Gramlot-specific pointer, Data and expression semantics to the appropriate subclass. Preserve declaration
strings. A browser index asks SourceNode for current context rather than caching a
permanent interpretation of movable paths. Macro compilation and callable methods
are separate contracts; do not silently substitute one for the other.

**Gramlot lifecycle:** prepare page Data and Source before the first projection;
execute nonvisual data declarations and providers under SourceNode context. Record
provider ownership even when there is no DOM element. Keep initialization separate
from rerendering so user edits are not reset.

**Binding routing:** use one page Data subscription and removable registration
handles. Match path segments, ancestor/child changes and attribute selectors;
snapshot candidates before callbacks. Movable contexts must reevaluate their path
and registration when relevant Source/Data context changes. Do not clone legacy
Dojo infrastructure or blindly copy PoC's static Map.

**Renderer and native controls:** project Builder-resolved values into existing
records, preserving node identity. DOM listeners belong in reusable core code and
write through SourceNode relative Data methods. Control display conversion is
separate from stored values; invalid input policy must follow the recovered case.

**Provider execution:** preserve distinct _init, _onStart and _onBuilt ordering,
_if/_else, argument evaluation and trigger context. Formula dependencies and cycles
need explicit behavior; synchronous controller recursion must not be mistaken for
DOM scheduling. Keyed provider delay replaces pending execution and samples bound
Data at execution time, preserving the latest trigger's metadata.

**Timers:** distinguish delayedCall, provider _delay, _timing and delayed Data writes.
Each callback has an owner and cancellation path; keyed replacement and unkeyed
scheduling are not interchangeable. Cleanup must cover removal, replacement,
page disposal and failed mounts. A legacy cleanup gap is not a reason to leak work.

<a id="gc-165-020"></a>
## 020 · Proposed verification scenarios for contract review

1. Two views share a reactive value; a passive reader updates only on evaluation;
   editing a permitted passive control still writes Data. Source pointers remain intact.
2. A relative path follows its SourceNode; changing an ancestor or symbolic target
   redirects reads/writes without leaving stale subscriptions. ?attribute stays intact.
3. SET notifies, PUT changes Data silently, repeated FIRE notifies and resets silently;
   false, zero, empty and omitted values retain the operation-specific contract.
4. Expressions evaluate current peer arguments; reactive dependencies trigger the
   expression, passive arguments are sampled, cycles/errors are explicit.
5. Initial setup and data declarations have a deterministic collision/null policy;
   branch replacement does not accidentally reset unrelated user Data.
6. Formula output updates a view; a controller receives the expected trigger/context;
   conditional execution and distinct startup hooks run in their documented order.
7. Rapid triggers replace a delayed provider call; its arguments come from current
   Data, its trigger metadata comes from the latest trigger, and deletion cancels it.
8. Native edits preserve focus/caret/IME; another control receives canonical Data;
   checkboxes and numeric/range inputs preserve their recovered types and null rules.
9. Source changes during callbacks remain FIFO for DOM work. Freeze defers projection;
   thaw shows current Data/Source. Deletion must release owned subscriptions/timers.
10. Every host profile passes typed initialization and the same end-to-end page behavior;
    standalone also works from local files, with no server dependency.

Use deterministic clocks for timer ordering and real browser checks for focus,
composition and local-file behavior. Mocks cannot establish native event parity.
Keep diagnostic expected-failure probes outside the normal passing regression suite;
promote corrected cases to their owning library's regression suite.

<a id="gc-165-025"></a>
## 025 · Decisions that must not be guessed

- Dependency attribution: prefer Gramlot specialization; demonstrate an API contract
  violation before opening an upstream issue. No upstream source edits are authorized.
- Data addressing: settle page ownership and SourceNode context from current owner
  decisions. Historical builder volumes are excluded as requirements, not an
  equally authoritative design option. No replacement model is inferred as approved.
- Declaration vocabulary: current HTML `data` is a native element, while nonvisual
  declarations use dataSetter/destination/func. Resolve legacy authoring ownership
  before changing these names; do not silently repurpose the HTML element.
- setup Data delivery: current Host sends Source only and directly invokes Page.main;
  Page.setup is not an established current API. Decide the canonical host-neutral
  representation after checking both authoring paths, not from a convenient payload.
- Legacy-only symbolic contexts requiring forms, rows or widgets: preserve in the
  inventory, report missing owning capabilities, and agree bounded release coverage.
- Any indispensable legacy deviation must state its concrete effect and obtain an
  owner decision. Internal module names and straightforward implementation choices
  do not need repeated approval.

<a id="gc-165-030"></a>
## 030 · Parallel execution and review

Sol agent A implements runnable dependency contract probes and diagnoses comparison
failures. Sol agent B implements/tests the bounded resolved-projection prerequisite
and lifecycle characterization. Root owns the detailed plan, initialization review,
architecture review, integration and verification. Files are assigned separately;
no agent may edit installed dependency source or invent missing generic APIs.

After contract resolution, assign Gramlot specialization and lifecycle implementation
independently where their interfaces are settled. Track actual upstream defects
separately and verify corrected dependency artifacts before using affected APIs. Parallelize native control
coverage and lifecycle tests once B4 supplies their shared contract.

Review each added class, state field and execution path against its concrete owner.
Run focused suites first, then the full affected core suites and host/browser cases.
Do not publish, bump a release or claim 0.2.0 ready from these preparatory steps.
Execution results belong in GC-070 and the port record; this plan defines the gates.


Confirmed upstream defect: [Builder JS issue #1](https://github.com/genropy/genro-builders-js/issues/1), symbolic attribute selector loss. Bag silent writes already work through doTrigger=false. PUT/FIRE/== legacy expectations are not by themselves dependency defects.
