# 075 · Builder and renderer architecture review


> Historical review/plan. Current execution: [GC-110](110-native-html-readiness.md#gc-110-020); status: [GC-070](070-work-status.md).
> This document retains earlier decisions and checkpoints. Statements about pending
> extraction or completed verification refer to their recorded stage, not current
> architectural acceptance. GC-087's agreed ownership remains binding; GC-094 does
> not promote later review proposals into owner decisions.

Document ID: **GC-075**. Source inspection: 2026-09-19.

[Expanded counterpart](../../docs/internal/075-builder-renderer-review.md).

<a id="gc-075-005"></a>

## 005 · Evidence inspected

Read-only code/docs review, not compatibility tests. Inspected genro-builders
c6e4684, gramlot-poc10478b5 (genro-dom-js history plus actual JS code), and
genro-textual772e93b. Exact revisions/paths in expanded view; not dependency pins.
Textual's old handler imports an API absent from inspected current Python builders.

<a id="gc-075-010"></a>

## 010 · Generic rendering survives in Python

BuilderBase owns grammar/authoring and render orchestration. materialize collects
fragments; finalize assembles/delivers. RendererBase traverses and dispatches per
node dialect; rendered_item creates a fragment. Strings join only in finalization.
Textual render_type=object constructs widgets and mounts them. Python object
rendering was not removed with partial reactivity.

<a id="gc-075-015"></a>

## 015 · What was removed and what remains provisional

RX.1 removed partial queues/live/patch machinery; later tracking removal removed
BuilderHandler, pointer maps and Source subscriptions. removed-machinery.md points
to history. Older attic references are historical. Python static updates rerender.
RX.5 calls fine-grained reactivity a separate engine, not a static render mode:
shared grammar does not force one traversal. Static bottom-up differs from live
parent-first ownership needs. No formal LOT semantics are thereby approved.
Reactive transport must carry browser declarations without executing them server-side.

<a id="gc-075-020"></a>

## 020 · JavaScript implementation and naming

JS counterpart is PoC js/dom, descended from genro-dom-js. BuilderBase/SourceBag
author; RendererBase traverses; HtmlRenderer creates Elements; finalize composes
DocumentFragment; handler/builder separately carry reactive machinery. JS docs'
'Python strings' comparison applies to HTML, not all Python renderers. JS base
finalize is DOM-specific. Builder/Renderer naming is supported; internal separation
of coordination, dialect emission and target/lifecycle still needs design. No rename.

<a id="gc-075-025"></a>

## 025 · Consequences for the current Gramlot increment

Current Source facades and DOM builder are a tested slice but bypass existing
grammar and generic rendering extension points. Next: verify current APIs, reuse
authoring/grammar, define non-executing declaration transport, align renderer.
Preserve initial insert, Bag subscriptions, cleanup and setter/rebuild behavior.
No bulk reactive port, Python partial-render restoration or step2 CSS work.

<a id="gc-075-030"></a>

## 030 · Superseding implementation correction

The earlier “PoC only” location finding is superseded: sibling `genro-dom-js`
provides the generic grammar, RendererBase and RecipeExpander used here. Python/JS
GramlotBuilder dialects now reuse generic grammars; GramlotRenderer subclasses the
generic JS renderer; detached main/remote @source recipes expand before one active
Source insertion. Python snapshots generic structural tag/value into native
`tag`/`_text` wire attributes and never executes browser logic. Native HTML only;
no CSS shorthand. Local uncommitted library-pack tests are evidence, while floating
dependencies cannot carry additions until upstream acceptance. Final verification,
acceptance and publication remain pending.

Current correction: the snapshot/hydration approach described historically above was rejected and removed; GC-080 documents native registered SourceBag transport. Python ownership now resides under page/ and server/, with db/ reserved.
