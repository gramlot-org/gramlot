# Complete JavaScript and legacy-card census

Document ID: **GC-050**. Generated evidence; not a public API or compatibility claim.

[Taxonomy and diagrams](045-js-taxonomy.md). [JSON evidence](inventory/045-js-taxonomy.json).

PoC revision: `10478b57ce3f22e6445eb6b72eba343520cbebac`.

<a id="gc-050-005"></a>

## 005 · JavaScript classes and functional mixins

112 class constructs and 2 functional mixins. Full per-definition paths/lines and base expressions are in the [full census](../../docs/internal/050-js-taxonomy-census.md#gc-050-005) and paired JSON. No inferred dynamic hierarchy.

<a id="gc-050-010"></a>

## 010 · All scanned modules and module-level functions

113 modules, including no-class utilities; 138 module function declarations. Arrow helpers are excluded from that count. Every module is listed in the full census/JSON.

<a id="gc-050-015"></a>

## 015 · Legacy cards: recorded classification and status

All 390 cards retained in full census/JSON: 341 component, 20 controller, 17 internal/reference helper, 11 component/helper, 1 recipe/registration. Recorded status is evidence, not compatibility. Source labels quoted verbatim; syntactic categories need review.

<a id="gc-050-020"></a>

## 020 · Curated current-contract cards and coverage limits

Six curated cards cover textBox, dataFormula, dataRecord, dataSelection, apiResolver/openApiResolver and DbHandler. External dependencies, dynamic classes, other repositories and complete legacy JS are outside scope. No runtime tests for this census; parsing/consistency/Mermaid checks are distinct.
