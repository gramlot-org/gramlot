# Future work

Planning backlog, updated 2026-10-16. Owner request: keep future work in a directory
because some work may proceed in parallel and the next phase must be chosen.
This directory is internal planning material, excluded from the public manual.
[Current delivery status](../internal/070-work-status.md) remains authoritative for
implemented/released work; it links here for future topics.

## Workstreams listed by the owner

**Component planning, 2026-10-16:** [GC-245](245-components-0-3-plan.md) updates the 0.3 proposal: textbox/labelbox with multiple early control shapes, callbackSelect and the random-data lesson, and single/group radio based on legacy syntax. Registration, hierarchy and mixin APIs remain proposals for concrete review; no new component runtime is implemented.

**Current checkpoint, 2026-10-15:** local publish/subscribe, direct-frame messaging,
references and ask were delivered; see [GC-070 §965](../internal/070-work-status.md#gc-070-965).
Plain/delayed buttons and their examples were subsequently delivered
([§970](../internal/070-work-status.md#gc-070-970)). Cross-user/server messaging
remains outside that bounded port. The owner has now requested legacy/PoC component
analysis and a contract proposal before choosing APIs. That analysis is complete in
[GC-205](205-components.md#gc-205-015); implementation and API decisions remain open.

**Localization checkpoint, 2026-10-16:** before finalizing inputs, the owner requested
a complete Python/JS legacy localization analysis and comparison with modern systems.
[GC-235](235-localization.md) contains the source findings and isolated probes.
[GC-240](240-localization-decisions.md) records subsequent decisions: signature-driven
`intl_str`, no required `!!` on those parameters, source-language context and general
`pages/_metadata`. The owner subsequently accepts the shared annotation direction
and component/message coverage, with a [deferred implementation sequence](240-localization-decisions.md#gc-240-055).
**Not a priority and not a blocker** for components or releases. Shared package
placement, collector, metadata format and engine remain open; no localization
runtime has been implemented.

The remaining priorities and parallelism are still open. The numbers
preserve the owner's grouping, not execution order. The earlier suggestion to
start with public websites is withdrawn after the owner's clarification. Do not
start a phase or assign parallel implementations from this list alone.

| Owner item | Workstream | Scope retained for discussion |
| --- | --- | --- |
| 1 | [Publish/subscribe legacy analysis (GC-196)](../internal/196-legacy-publish-subscribe.md) | Bounded local/direct-frame port delivered. Server-mediated and cross-user messaging remain deferred; legacy analysis remains evidence. |
| 2 | [Final definition of Gramlot components](205-components.md) | Legacy/PoC/core analysis and proposed contract complete; owner API decisions pending. See GC-205 §065. |
| 2.1 | Input component collection | Create the Gramlot input component collection. |
| 2.2 | Layout component integration | Integrate layout components, including border and tab layouts. |
| 3 | Database connections | Define the database integration workstream. |
| 3.1 | dataRecord, dataSelection, db selection | Retain these three areas as named by the owner; exact APIs and ownership remain to be defined. |
| 4 | Stores | Define the store workstream and its contract. |
| 5 | Store-based widgets | Tree and grid, using stores. |

Before choosing priorities, compare use cases, existing legacy/PoC evidence,
shared contracts and dependencies. In particular, evaluate the relationship of
components to input/layout collections and of stores to tree/grid, and clarify
how database access and cross-user messaging interact with host responsibilities.
These are questions for the comparison, not a dependency graph already approved.
Independent investigations may be candidates for parallel work; implementation
parallelism and task assignments have not been chosen. The owner may add further
workstreams before this comparison.

## Previously retained topics

- [GC-190 · Public websites and editorial HTML](190-public-websites.md): the three
  sites, HTML companions and interactive-region presentation modes.
- [GC-200 · System Data and actions](200-system-data.md): reserved system Data,
  initialization and fire/reset behavior, explicitly deferred.
- The [component card](205-components.md) also retains the bounded inspector port
  and its provisional replacements as evidence within the wider component discussion.

These topics remain recorded; none is promoted above the owner's workstream list.

## Other open items and delivery work

| Item | Recorded disposition | Next action |
| --- | --- | --- |
| [Practical entry page and DevTools links](../internal/070-work-status.md#gc-070-845) | Implemented and locally verified; publication pending | Complete the documentation delivery separately from the next feature phase |
| [Live remote Source edits, Q2](../internal/070-work-status.md#gc-070-820) | Owner decision still open | Clarify triggers and lifecycle before implementation |
| [Extra fixed-remote enforcement](../internal/070-work-status.md#gc-070-820) | Owner-deferred by constitution 11.66 | Do not reopen it as a release blocker or invent a common Builder-attribute extension |
| [Date/Decimal authoring exercise](../internal/070-work-status.md#gc-070-835) | Last checkpoint defers it pending Bag #69 | Recheck upstream before planning the exercise; no new claim about current issue status |

## How to use this directory

Each numbered card records the use case, owner evidence, proposed scope, unanswered
questions, dependencies, parallelism and completion evidence. Keep confirmed owner
requirements distinct from proposed APIs and historical experiments. Before starting,
select a bounded phase with the owner and record its contract and checks. An item
may be under discussion, ready after confirmation, in progress, dependency-blocked,
deferred or completed; change the state only with evidence.

Retain stable document IDs, paired docs/docs_llm paths and links when a card moves
or closes. Update the index and the current-status checkpoint when work advances.
These cards are not a second execution plan and do not reopen completed phases.


## Button-family follow-up — 2026-10-17

[GC-310 · Buttons and button bars](310-buttons-and-button-bars.md) records the
legacy analysis and 0.3 proposal: button Web Component, dropdown/split/state
controls and mixed dynamic button bars. Core button direction accepted; extended
API and sequence remain proposed. No runtime delivery is claimed.
