# 155 · Binding recovery and maintainable implementation

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

Document ID: **GC-155**. Status: design reference; execution requested 2026-09-24, see GC-165.

[Full counterpart](../../docs/internal/155-binding-implementation.md).
[Recovery evidence](../../ports/PORT-0005-data-binding/README.md).

<a id="gc-155-005"></a>
## 005 · Compatibility before implementation

Use verified legacy behavior as the reference and review proposed differences; module simplification is not
permission to simplify public behavior. The owner requests maintainability and
maximum legacy similarity. This proposal assigns responsibilities, not approval
of unresolved semantics or permission to edit upstream repositories.

Owner clarification after this first proposal: SourceNode context, GET/SET/PUT/FIRE,
delayed calls, dataFormula and dataController belong in the initial investigation
and design. They are not optional additions at the end. Module names below remain
provisional pending the end-to-end legacy investigation (GC-160).

Keep ^, =, == expressions, datapath, node attribute paths and symbolic paths.
Do not replace them with binding objects. Gramlot-specific evaluation may belong
in specialized Builder/SourceNode classes; do not duplicate an existing API.
Passive reads do not imply read-only controls. Keep initial Source declarations
and runtime values distinct. Both setup(data) and root.data declarations exist
in PoC; recover delivery/order rather than choosing one for implementation ease.

<a id="gc-155-010"></a>
## 010 · Ownership and modules

Names below are proposed internal names; they add no application-facing DSL.
Prefer composition around the current renderer, not a new renderer hierarchy.

| Owner | Responsibility | Excluded responsibilities |
| --- | --- | --- |
| Bag | Typed values, node attributes, paths and documented mutation events | Source grammar, HTML and input parsing |
| Builder bases and Gramlot specializations | Generic APIs plus Gramlot-specific evaluation and SourceNode behavior in the appropriate specialization | DOM subscriptions or browser listeners |
| Gramlot page lifecycle | One page Data root shared by its builders; prepare initial data/Source in the agreed order | Database, persistence or automatic server synchronization |
| BindingIndex | Data subscriptions and the relation between Data dependencies and mounted Source records | DOM mutation, formulas, fetching or a second Data store |
| GramlotRenderer / HtmlElement | Evaluate through Builder and project the result onto existing DOM records; own mount/freeze/dispose | Reimplement pointer syntax or write values back into declarations |
| NativeInputBinding | Read a supported native control, write through Source relative-data API with its origin, own listener cleanup | Own datastore, validation/forms business logic or RPC |
| Data declaration execution | Initial setters and later formula/controller lifecycle, kept separate from view projection | Rendering HTML or a second event bus |

Suggested files: js/src/binding/index.js, native-input.js, plus a data-declaration
module only when its recovered lifecycle is implemented. Do not precreate empty
framework abstractions, plugin registries or speculative interfaces. Expression
semantics must distinguish the generic contract from Gramlot specialization;
upstream defects require a public-API test and an issue, not speculative changes.

<a id="gc-155-015"></a>
## 015 · One observable update route

1. Mounted Source retains its original pointer/expression. The renderer obtains
   resolved text/attributes through Builder for both initial mount and updates.
   HtmlElement must not overwrite resolved values with raw Source declarations.
2. BindingIndex records only reactive dependencies (including those needed by an
   expression according to its recovered contract), with forward and reverse
   indexes. A single page Data subscription routes changes to affected records.
3. Match exact, ancestor and descendant paths on path-segment boundaries. Preserve
   value/attribute distinctions and fired/origin semantics; string prefix matching
   must not confuse a.b with a.bc. Snapshot affected readers before callbacks.
4. Refresh resolved values in place. Do not rebuild an input on every Data write;
   preserve identity, focus and selection. Avoid setting a native value property
   when unchanged. A non-origin view must still observe the canonical Data value.
5. Native input events write through the Source node's data API, carrying the
   Source origin. They do not modify Source pointer strings. Passive bindings
   remain writable wherever the recovered control contract permits.
6. Source insertion registers dependencies; deletion removes them using recorded
   registration data, not paths recomputed after detachment. A pointer change or
   changing ancestor/symbolic datapath reindexes all affected consumers. Preserve
   movable-path semantics; a cached absolute string alone is insufficient.
7. The existing Source mutation queue remains authoritative for DOM work. During
   freeze, Data changes remain in Data; thaw projects current values. Do not add
   a second asynchronous render loop. PoC live batching is a separate contract:
   recover nesting, formula ordering and synchronous controllers explicitly.
