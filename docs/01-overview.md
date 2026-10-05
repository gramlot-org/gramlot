# Gramlot — overview

[Constitution](00-constitution.md). [Concise version](../docs_llm/01-overview.md).

> **Release status.** This overview describes the Gramlot model, including
> release **0.2.0 (HTML/SVG data binding)**, released on 2026-09-30. The README
> states the current release. The previous release, **0.1.2**, has no Data
> bindings or controllers.

## 1. Purpose

Gramlot is a framework for declarative application interfaces. Python describes
applications; a JavaScript runtime gives their declarations behavior in the browser.
Applications use a shared model for interface structure, data and interactions.
The core is independent of server and database technology; adapters connect it
to hosting environments and data services.

## 2. Source, Data and the browser

**Source** describes structure and behavior. **Data Bags** hold state used by
bindings and controllers. The **DOM** is the browser representation of the interface.
Bindings connect declarations to Data. Controllers react to changes and events;
resolvers provide data through their contracts. Not every Source node creates DOM.

```mermaid
flowchart LR
    P[Python declarations] --> S[Source]
    S --> R[JavaScript runtime]
    D[Data Bags] <--> R
    R <--> U[Browser interface]
```

### 2.1. Example: a bound input

Python declares a text input bound to a Data path. The runtime renders the control
and connects its value to that path. User edits and external Data changes follow
the binding contract; application code does not scrape the input or install a
parallel event and state system.

*0.2.0:* the declaration is `root.input(value='^.name')`. With the
default `live=False` the edit is written to the Data on `change`; `live=True`
writes on every `input` ([GC-095](public/095-writing-pages.md#gc-095-070)).

## 3. Building blocks

| Element | Responsibility |
| --- | --- |
| Component | Exposes a control through parameters, values, events and lifecycle |
| Controller | Reacts to Data and events and executes application behavior |
| Recipe | Composes ordinary Source nodes into a reusable structure |
| Service or handler | Implements shared behavior behind a defined contract |
| Mixin | Adds a reusable capability to a class |

Bases, mixins and collaborators compose concrete classes with explicit requirements,
lifecycle responsibilities, cleanup and instance isolation. Python authoring,
browser and server mixins operate at different layers.

### 3.1. Example: input capabilities

An input combines editing behavior with lifecycle, label presentation and field
state. Validation can be supplied by a shared service. The contract identifies
who writes Data and releases subscriptions when the control is removed; the
validation engine need not be duplicated in every control.

## 4. Application authoring

Applications use Python declarations and Gramlot Source, Data Bags, bindings,
controllers, resolvers and shared components. Small local JavaScript expressions
can complement these declarations. Reusable browser behavior belongs in the
framework's JavaScript services and components.

*0.2.0:* named logic is the primary path for page behavior: each logic file
exports `class Logic`, and declarations call its methods by name. Inline code is
allowed but discouraged, and runs only in the browser page runtime
([GC-095](public/095-writing-pages.md#gc-095-060)).

Application UI, state, events and requests use Gramlot mechanisms. Direct DOM
construction, manual event wiring and separate request/state machinery are not
application authoring mechanisms. Native browser operations belong inside the
framework implementation.

The provisional example runner had a bounded owner-approved exception (constitution
11.44): its local JavaScript attached behavior through ordinary HTML IDs and used
existing Source/Bag/lifecycle APIs. The runner left the core with amendment 11.56;
the example pages and their gallery live in `gramlot-examples`. Future web
components require separate approval.

## 5. Server and database adapters

Server adapters connect pages and services to a host. Database adapters connect
shared database contracts to backend or application-model services. These choices
are independent: hosting a selector on FastAPI does not make database search
part of FastAPI.

Gramlot defines shared server-adapter responsibilities. The guides of
`gramlot-py-server` (one for each framework) and `gramlot-js-server` document
host-specific behavior.

### 5.1. Database responsibilities

The database architecture separates `common` contracts and behavior, a `fake`
implementation for controlled contract checks, and `genropy` and `sqlalchemy`
implementations. SQLite is a database usable through SQLAlchemy.

Capabilities comprise a required minimum, common optional capabilities and
implementation-specific extensions. Supporting the common contract does not imply
support for extensions. Advanced GenroPy capabilities retain their own boundary;
`auxColumns`, for example, belongs to that capability set.

### 5.2. Example: a database selector

A control delegates search to a database service through the host's request
integration. Shared database policy and backend access remain separate from the
visual control and host-specific handling.

```mermaid
flowchart LR
    C[Browser selector] --> H[Server adapter]
    H --> S[Shared database service]
    S --> A[Database implementation]
```

The standard dbSelect search contract provides prefix search followed by
containment and supports both case-sensitive and case-insensitive matching.
Detailed component and adapter contracts specify parameters and result behavior.


## 6. Integration repositories

Integration repos provide environment-specific adapters and instructions to install,
configure and try Gramlot:

- `gramlot-py-server` (PyPI `gramlot-py-server`) serves Python pages with five
  adapters, one extra each: `uvicorn` (any ASGI server), `django`, `flask`,
  `fastapi` and `kajenn` (Kajenn, formerly Genro ASGI, on PyPI as `kajenn`);
- `gramlot-js-server` serves JavaScript pages: `@gramlot/gramlot-js-server`
  (Node.js and Bun), `@gramlot/gramlot-serverless` (browser/Worker standalone,
  without a server) and `@gramlot/create` (new projects).

The example pages and their gallery are in `gramlot-examples`; each environment
serves them with its gallery command. The earlier repositories `gramlot-uvicorn`,
`gramlot-django`, `gramlot-fastapi`, `gramlot-flask`, `gramlot-kajenn` (formerly
`gramlot-genro-asgi`), `gramlot-serverless` and `gramlot-minimal` (retired on
2026-09-28) are archived. Core owns shared runtime contracts; an integration
depends on the core, never the reverse. Each integration repository states the
core release it verifies. See constitution section 7 for the approved ownership.

[GC-140 · Agreed integrations and examples](internal/140-integrations-and-examples.md)
records how the integration environments were reorganized up to 0.2.0. It does not
define further PoC transfers.
