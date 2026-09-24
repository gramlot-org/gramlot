# Portable foundations: consolidation proposal

Document ID: **GC-035**. Status: **proposal, not an accepted API or class hierarchy**.

[Concise counterpart](../../docs_llm/internal/035-portable-foundations.md).

<a id="gc-035-005"></a>

## 005 · Objective and authority

Owner direction, 2026-09-18: start consolidating portable code in Gramlot; define
Python and JavaScript bases that support server and database implementations,
JavaScript components and controllers, common functionality, and elements exposed
through Python authoring. The definitive framework belongs here; the bounded native HTML/typed Source core is now implemented here. The richer `gramlot-poc` remains historical evidence and a laboratory.

Constitution §§2–8 require host/database independence, Python-first authoring,
Source/Data separation, explicit ownership and bounded reviewed ports. They do
not approve a final inheritance hierarchy. The proposed responsibilities below
fit those constraints; names, signatures and composition rules remain to settle.
No formal Live Object Tree semantics are introduced.

This internal document is outside the public manual allowlist. It records a
starting design and inspection evidence, not port acceptance or a full inventory.

<a id="gc-035-010"></a>

## 010 · Existing evidence

Inspected source: `gramlot-org/gramlot-poc` revision
`10478b57ce3f22e6445eb6b72eba343520cbebac`, clean checkout at inspection.
Paths below are relative to that repository. Tests are evidence candidates;
they were located, not executed as part of this design pass.

| Area | Existing implementation | Consolidation question |
| --- | --- | --- |
| Component lifecycle | `js/dom/src/components/bases.js`: per-DOM-realm `GramlotElement`, `ControlElement`, `Decorated`, `FieldState` | Which lifecycle behavior belongs to every component, and which capabilities belong only to controls? |
| Component descriptions | `js/dom/src/components/registry.js`: collection registration and descriptions | What shared declaration contract can Python and JS consume? |
| Declarative logic | `js/dom/src/logic/runtime.js`: `LogicRuntime` installs/executes providers and local logic | How should controller instances own subscriptions, execution and disposal? |
| Specialized controllers | `js/dom/src/forms/controller.js`: `FormController` | Which behavior is generic, rather than form/persistence policy? |
| Runtime assembly | `js/dom/src/application.js`, `builder-base.js`, `builder-handler.js`, `renderer/base.js` | Separate authoring, rendering, bindings and service assembly before selecting bases. |
| Python authoring | `src/gramlot/builder.py`: `GramlotBuilder`, `AuthoringNode`; `grammar/` declaration mixins | Preserve readable Python while separating description from browser execution. |
| Pages and transport | `src/gramlot/page.py`: `WebPage`, `InvocationContext`, `PageMethod`; `transport.py`: typed snapshots | Establish portable page invocation and Python ↔ JS transport contracts. |
| Hosting | `src/gramlot/hosting.py` exports shared page registry, runtime assets and document rendering | Separate common services from host request/response objects. |
| Remote calls and resolvers | `js/dom/src/services/server-call.js`, `resolvers/`; `src/gramlot/resolvers.py` | Define cancellation, stale results, errors and owner lifetime. |
| Database | `src/gramlot/database.py`: `SelectTable`, `DbHandler`, `DbPageMixin`; `js/dom/src/database/common/read-adapter.mjs`: `ModelProvider`, `ReadAdapter` | Review overlap and differences rather than accepting either API wholesale. |

Relevant existing tests include `js/dom/tests/component-alpha.test.js`,
`component-rules.test.js`, `local-logic.test.js`, `rpc-resolver.test.js`,
`database-read.test.js`, and Python `tests/test_gramlot_builder.py`,
`test_local_logic.py`, `test_hosting_contract.py`, `test_page_services.py`,
`test_data_rpc.py`. Browser tests include `tests/browser/data-rpc.spec.js`.

<a id="gc-035-015"></a>

## 015 · Proposed responsibility map

These are contract families, not a commitment to one class per row.
`GramlotComponent` and `GramlotController` are working names for discussion.

| Family | Python responsibility | JavaScript responsibility | Boundary |
| --- | --- | --- | --- |
| Source authoring | Builder, authoring node, element declarations | Receive/inspect Source; JS builder where needed | Declarations are distinct from DOM and Data. |
| Shared library utilities | Reusable authoring/transport helpers where needed | Reusable helpers imported by components, controllers and services | Group by responsibility; keep environment dependencies explicit. |
| Typed transport | Encode/decode supported values and declarations | Decode/encode the same values | No host-specific request objects in the payload. |
| Component | Declare parameters, values, events and allowed children | `GramlotComponent` contract, rendering adapter, control specializations | DOM lifecycle belongs in the browser layer; a universal component need not be assumed to be an HTMLElement. |
| Controller | Declare behavior, inputs, triggers and outputs | `GramlotController` contract, execution and subscriptions | A controller can operate without rendering a DOM element. |
| Binding and execution context | Express paths and binding intent | Resolve paths, subscribe, write Data and dispose | Specify ownership and cycle/error behavior; avoid parallel state. |
| Recipe | Compose ordinary Source through Python methods | Expand supported Source recipes where required | A recipe is not automatically a component subclass. |
| Services and resolvers | Declare requests and expose portable endpoint contracts | Data access, topics, remote calls and resolver lifetime | Reusable services are distinct from controls and controllers. |
| Page and application | Page construction and portable invocation context | Assemble Source, Data, registry and services | Server integrations own routing/authentication/session integration. |
| Database | Shared contracts plus backend implementations | Consumer-facing declarations and portable data services | Host and database selection are independent. |

