# Gramlot product constitution

[Concise version](../docs_llm/00-constitution.md).

## 1. Authority and amendments

This constitution contains agreed product principles. Proposals, examples, PoC
behavior and open questions are not constitutional merely because they are recorded.
Later explicit owner decisions supersede earlier statements.

Every request and port is checked against these principles. On conflict, identify
the affected principle before implementing the conflicting part. Resolve the conflict
by adapting the work or through an explicit owner amendment. An amendment records its
date, changed principle and superseded decision in this document and its concise
mirror. Port preparers, reviewers and LLMs cannot amend architecture independently.

## 2. Product identity and boundaries

Gramlot is an independent framework for declarative application interfaces. Python
is the primary application-authoring language; a JavaScript runtime implements
browser behavior. The intended license is Apache 2.0.

The Gramlot core is independent of server and database technology. Server adapters
connect pages and services to hosts. Database adapters implement shared database
contracts. Hosting and database selection are independent choices.

No formal semantics for the term **Live Object Tree** have been approved. The name
does not authorize an inferred object model, lifecycle or protocol.

## 3. Application authoring

Anything presented as a Gramlot application, example, demo or PoC uses Gramlot
Source, Data Bags, bindings, controllers, resolvers and shared components for its
interface, state, interactions and requests.

Application code does not bypass the framework with direct DOM construction or
manipulation, manual DOM event wiring, input scraping, ad hoc fetch calls or parallel
UI/state machinery. Native browser operations belong inside reusable framework
internals and components. When a capability is missing, record the gap and implement
the reusable Gramlot capability before using it in the application.

Application examples show Python first. Small local JavaScript expressions may be
used where appropriate; large JavaScript strings or support files must not hide the
application from Python authors.

## 4. Source, Data and behavior

Source describes interface structure and declared behavior. Data Bags hold state.
Bindings connect declarations to Data; controllers react to changes and events;
resolvers provide data through explicit contracts. Not every Source node creates DOM.

Useful behavior must define ownership of Data writes, lifecycle, cleanup and failure
handling. Reusable classes composed from bases, mixins and collaborators state their
requirements, conflicts and instance-isolation rules. Python-authoring, browser and
server mixins are separate mechanisms.

These principles do not approve a final class hierarchy or mixin composition API.

## 5. Legacy and PoC evidence

GenroPy legacy is the nearly ideal behavioral reference because it contains a broad,
proven feature set. Preserve useful mental models, familiar authoring and behavior
where possible. Do not reproduce Dojo constraints or complicated implementation
mechanisms merely because they existed. Record intentional incompatibilities.

The living `gramlot-poc` repository contains history, pages, tests, inventory and new
experiments. Its code and successful tests are evidence, not automatic product
contracts. The inventory distinguishes observed, proposed, agreed and verified
behavior; an inventory entry is not an implementation commitment.

Gramlot grows through small, reviewed ports. Each accepted increment has a bounded
contract, assigned responsibilities, implementation, meaningful verification,
documented omissions and destination review.

## 6. Components, recipes and composition

A component exposes a control through parameters, values, events and lifecycle. A
controller reacts to Data and events. A recipe composes ordinary Source nodes. A
service or handler provides shared behavior behind a contract. A mixin adds a
reusable capability to a class.

These responsibility categories guide review. Concrete bases, mixins, collaborators,
method precedence and initialization/cleanup order are approved incrementally rather
than inferred from prototypes.

## 7. Server adapters

Gramlot owns the shared responsibilities and contracts required of server adapters.
The separate `gramlot-fastapi`, `gramlot-django` and `gramlot-genro-asgi` projects own
their host-specific implementation, architecture and documentation.

Core imports and installations remain server-independent. A host adapter may depend
on Gramlot; Gramlot core does not depend on FastAPI, Django or Genro ASGI.

## 8. Database adapters

Database work is divided into:

- `common`: shared contracts and behavior;
- `fake`: controlled contract verification without a real database;
- `genropy`: GenroPy-specific implementation and capabilities;
- `sqlalchemy`: SQLAlchemy-specific implementation and capabilities.

