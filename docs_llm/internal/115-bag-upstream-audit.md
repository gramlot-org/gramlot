# 115 · Bag JS upstream dependency audit

Document ID: **GC-115**. Updated: **2026-09-21**.

<a id="gc-115-010"></a>
## 1. Scope and evidence

**Disposition (2026-09-22):** Sections 2–4 preserve the initial investigation, not outstanding requirements. The later Builder ownership correction, unchanged upstream Bag installation and delete/insert element replacement supersede the proposed Bag hooks and tag events. Validator-specific tests were corrected; see the dated closure below. Current release gates are in [GC-110](110-native-html-readiness.md#gc-110-020).

Read-only review authorized by the owner. No Bag/Builder repository, installed
source, manifest or version was changed. Isolated copies under /private/tmp were
used to compare source snapshots with identical Gramlot and Builder code.

Installed Bag JS 0.5.2 src equals the src tree in
`/Users/gporcari/Sviluppo/gramlot/worktrees/genro-bag-js-native-html`.
The worktree has uncommitted changes relative to HEAD
`f324b05535228372f042b813b2d9d182759aca39`, matching the upstream HEAD checked in
GC-110. This audit compares that revision, not an assertion about future upstream.
Installed Builder JS is 0.1.3. No dependency was pinned.

Evidence: `temp/bag-upstream-review/upstream-tests.log`, `local-tests.log`,
`probe.mjs`, and `location.txt`. The first isolated run lacked repository fixtures;
those were copied before the recorded complete comparison. No library patch was
applied to either compared snapshot.

<a id="gc-115-020"></a>
## 2. Findings by responsibility

| Finding | Concrete consequence | Assessment |
| --- | --- | --- |
| Local Bag adds `_createNode`; installed SourceBag overrides it to assign node builder ownership before insertion notification. Upstream creates nodeClass directly and never invokes this hook. | `builder.root.svg().circle(...)` fails because the SVG node retains the surrounding HTML builder context. | Real dependency on a local extension. Correct ownership before notification is required; this does not establish that the current hook is the final approved API. |
| Local Bag extends setValue with resolver/tag arguments and notifies on tag-only changes. | Upstream setItem changes a node from div to section with identical content but sends no event. Gramlot cannot update its DOM from an event it never receives. Two current tests also directly use the local extended setValue signature. | Real event gap plus a local API dependency. Do not silently require an unpublished signature. |
| Local Bag adds mutation validators, reentrancy protection, structural preflight, move projections and fired-write restrictions. | Neither installed Builder src nor Gramlot src/tests registers a mutation validator. Bag's own local tests exercise the new API. | Not demonstrated necessary for current Gramlot. Do not import this whole subsystem merely because it accompanies required changes. |
| Local setResolver replaces its implementation with setItem(path, null, ...). | After setItem('answer',42), setResolver('answer',null) preserves 42 upstream but changes it to null locally. | Confirmed behavioral regression in local changes. Consolidation as-is is unsuitable. |
| Recursive backrefs and nested notifications. | The observed-root contract test passes with upstream Bag. | Already available at the compared upstream revision; no local fix required for this contract. |

The pre-write subsystem is not the removed Gramlot DOM-veto implementation itself;
it is a generic Bag addition with no active registration in the reviewed consumers.
No conclusion is made about uninspected external consumers.

<a id="gc-115-030"></a>
## 3. Verification

Same isolated Gramlot suite, same Builder and other dependencies, changing only
the Bag snapshot: upstream **66 pass / 7 fail**; local **73 pass / 0 fail**.
Five failing cases concern SVG builder ownership, two concern tag changes or the
local setValue tag argument. The seven failures are not seven independent defects.
This is a targeted dependency comparison, not a fresh upstream graph installation.

Standalone probe using the public Bag setItem method changes only the tag:
upstream stores section but emits zero events; local stores section and emits one
upd_value event. The same probe demonstrates the setResolver value-loss regression.
The latter is not covered by the passing Gramlot suite, illustrating why source
review and comparison remain independent acceptance gates.

<a id="gc-115-040"></a>
## 4. Historical decision request — resolved

Do not promote all local changes. Required capabilities are complete subclass node
initialization before subscribers run, and observable tag changes through an agreed
mutation API. Bag owns node creation/event behavior; Builder owns Source-specific
builder assignment. Gramlot must not compensate for either with duplicate logic.

A bounded owning-library review/correction requires explicit authorization under
constitution §14. It must separate required capabilities from unused additions and
address the observed resolver regression. This report does not authorize deleting
other work, designing a new API, committing, publishing or editing dependencies.
GC-110 phase1 remains blocked on consolidation of dependency source; unaffected
Gramlot review can continue.


### Python ownership comparison — 2026-09-21

Python SourceBag declares `_node_class = SourceBagNode`; grammar dispatch assigns
the subbuilder to `child._builder` after element creation (_grammar.py). Ordinary
nodes resolve their builder from their parent. Python does not require a Bag
`_createNode` hook for this behavior.

An isolated JS candidate removes SourceBag._createNode and initializes the existing
SourceBagNode builder slot from its parent SourceBag's insertion context or builder.
This uses upstream Bag.nodeClass construction, completing ownership before synchronous
insertion subscribers execute. No new Bag hook or Gramlot workaround is needed.
Gramlot with upstream Bag:71/73 pass (the two tag-mutation cases remain). Generic
Builder candidate:107/110 pass, including insertion-observer ownership and reentrant
insertion tests; the remaining three tests explicitly require local Bag mutation
validators. These are test consumers missed by the earlier runtime-only consumer
search; they do not establish a Python-port requirement for that API.

The owning Builder repository and installed dependencies are unchanged. Automatic
approval review rejected application to the external Builder repository, interpreting
'imitate Python' as inspection rather than explicit reopening of dependency edits.
No constitutional amendment landed. Explicit permission to change Builder JS is
required before application; no Bag edit is proposed. Candidate/logs remain under
the isolated audit directory and temp/bag-upstream-review.


### Approved correction applied — 2026-09-21

After explicit owner authorization, changed the owning Builder JS repository:
SourceBagNode initializes its existing builder slot from the parent SourceBag's
insertion context or builder; removed SourceBag._createNode. Added a synchronous
insertion-observer regression and documented the Python timing difference. No Bag
source or installed copy changed, no version bump or publication.

Verified actual corrected source copied to the isolated upstream-Bag environment:
Builder Node107/110 and Bun107/110. Three remaining tests require the local Bag
mutation-validator API. Gramlot Node71/73; five SVG failures are resolved and the
two local tag-mutation API cases remain. Logs: temp/bag-upstream-review/*applied*.log.
Working installations are intentionally not refreshed: their modified Bag constructs
nodes detached, unlike upstream's parent-aware nodeClass path. No compatibility
branch was added to support that local modification. The approved source correction
is complete; clean-install readiness and tag mutation remain open.


### Tag mutation comparison with Python — 2026-09-21

Read-only verification in Gramlot's Python environment: Bag.set_item updates
node_tag on an existing node before calling set_value. If value and attributes
are unchanged, set_value emits no event. SourceBag/SourceBagNode do not override
this behavior. Bag and HtmlBuilder.source both change div to section silently;
changing value too produces upd_value with the new tag. Python set_value has no
node_tag argument. The separate system environment behaves identically.

Upstream JS therefore matches Python for this case. The local JS setValue tag
argument and tag-only notification are extensions, not Python-port parity fixes.
The earlier 'event gap' finding describes a limitation for live tag updates, not
evidence that JS Bag must be changed to match Python. Static rendering sees the
new tag when explicitly invoked; live rendering needs a notification.

No runtime changes. Decision pending: keep in-place tag mutation outside the
current live contract and use existing delete/insert for element-type replacement,
or explicitly design an additional Source-layer operation. No new API approved.


### Element replacement accepted and upstream Bag installed — 2026-09-21

Owner approved delete plus insert for live element-type replacement; in-place
tag-only updates are excluded. Updated the two Gramlot tests to exercise explicit
replacement and old-record/DOM cleanup. No new API or runtime workaround.

Installed a package built from unchanged upstream Bag HEAD f324b055 and the
corrected Builder JS sources. Verified installed Bag src file hashes equal the
upstream snapshot. First-party manifests remain floating, no lockfile or version
bump. Rebuilt browser bundles. Installed core: Node73/73, Bun73/73, Python16/16.
Evidence: temp/bag-upstream-review/installed-*.log and build.log.

This removes Gramlot's dependency on the patched Bag archive. It does not establish
a fresh published dependency graph: corrected Builder remains local. Its three
validator-specific tests remain unresolved, distinct from the now passing Gramlot
suite. Other adapters/examples have not been reinstalled by this step; the current
full host matrix and broader readiness review remain open.


### Review of the three validator-specific Builder tests — 2026-09-21

Read-only comparison confirms Python Builder does not register a Bag mutation
validator. Python performs grammar checks while authoring, before attaching the
resulting branch. Existing JS test `rejected nested authoring leaves a scalar
parent unchanged` already covers this grammar responsibility without a Bag veto.

1. `a validator rejecting a proposed native branch leaves scalar content untouched`
   installs an arbitrary veto on a grammatically valid leaf. This tests the local
   Bag extension, not Python Builder parity. Recommend removing that test.
2. `validators and subscribers see complete ownership on the original node class`
   combines a local-veto observation with a useful insertion-subscriber observation
   of a prebuilt subtree. Preserve node identity and complete descendant ownership
   assertions for actual insertion; remove the validator part and explicitly assert
   an observation occurred.
3. `rejection restores branch ownership while subscriber failure preserves committed
   ownership` combines rollback after the local veto with useful post-insertion
   subscriber-error behavior. Preserve error propagation, committed ownership and
   insertion-context cleanup; remove the veto-only half.

SourceBag._setBuilderItem still stores previousBindings and has a pre-insertion
restore branch whose comment explicitly references validation rejection. This is
an implementation review item, not grounds to recreate the Bag validator. Its
necessity must be assessed against actual upstream failure paths separately from
retaining the required try/finally insertion-context cleanup.

No source/test changes in this review. These findings do not authorize Bag changes.


### Validator cleanup completed — 2026-09-21

Owner approved the bounded Builder JS cleanup. Removed the arbitrary-veto test;
preserved insertion-subscriber ownership checks with an explicit observation count.
Replaced the veto-dependent restoration case with a genuine upstream rejection:
node_label '#missing' fails before insertion. A detached prebuilt branch retains
its original builder. Therefore previousBindings restoration has a concrete purpose
and remains; the comment now describes Bag insertion failure instead of validators.
The subscriber-error case and reentrant insertion-context cleanup remain covered.

No addMutationValidator/removeMutationValidator/_createNode references remain in
Builder source/tests. Generic Builder:109/109 Node and109/109 Bun with unchanged
upstream Bag. Strict Sphinx succeeds. Packed corrected owner sources, refreshed
Gramlot's installation and rebuilt bundles; core Node73/73 passes. No Bag changes,
new API, version bump, dependency pins, lockfile or publication. Evidence:
temp/bag-upstream-review/{builder-clean-*,gramlot-clean-node,install-clean}.log.

This closes the three validator-specific test findings and source-ownership audit
for the reviewed scope. It does not close host/lifecycle/grammar decisions, the
current seven-profile matrix, or published dependency availability.
