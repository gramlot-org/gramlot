# PORT-0005-data-binding

> **Current execution contract — 2026-09-25:**
> [GC-210](../../docs/internal/210-binding-contract.md) and constitution 11.47
> supersede this historical investigation's proposals/gates. GC-175 is a dated
> handoff. dataSetter(destination_path, value), Source-only delivery and R1 are
> settled; R3 is provisional for S12 tests, not an undecided alternative.
> Current continuation is [GC-070 §490](../../docs/internal/070-work-status.md#gc-070-490).
> The evidence and prior proposals below are preserved, not execution instructions.

> **Authority review:** [GC-170](../../docs/internal/170-binding-source-audit.md)
> supersedes normative inferences in this dated report. Code observations are
> evidence, not approved requirements. In particular, volume paths, fired metadata
> and expression differences do not establish upstream defects or required ports.

- **Status:** implementation requested; bounded prerequisites in progress, complete binding not accepted
- **PoC revision:** `gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`
- **Destination revision:** current Gramlot develop working tree; see execution checkpoint below
- **Constitution points checked:** 3, 4, 5, 7, 13, 14

## Evidence

Read-only inspection of the local PoC working tree (HEAD above; this is not a
claim that every inspected file is unchanged from HEAD):

- `js/dom/src/builder-handler.js`: reactive pointer index, ancestor/descendant
  invalidation, removal and formula/service lifecycle coupling.
- `js/dom/src/application.js`: input/change writeback, value/checked pointers,
  typing and origin/reason handling; intertwined with forms and widgets.
- `js/dom/src/renderer/base.js`: resolved runtime values.
- `js/dom/tests/abs-datapath.test.js`: relative/absolute paths, symbols and volumes.
- `src/gramlot/showcase/demo/pages/hello_binding.py`: initial data declarations,
  relative pointers and shared input/preview values.

Repository: https://github.com/gramlot-org/gramlot-poc

Current published Builder already contains SourceBagNode.pointerType, pointers,
absDatapath, getRelativeData/setRelativeData and Builder.runtimeValues. Gramlot
already shares builder.data as app.data and creates a main Bag. These are existing
primitives, not proof that reactive Data binding works in Gramlot today.
Host main/source currently return typed Source only; author-side builder.data is
not delivered as an initial Data payload. GramlotRenderer subscribes to Source,
not Data. Its direct update path passes raw declarations to HtmlElement.update.

## Recovery priority — owner clarification

Owner requests a complete recovery before proposing a reduced contract, with
GenroPy legacy as the reference for doubts and maximum behavioral similarity.
The proposal below predates that clarification and is provisional, not an agreed
scope reduction. Inventory all pointer forms and semantics before deciding what
to introduce in 0.2.0; record any deviation explicitly.

Legacy reference checkout: `/Users/gporcari/Sviluppo/Genropy/genropy`, HEAD
`fa35e5adfa6ad1b269f3a22a9b12c4c1ee6513ea`; PoC and legacy working trees are inspected
read-only. Agent evidence will be retained under this port.

## Consolidated recovery result

Detailed evidence is preserved in [pointer/path recovery](pointers.md),
[reactivity and lifecycle](reactivity.md), and [initial Data and writeback](data-writeback.md).
Each report distinguishes code evidence, existing tests and executed verification.

| Concern | Recovered behavior | Current destination gap |
| --- | --- | --- |
| Reactive/passive pointers | ^ subscribes; = reads when evaluated without subscribing; passive editable pointers can still write in PoC | Static reads exist; Data subscription and writeback do not |
| Inline expressions | == expressions, peer attributes, cycle/error behavior | Published Builder classifies == as passive pointer |
| Paths | Relative/absolute, builder volumes, volume:path, ?attr, #parent, #FORM/#ANCHOR/#id | Flat upstream paths differ; symbolic ?attr is lost in PoC and Builder |
| Legacy additional addressing | Dynamic datapaths, symbolic aliases and #ROW/#WORKSPACE/#DATA/*S; Bag-level ../ and projections | Not all are recovered in PoC; explicit compatibility inventory required |
| Initialization | setup(data) and Source data/dataSetter declarations both exist in PoC | Current Host ships Source only; no equivalent initialization at mount |
| Data changes | Exact/ancestor/descendant reader matching, origin reason, fired, batching | Core handles Source mutation only; fired and attribute selectivity need owning-library tests |
| Controls | value/checked writeback, passive write permission, event timing, anti-echo, null behavior | Native adapters/writeback absent; widget behavior cannot stand in for generic behavior |
| Lifetime | Source removal unregisters readers/providers; live batches formulas and patches | Must integrate with core mount records/FIFO/freeze; live is not freeze |

## Existing owner decisions recovered

PoC docs/context/decisions.md, “Binding syntax preserved” and “Legacy compatibility
priority” (2026-09-10), explicitly preserve ^path/=path and reject bind/read/literal
wrappers or tagged replacement objects. No escape mechanism was approved. Legacy
syntax and behavior should be retained unless an indispensable difference is
explained and discussed. The current owner direction reaffirms this priority.
An earlier live-update naming exception is not proof that every proposed alias
or default was accepted. See the source evidence in the reports.

## Correction to the initial proposal

The initial restricted design sketch is superseded by this recovery record.
Do not present root.data versus setup Data as mutually exclusive simply to simplify
implementation: both exist in the PoC. Establish their actual delivery, ordering,
collision/remount and remote-fragment behavior before specifying the destination.
Likewise, do not restrict passive pointers to read-only controls or silently omit
expression/symbolic forms because the current Builder lacks them.

The clean implementation should preserve this public behavior while assigning
generic path/value/event work to Builder/Bag and browser projection/writeback and
cleanup to Gramlot. A whole-file copy of PoC Application/BuilderHandler would also
import services, grids, databases and obsolete patch transport; it is not a clean
recovery of the binding contract.

## Verification

Executed on the PoC without runtime modifications:

- pointer/abs-datapath/expression: 42 passed;
- writeback/embryo/input-null: 35 passed;
- reactive-logic/local-logic/branch-preparation: 27 passed.

Total: 104 focused tests passed. This is not the full PoC suite, a legacy browser
run or proof of destination compatibility. Full logs were retained in /private/tmp.
Root additionally probed the current Builder/Gramlot: ^name initially renders Ada,
a Data write to Grace does not update the DOM, and Source remains ^name. Current
Builder returns '=' for pointerType('==quantity * price'), 'field' for absDatapath
('field'), 'vol:field' for absDatapath('vol:field'), and 'main.form.x' for
absDatapath('^#FORM.x?caption') under datapath main.form. These reproduce gaps,
not desired semantics.

## Destination review and remaining decisions

**Historical checkpoint:** the following continuation is superseded by GC-210.
Current S00 delivery, the enrollment gate and subsequent phase boundaries are in
GC-070 §490; published 0.1.0 delivery is already complete.

- **Result:** recovery evidence assembled; runtime port not implemented/accepted.
- First close the compatibility matrix against executable cases: expressions,
  volume/root paths, symbolic attribute tails, moving datapaths, typed writeback,
  initialization/remount, fired payload and attribute-specific triggers.
- Preserve legacy decisions already established; ask only about real unresolved
  differences and release sequencing, not whether to reinvent the syntax.
- Scope 0.2.0 increments explicitly. Features not in the first increment remain
  recorded recovery work rather than disappearing from the contract inventory.
- Existing 0.1.0 ZIP/integration delivery remains separate unfinished work.

## Feedback for later ports

Recover code, tests and owner decisions together. PoC behavior, legacy behavior
and published dependencies can differ; never label a missing upstream capability
as an intentional product simplification. Do not conflate Data reactivity with
Source mutation, static resolution, controller scheduling or transport delivery.


## End-to-end SourceNode investigation

Owner explicitly includes SourceNode relative/symbolic context, GET/SET/PUT/FIRE,
delayed operations, dataFormula and dataController together from the outset. The
earlier staged sketch must not defer these to optional later enhancements.

The [consolidated investigation](../../docs/internal/160-legacy-binding-flow.md)
links four detailed reports: [SourceNode](legacy-sourcenode-flow.md),
[formula/controller](legacy-logic-flow.md), [delayed calls](legacy-delayed-flow.md),
and [mount/freeze/disposal](legacy-lifecycle-flow.md). These supersede any inference
from the first reports that reason=false already makes published PUT silent.
Direct execution proves that it does not. No runtime port is implemented yet.


## Execution started — 2026-09-24

Owner requests the detailed plan and Sol implementation. [GC-165](../../docs/internal/165-binding-execution.md)
records deliverables, dependencies, ownership, acceptance scenarios and unresolved
contract gates. Two Sol agents implement executable dependency probes and the
resolved-projection/lifecycle prerequisite. Generic dependency corrections still
require the requested explicit extension of the Bag/Builder edit boundary.

- [Executable dependency probes](contract-probes.md): 1 matching assertion, 6 gaps
  across PUT, FIRE metadata, expressions and symbolic attribute selectors.
- [Initialization contract evidence](initialization-contract.md): Page host execution
  bypasses Builder.create/setup; current HTML data and legacy data declarations
  must not be conflated. No new payload or authoring alias is approved here.
- All seven historical comparison failures are traced to adapter construction via
  missing _nodes.splice. Their semantic assertions remain unverified.

Earlier no-runtime statements above describe the investigation checkpoint, not
the newly authorized implementation stage. No complete binding or release acceptance
is claimed.


## API ownership correction — owner decision

Amendment 11.42 supersedes the blanket dependency-modification gate above.
Gramlot specializes Python/JS Builder base classes using public APIs.
Bag silent writes are verified working through doTrigger=false. The dependency
probe's legacy comparison gaps are not all library defects. Only the symbolic
attribute loss is currently reported as a reproduced upstream defect:
https://github.com/genropy/genro-builders-js/issues/1 . The issue contains its
full public-API test. No upstream code was changed.


## Legacy Data browser trace — 2026-09-25

[Complete data declaration flow](legacy-data-declaration-flow.md) records installation, arguments, Bag transfer, events, cleanup, PoC differences and the 22-assertion diagnostic.