SQLite is a backend usable through SQLAlchemy, not a separate adapter category.
Capabilities are classified as required minimum, common optional or
implementation-specific. Supporting the common contract does not imply supporting
extensions. Advanced GenroPy capabilities retain their boundary; `auxColumns` is
GenroPy-specific.

The agreed standard dbSelect direction is prefix search followed by containment,
with case-sensitive and case-insensitive modes. Exact fallback and result contracts
must be stated by the accepted component/adapter port. `dataRecord`, `dataSelection`
and the general capability protocol remain unapproved until their contracts land.

## 9. Documentation and claims

Product documentation describes accepted Gramlot behavior rather than the migration
journey. Pair `docs/<path>` with `docs_llm/<path>` and update them together. Concise
documents use fewer words while retaining decisions, constraints, status and open
questions in human-readable sections.

Use numbered sections and points for stable references. Use Mermaid when a diagram
clarifies architecture or application flow; use text for folder trees. Maintained
technical documentation and code are in English.

Across Gramlot repositories, maintained guides use three-digit filename prefixes,
initially spaced by five (`005`, `010`, `015`). Expanded and concise views share
paths, ordering prefixes, logical document IDs and section block IDs. Each
repository uses a distinct namespace; IDs remain repository-wide across folders.
Level-two sections have explicit stable HTML anchors shared by both views.
Insert into numbering gaps without renumbering or reusing existing IDs. Reordering
or moving content preserves IDs and anchors and requires link updates; IDs do not
redirect old URLs. Mirror any folder structure between the two documentation trees.
Entry points, configuration, requirements, assets and historical standalone exports
are exempt from guide numbering. Record legacy coverage gaps explicitly and add
missing mirrors when guides are substantially revised. See the
[documentation policy](005-documentation-policy.md) for namespaces and migration status.

All Gramlot documentation sites share the classic Read the Docs theme illustrated
by Genro Bag: blue header, dark sidebar and light content with default theme
typography. Use `sphinx_rtd_theme` for Sphinx or the `readthedocs` port for MkDocs.
Preserve each project's logo and accurate status notices. This applies to current
and future documentation sites; application UI themes remain a separate concern.

Do not claim an API, implementation, compatibility level, release or verification
before the corresponding artifact and meaningful tests exist in its owning repository.

## 10. Development and acceptance

Across Gramlot, `main` is the consolidated, public reference line for code,
documentation, configuration and other maintained artifacts. `develop` carries new
work until it is verified and accepted, then that work is consolidated into `main`.
Public documentation uses `main` by default; a development preview may follow
`develop` separately. This is a general project rule, not a Read the Docs exception,
and does not itself authorize package publication, releases or deployment.

A port advances
only after its contract, code, tests and paired documentation agree. Relevant server
or database adapters may advance alongside a core increment; acceptance does not
require every host/backend combination in the first slice.

Framework gaps exposed by real Gramlot applications are valuable evidence. They are
resolved in the appropriate reusable layer and are never hidden by application-local
workarounds.

## 11. Amendment record

- **11.1 — 2026-09-16:** Initial clean-repository constitution, consolidated from
  approved owner decisions. No prior product-constitution document is superseded.
- **11.2 — 2026-09-16:** Owner clarified the branch policy in section 10 for all
  Gramlot artifacts: `main` is the consolidated public reference; `develop` holds
  new work until verified and accepted. This supersedes the shorter section 10
  statement, "`main` is the consolidated line; `develop` carries new development."
  Separate publication, release and deployment authorization remains required.
- **11.3 — 2026-09-16:** Owner extended Django's documentation ordering and stable
  reference directive to Gramlot generally. Section 9's generic numbered-reference
  instruction is refined by three-digit guide ordering, repository namespaces,
  shared document/block IDs, explicit anchors and preservation across moves.
  Existing pairing and claim-accuracy requirements remain in force.
- **11.4 — 2026-09-16:** Owner selected the Genro Bag classic Read the Docs
  appearance for all Gramlot documentation. Section 9 now mandates that shared
  theme, superseding the earlier per-repository Material/Furo selections.
