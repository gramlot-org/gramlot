# 205 · General components and provisional replacements

Document ID: **GC-205**. Status: **candidate future design, not a general port authorization**.

<a id="gc-205-005"></a>
## 005 · Retained direction and next decisions

Block ID: **GC-205-005**.

**Goal:** settle the final definition of Gramlot components, then scope the
input collection (owner item 2.1) and integration of layout components such as
border and tabs (2.2). Provisional inspector replacements are one consumer of
that wider workstream, not its whole scope. The owner distinguished
the dedicated `gramlot-tools-inspector` from the future general component series
and accepted isolated provisional `gramlot-poc-*` components.

**Existing evidence:** [GC-040](../internal/040-js-owned-components.md) records a
JS-owned component/collection experiment, explicitly proposed rather than an
accepted API. [GC-195](../internal/195-tools-inspector.md) and
[PORT-0006](../../ports/PORT-0006-inspector-components/README.md) describe the
bounded inspector work. `webcomponent(code=...)` and that specific port do not
approve a general component registry, object-property binding system or wholesale
PoC transfer. Older port checkpoint statements must be reconciled with current
release evidence before assigning remaining work.

**Before implementation:** choose one component and its consumer, inventory the
legacy/PoC behavior, confirm the public parameters, events, Data integration,
lifecycle and ownership, and determine how the provisional implementation will be
replaced. No component priority, replacement schedule or new release number is
assigned by this backlog. Follow the [port protocol](../../ports/README.md).

**Dependencies and parallelism:** independently bounded components can be reviewed
in parallel after their common contracts are settled. Shared renderer, grammar,
registration or binding work must be coordinated; separate worktrees alone do not
make conflicting contracts independent. The editorial website use case must not
silently require completion of an entire component framework.

**Proposed completion evidence:** one approved port with meaningful interaction,
Data, lifecycle and browser checks, Python authoring where in scope, updated paired
documentation, and explicit disposition of removed provisional responsibilities.
No new implementation or tests are claimed by this card.


<a id="gc-205-010"></a>
## 010 · Owner workstream inventory, 2026-10-15

Block ID: **GC-205-010**.

The owner lists final component definition as item 2, the input collection as
2.1, and layout integration (border/tab, etc.) as 2.2. This grouping is retained
without selecting priorities or an implementation phase. Store-based tree/grid
widgets are a separate item 5, to compare with components and stores when deciding
contracts and opportunities for parallel work. The earlier single-port completion
criteria do not establish completion of this entire workstream.
