# 080 · Builder, renderer and recipe pipeline


> **Historical recipe pipeline.** Current execution: [GC-110](110-native-html-readiness.md#gc-110-020); status: [GC-070](070-work-status.md).
> This document retains earlier decisions and checkpoints. Statements about pending
> extraction or completed verification refer to their recorded stage, not current
> architectural acceptance. Current ownership follows GC-110 and constitution amendments 11.16/11.18.

Document ID: **GC-080**. Status: **historical recipe and renderer contracts; typed Source transport remains current**.

[Expanded counterpart](../../docs/internal/080-builder-recipe-pipeline.md).

<a id="gc-080-005"></a>

## 005 · Contract and ownership

`GramlotRenderer` extends generic `RendererBase` directly. The earlier `HtmlSourceRenderer`/`DomRendererBase` hierarchy described below is retired. Gramlot owns native DOM realization,
subscriptions and lifecycle through its local `HtmlElement`. Generic Builder JS
owns grammar, typed Source and static rendering; its
bundled HTML5 renderer produces text and adapts CSS keywords. Dynamic CSS reuse
is still pending. Gramlot no longer depends on DOM JS; that repository is retained
as reference. [GC-087](087-javascript-layer-boundaries.md) §035–050 records these
superseding decisions. Python rendering stays outside the browser pipeline.

<a id="gc-080-010"></a>

## 010 · Typed Source transport and ownership

Python and JS GramlotBuilder author native generic SourceBag trees. SourceBag is
registered with TYTX under the shared `SOURCE` suffix: generic Builder JS registers its type, while Gramlot Python performs the bounded registration under amendment 11.16.
TYTX outer encoding carries the root type; Bag serialization carries registered
branch types and structural node tags. Scalar text remains a node value. Mixed
text preceding children uses the Gramlot `_text` attribute at authoring time.

Bag/TYTX own serialization, reconstruction, backrefs and events. Generic Builder JS owns its SourceBag registration and builder association; Gramlot Python owns its bounded TYTX registration, grammar loading and insertion policy under amendment 11.16.
Gramlot owns its HTML vocabulary, renderer and main/remote coordination. Source
transport rejects ordinary Bags; it does not coerce them into SourceBag instances.

The previous snapshot to ordinary Bags and subsequent hydration were rejected in
owner review: passing adapter tests did not prove the intended contract. Those
conversions are removed. No extra Bag wire format is introduced.

**Historical API:** Python `root.recipe(name, /, **params)` authored a recipe-tagged node;
`name` may also appear inside the parameter dictionary. Main and explicitly
exposed `@source` methods serialize the native SourceBag through TYTX directly.

<a id="gc-080-015"></a>

## 015 · Historical detached browser expansion — deferred

Historically, main and remote trees expanded named/nested recipes while detached, then inserted
once into observed Source. Unknown/recursive recipes fail first; no intermediate
rendering/events. Native HTML only: no CSS shorthand, component inventory, Python
browser execution or formal LOT semantics.
Recipes come from the application constructor registry. Default bootstrap does not
discover modules; a custom runtime URL wrapper can configure it.

<a id="gc-080-020"></a>

## 020 · Dependencies, verification and status

Active JS dependencies are genro-bag-js, genro-tytx and genro-builders-js.
Python uses genro-builders, Bag and TYTX. The Python wheel now passes with published Builder 0.23.2. Maintained generic Builder JS 0.1.3 source is local; its declared GitHub dependency last resolved to legacy `genro-dom-js` 0.1.0. Recheck availability before treating this as a current remote result. Local verification uses normal package-manager installs
of npm archives and Python wheels; see the current procedure in
[GC-085](085-operating-guide.md#gc-085-020).

[GC-070](070-work-status.md) is the current verification ledger. Earlier checks
recorded here (Python9, Node25/Bun25, generic Python403/JS117 and browser host
recipes) are historical checkpoints, not evidence of the current installed app.
The current JS dependency removal, static HTML implementation and CSS precedence
have separate checks there. Running Python Hello World still uses the older wheel.
No acceptance, publication, release or deployment is claimed.
