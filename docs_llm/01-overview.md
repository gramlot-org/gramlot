# Gramlot — overview

[Constitution](00-constitution.md). [Expanded version](../docs/01-overview.md).

> **Release status.** Model overview including **0.2.0 (HTML/SVG data binding), in
> development**: approved plan, not yet implemented or released. Latest published
> release: **0.1.2**, without Data bindings or controllers.

## 1. Purpose

- **1.1** Declarative application interfaces: Python authoring, JavaScript browser runtime.
- **1.2** Core independent of server and database; adapters connect external services.

## 2. Source and Data

- **2.1** Source describes structure/behavior; Data Bags hold state; DOM renders UI.
- **2.2** Bindings connect declarations to Data; controllers react to changes/events;
  resolvers provide data. Not every Source node creates DOM.
- **2.3** Bound input: Python declares a Data path; runtime manages rendering,
  user edits and external updates through the binding contract.
  *0.2.0:* `root.input(value='^.name')`; `live=False` (default) writes on `change`,
  `live=True` on `input` ([GC-095](public/095-writing-pages.md#gc-095-070)).

## 3. Building blocks

- **3.1** Components expose controls; controllers execute behavior; recipes compose
  Source; services/handlers share behavior; mixins add class capabilities.
- **3.2** Bases, mixins and collaborators compose classes with explicit requirements,
  lifecycle, cleanup and instance isolation. Python/browser/server mixins are distinct.
- **3.3** Input example: editing + lifecycle + label/field state; shared validation
  service. Contracts identify Data-write and subscription-cleanup ownership.

## 4. Authoring

- **4.1** Applications use Python declarations and Gramlot Source, Data, bindings,
  controllers, resolvers and components. Small local JS expressions can complement them.
- **4.2** Reusable browser behavior belongs in framework services/components.
  Application-local DOM/event/request/state bypasses are excluded; native browser
  operations belong inside framework implementation.
- **4.3** *0.2.0:* named logic (`class Logic` files, called by name) is primary;
  inline code is allowed, discouraged, browser page runtime only
  ([GC-095](public/095-writing-pages.md#gc-095-060)).

The provisional example runner has a bounded owner-approved exception (constitution
11.44): its local JavaScript attaches behavior through ordinary HTML IDs and uses
existing Source/Bag/lifecycle APIs. This is not a general core component facility;
future web components require separate approval.

## 5. Adapters

- **5.1** Server adapters handle host integration; DB adapters handle backend/model
  services. These choices are independent.
- **5.2** Gramlot defines the server contract; FastAPI, Kajenn and Django
  integration projects document host-specific behavior.
- **5.3** DB areas: `common` contracts/behavior; `fake` controlled contract checks;
  `genropy` and `sqlalchemy` implementations. SQLite is a SQLAlchemy backend.
- **5.4** Capabilities: required minimum / common optional / implementation-specific.
  Common support implies no extensions; `auxColumns` is GenroPy-specific.
- **5.5** Selector delegates through server integration to shared DB policy and
  backend access. Standard dbSelect: prefix then containment, both case modes;
  detailed contracts specify parameters/results.


## 6. Integration repositories

Integration repos provide environment-specific adapters and instructions to install,
configure and try Gramlot: `gramlot-fastapi`, `gramlot-flask`, `gramlot-kajenn`,
`gramlot-minimal`, `gramlot-js-server` (Node.js and Bun), and `gramlot-django`.
`gramlot-kajenn` is the approved destination name. The inspected local checkout
and its configured origin still use `gramlot-genro-asgi`; a remote rename is not
verified. This naming distinction does not change Kajenn's approved ownership.
Minimal combines Python/ASGI/Uvicorn hosting and browser/Worker standalone packaging.
Kajenn consumes minimal's generic ASGI adapter and owns only its host-specific
integration. Core owns shared runtime contracts. This classification does not
assert that every integration supports each core release; Django native alignment
is newly authorized and must establish its own verification beyond the original
0.1.0 matrix. See constitution section 7 for the approved ownership.

[GC-140 · Agreed integrations and examples](internal/140-integrations-and-examples.md)
is the shared inventory of integration environments, the Hello World profiles and
their verification/publication status. It does not define further PoC transfers.
