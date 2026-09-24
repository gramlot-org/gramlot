# PORT-0003-builder-recipe-pipeline

**Historical port record.** Contracts, review feedback, rejected paths and dated test evidence remain here. The current 0.1.0 state is [GC-070](../../docs/internal/070-work-status.md) and the sole release plan is [GC-110](../../docs/internal/110-native-html-readiness.md#gc-110-020). Past “current”, “open” and “next” statements are local to their dated checkpoint; old eight-profile checks do not verify the seven-profile release matrix. No port acceptance is implied.

- **Status:** implemented and locally verified; owner acceptance pending
- **PoC evidence:** `gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`
- **Destination revision:** uncommitted development working tree
- **Constitution checked:** sections 2–7, 9–10 and 12; no conflict identified

## Evidence

The PoC supplies the prior Python GramlotBuilder/AuthoringNode, JavaScript
GramlotBuilder, browser renderer and Source-service behavior. Current sibling
`genro-builders` and `genro-dom-js` provide the generic grammar, SourceBag,
RendererBase and RecipeExpander extension points. Exact local external-library
changes are development evidence and are not dependency pins or published APIs.

## Scope and contract

Python and JavaScript GramlotBuilder classes specialize the generic grammars.
GramlotRenderer specializes generic JavaScript RendererBase. Python produces the
existing native wire through an explicit snapshot without executing browser logic.
Named recipe markers carry a string name, plain parameter dictionary and empty Bag.

Main and remote `@source` payloads expand all recipes while detached, then enter
observed Source once. Intermediate expansion is not rendered. Python `@source`
methods are explicit, fresh per invocation, sync/async, MRO-aware and return no
value. Native HTML, mixed text/children and opaque references are retained.

Omitted: CSS shorthand, component catalogue, bindings/controllers, production host
transport, Python reactive rendering and formal Live Object Tree semantics.

## Proposed contents

Core Python/JS builders, renderer association, recipe expansion, host Source
dispatch, focused tests, GC-065/070/075 updates and GC-080. Dependencies remain
unconstrained first-party packages/default branches under constitution section 12.

## Verification

Focused tests cover generic backing, native snapshots, labels, mixed text,
references, inert browser behavior, recipe markers, fresh sync/async Source calls,
MRO hiding and remote expansion. Current combined-tree checks pass Python 9/9,
Node 22/22, Bun 22/22, generic-library 116/116 and Chromium Python/Node/Bun.
Earlier 13/4/6 counts predate this port and are superseded. JS uses the locally
packed generic library; Python uses dependencies installed in the project virtual
environment, without sibling source-path injection.

## Differences and open questions

The native Gramlot wire stores `tag`/`_text` attributes and Bag children; generic
Python SourceBag stores structural tag/value fields. The explicit snapshot is the
current compatibility boundary. The floating dependency policy does not transmit
uncommitted sibling-library additions; required generic changes must be accepted
upstream before a clean dependency refresh can reproduce them.
Recipes are supplied through the application constructor registry. Default bootstrap
does not discover modules; a custom runtime URL wrapper can configure the registry.

## Destination review

- **Result:** pending
- **Accepted scope/revision or requested changes:** upstream reproducibility and owner review pending
- **Constitution conflict:** none identified

## Feedback for later ports

Expand declarative recipes before mutating observed Source. Treat floating dependency
policy and upstream availability as separate facts. Never infer compatibility from a
combined local checkout without also testing a clean refreshed consumer.


## Owner revision — 2026-09-19

Result: revision-requested. The previous ordinary-Bag snapshot and hydration path
masked the missing generic SourceBag registration contract. Replace it with the
existing TYTX registered type mechanism for root and branches (`SOURCE`), with
builder-owned in-place association. Bag/TYTX require no new wire format. Native
nodeTag and scalar values reach the renderer unchanged. Prior verification counts
refer to the superseded adapter path; typed cross-language verification is pending.


Revision implemented and locally verified: Python core 9/9, Node 25/25, Bun25/25,
generic Python builder 403/403, generic JS builder117/117. Chromium passes for
Python/Node/Bun main and remote recipes with native typed nodes. Snapshot/hydration
is removed. Generic JS builder also fixes insertion metadata timing at its source.
Bag/TYTX wire protocol remains unchanged. Dependency artifacts were installed as
packages (Python wheel, JS tarball); normal npm installation replaced temporary
local development links before final tests. Upstream consolidation, clean floating
consumer reproduction and owner acceptance remain open.