Proposed rule for Python counterparts: every public declarative element has a
Python authoring surface and a documented mapping to its runtime behavior.
Internal JS helpers do not require artificial Python classes. The counterpart
shares the declaration contract, not necessarily inheritance or executable logic.
Choose whether descriptions generate authoring metadata or are maintained with
contract checks before implementing a shared registry.

Do not create a single universal base carrying DOM, RPC, database and form state.
For each family, decide what is inheritance, an optional mixin or a collaborator.
Keep Python-authoring, browser and server mixins separate.

<a id="gc-035-020"></a>

## 020 · Contracts to define before porting

For each selected base or capability, record:

1. Construction inputs, required collaborators and per-instance mutable state.
2. Initialization, activation, deactivation, reconnection and final disposal;
   distinguish temporary DOM disconnection from destruction where applicable.
3. Ownership of subscriptions, listeners, timers and requests; cleanup ordering,
   repeated disposal and behavior if one cleanup operation raises.
4. Data reads/writes, path scope, events, scheduling, reentrancy and failure rules.
5. Async cancellation and obsolete-result handling after replacement or disposal.
6. Inheritance hooks, mixin requirements/conflicts, method precedence and isolation.
7. Python declaration, JS interpretation, typed values, defaults, unsupported options
   and version/compatibility errors where a cross-language boundary exists.
8. Tests of observable behavior, omissions and intentional differences from the PoC.

Owner clarification, 2026-09-18: “other common functions” means shared library
code reused by multiple classes, not a fixed set of three functions.

Proposed organization: group utilities by responsibility, with explicit inputs,
outputs, dependencies and side effects. Prefer standalone functions for stateless
operations; keep stateful services with their owning instance and lifecycle.
Do not add utility methods to a common superclass merely to share code.
Browser-dependent helpers remain distinguishable from environment-independent
helpers. Reuse existing Bag, Builders and TYTX functionality where it already owns
the behavior. A JS utility needs a Python counterpart only when Python requires
that behavior or shares its transport/declaration contract.

The inventory should identify real callers and tests for each candidate utility.
Examples to inspect include pointer parsing, value conversion, formatting and error
normalization; these categories are candidates, not an approved extraction list.

Database work retains `common`, `fake`, `genropy` and `sqlalchemy` responsibilities.
SQLite is a backend through SQLAlchemy. `dataRecord`, `dataSelection` and a general
capability protocol remain unapproved; their existence in PoC does not accept them.

<a id="gc-035-025"></a>

## 025 · Proposed consolidation order

1. **Foundation contract inventory:** settle the map, inventory shared library utilities and the initial
   public declaration set. Review dependencies on Bag, Builders and TYTX; distinguish
   reused libraries from framework code to port. Assign bounded port IDs after
   checking existing PoC/destination records for collisions.
2. **Authoring and transport:** a minimal Python page/builder emits typed Source and
   Data that JS can consume. Test matching fixtures on both sides and imports without
   server or database packages. This establishes the shared boundary first.
3. **Component, binding and controller slice:** implement the chosen bases and one
   real bound control, one action/controller and a reactive output. Cover instance
   isolation, lifecycle, removal, reconnection and cleanup. Any demo uses Gramlot
   declarations and includes Show source and Inspector as constitution requires.
4. **Host contract:** consolidate portable page/endpoint/runtime-asset services and
   a fake transport. Verify one real adapter against the same contracts before
   claiming portability across implementations. Core never imports the adapter.
5. **Database contract:** bound the first accepted read/search behavior, verify it
   with `fake`, then one real implementation. Keep backend-specific capabilities
   explicit; full database parity is not a prerequisite for a bounded first port.
6. **Expand the element catalogue:** add controls, recipes, controllers and their
   Python declarations in small reviewed ports using the foundation contracts.

Each step needs a port record with exact evidence, scoped contract, destination
review, meaningful tests and paired docs. This sequence is a proposal; no port is
accepted or implemented by this document. Runtime coverage moves with code and
reports first-party JS separately from Python, including unimported JS files.
Node/jsdom tests and real-browser checks retain distinct roles.

<a id="gc-035-030"></a>

## 030 · Decisions and next deliverable

The next deliverable is a concrete contract table for the first bases: proposed
names, responsibilities, lifecycle hooks, dependencies, Python counterparts and
acceptance tests, together with a shared-utility inventory. Decide component
contract versus HTMLElement inheritance, controller ownership, and how shared
metadata reaches Python. Review all three together before writing base classes
that would implicitly settle the design.

Unresolved items: concrete utility inventory; initial declaration set; final base
names/hooks; mixin composition rules; metadata source; dependency versions and
port boundaries; first real host/backend verification targets. No implementation,
publication or migration completion is claimed.

<a id="gc-035-035"></a>

## 035 · JS-owned metadata experiment

Owner prioritizes testing JS-only component definitions and JSON-driven Python
controls before fixing the repository hierarchy. [GC-040](040-js-owned-components.md)
records a successful bounded probe, collection organization and remaining contracts.
This supplies evidence for the metadata decision; it does not accept the final API.

<a id="gc-035-040"></a>

## 040 · JavaScript taxonomy and legacy inventory

[GC-045](045-js-taxonomy.md) maps the actual PoC classes, functional mixins and
composed collaborators, with a separately marked candidate consolidation tree.
[GC-050](050-js-taxonomy-census.md) records the complete bounded source census and
all legacy inventory cards. This is design evidence, not approval of a hierarchy.
