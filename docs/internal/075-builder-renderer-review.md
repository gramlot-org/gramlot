# 075 · Builder and renderer architecture review


> Historical review/plan. Current execution: [GC-110](110-native-html-readiness.md#gc-110-020); status: [GC-070](070-work-status.md).
> This document retains earlier decisions and checkpoints. Statements about pending
> extraction or completed verification refer to their recorded stage, not current
> architectural acceptance. GC-087's agreed ownership remains binding; GC-094 does
> not promote later review proposals into owner decisions.

Document ID: **GC-075**. Source inspection: 2026-09-19.

[Concise counterpart](../../docs_llm/internal/075-builder-renderer-review.md).

<a id="gc-075-005"></a>

## 005 · Evidence inspected

This is a source/documentation review, not a compatibility test or a port acceptance.
The following revisions identify the inspected local evidence, not dependency pins:

- genro-builders `c6e4684914db4f3fd72c8f53b39ca270bfb6d89e`: architecture-contract.md
  (RND.1, RX.1–RX.5), render-architecture.md, render-layer-browser.md,
  reactivity/removed-machinery.md, builder/base.py and renderer/base.py.
- gramlot-poc `10478b57ce3f22e6445eb6b72eba343520cbebac`: historical genro-dom-js
  architecture documentation and actual js/dom/src builder-base.js,
  builder-handler.js, renderer/base.js and contrib/html/html-builder.js.
- genro-textual `772e93b68e600cd63efb1744f4df675dc8b9fcab`: TextualHandler,
  TextualRenderer, README and dependency declaration. This is historical evidence;
  its handler imports an API absent from the inspected current Python builder tree.

<a id="gc-075-010"></a>

## 010 · Generic rendering survives in Python

BuilderBase owns authoring/grammar and orchestrates rendering. materialize(mode)
walks the Source and keeps the produced fragments; render composes that step with
finalize. RendererBase performs a shared traversal with dispatch to each node's
own dialect. rendered_item creates one result; finalize assembles and delivers.

The traversal collects fragments without assuming they are strings. String
renderers join in finalize; object renderers override assembly/delivery. Textual
demonstrates the latter: render_type='object', real Widget results, children passed
to widget constructors, then mounting in finalize. Python is not restricted to
string output, and removing partial reactivity did not remove object rendering.

<a id="gc-075-015"></a>

## 015 · What was removed and what remains provisional

RX.1 records removal of Python's partial-update machinery with contract v0.9.0:
live critical sections, render queues, render_nodes and patch optimization/protocol.
The following tracking removal also removed BuilderHandler, pointer_map and Source
subscription scaffolding. removed-machinery.md locates these in exact Git history.
Some older architecture pages also reference an attic snapshot; do not mistake
those historical references for current installed APIs.

Static Python updates mean changing data and rendering again. Browser rendering
is the primary direction when the recipe is delivered to JS. RX.5 explicitly says
fine-grained reactivity is a separate engine, not merely another static render
mode. Share authoring vocabulary; do not assume identical runtime traversal.
The static traversal is bottom-up, whereas a live object tree may need parent-first
construction and retained ownership. This research is evidence, not approval of
formal Live Object Tree semantics for Gramlot.

For the reactive path Python transports declarations; it must not execute browser
data/controller declarations merely because static create() would execute them.
The precise bridge from genro-builders to Gramlot still needs a bounded contract.

<a id="gc-075-020"></a>

## 020 · JavaScript implementation and naming

The inspected JS counterpart lives in the PoC's js/dom tree, descended from
genro-dom-js; it was not found as a separately installed genro-builders-js package.
BuilderBase/SourceBag handle grammar and authoring; RendererBase walks nodes;
HtmlRenderer.renderedItem produces Elements; finalize assembles a DocumentFragment
and delivers through the target. BuilderHandler/BuilderBase also carry reactive
subscriptions, batching and partial updates. Those are distinct responsibilities.

The JS documentation's shorthand 'Python strings / JS objects' describes its HTML
dialect comparison, not the generic Python renderer's capabilities. Its current
RendererBase.finalize is concretely DOM-specific despite the generic traversal.

Owner-proposed naming: Builder denotes Source authoring; Renderer denotes browser
realization and updates. Preserve a distinction inside the renderer module between
reactive coordination, dialect-specific rendering and destination/lifecycle. Exact
class names and composition remain to be settled; no rename was performed in this
inspection-only step.

<a id="gc-075-025"></a>

## 025 · Consequences for the current Gramlot increment

The hand-written Python/JS Source facades and native DOM builder demonstrate the
minimal flow, but do not yet integrate the existing builder grammar/source model
or generic rendering extension points. A rename alone would not close this gap.

Next: verify current builder dependency APIs, reuse authoring/grammar where viable,
define the declarative transport path without executing browser behavior, then
align the native HTML renderer with the reviewed responsibilities. Retain the
owner's initial-insert path, native Bag subscriptions, recursive cleanup and
setter-versus-rebuild behavior. Do not bulk-copy the historical reactive engine,
restore Python partial rendering or add CSS shorthand during this step.

<a id="gc-075-030"></a>

## 030 · Superseding implementation correction

The earlier inspection correctly rejected a cosmetic rename and direct reuse of
Python static rendering, but its statement that the generic JavaScript library was
only in the PoC is superseded. A sibling `genro-dom-js` checkout contains the actual
generic grammar, `RendererBase` and recipe expansion facilities used by this work.

The working tree now implements the bounded direction: Python and JavaScript
`GramlotBuilder` classes define the Gramlot dialect on their respective generic
grammars; `GramlotRenderer` extends the generic JavaScript `RendererBase`; and a
generic `RecipeExpander` transforms detached main and remote `@source` trees before
one insertion into observed Source. Intermediate trees are not rendered. Python
uses an explicit snapshot conversion because the current native runtime wire stores
`tag` and `_text` as attributes while generic Python SourceBag stores structural
tag/value fields. Browser declarations remain inert in Python.

This remains native HTML only, without CSS shorthand. Local generic-library pack
tests are development evidence. The floating dependency declaration will not carry
uncommitted sibling-library additions until they are accepted upstream. Final
combined verification and owner acceptance remain pending; no publication occurred.

Current correction: the snapshot/hydration approach described historically above was rejected and removed; GC-080 documents native registered SourceBag transport. Python ownership now resides under page/ and server/, with db/ reserved.
