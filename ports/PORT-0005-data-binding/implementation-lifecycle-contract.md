# PORT-0005 · Destination lifecycle contract

> **Authority review:** [GC-170](../../docs/internal/170-binding-source-audit.md)
> supersedes normative inferences in this dated report. Code observations are
> evidence, not approved requirements. In particular, volume paths, fired metadata
> and expression differences do not establish upstream defects or required ports.

Status: bounded Gramlot prerequisite implemented and characterized, 2026-09-24. This is a destination implementation contract for the proposed binding flow in [GC-155](../../docs/internal/155-binding-implementation.md) and the recovered legacy sequence in [GC-160](../../docs/internal/160-legacy-binding-flow.md). It does not assert reactive binding acceptance.

## Current verified boundary

`GramlotBuilder` owns a Data Bag and `SourceBagNode` retains authored `^` and `=` declarations. Generic Builder `runtimeValues(node)` evaluates them at mount. The Gramlot renderer now calls that same method on Source attribute and scalar-value updates, including a branch's `_text`; it leaves the Source declaration intact. The HTML view skips an unchanged native `value` assignment so an unrelated Source update does not reset an input caret. The renderer owns mounted records, synchronous Source events, freeze/thaw and `onDispose` callbacks. A Data write alone does not refresh a mounted view.

Run the current characterization with:

```sh
cd js
node --test tests/binding-lifecycle-baseline.test.js
```

The cases cover static Data evaluation, untouched pointers, same-element Source updates, input caret preservation, replacement/disposal cleanup and a frozen branch that reads current Data on thaw. The current missing-reactivity observation lives outside the normal suite in a temporary diagnostic harness:

```sh
node --test ports/PORT-0005-data-binding/current-nonreactivity.test.mjs
```

Remove that harness when PORT-0005 installs Data subscriptions and replace it with positive reactivity cases in the normal suite. Its assertion is not the binding contract.

## Required runtime hooks for the next increment

1. **Page preparation.** Provide one page Data root to all of its Source builders. Execute setup data and transparent Source data declarations in the recovered order before the first dependent view. A declaration has an initialization owner and runs once per insertion, rather than during each visual refresh. Define one typed host-neutral initial payload after the transport audit; do not accept parallel wire shapes.
2. **SourceNode evaluation.** Keep relative and symbolic path resolution, pointer classification and runtime evaluation on the generic SourceBagNode/Builder boundary. The mounted record retains the original declaration and the declaring SourceNode. Do not cache only an absolute path for movable contexts. Record dependencies for `^` and expression peers according to resolved contracts; `=` is evaluated when another cause refreshes its node but does not subscribe by itself.
3. **Data routing.** Attach one page-owned Bag subscription. A binding index maps effective Data dependencies to mounted records and holds reverse registration handles for removal. Match exact, ancestor and descendant paths on segment boundaries, preserve value-versus-attribute events and origin/fired information, and snapshot affected records before invoking them because callbacks may mutate Source.
4. **Projection.** Route affected records through the current renderer's synchronous Source mutation ownership. Re-evaluate with generic Builder methods, update text/attributes in place, and keep a native control's identity, focus and selection when its value is unchanged. Write native edits through the SourceNode relative-data method with the originating node; a peer still observes the canonical Data value. No application listener or second datastore is involved.
5. **Dynamic Source.** Register dependencies on insertion. On deletion, replacement, pointer change or changing ancestor/symbolic datapath, unregister using the handles captured at registration, then reindex the affected subtree under its current context. Never recompute a removed node's relative path to discover what to release.
6. **Freeze and disposal.** Data continues changing during Source freeze; thaw projects the latest canonical value once under the renderer's existing branch semantics. Remove subscriptions, native listeners, providers and queued/delayed work when their owning Source record leaves, including partial mount failure. Page disposal removes the root Data subscription. A detached control must not write into Data.

## Acceptance checks to add with implementation

- Data writes refresh `^` text and attributes synchronously; `=` alone remains passive, but a peer-triggered refresh rereads it. Source pointer strings remain unchanged.
- Source subtree removal/replacement and page disposal return subscription/listener counts to baseline; a detached input event does not write Data. Exercise failed mount and frozen removal.
- Moving an inherited or symbolic datapath reindexes all descendants; changes to the old path stop updating them, while changes to the new path do. Distinguish `a.b` from `a.bc` and node attributes from node values.
- Repeated fired events and origin suppression preserve the recovered Bag event contract. Formula/controller and delayed provider work follows the separately recorded execution and cancellation order, not Source freeze timing.
- Input/textarea/select/checkbox writeback has explicit null, empty, invalid, composition and focus cases. Host tests cover typed initial Data delivery through Python, JavaScript HTTP and Worker profiles.

The published generic Builder and Bag differences recorded in GC-160 and the PORT-0005 evidence remain upstream defects or unresolved contract decisions. In particular, expression `==`, symbolic `?attr`, PUT trigger suppression and fired event metadata cannot be replaced with Gramlot parsers or event workarounds. Binding-related changes in those libraries require a separate owner authorization; the present change stays inside Gramlot's renderer and tests.
