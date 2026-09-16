# Gramlot product constitution

[Expanded version](../docs/00-constitution.md).

## 1. Authority

- **1.1** Constitution = agreed product principles; excludes proposals, examples,
  PoC behavior and open questions.
- **1.2** Check requests/ports before affected work. Cite conflicts. Resolve by adapting
  work or explicit owner amendment; LLMs/reviewers cannot amend architecture.
- **1.3** Record amendment date, changed principle and superseded decision in both docs.

## 2. Identity

- **2.1** Independent declarative UI framework: Python-first application authoring,
  JavaScript browser runtime, Apache 2.0.
- **2.2** Core is server- and database-independent. Host and DB adapters are separate.
- **2.3** No formal Live Object Tree semantics are approved; do not infer them.

## 3. Applications

- **3.1** Gramlot apps/examples/demos/PoCs use Source, Data Bags, bindings, controllers,
  resolvers and shared components for UI, state, interaction and requests.
- **3.2** No app-local DOM construction/manipulation, manual event wiring, input
  scraping, ad hoc fetch or parallel UI/state. Implement missing reusable capability.
- **3.3** Show Python first. Small local JS expressions are allowed; do not hide apps
  in large JS strings/support files.

## 4. Source and behavior

- **4.1** Source declares structure/behavior; Data Bags hold state; bindings connect
  them; controllers react; resolvers provide data. Not every Source node creates DOM.
- **4.2** Contracts define Data writes, lifecycle, cleanup, failures and isolation.
  Python/browser/server mixins are distinct. No final hierarchy/API approved.

## 5. Evidence and ports

- **5.1** GenroPy legacy is the nearly ideal behavioral reference. Preserve useful
  behavior/familiar authoring; remove Dojo and implementation complexity; record gaps.
- **5.2** Living `gramlot-poc` code/tests/inventory are evidence, not product contracts.
  Inventory distinguishes observed/proposed/agreed/verified; census is no commitment.
- **5.3** Admit small ports with bounded contract, responsibilities, code, meaningful
  tests, omissions and destination review.

## 6. Building blocks

- **6.1** Component = control contract; controller = reaction; recipe = Source
  composition; service/handler = shared contract; mixin = class capability.
- **6.2** Approve concrete composition, precedence and lifecycle incrementally.

## 7. Server adapters

- **7.1** Gramlot owns shared server-adapter contracts.
- **7.2** FastAPI, Django and Genro ASGI repositories own host-specific code/docs.
- **7.3** Core imports/installations have no server-framework dependency.

## 8. Database adapters

- **8.1** Areas: `common`, `fake`, `genropy`, `sqlalchemy`; SQLite is a SQLAlchemy backend.
- **8.2** Capabilities: required minimum / common optional / implementation-specific.
  Common support implies no extensions; `auxColumns` is GenroPy-specific.
- **8.3** dbSelect direction: prefix then containment; both case modes. Exact fallback
  and results require accepted contract. dataRecord/dataSelection/protocol remain open.

## 9. Documentation

- **9.1** Product docs describe accepted behavior, not migration. Pair `docs`/`docs_llm`.
- **9.2** Compact docs remain human-readable and preserve decisions/status/open points.
- **9.3** Number references; Mermaid for useful diagrams; maintained code/docs English.
- **9.4** No unsupported API, compatibility, release or verification claims.

## 10. Acceptance

- **10.1** `main` consolidated; `develop` new work.
- **10.2** Contract, code, tests and paired docs agree before admission.
- **10.3** Relevant adapters may advance with core; first slice need not cover all pairs.
- **10.4** Real apps expose gaps; fix them in reusable layers, never local workarounds.

## 11. Amendments

- **11.1 — 2026-09-16:** Initial constitution from approved owner decisions.

- **11.6 — 2026-09-16:** The owner explicitly authorizes JavaScript-first page
  authoring for the local/private `gramlot-nodejs` PoC, hosted with native
  `node:http` and without database integration. For this bounded experiment only,
  this supersedes sections 2–3's Python-first requirement. Source, Data Bags,
  bindings, controllers, resolvers, shared components and host independence remain
  mandatory. The exception does not change the primary language of other Gramlot
  applications or authorize publication, deployment or core port acceptance.
