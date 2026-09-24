# Portable foundations: consolidation proposal

Document ID: **GC-035**. Status: **proposal; no approved hierarchy or API**.

[Full counterpart](../../docs/internal/035-portable-foundations.md).

<a id="gc-035-005"></a>

## 005 · Objective and authority

Owner 2026-09-18: consolidate portable Python/JS foundations for components,
controllers, common functions, Python counterparts and server/database adapters.
Gramlot is the definitive destination; the bounded core is implemented here; PoC retains richer experimental evidence.
Constitution §§2–8 govern independence, authoring, lifecycle and bounded ports;
final class/mixin APIs and LOT semantics are not inferred. Internal, not public.

<a id="gc-035-010"></a>

## 010 · Existing evidence

Clean PoC revision inspected: `10478b57ce3f22e6445eb6b72eba343520cbebac`.
Existing evidence: JS component bases/registry, LogicRuntime, FormController,
Application/BuilderBase/rendering, server calls/resolvers and database read adapter;
Python GramlotBuilder/AuthoringNode, grammar mixins, WebPage/invocation metadata,
transport, hosting exports and DbHandler. Full guide lists paths and test files.
Tests were located, not run; this is a starting inventory, not acceptance.

<a id="gc-035-015"></a>

## 015 · Proposed responsibility map

Contract families: Source authoring, shared library utilities, typed transport, components, controllers,
binding/execution context, recipes, services/resolvers, page/application and database.
GramlotComponent/GramlotController are working names. Separate DOM adapter from
universal contract; controllers need no DOM. Python declares browser behavior.
Public declarative elements need Python surfaces; internal JS helpers need not
have Python classes. Shared contracts do not require mirrored inheritance.
Decide metadata generation versus checked parallel declarations. Avoid a universal
base holding DOM/RPC/database/form state. Separate authoring/browser/server mixins.

<a id="gc-035-020"></a>

## 020 · Contracts to define before porting

Specify construction/collaborators, instance isolation, activation/reconnection/
disposal, owned resources and cleanup failures/order, Data/path/event semantics,
reentrancy, async cancellation/stale results, hook precedence/mixin conflicts,
typed cross-language declarations/defaults/errors, tests and PoC differences.
Owner clarification 2026-09-18: other common functions means shared library code
used by multiple classes, not three functions. Proposed organization: group by
responsibility, explicit inputs/outputs/dependencies/side effects; stateless helpers
as functions, stateful services with an owner/lifecycle. Do not force utility reuse
through inheritance. Separate browser-dependent helpers, reuse Bag/Builders/TYTX
where appropriate, and add Python counterparts only for actual Python/shared-contract
needs. Inventory real callers/tests; parsing, conversion, formatting and error
normalization are candidates, not approved extractions.
Database retains common/fake/genropy/sqlalchemy; SQLite is via SQLAlchemy.
DataRecord/dataSelection and the general capability protocol remain unapproved.

<a id="gc-035-025"></a>

## 025 · Proposed consolidation order

1. Inventory shared utilities and settle foundations/declarations; review Bag/Builders/TYTX reuse;
   allocate port IDs only after checking existing records.
2. Python authoring + typed JS transport with shared fixtures, host-free imports.
3. Component/binding/controller slice: bound input, action, reactive output;
   lifecycle/isolation tests; any demo uses Gramlot, Show source and Inspector.
4. Portable host services, fake transport and one real adapter contract check.
5. Bounded database read/search with fake then one real backend, explicit capabilities.
6. Expand catalogue with matching Python declarations in reviewed increments.

Each port carries exact evidence, contract, review, tests and paired docs. No step
is accepted here. Move coverage with code: separate first-party JS (including
unimported files) from Python, and Node/jsdom from real-browser verification.

<a id="gc-035-030"></a>

## 030 · Decisions and next deliverable

Next: concrete first-base table of names, hooks, responsibilities, dependencies,
Python counterparts, acceptance tests and shared-utility inventory. Settle
component/HTMLElement boundary, controller ownership and shared metadata before
coding the hierarchy. Open: concrete utility inventory, initial declarations, names/hooks, mixin rules,
metadata source, dependency versions, port scope and first real host/backend.
No implementation, publication or completed migration is claimed.

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
