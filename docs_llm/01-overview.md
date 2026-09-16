# Gramlot — overview

[Constitution](00-constitution.md). [Expanded version](../docs/01-overview.md).

## 1. Purpose

- **1.1** Declarative application interfaces: Python authoring, JavaScript browser runtime.
- **1.2** Core independent of server and database; adapters connect external services.

## 2. Source and Data

- **2.1** Source describes structure/behavior; Data Bags hold state; DOM renders UI.
- **2.2** Bindings connect declarations to Data; controllers react to changes/events;
  resolvers provide data. Not every Source node creates DOM.
- **2.3** Bound input: Python declares a Data path; runtime manages rendering,
  user edits and external updates through the binding contract.

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

## 5. Adapters

- **5.1** Server adapters handle host integration; DB adapters handle backend/model
  services. These choices are independent.
- **5.2** Gramlot defines the server contract; FastAPI, Genro ASGI and Django
  integration projects document host-specific behavior.
- **5.3** DB areas: `common` contracts/behavior; `fake` controlled contract checks;
  `genropy` and `sqlalchemy` implementations. SQLite is a SQLAlchemy backend.
- **5.4** Capabilities: required minimum / common optional / implementation-specific.
  Common support implies no extensions; `auxColumns` is GenroPy-specific.
- **5.5** Selector delegates through server integration to shared DB policy and
  backend access. Standard dbSelect: prefix then containment, both case modes;
  detailed contracts specify parameters/results.