8. Record disposal unregisters bindings/listeners/providers, including queued
   work. Page disposal releases the root Data subscription. Test partial mount
   failure as well as successful unmount.

No fallback parser, duplicate event bus, surrogate Data state, proxy around a
missing dependency method, or silent unsupported-input coercion is proposed.

<a id="gc-155-020"></a>
## 020 · Initial data and host independence

Recover setup data and transparent data declarations together. Typed values must
stay typed across Python, JavaScript HTTP and Worker hosts. Initial data must be
available before resolving the first view; data declarations in inserted branches
must execute under their recovered lifecycle, not on every visual refresh.

The current Host response contains only typed Source. The initialization contract
must therefore explicitly address setup data delivery as well as declaration
execution. If the result needs Source plus initial Data, define one canonical
host-neutral typed representation, update all owned transports and tests together,
and do not accept both old and new shapes through a permissive fallback. This is
a proposal conditional on the transport audit, not an already chosen wire format.

Compatibility cases must settle overwrite/null/missing behavior, branch reinsertion,
remote Source initializers, shared versus builder-local namespaces and failure
atomicity. A user edit must not be reset just because a view is refreshed. Do not
infer server synchronization from an initial snapshot.

<a id="gc-155-025"></a>
## 025 · Incremental delivery and acceptance

| Step | Concrete deliverable | Gate |
| --- | --- | --- |
| 1. Recover executable contracts | Shared case inventory with legacy, PoC and destination results; decision references | Every differing behavior is a defect, unresolved question or explicitly accepted deviation |
| 2. Establish API use and specialization | Implement agreed Gramlot behavior using base APIs; report proven library defects | No inferred upstream requirement; Python/JS authoring contract |
| 3. SourceNode Data execution and projection | Initial data, GET/SET/PUT/FIRE, formula/controller scheduling, delayed calls and reactive projection as one tested flow | Recovered order/context/cancellation plus ^/= /==; three host profiles |
| 4. Native two-way controls | Input/textarea/select/checkbox and further controls according to recovered type/event contracts | Origin/peer propagation, no caret loss, null/empty/invalid and composition tests |
| 5. Dynamic Source and lifecycle | Added/removed/rebound scopes, symbolic targets, parent Data replacement, freeze/dispose | No stale readers, duplicate initialization or leaked listeners |
| 6. Teaching and release verification | Examples/binding pages, paired READMEs and host parity for the complete flow | SourceNode, logic, delayed calls and controls taught together |

These are implementation increments, not approval to omit later rows from the
0.2.0 release. Ordering of initialization and logic is interdependent: implement
provider behavior and delayed execution with step 3 rather than postponing them
to the documentation increment. Do not postpone a prerequisite while declaring its consumer finished.

GC-165 records the preserved development baseline and the prepared develop branch.
Earlier 0.1.0 consolidation remains separate unfinished work. Current
Bag/Builder edit permission is scoped to JSR migration; binding-related upstream
changes need explicit owner extension, not inference from that earlier exception.
This does not block evidence gathering or drafting destination contract cases.

<a id="gc-155-030"></a>
## 030 · Contract cases and decision gates

- Pointer families: ^, = and ==, expression peer dependencies/cycles, Source text
  and attributes, no unapproved escaping mechanism.
- Paths to review: absolute/relative and ?attr (PoC volumes are historical evidence only),
  #parent/#FORM/#ANCHOR/#id, then all recovered additional legacy symbolic forms;
  dynamic scopes must not silently bind the wrong Data subtree.
- Events: node/container/child, value versus node attributes, insert/delete,
  parent replacement, repeated fired events and origin suppression.
- Initialization: setup plus data declarations, explicit null, existing values,
  remount, inserted remote branches, page isolation and typed transport parity.
- Controls: passive writeback, input/change/live/legacy names, bool/text/numeric
  types, null versus empty/invalid, IME and format separate from stored values.
- Lifetime: subscription count returns to baseline, detached branches cannot
  write, queued work removed, focus retained, latest Data visible after thaw.

Where PoC and legacy disagree, record the source/test evidence and concrete impact
before asking the owner. Already recorded syntax decisions are not open questions.
This design does not claim complete binding. GC-165 and GC-070 track the newly
authorized implementation and actual checks.


Detailed work packages, dependencies and gates: [GC-165](165-binding-execution.md).
