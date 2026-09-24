# 160 · SourceNode, Data and provider execution: legacy investigation

> **Source audit (2026-09-24):** Read [GC-170](170-binding-source-audit.md) first.
> Historical observations and proposed compatibility cases below are not owner
> decisions. Segmented Data is excluded as a requirement; Gramlot may specialize
> Builder bases. Implementation is paused for review of the corrected basis.

Document ID: **GC-160**. Date: **2026-09-24**. Status: investigated, not implemented.
[Full counterpart](../../docs/internal/160-legacy-binding-flow.md).

<a id="gc-160-005"></a>
## 005 · Scope, authority and evidence

Owner includes SourceNode relative/symbolic access, GET/SET/PUT/FIRE, delays,
dataFormula and dataController from the outset. Preserve legacy public behavior;
GC-155 modules remain proposals. Four reports under PORT-0005 record exact evidence:
[SourceNode](../../ports/PORT-0005-data-binding/legacy-sourcenode-flow.md),
[logic](../../ports/PORT-0005-data-binding/legacy-logic-flow.md),
[delays](../../ports/PORT-0005-data-binding/legacy-delayed-flow.md),
[lifecycle](../../ports/PORT-0005-data-binding/legacy-lifecycle-flow.md).
Local working trees, not assumed pristine releases, were inspected. Full guide
records revisions and nested Python checkout provenance. No runtime changed.

<a id="gc-160-010"></a>
## 010 · The SourceNode is the execution context

Legacy funcCreate expands script macros separately from SourceNode methods.
SourceNode owns path/context resolution and relative reads/writes; routing indexes
are internal. GET supports autocreate/default and resolver _sourceNode context.
SET writes with notification; legacy PUT suppresses triggers. Published PUT merely
passes reason=false with doTrigger still true: an event was observed. FIRE triggers
then silently resets to null; published Bag omits fired from event payload. Legacy
fireEvent/fireItem/FIRE have distinct false/zero/empty defaults. FIRE_AFTER macro
is a delayed fired write, not the same API as delayedCall or global fireAfter.

<a id="gc-160-015"></a>
## 015 · Addressing and moving context

Recover ^, =, ==; relative/absolute paths, ?attrs, parents, symbols, aliases and
dynamic/callable datapaths. PoC volume/default-prefix semantics differ from flat
published Builder; both lose symbolic ?attr. Published == classification differs.
Legacy stable paths are indexed, movable contexts reevaluated as floating readers.
SourceNode performs final trigger filtering. Extra legacy symbolic forms remain
in the inventory even where they need forms/widget context not yet ported.

<a id="gc-160-020"></a>
## 020 · Startup to visible values

Source insertion -> build -> stripData/moveData -> resolve attributes -> create
view -> register dependencies -> Data trigger -> SourceNode filtering -> view or
provider execution. Provider nodes are nonvisual. _init, _onStart and _onBuilt are
separate legacy stages; PoC _on_start/startup formula ordering is not parity.
PoC has both setup(data) and data declarations. Current Host sends Source only;
initial Data delivery, null/collision/remount and remote branches need contracts.

<a id="gc-160-025"></a>
## 025 · Formula/controller propagation

Trigger -> setDataNodeValue -> optional delay -> setDataNodeValueDo -> fresh
arguments -> condition/body -> relative Data write -> nested dispatch. Both ^/=
are sampled; only ^ subscribes. Recover named args, _kwargs/_node/_triggerpars/_reason,
_if/_else, _userChanges and startup flags. Formula writes a result; controller runs
in node context. View anti-echo is not controller recursion prevention. PoC adds
live formula FIFO/dedup and recursion guards; distinguish these from legacy and
approved current Source FIFO. Control typing/null/IME/focus remain in scope.

<a id="gc-160-030"></a>
## 030 · Delayed execution is not one timer API

Global callAfter(reason) and fireAfter(path) share a keyed map. Node delayedCall
uses per-code ownership; provider _delay uses per-node pendingFire, latest event
metadata and freshly sampled bindings. Relative delayed writes, startup callbacks
and intervals are distinct. PoC adds explicit node timer cancellation. Inspected
legacy deletion clears intervals/watches but does not establish cancellation of
all pendingFire/_dc timers. Record the gap; do not assume or reproduce leaks.
Delay, live batching and Source freeze must remain separate contracts.

<a id="gc-160-035"></a>
## 035 · Removal, freeze and ownership

Insertion prepares declarations/readers; replacement/removal unregisters old work.
Handles must remain removable after detachment. Legacy frozen discarded content
is cleaned immediately although rebuilding waits. Dispatch snapshots subscribers.
Current Source cleanup/freeze does not implement Data/provider lifecycle.

<a id="gc-160-040"></a>
## 040 · Verification and limits

Executed PoC: SourceNode suites 33 pass; delayed suites 24 pass; separate provider
suite 8 pass overlaps those. Legacy bag_mixin 34 pass; frozen-discard vm harness 8
pass. Combined legacy comparison: 39 pass, 7 fail; fireItem comparison fails in
adapter construction, not an established semantic assertion. Other failures remain
unresolved. Direct published probe confirms PUT emits and FIRE resets. Do not sum
overlapping tests or claim browser/destination parity. Detailed reports cite logs.

<a id="gc-160-045"></a>
## 045 · Consequence for the implementation plan

Design around SourceNode and the complete provider flow. First contract cases:
PUT/FIRE, macro/method distinction, movable paths, expressions, startup/provider
conditions/order, delayed sampling/cancellation and disposal. Classify every gap;
no simplified substitute syntax. Formulas/controllers/delays are initial scope.
Remaining gates: legacy comparison failures, initial-data transport, indispensable
owner-approved deviations, upstream write permission beyond JSR migration, and
preserved/consolidated 0.1.0 baseline before develop. No runtime or branch changes.
